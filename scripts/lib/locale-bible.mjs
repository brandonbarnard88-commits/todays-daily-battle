/**
 * Public-domain locale Bibles, keyed like data/kjv-full.json
 * ("Psalms 98:1", "Hebrews 12:2"). Lookup accepts Psalm/Psalms.
 */
import fs from 'fs';
import path from 'path';
import { normalizeHeroRef } from './hero-layman-plain.mjs';

export const LOCALE_BIBLES = {
  es: {
    lang: 'es',
    file: 'es-rv1909.json',
    id: 'spa_r09',
    kind: 'helloao',
    name: 'Reina-Valera 1909',
    short: 'RV1909',
    license: 'Public domain',
    source: 'https://ebible.org/Scriptures/details.php?id=spaRV1909'
  },
  fr: {
    lang: 'fr',
    file: 'fr-lsg1910.json',
    id: 'fra_lsg',
    kind: 'helloao',
    name: 'Louis Segond 1910',
    short: 'LSG1910',
    license: 'Public domain',
    source: 'https://bible.helloao.org/api/fra_lsg/complete.simple.json'
  },
  pt: {
    lang: 'pt',
    file: 'pt-almeida1911.json',
    id: 'almeida',
    kind: 'getbible',
    name: 'Almeida 1911',
    short: 'Almeida',
    license: 'Public domain (1911 reprint of Almeida)',
    source: 'https://api.getbible.net/v2/almeida.json'
  },
  zh: {
    lang: 'zh',
    file: 'zh-cuv.json',
    id: 'cmn_cu1',
    kind: 'helloao',
    htmlLang: 'zh-CN',
    name: '和合本 1919',
    short: 'CUV',
    license: 'Public domain',
    source: 'https://ebible.org/Scriptures/details.php?id=cmn-cu89s'
  },
  ru: {
    lang: 'ru',
    file: 'ru-synodal.json',
    id: 'rus_syn',
    kind: 'helloao',
    name: 'Синодальный перевод',
    short: 'Synodal',
    license: 'Public domain',
    source: 'https://ebible.org/Scriptures/details.php?id=russyn'
  },
  hi: {
    lang: 'hi',
    file: 'hi-irv.json',
    id: 'HINIRV',
    kind: 'helloao',
    name: 'हिन्दी IRV 2019',
    short: 'IRV',
    license: 'CC BY-SA 4.0 (Bridge Connectivity Solutions)',
    source: 'https://ebible.org/Scriptures/details.php?id=hin2017'
  }
};

const cache = new Map();

export function localeBibleDir(root) {
  return path.join(root, 'data', 'bibles');
}

export function loadLocaleBible(root, lang) {
  if (cache.has(lang)) return cache.get(lang);
  const spec = LOCALE_BIBLES[lang];
  if (!spec) return null;
  const p = path.join(localeBibleDir(root), spec.file);
  if (!fs.existsSync(p)) return null;
  const map = JSON.parse(fs.readFileSync(p, 'utf8'));
  cache.set(lang, map);
  return map;
}

/** LXX / Synodal psalm chapter+verse for a KJV psalm reference. */
function synodalPsalmKeys(chapter, verse) {
  const c = Number(chapter);
  const v = Number(verse);
  const key = (ch, vs) => 'Psalms ' + ch + ':' + vs;
  if (c >= 1 && c <= 8) return [key(c, v)];
  if (c === 9) return [key(9, v)];
  if (c === 10) return [key(9, v + 20)];
  if (c >= 11 && c <= 113) return [key(c - 1, v)];
  if (c === 114) return [key(113, v)];
  if (c === 115) return [key(113, v + 8)];
  if (c === 116) return v <= 9 ? [key(114, v)] : [key(115, v - 9)];
  if (c >= 117 && c <= 146) return [key(c - 1, v)];
  if (c === 147) return v <= 11 ? [key(146, v)] : [key(147, v - 11)];
  if (c >= 148 && c <= 150) return [key(c, v)];
  return [key(c, v)];
}

export function localeTextForRef(root, lang, ref) {
  const bible = loadLocaleBible(root, lang);
  if (!bible) return '';
  const n = normalizeHeroRef(ref);
  const keys = [
    n,
    n.replace(/^Psalm /i, 'Psalms '),
    n.replace(/^Psalms /i, 'Psalm ')
  ];
  if (lang === 'ru') {
    const m = n.match(/^Psalms?\s+(\d+):(\d+)$/i);
    if (m) keys.unshift(...synodalPsalmKeys(m[1], m[2]));
  }
  for (const k of keys) {
    if (bible[k]) {
      return String(bible[k])
        .replace(/\s*\([^)]*\d+[:.][^)]*\)\s*$/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }
  return '';
}
