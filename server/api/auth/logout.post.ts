import { clearAdminSession } from '~~/server/utils/auth';

export default defineEventHandler((event) => {
  clearAdminSession(event);

  return {
    loggedOut: true
  };
});
