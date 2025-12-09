<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard'
});
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        title="Caixas de Som"
        icon="i-lucide-speaker"
      />
      <UDashboardToolbar />
    </template>

    <template #body>
      Novo
    </template>
  </UDashboardPanel>
</template>
