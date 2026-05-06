import type { TdbBattlePlan, TdbCached, TdbCalmMood, TdbCanonVerse } from "./tdb-payloads.js";

let cache: TdbCached | null = null;

export function initTdbData(data: TdbCached): void {
  cache = data;
}

export function clearTdbDataCache(): void {
  cache = null;
}

export function getTdbData(): TdbCached {
  if (!cache) {
    throw new Error("TDB data not initialized. Use Node (initTdbDataFromNode) or Worker (initTdbDataFromBundle) before handling requests.");
  }
  return cache;
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

export type { TdbBattlePlan, TdbCalmMood, TdbCanonVerse, TdbCached } from "./tdb-payloads.js";
