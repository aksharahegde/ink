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

// The story page already renders the frontmatter cover above the reader, and
// imported markdown usually opens with that same image — drop the repeat.
const content = computed(() => {
  const story = props.story as {
    cover?: string;
    meta?: { cover?: string };
    body?: { value?: MinimarkNode[] };
  };
  const cover = (story.cover ?? story.meta?.cover)?.replace(/^\/?/, "/");
  const nodes = story.body?.value;
  if (!cover || !Array.isArray(nodes)) return props.story;

  const index = nodes.findIndex((node) => typeof node !== "string");
  const [tag, , child] = nodes[index] ?? [];
  const leadingImg = tag === "p" && Array.isArray(child) && child[0] === "img" ? child : undefined;
  const src = (leadingImg?.[1] as { src?: string } | undefined)?.src?.replace(/^\/?/, "/");
  if (src !== cover) return props.story;

  return { ...props.story, body: { ...story.body, value: nodes.filter((_, i) => i !== index) } };
});
</script>
