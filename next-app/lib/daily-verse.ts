/** Pilot daily verse — replace with build-time / CMS sync when wired. */

export const dailyVerse = {
  reference: "Isaiah 40:31",
  text: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
  breakdown: {
    speaker: "Isaiah, speaking God’s word",
    audience: "God’s people in exhaustion and exile — anyone whose strength has run out",
    plain:
      "When we wait on the Lord instead of rushing our own fix, He renews us. We can keep going — not by sheer willpower, but by His strength.",
  },
  byAudience: {
    kid: "When we slow down and trust God instead of panicking, He helps our hearts feel strong again — like we can keep going.",
    teen: "If you feel burned out or behind, this verse says strength comes from waiting on God — not from forcing everything yourself.",
    adult:
      "When the day is long and your tank is empty, God invites you to wait on Him. That kind of waiting is active trust — and He meets you with endurance.",
  },
} as const;

export type DailyVerse = typeof dailyVerse;

/** Normalize reference from query string; falls back to today’s verse. */
export function resolveVerseByRef(ref: string | null | undefined): DailyVerse {
  if (!ref) return dailyVerse;
  const decoded = decodeURIComponent(ref).trim();
  if (!decoded) return dailyVerse;
  if (decoded.toLowerCase() === dailyVerse.reference.toLowerCase()) return dailyVerse;
  return dailyVerse;
}

/** Short prayer starters that echo today’s theme — optional taps on the Prayer Wall. */
export const verseEchoPrompts = [
  "Lord, renew my strength today — I wait on You.",
  "Teach me what it means to wait on You, not rush my own fix.",
  "Thank You for patience with me when I am weary.",
] as const;
