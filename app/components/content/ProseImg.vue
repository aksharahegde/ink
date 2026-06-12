<template>
  <img
    :src="src"
    :alt="resolvedAlt"
    class="max-w-full h-auto"
    loading="lazy"
  >
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string;
  alt?: string;
}>();

const resolvedAlt = computed(() => {
  const trimmed = props.alt?.trim();
  if (trimmed) return trimmed;

  const filename = props.src.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
  const readable = filename.replace(/[-_]+/g, " ").trim();
  return readable || "Story illustration";
});
</script>
