/**
 * Early head: reduced-motion + optional perf mode before first paint.
 * Loaded from index.html with nonce (strict CSP — no unsafe-inline).
 */
(function () {
  try {
    var m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var o = localStorage.getItem('tdb_perf_mode') === '1';
    if (m || o) document.documentElement.classList.add('tdb-perf-mode');
  } catch (e) {}
})();
