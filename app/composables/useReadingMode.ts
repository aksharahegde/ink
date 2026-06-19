const STORAGE_KEY = "ink-reading-mode";

export type ReadingMode = "scroll" | "book";

const DEFAULT: ReadingMode = "scroll";

function isReadingMode(value: string | null): value is ReadingMode {
  return value === "scroll" || value === "book";
}

export function useReadingMode() {
  const mode = useState<ReadingMode>("reading-mode", () => DEFAULT);

  function persist(value: ReadingMode) {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {
        /**/
      }
    }
  }

  function hydrate() {
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (isReadingMode(raw)) mode.value = raw;
      } catch {
        /**/
      }
    }
  }

  function setMode(value: ReadingMode) {
    mode.value = value;
    persist(value);
  }

  function toggleMode() {
    setMode(mode.value === "book" ? "scroll" : "book");
  }

  onMounted(hydrate);

  return { mode, setMode, toggleMode };
}
