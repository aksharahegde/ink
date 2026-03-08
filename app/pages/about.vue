<template>
  <div class="view-transition max-w-[680px] mx-auto px-4 pt-12 md:pt-20 pb-20">
    <hr class="ink-rule mb-8" />
    <h1
      class="font-serif text-3xl md:text-4xl font-bold tracking-tight"
      style="color: var(--ink-text);"
    >
      About
    </h1>
    <hr class="ink-rule mt-3 mb-10" />
    <div
      class="font-serif text-lg leading-relaxed space-y-6"
      style="color: var(--ink-text);"
    >
      <p>
        My name is not enough to know about me. But still I have to tell about I, me and myself.
      </p>
      <p>
        My name is Hegde. Software Development is my profession. I love to do it. Apart from my professional work, I compose music for my own songs. Sometimes I write poems and stories.
      </p>
      <p>
        More than all these facts, Am a chaser of success, not the people. So many people came and gone out of my life. But the one thing that always remaining with me is confidence, determination to achieve something.. not to impress others.. it's to express my power and knowledge.
      </p>
      <p>
        <a
          href="https://x.com/akshara_dev"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:opacity-80 transition-opacity"
          style="color: var(--ink-accent); text-decoration: underline; text-underline-offset: 0.2em;"
        >
          Twitter: https://x.com/akshara_dev
        </a>
      </p>
    </div>
    <hr class="ink-rule mt-12" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "About",
});
</script>
