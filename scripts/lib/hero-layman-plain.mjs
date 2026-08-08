/**
 * Shared verse-grounded plain English for hero inject, breakdown overrides, and tests.
 * Priority: curated map → BBE (public domain) → modernized KJV → rare theme fallback.
 * Goal: every plain must still sound like THIS verse, not a recycled mood stamp.
 */
import fs from 'fs';
import path from 'path';

const ARCHAIC_TO_MODERN = {
  thee: 'you',
  thou: 'you',
  thy: 'your',
  thine: 'yours',
  ye: 'you',
  hath: 'has',
  hast: 'have',
  doth: 'does',
  dost: 'do',
  shalt: 'shall',
  wilt: 'will',
  art: 'are',
  unto: 'to',
  saith: 'says',
  saidst: 'said',
  spake: 'spoke',
  shew: 'show',
  shewed: 'showed',
  sheweth: 'shows',
  dwelleth: 'lives',
  dwell: 'live',
  abideth: 'stays',
  abide: 'stay',
  labour: 'work',
  laboureth: 'works',
  laden: 'burdened',
  believeth: 'believes',
  loveth: 'loves',
  giveth: 'gives',
  knoweth: 'knows',
  maketh: 'makes',
  keepeth: 'keeps',
  worketh: 'works',
  strengtheneth: 'strengthens',
  passeth: 'passes',
  cometh: 'comes',
  goeth: 'goes',
  seeth: 'sees',
  heareth: 'hears',
  doeth: 'does',
  whosoever: 'whoever',
  whatsoever: 'whatever',
  wherefore: 'so',
  therefore: 'so',
  verily: 'truly',
  behold: 'look',
  begotten: 'only',
  perish: 'be lost',
  everlasting: 'eternal',
  alway: 'always',
  always: 'always',
  nigh: 'near',
  afore: 'before',
  whence: 'from where',
  whither: 'where',
  whence: 'from where',
  yea: 'yes',
  nay: 'no',
  lest: 'so that you do not',
  thrice: 'three times',
  twain: 'two',
  forthwith: 'right away',
  straightway: 'right away',
  howbeit: 'however',
  peradventure: 'maybe',
  conversation: 'way of life',
  meat: 'food',
  corn: 'grain',
  charity: 'love',
  careful: 'worried',
  beseech: 'ask',
  supplication: 'prayer',
  brethren: 'brothers and sisters',
  neighbour: 'neighbor',
  favour: 'favor',
  honour: 'honor',
  saviour: 'Savior',
  stablish: 'establish',
  stablished: 'established',
  canst: 'can',
  mayest: 'may',
  shouldest: 'should',
  wouldest: 'would',
  didst: 'did',
  wast: 'were',
  wert: 'were'
};

/** Phrase-level KJV modernizations (applied before word map). */
const PHRASE_SWAPS = [
  [/Holy Ghost/gi, 'Holy Spirit'],
  [/\bI am the Lord\b/gi, 'I am the Lord'],
  [/\bThere hath no\b/gi, 'No'],
  [/\bthere hath no\b/gi, 'no'],
  [/\bwill not suffer you to be\b/gi, 'will not let you be'],
  [/\bshall not want\b/gi, 'will not lack what I need'],
  [/\btake no thought\b/gi, 'do not worry'],
  [/\bbe careful for nothing\b/gi, 'do not worry about anything'],
  [/\bby and by\b/gi, 'soon'],
  [/\bof a truth\b/gi, 'truly'],
  [/\bit came to pass\b/gi, 'it happened'],
  [/\band it came to pass\b/gi, 'and it happened'],
  [/\bfor ever and ever\b/gi, 'forever'],
  [/\bfor ever\b/gi, 'forever'],
  [/\bworld without end\b/gi, 'forever'],
  [/\bfrom henceforth\b/gi, 'from now on'],
  [/\bhitherto\b/gi, 'until now'],
  [/\bheretofore\b/gi, 'until now'],
  [/\bin no wise\b/gi, 'not at all'],
  [/\bto wit\b/gi, 'namely'],
  [/\bwot not\b/gi, 'do not know'],
  [/\bwist not\b/gi, 'did not know'],
  [/\bthee and thou\b/gi, 'you'],
  [/\bLet not your heart be troubled\b/gi, 'Do not let your heart be troubled'],
  [/\bFear thou not\b/gi, 'Do not be afraid'],
  [/\bFear not\b/gi, 'Do not be afraid'],
  [/\bBe not afraid\b/gi, 'Do not be afraid'],
  [/\bBe ye\b/gi, 'Be'],
  [/\bGo ye\b/gi, 'Go'],
  [/\bCome ye\b/gi, 'Come'],
  [/\bHear ye\b/gi, 'Listen'],
  [/\bO ye\b/gi, 'You'],
  [/\byea, /gi, 'yes, '],
  [/\bnay, /gi, 'no, ']
];

