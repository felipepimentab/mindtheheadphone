<script lang="ts" setup>
const stats = [
  {
    number: '363 mil',
    label: 'inscritos'
  },
  {
    number: '1.015',
    label: 'vídeos'
  },
  {
    number: '44,3 milhões',
    label: 'de visualizações'
  }
];
</script>

<template>
  <section class="from-default to-muted bg-gradient-to-b">
    <UContainer class="py-16 sm:py-24 lg:py-32">
      <div class="grid grid-cols-1 lg:grid-cols-3 grid-rows-3 lg:grid-rows-1">
        <article
          v-for="stat in stats"
          :key="stat.number"
          class="w-full flex flex-col items-center justify-center gap-y-2"
        >
          <h4 class="text-6xl font-black text-primary">
            {{ stat.number }}
          </h4>
          <p class="text-xl text-toned">
            {{ stat.label }}
          </p>
        </article>
      </div>
    </UContainer>
  </section>
</template>
