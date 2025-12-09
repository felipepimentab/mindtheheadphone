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
        variant="link"
        to="https://youtube.com/c/mindtheheadphone"
        target="_blank"
        trailing-icon="i-lucide-youtube"
        aria-label="Canal no YouTube"
      >
        <span class="max-sm:hidden">
          Canal
        </span>
      </UButton>
      <UButton
        color="neutral"
        variant="link"
        to="https://kuba.audio"
        target="_blank"
        trailing-icon="i-lucide-headphones"
        aria-label="Kuba"
      >
        <span class="max-sm:hidden">
          Kuba
        </span>
      </UButton>
    </template>
  </UHeader>
</template>
