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
  const colorReference: Record<SoundSignature, string[]> = {
    'Enérgico': [
      `text-yellow-400`,
      `bg-yellow-700/30`
    ],
    'Natural': [
      `text-green-400`,
      `bg-green-700/30`
    ],
    'Neutro-Quente': [
      `text-orange-400`,
      `bg-orange-700/30`
    ],
    'Neutro-Frio': [
      `text-sky-400`,
      `bg-sky-700/30`
    ],
    'Seco/Direto': [
      `text-slate-400`,
      `bg-slate-700/30`
    ],
    'Analítico': [
      `text-violet-400`,
      `bg-violet-700/30`
    ],
    'Musical': [
      `text-emerald-400`,
      `bg-emerald-700/30`
    ],
    'Basshead': [
      `text-teal-400`,
      `bg-teal-700/30`
    ],
    'V-Shaped Forte': [
      `text-indigo-400`,
      `bg-indigo-700/30`
    ]
  };

  return (colorReference[signature] as string[]).join(' ');
}
</script>

<template>
  <article class="flex items-stretch gap-5 rounded-lg border border-default/30 bg-neutral-900/90 p-3.5 sm:p-4.5 shadow-sm hover:shadow-lg transition-shadow duration-200">
    <div class="relative flex-shrink-0">
      <NuxtImg
        :src="device.img"
        :alt="device.name"
        class="object-cover rounded-lg bg-white h-[84px] w-[84px] sm:h-[108px] sm:w-[108px]"
        loading="lazy"
      />
      <div class="absolute -bottom-2 left-2 flex gap-1 flex-wrap">
        <UBadge
          v-for="tag in device.tags"
          :key="tag"
          size="xs"
          variant="solid"
          :color="tag === 'Favorito do canal' ? 'primary' : 'secondary'"
          :icon="tag === 'Favorito do canal' ? 'i-lucide-heart' : ''"
          class="font-semibold rounded-full"
        >
          {{ tag }}
        </UBadge>
      </div>
    </div>

    <div class="flex flex-col gap-3 flex-1 min-w-0 sm:flex-row sm:items-stretch sm:gap-5">
      <div class="flex flex-col gap-2.5 flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-highlighted line-clamp-1">
          {{ device.name }}
        </h3>

        <div class="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>{{ device.category }}</span>
          <span
            v-if="'signature' in device && device.signature"
            class="text-xs px-2 py-0.5 rounded-lg font-semibold"
            :class="signatureColor(device.signature)"
          >
            {{ device.signature }}
          </span>
        </div>

        <p class="text-sm text-muted line-clamp-1">
          {{ device.overview }}
        </p>
      </div>

      <div class="flex flex-col justify-between items-end text-right min-w-[140px] self-stretch gap-2.5">
        <p
          class="text-base font-bold"
          :class="priceColor(device.price || 0)"
        >
          {{ formatBRL(device.price || 0) }}
        </p>
        <UButton
          v-if="isValidUrl(device.buy || '')"
          variant="ghost"
          color="neutral"
          size="xs"
          :to="device.buy"
          target="_blank"
        >
          Comprar
        </UButton>
        <UButton
          v-if="isValidUrl(device.review || '')"
          variant="ghost"
          color="neutral"
          size="xs"
          :to="device.review"
          target="_blank"
        >
          Review
        </UButton>
      </div>
    </div>
  </article>
</template>
