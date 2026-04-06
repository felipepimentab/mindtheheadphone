<script lang="ts" setup>
interface Info {
  img: string
  name: string
  band: string
  album: string
}

defineProps<{
  list: ('1' | '0')[]
  show: boolean
  info: Info
  song: 1 | 2 | 3 | 4 | 5
}>();
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <AudioSong
      :img="info.img"
      :name="info.name"
      :band="info.band"
      :album="info.album"
    />
    <div class="flex flex-col gap-y-2">
      <AudioSample
        v-for="index in 4"
        :key="index"
        :song="song"
        :lossless="list[index-1] === '1'"
        :show="show"
      />
    </div>
  </div>
</template>
