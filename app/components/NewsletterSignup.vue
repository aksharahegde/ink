<template>
  <div
    class="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 bg-zinc-100 dark:bg-zinc-900/30"
    data-testid="newsletter-signup"
  >
    <h2 class="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
      Stay in the loop
    </h2>
    <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-500">
      New stories and updates, no spam.
    </p>
    <form
      class="mt-6 flex flex-col sm:flex-row gap-3"
      @submit.prevent="handleSubmit"
    >
      <UInput
        v-model="email"
        type="email"
        placeholder="you@example.com"
        class="flex-1 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
        :disabled="submitted"
        required
      />
      <UButton
        type="submit"
        color="gray"
        variant="solid"
        :loading="loading"
        :disabled="submitted"
      >
        {{ submitted ? "Subscribed" : "Subscribe" }}
      </UButton>
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
