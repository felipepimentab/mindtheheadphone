<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Lista de Recomendações',
  to: '/recomendacoes',
  active: route.path.startsWith('/recomendacoes')
}, {
  label: 'Canal',
  to: 'https://youtube.com/c/mindtheheadphone',
  target: '_blank'
}, {
  label: 'Blog',
  to: 'https://old.mindtheheadphone.com.br',
  target: '_blank'
}]);
</script>

<template>
  <UHeader>
    <template #title>
      <LogoMTH />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>

    <template #right>
      <UNavigationMenu
        :items="items"
        class="hidden lg:block"
      />
      <!-- <UColorModeButton /> -->
    </template>
  </UHeader>
</template>
