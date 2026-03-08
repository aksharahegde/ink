<template>
  <div
    class="featured-announcement border p-8 md:p-12"
    :style="{ borderColor: 'var(--ink-border)', backgroundColor: 'var(--ink-paper)' }"
    data-testid="home-featured-announcement"
  >
    <p
      class="text-xs font-meta tracking-[0.2em] uppercase mb-4"
      style="color: var(--ink-accent);"
    >
      New Stories on the Blog
    </p>
    <p
      class="font-serif text-2xl md:text-3xl font-bold tracking-tight leading-snug"
      style="color: var(--ink-text);"
    >
      I'm excited to share something special.
    </p>
    <p class="mt-4 text-base leading-relaxed max-w-2xl" style="color: var(--ink-muted);">
      Arun Hegde's stories are now part of this space too.
      His writing brings a different voice and perspective that I'm really happy to feature here alongside mine.
    </p>

    <div class="mt-8">
      <p
        class="text-xs font-meta tracking-[0.15em] uppercase mb-4"
        style="color: var(--ink-muted);"
      >
        Stories by Arun
      </p>
      <div class="flex gap-3 overflow-x-auto pb-2 -mx-1">
        <NuxtLink
          v-for="(story, index) in stories"
          :key="story.meta?.slug ?? index"
          :to="`/stories/${story.meta?.slug}`"
          class="story-thumb flex-shrink-0 w-20 h-28 md:w-24 md:h-32 overflow-hidden border transition-all duration-200 hover:opacity-80"
          :style="{ borderColor: 'var(--ink-border)' }"
          :aria-label="`Read: ${story.title}`"
        >
          <NuxtImg
            v-if="story.meta?.cover"
            :src="story.meta.cover"
            :alt="story.title"
            class="w-full h-full object-cover"
            loading="lazy"
            width="96"
            height="128"
            style="filter: sepia(0.05);"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-xs font-serif"
            style="color: var(--ink-muted);"
          >
            {{ story.title }}
          </div>
        </NuxtLink>
      </div>
      <NuxtLink
        to="/stories"
        class="mt-6 inline-flex items-center gap-2 text-sm font-meta tracking-wide hover:opacity-70 transition-opacity"
        style="color: var(--ink-accent);"
      >
        Browse all stories &rarr;
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
