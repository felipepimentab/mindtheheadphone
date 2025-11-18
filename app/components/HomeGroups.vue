<script lang="ts" setup>
import type { ButtonProps } from '@nuxt/ui';

const links: ButtonProps[] = [
  {
    label: 'WhatsApp',
    color: 'success',
    variant: 'soft',
    trailingIcon: 'i-simple-icons-whatsapp',
    size: 'xl',
    target: '_blank',
    to: 'https://www.whatsapp.com/channel/0029VbBhzuQLtOj9cerbqT1R'
  },
  {
    label: 'Telegram',
    color: 'secondary',
    variant: 'soft',
    trailingIcon: 'i-simple-icons-telegram',
    size: 'xl',
    target: '_blank',
    to: 'https://t.me/+wPzQUdcZRkFiNjYx'
  }
];
</script>

<template>
  <UPageSection :ui="{ container: 'px-0' }">
    <UPageCTA
      title="Entre no nosso grupo de promoções"
      description="Participe da comunidade para receber ofertas e dicas de fones de ouvido em tempo real"
      variant="outline"
      :links="links"
    />
  </UPageSection>
</template>
