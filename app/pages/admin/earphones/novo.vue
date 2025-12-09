<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard'
});
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        title="Earphones"
        icon="i-lucide-candy-cane"
      />
      <UDashboardToolbar />
    </template>

    <template #body>
      Novo
    </template>
  </UDashboardPanel>
</template>
