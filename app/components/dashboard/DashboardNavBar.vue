<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

// const route = useRoute();

const items: NavigationMenuItem[][] = [[{
  label: 'Headphones e Earphones',
  icon: 'i-lucide-headphones',
  defaultOpen: true,
  children: [{
    label: 'Todos',
    to: '/admin/headphones/list'
  }, {
    label: 'Novo',
    to: '/admin/headphones/new'
  }]
}, {
  label: 'Amplificadores e DACs',
  icon: 'i-lucide-circuit-board'
}, {
  label: 'Microfones e Caixas de Som',
  icon: 'i-lucide-speaker'
}], [{
  label: 'GitHub',
  icon: 'i-lucide-github',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}]];
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
      <UButton
        :avatar="{
          src: 'https://github.com/benjamincanac.png'
        }"
        :label="collapsed ? undefined : 'Benjamin'"
        color="neutral"
        variant="ghost"
        class="w-full"
        :block="collapsed"
      />
    </template>
  </UDashboardSidebar>
</template>
