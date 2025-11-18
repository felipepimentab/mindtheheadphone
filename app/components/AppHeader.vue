<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Recomendações',
  to: '/recomendacoes',
  active: route.path.startsWith('/recomendacoes')
}, {
  label: 'Sobre',
  to: '/sobre',
  active: route.path.startsWith('/sobre'),
  disabled: true
}, {
  label: 'FAQ',
  to: '/faq',
  active: route.path.startsWith('/faq'),
  disabled: true
}, {
  label: 'Blog',
  to: 'https://old.mindtheheadphone.com.br',
  target: '_blank'
}]);
</script>

<template>
  <UHeader mode="slideover">
    <template #title>
      <LogoMTH />
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
      content-orientation="vertical"
    />
    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>

    <template #right>
      <!-- <UColorModeButton /> -->
      <UButton
        color="neutral"
        variant="ghost"
        to="https://youtube.com/c/mindtheheadphone"
        target="_blank"
        trailing-icon="i-lucide-youtube"
        aria-label="Canal no YouTube"
      >
        Canal
      </UButton>
      <UButton
        color="neutral"
        variant="ghost"
        to="https://kuba.audio"
        target="_blank"
        trailing-icon="i-lucide-headphones"
        aria-label="Kuba"
      >
        Kuba
      </UButton>
    </template>
  </UHeader>
</template>
