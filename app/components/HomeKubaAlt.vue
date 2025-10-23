<template>
  <UCard variant="outline">
    <div class="flex flex-col justify-center items-center gap-y-5 lg:gap-y-12">
      <h2 class="text-2xl sm:text-3xl text-pretty tracking-tight font-bold text-center text-toned">
        Conheça minha marca de fones
      </h2>
      <NuxtImg
        src="/image/kuba/logo-white.png"
        alt="Logo Kuba"
        class="w-24 sm:w-32"
        loading="lazy"
      />
      <NuxtImg
        src="/image/kuba/hp-d2.png"
        alt="Headphone Kuba Disco 2"
        width="336"
        height="336"
        loading="lazy"
      />
      <UButton
        variant="subtle"
        color="success"
        to="https://kuba.audio"
        target="_blank"
        size="xl"
      >
        Acesse o site
      </UButton>
    </div>
  </UCard>
</template>
