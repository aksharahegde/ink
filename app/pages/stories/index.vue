<template>
  <div class="view-transition max-w-6xl mx-auto px-4 py-12">
    <h1 class="font-serif text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
      Stories
    </h1>
    <p class="text-zinc-600 dark:text-zinc-500 mb-12">
      A collection of narrative stories by Akshara Hegde.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StoryPosterCard
        v-for="(story, index) in stories"
        :key="story.meta?.slug ?? index"
        :story="story"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: stories } = await useAsyncData("stories", () =>
  queryCollection("summary").all()
);

const config = useRuntimeConfig();
const ogImage = `${config.public.baseURL}/og.png`;
useSeoMeta({
  ogTitle: `${config.public.siteName} - Stories`,
  ogDescription: `A collection of short stories from the heart by ${config.public.ownerName}`,
  ogUrl: config.public.baseURL,
  twitterTitle: `${config.public.siteName} - Stories`,
  twitterDescription: `A collection of short stories from the heart by ${config.public.ownerName}`,
  twitterImage: ogImage,
});
</script>
