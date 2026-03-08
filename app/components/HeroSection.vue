<template>
  <section
    class="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    aria-label="Hero"
  >
    <div class="hero-bg absolute inset-0" aria-hidden="true" />
    <div class="relative z-10 text-center px-4 view-transition">
      <h1
        class="font-serif text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
      >
        INK
      </h1>
      <p class="mt-4 text-zinc-600 dark:text-zinc-400 text-lg md:text-xl tracking-wide">
        Stories by Akshara Hegde
      </p>
      <p class="mt-6 text-zinc-500 dark:text-zinc-500 text-sm md:text-base tracking-widest uppercase">
        Love. Loss. Memory. Mystery.
      </p>
      <div class="mt-12 flex flex-wrap items-center justify-center gap-4">
        <UButton
          to="/stories"
          size="lg"
          variant="solid"
          color="gray"
          class="font-medium"
          aria-label="Start Reading"
        >
          Start Reading
        </UButton>
        <UButton
          to="/stories"
          size="lg"
          variant="outline"
          color="gray"
          class="font-medium border-zinc-600 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
          aria-label="Browse Stories"
        >
          Browse Stories
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hero-bg {
  background: linear-gradient(180deg, #f4f4f5 0%, #e4e4e7 100%);
}

.hero-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E");
  pointer-events: none;
}

html.dark .hero-bg {
  background: radial-gradient(
      ellipse 80% 80% at 50% 20%,
      rgba(63, 63, 70, 0.4) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse 60% 60% at 80% 80%,
      rgba(39, 39, 42, 0.5) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse 50% 50% at 20% 70%,
      rgba(24, 24, 27, 0.6) 0%,
      transparent 50%
    ),
    linear-gradient(180deg, #09090b 0%, #18181b 100%);
}

html.dark .hero-bg::after {
  opacity: 0.03;
}
</style>
