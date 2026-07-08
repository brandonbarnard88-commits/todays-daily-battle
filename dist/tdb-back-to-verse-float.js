/**
 * Mobile-only fixed link back to today's KJV verse (verse.html).
 * Injected on tdb-inner-page HTML via build-copy-static.js — not on home or verse page.
 */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  try {
    if (window.matchMedia && window.matchMedia('(min-width: 769px)').matches) return;
    var path = (location.pathname || '/').toLowerCase();
    if (path === '/' || path === '/index.html') return;
    if (path === '/verse.html' || path.endsWith('/verse.html')) return;
    if (path.indexOf('/embed') !== -1) return;
    if (document.getElementById('tdb-float-back-verse')) return;
    var a = document.createElement('a');
    a.id = 'tdb-float-back-verse';
    a.className = 'tdb-float-back-verse';
    a.href = '/verse.html';
    a.setAttribute('aria-label', "Today's KJV verse");
    a.textContent = "Today's verse";
    document.body.appendChild(a);
  } catch (e) { /* quiet */ }
})();
