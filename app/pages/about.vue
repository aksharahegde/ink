<template>
  <div class="view-transition max-w-[680px] mx-auto px-4 pt-12 md:pt-20 pb-20">
    <hr class="ink-rule mb-8" />
    <h1
      class="font-serif text-3xl md:text-4xl font-bold tracking-tight"
      style="color: var(--ink-text);"
    >
      About
    </h1>
    <hr class="ink-rule mt-3 mb-10" />
    <div
      class="font-serif text-lg leading-relaxed space-y-6"
      style="color: var(--ink-text);"
    >
      <p v-for="(paragraph, index) in aboutParagraphs" :key="index">
        {{ paragraph }}
      </p>
      <p>
        <a
          :href="aboutTwitterUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:opacity-80 transition-opacity"
          style="color: var(--ink-accent); text-decoration: underline; text-underline-offset: 0.2em;"
        >
          Twitter: {{ aboutTwitterUrl }}
        </a>
      </p>
    </div>
    <hr class="ink-rule mt-12" />
  </div>
</template>

<script setup lang="ts">
import { aboutParagraphs, aboutTwitterUrl } from '#shared/about-content'

const config = useRuntimeConfig()

definePageMeta({
  title: 'About',
})

const description = `About ${config.public.ownerName} — software developer, musician, and storyteller behind Ink.`

useSeoMeta({
  title: 'About',
  description,
  ogTitle: `About - ${config.public.siteName}`,
  ogDescription: description,
  twitterTitle: `About - ${config.public.siteName}`,
  twitterDescription: description,
})

useSchemaOrg([
  defineWebPage({
    '@type': 'AboutPage',
    name: 'About',
    description,
  }),
])
</script>
