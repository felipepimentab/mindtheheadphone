<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui';

// const route = useRoute();

type AdminSessionResponse = {
  user: {
    email: string
    name?: string
    picture?: string
  } | null
};

const items: NavigationMenuItem[][] = [[{
  label: 'Ver todos',
  icon: 'i-lucide-headphones',
  to: '/admin'
}, {
  label: 'Adicionar novo',
  icon: 'i-lucide-circle-plus',
  to: '/admin/novo'
}], [{
  label: 'Voltar ao site',
  icon: 'i-lucide-arrow-left-from-line',
  to: '/'
}]];
const { data: session } = await useFetch<AdminSessionResponse>('/api/auth/session', {
  default: () => ({ user: null })
});
const userLabel = computed(() => session.value.user?.name || session.value.user?.email || 'Admin');
const userDescription = computed(() => {
  if (!session.value.user?.email || session.value.user.email === userLabel.value) return undefined;

  return session.value.user.email;
});
const userAvatar = computed(() => {
  const user = session.value.user;

  return {
    src: user?.picture,
    alt: user?.name || user?.email || 'Admin'
  };
});
const userMenuItems = computed<DropdownMenuItem[][]>(() => [[{
  label: userLabel.value,
  avatar: userAvatar.value,
  type: 'label'
}], [{
  label: 'Sair',
  icon: 'i-lucide-log-out',
  onSelect: logout
}]]);

async function logout() {
  await $fetch('/api/auth/logout', {
    method: 'POST'
  });
  await navigateTo('/admin/login');
}
</script>

<template>
  <UDashboardSidebar
    :ui="{ footer: 'border-t border-default' }"
    :default-size="18"
    :min-size="16"
    resizable
    collapsible
  >
    <template #header="{ collapsed }">
      <router-link to="/">
        <LogoMTH
          v-if="!collapsed"
          class="w-auto"
        />
        <UIcon
          v-else
          name="i-lucide-headphones"
          class="size-5 text-primary mx-auto"
        />
      </router-link>
    </template>

    <template #default="{ collapsed }">
      <!-- <UButton
        :label="collapsed ? undefined : 'Search...'"
        icon="i-lucide-search"
        color="neutral"
        variant="outline"
        block
        :square="collapsed"
      >
        <template
          v-if="!collapsed"
          #trailing
        >
          <div class="flex items-center gap-0.5 ms-auto">
            <UKbd
              value="meta"
              variant="subtle"
            />
            <UKbd
              value="K"
              variant="subtle"
            />
          </div>
        </template>
      </UButton> -->

      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[0]"
        orientation="vertical"
      />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[1]"
        orientation="vertical"
        class="mt-auto"
      />
    </template>

    <template #footer="{ collapsed }">
      <UDropdownMenu
        :items="userMenuItems"
        :content="{ align: 'start', side: 'right' }"
      >
        <UButton
          :avatar="userAvatar"
          :label="collapsed ? undefined : userLabel"
          :description="collapsed ? undefined : userDescription"
          color="neutral"
          variant="ghost"
          class="w-full justify-start"
          :block="collapsed"
        />
      </UDropdownMenu>
    </template>
  </UDashboardSidebar>
</template>
