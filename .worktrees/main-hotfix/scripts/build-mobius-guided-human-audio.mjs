#!/usr/bin/env node
/**
 * macOS: build audio/mobius-guided-human.mp3 (~10 min) for Möbius Deep Walk alternate track.
 * Uses scripts/mobius-guided-human-say-input.txt + `say`, pads trailing silence to ~600s for the UI timer.
 *
 * npm run audio:mobius-guided
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const scriptTxt = path.join(root, 'scripts', 'mobius-guided-human-say-input.txt');
const aiff = path.join(root, 'audio', 'mobius-guided-human-temp.aiff');
const wav = path.join(root, 'audio', 'mobius-guided-human-temp.wav');
const mp3 = path.join(root, 'audio', 'mobius-guided-human.mp3');
const TARGET_SEC = 600;

function ffmpegDurationSec(filePath) {
  if (!ffmpeg) return null;
  const r = spawnSync(ffmpeg, ['-hide_banner', '-i', filePath], { encoding: 'utf8' });
  const stderr = r.stderr || '';
  const m = /Duration:\s*(\d{2}):(\d{2}):(\d{2}\.\d+)/.exec(stderr);
  if (!m) return null;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

if (process.platform !== 'darwin') {
  console.error('macOS-only: uses `say` and afconvert.');
  process.exit(1);
}
if (!ffmpeg) {
  console.error('ffmpeg-static: no binary');
  process.exit(1);
}
if (!fs.existsSync(scriptTxt)) {
  console.error('Missing', scriptTxt);
  process.exit(1);
}

execFileSync('say', ['-v', 'Samantha', '-r', '112', '-f', scriptTxt, '-o', aiff], { stdio: 'inherit' });
execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16', aiff, wav], { stdio: 'inherit' });

const dur = ffmpegDurationSec(wav);
if (dur == null || dur <= 0) {
  console.error('Could not read WAV duration');
  process.exit(1);
}

const padSec = Math.max(0, TARGET_SEC - dur - 0.2);
console.log('Speech+pauses ~' + dur.toFixed(1) + 's; padding ' + padSec.toFixed(1) + 's to ~' + TARGET_SEC + 's');

let mergedWav = wav;
if (padSec > 0.25) {
  const silenceWav = path.join(root, 'audio', 'mobius-guided-pad-temp.wav');
  const merged = path.join(root, 'audio', 'mobius-guided-merged-temp.wav');
  execFileSync(
    ffmpeg,
    [
      '-y',
      '-f',
      'lavfi',
      '-i',
      'anullsrc=r=22050:cl=mono',
      '-t',
      String(padSec),
      '-acodec',
      'pcm_s16le',
      silenceWav
    ],
    { stdio: 'inherit' }
  );
  execFileSync(
    ffmpeg,
    [
      '-y',
      '-i',
      wav,
      '-i',
      silenceWav,
      '-filter_complex',
      '[0:a][1:a]concat=n=2:v=0:a=1[out]',
      '-map',
      '[out]',
      merged
    ],
    { stdio: 'inherit' }
  );
  fs.unlinkSync(silenceWav);
  fs.unlinkSync(wav);
  mergedWav = merged;
}

execFileSync(
  ffmpeg,
  ['-y', '-i', mergedWav, '-codec:a', 'libmp3lame', '-b:a', '96k', '-ac', '1', '-t', String(TARGET_SEC), mp3],
  { stdio: 'inherit' }
);

if (fs.existsSync(aiff)) fs.unlinkSync(aiff);
if (fs.existsSync(mergedWav)) fs.unlinkSync(mergedWav);

const finalD = ffmpegDurationSec(mp3);
console.log('OK —', mp3, finalD != null ? '(' + finalD.toFixed(1) + 's)' : '');
console.log('Note: system TTS; replace with a human studio read when ready (same filename).');
