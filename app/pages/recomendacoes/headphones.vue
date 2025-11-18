<script lang="ts" setup>
const { filteredHeadphones } = await useHeadphones();
const MIN_RANGE = 0;
const MAX_RANGE = 150;
const MIN_PRICE = sliderToPrice(MIN_RANGE);
const MAX_PRICE = sliderToPrice(MAX_RANGE); // 50625
const category = ref<HeadphoneCategory[]>([]);
const signature = ref<SoundSignature[]>([]);
const sliderRange = ref([MIN_RANGE, MAX_RANGE]);
const priceMin = ref(MIN_PRICE);
const priceMax = ref(MAX_PRICE);
const search = ref('');

function sliderToPrice(v: number) {
  return Math.floor(Math.pow((v / 10), 4));
}

function priceToSlider(price: number) {
  return Math.floor(Math.sqrt(Math.sqrt(price)) * 10);
}

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

const headphones = computed(() => {
  return filteredHeadphones({
    min: priceMin.value,
    max: priceMax.value,
    search: search.value,
    category: category.value,
    signature: signature.value
  });
});

function clearFilters() {
  category.value = [];
  signature.value = [];
  sliderRange.value = [MIN_RANGE, MAX_RANGE];
  priceMin.value = MIN_PRICE;
  priceMax.value = MAX_PRICE;
  search.value = '';
}
</script>

<template>
  <div>
    <div class="bg-cover bg-center bg-[url('/image/bg/banner-kali.jpg')]">
      <div class="bg-linear-to-b from-transparent to-default">
        <UPageSection>
          <template #title>
            <h1>
              Headphones e Earphones
            </h1>
          </template>
          <template #description>
            <span class="text-highlighted">
              Abaixo estão os fones de ouvido que mais recomendo, de diferentes tipos e faixas de preço. Basta selecionar a categoria, a assinatura sonora e a faixa de preço desejada.
            </span>
          </template>
        </UPageSection>
      </div>
    </div>
    <UContainer class="py-4 sm:py-6 lg:py-8">
      <UPage>
        <template #left>
          <UForm class="space-y-4 lg:sticky lg:top-24 lg:h-fit max-lg:mb-8 max-lg:pb-4 max-lg:border-b max-lg:border-default">
            <UFormField label="Buscar pelo nome">
              <UInput
                v-model="search"
                icon="i-lucide-search"
                variant="outline"
                placeholder="Buscar..."
                class="w-full"
                size="xl"
              />
            </UFormField>
            <!-- <USeparator /> -->
            <UFormField label="Categoria">
              <USelect
                v-model="category"
                multiple
                :items="[...headphoneCategories]"
                placeholder="Todas"
                class="w-full"
                size="xl"
              />
            </UFormField>
            <UFormField label="Assinatura Sonora">
              <USelect
                v-model="signature"
                multiple
                :items="[...soundSignatures]"
                placeholder="Todas"
                class="w-full"
                size="xl"
              />
            </UFormField>
            <!-- <USeparator /> -->
            <UFormField label="Faixa de Preço">
              <USlider
                v-model="sliderRange"
                :min="MIN_RANGE"
                :max="MAX_RANGE"
                :step="1"
                class="pt-1"
                size="xl"
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
            <UButton
              variant="link"
              icon="i-lucide-eraser"
              size="lg"
              @click="clearFilters()"
            >
              Limpar todos os filtros
            </UButton>
          </UForm>
        </template>
        <UEmpty
          v-if="!headphones.length"
          variant="soft"
          icon="i-lucide-search-x"
          title="Nenhum fone encontrado"
          description="Tente ajustar sua seleção ou clique em “Limpar filtros” para ver todos os modelos disponíveis."
          size="xl"
        >
          <template #actions>
            <UButton
              variant="link"
              icon="i-lucide-eraser"
              size="xl"
              @click="clearFilters()"
            >
              Limpar filtros
            </UButton>
          </template>
        </UEmpty>
        <UPageGrid>
          <HeadphoneCard
            v-for="headphone in headphones"
            :key="headphone.name"
            :headphone="headphone"
          />
        </UPageGrid>
      </UPage>
    </UContainer>
  </div>
</template>

<style>
.number-input input {
  padding-left: 2rem;
}

.number-input::before {
  content: "R$";
  position: absolute;
  left: 0.5rem;
  color: var(--text-color-muted);
  font-size: var(--text-sm);
}
</style>
