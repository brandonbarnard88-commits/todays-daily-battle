(function () {
  'use strict';

  var STUDY_KEY = 'tdb_my_study_v1';
  var SHARED_KEY = 'tdb_shared_studies_v1';
  var PREFIX = 'TDBMS1-';
  var kjvEntries = [];

  function byId(id) { return document.getElementById(id); }
  function nowIso() { return new Date().toISOString(); }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function hashFNV1a(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return ('0000000' + (h >>> 0).toString(16)).slice(-8);
  }

  function encodeBase64Url(str) {
    var b64 = btoa(unescape(encodeURIComponent(str)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function decodeBase64Url(str) {
    var normalized = str.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4 !== 0) normalized += '=';
    return decodeURIComponent(escape(atob(normalized)));
  }

  function loadStudy() {
    try {
      var raw = localStorage.getItem(STUDY_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {}
    return {
      verseRef: '',
      verseText: '',
      notes: '',
      prayer: '',
      showName: false,
      displayName: ''
    };
  }

  function saveStudy(study) {
    try { localStorage.setItem(STUDY_KEY, JSON.stringify(study)); } catch (e) {}
  }

  function loadShared() {
    try {
      var raw = localStorage.getItem(SHARED_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }

  function saveShared(items) {
    try { localStorage.setItem(SHARED_KEY, JSON.stringify(items)); } catch (e) {}
  }

  function getMemorizeQueueSnapshot(comp) {
    var q = typeof comp.listMemorizeQueue === 'function' ? comp.listMemorizeQueue() : [];
    var now = Date.now();
    var dueNow = 0;
    var i;
    for (i = 0; i < q.length; i++) {
      if (q[i].dueAt <= now) dueNow++;
    }
    var nextRow = null;
    for (i = 0; i < q.length; i++) {
      if (q[i].dueAt <= now) {
        nextRow = q[i];
        break;
      }
    }
    if (!nextRow && q.length) nextRow = q[0];
    return { n: q.length, dueNow: dueNow, nextRow: nextRow };
  }

  function updateMemorizePill() {
    var strip = byId('mystudy-memorize-strip');
    var el = byId('mystudy-memorize-pill');
    var btn = byId('mystudy-memorize-review-next');
    if (!strip || !el) {
      renderProgressSummary();
      return;
    }
    if (!window.TDBStudyCompanion || typeof window.TDBStudyCompanion.listMemorizeQueue !== 'function') {
      strip.classList.add('mystudy-memorize-strip--empty');
      el.textContent = '';
      if (btn) btn.classList.add('hidden');
      renderProgressSummary();
      return;
    }
    var snap = getMemorizeQueueSnapshot(window.TDBStudyCompanion);
    var n = snap.n;
    strip.classList.toggle('mystudy-memorize-strip--empty', !n);
    if (!n) {
      el.textContent =
        'Nothing here yet. When a verse touches your heart, add it from Memorize or the Bible Tool—reviews stay on this device. The Lord meets you right where you are.';
      if (btn) btn.classList.add('hidden');
      renderProgressSummary();
      return;
    }
    var line =
      n === 1
        ? '1 verse quietly held in your memory list on this device'
        : n + ' verses quietly held in your memory list on this device';
    if (snap.dueNow > 0) {
      line += snap.dueNow === 1 ? ' · 1 ready when you are' : ' · ' + snap.dueNow + ' ready when you are';
    }
    line += '. Open Note library for the full list.';
    el.textContent = line;
    if (btn) {
      btn.classList.remove('hidden');
      if (snap.nextRow && snap.nextRow.ref) {
        btn.setAttribute('aria-label', 'Mark ' + snap.nextRow.ref + ' reviewed today for your memory schedule');
      } else {
        btn.setAttribute('aria-label', 'Mark the next verse reviewed today');
      }
    }
    renderProgressSummary();
  }

  function markNextMemorizeReviewed() {
    var comp = window.TDBStudyCompanion;
    if (!comp || typeof comp.listMemorizeQueue !== 'function' || typeof comp.markMemorizeReviewed !== 'function') return;
    var snap = getMemorizeQueueSnapshot(comp);
    if (!snap.nextRow || !snap.nextRow.ref) return;
    comp.markMemorizeReviewed(snap.nextRow.ref, 'good');
    if (typeof window.showEliteToast === 'function') {
      window.showEliteToast('Reviewed: ' + snap.nextRow.ref + '. Next reminder follows your schedule.');
    }
    updateMemorizePill();
    var libPanel = byId('panel-note-library');
    if (libPanel && !libPanel.classList.contains('hidden')) renderNoteLibrary();
  }

  function setTab(tabName) {
    var myTab = byId('tab-my-study');
    var libTab = byId('tab-note-library');
    var highlightsTab = byId('tab-highlights');
    var joinTab = byId('tab-join-study');
    var myPanel = byId('panel-my-study');
    var libPanel = byId('panel-note-library');
    var highlightsPanel = byId('panel-highlights');
    var joinPanel = byId('panel-join-study');
    if (!myTab || !highlightsTab || !joinTab || !myPanel || !highlightsPanel || !joinPanel) return;
    var isMy = tabName === 'my';
    var isLib = tabName === 'library';
    var isHighlights = tabName === 'highlights';
    var isJoin = tabName === 'join';
    myTab.classList.toggle('active', isMy);
    if (libTab) libTab.classList.toggle('active', isLib);
    highlightsTab.classList.toggle('active', isHighlights);
    joinTab.classList.toggle('active', isJoin);
    myTab.setAttribute('aria-selected', isMy ? 'true' : 'false');
    if (libTab) libTab.setAttribute('aria-selected', isLib ? 'true' : 'false');
    highlightsTab.setAttribute('aria-selected', isHighlights ? 'true' : 'false');
    joinTab.setAttribute('aria-selected', isJoin ? 'true' : 'false');
    myPanel.classList.toggle('hidden', !isMy);
    if (libPanel) libPanel.classList.toggle('hidden', !isLib);
    highlightsPanel.classList.toggle('hidden', !isHighlights);
    joinPanel.classList.toggle('hidden', !isJoin);
    if (isLib) renderNoteLibrary();
    updateMemorizePill();
  }

  function createBibleToolOpenAnchor(ref, label) {
    var a = document.createElement('a');
    a.href = 'bible-tool.html?ref=' + encodeURIComponent(ref);
    a.className = 'btn btn-secondary mystudy-open-tool';
    a.textContent = label || 'Bible Tool';
    a.setAttribute('aria-label', 'Open ' + ref + ' in Bible Tool');
    return a;
  }

  function createWordStudyButton(ref, textHint) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary mystudy-wordstudy-btn';
    btn.textContent = 'Study this verse';
    btn.setAttribute('aria-label', 'Open verse study for ' + ref);
    btn.setAttribute('data-tdb-wordstudy-ref', ref);
    var hint = String(textHint || '').trim();
    if (hint) btn.setAttribute('data-tdb-wordstudy-text', hint);
    return btn;
  }

  function renderProgressSummary() {
    var el = byId('mystudy-progress-summary');
    if (!el) return;
    el.textContent = '';
    var comp = window.TDBStudyCompanion;
    if (!comp || typeof comp.getDashboardStats !== 'function') {
      var err = document.createElement('p');
      err.className = 'mystudy-progress-summary-line';
      err.textContent = 'Study tools did not load. Refresh the page.';
      el.appendChild(err);
      return;
    }
    var s = comp.getDashboardStats();
    var lines = [];
    if (s.versesWithNotes > 0) {
      lines.push(
        'You have ' +
          s.versesWithNotes +
          ' verse note' +
          (s.versesWithNotes === 1 ? '' : 's') +
          ' saved on this device.'
      );
    }
    if (s.notesTouchedThisMonth > 0) {
      lines.push(
        'This month you refreshed tags on ' +
          s.notesTouchedThisMonth +
          ' tagged verse' +
          (s.notesTouchedThisMonth === 1 ? '' : 's') +
          '.'
      );
    }
    if (s.readingPlanCheckmarks > 0) {
      lines.push(
        'Reading plan: ' +
          s.readingPlanCheckmarks +
          ' day marker' +
          (s.readingPlanCheckmarks === 1 ? '' : 's') +
          ' in the Bible Tool.'
      );
    }
    if (s.chaptersVisitedThisMonth > 0) {
      lines.push(
        'Chapter reader: ' +
          s.chaptersVisitedThisMonth +
          ' chapter visit' +
          (s.chaptersVisitedThisMonth === 1 ? '' : 'es') +
          ' this month.'
      );
    }
    if (s.memorizeVerses > 0) {
      var memLine =
        'Gentle memory list: ' +
        s.memorizeVerses +
        ' verse' +
        (s.memorizeVerses === 1 ? '' : 's') +
        ' on this device';
      if (s.memorizeReviewsThisMonth > 0) {
        memLine +=
          ', ' +
          s.memorizeReviewsThisMonth +
          ' review' +
          (s.memorizeReviewsThisMonth === 1 ? '' : 's') +
          ' logged this month';
      }
      memLine += '.';
      lines.push(memLine);
    }
    if (!lines.length) {
      var p = document.createElement('p');
      p.className = 'mystudy-progress-summary-line mystudy-progress-summary-line--lead';
      p.appendChild(document.createTextNode('Quiet start—nothing here is against you. When you are ready, add a verse note in the '));
      var aBt = document.createElement('a');
      aBt.href = 'bible-tool.html';
      aBt.className = 'mystudy-inline-tool-link';
      aBt.textContent = 'Bible Tool';
      p.appendChild(aBt);
      p.appendChild(document.createTextNode(', open a chapter in the '));
      var aRd = document.createElement('a');
      aRd.href = 'reader.html';
      aRd.className = 'mystudy-inline-tool-link';
      aRd.textContent = 'chapter reader';
      p.appendChild(aRd);
      p.appendChild(document.createTextNode(', or check off a day in '));
      var aPl = document.createElement('a');
      aPl.href = 'plans.html';
      aPl.className = 'mystudy-inline-tool-link';
      aPl.textContent = 'Battle Plans';
      p.appendChild(aPl);
      p.appendChild(
        document.createTextNode(
          '—this panel will show a simple rhythm. No rush. The Lord meets you right where you are.'
        )
      );
      el.appendChild(p);
      return;
    }
    lines.forEach(function (line) {
      var lineEl = document.createElement('p');
      lineEl.className = 'mystudy-progress-summary-line';
      lineEl.textContent = line;
      el.appendChild(lineEl);
    });
  }

  function renderMemorizePanel(comp) {
    var el = byId('mystudy-memorize-list');
    if (!el || !comp.listMemorizeQueue) return;
    el.innerHTML = '';
    var q = comp.listMemorizeQueue();
    if (!q.length) {
      var empty = document.createElement('li');
      empty.className = 'section-note mystudy-empty-hint';
      empty.appendChild(document.createTextNode('Nothing here yet. When a verse touches your heart, look it up in the '));
      var emA = document.createElement('a');
      emA.href = 'bible-tool.html';
      emA.className = 'mystudy-inline-tool-link';
      emA.textContent = 'Bible Tool';
      empty.appendChild(emA);
      empty.appendChild(
        document.createTextNode(' and tap Memorize—a gentle review stays on this device. The Lord meets you right where you are.')
      );
      el.appendChild(empty);
      return;
    }
    var now = Date.now();
    q.forEach(function (row) {
      var li = document.createElement('li');
      li.className = 'mystudy-memorize-item';
      var due = row.dueAt <= now;
      var line = document.createElement('div');
      line.className = 'mystudy-memorize-row';
      var a = document.createElement('a');
      a.href = 'bible-tool.html?ref=' + encodeURIComponent(row.ref);
      a.className = 'mystudy-memorize-ref';
      a.textContent = row.ref + (due ? ' (ready to review)' : '');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary mystudy-mem-reviewed';
      btn.textContent = 'Reviewed today';
      btn.setAttribute('aria-label', 'Mark ' + row.ref + ' reviewed for memory schedule');
      btn.addEventListener('click', function () {
        comp.markMemorizeReviewed(row.ref, 'good');
        renderNoteLibrary();
      });
      line.appendChild(a);
      line.appendChild(btn);
      li.appendChild(line);
      el.appendChild(li);
    });
  }

  function renderTagPills(comp) {
    var wrap = byId('mystudy-tag-pills');
    var filterEl = byId('mystudy-library-filter');
    if (!wrap || !comp.collectAllTags) return;
    wrap.innerHTML = '';
    var tags = comp.collectAllTags();
    var cur = filterEl ? String(filterEl.value || '').trim().toLowerCase() : '';
    var allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'mystudy-tag-pill';
    allBtn.textContent = 'All';
    allBtn.setAttribute('aria-pressed', !cur ? 'true' : 'false');
    allBtn.addEventListener('click', function () {
      if (filterEl) filterEl.value = '';
      renderNoteLibrary();
    });
    wrap.appendChild(allBtn);
    tags.slice(0, 24).forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mystudy-tag-pill';
      b.textContent = t;
      b.setAttribute('aria-pressed', cur === t ? 'true' : 'false');
      b.addEventListener('click', function () {
        if (filterEl) filterEl.value = t;
        renderNoteLibrary();
      });
      wrap.appendChild(b);
    });
  }

  function renderRecentlyTagged(comp) {
    var el = byId('mystudy-recent-tagged');
    if (!el) return;
    if (!comp || typeof comp.listVerseNotes !== 'function') {
      el.innerHTML = '';
      var err = document.createElement('li');
      err.className = 'section-note';
      err.textContent = 'Note library needs the study helper script. Refresh the page.';
      el.appendChild(err);
      return;
    }
    el.innerHTML = '';
    var tagged = comp.listVerseNotes().filter(function (row) {
      return row.tags && row.tags.length;
    });
    tagged.sort(function (a, b) {
      var ta = a.updated ? Date.parse(a.updated) : 0;
      var tb = b.updated ? Date.parse(b.updated) : 0;
      if (tb !== ta) return tb - ta;
      return (a.ref || '').localeCompare(b.ref || '');
    });
    var top = tagged.slice(0, 8);
    if (!top.length) {
      var empty = document.createElement('li');
      empty.className = 'section-note mystudy-empty-hint';
      empty.appendChild(document.createTextNode('Nothing here yet. When a verse touches your heart, save a note in the '));
      var elBt = document.createElement('a');
      elBt.href = 'bible-tool.html';
      elBt.className = 'mystudy-inline-tool-link';
      elBt.textContent = 'Bible Tool';
      empty.appendChild(elBt);
      empty.appendChild(
        document.createTextNode(' and add a comma-separated tag—themes you care about gather here. The Lord meets you right where you are.')
      );
      el.appendChild(empty);
      return;
    }
    top.forEach(function (row) {
      var li = document.createElement('li');
      li.className = 'mystudy-library-item mystudy-recent-tagged-item';
      var rowWrap = document.createElement('div');
      rowWrap.className = 'mystudy-library-item-row';
      var main = document.createElement('div');
      main.className = 'mystudy-library-item-main';
      var a = document.createElement('a');
      a.className = 'mystudy-library-link';
      a.href = 'bible-tool.html?ref=' + encodeURIComponent(row.ref);
      a.setAttribute('aria-label', 'Open ' + row.ref + ' in Bible Tool');
      var refStrong = document.createElement('strong');
      refStrong.textContent = row.ref;
      a.appendChild(refStrong);
      var tagSpan = document.createElement('span');
      tagSpan.className = 'mystudy-library-tags';
      tagSpan.textContent = row.tags.join(' · ');
      a.appendChild(document.createTextNode(' '));
      a.appendChild(tagSpan);
      main.appendChild(a);
      rowWrap.appendChild(main);
      rowWrap.appendChild(createWordStudyButton(row.ref, row.preview || ''));
      rowWrap.appendChild(createBibleToolOpenAnchor(row.ref, 'Open'));
      li.appendChild(rowWrap);
      el.appendChild(li);
    });
  }

  function renderNoteLibrary() {
    var listEl = byId('mystudy-library-list');
    var recentEl = byId('mystudy-recent-chapters');
    var statusEl = byId('mystudy-library-status');
    var filterEl = byId('mystudy-library-filter');
    if (!listEl) return;
    var comp = window.TDBStudyCompanion;
    if (!comp || typeof comp.listVerseNotes !== 'function') {
      listEl.innerHTML = '';
      renderRecentlyTagged(null);
      var li = document.createElement('li');
      li.className = 'section-note';
      li.textContent = 'Note library needs the study helper script. Refresh the page.';
      listEl.appendChild(li);
      updateMemorizePill();
      return;
    }
    renderMemorizePanel(comp);
    renderTagPills(comp);
    renderRecentlyTagged(comp);
    var q = filterEl ? String(filterEl.value || '').trim().toLowerCase() : '';
    var rows = comp.listVerseNotes();
    if (q) {
      rows = rows.filter(function (row) {
        var blob = (row.ref + ' ' + (row.preview || '') + ' ' + (row.tags || []).join(' ')).toLowerCase();
        return blob.indexOf(q) !== -1;
      });
    }
    if (statusEl) {
      statusEl.textContent = '';
      if (rows.length) {
        statusEl.textContent =
          rows.length + ' note' + (rows.length === 1 ? '' : 's') + (q ? ' match your filter.' : ' saved from the Bible Tool.');
      } else if (q) {
        statusEl.textContent =
          'Nothing here yet for that filter. Clear the box or tap All to widen the list. The Lord meets you right where you are.';
      } else {
        var emptyP = document.createElement('p');
        emptyP.className = 'section-note mystudy-empty-hint';
        emptyP.appendChild(document.createTextNode('Nothing here yet. When a verse touches your heart, save a verse study or add your own thoughts in the '));
        var stA = document.createElement('a');
        stA.href = 'bible-tool.html';
        stA.className = 'mystudy-inline-tool-link';
        stA.textContent = 'Bible Tool';
        emptyP.appendChild(stA);
        emptyP.appendChild(
          document.createTextNode(
            '—everything stays on this device. Print notes or Print full bundle when you want a tidy copy. The Lord meets you right where you are.'
          )
        );
        statusEl.appendChild(emptyP);
      }
    }
    listEl.innerHTML = '';
    rows.forEach(function (row) {
      var li = document.createElement('li');
      li.className = 'mystudy-library-item';
      var rowWrap = document.createElement('div');
      rowWrap.className = 'mystudy-library-item-row';
      var main = document.createElement('div');
      main.className = 'mystudy-library-item-main';
      var a = document.createElement('a');
      a.className = 'mystudy-library-link';
      a.href = 'bible-tool.html?ref=' + encodeURIComponent(row.ref);
      a.setAttribute('aria-label', 'Open ' + row.ref + ' in Bible Tool');
      var refStrong = document.createElement('strong');
      refStrong.textContent = row.ref;
      a.appendChild(refStrong);
      if (row.tags && row.tags.length) {
        var tagSpan = document.createElement('span');
        tagSpan.className = 'mystudy-library-tags';
        tagSpan.textContent = row.tags.join(' · ');
        a.appendChild(document.createTextNode(' '));
        a.appendChild(tagSpan);
      }
      var prev = document.createElement('p');
      prev.className = 'mystudy-library-preview';
      prev.textContent = row.preview || '';
      main.appendChild(a);
      main.appendChild(prev);
      rowWrap.appendChild(main);
      rowWrap.appendChild(createWordStudyButton(row.ref, row.preview || ''));
      rowWrap.appendChild(createBibleToolOpenAnchor(row.ref, 'Open'));
      li.appendChild(rowWrap);
      listEl.appendChild(li);
    });

    if (recentEl) {
      recentEl.innerHTML = '';
      var recent = typeof comp.getRecentChapters === 'function' ? comp.getRecentChapters() : [];
      if (!recent.length) {
        var empty = document.createElement('li');
        empty.className = 'section-note mystudy-empty-hint';
        empty.appendChild(document.createTextNode('Nothing here yet. When you are ready, open any chapter in the '));
        var rA = document.createElement('a');
        rA.href = 'reader.html';
        rA.className = 'mystudy-inline-tool-link';
        rA.textContent = 'chapter reader';
        empty.appendChild(rA);
        empty.appendChild(
          document.createTextNode(
            '—your last few will list here for the full bundle. The Lord meets you right where you are.'
          )
        );
        recentEl.appendChild(empty);
      } else {
        recent.forEach(function (item) {
          var rli = document.createElement('li');
          rli.className = 'mystudy-library-item';
          var ra = document.createElement('a');
          ra.className = 'mystudy-library-link';
          ra.href =
            'reader.html?book=' +
            encodeURIComponent(item.book || '') +
            '&chapter=' +
            encodeURIComponent(String(item.chapter || ''));
          ra.textContent = item.label || (item.book + ' ' + item.chapter);
          ra.setAttribute('aria-label', 'Open ' + (item.label || '') + ' in chapter reader');
          rli.appendChild(ra);
          recentEl.appendChild(rli);
        });
      }
    }
    updateMemorizePill();
  }

  function renderSelectedVerse(study) {
    var refEl = byId('mystudy-verse-ref');
    var textEl = byId('mystudy-verse-text');
    if (!refEl || !textEl) return;
    refEl.textContent =
      study.verseRef ||
      'Nothing here yet. When a verse touches your heart, search on Home or open the Bible Tool. The Lord meets you right where you are.';
    textEl.textContent = study.verseText || '';
  }

  function renderSharedList() {
    var listEl = byId('mystudy-shared-list');
    if (!listEl) return;
    var items = loadShared();
    if (!items.length) {
      listEl.innerHTML =
        '<p class="section-note mystudy-empty-hint">Nothing here yet. When a verse touches your heart, paste a code someone sent you—or generate one after you pick a verse. The Lord meets you right where you are.</p>';
      return;
    }
    listEl.innerHTML = '';
    items.forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'mystudy-shared-item';
      card.innerHTML =
        '<p class="mystudy-shared-label">' + escapeHtml(item.label || "Brother's Study") + '</p>' +
        '<p><strong>' + escapeHtml(item.verseRef || 'Verse') + '</strong></p>' +
        '<p class="section-note">' + escapeHtml(item.verseText || '') + '</p>' +
        '<p class="section-note">' + escapeHtml(item.notes || '') + '</p>';
      listEl.appendChild(card);
    });
  }

  async function ensureBibleLoaded() {
    if (kjvEntries.length) return true;
    var status = byId('mystudy-search-status');
    try {
      if (status) status.textContent = 'Loading Bible...';
      var res = await fetch('kjv.json');
      if (!res.ok) throw new Error('bible_fetch_failed');
      var data = await res.json();
      kjvEntries = Object.keys(data || {}).map(function (ref) {
        var text = String(data[ref] || '');
        return { ref: ref, text: text, refLower: ref.toLowerCase(), textLower: text.toLowerCase() };
      });
      if (status) status.textContent = '';
      return true;
    } catch (e) {
      if (status) status.textContent = 'Bible search could not be loaded right now.';
      return false;
    }
  }

  function renderResults(results, study, handlers) {
    var listEl = byId('mystudy-results');
    if (!listEl) return;
    listEl.innerHTML = '';
    if (!results.length) {
      listEl.innerHTML = '<li class="section-note">Nothing here yet. When a verse touches your heart, try a broader keyword or an exact reference. The Lord meets you right where you are.</li>';
      return;
    }
    results.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'mystudy-result';
      li.innerHTML =
        '<div class="mystudy-result-head"><strong>' + escapeHtml(item.ref) + '</strong><div class="mystudy-share-actions"><button class="btn btn-secondary" type="button" data-role="use">Use</button><button class="btn btn-secondary" type="button" data-role="breakdown">Breakdown</button><button class="btn btn-secondary mystudy-highlight-btn" type="button" data-role="highlight">Highlight</button></div></div>' +
        '<p class="section-note">' + escapeHtml(item.text.slice(0, 190)) + (item.text.length > 190 ? '...' : '') + '</p>';
      var useBtn = li.querySelector('button[data-role="use"]');
      var breakdownBtn = li.querySelector('button[data-role="breakdown"]');
      var highlightBtn = li.querySelector('button[data-role="highlight"]');
      useBtn.addEventListener('click', function () {
        study.verseRef = item.ref;
        study.verseText = item.text;
        saveStudy(study);
        renderSelectedVerse(study);
      });
      highlightBtn.addEventListener('click', function () {
        if (handlers && typeof handlers.saveHighlight === 'function') {
          handlers.saveHighlight(item.ref, item.text);
        }
      });
      breakdownBtn.addEventListener('click', function () {
        if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.open === 'function') {
          window.TDBVerseBreakdown.open(item.ref, item.text);
        }
      });
      listEl.appendChild(li);
    });
  }

  async function runSearch(study, handlers) {
    var qEl = byId('mystudy-search');
    var status = byId('mystudy-search-status');
    if (!qEl) return;
    var q = String(qEl.value || '').trim().toLowerCase();
    if (!q) {
      renderResults([], study, handlers);
      if (status) status.textContent = 'Try a verse reference (e.g. John 3:16) or a word like peace, fear, hope.';
      return;
    }
    var ok = await ensureBibleLoaded();
    if (!ok) return;
    var results = kjvEntries.filter(function (v) {
      return v.refLower.indexOf(q) !== -1 || v.textLower.indexOf(q) !== -1;
    }).slice(0, 25);
    renderResults(results, study, handlers);
    if (status) status.textContent = results.length + ' result' + (results.length === 1 ? '' : 's') + '.';
  }

  function buildSharePayload(study) {
    var showName = !!study.showName;
    var displayName = String(study.displayName || '').trim();
    var label = "Brother's Study";
    if (showName && displayName) label = displayName + "'s Study";
    return {
      v: 1,
      label: label,
      verseRef: String(study.verseRef || ''),
      verseText: String(study.verseText || ''),
      notes: String(study.notes || ''),
      at: nowIso()
    };
  }

  function generateShareCode(study) {
    var payload = buildSharePayload(study);
    if (!payload.verseRef || !payload.verseText) return '';
    return PREFIX + encodeBase64Url(JSON.stringify(payload));
  }

  function decodeShareCode(code) {
    var cleaned = String(code || '').trim();
    if (!cleaned) throw new Error('missing_code');
    if (cleaned.indexOf(PREFIX) === 0) cleaned = cleaned.slice(PREFIX.length);
    var parsed = JSON.parse(decodeBase64Url(cleaned));
    if (!parsed || parsed.v !== 1) throw new Error('invalid_version');
    return {
      label: String(parsed.label || "Brother's Study"),
      verseRef: String(parsed.verseRef || ''),
      verseText: String(parsed.verseText || ''),
      notes: String(parsed.notes || ''),
      id: hashFNV1a(JSON.stringify(parsed))
    };
  }

  function wire() {
    var study = loadStudy();
    var notesEl = byId('mystudy-notes');
    var prayerEl = byId('mystudy-prayer');
    var showNameEl = byId('mystudy-show-name');
    var displayNameEl = byId('mystudy-display-name');
    var shareCodeEl = byId('mystudy-share-code');
    var shareStatusEl = byId('mystudy-share-status');
    var joinStatusEl = byId('mystudy-join-status');

    function saveHighlight(ref, text) {
      if (!window.TDBHighlights || typeof window.TDBHighlights.saveHighlight !== 'function') return;
      window.TDBHighlights.saveHighlight({
        ref: ref,
        text: text,
        note: notesEl ? notesEl.value : ''
      }).then(function () {
        setTab('highlights');
      });
    }

    if (notesEl) notesEl.value = study.notes || '';
    if (prayerEl) prayerEl.value = study.prayer || '';
    if (showNameEl) showNameEl.checked = !!study.showName;
    if (displayNameEl) displayNameEl.value = study.displayName || '';
    renderSelectedVerse(study);
    renderSharedList();

    byId('tab-my-study')?.addEventListener('click', function () { setTab('my'); });
    byId('tab-note-library')?.addEventListener('click', function () { setTab('library'); });
    byId('mystudy-print-notes')?.addEventListener('click', function () {
      if (!window.TDBStudyCompanion || typeof window.TDBStudyCompanion.openPrintableNotes !== 'function') return;
      var ok = window.TDBStudyCompanion.openPrintableNotes();
      if (!ok && typeof window.showEliteToast === 'function') {
        window.showEliteToast('Allow pop-ups to print, or use Export JSON on the Bible Tool.');
      }
    });
    byId('mystudy-print-bundle')?.addEventListener('click', function () {
      if (!window.TDBStudyCompanion || typeof window.TDBStudyCompanion.openPrintableStudyBundle !== 'function') return;
      var ok = window.TDBStudyCompanion.openPrintableStudyBundle();
      if (!ok && typeof window.showEliteToast === 'function') {
        window.showEliteToast('Allow pop-ups to print your study bundle.');
      }
    });
    byId('mystudy-memorize-review-next')?.addEventListener('click', function () {
      markNextMemorizeReviewed();
    });
    byId('tab-highlights')?.addEventListener('click', function () { setTab('highlights'); });
    byId('tab-join-study')?.addEventListener('click', function () { setTab('join'); });

    var libFilter = byId('mystudy-library-filter');
    if (libFilter) {
      libFilter.addEventListener('input', function () {
        if (byId('panel-note-library') && !byId('panel-note-library').classList.contains('hidden')) {
          renderNoteLibrary();
        }
      });
    }

    byId('mystudy-search-btn')?.addEventListener('click', function () { runSearch(study, { saveHighlight: saveHighlight }); });
    byId('mystudy-search')?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        runSearch(study, { saveHighlight: saveHighlight });
      }
    });
    byId('mystudy-highlight-selected')?.addEventListener('click', function () {
      if (!study.verseRef || !study.verseText) return;
      saveHighlight(study.verseRef, study.verseText);
    });
    byId('mystudy-breakdown-selected')?.addEventListener('click', function () {
      if (!study.verseRef || !study.verseText) return;
      if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.open === 'function') {
        window.TDBVerseBreakdown.open(study.verseRef, study.verseText);
      }
    });
    byId('mystudy-breakdown-highlight')?.addEventListener('click', function () {
      var ref = byId('mystudy-highlight-ref');
      var text = byId('mystudy-highlight-text');
      var refValue = ref ? String(ref.textContent || '').trim() : '';
      var textValue = text ? String(text.textContent || '').trim() : '';
      if (!refValue || !textValue) return;
      if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.open === 'function') {
        window.TDBVerseBreakdown.open(refValue, textValue);
      }
    });

    notesEl?.addEventListener('input', function () {
      study.notes = notesEl.value;
      saveStudy(study);
    });
    prayerEl?.addEventListener('input', function () {
      study.prayer = prayerEl.value;
      saveStudy(study);
    });
    showNameEl?.addEventListener('change', function () {
      study.showName = !!showNameEl.checked;
      saveStudy(study);
    });
    displayNameEl?.addEventListener('input', function () {
      study.displayName = displayNameEl.value;
      saveStudy(study);
    });

    byId('mystudy-generate-code')?.addEventListener('click', function () {
      var code = generateShareCode(study);
      if (!code) {
        if (shareStatusEl) shareStatusEl.textContent = 'Select a verse before generating a code.';
        return;
      }
      if (shareCodeEl) shareCodeEl.value = code;
      if (shareStatusEl) shareStatusEl.textContent = "Share code ready. This shares verse + notes only.";
    });

    byId('mystudy-copy-code')?.addEventListener('click', function () {
      var code = shareCodeEl ? String(shareCodeEl.value || '').trim() : '';
      if (!code) {
        if (shareStatusEl) shareStatusEl.textContent = 'Generate a code first.';
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {
          if (shareStatusEl) shareStatusEl.textContent = 'Code copied.';
        }).catch(function () {
          if (shareStatusEl) shareStatusEl.textContent = 'Copy failed. Please select and copy manually.';
        });
      }
    });

    byId('mystudy-join-btn')?.addEventListener('click', function () {
      var joinInput = byId('mystudy-join-code');
      var code = joinInput ? String(joinInput.value || '').trim() : '';
      try {
        var shared = decodeShareCode(code);
        if (!shared.verseRef || !shared.verseText) throw new Error('missing_study_data');
        var items = loadShared();
        if (!items.some(function (it) { return it.id === shared.id; })) {
          items.unshift({
            id: shared.id,
            label: shared.label || "Brother's Study",
            verseRef: shared.verseRef,
            verseText: shared.verseText,
            notes: shared.notes || '',
            joinedAt: nowIso()
          });
          saveShared(items);
        }
        renderSharedList();
        setTab('join');
        if (joinStatusEl) joinStatusEl.textContent = 'Study joined.';
      } catch (e) {
        if (joinStatusEl) joinStatusEl.textContent = 'Invalid code. Ask for a fresh share code.';
      }
    });

    byId('mystudy-clear-joined')?.addEventListener('click', function () {
      saveShared([]);
      renderSharedList();
      if (joinStatusEl) joinStatusEl.textContent = 'Joined studies cleared.';
    });

    if (window.TDBHighlights && typeof window.TDBHighlights.initMyStudyHighlights === 'function') {
      window.TDBHighlights.initMyStudyHighlights({ setTab: setTab });
    }

    updateMemorizePill();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
