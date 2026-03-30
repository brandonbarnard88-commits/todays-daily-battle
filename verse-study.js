/**
 * Verse study sheet v2 — full-screen-friendly calm sheet, lexicon-tapped verse + key words,
 * combined “why today,” related passages, Listen, and actions. Wraps TDBWordStudy.open.
 * Depends: word-study.js (TDBWordStudy). Optional: TDBStudyCompanion, TDBVerseNarration, trackEvent.
 */
(function (global) {
  'use strict';

  var NOTES_KEY = 'tdb_bible_tool_notes';
  var MEM_LITE_KEY = 'tdb_memorize_lite_v1';
  var WGHD_KEY = 'tdb_what_god_has_done_v1';
  var WGHD_MAX_BODY = 800;
  var WGHD_VERSION = 1;

  var SVG_LISTEN =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
  var SVG_STOP =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>';

  var VS_CSS =
    '#tdb-verse-study-layer{position:fixed;inset:0;z-index:395;display:flex;align-items:flex-end;justify-content:center;padding:0;box-sizing:border-box;font-family:ui-sans-serif,system-ui,Segoe UI,Inter,sans-serif}' +
    '#tdb-verse-study-layer.tdb-vs-hidden{display:none!important}' +
    '#tdb-vs-backdrop{position:absolute;inset:0;background:rgba(15,18,28,.62);border:0;padding:0;cursor:pointer}' +
    '#verse-study-sheet.tdb-calm-sheet{position:relative;z-index:1;width:100%;max-width:32rem;max-height:min(100dvh,900px);overflow-x:hidden;overflow-y:auto;margin:0;padding:1rem 1.15rem calc(1rem + env(safe-area-inset-bottom,0px));border-radius:20px 20px 0 0;border:1px solid rgba(212,200,170,.55);border-bottom:none;background:linear-gradient(180deg,#fffdf8 0%,#faf7f0 42%);box-shadow:0 -24px 60px rgba(28,24,18,.18),0 6px 28px rgba(28,24,18,.08);color:#1c1917;display:flex;flex-direction:column;gap:.85rem;-webkit-overflow-scrolling:touch}' +
    '@media(min-width:560px){#tdb-verse-study-layer{align-items:center;padding:1rem}#verse-study-sheet.tdb-calm-sheet{border-radius:20px;border-bottom:1px solid rgba(212,200,170,.55);max-height:min(92vh,880px);padding-bottom:1.2rem}}' +
    '@media(max-width:559px){#verse-study-sheet.tdb-calm-sheet{max-height:100dvh;border-radius:0}}' +
    '#verse-study-sheet.tdb-calm-sheet>header{display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;margin:0 0 .15rem}' +
    '#vs-ref{margin:0;font-size:clamp(1.08rem,3.4vw,1.32rem);font-weight:700;color:#7c5c1c;line-height:1.25;flex:1 1 auto;padding-right:.25rem}' +
    '#vs-close{flex-shrink:0;min-width:48px;min-height:48px;padding:0;font-size:1.35rem;line-height:1;font-weight:400;font-family:inherit;border-radius:12px;border:1px solid rgba(90,78,58,.28);background:#fff;cursor:pointer;color:#44403c}' +
    '#vs-close:hover,#vs-close:focus-visible{outline:2px solid rgba(227,188,103,.55);outline-offset:2px}' +
    '.vs-verse{margin:0}' +
    '#vs-full-verse.large-kjv{margin:0;font-size:clamp(1.14rem,3.8vw,1.42rem);line-height:1.62;color:#1c1917;font-family:Georgia,ui-serif,serif}' +
    '.tdb-vs-verse-word{background:transparent;border:0;padding:0;margin:0;font:inherit;color:inherit;cursor:pointer;text-decoration:underline;text-decoration-color:rgba(124,92,28,.45);text-underline-offset:3px;border-radius:4px}' +
    '.tdb-vs-verse-word:hover,.tdb-vs-verse-word:focus-visible{background:rgba(227,188,103,.2);outline:2px solid rgba(227,188,103,.45);outline-offset:1px}' +
    '.tdb-vs-verse-word--lex{font-weight:600;color:#5c4a24}' +
    '.vs-section-title{margin:0 0 .4rem;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b5a3c}' +
    '.vs-why{margin:0;padding:.8rem .9rem;border-radius:14px;background:rgba(227,188,103,.14);border:1px solid rgba(227,188,103,.28)}' +
    '#vs-why-text{margin:0;font-size:.94rem;line-height:1.58;color:#292524}' +
    '.vs-key-words{margin:0}' +
    '#vs-token-detail{margin:0 0 .55rem;padding:.7rem .8rem;border-radius:14px;background:rgba(255,252,245,.95);border:1px solid rgba(200,180,140,.4)}' +
    '#vs-token-detail.vs-token-detail--empty{display:none!important}' +
    '.vs-token-label{margin:0 0 .35rem;font-size:.68rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#78716c}' +
    '#vs-token-gloss{margin:0 0 .45rem;font-size:.9rem;line-height:1.5;color:#1c1917;font-weight:600}' +
    '#vs-token-read{margin:0 0 .45rem;font-size:.86rem;line-height:1.52;color:#44403c}' +
    '#vs-token-why{margin:0;font-size:.88rem;line-height:1.55;color:#292524}' +
    '.vs-token-full-study-btn{margin-top:.55rem;min-height:44px;padding:.42rem .85rem;border-radius:10px;border:1px solid rgba(138,112,48,.42);background:#fff;color:#3d3420;font-weight:700;font-size:.82rem;font-family:inherit;cursor:pointer;width:100%}' +
    '.vs-token-full-study-btn:hover,.vs-token-full-study-btn:focus-visible{outline:2px solid rgba(227,188,103,.45);outline-offset:2px}' +
    '.vs-why h3,.vs-key-words h3,.vs-related h3{margin:.15rem 0 .4rem;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b5a3c}' +
    '.vs-key-words.vs-key-words--empty{display:none!important}' +
    '.word-tokens{display:flex;flex-wrap:wrap;gap:.4rem .45rem}' +
    '.vs-word-token{min-height:44px;padding:.38rem .75rem;border-radius:999px;border:1px solid rgba(138,112,48,.38);background:#fff;color:#3d3420;font-weight:600;font-size:.84rem;font-family:inherit;cursor:pointer;box-shadow:0 1px 3px rgba(28,24,18,.06)}' +
    '.vs-word-token:hover,.vs-word-token:focus-visible{outline:2px solid rgba(227,188,103,.5);outline-offset:2px}' +
    '.vs-word-token--active{background:rgba(227,188,103,.22);border-color:rgba(124,92,28,.45)}' +
    '.vs-related{margin:0}' +
    '.vs-related.vs-related--empty{display:none!important}' +
    '#vs-related-list{display:flex;flex-direction:column;gap:.45rem}' +
    '.vs-related-study-btn{display:flex;flex-direction:column;align-items:flex-start;gap:.15rem;width:100%;min-height:48px;padding:.55rem .75rem;border-radius:12px;border:1px solid rgba(90,78,58,.22);background:#fff;text-align:left;font:inherit;cursor:pointer;color:#1c1917}' +
    '.vs-related-study-btn strong{font-size:.9rem;font-weight:700;color:#1e40af}' +
    '.vs-related-study-btn span{font-size:.78rem;color:#78716c;font-weight:500}' +
    '.vs-related-study-btn:hover,.vs-related-study-btn:focus-visible{outline:2px solid rgba(227,188,103,.45);outline-offset:2px;border-color:rgba(138,112,48,.4)}' +
    '.vs-audio{margin:0}' +
    '#vs-listen-btn.hidden{display:none!important}' +
    '#tdb-vs-listen-block{margin:0;padding:.85rem .9rem;border-radius:16px;border:2px solid rgba(200,168,88,.45);background:linear-gradient(180deg,rgba(255,248,230,.92) 0%,rgba(250,244,232,.96) 100%);box-shadow:0 6px 20px rgba(124,92,28,.08)}' +
    '#tdb-vs-listen-block.hidden{display:none!important}' +
    '#vs-listen-btn.tdb-vs-listen-btn{display:flex;align-items:center;justify-content:center;gap:.5rem;width:100%;min-height:52px;padding:.55rem 1.1rem;margin:0 0 .55rem;border-radius:14px;border:2px solid rgba(138,112,48,.42);background:linear-gradient(180deg,rgba(255,236,188,.96) 0%,rgba(227,188,103,.52) 100%);color:#3d3420;font-weight:700;font-size:.95rem;letter-spacing:.02em;cursor:pointer;font-family:inherit;box-shadow:0 2px 10px rgba(124,92,28,.12)}' +
    '#vs-listen-btn.tdb-vs-listen-btn:hover,#vs-listen-btn.tdb-vs-listen-btn:focus-visible{outline:2px solid rgba(227,188,103,.65);outline-offset:2px}' +
    '#vs-listen-btn.tdb-vs-listen-btn.tdb-vs-listen-active{background:linear-gradient(180deg,rgba(254,240,220,.98) 0%,rgba(212,168,88,.35) 100%);border-color:rgba(124,92,28,.38)}' +
    '.tdb-vs-listen-row{display:flex;flex-wrap:wrap;align-items:center;gap:.55rem .75rem}' +
    '.tdb-vs-listen-icon{display:inline-flex;flex-shrink:0;color:#5c4a24}' +
    '.tdb-vs-listen-icon svg{display:block}' +
    '.tdb-vs-repeat-verse-btn{min-height:44px;padding:.42rem .75rem;border-radius:10px;border:1px solid rgba(90,78,58,.32);background:#fff;color:#44403c;font-weight:600;font-size:.82rem;cursor:pointer;font-family:inherit}' +
    '.tdb-vs-repeat-verse-btn:hover,.tdb-vs-repeat-verse-btn:focus-visible{outline:2px solid rgba(227,188,103,.45);outline-offset:2px;border-color:rgba(138,112,48,.45);color:#292524}' +
    '.tdb-vs-listen-progress{margin:.55rem 0 0}' +
    '.tdb-vs-listen-progress.hidden{display:none!important}' +
    '.tdb-vs-progress-label{margin:0 0 .35rem;font-size:.8rem;font-weight:600;color:#57534e}' +
    '.tdb-vs-progress-track{height:6px;border-radius:999px;background:rgba(120,113,108,.2);overflow:hidden}' +
    '.tdb-vs-progress-bar{height:100%;width:0%;border-radius:999px;background:linear-gradient(90deg,rgba(200,168,88,.85),rgba(227,188,103,.95));transition:width .2s ease}' +
    '.tdb-vs-listen-details{margin:.55rem 0 0;font-size:.82rem;color:#44403c}' +
    '.tdb-vs-listen-details summary{cursor:pointer;font-weight:600;min-height:40px;list-style:none}' +
    '.tdb-vs-listen-details summary::-webkit-details-marker{display:none}' +
    '.tdb-vs-listen-opts{display:flex;flex-direction:column;gap:.45rem;margin:.45rem 0 0}' +
    '.tdb-vs-listen-opts label{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}' +
    '.tdb-vs-listen-opts select{min-height:40px;padding:.25rem .4rem;border-radius:8px;border:1px solid rgba(90,78,58,.25);font:inherit;max-width:100%}' +
    '.tdb-vs-listen-opts .tdb-vs-ambient-row{display:flex;flex-direction:column;align-items:flex-start;gap:.35rem}' +
    '.tdb-vs-listen-opts input[type=range]{width:100%;max-width:16rem;min-height:32px}' +
    '.tdb-vs-ambient-gain-label{font-size:.78rem;color:#78716c;font-weight:500}' +
    '#vs-full-verse.tdb-vs-verse--tts-speak{box-shadow:0 0 0 2px rgba(227,188,103,.35);border-radius:8px;transition:box-shadow .25s ease}' +
    '.vs-actions{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-top:.15rem}' +
    '@media(max-width:380px){.vs-actions{grid-template-columns:1fr}}' +
    '.vs-actions button{min-height:48px;padding:.48rem .65rem;border-radius:12px;border:1px solid rgba(90,78,58,.25);background:#fff;color:#292524;font-weight:600;font-size:.8rem;cursor:pointer;font-family:inherit;line-height:1.25}' +
    '.vs-actions button:hover,.vs-actions button:focus-visible{outline:2px solid rgba(227,188,103,.45);outline-offset:2px}' +
    '#vs-save-mystudy{background:rgba(227,188,103,.2);border-color:rgba(138,112,48,.38);font-weight:700}' +
    '#vs-status{margin:0;font-size:.84rem;min-height:1.2em;color:#57534e;order:99}' +
    '.vs-footer{margin:0;font-size:.78rem;line-height:1.45;color:#78716c;text-align:center;order:98}' +
    'body.tdb-verse-study-open{overflow:hidden}';

  var layerWired = false;
  var focusBefore = null;
  var stateRef = '';
  var stateText = '';
  var stateWhy = '';
  var stateXrefs = [];
  var narrationFromVerseStudy = false;
  var stateLexMap = null;
  var stateSelectedSurface = '';
  var bibleMapPromise = null;

  function escapeRe(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function normRefKey(r) {
    return String(r || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function loadMemLite() {
    try {
      var raw = localStorage.getItem(MEM_LITE_KEY);
      var o = raw ? JSON.parse(raw) : null;
      if (o && typeof o === 'object' && o.refs && typeof o.refs === 'object') return o;
    } catch (e) {}
    return { refs: {} };
  }

  function saveMemLite(st) {
    try {
      localStorage.setItem(MEM_LITE_KEY, JSON.stringify(st));
    } catch (e) {}
  }

  function isMemLiteStored(ref) {
    var r = normRefKey(ref);
    return !!(loadMemLite().refs || {})[r];
  }

  function addMemLiteEntry(ref) {
    var r = normRefKey(ref);
    if (!r) return false;
    var st = loadMemLite();
    if (st.refs[r]) return false;
    st.refs[r] = {
      added: new Date().toISOString(),
      lastReviewed: null,
      intervalIdx: 0,
      easeFactor: 2,
      lapses: 0
    };
    saveMemLite(st);
    return true;
  }

  /** First verse of a reference (handles ranges like "Phil 4:6-7" for xref keys). */
  function parseCanonRef(raw) {
    var t = String(raw || '').trim();
    var m = t.match(/^((?:[1-3]\s+)?[a-zA-Z][a-zA-Z.\s']+?)\s+(\d+)\s*:\s*(\d+)/i);
    if (!m) return normRefKey(raw);
    return m[1].replace(/\s+/g, ' ').trim() + ' ' + m[2] + ':' + m[3];
  }

  function buildReaderUrl(ref, fromRefOpt) {
    var r = normRefKey(ref);
    var m = r.match(/^(.+)\s(\d+):(\d+)$/);
    if (!m) return 'reader.html';
    var params = new URLSearchParams({ book: m[1].trim(), chapter: m[2], ref: r });
    var url = 'reader.html?' + params.toString();
    if (fromRefOpt) {
      var fr = normRefKey(fromRefOpt);
      if (fr) url += '&fromRef=' + encodeURIComponent(fr);
    }
    return url;
  }

  function fetchLexiconMap() {
    return fetch('kjv-lexicon.json', { credentials: 'same-origin' })
      .then(function (res) {
        return res.ok ? res.json() : {};
      })
      .then(function (data) {
        var map = {};
        var w = data && data.words && typeof data.words === 'object' ? data.words : {};
        Object.keys(w).forEach(function (k) {
          var e = w[k];
          var key = k.toLowerCase();
          if (e && typeof e === 'object') {
            map[key] = {
              g: String(e.g != null ? e.g : '').trim(),
              s: String(e.s != null ? e.s : '').trim(),
              w: String(e.w != null ? e.w : '').trim(),
              x: Array.isArray(e.x) ? e.x : []
            };
          }
        });
        return map;
      })
      .catch(function () {
        return {};
      });
  }

  function fetchCrossRefs() {
    return fetch('cross-refs.json', { credentials: 'same-origin' })
      .then(function (res) {
        return res.ok ? res.json() : {};
      })
      .then(function (d) {
        return d && d.refs && typeof d.refs === 'object' ? d.refs : {};
      })
      .catch(function () {
        return {};
      });
  }

  function fetchBibleMap() {
    if (typeof global.bible !== 'undefined' && global.bible && Object.keys(global.bible).length > 8000) {
      return Promise.resolve(global.bible);
    }
    if (bibleMapPromise) return bibleMapPromise;
    var origin = '';
    try {
      origin = global.location && global.location.origin ? global.location.origin : '';
    } catch (e) {
      origin = '';
    }
    var urls = ['kjv.json'];
    if (origin) urls.push(origin.replace(/\/$/, '') + '/kjv.json');
    urls.push('https://todaysdailybattle.com/kjv.json');
    bibleMapPromise = (function tryFetch(i) {
      if (i >= urls.length) return Promise.resolve({});
      return fetch(urls[i], { credentials: 'same-origin' })
        .then(function (res) {
          return res.ok ? res.json() : Promise.reject();
        })
        .then(function (d) {
          var obj = {};
          if (Array.isArray(d)) {
            d.forEach(function (v) {
              if (v && v.ref) obj[String(v.ref).replace(/\s+/g, ' ').trim()] = String(v.text || '');
            });
          } else if (d && typeof d === 'object') {
            Object.keys(d).forEach(function (k) {
              obj[k.replace(/\s+/g, ' ').trim()] = String(d[k] || '');
            });
          }
          if (Object.keys(obj).length > 8000) return obj;
          return tryFetch(i + 1);
        })
        .catch(function () {
          return tryFetch(i + 1);
        });
    })(0);
    return bibleMapPromise;
  }

  function kjvTextForRef(map, ref) {
    var k = normRefKey(ref);
    if (!k || !map) return '';
    return String(map[k] || map[parseCanonRef(k)] || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function openRelatedVerse(refRaw) {
    var r = normRefKey(refRaw);
    if (!r) return;
    fetchBibleMap().then(function (map) {
      var txt = kjvTextForRef(map, r);
      open(r, txt || '');
    });
  }

  function lookupLex(lexMap, token) {
    if (!lexMap || !token) return null;
    var k = String(token).toLowerCase();
    if (lexMap[k]) return lexMap[k];
    if (k.length > 4 && k.slice(-1) === 's') {
      var base = k.slice(0, -1);
      if (lexMap[base]) return lexMap[base];
    }
    return null;
  }

  function collectSpans(text, lexMap) {
    var keys = Object.keys(lexMap).filter(function (k) {
      var e = lexMap[k];
      if (!e || typeof e !== 'object') return false;
      return (
        String(e.g || '')
          .trim()
          .length > 0 ||
        String(e.s || '')
          .trim()
          .length > 0 ||
        String(e.w || '')
          .trim()
          .length > 0
      );
    });
    keys.sort(function (a, b) {
      return b.length - a.length;
    });
    var spans = [];
    keys.forEach(function (key) {
      var pattern;
      if (key.indexOf(' ') >= 0) {
        pattern = new RegExp('\\b' + key.split(/\s+/).map(escapeRe).join('\\s+') + '\\b', 'gi');
      } else {
        pattern = new RegExp('\\b' + escapeRe(key) + '\\b', 'gi');
      }
      var m;
      var t = String(text);
      pattern.lastIndex = 0;
      while ((m = pattern.exec(t)) !== null) {
        spans.push({
          start: m.index,
          end: m.index + m[0].length,
          key: key,
          surface: m[0]
        });
      }
    });
    spans.sort(function (a, b) {
      if (a.start !== b.start) return a.start - b.start;
      return b.end - b.start - (a.end - a.start);
    });
    var picked = [];
    spans.forEach(function (s) {
      var ov = picked.some(function (p) {
        return !(s.end <= p.start || s.start >= p.end);
      });
      if (!ov) picked.push(s);
    });
    picked.sort(function (a, b) {
      return a.start - b.start;
    });
    return picked;
  }

  function buildWhyFromLexicon(verseText, lexMap, spans) {
    var scored = [];
    var seenK = {};
    spans.forEach(function (sp) {
      var e = lexMap[sp.key];
      if (!e || seenK[sp.key]) return;
      var w = String(e.w || '').trim();
      if (!w) return;
      seenK[sp.key] = true;
      scored.push({ key: sp.key, w: w, n: w.length });
    });
    scored.sort(function (a, b) {
      return b.n - a.n;
    });
    var top = scored.slice(0, 3);
    if (top.length >= 3) {
      return (
        'This verse gathers a few words that speak quietly into the present moment: ' +
        top[0].w +
        ' ' +
        top[1].w +
        ' ' +
        top[2].w
      );
    }
    if (top.length === 2) {
      return 'Two words carry special weight for today: ' + top[0].w + ' ' + top[1].w;
    }
    if (top.length === 1) {
      return top[0].w;
    }
    return gentleFallbackWhy(verseText);
  }

  function gentleFallbackWhy(verse) {
    var v = String(verse || '').toLowerCase();
    if (/\b(peace|quiet|rest|still)\b/.test(v)) {
      return 'When life feels loud, lines like this invite you to receive God’s peace—not as a mood you force, but as a guard over heart and mind.';
    }
    if (/\b(fear|afraid|trouble|anxi)\b/.test(v)) {
      return 'Hard days make the heart race. This verse points you toward the Lord’s presence—honest fear met with steady help, not hype.';
    }
    if (/\b(hope|mercy|comfort|heal)\b/.test(v)) {
      return 'Weariness is real; so is God’s kindness. Let this verse remind you that His mercy meets you where you are—not where you pretend to be.';
    }
    if (/\b(pray|prayer|thank)\b/.test(v)) {
      return 'Prayer here is not performance—it is bringing what you carry to the Father who already knows you. One honest sentence is enough to start.';
    }
    if (/\b(love|charity|kind)\b/.test(v)) {
      return 'Love in Scripture is steady and self-giving. This line can reshape how you show up today—gentle, faithful, rooted in Christ.';
    }
    if (/\b(guard|minds?|hearts?)\b/.test(v) && /\b(peace|careful|nothing)\b/.test(v)) {
      return 'This verse reminds us that God\u2019s peace can guard our hearts even when our bodies are weary.';
    }
    return 'This line is worth sitting with quietly. Let the words find you where you are—God speaks through His Word with steadiness, not pressure.';
  }

  function formatDisplayWord(tok) {
    var s = String(tok || '').trim();
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function clearTokenDetail() {
    var box = document.getElementById('vs-token-detail');
    stateSelectedSurface = '';
    if (!box) return;
    box.classList.add('vs-token-detail--empty');
    var lab = document.getElementById('vs-token-label');
    var g = document.getElementById('vs-token-gloss');
    var rd = document.getElementById('vs-token-read');
    var wy = document.getElementById('vs-token-why');
    if (lab) lab.textContent = '';
    if (g) g.textContent = '';
    if (rd) {
      rd.textContent = '';
      rd.classList.add('hidden');
    }
    if (wy) wy.textContent = '';
  }

  function showTokenDetail(surface, entry) {
    var box = document.getElementById('vs-token-detail');
    if (!box || !entry) return;
    stateSelectedSurface = String(surface || '');
    box.classList.remove('vs-token-detail--empty');
    var lab = document.getElementById('vs-token-label');
    var g = document.getElementById('vs-token-gloss');
    var rd = document.getElementById('vs-token-read');
    var wy = document.getElementById('vs-token-why');
    var gloss = String(entry.g || '').trim();
    var how = String(entry.s || '').trim();
    var why = String(entry.w || '').trim();
    if (lab) lab.textContent = stateSelectedSurface ? 'Preview: ' + stateSelectedSurface : 'Word preview';
    if (g) {
      g.textContent =
        gloss ||
        (why
          ? 'Gloss: see the full note below.'
          : 'This KJV word has notes on Today\u2019s Daily Battle—open the full sheet for concordance and context.');
    }
    if (rd) {
      if (how) {
        rd.textContent = 'How to read it: ' + how;
        rd.classList.remove('hidden');
      } else {
        rd.textContent = '';
        rd.classList.add('hidden');
      }
    }
    if (wy) wy.textContent = why ? 'Why it matters today: ' + why : '';
  }

  function setActiveWordToken(btn) {
    var kw = document.getElementById('vs-key-words-list');
    if (!kw) return;
    kw.querySelectorAll('.vs-word-token--active').forEach(function (el) {
      el.classList.remove('vs-word-token--active');
    });
    if (btn) btn.classList.add('vs-word-token--active');
  }

  function renderVerseInteractive(container, verseText, spans, lexMap) {
    container.textContent = '';
    if (!verseText) {
      container.appendChild(document.createTextNode('Add verse text from this page when you can.'));
      return;
    }
    var i = 0;
    var t = String(verseText);
    var map = lexMap || {};
    spans.forEach(function (sp) {
      if (sp.start > i) {
        container.appendChild(document.createTextNode(t.slice(i, sp.start)));
      }
      var e = map[sp.key];
      var hasLex =
        e &&
        (String(e.g || '').trim() || String(e.s || '').trim() || String(e.w || '').trim());
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tdb-vs-verse-word' + (hasLex ? ' tdb-vs-verse-word--lex' : '');
      btn.textContent = t.slice(sp.start, sp.end);
      btn.setAttribute(
        'aria-label',
        hasLex ? 'Preview lexicon note for: ' + sp.surface : 'Word study: ' + sp.surface
      );
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        setActiveWordToken(null);
        if (hasLex) {
          showTokenDetail(sp.surface, e);
          var de = document.getElementById('vs-token-detail');
          if (de) {
            try {
              de.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } catch (err) {}
          }
        } else {
          openWordPanelForLemma(sp.surface);
        }
      });
      container.appendChild(btn);
      i = sp.end;
    });
    if (i < t.length) {
      container.appendChild(document.createTextNode(t.slice(i)));
    }
  }

  function openWordPanelForLemma(surface) {
    var W = global.TDBWordStudy;
    if (!W) return;
    var direct = W._openWordStudyPanelDirect;
    if (typeof direct === 'function') {
      direct(stateRef, stateText);
    }
    if (typeof W.runStudy === 'function') {
      setTimeout(function () {
        W.runStudy(surface);
      }, 30);
    }
  }

  function listPanelFocusables(panel) {
    if (!panel || !panel.querySelectorAll) return [];
    var sel =
      'button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])';
    return Array.prototype.slice.call(panel.querySelectorAll(sel)).filter(function (el) {
      var s = window.getComputedStyle(el);
      if (s.visibility === 'hidden' || s.display === 'none') return false;
      return el.getClientRects && el.getClientRects().length > 0;
    });
  }

  function trapPanelTab(ev, panel) {
    var ws = document.getElementById('tdb-wordstudy-layer');
    if (ws && !ws.classList.contains('tdb-ws-hidden')) return;
    if (ev.key !== 'Tab' || !panel) return;
    var list = listPanelFocusables(panel);
    if (list.length < 2) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (ev.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        ev.preventDefault();
      }
    } else if (document.activeElement === last) {
      first.focus();
      ev.preventDefault();
    }
  }

  function injectStyles() {
    if (document.getElementById('tdb-verse-study-styles')) return;
    var st = document.createElement('style');
    st.id = 'tdb-verse-study-styles';
    st.textContent = VS_CSS;
    document.head.appendChild(st);
  }

  function ensureLayer() {
    var stale = document.getElementById('tdb-verse-study-layer');
    if (stale && !document.getElementById('verse-study-sheet')) {
      try {
        stale.remove();
      } catch (e) {}
    }
    if (document.getElementById('tdb-verse-study-layer')) return;
    var layer = document.createElement('div');
    layer.id = 'tdb-verse-study-layer';
    layer.classList.add('tdb-vs-hidden');
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML =
      '<div id="tdb-vs-backdrop" class="tdb-vs-backdrop" tabindex="-1" aria-hidden="true"></div>' +
      '<div id="tdb-vs-panel" role="dialog" aria-modal="true" aria-labelledby="vs-ref" aria-describedby="vs-why-text">' +
      '<div id="verse-study-sheet" class="tdb-calm-sheet">' +
      '<header>' +
      '<h2 id="vs-ref"></h2>' +
      '<button type="button" id="vs-close" aria-label="Close verse study">✕</button>' +
      '</header>' +
      '<div class="vs-verse">' +
      '<p id="vs-full-verse" class="large-kjv" aria-label="Verse text"></p>' +
      '<div id="vs-token-detail" class="vs-token-detail vs-token-detail--empty" role="region" aria-label="Word preview">' +
      '<p class="vs-token-label" id="vs-token-label"></p>' +
      '<p id="vs-token-gloss"></p>' +
      '<p id="vs-token-read" class="hidden"></p>' +
      '<p id="vs-token-why"></p>' +
      '<button type="button" id="vs-token-full-study" class="vs-token-full-study-btn">Open full word study</button>' +
      '</div></div>' +
      '<div class="vs-why">' +
      '<h3>Why this verse matters today</h3>' +
      '<p id="vs-why-text"></p></div>' +
      '<div class="vs-key-words vs-key-words--empty" id="vs-key-words-section">' +
      '<h3>Key words in this verse</h3>' +
      '<div id="vs-key-words-list" class="word-tokens"></div></div>' +
      '<div class="vs-related vs-related--empty">' +
      '<h3>Related passages</h3>' +
      '<div id="vs-related-list"></div></div>' +
      '<div class="vs-audio">' +
      '<button type="button" id="vs-listen-btn" class="btn-primary tdb-vs-listen-btn" aria-label="Listen to this verse on your device">' +
      '<span class="tdb-vs-listen-icon" aria-hidden="true">' +
      SVG_LISTEN +
      '</span><span class="tdb-vs-listen-label">Listen to this verse</span></button>' +
      '<div id="tdb-vs-listen-block" class="tdb-vs-listen-block hidden">' +
      '<div class="tdb-vs-listen-row">' +
      '<button type="button" id="tdb-vs-repeat-verse" class="tdb-vs-repeat-verse-btn">Repeat this verse</button>' +
      '<span id="tdb-vs-listen-hint" class="tdb-vs-foot" style="margin:0;flex:1 1 8rem">KJV on this device — tap Listen above to hear the verse. Use Repeat to hear it again.</span></div>' +
      '<div id="tdb-vs-listen-progress" class="tdb-vs-listen-progress hidden" role="group" aria-label="Narration progress">' +
      '<p id="tdb-vs-listen-progress-label" class="tdb-vs-progress-label"></p>' +
      '<div id="tdb-vs-listen-progress-track" class="tdb-vs-progress-track" role="progressbar" aria-valuemin="1" aria-valuemax="1" aria-valuenow="1">' +
      '<div id="tdb-vs-listen-progress-bar" class="tdb-vs-progress-bar"></div></div></div>' +
      '<details class="tdb-vs-listen-details">' +
      '<summary>Narration options</summary>' +
      '<div class="tdb-vs-listen-opts">' +
      '<label for="tdb-vs-rate">Speed <select id="tdb-vs-rate" aria-label="Narration speed">' +
      '<option value="very_slow">Very slow</option><option value="slow">Slow</option><option value="normal">Normal</option></select></label>' +
      '<label><input type="checkbox" id="tdb-vs-phrase-pause" checked> Pause between phrases</label>' +
      '<label><input type="checkbox" id="tdb-vs-repeat"> Repeat until stopped (loops)</label>' +
      '<div class="tdb-vs-ambient-row">' +
      '<label><input type="checkbox" id="tdb-vs-ambient"> Soft undertone (on-device, optional)</label>' +
      '<label class="tdb-vs-ambient-gain-label" for="tdb-vs-ambient-gain">Undertone strength</label>' +
      '<input type="range" id="tdb-vs-ambient-gain" min="1" max="10" value="5" step="1" aria-label="Undertone strength, 1 quietest to 10 stronger">' +
      '</div></div></details></div></div>' +
      '<div class="vs-actions">' +
      '<button type="button" id="vs-save-mystudy" aria-label="Save this verse study to My Study on this device">Save to My Study</button>' +
      '<button type="button" id="vs-add-memorize" aria-label="Add this verse to your memory list on this device">Add to my memory list</button>' +
      '<button type="button" id="vs-save-journal" aria-label="Save a line about this verse to What God has done on this device">Save to What God has done</button>' +
      '<button type="button" id="vs-print" aria-label="Print this verse study">Print this study</button></div>' +
      '<p class="vs-footer">Everything here stays on your device.</p>' +
      '<p id="vs-status" role="status" aria-live="polite"></p>' +
      '</div></div>';
    document.body.appendChild(layer);
  }

  function wireLayerOnce() {
    var layer = document.getElementById('tdb-verse-study-layer');
    if (!layer || layer.dataset.tdbVsWired === '1') return;
    layer.dataset.tdbVsWired = '1';
    var bd = document.getElementById('tdb-vs-backdrop');
    var cl = document.getElementById('vs-close');
    if (bd) bd.addEventListener('click', close);
    if (cl) cl.addEventListener('click', close);
    layer.addEventListener('keydown', function (ev) {
      var sheet = document.getElementById('verse-study-sheet');
      trapPanelTab(ev, sheet || document.getElementById('tdb-vs-panel'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var ly = document.getElementById('tdb-verse-study-layer');
      if (ly && !ly.classList.contains('tdb-vs-hidden')) {
        var ws = document.getElementById('tdb-wordstudy-layer');
        if (ws && !ws.classList.contains('tdb-ws-hidden')) return;
        close();
      }
    });
    var sheet = document.getElementById('verse-study-sheet');
    if (sheet && sheet.dataset.tdbVsSheetUi !== '1') {
      sheet.dataset.tdbVsSheetUi = '1';
      sheet.addEventListener('click', function (ev) {
        var kbtn = ev.target.closest('.vs-word-token');
        var kwrap = document.getElementById('vs-key-words-list');
        if (kbtn && kwrap && kwrap.contains(kbtn)) {
          var key = kbtn.getAttribute('data-lemma');
          var surface = kbtn.getAttribute('data-surface') || key;
          var ent = stateLexMap && key ? stateLexMap[key] : null;
          setActiveWordToken(kbtn);
          if (ent) showTokenDetail(surface, ent);
          return;
        }
        var rbtn = ev.target.closest('.vs-related-study-btn');
        var rwrap = document.getElementById('vs-related-list');
        if (rbtn && rwrap && rwrap.contains(rbtn)) {
          var ref = rbtn.getAttribute('data-ref');
          if (ref) openRelatedVerse(ref);
        }
      });
    }
    var sm = document.getElementById('vs-save-mystudy');
    var mm = document.getElementById('vs-add-memorize');
    var jn = document.getElementById('vs-save-journal');
    var pr = document.getElementById('vs-print');
    if (sm) sm.addEventListener('click', saveMyStudy);
    if (mm) mm.addEventListener('click', addMemorize);
    if (jn) jn.addEventListener('click', saveJournal);
    if (pr) pr.addEventListener('click', printStudy);
    var fs = document.getElementById('vs-token-full-study');
    if (fs) {
      fs.addEventListener('click', function () {
        if (stateSelectedSurface) openWordPanelForLemma(stateSelectedSurface);
      });
    }
    var ln = document.getElementById('vs-listen-btn');
    if (ln) ln.addEventListener('click', toggleVerseStudyListen);
    var rv = document.getElementById('tdb-vs-repeat-verse');
    if (rv) rv.addEventListener('click', repeatVerseStudyListen);
    var rt = document.getElementById('tdb-vs-rate');
    if (rt) rt.addEventListener('change', readVerseStudyListenPrefsFromForm);
    var ppEl = document.getElementById('tdb-vs-phrase-pause');
    if (ppEl) ppEl.addEventListener('change', readVerseStudyListenPrefsFromForm);
    var rpEl = document.getElementById('tdb-vs-repeat');
    if (rpEl) rpEl.addEventListener('change', readVerseStudyListenPrefsFromForm);
    var amEl = document.getElementById('tdb-vs-ambient');
    if (amEl) {
      amEl.addEventListener('change', function () {
        readVerseStudyListenPrefsFromForm();
        updateAmbientGainDisabled();
      });
    }
    var agEl = document.getElementById('tdb-vs-ambient-gain');
    if (agEl) {
      agEl.addEventListener('input', readVerseStudyListenPrefsFromForm);
      agEl.addEventListener('change', readVerseStudyListenPrefsFromForm);
    }
    syncVerseStudyListenUi();
    if (!global.__tdbVsProgressEv) {
      global.__tdbVsProgressEv = true;
      global.addEventListener('tdb-verse-tts-progress', function (e) {
        updateVerseStudyProgress(e && e.detail);
      });
    }
    if (!global.__tdbVsListenPlayingEv) {
      global.__tdbVsListenPlayingEv = true;
      global.addEventListener('tdb-verse-tts-playing', function (e) {
        if (e && e.detail && e.detail.playing === false) {
          narrationFromVerseStudy = false;
          setVerseStudyListenButtonActive(false);
        }
      });
    }
  }

  function syncVerseStudyListenUi() {
    var N = global.TDBVerseNarration;
    var listenBtn = document.getElementById('vs-listen-btn');
    if (listenBtn) {
      if (!N) listenBtn.classList.add('hidden');
      else listenBtn.classList.remove('hidden');
    }
    var block = document.getElementById('tdb-vs-listen-block');
    if (block) {
      if (!N) block.classList.add('hidden');
      else block.classList.remove('hidden');
    }
    if (!N) return;
    var rate = document.getElementById('tdb-vs-rate');
    var pp = document.getElementById('tdb-vs-phrase-pause');
    var rp = document.getElementById('tdb-vs-repeat');
    var am = document.getElementById('tdb-vs-ambient');
    if (rate) {
      var pr = N.getRatePreset();
      rate.value = N.RATE_PRESETS && N.RATE_PRESETS[pr] != null ? pr : 'slow';
    }
    if (pp) pp.checked = N.getPhrasePause();
    if (rp) rp.checked = N.getRepeat();
    if (am) am.checked = N.getAmbient() === 'soft';
    var ag = document.getElementById('tdb-vs-ambient-gain');
    if (ag && typeof N.getAmbientLevel === 'function') ag.value = String(N.getAmbientLevel());
    updateAmbientGainDisabled();
  }

  function updateAmbientGainDisabled() {
    var am = document.getElementById('tdb-vs-ambient');
    var ag = document.getElementById('tdb-vs-ambient-gain');
    if (!ag) return;
    var on = am && am.checked;
    ag.disabled = !on;
    ag.setAttribute('aria-disabled', on ? 'false' : 'true');
  }

  function readVerseStudyListenPrefsFromForm() {
    var N = global.TDBVerseNarration;
    if (!N) return;
    var rate = document.getElementById('tdb-vs-rate');
    var pp = document.getElementById('tdb-vs-phrase-pause');
    var rp = document.getElementById('tdb-vs-repeat');
    var am = document.getElementById('tdb-vs-ambient');
    var ag = document.getElementById('tdb-vs-ambient-gain');
    if (rate && rate.value) N.setRatePreset(rate.value);
    if (pp) N.setPhrasePause(!!pp.checked);
    if (rp) N.setRepeat(!!rp.checked);
    if (am) N.setAmbient(am.checked ? 'soft' : 'off');
    if (ag && typeof N.setAmbientLevel === 'function') N.setAmbientLevel(ag.value);
  }

  function setVerseStudyListenButtonActive(on) {
    var ln = document.getElementById('vs-listen-btn');
    if (!ln) return;
    var label = ln.querySelector('.tdb-vs-listen-label');
    var icon = ln.querySelector('.tdb-vs-listen-icon');
    ln.classList.toggle('tdb-vs-listen-active', !!on);
    ln.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (label) label.textContent = on ? 'Stop' : 'Listen to this verse';
    if (icon) icon.innerHTML = on ? SVG_STOP : SVG_LISTEN;
    ln.setAttribute('aria-label', on ? 'Stop verse narration' : 'Listen to this verse on your device');
  }

  function updateVerseStudyProgress(detail) {
    var wrap = document.getElementById('tdb-vs-listen-progress');
    var lab = document.getElementById('tdb-vs-listen-progress-label');
    var bar = document.getElementById('tdb-vs-listen-progress-bar');
    var track = document.getElementById('tdb-vs-listen-progress-track');
    if (!wrap || !lab || !bar || !track) return;
    if (!detail || !detail.active || detail.source !== 'verse-study' || !detail.total) {
      wrap.classList.add('hidden');
      lab.textContent = '';
      bar.style.width = '0%';
      return;
    }
    wrap.classList.remove('hidden');
    var i = detail.index;
    var t = detail.total;
    lab.textContent = t === 1 ? 'Reading…' : 'Phrase ' + i + ' of ' + t;
    var pct = Math.min(100, Math.round((i / t) * 100));
    bar.style.width = pct + '%';
    track.setAttribute('aria-valuenow', String(i));
    track.setAttribute('aria-valuemax', String(t));
    track.setAttribute('aria-valuemin', '1');
    track.setAttribute('aria-label', 'Phrase ' + i + ' of ' + t);
  }

  function startVerseStudyNarration() {
    var N = global.TDBVerseNarration;
    if (!N) return;
    var ref = normRefKey(stateRef);
    var body = stateText ? (ref ? ref + '. ' : '') + stateText : '';
    if (!String(body).trim()) return;
    var ok = N.speakPlainText(body, {
      highlightMode: 'verse-study',
      calm: true,
      progressSource: 'verse-study',
      onComplete: function () {
        narrationFromVerseStudy = false;
        setVerseStudyListenButtonActive(false);
      }
    });
    if (ok) {
      narrationFromVerseStudy = true;
      setVerseStudyListenButtonActive(true);
      try {
        if (typeof global.trackEvent === 'function') global.trackEvent('tdb_verse_study_listen', {});
      } catch (e) {}
    }
  }

  function toggleVerseStudyListen() {
    var N = global.TDBVerseNarration;
    if (!N) return;
    if (N.isSpeaking()) {
      N.stop();
      narrationFromVerseStudy = false;
      setVerseStudyListenButtonActive(false);
      return;
    }
    readVerseStudyListenPrefsFromForm();
    startVerseStudyNarration();
  }

  function repeatVerseStudyListen() {
    var N = global.TDBVerseNarration;
    if (!N) return;
    if (N.isSpeaking()) {
      N.stop();
    }
    narrationFromVerseStudy = false;
    setVerseStudyListenButtonActive(false);
    readVerseStudyListenPrefsFromForm();
    startVerseStudyNarration();
    try {
      if (typeof global.trackEvent === 'function') global.trackEvent('tdb_verse_study_listen_repeat', {});
    } catch (e) {}
  }

  function close() {
    if (
      narrationFromVerseStudy &&
      global.TDBVerseNarration &&
      typeof global.TDBVerseNarration.stop === 'function'
    ) {
      global.TDBVerseNarration.stop();
    }
    narrationFromVerseStudy = false;
    setVerseStudyListenButtonActive(false);
    var layer = document.getElementById('tdb-verse-study-layer');
    if (!layer) return;
    layer.classList.add('tdb-vs-hidden');
    layer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('tdb-verse-study-open');
    var ret = focusBefore;
    focusBefore = null;
    if (ret && typeof ret.focus === 'function') {
      try {
        if (ret.isConnected) ret.focus();
      } catch (e) {}
    }
  }

  function saveMyStudy() {
    var st = document.getElementById('vs-status');
    var r = normRefKey(stateRef);
    if (!r) {
      if (st) st.textContent = 'No reference to save.';
      return;
    }
    try {
      var raw = localStorage.getItem(NOTES_KEY);
      var obj = raw ? JSON.parse(raw) : {};
      if (!obj || typeof obj !== 'object') obj = {};
      var lines = [
        'Verse study (overlay)',
        'Ref: ' + r,
        stateText ? 'Text: ' + stateText : '',
        '',
        'Why this verse matters today:',
        stateWhy,
        '',
        'Related passages:',
        stateXrefs.length ? stateXrefs.join('; ') : '(none in curated list)'
      ].filter(Boolean);
      var block = lines.join('\n');
      var prev = String(obj[r] || '').trim();
      obj[r] = prev ? prev + '\n\n' + block : block;
      localStorage.setItem(NOTES_KEY, JSON.stringify(obj));
      if (st) st.textContent = 'Saved to My Study on this device.';
      try {
        if (typeof global.trackEvent === 'function') global.trackEvent('tdb_verse_study_save_mystudy', { ok: true });
      } catch (e) {}
    } catch (err) {
      if (st) st.textContent = 'Could not save. Storage may be full.';
    }
    setTimeout(function () {
      if (st) st.textContent = '';
    }, 3800);
  }

  function addMemorize() {
    var st = document.getElementById('vs-status');
    var comp = global.TDBStudyCompanion;
    var r = normRefKey(stateRef);
    if (!r) {
      if (st) st.textContent = 'No reference to add.';
      return;
    }
    var hasCompanion =
      comp && typeof comp.toggleMemorize === 'function' && typeof comp.isMemorizing === 'function';
    if (hasCompanion) {
      if (comp.isMemorizing(r)) {
        if (st) st.textContent = 'Already on your memory list.';
      } else {
        comp.toggleMemorize(r);
        if (st) st.textContent = 'Added to your memory list on this device.';
        try {
          if (typeof global.trackEvent === 'function') global.trackEvent('tdb_verse_study_memorize', { ok: true });
        } catch (e) {}
      }
    } else if (isMemLiteStored(r)) {
      if (st) st.textContent = 'Already on your memory list.';
    } else if (addMemLiteEntry(r)) {
      if (st) st.textContent = 'Added to your memory list. Open Memorize when you want a quiet review.';
      try {
        if (typeof global.trackEvent === 'function') global.trackEvent('tdb_verse_study_memorize', { ok: true });
      } catch (e) {}
    } else {
      if (st) st.textContent = 'Could not add. Storage may be full.';
    }
    setTimeout(function () {
      if (st) st.textContent = '';
    }, 3200);
  }

  function genWghdId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'wghd_vs_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
  }

  function saveJournal() {
    var st = document.getElementById('vs-status');
    var r = normRefKey(stateRef);
    if (!r || !stateText) {
      if (st) st.textContent = 'Need a verse line to save.';
      return;
    }
    var title = 'Verse study — ' + r;
    var body =
      '\u201c' +
      stateText +
      '\u201d\n\n' +
      stateWhy +
      '\n\n(Saved from Verse study. Open What God has done for the full journal.)';
    if (body.length > WGHD_MAX_BODY) body = body.slice(0, WGHD_MAX_BODY);
    try {
      var raw = localStorage.getItem(WGHD_KEY);
      var p = raw ? JSON.parse(raw) : { version: WGHD_VERSION, entries: [] };
      if (!p || typeof p !== 'object') p = { version: WGHD_VERSION, entries: [] };
      var entries = Array.isArray(p.entries) ? p.entries : [];
      var now = new Date().toISOString();
      var y = now.slice(0, 4);
      var mo = now.slice(5, 7);
      var da = now.slice(8, 10);
      var entryDate = y + '-' + mo + '-' + da;
      entries.unshift({
        id: genWghdId(),
        createdAt: now,
        entryDate: entryDate,
        title: title.slice(0, 120),
        body: body
      });
      p.version = WGHD_VERSION;
      p.entries = entries;
      localStorage.setItem(WGHD_KEY, JSON.stringify(p));
      if (st) st.textContent = 'Saved to What God has done on this device.';
      try {
        if (typeof global.trackEvent === 'function') global.trackEvent('tdb_verse_study_journal', { ok: true });
      } catch (e) {}
    } catch (err) {
      if (st) st.textContent = 'Could not save journal. Storage may be full.';
    }
    setTimeout(function () {
      if (st) st.textContent = '';
    }, 3800);
  }

  function printStudy() {
    var esc = function (s) {
      return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
    var r = normRefKey(stateRef);
    var html =
      '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Verse study</title><style>body{font-family:Georgia,serif;max-width:40rem;margin:1rem auto;line-height:1.58;color:#1c1917;background:#faf7f0;padding:1rem}h1{font-size:1.25rem}.why{padding:.55rem .65rem;border-radius:8px;background:rgba(227,188,103,.16);border:1px solid rgba(227,188,103,.28);margin:1rem 0}.xref{margin-top:1rem;font-size:.95rem}</style></head><body><main><h1>' +
      esc(r) +
      '</h1><p>' +
      esc(stateText) +
      '</p><div class="why"><strong>Why this verse matters today</strong><p>' +
      esc(stateWhy) +
      '</p></div>';
    if (stateXrefs.length) {
      html += '<div class="xref"><strong>Related passages</strong><ul>';
      stateXrefs.forEach(function (x) {
        html += '<li>' + esc(x) + '</li>';
      });
      html += '</ul></div>';
    }
    html +=
      '<p style="margin-top:2rem;font-size:.75rem;color:#666">todaysdailybattle.com &mdash; KJV &mdash; private</p></main></body></html>';
    try {
      var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var w = global.open(url, '_blank', 'noopener,noreferrer');
      if (w) {
        w.addEventListener(
          'load',
          function () {
            try {
              w.print();
            } catch (e) {}
            setTimeout(function () {
              URL.revokeObjectURL(url);
            }, 120000);
          },
          { once: true }
        );
      } else URL.revokeObjectURL(url);
      try {
        if (typeof global.trackEvent === 'function') global.trackEvent('tdb_verse_study_print', { ok: true });
      } catch (e) {}
    } catch (e) {}
  }

  function resolveXrefs(refMap, anchorRaw) {
    var seenK = {};
    var keys = [];
    function pushKey(k) {
      k = normRefKey(k);
      if (!k || seenK[k]) return;
      seenK[k] = true;
      keys.push(k);
    }
    pushKey(anchorRaw);
    pushKey(parseCanonRef(anchorRaw));
    var t = String(anchorRaw || '').trim();
    var rangeM = t.match(/^((?:[1-3]\s+)?[a-zA-Z][a-zA-Z.\s']+?)\s+(\d+)\s*:\s*(\d+)\s*-\s*(\d+)/i);
    if (rangeM) {
      var bk = rangeM[1].replace(/\s+/g, ' ').trim();
      var ch = rangeM[2];
      var v1 = parseInt(rangeM[3], 10);
      var v2 = parseInt(rangeM[4], 10);
      if (!isNaN(v1) && !isNaN(v2) && v2 >= v1 && v2 - v1 < 12) {
        for (var v = v1; v <= v2; v++) {
          pushKey(bk + ' ' + ch + ':' + v);
        }
      }
    }
    for (var i = 0; i < keys.length; i++) {
      var list = refMap[keys[i]];
      if (Array.isArray(list) && list.length) {
        return list
          .map(function (x) {
            return String(x || '')
              .replace(/\s+/g, ' ')
              .trim();
          })
          .filter(Boolean)
          .slice(0, 10);
      }
    }
    return [];
  }

  function open(refRaw, textOpt) {
    injectStyles();
    ensureLayer();
    wireLayerOnce();
    stateRef = normRefKey(refRaw);
    stateText = String(textOpt || '').trim();
    stateLexMap = null;
    var refEl = document.getElementById('vs-ref');
    var verseEl = document.getElementById('vs-full-verse');
    var whyEl = document.getElementById('vs-why-text');
    var relSec = document.querySelector('#verse-study-sheet .vs-related');
    var rlist = document.getElementById('vs-related-list');
    var ksec = document.getElementById('vs-key-words-section');
    var klist = document.getElementById('vs-key-words-list');
    clearTokenDetail();
    if (refEl) refEl.textContent = stateRef ? stateRef + ' (KJV)' : 'Verse study';
    if (whyEl) whyEl.textContent = 'Gathering a gentle read for you…';
    if (verseEl) {
      verseEl.textContent = '';
      if (stateText) verseEl.textContent = stateText;
      else verseEl.textContent = 'Add verse text from this page when you can.';
    }
    if (klist) klist.textContent = '';
    if (ksec) ksec.classList.add('vs-key-words--empty');
    setActiveWordToken(null);
    if (rlist) rlist.textContent = '';
    if (relSec) relSec.classList.add('vs-related--empty');

    focusBefore = document.activeElement;
    var layer = document.getElementById('tdb-verse-study-layer');
    if (layer) {
      layer.classList.remove('tdb-vs-hidden');
      layer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('tdb-verse-study-open');
    }

    Promise.all([fetchLexiconMap(), fetchCrossRefs()]).then(function (res) {
      var lexMap = res[0] || {};
      var refMap = res[1] || {};
      stateLexMap = lexMap;
      var spans = collectSpans(stateText, lexMap);
      stateWhy = buildWhyFromLexicon(stateText, lexMap, spans);
      if (whyEl) whyEl.textContent = stateWhy;
      if (verseEl) renderVerseInteractive(verseEl, stateText, spans, lexMap);
      if (klist) {
        klist.textContent = '';
        var seenKw = {};
        var hasKw = false;
        spans.forEach(function (sp) {
          if (seenKw[sp.key]) return;
          seenKw[sp.key] = true;
          hasKw = true;
          var chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'vs-word-token';
          chip.textContent = formatDisplayWord(sp.surface) || sp.key;
          chip.setAttribute('data-lemma', sp.key);
          chip.setAttribute('data-surface', sp.surface);
          klist.appendChild(chip);
        });
        if (ksec) ksec.classList.toggle('vs-key-words--empty', !hasKw);
      }
      stateXrefs = resolveXrefs(refMap, stateRef);
      if (rlist) {
        rlist.textContent = '';
        if (stateXrefs.length) {
          if (relSec) relSec.classList.remove('vs-related--empty');
          stateXrefs.forEach(function (xr) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'vs-related-study-btn';
            btn.setAttribute('data-ref', xr);
            var st = document.createElement('strong');
            st.textContent = xr;
            var sp = document.createElement('span');
            sp.textContent = 'Study this related verse';
            btn.appendChild(st);
            btn.appendChild(sp);
            rlist.appendChild(btn);
          });
        } else if (relSec) relSec.classList.add('vs-related--empty');
      }
    });

    try {
      if (typeof global.trackEvent === 'function') global.trackEvent('tdb_verse_study_open', {});
    } catch (e) {}

    syncVerseStudyListenUi();

    var closeBtn = document.getElementById('vs-close');
    if (closeBtn) closeBtn.focus();
  }

  function patchWordStudy() {
    var W = global.TDBWordStudy;
    if (!W || W._verseStudyPatched) return;
    W._verseStudyPatched = true;
    W._openWordStudyPanelDirect = W.open;
    W.open = function (refRaw, textOpt) {
      open(refRaw, textOpt);
    };
  }

  function init() {
    patchWordStudy();
  }

  global.TDBVerseStudy = {
    init: init,
    open: open,
    close: close
  };

  if (typeof document !== 'undefined') {
    function boot() {
      if (global.TDBWordStudy && typeof global.TDBWordStudy.open === 'function') {
        init();
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
    setTimeout(boot, 0);
    setTimeout(boot, 400);
  }
})(typeof window !== 'undefined' ? window : this);
