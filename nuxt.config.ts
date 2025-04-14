// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  css: ['./assets/css/transitions.css'],
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
