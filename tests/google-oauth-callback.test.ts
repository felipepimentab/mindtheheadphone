import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { generateKeyPairSync, sign } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import type { TokenPayload } from 'google-auth-library';
import { createApp, toWebHandler } from 'h3';
import type { $fetch } from 'ofetch';
import callback from '../server/api/auth/callback/google.get';

const origin = 'https://www.example.com';
const clientId = 'test-client.apps.googleusercontent.com';
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const certificate = publicKey.export({ type: 'spki', format: 'pem' }).toString();
const handle = toWebHandler(createApp().use(callback));
const environmentKeys = ['NUXT_OAUTH_GOOGLE_CLIENT_ID', 'NUXT_OAUTH_GOOGLE_CLIENT_SECRET', 'NUXT_SESSION_PASSWORD', 'ADMIN_EMAILS'] as const;
const runtime = globalThis as typeof globalThis & { $fetch: typeof $fetch };
let originalFetch: typeof $fetch;
let originalEnvironment: Record<string, string | undefined>;
let certificates: ReturnType<typeof spyOn<OAuth2Client, 'getFederatedSignonCertsAsync'>>;
let token: string | undefined;
const exchange = mock(async (_url: string, _options?: { body?: string }) => ({ id_token: token }));

function signedToken(patch: Partial<TokenPayload> = {}, key = privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'test-key' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: 'https://accounts.google.com', aud: clientId, sub: 'test-google-user',
    iat: now - 60, exp: now + 3600, email: 'admin@example.com', email_verified: true,
    name: 'Test Admin', picture: 'https://example.com/avatar.png', ...patch
  })).toString('base64url');
  const data = `${header}.${payload}`;
  return `${data}.${sign('RSA-SHA256', Buffer.from(data), key).toString('base64url')}`;
}

function request(query = '?code=test-code&state=test-state', cookies = 'mth_oauth_state=test-state; mth_oauth_redirect=/admin/novo') {
  return handle(new Request(`${origin}/api/auth/callback/google${query}`, {
    headers: { 'cookie': cookies, 'host': new URL(origin).host, 'x-forwarded-proto': 'https' }
  }));
}

function expectNoSession(response: Response) {
  const cookies = response.headers.get('set-cookie') || '';
  expect(cookies).not.toContain('mth_admin_session=');
  expect(cookies).toContain('mth_oauth_state=;');
  expect(cookies).toContain('mth_oauth_redirect=;');
}

beforeEach(() => {
  originalEnvironment = Object.fromEntries(environmentKeys.map(key => [key, process.env[key]]));
  process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID = clientId;
  process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET = 'test-client-secret';
  process.env.NUXT_SESSION_PASSWORD = 'test-session-secret';
  process.env.ADMIN_EMAILS = 'admin@example.com';
  originalFetch = runtime.$fetch;
  runtime.$fetch = exchange as unknown as typeof $fetch;
  exchange.mockClear();
  certificates = spyOn(OAuth2Client.prototype, 'getFederatedSignonCertsAsync').mockResolvedValue({
    certs: { 'test-key': certificate }, format: 'PEM'
  });
  token = signedToken();
});

afterEach(() => {
  runtime.$fetch = originalFetch;
  certificates.mockRestore();
  for (const key of environmentKeys) {
    const value = originalEnvironment[key];
    if (value === undefined) Reflect.deleteProperty(process.env, key);
    else process.env[key] = value;
  }
});

describe('Google OAuth callback with library verification', () => {
  test('creates a session for a correctly signed allowed identity and retains the redirect', async () => {
    const response = await request();
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('/admin/novo');
    const cookies = response.headers.get('set-cookie') || '';
    const session = cookies.match(/mth_admin_session=([^;]+)/)?.[1];
    expect(session).toBeDefined();
    const payload = JSON.parse(Buffer.from(session!.split('.')[0]!, 'base64url').toString());
    expect(payload.user).toEqual({ email: 'admin@example.com', name: 'Test Admin', picture: 'https://example.com/avatar.png' });
    expect(cookies).toContain('mth_oauth_state=;');
    expect(cookies).toContain('mth_oauth_redirect=;');
    expect(exchange).toHaveBeenCalledTimes(1);
    expect(exchange.mock.calls[0]?.[0]).toBe('https://oauth2.googleapis.com/token');
    const body = new URLSearchParams(exchange.mock.calls[0]?.[1]?.body);
    expect(body.get('redirect_uri')).toBe(`${origin}/api/auth/callback/google`);
    expect(certificates).toHaveBeenCalledTimes(1);
  });

  test('rejects an invalid signature without exposing the token or issuing a session', async () => {
    const attacker = generateKeyPairSync('rsa', { modulusLength: 2048 });
    token = signedToken({}, attacker.privateKey);
    const response = await request();
    expect(response.status).toBe(401);
    expectNoSession(response);
    expect(await response.text()).not.toContain(token);
  });

  test('rejects wrong issuer, wrong audience, expired, premature, and malformed tokens', async () => {
    const now = Math.floor(Date.now() / 1000);
    for (const invalid of [
      signedToken({ iss: 'https://attacker.example' }),
      signedToken({ aud: 'another-client' }),
      signedToken({ iat: now - 3600, exp: now - 600 }),
      signedToken({ iat: now + 600 }),
      'not-a-jwt'
    ]) {
      token = invalid;
      const response = await request();
      expect(response.status).toBe(401);
      expectNoSession(response);
      expect(await response.text()).not.toContain(invalid);
    }
  });

  test('retains verified-email and admin-allowlist checks after token verification', async () => {
    for (const patch of [{ email_verified: false }, { email: 'other@example.com' }, { email: undefined }]) {
      token = signedToken(patch);
      const response = await request();
      expect(response.status).toBe(403);
      expectNoSession(response);
    }
  });

  test('rejects state mismatches before token exchange or certificate retrieval', async () => {
    const response = await request('?code=test-code&state=wrong-state');
    expect(response.status).toBe(400);
    expectNoSession(response);
    expect(exchange).not.toHaveBeenCalled();
    expect(certificates).not.toHaveBeenCalled();
  });

  test('rejects a missing ID token before certificate retrieval', async () => {
    token = undefined;
    const response = await request();
    expect(response.status).toBe(401);
    expectNoSession(response);
    expect(certificates).not.toHaveBeenCalled();
  });

  test('fails closed when signing certificates cannot be retrieved', async () => {
    certificates.mockRejectedValue(new Error('Certificate service unavailable'));
    const response = await request();
    expect(response.status).toBe(401);
    expectNoSession(response);
    expect(await response.text()).not.toContain('Certificate service unavailable');
  });
});
