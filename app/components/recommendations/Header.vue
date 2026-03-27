<script lang="ts" setup>
defineProps<{
  title: string
  description: string
}>();
</script>

<template>
  <UPageHero
    orientation="horizontal"
    :title="title"
    :description="description"
    class="bg-linear-to-b from-bgc/40 to-bgc max-md:backdrop-blur-xs"
    :ui="{
      title: 'text-shadow-[0_0_20px] text-shadow-bgc',
      description: 'text-shadow-[0_0_10px] text-shadow-bgc font-medium'
    }"
  >
    <template #headline>
      <UButton
        variant="link"
        icon="i-lucide-arrow-left"
        to="/recomendacoes"
        label="Voltar"
      />
    </template>
  </UPageHero>
</template>
