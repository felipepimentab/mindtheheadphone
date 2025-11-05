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
    <div class="bg-linear-to-b from-transparent to-default backdrop-brightness-75">
      <UPageHero
        title="Lista de Recomendações"
        orientation="horizontal"
        description="Está procurando um fone e não sabe por onde começar? Conheça minha lista de recomendações!"
        :links="links"
      />
    </div>
  </div>
</template>
