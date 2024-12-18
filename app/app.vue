<template>
  <main class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Navbar />
    <div class="p-4">
      <NuxtPage />
    </div>
    <Footer />
  </main>
</template>
<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

useSeoMeta({
  title: "Hedge Heart Beats",
  description: "Hedge Heart Beats - Visit once, feel forever",
  ogImage: `${config.public.baseURL}/og.png`,
  twitterCard: "summary_large_image",
});

useHead({
  title: () => (route.meta.title as string) || "",
  titleTemplate: (title) =>
    title ? `${title} - ${config.public.ownerName}` : config.public.ownerName,
  htmlAttrs: {
    lang: "en",
  },
  bodyAttrs: {
    class: "font-sans",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/icon.png",
    },
  ],
});

if (import.meta.server) {
  const PATH_RE = /([^/]+)\/?$/;
  const { path = "/" } = route.fullPath.match(PATH_RE)?.groups ?? {};
  const url = `${config.public.baseURL}${path}`;

  useServerHead({
    meta: () => [
      { name: "theme-color", content: "#000000" },
      { name: "msapplication-TileColor", content: "#000000" },
      { property: "og:url", content: url },
      {
        property: "og:image",
        content: `${config.public.baseURL}/og.png`,
        key: "og:image",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "600" },
      {
        property: "og:title",
        content: (route.meta.title as string) || config.public.ownerName,
      },
      {
        name: "description",
        content:
          (route.meta.description as string) ||
          `The writing website of ${config.public.ownerName}`,
      },
      {
        property: "og:description",
        content:
          (route.meta.description as string) ||
          `The writing website of ${config.public.ownerName}`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: `@${config.public.twitter}` },
      { name: "twitter:creator", content: `@${config.public.twitter}` },
      { name: "twitter:image", content: `${config.public.baseURL}/og.png` },
    ],
    link: [
      { rel: "canonical", href: url },
      { rel: "mask-icon", color: "#fff", href: "/favicon.ico" },
      { rel: "icon", type: "image/ico", href: "/favicon.ico" },
    ],
  });
}
</script>
<style>
* {
  font-family: "Source Code Pro", monospace;
}
</style>
