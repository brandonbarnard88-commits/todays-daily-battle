/**
 * Fuse.js top-5 story suggest — Bible Story Library (corner) + All Stories A–Z.
 * Depends: window.Fuse and either TDB_BIBLE_STORIES or TDB_BIBLE_STORY_TOOL_INDEX (all-stories page).
 */
(function () {
  'use strict';

  function plain(s) {
    if (typeof window.tdbPlainTextForUi === 'function') return window.tdbPlainTextForUi(String(s || ''));
    return String(s || '').replace(/<[^>]+>/g, '').trim();
  }

  function getFuseConstructor() {
    return typeof Fuse !== 'undefined' ? Fuse : window.Fuse;
  }

  function buildRows() {
    var stories = window.TDB_BIBLE_STORIES || {};
    var keys = window.TDB_BIBLE_STORY_KEYS || Object.keys(stories);
    var rows = [];
    if (keys.length && Object.keys(stories).length) {
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var s = stories[k];
        if (!s) continue;
        var apply = (s.kidContext && s.kidContext.apply) ? String(s.kidContext.apply) : '';
        var cap = s.caption ? String(s.caption) : '';
        var preview = plain(apply || cap || s.title || k);
        preview = preview.replace(/\s+/g, ' ').trim();
        if (preview.length > 118) preview = preview.slice(0, 115) + '…';
        rows.push({
          key: k,
          title: plain(s.title || k),
          kjvRef: plain(s.kjvRef || ''),
          preview: preview,
          hay: [k, s.title || '', s.kjvRef || '', apply, cap, (s.keywords || []).join(' ')].join(' ')
        });
      }
      return rows;
    }
    var idx = window.TDB_BIBLE_STORY_TOOL_INDEX;
    if (!Array.isArray(idx)) return [];
    for (var j = 0; j < idx.length; j++) {
      var row = idx[j];
      if (!row || !row.key) continue;
      var ap = row.apply ? String(row.apply) : '';
      var preview2 = plain(ap || row.title || row.key);
      preview2 = preview2.replace(/\s+/g, ' ').trim();
      if (preview2.length > 118) preview2 = preview2.slice(0, 115) + '…';
      rows.push({
        key: row.key,
        title: plain(row.title || row.key),
        kjvRef: plain(row.kjvRef || ''),
        preview: preview2,
        hay: [row.key, row.title || '', row.kjvRef || '', ap, row.theme || '', row.kw || ''].join(' ')
      });
    }
    return rows;
  }

  var _fuse = null;
  var _fuseSig = '';

  function getFuse() {
    var C = getFuseConstructor();
    if (!C) return null;
    var rows = buildRows();
    if (!rows.length) return null;
    var sig = String(rows.length);
    if (!_fuse || _fuseSig !== sig) {
      _fuse = new C(rows, {
        keys: ['title', 'kjvRef', 'key', 'hay'],
        threshold: 0.36,
        ignoreLocation: true,
        minMatchCharLength: 2,
        includeScore: true
      });
      _fuseSig = sig;
    }
    return _fuse;
  }

  function clearSuggest(host) {
    if (!host) return;
    host.textContent = '';
    host.hidden = true;
    host.classList.add('hidden');
    host.removeAttribute('aria-activedescendant');
  }

  function renderSuggest(host, hits, onPick) {
    if (!host) return;
    host.textContent = '';
    if (!hits || !hits.length) {
      host.hidden = true;
      host.classList.add('hidden');
      return;
    }
    host.hidden = false;
    host.classList.remove('hidden');
    host.setAttribute('role', 'listbox');
    for (var i = 0; i < hits.length; i++) {
      var h = hits[i];
      var sid = 'tdb-fuse-hit-' + i;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.id = sid;
      btn.className = 'kids-fuse-suggest-item';
      btn.setAttribute('role', 'option');
      var t = document.createElement('span');
      t.className = 'kids-fuse-suggest-title';
      t.textContent = h.title;
      var p = document.createElement('span');
      p.className = 'kids-fuse-suggest-preview';
      p.textContent = h.preview || h.kjvRef || '';
      var r = document.createElement('span');
      r.className = 'kids-fuse-suggest-ref';
      r.textContent = h.kjvRef || '';
      btn.appendChild(t);
      btn.appendChild(p);
      if (h.kjvRef) btn.appendChild(r);
      (function (row) {
        btn.addEventListener('click', function () {
          onPick(row);
        });
      })(h);
      host.appendChild(btn);
    }
  }

  function searchTop5(q) {
    var fuse = getFuse();
    if (!fuse) return [];
    var needle = String(q || '').trim();
    if (needle.length < 2) return [];
    var raw = fuse.search(needle);
    var out = [];
    for (var i = 0; i < raw.length && out.length < 5; i++) {
      if (raw[i] && raw[i].item) out.push(raw[i].item);
    }
    return out;
  }

  function wireSuggest(input, host, onPick) {
    if (!input || !host) return;
    var t = null;
    function run() {
      var q = input.value;
      var hits = searchTop5(q);
      renderSuggest(host, hits, onPick);
    }
    input.addEventListener('input', function () {
      if (t) clearTimeout(t);
      t = setTimeout(run, 40);
    });
    input.addEventListener('focus', function () {
      if (String(input.value || '').trim().length >= 2) run();
    });
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        clearSuggest(host);
      }
    });
    document.addEventListener('click', function (ev) {
      if (!host.contains(ev.target) && ev.target !== input) clearSuggest(host);
    });
  }

  function wireCorner() {
    var input = document.getElementById('kids-library-search-input');
    var host = document.getElementById('kids-library-search-suggest') || document.getElementById('kids-fuse-suggest');
    if (!input || !host) return;
    wireSuggest(input, host, function (row) {
      clearSuggest(host);
      if (typeof window.openKidsStoryByKey === 'function') {
        window.openKidsStoryByKey(row.key);
      } else {
        window.location.href = 'corner.html?story=' + encodeURIComponent(row.key);
      }
      input.value = '';
    });
  }

  function wireAllStories() {
    var input = document.getElementById('kids-all-stories-search');
    var host = document.getElementById('kids-all-fuse-suggest');
    if (!input || !host) return;
    wireSuggest(input, host, function (row) {
      clearSuggest(host);
      window.location.href = 'corner.html?story=' + encodeURIComponent(row.key);
    });
  }

  function tryInit() {
    if (!getFuseConstructor()) return;
    var hasStories = window.TDB_BIBLE_STORIES && Object.keys(window.TDB_BIBLE_STORIES).length;
    var hasIndex = Array.isArray(window.TDB_BIBLE_STORY_TOOL_INDEX) && window.TDB_BIBLE_STORY_TOOL_INDEX.length;
    if (!hasStories && !hasIndex) return;
    /* Corner: kids-corner.js calls tdbKidsFuseSearchTop5() for the listbox (single source of truth). */
    wireAllStories();
  }

  function schedule() {
    var n = 0;
    function tick() {
      n++;
      tryInit();
      if (
        n < 80 &&
        (!getFuseConstructor() ||
          (!(window.TDB_BIBLE_STORIES && Object.keys(window.TDB_BIBLE_STORIES).length) &&
            !(Array.isArray(window.TDB_BIBLE_STORY_TOOL_INDEX) && window.TDB_BIBLE_STORY_TOOL_INDEX.length)))
      ) {
        setTimeout(tick, 120);
      }
    }
    tick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  window.tdbKidsFuseSearchTop5 = searchTop5;
  window.tdbWireKidsFuseStorySearch = tryInit;
})();
