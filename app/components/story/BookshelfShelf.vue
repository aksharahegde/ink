<template>
  <section
    class="bookshelf-shelf"
    :data-testid="`stories-shelf-row-${authorSlug}`"
  >
    <h2 class="bookshelf-shelf-label font-serif">
      {{ author }}
    </h2>
    <div ref="shelfRoot" class="bookshelf-shelf-rows">
      <div
        v-for="(row, rowIndex) in storyRows"
        :key="rowIndex"
        class="bookshelf-shelf-bay"
      >
        <div class="bookshelf-shelf-books">
          <StoryBookshelfBook
            v-for="(story, index) in row"
            :key="story.meta?.slug ?? story.slug ?? index"
            :story="story"
          />
        </div>
        <div class="bookshelf-shelf-plank" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { BookshelfStory } from "~/types/bookshelf";

const COVER_WIDTH = 128;
const BOOK_GAP = 10;
const BAY_PAD = 40;

const props = defineProps<{
  author: string;
  stories: BookshelfStory[];
}>();

const shelfRoot = ref<HTMLElement | null>(null);
const shelfWidth = ref(720);

const authorSlug = computed(() =>
  props.author
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "author"
);

// Books are now a uniform cover width, so rows are a simple fixed-size chunk of
// however many covers fit across the measured shelf width.
const storyRows = computed(() => {
  const available = Math.max(shelfWidth.value - BAY_PAD, COVER_WIDTH);
  const columns = Math.max(
    1,
    Math.floor((available + BOOK_GAP) / (COVER_WIDTH + BOOK_GAP))
  );

  const rows: BookshelfStory[][] = [];
  for (let i = 0; i < props.stories.length; i += columns) {
    rows.push(props.stories.slice(i, i + columns));
  }
  return rows;
});

let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  if (!shelfRoot.value) return;
  shelfWidth.value = shelfRoot.value.clientWidth || 720;
  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    shelfWidth.value = entry.contentRect.width;
  });
  resizeObserver.observe(shelfRoot.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>
