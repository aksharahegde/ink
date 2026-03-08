<template>
  <div
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-0.5 p-1 border shadow-lg font-meta"
    :style="{
      backgroundColor: 'var(--ink-paper)',
      borderColor: 'var(--ink-border)',
      borderRadius: '9999px',
    }"
    role="toolbar"
    aria-label="Reading controls"
  >
    <button
      type="button"
      class="p-2 rounded-full transition-opacity hover:opacity-70 disabled:opacity-30 disabled:pointer-events-none"
      :style="{ color: 'var(--ink-muted)' }"
      aria-label="Decrease font size"
      :disabled="fontLevel <= minLevel"
      @click="decrease"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
    </button>
    <button
      type="button"
      class="p-2 rounded-full transition-opacity hover:opacity-70 disabled:opacity-30 disabled:pointer-events-none"
      :style="{ color: 'var(--ink-muted)' }"
      aria-label="Increase font size"
      :disabled="fontLevel >= maxLevel"
      @click="increase"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
    </button>
    <div class="w-px h-5 mx-0.5" :style="{ backgroundColor: 'var(--ink-border)' }" aria-hidden="true" />
    <button
      type="button"
      class="p-2 rounded-full transition-opacity hover:opacity-70"
      :style="{ color: 'var(--ink-muted)' }"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="isDark = !isDark"
    >
      <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
    </button>
    <div class="w-px h-5 mx-0.5" :style="{ backgroundColor: 'var(--ink-border)' }" aria-hidden="true" />
    <button
      type="button"
      class="p-2 rounded-full transition-opacity hover:opacity-70"
      :style="{ color: 'var(--ink-muted)' }"
      aria-label="Share story"
      @click="onShare"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
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
