<script lang="ts" setup>
const footerLinks = [
  {
    label: 'Instagram',
    to: 'https://www.instagram.com/mind.the.headphone',
    icon: 'i-lucide-instagram'
  },
  {
    label: 'YouTube',
    to: 'https://www.youtube.com/@mindtheheadphone',
    icon: 'i-lucide-youtube'
  },
  {
    label: 'X',
    to: 'https://x.com/mindheadphone',
    icon: 'i-lucide-twitter'
  },
  {
    label: 'GitHub',
    to: 'https://github.com/felipepimentab/mindtheheadphone',
    icon: 'i-lucide-github'
  }
]
</script>

<template>
  <UFooter>
    <template #left>
      <div class="text-sm text-muted">
        <span>
          &copy; 2025 Mind The Headphone. Todos os direitos reservados.
        </span>
        <span class="italic">
          Feito por
          <a
            href="https://github.com/felipepimentab/mindtheheadphone"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline cursor-pointer"
          >
            Felipe Pimenta.
          </a>
        </span>
      </div>
    </template>

    <template #right>
      <UButton
        v-for="link in footerLinks"
        :key="link.label"
        :to="link.to"
        target="_blank"
        :icon="link.icon"
        :aria-label="link.label"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
