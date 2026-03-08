<template>
  <div class="view-transition max-w-6xl mx-auto px-4 py-12">
    <h1 class="font-serif text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
      Stories
    </h1>
    <p class="text-zinc-600 dark:text-zinc-500 mb-12">
      A collection of narrative stories by Akshara Hegde.
    </p>
    <section
      v-for="group in groupsByAuthor"
      :key="group.author"
      class="mb-14"
    >
      <h2 class="font-serif text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-2">
        {{ group.author }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StoryPosterCard
          v-for="(story, index) in group.stories"
          :key="story.meta?.slug ?? index"
          :story="story"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const defaultAuthor = config.public.ownerName ?? "Unknown";

const { data: summaries } = await useAsyncData("stories-summary", () =>
  queryCollection("summary").all()
);

const { data: stories } = await useAsyncData("stories-full", () =>
  queryCollection("stories").all()
);

const pathToAuthor = computed(() => {
  const map: Record<string, string> = {};
  const list = stories.value ?? [];
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

const groupsByAuthor = computed(() => {
  const list = summaries.value ?? [];
  const withAuthor = list.map((s: { meta?: { path?: string; slug?: string }; [key: string]: unknown }) => {
    const path = (s as { meta?: { path?: string; slug?: string } }).meta?.path
      ?? ((s as { meta?: { slug?: string } }).meta?.slug ? `/stories/${(s as { meta?: { slug?: string } }).meta?.slug}` : "");
    const author = pathToAuthor.value[path] ?? defaultAuthor;
    return { ...s, _author: author };
  });
  const byAuthor: Record<string, typeof withAuthor> = {};
  for (const item of withAuthor) {
    const a = (item as { _author: string })._author;
    if (!byAuthor[a]) byAuthor[a] = [];
    byAuthor[a].push(item);
  }
  return Object.entries(byAuthor)
    .sort(([a], [b]) => (a === defaultAuthor ? -1 : b === defaultAuthor ? 1 : a.localeCompare(b)))
    .map(([author, stories]) => ({ author, stories }));
});

const ogImage = `${config.public.baseURL}/og.png`;
useSeoMeta({
  ogTitle: `${config.public.siteName} - Stories`,
  ogDescription: `A collection of short stories from the heart by ${config.public.ownerName}`,
  ogUrl: config.public.baseURL,
  twitterTitle: `${config.public.siteName} - Stories`,
  twitterDescription: `A collection of short stories from the heart by ${config.public.ownerName}`,
  twitterImage: ogImage,
});
</script>
