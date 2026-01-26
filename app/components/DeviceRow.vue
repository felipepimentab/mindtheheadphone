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
      class="w-full grid gap-y-1 grid-cols-[auto_100px] sm:grid-cols-[auto_100px_150px_56px] md:grid-cols-[20%_100px_150px_auto_56px] gap-x-4 p-2 bg-neutral-900"
    >
      <div class="flex items-center">
        <h3 class="text-sm font-semibold text-highlighted xl:text-base">
          {{ device.name }}
        </h3>
      </div>
      <div class="flex items-center max-sm:flex-row-reverse">
        <p
          class="text-sm font-bold xl:text-base"
          :class="priceColor(device.price || 0)"
        >
          {{ formatBRL(device.price || 0) }}
        </p>
      </div>
      <div
        class="flex flex-col items-start gap-y-1 sm:max-md:row-span-2 justify-center max-sm:flex-row max-sm:col-span-2 max-sm:justify-between"
      >
        <p
          v-if="'signature' in device && device.signature"
          class="text-xs px-1 lg:px-2 py-0 lg:py-1 rounded-sm lg:rounded-lg w-fit font-semibold whitespace-nowrap"
          :class="signatureColor(device.signature)"
        >
          {{ device.signature }}
        </p>
        <p class="text-xs text-dimmed lg:whitespace-nowrap">
          {{ device.category }}
        </p>
      </div>
      <div class="flex items-center sm:max-md:row-start-2 sm:max-md:col-span-2">
        <p class="text-xs text-muted xl:text-sm">
          {{ device.overview }}
        </p>
      </div>
      <div class="flex justify-around sm:max-md:row-span-2 max-sm:justify-end gap-x-2">
        <UTooltip
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
            :disabled="!isValidUrl(device.buy || '')"
          />
        </UTooltip>
        <UTooltip
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
            :disabled="!isValidUrl(device.review || '')"
          />
        </UTooltip>
      </div>
    </article>
  </div>
</template>
