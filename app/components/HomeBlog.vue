<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const links: ButtonProps[] = [
  {
    label: 'Acessar o antigo blog',
    to: 'https://old.mindtheheadphone.com.br/',
    target: '_blank',
    color: 'primary',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right'
  }
]
</script>

<template>
  <UPageSection
    title="Como tudo começou..."
    description="O blog Mind the Headphone foi o início de tudo – e ainda é possível acessá-lo, pra quem quer uma seção de nostalgia!"
    orientation="vertical"
    :links="links"
    class="bg-muted"
  >
    <img
      src="/image/blog-screenshot.png"
      width="352"
      height="647"
      alt="Illustration"
      class="w-full rounded-lg"
    >
  </UPageSection>
</template>
