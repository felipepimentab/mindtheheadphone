import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { H3Event } from 'h3';
import { createError, deleteCookie, getCookie, setCookie } from 'h3';

const SESSION_COOKIE = 'mth_admin_session';
export const OAUTH_STATE_COOKIE = 'mth_oauth_state';
export const OAUTH_REDIRECT_COOKIE = 'mth_oauth_redirect';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const OAUTH_COOKIE_MAX_AGE = 60 * 10;

type AdminUser = {
  email: string
  name?: string
  picture?: string
};

type AdminSession = {
  user: AdminUser
  exp: number
};

type CookieOptions = NonNullable<Parameters<typeof setCookie>[3]>;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/'
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw createError({
      statusCode: 500,
      statusMessage: `${name} is not configured`
    });
  }

  return value;
}

function getSessionSecret() {
  return getRequiredEnv('NUXT_SESSION_PASSWORD');
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(payload: string) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

function createSignedSession(session: AdminSession) {
  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

function verifySignedSession(value?: string) {
  if (!value) return null;

  const [payload, signature] = value.split('.');
  if (!payload || !signature) return null;

  const expectedSignature = signPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length
    || !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(base64UrlDecode(payload)) as AdminSession;
    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function getGoogleOAuthConfig(event: H3Event) {
  const origin = getRequestURL(event).origin;

  return {
    clientId: getRequiredEnv('NUXT_OAUTH_GOOGLE_CLIENT_ID'),
    clientSecret: getRequiredEnv('NUXT_OAUTH_GOOGLE_CLIENT_SECRET'),
    redirectUri: `${origin}/api/auth/callback/google`
  };
}

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string) {
  if (!email) return false;

  return getAdminEmails().includes(email.toLowerCase());
}

export function createOAuthState() {
  return randomBytes(32).toString('base64url');
}

export function sanitizeAdminRedirect(redirect?: string | string[]) {
  const value = Array.isArray(redirect) ? redirect[0] : redirect;
  if (!value || !value.startsWith('/admin') || value.startsWith('//') || value === '/admin/login') {
    return '/admin';
  }

  return value;
}

export function setOAuthCookie(event: H3Event, name: string, value: string) {
  setCookie(event, name, value, {
    ...cookieOptions,
    maxAge: OAUTH_COOKIE_MAX_AGE
  });
}

export function clearOAuthCookies(event: H3Event) {
  deleteCookie(event, OAUTH_STATE_COOKIE, cookieOptions);
  deleteCookie(event, OAUTH_REDIRECT_COOKIE, cookieOptions);
}

export function setAdminSession(event: H3Event, user: AdminUser) {
  const session: AdminSession = {
    user,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
  };

  setCookie(event, SESSION_COOKIE, createSignedSession(session), {
    ...cookieOptions,
    maxAge: SESSION_MAX_AGE
  });
}

export function clearAdminSession(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE, cookieOptions);
}

export function getAdminSession(event: H3Event) {
  return verifySignedSession(getCookie(event, SESSION_COOKIE));
}

export async function requireAdmin(event: H3Event) {
  const session = getAdminSession(event);
  if (!session?.user?.email) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    });
  }

  if (!isAdminEmail(session.user.email)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    });
  }

  return session;
}
