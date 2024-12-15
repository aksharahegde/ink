<template>
  <nav
    class="flex max-w-screen-md mx-auto space-y-6 items-center justify-between pb-2 md:pb-0 pt-4 px-4 bg-white dark:bg-gray-800 shadow sticky top-0 z-50"
  >
    <Logo />
    <div class="hidden md:block">
      <UHorizontalNavigation :links="links" />
    </div>
    <div class="md:hidden">
      <UButton
        @click="toggleMenu"
        icon="i-heroicons-bars-3"
        color="gray"
        aria-label="Menu"
      />
    </div>
  </nav>
  <div v-if="isMenuOpen" class="md:hidden bg-white p-4">
    <UVerticalNavigation
      :links="links"
      class="transition-all duration-300 ease-in-out"
    />
  </div>
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
