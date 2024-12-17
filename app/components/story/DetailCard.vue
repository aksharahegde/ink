<template>
  <div
    class="border border-gray-800 shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900 group relative"
  >
    <NuxtImg
      :src="story.meta?.cover"
      alt="Cover Image"
      class="w-full md:w-1/3 h-full max-h-96 border border-l-0 border-t-0 border-gray-800 object-cover md:float-start transition-all duration-300 ease-in-out grayscale group-hover:grayscale-0"
      loading="lazy"
    />
    <div class="w-2/3 flex flex-col p-4">
      <h3 class="text-lg font-bold">{{ story.title }}</h3>
      <div class="text-sm text-gray-500 dark:text-gray-300">
        <ContentRenderer v-if="story.body" :value="story.body" />
      </div>
      <StoryActions :download="story.meta?.download" :slug="story.meta?.slug" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  story: any;
}>();
</script>
