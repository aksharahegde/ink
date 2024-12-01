1
<template>
  <div
    class="lg:absolute lg:bottom-0 left-0 flex justify-end space-x-4 items-center w-full bg-gray-200 px-4 py-2 mt-2 lg:mt-0 rounded-lg lg:rounded-none lg:border-t border-gray-800 lg:opacity-0 lg:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300"
  >
    <UButton
      :to="download"
      external
      variant="outline"
      color="black"
      icon="i-heroicons-arrow-down-tray"
    />
    <UButton
      :to="`/stories/${slug}`"
      variant="solid"
      color="black"
      icon="i-heroicons-eye"
    />
  </div>
</template>
<script setup lang="ts">
defineProps<{
  download: string;
  slug: string;
}>();
</script>
