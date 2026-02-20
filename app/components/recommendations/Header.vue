<script lang="ts" setup>
defineProps<{
  title: string
  description: string
}>();
</script>

<template>
  <div class="relative overflow-hidden">
    <div
      class="absolute h-full w-full fading-blur-left"
    />
    <UPageSection
      orientation="horizontal"
      :title="title"
      :description="description"
      class="bg-linear-to-l from-transparent to-bgc"
      :ui="{
        root: 'bg-default/35',
        title: 'text-shadow-[0_0_20px] text-shadow-bgc',
        description: 'text-shadow-[0_0_10px] text-shadow-bgc font-medium'
      }"
    >
      <!-- <template #description>
        <span class="text-highlighted">
          {{ description }}
        </span>
      </template> -->
      <template #headline>
        <UButton
          variant="link"
          icon="i-lucide-chevron-left"
          to="/recomendacoes"
        >
          Voltar
        </UButton>
      </template>
    </UPageSection>
  </div>
</template>
