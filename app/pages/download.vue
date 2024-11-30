<template>
  <div class="max-w-screen-md mx-auto py-8 space-y-8">
    <ContentRenderer v-if="main" :value="main" class="prose" />
    <div class="divide-y divide-gray-400 divide-dotted">
      <DownloadCard
        v-for="(story, index) in stories"
        :key="index"
        :story="story"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: main } = await useAsyncData(() =>
  queryCollection("content").path("/download").first()
);

const { data: stories } = await useAsyncData("stories", () =>
  queryCollection("summary").all()
);

console.log(main.value);

useSeoMeta({
  title: main.value?.title,
  description: main.value?.description,
});
</script>
