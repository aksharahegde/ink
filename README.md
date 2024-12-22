# Ink

A minimal and clean template for showcasing your writing.

![Screenshot](https://github.com/aksharahegde/user-attachment/blob/main/ink_aksharahegde.png)

### Performance Insights

![Performance Report](https://github.com/aksharahegde/user-attachment/blob/main/ink_perf.png)

[![Deploy to NuxtHub](https://hub.nuxt.com/button.svg)](https://hub.nuxt.com/new?template=https://github.com/nuxthub/ink)

### Features

-   Pre-render all pages
-   Dark mode
-   SEO friendly
-   Easy to customize
-   One-click deploy to NuxtHub

### Project Structure

```code
.output/
.nuxt/
app/
  assets/
  components/
  composables/
  layouts/
  middleware/
  pages/
  plugins/
  utils/
  app.config.ts
  app.vue
  router.options.ts
content/
layers/
modules/
node_modules/
public/
server/
  api/
  middleware/
  plugins/
  routes/
  utils/
nuxt.config.ts
```

### Customize

-   Edit `content/stories` to add your stories
-   Edit `content/blog` to add your blog posts
-   Edit `app/components/story/DetailCard.vue` to customize the story card
-   Edit `app/components/blog/DetailCard.vue` to customize the blog card

### Package details

-   Nuxt 3 (with Nuxt 4 compatibility features)
-   Nuxt UI (Basic)
-   Nuxt Content (100% NuxtHub integration)

### Local Development

```bash
bun install
```

```bash
bun run dev
```

NOTE: It uses NuxtHub for database and content management. So create a new project on NuxtHub and add the database and content to it.
