<template>
  <footer class="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-8 text-zinc-600 dark:text-zinc-400">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <p class="font-serif text-zinc-900 dark:text-zinc-100 text-lg font-semibold">Ink</p>
      <p class="mt-2 text-sm">
        Stories by <a href="https://aksharahegde.xyz?ref=ink" target="_blank" rel="noopener noreferrer" class="underline hover:text-zinc-700 dark:hover:text-zinc-300">Akshara Hegde</a>
      </p>
      <p class="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
        &copy; {{ currentYear }}. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>
