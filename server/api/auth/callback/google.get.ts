import { createError, getCookie, sendRedirect } from 'h3';
import { clearOAuthCookies, getGoogleOAuthConfig, isAdminEmail, OAUTH_REDIRECT_COOKIE, OAUTH_STATE_COOKIE, setAdminSession } from '~~/server/utils/auth';

type GoogleTokenResponse = {
  id_token?: string
};

type GoogleTokenInfo = {
  aud?: string
  email?: string
  email_verified?: string
  name?: string
  picture?: string
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = typeof query.code === 'string' ? query.code : '';
  const state = typeof query.state === 'string' ? query.state : '';
  const storedState = getCookie(event, OAUTH_STATE_COOKIE);
  const redirect = getCookie(event, OAUTH_REDIRECT_COOKIE) || '/admin';
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig(event);

  if (!code || !state || state !== storedState) {
    clearOAuthCookies(event);
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid OAuth callback'
    });
  }

  const tokenResponse = await $fetch<GoogleTokenResponse>('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }).toString()
  });

  if (!tokenResponse.id_token) {
    clearOAuthCookies(event);
    throw createError({
      statusCode: 401,
      statusMessage: 'Google did not return an id token'
    });
  }

  const tokenInfo = await $fetch<GoogleTokenInfo>('https://oauth2.googleapis.com/tokeninfo', {
    query: {
      id_token: tokenResponse.id_token
    }
  });

  if (
    tokenInfo.aud !== clientId
    || tokenInfo.email_verified !== 'true'
    || !isAdminEmail(tokenInfo.email)
  ) {
    clearOAuthCookies(event);
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    });
  }

  setAdminSession(event, {
    email: tokenInfo.email!,
    name: tokenInfo.name,
    picture: tokenInfo.picture
  });
  clearOAuthCookies(event);

  return sendRedirect(event, redirect);
});
