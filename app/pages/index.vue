<template>
  <div class="view-transition">
    <HeroSection />

    <!-- Featured announcement -->
    <section v-if="storiesByArun.length > 0" class="max-w-5xl mx-auto px-4 py-12 md:py-16">
      <FeaturedAnnouncement :stories="storiesByArun" />
    </section>

    <!-- Featured story -->
    <section v-if="featuredStory" class="max-w-5xl mx-auto px-4 py-12 md:py-16">
      <FeaturedStory :story="featuredStory" />
    </section>

    <!-- Divider -->
    <div class="max-w-5xl mx-auto px-4">
      <hr class="ink-rule" />
    </div>

    <!-- Main content: stories + sidebar -->
    <div class="max-w-5xl mx-auto px-4 py-12 md:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
        <!-- Latest Stories column -->
        <div>
          <h2
            class="font-serif text-2xl md:text-3xl font-bold mb-2"
            style="color: var(--ink-text);"
          >
            Latest Stories
          </h2>
          <hr class="ink-rule-thick mt-3 mb-0" />
          <div>
            <StoryPosterCard
              v-for="(story, index) in galleryStories"
              :key="index"
              :story="story"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="hidden lg:block">
          <!-- Most Read -->
          <div class="mb-10">
            <h3
              class="font-serif text-lg font-bold pb-2 border-b-2 mb-4"
              :style="{ color: 'var(--ink-text)', borderColor: 'var(--ink-text)' }"
            >
              Most Read
            </h3>
            <ol class="space-y-3">
              <li
                v-for="(story, i) in mostRead"
                :key="i"
                class="flex gap-3 items-baseline"
              >
                <span
                  class="font-serif text-2xl font-bold leading-none"
                  style="color: var(--ink-accent);"
                >{{ i + 1 }}</span>
                <NuxtLink
                  :to="`/stories/${story.meta?.slug}`"
                  class="font-serif text-sm font-medium leading-snug hover:opacity-70 transition-opacity"
                  style="color: var(--ink-text);"
                >
                  {{ story.title }}
                </NuxtLink>
              </li>
            </ol>
          </div>

          <!-- Categories -->
          <div class="mb-10">
            <h3
              class="font-serif text-lg font-bold pb-2 border-b-2 mb-4"
              :style="{ color: 'var(--ink-text)', borderColor: 'var(--ink-text)' }"
            >
              Categories
            </h3>
            <div class="space-y-2">
              <NuxtLink
                v-for="cat in categories"
                :key="cat"
                to="/stories"
                class="block text-sm font-meta py-1 hover:opacity-70 transition-opacity"
                style="color: var(--ink-muted);"
              >
                {{ cat }}
              </NuxtLink>
            </div>
          </div>

          <!-- Newsletter -->
          <NewsletterSignup />
        </aside>
      </div>
    </div>

    <!-- Quote section -->
    <QuoteSection :quote="quoteText" />

  </div>
</template>

<script setup lang="ts">
const { data: home } = await useAsyncData(() =>
  queryCollection("content").path("/").first()
);

const { data: stories } = await useAsyncData("stories", () =>
  queryCollection("summary").all()
);

const { data: storiesFull } = await useAsyncData("home-stories-full", () =>
  queryCollection("stories").all()
);

const config = useRuntimeConfig();
const defaultAuthor = config.public.ownerName ?? "Unknown";

const pathToAuthor = computed(() => {
  const map: Record<string, string> = {};
  const list = storiesFull.value ?? [];
  for (const s of list) {
    const path = (s as { path?: string; meta?: { path?: string; slug?: string } }).path
      ?? (s as { meta?: { path?: string; slug?: string } }).meta?.path
      ?? ((s as { meta?: { slug?: string } }).meta?.slug ? `/stories/${(s as { meta?: { slug?: string } }).meta?.slug}` : "");
    const author = (s as { author?: string; meta?: { author?: string } }).author
      ?? (s as { meta?: { author?: string } }).meta?.author
      ?? defaultAuthor;
    if (path) map[path] = author;
  }
  return map;
});

const storiesByArun = computed(() => {
  const list = stories.value ?? [];
  const arun = "Arun Hegde";
  return list.filter((s: { meta?: { path?: string; slug?: string } }) => {
    const path = (s as { meta?: { path?: string; slug?: string } }).meta?.path
      ?? ((s as { meta?: { slug?: string } }).meta?.slug ? `/stories/${(s as { meta?: { slug?: string } }).meta?.slug}` : "");
    return pathToAuthor.value[path] === arun;
  });
});

const galleryStories = computed(() => stories.value ?? []);

const featuredStory = computed(() => {
  const list = stories.value ?? [];
  return list.length > 0 ? list[0] : null;
});

const mostRead = computed(() => {
  const list = stories.value ?? [];
  return list.slice(0, 5);
});

const categories = computed(() => {
  const list = stories.value ?? [];
  const cats = new Set<string>();
  for (const s of list) {
    const cat = (s as { meta?: { category?: string } }).meta?.category;
    if (cat) cats.add(cat);
  }
  return Array.from(cats).sort();
});

const quoteText = computed(() => home.value?.quote ?? "Some stories stay with you long after the last word.");

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
