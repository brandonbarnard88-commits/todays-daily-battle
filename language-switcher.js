/**
 * Language switcher: EN · ES · ID + "More languages" hub.
 * Pairs topical pages; persists tdb_lang_pref on explicit picks. No third-party scripts.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tdb_lang_pref';
  var MORE_HUB = '/explore.html#languages';

  var ES_TO_EN = {
    'ansiedad.html': '/topic-anxiety.html',
    'fuerza.html': '/topic-strength.html',
    'paz.html': '/calm.html'
  };

  var EN_TO_ES = {
    'topic-anxiety.html': '/ansiedad.html',
    'topic-strength.html': '/fuerza.html',
    'calm.html': '/paz.html'
  };

  var ID_TO_EN = {
    'kecemasan.html': '/topic-anxiety.html'
  };

  var EN_TO_ID = {
    'topic-anxiety.html': '/id/kecemasan.html',
    'ansiedad.html': '/id/kecemasan.html'
  };

  var ID_TO_ES = {
    'kecemasan.html': '/ansiedad.html'
  };

  var ES_TO_ID = {
    'ansiedad.html': '/id/kecemasan.html'
  };

  function baseFile() {
    var p = (window.location.pathname || '/').replace(/\/$/, '');
    var i = p.lastIndexOf('/');
    var f = i >= 0 ? p.slice(i + 1) : p;
    f = (f || '').split('?')[0];
    return f;
  }

  function docLang() {
    try {
      return (document.documentElement && document.documentElement.getAttribute('lang')) || '';
    } catch (e) {
      return '';
    }
  }

  function isSpanishTopical() {
    var f = baseFile();
    return f === 'ansiedad.html' || f === 'fuerza.html' || f === 'paz.html';
  }

  function isIndonesianTopical() {
    return baseFile() === 'kecemasan.html' || docLang() === 'id';
  }

  function isEnglishSurface() {
    var l = docLang().toLowerCase();
    if (l === 'es' || l === 'id') return false;
    return true;
  }

  function enHref() {
    var f = baseFile();
    if (ES_TO_EN[f]) return ES_TO_EN[f];
    if (ID_TO_EN[f]) return ID_TO_EN[f];
    if (isEnglishSurface()) {
      var path = window.location.pathname || '/';
      path = path.split('?')[0];
      if (path === '/' || path === '') return '/';
      return path;
    }
    return '/';
  }

  function esHref() {
    var f = baseFile();
    if (f === 'ansiedad.html' || f === 'fuerza.html' || f === 'paz.html') return '/' + f;
    if (EN_TO_ES[f]) return EN_TO_ES[f];
    if (ID_TO_ES[f]) return ID_TO_ES[f];
    return '/explore.html#topics-es';
  }

  function idHref() {
    var f = baseFile();
    if (f === 'kecemasan.html') return '/id/kecemasan.html';
    if (EN_TO_ID[f]) return EN_TO_ID[f];
    if (ES_TO_ID[f]) return ES_TO_ID[f];
    return '/id/kecemasan.html';
  }

  function moreHref() {
    if (isSpanishTopical()) return '/explore.html#topics-es';
    if (isIndonesianTopical()) return MORE_HUB;
    return MORE_HUB;
  }

  function applyHrefs() {
    var nodes = document.querySelectorAll('[data-tdb-lang-switcher]');
    for (var i = 0; i < nodes.length; i++) {
      var root = nodes[i];
      var en = root.querySelector('[data-tdb-pick="en"]');
      var es = root.querySelector('[data-tdb-pick="es"]');
      var id = root.querySelector('[data-tdb-pick="id"]');
      var more = root.querySelector('.tdb-lang-more');
      if (en) en.setAttribute('href', enHref());
      if (es) es.setAttribute('href', esHref());
      if (id) id.setAttribute('href', idHref());
      if (more) more.setAttribute('href', moreHref());
    }
  }

  function applyAriaCurrent() {
    var spanish = isSpanishTopical();
    var indo = baseFile() === 'kecemasan.html';
    var nodes = document.querySelectorAll('[data-tdb-lang-switcher]');
    for (var i = 0; i < nodes.length; i++) {
      var en = nodes[i].querySelector('[data-tdb-pick="en"]');
      var es = nodes[i].querySelector('[data-tdb-pick="es"]');
      var id = nodes[i].querySelector('[data-tdb-pick="id"]');
      if (en) en.removeAttribute('aria-current');
      if (es) es.removeAttribute('aria-current');
      if (id) id.removeAttribute('aria-current');
      if (indo) {
        if (id) id.setAttribute('aria-current', 'true');
      } else if (spanish) {
        if (es) es.setAttribute('aria-current', 'true');
      } else if (isEnglishSurface()) {
        if (en) en.setAttribute('aria-current', 'true');
      } else {
        if (en) en.setAttribute('aria-current', 'true');
      }
    }
  }

  function wirePreference() {
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-tdb-pick]') : null;
      if (!t || !t.closest('[data-tdb-lang-switcher]')) return;
      var pick = t.getAttribute('data-tdb-pick');
      if (pick !== 'en' && pick !== 'es' && pick !== 'id') return;
      try {
        localStorage.setItem(STORAGE_KEY, pick);
      } catch (err) {}
    }, false);
  }

  function init() {
    applyHrefs();
    applyAriaCurrent();
    wirePreference();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
