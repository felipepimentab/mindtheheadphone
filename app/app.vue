<script setup>
import { SpeedInsights } from '@vercel/speed-insights/nuxt';
import { Analytics } from '@vercel/analytics/nuxt';

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
    <SpeedInsights />
    <Analytics />
  </NuxtLayout>
</template>
