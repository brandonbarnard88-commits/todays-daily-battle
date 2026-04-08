/**
 * GA4 lazy loader — loads analytics only after user interaction or ~3.5s idle.
 * Reduces TBT and main-thread work on initial load. No inline handlers (CSP-safe).
 */
(function () {
  if (window.__tdbAnalyticsLoaderWired) return;
  window.__tdbAnalyticsLoaderWired = true;
  var GA_ID = 'G-NFQ5GWJXCB';
  var loaded = false;
  var bootstrapped = false;
  var disableKey = 'ga-disable-' + GA_ID;

  function hasConsent() {
    try {
      if (typeof window.__tdbHasAnalyticsConsent === 'function') {
        return !!window.__tdbHasAnalyticsConsent();
      }
    } catch (_) {}
    try {
      var raw = localStorage.getItem('tdb_cookie_consent_v1');
      if (!raw) return false;
      var parsed = JSON.parse(raw);
      return !!(parsed && parsed.status === 'accepted');
    } catch (_) {
      return false;
    }
  }

  function updateGaDisableFlag() {
    try {
      window[disableKey] = !hasConsent();
    } catch (_) {}
  }

  function bootstrapGtag() {
    if (bootstrapped || !hasConsent()) return;
    bootstrapped = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function loadAnalytics() {
    updateGaDisableFlag();
    if (loaded || !hasConsent()) return;
    loaded = true;
    bootstrapGtag();

    var url = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    var trusted = null;
    try {
      if (window.trustedTypes && window.trustedTypes.defaultPolicy && window.trustedTypes.defaultPolicy.createScriptURL) {
        trusted = window.trustedTypes.defaultPolicy.createScriptURL(url);
      }
    } catch (_) {}
    if (!trusted && !window.trustedTypes) trusted = url;
    if (!trusted) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = trusted;
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

  window.__tdbLoadAnalyticsNow = loadAnalytics;
  window.addEventListener('tdb-analytics-consent-change', function (ev) {
    updateGaDisableFlag();
    if (ev && ev.detail && ev.detail.status === 'accepted') loadAnalytics();
  });
  updateGaDisableFlag();
})();
