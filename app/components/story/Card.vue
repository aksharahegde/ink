<template>
  <div class="space-y-4 h-72 w-56 relative bg-cover bg-center group" :style="{ backgroundImage: `url(${story.meta?.cover})` }">
    <div class="flex-col px-4 items-center justify-center absolute bottom-0 left-0 right-0 py-2 bg-black/50 backdrop-blur-sm hidden group-hover:flex">
      <h3
        class="text-lg font-bold text-white transition-all duration-300"
      >
        {{ story.title }}
      </h3>
      <p class="text-sm text-gray-200 text-center">
        {{ story.description }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  story: any;
}>();
</script>
