#!/usr/bin/env node
/**
 * Encode audio/mobius-breathe-human-temp.wav → audio/mobius-breathe-human.mp3
 * (mono, ~128 kbps). Requires devDependency ffmpeg-static.
 *
 * Full pipeline (macOS): see scripts/build-mobius-breathe-human-audio.mjs
 */
import { execFileSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const wav = path.join(root, 'audio', 'mobius-breathe-human-temp.wav');
const out = path.join(root, 'audio', 'mobius-breathe-human.mp3');

if (!ffmpeg) {
  console.error('ffmpeg-static: no binary for this platform');
  process.exit(1);
}
if (!fs.existsSync(wav)) {
  console.error('Missing', wav, '— run scripts/build-mobius-breathe-human-audio.mjs on macOS first.');
  process.exit(1);
}

execFileSync(
  ffmpeg,
  ['-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '128k', '-ac', '1', out],
  { stdio: 'inherit' }
);
console.log('Wrote', out);
