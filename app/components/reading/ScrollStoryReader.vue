<template>
  <div
    class="reading-prose-wrapper"
    :data-reading-size="fontLevel"
  >
    <ClientOnly>
      <article
        v-reading-fade-in
        class="reading-prose prose prose-lg max-w-none"
      >
        <ContentRenderer :value="story" />
      </article>
      <template #fallback>
        <article class="reading-prose prose prose-lg max-w-none">
          <ContentRenderer :value="story" />
        </article>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  story: Record<string, unknown>;
  fontLevel: number;
}>();
</script>
