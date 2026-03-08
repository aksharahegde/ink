<template>
  <div class="view-transition">
    <HeroSection />
    <section class="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <FeaturedStory v-if="featuredStory" :story="featuredStory" />
    </section>
    <section class="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <h2 class="font-serif text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-10">
        Story Gallery
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StoryPosterCard
          v-for="(story, index) in galleryStories"
          :key="index"
          :story="story"
        />
      </div>
    </section>
    <QuoteSection :quote="quoteText" />
    <section class="max-w-xl mx-auto px-4 py-16 md:py-24">
      <NewsletterSignup />
    </section>
    <UAlert class="max-w-screen-md mx-auto px-4 mb-8 text-sm border-zinc-200 dark:border-zinc-800">
      <template #description>
        Built with the open source template
        <a
          href="https://github.com/aksharahegde/ink"
          target="_blank"
          rel="noopener noreferrer"
          class="underline text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300"
        >Ink</a
        >.
      </template>
    </UAlert>
  </div>
</template>

<script setup lang="ts">
const { data: home } = await useAsyncData(() =>
  queryCollection("content").path("/").first()
);

const { data: stories } = await useAsyncData("stories", () =>
  queryCollection("summary").all()
);

const featuredStory = computed(() => {
  const list = stories.value ?? [];
  const featured = list.find((s: { meta?: { featured?: boolean } }) => s.meta?.featured);
  return featured ?? list[0] ?? null;
});

const galleryStories = computed(() => {
  const list = stories.value ?? [];
  const featuredSlug = featuredStory.value?.meta?.slug;
  if (!featuredSlug) return list;
  return list.filter((s: { meta?: { slug?: string } }) => s.meta?.slug !== featuredSlug);
});

const quoteText = computed(() => home.value?.quote ?? "Some stories stay with you long after the last word.");

const config = useRuntimeConfig();
const ogImage = `${config.public.baseURL}/og.png`;
useSeoMeta({
  ogTitle: home.value?.title ?? "Ink — Stories by Akshara Hegde",
  ogDescription: home.value?.description ?? "Love. Loss. Memory. Mystery.",
  ogUrl: config.public.baseURL,
  twitterTitle: home.value?.title ?? "Ink — Stories by Akshara Hegde",
  twitterDescription: home.value?.description ?? "Love. Loss. Memory. Mystery.",
  twitterImage: ogImage,
});
</script>
