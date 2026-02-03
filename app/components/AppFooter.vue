<script lang="ts" setup>
import type { FooterColumn, FooterColumnLink } from '@nuxt/ui';

const columns: FooterColumn<FooterColumnLink>[] = [
  {
    label: 'Listas de Recomendações',
    children: [
      {
        label: 'Earphones',
        to: '/recomendacoes/earphones'
      },
      {
        label: 'Headphones',
        to: '/recomendacoes/headphones'
      },
      {
        label: 'Eletrônicos',
        to: '/recomendacoes/eletronicos'
      }
    ]
  },
  {
    label: 'Outros',
    children: [
      {
        label: 'Perguntas frequentes',
        to: '/faq'
      },
      {
        label: 'Kuba',
        to: 'https://kuba.audio',
        target: '_blank'
      },
      {
        label: 'Blog antigo',
        to: 'https://old.mindtheheadphone.com.br/',
        target: '_blank'
      }
    ]
  },
  {
    label: 'Institucional',
    children: [
      {
        label: 'Política de Privacidade',
        to: '/politica-de-privacidade'
      },
      {
        label: 'Termos de Uso',
        to: '/termos-de-uso'
      }
    ]
  },
  {
    label: 'Redes sociais',
    children: [
      {
        label: '@mind.the.headphone',
        to: 'https://www.instagram.com/mind.the.headphone',
        icon: 'i-simple-icons-instagram',
        target: '_blank'
      },
      {
        label: '@mindtheheadphone',
        to: 'https://www.youtube.com/@mindtheheadphone',
        icon: 'i-simple-icons-youtube',
        target: '_blank'
      },
      {
        label: '@mindheadphone',
        to: 'https://x.com/mindheadphone',
        icon: 'i-simple-icons-x',
        target: '_blank'
      }
    ]
  }
];
</script>

<template>
  <UFooter>
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #left>
            <div class="flex flex-col items-start w-fit gap-y-4">
              <LogoMTH />
              <p class="text-sm text-muted">
                O maior canal dedicado a fones de ouvido do mundo!
              </p>
              <p class="text-sm text-dimmed">
                Vídeos segunda, quarta e sexta às 18h.
              </p>
            </div>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>
    <template #left>
      <div class="text-sm text-toned">
        <span>
          &copy; 2026 Mind The Headphone. Todos os direitos reservados.
        </span>
      </div>
    </template>

    <template #right>
      <ULink
        to="https://felipepimenta.dev"
        target="_blank"
        class="text-sm italic"
        external
      >
        Feito por Felipe Pimenta.
      </ULink>
    </template>
  </UFooter>
</template>
