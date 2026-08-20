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
    name: 'Reina-Valera 1909',
    short: 'RV1909',
    license: 'Public domain',
    source: 'https://ebible.org/Scriptures/details.php?id=spaRV1909'
  },
  fr: {
    lang: 'fr',
    file: 'fr-lsg1910.json',
    id: 'fra_lsg',
    name: 'Louis Segond 1910',
    short: 'LSG1910',
    license: 'Public domain',
    source: 'https://bible.helloao.org/api/fra_lsg/complete.simple.json'
  },
  pt: {
    lang: 'pt',
    file: 'pt-almeida1911.json',
    id: 'almeida',
    name: 'Almeida 1911',
    short: 'Almeida',
    license: 'Public domain (1911 reprint of Almeida)',
    source: 'https://api.getbible.net/v2/almeida.json'
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

export function localeTextForRef(root, lang, ref) {
  const bible = loadLocaleBible(root, lang);
  if (!bible) return '';
  const n = normalizeHeroRef(ref);
  return (
    bible[n] ||
    bible[n.replace(/^Psalm /i, 'Psalms ')] ||
    bible[n.replace(/^Psalms /i, 'Psalm ')] ||
    ''
  );
}
