<script lang="ts" setup>
// import type { TabsItem } from '@nuxt/ui';

const { filteredHeadphones } = await useHeadphones();

// const items: TabsItem[] = [
//   {
//     label: 'Lista',
//     value: 'list',
//     icon: 'i-lucide-list'
//   },
//   {
//     label: 'Grade',
//     value: 'grid',
//     icon: 'i-lucide-layout-grid'
//   }
// ];

// const display = ref('grid');
const category = ref<HeadphoneCategory[]>([]);
const signature = ref<SoundSignature[]>([]);
const priceRange = ref([0, 50000]);
const search = ref('');

const headphones = computed(() => {
  return filteredHeadphones({
    min: priceRange.value[0],
    max: priceRange.value[1],
    search: search.value,
    category: category.value,
    signature: signature.value
  });
});

function clearFilters() {
  category.value = [];
  signature.value = [];
  priceRange.value = [0, 50000];
  search.value = '';
}
</script>

<template>
  <div>
    <div class="bg-cover bg-center bg-[url('/image/bg-recomendacoes.jpg')]">
      <div class="bg-gradient-to-b from-transparent to-default">
        <UPageSection>
          <template #title>
            <h1>
              Recomendações
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
              />
            </UFormField>
            <USeparator />
            <UFormField label="Categoria">
              <USelect
                v-model="category"
                multiple
                :items="[...headphoneCategories]"
                placeholder="Todas"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Assinatura Sonora">
              <USelect
                v-model="signature"
                multiple
                :items="[...soundSignatures]"
                placeholder="Todas"
                class="w-full"
              />
            </UFormField>
            <USeparator />
            <UFormField label="Faixa de Preço">
              <USlider
                v-model="priceRange"
                :min="0"
                :max="50000"
                :step="100"
                class="pt-1"
              />
            </UFormField>
            <UFormField label="Preço Mínimo">
              <UInput
                v-model="priceRange[0]"
                type="number"
                size="md"
                class="w-full"
              >
                <template #leading>
                  <p class="text-sm text-muted">
                    R$
                  </p>
                </template>
              </UInput>
            </UFormField>
            <UFormField label="Preço Máximo">
              <UInput
                v-model="priceRange[1]"
                type="number"
                size="md"
                class="w-full"
              >
                <template #leading>
                  <p class="text-sm text-muted">
                    R$
                  </p>
                </template>
              </UInput>
            </UFormField>
            <UButton
              variant="ghost"
              size="sm"
              icon="i-lucide-eraser"
              @click="clearFilters()"
            >
              Limpar todos os filtros
            </UButton>
          </UForm>
        </template>

        <!-- <div class="flex items-center justify-between">
          <p>Total: {{ headphones.length }} resultados</p>
          <div class="flex items-center gap-x-2">
            Visualizar como
            <UTabs
              v-model="display"
              :items="items"
              variant="pill"
              size="sm"
              :content="false"
            />
          </div>
        </div> -->
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
