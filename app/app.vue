<script setup>
import { SpeedInsights } from '@vercel/speed-insights/nuxt';
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <SpeedInsights />
    <Analytics />
  </NuxtLayout>
</template>
