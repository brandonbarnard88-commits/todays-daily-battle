(function () {
  'use strict';

  function byId(id) {
    return document.getElementById(id);
  }

  function getAllKeys() {
    var out = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key) out.push(key);
      }
    } catch (e) {}
    return out.sort();
  }

  function matchesAny(key, patterns) {
    return patterns.some(function (rx) { return rx.test(key); });
  }

  var GROUPS = [
    {
      label: 'Study, notes, highlights, and memorize',
      patterns: [/study/i, /note/i, /highlight/i, /memor/i, /reader/i, /bookmark/i, /tag/i]
    },
    {
      label: 'Prayer, journal, and personal reflection',
      patterns: [/prayer/i, /journal/i, /wghd/i, /god.*done/i]
    },
    {
      label: 'Plans, progress, and verse rhythm',
      patterns: [/plan/i, /progress/i, /battle/i, /streak/i, /verse/i, /recent/i]
    },
    {
      label: 'Appearance, audio, and accessibility',
      patterns: [/theme/i, /contrast/i, /text/i, /voice/i, /ambient/i, /audio/i, /motion/i]
    },
    {
      label: 'Install and notification preferences',
      patterns: [/notif/i, /push/i, /install/i, /prompt/i]
    }
  ];

  function countForGroup(keys, group) {
    return keys.filter(function (key) { return matchesAny(key, group.patterns); }).length;
  }

  function renderSummary() {
    var list = byId('privacy-device-data-list');
    if (!list) return;
    var keys = getAllKeys();
    list.textContent = '';
    if (!keys.length) {
      var empty = document.createElement('li');
      empty.textContent = 'No local Today’s Daily Battle data is stored in this browser right now.';
      list.appendChild(empty);
      return;
    }
    GROUPS.forEach(function (group) {
      var li = document.createElement('li');
      var count = countForGroup(keys, group);
      li.textContent = group.label + ': ' + (count ? count + ' saved item' + (count === 1 ? '' : 's') : 'none right now');
      list.appendChild(li);
    });
    var total = document.createElement('li');
    var strong = document.createElement('strong');
    strong.textContent = 'Total local keys on this browser:';
    total.appendChild(strong);
    total.appendChild(document.createTextNode(' ' + keys.length + '.'));
    list.appendChild(total);
  }

  function setStatus(message, isError) {
    var el = byId('privacy-device-data-status');
    if (!el) return;
    el.textContent = message;
    el.style.color = isError ? 'var(--muted, #b3c1d3)' : '';
  }

  function downloadJson(filename, payload) {
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      try { URL.revokeObjectURL(url); } catch (e) {}
      try { a.remove(); } catch (e2) {}
    }, 1200);
  }

  function exportSnapshot() {
    var keys = getAllKeys();
    var data = {};
    keys.forEach(function (key) {
      try {
        data[key] = localStorage.getItem(key);
      } catch (e) {
        data[key] = null;
      }
    });
    downloadJson('tdb-local-data-' + new Date().toISOString().slice(0, 10) + '.json', {
      source: 'todaysdailybattle-local-browser-snapshot',
      exportedAt: new Date().toISOString(),
      keyCount: keys.length,
      data: data
    });
    setStatus('Local snapshot download started for this browser.');
  }

  function removeMatchingKeys(mode) {
    var keys = getAllKeys();
    var removed = 0;
    keys.forEach(function (key) {
      var shouldRemove = mode === 'study'
        ? matchesAny(key, GROUPS[0].patterns)
        : /^(tdb|readingPlan|planLastDay|mystudy|myStudy|savedVerses|verse|streak|battle|armor|family|kids|journal|prayer)/i.test(key);
      if (!shouldRemove) return;
      try {
        localStorage.removeItem(key);
        removed++;
      } catch (e) {}
    });
    return removed;
  }

  function clearDatabases(mode) {
    if (!window.indexedDB || mode !== 'all') return;
    ['tdb-idb', 'tdb_lib', 'tdb_verse_image_v1'].forEach(function (dbName) {
      try { indexedDB.deleteDatabase(dbName); } catch (e) {}
    });
  }

  function wire() {
    var exportBtn = byId('privacy-export-local');
    var clearStudyBtn = byId('privacy-clear-study');
    var clearAllBtn = byId('privacy-clear-local');
    if (!exportBtn || !clearStudyBtn || !clearAllBtn) return;

    renderSummary();

    exportBtn.addEventListener('click', exportSnapshot);
    clearStudyBtn.addEventListener('click', function () {
      if (!window.confirm('Clear local study notes, highlights, and memorize rhythm from this browser?')) return;
      var removed = removeMatchingKeys('study');
      setStatus((removed || 0) + ' study item' + (removed === 1 ? '' : 's') + ' cleared from this browser.');
      renderSummary();
    });
    clearAllBtn.addEventListener('click', function () {
      if (!window.confirm('Clear local Today’s Daily Battle data from this browser? This removes saved notes, plans, prayer drafts, settings, and offline-ready caches on this device.')) return;
      var removed = removeMatchingKeys('all');
      clearDatabases('all');
      setStatus((removed || 0) + ' local item' + (removed === 1 ? '' : 's') + ' cleared from this browser. Offline caches may take a moment to disappear.');
      renderSummary();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
