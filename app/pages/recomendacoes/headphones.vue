<script lang="ts" setup>
const deviceCategories = [...headphonesList.categories];
const deviceSignatures = [...soundSignatures];
const apiURL = headphonesList.apiUrl;

const title = headphonesList.title;
const description = headphonesList.description;
</script>

<template>
  <div>
    <!-- Background image must be "hard-coded" for pre-rendering -->
    <div class="bg-cover bg-center bg-[url('/image/bg/headphones.jpg')]">
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
