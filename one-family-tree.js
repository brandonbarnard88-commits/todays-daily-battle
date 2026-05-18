/**
 * Renders TDB_BIBLE_HERITAGE on one-family-in-christ.html — calm pedigree UI.
 */
(function () {
  'use strict';

  var data = typeof window !== 'undefined' ? window.TDB_BIBLE_HERITAGE : null;
  if (!data) return;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function personById(id) {
    for (var i = 0; i < data.mainLine.length; i++) {
      if (data.mainLine[i].id === id) return data.mainLine[i];
    }
    return null;
  }

  function sliceMainLine(startId, endId) {
    var start = -1;
    var end = -1;
    for (var i = 0; i < data.mainLine.length; i++) {
      if (data.mainLine[i].id === startId) start = i;
      if (data.mainLine[i].id === endId) end = i;
    }
    if (start < 0 || end < 0) return [];
    if (start > end) return [];
    return data.mainLine.slice(start, end + 1);
  }

  function renderVerses(verses) {
    if (!verses || !verses.length) return '';
    var html = '';
    verses.forEach(function (verse) {
      html +=
        '<figure class="heritage-verse">' +
        '<span class="heritage-verse__ref">' + esc(verse.ref) + '</span>' +
        '<blockquote class="heritage-verse__text">' + esc(verse.text) + '</blockquote>' +
        '</figure>';
    });
    return html;
  }

  function renderPersonNode(person, opts) {
    opts = opts || {};
    var detailId = 'heritage-detail-' + person.id;
    var isJesus = person.id === 'jesus';
    var btnClass = 'heritage-person' + (isJesus ? ' heritage-person--fulfillment' : '');
    var versesHtml = renderVerses(person.verses);
    var noteHtml = person.note ? '<p class="heritage-note">' + esc(person.note) + '</p>' : '';
    var eraHtml = person.era ? '<span class="heritage-person__era">' + esc(person.era) + '</span>' : '';

    return (
      '<li class="heritage-node" data-heritage-id="' + esc(person.id) + '" data-heritage-name="' + esc(person.name.toLowerCase()) + '">' +
      '<button type="button" class="' + btnClass + '" aria-expanded="false" aria-controls="' + detailId + '" data-heritage-toggle>' +
      '<span class="heritage-person__name">' + esc(person.name) + '</span>' +
      '<span class="heritage-person__relation">' + esc(person.relation || '') + '</span>' +
      eraHtml +
      '</button>' +
      '<div id="' + detailId + '" class="heritage-detail" hidden>' +
      versesHtml +
      noteHtml +
      '</div>' +
      '</li>'
    );
  }

  function renderTreeList(people) {
    var html = '<ol class="heritage-tree">';
    people.forEach(function (p) {
      html += renderPersonNode(p);
    });
    html += '</ol>';
    return html;
  }

  function renderBranches() {
    var html = '<div class="heritage-tree heritage-tree--branch">';
    data.branches.forEach(function (branch) {
      var connect = personById(branch.connectTo);
      var connectLabel = connect ? connect.name : branch.connectTo;
      html +=
        '<article class="heritage-branch-card" data-heritage-id="' + esc(branch.id) + '" data-heritage-name="' + esc(branch.name.toLowerCase()) + '">' +
        '<p class="heritage-branch-card__connect">Joined to the line at <strong>' + esc(connectLabel) + '</strong></p>' +
        '<h3 class="heritage-person__name" style="margin:0 0 0.25rem">' + esc(branch.name) + '</h3>' +
        '<p class="heritage-person__relation">' + esc(branch.relation) + '</p>' +
        renderVerses(branch.verses) +
        (branch.note ? '<p class="heritage-note">' + esc(branch.note) + '</p>' : '') +
        '</article>';
    });
    html += '</div>';
    return html;
  }

  function renderAdoption() {
    var a = data.adoption;
    var html =
      '<section class="one-family-section one-family-adoption" id="heritage-adoption">' +
      '<h2>' + esc(a.heading) + '</h2>';
    a.paragraphs.forEach(function (p) {
      html += '<p>' + esc(p) + '</p>';
    });
    a.verses.forEach(function (verse) {
      html +=
        '<blockquote><strong>' + esc(verse.ref) + '</strong> — ' + esc(verse.text) + '</blockquote>';
    });
    html += '<p class="one-family-adoption__close">' + esc(a.closing) + '</p></section>';
    return html;
  }

  function renderLinks() {
    if (!data.links || !data.links.length) return '';
    var html = '<div class="one-family-links"><p class="section-note">Quiet next steps</p><ul>';
    data.links.forEach(function (link) {
      html += '<li><a href="' + esc(link.href) + '">' + esc(link.label) + '</a></li>';
    });
    html += '</ul></div>';
    return html;
  }

  function buildPage() {
    var root = document.getElementById('one-family-tree-root');
    if (!root) return;

    var toc = '<nav aria-label="Sections"><ul class="one-family-toc">';
    data.sections.forEach(function (sec) {
      if (sec.id === 'intro') return;
      toc += '<li><a href="#heritage-' + esc(sec.id) + '">' + esc(sec.title) + '</a></li>';
    });
    toc += '</ul></nav>';

    var html = toc;

    data.sections.forEach(function (sec) {
      if (sec.id === 'intro') return;
      if (sec.id === 'branches') {
        html += '<section class="one-family-section" id="heritage-branches"><h2>' + esc(sec.title) + '</h2>' + renderBranches() + '</section>';
        return;
      }
      if (sec.id === 'adoption') {
        html += renderAdoption();
        return;
      }
      var slice = sliceMainLine(sec.startId, sec.endId);
      if (!slice.length) return;
      html +=
        '<section class="one-family-section" id="heritage-' + esc(sec.id) + '">' +
        '<h2>' + esc(sec.title) + '</h2>' +
        renderTreeList(slice) +
        '</section>';
    });

    html += renderLinks();
    root.innerHTML = html;
  }

  function wireInteractions() {
    var root = document.getElementById('one-family-tree-root');
    if (!root) return;

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-heritage-toggle]');
      if (!btn) return;
      var detail = document.getElementById(btn.getAttribute('aria-controls'));
      if (!detail) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      detail.hidden = open;
    });

    var search = document.getElementById('one-family-search');
    if (search) {
      search.addEventListener('input', function () {
        var q = String(search.value || '').trim().toLowerCase();
        var nodes = root.querySelectorAll('[data-heritage-name]');
        nodes.forEach(function (el) {
          var name = el.getAttribute('data-heritage-name') || '';
          var hit = !q || name.indexOf(q) !== -1;
          el.classList.toggle('is-filtered-out', !hit);
          el.classList.toggle('is-search-hit', !!q && hit);
        });
      });
    }

    var expandAll = document.getElementById('one-family-expand-all');
    if (expandAll) {
      expandAll.addEventListener('click', function () {
        var buttons = root.querySelectorAll('[data-heritage-toggle]');
        var anyClosed = false;
        buttons.forEach(function (btn) {
          if (btn.getAttribute('aria-expanded') !== 'true') anyClosed = true;
        });
        buttons.forEach(function (btn) {
          var detail = document.getElementById(btn.getAttribute('aria-controls'));
          btn.setAttribute('aria-expanded', anyClosed ? 'true' : 'false');
          if (detail) detail.hidden = !anyClosed;
        });
        expandAll.textContent = anyClosed ? 'Collapse all' : 'Expand all';
      });
    }
  }

  function wireBackToTop() {
    var btn = document.getElementById('one-family-back-top');
    if (!btn) return;
    function onScroll() {
      var show = (window.scrollY || 0) > 480;
      btn.hidden = !show;
    }
    btn.addEventListener('click', function () {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function init() {
    buildPage();
    wireInteractions();
    wireBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
