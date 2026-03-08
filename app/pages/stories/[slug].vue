<template>
  <div class="view-transition pb-20">
    <ReadingProgressBar />
    <header class="relative w-full aspect-[21/9] min-h-[320px] md:min-h-[380px] overflow-hidden bg-zinc-200 dark:bg-zinc-900">
      <img
        v-if="coverImage"
        :src="coverImage"
        :alt="story?.title ?? 'Story cover'"
        class="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
        fetchpriority="high"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 via-40% to-transparent"
        aria-hidden="true"
      />
      <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-10 pb-8 md:pb-12">
        <div class="max-w-[680px] mx-auto w-full px-4">
          <StoryBreadcrumb :current="story?.title" />
          <h1 class="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mt-4 drop-shadow-sm">
            {{ story?.title }}
          </h1>
          <p class="mt-4 text-zinc-300 text-sm">
            {{ config.public.ownerName }}
            <span v-if="readingTimeDisplay" class="mx-2">·</span>
            <span v-if="readingTimeDisplay">{{ readingTimeDisplay }}</span>
          </p>
        </div>
      </div>
    </header>
    <div class="max-w-[680px] mx-auto px-4 pt-16 md:pt-20">
      <div
        class="reading-prose-wrapper"
        :data-reading-size="fontLevel"
      >
        <ClientOnly>
          <article
            v-reading-fade-in
            class="reading-prose prose prose-lg prose-zinc dark:prose-invert max-w-none
              prose-img:rounded-lg prose-img:shadow-xl"
          >
            <ContentRenderer v-if="story" :value="story" />
          </article>
          <template #fallback>
            <article
              class="reading-prose prose prose-lg prose-zinc dark:prose-invert max-w-none
                prose-img:rounded-lg prose-img:shadow-xl"
            >
              <ContentRenderer v-if="story" :value="story" />
            </article>
          </template>
        </ClientOnly>
      </div>
    </div>
    <ReadingToolbar
      v-if="story"
      :share-title="story.title ?? ''"
      :share-url="shareUrl"
    />
    <div v-if="story" class="max-w-[680px] mx-auto px-4">
      <StoryRecommendations
        :current-slug="(story.meta?.slug ?? story.slug ?? route.params.slug) as string"
        :stories="allSummaries"
      />
    </div>
    <div v-else class="max-w-[680px] mx-auto px-4 py-16 text-center text-zinc-600 dark:text-zinc-500">
      Story not found
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReadingFontSize } from "~/composables/useReadingFontSize";

const route = useRoute();
const config = useRuntimeConfig();

const { level: fontLevel } = useReadingFontSize();

const shareUrl = computed(() => {
  const base = config.public.baseURL ?? "";
  const path = route.fullPath.startsWith("/") ? route.fullPath : `/${route.fullPath}`;
  return base ? `${base.replace(/\/$/, "")}${path}` : (typeof window !== "undefined" ? window.location.href : path);
});

const { data: story } = await useAsyncData(
  `story-${route.params.slug}`,
  () =>
    queryCollection("stories")
      .path(route.path as string)
      .first(),
  { default: () => null }
);

const { data: allSummaries } = await useAsyncData("summary-all", () =>
  queryCollection("summary").all()
);

const coverImage = computed(() => {
  const c = story.value?.cover ?? story.value?.meta?.cover ?? null;
  if (!c) return null;
  return c.startsWith("/") ? c : `/${c}`;
});

const readingTimeDisplay = computed(() => {
  const rt = story.value?.readingTime ?? story.value?.meta?.readingTime;
  if (rt) return typeof rt === "number" ? `${rt} min read` : rt;
  const body = story.value?.body;
  if (body && typeof body === "object" && "children" in body) {
    const text = extractText((body as { children?: unknown[] }).children);
    const words = text.split(/\s+/).filter(Boolean).length;
    const min = Math.max(1, Math.round(words / 200));
    return `${min} min read`;
  }
  return null;
});

function extractText(node: unknown): string {
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && node !== null && "children" in node) {
    return extractText((node as { children: unknown }).children);
  }
  if (typeof node === "object" && node !== null && "value" in node) {
    return String((node as { value: unknown }).value ?? "");
  }
  return "";
}

const ogImage = `${config.public.baseURL}/og.png`;
useSeoMeta({
  title: story.value?.seo?.title ?? story.value?.title,
  description: story.value?.seo?.description ?? story.value?.description,
  ogTitle: story.value?.seo?.title ?? story.value?.title,
  ogDescription: story.value?.seo?.description ?? story.value?.description,
  ogUrl: config.public.baseURL,
  twitterTitle: story.value?.seo?.title ?? story.value?.title,
  twitterDescription: story.value?.seo?.description ?? story.value?.description,
  twitterImage: ogImage,
});
</script>
