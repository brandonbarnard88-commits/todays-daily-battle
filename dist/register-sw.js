/**
 * Single service worker registration for Today's Daily Battle.
 * Bump TDB_SW_QUERY with repo SW-VERSION — must match index / script / sw.js registration URLs.
 */
(function () {
  'use strict';

  /** @type {string} Single bump token — keep in sync with SW-VERSION, verify-service-worker.mjs, and precache. */
  var TDB_SW_QUERY = 'v=20260823desk39';
  var SW_URL = '/sw.js?' + TDB_SW_QUERY;

  if (typeof window === 'undefined') return;

  function logDev(msg) {
    try {
      if (typeof location !== 'undefined' && /[?&]swdebug=1/.test(location.search || '') && typeof console !== 'undefined' && console.log) {
        console.log('[TDB SW]', msg);
      }
    } catch (e) {}
  }

  var regPromise = null;

  /**
   * Idempotent: one register() call; same Promise for all callers (no duplicate installs).
   * @returns {Promise<ServiceWorkerRegistration|null>}
   */
  function tdbRegisterServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      return Promise.resolve(null);
    }
    if (regPromise) return regPromise;
    regPromise = navigator.serviceWorker
      .register(SW_URL, { scope: '/', updateViaCache: 'none' })
      .then(function (reg) {
        logDev('registered ' + SW_URL);
        return reg || null;
      })
      .catch(function (err) {
        regPromise = null;
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('TDB SW registration failed:', err && err.message ? err.message : err);
        }
        return null;
      });
    return regPromise;
  }

  window.tdbRegisterServiceWorker = tdbRegisterServiceWorker;

  /** Prayer wall offline sync — handler lives here so script.js need not register SW. */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', function (event) {
      if (!event || !event.data || event.data.type !== 'TDB_FLUSH_PRAYER_QUEUE') return;
      if (typeof flushPrayerOfflineQueue === 'function') flushPrayerOfflineQueue();
    });
  }

  function scheduleRegister() {
    function run() {
      tdbRegisterServiceWorker().catch(function () {});
    }
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(run, { timeout: 3500 });
    } else {
      setTimeout(run, 1);
    }
  }

  if (document.readyState === 'complete') {
    scheduleRegister();
  } else {
    window.addEventListener('load', scheduleRegister);
  }
})();
