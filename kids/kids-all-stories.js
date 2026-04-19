/**
 * All 287 Bible stories — A–Z browse (data: window.TDB_BIBLE_STORY_TOOL_INDEX).
 */
(function () {
  'use strict';

  var searchInput = document.getElementById('kids-all-stories-search');
  var sortBtn = document.getElementById('kids-all-stories-sort');
  var tbody = document.getElementById('kids-all-stories-tbody');
  var countEl = document.getElementById('kids-all-stories-count');
  var randomBtn = document.getElementById('kids-all-stories-random');
  var themeTabContainer = document.getElementById('kids-all-stories-theme-tabs');
  var indexSort = 1; // 1 = A–Z, -1 = Z–A
  var activeTheme = '';

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

  function rowHaystack(r) {
    return [r.title, r.kjvRef, r.theme, r.apply, r.kw, r.key].join(' ');
  }

  /** Map kid-style phrases to tokens that match index rows (Fuse + uFuzzy). */
  var ALL_STORIES_PHRASES = {
    'giant boy sling': 'david goliath sling',
    'giant boy': 'david goliath',
    'giant sling': 'david goliath sling',
    'seven seals lamb': 'revelation seals lamb',
    'seven seals': 'revelation seals',
    'white horse seal': 'revelation seals',
    'scroll seals': 'revelation seals'
  };

  function normalizeAllStoriesQuery(q) {
    var t = String(q || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!t) return q;
    if (ALL_STORIES_PHRASES[t]) return ALL_STORIES_PHRASES[t];
    return q;
  }

  function filterRows(rows, q) {
    var needle = normalizeAllStoriesQuery((q || '').trim());
    if (!needle) return rows;
    var Fn = typeof uFuzzy !== 'undefined' ? uFuzzy : typeof window !== 'undefined' ? window.uFuzzy : null;
    if (Fn) {
      try {
        var uf = new Fn({ intraMode: 1 });
        var hay = rows.map(rowHaystack);
        var pack = uf.search(hay, needle, 1, 1000);
        var idxs = pack && pack[0];
        if (idxs && idxs.length > 0) {
          var info = pack[1];
          var order = pack[2];
          var out = [];
          if (order && order.length && info && info.idx) {
            for (var oi = 0; oi < order.length; oi++) {
              out.push(rows[info.idx[order[oi]]]);
            }
          } else {
            for (var j = 0; j < idxs.length; j++) {
              out.push(rows[idxs[j]]);
            }
          }
          return out;
        }
      } catch (eFz) {}
    }
    var Fu = typeof Fuse !== 'undefined' ? Fuse : typeof window !== 'undefined' ? window.Fuse : null;
    if (Fu && needle.length >= 2) {
      try {
        var fRows = [];
        for (var fi = 0; fi < rows.length; fi++) {
          var rr = rows[fi];
          fRows.push({
            key: rr.key,
            title: rr.title,
            kjvRef: rr.kjvRef,
            theme: rr.theme,
            apply: rr.apply,
            kw: rr.kw,
            hay: rowHaystack(rr)
          });
        }
        var fuse = new Fu(fRows, {
          keys: ['title', 'kjvRef', 'theme', 'apply', 'kw', 'key', 'hay'],
          threshold: 0.42,
          ignoreLocation: true,
          minMatchCharLength: 2,
          includeScore: true
        });
        var fhits = fuse.search(needle);
        if (fhits && fhits.length) {
          var seen = {};
          var outF = [];
          for (var hi = 0; hi < fhits.length; hi++) {
            var it = fhits[hi].item;
            if (!it || !it.key || seen[it.key]) continue;
            seen[it.key] = true;
            var found = null;
            for (var ri = 0; ri < rows.length; ri++) {
              if (rows[ri].key === it.key) {
                found = rows[ri];
                break;
              }
            }
            outF.push(found || { key: it.key, title: it.title, kjvRef: it.kjvRef, theme: it.theme, apply: it.apply, kw: it.kw });
          }
          if (outF.length) return outF;
        }
      } catch (eFuse) {}
    }
    var nl = needle.toLowerCase();
    return rows.filter(function (r) {
      return (
        r.title.toLowerCase().indexOf(nl) !== -1 ||
        r.kjvRef.toLowerCase().indexOf(nl) !== -1 ||
        r.theme.toLowerCase().indexOf(nl) !== -1 ||
        r.apply.toLowerCase().indexOf(nl) !== -1 ||
        r.kw.toLowerCase().indexOf(nl) !== -1 ||
        r.key.toLowerCase().indexOf(nl) !== -1
      );
    });
  }

  function setActiveThemeTab(theme) {
    activeTheme = theme || '';
    if (!themeTabContainer) return;
    var btns = themeTabContainer.querySelectorAll('[role="tab"]');
    for (var bi = 0; bi < btns.length; bi++) {
      var b = btns[bi];
      var t = b.getAttribute('data-theme');
      if (t === null) t = '';
      var sel = t === activeTheme;
      b.setAttribute('aria-selected', sel ? 'true' : 'false');
      b.classList.toggle('is-active', sel);
    }
  }

  function render() {
    if (!tbody) return;
    var all = getRows();
    var themed =
      activeTheme && activeTheme.length
        ? all.filter(function (r) {
            return (r.theme || '') === activeTheme;
          })
        : all;
    var q = searchInput ? searchInput.value : '';
    var filtered = filterRows(sortRows(themed), q);
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
      var qTrim = (q || '').trim();
      if (!activeTheme && !qTrim) {
        countEl.textContent = 'Showing all ' + all.length + ' stories.';
      } else if (activeTheme && !qTrim) {
        countEl.textContent =
          'Showing ' +
          filtered.length +
          ' stories tagged “' +
          activeTheme +
          '” (' +
          all.length +
          ' in the library).';
      } else if (activeTheme && qTrim) {
        countEl.textContent =
          'Showing ' +
          filtered.length +
          ' matches in “' +
          activeTheme +
          '” (' +
          themed.length +
          ' in this theme, ' +
          all.length +
          ' total).';
      } else {
        countEl.textContent =
          'Showing ' + filtered.length + ' matches (' + all.length + ' stories in the library).';
      }
    }
    var heroBadge = document.getElementById('kids-all-stories-hero-badge');
    if (heroBadge) {
      var label = all.length + ' Stories – Browse All';
      heroBadge.textContent = label;
      heroBadge.setAttribute('aria-label', label);
    }
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
        var allR = getRows();
        var themedR =
          activeTheme && activeTheme.length
            ? allR.filter(function (r) {
                return (r.theme || '') === activeTheme;
              })
            : allR;
        var qR = searchInput ? searchInput.value : '';
        var pool = filterRows(sortRows(themedR), qR);
        if (!pool.length) return;
        var pick = pool[Math.floor(Math.random() * pool.length)];
        window.location.href = 'corner.html?story=' + encodeURIComponent(pick.key);
      });
    }
    if (themeTabContainer) {
      themeTabContainer.addEventListener('click', function (e) {
        var btn = e.target && e.target.closest ? e.target.closest('[role="tab"]') : null;
        if (!btn || !themeTabContainer.contains(btn)) return;
        var raw = btn.getAttribute('data-theme');
        setActiveThemeTab(raw === null || raw === '' ? '' : raw);
        render();
      });
      themeTabContainer.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var tabs = themeTabContainer.querySelectorAll('[role="tab"]');
        if (!tabs.length) return;
        var ix = -1;
        for (var ti = 0; ti < tabs.length; ti++) {
          if (tabs[ti].classList.contains('is-active')) {
            ix = ti;
            break;
          }
        }
        if (ix < 0) return;
        e.preventDefault();
        var next = e.key === 'ArrowRight' ? ix + 1 : ix - 1;
        if (next < 0) next = tabs.length - 1;
        if (next >= tabs.length) next = 0;
        var tbtn = tabs[next];
        var rawT = tbtn.getAttribute('data-theme');
        setActiveThemeTab(rawT === null || rawT === '' ? '' : rawT);
        render();
        try {
          tbtn.focus();
        } catch (eF) {}
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
