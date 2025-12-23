<script lang="ts" setup>
useSeoMeta({
  title: electronicsList.title,
  description: electronicsList.description
});
const deviceCategories = [...electronicsList.categories];
const apiURL = electronicsList.apiUrl;

const title = electronicsList.title;
const description = electronicsList.description;
</script>

<template>
  <div>
    <!-- Background image must be "hard-coded" for pre-rendering -->
    <div class="bg-cover bg-center bg-[url('/image/bg/banner-ciclo.jpg')]">
      <RecommendationsHeader
        :title="title"
        :description="description"
      />
    </div>
    <RecommendationsPage
      :device-categories="deviceCategories"
      :api-url="apiURL"
    />
  </div>
</template>
