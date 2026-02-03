<script lang="ts" setup>
useSeoMeta({
  titleTemplate: '%s'
});
</script>

<template>
  <UPage>
    <HomeHero />
    <HomeAbout />
    <div class="bg-default">
      <UContainer class="py-16 sm:py-24 flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-y-16">
        <ui-text
          type="h2"
          class="text-center col-span-full"
        >
          Últimos vídeos
        </ui-text>
        <HomeYoutube />
        <HomeKubaAlt />
      </UContainer>
    </div>
    <HomeGroups />
    <HomeVideos />
    <HomeKuba />
    <HomeBlog />
    <HomeParcerias />
  </UPage>
</template>
