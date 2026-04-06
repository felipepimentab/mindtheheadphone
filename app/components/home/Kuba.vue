<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui';

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
const links: ButtonProps[] = [
  {
    label: 'Conhecer a Kuba',
    variant: 'soft',
    color: 'primary',
    size: 'xl',
    to: 'https://kuba.audio',
    target: '_blank',
    trailingIcon: 'i-lucide-external-link'
  }
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

const THUMBNAIL_SIZE = 64 as const;
const IMAGE_SIZE = 448 as const;
</script>

<template>
  <UPageSection
    title="Kuba Audio: Minha marca de fones"
    orientation="horizontal"
    :links="links"
  >
    <template #description>
      <h4 class="my-3 text-primary text-xl lg:text-2xl font-bold">
        A Primeira Marca Brasileira de Headphones
      </h4>
      <p class="my-3">
        A Kuba Audio é uma marca criada por mim e pela minha sócia, a Eduarda, em 2016.
        <span class="font-black text-default">
          Desenvolvemos fones de ouvido de alta fidelidade, totalmente modulares e feitos para durar.
        </span>
      </p>
      <p class="my-3">
        Até hoje, já ultrapassamos 40.000 unidades vendidas, conquistando não só o público geral como o profissional e o entusiasta.
      </p>
    </template>

    <template #default>
      <div class="flex-1 w-full">
        <UCarousel
          ref="carousel"
          v-slot="{ item }"
          :items="items"
          class="w-full max-w-md mx-auto"
          @select="onSelect"
        >
          <img
            :src="item"
            :alt="alt[activeIndex]"
            :width="IMAGE_SIZE"
            :height="IMAGE_SIZE"
            class="rounded-lg"
            loading="lazy"
          >
        </UCarousel>

        <div class="flex gap-1 justify-between pt-4 max-w-md mx-auto">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="size-16 opacity-25 hover:opacity-100 transition-opacity cursor-pointer"
            :class="{ 'opacity-100': activeIndex === index }"
            @click="select(index)"
          >
            <img
              :src="item"
              :alt="alt[index]"
              :width="THUMBNAIL_SIZE"
              :height="THUMBNAIL_SIZE"
              class="rounded-lg"
              loading="lazy"
            >
          </div>
        </div>
      </div>
    </template>
  </UPageSection>
</template>
