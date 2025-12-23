// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/image', 'nuxt-mongoose', '@pinia/nuxt', '@nuxtjs/seo', 'nuxt-site-config'],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://www.mindtheheadphone.com.br',
    name: 'Mind the Headphone',
    description: 'O maior canal dedicado a fones de ouvido do mundo!',
    defaultLocale: 'pt-BR'
  },

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
    '/recomendacoes/eletronicos': { prerender: true },
    '/recomendacoes/earphones': { prerender: true },
    '/recomendacoes/headphones': { prerender: true }
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
  },

  robots: {
    disallow: ['/admin/**', '/faq', '/sobre']
  },

  seo: {
    meta: {
      twitterCreator: '@mindheadphone'
    }
  },

  sitemap: {
    exclude: ['/admin/**', '/faq', '/sobre'],
    include: ['/', '/recomendacoes/**'],
    zeroRuntime: true
  }
});
