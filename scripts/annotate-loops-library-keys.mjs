/**
 * Adds optional `libraryKey` to each loops.json entry by matching title + KJV ref
 * to rows in kids/bible-story-tool-index.js (298 Bible Story Library keys).
 *
 * Run: node scripts/annotate-loops-library-keys.mjs
 * Then bump LOOPS_URL ?v= in script.js so browsers fetch fresh JSON.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const LOOPS_PATH = path.join(ROOT, 'loops.json');
const INDEX_PATH = path.join(ROOT, 'kids', 'bible-story-tool-index.js');

function loadStoryIndex() {
  const raw = fs.readFileSync(INDEX_PATH, 'utf8');
  const m = /global\.TDB_BIBLE_STORY_TOOL_INDEX = (\[[\s\S]*?\]);/.exec(raw);
  if (!m) throw new Error('Could not parse TDB_BIBLE_STORY_TOOL_INDEX');
  return JSON.parse(m[1]);
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function refStem(ref) {
  const safe = String(ref || '').trim();
  const m = safe.match(/^((?:[1-3]\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+)/);
  if (!m) return '';
  return (m[1] + ' ' + m[2]).toLowerCase().replace(/\s+/g, ' ');
}

function tokenSet(str) {
  const t = normalizeText(str);
  const stop = new Set(['the', 'and', 'with', 'from', 'into', 'this', 'that', 'for', 'his', 'her', 'was', 'are']);
  return new Set(
    t
      .split(/\s+/)
      .filter((w) => w.length > 1 && !stop.has(w))
  );
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

function scoreLoopToRow(loop, row) {
  let score = 0;
  const loopStem = refStem(loop.ref);
  const rowStem = refStem(row.kjvRef.split(/[;,]/)[0].trim());
  if (loopStem && rowStem && loopStem === rowStem) score += 50;

  const loopTok = tokenSet(loop.title + ' ' + loop.ref);
  const rowTok = tokenSet(row.title + ' ' + row.kjvRef + ' ' + row.kw + ' ' + row.key);
  const jac = jaccard(loopTok, rowTok);
  score += jac * 40;

  const lt = normalizeText(loop.title);
  const rt = normalizeText(row.title);
  if (lt && rt && (lt.includes(rt) || rt.includes(lt))) score += 12;

  return score;
}

function bestLibraryKey(loop, rows) {
  let best = null;
  let bestScore = -1;
  for (let i = 0; i < rows.length; i++) {
    const s = scoreLoopToRow(loop, rows[i]);
    if (s > bestScore) {
      bestScore = s;
      best = rows[i].key;
    }
  }
  if (bestScore < 18) return '';
  return best;
}

/**
 * Manual bridges for titles/refs the scorer misses — every key must exist in TDB_BIBLE_STORY_TOOL_INDEX.
 * (Animated loop ≠ full library card yet; this still lands families on the closest read-and-quiz story.)
 */
const LIBRARY_KEY_BY_LOOP_ID = {
  18: 'elijahFire',
  1: 'davidGoliath',
  2: 'noah',
  23: 'adamEve',
  31: 'burningBush',
  32: 'manna',
  35: 'bronzeSerpent',
  46: 'elijahRavens',
  47: 'elijahHoreb',
  50: 'faithMountain',
  51: 'nehemiahWalls',
  52: 'ezraReturn',
  53: 'jonah',
  54: 'isaiahMessianic',
  55: 'jeremiahWeeping',
  57: 'daniel',
  58: 'holySpiritPentecost',
  59: 'shepherdsStar',
  60: 'malachiMessage',
  64: 'jesusBirth',
  95: 'earlyChurchLife',
  104: 'jesus',
  105: 'creationLight',
  110: 'earlyChurchLife',
  123: 'jairus',
  126: 'solomonWisdom',
  127: 'miriamSong',
  128: 'hannahPray',
  129: 'jobSuffering',
  130: 'solomonWisdom',
  131: 'miriamSong',
  132: 'revelationSongsAndHarvest',
  135: 'healLeper',
  149: 'jesusFeeds5000',
  151: 'maryAnoint',
  152: 'fruitSpirit',
  154: 'philippiansJoy',
  156: 'revelationThroneRoom',
  157: 'revelationSeals',
  161: 'tabernacle',
  121: 'rahab',
  38: 'gideonFleece',
  39: 'gideonMidianites',
  122: 'deborahBarak',
  162: 'joshuaCharge',
  163: 'sunStandsStill',
  164: 'achan',
  165: 'battleOfAi',
  166: 'samsonBirth',
  167: 'samsonLion',
  7: 'samson',
  168: 'samsonDelilah',
  169: 'ruthNaomi',
  170: 'ruthBoaz',
  171: 'ruthThreshing',
  172: 'ruthRedemption',
  40: 'hannahPrayer',
  41: 'samuelCalls',
  173: 'samuelBirth',
  174: 'davidAnointed',
  43: 'davidJonathan',
  175: 'davidCave',
  176: 'davidHarp',
  177: 'davidKing',
  178: 'solomonTwoMothers',
  179: 'solomonTemple',
  180: 'elijahWidow',
  125: 'davidAbigail',
  44: 'psalm23'
};

const VALID_KEYS = new Set(loadStoryIndex().map((r) => r.key));

function main() {
  const loops = JSON.parse(fs.readFileSync(LOOPS_PATH, 'utf8'));
  if (!Array.isArray(loops)) throw new Error('loops.json must be an array');
  const rows = loadStoryIndex();
  if (rows.length !== 298) {
    console.warn('warn: expected 298 index rows, got', rows.length);
  }

  let filled = 0;
  const out = loops.map((item) => {
    const id = Number(item.id);
    let lib = LIBRARY_KEY_BY_LOOP_ID[id] || '';
    if (lib && !VALID_KEYS.has(lib)) {
      console.warn('warn: override id', id, 'has unknown key', lib);
      lib = '';
    }
    if (!lib) lib = bestLibraryKey(item, rows);
    if (lib && !VALID_KEYS.has(lib)) {
      console.warn('warn: scored key missing from index', lib, 'loop', id);
      lib = '';
    }
    if (lib) filled++;
    const next = { ...item };
    if (lib) next.libraryKey = lib;
    else delete next.libraryKey;
    return next;
  });

  fs.writeFileSync(LOOPS_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log('annotate-loops-library-keys: wrote', LOOPS_PATH, '—', filled, '/', out.length, 'with libraryKey');
}

main();
