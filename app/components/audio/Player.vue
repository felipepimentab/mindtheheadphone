<script lang="ts" setup>
const { song, lossless } = defineProps<{
  song: 1 | 2 | 3 | 4 | 5
  lossless: boolean
}>();

const songSrc = () => {
  const type = lossless ? 'l' : 'm';
  return `/amostras/s${song}-${type}.wav`;
};

const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const progress = ref(0);

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const togglePlayback = async () => {
  if (!audioRef.value) return;

  if (isPlaying.value) {
    audioRef.value.pause();
    isPlaying.value = false;
  } else {
    try {
      await audioRef.value.play();
      isPlaying.value = true;
    } catch (error) {
      console.error(error);
      isPlaying.value = false;
    }
  }
};

const updateProgress = () => {
  if (!audioRef.value) return;

  const { currentTime, duration } = audioRef.value;
  progress.value = duration ? (currentTime / duration) * 100 : 0;
};

const seekToProgress = (nextProgress: number) => {
  if (!audioRef.value) return;

  const duration = audioRef.value.duration;
  const clampedProgress = clamp(nextProgress, 0, 100);
  progress.value = clampedProgress;

  if (!duration) return;
  audioRef.value.currentTime = (clampedProgress / 100) * duration;
};

const onSeekInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const nextProgress = Number(target.value);

  if (Number.isNaN(nextProgress)) return;
  seekToProgress(nextProgress);
};

const handleEnded = () => {
  isPlaying.value = false;
  progress.value = 100;
};

const AUDIO_CONTROL_SIZE = 'xs' as const;
</script>

<template>
  <div class="flex items-center gap-x-4 min-w-30">
    <UButton
      :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
      color="neutral"
      variant="link"
      :size="AUDIO_CONTROL_SIZE"
      @click="togglePlayback"
    />

    <div class="relative flex-1">
      <UProgress
        :model-value="progress"
        :size="AUDIO_CONTROL_SIZE"
        color="neutral"
      />
      <input
        class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        type="range"
        min="0"
        max="100"
        step="0.1"
        :value="progress"
        aria-label="Seek audio playback"
        @input="onSeekInput"
      >
    </div>

    <audio
      ref="audioRef"
      :src="songSrc()"
      @timeupdate="updateProgress"
      @ended="handleEnded"
    />
  </div>
</template>
