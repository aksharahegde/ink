<template>
  <div class="gap-4 flex">
    <img
      :src="story.meta?.cover"
      alt="Cover Image"
      class="m-0 w-1/3 h-72 border border-gray-500 p-1 hover:animate-pulse"
    />
    <div class="w-2/3 flex flex-col">
      <h3 class="text-lg font-bold">{{ story.title }}</h3>
      <div class="text-sm text-gray-500">
        <ContentRenderer v-if="story.body" :value="story.body" />
      </div>
      <div class="flex flex-wrap gap-4 pt-4">
        <UButton color="black" :to="`/stories/${story.meta?.slug}`"> Read More </UButton>
        <UButton color="black" variant="outline" :to="story.meta?.download">
          Download
        </UButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  story: any;
}>();
</script>
