/**
 * Soft Today's Verse widget — optional, dismissible for the UTC day.
 * Explore, Plans, and Family hub; same KJV calendar as Home (__TDB_HERO_DAILY_YEAR).
 */
(function () {
  'use strict';

  var HIDE_KEY = 'tdb-porch-verse-hidden';
  var CACHE_KEY = 'tdb-porch-verse-cache';

  function utcDateKey(d) {
    d = d || new Date();
    return (
      d.getUTCFullYear() +
      '-' +
      String(d.getUTCMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getUTCDate()).padStart(2, '0')
    );
  }

  function utcDayOfYear(d) {
    d = d || new Date();
    var y = d.getUTCFullYear();
    var jan1 = Date.UTC(y, 0, 1);
    var todayUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    return Math.floor((todayUtc - jan1) / 86400000) + 1;
  }

  function pickVerseFromYear(arr, d) {
    if (!arr || !arr.length) return null;
    d = d || new Date();
    var todayUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    var epoch = Date.UTC(2026, 0, 1);
    var days = Math.floor((todayUtc - epoch) / 86400000);
    var idx = ((days % arr.length) + arr.length) % arr.length;
    return arr[idx] || null;
  }

  function isHiddenToday() {
    try {
      return localStorage.getItem(HIDE_KEY) === utcDateKey();
    } catch (e) {
      return false;
    }
  }

  function hideForToday() {
    try {
      localStorage.setItem(HIDE_KEY, utcDateKey());
    } catch (e) { /* ignore */ }
    document.documentElement.classList.add('tdb-porch-verse-hidden');
    var root = document.getElementById('tdbPorchVerseWidget');
    if (root) root.hidden = true;
  }

  function readCache(d) {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.date !== utcDateKey(d)) return null;
      if (!parsed.ref || !parsed.text) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function writeCache(verse, d) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          date: utcDateKey(d),
          ref: verse.ref,
          text: verse.text
        })
      );
    } catch (e) { /* ignore */ }
  }

  function setVerseDom(refEl, textEl, verse) {
    if (!verse || !refEl || !textEl) return;
    refEl.textContent = verse.ref + ' (KJV)';
    while (textEl.firstChild) textEl.removeChild(textEl.firstChild);
    var p = document.createElement('p');
    p.className = 'verse-body';
    p.setAttribute('data-verse-ref', verse.ref);
    if (window.TDBRedLetter && typeof window.TDBRedLetter.applyToElement === 'function') {
      textEl.appendChild(p);
      window.TDBRedLetter.applyToElement(p, verse.ref, verse.text, { quote: true });
    } else {
      p.textContent = '\u201c' + verse.text + '\u201d';
      textEl.appendChild(p);
    }
  }

  function init() {
    var root = document.getElementById('tdbPorchVerseWidget');
    if (!root) return;

    var required = root.getAttribute('data-tdb-porch-verse-required') === '1';
    if (isHiddenToday() && !required) {
      root.hidden = true;
      document.documentElement.classList.add('tdb-porch-verse-hidden');
      return;
    }

    root.hidden = false;

    var refEl = document.getElementById('tdbPorchVerseRef');
    var textEl = document.getElementById('tdbPorchVerseText');
    var hideBtn = document.getElementById('tdbPorchVerseHide');

    var prebuilt =
      root.getAttribute('data-tdb-porch-verse-prebuilt') === '1' &&
      refEl &&
      refEl.textContent &&
      refEl.textContent !== '\u2014' &&
      refEl.textContent !== '—';

    function fillFromQueue() {
      var verse =
        pickVerseFromYear(window.__TDB_HERO_DAILY_YEAR) ||
        readCache() ||
        null;
      if (!verse) return false;
      setVerseDom(refEl, textEl, verse);
      writeCache(verse);
      root.setAttribute('data-tdb-porch-verse-prebuilt', '1');
      return true;
    }

    function stampedRef() {
      return refEl
        ? String(refEl.textContent || '')
            .replace(/\s*\(KJV\)\s*$/i, '')
            .replace(/\s+/g, ' ')
            .trim()
        : '';
    }
    function queueRef() {
      var q = pickVerseFromYear(window.__TDB_HERO_DAILY_YEAR);
      return q && q.ref
        ? String(q.ref)
            .replace(/\s*\(KJV\)\s*$/i, '')
            .replace(/\s+/g, ' ')
            .trim()
        : '';
    }
    var stampedIsToday = prebuilt && stampedRef() && queueRef() && stampedRef() === queueRef();
    if (!prebuilt || !stampedIsToday) {
      if (!fillFromQueue()) {
        var tries = 0;
        var wait = setInterval(function () {
          tries += 1;
          if (fillFromQueue() || tries > 40) {
            clearInterval(wait);
            if (
              refEl &&
              root.getAttribute('data-tdb-porch-verse-prebuilt') !== '1' &&
              (refEl.textContent === '\u2014' || refEl.textContent === '—')
            ) {
              refEl.textContent = '';
            }
          }
        }, 50);
      }
    } else if (refEl && textEl) {
      var cached = readCache();
      if (!cached && refEl.textContent) {
        var textNode = textEl.querySelector('p');
        writeCache({
          ref: refEl.textContent.replace(/\s*\(KJV\)\s*$/i, '').trim(),
          text: textNode
            ? textNode.textContent.replace(/^[\s\u201c"]+|[\s\u201d"]+$/g, '').trim()
            : textEl.textContent.trim()
        });
      }
    }

    if (hideBtn) {
      hideBtn.addEventListener('click', hideForToday);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
