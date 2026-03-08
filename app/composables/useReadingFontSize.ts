const STORAGE_KEY = "ink-reading-font-size";
const MIN = 0;
const MAX = 2;
const DEFAULT = 1;

export function useReadingFontSize() {
  const level = useState("reading-font-size", () => DEFAULT);

  function persist(value: number) {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, String(value));
      } catch {
        /**/
      }
    }
  }

  function hydrate() {
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw !== null) {
          const n = parseInt(raw, 10);
          if (n >= MIN && n <= MAX) level.value = n;
        }
      } catch {
        /**/
      }
    }
  }

  function increase() {
    if (level.value < MAX) {
      level.value += 1;
      persist(level.value);
    }
  }

  function decrease() {
    if (level.value > MIN) {
      level.value -= 1;
      persist(level.value);
    }
  }

  onMounted(hydrate);

  return { level, increase, decrease, MIN, MAX };
}
