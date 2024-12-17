<template>
  <div
    class="max-w-sm w-full mx-auto border border-gray-800 shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900 group relative"
  >
    <NuxtImg
      :src="story.meta?.cover"
      :alt="`Cover of ${story.meta?.title}`"
      class="w-full h-64 object-cover border-b border-gray-800 grayscale group-hover:grayscale-0 transition-all duration-300 ease-in-out"
      loading="lazy"
    />
    <div class="p-4">
      <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ story.title }}</h2>
      <p class="text-gray-700 dark:text-gray-300 text-sm mt-2">
        {{ story.description }}
      </p>
      <StoryActions :download="story.meta?.download" :slug="story.meta?.slug" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  story: any;
}>();
</script>
