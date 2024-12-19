<template>
  <div class="max-w-screen-md mx-auto space-y-8 py-8 divide-y divide-gray-400">
    <ContentRenderer v-if="home" :value="home" />
    <div v-else>Home not found</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
      <StoryCard
        v-for="(story, index) in stories"
        :key="index"
        :story="story"
      />
    </div>
    <UAlert class="text-sm">
      <template #description>
        Its built using my open source template
        <a
          href="https://github.com/aksharahegde/ink"
          target="_blank"
          class="underline"
          >Ink</a
        >.
      </template>
    </UAlert>
  </div>
</template>
<script setup lang="ts">
const { data: home } = await useAsyncData(() =>
  queryCollection("content").path("/").first()
);

const { data: stories } = await useAsyncData("stories", () =>
  queryCollection("summary").all()
);

const config = useRuntimeConfig();
const ogImage = `${config.public.baseURL}/og.png`;
useSeoMeta({
  ogTitle: home.value?.title,
  ogDescription: home.value?.description,
  ogUrl: config.public.baseURL,
  twitterTitle: home.value?.title,
  twitterDescription: home.value?.description,
  twitterImage: ogImage,
});
</script>
