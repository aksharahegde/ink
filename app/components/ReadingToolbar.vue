<template>
  <div
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-0.5 p-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg"
    role="toolbar"
    aria-label="Reading controls"
  >
    <button
      type="button"
      class="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-40 disabled:pointer-events-none"
      aria-label="Decrease font size"
      :disabled="fontLevel <= minLevel"
      @click="decrease"
    >
      <UIcon name="i-heroicons-minus" class="w-4 h-4" />
    </button>
    <button
      type="button"
      class="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-40 disabled:pointer-events-none"
      aria-label="Increase font size"
      :disabled="fontLevel >= maxLevel"
      @click="increase"
    >
      <UIcon name="i-heroicons-plus" class="w-4 h-4" />
    </button>
    <div class="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-0.5" aria-hidden="true" />
    <button
      type="button"
      class="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="isDark = !isDark"
    >
      <UIcon :name="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" class="w-4 h-4" />
    </button>
    <div class="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-0.5" aria-hidden="true" />
    <button
      type="button"
      class="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      aria-label="Share story"
      @click="onShare"
    >
      <UIcon name="i-heroicons-share" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useReadingFontSize } from "~/composables/useReadingFontSize";

const props = defineProps<{
  shareTitle: string;
  shareUrl: string;
}>();

const { level: fontLevel, increase, decrease, MIN: minLevel, MAX: maxLevel } = useReadingFontSize();
const colorMode = useColorMode();
const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (v: boolean) => { colorMode.preference = v ? "dark" : "light"; },
});

async function onShare() {
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: props.shareTitle, url: props.shareUrl });
    } else {
      await copyLink();
    }
  } catch (err) {
    if ((err as Error).name !== "AbortError") await copyLink();
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.shareUrl);
  } catch {
    /**/
  }
}
</script>
