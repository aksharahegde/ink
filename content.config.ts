import { defineCollection, z } from "@nuxt/content";

export const collections = {
  content: defineCollection({
    type: "page",
    source: "*.md",
  }),
  stories: defineCollection({
    source: "stories/*.md",
    type: "page",
    schema: z.object({
      cover: z.string().optional(),
      slug: z.string().optional(),
      download: z.string().optional(),
      author: z.string().optional(),
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
    }),
  }),
};
