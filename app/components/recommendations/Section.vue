<script lang="ts" setup>
defineProps<{
  title: string
  description: string
  to: string
  inverted: boolean
}>();
</script>

<template>
  <UPageSection
    :title="title"
    :description="description"
    orientation="horizontal"
    :links="[{
      label: 'Ver lista de recomendações',
      to: to,
      variant: 'link',
      trailingIcon: 'i-lucide-chevron-right'
    }]"
    class="py-4 sm:py-6 lg:py-8 from-transparent to-bgc backdrop-brightness-55 lg:backdrop-brightness-85"
    :class="inverted ? 'bg-linear-to-l lg:bg-linear-to-r' : 'bg-linear-to-l'"
    :reverse="inverted"
    :ui="{
      title: 'text-shadow-[0_0_20px] text-shadow-bgc',
      description: 'text-shadow-[0_0_10px] text-shadow-bgc font-medium'
    }"
  />
</template>
