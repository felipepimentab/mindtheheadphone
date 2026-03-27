<script lang="ts" setup>
import type { SelectItem, TabsItem } from '@nuxt/ui';

const showFilters = ref(false);
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
const viewMode = ref<'grade' | 'lista'>('lista');
const VIEW_MODE_STORAGE_KEY = 'recommendations:view-mode';
const availableViewModes = new Set(['grade', 'lista']);

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

onMounted(() => {
  const storedValue = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
  if (storedValue && availableViewModes.has(storedValue)) {
    viewMode.value = storedValue as 'grade' | 'lista';
  }
});

watch(viewMode, (value) => {
  if (!import.meta.client)
    return;

  localStorage.setItem(VIEW_MODE_STORAGE_KEY, value);
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

function toggleShowFilters() {
  showFilters.value = !showFilters.value;
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

const FIELD_SIZE = 'lg' as const;
const FIELD_STYLE = 'soft' as const;
</script>

<template>
  <div class="mb-4">
    <UForm class="flex flex-col">
      <div class="grid grid-cols-[1fr_auto] gap-x-2 w-full max-w-125" />
      <UCollapsible
        v-model:open="showFilters"
        :unmount-on-hide="false"
        :ui="{
          content: 'overflow-visible flex flex-col gap-y-2 gap-x-3 w-full max-w-250 lg:grid lg:grid-cols-3 mb-8'
        }"
      >
        <template #content>
          <!-- Assinatura Sonora -->
          <UFormField
            label="Assinatura Sonora"
            class="order-2"
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

          <!-- Categoria -->
          <UFormField
            label="Categoria"
            class="order-3"
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

          <!-- Preço -->
          <div class="flex flex-col justify-between gap-2 order-5">
            <UFormField
              class="order-1 mt-2"
            >
              <USlider
                v-model="sliderRange"
                :min="MIN_RANGE"
                :max="MAX_RANGE"
                :step="1"
                size="xs"
              />
            </UFormField>
            <div class="flex justify-between gap-x-2 order-2">
              <UFormField
                label="De"
                orientation="horizontal"
                class="w-32"
                :size="FIELD_SIZE"
              >
                <UInputNumber
                  v-model="priceMin"
                  class="number-input"
                  :variant="FIELD_STYLE"
                  :increment="false"
                  :decrement="false"
                  :format-options="{
                    notation: 'standard',
                    currency: 'BRL',
                    currencyDisplay: 'symbol',
                    currencySign: 'standard',
                    style: 'currency',
                    maximumFractionDigits: 0
                  }"
                  @change="adjustSlider"
                />
              </UFormField>
              <UFormField
                label="Até"
                orientation="horizontal"
                class="w-32"
                :size="FIELD_SIZE"
              >
                <UInputNumber
                  v-model="priceMax"
                  class="number-input"
                  :variant="FIELD_STYLE"
                  :increment="false"
                  :decrement="false"
                  :format-options="{
                    notation: 'standard',
                    currency: 'BRL',
                    currencyDisplay: 'symbol',
                    currencySign: 'accounting',
                    style: 'currency',
                    maximumFractionDigits: 0
                  }"
                  @change="adjustSlider"
                />
              </UFormField>
            </div>
          </div>

          <UFormField
            orientation="vertical"
            label="Ordenar por"
            class="order-4"
          >
            <USelect
              v-model="order"
              :items="orders"
              value-key="value"
              :icon="orderIcon"
              class="w-full"
              :size="FIELD_SIZE"
              :variant="FIELD_STYLE"
            />
          </UFormField>

          <!-- Buscar -->
          <UFormField
            orientation="vertical"
            label="Buscar por nome"
            class="w-full order-1"
          >
            <UInput
              v-model="search"
              icon="i-lucide-search"
              :variant="FIELD_STYLE"
              placeholder="Buscar..."
              :size="FIELD_SIZE"
              class="w-full"
            />
          </UFormField>

          <!-- Limpar -->
          <div class="flex flex-col-reverse w-fit order-6">
            <UButton
              variant="ghost"
              icon="i-lucide-eraser"
              :size="FIELD_SIZE"
              @click="clearFilters()"
            >
              Limpar
            </UButton>
          </div>
        </template>
      </UCollapsible>

      <!-- Ordenar -->
      <div class="grid grid-cols-2 gap-x-2 lg:flex items-center justify-between">
        <!-- Filtros -->
        <UButton
          :trailing-icon="showFilters ? 'i-lucide-filter-x' : 'i-lucide-filter'"
          class="w-fit"
          size="md"
          variant="soft"
          :label="showFilters ? 'Ocultar' : 'Filtrar'"
          @click="toggleShowFilters"
        />
        <UFormField>
          <UTabs
            v-model="viewMode"
            :items="tabs"
            :content="false"
            variant="pill"
            size="sm"
            :ui="{
              label: '',
              list: 'bg-neutral-900',
              indicator: 'bg-primary/20 backdrop-blur-md',
              trigger: 'data-[state=active]:text-primary'
            }"
          />
        </UFormField>
      </div>
    </UForm>
  </div>
</template>
