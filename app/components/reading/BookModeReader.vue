<template>
  <section
    ref="readerRoot"
    class="book-mode-reader"
    :class="{ 'is-controls-visible': isControlsVisible }"
    :data-reading-size="fontLevel"
    tabindex="0"
    aria-label="Book mode reader"
    @mouseenter="onReaderMouseEnter"
    @mouseleave="onReaderMouseLeave"
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

    <button
      type="button"
      class="book-focus-exit"
      data-testid="story-bookmode-toggle"
      aria-label="Switch to normal mode"
      @click="exitBookMode"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M9 21H3v-6" />
        <path d="M14 10 3 21" />
      </svg>
    </button>

    <div
      class="book-stage"
      :class="{
        'is-single-page': isSinglePage,
        'is-flipping-next': flipDirection === 'next',
        'is-flipping-prev': flipDirection === 'prev',
      }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
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

        <div
          v-if="flipDirection && turnFrontPage"
          class="book-turn-sheet"
          aria-hidden="true"
          @animationend="finishFlip"
        >
          <div
            class="book-turn-face book-turn-front reading-prose prose prose-lg max-w-none"
            v-html="turnFrontPage"
          />
          <div
            class="book-turn-face book-turn-back reading-prose prose prose-lg max-w-none"
            v-html="turnBackPage"
          />
        </div>
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  story: Record<string, unknown>;
  fontLevel: number;
}>();

const SWIPE_THRESHOLD = 50;
const LONG_PRESS_MS = 450;
const LONG_PRESS_SLOP = 10;
const CONTROLS_HIDE_MS = 3000;

const readerRoot = ref<HTMLElement | null>(null);
const sourceEl = ref<HTMLElement | null>(null);
const measureEl = ref<HTMLElement | null>(null);
const fontLevelRef = toRef(props, "fontLevel");
const currentPage = ref(0);
const isSinglePage = ref(false);
const flipDirection = ref<"next" | "prev" | null>(null);
const prefersReducedMotion = ref(false);
const turnFrontPage = ref("");
const turnBackPage = ref("");
const pendingPage = ref<number | null>(null);
const isControlsVisible = ref(false);
const { setMode } = useReadingMode();
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
let longPressTimer: ReturnType<typeof setTimeout> | undefined;
let controlsHideTimer: ReturnType<typeof setTimeout> | undefined;
let pointerId: number | null = null;
let pointerStartX = 0;
let pointerStartY = 0;
let pointerMoved = false;
let longPressTriggered = false;
let isCoarsePointer = false;

const step = computed(() => isSinglePage.value ? 1 : 2);
const spreadStart = computed(() => isSinglePage.value ? currentPage.value : Math.floor(currentPage.value / 2) * 2);
const displayedPage = computed(() => pendingPage.value ?? currentPage.value);
const displayedSpreadStart = computed(() =>
  isSinglePage.value ? displayedPage.value : Math.floor(displayedPage.value / 2) * 2
);
const leftPage = computed(() => pages.value[displayedSpreadStart.value]);
const rightPage = computed(() => pages.value[displayedSpreadStart.value + 1]);
const isFlipping = computed(() => flipDirection.value !== null);
const canGoPrev = computed(() => !isFlipping.value && spreadStart.value > 0);
const canGoNext = computed(() => !isFlipping.value && spreadStart.value + step.value < pageCount.value);

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

function finishFlip() {
  clearTimeout(flipTimer);

  if (pendingPage.value !== null) {
    currentPage.value = pendingPage.value;
    pendingPage.value = null;
    clampCurrentPage();
  }

  flipDirection.value = null;
  turnFrontPage.value = "";
  turnBackPage.value = "";
}

function setFlip(direction: "next" | "prev", nextPage: number) {
  if (prefersReducedMotion.value) {
    currentPage.value = nextPage;
    clampCurrentPage();
    return;
  }

  const nextSpreadStart = isSinglePage.value ? nextPage : Math.floor(nextPage / 2) * 2;
  flipDirection.value = direction;
  pendingPage.value = nextPage;
  turnFrontPage.value = direction === "next"
    ? pages.value[spreadStart.value + (isSinglePage.value ? 0 : 1)] ?? ""
    : pages.value[spreadStart.value] ?? "";
  turnBackPage.value = direction === "next"
    ? pages.value[nextSpreadStart] ?? ""
    : pages.value[nextSpreadStart + (isSinglePage.value ? 0 : 1)] ?? pages.value[nextSpreadStart] ?? "";

  clearTimeout(flipTimer);
  flipTimer = setTimeout(finishFlip, 900);
}

