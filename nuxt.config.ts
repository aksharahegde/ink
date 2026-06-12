// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));

const storyRoutes = readdirSync(join(currentDir, "content/stories/summary"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => `/stories/${file.replace(/\.md$/, "")}`);

const llmRoutes = [
  "/llms.txt",
  "/llms-full.txt",
  "/index.md",
  "/about.md",
  "/stories.md",
  ...storyRoutes.map((route) => `${route}.md`),
];

const storySitemapUrls = storyRoutes.map((loc) => ({
  loc,
  changefreq: "monthly" as const,
  priority: 0.8,
}));

const siteUrl = process.env.BASE_URL || "https://ink.aksharahegde.xyz";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  nitro: {
    preset: "cloudflare_pages",
    experimental: {
      websocket: true,
    },
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
    "./modules/llm-content",
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
    "/ws/**": { prerender: false },
    "/llms.txt": { prerender: true },
    "/llms-full.txt": { prerender: true },
    "/index.md": { prerender: true },
    "/about.md": { prerender: true },
    "/stories.md": { prerender: true },
    "/stories/**/*.md": { prerender: true },
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
    url: siteUrl,
    name: process.env.SITE_NAME || "Ink",
    description: `A collection of short stories from the heart by ${process.env.OWNER_NAME || "Akshara Hegde"}`,
    defaultLocale: "en",
  },
  sitemap: {
    urls: storySitemapUrls,
  },
  hooks: {
    "nitro:config"(nitroConfig) {
      nitroConfig.prerender = nitroConfig.prerender || {};
      const existing = nitroConfig.prerender.routes || [];
      nitroConfig.prerender.routes = [...new Set([...existing, ...storyRoutes, ...llmRoutes])];
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
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
    },
  },
  runtimeConfig: {
    public: {
      baseURL: siteUrl,
      siteName: process.env.SITE_NAME || "Ink",
      ownerName: process.env.OWNER_NAME || "Akshara Hegde",
      twitter: process.env.TWITTER || "akshara_dev",
    },
  },
});
