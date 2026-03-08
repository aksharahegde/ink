<template>
  <div class="view-transition max-w-5xl mx-auto px-4 py-12">
    <!-- Page header -->
    <div class="text-center mb-4">
      <h1
        class="font-serif text-4xl md:text-5xl font-bold"
        style="color: var(--ink-text);"
      >
        Stories
      </h1>
      <p class="mt-2 text-base font-meta" style="color: var(--ink-muted);">
        A collection of narrative stories by Akshara Hegde.
      </p>
    </div>

    <!-- Author filter -->
    <div
      class="flex flex-wrap items-center justify-center gap-2 mb-6"
      data-testid="stories-author-filter"
    >
      <button
        type="button"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        :class="selectedAuthor === null ? 'bg-[var(--ink-text)] text-[var(--ink-bg)]' : 'bg-[var(--ink-muted)]/20 text-[var(--ink-muted)] hover:bg-[var(--ink-muted)]/30'"
        @click="selectedAuthor = null"
      >
        All
      </button>
      <button
        v-for="author in authorList"
        :key="author"
        type="button"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        :class="selectedAuthor === author ? 'bg-[var(--ink-text)] text-[var(--ink-bg)]' : 'bg-[var(--ink-muted)]/20 text-[var(--ink-muted)] hover:bg-[var(--ink-muted)]/30'"
        @click="selectedAuthor = author"
      >
        {{ author }}
      </button>
    </div>

    <hr class="ink-rule-thick mb-10" />

    <!-- Stories grouped by author -->
    <section
      v-for="group in filteredGroupsByAuthor"
      :key="group.author"
      class="mb-14"
    >
      <h2
        class="font-serif text-xl font-bold pb-2 border-b-2 mb-0"
        :style="{ color: 'var(--ink-text)', borderColor: 'var(--ink-text)' }"
      >
        {{ group.author }}
      </h2>
      <div>
        <StoryPosterCard
          v-for="(story, index) in group.stories"
          :key="story.meta?.slug ?? story.slug ?? index"
          :story="story"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const defaultAuthor = config.public.ownerName ?? "Unknown";

const selectedAuthor = ref<string | null>(null);

const { data: summaries } = await useAsyncData("stories-summary", () =>
  queryCollection("summary").all()
);

const { data: stories } = await useAsyncData("stories-full", () =>
  queryCollection("stories").all()
);

function getSlug(s: unknown): string {
  const item = s as Record<string, unknown>;
  return (item.slug as string) ?? ((item.meta as Record<string, unknown> | undefined)?.slug as string) ?? "";
}

const slugToAuthor = computed(() => {
  const map: Record<string, string> = {};
  const list = stories.value ?? [];
  for (const s of list) {
    const slug = getSlug(s);
    const item = s as unknown as Record<string, unknown>;
    const author = (item.author as string) ?? ((item.meta as Record<string, unknown> | undefined)?.author as string) ?? defaultAuthor;
    if (slug) map[slug] = author;
  }
  return map;
});

const groupsByAuthor = computed(() => {
  const list = summaries.value ?? [];
  const withAuthor = list.map((s) => {
    const slug = getSlug(s);
    const author = slugToAuthor.value[slug] ?? defaultAuthor;
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

const authorList = computed(() => groupsByAuthor.value.map((g) => g.author));

type GroupItem = { author: string; stories: unknown[] };
const filteredGroupsByAuthor = ref<GroupItem[]>([]);
watchEffect(() => {
  const groups = groupsByAuthor.value;
  filteredGroupsByAuthor.value = selectedAuthor.value === null
    ? groups
    : groups.filter((g) => g.author === selectedAuthor.value);
});

const base = (config.public.baseURL ?? "").replace(/\/$/, "");
const ogImage = `${base || config.public.baseURL}/og.png`;
useSeoMeta({
  title: "Stories",
  description: `A collection of short stories from the heart by ${config.public.ownerName}`,
  ogTitle: `${config.public.siteName} - Stories`,
  ogDescription: `A collection of short stories from the heart by ${config.public.ownerName}`,
  ogUrl: base ? `${base}/stories` : undefined,
  twitterTitle: `${config.public.siteName} - Stories`,
  twitterDescription: `A collection of short stories from the heart by ${config.public.ownerName}`,
  twitterImage: ogImage,
});
</script>
