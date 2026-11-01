<template>
  <div
    class="reading-prose-wrapper"
    :data-reading-size="fontLevel"
  >
    <ClientOnly>
      <article
        v-reading-fade-in
        class="reading-prose prose prose-lg max-w-none"
      >
        <ContentRenderer :value="content" />
      </article>
      <template #fallback>
        <article class="reading-prose prose prose-lg max-w-none">
          <ContentRenderer :value="content" />
        </article>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  story: Record<string, unknown>;
  fontLevel: number;
}>();

type MinimarkNode = [string, Record<string, unknown>, ...unknown[]];

const normalizePath = (path?: string) => path?.replace(/^\/?/, "/");
const normalizeText = (text?: string) => text?.replace(/\s+/g, " ").trim().toLowerCase();

function nodeText(node: unknown): string {
  if (typeof node === "string") return node;
  return Array.isArray(node) ? node.slice(2).map(nodeText).join("") : "";
}

// The story page already renders the frontmatter cover and title above the
// reader, and imported markdown usually opens with that same image and a
// "# Title" (or bold "**Title**") line — drop those repeats.
const content = computed(() => {
  const story = props.story as {
    title?: string;
    cover?: string;
    meta?: { cover?: string };
    body?: { value?: MinimarkNode[] };
  };
  const nodes = story.body?.value;
  if (!Array.isArray(nodes)) return props.story;

  const cover = normalizePath(story.cover ?? story.meta?.cover);
  const title = normalizeText(story.title);

  const isCover = ([tag, , child]: MinimarkNode) =>
    !!cover && tag === "p" && Array.isArray(child) && child[0] === "img"
    && normalizePath((child[1] as { src?: string }).src) === cover;
  const isTitle = (node: MinimarkNode) => {
    const [tag, , child, extra] = node;
    const heading = tag === "h1" || (tag === "p" && Array.isArray(child) && child[0] === "strong" && extra === undefined);
    return !!title && heading && normalizeText(nodeText(node)) === title;
  };

  const skip = new Set<number>();
  let index = nodes.findIndex((node) => typeof node !== "string");
  for (const matches of [isCover, isTitle]) {
    if (index >= 0 && matches(nodes[index]!)) {
      skip.add(index);
      index = nodes.findIndex((node, i) => i > index && typeof node !== "string");
    }
  }
  if (!skip.size) return props.story;

  return { ...props.story, body: { ...story.body, value: nodes.filter((_, i) => !skip.has(i)) } };
});
</script>
