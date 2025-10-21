<script setup lang="ts">
const features = [
  {
    title: 'Blog',
    description: 'Em 2009, comecei a fazer avaliações de fones de ouvido no orkut e depois criei um blog.',
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
];
</script>

<template>
  <div class="bg-[url('/image/bg-3.png')] bg-cover bg-center p-0">
    <UContainer class="py-16 sm:py-24 lg:py-32">
      <UCard
        variant="soft"
        class="col-span-3 bg-cover bg-center p-0 overflow-visible"
      >
        <div class="lg:flex flex-row-reverse align-bottom justify-center gap-x-4 overflow-visible">
          <UCard
            variant="solid"
            class="bg-transparent"
          >
            <h2 class="text-3xl sm:text-4xl text-pretty tracking-tight font-bold text-highlighted">
              Quem sou eu
            </h2>
            <p class="text-base sm:text-lg text-pretty text-toned mt-6">
              Muito prazer! Meu nome é Leonardo Drummond. Sempre fui apaixonado por música e áudio.
            </p>
            <div class="flex flex-col justify-center items-left">
              <UPageFeature
                v-for="feature in features"
                :key="feature.title"
                :title="feature.title"
                :description="feature.description"
                :icon="feature.icon"
                :to="feature.to"
                target="_blank"
                class="mt-5"
              />
            </div>
          </UCard>
          <div class="lg:w-1/2 shrink-0 flex flex-col justify-center overflow-visible">
            <img
              src="/image/ama.png"
              width="352"
              height="647"
              alt="Leonardo Drummond"
              class="w-full rounded-lg lg:mb-[-1.5rem] lg:mt-[-6rem] overflow-visible"
            >
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
