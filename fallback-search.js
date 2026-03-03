/**
 * Fallback search when ?q= is in URL. Runs even if script.js fails.
 * External script (no inline) so CSP cannot block it.
 */
(function () {
  'use strict';
  var q = (typeof URLSearchParams !== 'undefined' && location.search)
    ? new URLSearchParams(location.search).get('q')
    : null;
  if (!q || typeof q !== 'string') return;
  q = q.trim();
  if (!q) return;

  function runFallback() {
    var out = document.getElementById('output');
    if (!out) return;
    out.innerHTML = '<p class="empty" style="text-align:center;padding:1.5rem;">Seeking God\'s truth…</p>';
    out.style.display = 'grid';
    var urls = ['kjv.json', 'https://todaysdailybattle.com/kjv.json'];
    function tryFetch(i) {
      if (i >= urls.length) return Promise.reject();
      return fetch(urls[i])
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .catch(function () { return tryFetch(i + 1); });
    }
    tryFetch(0).then(function (arr) {
      if (!Array.isArray(arr)) return;
      var term = q.toLowerCase();
      var matches = [];
      for (var i = 0; i < arr.length; i++) {
        var v = arr[i];
        if (!v || !v.ref || !v.text) continue;
        if (v.text.toLowerCase().indexOf(term) !== -1) matches.push(v);
      }
      if (matches.length === 0) matches = arr.slice(0, 8);
      var html = '<div class="results"><h4 class="section-divider">Verses for "' +
        q.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '"</h4>';
      for (var j = 0; j < Math.min(matches.length, 12); j++) {
        var m = matches[j];
        html += '<div class="verse-card"><strong>' + m.ref + '</strong><p>' +
          m.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p></div>';
      }
      html += '</div>';
      out.innerHTML = html;
      out.style.display = 'grid';
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }).catch(function () {
      if (out) out.innerHTML = '<p style="text-align:center;color:#888;">Could not load verses. Check your connection.</p>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runFallback);
  } else {
    runFallback();
  }
})();
