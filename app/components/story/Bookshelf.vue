<template>
  <div class="bookshelf" data-testid="stories-bookshelf">
    <StoryBookshelfShelf
      v-for="group in groups"
      :key="group.author"
      :author="group.author"
      :stories="group.stories"
    />
  </div>
</template>

<script setup lang="ts">
import type { BookshelfStory } from "~/types/bookshelf";

defineProps<{
  groups: { author: string; stories: BookshelfStory[] }[];
}>();
</script>
