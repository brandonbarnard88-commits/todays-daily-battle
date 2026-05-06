import { normalizeBookForKjvFull } from "@/lib/reader-href";

/** Highest chapter number for a book in the KJV map (e.g. Psalms → 150). */
export function getMaxChapterForBook(map: Record<string, string>, displayBook: string): number {
  const canon = normalizeBookForKjvFull(displayBook);
  const prefix = `${canon} `;
  let max = 0;
  for (const key of Object.keys(map)) {
    if (!key.startsWith(prefix)) continue;
    const tail = key.slice(prefix.length);
    const colon = tail.indexOf(":");
    if (colon === -1) continue;
    const ch = Number(tail.slice(0, colon));
    if (Number.isFinite(ch)) max = Math.max(max, ch);
  }
  return max;
}

export type KjvVerseLine = {
  key: string;
  reference: string;
  verseNum: number;
  text: string;
};

/** In-memory cache for the large verse map (loaded once per session). */
let kjvMapPromise: Promise<Record<string, string>> | null = null;

export function loadKjvFullMap(signal?: AbortSignal): Promise<Record<string, string>> {
  if (!kjvMapPromise) {
    kjvMapPromise = fetch("/kjv-full.json", { signal })
      .then((r) => {
        if (!r.ok) throw new Error("kjv");
        return r.json() as Promise<Record<string, string>>;
      })
      .catch((e) => {
        kjvMapPromise = null;
        throw e;
      });
  }
  return kjvMapPromise;
}

/**
 * All verse lines for one chapter, sorted by verse number.
 * `book` is the display/URL form (e.g. "Psalm"); normalized internally for kjv-full keys.
 */
export function listChapterVerses(
  map: Record<string, string>,
  book: string,
  chapterNum: number,
): KjvVerseLine[] {
  const canonBook = normalizeBookForKjvFull(decodeURIComponent(book).trim());
  const prefix = `${canonBook} ${chapterNum}:`;
  const out: KjvVerseLine[] = [];
  for (const key of Object.keys(map)) {
    if (!key.startsWith(prefix)) continue;
    const tail = key.slice(prefix.length);
    const verseNum = Number(tail);
    if (!Number.isFinite(verseNum)) continue;
    const text = map[key];
    if (typeof text !== "string") continue;
    out.push({
      key,
      reference: `${canonBook} ${chapterNum}:${verseNum}`,
      verseNum,
      text,
    });
  }
  out.sort((a, b) => a.verseNum - b.verseNum);
  return out;
}
