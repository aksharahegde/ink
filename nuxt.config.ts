// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));

const storyRoutes = readdirSync(join(currentDir, "content/stories/summary"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => `/stories/${file.replace(/\.md$/, "")}`);

const storySitemapUrls = storyRoutes.map((loc) => ({
  loc,
  changefreq: "monthly" as const,
  priority: 0.8,
}));

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  nitro: {
    preset: "cloudflare_pages",
  },
  css: [
    join(currentDir, "app/assets/css/main.css"),
    join(currentDir, "app/assets/css/transitions.css"),
    join(currentDir, "app/assets/css/reading.css"),
  ],
  modules: [
    "@nuxtjs/seo",
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxthub/core",
    "@nuxt/image",
  ],
  fonts: {
    families: [
      { name: "Playfair Display", provider: "google", global: true },
      { name: "Libre Baskerville", provider: "google", global: true },
      { name: "Inter", provider: "google" },
    ],
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin"],
    },
  },
  hub: {
    database: true,
  },
  routeRules: {
    "/": { prerender: true },
    "/about": { prerender: true },
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
    pageTransition: {
      name: 'view-transition',
      mode: 'out-in', 
      onBeforeLeave: () => {
        if (!document.startViewTransition) return
        document.startViewTransition(() => {
          const elements = document.querySelectorAll('.view-transition')
          elements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.opacity = '0'
              el.style.transform = 'translateY(20px)'
            }
          })
        })
      },
      onEnter(el: HTMLElement, done: () => void) {
        if (!document.startViewTransition) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          done()
          return
        }
        document.startViewTransition(() => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          done()
        })
      },
      onLeave(el: HTMLElement, done: () => void) {
        if (!document.startViewTransition) {
          el.style.opacity = '0'
          el.style.transform = 'translateY(-20px)'
          done()
          return
        }
        document.startViewTransition(() => {
          el.style.opacity = '0'
          el.style.transform = 'translateY(-20px)'
          done()
        })
      },
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
  sitemap: {
    urls: storySitemapUrls,
  },
  hooks: {
    "nitro:config"(nitroConfig) {
      nitroConfig.prerender = nitroConfig.prerender || {};
      const existing = nitroConfig.prerender.routes || [];
      nitroConfig.prerender.routes = [...new Set([...existing, ...storyRoutes])];
    },
  },
  robots: {
    disallow: ["/api/", "/__og-image__"],
  },
  ogImage: {
    enabled: false,
  },
  linkChecker: {
    enabled: false,
  },
  schemaOrg: {
    identity: {
      type: "Organization",
      name: process.env.SITE_NAME || "Ink",
      url: process.env.BASE_URL,
      logo: process.env.BASE_URL ? `${process.env.BASE_URL}/icon.png` : "/icon.png",
    },
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
