/**
 * Pastor Library — 52 sermon cards, weekly tease, "Use This" → Builder.
 */
(function () {
  'use strict';

  function getLibrary() {
    return window.PASTOR_SERMON_LIBRARY || [];
  }

  function getWeekIndex() {
    return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function buildOutlineForBuilder(sermon) {
    var pts = (sermon.points || []).join('\n• ');
    var outline = 'I. ' + (pts ? pts : 'Point one\nII. Point two\nIII. Point three');
    var ill = sermon.illustrations || {};
    var points = 'Key verses: ' + (sermon.keyVerse || '') + '\n\nIllustration quote: ' + (ill.quote || '') + '\n\nStory: ' + (ill.story || '');
    return {
      title: sermon.title || '',
      theme: sermon.id || '',
      textRef: sermon.keyVerse || '',
      outline: outline,
      points: points,
      application: 'Call to action: Apply this message to daily life.',
      prayer: sermon.closingPrayer || 'Lord, have Your way in our hearts. Amen.'
    };
  }

  function useThisOutline(sermon) {
    var draft = buildOutlineForBuilder(sermon);
    if (window.PastorHub && typeof window.PastorHub.setBuilderDraft === 'function') {
      window.PastorHub.setBuilderDraft(draft);
    } else {
      try {
        localStorage.setItem('pastorBuilderDraft', JSON.stringify(draft));
      } catch (e) {}
    }
    window.location.href = 'builder.html?load=1';
  }

  function renderWeeklyTease() {
    var titleEl = document.getElementById('pastor-weekly-title');
    var descEl = document.getElementById('pastor-weekly-desc');
    if (!titleEl || !descEl) return;

    var lib = getLibrary();
    if (lib.length === 0) return;

    var idx = getWeekIndex() % lib.length;
    var s = lib[idx];
    if (!s) return;

    titleEl.textContent = 'This week: ' + (s.title || s.id);
    descEl.textContent = (s.keyVerse || '') + ' — ' + (s.points && s.points[0] ? s.points[0] : '');
  }

  function renderGrid() {
    var grid = document.getElementById('pastor-library-grid');
    if (!grid) return;

    var lib = getLibrary();
    if (lib.length === 0) {
      setTimeout(renderGrid, 100);
      return;
    }

    var html = '';
    for (var i = 0; i < lib.length; i++) {
      var s = lib[i];
      var title = escapeHtml(s.title || s.id);
      var verse = escapeHtml(s.keyVerse || '');
      var id = escapeHtml(String(s.id || i));
      html += '<div class="pastor-library-card" data-id="' + id + '" role="listitem">';
      html += '<h3>' + title + '</h3>';
      html += '<span class="pastor-card-verse">' + verse + '</span>';
      html += '<button type="button" class="pastor-use-btn" data-id="' + id + '">Use This</button>';
      html += '</div>';
    }
    grid.innerHTML = html;

    grid.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.pastor-use-btn') : null;
      if (!btn) return;
      var id = btn.getAttribute('data-id');
      var s = lib.find(function (x) { return String(x.id) === id; }) || lib[parseInt(id, 10)];
      if (s) useThisOutline(s);
    });
  }

  function init() {
    renderWeeklyTease();
    renderGrid();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
