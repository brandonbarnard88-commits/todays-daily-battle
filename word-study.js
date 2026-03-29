/**
 * Shared KJV word study panel — works on any page (reader, My Verses, plans, DQT, Bible Tool, etc.).
 * Depends: none. Optional: window.bible (script.js), window.trackEvent.
 */
(function (global) {
  'use strict';

  var WS_CSS =
    '#tdb-wordstudy-layer{position:fixed;inset:0;z-index:400;display:flex;align-items:flex-end;justify-content:center;padding:0;box-sizing:border-box;font-family:ui-sans-serif,system-ui,Segoe UI,Inter,sans-serif}' +
    '#tdb-wordstudy-layer.tdb-ws-hidden{display:none!important}' +
    '#tdb-ws-backdrop{position:absolute;inset:0;background:rgba(15,18,28,.58);border:0;padding:0;cursor:pointer}' +
    '#tdb-ws-panel{position:relative;z-index:1;width:100%;max-width:32rem;max-height:min(90vh,680px);overflow:auto;margin:0;padding:1rem 1.1rem 1.25rem;border-radius:18px 18px 0 0;border:1px solid rgba(212,200,170,.55);border-bottom:none;background:#faf7f0;box-shadow:0 -16px 48px rgba(28,24,18,.14),0 4px 24px rgba(28,24,18,.08);color:#1c1917}' +
    '@media(min-width:520px){#tdb-wordstudy-layer{align-items:center;padding:1rem}#tdb-ws-panel{border-radius:18px;border-bottom:1px solid rgba(212,200,170,.55);max-height:min(88vh,660px)}}' +
    '@media(max-width:380px){#tdb-ws-panel{padding:.8rem .9rem 1.05rem;border-radius:16px 16px 0 0}#tdb-ws-title{font-size:.95rem}.word-study-panel{padding:.85rem .9rem .9rem}}' +
    '#tdb-ws-header{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem .75rem;margin-bottom:.55rem}' +
    '#tdb-ws-back{min-height:44px;padding:.35rem .8rem;font-size:.88rem;font-weight:600;font-family:inherit;border-radius:10px;border:1px solid rgba(90,78,58,.28);background:#fff;cursor:pointer;color:#292524}' +
    '#tdb-ws-back:hover,#tdb-ws-back:focus-visible{background:#fffdf8;border-color:rgba(138,112,48,.45);outline:2px solid rgba(227,188,103,.5);outline-offset:2px}' +
    '#tdb-ws-title{margin:0;font-size:1rem;font-weight:700;letter-spacing:.02em;color:#6b5a3c;flex:1 1 auto}' +
    '.tdb-ws-filter{width:100%;box-sizing:border-box;min-height:44px;margin:0 0 .6rem;padding:.5rem .7rem;border-radius:11px;border:1px solid rgba(90,78,58,.22);background:#fff;color:#1c1917;font-family:inherit;font-size:.94rem}' +
    '.tdb-ws-anchor-block{margin:0 0 .6rem;padding:.7rem .85rem;border-radius:12px;background:#f3efe6;border:1px solid rgba(138,112,48,.2)}' +
    '.tdb-ws-anchor-ref{margin:0;font-weight:700;color:#7c5c1c;font-size:.95rem}' +
    '.tdb-ws-anchor-text{margin:.35rem 0 0;color:#44403c;font-size:.93rem;line-height:1.58}' +
    '.tdb-ws-hint{margin:0 0 .55rem;font-size:.84rem;line-height:1.5;color:#78716c}' +
    '.tdb-ws-chips{display:flex;flex-wrap:wrap;gap:.35rem;margin:0 0 .6rem}' +
    '.tdb-ws-chip{min-height:40px;padding:.28rem .6rem;font-size:.86rem;font-family:inherit;font-weight:600;border-radius:999px;border:1px solid rgba(138,112,48,.35);background:#fff;color:#292524;cursor:pointer}' +
    '.tdb-ws-chip:hover,.tdb-ws-chip:focus-visible{border-color:rgba(227,188,103,.65);color:#5c4a24;outline:2px solid rgba(227,188,103,.45);outline-offset:2px}' +
    '.tdb-ws-manual-row{display:flex;flex-wrap:wrap;gap:.45rem;align-items:center;margin-bottom:.45rem}' +
    '.tdb-ws-manual-row .tdb-ws-filter{flex:1 1 12rem;margin-bottom:0}' +
    '.tdb-ws-search-btn{min-height:44px;padding:.42rem .9rem;border-radius:10px;border:1px solid rgba(90,78,58,.28);background:#fff;color:#292524;font-weight:600;cursor:pointer;font-family:inherit}' +
    '.tdb-ws-search-btn:hover,.tdb-ws-search-btn:focus-visible{border-color:rgba(138,112,48,.5);outline:2px solid rgba(227,188,103,.45);outline-offset:2px}' +
    '.word-study-panel{margin:.35rem 0 .65rem;padding:1rem 1.05rem 1.05rem;border-radius:14px;background:#fffdf8;border:1px solid rgba(227,188,103,.22);box-shadow:0 6px 22px rgba(28,24,18,.06)}' +
    '.word-study-panel.tdb-ws-hidden{display:none!important}' +
    '.ws-headline{margin:0 0 .75rem;font-size:clamp(1.12rem,3.2vw,1.35rem);font-weight:700;line-height:1.35;color:#292524;letter-spacing:-.015em}' +
    '#ws-word{color:#7c5c1c}' +
    '.ws-gloss{margin:0 0 .85rem}' +
    '#ws-primary-gloss{margin:0;font-size:1.05rem;line-height:1.62;color:#292524}' +
    '#ws-how-to-read{margin:.55rem 0 0;font-size:.95rem;line-height:1.58;color:#57534e}' +
    '#ws-how-to-read.tdb-ws-hidden{display:none!important}' +
    '.ws-why-matters{margin:0 0 .85rem;padding:.7rem .8rem;border-radius:12px;background:rgba(227,188,103,.14);border:1px solid rgba(227,188,103,.28)}' +
    '.ws-why-matters strong{display:block;font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6b5a3c;margin-bottom:.4rem}' +
    '#ws-why-matters-text{margin:0;font-size:.95rem;line-height:1.58;color:#292524}' +
    '.ws-why-matters.tdb-ws-hidden{display:none!important}' +
    '.ws-samples{margin:.5rem 0 .35rem;border-radius:12px;border:1px solid rgba(90,78,58,.15);background:rgba(255,255,255,.65);overflow:hidden}' +
    '.ws-samples summary{cursor:pointer;font-weight:600;color:#5c4a24;min-height:44px;display:flex;align-items:center;padding:.55rem .75rem;list-style:none;font-size:.9rem}' +
    '.ws-samples summary::-webkit-details-marker{display:none}' +
    '.ws-samples .count{font-weight:600;color:#78716c;margin-left:.25rem}' +
    '.ws-samples.tdb-ws-hidden{display:none!important}' +
    '#ws-sample-verses{padding:0 .75rem .75rem;font-size:.92rem}' +
    '#ws-sample-verses ul{list-style:none;margin:0;padding:0}' +
    '#ws-sample-verses li{margin:.28rem 0}' +
    '#ws-sample-verses a{color:#1d4ed8;text-decoration:underline;text-underline-offset:2px;min-height:40px;display:inline-flex;align-items:center}' +
    '.tdb-ws-deep{margin:.55rem 0 .5rem;padding:.55rem .7rem;border-radius:12px;border:1px solid rgba(90,78,58,.12);background:rgba(255,255,255,.5)}' +
    '.tdb-ws-deep summary{cursor:pointer;font-weight:600;color:#6b5a3c;min-height:44px;display:flex;align-items:center;list-style:none;font-size:.88rem}' +
    '.tdb-ws-deep-hint{margin:.35rem 0 0;font-size:.82rem;color:#57534e;line-height:1.48}' +
    '.tdb-ws-deep summary::-webkit-details-marker{display:none}' +
    '.tdb-ws-results{font-size:.92rem;line-height:1.55;color:#292524;margin-top:.35rem}' +
    '.tdb-ws-book{margin:0 0 .8rem}' +
    '.tdb-ws-book.tdb-ws-hidden{display:none!important}' +
    '.tdb-ws-book h3{margin:0 0 .35rem;font-size:.88rem;color:#7c5c1c;font-weight:700}' +
    '.tdb-ws-book ul{list-style:none;margin:0;padding:0}' +
    '.tdb-ws-book li{margin:.2rem 0}' +
    '.tdb-ws-book a{color:#1d4ed8;text-decoration:underline;text-underline-offset:2px;min-height:40px;display:inline-flex;align-items:center}' +
    '#tdb-ws-empty{font-size:.9rem;color:#57534e;margin:0 0 .55rem;line-height:1.5}' +
    '#tdb-ws-status{font-size:.84rem;color:#78716c;margin:0 0 .5rem;line-height:1.45}' +
    '.ws-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.65rem}' +
    '.ws-actions button{min-height:44px;padding:.45rem .9rem;border-radius:10px;border:1px solid rgba(138,112,48,.4);background:rgba(227,188,103,.2);color:#3d3319;font-weight:600;cursor:pointer;font-family:inherit;font-size:.88rem}' +
    '.ws-actions button:last-child{background:#fff;border-color:rgba(90,78,58,.25);color:#292524}' +
    '.ws-actions button:hover,.ws-actions button:focus-visible{outline:2px solid rgba(227,188,103,.5);outline-offset:2px}' +
    '.ws-footer-note{margin:.75rem 0 0;font-size:.8rem;line-height:1.45;color:#78716c}' +
    '#tdb-ws-save-status{margin:.45rem 0 0;font-size:.84rem;min-height:1.25em;color:#57534e}' +
    'body.tdb-wordstudy-open{overflow:hidden}';

  var NOTES_KEY = 'tdb_bible_tool_notes';
  var anchorRef = '';
  var verseText = '';
  var lastPayload = null;
  var lexiconMap = null;
  var lexiconPromise = null;
  var bibleLocal = null;
  var biblePromise = null;
  var concCache = typeof Map !== 'undefined' ? new Map() : null;
  var wired = false;
  var globalSyncWired = false;

  function syncHeroWordStudyButton() {
    var btn = document.getElementById('heroWordStudyBtn');
    if (!btn) return;
    var refEl = document.getElementById('heroRef');
    var verseEl = document.getElementById('heroVerse');
    var ref = refEl ? String(refEl.textContent || '').replace(/\s*\(KJV\)\s*$/i, '').trim() : '';
    var raw = verseEl ? String(verseEl.textContent || '') : '';
    var text = raw.replace(/^[\s"\u201c]+|[\s"\u201d]+$/g, '').replace(/\s+/g, ' ').trim();
    if (!ref) {
      btn.hidden = true;
      btn.setAttribute('aria-hidden', 'true');
      return;
    }
    btn.hidden = false;
    btn.removeAttribute('aria-hidden');
    btn.setAttribute('data-tdb-wordstudy-ref', ref);
    if (text) btn.setAttribute('data-tdb-wordstudy-text', text);
    else btn.removeAttribute('data-tdb-wordstudy-text');
    btn.setAttribute('aria-label', 'Word study for ' + ref);
  }

  function syncVersePageWordStudyButton() {
    var btn = document.getElementById('verse-page-word-study');
    if (!btn) return;
    var card = document.getElementById('daily-verse-card');
    var refEl = card && card.querySelector('strong');
    var p = card && (card.querySelector('strong + p') || card.querySelector('p'));
    var ref = refEl ? String(refEl.textContent || '').replace(/\s*\(KJV\)\s*$/i, '').trim() : '';
    var text = p ? String(p.textContent || '').replace(/\s+/g, ' ').trim() : '';
    if (!ref) {
      btn.hidden = true;
      btn.setAttribute('aria-hidden', 'true');
      return;
    }
    btn.hidden = false;
    btn.removeAttribute('aria-hidden');
    btn.setAttribute('data-tdb-wordstudy-ref', ref);
    if (text) btn.setAttribute('data-tdb-wordstudy-text', text);
    else btn.removeAttribute('data-tdb-wordstudy-text');
    btn.setAttribute('aria-label', 'Word study for ' + ref);
  }

  function wireGlobalWordStudyAnchors() {
    syncHeroWordStudyButton();
    syncVersePageWordStudyButton();
    if (globalSyncWired) return;
    globalSyncWired = true;
    if (typeof global.addEventListener === 'function') {
      global.addEventListener('tdb-hero-verse-updated', syncHeroWordStudyButton);
      global.addEventListener('tdb-daily-verse-updated', syncVersePageWordStudyButton);
    }
  }

  function escapeRe(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function normRefKey(r) {
    return String(r || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function parseRefLoose(raw) {
    var t = String(raw || '').trim();
    var m = t.match(/^((?:[1-3]\s+)?[a-zA-Z][a-zA-Z.\s']+?)\s+(\d+)\s*:\s*(\d+)$/i);
    if (!m) return null;
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

  function normKjvToken(w) {
    return String(w || '')
      .replace(/^[^a-zA-Z']+/g, '')
      .replace(/[^a-zA-Z']+$/g, '')
      .trim();
  }

  function formatDisplayWord(t) {
    var s = String(t || '').trim();
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function normalizeBibleArray(data) {
    var obj = {};
    if (Array.isArray(data)) {
      data.forEach(function (v) {
        if (v && v.ref) obj[String(v.ref).replace(/\s+/g, ' ').trim()] = String(v.text || '');
      });
      return obj;
    }
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(function (k) {
        obj[k.replace(/\s+/g, ' ').trim()] = String(data[k] || '');
      });
    }
    return obj;
  }

  function getBibleObject() {
    if (typeof global.bible !== 'undefined' && global.bible && Object.keys(global.bible).length > 8000) {
      return Promise.resolve(global.bible);
    }
    if (bibleLocal && Object.keys(bibleLocal).length > 8000) return Promise.resolve(bibleLocal);
    if (biblePromise) return biblePromise;
    var origin = '';
    try {
      origin = global.location && global.location.origin ? global.location.origin : '';
    } catch (e) {
      origin = '';
    }
    var urls = ['kjv.json'];
    if (origin) urls.push(origin.replace(/\/$/, '') + '/kjv.json');
    urls.push('https://todaysdailybattle.com/kjv.json');
    biblePromise = (function tryFetch(i) {
      if (i >= urls.length) return Promise.resolve({});
      return fetch(urls[i], { credentials: 'same-origin' })
        .then(function (res) {
          return res.ok ? res.json() : Promise.reject();
        })
        .then(function (d) {
          bibleLocal = normalizeBibleArray(d);
          if (Object.keys(bibleLocal).length > 8000) return bibleLocal;
          return tryFetch(i + 1);
        })
        .catch(function () {
          return tryFetch(i + 1);
        });
    })(0);
    return biblePromise;
  }

  function ensureLexicon() {
    if (lexiconMap) return Promise.resolve(lexiconMap);
    if (lexiconPromise) return lexiconPromise;
    lexiconPromise = fetch('kjv-lexicon.json', { credentials: 'same-origin' })
      .then(function (res) {
        return res.ok ? res.json() : {};
      })
      .then(function (data) {
        lexiconMap = {};
        var w = data && data.words && typeof data.words === 'object' ? data.words : {};
        Object.keys(w).forEach(function (k) {
          var e = w[k];
          var key = k.toLowerCase();
          if (e && typeof e === 'object') {
            lexiconMap[key] = {
              g: String(e.g != null ? e.g : '').trim(),
              s: String(e.s != null ? e.s : '').trim(),
              w: String(e.w != null ? e.w : '').trim(),
              x: Array.isArray(e.x) ? e.x : []
            };
          } else {
            lexiconMap[key] = { g: String(e || '').trim(), s: '', w: '', x: [] };
          }
        });
        return lexiconMap;
      })
      .catch(function () {
        lexiconMap = {};
        return lexiconMap;
      });
    return lexiconPromise;
  }

  function lookupLexicon(token) {
    if (!lexiconMap || !token) return null;
    var k = String(token).toLowerCase();
    if (lexiconMap[k]) return lexiconMap[k];
    if (k.length > 4 && k.slice(-1) === 's') {
      var base = k.slice(0, -1);
      if (lexiconMap[base]) return lexiconMap[base];
    }
    return null;
  }

  function collectConcordance(bibleObj, normalizedToken) {
    var key = String(normalizedToken || '').toLowerCase();
    if (!key || key.length < 2) return { byBook: {}, total: 0, capped: 0 };
    if (concCache && concCache.has(key)) return concCache.get(key);
    var esc = escapeRe(key);
    var re = new RegExp('\\b' + esc + '\\b', 'i');
    var byBook = {};
    var total = 0;
    var maxRefs = 240;
    var refs = Object.keys(bibleObj || {});
    for (var i = 0; i < refs.length; i++) {
      var ref = refs[i];
      var raw = String(bibleObj[ref] || '').replace(/<[^>]+>/g, ' ');
      if (!re.test(raw)) continue;
      total++;
      if (total > maxRefs) continue;
      var m = String(ref).match(/^(.+)\s(\d+):(\d+)$/);
      var book = m ? m[1].trim() : 'Scripture';
      if (!byBook[book]) byBook[book] = [];
      byBook[book].push(ref);
    }
    var capped = total > maxRefs ? total - maxRefs : 0;
    var out = { byBook: byBook, total: total, capped: capped };
    if (concCache && concCache.size < 100) concCache.set(key, out);
    return out;
  }

  function injectStyles() {
    if (document.getElementById('tdb-wordstudy-styles')) return;
    var st = document.createElement('style');
    st.id = 'tdb-wordstudy-styles';
    st.textContent = WS_CSS;
    document.head.appendChild(st);
  }

  function ensureLayer() {
    if (document.getElementById('tdb-wordstudy-layer')) return;
    var layer = document.createElement('div');
    layer.id = 'tdb-wordstudy-layer';
    layer.classList.add('tdb-ws-hidden');
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML =
      '<div id="tdb-ws-backdrop" class="tdb-ws-backdrop" tabindex="-1" aria-hidden="true"></div>' +
      '<div id="tdb-ws-panel" role="dialog" aria-modal="true" aria-labelledby="tdb-ws-title">' +
      '<div id="tdb-ws-header">' +
      '<button type="button" id="tdb-ws-back">Back</button>' +
      '<h2 id="tdb-ws-title">Word study</h2></div>' +
      '<div class="tdb-ws-anchor-block"><p id="tdb-ws-anchor-ref" class="tdb-ws-anchor-ref"></p>' +
      '<p id="tdb-ws-anchor-text" class="tdb-ws-anchor-text"></p></div>' +
      '<p class="tdb-ws-hint">Tap a word, or type and search. Whole-word matches across the KJV (offline once loaded).</p>' +
      '<div id="tdb-ws-chips" class="tdb-ws-chips" aria-label="Words in this verse"></div>' +
      '<div class="tdb-ws-manual-row"><label class="sr-only" for="tdb-ws-manual">Word</label>' +
      '<input id="tdb-ws-manual" class="tdb-ws-filter" type="text" autocomplete="off" placeholder="Type a KJV word…">' +
      '<button type="button" id="tdb-ws-search-btn" class="tdb-ws-search-btn">Search</button></div>' +
      '<label class="sr-only" for="tdb-ws-filter">Filter concordance</label>' +
      '<input id="tdb-ws-filter" class="tdb-ws-filter" type="search" autocomplete="off" placeholder="Filter by book or reference…">' +
      '<div id="tdb-ws-word-panel" class="word-study-panel tdb-ws-hidden" hidden>' +
      '<h3 class="ws-headline" id="tdb-ws-headline">\u201c<span id="ws-word"></span>\u201d in the KJV</h3>' +
      '<div class="ws-gloss">' +
      '<p id="ws-primary-gloss"></p>' +
      '<p id="ws-how-to-read" class="ws-note"></p></div>' +
      '<div class="ws-why-matters" id="ws-why-wrap">' +
      '<strong>Why this word matters today:</strong>' +
      '<p id="ws-why-matters-text"></p></div>' +
      '<details class="ws-samples" id="ws-samples-details">' +
      '<summary>Sample verses using this word <span class="count" id="ws-sample-count-label"></span></summary>' +
      '<div id="ws-sample-verses"></div></details></div>' +
      '<details class="tdb-ws-deep"><summary>About this list</summary>' +
      '<p class="tdb-ws-deep-hint">Below is a whole-word concordance for this English form in the KJV text we ship. It is not Greek or Hebrew; use it to see how the same English word carries in different verses.</p></details>' +
      '<div id="tdb-ws-body" class="tdb-ws-results"></div>' +
      '<p id="tdb-ws-empty" role="status">Tap a word above, or type and search.</p>' +
      '<p id="tdb-ws-status" role="status" aria-live="polite"></p>' +
      '<div class="ws-actions">' +
      '<button type="button" id="ws-save-to-mystudy" aria-label="Save this word study to My Study with the current verse notes">Save to My Study</button>' +
      '<button type="button" id="ws-print">Print this study</button></div>' +
      '<p class="ws-footer-note">Everything here is drawn from the KJV and stays on your device.</p>' +
      '<p id="tdb-ws-save-status" role="status" aria-live="polite"></p>' +
      '</div>';
    document.body.appendChild(layer);
  }

  function close() {
    var layer = document.getElementById('tdb-wordstudy-layer');
    if (!layer) return;
    layer.classList.add('tdb-ws-hidden');
    layer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('tdb-wordstudy-open');
  }

  function clearResults() {
    var body = document.getElementById('tdb-ws-body');
    var emptyEl = document.getElementById('tdb-ws-empty');
    var status = document.getElementById('tdb-ws-status');
    var panel = document.getElementById('tdb-ws-word-panel');
    var ww = document.getElementById('ws-word');
    var pg = document.getElementById('ws-primary-gloss');
    var hr = document.getElementById('ws-how-to-read');
    var whyW = document.getElementById('ws-why-wrap');
    var whyT = document.getElementById('ws-why-matters-text');
    var sampD = document.getElementById('ws-samples-details');
    var sampV = document.getElementById('ws-sample-verses');
    var sampL = document.getElementById('ws-sample-count-label');
    if (body) body.textContent = '';
    if (emptyEl) {
      emptyEl.textContent = 'Tap a word above, or type and search.';
      emptyEl.classList.remove('tdb-ws-hidden');
    }
    if (status) status.textContent = '';
    if (panel) {
      panel.classList.add('tdb-ws-hidden');
      panel.hidden = true;
    }
    if (ww) ww.textContent = '';
    if (pg) pg.textContent = '';
    if (hr) {
      hr.textContent = '';
      hr.classList.add('tdb-ws-hidden');
    }
    if (whyT) whyT.textContent = '';
    if (whyW) {
      whyW.classList.add('tdb-ws-hidden');
      whyW.hidden = true;
    }
    if (sampV) sampV.textContent = '';
    if (sampL) sampL.textContent = '';
    if (sampD) {
      sampD.classList.add('tdb-ws-hidden');
      sampD.open = false;
    }
    lastPayload = null;
  }

  function applyFilter(q) {
    var qq = String(q || '')
      .trim()
      .toLowerCase();
    document.querySelectorAll('#tdb-ws-body .tdb-ws-book').forEach(function (block) {
      var blob = (block.dataset.tdbWsFilter || '').toLowerCase();
      block.classList.toggle('tdb-ws-hidden', !!qq && blob.indexOf(qq) === -1);
    });
  }

  function renderResults(displayToken, conc) {
    var body = document.getElementById('tdb-ws-body');
    var emptyEl = document.getElementById('tdb-ws-empty');
    var status = document.getElementById('tdb-ws-status');
    var panel = document.getElementById('tdb-ws-word-panel');
    var ww = document.getElementById('ws-word');
    var pg = document.getElementById('ws-primary-gloss');
    var hr = document.getElementById('ws-how-to-read');
    var whyW = document.getElementById('ws-why-wrap');
    var whyT = document.getElementById('ws-why-matters-text');
    var sampD = document.getElementById('ws-samples-details');
    var sampV = document.getElementById('ws-sample-verses');
    var sampL = document.getElementById('ws-sample-count-label');
    if (!body) return;
    body.textContent = '';
    var lex = lookupLexicon(displayToken) || { g: '', s: '', w: '', x: [] };
    var lexSnap = {
      g: lex.g || '',
      s: lex.s || '',
      w: lex.w || '',
      sampleRefs: Array.isArray(lex.x) ? lex.x.slice() : []
    };
    if (panel) {
      panel.classList.remove('tdb-ws-hidden');
      panel.hidden = false;
    }
    if (ww) ww.textContent = formatDisplayWord(displayToken);
    if (pg) {
      if (lex.g) {
        pg.textContent = lex.g;
      } else {
        pg.textContent =
          'No curated gloss for this exact English form yet. The sample list (if any) and the concordance below still help you see how this word travels through the KJV.';
      }
    }
    if (hr) {
      if (lex.s) {
        hr.textContent = lex.s;
        hr.classList.remove('tdb-ws-hidden');
      } else {
        hr.textContent = '';
        hr.classList.add('tdb-ws-hidden');
      }
    }
    if (whyW && whyT) {
      if (lex.w) {
        whyT.textContent = lex.w;
        whyW.classList.remove('tdb-ws-hidden');
        whyW.hidden = false;
      } else {
        whyT.textContent = '';
        whyW.classList.add('tdb-ws-hidden');
        whyW.hidden = true;
      }
    }
    if (sampV && sampD && sampL) {
      sampV.textContent = '';
      var xlist = lex.x && lex.x.length ? lex.x : [];
      if (xlist.length) {
        sampD.classList.remove('tdb-ws-hidden');
        sampL.textContent = ' (' + xlist.length + ')';
        var ul = document.createElement('ul');
        xlist.forEach(function (ref) {
          var r = String(ref || '').replace(/\s+/g, ' ').trim();
          if (!r) return;
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = buildReaderUrl(r, anchorRef);
          a.textContent = r;
          li.appendChild(a);
          ul.appendChild(li);
        });
        sampV.appendChild(ul);
      } else {
        sampL.textContent = '';
        sampD.classList.add('tdb-ws-hidden');
        sampD.open = false;
      }
    }
    if (emptyEl) emptyEl.classList.add('tdb-ws-hidden');
    var books = Object.keys(conc.byBook || {}).sort(function (a, b) {
      return a.localeCompare(b);
    });
    if (!books.length) {
      if (emptyEl) {
        emptyEl.textContent =
          'No matches, or the full Bible text is still loading. Try again shortly, or open from Home once.';
        emptyEl.classList.remove('tdb-ws-hidden');
      }
      lastPayload = {
        anchorRef: anchorRef,
        displayWord: displayToken,
        verseSnippet: verseText,
        total: 0,
        groups: [],
        lex: lexSnap
      };
      return;
    }
    var groups = [];
    books.forEach(function (bk) {
      var refs = conc.byBook[bk] || [];
      var sec = document.createElement('section');
      sec.className = 'tdb-ws-book';
      sec.dataset.tdbWsFilter = bk + ' ' + refs.join(' ');
      var h3 = document.createElement('h3');
      h3.textContent = bk;
      sec.appendChild(h3);
      var ul = document.createElement('ul');
      refs.forEach(function (vr) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = buildReaderUrl(vr, anchorRef);
        a.textContent = vr;
        li.appendChild(a);
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      body.appendChild(sec);
      groups.push({ book: bk, refs: refs.slice() });
    });
    var shown = Object.values(conc.byBook).reduce(function (n, a) {
      return n + a.length;
    }, 0);
    var msg = conc.total + ' verse' + (conc.total === 1 ? '' : 's') + ' use this form (whole word).';
    if (conc.capped) msg += ' Showing first ' + shown + '.';
    if (status) status.textContent = msg;
    lastPayload = {
      anchorRef: anchorRef,
      displayWord: displayToken,
      verseSnippet: verseText,
      total: conc.total,
      groups: groups,
      lex: lexSnap
    };
  }

  function runStudy(rawToken) {
    var norm = normKjvToken(rawToken);
    if (norm.length < 2) return;
    var fi = document.getElementById('tdb-ws-filter');
    if (fi) fi.value = '';
    Promise.all([getBibleObject(), ensureLexicon()]).then(function (res) {
      var bo = res[0];
      if (!bo || Object.keys(bo).length < 100) {
        clearResults();
        var emptyEl = document.getElementById('tdb-ws-empty');
        if (emptyEl) {
          emptyEl.textContent =
            'Bible text is still loading. Wait a moment, open the homepage once, or try again.';
          emptyEl.classList.remove('tdb-ws-hidden');
        }
        return;
      }
      var conc = collectConcordance(bo, norm);
      renderResults(norm, conc);
      try {
        if (typeof global.trackEvent === 'function') global.trackEvent('tdb_wordstudy_run', { hits: conc.total });
      } catch (e) {}
    });
  }

  function populateChips(text) {
    var wrap = document.getElementById('tdb-ws-chips');
    if (!wrap) return;
    wrap.textContent = '';
    var tokens = String(text).match(/\S+/g) || [];
    tokens.forEach(function (tok) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tdb-ws-chip';
      btn.textContent = tok;
      btn.setAttribute('aria-label', 'Study word: ' + tok);
      btn.addEventListener('click', function () {
        runStudy(tok);
      });
      wrap.appendChild(btn);
    });
  }

  function saveToMyStudy() {
    var p = lastPayload;
    var st = document.getElementById('tdb-ws-save-status');
    if (!p || !p.anchorRef || !p.displayWord) {
      if (st) st.textContent = 'Pick a word first.';
      return;
    }
    try {
      var raw = localStorage.getItem(NOTES_KEY);
      var obj = raw ? JSON.parse(raw) : {};
      if (!obj || typeof obj !== 'object') obj = {};
      var r = normRefKey(p.anchorRef);
      var lx = p.lex || {};
      var glossLines = [];
      if (lx.g) glossLines.push('Primary gloss: ' + lx.g);
      if (lx.s) glossLines.push('How to read it: ' + lx.s);
      if (lx.w) glossLines.push('Why it matters today: ' + lx.w);
      var bookLines = (p.groups || []).map(function (g) {
        return g.book + ': ' + g.refs.join('; ');
      });
      var parts = ['KJV word study — “' + p.displayWord + '” (from ' + r + ')'];
      if (p.verseSnippet) parts.push('Verse: ' + p.verseSnippet);
      parts = parts.concat(glossLines).concat(['Occurrences (' + p.total + '):']).concat(bookLines);
      var lines = parts.filter(Boolean).join('\n');
      var prev = String(obj[r] || '').trim();
      obj[r] = prev ? prev + '\n\n' + lines : lines;
      localStorage.setItem(NOTES_KEY, JSON.stringify(obj));
      if (st) st.textContent = 'Saved to My Study on this device.';
      try {
        if (typeof global.trackEvent === 'function') global.trackEvent('tdb_wordstudy_save_mystudy', { ok: true });
      } catch (e) {}
    } catch (err) {
      if (st) st.textContent = 'Could not save. Storage may be full.';
    }
    setTimeout(function () {
      if (st) st.textContent = '';
    }, 3800);
  }

  function printSheet() {
    var p = lastPayload;
    if (!p || !p.displayWord) return;
    var esc = function (s) {
      return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
    var lx = p.lex || {};
    var bodyHtml =
      '<p class="r">' + esc(p.anchorRef) + '</p><p>' + esc(p.verseSnippet) + '</p><h2>\u201c' + esc(formatDisplayWord(p.displayWord)) + '\u201d in the KJV</h2>';
    if (lx.g) bodyHtml += '<p class="g"><strong>Primary gloss</strong> — ' + esc(lx.g) + '</p>';
    if (lx.s) bodyHtml += '<p class="g"><strong>How to read it</strong> — ' + esc(lx.s) + '</p>';
    if (lx.w) bodyHtml += '<p class="g why"><strong>Why this word matters today</strong> — ' + esc(lx.w) + '</p>';
    if (lx.sampleRefs && lx.sampleRefs.length) {
      bodyHtml += '<p class="cap">Sample verses</p><ul>';
      lx.sampleRefs.forEach(function (ref) {
        var rr = String(ref || '').trim();
        if (rr) bodyHtml += '<li>' + esc(rr) + '</li>';
      });
      bodyHtml += '</ul>';
    }
    bodyHtml += '<p class="tot">' + esc(String(p.total)) + ' KJV verse(s) use this form (whole word).</p>';
    (p.groups || []).forEach(function (g) {
      bodyHtml += '<h3>' + esc(g.book) + '</h3><ul>';
      g.refs.forEach(function (r) {
        bodyHtml += '<li>' + esc(r) + '</li>';
      });
      bodyHtml += '</ul>';
    });
    var html =
      '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>KJV word study</title><style>body{font-family:Georgia,serif;max-width:40rem;margin:1rem auto;line-height:1.58;color:#1c1917;background:#faf7f0;padding:1rem}.r{font-weight:700}h2{font-size:1.35rem}.g{margin:.5rem 0}.g.why{padding:.55rem .65rem;border-radius:8px;background:rgba(227,188,103,.16);border:1px solid rgba(227,188,103,.28)}.cap{font-weight:700;margin:.85rem 0 .35rem;font-size:.95rem}.tot{color:#44403c;margin:.65rem 0}</style></head><body><main>' +
      bodyHtml +
      '</main></body></html>';
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
    } catch (e) {}
  }

  function wire() {
    if (wired) return;
    wired = true;
    document.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-tdb-wordstudy-ref]');
      if (!t) return;
      ev.preventDefault();
      var r = t.getAttribute('data-tdb-wordstudy-ref');
      var txt = t.getAttribute('data-tdb-wordstudy-text') || '';
      if (r) open(r, txt);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var layer = document.getElementById('tdb-wordstudy-layer');
      if (layer && !layer.classList.contains('tdb-ws-hidden')) close();
    });
  }

  function wireLayerOnce() {
    var layer = document.getElementById('tdb-wordstudy-layer');
    if (!layer || layer.dataset.tdbWired === '1') return;
    layer.dataset.tdbWired = '1';
    var bd = document.getElementById('tdb-ws-backdrop');
    var bk = document.getElementById('tdb-ws-back');
    if (bd) bd.addEventListener('click', close);
    if (bk) bk.addEventListener('click', close);
    var sv = document.getElementById('ws-save-to-mystudy');
    if (sv) sv.addEventListener('click', saveToMyStudy);
    var pr = document.getElementById('ws-print');
    if (pr) pr.addEventListener('click', printSheet);
    var fl = document.getElementById('tdb-ws-filter');
    if (fl) fl.addEventListener('input', function () {
      applyFilter(fl.value);
    });
    var go = document.getElementById('tdb-ws-search-btn');
    var man = document.getElementById('tdb-ws-manual');
    var runM = function () {
      if (man) runStudy(man.value || '');
    };
    if (go) go.addEventListener('click', runM);
    if (man) {
      man.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          runM();
        }
      });
    }
  }

  function init() {
    injectStyles();
    ensureLayer();
    wireLayerOnce();
    wire();
    wireGlobalWordStudyAnchors();
  }

  function open(refRaw, textOpt) {
    init();
    var canon = parseRefLoose(refRaw) || normRefKey(refRaw);
    anchorRef = canon;
    verseText = String(textOpt || '').trim();
    var ar = document.getElementById('tdb-ws-anchor-ref');
    var at = document.getElementById('tdb-ws-anchor-text');
    if (ar) ar.textContent = anchorRef;
    if (at) at.textContent = verseText || 'Add text from the verse on this page when you can.';
    var layer = document.getElementById('tdb-wordstudy-layer');
    var fi = document.getElementById('tdb-ws-filter');
    var man = document.getElementById('tdb-ws-manual');
    if (fi) fi.value = '';
    if (man) man.value = '';
    populateChips(verseText);
    clearResults();
    ensureLexicon().catch(function () {});
    if (layer) {
      layer.classList.remove('tdb-ws-hidden');
      layer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('tdb-wordstudy-open');
    }
    try {
      if (typeof global.trackEvent === 'function') global.trackEvent('tdb_wordstudy_open', {});
    } catch (e) {}
    var backBtn = document.getElementById('tdb-ws-back');
    if (backBtn) backBtn.focus();
  }

  global.TDBWordStudy = {
    init: init,
    open: open,
    close: close,
    runStudy: runStudy,
    syncHeroWordStudyButton: syncHeroWordStudyButton,
    syncVersePageWordStudyButton: syncVersePageWordStudyButton
  };

  /** So [data-tdb-wordstudy-ref] works before the first open() on any page. */
  function bootWordStudyUi() {
    try {
      init();
    } catch (e) {}
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootWordStudyUi);
    } else {
      bootWordStudyUi();
    }
  }
})(typeof window !== 'undefined' ? window : this);
