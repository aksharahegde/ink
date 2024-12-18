<template>
  <div class="max-w-screen-md mx-auto space-y-8">
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

const config = useRuntimeConfig();
const ogImage = `${config.public.baseURL}/og.png`;
useSeoMeta({
  ogTitle: `${config.public.siteName} - Stories`,
  ogDescription: `A collection of short stories from the heart by ${config.public.ownerName}`,
  ogUrl: config.public.baseURL,
  twitterTitle: `${config.public.siteName} - Stories`,
  twitterDescription: `A collection of short stories from the heart by ${config.public.ownerName}`,
  twitterImage: ogImage,
})
</script>
