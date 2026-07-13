/**
 * Shared verse-note tags, export bundle, and recent chapter history.
 * Verse bodies stay in tdb_bible_tool_notes (Bible Tool); tags live in tdb_study_notes_meta_v1.
 */
(function (global) {
  'use strict';

  var META_KEY = 'tdb_study_notes_meta_v1';
  var RECENT_KEY = 'tdb_reader_recent_chapters_v1';
  var BOOKMARKS_KEY = 'tdb_reader_bookmarks_v1';
  var RESUME_KEY = 'tdb_reader_resume_v1';
  var NOTES_KEY = 'tdb_bible_tool_notes';
  var MEM_KEY = 'tdb_memorize_lite_v1';
  var MAX_RECENT = 14;
  var MAX_BOOKMARKS = 16;
  /** Gentle on-device spaced repetition: base day steps × ease factor (nudges up on “good,” down on “again”). Legacy `step` maps to intervalIdx on read. */
  var MEM_INTERVALS_DAYS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
  var DAY_MS = 86400000;

  function normalizeMemEntry(e) {
    if (!e || typeof e !== 'object') return e;
    if (e.intervalIdx == null && e.step != null) {
      e.intervalIdx = Math.min(MEM_INTERVALS_DAYS.length - 1, Math.max(0, Number(e.step) || 0));
    }
    if (e.intervalIdx == null) e.intervalIdx = 0;
    var ef = Number(e.easeFactor);
    if (e.easeFactor == null || isNaN(ef)) e.easeFactor = 2;
    e.easeFactor = Math.max(1.25, Math.min(2.65, Number(e.easeFactor)));
    var ovr = Number(e.nextDueOverrideMs);
    if (e.nextDueOverrideMs != null && !isNaN(ovr) && ovr <= Date.now()) {
      try {
        delete e.nextDueOverrideMs;
      } catch (eDel) {}
    }
    return e;
  }

  /** Shared print / PDF-friendly styles for openPrintableNotes and openPrintableStudyBundle (blob window; no external CSS). */
  var PRINT_BUNDLE_CSS =
    'body{font-family:Georgia,Palatino Linotype,Book Antiqua,serif;max-width:42rem;margin:0 auto;padding:1.5rem 1.25rem 2.5rem;line-height:1.55;color:#1a1a1a;background:#f8f9fb}' +
    '.tdb-print-header{border-bottom:2px solid #c5a059;padding-bottom:0.85rem;margin-bottom:1.1rem}' +
    '.tdb-print-brand{font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:#7a6a4a;font-weight:600}' +
    '.tdb-print-title{font-size:1.4rem;font-weight:600;margin:0.4rem 0 0;line-height:1.25;color:#111}' +
    '.tdb-print-meta,.tdb-print-lead{font-size:0.88rem;color:#4a5568;margin:0.45rem 0 0}' +
    '.tdb-print-lead{margin-bottom:1rem;line-height:1.5}' +
    'main h1{font-size:1.15rem;font-weight:600;margin:0 0 0.75rem}' +
    'h2{font-size:1.05rem;font-weight:600;margin:1.45rem 0 0.5rem;color:#222;border-bottom:1px solid #e2e8f0;padding-bottom:0.3rem}' +
    '.tdb-print-section{page-break-inside:avoid;margin-bottom:0.25rem}' +
    '.ref{font-weight:700;margin-top:1rem;font-size:0.98rem;color:#111}' +
    '.tdb-print-entry .ref:first-child{margin-top:0.65rem}' +
    '.note{margin:0.35rem 0 0.95rem;white-space:pre-wrap}' +
    '.tag{font-size:0.82rem;color:#4a5568;margin:0.2rem 0 0.2rem}' +
    'ul{margin:0.3rem 0 0.85rem;padding-left:1.15rem}' +
    'li{margin:0.28rem 0}' +
    '.tdb-print-footer{margin-top:2rem;padding-top:0.85rem;border-top:1px solid #cbd5e1;font-size:0.78rem;color:#64748b;line-height:1.45}' +
    '.tdb-print-footer strong{color:#475569}' +
    '@media print{body{background:#fff;padding:0.4in 0.45in;max-width:none}' +
    '.tdb-print-header{border-bottom-color:#94a3b8} h2{page-break-after:avoid}' +
    '.tdb-print-entry{page-break-inside:avoid} .tdb-print-section{page-break-inside:avoid}}';

  function normRef(ref) {
    return String(ref || '').replace(/\s+/g, ' ').trim();
  }

  function loadMeta() {
    try {
      var o = JSON.parse(localStorage.getItem(META_KEY) || '{}');
      return o && typeof o === 'object' ? o : {};
    } catch (e) {
      return {};
    }
  }

  function saveMeta(m) {
    try {
      localStorage.setItem(META_KEY, JSON.stringify(m));
    } catch (e) {}
  }

  function getTags(ref) {
    var r = normRef(ref);
    var m = loadMeta();
    var row = m[r];
    if (!row) return [];
    if (Array.isArray(row.tags)) return row.tags.slice();
    return String(row.tags || '')
      .split(/\s*,\s*/)
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  }

  function setTags(ref, tagsArray) {
    var r = normRef(ref);
    if (!r) return;
    var m = loadMeta();
    var tags = (tagsArray || [])
      .map(function (t) {
        return String(t).trim();
      })
      .filter(Boolean)
      .slice(0, 12);
    if (!tags.length) {
      delete m[r];
    } else {
      m[r] = { tags: tags, updated: new Date().toISOString() };
    }
    saveMeta(m);
  }

  function parseTagInput(str) {
    return String(str || '')
      .split(/\s*,\s*/)
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  }

  function listVerseNotes() {
    var notes = {};
    try {
      notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    } catch (e) {}
    var refs = Object.keys(notes).filter(function (k) {
      return k && k !== 'Battle log' && String(notes[k] || '').trim();
    });
    refs.sort(function (a, b) {
      return a.localeCompare(b);
    });
    var meta = loadMeta();
    return refs.map(function (r) {
      var text = String(notes[r] || '').trim();
      var tags = getTags(r);
      var rowMeta = meta[r];
      var updated = rowMeta && rowMeta.updated ? String(rowMeta.updated) : '';
      return {
        ref: r,
        preview: text.length > 140 ? text.slice(0, 137) + '\u2026' : text,
        tags: tags,
        updated: updated
      };
    });
  }

  function exportJson() {
    var notes = {};
    try {
      notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    } catch (e) {}
    return JSON.stringify(
      {
        v: 1,
        exportedAt: new Date().toISOString(),
        verseNotes: notes,
        noteMeta: loadMeta()
      },
      null,
      0
    );
  }

  function recordRecentChapter(book, chapter) {
    var b = String(book || '').trim();
    var ch = String(chapter || '').trim();
    if (!b || !ch) return;
    var label = b + ' ' + ch;
    var list = [];
    try {
      list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    } catch (e) {}
    if (!Array.isArray(list)) list = [];
    list = list.filter(function (x) {
      return x && x.label !== label;
    });
    list.unshift({ label: label, book: b, chapter: ch, at: new Date().toISOString() });
    list = list.slice(0, MAX_RECENT);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function getRecentChapters() {
    try {
      var list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function bookmarkPairId(book, chapter) {
    return String(book || '').trim() + '|' + String(chapter || '').trim();
  }

  function loadReaderBookmarks() {
    try {
      var list = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function saveReaderBookmarks(list) {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list.slice(0, MAX_BOOKMARKS)));
    } catch (e) {}
  }

  function isReaderBookmarked(book, chapter) {
    var id = bookmarkPairId(book, chapter);
    if (!id || id === '|') return false;
    return loadReaderBookmarks().some(function (x) {
      return x && x.id === id;
    });
  }

  function toggleReaderBookmark(book, chapter) {
    var b = String(book || '').trim();
    var ch = String(chapter || '').trim();
    if (!b || !ch) return false;
    var id = bookmarkPairId(b, ch);
    var list = loadReaderBookmarks().filter(function (x) {
      return x && x.id !== id;
    });
    var had = loadReaderBookmarks().some(function (x) {
      return x && x.id === id;
    });
    if (!had) {
      list.unshift({ id: id, book: b, chapter: ch, at: new Date().toISOString() });
    }
    saveReaderBookmarks(list);
    return !had;
  }

  function removeReaderBookmark(book, chapter) {
    var id = bookmarkPairId(book, chapter);
    var list = loadReaderBookmarks().filter(function (x) {
      return x && x.id !== id;
    });
    saveReaderBookmarks(list);
  }

  function listReaderBookmarks() {
    return loadReaderBookmarks();
  }

  function saveReaderResume(book, chapter) {
    var b = String(book || '').trim();
    var ch = String(chapter || '').trim();
    if (!b || !ch) return;
    try {
      localStorage.setItem(
        RESUME_KEY,
        JSON.stringify({ book: b, chapter: ch, at: new Date().toISOString() })
      );
    } catch (e) {}
  }

  function getReaderResume() {
    try {
      var o = JSON.parse(localStorage.getItem(RESUME_KEY) || 'null');
      if (!o || typeof o !== 'object' || !o.book || !o.chapter) return null;
      return { book: String(o.book), chapter: String(o.chapter), at: o.at || '' };
    } catch (e) {
      return null;
    }
  }

  function loadMemorize() {
    try {
      var raw = localStorage.getItem(MEM_KEY);
      var o = raw ? JSON.parse(raw) : null;
      if (o && typeof o === 'object' && o.refs && typeof o.refs === 'object') return o;
    } catch (e) {}
    return { refs: {} };
  }

  function saveMemorize(state) {
    try {
      localStorage.setItem(MEM_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function memNextDueMs(entry) {
    if (!entry) return 0;
    normalizeMemEntry(entry);
    var override = Number(entry.nextDueOverrideMs);
    if (!isNaN(override) && override > Date.now()) {
      return override;
    }
    var idx = Math.min(Math.max(Number(entry.intervalIdx) || 0, 0), MEM_INTERVALS_DAYS.length - 1);
    var ef = Number(entry.easeFactor) || 2;
    var days = MEM_INTERVALS_DAYS[idx] * (ef / 2);
    if (days < 0.9) days = 0.9;
    if (days > 200) days = 200;
    var base = entry.lastReviewed ? Date.parse(entry.lastReviewed) : Date.parse(entry.added || new Date().toISOString());
    if (isNaN(base)) base = Date.now();
    return base + days * DAY_MS;
  }

  function isMemorizing(ref) {
    var r = normRef(ref);
    return !!(loadMemorize().refs || {})[r];
  }

  function toggleMemorize(ref) {
    var r = normRef(ref);
    if (!r) return false;
    var st = loadMemorize();
    if (st.refs[r]) {
      delete st.refs[r];
      saveMemorize(st);
      return false;
    }
    st.refs[r] = {
      added: new Date().toISOString(),
      lastReviewed: null,
      intervalIdx: 0,
      easeFactor: 2,
      lapses: 0
    };
    saveMemorize(st);
    return true;
  }

  /**
   * @param {string} ref
   * @param {'good'|'again'|undefined} quality — 'again' shortens the interval gently; default is 'good'.
   */
  function markMemorizeReviewed(ref, quality) {
    var r = normRef(ref);
    if (!r) return;
    var st = loadMemorize();
    var e = st.refs[r];
    if (!e) return;
    normalizeMemEntry(e);
    var again = quality === 'again';
    if (again) {
      e.easeFactor = Math.max(1.25, (Number(e.easeFactor) || 2) - 0.22);
      e.intervalIdx = Math.max(0, (Number(e.intervalIdx) || 0) - 2);
      e.lapses = (Number(e.lapses) || 0) + 1;
    } else {
      e.easeFactor = Math.min(2.65, (Number(e.easeFactor) || 2) + 0.07);
      e.intervalIdx = Math.min(MEM_INTERVALS_DAYS.length - 1, (Number(e.intervalIdx) || 0) + 1);
    }
    e.lastReviewed = new Date().toISOString();
    try {
      delete e.nextDueOverrideMs;
    } catch (eDel) {}
    saveMemorize(st);
  }

  /**
   * Schedule the next gentle review about N whole days from now (local device).
   * Clears when the verse is marked reviewed again.
   * @param {string} ref
   * @param {number} wholeDays 1–365
   */
  function setMemorizeNextReviewInDays(ref, wholeDays) {
    var r = normRef(ref);
    if (!r) return;
    var n = Math.min(365, Math.max(1, Math.floor(Number(wholeDays) || 1)));
    var st = loadMemorize();
    var e = st.refs[r];
    if (!e) return;
    normalizeMemEntry(e);
    e.nextDueOverrideMs = Date.now() + n * DAY_MS;
    saveMemorize(st);
  }

  function listMemorizeQueue() {
    var st = loadMemorize();
    var refs = st.refs || {};
    var rows = Object.keys(refs).map(function (k) {
      var entry = refs[k];
      normalizeMemEntry(entry);
      return {
        ref: k,
        entry: entry,
        dueAt: memNextDueMs(entry)
      };
    });
    rows.sort(function (a, b) {
      return a.dueAt - b.dueAt;
    });
    return rows;
  }

  /** Count of memorize cards whose gentle next review time has arrived (device-local). */
  function countMemorizeDue() {
    var now = Date.now();
    return listMemorizeQueue().filter(function (r) {
      return r.dueAt <= now;
    }).length;
  }

  function collectAllTags() {
    var m = loadMeta();
    var seen = {};
    Object.keys(m).forEach(function (k) {
      var row = m[k];
      var tags = Array.isArray(row.tags) ? row.tags : [];
      tags.forEach(function (t) {
        var x = String(t).trim().toLowerCase();
        if (x) seen[x] = true;
      });
    });
    return Object.keys(seen).sort();
  }

  function getDashboardStats() {
    var now = new Date();
    var mo = now.getMonth() + 1;
    var ym = now.getFullYear() + '-' + (mo < 10 ? '0' : '') + mo;
    var meta = loadMeta();
    var notesThisMonth = 0;
    Object.keys(meta).forEach(function (k) {
      var u = meta[k] && meta[k].updated;
      if (!u || typeof u !== 'string') return;
      if (u.slice(0, 7) === ym) notesThisMonth++;
    });
    var verseWithNotes = listVerseNotes().length;
    var planMarks = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || key.indexOf('tdb_bible_tool_plan_') !== 0) continue;
        if (key === 'tdb_bible_tool_plan') continue;
        var raw = localStorage.getItem(key);
        var o = JSON.parse(raw || '{}');
        if (typeof o !== 'object' || !o) continue;
        Object.keys(o).forEach(function (rk) {
          if (o[rk]) planMarks++;
        });
      }
    } catch (e) {}
    var memCount = Object.keys((loadMemorize().refs || {})).length;
    var memSt = loadMemorize();
    var memReviewsThisMonth = 0;
    Object.keys(memSt.refs || {}).forEach(function (k) {
      var e = memSt.refs[k];
      var lr = e && e.lastReviewed;
      if (typeof lr === 'string' && lr.slice(0, 7) === ym) memReviewsThisMonth++;
    });
    var chaptersThisMonth = 0;
    getRecentChapters().forEach(function (item) {
      var at = item && item.at;
      if (typeof at === 'string' && at.slice(0, 7) === ym) chaptersThisMonth++;
    });
    return {
      notesTouchedThisMonth: notesThisMonth,
      versesWithNotes: verseWithNotes,
      readingPlanCheckmarks: planMarks,
      memorizeVerses: memCount,
      memorizeReviewsThisMonth: memReviewsThisMonth,
      chaptersVisitedThisMonth: chaptersThisMonth
    };
  }

  function openPrintableNotes() {
    var rows = listVerseNotes();
    var notes = {};
    try {
      notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    } catch (e) {}
    var esc = function (s) {
      return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
    var now = new Date();
    var dateLong = now.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    var html =
      '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>Verse notes &mdash; Today\'s Daily Battle</title>' +
      '<style>' +
      PRINT_BUNDLE_CSS +
      '</style></head><body>' +
      '<header class="tdb-print-header" role="banner">' +
      '<div class="tdb-print-brand">Today&rsquo;s Daily Battle</div>' +
      '<h1 class="tdb-print-title">Verse notes (KJV)</h1>' +
      '<p class="tdb-print-meta">' +
      esc(dateLong) +
      '</p>' +
      '</header>' +
      '<p class="tdb-print-lead">Saved on this device. Use your browser&rsquo;s print dialog to save as PDF. Scripture is King James Version.</p>' +
      '<main>';
    if (!rows.length) {
      html += '<p class="note">No verse notes saved yet. Add notes in the Bible Tool, then print again.</p>';
    }
    rows.forEach(function (row) {
      var body = String(notes[row.ref] || '').trim();
      var tg = (row.tags || []).join(', ');
      html +=
        '<article class="tdb-print-entry">' +
        '<div class="ref">' +
        esc(row.ref) +
        '</div>' +
        (tg ? '<div class="tag">Tags: ' + esc(tg) + '</div>' : '') +
        '<div class="note">' +
        esc(body) +
        '</div></article>';
    });
    html +=
      '</main><footer class="tdb-print-footer" role="contentinfo">' +
      '<strong>todaysdailybattle.com</strong> &mdash; private KJV study export<br>' +
      esc(now.toLocaleString()) +
      ' &mdash; ' +
      rows.length +
      ' verse note(s)</footer></body></html>';
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var w = window.open(url, '_blank', 'noopener,noreferrer');
    if (!w) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
      return false;
    }
    var revoked = false;
    function revokeLater() {
      if (revoked) return;
      revoked = true;
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
    }
    var printed = false;
    function tryPrint() {
      if (printed) return;
      printed = true;
      try {
        w.print();
      } catch (e) {}
      setTimeout(revokeLater, 120000);
    }
    w.addEventListener('load', function onPrintLoad() {
      w.removeEventListener('load', onPrintLoad);
      setTimeout(tryPrint, 250);
    });
    setTimeout(tryPrint, 900);
    return true;
  }

  function openPrintableStudyBundle() {
    var rows = listVerseNotes();
    var notes = {};
    try {
      notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    } catch (e) {}
    var memQ = listMemorizeQueue();
    var recent = getRecentChapters();
    var esc = function (s) {
      return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
    var now = new Date();
    var dateLong = now.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    var html =
      '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>My Study bundle &mdash; Today\'s Daily Battle</title>' +
      '<style>' +
      PRINT_BUNDLE_CSS +
      '</style></head><body>' +
      '<header class="tdb-print-header" role="banner">' +
      '<div class="tdb-print-brand">Today&rsquo;s Daily Battle</div>' +
      '<h1 class="tdb-print-title">My Study bundle (KJV)</h1>' +
      '<p class="tdb-print-meta">' +
      esc(dateLong) +
      '</p>' +
      '</header>' +
      '<p class="tdb-print-lead">Verse notes, memorize queue, and recent chapters from this device. Print or save as PDF from your browser. Scripture is King James Version.</p>';

    html += '<section class="tdb-print-section" aria-labelledby="h-notes"><h2 id="h-notes">Verse notes</h2>';
    if (!rows.length) {
      html += '<p class="note">No saved verse notes yet.</p>';
    }
    rows.forEach(function (row) {
      var body = String(notes[row.ref] || '').trim();
      var tg = (row.tags || []).join(', ');
      html +=
        '<article class="tdb-print-entry">' +
        '<div class="ref">' +
        esc(row.ref) +
        '</div>' +
        (tg ? '<div class="tag">Tags: ' + esc(tg) + '</div>' : '') +
        '<div class="note">' +
        esc(body) +
        '</div></article>';
    });
    html += '</section>';

    html += '<section class="tdb-print-section" aria-labelledby="h-mem"><h2 id="h-mem">Memorize queue</h2>';
    if (!memQ.length) {
      html += '<p class="note">No verses in the memorize queue.</p>';
    } else {
      html += '<ul>';
      memQ.forEach(function (row) {
        html += '<li>' + esc(row.ref) + '</li>';
      });
      html += '</ul>';
    }
    html += '</section>';

    html += '<section class="tdb-print-section" aria-labelledby="h-ch"><h2 id="h-ch">Recent chapters</h2>';
    if (!recent.length) {
      html += '<p class="note">No recent chapters yet.</p>';
    } else {
      html += '<ul>';
      recent.forEach(function (item) {
        var lab = item && item.label ? String(item.label) : '';
        if (lab) html += '<li>' + esc(lab) + '</li>';
      });
      html += '</ul>';
    }
    html += '</section>';

    html +=
      '<footer class="tdb-print-footer" role="contentinfo">' +
      '<strong>todaysdailybattle.com</strong> &mdash; private KJV study export<br>' +
      esc(now.toLocaleString()) +
      ' &mdash; ' +
      rows.length +
      ' note(s), ' +
      memQ.length +
      ' memorize, ' +
      recent.length +
      ' recent chapter(s)</footer></body></html>';
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var w = window.open(url, '_blank', 'noopener,noreferrer');
    if (!w) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
      return false;
    }
    var revoked = false;
    function revokeLater() {
      if (revoked) return;
      revoked = true;
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
    }
    var printed = false;
    function tryPrint() {
      if (printed) return;
      printed = true;
      try {
        w.print();
      } catch (e) {}
      setTimeout(revokeLater, 120000);
    }
    w.addEventListener('load', function onBundleLoad() {
      w.removeEventListener('load', onBundleLoad);
      setTimeout(tryPrint, 250);
    });
    setTimeout(tryPrint, 900);
    return true;
  }

  function downloadStudyLocalBackup() {
    /* v3: include hero/collection saves + workspace + highlights + ribbon + plan reflections. */
    var keyMap = {
      tdb_bible_tool_notes: NOTES_KEY,
      tdb_study_notes_meta_v1: META_KEY,
      tdb_reader_recent_chapters_v1: RECENT_KEY,
      tdb_reader_bookmarks_v1: BOOKMARKS_KEY,
      tdb_reader_resume_v1: RESUME_KEY,
      tdb_memorize_lite_v1: MEM_KEY,
      savedCollectionItems: 'savedCollectionItems',
      savedCollections: 'savedCollections',
      savedVerses: 'savedVerses',
      tdb_my_study_v1: 'tdb_my_study_v1',
      tdb_mystudy_highlights_v1: 'tdb_mystudy_highlights_v1',
      tdb_mobius_loop_journal_v1: 'tdb_mobius_loop_journal_v1',
      tdb_plan_day_reflections_v1: 'tdb_plan_day_reflections_v1',
      tdb_shared_studies_v1: 'tdb_shared_studies_v1'
    };
    var data = {};
    Object.keys(keyMap).forEach(function (logical) {
      try {
        data[logical] = localStorage.getItem(keyMap[logical]);
      } catch (e) {
        data[logical] = null;
      }
    });
    var payload = {
      v: 3,
      exportedAt: new Date().toISOString(),
      source: 'todaysdailybattle-mystudy-backup',
      data: data
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'tdb-mystudy-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
      try {
        a.remove();
      } catch (e2) {}
    }, 1500);
    return true;
  }

  function restoreStudyLocalBackup(payload) {
    if (!payload) throw new Error('Backup file is empty.');
    var parsed = payload;
    if (typeof payload === 'string') {
      parsed = JSON.parse(payload);
    }
    if (!parsed || typeof parsed !== 'object' || !parsed.data || parsed.source !== 'todaysdailybattle-mystudy-backup') {
      throw new Error('That file is not a valid My Study backup.');
    }
    var keyMap = {
      tdb_bible_tool_notes: NOTES_KEY,
      tdb_study_notes_meta_v1: META_KEY,
      tdb_reader_recent_chapters_v1: RECENT_KEY,
      tdb_reader_bookmarks_v1: BOOKMARKS_KEY,
      tdb_reader_resume_v1: RESUME_KEY,
      tdb_memorize_lite_v1: MEM_KEY,
      savedCollectionItems: 'savedCollectionItems',
      savedCollections: 'savedCollections',
      savedVerses: 'savedVerses',
      tdb_my_study_v1: 'tdb_my_study_v1',
      tdb_mystudy_highlights_v1: 'tdb_mystudy_highlights_v1',
      tdb_mobius_loop_journal_v1: 'tdb_mobius_loop_journal_v1',
      tdb_plan_day_reflections_v1: 'tdb_plan_day_reflections_v1',
      tdb_shared_studies_v1: 'tdb_shared_studies_v1'
    };
    var restored = 0;
    Object.keys(keyMap).forEach(function (logical) {
      if (!Object.prototype.hasOwnProperty.call(parsed.data, logical)) return;
      var raw = parsed.data[logical];
      try {
        if (raw == null || raw === '') localStorage.removeItem(keyMap[logical]);
        else localStorage.setItem(keyMap[logical], String(raw));
        restored++;
      } catch (e) {}
    });
    return restored;
  }

  global.TDBStudyCompanion = {
    normRef: normRef,
    getTags: getTags,
    setTags: setTags,
    parseTagInput: parseTagInput,
    listVerseNotes: listVerseNotes,
    exportJson: exportJson,
    recordRecentChapter: recordRecentChapter,
    getRecentChapters: getRecentChapters,
    isReaderBookmarked: isReaderBookmarked,
    toggleReaderBookmark: toggleReaderBookmark,
    removeReaderBookmark: removeReaderBookmark,
    listReaderBookmarks: listReaderBookmarks,
    saveReaderResume: saveReaderResume,
    getReaderResume: getReaderResume,
    isMemorizing: isMemorizing,
    toggleMemorize: toggleMemorize,
    markMemorizeReviewed: markMemorizeReviewed,
    setMemorizeNextReviewInDays: setMemorizeNextReviewInDays,
    listMemorizeQueue: listMemorizeQueue,
    countMemorizeDue: countMemorizeDue,
    collectAllTags: collectAllTags,
    getDashboardStats: getDashboardStats,
    openPrintableNotes: openPrintableNotes,
    openPrintableStudyBundle: openPrintableStudyBundle,
    downloadStudyLocalBackup: downloadStudyLocalBackup,
    restoreStudyLocalBackup: restoreStudyLocalBackup
  };
})(typeof window !== 'undefined' ? window : this);
