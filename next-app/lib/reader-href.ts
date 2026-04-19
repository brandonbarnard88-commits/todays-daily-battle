import { getMainSiteOrigin } from "@/lib/main-site";
import { normalizeBibleRef } from "@/lib/normalize-bible-ref";

/**
 * Parse a KJV-style reference (e.g. "Isaiah 54:10", "Philippians 4:6-7", "1 John 3:16")
 * into book + chapter for the static site's `reader.html?book=&chapter=`.
 */
export function parseRefToBookChapter(ref: string): { book: string; chapter: string } | null {
  const norm = normalizeBibleRef(ref);
  const colon = norm.indexOf(":");
  if (colon === -1) return null;
  const head = norm.slice(0, colon).trim();
  const lastSpace = head.lastIndexOf(" ");
  if (lastSpace === -1) return null;
  const book = head.slice(0, lastSpace).trim();
  const chapter = head.slice(lastSpace + 1).trim();
  if (!book || !chapter || !/^\d+$/.test(chapter)) return null;
  return { book, chapter };
}

/** Full URL to the production chapter reader for the chapter containing `ref`. */
export function mainSiteReaderUrlForRef(ref: string): string | null {
  const parsed = parseRefToBookChapter(ref);
  if (!parsed) return null;
  const origin = getMainSiteOrigin();
  const q = new URLSearchParams({ book: parsed.book, chapter: parsed.chapter });
  return `${origin}/reader.html?${q.toString()}`;
}
