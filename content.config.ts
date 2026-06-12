import { defineCollection, z } from "@nuxt/content";
import { defineRobotsSchema } from "@nuxtjs/robots/content";
import { defineSitemapSchema } from "@nuxtjs/sitemap/content";
import { defineOgImageSchema } from "nuxt-og-image/content";
import { defineSchemaOrgSchema } from "nuxt-schema-org/content";

const seoFields = {
  robots: defineRobotsSchema(),
  sitemap: defineSitemapSchema(),
  ogImage: defineOgImageSchema(),
  schemaOrg: defineSchemaOrgSchema(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
};

export const collections = {
  content: defineCollection({
    type: "page",
    source: "*.md",
    schema: z.object({
      ...seoFields,
    }),
  }),
  stories: defineCollection({
    source: "stories/*.md",
    type: "page",
    schema: z.object({
      cover: z.string().optional(),
      slug: z.string().optional(),
      download: z.string().optional(),
      author: z.string().optional(),
      date: z.string().optional(),
      ...seoFields,
    }),
  }),
  summary: defineCollection({
    source: "stories/summary/*.md",
    type: "page",
    schema: z.object({
      author: z.string().optional(),
      cover: z.string().optional(),
      slug: z.string().optional(),
      path: z.string().optional(),
      category: z.string().optional(),
      readingTime: z.string().optional(),
      date: z.string().optional(),
      ...seoFields,
    }),
  }),
};
