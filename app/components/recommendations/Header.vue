<script lang="ts" setup>
defineProps<{
  title: string
  description: string
}>();
</script>

<template>
  <UPageSection
    orientation="horizontal"
    :title="title"
    :description="description"
    class="bg-linear-to-l from-transparent to-bgc"
  >
    <!-- <template #description>
      <span class="text-highlighted">
        {{ description }}
      </span>
    </template> -->
    <template #headline>
      <UButton
        variant="link"
        icon="i-lucide-arrow-left"
        to="/recomendacoes"
      >
        Voltar
      </UButton>
    </template>
  </UPageSection>
</template>
