<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard'
});
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        title="Microfones"
        icon="i-lucide-mic-vocal"
      />
      <UDashboardToolbar />
    </template>

    <template #body>
      Novo
    </template>
  </UDashboardPanel>
</template>
