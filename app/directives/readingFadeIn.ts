import type { Directive } from "vue";

const SELECTORS = "p, blockquote, h1, h2, h3, h4, h5, h6, ul, ol";

function observeBlocks(el: HTMLElement) {
  const blocks = el.querySelectorAll(SELECTORS);
  if (blocks.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reading-visible");
        }
      }
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0,
    }
  );

  blocks.forEach((block) => {
    block.classList.add("reading-block");
    observer.observe(block);
  });
}

function init(el: HTMLElement) {
  const blocks = el.querySelectorAll(SELECTORS);
  if (blocks.length > 0) {
    observeBlocks(el);
    return;
  }
  const mo = new MutationObserver(() => {
    if (el.querySelector(SELECTORS)) {
      mo.disconnect();
      observeBlocks(el);
    }
  });
  mo.observe(el, { childList: true, subtree: true });
}

export default {
  mounted(el: HTMLElement) {
    requestAnimationFrame(() => init(el));
  },
} satisfies Directive;
