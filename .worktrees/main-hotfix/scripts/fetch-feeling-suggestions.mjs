#!/usr/bin/env node
/**
 * Fetch feeling_suggestions for suggest-form review.
 * Run: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/fetch-feeling-suggestions.mjs [--days 30]
 *
 * Outputs anonymized top phrases for mapping into PHRASE_SEMANTIC_MAP, PHRASE_TO_TOKENS, etc.
 * See docs/SUGGEST-FORM-REVIEW.md.
 */

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const DAYS = process.argv.includes('--days') ? parseInt(process.argv[process.argv.indexOf('--days') + 1], 10) : null;

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (service_role required for SELECT).');
    process.exit(1);
  }

  let url = SUPABASE_URL + '/rest/v1/feeling_suggestions?select=phrase,created_at&order=created_at.desc&limit=50';
  if (DAYS && !isNaN(DAYS)) {
    const since = new Date();
    since.setDate(since.getDate() - DAYS);
    url += '&created_at=gte.' + encodeURIComponent(since.toISOString());
  }

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    console.error('Supabase error:', res.status, await res.text());
    process.exit(1);
  }

  const data = await res.json();

  if (!data || data.length === 0) {
    console.log('No submissions yet. Run again when you have entries in feeling_suggestions.');
    return;
  }

  // Group by normalized phrase (lowercase, trimmed), count
  const counts = {};
  for (const row of data) {
    const p = (row.phrase || '').trim().toLowerCase();
    if (p.length >= 2) counts[p] = (counts[p] || 0) + 1;
  }

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1]);

  console.log('--- Feeling suggestions (anonymized) ---');
  console.log('Total rows:', data.length);
  console.log('Unique phrases:', sorted.length);
  if (DAYS) console.log('Filter: last', DAYS, 'days');
  console.log('');

  console.log('By frequency:');
  sorted.slice(0, 20).forEach(([phrase, n], i) => {
    console.log('  ' + (i + 1) + '. "' + phrase + '" (' + n + ')');
  });

  console.log('');
  console.log('Top 8 for mapping (copy-paste):');
  const top8 = sorted.slice(0, 8).map(([p]) => "'" + p + "'").join(', ');
  console.log('  ' + top8);
}

main();
