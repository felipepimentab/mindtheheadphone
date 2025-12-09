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
  <UContainer class="py-16 sm:py-24 lg:py-32">
    <UPageCard
      class="overflow-visible"
      spotlight
      spotlight-color="primary"
      orientation="horizontal"
      reverse
    >
      <template #description>
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
            class="mt-3 p-2 rounded-md"
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
      </template>
      <template #default>
        <NuxtImg
          src="/image/ama.png"
          format="webp"
          alt="Leonardo Drummond"
          sizes="sm:400px lg:500 xl:625"
          class="rounded-lg overflow-visible w-[400px] xl:w-[500px] 2xl:w-[625px] mx-auto shrink-0"
        />
      </template>
    </UPageCard>
  </UContainer>
</template>
