<script lang="ts" setup>
definePageMeta({
  layout: false
});

type AdminSessionResponse = {
  user: {
    email: string
  } | null
};

const route = useRoute();
const requestFetch = useRequestFetch();
const redirect = computed(() => {
  const value = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin';
  if (!value.startsWith('/admin') || value === '/admin/login') return '/admin';

  return value;
});
const loginUrl = computed(() => `/api/auth/login?redirect=${encodeURIComponent(redirect.value)}`);
const { data: session } = await useAsyncData('admin-login-session', () => requestFetch<AdminSessionResponse>('/api/auth/session'));

if (session.value?.user) {
  await navigateTo(redirect.value);
}
</script>

<template>
  <UApp>
    <main class="flex min-h-dvh items-center justify-center bg-default p-6">
      <section class="w-full max-w-sm rounded-lg border border-default p-6">
        <div class="mb-6">
          <LogoMTH class="mb-6 h-auto w-fit" />
          <h1 class="text-xl font-semibold text-highlighted">
            Acessar administração
          </h1>
          <p class="mt-2 text-sm text-muted">
            Entre com uma conta Google autorizada para gerenciar os dispositivos.
          </p>
        </div>

        <UButton
          :to="loginUrl"
          icon="i-simple-icons-google"
          color="neutral"
          variant="soft"
          size="lg"
          block
          external
        >
          Entrar com Google
        </UButton>
      </section>
    </main>
  </UApp>
</template>
