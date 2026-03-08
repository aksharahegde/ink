<template>
  <NuxtLink
    :to="`/stories/${story.meta?.slug}`"
    class="featured-story group block border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-100 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
    data-testid="home-featured-story"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] lg:min-h-[480px]">
      <div class="relative min-w-0 aspect-[4/3] lg:aspect-[4/3] lg:min-h-[480px] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
        <NuxtImg
          :src="story.meta?.cover"
          :alt="`Cover: ${story.title}`"
          class="absolute inset-0 w-full h-full object-cover object-left-top grayscale group-hover:grayscale-0 transition-all duration-500"
          loading="eager"
        />
      </div>
      <div
        class="relative z-10 min-w-0 flex flex-col justify-center p-8 md:p-12 text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900"
      >
        <h2 class="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          {{ story.title }}
        </h2>
        <p class="mt-4 text-zinc-600 dark:text-zinc-400 text-base leading-relaxed line-clamp-3">
          {{ story.description }}
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
          <span v-if="story.meta?.category" class="uppercase tracking-wider">
            {{ story.meta.category }}
          </span>
          <span v-if="readingTime" class="flex items-center gap-1">
            {{ readingTime }}
          </span>
        </div>
        <p class="mt-8 text-zinc-600 dark:text-zinc-400 text-sm font-medium group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
          Read Story →
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  story: {
    title: string;
    description?: string;
    meta?: {
      slug?: string;
      cover?: string;
      category?: string;
      readingTime?: string;
    };
    body?: unknown;
  };
}>();

const readingTime = computed(() => props.story.meta?.readingTime ?? null);
</script>
