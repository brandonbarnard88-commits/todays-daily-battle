(function () {
  'use strict';

  var UNIFIED_INDEX_URLS = ['/data/unified-search-index.json', '/unified-search-index.json'];
  var PAGE_MAP_URLS = ['/site-search-index.json', '/data/site-search-index.json'];
  var PAGE_MAP_FALLBACK = [
    { t: "Home — Today's Daily Battle", u: '/', k: 'verse feel search daily' },
    { t: 'Battle Plans library', u: '/plans.html', k: 'reading plan 7 day 30' },
    { t: 'Bible Tool', u: '/bible-tool.html', k: 'lookup chapter reader verse image' },
    { t: 'Study workshop', u: '/bible/tools.html', k: 'word help concordance study' },
    { t: 'Explore full site map', u: '/explore.html', k: 'topics tools languages' }
  ];

  var unifiedEntries = [];
  var pageMapEntries = [];
  var lastQuery = '';
  var fullResultsVisible = false;
  var inputEl;
  var unifiedStatusEl;
  var pageMapStatusEl;
  var porchEl;
  var fullResultsEl;
  var seeAllBtn;
  var emptyEl;
  var pageMapListEl;
  var versesSectionEl;
  var wordHelpsSectionEl;
  var plansSectionEl;
  var pagesSectionEl;

  function byId(id) {
    return document.getElementById(id);
  }

  function normalizeSpace(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function truncate(value, maxLen) {
    var text = normalizeSpace(value);
    if (!text || text.length <= maxLen) return text;
    return text.slice(0, Math.max(0, maxLen - 1)).trim() + '…';
  }

  function dedupeStrings(values) {
    var seen = {};
    return (values || []).reduce(function (acc, value) {
      var cleaned = normalizeSpace(value);
      var key = cleaned.toLowerCase();
      if (!cleaned || seen[key]) return acc;
      seen[key] = true;
      acc.push(cleaned);
      return acc;
    }, []);
  }

  function tokenize(value) {
    return normalizeSpace(value)
      .toLowerCase()
      .replace(/[^a-z0-9:\s'-]+/g, ' ')
      .split(/\s+/)
      .map(function (token) { return token.trim(); })
      .filter(Boolean);
  }

  function normalizeRef(value) {
    return normalizeSpace(value)
      .toLowerCase()
      .replace(/\./g, '')
      .replace(/\s+/g, ' ');
  }

  function isLikelyVerseRef(query) {
    return /^\s*(?:[1-3]\s*)?[a-z][a-z\s]+\s+\d+:\d+(?:-\d+)?\s*$/i.test(String(query || '').trim());
  }

  function inferTypeLabel(item) {
    if (!item || !item.type) return 'Page';
    if (item.type === 'verse') return 'Verse';
    if (item.type === 'word_help') return 'Word help';
    if (item.type === 'plan') return 'Plan';
    if (item.type === 'tool') return 'Tool';
    return 'Page';
  }

  function showToast(message) {
    if (typeof window.showEliteToast === 'function') {
      window.showEliteToast(message, { duration: 2200 });
      return;
    }
    if (unifiedStatusEl) unifiedStatusEl.textContent = message;
  }

  function setOfflineStrip(force) {
    try {
      if (force) {
        if (globalThis.TDB_showOfflineStrip) globalThis.TDB_showOfflineStrip('search', { force: true });
      } else {
        var strip = byId('tdb-offline-strip');
        if (strip) strip.removeAttribute('data-tdb-offline-forced');
        if (globalThis.TDB_hideOfflineStripIfOnline) globalThis.TDB_hideOfflineStripIfOnline();
      }
    } catch (_) {}
  }

  function setHidden(el, hidden) {
    if (!el) return;
    el.hidden = !!hidden;
  }

  function fetchJson(urls) {
    var index = 0;
    function next() {
      if (index >= urls.length) return Promise.reject(new Error('not-found'));
      var url = urls[index++];
      return fetch(url, { credentials: 'same-origin' }).then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      }).catch(function () {
        return next();
      });
    }
    return next();
  }

  function loadIndexes() {
    return Promise.all([
      fetchJson(UNIFIED_INDEX_URLS).then(function (payload) {
        unifiedEntries = Array.isArray(payload && payload.entries) ? payload.entries : [];
      }).catch(function () {
        unifiedEntries = [];
      }),
      fetchJson(PAGE_MAP_URLS).then(function (payload) {
        pageMapEntries = Array.isArray(payload && payload.entries) ? payload.entries : [];
        setOfflineStrip(false);
      }).catch(function () {
        pageMapEntries = PAGE_MAP_FALLBACK.slice();
        setOfflineStrip(true);
      })
    ]);
  }

  function pageMapMatches(query, entry) {
    var needle = normalizeSpace(query).toLowerCase();
    if (!needle) return true;
    var blob = [entry.t, entry.k, entry.u].join(' ').toLowerCase();
    if (blob.indexOf(needle) !== -1) return true;
    var tokens = tokenize(needle);
    if (!tokens.length) return true;
    return tokens.every(function (token) {
      return blob.indexOf(token) !== -1;
    });
  }

  function buildSyntheticVerseItem(query) {
    var ref = normalizeSpace(query);
    return {
      id: 'verse-open-' + normalizeRef(ref).replace(/[^a-z0-9]+/g, '-'),
      type: 'verse',
      key: ref.toLowerCase(),
      title: ref,
      summary: 'Open this exact verse in the Bible Tool.',
      fullSummary: '',
      keywords: tokenize(ref),
      refs: [ref],
      href: '/bible-tool.html?q=' + encodeURIComponent(ref),
      smallStep: 'Open the verse and stay with the next line only.',
      deepAvailable: false,
      priority: 100,
      sourceRoom: 'bible-tool',
      synthetic: true
    };
  }

  function scoreItem(item, query, tokens, verseLike) {
    var exactRef = normalizeRef(item.title) === normalizeRef(query) || (item.refs || []).some(function (ref) {
      return normalizeRef(ref) === normalizeRef(query);
    });
    var title = String(item.title || '').toLowerCase();
    var key = String(item.key || '').toLowerCase();
    var refsBlob = (item.refs || []).join(' ').toLowerCase();
    var keywordsBlob = (item.keywords || []).join(' ').toLowerCase();
    var summaryBlob = [item.summary, item.fullSummary].join(' ').toLowerCase();
    var haystack = [title, key, refsBlob, keywordsBlob, summaryBlob].join(' ');
    var score = Number(item.priority || 0);

    if (verseLike && item.type === 'verse') score += 40;
    if (!verseLike && tokens.length === 1 && item.type === 'word_help') score += 22;
    if (exactRef) score += 220;
    if (title === query.toLowerCase()) score += 180;
    if (key === query.toLowerCase()) score += 160;
    if (title.indexOf(query.toLowerCase()) !== -1) score += 75;
    if (refsBlob.indexOf(query.toLowerCase()) !== -1) score += 70;
    if (keywordsBlob.indexOf(query.toLowerCase()) !== -1) score += 55;
    if (summaryBlob.indexOf(query.toLowerCase()) !== -1) score += 28;

    tokens.forEach(function (token) {
      if (title.indexOf(token) !== -1) score += 18;
      if (refsBlob.indexOf(token) !== -1) score += 16;
      if (keywordsBlob.indexOf(token) !== -1) score += 12;
      if (summaryBlob.indexOf(token) !== -1) score += 6;
    });

    if (tokens.length > 1) {
      var allMatch = tokens.every(function (token) {
        return haystack.indexOf(token) !== -1;
      });
      if (allMatch) score += 20;
    }

    return score;
  }

  function searchUnified(query) {
    var clean = normalizeSpace(query);
    if (!clean) return [];
    var tokens = tokenize(clean);
    var verseLike = isLikelyVerseRef(clean);
    var scored = unifiedEntries.map(function (item) {
      return {
        item: item,
        score: scoreItem(item, clean, tokens, verseLike)
      };
    }).filter(function (wrapped) {
      return wrapped.score > 0;
    }).sort(function (a, b) {
      return b.score - a.score || String(a.item.title || '').localeCompare(String(b.item.title || ''));
    }).map(function (wrapped) {
      return wrapped.item;
    });

    if (verseLike) {
      var hasExact = scored.some(function (item) {
        return item.type === 'verse' &&
          (normalizeRef(item.title) === normalizeRef(clean) ||
            (item.refs || []).some(function (ref) { return normalizeRef(ref) === normalizeRef(clean); }));
      });
      if (!hasExact) scored.unshift(buildSyntheticVerseItem(clean));
    }

    return dedupeById(scored).slice(0, 40);
  }

  function dedupeById(items) {
    var seen = {};
    return (items || []).filter(function (item) {
      if (!item || !item.id || seen[item.id]) return false;
      seen[item.id] = true;
      return true;
    });
  }

  function getPorchResults(results) {
    var topVerse = results.find(function (item) { return item.type === 'verse'; }) || null;
    var topWord = results.find(function (item) { return item.type === 'word_help'; }) || null;
    var topPlan = results.find(function (item) { return item.type === 'plan'; }) || null;
    var topPage = results.find(function (item) {
      return item.type === 'tool' || item.type === 'page';
    }) || null;
    return dedupeById([topVerse, topWord, topPlan || topPage].filter(Boolean));
  }

  function makeEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  }

  function buildRefsLine(item) {
    var refs = dedupeStrings(item.refs || []).slice(0, 3);
    if (!refs.length) return null;
    return makeEl('p', 'tdb-unified-search-card__refs', refs.join(' · '));
  }

  function buildPrimaryAction(item) {
    var href = String(item.href || '').trim();
    if (!href) return null;
    var label = 'Open this page';
    if (item.type === 'verse') label = 'Open in Bible Tool';
    else if (item.type === 'word_help') label = item.deepAvailable ? 'Read fuller pastoral note' : 'Open word help';
    else if (item.type === 'plan') label = 'Open this plan';
    else if (item.type === 'tool') label = 'Open this tool';
    var link = makeEl('a', 'tdb-unified-search-action tdb-unified-search-action--primary', label);
    link.href = href;
    return link;
  }

  function buildSaveVerseAction(item) {
    if (item.type !== 'verse' || item.synthetic || !item.summary || /^Open this exact verse/i.test(item.summary)) return null;
    var button = makeEl('button', 'tdb-unified-search-action', 'Save to My Study');
    button.type = 'button';
    button.addEventListener('click', function () {
      if (typeof window.saveDailyVerseToMyVerses !== 'function') {
        showToast('Save is not ready yet on this page. That is all right.');
        return;
      }
      button.disabled = true;
      window.saveDailyVerseToMyVerses(item.title, item.summary).then(function (result) {
        showToast(result && result.already ? 'Already in My Study.' : 'Saved to My Study on this device.');
        button.textContent = 'Saved';
      }).catch(function () {
        showToast('That did not save quietly. Try again when you can.');
        button.disabled = false;
      });
    });
    return button;
  }

  function buildSaveWordHelpAction(item) {
    if (item.type !== 'word_help' || typeof window.saveBibleToolNoteAppend !== 'function') return null;
    var ref = item.refs && item.refs[0];
    if (!ref) return null;
    var button = makeEl('button', 'tdb-unified-search-action', 'Save note to My Study');
    button.type = 'button';
    button.addEventListener('click', function () {
      var lines = [
        'KJV word help: ' + item.title,
        item.summary || '',
        item.fullSummary ? truncate(item.fullSummary, 280) : '',
        item.href ? 'Open: ' + item.href : ''
      ].filter(Boolean);
      var ok = window.saveBibleToolNoteAppend(ref, lines.join('\n\n'));
      showToast(ok ? 'Saved privately on this device.' : 'That did not save quietly. Try again when you can.');
    });
    return button;
  }

  function buildActionRow(item) {
    var row = makeEl('div', 'tdb-unified-search-card__actions');
    var primary = buildPrimaryAction(item);
    var saveVerse = buildSaveVerseAction(item);
    var saveWord = buildSaveWordHelpAction(item);
    if (primary) row.appendChild(primary);
    if (saveVerse) row.appendChild(saveVerse);
    if (saveWord) row.appendChild(saveWord);
    return row.childNodes.length ? row : null;
  }

  function renderCard(item, compact) {
    var card = makeEl('article', 'tdb-unified-search-card');
    if (compact) card.classList.add('tdb-unified-search-card--porch');

    var top = makeEl('div', 'tdb-unified-search-card__top');
    top.appendChild(makeEl('span', 'tdb-unified-search-card__type', inferTypeLabel(item)));
    if (item.sourceRoom) top.appendChild(makeEl('span', 'tdb-unified-search-card__room', String(item.sourceRoom).replace(/-/g, ' ')));
    card.appendChild(top);

    var title = makeEl('h3', 'tdb-unified-search-card__title');
    var titleLink = makeEl('a', '', item.title);
    titleLink.href = item.href || '#';
    title.appendChild(titleLink);
    card.appendChild(title);

    var summaryText = item.type === 'verse' ? truncate(item.summary, compact ? 210 : 320) : truncate(item.summary || item.fullSummary, compact ? 170 : 240);
    if (summaryText) card.appendChild(makeEl('p', 'tdb-unified-search-card__summary', summaryText));
    if (item.smallStep) card.appendChild(makeEl('p', 'tdb-unified-search-card__step', truncate(item.smallStep, compact ? 150 : 200)));

    var refsLine = buildRefsLine(item);
    if (refsLine) card.appendChild(refsLine);

    var actionRow = buildActionRow(item);
    if (actionRow) card.appendChild(actionRow);
    return card;
  }

  function renderPorchResults(results) {
    porchEl.replaceChildren();
    var cards = getPorchResults(results);
    cards.forEach(function (item) {
      porchEl.appendChild(renderCard(item, true));
    });
    setHidden(porchEl, cards.length === 0);
    setHidden(seeAllBtn, results.length <= cards.length);
  }

  function renderSection(target, headingText, items) {
    target.replaceChildren();
    if (!items.length) {
      setHidden(target, true);
      return;
    }
    setHidden(target, false);
    var heading = makeEl('h3', 'tdb-unified-search-section__heading', headingText + ' (' + items.length + ')');
    target.appendChild(heading);
    items.forEach(function (item) {
      target.appendChild(renderCard(item, false));
    });
  }

  function renderFullResults(results) {
    var verses = results.filter(function (item) { return item.type === 'verse'; }).slice(0, 10);
    var wordHelps = results.filter(function (item) { return item.type === 'word_help'; }).slice(0, 10);
    var plans = results.filter(function (item) { return item.type === 'plan'; }).slice(0, 10);
    var pages = results.filter(function (item) { return item.type === 'tool' || item.type === 'page'; }).slice(0, 10);
    renderSection(versesSectionEl, 'Verses', verses);
    renderSection(wordHelpsSectionEl, 'Word helps', wordHelps);
    renderSection(plansSectionEl, 'Plans', plans);
    renderSection(pagesSectionEl, 'Pages and tools', pages);
    setHidden(fullResultsEl, !fullResultsVisible || results.length === 0);
  }

  function renderPageMap(query) {
    var hits = pageMapEntries.filter(function (entry) {
      return pageMapMatches(query, entry);
    });
    pageMapListEl.replaceChildren();
    hits.forEach(function (entry) {
      var li = document.createElement('li');
      li.setAttribute('role', 'listitem');
      var link = makeEl('a', '', entry.t);
      link.href = entry.u;
      li.appendChild(link);
      if (entry.k) li.appendChild(makeEl('p', 'tdb-site-search-results__meta', truncate(entry.k, 120)));
      li.appendChild(makeEl('span', 'tdb-site-search-results__url', entry.u));
      pageMapListEl.appendChild(li);
    });
    pageMapStatusEl.textContent = hits.length
      ? (query
        ? hits.length + ' page door' + (hits.length === 1 ? '' : 's') + ' still match below.'
        : 'All ' + hits.length + ' page doors are here if you want the full map.')
      : 'No page names matched below. That is all right—try the unified results above or a gentler word.';
    return hits.length;
  }

  function updateQueryParam(query) {
    try {
      var url = new URL(window.location.href);
      if (query) url.searchParams.set('q', query);
      else url.searchParams.delete('q');
      window.history.replaceState({}, '', url.pathname + (url.search || '') + (url.hash || ''));
    } catch (_) {}
  }

  function renderAll(query) {
    var clean = normalizeSpace(query);
    lastQuery = clean;
    updateQueryParam(clean);

    if (!clean) {
      fullResultsVisible = false;
      seeAllBtn.textContent = 'See fuller results';
      unifiedStatusEl.textContent = 'Type a verse, a hard KJV word, a plan name, or how the day feels. The page map stays below either way.';
      renderPorchResults([]);
      renderFullResults([]);
      renderPageMap('');
      setHidden(emptyEl, true);
      return;
    }

    var results = searchUnified(clean);
    var pageHits = renderPageMap(clean);
    if (!fullResultsVisible) seeAllBtn.textContent = 'See fuller results';
    renderPorchResults(results);
    renderFullResults(results);

    if (results.length) {
      unifiedStatusEl.textContent = results.length === 1
        ? 'One calm result surfaced first. Open it if it helps.'
        : results.length + ' unified results surfaced first — verse, word help, plan, and page doors.';
      setHidden(emptyEl, true);
    } else {
      unifiedStatusEl.textContent = 'No exact unified match surfaced first. The page map and Bible Tool door are still here.';
      setHidden(emptyEl, pageHits > 0);
    }
  }

  function debounce(fn, wait) {
    var timer = 0;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  }

  function init() {
    inputEl = byId('tdb-site-search-input');
    unifiedStatusEl = byId('tdb-unified-search-status');
    pageMapStatusEl = byId('tdb-page-map-status');
    porchEl = byId('tdb-unified-search-porch');
    fullResultsEl = byId('tdb-unified-search-full-results');
    seeAllBtn = byId('tdb-unified-search-see-all');
    emptyEl = byId('tdb-unified-search-empty');
    pageMapListEl = byId('tdb-site-search-results');
    versesSectionEl = byId('tdb-unified-search-verses');
    wordHelpsSectionEl = byId('tdb-unified-search-wordhelps');
    plansSectionEl = byId('tdb-unified-search-plans');
    pagesSectionEl = byId('tdb-unified-search-pages');
    if (!inputEl || !unifiedStatusEl || !pageMapStatusEl || !porchEl || !fullResultsEl || !seeAllBtn || !emptyEl || !pageMapListEl || !versesSectionEl || !wordHelpsSectionEl || !plansSectionEl || !pagesSectionEl) return;

    var runRender = debounce(function () {
      fullResultsVisible = false;
      renderAll(inputEl.value);
    }, 90);

    seeAllBtn.addEventListener('click', function () {
      fullResultsVisible = !fullResultsVisible;
      seeAllBtn.textContent = fullResultsVisible ? 'Hide fuller results' : 'See fuller results';
      renderAll(lastQuery);
    });

    inputEl.addEventListener('input', runRender);

    loadIndexes().then(function () {
      try {
        var params = new URLSearchParams(window.location.search || '');
        var preset = normalizeSpace(params.get('q'));
        if (preset) inputEl.value = preset;
      } catch (_) {}
      renderAll(inputEl.value);
    }).catch(function () {
      pageMapEntries = PAGE_MAP_FALLBACK.slice();
      renderAll(inputEl.value);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
