<template>
  <div
    class="z-10 lg:absolute lg:bottom-0 left-0 flex justify-end space-x-4 items-center w-full bg-gray-200 dark:bg-gray-900 px-4 py-2 mt-2 lg:mt-0 rounded-lg lg:rounded-none lg:border-t border-gray-800 lg:opacity-0 lg:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300"
  >
    <UButton
      v-if="download"
      :to="download"
      external
      variant="outline"
      color="black"
      icon="i-heroicons-arrow-down-tray"
      label="Download"
      aria-label="Download"
    />
  </div>
</template>
<script setup lang="ts">
defineProps({
  download: {
    type: String,
    required: false,
  },
  slug: {
    type: String,
    required: false,
  },
});
</script>
