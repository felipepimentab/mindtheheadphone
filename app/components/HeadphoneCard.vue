<script lang="ts" setup>
defineProps<{
  headphone: Headphone
}>();

function priceColor(price: number): 'success' | 'warning' | 'error' {
  if (price < 500) return 'success';
  if (price < 1500) return 'warning';
  return 'error';
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function signatureColor(signature: SoundSignature): string {
  const color: Record<SoundSignature, string[]> = {
    'Enérgico': ['text-yellow-500', 'dark:text-yellow-300', 'bg-yellow-100', 'dark:bg-yellow-900', 'border-yellow-500', 'dark:border-yellow-300'],
    'Natural': ['text-green-500', 'dark:text-green-300', 'bg-green-100', 'dark:bg-green-900', 'border-green-500', 'dark:border-green-300'],
    'Neutro-Quente': ['text-orange-500', 'dark:text-orange-300', 'bg-orange-100', 'dark:bg-orange-900', 'border-orange-500', 'dark:border-orange-300'],
    'Neutro-Frio': ['text-sky-500', 'dark:text-sky-300', 'bg-sky-100', 'dark:bg-sky-900', 'border-sky-500', 'dark:border-sky-300'],
    'Seco/Direto': ['text-slate-500', 'dark:text-slate-300', 'bg-slate-100', 'dark:bg-slate-900', 'border-slate-500', 'dark:border-slate-300'],
    'Analítico': ['text-violet-500', 'dark:text-violet-300', 'bg-violet-100', 'dark:bg-violet-900', 'border-violet-500', 'dark:border-violet-300'],
    'Musical': ['text-emerald-500', 'dark:text-emerald-300', 'bg-emerald-100', 'dark:bg-emerald-900', 'border-emerald-500', 'dark:border-emerald-300'],
    'Basshead': ['text-teal-500', 'dark:text-teal-300', 'bg-teal-100', 'dark:bg-teal-900', 'border-teal-500', 'dark:border-teal-300'],
    'V-Shaped Forte': ['text-indigo-500', 'dark:text-indigo-300', 'bg-indigo-100', 'dark:bg-indigo-900', 'border-indigo-500', 'dark:border-indigo-300']
  };

  return (color[signature] as string[]).join(' ');
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
      <div class="flex items-center w-full absolute px-3 bottom-0.5 gap-2">
        <UBadge
          v-for="tag in headphone.tags"
          :key="tag"
          variant="subtle"
          :color="tag === 'Favorito do canal' ? 'primary' : 'secondary'"
          class="font-bold rounded-full"
        >
          {{ tag }}
        </UBadge>
      </div>
    </div>
    <div class="px-4 py-3 flex flex-col gap-y-1 items-start">
      <div class="w-full flex items-start justify-between gap-2">
        <h3 class="text-xl font-bold text-highlighted">
          {{ headphone.name }}
        </h3>
        <div class="flex items-center gap-0.5">
          <span class="text-base text-highlighted font-bold">
            4
          </span>
          <span class="text-sm text-muted font-bold">
            /5
          </span>
          <UIcon
            name="i-lucide-star"
            class="size-4 text-amber-300 light:text-amber-500"
          />
        </div>
      </div>
      <div class="w-full flex items-center-safe justify-between">
        <p class="text-sm text-muted">
          {{ headphone.category }}
        </p>
        <p
          class="border rounded-md px-1.5 font-bold text-sm"
          :class="signatureColor(headphone.signature)"
        >
          {{ headphone.signature }}
        </p>
      </div>
      <p class="text-base">
        {{ headphone.overview }}
      </p>
    </div>
    <div class="px-4 py-2 w-full flex flex-row-reverse">
      <UBadge
        variant="subtle"
        size="xl"
        :color="priceColor(headphone.price)"
      >
        R$ {{ headphone.price }}
      </UBadge>
    </div>
    <div class="w-full grid grid-cols-2 gap-2 p-2">
      <UButton
        v-if="isValidUrl(headphone.buy)"
        variant="ghost"
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
        variant="ghost"
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
