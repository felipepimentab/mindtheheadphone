<template>
  <div>
    <div class="bg-cover bg-center bg-[url('/image/bg/earphones.jpg')]">
      <UPageSection
        title="Earphones"
        description="Os fones de ouvido que mais recomendo, organizados por categoria, assinatura sonora e faixa de preço."
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/earphones',
          variant: 'link',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l from-transparent to-bgc backdrop-brightness-85"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/headphones.jpg')]">
      <UPageSection
        title="Headphones"
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/headphones',
          variant: 'link',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-r from-transparent to-bgc backdrop-brightness-85"
        :reverse="true"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/speaker.jpg')]">
      <UPageSection
        title="Caixas de Som"
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/falantes',
          variant: 'link',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l from-transparent to-bgc backdrop-brightness-85"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/amplificadores.jpg')]">
      <UPageSection
        title="Amplificadores e DACs"
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/amplificadores',
          variant: 'link',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-r from-transparent to-bgc backdrop-brightness-85"
        :reverse="true"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/microfones.jpg')]">
      <UPageSection
        title="Microfones"
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/microfones',
          variant: 'link',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l from-transparent to-bgc backdrop-brightness-85"
      />
    </div>
  </div>
</template>
