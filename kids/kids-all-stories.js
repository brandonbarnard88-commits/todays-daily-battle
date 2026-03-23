/**
 * All 281 Bible stories — A–Z browse (data: window.TDB_BIBLE_STORY_TOOL_INDEX).
 */
(function () {
  'use strict';

  var searchInput = document.getElementById('kids-all-stories-search');
  var sortBtn = document.getElementById('kids-all-stories-sort');
  var tbody = document.getElementById('kids-all-stories-tbody');
  var countEl = document.getElementById('kids-all-stories-count');
  var randomBtn = document.getElementById('kids-all-stories-random');
  var indexSort = 1; // 1 = A–Z, -1 = Z–A

  function plain(s) {
    if (typeof window.tdbPlainTextForUi === 'function') return window.tdbPlainTextForUi(String(s || ''));
    return String(s || '').replace(/<[^>]+>/g, '').trim();
  }

  function getRows() {
    var idx = window.TDB_BIBLE_STORY_TOOL_INDEX;
    if (!Array.isArray(idx)) return [];
    return idx.map(function (row) {
      return {
        key: row.key || '',
        title: plain(row.title || row.key),
        kjvRef: plain(row.kjvRef || ''),
        theme: plain(row.theme || ''),
        apply: plain(row.apply || ''),
        kw: plain(row.kw || '')
      };
    });
  }

  function sortRows(rows) {
    var out = rows.slice();
    out.sort(function (a, b) {
      var cmp = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      return indexSort * cmp;
    });
    return out;
  }

  function filterRows(rows, q) {
    var needle = (q || '').trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(function (r) {
      return (
        r.title.toLowerCase().indexOf(needle) !== -1 ||
        r.kjvRef.toLowerCase().indexOf(needle) !== -1 ||
        r.theme.toLowerCase().indexOf(needle) !== -1 ||
        r.apply.toLowerCase().indexOf(needle) !== -1 ||
        r.kw.toLowerCase().indexOf(needle) !== -1 ||
        r.key.toLowerCase().indexOf(needle) !== -1
      );
    });
  }

  function render() {
    if (!tbody) return;
    var all = getRows();
    var q = searchInput ? searchInput.value : '';
    var filtered = filterRows(sortRows(all), q);
    tbody.textContent = '';
    for (var i = 0; i < filtered.length; i++) {
      var r = filtered[i];
      var tr = document.createElement('tr');
      var tdTitle = document.createElement('td');
      var a = document.createElement('a');
      a.href = 'corner.html?story=' + encodeURIComponent(r.key);
      a.textContent = r.title;
      a.setAttribute('aria-label', 'Open story: ' + r.title);
      tdTitle.appendChild(a);
      var tdRef = document.createElement('td');
      tdRef.textContent = r.kjvRef;
      var tdTheme = document.createElement('td');
      tdTheme.textContent = r.theme || '—';
      var tdTeaser = document.createElement('td');
      tdTeaser.className = 'kids-all-stories-teaser';
      tdTeaser.textContent = r.apply || '—';
      tr.appendChild(tdTitle);
      tr.appendChild(tdRef);
      tr.appendChild(tdTheme);
      tr.appendChild(tdTeaser);
      tbody.appendChild(tr);
    }
    if (countEl) {
      countEl.textContent =
        filtered.length === all.length
          ? 'Showing all ' + all.length + ' stories.'
          : 'Showing ' + filtered.length + ' of ' + all.length + ' stories.';
    }
    var badgeEl = document.getElementById('kids-all-stories-total-badge');
    if (badgeEl) badgeEl.textContent = 'Story count: ' + all.length;
  }

  function wire() {
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        render();
      });
      searchInput.addEventListener('search', function () {
        render();
      });
    }
    if (sortBtn) {
      sortBtn.textContent = 'Sort Z–A';
      sortBtn.addEventListener('click', function () {
        indexSort *= -1;
        sortBtn.textContent = indexSort === 1 ? 'Sort Z–A' : 'Sort A–Z';
        render();
      });
    }
    if (randomBtn) {
      randomBtn.addEventListener('click', function () {
        var all = getRows();
        if (!all.length) return;
        var pick = all[Math.floor(Math.random() * all.length)];
        window.location.href = 'corner.html?story=' + encodeURIComponent(pick.key);
      });
    }
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
