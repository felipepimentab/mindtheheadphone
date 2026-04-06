<script lang="ts" setup>
useSeoMeta({
  titleTemplate: 'Mind the Headphone | %s',
  title: 'Site oficial e Listas de Recomendações'
});
</script>

<template>
  <UPage>
    <HomeHero />
    <HomeAbout />
    <!-- <HomeColors /> -->
    <div class="bg-default">
      <UPageSection title="Últimos vídeos">
        <template #default>
          <div class="flex flex-col lg:grid lg:grid-cols-3 gap-8">
            <HomeYoutube />
            <HomeKubaAlt />
          </div>
        </template>
      </UPageSection>
    </div>
    <HomeGroups />
    <HomeVideos />
    <HomeKuba />
    <HomeBlog />
    <HomeParcerias />
  </UPage>
</template>
