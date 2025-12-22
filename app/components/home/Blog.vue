<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui';

const links: ButtonProps[] = [
  {
    label: 'Acessar o antigo blog',
    to: 'https://old.mindtheheadphone.com.br/',
    target: '_blank',
    color: 'primary',
    variant: 'link',
    size: 'xl',
    trailingIcon: 'i-lucide-external-link'
  }
];
</script>

<template>
  <UPageSection
    title="Como tudo começou..."
    description="O blog Mind the Headphone foi o início de tudo – e ainda é possível acessá-lo, pra quem quer uma seção de nostalgia!"
    orientation="vertical"
    :links="links"
    :ui="{
      description: 'font-medium'
    }"
  >
    <NuxtImg
      src="/image/blog-screenshot.png"
      width="1216"
      height="800"
      alt="Captura de tela do blog antigo"
      class="w-full h-fit rounded-lg"
      loading="lazy"
    />
  </UPageSection>
</template>
