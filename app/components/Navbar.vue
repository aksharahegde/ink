<template>
  <nav
    class="flex flex-col space-y-6 items-center justify-between pt-4 px-4 bg-white shadow sticky top-0 z-50"
  >
    <div class="flex items-center">
      <Logo />
    </div>
    <div class="hidden md:flex space-x-4">
      <UHorizontalNavigation
        :links="links"
        class="border-b border-gray-200 dark:border-gray-800"
      />
    </div>
    <div class="md:hidden">
      <UButton @click="toggleMenu" icon="i-heroicons-bars-3" color="gray" />
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
  },
  {
    label: "Stories",
    to: "/stories",
    icon: "i-heroicons-book-open",
  }
];

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>
