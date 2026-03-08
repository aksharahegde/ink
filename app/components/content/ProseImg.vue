<template>
  <img
    :src="src"
    :alt="alt ?? ''"
    class="max-w-full h-auto"
    loading="lazy"
  >
</template>

<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
}>();
</script>
