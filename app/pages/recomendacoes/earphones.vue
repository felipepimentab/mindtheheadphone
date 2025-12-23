<script lang="ts" setup>
useSeoMeta({
  title: earphonesList.title,
  description: earphonesList.description
});
const deviceCategories = [...earphonesList.categories];
const deviceSignatures = [...soundSignatures];
const apiURL = earphonesList.apiUrl;

const title = earphonesList.title;
const description = earphonesList.description;
</script>

<template>
  <div>
    <!-- Background image must be "hard-coded" for pre-rendering -->
    <div class="bg-cover bg-center bg-[url('/image/bg/earphones.jpg')]">
      <RecommendationsHeader
        :title="title"
        :description="description"
      />
    </div>
    <RecommendationsPage
      :device-categories="deviceCategories"
      :device-signatures="deviceSignatures"
      :api-url="apiURL"
    />
  </div>
</template>
