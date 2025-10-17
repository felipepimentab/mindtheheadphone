<script setup lang="ts">
const links = ref([
  {
    label: 'Lista de Recomendações',
    to: '/recomendacoes'
  }
])
</script>

<template>
  <div
    class="bg-cover bg-center bg-[url('/image/bg-disco.jpg')]"
  >
    <UPageHero
      title="Lista de Recomendações"
      description="Está procurando um fone e não sabe por onde começar? Conheça minha lista de recomendações!"
      orientation="horizontal"
      :links="links"
      class="backdrop-brightness-50"
    />
  </div>
</template>
