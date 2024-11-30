<template>
  <div class="max-w-screen-md mx-auto space-y-8 py-8 divide-y divide-gray-400">
    <ContentRenderer v-if="home" :value="home" />
    <div v-else>Home not found</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
      <NuxtLink
        v-for="(story, index) in stories"
        :key="index"
        :to="`/stories/${story.meta?.slug}`"
      >
        <StoryCard :story="story" />
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
const { data: home } = await useAsyncData(() =>
  queryCollection("content").path("/").first()
);

const { data: stories } = await useAsyncData("stories", () =>
  queryCollection("summary").all()
);

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
});
</script>
