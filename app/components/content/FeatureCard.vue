<template>
  <div
    class="border border-gray-800 shadow-lg rounded-lg overflow-hidden bg-white flex-col md:flex-row group relative"
  >
    <img
      :src="cover"
      alt="Cover Image"
      class="md:w-1/3 border border-l-0 border-t-0 border-gray-800"
    />
    <UIcon
      name="i-heroicons-sparkles"
      class="absolute top-0 right-0 h-full w-1/2 text-gray-50 md:text-gray-100"
    />
    <div class="p-4 flex flex-col text-left text-gray-900">
      <h3 class="text-2xl font-bold">
        <slot name="title" />
      </h3>
      <slot name="tagline" />
      <slot name="description" />
      <UButton class="w-fit mt-4" color="black" :to="url"> Read More </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  cover: string;
  url: string;
}>();
</script>
