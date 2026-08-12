/**
 * Pastor Builder — Editable outline, drag-reorder sections, save, export PDF.
 * Sermon Notes export (full packet), Share Draft (team collab via Supabase).
 * Sections: Title, Scripture, Points, Illustration, Application, Prayer.
 */
(function () {
  'use strict';

  const DRAFT_KEY = 'pastorBuilderDraft';
  const PASTOR_REFLECTION_KEY = 'pastorReflection';
  const SECTION_TYPES = [
    { id: 'intro', label: 'Intro' },
    { id: 'scripture', label: 'Scripture' },
    { id: 'points', label: 'Points' },
    { id: 'illustration', label: 'Illustration' },
    { id: 'application', label: 'Application' },
    { id: 'prayer', label: 'Prayer' }
  ];

  function getDailyKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getOrCreateAnonId() {
    try {
      var id = localStorage.getItem('pastorHubAnonId');
      if (id && id.length >= 10) return id;
      id = 'ph_' + Date.now() + '_' + Math.random().toString(36).slice(2, 12);
      localStorage.setItem('pastorHubAnonId', id);
      return id;
    } catch (e) { return 'ph_anon'; }
  }

  function getTodayReflection() {
    try {
      var raw = localStorage.getItem(PASTOR_REFLECTION_KEY);
      var val = raw ? JSON.parse(raw) : {};
      return val[getDailyKey()] || '';
    } catch (e) { return ''; }
  }

  function showToast(msg) {
    var el = document.getElementById('pastor-builder-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { el.classList.add('hidden'); }, 3500);
  }

  function getDraft() {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    } catch (e) { return {}; }
  }

  function setDraft(draft) {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {}
  }

  function getSectionsFromDraft(draft) {
    if (draft.sections && Array.isArray(draft.sections) && draft.sections.length > 0) {
      return draft.sections;
    }
    var fromLegacy = [];
    if (draft.outline) fromLegacy.push({ type: 'points', content: draft.outline });
    if (draft.points) fromLegacy.push({ type: 'illustration', content: draft.points });
    if (draft.application) fromLegacy.push({ type: 'application', content: draft.application });
    if (draft.prayer) fromLegacy.push({ type: 'prayer', content: draft.prayer });
    if (fromLegacy.length > 0) {
      var out = [];
      if (draft.textRef) out.push({ type: 'scripture', content: draft.textRef });
      return out.concat(fromLegacy);
    }
    return [
      { type: 'intro', content: '' },
      { type: 'scripture', content: draft.textRef || draft.scripture || '' },
      { type: 'points', content: '' },
      { type: 'illustration', content: '' },
      { type: 'application', content: '' },
      { type: 'prayer', content: '' }
    ];
  }

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

  function getTypeLabel(typeId) {
    var t = SECTION_TYPES.find(function (x) { return x.id === typeId; });
    return t ? t.label : typeId;
  }

  function renderSections(sections) {
    var container = document.getElementById('pastor-builder-sections');
    if (!container) return;

    container.innerHTML = '';
    for (var i = 0; i < sections.length; i++) {
      var s = sections[i];
      var type = s.type || 'points';
      var content = s.content || '';
      var block = document.createElement('div');
      block.className = 'pastor-builder-block';
      block.draggable = true;
      block.dataset.index = String(i);
      block.dataset.type = type;
      block.innerHTML = '<span class="pastor-drag-handle" aria-hidden="true">&#8942;</span>' +
        '<div class="pastor-block-content">' +
        '<span class="pastor-block-type">' + escapeHtml(getTypeLabel(type)) + '</span>' +
        '<textarea class="pastor-block-text" rows="2" data-index="' + i + '">' + escapeHtml(content) + '</textarea>' +
        '</div>';
      container.appendChild(block);
    }

    wireDragDrop(container);
    wireSectionInputs(container);
  }

  function wireSectionInputs(container) {
    if (!container) return;
    container.querySelectorAll('.pastor-block-text').forEach(function (ta) {
      ta.addEventListener('input', function () {
        var idx = parseInt(ta.dataset.index, 10);
        var blocks = container.querySelectorAll('.pastor-builder-block');
        var block = blocks[idx];
        if (block) block.dataset.dirty = '1';
      });
    });
  }

  function wireDragDrop(container) {
    if (!container) return;
    var dragged = null;

    container.querySelectorAll('.pastor-builder-block').forEach(function (block) {
      block.addEventListener('dragstart', function (e) {
        dragged = block;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', block.dataset.index);
        block.classList.add('pastor-dragging');
      });
      block.addEventListener('dragend', function () {
        block.classList.remove('pastor-dragging');
        dragged = null;
      });
      block.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragged && dragged !== block) block.classList.add('pastor-drag-over');
      });
      block.addEventListener('dragleave', function () {
        block.classList.remove('pastor-drag-over');
      });
      block.addEventListener('drop', function (e) {
        e.preventDefault();
        block.classList.remove('pastor-drag-over');
        if (!dragged || dragged === block) return;
        var fromIdx = parseInt(dragged.dataset.index, 10);
        var toIdx = parseInt(block.dataset.index, 10);
        if (fromIdx === toIdx) return;
        reorderSections(container, fromIdx, toIdx);
      });
    });
  }

  function reorderSections(container, fromIdx, toIdx) {
    var sections = collectSectionsFromDOM(container);
    var item = sections.splice(fromIdx, 1)[0];
    sections.splice(toIdx, 0, item);
    renderSections(sections);
    saveToDraft();
  }

  function collectSectionsFromDOM(container) {
    var sections = [];
    container.querySelectorAll('.pastor-builder-block').forEach(function (block) {
      var ta = block.querySelector('.pastor-block-text');
      sections.push({
        type: block.dataset.type || 'points',
        content: ta ? ta.value : ''
      });
    });
    return sections;
  }

  function collectFullDraft() {
    var title = (document.getElementById('pastor-builder-title') && document.getElementById('pastor-builder-title').value) || '';
    var scripture = (document.getElementById('pastor-builder-scripture') && document.getElementById('pastor-builder-scripture').value) || '';
    var container = document.getElementById('pastor-builder-sections');
    var sections = container ? collectSectionsFromDOM(container) : [];
    return { title: title, textRef: scripture, scripture: scripture, sections: sections };
  }

  function saveToDraft() {
    setDraft(collectFullDraft());
  }

  function loadFromDraft() {
    var draft = getDraft();
    var titleEl = document.getElementById('pastor-builder-title');
    var scriptureEl = document.getElementById('pastor-builder-scripture');
    if (titleEl) titleEl.value = draft.title || '';
    if (scriptureEl) scriptureEl.value = draft.textRef || draft.scripture || '';
    var sections = getSectionsFromDraft(draft);
    renderSections(sections);
  }

  function addSection() {
    var container = document.getElementById('pastor-builder-sections');
    if (!container) return;
    var sections = collectSectionsFromDOM(container);
    sections.push({ type: 'points', content: '' });
    renderSections(sections);
    saveToDraft();
  }

  function exportPDF() {
    var draft = collectFullDraft();
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
      html += '<div class="section"><span class="section-type">' + escapeHtml(getTypeLabel(s.type)) + '</span><p>' + escapeHtml(s.content).replace(/\n/g, '<br>') + '</p></div>';
    }
    html += '</body></html>';

    openPrintWindow(html);
  }

  /** Extract verse refs from text (e.g. John 3:16, Romans 8:28). */
  function extractVerseRefs(text) {
    if (!text || typeof text !== 'string') return [];
    var re = /\b(\d?\s*\w+(?:\s+\w+)?\s+\d+:\d+(?:-\d+)?)\b/gi;
    var m;
    var seen = {};
    var refs = [];
    while ((m = re.exec(text)) !== null) {
      var r = m[1].replace(/\s+/g, ' ').trim();
      if (!seen[r]) { seen[r] = true; refs.push(r); }
    }
    return refs;
  }

  function getVerseText(ref) {
    var b = window.bible || (typeof bible !== 'undefined' ? bible : {});
    var getText = window.getBibleVerseText || (typeof getBibleVerseText === 'function' ? getBibleVerseText : null);
    if (b[ref]) return b[ref];
    if (getText) return getText(ref) || '';
    return '';
  }

  function exportFullNotes() {
    var JsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF) {
      showToast('Loading PDF library…');
      setTimeout(exportFullNotes, 300);
      return;
    }
    var btn = document.getElementById('pastor-export-notes');
    var label = btn && btn.querySelector('.pastor-btn-notes-label');
    var spinner = btn && btn.querySelector('.pastor-btn-spinner');
    if (btn) btn.disabled = true;
    if (label) label.textContent = 'Creating…';
    if (spinner) spinner.classList.remove('hidden');

    var draft = collectFullDraft();
    var title = draft.title || 'Sermon';
    var scripture = draft.textRef || draft.scripture || '';
    var sections = draft.sections || [];
    var reflection = getTodayReflection();
    var pastorName = getOrCreateAnonId();
    var dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    var allRefs = new Set();
    if (scripture) allRefs.add(scripture.trim());
    for (var i = 0; i < sections.length; i++) {
      extractVerseRefs(sections[i].content || '').forEach(function (r) { allRefs.add(r); });
    }
    var refList = Array.from(allRefs).filter(function (r) { return r; });

    try {
      var doc = new JsPDF('p', 'mm', 'a4');
      var pageW = doc.internal.pageSize.getWidth();
      var pageH = doc.internal.pageSize.getHeight();
      var margin = 14;
      var colW = (pageW - margin * 3) / 2;
      var y = margin;

      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.setFont('helvetica', 'bold');
      var header = 'Sermon Notes: ' + dateStr + (pastorName ? ' – ' + pastorName : '');
      doc.text(header, pageW / 2, y, { align: 'center' });
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      if (reflection && reflection.trim()) {
        doc.setTextColor(59, 130, 246);
        doc.setFont('helvetica', 'bold');
        doc.text('What God showed me:', margin, y);
        y += 6;
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        var refLines = doc.splitTextToSize(reflection.trim(), pageW - margin * 2);
        doc.text(refLines, margin, y);
        y += refLines.length * 5 + 10;
      }

      doc.setTextColor(59, 130, 246);
      doc.setFont('helvetica', 'bold');
      doc.text('Outline', margin, y);
      y += 8;

      for (var j = 0; j < sections.length; j++) {
        var s = sections[j];
        var content = (s.content || '').trim();
        if (!content) continue;
        if (y > pageH - 30) { doc.addPage(); y = margin; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(59, 130, 246);
        doc.text(getTypeLabel(s.type) + ':', margin, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        var lines = doc.splitTextToSize(content, pageW - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * 4.5 + 6;
      }
      y += 6;

      if (refList.length > 0) {
        if (y > pageH - 40) { doc.addPage(); y = margin; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(59, 130, 246);
        doc.text('Verses', margin, y);
        y += 8;
        for (var k = 0; k < refList.length; k++) {
          if (y > pageH - 25) { doc.addPage(); y = margin; }
          var ref = refList[k];
          var vText = getVerseText(ref) || ref;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(59, 130, 246);
          doc.text(ref, margin, y);
          y += 5;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          var vLines = doc.splitTextToSize(vText, pageW - margin * 2);
          doc.text(vLines, margin, y);
          y += vLines.length * 4 + 6;
        }
      }

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Prepared with Pastor Hub – https://todaysdailybattle.com/pastor/', pageW / 2, pageH - 8, { align: 'center' });

      var filename = 'sermon-notes-' + getDailyKey() + '.pdf';
      doc.save(filename);
      showToast('Sermon notes exported!');
    } catch (err) {
      console.error('Export error:', err);
      showToast('PDF export did not finish. Please try again.');
    }

    if (btn) btn.disabled = false;
    if (label) label.textContent = 'Export Full Notes';
    if (spinner) spinner.classList.add('hidden');
  }

  function shareDraft() {
    var cfg = window.TDB_CONFIG || {};
    var url = cfg.SUPABASE_URL;
    var key = cfg.SUPABASE_ANON_KEY;
    if (!url || !key) {
      showToast('Share is not available from here. Check config.');
      return;
    }
    var btn = document.getElementById('pastor-share-draft');
    var label = btn && btn.querySelector('.pastor-share-label');
    var spinner = btn && btn.querySelector('.pastor-btn-spinner');
    if (btn) btn.disabled = true;
    if (label) label.textContent = 'Sharing…';
    if (spinner) spinner.classList.remove('hidden');

    var draft = collectFullDraft();
    var title = draft.title || 'Untitled';
    var sections = draft.sections || [];
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    try {
      var supabase = window.supabase && window.supabase.createClient ? window.supabase.createClient(url, key) : null;
      if (!supabase) {
        showToast('Saving service is still waking up—please try again.');
        if (btn) btn.disabled = false;
        if (label) label.textContent = 'Share Draft';
        if (spinner) spinner.classList.add('hidden');
        return;
      }
      supabase.from('sermon_drafts').insert({
        id: uuid,
        anon_id: getOrCreateAnonId(),
        title: title,
        scripture: draft.textRef || draft.scripture || '',
        outline_json: sections
      }).then(function (res) {
        if (res.error) {
          showToast('Draft share did not go through. ' + (res.error.message || 'Please try again.'));
          return;
        }
        var shareUrl = 'https://todaysdailybattle.com/pastor/builder.html?draft=' + uuid;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).then(function () {
            showToast('Share this link: ' + shareUrl);
          }).catch(function () {
            showToast('Share this link: ' + shareUrl);
          });
        } else {
          showToast('Share this link: ' + shareUrl);
        }
      }).catch(function (err) {
        console.error('Share error:', err);
        showToast('Draft share did not go through. Please try again.');
      }).finally(function () {
        if (btn) btn.disabled = false;
        if (label) label.textContent = 'Share Draft';
        if (spinner) spinner.classList.add('hidden');
      });
    } catch (e) {
      console.error('Share error:', e);
      showToast('Draft share did not go through. Please try again.');
      if (btn) btn.disabled = false;
      if (label) label.textContent = 'Share Draft';
      if (spinner) spinner.classList.add('hidden');
    }
  }

  function loadDraftFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var draftId = params.get('draft');
    if (!draftId) return false;

    var cfg = window.TDB_CONFIG || {};
    var url = cfg.SUPABASE_URL;
    var key = cfg.SUPABASE_ANON_KEY;
    if (!url || !key) return false;

    var supabase = window.supabase && window.supabase.createClient ? window.supabase.createClient(url, key) : null;
    if (!supabase) return false;

    supabase.from('sermon_drafts').select('title, scripture, outline_json').eq('id', draftId).single().then(function (res) {
      if (res.error || !res.data) return;
      var d = res.data;
      var titleEl = document.getElementById('pastor-builder-title');
      var scriptureEl = document.getElementById('pastor-builder-scripture');
      var outline = d.outline_json;
      var sections = Array.isArray(outline) ? outline : [];
      if (titleEl) titleEl.value = d.title || '';
      var scriptureContent = d.scripture || '';
      if (!scriptureContent) {
        for (var si = 0; si < sections.length; si++) {
          if (sections[si].type === 'scripture') { scriptureContent = sections[si].content || ''; break; }
        }
      }
      if (scriptureEl) scriptureEl.value = scriptureContent;
      renderSections(sections.length > 0 ? sections : [
        { type: 'intro', content: '' },
        { type: 'scripture', content: '' },
        { type: 'points', content: '' },
        { type: 'illustration', content: '' },
        { type: 'application', content: '' },
        { type: 'prayer', content: '' }
      ]);
      saveToDraft();
      showToast('Draft loaded.');
    }).catch(function () {});
    return true;
  }

  function init() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('draft')) {
      renderSections([
        { type: 'intro', content: '' },
        { type: 'scripture', content: '' },
        { type: 'points', content: '' },
        { type: 'illustration', content: '' },
        { type: 'application', content: '' },
        { type: 'prayer', content: '' }
      ]);
      loadDraftFromUrl();
    } else {
      if (params.get('load') === '1') {
        if (window.PastorHub && typeof window.PastorHub.getBuilderDraft === 'function') {
          var d = window.PastorHub.getBuilderDraft();
          if (d && (d.title || d.textRef || d.outline)) setDraft(d);
        }
      }
      loadFromDraft();
    }

    document.getElementById('pastor-builder-title')?.addEventListener('input', saveToDraft);
    document.getElementById('pastor-builder-scripture')?.addEventListener('input', saveToDraft);

    var addBtn = document.getElementById('pastor-add-section');
    if (addBtn) addBtn.addEventListener('click', addSection);

    var saveBtn = document.getElementById('pastor-save-draft');
    if (saveBtn) saveBtn.addEventListener('click', function () { saveToDraft(); showToast('Draft saved.'); });

    var exportBtn = document.getElementById('pastor-export-pdf');
    if (exportBtn) exportBtn.addEventListener('click', exportPDF);

    var exportNotesBtn = document.getElementById('pastor-export-notes');
    if (exportNotesBtn) exportNotesBtn.addEventListener('click', exportFullNotes);

    var shareBtn = document.getElementById('pastor-share-draft');
    if (shareBtn) shareBtn.addEventListener('click', shareDraft);

    var aiBtn = document.getElementById('pastor-ai-suggest-btn');
    if (aiBtn && !aiBtn.disabled) aiBtn.addEventListener('click', function () { showToast('AI Suggest coming soon.'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
