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

  function setTab(tabName) {
    var myTab = byId('tab-my-study');
    var highlightsTab = byId('tab-highlights');
    var joinTab = byId('tab-join-study');
    var myPanel = byId('panel-my-study');
    var highlightsPanel = byId('panel-highlights');
    var joinPanel = byId('panel-join-study');
    if (!myTab || !highlightsTab || !joinTab || !myPanel || !highlightsPanel || !joinPanel) return;
    var isMy = tabName === 'my';
    var isHighlights = tabName === 'highlights';
    var isJoin = tabName === 'join';
    myTab.classList.toggle('active', isMy);
    highlightsTab.classList.toggle('active', isHighlights);
    joinTab.classList.toggle('active', isJoin);
    myTab.setAttribute('aria-selected', isMy ? 'true' : 'false');
    highlightsTab.setAttribute('aria-selected', isHighlights ? 'true' : 'false');
    joinTab.setAttribute('aria-selected', isJoin ? 'true' : 'false');
    myPanel.classList.toggle('hidden', !isMy);
    highlightsPanel.classList.toggle('hidden', !isHighlights);
    joinPanel.classList.toggle('hidden', !isJoin);
  }

  function renderSelectedVerse(study) {
    var refEl = byId('mystudy-verse-ref');
    var textEl = byId('mystudy-verse-text');
    if (!refEl || !textEl) return;
    refEl.textContent = study.verseRef || 'No verse selected yet.';
    textEl.textContent = study.verseText || '';
  }

  function renderSharedList() {
    var listEl = byId('mystudy-shared-list');
    if (!listEl) return;
    var items = loadShared();
    if (!items.length) {
      listEl.innerHTML = '<p class="section-note">No shared studies joined yet.</p>';
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
      if (status) status.textContent = 'Could not load Bible search right now.';
      return false;
    }
  }

  function renderResults(results, study, handlers) {
    var listEl = byId('mystudy-results');
    if (!listEl) return;
    listEl.innerHTML = '';
    if (!results.length) {
      listEl.innerHTML = '<li class="section-note">No matches found.</li>';
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
      if (status) status.textContent = 'Type a topic, keyword, or verse reference.';
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
    byId('tab-highlights')?.addEventListener('click', function () { setTab('highlights'); });
    byId('tab-join-study')?.addEventListener('click', function () { setTab('join'); });

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
          if (shareStatusEl) shareStatusEl.textContent = 'Copy failed. Select and copy manually.';
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
