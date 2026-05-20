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
    var idx = (utcDayOfYear(d) - 1) % arr.length;
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
    p.textContent = '\u201c' + verse.text + '\u201d';
    textEl.appendChild(p);
  }

  function init() {
    var root = document.getElementById('tdbPorchVerseWidget');
    if (!root) return;

    if (isHiddenToday()) {
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

    if (!prebuilt) {
      var verse =
        pickVerseFromYear(window.__TDB_HERO_DAILY_YEAR) ||
        readCache() ||
        null;
      if (verse) {
        setVerseDom(refEl, textEl, verse);
        writeCache(verse);
        root.setAttribute('data-tdb-porch-verse-prebuilt', '1');
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
