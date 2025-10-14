<script setup lang="ts">
const videos = [
  {
    title: 'In-Ear',
    alt: 'In-Ear',
    image: '/image/prancheta/in-ear.png',
    url: 'https://www.youtube.com/playlist?list=PLdSEUYEDTO1Mu3_cPywcP9Dx2UOxXdCEP'
  },
  {
    title: 'Headphones',
    alt: 'Headphones',
    image: '/image/prancheta/headphone.png',
    url: 'https://www.youtube.com/playlist?list=PLdSEUYEDTO1Piia9bmQGc_gnatMBeox5-'
  },
  {
    title: 'Amplificadores e DACs',
    alt: 'Amplificadores e DACs',
    image: '/image/prancheta/dac.png',
    url: 'https://www.youtube.com/playlist?list=PLdSEUYEDTO1MAW8LP3bIXV6tgWaAKVOtl'
  },
  {
    title: 'Artigos Técnicos',
    alt: 'Artigos Técnicos',
    image: '/image/prancheta/tecnicos.png',
    url: 'https://www.youtube.com/playlist?list=PLdSEUYEDTO1OBSLocvT9bxnAMhBBXafq_'
  },
  {
    title: 'Unboxings',
    alt: 'Unboxings',
    image: '/image/prancheta/unboxing.png',
    url: 'https://www.youtube.com/playlist?list=PLdSEUYEDTO1PKMCtH285IbSyY3EnnO-BR'
  },
  {
    title: 'Q&As',
    alt: 'Q&A',
    image: '/image/prancheta/faq.png',
    url: 'https://www.youtube.com/playlist?list=PLdSEUYEDTO1Oq6uaeWGdHE8rF1q_KUdBz'
  },
  {
    title: 'Caixas de Som',
    alt: 'Caixas de Som',
    image: '/image/prancheta/speaker.png',
    url: 'https://www.youtube.com/playlist?list=PLdSEUYEDTO1MUX8ILJnYf8DITcirt4N_l'
  },
  {
    title: 'Mind The Technology',
    alt: 'Mind The Technology',
    image: '/image/prancheta/tech.png',
    url: 'https://www.youtube.com/playlist?list=PLdSEUYEDTO1OA3ufEcheqwG2KfIRHHVG_'
  }
]
</script>

<template>
  <UContainer class="py-16 bg-elevated bg-[url('/image/bg-2.png')]">
    <ui-text
      type="h2"
      class="pb-8 text-center"
    >
      Mais vídeos
    </ui-text>
    <UPageGrid class="grid-cols-2 lg:grid-cols-4">
      <UCard
        v-for="item in videos"
        :key="item.title"
        variant="outline"
        class="bg-cover bg-center bg-blend-darken light:bg-blend-lighten"
      >
        <div
          class="flex flex-col items-center justify-center gap-4"
        >
          <img
            :src="item.image"
            :alt="item.alt"
            class="w-full rounded-md light:invert"
          >

          <h4 class="text-lg font-bold text-center">
            {{ item.title }}
          </h4>

          <UButton
            :to="item.url"
            target="_blank"
            color="primary"
          >
            Ver Playlist
          </UButton>
        </div>
      </UCard>
    </UPageGrid>
  </UContainer>
</template>
