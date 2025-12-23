<script lang="ts" setup>
useSeoMeta({
  title: 'Recomendações',
  description: 'Está procurando um fone e não sabe por onde começar? Conheça minhas listas de recomendações!'
});
</script>

<template>
  <div>
    <div class="bg-cover bg-center bg-[url('/image/bg/earphones.jpg')]">
      <RecommendationsSection
        :title="earphonesList.title"
        :description="earphonesList.description"
        :to="earphonesList.path"
        :inverted="earphonesList.inverted"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/headphones.jpg')]">
      <RecommendationsSection
        :title="headphonesList.title"
        :description="headphonesList.description"
        :to="headphonesList.path"
        :inverted="headphonesList.inverted"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/banner-ciclo.jpg')]">
      <RecommendationsSection
        :title="electronicsList.title"
        :description="electronicsList.description"
        :to="electronicsList.path"
        :inverted="electronicsList.inverted"
      />
    </div>
  </div>
</template>
