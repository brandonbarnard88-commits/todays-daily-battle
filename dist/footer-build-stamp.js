/**
 * Fills #footer-date when HTML still has the build placeholder or empty text.
 * Loaded as a classic deferred script from <head> (injected in dist by build-copy-static.js)
 * so it does not depend on script.js (module cache / load order).
 */
(function () {
  'use strict';
  /** Replaced in dist only: real build date from npm run build (survives missing build-date.txt). */
  var INLINE_STAMP = 'August 6, 2026';
  function fallbackDate() {
    var d = new Date();
    var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return m[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function needsFix(v) {
    var s = String(v == null ? '' : v).replace(/\u00a0/g, ' ').trim();
    return !s || s === 'TDB_BUILD_DATE' || s.indexOf('TDB_BUILD_DATE') !== -1;
  }
  function applyStamp(raw) {
    var stamp = String(raw || '').replace(/\u00a0/g, ' ').trim();
    if (!stamp || needsFix(stamp)) stamp = fallbackDate();
    var nodes = document.querySelectorAll('#footer-date');
    if (!nodes.length) return;
    var i;
    for (i = 0; i < nodes.length; i++) {
      if (needsFix(nodes[i].textContent)) nodes[i].textContent = stamp;
    }
    try {
      window.__tdbFooterBuildDateHydrated = true;
      window.__tdbFooterBuildDateBootstrapped = true;
    } catch (e) {}
  }
  function metaStamp() {
    try {
      var el = document.querySelector('meta[name="tdb-build-stamp"]');
      if (!el) return '';
      return String(el.getAttribute('content') || '').replace(/\u00a0/g, ' ').trim();
    } catch (e) {
      return '';
    }
  }
  function buildDateUrl() {
    try {
      var o = window.location && window.location.origin;
      if (o && o !== 'null') {
        return new URL('/build-date.txt', o).href;
      }
    } catch (e) {}
    try {
      var b = document.querySelector('base[href]');
      if (b && b.href) {
        var u = new URL('/build-date.txt', b.href);
        return u.href;
      }
    } catch (e2) {}
    return '/build-date.txt';
  }
  function distInlineStamp() {
    if (typeof INLINE_STAMP !== 'string') return '';
    if (INLINE_STAMP.indexOf('@@') !== -1) return '';
    var s = INLINE_STAMP.replace(/\u00a0/g, ' ').trim();
    return s && !needsFix(s) ? s : '';
  }
  function run() {
    try {
      if (typeof window !== 'undefined' && window.__tdbFooterBuildDateHydrated) return;
    } catch (e0) {}
    var fromDist = distInlineStamp();
    if (fromDist) {
      applyStamp(fromDist);
      return;
    }
    var m = metaStamp();
    if (m && !needsFix(m)) {
      applyStamp(m);
      return;
    }
    /* Unstamped JS (source tree, LAN dev, previews, stale cache): no reliable /build-date.txt — skip fetch (avoids 404 noise). */
    try {
      var unreplaced = typeof INLINE_STAMP === 'string' && INLINE_STAMP.indexOf('@@') !== -1;
      if (unreplaced) {
        applyStamp(fallbackDate());
        return;
      }
    } catch (eLocal) {}
    var nodes = document.querySelectorAll('#footer-date');
    if (!nodes.length) return;
    var j;
    var need = false;
    for (j = 0; j < nodes.length; j++) {
      if (needsFix(nodes[j].textContent)) {
        need = true;
        break;
      }
    }
    if (!need) {
      try {
        window.__tdbFooterBuildDateHydrated = true;
        window.__tdbFooterBuildDateBootstrapped = true;
      } catch (e1) {}
      return;
    }
    if (typeof fetch !== 'function') {
      applyStamp('');
      return;
    }
    fetch(buildDateUrl(), { cache: 'no-store', credentials: 'same-origin' })
      .then(function (r) {
        return r.ok ? r.text() : Promise.reject();
      })
      .then(function (t) {
        applyStamp((t || '').trim());
      })
      .catch(function () {
        applyStamp('');
      });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
