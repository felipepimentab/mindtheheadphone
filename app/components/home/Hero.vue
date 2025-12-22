<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui';

const links: ButtonProps[] = [
  {
    label: 'Ver Listas de Recomendações',
    to: '/recomendacoes',
    variant: 'soft',
    size: 'xl'
  }
];
</script>

<template>
  <div
    class="bg-cover bg-center bg-[url('/image/bg-disco.jpg')]"
  >
    <div class="bg-linear-to-b from-transparent to-bgc backdrop-brightness-75">
      <UPageHero
        title="Lista de Recomendações"
        orientation="horizontal"
        description="Está procurando um fone e não sabe por onde começar? Conheça minhas listas de recomendações!"
        :links="links"
        :ui="{
          title: 'text-shadow-[0_0_20px] text-shadow-bgc',
          description: 'text-shadow-[0_0_10px] text-shadow-bgc font-medium'
        }"
      />
    </div>
  </div>
</template>
