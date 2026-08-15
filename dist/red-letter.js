/**
 * Red-letter rendering — words of Jesus in red (KJV).
 * Default ON everywhere. Offline, character-range aware.
 * Gospels + Acts + Revelation (and any verse where Jesus is the speaker).
 */
(function (global) {
  'use strict';

  var RED_LETTER_TOGGLE_KEY = 'redLetterEnabled';
  var RED_CLASS = 'red-letter';

  var SPEECH_INTRO_RE =
    /\b(?:And\s+)?(?:Jesus|the\s+Lord\s+Jesus|the\s+Son)\s+(?:said|saith|answered(?:\s+and\s+said)?|cried(?:\s+out)?|spake|spoke)\s*,?\s*|\bThen\s+said\s+Jesus\s*,?\s*|\b(?:Jesus|He)\s+answered\s+(?:and\s+said\s+)?(?:unto\s+them\s*,?\s*)?|\b(?:and\s+)?(?:he\s+)?said\s+unto\s+(?:the\s+)?(?:sea|wind|them|him|her|it|his\s+disciples|the\s+multitude|the\s+people)\s*,\s*/gi;

  var NARRATIVE_BREAK_RE =
    /\s+(?:And\s+(?:they|the|when|it|there|he|she|Pilate|Peter|one|all|as|Jesus)\b|Then\s+(?:cometh|spake|said|went|answered)|Now\s+(?:when|before|after)|But\s+(?:when|they)|So\s+when)\b/;

  /* Whole-verse openers common in Jesus' teaching (Sermon on the Mount, I am sayings, etc.). */
  var WHOLE_VERSE_JESUS_RE =
    /^(?:Verily,?\s*verily|I\s+say\s+unto\s+you|Peace\s+(?:I\s+leave|be\s+still)|I\s+am\s+the\s+|I\s+am\s+come|I\s+am\s+Alpha|I\s+am\s+he|Let\s+not\s+your|If\s+ye\s+|Father,|Come\s+unto\s+me|Whosoever\s+|Ask,?\s+and|He\s+that\s+|My\s+sheep|Abide\s+in\s+me|If\s+any\s+man|For\s+the\s+Father|In\s+my\s+Father|And\s+I\s+|But\s+(?:I\s+)?(?:say|tell|seek)|Ye\s+are\s+|O\s+ye\s+|It\s+is\s+|There\s+is\s+|By\s+this\s+|Now\s+is\s+|He\s+that\s+believeth|Blessed\s+are|If\s+ye\s+love\s+me|I\s+go\s+unto|Neither\s+pray\s+I|These\s+things\s+have\s+I|In\s+my\s+name|Take\s+(?:heed|eat|therefore)|This\s+is\s+my\s+body|This\s+cup|Behold,?\s+I\s+stand|I\s+will\s+come|Fear\s+not|Go\s+ye|All\s+power\s+is\s+given|For\s+God\s+so\s+loved|God\s+so\s+loved|Jesus\s+wept|The\s+thief\s+cometh|Teaching\s+them|I\s+am\s+with\s+you|Seek\s+ye\s+first|Sufficient\s+unto)/i;

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function parseBookChapter(ref) {
    var r = String(ref || '').trim().replace(/^Psalms\s+/i, 'Psalm ');
    var m = r.match(/^((?:[1-3]\s+)?[A-Za-z][A-Za-z\s\.]+?)\s+(\d+)/);
    if (!m) return null;
    return { book: m[1].replace(/\./g, '').replace(/\s+/g, ' ').trim(), chapter: +m[2] };
  }

  /** Books / sections where Jesus' spoken words appear in Scripture. */
  function isJesusSpeechBook(ref) {
    var p = parseBookChapter(ref);
    if (!p) return false;
    var b = p.book;
    if (/^(Matthew|Mark|Luke|John)$/i.test(b)) return true;
    if (/^Acts$/i.test(b)) return true;
    if (/^Revelation$/i.test(b)) return true;
    /* Lord's Supper words re-quoted by Paul */
    if (/^1\s*Corinthians$/i.test(b) && p.chapter === 11) return true;
    return false;
  }

  /* Back-compat alias */
  function isGospelRef(ref) {
    return isJesusSpeechBook(ref);
  }

  /**
   * Always on. Owner request: not a setting — Jesus’ words stay red.
   */
  function isEnabled() {
    return true;
  }

  function hideRedLetterControls() {
    if (!global.document) return;
    ['settings-red-letter', 'red-letter-toggle', 'reader-red-letter-toggle', 'rl-toggle'].forEach(function (id) {
      var el = global.document.getElementById(id);
      if (!el) return;
      var wrap = el.closest && el.closest('.settings-row, .inline-toggle, .rl-toggle-panel, .rl-toggle-switch, label');
      if (wrap) {
        wrap.hidden = true;
        wrap.setAttribute('hidden', '');
        wrap.style.display = 'none';
      }
      el.hidden = true;
      el.setAttribute('hidden', '');
      if (el.type === 'checkbox') el.checked = true;
    });
  }

  function setEnabled(_value) {
    try {
      global.localStorage.removeItem(RED_LETTER_TOGGLE_KEY);
    } catch (e) { /* ignore */ }
    if (global.document && global.document.body) {
      global.document.body.classList.remove('red-letter-off');
    }
    hideRedLetterControls();
    try {
      global.dispatchEvent(new CustomEvent('tdb-red-letter-changed', { detail: { enabled: true } }));
    } catch (e2) { /* ignore */ }
    try {
      scanAndPaint(global.document);
    } catch (e3) { /* ignore */ }
  }

  function normalizeRanges(ranges, textLen) {
    var list = Array.isArray(ranges) ? ranges.slice() : [];
    var out = [];
    list.forEach(function (range) {
      var start = Math.max(0, Math.min(textLen, Number(range.start) || 0));
      var end = Math.max(start, Math.min(textLen, Number(range.end) || 0));
      if (end > start) out.push({ start: start, end: end });
    });
    out.sort(function (a, b) {
      return a.start - b.start;
    });
    var merged = [];
    out.forEach(function (r) {
      var last = merged[merged.length - 1];
      if (!last || r.start > last.end) merged.push({ start: r.start, end: r.end });
      else if (r.end > last.end) last.end = r.end;
    });
    return merged;
  }

  function speakerLooksLikeJesus(opts) {
    var about = String((opts && (opts.about || opts.speaker)) || '').toLowerCase();
    if (!about) return false;
    return (
      /\bjesus\b/.test(about) ||
      /\bchrist\b/.test(about) ||
      /\blord jesus\b/.test(about) ||
      /\bson of (?:god|man)\b/.test(about)
    );
  }

  function guessRanges(ref, text, options) {
    var body = String(text || '');
    var len = body.length;
    if (!len) return [];

    var opts = options || {};
    var ranges = [];
    var foundIntro = false;
    var m;
    SPEECH_INTRO_RE.lastIndex = 0;
    while ((m = SPEECH_INTRO_RE.exec(body)) !== null) {
      foundIntro = true;
      var start = m.index + m[0].length;
      var end = len;
      var tail = body.slice(start);
      var breakMatch = tail.match(NARRATIVE_BREAK_RE);
      if (breakMatch && breakMatch.index != null && breakMatch.index > 12) {
        end = start + breakMatch.index;
      }
      ranges.push({ start: start, end: end });
    }

    if (!foundIntro) {
      var forceWhole =
        speakerLooksLikeJesus(opts) ||
        (isJesusSpeechBook(ref) && WHOLE_VERSE_JESUS_RE.test(body.trim())) ||
        (!!opts.forceWhole && isJesusSpeechBook(ref));
      if (forceWhole) {
        ranges.push({ start: 0, end: len });
      }
    }

    /* Revelation letters & throne words often lack "Jesus said" in the verse itself */
    if (!ranges.length && isJesusSpeechBook(ref)) {
      var p = parseBookChapter(ref);
      if (p && /^Revelation$/i.test(p.book) && p.chapter >= 1 && p.chapter <= 3) {
        if (/\bI\s+(?:am|know|have|will|stand|come)\b/i.test(body) || /saith\s+the\s+(?:Lord|Spirit)/i.test(body)) {
          ranges.push({ start: 0, end: len });
        }
      }
    }

    return normalizeRanges(ranges, len);
  }

  function resolveRanges(ref, text, options) {
    var opts = options || {};
    if (Array.isArray(opts.redLetterRanges) && opts.redLetterRanges.length) {
      return normalizeRanges(opts.redLetterRanges, String(text || '').length);
    }
    if (opts.redLetterRanges === false) return [];
    return guessRanges(ref, text, opts);
  }

  function resolveSpeakerFromContext(ref) {
    try {
      if (typeof global.TDB_resolveVerseContext === 'function') {
        var hit = global.TDB_resolveVerseContext(ref);
        if (hit && hit.about) return String(hit.about);
      }
    } catch (e) { /* ignore */ }
    return '';
  }

  function renderHtml(ref, text, options) {
    var raw = String(text || '');
    var opts = options || {};
    if (!raw) return '';
    if (!isEnabled() && !opts.force) return escapeHtml(raw);

    var about = opts.about || opts.speaker || resolveSpeakerFromContext(ref);
    var mergedOpts = Object.assign({}, opts, { about: about });
    var ranges = resolveRanges(ref, raw, mergedOpts);
    if (!ranges.length) return escapeHtml(raw);

    var openQuote = opts.quote === false ? '' : '\u201c';
    var closeQuote = opts.quote === false ? '' : '\u201d';
    var html = escapeHtml(openQuote);
    var cursor = 0;

    ranges.forEach(function (range) {
      if (range.start > cursor) {
        html += escapeHtml(raw.slice(cursor, range.start));
      }
      html +=
        '<span class="' +
        RED_CLASS +
        '">' +
        escapeHtml(raw.slice(range.start, range.end)) +
        '</span>';
      cursor = range.end;
    });
    if (cursor < raw.length) html += escapeHtml(raw.slice(cursor));
    html += escapeHtml(closeQuote);
    return html;
  }

  function setElementHtml(el, html) {
    if (!el) return;
    try {
      if (typeof global.tdbSetHtml === 'function') {
        global.tdbSetHtml(el, html);
        return;
      }
    } catch (e0) { /* fall through */ }
    try {
      if (global.trustedTypes && global.trustedTypes.defaultPolicy && global.trustedTypes.defaultPolicy.createHTML) {
        el.innerHTML = global.trustedTypes.defaultPolicy.createHTML(html);
        return;
      }
    } catch (e) { /* fall through */ }
    try {
      el.innerHTML = html;
    } catch (e2) { /* ignore */ }
  }

  function stripQuotes(s) {
    return String(s || '')
      .replace(/^[\s"\u201c\u2018]+|[\s"\u201d\u2019]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function applyToElement(el, ref, text, options) {
    if (!el) return;
    var raw = String(text != null ? text : stripQuotes(el.textContent || ''));
    var opts = options || {};
    if (!raw) return;

    if (!isEnabled() && !opts.force && !opts.forceWhole) {
      var openQ = opts.quote === false ? '' : '\u201c';
      var closeQ = opts.quote === false ? '' : '\u201d';
      el.textContent = openQ + raw + closeQ;
      el.classList.remove('has-red-letter', RED_CLASS);
      return;
    }

    var html = renderHtml(ref, raw, opts);
    var painted = html.indexOf('class="' + RED_CLASS + '"') !== -1 || html.indexOf("class='" + RED_CLASS + "'") !== -1;
    /* Gospel speech with no detected range: still mark the line so CSS can paint it red. */
    if (!painted && isJesusSpeechBook(ref) && (opts.forceWhole || speakerLooksLikeJesus(opts) || WHOLE_VERSE_JESUS_RE.test(raw.trim()))) {
      var oq2 = opts.quote === false ? '' : '\u201c';
      var cq2 = opts.quote === false ? '' : '\u201d';
      html = '<span class="' + RED_CLASS + '">' + escapeHtml(oq2 + raw + cq2) + '</span>';
      painted = true;
    }
    if (painted) {
      setElementHtml(el, html);
      el.classList.add('has-red-letter', RED_CLASS);
    } else {
      var oq = opts.quote === false ? '' : '\u201c';
      var cq = opts.quote === false ? '' : '\u201d';
      el.textContent = oq + raw + cq;
      el.classList.remove('has-red-letter', RED_CLASS);
    }
  }

  function isRedLetterLike(ref, text, options) {
    var body = String(text || '');
    if (!body) return false;
    if (guessRanges(ref, body, options || {}).length) return true;
    return /(jesus said|jesus saith|then said jesus|and jesus said|jesus answered|verily,? verily|i say unto you|i am the |come unto me)/i.test(
      body
    );
  }

  function findRefNear(el) {
    if (!el) return '';
    var ref =
      el.getAttribute('data-verse-ref') ||
      el.getAttribute('data-ref') ||
      el.getAttribute('data-tdb-ref') ||
      '';
    if (ref) return stripQuotes(ref).replace(/\s*\(KJV\)\s*$/i, '');

    var id = el.id || '';
    /* heroVerse ↔ heroRef, etc. */
    var pairs = [
      ['heroVerse', 'heroRef'],
      ['verseText', 'verseRef'],
      ['daily-battle-verse', 'daily-battle-ref'],
      ['tdbPorchVerseText', 'tdbPorchVerseRef']
    ];
    for (var i = 0; i < pairs.length; i++) {
      if (id === pairs[i][0] || el.classList.contains(pairs[i][0])) {
        var refEl = global.document.getElementById(pairs[i][1]);
        if (refEl) {
          return stripQuotes(refEl.textContent || '').replace(/\s*\(KJV\)\s*$/i, '');
        }
      }
    }

    var looksLikeRef = function (t) {
      var s = stripQuotes(t || '').replace(/\s*\(KJV\)\s*$/i, '');
      if (/^(Matthew|Mark|Luke|John|Acts|Revelation)\s+\d/i.test(s)) return s;
      if (/^[1-3]?\s*[A-Za-z][A-Za-z\s.]+\s+\d+:\d+/.test(s)) return s;
      return '';
    };

    var parent = el.parentElement;
    for (var depth = 0; parent && depth < 6; depth++) {
      var near =
        parent.querySelector &&
        parent.querySelector(
          '.verse-ref, .big-kjv, [data-verse-ref], [data-ref], .plan-day-verse-ref, .verse-reference, .tdb-kiss-verse__ref, strong'
        );
      if (near && near !== el) {
        var hit = looksLikeRef(near.textContent || '');
        if (hit) return hit;
      }
      var prev = el.previousElementSibling || parent.previousElementSibling;
      var hops = 0;
      while (prev && hops < 6) {
        var prevHit = looksLikeRef(prev.textContent || '');
        if (prevHit && String(prev.textContent || '').length < 80) return prevHit;
        prev = prev.previousElementSibling;
        hops += 1;
      }
      var pref = parent.getAttribute && (parent.getAttribute('data-verse-ref') || parent.getAttribute('data-ref'));
      if (pref) return stripQuotes(pref).replace(/\s*\(KJV\)\s*$/i, '');
      parent = parent.parentElement;
    }
    return '';
  }

  /**
   * Paint common verse surfaces anywhere in the document.
   * Safe to call repeatedly; skips nodes already correctly painted when text matches.
   */
  function scanAndPaint(root) {
    if (!isEnabled()) return 0;
    var doc = root && root.querySelectorAll ? root : global.document;
    if (!doc || !doc.querySelectorAll) return 0;

    var selectors = [
      '#heroVerse',
      '#verseText',
      '#daily-battle-verse',
      '.verse-body',
      '.hero-verse',
      '.tdb-kiss-verse__kjv',
      '.fvc-kjv',
      '.home-search-card-copy',
      '.plan-day-verse-text',
      '.verse-text',
      '.kjv-verse-text',
      '.tdb-ll-kjv p',
      '.daily-verse-text',
      'p.kjv',
      '.memory-verse-text',
      '.bible-hub-verse-text',
      '.tdb-porch-verse-text p',
      '[data-tdb-verse-text]',
      '[data-red-letter-verse]'
    ].join(',');

    var nodes = doc.querySelectorAll(selectors);
    var n = 0;
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!el || el.closest && el.closest('.no-red-letter')) continue;
      var ref = findRefNear(el);
      if (!ref) continue;
      var text =
        el.getAttribute('data-verse-text') ||
        el.getAttribute('data-tdb-verse-text') ||
        stripQuotes(el.textContent || '');
      if (!text || text.length < 8) continue;
      if (!isRedLetterLike(ref, text) && !speakerLooksLikeJesus({ about: resolveSpeakerFromContext(ref) })) {
        continue;
      }
      applyToElement(el, ref, text, { quote: /heroVerse|hero-verse|verse-body/i.test(el.id + ' ' + el.className) });
      n += 1;
    }
    return n;
  }

  function wireAutoScan() {
    if (!global.document) return;
    var run = function () {
      try {
        scanAndPaint(global.document);
      } catch (e) { /* ignore */ }
    };
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
    global.addEventListener('tdb-red-letter-changed', run);
    global.addEventListener('tdb-verse-painted', run);
    /* After deferred verse renders */
    setTimeout(run, 400);
    setTimeout(run, 1500);
    setTimeout(run, 4000);
    try {
      if (global.MutationObserver && global.document && global.document.body) {
        var t = null;
        var mo = new global.MutationObserver(function () {
          if (t) global.clearTimeout(t);
          t = global.setTimeout(run, 180);
        });
        mo.observe(global.document.body, { childList: true, subtree: true });
      }
    } catch (eMo) { /* ignore */ }
  }

  global.TDBRedLetter = {
    RED_LETTER_TOGGLE_KEY: RED_LETTER_TOGGLE_KEY,
    isEnabled: isEnabled,
    setEnabled: setEnabled,
    isGospelRef: isGospelRef,
    isJesusSpeechBook: isJesusSpeechBook,
    guessRanges: guessRanges,
    resolveRanges: resolveRanges,
    renderHtml: renderHtml,
    applyToElement: applyToElement,
    isRedLetterLike: isRedLetterLike,
    scanAndPaint: scanAndPaint
  };

  if (global.document && global.document.body) {
    global.document.body.classList.remove('red-letter-off');
    hideRedLetterControls();
  } else if (global.document) {
    global.document.addEventListener('DOMContentLoaded', function () {
      if (global.document.body) global.document.body.classList.remove('red-letter-off');
      hideRedLetterControls();
    });
  }
  try {
    global.localStorage.removeItem(RED_LETTER_TOGGLE_KEY);
  } catch (eClr) { /* ignore */ }

  wireAutoScan();
})(typeof window !== 'undefined' ? window : this);
