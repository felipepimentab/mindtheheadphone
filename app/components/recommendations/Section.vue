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
      label: `Ver lista de ${title.toLowerCase()}`,
      to: to,
      variant: 'soft',
      trailingIcon: 'i-lucide-arrow-right'
    }]"
    class="py-4 sm:py-6 lg:py-8 max-lg:backdrop-blur-xs from-bgc/60 lg:from-bgc/40 to-bgc bg-linear-to-bl"
    :class="inverted ? 'lg:bg-linear-to-r' : 'lg:bg-linear-to-l'"
    :reverse="inverted"
    :ui="{
      title: 'text-shadow-[0_0_20px] text-shadow-bgc',
      description: 'text-shadow-[0_0_10px] text-shadow-bgc font-medium'
    }"
  />
</template>

<style>
.fading-blur-left {
  backdrop-filter: blur(8px);
  mask-image: linear-gradient(to left, transparent, black 80%, black);
  /* -webkit-mask-image: linear-gradient(to left, transparent, black); Vendor prefix for compatibility */
}

.fading-blur-right {
  backdrop-filter: blur(8px);
  mask-image: linear-gradient(to right, transparent, black 80%, black);
}

.fading-blur-bottom {
  backdrop-filter: blur(8px);
  mask-image: linear-gradient(to bottom, transparent, black 80%, black);
}
</style>
