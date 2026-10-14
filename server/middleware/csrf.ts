import { createError, defineEventHandler, getMethod, getRequestHeader } from 'h3';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function trustedAdminOrigin() {
  const development = process.env.NODE_ENV === 'development';
  const configured = process.env.NUXT_APP_ORIGIN;

  try {
    if (!configured) throw new Error('Missing origin');
    const url = new URL(configured);
    if (
      !['http:', 'https:'].includes(url.protocol)
      || url.hostname.includes('*')
      || (!development && url.protocol !== 'https:')
      || (configured !== url.origin && configured !== `${url.origin}/`)
    ) throw new Error('Invalid origin');

    return url.origin;
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Invalid NUXT_APP_ORIGIN configuration' });
  }
}

function trustedReferer(value: string | undefined, origin: string) {
  if (!value || !value.startsWith(`${origin}/`) || /[\\\s]/u.test(value)) return false;

  try {
    const url = new URL(value);
    return url.origin === origin && !url.username && !url.password && !url.hash;
  } catch {
    return false;
  }
}

// Every unsafe request is checked before routing, authentication, or body parsing.
export default defineEventHandler((event) => {
  if (SAFE_METHODS.has(getMethod(event))) return;

  const trusted = trustedAdminOrigin();
  const origin = getRequestHeader(event, 'origin');
  const fetchSite = getRequestHeader(event, 'sec-fetch-site');
  const validSource = origin !== undefined
    ? origin === trusted
    : trustedReferer(getRequestHeader(event, 'referer'), trusted);

  if (!validSource || (fetchSite !== undefined && fetchSite !== 'same-origin')) {
    throw createError({ statusCode: 403, statusMessage: 'Request origin is not allowed' });
  }
});
