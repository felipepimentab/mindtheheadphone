<template>
  <div>
    <div class="bg-cover bg-center bg-[url('/image/bg/banner-kali.jpg')]">
      <UPageSection
        title="Earphones"
        description="Os fones de ouvido que mais recomendo, organizados por categoria, assinatura sonora e faixa de preço."
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/earphones',
          variant: 'ghost',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l from-transparent to-bgc"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/banner-suporte.jpg')]">
      <UPageSection
        title="Headphones"
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/headphones',
          variant: 'ghost',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-r from-transparent to-bgc backdrop-brightness-85"
        :reverse="true"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/banner-speaker.jpg')]">
      <UPageSection
        title="Microfones e Caixas de Som"
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/microfones',
          variant: 'ghost',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l from-transparent to-bgc"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg-recomendacoes.jpg')]">
      <UPageSection
        title="Amplificadores e DACs"
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/amplificadores',
          variant: 'ghost',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-r from-transparent to-bgc backdrop-brightness-85"
        :reverse="true"
      />
    </div>
  </div>
</template>
