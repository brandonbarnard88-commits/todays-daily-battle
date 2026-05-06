import calmRaw from "@/data/calm-moods.json";

import { dailyVerse, resolveVerseByRef, type CanonVerse } from "./daily-verse";
import { refKey } from "./normalize-bible-ref";

export type CalmMood = {
  id: string;
  title: string;
  hint: string;
  referenceOrder: string[];
};

const moods = (calmRaw.moods ?? []) as CalmMood[];
const feelRows = (calmRaw.feelKeywords ?? []) as { keywords: string[]; moodId: string }[];

export const CALM_MOODS: readonly CalmMood[] = moods;

export function calmMoodById(id: string): CalmMood | undefined {
  return moods.find((m) => m.id === id);
}

function normalizeFeelText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2019']/g, "'")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Map optional free text to a mood id, or null if nothing clear. */
export function moodIdFromFreeText(text: string): string | null {
  const n = normalizeFeelText(text);
  if (!n) return null;

  const scores = new Map<string, number>();
  for (const row of feelRows) {
    let add = 0;
    for (const kw of row.keywords) {
      const k = kw.toLowerCase();
      if (n.includes(k)) add += k.length >= 8 ? 2 : 1;
    }
    if (add > 0) {
      scores.set(row.moodId, (scores.get(row.moodId) ?? 0) + add);
    }
  }

  let bestId: string | null = null;
  let best = 0;
  for (const [id, sc] of scores) {
    if (sc > best) {
      best = sc;
      bestId = id;
    }
  }
  return bestId;
}

export type CalmVerseHit = { verse: CanonVerse; matchedRef: boolean };

/** Up to `max` distinct verses: today’s live verse first, then mood picks in order. */
export function versesForCalmMood(moodId: string, max = 3): CalmVerseHit[] {
  const mood = calmMoodById(moodId);
  if (!mood) return [];
  const out: CalmVerseHit[] = [];
  const seen = new Set<string>();

  seen.add(refKey(dailyVerse.reference));
  out.push({ verse: dailyVerse, matchedRef: true });

  for (const ref of mood.referenceOrder) {
    const { verse, matchedRef } = resolveVerseByRef(ref);
    const key = refKey(verse.reference);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ verse, matchedRef });
    if (out.length >= max) break;
  }
  return out;
}
