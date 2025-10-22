<script lang="ts" setup>
defineProps<{
  headphone: Headphone
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
  const colorReference: Record<SoundSignature, string> = {
    'Enérgico': 'yellow',
    'Natural': 'green',
    'Neutro-Quente': 'orange',
    'Neutro-Frio': 'sky',
    'Seco/Direto': 'slate',
    'Analítico': 'violet',
    'Musical': 'emerald',
    'Basshead': 'teal',
    'V-Shaped Forte': 'indigo'
  };

  const color = colorReference[signature];

  const classes = [
    `text-${color}-400`,
    `light:text-${color}-600`,
    `bg-${color}-700/30`,
    `light:bg-${color}-200/40`
  ];

  return classes.join(' ');
}
</script>

<template>
  <article
    class="rounded-lg border-muted border shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden grid grid-cols-1 grid-rows-[auto_1fr_auto]"
  >
    <div class="bg-white flex justify-center h-52 lg:h-64 relative">
      <img
        :src="headphone.img"
        :alt="headphone.name"
        class="object-cover h-52 w-52 lg:w-64 lg:h-64"
      >
      <div class="flex items-center justify-between w-full absolute px-3 py-2 gap-2">
        <div class="flex gap-2">
          <UBadge
            v-for="tag in headphone.tags"
            :key="tag"
            variant="solid"
            :color="tag === 'Favorito do canal' ? 'primary' : 'secondary'"
            :icon="tag === 'Favorito do canal' ? 'i-lucide-heart' : ''"
            class="font-bold rounded-full"
          >
            {{ tag }}
          </UBadge>
        </div>
        <UBadge
          variant="subtle"
          color="warning"
          class="items-center"
          size="sm"
          trailing-icon="i-lucide-star"
        >
          <span class="text-black font-semibold">
            4
          </span>
        </UBadge>
      </div>
    </div>
    <div class="grid grid-cols-[1fr_auto] grid-rows-[auto_auto_auto_1fr] p-4 gap-x-2">
      <h3 class="text-xl font-semibold text-highlighted">
        {{ headphone.name }}
      </h3>
      <p
        class="text-lg font-bold"
        :class="priceColor(headphone.price)"
      >
        {{ formatBRL(headphone.price) }}
      </p>
      <p class="text-sm text-muted mb-2">
        {{ headphone.category }}
      </p>
      <div class="mb-3 col-span-full">
        <p
          class="text-xs px-2 py-1 rounded-lg w-fit"
          :class="signatureColor(headphone.signature)"
        >
          {{ headphone.signature }}
        </p>
      </div>
      <p class="text-base col-span-full">
        {{ headphone.overview }}
      </p>
    </div>
    <div class="w-full grid grid-cols-2 gap-2 p-2">
      <UButton
        v-if="isValidUrl(headphone.buy)"
        variant="subtle"
        color="neutral"
        :to="headphone.buy"
        target="_blank"
        size="sm"
        class="justify-center"
      >
        Comprar
      </UButton>
      <UButton
        v-if="isValidUrl(headphone.review)"
        variant="outline"
        color="neutral"
        :to="headphone.review"
        target="_blank"
        size="sm"
        class="justify-center"
      >
        Review
      </UButton>
    </div>
  </article>
</template>
