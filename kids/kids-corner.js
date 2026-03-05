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
  var libraryCountEl = document.getElementById('kids-library-count');
  var prevStoryBtn = document.getElementById('kids-story-prev-btn');
  var nextStoryBtn = document.getElementById('kids-story-next-btn');
  var journeyStartBtn = document.getElementById('kids-journey-start-btn');
  var journeyContinueBtn = document.getElementById('kids-journey-continue-btn');
  var journeyNextBtn = document.getElementById('kids-journey-next-btn');
  var journeyResetBtn = document.getElementById('kids-journey-reset-btn');
  var journeyStatusEl = document.getElementById('kids-journey-status');

  var LIBRARY_VIEWED_KEY = 'kidsLibraryViewedStories';
  var LIBRARY_JOURNEY_KEY = 'kidsLibraryStoryJourneyState';
  var STORY_MASTER_THRESHOLD = 7;
  var currentOpenStoryKey = null;
  var currentVisibleKeys = [];
  var STORY_JOURNEY_ORDER = [
    'creation', 'adamEve', 'cainAbel', 'noah', 'towerBabel', 'abrahamIsaac', 'josephCoat',
    'mosesBush', 'redSea', 'manna', 'tenCommandments', 'fallOfJericho', 'ruthBoaz',
    'davidSheep', 'david', 'elijahFire', 'elishaOil', 'naaman', 'samson', 'esther', 'daniel', 'fieryFurnace',
    'jesusBirth', 'jesus', 'jesusTemptation', 'jesusCalmsStorm', 'jesusWalksWater', 'jesusFeeds5000',
    'parableSower', 'goodSamaritan', 'lostSheep', 'prodigalSon', 'richYoungRuler', 'widowsMite', 'zacchaeus',
    'lazarus', 'palmSunday', 'lastSupper', 'gardenPrayer', 'betrayal', 'trial', 'crucifixion',
    'resurrection', 'roadToEmmaus', 'ascension', 'pentecost', 'stephen', 'paulDamascus',
    'parableTalents', 'armorOfGod', 'heavenPromise', 'jonah'
  ];

  function showToast(msg) {
    var el = document.getElementById('kids-library-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(function () { el.classList.add('hidden'); }, 2500);
  }

  function escHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escAttr(value) {
    return escHtml(value).replace(/`/g, '&#96;');
  }

  function safeYouTubeId(value) {
    var id = String(value || '').trim();
    return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : '';
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

  function getJourneyKeys() {
    var stories = getStories();
    return STORY_JOURNEY_ORDER.filter(function (key) {
      return !!stories[key];
    });
  }

  function getJourneyState() {
    try {
      var raw = localStorage.getItem(LIBRARY_JOURNEY_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      if (!parsed || typeof parsed !== 'object') return { started: false, nextIndex: 0 };
      return {
        started: !!parsed.started,
        nextIndex: Math.max(0, Number(parsed.nextIndex || 0))
      };
    } catch (e) {
      return { started: false, nextIndex: 0 };
    }
  }

  function setJourneyState(state) {
    try { localStorage.setItem(LIBRARY_JOURNEY_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function syncJourneyUi() {
    var keys = getJourneyKeys();
    var total = keys.length;
    var state = getJourneyState();
    var next = Math.min(Math.max(0, state.nextIndex), total);
    var done = next >= total && total > 0;
    if (journeyStatusEl) {
      if (!state.started) {
        journeyStatusEl.textContent = 'Start a guided Bible journey (' + total + ' stories).';
      } else if (done) {
        journeyStatusEl.textContent = 'Journey complete! ' + total + '/' + total + ' stories done. You can reset to begin again.';
      } else {
        var key = keys[next];
        var title = (getStories()[key] && getStories()[key].title) ? getStories()[key].title : 'Next story';
        journeyStatusEl.textContent = 'Journey progress: ' + next + '/' + total + '. Next: ' + title + '.';
      }
    }
    if (journeyStartBtn) journeyStartBtn.disabled = total === 0;
    if (journeyContinueBtn) journeyContinueBtn.disabled = total === 0 || !state.started;
    if (journeyNextBtn) journeyNextBtn.disabled = total === 0 || !state.started || done;
    if (journeyResetBtn) journeyResetBtn.disabled = total === 0 || !state.started;
  }

  function startJourney() {
    var keys = getJourneyKeys();
    if (!keys.length) return;
    setJourneyState({ started: true, nextIndex: 0 });
    syncJourneyUi();
    openStory(keys[0]);
    showToast('Journey started! Story 1 of ' + keys.length + '.');
  }

  function continueJourney() {
    var keys = getJourneyKeys();
    if (!keys.length) return;
    var state = getJourneyState();
    if (!state.started) {
      startJourney();
      return;
    }
    var idx = Math.min(Math.max(0, state.nextIndex), keys.length - 1);
    openStory(keys[idx]);
  }

  function advanceJourneyFromStory(storyKey) {
    var keys = getJourneyKeys();
    if (!keys.length) return;
    var state = getJourneyState();
    if (!state.started) return;
    if (state.nextIndex >= keys.length) return;
    var idx = Math.min(Math.max(0, state.nextIndex), keys.length - 1);
    if (keys[idx] !== storyKey) return;
    var nextIndex = idx + 1;
    setJourneyState({ started: true, nextIndex: nextIndex });
    if (nextIndex >= keys.length) {
      showToast('Journey complete! Amazing faith walk!');
    } else {
      showToast('Journey progress saved: ' + nextIndex + '/' + keys.length);
    }
    syncJourneyUi();
  }

  function goToNextJourneyStory() {
    var keys = getJourneyKeys();
    if (!keys.length) return;
    var state = getJourneyState();
    if (!state.started) {
      startJourney();
      return;
    }
    var idx = Math.min(Math.max(0, state.nextIndex), keys.length - 1);
    openStory(keys[idx]);
  }

  function resetJourney() {
    setJourneyState({ started: false, nextIndex: 0 });
    syncJourneyUi();
    showToast('Journey reset.');
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
    currentVisibleKeys = Array.isArray(keys) ? keys.slice() : [];
    var html = '';
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var s = stories[key];
      if (!s) continue;
      var panels = s.panels || [];
      var thumb = panels[0] ? panels[0].src : 'panel-noah-1.svg';
      var title = escHtml(s.title || key);
      var alt = panels[0] && panels[0].alt ? String(panels[0].alt) : String(s.title || key);
      html += '<div class="kids-library-card" data-story="' + escAttr(key) + '" role="button" tabindex="0">';
      html += '<img src="' + escAttr(thumb) + '" alt="' + escAttr(alt) + '">';
      html += '<span class="kids-library-card-title">' + title + '</span>';
      html += '<span class="kids-library-card-btn">Open story</span>';
      html += '</div>';
    }
    grid.innerHTML = html;
    if (noMatch) {
      noMatch.classList.toggle('hidden', keys.length > 0);
      if (keys.length === 0) {
        noMatch.textContent = 'No stories match that search yet. Try a different word or switch theme to "All themes."';
      }
    }
    updateLibraryCount(keys.length);
  }

  function updateLibraryCount(visibleCount) {
    if (!libraryCountEl) return;
    var total = getStoryKeys().length;
    var shown = Number(visibleCount || 0);
    var query = searchInput ? String(searchInput.value || '').trim() : '';
    var theme = themeSelect ? String(themeSelect.value || '').trim() : '';
    var context = [];
    if (query) context.push('search: "' + query + '"');
    if (theme) context.push('theme: ' + theme);
    libraryCountEl.textContent = 'Showing ' + shown + ' of ' + total + ' story cartoons' + (context.length ? ' (' + context.join(' • ') + ')' : '') + '.';
  }

  function openStory(key) {
    var stories = getStories();
    var s = stories[key];
    if (!s) return;
    var panels = s.panels || [];
    var panelsHtml = panels.map(function (p) {
      return '<img src="' + escAttr(p.src || '') + '" alt="' + escAttr(p.alt || '') + '" class="comic-panel" width="200" height="160">';
    }).join('');
    var safeVideoId = safeYouTubeId(s.videoId);
    var videoTitle = escAttr(s.videoTitle || '');
    var btnHtml = safeVideoId ? '<button type="button" class="watch-video-btn" data-video-id="' + safeVideoId + '" data-title="' + videoTitle + '">🎥 Watch the story move! (2 min)</button>' : '';
    var shareBtnHtml = '<button type="button" class="kids-share-btn" data-story="' + escAttr(key) + '">📤 Share with friends!</button>';
    currentOpenStoryKey = key;
    if (modalTitle) modalTitle.textContent = s.title || key;
    if (modalCarousel) {
      modalCarousel.innerHTML = '<div class="comic-carousel"><div class="panels-container">' + panelsHtml + '</div><p class="comic-caption">' + escHtml(s.caption || '') + '</p>' + btnHtml + shareBtnHtml + '</div>';
    }
    if (modalContext) {
      var ctx = s.kidContext;
      if (ctx && (ctx.who || ctx.to || ctx.apply)) {
        modalContext.innerHTML = '<p><strong>Who:</strong> ' + escHtml(ctx.who || '') + '</p><p><strong>For you:</strong> ' + escHtml(ctx.apply || '') + '</p>';
        modalContext.classList.remove('hidden');
      } else {
        modalContext.classList.add('hidden');
        modalContext.innerHTML = '';
      }
    }
    if (modalVideo) modalVideo.innerHTML = '';
    if (modal) modal.classList.remove('hidden');
    syncStoryNavButtons();
    addViewedStory(key);
    advanceJourneyFromStory(key);
  }

  function currentStoryIndexInVisible() {
    if (!currentOpenStoryKey) return -1;
    if (!currentVisibleKeys || !currentVisibleKeys.length) return -1;
    return currentVisibleKeys.indexOf(currentOpenStoryKey);
  }

  function openAdjacentStory(step) {
    if (!currentVisibleKeys || !currentVisibleKeys.length) return;
    var idx = currentStoryIndexInVisible();
    if (idx < 0) idx = 0;
    var next = (idx + step + currentVisibleKeys.length) % currentVisibleKeys.length;
    openStory(currentVisibleKeys[next]);
  }

  function syncStoryNavButtons() {
    var hasStories = !!(currentVisibleKeys && currentVisibleKeys.length);
    if (prevStoryBtn) prevStoryBtn.disabled = !hasStories;
    if (nextStoryBtn) nextStoryBtn.disabled = !hasStories;
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
    syncJourneyUi();

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

    if (journeyStartBtn) {
      journeyStartBtn.addEventListener('click', function () {
        startJourney();
      });
    }
    if (journeyContinueBtn) {
      journeyContinueBtn.addEventListener('click', function () {
        continueJourney();
      });
    }
    if (journeyNextBtn) {
      journeyNextBtn.addEventListener('click', function () {
        goToNextJourneyStory();
      });
    }
    if (journeyResetBtn) {
      journeyResetBtn.addEventListener('click', function () {
        resetJourney();
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
        var id = safeYouTubeId(btn.getAttribute('data-video-id'));
        if (id) {
          var wrap = document.getElementById('kids-story-modal');
          if (wrap && !wrap.classList.contains('hidden')) {
            var vidDiv = document.getElementById('kids-story-modal-video');
            if (vidDiv) {
              vidDiv.innerHTML = '<div class="kids-video-wrapper"><iframe src="https://www.youtube.com/embed/' + escHtml(id) + '?rel=0&modestbranding=1&playsinline=1" width="100%" height="100%" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="Bible story video"></iframe></div>';
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

    if (prevStoryBtn) {
      prevStoryBtn.addEventListener('click', function () {
        openAdjacentStory(-1);
      });
    }
    if (nextStoryBtn) {
      nextStoryBtn.addEventListener('click', function () {
        openAdjacentStory(1);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!modal || modal.classList.contains('hidden')) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        openAdjacentStory(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        openAdjacentStory(1);
      }
    });

    try {
      var journeyParam = new URLSearchParams(location.search).get('journey');
      var randomParam = new URLSearchParams(location.search).get('random');
      if (journeyParam === '1') {
        continueJourney();
      } else if (randomParam === '1' && currentVisibleKeys.length) {
        openStory(currentVisibleKeys[Math.floor(Math.random() * currentVisibleKeys.length)]);
      }
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
