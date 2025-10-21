<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui';

const { filteredHeadphones } = useHeadphones();

const items: TabsItem[] = [
  {
    label: 'Lista',
    value: 'list',
    icon: 'i-lucide-list'
  },
  {
    label: 'Grade',
    value: 'grid',
    icon: 'i-lucide-layout-grid'
  }
];

const display = ref('grid');
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

function priceColor(price: number): 'success' | 'warning' | 'error' {
  if (price < 500) return 'success';
  if (price < 1500) return 'warning';
  return 'error';
}
</script>

<template>
  <div>
    <div class="bg-cover bg-center bg-[url('/image/bg-recomendacoes.jpg')]">
      <UPageSection
        title="Recomendações"
        description="Abaixo estão os fones de ouvido que mais recomendo, de diferentes tipos e faixas de preço. Basta selecionar a categoria, a assinatura sonora e a faixa de preço desejada."
        class="backdrop-brightness-50"
      />
    </div>
    <UContainer class="py-4 sm:py-6 lg:py-8">
      <UPage>
        <template #left>
          <UForm class="space-y-4 my-8">
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
              />
            </UFormField>
            <UFormField label="Preço Mínimo">
              <UInput
                v-model="priceRange[0]"
                type="number"
                size="xs"
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
                size="xs"
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

        <UPageBody>
          <div class="flex items-center justify-between">
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
          </div>
          <UPageGrid>
            <article
              v-for="headphone in headphones"
              :key="headphone.name"
              class="rounded-lg bg-muted shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden w-80 grid grid-cols-1"
              variant="soft"
            >
              <img
                :src="headphone.img"
                :alt="headphone.name"
                class="w-80 object-cover"
              >
              <div class="px-4 py-3 flex flex-col gap-y-1 items-start">
                <div class="flex items-center">
                  <UBadge
                    v-for="tag in headphone.tags"
                    :key="tag"
                    variant="subtle"
                    class="font-bold rounded-full"
                  >
                    {{ tag }}
                  </UBadge>
                </div>
                <h3 class="text-2xl font-bold text-highlighted">
                  {{ headphone.name }}
                </h3>
                <p class="text-xs text-muted">
                  {{ headphone.category }}
                </p>
                <p class="text-base line-clamp-2">
                  {{ headphone.overview }}
                </p>
              </div>
              <div class="px-4 pb-2">
                <UBadge
                  variant="subtle"
                  size="xl"
                  :color="priceColor(headphone.price)"
                >
                  R$ {{ headphone.price }}
                </UBadge>
              </div>
              <div class="w-full justify-around flex p-2 border-accented border-t">
                <!-- variant="link" -->
                <UButton
                  color="neutral"
                  :to="headphone.buy"
                  target="_blank"
                >
                  Comprar
                </UButton>
                <UButton
                  variant="subtle"
                  color="neutral"
                  :to="headphone.review"
                  target="_blank"
                >
                  Review
                </UButton>
              </div>
            </article>
          </UPageGrid>
        </UPageBody>
      </UPage>
    </UContainer>
  </div>
</template>
