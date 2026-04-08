/**
 * Pass 2 — calm offline / error strip for major tools.
 * Optional: <div id="tdb-offline-strip" class="tdb-offline-strip hidden" data-tdb-offline-page="reader" role="status" aria-live="polite"><p class="offline-msg"></p></div>
 * Legacy: data-tdb-offline-msg="…" still works when data-tdb-offline-page is omitted.
 *
 * Globals: TDB_showOfflineStrip(pageKey, opts?), TDB_hideOfflineStripIfOnline(), TDB_handleStorageError(), TDB_syncOfflineStrip()
 */
(function (global) {
  'use strict';

  var MESSAGES = {
    reader:
      'Offline — still got you. Cached chapters are available. New chapters will load when you’re back online.',
    'bible-tool':
      'Offline — still got you. Search works on cached verses only.',
    plans:
      'Offline — still got you. Your saved progress is here. New plans will load when online.',
    mystudy:
      'Offline — still got you. All your notes and saves are safe on this device.',
    'what-god-has-done':
      'Offline — still got you. Your private journal entries are saved on this device.',
    memorize:
      'Offline — still got you. Your memory list and rhythm are here.',
    'verse-study':
      'Offline — still got you. Saved studies and lexicon are available.',
    'word-study':
      'Offline — still got you. The lexicon is cached on this device.',
    storage:
      'Storage may be full. Try exporting older notes. Reading still works; saving may fail until there is room.',
    default:
      'Offline — still got you. Most features still work with cached data.'
  };

  function ensureMsgEl(strip) {
    var p = strip.querySelector('.offline-msg');
    if (!p) {
      p = document.createElement('p');
      p.className = 'offline-msg';
      if (strip.textContent && strip.textContent.trim() && !strip.querySelector('p')) {
        p.textContent = strip.textContent.trim();
        strip.textContent = '';
      }
      strip.appendChild(p);
    }
    return p;
  }

  function createOfflineStrip() {
    var d = document.createElement('div');
    d.id = 'tdb-offline-strip';
    d.className = 'tdb-offline-strip hidden';
    d.setAttribute('role', 'status');
    d.setAttribute('aria-live', 'polite');
    var p = document.createElement('p');
    p.className = 'offline-msg';
    d.appendChild(p);
    var body = document.body;
    if (body && body.firstChild) {
      body.insertBefore(d, body.firstChild);
    } else if (body) {
      body.appendChild(d);
    }
    return d;
  }

  function getStrip() {
    var el = document.getElementById('tdb-offline-strip');
    if (!el) {
      el = createOfflineStrip();
    } else {
      ensureMsgEl(el);
    }
    return el;
  }

  function pageKeyFromEl(strip) {
    if (!strip) return null;
    var k = strip.getAttribute('data-tdb-offline-page');
    return k && String(k).trim() ? String(k).trim() : null;
  }

  function messageForKey(key, strip) {
    if (key && MESSAGES[key]) return MESSAGES[key];
    if (strip) {
      var leg = strip.getAttribute('data-tdb-offline-msg');
      if (leg && String(leg).trim()) return String(leg).trim();
    }
    return MESSAGES.default;
  }

  function applyMessage(strip, key) {
    ensureMsgEl(strip).textContent = messageForKey(key, strip);
  }

  function showOfflineStrip(pageKey, opts) {
    opts = opts || {};
    var strip = getStrip();
    var key = pageKey != null && String(pageKey).trim() ? String(pageKey).trim() : pageKeyFromEl(strip);
    applyMessage(strip, key || 'default');
    strip.classList.remove('hidden');
    if (opts.force) {
      strip.setAttribute('data-tdb-offline-forced', '1');
    }
  }

  function hideOfflineStripIfOnline() {
    var strip = document.getElementById('tdb-offline-strip');
    if (!strip) return;
    if (strip.getAttribute('data-tdb-offline-forced') === '1') return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    strip.classList.add('hidden');
  }

  function syncFromNavigator() {
    var strip = document.getElementById('tdb-offline-strip');
    if (!strip) return;
    ensureMsgEl(strip);
    var online = typeof navigator !== 'undefined' && navigator.onLine;
    if (online && strip.getAttribute('data-tdb-offline-forced') !== '1') {
      strip.classList.add('hidden');
      return;
    }
    if (!online) {
      var key = pageKeyFromEl(strip);
      applyMessage(strip, key || 'default');
      strip.classList.remove('hidden');
    }
  }

  function handleStorageError() {
    showOfflineStrip('storage', { force: true });
    try {
      if (typeof global.showEliteToast === 'function') {
        global.showEliteToast('Storage may be full. Try exporting older entries.');
      }
    } catch (e) {}
  }

  function init() {
    var strip = document.getElementById('tdb-offline-strip');
    if (strip) ensureMsgEl(strip);
    syncFromNavigator();
    window.addEventListener('online', function () {
      var s = document.getElementById('tdb-offline-strip');
      if (s) s.removeAttribute('data-tdb-offline-forced');
      syncFromNavigator();
    });
    window.addEventListener('offline', syncFromNavigator);
  }

  global.TDB_showOfflineStrip = showOfflineStrip;
  global.TDB_hideOfflineStripIfOnline = hideOfflineStripIfOnline;
  global.TDB_handleStorageError = handleStorageError;
  global.TDB_syncOfflineStrip = syncFromNavigator;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})(typeof window !== 'undefined' ? window : this);
