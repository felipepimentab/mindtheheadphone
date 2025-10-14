<script lang="ts" setup>
const categories = ref(['Intra-auricular', 'Earbud', 'Intra-auricular Bluetooth', 'Earbud Bluetooth', 'Headphone Cabeado', 'Headphone Bluetooth', 'Headphone Gamer'])
const signatures = ref(['Enérgico', 'Natural', 'Neutro-Quente', 'Analítico', 'Seco/Direto', 'Neutro-Frio', 'Musical', 'Basshead', 'V-Shaped Forte'])
const category = ref([])
const signature = ref([])
const priceRange = ref([0, 50000])
</script>

<template>
  <div>
    <div
      class="bg-cover bg-center"
      style="background-image: url('/image/bg-recomendacoes.jpg');"
    >
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
            <UFormField label="Categoria">
              <USelect
                v-model="category"
                multiple
                :items="categories"
                placeholder="Todas"
                class="w-48"
              />
            </UFormField>
            <UFormField label="Assinatura Sonora">
              <USelect
                v-model="signature"
                multiple
                :items="signatures"
                placeholder="Todas"
                class="w-48"
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
            <USeparator />
            <UFormField label="Buscar">
              <UInput
                icon="i-lucide-search"
                variant="outline"
                placeholder="Buscar..."
              />
            </UFormField>
          </UForm>
        </template>

        <UPageBody>
          <UPageGrid>
            <UCard
              v-for="_ in 5"
              :key="_"
              variant="soft"
            >
              <template #header>
                <USkeleton class="h-8" />
              </template>

              <USkeleton class="h-32 w-full" />

              <template #footer>
                <USkeleton class="h-8" />
              </template>
            </UCard>
          </UPageGrid>
        </UPageBody>
      </UPage>
    </UContainer>
  </div>
</template>
