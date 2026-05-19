/**
 * Renders Stations on the Ribbon and wires Deep Lesson layer toggle.
 */
(function () {
  'use strict';

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function stationHref(slug) {
    return '/life-lessons/' + slug + '.html';
  }

  function renderStationCard(s) {
    return (
      '<article class="mobius-station-card" id="mobius-station-' +
      esc(s.slug) +
      '" data-station-slug="' +
      esc(s.slug) +
      '">' +
      '<h4 class="mobius-station-title"><a href="' +
      esc(stationHref(s.slug)) +
      '">' +
      esc(s.title) +
      '</a> <span class="mobius-station-sub">' +
      esc(s.subtitle) +
      '</span></h4>' +
      '<p class="mobius-station-ref">' +
      esc(s.ref) +
      ' <abbr title="King James Version">KJV</abbr></p>' +
      '<p class="mobius-station-line">' +
      esc(s.line) +
      '</p>' +
      '<p class="mobius-station-breath"><span class="mobius-station-breath-label">Breath on the ribbon:</span> Inhale&mdash;' +
      esc(s.breathInhale) +
      ' Exhale&mdash;' +
      esc(s.breathExhale) +
      '</p>' +
      '<p class="mobius-station-step"><span class="mobius-station-step-label">Small step:</span> ' +
      esc(s.smallStep) +
      '</p>' +
      '<p class="mobius-station-enter"><a class="btn btn-secondary" href="' +
      esc(stationHref(s.slug)) +
      '">Enter the room</a></p>' +
      '</article>'
    );
  }

  function renderList() {
    var list = document.getElementById('mobius-ribbon-stations-list');
    if (!list || !window.TDB_MOBIUS_DEEP_STATIONS) return;

    var groups = [];
    var seen = {};
    window.TDB_MOBIUS_DEEP_STATIONS.forEach(function (s) {
      if (!seen[s.group]) {
        seen[s.group] = true;
        groups.push(s.group);
      }
    });

    var html = '';
    groups.forEach(function (group) {
      html += '<div class="mobius-station-group" role="list">';
      html += '<h4 class="mobius-station-group-title">' + esc(group) + '</h4>';
      window.TDB_MOBIUS_DEEP_STATIONS.filter(function (s) {
        return s.group === group;
      }).forEach(function (s) {
        html += renderStationCard(s);
      });
      html += '</div>';
    });
    list.innerHTML = html;
  }

  function renderLayerChips() {
    var layer = document.getElementById('mobius-deep-lesson-layer');
    if (!layer || !window.TDB_MOBIUS_DEEP_STATIONS) return;
    var chips = window.TDB_MOBIUS_DEEP_STATIONS.filter(function (s) {
      return s.featured;
    });
    var html =
      '<p class="section-note util-mb-0">Featured turns&mdash;tap to open the deep room. The mood graph keeps running; lessons open in a calm new tab.</p><div class="mobius-deep-lesson-chips" role="list">';
    chips.forEach(function (s) {
      html +=
        '<a class="mobius-deep-lesson-chip" role="listitem" href="' +
        esc(stationHref(s.slug)) +
        '" target="_blank" rel="noopener noreferrer">' +
        esc(s.title) +
        '</a>';
    });
    html += '</div>';
    layer.innerHTML = html;
  }

  function enhanceNodeCard() {
    if (!window.TDB_MOBIUS_STATION_BY_MOOD) return;
    var container = document.querySelector('#mobius-universal-viz .mobius-card-container');
    if (!container) return;
    var observer = new MutationObserver(function () {
      var card = container.querySelector('.mobius-node-card');
      if (!card || card.querySelector('.mobius-card-station-link')) return;
      var title = card.querySelector('.mobius-card-title');
      if (!title) return;
      var label = title.textContent || '';
      var moodKey = '';
      if (/fear/i.test(label)) moodKey = 'fear';
      else if (/anxiety|worry/i.test(label)) moodKey = 'anxiety';
      else if (/grief/i.test(label)) moodKey = 'grief';
      else if (/anger/i.test(label)) moodKey = 'anger';
      else if (/lonely/i.test(label)) moodKey = 'loneliness';
      else if (/guilt/i.test(label)) moodKey = 'guilt';
      var station = window.TDB_MOBIUS_STATION_BY_MOOD[moodKey];
      if (!station) return;
      var p = document.createElement('p');
      p.className = 'mobius-card-station-link';
      p.innerHTML =
        '<a href="' +
        esc(stationHref(station.slug)) +
        '">Station on the ribbon: ' +
        esc(station.title) +
        '</a>';
      card.appendChild(p);
    });
    observer.observe(container, { childList: true, subtree: true });
  }

  function wireToggle() {
    var toggle = document.getElementById('mobius-deep-lesson-layer-toggle');
    var layer = document.getElementById('mobius-deep-lesson-layer');
    if (!toggle || !layer) return;
    var key = 'tdb_mobius_deep_lesson_layer';
    try {
      if (localStorage.getItem(key) === '1') {
        toggle.checked = true;
        layer.hidden = false;
      }
    } catch (e) {}
    toggle.addEventListener('change', function () {
      var on = toggle.checked;
      layer.hidden = !on;
      try {
        localStorage.setItem(key, on ? '1' : '0');
      } catch (e2) {}
    });
  }

  function scrollToStationFromHash() {
    var hash = (location.hash || '').replace(/^#/, '');
    if (!hash || hash.indexOf('mobius-station-') !== 0) return;
    var el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function init() {
    renderList();
    renderLayerChips();
    wireToggle();
    enhanceNodeCard();
    scrollToStationFromHash();
    window.addEventListener('hashchange', scrollToStationFromHash);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
