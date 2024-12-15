<template>
  <div
    class="border border-gray-800 shadow-lg rounded-lg overflow-hidden bg-white group relative"
  >
    <NuxtImg
      :src="cover"
      loading="lazy"
      alt="Cover Image"
      class="w-full md:w-1/3 h-full border border-l-0 border-t-0 border-gray-800 object-cover md:float-start transition-all duration-300 ease-in-out grayscale group-hover:grayscale-0"
    />
    <div class="p-4 flex flex-col text-left text-gray-900">
      <h3 class="text-2xl font-bold">
        <slot name="title" />
      </h3>
      <slot name="tagline" />
      <slot name="description" />
      <StoryActions :download="url" :slug="slug" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  cover: String,
  url: {
    type: String,
    required: true,
    default: "",
  },
  slug: {
    type: String,
    required: true,
    default: "",
  },
});
</script>
