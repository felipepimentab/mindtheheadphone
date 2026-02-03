<script setup>
import { SpeedInsights } from '@vercel/speed-insights/nuxt';
import { Analytics } from '@vercel/analytics/nuxt';

useSchemaOrg([
  definePerson({
    '@id': '#leonardo-drummond',
    'name': 'Leonardo Drummond',
    'jobTitle': 'Especialista em Áudio e Criador de Conteúdo',
    'sameAs': ['https://www.linkedin.com/in/leonardodrummond/', 'https://www.instagram.com/mind.the.headphone/'],
    'affiliation': {
      '@id': '#identity'
    },
    'image': '/image/ama.png'
  }),
  defineWebSite({
    name: 'Mind the Headphone',
    url: 'https://www.mindtheheadphone.com.br',
    // Isso ajuda o Google a entender que há uma função de busca no site
    potentialAction: [
      {
        '@type': 'SearchAction',
        'target': 'https://www.mindtheheadphone.com.br/busca?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    ]
  }),
  defineItemList({
    '@id': '#primary-navigation',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Recomendações', 'url': 'https://www.mindtheheadphone.com.br/recomendacoes' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Earphones', 'url': 'https://www.mindtheheadphone.com.br/recomendacoes/earphones' },
      { '@type': 'ListItem', 'position': 3, 'name': 'Headphones', 'url': 'https://www.mindtheheadphone.com.br/recomendacoes/headphones' },
      { '@type': 'ListItem', 'position': 4, 'name': 'Eletrônicos', 'url': 'https://www.mindtheheadphone.com.br/recomendacoes/eletronicos' }
    ]
  })
]);

useSeoMeta({
  titleTemplate: '%s | Mind the Headphone'
});

useBreadcrumbItems();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <SpeedInsights />
    <Analytics />
  </NuxtLayout>
</template>
