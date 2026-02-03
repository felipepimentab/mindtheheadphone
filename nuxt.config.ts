import { defineOrganization } from 'nuxt-schema-org/schema';
// https://nuxt.com/docs/api/configuration/nuxt-config

const SEO_NAME = 'Mind the Headphone | Casa Oficial e Recomendações de Fones';
const SEO_DESCRIPTION = 'Bem-vindo à casa oficial do Mind the Headphone, o maior canal de fones de ouvido do mundo. Acesse as listas de recomendações e encontre o seu fone de ouvido ideal.';

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
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#0b0b0b' }
      ],
      meta: [
        { name: 'theme-color', content: '#0b0b0b' },
        { name: 'color-scheme', content: 'dark' },
        {}
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://www.mindtheheadphone.com.br',
    name: SEO_NAME,
    description: SEO_DESCRIPTION,
    defaultLocale: 'pt-BR'
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  },

  ui: {
    fonts: false,
    theme: {
      colors: [
        'primary',
        'secondary',
        'info',
        'success',
        'warning',
        'error',
        'ss-energetico',
        'ss-natural',
        'ss-neutro-quente',
        'ss-neutro-frio',
        'ss-musical',
        'ss-basshead',
        'ss-v-shaped'
      ]
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/recomendacoes': { prerender: true },
    '/recomendacoes/eletronicos': { prerender: true },
    '/recomendacoes/earphones': { prerender: true },
    '/recomendacoes/headphones': { prerender: true }
  },

  sourcemap: false,

  experimental: {
    appManifest: true
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

  image: {
    format: ['webp'],
    domains: ['https://3owp1lqte78l9dxq.public.blob.vercel-storage.com'],
    vercel: {
      formats: ['image/webp', 'image/avif']
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

  schemaOrg: {
    identity: defineOrganization({
      name: 'Mind the Headphone',
      url: 'https://www.mindtheheadphone.com.br',
      description: SEO_DESCRIPTION,
      email: 'comercial@mindtheheadphone.com.br',
      foundingDate: '2014-10-10',
      sameAs: [
        'https://www.youtube.com/@MINDTHEHEADPHONE',
        'https://www.instagram.com/mind.the.headphone/'
      ],
      logo: '/icon-512.png',
      founder: {
        '@id': '#/schema/person/#leonardo-drummond'
      }
    })
  },

  seo: {
    meta: {
      twitterCreator: '@mindheadphone',
      author: 'Leonardo Drummond'
    }
  },

  sitemap: {
    exclude: ['/admin/**', '/faq', '/sobre'],
    include: ['/', '/recomendacoes/**'],
    zeroRuntime: true
  }
});
