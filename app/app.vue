<script setup>
const title = 'Mind the Headphone';
const description = 'O maior canal dedicado a fones de ouvido do mundo.';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/image/og-mth.png',
  twitterImage: '/image/og-mth.png',
  twitterCard: 'summary_large_image'
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
