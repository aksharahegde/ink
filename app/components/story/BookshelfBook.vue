<template>
  <NuxtLink
    :to="`/stories/${slug}`"
    class="bookshelf-book bookshelf-book--cover"
    :class="{ 'bookshelf-book--placeholder': !hasCover }"
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
      <span class="bookshelf-book-plate-rule" aria-hidden="true" />
      <span class="bookshelf-book-plate-title font-serif">
        {{ story.title }}
      </span>
    </template>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BookshelfStory } from "~/types/bookshelf";

// Muted parchment tints for generated covers. Paired paper background + ink
// foreground, kept low-saturation to sit calmly on the shelf.
const PLATE_PALETTE = [
  { bg: "#efe7d6", text: "#3a2f24" },
  { bg: "#e7ddca", text: "#3d3326" },
  { bg: "#e2e6dc", text: "#31382e" },
  { bg: "#dde4e6", text: "#2c363a" },
  { bg: "#ece3d2", text: "#413524" },
  { bg: "#e8ded6", text: "#3b3029" },
  { bg: "#dfe2df", text: "#303733" },
  { bg: "#eae2d3", text: "#3a3122" },
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
  return PLATE_PALETTE[hashString(seed) % PLATE_PALETTE.length] ?? PLATE_PALETTE[0];
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
  };
});
</script>
