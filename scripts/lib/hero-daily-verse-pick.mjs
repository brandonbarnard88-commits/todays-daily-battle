/**
 * UTC picker for the home hero queue (365 or 730 days).
 * Cycle is days since 2026-01-01 UTC, then modulo the queue length — forever.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';

export const HERO_QUEUE_EPOCH_UTC = Date.UTC(2026, 0, 1);

export function utcDayOfYear(d = new Date()) {
  const y = d.getUTCFullYear();
  const jan1 = Date.UTC(y, 0, 1);
  const todayUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((todayUtc - jan1) / 86400000) + 1;
}

export function utcDaysSinceHeroEpoch(d = new Date()) {
  const todayUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((todayUtc - HERO_QUEUE_EPOCH_UTC) / 86400000);
}

export function loadYear365(rootDir) {
  const dataPath = path.join(rootDir, 'hero-daily-365-data.js');
  const code = fs.readFileSync(dataPath, 'utf8');
  const ctx = {};
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  const arr = ctx.__TDB_HERO_DAILY_YEAR;
  if (!Array.isArray(arr) || !arr.length) {
    throw new Error('hero-daily-verse-pick: __TDB_HERO_DAILY_YEAR missing or empty');
  }
  return arr;
}

export function pickVerseAtOffset(arr, offsetDays) {
  if (!arr || !arr.length) return null;
  const idx = ((Number(offsetDays) % arr.length) + arr.length) % arr.length;
  return arr[idx];
}

/** Day-of-year slot (year-1 style). Prefer pickVerseForToday for the live 2-year queue. */
export function pickVerseForDay(arr, dayOfYear) {
  return pickVerseAtOffset(arr, (dayOfYear || 1) - 1);
}

export function pickVerseForToday(arr, d = new Date()) {
  return pickVerseAtOffset(arr, utcDaysSinceHeroEpoch(d));
}
