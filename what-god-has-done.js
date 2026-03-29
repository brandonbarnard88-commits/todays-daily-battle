(function () {
  'use strict';

  var STORAGE_KEY = 'tdb_what_god_has_done_v1';
  var VERSION = 1;
  var MAX_TITLE = 120;
  var MAX_BODY = 2000;

  function byId(id) {
    return document.getElementById(id);
  }

  function genId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'wghd_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
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
            title: typeof x.title === 'string' ? x.title.slice(0, MAX_TITLE) : '',
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
      return false;
    }
  }

  function sortEntries(entries) {
    return entries.slice().sort(function (a, b) {
      return String(b.createdAt).localeCompare(String(a.createdAt));
    });
  }

  function formatWhen(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch (e) {
      return iso;
    }
  }

  function buildPlainExport(entries) {
    var lines = [];
    lines.push("What God has done — export (Today's Daily Battle)");
    lines.push('Private journal; KJV site. Exported from this device.');
    lines.push('');
    sortEntries(entries).forEach(function (e) {
      lines.push('---');
      lines.push(formatWhen(e.createdAt));
      if (e.title) lines.push(e.title);
      lines.push(e.body);
      lines.push('');
    });
    return lines.join('\n');
  }

  function trackSafe(eventName, params) {
    if (typeof trackEvent !== 'function') return;
    var p = params && typeof params === 'object' ? params : {};
    trackEvent(eventName, p);
  }

  var editingId = null;
  var state = loadState();

  function setStatus(msg, isErr) {
    var el = byId('wghd-status');
    if (!el) return;
    el.textContent = msg || '';
    el.classList.toggle('wghd-status--err', !!isErr);
  }

  function clearForm() {
    var title = byId('wghd-title');
    var body = byId('wghd-body');
    var sectionTitle = byId('wghd-form-section-title');
    var cancelBtn = byId('wghd-cancel-edit');
    if (title) title.value = '';
    if (body) body.value = '';
    editingId = null;
    if (sectionTitle) sectionTitle.textContent = 'Add an entry';
    if (cancelBtn) cancelBtn.classList.add('hidden');
    updateCharCount();
  }

  function updateCharCount() {
    var body = byId('wghd-body');
    var countEl = byId('wghd-body-count');
    if (!body || !countEl) return;
    var n = body.value.length;
    countEl.textContent = n + ' / ' + MAX_BODY;
  }

  function renderList() {
    var listEl = byId('wghd-list');
    var emptyEl = byId('wghd-empty');
    if (!listEl) return;
    listEl.textContent = '';
    var sorted = sortEntries(state.entries);
    if (sorted.length === 0) {
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }
    if (emptyEl) emptyEl.classList.add('hidden');

    sorted.forEach(function (e) {
      var li = document.createElement('li');
      li.className = 'wghd-entry';

      var meta = document.createElement('p');
      meta.className = 'wghd-entry-meta';
      var time = document.createElement('time');
      time.dateTime = e.createdAt;
      time.textContent = formatWhen(e.createdAt);
      meta.appendChild(time);
      li.appendChild(meta);

      if (e.title) {
        var ht = document.createElement('h3');
        ht.className = 'wghd-entry-title';
        ht.textContent = e.title;
        li.appendChild(ht);
      }

      var bodyP = document.createElement('p');
      bodyP.className = 'wghd-entry-body';
      bodyP.textContent = e.body;
      li.appendChild(bodyP);

      var actions = document.createElement('div');
      actions.className = 'wghd-entry-actions';

      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn btn-secondary';
      editBtn.textContent = 'Edit';
      editBtn.setAttribute('aria-label', 'Edit entry from ' + formatWhen(e.createdAt));
      editBtn.addEventListener('click', function () {
        beginEdit(e);
      });
      actions.appendChild(editBtn);

      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn btn-secondary wghd-btn-danger';
      delBtn.textContent = 'Remove';
      delBtn.setAttribute('aria-label', 'Remove this entry');
      delBtn.addEventListener('click', function () {
        if (!confirm('Remove this entry from this device? This cannot be undone.')) return;
        state.entries = state.entries.filter(function (x) {
          return x.id !== e.id;
        });
        if (!saveState(state)) {
          setStatus('Could not save after remove. Check storage.', true);
          state = loadState();
          renderList();
          return;
        }
        if (editingId === e.id) clearForm();
        setStatus('Entry removed.');
        renderList();
        trackSafe('wghd_entry_remove', { remaining: state.entries.length });
      });
      actions.appendChild(delBtn);

      li.appendChild(actions);
      listEl.appendChild(li);
    });
  }

  function beginEdit(e) {
    editingId = e.id;
    var title = byId('wghd-title');
    var body = byId('wghd-body');
    var sectionTitle = byId('wghd-form-section-title');
    var cancelBtn = byId('wghd-cancel-edit');
    if (title) title.value = e.title || '';
    if (body) body.value = e.body || '';
    if (sectionTitle) sectionTitle.textContent = 'Edit entry';
    if (cancelBtn) cancelBtn.classList.remove('hidden');
    updateCharCount();
    var card = byId('wghd-form-card');
    if (card && card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (title) title.focus();
    setStatus('Editing saved entry. Save to update, or cancel.');
  }

  function saveEntry() {
    var titleIn = byId('wghd-title');
    var bodyIn = byId('wghd-body');
    if (!bodyIn) return;
    var title = clampStr(titleIn ? titleIn.value : '', MAX_TITLE);
    var body = clampStr(bodyIn.value, MAX_BODY);
    if (!body) {
      setStatus('Write something short first, or cancel.', true);
      bodyIn.focus();
      return;
    }

    var wasEdit = !!editingId;

    if (editingId) {
      var idx = state.entries.findIndex(function (x) {
        return x.id === editingId;
      });
      if (idx === -1) {
        clearForm();
        setStatus('That entry was missing; form cleared.', true);
        return;
      }
      state.entries[idx] = {
        id: state.entries[idx].id,
        createdAt: state.entries[idx].createdAt,
        title: title,
        body: body
      };
    } else {
      state.entries.push({
        id: genId(),
        createdAt: new Date().toISOString(),
        title: title,
        body: body
      });
    }

    if (!saveState(state)) {
      setStatus('Could not save. Storage may be full or blocked.', true);
      return;
    }

    clearForm();
    setStatus(wasEdit ? 'Entry updated.' : 'Saved. Only this device holds it until you export.');
    renderList();
    trackSafe('wghd_entry_save', { count: state.entries.length, edit: wasEdit });
  }

  function clearAll() {
    if (
      !confirm(
        'Erase every entry on this device? This cannot be undone. Export first if you need a copy.'
      )
    ) {
      return;
    }
    state = { version: VERSION, entries: [] };
    if (!saveState(state)) {
      setStatus('Could not clear storage.', true);
      return;
    }
    clearForm();
    setStatus('All entries cleared on this device.');
    renderList();
    trackSafe('wghd_clear_all', {});
  }

  function downloadText(filename, text) {
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  function exportTxt() {
    var text = buildPlainExport(state.entries);
    var stamp = new Date().toISOString().slice(0, 10);
    downloadText('what-god-has-done-' + stamp + '.txt', text);
    setStatus('Text file downloaded.');
    trackSafe('wghd_export', { format: 'txt', entry_count: state.entries.length });
  }

  function exportJson() {
    var payload = {
      exportedAt: new Date().toISOString(),
      source: "Today's Daily Battle — What God has done",
      version: VERSION,
      entries: sortEntries(state.entries)
    };
    var text = JSON.stringify(payload, null, 2);
    var stamp = new Date().toISOString().slice(0, 10);
    downloadText('what-god-has-done-' + stamp + '.json', text);
    setStatus('JSON file downloaded.');
    trackSafe('wghd_export', { format: 'json', entry_count: state.entries.length });
  }

  function copyAll() {
    var text = buildPlainExport(state.entries);
    if (!text) {
      setStatus('Nothing to copy yet.', true);
      return;
    }
    function done(ok) {
      setStatus(ok ? 'Copied to clipboard.' : 'Copy failed; try Export instead.', !ok);
      if (ok) trackSafe('wghd_export', { format: 'clipboard', entry_count: state.entries.length });
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        done(true);
      }).catch(function () {
        done(false);
      });
    } else {
      done(false);
    }
  }

  function init() {
    var saveBtn = byId('wghd-save');
    var cancelBtn = byId('wghd-cancel-edit');
    var bodyIn = byId('wghd-body');
    var exportTxtBtn = byId('wghd-export-txt');
    var exportJsonBtn = byId('wghd-export-json');
    var copyBtn = byId('wghd-copy-all');
    var clearAllBtn = byId('wghd-clear-all');

    if (saveBtn) saveBtn.addEventListener('click', saveEntry);
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        clearForm();
        setStatus('Draft cleared.');
      });
    }
    if (bodyIn) bodyIn.addEventListener('input', updateCharCount);
    var titleIn = byId('wghd-title');
    if (titleIn) titleIn.addEventListener('input', function () {
      if (titleIn.value.length > MAX_TITLE) titleIn.value = titleIn.value.slice(0, MAX_TITLE);
    });

    if (exportTxtBtn) exportTxtBtn.addEventListener('click', exportTxt);
    if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportJson);
    if (copyBtn) copyBtn.addEventListener('click', copyAll);
    if (clearAllBtn) clearAllBtn.addEventListener('click', clearAll);

    updateCharCount();
    renderList();
    trackSafe('wghd_open', { entry_count: state.entries.length });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
