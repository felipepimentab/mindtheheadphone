<script lang="ts" setup>
const options: Record<string, ListOptions> = {
  earphones: {
    title: 'Earphones',
    description: 'Os fones de ouvido que mais recomendo, organizados por categoria, assinatura sonora e faixa de preço.',
    to: '/recomendacoes/earphones',
    inverted: false,
    enabled: true
  },
  headphones: {
    title: 'Headphones',
    description: 'Os fones de ouvido que mais recomendo, organizados por categoria, assinatura sonora e faixa de preço.',
    to: '/recomendacoes/headphones',
    inverted: true,
    enabled: true
  },
  electronics: {
    title: 'Eletrônicos',
    description: 'Os fones de ouvido que mais recomendo, organizados por categoria, assinatura sonora e faixa de preço.',
    to: '/recomendacoes/eletronicos',
    inverted: false,
    enabled: true
  },
  speakers: {
    title: 'Caixas de Som',
    description: 'As caixas de som que mais recomendo, incluido caixas Bluetooth e convencionais.',
    to: '/recomendacoes/falantes',
    inverted: false,
    enabled: false
  },
  microphones: {
    title: 'Microfones',
    description: 'Os microfones que mais recomendo, incluindo microfones de mesa e para celular.',
    to: '/recomendacoes/microfones',
    inverted: false,
    enabled: false
  }
} as const;
</script>

<template>
  <div>
    <div
      v-if="options.earphones.enabled"
      class="bg-cover bg-center bg-[url('/image/bg/earphones.jpg')]"
    >
      <RecommendationsSection
        :options="options.earphones"
      />
    </div>
    <div
      v-if="options.headphones.enabled"
      class="bg-cover bg-center bg-[url('/image/bg/headphones.jpg')]"
    >
      <RecommendationsSection
        :options="options.headphones"
      />
    </div>
    <div
      v-if="options.speakers.enabled"
      class="bg-cover bg-center bg-[url('/image/bg/speaker.jpg')]"
    >
      <RecommendationsSection
        :options="options.speakers"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/banner-ciclo.jpg')]">
      <RecommendationsSection
        :options="options.electronics"
      />
    </div>
    <div
      v-if="options.microphones.enabled"
      class="bg-cover bg-center bg-[url('/image/bg/microfones.jpg')]"
    >
      <RecommendationsSection
        :options="options.microphones"
      />
    </div>
  </div>
</template>
