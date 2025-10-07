import tailwindcss from '@tailwindcss/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo',
    '@nuxtjs/google-fonts',
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

  site: {
    name: 'Mind the Headphone',
    url: 'https://www.mindtheheadphone.com.br',
  },

  googleFonts: {
    families: {
      Lexend: true,
      Lato: ['100', '400', '700'],
    },
  },

  colorMode: {
    preference: 'system', // default value
    fallback: 'light',
    classSuffix: '',
  },
})