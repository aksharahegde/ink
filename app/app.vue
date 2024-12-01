<template>
  <main class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="p-4">
      <NuxtPage />
    </div>
    <Footer />
  </main>
</template>
<script setup>
useSeoMeta({
  title: "Hedge Heart Beats",
  description: "Hedge Heart Beats - Visit once, feel forever",
});
</script>
<style>
* {
  font-family: "Source Code Pro", monospace;
}
</style>
