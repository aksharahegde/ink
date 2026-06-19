<template>
  <section
    ref="readerRoot"
    class="book-mode-reader"
    :data-reading-size="fontLevel"
    tabindex="0"
    aria-label="Book mode reader"
  >
    <div
      ref="sourceEl"
      class="book-mode-source reading-prose prose prose-lg max-w-none"
      aria-hidden="true"
    >
      <ContentRenderer :value="story" />
    </div>

    <div
      ref="measureEl"
      class="book-page book-page-measure"
      aria-hidden="true"
    />

    <div
      class="book-stage"
      :class="{
        'is-single-page': isSinglePage,
        'is-flipping-next': flipDirection === 'next',
        'is-flipping-prev': flipDirection === 'prev',
      }"
    >
      <div class="book-cover" aria-hidden="true" />
      <div class="book-spread">
        <article class="book-page book-page-left">
          <div
            v-if="leftPage"
            class="book-page-content reading-prose prose prose-lg max-w-none"
            v-html="leftPage"
          />
          <div v-else class="book-page-empty">
            Preparing pages...
          </div>
        </article>

        <div class="book-spine" aria-hidden="true" />

        <article
          v-if="!isSinglePage"
          class="book-page book-page-right"
        >
          <div
            v-if="rightPage"
            class="book-page-content reading-prose prose prose-lg max-w-none"
            v-html="rightPage"
          />
          <div v-else class="book-page-empty" />
        </article>
      </div>
    </div>

    <div class="book-controls font-meta" aria-label="Book page controls">
      <button
        type="button"
        class="book-control"
        data-testid="story-book-prev"
        :disabled="!canGoPrev"
        aria-label="Previous page"
        @click="goPrev"
      >
        Previous
      </button>
      <span class="book-page-count" aria-live="polite">
        {{ pageLabel }}
      </span>
      <button
        type="button"
        class="book-control"
        data-testid="story-book-next"
        :disabled="!canGoNext"
        aria-label="Next page"
        @click="goNext"
      >
        Next
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  story: Record<string, unknown>;
  fontLevel: number;
}>();

const readerRoot = ref<HTMLElement | null>(null);
const sourceEl = ref<HTMLElement | null>(null);
const measureEl = ref<HTMLElement | null>(null);
const fontLevelRef = toRef(props, "fontLevel");
const currentPage = ref(0);
const isSinglePage = ref(false);
const flipDirection = ref<"next" | "prev" | null>(null);
const prefersReducedMotion = ref(false);
const { playFlip } = usePageFlipAudio();
const { pages, pageCount, isPaginating, schedulePagination } = useBookPagination({
  sourceEl,
  measureEl,
  fontLevel: fontLevelRef,
});

let mutationObserver: MutationObserver | undefined;
let mediaQuery: MediaQueryList | undefined;
let reducedMotionQuery: MediaQueryList | undefined;
let flipTimer: ReturnType<typeof setTimeout> | undefined;

const step = computed(() => isSinglePage.value ? 1 : 2);
const spreadStart = computed(() => isSinglePage.value ? currentPage.value : Math.floor(currentPage.value / 2) * 2);
const leftPage = computed(() => pages.value[spreadStart.value]);
const rightPage = computed(() => pages.value[spreadStart.value + 1]);
const canGoPrev = computed(() => spreadStart.value > 0);
const canGoNext = computed(() => spreadStart.value + step.value < pageCount.value);

const pageLabel = computed(() => {
  if (isPaginating.value || pageCount.value === 0) return "Preparing pages";
  const first = spreadStart.value + 1;
  const last = isSinglePage.value || !rightPage.value ? first : first + 1;
  return first === last
    ? `Page ${first} of ${pageCount.value}`
    : `Pages ${first}-${last} of ${pageCount.value}`;
});

function clampCurrentPage() {
  if (pageCount.value === 0) {
    currentPage.value = 0;
    return;
  }

  const maxPage = Math.max(0, pageCount.value - 1);
  currentPage.value = Math.min(currentPage.value, maxPage);
  if (!isSinglePage.value) currentPage.value = Math.floor(currentPage.value / 2) * 2;
}

function setFlip(direction: "next" | "prev") {
  if (prefersReducedMotion.value) return;
  flipDirection.value = direction;
  clearTimeout(flipTimer);
  flipTimer = setTimeout(() => {
    flipDirection.value = null;
  }, 520);
}

async function turnPage(direction: "next" | "prev") {
  const nextPage = direction === "next"
    ? Math.min(currentPage.value + step.value, Math.max(0, pageCount.value - 1))
    : Math.max(currentPage.value - step.value, 0);

  if (nextPage === currentPage.value) return;

  currentPage.value = nextPage;
  clampCurrentPage();
  setFlip(direction);
  await playFlip();
}

function goNext() {
  void turnPage("next");
}

function goPrev() {
  void turnPage("prev");
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    goNext();
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goPrev();
  }
}

function updateMediaState() {
  isSinglePage.value = mediaQuery?.matches ?? false;
  prefersReducedMotion.value = reducedMotionQuery?.matches ?? false;
  clampCurrentPage();
  schedulePagination();
}

function observeRenderedContent() {
  if (!sourceEl.value) return;

  mutationObserver = new MutationObserver(schedulePagination);
  mutationObserver.observe(sourceEl.value, { childList: true, subtree: true });

  sourceEl.value.querySelectorAll("img").forEach((image) => {
    image.addEventListener("load", schedulePagination, { once: true });
  });
}

onMounted(() => {
  mediaQuery = window.matchMedia("(max-width: 767px)");
  reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", updateMediaState);
  reducedMotionQuery.addEventListener("change", updateMediaState);
  readerRoot.value?.addEventListener("keydown", onKeydown);
  observeRenderedContent();
  updateMediaState();
});

onBeforeUnmount(() => {
  mutationObserver?.disconnect();
  mediaQuery?.removeEventListener("change", updateMediaState);
  reducedMotionQuery?.removeEventListener("change", updateMediaState);
  readerRoot.value?.removeEventListener("keydown", onKeydown);
  clearTimeout(flipTimer);
});

watch([pageCount, isSinglePage], clampCurrentPage);
</script>
