#!/usr/bin/env node
/**
 * Search torture test — validates that script.js has all fallback logic needed
 * to never leave users empty-handed. Runs static checks (no browser required).
 *
 * Run: npm run test:search-torture
 */

import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const scriptPath = path.join(__dirname, '..', 'script.js');
const script = fs.readFileSync(scriptPath, 'utf8');

const CHECKS = [
  { name: 'parseReference space format (john 3 16)', pattern: /Space format.*john 3 16/ },
  { name: 'Loose-match fallback (any word 3+ chars)', pattern: /looseTokens|looseRegex/ },
  // Replaced legacy five-topic array with DEFAULT_VERSES (curated breakdown verses)
  { name: 'No-match fallback (DEFAULT_VERSES)', pattern: /var DEFAULT_VERSES = \[/ },
  { name: 'John 3:16 absolute last resort', pattern: /bible\[.John 3:16.\]/ },
  { name: 'Bundled fallback for offline', pattern: /BUNDLED_DAILY_VERSE_FALLBACKS/ },
  { name: 'Render-time emergency verses', pattern: /emergencyRefs|Philippians 4:6.*Isaiah 41:10/ },
  { name: 'getBibleVerseText fallback in reference intent', pattern: /getBibleVerseText\(key\)/ },
  { name: 'HEARTFELT_INQUIRY_MESSAGES for custom messages', pattern: /HEARTFELT_INQUIRY_MESSAGES|getHeartfeltMessageForQuery/ },
  { name: 'Difficult person / coworker phrase mappings', pattern: /piece of shit|toxic coworker|difficult person/ },
  { name: 'QUERY_TO_TOPIC for coworker, enemy', pattern: /coworker: .patience/ },
  { name: 'Fallback message (God\'s Word is for you)', pattern: /speak to what.*carrying|God.s Word is for you/ },
  { name: 'STOP_WORDS filter in loose match', pattern: /STOP_WORDS\.has\(t\.toLowerCase\(\)\)/ },
];

let passed = 0;
let failed = 0;

console.log('Search Torture Test (static validation)');
console.log('Validating script.js has all fallback logic\n');

for (const { name, pattern } of CHECKS) {
  const ok = pattern.test(script);
  if (ok) {
    console.log('PASS', name);
    passed++;
  } else {
    console.log('FAIL', name);
    failed++;
  }
}

console.log('\n---');
console.log('Passed:', passed, '/', CHECKS.length);
console.log('Failed:', failed);

if (failed > 0) {
  console.log('\nMissing patterns may cause "Nothing found" for edge-case queries.');
  process.exit(1);
}

console.log('\nAll fallback layers present. Search should never leave users empty-handed.');
