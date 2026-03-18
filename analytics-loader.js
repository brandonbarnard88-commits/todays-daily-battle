/**
 * GA4 lazy loader — loads analytics only after user interaction or ~3.5s idle.
 * Reduces TBT and main-thread work on initial load. No inline handlers (CSP-safe).
 */
(function () {
  var GA_ID = 'G-NFQ5GWJXCB';
  var loaded = false;

  // Stub dataLayer and gtag immediately so trackEvent() can queue before gtag.js loads
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  var events = ['click', 'touchstart', 'mousemove', 'scroll', 'keydown'];
  for (var i = 0; i < events.length; i++) {
    document.addEventListener(events[i], function () {
      if (!loaded) loadAnalytics();
    }, { once: true, passive: true });
  }

  setTimeout(function () {
    if (!loaded) loadAnalytics();
  }, 3500);
})();
