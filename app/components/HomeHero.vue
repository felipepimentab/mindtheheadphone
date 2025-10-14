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
    class="bg-cover bg-center"
    style="background-image: url('/image/BSS7518.jpg');"
  >
    <UPageHero
      title="Lista de Recomendações"
      description="Está procurando um fone e não sabe por onde começar? Conheça minha lista de recomendações!"
      orientation="horizontal"
      :links="links"
      class="backdrop-brightness-50"
    >
      <!-- <img
        src="~/assets/image/BSS7518.jpg"
        alt="App screenshot"
        class="rounded-lg shadow-2xl ring ring-default"
      > -->
    </UPageHero>
  </div>
</template>
