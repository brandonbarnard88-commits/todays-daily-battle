/**
 * On-device “mood band” hints → KJV refs that exist in `canon-daily-verse.json` (today + catalog).
 * No network calls — links land on Memorize with the ref pre-filled.
 */

export type GentlePick = {
  id: string;
  mood: string;
  hint: string;
  reference: string;
};

export const GENTLE_PICKS: readonly GentlePick[] = [
  {
    id: "weary",
    mood: "Weary — need strength for the next step",
    hint: "Isaiah 40 — wind for the long day",
    reference: "Isaiah 40:31",
  },
  {
    id: "anxious",
    mood: "Heavy or worried",
    hint: "Philippians 4 — prayer and peace",
    reference: "Philippians 4:6-7",
  },
  {
    id: "rest",
    mood: "Need rest (not quitting)",
    hint: "Matthew 11 — come to Jesus",
    reference: "Matthew 11:28",
  },
] as const;

export function memorizeHrefForRef(reference: string): string {
  return `/memorize?ref=${encodeURIComponent(reference)}`;
}
