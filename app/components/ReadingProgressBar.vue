<template>
  <div
    class="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
    :style="{ backgroundColor: 'var(--ink-border)' }"
    role="progressbar"
    :aria-valuenow="Math.round(progress)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full transition-all duration-150 ease-out"
      :style="{ width: `${progress}%`, backgroundColor: 'var(--ink-accent)' }"
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
