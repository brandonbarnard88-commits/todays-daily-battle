/**
 * Rich "Verse study" overlay — opens from Study this verse (wraps TDBWordStudy.open).
 * Depends: word-study.js (TDBWordStudy). Optional: TDBStudyCompanion, trackEvent.
 */
(function (global) {
  'use strict';

  var NOTES_KEY = 'tdb_bible_tool_notes';
  var MEM_LITE_KEY = 'tdb_memorize_lite_v1';
  var WGHD_KEY = 'tdb_what_god_has_done_v1';
  var WGHD_MAX_BODY = 800;
  var WGHD_VERSION = 1;

  var VS_CSS =
    '#tdb-verse-study-layer{position:fixed;inset:0;z-index:395;display:flex;align-items:flex-end;justify-content:center;padding:0;box-sizing:border-box;font-family:ui-sans-serif,system-ui,Segoe UI,Inter,sans-serif}' +
    '#tdb-verse-study-layer.tdb-vs-hidden{display:none!important}' +
    '#tdb-vs-backdrop{position:absolute;inset:0;background:rgba(15,18,28,.62);border:0;padding:0;cursor:pointer}' +
    '#tdb-vs-panel{position:relative;z-index:1;width:100%;max-width:26rem;max-height:min(92vh,720px);overflow:auto;margin:0;padding:1rem 1.1rem calc(1.2rem + env(safe-area-inset-bottom,0px));border-radius:18px 18px 0 0;border:1px solid rgba(212,200,170,.55);border-bottom:none;background:linear-gradient(180deg,#fffdf8 0%,#faf7f0 38%);box-shadow:0 -20px 56px rgba(28,24,18,.16),0 4px 24px rgba(28,24,18,.08);color:#1c1917}' +
    '@media(min-width:560px){#tdb-verse-study-layer{align-items:center;padding:1rem}#tdb-vs-panel{border-radius:18px;border-bottom:1px solid rgba(212,200,170,.55);max-height:min(90vh,700px);padding-bottom:1.25rem}}' +
    '#tdb-vs-header{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem .75rem;margin-bottom:.65rem}' +
    '#tdb-vs-close{min-height:44px;padding:.35rem .85rem;font-size:.88rem;font-weight:600;font-family:inherit;border-radius:10px;border:1px solid rgba(90,78,58,.28);background:#fff;cursor:pointer;color:#292524}' +
    '#tdb-vs-close:hover,#tdb-vs-close:focus-visible{outline:2px solid rgba(227,188,103,.5);outline-offset:2px}' +
    '#tdb-vs-title{margin:0;font-size:1.02rem;font-weight:700;letter-spacing:.02em;color:#6b5a3c;flex:1 1 auto}' +
    '#tdb-vs-ref{margin:0 0 .35rem;font-size:clamp(1.05rem,3.2vw,1.28rem);font-weight:700;color:#7c5c1c;line-height:1.25}' +
    '#tdb-vs-verse{margin:0 0 .85rem;font-size:clamp(1.12rem,3.4vw,1.35rem);line-height:1.62;color:#1c1917;font-family:Georgia,ui-serif,serif}' +
    '.tdb-vs-verse-word{background:transparent;border:0;padding:0;margin:0;font:inherit;color:inherit;cursor:pointer;text-decoration:underline;text-decoration-color:rgba(124,92,28,.45);text-underline-offset:3px;border-radius:4px}' +
    '.tdb-vs-verse-word:hover,.tdb-vs-verse-word:focus-visible{background:rgba(227,188,103,.2);outline:2px solid rgba(227,188,103,.45);outline-offset:1px}' +
    '.tdb-vs-verse-word--lex{font-weight:600;color:#5c4a24}' +
    '#tdb-vs-why-block{margin:0 0 1rem;padding:.75rem .85rem;border-radius:14px;background:rgba(227,188,103,.14);border:1px solid rgba(227,188,103,.28)}' +
    '#tdb-vs-why-label{margin:0 0 .4rem;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b5a3c}' +
    '#tdb-vs-why-text{margin:0;font-size:.93rem;line-height:1.58;color:#292524}' +
    '#tdb-vs-xref-block{margin:0 0 1rem}' +
    '#tdb-vs-xref-label{margin:0 0 .4rem;font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#78716c}' +
    '#tdb-vs-xref-list{list-style:none;margin:0;padding:0}' +
    '#tdb-vs-xref-list li{margin:.28rem 0}' +
    '#tdb-vs-xref-list a{color:#1d4ed8;text-decoration:underline;text-underline-offset:2px;font-size:.9rem;font-weight:600}' +
    '.tdb-vs-actions{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.25rem}' +
    '.tdb-vs-actions button{min-height:44px;padding:.42rem .75rem;border-radius:10px;border:1px solid rgba(90,78,58,.25);background:#fff;color:#292524;font-weight:600;font-size:.82rem;cursor:pointer;font-family:inherit}' +
    '.tdb-vs-actions button:hover,.tdb-vs-actions button:focus-visible{outline:2px solid rgba(227,188,103,.45);outline-offset:2px}' +
    '.tdb-vs-actions .tdb-vs-primary{background:rgba(227,188,103,.22);border-color:rgba(138,112,48,.35)}' +
    '#tdb-vs-status{margin:.55rem 0 0;font-size:.84rem;min-height:1.2em;color:#57534e}' +
    '#tdb-vs-foot{margin:.65rem 0 0;font-size:.78rem;line-height:1.45;color:#78716c}' +
    '.tdb-vs-listen-block{margin:0 0 1rem;padding:.65rem .75rem;border-radius:14px;border:1px solid rgba(138,112,48,.22);background:rgba(255,253,248,.65)}' +
    '.tdb-vs-listen-row{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem .65rem}' +
    '.tdb-vs-listen-btn{min-height:44px;padding:.42rem .9rem;border-radius:10px;border:1px solid rgba(90,78,58,.28);background:rgba(227,188,103,.2);color:#292524;font-weight:700;font-size:.86rem;cursor:pointer;font-family:inherit}' +
    '.tdb-vs-listen-btn:hover,.tdb-vs-listen-btn:focus-visible{outline:2px solid rgba(227,188,103,.45);outline-offset:2px}' +
    '.tdb-vs-listen-btn.tdb-vs-listen-active{background:rgba(124,92,28,.22);border-color:rgba(124,92,28,.35)}' +
    '.tdb-vs-listen-details{margin:.5rem 0 0;font-size:.82rem;color:#44403c}' +
    '.tdb-vs-listen-details summary{cursor:pointer;font-weight:600;min-height:40px;list-style:none}' +
    '.tdb-vs-listen-details summary::-webkit-details-marker{display:none}' +
    '.tdb-vs-listen-opts{display:flex;flex-direction:column;gap:.45rem;margin:.45rem 0 0}' +
    '.tdb-vs-listen-opts label{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}' +
    '.tdb-vs-listen-opts select{min-height:40px;padding:.25rem .4rem;border-radius:8px;border:1px solid rgba(90,78,58,.25);font:inherit;max-width:100%}' +
    '#tdb-vs-verse.tdb-vs-verse--tts-speak{box-shadow:0 0 0 2px rgba(227,188,103,.35);border-radius:8px;transition:box-shadow .25s ease}' +
    'body.tdb-verse-study-open{overflow:hidden}';

  var layerWired = false;
  var focusBefore = null;
  var stateRef = '';
  var stateText = '';
  var stateWhy = '';
  var stateXrefs = [];
  var narrationFromVerseStudy = false;

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
      return String(lexMap[k].w || '').trim();
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
    var seen = {};
    var whys = [];
    spans.forEach(function (sp) {
      var e = lexMap[sp.key];
      if (e && e.w && !seen[sp.key]) {
        seen[sp.key] = true;
        whys.push(e.w);
      }
    });
    if (whys.length >= 2) {
      return whys.slice(0, 2).join(' ');
    }
    if (whys.length === 1) {
      return whys[0];
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
    return 'This line is worth sitting with quietly. Let the words find you where you are—God speaks through His Word with steadiness, not pressure.';
  }

  function renderVerseInteractive(container, verseText, spans) {
    container.textContent = '';
    if (!verseText) {
      container.appendChild(document.createTextNode('Add verse text from this page when you can.'));
      return;
    }
    var i = 0;
    var t = String(verseText);
    spans.forEach(function (sp) {
      if (sp.start > i) {
        container.appendChild(document.createTextNode(t.slice(i, sp.start)));
      }
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tdb-vs-verse-word tdb-vs-verse-word--lex';
      btn.textContent = t.slice(sp.start, sp.end);
      btn.setAttribute('aria-label', 'Word study: ' + sp.surface);
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        openWordPanelForLemma(sp.surface);
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
    if (document.getElementById('tdb-verse-study-layer')) return;
    var layer = document.createElement('div');
    layer.id = 'tdb-verse-study-layer';
    layer.classList.add('tdb-vs-hidden');
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML =
      '<div id="tdb-vs-backdrop" class="tdb-vs-backdrop" tabindex="-1" aria-hidden="true"></div>' +
      '<div id="tdb-vs-panel" role="dialog" aria-modal="true" aria-labelledby="tdb-vs-title" aria-describedby="tdb-vs-why-text">' +
      '<div id="tdb-vs-header">' +
      '<button type="button" id="tdb-vs-close">Close</button>' +
      '<h2 id="tdb-vs-title">Verse study</h2></div>' +
      '<p id="tdb-vs-ref"></p>' +
      '<p id="tdb-vs-verse" aria-label="Verse text"></p>' +
      '<div id="tdb-vs-why-block"><p id="tdb-vs-why-label">Why this verse matters today</p>' +
      '<p id="tdb-vs-why-text"></p></div>' +
      '<div id="tdb-vs-xref-block" class="hidden"><p id="tdb-vs-xref-label">Related passages</p>' +
      '<ul id="tdb-vs-xref-list"></ul></div>' +
      '<div id="tdb-vs-listen-block" class="tdb-vs-listen-block hidden">' +
      '<div class="tdb-vs-listen-row">' +
      '<button type="button" id="tdb-vs-listen" class="tdb-vs-listen-btn">Listen</button>' +
      '<span id="tdb-vs-listen-hint" class="tdb-vs-foot" style="margin:0;flex:1 1 10rem">KJV only, on your device. Tap again to stop.</span></div>' +
      '<details class="tdb-vs-listen-details">' +
      '<summary>Narration options</summary>' +
      '<div class="tdb-vs-listen-opts">' +
      '<label for="tdb-vs-rate">Speed <select id="tdb-vs-rate" aria-label="Narration speed">' +
      '<option value="very_slow">Very slow</option><option value="slow">Slow</option><option value="normal">Normal</option></select></label>' +
      '<label><input type="checkbox" id="tdb-vs-phrase-pause" checked> Pause between phrases</label>' +
      '<label><input type="checkbox" id="tdb-vs-repeat"> Repeat until stopped</label>' +
      '<label><input type="checkbox" id="tdb-vs-ambient"> Very soft undertone (generated on-device, optional)</label>' +
      '</div></details></div>' +
      '<div class="tdb-vs-actions">' +
      '<button type="button" class="tdb-vs-primary" id="tdb-vs-save-mystudy">Save to My Study</button>' +
      '<button type="button" id="tdb-vs-memorize">Add to Memorize</button>' +
      '<button type="button" id="tdb-vs-journal">Save to What God has done</button>' +
      '<button type="button" id="tdb-vs-print">Print</button></div>' +
      '<p id="tdb-vs-status" role="status" aria-live="polite"></p>' +
      '<p id="tdb-vs-foot">KJV · stays on this device. Tap highlighted words for full word study.</p>' +
      '</div>';
    document.body.appendChild(layer);
  }

  function wireLayerOnce() {
    var layer = document.getElementById('tdb-verse-study-layer');
    if (!layer || layer.dataset.tdbVsWired === '1') return;
    layer.dataset.tdbVsWired = '1';
    var bd = document.getElementById('tdb-vs-backdrop');
    var cl = document.getElementById('tdb-vs-close');
    if (bd) bd.addEventListener('click', close);
    if (cl) cl.addEventListener('click', close);
    layer.addEventListener('keydown', function (ev) {
      var panel = document.getElementById('tdb-vs-panel');
      trapPanelTab(ev, panel);
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
    var sm = document.getElementById('tdb-vs-save-mystudy');
    var mm = document.getElementById('tdb-vs-memorize');
    var jn = document.getElementById('tdb-vs-journal');
    var pr = document.getElementById('tdb-vs-print');
    if (sm) sm.addEventListener('click', saveMyStudy);
    if (mm) mm.addEventListener('click', addMemorize);
    if (jn) jn.addEventListener('click', saveJournal);
    if (pr) pr.addEventListener('click', printStudy);
    var ln = document.getElementById('tdb-vs-listen');
    if (ln) ln.addEventListener('click', toggleVerseStudyListen);
    var rt = document.getElementById('tdb-vs-rate');
    if (rt) rt.addEventListener('change', readVerseStudyListenPrefsFromForm);
    var ppEl = document.getElementById('tdb-vs-phrase-pause');
    if (ppEl) ppEl.addEventListener('change', readVerseStudyListenPrefsFromForm);
    var rpEl = document.getElementById('tdb-vs-repeat');
    if (rpEl) rpEl.addEventListener('change', readVerseStudyListenPrefsFromForm);
    var amEl = document.getElementById('tdb-vs-ambient');
    if (amEl) amEl.addEventListener('change', readVerseStudyListenPrefsFromForm);
    syncVerseStudyListenUi();
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
  }

  function readVerseStudyListenPrefsFromForm() {
    var N = global.TDBVerseNarration;
    if (!N) return;
    var rate = document.getElementById('tdb-vs-rate');
    var pp = document.getElementById('tdb-vs-phrase-pause');
    var rp = document.getElementById('tdb-vs-repeat');
    var am = document.getElementById('tdb-vs-ambient');
    if (rate && rate.value) N.setRatePreset(rate.value);
    if (pp) N.setPhrasePause(!!pp.checked);
    if (rp) N.setRepeat(!!rp.checked);
    if (am) N.setAmbient(am.checked ? 'soft' : 'off');
  }

  function setVerseStudyListenButtonActive(on) {
    var ln = document.getElementById('tdb-vs-listen');
    if (!ln) return;
    ln.classList.toggle('tdb-vs-listen-active', !!on);
    ln.setAttribute('aria-pressed', on ? 'true' : 'false');
    ln.textContent = on ? 'Stop' : 'Listen';
    ln.setAttribute('aria-label', on ? 'Stop verse narration' : 'Listen to this verse, on device');
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
    var ref = normRefKey(stateRef);
    var body = stateText ? (ref ? ref + '. ' : '') + stateText : '';
    if (!String(body).trim()) return;
    var ok = N.speakPlainText(body, {
      highlightMode: 'verse-study',
      calm: true,
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
    var st = document.getElementById('tdb-vs-status');
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
    var st = document.getElementById('tdb-vs-status');
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
        if (st) st.textContent = 'Already in your Memorize list.';
      } else {
        comp.toggleMemorize(r);
        if (st) st.textContent = 'Added to Memorize on this device.';
        try {
          if (typeof global.trackEvent === 'function') global.trackEvent('tdb_verse_study_memorize', { ok: true });
        } catch (e) {}
      }
    } else if (isMemLiteStored(r)) {
      if (st) st.textContent = 'Already in your Memorize list.';
    } else if (addMemLiteEntry(r)) {
      if (st) st.textContent = 'Added to Memorize on this device. Open Memorize anytime to review.';
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
    var st = document.getElementById('tdb-vs-status');
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
    var refEl = document.getElementById('tdb-vs-ref');
    var verseEl = document.getElementById('tdb-vs-verse');
    var whyEl = document.getElementById('tdb-vs-why-text');
    var xb = document.getElementById('tdb-vs-xref-block');
    var xl = document.getElementById('tdb-vs-xref-list');
    if (refEl) refEl.textContent = stateRef + ' (KJV)';
    if (whyEl) whyEl.textContent = 'Gathering a gentle read for you…';
    if (verseEl) {
      verseEl.textContent = '';
      if (stateText) verseEl.textContent = stateText;
      else verseEl.textContent = 'Add verse text from this page when you can.';
    }
    if (xl) {
      xl.textContent = '';
    }
    if (xb) xb.classList.add('hidden');

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
      var spans = collectSpans(stateText, lexMap);
      stateWhy = buildWhyFromLexicon(stateText, lexMap, spans);
      if (whyEl) whyEl.textContent = stateWhy;
      if (verseEl) renderVerseInteractive(verseEl, stateText, spans);
      stateXrefs = resolveXrefs(refMap, stateRef);
      if (stateXrefs.length && xl && xb) {
        xb.classList.remove('hidden');
        stateXrefs.forEach(function (xr) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = buildReaderUrl(xr, stateRef);
          a.textContent = xr;
          li.appendChild(a);
          xl.appendChild(li);
        });
      }
    });

    try {
      if (typeof global.trackEvent === 'function') global.trackEvent('tdb_verse_study_open', {});
    } catch (e) {}

    syncVerseStudyListenUi();

    var closeBtn = document.getElementById('tdb-vs-close');
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
