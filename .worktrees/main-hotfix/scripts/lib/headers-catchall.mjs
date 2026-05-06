/**
 * Parse Cloudflare Pages / Netlify _headers catch-all block (/* …) into { key, value }[].
 * Authoritative edits belong in _headers at the repo root; vercel.json is derived.
 */
export function extractCatchAllSection(raw) {
  const m = raw.match(/\r?\n\/\*\r?\n/);
  if (!m) {
    throw new Error('_headers: missing catch-all block after newline (expected \\n/*\\n)');
  }
  return raw.slice(m.index + m[0].length);
}

export function parseCatchAllHeaders(raw) {
  const after = extractCatchAllSection(raw);
  const lines = after.split(/\r?\n/);
  const out = [];
  for (const line of lines) {
    if (line.trim() === '') continue;
    const hm = line.match(/^\s+([^:]+):\s*(.*)$/);
    if (!hm) break;
    out.push({ key: hm[1].trim(), value: hm[2].trim() });
  }
  if (!out.length) {
    throw new Error('_headers: catch-all /* block has no header lines');
  }
  return out;
}

export function headerPairsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
