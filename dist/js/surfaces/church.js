/**
 * Surface loader: Church / Pastors
 * Sets TDB_SURFACE before the shared interaction stack (script.js).
 * Church-specific UI lives in church/church.js.
 */
(function (global) {
  'use strict';
  if (typeof global === 'undefined') return;
  global.TDB_SURFACE = 'church';
  global.TDB_SURFACE_META = {
    id: 'church',
    name: 'Church',
    pathHints: ['/church.html', '/church/', '/church-hub.html', '/for-pastors.html', '/sermon.html'],
    loadsInteractive: 'script.js (module)',
    companion: ['church/church.js', 'church.css']
  };

  function loadSharedStack() {
    if (document.querySelector('script[data-tdb-surface-stack="church"]')) return;
    var version =
      (global.TDB_CONFIG && global.TDB_CONFIG.SITE_ASSET_VERSION) ||
      '20260805-four-pillars';
    var s = document.createElement('script');
    s.type = 'module';
    s.src = '/script.js?v=' + version;
    s.setAttribute('data-cfasync', 'false');
    s.setAttribute('data-tdb-surface-stack', 'church');
    (document.head || document.documentElement).appendChild(s);
  }

  if (document.currentScript && document.currentScript.getAttribute('data-tdb-surface-entry') === '1') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadSharedStack);
    } else {
      loadSharedStack();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
