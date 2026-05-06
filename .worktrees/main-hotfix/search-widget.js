/**
 * Floating Search Bar widget — CSP-safe, event-driven.
 * Drop-in: add <div id="search-widget"></div> and <script src="search-widget.js"></script>.
 * Auto-focus, recent searches (localStorage), Clear, scroll to results or navigate to index?q=...
 */
(function () {
  'use strict';

  var WIDGET_ID = 'search-widget';
  var RECENT_KEY = 'tdb_search_widget_recent';
  var RECENT_MAX = 10;

  function getRecent() {
    try {
      var raw = localStorage.getItem(RECENT_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.slice(0, RECENT_MAX) : [];
    } catch (e) {
      return [];
    }
  }

  function saveRecent(q) {
    if (!q || !q.trim()) return;
    var recent = getRecent();
    var trimmed = q.trim();
    recent = recent.filter(function (r) { return r !== trimmed; });
    recent.unshift(trimmed);
    recent = recent.slice(0, RECENT_MAX);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch (e) {}
  }

  function clearRecent() {
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch (e) {}
  }

  function isIndexPage() {
    var path = (window.location.pathname || '/').replace(/\/$/, '') || '/';
    return path === '' || path === '/' || path === '/index.html';
  }

  function getBase() {
    var base = window.location.origin + (window.location.pathname || '/').replace(/\/[^/]*$/, '') || window.location.origin;
    if (!base.endsWith('/')) base += '/';
    return base;
  }

  function doSearch(q) {
    var trimmed = (q || '').trim();
    if (!trimmed) return;

    saveRecent(trimmed);
    closeRecentDropdown();

    if (isIndexPage()) {
      var queryEl = document.getElementById('query');
      var searchBtn = document.getElementById('search-btn');
      if (queryEl && searchBtn) {
        queryEl.value = trimmed;
        searchBtn.click();
        setTimeout(function () {
          if (typeof window.tdbScrollSearchResultsIntoView === 'function') {
            window.tdbScrollSearchResultsIntoView();
          } else {
            var target =
              document.getElementById('feel-results') ||
              document.getElementById('output') ||
              document.getElementById('main-search');
            if (!target) return;
            var behavior = 'smooth';
            try {
              if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) behavior = 'auto';
            } catch (e) {}
            try {
              target.scrollIntoView({ behavior: behavior, block: 'start', inline: 'nearest' });
            } catch (err) {
              try {
                target.scrollIntoView(true);
              } catch (e2) {}
            }
          }
        }, 120);
      } else {
        window.location.href = getBase() + 'index.html?q=' + encodeURIComponent(trimmed);
      }
    } else {
      window.location.href = getBase() + 'index.html?q=' + encodeURIComponent(trimmed);
    }
  }

  function buildMarkup() {
    var wrap = document.createElement('div');
    wrap.className = 'search-widget-bar';
    wrap.setAttribute('role', 'search');
    wrap.setAttribute('aria-label', 'Search Scripture');

    var row = document.createElement('div');
    row.className = 'search-widget-row';

    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'search-widget-input';
    input.className = 'search-widget-input';
    input.placeholder = 'Search verses, topics…';
    input.setAttribute('aria-label', 'Search query');
    input.autocomplete = 'off';

    var submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.id = 'search-widget-submit';
    submitBtn.className = 'search-widget-btn search-widget-submit';
    submitBtn.textContent = 'Search';

    var clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.id = 'search-widget-clear';
    clearBtn.className = 'search-widget-btn search-widget-clear';
    clearBtn.textContent = 'Clear';

    var recentWrap = document.createElement('div');
    recentWrap.className = 'search-widget-recent-wrap';
    recentWrap.id = 'search-widget-recent-wrap';
    recentWrap.style.display = 'none';

    var recentList = document.createElement('div');
    recentList.className = 'search-widget-recent-list';
    recentList.id = 'search-widget-recent-list';
    recentList.setAttribute('role', 'listbox');
    recentWrap.appendChild(recentList);

    var recentFooter = document.createElement('div');
    recentFooter.className = 'search-widget-recent-footer';
    var clearRecentBtn = document.createElement('button');
    clearRecentBtn.type = 'button';
    clearRecentBtn.className = 'search-widget-clear-recent';
    clearRecentBtn.textContent = 'Clear recent';
    clearRecentBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      clearRecent();
      closeRecentDropdown();
      openRecentDropdown();
    });
    recentFooter.appendChild(clearRecentBtn);
    recentWrap.appendChild(recentFooter);

    row.appendChild(input);
    row.appendChild(submitBtn);
    row.appendChild(clearBtn);
    wrap.appendChild(row);
    wrap.appendChild(recentWrap);

    return { wrap: wrap, input: input, submitBtn: submitBtn, clearBtn: clearBtn, recentWrap: recentWrap, recentList: recentList };
  }

  function openRecentDropdown() {
    var list = document.getElementById('search-widget-recent-list');
    var wrap = document.getElementById('search-widget-recent-wrap');
    if (!list || !wrap) return;
    var recent = getRecent();
    list.innerHTML = '';
    if (recent.length === 0) {
      wrap.style.display = 'none';
      return;
    }
    recent.forEach(function (q) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'search-widget-recent-item';
      item.textContent = q;
      item.setAttribute('role', 'option');
      item.addEventListener('click', function () {
        var inEl = document.getElementById('search-widget-input');
        if (inEl) inEl.value = q;
        doSearch(q);
      });
      list.appendChild(item);
    });
    wrap.style.display = 'block';
  }

  function closeRecentDropdown() {
    var wrap = document.getElementById('search-widget-recent-wrap');
    if (wrap) wrap.style.display = 'none';
  }

  function run() {
    var container = document.getElementById(WIDGET_ID);
    if (!container) return;

    var parts = buildMarkup();
    container.appendChild(parts.wrap);

    var input = parts.input;
    var submitBtn = parts.submitBtn;
    var clearBtn = parts.clearBtn;
    var searchDebounceTimer;

    function triggerSearch() {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(function () {
        doSearch(input.value);
      }, 300);
    }

    setTimeout(function () {
      try {
        input.focus();
      } catch (e) {}
    }, 100);

    submitBtn.addEventListener('click', function () {
      triggerSearch();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerSearch();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !e.target.matches('input,textarea,[contenteditable="true"]')) {
        var inp = document.getElementById('search-widget-input');
        if (inp) {
          inp.focus();
          e.preventDefault();
        }
      }
    });

    input.addEventListener('focus', function () {
      openRecentDropdown();
    });

    input.addEventListener('blur', function () {
      setTimeout(closeRecentDropdown, 180);
    });

    clearBtn.addEventListener('click', function () {
      input.value = '';
      input.focus();
      closeRecentDropdown();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
