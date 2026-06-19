import type { Ref } from "vue";

type BookPaginationOptions = {
  sourceEl: Ref<HTMLElement | null>;
  measureEl: Ref<HTMLElement | null>;
  fontLevel: Ref<number>;
};

export function useBookPagination({ sourceEl, measureEl, fontLevel }: BookPaginationOptions) {
  const pages = ref<string[]>([]);
  const isPaginating = ref(true);
  let resizeObserver: ResizeObserver | undefined;
  let paginationFrame = 0;

  const pageCount = computed(() => pages.value.length);

  function collectBlocks() {
    const source = sourceEl.value;
    if (!source) return [];
    const contentRoot = source.children.length === 1 && source.firstElementChild instanceof HTMLElement
      ? source.firstElementChild
      : source;
    return Array.from(contentRoot.children).filter((child) => child instanceof HTMLElement) as HTMLElement[];
  }

  function createTextClone(block: HTMLElement, text: string) {
    const clone = block.cloneNode(false) as HTMLElement;
    clone.textContent = text;
    return clone;
  }

  function isHeading(block: HTMLElement) {
    return /^H[1-6]$/.test(block.tagName);
  }

  function isChapterEnd(block: HTMLElement) {
    return block.tagName === "HR";
  }

  function getKeepWithNextGroup(blocks: HTMLElement[], startIndex: number) {
    const group: HTMLElement[] = [];
    let index = startIndex;

    while (blocks[index] && isHeading(blocks[index])) {
      group.push(blocks[index]);
      index += 1;
    }

    if (group.length > 0 && blocks[index]) group.push(blocks[index]);
    return group;
  }

  function groupFitsCurrentPage(measure: HTMLElement, group: HTMLElement[]) {
    const before = measure.innerHTML;
    for (const block of group) measure.appendChild(block.cloneNode(true));
    const fits = measure.scrollHeight <= measure.clientHeight + 2;
    measure.innerHTML = before;
    return fits;
  }

  function nextBlockIsChapterEnd(blocks: HTMLElement[], index: number) {
    return Boolean(blocks[index + 1] && isChapterEnd(blocks[index + 1]));
  }

  function splitTextBlock(block: HTMLElement, measure: HTMLElement) {
    if (block.tagName !== "P") return [];

    const words = (block.textContent ?? "").split(/\s+/).filter(Boolean);
    if (words.length < 2) return [];

    const splitPages: string[] = [];
    let chunk: string[] = [];

    for (const word of words) {
      chunk.push(word);
      measure.innerHTML = "";
      measure.appendChild(createTextClone(block, chunk.join(" ")));

      if (measure.scrollHeight <= measure.clientHeight + 2) continue;

      chunk.pop();
      if (chunk.length > 0) {
        measure.innerHTML = "";
        measure.appendChild(createTextClone(block, chunk.join(" ")));
        splitPages.push(measure.innerHTML);
      }
      chunk = [word];
    }

    if (chunk.length > 0) {
      measure.innerHTML = "";
      measure.appendChild(createTextClone(block, chunk.join(" ")));
      splitPages.push(measure.innerHTML);
    }

    measure.innerHTML = "";
    return splitPages;
  }

  function paginateNow() {
    const measure = measureEl.value;
    const blocks = collectBlocks();

    if (!measure || blocks.length === 0) {
      pages.value = [];
      isPaginating.value = blocks.length === 0;
      return;
    }

    isPaginating.value = true;
    measure.innerHTML = "";

    const nextPages: string[] = [];

    for (let i = 0; i < blocks.length; i += 1) {
      const block = blocks[i];

      if (measure.innerHTML && nextBlockIsChapterEnd(blocks, i)) {
        const group = [block, blocks[i + 1]];
        if (!groupFitsCurrentPage(measure, group)) {
          nextPages.push(measure.innerHTML);
          measure.innerHTML = "";
        }
      }

      if (isHeading(block)) {
        const group = getKeepWithNextGroup(blocks, i);
        if (measure.innerHTML && group.length > 1 && !groupFitsCurrentPage(measure, group)) {
          nextPages.push(measure.innerHTML);
          measure.innerHTML = "";
        }
      }

      const before = measure.innerHTML;
      measure.appendChild(block.cloneNode(true));

      if (measure.scrollHeight <= measure.clientHeight + 2) continue;

      if (isChapterEnd(block) && before) {
        nextPages.push(measure.innerHTML);
        measure.innerHTML = "";
        continue;
      }

      if (before) {
        nextPages.push(before);
        measure.innerHTML = "";
        measure.appendChild(block.cloneNode(true));
      }

      if (measure.scrollHeight > measure.clientHeight + 2 && measure.children.length === 1) {
        const splitPages = splitTextBlock(block, measure);
        nextPages.push(...(splitPages.length > 0 ? splitPages : [measure.innerHTML]));
        measure.innerHTML = "";
      }
    }

    if (measure.innerHTML) nextPages.push(measure.innerHTML);

    pages.value = nextPages;
    isPaginating.value = false;
  }

  function schedulePagination() {
    if (!import.meta.client) return;
    cancelAnimationFrame(paginationFrame);
    paginationFrame = requestAnimationFrame(() => {
      requestAnimationFrame(paginateNow);
    });
  }

  onMounted(() => {
    schedulePagination();

    if (measureEl.value) {
      resizeObserver = new ResizeObserver(schedulePagination);
      resizeObserver.observe(measureEl.value);
    }
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(paginationFrame);
    resizeObserver?.disconnect();
  });

  watch(fontLevel, schedulePagination);

  return {
    pages,
    pageCount,
    isPaginating,
    schedulePagination,
  };
}
