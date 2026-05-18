/**
 * Early head: reduced-motion + optional perf mode before first paint.
 * Also strips the retired floating first-tour chip if a stale HTML shell or SW still injects it.
 * Loaded from index.html with nonce (strict CSP — no unsafe-inline).
 */
(function () {
  try {
    var m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var o = localStorage.getItem('tdb_perf_mode') === '1';
    if (m || o) document.documentElement.classList.add('tdb-perf-mode');
  } catch (e) {}

  function stripLegacyFirstTourPrompt() {
    try {
      if (!document.querySelectorAll) return;
      var list = document.querySelectorAll('#tdb-first-tour-prompt, .tdb-first-tour-prompt');
      for (var i = list.length - 1; i >= 0; i--) {
        var el = list[i];
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }
    } catch (e2) {}
  }

  function startWatching() {
    stripLegacyFirstTourPrompt();
    try {
      if (!document.body) return;
      var obs = new MutationObserver(stripLegacyFirstTourPrompt);
      obs.observe(document.body, { childList: true, subtree: true });
      window.setTimeout(function () {
        try {
          obs.disconnect();
        } catch (e3) {}
      }, 12000);
    } catch (e4) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      function () {
        stripLegacyFirstTourPrompt();
        startWatching();
      },
      { once: true }
    );
  } else {
    stripLegacyFirstTourPrompt();
    startWatching();
  }
  window.addEventListener('load', stripLegacyFirstTourPrompt, { once: true });
})();
