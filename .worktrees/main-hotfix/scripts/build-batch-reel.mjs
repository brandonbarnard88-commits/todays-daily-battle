#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';

const root = process.cwd();
const cfgPath = path.join(root, 'reel-batch-config.json');

function fail(msg) {
  console.error('[batch-reel] ERROR:', msg);
  process.exit(1);
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit' });
  if (res.status !== 0) fail(`${cmd} failed with exit ${res.status}`);
}

function parseProfileArg(argv) {
  const direct = argv.find((a) => /^--profile=/.test(a));
  if (direct) return direct.split('=')[1] || '';
  const idx = argv.indexOf('--profile');
  if (idx >= 0) return String(argv[idx + 1] || '').trim();
  return '';
}

function mergeConfig(base, override) {
  const out = { ...(base || {}) };
  if (!override || typeof override !== 'object') return out;
  Object.keys(override).forEach((k) => {
    if (k === 'profiles') return;
    const bv = out[k];
    const ov = override[k];
    if (bv && ov && typeof bv === 'object' && typeof ov === 'object' && !Array.isArray(bv) && !Array.isArray(ov)) {
      out[k] = { ...bv, ...ov };
    } else {
      out[k] = ov;
    }
  });
  return out;
}

if (!fs.existsSync(cfgPath)) fail('Missing reel-batch-config.json');
const rawCfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const profileName = parseProfileArg(process.argv.slice(2));
const profileCfg = profileName ? ((rawCfg.profiles && rawCfg.profiles[profileName]) || null) : null;
if (profileName && !profileCfg) fail(`Profile not found in reel-batch-config.json: ${profileName}`);
const cfg = mergeConfig(rawCfg, profileCfg);

const inputDir = path.join(root, String(cfg.input_dir || 'media/kids-battle/clips'));
const musicPath = path.join(root, String(cfg.music_path || ''));
const outputPath = path.join(root, String(cfg.output_path || 'media/kids-battle/reels/kids-battle-batch-reel.mp4'));
const suffixes = Array.isArray(cfg.input_glob_suffixes) ? cfg.input_glob_suffixes.map((s) => String(s).toLowerCase()) : ['.mp4'];
const clipDuration = Math.max(1, Number(cfg.clip_duration_s || 5));
const crossfadeSec = Math.max(0, Number(cfg.crossfade_s || 0));
const targetReel = Math.max(clipDuration, Number(cfg.target_reel_duration_s || 180));
const maxClipsCfg = Math.max(1, Number(cfg.max_clips || 36));
const fps = Math.max(24, Number(cfg.fps || 30));
const resolution = String(cfg.resolution || '1080x1920');
const addDust = cfg.add_dust_overlay !== false;
const zoomIncrement = Number(cfg.zoom_increment || 0.0009);
const maxZoom = Number(cfg.max_zoom || 1.08);
const panStep = Number(cfg.pan_step || 8);
const eqBrightness = Number((cfg.eq && cfg.eq.brightness) != null ? cfg.eq.brightness : 0.02);
const eqSaturation = Number((cfg.eq && cfg.eq.saturation) != null ? cfg.eq.saturation : 1.08);
const eqContrast = Number((cfg.eq && cfg.eq.contrast) != null ? cfg.eq.contrast : 1.03);
const musicVolume = Number(cfg.music_volume || 0.16);
const dustAlpha = Number(cfg.dust_alpha || 0.035);

if (!fs.existsSync(inputDir)) fail(`Input directory not found: ${inputDir}`);
if (!fs.existsSync(musicPath)) fail(`Music bed not found: ${musicPath}`);

const clips = fs
  .readdirSync(inputDir)
  .filter((f) => suffixes.includes(path.extname(f).toLowerCase()))
  .sort((a, b) => a.localeCompare(b));

if (!clips.length) fail(`No clips found in ${inputDir}`);

function clipsNeededForTarget(totalTarget, perClip, crossfade) {
  if (crossfade <= 0 || perClip <= crossfade) return Math.ceil(totalTarget / perClip);
  let count = 1;
  let duration = perClip;
  while (duration < totalTarget) {
    count += 1;
    duration += (perClip - crossfade);
    if (count > 10000) break;
  }
  return count;
}

const effectiveCrossfade = crossfadeSec > 0 ? Math.min(crossfadeSec, Math.max(0, clipDuration - 0.1)) : 0;
const neededByDuration = clipsNeededForTarget(targetReel, clipDuration, effectiveCrossfade);
const useCount = Math.min(clips.length, maxClipsCfg, neededByDuration);
const selected = clips.slice(0, useCount);

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tdb-batch-reel-'));
const processedDir = path.join(tmpDir, 'processed');
fs.mkdirSync(processedDir, { recursive: true });

