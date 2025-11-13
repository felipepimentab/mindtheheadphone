<script setup lang="ts">
const title = 'Quem sou eu';
const description = 'Muito prazer! Meu nome é Leonardo Drummond. Sempre fui apaixonado por música e áudio.';
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
      <div class="rounded-lg bg-elevated/50 backdrop-blur backdrop-brightness-75 p-0 overflow-visible grid grid-cols-1 grid-rows-[auto_auto] lg:grid-cols-[auto_1fr] lg:grid-rows-1 lg:h-[450px] xl:h-[550px] inset-shadow-sm inset-shadow-white/5">
        <UCard
          variant="solid"
          class="bg-transparent lg:order-2"
        >
          <h2 class="text-3xl sm:text-4xl xl:text-6xl text-pretty tracking-tight font-bold text-highlighted">
            {{ title }}
          </h2>
          <p class="text-base sm:text-lg xl:text-xl text-pretty text-toned mt-6">
            {{ description }}
          </p>
          <div class="flex flex-col justify-center items-left">
            <UPageFeature
              v-for="feature in features"
              :key="feature.title"
              :icon="feature.icon"
              :to="feature.to"
              target="_blank"
              class="mt-3 p-2 rounded-md hover:bg-accented/30 transition-colors"
            >
              <template #leading>
                <Icon
                  :name="feature.icon"
                  class="text-primary size-5 xl:size-6"
                />
              </template>
              <template #title>
                <span class="lg:text-lg xl:text-xl">
                  {{ feature.title }}
                </span>
              </template>
              <template #description>
                <span class="text-toned lg:text-base/6 xl:text-lg/6">
                  {{ feature.description }}
                </span>
              </template>
            </UPageFeature>
          </div>
        </UCard>
        <div class="p-4 sm:p-6 lg:py-0 lg:pr-0 shrink-0 overflow-visible lg:order-1">
          <NuxtImg
            src="/image/ama.png"
            format="webp"
            alt="Leonardo Drummond"
            sizes="sm:400px lg:500 xl:625"
            class="rounded-lg overflow-visible max-sm:w-full sm:h-[400px] lg:h-[500px] lg:mt-[-50px] xl:h-[625px] xl:mt-[-75px] mx-auto bottom-0"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>
