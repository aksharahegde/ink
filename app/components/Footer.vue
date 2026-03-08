<template>
  <footer
    class="border-t py-12"
    :style="{ borderColor: 'var(--ink-border)' }"
  >
    <div class="max-w-5xl mx-auto px-4">
      <!-- Top section -->
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <!-- Brand -->
        <div>
          <p class="font-serif text-2xl font-bold" style="color: var(--ink-text);">
            Ink Journal
          </p>
          <p class="mt-1 text-sm font-meta" style="color: var(--ink-muted);">
            Stories by <a href="https://aksharahegde.xyz?ref=ink" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 hover:opacity-70 transition-opacity">Akshara Hegde</a>
          </p>
        </div>

        <!-- Links -->
        <div class="flex gap-12 text-sm font-meta" style="color: var(--ink-muted);">
          <div class="space-y-2">
            <NuxtLink to="/about" class="block hover:opacity-70 transition-opacity">About</NuxtLink>
            <NuxtLink to="/stories" class="block hover:opacity-70 transition-opacity">Stories</NuxtLink>
          </div>
          <div class="space-y-2">
            <a href="https://aksharahegde.xyz?ref=ink" target="_blank" rel="noopener noreferrer" class="block hover:opacity-70 transition-opacity">Website</a>
            <a href="https://github.com/aksharahegde/ink" target="_blank" rel="noopener noreferrer" class="block hover:opacity-70 transition-opacity">Source</a>
          </div>
        </div>
      </div>

      <!-- Bottom rule + copyright -->
      <hr class="ink-rule mt-8 mb-4" />
      <p class="text-xs font-meta" style="color: var(--ink-muted);">
        &copy; {{ currentYear }} Ink Journal. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>
