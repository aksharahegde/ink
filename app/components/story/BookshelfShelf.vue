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
const SPINE_BASE = 52;
const SPINE_VARIANCE = 26;
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

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function storyWidth(story: BookshelfStory) {
  const cover = story.meta?.cover ?? story.cover;
  if (cover) return COVER_WIDTH;
  const seed = story.meta?.slug ?? story.slug ?? story.title;
  return SPINE_BASE + (hashString(seed) % SPINE_VARIANCE);
}

const storyRows = computed(() => {
  const available = Math.max(shelfWidth.value - BAY_PAD, COVER_WIDTH);
  const rows: BookshelfStory[][] = [];
  let current: BookshelfStory[] = [];
  let used = 0;

  for (const story of props.stories) {
    const width = storyWidth(story);
    const next = current.length === 0 ? width : used + BOOK_GAP + width;
    if (current.length > 0 && next > available) {
      rows.push(current);
      current = [story];
      used = width;
      continue;
    }
    current.push(story);
    used = next;
  }

  if (current.length > 0) rows.push(current);
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
