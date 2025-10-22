<script setup lang="ts">
const links = ref([
  {
    label: 'Lista de Recomendações',
    to: '/recomendacoes'
  }
]);
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
