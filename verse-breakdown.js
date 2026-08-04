(function () {
  'use strict';

  var BOOK_CONTEXT = {
    Genesis: { s: 'Moses', a: 'Israel' }, Exodus: { s: 'Moses', a: 'Israel' }, Leviticus: { s: 'Moses', a: 'Israel' }, Numbers: { s: 'Moses', a: 'Israel' }, Deuteronomy: { s: 'Moses', a: 'Israel' },
    Joshua: { s: 'Joshua', a: 'Israel' }, Judges: { s: 'Unknown', a: 'Israel' }, Ruth: { s: 'Unknown', a: 'Israel' },
    '1 Samuel': { s: 'Samuel', a: 'Israel' }, '2 Samuel': { s: 'Nathan', a: 'Israel' }, '1 Kings': { s: 'Unknown', a: 'Israel' }, '2 Kings': { s: 'Unknown', a: 'Israel' },
    '1 Chronicles': { s: 'Chronicler', a: 'Exiles' }, '2 Chronicles': { s: 'Chronicler', a: 'Exiles' }, Ezra: { s: 'Ezra', a: 'Exiles' }, Nehemiah: { s: 'Nehemiah', a: 'Exiles' }, Esther: { s: 'Unknown', a: 'Israel' },
    Job: { s: 'Job and the Lord', a: 'All' }, Psalm: { s: 'David or another psalm writer', a: 'Everyone hurting or thankful' }, Psalms: { s: 'David or another psalm writer', a: 'Everyone hurting or thankful' },
    Proverbs: { s: 'Solomon giving wisdom', a: 'Everyone seeking guidance' }, Ecclesiastes: { s: 'Solomon', a: 'All' }, 'Song of Solomon': { s: 'Solomon', a: 'All' },
    Isaiah: { s: 'Isaiah', a: 'Judah' }, Jeremiah: { s: 'Jeremiah', a: 'Judah and the exiles' }, Lamentations: { s: 'Jeremiah', a: 'Exiles' }, Ezekiel: { s: 'Ezekiel', a: 'Exiles' }, Daniel: { s: 'Daniel', a: 'Exiles' },
    Hosea: { s: 'Hosea', a: 'Israel' }, Joel: { s: 'Joel', a: 'Judah' }, Amos: { s: 'Amos', a: 'Israel' }, Obadiah: { s: 'Obadiah', a: 'Edom' }, Jonah: { s: 'Jonah', a: 'Nineveh' }, Micah: { s: 'Micah', a: 'Judah' }, Nahum: { s: 'Nahum', a: 'Nineveh' }, Habakkuk: { s: 'Habakkuk', a: 'Judah' }, Zephaniah: { s: 'Zephaniah', a: 'Judah' }, Haggai: { s: 'Haggai', a: 'Exiles' }, Zechariah: { s: 'Zechariah', a: 'Exiles' }, Malachi: { s: 'Malachi', a: 'Israel' },
    Matthew: { s: 'Jesus', a: 'Believers' }, Mark: { s: 'Jesus', a: 'Believers' }, Luke: { s: 'Jesus', a: 'Believers' }, John: { s: 'Jesus', a: 'Believers' }, Acts: { s: 'Luke', a: 'Church' },
    Romans: { s: 'Paul', a: 'Rome' }, '1 Corinthians': { s: 'Paul', a: 'Corinth' }, '2 Corinthians': { s: 'Paul', a: 'Corinth' }, Galatians: { s: 'Paul', a: 'Galatia' }, Ephesians: { s: 'Paul', a: 'Ephesus' }, Philippians: { s: 'Paul', a: 'Philippi' }, Colossians: { s: 'Paul', a: 'Colosse' }, '1 Thessalonians': { s: 'Paul', a: 'Thessalonica' }, '2 Thessalonians': { s: 'Paul', a: 'Thessalonica' }, '1 Timothy': { s: 'Paul', a: 'Timothy' }, '2 Timothy': { s: 'Paul', a: 'Timothy' }, Titus: { s: 'Paul', a: 'Titus' }, Philemon: { s: 'Paul', a: 'Philemon' }, Hebrews: { s: 'Unknown', a: 'Hebrew believers' }, James: { s: 'James', a: 'Believers' }, '1 Peter': { s: 'Peter', a: 'Believers' }, '2 Peter': { s: 'Peter', a: 'Believers' }, '1 John': { s: 'John', a: 'Believers' }, '2 John': { s: 'John', a: 'Believers' }, '3 John': { s: 'John', a: 'Gaius' }, Jude: { s: 'Jude', a: 'Believers' }, Revelation: { s: 'John', a: 'Seven churches' }
  };

  var ARCHAIC = {
    careful: 'worried', beseech: 'ask', supplication: 'prayer', thee: 'you', thou: 'you', thy: 'your', ye: 'you',
    hath: 'has', doth: 'does', believeth: 'believes', loveth: 'loves', giveth: 'gives', knoweth: 'knows', maketh: 'makes',
    strengtheneth: 'strengthens', keepeth: 'keeps', worketh: 'works', unto: 'to', saith: 'says', begotten: 'only', perish: 'be lost',
    everlasting: 'eternal', labour: 'labor', laden: 'burdened', dismayed: 'discouraged', whosoever: 'whoever', whatsoever: 'whatever',
    verily: 'truly', behold: 'look', passeth: 'passes', brethren: 'brothers', mount: 'rise', faint: 'give up'
  };
  var AGE_KEY = 'tdb_age_mode_v1';
  var NOTE_FALLBACK_KEY = 'tdb_breakdown_notes_v1';
  /* v3: reject near-verbatim override plains so all 31k+ verses get real layman text */
  var BREAKDOWN_CACHE_PREFIX = 'tdb_vb_cache_v3::';
  var BREAKDOWN_MAX_MEMORY_CACHE = 600;
  var KJV_DICT_URLS = ['/data/kjv-full.json', '/kjv.json'];
  var BREAKDOWN_OVERRIDES_SCRIPT_URL = '/verse-breakdown-overrides.js';
  var INLINE_SUMMARY = 'Verse breakdown';
  var INLINE_SUMMARY_ARIA = 'Open a verse breakdown under this verse';
  var inlinePanelUid = 0;
  var BREAKDOWN_OVERRIDES = {};
  var BREAKDOWN_MEMORY_CACHE = new Map();
  var RELATIONS_FALLBACK = {
    anxiety: {
      line: "When the weight feels too heavy to carry alone, this verse reminds you there is a place to set it down."
    },
    fear: {
      line: "The things that keep you up at night are known. This verse meets you in the dark with steady truth."
    },
    hope: {
      line: "Even when today feels thin, this verse holds a quiet promise that lasts longer than the feeling."
    }
  };
  var relationsDictCache = null;
  var relationsDictPromise = null;
  var bibleDictPromise = null;

  function byId(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Collapse &amp; chains and decode one layer so UI never shows &amp;amp; (matches script.js / kids-corner pattern). */
  function tdbPlainTextForUi(str) {
    function finishPlain(t) {
      if (typeof window.tdbCleanForPlainDisplay === 'function') {
        return window.tdbCleanForPlainDisplay(t);
      }
      if (typeof window.tdbStripAngleMarkupForPlainText === 'function') {
        return window.tdbStripAngleMarkupForPlainText(t);
      }
      return String(t || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    if (str == null || str === '') return '';
    var s = String(str);
    var prev;
    for (var i = 0; i < 12; i++) {
      prev = s;
      s = s.replace(/&amp;/g, '&');
      if (s === prev) break;
    }
    if (typeof window.tdbSetHtml === 'function') {
      try {
        var div = document.createElement('div');
        window.tdbSetHtml(div, s);
        var decoded = div.textContent;
        if (typeof decoded === 'string') return finishPlain(decoded);
      } catch (e) {}
    }
    /* Prefer native innerHTML on a div (not textarea)—WebKit can expose textarea sinks separately from Element TT patches. */
    try {
      var pol2 = window.trustedTypes && window.trustedTypes.defaultPolicy;
      var nativeSet2 = window.__tdbNativeInnerHTMLSet;
      if (pol2 && typeof pol2.createHTML === 'function' && nativeSet2) {
        var div2 = document.createElement('div');
        nativeSet2.call(div2, pol2.createHTML(s));
        var out2 = div2.textContent;
        if (typeof out2 === 'string') return finishPlain(out2);
      }
    } catch (e2) {}
    return finishPlain(s);
  }

  function escapeHtmlPlain(str) {
    return esc(tdbPlainTextForUi(str));
  }

  function parseBook(ref) {
    var m = String(ref || '').trim().match(/^(.+?)\s+\d+:\d+/);
    if (!m) return '';
    return /^Psalms?$/i.test(m[1]) ? 'Psalm' : m[1].trim();
  }

  function rephraseArchaic(text) {
    var s = String(text || '');
    Object.keys(ARCHAIC).forEach(function (k) {
      var re = new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      s = s.replace(re, ARCHAIC[k]);
    });
    return s.replace(/\s+/g, ' ').trim();
  }

  function isNearVerbatimPlain(plain, verseText) {
    var strip = function (s) {
      return String(s || '')
        .replace(/^\s*In plain words:\s*/i, '')
        .replace(/^\s*Plain English:\s*/i, '')
        .replace(/^\s*Key idea:\s*/i, '')
        .trim();
    };
    var norm = function (s) {
      return rephraseArchaic(strip(s))
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };
    var p = norm(plain);
    var v = norm(verseText);
    if (!p) return true;
    if (v && p === v) return true;
    if (v && (p.indexOf(v) === 0 || v.indexOf(p) === 0) && Math.abs(p.length - v.length) < 48) return true;
    /*
     * Token-overlap only flags *echoes* (near same length + mostly same words).
     * Short summaries share keywords (God, love, world) but are not verbatim swaps.
     */
    if (v && p.length >= Math.max(24, v.length * 0.72)) {
      var pTok = p.split(' ').filter(Boolean);
      var vSet = {};
      v.split(' ').filter(Boolean).forEach(function (tok) { vSet[tok] = true; });
      if (pTok.length >= 6) {
        var hit = 0;
        pTok.forEach(function (tok) { if (vSet[tok]) hit += 1; });
        if (hit / pTok.length >= 0.78) return true;
      }
    }
    return false;
  }

  function buildThemeLaymanPlain(ref, text) {
    var body = String(text || '').replace(/\s+/g, ' ').trim();
    var lower = body.toLowerCase();
    var r = String(ref || '').toLowerCase();

    /* Well-known anchors first */
    if (/genesis\s+1:1/.test(r) || /^in the beginning\s+god\s+created/.test(lower)) {
      return 'God made everything. He started it all — heaven, earth, and life.';
    }
    if (/john\s+3:16/.test(r) || /for god so loved the world/.test(lower)) {
      return 'God loved the world so much He gave His Son so you can have life with Him forever.';
    }
    if (/91:1/.test(r) || /secret place|shadow of the almighty/.test(lower) ||
        (/dwell/.test(lower) && /most high|almighty/.test(lower))) {
      return 'When you stay close to God, you rest under His protection — safe in His care.';
    }
    if (/11:28/.test(r) || /come unto me|heavy laden|give you rest/.test(lower)) {
      return 'Come to Jesus as you are, tired and carrying too much. He will give you rest.';
    }
    if (/23:1/.test(r) || /lord is my shepherd|shall not want/.test(lower)) {
      return 'The Lord takes care of me like a shepherd. With Him, I have what I need.';
    }

    /* Theme lanes — covers the full KJV without storing 31k hand-written plains */
    if (/\bcreat(ed|e|ion|or)\b|\bmade the heaven|\bmade heaven and earth\b|\bformed\b.*\b(man|dust|earth)\b/.test(lower)) {
      return 'God is the Maker. Nothing exists outside His hand.';
    }
    if (/\banxious|careful for nothing|worry|fear|afraid|dismay|terror|troubled\b/.test(lower)) {
      return 'You do not have to carry fear alone. Bring it to God and let Him steady you.';
    }
    if (/\bpeace|rest|still|quiet|calm|be still\b/.test(lower)) {
      return 'God offers real rest — a quiet place to set the day down with Him.';
    }
    if (/\bmercy|grace|forgiv|compassion|lovingkindness|longsuffering\b/.test(lower)) {
      return "God's kindness meets you as you are — not after you perform.";
    }
    if (/\bstrength|strong|courage|weary|faint|renew|uphold|power\b/.test(lower)) {
      return 'When you feel empty, God gives strength beyond your own.';
    }
    if (/\bhope|trust|believe|faith|pray|prayer|cast.*care|burden\b/.test(lower)) {
      return 'Hand the real weight to God. Trust that He hears and holds you.';
    }
    if (/\blove|charity|shepherd|save|salvation|rejoice|glad|joy|bless\b/.test(lower)) {
      return "God's care is for you today — something solid to hold when the day feels thin.";
    }
    if (/\brepent|turn ye|turn to the lord|return unto me\b/.test(lower)) {
      return 'Turn back to God. He welcomes the one who comes home.';
    }
    if (/\bworship|praise|sing unto|glorify|hallelujah|give thanks|thanksgiving\b/.test(lower)) {
      return 'Give God your attention and thanks — He is worthy of it.';
    }
    if (/\bwisdom|wise|understand|understanding|knowledge|instruction|proverb\b/.test(lower)) {
      return 'Real wisdom starts with taking God seriously and walking in His way.';
    }
    if (/\bcommand|thou shalt|ye shall|statute|precept|ordinance|law of the lord\b/.test(lower)) {
      return 'God shows a clear way to live. His instructions are for your good.';
    }
    if (/\bword of the lord|thus saith|it is written|thy word|my words|scripture\b/.test(lower)) {
      return "God's Word is not empty talk. It teaches, steadies, and leads.";
    }
    if (/\bholy|sanctify|clean|pure|righteous|upright\b/.test(lower)) {
      return 'God calls His people to a clean, set-apart life with Him.';
    }
    if (/\bneighbou?r|brother|one another|enemy|friend|stranger\b/.test(lower)) {
      return 'This verse shapes how you treat people — close, hard, and everyday.';
    }
    if (/\bkingdom|reign|throne|king of kings\b/.test(lower)) {
      return 'God rules. His kingdom is real, and it still shapes how we live today.';
    }
    if (/\bcross|crucif|blood of|resurrection|risen|die for|gave himself\b/.test(lower)) {
      return 'Jesus gave Himself so you could be brought near to God. Hold that gift carefully.';
    }
    if (/\bdeath|grave|die|dust|mortality\b/.test(lower)) {
      return 'Life and death are in view here. God is not far from either one.';
    }
    if (/\blight\b/.test(lower) && /\bdark|darkness\b/.test(lower)) {
      return 'God brings light into dark places — and that light is for you too.';
    }
    if (/\bmoney|riches|poor|tithe|offering|give alms|mammon\b/.test(lower)) {
      return 'How you handle what you have is part of walking with God.';
    }
    if (/\bangel|heaven|eternal|everlasting|forever\b/.test(lower)) {
      return 'This verse lifts your eyes past the moment — God holds what lasts.';
    }
    if (/\bjudg(e|ment)|wrath|punish|condemn|vengeance\b/.test(lower)) {
      return 'God takes wrong seriously. This verse keeps justice and holiness in view.';
    }
    if (/\bhear(ken)?|listen|ears|cry unto|call upon\b/.test(lower)) {
      return 'God invites you to call on Him — and to listen when He speaks.';
    }
    if (/\bwait|patience|patient|endure|persevere\b/.test(lower)) {
      return 'Waiting with God is not wasted time. Stay steady; He is still at work.';
    }

    return 'Read this verse slowly. Let one clear phrase stay with you through the next hour.';
  }

  /** Drop override fields that only echo the KJV (archaic word-swap). */
  function scrubWeakPlainFields(obj, verseText) {
    if (!obj || typeof obj !== 'object') return obj || {};
    var out = Object.assign({}, obj);
    ['plainExplanation', 'layman', 'plain', 'plainEnglish'].forEach(function (key) {
      if (out[key] != null && isNearVerbatimPlain(out[key], verseText)) {
        delete out[key];
      }
    });
    return out;
  }

  function ensureStrongPlain(ref, verseText, plain) {
    var p = tdbPlainTextForUi(plain || '');
    if (!p || isNearVerbatimPlain(p, verseText)) {
      return buildThemeLaymanPlain(ref, verseText);
    }
    return p;
  }

  function inferApplies(text) {
    var l = String(text || '').toLowerCase();
    if (/\b(careful|worry|anxious|fear|afraid)\b/.test(l)) return 'This verse meets you when fear presses close. You are not asked to carry it alone.';
    if (/\b(hope|hopeth|hoped)\b/.test(l)) return 'Even when the day feels thin, this verse holds something steady.';
    if (/\b(peace|rest)\b/.test(l)) return 'This verse offers a quiet place to set the day down.';
    if (/\b(strength|strong|strengthen)\b/.test(l)) return 'This verse reminds you there is strength beyond your own.';
    if (/\b(pray|prayer|believe|believing|ask.*believ|believ.*receive)\b/.test(l)) {
      return 'Bring your real need to God in prayer. Believe He hears. He answers.';
    }
    return 'Sit with this verse for one slow minute. What does it ask of you today?';
  }

  function plainSpeaker(raw) {
    var s = String(raw || '').trim();
    if (!s) return 'Bible writer';
    if (/jesus/i.test(s)) return 'Jesus';
    if (/paul/i.test(s)) return 'Paul';
    if (/david/i.test(s)) return 'David';
    if (/moses/i.test(s)) return 'Moses';
    if (/john/i.test(s)) return 'John';
    if (/isaiah/i.test(s)) return 'Isaiah';
    if (/jeremiah/i.test(s)) return 'Jeremiah';
    if (/solomon/i.test(s)) return 'Solomon';
    if (/unknown/i.test(s)) return 'Bible writer';
    s = s.split('/')[0].split(',')[0].replace(/\(.*?\)/g, '').trim();
    return s || 'Bible writer';
  }

  function plainAudience(raw) {
    var s = String(raw || '').trim();
    if (!s) return 'People listening back then';
    if (/believers|church/i.test(s)) return 'His friends who needed hope';
    if (/everyone|all humanity|all\b/i.test(s)) return 'People like us';
    if (/rome/i.test(s)) return 'His friends in Rome';
    if (/ephesus/i.test(s)) return 'His friends in Ephesus';
    if (/philippi/i.test(s)) return 'His friends in Philippi';
    if (/galatia/i.test(s)) return 'His friends in Galatia';
    if (/israel|judah|exiles/i.test(s)) return 'His people in a hard season';
    return s.length > 46 ? (s.slice(0, 43) + '...') : s;
  }

  function loadRelationsDict() {
    if (relationsDictCache) return Promise.resolve(relationsDictCache);
    if (relationsDictPromise) return relationsDictPromise;
    relationsDictPromise = Promise.resolve().then(function () {
      // Keep breakdown copy self-contained so optional companion JSON never creates noisy 404s.
      relationsDictCache = Object.assign({}, RELATIONS_FALLBACK);
      return relationsDictCache;
    });
    return relationsDictPromise;
  }

  function getContextNeedle() {
    var ids = ['main-search', 'q', 'mystudy-search', 'query', 'search'];
    var parts = [];
    ids.forEach(function (id) {
      var el = byId(id);
      if (!el) return;
      var v = (typeof el.value === 'string' ? el.value : (el.textContent || ''));
      if (v) parts.push(String(v));
    });
    try {
      var params = new URLSearchParams(window.location.search || '');
      ['q', 'topic', 'ref'].forEach(function (k) {
        var v = params.get(k);
        if (v) parts.push(v);
      });
    } catch (e) {}
    return parts.join(' ').toLowerCase();
  }

  function inferRelationTopic(ref, text) {
    var low = (String(ref || '') + ' ' + String(text || '') + ' ' + getContextNeedle()).toLowerCase();
    if (/\banxiety|anxious|worry|stressed?|stress|urgent|careful\b/.test(low)) return 'anxiety';
    if (/\bfear|afraid|panic|panicking|news cycle|scared|terror\b/.test(low)) return 'fear';
    if (/\bhope|hopeless|bad day|down|weary|tired\b/.test(low)) return 'hope';
    return 'hope';
  }

  function buildRelationLine(topic, dict) {
    var data = dict && typeof dict === 'object' ? dict : RELATIONS_FALLBACK;
    var key = String(topic || 'hope');
    var item = data[key] || data.hope || RELATIONS_FALLBACK.hope;
    if (typeof item === 'string') return tdbPlainTextForUi(item);
    if (item && item.line) return tdbPlainTextForUi(String(item.line));
    return tdbPlainTextForUi(RELATIONS_FALLBACK.hope.line);
  }

  function inferAgeFromContext() {
    try {
      var path = String((window.location && window.location.pathname) || '').toLowerCase();
      if (path.indexOf('/kids') === 0 || path.indexOf('/kids/') === 0) return 'kid';
    } catch (e) {}
    var tierEl = byId('tier');
    if (tierEl && tierEl.value) {
      var t = String(tierEl.value).toLowerCase();
      if (t === 'kid') return 'kid';
      if (t === 'teen') return 'teen';
      if (t === 'adult') return 'adult';
    }
    return '';
  }

  function getAgeMode() {
    var mode = '';
    try { mode = String(localStorage.getItem(AGE_KEY) || '').toLowerCase(); } catch (e) {}
    if (mode === 'kid' || mode === 'teen' || mode === 'adult') return mode;
    mode = inferAgeFromContext();
    return mode || '';
  }

  function setAgeMode(mode) {
    var next = String(mode || '').toLowerCase();
    if (next !== 'kid' && next !== 'teen' && next !== 'adult') next = 'adult';
    try { localStorage.setItem(AGE_KEY, next); } catch (e) {}
    return next;
  }

  function normalizeRef(ref) {
    var raw = tdbPlainTextForUi(String(ref || '').replace(/\s*\(KJV\)\s*$/i, '').trim());
    if (!raw) return '';
    if (typeof window.normalizeBibleRef === 'function') {
      try {
        return tdbPlainTextForUi(window.normalizeBibleRef(raw) || raw);
      } catch (e) {}
    }
    return raw.replace(/^Psalms\s+/i, 'Psalm ');
  }

  function normalizeGroup(group) {
    var raw = String(group || '').toLowerCase().trim();
    if (!raw || raw === 'adult') return 'general';
    if (raw === 'children' || raw === 'child') return 'kid';
    if (raw === 'parents' || raw === 'home') return 'family';
    if (raw === 'pastors' || raw === 'pastor-teacher') return 'pastor';
    if (raw === 'leaders' || raw === 'leader' || raw === 'church' || raw === 'churchleader') return 'church-leader';
    if (raw === 'streetpreacher' || raw === 'street-preaching') return 'street-preacher';
    if (raw === 'biblestudy' || raw === 'bible-study' || raw === 'small-group') return 'bible-study-group';
    return raw;
  }

  function inferPageGroup() {
    try {
      var path = String((window.location && window.location.pathname) || '').toLowerCase();
      if (path.indexOf('/kids') === 0 || path.indexOf('/kids/') === 0) return 'kid';
      if (path.indexOf('/family') === 0 || path.indexOf('family') !== -1) return 'family';
      if (path.indexOf('/pastor') === 0 || path.indexOf('/for-pastors') === 0) return 'pastor';
      if (path.indexOf('/church') === 0 || path.indexOf('church') !== -1) return 'church-leader';
      if (path.indexOf('mission') !== -1) return 'missionary';
      if (path.indexOf('street') !== -1) return 'street-preacher';
      if (path.indexOf('teen') !== -1) return 'teen';
    } catch (e) {}
    return '';
  }

  function inferHostGroup(host) {
    if (!host || typeof host.closest !== 'function') return '';
    var attrs = ['data-tdb-group', 'data-group', 'data-audience'];
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      var node = host.closest('[' + attr + ']');
      if (!node) continue;
      var value = String(node.getAttribute(attr) || '').trim();
      if (value) return normalizeGroup(value);
    }
    return '';
  }

  function resolveGroupContext(options, host) {
    if (typeof options === 'string') return normalizeGroup(options);
    if (options && typeof options === 'object') {
      if (options.group) return normalizeGroup(options.group);
      if (options.ageMode) return normalizeGroup(options.ageMode);
      if (options.host) {
        var hostGroup = inferHostGroup(options.host);
        if (hostGroup) return hostGroup;
      }
    }
    var inferred = inferHostGroup(host);
    if (inferred) return inferred;
    var mode = '';
    try { mode = String(localStorage.getItem(AGE_KEY) || '').toLowerCase(); } catch (e2) {}
    if (mode === 'kid' || mode === 'teen') return mode;
    return normalizeGroup(inferPageGroup() || 'general');
  }

  function normalizeOverrideMap(override) {
    if (!override || typeof override !== 'object') return {};
    var out = {};
    var plain = override.plainExplanation || override.plain || override.layman || '';
    var group = override.groupApplication || override.forGroup || override.applies || '';
    var modern = override.modernApplication || override.today || override.relates || '';
    var about = override.about || override.speaker || '';
    var to = override.to || override.audience || '';
    if (plain) out.plainExplanation = tdbPlainTextForUi(plain);
    if (group) out.groupApplication = tdbPlainTextForUi(group);
    if (modern) out.modernApplication = tdbPlainTextForUi(modern);
    if (about) out.about = tdbPlainTextForUi(about);
    if (to) out.to = tdbPlainTextForUi(to);
    return out;
  }

  function clearCachedBreakdownForRef(refKey) {
    var prefix = BREAKDOWN_CACHE_PREFIX + refKey + '::';
    try {
      BREAKDOWN_MEMORY_CACHE.forEach(function (_, key) {
        if (key.indexOf(prefix) === 0) BREAKDOWN_MEMORY_CACHE.delete(key);
      });
    } catch (eMem) {}
    try {
      for (var i = localStorage.length - 1; i >= 0; i--) {
        var key = localStorage.key(i);
        if (key && key.indexOf(prefix) === 0) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {}
  }

  function registerSeedData(data) {
    if (!data || typeof data !== 'object') return;
    if (data.surfacedRefs && Array.isArray(data.surfacedRefs)) {
      window.TDB_SURFACED_VERSE_REFS = data.surfacedRefs.slice();
    }
    if (data.overrides && typeof data.overrides === 'object') {
      window.TDB_VERSE_BREAKDOWN_OVERRIDES = Object.assign({}, window.TDB_VERSE_BREAKDOWN_OVERRIDES || {}, data.overrides);
      registerOverrides(data.overrides);
    }
    try {
      if (window.__tdbVerseBreakdownAutoEnhanced) {
        enhanceVerseContainers(document);
      }
      if (typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('tdb-verse-breakdown-seed-ready'));
      }
    } catch (e) {}
  }

  function ensureOverrideSeedScript() {
    if (window.TDB_VERSE_BREAKDOWN_DATA || window.TDB_VERSE_BREAKDOWN_OVERRIDES) return;
    if (document.querySelector('script[data-tdb-verse-breakdown-overrides]')) return;
    var s = document.createElement('script');
    s.src = BREAKDOWN_OVERRIDES_SCRIPT_URL;
    s.defer = true;
    s.setAttribute('data-tdb-verse-breakdown-overrides', '1');
    (document.head || document.documentElement).appendChild(s);
  }

  function registerOverrides(entries) {
    if (!entries) return;
    if (Array.isArray(entries)) {
      entries.forEach(function (entry) {
        if (!entry || !entry.ref) return;
        var tmp = {};
        tmp[entry.ref] = {};
        tmp[entry.ref][normalizeGroup(entry.group || 'general')] = entry;
        registerOverrides(tmp);
      });
      return;
    }
    Object.keys(entries).forEach(function (rawRef) {
      var refKey = normalizeRef(rawRef);
      if (!refKey) return;
      var payload = entries[rawRef];
      if (!payload || typeof payload !== 'object') return;
      if (!BREAKDOWN_OVERRIDES[refKey]) BREAKDOWN_OVERRIDES[refKey] = {};
      var looksGrouped = payload.general || payload.kid || payload.teen || payload.family || payload.pastor || payload['church-leader'] || payload.missionary || payload['street-preacher'] || payload['bible-study-group'];
      var groups = looksGrouped ? payload : { general: payload };
      Object.keys(groups).forEach(function (rawGroup) {
        var groupKey = normalizeGroup(rawGroup);
        BREAKDOWN_OVERRIDES[refKey][groupKey] = Object.assign(
          {},
          BREAKDOWN_OVERRIDES[refKey][groupKey] || {},
          normalizeOverrideMap(groups[rawGroup])
        );
      });
      clearCachedBreakdownForRef(refKey);
    });
  }

  function getRegisteredOverride(ref, group) {
    var refKey = normalizeRef(ref);
    if (!refKey || !BREAKDOWN_OVERRIDES[refKey]) return {};
    return Object.assign({}, BREAKDOWN_OVERRIDES[refKey].general || {}, BREAKDOWN_OVERRIDES[refKey][normalizeGroup(group)] || {});
  }

  function getTextCacheKey(ref, group, text) {
    var raw = tdbPlainTextForUi(String(text || ''));
    return BREAKDOWN_CACHE_PREFIX + normalizeRef(ref) + '::' + normalizeGroup(group) + '::' + raw.length + '::' + raw.slice(0, 48);
  }

  function readCachedBreakdown(ref, group, text) {
    var cacheKey = getTextCacheKey(ref, group, text);
    if (BREAKDOWN_MEMORY_CACHE.has(cacheKey)) {
      return BREAKDOWN_MEMORY_CACHE.get(cacheKey);
    }
    try {
      var stored = localStorage.getItem(cacheKey);
      if (!stored) return null;
      var parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') BREAKDOWN_MEMORY_CACHE.set(cacheKey, parsed);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function writeCachedBreakdown(ref, group, text, data) {
    var cacheKey = getTextCacheKey(ref, group, text);
    BREAKDOWN_MEMORY_CACHE.set(cacheKey, data);
    if (BREAKDOWN_MEMORY_CACHE.size > BREAKDOWN_MAX_MEMORY_CACHE) {
      try {
        var oldest = BREAKDOWN_MEMORY_CACHE.keys().next();
        if (oldest && !oldest.done) BREAKDOWN_MEMORY_CACHE.delete(oldest.value);
      } catch (eMem) {}
    }
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (e) {}
  }

  function getCuratedPlainMeaning(ref) {
    if (typeof window.getPlainMeaning === 'function') {
      try {
        return tdbPlainTextForUi(window.getPlainMeaning(ref) || '');
      } catch (e) {}
    }
    return '';
  }

  function buildGroupApplication(group, topic) {
    var groupKey = normalizeGroup(group);
    var topicKey = String(topic || 'hope');
    var defaults = {
      general: 'For your group: let this verse set the tone for your next faithful step.',
      kid: 'For kids: say it simply, ask Jesus for help, and take one kind step.',
      teen: 'For teens: let this verse speak into pressure, noise, and the next honest choice.',
      family: 'For families: let this verse shape how you talk, respond, and pray together today.',
      pastor: 'For pastors: carry this verse into the weight you hold for other people, not just yourself.',
      'church-leader': 'For church leaders: let this verse guide the way you shepherd, steady, and serve people today.',
      missionary: 'For missionaries: carry this verse into the field with patience, courage, and a clean heart.',
      'street-preacher': 'For street preachers: let this verse keep your tone brave, clean, and full of mercy in public witness.',
      'bible-study-group': 'For Bible study groups: let this verse move the room from discussion into lived obedience.'
    };
    var byTopic = {
      anxiety: {
        general: 'For your group: bring the pressure to God instead of letting it drive the room.',
        kid: 'For kids: when school, bedtime, or big feelings feel scary, tell Jesus the truth and stay near.',
        teen: 'For teens: when your head is loud, the group chat is buzzing, or you feel exposed, let this verse slow you down.',
        family: 'For families: when the house feels tense, let this verse reset the tone before the next response.',
        pastor: 'For pastors: do not carry everybody else so hard that you stop carrying your own heart to God.',
        'church-leader': 'For leaders: when people bring heavy needs, let this verse keep you steady instead of frantic.',
        missionary: 'For missionaries: when the field feels uncertain, keep your soul from living in alarm.',
        'street-preacher': 'For street preachers: when the street is unpredictable, answer fear with steadiness and prayer.',
        'bible-study-group': 'For Bible study groups: when worry is in the room, let this verse create calm honesty.'
      },
      fear: {
        general: 'For your group: courage here is not pretending; it is moving with God while your knees still shake.',
        kid: 'For kids: you do not have to be brave by yourself; Jesus stays close when you feel small.',
        teen: 'For teens: fear does not get to call the shots just because it showed up first.',
        family: 'For families: bring the fear into the light so your home is led by truth, not tension.',
        pastor: 'For pastors: even leaders need reminding that God is with them in the dark places.',
        'church-leader': 'For leaders: let this verse steady your voice when others need calm from you.',
        missionary: 'For missionaries: courage in the field is often quiet, daily, and obedient.',
        'street-preacher': 'For street preachers: bold witness stays anchored when fear is answered by God\'s presence.',
        'bible-study-group': 'For Bible study groups: let this verse turn hidden fear into shared prayer.'
      },
      family: {
        family: 'For families: let this verse show up at the table, in the hallway, and in the way you answer each other.'
      }
    };
    return (byTopic[topicKey] && byTopic[topicKey][groupKey]) || defaults[groupKey] || defaults.general;
  }

  /** True when text matches buildGroupApplication() boilerplate (“For …:”) — wrong for the personal “you” heading. */
  function isAudienceGroupLaneBlurb(txt) {
    var s = tdbPlainTextForUi(txt || '').trim();
    if (!s) return false;
    return /^For\s+(your\s+)?group:|^For\s+kids:|^For\s+teens:|^For\s+families:|^For\s+pastors?:|^For\s+leaders:|^For\s+church\s+leaders?:|^For\s+missionaries:|^For\s+street\s+preachers?:|^For\s+Bible\s+study\s+groups?:/i.test(
      s
    );
  }

  function resolvePersonalYouFromBreakdown(breakdown) {
    var grp = tdbPlainTextForUi((breakdown && breakdown.groupApplication) || '').trim();
    var modern = tdbPlainTextForUi((breakdown && breakdown.modernApplication) || '').trim();
    var relates = tdbPlainTextForUi((breakdown && breakdown.relates) || '').trim();
    var appliesLane = tdbPlainTextForUi((breakdown && breakdown.applies) || '').trim();
    if (grp && !isAudienceGroupLaneBlurb(grp)) return grp;
    var inferred = modern || relates;
    if (inferred) return inferred;
    if (appliesLane && !isAudienceGroupLaneBlurb(appliesLane)) return appliesLane;
    return '';
  }

  function buildGeneratedBase(ref, text) {
    var raw = tdbPlainTextForUi(String(text || '').replace(/<[^>]+>/g, '').trim());
    var book = parseBook(ref);
    if (!book) {
      return {
        about: '',
        to: '',
        plainExplanation: 'Verse not found. Try exact format like John 3:16.',
        groupApplication: '',
        modernApplication: 'Open the verse again and let the wording settle slowly.',
        source: 'generated'
      };
    }
    var ctx = BOOK_CONTEXT[book] || { s: 'The biblical author', a: 'Original audience' };
    if (/begat|son of|daughter of|father of|generations?\s+of/i.test(raw) && raw.length < 140) {
      return {
        about: ctx.s,
        to: ctx.a,
        plainExplanation: 'This verse tracks family lines in God\'s larger story.',
        groupApplication: '',
        modernApplication: 'Every name matters to God. Your life is not background noise to Him.',
        source: 'generated'
      };
    }
    var curatedPlain = getCuratedPlainMeaning(ref);
    var plain = ensureStrongPlain(ref, raw, curatedPlain || '');
    if (raw.length > 150 && plain.length > 160 && !isNearVerbatimPlain(plain, raw)) {
      /* Only trim long theme lines; never leave a truncated KJV echo. */
      if (plain.indexOf(raw.slice(0, 40)) === -1) {
        plain = plain.slice(0, 157) + '…';
      }
    }
    return {
      about: ctx.s,
      to: ctx.a,
      plainExplanation: plain,
      groupApplication: '',
      modernApplication: inferApplies(raw),
      source: (curatedPlain && !isNearVerbatimPlain(curatedPlain, raw)) ? 'override' : 'generated'
    };
  }

  function finalizeBreakdown(base, group) {
    var out = {
      about: plainSpeaker(base.about || ''),
      to: plainAudience(base.to || ''),
      plainExplanation: tdbPlainTextForUi(base.plainExplanation || ''),
      groupApplication: tdbPlainTextForUi(base.groupApplication || ''),
      modernApplication: tdbPlainTextForUi(base.modernApplication || ''),
      bubbleTitle: 'Verse breakdown',
      bubbleEmoji: '',
      group: normalizeGroup(group),
      source: base.source || 'generated'
    };
    out.layman = out.plainExplanation || 'A steady truth from Scripture for real life today.';
    out.applies = out.groupApplication || buildGroupApplication(out.group, inferRelationTopic('', out.layman));
    out.relates = out.modernApplication || inferApplies(out.layman);
    return out;
  }

  function getBreakdown(ref, text, options) {
    var raw = tdbPlainTextForUi(String(text || '').replace(/<[^>]+>/g, ' ').trim());
    var group = resolveGroupContext(options, options && options.host ? options.host : null);
    var manualOverride = scrubWeakPlainFields(
      normalizeOverrideMap(options && options.override ? options.override : null),
      raw
    );
    var useCache = Object.keys(manualOverride).length === 0;
    var cached = useCache ? readCachedBreakdown(ref, group, raw) : null;
    if (cached) {
      /* Re-validate cache: older v2 entries (and any weak seed) must not stick as “plain.” */
      var cachedPlain = cached.plainExplanation || cached.layman || '';
      if (cachedPlain && !isNearVerbatimPlain(cachedPlain, raw)) return cached;
    }
    var base = buildGeneratedBase(ref, raw);
    var registered = scrubWeakPlainFields(getRegisteredOverride(ref, group), raw);
    var merged = Object.assign({}, base, registered, manualOverride);
    merged.plainExplanation = ensureStrongPlain(ref, raw, merged.plainExplanation || merged.layman || merged.plain || '');
    if (!merged.groupApplication) merged.groupApplication = buildGroupApplication(group, inferRelationTopic(ref, raw));
    if (!merged.modernApplication) merged.modernApplication = inferApplies(raw);
    var finalBreakdown = finalizeBreakdown(merged, group);
    finalBreakdown.plainExplanation = ensureStrongPlain(ref, raw, finalBreakdown.plainExplanation);
    finalBreakdown.layman = finalBreakdown.plainExplanation;
    if (useCache) writeCachedBreakdown(ref, group, raw, finalBreakdown);
    return finalBreakdown;
  }

  function personalizeBreakdown(base, ageMode, ref, text) {
    return getBreakdown(ref, text, { group: ageMode, override: base || null });
  }

  function copyText(text, btn, successLabel) {
    var okText = successLabel || 'Copied!';
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (btn) {
          var prev = btn.textContent;
          btn.textContent = okText;
          setTimeout(function () { btn.textContent = prev; }, 1200);
        }
      }).catch(function () {});
    }
  }

  function addToBestNoteField(text, btn) {
    var ids = ['note-input', 'mystudy-notes', 'church-reflection-input', 'church-board-note', 'church-prayer-input'];
    for (var i = 0; i < ids.length; i++) {
      var el = byId(ids[i]);
      if (el && typeof el.value === 'string') {
        el.value = (el.value ? el.value + '\n\n' : '') + text;
        try { el.focus(); } catch (e) {}
        if (btn) {
          var prev = btn.textContent;
          btn.textContent = 'Added';
          setTimeout(function () { btn.textContent = prev; }, 1200);
        }
        return;
      }
    }
    try {
      var existing = String(localStorage.getItem(NOTE_FALLBACK_KEY) || '');
      localStorage.setItem(NOTE_FALLBACK_KEY, (existing ? existing + '\n\n' : '') + text);
    } catch (e2) {}
    copyText(text, btn, 'Note copied!');
  }

  function shareVerse(ref, text, btn) {
    var shareText = (ref ? ref + ' — ' : '') + (text || '') + '\n\n' + 'todaysdailybattle.com';
    if (navigator.share) {
      navigator.share({ title: ref || 'Verse', text: shareText, url: window.location.href }).then(function () {
        if (btn) {
          var prev = btn.textContent;
          btn.textContent = 'Shared';
          setTimeout(function () { btn.textContent = prev; }, 1200);
        }
      }).catch(function () {});
      return;
    }
    copyText(shareText, btn, 'Share copied!');
  }

  function attachPanelScrollAnalytics(root) {
    var panel = root && root.querySelector ? root.querySelector('.tdb-vb-inline-panel') : null;
    if (!panel) return;
    if (root.__tdbVbScrollCleanup) {
      try {
        root.__tdbVbScrollCleanup();
      } catch (eCl) {}
      root.__tdbVbScrollCleanup = null;
    }
    var fired = false;
    function onScroll() {
      if (fired) return;
      if (panel.scrollTop + panel.clientHeight >= panel.scrollHeight * 0.45) {
        fired = true;
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('verse_breakdown_scrolled_50');
        }
        panel.removeEventListener('scroll', onScroll);
        root.__tdbVbScrollCleanup = null;
      }
    }
    panel.addEventListener('scroll', onScroll);
    root.__tdbVbScrollCleanup = function () {
      panel.removeEventListener('scroll', onScroll);
    };
  }

  function setInlineBreakdownOpen(root, open) {
    if (!root || !root.classList) return;
    var wasOpen = root.classList.contains('is-open');
    var toggle = root.querySelector('.tdb-vb-inline-toggle');
    var panel = root.querySelector('.tdb-vb-inline-panel');
    if (open) root.classList.add('is-open');
    else root.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (panel) {
      if (open) {
        panel.removeAttribute('hidden');
        /* Cached / edge-case styles can leave the panel “stuck” invisible while .is-open */
        try {
          panel.style.removeProperty('display');
          panel.style.removeProperty('visibility');
          panel.style.removeProperty('opacity');
        } catch (eP) {}
      } else panel.setAttribute('hidden', '');
    }
    if (open) {
      try {
        root.style.removeProperty('display');
        root.style.removeProperty('visibility');
        root.style.removeProperty('opacity');
      } catch (eR) {}
    }
    if (!open && root.__tdbVbScrollCleanup) {
      try {
        root.__tdbVbScrollCleanup();
      } catch (eC2) {}
      root.__tdbVbScrollCleanup = null;
    }
    if (open && !wasOpen) {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('verse_breakdown_open');
      }
      attachPanelScrollAnalytics(root);
    }
  }

  function buildInlineDetailsElement() {
    inlinePanelUid += 1;
    var uid = inlinePanelUid;
    var details = document.createElement('div');
    details.className = 'tdb-verse-breakdown-inline';
    details.setAttribute('data-tdb-breakdown-inline', '1');

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'tdb-vb-inline-toggle btn btn-secondary';
    toggle.id = 'tdb-vb-toggle-' + uid;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'tdb-vb-panel-' + uid);
    toggle.setAttribute('aria-label', INLINE_SUMMARY_ARIA);
    var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'tdb-vb-inline-toggle-icon');
    icon.setAttribute('width', '18');
    icon.setAttribute('height', '18');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.setAttribute('aria-hidden', 'true');
    var p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p1.setAttribute('d', 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20');
    icon.appendChild(p1);
    var p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p2.setAttribute('d', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z');
    icon.appendChild(p2);
    var p3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    p3.setAttribute('x1', '12');
    p3.setAttribute('y1', '6');
    p3.setAttribute('x2', '12');
    p3.setAttribute('y2', '12');
    icon.appendChild(p3);
    var p4 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    p4.setAttribute('x1', '10');
    p4.setAttribute('y1', '14');
    p4.setAttribute('x2', '14');
    p4.setAttribute('y2', '14');
    icon.appendChild(p4);
    var label = document.createElement('span');
    label.className = 'tdb-vb-inline-toggle-label';
    label.appendChild(document.createTextNode(INLINE_SUMMARY));
    toggle.appendChild(icon);
    toggle.appendChild(label);
    details.appendChild(toggle);

    var panel = document.createElement('div');
    panel.className = 'tdb-vb-inline-panel';
    panel.id = 'tdb-vb-panel-' + uid;
    panel.setAttribute('hidden', '');
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', toggle.id);

    var agePrompt = document.createElement('div');
    agePrompt.className = 'verse-age-prompt tdb-vb-age-prompt hidden';
    var pickP = document.createElement('p');
    pickP.className = 'section-note util-mb-0_5';
    pickP.appendChild(document.createTextNode('Pick your style:'));
    agePrompt.appendChild(pickP);
    var ageActions = document.createElement('div');
    ageActions.className = 'verse-age-actions';
    ['kid', 'teen', 'adult'].forEach(function (age) {
      var ab = document.createElement('button');
      ab.type = 'button';
      ab.className = 'btn btn-secondary';
      ab.setAttribute('data-age', age);
      ab.appendChild(document.createTextNode(age.charAt(0).toUpperCase() + age.slice(1)));
      ageActions.appendChild(ab);
    });
    agePrompt.appendChild(ageActions);
    panel.appendChild(agePrompt);

    var refP = document.createElement('p');
    refP.className = 'big-kjv tdb-vb-inline-ref';
    panel.appendChild(refP);

    var textP = document.createElement('p');
    textP.className = 'verse-body tdb-vb-inline-verse-text section-note';
    textP.setAttribute('aria-live', 'polite');
    panel.appendChild(textP);

    var bubble = document.createElement('div');
    bubble.className = 'tdb-vb-inline-bubble';
    panel.appendChild(bubble);

    var breakdown = document.createElement('div');
    breakdown.className = 'verse-breakdown tdb-vb-inline-breakdown';

    function addBkH4(title, dataBkKey) {
      var h = document.createElement('h4');
      h.appendChild(document.createTextNode(title));
      breakdown.appendChild(h);
      var p = document.createElement('p');
      var span = document.createElement('span');
      span.setAttribute('data-bk', dataBkKey);
      p.appendChild(span);
      breakdown.appendChild(p);
    }

    /* BBE first (simpler Bible English), then optional layman teaching underneath. */
    var bbeHost = document.createElement('div');
    bbeHost.className = 'tdb-vb-bbe-slot';
    bbeHost.setAttribute('data-bbe-slot', '1');
    breakdown.appendChild(bbeHost);

    var layWrap = document.createElement('details');
    layWrap.className = 'tdb-layman-collapse tdb-vb-layman-collapse';
    var laySum = document.createElement('summary');
    laySum.className = 'tdb-layman-collapse__summary';
    laySum.appendChild(document.createTextNode('Simple layman terms'));
    layWrap.appendChild(laySum);
    var layP = document.createElement('p');
    var laySpan = document.createElement('span');
    laySpan.setAttribute('data-bk', 'layman');
    layP.appendChild(laySpan);
    layWrap.appendChild(layP);
    breakdown.appendChild(layWrap);

    addBkH4('Who\'s talking?', 'about');
    addBkH4('Who is He / she talking to?', 'to');

    var relH = document.createElement('h4');
    relH.appendChild(document.createTextNode('How it relates today ('));
    var relYearSpan = document.createElement('span');
    relYearSpan.className = 'tdb-vb-relates-year';
    relYearSpan.setAttribute('aria-label', 'calendar year');
    relH.appendChild(relYearSpan);
    relH.appendChild(document.createTextNode(')'));
    breakdown.appendChild(relH);
    var relP = document.createElement('p');
    var relSpan = document.createElement('span');
    relSpan.setAttribute('data-bk', 'relates');
    relP.appendChild(relSpan);
    breakdown.appendChild(relP);

    addBkH4('How it relates to you right now', 'applies');

    var curriculum = document.createElement('div');
    curriculum.className = 'tdb-vb-curriculum';
    curriculum.setAttribute('data-tdb-vb-curriculum', '1');
    var curH = document.createElement('h4');
    curH.className = 'tdb-vb-curriculum-heading';
    curH.id = 'tdb-vb-curriculum-h-' + uid;
    curH.appendChild(document.createTextNode('Related calm battle plans'));
    var curSoft = document.createElement('p');
    curSoft.className = 'tdb-vb-uog-soft tdb-vb-curriculum-soft';
    curSoft.appendChild(
      document.createTextNode(
        'Today\'s Daily Battle isn\'t a report card—it is Scripture, one faithful passage at a time. When you are ready, these on-site plan doors echo what this verse opens. Kid, teen, and adult only change the wording above; the links stay the same.'
      )
    );
    var curList = document.createElement('ul');
    curList.className = 'tdb-vb-curriculum-list';
    curList.setAttribute('data-tdb-vb-curriculum-list', '1');
    curList.setAttribute('role', 'list');
    curList.setAttribute('aria-labelledby', curH.id);
    curriculum.appendChild(curH);
    curriculum.appendChild(curSoft);
    curriculum.appendChild(curList);
    breakdown.appendChild(curriculum);
    panel.appendChild(breakdown);

    var nextBlk = document.createElement('div');
    nextBlk.className = 'next-step tdb-vb-inline-next-step';
    var stStep = document.createElement('strong');
    stStep.appendChild(document.createTextNode('One small step today:'));
    nextBlk.appendChild(stStep);
    nextBlk.appendChild(document.createTextNode(' '));
    var stepSp = document.createElement('span');
    stepSp.setAttribute('data-bk', 'onestep');
    nextBlk.appendChild(stepSp);
    panel.appendChild(nextBlk);

    var prayBlk = document.createElement('div');
    prayBlk.className = 'prayer-block tdb-vb-inline-prayer-block';
    var prayPwrap = document.createElement('p');
    var praySt = document.createElement('strong');
    praySt.appendChild(document.createTextNode('A simple prayer:'));
    prayPwrap.appendChild(praySt);
    prayPwrap.appendChild(document.createElement('br'));
    var praySp = document.createElement('span');
    praySp.setAttribute('data-bk', 'prayer');
    prayPwrap.appendChild(praySp);
    prayBlk.appendChild(prayPwrap);
    panel.appendChild(prayBlk);

    /* Reflection block — gentle adult "sit with this" questions */
    var std = window.TDB_verseBreakdownStandard;
    if (std && typeof std.buildReflectionBlock === 'function') {
      panel.appendChild(std.buildReflectionBlock());
    }

    var actions = document.createElement('div');
    actions.className = 'tdb-vb-inline-actions';
    [['pray', 'Pray it'], ['note', 'Save'], ['share', 'Share']].forEach(function (pair) {
      var actBtn = document.createElement('button');
      actBtn.type = 'button';
      actBtn.className = 'btn btn-secondary';
      actBtn.setAttribute('data-action', pair[0]);
      actBtn.appendChild(document.createTextNode(pair[1]));
      actions.appendChild(actBtn);
    });
    panel.appendChild(actions);

    var hideBtn = document.createElement('button');
    hideBtn.type = 'button';
    hideBtn.className = 'tdb-vb-inline-hide link-button util-mt-0_75';
    hideBtn.setAttribute('aria-label', 'Collapse verse breakdown');
    hideBtn.appendChild(document.createTextNode('Hide breakdown'));
    panel.appendChild(hideBtn);

    var levelBtn = document.createElement('button');
    levelBtn.type = 'button';
    levelBtn.className = 'tdb-vb-inline-level-btn link-button util-mt-0_5';
    levelBtn.setAttribute('aria-label', 'Choose Kid, Teen, or Adult reading style');
    levelBtn.appendChild(document.createTextNode('Reading level (Kid / Teen / Adult)'));
    levelBtn.addEventListener('click', function () {
      var pr = details.querySelector('.tdb-vb-age-prompt');
      if (pr) {
        pr.classList.remove('hidden');
        try {
          var firstAge = pr.querySelector('.verse-age-actions [data-age]');
          if (firstAge && typeof firstAge.focus === 'function') firstAge.focus();
        } catch (eF) {}
      }
    });
    panel.appendChild(levelBtn);

    details.appendChild(panel);
    return details;
  }

  function wireInlineDetailsEvents(details) {
    if (!details || details.getAttribute('data-tdb-vb-wired') === '1') return;
    details.setAttribute('data-tdb-vb-wired', '1');

    var toggleBtn = details.querySelector('.tdb-vb-inline-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var next = !details.classList.contains('is-open');
        setInlineBreakdownOpen(details, next);
      });
    }

    details.querySelectorAll('.tdb-vb-age-prompt .verse-age-actions [data-age]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = setAgeMode(btn.getAttribute('data-age') || 'adult');
        details.setAttribute('data-age-mode', mode);
        var prompt = details.querySelector('.tdb-vb-age-prompt');
        if (prompt) prompt.classList.add('hidden');
        var r = details.getAttribute('data-ref') || '';
        var t = details.getAttribute('data-text') || '';
        populateInlineDetails(details, r, t);
      });
    });

    details.querySelectorAll('.tdb-vb-inline-actions [data-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-action');
        var ref = details.getAttribute('data-ref') || '';
        var text = details.getAttribute('data-text') || '';
        var layman = details.querySelector('[data-bk="layman"]') ? details.querySelector('[data-bk="layman"]').textContent : '';
        var applies = details.querySelector('[data-bk="applies"]') ? details.querySelector('[data-bk="applies"]').textContent : '';
        if (action === 'pray') {
          var prayer = 'Lord, help me live ' + (applies || layman || 'this verse') + ' today. Amen.';
          copyText(prayer, btn, 'Prayer copied!');
          return;
        }
        if (action === 'note') {
          var noteText = ref + ': ' + text + '\nMeaning: ' + layman;
          addToBestNoteField(noteText, btn);
          return;
        }
        if (action === 'share') {
          shareVerse(ref, text, btn);
        }
      });
    });

    var hideBtn = details.querySelector('.tdb-vb-inline-hide');
    if (hideBtn) {
      hideBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        setInlineBreakdownOpen(details, false);
        try {
          var tg = details.querySelector('.tdb-vb-inline-toggle');
          if (tg && typeof tg.focus === 'function') tg.focus();
        } catch (eH) {}
      });
    }
  }

  function runInlineLazyLoads(details, ref, resolvedText, ageMode, topic) {
    var refKey = tdbPlainTextForUi(ref || '');
    if (!resolvedText && ref) {
      loadBibleDict().then(function () {
        if (details.getAttribute('data-ref') !== refKey) return;
        var lazyText = getBibleVerseText(ref);
        if (!lazyText) return;
        var lazyBreakdown = getBreakdown(ref, lazyText, { group: ageMode, host: details });
        var lazyTextEl = details.querySelector('.tdb-vb-inline-verse-text');
        var lazyLay = details.querySelector('[data-bk="layman"]');
        var lazyApp = details.querySelector('[data-bk="applies"]');
        var lazyRel = details.querySelector('[data-bk="relates"]');
        var stdLz = window.TDB_verseBreakdownStandard;
        if (lazyTextEl) lazyTextEl.textContent = '\u201c' + lazyText + '\u201d';
        if (lazyLay) lazyLay.textContent = tdbPlainTextForUi(lazyBreakdown.layman || '—');
        if (lazyApp || lazyRel) {
          var holdLz =
            'Hold this word as God speaking kindly to you—today, personally—not as a slogan you have to manufacture.';
          var relLazy = lazyBreakdown.relates || buildRelationLine(topic, RELATIONS_FALLBACK);
          var youLazy = resolvePersonalYouFromBreakdown(lazyBreakdown);
          var layLz = tdbPlainTextForUi(lazyBreakdown.layman || '').trim();
          if (youLazy && youLazy === layLz) {
            youLazy = holdLz;
          } else if (!youLazy) {
            youLazy = holdLz;
          }
          try {
            var yrLz = stdLz && typeof stdLz.currentYear === 'function' ? stdLz.currentYear() : new Date().getFullYear();
            if (youLazy === relLazy) {
              relLazy =
                stdLz && typeof stdLz.defaultRelatesTodayLine === 'function'
                  ? stdLz.defaultRelatesTodayLine(yrLz)
                  : 'In ' +
                    yrLz +
                    ', life can feel loud—headlines, hurry, tension. God’s Word here still cuts through as something steady you can carry today.';
            }
          } catch (eLzDedup) { /* non-fatal */ }
          if (lazyApp) lazyApp.textContent = tdbPlainTextForUi(youLazy || '—');
          if (lazyRel) lazyRel.textContent = tdbPlainTextForUi(relLazy);
        }
        details.setAttribute('data-text', lazyText);
        var cl = details.querySelector('[data-tdb-vb-curriculum-list]');
        if (cl) {
          var infl = buildUogInfluenceString(ref, lazyText, lazyBreakdown);
          fillUogCurriculumList(cl, ref, infl);
        }
      });
    }
    loadRelationsDict().then(function (dict) {
      if (details.getAttribute('data-ref') !== refKey) return;
      var relatesEl = details.querySelector('[data-bk="relates"]');
      if (relatesEl && !String(relatesEl.textContent || '').trim()) relatesEl.textContent = buildRelationLine(topic, dict);
      var cl = details.querySelector('[data-tdb-vb-curriculum-list]');
      if (cl) {
        var txt = details.getAttribute('data-text') || '';
        var aBk = details.querySelector('[data-bk="about"]');
        var tBk = details.querySelector('[data-bk="to"]');
        var lBk = details.querySelector('[data-bk="layman"]');
        var pBk = details.querySelector('[data-bk="applies"]');
        var rBk = details.querySelector('[data-bk="relates"]');
        var bd = {
          about: aBk ? aBk.textContent : '',
          to: tBk ? tBk.textContent : '',
          layman: lBk ? lBk.textContent : '',
          applies: pBk ? pBk.textContent : '',
          relates: rBk ? rBk.textContent : ''
        };
        fillUogCurriculumList(cl, ref, buildUogInfluenceString(ref, txt, bd));
      }
    });
  }

  /**
   * Feeds the University of God “related courses” helper: verse + breakdown copy so themes
   * surface even when the KJV line alone is thin (e.g. “Jesus wept”).
   */
  function buildUogInfluenceString(ref, verseText, breakdown) {
    var parts = [String(ref || ''), String(verseText || '')];
    if (breakdown && typeof breakdown === 'object') {
      ['about', 'to', 'layman', 'applies', 'relates'].forEach(function (k) {
        if (breakdown[k]) parts.push(String(breakdown[k]));
      });
    }
    var s = parts.join(' ').replace(/\s+/g, ' ').trim();
    try {
      s = (s + ' ' + getContextNeedle()).replace(/\s+/g, ' ').trim();
    } catch (eCtx) { /* no-op */ }
    if (s.length > 2000) s = s.slice(0, 2000);
    return s;
  }

  function fillUogCurriculumList(curList, ref, influenceText) {
    if (!curList) return;
    while (curList.firstChild) curList.removeChild(curList.firstChild);
    var uog = typeof window.tdbUogBuildCurriculumPlanList === 'function' ? window.tdbUogBuildCurriculumPlanList : null;
    var rows = uog ? uog(ref, influenceText) || [] : [];
    for (var ci = 0; ci < rows.length; ci++) {
      if (!rows[ci] || !rows[ci].href) continue;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = rows[ci].href;
      a.appendChild(document.createTextNode(String(rows[ci].label || rows[ci].href)));
      li.appendChild(a);
      curList.appendChild(li);
    }
    var curriculum = curList.closest && curList.closest('.tdb-vb-curriculum');
    if (curriculum) {
      var has = curList.querySelector('li') !== null;
      if (has) {
        curriculum.removeAttribute('hidden');
      } else {
        curriculum.setAttribute('hidden', '');
      }
    }
  }

  function ensureBbeSlot(details, ref) {
    if (!details || !ref) return;
    var slot = details.querySelector('[data-bbe-slot]');
    if (!slot) return;
    slot.innerHTML = '';
    if (window.TDBBbeSimple && typeof window.TDBBbeSimple.buildDetailsBlock === 'function') {
      try {
        /* Open by default so simpler English leads; layman stays collapsed under it. */
        slot.appendChild(
          window.TDBBbeSimple.buildDetailsBlock(ref, { className: 'tdb-bbe-simple--inline', open: true })
        );
      } catch (eBbe) {}
    }
  }

  function populateInlineDetails(details, ref, text) {
    if (!details) return;
    var refEl = details.querySelector('.tdb-vb-inline-ref');
    var verseTextEl = details.querySelector('.tdb-vb-inline-verse-text');
    var aboutEl = details.querySelector('[data-bk="about"]');
    var toEl = details.querySelector('[data-bk="to"]');
    var layEl = details.querySelector('[data-bk="layman"]');
    var appEl = details.querySelector('[data-bk="applies"]');
    var relEl = details.querySelector('[data-bk="relates"]');
    var stepEl = details.querySelector('[data-bk="onestep"]');
    var prayEl = details.querySelector('[data-bk="prayer"]');
    if (!refEl || !verseTextEl || !aboutEl || !toEl || !layEl || !appEl || !relEl || !stepEl || !prayEl) return;

    /* Do not require Kid/Teen/Adult before showing copy — on first visit the prompt
     * read as “empty” and hid the breakdown. Default gently; age buttons still work after explicit pick. */
    var prompt = details.querySelector('.tdb-vb-age-prompt');
    if (prompt) prompt.classList.add('hidden');
    var ageMode = getAgeMode();
    if (!ageMode) ageMode = inferAgeFromContext() || 'adult';
    details.setAttribute('data-age-mode', ageMode);

    var resolvedText = cleanVerseText(text || '') || getBibleVerseText(ref);
    var breakdown = getBreakdown(ref, resolvedText, { group: ageMode, host: details });
    var topic = inferRelationTopic(ref, resolvedText);
    var stdVB = window.TDB_verseBreakdownStandard;

    if (stdVB && typeof stdVB.fillBigKjvStrong === 'function') {
      stdVB.fillBigKjvStrong(refEl, ref);
    } else {
      refEl.textContent = '';
      var stRf = document.createElement('strong');
      var refLine = tdbPlainTextForUi(ref || '').trim();
      stRf.textContent = refLine ? refLine + ' (KJV)' : '(KJV)';
      refEl.appendChild(stRf);
    }
    verseTextEl.textContent =
      '\u201c' + (resolvedText || 'Loading verse text\u2026') + '\u201d';
    aboutEl.textContent = tdbPlainTextForUi(breakdown.about || '—');
    toEl.textContent = tdbPlainTextForUi(breakdown.to || '—');
    layEl.textContent = tdbPlainTextForUi(breakdown.layman || '—');

    var yrChip = stdVB && typeof stdVB.currentYear === 'function' ? stdVB.currentYear() : new Date().getFullYear();
    try {
      var yrSp0 = details.querySelector('.tdb-vb-relates-year');
      if (yrSp0) yrSp0.textContent = String(yrChip);
    } catch (eYrC) { /* non-fatal */ }

    var holdYouFallback =
      'Hold this word as God speaking kindly to you—today, personally—not as a slogan you have to manufacture.';
    var relDisplayed = breakdown.relates || buildRelationLine(topic, RELATIONS_FALLBACK);
    var personalYou = resolvePersonalYouFromBreakdown(breakdown);
    var layShown = tdbPlainTextForUi(breakdown.layman || '').trim();
    if (personalYou && personalYou === layShown) {
      personalYou = holdYouFallback;
    } else if (!personalYou) {
      personalYou = holdYouFallback;
    }
    try {
      if (personalYou === relDisplayed) {
        relDisplayed =
          stdVB && typeof stdVB.defaultRelatesTodayLine === 'function'
            ? stdVB.defaultRelatesTodayLine(yrChip)
            : 'In ' +
              yrChip +
              ', life can feel loud—headlines, hurry, tension. God’s Word here still cuts through as something steady you can carry today.';
      }
    } catch (eDedup) { /* non-fatal */ }

    appEl.textContent = tdbPlainTextForUi(personalYou || '—');
    relEl.textContent = tdbPlainTextForUi(relDisplayed);

    if (stepEl) {
      var ns =
        stdVB && typeof stdVB.nextStepFallback === 'function'
          ? stdVB.nextStepFallback()
          : 'Read it slowly one more time\u2014then thank God aloud for one true thing inside it before you move.';
      stepEl.textContent = tdbPlainTextForUi(ns);
    }
    if (prayEl) {
      var pr =
        stdVB && typeof stdVB.prayerForRef === 'function'
          ? stdVB.prayerForRef(ref)
          : 'Lord, sink ' +
            (tdbPlainTextForUi(ref) || 'this verse') +
            ' into my heart\u2014not as noise, but as truth that changes how I walk. In Jesus\u2019 name, Amen.';
      prayEl.textContent = tdbPlainTextForUi(pr);
    }

    var curList = details.querySelector('[data-tdb-vb-curriculum-list]');
    var uogInfluence = buildUogInfluenceString(ref, resolvedText, breakdown);
    fillUogCurriculumList(curList, ref, uogInfluence);

    ensureBbeSlot(details, ref);

    details.setAttribute('data-ref', tdbPlainTextForUi(ref || ''));
    details.setAttribute('data-text', resolvedText || '');

    var bubble = details.querySelector('.tdb-vb-inline-bubble');
    if (bubble) {
      bubble.textContent = tdbPlainTextForUi(breakdown.bubbleTitle || 'Plain') + (breakdown.bubbleEmoji ? (' ' + breakdown.bubbleEmoji) : '');
      bubble.className = 'tdb-vb-inline-bubble tdb-vb-inline-bubble-' + ageMode;
    }

    runInlineLazyLoads(details, ref, resolvedText, ageMode, topic);
  }

  function removeLegacyVerseModal() {
    var modal = byId('tdb-verse-breakdown-modal');
    if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
  }

  function findExistingInline(host) {
    if (!host) return null;
    if (host.id === 'lookup-result') {
      return host.querySelector('.tdb-verse-breakdown-inline');
    }
    if (host.classList && host.classList.contains('context-line')) {
      return host.querySelector(':scope > .tdb-verse-breakdown-inline');
    }
    return host.querySelector('.tdb-verse-breakdown-inline');
  }

  function getInsertionPoint(host) {
    if (!host) return null;

    if (host.classList && host.classList.contains('context-line')) {
      var firstTool = host.querySelector('.reader-verse-xref-btn, .reader-verse-wordstudy-btn');
      return { parent: host, before: firstTool || null };
    }

    if (host.querySelector('#daily-ref') && host.querySelector('#daily-text')) {
      var dtp = host.querySelector('#daily-text');
      if (dtp && dtp.parentNode === host) {
        return { parent: host, before: dtp.nextSibling };
      }
    }

    if (host.id === 'church-daily-verse-card') {
      var ctv = host.querySelector('#church-daily-verse-text');
      if (ctv && ctv.parentNode === host) {
        return { parent: host, before: ctv.nextSibling };
      }
    }

    if (host.querySelector('#church-daily-ref') && host.querySelector('#church-daily-text')) {
      var ctp = host.querySelector('#church-daily-text');
      if (ctp && ctp.parentNode === host) {
        return { parent: host, before: ctp.nextSibling };
      }
    }

    if (host.id === 'tdb-cartoon-verse-host') {
      var kov = host.querySelector('#tdb-kjv-overlay');
      if (kov && kov.parentNode === host) {
        return { parent: host, before: kov.nextSibling };
      }
    }

    if (host.id === 'lookup-result') {
      var lt = host.querySelector('#lookup-text');
      if (lt && lt.parentNode) {
        return { parent: lt.parentNode, before: lt.nextSibling };
      }
    }

    if (host.id === 'daily-verse-card') {
      var bq = host.querySelector('blockquote.daily-verse-body');
      if (bq && bq.parentNode === host) {
        return { parent: host, before: bq.nextSibling };
      }
      var dt = host.querySelector('#daily-verse-text');
      if (dt && dt.parentNode) {
        return { parent: dt.parentNode, before: dt.nextSibling };
      }
    }

    if (host.id === 'verseCard') {
      var row = host.querySelector('.verse-ref-row');
      if (row && row.parentNode === host) {
        return { parent: host, before: row.nextSibling };
      }
    }

    if (host.id === 'verse-container' || host.id === 'desktop-verse') {
      var bqCalm = host.querySelector('blockquote.daily-verse-body');
      if (bqCalm && bqCalm.parentNode === host) {
        return { parent: host, before: bqCalm.nextSibling };
      }
      var vt = host.querySelector('#verse-text, #desktop-verse-text');
      if (vt && vt.parentNode) {
        return { parent: vt.parentNode, before: vt.nextSibling };
      }
    }

    if (host.classList && host.classList.contains('mystudy-verse-card')) {
      var mt = host.querySelector('#mystudy-verse-text');
      if (mt && mt.parentNode === host) {
        return { parent: host, before: mt.nextSibling };
      }
    }

    if (host.id === 'mystudy-highlight-detail') {
      var ht = host.querySelector('#mystudy-highlight-text');
      if (ht && ht.parentNode === host) {
        return { parent: host, before: ht.nextSibling };
      }
    }

    if (host.classList && host.classList.contains('mystudy-result')) {
      var preview = host.querySelector('p.section-note');
      if (preview && preview.parentNode === host) {
        return { parent: host, before: preview.nextSibling };
      }
    }

    if (host.classList && /\bverse-item\b/.test(host.className)) {
      var vip = host.querySelector(':scope > strong + p') || host.querySelector(':scope > p');
      if (vip && vip.parentNode === host) {
        return { parent: host, before: vip.nextSibling };
      }
    }

    var verseP = host.querySelector('.verse-card > p');
    if (verseP && verseP.parentNode) {
      return { parent: verseP.parentNode, before: verseP.nextSibling };
    }

    var fallback = host.querySelector('.verse-text, .smart-verse, .concordance-verse-text, .verse-maps-verse-text, blockquote');
    if (fallback && fallback.parentNode) {
      return { parent: fallback.parentNode, before: fallback.nextSibling };
    }

    return { parent: host, before: null };
  }

  function injectInlineBreakdown(host, ref, text) {
    if (!host || !ref || !text) return;
    if (shouldSkipVerseBreakdownHost(host)) return;
    var existing = findExistingInline(host);
    if (existing) {
      wireInlineDetailsEvents(existing);
      populateInlineDetails(existing, ref, text);
      setInlineBreakdownOpen(existing, true);
      try {
        requestAnimationFrame(function () {
          setInlineBreakdownOpen(existing, true);
        });
      } catch (eRaf) {}
      return;
    }

    var pt = getInsertionPoint(host);
    if (!pt || !pt.parent) return;

    var details = buildInlineDetailsElement();
    wireInlineDetailsEvents(details);
    populateInlineDetails(details, ref, text);

    if (pt.before) {
      pt.parent.insertBefore(details, pt.before);
    } else {
      pt.parent.appendChild(details);
    }
    setInlineBreakdownOpen(details, true);
    try {
      requestAnimationFrame(function () {
        setInlineBreakdownOpen(details, true);
      });
    } catch (eRaf2) {}
  }

  function open(ref, text) {
    var normalizedRef = tdbPlainTextForUi(ref || '');
    var list = document.querySelectorAll('.tdb-verse-breakdown-inline[data-ref]');
    for (var i = 0; i < list.length; i++) {
      if (list[i].getAttribute('data-ref') === normalizedRef) {
        setInlineBreakdownOpen(list[i], true);
        try {
          list[i].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (e) {}
        if (text) populateInlineDetails(list[i], ref, text);
        return;
      }
    }
  }

  function shouldSkipVerseBreakdownHost(el) {
    if (!el || typeof el.closest !== 'function') return true;
    try {
      var path = String((window.location && window.location.pathname) || '').toLowerCase();
      if (path.indexOf('coloring.html') !== -1) return true;
    } catch (e0) {}
    if (el.closest('#tdb-cat-root')) return true;
    if (el.closest('[data-tdb-no-verse-breakdown="1"]')) return true;
    if (el.classList && el.classList.contains('tdb-verse-breakdown-inline')) return true;
    if (el.closest('.tdb-verse-breakdown-inline')) return true;
    return false;
  }

  function addButton(container, ref, text) {
    if (!container || !ref || !text) return;
    var host = container;
    if (typeof container.closest === 'function') {
      var c = container.closest('#daily-verse-card, #verseCard, #lookup-result, #verse-container, #desktop-verse, .mystudy-verse-card, #mystudy-highlight-detail, .mystudy-result, .verse-card, .context-line, .smart-card, .verse-item');
      if (c) host = c;
    }
    injectInlineBreakdown(host, ref, text);
  }

  function snippetFromContextLine(line) {
    if (!line || !line.cloneNode) return '';
    try {
      var clone = line.cloneNode(true);
      var kill = clone.querySelectorAll('.reader-verse-xref-btn, .reader-verse-wordstudy-btn, .tdb-breakdown-btn, .tdb-verse-breakdown-inline');
      for (var i = 0; i < kill.length; i++) {
        var n = kill[i];
        if (n.parentNode) n.parentNode.removeChild(n);
      }
      var st = clone.querySelector('strong');
      if (st && st.parentNode) st.parentNode.removeChild(st);
      return cleanVerseText(clone.textContent || '');
    } catch (e) {
      return '';
    }
  }

  function extractRefFromText(text) {
    var s = String(text || '').replace(/\s+/g, ' ').trim();
    if (!s) return '';
    var m = s.match(/\b([1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+){0,3}\s+\d+:\d+(?:-\d+)?)\b/);
    return m ? m[1].replace(/\s+/g, ' ').trim() : '';
  }

  function cleanVerseText(text) {
    return tdbPlainTextForUi(String(text || '').replace(/\s+/g, ' ').trim());
  }

  function resolveRangeVerseText(ref, dict) {
    var normalized = normalizeRef(ref);
    var rangeMatch = normalized.match(/^(.+?)\s+(\d+):(\d+)-(?:(\d+):)?(\d+)$/);
    if (!rangeMatch || !dict) return '';
    var book = rangeMatch[1];
    var startChapter = parseInt(rangeMatch[2], 10);
    var startVerse = parseInt(rangeMatch[3], 10);
    var endChapter = parseInt(rangeMatch[4] || rangeMatch[2], 10);
    var endVerse = parseInt(rangeMatch[5], 10);
    if (!book || !startChapter || !startVerse || !endChapter || !endVerse || endChapter < startChapter) return '';
    var parts = [];
    for (var chapter = startChapter; chapter <= endChapter; chapter++) {
      var verseStart = chapter === startChapter ? startVerse : 1;
      var verseEnd = chapter === endChapter ? endVerse : 300;
      for (var verse = verseStart; verse <= verseEnd; verse++) {
        var key = book + ' ' + chapter + ':' + verse;
        if (!dict[key]) {
          if (verse === verseStart) return '';
          break;
        }
        parts.push(dict[key]);
        if (chapter === endChapter && verse === endVerse) return cleanVerseText(parts.join(' '));
      }
    }
    return cleanVerseText(parts.join(' '));
  }

  function getBibleVerseText(ref) {
    var r = String(ref || '').trim();
    if (!r) return '';
    var key = normalizeRef(r);
    var direct = (window.bible && (window.bible[r] || window.bible[key])) || (window.kjvData && (window.kjvData[r] || window.kjvData[key])) || '';
    if (direct) return cleanVerseText(direct);
    var ranged = resolveRangeVerseText(r, window.bible || window.kjvData || null);
    if (ranged) return ranged;
    if (typeof window.getBibleVerseText === 'function') {
      try { return cleanVerseText(window.getBibleVerseText(r) || ''); } catch (e) {}
    }
    return '';
  }

  function loadBibleDict() {
    if (bibleDictPromise) return bibleDictPromise;
    bibleDictPromise = (async function () {
      for (var i = 0; i < KJV_DICT_URLS.length; i++) {
        try {
          var res = await fetch(KJV_DICT_URLS[i], { cache: 'force-cache' });
          if (!res.ok) throw new Error('status_' + res.status);
          var json = await res.json();
          if (Array.isArray(json)) {
            var mapped = {};
            json.forEach(function (entry) {
              if (!entry || !entry.ref || !entry.text) return;
              mapped[normalizeRef(entry.ref)] = tdbPlainTextForUi(entry.text);
            });
            window.kjvData = mapped;
            return mapped;
          }
          if (json && typeof json === 'object') {
            window.kjvData = json;
            return json;
          }
        } catch (e) {}
      }
      return {};
    })();
    return bibleDictPromise;
  }

  function extractRefAndText(container) {
    if (!container) return { ref: '', text: '' };

    var dref = container.querySelector && container.querySelector('#daily-ref');
    var dtxt = container.querySelector && container.querySelector('#daily-text');
    if (dref && dtxt) {
      var rD = extractRefFromText(String(dref.textContent || '')) || cleanVerseText(dref.textContent || '');
      var tD = cleanVerseText(dtxt.textContent || '');
      if (!tD && rD) tD = getBibleVerseText(rD);
      if (rD && tD) return { ref: rD, text: tD };
    }

    if (container.id === 'church-daily-verse-card') {
      var cvr = container.querySelector('#church-daily-verse-ref');
      var cvt = container.querySelector('#church-daily-verse-text');
      if (cvr && cvt) {
        var rV = extractRefFromText(String(cvr.textContent || '')) || cleanVerseText(cvr.textContent || '');
        var tV = cleanVerseText(cvt.textContent || '');
        if (!tV && rV) tV = getBibleVerseText(rV);
        if (rV && tV) return { ref: rV, text: tV };
      }
    }

    var cref = container.querySelector && container.querySelector('#church-daily-ref');
    var ctxt = container.querySelector && container.querySelector('#church-daily-text');
    if (cref && ctxt) {
      var rC = extractRefFromText(String(cref.textContent || '')) || cleanVerseText(cref.textContent || '');
      var tC = cleanVerseText(ctxt.textContent || '');
      if (/loading/i.test(rC) || /loading/i.test(tC)) return { ref: '', text: '' };
      if (!tC && rC) tC = getBibleVerseText(rC);
      if (rC && tC) return { ref: rC, text: tC };
    }

    if (container.id === 'tdb-cartoon-verse-host') {
      var rCart = cleanVerseText(container.getAttribute('data-ref') || '');
      var tCart = cleanVerseText(container.getAttribute('data-text') || '');
      var rCartOk = extractRefFromText(rCart) || rCart;
      if (!tCart && rCartOk) tCart = getBibleVerseText(rCartOk);
      if (rCartOk && tCart) return { ref: rCartOk, text: tCart };
    }

    if (container.classList && container.classList.contains('context-line')) {
      var attrRef = String(container.getAttribute('data-ref') || '').trim();
      var refLine = cleanVerseText(attrRef);
      var refOk = extractRefFromText(refLine) || refLine;
      if (!refOk) {
        var st0 = container.querySelector('strong');
        var rawStrong = st0 ? String(st0.textContent || '').trim() : '';
        refOk = extractRefFromText(rawStrong) || cleanVerseText(rawStrong);
      }
      var textLine = snippetFromContextLine(container);
      if (!textLine && refOk) textLine = getBibleVerseText(refOk);
      if (refOk && textLine) return { ref: refOk, text: textLine };
    }

    if (container.id === 'lookup-result') {
      var lr = byId('lookup-ref');
      var lt = byId('lookup-text');
      var rL = lr ? cleanVerseText(lr.textContent || '') : '';
      var tL = lt ? cleanVerseText(lt.textContent || '') : '';
      var rOk = extractRefFromText(rL) || rL;
      if (!tL && rOk) tL = getBibleVerseText(rOk);
      if (rOk && tL) return { ref: rOk, text: tL };
    }

    if (container.classList && container.classList.contains('mystudy-verse-card')) {
      var mr = container.querySelector('#mystudy-verse-ref');
      var mt = container.querySelector('#mystudy-verse-text');
      var mRefRaw = mr ? String(mr.textContent || '').replace(/\s+/g, ' ').trim() : '';
      if (/nothing here yet/i.test(mRefRaw)) return { ref: '', text: '' };
      var mTextRaw = mt ? String(mt.textContent || '').replace(/\s+/g, ' ').trim() : '';
      var mRefOk = extractRefFromText(mRefRaw) || cleanVerseText(mRefRaw);
      var mTextOk = cleanVerseText(mTextRaw);
      if (!mTextOk && mRefOk) mTextOk = getBibleVerseText(mRefOk);
      if (mRefOk && mTextOk) return { ref: mRefOk, text: mTextOk };
    }

    if (container.id === 'mystudy-highlight-detail') {
      var hr = byId('mystudy-highlight-ref');
      var ht = byId('mystudy-highlight-text');
      var hRefRaw = hr ? String(hr.textContent || '').replace(/\s+/g, ' ').trim() : '';
      if (!hRefRaw) return { ref: '', text: '' };
      var hTextRaw = ht ? String(ht.textContent || '').replace(/\s+/g, ' ').trim() : '';
      var hRefOk = extractRefFromText(hRefRaw) || cleanVerseText(hRefRaw);
      var hTextOk = cleanVerseText(hTextRaw);
      if (!hTextOk && hRefOk) hTextOk = getBibleVerseText(hRefOk);
      if (hRefOk && hTextOk) return { ref: hRefOk, text: hTextOk };
    }

    if (typeof window.tdbGetDailyVerseRefFromCard === 'function' && typeof window.tdbGetDailyVerseTextFromCard === 'function') {
      var tRef = window.tdbGetDailyVerseRefFromCard(container);
      var tText = window.tdbGetDailyVerseTextFromCard(container);
      var refC = cleanVerseText(tRef);
      var textC = cleanVerseText(tText);
      var refCard = extractRefFromText(refC) || refC;
      if (!textC && refCard) textC = getBibleVerseText(refCard);
      if (refCard && textC) return { ref: refCard, text: textC };
    }

    var ref = String(
      container.getAttribute('data-ref') ||
      container.getAttribute('data-verse-ref') ||
      ''
    ).trim();
    if (!ref) {
      var refNode = container.querySelector('.verse-ref, .daily-verse-ref, .smart-ref, .kids-verse-ref, .concordance-verse-ref, .verse-maps-verse-ref, #family-daily-verse-ref, #family-armor-hero-ref, #kids-daily-verse-ref, #little-ones-verse-ref, #pastor-daily-verse-ref');
      if (refNode) ref = extractRefFromText(refNode.textContent || '');
    }
    if (!ref) {
      var dr = container.querySelector('#daily-verse-ref');
      if (dr) ref = extractRefFromText(dr.textContent || '');
    }
    if (!ref) {
      var strong = container.querySelector('strong');
      if (strong) ref = extractRefFromText(strong.textContent || '');
    }
    if (!ref) ref = extractRefFromText(container.textContent || '');

    var text = String(
      container.getAttribute('data-text') ||
      container.getAttribute('data-verse-text') ||
      ''
    ).trim();
    if (!text) {
      var textNode = container.querySelector('.verse-text, .daily-verse-text, .smart-verse, .kids-verse-text, .concordance-verse-text, .verse-maps-verse-text, #verse-text, #desktop-verse-text, #family-daily-verse-text, #family-armor-hero-text, #kids-daily-verse-text, #little-ones-verse-text, #pastor-daily-verse-text');
      if (textNode) text = cleanVerseText(textNode.textContent || '');
    }
    if (!text) {
      var dt = container.querySelector('#daily-verse-text');
      if (dt) text = cleanVerseText(dt.textContent || '');
    }
    if (!text) {
      var hv = container.querySelector('#heroVerse');
      if (hv) {
        text = String(hv.textContent || '').replace(/^[\s"\u201c]+|[\s"\u201d]+$/g, '').replace(/\s+/g, ' ').trim();
        text = cleanVerseText(text);
      }
    }
    if (!text) {
      var p = container.querySelector('p');
      if (p) text = cleanVerseText(p.textContent || '');
    }
    if (!text && ref) text = getBibleVerseText(ref);
    return { ref: cleanVerseText(ref), text: cleanVerseText(text) };
  }

  function enhanceVerseContainers(root) {
    var host = root && root.querySelectorAll ? root : document;
    /* IDs before .verse-card so #daily-verse-card is not consumed first as a generic .verse-card */
    var selectors = [
      '#daily-verse-card',
      '#daily-battle-card',
      '#family-daily-verse-root',
      '#kids-daily-verse-card',
      '#pastor-daily-verse-card',
      '#church-daily-verse-card',
      '#tdb-cartoon-verse-host',
      'article.church-board-card',
      '.bible-hub-verse-card',
      '.church-verse-card',
      '.family-verse-card',
      '.kids-daily-verse-card',
      '#concordance-verse-card',
      '#verse-maps-verse-card',
      '#verseCard',
      '#verse-container',
      '#desktop-verse',
      '#lookup-result',
      '#mystudy-highlight-detail',
      '.verse-card',
      '.smart-card',
      '.verse-item',
      '.ab-card',
      '.curriculum-verse',
      '.kids-battle-verse',
      '.bible-study-verse-card',
      '.verse-of-week-panel',
      '.verse-maps-verse-item',
      '.concordance-ref-item',
      '.context-line',
      '.mystudy-result'
    ];
    var seen = new Set();
    selectors.forEach(function (sel) {
      host.querySelectorAll(sel).forEach(function (el) {
        if (!el || seen.has(el)) return;
        seen.add(el);
        if (shouldSkipVerseBreakdownHost(el)) return;
        if (el.classList && el.classList.contains('daily-battle-loading')) return;
        /* Homepage #verseCard: rich panels (#heroBreakdownPanels) already explain the calendar verse; skip second “Break it down” UI. */
        if (el.id === 'verseCard') {
          try {
            var pHome = String((window.location && window.location.pathname) || '');
            if (pHome === '/' || /\/index\.html?$/i.test(pHome)) return;
          } catch (eHome) {}
        }
        var pair = extractRefAndText(el);
        if (!pair.ref || !pair.text) {
          el.removeAttribute('data-tdb-breakdown-missing');
          el.removeAttribute('data-tdb-breakdown-attached');
          return;
        }
        injectInlineBreakdown(el, pair.ref, pair.text);
        if (findExistingInline(el)) {
          el.removeAttribute('data-tdb-breakdown-missing');
          el.setAttribute('data-tdb-breakdown-attached', '1');
        } else {
          el.setAttribute('data-tdb-breakdown-missing', '1');
        }
      });
    });
  }

  function getMissingVisibleBreakdowns(root) {
    var host = root && root.querySelectorAll ? root : document;
    var out = [];
    host.querySelectorAll('[data-tdb-breakdown-missing="1"]').forEach(function (el) {
      var pair = extractRefAndText(el);
      out.push({
        ref: pair && pair.ref ? pair.ref : '',
        id: el.id || '',
        className: el.className || ''
      });
    });
    return out;
  }

  function countMissingVisibleBreakdowns(root) {
    return getMissingVisibleBreakdowns(root).length;
  }

  function openLegacyVerseBreakdownDetails(root) {
    var host = root && root.querySelectorAll ? root : document;
    var list = host.querySelectorAll('details.verse-breakdown');
    for (var i = 0; i < list.length; i++) {
      try {
        list[i].open = true;
      } catch (e) {}
    }
  }

  function assertInlineBreakdownPanelsVisible(root) {
    var host = root && root.querySelectorAll ? root : document;
    host.querySelectorAll('.tdb-verse-breakdown-inline.is-open').forEach(function (el) {
      var panel = el.querySelector('.tdb-vb-inline-panel');
      if (panel && panel.hasAttribute('hidden')) setInlineBreakdownOpen(el, true);
    });
  }

  function scheduleBreakdownUiRecovery() {
    /* Double rAF: run after layout/paint so we don’t fight other writers; only fixes stuck state. */
    try {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          openLegacyVerseBreakdownDetails(document);
          assertInlineBreakdownPanelsVisible(document);
          document.querySelectorAll('.tdb-verse-breakdown-inline.is-open .tdb-vb-inline-panel[hidden]').forEach(function (p) {
            var r = p.closest('.tdb-verse-breakdown-inline');
            if (r) setInlineBreakdownOpen(r, true);
          });
        });
      });
    } catch (e) {}
  }

  function runVerseBreakdownEnhancePass() {
    removeLegacyVerseBreakdownUi(document);
    enhanceVerseContainers(document);
    openLegacyVerseBreakdownDetails(document);
    assertInlineBreakdownPanelsVisible(document);
    scheduleBreakdownUiRecovery();
  }

  function wireAutoEnhance() {
    if (window.__tdbVerseBreakdownAutoEnhanced) return;
    window.__tdbVerseBreakdownAutoEnhanced = true;
    runVerseBreakdownEnhancePass();
    window.addEventListener('load', function () {
      runVerseBreakdownEnhancePass();
    });
    window.addEventListener('tdb-daily-verse-updated', function () {
      runVerseBreakdownEnhancePass();
    });
    window.addEventListener('tdb-calm-verse-updated', function () {
      runVerseBreakdownEnhancePass();
    });
    if (!document.body || typeof MutationObserver !== 'function') return;
    var queued = false;
    var observer = new MutationObserver(function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        runVerseBreakdownEnhancePass();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function removeLegacyVerseBreakdownUi(root) {
    removeLegacyVerseModal();
    var host = root && root.querySelectorAll ? root : document;
    host.querySelectorAll('.tdb-breakdown-btn').forEach(function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    ['breakdown-lookup', 'breakdown-daily', 'mystudy-breakdown-selected', 'mystudy-breakdown-highlight', 'church-daily-breakdown'].forEach(function (id) {
      /* IDs removed from HTML over time; safe if absent */
      var el = byId(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    host.querySelectorAll('button[data-role="breakdown"]').forEach(function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
  }

  window.__tdbRegisterVerseBreakdownSeedData = registerSeedData;
  if (window.TDB_VERSE_BREAKDOWN_DATA) {
    registerSeedData(window.TDB_VERSE_BREAKDOWN_DATA);
  }
  if (window.TDB_VERSE_BREAKDOWN_OVERRIDES) {
    registerOverrides(window.TDB_VERSE_BREAKDOWN_OVERRIDES);
  }
  if (!window.TDB_VERSE_BREAKDOWN_DATA) {
    ensureOverrideSeedScript();
  }

  window.TDBVerseBreakdown = {
    open: open,
    getBreakdown: getBreakdown,
    registerOverrides: registerOverrides,
    registerSeedData: registerSeedData,
    addButton: addButton,
    injectInlineBreakdown: injectInlineBreakdown,
    populateInlineDetails: populateInlineDetails,
    enhanceVisibleVerseContainers: enhanceVerseContainers,
    getMissingVisibleBreakdowns: getMissingVisibleBreakdowns,
    countMissingVisibleBreakdowns: countMissingVisibleBreakdowns,
    getAgeMode: getAgeMode,
    setAgeMode: setAgeMode
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireAutoEnhance);
  else wireAutoEnhance();
})();
