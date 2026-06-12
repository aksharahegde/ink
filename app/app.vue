<template>
  <UApp>
    <main class="min-h-screen" style="background-color: var(--ink-bg); color: var(--ink-text);">
      <Navbar />
      <div>
        <NuxtPage />
      </div>
      <Footer />
      <ClientOnly>
        <LazyPresenceVisitorPresence v-if="canShowPresence" />
      </ClientOnly>
    </main>
  </UApp>
</template>
<script setup lang="ts">
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
  link: [
    { rel: "icon", type: "image/png", href: "/icon.png" },
    { rel: "mask-icon", color: "#fff", href: "/favicon.ico" },
    { rel: "icon", type: "image/ico", href: "/favicon.ico" },
  ],
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
