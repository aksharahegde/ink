<template>
  <NuxtLink
    :to="`/stories/${story.meta?.slug ?? story.slug}`"
    class="story-row group block py-6 border-b transition-colors duration-200"
    :style="{ borderColor: 'var(--ink-border)' }"
    data-testid="story-poster-card"
  >
    <div class="flex gap-6 items-start">
      <!-- Text content -->
      <div class="flex-1 min-w-0">
        <div
          class="flex flex-wrap items-center gap-3 text-xs tracking-[0.15em] uppercase font-meta mb-2"
          style="color: var(--ink-muted);"
        >
          <span v-if="story.meta?.category">{{ story.meta.category }}</span>
          <span v-if="story.meta?.readingTime">{{ story.meta.readingTime }}</span>
        </div>
        <h3
          class="font-serif text-xl md:text-2xl font-bold leading-snug group-hover:opacity-75 transition-opacity duration-200"
          style="color: var(--ink-text);"
        >
          {{ story.title }}
        </h3>
        <p
          v-if="story.description"
          class="mt-2 text-sm leading-relaxed line-clamp-2"
          style="color: var(--ink-muted);"
        >
          {{ story.description }}
        </p>
      </div>
      <!-- Thumbnail -->
      <div
        v-if="coverSrc"
        class="hidden sm:block flex-shrink-0 w-24 h-24 md:w-28 md:h-28 overflow-hidden bg-stone-200 dark:bg-stone-800"
      >
        <img
          :src="coverSrc"
          :alt="`Cover: ${story.title}`"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          style="filter: sepia(0.05);"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  story: {
    title: string;
    description?: string;
    slug?: string;
    meta?: {
      slug?: string;
      cover?: string;
      category?: string;
      readingTime?: string;
    };
    cover?: string;
  };
}>();

const coverSrc = computed(() => props.story.meta?.cover ?? props.story.cover ?? "");
</script>
