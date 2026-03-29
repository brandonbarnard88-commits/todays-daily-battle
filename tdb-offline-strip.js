/**
 * Calm-hub offline strip: shows one reassuring line when navigator is offline.
 * Expects <div id="tdb-offline-strip" class="tdb-offline-strip hidden" role="status"
 *   aria-live="polite" data-tdb-offline-msg="…"></div>
 */
(function () {
  'use strict';

  function sync(el) {
    var msg = el.getAttribute('data-tdb-offline-msg') || '';
    if (!msg) {
      msg =
        'Offline — still got you. What you already saved on this page stays on this device when your browser allows it.';
    }
    var on = typeof navigator !== 'undefined' && navigator.onLine;
    el.classList.toggle('hidden', !!on);
    if (!on) el.textContent = msg;
  }

  function init() {
    var el = document.getElementById('tdb-offline-strip');
    if (!el) return;
    sync(el);
    window.addEventListener('online', function () {
      sync(el);
    });
    window.addEventListener('offline', function () {
      sync(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
