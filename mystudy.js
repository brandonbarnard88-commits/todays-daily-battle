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

  function openRhythmDrawerForHash() {
    var h = String(window.location.hash || '').trim().toLowerCase();
    var rhythmHashes = {
      '#mystudy-rhythm-drawer': true,
      '#mystudy-quiet-steps': true,
      '#mystudy-plan-reflections': true,
      '#mystudy-progress-summary': true,
      '#mystudy-activity-calendar': true,
      '#mystudy-streak-badges': true,
      '#mystudy-faith-loop': true,
      '#mystudy-plans-walking': true,
      '#mystudy-plans-finished': true,
      '#mystudy-progress-tools': true
    };
    if (!rhythmHashes[h]) return;
    var drawer = byId('mystudy-rhythm-drawer');
    if (drawer) drawer.open = true;
    if (h === '#mystudy-progress-tools') {
      var tools = byId('mystudy-progress-tools');
      if (tools) tools.open = true;
    }
  }

  function getRequestedTab() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      var requested = String(params.get('tab') || '').trim().toLowerCase();
      if (requested === 'library' || requested === 'highlights' || requested === 'join' || requested === 'my') {
        return requested;
      }
      var hash = String(window.location.hash || '').trim().toLowerCase();
      if (hash === '#saved-verses' || hash === '#panel-note-library' || hash === '#mystudy-ribbon-journal') return 'library';
      if (hash === '#panel-highlights') return 'highlights';
      if (hash === '#panel-join-study') return 'join';
      if (hash === '#panel-my-study') return 'my';
    } catch (e) {}
    /* MS2: returning visitors with saves land on the shelf, not an empty desk. */
    if (userHasSavedShelf()) return 'library';
    return 'my';
  }

  function userHasSavedShelf() {
    try {
      var items = JSON.parse(localStorage.getItem('savedCollectionItems') || '[]');
      if (Array.isArray(items) && items.length > 0) return true;
    } catch (e1) { /* non-fatal */ }
    try {
      var legacy = JSON.parse(localStorage.getItem('savedVerses') || '[]');
      if (Array.isArray(legacy) && legacy.length > 0) return true;
    } catch (e2) { /* non-fatal */ }
    return false;
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
    if (isLib) {
      renderNoteLibrary();
      if (typeof window.tdbEnsureMystudyRibbonScripts === 'function') {
        window.tdbEnsureMystudyRibbonScripts();
      }
      if (typeof window.tdbRenderMystudySavedShelf === 'function') {
        window.tdbRenderMystudySavedShelf();
      }
    }
    updateMemorizePill();
    syncMobileJumpActive(tabName);
  }

  function syncMobileJumpActive(tabName) {
    var nav = byId('mystudyMobileJump');
    if (!nav) return;
    nav.querySelectorAll('[data-mystudy-jump]').forEach(function (el) {
      var jump = el.getAttribute('data-mystudy-jump');
      var on = jump === tabName || (jump === 'library' && tabName === 'library');
      el.classList.toggle('is-active', !!on);
      if (on) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
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

  function isoDayFromOffset(off) {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + off);
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function renderQuietSteps() {
    var grid = byId('mystudy-quiet-steps-grid');
    var empty = byId('mystudy-quiet-steps-empty');
    if (!grid) return;
    var set = new Set();
    try {
      var raw = localStorage.getItem(STREAK_LS_KEY);
      var data = raw ? JSON.parse(raw) : {};
      if (data && Array.isArray(data.dates)) {
        data.dates.forEach(function (dt) {
          if (typeof dt === 'string') set.add(dt);
        });
      }
    } catch (e) {}
    clearNode(grid);
    var any = false;
    var i;
    for (i = -27; i <= 0; i++) {
      var k = isoDayFromOffset(i);
      var on = set.has(k);
      if (on) any = true;
      var cell = document.createElement('span');
      cell.className = 'mystudy-quiet-steps-cell' + (on ? ' mystudy-quiet-steps-cell--on' : '');
      cell.title = k + (on ? ' — you showed up' : '');
      cell.setAttribute('role', 'img');
      cell.setAttribute('aria-label', k + (on ? ', checked in' : ', quiet'));
      grid.appendChild(cell);
    }
    if (empty) empty.classList.toggle('hidden', any);
  }

  function gatherPlanDayReflections() {
    try {
      var raw = localStorage.getItem('tdb_plan_day_reflections_v1');
      var map = raw ? JSON.parse(raw) : {};
      if (!map || typeof map !== 'object') return [];
      return Object.keys(map)
        .map(function (k) { return map[k]; })
        .filter(function (entry) { return entry && String(entry.text || '').trim(); })
        .sort(function (a, b) {
          return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
        });
    } catch (e) {
      return [];
    }
  }

  function renderPlanReflections() {
    var section = byId('mystudy-plan-reflections');
    var list = byId('mystudy-plan-reflections-list');
    var empty = byId('mystudy-plan-reflections-empty');
    if (!section || !list) return;
    clearNode(list);
    var items = gatherPlanDayReflections();
    if (!items.length) {
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    items.slice(0, 12).forEach(function (entry) {
      var li = document.createElement('li');
      li.className = 'mystudy-plan-reflection-item';
      var meta = document.createElement('p');
      meta.className = 'mystudy-plan-reflection-meta';
      var planId = String(entry.planId || '').trim();
      var dayNum = entry.dayNum || (entry.dayIndex != null ? entry.dayIndex + 1 : '');
      var label = String(entry.planLabel || planId || 'Battle Plan').trim();
      var link = document.createElement('a');
      link.href =
        'plans.html?plan=' +
        encodeURIComponent(planId) +
        (dayNum ? '&day=' + encodeURIComponent(dayNum) : '');
      link.textContent = label + (dayNum ? ' \u2014 Day ' + dayNum : '');
      var text = document.createElement('p');
      text.className = 'mystudy-plan-reflection-text';
      text.textContent = String(entry.text || '').trim();
      meta.appendChild(link);
      li.appendChild(meta);
      li.appendChild(text);
      list.appendChild(li);
    });
  }

  function renderPlanProgressHandoff() {
    var PP = window.TDBPlanProgress;
    var parts = PP && typeof PP.partitionActiveCompleted === 'function'
      ? PP.partitionActiveCompleted()
      : { active: [], completed: [] };
    var active = parts.active || [];
    var completed = parts.completed || [];

    var walkList = byId('mystudy-plans-walking-list');
    var walkEmpty = byId('mystudy-plans-walking-empty');
    if (walkList) {
      clearNode(walkList);
      active.forEach(function (p) {
        var card = document.createElement('div');
        card.className = 'mystudy-plan-card';
        card.setAttribute('role', 'listitem');
        var h = document.createElement('h3');
        h.className = 'mystudy-plan-card__title';
        h.textContent = p.label;
        var meta = document.createElement('p');
        meta.className = 'section-note mystudy-plan-card__meta';
        meta.textContent = 'Day ' + p.day + ' of ' + p.max;
        var barWrap = document.createElement('div');
        barWrap.className = 'mystudy-plan-card__bar';
        var barFill = document.createElement('div');
        barFill.className = 'mystudy-plan-card__bar-fill';
        barFill.style.width = Math.min(100, Math.max(0, p.percent || 0)) + '%';
        barWrap.appendChild(barFill);
        var a = document.createElement('a');
        a.className = 'mystudy-plan-card__continue';
        a.href = 'plans.html?plan=' + encodeURIComponent(p.planId);
        a.textContent = 'Continue \u2192';
        card.appendChild(h);
        card.appendChild(meta);
        card.appendChild(barWrap);
        card.appendChild(a);
        walkList.appendChild(card);
      });
    }
    if (walkEmpty) walkEmpty.classList.toggle('hidden', active.length > 0);
    if (walkList) walkList.hidden = active.length === 0;

    var finList = byId('mystudy-plans-finished-list');
    var finEmpty = byId('mystudy-plans-finished-empty');
    var finSection = byId('mystudy-plans-finished');
    if (finList) {
      clearNode(finList);
      completed.forEach(function (p) {
        var item = document.createElement('div');
        item.className = 'mystudy-plan-finished';
        item.setAttribute('role', 'listitem');
        item.textContent = '\u2713 ' + p.label + ' \u2014 ' + p.max + '/' + p.max;
        finList.appendChild(item);
      });
    }
    if (finEmpty) finEmpty.classList.toggle('hidden', completed.length > 0);
    if (finList) finList.hidden = completed.length === 0;
    if (finSection && completed.length === 0) {
      /* Keep section reachable; empty copy stays visible */
    }

    var floop = byId('mystudy-faith-loop-line');
    if (floop) {
      floop.textContent =
        PP && typeof PP.faithLoopLine === 'function'
          ? PP.faithLoopLine(parts)
          : 'When you are ready for a day-by-day lane, open Plans.';
    }

    var totalDays = 0;
    active.concat(completed).forEach(function (p) {
      totalDays += p.day || 0;
    });
    var elDays = byId('mystudy-stat-days');
    var elStarted = byId('mystudy-stat-started');
    var elFinished = byId('mystudy-stat-finished');
    if (elDays) elDays.textContent = String(totalDays);
    if (elStarted) elStarted.textContent = String(active.length + completed.length);
    if (elFinished) elFinished.textContent = String(completed.length);
  }

  function wireProgressTools() {
    var copyBtn = byId('mystudy-copy-progress-stats');
    var resetBtn = byId('mystudy-reset-plan-progress');
    var status = byId('mystudy-progress-tools-status');
    function setStatus(msg) {
      if (status) status.textContent = msg || '';
    }
    if (copyBtn && !copyBtn._tdbWired) {
      copyBtn._tdbWired = true;
      copyBtn.addEventListener('click', function () {
        var days = (byId('mystudy-stat-days') || {}).textContent || '0';
        var started = (byId('mystudy-stat-started') || {}).textContent || '0';
        var finished = (byId('mystudy-stat-finished') || {}).textContent || '0';
        var text =
          "My Today's Daily Battle progress:\n" +
          'Days marked: ' +
          days +
          '\nPlans started: ' +
          started +
          ' (' +
          finished +
          ' finished)\n\nJoin me at https://todaysdailybattle.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(
            function () {
              setStatus('Copied.');
            },
            function () {
              setStatus('Copy failed. Try again when you can.');
            }
          );
        } else {
          setStatus('Copy not available on this device.');
        }
      });
    }
    if (resetBtn && !resetBtn._tdbWired) {
      resetBtn._tdbWired = true;
      resetBtn.addEventListener('click', function () {
        var ok = window.confirm(
          'Clear plan checkmarks and plan streaks on this device? Quiet steps and saved verses stay.'
        );
        if (!ok) return;
        try {
          var keys = [];
          var i;
          for (i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (
              k &&
              (k.indexOf('tdb-plan') === 0 ||
                k.indexOf('tdb-streak') === 0 ||
                k === 'tdb-longest-streak')
            ) {
              keys.push(k);
            }
          }
          keys.forEach(function (k) {
            localStorage.removeItem(k);
          });
        } catch (e) { /* non-fatal */ }
        setStatus('Plan progress cleared on this device.');
        renderPlanProgressHandoff();
      });
    }
  }

  function renderProgressSummary() {
    var el = byId('mystudy-progress-summary');
    if (!el) return;
    el.textContent = '';
    var comp = window.TDBStudyCompanion;
    renderQuietSteps();
    renderPlanProgressHandoff();
    wireProgressTools();
    if (!comp || typeof comp.getDashboardStats !== 'function') {
      var err = document.createElement('p');
      err.className = 'mystudy-progress-summary-line';
      err.textContent = 'Study tools did not load—that happens. Refresh the page when you can.';
      el.appendChild(err);
      renderStreakBadges();
      renderActivityCalendar();
      maybeRenderBackupNudge();
      renderPlanReflections();
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
      aPl.textContent = 'Plans';
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
      renderPlanReflections();
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
    renderPlanReflections();
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

  function renderRecentlyTagged() {
    /* MS3: recently-tagged relocated into tag filter pills on the main notes list. */
    var el = byId('mystudy-recent-tagged');
    if (el) {
      el.innerHTML = '';
      el.hidden = true;
      el.setAttribute('aria-hidden', 'true');
    }
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
      var openHereBtn = document.createElement('button');
      openHereBtn.type = 'button';
      openHereBtn.className = 'btn btn-secondary mystudy-open-here-btn';
      openHereBtn.textContent = 'Open here';
      openHereBtn.setAttribute('aria-label', 'Open ' + row.ref + ' in My Study workspace');
      openHereBtn.addEventListener('click', function () {
        if (typeof window.tdbOpenVerseInMyStudyWorkspace === 'function') {
          window.tdbOpenVerseInMyStudyWorkspace(row.ref, row.preview || '');
        }
      });
      rowWrap.appendChild(openHereBtn);
      rowWrap.appendChild(createWordStudyButton(row.ref, row.preview || ''));
      rowWrap.appendChild(createBibleToolOpenAnchor(row.ref, 'Bible Tool'));
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
    if (!_noteLibraryInitialized) {
      _noteLibraryInitialized = true;
      setTab(getRequestedTab());
    }
    updateMemorizePill();
    try {
      if (typeof window.TDB_paintContinueSurface === 'function') {
        window.TDB_paintContinueSurface('tdb-continue-surface', { preferChapter: true });
      }
    } catch (_) {}
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
    if (kjvEntries.length >= 1000) return true;
    var status = byId('mystudy-search-status');
    var urls = ['/data/kjv-full.json', '/data/kjv-verses.json', '/kjv.json', '/assets/data/kjv.json'];
    try {
      if (status) status.textContent = 'Loading Bible...';
      var data = null;
      for (var i = 0; i < urls.length; i++) {
        try {
          var res = await fetch(urls[i], { cache: 'force-cache' });
          if (!res.ok) continue;
          var raw = await res.json();
          if (Array.isArray(raw)) {
            data = {};
            raw.forEach(function (row) {
              if (row && row.ref) data[row.ref] = row.text || '';
            });
          } else {
            data = raw;
          }
          if (data && Object.keys(data).length >= 1000) break;
          if (i < urls.length - 1 && (!data || Object.keys(data).length < 1000)) {
            data = null;
            continue;
          }
        } catch (eTry) { /* try next */ }
      }
      if (!data) throw new Error('bible_fetch_failed');
      kjvEntries = Object.keys(data || {}).map(function (ref) {
        var text = String(data[ref] || '');
        return { ref: ref, text: text, refLower: ref.toLowerCase(), textLower: text.toLowerCase() };
      });
      if (status) status.textContent = '';
      return true;
    } catch (e) {
      if (status) status.textContent = 'Bible search did not load. Try again when you are online.';
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

    // ── Export Progress & Notes ───────────────────────────────────────────────
    function gatherPlanProgress() {
      var PP = window.TDBPlanProgress;
      if (PP && typeof PP.gatherForExport === 'function') {
        return PP.gatherForExport();
      }
      return [];
    }


    function gatherSavedVerses() {
      /* Prefer savedCollectionItems (hero / Bible Tool / search saves); merge legacy savedVerses. */
      var out = [];
      var seen = Object.create(null);
      function pushItem(item) {
        if (!item || typeof item !== 'object') return;
        var ref = String(item.ref || '').replace(/\s*\(KJV\)\s*$/i, '').trim();
        if (!ref || seen[ref]) return;
        seen[ref] = true;
        out.push({
          ref: ref,
          text: String(item.text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
          note: String(item.note || '').trim(),
          date: String(item.date || item.created_at || item.savedAt || '').trim()
        });
      }
      try {
        var collectionItems = JSON.parse(localStorage.getItem('savedCollectionItems') || '[]');
        if (Array.isArray(collectionItems)) collectionItems.forEach(pushItem);
      } catch (eCol) { /* non-fatal */ }
      try {
        var legacy = JSON.parse(localStorage.getItem('savedVerses') || '[]');
        if (Array.isArray(legacy)) legacy.forEach(pushItem);
      } catch (eLeg) { /* non-fatal */ }
      return out;
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

    function buildExportHtml(plans, savedVerses, studyNotes, battleLog, moodNotes, planReflections) {
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

      // Plans section
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

      if (planReflections && planReflections.length > 0) {
        html += '<h2>What Stood Out on the Path</h2>\n';
        html += '<div class="study-block">\n';
        planReflections.slice(0, 50).forEach(function (entry) {
          var label = String(entry.planLabel || entry.planId || 'Battle Plan').trim();
          var dayNum = entry.dayNum || (entry.dayIndex != null ? entry.dayIndex + 1 : '');
          var text = String(entry.text || '').trim();
          if (!text) return;
          html += '  <div class="mood-note">';
          html += '<strong>' + escapeHtml(label + (dayNum ? ' — Day ' + dayNum : '')) + '</strong><br>';
          html += escapeHtml(text);
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
        var planReflections = gatherPlanDayReflections();
        var html = buildExportHtml(plans, savedVerses, studyNotes, battleLog, moodNotes, planReflections);
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

    function openVerseInWorkspace(refRaw, textRaw) {
      var ref = String(refRaw || '').replace(/\s*\(KJV\)\s*$/i, '').trim();
      var text = String(textRaw || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (!ref) return false;
      study.verseRef = ref;
      study.verseText = text;
      saveStudy(study);
      if (notesEl) notesEl.value = study.notes || '';
      if (prayerEl) prayerEl.value = study.prayer || '';
      renderSelectedVerse(study);
      setTab('my');
      var panel = byId('panel-my-study');
      if (panel && typeof panel.scrollIntoView === 'function') {
        try {
          panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (eScroll) {
          panel.scrollIntoView(true);
        }
      }
      if (typeof window.showEliteToast === 'function') {
        window.showEliteToast('Opened in your desk: ' + ref, { duration: 1800 });
      }
      return true;
    }
    window.tdbOpenVerseInMyStudyWorkspace = openVerseInWorkspace;
    window.addEventListener('tdb-mystudy-open-verse', function (ev) {
      var d = ev && ev.detail ? ev.detail : null;
      if (!d) return;
      openVerseInWorkspace(d.ref, d.text);
    });

    function normalizeRef(ref) {
      return String(ref || '').replace(/\s*\(KJV\)\s*$/i, '').trim();
    }

    function readBibleToolNotesLocal() {
      try {
        var raw = localStorage.getItem('tdb_bible_tool_notes');
        if (!raw) return { battleLog: '', verseNotes: [] };
        var obj = JSON.parse(raw);
        var verseNotes = [];
        var battleLog = '';
        if (obj && typeof obj === 'object') {
          Object.keys(obj).forEach(function (key) {
            if (key === 'Battle log') battleLog = String(obj[key] || '').trim();
            else if (key && obj[key]) verseNotes.push({ ref: key, note: String(obj[key]).trim() });
          });
        }
        return { battleLog: battleLog, verseNotes: verseNotes };
      } catch (e) {
        return { battleLog: '', verseNotes: [] };
      }
    }

    function removeBibleToolNoteLocal(ref) {
      try {
        var raw = localStorage.getItem('tdb_bible_tool_notes');
        var obj = raw ? JSON.parse(raw) : {};
        if (obj && typeof obj === 'object' && ref) {
          delete obj[ref];
          localStorage.setItem('tdb_bible_tool_notes', JSON.stringify(obj));
        }
      } catch (e) { /* non-fatal */ }
    }

    function gatherUnifiedSavedRows() {
      var rows = [];
      var seen = Object.create(null);
      function pushRow(row) {
        if (!row || !row.ref) return;
        var ref = normalizeRef(row.ref);
        if (!ref || seen[ref]) return;
        seen[ref] = true;
        rows.push({
          ref: ref,
          text: String(row.text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
          note: String(row.note || '').trim(),
          source: row.source || 'saved',
          id: row.id || null,
          collectionName: row.collectionName || ''
        });
      }
      try {
        var items = JSON.parse(localStorage.getItem('savedCollectionItems') || '[]');
        var cols = JSON.parse(localStorage.getItem('savedCollections') || '[]');
        var colNames = Object.create(null);
        if (Array.isArray(cols)) {
          cols.forEach(function (c) {
            if (c && c.id) colNames[c.id] = c.name || 'Saved';
          });
        }
        if (Array.isArray(items)) {
          items.forEach(function (item) {
            if (!item) return;
            pushRow({
              ref: item.ref,
              text: item.text,
              note: item.note,
              source: 'collection',
              id: item.id || null,
              collectionName: colNames[item.collection_id] || 'Saved'
            });
          });
        }
      } catch (e1) { /* non-fatal */ }
      try {
        var legacy = JSON.parse(localStorage.getItem('savedVerses') || '[]');
        if (Array.isArray(legacy)) {
          legacy.forEach(function (item) {
            if (!item) return;
            pushRow({
              ref: item.ref,
              text: item.text,
              note: item.note,
              source: 'legacy'
            });
          });
        }
      } catch (e2) { /* non-fatal */ }
      var tool = readBibleToolNotesLocal();
      (tool.verseNotes || []).forEach(function (v) {
        pushRow({
          ref: v.ref,
          text: '',
          note: v.note,
          source: 'bible-tool'
        });
      });
      return { rows: rows, battleLog: tool.battleLog || '' };
    }

    function appendMemorizeLink(actions, ref) {
      var a = document.createElement('a');
      a.className = 'btn btn-secondary';
      a.href = 'memorize.html';
      a.textContent = 'Memorize';
      a.setAttribute('aria-label', 'Open memorize for ' + ref);
      try {
        if (window.TDBStudyCompanion && typeof window.TDBStudyCompanion.addToMemorizeQueue === 'function') {
          a.addEventListener('click', function (ev) {
            ev.preventDefault();
            window.TDBStudyCompanion.addToMemorizeQueue(ref, '');
            if (typeof window.showEliteToast === 'function') {
              window.showEliteToast('Added to memorize on this device', { duration: 1600 });
            }
            updateMemorizePill();
            renderNoteLibrary();
          });
        }
      } catch (e) { /* non-fatal */ }
      actions.appendChild(a);
    }

    function removeSavedRow(row) {
      var ref = row.ref;
      if (row.source === 'bible-tool') {
        removeBibleToolNoteLocal(ref);
        return;
      }
      if (row.source === 'collection' || row.source === 'legacy') {
        try {
          var items = JSON.parse(localStorage.getItem('savedCollectionItems') || '[]');
          if (Array.isArray(items)) {
            var next = items.filter(function (v) {
              if (row.id && v.id) return v.id !== row.id;
              return normalizeRef(v.ref) !== ref;
            });
            localStorage.setItem('savedCollectionItems', JSON.stringify(next));
          }
        } catch (e1) { /* non-fatal */ }
        try {
          var legacy = JSON.parse(localStorage.getItem('savedVerses') || '[]');
          if (Array.isArray(legacy)) {
            localStorage.setItem(
              'savedVerses',
              JSON.stringify(
                legacy.filter(function (v) {
                  return normalizeRef(v.ref) !== ref;
                })
              )
            );
          }
        } catch (e2) { /* non-fatal */ }
        if (row.id && typeof window.deleteCollectionItemFromSupabase === 'function') {
          try {
            window.deleteCollectionItemFromSupabase(row.id);
          } catch (e3) { /* non-fatal */ }
        }
      }
    }

    function renderMystudySavedShelf() {
      var container = byId('saved-verses');
      if (!container) return;
      clearNode(container);
      var packed = gatherUnifiedSavedRows();
      var rows = packed.rows;
      if (!rows.length && !packed.battleLog) {
        var empty = document.createElement('p');
        empty.className = 'empty section-note';
        empty.appendChild(
          document.createTextNode(
            'Nothing here yet. When a verse touches your heart, save one from the '
          )
        );
        var a = document.createElement('a');
        a.href = 'bible-tool.html';
        a.textContent = 'Bible Tool';
        empty.appendChild(a);
        empty.appendChild(
          document.createTextNode(' or Study workspace. The Lord meets you right where you are.')
        );
        container.appendChild(empty);
        return;
      }
      rows.forEach(function (row) {
        var card = document.createElement('div');
        card.className = 'list-item saved-note-card mystudy-saved-row';
        card.setAttribute('role', 'listitem');
        var body = document.createElement('div');
        var strong = document.createElement('strong');
        strong.textContent = row.ref;
        body.appendChild(strong);
        if (row.text) {
          var p = document.createElement('p');
          p.textContent = row.text;
          body.appendChild(p);
        }
        if (row.note) {
          var np = document.createElement('p');
          np.className = 'saved-note-note';
          np.textContent = row.note;
          body.appendChild(np);
        }
        if (row.collectionName) {
          var src = document.createElement('span');
          src.className = 'section-note';
          src.textContent = row.collectionName;
          body.appendChild(src);
        } else if (row.source === 'bible-tool') {
          var src2 = document.createElement('span');
          src2.className = 'section-note';
          src2.textContent = 'Bible Tool note';
          body.appendChild(src2);
        }
        card.appendChild(body);
        var actions = document.createElement('div');
        actions.className = 'item-actions';
        var openHere = document.createElement('button');
        openHere.type = 'button';
        openHere.className = 'btn btn-secondary mystudy-open-here-btn';
        openHere.textContent = 'Open here';
        openHere.setAttribute('aria-label', 'Open ' + row.ref + ' in My Study workspace on this page');
        openHere.addEventListener('click', function () {
          openVerseInWorkspace(row.ref, row.text || row.note || '');
        });
        actions.appendChild(openHere);
        var toolA = document.createElement('a');
        toolA.className = 'btn btn-secondary';
        toolA.href = 'bible-tool.html?ref=' + encodeURIComponent(row.ref);
        toolA.textContent = 'Bible Tool';
        toolA.setAttribute('aria-label', 'Open ' + row.ref + ' in Bible Tool');
        actions.appendChild(toolA);
        var copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn-secondary';
        copyBtn.textContent = 'Copy';
        copyBtn.setAttribute('aria-label', 'Copy ' + row.ref);
        copyBtn.addEventListener('click', function () {
          var blob = row.ref + (row.text ? ': ' + row.text : row.note ? ': ' + row.note : '');
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(blob);
          }
        });
        actions.appendChild(copyBtn);
        appendMemorizeLink(actions, row.ref);
        if (typeof createWordStudyButton === 'function') {
          try {
            actions.appendChild(createWordStudyButton(row.ref, row.text || row.note || ''));
          } catch (eWs) { /* non-fatal */ }
        }
        var delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'btn btn-secondary';
        delBtn.textContent = row.source === 'collection' ? 'Remove' : 'Delete';
        delBtn.setAttribute('aria-label', 'Remove ' + row.ref + ' from this device');
        delBtn.addEventListener('click', function () {
          removeSavedRow(row);
          renderMystudySavedShelf();
          try {
            window.dispatchEvent(new CustomEvent('tdb-my-verses-updated'));
          } catch (eEv) { /* non-fatal */ }
        });
        actions.appendChild(delBtn);
        card.appendChild(actions);
        container.appendChild(card);
      });
      if (packed.battleLog) {
        var logP = document.createElement('p');
        logP.className = 'section-note';
        var logStrong = document.createElement('strong');
        logStrong.textContent = 'Battle log';
        logP.appendChild(logStrong);
        logP.appendChild(
          document.createTextNode(
            ': ' +
              (packed.battleLog.length > 200
                ? packed.battleLog.slice(0, 200).trim() + '\u2026'
                : packed.battleLog.trim())
          )
        );
        container.appendChild(logP);
      }
    }

    function wireSavedVersesOpenHere() {
      renderMystudySavedShelf();
      window.addEventListener('tdb-my-verses-updated', function () {
        setTimeout(renderMystudySavedShelf, 40);
      });
      window.addEventListener('storage', function (ev) {
        if (!ev || !ev.key) return;
        if (
          ev.key === 'savedCollectionItems' ||
          ev.key === 'savedVerses' ||
          ev.key === 'tdb_bible_tool_notes' ||
          ev.key === 'savedCollections'
        ) {
          renderMystudySavedShelf();
        }
      });
    }
    wireSavedVersesOpenHere();
    window.tdbRenderMystudySavedShelf = renderMystudySavedShelf;

    var _ribbonScriptsPromise = null;
    function ensureRibbonScripts() {
      if (_ribbonScriptsPromise) return _ribbonScriptsPromise;
      if (document.querySelector('script[data-tdb-mystudy-ribbon-loaded="1"]')) {
        _ribbonScriptsPromise = Promise.resolve();
        return _ribbonScriptsPromise;
      }
      var cfg = byId('mystudy-deferred-ribbon-scripts');
      var list = [];
      try {
        list = cfg ? JSON.parse(cfg.textContent || '[]') : [];
      } catch (e) {
        list = [
          'mobius-deep-lesson-stations.js?v=20260518ribbon',
          'tdb-mobius-journal.js?v=20260518ribbon',
          'mystudy-ribbon-journal.js?v=20260518ribbon'
        ];
      }
      if (!Array.isArray(list) || !list.length) {
        _ribbonScriptsPromise = Promise.resolve();
        return _ribbonScriptsPromise;
      }
      _ribbonScriptsPromise = list.reduce(function (chain, src) {
        return chain.then(function () {
          return new Promise(function (resolve) {
            var s = document.createElement('script');
            s.src = src;
            s.defer = true;
            s.setAttribute('data-tdb-mystudy-ribbon-loaded', '1');
            s.onload = function () {
              resolve();
            };
            s.onerror = function () {
              resolve();
            };
            document.body.appendChild(s);
          });
        });
      }, Promise.resolve());
      return _ribbonScriptsPromise;
    }
    window.tdbEnsureMystudyRibbonScripts = ensureRibbonScripts;
    if (getRequestedTab() === 'library') {
      ensureRibbonScripts();
    }

    function wireMobileJumpChips() {
      var nav = byId('mystudyMobileJump');
      if (!nav) return;
      nav.querySelectorAll('[data-mystudy-jump]').forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          var jump = String(el.getAttribute('data-mystudy-jump') || '').trim();
          var tabName = jump === 'library' ? 'library' : jump === 'highlights' ? 'highlights' : 'my';
          var targetId =
            jump === 'library'
              ? 'panel-note-library'
              : jump === 'highlights'
                ? 'panel-highlights'
                : 'panel-my-study';
          setTab(tabName);
          var target = byId(targetId);
          if (jump === 'library') {
            var saved = byId('saved-verses');
            if (saved) target = saved;
          }
          if (target && typeof target.scrollIntoView === 'function') {
            try {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch (e2) {
              target.scrollIntoView(true);
            }
          }
        });
      });
    }
    wireMobileJumpChips();

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
      if (backupStatus) backupStatus.textContent = 'Backup download started. Keep the file somewhere safe—saved verses, workspace notes, highlights, ribbon journal, and plan reflections are inside.';
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
            throw new Error('Restore is not open from here yet. Reload and try again.');
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
          if (backupStatus) backupStatus.textContent = err && err.message ? err.message : 'That backup did not restore. Check the file or try another export.';
        }
      };
      reader.onerror = function () {
        if (backupStatus) backupStatus.textContent = 'That file did not read. Try again with a JSON backup from My Study.';
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
      if (h === '#saved-verses' || h === '#panel-note-library' || h === '#mystudy-ribbon-journal') setTab('library');
      else if (h === '#panel-highlights') setTab('highlights');
      else if (h === '#panel-join-study') setTab('join');
      else if (h === '#panel-my-study') setTab('my');
      openRhythmDrawerForHash();
    });
    openRhythmDrawerForHash();

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
    byId('mystudy-search')?.addEventListener(
      'focus',
      function () {
        ensureBibleLoaded();
      },
      { once: true }
    );
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
          if (shareStatusEl) shareStatusEl.textContent = 'Copy did not go through. Select and copy manually.';
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

    setTab(getRequestedTab());
    openRhythmDrawerForHash();
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
