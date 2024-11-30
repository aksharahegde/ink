<template>
  <div
    class="max-w-sm w-full mx-auto border border-gray-800 shadow-lg rounded-lg overflow-hidden bg-white group relative"
  >
    <img
      :src="story.meta?.cover"
      :alt="`Cover of ${story.meta?.title}`"
      class="w-full h-64 object-cover border-b border-gray-800 grayscale group-hover:grayscale-0 transition-all duration-300 ease-in-out"
    />
    <div class="p-4">
      <h2 class="text-lg font-bold text-gray-900">{{ story.title }}</h2>
      <p class="text-gray-700 text-sm mt-2">
        {{ story.description }}
      </p>
      <div
        class="absolute bottom-0 left-0 flex justify-between items-center w-full bg-gray-200 px-4 py-2 border-t border-gray-800 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300"
      >
        <UButton
          :to="story.meta?.download"
          external
          variant="outline"
          color="black"
          label="Download"
        />
        <UButton
          label="Read now"
          :to="`/stories/${story.meta?.slug}`"
          variant="solid"
          color="black"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  story: any;
}>();
</script>
