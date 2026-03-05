/**
 * Kids Corner — library view for Kids Battle
 * 52 Bible stories: search, filter, random, PDF export. Uses TDB_BIBLE_STORIES from kids-battle.js.
 */
(function () {
  'use strict';
  var grid = document.getElementById('kids-library-grid');
  var searchForm = document.getElementById('kids-library-search-form');
  var searchInput = document.getElementById('kids-library-search-input');
  var noMatch = document.getElementById('kids-library-no-match');
  var modal = document.getElementById('kids-story-modal');
  var modalTitle = document.getElementById('kids-story-modal-title');
  var modalCarousel = document.getElementById('kids-story-modal-carousel');
  var modalContext = document.getElementById('kids-story-modal-context');
  var modalVideo = document.getElementById('kids-story-modal-video');
  var modalClose = document.getElementById('kids-story-modal-close');
  var randomBtn = document.getElementById('kids-library-random-btn');
  var pdfExportBtn = document.getElementById('pdf-export');
  var themeSelect = document.getElementById('kids-library-theme');
  var storyMasterEl = document.getElementById('kids-library-story-master');

  var LIBRARY_VIEWED_KEY = 'kidsLibraryViewedStories';
  var STORY_MASTER_THRESHOLD = 7;
  var currentOpenStoryKey = null;

  function showToast(msg) {
    var el = document.getElementById('kids-library-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(function () { el.classList.add('hidden'); }, 2500);
  }

  function getStories() {
    return window.TDB_BIBLE_STORIES || {};
  }

  function getStoryKeys() {
    return window.TDB_BIBLE_STORY_KEYS || Object.keys(getStories());
  }

  function getStoryThemes() {
    return window.TDB_STORY_THEMES || {};
  }

  function getViewedStories() {
    try {
      var raw = localStorage.getItem(LIBRARY_VIEWED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function addViewedStory(key) {
    var viewed = getViewedStories();
    if (viewed.indexOf(key) === -1) {
      viewed.push(key);
      try { localStorage.setItem(LIBRARY_VIEWED_KEY, JSON.stringify(viewed)); } catch (e) {}
    }
    renderStoryMaster();
  }

  function renderStoryMaster() {
    if (!storyMasterEl) return;
    var viewed = getViewedStories();
    storyMasterEl.classList.toggle('hidden', viewed.length < STORY_MASTER_THRESHOLD);
  }

  function filterStories(query, theme) {
    var stories = getStories();
    var themes = getStoryThemes();
    var keys = getStoryKeys();
    var q = (query || '').trim().toLowerCase();
    var themeVal = (theme || '').trim();
    return keys.filter(function (key) {
      var s = stories[key];
      if (!s) return false;
      if (themeVal && themes[key] !== themeVal) return false;
      if (!q) return true;
      var title = (s.title || '').toLowerCase();
      var keywords = (s.keywords || []).join(' ').toLowerCase();
      return title.indexOf(q) !== -1 || keywords.indexOf(q) !== -1;
    });
  }

  function renderGrid(keys) {
    var stories = getStories();
    if (!grid) return;
    var html = '';
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var s = stories[key];
      if (!s) continue;
      var panels = s.panels || [];
      var thumb = panels[0] ? panels[0].src : 'panel-noah-1.svg';
      var title = (s.title || key).replace(/</g, '&lt;');
      html += '<div class="kids-library-card" data-story="' + key.replace(/"/g, '&quot;') + '" role="button" tabindex="0">';
      html += '<img src="' + thumb + '" alt="' + (panels[0] && panels[0].alt ? panels[0].alt : title) + '">';
      html += '<span class="kids-library-card-title">' + title + '</span>';
      html += '<span class="kids-library-card-btn">Swipe to see!</span>';
      html += '</div>';
    }
    grid.innerHTML = html;
    if (noMatch) {
      noMatch.classList.toggle('hidden', keys.length > 0);
    }
  }

  function openStory(key) {
    var stories = getStories();
    var s = stories[key];
    if (!s) return;
    var panels = s.panels || [];
    var panelsHtml = panels.map(function (p) {
      return '<img src="' + p.src + '" alt="' + (p.alt || '').replace(/"/g, '&quot;') + '" class="comic-panel" width="200" height="160">';
    }).join('');
    var videoTitle = (s.videoTitle || '').replace(/"/g, '&quot;');
    var btnHtml = s.videoId ? '<button type="button" class="watch-video-btn" data-video-id="' + s.videoId + '" data-title="' + videoTitle + '">🎥 Watch the story move! (2 min)</button>' : '';
    var shareBtnHtml = '<button type="button" class="kids-share-btn" data-story="' + key.replace(/"/g, '&quot;') + '">📤 Share with friends!</button>';
    currentOpenStoryKey = key;
    if (modalTitle) modalTitle.textContent = s.title || key;
    if (modalCarousel) {
      modalCarousel.innerHTML = '<div class="comic-carousel"><div class="panels-container">' + panelsHtml + '</div><p class="comic-caption">' + (s.caption || '').replace(/</g, '&lt;') + '</p>' + btnHtml + shareBtnHtml + '</div>';
    }
    if (modalContext) {
      var ctx = s.kidContext;
      if (ctx && (ctx.who || ctx.to || ctx.apply)) {
        modalContext.innerHTML = '<p><strong>Who:</strong> ' + (ctx.who || '').replace(/</g, '&lt;') + '</p><p><strong>For you:</strong> ' + (ctx.apply || '').replace(/</g, '&lt;') + '</p>';
        modalContext.classList.remove('hidden');
      } else {
        modalContext.classList.add('hidden');
        modalContext.innerHTML = '';
      }
    }
    if (modalVideo) modalVideo.innerHTML = '';
    if (modal) modal.classList.remove('hidden');
    addViewedStory(key);
  }

  function applyFilters() {
    var q = searchInput ? searchInput.value : '';
    var theme = themeSelect ? themeSelect.value : '';
    return filterStories(q, theme);
  }

  function init() {
    var keys = getStoryKeys();
    if (keys.length === 0) {
      setTimeout(init, 100);
      return;
    }
    try {
      var params = new URLSearchParams(location.search);
      var q = params.get('q');
      if (q && searchInput) searchInput.value = q;
      var storyKey = params.get('story');
      if (storyKey && getStories()[storyKey]) {
        setTimeout(function () { openStory(storyKey); }, 300);
      }
    } catch (e) {}
    renderGrid(applyFilters());
    renderStoryMaster();

    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        renderGrid(applyFilters());
      });
      searchInput.addEventListener('input', function () {
        renderGrid(applyFilters());
      });
    }

    if (themeSelect) {
      themeSelect.addEventListener('change', function () {
        renderGrid(applyFilters());
      });
    }

    if (randomBtn) {
      randomBtn.addEventListener('click', function () {
        var keys = applyFilters();
        if (keys.length === 0) keys = getStoryKeys();
        if (keys.length === 0) return;
        var idx = Math.floor(Math.random() * keys.length);
        openStory(keys[idx]);
      });
    }

    if (pdfExportBtn) {
      pdfExportBtn.addEventListener('click', function () {
        var JsPDF = window.jspdf && window.jspdf.jsPDF;
        if (!JsPDF) {
          showToast('PDF library loading… try again in a moment.');
          return;
        }
        var stories = getStories();
        var keys = getStoryKeys();
        if (keys.length === 0) {
          showToast('No stories to export.');
          return;
        }
        try {
          var doc = new JsPDF('p', 'mm', 'a4');
          var pageW = doc.internal.pageSize.getWidth();
          var pageH = doc.internal.pageSize.getHeight();
          var margin = 12;
          var colW = (pageW - margin * 3) / 2;
          var y = margin;
          var cellH = 28;
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text('Kids Battle Bible Stories – One Year of Fun!', pageW / 2, y, { align: 'center' });
          y += 12;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          var col = 0;
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var s = stories[key];
            if (!s) continue;
            var x = margin + col * (colW + margin);
            var title = (s.title || key);
            var caption = (s.caption || '');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            var titleLines = doc.splitTextToSize(title, colW);
            doc.text(titleLines.slice(0, 2), x, y);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            var captionLines = doc.splitTextToSize(caption, colW);
            doc.text(captionLines.slice(0, 2), x, y + 6);
            if (col === 0) {
              col = 1;
            } else {
              col = 0;
              y += cellH;
            }
            if (y > pageH - margin - 20) {
              doc.addPage();
              y = margin;
            }
          }
          doc.save('52-stories-year.pdf');
          showToast('PDF downloaded!');
        } catch (err) {
          showToast('Could not create PDF. Try again.');
          console.error('PDF export error:', err);
        }
      });
    }

    if (grid) {
      grid.addEventListener('click', function (e) {
        var card = e.target && e.target.closest ? e.target.closest('.kids-library-card') : null;
        if (card) {
          var key = card.getAttribute('data-story');
          if (key) openStory(key);
        }
      });
      grid.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var card = e.target && e.target.closest ? e.target.closest('.kids-library-card') : null;
        if (card) {
          e.preventDefault();
          var key = card.getAttribute('data-story');
          if (key) openStory(key);
        }
      });
    }

    if (modalClose) modalClose.addEventListener('click', function () {
      if (modal) modal.classList.add('hidden');
    });
    if (modal) modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.add('hidden');
    });

    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.watch-video-btn') : null;
      if (btn) {
        var id = btn.getAttribute('data-video-id');
        if (id) {
          var wrap = document.getElementById('kids-story-modal');
          if (wrap && !wrap.classList.contains('hidden')) {
            var vidDiv = document.getElementById('kids-story-modal-video');
            if (vidDiv) {
              vidDiv.innerHTML = '<div class="kids-video-wrapper"><iframe src="https://www.youtube.com/embed/' + id + '?rel=0&modestbranding=1&playsinline=1" width="100%" height="100%" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="Bible story video"></iframe></div>';
            }
          }
        }
        return;
      }
      var shareBtn = e.target && e.target.closest ? e.target.closest('.kids-share-btn') : null;
      if (shareBtn) {
        var key = shareBtn.getAttribute('data-story') || currentOpenStoryKey;
        var stories = getStories();
        var s = stories[key];
        var title = (s && s.title) ? s.title : (key || 'Bible Story');
        var shareUrl = window.location.href.split('?')[0] + '?story=' + encodeURIComponent(key || '');
        var shareText = 'Check out ' + title + ' — swipe, watch, doodle!';
        if (navigator.share && typeof navigator.share === 'function') {
          navigator.share({ title: 'Check out ' + title + '!', text: shareText, url: shareUrl }).then(function () {
            showToast('Shared!');
          }).catch(function () {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(shareUrl).then(function () { showToast('Link copied!'); }).catch(function () {});
            } else { showToast('Link: ' + shareUrl); }
          });
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).then(function () { showToast('Link copied!'); }).catch(function () {});
        } else {
          showToast('Link: ' + shareUrl);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
