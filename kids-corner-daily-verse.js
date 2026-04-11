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
    fillFamilyQuickStart('', '');
    var kpq = byId('kids-parent-quick-line');
    if (kpq) kpq.textContent = '';
  }

  function plainVerse(raw) {
    return String(raw || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  var FAMILY_QUESTIONS = [
    'What one word from this verse stays with you right now?',
    'Where in your day does this verse feel close?',
    'Who might need to hear one line from this verse tonight?',
    'If you said this verse in your own plain words, what would you say?',
    'What feels kind here, and what feels hard?'
  ];

  function pickQuestionForKey(dayKey) {
    var s = String(dayKey || 'today');
    var n = s.split('').reduce(function (a, c) {
      return a + c.charCodeAt(0);
    }, 0);
    return FAMILY_QUESTIONS[n % FAMILY_QUESTIONS.length];
  }

  /** Short on-screen line for family hub (full text still lives in the card below). */
  function clipVerseSnippet(raw, maxLen) {
    var s = plainVerse(raw);
    var n = typeof maxLen === 'number' ? maxLen : 200;
    if (!s || s.length <= n) return s;
    var cut = s.slice(0, n);
    var sp = cut.lastIndexOf(' ');
    if (sp > n * 0.55) cut = cut.slice(0, sp);
    return cut + '\u2026';
  }

  function fillFamilyQuickStart(battleRef, verseSnippet) {
    var qsRef = byId('family-quick-start-ref');
    var qsVerse = byId('family-quick-start-verse');
    var qsQ = byId('family-quick-start-question');
    if (!qsRef && !qsQ && !qsVerse) return;
    if (qsRef) {
      qsRef.textContent = battleRef ? battleRef + ' (KJV)' : '';
    }
    if (qsVerse) {
      qsVerse.textContent = verseSnippet ? '\u201c' + verseSnippet + '\u201d' : '';
    }
    if (qsQ) {
      try {
        var key = typeof window.getDailyKey === 'function' ? window.getDailyKey() : '';
        qsQ.textContent = pickQuestionForKey(key);
      } catch (e) {
        qsQ.textContent = FAMILY_QUESTIONS[0];
      }
    }
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
    var kpq = byId('kids-parent-quick-line');
    if ((!t || !r) && !kpq) return;
    try {
      var battle = await resolveBattle();
      if (!battle || !battle.ref) {
        if (t && r) showError();
        else {
          fillFamilyQuickStart('', '');
          if (kpq) kpq.textContent = '';
        }
        return;
      }
      var verse = plainVerse(window.getBibleVerseText(battle.ref) || battle.verse || '');
      if (t && r) {
        if (!verse) {
          t.textContent = 'Verse text is still loading. Wait a moment and refresh\u2014or open the full verse page.';
          r.textContent = battle.ref + ' (KJV)';
        } else {
          t.textContent = '\u201c' + verse + '\u201d';
          r.textContent = battle.ref + ' (KJV)';
        }
      }
      fillFamilyQuickStart(battle.ref, verse ? clipVerseSnippet(verse, 200) : '');
      if (kpq && battle.ref) {
        try {
          var dk = typeof window.getDailyKey === 'function' ? window.getDailyKey() : '';
          kpq.textContent =
            'Quick start: read ' +
            battle.ref +
            ' (KJV) together, then ask one quiet question—\u201c' +
            pickQuestionForKey(dk) +
            '\u201d';
        } catch (e4) {
          kpq.textContent = '';
        }
      }
      if (typeof window.trackEvent === 'function') {
        try {
          var ev = rootId() === 'family-daily-verse-root' ? 'family_hub_daily_verse' : 'kids_corner_daily_verse';
          window.trackEvent(ev, {});
        } catch (e3) { /* ignore */ }
      }
    } catch (e) {
      if (t && r) showError();
      else {
        fillFamilyQuickStart('', '');
        if (kpq) kpq.textContent = '';
      }
    }
  }

  function tick() {
    if (!byId(rootId()) && !byId('kids-parent-quick-line')) return;
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
