<template>
  <UApp>
    <main
      class="min-h-screen"
      :class="{ 'book-focus-shell': isBookFocusMode }"
      style="background-color: var(--ink-bg); color: var(--ink-text);"
    >
      <Navbar v-if="!isBookFocusMode" />
      <div>
        <NuxtPage />
      </div>
      <Footer v-if="!isBookFocusMode" />
      <ClientOnly>
        <LazyPresenceVisitorPresence v-if="canShowPresence && !isBookFocusMode" />
      </ClientOnly>
    </main>
  </UApp>
</template>
<script setup lang="ts">
const { mode } = useReadingMode();
const canShowPresence = ref(false);

onMounted(() => {
  const enable = () => {
    canShowPresence.value = true;
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(enable, { timeout: 5000 });
  } else {
    setTimeout(enable, 2500);
  }
});

const route = useRoute();
const config = useRuntimeConfig();
const siteUrl = config.public.baseURL ?? "";
const twitterHandle = config.public.twitter?.trim();
const isBookFocusMode = computed(() => mode.value === "book" && /^\/stories\/[^/]+$/.test(route.path));

const markdownAlternateHref = computed(() => {
  if (!siteUrl) return undefined;
  const base = siteUrl.replace(/\/$/, "");
  if (route.path === "/") return `${base}/index.md`;
  const storyMatch = route.path.match(/^\/stories\/([^/]+)$/);
  if (storyMatch) return `${base}/stories/${storyMatch[1]}.md`;
  return `${base}${route.path.replace(/\/$/, "")}.md`;
});

useHead({
  titleTemplate: (title) => {
    if (!title) return config.public.siteName ?? "Ink";
    if (route.path === "/") return "Ink - Stories written by Akshara Hegde";
    return title;
  },
  htmlAttrs: {
    lang: "en",
  },
  bodyAttrs: {
    class: "antialiased",
  },
  meta: [
    { name: "theme-color", content: "#f4f1ea" },
    { name: "msapplication-TileColor", content: "#f4f1ea" },
  ],
  link: computed(() => [
    { rel: "icon", type: "image/png", href: "/icon.png" },
    { rel: "mask-icon", color: "#fff", href: "/favicon.ico" },
    { rel: "icon", type: "image/ico", href: "/favicon.ico" },
    ...(markdownAlternateHref.value
      ? [{ rel: "alternate", type: "text/markdown", href: markdownAlternateHref.value }]
      : []),
  ]),
});

useSeoMeta({
  description: `A collection of short stories from the heart by ${config.public.ownerName}`,
  ogImage: siteUrl ? `${siteUrl}/og.png` : "/og.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: "summary_large_image",
  ...(twitterHandle
    ? {
        twitterSite: `@${twitterHandle}`,
        twitterCreator: `@${twitterHandle}`,
      }
    : {}),
});

if (siteUrl) {
  useSchemaOrg([
    defineWebSite({
      name: config.public.siteName ?? "Ink",
      url: siteUrl,
    }),
    defineOrganization({
      name: config.public.siteName ?? "Ink",
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
    }),
  ]);
}
</script>
