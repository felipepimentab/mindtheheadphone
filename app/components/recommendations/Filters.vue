<script lang="ts" setup>
import type { SelectItem, TabsItem } from '@nuxt/ui';

const order = ref(DEFAULT_ORDER);
const search = ref('');
const category = ref([]);
const signature = ref([]);
const sliderRange = ref([MIN_RANGE, MAX_RANGE]);
const priceMin = ref(MIN_PRICE);
const priceMax = ref(MAX_PRICE);
const tabs: TabsItem[] = [
  {
    label: 'Grade',
    icon: 'i-lucide-layout-grid',
    slot: 'grade' as const,
    value: 'grade'
  },
  {
    label: 'Lista',
    icon: 'i-lucide-layout-list',
    slot: 'lista' as const,
    value: 'lista'
  }
];
const viewMode = ref('lista');

withDefaults(defineProps<{
  categories: string[]
  signatures?: string[]
}>(), {
  signatures: () => []
});

watch(sliderRange, () => {
  let minPrice = sliderToPrice(sliderRange.value[0] || MIN_PRICE);
  const maxPrice = sliderToPrice(sliderRange.value[1] || MAX_PRICE);

  if (minPrice > maxPrice) {
    minPrice = maxPrice;
  }

  priceMin.value = minPrice;
  priceMax.value = maxPrice;
});

function adjustSlider() {
  sliderRange.value[0] = priceToSlider(priceMin.value);
  sliderRange.value[1] = priceToSlider(priceMax.value);
}

const clearFilters = () => {
  category.value = [];
  signature.value = [];
  sliderRange.value = [MIN_RANGE, MAX_RANGE];
  priceMin.value = MIN_PRICE;
  priceMax.value = MAX_PRICE;
  search.value = '';
  order.value = DEFAULT_ORDER;
};

defineExpose({
  clearFilters,
  category,
  signature,
  search,
  min: priceMin,
  max: priceMax,
  order,
  viewMode
});

const orderIcon = computed(() => orders.find(item => item.value === order.value)?.icon);

function addColorToSignatures(list: string[]): SelectItem[] {
  return list.map((s) => {
    return {
      value: s,
      label: s,
      chip: {
        color: signatureColor(s as SoundSignature)
      }
    };
  });
}

function signatureColor(sig: SoundSignature) {
  switch (sig) {
    case 'Enérgico':
      return 'ss-energetico';
    case 'Natural':
      return 'ss-natural';
    case 'Neutro-Quente':
      return 'ss-neutro-quente';
    case 'Neutro-Frio':
      return 'ss-neutro-frio';
    case 'Musical':
      return 'ss-musical';
    case 'Basshead':
      return 'ss-basshead';
    case 'V-Shaped Forte':
      return 'ss-v-shaped';
    default:
      return 'primary';
  }
}

const FIELD_SIZE = 'md' as const;
const FIELD_STYLE = 'soft' as const;
</script>

<template>
  <div>
    <UForm class="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 lg:gap-4">
      <UFormField
        label="Buscar por nome"
        orientation="vertical"
        class=""
      >
        <UInput
          v-model="search"
          icon="i-lucide-search"
          :variant="FIELD_STYLE"
          placeholder="Buscar..."
          class="w-full"
          :size="FIELD_SIZE"
        />
      </UFormField>

      <div class="grid grid-cols-2 gap-2">
        <UFormField label="Preço Mínimo">
          <UInputNumber
            v-model="priceMin"
            class="w-full number-input"
            :size="FIELD_SIZE"
            :variant="FIELD_STYLE"
            :increment="false"
            :decrement="false"
            :format-options="{
              useGrouping: false
            }"
            @change="adjustSlider"
          />
        </UFormField>
        <UFormField label="Preço Máximo">
          <UInputNumber
            v-model="priceMax"
            class="w-full number-input"
            :size="FIELD_SIZE"
            :variant="FIELD_STYLE"
            :increment="false"
            :decrement="false"
            :format-options="{
              useGrouping: false
            }"
            @change="adjustSlider"
          />
        </UFormField>
        <UFormField
          class="col-span-2"
        >
          <USlider
            v-model="sliderRange"
            :min="MIN_RANGE"
            :max="MAX_RANGE"
            :step="1"
            class="pt-1"
            size="xs"
          />
        </UFormField>
      </div>

      <UFormField
        label="Assinatura Sonora"
      >
        <USelect
          v-model="signature"
          multiple
          :items="[...addColorToSignatures(signatures)]"
          :disabled="!signatures.length"
          placeholder="Todas"
          class="w-full"
          :size="FIELD_SIZE"
          :variant="FIELD_STYLE"
        />
      </UFormField>

      <UFormField
        label="Categoria"
      >
        <USelect
          v-model="category"
          multiple
          :items="[...categories]"
          :disabled="!categories.length"
          placeholder="Todas"
          class="w-full"
          :size="FIELD_SIZE"
          :variant="FIELD_STYLE"
        />
      </UFormField>

      <div class="flex items-center">
        <UButton
          variant="link"
          icon="i-lucide-eraser"
          size="xs"
          @click="clearFilters()"
        >
          Limpar filtros
        </UButton>
      </div>

      <div class="flex items-center w-full justify-between gap-x-4 mt-2 col-span-full">
        <UFormField
          orientation="vertical"
        >
          <USelect
            v-model="order"
            :items="orders"
            value-key="value"
            :icon="orderIcon"
            class="w-full"
            size="sm"
            variant="ghost"
          />
        </UFormField>
        <UTabs
          v-model="viewMode"
          :items="tabs"
          :content="false"
          variant="link"
          size="sm"
        />
      </div>
    </UForm>
    <USeparator class="mb-4" />
  </div>
</template>
