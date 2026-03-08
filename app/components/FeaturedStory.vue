<template>
  <NuxtLink
    :to="`/stories/${story.meta?.slug ?? story.slug}`"
    class="featured-story group block"
    data-testid="home-featured-story"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <!-- Image -->
      <div v-if="coverSrc" class="relative aspect-[4/3] overflow-hidden">
        <img
          :src="coverSrc"
          :alt="`Cover: ${story.title}`"
          class="absolute inset-0 w-full h-full object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.02]"
          loading="eager"
          style="filter: sepia(0.08) contrast(1.02);"
        />
      </div>
      <!-- Text -->
      <div class="flex flex-col justify-center">
        <p
          class="text-xs tracking-[0.2em] uppercase font-meta mb-4"
          style="color: var(--ink-accent);"
        >
          Featured Story
        </p>
        <h2
          class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
          style="color: var(--ink-text);"
        >
          {{ story.title }}
        </h2>
        <p
          class="mt-4 text-base leading-relaxed line-clamp-3"
          style="color: var(--ink-muted);"
        >
          {{ story.description }}
        </p>
        <div
          class="mt-6 flex flex-wrap items-center gap-4 text-xs tracking-wider uppercase font-meta"
          style="color: var(--ink-muted);"
        >
          <span v-if="story.meta?.category">
            {{ story.meta.category }}
          </span>
          <span v-if="readingTime">
            {{ readingTime }}
          </span>
        </div>
        <p
          class="mt-8 text-sm font-meta tracking-wide group-hover:tracking-wider transition-all duration-300"
          style="color: var(--ink-accent);"
        >
          Read Story &rarr;
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
    slug?: string;
    meta?: {
      slug?: string;
      cover?: string;
      category?: string;
      readingTime?: string;
    };
    cover?: string;
    body?: unknown;
  };
}>();

const coverSrc = computed(() => props.story.meta?.cover ?? props.story.cover ?? "");
const readingTime = computed(() => props.story.meta?.readingTime ?? null);
</script>
