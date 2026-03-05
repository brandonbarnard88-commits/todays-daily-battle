/**
 * Deep-tab lineage tree (historical vertical timeline with golden connectors).
 */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function readProgressCount() {
    try {
      var arr = JSON.parse(localStorage.getItem('tdb_curriculum_progress_days') || '[]');
      return Array.isArray(arr) ? arr.length : 0;
    } catch (e) { return 0; }
  }

  function gemCount(days) {
    var checks = [73, 146, 219, 292, 365];
    var c = checks.filter(function (n) { return days >= n; }).length;
    return days + c * 7;
  }

  function render(nodes) {
    var list = document.getElementById('lineage-tree-list');
    var gemsEl = document.getElementById('lineage-crest-gems');
    if (!list || !gemsEl) return;

    var days = readProgressCount();
    gemsEl.textContent = String(gemCount(days));

    list.innerHTML = (nodes || []).map(function (n, i) {
      return '<article class="lineage-node">' +
        '<div class="lineage-dot" aria-hidden="true"></div>' +
        '<img class="lineage-avatar" loading="lazy" decoding="async" src="' + esc(n.avatarLink || '/icon.svg') + '" alt="">' +
        '<div class="lineage-content">' +
        '<h4>' + esc(n.name) + '</h4>' +
        '<p class="section-note util-mb-0_25">' + esc(n.dateRange) + '</p>' +
        '<p class="section-note util-mb-0">KJV: ' + esc(n.keyVerse) + '</p>' +
        '</div>' +
        (i < nodes.length - 1 ? '<div class="lineage-connector" aria-hidden="true"></div>' : '') +
      '</article>';
    }).join('');
  }

  function init() {
    var host = document.getElementById('lineage-tree-list');
    if (!host) return;
    fetch('family-lineage.json')
      .then(function (r) { return r.json(); })
      .then(function (j) { render(Array.isArray(j.nodes) ? j.nodes : []); })
      .catch(function () { host.textContent = 'Could not load lineage data.'; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
