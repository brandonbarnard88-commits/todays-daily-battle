(function () {
  'use strict';

  var BOOK_CONTEXT = {
    Genesis: { s: 'Moses', a: 'Israel' }, Exodus: { s: 'Moses', a: 'Israel' }, Leviticus: { s: 'Moses', a: 'Israel' }, Numbers: { s: 'Moses', a: 'Israel' }, Deuteronomy: { s: 'Moses', a: 'Israel' },
    Joshua: { s: 'Joshua', a: 'Israel' }, Judges: { s: 'Unknown', a: 'Israel' }, Ruth: { s: 'Unknown', a: 'Israel' },
    '1 Samuel': { s: 'Samuel', a: 'Israel' }, '2 Samuel': { s: 'Nathan', a: 'Israel' }, '1 Kings': { s: 'Unknown', a: 'Israel' }, '2 Kings': { s: 'Unknown', a: 'Israel' },
    '1 Chronicles': { s: 'Chronicler', a: 'Exiles' }, '2 Chronicles': { s: 'Chronicler', a: 'Exiles' }, Ezra: { s: 'Ezra', a: 'Exiles' }, Nehemiah: { s: 'Nehemiah', a: 'Exiles' }, Esther: { s: 'Unknown', a: 'Israel' },
    Job: { s: 'Job and the Lord', a: 'All' }, Psalm: { s: 'A named voice in the Psalms — David, Asaph, Moses, or Israel’s worship', a: 'Everyone hurting or thankful' }, Psalms: { s: 'A named voice in the Psalms — David, Asaph, Moses, or Israel’s worship', a: 'Everyone hurting or thankful' },
    Proverbs: { s: 'Solomon giving wisdom', a: 'Everyone seeking guidance' }, Ecclesiastes: { s: 'Solomon', a: 'All' }, 'Song of Solomon': { s: 'Solomon', a: 'All' },
    Isaiah: { s: 'Isaiah', a: 'Judah' }, Jeremiah: { s: 'Jeremiah', a: 'Judah and the exiles' }, Lamentations: { s: 'Jeremiah', a: 'Exiles' }, Ezekiel: { s: 'Ezekiel', a: 'Exiles' }, Daniel: { s: 'Daniel', a: 'Exiles' },
    Hosea: { s: 'Hosea', a: 'Israel' }, Joel: { s: 'Joel', a: 'Judah' }, Amos: { s: 'Amos', a: 'Israel' }, Obadiah: { s: 'Obadiah', a: 'Edom' }, Jonah: { s: 'Jonah', a: 'Nineveh' }, Micah: { s: 'Micah', a: 'Judah' }, Nahum: { s: 'Nahum', a: 'Nineveh' }, Habakkuk: { s: 'Habakkuk', a: 'Judah' }, Zephaniah: { s: 'Zephaniah', a: 'Judah' }, Haggai: { s: 'Haggai', a: 'Exiles' }, Zechariah: { s: 'Zechariah', a: 'Exiles' }, Malachi: { s: 'Malachi', a: 'Israel' },
    Matthew: { s: 'Jesus', a: 'Believers' }, Mark: { s: 'Jesus', a: 'Believers' }, Luke: { s: 'Jesus', a: 'Believers' }, John: { s: 'Jesus', a: 'Believers' }, Acts: { s: 'Luke', a: 'Church' },
    Romans: { s: 'Paul', a: 'Rome' }, '1 Corinthians': { s: 'Paul', a: 'Corinth' }, '2 Corinthians': { s: 'Paul', a: 'Corinth' }, Galatians: { s: 'Paul', a: 'Galatia' }, Ephesians: { s: 'Paul', a: 'Ephesus' }, Philippians: { s: 'Paul', a: 'Philippi' }, Colossians: { s: 'Paul', a: 'Colosse' }, '1 Thessalonians': { s: 'Paul', a: 'Thessalonica' }, '2 Thessalonians': { s: 'Paul', a: 'Thessalonica' }, '1 Timothy': { s: 'Paul', a: 'Timothy' }, '2 Timothy': { s: 'Paul', a: 'Timothy' }, Titus: { s: 'Paul', a: 'Titus' }, Philemon: { s: 'Paul', a: 'Philemon' }, Hebrews: { s: 'Unknown', a: 'Hebrew believers' }, James: { s: 'James', a: 'Believers' }, '1 Peter': { s: 'Peter', a: 'Believers' }, '2 Peter': { s: 'Peter', a: 'Believers' }, '1 John': { s: 'John', a: 'Believers' }, '2 John': { s: 'John', a: 'Believers' }, '3 John': { s: 'John', a: 'Gaius' }, Jude: { s: 'Jude', a: 'Believers' }, Revelation: { s: 'John', a: 'Seven churches' }
  };

  var ARCHAIC = {
    careful: 'worried', beseech: 'ask', supplication: 'prayer', thee: 'you', thou: 'you', thy: 'your', thine: 'yours', ye: 'you',
    hath: 'has', hast: 'have', doth: 'does', dost: 'do', shalt: 'shall', wilt: 'will', art: 'are',
    believeth: 'believes', loveth: 'loves', giveth: 'gives', knoweth: 'knows', maketh: 'makes',
    strengtheneth: 'strengthens', keepeth: 'keeps', worketh: 'works', cometh: 'comes', goeth: 'goes',
    seeth: 'sees', heareth: 'hears', doeth: 'does', dwelleth: 'lives', abideth: 'stays',
    unto: 'to', saith: 'says', spake: 'spoke', shew: 'show', shewed: 'showed', sheweth: 'shows',
    begotten: 'only', perish: 'be lost', everlasting: 'eternal', labour: 'work', laden: 'burdened',
    dismayed: 'discouraged', whosoever: 'whoever', whatsoever: 'whatever', verily: 'truly', behold: 'look',
    passeth: 'passes', brethren: 'brothers and sisters', mount: 'rise', faint: 'give up', nigh: 'near',
    charity: 'love', saviour: 'Savior', honour: 'honor', favour: 'favor', neighbour: 'neighbor',
    canst: 'can', mayest: 'may', shouldest: 'should', wouldest: 'would', didst: 'did', wast: 'were'
  };
  var AGE_KEY = 'tdb_age_mode_v1';
  var NOTE_FALLBACK_KEY = 'tdb_breakdown_notes_v1';
  /* v11: relates/applies must stay this verse, not leftover conversation stamps */
  var BREAKDOWN_CACHE_PREFIX = 'tdb_vb_cache_v11::';
  var BREAKDOWN_BOOK_PACKS = {};
  var BREAKDOWN_BOOK_LOADING = {};
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

  function isLeftoverLookupPlain(p) {
    var t = tdbPlainTextForUi(p || '');
    if (!t) return false;
    if (/this verse records:\s*(to|unto)\s+\S.{0,40}\bsaying\b/i.test(t)) return true;
    if (/In everyday English, this verse records:\s*to Moses, saying/i.test(t)) return true;
    if (/this verse still says:\s*[“"']/i.test(t)) return true;
    if (/still speaks into the hour you are in/i.test(t)) return true;
    if (/Sit with one phrase from this verse before you move on/i.test(t)) return true;
    if (/life can feel loud/i.test(t)) return true;
    if (/set the pace of your next conversation/i.test(t)) return true;
    if (/Name one true phrase in this verse/i.test(t)) return true;
    if (/Even when today feels thin/i.test(t)) return true;
    if (/Hold this word as God speaking kindly to you/i.test(t)) return true;
    if (/quiet promise that lasts longer than the feeling/i.test(t)) return true;
    if (/platforms make people look tall/i.test(t)) return true;
    if (/screen look taller than God/i.test(t)) return true;
    if (/ones filling your screen/i.test(t)) return true;
    if (/\bIn 2026\b/i.test(t)) return true;
    return false;
  }

  function isIncompleteFragment(plain, verseText) {
    var strip = function (s) {
      return tdbPlainTextForUi(s || '')
        .replace(/^\s*In everyday English, this verse records:\s*/i, '')
        .replace(/^\s*Here is the point of this verse:\s*/i, '')
        .replace(/^\s*This verse is saying:\s*/i, '')
        .replace(/^\s*In everyday English:\s*/i, '')
        .replace(/\s+/g, ' ')
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
    if (!v) return false;
    if (p === v) return false;
    var pWords = p.split(' ').filter(Boolean);
    var vWords = v.split(' ').filter(Boolean);
    if (v.indexOf(p) !== -1 && p.length < v.length * 0.85 && pWords.length < vWords.length) return true;
    if (vWords.length >= 6 && pWords.length >= 2 && pWords.length <= Math.max(3, Math.floor(vWords.length * 0.45))) {
      var vSet = {};
      vWords.forEach(function (w) { vSet[w] = true; });
      var hit = 0;
      pWords.forEach(function (w) { if (vSet[w]) hit += 1; });
      if (hit / pWords.length >= 0.9) return true;
    }
    return false;
  }

  function modernizeKjvInline(text) {
    var out = String(text || '').replace(/\s+/g, ' ').trim();
    if (!out) return '';
    var pairs = [
      [/Holy Ghost/gi, 'Holy Spirit'],
      [/\bThere hath no\b/gi, 'No'],
      [/\bwill not suffer you to be\b/gi, 'will not let you be'],
      [/\bshall not want\b/gi, 'will not lack what I need'],
      [/\bbe careful for nothing\b/gi, 'do not worry about anything'],
      [/\btake no thought\b/gi, 'do not worry'],
      [/\bFear thou not\b/gi, 'Do not be afraid'],
      [/\bFear not\b/gi, 'Do not be afraid'],
      [/\bBe not afraid\b/gi, 'Do not be afraid'],
      [/\bfor ever\b/gi, 'forever']
    ];
    pairs.forEach(function (pair) { out = out.replace(pair[0], pair[1]); });
    out = rephraseArchaic(out);
    out = out.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
    if (out) out = out.charAt(0).toUpperCase() + out.slice(1);
    if (out && !/[.!?]"?$/.test(out)) out += '.';
    out = out.replace(/,+\./g, '.').replace(/\.\.+/g, '.');
    return out;
  }

  function snippetFromVerse(raw, maxWords) {
    var modern = modernizeKjvInline(raw);
    modern = String(modern || '')
      .replace(/^(And|But|For|Then|Now|So|Also)[, ]+/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    var quoted = modern.match(/\b(?:said|says|saying|spoke|commanded)[,:]?\s+(.+)/i);
    if (quoted && quoted[1]) {
      var q = quoted[1].replace(/\s+/g, ' ').trim();
      if (q.length > 8 && !/^(to|unto)\s+/i.test(q) && !/\bsaying\b[,.]?$/i.test(q)) {
        modern = q;
      }
    }
    var parts = modern.split(/[.:;]\s+/);
    var clause = parts[0] || modern;
    if (
      /^(god|the lord|he|she|they|jesus|moses|the lord god)\s+(said|says|spoke|commanded)\.?$/i.test(clause) &&
      parts[1] &&
      parts[1].length > 8
    ) {
      clause = parts[1];
    }
    clause = clause.replace(/[;:,.]+$/g, '').trim();
    var words = clause.split(/\s+/).filter(Boolean);
    if (words.length > maxWords) return words.slice(0, maxWords).join(' ') + '\u2026';
    return words.join(' ');
  }

  function speechIntroTeaching(raw) {
    var t = String(raw || '').replace(/\s+/g, ' ').trim();
    if (!t) return '';
    var introOnly = /,\s*saying[,.]?\s*$/i.test(t) && t.length < 120;
    if (!introOnly) return '';
    var m = t.match(/\b(?:spake|spoke|said|saith)\s+(?:unto|to)\s+([^,:]+?)(?:,\s*saying)?[,.]?\s*$/i);
    var who = m ? m[1].replace(/^the\s+/i, '').trim() : '';
    if (who && who.length < 40) {
      return 'The Lord spoke to ' + who + ' \u2014 the words that follow are His, not a human idea.';
    }
    return 'This verse opens the Lord\u2019s word \u2014 what follows is God speaking.';
  }

  function frameVerseTeaching(verseText) {
    var raw = String(verseText || '').replace(/\s+/g, ' ').trim();
    if (!raw) return '';
    if (/begat|son of|daughter of|the generations of/i.test(raw) && raw.length < 180) {
      return 'This verse records real family lines in God\u2019s story \u2014 names and people matter to Him.';
    }
    return modernizeKjvInline(raw);
  }

  function buildThemeLaymanPlain(ref, text) {
    var body = String(text || '').replace(/\s+/g, ' ').trim();
    var lower = body.toLowerCase();
    var r = String(ref || '').toLowerCase();

    /* Well-known anchors — verse-specific */
    if (/genesis\s+1:1/.test(r) || /^in the beginning\s+god\s+created/.test(lower)) {
      return 'In the beginning, God created the heavens and the earth — everything starts with Him.';
    }
    if (/genesis\s+1:3/.test(r) || /let there be light:\s*and there was light/.test(lower)) {
      return 'God spoke, and light appeared — His word is enough to make something from nothing.';
    }
    if (/john\s+3:16/.test(r) || /for god so loved the world/.test(lower)) {
      return 'God loved the world so much He gave His only Son, so whoever believes in Him will not be lost but have eternal life.';
    }
    if (/^1\s+john\s+4:7/.test(r) || /beloved, let us love one another:\s*for love is of god/.test(lower)) {
      return 'Love is not something you manufacture — it comes from God. When you love others, you are showing you belong to Him.';
    }
    if (/philippians\s+4:13/.test(r) || /i can do all things through christ/.test(lower)) {
      return 'I can face what is in front of me because Christ gives me strength.';
    }
    if (/philippians\s+4:6/.test(r) || /be careful for nothing/.test(lower)) {
      return 'Do not let worry run the day — pray about everything, with thanksgiving, and tell God what you need.';
    }
    if (/1\s+corinthians\s+10:13/.test(r) || /no temptation taken you but such as is common/.test(lower)) {
      return 'No temptation has seized you except what people commonly face. God is faithful: He will not let you be tempted beyond what you can bear, and He will make a way through it.';
    }
    if (/psalm\s+23:1/.test(r) || /lord is my shepherd; i shall not want/.test(lower)) {
      return 'The Lord is my shepherd; with Him I will not lack what I truly need.';
    }
    if (/psalm\s+46:10/.test(r) || /^be still, and know that i am god/.test(lower)) {
      return 'Stop striving and know that God is God — He is in charge, not your panic.';
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
    if (/romans\s+8:28/.test(r) || /all things work together for good/.test(lower)) {
      return 'Even the hard pieces are not wasted — God weaves them for good for those who love Him and are called by Him.';
    }
    if (/1\s+peter\s+5:7/.test(r) || /casting all your care upon him/.test(lower)) {
      return 'Throw all your worries on God, because He cares for you.';
    }
    if (/john\s+14:27/.test(r) || /peace i leave with you, my peace i give/.test(lower)) {
      return 'Jesus leaves you His peace — not the thin kind the world gives. Do not let your heart be troubled or afraid.';
    }
    if (/john\s+14:6/.test(r) || /i am the way, the truth, and the life/.test(lower)) {
      return 'Jesus is the way to the Father — not one option among many.';
    }
    if (/psalm\s+92:4/.test(r) || /made me glad through thy work|glad through your work/.test(lower)) {
      return 'God’s work is what makes the heart glad — joy rises when you look at what He has done, not only at how the day feels.';
    }
    if (/psalm\s+118:24/.test(r) || /this is the day which the lord hath made/.test(lower)) {
      return 'The Lord made this day. Rejoice and be glad in it — even when the hours feel ordinary.';
    }
    if (/psalm\s+96:2/.test(r) || /bless his name.*salvation from day to day/.test(lower)) {
      return 'Bless the Lord’s name and show His salvation today, then again tomorrow — not a one-day song.';
    }
    if (/john\s+11:35/.test(r) || /^jesus wept\.?$/i.test(lower)) {
      return 'Jesus wept. He is close to grief — not above it.';
    }
    if (/1\s*peter\s+1:3/.test(r) || /begotten us again unto a lively hope/.test(lower)) {
      return 'God’s mercy has given us a living hope — not a mood, but new life because Jesus rose from the dead.';
    }
    if (/begat|son of|daughter of|the generations of/i.test(body) && body.length < 180) {
      return 'This verse records real family lines in God’s story — names and people matter to Him.';
    }

    /* Last resort: this verse in everyday English — never a leftover theme stamp. */
    var framed = frameVerseTeaching(body);
    if (framed && !isNearVerbatimPlain(framed, body)) return framed;
    return framed || '';
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

  function getBbePlainForRef(ref) {
    try {
      if (typeof window !== 'undefined' && window.TDBBbeSimple && typeof window.TDBBbeSimple.getTextSync === 'function') {
        return tdbPlainTextForUi(window.TDBBbeSimple.getTextSync(ref) || '');
      }
    } catch (eBbe) { /* non-fatal */ }
    return '';
  }

  function isBbeEcho(plain, ref, bbeText) {
    var p = tdbPlainTextForUi(plain || '');
    if (!p) return false;
    var bbe = tdbPlainTextForUi(bbeText || getBbePlainForRef(ref));
    if (!bbe) return false;
    return isNearVerbatimPlain(p, bbe);
  }

  function ensureStrongPlain(ref, verseText, plain) {
    var p = tdbPlainTextForUi(plain || '');
    if (
      !p ||
      isNearVerbatimPlain(p, verseText) ||
      isBbeEcho(p, ref) ||
      /kindness meets you as you are|not after you perform|hold this verse as written|life can feel loud/i.test(p) ||
      /this verse records:\s*(to|unto)\s+\S.{0,40}\bsaying\b/i.test(p) ||
      /this verse still says:\s*[“"']/i.test(p) ||
      /still speaks into the hour you are in/i.test(p) ||
      isIncompleteFragment(p, verseText)
    ) {
      return buildThemeLaymanPlain(ref, verseText);
    }
    return p;
  }

  function inferApplies(text) {
    var l = String(text || '').toLowerCase();
    if (/\btempt(ation|ed)?\b|\btrial\b/.test(l)) {
      return 'When pressure hits, say out loud: God is faithful and makes a way — then take the honest next step.';
    }
    if (/\b(careful|worry|anxious|fear|afraid|troubled)\b/.test(l)) {
      return 'Name the worry to God in one sentence, then reread this verse before you react.';
    }
    if (/\b(peace|rest|still|quiet)\b/.test(l)) {
      return 'Sit still for sixty seconds with this verse — phone face down — before the next task.';
    }
    if (/\b(strength|strong|weary|faint|power|strengthen)\b/.test(l)) {
      return 'Ask God for strength for the next hour only, then do the next honest small thing.';
    }
    if (/\b(pray|prayer|believe|believing|ask.*believ|believ.*receive|supplication)\b/.test(l)) {
      return 'Pray this verse once as written, then tell God one real need without polishing it.';
    }
    if (/begotten us again|lively hope/.test(l) && /resurrection/.test(l)) {
      return 'Bless God for the living hope this verse names — then carry that hope into the next hard hour.';
    }
    if (/\b(forgiv|mercy|grace)\b/.test(l)) {
      return 'If someone comes to mind, ask God for the mercy this verse describes — for them and for you.';
    }
    if (/\b(love|charity|neighbour|neighbor)\b/.test(l)) {
      return 'Do one concrete kind act today that matches the love in this verse.';
    }
    if (/\b(give thanks|thanksgiving|praise|rejoice)\b/.test(l)) {
      return 'List three ordinary mercies out loud, then thank God for them before the day ends.';
    }
    if (/\b(spake|spoke|said|saith)\b.+\bsaying\b/i.test(l)) {
      return 'Read the next verses as the Lord speaking — not as extra history.';
    }
    if (/\bcreat(ed|e|ion|or)\b|\bheaven and (the )?earth\b|\bin the beginning\b/.test(l)) {
      return 'Start from this: God created heaven and earth. This world is His, not an accident.';
    }
    var whole = modernizeKjvInline(text);
    if (whole) return 'Walk in what this verse says: ' + whole;
    return '';
  }

  function plainSpeaker(raw) {
    var s = String(raw || '').trim();
    if (!s) return 'Bible writer';
    s = s.split('/')[0].split(',')[0].replace(/\(.*?\)/g, '').trim();
    if (!s) return 'Bible writer';
    /* Keep short descriptive titles (e.g. “Solomon giving wisdom”) — do not strip to a bare name. */
    if (s.length <= 56 && s.split(/\s+/).length <= 8 && !/\bspeaking to\b/i.test(s)) {
      return s;
    }
    if (/\bjesus\b/i.test(s)) return 'Jesus';
    if (/\bpaul\b/i.test(s)) return 'Paul';
    if (/\bmoses\b/i.test(s)) return 'Moses';
    if (/\bisaiah\b/i.test(s)) return 'Isaiah';
    if (/\bjeremiah\b/i.test(s)) return 'Jeremiah';
    if (/\bsolomon\b/i.test(s)) return 'Solomon';
    if (/\bpeter\b/i.test(s)) return 'Peter';
    if (/\bjames\b/i.test(s)) return 'James';
    if (/\bjohn\b/i.test(s)) return 'John';
    if (/\bdavid\b/i.test(s)) return 'David';
    if (/\bunknown\b/i.test(s)) return 'Bible writer';
    return s || 'Bible writer';
  }

  function plainAudience(raw) {
    var s = String(raw || '').trim();
    if (!s) return 'People listening back then';
    /* Keep specific range audiences (e.g. “Anyone learning a straight path for work and plans”). */
    if (s.length <= 72 && !/^(everyone|all humanity)$/i.test(s)) {
      if (/believers in|church at|friends in|son\b|disciple|exiles|israel|judah|rome|ephesus|philippi|galatia|straight path|work and plans/i.test(s)) {
        return s.length > 64 ? s.slice(0, 61) + '…' : s;
      }
    }
    if (/believers|church/i.test(s)) return 'His friends who needed hope';
    if (/everyone|all humanity|all\b/i.test(s)) return 'People like us';
    if (/rome/i.test(s)) return 'His friends in Rome';
    if (/ephesus/i.test(s)) return 'His friends in Ephesus';
    if (/philippi/i.test(s)) return 'His friends in Philippi';
    if (/galatia/i.test(s)) return 'His friends in Galatia';
    if (/israel|judah|exiles/i.test(s)) return 'His people in a hard season';
    return s.length > 64 ? (s.slice(0, 61) + '…') : s;
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
    var ids = ['main-search', 'q', 'mystudy-search', 'query', 'search', 'feel-search', 'tdb-search'];
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

  function bookPackSlug(book) {
    return String(book || '')
      .replace(/^Psalms$/i, 'Psalm')
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  function applyBookPack(name, map) {
    if (!name || !map || typeof map !== 'object') return;
    BREAKDOWN_BOOK_PACKS[name] = map;
    Object.keys(map).forEach(function (cv) {
      var refKey = name + ' ' + cv;
      if (!BREAKDOWN_OVERRIDES[refKey]) BREAKDOWN_OVERRIDES[refKey] = {};
      if (!BREAKDOWN_OVERRIDES[refKey].general) BREAKDOWN_OVERRIDES[refKey].general = {};
      var prevPlain = BREAKDOWN_OVERRIDES[refKey].general.plainExplanation;
      var nextPlain = String(map[cv] || '');
      if (!prevPlain || isLeftoverLookupPlain(prevPlain)) {
        BREAKDOWN_OVERRIDES[refKey].general.plainExplanation = nextPlain;
      }
    });
  }

  function refreshLookupBreakdownFromPack() {
    try {
      var lookup = document.getElementById('lookup-result');
      if (lookup && String(lookup.className || '').indexOf('hidden') === -1) {
        var pair = extractRefAndText(lookup);
        if (pair.ref && pair.text) injectInlineBreakdown(lookup, pair.ref, pair.text);
      }
      var ctxEl = document.getElementById('lookup-context');
      if (ctxEl) ctxEl.innerHTML = '';
    } catch (eReady) {}
  }

  function prefetchBookBreakdown(book) {
    var name = String(book || '').replace(/^Psalms$/i, 'Psalm');
    if (!name) return Promise.resolve(null);
    if (BREAKDOWN_BOOK_PACKS[name]) return Promise.resolve(BREAKDOWN_BOOK_PACKS[name]);
    if (BREAKDOWN_BOOK_LOADING[name]) return BREAKDOWN_BOOK_LOADING[name];
    var url = '/data/breakdown/' + bookPackSlug(name) + '.json?v=20260822desk14';
    var p;
    try {
      p = fetch(url, { credentials: 'same-origin' })
        .then(function (res) {
          if (!res || !res.ok) return null;
          return res.json();
        })
        .then(function (map) {
          BREAKDOWN_BOOK_LOADING[name] = null;
          if (!map || typeof map !== 'object') return null;
          applyBookPack(name, map);
          try {
            if (typeof window.dispatchEvent === 'function') {
              window.dispatchEvent(new CustomEvent('tdb-breakdown-book-ready', { detail: { book: name } }));
            }
            refreshLookupBreakdownFromPack();
          } catch (eReady) {}
          return map;
        })
        .catch(function () {
          BREAKDOWN_BOOK_LOADING[name] = null;
          return null;
        });
    } catch (ePrefetch) {
      BREAKDOWN_BOOK_LOADING[name] = null;
      return Promise.resolve(null);
    }
    BREAKDOWN_BOOK_LOADING[name] = p;
    return p;
  }

  function getRegisteredOverride(ref, group) {
    var refKey = normalizeRef(ref);
    var book = parseBook(refKey);
    if (book) prefetchBookBreakdown(book);
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

  function isWeakContextStamp(about, toAudience) {
    if (typeof window !== 'undefined' && typeof window.TDB_isWeakVerseContext === 'function') {
      return window.TDB_isWeakVerseContext(about, toAudience);
    }
    var a = tdbPlainTextForUi(about).toLowerCase();
    var t = tdbPlainTextForUi(toAudience).toLowerCase();
    if (!a || !t) return true;
    if (a === 'bible writer' || a === 'the biblical author' || a === 'the biblical writer') return true;
    if (t === 'people who first heard these words' || t === 'original audience') return true;
    return false;
  }

  function cleanSituationStamp(s) {
    var t = tdbPlainTextForUi(s || '').replace(/\s+/g, ' ').trim();
    t = t.replace(/^In this passage of Scripture, the focus is this:\s*/i, '');
    var spoken = t.match(/^(.{2,80}?)\s+[—–-]\s+spoken by\s+(.+?)\s+to\s+(.+?)\.?$/i);
    if (spoken) {
      var title = spoken[1].replace(/\s+/g, ' ').trim();
      var who = spoken[2].replace(/\s+/g, ' ').trim().replace(/^The\s+/, 'the ');
      var audience = spoken[3].replace(/\s+/g, ' ').trim().replace(/^The\s+/, 'the ');
      if (who && audience && title) {
        return who.charAt(0).toUpperCase() + who.slice(1) + ' said this to ' + audience + ': ' + title.replace(/[.!?]$/, '') + '.';
      }
    }
    return t;
  }

  function isThinSpeakerSituation(s) {
    var t = cleanSituationStamp(s);
    if (!t) return true;
    if (/^In this passage of Scripture/i.test(t)) return true;
    if (/ speaking to /i.test(t) && t.length < 100) return true;
    if (/^.{3,70}\s+[—–-]\s+spoken by\s+.+\s+to\s+/i.test(t) && t.length < 180) return true;
    return false;
  }

  function resolveContextForRef(ref) {
    if (typeof window !== 'undefined' && typeof window.TDB_resolveVerseContext === 'function') {
      try {
        var hit = window.TDB_resolveVerseContext(ref);
        if (hit && hit.about && hit.to && !isWeakContextStamp(hit.about, hit.to)) {
          var liveSit = cleanSituationStamp(hit.situation || hit.setting || '');
          /* Prefer narrative; never promote thin “X speaking to Y” when setting exists. */
          if (isThinSpeakerSituation(liveSit) && hit.setting && !isThinSpeakerSituation(hit.setting)) {
            liveSit = cleanSituationStamp(hit.setting);
          }
          return {
            s: tdbPlainTextForUi(hit.about),
            a: tdbPlainTextForUi(hit.to),
            setting: tdbPlainTextForUi(hit.setting || ''),
            situation: liveSit
          };
        }
      } catch (eCtx) {}
    }
    var book = parseBook(ref);
    var ctx = BOOK_CONTEXT[book] || { s: 'The biblical author', a: 'Original audience' };
    /* Empty situation beats a thin speaker-line stamp (cards skip empty; never paint garbage). */
    return {
      s: ctx.s,
      a: ctx.a,
      setting: '',
      situation: ''
    };
  }

  /** Combine exact biblical situation + plain meaning (every verse). */
  function composeContextAndMeaning(situation, plain) {
    var sit = tdbPlainTextForUi(situation || '').trim();
    var p = tdbPlainTextForUi(plain || '').trim();
    if (sit && p) {
      if (/^What was going on:/i.test(p) || p.toLowerCase().indexOf(sit.slice(0, 20).toLowerCase()) === 0) {
        return p;
      }
      return 'What was going on: ' + sit.replace(/\.$/, '') + '. What it means: ' + p.replace(/^What it means:\s*/i, '');
    }
    return p || sit || '';
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
    var ctx = resolveContextForRef(ref);
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
    var bbePlain = '';
    try {
      if (typeof window !== 'undefined' && window.TDBBbeSimple && typeof window.TDBBbeSimple.getTextSync === 'function') {
        bbePlain = tdbPlainTextForUi(window.TDBBbeSimple.getTextSync(ref) || '');
      }
    } catch (eBbe) {}
    var seedPlain = curatedPlain || '';
    /* Never seed “What it means” from BBE — that label is a takeaway, not a second paraphrase. */
    if (seedPlain && (isNearVerbatimPlain(seedPlain, raw) || (bbePlain && isNearVerbatimPlain(seedPlain, bbePlain)))) {
      seedPlain = '';
    }
    var plain = ensureStrongPlain(ref, raw, seedPlain);
    if (raw.length > 150 && plain.length > 160 && !isNearVerbatimPlain(plain, raw)) {
      /* Only trim long theme lines; never leave a truncated KJV echo. */
      if (plain.indexOf(raw.slice(0, 40)) === -1) {
        plain = plain.slice(0, 157) + '…';
      }
    }
    var situation = tdbPlainTextForUi(ctx.situation || ctx.setting || '');
    return {
      about: ctx.s,
      to: ctx.a,
      setting: tdbPlainTextForUi(ctx.setting || ''),
      situation: situation,
      plainExplanation: plain,
      plainMeaningOnly: plain,
      groupApplication: '',
      modernApplication: inferApplies(raw),
      source: (curatedPlain && !isNearVerbatimPlain(curatedPlain, raw)) ? 'override' : (bbePlain ? 'bbe' : 'generated')
    };
  }

  function finalizeBreakdown(base, group) {
    var meaningOnly = tdbPlainTextForUi(base.plainMeaningOnly || base.plainExplanation || '');
    /* If plainExplanation was already a combined stamp, strip to meaning. */
    meaningOnly = meaningOnly
      .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
      .replace(/^What it means:\s*/i, '')
      .trim();
    /* Never ship the old weak last-resort stamp, or a BBE paraphrase, as “meaning”. */
    if (
      /^In plain terms for life today:/i.test(meaningOnly) ||
      /Sit with that until one phrase lands/i.test(meaningOnly) ||
      isBbeEcho(meaningOnly, base.ref || '')
    ) {
      meaningOnly = buildThemeLaymanPlain(base.ref || '', base.text || meaningOnly);
    }
    var situation = cleanSituationStamp(base.situation || base.setting || '');
    if (isThinSpeakerSituation(situation)) {
      var alt = cleanSituationStamp(base.setting || '');
      if (alt && !isThinSpeakerSituation(alt)) situation = alt;
      else situation = '';
    }
    var combined = composeContextAndMeaning(situation, meaningOnly);
    var out = {
      about: plainSpeaker(base.about || ''),
      to: plainAudience(base.to || ''),
      setting: tdbPlainTextForUi(base.setting || ''),
      situation: situation,
      plainMeaningOnly: meaningOnly,
      /* Meaning-only for “What it means” / Plain English labels sitewide. */
      plainExplanation: meaningOnly || combined,
      combinedExplanation: combined || meaningOnly,
      groupApplication: tdbPlainTextForUi(base.groupApplication || ''),
      modernApplication: tdbPlainTextForUi(base.modernApplication || ''),
      bubbleTitle: 'Verse breakdown',
      bubbleEmoji: '',
      group: normalizeGroup(group),
      source: base.source || 'generated'
    };
    if (typeof window !== 'undefined' && window.TDB_verseAccuracy && typeof window.TDB_verseAccuracy.sanitize === 'function') {
      var acc = window.TDB_verseAccuracy.sanitize(base.ref || '', {
        about: out.about,
        setting: out.setting || out.situation,
        audience: out.to,
        plain: meaningOnly
      });
      if (acc.blocked && acc.blocked.length) {
        if (acc.blocked.indexOf('who') !== -1) out.about = acc.who;
        if (acc.blocked.indexOf('situation') !== -1) {
          out.setting = acc.situation;
          out.situation = acc.situation;
        }
        if (acc.blocked.indexOf('audience') !== -1) out.to = acc.audience;
        if (acc.blocked.indexOf('plain') !== -1) {
          meaningOnly = acc.plain;
          out.plainMeaningOnly = acc.plain;
          out.plainExplanation = acc.plain;
        }
      }
    }
    out.layman = meaningOnly || 'God’s Word here is steady for real life — hold one clear phrase and walk with it.';
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
      /* Re-validate cache: older entries (and any weak seed) must not stick as “plain.” */
      var cachedPlain = cached.plainExplanation || cached.layman || '';
      var cachedSit = cached.situation || cached.setting || '';
      var weakCached =
        !cachedPlain ||
        isNearVerbatimPlain(cachedPlain, raw) ||
        isBbeEcho(cachedPlain, ref) ||
        isWeakContextStamp(cached.about, cached.to) ||
        /^In plain terms for life today:/i.test(cachedPlain) ||
        /Sit with that until one phrase lands/i.test(cachedPlain) ||
        isLeftoverLookupPlain(cachedPlain) ||
        isIncompleteFragment(cachedPlain, raw) ||
        isLeftoverLookupPlain(cached.relates || cached.modernApplication || '') ||
        isThinSpeakerSituation(cachedSit);
      if (
        !weakCached &&
        cachedPlain &&
        (cached.plainMeaningOnly || !/^What was going on:/i.test(cachedPlain))
      ) {
        /* Prefer meaning-only layman on cache hits from older builds. */
        if (cached.plainMeaningOnly) {
          cached.layman = cached.plainMeaningOnly;
          cached.plainExplanation = cached.plainMeaningOnly;
        }
        return cached;
      }
      /* Drop incomplete / weak cache so finalize rebuilds clean. */
      if (useCache) {
        try {
          var dropKey = getTextCacheKey(ref, group, raw);
          BREAKDOWN_MEMORY_CACHE.delete(dropKey);
          if (typeof localStorage !== 'undefined') localStorage.removeItem(dropKey);
        } catch (eDrop) {}
      }
    }
    var base = buildGeneratedBase(ref, raw);
    var registered = scrubWeakPlainFields(getRegisteredOverride(ref, group), raw);
    var merged = Object.assign({}, base, registered, manualOverride);
    merged.ref = ref;
    merged.text = raw;
    var freshCtx = resolveContextForRef(ref);
    if (isWeakContextStamp(merged.about, merged.to)) {
      merged.about = freshCtx.s;
      merged.to = freshCtx.a;
    }
    if (!merged.setting) merged.setting = freshCtx.setting || '';
    var candSit = merged.situation || freshCtx.situation || freshCtx.setting || '';
    if (isThinSpeakerSituation(candSit)) {
      candSit = freshCtx.setting || merged.setting || '';
      if (isThinSpeakerSituation(candSit)) candSit = '';
    }
    merged.situation = candSit;
    /* Keep meaning-only for combine; strip prior combined stamps from cache/overrides. */
    var meaningSeed = merged.plainMeaningOnly || merged.plainExplanation || merged.layman || merged.plain || '';
    meaningSeed = String(meaningSeed || '')
      .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
      .trim();
    if (
      /^In plain terms for life today:/i.test(meaningSeed) ||
      /Sit with that until one phrase lands/i.test(meaningSeed)
    ) {
      meaningSeed = '';
    }
    merged.plainMeaningOnly = ensureStrongPlain(ref, raw, meaningSeed);
    merged.plainExplanation = merged.plainMeaningOnly;
    if (!merged.groupApplication) merged.groupApplication = buildGroupApplication(group, inferRelationTopic(ref, raw));
    if (!merged.modernApplication) merged.modernApplication = inferApplies(raw);
    var finalBreakdown = finalizeBreakdown(merged, group);
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

    function addBkH4(title, dataBkKey, extraClass) {
      var h = document.createElement('h4');
      if (extraClass) h.className = extraClass;
      h.appendChild(document.createTextNode(title));
      breakdown.appendChild(h);
      var p = document.createElement('p');
      if (extraClass) p.className = extraClass;
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

    addBkH4('What was going on', 'situation');

    var layWrap = document.createElement('div');
    layWrap.className = 'tdb-layman-collapse tdb-vb-layman-collapse tdb-layman-always-open';
    var laySum = document.createElement('h4');
    laySum.className = 'tdb-layman-collapse__summary tdb-vb-layman-h';
    laySum.setAttribute('data-bk', 'layman-h');
    laySum.appendChild(document.createTextNode('What it means'));
    layWrap.appendChild(laySum);
    var layP = document.createElement('p');
    var laySpan = document.createElement('span');
    laySpan.setAttribute('data-bk', 'layman');
    layP.appendChild(laySpan);
    layWrap.appendChild(layP);
    breakdown.appendChild(layWrap);

    addBkH4('Who\'s talking?', 'about');
    addBkH4('Who hears this?', 'to');

    var relH = document.createElement('h4');
    relH.className = 'tdb-vb-extra';
    relH.appendChild(document.createTextNode('How it relates today'));
    breakdown.appendChild(relH);
    var relP = document.createElement('p');
    relP.className = 'tdb-vb-extra';
    var relSpan = document.createElement('span');
    relSpan.setAttribute('data-bk', 'relates');
    relP.appendChild(relSpan);
    breakdown.appendChild(relP);

    addBkH4('How it relates to you right now', 'applies', 'tdb-vb-extra');

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

    /* Reflection journal stays off the Look up desk — leftover prompts. */
    var std = window.TDB_verseBreakdownStandard;
    var onLookupDesk = false;
    try {
      onLookupDesk = String((window.location && window.location.pathname) || '').toLowerCase().indexOf('bible-tool') !== -1;
    } catch (ePathRefl) {}
    if (!onLookupDesk && std && typeof std.buildReflectionBlock === 'function') {
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
      ['about', 'to', 'layman'].forEach(function (k) {
        if (breakdown[k]) parts.push(String(breakdown[k]));
      });
    }
    /* Do not append the whole search box — one query was poisoning every card's plans
       (e.g. "overwhelmed" results all linking Forgiveness). Verse text drives the plan. */
    var s = parts.join(' ').replace(/\s+/g, ' ').trim();
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
    slot.hidden = false;
    slot.removeAttribute('hidden');
    if (window.TDBBbeSimple && typeof window.TDBBbeSimple.buildDetailsBlock === 'function') {
      try {
        var kjvForBbe = '';
        try {
          kjvForBbe = getBibleVerseText(ref) || '';
        } catch (eKjvBbe) {}
        var bbeSync = getBbePlainForRef(ref);
        if (bbeSync && kjvForBbe && isNearVerbatimPlain(bbeSync, kjvForBbe)) {
          slot.hidden = true;
          slot.setAttribute('hidden', '');
          return;
        }
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
    var sitEl = details.querySelector('[data-bk="situation"]');
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

    var resolvedText = cleanVerseText(text || '');
    /* Never treat the reference string as verse body (e.g. “Isaiah 24:2”). */
    if (!resolvedText || normalizeRef(resolvedText) === normalizeRef(ref) || resolvedText === String(ref || '').trim()) {
      resolvedText = getBibleVerseText(ref);
    }
    if (!resolvedText) resolvedText = cleanVerseText(text || '');

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
    if (sitEl) {
      sitEl.textContent = tdbPlainTextForUi(breakdown.situation || breakdown.setting || '') || '—';
    }
    var layShown0 = tdbPlainTextForUi(breakdown.plainMeaningOnly || breakdown.layman || '').trim();
    if (layShown0 && resolvedText && (isIncompleteFragment(layShown0, resolvedText) || isLeftoverLookupPlain(layShown0))) {
      layShown0 = '';
    }
    if ((!layShown0 || isBbeEcho(layShown0, ref) || isLeftoverLookupPlain(layShown0) || isIncompleteFragment(layShown0, resolvedText)) && resolvedText) {
      layShown0 = tdbPlainTextForUi(buildThemeLaymanPlain(ref, resolvedText) || frameVerseTeaching(resolvedText) || '').trim();
      if (layShown0 && isNearVerbatimPlain(layShown0, resolvedText)) {
        layShown0 = tdbPlainTextForUi(frameVerseTeaching(resolvedText) || '').trim();
      }
    }
    layEl.textContent = layShown0;
    try {
      var layHead = details.querySelector('[data-bk="layman-h"], .tdb-vb-layman-h, .tdb-layman-collapse__summary');
      var layWrap = layEl.closest('.tdb-layman-collapse, .tdb-vb-layman-collapse') || layEl.closest('p, div, section') || layEl.parentNode;
      if (!layShown0) {
        layEl.hidden = true;
        if (layHead) layHead.hidden = true;
        if (layWrap && layWrap !== details) {
          layWrap.hidden = true;
          layWrap.setAttribute('hidden', '');
        }
      } else {
        layEl.hidden = false;
        if (layHead) layHead.hidden = false;
        if (layWrap && layWrap !== details) {
          layWrap.hidden = false;
          layWrap.removeAttribute('hidden');
        }
      }
    } catch (eLayHide) {}

    var yrChip = stdVB && typeof stdVB.currentYear === 'function' ? stdVB.currentYear() : new Date().getFullYear();
    try {
      var yrSp0 = details.querySelector('.tdb-vb-relates-year');
      if (yrSp0) yrSp0.textContent = String(yrChip);
    } catch (eYrC) { /* non-fatal */ }

    var verseGrounded = inferApplies(resolvedText) || '';
    var relDisplayed = breakdown.relates || buildRelationLine(topic, RELATIONS_FALLBACK);
    var personalYou = resolvePersonalYouFromBreakdown(breakdown);
    var layShown = tdbPlainTextForUi(breakdown.layman || '').trim();
    if (!personalYou || personalYou === layShown || isLeftoverLookupPlain(personalYou)) {
      personalYou = verseGrounded;
    }
    if (
      !relDisplayed ||
      relDisplayed === layShown ||
      relDisplayed === personalYou ||
      isLeftoverLookupPlain(relDisplayed) ||
      /still speaks into the hour you are in|life can feel loud|this verse still says:/i.test(relDisplayed || '')
    ) {
      relDisplayed = verseGrounded;
    }

    appEl.textContent = tdbPlainTextForUi(personalYou || '—');
    relEl.textContent = tdbPlainTextForUi(relDisplayed);

    if (stepEl) {
      var ns = verseGrounded
        ? 'Read this verse again as written, then thank God for what it actually says.'
        : 'Read this verse again as written.';
      stepEl.textContent = tdbPlainTextForUi(ns);
    }
    if (prayEl) {
      var bit = modernizeKjvInline(resolvedText);
      if (bit.length > 110) bit = bit.slice(0, 107).replace(/\s+\S*$/, '') + '\u2026';
      var pr = bit
        ? 'Lord, let ' +
          (tdbPlainTextForUi(ref) || 'this verse') +
          ' stand as You wrote it: ' +
          bit +
          ' In Jesus\u2019 name, Amen.'
        : 'Lord, let ' +
          (tdbPlainTextForUi(ref) || 'this verse') +
          ' stand as You wrote it. In Jesus\u2019 name, Amen.';
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
      /* Same words as the toggle — hide the extra label. */
      bubble.hidden = true;
      bubble.setAttribute('hidden', '');
      bubble.textContent = '';
    }

    runInlineLazyLoads(details, ref, resolvedText, ageMode, topic);
  }

  function removeLegacyVerseModal() {
    var modal = byId('tdb-verse-breakdown-modal');
    if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
  }

  function findExistingInline(host) {
    if (!host) return null;
    if (host.id === 'lookup-text' && host.parentNode) {
      var kjvScope = host.closest ? host.closest('.lookup-kjv') : null;
      var luParent = (kjvScope && kjvScope.parentNode) ? kjvScope.parentNode : host.parentNode;
      return luParent.querySelector(':scope > .tdb-verse-breakdown-inline, .tdb-verse-breakdown-inline');
    }
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

    if (host.id === 'lookup-text') {
      var kjvBox = host.closest ? host.closest('.lookup-kjv') : null;
      if (kjvBox && kjvBox.parentNode) {
        return { parent: kjvBox.parentNode, before: kjvBox.nextSibling };
      }
      return { parent: host.parentNode, before: host.nextSibling };
    }
    if (host.id === 'lookup-result') {
      var lt = host.querySelector('#lookup-text');
      var kjvHost = lt && lt.closest ? lt.closest('.lookup-kjv') : null;
      if (kjvHost && kjvHost.parentNode) {
        return { parent: kjvHost.parentNode, before: kjvHost.nextSibling };
      }
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
    if (!parseBook(ref)) return;
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
    if (host.id === 'church-daily-verse-card' || host.id === 'lookup-text' || host.id === 'lookup-result') {
      details.classList.add('tdb-vb-inline--host-has-kjv');
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
    /* KISS cards already show KJV → BBE → context — never pile on heavy inline breakdown. */
    if (el.classList && el.classList.contains('tdb-kiss-verse')) return true;
    if (el.closest('.tdb-kiss-verse, [data-tdb-kiss-verse="1"]')) return true;
    if (el.closest('[data-home-result-card="verse"], .home-search-card--verse')) return true;
    if (el.closest('#feelCards, .feel-verse-card, #feel-results')) return true;
    /* Calm has its own porch for THIS verse. Auto-inject here mixed in leftover Matthew 11:28. */
    try {
      var pathCalm = String((window.location && window.location.pathname) || '').toLowerCase();
      if (pathCalm.indexOf('calm') !== -1 || pathCalm.indexOf('/paz') !== -1) {
        if (el.id === 'verse-container' || el.id === 'desktop-verse' || el.closest('#verse-container, #desktop-verse, .calm-verse-container, [data-calm-verse-porch]')) return true;
      }
    } catch (eCalmSkip) {}
    if (el.closest('.home-search-detail-panel')) return true;
    if (el.classList && el.classList.contains('tdb-verse-breakdown-inline')) return true;
    if (el.closest('.tdb-verse-breakdown-inline')) return true;
    /* Parent shells (e.g. .church-verse-card) must not get a second copy after the inner card. */
    if (el.querySelector && el.querySelector('.tdb-verse-breakdown-inline')) return true;
    if (el.classList && el.classList.contains('church-verse-card') && el.querySelector('#church-daily-verse-card')) return true;
    if (el.closest('#plan-progress, #plan-progress-wrap, #win-result, #battle-ready-result')) return true;
    if (el.closest('.concordance-ref-item, #kjv-word-notes-list, #bible-tool-study-details, #bible-tool-themed-chains, #people-result')) return true;
    try {
      var pathBt = String((window.location && window.location.pathname) || '').toLowerCase();
      if (pathBt.indexOf('bible-tool') !== -1) {
        if (el.id === 'lookup-text' || el.id === 'lookup-result') return false;
        return true;
      }
    } catch (eBt) {}
    return false;
  }

  function addButton(container, ref, text) {
    if (!container || !ref || !text) return;
    if (!parseBook(ref)) return;
    try {
      var pLu = String((window.location && window.location.pathname) || '').toLowerCase();
      if (pLu.indexOf('bible-tool') !== -1) {
        var luTxt = byId('lookup-text');
        if (luTxt) {
          injectInlineBreakdown(luTxt, ref, text);
          return;
        }
      }
    } catch (eLu) {}
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
    function lookup(map, k) {
      if (!map || !k) return '';
      if (map[k]) return map[k];
      if (/^Psalm\s+/i.test(k) && map[k.replace(/^Psalm\s+/i, 'Psalms ')]) {
        return map[k.replace(/^Psalm\s+/i, 'Psalms ')];
      }
      if (/^Psalms\s+/i.test(k) && map[k.replace(/^Psalms\s+/i, 'Psalm ')]) {
        return map[k.replace(/^Psalms\s+/i, 'Psalm ')];
      }
      return '';
    }
    var direct =
      lookup(window.bible, r) ||
      lookup(window.bible, key) ||
      lookup(window.kjvData, r) ||
      lookup(window.kjvData, key) ||
      '';
    if (direct) return cleanVerseText(direct);
    var ranged = resolveRangeVerseText(r, window.bible || window.kjvData || null);
    if (ranged) return ranged;
    if (typeof window.getBibleVerseText === 'function' && window.getBibleVerseText !== getBibleVerseText) {
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

    if (container.id === 'lookup-text' || container.id === 'lookup-result-body' || container.id === 'lookup-result') {
      var luRefEl = byId('lookup-ref');
      var luTxtEl = byId('lookup-text');
      var luRef = luRefEl ? extractRefFromText(String(luRefEl.textContent || '')) : '';
      var luTxt = luTxtEl ? cleanVerseText(luTxtEl.textContent || '') : '';
      if (!luTxt && luRef) luTxt = getBibleVerseText(luRef);
      if (luRef && luTxt && parseBook(luRef)) return { ref: luRef, text: luTxt };
      return { ref: '', text: '' };
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
      var kissKjv = container.querySelector('.tdb-kiss-verse__kjv');
      if (kissKjv) {
        text = cleanVerseText(
          String(kissKjv.textContent || '')
            .replace(/^[\s"\u201c\u201d']+|[\s"\u201c\u201d']+$/g, '')
            .trim()
        );
      }
    }
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
      /* Prefer body paragraphs, never the ref line as verse text. */
      var pNodes = container.querySelectorAll('p');
      for (var pi = 0; pi < pNodes.length; pi++) {
        var cand = cleanVerseText(pNodes[pi].textContent || '');
        if (!cand) continue;
        if (pNodes[pi].classList && (
          pNodes[pi].classList.contains('tdb-kiss-verse__ref') ||
          pNodes[pi].classList.contains('home-search-card-ref') ||
          pNodes[pi].classList.contains('smart-ref')
        )) continue;
        var looksLikeRefOnly = /^[1-3]?\s*[A-Za-z][A-Za-z\s.]+\s+\d+:\d+(-\d+)?(\s*\(KJV\))?$/i.test(cand);
        if (looksLikeRefOnly) continue;
        text = cand;
        break;
      }
    }
    if (!text && ref) text = getBibleVerseText(ref);
    var refClean = cleanVerseText(ref);
    var textClean = cleanVerseText(text);
    /* Never treat the reference string as verse body (e.g. “Psalms 68:6”). */
    if (textClean && refClean) {
      var tNorm = textClean.replace(/[“”"']/g, '').replace(/\s*\(KJV\)\s*$/i, '').replace(/\s+/g, ' ').trim();
      var rNorm = refClean.replace(/\s*\(KJV\)\s*$/i, '').replace(/\s+/g, ' ').trim();
      if (tNorm.toLowerCase() === rNorm.toLowerCase() || extractRefFromText(tNorm) === rNorm) {
        textClean = getBibleVerseText(refClean) || '';
      }
    }
    return { ref: refClean, text: textClean };
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
      '#lookup-text',
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
    prefetchBookBreakdown: prefetchBookBreakdown,
    frameVerseTeaching: frameVerseTeaching,
    enhanceVisibleVerseContainers: enhanceVerseContainers,
    getMissingVisibleBreakdowns: getMissingVisibleBreakdowns,
    countMissingVisibleBreakdowns: countMissingVisibleBreakdowns,
    getAgeMode: getAgeMode,
    setAgeMode: setAgeMode,
    isThinSpeakerSituation: isThinSpeakerSituation,
    cleanSituationStamp: cleanSituationStamp,
    isWeakPlainStamp: function (p) {
      var t = tdbPlainTextForUi(p || '');
      if (!t) return true;
      if (/^In plain terms for life today:/i.test(t)) return true;
      if (/Sit with that until one phrase lands/i.test(t)) return true;
      if (/^Read this verse slowly/i.test(t)) return true;
      return false;
    },
    meaningOnly: function (text) {
      return tdbPlainTextForUi(text || '')
        .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
        .replace(/^What it means:\s*/i, '')
        .trim();
    },
    isBbeEcho: isBbeEcho,
    isNearVerbatimPlain: isNearVerbatimPlain,
    preferSituation: function () {
      var best = '';
      var bestLen = 0;
      for (var i = 0; i < arguments.length; i++) {
        var c = cleanSituationStamp(arguments[i] || '');
        if (!c || isThinSpeakerSituation(c)) continue;
        if (c.length > bestLen) {
          bestLen = c.length;
          best = c;
        }
      }
      return best;
    }
  };
  window.TDBTeachingQuality = {
    isThinSpeakerSituation: isThinSpeakerSituation,
    cleanSituationStamp: cleanSituationStamp,
    isWeakPlainStamp: window.TDBVerseBreakdown.isWeakPlainStamp,
    meaningOnly: window.TDBVerseBreakdown.meaningOnly,
    preferSituation: window.TDBVerseBreakdown.preferSituation,
    isBbeEcho: isBbeEcho,
    isNearVerbatimPlain: isNearVerbatimPlain
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireAutoEnhance);
  else wireAutoEnhance();
})();
