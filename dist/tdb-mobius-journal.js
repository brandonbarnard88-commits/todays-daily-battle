/**
 * Device-local notes for the Möbius ribbon metaphor (same store from Möbius, Verse, Plans).
 * No network; text never sent to analytics (see trackEvent calls).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tdb_mobius_loop_journal_v1';
  var VERSION = 1;
  var MAX_BODY = 2000;
  var MAX_CTX = 120;
  var MAX_ENTRIES = 200;

  function genId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'mlj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
  }

  function clampStr(s, max) {
    var t = String(s || '').replace(/\u0000/g, '').trim();
    if (t.length > max) return t.slice(0, max);
    return t;
  }

  function validEntry(e) {
    return (
      e &&
      typeof e.id === 'string' &&
      typeof e.createdAt === 'string' &&
      typeof e.body === 'string' &&
      e.body.length > 0
    );
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { version: VERSION, entries: [] };
      var p = JSON.parse(raw);
      if (!p || typeof p !== 'object') return { version: VERSION, entries: [] };
      var entries = Array.isArray(p.entries) ? p.entries : [];
      return {
        version: VERSION,
        entries: entries.filter(validEntry).map(function (x) {
          return {
            id: String(x.id),
            createdAt: String(x.createdAt),
            context: typeof x.context === 'string' ? x.context.slice(0, MAX_CTX) : '',
            body: String(x.body).slice(0, MAX_BODY)
          };
        })
      };
    } catch (err) {
      return { version: VERSION, entries: [] };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      if (typeof window.TDB_handleStorageError === 'function') {
        try {
          window.TDB_handleStorageError();
        } catch (e2) {}
      }
      return false;
    }
  }

  function append(body, contextLabel) {
    var b = clampStr(body, MAX_BODY);
    if (!b) return { ok: false, reason: 'empty' };
    var ctx = clampStr(contextLabel, MAX_CTX);
    var state = loadState();
    var entry = {
      id: genId(),
      createdAt: new Date().toISOString(),
      context: ctx,
      body: b
    };
    state.entries.unshift(entry);
    if (state.entries.length > MAX_ENTRIES) {
      state.entries = state.entries.slice(0, MAX_ENTRIES);
    }
    if (!saveState(state)) return { ok: false, reason: 'storage' };
    return { ok: true, entry: entry };
  }

  function exportTxt() {
    var state = loadState();
    var lines = [
      "Möbius loop journal — Today's Daily Battle (this device only)",
      'Exported ' + new Date().toLocaleString(),
      ''
    ];
    state.entries.forEach(function (e) {
      lines.push('— ' + e.createdAt + (e.context ? ' · ' + e.context : ''));
      lines.push(e.body);
      lines.push('');
    });
    return lines.join('\n');
  }

  function downloadExport() {
    var t = exportTxt();
    var blob = new Blob([t], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'mobius-loop-journal.txt';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function setStatus(el, msg, ok) {
    if (!el) return;
    el.hidden = !msg;
    el.textContent = msg || '';
    el.classList.toggle('tdb-mobius-journal-status--ok', !!ok);
    el.classList.toggle('tdb-mobius-journal-status--err', !!msg && !ok);
  }

  function bindSave(taId, btnId, statusId, contextFixed) {
    var ta = document.getElementById(taId);
    var btn = document.getElementById(btnId);
    var st = document.getElementById(statusId);
    if (!ta || !btn) return;
    btn.addEventListener('click', function () {
      var r = append(ta.value, contextFixed);
      if (r.ok) {
        ta.value = '';
        setStatus(st, 'Saved on this device only.', true);
        try {
          if (typeof window.trackEvent === 'function') {
            window.trackEvent('mobius_loop_journal_save', { source: 'mobius_journal' });
          }
        } catch (e) {}
      } else if (r.reason === 'empty') {
        setStatus(st, 'Write a line first, or skip—this is optional.', false);
      } else {
        setStatus(st, 'That did not save—storage may be full or blocked. That is all right. Try again when you can.', false);
      }
    });
  }

  function bindVerseRibbon() {
    var ta = document.getElementById('tdb-verse-ribbon-ta');
    var btn = document.getElementById('tdb-verse-ribbon-save');
    var st = document.getElementById('tdb-verse-ribbon-status');
    if (!ta || !btn) return;
    btn.addEventListener('click', function () {
      var refEl = document.getElementById('daily-verse-ref');
      var ref = refEl ? clampStr(refEl.textContent, 80) : '';
      var ctx = ref ? 'Verse of the Day · ' + ref : 'Verse of the Day';
      var r = append(ta.value, ctx);
      if (r.ok) {
        ta.value = '';
        setStatus(st, 'Saved on this device only.', true);
        try {
          if (typeof window.trackEvent === 'function') {
            window.trackEvent('mobius_loop_journal_save', { source: 'verse_page' });
          }
        } catch (e) {}
      } else if (r.reason === 'empty') {
        setStatus(st, 'Write a line first, or leave it—no pressure.', false);
      } else {
        setStatus(st, 'That did not save—storage may be full or blocked. That is all right. Try again when you can.', false);
      }
    });
  }

  function bindExport(btnId) {
    var b = document.getElementById(btnId);
    if (!b) return;
    b.addEventListener('click', function () {
      downloadExport();
      try {
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('mobius_loop_journal_export', { source: 'mobius_journal' });
        }
      } catch (e) {}
    });
  }

  function bindFabToggle() {
    var toggle = document.getElementById('tdb-verse-ribbon-toggle');
    var panel = document.getElementById('tdb-verse-ribbon-panel');
    if (!toggle || !panel) return;
    toggle.addEventListener('click', function () {
      var open = panel.hasAttribute('hidden') ? false : true;
      if (open) {
        panel.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        panel.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        try {
          var ta = document.getElementById('tdb-verse-ribbon-ta');
          if (ta) ta.focus();
        } catch (e) {}
      }
    });
  }

  function initBindings() {
    bindSave('mobius-v2-journal-input', 'mobius-v2-journal-save', 'mobius-v2-journal-status', 'Calm path (2 Tim 1:7)');
    bindSave('mobius-deep-journal-input', 'mobius-deep-journal-save', 'mobius-deep-journal-status', 'Deep Walk');
    bindExport('mobius-deep-journal-export');
    bindVerseRibbon();
    bindFabToggle();
  }

  window.TDB_mobiusJournal = {
    append: append,
    exportTxt: exportTxt,
    downloadExport: downloadExport,
    loadState: loadState
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBindings);
  } else {
    initBindings();
  }
})();
