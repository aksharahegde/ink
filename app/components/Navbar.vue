<template>
  <nav
    class="flex max-w-screen-md mx-auto space-y-6 items-center justify-between pb-2 md:pb-0 pt-4 px-4 backdrop-blur-xl dark:bg-gray-900 dark:text-gray-200 sticky rounded-b-lg top-0 z-50"
  >
    <Logo />
    <div class="hidden md:flex items-center gap-2 divide-x-2">
      <UHorizontalNavigation :links="links" />
      <ColorMode />
    </div>
    <div class="md:hidden">
      <UButton
        @click="toggleMenu"
        icon="i-heroicons-bars-3"
        color="gray"
        aria-label="Menu"
      />
    </div>
    <div v-if="isMenuOpen" class="md:hidden bg-white p-4 rounded-b-lg absolute top-12 left-0 right-0">
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
