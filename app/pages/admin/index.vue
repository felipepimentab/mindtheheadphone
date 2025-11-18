<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard'
});

const list = headphones;

async function send() {
  for (const hp of list) {
    await $fetch('/api/headphone/create', {
      method: 'POST',
      body: { ...hp }
    });
  }
}
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
      <button @click="send">
        send
      </button>
    </template>
  </UDashboardPanel>
</template>
