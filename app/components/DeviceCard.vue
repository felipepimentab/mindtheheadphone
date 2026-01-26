<script lang="ts" setup>
import type { Device } from '~~/shared/types/device';
import { semanticColor } from '~~/shared/types/soundSignatures';

defineProps<{
  device: Partial<Device>
}>();

function priceColor(price: number): string {
  if (price < 500) return 'text-success';
  if (price < 1500) return 'text-warning';
  return 'text-error';
}

const isValidUrl = (url: string) => {
  if (!url || url === '#' || url.trim() === '') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
}
</script>

<template>
  <article
    class="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden grid grid-cols-1 grid-rows-[auto_1fr_auto] bg-neutral-900"
  >
    <div class="bg-white flex justify-center h-52 lg:h-64 relative">
      <NuxtImg
        :src="device.img"
        :alt="device.name"
        class="object-cover h-52 w-52 lg:w-64 lg:h-64"
        loading="lazy"
      />
      <div class="flex items-center justify-between w-full absolute px-3 py-2 gap-2">
        <div class="flex gap-2 flex-wrap">
          <UBadge
            v-for="tag in device.tags"
            :key="tag"
            variant="solid"
            :color="tag === 'Favorito do canal' ? 'primary' : 'secondary'"
            :icon="tag === 'Favorito do canal' ? 'i-lucide-heart' : ''"
            class="font-bold rounded-full"
          >
            {{ tag }}
          </UBadge>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-[1fr_auto] grid-rows-[auto_auto_auto_1fr] p-4 gap-x-2">
      <h3 class="text-xl font-semibold text-highlighted">
        {{ device.name }}
      </h3>
      <p
        class="text-lg font-bold"
        :class="priceColor(device.price || 0)"
      >
        {{ formatBRL(device.price || 0) }}
      </p>
      <p class="text-sm text-muted mb-2">
        {{ device.category }}
      </p>
      <div
        v-if="'signature' in device && device.signature"
        class="mb-3 col-span-full"
      >
        <UBadge
          variant="soft"
          :color="semanticColor(device.signature)"
        >
          {{ device.signature }}
        </UBadge>
      </div>
      <p class="text-base col-span-full">
        {{ device.overview }}
      </p>
    </div>
    <div class="w-full grid grid-cols-2 gap-2 p-2">
      <UButton
        v-if="isValidUrl(device.buy || '')"
        variant="link"
        color="neutral"
        :to="device.buy"
        target="_blank"
        size="sm"
        class="justify-center"
      >
        Comprar
      </UButton>
      <UButton
        v-if="isValidUrl(device.review || '')"
        variant="link"
        color="neutral"
        :to="device.review"
        target="_blank"
        size="sm"
        class="justify-center"
      >
        Review
      </UButton>
    </div>
  </article>
</template>
