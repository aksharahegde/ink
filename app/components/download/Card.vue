<template>
  <div class="flex flex-col md:flex-row items-start py-4">
    <!-- Book Image -->
    <img
      :src="story.meta?.cover"
      :alt="`Cover of ${story.meta?.title}`"
      class="md:w-24 md:h-32 w-1/2 h-44 object-cover"
    />
    <!-- Book Details -->
    <div class="flex-1 md:px-4">
      <h2 class="text-lg font-bold text-gray-900 mt-2 md:mt-0">
        {{ story.title }}
      </h2>
      <p class="text-gray-700 text-sm mt-2">
        {{ story.description }}
      </p>
      <UButton
        :to="story.meta?.download"
        external
        label="Download"
        color="black"
        class="mt-4"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  story: any;
}>();
</script>
