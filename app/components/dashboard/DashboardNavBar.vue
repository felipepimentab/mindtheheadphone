<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

// const route = useRoute();

const items: NavigationMenuItem[][] = [[{
  label: 'Headphones',
  icon: 'i-lucide-headphones',
  to: '/admin/headphones'
}, {
  label: 'Earphones',
  icon: 'i-lucide-ear',
  to: '/admin/earphones'
}, {
  label: 'Eletrônicos',
  icon: 'i-lucide-circuit-board',
  to: '/admin/eletronicos'
}, {
  label: 'Adicionar novo',
  icon: 'i-lucide-circle-plus',
  to: '/admin/novo'
}], [{
  label: 'Voltar ao site',
  icon: 'i-lucide-arrow-left-from-line',
  to: '/'
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

    <!-- <template #footer="{ collapsed }">
      <UButton
        :avatar="{
          src: 'https://github.com/benjamincanac.png'
        }"
        :label="collapsed ? undefined : 'Benjamin'"
        color="neutral"
        variant="soft"
        class="w-full"
        :block="collapsed"
      />
    </template> -->
  </UDashboardSidebar>
</template>
