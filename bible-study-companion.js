/**
 * Shared verse-note tags, export bundle, and recent chapter history.
 * Verse bodies stay in tdb_bible_tool_notes (Bible Tool); tags live in tdb_study_notes_meta_v1.
 */
(function (global) {
  'use strict';

  var META_KEY = 'tdb_study_notes_meta_v1';
  var RECENT_KEY = 'tdb_reader_recent_chapters_v1';
  var NOTES_KEY = 'tdb_bible_tool_notes';
  var MEM_KEY = 'tdb_memorize_lite_v1';
  var MAX_RECENT = 14;
  var MEM_INTERVALS_DAYS = [1, 2, 4, 7, 14];
  var DAY_MS = 86400000;

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
    return refs.map(function (r) {
      var text = String(notes[r] || '').trim();
      var tags = getTags(r);
      return {
        ref: r,
        preview: text.length > 140 ? text.slice(0, 137) + '\u2026' : text,
        tags: tags
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
    var step = Math.min(Math.max(Number(entry.step) || 0, 0), MEM_INTERVALS_DAYS.length - 1);
    var days = MEM_INTERVALS_DAYS[step];
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
      step: 0
    };
    saveMemorize(st);
    return true;
  }

  function markMemorizeReviewed(ref) {
    var r = normRef(ref);
    if (!r) return;
    var st = loadMemorize();
    var e = st.refs[r];
    if (!e) return;
    e.lastReviewed = new Date().toISOString();
    e.step = Math.min(MEM_INTERVALS_DAYS.length - 1, (Number(e.step) || 0) + 1);
    saveMemorize(st);
  }

  function listMemorizeQueue() {
    var st = loadMemorize();
    var refs = st.refs || {};
    var rows = Object.keys(refs).map(function (k) {
      return {
        ref: k,
        entry: refs[k],
        dueAt: memNextDueMs(refs[k])
      };
    });
    rows.sort(function (a, b) {
      return a.dueAt - b.dueAt;
    });
    return rows;
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
    return {
      notesTouchedThisMonth: notesThisMonth,
      versesWithNotes: verseWithNotes,
      readingPlanCheckmarks: planMarks,
      memorizeVerses: memCount
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
    var html =
      '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>My verse notes</title>' +
      '<style>body{font-family:Georgia,serif;max-width:40rem;margin:1.5rem auto;line-height:1.45;color:#111}' +
      'h1{font-size:1.25rem} .ref{font-weight:700;margin-top:1rem} .note{margin:0.25rem 0 0.5rem;white-space:pre-wrap}' +
      '.tag{font-size:0.85rem;color:#444} footer{margin-top:2rem;font-size:0.8rem;color:#666}</style></head><body>' +
      '<h1>Verse notes (KJV)</h1><p>Today&rsquo;s Daily Battle &mdash; printed from your device.</p>';
    rows.forEach(function (row) {
      var body = String(notes[row.ref] || '').trim();
      var tg = (row.tags || []).join(', ');
      html +=
        '<div class="ref">' +
        esc(row.ref) +
        '</div>' +
        (tg ? '<div class="tag">Tags: ' + esc(tg) + '</div>' : '') +
        '<div class="note">' +
        esc(body) +
        '</div>';
    });
    html +=
      '<footer>' +
      esc(new Date().toLocaleString()) +
      ' &mdash; ' +
      rows.length +
      ' verse(s)</footer></body></html>';
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

  global.TDBStudyCompanion = {
    normRef: normRef,
    getTags: getTags,
    setTags: setTags,
    parseTagInput: parseTagInput,
    listVerseNotes: listVerseNotes,
    exportJson: exportJson,
    recordRecentChapter: recordRecentChapter,
    getRecentChapters: getRecentChapters,
    isMemorizing: isMemorizing,
    toggleMemorize: toggleMemorize,
    markMemorizeReviewed: markMemorizeReviewed,
    listMemorizeQueue: listMemorizeQueue,
    collectAllTags: collectAllTags,
    getDashboardStats: getDashboardStats,
    openPrintableNotes: openPrintableNotes
  };
})(typeof window !== 'undefined' ? window : this);
