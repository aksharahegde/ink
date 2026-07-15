<template>
  <NuxtLink
    :to="`/stories/${slug}`"
    class="bookshelf-book"
    :class="hasCover ? 'bookshelf-book--cover' : 'bookshelf-book--spine'"
    :style="bookStyle"
    :data-testid="`stories-book-row-${slug}`"
    :aria-label="story.title"
  >
    <template v-if="hasCover">
      <img
        :src="coverSrc"
        :alt="`Cover: ${story.title}`"
        class="bookshelf-book-cover-img"
        loading="lazy"
      />
      <span class="bookshelf-book-cover-title font-serif">
        {{ story.title }}
      </span>
    </template>
    <template v-else>
      <span class="bookshelf-book-spine-title font-serif">
        {{ story.title }}
      </span>
    </template>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BookshelfStory } from "~/types/bookshelf";

const SPINE_PALETTE = [
  { bg: "#3f2a1f", text: "#f3e6d4" },
  { bg: "#5c2e1f", text: "#f6ece0" },
  { bg: "#2f3a2c", text: "#e8ecdf" },
  { bg: "#1f2f3a", text: "#e4ecf2" },
  { bg: "#4a3b28", text: "#f0e6d4" },
  { bg: "#6b3a2a", text: "#f7ebe1" },
  { bg: "#2a3338", text: "#e8eef1" },
  { bg: "#513c2a", text: "#f4ebdf" },
] as const;

const props = defineProps<{
  story: BookshelfStory;
}>();

const slug = computed(
  () => props.story.meta?.slug ?? props.story.slug ?? ""
);

const coverSrc = computed(
  () => props.story.meta?.cover ?? props.story.cover ?? ""
);

const hasCover = computed(() => Boolean(coverSrc.value));

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const palette = computed(() => {
  const seed = slug.value || props.story.title;
  return SPINE_PALETTE[hashString(seed) % SPINE_PALETTE.length] ?? SPINE_PALETTE[0];
});

const spineWidth = computed(() => {
  const seed = slug.value || props.story.title;
  return 52 + (hashString(seed) % 26);
});

const bookStyle = computed(() => {
  if (hasCover.value) {
    return {
      "--book-bg": "var(--ink-paper)",
      "--book-fg": "var(--ink-text)",
    };
  }

  return {
    "--book-bg": palette.value.bg,
    "--book-fg": palette.value.text,
    "--book-spine-width": `${spineWidth.value}px`,
  };
});
</script>
