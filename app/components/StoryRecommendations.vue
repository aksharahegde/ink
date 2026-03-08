<template>
  <section class="mt-20 pt-16 border-t border-zinc-200 dark:border-zinc-800" aria-label="Recommended stories">
    <h2 class="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
      Recommended
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StoryPosterCard
        v-for="(s, index) in recommendedList"
        :key="s.meta?.slug ?? index"
        :story="s"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentSlug: string;
  stories: Array<{
    title: string;
    meta?: { slug?: string; cover?: string; category?: string; readingTime?: string };
  }>;
}>();

const recommendedList = computed(() => {
  const list = (props.stories ?? []).filter(
    (s) => s.meta?.slug && s.meta.slug !== props.currentSlug
  );
  return list.slice(0, 3);
});
</script>
