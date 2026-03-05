/**
 * Pastor Tools — Verse search, reference list, PDF export.
 * Uses script.js: bible, getBibleVerseText, runSearchWithInput (or manual lookup).
 */
(function () {
  'use strict';

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function openPrintWindow(html) {
    var win = window.open('', '_blank');
    if (!win) return null;
    var blob = new Blob([String(html || '')], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    win.location.href = url;
    win.onload = function () {
      try { win.print(); } catch (e) {}
      URL.revokeObjectURL(url);
      win.onafterprint = function () { try { win.close(); } catch (e2) {} };
    };
    return win;
  }

  function normalizeRef(ref) {
    if (!ref || typeof ref !== 'string') return '';
    return ref.replace(/\s+/g, ' ').trim();
  }

  function findVerse(ref) {
    var r = normalizeRef(ref);
    if (!r) return null;
    var b = window.bible || (typeof bible !== 'undefined' ? bible : {});
    var getText = window.getBibleVerseText || (typeof getBibleVerseText === 'function' ? getBibleVerseText : null);
    if (b[r]) return { ref: r, text: b[r] };
    if (getText) {
      var t = getText(r);
      if (t) return { ref: r, text: t };
    }
    return null;
  }

  function searchVerses(query) {
    var q = (query || '').trim().toLowerCase();
    if (!q) return [];

    var results = [];
    var b = window.bible || (typeof bible !== 'undefined' ? bible : {});
    if (!b || Object.keys(b).length === 0) return results;

    var refMatch = q.match(/^(\d?\s*\w+)\s+(\d+)(?::(\d+))?$/i);
    if (refMatch) {
      var ref = refMatch[1].replace(/\s+/g, ' ') + ' ' + refMatch[2] + (refMatch[3] ? ':' + refMatch[3] : '');
      var v = findVerse(ref);
      if (v) results.push(v);
    }

    if (results.length === 0) {
      var keys = Object.keys(b);
      for (var i = 0; i < keys.length && results.length < 8; i++) {
        var k = keys[i];
        var txt = b[k];
        if (txt && txt.toLowerCase().indexOf(q) !== -1) {
          results.push({ ref: k, text: txt });
        }
      }
    }

    if (results.length === 0 && b['John 3:16']) {
      results.push({ ref: 'John 3:16', text: b['John 3:16'] });
    }
    return results;
  }

  function renderVerseResults(results) {
    var container = document.getElementById('pastor-verse-results');
    if (!container) return;

    if (!results || results.length === 0) {
      container.innerHTML = '<p class="section-note">No verses found. Try a reference like John 3:16 or a word like hope.</p>';
      return;
    }

    var html = '';
    for (var i = 0; i < results.length; i++) {
      var v = results[i];
      var short = (v.text || '').slice(0, 120);
      if (v.text && v.text.length > 120) short += '...';
      html += '<div class="pastor-verse-result">';
      html += '<div><strong>' + escapeHtml(v.ref) + '</strong><p>' + escapeHtml(short) + '</p></div>';
      html += '<button type="button" class="pastor-insert-btn" data-ref="' + escapeHtml(v.ref) + '" data-text="' + escapeHtml(v.text || '').replace(/"/g, '&quot;') + '">Insert</button>';
      html += '</div>';
    }
    container.innerHTML = html;

    container.querySelectorAll('.pastor-insert-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ref = btn.getAttribute('data-ref');
        var text = btn.getAttribute('data-text');
        insertIntoBuilder(ref, text);
      });
    });
  }

  function insertIntoBuilder(ref, text) {
    var insert = (ref || '') + (text ? ': ' + text : '');
    try {
      var draft = JSON.parse(localStorage.getItem('pastorBuilderDraft') || '{}');
      var sections = draft.sections || [{ type: 'points', content: '' }];
      var pointsIdx = sections.findIndex(function (s) { return s.type === 'points'; });
      if (pointsIdx < 0) pointsIdx = 0;
      var existing = sections[pointsIdx] ? (sections[pointsIdx].content || '') : '';
      sections[pointsIdx] = { type: 'points', content: existing + (existing ? '\n' : '') + insert };
      draft.sections = sections;
      localStorage.setItem('pastorBuilderDraft', JSON.stringify(draft));
      window.location.href = 'builder.html?load=1';
    } catch (e) {
      window.location.href = 'builder.html';
    }
  }

  function doSearch() {
    var input = document.getElementById('pastor-verse-search');
    var q = input ? input.value : '';
    var results = searchVerses(q);
    renderVerseResults(results);
  }

  function addRefToBuilder(ref) {
    if (!ref || !ref.trim()) return;
    var v = findVerse(ref.trim());
    var text = v ? v.text : '';
    insertIntoBuilder(v ? v.ref : ref.trim(), text);
  }

  function addRefRow() {
    var container = document.getElementById('pastor-refs-more');
    if (!container) return;
    var count = container.querySelectorAll('.pastor-ref-item').length + 2;
    var div = document.createElement('div');
    div.className = 'pastor-ref-item';
    div.innerHTML = '<input type="text" id="pastor-ref-' + escapeHtml(String(count)) + '" placeholder="e.g., Rom 8:28">' +
      '<button type="button" class="pastor-insert-btn pastor-add-ref" data-target="pastor-ref-' + escapeHtml(String(count)) + '">Add</button>';
    container.appendChild(div);
    div.querySelector('.pastor-add-ref').addEventListener('click', function () {
      var input = document.getElementById('pastor-ref-' + count);
      addRefToBuilder(input ? input.value : '');
    });
  }

  function wireAddRefButtons() {
    document.querySelectorAll('.pastor-add-ref').forEach(function (btn) {
      var targetId = btn.getAttribute('data-target');
      if (!targetId) return;
      btn.addEventListener('click', function () {
        var input = document.getElementById(targetId);
        addRefToBuilder(input ? input.value : '');
      });
    });
  }

  function exportPDFFromTools() {
    try {
      var draft = JSON.parse(localStorage.getItem('pastorBuilderDraft') || '{}');
      var title = draft.title || 'Sermon';
      var scripture = draft.textRef || draft.scripture || '';
      var sections = draft.sections || [];
      var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Sermon – ' + escapeHtml(title) + '</title>';
      html += '<style>body{font-family:Georgia,serif;padding:32px;color:#0f172a;line-height:1.6;}';
      html += 'h1{font-size:1.5rem;margin-bottom:0.5rem;} .ref{color:#3b82f6;margin-bottom:1rem;}';
      html += '.section{margin:1rem 0;} .section-type{font-size:0.75rem;text-transform:uppercase;color:#64748b;}</style></head><body>';
      html += '<h1>' + escapeHtml(title) + '</h1>';
      if (scripture) html += '<p class="ref">' + escapeHtml(scripture) + '</p>';
      for (var i = 0; i < sections.length; i++) {
        var s = sections[i];
        if (!s.content || !s.content.trim()) continue;
        var typeLabel = s.type || 'Section';
        html += '<div class="section"><span class="section-type">' + escapeHtml(typeLabel) + '</span><p>' + escapeHtml(s.content).replace(/\n/g, '<br>') + '</p></div>';
      }
      if (sections.length === 0 && (draft.outline || draft.points)) {
        if (draft.outline) html += '<div class="section"><span class="section-type">Outline</span><p>' + escapeHtml(draft.outline).replace(/\n/g, '<br>') + '</p></div>';
        if (draft.points) html += '<div class="section"><span class="section-type">Points</span><p>' + escapeHtml(draft.points).replace(/\n/g, '<br>') + '</p></div>';
        if (draft.application) html += '<div class="section"><span class="section-type">Application</span><p>' + escapeHtml(draft.application).replace(/\n/g, '<br>') + '</p></div>';
        if (draft.prayer) html += '<div class="section"><span class="section-type">Prayer</span><p>' + escapeHtml(draft.prayer).replace(/\n/g, '<br>') + '</p></div>';
      }
      html += '</body></html>';
      openPrintWindow(html);
    } catch (e) {
      window.location.href = 'builder.html';
    }
  }

  function init() {
    var searchInput = document.getElementById('pastor-verse-search');
    var searchBtn = document.getElementById('pastor-search-btn');
    if (searchInput && searchBtn) {
      searchBtn.addEventListener('click', doSearch);
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
      });
    }

    document.getElementById('pastor-add-ref-row')?.addEventListener('click', addRefRow);
    wireAddRefButtons();

    var exportBtn = document.getElementById('pastor-export-pdf-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportPDFFromTools);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
