<template>
  <div
    class="p-6 border"
    :style="{ borderColor: 'var(--ink-border)', backgroundColor: 'var(--ink-paper)' }"
    data-testid="newsletter-signup"
  >
    <h3
      class="font-serif text-lg font-bold"
      style="color: var(--ink-text);"
    >
      Newsletter
    </h3>
    <p class="mt-2 text-sm" style="color: var(--ink-muted);">
      New stories delivered to your inbox.
    </p>
    <form
      class="mt-4 space-y-3"
      @submit.prevent="handleSubmit"
    >
      <input
        v-model="email"
        type="email"
        placeholder="you@example.com"
        class="w-full px-3 py-2 text-sm border font-meta focus:outline-none focus:ring-1"
        :style="{
          borderColor: 'var(--ink-border)',
          backgroundColor: 'var(--ink-bg)',
          color: 'var(--ink-text)',
        }"
        :disabled="submitted"
        required
      />
      <button
        type="submit"
        class="w-full px-3 py-2 text-sm font-meta tracking-wide transition-opacity hover:opacity-80 disabled:opacity-50"
        :style="{
          backgroundColor: 'var(--ink-text)',
          color: 'var(--ink-bg)',
        }"
        :disabled="submitted || loading"
      >
        {{ submitted ? "Subscribed" : "Subscribe" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const email = ref("");
const loading = ref(false);
const submitted = ref(false);

const handleSubmit = async () => {
  if (submitted.value || !email.value) return;
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 600));
    submitted.value = true;
  } finally {
    loading.value = false;
  }
};
</script>
