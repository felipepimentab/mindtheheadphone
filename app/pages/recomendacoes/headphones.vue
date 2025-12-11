<script lang="ts" setup>
const deviceCategories = [...headphoneCategories];
const deviceSignatures = [...soundSignatures];
const apiURL = '/api/devices/headphones';

const title = 'Headphones';
const description = 'Abaixo estão os fones de ouvido que mais recomendo, de diferentes tipos e faixas de preço. Basta selecionar a categoria, a assinatura sonora e a faixa de preço desejada.';
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
