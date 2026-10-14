import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { createApp, defineEventHandler, toWebHandler } from 'h3';
import csrf from '../server/middleware/csrf';

const trusted = 'https://www.mindtheheadphone.com.br';
const environmentKeys = ['NODE_ENV', 'NUXT_APP_ORIGIN'] as const;
const originalEnvironment = Object.fromEntries(environmentKeys.map(key => [key, process.env[key]]));
let reachedHandler: boolean;
const app = createApp().use(csrf).use(defineEventHandler(() => {
  reachedHandler = true;
  return { accepted: true };
}));
const handle = toWebHandler(app);

function request(headers: Record<string, string> = {}, method = 'POST', path = '/api/devices') {
  return handle(new Request(`${trusted}${path}`, { method, headers }));
}

beforeEach(() => {
  process.env.NODE_ENV = 'production';
  process.env.NUXT_APP_ORIGIN = trusted;
  reachedHandler = false;
});

afterEach(() => {
  for (const key of environmentKeys) {
    const value = originalEnvironment[key];
    if (value === undefined) Reflect.deleteProperty(process.env, key);
    else process.env[key] = value;
  }
});

describe('central CSRF protection', () => {
  test('permits exact same-origin mutations with or without Fetch Metadata', async () => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      for (const headers of [{ origin: trusted }, { 'origin': trusted, 'sec-fetch-site': 'same-origin' }]) {
        expect((await request(headers, method)).status).toBe(200);
      }
    }
    expect(reachedHandler).toBe(true);
  });

  test('rejects foreign and ambiguous origins even with a trusted Referer', async () => {
    for (const origin of [
      'https://attacker.example', 'https://old.mindtheheadphone.com.br',
      'https://mindtheheadphone.com.br', 'http://www.mindtheheadphone.com.br',
      `${trusted}:8443`, `${trusted}.attacker.example`, `${trusted}/`, `${trusted}/admin`,
      `${trusted}?query`, `${trusted}#hash`, 'https://user@www.mindtheheadphone.com.br',
      'https://attacker.example@www.mindtheheadphone.com.br',
      `${trusted}, https://attacker.example`, `${trusted} https://attacker.example`,
      '//www.mindtheheadphone.com.br', 'https:\\www.mindtheheadphone.com.br', 'null', ''
    ]) {
      const response = await request({ origin, referer: `${trusted}/admin` });
      expect(response.status).toBe(403);
    }
    expect(reachedHandler).toBe(false);
  });

  test('allows a same-origin Referer only when Origin is absent', async () => {
    expect((await request({ referer: `${trusted}/admin/novo?return=%2Fadmin` })).status).toBe(200);
    expect((await request({ 'referer': `${trusted}/`, 'sec-fetch-site': 'same-origin' })).status).toBe(200);
  });

  test('rejects missing, malformed and foreign Referer values', async () => {
    for (const referer of [
      undefined, '', 'null', '/admin', '//www.mindtheheadphone.com.br/admin',
      'https://old.mindtheheadphone.com.br/admin', `${trusted}.attacker.example/admin`,
      `${trusted}:8443/admin`, `${trusted}/admin#fragment`, `${trusted}/\\attacker.example`,
      'https://user@www.mindtheheadphone.com.br/admin',
      'https://www.mindtheheadphone.com.br@attacker.example/admin',
      `${trusted}/admin ${trusted}/admin`
    ]) {
      const headers: Record<string, string> = { 'sec-fetch-site': 'same-origin' };
      if (referer !== undefined) headers.referer = referer;
      expect((await request(headers)).status).toBe(403);
    }
    expect(reachedHandler).toBe(false);
  });

  test('rejects conflicting or malformed Fetch Metadata without using it as authorization', async () => {
    for (const fetchSite of ['cross-site', 'same-site', 'none', '', 'same-origin, cross-site']) {
      expect((await request({ 'origin': trusted, 'sec-fetch-site': fetchSite })).status).toBe(403);
    }
    expect((await request({ 'sec-fetch-site': 'same-origin' })).status).toBe(403);
    expect(reachedHandler).toBe(false);
  });

  test('preserves public reads, session reads and the cross-site OAuth callback', async () => {
    for (const path of ['/api/devices', '/api/auth/session', '/api/auth/login', '/api/auth/callback/google?code=test&state=test']) {
      for (const method of ['GET', 'HEAD', 'OPTIONS']) {
        expect((await request({ 'sec-fetch-site': 'cross-site', 'origin': 'https://accounts.google.com' }, method, path)).status).toBe(200);
      }
    }
  });

  test('uses only the configured origin, ignoring request and forwarded hosts', async () => {
    process.env.NUXT_APP_ORIGIN = 'https://staging.example.com/';
    expect((await request({ origin: 'https://staging.example.com' })).status).toBe(200);
    reachedHandler = false;
    expect((await request({ 'origin': trusted, 'host': 'www.mindtheheadphone.com.br', 'x-forwarded-host': 'www.mindtheheadphone.com.br', 'x-forwarded-proto': 'https' })).status).toBe(403);
    expect(reachedHandler).toBe(false);
  });

  test('fails closed on invalid configuration and requires HTTPS outside development', async () => {
    for (const configured of ['', 'null', '*', 'https://*.example.com', '//example.com',
      `${trusted}/admin`, `${trusted}/?query`, `${trusted}/#fragment`,
      'https://user@www.mindtheheadphone.com.br', 'http://localhost:3000']) {
      process.env.NUXT_APP_ORIGIN = configured;
      expect((await request({ origin: trusted })).status).toBe(500);
    }
    expect(reachedHandler).toBe(false);
  });

  test('requires explicit valid configuration in every environment before any mutation', async () => {
    for (const environment of ['production', 'development', 'test']) {
      process.env.NODE_ENV = environment;
      for (const configured of [undefined, '', 'not-an-origin', `${trusted}/admin`]) {
        if (configured === undefined) delete process.env.NUXT_APP_ORIGIN;
        else process.env.NUXT_APP_ORIGIN = configured;
        for (const [method, path] of [
          ['POST', '/api/devices'], ['PUT', '/api/devices/test'],
          ['PATCH', '/api/devices/test'], ['DELETE', '/api/devices/test'],
          ['POST', '/api/auth/logout']
        ] as const) {
          expect((await request({ origin: trusted }, method, path)).status).toBe(500);
          expect(reachedHandler).toBe(false);
        }
      }
    }
  });

  test('preserves reads and OAuth callbacks when origin configuration is missing', async () => {
    delete process.env.NUXT_APP_ORIGIN;
    for (const path of ['/api/devices', '/api/auth/session', '/api/auth/callback/google']) {
      expect((await request({}, 'GET', path)).status).toBe(200);
    }
  });

  test('supports an explicitly configured HTTP development origin and port', async () => {
    process.env.NODE_ENV = 'development';
    process.env.NUXT_APP_ORIGIN = 'http://localhost:3000';
    expect((await request({ origin: 'http://localhost:3000' })).status).toBe(200);
    process.env.NUXT_APP_ORIGIN = 'http://127.0.0.1:3001';
    expect((await request({ origin: 'http://127.0.0.1:3001' })).status).toBe(200);
    expect((await request({ origin: 'http://127.0.0.1:3000' })).status).toBe(403);
  });
});