const [w, h] = resolution.split('x').map((n) => Number(n));
if (!w || !h) fail(`Invalid resolution: ${resolution}`);

console.log(`[batch-reel] Preparing ${selected.length} clips at ${clipDuration}s each...`);
if (profileName) console.log(`[batch-reel] Profile: ${profileName}`);

selected.forEach((clip, idx) => {
  const inPath = path.join(inputDir, clip);
  const outPath = path.join(processedDir, `${String(idx + 1).padStart(3, '0')}.mp4`);

  // Alternate subtle pan direction for life-like movement across swipe cards.
  const panDir = idx % 2 === 0
    ? `iw/2-(iw/zoom/2)-((on/150)*${panStep})`
    : `iw/2-(iw/zoom/2)+((on/150)*${panStep})`;
  const base = [
    `scale=${w}:${h}:force_original_aspect_ratio=increase`,
    `crop=${w}:${h}`,
    `zoompan=z='min(zoom+${zoomIncrement},${maxZoom})':x='${panDir}':y='ih/2-(ih/zoom/2)':d=${clipDuration * fps}:s=${w}x${h}:fps=${fps}`,
    `eq=brightness=${eqBrightness}:saturation=${eqSaturation}:contrast=${eqContrast}`
  ];
  const dustOverlay = '[dust]';
  const filterComplex = addDust
    ? `[0:v]${base.join(',')}[base];color=c=white@0.0:s=${w}x${h}:d=${clipDuration},noise=alls=8:allf=t+u,format=rgba,colorchannelmixer=aa=${dustAlpha}${dustOverlay};[base]${dustOverlay}overlay=shortest=1,format=yuv420p[v]`
    : `[0:v]${base.join(',')},format=yuv420p[v]`;

  run('ffmpeg', [
    '-y',
    '-i',
    inPath,
    '-t',
    String(clipDuration),
    '-filter_complex',
    filterComplex,
    '-map',
    '[v]',
    '-an',
    '-r',
    String(fps),
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    outPath
  ]);
});

const listPath = path.join(tmpDir, 'concat.txt');
const stitchedPath = path.join(tmpDir, 'stitched.mp4');
if (effectiveCrossfade > 0 && selected.length > 1) {
  console.log('[batch-reel] Stitching clips with crossfade:', effectiveCrossfade + 's');
  const args = ['-y'];
  selected.forEach((_, i) => {
    args.push('-i', path.join(processedDir, `${String(i + 1).padStart(3, '0')}.mp4`));
  });
  const filters = [];
  for (let i = 0; i < selected.length; i += 1) {
    filters.push(`[${i}:v]settb=AVTB[v${i}]`);
  }
  let prev = 'v0';
  for (let i = 1; i < selected.length; i += 1) {
    const out = `x${i}`;
    const offset = ((clipDuration - effectiveCrossfade) * i).toFixed(3);
    filters.push(`[${prev}][v${i}]xfade=transition=fade:duration=${effectiveCrossfade}:offset=${offset}[${out}]`);
    prev = out;
  }
  args.push(
    '-filter_complex',
    filters.join(';'),
    '-map',
    `[${prev}]`,
    '-an',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    stitchedPath
  );
  run('ffmpeg', args);
} else {
  console.log('[batch-reel] Stitching clips (no crossfade)...');
  const concatBody = selected
    .map((_, i) => `file '${path.join(processedDir, `${String(i + 1).padStart(3, '0')}.mp4`).replace(/'/g, "'\\''")}'`)
    .join('\n');
  fs.writeFileSync(listPath, concatBody + '\n', 'utf8');
  run('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', stitchedPath]);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

console.log('[batch-reel] Adding quiet music bed...');
run('ffmpeg', [
  '-y',
  '-i',
  stitchedPath,
  '-stream_loop',
  '-1',
  '-i',
  musicPath,
  '-filter_complex',
  '[1:a]volume=' + musicVolume + ',atrim=duration=' + targetReel + ',afade=t=out:st=' + Math.max(1, targetReel - 2) + ':d=2[m];[m]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[a]',
  '-map',
  '0:v:0',
  '-map',
  '[a]',
  '-t',
  String(targetReel),
  '-r',
  String(fps),
  '-c:v',
  'libx264',
  '-pix_fmt',
  'yuv420p',
  '-c:a',
  'aac',
  '-b:a',
  '192k',
  outputPath
]);

console.log('[batch-reel] Done:', outputPath);
console.log('[batch-reel] Source clips used:', selected.length);
console.log('[batch-reel] Temp folder:', tmpDir);
