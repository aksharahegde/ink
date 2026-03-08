<template>
  <nav
    class="sticky top-0 z-50 backdrop-blur-md border-b font-meta"
    :style="{
      backgroundColor: 'color-mix(in srgb, var(--ink-bg) 90%, transparent)',
      borderColor: 'var(--ink-border)',
    }"
  >
    <div class="max-w-5xl mx-auto px-4 flex items-center justify-between h-12">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="font-serif text-lg font-bold tracking-tight"
        style="color: var(--ink-text);"
        aria-label="Ink – Home"
      >
        Ink
      </NuxtLink>

      <!-- Center nav links (desktop) -->
      <div
        class="hidden md:flex items-center gap-8 text-sm tracking-wide"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="transition-opacity duration-200 hover:opacity-100"
          :class="isActive(link.to) ? 'opacity-100 font-medium' : 'opacity-60'"
          :style="isActive(link.to) ? 'color: var(--ink-text);' : 'color: var(--ink-muted);'"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-1">
        <ColorMode />
        <!-- Mobile menu button -->
        <button
          class="md:hidden p-2 rounded transition-colors"
          style="color: var(--ink-muted);"
          aria-label="Menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="isMenuOpen"
      class="md:hidden border-t px-4 py-4"
      :style="{
        backgroundColor: 'var(--ink-bg)',
        borderColor: 'var(--ink-border)',
      }"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="block py-2 text-sm font-meta"
        :style="isActive(link.to) ? 'color: var(--ink-text);' : 'color: var(--ink-muted);'"
        @click="isMenuOpen = false"
      >
        {{ link.label }}
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();

const links = [
  { label: "Stories", to: "/stories" },
  { label: "About", to: "/about" },
];

const isMenuOpen = ref(false);

const isActive = (path: string) => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};
</script>
