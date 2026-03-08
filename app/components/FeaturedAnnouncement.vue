<template>
  <div
    class="featured-announcement border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-100 dark:bg-zinc-900"
    data-testid="home-featured-announcement"
  >
    <div class="p-8 md:p-12 lg:px-16 lg:pt-16 lg:pb-10 text-zinc-900 dark:text-zinc-100">
      <p class="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-4">
        New Stories on the Blog 📚
      </p>
      <p class="font-serif text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-snug">
        I'm excited to share something special.
      </p>
      <p class="mt-4 text-zinc-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl">
        Arun Hegde's stories are now part of this space too.
      </p>
      <p class="mt-4 text-zinc-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl">
        His writing brings a different voice and perspective that I'm really happy to feature here alongside mine.
      </p>
    </div>

    <div class="px-8 md:px-12 lg:px-16 pb-8 md:pb-12 lg:pb-16">
      <NuxtLink
        to="/stories"
        class="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors mb-4 inline-block"
      >
        Stories by Arun
      </NuxtLink>
      <div class="flex gap-3 overflow-x-auto pb-2 -mx-1">
        <NuxtLink
          v-for="(story, index) in stories"
          :key="story.meta?.slug ?? index"
          :to="`/stories/${story.meta?.slug}`"
          class="story-thumb flex-shrink-0 w-20 h-28 md:w-24 md:h-32 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 ring-0 hover:ring-2 hover:ring-zinc-400 dark:hover:ring-zinc-500 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:focus-visible:ring-zinc-400"
          :aria-label="`Read: ${story.title}`"
        >
          <NuxtImg
            v-if="story.meta?.cover"
            :src="story.meta.cover"
            :alt="story.title"
            class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
            loading="lazy"
            width="96"
            height="128"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-xs font-serif"
          >
            {{ story.title }}
          </div>
        </NuxtLink>
      </div>
      <NuxtLink
        to="/stories"
        class="mt-6 inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
      >
        Browse all stories
        <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stories: Array<{
    title: string;
    meta?: {
      slug?: string;
      cover?: string;
    };
  }>;
}>();
</script>
