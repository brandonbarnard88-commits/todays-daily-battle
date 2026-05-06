/**
 * One-off / maintenance: load legacy plans-data.js in a VM and write
 * data/plans-battle-shared.json (omits derived common20 + wilderness11).
 * Preserves internal wilderness10 (not exposed on TDB_PLANS_BATTLE_SHARED).
 * Normal workflow: edit JSON only, run npm run build:plans-data.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const jsPath = path.join(root, 'plans-data.js');
const outPath = path.join(root, 'data', 'plans-battle-shared.json');

const code = fs.readFileSync(jsPath, 'utf8');
const ctx = vm.createContext({ console });
vm.runInContext(code, ctx);
const B = ctx.TDB_PLANS_BATTLE_SHARED;
if (!B || typeof B !== 'object') {
  console.error('extract-plans-data-to-json: TDB_PLANS_BATTLE_SHARED missing');
  process.exit(1);
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

if (!sameJson(B.common20, B.core9.concat(B.post4, B.mid7))) {
  console.error('extract-plans-data-to-json: common20 !== core9.concat(post4, mid7)');
  process.exit(1);
}

const w11 = B.wilderness11;
if (!Array.isArray(w11) || w11.length < 2) {
  console.error('extract-plans-data-to-json: wilderness11 invalid');
  process.exit(1);
}
const capLast = w11[w11.length - 1];
if (!sameJson(capLast, B.cap40final)) {
  console.error('extract-plans-data-to-json: wilderness11 last entry !== cap40final');
  process.exit(1);
}
const wilderness10 = w11.slice(0, -1);
const wilderness11Check = wilderness10.concat([B.cap40final]);
if (!sameJson(w11, wilderness11Check)) {
  console.error('extract-plans-data-to-json: could not derive wilderness10 from wilderness11');
  process.exit(1);
}

const { common20: _c, wilderness11: _w, ...blocks } = B;
const payload = {
  _meta: {
    schemaVersion: 1,
    description:
      'Source data for plans-data.js. Derived: common20 = core9+post4+mid7; wilderness11 = internal.wilderness10 + cap40final.',
  },
  internal: {
    wilderness10,
  },
  blocks,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');
console.log('Wrote', outPath, 'block keys:', Object.keys(blocks).length);
