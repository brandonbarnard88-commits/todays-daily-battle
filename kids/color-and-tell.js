/**
 * Color & Tell My Story — groups jl-coloringbook scenes per Bible story,
 * saves JPEG snapshots to localStorage, progress cards, fullscreen slideshow.
 */
(function () {
  'use strict';

  var STORAGE_PREFIX = 'tdb-cat-v1:';
  var JPEG_QUALITY = 0.82;
  var AUTOPLAY_MS = 4500;

  var PALETTE = [
    'rgba(220, 38, 38, 0.95)',
    'rgba(37, 99, 235, 0.95)',
    'rgba(234, 179, 8, 0.95)',
    'rgba(22, 163, 74, 0.95)',
    'rgba(126, 34, 206, 0.95)',
    'white'
  ];

  /** KJV refs in captions — short for on-screen */
  var STORIES = [
    {
      id: 'noah',
      title: "Noah's ark",
      lead: 'Four big pictures. Color each one, tap Save, then watch your whole story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/noah-s1.svg',
          alt: 'Noah builds the ark',
          caption: 'God told Noah to build an ark—big enough for his family.',
          verse: 'Genesis 6:14 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/noah-s2.svg',
          alt: 'Animals come to the ark',
          caption: 'God sent the animals. Noah trusted Him.',
          verse: 'Genesis 7:15 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/noah-s3.svg',
          alt: 'Rain and flood',
          caption: 'The rain came, but God remembered Noah.',
          verse: 'Genesis 7:12 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/noah-s4.svg',
          alt: 'Rainbow promise',
          caption: 'God set a rainbow in the sky—a sign of His promise.',
          verse: 'Genesis 9:13 (KJV)'
        }
      ]
    },
    {
      id: 'david',
      title: 'David and Goliath',
      lead: 'Four pictures from the valley—save each scene to unlock your story.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/david-s1.svg',
          alt: 'Young David',
          caption: 'David was brave because he trusted the Lord.',
          verse: '1 Samuel 17:45 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/david-s2.svg',
          alt: 'Goliath',
          caption: 'The giant looked strong—but God was stronger.',
          verse: '1 Samuel 17:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/david-s3.svg',
          alt: 'The stone',
          caption: 'One stone, one Lord—that was enough.',
          verse: '1 Samuel 17:49 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/david-s4.svg',
          alt: 'Victory',
          caption: 'The Lord saved Israel that day.',
          verse: '1 Samuel 17:47 (KJV)'
        }
      ]
    }
  ];

  function storageKey(storyId, sceneId) {
    return STORAGE_PREFIX + storyId + ':' + sceneId;
  }

  function getSaved(storyId, sceneId) {
    try {
      return localStorage.getItem(storageKey(storyId, sceneId));
    } catch (e) {
      return null;
    }
  }

  function setSaved(storyId, sceneId, dataUrl) {
    localStorage.setItem(storageKey(storyId, sceneId), dataUrl);
  }

  function storyProgress(story) {
    var done = 0;
    for (var i = 0; i < story.scenes.length; i++) {
      if (getSaved(story.id, story.scenes[i].id)) done++;
    }
    return { done: done, total: story.scenes.length };
  }

  function statusLabel(story) {
    var p = storyProgress(story);
    if (p.done === 0) return { text: 'Not started', doneClass: '' };
    if (p.done < p.total) return { text: 'In progress', doneClass: '' };
    return { text: 'Completed', doneClass: ' tdb-cat-progress-card-status--done' };
  }

  function pct(story) {
    var p = storyProgress(story);
    if (!p.total) return 0;
    return Math.round((100 * p.done) / p.total);
  }

  function pngToJpeg(pngDataUrl, quality) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = function () {
        reject(new Error('image'));
      };
      img.src = pngDataUrl;
    });
  }

  function createJl(scene) {
    var jl = document.createElement('jl-coloringbook');
    jl.setAttribute('maxbrushsize', '56');
    jl.setAttribute('css', '/kids/jl-coloringbook-tdb.css');
    var im = document.createElement('img');
    im.src = scene.src;
    im.alt = scene.alt;
    jl.appendChild(im);
    for (var c = 0; c < PALETTE.length; c++) {
      var italic = document.createElement('i');
      italic.setAttribute('color', PALETTE[c]);
      jl.appendChild(italic);
    }
    return jl;
  }

  var show = {
    overlay: null,
    img: null,
    cap: null,
    verse: null,
    title: null,
    dots: null,
    autoplayChk: null,
    timer: null,
    slides: [],
    index: 0,
    storyTitle: ''
  };

  function stopAutoplay() {
    if (show.timer) {
      clearInterval(show.timer);
      show.timer = null;
    }
  }

  function renderSlide() {
    if (!show.slides.length) return;
    var s = show.slides[show.index];
    show.img.src = s.dataUrl;
    show.img.alt = s.alt || '';
    if (show.capMain) show.capMain.textContent = s.caption || '';
    if (show.verse) show.verse.textContent = s.verse || '';
    show.dots.textContent = show.index + 1 + ' / ' + show.slides.length;
  }

  function nextSlide() {
    if (!show.slides.length) return;
    show.index = (show.index + 1) % show.slides.length;
    renderSlide();
  }

  function prevSlide() {
    if (!show.slides.length) return;
    show.index = (show.index - 1 + show.slides.length) % show.slides.length;
    renderSlide();
  }

  function startAutoplayIfNeeded() {
    stopAutoplay();
    if (!show.autoplayChk || !show.autoplayChk.checked) return;
    show.timer = setInterval(nextSlide, AUTOPLAY_MS);
  }

  function closeSlideshow() {
    stopAutoplay();
    if (show.overlay) {
      show.overlay.hidden = true;
    }
    document.body.style.overflow = '';
  }

  function openSlideshow(story) {
    var slides = [];
    for (var i = 0; i < story.scenes.length; i++) {
      var sc = story.scenes[i];
      var dataUrl = getSaved(story.id, sc.id);
      if (dataUrl) {
        slides.push({
          dataUrl: dataUrl,
          alt: sc.alt,
          caption: sc.caption,
          verse: sc.verse
        });
      }
    }
    if (slides.length !== story.scenes.length) {
      window.alert('Save every scene first—then your story will be ready to watch.');
      return;
    }
    show.slides = slides;
    show.index = 0;
    show.storyTitle = story.title;
    show.title.textContent = 'Your story: ' + story.title;
    renderSlide();
    show.overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    if (
      show.autoplayChk &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      show.autoplayChk.checked = true;
    } else if (show.autoplayChk) {
      show.autoplayChk.checked = false;
    }
    startAutoplayIfNeeded();
    try {
      if (show.closeBtn) show.closeBtn.focus();
    } catch (f) {}
  }

  function buildSlideshowShell() {
    var ov = document.createElement('div');
    ov.id = 'tdb-cat-slideshow';
    ov.className = 'tdb-cat-slideshow';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Your colored story');
    ov.hidden = true;

    var inner = document.createElement('div');
    inner.className = 'tdb-cat-slideshow-inner';

    var top = document.createElement('div');
    top.className = 'tdb-cat-slideshow-top';
    var h = document.createElement('h2');
    h.className = 'tdb-cat-slideshow-title';
    h.id = 'tdb-cat-slideshow-heading';
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'tdb-cat-slideshow-close';
    closeBtn.setAttribute('aria-label', 'Close slideshow');
    closeBtn.textContent = '×';
    top.appendChild(h);
    top.appendChild(closeBtn);

    var fig = document.createElement('figure');
    fig.className = 'tdb-cat-slideshow-figure';
    var img = document.createElement('img');
    img.alt = '';
    var cap = document.createElement('figcaption');
    cap.className = 'tdb-cat-slideshow-caption';
    var capMain = document.createElement('span');
    capMain.className = 'tdb-cat-slideshow-cap-main';
    var verse = document.createElement('span');
    verse.className = 'tdb-cat-slideshow-verse';
    cap.appendChild(capMain);
    cap.appendChild(verse);
    fig.appendChild(img);
    fig.appendChild(cap);

    var nav = document.createElement('div');
    nav.className = 'tdb-cat-slideshow-nav';
    var prevB = document.createElement('button');
    prevB.type = 'button';
    prevB.textContent = '← Previous';
    var nextB = document.createElement('button');
    nextB.type = 'button';
    nextB.textContent = 'Next →';

    nav.appendChild(prevB);
    nav.appendChild(nextB);

    var tools = document.createElement('div');
    tools.className = 'tdb-cat-slideshow-tools';
    var label = document.createElement('label');
    var chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.id = 'tdb-cat-autoplay';
    label.appendChild(chk);
    label.appendChild(document.createTextNode(' Auto-play (about ' + Math.round(AUTOPLAY_MS / 1000) + ' seconds per picture)'));

    var dots = document.createElement('p');
    dots.className = 'tdb-cat-slideshow-dots';
    dots.setAttribute('aria-live', 'polite');

    tools.appendChild(label);

    inner.appendChild(top);
    inner.appendChild(fig);
    inner.appendChild(nav);
    inner.appendChild(tools);
    inner.appendChild(dots);
    ov.appendChild(inner);
    document.body.appendChild(ov);

    show.overlay = ov;
    show.img = img;
    show.capMain = capMain;
    show.verse = verse;
    show.title = h;
    show.dots = dots;
    show.autoplayChk = chk;
    show.closeBtn = closeBtn;

    closeBtn.addEventListener('click', closeSlideshow);
    prevB.addEventListener('click', function () {
      prevSlide();
      stopAutoplay();
      startAutoplayIfNeeded();
    });
    nextB.addEventListener('click', function () {
      nextSlide();
      stopAutoplay();
      startAutoplayIfNeeded();
    });
    chk.addEventListener('change', function () {
      stopAutoplay();
      startAutoplayIfNeeded();
    });

    ov.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSlideshow();
      }
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });
  }

  function updateStoryUI(story, sectionEl, watchBtn, celebrateEl) {
    var p = storyProgress(story);
    var st = statusLabel(story);
    if (watchBtn) {
      if (p.done === p.total && p.total > 0) {
        watchBtn.classList.add('is-on');
      } else {
        watchBtn.classList.remove('is-on');
      }
    }
    if (celebrateEl) {
      if (p.done === p.total && p.total > 0) {
        celebrateEl.classList.add('is-on');
        celebrateEl.textContent =
          'You colored the whole ' + story.title + " story! Let's watch it together.";
      } else {
        celebrateEl.classList.remove('is-on');
      }
    }
    sectionEl.querySelectorAll('.tdb-cat-tab').forEach(function (tab, idx) {
      var sc = story.scenes[idx];
      var saved = getSaved(story.id, sc.id);
      tab.setAttribute('aria-label', sc.alt + (saved ? ' — saved' : ' — not saved yet'));
    });
  }

  function refreshProgressCards(container) {
    container.textContent = '';
    for (var s = 0; s < STORIES.length; s++) {
      var story = STORIES[s];
      var card = document.createElement('div');
      card.className = 'tdb-cat-progress-card';
      var thumb = document.createElement('img');
      thumb.className = 'tdb-cat-progress-card-thumb';
      thumb.src = story.scenes[0].src;
      thumb.alt = '';
      thumb.loading = 'lazy';
      var title = document.createElement('p');
      title.className = 'tdb-cat-progress-card-title';
      title.textContent = story.title;
      var status = document.createElement('p');
      var st = statusLabel(story);
      status.className = 'tdb-cat-progress-card-status' + st.doneClass;
      status.textContent = st.text;
      var meter = document.createElement('div');
      meter.className = 'tdb-cat-progress-meter';
      var fill = document.createElement('div');
      fill.className = 'tdb-cat-progress-meter-fill';
      fill.style.width = pct(story) + '%';
      meter.appendChild(fill);
      card.appendChild(thumb);
      card.appendChild(title);
      card.appendChild(status);
      card.appendChild(meter);
      container.appendChild(card);
    }
  }

  function selectTab(story, index, sectionEl) {
    var tabs = sectionEl.querySelectorAll('.tdb-cat-tab');
    var panels = sectionEl.querySelectorAll('.tdb-cat-panel');
    for (var i = 0; i < tabs.length; i++) {
      var on = i === index;
      tabs[i].setAttribute('aria-selected', on ? 'true' : 'false');
      tabs[i].tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    }
  }

  function init() {
    var mount = document.getElementById('tdb-cat-root');
    if (!mount) return;

    mount.setAttribute('aria-label', 'Color and tell my story');

    var note = document.createElement('p');
    note.className = 'tdb-cat-hero-note';
    note.textContent =
      'Color & Tell: each Bible story has a few big scenes. When you save all of them on this device, you can watch your own slideshow—your colors, your story. No account needed.';

    var progressWrap = document.createElement('div');
    progressWrap.className = 'tdb-cat-progress';
    progressWrap.setAttribute('aria-label', 'Story progress');

    mount.appendChild(note);
    mount.appendChild(progressWrap);

    buildSlideshowShell();

    function refreshAllProgress() {
      refreshProgressCards(progressWrap);
    }

    for (var si = 0; si < STORIES.length; si++) {
      (function (story) {
        var section = document.createElement('section');
        section.className = 'tdb-cat-story';
        section.setAttribute('data-tdb-story', story.id);

        var h2 = document.createElement('h2');
        h2.className = 'tdb-cat-story-title';
        h2.textContent = story.title;

        var lead = document.createElement('p');
        lead.className = 'tdb-cat-story-lead';
        lead.textContent = story.lead;

        var celebrate = document.createElement('p');
        celebrate.className = 'tdb-cat-story-celebrate';
        celebrate.setAttribute('role', 'status');

        var tablist = document.createElement('div');
        tablist.className = 'tdb-cat-tabs';
        tablist.setAttribute('role', 'tablist');
        tablist.setAttribute('aria-label', story.title + ' scenes');

        var panelsWrap = document.createElement('div');
        panelsWrap.className = 'tdb-cat-panels';

        for (var ti = 0; ti < story.scenes.length; ti++) {
          (function (sceneIdx) {
            var sc = story.scenes[sceneIdx];
            var tab = document.createElement('button');
            tab.type = 'button';
            tab.className = 'tdb-cat-tab';
            tab.setAttribute('role', 'tab');
            tab.id = 'tab-' + story.id + '-' + sc.id;
            tab.setAttribute('aria-controls', 'panel-' + story.id + '-' + sc.id);
            tab.setAttribute('aria-selected', sceneIdx === 0 ? 'true' : 'false');
            tab.tabIndex = sceneIdx === 0 ? 0 : -1;
            tab.textContent = 'Scene ' + (sceneIdx + 1);
            tab.addEventListener('click', function () {
              selectTab(story, sceneIdx, section);
            });
            tablist.appendChild(tab);

            var panel = document.createElement('div');
            panel.className = 'tdb-cat-panel';
            panel.id = 'panel-' + story.id + '-' + sc.id;
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', 'tab-' + story.id + '-' + sc.id);
            panel.hidden = sceneIdx !== 0;

            var cap = document.createElement('p');
            cap.className = 'tdb-cat-scene-caption';
            cap.textContent = sc.caption;
            var verse = document.createElement('p');
            verse.className = 'tdb-cat-scene-verse';
            verse.textContent = sc.verse;

            var jlBox = document.createElement('div');
            jlBox.className = 'tdb-cat-jl-wrap';
            var jl = createJl(sc);
            jlBox.appendChild(jl);

            var saveBtn = document.createElement('button');
            saveBtn.type = 'button';
            saveBtn.className = 'btn btn-primary tdb-cat-save-scene';
            saveBtn.textContent = 'Save this scene to My Story';

            var msg = document.createElement('p');
            msg.className = 'tdb-cat-scene-saved-msg';
            if (getSaved(story.id, sc.id)) {
              msg.textContent = 'Saved on this device — you can change it anytime.';
            }

            saveBtn.addEventListener('click', function () {
              if (typeof jl.exportCompositePng !== 'function') {
                window.alert('Coloring is still loading. Wait a moment, then try again.');
                return;
              }
              jl.exportCompositePng().then(function (png) {
                if (!png) {
                  window.alert('Could not read the picture yet. Try again in a second.');
                  return null;
                }
                return pngToJpeg(png, JPEG_QUALITY);
              }).then(function (jpeg) {
                if (!jpeg) return;
                try {
                  setSaved(story.id, sc.id, jpeg);
                } catch (err) {
                  if (err && err.name === 'QuotaExceededError') {
                    window.alert(
                      'This device is full. Ask a grown-up to free a little space, or clear old saves from other sites.'
                    );
                  } else {
                    window.alert('Could not save. Try again.');
                  }
                  return;
                }
                msg.textContent = 'Saved! This scene is in your story.';
                refreshAllProgress();
                updateStoryUI(story, section, watchBtn, celebrate);
              }).catch(function () {
                window.alert('Could not save the picture. Try again.');
              });
            });

            panel.appendChild(cap);
            panel.appendChild(verse);
            panel.appendChild(jlBox);
            panel.appendChild(saveBtn);
            panel.appendChild(msg);
            panelsWrap.appendChild(panel);
          })(ti);
        }

        var watchBtn = document.createElement('button');
        watchBtn.type = 'button';
        watchBtn.className = 'btn btn-primary tdb-cat-watch-story';
        watchBtn.textContent = 'Watch My Story';
        watchBtn.setAttribute('aria-describedby', 'tdb-cat-watch-hint-' + story.id);
        watchBtn.addEventListener('click', function () {
          openSlideshow(story);
        });

        section.appendChild(h2);
        section.appendChild(lead);
        section.appendChild(celebrate);
        section.appendChild(tablist);
        section.appendChild(panelsWrap);
        section.appendChild(watchBtn);

        var hint = document.createElement('p');
        hint.className = 'section-note';
        hint.id = 'tdb-cat-watch-hint-' + story.id;
        hint.textContent =
          'Watch My Story appears when every scene above is saved on this device.';
        section.appendChild(hint);

        mount.appendChild(section);
        updateStoryUI(story, section, watchBtn, celebrate);
      })(STORIES[si]);
    }

    refreshAllProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
