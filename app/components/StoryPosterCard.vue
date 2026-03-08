<template>
  <NuxtLink
    :to="`/stories/${story.meta?.slug}`"
    class="group relative block aspect-[3/4] overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300"
    data-testid="story-poster-card"
  >
    <NuxtImg
      :src="story.meta?.cover"
      :alt="`Cover: ${story.title}`"
      class="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
      loading="lazy"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-zinc-900/95 via-zinc-900/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity dark:from-zinc-950 dark:via-zinc-950/40"
    />
    <div class="absolute inset-0 flex flex-col justify-end p-6">
      <div class="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        <span v-if="story.meta?.category">{{ story.meta.category }}</span>
        <span v-if="story.meta?.readingTime">{{ story.meta.readingTime }}</span>
      </div>
      <h3 class="font-serif text-xl md:text-2xl font-bold text-zinc-100 mt-2 drop-shadow-md">
        {{ story.title }}
      </h3>
      <p
        class="mt-4 text-sm text-zinc-300 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        Read Story →
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  story: {
    title: string;
    meta?: {
      slug?: string;
      cover?: string;
      category?: string;
      readingTime?: string;
    };
  };
}>();
</script>
