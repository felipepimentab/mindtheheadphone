<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui';

const links: ButtonProps[] = [
  {
    label: 'Lista de Recomendações',
    to: '/recomendacoes',
    variant: 'subtle',
    size: 'xl'
  }
];
</script>

<template>
  <div
    class="bg-cover bg-center bg-[url('/image/bg-disco.jpg')]"
  >
    <div class="bg-gradient-to-b from-transparent to-default">
      <UPageHero
        title="Lista de Recomendações"
        orientation="horizontal"
        :links="links"
      >
        <template #description>
          <p class="text-highlighted">
            Está procurando um fone e não sabe por onde começar? Conheça minha lista de recomendações!
          </p>
        </template>
      </UPageHero>
    </div>
  </div>
</template>
