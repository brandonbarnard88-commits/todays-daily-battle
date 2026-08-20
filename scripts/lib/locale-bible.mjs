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
    licenseUrl: 'https://en.wikipedia.org/wiki/Public_domain',
    source: 'https://ebible.org/Scriptures/details.php?id=spaRV1909',
    via: 'eBible.org and the HelloAO Free Use Bible API',
    holder: 'Public domain (Reina-Valera 1909 edition)',
    onPageCredit:
      'Reina-Valera 1909. Public domain. Text via eBible.org and HelloAO. Flattened to a verse map for lookup; leading “Salmo.” headings stripped.'
  },
  fr: {
    lang: 'fr',
    file: 'fr-lsg1910.json',
    id: 'fra_lsg',
    kind: 'helloao',
    name: 'Louis Segond 1910',
    short: 'LSG1910',
    license: 'Public domain',
    licenseUrl: 'https://en.wikipedia.org/wiki/Public_domain',
    source: 'https://ebible.org/Scriptures/details.php?id=fraLSG',
    via: 'eBible.org and the HelloAO Free Use Bible API',
    holder: 'Public domain (Louis Segond 1910)',
    onPageCredit:
      'Louis Segond 1910. Public domain. Text via eBible.org and HelloAO. Flattened to a verse map for lookup; leading “Psaume.” headings stripped.'
  },
  pt: {
    lang: 'pt',
    file: 'pt-almeida1911.json',
    id: 'almeida',
    kind: 'getbible',
    name: 'Almeida 1911',
    short: 'Almeida',
    license: 'Public domain (1911 reprint of Almeida)',
    licenseUrl: 'https://en.wikipedia.org/wiki/Public_domain',
    source: 'https://api.getbible.net/v2/almeida.json',
    via: 'getBible.net (OSIS module of the 1911 reprint)',
    holder: 'Public domain — João Ferreira de Almeida tradition, 1911 reprint of a 1900 edition',
    onPageCredit:
      'Almeida 1911 (João Ferreira de Almeida tradition). Public domain text. Digital source: getBible.net. Flattened to a verse map for lookup.'
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
    licenseUrl: 'https://en.wikipedia.org/wiki/Public_domain',
    source: 'https://ebible.org/Scriptures/details.php?id=cmn-cu89s',
    via: 'eBible.org and the HelloAO Free Use Bible API',
    holder: 'Public domain (Chinese Union Version, 1919, simplified script)',
    onPageCredit:
      'Chinese Union Version 1919 (simplified). Public domain. Text via eBible.org and HelloAO. Flattened to a verse map for lookup.'
  },
  ru: {
    lang: 'ru',
    file: 'ru-synodal.json',
    id: 'rus_syn',
    kind: 'helloao',
    name: 'Синодальный перевод',
    short: 'Synodal',
    license: 'Public domain',
    licenseUrl: 'https://en.wikipedia.org/wiki/Public_domain',
    source: 'https://ebible.org/Scriptures/details.php?id=russyn',
    via: 'eBible.org and the HelloAO Free Use Bible API',
    holder: 'Public domain (Russian Synodal Bible, 1876)',
    onPageCredit:
      'Russian Synodal Bible (1876). Public domain. Text via eBible.org and HelloAO. Flattened to a verse map. Psalm numbers follow the Septuagint; we map them to the KJV calendar so today is the same verse.'
  },
  hi: {
    lang: 'hi',
    file: 'hi-irv.json',
    id: 'HINIRV',
    kind: 'helloao',
    name: 'हिन्दी IRV 2019',
    short: 'IRV',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://ebible.org/Scriptures/details.php?id=hin2017',
    via: 'eBible.org and the HelloAO Free Use Bible API',
    holder: 'Bridge Connectivity Solutions',
    years: '2017–2019',
    onPageCredit:
      'Hindi Indian Revised Version © 2017–2019 Bridge Connectivity Solutions. Used under CC BY-SA 4.0. Source: eBible.org. Flattened to a verse map for lookup; trailing study-note parentheses removed. This flattened file remains under CC BY-SA 4.0.'
  },
  ar: {
    lang: 'ar',
    file: 'ar-vandyck.json',
    id: 'arb_vdv',
    kind: 'helloao',
    htmlLang: 'ar',
    name: 'فان دايك 1865',
    short: 'Van Dyck',
    license: 'Public domain',
    licenseUrl: 'https://en.wikipedia.org/wiki/Public_domain',
    source: 'https://ebible.org/Scriptures/details.php?id=arb-vd',
    via: 'eBible.org and the HelloAO Free Use Bible API',
    holder: 'Public domain (Van Dyck Arabic Bible, 1865)',
    onPageCredit:
      'Van Dyck Arabic Bible (1865). Public domain. Text via eBible.org and HelloAO. Flattened to a verse map for lookup.'
  },
  sv: {
    lang: 'sv',
    file: 'sv-1917.json',
    id: 'swedish',
    kind: 'getbible',
    name: '1917 års bibel',
    short: 'SV1917',
    license: 'Public domain',
    licenseUrl: 'https://en.wikipedia.org/wiki/Public_domain',
    source: 'https://api.getbible.net/v2/swedish.json',
    via: 'getBible.net (Projekt Runeberg 1917 text)',
    holder: 'Public domain (Swedish Bible 1917)',
    onPageCredit:
      'Swedish Bible 1917 (allmän egendom). Digital source: getBible.net / Projekt Runeberg. Flattened to a verse map for lookup.'
  },
  tl: {
    lang: 'tl',
    file: 'tl-1905.json',
    id: 'tagalog',
    kind: 'getbible',
    name: 'Ang Dating Biblia 1905',
    short: 'ADB1905',
    license: 'Public domain',
    licenseUrl: 'https://en.wikipedia.org/wiki/Public_domain',
    source: 'https://api.getbible.net/v2/tagalog.json',
    via: 'getBible.net (Ang Dating Biblia 1905)',
    holder: 'Public domain (Ang Dating Biblia, 1905)',
    onPageCredit:
      'Ang Dating Biblia 1905. Public domain. Typed from the 1905 Tagalog Bible by Richard and Dolores Long. Digital source: getBible.net. Flattened to a verse map for lookup.'
  },
  sw: {
    lang: 'sw',
    file: 'sw-ulb.json',
    id: 'swh_ulb',
    kind: 'helloao',
    name: 'Biblia Takatifu (ULB)',
    short: 'ULB',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://ebible.org/Scriptures/details.php?id=swhulb',
    via: 'eBible.org and the HelloAO Free Use Bible API',
    holder: 'Door43 World Missions Community',
    years: '2019',
    onPageCredit:
      'Swahili Unlocked Literal Bible © 2019 Door43 World Missions Community. Used under CC BY-SA 4.0. Source: eBible.org. Flattened to a verse map for lookup. This flattened file remains under CC BY-SA 4.0.'
  },
  bn: {
    lang: 'bn',
    file: 'bn-irv.json',
    id: 'ben_irv',
    kind: 'helloao',
    name: 'বাংলা IRV 2019',
    short: 'IRV',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://ebible.org/Scriptures/details.php?id=benirv',
    via: 'eBible.org and the HelloAO Free Use Bible API',
    holder: 'Bridge Connectivity Solutions',
    years: '2018–2019',
    onPageCredit:
      'Bengali Indian Revised Version © 2018–2019 Bridge Connectivity Solutions. Used under CC BY-SA 4.0. Source: eBible.org. Flattened to a verse map for lookup. This flattened file remains under CC BY-SA 4.0.'
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
        .replace(/\d+:\d+\s+[^।]*।/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s+,/g, ',')
        .trim();
    }
  }
  return '';
}
