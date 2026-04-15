/**
 * UTC day-of-year picker for hero-daily-365-data.js (shared by inject-home-hero + structured data).
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';

export function utcDayOfYear(d = new Date()) {
  const y = d.getUTCFullYear();
  const jan1 = Date.UTC(y, 0, 1);
  const todayUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((todayUtc - jan1) / 86400000) + 1;
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

export function pickVerseForDay(arr, dayOfYear) {
  const idx = (dayOfYear - 1) % arr.length;
  return arr[idx];
}

export function pickVerseForToday(arr, d = new Date()) {
  return pickVerseForDay(arr, utcDayOfYear(d));
}
