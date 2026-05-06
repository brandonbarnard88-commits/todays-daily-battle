import { normalizeBibleRef, refKey } from "@/lib/normalize-bible-ref";

/** Parsed chapter + verse span from a KJV-style ref (uses raw tail; does not strip verse ranges). */
export type BibleVerseSpan = {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
};

function bookKey(book: string): string {
  return refKey(`${book.trim()} 1:1`);
}

/**
 * Parse "Book C:V" or "Book C:V-W" into book, chapter, and inclusive verse span.
 * Use on catalog strings or normalized single-verse refs.
 */
export function parseRefHeadAndVerseTail(ref: string): BibleVerseSpan | null {
  const trimmed = ref.replace(/\u00A0/g, " ").trim();
  const colon = trimmed.lastIndexOf(":");
  if (colon === -1) return null;
  const tail = trimmed.slice(colon + 1);
  const head = trimmed.slice(0, colon).trim();
  const lastSpace = head.lastIndexOf(" ");
  if (lastSpace === -1) return null;
  const book = head.slice(0, lastSpace).trim();
  const chapter = Number(head.slice(lastSpace + 1));
  if (!Number.isFinite(chapter) || !book) return null;
  const vm = tail.match(/^(\d+)(?:-(\d+))?/);
  if (!vm) return null;
  const verseStart = Number(vm[1]);
  const verseEnd = vm[2] ? Number(vm[2]) : verseStart;
  if (!Number.isFinite(verseStart) || !Number.isFinite(verseEnd)) return null;
  return { book, chapter, verseStart, verseEnd };
}

function sameBookChapter(a: BibleVerseSpan, b: BibleVerseSpan): boolean {
  return bookKey(a.book) === bookKey(b.book) && a.chapter === b.chapter;
}

/** True if a single-verse ref falls inside a catalog ref span (e.g. 4:7 inside 4:6–7). */
export function verseRefWithinCatalogSpan(singleVerseRef: string, catalogRefRaw: string): boolean {
  const singleNorm = normalizeBibleRef(singleVerseRef);
  const a = parseRefHeadAndVerseTail(singleNorm);
  const b = parseRefHeadAndVerseTail(catalogRefRaw.trim());
  if (!a || !b) return false;
  if (!sameBookChapter(a, b)) return false;
  return a.verseStart >= b.verseStart && a.verseStart <= b.verseEnd;
}
