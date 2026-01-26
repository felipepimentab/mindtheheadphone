<script lang="ts" setup>
import type { Device } from '~~/shared/types/device';

const props = withDefaults(defineProps<{
  deviceCategories: string[]
  deviceSignatures?: string[]
  apiUrl: string
  emptyTitle?: string
  emptyDescription?: string
}>(), {
  deviceSignatures: () => [],
  emptyTitle: () => DEFAULT_EMPTY_TITLE,
  emptyDescription: () => DEFAULT_EMPTY_DESCRIPTION
});

const filtersRef = ref();

const filterParams = computed<FilterParams>(() => {
  return {
    min: filtersRef?.value?.min || MIN_PRICE,
    max: filtersRef?.value?.max || MAX_PRICE,
    category: filtersRef?.value?.category || [],
    signature: filtersRef?.value?.signature || [],
    order: filtersRef?.value?.order || DEFAULT_ORDER,
    search: filtersRef?.value?.search || ''
  };
});
const viewMode = computed(() => filtersRef?.value?.viewMode);

const { getDevices } = await useGetDevices(props.apiUrl);
const devices = computed<Device[]>(() => {
  return getDevices(filterParams.value);
});

const clearFilters = () => filtersRef.value.clearFilters();
</script>

<template>
  <UContainer class="py-4 sm:py-6 lg:py-8">
    <UPage>
      <RecommendationsFilters
        ref="filtersRef"
        :categories="[...deviceCategories]"
        :signatures="[...deviceSignatures]"
      />

      <UEmpty
        v-if="!devices.length"
        variant="soft"
        icon="i-lucide-search-x"
        :title="emptyTitle"
        :description="emptyDescription"
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

      <UPageGrid v-if="viewMode === 'grade'">
        <DeviceCard
          v-for="device in devices"
          :key="device.name"
          :device="device"
        />
      </UPageGrid>
      <div
        v-else
        class="flex flex-col gap-y-2"
      >
        <DeviceRow
          v-for="device in devices"
          :key="device.name"
          :device="device"
        />
      </div>
    </UPage>
  </UContainer>
</template>
