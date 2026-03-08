<template>
  <section class="pt-12 pb-8 md:pt-16 md:pb-10 px-4" aria-label="Quote">
    <div class="max-w-5xl mx-auto">
      <hr class="ink-rule" />
      <div class="max-w-3xl mx-auto text-center py-10 md:py-12">
        <blockquote
          class="font-serif text-2xl md:text-4xl lg:text-5xl font-medium italic leading-relaxed"
          style="color: var(--ink-text);"
        >
          &ldquo;{{ quote }}&rdquo;
        </blockquote>
      </div>
      <hr class="ink-rule" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  quote: string;
}>();
</script>
