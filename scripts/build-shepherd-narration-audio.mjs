#!/usr/bin/env node
/**
 * Build calm male-voice Shepherd narration clips for key kids stories (macOS `say` + AAC).
 * Run from repo root: node scripts/build-shepherd-narration-audio.mjs
 * Optional: SHEPHERD_TTS_VOICE="Daniel" (default) — list with `say -v '?'`
 * Output: kids/audio/shepherd/{key}.m4a
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const jsonPath = path.join(root, 'kids', 'data', 'shepherd-narration-tts.json');
const outDir = path.join(root, 'kids', 'audio', 'shepherd');

if (process.platform !== 'darwin') {
  console.warn('build-shepherd-narration-audio: macOS only (uses `say`). Skipping.');
  process.exit(0);
}

if (!fs.existsSync(jsonPath)) {
  console.error('Missing', jsonPath);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const stories = raw.stories || {};
const voice = process.env.SHEPHERD_TTS_VOICE || 'Daniel';

fs.mkdirSync(outDir, { recursive: true });

const tmpBase = path.join(outDir, '.build-tmp');
fs.mkdirSync(tmpBase, { recursive: true });

let ok = 0;
for (const key of Object.keys(stories)) {
  const text = String(stories[key] || '').trim();
  if (!text) continue;
  const txtFile = path.join(tmpBase, key + '.txt');
  const aiffFile = path.join(tmpBase, key + '.aiff');
  const m4aFile = path.join(outDir, key + '.m4a');
  fs.writeFileSync(txtFile, text, 'utf8');
  try {
    execFileSync('say', ['-v', voice, '-f', txtFile, '-o', aiffFile], { stdio: 'inherit' });
    /* Four-char code is 'aac ' (trailing space), not the literal token 'aac' */
    execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac ', aiffFile, m4aFile], { stdio: 'inherit' });
    try {
      fs.unlinkSync(aiffFile);
    } catch (_) {}
    const st = fs.statSync(m4aFile);
    console.log('OK', key, Math.round(st.size / 1024) + ' KB');
    ok += 1;
  } catch (e) {
    console.error('FAIL', key, e && e.message);
  }
}

console.log('Shepherd narration clips built:', ok, '→', outDir);