let _bbeCache = null;

export function normalizeHeroRef(ref) {
  let s = String(ref || '')
    .replace(/\uFEFF/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .replace(/\s*\(BBE\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .replace(/[–—]/g, '-')
    .trim();
  s = s.replace(/^Psalms\s+/i, 'Psalm ');
  s = s.replace(/^Ps\.?\s+/i, 'Psalm ');
  return s;
}

export function refLookupKeys(ref) {
  const n = normalizeHeroRef(ref);
  const keys = [];
  if (n) keys.push(n);
  if (/^Psalm\s+/i.test(n)) keys.push(n.replace(/^Psalm\s+/i, 'Psalms '));
  if (/^Psalms\s+/i.test(n)) keys.push(n.replace(/^Psalms\s+/i, 'Psalm '));
  const raw = String(ref || '').trim();
  if (raw && keys.indexOf(raw) === -1) keys.push(raw);
  return keys;
}

export function stripPlainPrefix(plain) {
  return String(plain || '')
    .replace(/^\s*In plain words:\s*/i, '')
    .replace(/^\s*Plain English:\s*/i, '')
    .replace(/^\s*Key idea:\s*/i, '')
    .replace(/^\s*In simpler words:\s*/i, '')
    .trim();
}

export function normalizeForCompare(text) {
  let s = stripPlainPrefix(text).toLowerCase();
  Object.keys(ARCHAIC_TO_MODERN).forEach((k) => {
    s = s.replace(new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'), ARCHAIC_TO_MODERN[k]);
  });
  return s
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** True when plain is empty, filler, or basically echoes the KJV. */
export function isWeakLaymanPlain(plain, verseText) {
  const pRaw = String(plain || '').replace(/\s+/g, ' ').trim();
  if (!pRaw) return true;
  if (pRaw.length < 18) return true;
  const weakExact = [
    /^God can do what looks impossible to us\.?\s*$/i,
    /^This word from Scripture meets you/i,
    /^A steady truth from Scripture for real life today\.?$/i,
    /^This verse says something true from God for real life today/i,
    /^Read this verse slowly\. Let one clear phrase stay with you/i,
    /^God is speaking something steady here/i,
    /^This line of Scripture is for real life/i,
    /^Keep one truth from this verse close when the day pulls/i,
    /^God'?s Word here is practical: receive it/i,
    /^Pause on this verse until it feels less like noise/i,
    /^Something true from God is on the page/i,
    /^This verse is short enough to carry/i,
    /^Scripture meets ordinary hours here/i,
    /^God is not far from this moment\. Let this verse name/i,
    /^God'?s care is for you today — something solid/i,
    /^Hand the real weight to God\. Trust that He hears/i,
    /^When you feel empty, God gives strength beyond your own\.?$/i,
    /^You do not have to carry fear alone\. Bring it to God/i,
    /^God offers real rest — a quiet place/i,
    /^God'?s kindness meets you as you are/i,
    /^God shows a clear way to live\. His instructions are for your good\.?$/i
  ];
  for (let i = 0; i < weakExact.length; i++) {
    if (weakExact[i].test(pRaw)) return true;
  }

  const p = normalizeForCompare(pRaw);
  const v = normalizeForCompare(verseText);
  if (!p) return true;
  if (v && p === v) return true;
  if (v && (p.indexOf(v) === 0 || v.indexOf(p) === 0) && Math.abs(p.length - v.length) < 40) {
    return true;
  }
  /* Near-echo of KJV (same length-ish, high token overlap) is weak as "teaching". */
  if (v && p.length >= Math.max(28, v.length * 0.78)) {
    const pTok = p.split(' ').filter(Boolean);
    const vTok = new Set(v.split(' ').filter(Boolean));
    if (pTok.length >= 8) {
      let hit = 0;
      pTok.forEach((t) => {
        if (vTok.has(t)) hit += 1;
      });
      if (hit / pTok.length >= 0.82) return true;
    }
  }
  return false;
}

export function modernizeKjvText(text) {
  let out = String(text || '').replace(/\s+/g, ' ').trim();
  if (!out) return '';
  PHRASE_SWAPS.forEach(([re, rep]) => {
    out = out.replace(re, rep);
  });
  Object.keys(ARCHAIC_TO_MODERN).forEach((k) => {
    out = out.replace(new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'), (m) => {
      const modern = ARCHAIC_TO_MODERN[k];
      if (m[0] === m[0].toUpperCase() && m.slice(1) === m.slice(1).toLowerCase()) {
        return modern.charAt(0).toUpperCase() + modern.slice(1);
      }
      if (m === m.toUpperCase() && m.length > 1) return modern.toUpperCase();
      return modern;
    });
  });
  out = out
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([.!?])\s*([a-z])/g, (_, p, c) => p + ' ' + c.toUpperCase())
    .trim();
  if (out) out = out.charAt(0).toUpperCase() + out.slice(1);
  if (out && !/[.!?]"?$/.test(out)) out += '.';
  return out;
}

function loadBbeMap(rootDir) {
  if (_bbeCache) return _bbeCache;
  const candidates = [
    path.join(rootDir, 'data', 'bbe-full.json'),
    path.join(rootDir, 'bbe-full.json')
  ];
  for (let i = 0; i < candidates.length; i++) {
    try {
      if (fs.existsSync(candidates[i])) {
        _bbeCache = JSON.parse(fs.readFileSync(candidates[i], 'utf8'));
        return _bbeCache;
      }
    } catch (_) {}
  }
  _bbeCache = {};
  return _bbeCache;
}

export function lookupBbeText(ref, rootDir) {
  const map = loadBbeMap(rootDir || process.cwd());
  const keys = refLookupKeys(ref);
  for (let i = 0; i < keys.length; i++) {
    const hit = map[keys[i]];
    if (hit && String(hit).trim()) return String(hit).replace(/\s+/g, ' ').trim();
  }
  return '';
}

/** Shorten long BBE/KJV for a single teaching line. */
export function compressToTeachingLine(text, maxLen) {
  const limit = maxLen || 180;
  let s = String(text || '').replace(/\s+/g, ' ').trim();
  if (!s) return '';
  if (s.length <= limit) {
    if (!/[.!?]"?$/.test(s)) s += '.';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  /* Prefer first two clauses. */
  const parts = s.split(/(?<=[.:;])\s+/);
  let out = parts[0] || s;
  if (parts[1] && (out + ' ' + parts[1]).length <= limit + 20) {
    out = out + ' ' + parts[1];
  }
  if (out.length > limit) {
    out = out.slice(0, limit - 1).replace(/\s+\S*$/, '') + '…';
  }
  if (!/[.!?…]"?$/.test(out)) out += '.';
  return out.charAt(0).toUpperCase() + out.slice(1);
}

/**
 * Famous-verse anchors only — still verse-specific, not mood stamps.
 * Checked after BBE/modernize so they refine known lines.
 */
export function buildFamousVersePlain(ref, text) {
  const body = String(text || '').replace(/\s+/g, ' ').trim();
  const lower = body.toLowerCase();
  const r = normalizeHeroRef(ref).toLowerCase();

  if (/genesis\s+1:1/.test(r) || /^in the beginning god created/.test(lower)) {
    return 'In the beginning, God created the heavens and the earth — everything starts with Him.';
  }
  if (/john\s+3:16/.test(r) || /for god so loved the world/.test(lower)) {
    return 'God loved the world so much He gave His only Son, so whoever believes in Him will not be lost but have eternal life.';
  }
  if (/philippians\s+4:13/.test(r) || /i can do all things through christ/.test(lower)) {
    return 'I can face what is in front of me because Christ gives me strength.';
  }
  if (/philippians\s+4:6/.test(r) || /be careful for nothing/.test(lower)) {
    return 'Do not let worry run the day — pray about everything, with thanksgiving, and tell God what you need.';
  }
  if (/philippians\s+4:7/.test(r) || /peace of god, which passeth/.test(lower)) {
    return 'God’s peace — bigger than you can fully explain — will guard your heart and mind in Christ Jesus.';
  }
  if (/psalm\s+23:1/.test(r) || /lord is my shepherd; i shall not want/.test(lower)) {
    return 'The Lord is my shepherd; with Him I will not lack what I truly need.';
  }
  if (/psalm\s+46:10/.test(r) || /^be still, and know that i am god/.test(lower)) {
    return 'Stop striving and know that God is God — He is in charge, not your panic.';
  }
  if (/psalm\s+46:1/.test(r) || /god is our refuge and strength/.test(lower)) {
    return 'God is our safe place and our strength, a very present help when trouble hits.';
  }
  if (/psalm\s+91:1/.test(r) || /secret place of the most high/.test(lower)) {
    return 'The one who stays close to the Most High rests under His shadow — protected near Him.';
  }
  if (/matthew\s+11:28/.test(r) || /come unto me, all ye that labour/.test(lower)) {
    return 'Come to Jesus if you are worn out and carrying too much — He will give you rest.';
  }
  if (/isaiah\s+41:10/.test(r) || /fear thou not; for i am with thee/.test(lower)) {
    return 'Do not be afraid: God is with you. He will strengthen you, help you, and hold you up.';
  }
  if (/isaiah\s+40:31/.test(r) || /they that wait upon the lord shall renew/.test(lower)) {
    return 'Those who wait on the Lord get fresh strength — they rise, run, and walk without giving out.';
  }
  if (/romans\s+8:28/.test(r) || /all things work together for good/.test(lower)) {
    return 'Even the hard pieces are not wasted — God weaves them for good for those who love Him and are called by Him.';
  }
  if (/2\s+timothy\s+1:7/.test(r) || /spirit of fear; but of power/.test(lower)) {
    return 'God did not give us a spirit of fear, but of power, love, and a sound mind.';
  }
  if (/1\s+peter\s+5:7/.test(r) || /casting all your care upon him/.test(lower)) {
    return 'Throw all your worries on God, because He cares for you.';
  }
  if (/proverbs\s+3:5/.test(r) || /trust in the lord with all thine heart/.test(lower)) {
    return 'Trust the Lord with your whole heart, and do not lean only on your own understanding.';
  }
  if (/joshua\s+1:9/.test(r) || /be strong and of a good courage/.test(lower)) {
    return 'Be strong and courageous. Do not be terrified — the Lord your God is with you wherever you go.';
  }
  if (/jeremiah\s+29:11/.test(r) || /thoughts of peace, and not of evil/.test(lower)) {
    return 'God’s plans for His people are for peace and a future with hope — not for ruin.';
  }
  if (/1\s+corinthians\s+10:13/.test(r) || /no temptation taken you but such as is common/.test(lower)) {
    return 'No temptation has seized you except what people commonly face. God is faithful: He will not let you be tempted beyond what you can bear, and He will make a way through it.';
  }
  if (/john\s+14:27/.test(r) || /peace i leave with you, my peace i give/.test(lower)) {
    return 'Jesus leaves you His peace — not the thin kind the world gives. Do not let your heart be troubled or afraid.';
  }
  if (/matthew\s+6:33/.test(r) || /seek ye first the kingdom of god/.test(lower)) {
    return 'Put God’s kingdom and His right ways first, and what you need will be added in His care.';
  }
  if (/romans\s+12:2/.test(r) || /be not conformed to this world/.test(lower)) {
    return 'Do not copy the world’s pattern. Be changed by a renewed mind so you can prove what God’s will is.';
  }
  if (/hebrews\s+11:1/.test(r) || /faith is the substance of things hoped for/.test(lower)) {
    return 'Faith is being sure of what we hope for, and certain of what we do not yet see.';
  }
  if (/galatians\s+5:22/.test(r) || /fruit of the spirit is love/.test(lower)) {
    return 'The Spirit grows love, joy, peace, patience, kindness, goodness, faithfulness in a life.';
  }
  if (/ephesians\s+2:8/.test(r) || /by grace are ye saved through faith/.test(lower)) {
    return 'You are saved by grace through faith — it is God’s gift, not something you earn.';
  }
  if (/psalm\s+119:105/.test(r) || /thy word is a lamp unto my feet/.test(lower)) {
    return 'God’s Word is a lamp for your feet and a light for your path — enough light for the next step.';
  }
  if (/lamentations\s+3:22/.test(r) || /mercies.*new every morning|it is of the lord'?s mercies/.test(lower)) {
    return 'The Lord’s mercies are not used up. His compassions never fail; they are new every morning.';
  }
  if (/psalm\s+92:4/.test(r) || /made me glad through thy work|glad through your work/.test(lower)) {
    return 'God’s work is what makes the heart glad — joy rises when you look at what He has done, not only at how the day feels.';
  }
  if (/psalm\s+92:1/.test(r) || /good (thing )?to give thanks unto the lord/.test(lower)) {
    return 'It is a good thing to thank the Lord and to sing praise to His name.';
  }
  if (/psalm\s+100:4/.test(r) || /enter into his gates with thanksgiving/.test(lower)) {
    return 'Come into God’s presence with thanksgiving and praise — enter with a grateful heart.';
  }
  if (/psalm\s+118:24/.test(r) || /this is the day which the lord hath made/.test(lower)) {
    return 'Today is a gift from the Lord — choose gladness in it, even if the schedule is hard.';
  }
  if (/begat|son of|daughter of|the generations of/i.test(body) && body.length < 180) {
    return 'This verse records real family lines in God’s story — names and people matter to Him.';
  }
  return '';
}

/**
 * Theme assist only when it clearly matches the verse AND we can still quote a fragment.
 * Used only as last resort after BBE/modernize fail quality checks.
 */
export function buildThemeLaymanPlain(ref, text) {
  const famous = buildFamousVersePlain(ref, text);
  if (famous) return famous;

  const body = String(text || '').replace(/\s+/g, ' ').trim();
  const lower = body.toLowerCase();
  const r = normalizeHeroRef(ref).toLowerCase();

  /* Pull a short distinctive fragment so the line stays verse-tied. */
  let frag = '';
  const m =
    body.match(/"([^"]{8,48})"/) ||
    body.match(/\b([A-Za-z][^.!?;:]{12,56})\b/);
  if (m) {
    frag = modernizeKjvText(m[1] || m[0])
      .replace(/\.$/, '')
      .slice(0, 56);
  }

  function withFrag(base) {
    if (!frag || frag.length < 10) return base;
    const f = frag.charAt(0).toLowerCase() + frag.slice(1);
    if (base.toLowerCase().indexOf(f.slice(0, 12).toLowerCase()) >= 0) return base;
    return base.replace(/\.$/, '') + ' — "' + frag.replace(/\.$/, '') + '".';
  }

  if (/\btempt(ation|ed)?\b|\btrial\b|\btest\b/.test(lower)) {
    return withFrag('Temptation is real and common, but God is faithful and makes a way through it.');
  }
  if (/\banxious|careful for nothing|worry|fear|afraid|dismay|terror|troubled\b/.test(lower)) {
    return withFrag('You do not have to carry fear alone — bring it to God and let Him steady you.');
  }
  if (/\bpeace|rest|still|quiet|calm|be still\b/.test(lower)) {
    return withFrag('God offers real rest — a quiet place to set the day down with Him.');
  }
  if (/\bmercy|grace|forgiv|compassion|lovingkindness|longsuffering\b/.test(lower)) {
    return withFrag('God’s kindness meets you as you are — not after you perform.');
  }
  if (/\bstrength|strong|courage|weary|faint|renew|uphold|power\b/.test(lower)) {
    return withFrag('When you feel empty, God gives strength beyond your own.');
  }
  if (/\bhope|trust|believe|faith|pray|prayer|cast.*care|burden\b/.test(lower)) {
    return withFrag('Hand the real weight to God. Trust that He hears and holds you.');
  }
  if (/\blove|charity|shepherd|save|salvation|rejoice|glad|joy|bless\b/.test(lower)) {
    return withFrag('God’s care is for you today — hold that truth when the day feels thin.');
  }
  if (/\brepent|turn ye|turn to the lord|return unto me\b/.test(lower)) {
    return withFrag('Turn back to God. He welcomes the one who comes home.');
  }
  if (/\bworship|praise|sing unto|glorify|hallelujah|give thanks|thanksgiving\b/.test(lower)) {
    return withFrag('Give God your attention and thanks — He is worthy of it.');
  }
  if (/\bwisdom|wise|understand|understanding|knowledge|instruction\b/.test(lower)) {
    return withFrag('Real wisdom starts with taking God seriously and walking in His way.');
  }
  if (/\bcommand|thou shalt|ye shall|statute|precept|ordinance\b/.test(lower)) {
    return withFrag('God shows a clear way to live. His instructions are for your good.');
  }
  if (/\bcreat(ed|e|ion|or)\b|\bmade the heaven|\bmade heaven and earth\b/.test(lower)) {
    return withFrag('God is the Maker. Nothing exists outside His hand.');
  }
  if (/\bcross|crucif|blood of|resurrection|risen|die for|gave himself\b/.test(lower)) {
    return withFrag('Jesus gave Himself so you could be brought near to God.');
  }
  if (/\blight\b/.test(lower) && /\bdark|darkness\b/.test(lower)) {
    return withFrag('God brings light into dark places — and that light is for you too.');
  }
  if (/\bwait|patience|patient|endure|persevere\b/.test(lower)) {
    return withFrag('Waiting with God is not wasted time. Stay steady; He is still at work.');
  }

  /* Last resort: modernized verse itself (always verse-grounded). */
  const modern = compressToTeachingLine(modernizeKjvText(body), 200);
  if (modern && modern.length >= 20) return modern;
  return 'Read this verse slowly and hold the words that land — God is speaking here.';
}

export function loadVersePlainMeanings(rootDir) {
  const scriptPath = path.join(rootDir, 'script.js');
  const s = fs.readFileSync(scriptPath, 'utf8');
  const start = s.indexOf('var VERSE_PLAIN_MEANINGS = {');
  if (start < 0) return {};
  const braceStart = s.indexOf('{', start);
  let depth = 0;
  let end = -1;
  for (let i = braceStart; i < s.length; i++) {
    const ch = s[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) return {};
  try {
    return Function('"use strict"; return (' + s.slice(braceStart, end + 1) + ');')();
  } catch (_) {
    return {};
  }
}

export function lookupCuratedPlain(ref, map) {
  const dict = map || {};
  const keys = refLookupKeys(ref);
  for (let i = 0; i < keys.length; i++) {
    const hit = dict[keys[i]];
    if (hit && String(hit).trim()) return String(hit).trim();
  }
  return '';
}

/**
 * Best plain explanation for a verse.
 * @param {string} ref
 * @param {string} text KJV text
 * @param {object} [map] curated VERSE_PLAIN_MEANINGS
 * @param {string} [rootDir] repo root for BBE load
 */
export function buildHeroLaymanPlain(ref, text, map, rootDir) {
  const raw = String(text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const curated = lookupCuratedPlain(ref, map);
  if (curated && !isWeakLaymanPlain(curated, raw)) return curated;

  const famous = buildFamousVersePlain(ref, raw);
  if (famous && !isWeakLaymanPlain(famous, raw)) return famous;

  const root = rootDir || process.cwd();
  const bbe = lookupBbeText(ref, root);
  const modern = compressToTeachingLine(modernizeKjvText(raw), 200);

  /*
   * BBE is already shown as “In simpler words.” Layman must teach meaning, not re-print BBE.
   * Only use BBE when it is clearly more than a word-modernization of the KJV.
   */
  if (bbe) {
    const bbeLine = compressToTeachingLine(bbe, 200);
    const bbeIsModernEcho =
      !bbeLine ||
      normalizeForCompare(bbeLine) === normalizeForCompare(raw) ||
      normalizeForCompare(bbeLine) === normalizeForCompare(modern) ||
      isWeakLaymanPlain(bbeLine, raw) ||
      isWeakLaymanPlain(bbeLine, modern);
    if (bbeLine && bbeLine.length >= 28 && !bbeIsModernEcho) {
      return bbeLine;
    }
  }

  /* Prefer a short teaching line from theme+famous before raw modernize echo. */
  const theme = buildThemeLaymanPlain(ref, raw);
  if (theme && !isWeakLaymanPlain(theme, raw) && normalizeForCompare(theme) !== normalizeForCompare(modern)) {
    return theme;
  }

  if (modern && modern.length >= 24 && normalizeForCompare(modern) !== normalizeForCompare(raw)) {
    /* Frame modernized text as meaning when it actually changed archaic forms. */
    if (!isWeakLaymanPlain(modern, raw)) return modern;
  }

  if (theme) return theme;
  return modern || 'Read this verse slowly and hold the words that land — God is speaking here.';
}

/** Concrete "for today" line grounded in verse keywords. */
export function buildModernApplication(text, ref) {
  const lower = String(text || '').toLowerCase();
  const h = Math.abs(
    String(ref || text || '')
      .split('')
      .reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)
  );

  if (/\btempt(ation|ed)?\b|\btrial\b/.test(lower)) {
    return 'When pressure hits, say out loud: God is faithful and makes a way — then take the honest next step.';
  }
  if (/\b(careful|worry|anxious|fear|afraid|troubled)\b/.test(lower)) {
    return 'Name the worry to God in one sentence, then reread this verse before you react.';
  }
  if (/\b(peace|rest|still|quiet)\b/.test(lower)) {
    return 'Sit still for sixty seconds with this verse — phone face down — before the next task.';
  }
  if (/\b(strength|strong|weary|faint|power)\b/.test(lower)) {
    return 'Ask God for strength for the next hour only, then do the next honest small thing.';
  }
  if (/\b(pray|prayer|supplication|ask)\b/.test(lower)) {
    return 'Pray this verse once as written, then tell God one real need without polishing it.';
  }
  if (/\b(forgiv|mercy|grace)\b/.test(lower)) {
    return 'If someone comes to mind, ask God for the mercy this verse describes — for them and for you.';
  }
  /* Avoid matching "love" inside "for good of those who love him" style lines unless love is the main verb. */
  if (/\b(charity|neighbour|neighbor)\b/.test(lower) || /\blove one another\b|\bloveth\b|\bwalk in love\b/.test(lower)) {
    return 'Do one concrete kind act today that matches the love in this verse.';
  }
  if (/\bwork together for good\b|\ball things work\b/.test(lower)) {
    return 'When a hard detail will not make sense yet, hold this promise and take the next faithful step.';
  }
  if (/\b(glad|joy|rejoice|made me glad)\b/.test(lower) && /\b(work|works|hands|done)\b/.test(lower)) {
    return 'Name one work of God you can see this week — then thank Him for it out loud.';
  }
  if (/\b(give thanks|thanksgiving|praise|rejoice|glad|joy)\b/.test(lower)) {
    return 'List three ordinary mercies out loud, then thank God for them before the day ends.';
  }
  if (/\b(wait|patience|endure)\b/.test(lower)) {
    return 'When you want to force an answer, return to this verse and wait one more honest hour.';
  }
  if (/\b(word|scripture|law|precept|command)\b/.test(lower)) {
    return 'Write one phrase from this verse where you will see it tonight.';
  }

  const pool = [
    'Sit with one phrase from this verse before you move on.',
    'Take one honest step today that matches what this verse says.',
    'Return to this line when the day gets loud.',
    'Pray this verse once, then act as if God heard you.',
    'Share one sentence of this verse with someone who needs steady words.',
    'Write one word from this verse where you will see it later.',
    'Let this verse set the pace of your next conversation.',
    'Hold this truth when you feel pressed to hurry past God.',
    'Use this verse as a quiet answer when worry starts talking first.',
    'End the day by reading this line again, slowly.'
  ];
  return pool[h % pool.length];
}
