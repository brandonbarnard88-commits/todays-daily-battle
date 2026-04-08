/**
 * Google Search Console verification — injects meta tag when GOOGLE_SITE_VERIFICATION is set.
 * Load with defer after config.js so TDB_CONFIG is available.
 */
(function() {
  var cfg = window.TDB_CONFIG;
  if (cfg && cfg.GOOGLE_SITE_VERIFICATION) {
    var m = document.createElement('meta');
    m.name = 'google-site-verification';
    m.content = cfg.GOOGLE_SITE_VERIFICATION;
    document.head.appendChild(m);
  }
})();
