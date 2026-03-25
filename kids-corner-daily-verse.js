/**
 * Kids Loop Library — verse of the day (same calendar key + Supabase/offline/fallback as main site).
 * Depends on script.js (window.getDailyKey, getDailyBattleFallbackForKey, getBibleVerseText, bible).
 */
(function () {
  'use strict';

  var OFFLINE_PREFIX = 'tdb_offline_battle_';

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
    var t = byId('kids-daily-verse-text');
    var r = byId('kids-daily-verse-ref');
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
    var t = byId('kids-daily-verse-text');
    var r = byId('kids-daily-verse-ref');
    if (!t || !r) return;
    try {
      var battle = await resolveBattle();
      if (!battle || !battle.ref) {
        showError();
        return;
      }
      var verse = plainVerse(window.getBibleVerseText(battle.ref) || battle.verse || '');
      if (!verse) {
        t.textContent = 'Verse text is still loading. Wait a moment and refresh\u2014or ask a grown-up to open the full verse page.';
        r.textContent = battle.ref + ' (KJV)';
        return;
      }
      t.textContent = '\u201c' + verse + '\u201d';
      r.textContent = battle.ref + ' (KJV)';
      if (typeof window.trackEvent === 'function') {
        try {
          window.trackEvent('kids_corner_daily_verse', { ref: battle.ref });
        } catch (e3) { /* ignore */ }
      }
    } catch (e) {
      showError();
    }
  }

  function tick() {
    if (!byId('kids-daily-verse-root')) return;
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tick);
  } else {
    tick();
  }
})();
