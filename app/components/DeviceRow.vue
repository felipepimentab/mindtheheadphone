<script lang="ts" setup>
import type { Device } from '~~/shared/types/device';

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

function signatureColor(signature: SoundSignature): string {
  return (colorReference[signature] as string[]).join(' ');
}
</script>

<template>
  <div class="flex items-center gap-x-4 w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-neutral-900">
    <div class="h-full w-16 bg-white flex flex-col items-center max-lg:hidden">
      <NuxtImg
        :src="device.img"
        :alt="device.name"
        class="object-cover h-full w-16 shrink-0"
        loading="lazy"
      />
    </div>
    <article
      class="w-full grid grid-rows-2 grid-cols-6 gap-x-2 p-2 bg-neutral-900"
    >
      <div class="col-span-4 lg:col-span-2 flex items-center">
        <h3 class="text-sm font-semibold text-highlighted">
          {{ device.name }}
        </h3>
      </div>
      <div class="col-span-2 lg:col-span-1 flex max-lg:flex-row-reverse items-center">
        <p
          class="text-sm font-bold"
          :class="priceColor(device.price || 0)"
        >
          {{ formatBRL(device.price || 0) }}
        </p>
      </div>
      <div
        class="col-span-3 lg:col-span-1 flex items-center lg:flex-row-reverse"
      >
        <p
          v-if="'signature' in device && device.signature"
          class="text-xs px-1 lg:px-2 py-0 lg:py-1 rounded-sm lg:rounded-lg w-fit font-semibold"
          :class="signatureColor(device.signature)"
        >
          {{ device.signature }}
        </p>
      </div>
      <div class="col-span-3 lg:col-span-1 flex items-center max-lg:flex-row-reverse">
        <p class="text-xs text-dimmed lg:whitespace-nowrap">
          {{ device.category }}
        </p>
      </div>
      <div class="col-span-5 flex items-center">
        <p class="text-xs text-muted">
          {{ device.overview }}
        </p>
      </div>
      <div class="flex justify-around -col-end-1 lg:row-start-1 lg:row-span-2">
        <UTooltip
          v-if="isValidUrl(device.buy || '')"
          :delay-duration="0"
          text="Comprar"
        >
          <UButton
            variant="link"
            color="neutral"
            :to="device.buy"
            target="_blank"
            size="xs"
            class="justify-center"
            aria-label="Comprar"
            icon="i-lucide-shopping-cart"
          />
        </UTooltip>
        <UTooltip
          v-if="isValidUrl(device.review || '')"
          :delay-duration="0"
          text="Review"
        >
          <UButton
            variant="link"
            color="neutral"
            :to="device.review"
            target="_blank"
            size="xs"
            class="justify-center"
            aria-label="Review"
            icon="i-lucide-youtube"
          />
        </UTooltip>
      </div>
    </article>
  </div>
</template>
