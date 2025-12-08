<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard'
});
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        title="Headphones e Earphones"
        icon="i-lucide-headphones"
      />
      <UDashboardToolbar />
    </template>

    <template #body>
      <Placeholder class="h-full" />
      Admin
    </template>
  </UDashboardPanel>
</template>
