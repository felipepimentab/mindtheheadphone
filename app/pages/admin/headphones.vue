<script lang="ts" setup>
import type { Device } from '~~/shared/types/device';

definePageMeta({
  layout: 'dashboard'
});

const API_URL = '/api/headphone';
const { getDevices } = await useGetDevices(API_URL);
const list = computed<Device[]>(() => {
  return getDevices({});
});
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        title="Headphones"
        icon="i-lucide-headphones"
      />
    </template>

    <template #body>
      <UTable
        :data="list"
        class="flex-1"
      />
    </template>
  </UDashboardPanel>
</template>
