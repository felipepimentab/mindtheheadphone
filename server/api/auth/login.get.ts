import { sendRedirect } from 'h3';
import { createOAuthState, getGoogleOAuthConfig, OAUTH_REDIRECT_COOKIE, OAUTH_STATE_COOKIE, sanitizeAdminRedirect, setOAuthCookie } from '~~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const { clientId, redirectUri } = getGoogleOAuthConfig(event);
  const query = getQuery(event);
  const state = createOAuthState();
  const redirect = sanitizeAdminRedirect(query.redirect as string | string[] | undefined);
  const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  authorizationUrl.searchParams.set('client_id', clientId);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid email profile');
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('prompt', 'select_account');

  setOAuthCookie(event, OAUTH_STATE_COOKIE, state);
  setOAuthCookie(event, OAUTH_REDIRECT_COOKIE, redirect);

  return sendRedirect(event, authorizationUrl.toString());
});
