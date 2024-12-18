<template>
  <div
    class="max-w-screen-md mx-auto space-y-8 prose prose-img:hover:shadow-xl prose-img:shadow-lg prose-img:rounded-lg prose-img:h-96 dark:prose-invert"
  >
    <StoryBreadcrumb :current="story?.title" />
    <ContentRenderer v-if="story" :value="story" />
    <div v-else>Story not found</div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const { data: story } = await useAsyncData("stories", () =>
  queryCollection("stories")
    .path(route.path as string)
    .first()
);

const config = useRuntimeConfig();
const ogImage = `${config.public.baseURL}/og.png`;
useSeoMeta({
  title: story.value?.seo?.title,
  description: story.value?.seo?.description,
  ogTitle: story.value?.seo?.title,
  ogDescription: story.value?.seo?.description,
  ogUrl: config.public.baseURL,
  twitterTitle: story.value?.seo?.title,
  twitterDescription: story.value?.seo?.description,
  twitterImage: ogImage,
})
</script>
