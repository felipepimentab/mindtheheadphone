<template>
  <div>
    <!-- <div class="bg-cover bg-center bg-[url('/image/bg/banner-suporte.jpg')]">
      <div class="bg-linear-to-b from-transparent to-default backdrop-brightness-75">
        <UPageSection>
          <template #title>
            <h1>
              Listas de recomendações
            </h1>
          </template>
          <template #description>
            <span class="text-highlighted">
              Recomendações de diferentes tipos de produtos relacionados a audio
            </span>
          </template>
        </UPageSection>
      </div>
    </div> -->
    <div class="bg-cover bg-center bg-[url('/image/bg/banner-kali.jpg')]">
      <UPageSection
        title="Headphones e Earphones"
        description="Os fones de ouvido que mais recomendo, organizados por categoria, assinatura sonora e faixa de preço."
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/headphones',
          variant: 'ghost',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l from-transparent to-black"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg-recomendacoes.jpg')]">
      <UPageSection
        title="Amplificadores e DACs"
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/headphones',
          variant: 'ghost',
          trailingIcon: 'i-lucide-arrow-right',
          disabled: true
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-r from-transparent to-black backdrop-brightness-85"
        :reverse="true"
      />
    </div>
    <div class="bg-cover bg-center bg-[url('/image/bg/banner-suporte.jpg')]">
      <UPageSection
        title="Microfones e Caixas de Som"
        orientation="horizontal"
        :links="[{
          label: 'Ver lista de recomendações',
          to: '/recomendacoes/headphones',
          variant: 'ghost',
          trailingIcon: 'i-lucide-arrow-right',
          disabled: true
        }]"
        class="py-4 sm:py-6 lg:py-8 bg-linear-to-l from-transparent to-black"
      />
    </div>
  </div>
</template>
