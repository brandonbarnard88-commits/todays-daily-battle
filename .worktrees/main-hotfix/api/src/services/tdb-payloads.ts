import { z } from "zod";

const PlanDay = z.object({
  day: z.number(),
  reference: z.string(),
  gentleNote: z.string().optional(),
});

const BattlePlan = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  days: z.array(PlanDay),
});

const CalmMood = z.object({
  id: z.string(),
  title: z.string(),
  hint: z.string(),
  referenceOrder: z.array(z.string()),
});

const AudienceBlock = z.object({
  relatesToToday: z.string().optional(),
  relatesToYou: z.string().optional(),
  realTalk: z.string().optional(),
});

const VerseBreakdownFields = z.object({
  speaker: z.string(),
  audience: z.string(),
  relatesToToday: z.string(),
  relatesToYou: z.string(),
  realTalk: z.string(),
});

const CanonVerse = z.object({
  reference: z.string(),
  text: z.string(),
  breakdown: VerseBreakdownFields,
  byAudience: z.object({
    kid: AudienceBlock,
    teen: AudienceBlock,
    adult: AudienceBlock,
  }),
  quietPrayerNudge: z.string().optional(),
  verseEchoPrompts: z.array(z.string()).optional(),
});

const CanonFile = z.object({
  _meta: z.unknown().optional(),
  today: CanonVerse,
  catalog: z.array(CanonVerse).optional(),
});

const BattlePlansFile = z.object({
  _meta: z.unknown().optional(),
  plans: z.array(BattlePlan),
});

const CalmMoodsFile = z.object({
  _meta: z.unknown().optional(),
  moods: z.array(CalmMood),
});

export type TdbBattlePlan = z.infer<typeof BattlePlan>;
export type TdbCanonVerse = z.infer<typeof CanonVerse>;
export type TdbCalmMood = z.infer<typeof CalmMood>;

export type TdbCached = {
  root: string;
  canon: z.infer<typeof CanonFile>;
  plans: z.infer<typeof BattlePlansFile>;
  calm: z.infer<typeof CalmMoodsFile>;
  loadedAt: string;
};

export function parseTdbToCached(
  canonRaw: unknown,
  plansRaw: unknown,
  calmRaw: unknown,
  dataRoot: string
): TdbCached {
  return {
    root: dataRoot,
    canon: CanonFile.parse(canonRaw),
    plans: BattlePlansFile.parse(plansRaw),
    calm: CalmMoodsFile.parse(calmRaw),
    loadedAt: new Date().toISOString(),
  };
}
