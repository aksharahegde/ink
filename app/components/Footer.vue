<template>
  <footer class="bg-gray-800 text-white py-4">
    <div class="container mx-auto text-center">
      <p class="text-sm">
        &copy; {{ currentYear }} hegdeheartbeats. All rights reserved.
      </p>
      <p class="text-sm">
        A short story site by <a href="https://aksharahegde.xyz?ref=ink" target="_blank" class="underline">Akshara Hegde</a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>
