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
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l from-transparent to-bgc backdrop-brightness-55 lg:backdrop-brightness-85"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/headphones.jpg')]">
      <UPageSection
        title="Headphones"
        description="Os fones de ouvido que mais recomendo, organizados por categoria, assinatura sonora e faixa de preço."
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/headphones',
          variant: 'link',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l lg:bg-linear-to-r from-transparent to-bgc backdrop-brightness-55 lg:backdrop-brightness-85"
        :reverse="true"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/speaker.jpg')]">
      <UPageSection
        title="Caixas de Som"
        description="As caixas de som que mais recomendo, organizadas por categoria e faixa de preço."
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/falantes',
          variant: 'link',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l from-transparent to-bgc backdrop-brightness-45 lg:backdrop-brightness-85"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/banner-ciclo.jpg')]">
      <UPageSection
        title="Amplificadores e DACs"
        description="Os amplificadores e DACs que mais recomendo, organizados por categoria e faixa de preço."
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/amplificadores',
          variant: 'link',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l lg:bg-linear-to-r from-transparent to-bgc backdrop-brightness-45 lg:backdrop-brightness-85"
        :reverse="true"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/microfones.jpg')]">
      <UPageSection
        title="Microfones"
        description="Os microfones que mais recomendo, organizados por categoria e faixa de preço."
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/microfones',
          variant: 'link',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l from-transparent to-bgc backdrop-brightness-55 lg:backdrop-brightness-85"
      />
    </div>
  </div>
</template>
