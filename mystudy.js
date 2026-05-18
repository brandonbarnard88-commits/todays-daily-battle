(function () {
  'use strict';

  var STUDY_KEY = 'tdb_my_study_v1';
  var SHARED_KEY = 'tdb_shared_studies_v1';
  var PREFIX = 'TDBMS1-';
  var STREAK_LS_KEY = 'dailyBattleStreak';
  var MEM_LS_KEY = 'tdb_memorize_lite_v1';
  var META_LS_KEY = 'tdb_study_notes_meta_v1';
  var BACKUP_LAST_MS_KEY = 'tdb_mystudy_last_backup_ms';
  var BACKUP_SNOOZE_UNTIL_KEY = 'tdb_mystudy_backup_snooze_until_ms';
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
      if (hash === '#panel-my-study') return 'my';
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
        'Nothing here yet—that is all right. When a verse touches your heart, add it from Memorize or the Bible Tool—reviews stay on this device. The Lord meets you right where you are.';
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

  function isoDay(d) {
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return y + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }

  function collectActiveDaysSet() {
    var set = {};
    function addFromIso(iso) {
      if (!iso || typeof iso !== 'string') return;
      var slice = iso.slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(slice)) set[slice] = true;
    }
    try {
      var st = JSON.parse(localStorage.getItem(STREAK_LS_KEY) || '{}');
      var dates = Array.isArray(st.dates) ? st.dates : [];
      var i;
      for (i = 0; i < dates.length; i++) addFromIso(dates[i]);
    } catch (e) {}
    try {
      var mem = JSON.parse(localStorage.getItem(MEM_LS_KEY) || '{}');
      var refs = mem && mem.refs ? mem.refs : {};
      var k;
      for (k in refs) {
        if (!refs.hasOwnProperty(k)) continue;
        var lr = refs[k] && refs[k].lastReviewed;
        if (lr) addFromIso(lr);
      }
    } catch (e2) {}
    try {
      var meta = JSON.parse(localStorage.getItem(META_LS_KEY) || '{}');
      var ref;
      for (ref in meta) {
        if (!meta.hasOwnProperty(ref)) continue;
        var u = meta[ref] && meta[ref].updated;
        if (u) addFromIso(u);
      }
    } catch (e3) {}
    try {
      var vis = JSON.parse(localStorage.getItem('tdb_quiet_visit_days_v1') || '[]');
      var vi;
      if (Array.isArray(vis)) {
        for (vi = 0; vi < vis.length; vi++) addFromIso(vis[vi]);
      }
    } catch (e4) {}
    return set;
  }

  function renderActivityCalendar() {
    var section = byId('mystudy-activity-calendar');
    var grid = byId('mystudy-activity-cal-grid');
    if (!section || !grid) return;
    clearNode(grid);
    var prevFoot = section.querySelector('.mystudy-cal-foot');
    if (prevFoot) prevFoot.remove();
    var now = new Date();
    var y = now.getFullYear();
    var mo = now.getMonth();
    var active = collectActiveDaysSet();
    var monthKeys = Object.keys(active).filter(function (k) {
      return k.slice(0, 7) === y + '-' + (mo + 1 < 10 ? '0' : '') + (mo + 1);
    });
    section.removeAttribute('hidden');
    var weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var row = document.createElement('div');
    row.className = 'mystudy-cal-row mystudy-cal-row--head';
    var c;
    for (c = 0; c < 7; c++) {
      var h = document.createElement('div');
      h.className = 'mystudy-cal-cell mystudy-cal-cell--head';
      h.textContent = weekdays[c];
      row.appendChild(h);
    }
    grid.appendChild(row);
    var first = new Date(y, mo, 1);
    var startPad = (first.getDay() + 6) % 7;
    var daysInMonth = new Date(y, mo + 1, 0).getDate();
    var cells = [];
    var i;
    for (i = 0; i < startPad; i++) {
      cells.push(null);
    }
    for (i = 1; i <= daysInMonth; i++) {
      cells.push(i);
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    var r;
    for (r = 0; r < cells.length / 7; r++) {
      var prow = document.createElement('div');
      prow.className = 'mystudy-cal-row';
      var col;
      for (col = 0; col < 7; col++) {
        var dayNum = cells[r * 7 + col];
        var cell = document.createElement('div');
        cell.className = 'mystudy-cal-cell';
        if (dayNum == null) {
          cell.classList.add('mystudy-cal-cell--empty');
        } else {
          var key = y + '-' + (mo + 1 < 10 ? '0' : '') + (mo + 1) + '-' + (dayNum < 10 ? '0' : '') + dayNum;
          cell.textContent = String(dayNum);
          if (active[key]) cell.classList.add('mystudy-cal-cell--active');
          if (key === isoDay(now)) cell.classList.add('mystudy-cal-cell--today');
        }
        prow.appendChild(cell);
      }
      grid.appendChild(prow);
    }
    var note = document.createElement('p');
    note.className = 'section-note mystudy-cal-foot';
    note.textContent =
      monthKeys.length === 0
        ? 'No marks this month yet — that is okay. When you pray through a day on Home, refresh a verse note, or review memorize, gentle dots can appear here.'
        : monthKeys.length +
          ' day' +
          (monthKeys.length === 1 ? '' : 's') +
          ' with a quiet touch this month. Download JSON backup anytime in Saved & notes.';
    section.appendChild(note);
  }

  function userHasStudyWorthBacking() {
    var comp = window.TDBStudyCompanion;
    if (comp && typeof comp.getDashboardStats === 'function') {
      var s = comp.getDashboardStats();
      if (s.versesWithNotes > 0 || s.memorizeVerses > 0 || s.readingPlanCheckmarks > 0 || s.chaptersVisitedThisMonth > 0) {
        return true;
      }
    }
    try {
      var st = loadStudy();
      if ((st.notes && String(st.notes).trim()) || (st.prayer && String(st.prayer).trim()) || (st.verseRef && String(st.verseRef).trim())) {
        return true;
      }
    } catch (e) {}
    try {
      var raw = localStorage.getItem('tdb_my_saved_verses_v1');
      var arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr) && arr.length > 0) return true;
    } catch (e2) {}
    return Object.keys(collectActiveDaysSet()).length > 0;
  }

  function maybeRenderBackupNudge() {
    var el = byId('mystudy-backup-nudge');
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
    if (!userHasStudyWorthBacking()) return;
    var snoozeUntil = 0;
    var lastMs = 0;
    try {
      snoozeUntil = parseInt(localStorage.getItem(BACKUP_SNOOZE_UNTIL_KEY) || '0', 10) || 0;
      lastMs = parseInt(localStorage.getItem(BACKUP_LAST_MS_KEY) || '0', 10) || 0;
    } catch (e) {}
    var now = Date.now();
    if (now < snoozeUntil) return;
    var stale = !lastMs || now - lastMs > 14 * 86400000;
    if (!stale) return;
    el.classList.remove('hidden');
    var p = document.createElement('p');
    p.className = 'mystudy-backup-nudge-copy';
    p.appendChild(
      document.createTextNode(
        'Your notes and verses matter. If you have not downloaded a JSON backup in about two weeks, one tap in Saved & notes keeps a copy you can restore later.'
      )
    );
    var go = document.createElement('button');
    go.type = 'button';
    go.className = 'btn btn-secondary mystudy-backup-nudge-btn';
    go.textContent = 'Open backup buttons';
    go.addEventListener('click', function () {
      setTab('library');
    });
    var sn = document.createElement('button');
    sn.type = 'button';
    sn.className = 'btn btn-secondary mystudy-backup-nudge-btn';
    sn.textContent = 'Remind me in a week';
    sn.addEventListener('click', function () {
      try {
        localStorage.setItem(BACKUP_SNOOZE_UNTIL_KEY, String(Date.now() + 7 * 86400000));
      } catch (e2) {}
      el.classList.add('hidden');
    });
    el.appendChild(p);
    el.appendChild(go);
    el.appendChild(sn);
  }

  function recordBackupExported() {
    try {
      localStorage.setItem(BACKUP_LAST_MS_KEY, String(Date.now()));
    } catch (e) {}
    maybeRenderBackupNudge();
  }

  function renderProgressSummary() {
    var el = byId('mystudy-progress-summary');
    if (!el) return;
    el.textContent = '';
    var comp = window.TDBStudyCompanion;
    if (!comp || typeof comp.getDashboardStats !== 'function') {
      var err = document.createElement('p');
      err.className = 'mystudy-progress-summary-line';
      err.textContent = 'Study tools did not load—that happens. Refresh the page when you can.';
      el.appendChild(err);
      renderStreakBadges();
      renderActivityCalendar();
      maybeRenderBackupNudge();
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
      renderActivityCalendar();
      maybeRenderBackupNudge();
      return;
    }
    lines.forEach(function (line) {
      var lineEl = document.createElement('p');
      lineEl.className = 'mystudy-progress-summary-line';
      lineEl.textContent = line;
      el.appendChild(lineEl);
    });
    renderStreakBadges();
    renderActivityCalendar();
    maybeRenderBackupNudge();
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
      empty.appendChild(document.createTextNode('Nothing here yet—that is all right. When a verse touches your heart, look it up in the '));
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

  var _noteLibraryInitialized = false;
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
          'Nothing here yet for that filter—that is all right. Clear the box or tap All to widen the list. The Lord meets you right where you are.';
      } else {
        var emptyP = document.createElement('p');
        emptyP.className = 'section-note mystudy-empty-hint';
        emptyP.appendChild(document.createTextNode('Nothing here yet—that is all right. When a verse touches your heart, save a verse study or add your own thoughts in the '));
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
        empty.appendChild(document.createTextNode('Nothing here yet—that is all right. When you are ready, open any chapter in the '));
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
    if (!_noteLibraryInitialized) {
      _noteLibraryInitialized = true;
      setTab(getRequestedTab());
    }
    updateMemorizePill();
  }

  function renderSelectedVerse(study) {
    var refEl = byId('mystudy-verse-ref');
    var textEl = byId('mystudy-verse-text');
    if (!refEl || !textEl) return;
    refEl.textContent =
      study.verseRef ||
      'No entries yet. That\'s fine. The desk is still yours.';
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
        '<p class="section-note mystudy-empty-hint">Nothing here yet—that is all right. When a verse touches your heart, paste a code someone sent you—or generate one after you pick a verse. The Lord meets you right where you are.</p>';
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
      if (status) status.textContent = 'Bible search did not load—that is all right. Try again when you are online.';
      return false;
    }
  }

  function renderResults(results, study, handlers) {
    var listEl = byId('mystudy-results');
    if (!listEl) return;
    listEl.innerHTML = '';
    if (!results.length) {
      listEl.innerHTML = '<li class="section-note">Nothing here yet—that is all right. When a verse touches your heart, try a broader keyword or an exact reference. The Lord meets you right where you are.</li>';
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

    // ── Export Progress & Notes ───────────────────────────────────────────────
    var PLAN_LABEL_MAP = {
      'battle': 'Battle Distraction (7 days)',
      'gratitude': 'Gratitude (7 days)',
      'simplethanks': 'Simple Thanks — Seven Gentle Days (7 days)',
      'steadydays': 'Steady Days — Five Gentle Steps (5 days)',
      'steadydays-kids': 'Steady Days for Families (5 days)',
      giftsfromabove: 'Gifts from the Father of Lights (5 days)',
      'strength': '30-Day Strength',
      'marriage': 'Marriage (7 days)',
      'peace': '7-Day Peace',
      'trust': 'Worry to Trust (7 days)',
      'universitywaiting': 'The University of Waiting (6 days)',
      'universitygrief': 'The University of Grief (6 days)',
      'universityparenting': 'The University of Parenting Young Kids (21 days)',
      'universitysecretprayer': 'The University of Secret Prayer (6 days)',
      'universityanxiety': 'The University of Anxiety & Fear (7 days)',
      'universityexhaustion': 'The University of Exhaustion (21 days)',
      'universitygratitude': 'The University of Gratitude (6 days)',
      'universityloneliness': 'The University of Loneliness (21 days)',
      'universityforgiveness': 'The University of Forgiveness (6 days)',
      'universitydoubt': 'The University of Doubt (6 days)',
      'universitybitterness': 'The University of Bitterness (6 days)',
      'eveninguog': 'Evening in the University — Family (4 days)',
      'universitybroken': 'The University of Broken Relationships (21 days)',
      'universitycomparison': 'The University of Comparison & Contentment (6 days)',
      'universityanger': 'The University of Anger (6 days)',
      'universityregret': 'The University of Regret (21 days)',
      'universityoverwhelm': 'The University of Overwhelm (21 days)',
      'universitycontentment': 'The University of Contentment in Small Seasons (6 days)',
      'universityparentfear': 'The University of Fear for My Children (28 days)',
      'fearfaith': 'Fear to Faith (7 days)',
      'worrytrust': 'Worry to Trust (7 days)',
      'psalmscomfort': 'Psalms of Comfort (7 days)',
      'heavyhope': 'The University of Depression & Hopelessness (7 days)',
      'heartalone': 'When the Heart Feels Alone (7 days)',
      'littlehearts': 'When Little Hearts Feel Big Fear (7 days)',
      'restlessnights': 'Peace for Restless Nights (7 days)',
      'wearyhands': 'Grace for Weary Hands (7 days)',
      'longheavydays': 'When the Days Feel Long and Heavy (7 days)',
      'preachingthroughexhaustion': 'Preaching Through Exhaustion (7 days)',
      'smallchurchencouragement': 'Small Church Encouragement (7 days)',
      'hopeuncertain': 'Hope in Uncertainty (7 days)',
      'moneyworry': 'Financial Stress & Provision (7 days)',
      'addictionhope': 'Addiction & Strongholds (7 days)',
      'guiltshame': 'Guilt & Shame (7 days)',
      'overwhelmedburnout': 'Overwhelmed / Burnout (7 days)',
      'selfworth': 'Self-Worth / Identity (7 days)',
      'caregiverrest': 'Caregiver Rest (7 days)',
      'familyworship': 'Family Worship in the Trenches (7 days)',
      'psalmscomfortfamily': 'Psalms of Comfort — Family Edition (7 days)',
      'galatiansfreedom': 'Galatians: Freedom in Christ (7 days)',
      'gospeljohn': 'Gospel of John Sampler (7 days)',
      'firststeps': 'New Believer — First Steps (14 days)',
      'griefhope': 'Grief → Hope (7 days)',
      'grief': 'Healing from Grief & Loss (7 days)',
      'painwontquit': 'When Pain Won\'t Quit (7 days)',
      'cancercomfort': 'Cancer Comfort (7 days)',
      'longillness': 'Long Illness — Steady Mercies (7 days)',
      'sufferendure': 'Suffering & Endurance (7 days)',
      'anxiety7': 'Anxiety — Steady Peace (7 days)',
      'fearnot14': 'Fear Not — 14 Days',
      'anger': 'Anger Release (7 days)',
      'forgiveness': 'Forgiveness (7 days)',
      'lettinggo': 'Bitterness & Letting Go (7 days)',
      'dailylabor': 'Work & Daily Labor (7 days)',
      'stewardship': 'Stewardship — Contentment & Giving (7 days)',
      'identityinchrist': 'Who God Says You Are (7 days)',
      'armorofgod': 'Armor of God — Daily Battle (7 days)',
      'standfirm': 'Stand Firm — Temptation (7 days)',
      'holyspirit': 'Holy Spirit — Comforter & Walk (7 days)',
      'walktheword': 'Walk the Word — Hear & Do (7 days)',
      'sower': 'Parable of the Sower (7 days)',
      'greatcommission': 'Great Commission — Witness (7 days)',
      'adventquiet': 'Advent Quiet (7 days)',
      'christmas7': 'Christmas Week — Christ the Light (7 days)',
      'newyear7': 'New Year Week (7 days)',
      'gentleyear': 'Gentle New Year Reset (7 days)',
      'easter': 'Resurrection Hope (7 days)',
      'aftereaster': 'After Easter — Quiet Mondays (7 days)',
      'schoolcourage': 'Back-to-School Courage (7 days)',
      'harvestthanks': 'Harvest Gratitude (7 days)',
      'summerstill': 'Summer Stillness (7 days)',
      'summertimesadness': 'Summertime Sadness (7 days)',
      'summergrief': 'When Grief Feels Heavy in Summer (7 days)',
      'backtoschoolfear': 'Back-to-School Fear (7 days)',
      'longdayslittle': 'Long Days with Little Ones (7 days)',
      'praisethanks30': '30-Day Praise & Thanksgiving',
      'dailyrenewing': 'Daily Renewing of the Inner Man (7 days)',
      'quietfallharvest': 'Quiet Fall Harvest (5 days)',
      'latefallwinter': 'Late Fall, Quiet Winter (7 days)',
      'parenting': 'Parenting (7 days)',
      'reading': '7-Day Reading Plan',
      'doubtassurance': 'From Doubt to Assurance (7 days)',
      'latesummerrest': 'Late Summer, Early Rest (5 days)',
      'beatitudeskids': 'Beatitudes for Kids (8 days)'
    };

    function getPlanLabelFromKey(lsKey) {
      var m = String(lsKey || '').match(/^tdb-plan-(.+)-day$/);
      if (!m) {
        if (lsKey === 'tdb-plan-day') return PLAN_LABEL_MAP['battle'] || 'Battle Distraction (7 days)';
        return null;
      }
      var planId = m[1];
      return PLAN_LABEL_MAP[planId] || ('Plan: ' + planId);
    }

    function gatherPlanProgress() {
      var plans = [];
      try {
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && (k === 'tdb-plan-day' || /^tdb-plan-.+-day$/.test(k))) {
            keys.push(k);
          }
        }
        keys.sort();
        keys.forEach(function (k) {
          var day = parseInt(localStorage.getItem(k) || '0', 10);
          if (day <= 0) return;
          var label = getPlanLabelFromKey(k);
          if (!label) return;
          plans.push({ label: label, day: day, key: k });
        });
      } catch (e) {}
      return plans;
    }

    function gatherSavedVerses() {
      try {
        var arr = JSON.parse(localStorage.getItem('savedVerses') || '[]');
        return Array.isArray(arr) ? arr : [];
      } catch (e) { return []; }
    }

    function gatherStudyNotes() {
      try {
        var s = JSON.parse(localStorage.getItem(STUDY_KEY) || 'null');
        if (!s || typeof s !== 'object') return null;
        return {
          verseRef: String(s.verseRef || '').trim(),
          verseText: String(s.verseText || '').trim(),
          notes: String(s.notes || '').trim(),
          prayer: String(s.prayer || '').trim()
        };
      } catch (e) { return null; }
    }

    function gatherBattleLog() {
      try {
        var raw = localStorage.getItem('tdb_bible_tool_notes');
        if (!raw) return '';
        var obj = JSON.parse(raw);
        if (obj && typeof obj === 'object' && obj['Battle log']) return String(obj['Battle log']).trim();
      } catch (e) {}
      return '';
    }

    function gatherDailyMoodNotes() {
      try {
        var arr = JSON.parse(localStorage.getItem('tdb_daily_mood_notes_v1') || '[]');
        return Array.isArray(arr) ? arr.filter(function (n) { return n && (n.note || n.text); }) : [];
      } catch (e) { return []; }
    }

    function buildExportHtml(plans, savedVerses, studyNotes, battleLog, moodNotes) {
      var now = new Date();
      var dateStr = now.toISOString().split('T')[0];
      var dateLong = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      var totalDays = plans.reduce(function (sum, p) { return sum + p.day; }, 0);
      var completedPlans = plans.filter(function (p) {
        return p.day > 0;
      });

      var html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '<title>My Progress &amp; Notes \u2014 Today\u2019s Daily Battle \u2014 ' + escapeHtml(dateStr) + '</title>\n' +
        '<style>\n' +
        '  :root { --gold: #c9a84c; --gold-soft: #e8c97a; --porch: #f9f5ec; --ink: #1e1a14; --muted: #6b5e4a; --rule: #d4c9b0; }\n' +
        '  * { box-sizing: border-box; }\n' +
        '  body { font-family: Georgia, "Times New Roman", serif; background: var(--porch); color: var(--ink); max-width: 780px; margin: 0 auto; padding: 2.5rem 1.5rem 4rem; line-height: 1.7; }\n' +
        '  h1 { font-family: "Playfair Display", Georgia, serif; font-size: 2rem; color: var(--ink); margin: 0 0 0.25rem; }\n' +
        '  h2 { font-family: Georgia, serif; font-size: 1.2rem; color: var(--muted); font-weight: 600; border-bottom: 1px solid var(--rule); padding-bottom: 0.3rem; margin: 2rem 0 0.75rem; }\n' +
        '  h3 { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.2rem; color: var(--ink); }\n' +
        '  .porch-header { border-bottom: 2px solid var(--gold); padding-bottom: 1.25rem; margin-bottom: 2rem; }\n' +
        '  .dateline { font-size: 0.9rem; color: var(--muted); margin: 0 0 0.75rem; }\n' +
        '  .summary-banner { background: #fffcf4; border-left: 4px solid var(--gold); padding: 0.75rem 1rem; border-radius: 0 6px 6px 0; margin-bottom: 1.5rem; font-size: 0.95rem; }\n' +
        '  .summary-banner strong { color: var(--ink); }\n' +
        '  .plan-row { display: flex; align-items: baseline; gap: 0.5rem; padding: 0.45rem 0; border-bottom: 1px solid var(--rule); }\n' +
        '  .plan-row:last-child { border-bottom: none; }\n' +
        '  .plan-label { flex: 1; font-size: 0.9rem; }\n' +
        '  .plan-day { font-size: 0.85rem; color: var(--muted); white-space: nowrap; }\n' +
        '  .plan-done { color: #2a7a3a; font-weight: 700; font-size: 0.78rem; }\n' +
        '  .verse-card { border: 1px solid var(--rule); border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 0.85rem; background: #fff; }\n' +
        '  .verse-ref { font-weight: 700; font-size: 0.95rem; margin: 0 0 0.3rem; }\n' +
        '  .verse-text { font-style: italic; font-size: 0.9rem; color: var(--ink); margin: 0 0 0.3rem; }\n' +
        '  .verse-note { font-size: 0.82rem; color: var(--muted); margin: 0; }\n' +
        '  .study-block { background: #fff; border: 1px solid var(--rule); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }\n' +
        '  .study-ref { font-weight: 700; font-size: 1rem; margin: 0 0 0.4rem; }\n' +
        '  .study-verse { font-style: italic; font-size: 0.9rem; margin: 0 0 0.6rem; color: var(--muted); }\n' +
        '  .study-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin: 0.5rem 0 0.15rem; }\n' +
        '  .study-text { font-size: 0.9rem; white-space: pre-wrap; margin: 0; }\n' +
        '  .mood-note { font-size: 0.85rem; padding: 0.4rem 0; border-bottom: 1px solid var(--rule); }\n' +
        '  .mood-note:last-child { border-bottom: none; }\n' +
        '  .mood-date { font-size: 0.75rem; color: var(--muted); }\n' +
        '  .empty-note { font-size: 0.88rem; color: var(--muted); font-style: italic; }\n' +
        '  .footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid var(--rule); font-size: 0.8rem; color: var(--muted); text-align: center; }\n' +
        '  @media print { body { max-width: 100%; padding: 1rem; } .no-print { display: none; } }\n' +
        '</style>\n</head>\n<body>\n';

      // Header
      html += '<div class="porch-header">\n';
      html += '  <h1>My Progress &amp; Notes</h1>\n';
      html += '  <p class="dateline">Today\u2019s Daily Battle \u2014 Exported ' + escapeHtml(dateLong) + '</p>\n';

      // Summary banner
      html += '  <div class="summary-banner">\n';
      html += '    <strong>' + totalDays + ' plan day' + (totalDays !== 1 ? 's' : '') + ' recorded</strong>';
      if (plans.length) html += ' across <strong>' + plans.length + ' plan' + (plans.length !== 1 ? 's' : '') + '</strong>';
      if (savedVerses.length) html += ' &nbsp;\u00b7&nbsp; <strong>' + savedVerses.length + ' saved verse' + (savedVerses.length !== 1 ? 's' : '') + '</strong>';
      var hasNotes = studyNotes && (studyNotes.notes || studyNotes.prayer);
      if (hasNotes) html += ' &nbsp;\u00b7&nbsp; study notes included';
      html += '\n  </div>\n';
      html += '</div>\n';

      // Battle Plans section
      html += '<h2>Battle Plan Progress</h2>\n';
      if (plans.length === 0) {
        html += '<p class="empty-note">No plan days recorded yet on this device. The porch is always open when you\u2019re ready.</p>\n';
      } else {
        html += '<div>\n';
        plans.forEach(function (p) {
          var dayLine = 'Day ' + p.day + ' reached';
          html += '  <div class="plan-row">';
          html += '<span class="plan-label">' + escapeHtml(p.label) + '</span>';
          html += '<span class="plan-day">' + escapeHtml(dayLine) + '</span>';
          html += '</div>\n';
        });
        html += '</div>\n';
      }

      // Saved Verses section
      html += '<h2>Saved Verses</h2>\n';
      if (savedVerses.length === 0) {
        html += '<p class="empty-note">No saved verses yet. Save any verse from Home, the Bible Tool, or a Battle Plan day.</p>\n';
      } else {
        savedVerses.forEach(function (v) {
          html += '<div class="verse-card">\n';
          html += '  <p class="verse-ref">' + escapeHtml(v.ref || '') + '</p>\n';
          if (v.text) html += '  <p class="verse-text">' + escapeHtml(v.text) + '</p>\n';
          if (v.note) html += '  <p class="verse-note"><strong>Note:</strong> ' + escapeHtml(v.note) + '</p>\n';
          if (v.date) html += '  <p class="verse-note"><em>Saved: ' + escapeHtml(v.date) + '</em></p>\n';
          html += '</div>\n';
        });
      }

      // My Study Notes section
      if (studyNotes && (studyNotes.verseRef || studyNotes.notes || studyNotes.prayer)) {
        html += '<h2>My Study Notes</h2>\n';
        html += '<div class="study-block">\n';
        if (studyNotes.verseRef) {
          html += '  <p class="study-ref">' + escapeHtml(studyNotes.verseRef) + '</p>\n';
          if (studyNotes.verseText) html += '  <p class="study-verse">' + escapeHtml(studyNotes.verseText) + '</p>\n';
        }
        if (studyNotes.notes) {
          html += '  <p class="study-label">Study notes</p>\n';
          html += '  <p class="study-text">' + escapeHtml(studyNotes.notes) + '</p>\n';
        }
        html += '</div>\n';
      }

      // Battle Log section
      if (battleLog) {
        html += '<h2>Bible Tool — Battle Log</h2>\n';
        html += '<div class="study-block"><p class="study-text">' + escapeHtml(battleLog) + '</p></div>\n';
      }

      // Daily mood notes
      if (moodNotes.length > 0) {
        html += '<h2>Daily Reflections</h2>\n';
        html += '<div class="study-block">\n';
        moodNotes.slice(0, 50).forEach(function (n) {
          var text = String(n.note || n.text || '').trim();
          var date = String(n.date || n.ts || '').trim();
          if (!text) return;
          html += '  <div class="mood-note">';
          html += escapeHtml(text);
          if (date) html += ' <span class="mood-date">— ' + escapeHtml(date) + '</span>';
          html += '</div>\n';
        });
        html += '</div>\n';
      }

      // Footer
      html += '<div class="footer">\n';
      html += '  Generated from <strong>todaysdailybattle.com</strong> &mdash; KJV-only &middot; No ads &middot; No account required<br>\n';
      html += '  All your data stays on your device &mdash; completely private. Nothing was sent anywhere to make this file.\n';
      html += '</div>\n';
      html += '</body>\n</html>';
      return html;
    }

    function exportProgressAndNotes() {
      var statusEl = byId('mystudy-export-status');
      var btn = byId('mystudy-export-progress');
      if (btn) { btn.disabled = true; btn.textContent = 'Building your file\u2026'; }
      try {
        var plans = gatherPlanProgress();
        var savedVerses = gatherSavedVerses();
        var studyNotes = gatherStudyNotes();
        var battleLog = gatherBattleLog();
        var moodNotes = gatherDailyMoodNotes();
        var html = buildExportHtml(plans, savedVerses, studyNotes, battleLog, moodNotes);
        var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var now = new Date();
        var dateStr = now.toISOString().split('T')[0];
        var a = document.createElement('a');
        a.href = url;
        a.download = 'TDB_Progress_' + dateStr + '.html';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 1000);
        if (statusEl) {
          var totalDays = plans.reduce(function (s, p) { return s + p.day; }, 0);
          statusEl.textContent = 'File downloaded \u2014 ' + totalDays + ' plan day' + (totalDays !== 1 ? 's' : '') + ' and ' + savedVerses.length + ' saved verse' + (savedVerses.length !== 1 ? 's' : '') + ' included. Open the file in any browser to read or print it.';
        }
      } catch (err) {
        if (statusEl) statusEl.textContent = 'Something went wrong building the file. Your data is still safe on this device \u2014 try again or use Download JSON backup.';
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Export my progress \u0026 notes (HTML)'; }
      }
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
    byId('mystudy-export-progress')?.addEventListener('click', function () {
      exportProgressAndNotes();
    });

    byId('mystudy-export-json')?.addEventListener('click', function () {
      if (!window.TDBStudyCompanion || typeof window.TDBStudyCompanion.downloadStudyLocalBackup !== 'function') return;
      window.TDBStudyCompanion.downloadStudyLocalBackup();
      recordBackupExported();
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
            throw new Error('Restore is not open from here yet—that is all right. Reload and try again.');
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
          if (backupStatus) backupStatus.textContent = err && err.message ? err.message : 'That backup did not restore—that is all right. Check the file or try another export.';
        }
      };
      reader.onerror = function () {
        if (backupStatus) backupStatus.textContent = 'That file did not read—that is all right. Try again with a JSON backup from My Study.';
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

    window.addEventListener('hashchange', function () {
      var h = String(window.location.hash || '').trim().toLowerCase();
      if (h === '#saved-verses' || h === '#panel-note-library') setTab('library');
      else if (h === '#panel-highlights') setTab('highlights');
      else if (h === '#panel-join-study') setTab('join');
      else if (h === '#panel-my-study') setTab('my');
    });

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
          if (shareStatusEl) shareStatusEl.textContent = 'Copy did not go through—that is all right. Select and copy manually.';
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
    window.addEventListener('load', renderStreakBadges, { once: true });
    window.addEventListener('tdb-streak-badges-updated', renderStreakBadges);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
