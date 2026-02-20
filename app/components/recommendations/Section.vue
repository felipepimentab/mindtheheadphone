<script lang="ts" setup>
defineProps<{
  title: string
  description: string
  to: string
  inverted: boolean
}>();
</script>

<template>
  <div class="relative overflow-hidden">
    <div
      class="absolute h-full w-full"
      :class="inverted ? 'fading-blur-right' : 'fading-blur-left'"
    />
    <UPageSection
      :title="title"
      :description="description"
      orientation="horizontal"
      :links="[{
        label: `Ver lista de ${title.toLowerCase()}`,
        to: to,
        variant: 'soft',
        trailingIcon: 'i-lucide-chevron-right'
      }]"
      class="py-4 sm:py-6 lg:py-8 from-transparent to-bgc"
      :class="inverted ? 'bg-linear-to-l lg:bg-linear-to-r' : 'bg-linear-to-l'"
      :reverse="inverted"
      :ui="{
        root: 'bg-default/35',
        title: 'text-shadow-[0_0_20px] text-shadow-bgc',
        description: 'text-shadow-[0_0_10px] text-shadow-bgc font-medium'
      }"
    />
  </div>
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
