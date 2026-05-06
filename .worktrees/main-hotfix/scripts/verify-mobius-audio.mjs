#!/usr/bin/env node
/**
 * Verify Möbius replacement MP3s exist and are in expected duration ranges.
 * Uses ffmpeg-static (no system ffmpeg required).
 *
 * npm run verify:mobius-audio
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const BREATHE = path.join(root, 'audio', 'mobius-breathe-human.mp3');
const GUIDED = path.join(root, 'audio', 'mobius-guided-human.mp3');

/** @returns {{ sec: number, stderr: string } | null} */
function probe(filePath) {
  if (!ffmpeg || !fs.existsSync(filePath)) return null;
  const r = spawnSync(ffmpeg, ['-hide_banner', '-i', filePath], { encoding: 'utf8' });
  const stderr = r.stderr || '';
  const m = /Duration:\s*(\d{2}):(\d{2}):(\d{2}\.\d+)/.exec(stderr);
  if (!m) return null;
  const sec = Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
  return { sec, stderr };
}

function channelNote(stderr) {
  if (/Hz,\s*mono/i.test(stderr) || /1 channels/i.test(stderr) || /Audio:.*mp3.*mono/i.test(stderr))
    return 'mono';
  if (/stereo/i.test(stderr)) return 'stereo';
  return 'unknown';
}

let failed = false;

if (!ffmpeg) {
  console.error('verify-mobius-audio: ffmpeg-static has no binary for this platform.');
  process.exit(1);
}

for (const [label, p] of [
  ['mobius-breathe-human.mp3', BREATHE],
  ['mobius-guided-human.mp3', GUIDED]
]) {
  if (!fs.existsSync(p)) {
    console.error('Missing:', p);
    failed = true;
    continue;
  }
  const info = probe(p);
  if (!info) {
    console.error('Could not read duration:', p);
    failed = true;
    continue;
  }
  const { sec, stderr } = info;
  const ch = channelNote(stderr);
  let rangeOk = true;
  if (label.startsWith('mobius-breathe')) {
    if (sec < 40 || sec > 150) rangeOk = false;
  } else {
    if (sec < 570 || sec > 630) rangeOk = false;
  }
  if (!rangeOk) failed = true;
  const status = rangeOk ? 'OK' : 'FAIL';
  const chHint = ch !== 'mono' ? '(spec prefers mono — docs/MOBIUS-STUDIO-AUDIO-SPEC.md)' : '';
  console.log(
    status,
    label,
    'duration',
    sec.toFixed(1) + 's',
    ch,
    !rangeOk ? '(duration out of spec)' : '',
    chHint
  );
}

if (failed) {
  console.error('\nverify-mobius-audio: fix files or update docs if intentional.');
  process.exit(1);
}
console.log('verify-mobius-audio: all checks passed.');
