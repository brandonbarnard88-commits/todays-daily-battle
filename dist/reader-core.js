/* Reader core bootstrap: fast fallback chapter rendering + deferred enhancement loader. */
(function () {
  var BOOKS = [
    ['Genesis', 50], ['Exodus', 40], ['Leviticus', 27], ['Numbers', 36], ['Deuteronomy', 34], ['Joshua', 24], ['Judges', 21], ['Ruth', 4],
    ['1 Samuel', 31], ['2 Samuel', 24], ['1 Kings', 22], ['2 Kings', 25], ['1 Chronicles', 29], ['2 Chronicles', 36], ['Ezra', 10], ['Nehemiah', 13],
    ['Esther', 10], ['Job', 42], ['Psalm', 150], ['Proverbs', 31], ['Ecclesiastes', 12], ['Song of Solomon', 8], ['Isaiah', 66], ['Jeremiah', 52],
    ['Lamentations', 5], ['Ezekiel', 48], ['Daniel', 12], ['Hosea', 14], ['Joel', 3], ['Amos', 9], ['Obadiah', 1], ['Jonah', 4],
    ['Micah', 7], ['Nahum', 3], ['Habakkuk', 3], ['Zephaniah', 3], ['Haggai', 2], ['Zechariah', 14], ['Malachi', 4], ['Matthew', 28],
    ['Mark', 16], ['Luke', 24], ['John', 21], ['Acts', 28], ['Romans', 16], ['1 Corinthians', 16], ['2 Corinthians', 13], ['Galatians', 6],
    ['Ephesians', 6], ['Philippians', 4], ['Colossians', 4], ['1 Thessalonians', 5], ['2 Thessalonians', 3], ['1 Timothy', 6], ['2 Timothy', 4], ['Titus', 3],
    ['Philemon', 1], ['Hebrews', 13], ['James', 5], ['1 Peter', 5], ['2 Peter', 3], ['1 John', 5], ['2 John', 1], ['3 John', 1], ['Jude', 1], ['Revelation', 22]
  ];
  var BOOK_CHAPTERS = {};
  for (var i = 0; i < BOOKS.length; i++) BOOK_CHAPTERS[BOOKS[i][0]] = BOOKS[i][1];

  function readerFallbackSkeletonHtml() {
    var w = [92, 78, 88, 65, 90, 72, 85, 68, 91, 74, 82, 70, 89];
    var lines = '';
    for (var j = 0; j < w.length; j++) {
      lines += '<div class="reader-skeleton-line" style="width:' + w[j] + '%"></div>';
    }
    return '<p class="sr-only">Loading chapter…</p><div class="reader-chapter-skeleton" aria-hidden="true"><div class="reader-skeleton-title"></div>' + lines + '</div>';
  }

  function clearFallbackReaderLoading(output) {
    if (!output) return;
    output.classList.remove('reader-output-loading');
    output.removeAttribute('aria-busy');
  }

  function getFallbackOutput() {
    return document.getElementById('reader-output');
  }

  function getReaderCacheFallback(chapterKey) {
    try {
      var raw = localStorage.getItem('tdb_reader_cache');
      if (!raw) return null;
      var obj = JSON.parse(raw);
      return obj && obj.chapters && obj.chapters[chapterKey] ? obj.chapters[chapterKey] : null;
    } catch (e) {
      return null;
    }
  }

  function renderFallbackChapter(book, chapter) {
    var output = getFallbackOutput();
    if (!output) return;
    var safeBook = String(book || '').trim();
    var safeChapter = String(chapter || '').trim();
    if (!safeBook || !safeChapter) return;
    output.classList.remove('reader-output-empty');
    output.classList.add('reader-output-loading');
    output.setAttribute('aria-busy', 'true');
    output.innerHTML = readerFallbackSkeletonHtml();
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 10000);
    var path = encodeURIComponent(safeBook).replace(/%20/g, '+') + '+' + encodeURIComponent(safeChapter);
    var url = 'https://bible-api.com/' + path + '?translation=kjv';
    fetch(url, { signal: controller.signal })
      .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('network')); })
      .then(function (data) {
        clearTimeout(timeoutId);
        var verses = Array.isArray(data && data.verses) ? data.verses : [];
        if (!verses.length) {
          clearFallbackReaderLoading(output);
          output.innerHTML = '<p class="empty">Chapter not found. Try another book or chapter.</p>';
          return;
        }
        clearFallbackReaderLoading(output);
        function esc(s) { if (s == null || s === '') return ''; return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
        var html = '<div class="chapter-title">' + esc(safeBook) + ' ' + esc(safeChapter) + '</div>';
        for (var vi = 0; vi < verses.length; vi++) {
          var v = verses[vi] || {};
          var ref = (v.book_name || safeBook) + ' ' + (v.chapter || safeChapter) + ':' + (v.verse || '');
          var text = String(v.text || '').trim();
          html += '<div class="context-line"><strong>' + esc(ref) + '</strong> ' + esc(text) + '</div>';
        }
        output.innerHTML = html;
      })
      .catch(function (err) {
        clearTimeout(timeoutId);
        clearFallbackReaderLoading(output);
        var cacheKey = safeBook + ' ' + safeChapter;
        var fromCache = getReaderCacheFallback(cacheKey);
        if (fromCache && fromCache.verses && fromCache.verses.length) {
          if (typeof window.TDB_showOfflineStrip === 'function') {
            try { window.TDB_showOfflineStrip('reader', { force: true }); } catch (e) {}
          }
          function esc(s) {
            if (s == null || s === '') return '';
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
          }
          var html = '<div class="chapter-title">' + esc(safeBook) + ' ' + esc(safeChapter) + '</div>';
          for (var ci = 0; ci < fromCache.verses.length; ci++) {
            var vv = fromCache.verses[ci] || {};
            var ref = (vv.book_name || safeBook) + ' ' + (vv.chapter || safeChapter) + ':' + (vv.verse || '');
            var t = String(vv.text || '').trim();
            html += '<div class="context-line"><strong>' + esc(ref) + '</strong> ' + esc(t) + '</div>';
          }
          output.innerHTML = html;
          return;
        }
        if (typeof window.TDB_showOfflineStrip === 'function') {
          try { window.TDB_showOfflineStrip('reader', { force: true }); } catch (e2) {}
        }
        output.innerHTML = '';
        var errP = document.createElement('p');
        errP.className = 'empty';
        errP.textContent = (err && err.name === 'AbortError')
          ? 'Request timed out. If you opened this chapter before, it may still be cached—try again when you are online.'
          : 'This chapter is not available offline yet. Open it once when you are online to cache it, or try again when you are back online.';
        output.appendChild(errP);
        var retryBtn = document.createElement('button');
        retryBtn.type = 'button';
        retryBtn.className = 'btn btn-secondary';
        retryBtn.textContent = 'Try again when online';
        retryBtn.setAttribute('aria-label', 'Retry loading this chapter');
        retryBtn.addEventListener('click', function () {
          renderFallbackChapter(safeBook, safeChapter);
        });
        output.appendChild(retryBtn);
      });
  }

  function populateFallbackBookPicker() {
    var bookSelect = document.getElementById('reader-book');
    var chapterSelect = document.getElementById('reader-chapter');
    if (!bookSelect || !chapterSelect) return;
    if (bookSelect.options && bookSelect.options.length > 0) return;
    for (var b = 0; b < BOOKS.length; b++) {
      var opt = document.createElement('option');
      opt.value = BOOKS[b][0];
      opt.textContent = BOOKS[b][0];
      bookSelect.appendChild(opt);
    }
    var firstBook = bookSelect.value || BOOKS[0][0];
    var count = BOOK_CHAPTERS[firstBook] || 1;
    chapterSelect.innerHTML = '';
    for (var c = 1; c <= count; c++) {
      var cOpt = document.createElement('option');
      cOpt.value = String(c);
      cOpt.textContent = String(c);
      chapterSelect.appendChild(cOpt);
    }
  }

  function wireFallbackChapterPicker() {
    var bookSelect = document.getElementById('reader-book');
    var chapterSelect = document.getElementById('reader-chapter');
    if (!bookSelect || !chapterSelect || bookSelect.dataset.fallbackWired === '1') return;
    bookSelect.dataset.fallbackWired = '1';
    bookSelect.addEventListener('change', function () {
      var count = BOOK_CHAPTERS[bookSelect.value] || 1;
      chapterSelect.innerHTML = '';
      for (var i = 1; i <= count; i++) {
        var option = document.createElement('option');
        option.value = String(i);
        option.textContent = String(i);
        chapterSelect.appendChild(option);
      }
      renderFallbackChapter(bookSelect.value, '1');
    });
  }

  function getChapterList(bookName) {
    var count = BOOK_CHAPTERS[bookName] || 1;
    var list = [];
    for (var i = 1; i <= count; i++) list.push(i);
    return list;
  }

  function wireFallbackReaderActions() {
    var bookSelect = document.getElementById('reader-book');
    var chapterSelect = document.getElementById('reader-chapter');
    var openBtn = document.getElementById('reader-open');
    var prevBtn = document.getElementById('reader-prev');
    var nextBtn = document.getElementById('reader-next');
    if (!bookSelect || !chapterSelect) return;
    if (openBtn && openBtn.dataset.fallbackWired !== '1') {
      openBtn.dataset.fallbackWired = '1';
      openBtn.addEventListener('click', function () {
        renderFallbackChapter(bookSelect.value, chapterSelect.value);
      });
    }
    if (prevBtn && prevBtn.dataset.fallbackWired !== '1') {
      prevBtn.dataset.fallbackWired = '1';
      prevBtn.addEventListener('click', function () {
        var chapters = getChapterList(bookSelect.value);
        var current = Number(chapterSelect.value || '1');
        var idx = chapters.indexOf(current);
        if (idx > 0) {
          chapterSelect.value = String(chapters[idx - 1]);
          renderFallbackChapter(bookSelect.value, chapterSelect.value);
        }
      });
    }
    if (nextBtn && nextBtn.dataset.fallbackWired !== '1') {
      nextBtn.dataset.fallbackWired = '1';
      nextBtn.addEventListener('click', function () {
        var chapters = getChapterList(bookSelect.value);
        var current = Number(chapterSelect.value || '1');
        var idx = chapters.indexOf(current);
        if (idx >= 0 && idx < chapters.length - 1) {
          chapterSelect.value = String(chapters[idx + 1]);
          renderFallbackChapter(bookSelect.value, chapterSelect.value);
        }
      });
    }
  }

  function maybeRenderFromQuery() {
    var params = new URLSearchParams(window.location.search || '');
    var book = params.get('book') || '';
    var chapter = params.get('chapter') || '';
    if (!book || !chapter) return;
    var bookSelect = document.getElementById('reader-book');
    var chapterSelect = document.getElementById('reader-chapter');
    if (!bookSelect || !chapterSelect) return;
    if (BOOK_CHAPTERS[book]) {
      bookSelect.value = book;
      var count = BOOK_CHAPTERS[book] || 1;
      chapterSelect.innerHTML = '';
      for (var i = 1; i <= count; i++) {
        var opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = String(i);
        chapterSelect.appendChild(opt);
      }
      chapterSelect.value = String(chapter);
    }
    renderFallbackChapter(bookSelect.value, chapterSelect.value);
  }

  function enhanceNativeReaderSelect(select) {
    if (!select || select.dataset.tdbMenu === '1') return;
    var host = select.parentElement;
    if (!host) return;
    select.dataset.tdbMenu = '1';
    host.classList.add('reader-menu-host');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reader-menu-btn';
    btn.id = select.id + '-btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', select.getAttribute('aria-label') || 'Choose');

    var menu = document.createElement('ul');
    menu.className = 'reader-menu';
    menu.id = select.id + '-menu';
    menu.hidden = true;
    menu.setAttribute('role', 'listbox');
    btn.setAttribute('aria-controls', menu.id);

    var lab = host.querySelector('label[for="' + select.id + '"]');
    if (lab) lab.setAttribute('for', btn.id);

    function syncLabel() {
      var opt = select.options[select.selectedIndex];
      btn.textContent = opt ? opt.textContent : 'Choose';
    }

    function rebuild() {
      menu.textContent = '';
      var i;
      for (i = 0; i < select.options.length; i++) {
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.dataset.value = select.options[i].value;
        li.textContent = select.options[i].textContent;
        if (select.options[i].value === select.value) li.setAttribute('aria-selected', 'true');
        menu.appendChild(li);
      }
      syncLabel();
    }

    function closeMenu() {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
      var openMenus = document.querySelectorAll('.reader-menu:not([hidden])');
      var m;
      for (m = 0; m < openMenus.length; m++) {
        if (openMenus[m] !== menu) {
          openMenus[m].hidden = true;
          var otherBtn = openMenus[m].previousElementSibling;
          if (otherBtn && otherBtn.classList.contains('reader-menu-btn')) {
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        }
      }
      rebuild();
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      var selected = menu.querySelector('[aria-selected="true"]');
      if (selected && selected.scrollIntoView) selected.scrollIntoView({ block: 'nearest' });
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (menu.hidden) openMenu();
      else closeMenu();
    });

    menu.addEventListener('click', function (e) {
      var li = e.target.closest ? e.target.closest('[role="option"]') : null;
      if (!li) return;
      e.preventDefault();
      e.stopPropagation();
      select.value = li.dataset.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      syncLabel();
      closeMenu();
    });

    select.addEventListener('change', syncLabel);

    document.addEventListener('click', function (e) {
      if (!host.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    select.classList.add('reader-native-select');
    host.appendChild(btn);
    host.appendChild(menu);
    if (typeof MutationObserver === 'function') {
      new MutationObserver(rebuild).observe(select, { childList: true });
    }
    rebuild();
  }

  function enhanceReaderSelectMenus() {
    enhanceNativeReaderSelect(document.getElementById('reader-book'));
    enhanceNativeReaderSelect(document.getElementById('reader-chapter'));
  }

  function runFallbackCore() {
    populateFallbackBookPicker();
    wireFallbackChapterPicker();
    wireFallbackReaderActions();
    maybeRenderFromQuery();
    enhanceReaderSelectMenus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runFallbackCore);
  } else {
    runFallbackCore();
  }
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(runFallbackCore, { timeout: 1500 });
  } else {
    window.addEventListener('load', function () { setTimeout(runFallbackCore, 600); }, { once: true });
  }
})();

