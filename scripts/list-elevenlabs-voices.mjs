#!/usr/bin/env node
/**
 * One-off helper: list ElevenLabs voices whose names match a warm Southern US–style preset.
 * Run locally (never in CI without secrets):
 *   ELEVENLABS_API_KEY=... node scripts/list-elevenlabs-voices.mjs
 *
 * Copy a voice_id into Cloudflare Pages → ELEVENLABS_VOICE_ID (encrypted).
 * Does not run on npm run build — avoids network + key requirements in default pipeline.
 */

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error('Set ELEVENLABS_API_KEY in the environment.');
  process.exit(1);
}

const NEEDLES = [
  'southern',
  'gentleman',
  'plantation',
  'georgia',
  'alabama',
  'drawl',
  'distinguished',
  'baritone',
];

async function main() {
  const res = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': KEY },
  });
  if (!res.ok) {
    console.error('GET /v1/voices failed:', res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  const voices = Array.isArray(data.voices) ? data.voices : [];
  const hits = voices.filter((v) => {
    const name = String(v.name || '').toLowerCase();
    const desc = String(v.description || '').toLowerCase();
    const hay = name + ' ' + desc;
    return NEEDLES.some((n) => hay.includes(n));
  });

  console.log('Total voices:', voices.length);
  console.log('Matches (name/description):', hits.length);
  for (const v of hits) {
    console.log('-', v.name);
    console.log('  voice_id:', v.voice_id);
    if (v.description) console.log('  ', String(v.description).slice(0, 120));
  }
  if (!hits.length) {
    console.log('No keyword matches — open the ElevenLabs UI and pick by ear, then set ELEVENLABS_VOICE_ID.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
