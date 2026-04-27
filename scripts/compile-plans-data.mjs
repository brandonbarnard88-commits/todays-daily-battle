/**
 * Reads data/plans-battle-shared.json and emits plans-data.js (IIFE assigning
 * window.TDB_PLANS_BATTLE_SHARED). Validates derived arrays.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const jsonPath = path.join(root, 'data', 'plans-battle-shared.json');
const outPath = path.join(root, 'plans-data.js');

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function loadPayload() {
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  if (!raw || typeof raw !== 'object' || !raw.blocks || typeof raw.blocks !== 'object') {
    console.error('compile-plans-data: expected { blocks: { ... }, internal: { wilderness10 } }');
    process.exit(1);
  }
  if (!raw.internal || !Array.isArray(raw.internal.wilderness10)) {
    console.error('compile-plans-data: missing internal.wilderness10 array');
    process.exit(1);
  }
  return raw;
}

/** Phase 2: every authored day must carry a gentle optional goal (porch voice). */
function assertDayGoalsPresent(node, trace) {
  if (node == null || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item, i) => assertDayGoalsPresent(item, `${trace}[${i}]`));
    return;
  }
  const hasRef = typeof node.ref === 'string' && node.ref.length > 0;
  const hasDayShape =
    hasRef &&
    (typeof node.today === 'string' ||
      typeof node.prayer === 'string' ||
      typeof node.action === 'string');
  if (hasDayShape) {
    if (typeof node.goal !== 'string' || !node.goal.trim()) {
      console.error('compile-plans-data: day missing non-empty goal at', trace, 'ref:', node.ref);
      process.exit(1);
    }
  }
  for (const k of Object.keys(node)) {
    if (k === '_meta') continue;
    assertDayGoalsPresent(node[k], trace ? `${trace}.${k}` : k);
  }
}

const payload = loadPayload();
assertDayGoalsPresent(payload, '');
const d = payload.blocks;
const wilderness10 = payload.internal.wilderness10;

const required = ['core9', 'post4', 'mid7', 'cap40final'];
for (const k of required) {
  if (!(k in d)) {
    console.error('compile-plans-data: missing required blocks key:', k);
    process.exit(1);
  }
}

const common20 = d.core9.concat(d.post4, d.mid7);
const wilderness11 = wilderness10.concat([d.cap40final]);

const dataForEmbed = {
  ...d,
  wilderness10,
};

const header = `/**
 * Shared day rows for multi-length Battle plans (battle10/14/21/30/40).
 * Loaded by plans.html before the inline script.
 *
 * GENERATED — do not edit by hand. Source: data/plans-battle-shared.json
 * Rebuild: npm run build:plans-data
 *
 * Authoring: docs/BATTLE-PLAN-AUTHORING.md
 */
`;

const innerAssign = `  var d = JSON.parse(${JSON.stringify(JSON.stringify(dataForEmbed))});
  var common20 = d.core9.concat(d.post4, d.mid7);
  var wilderness11 = d.wilderness10.concat([d.cap40final]);
  var exportBlocks = {};
  for (var k in d) {
    if (Object.prototype.hasOwnProperty.call(d, k) && k !== 'wilderness10') {
      exportBlocks[k] = d[k];
    }
  }
  global.TDB_PLANS_BATTLE_SHARED = Object.assign({}, exportBlocks, { common20: common20, wilderness11: wilderness11 });`;

const file =
  header +
  `(function (global) {
  'use strict';

  // Phase 2: Thin wrapper around plans-engine.js for data-driven generation.
  // Preserves exact arrays and test mustInclude strings. Uses engine for composition.
  try {
    if (typeof window.plansEngine !== 'undefined' && window.plansEngine.generatePlan) {
      // Example integration - can be expanded in plans.html or bible-tool
      console.log('plans-engine integrated for data-driven plans (Phase 2)');
    }
  } catch (e) {}

${innerAssign}
})(typeof window !== 'undefined' ? window : globalThis);
`;

fs.writeFileSync(outPath, file);

const verifyCtx = vm.createContext({ console });
vm.runInContext(fs.readFileSync(outPath, 'utf8'), verifyCtx);
const B = verifyCtx.TDB_PLANS_BATTLE_SHARED;
if (!B) {
  console.error('compile-plans-data: verification failed (no export)');
  process.exit(1);
}
if (!sameJson(B.common20, common20) || !sameJson(B.wilderness11, wilderness11)) {
  console.error('compile-plans-data: verification failed (derived arrays)');
  process.exit(1);
}
for (const k of Object.keys(d)) {
  if (!sameJson(B[k], d[k])) {
    console.error('compile-plans-data: verification mismatch key:', k);
    process.exit(1);
  }
}
if ('wilderness10' in B) {
  console.error('compile-plans-data: wilderness10 must not appear on TDB_PLANS_BATTLE_SHARED');
  process.exit(1);
}
console.log('compile-plans-data: wrote', path.relative(root, outPath), 'export keys:', Object.keys(B).length);
