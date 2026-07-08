/**
 * Red-letter rendering — words of Jesus in the Gospels (KJV).
 * Offline, optional (localStorage), character-range aware when possible.
 */
(function (global) {
  'use strict';

  var RED_LETTER_TOGGLE_KEY = 'redLetterEnabled';

  var SPEECH_INTRO_RE =
    /\b(?:And\s+)?Jesus\s+(?:said|saith|answered(?:\s+and\s+said)?|cried(?:\s+out)?|spake)\s*,?\s*|\bThen\s+said\s+Jesus\s*,?\s*/gi;

  var NARRATIVE_BREAK_RE =
    /\s+(?:And\s+(?:they|the|when|it|there|he|she|Pilate|Peter|one|all|as)\b|Then\s+(?:cometh|spake|said|went|answered)|Now\s+(?:when|before|after)|But\s+(?:when|they)|So\s+when)\b/;

  var WHOLE_VERSE_JESUS_RE =
    /^(?:Verily,?\s*verily|I\s+say\s+unto\s+you|Peace\s+I\s+leave|I\s+am\s+the\s+|I\s+am\s+come|Let\s+not\s+your|If\s+ye\s+|Father,|Come\s+unto\s+me|Whosoever\s+|Ask,?\s+and|He\s+that\s+|My\s+sheep|Abide\s+in\s+me|If\s+any\s+man|For\s+the\s+Father|In\s+my\s+Father|And\s+I\s+|But\s+I\s+|Ye\s+are\s+|O\s+ye\s+|It\s+is\s+|There\s+is\s+|By\s+this\s+|Now\s+is\s+|He\s+that\s+believeth|Blessed\s+are\s+ye|If\s+ye\s+love\s+me|I\s+go\s+unto|Neither\s+pray\s+I|These\s+things\s+have\s+I|In\s+my\s+name)/i;

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isGospelRef(ref) {
    var r = String(ref || '').trim();
    return /^(Matthew|Mark|Luke|John)\s+\d/i.test(r);
  }

  function isEnabled() {
    try {
      var stored = global.localStorage.getItem(RED_LETTER_TOGGLE_KEY);
      if (stored === null) return false;
      return stored === 'true';
    } catch (e) {
      return false;
    }
  }

  function setEnabled(value) {
    try {
      global.localStorage.setItem(RED_LETTER_TOGGLE_KEY, value ? 'true' : 'false');
    } catch (e) { /* ignore */ }
    if (global.document && global.document.body) {
      global.document.body.classList.toggle('red-letter-off', !value);
    }
    try {
      global.dispatchEvent(new CustomEvent('tdb-red-letter-changed', { detail: { enabled: !!value } }));
    } catch (e2) { /* ignore */ }
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

  function guessRanges(ref, text) {
    var body = String(text || '');
    var len = body.length;
    if (!len || !isGospelRef(ref)) return [];

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

    if (!foundIntro && WHOLE_VERSE_JESUS_RE.test(body.trim())) {
      ranges.push({ start: 0, end: len });
    }

    return normalizeRanges(ranges, len);
  }

  function resolveRanges(ref, text, options) {
    var opts = options || {};
    if (Array.isArray(opts.redLetterRanges) && opts.redLetterRanges.length) {
      return normalizeRanges(opts.redLetterRanges, String(text || '').length);
    }
    if (opts.redLetterRanges === false) return [];
    return guessRanges(ref, text);
  }

  function renderHtml(ref, text, options) {
    var raw = String(text || '');
    if (!raw || !isEnabled()) return escapeHtml(raw);

    var opts = options || {};
    var ranges = resolveRanges(ref, raw, opts);
    if (!ranges.length) return escapeHtml(raw);

    var openQuote = opts.quote === false ? '' : '\u201c';
    var closeQuote = opts.quote === false ? '' : '\u201d';
    var html = escapeHtml(openQuote);
    var cursor = 0;

    ranges.forEach(function (range) {
      if (range.start > cursor) {
        html += escapeHtml(raw.slice(cursor, range.start));
      }
      html += '<span class="red-letter">' + escapeHtml(raw.slice(range.start, range.end)) + '</span>';
      cursor = range.end;
    });
    if (cursor < raw.length) html += escapeHtml(raw.slice(cursor));
    html += escapeHtml(closeQuote);
    return html;
  }

  function setElementHtml(el, html) {
    if (!el) return;
    try {
      if (global.trustedTypes && global.trustedTypes.defaultPolicy && global.trustedTypes.defaultPolicy.createHTML) {
        el.innerHTML = global.trustedTypes.defaultPolicy.createHTML(html);
        return;
      }
    } catch (e) { /* fall through */ }
    el.innerHTML = html;
  }

  function applyToElement(el, ref, text, options) {
    if (!el) return;
    var raw = String(text || '');
    if (!isEnabled()) {
      var opts = options || {};
      var openQ = opts.quote === false ? '' : '\u201c';
      var closeQ = opts.quote === false ? '' : '\u201d';
      el.textContent = openQ + raw + closeQ;
      return;
    }
    setElementHtml(el, renderHtml(ref, raw, options));
  }

  function isRedLetterLike(ref, text) {
    if (!isGospelRef(ref)) return false;
    var body = String(text || '');
    if (!body) return false;
    if (guessRanges(ref, body).length) return true;
    return /(jesus said|jesus saith|then said jesus|and jesus said|jesus answered|verily,? verily|i say unto you)/i.test(body);
  }

  global.TDBRedLetter = {
    RED_LETTER_TOGGLE_KEY: RED_LETTER_TOGGLE_KEY,
    isEnabled: isEnabled,
    setEnabled: setEnabled,
    isGospelRef: isGospelRef,
    guessRanges: guessRanges,
    resolveRanges: resolveRanges,
    renderHtml: renderHtml,
    applyToElement: applyToElement,
    isRedLetterLike: isRedLetterLike
  };

  if (global.document && global.document.body) {
    global.document.body.classList.toggle('red-letter-off', !isEnabled());
  }
})(typeof window !== 'undefined' ? window : this);
