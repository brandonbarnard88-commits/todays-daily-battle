#!/usr/bin/env node
/**
 * macOS only: synthesize calm-path breathing guide from scripts/mobius-breathe-human-say-input.txt
 * using `say`, convert to WAV + MP3. Commits should include audio/mobius-breathe-human.mp3.
 *
 * Speech synthesis may require running outside a restricted sandbox (Cursor agent: "all" permissions).
 *
 * Usage: node scripts/build-mobius-breathe-human-audio.mjs
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const scriptTxt = path.join(root, 'scripts', 'mobius-breathe-human-say-input.txt');
const aiff = path.join(root, 'audio', 'mobius-breathe-human-temp.aiff');
const wav = path.join(root, 'audio', 'mobius-breathe-human-temp.wav');

if (process.platform !== 'darwin') {
  console.error('This generator is macOS-only (uses `say` + afconvert). Use existing audio/mobius-breathe-human.mp3 or encode WAV on another machine.');
  process.exit(1);
}
if (!fs.existsSync(scriptTxt)) {
  console.error('Missing', scriptTxt);
  process.exit(1);
}

execFileSync(
  'say',
  ['-v', 'Samantha', '-r', '118', '-f', scriptTxt, '-o', aiff],
  { stdio: 'inherit' }
);
execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16', aiff, wav], { stdio: 'inherit' });

// Dynamic import so Linux can still run encode-only script without loading ffmpeg
const { default: ffmpegBin } = await import('ffmpeg-static');
if (!ffmpegBin) {
  console.error('ffmpeg-static: no binary');
  process.exit(1);
}
const mp3 = path.join(root, 'audio', 'mobius-breathe-human.mp3');
execFileSync(
  ffmpegBin,
  ['-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '128k', '-ac', '1', mp3],
  { stdio: 'inherit' }
);

fs.unlinkSync(aiff);
fs.unlinkSync(wav);
console.log('OK —', mp3);
console.log('Note: voice is macOS Samantha (system TTS). Replace with a human studio read when ready; same filename.');
