import canonRaw from "@/data/canon-daily-verse.json";
import { normalizeBibleRef, refKey } from "@/lib/normalize-bible-ref";

const meta = canonRaw._meta as { version?: number; updatedAt?: string };

/** Bump `data/canon-daily-verse.json` `_meta.version` when changing canon text or catalog. */
export const CANON_VERSION = typeof meta?.version === "number" ? meta.version : 1;

/** ISO timestamp from canon JSON — surfaced in JSON-LD `dateModified` when present. */
export const CANON_UPDATED_AT =
  typeof meta?.updatedAt === "string" && meta.updatedAt.length > 0 ? meta.updatedAt : "";

export type TdbAudience = "kid" | "teen" | "adult";

/** Five calm breakdown fields — KJV text stays separate; this is all helper copy. */
export type VerseBreakdownFields = {
  speaker: string;
  audience: string;
  relatesToToday: string;
  relatesToYou: string;
  realTalk: string;
};

export type ByAudienceOverrides = Partial<Pick<VerseBreakdownFields, "relatesToToday" | "relatesToYou" | "realTalk">>;

export type CanonVerse = {
  reference: string;
  text: string;
  breakdown: VerseBreakdownFields;
  byAudience: Record<TdbAudience, ByAudienceOverrides>;
  verseEchoPrompts?: readonly string[];
};

const today = canonRaw.today as CanonVerse;

/** Today’s verse — same object JSON-LD, home, /verse, Memorize default, and Prayer Wall echo pull from here. */
export const dailyVerse: CanonVerse = today;

/** Gentle prayer starters for the current “today” block (see JSON for per-catalog prompts when you add UI). */
export const verseEchoPrompts: readonly string[] = today.verseEchoPrompts ?? [];

export type DailyVerse = CanonVerse;

const catalog = (canonRaw.catalog ?? []) as CanonVerse[];

function buildRefMap(): Map<string, CanonVerse> {
  const m = new Map<string, CanonVerse>();
  m.set(refKey(today.reference), today);
  for (const v of catalog) {
    m.set(refKey(v.reference), v);
  }
  return m;
}

const refMap = buildRefMap();

/**
 * Resolve a memorization / deep-link ref to verse content.
 * Unknown refs fall back to **today** with `matchedRef: false` so UI can show a gentle note (still KJV, still calm).
 */
export function resolveVerseByRef(ref: string | null | undefined): {
  verse: CanonVerse;
  matchedRef: boolean;
  normalizedRequest?: string;
} {
  if (!ref || !String(ref).trim()) {
    return { verse: today, matchedRef: true };
  }
  let decoded = String(ref);
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    /* use raw */
  }
  const normalized = normalizeBibleRef(decoded);
  const hit = refMap.get(refKey(normalized));
  if (hit) {
    return { verse: hit, matchedRef: true, normalizedRequest: normalized };
  }
  return { verse: today, matchedRef: false, normalizedRequest: normalized };
}

/** Optional: refs available in the pilot catalog (today + catalog). */
export function listCanonReferences(): string[] {
  return Array.from(new Set([today.reference, ...catalog.map((c) => c.reference)]));
}
