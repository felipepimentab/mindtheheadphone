<script setup lang="ts">
const title = 'Teste Cego LDAC vs MP3';
const description = 'Faça um teste cego entre LDAC e MP3 com 4 players embaralhados e descubra se você realmente consegue identificar áudio sem perdas. Compare, marque e confira seu resultado.';

useSeoMeta({ title, description });

const showResults = ref(false);

function toggleResults() {
  showResults.value = !showResults.value;
}

const song1 = ref(randomBooleans());
const song2 = ref(randomBooleans());
const song3 = ref(randomBooleans());
const song4 = ref(randomBooleans());
const song5 = ref(randomBooleans());

function restart() {
  showResults.value = false;
  song1.value = randomBooleans();
  song2.value = randomBooleans();
  song3.value = randomBooleans();
  song4.value = randomBooleans();
  song5.value = randomBooleans();
}

function randomBooleans(size = 4) {
  const arr = Array.from({ length: size }, () => Math.random() < 0.5 ? '1' : '0');

  if (arr.every(v => v === arr[0])) {
    arr[Math.floor(Math.random() * 4)] = arr[0] === '1' ? '0' : '1';
  }

  return arr;
}
</script>

<template>
  <UPage>
    <!-- Header -->
    <div class="bg-cover bg-center bg-[url('/image/bg/daw.jpg')]">
      <UPageHero
        :title="title"
        :description="description"
        orientation="horizontal"
        class="bg-linear-to-b from-bgc/40 to-bgc max-md:backdrop-blur-xs"
      />
    </div>

    <!-- Tutorial -->
    <AudioTutorial />

    <!-- Samples -->
    <UContainer class="py-16 sm:py-24 lg:py-32 flex flex-col gap-y-16">
      <AudioGroup
        :info="{
          img: '/albums/ram.jpg',
          name: 'Get Lucky',
          band: 'Daft Punk',
          album: 'Random Access Memories'
        }"
        :song="1"
        :list="song1"
        :show="showResults"
      />
      <AudioGroup
        :info="{
          img: '/albums/havana.jpg',
          name: 'Havana Cafe',
          band: 'Paquito D\' Rivera',
          album: 'Havana Cafe'
        }"
        :song="2"
        :list="song2"
        :show="showResults"
      />
      <AudioGroup
        :info="{
          img: '/albums/time-and-place.jpg',
          name: 'The Man Who Sold the World',
          band: 'Claire Martin',
          album: 'Time & Place'
        }"
        :song="3"
        :list="song3"
        :show="showResults"
      />
      <AudioGroup
        :info="{
          img: '/albums/smother.jpg',
          name: 'Loop the Loop',
          band: 'Wild Beasts',
          album: 'Smother'
        }"
        :song="4"
        :list="song4"
        :show="showResults"
      />
      <AudioGroup
        :info="{
          img: '/albums/californication.jpg',
          name: 'Scar Tissue',
          band: 'Red Hot Chili Peppers',
          album: 'Californication'
        }"
        :song="5"
        :list="song5"
        :show="showResults"
      />

      <!-- Buttons -->
      <div class="flex w-full justify-start gap-x-2">
        <UButton
          label="Ver resultados"
          variant="soft"
          color="neutral"
          size="xl"
          trailing-icon="i-lucide-list-check"
          @click="toggleResults()"
        />
        <UButton
          label="Recomeçar"
          variant="ghost"
          color="neutral"
          size="xl"
          icon="i-lucide-undo-2"
          @click="restart()"
        />
      </div>
    </UContainer>
  </UPage>
</template>
