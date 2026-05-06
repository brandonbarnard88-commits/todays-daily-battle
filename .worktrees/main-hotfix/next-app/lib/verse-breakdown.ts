import type { ByAudienceOverrides, CanonVerse, TdbAudience, VerseBreakdownFields } from "./daily-verse";

export function mergeVerseBreakdownForAudience(verse: CanonVerse, tier: TdbAudience): VerseBreakdownFields {
  const b = verse.breakdown;
  const o: ByAudienceOverrides = verse.byAudience[tier] ?? {};
  return {
    speaker: b.speaker,
    audience: b.audience,
    relatesToToday: o.relatesToToday ?? b.relatesToToday,
    relatesToYou: o.relatesToYou ?? b.relatesToYou,
    realTalk: o.realTalk ?? b.realTalk,
  };
}
