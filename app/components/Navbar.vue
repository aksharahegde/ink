<template>
  <nav
    class="flex max-w-6xl mx-auto items-center justify-between py-4 px-4 sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/50"
  >
    <Logo />
    <div class="hidden md:flex items-center gap-2 divide-x divide-zinc-300 dark:divide-zinc-700">
      <UHorizontalNavigation :links="links" />
      <ColorMode />
    </div>
    <div class="md:hidden">
      <UButton
        @click="toggleMenu"
        icon="i-heroicons-bars-3"
        color="gray"
        variant="ghost"
        aria-label="Menu"
      />
    </div>
    <div v-if="isMenuOpen" class="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 shadow-lg">
      <UVerticalNavigation
        :links="links"
        class="transition-all duration-300 ease-in-out"
      />
    </div>
  </nav>
</template>
<script setup lang="ts">
const links = [
  {
    label: "Home",
    to: "/",
    icon: "i-heroicons-home",
    ariaLabel: "Home",
  },
  {
    label: "Stories",
    to: "/stories",
    icon: "i-heroicons-book-open",
    ariaLabel: "Stories",
  },
];

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>
