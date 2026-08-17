#!/usr/bin/env node
/**
 * Soft guard for the 90-day feature freeze (docs/FEATURE-FREEZE-90-DAYS.md).
 * Exits 0 always unless FREEZE_STRICT=1 and today is inside the freeze window
 * and FREEZE_OVERRIDE is not set — then prints reminder (still exits 0 unless
 * FREEZE_FAIL=1).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const doc = path.join(root, 'docs', 'FEATURE-FREEZE-90-DAYS.md');
const text = fs.existsSync(doc) ? fs.readFileSync(doc, 'utf8') : '';
const start = '2026-08-04';
const end = '2026-08-17';
const today = new Date().toISOString().slice(0, 10);
const active = today >= start && today < end;

console.log('feature-freeze: window ' + start + ' → ' + end + ' (today ' + today + ')');
console.log('feature-freeze: ' + (active ? 'ACTIVE — Grove polish only' : 'inactive — church adoption work allowed'));
if (!text.includes('Grove polish')) {
  console.error('feature-freeze: docs/FEATURE-FREEZE-90-DAYS.md missing Grove polish rule');
  process.exit(1);
}
if (active && process.env.FREEZE_STRICT === '1' && !process.env.FREEZE_OVERRIDE) {
  console.log('feature-freeze: reminder — no new campus wings; security/bugfix/Grove OK');
  if (process.env.FREEZE_FAIL === '1') process.exit(2);
}
process.exit(0);
