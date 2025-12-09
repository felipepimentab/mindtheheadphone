<script lang="ts" setup>
import { useFiltersStore } from '~/stores/filters';

const orderIcon = computed(() => orders.find(item => item.value === order.value)?.icon);

const { setFilters } = useFiltersStore();
const order = ref(orders[0]?.value);
const search = ref('');
const category = ref([]);
const signature = ref([]);
const sliderRange = ref([MIN_RANGE, MAX_RANGE]);
const priceMin = ref(MIN_PRICE);
const priceMax = ref(MAX_PRICE);

defineProps<{
  categories: string[]
  signatures: string[]
}>();

watch(sliderRange, () => {
  let minPrice = sliderToPrice(sliderRange.value[0] || MIN_PRICE);
  const maxPrice = sliderToPrice(sliderRange.value[1] || MAX_PRICE);

  if (minPrice > maxPrice) {
    minPrice = maxPrice;
  }

  priceMin.value = minPrice;
  priceMax.value = maxPrice;

  updateFilters();
});

function adjustSlider() {
  sliderRange.value[0] = priceToSlider(priceMin.value);
  sliderRange.value[1] = priceToSlider(priceMax.value);
  updateFilters();
}

function clearFilters() {
  category.value = [];
  signature.value = [];
  sliderRange.value = [MIN_RANGE, MAX_RANGE];
  priceMin.value = MIN_PRICE;
  priceMax.value = MAX_PRICE;
  search.value = '';
  order.value = DEFAULT_ORDER;
}

function updateFilters() {
  setFilters({
    search: search.value,
    category: category.value,
    signature: signature.value,
    min: priceMin.value,
    max: priceMax.value,
    order: order.value as string
  });
}
</script>

<template>
  <div>
    <UForm class="space-y-4 lg:sticky lg:top-24 lg:h-fit max-lg:mb-8 max-lg:pb-4 max-lg:border-b max-lg:border-default">
      <UFormField label="Ordem">
        <USelect
          v-model="order"
          :items="orders"
          value-key="value"
          :icon="orderIcon"
          class="w-full"
          size="xl"
          @change="updateFilters"
        />
      </UFormField>

      <USeparator />

      <UFormField
        v-if="categories.length>0"
        label="Categoria"
      >
        <USelect
          v-model="category"
          multiple
          :items="[...categories]"
          placeholder="Todas"
          class="w-full"
          size="xl"
          @change="updateFilters"
        />
      </UFormField>

      <UFormField
        v-if="signatures.length>0"
        label="Assinatura Sonora"
      >
        <USelect
          v-model="signature"
          multiple
          :items="[...signatures]"
          placeholder="Todas"
          class="w-full"
          size="xl"
          @change="updateFilters"
        />
      </UFormField>

      <UFormField label="Faixa de Preço">
        <USlider
          v-model="sliderRange"
          :min="MIN_RANGE"
          :max="MAX_RANGE"
          :step="1"
          class="pt-1"
          size="xl"
          @change="updateFilters"
        />
      </UFormField>

      <div class="flex gap-x-3">
        <UFormField label="Preço Mínimo">
          <UInputNumber
            v-model="priceMin"
            class="w-full number-input"
            size="xl"
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
            size="xl"
            :increment="false"
            :decrement="false"
            :format-options="{
              useGrouping: false
            }"
            @change="adjustSlider"
          />
        </UFormField>
      </div>

      <USeparator />

      <UFormField label="Buscar pelo nome">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          variant="outline"
          placeholder="Buscar..."
          class="w-full"
          size="xl"
          @input="updateFilters"
        />
      </UFormField>

      <UButton
        variant="soft"
        icon="i-lucide-eraser"
        size="lg"
        @click="clearFilters()"
      >
        Limpar todos os filtros
      </UButton>
    </UForm>
  </div>
</template>
