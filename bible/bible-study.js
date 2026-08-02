/**
 * Bible Study — search, highlight, notes. Saves to localStorage + syncs to Supabase.
 */
(function () {
  'use strict';

  const HIGHLIGHTS_KEY = 'bibleHighlights';
  const BIBLE_REFLECTION_KEY = 'bibleReflection';
  const KJV_URL = '../data/kjv-full.json';
  const BIBLE_USER_NAME_KEY = 'bibleUserName';
  const CHALLENGE_SHARED_KEY = 'challengeShared';
  const CHALLENGE_BONUS_APPLIED_KEY = 'challengeBonusApplied';

  var bible = {};
  var currentNoteRef = null;

  var PLAIN_MEANINGS = {
    'Philippians 4:6': 'Don\'t worry—pray with thanks and tell God what you need.',
    'Philippians 4:13': 'Christ gives me strength for whatever I face today.',
    'John 3:16': 'God loves you so much He sent Jesus. Believe in Him.',
    'Joshua 1:9': 'Be strong and courageous. God is with you.',
    'Psalm 23:1': 'God is my shepherd—I have everything I need.',
    'Isaiah 41:10': 'Don\'t fear. God is with you and will strengthen you.',
    'Romans 8:28': 'God works all things for good for those who love Him.',
    'Matthew 11:28': 'Come to Jesus when you\'re tired—He gives rest.',
    'Jeremiah 29:11': 'God has good plans for you—hope and a future.'
  };

  function getHighlights() {
    try {
      var raw = localStorage.getItem(HIGHLIGHTS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function getReflections() {
    try {
      var raw = localStorage.getItem(BIBLE_REFLECTION_KEY);
      var val = raw ? JSON.parse(raw) : {};
      var out = [];
      Object.keys(val).forEach(function (dateKey) {
        var entry = val[dateKey];
        var text = typeof entry === 'string' ? entry : (entry && entry.text ? entry.text : '');
        var verse = (entry && typeof entry === 'object' && entry.verse) ? entry.verse : '';
        if ((text || '').trim()) out.push({ date: dateKey, verse: verse, text: text.trim() });
      });
      out.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
      return out;
    } catch (e) { return []; }
  }

  function setHighlight(ref, note) {
    var h = getHighlights();
    h[ref] = { note: (note || '').trim(), highlighted: true };
    try { localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(h)); } catch (e) {}
    syncHighlightToSupabase(ref, h[ref].note);
  }

  function removeHighlight(ref) {
    var h = getHighlights();
    delete h[ref];
    try { localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(h)); } catch (e) {}
  }

  function getOrCreateAnonId() {
    var key = 'bibleHubAnonId';
    try {
      var id = localStorage.getItem(key);
      if (id && id.length > 10) return id;
      id = 'b-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(key, id);
      return id;
    } catch (e) { return 'b-anon-' + Date.now(); }
  }

  function syncHighlightToSupabase(ref, note) {
    var cfg = window.TDB_CONFIG || {};
    var supabaseUrl = cfg.SUPABASE_URL;
    var supabaseKey = cfg.SUPABASE_ANON_KEY;
    if (!navigator.onLine || !supabaseUrl || !supabaseKey) return;
    try {
      var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
      if (!supabase || !supabase.createClient) return;
      var client = supabase.createClient(supabaseUrl, supabaseKey);
      client.rpc('upsert_bible_highlight', { p_anon_id: getOrCreateAnonId(), p_verse_ref: ref, p_note: note || '' }).catch(function () {});
    } catch (e) {}
  }

  function loadBible() {
    return fetch(KJV_URL)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (arr) {
        bible = {};
        (arr || []).forEach(function (v) {
          if (v && v.ref && v.text) bible[v.ref] = v.text;
        });
        return bible;
      })
      .catch(function () {
        bible = {};
        return bible;
      });
  }

  function searchVerses(keyword) {
    var q = (keyword || '').trim().toLowerCase();
    if (!q || Object.keys(bible).length === 0) return [];
    var words = q.split(/\s+/).filter(Boolean);
    var matches = [];
    Object.keys(bible).forEach(function (ref) {
      var text = bible[ref];
      var norm = text.toLowerCase();
      var score = 0;
      var highlightedText = text;
      words.forEach(function (w) {
        if (norm.includes(w)) {
          score++;
          var re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
          highlightedText = highlightedText.replace(re, '<span class="highlight">$1</span>');
        }
      });
      if (score > 0) matches.push({ ref: ref, text: highlightedText, score: score });
    });
    matches.sort(function (a, b) { return b.score - a.score; });
    return matches.slice(0, 25);
  }

  function escapeHtml(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function renderResults(matches) {
    var container = document.getElementById('bible-study-verses');
    var hint = document.getElementById('bible-study-hint');
    if (!container) return;
    if (!hint) hint = { classList: { add: function () {}, remove: function () {} } };
    if (matches.length === 0) {
      hint.classList.remove('hidden');
      container.innerHTML = '<p class="bible-study-no-highlights">No verses match. Try another word.</p>';
      return;
    }
    hint.classList.add('hidden');
    var h = getHighlights();
    container.innerHTML = matches.map(function (m) {
      var plain = PLAIN_MEANINGS[m.ref] || '';
      var isHighlighted = !!(h[m.ref] && h[m.ref].highlighted);
      var cardClass = 'bible-study-verse-card' + (isHighlighted ? ' highlighted' : '');
      var editIcon = isHighlighted ? ' <span class="verse-edit-icon" aria-hidden="true">✏️</span>' : '';
      return '<div class="' + cardClass + '" data-ref="' + escapeHtml(m.ref) + '" role="button" tabindex="0">' +
        '<span class="verse-ref">' + escapeHtml(m.ref) + editIcon + '</span>' +
        '<p class="verse-text">' + m.text + '</p>' +
        (plain ? '<p class="verse-plain">Plain meaning: ' + escapeHtml(plain) + '</p>' : '') +
        '</div>';
    }).join('');
    container.querySelectorAll('.bible-study-verse-card').forEach(function (card) {
      card.addEventListener('click', function () { openNoteModal(card.dataset.ref); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNoteModal(card.dataset.ref); }
      });
    });
  }

  function openNoteModal(ref) {
    currentNoteRef = ref;
    var modal = document.getElementById('bible-study-note-modal');
    var title = document.getElementById('bible-study-note-title');
    var refEl = document.getElementById('bible-study-note-ref');
    var input = document.getElementById('bible-study-note-input');
    var removeBtn = document.getElementById('bible-study-note-remove');
    var h = getHighlights();
    var data = h[ref] || {};
    if (modal) modal.classList.remove('hidden');
    if (title) title.textContent = (data.highlighted ? 'Edit' : 'Add') + ' note';
    if (refEl) refEl.textContent = ref;
    if (input) {
      input.value = data.note || '';
      input.placeholder = 'This reminded me of…';
    }
    if (removeBtn) removeBtn.style.display = data.highlighted ? 'inline-block' : 'none';
    if (input) setTimeout(function () { input.focus(); }, 100);
  }

  function closeNoteModal() {
    currentNoteRef = null;
    var modal = document.getElementById('bible-study-note-modal');
    if (modal) modal.classList.add('hidden');
  }

  function saveNote() {
    if (!currentNoteRef) return;
    var input = document.getElementById('bible-study-note-input');
    var note = input ? input.value.trim() : '';
    setHighlight(currentNoteRef, note);
    closeNoteModal();
    if (document.getElementById('bible-study-no-highlights')) {
      document.getElementById('bible-study-no-highlights').classList.add('hidden');
    }
    renderHighlights();
    var searchInput = document.getElementById('bible-study-search-input');
    if (searchInput && searchInput.value.trim()) {
      renderResults(searchVerses(searchInput.value.trim()));
    }
  }

  function removeNote() {
    if (!currentNoteRef) return;
    removeHighlight(currentNoteRef);
    closeNoteModal();
    renderHighlights();
    var searchInput = document.getElementById('bible-study-search-input');
    if (searchInput && searchInput.value.trim()) {
      renderResults(searchVerses(searchInput.value.trim()));
    }
  }

  function getUserName() {
    try {
      var n = localStorage.getItem(BIBLE_USER_NAME_KEY);
      return (n && typeof n === 'string') ? n.trim() : '';
    } catch (e) { return ''; }
  }

  function getWeekKey() {
    return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  }

  function getChallengeShared() {
    try {
      var t = localStorage.getItem(CHALLENGE_SHARED_KEY);
      return t ? parseInt(t, 10) : null;
    } catch (e) { return null; }
  }

  function setChallengeShared() {
    try {
      localStorage.setItem(CHALLENGE_SHARED_KEY, String(Date.now()));
    } catch (e) {}
  }

  function isChallengeSharedThisWeek() {
    var t = getChallengeShared();
    if (!t) return false;
    var weekKey = Math.floor(t / (7 * 24 * 60 * 60 * 1000));
    return weekKey === getWeekKey();
  }

  function createVersePng(ref, text, note) {
    var canvas = document.createElement('canvas');
    var w = 400;
    var h = 240;
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 20px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(ref, w / 2, 50);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px Georgia';
    ctx.textAlign = 'center';
    var lines = (text || '').slice(0, 120).match(/.{1,40}(\s|$)/g) || [text || ''];
    var y = 90;
    for (var i = 0; i < Math.min(3, lines.length); i++) {
      ctx.fillText((lines[i] || '').trim(), w / 2, y);
      y += 28;
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Less scroll. More soul. #BibleHub', w / 2, h - 30);
    return canvas.toDataURL('image/png');
  }

  function doChallengeShare() {
    var h = getHighlights();
    var refs = Object.keys(h).filter(function (r) { return h[r] && h[r].highlighted; });
    if (refs.length === 0) {
      showChallengeToast('No highlights saved yet. Add one first to unlock challenge sharing.');
      return;
    }
    if (isChallengeSharedThisWeek()) {
      showChallengeToast('Done! Come back next week.');
      return;
    }
    var idx = Math.floor(Math.random() * refs.length);
    var ref = refs[idx];
    var data = h[ref] || {};
    var text = bible[ref] || '';
    var note = (data.note || '').trim();
    var shareText = 'Check out ' + ref + (note ? ' – my note: "' + note.slice(0, 60) + (note.length > 60 ? '…' : '') + '"' : '') + ' #BibleHub';
    var shareData = { title: ref, text: shareText, url: 'https://todaysdailybattle.com/bible/study.html' };
    try {
      var png = createVersePng(ref, text, note);
      var blob = dataUrlToBlob(png);
      var file = new File([blob], 'verse.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        shareData.files = [file];
      }
    } catch (e) {}
    if (navigator.share) {
      navigator.share(shareData).then(function () {
        setChallengeShared();
        showChallengeToast('Done! +1 streak');
        updateChallengeUI();
      }).catch(function (err) {
        if (err.name !== 'AbortError') showChallengeToast('Share cancelled');
      });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText + ' ' + shareData.url).then(function () {
        setChallengeShared();
        showChallengeToast('Done! +1 streak');
        updateChallengeUI();
      }).catch(function () {});
    } else {
      showChallengeToast('Share not supported');
    }
  }

  function dataUrlToBlob(dataUrl) {
    var parts = dataUrl.split(',');
    var mime = parts[0].match(/:(.*?);/)[1];
    var bstr = atob(parts[1]);
    var n = bstr.length;
    var u8 = new Uint8Array(n);
    for (var i = 0; i < n; i++) u8[i] = bstr.charCodeAt(i);
    return new Blob([u8], { type: mime });
  }

  function showChallengeToast(msg) {
    var toast = document.getElementById('verse-challenge-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(function () { toast.classList.add('hidden'); }, 2500);
  }

  function updateChallengeUI() {
    var challenge = document.getElementById('verse-challenge');
    var btn = document.getElementById('challenge-share');
    var text = challenge && challenge.querySelector('.verse-challenge-text');
    if (!challenge || !btn) return;
    var h = getHighlights();
    var refs = Object.keys(h).filter(function (r) { return h[r] && h[r].highlighted; });
    if (isChallengeSharedThisWeek()) {
      if (text) text.textContent = '🏆 Done! Come back next week for another +1.';
      btn.textContent = 'Shared!';
      btn.disabled = true;
    } else if (refs.length === 0) {
      if (text) text.textContent = '🏆 Share a verse this week for +1 streak! (Add a highlight first)';
      btn.textContent = 'Share Now';
      btn.disabled = true;
    } else {
      if (text) text.textContent = '🏆 Share a verse this week for +1 streak!';
      btn.textContent = 'Share Now';
      btn.disabled = false;
    }
  }

  function exportToPdf() {
    var btn = document.getElementById('export-notes');
    var label = btn && btn.querySelector('.export-notes-label');
    var spinner = btn && btn.querySelector('.export-notes-spinner');
    var JsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF) {
      if (label) label.textContent = 'Loading…';
      setTimeout(function () { exportToPdf(); }, 300);
      return;
    }
    var h = getHighlights();
    var refs = Object.keys(h).filter(function (r) { return h[r] && h[r].highlighted; });
    var reflections = getReflections();
    if (refs.length === 0 && reflections.length === 0) {
      if (label) label.textContent = 'No highlights or reflections to export';
      setTimeout(function () { if (label) label.textContent = 'Export to PDF'; }, 2000);
      return;
    }
    if (btn) btn.disabled = true;
    if (label) label.textContent = 'Creating PDF…';
    if (spinner) spinner.classList.remove('hidden');
    try {
      var doc = new JsPDF('p', 'mm', 'a4');
      var pageW = doc.internal.pageSize.getWidth();
      var pageH = doc.internal.pageSize.getHeight();
      var margin = 14;
      var colW = (pageW - margin * 3) / 2;
      var gap = 10;
      var y = margin;
      var userName = getUserName();
      var header = 'My Bible Notes' + (userName ? ' – ' + userName : '');
      var exportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.setFontSize(18);
      doc.setTextColor(59, 130, 246);
      doc.setFont('helvetica', 'bold');
      doc.text(header, pageW / 2, y, { align: 'center' });
      y += 8;
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text('Exported ' + exportDate, pageW / 2, y, { align: 'center' });
      y += 14;
      var col = 0;
      var rowY = y;
      var cellH = 42;
      for (var i = 0; i < refs.length; i++) {
        var ref = refs[i];
        var data = h[ref] || {};
        var text = bible[ref] || '';
        var note = (data.note || '').trim();
        var x = margin + col * (colW + margin);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(59, 130, 246);
        var refLines = doc.splitTextToSize(ref, colW);
        doc.text(refLines, x, rowY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        var textLines = doc.splitTextToSize(text || ref, colW);
        doc.text(textLines.slice(0, 4), x, rowY + 6);
        var ny = rowY + 6 + textLines.slice(0, 4).length * 4;
        if (note) {
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(148, 163, 184);
          var noteLines = doc.splitTextToSize(note, colW);
          doc.text(noteLines.slice(0, 2), x, ny + 4);
          ny += 4 + noteLines.slice(0, 2).length * 4;
        }
        doc.setTextColor(212, 175, 55);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(exportDate, x, ny + 2);
        if (col === 0) {
          col = 1;
        } else {
          col = 0;
          rowY += cellH + gap;
        }
        if (rowY > pageH - margin - 25) {
          doc.addPage();
          rowY = margin;
        }
      }
      if (reflections.length > 0) {
        if (rowY > margin + 20) {
          doc.addPage();
          rowY = margin;
        }
        doc.setFontSize(14);
        doc.setTextColor(212, 175, 55);
        doc.setFont('helvetica', 'bold');
        doc.text('Reflections', margin, rowY);
        rowY += 10;
        doc.setFont('helvetica', 'normal');
        for (var j = 0; j < reflections.length; j++) {
          var r = reflections[j];
          var dateStr = r.date ? new Date(r.date + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : r.date;
          doc.setFontSize(10);
          doc.setTextColor(59, 130, 246);
          doc.setFont('helvetica', 'bold');
          doc.text((r.verse || 'Daily verse') + ' — ' + dateStr, margin, rowY);
          rowY += 5;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);
          var reflLines = doc.splitTextToSize(r.text || '', pageW - margin * 2);
          doc.text(reflLines, margin, rowY);
          rowY += reflLines.length * 4 + 8;
          if (rowY > pageH - margin - 25) {
            doc.addPage();
            rowY = margin;
          }
        }
      }
      doc.save('bible-notes.pdf');
      if (label) label.textContent = 'Downloaded!';
      setTimeout(function () {
        if (label) label.textContent = 'Export to PDF';
        if (spinner) spinner.classList.add('hidden');
        if (btn) btn.disabled = false;
      }, 1500);
    } catch (err) {
      if (label) label.textContent = 'Error—try again';
      if (spinner) spinner.classList.add('hidden');
      if (btn) btn.disabled = false;
      setTimeout(function () { if (label) label.textContent = 'Export to PDF'; }, 2000);
      if (typeof console !== 'undefined' && console.error) console.error('PDF export error:', err);
    }
  }

  function renderHighlights() {
    var grid = document.getElementById('bible-study-highlights-grid');
    var empty = document.getElementById('bible-study-no-highlights');
    var exportBtn = document.getElementById('export-notes');
    if (!grid) return;
    var h = getHighlights();
    var refs = Object.keys(h).filter(function (r) { return h[r] && h[r].highlighted; });
    var reflections = getReflections();
    if (exportBtn) {
      exportBtn.disabled = refs.length === 0 && reflections.length === 0;
      var lbl = exportBtn.querySelector('.export-notes-label');
      if (lbl) lbl.textContent = 'Export to PDF';
    }
    updateChallengeUI();
    if (refs.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    grid.innerHTML = refs.map(function (ref) {
      var data = h[ref];
      var text = bible[ref] || '';
      var note = (data.note || '').trim();
      return '<div class="bible-study-highlight-card">' +
        '<span class="verse-ref">' + escapeHtml(ref) + '</span>' +
        '<p class="verse-text">' + escapeHtml(text) + '</p>' +
        (note ? '<p class="verse-note">' + escapeHtml(note) + '</p>' : '') +
        '<button type="button" class="share-btn" data-ref="' + escapeHtml(ref) + '">Share</button>' +
        '</div>';
    }).join('');
    grid.querySelectorAll('.share-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ref = btn.dataset.ref;
        var text = bible[ref] || '';
        var h2 = getHighlights();
        var note = (h2[ref] && h2[ref].note) ? h2[ref].note : '';
        var shareText = ref + ': ' + text + (note ? ' — ' + note : '') + ' — Less scroll. More soul. #TodaysDailyBattle';
        var url = 'https://todaysdailybattle.com/bible/study.html';
        if (navigator.share) {
          navigator.share({ title: 'Bible Highlight', text: shareText, url: url }).catch(function () {});
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareText + ' ' + url).then(function () {
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.textContent = 'Share'; }, 2000);
          }).catch(function () {});
        }
      });
    });
  }

  function getUrlParams() {
    try {
      return new URLSearchParams(window.location.search || '');
    } catch (e) {
      return null;
    }
  }

  function runSearchFromInput() {
    var searchInput = document.getElementById('bible-study-search-input');
    if (!searchInput) return;
    var q = searchInput.value.trim();
    if (!q) {
      renderResults([]);
      var hint = document.getElementById('bible-study-hint');
      if (hint) {
        hint.classList.remove('hidden');
        hint.textContent = 'Type a word above to find verses.';
      }
      return;
    }
    var hint2 = document.getElementById('bible-study-hint');
    if (hint2) hint2.classList.add('hidden');
    renderResults(searchVerses(q));
  }

  function wireQuickTopics() {
    var searchInput = document.getElementById('bible-study-search-input');
    if (!searchInput) return;
    document.querySelectorAll('.bible-study-quick-topic-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var q = (btn.getAttribute('data-q') || '').trim();
        if (!q) return;
        searchInput.value = q;
        runSearchFromInput();
        var results = document.getElementById('bible-study-results');
        if (results) results.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function init() {
    loadBible().then(function () {
      renderHighlights();
    });

    var searchInput = document.getElementById('bible-study-search-input');
    var searchBtn = document.getElementById('bible-study-search-btn');
    if (searchBtn) searchBtn.addEventListener('click', runSearchFromInput);
    if (searchInput) {
      searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') runSearchFromInput(); });
    }
    wireQuickTopics();

    var params = getUrlParams();
    if (params) {
      var qParam = (params.get('q') || '').trim();
      var focusResults = params.get('focus') === 'results';
      if (qParam && searchInput) {
        searchInput.value = qParam;
        runSearchFromInput();
      }
      if (focusResults) {
        var results = document.getElementById('bible-study-results');
        if (results) {
          setTimeout(function () {
            results.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }
      }
    }

    var saveBtn = document.getElementById('bible-study-note-save');
    var removeBtn = document.getElementById('bible-study-note-remove');
    if (saveBtn) saveBtn.addEventListener('click', saveNote);
    if (removeBtn) removeBtn.addEventListener('click', removeNote);

    var modal = document.getElementById('bible-study-note-modal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeNoteModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && currentNoteRef) {
        closeNoteModal();
        e.preventDefault();
      }
    });

    var exportBtn = document.getElementById('export-notes');
    if (exportBtn) exportBtn.addEventListener('click', exportToPdf);
    var challengeBtn = document.getElementById('challenge-share');
    if (challengeBtn) challengeBtn.addEventListener('click', doChallengeShare);
    updateChallengeUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
