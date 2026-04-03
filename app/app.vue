<template>
  <UApp>
    <main class="min-h-screen" style="background-color: var(--ink-bg); color: var(--ink-text);">
      <Navbar />
      <div>
        <NuxtPage />
      </div>
      <Footer />
    </main>
  </UApp>
</template>
<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

useSeoMeta({
  title: "Ink",
  description: "Stories by Akshara Hegde — Love. Loss. Memory. Mystery.",
  ogImage: `${config.public.baseURL}/og.png`,
  twitterCard: "summary_large_image",
});

useHead({
  title: () => (route.meta.title as string) || "",
  titleTemplate: (title) => {
    if (route.path === "/")
      return "Ink - Stories written by Akshara Hegde";
    if (route.path.startsWith("/stories/") && title) return title;
    return title
      ? `${title} - ${config.public.ownerName}`
      : (config.public.ownerName ?? "Akshara Hegde");
  },
  htmlAttrs: {
    lang: "en",
  },
  bodyAttrs: {
    class: "antialiased",
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
  const requestUrl = useRequestURL();
  const base = (config.public.baseURL ?? "").replace(/\/$/, "");
  const path = route.fullPath.startsWith("/") ? route.fullPath : `/${route.fullPath}`;
  const url = base ? `${base}${path}` : requestUrl.href;

  useServerHead({
    meta: () => [
      { name: "theme-color", content: "#f4f1ea" },
      { name: "msapplication-TileColor", content: "#f4f1ea" },
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
        content:
          route.path === "/"
            ? "Ink - Stories written by Akshara Hegde"
            : (route.meta.title as string) || config.public.ownerName,
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
