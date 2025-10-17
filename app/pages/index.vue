<template>
  <UPage>
    <HomeHero />
    <HomeQuemSouEu />
    <div class="bg-muted bg-cover bg-center bg-[url('/image/bg-2.png')] bg-blend-multiply light:bg-blend-hard-light">
      <UContainer class="py-16 sm:py-24 lg:py-32 bg-blend-darken flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-y-16">
        <ui-text
          type="h2"
          class="text-center col-span-full"
        >
          Últimos vídeos
        </ui-text>
        <HomeYouTube />
        <HomeKubaAlt />
      </UContainer>
    </div>
    <HomeVideos />
    <HomeKuba />
    <HomeBlog />
    <HomeParcerias />
  </UPage>
</template>
