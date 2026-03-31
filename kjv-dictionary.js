/**
 * Optional KJV word helper: tap or long-press marked words for a short modern gloss.
 * Loads /data/kjv-dictionary.json once. Skips kids coloring / Color & Tell surfaces.
 */
(function () {
  'use strict';

  var DICT_URL = '/data/kjv-dictionary.json';
  var entries = null;
  var wordRegex = null;
  var loadPromise = null;
  var overlay = null;
  var lastFocus = null;
  var longPressTimer = null;
  var longPressFired = false;

  function shouldSkipPage() {
    try {
      var p = String(location.pathname || '').toLowerCase();
      if (/coloring\.html$/i.test(p)) return true;
      if (document.getElementById('tdb-cat-root')) return true;
      if (document.documentElement && document.documentElement.getAttribute('data-tdb-no-kjv-dictionary') === '1') return true;
      if (document.body && document.body.getAttribute('data-tdb-no-kjv-dictionary') === '1') return true;
    } catch (e) {}
    return false;
  }

  function isUserDisabled() {
    try {
      return localStorage.getItem('tdb_kjv_dictionary') === '0';
    } catch (e) {
      return false;
    }
  }

  function escapeReg(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function keyToPattern(k) {
    var key = String(k || '').trim();
    if (!key) return '';
    if (/\s/.test(key)) {
      return '\\b' + key.split(/\s+/).map(escapeReg).join('\\s+') + '\\b';
    }
    return '\\b' + escapeReg(key) + '\\b';
  }

  function buildWordRegex(dict) {
    var keys = Object.keys(dict || {}).sort(function (a, b) {
      return b.length - a.length;
    });
    if (!keys.length) return null;
    var inner = keys.map(keyToPattern).filter(Boolean).join('|');
    try {
      return new RegExp('(' + inner + ')', 'gi');
    } catch (e) {
      return null;
    }
  }

  function loadEntries() {
    if (entries && wordRegex) return Promise.resolve(entries);
    if (loadPromise) return loadPromise;
    loadPromise = fetch(DICT_URL, { credentials: 'same-origin', cache: 'force-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('kjv_dict_fetch');
        return r.json();
      })
      .then(function (data) {
        var e = (data && data.entries && typeof data.entries === 'object') ? data.entries : data;
        entries = e && typeof e === 'object' ? e : {};
        wordRegex = buildWordRegex(entries);
        return entries;
      })
      .catch(function () {
        entries = {};
        wordRegex = null;
        return entries;
      });
    return loadPromise;
  }

  function stripQuoteDecor(s) {
    return String(s || '')
      .replace(/^[\s"\u201c]+|[\s"\u201d]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function lemmaForMatch(matched) {
    var raw = String(matched || '');
    var lower = raw.toLowerCase();
    if (entries[lower]) return lower;
    var spaced = lower.replace(/\s+/g, ' ').trim();
    if (entries[spaced]) return spaced;
    return lower;
  }

  function wrapPlainToFragment(plain) {
    var frag = document.createDocumentFragment();
    var text = String(plain == null ? '' : plain);
    if (!text || !wordRegex) {
      frag.appendChild(document.createTextNode(text));
      return frag;
    }
    var re = new RegExp(wordRegex.source, wordRegex.flags);
    var last = 0;
    var m;
    var guard = 0;
    while ((m = re.exec(text)) !== null) {
      if (++guard > 5000) break;
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var matched = m[1];
      var lemma = lemmaForMatch(matched);
      var def = entries[lemma];
      if (!def) {
        frag.appendChild(document.createTextNode(matched));
      } else {
        var span = document.createElement('span');
        span.className = 'kjv-lookup';
        span.textContent = matched;
        span.setAttribute('data-kjv-lemma', lemma);
        span.setAttribute('tabindex', '0');
        span.setAttribute('role', 'button');
        span.setAttribute('aria-label', 'KJV word: ' + matched + '. Press Enter or tap for a short modern meaning.');
        frag.appendChild(span);
      }
      last = re.lastIndex;
      if (m[0].length === 0) re.lastIndex++;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    return frag;
  }

  function applyToElement(el, opts) {
    if (!el || shouldSkipPage() || isUserDisabled()) return Promise.resolve();
    if (el.closest && el.closest('#tdb-verse-breakdown-modal')) return Promise.resolve();
    var plain = opts && opts.plainText != null ? String(opts.plainText) : String(el.textContent || '');
    return loadEntries().then(function () {
      if (!el.isConnected) return;
      el.replaceChildren();
      var frag = wrapPlainToFragment(plain);
      while (frag.firstChild) el.appendChild(frag.firstChild);
      el.setAttribute('data-tdb-kjv-wrapped', '1');
    });
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'tdb-kjv-dict-overlay';
    overlay.className = 'tdb-kjv-dict-overlay hidden';
    overlay.setAttribute('aria-hidden', 'true');
    var backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'tdb-kjv-dict-backdrop';
    backdrop.setAttribute('aria-label', 'Close dictionary');
    var card = document.createElement('div');
    card.className = 'tdb-kjv-dict-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-labelledby', 'tdb-kjv-dict-word');
    var title = document.createElement('p');
    title.className = 'tdb-kjv-dict-word';
    title.id = 'tdb-kjv-dict-word';
    var body = document.createElement('p');
    body.className = 'tdb-kjv-dict-def';
    var exWrap = document.createElement('div');
    exWrap.className = 'tdb-kjv-dict-example-wrap hidden';
    var exLabel = document.createElement('p');
    exLabel.className = 'tdb-kjv-dict-example-label';
    exLabel.textContent = 'In this verse';
    var ex = document.createElement('p');
    ex.className = 'tdb-kjv-dict-example';
    exWrap.appendChild(exLabel);
    exWrap.appendChild(ex);
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn btn-secondary tdb-kjv-dict-close';
    closeBtn.textContent = 'Close';
    closeBtn.setAttribute('aria-label', 'Close dictionary');
    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(exWrap);
    card.appendChild(closeBtn);
    overlay.appendChild(backdrop);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    function close() {
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('tdb-kjv-dict-open');
      document.removeEventListener('keydown', onDocKey);
      if (lastFocus && typeof lastFocus.focus === 'function') {
        try {
          lastFocus.focus();
        } catch (e) {}
      }
      lastFocus = null;
    }
    function onDocKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    }
    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    overlay._tdbKjvClose = close;
    overlay._tdbKjvOnDocKey = onDocKey;
    return overlay;
  }

  function truncateExample(verse, lemmaSurface) {
    var v = stripQuoteDecor(verse);
    if (!v) return '';
    var max = 220;
    if (v.length <= max) return v;
    var low = v.toLowerCase();
    var needle = String(lemmaSurface || '').toLowerCase();
    var idx = needle ? low.indexOf(needle) : -1;
    if (idx === -1) return v.slice(0, max - 1) + '\u2026';
    var start = Math.max(0, idx - 80);
    var slice = v.slice(start, start + max);
    return (start > 0 ? '\u2026' : '') + slice + (start + max < v.length ? '\u2026' : '');
  }

  function showDictionaryPopover(lemma, surfaceForm, exampleVerse, returnFocusEl) {
    if (shouldSkipPage() || isUserDisabled()) return;
    loadEntries().then(function () {
      var lem = String(lemma || '').toLowerCase().replace(/\s+/g, ' ').trim();
      var def = entries[lem] || entries[String(surfaceForm || '').toLowerCase()];
      if (!def) return;
      var el = ensureOverlay();
      var wordEl = el.querySelector('#tdb-kjv-dict-word');
      var defEl = el.querySelector('.tdb-kjv-dict-def');
      var exWrap = el.querySelector('.tdb-kjv-dict-example-wrap');
      var exEl = el.querySelector('.tdb-kjv-dict-example');
      var closeBtn = el.querySelector('.tdb-kjv-dict-close');
      if (!wordEl || !defEl || !exWrap || !exEl || !closeBtn) return;
      lastFocus = returnFocusEl || document.activeElement;
      wordEl.textContent = surfaceForm || lemma;
      defEl.textContent = def;
      var exText = truncateExample(exampleVerse || '', surfaceForm || lemma);
      if (exText) {
        exEl.textContent = '\u201c' + exText + '\u201d';
        exWrap.classList.remove('hidden');
      } else {
        exWrap.classList.add('hidden');
        exEl.textContent = '';
      }
      el.classList.remove('hidden');
      el.setAttribute('aria-hidden', 'false');
      document.body.classList.add('tdb-kjv-dict-open');
      document.addEventListener('keydown', el._tdbKjvOnDocKey);
      try {
        closeBtn.focus();
      } catch (e) {}
      if (typeof window.trackEvent === 'function') {
        try {
          window.trackEvent('kjv_dictionary_open', { lemma_len: String(lem).length });
        } catch (e2) {}
      }
    });
  }

  function verseContextForSpan(span) {
    var host = span.closest('[data-kjv-context-verse]');
    if (host) {
      var a = host.getAttribute('data-kjv-context-verse');
      if (a) return a;
    }
    var breakdownModal = span.closest('#tdb-verse-breakdown-modal');
    if (breakdownModal) {
      var dt = breakdownModal.getAttribute('data-text');
      if (dt) return dt;
    }
    var card = span.closest('.verse-card, .mystudy-verse-card, #daily-verse-card, [data-tdb-calm-verse-surface], .mystudy-highlight-detail');
    if (card && typeof window.tdbGetDailyVerseTextFromCard === 'function') {
      try {
        var t = window.tdbGetDailyVerseTextFromCard(card);
        if (t) return t;
      } catch (e) {}
    }
    var modalText = span.closest('.verse-modal-inner');
    if (modalText) {
      var mp = modalText.querySelector('.verse-modal-text');
      if (mp) return String(mp.textContent || '');
    }
    var line = span.closest('.context-line');
    if (line && line.dataset && line.dataset.ref) {
      var ref = line.dataset.ref;
      if (typeof window.getBibleVerseText === 'function') {
        try {
          return window.getBibleVerseText(ref) || '';
        } catch (e) {}
      }
    }
    var p = span.parentElement;
    return p ? String(p.textContent || '') : '';
  }

  function openFromSpan(span) {
    var lemma = span.getAttribute('data-kjv-lemma') || span.textContent;
    var surface = span.textContent;
    var ctx = verseContextForSpan(span);
    showDictionaryPopover(lemma, surface, ctx, span);
  }

  function onPointerDown(e) {
    if (shouldSkipPage() || isUserDisabled()) return;
    var t = e.target && e.target.closest && e.target.closest('.kjv-lookup');
    if (!t) return;
    longPressFired = false;
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(function () {
      longPressTimer = null;
      longPressFired = true;
      openFromSpan(t);
    }, 520);
  }

  function clearLongPress() {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }

  function onClick(e) {
    if (shouldSkipPage() || isUserDisabled()) return;
    var t = e.target && e.target.closest && e.target.closest('.kjv-lookup');
    if (!t) return;
    if (longPressFired) {
      longPressFired = false;
      e.preventDefault();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    openFromSpan(t);
  }

  function onKeyDown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target && e.target.closest && e.target.closest('.kjv-lookup');
    if (!t || e.target !== t) return;
    e.preventDefault();
    openFromSpan(t);
  }

  function refreshHeroAndDaily() {
    if (shouldSkipPage() || isUserDisabled()) return;
    var hv = document.getElementById('heroVerse');
    if (hv && !hv.closest('[data-tdb-no-kjv-dictionary]')) {
      applyToElement(hv, { plainText: String(hv.textContent || '') });
    }
    var dt = document.querySelector('#daily-verse-card #daily-verse-text');
    if (dt && dt.id === 'daily-verse-text') {
      applyToElement(dt, { plainText: String(dt.textContent || '') });
    }
  }

  function refreshCalmVerses() {
    if (shouldSkipPage() || isUserDisabled()) return;
    ['verse-text', 'desktop-verse-text'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && String(el.textContent || '').trim()) {
        applyToElement(el, { plainText: String(el.textContent || '') });
      }
    });
  }

  function wrapReaderChapterLines(container) {
    if (!container || shouldSkipPage() || isUserDisabled()) return Promise.resolve();
    return loadEntries().then(function () {
      var lines = container.querySelectorAll('.context-line');
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.querySelector('.tdb-reader-kjv-wrap')) continue;
        var strong = line.querySelector(':scope > strong');
        if (!strong) continue;
        var verseText = '';
        var n = strong.nextSibling;
        while (n) {
          var next = n.nextSibling;
          if (n.nodeType === 3) verseText += n.textContent;
          else if (n.nodeType === 1) verseText += n.textContent;
          n = next;
        }
        verseText = verseText.replace(/^\s+/, '');
        if (!verseText) continue;
        while (strong.nextSibling) line.removeChild(strong.nextSibling);
        line.appendChild(document.createTextNode(' '));
        var span = document.createElement('span');
        span.className = 'tdb-reader-kjv-wrap';
        line.appendChild(span);
        var frag = wrapPlainToFragment(verseText);
        while (frag.firstChild) span.appendChild(frag.firstChild);
      }
    });
  }

  function watchReaderOutput() {
    var out = document.getElementById('reader-output');
    if (!out || out.dataset.tdbKjvReaderObserved === '1') return;
    out.dataset.tdbKjvReaderObserved = '1';
    var t;
    var obs = new MutationObserver(function () {
      clearTimeout(t);
      t = setTimeout(function () {
        wrapReaderChapterLines(out);
      }, 60);
    });
    try {
      obs.observe(out, { childList: true, subtree: true });
    } catch (e) {}
  }

  function init() {
    if (shouldSkipPage()) return;
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointerup', clearLongPress, true);
    document.addEventListener('pointercancel', clearLongPress, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('tdb-hero-verse-updated', refreshHeroAndDaily);
    window.addEventListener('tdb-daily-verse-updated', refreshHeroAndDaily);
    window.addEventListener('tdb-calm-verse-updated', refreshCalmVerses);
    loadEntries().then(function () {
      refreshHeroAndDaily();
      refreshCalmVerses();
      watchReaderOutput();
      var ro = document.getElementById('reader-output');
      if (ro && ro.childNodes.length) wrapReaderChapterLines(ro);
      var mv = document.getElementById('mystudy-verse-text');
      if (mv && String(mv.textContent || '').trim()) {
        var mCard = mv.closest('.mystudy-verse-card');
        var mctx = (mCard && mCard.getAttribute('data-kjv-context-verse')) || String(mv.textContent || '');
        applyToElement(mv, { plainText: String(mv.textContent || ''), contextVerse: mctx });
      }
      var lt = document.getElementById('lookup-text');
      if (lt && String(lt.textContent || '').trim()) {
        var lb = document.getElementById('lookup-result');
        var lctx = (lb && lb.getAttribute('data-kjv-context-verse')) || String(lt.textContent || '');
        applyToElement(lt, { plainText: String(lt.textContent || ''), contextVerse: lctx });
      }
    });
  }

  window.TdbKjvDictionary = {
    init: init,
    applyToElement: applyToElement,
    showDictionaryPopover: showDictionaryPopover,
    wrapReaderChapterLines: wrapReaderChapterLines,
    loadEntries: loadEntries
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
