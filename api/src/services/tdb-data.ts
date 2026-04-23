import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

import { resolveTdbDataRoot } from "../lib/paths.js";

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

type Cached = {
  root: string;
  canon: z.infer<typeof CanonFile>;
  plans: z.infer<typeof BattlePlansFile>;
  calm: z.infer<typeof CalmMoodsFile>;
  loadedAt: string;
};

let cache: Cached | null = null;

function loadAll(root: string): Cached {
  const canonRaw = JSON.parse(
    readFileSync(join(root, "canon-daily-verse.json"), "utf8")
  ) as unknown;
  const plansRaw = JSON.parse(
    readFileSync(join(root, "battle-plans.json"), "utf8")
  ) as unknown;
  const calmRaw = JSON.parse(
    readFileSync(join(root, "calm-moods.json"), "utf8")
  ) as unknown;

  return {
    root,
    canon: CanonFile.parse(canonRaw),
    plans: BattlePlansFile.parse(plansRaw),
    calm: CalmMoodsFile.parse(calmRaw),
    loadedAt: new Date().toISOString(),
  };
}

export function getTdbData(): Cached {
  if (cache) return cache;
  const root = resolveTdbDataRoot();
  cache = loadAll(root);
  return cache;
}

/** For tests or long-running deploys with file swaps — optional hot reload. */
export function clearTdbDataCache(): void {
  cache = null;
}

export function getDailyVerse(): TdbCanonVerse {
  return getTdbData().canon.today;
}

export function getCanonVerseList(): TdbCanonVerse[] {
  const { today, catalog = [] } = getTdbData().canon;
  return [today, ...catalog];
}

export function listBattlePlans(): TdbBattlePlan[] {
  return getTdbData().plans.plans;
}

export function getBattlePlanBySlug(slug: string): TdbBattlePlan | undefined {
  return listBattlePlans().find((p) => p.slug === slug);
}

export function listCalmMoods(): TdbCalmMood[] {
  return getTdbData().calm.moods;
}

export function getDataMeta() {
  const d = getTdbData();
  return { dataRoot: d.root, loadedAt: d.loadedAt };
}
