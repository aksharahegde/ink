<template>
  <div class="max-w-screen-md mx-auto space-y-8 py-8">
    <div class="py-8 space-y-12">
      <StoryDetailCard
        v-for="(story, index) in stories"
        :key="index"
        :story="story"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const { data: stories } = await useAsyncData("stories", () =>
  queryCollection("summary").all()
);

useSeoMeta({
  title: 'Stories - Hedge Heart Beats',
  description: 'A collection of short stories from the heart by Akshara Hegde',
});
</script>
