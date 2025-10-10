<template>
  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        Built with Nuxt UI • © {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton
        to="https://www.instagram.com/mind.the.headphone"
        target="_blank"
        icon="i-simple-icons-instagram"
        aria-label="Instagram"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>