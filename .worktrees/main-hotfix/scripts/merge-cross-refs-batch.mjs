/**
 * Appends curated per-verse cross-references into repo cross-refs.json (merges arrays, dedupes).
 * Run: node scripts/merge-cross-refs-batch.mjs
 * Note: npm run build does not run this; cross-refs.json in repo is the shipped source (see also scripts/build-cross-refs.mjs for an older generator).
 */
import fs from 'fs';

const path = new URL('../cross-refs.json', import.meta.url);
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
if (!j.refs || typeof j.refs !== 'object') throw new Error('cross-refs.json: missing refs');

const ADD = {
  'Exodus 20:12': ['Deuteronomy 5:16', 'Ephesians 6:1', 'Ephesians 6:2', 'Colossians 3:20'],
  'Deuteronomy 6:4': ['Deuteronomy 6:5', 'Mark 12:29', 'Mark 12:30', 'Matthew 22:37'],
  'Psalm 119:9': ['Psalm 119:11', 'Psalm 119:105', '2 Timothy 3:15', 'James 1:22'],
  'Psalm 119:11': ['Psalm 119:9', 'Psalm 1:2', 'Joshua 1:8'],
  'Micah 6:8': ['Micah 6:6', 'Hosea 6:6', 'Matthew 23:23'],
  'Zephaniah 3:17': ['Isaiah 62:5', 'Deuteronomy 30:9', 'Romans 15:13'],
  'Genesis 1:27': ['Genesis 1:26', 'Psalm 139:14', 'James 3:9'],
  '1 Samuel 16:7': ['1 Chronicles 28:9', 'Jeremiah 17:10', 'John 7:24'],
  'Proverbs 22:1': ['Proverbs 3:4', 'Ecclesiastes 7:1', 'Matthew 6:33'],
  'Matthew 18:20': ['Hebrews 10:25', 'Acts 2:42', 'Psalm 133:1'],
  'Colossians 3:15': ['Philippians 4:7', 'Romans 12:18', 'John 14:27'],
  'Luke 10:27': ['Deuteronomy 6:5', 'Leviticus 19:18', 'Galatians 5:14'],
  'Romans 8:26': ['Romans 8:34', 'Ephesians 6:18', 'Jude 1:20'],
  'Galatians 6:2': ['Romans 12:15', '1 Corinthians 12:26', 'Matthew 11:28'],
  '1 Corinthians 13:13': ['1 Corinthians 13:4', 'Colossians 3:14', '1 John 4:8'],
  'Numbers 6:24': ['Psalm 121:8', 'Philippians 4:7', '2 Thessalonians 3:16'],
  'Nehemiah 8:10': ['Philippians 4:4', 'Psalm 126:3', '1 Thessalonians 5:16'],
  'John 13:34': ['John 15:12', 'Romans 13:8', '1 John 4:11'],
  'James 1:25': ['James 1:22', 'Psalm 119:1', 'Luke 11:28'],
  'Matthew 7:24': ['Luke 6:47', 'James 1:22', 'Psalm 1:2'],
  'Psalm 100:4': ['Psalm 95:2', 'Philippians 4:6', 'Colossians 3:17'],
  'Psalm 118:24': ['Psalm 118:1', 'Philippians 4:4', '1 Thessalonians 5:16'],
  'Acts 16:31': ['Romans 10:9', 'Romans 10:10', 'John 3:16'],
  'Romans 12:10': ['Philippians 2:3', '1 Peter 4:8', 'John 13:34'],
  'Ephesians 4:29': ['Colossians 4:6', 'James 3:10', 'Proverbs 15:1'],
};

function mergeArr(existing, add) {
  const seen = new Set();
  const out = [];
  for (const x of [...(existing || []), ...add]) {
    const k = String(x).trim();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}

let keys = 0;
for (const [ref, list] of Object.entries(ADD)) {
  j.refs[ref] = mergeArr(j.refs[ref], list);
  keys++;
}

fs.writeFileSync(path, JSON.stringify(j) + '\n');
console.log('merge-cross-refs-batch: merged', keys, 'anchor keys');
