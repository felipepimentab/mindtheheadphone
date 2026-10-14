type AdminSessionResponse = {
  user: {
    email: string
    name?: string
    picture?: string
  } | null
};

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') return;

  try {
    const requestFetch = useRequestFetch();
    const session = await requestFetch<AdminSessionResponse>('/api/auth/session');

    if (session.user) return;
  } catch {
    // Fall through to the login redirect.
  }

  return navigateTo({
    path: '/admin/login',
    query: {
      redirect: to.fullPath
    }
  });
});
