/**
 * Surface loader: Plans / Plans
 * Sets TDB_SURFACE before the shared interaction stack (script.js).
 * Plans-specific builders stay in plans-builder.js / plans-weary-season-plans.js.
 */
(function (global) {
  'use strict';
  if (typeof global === 'undefined') return;
  global.TDB_SURFACE = 'plans';
  global.TDB_SURFACE_META = {
    id: 'plans',
    name: 'Plans',
    pathHints: ['/plans.html', '/plans'],
    loadsInteractive: 'script.js (module)',
    companion: ['plans-builder.js', 'plans-weary-season-plans.js', 'university-plan-extensions.js']
  };

  function loadSharedStack() {
    if (document.querySelector('script[data-tdb-surface-stack="plans"]')) return;
    var version =
      (global.TDB_CONFIG && global.TDB_CONFIG.SITE_ASSET_VERSION) ||
      '20260805-four-pillars';
    var s = document.createElement('script');
    s.type = 'module';
    s.src = '/script.js?v=' + version;
    s.setAttribute('data-cfasync', 'false');
    s.setAttribute('data-tdb-surface-stack', 'plans');
    (document.head || document.documentElement).appendChild(s);
  }

  // Only auto-inject when this file is the page entry (data-tdb-surface-entry).
  // plans.html may still tag script.js directly; both paths set TDB_SURFACE.
  if (document.currentScript && document.currentScript.getAttribute('data-tdb-surface-entry') === '1') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadSharedStack);
    } else {
      loadSharedStack();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
