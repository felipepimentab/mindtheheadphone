<script lang="ts" setup>
type UiTextTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

withDefaults(defineProps<{
  type?: UiTextTag
}>(), {
  type: 'p'
});

const uiClass: Record<UiTextTag, string> = {
  p: 'text-base',
  h1: 'text-5xl sm:text-7xl text-pretty tracking-tight font-bold text-highlighted',
  h2: 'text-3xl sm:text-4xl text-pretty tracking-tight font-bold text-highlighted',
  h3: 'text-xl lg:text-2xl text-pretty tracking-tight font-bold',
  h4: 'text-lg lg:text-xl text-pretty tracking-tight font-bold',
  h5: 'text-base lg:text-lg text-pretty tracking-tight font-bold',
  h6: 'text-base font-bold text-pretty tracking-tight'
};
</script>

<template>
  <component
    :is="type"
    :class="uiClass[type]"
  >
    <slot />
  </component>
</template>
