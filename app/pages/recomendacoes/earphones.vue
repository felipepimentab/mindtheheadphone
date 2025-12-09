<script lang="ts" setup>
import type { Device } from '~~/shared/types/device';

const { getDevices } = await useGetDevices('/api/earphone');
const { min, max, search, category, order } = storeToRefs(useFiltersStore());
const { clearFilters } = useFiltersStore();
clearFilters();

const devices = computed<Device[]>(() => {
  const filterParams: FilterParams = {
    min: min.value,
    max: max.value,
    search: search.value,
    category: category.value,
    order: order.value
  };

  return getDevices(filterParams);
});
</script>

<template>
  <div>
    <div class="bg-cover bg-center bg-[url('/image/bg/earphones.jpg')]">
      <RecommendationsHeader
        title="Earphones"
        description="Abaixo estão os fones de ouvido que mais recomendo, de diferentes tipos e faixas de preço. Basta selecionar a categoria, a assinatura sonora e a faixa de preço desejada."
      />
    </div>
    <UContainer class="py-4 sm:py-6 lg:py-8">
      <UPage>
        <template #left>
          <RecommendationsFilters
            :categories="[...earphoneCategories]"
            :signatures="[...soundSignatures]"
          />
        </template>

        <UEmpty
          v-if="!devices.length"
          variant="soft"
          icon="i-lucide-search-x"
          title="Nenhum fone encontrado"
          description="Tente ajustar sua seleção ou clique em “Limpar filtros” para ver todos os modelos disponíveis."
          size="xl"
        >
          <template #actions>
            <UButton
              variant="soft"
              icon="i-lucide-eraser"
              size="xl"
              @click="clearFilters()"
            >
              Limpar filtros
            </UButton>
          </template>
        </UEmpty>

        <UPageGrid>
          <DeviceCard
            v-for="device in devices"
            :key="device.name"
            :device="device"
          />
        </UPageGrid>
      </UPage>
    </UContainer>
  </div>
</template>
