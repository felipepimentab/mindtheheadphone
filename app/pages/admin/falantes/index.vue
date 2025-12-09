<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard'
});

const { filteredHeadphones } = await useHeadphones();
const list = filteredHeadphones({
  search: '',
  category: [],
  signature: []
});
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        title="Caixas de Som"
        icon="i-lucide-speaker"
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
