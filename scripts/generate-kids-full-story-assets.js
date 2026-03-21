#!/usr/bin/env node
/**
 * Regenerates kids/kids-full-story-assets.js from unique top-level keys in kids/kids-battle.js.
 * Run from repo root: node scripts/generate-kids-full-story-assets.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const battlePath = path.join(root, 'kids/kids-battle.js');
const outPath = path.join(root, 'kids/kids-full-story-assets.js');

const s = fs.readFileSync(battlePath, 'utf8');
const re = /\n    ([a-zA-Z][a-zA-Z0-9_]*): \{\n      title:/g;
const seen = new Map();
let m;
while ((m = re.exec(s))) {
  if (!seen.has(m[1])) seen.set(m[1], true);
}
const keys = [...seen.keys()].sort();

function keyToKebab(k) {
  return k.replace(/([A-Z])/g, (_, c) => '-' + c.toLowerCase());
}

const lines = [];
lines.push('/**');
lines.push(' * Full-length Bible story videos + WebVTT read-along.');
lines.push(' * AUTO-GENERATED: keys match TDB_BIBLE_STORIES in kids-battle.js (' + keys.length + ' stories).');
lines.push(' * Regenerate: node scripts/generate-kids-full-story-assets.js');
lines.push(' * Paths use kebab-case story keys under /media/kids-stories/');
lines.push(' * Playback is gated: add a key to FULL_STORY_LIVE_KEYS when mp4+vtt are deployed.');
lines.push(' */');
lines.push('(function (global) {');
lines.push("  'use strict';");
lines.push('');
lines.push('  /**');
lines.push('   * When a story key is listed here, the modal uses <video> + <track> for that story.');
lines.push('   * Add keys gradually as you ship each full animation + captions.');
lines.push('   * To enable all at once (after full rollout), replace with: new Set(Object.keys(FULL_STORY_MEDIA))');
lines.push('   */');
lines.push('  var FULL_STORY_LIVE_KEYS = new Set([');
lines.push('    /* e.g. \'david\', \'noah\' */');
lines.push('  ]);');
lines.push('');
lines.push('  /** @type {Object.<string, Object>} */');
lines.push('  var FULL_STORY_MEDIA = {');

for (const key of keys) {
  const slug = keyToKebab(key);
  lines.push('    ' + key + ': {');
  lines.push("      mp4: '/media/kids-stories/" + slug + ".mp4',");
  lines.push("      webm: '/media/kids-stories/" + slug + ".webm',");
  lines.push("      captionsVtt: '/media/kids-stories/" + slug + ".vtt'");
  lines.push('    },');
}
lines.push('  };');
lines.push('');
lines.push('  global.TDB_KIDS_FULL_STORY_MEDIA = FULL_STORY_MEDIA;');
lines.push('  global.TDB_KIDS_FULL_STORY_LIVE_KEYS = FULL_STORY_LIVE_KEYS;');
lines.push('');
lines.push('  global.getKidsFullStoryMedia = function (storyKey) {');
lines.push("    var k = String(storyKey || '').trim();");
lines.push('    if (!k || !FULL_STORY_MEDIA[k]) return null;');
lines.push('    if (!FULL_STORY_LIVE_KEYS.has(k)) return null;');
lines.push('    var o = FULL_STORY_MEDIA[k];');
lines.push('    if (!o || typeof o !== \'object\') return null;');
lines.push('    if (!o.mp4 && !o.webm) return null;');
lines.push('    return o;');
lines.push('  };');
lines.push("})(typeof window !== 'undefined' ? window : this);");
lines.push('');

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('Wrote', path.relative(root, outPath), 'with', keys.length, 'story keys.');
