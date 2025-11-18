<script setup lang="ts">
import DashboardNavBar from '~/components/dashboard/DashboardNavBar.vue';
</script>

<template>
  <UApp>
    <UDashboardGroup>
      <DashboardNavBar />
      <slot />
    </UDashboardGroup>
  </UApp>
</template>
