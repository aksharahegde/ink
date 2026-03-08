<template>
  <section
    class="py-20 md:py-28 px-4 border-y border-zinc-200 dark:border-zinc-800/80"
    aria-label="Quote"
  >
    <div class="max-w-3xl mx-auto text-center">
      <blockquote
        class="font-serif text-2xl md:text-4xl lg:text-5xl font-medium text-zinc-700 dark:text-zinc-200 leading-relaxed"
      >
        “{{ quote }}”
      </blockquote>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  quote: string;
}>();
</script>
