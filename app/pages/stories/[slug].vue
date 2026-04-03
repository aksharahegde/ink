<template>
  <div class="view-transition pb-20">
    <ReadingProgressBar />

    <!-- Story header -->
    <header class="max-w-[680px] mx-auto px-4 pt-12 md:pt-20">
      <!-- Top rule -->
      <hr class="ink-rule mb-8" />

      <!-- Title block -->
      <div class="text-center">
        <h1
          class="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
          style="color: var(--ink-text);"
        >
          {{ story?.title }}
        </h1>
        <p
          v-if="story?.description"
          class="mt-4 text-lg md:text-xl italic"
          style="color: var(--ink-muted);"
        >
          {{ story.description }}
        </p>

        <!-- Meta -->
        <div
          class="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm font-meta"
          style="color: var(--ink-muted);"
        >
          <span>By <strong style="color: var(--ink-text);">{{ storyAuthor }}</strong></span>
          <span v-if="publishDate">&bull; {{ publishDate }}</span>
          <span v-if="readingTimeDisplay">&bull; {{ readingTimeDisplay }}</span>
        </div>
      </div>

      <!-- Bottom rule -->
      <hr class="ink-rule mt-8" />
    </header>

    <!-- Cover image -->
    <div v-if="coverImage" class="max-w-3xl mx-auto px-4 mt-10">
      <div class="relative aspect-[16/9] overflow-hidden">
        <img
          :src="coverImage"
          :alt="story?.title ?? 'Story cover'"
          class="w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
          style="filter: sepia(0.05) contrast(1.02);"
        />
      </div>
    </div>

    <!-- Story content -->
    <div class="max-w-[680px] mx-auto px-4 pt-10 md:pt-14">
      <div
        class="reading-prose-wrapper"
        :data-reading-size="fontLevel"
      >
        <ClientOnly>
          <article
            v-reading-fade-in
            class="reading-prose prose prose-lg max-w-none"
          >
            <ContentRenderer v-if="story" :value="story" />
          </article>
          <template #fallback>
            <article class="reading-prose prose prose-lg max-w-none">
              <ContentRenderer v-if="story" :value="story" />
            </article>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- Reading toolbar -->
    <ReadingToolbar
      v-if="story"
      :share-title="story.title ?? ''"
      :share-url="shareUrl"
    />

    <!-- Recommendations -->
    <div v-if="story" class="max-w-[680px] mx-auto px-4">
      <StoryRecommendations
        :current-slug="(story.meta?.slug ?? story.slug ?? route.params.slug) as string"
        :stories="allSummaries"
      />
    </div>

    <!-- Not found -->
    <div v-else class="max-w-[680px] mx-auto px-4 py-16 text-center" style="color: var(--ink-muted);">
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
      .first()
);

const { data: allSummaries } = await useAsyncData("summary-all", () =>
  queryCollection("summary").all()
);

const storyAuthor = computed(() => {
  const a = (story.value as { author?: string; meta?: { author?: string } })?.author
    ?? (story.value as { meta?: { author?: string } })?.meta?.author;
  return a ?? config.public.ownerName ?? "Akshara Hegde";
});

const coverImage = computed(() => {
  const c = story.value?.cover ?? story.value?.meta?.cover ?? undefined;
  if (!c) return undefined;
  return c.startsWith("/") ? c : `/${c}`;
});

const publishDate = computed(() => {
  const d = (story.value as { date?: string; meta?: { date?: string } })?.date
    ?? (story.value as { meta?: { date?: string } })?.meta?.date;
  if (!d) return undefined;
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
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
  return undefined;
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

const base = (config.public.baseURL ?? "").replace(/\/$/, "");
const ogCoverImageUrl = computed(() => {
  const c = coverImage.value;
  if (!c || !base) return undefined;
  return c.startsWith("http") ? c : `${base}${c.startsWith("/") ? c : `/${c}`}`;
});

if (story.value) {
  defineOgImage({
    component: "StoryOgImageSatori",
    title: story.value?.seo?.title ?? story.value?.title ?? "Story",
    description: story.value?.seo?.description ?? story.value?.description ?? "",
    coverImage: ogCoverImageUrl.value,
    siteName: config.public.siteName ?? "Ink",
  });
}

const storyPageTitle = computed(() =>
  story.value && storyAuthor.value
    ? `${story.value.title ?? "Story"} - by ${storyAuthor.value}`
    : undefined
);

const defaultOgImage = base ? `${base}/og.png` : undefined;
useSeoMeta({
  title: storyPageTitle,
  description: story.value?.seo?.description ?? story.value?.description,
  ogTitle: storyPageTitle,
  ogDescription: story.value?.seo?.description ?? story.value?.description,
  ogUrl: shareUrl.value,
  twitterTitle: storyPageTitle,
  twitterDescription: story.value?.seo?.description ?? story.value?.description,
  ...(story.value ? {} : { ogImage: defaultOgImage, twitterImage: defaultOgImage }),
});
</script>
