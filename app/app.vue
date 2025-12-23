<script setup>
import { SpeedInsights } from '@vercel/speed-insights/nuxt';
import { Analytics } from '@vercel/analytics/nuxt';

useSchemaOrg([
  definePerson({
    '@id': '#leonardo-drummond',
    'name': 'Leonardo Drummond',
    'jobTitle': 'Criador de Conteúdo',
    'sameAs': ['https://www.linkedin.com/in/leonardodrummond/', 'https://www.instagram.com/mind.the.headphone/'],
    'affiliation': {
      '@id': '#identity'
    }
  })
]);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <SpeedInsights />
    <Analytics />
  </NuxtLayout>
</template>
