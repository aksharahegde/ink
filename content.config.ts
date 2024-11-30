import { defineCollection, z } from "@nuxt/content";

export const collections = {
  content: defineCollection({
    type: "page",
    source: "*.md",
  }),
  stories: defineCollection({
    source: "stories/*.md",
    type: "page",
  }),
  summary: defineCollection({
    source: "stories/summary/*.md",
    type: "page",
  }),
};
