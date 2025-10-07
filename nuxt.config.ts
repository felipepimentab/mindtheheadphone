import tailwindcss from '@tailwindcss/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo'
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: [
    '~/assets/css/main.css',
  ],

  devServer: {
    port: 8080,
  },

  googleFonts: {
    families: {
      'Lexend': true,
    },
  },

  colorMode: {
    preference: 'system', // default value
    fallback: 'light',
    classSuffix: '',
  },
})