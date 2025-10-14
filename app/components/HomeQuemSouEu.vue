<script setup lang="ts">
const features = [
  {
    title: 'Blog',
    description: 'Em 2009, comecei a fazer avaiações de fones de ouvido no orkut e depois criei um blog.',
    icon: 'i-lucide-rss',
    to: 'https://mindtheheadphone.com.br'
  },
  {
    title: 'YouTube',
    description: 'Em 2017 criei um canal no YouTube, que é hoje o maior canal do mundo dedicado a fones de ouvido.',
    icon: 'i-lucide-youtube',
    to: 'https://www.youtube.com/@mindtheheadphone'
  },
  {
    title: 'Kuba',
    description: 'Em 2014, com minha sócia, Eduarda, também fundei a Kuba Audio, a primeira marca brasileira de headphones.',
    icon: 'i-lucide-headphones',
    to: 'https://kuba.audio'
  }
]
</script>

<template>
  <UContainer class="py-16 sm:py-24 lg:py-32 bg-[url('/image/bg-2.png')] bg-cover bg-center bg-blend-darken">
    <UPageCTA
      title="Quem sou eu"
      description="Muito prazer! Meu nome é Leonardo Drummond. Sempre fui apaixonado por música e áudio"
      orientation="horizontal"
      variant="subtle"
      :features="features"
      reverse
      class="bg-default/75 backdrop-blur"
    >
      <!-- <div class="bg-[url('/image/bg-2.png')] bg-cover bg-center bg-blend-darken p-0"> -->
      <div>
        <img
          src="/image/ama.png"
          width="352"
          height="647"
          alt="Illustration"
          class="w-full rounded-lg"
        >
      </div>
      <template #body>
        <UPageFeature
          v-for="feature in features"
          :key="feature.title"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon"
          :to="feature.to"
          target="_blank"
          class="my-4"
        />
      </template>
    </UPageCTA>
  </UContainer>
</template>
