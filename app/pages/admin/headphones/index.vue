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
