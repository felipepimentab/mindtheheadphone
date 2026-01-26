const CHANNEL_NAME = 'Mind the Headphone';
const DESCRIPTION = 'O maior canal dedicado a fones de ouvido do mundo';
const CANONICAL_URL = 'https://www.mindtheheadphone.com.br';
const CHANNEL_URL = 'https://www.youtube.com/@MINDTHEHEADPHONE';
const INSTAGRAM_URL = 'https://www.instagram.com/mind.the.headphone/';
const LINKEDIN_URL = 'https://www.linkedin.com/in/leonardodrummond/';
const GITHUB_URL = 'https://github.com/felipepimentab/mindtheheadphone';
const TWITTER_URL = 'https://x.com/mindheadphone';
const BLOG_URL = 'https://old.mindtheheadphone.com.br';
const KUBA_URL = 'https://kuba.audio';
const WHATSAPP_URL = 'https://www.whatsapp.com/channel/0029VbBhzuQLtOj9cerbqT1R';
const TELEGRAM_URL = 'https://t.me/+wPzQUdcZRkFiNjYx';

export default defineAppConfig({
  channel: {
    id: 'UC7fN3sq7h2BDFtBrzXWo4Zg',
    name: CHANNEL_NAME,
    url: CHANNEL_URL
  },
  headerLinks: [
    {
      label: 'Canal',
      to: CHANNEL_URL,
      icon: 'i-lucide-youtube',
      alt: 'Canal no YouTube'
    },
    {
      label: 'Kuba',
      to: KUBA_URL,
      icon: 'i-lucide-headphones',
      alt: 'Kuba'
    }
  ],
  footerLinks: [
    {
      label: 'Instagram',
      to: INSTAGRAM_URL,
      icon: 'i-lucide-instagram'
    },
    {
      label: 'YouTube',
      to: CHANNEL_URL,
      icon: 'i-lucide-youtube'
    },
    {
      label: 'X',
      to: TWITTER_URL,
      icon: 'i-lucide-twitter'
    },
    {
      label: 'GitHub',
      to: GITHUB_URL,
      icon: 'i-lucide-github'
    }
  ],
  home: {
    hero: {
      title: 'Lista de recomendações',
      subtitle: 'Está procurando um fone e não sabe por onde começar? Conheça minhas listas de recomendações!',
      buttonLabel: 'Ver Listas de Recomendações',
      to: '/recomendacoes'
    },
    about: {
      title: 'Quem sou eu',
      subtitle: 'Muito prazer! Meu nome é Leonardo Drummond. Sempre fui apaixonado por música e áudio.',
      features: [
        {
          icon: 'i-lucide-rss',
          title: 'Blog',
          description: 'Em 2009 comecei a fazer avaliações de fones de ouvido no Orkut e depois criei um blog',
          url: BLOG_URL
        },
        {
          icon: 'i-lucide-youtube',
          title: 'YouTube',
          description: 'Em 2017 criei um canal no YouTube, que hoje é o maior canal do mundo dedicado a fones de ouvido.',
          url: CHANNEL_URL
        },
        {
          icon: 'i-lucide-headphones',
          title: 'Kuba',
          description: 'Em 2014, com minha sócia, Eduarda, também fundei a Kuba Audio, a primeira marca brasileira de headphones.',
          url: KUBA_URL
        }
      ]
    },
    groups: {
      title: 'Entre no nosso grupo de promoções',
      subtitle: 'Participe da comunidade para receber ofertas e dicas de fones de ouvido em tempo real.',
      links: [
        {
          label: 'WhatsApp',
          color: 'success',
          variant: 'soft',
          trailingIcon: 'i-simple-icons-whatsapp',
          size: 'xl',
          target: '_blank',
          to: WHATSAPP_URL
        },
        {
          label: 'Telegram',
          color: 'secondary',
          variant: 'soft',
          trailingIcon: 'i-simple-icons-telegram',
          size: 'xl',
          target: '_blank',
          to: TELEGRAM_URL
        }
      ]
    },
    kuba: {}
  },
  seo: {
    site: {
      url: CANONICAL_URL,
      name: CHANNEL_NAME,
      description: DESCRIPTION,
      defaultLocale: 'pt-BR'
    },
    organization: {
      name: CHANNEL_NAME,
      url: CANONICAL_URL,
      description: DESCRIPTION,
      email: 'comercial@mindtheheadphone.com.br',
      foundingDate: '2014-10-10',
      sameAs: [CHANNEL_URL],
      logo: {
        '@type': 'ImageObject',
        'url': '/icon-512.png'
      },
      founder: {
        '@id': '#leonardo-drummond'
      }
    },
    person: {
      '@id': '#leonardo-drummond',
      'name': 'Leonardo Drummond',
      'jobTitle': 'Criador de Conteúdo',
      'sameAs': [LINKEDIN_URL, INSTAGRAM_URL, TWITTER_URL],
      'affiliation': {
        '@id': '#identity'
      }
    }
  },
  ui: {
    colors: {
      'primary': 'mth',
      'neutral': 'neutral',
      'ss-energetico': 'yellow',
      'ss-natural': 'emerald',
      'ss-neutro-quente': 'orange',
      'ss-neutro-frio': 'cyan',
      'ss-musical': 'fuchsia',
      'ss-basshead': 'indigo',
      'ss-v-shaped': 'rose'
    },
    button: {
      slots: {
        base: 'font-bold cursor-pointer'
      },
      variants: {
        variant: {
          subtle: 'backdrop-blur-xs',
          soft: 'backdrop-blur-xs'
        }
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'soft',
          class: 'bg-primary/15 hover:bg-primary/20 backdrop-brightness-90 text-shadow-lg'
        }
      ]
    },
    blogPost: {
      slots: {
        title: 'line-clamp-3'
      }
    }
  }
});
