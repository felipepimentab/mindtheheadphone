<script lang="ts" setup>
defineProps<{
  options: ListOptions
}>();
</script>

<template>
  <UPageSection
    :title="options.title"
    :description="options.description"
    orientation="horizontal"
    :links="[{
      label: 'Ver lista de recomendações',
      to: options.to,
      variant: 'link',
      trailingIcon: 'i-lucide-arrow-right'
    }]"
    class="py-4 sm:py-6 lg:py-8 from-transparent to-bgc backdrop-brightness-55 lg:backdrop-brightness-85"
    :class="options.inverted ? 'bg-linear-to-l lg:bg-linear-to-r' : 'bg-linear-to-l'"
    :reverse="options.inverted"
  />
</template>
