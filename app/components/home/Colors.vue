<script lang="ts" setup>
const testColors = [
  'ss-energetico',
  'ss-natural',
  'ss-neutro-quente',
  'ss-neutro-frio',
  'ss-musical',
  'ss-basshead',
  'ss-v-shaped'
] as const;
</script>

<template>
  <UContainer class="grid grid-cols-7 gap-4 bg-neutral-900 py-8">
    <UBadge
      v-for="color in testColors"
      :key="color"
      :label="color"
      :color="color"
      variant="solid"
      size="xl"
    />
    <UBadge
      v-for="color in testColors"
      :key="color"
      :label="color"
      :color="color"
      variant="soft"
      size="xl"
    />
  </UContainer>
</template>
