<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard'
});
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        title="Amplificadores"
        icon="i-lucide-audio-waveform"
      />
    </template>

    <template #body>
      Novo
    </template>
  </UDashboardPanel>
</template>
