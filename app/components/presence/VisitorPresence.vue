<template>
  <div
    class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3"
    data-testid="presence-panel"
  >
    <div
      v-if="showGlobe"
      class="rounded-2xl border p-3 shadow-lg"
      style="border-color: var(--ink-border); background-color: var(--ink-bg);"
      data-testid="presence-globe"
    >
      <p
        class="mb-2 text-center text-xs font-meta uppercase tracking-wider"
        style="color: var(--ink-muted);"
      >
        {{ count }} {{ count === 1 ? "reader" : "readers" }} now
      </p>
      <canvas
        ref="globeCanvas"
        class="block h-[220px] w-[220px] max-w-[70vw]"
        aria-hidden="true"
      />
    </div>

    <button
      type="button"
      class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-meta uppercase tracking-wider shadow-sm transition-opacity hover:opacity-90"
      style="border-color: var(--ink-border); background-color: var(--ink-bg); color: var(--ink-text);"
      :title="count ? `${count} readers on Ink` : 'Connecting readers...'"
      data-testid="presence-toggle"
      @click="showGlobe = !showGlobe"
    >
      <span
        class="inline-block h-2 w-2 rounded-full motion-safe:animate-pulse"
        :class="isConnected ? 'bg-emerald-600' : 'bg-amber-500'"
        aria-hidden="true"
      />
      <span
        class="tabular-nums"
        data-testid="presence-count"
      >
        {{ count || "—" }}
      </span>
      <span class="sr-only">readers on Ink</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { VisitorLocation } from "~/composables/useVisitorPresence";

const { count, locations, myLocation, isConnected } = useVisitorPresence();

const showGlobe = ref(false);
const globeCanvas = ref<HTMLCanvasElement | null>(null);
const phi = ref(0);

let destroyGlobe: (() => void) | undefined;

const buildMarkers = (items: VisitorLocation[]) =>
  items.map((location) => ({
    location: [location.latitude, location.longitude] as [number, number],
    size:
      myLocation.value.latitude === location.latitude
      && myLocation.value.longitude === location.longitude
        ? 0.1
        : 0.05,
  }));

watch(showGlobe, async (visible) => {
  if (!visible) {
    destroyGlobe?.();
    destroyGlobe = undefined;
    return;
  }

  if (!import.meta.client || !globeCanvas.value) return;

  const createGlobe = (await import("cobe")).default;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  destroyGlobe = createGlobe(globeCanvas.value, {
    devicePixelRatio: 2,
    width: 440,
    height: 440,
    phi: 0,
    theta: 0.2,
    dark: 0,
    diffuse: 1.2,
    mapSamples: 6000,
    mapBrightness: 6,
    baseColor: [0.85, 0.82, 0.76],
    markerColor: [0.55, 0.2, 0.12],
    glowColor: [0.9, 0.88, 0.84],
    markers: buildMarkers(locations.value),
    opacity: 0.92,
    onRender(state) {
      state.markers = buildMarkers(locations.value);
      if (!prefersReducedMotion) {
        state.phi = phi.value;
        phi.value += 0.004;
      }
    },
  });
});

onBeforeUnmount(() => {
  destroyGlobe?.();
});
</script>
