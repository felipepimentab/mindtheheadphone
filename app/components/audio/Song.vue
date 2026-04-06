<script lang="ts" setup>
defineProps<{
  img: string
  name: string
  band: string
  album: string
}>();
</script>

<template>
  <div class="flex gap-2 w-fit">
    <NuxtImg
      :src="img"
      width="128"
      height="128"
      class="w-28"
    />
    <div class="flex flex-col items-start p-2">
      <h3 class="font-black text-highlighted text-xl lg:text-2xl">
        {{ name }}
      </h3>
      <p class="font-semibold text-primary text-lg lg:text-xl">
        {{ band }}
      </p>
      <p class="text-muted text-base">
        {{ album }}
      </p>
    </div>
  </div>
</template>
