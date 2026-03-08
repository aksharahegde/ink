<template>
  <section class="mt-16 pt-10" aria-label="Recommended stories">
    <h2
      class="font-serif text-2xl font-bold pb-2 border-b-2 mb-0"
      :style="{ color: 'var(--ink-text)', borderColor: 'var(--ink-text)' }"
    >
      Recommended
    </h2>
    <div>
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
    description?: string;
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
