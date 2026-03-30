/**
 * Kids Loop Library — verse of the day (same calendar key + Supabase/offline/fallback as main site).
 * Depends on script.js (window.getDailyKey, getDailyBattleFallbackForKey, getBibleVerseText, bible).
 * Optional: set window.TDB_DAILY_VERSE_ROOT_ID, TDB_DAILY_VERSE_TEXT_ID, TDB_DAILY_VERSE_REF_ID before load (e.g. Family hub).
 */
(function () {
  'use strict';

  var OFFLINE_PREFIX = 'tdb_offline_battle_';

  function rootId() {
    return window.TDB_DAILY_VERSE_ROOT_ID || 'kids-daily-verse-root';
  }
  function textId() {
    return window.TDB_DAILY_VERSE_TEXT_ID || 'kids-daily-verse-text';
  }
  function refId() {
    return window.TDB_DAILY_VERSE_REF_ID || 'kids-daily-verse-ref';
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function ready() {
    return typeof window.getDailyBattleFallbackForKey === 'function' &&
      typeof window.getDailyKey === 'function' &&
      typeof window.getBibleVerseText === 'function' &&
      window.bible &&
      Object.keys(window.bible).length > 0;
  }

  function showError(msg) {
    var t = byId(textId());
    var r = byId(refId());
    if (t) t.textContent = msg || 'Could not load today\u2019s verse. Try again when you\u2019re online.';
    if (r) r.textContent = '';
  }

  function plainVerse(raw) {
    return String(raw || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async function resolveBattle() {
    var key = window.getDailyKey();
    var fallback = window.getDailyBattleFallbackForKey;
    var fetchS = window.getDailyBattleFromSupabaseForKey;
    var battle = null;
    try {
      if (!navigator.onLine) {
        var raw = localStorage.getItem(OFFLINE_PREFIX + key);
        if (raw) {
          var c = JSON.parse(raw);
          if (c && c.ref) {
            battle = { ref: c.ref, verse: c.verse || '', reflection: c.reflection || '', prayer: c.prayer || '' };
          }
        }
      }
    } catch (e) { /* ignore */ }
    if (!battle && navigator.onLine && typeof fetchS === 'function') {
      try {
        battle = await fetchS(key);
      } catch (e2) { /* ignore */ }
    }
    if (!battle && typeof fallback === 'function') battle = fallback(key);
    return battle;
  }

  async function paint() {
    var t = byId(textId());
    var r = byId(refId());
    if (!t || !r) return;
    try {
      var battle = await resolveBattle();
      if (!battle || !battle.ref) {
        showError();
        return;
      }
      var verse = plainVerse(window.getBibleVerseText(battle.ref) || battle.verse || '');
      if (!verse) {
        t.textContent = 'Verse text is still loading. Wait a moment and refresh\u2014or open the full verse page.';
        r.textContent = battle.ref + ' (KJV)';
        return;
      }
      t.textContent = '\u201c' + verse + '\u201d';
      r.textContent = battle.ref + ' (KJV)';
      if (typeof window.trackEvent === 'function') {
        try {
          var ev = rootId() === 'family-daily-verse-root' ? 'family_hub_daily_verse' : 'kids_corner_daily_verse';
          window.trackEvent(ev, {});
        } catch (e3) { /* ignore */ }
      }
    } catch (e) {
      showError();
    }
  }

  function tick() {
    if (!byId(rootId())) return;
    if (ready()) {
      paint();
      return;
    }
    if (typeof window.__kidsDailyVerseAttempts === 'undefined') window.__kidsDailyVerseAttempts = 0;
    window.__kidsDailyVerseAttempts += 1;
    if (window.__kidsDailyVerseAttempts > 120) {
      showError('Still loading\u2014check your connection and refresh.');
      return;
    }
    setTimeout(tick, 250);
  }

  function start() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tick);
    } else {
      tick();
    }
    try {
      window.addEventListener('tdb-bible-ready', function onBible() {
        window.removeEventListener('tdb-bible-ready', onBible);
        if (ready()) paint();
      });
    } catch (eL) { /* ignore */ }
  }
  start();
})();
