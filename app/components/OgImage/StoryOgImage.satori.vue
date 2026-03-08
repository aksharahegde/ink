<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    coverImage?: string;
    siteName?: string;
  }>(),
  { title: "", description: "", siteName: "Ink Journal" }
);
</script>

<template>
  <div
    class="flex flex-col w-full h-full bg-neutral-900"
    :style="
      coverImage
        ? {
            backgroundImage: `url(${coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        : {}
    "
  >
    <div
      class="flex flex-col flex-1 justify-end p-[60px]"
      style="
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.9) 0%,
          rgba(0, 0, 0, 0.4) 40%,
          transparent 100%
        );
      "
    >
      <h1
        class="text-white font-bold text-[48px] leading-tight m-0 mb-[16px]"
        style="font-family: 'Playfair Display', serif; text-shadow: 0 1px 2px rgba(0,0,0,0.5);"
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="text-gray-200 text-[24px] leading-snug m-0 max-w-[85%]"
        style="font-family: 'Libre Baskerville', serif; text-shadow: 0 1px 2px rgba(0,0,0,0.5);"
      >
        {{ String(description).slice(0, 160) }}{{ String(description).length > 160 ? '…' : '' }}
      </p>
      <p class="text-gray-400 text-[20px] mt-[24px] m-0">
        {{ siteName }}
      </p>
    </div>
  </div>
</template>
