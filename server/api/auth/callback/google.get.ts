import { OAuth2Client } from 'google-auth-library';
import type { TokenPayload } from 'google-auth-library';
import { createError, defineEventHandler, getCookie, getQuery, sendRedirect } from 'h3';
import { clearOAuthCookies, getGoogleOAuthConfig, isAdminEmail, OAUTH_REDIRECT_COOKIE, OAUTH_STATE_COOKIE, setAdminSession } from '../../../utils/auth';

// Reuse the client so Google's signing certificates can be cached between logins.
const googleOAuthClient = new OAuth2Client();

type GoogleTokenResponse = {
  id_token?: string
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

  let tokenInfo: TokenPayload | undefined;
  try {
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: tokenResponse.id_token,
      audience: clientId
    });
    tokenInfo = ticket.getPayload();
  } catch {
    clearOAuthCookies(event);
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid Google identity token'
    });
  }

  if (
    !tokenInfo
    || tokenInfo.email_verified !== true
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
