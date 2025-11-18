<script setup lang="ts">
const show = ref(false);

function onScroll() {
  show.value = window.scrollY > 200;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => window.addEventListener('scroll', onScroll));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed right-16 bottom-16 z-50"
    >
      <UButton
        icon="i-lucide-arrow-up"
        variant="soft"
        size="xl"
        aria-label="Voltar ao topo"
        class="button-arrow-up cursor-pointer"
        @click="scrollToTop"
      />
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.button-arrow-up:hover::before {
  content: "Voltar ao topo";
}
</style>
