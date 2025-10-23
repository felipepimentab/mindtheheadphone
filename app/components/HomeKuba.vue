<script setup lang="ts">
const items = [
  '/image/kuba/disco-2-bt.jpg',
  '/image/kuba/disco-2-classico.jpg',
  '/image/kuba/disco-2-pro.jpg',
  '/image/kuba/nia.jpg',
  '/image/kuba/uni.jpg',
  '/image/kuba/mali-2.jpg'
];
const alt = [
  'Headphone Kuba Disco 2 Bluetooth',
  'Headphone Kuba Disco 2 Clássico',
  'Headphone Kuba Disco 2 Pro',
  'Headphone Kuba Nia',
  'Headphone Kuba Uni',
  'Headphone Kuba Mali 2'
];

const carousel = useTemplateRef('carousel');
const activeIndex = ref(0);

function onSelect(index: number) {
  activeIndex.value = index;
}

function select(index: number) {
  activeIndex.value = index;

  carousel.value?.emblaApi?.scrollTo(index);
}
</script>

<template>
  <UPageSection
    title="Kuba Audio: Minha marca de fones"
    orientation="horizontal"
    class="bg-muted"
  >
    <div>
      <UCarousel
        ref="carousel"
        v-slot="{ item }"
        :items="items"
        class="w-full mx-auto"
        @select="onSelect"
      >
        <NuxtImg
          :src="item"
          width="640"
          height="640"
          class="rounded-lg"
          loading="lazy"
        />
      </UCarousel>
      <UButton
        to="https://kuba.audio"
        color="success"
        variant="subtle"
        target="_blank"
        size="xl"
        class="w-fit lg:hidden mt-8"
      >
        Conheça
      </UButton>
    </div>

    <template #description>
      <h4 class="my-3 text-2xl font-bold">
        A Primeira Marca Brasileira de Headphones
      </h4>
      <p class="my-3 text-highlighted">
        A Kuba Audio é uma marca criada por mim e pela minha sócia, a Eduarda, em 2016.
        <span class="font-black">
          Desenvolvemos fones de ouvido de alta fidelidade, totalmente modulares e feitos para durar.
        </span>
      </p>
      <p class="my-3 text-highlighted">
        Até hoje, já ultrapassamos 40.000 unidades vendidas, conquistando não só o público geral como o profissional e o entusiasta.
      </p>
    </template>

    <template #body>
      <div class="flex justify-start gap-2 pt-4">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="size-16 opacity-25 hover:opacity-100 transition-opacity"
          :class="{ 'opacity-100': activeIndex === index }"
          @click="select(index)"
        >
          <NuxtImg
            :src="item"
            :alt="alt[index]"
            width="64"
            height="64"
            class="rounded-lg cursor-pointer"
            loading="lazy"
          />
        </div>
      </div>
      <UButton
        to="https://kuba.audio"
        color="success"
        variant="subtle"
        target="_blank"
        size="xl"
        class="max-lg:hidden mt-8"
      >
        Conheça
      </UButton>
    </template>
  </UPageSection>
</template>
