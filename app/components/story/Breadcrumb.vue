<template>
  <UBreadcrumb
    divider="/"
    :links="links"
    :ui="{ wrapper: 'bg-gray-200 px-4 rounded-lg w-fit', ol: 'pl-0' }"
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
