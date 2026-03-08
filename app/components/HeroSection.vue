<template>
  <section class="view-transition" aria-label="Masthead">
    <!-- Top double rule -->
    <div class="max-w-5xl mx-auto px-4">
      <hr class="ink-rule-double mt-6" />
    </div>

    <!-- Masthead -->
    <div class="max-w-5xl mx-auto px-4 py-10 md:py-14 text-center">
      <h1
        class="font-serif text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tight leading-none"
        style="color: var(--ink-text);"
      >
        INK JOURNAL
      </h1>
      <p
        class="mt-3 text-base md:text-lg tracking-[0.2em] uppercase font-meta"
        style="color: var(--ink-muted);"
      >
        Stories by Akshara Hegde
      </p>
      <p
        class="mt-4 text-sm tracking-[0.15em] uppercase font-meta"
        style="color: var(--ink-muted);"
      >
        Special Edition &bull; {{ currentEdition }}
      </p>
    </div>

    <!-- Bottom thick rule -->
    <div class="max-w-5xl mx-auto px-4">
      <hr class="ink-rule-thick" />
    </div>
  </section>
</template>

<script setup lang="ts">
const currentEdition = computed(() => {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();
  return `${month} ${year}`;
});
</script>
