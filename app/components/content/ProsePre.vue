<template>
  <pre
    v-if="language === 'exhibit' || language === 'exhibit-stamp'"
    class="reading-exhibit"
    :class="{ 'reading-exhibit-stamp': language === 'exhibit-stamp' }"
  >{{ code }}</pre>
  <pre v-else :class="$props.class"><slot /></pre>
</template>

<script setup lang="ts">
defineProps({
  code: { type: String, default: "" },
  language: { type: String, default: null },
  filename: { type: String, default: null },
  highlights: { type: Array as () => number[], default: () => [] },
  meta: { type: String, default: null },
  class: { type: String, default: null },
});
</script>
