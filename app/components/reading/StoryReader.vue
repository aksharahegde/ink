<template>
  <div class="story-reader" :class="{ 'story-reader--book': mode === 'book' }">
    <ClientOnly v-if="mode === 'book'">
      <BookModeReader
        v-if="story"
        :story="story"
        :font-level="fontLevel"
      />
      <template #fallback>
        <ScrollStoryReader
          v-if="story"
          :story="story"
          :font-level="fontLevel"
        />
      </template>
    </ClientOnly>

    <ScrollStoryReader
      v-else-if="story"
      :story="story"
      :font-level="fontLevel"
    />
  </div>
</template>

<script setup lang="ts">
import BookModeReader from "~/components/reading/BookModeReader.vue";
import ScrollStoryReader from "~/components/reading/ScrollStoryReader.vue";

defineProps<{
  story: Record<string, unknown> | null;
  fontLevel: number;
}>();

const { mode } = useReadingMode();
</script>
