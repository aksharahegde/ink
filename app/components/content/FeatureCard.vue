<template>
  <div class="flex flex-col lg:flex-row gap-4">
    <img
      :src="cover"
      alt="Cover Image"
      class="border border-gray-500 p-1 h-72 m-0"
    />
    <div class="flex flex-col">
      <h3 class="text-2xl font-bold m-0">
        <slot name="title" />
      </h3>
      <slot name="tagline" />
      <slot name="description" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  cover: string;
}>();
</script>
