<template>
  <div class="flex bg-white rounded-lg p-4">
    <NuxtImg
      :src="thumbnail"
      alt="quote thumbnail"
      class="w-24 my-3"
      loading="lazy"
    />
    <div class="flex flex-col gap-2 p-4">
      <div class="font-bold !p-0 m-0"><slot name="title"></slot></div>
      <p class="text-sm text-gray-500 m-0">
        <MDCSlot unwrap="p" />
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    thumbnail: String,
  },
};
</script>
