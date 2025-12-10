// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/image', 'nuxt-mongoose', '@pinia/nuxt'],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      title: 'Mind the Headphone',
      htmlAttrs: {
        lang: 'pt-BR'
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  },

  ui: {
    fonts: false
  },

  routeRules: {
    '/': { prerender: true },
    '/recomendacoes': { prerender: true },
    '/recomendacoes/amplificadores': { prerender: true },
    '/recomendacoes/earphones': { prerender: true },
    '/recomendacoes/falantes': { prerender: true },
    '/recomendacoes/headphones': { prerender: true },
    '/recomendacoes/microfones': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  mongoose: {
    uri: process.env.DB_MONGODB_URI,
    options: {
      appName: 'devrel.vercel.integration',
      maxIdleTimeMS: 5000
    },
    modelsDir: 'models',
    devtools: true
  }
});
