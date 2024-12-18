// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxthub/core",
    "@nuxt/image",
  ],
  hub: {
    database: true,
  },
  routeRules: {
    "/": { prerender: true },
    "/stories": { prerender: true },
    "/stories/[slug]": { prerender: true },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", href: "/icon.png" }],
    },
  },
  colorMode: {
    preference: "light",
  },
  site: {
    url: process.env.BASE_URL,
    name: process.env.SITE_NAME,
    description: `A collection of short stories from the heart by ${process.env.OWNER_NAME}`,
    defaultLocale: "en",
  },
  robots: {
    disableNuxtContentIntegration: true,
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
      siteName: process.env.SITE_NAME,
      ownerName: process.env.OWNER_NAME,
      twitter: process.env.TWITTER,
    },
  },
});
