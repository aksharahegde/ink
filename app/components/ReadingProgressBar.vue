<template>
  <div
    class="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-zinc-200 dark:bg-zinc-800 origin-left"
    role="progressbar"
    :aria-valuenow="Math.round(progress)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full bg-zinc-500 dark:bg-zinc-400 transition-all duration-150 ease-out"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>

<script setup lang="ts">
const progress = ref(0);

const updateProgress = () => {
  const win = typeof window === "undefined" ? null : window;
  if (!win) return;
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const total = scrollHeight - clientHeight;
  progress.value = total <= 0 ? 0 : (scrollTop / total) * 100;
};

onMounted(() => {
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", updateProgress);
  }
});
</script>
