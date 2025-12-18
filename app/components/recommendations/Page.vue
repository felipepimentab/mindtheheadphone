<script lang="ts" setup>
import type { Device } from '~~/shared/types/device';

const { apiUrl } = withDefaults(defineProps<{
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

const { getDevices } = await useGetDevices(apiUrl);
const devices = computed<Device[]>(() => {
  return getDevices(filterParams.value);
});

const clearFilters = () => filtersRef.value.clearFilters();

type ViewMode = 'grid' | 'list';

const viewMode = ref<ViewMode>('grid');

const viewOptions: { label: string; value: ViewMode; icon: string }[] = [
  {
    label: 'Grade',
    value: 'grid',
    icon: 'i-lucide-grid-2x2'
  },
  {
    label: 'Lista',
    value: 'list',
    icon: 'i-lucide-list'
  }
];
</script>

<template>
  <UContainer class="py-4 sm:py-6 lg:py-8">
    <UPage>
      <template #left>
        <RecommendationsFilters
          ref="filtersRef"
          :categories="[...deviceCategories]"
          :signatures="[...deviceSignatures]"
        />
      </template>

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

      <div
        v-if="devices.length"
        class="flex items-center justify-end gap-2 mb-6"
      >
        <span class="text-sm text-muted hidden sm:inline">
          Visualização:
        </span>
        <div class="inline-flex gap-2">
          <UButton
            v-for="option in viewOptions"
            :key="option.value"
            color="neutral"
            size="sm"
            :variant="viewMode === option.value ? 'soft' : 'ghost'"
            :icon="option.icon"
            :aria-pressed="viewMode === option.value"
            @click="viewMode = option.value"
          >
            {{ option.label }}
          </UButton>
        </div>
      </div>

      <UPageGrid v-if="viewMode === 'grid'">
        <DeviceCard
          v-for="device in devices"
          :key="device.name"
          :device="device"
        />
      </UPageGrid>

      <div
        v-else
        class="flex flex-col gap-4"
      >
        <DeviceCardList
          v-for="device in devices"
          :key="device.name"
          :device="device"
        />
      </div>
    </UPage>
  </UContainer>
</template>
