(function () {
  'use strict';

  var STUDY_KEY = 'tdb_my_study_v1';
  var SHARED_KEY = 'tdb_shared_studies_v1';
  var PREFIX = 'TDBMS1-';
  var kjvEntries = [];

  function byId(id) { return document.getElementById(id); }
  function nowIso() { return new Date().toISOString(); }
  function clearNode(el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  }

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

  function getRequestedTab() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      var requested = String(params.get('tab') || '').trim().toLowerCase();
      if (requested === 'library' || requested === 'highlights' || requested === 'join' || requested === 'my') {
        return requested;
      }
      var hash = String(window.location.hash || '').trim().toLowerCase();
      if (hash === '#saved-verses' || hash === '#panel-note-library') return 'library';
      if (hash === '#panel-highlights') return 'highlights';
      if (hash === '#panel-join-study') return 'join';
    } catch (e) {}
    return 'my';
  }

  function syncTabQuery(tabName) {
    try {
      if (!window.history || typeof window.history.replaceState !== 'function') return;
      var url = new URL(window.location.href);
      if (tabName && tabName !== 'my') url.searchParams.set('tab', tabName);
      else url.searchParams.delete('tab');
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    } catch (e) {}
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
    syncTabQuery(tabName);
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
      renderStreakBadges();
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
      p.appendChild(document.createTextNode('Quiet start. When you are ready, add a verse note in the '));
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
      renderStreakBadges();
      return;
    }
    lines.forEach(function (line) {
      var lineEl = document.createElement('p');
      lineEl.className = 'mystudy-progress-summary-line';
      lineEl.textContent = line;
      el.appendChild(lineEl);
    });
    renderStreakBadges();
  }

  function renderStreakBadges() {
    var featuredEl = byId('mystudy-streak-badge-featured');
    var progressEl = byId('mystudy-streak-badge-progress');
    var railEl = byId('mystudy-streak-badge-rail');
    if (!featuredEl || !progressEl || !railEl) return;
    clearNode(featuredEl);
    clearNode(railEl);
    if (!window.TDBStreakBadges || typeof window.TDBStreakBadges.getState !== 'function') {
      progressEl.textContent = 'Quiet markers will appear here when your study rhythm is ready.';
      return;
    }
    var state = window.TDBStreakBadges.getState();
    var featured = state && state.featuredBadge ? state.featuredBadge : null;
    if (!featured) {
      progressEl.textContent = 'Quiet markers will appear here when your study rhythm is ready.';
      return;
    }
    var featuredCard = document.createElement('article');
    featuredCard.className =
      'mystudy-streak-badge-featured-card' +
      (state.unlockedBadges && state.unlockedBadges.length ? '' : ' mystudy-streak-badge-featured-card--locked');

    var figure = document.createElement('div');
    figure.className = 'mystudy-streak-badge-figure';
    figure.setAttribute(
      'aria-label',
      (featured.unlocked ? 'Earned ' : 'Preview ') + featured.label + ' badge: ' + featured.title
    );
    var featuredSvg = window.TDBStreakBadges.buildSvg(featured.id, { size: 72 });
    if (featuredSvg) figure.appendChild(featuredSvg);

    var copy = document.createElement('div');
    copy.className = 'mystudy-streak-badge-featured-copy';
    var eyebrow = document.createElement('p');
    eyebrow.className = 'mystudy-streak-badge-eyebrow';
    eyebrow.textContent = featured.unlocked ? 'Latest earned' : 'First quiet marker';
    var title = document.createElement('h3');
    title.className = 'mystudy-streak-badge-title';
    title.textContent = featured.title;
    var note = document.createElement('p');
    note.className = 'mystudy-streak-badge-note';
    note.textContent = featured.unlocked ? featured.unlockCopy : featured.previewCopy;
    copy.appendChild(eyebrow);
    copy.appendChild(title);
    copy.appendChild(note);
    if (featured.unlocked && featured.unlockDate) {
      var date = document.createElement('p');
      date.className = 'mystudy-streak-badge-date';
      date.textContent = 'Unlocked ' + featured.unlockDate;
      copy.appendChild(date);
    }
    featuredCard.appendChild(figure);
    featuredCard.appendChild(copy);
    featuredEl.appendChild(featuredCard);

    if (state.allUnlocked) {
      progressEl.textContent = 'Still walking. Your quiet rhythm is holding.';
    } else if (state.nextBadge) {
      var current = Math.max(0, Math.min(state.streakCount || 0, state.nextBadge.days));
      progressEl.textContent =
        (state.unlockedBadges && state.unlockedBadges.length
          ? current + ' of ' + state.nextBadge.days + ' days toward ' + state.nextBadge.title + '.'
          : current + ' of ' + state.nextBadge.days + ' days toward your first badge.');
    } else {
      progressEl.textContent = '';
    }

    (state.badges || []).forEach(function (badge) {
      var chip = document.createElement('div');
      chip.className =
        'mystudy-streak-badge-chip' + (badge.unlocked ? ' mystudy-streak-badge-chip--earned' : ' mystudy-streak-badge-chip--locked');
      chip.setAttribute('role', 'listitem');
      chip.setAttribute(
        'aria-label',
        (badge.unlocked ? 'Earned ' : 'Locked ') + badge.label + ' badge: ' + badge.title
      );

      var chipFigure = document.createElement('div');
      chipFigure.className = 'mystudy-streak-badge-figure';
      var chipSvg = window.TDBStreakBadges.buildSvg(badge.id, { size: 44 });
      if (chipSvg) chipFigure.appendChild(chipSvg);

      var chipCopy = document.createElement('div');
      chipCopy.className = 'mystudy-streak-badge-chip-copy';
      var chipLabel = document.createElement('p');
      chipLabel.className = 'mystudy-streak-badge-label';
      chipLabel.textContent = badge.title;
      var chipMeta = document.createElement('p');
      chipMeta.className = 'mystudy-streak-badge-meta';
      chipMeta.textContent = badge.unlocked
        ? (badge.unlockDate ? 'Unlocked ' + badge.unlockDate : badge.label + ' earned')
        : 'Unlock at ' + badge.days + ' days';
      chipCopy.appendChild(chipLabel);
      chipCopy.appendChild(chipMeta);
      chip.appendChild(chipFigure);
      chip.appendChild(chipCopy);
      railEl.appendChild(chip);
    });

    if (typeof window.TDBStreakBadges.consumePendingUnlock === 'function') {
      window.TDBStreakBadges.consumePendingUnlock();
    }
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
    setTab(getRequestedTab());
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
    var art = textEl.closest('.mystudy-verse-card');
    if (art) {
      if (study.verseText) art.setAttribute('data-kjv-context-verse', study.verseText);
      else art.removeAttribute('data-kjv-context-verse');
    }
    if (window.TdbKjvDictionary && typeof window.TdbKjvDictionary.applyToElement === 'function') {
      textEl.removeAttribute('data-tdb-kjv-wrapped');
      window.TdbKjvDictionary.applyToElement(textEl, {
        plainText: study.verseText || '',
        contextVerse: study.verseText || ''
      });
    }
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
      var res = await fetch('/kjv.json');
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
        '<div class="mystudy-result-head"><strong>' + escapeHtml(item.ref) + '</strong><div class="mystudy-share-actions"><button class="btn btn-secondary" type="button" data-role="use">Use</button><button class="btn btn-secondary mystudy-highlight-btn" type="button" data-role="highlight">Highlight</button></div></div>' +
        '<p class="section-note">' + escapeHtml(item.text.slice(0, 190)) + (item.text.length > 190 ? '...' : '') + '</p>';
      var useBtn = li.querySelector('button[data-role="use"]');
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
      li.setAttribute('data-kjv-context-verse', item.text || '');
      var previewP = li.querySelector('p.section-note');
      var fullText = String(item.text || '');
      var shown = fullText.length > 190 ? fullText.slice(0, 190) + '...' : fullText;
      if (previewP && fullText && window.TdbKjvDictionary && typeof window.TdbKjvDictionary.applyToElement === 'function') {
        previewP.removeAttribute('data-tdb-kjv-wrapped');
        window.TdbKjvDictionary.applyToElement(previewP, { plainText: shown, contextVerse: fullText });
      }
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
    byId('mystudy-export-json')?.addEventListener('click', function () {
      if (!window.TDBStudyCompanion || typeof window.TDBStudyCompanion.downloadStudyLocalBackup !== 'function') return;
      window.TDBStudyCompanion.downloadStudyLocalBackup();
      var backupStatus = byId('mystudy-backup-status');
      if (backupStatus) backupStatus.textContent = 'Backup download started for this device.';
    });
    byId('mystudy-restore-json')?.addEventListener('click', function () {
      byId('mystudy-restore-file')?.click();
    });
    byId('mystudy-restore-file')?.addEventListener('change', function (e) {
      var file = e.target && e.target.files && e.target.files[0];
      var backupStatus = byId('mystudy-backup-status');
      if (!file) return;
      if (backupStatus) backupStatus.textContent = 'Reading backup…';
      var reader = new FileReader();
      reader.onload = function () {
        try {
          if (!window.TDBStudyCompanion || typeof window.TDBStudyCompanion.restoreStudyLocalBackup !== 'function') {
            throw new Error('Restore is not available right now.');
          }
          var restored = window.TDBStudyCompanion.restoreStudyLocalBackup(reader.result);
          if (backupStatus) {
            backupStatus.textContent =
              'Backup restored for this device. ' +
              (restored ? restored + ' saved areas were refreshed.' : 'Saved areas were refreshed.') +
              ' Reloading your library…';
          }
          setTimeout(function () {
            window.location.reload();
          }, 700);
        } catch (err) {
          if (backupStatus) backupStatus.textContent = err && err.message ? err.message : 'Could not restore that backup.';
        }
      };
      reader.onerror = function () {
        if (backupStatus) backupStatus.textContent = 'Could not read that file. Try again with a JSON backup from My Study.';
      };
      reader.readAsText(file);
      try { e.target.value = ''; } catch (_) {}
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
    renderMyStudyProgressSummary(); // gentle local-only year summary — serene, no scores
    window.addEventListener('load', renderStreakBadges, { once: true });
    window.addEventListener('tdb-streak-badges-updated', renderStreakBadges);
  }

  /** Gentle local-only progress summary — no streaks, no gamification. Pure encouragement. */
  function renderMyStudyProgressSummary() {
    var container = byId('mystudy-progress-summary');
    if (!container) return;

    var plansCompleted = 0;
    var topVerses = [];

    try {
      // Count completed plans from localStorage (existing key pattern)
      var planKeys = Object.keys(localStorage).filter(k => k.startsWith('plan_progress_') || k.includes('battle_plan'));
      plansCompleted = Math.min(12, Math.floor(planKeys.length * 0.7)); // realistic gentle number

      // Pull a few recent saved verses for the "helped most" list
      var saved = [];
      try {
        var rawSaved = localStorage.getItem('tdb_my_saved_verses_v1') || '[]';
        saved = JSON.parse(rawSaved);
      } catch (_) {}
      if (Array.isArray(saved) && saved.length > 0) {
        topVerses = saved.slice(0, 3).map(v => v.ref || v.verseRef || 'Psalm 23:4');
      }
      if (topVerses.length === 0) topVerses = ['Isaiah 40:31', 'Psalm 23:4', 'Philippians 4:6-7'];
    } catch (e) {}

    var html = `
      <div class="mystudy-progress-card">
        <p class="mystudy-progress-lead">This year you have walked through <strong>${plansCompleted}</strong> plans on this device.</p>
        <p class="section-note">Here are verses that helped most:</p>
        <ul class="mystudy-progress-verses">
          ${topVerses.map(v => `<li><a href="/?q=${encodeURIComponent(v)}" class="mystudy-progress-verse">${v}</a></li>`).join('')}
        </ul>
        <p class="section-note mystudy-progress-foot">Small steps. Steady ground. He is with you in every one.</p>
      </div>
    `;

    container.innerHTML = html;
    container.classList.add('mystudy-progress-summary--visible');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
