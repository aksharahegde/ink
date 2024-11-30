<template>
  <div class="max-w-screen-md mx-auto space-y-8 prose">
    <ContentRenderer v-if="story" :value="story" />
    <div v-else>Story not found</div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const { data: story } = await useAsyncData("stories", () =>
  queryCollection("stories").path(route.path as string).first()
);

useSeoMeta({
  title: story.value?.title,
  description: story.value?.description,
});
</script>
