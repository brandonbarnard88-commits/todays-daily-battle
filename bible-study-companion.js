/**
 * Shared verse-note tags, export bundle, and recent chapter history.
 * Verse bodies stay in tdb_bible_tool_notes (Bible Tool); tags live in tdb_study_notes_meta_v1.
 */
(function (global) {
  'use strict';

  var META_KEY = 'tdb_study_notes_meta_v1';
  var RECENT_KEY = 'tdb_reader_recent_chapters_v1';
  var NOTES_KEY = 'tdb_bible_tool_notes';
  var MAX_RECENT = 14;

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

  global.TDBStudyCompanion = {
    normRef: normRef,
    getTags: getTags,
    setTags: setTags,
    parseTagInput: parseTagInput,
    listVerseNotes: listVerseNotes,
    exportJson: exportJson,
    recordRecentChapter: recordRecentChapter,
    getRecentChapters: getRecentChapters
  };
})(typeof window !== 'undefined' ? window : this);
