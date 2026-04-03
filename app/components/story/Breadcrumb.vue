<template>
  <UBreadcrumb
    separator="/"
    :items="links"
    :ui="{
      root: 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-lg w-fit',
    }"
  />
</template>
<script setup lang="ts">
const props = defineProps<{
  current: any;
}>();
const links = [
  { label: "Home", to: "/", icon: "i-heroicons-home" },
  { label: "Stories", to: "/stories", icon: "i-heroicons-book-open" },
  { label: props.current },
];
</script>