(function () {
  var hasLoadedReaderAppModule = false;
  function loadReaderAppModule() {
    if (hasLoadedReaderAppModule || document.querySelector('script[data-tdb-reader-app]')) return;
    hasLoadedReaderAppModule = true;
    var s = document.createElement('script');
    s.type = 'module';
    s.src = 'script.js?v=20260503-consent-persist-fix';
    s.setAttribute('data-cfasync', 'false');
    s.setAttribute('data-tdb-reader-app', '1');
    document.head.appendChild(s);
  }
  function loadReaderAppModuleOnce() {
    loadReaderAppModule();
    window.removeEventListener('scroll', loadReaderAppModuleOnScroll, true);
    var ids = ['reader-open', 'reader-prev', 'reader-next', 'reader-listen', 'reader-audio', 'reader-book', 'reader-chapter', 'reader-output'];
    for (var i = 0; i < ids.length; i++) {
      var node = document.getElementById(ids[i]);
      if (!node) continue;
      node.removeEventListener('pointerdown', loadReaderAppModuleOnce, true);
      node.removeEventListener('keydown', loadReaderAppModuleOnce, true);
      node.removeEventListener('touchstart', loadReaderAppModuleOnce, true);
      node.removeEventListener('change', loadReaderAppModuleOnce, true);
      node.removeEventListener('click', loadReaderAppModuleOnce, true);
    }
  }
  function loadReaderAppModuleOnScroll() {
    if ((window.scrollY || 0) < 24) return;
    loadReaderAppModuleOnce();
  }
  var intentTargets = ['reader-open', 'reader-prev', 'reader-next', 'reader-listen', 'reader-audio', 'reader-book', 'reader-chapter', 'reader-output'];
  for (var ti = 0; ti < intentTargets.length; ti++) {
    var el = document.getElementById(intentTargets[ti]);
    if (!el) continue;
    el.addEventListener('pointerdown', loadReaderAppModuleOnce, true);
    el.addEventListener('keydown', loadReaderAppModuleOnce, true);
    el.addEventListener('touchstart', loadReaderAppModuleOnce, true);
    el.addEventListener('change', loadReaderAppModuleOnce, true);
    el.addEventListener('click', loadReaderAppModuleOnce, true);
  }
  window.addEventListener('scroll', loadReaderAppModuleOnScroll, true);
  window.addEventListener('load', function () {
    setTimeout(loadReaderAppModule, 14000);
  }, { once: true });
})();
