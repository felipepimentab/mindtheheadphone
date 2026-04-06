<script lang="ts" setup>
const { lossless } = defineProps<{
  song: 1 | 2 | 3 | 4 | 5
  lossless: boolean
  show: boolean
}>();

const choice = ref(false);

const resultColor = () => {
  const correct = lossless === choice.value;
  return correct ? 'success' : 'error';
};

const resultIcon = () => {
  const correct = lossless === choice.value;
  return correct ? 'i-lucide-check' : 'i-lucide-x';
};

const resultLabel = () => {
  return lossless ? 'LDAC' : 'MP3';
};
</script>

<template>
  <div class="grid grid-cols-[auto_94px] items-center gap-x-4 max-w-2xl">
    <UCheckbox
      v-model="choice"
      indicator="end"
      variant="card"
      size="xl"
      :ui="{
        root: 'w-full bg-neutral-900 border-none has-data-[state=checked]:border-none has-data-[state=checked]:bg-primary-500/20',
        base: 'ring-2 cursor-pointer'
      }"
    >
      <template #description>
        <AudioPlayer
          :song="song"
          :lossless="lossless"
        />
      </template>
    </UCheckbox>
    <UBadge
      v-if="show"
      :label="resultLabel()"
      :icon="resultIcon()"
      :color="resultColor()"
      size="xl"
      variant="soft"
    />
  </div>
</template>
