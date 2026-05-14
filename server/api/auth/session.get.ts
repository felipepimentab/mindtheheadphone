import { getAdminSession } from '~~/server/utils/auth';

export default defineEventHandler((event) => {
  const session = getAdminSession(event);

  return {
    user: session?.user || null
  };
});