async function turnPage(direction: "next" | "prev") {
  const nextPage = direction === "next"
    ? Math.min(currentPage.value + step.value, Math.max(0, pageCount.value - 1))
    : Math.max(currentPage.value - step.value, 0);

  if (nextPage === currentPage.value) return;

  setFlip(direction, nextPage);
  await playFlip();
}

function goNext() {
  if (isCoarsePointer && isControlsVisible.value) scheduleControlsHide();
  void turnPage("next");
}

function goPrev() {
  if (isCoarsePointer && isControlsVisible.value) scheduleControlsHide();
  void turnPage("prev");
}

function clearControlsHideTimer() {
  clearTimeout(controlsHideTimer);
  controlsHideTimer = undefined;
}

function scheduleControlsHide() {
  clearControlsHideTimer();
  if (!isCoarsePointer) return;
  controlsHideTimer = setTimeout(() => {
    isControlsVisible.value = false;
  }, CONTROLS_HIDE_MS);
}

function showControls() {
  isControlsVisible.value = true;
  scheduleControlsHide();
}

function hideControls() {
  clearControlsHideTimer();
  isControlsVisible.value = false;
}

function exitBookMode() {
  hideControls();
  setMode("scroll");
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function onKeydown(event: KeyboardEvent) {
  if (isTypingTarget(event.target)) return;

  if (event.key === "ArrowRight") {
    event.preventDefault();
    goNext();
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goPrev();
  }
}

function onReaderMouseEnter() {
  if (isCoarsePointer) return;
  isControlsVisible.value = true;
}

function onReaderMouseLeave() {
  if (isCoarsePointer) return;
  isControlsVisible.value = false;
}

function clearLongPressTimer() {
  clearTimeout(longPressTimer);
  longPressTimer = undefined;
}

function onPointerDown(event: PointerEvent) {
  if (event.pointerType === "mouse" && event.button !== 0) return;

  pointerId = event.pointerId;
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  pointerMoved = false;
  longPressTriggered = false;
  clearLongPressTimer();

  if (event.pointerType !== "mouse") {
    longPressTimer = setTimeout(() => {
      longPressTriggered = true;
      showControls();
    }, LONG_PRESS_MS);
  }

  (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
  if (pointerId === null || event.pointerId !== pointerId) return;

  const dx = event.clientX - pointerStartX;
  const dy = event.clientY - pointerStartY;

  if (Math.abs(dx) > LONG_PRESS_SLOP || Math.abs(dy) > LONG_PRESS_SLOP) {
    pointerMoved = true;
    clearLongPressTimer();
  }
}

function onPointerUp(event: PointerEvent) {
  if (pointerId === null || event.pointerId !== pointerId) return;

  const dx = event.clientX - pointerStartX;
  const dy = event.clientY - pointerStartY;
  clearLongPressTimer();

  if (longPressTriggered) {
    pointerId = null;
    return;
  }

  if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
    if (isControlsVisible.value && isCoarsePointer) hideControls();
    if (dx < 0) goNext();
    else goPrev();
  } else if (!pointerMoved && isCoarsePointer && isControlsVisible.value) {
    const target = event.target;
    if (target instanceof Element && !target.closest(".book-controls, .book-focus-exit")) {
      hideControls();
    }
  }

  pointerId = null;
}

function onPointerCancel(event: PointerEvent) {
  if (pointerId === null || event.pointerId !== pointerId) return;
  clearLongPressTimer();
  pointerId = null;
}

function updateMediaState() {
  isSinglePage.value = mediaQuery?.matches ?? false;
  prefersReducedMotion.value = reducedMotionQuery?.matches ?? false;
  isCoarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
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
  window.addEventListener("keydown", onKeydown);
  observeRenderedContent();
  updateMediaState();
});

onBeforeUnmount(() => {
  mutationObserver?.disconnect();
  mediaQuery?.removeEventListener("change", updateMediaState);
  reducedMotionQuery?.removeEventListener("change", updateMediaState);
  window.removeEventListener("keydown", onKeydown);
  clearTimeout(flipTimer);
  clearLongPressTimer();
  clearControlsHideTimer();
});

watch([pageCount, isSinglePage], clampCurrentPage);
</script>
