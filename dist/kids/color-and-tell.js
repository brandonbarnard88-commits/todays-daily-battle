/**
 * Color & Tell My Story — groups jl-coloringbook scenes per Bible story,
 * saves JPEG snapshots to localStorage, progress cards, fullscreen slideshow.
 */
(function () {
  'use strict';

  var STORAGE_PREFIX = 'tdb-cat-v1:';
  var JPEG_QUALITY = 0.82;
  var AUTOPLAY_MS = 4500;

  /** Split scene verse into quote body + KJV reference when possible. */
  function formatVerseStrip(verseText) {
    var raw = String(verseText || '').trim();
    if (!raw) return { quote: '', ref: '' };
    var m = raw.match(
      /^(.+?)\s+((?:[1-3]\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)?\s+\d[\d:,-]*(?:\s*\(KJV\))?)$/i
    );
    if (m && m[1].length > 12) {
      return {
        quote: m[1].replace(/[\s.\u2014\u2013\-]+$/, '').trim(),
        ref: m[2].trim()
      };
    }
    return { quote: raw, ref: '' };
  }

  function buildVerseStrip(verseText) {
    var strip = document.createElement('div');
    strip.className = 'kids-verse-strip';
    var parts = formatVerseStrip(verseText);
    var pq = document.createElement('p');
    if (parts.quote) {
      pq.textContent =
        parts.quote.charAt(0) === '\u201c' || parts.quote.charAt(0) === '"'
          ? parts.quote
          : '\u201c' + parts.quote + '\u201d';
    }
    strip.appendChild(pq);
    if (parts.ref) {
      var sm = document.createElement('small');
      sm.textContent = '\u2014 ' + parts.ref;
      strip.appendChild(sm);
    }
    return strip;
  }

  window.printColoringScene = function () {
    document.body.classList.add('tdb-kids-printing');
    window.print();
    window.setTimeout(function () {
      document.body.classList.remove('tdb-kids-printing');
    }, 400);
  };

  /** Browser-print a blank 2×2 (or stack) storyboard for fridge/table coloring. */
  function printStoryboard(story) {
    if (!story || !story.scenes || !story.scenes.length) return;
    var existing = document.getElementById('tdb-cat-storyboard-print');
    if (existing) existing.remove();

    var root = document.createElement('div');
    root.id = 'tdb-cat-storyboard-print';
    root.className = 'tdb-cat-storyboard-print';
    root.setAttribute('aria-hidden', 'true');

    var banner = document.createElement('header');
    banner.className = 'tdb-cat-storyboard-print__banner';
    var h = document.createElement('h1');
    h.textContent = story.title;
    banner.appendChild(h);
    var topVerse = document.createElement('p');
    topVerse.className = 'tdb-cat-storyboard-print__top-verse';
    topVerse.textContent = story.verse || '';
    banner.appendChild(topVerse);
    root.appendChild(banner);

    var grid = document.createElement('div');
    grid.className =
      'tdb-cat-storyboard-print__grid' +
      (story.scenes.length <= 2 ? ' tdb-cat-storyboard-print__grid--two' : '');
    for (var i = 0; i < story.scenes.length; i++) {
      var sc = story.scenes[i];
      var cell = document.createElement('figure');
      cell.className = 'tdb-cat-storyboard-print__cell';
      var img = document.createElement('img');
      img.src = bestSceneSrc(sc);
      img.alt = sc.alt || sc.caption || '';
      img.loading = 'eager';
      img.decoding = 'sync';
      cell.appendChild(img);
      var figcap = document.createElement('figcaption');
      var beat = document.createElement('span');
      beat.className = 'tdb-cat-storyboard-print__caption';
      beat.textContent = sc.caption || '';
      figcap.appendChild(beat);
      var kv = document.createElement('span');
      kv.className = 'tdb-cat-storyboard-print__kjv';
      kv.textContent = sc.verse || '';
      figcap.appendChild(kv);
      cell.appendChild(figcap);
      grid.appendChild(cell);
    }
    root.appendChild(grid);

    var foot = document.createElement('footer');
    foot.className = 'tdb-cat-storyboard-print__foot';
    var idea = document.createElement('p');
    idea.className = 'tdb-cat-storyboard-print__idea';
    idea.textContent = 'One big idea: ' + (story.idea || 'God’s Word is for real life.');
    foot.appendChild(idea);
    var mem = document.createElement('p');
    mem.className = 'tdb-cat-storyboard-print__memory';
    mem.textContent = story.verse || '';
    foot.appendChild(mem);
    var nameLine = document.createElement('p');
    nameLine.className = 'tdb-cat-storyboard-print__name';
    nameLine.textContent = 'Name: ________________________  Date: ____________';
    foot.appendChild(nameLine);
    var credit = document.createElement('p');
    credit.className = 'tdb-cat-storyboard-print__credit';
    credit.textContent = "Today's Daily Battle · todaysdailybattle.com · KJV only";
    foot.appendChild(credit);
    root.appendChild(foot);

    document.body.appendChild(root);
    document.body.classList.add('tdb-kids-printing', 'tdb-cat-printing-storyboard');
    window.print();
    window.setTimeout(function () {
      document.body.classList.remove('tdb-kids-printing', 'tdb-cat-printing-storyboard');
      if (root.parentNode) root.parentNode.removeChild(root);
    }, 500);
  }
  var STORY_QUERY_ALIASES = {
    'baby-jesus': 'nativity',
    babyjesus: 'nativity',
    resurrection: 'empty-tomb',
    emptytomb: 'empty-tomb',
    prodigal: 'prodigal-son',
    prodigalson: 'prodigal-son',
    samaritan: 'good-samaritan',
    goodsamaritan: 'good-samaritan',
    storm: 'jesus-storm',
    jesusstorm: 'jesus-storm',
    daniel: 'daniel-lions',
    daniellions: 'daniel-lions',
    moses: 'moses-red-sea',
    mosesredsea: 'moses-red-sea',
    redsea: 'moses-red-sea',
    babymoses: 'baby-moses',
    jesus: 'jesus-children',
    'll-honesty': 'll-honesty',
    llhonesty: 'll-honesty',
    'll-commandments': 'll-commandments',
    llcommandments: 'll-commandments'
  };

  var LISTEN_AUDIO_VERSION = '20260905listen3';
  var COLORING_LISTEN = {};

  var listenAudio = null;
  var listenBtnActive = null;

  function stopStoryListen() {
    if (listenAudio) {
      try {
        listenAudio.pause();
        listenAudio.removeAttribute('src');
        listenAudio.load();
      } catch (eA) {}
      listenAudio = null;
    }
    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } catch (eS) {}
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.tdb-cat-hear-story').forEach(function (b) {
        b.setAttribute('aria-pressed', 'false');
        b.textContent = 'Hear the story';
      });
    }
    listenBtnActive = null;
  }

  function humanStoryAudioUrl(story) {
    if (!story || !story.id) return '';
    return (
      '/kids/audio/coloring/' +
      encodeURIComponent(story.id) +
      '.mp3?v=' +
      LISTEN_AUDIO_VERSION
    );
  }

  function playStoryListen(story, btn) {
    if (listenBtnActive === btn) {
      stopStoryListen();
      return;
    }
    stopStoryListen();
    var url = humanStoryAudioUrl(story);
    if (!url) return;
    listenBtnActive = btn;
    btn.setAttribute('aria-pressed', 'true');
    btn.textContent = 'Stop story';
    var audio = new Audio(url);
    audio.preload = 'auto';
    listenAudio = audio;
    audio.addEventListener('ended', function () {
      if (listenBtnActive === btn) stopStoryListen();
    });
    audio.addEventListener('error', function () {
      if (listenBtnActive === btn) stopStoryListen();
    });
    var p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () {
        if (listenBtnActive === btn) stopStoryListen();
      });
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopStoryListen();
    });
  }

  var STORY_RETURN_HANDOFFS = {
    'jesus-children': {
      storyHref: '/kids/corner.html?story=jesus',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    creation: {
      storyHref: '/kids/corner.html?story=creation',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    noah: {
      storyHref: '/kids/corner.html?story=noah',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    david: {
      storyHref: '/kids/corner.html?story=david',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    'jesus-storm': {
      storyHref: '/kids/corner.html?story=jesusCalmsStorm',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    'good-shepherd': {
      storyHref: '/kids/corner.html?story=psalm23Shepherd',
      sourceHref: '/little-ones.html',
      sourceLabel: 'Back to For the Little Ones'
    },
    'daniel-lions': {
      storyHref: '/kids/corner.html?story=daniel'
    },
    'll-honesty': {
      storyHref: '/life-lessons/walk-in-honesty.html',
      sourceHref: '/life-lessons.html',
      sourceLabel: 'Back to Life Lessons'
    },
    'll-commandments': {
      storyHref: '/life-lessons/ten-commandments-guardrails.html',
      sourceHref: '/life-lessons.html',
      sourceLabel: 'Back to Life Lessons'
    }
  };

  var PALETTE = [
    /* warm reds & pinks */
    'rgba(214, 40, 40, 0.92)',
    'rgba(236, 100, 100, 0.92)',
    'rgba(255, 182, 193, 0.92)',
    /* oranges */
    'rgba(230, 110, 20, 0.92)',
    'rgba(255, 165, 0, 0.92)',
    /* yellows */
    'rgba(240, 200, 18, 0.92)',
    'rgba(255, 240, 150, 0.92)',
    /* greens */
    'rgba(34, 139, 34, 0.92)',
    'rgba(120, 190, 80, 0.92)',
    /* blues */
    'rgba(37, 99, 235, 0.92)',
    'rgba(100, 170, 230, 0.92)',
    /* purples & violets */
    'rgba(126, 34, 206, 0.92)',
    'rgba(195, 130, 220, 0.92)',
    /* earth tones */
    'rgba(139, 90, 43, 0.92)',
    'rgba(205, 170, 125, 0.92)',
    /* skin tones */
    'rgba(255, 219, 172, 0.92)',
    'rgba(198, 134, 66, 0.92)',
    /* grays & blacks */
    'rgba(60, 60, 60, 0.92)',
    'rgba(160, 160, 160, 0.92)',
    /* eraser — must stay last */
    'white'
  ];

  /*
   * REAL COLORING BOOK ART MAP
   * Maps thin placeholder SVG scene paths → real line-art JPG/PNG that already
   * ship under /coloring-pages/ (panel art or full-page hero pages).
   *
   * Regenerated by: node scripts/build-coloring-scene-map.mjs
   * Injected by:    node scripts/inject-coloring-scene-map.mjs
   *
   * Priority: matching *-sN.jpg → story hero full-page → detailed SVG → placeholder.
   * No runtime Image() probes (avoids console 404 spam).
   */
  // TDB_SCENE_ART_START
  var TDB_SCENE_ART = {
  "/coloring-pages/creation-s1.svg": "/coloring-pages/bible-stories/creation-six-days-coloring-page.jpg",
  "/coloring-pages/creation-s2.svg": "/coloring-pages/bible-stories/creation-six-days-coloring-page.jpg",
  "/coloring-pages/creation-s3.svg": "/coloring-pages/bible-stories/creation-six-days-coloring-page.jpg",
  "/coloring-pages/creation-s4.svg": "/coloring-pages/bible-stories/creation-six-days-coloring-page.jpg",
  "/coloring-pages/baby-moses-s1.svg": "/coloring-pages/baby-moses-s1.jpg",
  "/coloring-pages/baby-moses-s2.svg": "/coloring-pages/baby-moses-s2.jpg",
  "/coloring-pages/baby-moses-s3.svg": "/coloring-pages/baby-moses-s3.jpg",
  "/coloring-pages/baby-moses-s4.svg": "/coloring-pages/baby-moses-s4.jpg",
  "/coloring-pages/moses-red-sea-s1.svg": "/coloring-pages/moses-red-sea-s1.jpg",
  "/coloring-pages/moses-red-sea-s2.svg": "/coloring-pages/moses-red-sea-s2.jpg",
  "/coloring-pages/moses-red-sea-s3.svg": "/coloring-pages/moses-red-sea-s3.jpg",
  "/coloring-pages/moses-red-sea-s4.svg": "/coloring-pages/moses-red-sea-s4.jpg",
  "/coloring-pages/jonah-s1.svg": "/coloring-pages/jonah-s1.jpg",
  "/coloring-pages/jonah-s2.svg": "/coloring-pages/jonah-s2.jpg",
  "/coloring-pages/jonah-s3.svg": "/coloring-pages/jonah-s3.jpg",
  "/coloring-pages/jonah-s4.svg": "/coloring-pages/jonah-s4.jpg",
  "/coloring-pages/noah-s1.svg": "/coloring-pages/noah-s1.jpg",
  "/coloring-pages/noah-s2.svg": "/coloring-pages/noah-s2.jpg",
  "/coloring-pages/noah-s3.svg": "/coloring-pages/noah-s3.jpg",
  "/coloring-pages/noah-s4.svg": "/coloring-pages/noah-s4.jpg",
  "/coloring-pages/david-s1.svg": "/coloring-pages/bible-stories/david-and-goliath-blank.jpg",
  "/coloring-pages/david-s2.svg": "/coloring-pages/bible-stories/david-and-goliath-blank.jpg",
  "/coloring-pages/david-s3.svg": "/coloring-pages/bible-stories/david-and-goliath-blank.jpg",
  "/coloring-pages/david-s4.svg": "/coloring-pages/bible-stories/david-and-goliath-blank.jpg",
  "/coloring-pages/daniel-lions-s1.svg": "/coloring-pages/bible-stories/daniel-in-the-lions-den-coloring-page.jpg",
  "/coloring-pages/daniel-lions-s2.svg": "/coloring-pages/bible-stories/daniel-in-the-lions-den-coloring-page.jpg",
  "/coloring-pages/daniel-lions-s3.svg": "/coloring-pages/bible-stories/daniel-in-the-lions-den-coloring-page.jpg",
  "/coloring-pages/daniel-lions-s4.svg": "/coloring-pages/bible-stories/daniel-in-the-lions-den-coloring-page.jpg",
  "/coloring-pages/feeding-5000-s1.svg": "/coloring-pages/feeding-5000-s1.jpg",
  "/coloring-pages/feeding-5000-s2.svg": "/coloring-pages/feeding-5000-s2.jpg",
  "/coloring-pages/feeding-5000-s3.svg": "/coloring-pages/feeding-5000-s3.jpg",
  "/coloring-pages/feeding-5000-s4.svg": "/coloring-pages/feeding-5000-s4.jpg",
  "/coloring-pages/jesus-storm-s1.svg": "/coloring-pages/jesus-storm-s1.jpg",
  "/coloring-pages/jesus-storm-s2.svg": "/coloring-pages/jesus-storm-s2.jpg",
  "/coloring-pages/jesus-storm-s3.svg": "/coloring-pages/jesus-storm-s3.jpg",
  "/coloring-pages/jesus-storm-s4.svg": "/coloring-pages/jesus-storm-s4.jpg",
  "/coloring-pages/jesus-children-s1.svg": "/coloring-pages/jesus-children-fill.png",
  "/coloring-pages/jesus-children-s2.svg": "/coloring-pages/jesus-children-fill.png",
  "/coloring-pages/jesus-children-s3.svg": "/coloring-pages/jesus-children-fill.png",
  "/coloring-pages/jesus-children-s4.svg": "/coloring-pages/jesus-children-fill.png",
  "/coloring-pages/good-samaritan-s1.svg": "/coloring-pages/good-samaritan-s1.jpg",
  "/coloring-pages/good-samaritan-s2.svg": "/coloring-pages/good-samaritan-s2.jpg",
  "/coloring-pages/good-samaritan-s3.svg": "/coloring-pages/good-samaritan-s3.jpg",
  "/coloring-pages/good-samaritan-s4.svg": "/coloring-pages/good-samaritan-s4.jpg",
  "/coloring-pages/empty-tomb-s1.svg": "/coloring-pages/bible-stories/empty-tomb-coloring-page.jpg",
  "/coloring-pages/empty-tomb-s2.svg": "/coloring-pages/bible-stories/empty-tomb-coloring-page.jpg",
  "/coloring-pages/empty-tomb-s3.svg": "/coloring-pages/bible-stories/empty-tomb-coloring-page.jpg",
  "/coloring-pages/empty-tomb-s4.svg": "/coloring-pages/bible-stories/empty-tomb-coloring-page.jpg",
  "/coloring-pages/prodigal-son-s1.svg": "/coloring-pages/prodigal-son-s1.jpg",
  "/coloring-pages/prodigal-son-s2.svg": "/coloring-pages/prodigal-son-s2.jpg",
  "/coloring-pages/prodigal-son-s3.svg": "/coloring-pages/prodigal-son-s3.jpg",
  "/coloring-pages/prodigal-son-s4.svg": "/coloring-pages/prodigal-son-s4.jpg",
  "/coloring-pages/walks-on-water-s1.svg": "/coloring-pages/walks-on-water-s1.jpg",
  "/coloring-pages/walks-on-water-s2.svg": "/coloring-pages/walks-on-water-s2.jpg",
  "/coloring-pages/walks-on-water-s3.svg": "/coloring-pages/walks-on-water-s3.jpg",
  "/coloring-pages/walks-on-water-s4.svg": "/coloring-pages/walks-on-water-s4.jpg",
  "/coloring-pages/zacchaeus-s1.svg": "/coloring-pages/zacchaeus-s1.jpg",
  "/coloring-pages/zacchaeus-s2.svg": "/coloring-pages/zacchaeus-s2.jpg",
  "/coloring-pages/zacchaeus-s3.svg": "/coloring-pages/zacchaeus-s3.jpg",
  "/coloring-pages/zacchaeus-s4.svg": "/coloring-pages/zacchaeus-s4.jpg",
  "/coloring-pages/woman-at-well-s1.svg": "/coloring-pages/woman-at-well-s1.jpg",
  "/coloring-pages/woman-at-well-s2.svg": "/coloring-pages/woman-at-well-s2.jpg",
  "/coloring-pages/woman-at-well-s3.svg": "/coloring-pages/woman-at-well-s3.jpg",
  "/coloring-pages/woman-at-well-s4.svg": "/coloring-pages/woman-at-well-s4.jpg",
  "/coloring-pages/ruth-naomi-s1.svg": "/coloring-pages/ruth-naomi-s1.jpg",
  "/coloring-pages/ruth-naomi-s2.svg": "/coloring-pages/ruth-naomi-s2.jpg",
  "/coloring-pages/ruth-naomi-s3.svg": "/coloring-pages/ruth-naomi-s3.jpg",
  "/coloring-pages/ruth-naomi-s4.svg": "/coloring-pages/ruth-naomi-s4.jpg",
  "/coloring-pages/lazarus-s1.svg": "/coloring-pages/lazarus-s1.jpg",
  "/coloring-pages/lazarus-s2.svg": "/coloring-pages/lazarus-s2.jpg",
  "/coloring-pages/lazarus-s3.svg": "/coloring-pages/lazarus-s3.jpg",
  "/coloring-pages/lazarus-s4.svg": "/coloring-pages/lazarus-s4.jpg",
  "/coloring-pages/lost-sheep-s1.svg": "/coloring-pages/lost-sheep-s1.jpg",
  "/coloring-pages/lost-sheep-s2.svg": "/coloring-pages/lost-sheep-s2.jpg",
  "/coloring-pages/lost-sheep-s3.svg": "/coloring-pages/lost-sheep-s3.jpg",
  "/coloring-pages/lost-sheep-s4.svg": "/coloring-pages/lost-sheep-s4.jpg",
  "/coloring-pages/jairus-daughter-s1.svg": "/coloring-pages/jairus-daughter-s1.jpg",
  "/coloring-pages/jairus-daughter-s2.svg": "/coloring-pages/jairus-daughter-s2.jpg",
  "/coloring-pages/jairus-daughter-s3.svg": "/coloring-pages/jairus-daughter-s3.jpg",
  "/coloring-pages/jairus-daughter-s4.svg": "/coloring-pages/jairus-daughter-s4.jpg",
  "/coloring-pages/blind-man-s1.svg": "/coloring-pages/blind-man-s1.jpg",
  "/coloring-pages/blind-man-s2.svg": "/coloring-pages/blind-man-s2.jpg",
  "/coloring-pages/blind-man-s3.svg": "/coloring-pages/blind-man-s3.jpg",
  "/coloring-pages/blind-man-s4.svg": "/coloring-pages/blind-man-s4.jpg",
  "/coloring-pages/fishers-of-men-s1.svg": "/coloring-pages/fishers-of-men-s1.jpg",
  "/coloring-pages/fishers-of-men-s2.svg": "/coloring-pages/fishers-of-men-s2.jpg",
  "/coloring-pages/fishers-of-men-s3.svg": "/coloring-pages/fishers-of-men-s3.jpg",
  "/coloring-pages/fishers-of-men-s4.svg": "/coloring-pages/fishers-of-men-s4.jpg",
  "/coloring-pages/wedding-cana-s1.svg": "/coloring-pages/wedding-cana-s1.jpg",
  "/coloring-pages/wedding-cana-s2.svg": "/coloring-pages/wedding-cana-s2.jpg",
  "/coloring-pages/wedding-cana-s3.svg": "/coloring-pages/wedding-cana-s3.jpg",
  "/coloring-pages/wedding-cana-s4.svg": "/coloring-pages/wedding-cana-s4.jpg",
  "/coloring-pages/mustard-seed-s1.svg": "/coloring-pages/mustard-seed.jpg",
  "/coloring-pages/mustard-seed-s2.svg": "/coloring-pages/mustard-seed.jpg",
  "/coloring-pages/mustard-seed-s3.svg": "/coloring-pages/mustard-seed.jpg",
  "/coloring-pages/mustard-seed-s4.svg": "/coloring-pages/mustard-seed.jpg",
  "/coloring-pages/the-sower-s1.svg": "/coloring-pages/the-sower.jpg",
  "/coloring-pages/the-sower-s2.svg": "/coloring-pages/the-sower.jpg",
  "/coloring-pages/the-sower-s3.svg": "/coloring-pages/the-sower.jpg",
  "/coloring-pages/the-sower-s4.svg": "/coloring-pages/the-sower.jpg",
  "/coloring-pages/triumphal-entry-s1.svg": "/coloring-pages/triumphal-entry.jpg",
  "/coloring-pages/triumphal-entry-s2.svg": "/coloring-pages/triumphal-entry.jpg",
  "/coloring-pages/triumphal-entry-s3.svg": "/coloring-pages/triumphal-entry.jpg",
  "/coloring-pages/triumphal-entry-s4.svg": "/coloring-pages/triumphal-entry.jpg",
  "/coloring-pages/lost-coin-s1.svg": "/coloring-pages/lost-coin.jpg",
  "/coloring-pages/lost-coin-s2.svg": "/coloring-pages/lost-coin.jpg",
  "/coloring-pages/lost-coin-s3.svg": "/coloring-pages/lost-coin.jpg",
  "/coloring-pages/lost-coin-s4.svg": "/coloring-pages/lost-coin.jpg",
  "/coloring-pages/healing-paralytic-s1.svg": "/coloring-pages/healing-paralytic.jpg",
  "/coloring-pages/healing-paralytic-s2.svg": "/coloring-pages/healing-paralytic.jpg",
  "/coloring-pages/healing-paralytic-s3.svg": "/coloring-pages/healing-paralytic.jpg",
  "/coloring-pages/healing-paralytic-s4.svg": "/coloring-pages/healing-paralytic.jpg",
  "/coloring-pages/good-shepherd-s1.svg": "/coloring-pages/good-shepherd-s1.jpg",
  "/coloring-pages/good-shepherd-s2.svg": "/coloring-pages/good-shepherd-s2.jpg",
  "/coloring-pages/good-shepherd-s3.svg": "/coloring-pages/good-shepherd-s3.jpg",
  "/coloring-pages/good-shepherd-s4.svg": "/coloring-pages/good-shepherd-s4.jpg",
  "/coloring-pages/feeding-4000-s1.svg": "/coloring-pages/feeding-4000.jpg",
  "/coloring-pages/feeding-4000-s2.svg": "/coloring-pages/feeding-4000.jpg",
  "/coloring-pages/feeding-4000-s3.svg": "/coloring-pages/feeding-4000.jpg",
  "/coloring-pages/feeding-4000-s4.svg": "/coloring-pages/feeding-4000.jpg",
  "/coloring-pages/wise-foolish-builders-s1.svg": "/coloring-pages/wise-foolish-builders.jpg",
  "/coloring-pages/wise-foolish-builders-s2.svg": "/coloring-pages/wise-foolish-builders.jpg",
  "/coloring-pages/wise-foolish-builders-s3.svg": "/coloring-pages/wise-foolish-builders.jpg",
  "/coloring-pages/wise-foolish-builders-s4.svg": "/coloring-pages/wise-foolish-builders.jpg",
  "/coloring-pages/the-talents-s1.svg": "/coloring-pages/the-talents.jpg",
  "/coloring-pages/the-talents-s2.svg": "/coloring-pages/the-talents.jpg",
  "/coloring-pages/the-talents-s3.svg": "/coloring-pages/the-talents.jpg",
  "/coloring-pages/the-talents-s4.svg": "/coloring-pages/the-talents.jpg",
  "/coloring-pages/persistent-widow-s1.svg": "/coloring-pages/persistent-widow.jpg",
  "/coloring-pages/persistent-widow-s2.svg": "/coloring-pages/persistent-widow.jpg",
  "/coloring-pages/persistent-widow-s3.svg": "/coloring-pages/persistent-widow.jpg",
  "/coloring-pages/persistent-widow-s4.svg": "/coloring-pages/persistent-widow.jpg",
  "/coloring-pages/healing-leper-s1.svg": "/coloring-pages/healing-leper.jpg",
  "/coloring-pages/healing-leper-s2.svg": "/coloring-pages/healing-leper.jpg",
  "/coloring-pages/healing-leper-s3.svg": "/coloring-pages/healing-leper.jpg",
  "/coloring-pages/healing-leper-s4.svg": "/coloring-pages/healing-leper.jpg",
  "/coloring-pages/joseph-coat-s1.svg": "/coloring-pages/joseph-coat.jpg",
  "/coloring-pages/joseph-coat-s2.svg": "/coloring-pages/joseph-coat.jpg",
  "/coloring-pages/joseph-coat-s3.svg": "/coloring-pages/joseph-coat.jpg",
  "/coloring-pages/joseph-coat-s4.svg": "/coloring-pages/joseph-coat.jpg",
  "/coloring-pages/joseph-dreams-s1.svg": "/coloring-pages/joseph-dreams.jpg",
  "/coloring-pages/joseph-dreams-s2.svg": "/coloring-pages/joseph-dreams.jpg",
  "/coloring-pages/joseph-dreams-s3.svg": "/coloring-pages/joseph-dreams.jpg",
  "/coloring-pages/joseph-dreams-s4.svg": "/coloring-pages/joseph-dreams.jpg",
  "/coloring-pages/burning-bush-s1.svg": "/coloring-pages/burning-bush.jpg",
  "/coloring-pages/burning-bush-s2.svg": "/coloring-pages/burning-bush.jpg",
  "/coloring-pages/burning-bush-s3.svg": "/coloring-pages/burning-bush.jpg",
  "/coloring-pages/burning-bush-s4.svg": "/coloring-pages/burning-bush.jpg",
  "/coloring-pages/jericho-s1.svg": "/coloring-pages/jericho.jpg",
  "/coloring-pages/jericho-s2.svg": "/coloring-pages/jericho.jpg",
  "/coloring-pages/jericho-s3.svg": "/coloring-pages/jericho.jpg",
  "/coloring-pages/jericho-s4.svg": "/coloring-pages/jericho.jpg",
  "/coloring-pages/gideon-fleece-s1.svg": "/coloring-pages/gideon-fleece.jpg",
  "/coloring-pages/gideon-fleece-s2.svg": "/coloring-pages/gideon-fleece.jpg",
  "/coloring-pages/gideon-fleece-s3.svg": "/coloring-pages/gideon-fleece.jpg",
  "/coloring-pages/gideon-fleece-s4.svg": "/coloring-pages/gideon-fleece.jpg",
  "/coloring-pages/samson-s1.svg": "/coloring-pages/samson.jpg",
  "/coloring-pages/samson-s2.svg": "/coloring-pages/samson.jpg",
  "/coloring-pages/samson-s3.svg": "/coloring-pages/samson.jpg",
  "/coloring-pages/samson-s4.svg": "/coloring-pages/samson.jpg",
  "/coloring-pages/esther-s1.svg": "/coloring-pages/esther.jpg",
  "/coloring-pages/esther-s2.svg": "/coloring-pages/esther.jpg",
  "/coloring-pages/esther-s3.svg": "/coloring-pages/esther.jpg",
  "/coloring-pages/esther-s4.svg": "/coloring-pages/esther.jpg",
  "/coloring-pages/fiery-furnace-s1.svg": "/coloring-pages/fiery-furnace.jpg",
  "/coloring-pages/fiery-furnace-s2.svg": "/coloring-pages/fiery-furnace.jpg",
  "/coloring-pages/fiery-furnace-s3.svg": "/coloring-pages/fiery-furnace.jpg",
  "/coloring-pages/fiery-furnace-s4.svg": "/coloring-pages/fiery-furnace.jpg",
  "/coloring-pages/abraham-isaac-s1.svg": "/coloring-pages/abraham-isaac.jpg",
  "/coloring-pages/abraham-isaac-s2.svg": "/coloring-pages/abraham-isaac.jpg",
  "/coloring-pages/abraham-isaac-s3.svg": "/coloring-pages/abraham-isaac.jpg",
  "/coloring-pages/abraham-isaac-s4.svg": "/coloring-pages/abraham-isaac.jpg",
  "/coloring-pages/elijah-carmel-s1.svg": "/coloring-pages/elijah-carmel.jpg",
  "/coloring-pages/elijah-carmel-s2.svg": "/coloring-pages/elijah-carmel.jpg",
  "/coloring-pages/elijah-carmel-s3.svg": "/coloring-pages/elijah-carmel.jpg",
  "/coloring-pages/elijah-carmel-s4.svg": "/coloring-pages/elijah-carmel.jpg",
  "/coloring-pages/naaman-s1.svg": "/coloring-pages/naaman.jpg",
  "/coloring-pages/naaman-s2.svg": "/coloring-pages/naaman.jpg",
  "/coloring-pages/naaman-s3.svg": "/coloring-pages/naaman.jpg",
  "/coloring-pages/naaman-s4.svg": "/coloring-pages/naaman.jpg",
  "/coloring-pages/boy-samuel-s1.svg": "/coloring-pages/boy-samuel.jpg",
  "/coloring-pages/boy-samuel-s2.svg": "/coloring-pages/boy-samuel.jpg",
  "/coloring-pages/boy-samuel-s3.svg": "/coloring-pages/boy-samuel.jpg",
  "/coloring-pages/boy-samuel-s4.svg": "/coloring-pages/boy-samuel.jpg",
  "/coloring-pages/ten-lepers-s1.svg": "/coloring-pages/ten-lepers.jpg",
  "/coloring-pages/ten-lepers-s2.svg": "/coloring-pages/ten-lepers.jpg",
  "/coloring-pages/ten-lepers-s3.svg": "/coloring-pages/ten-lepers.jpg",
  "/coloring-pages/ten-lepers-s4.svg": "/coloring-pages/ten-lepers.jpg",
  "/coloring-pages/pharisee-tax-collector-s1.svg": "/coloring-pages/pharisee-tax-collector.jpg",
  "/coloring-pages/pharisee-tax-collector-s2.svg": "/coloring-pages/pharisee-tax-collector.jpg",
  "/coloring-pages/pharisee-tax-collector-s3.svg": "/coloring-pages/pharisee-tax-collector.jpg",
  "/coloring-pages/pharisee-tax-collector-s4.svg": "/coloring-pages/pharisee-tax-collector.jpg",
  "/coloring-pages/widows-mite-s1.svg": "/coloring-pages/widows-mite.jpg",
  "/coloring-pages/widows-mite-s2.svg": "/coloring-pages/widows-mite.jpg",
  "/coloring-pages/widows-mite-s3.svg": "/coloring-pages/widows-mite.jpg",
  "/coloring-pages/widows-mite-s4.svg": "/coloring-pages/widows-mite.jpg",
  "/coloring-pages/centurion-servant-s1.svg": "/coloring-pages/centurion-servant.jpg",
  "/coloring-pages/centurion-servant-s2.svg": "/coloring-pages/centurion-servant.jpg",
  "/coloring-pages/centurion-servant-s3.svg": "/coloring-pages/centurion-servant.jpg",
  "/coloring-pages/centurion-servant-s4.svg": "/coloring-pages/centurion-servant.jpg",
  "/coloring-pages/abraham-sarah-s1.svg": "/coloring-pages/abraham-sarah.jpg",
  "/coloring-pages/abraham-sarah-s2.svg": "/coloring-pages/abraham-sarah.jpg",
  "/coloring-pages/abraham-sarah-s3.svg": "/coloring-pages/abraham-sarah.jpg",
  "/coloring-pages/abraham-sarah-s4.svg": "/coloring-pages/abraham-sarah.jpg",
  "/coloring-pages/elisha-oil-s1.svg": "/coloring-pages/elisha-oil.jpg",
  "/coloring-pages/elisha-oil-s2.svg": "/coloring-pages/elisha-oil.jpg",
  "/coloring-pages/elisha-oil-s3.svg": "/coloring-pages/elisha-oil.jpg",
  "/coloring-pages/elisha-oil-s4.svg": "/coloring-pages/elisha-oil.jpg",
  "/coloring-pages/hannah-samuel-s1.svg": "/coloring-pages/hannah-samuel.jpg",
  "/coloring-pages/hannah-samuel-s2.svg": "/coloring-pages/hannah-samuel.jpg",
  "/coloring-pages/hannah-samuel-s3.svg": "/coloring-pages/hannah-samuel.jpg",
  "/coloring-pages/hannah-samuel-s4.svg": "/coloring-pages/hannah-samuel.jpg",
  "/coloring-pages/david-jonathan-s1.svg": "/coloring-pages/david-jonathan.jpg",
  "/coloring-pages/david-jonathan-s2.svg": "/coloring-pages/david-jonathan.jpg",
  "/coloring-pages/david-jonathan-s3.svg": "/coloring-pages/david-jonathan.jpg",
  "/coloring-pages/david-jonathan-s4.svg": "/coloring-pages/david-jonathan.jpg",
  "/coloring-pages/rich-young-ruler-s1.svg": "/coloring-pages/rich-young-ruler.jpg",
  "/coloring-pages/rich-young-ruler-s2.svg": "/coloring-pages/rich-young-ruler.jpg",
  "/coloring-pages/rich-young-ruler-s3.svg": "/coloring-pages/rich-young-ruler.jpg",
  "/coloring-pages/rich-young-ruler-s4.svg": "/coloring-pages/rich-young-ruler.jpg",
  "/coloring-pages/pearl-great-price-s1.svg": "/coloring-pages/pearl-great-price.jpg",
  "/coloring-pages/pearl-great-price-s2.svg": "/coloring-pages/pearl-great-price.jpg",
  "/coloring-pages/pearl-great-price-s3.svg": "/coloring-pages/pearl-great-price.jpg",
  "/coloring-pages/pearl-great-price-s4.svg": "/coloring-pages/pearl-great-price.jpg",
  "/coloring-pages/withered-hand-s1.svg": "/coloring-pages/withered-hand.jpg",
  "/coloring-pages/withered-hand-s2.svg": "/coloring-pages/withered-hand.jpg",
  "/coloring-pages/withered-hand-s3.svg": "/coloring-pages/withered-hand.jpg",
  "/coloring-pages/withered-hand-s4.svg": "/coloring-pages/withered-hand.jpg",
  "/coloring-pages/unforgiving-servant-s1.svg": "/coloring-pages/unforgiving-servant.jpg",
  "/coloring-pages/unforgiving-servant-s2.svg": "/coloring-pages/unforgiving-servant.jpg",
  "/coloring-pages/unforgiving-servant-s3.svg": "/coloring-pages/unforgiving-servant.jpg",
  "/coloring-pages/unforgiving-servant-s4.svg": "/coloring-pages/unforgiving-servant.jpg",
  "/coloring-pages/boy-david-s1.svg": "/coloring-pages/boy-david.jpg",
  "/coloring-pages/boy-david-s2.svg": "/coloring-pages/boy-david.jpg",
  "/coloring-pages/boy-david-s3.svg": "/coloring-pages/boy-david.jpg",
  "/coloring-pages/boy-david-s4.svg": "/coloring-pages/boy-david.jpg",
  "/coloring-pages/elijah-ravens-s1.svg": "/coloring-pages/elijah-ravens.jpg",
  "/coloring-pages/elijah-ravens-s2.svg": "/coloring-pages/elijah-ravens.jpg",
  "/coloring-pages/elijah-ravens-s3.svg": "/coloring-pages/elijah-ravens.jpg",
  "/coloring-pages/elijah-ravens-s4.svg": "/coloring-pages/elijah-ravens.jpg",
  "/coloring-pages/writing-on-wall-s1.svg": "/coloring-pages/writing-on-wall.jpg",
  "/coloring-pages/writing-on-wall-s2.svg": "/coloring-pages/writing-on-wall.jpg",
  "/coloring-pages/writing-on-wall-s3.svg": "/coloring-pages/writing-on-wall.jpg",
  "/coloring-pages/writing-on-wall-s4.svg": "/coloring-pages/writing-on-wall.jpg",
  "/coloring-pages/ruth-boaz-s1.svg": "/coloring-pages/ruth-boaz.jpg",
  "/coloring-pages/ruth-boaz-s2.svg": "/coloring-pages/ruth-boaz.jpg",
  "/coloring-pages/ruth-boaz-s3.svg": "/coloring-pages/ruth-boaz.jpg",
  "/coloring-pages/ruth-boaz-s4.svg": "/coloring-pages/ruth-boaz.jpg",
  "/coloring-pages/jesus-baptism-s1.svg": "/coloring-pages/jesus-baptism.jpg",
  "/coloring-pages/jesus-baptism-s2.svg": "/coloring-pages/jesus-baptism.jpg",
  "/coloring-pages/jesus-baptism-s3.svg": "/coloring-pages/jesus-baptism.jpg",
  "/coloring-pages/jesus-baptism-s4.svg": "/coloring-pages/jesus-baptism.jpg",
  "/coloring-pages/emmaus-road-s1.svg": "/coloring-pages/emmaus-road.jpg",
  "/coloring-pages/emmaus-road-s2.svg": "/coloring-pages/emmaus-road.jpg",
  "/coloring-pages/emmaus-road-s3.svg": "/coloring-pages/emmaus-road.jpg",
  "/coloring-pages/emmaus-road-s4.svg": "/coloring-pages/emmaus-road.jpg",
  "/coloring-pages/jesus-washes-feet-s1.svg": "/coloring-pages/jesus-washes-feet.jpg",
  "/coloring-pages/jesus-washes-feet-s2.svg": "/coloring-pages/jesus-washes-feet.jpg",
  "/coloring-pages/jesus-washes-feet-s3.svg": "/coloring-pages/jesus-washes-feet.jpg",
  "/coloring-pages/jesus-washes-feet-s4.svg": "/coloring-pages/jesus-washes-feet.jpg",
  "/coloring-pages/transfiguration-s1.svg": "/coloring-pages/transfiguration.jpg",
  "/coloring-pages/transfiguration-s2.svg": "/coloring-pages/transfiguration.jpg",
  "/coloring-pages/transfiguration-s3.svg": "/coloring-pages/transfiguration.jpg",
  "/coloring-pages/transfiguration-s4.svg": "/coloring-pages/transfiguration.jpg",
  "/coloring-pages/jordan-crossing-s1.svg": "/coloring-pages/jordan-crossing.jpg",
  "/coloring-pages/jordan-crossing-s2.svg": "/coloring-pages/jordan-crossing.jpg",
  "/coloring-pages/jordan-crossing-s3.svg": "/coloring-pages/jordan-crossing.jpg",
  "/coloring-pages/jordan-crossing-s4.svg": "/coloring-pages/jordan-crossing.jpg",
  "/coloring-pages/balaams-donkey-s1.svg": "/coloring-pages/balaams-donkey.jpg",
  "/coloring-pages/balaams-donkey-s2.svg": "/coloring-pages/balaams-donkey.jpg",
  "/coloring-pages/balaams-donkey-s3.svg": "/coloring-pages/balaams-donkey.jpg",
  "/coloring-pages/balaams-donkey-s4.svg": "/coloring-pages/balaams-donkey.jpg",
  "/coloring-pages/elijah-taken-up-s1.svg": "/coloring-pages/elijah-taken-up.jpg",
  "/coloring-pages/elijah-taken-up-s2.svg": "/coloring-pages/elijah-taken-up.jpg",
  "/coloring-pages/elijah-taken-up-s3.svg": "/coloring-pages/elijah-taken-up.jpg",
  "/coloring-pages/elijah-taken-up-s4.svg": "/coloring-pages/elijah-taken-up.jpg",
  "/coloring-pages/nehemiah-walls-s1.svg": "/coloring-pages/nehemiah-walls.jpg",
  "/coloring-pages/nehemiah-walls-s2.svg": "/coloring-pages/nehemiah-walls.jpg",
  "/coloring-pages/nehemiah-walls-s3.svg": "/coloring-pages/nehemiah-walls.jpg",
  "/coloring-pages/nehemiah-walls-s4.svg": "/coloring-pages/nehemiah-walls.jpg",
  "/coloring-pages/jesus-tempted-s1.svg": "/coloring-pages/jesus-tempted.jpg",
  "/coloring-pages/jesus-tempted-s2.svg": "/coloring-pages/jesus-tempted.jpg",
  "/coloring-pages/jesus-tempted-s3.svg": "/coloring-pages/jesus-tempted.jpg",
  "/coloring-pages/jesus-tempted-s4.svg": "/coloring-pages/jesus-tempted.jpg",
  "/coloring-pages/paul-silas-prison-s1.svg": "/coloring-pages/paul-silas-prison.jpg",
  "/coloring-pages/paul-silas-prison-s2.svg": "/coloring-pages/paul-silas-prison.jpg",
  "/coloring-pages/paul-silas-prison-s3.svg": "/coloring-pages/paul-silas-prison.jpg",
  "/coloring-pages/paul-silas-prison-s4.svg": "/coloring-pages/paul-silas-prison.jpg",
  "/coloring-pages/lydia-purple-s1.svg": "/coloring-pages/lydia-believes-coloring.jpg",
  "/coloring-pages/lydia-purple-s2.svg": "/coloring-pages/lydia-believes-coloring.jpg",
  "/coloring-pages/lydia-purple-s3.svg": "/coloring-pages/lydia-believes-coloring.jpg",
  "/coloring-pages/lydia-purple-s4.svg": "/coloring-pages/lydia-believes-coloring.jpg",
  "/coloring-pages/tabitha-dorcas-s1.svg": "/coloring-pages/tabitha-dorcas.jpg",
  "/coloring-pages/tabitha-dorcas-s2.svg": "/coloring-pages/tabitha-dorcas.jpg",
  "/coloring-pages/tabitha-dorcas-s3.svg": "/coloring-pages/tabitha-dorcas.jpg",
  "/coloring-pages/tabitha-dorcas-s4.svg": "/coloring-pages/tabitha-dorcas.jpg",
  "/coloring-pages/nativity-s1.svg": "/coloring-pages/nativity-s1.jpg",
  "/coloring-pages/nativity-s2.svg": "/coloring-pages/nativity-s2.jpg",
  "/coloring-pages/nativity-s3.svg": "/coloring-pages/nativity-s3.jpg",
  "/coloring-pages/nativity-s4.svg": "/coloring-pages/nativity-s4.jpg",
  "/coloring-pages/paul-shipwreck-s1.svg": "/coloring-pages/paul-shipwreck.jpg",
  "/coloring-pages/paul-shipwreck-s2.svg": "/coloring-pages/paul-shipwreck.jpg",
  "/coloring-pages/paul-shipwreck-s3.svg": "/coloring-pages/paul-shipwreck.jpg",
  "/coloring-pages/paul-shipwreck-s4.svg": "/coloring-pages/paul-shipwreck.jpg",
  "/coloring-pages/rahab-spies-s1.svg": "/coloring-pages/rahab-spies-coloring.jpg",
  "/coloring-pages/rahab-spies-s2.svg": "/coloring-pages/rahab-spies-coloring.jpg",
  "/coloring-pages/rahab-spies-s3.svg": "/coloring-pages/rahab-spies-coloring.jpg",
  "/coloring-pages/rahab-spies-s4.svg": "/coloring-pages/rahab-spies-coloring.jpg",
  "/coloring-pages/elijah-widow-s1.svg": "/coloring-pages/elijah-widow.jpg",
  "/coloring-pages/elijah-widow-s2.svg": "/coloring-pages/elijah-widow.jpg",
  "/coloring-pages/elijah-widow-s3.svg": "/coloring-pages/elijah-widow.jpg",
  "/coloring-pages/elijah-widow-s4.svg": "/coloring-pages/elijah-widow.jpg",
  "/coloring-pages/philip-ethiopian-s1.svg": "/coloring-pages/philip-ethiopian.jpg",
  "/coloring-pages/philip-ethiopian-s2.svg": "/coloring-pages/philip-ethiopian.jpg",
  "/coloring-pages/philip-ethiopian-s3.svg": "/coloring-pages/philip-ethiopian.jpg",
  "/coloring-pages/philip-ethiopian-s4.svg": "/coloring-pages/philip-ethiopian.jpg",
  "/coloring-pages/david-spares-saul-s1.svg": "/coloring-pages/david-spares-saul.jpg",
  "/coloring-pages/david-spares-saul-s2.svg": "/coloring-pages/david-spares-saul.jpg",
  "/coloring-pages/david-spares-saul-s3.svg": "/coloring-pages/david-spares-saul.jpg",
  "/coloring-pages/david-spares-saul-s4.svg": "/coloring-pages/david-spares-saul.jpg",
  "/coloring-pages/ll-honesty-s1.svg": "/coloring-pages/ll-honesty.jpg",
  "/coloring-pages/ll-honesty-s2.svg": "/coloring-pages/ll-honesty.jpg",
  "/coloring-pages/ll-commandments-s1.svg": "/coloring-pages/ll-commandments.jpg",
  "/coloring-pages/ll-commandments-s2.svg": "/coloring-pages/ll-commandments.jpg"
};
  // TDB_SCENE_ART_END

  /** Returns the best available line-art src for a scene (raster preferred). */
  var ART_CACHE = '20260905art3';
  function bestSceneSrc(scene) {
    if (!scene || !scene.src) return '';
    var src = (TDB_SCENE_ART && TDB_SCENE_ART[scene.src]) || scene.src;
    if (src && /\.(jpe?g|png|webp)$/i.test(src)) src += '?v=' + ART_CACHE;
    return src;
  }

  /**
   * Upgrade STORIES in place: point every scene at real art, and collapse
   * multi-panel stick-figure sets that all resolve to the same full-page raster
   * into a single classic coloring-book page (better Watch My Story + UX).
   */
  function applyRealColoringArt() {
    if (!STORIES || !STORIES.length) return;
    for (var i = 0; i < STORIES.length; i++) {
      var story = STORIES[i];
      if (!story.scenes || !story.scenes.length) continue;
      var resolved = [];
      var j;
      for (j = 0; j < story.scenes.length; j++) {
        resolved.push(bestSceneSrc(story.scenes[j]));
      }
      var allSame = true;
      for (j = 1; j < resolved.length; j++) {
        if (resolved[j] !== resolved[0]) {
          allSame = false;
          break;
        }
      }
      var isRaster = /\.(jpe?g|png|webp)(\?|$)/i.test(resolved[0] || '');
      if (story.scenes.length > 1 && allSame && isRaster) {
        var first = story.scenes[0];
        // Full-page hero: keep whole-story KJV + idea so the picture has full context.
        story.scenes = [
          {
            id: '1',
            src: resolved[0],
            alt: first.alt || story.title,
            caption: first.caption || story.idea || story.title,
            verse: story.verse || first.verse || ''
          }
        ];
        if (story.lead && /four|panels|scene\(s\)/i.test(story.lead)) {
          story.lead =
            'Color this classic Bible story page, save it, then open Watch My Story.';
        }
      } else {
        for (j = 0; j < story.scenes.length; j++) {
          story.scenes[j].src = resolved[j];
        }
      }
    }
  }

  /**
   * Build the story-context block shown with every coloring scene
   * (title, what's happening, KJV) so kids always know the picture's story.
   */
  function buildSceneStoryCard(story, scene, sceneIdx, sceneTotal) {
    var card = document.createElement('div');
    card.className = 'tdb-cat-scene-story-card';

    var label = document.createElement('p');
    label.className = 'tdb-cat-scene-label';
    if (sceneTotal > 1) {
      label.textContent =
        'Scene ' + (sceneIdx + 1) + ' of ' + sceneTotal + ' · ' + (story.title || '');
    } else {
      label.textContent = story.title || 'Bible story';
    }
    card.appendChild(label);

    if (scene.caption) {
      var cap = document.createElement('p');
      cap.className = 'tdb-cat-scene-caption';
      cap.textContent = scene.caption;
      card.appendChild(cap);
    }

    var pictureHint = scene.alt || '';
    if (pictureHint) {
      var pic = document.createElement('p');
      pic.className = 'tdb-cat-scene-picture-hint';
      pic.textContent = 'In this picture: ' + pictureHint;
      card.appendChild(pic);
    }

    if (story.idea) {
      var idea = document.createElement('p');
      idea.className = 'tdb-cat-scene-idea';
      idea.textContent = 'Big idea: ' + story.idea;
      card.appendChild(idea);
    }

    return card;
  }

  /**
   * Composite caption + KJV under a saved coloring PNG so Watch My Story
   * and downloads keep the story text with the picture.
   */
  function compositeStoryTextUnderImage(pngDataUrl, story, scene) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var pad = 24;
        var textBlockH = 120;
        var w = img.naturalWidth;
        var h = img.naturalHeight + textBlockH;
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0);

        var y = img.naturalHeight + 18;
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, img.naturalHeight, w, textBlockH);
        ctx.strokeStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(0, img.naturalHeight + 0.5);
        ctx.lineTo(w, img.naturalHeight + 0.5);
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold ' + Math.max(18, Math.round(w / 42)) + 'px system-ui, sans-serif';
        var title = story.title || '';
        ctx.fillText(title, pad, y + 8);

        ctx.font = Math.max(16, Math.round(w / 48)) + 'px system-ui, sans-serif';
        ctx.fillStyle = '#1e293b';
        var cap = scene.caption || '';
        // simple wrap
        var maxW = w - pad * 2;
        var words = cap.split(/\s+/);
        var line = '';
        var ly = y + 36;
        var lineH = Math.max(20, Math.round(w / 45));
        for (var i = 0; i < words.length; i++) {
          var test = line ? line + ' ' + words[i] : words[i];
          if (ctx.measureText(test).width > maxW && line) {
            ctx.fillText(line, pad, ly);
            line = words[i];
            ly += lineH;
            if (ly > h - 28) break;
          } else {
            line = test;
          }
        }
        if (line && ly <= h - 28) ctx.fillText(line, pad, ly);

        var verse = scene.verse || story.verse || '';
        if (verse) {
          ctx.fillStyle = '#7c3d12';
          ctx.font =
            'italic ' + Math.max(14, Math.round(w / 52)) + 'px Georgia, serif';
          var vLine = verse.length > 110 ? verse.slice(0, 107) + '…' : verse;
          ctx.fillText(vLine, pad, h - 16);
        }

        resolve(c.toDataURL('image/png'));
      };
      img.onerror = function () {
        reject(new Error('image'));
      };
      img.src = pngDataUrl;
    });
  }

  /** KJV refs in captions — short for on-screen (OT first, then Gospels) */
  var STORIES = [
    {
      id: 'creation',
      title: 'Creation',
      verse: 'And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day. — Genesis 1:31 (KJV)',
      lead: 'Four gentle panels that walk through Creation. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God made everything good.',
      idea: 'God made everything good.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/creation-s1.svg',
          alt: 'The world God made — people, animals, trees, and the sun',
          caption: 'God made the heavens and the earth, and it was very good.',
          verse: '“And God said, Let there be light: and there was light.” — Genesis 1:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/creation-s2.svg',
          alt: 'Sky, seas, and dry land take shape as God makes a home for life',
          caption: 'Sky, seas, and land — God shapes a home.',
          verse: '“And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.” — Genesis 1:10 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/creation-s3.svg',
          alt: 'Sun, moon, and living creatures fill the world God made',
          caption: 'Sun, moon, and living creatures fill the world.',
          verse: '“And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.” — Genesis 1:16 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/creation-s4.svg',
          alt: 'People made in God’s image and a world that is very good',
          caption: 'People in His image; God rests — it is very good.',
          verse: '“And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.” — Genesis 1:31 (KJV)'
        }
      ]
    },
    {
      id: 'baby-moses',
      title: 'Baby Moses',
      verse: 'And the child grew, and she brought him unto Pharaoh’s daughter, and he became her son. And she called his name Moses: and she said, Because I drew him out of the water. — Exodus 2:10 (KJV)',
      lead: 'Four gentle panels that walk through Baby Moses. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God watches over little ones.',
      idea: 'God watches over little ones.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/baby-moses-s1.svg',
          alt: 'Moses’ mother and Miriam lay the ark of bulrushes in the flags by the river',
          caption: 'And when she could not longer hide him, she took for him an ark of bulrushes, and daubed it with slime and with pitch, and put the child therein; and she laid it in the flags by the river’s brink.',
          verse: '“And when she could not longer hide him, she took for him an ark of bulrushes, and daubed it with slime and with pitch, and put the child therein; and she laid it in the flags by the river’s brink.” — Exodus 2:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/baby-moses-s2.svg',
          alt: 'Pharaoh’s daughter finds the ark of bulrushes by the river',
          caption: 'And when she had opened it, she saw the child: and, behold, the babe wept. And she had compassion on him, and said, This is one of the Hebrews’ children.',
          verse: '“And when she had opened it, she saw the child: and, behold, the babe wept. And she had compassion on him, and said, This is one of the Hebrews’ children.” — Exodus 2:6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/baby-moses-s3.svg',
          alt: 'Miriam asks Pharaoh’s daughter if she should call a Hebrew nurse',
          caption: 'Then said his sister to Pharaoh’s daughter, Shall I go and call to thee a nurse of the Hebrew women, that she may nurse the child for thee?',
          verse: '“Then said his sister to Pharaoh’s daughter, Shall I go and call to thee a nurse of the Hebrew women, that she may nurse the child for thee?” — Exodus 2:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/baby-moses-s4.svg',
          alt: 'Pharaoh’s daughter gives the child to his mother to nurse',
          caption: 'And Pharaoh’s daughter said unto her, Take this child away, and nurse it for me, and I will give thee thy wages. And the woman took the child, and nursed it.',
          verse: '“And Pharaoh’s daughter said unto her, Take this child away, and nurse it for me, and I will give thee thy wages. And the woman took the child, and nursed it.” — Exodus 2:9 (KJV)'
        }
      ]
    },
    {
      id: 'moses-red-sea',
      title: 'Moses and the Red Sea',
      verse: 'But the children of Israel walked upon dry land in the midst of the sea; and the waters were a wall unto them on their right hand, and on their left. — Exodus 14:29 (KJV)',
      lead: 'Four gentle panels that walk through Moses and the Red Sea. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God makes a way when there seems none.',
      idea: 'God makes a way when there seems none.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/moses-red-sea-s1.svg',
          alt: 'Israel camped by the Red Sea',
          caption: 'Israel stands between the sea and Pharaoh.',
          verse: '“And Moses said unto the people, Fear ye not, stand still, and see the salvation of the LORD, which he will shew to you to day: for the Egyptians whom ye have seen to day, ye shall see them again no more for ever.” — Exodus 14:13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/moses-red-sea-s2.svg',
          alt: 'Moses stretching his rod over the sea',
          caption: 'Moses stretches out his hand.',
          verse: '“But lift thou up thy rod, and stretch out thine hand over the sea, and divide it: and the children of Israel shall go on dry ground through the midst of the sea.” — Exodus 14:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/moses-red-sea-s3.svg',
          alt: 'Israel walking through the parted Red Sea',
          caption: 'The waters part; they walk on dry ground.',
          verse: '“And the children of Israel went into the midst of the sea upon the dry ground: and the waters were a wall unto them on their right hand, and on their left.” — Exodus 14:22 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/moses-red-sea-s4.svg',
          alt: 'Israel safe on the other side of the sea',
          caption: 'God delivers His people.',
          verse: '“Thus the LORD saved Israel that day out of the hand of the Egyptians; and Israel saw the Egyptians dead upon the sea shore.” — Exodus 14:30 (KJV)'
        }
      ]
    },
    {
      id: 'jonah',
      title: 'Jonah and the Great Fish',
      verse: 'And the LORD spake unto the fish, and it vomited out Jonah upon the dry land. — Jonah 2:10 (KJV)',
      lead: 'Four gentle panels that walk through Jonah and the Great Fish. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God’s mercy reaches farther than we run.',
      idea: 'God’s mercy reaches farther than we run.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jonah-s1.svg',
          alt: 'Jonah fleeing on a ship',
          caption: 'Jonah runs from the Lord’s call.',
          verse: '“But Jonah rose up to flee unto Tarshish from the presence of the LORD, and went down to Joppa; and he found a ship going to Tarshish: so he paid the fare thereof, and went down into it, to go with them unto Tarshish from the presence of the LORD.” — Jonah 1:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jonah-s2.svg',
          alt: 'A mighty tempest on the sea; Jonah is still in the ship',
          caption: 'But the LORD sent out a great wind into the sea, and there was a mighty tempest in the sea, so that the ship was like to be broken.',
          verse: '“But the LORD sent out a great wind into the sea, and there was a mighty tempest in the sea, so that the ship was like to be broken.” — Jonah 1:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jonah-s3.svg',
          alt: 'Jonah and the great fish',
          caption: 'A great fish swallows Jonah.',
          verse: '“Now the LORD had prepared a great fish to swallow up Jonah. And Jonah was in the belly of the fish three days and three nights.” — Jonah 1:17 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jonah-s4.svg',
          alt: 'Jonah preaches in Nineveh; the king and people put on sackcloth',
          caption: 'So the people of Nineveh believed God, and proclaimed a fast, and put on sackcloth, from the greatest of them even to the least of them. For word came unto the king of Nineveh, and he arose from his throne, and he laid his robe from him, and covered him with sackcloth, and sat in ashes.',
          verse: '“So the people of Nineveh believed God, and proclaimed a fast, and put on sackcloth, from the greatest of them even to the least of them. For word came unto the king of Nineveh, and he arose from his throne, and he laid his robe from him, and covered him with sackcloth, and sat in ashes.” — Jonah 3:5-6 (KJV)'
        }
      ]
    },
    {
      id: 'noah',
      title: 'Noah and the Ark',
      verse: 'And God remembered Noah, and every living thing, and all the cattle that was with him in the ark: and God made a wind to pass over the earth, and the waters asswaged; — Genesis 8:1 (KJV)',
      lead: 'Four gentle panels that walk through Noah and the Ark. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God keeps His promises.',
      idea: 'God keeps His promises.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/noah-s1.svg',
          alt: 'Noah building the ark',
          caption: 'God tells Noah to build an ark.',
          verse: '“Make thee an ark of gopher wood; rooms shalt thou make in the ark, and shalt pitch it within and without with pitch.” — Genesis 6:14 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/noah-s2.svg',
          alt: 'Animals entering Noah’s ark',
          caption: 'Animals come two by two.',
          verse: '“There went in two and two unto Noah into the ark, the male and the female, as God had commanded Noah.” — Genesis 7:9 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/noah-s3.svg',
          alt: 'The ark on the waters; God remembers Noah',
          caption: 'The flood covers the earth; God remembers Noah.',
          verse: '“And God remembered Noah, and every living thing, and all the cattle that was with him in the ark: and God made a wind to pass over the earth, and the waters asswaged;” — Genesis 8:1 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/noah-s4.svg',
          alt: 'Noah sees the rainbow after the flood',
          caption: 'A rainbow — God’s covenant of mercy.',
          verse: '“I do set my bow in the cloud, and it shall be for a token of a covenant between me and the earth.” — Genesis 9:13 (KJV)'
        }
      ]
    },
    {
      id: 'david',
      title: 'David and Goliath',
      verse: 'Then said David to the Philistine, Thou comest to me with a sword, and with a spear, and with a shield: but I come to thee in the name of the LORD of hosts, the God of the armies of Israel, whom thou hast defied. — 1 Samuel 17:45 (KJV)',
      lead: 'Four gentle panels that walk through David and Goliath. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Small faith + God is enough.',
      idea: 'Small faith + God is enough.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/david-s1.svg',
          alt: 'Goliath the giant shouts on the battlefield',
          caption: 'The giant shouts against God’s people.',
          verse: '“And the Philistine said, I defy the armies of Israel this day; give me a man, that we may fight together.” — 1 Samuel 17:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/david-s2.svg',
          alt: 'Young David with a sling and five smooth stones',
          caption: 'Young David comes with a sling and stones.',
          verse: '“David said moreover, The LORD that delivered me out of the paw of the lion, and out of the paw of the bear, he will deliver me out of the hand of this Philistine. And Saul said unto David, Go, and the LORD be with thee.” — 1 Samuel 17:37 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/david-s3.svg',
          alt: 'David runs toward Goliath and releases the stone',
          caption: 'David runs to meet Goliath in the Lord’s name.',
          verse: '“And all this assembly shall know that the LORD saveth not with sword and spear: for the battle is the LORD’s, and he will give you into our hands.” — 1 Samuel 17:47 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/david-s4.svg',
          alt: 'Goliath fallen; David stands with God’s help',
          caption: 'The giant falls — God helped His servant.',
          verse: '“So David prevailed over the Philistine with a sling and with a stone, and smote the Philistine, and slew him; but there was no sword in the hand of David.” — 1 Samuel 17:50 (KJV)'
        }
      ]
    },
    {
      id: 'daniel-lions',
      title: 'Daniel in the Lions\' Den',
      verse: 'My God hath sent his angel, and hath shut the lions’ mouths, that they have not hurt me: forasmuch as before him innocency was found in me; and also before thee, O king, have I done no hurt. — Daniel 6:22 (KJV)',
      lead: 'Four gentle panels that walk through Daniel in the Lions\' Den. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God is with us when we are afraid.',
      idea: 'God is with us when we are afraid.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/daniel-lions-s1.svg',
          alt: 'Daniel praying by the window',
          caption: 'Daniel prays to God, as he always did.',
          verse: '“Now when Daniel knew that the writing was signed, he went into his house; and his windows being open in his chamber toward Jerusalem, he kneeled upon his knees three times a day, and prayed, and gave thanks before his God, as he did aforetime.” — Daniel 6:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/daniel-lions-s2.svg',
          alt: 'Daniel being lowered into the lions’ den',
          caption: 'Daniel is cast into the lions’ den.',
          verse: '“Then the king commanded, and they brought Daniel, and cast him into the den of lions. Now the king spake and said unto Daniel, Thy God whom thou servest continually, he will deliver thee.” — Daniel 6:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/daniel-lions-s3.svg',
          alt: 'Daniel sitting calmly among the lions',
          caption: 'Daniel sits calm — God shut the lions’ mouths.',
          verse: '“My God hath sent his angel, and hath shut the lions’ mouths, that they have not hurt me: forasmuch as before him innocency was found in me; and also before thee, O king, have I done no hurt.” — Daniel 6:22 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/daniel-lions-s4.svg',
          alt: 'The king finding Daniel safe in the morning',
          caption: 'The king finds Daniel safe in the morning.',
          verse: '“And when he came to the den, he cried with a lamentable voice unto Daniel: and the king spake and said to Daniel, O Daniel, servant of the living God, is thy God, whom thou servest continually, able to deliver thee from the lions?” — Daniel 6:20 (KJV)'
        }
      ]
    },
    {
      id: 'feeding-5000',
      title: 'The Feeding of the Five Thousand',
      verse: 'And they did all eat, and were filled: and they took up of the fragments that remained twelve baskets full. — Matthew 14:20 (KJV)',
      lead: 'Four gentle panels that walk through The Feeding of the Five Thousand. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus provides more than enough.',
      idea: 'Jesus provides more than enough.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/feeding-5000-s1.svg',
          alt: 'Jesus looking on a hungry crowd',
          caption: 'A great crowd is hungry.',
          verse: '“And Jesus went forth, and saw a great multitude, and was moved with compassion toward them, and he healed their sick.” — Matthew 14:14 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/feeding-5000-s2.svg',
          alt: 'Jesus tells the disciples, Give ye them to eat',
          caption: 'He answered and said unto them, Give ye them to eat. And they say unto him, Shall we go and buy two hundred pennyworth of bread, and give them to eat?',
          verse: '“He answered and said unto them, Give ye them to eat. And they say unto him, Shall we go and buy two hundred pennyworth of bread, and give them to eat?” — Mark 6:37 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/feeding-5000-s3.svg',
          alt: 'A lad brings five barley loaves and two small fishes',
          caption: 'There is a lad here, which hath five barley loaves, and two small fishes: but what are they among so many?',
          verse: '“There is a lad here, which hath five barley loaves, and two small fishes: but what are they among so many?” — John 6:9 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/feeding-5000-s4.svg',
          alt: 'Crowds eating; baskets of leftovers',
          caption: 'All eat and are filled — twelve baskets left.',
          verse: '“And they did all eat, and were filled: and they took up of the fragments that remained twelve baskets full.” — Matthew 14:20 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-storm',
      title: 'Jesus Calms the Storm',
      verse: 'And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm. — Mark 4:39 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Calms the Storm. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus is Lord over the storm.',
      idea: 'Jesus is Lord over the storm.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-storm-s1.svg',
          alt: 'Jesus asleep on a pillow in the hinder part of the ship in a great storm',
          caption: 'And he was in the hinder part of the ship, asleep on a pillow: and they awake him, and say unto him, Master, carest thou not that we perish?',
          verse: '“And he was in the hinder part of the ship, asleep on a pillow: and they awake him, and say unto him, Master, carest thou not that we perish?” — Mark 4:38 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-storm-s2.svg',
          alt: 'A great storm of wind; the waves beat into the ship',
          caption: 'And there arose a great storm of wind, and the waves beat into the ship, so that it was now full.',
          verse: '“And there arose a great storm of wind, and the waves beat into the ship, so that it was now full.” — Mark 4:37 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-storm-s3.svg',
          alt: 'Jesus rebuking the wind and sea',
          caption: 'And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm.',
          verse: '“And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm.” — Mark 4:39 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-storm-s4.svg',
          alt: 'Calm sea after Jesus stills the storm',
          caption: 'The wind ceases — a great calm.',
          verse: '“And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm.” — Mark 4:39 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-children',
      title: 'Jesus Welcomes the Little Children',
      verse: 'But when Jesus saw it, he was much displeased, and said unto them, Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God. — Mark 10:14 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Welcomes the Little Children. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus welcomes children.',
      idea: 'Jesus welcomes children.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-children-s1.svg',
          alt: 'Families bring young children to Jesus',
          caption: 'Families bring little ones to Jesus.',
          verse: '“And they brought young children to him, that he should touch them: and his disciples rebuked those that brought them.” — Mark 10:13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-children-s2.svg',
          alt: 'The disciples try to send the children away',
          caption: 'The disciples try to send them away.',
          verse: '“And they brought young children to him, that he should touch them: and his disciples rebuked those that brought them.” — Mark 10:13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-children-s3.svg',
          alt: 'Jesus welcomes the little children with open arms',
          caption: 'Jesus welcomes them with open arms.',
          verse: '“But when Jesus saw it, he was much displeased, and said unto them, Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God.” — Mark 10:14 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-children-s4.svg',
          alt: 'Jesus blesses the children — of such is the kingdom of God',
          caption: 'Little ones matter to God — and so do you.',
          verse: '“But when Jesus saw it, he was much displeased, and said unto them, Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God.” — Mark 10:14 (KJV)'
        }
      ]
    },
    {
      id: 'good-samaritan',
      title: 'The Good Samaritan',
      verse: 'And he said, He that shewed mercy on him. Then said Jesus unto him, Go, and do thou likewise. — Luke 10:37 (KJV)',
      lead: 'Four gentle panels that walk through The Good Samaritan. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Love your neighbor with real help.',
      idea: 'Love your neighbor with real help.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/good-samaritan-s1.svg',
          alt: 'The Samaritan binds up the wounded man’s wounds',
          caption: 'And went to him, and bound up his wounds, pouring in oil and wine, and set him on his own beast, and brought him to an inn, and took care of him.',
          verse: '“And went to him, and bound up his wounds, pouring in oil and wine, and set him on his own beast, and brought him to an inn, and took care of him.” — Luke 10:34 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/good-samaritan-s2.svg',
          alt: 'A priest passing by the wounded man',
          caption: 'Others pass by on the other side.',
          verse: '“And by chance there came down a certain priest that way: and when he saw him, he passed by on the other side.” — Luke 10:31 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/good-samaritan-s3.svg',
          alt: 'The Samaritan brings the wounded man to the inn',
          caption: 'And went to him, and bound up his wounds, pouring in oil and wine, and set him on his own beast, and brought him to an inn, and took care of him.',
          verse: '“And went to him, and bound up his wounds, pouring in oil and wine, and set him on his own beast, and brought him to an inn, and took care of him.” — Luke 10:34 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/good-samaritan-s4.svg',
          alt: 'The Samaritan paying the innkeeper',
          caption: 'He cares for him — go and do likewise.',
          verse: '“And he said, He that shewed mercy on him. Then said Jesus unto him, Go, and do thou likewise.” — Luke 10:37 (KJV)'
        }
      ]
    },
    {
      id: 'empty-tomb',
      title: 'The Empty Tomb',
      verse: 'He is not here: for he is risen, as he said. Come, see the place where the Lord lay. — Matthew 28:6 (KJV)',
      lead: 'Four gentle panels that walk through The Empty Tomb. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus is alive.',
      idea: 'Jesus is alive.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/empty-tomb-s1.svg',
          alt: 'The empty tomb, the rolled stone, and the folded grave clothes',
          caption: 'So they went, and made the sepulchre sure, sealing the stone, and setting a watch.',
          verse: '“So they went, and made the sepulchre sure, sealing the stone, and setting a watch.” — Matthew 27:66 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/empty-tomb-s2.svg',
          alt: 'The stone rolled away from the tomb',
          caption: 'The stone is rolled away.',
          verse: '“And, behold, there was a great earthquake: for the angel of the Lord descended from heaven, and came and rolled back the stone from the door, and sat upon it.” — Matthew 28:2 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/empty-tomb-s3.svg',
          alt: 'The empty tomb and folded grave clothes',
          caption: 'The tomb is empty — He is not here.',
          verse: '“He is not here: for he is risen, as he said. Come, see the place where the Lord lay.” — Matthew 28:6 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/empty-tomb-s4.svg',
          alt: 'The women hear that Jesus is risen',
          caption: 'And go quickly, and tell his disciples that he is risen from the dead; and, behold, he goeth before you into Galilee; there shall ye see him: lo, I have told you.',
          verse: '“And go quickly, and tell his disciples that he is risen from the dead; and, behold, he goeth before you into Galilee; there shall ye see him: lo, I have told you.” — Matthew 28:7 (KJV)'
        }
      ]
    },
    {
      id: 'prodigal-son',
      title: 'The Prodigal Son',
      verse: 'For this my son was dead, and is alive again; he was lost, and is found. And they began to be merry. — Luke 15:24 (KJV)',
      lead: 'Four gentle panels that walk through The Prodigal Son. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The Father runs to welcome home.',
      idea: 'The Father runs to welcome home.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/prodigal-son-s1.svg',
          alt: 'The younger son leaving home',
          caption: 'A son asks for his share and leaves.',
          verse: '“And the younger of them said to his father, Father, give me the portion of goods that falleth to me. And he divided unto them his living.” — Luke 15:12 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/prodigal-son-s2.svg',
          alt: 'The younger son wasting his substance in a far country',
          caption: 'He took his journey into a far country, and there wasted his substance with riotous living.',
          verse: '“And not many days after the younger son gathered all together, and took his journey into a far country, and there wasted his substance with riotous living.” — Luke 15:13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/prodigal-son-s3.svg',
          alt: 'The prodigal son in hunger among the swine',
          caption: 'And he would fain have filled his belly with the husks that the swine did eat: and no man gave unto him.',
          verse: '“And he would fain have filled his belly with the husks that the swine did eat: and no man gave unto him.” — Luke 15:16 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/prodigal-son-s4.svg',
          alt: 'The father runs and welcomes his son home',
          caption: 'And he arose, and came to his father. But when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him.',
          verse: '“And he arose, and came to his father. But when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him.” — Luke 15:20 (KJV)'
        }
      ]
    },
    {
      id: 'walks-on-water',
      title: 'Jesus Walks on Water',
      verse: 'And he said, Come. And when Peter was come down out of the ship, he walked on the water, to go to Jesus. — Matthew 14:29 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Walks on Water. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Keep your eyes on Jesus.',
      idea: 'Keep your eyes on Jesus.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/walks-on-water-s1.svg',
          alt: 'Jesus walking on the water toward the boat',
          caption: 'Jesus comes walking on the sea.',
          verse: '“And in the fourth watch of the night Jesus went unto them, walking on the sea.” — Matthew 14:25 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/walks-on-water-s2.svg',
          alt: 'The disciples see Jesus walking on the sea',
          caption: 'Be of good cheer; it is I; be not afraid.',
          verse: '“But straightway Jesus spake unto them, saying, Be of good cheer; it is I; be not afraid.” — Matthew 14:27 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/walks-on-water-s3.svg',
          alt: 'Peter stepping out of the boat toward Jesus',
          caption: 'Peter walks on the water to go to Jesus.',
          verse: '“And he said, Come. And when Peter was come down out of the ship, he walked on the water, to go to Jesus.” — Matthew 14:29 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/walks-on-water-s4.svg',
          alt: 'Jesus stretching forth his hand and catching Peter',
          caption: 'And immediately Jesus stretched forth his hand, and caught him, and said unto him, O thou of little faith, wherefore didst thou doubt?',
          verse: '“And immediately Jesus stretched forth his hand, and caught him, and said unto him, O thou of little faith, wherefore didst thou doubt?” — Matthew 14:31 (KJV)'
        }
      ]
    },
    {
      id: 'zacchaeus',
      title: 'Jesus Loves Zacchaeus',
      verse: 'For the Son of man is come to seek and to save that which was lost. — Luke 19:10 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Loves Zacchaeus. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus seeks and saves the lost.',
      idea: 'Jesus seeks and saves the lost.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/zacchaeus-s1.svg',
          alt: 'Zacchaeus in a sycamore tree',
          caption: 'Zacchaeus climbs a tree to see Jesus.',
          verse: '“And he ran before, and climbed up into a sycomore tree to see him: for he was to pass that way.” — Luke 19:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/zacchaeus-s2.svg',
          alt: 'Jesus calling Zacchaeus down',
          caption: 'Jesus calls him by name.',
          verse: '“And when Jesus came to the place, he looked up, and saw him, and said unto him, Zacchaeus, make haste, and come down; for to day I must abide at thy house.” — Luke 19:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/zacchaeus-s3.svg',
          alt: 'People murmuring as Jesus goes to Zacchaeus’ house',
          caption: 'Some murmur that Jesus is a guest of a sinner.',
          verse: '“And when they saw it, they all murmured, saying, That he was gone to be guest with a man that is a sinner.” — Luke 19:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/zacchaeus-s4.svg',
          alt: 'Zacchaeus welcoming Jesus with joy',
          caption: 'A changed heart — salvation comes to this house.',
          verse: '“And Jesus said unto him, This day is salvation come to this house, forsomuch as he also is a son of Abraham.” — Luke 19:9 (KJV)'
        }
      ]
    },
    {
      id: 'woman-at-well',
      title: 'Woman at the Well',
      verse: 'Jesus answered and said unto her, Whosoever drinketh of this water shall thirst again: But whosoever drinketh of the water that I shall give him shall never thirst; but the water that I shall give him shall be in him a well of water springing up into everlasting life. — John 4:13-14 (KJV)',
      lead: 'Four gentle panels that walk through Woman at the Well. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus offers living water.',
      idea: 'Jesus offers living water.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/woman-at-well-s1.svg',
          alt: 'Jesus sits weary by Jacob’s well at noon in Samaria',
          caption: 'Now Jacob’s well was there. Jesus therefore, being wearied with his journey, sat thus on the well: and it was about the sixth hour.',
          verse: '“Now Jacob’s well was there. Jesus therefore, being wearied with his journey, sat thus on the well: and it was about the sixth hour.” — John 4:6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/woman-at-well-s2.svg',
          alt: 'A Samaritan woman comes to draw water and meets Jesus',
          caption: 'There cometh a woman of Samaria to draw water: Jesus saith unto her, Give me to drink.',
          verse: '“There cometh a woman of Samaria to draw water: Jesus saith unto her, Give me to drink.” — John 4:7 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/woman-at-well-s3.svg',
          alt: 'Jesus speaks with the woman about living water',
          caption: 'But whosoever drinketh of the water that I shall give him shall never thirst; but the water that I shall give him shall be in him a well of water springing up into everlasting life.',
          verse: '“But whosoever drinketh of the water that I shall give him shall never thirst; but the water that I shall give him shall be in him a well of water springing up into everlasting life.” — John 4:14 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/woman-at-well-s4.svg',
          alt: 'The woman leaves her waterpot and runs to tell the city about Jesus',
          caption: 'The woman then left her waterpot, and went her way into the city, and saith to the men, Come, see a man, which told me all things that ever I did: is not this the Christ?',
          verse: '“The woman then left her waterpot, and went her way into the city, and saith to the men, Come, see a man, which told me all things that ever I did: is not this the Christ?” — John 4:28-29 (KJV)'
        }
      ]
    },
    {
      id: 'ruth-naomi',
      title: 'Ruth & Naomi',
      verse: 'And Ruth said, Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God: — Ruth 1:16 (KJV)',
      lead: 'Four gentle panels that walk through Ruth & Naomi. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Loyal love is a quiet strength.',
      idea: 'Loyal love is a quiet strength.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ruth-naomi-s1.svg',
          alt: 'Naomi urges her daughters-in-law to return home as they leave Moab',
          caption: 'And Naomi said unto her two daughters in law, Go, return each to her mother’s house: the LORD deal kindly with you, as ye have dealt with the dead, and with me.',
          verse: '“And Naomi said unto her two daughters in law, Go, return each to her mother’s house: the LORD deal kindly with you, as ye have dealt with the dead, and with me.” — Ruth 1:8 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ruth-naomi-s2.svg',
          alt: 'Ruth clings to Naomi and makes her famous vow of loyalty',
          caption: 'And Ruth said, Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God:',
          verse: '“And Ruth said, Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God:” — Ruth 1:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/ruth-naomi-s3.svg',
          alt: 'Ruth gleans in the fields of Boaz near Bethlehem',
          caption: 'And Ruth the Moabitess said unto Naomi, Let me now go to the field, and glean ears of corn after him in whose sight I shall find grace. And she said unto her, Go, my daughter.',
          verse: '“And Ruth the Moabitess said unto Naomi, Let me now go to the field, and glean ears of corn after him in whose sight I shall find grace. And she said unto her, Go, my daughter.” — Ruth 2:2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/ruth-naomi-s4.svg',
          alt: 'Boaz redeems Ruth at the city gate in the presence of the elders',
          caption: 'Boaz said unto the elders, Ye are witnesses this day.',
          verse: '“And Boaz said unto the elders, and unto all the people, Ye are witnesses this day, that I have bought all that was Elimelech’s, and all that was Chilion’s and Mahlon’s, of the hand of Naomi. Moreover Ruth the Moabitess, the wife of Mahlon, have I purchased to be my wife, to raise up the name of the dead upon his inheritance, that the name of the dead be not cut off from among his brethren, and from the gate of his place: ye are witnesses this day.” — Ruth 4:9-10 (KJV)'
        }
      ]
    },
    {
      id: 'lazarus',
      title: 'Lazarus Raised from the Dead',
      verse: 'Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live: — John 11:25 (KJV)',
      lead: 'Four gentle panels that walk through Lazarus Raised from the Dead. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus is the resurrection and the life.',
      idea: 'Jesus is the resurrection and the life.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lazarus-s1.svg',
          alt: 'Messengers telling Jesus Lazarus is sick',
          caption: 'Lazarus is sick; friends send for Jesus.',
          verse: '“Therefore his sisters sent unto him, saying, Lord, behold, he whom thou lovest is sick.” — John 11:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/lazarus-s2.svg',
          alt: 'Martha meeting Jesus near Bethany',
          caption: 'Martha meets Jesus in grief.',
          verse: '“Then said Martha unto Jesus, Lord, if thou hadst been here, my brother had not died.” — John 11:21 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/lazarus-s3.svg',
          alt: 'Jesus calling Lazarus from the tomb',
          caption: 'Jesus weeps; then He calls Lazarus.',
          verse: '“And when he thus had spoken, he cried with a loud voice, Lazarus, come forth.” — John 11:43 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/lazarus-s4.svg',
          alt: 'Lazarus raised from the dead',
          caption: 'Lazarus comes forth — alive.',
          verse: '“And he that was dead came forth, bound hand and foot with graveclothes: and his face was bound about with a napkin. Jesus saith unto them, Loose him, and let him go.” — John 11:44 (KJV)'
        }
      ]
    },
    {
      id: 'lost-sheep',
      title: 'The Lost Sheep',
      verse: 'And when he cometh home, he calleth together his friends and neighbours, saying unto them, Rejoice with me; for I have found my sheep which was lost. — Luke 15:6 (KJV)',
      lead: 'Four gentle panels that walk through The Lost Sheep. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The Shepherd comes for the one.',
      idea: 'The Shepherd comes for the one.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lost-sheep-s1.svg',
          alt: 'The shepherd with ninety-nine sheep, noticing one is missing',
          caption: 'What man of you, having an hundred sheep, if he lose one of them, doth not leave the ninety and nine in the wilderness, and go after that which is lost, until he find it?',
          verse: '“What man of you, having an hundred sheep, if he lose one of them, doth not leave the ninety and nine in the wilderness, and go after that which is lost, until he find it?” — Luke 15:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/lost-sheep-s2.svg',
          alt: 'The shepherd searching through the wilderness for the lost sheep',
          caption: 'He goeth after that which is lost, until he find it.',
          verse: '“What man of you, having an hundred sheep, if he lose one of them, doth not leave the ninety and nine in the wilderness, and go after that which is lost, until he find it?” — Luke 15:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/lost-sheep-s3.svg',
          alt: 'The shepherd finding and gently rescuing the lost sheep',
          caption: 'And when he hath found it, he layeth it on his shoulders, rejoicing.',
          verse: '“And when he hath found it, he layeth it on his shoulders, rejoicing.” — Luke 15:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/lost-sheep-s4.svg',
          alt: 'The shepherd bringing the sheep home to a joyful celebration',
          caption: 'And when he cometh home, he calleth together his friends and neighbours, saying unto them, Rejoice with me; for I have found my sheep which was lost.',
          verse: '“And when he cometh home, he calleth together his friends and neighbours, saying unto them, Rejoice with me; for I have found my sheep which was lost.” — Luke 15:6 (KJV)'
        }
      ]
    },
    {
      id: 'jairus-daughter',
      title: 'Jairus\' Daughter',
      verse: 'And he took the damsel by the hand, and said unto her, Talitha cumi; which is, being interpreted, Damsel, I say unto thee, arise. — Mark 5:41 (KJV)',
      lead: 'Four gentle panels that walk through Jairus\' Daughter. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus’ word brings life.',
      idea: 'Jesus’ word brings life.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jairus-daughter-s1.svg',
          alt: 'Jairus, a ruler of the synagogue, falls at Jesus’ feet begging for his dying daughter',
          caption: 'There came one of the rulers of the synagogue,.',
          verse: '“And, behold, there cometh one of the rulers of the synagogue, Jairus by name; and when he saw him, he fell at his feet, And besought him greatly, saying, My little daughter lieth at the point of death: I pray thee, come and lay thy hands on her, that she may be healed; and she shall live.” — Mark 5:22-23 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jairus-daughter-s2.svg',
          alt: 'Messengers bring the devastating news that the daughter has died',
          caption: 'While he yet spake, there came from the ruler of the synagogue’s house certain which said, Thy daughter is dead: why troublest thou the Master any further?',
          verse: '“While he yet spake, there came from the ruler of the synagogue’s house certain which said, Thy daughter is dead: why troublest thou the Master any further?” — Mark 5:35 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jairus-daughter-s3.svg',
          alt: 'Jesus enters the house with only Peter, James, John and the girl’s parents',
          caption: 'And he suffered no man to follow him, save Peter, and James, and John the brother of James.',
          verse: '“And he suffered no man to follow him, save Peter, and James, and John the brother of James.” — Mark 5:37 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jairus-daughter-s4.svg',
          alt: 'Jesus takes the girl by the hand and raises her, saying Talitha cumi',
          caption: 'And he took the damsel by the hand, and said unto her, Talitha cumi; which is, being interpreted, Damsel, I say unto thee, arise. And straightway the damsel arose, and walked; for she was of the age of twelve years. And they were astonished with a great astonishment.',
          verse: '“And he took the damsel by the hand, and said unto her, Talitha cumi; which is, being interpreted, Damsel, I say unto thee, arise. And straightway the damsel arose, and walked; for she was of the age of twelve years. And they were astonished with a great astonishment.” — Mark 5:41-42 (KJV)'
        }
      ]
    },
    {
      id: 'blind-man',
      title: 'Jesus Heals the Blind Man',
      verse: 'And Jesus said unto him, Receive thy sight: thy faith hath saved thee. — Luke 18:42 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Heals the Blind Man. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus opens eyes and hearts.',
      idea: 'Jesus opens eyes and hearts.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/blind-man-s1.svg',
          alt: 'Jesus anoints the eyes of the man born blind with clay',
          caption: 'Jesus spat on the ground, made clay of the spittle.',
          verse: '“When he had thus spoken, he spat on the ground, and made clay of the spittle, and he anointed the eyes of the blind man with the clay,” — John 9:6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/blind-man-s2.svg',
          alt: 'The man washes in the Pool of Siloam and receives his sight',
          caption: 'The man went and washed, and came seeing. For the first time in his life, he could see.',
          verse: '“And said unto him, Go, wash in the pool of Siloam, (which is by interpretation, Sent.) He went his way therefore, and washed, and came seeing.” — John 9:7 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/blind-man-s3.svg',
          alt: 'The Pharisees question the man and his parents about the miracle',
          caption: 'The Pharisees called the parents and the man,.',
          verse: '“And they asked them, saying, Is this your son, who ye say was born blind? how then doth he now see?” — John 9:19 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/blind-man-s4.svg',
          alt: 'Jesus finds the man and reveals Himself; the man worships Him',
          caption: 'And he said, Lord, I believe. And he worshipped him.',
          verse: '“And he said, Lord, I believe. And he worshipped him.” — John 9:38 (KJV)'
        }
      ]
    },
    {
      id: 'fishers-of-men',
      title: 'Fishers of Men',
      verse: 'And he saith unto them, Follow me, and I will make you fishers of men. — Matthew 4:19 (KJV)',
      lead: 'Four gentle panels that walk through Fishers of Men. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus calls ordinary people.',
      idea: 'Jesus calls ordinary people.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/fishers-of-men-s1.svg',
          alt: 'Jesus walks by the Sea of Galilee and sees Peter and Andrew casting their net',
          caption: 'And Jesus, walking by the sea of Galilee, saw two brethren, Simon called Peter, and Andrew his brother, casting a net into the sea: for they were fishers.',
          verse: '“And Jesus, walking by the sea of Galilee, saw two brethren, Simon called Peter, and Andrew his brother, casting a net into the sea: for they were fishers.” — Matthew 4:18 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/fishers-of-men-s2.svg',
          alt: 'Jesus calls Peter and Andrew: Follow me, and I will make you fishers of men',
          caption: 'And he saith unto them, Follow me, and I will make you fishers of men. And they straightway left their nets, and followed him.',
          verse: '“And he saith unto them, Follow me, and I will make you fishers of men. And they straightway left their nets, and followed him.” — Matthew 4:19-20 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/fishers-of-men-s3.svg',
          alt: 'Jesus calls James and John, the sons of Zebedee, in their boat',
          caption: 'And going on from thence, he saw two other brethren,.',
          verse: '“And going on from thence, he saw other two brethren, James the son of Zebedee, and John his brother, in a ship with Zebedee their father, mending their nets; and he called them.” — Matthew 4:21 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/fishers-of-men-s4.svg',
          alt: 'A miraculous catch of fish – Peter falls at Jesus’ feet as the nets break',
          caption: 'When they had this done, they inclosed a great.',
          verse: '“And when they had brought their ships to land, they forsook all, and followed him.” — Luke 5:11 (KJV)'
        }
      ]
    },
    {
      id: 'wedding-cana',
      title: 'Wedding at Cana',
      verse: 'This beginning of miracles did Jesus in Cana of Galilee, and manifested forth his glory; and his disciples believed on him. — John 2:11 (KJV)',
      lead: 'Four gentle panels that walk through Wedding at Cana. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus turns need into joy.',
      idea: 'Jesus turns need into joy.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/wedding-cana-s1.svg',
          alt: 'A joyful wedding feast in Cana of Galilee with Jesus and Mary among the guests',
          caption: 'And the third day there was a marriage in Cana of Galilee; and the mother of Jesus was there: And both Jesus was called, and his disciples, to the marriage.',
          verse: '“And the third day there was a marriage in Cana of Galilee; and the mother of Jesus was there: And both Jesus was called, and his disciples, to the marriage.” — John 2:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/wedding-cana-s2.svg',
          alt: 'The servants discover there is no more wine at the wedding',
          caption: 'And when they wanted wine, the mother of Jesus saith unto him, They have no wine.',
          verse: '“And when they wanted wine, the mother of Jesus saith unto him, They have no wine.” — John 2:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/wedding-cana-s3.svg',
          alt: 'Jesus tells the servants to fill the six stone waterpots with water',
          caption: 'Jesus saith unto them, Fill the waterpots with water. And they filled them up to the brim.',
          verse: '“Jesus saith unto them, Fill the waterpots with water. And they filled them up to the brim.” — John 2:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/wedding-cana-s4.svg',
          alt: 'The master of the feast tastes the water that was made wine and is amazed',
          caption: 'When the ruler of the feast had tasted the water.',
          verse: '“This beginning of miracles did Jesus in Cana of Galilee, and manifested forth his glory; and his disciples believed on him.” — John 2:11 (KJV)'
        }
      ]
    },
    {
      id: 'mustard-seed',
      title: 'The Mustard Seed',
      verse: 'Another parable put he forth unto them, saying, The kingdom of heaven is like to a grain of mustard seed, which a man took, and sowed in his field: — Matthew 13:31 (KJV)',
      lead: 'Four gentle panels that walk through The Mustard Seed. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Small faith can grow.',
      idea: 'Small faith can grow.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/mustard-seed-s1.svg',
          alt: 'A very small seed',
          caption: 'Another parable put he forth unto them, saying, The kingdom of heaven is like to a grain of mustard seed, which a man took, and sowed in his field:',
          verse: '“Another parable put he forth unto them, saying, The kingdom of heaven is like to a grain of mustard seed, which a man took, and sowed in his field:” — Matthew 13:31 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/mustard-seed-s2.svg',
          alt: 'The seed is planted',
          caption: 'Which indeed is the least of all seeds: but when it is grown, it is the greatest among herbs, and becometh a tree, so that the birds of the air come and lodge in the branches thereof.',
          verse: '“Which indeed is the least of all seeds: but when it is grown, it is the greatest among herbs, and becometh a tree, so that the birds of the air come and lodge in the branches thereof.” — Matthew 13:32 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/mustard-seed-s3.svg',
          alt: 'It grows into a great tree',
          caption: 'It becometh a tree, so that the birds of the air come and lodge in the branches thereof.',
          verse: '“Which indeed is the least of all seeds: but when it is grown, it is the greatest among herbs, and becometh a tree, so that the birds of the air come and lodge in the branches thereof.” — Matthew 13:32 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/mustard-seed-s4.svg',
          alt: 'Birds nest in the branches',
          caption: 'The birds of the air come and lodge in the branches thereof.',
          verse: '“Another parable put he forth unto them, saying, The kingdom of heaven is like to a grain of mustard seed, which a man took, and sowed in his field:” — Matthew 13:31 (KJV)'
        }
      ]
    },
    {
      id: 'the-sower',
      title: 'The Parable of the Sower',
      verse: 'But he that received seed into the good ground is he that heareth the word, and understandeth it; which also beareth fruit, and bringeth forth, some an hundredfold, some sixty, some thirty. — Matthew 13:23 (KJV)',
      lead: 'Four gentle panels that walk through The Parable of the Sower. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God’s Word wants good soil.',
      idea: 'God’s Word wants good soil.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/the-sower-s1.svg',
          alt: 'Seed by the wayside',
          caption: 'Some seeds fell by the way side, and the fowls came and devoured them up.',
          verse: '“And when he sowed, some seeds fell by the way side, and the fowls came and devoured them up:” — Matthew 13:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/the-sower-s2.svg',
          alt: 'Seed on stony places',
          caption: 'Some fell upon stony places, where they had not much earth: and forthwith they sprung up, because they had no deepness of earth:',
          verse: '“Some fell upon stony places, where they had not much earth: and forthwith they sprung up, because they had no deepness of earth:” — Matthew 13:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/the-sower-s3.svg',
          alt: 'Seed among thorns',
          caption: 'Some fell among thorns; and the thorns sprung up, and choked them.',
          verse: '“And some fell among thorns; and the thorns sprung up, and choked them:” — Matthew 13:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/the-sower-s4.svg',
          alt: 'Good ground bears fruit',
          caption: 'But other fell into good ground, and brought forth fruit, some an hundredfold.',
          verse: '“But he that received seed into the good ground is he that heareth the word, and understandeth it; which also beareth fruit, and bringeth forth, some an hundredfold, some sixty, some thirty.” — Matthew 13:23 (KJV)'
        }
      ]
    },
    {
      id: 'triumphal-entry',
      title: 'Triumphal Entry',
      verse: 'And the multitudes that went before, and that followed, cried, saying, Hosanna to the son of David: Blessed is he that cometh in the name of the Lord; Hosanna in the highest. — Matthew 21:9 (KJV)',
      lead: 'Four gentle panels that walk through Triumphal Entry. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Hosanna — the King comes in peace.',
      idea: 'Hosanna — the King comes in peace.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/triumphal-entry-s1.svg',
          alt: 'Jesus rides a donkey',
          caption: 'They brought the ass, and the colt, and put on them their clothes, and he sat thereon.',
          verse: '“And brought the ass, and the colt, and put on them their clothes, and they set him thereon.” — Matthew 21:7 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/triumphal-entry-s2.svg',
          alt: 'Cloaks on the road',
          caption: 'And a very great multitude spread their garments in the way; others cut down branches from the trees, and strawed them in the way.',
          verse: '“And a very great multitude spread their garments in the way; others cut down branches from the trees, and strawed them in the way.” — Matthew 21:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/triumphal-entry-s3.svg',
          alt: 'Branches cut from the trees',
          caption: 'Others cut down branches from the trees, and strawed them in the way.',
          verse: '“And a very great multitude spread their garments in the way; others cut down branches from the trees, and strawed them in the way.” — Matthew 21:8 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/triumphal-entry-s4.svg',
          alt: 'The crowd shouts Hosanna',
          caption: 'The multitudes cried, saying, Hosanna to the Son of David.',
          verse: '“And the multitudes that went before, and that followed, cried, saying, Hosanna to the son of David: Blessed is he that cometh in the name of the Lord; Hosanna in the highest.” — Matthew 21:9 (KJV)'
        }
      ]
    },
    {
      id: 'lost-coin',
      title: 'The Lost Coin',
      verse: 'And when she hath found it, she calleth her friends and her neighbours together, saying, Rejoice with me; for I have found the piece which I had lost. — Luke 15:9 (KJV)',
      lead: 'Four gentle panels that walk through The Lost Coin. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Heaven rejoices when the lost is found.',
      idea: 'Heaven rejoices when the lost is found.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lost-coin-s1.svg',
          alt: 'A woman with her silver pieces',
          caption: 'What woman having ten pieces of silver, if she lose one piece, doth not light a candle?',
          verse: '“Either what woman having ten pieces of silver, if she lose one piece, doth not light a candle, and sweep the house, and seek diligently till she find it?” — Luke 15:8 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/lost-coin-s2.svg',
          alt: 'She sweeps the house',
          caption: 'She sweepeth the house, and seeketh diligently till she find it.',
          verse: '“Either what woman having ten pieces of silver, if she lose one piece, doth not light a candle, and sweep the house, and seek diligently till she find it?” — Luke 15:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/lost-coin-s3.svg',
          alt: 'She finds the coin',
          caption: 'And when she hath found it, she calleth her friends and her neighbours together, saying, Rejoice with me; for I have found the piece which I had lost.',
          verse: '“And when she hath found it, she calleth her friends and her neighbours together, saying, Rejoice with me; for I have found the piece which I had lost.” — Luke 15:9 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/lost-coin-s4.svg',
          alt: 'Rejoice with friends',
          caption: 'Rejoice with me; for I have found the piece which I had lost.',
          verse: '“Likewise, I say unto you, there is joy in the presence of the angels of God over one sinner that repenteth.” — Luke 15:10 (KJV)'
        }
      ]
    },
    {
      id: 'healing-paralytic',
      title: 'Jesus Heals the Paralytic',
      verse: 'But that ye may know that the Son of man hath power on earth to forgive sins, (then saith he to the sick of the palsy,) Arise, take up thy bed, and go unto thine house. — Matthew 9:6 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Heals the Paralytic. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus forgives and heals.',
      idea: 'Jesus forgives and heals.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/healing-paralytic-s1.svg',
          alt: 'Friends bring a man on a bed',
          caption: 'And, behold, they brought to him a man sick of the palsy, lying on a bed: and Jesus seeing their faith said unto the sick of the palsy; Son, be of good cheer; thy sins be forgiven thee.',
          verse: '“And, behold, they brought to him a man sick of the palsy, lying on a bed: and Jesus seeing their faith said unto the sick of the palsy; Son, be of good cheer; thy sins be forgiven thee.” — Matthew 9:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/healing-paralytic-s2.svg',
          alt: 'They let him down through the roof',
          caption: 'They let him down through the tiling with his couch into the midst before Jesus.',
          verse: '“And when they could not find by what way they might bring him in because of the multitude, they went upon the housetop, and let him down through the tiling with his couch into the midst before Jesus.” — Luke 5:19 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/healing-paralytic-s3.svg',
          alt: 'Jesus forgives and heals',
          caption: 'Jesus said, Son, be of good cheer; thy sins be forgiven thee.',
          verse: '“And, behold, they brought to him a man sick of the palsy, lying on a bed: and Jesus seeing their faith said unto the sick of the palsy; Son, be of good cheer; thy sins be forgiven thee.” — Matthew 9:2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/healing-paralytic-s4.svg',
          alt: 'He takes up his bed and walks',
          caption: 'But that ye may know that the Son of man hath power on earth to forgive sins, (then saith he to the sick of the palsy,) Arise, take up thy bed, and go unto thine house. And he arose, and departed to his house. But when the multitudes saw it, they marvelled, and glorified God, which had given such power unto men.',
          verse: '“But that ye may know that the Son of man hath power on earth to forgive sins, (then saith he to the sick of the palsy,) Arise, take up thy bed, and go unto thine house. And he arose, and departed to his house. But when the multitudes saw it, they marvelled, and glorified God, which had given such power unto men.” — Matthew 9:6-8 (KJV)'
        }
      ]
    },
    {
      id: 'good-shepherd',
      title: 'The Good Shepherd',
      verse: 'I am the good shepherd: the good shepherd giveth his life for the sheep. — John 10:11 (KJV)',
      lead: 'Four gentle panels that walk through The Good Shepherd. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The Good Shepherd knows His sheep.',
      idea: 'The Good Shepherd knows His sheep.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/good-shepherd-s1.svg',
          alt: 'Jesus the Good Shepherd peacefully with His flock in green pastures',
          caption: 'I am the good shepherd: the good shepherd giveth his life for the sheep.',
          verse: '“I am the good shepherd: the good shepherd giveth his life for the sheep.” — John 10:11 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/good-shepherd-s2.svg',
          alt: 'A wolf threatens the flock and the shepherd stands to protect them',
          caption: 'The hireling fleeth because he is an hireling.',
          verse: '“But he that is an hireling, and not the shepherd, whose own the sheep are not, seeth the wolf coming, and leaveth the sheep, and fleeth: and the wolf catcheth them, and scattereth the sheep. The hireling fleeth, because he is an hireling, and careth not for the sheep.” — John 10:12-13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/good-shepherd-s3.svg',
          alt: 'The Good Shepherd lays down His life for the sheep',
          caption: 'I am the good shepherd, and know my sheep, and am known of mine. As the Father knoweth me, even so know I the Father: and I lay down my life for the sheep.',
          verse: '“I am the good shepherd, and know my sheep, and am known of mine. As the Father knoweth me, even so know I the Father: and I lay down my life for the sheep.” — John 10:14-15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/good-shepherd-s4.svg',
          alt: 'The shepherd joyfully carries the rescued sheep home on His shoulders',
          caption: 'And when he hath found it, he layeth it on his shoulders, rejoicing.',
          verse: '“And when he hath found it, he layeth it on his shoulders, rejoicing.” — Luke 15:5 (KJV)'
        }
      ]
    },
    {
      id: 'feeding-4000',
      title: 'Jesus Feeds the Four Thousand',
      verse: 'And they did all eat, and were filled: and they took up of the broken meat that was left seven baskets full. — Matthew 15:37',
      lead: 'Four gentle panels that walk through Jesus Feeds the Four Thousand. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus cares for hungry hearts.',
      idea: 'Jesus cares for hungry hearts.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/feeding-4000-s1.svg',
          alt: 'A great multitude with Jesus',
          caption: 'Then Jesus called his disciples unto him, and said, I have compassion on the multitude, because they continue with me now three days, and have nothing to eat: and I will not send them away fasting, lest they faint in the way.',
          verse: '“Then Jesus called his disciples unto him, and said, I have compassion on the multitude, because they continue with me now three days, and have nothing to eat: and I will not send them away fasting, lest they faint in the way.” — Matthew 15:32 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/feeding-4000-s2.svg',
          alt: 'A few loaves and fishes',
          caption: 'And Jesus saith unto them, How many loaves have ye? And they said, Seven, and a few little fishes.',
          verse: '“And Jesus saith unto them, How many loaves have ye? And they said, Seven, and a few little fishes.” — Matthew 15:34 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/feeding-4000-s3.svg',
          alt: 'Jesus gives thanks and breaks bread',
          caption: 'And he took the seven loaves and the fishes, and gave thanks, and brake them, and gave to his disciples, and the disciples to the multitude.',
          verse: '“And he took the seven loaves and the fishes, and gave thanks, and brake them, and gave to his disciples, and the disciples to the multitude.” — Matthew 15:36 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/feeding-4000-s4.svg',
          alt: 'All eat; baskets left over',
          caption: 'They did all eat, and were filled: and they took up seven baskets full of the broken meat.',
          verse: '“And they did all eat, and were filled: and they took up of the broken meat that was left seven baskets full. And they that did eat were four thousand men, beside women and children.” — Matthew 15:37-38 (KJV)'
        }
      ]
    },
    {
      id: 'wise-foolish-builders',
      title: 'The Wise and Foolish Builders',
      verse: 'Therefore whosoever heareth these sayings of mine, and doeth them, I will liken him unto a wise man, which built his house upon a rock: — Matthew 7:24 (KJV)',
      lead: 'Four gentle panels that walk through The Wise and Foolish Builders. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Build your life on His words.',
      idea: 'Build your life on His words.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/wise-foolish-builders-s1.svg',
          alt: 'A house built upon a rock',
          caption: 'Therefore whosoever heareth these sayings of mine, and doeth them, I will liken him unto a wise man, which built his house upon a rock:',
          verse: '“Therefore whosoever heareth these sayings of mine, and doeth them, I will liken him unto a wise man, which built his house upon a rock:” — Matthew 7:24 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/wise-foolish-builders-s2.svg',
          alt: 'A house built upon the sand',
          caption: 'And every one that heareth these sayings of mine, and doeth them not, shall be likened unto a foolish man, which built his house upon the sand:',
          verse: '“And every one that heareth these sayings of mine, and doeth them not, shall be likened unto a foolish man, which built his house upon the sand:” — Matthew 7:26 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/wise-foolish-builders-s3.svg',
          alt: 'Rain and wind beat on both houses',
          caption: 'And the rain descended, and the floods came, and the winds blew, and beat upon that house; and it fell not: for it was founded upon a rock.',
          verse: '“And the rain descended, and the floods came, and the winds blew, and beat upon that house; and it fell not: for it was founded upon a rock.” — Matthew 7:25 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/wise-foolish-builders-s4.svg',
          alt: 'The rock house stands; the sand house falls',
          caption: 'And every one that heareth these sayings of mine, and doeth them not, shall be likened unto a foolish man, which built his house upon the sand: And the rain descended, and the floods came, and the winds blew, and beat upon that house; and it fell: and great was the fall of it.',
          verse: '“And every one that heareth these sayings of mine, and doeth them not, shall be likened unto a foolish man, which built his house upon the sand: And the rain descended, and the floods came, and the winds blew, and beat upon that house; and it fell: and great was the fall of it.” — Matthew 7:26-27 (KJV)'
        }
      ]
    },
    {
      id: 'the-talents',
      title: 'The Parable of the Talents',
      verse: 'His lord said unto him, Well done, thou good and faithful servant: thou hast been faithful over a few things, I will make thee ruler over many things: enter thou into the joy of thy lord. — Matthew 25:21 (KJV)',
      lead: 'Four gentle panels that walk through The Parable of the Talents. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Faithful with a little matters.',
      idea: 'Faithful with a little matters.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/the-talents-s1.svg',
          alt: 'The master gives talents',
          caption: 'And unto one he gave five talents, to another two, and to another one; to every man according to his several ability; and straightway took his journey.',
          verse: '“And unto one he gave five talents, to another two, and to another one; to every man according to his several ability; and straightway took his journey.” — Matthew 25:15 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/the-talents-s2.svg',
          alt: 'Two servants trade and gain',
          caption: 'Then he that had received the five talents went and traded with the same, and made them other five talents.',
          verse: '“Then he that had received the five talents went and traded with the same, and made them other five talents.” — Matthew 25:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/the-talents-s3.svg',
          alt: 'One servant hides his talent',
          caption: 'He that had received one went and digged in the earth, and hid his lord\'s money.',
          verse: '“But he that had received one went and digged in the earth, and hid his lord’s money.” — Matthew 25:18 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/the-talents-s4.svg',
          alt: 'The master returns',
          caption: 'His lord said unto him, Well done, thou good and faithful servant: thou hast been faithful over a few things, I will make thee ruler over many things: enter thou into the joy of thy lord.',
          verse: '“His lord said unto him, Well done, thou good and faithful servant: thou hast been faithful over a few things, I will make thee ruler over many things: enter thou into the joy of thy lord.” — Matthew 25:21 (KJV)'
        }
      ]
    },
    {
      id: 'persistent-widow',
      title: 'The Persistent Widow',
      verse: 'And shall not God avenge his own elect, which cry day and night unto him, though he bear long with them? — Luke 18:7',
      lead: 'Four gentle panels that walk through The Persistent Widow. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Keep praying; do not faint.',
      idea: 'Keep praying; do not faint.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/persistent-widow-s1.svg',
          alt: 'The widow asks the judge',
          caption: 'Saying, There was in a city a judge, which feared not God, neither regarded man: And there was a widow in that city; and she came unto him, saying, Avenge me of mine adversary.',
          verse: '“Saying, There was in a city a judge, which feared not God, neither regarded man: And there was a widow in that city; and she came unto him, saying, Avenge me of mine adversary.” — Luke 18:2-3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/persistent-widow-s2.svg',
          alt: 'The judge will not help',
          caption: 'And there was a widow in that city; and she came unto him, saying, Avenge me of mine adversary. And he would not for a while: but afterward he said within himself, Though I fear not God, nor regard man;',
          verse: '“And there was a widow in that city; and she came unto him, saying, Avenge me of mine adversary. And he would not for a while: but afterward he said within himself, Though I fear not God, nor regard man;” — Luke 18:3-4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/persistent-widow-s3.svg',
          alt: 'She keeps coming',
          caption: 'And he would not for a while: but afterward he said within himself, Though I fear not God, nor regard man; Yet because this widow troubleth me, I will avenge her, lest by her continual coming she weary me.',
          verse: '“And he would not for a while: but afterward he said within himself, Though I fear not God, nor regard man; Yet because this widow troubleth me, I will avenge her, lest by her continual coming she weary me.” — Luke 18:4-5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/persistent-widow-s4.svg',
          alt: 'The judge grants her request',
          caption: 'Hear what the unjust judge saith. And shall not God avenge his own elect?',
          verse: '“And the Lord said, Hear what the unjust judge saith. And shall not God avenge his own elect, which cry day and night unto him, though he bear long with them? I tell you that he will avenge them speedily. Nevertheless when the Son of man cometh, shall he find faith on the earth?” — Luke 18:6-8 (KJV)'
        }
      ]
    },
    {
      id: 'healing-leper',
      title: 'Jesus Heals the Leper',
      verse: 'And Jesus put forth his hand, and touched him, saying, I will; be thou clean. And immediately his leprosy was cleansed. — Matthew 8:3 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Heals the Leper. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus is willing to make clean.',
      idea: 'Jesus is willing to make clean.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/healing-leper-s1.svg',
          alt: 'A leper kneels before Jesus',
          caption: 'And, behold, there came a leper and worshipped him, saying, Lord, if thou wilt, thou canst make me clean.',
          verse: '“And, behold, there came a leper and worshipped him, saying, Lord, if thou wilt, thou canst make me clean.” — Matthew 8:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/healing-leper-s2.svg',
          alt: 'Jesus touches him',
          caption: 'And Jesus put forth his hand, and touched him, saying, I will; be thou clean. And immediately his leprosy was cleansed.',
          verse: '“And Jesus put forth his hand, and touched him, saying, I will; be thou clean. And immediately his leprosy was cleansed.” — Matthew 8:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/healing-leper-s3.svg',
          alt: 'He is cleansed',
          caption: 'And immediately his leprosy was cleansed.',
          verse: '“And Jesus put forth his hand, and touched him, saying, I will; be thou clean. And immediately his leprosy was cleansed.” — Matthew 8:3 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/healing-leper-s4.svg',
          alt: 'Jesus sends him to the priest',
          caption: 'And Jesus saith unto him, See thou tell no man; but go thy way, shew thyself to the priest, and offer the gift that Moses commanded, for a testimony unto them.',
          verse: '“And Jesus saith unto him, See thou tell no man; but go thy way, shew thyself to the priest, and offer the gift that Moses commanded, for a testimony unto them.” — Matthew 8:4 (KJV)'
        }
      ]
    },
    {
      id: 'joseph-coat',
      title: 'Joseph\'s Coat of Many Colours',
      verse: 'Now Israel loved Joseph more than all his children, because he was the son of his old age: and he made him a coat of many colours. — Genesis 37:3 (KJV)',
      lead: 'Four gentle panels that walk through Joseph\'s Coat of Many Colours. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God can use hard days for good.',
      idea: 'God can use hard days for good.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/joseph-coat-s1.svg',
          alt: 'Joseph receiving a coat of many colours',
          caption: 'Jacob loves Joseph and gives him a coat.',
          verse: '“Now Israel loved Joseph more than all his children, because he was the son of his old age: and he made him a coat of many colours.” — Genesis 37:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/joseph-coat-s2.svg',
          alt: 'Joseph’s brothers looking on with jealousy',
          caption: 'Joseph’s brothers are jealous.',
          verse: '“And when his brethren saw that their father loved him more than all his brethren, they hated him, and could not speak peaceably unto him.” — Genesis 37:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/joseph-coat-s3.svg',
          alt: 'Joseph in a pit',
          caption: 'Joseph is cast into a pit.',
          verse: '“And they took him, and cast him into a pit: and the pit was empty, there was no water in it.” — Genesis 37:24 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/joseph-coat-s4.svg',
          alt: 'Joseph sold and taken toward Egypt',
          caption: 'Sold into Egypt — yet God is still with him.',
          verse: '“And the LORD was with Joseph, and he was a prosperous man; and he was in the house of his master the Egyptian.” — Genesis 39:2 (KJV)'
        }
      ]
    },
    {
      id: 'joseph-dreams',
      title: 'Joseph Interprets Dreams',
      verse: 'And Joseph answered Pharaoh, saying, It is not in me: God shall give Pharaoh an answer of peace. — Genesis 41:16 (KJV)',
      lead: 'Four gentle panels that walk through Joseph Interprets Dreams. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God can turn sorrow into saving.',
      idea: 'God can turn sorrow into saving.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/joseph-dreams-s1.svg',
          alt: 'Joseph in prison',
          caption: 'And Joseph’s master took him, and put him into the prison, a place where the king’s prisoners were bound: and he was there in the prison.',
          verse: '“And Joseph’s master took him, and put him into the prison, a place where the king’s prisoners were bound: and he was there in the prison.” — Genesis 39:20 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/joseph-dreams-s2.svg',
          alt: 'The butler and the baker dream',
          caption: 'The butler and the baker of the king of Egypt dreamed, each man his dream in one night.',
          verse: '“And they dreamed a dream both of them, each man his dream in one night, each man according to the interpretation of his dream, the butler and the baker of the king of Egypt, which were bound in the prison.” — Genesis 40:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/joseph-dreams-s3.svg',
          alt: 'Joseph before Pharaoh',
          caption: 'And Pharaoh said unto Joseph, I have dreamed a dream, and there is none that can interpret it: and I have heard say of thee, that thou canst understand a dream to interpret it.',
          verse: '“And Pharaoh said unto Joseph, I have dreamed a dream, and there is none that can interpret it: and I have heard say of thee, that thou canst understand a dream to interpret it.” — Genesis 41:15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/joseph-dreams-s4.svg',
          alt: 'Joseph rules in Egypt',
          caption: 'Pharaoh said unto Joseph, See, I have set thee over all the land of Egypt.',
          verse: '“Thou shalt be over my house, and according unto thy word shall all my people be ruled: only in the throne will I be greater than thou.” — Genesis 41:40 (KJV)'
        }
      ]
    },
    {
      id: 'burning-bush',
      title: 'Moses and the Burning Bush',
      verse: 'And God said unto Moses, I AM THAT I AM: and he said, Thus shalt thou say unto the children of Israel, I AM hath sent me unto you. — Exodus 3:14 (KJV)',
      lead: 'Four gentle panels that walk through Moses and the Burning Bush. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God sees; God sends.',
      idea: 'God sees; God sends.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/burning-bush-s1.svg',
          alt: 'The bush burns with fire',
          caption: 'And the angel of the LORD appeared unto him in a flame of fire out of the midst of a bush: and he looked, and, behold, the bush burned with fire, and the bush was not consumed.',
          verse: '“And the angel of the LORD appeared unto him in a flame of fire out of the midst of a bush: and he looked, and, behold, the bush burned with fire, and the bush was not consumed.” — Exodus 3:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/burning-bush-s2.svg',
          alt: 'God calls Moses',
          caption: 'And when the LORD saw that he turned aside to see, God called unto him out of the midst of the bush, and said, Moses, Moses. And he said, Here am I.',
          verse: '“And when the LORD saw that he turned aside to see, God called unto him out of the midst of the bush, and said, Moses, Moses. And he said, Here am I.” — Exodus 3:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/burning-bush-s3.svg',
          alt: 'Put off thy shoes',
          caption: 'And he said, Draw not nigh hither: put off thy shoes from off thy feet, for the place whereon thou standest is holy ground.',
          verse: '“And he said, Draw not nigh hither: put off thy shoes from off thy feet, for the place whereon thou standest is holy ground.” — Exodus 3:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/burning-bush-s4.svg',
          alt: 'Go to Pharaoh',
          caption: 'Come now therefore, and I will send thee unto Pharaoh, that thou mayest bring forth my people the children of Israel out of Egypt. And Moses said unto God, Who am I, that I should go unto Pharaoh, and that I should bring forth the children of Israel out of Egypt?',
          verse: '“Come now therefore, and I will send thee unto Pharaoh, that thou mayest bring forth my people the children of Israel out of Egypt. And Moses said unto God, Who am I, that I should go unto Pharaoh, and that I should bring forth the children of Israel out of Egypt?” — Exodus 3:10-11 (KJV)'
        }
      ]
    },
    {
      id: 'jericho',
      title: 'Joshua and the Walls of Jericho',
      verse: 'And it shall come to pass, that when they make a long blast with the ram’s horn, and when ye hear the sound of the trumpet, all the people shall shout with a great shout; and the wall of the city shall fall down flat, and the people shall ascend up every man straight before him. — Joshua 6:5 (KJV)',
      lead: 'Four gentle panels that walk through Joshua and the Walls of Jericho. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Trust and obey — walls fall.',
      idea: 'Trust and obey — walls fall.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jericho-s1.svg',
          alt: 'Israel marches around Jericho',
          caption: 'And ye shall compass the city, all ye men of war, and go round about the city once. Thus shalt thou do six days.',
          verse: '“And ye shall compass the city, all ye men of war, and go round about the city once. Thus shalt thou do six days.” — Joshua 6:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jericho-s2.svg',
          alt: 'Seven priests with trumpets',
          caption: 'Seven priests bearing seven trumpets of rams\' horns before the ark of the LORD.',
          verse: '“And seven priests shall bear before the ark seven trumpets of rams’ horns: and the seventh day ye shall compass the city seven times, and the priests shall blow with the trumpets.” — Joshua 6:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jericho-s3.svg',
          alt: 'The people shout',
          caption: 'It shall come to pass, when they make a long blast.',
          verse: '“And it shall come to pass, that when they make a long blast with the ram’s horn, and when ye hear the sound of the trumpet, all the people shall shout with a great shout; and the wall of the city shall fall down flat, and the people shall ascend up every man straight before him.” — Joshua 6:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jericho-s4.svg',
          alt: 'The wall falls down',
          caption: 'So the people shouted when the priests blew with the trumpets: and it came to pass, when the people heard the sound of the trumpet, and the people shouted with a great shout, that the wall fell down flat, so that the people went up into the city, every man straight before him, and they took the city.',
          verse: '“So the people shouted when the priests blew with the trumpets: and it came to pass, when the people heard the sound of the trumpet, and the people shouted with a great shout, that the wall fell down flat, so that the people went up into the city, every man straight before him, and they took the city.” — Joshua 6:20 (KJV)'
        }
      ]
    },
    {
      id: 'gideon-fleece',
      title: 'Gideon and the Fleece',
      verse: 'And Gideon said unto God, If thou wilt save Israel by mine hand, as thou hast said, — Judges 6:36 (KJV)',
      lead: 'Four gentle panels that walk through Gideon and the Fleece. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God strengthens the weak.',
      idea: 'God strengthens the weak.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/gideon-fleece-s1.svg',
          alt: 'Gideon asks God for a sign',
          caption: 'And Gideon said unto God, If thou wilt save Israel by mine hand, as thou hast said, Behold, I will put a fleece of wool in the floor; and if the dew be on the fleece only, and it be dry upon all the earth beside, then shall I know that thou wilt save Israel by mine hand, as thou hast said.',
          verse: '“And Gideon said unto God, If thou wilt save Israel by mine hand, as thou hast said, Behold, I will put a fleece of wool in the floor; and if the dew be on the fleece only, and it be dry upon all the earth beside, then shall I know that thou wilt save Israel by mine hand, as thou hast said.” — Judges 6:36-37 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/gideon-fleece-s2.svg',
          alt: 'The fleece is wet with dew',
          caption: 'And it was so: for he rose up early on the morrow, and thrust the fleece together, and wringed the dew out of the fleece, a bowl full of water.',
          verse: '“And it was so: for he rose up early on the morrow, and thrust the fleece together, and wringed the dew out of the fleece, a bowl full of water.” — Judges 6:38 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/gideon-fleece-s3.svg',
          alt: 'The fleece is dry, the ground wet',
          caption: 'Let it now be dry only upon the fleece.',
          verse: '“And God did so that night: for it was dry upon the fleece only, and there was dew on all the ground.” — Judges 6:40 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/gideon-fleece-s4.svg',
          alt: 'Gideon leads the army',
          caption: 'And it came to pass the same night, that the LORD said unto him, Arise, get thee down unto the host; for I have delivered it into thine hand. But if thou fear to go down, go thou with Phurah thy servant down to the host: And thou shalt hear what they say; and afterward shall thine hands be strengthened to go down unto the host. Then went he down with Phurah his servant unto the outside of the armed men that were in the host. And the Midianites and the Amalekites and all the children of the east lay along in the valley like grasshoppers for multitude; and their camels were without number, as the sand by the sea side for multitude. And when Gideon was come, behold, there was a man that told a dream unto his fellow, and said, Behold, I dreamed a dream, and, lo, a cake of barley bread tumbled into the host of Midian, and came unto a tent, and smote it that it fell, and overturned it, that the tent lay along. And his fellow answered and said, This is nothing else save the sword of Gideon the son of Joash, a man of Israel: for into his hand hath God delivered Midian, and all the host. And it was so, when Gideon heard the telling of the dream, and the interpretation thereof, that he worshipped, and returned into the host of Israel, and said, Arise; for the LORD hath delivered into your hand the host of Midian.',
          verse: '“And it came to pass the same night, that the LORD said unto him, Arise, get thee down unto the host; for I have delivered it into thine hand. But if thou fear to go down, go thou with Phurah thy servant down to the host: And thou shalt hear what they say; and afterward shall thine hands be strengthened to go down unto the host. Then went he down with Phurah his servant unto the outside of the armed men that were in the host. And the Midianites and the Amalekites and all the children of the east lay along in the valley like grasshoppers for multitude; and their camels were without number, as the sand by the sea side for multitude. And when Gideon was come, behold, there was a man that told a dream unto his fellow, and said, Behold, I dreamed a dream, and, lo, a cake of barley bread tumbled into the host of Midian, and came unto a tent, and smote it that it fell, and overturned it, that the tent lay along. And his fellow answered and said, This is nothing else save the sword of Gideon the son of Joash, a man of Israel: for into his hand hath God delivered Midian, and all the host. And it was so, when Gideon heard the telling of the dream, and the interpretation thereof, that he worshipped, and returned into the host of Israel, and said, Arise; for the LORD hath delivered into your hand the host of Midian.” — Judges 7:9-15 (KJV)'
        }
      ]
    },
    {
      id: 'samson',
      title: 'Samson',
      verse: 'And the Spirit of the LORD began to move him at times in the camp of Dan between Zorah and Eshtaol. — Judges 13:25 (KJV)',
      lead: 'Four gentle panels that walk through Samson. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Strength is a gift to use for God.',
      idea: 'Strength is a gift to use for God.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/samson-s1.svg',
          alt: 'Samson\'s great strength',
          caption: 'And the Spirit of the LORD came mightily upon him, and he rent him as he would have rent a kid, and he had nothing in his hand: but he told not his father or his mother what he had done.',
          verse: '“And the Spirit of the LORD came mightily upon him, and he rent him as he would have rent a kid, and he had nothing in his hand: but he told not his father or his mother what he had done.” — Judges 14:6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/samson-s2.svg',
          alt: 'Samson carries the city gates',
          caption: 'Samson took the doors of the gate of the city.',
          verse: '“And Samson lay till midnight, and arose at midnight, and took the doors of the gate of the city, and the two posts, and went away with them, bar and all, and put them upon his shoulders, and carried them up to the top of an hill that is before Hebron.” — Judges 16:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/samson-s3.svg',
          alt: 'Samson stands against the Philistines',
          caption: 'And he smote them hip and thigh with a great slaughter: and he went down and dwelt in the top of the rock Etam.',
          verse: '“And he smote them hip and thigh with a great slaughter: and he went down and dwelt in the top of the rock Etam.” — Judges 15:8 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/samson-s4.svg',
          alt: 'The house falls; God is glorified',
          caption: 'Samson bowed himself with all his might.',
          verse: '“And Samson said, Let me die with the Philistines. And he bowed himself with all his might; and the house fell upon the lords, and upon all the people that were therein. So the dead which he slew at his death were more than they which he slew in his life.” — Judges 16:30 (KJV)'
        }
      ]
    },
    {
      id: 'esther',
      title: 'Esther Saves Her People',
      verse: 'For if thou altogether holdest thy peace at this time, then shall there enlargement and deliverance arise to the Jews from another place; but thou and thy father’s house shall be destroyed: and who knoweth whether thou art come to the kingdom for such a time as this? — Esther 4:14 (KJV)',
      lead: 'Four gentle panels that walk through Esther Saves Her People. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Courage can serve God’s people.',
      idea: 'Courage can serve God’s people.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/esther-s1.svg',
          alt: 'Esther is chosen queen',
          caption: 'And the king loved Esther above all the women, and she obtained grace and favour in his sight more than all the virgins; so that he set the royal crown upon her head, and made her queen instead of Vashti.',
          verse: '“And the king loved Esther above all the women, and she obtained grace and favour in his sight more than all the virgins; so that he set the royal crown upon her head, and made her queen instead of Vashti.” — Esther 2:17 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/esther-s2.svg',
          alt: 'Haman\'s plot',
          caption: 'And he thought scorn to lay hands on Mordecai alone; for they had shewed him the people of Mordecai: wherefore Haman sought to destroy all the Jews that were throughout the whole kingdom of Ahasuerus, even the people of Mordecai.',
          verse: '“And he thought scorn to lay hands on Mordecai alone; for they had shewed him the people of Mordecai: wherefore Haman sought to destroy all the Jews that were throughout the whole kingdom of Ahasuerus, even the people of Mordecai.” — Esther 3:6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/esther-s3.svg',
          alt: 'Esther comes to the king',
          caption: 'Now it came to pass on the third day, that Esther put on her royal apparel, and stood in the inner court of the king’s house, over against the king’s house: and the king sat upon his royal throne in the royal house, over against the gate of the house. And it was so, when the king saw Esther the queen standing in the court, that she obtained favour in his sight: and the king held out to Esther the golden sceptre that was in his hand. So Esther drew near, and touched the top of the sceptre.',
          verse: '“Now it came to pass on the third day, that Esther put on her royal apparel, and stood in the inner court of the king’s house, over against the king’s house: and the king sat upon his royal throne in the royal house, over against the gate of the house. And it was so, when the king saw Esther the queen standing in the court, that she obtained favour in his sight: and the king held out to Esther the golden sceptre that was in his hand. So Esther drew near, and touched the top of the sceptre.” — Esther 5:1-2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/esther-s4.svg',
          alt: 'The Jews rejoice',
          caption: 'Many of the people of the land became Jews; for the fear of the Jews fell upon them.',
          verse: '“And in every province, and in every city, whithersoever the king’s commandment and his decree came, the Jews had joy and gladness, a feast and a good day. And many of the people of the land became Jews; for the fear of the Jews fell upon them.” — Esther 8:17 (KJV)'
        }
      ]
    },
    {
      id: 'fiery-furnace',
      title: 'Shadrach, Meshach, and Abednego',
      verse: 'If it be so, our God whom we serve is able to deliver us from the burning fiery furnace, and he will deliver us out of thine hand, O king. — Daniel 3:17 (KJV)',
      lead: 'Four gentle panels that walk through Shadrach, Meshach, and Abednego. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God is with us in the fire.',
      idea: 'God is with us in the fire.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/fiery-furnace-s1.svg',
          alt: 'They will not bow to the image',
          caption: 'Shadrach, Meshach, and Abednego, answered and said to the king, O Nebuchadnezzar, we are not careful to answer thee in this matter.',
          verse: '“Shadrach, Meshach, and Abednego, answered and said to the king, O Nebuchadnezzar, we are not careful to answer thee in this matter.” — Daniel 3:16 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/fiery-furnace-s2.svg',
          alt: 'Cast into the furnace',
          caption: 'And these three men, Shadrach, Meshach, and Abednego, fell down bound into the midst of the burning fiery furnace.',
          verse: '“And these three men, Shadrach, Meshach, and Abednego, fell down bound into the midst of the burning fiery furnace.” — Daniel 3:23 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/fiery-furnace-s3.svg',
          alt: 'Four walk unhurt in the fire',
          caption: 'He answered and said, Lo, I see four men loose, walking in the midst of the fire, and they have no hurt; and the form of the fourth is like the Son of God.',
          verse: '“He answered and said, Lo, I see four men loose, walking in the midst of the fire, and they have no hurt; and the form of the fourth is like the Son of God.” — Daniel 3:25 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/fiery-furnace-s4.svg',
          alt: 'They come out; not a hair is singed',
          caption: 'And the princes, governors, and captains, and the king’s counsellors, being gathered together, saw these men, upon whose bodies the fire had no power, nor was an hair of their head singed, neither were their coats changed, nor the smell of fire had passed on them.',
          verse: '“And the princes, governors, and captains, and the king’s counsellors, being gathered together, saw these men, upon whose bodies the fire had no power, nor was an hair of their head singed, neither were their coats changed, nor the smell of fire had passed on them.” — Daniel 3:27 (KJV)'
        }
      ]
    },
    {
      id: 'abraham-isaac',
      title: 'Abraham & Isaac',
      verse: 'And Abraham called the name of that place Jehovahjireh: as it is said to this day, In the mount of the LORD it shall be seen. — Genesis 22:14',
      lead: 'Four gentle panels that walk through Abraham & Isaac. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God provides.',
      idea: 'God provides.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/abraham-isaac-s1.svg',
          alt: 'Abraham and Isaac walk with the wood; a ram waits in the thicket',
          caption: 'And Abraham took the wood of the burnt offering, and laid it upon Isaac his son; and he took the fire in his hand, and a knife; and they went both of them together.',
          verse: '“And Abraham took the wood of the burnt offering, and laid it upon Isaac his son; and he took the fire in his hand, and a knife; and they went both of them together.” — Genesis 22:6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/abraham-isaac-s2.svg',
          alt: 'Father and son take wood',
          caption: 'And Abraham took the wood of the burnt offering, and laid it upon Isaac his son; and he took the fire in his hand, and a knife; and they went both of them together.',
          verse: '“And Abraham took the wood of the burnt offering, and laid it upon Isaac his son; and he took the fire in his hand, and a knife; and they went both of them together.” — Genesis 22:6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/abraham-isaac-s3.svg',
          alt: 'Isaac asks about the lamb',
          caption: 'And Isaac spake unto Abraham his father, and said, My father: and he said, Here am I, my son. And he said, Behold the fire and the wood: but where is the lamb for a burnt offering?',
          verse: '“And Isaac spake unto Abraham his father, and said, My father: and he said, Here am I, my son. And he said, Behold the fire and the wood: but where is the lamb for a burnt offering?” — Genesis 22:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/abraham-isaac-s4.svg',
          alt: 'The LORD provides a ram',
          caption: 'And Abraham lifted up his eyes, and looked, and behold behind him a ram caught in a thicket by his horns: and Abraham went and took the ram, and offered him up for a burnt offering in the stead of his son. And Abraham called the name of that place Jehovahjireh: as it is said to this day, In the mount of the LORD it shall be seen.',
          verse: '“And Abraham lifted up his eyes, and looked, and behold behind him a ram caught in a thicket by his horns: and Abraham went and took the ram, and offered him up for a burnt offering in the stead of his son. And Abraham called the name of that place Jehovahjireh: as it is said to this day, In the mount of the LORD it shall be seen.” — Genesis 22:13-14 (KJV)'
        }
      ]
    },
    {
      id: 'elijah-carmel',
      title: 'Elijah & the Fire on Mount Carmel',
      verse: 'And when all the people saw it, they fell on their faces: and they said, The LORD, he is the God; the LORD, he is the God. — 1 Kings 18:39 (KJV)',
      lead: 'Four gentle panels that walk through Elijah & the Fire on Mount Carmel. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The LORD, He is the God.',
      idea: 'The LORD, He is the God.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elijah-carmel-s1.svg',
          alt: 'The prophets of Baal cry aloud',
          caption: 'And they took the bullock which was given them, and they dressed it, and called on the name of Baal from morning even until noon, saying, O Baal, hear us. But there was no voice, nor any that answered. And they leaped upon the altar which was made.',
          verse: '“And they took the bullock which was given them, and they dressed it, and called on the name of Baal from morning even until noon, saying, O Baal, hear us. But there was no voice, nor any that answered. And they leaped upon the altar which was made.” — 1 Kings 18:26 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-carmel-s2.svg',
          alt: 'Elijah repairs the altar',
          caption: 'And Elijah took twelve stones, according to the number of the tribes of the sons of Jacob, unto whom the word of the LORD came, saying, Israel shall be thy name: And with the stones he built an altar in the name of the LORD: and he made a trench about the altar, as great as would contain two measures of seed.',
          verse: '“And Elijah took twelve stones, according to the number of the tribes of the sons of Jacob, unto whom the word of the LORD came, saying, Israel shall be thy name: And with the stones he built an altar in the name of the LORD: and he made a trench about the altar, as great as would contain two measures of seed.” — 1 Kings 18:31-32 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-carmel-s3.svg',
          alt: 'Fire falls from heaven',
          caption: 'Then the fire of the LORD fell, and consumed the burnt sacrifice, and the wood, and the stones, and the dust, and licked up the water that was in the trench.',
          verse: '“Then the fire of the LORD fell, and consumed the burnt sacrifice, and the wood, and the stones, and the dust, and licked up the water that was in the trench.” — 1 Kings 18:38 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-carmel-s4.svg',
          alt: 'The people worship the LORD',
          caption: 'And when all the people saw it, they fell on their faces: and they said, The LORD, he is the God; the LORD, he is the God.',
          verse: '“And when all the people saw it, they fell on their faces: and they said, The LORD, he is the God; the LORD, he is the God.” — 1 Kings 18:39 (KJV)'
        }
      ]
    },
    {
      id: 'naaman',
      title: 'Naaman Healed of Leprosy',
      verse: 'And Elisha sent a messenger unto him, saying, Go and wash in Jordan seven times, and thy flesh shall come again to thee, and thou shalt be clean. — 2 Kings 5:10 (KJV)',
      lead: 'Four gentle panels that walk through Naaman Healed of Leprosy. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Simple obedience brings healing.',
      idea: 'Simple obedience brings healing.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/naaman-s1.svg',
          alt: 'Naaman comes with horses and chariot',
          caption: 'Now Naaman, captain of the host of the king of Syria, was a great man with his master, and honourable, because by him the LORD had given deliverance unto Syria: he was also a mighty man in valour, but he was a leper.',
          verse: '“Now Naaman, captain of the host of the king of Syria, was a great man with his master, and honourable, because by him the LORD had given deliverance unto Syria: he was also a mighty man in valour, but he was a leper.” — 2 Kings 5:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/naaman-s2.svg',
          alt: 'Elisha sends a messenger',
          caption: 'And Elisha sent a messenger unto him, saying, Go and wash in Jordan seven times, and thy flesh shall come again to thee, and thou shalt be clean.',
          verse: '“And Elisha sent a messenger unto him, saying, Go and wash in Jordan seven times, and thy flesh shall come again to thee, and thou shalt be clean.” — 2 Kings 5:10 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/naaman-s3.svg',
          alt: 'Naaman dips in Jordan',
          caption: 'Then went he down, and dipped himself seven times in Jordan, according to the saying of the man of God: and his flesh came again like unto the flesh of a little child, and he was clean.',
          verse: '“Then went he down, and dipped himself seven times in Jordan, according to the saying of the man of God: and his flesh came again like unto the flesh of a little child, and he was clean.” — 2 Kings 5:14 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/naaman-s4.svg',
          alt: 'His flesh is clean like a child',
          caption: 'His flesh came again like unto the flesh of a little child, and he was clean.',
          verse: '“Then went he down, and dipped himself seven times in Jordan, according to the saying of the man of God: and his flesh came again like unto the flesh of a little child, and he was clean.” — 2 Kings 5:14 (KJV)'
        }
      ]
    },
    {
      id: 'boy-samuel',
      title: 'The Boy Samuel',
      verse: 'Therefore Eli said unto Samuel, Go, lie down: and it shall be, if he call thee, that thou shalt say, Speak, LORD; for thy servant heareth. So Samuel went and lay down in his place. — 1 Samuel 3:9 (KJV)',
      lead: 'Four gentle panels that walk through The Boy Samuel. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Speak, Lord; Your servant hears.',
      idea: 'Speak, Lord; Your servant hears.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/boy-samuel-s1.svg',
          alt: 'Samuel lies down in the house of the LORD',
          caption: 'And ere the lamp of God went out in the temple of the LORD, where the ark of God was, and Samuel was laid down to sleep;',
          verse: '“And ere the lamp of God went out in the temple of the LORD, where the ark of God was, and Samuel was laid down to sleep;” — 1 Samuel 3:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/boy-samuel-s2.svg',
          alt: 'The LORD calls Samuel',
          caption: 'That the LORD called Samuel: and he answered, Here am I. And he ran unto Eli, and said, Here am I; for thou calledst me. And he said, I called not; lie down again. And he went and lay down.',
          verse: '“That the LORD called Samuel: and he answered, Here am I. And he ran unto Eli, and said, Here am I; for thou calledst me. And he said, I called not; lie down again. And he went and lay down.” — 1 Samuel 3:4-5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/boy-samuel-s3.svg',
          alt: 'Eli tells Samuel how to answer',
          caption: 'And the LORD called Samuel again the third time. And he arose and went to Eli, and said, Here am I; for thou didst call me. And Eli perceived that the LORD had called the child. Therefore Eli said unto Samuel, Go, lie down: and it shall be, if he call thee, that thou shalt say, Speak, LORD; for thy servant heareth. So Samuel went and lay down in his place.',
          verse: '“And the LORD called Samuel again the third time. And he arose and went to Eli, and said, Here am I; for thou didst call me. And Eli perceived that the LORD had called the child. Therefore Eli said unto Samuel, Go, lie down: and it shall be, if he call thee, that thou shalt say, Speak, LORD; for thy servant heareth. So Samuel went and lay down in his place.” — 1 Samuel 3:8-9 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/boy-samuel-s4.svg',
          alt: 'Samuel speaks to the LORD',
          caption: 'And the LORD came, and stood, and called as at other times, Samuel, Samuel. Then Samuel answered, Speak; for thy servant heareth.',
          verse: '“And the LORD came, and stood, and called as at other times, Samuel, Samuel. Then Samuel answered, Speak; for thy servant heareth.” — 1 Samuel 3:10 (KJV)'
        }
      ]
    },
    {
      id: 'ten-lepers',
      title: 'Jesus Heals the Ten Lepers',
      verse: 'And he said unto him, Arise, go thy way: thy faith hath made thee whole. — Luke 17:19 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Heals the Ten Lepers. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Remember to give thanks.',
      idea: 'Remember to give thanks.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ten-lepers-s1.svg',
          alt: 'Ten lepers stand afar off',
          caption: 'And as he entered into a certain village, there met him ten men that were lepers, which stood afar off: And they lifted up their voices, and said, Jesus, Master, have mercy on us.',
          verse: '“And as he entered into a certain village, there met him ten men that were lepers, which stood afar off: And they lifted up their voices, and said, Jesus, Master, have mercy on us.” — Luke 17:12-13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ten-lepers-s2.svg',
          alt: 'Jesus sends them to the priests',
          caption: 'And when he saw them, he said unto them, Go shew yourselves unto the priests. And it came to pass, that, as they went, they were cleansed.',
          verse: '“And when he saw them, he said unto them, Go shew yourselves unto the priests. And it came to pass, that, as they went, they were cleansed.” — Luke 17:14 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/ten-lepers-s3.svg',
          alt: 'They are cleansed on the way',
          caption: 'And it came to pass, that, as they went, they were cleansed.',
          verse: '“And when he saw them, he said unto them, Go shew yourselves unto the priests. And it came to pass, that, as they went, they were cleansed.” — Luke 17:14 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/ten-lepers-s4.svg',
          alt: 'One returns to give thanks',
          caption: 'And one of them, when he saw that he was healed, turned back, and with a loud voice glorified God, And fell down on his face at his feet, giving him thanks: and he was a Samaritan. And Jesus answering said, Were there not ten cleansed? but where are the nine? There are not found that returned to give glory to God, save this stranger. And he said unto him, Arise, go thy way: thy faith hath made thee whole.',
          verse: '“And one of them, when he saw that he was healed, turned back, and with a loud voice glorified God, And fell down on his face at his feet, giving him thanks: and he was a Samaritan. And Jesus answering said, Were there not ten cleansed? but where are the nine? There are not found that returned to give glory to God, save this stranger. And he said unto him, Arise, go thy way: thy faith hath made thee whole.” — Luke 17:15-19 (KJV)'
        }
      ]
    },
    {
      id: 'pharisee-tax-collector',
      title: 'The Pharisee and the Tax Collector',
      verse: 'And the publican, standing afar off, would not lift up so much as his eyes unto heaven, but smote upon his breast, saying, God be merciful to me a sinner. — Luke 18:13 (KJV)',
      lead: 'Four gentle panels that walk through The Pharisee and the Tax Collector. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Humble hearts are heard.',
      idea: 'Humble hearts are heard.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/pharisee-tax-collector-s1.svg',
          alt: 'Two men go up to pray',
          caption: 'Two men went up into the temple to pray; the one a Pharisee, and the other a publican.',
          verse: '“Two men went up into the temple to pray; the one a Pharisee, and the other a publican.” — Luke 18:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/pharisee-tax-collector-s2.svg',
          alt: 'The Pharisee prays proudly',
          caption: 'The Pharisee stood and prayed thus with himself, God, I thank thee, that I am not as other men are, extortioners, unjust, adulterers, or even as this publican.',
          verse: '“The Pharisee stood and prayed thus with himself, God, I thank thee, that I am not as other men are, extortioners, unjust, adulterers, or even as this publican.” — Luke 18:11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/pharisee-tax-collector-s3.svg',
          alt: 'The publican prays humbly',
          caption: 'And the publican, standing afar off, would not lift up so much as his eyes unto heaven, but smote upon his breast, saying, God be merciful to me a sinner.',
          verse: '“And the publican, standing afar off, would not lift up so much as his eyes unto heaven, but smote upon his breast, saying, God be merciful to me a sinner.” — Luke 18:13 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/pharisee-tax-collector-s4.svg',
          alt: 'Jesus teaches who went home justified',
          caption: 'I tell you, this man went down to his house justified rather than the other: for every one that exalteth himself shall be abased; and he that humbleth himself shall be exalted.',
          verse: '“I tell you, this man went down to his house justified rather than the other: for every one that exalteth himself shall be abased; and he that humbleth himself shall be exalted.” — Luke 18:14 (KJV)'
        }
      ]
    },
    {
      id: 'widows-mite',
      title: 'The Widow\'s Mite',
      verse: 'And he called unto him his disciples, and saith unto them, Verily I say unto you, That this poor widow hath cast more in, than all they which have cast into the treasury: — Mark 12:43 (KJV)',
      lead: 'Four gentle panels that walk through The Widow\'s Mite. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God sees quiet, wholehearted giving.',
      idea: 'God sees quiet, wholehearted giving.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/widows-mite-s1.svg',
          alt: 'Jesus watches people give',
          caption: 'And Jesus sat over against the treasury, and beheld how the people cast money into the treasury: and many that were rich cast in much.',
          verse: '“And Jesus sat over against the treasury, and beheld how the people cast money into the treasury: and many that were rich cast in much.” — Mark 12:41 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/widows-mite-s2.svg',
          alt: 'Many rich cast in much',
          caption: 'Many that were rich cast in much.',
          verse: '“And Jesus sat over against the treasury, and beheld how the people cast money into the treasury: and many that were rich cast in much.” — Mark 12:41 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/widows-mite-s3.svg',
          alt: 'A poor widow gives two mites',
          caption: 'There came a certain poor widow, and she threw in two mites, which make a farthing.',
          verse: '“And there came a certain poor widow, and she threw in two mites, which make a farthing.” — Mark 12:42 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/widows-mite-s4.svg',
          alt: 'Jesus says she gave the most',
          caption: 'And he called unto him his disciples, and saith unto them, Verily I say unto you, That this poor widow hath cast more in, than all they which have cast into the treasury: For all they did cast in of their abundance; but she of her want did cast in all that she had, even all her living.',
          verse: '“And he called unto him his disciples, and saith unto them, Verily I say unto you, That this poor widow hath cast more in, than all they which have cast into the treasury: For all they did cast in of their abundance; but she of her want did cast in all that she had, even all her living.” — Mark 12:43-44 (KJV)'
        }
      ]
    },
    {
      id: 'centurion-servant',
      title: 'The Centurion\'s Servant',
      verse: 'When Jesus heard it, he marvelled, and said to them that followed, Verily I say unto you, I have not found so great faith, no, not in Israel. — Matthew 8:10 (KJV)',
      lead: 'Four gentle panels that walk through The Centurion\'s Servant. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Great faith trusts Jesus’ word.',
      idea: 'Great faith trusts Jesus’ word.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/centurion-servant-s1.svg',
          alt: 'The centurion asks Jesus for help',
          caption: 'And when Jesus was entered into Capernaum, there came unto him a centurion, beseeching him, And saying, Lord, my servant lieth at home sick of the palsy, grievously tormented.',
          verse: '“And when Jesus was entered into Capernaum, there came unto him a centurion, beseeching him, And saying, Lord, my servant lieth at home sick of the palsy, grievously tormented.” — Matthew 8:5-6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/centurion-servant-s2.svg',
          alt: 'Speak the word only',
          caption: 'The centurion answered and said, Lord, I am not worthy that thou shouldest come under my roof: but speak the word only, and my servant shall be healed.',
          verse: '“The centurion answered and said, Lord, I am not worthy that thou shouldest come under my roof: but speak the word only, and my servant shall be healed.” — Matthew 8:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/centurion-servant-s3.svg',
          alt: 'Jesus marvels at his faith',
          caption: 'When Jesus heard it, he marvelled, and said to them that followed, Verily I say unto you, I have not found so great faith, no, not in Israel.',
          verse: '“When Jesus heard it, he marvelled, and said to them that followed, Verily I say unto you, I have not found so great faith, no, not in Israel.” — Matthew 8:10 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/centurion-servant-s4.svg',
          alt: 'The servant is healed',
          caption: 'And Jesus said unto the centurion, Go thy way; and as thou hast believed, so be it done unto thee. And his servant was healed in the selfsame hour.',
          verse: '“And Jesus said unto the centurion, Go thy way; and as thou hast believed, so be it done unto thee. And his servant was healed in the selfsame hour.” — Matthew 8:13 (KJV)'
        }
      ]
    },
    {
      id: 'abraham-sarah',
      title: 'Abraham & Sarah',
      verse: 'Therefore Sarah laughed within herself, saying, After I am waxed old shall I have pleasure, my lord being old also? — Genesis 18:12 (KJV)',
      lead: 'Four gentle panels that walk through Abraham & Sarah. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Nothing is too hard for the Lord.',
      idea: 'Nothing is too hard for the Lord.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/abraham-sarah-s1.svg',
          alt: 'Abraham and Sarah by their tent under the stars',
          caption: 'Look now toward heaven, and tell the stars: so shall thy seed be.',
          verse: '“And he brought him forth abroad, and said, Look now toward heaven, and tell the stars, if thou be able to number them: and he said unto him, So shall thy seed be.” — Genesis 15:5 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/abraham-sarah-s2.svg',
          alt: 'Sarah laughs within herself',
          caption: 'Therefore Sarah laughed within herself, saying, After I am waxed old shall I have pleasure, my lord being old also?',
          verse: '“Therefore Sarah laughed within herself, saying, After I am waxed old shall I have pleasure, my lord being old also?” — Genesis 18:12 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/abraham-sarah-s3.svg',
          alt: 'Isaac is born',
          caption: 'For Sarah conceived, and bare Abraham a son in his old age, at the set time of which God had spoken to him.',
          verse: '“For Sarah conceived, and bare Abraham a son in his old age, at the set time of which God had spoken to him.” — Genesis 21:2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/abraham-sarah-s4.svg',
          alt: 'Sarah rejoices',
          caption: 'Sarah said, God hath made me to laugh, so that all that hear will laugh with me.',
          verse: '“And Sarah said, God hath made me to laugh, so that all that hear will laugh with me.” — Genesis 21:6 (KJV)'
        }
      ]
    },
    {
      id: 'elisha-oil',
      title: 'Elisha & the Widow\'s Oil',
      verse: 'Then she came and told the man of God. And he said, Go, sell the oil, and pay thy debt, and live thou and thy children of the rest. — 2 Kings 4:7 (KJV)',
      lead: 'Four gentle panels that walk through Elisha & the Widow\'s Oil. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God multiplies what we surrender.',
      idea: 'God multiplies what we surrender.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elisha-oil-s1.svg',
          alt: 'The widow cries to Elisha',
          caption: 'The wife of one of the sons of the prophets cried.',
          verse: '“Now there cried a certain woman of the wives of the sons of the prophets unto Elisha, saying, Thy servant my husband is dead; and thou knowest that thy servant did fear the LORD: and the creditor is come to take unto him my two sons to be bondmen.” — 2 Kings 4:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elisha-oil-s2.svg',
          alt: 'Borrow many empty vessels',
          caption: 'Then he said, Go, borrow thee vessels abroad of all thy neighbours, even empty vessels; borrow not a few.',
          verse: '“Then he said, Go, borrow thee vessels abroad of all thy neighbours, even empty vessels; borrow not a few.” — 2 Kings 4:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elisha-oil-s3.svg',
          alt: 'The oil multiplies',
          caption: 'And it came to pass, when the vessels were full, that she said unto her son, Bring me yet a vessel. And he said unto her, There is not a vessel more. And the oil stayed.',
          verse: '“And it came to pass, when the vessels were full, that she said unto her son, Bring me yet a vessel. And he said unto her, There is not a vessel more. And the oil stayed.” — 2 Kings 4:6 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elisha-oil-s4.svg',
          alt: 'She pays her debt',
          caption: 'Then she came and told the man of God. And he said, Go, sell the oil, and pay thy debt, and live thou and thy children of the rest.',
          verse: '“Then she came and told the man of God. And he said, Go, sell the oil, and pay thy debt, and live thou and thy children of the rest.” — 2 Kings 4:7 (KJV)'
        }
      ]
    },
    {
      id: 'hannah-samuel',
      title: 'Hannah & Samuel',
      verse: 'For this child I prayed; and the LORD hath given me my petition which I asked of him. - 1 Samuel 1:27',
      lead: 'Four gentle panels that walk through Hannah & Samuel. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God hears earnest prayer.',
      idea: 'God hears earnest prayer.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/hannah-samuel-s1.svg',
          alt: 'Hannah brings young Samuel to Eli at the house of the LORD',
          caption: 'For this child I prayed; and the LORD hath given me my petition which I asked of him.',
          verse: '“For this child I prayed; and the LORD hath given me my petition which I asked of him:” — 1 Samuel 1:27 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/hannah-samuel-s2.svg',
          alt: 'Eli blesses her',
          caption: 'Then Eli answered and said, Go in peace: and the God of Israel grant thee thy petition that thou hast asked of him.',
          verse: '“Then Eli answered and said, Go in peace: and the God of Israel grant thee thy petition that thou hast asked of him.” — 1 Samuel 1:17 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/hannah-samuel-s3.svg',
          alt: 'Samuel is born',
          caption: 'Wherefore it came to pass, when the time was come about after Hannah had conceived, that she bare a son, and called his name Samuel, saying, Because I have asked him of the LORD.',
          verse: '“Wherefore it came to pass, when the time was come about after Hannah had conceived, that she bare a son, and called his name Samuel, saying, Because I have asked him of the LORD.” — 1 Samuel 1:20 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/hannah-samuel-s4.svg',
          alt: 'Hannah dedicates him to the LORD',
          caption: 'For this child I prayed; and the LORD hath given me my petition which I asked of him: Therefore also I have lent him to the LORD; as long as he liveth he shall be lent to the LORD. And he worshipped the LORD there.',
          verse: '“For this child I prayed; and the LORD hath given me my petition which I asked of him: Therefore also I have lent him to the LORD; as long as he liveth he shall be lent to the LORD. And he worshipped the LORD there.” — 1 Samuel 1:27-28 (KJV)'
        }
      ]
    },
    {
      id: 'david-jonathan',
      title: 'David & Jonathan',
      verse: 'And it came to pass, when he had made an end of speaking unto Saul, that the soul of Jonathan was knit with the soul of David, and Jonathan loved him as his own soul. — 1 Samuel 18:1 (KJV)',
      lead: 'Four gentle panels that walk through David & Jonathan. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: True friendship is loyal.',
      idea: 'True friendship is loyal.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/david-jonathan-s1.svg',
          alt: 'Jonathan gives David his robe',
          caption: 'And Jonathan stripped himself of the robe that was upon him, and gave it to David, and his garments, even to his sword, and to his bow, and to his girdle.',
          verse: '“And Jonathan stripped himself of the robe that was upon him, and gave it to David, and his garments, even to his sword, and to his bow, and to his girdle.” — 1 Samuel 18:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/david-jonathan-s2.svg',
          alt: 'They make a covenant',
          caption: 'Then Jonathan and David made a covenant, because he loved him as his own soul.',
          verse: '“Then Jonathan and David made a covenant, because he loved him as his own soul.” — 1 Samuel 18:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/david-jonathan-s3.svg',
          alt: 'Jonathan sends David in peace',
          caption: 'And Jonathan said to David, Go in peace, forasmuch as we have sworn both of us in the name of the LORD, saying, The LORD be between me and thee, and between my seed and thy seed for ever. And he arose and departed: and Jonathan went into the city.',
          verse: '“And Jonathan said to David, Go in peace, forasmuch as we have sworn both of us in the name of the LORD, saying, The LORD be between me and thee, and between my seed and thy seed for ever. And he arose and departed: and Jonathan went into the city.” — 1 Samuel 20:42 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/david-jonathan-s4.svg',
          alt: 'Their souls were knit together',
          caption: 'And it came to pass, when he had made an end of speaking unto Saul, that the soul of Jonathan was knit with the soul of David, and Jonathan loved him as his own soul.',
          verse: '“And it came to pass, when he had made an end of speaking unto Saul, that the soul of Jonathan was knit with the soul of David, and Jonathan loved him as his own soul.” — 1 Samuel 18:1 (KJV)'
        }
      ]
    },
    {
      id: 'rich-young-ruler',
      title: 'Jesus Talks with a Rich Young Man',
      verse: 'Jesus said unto him, If thou wilt be perfect, go and sell that thou hast, and give to the poor, and thou shalt have treasure in heaven: and come and follow me. — Matthew 19:21 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Talks with a Rich Young Man. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Follow Jesus above all.',
      idea: 'Follow Jesus above all.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/rich-young-ruler-s1.svg',
          alt: 'The young man asks Jesus',
          caption: 'And, behold, one came and said unto him, Good Master, what good thing shall I do, that I may have eternal life?',
          verse: '“And, behold, one came and said unto him, Good Master, what good thing shall I do, that I may have eternal life?” — Matthew 19:16 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/rich-young-ruler-s2.svg',
          alt: 'Jesus tells him to sell and follow',
          caption: 'Jesus said unto him, If thou wilt be perfect, go and sell that thou hast, and give to the poor, and thou shalt have treasure in heaven: and come and follow me.',
          verse: '“Jesus said unto him, If thou wilt be perfect, go and sell that thou hast, and give to the poor, and thou shalt have treasure in heaven: and come and follow me.” — Matthew 19:21 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/rich-young-ruler-s3.svg',
          alt: 'He goes away sorrowful',
          caption: 'But when the young man heard that saying, he went away sorrowful: for he had great possessions.',
          verse: '“But when the young man heard that saying, he went away sorrowful: for he had great possessions.” — Matthew 19:22 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/rich-young-ruler-s4.svg',
          alt: 'Jesus teaches about riches',
          caption: 'Jesus said unto his disciples, Verily I say unto you.',
          verse: '“Then said Jesus unto his disciples, Verily I say unto you, That a rich man shall hardly enter into the kingdom of heaven.” — Matthew 19:23 (KJV)'
        }
      ]
    },
    {
      id: 'pearl-great-price',
      title: 'The Pearl of Great Price',
      verse: 'Again, the kingdom of heaven is like unto a merchant man, seeking goodly pearls: — Matthew 13:45 (KJV)',
      lead: 'Four gentle panels that walk through The Pearl of Great Price. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The kingdom is worth everything.',
      idea: 'The kingdom is worth everything.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/pearl-great-price-s1.svg',
          alt: 'A merchant seeks pearls',
          caption: 'Again, the kingdom of heaven is like unto a merchant man, seeking goodly pearls.',
          verse: '“Again, the kingdom of heaven is like unto a merchant man, seeking goodly pearls:” — Matthew 13:45 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/pearl-great-price-s2.svg',
          alt: 'He finds one pearl of great price',
          caption: 'Who, when he had found one pearl of great price, went and sold all that he had, and bought it.',
          verse: '“Who, when he had found one pearl of great price, went and sold all that he had, and bought it.” — Matthew 13:46 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/pearl-great-price-s3.svg',
          alt: 'He sells all that he has',
          caption: 'He went and sold all that he had, to buy that one pearl.',
          verse: '“Who, when he had found one pearl of great price, went and sold all that he had, and bought it.” — Matthew 13:46 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/pearl-great-price-s4.svg',
          alt: 'The kingdom is worth everything',
          caption: 'Who, when he had found one pearl of great price, went and sold all that he had, and bought it.',
          verse: '“Who, when he had found one pearl of great price, went and sold all that he had, and bought it.” — Matthew 13:46 (KJV)'
        }
      ]
    },
    {
      id: 'withered-hand',
      title: 'Jesus Heals the Man with the Withered Hand',
      verse: 'Then saith he to the man, Stretch forth thine hand. And he stretched it forth; and it was restored whole, like as the other. — Matthew 12:13 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Heals the Man with the Withered Hand. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus restores what is broken.',
      idea: 'Jesus restores what is broken.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/withered-hand-s1.svg',
          alt: 'A man with a withered hand',
          caption: 'And, behold, there was a man which had his hand withered. And they asked him, saying, Is it lawful to heal on the sabbath days? that they might accuse him.',
          verse: '“And, behold, there was a man which had his hand withered. And they asked him, saying, Is it lawful to heal on the sabbath days? that they might accuse him.” — Matthew 12:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/withered-hand-s2.svg',
          alt: 'Jesus answers the Pharisees',
          caption: 'And he said unto them, What man shall there be among you, that shall have one sheep, and if it fall into a pit on the sabbath day, will he not lay hold on it, and lift it out?',
          verse: '“And he said unto them, What man shall there be among you, that shall have one sheep, and if it fall into a pit on the sabbath day, will he not lay hold on it, and lift it out?” — Matthew 12:11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/withered-hand-s3.svg',
          alt: 'Stretch forth thine hand',
          caption: 'Then saith he to the man, Stretch forth thine hand. And he stretched it forth; and it was restored whole, like as the other.',
          verse: '“Then saith he to the man, Stretch forth thine hand. And he stretched it forth; and it was restored whole, like as the other.” — Matthew 12:13 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/withered-hand-s4.svg',
          alt: 'His hand is whole like the other',
          caption: 'It was restored whole, like as the other.',
          verse: '“Then saith he to the man, Stretch forth thine hand. And he stretched it forth; and it was restored whole, like as the other.” — Matthew 12:13 (KJV)'
        }
      ]
    },
    {
      id: 'unforgiving-servant',
      title: 'The Unforgiving Servant',
      verse: 'Shouldest not thou also have had compassion on thy fellowservant, even as I had pity on thee? — Matthew 18:33',
      lead: 'Four gentle panels that walk through The Unforgiving Servant. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Forgiven people forgive.',
      idea: 'Forgiven people forgive.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/unforgiving-servant-s1.svg',
          alt: 'The king reckons with his servant',
          caption: 'The kingdom of heaven is likened unto a certain.',
          verse: '“Therefore is the kingdom of heaven likened unto a certain king, which would take account of his servants. And when he had begun to reckon, one was brought unto him, which owed him ten thousand talents.” — Matthew 18:23-24 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/unforgiving-servant-s2.svg',
          alt: 'The king forgives the great debt',
          caption: 'Then the lord of that servant was moved with compassion, and loosed him, and forgave him the debt.',
          verse: '“Then the lord of that servant was moved with compassion, and loosed him, and forgave him the debt.” — Matthew 18:27 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/unforgiving-servant-s3.svg',
          alt: 'He will not forgive his fellowservant',
          caption: 'But the same servant went out, and found one of his fellowservants, which owed him an hundred pence: and he laid hands on him, and took him by the throat, saying, Pay me that thou owest.',
          verse: '“But the same servant went out, and found one of his fellowservants, which owed him an hundred pence: and he laid hands on him, and took him by the throat, saying, Pay me that thou owest.” — Matthew 18:28 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/unforgiving-servant-s4.svg',
          alt: 'The king is angry',
          caption: 'Shouldest not thou also have had compassion on thy fellowservant, even as I had pity on thee? And his lord was wroth, and delivered him to the tormentors, till he should pay all that was due unto him. So likewise shall my heavenly Father do also unto you, if ye from your hearts forgive not every one his brother their trespasses.',
          verse: '“Shouldest not thou also have had compassion on thy fellowservant, even as I had pity on thee? And his lord was wroth, and delivered him to the tormentors, till he should pay all that was due unto him. So likewise shall my heavenly Father do also unto you, if ye from your hearts forgive not every one his brother their trespasses.” — Matthew 18:33-35 (KJV)'
        }
      ]
    },
    {
      id: 'boy-david',
      title: 'The Boy David',
      verse: 'Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the LORD came upon David from that day forward. So Samuel rose up, and went to Ramah. — 1 Samuel 16:13 (KJV)',
      lead: 'Four gentle panels that walk through The Boy David. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God looks on the heart.',
      idea: 'God looks on the heart.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/boy-david-s1.svg',
          alt: 'Young David keeps sheep and plays the harp',
          caption: 'And Samuel said unto Jesse, Are here all thy children? And he said, There remaineth yet the youngest, and, behold, he keepeth the sheep. And Samuel said unto Jesse, Send and fetch him: for we will not sit down till he come hither.',
          verse: '“And Samuel said unto Jesse, Are here all thy children? And he said, There remaineth yet the youngest, and, behold, he keepeth the sheep. And Samuel said unto Jesse, Send and fetch him: for we will not sit down till he come hither.” — 1 Samuel 16:11 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/boy-david-s2.svg',
          alt: 'David keeps sheep in the field',
          caption: 'Again, Jesse made seven of his sons to pass before Samuel. And Samuel said unto Jesse, The LORD hath not chosen these. And Samuel said unto Jesse, Are here all thy children? And he said, There remaineth yet the youngest, and, behold, he keepeth the sheep. And Samuel said unto Jesse, Send and fetch him: for we will not sit down till he come hither.',
          verse: '“Again, Jesse made seven of his sons to pass before Samuel. And Samuel said unto Jesse, The LORD hath not chosen these. And Samuel said unto Jesse, Are here all thy children? And he said, There remaineth yet the youngest, and, behold, he keepeth the sheep. And Samuel said unto Jesse, Send and fetch him: for we will not sit down till he come hither.” — 1 Samuel 16:10-11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/boy-david-s3.svg',
          alt: 'David is anointed before his brothers',
          caption: 'Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the LORD came upon David from that day forward. So Samuel rose up, and went to Ramah.',
          verse: '“Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the LORD came upon David from that day forward. So Samuel rose up, and went to Ramah.” — 1 Samuel 16:13 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/boy-david-s4.svg',
          alt: 'The Spirit of the LORD is upon David',
          caption: 'And he sent, and brought him in. Now he was ruddy, and withal of a beautiful countenance, and goodly to look to. And the LORD said, Arise, anoint him: for this is he. Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the LORD came upon David from that day forward. So Samuel rose up, and went to Ramah.',
          verse: '“And he sent, and brought him in. Now he was ruddy, and withal of a beautiful countenance, and goodly to look to. And the LORD said, Arise, anoint him: for this is he. Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the LORD came upon David from that day forward. So Samuel rose up, and went to Ramah.” — 1 Samuel 16:12-13 (KJV)'
        }
      ]
    },
    {
      id: 'elijah-ravens',
      title: 'Elijah Fed by Ravens',
      verse: 'And the ravens brought him bread and flesh in the morning, and bread and flesh in the evening; and he drank of the brook. - 1 Kings 17:6',
      lead: 'Four gentle panels that walk through Elijah Fed by Ravens. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God provides in quiet ways.',
      idea: 'God provides in quiet ways.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elijah-ravens-s1.svg',
          alt: 'Elijah by the brook Cherith',
          caption: 'Get thee hence, and turn thee eastward, and hide thyself by the brook Cherith, that is before Jordan.',
          verse: '“Get thee hence, and turn thee eastward, and hide thyself by the brook Cherith, that is before Jordan.” — 1 Kings 17:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-ravens-s2.svg',
          alt: 'Ravens bring food',
          caption: 'And the ravens brought him bread and flesh in the morning, and bread and flesh in the evening; and he drank of the brook.',
          verse: '“And the ravens brought him bread and flesh in the morning, and bread and flesh in the evening; and he drank of the brook.” — 1 Kings 17:6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-ravens-s3.svg',
          alt: 'Elijah drinks from the brook',
          caption: 'And it shall be, that thou shalt drink of the brook; and I have commanded the ravens to feed thee there. So he went and did according unto the word of the LORD: for he went and dwelt by the brook Cherith, that is before Jordan.',
          verse: '“And it shall be, that thou shalt drink of the brook; and I have commanded the ravens to feed thee there. So he went and did according unto the word of the LORD: for he went and dwelt by the brook Cherith, that is before Jordan.” — 1 Kings 17:4-5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-ravens-s4.svg',
          alt: 'The brook dries up',
          caption: 'And it came to pass after a while, that the brook dried up, because there had been no rain in the land.',
          verse: '“And it came to pass after a while, that the brook dried up, because there had been no rain in the land.” — 1 Kings 17:7 (KJV)'
        }
      ]
    },
    {
      id: 'writing-on-wall',
      title: 'The Writing on the Wall',
      verse: 'And this is the writing that was written, MENE, MENE, TEKEL, UPHARSIN. — Daniel 5:25',
      lead: 'Four gentle panels that walk through The Writing on the Wall. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God weighs the heart.',
      idea: 'God weighs the heart.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/writing-on-wall-s1.svg',
          alt: 'A great feast in the palace',
          caption: 'Belshazzar the king made a great feast to a thousand of his lords, and drank wine before the thousand.',
          verse: '“Belshazzar the king made a great feast to a thousand of his lords, and drank wine before the thousand.” — Daniel 5:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/writing-on-wall-s2.svg',
          alt: 'A hand writes on the plaster',
          caption: 'In the same hour came forth fingers of a man’s hand, and wrote over against the candlestick upon the plaister of the wall of the king’s palace: and the king saw the part of the hand that wrote.',
          verse: '“In the same hour came forth fingers of a man’s hand, and wrote over against the candlestick upon the plaister of the wall of the king’s palace: and the king saw the part of the hand that wrote.” — Daniel 5:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/writing-on-wall-s3.svg',
          alt: 'The king is afraid',
          caption: 'Then the king’s countenance was changed, and his thoughts troubled him, so that the joints of his loins were loosed, and his knees smote one against another.',
          verse: '“Then the king’s countenance was changed, and his thoughts troubled him, so that the joints of his loins were loosed, and his knees smote one against another.” — Daniel 5:6 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/writing-on-wall-s4.svg',
          alt: 'Daniel reads the writing',
          caption: 'This is the interpretation of the thing: MENE; God hath numbered thy kingdom, and finished it. TEKEL; Thou art weighed in the balances, and art found wanting.',
          verse: '“This is the interpretation of the thing: MENE; God hath numbered thy kingdom, and finished it. TEKEL; Thou art weighed in the balances, and art found wanting.” — Daniel 5:26-27 (KJV)'
        }
      ]
    },
    {
      id: 'ruth-boaz',
      title: 'Ruth & Boaz',
      verse: 'The LORD recompense thy work, and a full reward be given thee of the LORD God of Israel, under whose wings thou art come to trust. — Ruth 2:12',
      lead: 'Four gentle panels that walk through Ruth & Boaz. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Kindness opens a future of hope.',
      idea: 'Kindness opens a future of hope.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ruth-boaz-s1.svg',
          alt: 'Ruth gleans in Boaz\'s field',
          caption: 'And she went, and came, and gleaned in the field after the reapers: and her hap was to light on a part of the field belonging unto Boaz, who was of the kindred of Elimelech.',
          verse: '“And she went, and came, and gleaned in the field after the reapers: and her hap was to light on a part of the field belonging unto Boaz, who was of the kindred of Elimelech.” — Ruth 2:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ruth-boaz-s2.svg',
          alt: 'Boaz speaks kindly to Ruth',
          caption: 'And Boaz answered and said unto her, It hath fully been shewed me, all that thou hast done unto thy mother in law since the death of thine husband: and how thou hast left thy father and thy mother, and the land of thy nativity, and art come unto a people which thou knewest not heretofore.',
          verse: '“And Boaz answered and said unto her, It hath fully been shewed me, all that thou hast done unto thy mother in law since the death of thine husband: and how thou hast left thy father and thy mother, and the land of thy nativity, and art come unto a people which thou knewest not heretofore.” — Ruth 2:11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/ruth-boaz-s3.svg',
          alt: 'Boaz redeems at the gate',
          caption: 'And Boaz said unto the elders, and unto all the people, Ye are witnesses this day, that I have bought all that was Elimelech’s, and all that was Chilion’s and Mahlon’s, of the hand of Naomi.',
          verse: '“And Boaz said unto the elders, and unto all the people, Ye are witnesses this day, that I have bought all that was Elimelech’s, and all that was Chilion’s and Mahlon’s, of the hand of Naomi.” — Ruth 4:9 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/ruth-boaz-s4.svg',
          alt: 'Ruth and Boaz are married',
          caption: 'So Boaz took Ruth, and she was his wife: and when he went in unto her, the LORD gave her conception, and she bare a son.',
          verse: '“So Boaz took Ruth, and she was his wife: and when he went in unto her, the LORD gave her conception, and she bare a son.” — Ruth 4:13 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-baptism',
      title: 'Jesus Is Baptized',
      verse: 'And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him: — Matthew 3:16 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Is Baptized. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: This is My beloved Son.',
      idea: 'This is My beloved Son.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-baptism-s1.svg',
          alt: 'John preaches at the river',
          caption: 'In those days came John the Baptist, preaching in the wilderness of Judaea, And saying, Repent ye: for the kingdom of heaven is at hand.',
          verse: '“In those days came John the Baptist, preaching in the wilderness of Judaea, And saying, Repent ye: for the kingdom of heaven is at hand.” — Matthew 3:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-baptism-s2.svg',
          alt: 'Jesus comes to John to be baptized',
          caption: 'Then cometh Jesus from Galilee to Jordan unto John, to be baptized of him. But John forbad him, saying, I have need to be baptized of thee, and comest thou to me?',
          verse: '“Then cometh Jesus from Galilee to Jordan unto John, to be baptized of him. But John forbad him, saying, I have need to be baptized of thee, and comest thou to me?” — Matthew 3:13-14 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-baptism-s3.svg',
          alt: 'John baptizes Jesus in the water',
          caption: 'And Jesus answering said unto him, Suffer it to be so now: for thus it becometh us to fulfil all righteousness. Then he suffered him.',
          verse: '“And Jesus answering said unto him, Suffer it to be so now: for thus it becometh us to fulfil all righteousness. Then he suffered him.” — Matthew 3:15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-baptism-s4.svg',
          alt: 'The Spirit descends like a dove',
          caption: 'And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him:',
          verse: '“And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him:” — Matthew 3:16 (KJV)'
        }
      ]
    },
    {
      id: 'emmaus-road',
      title: 'The Road to Emmaus',
      verse: 'And they said one to another, Did not our heart burn within us, while he talked with us by the way, and while he opened to us the scriptures? — Luke 24:32 (KJV)',
      lead: 'Four gentle panels that walk through The Road to Emmaus. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus walks with us and opens the Word.',
      idea: 'Jesus walks with us and opens the Word.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/emmaus-road-s1.svg',
          alt: 'Two disciples walk sadly',
          caption: 'And, behold, two of them went that same day to a village called Emmaus, which was from Jerusalem about threescore furlongs.',
          verse: '“And, behold, two of them went that same day to a village called Emmaus, which was from Jerusalem about threescore furlongs.” — Luke 24:13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/emmaus-road-s2.svg',
          alt: 'Jesus draws near and walks with them',
          caption: 'And it came to pass, that, while they communed together and reasoned, Jesus himself drew near, and went with them. But their eyes were holden that they should not know him.',
          verse: '“And it came to pass, that, while they communed together and reasoned, Jesus himself drew near, and went with them. But their eyes were holden that they should not know him.” — Luke 24:15-16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/emmaus-road-s3.svg',
          alt: 'He breaks bread at the table',
          caption: 'And it came to pass, as he sat at meat with them, he took bread, and blessed it, and brake, and gave to them. And their eyes were opened, and they knew him; and he vanished out of their sight.',
          verse: '“And it came to pass, as he sat at meat with them, he took bread, and blessed it, and brake, and gave to them. And their eyes were opened, and they knew him; and he vanished out of their sight.” — Luke 24:30-31 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/emmaus-road-s4.svg',
          alt: 'They hurry back to Jerusalem',
          caption: 'And they rose up the same hour, and returned to Jerusalem, and found the eleven gathered together, and them that were with them, Saying, The Lord is risen indeed, and hath appeared to Simon.',
          verse: '“And they rose up the same hour, and returned to Jerusalem, and found the eleven gathered together, and them that were with them, Saying, The Lord is risen indeed, and hath appeared to Simon.” — Luke 24:33-34 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-washes-feet',
      title: 'Jesus Washes the Disciples\' Feet',
      verse: 'If I then, your Lord and Master, have washed your feet; ye also ought to wash one another\'s feet. — John 13:14',
      lead: 'Four gentle panels that walk through Jesus Washes the Disciples\' Feet. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The greatest serves.',
      idea: 'The greatest serves.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-washes-feet-s1.svg',
          alt: 'The supper is prepared',
          caption: 'Now before the feast of the passover, when Jesus knew that his hour was come that he should depart out of this world unto the Father, having loved his own which were in the world, he loved them unto the end. And supper being ended, the devil having now put into the heart of Judas Iscariot, Simon’s son, to betray him;',
          verse: '“Now before the feast of the passover, when Jesus knew that his hour was come that he should depart out of this world unto the Father, having loved his own which were in the world, he loved them unto the end. And supper being ended, the devil having now put into the heart of Judas Iscariot, Simon’s son, to betray him;” — John 13:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-washes-feet-s2.svg',
          alt: 'Jesus rises with a towel',
          caption: 'Jesus riseth from supper.',
          verse: '“He riseth from supper, and laid aside his garments; and took a towel, and girded himself.” — John 13:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-washes-feet-s3.svg',
          alt: 'He pours water and washes feet',
          caption: 'After that he poureth water into a bason, and began to wash the disciples’ feet, and to wipe them with the towel wherewith he was girded.',
          verse: '“After that he poureth water into a bason, and began to wash the disciples’ feet, and to wipe them with the towel wherewith he was girded.” — John 13:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-washes-feet-s4.svg',
          alt: 'He teaches them to love one another',
          caption: 'If I then, your Lord and Master, have washed your feet; ye also ought to wash one another’s feet. For I have given you an example, that ye should do as I have done to you.',
          verse: '“If I then, your Lord and Master, have washed your feet; ye also ought to wash one another’s feet. For I have given you an example, that ye should do as I have done to you.” — John 13:14-15 (KJV)'
        }
      ]
    },
    {
      id: 'transfiguration',
      title: 'The Transfiguration',
      verse: 'And he was transfigured before them: and his face did shine as the sun, and his raiment was white as the light. — Matthew 17:2',
      lead: 'Four gentle panels that walk through The Transfiguration. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Listen to Him.',
      idea: 'Listen to Him.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/transfiguration-s1.svg',
          alt: 'Jesus leads them up a high mountain',
          caption: 'And after six days Jesus taketh Peter, James, and John his brother, and bringeth them up into an high mountain apart,',
          verse: '“And after six days Jesus taketh Peter, James, and John his brother, and bringeth them up into an high mountain apart,” — Matthew 17:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/transfiguration-s2.svg',
          alt: 'Jesus shines with Moses and Elijah',
          caption: 'And was transfigured before them: and his face did shine as the sun, and his raiment was white as the light. And, behold, there appeared unto them Moses and Elias talking with him.',
          verse: '“And was transfigured before them: and his face did shine as the sun, and his raiment was white as the light. And, behold, there appeared unto them Moses and Elias talking with him.” — Matthew 17:2-3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/transfiguration-s3.svg',
          alt: 'A bright cloud overshadows them',
          caption: 'While he yet spake, behold, a bright cloud overshadowed them: and behold a voice out of the cloud, which said, This is my beloved Son, in whom I am well pleased; hear ye him.',
          verse: '“While he yet spake, behold, a bright cloud overshadowed them: and behold a voice out of the cloud, which said, This is my beloved Son, in whom I am well pleased; hear ye him.” — Matthew 17:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/transfiguration-s4.svg',
          alt: 'Jesus stands alone with his friends',
          caption: 'And when the disciples heard it, they fell on their face, and were sore afraid. And Jesus came and touched them, and said, Arise, and be not afraid.',
          verse: '“And when the disciples heard it, they fell on their face, and were sore afraid. And Jesus came and touched them, and said, Arise, and be not afraid.” — Matthew 17:6-7 (KJV)'
        }
      ]
    },
    {
      id: 'jordan-crossing',
      title: 'Crossing the Jordan',
      verse: 'And the priests that bare the ark of the covenant of the LORD stood firm on dry ground in the midst of Jordan, and all the Israelites passed over on dry ground, until all the people were passed clean over Jordan. — Joshua 3:17 (KJV)',
      lead: 'Four gentle panels that walk through Crossing the Jordan. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God keeps His promise into the land.',
      idea: 'God keeps His promise into the land.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jordan-crossing-s1.svg',
          alt: 'Israel camps by the Jordan River',
          caption: 'And Joshua rose early in the morning; and they removed from Shittim, and came to Jordan, he and all the children of Israel, and lodged there before they passed over.',
          verse: '“And Joshua rose early in the morning; and they removed from Shittim, and came to Jordan, he and all the children of Israel, and lodged there before they passed over.” — Joshua 3:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jordan-crossing-s2.svg',
          alt: 'The priests carry the ark into the river',
          caption: 'And it shall come to pass, as soon as the soles of the feet of the priests that bear the ark of the LORD, the LORD of all the earth, shall rest in the waters of Jordan, that the waters of Jordan shall be cut off from the waters that come down from above; and they shall stand upon an heap.',
          verse: '“And it shall come to pass, as soon as the soles of the feet of the priests that bear the ark of the LORD, the LORD of all the earth, shall rest in the waters of Jordan, that the waters of Jordan shall be cut off from the waters that come down from above; and they shall stand upon an heap.” — Joshua 3:13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jordan-crossing-s3.svg',
          alt: 'The people cross on dry ground',
          caption: 'And the priests that bare the ark of the covenant of the LORD stood firm on dry ground in the midst of Jordan, and all the Israelites passed over on dry ground, until all the people were passed clean over Jordan.',
          verse: '“And the priests that bare the ark of the covenant of the LORD stood firm on dry ground in the midst of Jordan, and all the Israelites passed over on dry ground, until all the people were passed clean over Jordan.” — Joshua 3:17 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jordan-crossing-s4.svg',
          alt: 'Twelve stones for a memorial',
          caption: 'Take you twelve men out of the people and command ye.',
          verse: '“Take you twelve men out of the people, out of every tribe a man, And command ye them, saying, Take you hence out of the midst of Jordan, out of the place where the priests’ feet stood firm, twelve stones, and ye shall carry them over with you, and leave them in the lodging place, where ye shall lodge this night.” — Joshua 4:2-3 (KJV)'
        }
      ]
    },
    {
      id: 'balaams-donkey',
      title: 'Balaam and the Donkey',
      verse: 'The LORD opened the mouth of the ass, and she said unto Balaam, What have I done unto thee, that thou hast smitten me these three times? — Numbers 22:28',
      lead: 'Four gentle panels that walk through Balaam and the Donkey. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God can open any mouth to warn.',
      idea: 'God can open any mouth to warn.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/balaams-donkey-s1.svg',
          alt: 'Balaam rides his donkey',
          caption: 'Balaam rose up in the morning, and saddled his ass, and went with the princes of Moab.',
          verse: '“And Balaam rose up in the morning, and saddled his ass, and went with the princes of Moab.” — Numbers 22:21 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/balaams-donkey-s2.svg',
          alt: 'The donkey sees the angel',
          caption: 'And God’s anger was kindled because he went: and the angel of the LORD stood in the way for an adversary against him. Now he was riding upon his ass, and his two servants were with him. And the ass saw the angel of the LORD standing in the way, and his sword drawn in his hand: and the ass turned aside out of the way, and went into the field: and Balaam smote the ass, to turn her into the way.',
          verse: '“And God’s anger was kindled because he went: and the angel of the LORD stood in the way for an adversary against him. Now he was riding upon his ass, and his two servants were with him. And the ass saw the angel of the LORD standing in the way, and his sword drawn in his hand: and the ass turned aside out of the way, and went into the field: and Balaam smote the ass, to turn her into the way.” — Numbers 22:22-23 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/balaams-donkey-s3.svg',
          alt: 'The donkey speaks',
          caption: 'And the LORD opened the mouth of the ass, and she said unto Balaam, What have I done unto thee, that thou hast smitten me these three times?',
          verse: '“And the LORD opened the mouth of the ass, and she said unto Balaam, What have I done unto thee, that thou hast smitten me these three times?” — Numbers 22:28 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/balaams-donkey-s4.svg',
          alt: 'Balaam bows before the angel',
          caption: 'Then the LORD opened the eyes of Balaam, and he saw the angel of the LORD standing in the way, and his sword drawn in his hand: and he bowed down his head, and fell flat on his face.',
          verse: '“Then the LORD opened the eyes of Balaam, and he saw the angel of the LORD standing in the way, and his sword drawn in his hand: and he bowed down his head, and fell flat on his face.” — Numbers 22:31 (KJV)'
        }
      ]
    },
    {
      id: 'elijah-taken-up',
      title: 'Elijah Taken to Heaven',
      verse: 'And it came to pass, as they still went on, and talked, that, behold, there appeared a chariot of fire, and horses of fire, and parted them both asunder; and Elijah went up by a whirlwind into heaven. — 2 Kings 2:11 (KJV)',
      lead: 'Four gentle panels that walk through Elijah Taken to Heaven. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God receives His faithful servant.',
      idea: 'God receives His faithful servant.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elijah-taken-up-s1.svg',
          alt: 'Elijah and Elisha walk together',
          caption: 'And it came to pass, when the LORD would take up Elijah into heaven by a whirlwind, that Elijah went with Elisha from Gilgal.',
          verse: '“And it came to pass, when the LORD would take up Elijah into heaven by a whirlwind, that Elijah went with Elisha from Gilgal.” — 2 Kings 2:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-taken-up-s2.svg',
          alt: 'Elijah strikes the Jordan with his mantle',
          caption: 'And Elijah took his mantle, and wrapped it together, and smote the waters, and they were divided hither and thither, so that they two went over on dry ground.',
          verse: '“And Elijah took his mantle, and wrapped it together, and smote the waters, and they were divided hither and thither, so that they two went over on dry ground.” — 2 Kings 2:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-taken-up-s3.svg',
          alt: 'Chariot of fire and horses',
          caption: 'And it came to pass, as they still went on, and talked, that, behold, there appeared a chariot of fire, and horses of fire, and parted them both asunder; and Elijah went up by a whirlwind into heaven.',
          verse: '“And it came to pass, as they still went on, and talked, that, behold, there appeared a chariot of fire, and horses of fire, and parted them both asunder; and Elijah went up by a whirlwind into heaven.” — 2 Kings 2:11 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-taken-up-s4.svg',
          alt: 'Elisha picks up Elijah\'s mantle',
          caption: 'And Elisha saw it, and he cried, My father, my father, the chariot of Israel, and the horsemen thereof. And he saw him no more: and he took hold of his own clothes, and rent them in two pieces.',
          verse: '“And Elisha saw it, and he cried, My father, my father, the chariot of Israel, and the horsemen thereof. And he saw him no more: and he took hold of his own clothes, and rent them in two pieces.” — 2 Kings 2:12 (KJV)'
        }
      ]
    },
    {
      id: 'nehemiah-walls',
      title: 'Nehemiah Builds the Wall',
      verse: 'So built we the wall; and all the wall was joined together unto the half thereof: for the people had a mind to work. — Nehemiah 4:6',
      lead: 'Four gentle panels that walk through Nehemiah Builds the Wall. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Build with prayer and courage.',
      idea: 'Build with prayer and courage.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/nehemiah-walls-s1.svg',
          alt: 'Nehemiah is sad for Jerusalem',
          caption: 'It came to pass I asked them concerning the Jews.',
          verse: '“That Hanani, one of my brethren, came, he and certain men of Judah; and I asked them concerning the Jews that had escaped, which were left of the captivity, and concerning Jerusalem. And they said unto me, The remnant that are left of the captivity there in the province are in great affliction and reproach: the wall of Jerusalem also is broken down, and the gates thereof are burned with fire.” — Nehemiah 1:2-3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/nehemiah-walls-s2.svg',
          alt: 'The king sends Nehemiah',
          caption: 'Then the king said unto me, For what dost thou make request? So I prayed to the God of heaven. And I said unto the king, If it please the king, and if thy servant have found favour in thy sight, that thou wouldest send me unto Judah, unto the city of my fathers’ sepulchres, that I may build it.',
          verse: '“Then the king said unto me, For what dost thou make request? So I prayed to the God of heaven. And I said unto the king, If it please the king, and if thy servant have found favour in thy sight, that thou wouldest send me unto Judah, unto the city of my fathers’ sepulchres, that I may build it.” — Nehemiah 2:4-5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/nehemiah-walls-s3.svg',
          alt: 'The people build with one hand and guard with the other',
          caption: 'They which builded on the wall, and they that bare burdens, with those that laded, every one with one of his hands wrought in the work, and with the other hand held a weapon.',
          verse: '“They which builded on the wall, and they that bare burdens, with those that laded, every one with one of his hands wrought in the work, and with the other hand held a weapon.” — Nehemiah 4:17 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/nehemiah-walls-s4.svg',
          alt: 'The wall is finished',
          caption: 'So the wall was finished in the twenty and fifth day of the month Elul, in fifty and two days. And it came to pass, that when all our enemies heard thereof, and all the heathen that were about us saw these things, they were much cast down in their own eyes: for they perceived that this work was wrought of our God.',
          verse: '“So the wall was finished in the twenty and fifth day of the month Elul, in fifty and two days. And it came to pass, that when all our enemies heard thereof, and all the heathen that were about us saw these things, they were much cast down in their own eyes: for they perceived that this work was wrought of our God.” — Nehemiah 6:15-16 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-tempted',
      title: 'Jesus Tempted in the Wilderness',
      verse: 'Then was Jesus led up of the Spirit into the wilderness to be tempted of the devil. — Matthew 4:1 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Tempted in the Wilderness. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Answer temptation with God’s Word.',
      idea: 'Answer temptation with God’s Word.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-tempted-s1.svg',
          alt: 'Jesus is led of the Spirit into the wilderness to be tempted of the devil',
          caption: 'Then was Jesus led up of the Spirit into the wilderness to be tempted of the devil. And when he had fasted forty days and forty nights, he was afterward an hungred.',
          verse: '“Then was Jesus led up of the Spirit into the wilderness to be tempted of the devil. And when he had fasted forty days and forty nights, he was afterward an hungred.” — Matthew 4:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-tempted-s2.svg',
          alt: 'Command these stones to be made bread',
          caption: 'And when the tempter came to him, he said, If thou be the Son of God, command that these stones be made bread. But he answered and said, It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.',
          verse: '“And when the tempter came to him, he said, If thou be the Son of God, command that these stones be made bread. But he answered and said, It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.” — Matthew 4:3-4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-tempted-s3.svg',
          alt: 'Cast thyself down from the temple',
          caption: 'And saith unto him, If thou be the Son of God, cast thyself down: for it is written, He shall give his angels charge concerning thee: and in their hands they shall bear thee up, lest at any time thou dash thy foot against a stone. Jesus said unto him, It is written again, Thou shalt not tempt the Lord thy God.',
          verse: '“And saith unto him, If thou be the Son of God, cast thyself down: for it is written, He shall give his angels charge concerning thee: and in their hands they shall bear thee up, lest at any time thou dash thy foot against a stone. Jesus said unto him, It is written again, Thou shalt not tempt the Lord thy God.” — Matthew 4:6-7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-tempted-s4.svg',
          alt: 'Get thee hence, Satan',
          caption: 'Again, the devil taketh him up into an exceeding high mountain, and sheweth him all the kingdoms of the world, and the glory of them; And saith unto him, All these things will I give thee, if thou wilt fall down and worship me. Then saith Jesus unto him, Get thee hence, Satan: for it is written, Thou shalt worship the Lord thy God, and him only shalt thou serve. Then the devil leaveth him, and, behold, angels came and ministered unto him.',
          verse: '“Again, the devil taketh him up into an exceeding high mountain, and sheweth him all the kingdoms of the world, and the glory of them; And saith unto him, All these things will I give thee, if thou wilt fall down and worship me. Then saith Jesus unto him, Get thee hence, Satan: for it is written, Thou shalt worship the Lord thy God, and him only shalt thou serve. Then the devil leaveth him, and, behold, angels came and ministered unto him.” — Matthew 4:8-11 (KJV)'
        }
      ]
    },
    {
      id: 'paul-silas-prison',
      title: 'Paul and Silas in Prison',
      verse: 'And suddenly there was a great earthquake, so that the foundations of the prison were shaken: and immediately all the doors were opened, and every one\'s bands were loosed. — Acts 16:26',
      lead: 'Four gentle panels that walk through Paul and Silas in Prison. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Praise can rise even in chains.',
      idea: 'Praise can rise even in chains.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/paul-silas-prison-s1.svg',
          alt: 'Paul and Silas sing at midnight',
          caption: 'And at midnight Paul and Silas prayed, and sang praises unto God: and the prisoners heard them.',
          verse: '“And at midnight Paul and Silas prayed, and sang praises unto God: and the prisoners heard them.” — Acts 16:25 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/paul-silas-prison-s2.svg',
          alt: 'A great earthquake shakes the prison',
          caption: 'And suddenly there was a great earthquake, so that the foundations of the prison were shaken: and immediately all the doors were opened, and every one’s bands were loosed.',
          verse: '“And suddenly there was a great earthquake, so that the foundations of the prison were shaken: and immediately all the doors were opened, and every one’s bands were loosed.” — Acts 16:26 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/paul-silas-prison-s3.svg',
          alt: 'The jailer draws his sword',
          caption: 'The keeper of the prison drew out his sword.',
          verse: '“And the keeper of the prison awaking out of his sleep, and seeing the prison doors open, he drew out his sword, and would have killed himself, supposing that the prisoners had been fled. But Paul cried with a loud voice, saying, Do thyself no harm: for we are all here.” — Acts 16:27-28 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/paul-silas-prison-s4.svg',
          alt: 'The jailer and his house believe',
          caption: 'And he took them the same hour of the night, and washed their stripes; and was baptized, he and all his, straightway. And when he had brought them into his house, he set meat before them, and rejoiced, believing in God with all his house.',
          verse: '“And he took them the same hour of the night, and washed their stripes; and was baptized, he and all his, straightway. And when he had brought them into his house, he set meat before them, and rejoiced, believing in God with all his house.” — Acts 16:33-34 (KJV)'
        }
      ]
    },
    {
      id: 'lydia-purple',
      title: 'Lydia Believes',
      verse: 'And a certain woman named Lydia, a seller of purple, of the city of Thyatira, which worshipped God, heard us: whose heart the Lord opened, that she attended unto the things which were spoken of Paul. — Acts 16:14 (KJV)',
      lead: 'Four gentle panels that walk through Lydia Believes. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The Lord opens hearts to believe.',
      idea: 'The Lord opens hearts to believe.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lydia-purple-s1.svg',
          alt: 'Women gather to pray by the river',
          caption: 'And on the sabbath we went out of the city by a river side, where prayer was wont to be made; and we sat down, and spake unto the women which resorted thither.',
          verse: '“And on the sabbath we went out of the city by a river side, where prayer was wont to be made; and we sat down, and spake unto the women which resorted thither.” — Acts 16:13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/lydia-purple-s2.svg',
          alt: 'Lydia listens to Paul',
          caption: 'And a certain woman named Lydia, a seller of purple, of the city of Thyatira, which worshipped God, heard us: whose heart the Lord opened, that she attended unto the things which were spoken of Paul.',
          verse: '“And a certain woman named Lydia, a seller of purple, of the city of Thyatira, which worshipped God, heard us: whose heart the Lord opened, that she attended unto the things which were spoken of Paul.” — Acts 16:14 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/lydia-purple-s3.svg',
          alt: 'She is baptized with her household',
          caption: 'And when she was baptized, and her household, she besought us, saying, If ye have judged me to be faithful to the Lord, come into my house, and abide there. And she constrained us.',
          verse: '“And when she was baptized, and her household, she besought us, saying, If ye have judged me to be faithful to the Lord, come into my house, and abide there. And she constrained us.” — Acts 16:15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/lydia-purple-s4.svg',
          alt: 'Lydia welcomes Paul and Silas into her home',
          caption: 'And when she was baptized, and her household, she besought us, saying, If ye have judged me to be faithful to the Lord, come into my house, and abide there. And she constrained us.',
          verse: '“And when she was baptized, and her household, she besought us, saying, If ye have judged me to be faithful to the Lord, come into my house, and abide there. And she constrained us.” — Acts 16:15 (KJV)'
        }
      ]
    },
    {
      id: 'tabitha-dorcas',
      title: 'Tabitha Raised',
      verse: 'But Peter put them all forth, and kneeled down, and prayed; and turning him to the body said, Tabitha, arise. And she opened her eyes: and when she saw Peter, she sat up. — Acts 9:40 (KJV)',
      lead: 'Four gentle panels that walk through Tabitha Raised. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Kind deeds matter to God.',
      idea: 'Kind deeds matter to God.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/tabitha-dorcas-s1.svg',
          alt: 'Peter prays and Tabitha sits up; the widows show the coats she made',
          caption: 'Peter kneeled down, and prayed; and turning him to the body said, Tabitha, arise.',
          verse: '“But Peter put them all forth, and kneeled down, and prayed; and turning him to the body said, Tabitha, arise. And she opened her eyes: and when she saw Peter, she sat up.” — Acts 9:40 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/tabitha-dorcas-s2.svg',
          alt: 'She grows sick and dies',
          caption: 'And it came to pass in those days, that she was sick, and died: whom when they had washed, they laid her in an upper chamber.',
          verse: '“And it came to pass in those days, that she was sick, and died: whom when they had washed, they laid her in an upper chamber.” — Acts 9:37 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/tabitha-dorcas-s3.svg',
          alt: 'Peter kneels and prays',
          caption: 'But Peter put them all forth, and kneeled down, and prayed; and turning him to the body said, Tabitha, arise. And she opened her eyes: and when she saw Peter, she sat up.',
          verse: '“But Peter put them all forth, and kneeled down, and prayed; and turning him to the body said, Tabitha, arise. And she opened her eyes: and when she saw Peter, she sat up.” — Acts 9:40 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/tabitha-dorcas-s4.svg',
          alt: 'She is alive and many believe',
          caption: 'And he gave her his hand, and lifted her up, and when he had called the saints and widows, presented her alive. And it was known throughout all Joppa; and many believed in the Lord.',
          verse: '“And he gave her his hand, and lifted her up, and when he had called the saints and widows, presented her alive. And it was known throughout all Joppa; and many believed in the Lord.” — Acts 9:41-42 (KJV)'
        }
      ]
    },
    {
      id: 'nativity',
      title: 'The Nativity — Jesus Is Born',
      verse: 'For unto you is born this day in the city of David a Saviour, which is Christ the Lord. — Luke 2:11 (KJV)',
      lead: 'Four gentle panels that walk through The Nativity — Jesus Is Born. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus, our Savior, is born.',
      idea: 'Jesus, our Savior, is born.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/nativity-s1.svg',
          alt: 'Joseph and Mary go up to Bethlehem, the city of David',
          caption: 'And Joseph also went up from Galilee, out of the city of Nazareth, into Judaea, unto the city of David, which is called Bethlehem; (because he was of the house and lineage of David:)',
          verse: '“And Joseph also went up from Galilee, out of the city of Nazareth, into Judaea, unto the city of David, which is called Bethlehem; (because he was of the house and lineage of David:)” — Luke 2:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/nativity-s2.svg',
          alt: 'Baby Jesus in the manger',
          caption: 'The baby Jesus is laid in a manger.',
          verse: '“And she brought forth her firstborn son, and wrapped him in swaddling clothes, and laid him in a manger; because there was no room for them in the inn.” — Luke 2:7 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/nativity-s3.svg',
          alt: 'Angels announcing Jesus’ birth to shepherds',
          caption: 'Angels tell shepherds good tidings.',
          verse: '“And the angel said unto them, Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people.” — Luke 2:10 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/nativity-s4.svg',
          alt: 'Shepherds worshiping at the manger',
          caption: 'Shepherds find the child and glorify God.',
          verse: '“And the shepherds returned, glorifying and praising God for all the things that they had heard and seen, as it was told unto them.” — Luke 2:20 (KJV)'
        }
      ]
    },
    {
      id: 'paul-shipwreck',
      title: 'Paul & the Storm at Sea',
      verse: 'And the rest, some on boards, and some on broken pieces of the ship. And so it came to pass, that they escaped all safe to land. — Acts 27:44 (KJV)',
      lead: 'Four gentle panels that walk through Paul & the Storm at Sea. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God keeps His word in the storm.',
      idea: 'God keeps His word in the storm.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/paul-shipwreck-s1.svg',
          alt: 'A ship sails on the sea',
          caption: 'And entering into a ship of Adramyttium, we launched, meaning to sail by the coasts of Asia; one Aristarchus, a Macedonian of Thessalonica, being with us.',
          verse: '“And entering into a ship of Adramyttium, we launched, meaning to sail by the coasts of Asia; one Aristarchus, a Macedonian of Thessalonica, being with us.” — Acts 27:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/paul-shipwreck-s2.svg',
          alt: 'A violent storm batters the ship',
          caption: 'And when the ship was caught, and could not bear up into the wind, we let her drive.',
          verse: '“And when the ship was caught, and could not bear up into the wind, we let her drive.” — Acts 27:15 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/paul-shipwreck-s3.svg',
          alt: 'The ship breaks apart',
          caption: 'The shipmen deemed it expedient to cast four anchors.',
          verse: '“Then fearing lest we should have fallen upon rocks, they cast four anchors out of the stern, and wished for the day.” — Acts 27:29 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/paul-shipwreck-s4.svg',
          alt: 'Everyone reaches shore safely',
          caption: 'And the rest, some on boards, and some on broken pieces of the ship. And so it came to pass, that they escaped all safe to land.',
          verse: '“And the rest, some on boards, and some on broken pieces of the ship. And so it came to pass, that they escaped all safe to land.” — Acts 27:44 (KJV)'
        }
      ]
    },
    {
      id: 'rahab-spies',
      title: 'Rahab & the Spies',
      verse: 'Behold, when we come into the land, thou shalt bind this line of scarlet thread in the window which thou didst let us down by: and thou shalt bring thy father, and thy mother, and thy brethren, and all thy father’s household, home unto thee. — Joshua 2:18 (KJV)',
      lead: 'Four gentle panels that walk through Rahab & the Spies. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Faith can shelter God’s people.',
      idea: 'Faith can shelter God’s people.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/rahab-spies-s1.svg',
          alt: 'Two men come to the city wall',
          caption: 'And Joshua the son of Nun sent out of Shittim two men to spy secretly, saying, Go view the land, even Jericho. And they went, and came into an harlot’s house, named Rahab, and lodged there.',
          verse: '“And Joshua the son of Nun sent out of Shittim two men to spy secretly, saying, Go view the land, even Jericho. And they went, and came into an harlot’s house, named Rahab, and lodged there.” — Joshua 2:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/rahab-spies-s2.svg',
          alt: 'Rahab lets them down by a cord',
          caption: 'Then she let them down by a cord through the window: for her house was upon the town wall, and she dwelt upon the wall.',
          verse: '“Then she let them down by a cord through the window: for her house was upon the town wall, and she dwelt upon the wall.” — Joshua 2:15 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/rahab-spies-s3.svg',
          alt: 'The scarlet cord in the window',
          caption: 'Behold, when we come into the land, thou shalt bind this line of scarlet thread in the window which thou didst let us down by: and thou shalt bring thy father, and thy mother, and thy brethren, and all thy father’s household, home unto thee.',
          verse: '“Behold, when we come into the land, thou shalt bind this line of scarlet thread in the window which thou didst let us down by: and thou shalt bring thy father, and thy mother, and thy brethren, and all thy father’s household, home unto thee.” — Joshua 2:18 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/rahab-spies-s4.svg',
          alt: 'The men return safely to Joshua',
          caption: 'So the two men returned, and descended from the mountain, and passed over, and came to Joshua the son of Nun, and told him all things that befell them: And they said unto Joshua, Truly the LORD hath delivered into our hands all the land; for even all the inhabitants of the country do faint because of us.',
          verse: '“So the two men returned, and descended from the mountain, and passed over, and came to Joshua the son of Nun, and told him all things that befell them: And they said unto Joshua, Truly the LORD hath delivered into our hands all the land; for even all the inhabitants of the country do faint because of us.” — Joshua 2:23-24 (KJV)'
        }
      ]
    },
    {
      id: 'elijah-widow',
      title: 'Elijah & the Widow’s Oil',
      verse: 'For thus saith the LORD God of Israel, The barrel of meal shall not waste, neither shall the cruse of oil fail, until the day that the LORD sendeth rain upon the earth. — 1 Kings 17:14 (KJV)',
      lead: 'Four gentle panels that walk through Elijah & the Widow’s Oil. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God’s jar does not fail.',
      idea: 'God’s jar does not fail.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elijah-widow-s1.svg',
          alt: 'Elijah meets the widow gathering sticks',
          caption: 'So he arose and went to Zarephath. And when he came to the gate of the city, behold, the widow woman was there gathering of sticks: and he called to her, and said, Fetch me, I pray thee, a little water in a vessel, that I may drink. And as she was going to fetch it, he called to her, and said, Bring me, I pray thee, a morsel of bread in thine hand.',
          verse: '“So he arose and went to Zarephath. And when he came to the gate of the city, behold, the widow woman was there gathering of sticks: and he called to her, and said, Fetch me, I pray thee, a little water in a vessel, that I may drink. And as she was going to fetch it, he called to her, and said, Bring me, I pray thee, a morsel of bread in thine hand.” — 1 Kings 17:10-11 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-widow-s2.svg',
          alt: 'She makes a small cake first for Elijah',
          caption: 'And Elijah said unto her, Fear not; go and do as thou hast said: but make me thereof a little cake first, and bring it unto me, and after make for thee and for thy son.',
          verse: '“And Elijah said unto her, Fear not; go and do as thou hast said: but make me thereof a little cake first, and bring it unto me, and after make for thee and for thy son.” — 1 Kings 17:13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-widow-s3.svg',
          alt: 'Jars and the cruse of oil',
          caption: 'And the barrel of meal wasted not, neither did the cruse of oil fail, according to the word of the LORD, which he spake by Elijah.',
          verse: '“And the barrel of meal wasted not, neither did the cruse of oil fail, according to the word of the LORD, which he spake by Elijah.” — 1 Kings 17:16 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-widow-s4.svg',
          alt: 'God provides day after day',
          caption: 'For thus saith the LORD God of Israel, The barrel of meal shall not waste, neither shall the cruse of oil fail, until the day that the LORD sendeth rain upon the earth.',
          verse: '“For thus saith the LORD God of Israel, The barrel of meal shall not waste, neither shall the cruse of oil fail, until the day that the LORD sendeth rain upon the earth.” — 1 Kings 17:14 (KJV)'
        }
      ]
    },
    {
      id: 'philip-ethiopian',
      title: 'Philip & the Ethiopian',
      verse: 'And he commanded the chariot to stand still: and they went down both into the water, both Philip and the eunuch; and he baptized him. — Acts 8:38 (KJV)',
      lead: 'Four gentle panels that walk through Philip & the Ethiopian. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Scripture leads to Jesus.',
      idea: 'Scripture leads to Jesus.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/philip-ethiopian-s1.svg',
          alt: 'A chariot on the desert road',
          caption: 'And Philip ran thither to him, and heard him read the prophet Esaias, and said, Understandest thou what thou readest?',
          verse: '“And Philip ran thither to him, and heard him read the prophet Esaias, and said, Understandest thou what thou readest?” — Acts 8:30 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/philip-ethiopian-s2.svg',
          alt: 'Philip runs beside the chariot',
          caption: 'Then the Spirit said unto Philip, Go near, and join thyself to this chariot.',
          verse: '“Then the Spirit said unto Philip, Go near, and join thyself to this chariot.” — Acts 8:29 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/philip-ethiopian-s3.svg',
          alt: 'Philip opens the Scripture',
          caption: 'Then Philip opened his mouth, and began at the same scripture, and preached unto him Jesus.',
          verse: '“Then Philip opened his mouth, and began at the same scripture, and preached unto him Jesus.” — Acts 8:35 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/philip-ethiopian-s4.svg',
          alt: 'Baptism in the water',
          caption: 'And he commanded the chariot to stand still: and they went down both into the water, both Philip and the eunuch; and he baptized him. And when they were come up out of the water, the Spirit of the Lord caught away Philip, that the eunuch saw him no more: and he went on his way rejoicing.',
          verse: '“And he commanded the chariot to stand still: and they went down both into the water, both Philip and the eunuch; and he baptized him. And when they were come up out of the water, the Spirit of the Lord caught away Philip, that the eunuch saw him no more: and he went on his way rejoicing.” — Acts 8:38-39 (KJV)'
        }
      ]
    },
    {
      id: 'david-spares-saul',
      title: 'David Spares Saul',
      verse: 'And he said to David, Thou art more righteous than I: for thou hast rewarded me good, whereas I have rewarded thee evil. — 1 Samuel 24:17 (KJV)',
      lead: 'Four gentle panels that walk through David Spares Saul. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Mercy is stronger than revenge.',
      idea: 'Mercy is stronger than revenge.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/david-spares-saul-s1.svg',
          alt: 'Saul sleeps in the cave',
          caption: 'And he came to the sheepcotes by the way, where was a cave; and Saul went in to cover his feet: and David and his men remained in the sides of the cave.',
          verse: '“And he came to the sheepcotes by the way, where was a cave; and Saul went in to cover his feet: and David and his men remained in the sides of the cave.” — 1 Samuel 24:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/david-spares-saul-s2.svg',
          alt: 'David cuts the skirt of Saul’s robe',
          caption: 'And the men of David said unto him, Behold the day of which the LORD said unto thee, Behold, I will deliver thine enemy into thine hand, that thou mayest do to him as it shall seem good unto thee. Then David arose, and cut off the skirt of Saul’s robe privily. And it came to pass afterward, that David’s heart smote him, because he had cut off Saul’s skirt. And he said unto his men, The LORD forbid that I should do this thing unto my master, the LORD’s anointed, to stretch forth mine hand against him, seeing he is the anointed of the LORD.',
          verse: '“And the men of David said unto him, Behold the day of which the LORD said unto thee, Behold, I will deliver thine enemy into thine hand, that thou mayest do to him as it shall seem good unto thee. Then David arose, and cut off the skirt of Saul’s robe privily. And it came to pass afterward, that David’s heart smote him, because he had cut off Saul’s skirt. And he said unto his men, The LORD forbid that I should do this thing unto my master, the LORD’s anointed, to stretch forth mine hand against him, seeing he is the anointed of the LORD.” — 1 Samuel 24:4-6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/david-spares-saul-s3.svg',
          alt: 'David shows Saul the piece of robe',
          caption: 'Moreover, my father, see, yea, see the skirt of thy robe in my hand: for in that I cut off the skirt of thy robe, and killed thee not, know thou and see that there is neither evil nor transgression in mine hand, and I have not sinned against thee; yet thou huntest my soul to take it.',
          verse: '“Moreover, my father, see, yea, see the skirt of thy robe in my hand: for in that I cut off the skirt of thy robe, and killed thee not, know thou and see that there is neither evil nor transgression in mine hand, and I have not sinned against thee; yet thou huntest my soul to take it.” — 1 Samuel 24:11 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/david-spares-saul-s4.svg',
          alt: 'Saul weeps and goes home',
          caption: 'And it came to pass, when David had made an end of speaking these words unto Saul, that Saul said, Is this thy voice, my son David? And Saul lifted up his voice, and wept.',
          verse: '“And it came to pass, when David had made an end of speaking these words unto Saul, that Saul said, Is this thy voice, my son David? And Saul lifted up his voice, and wept.” — 1 Samuel 24:16 (KJV)'
        }
      ]
    },
    {
      id: 'll-honesty',
      title: 'Life Lesson — Walk in Honesty',
      verse: 'Lying lips are abomination to the LORD: but they that deal truly are his delight. — Proverbs 12:22',
      lead: 'Two gentle panels. Color each one, save as you go (one panel is enough), then Watch My Story. One big idea: Truth is a kind of love.',
      idea: 'Truth is a kind of love.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ll-honesty-s1.svg',
          alt: 'Children learning to speak truth kindly',
          caption: 'Speak truth with a gentle heart.',
          verse: '“But speaking the truth in love, may grow up into him in all things, which is the head, even Christ:” — Ephesians 4:15 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ll-honesty-s2.svg',
          alt: 'A calm conversation after a hard moment',
          caption: 'A soft answer turns away wrath.',
          verse: '“A soft answer turneth away wrath: but grievous words stir up anger.” — Proverbs 15:1 (KJV)'
        }
      ]
    },
    {
      id: 'll-commandments',
      title: 'Life Lesson — Love God & Neighbor',
      verse: 'On these two commandments hang all the law and the prophets. — Matthew 22:40',
      lead: 'Two gentle panels. Color each one, save as you go (one panel is enough), then Watch My Story. One big idea: Love God; love your neighbor.',
      idea: 'Love God; love your neighbor.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ll-commandments-s1.svg',
          alt: 'Children looking up in love toward God',
          caption: 'Love the Lord with all your heart.',
          verse: '“Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind.” — Matthew 22:37 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ll-commandments-s2.svg',
          alt: 'Children helping one another with kind hands',
          caption: 'Love your neighbor as yourself.',
          verse: '“And the second is like unto it, Thou shalt love thy neighbour as thyself.” — Matthew 22:39 (KJV)'
        }
      ]
    }
  ];

  // Point every story at real line-art (JPG/detailed SVG); collapse hero-only sets.
  applyRealColoringArt();

  function storageKey(storyId, sceneId) {
    return STORAGE_PREFIX + storyId + ':' + sceneId;
  }

  function clearStorySnapshots(story) {
    for (var i = 0; i < story.scenes.length; i++) {
      try {
        localStorage.removeItem(storageKey(story.id, story.scenes[i].id));
      } catch (e) {}
    }
  }

  function clearJlStrokesInSection(sectionEl) {
    var books = sectionEl.querySelectorAll('jl-coloringbook');
    books.forEach(function (jlEl) {
      var root = jlEl.shadowRoot;
      if (!root) return;
      var cb = root.querySelector('.clearButton');
      if (cb) cb.click();
    });
  }

  function clearAllColorTellStorage() {
    var keys = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(STORAGE_PREFIX) === 0) keys.push(k);
      }
      for (var j = 0; j < keys.length; j++) {
        localStorage.removeItem(keys[j]);
      }
    } catch (e) {}
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
    jl.setAttribute('css', '/kids/jl-coloringbook-tdb.css?v=32fill');
    var im = document.createElement('img');
    im.src = bestSceneSrc(scene);
    im.alt = scene.alt || scene.caption || '';
    im.decoding = 'async';
    im.loading = 'eager';
    jl.appendChild(im);
    for (var c = 0; c < PALETTE.length; c++) {
      var italic = document.createElement('i');
      italic.setAttribute('color', PALETTE[c]);
      jl.appendChild(italic);
    }
    return jl;
  }

  /**
   * Mount the heavy coloring tool only when a scene is actually shown.
   * Avoids loading 80+ full-page JPGs + shadow-DOM books on first paint.
   */
  function ensureSceneJl(panel) {
    if (!panel || panel._tdbJl) return panel._tdbJl;
    var wrap = panel.querySelector('.tdb-cat-jl-wrap');
    if (!wrap) return null;
    var scene = panel._tdbScene;
    if (!scene) return null;
    var placeholder = wrap.querySelector('.tdb-cat-jl-placeholder');
    var jl = createJl(scene);
    panel._tdbJl = jl;
    wrap.textContent = '';
    wrap.appendChild(jl);
    if (placeholder) {
      /* removed with textContent clear */
    }
    return jl;
  }

  function getPanelJl(panel) {
    return panel && panel._tdbJl ? panel._tdbJl : ensureSceneJl(panel);
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

  function replaySlideshowFromStart() {
    if (!show.slides.length) return;
    show.index = 0;
    renderSlide();
    stopAutoplay();
    startAutoplayIfNeeded();
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
    if (!slides.length) {
      window.alert('Save at least one scene first—then you can watch your story.');
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
    var verse = document.createElement('span');
    verse.className = 'tdb-cat-slideshow-verse';
    var capMain = document.createElement('span');
    capMain.className = 'tdb-cat-slideshow-cap-main';
    cap.appendChild(verse);
    cap.appendChild(capMain);
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
    var replayB = document.createElement('button');
    replayB.type = 'button';
    replayB.className = 'tdb-cat-slideshow-replay';
    replayB.textContent = 'First picture again';
    replayB.setAttribute(
      'aria-label',
      'Go back to the first picture in this slideshow'
    );

    nav.appendChild(prevB);
    nav.appendChild(replayB);
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
    replayB.addEventListener('click', function () {
      replaySlideshowFromStart();
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
      if (p.done >= 1) {
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

  /** Thumbnail src for a story card (first scene art; lazy-loaded by the browser). */
  function storyThumbSrc(story) {
    if (!story || !story.scenes || !story.scenes.length) return '';
    return bestSceneSrc(story.scenes[0]) || '';
  }

  var showColorStoryFn = null;

  function jumpToColorStory(storyId) {
    if (!storyId) return;
    if (typeof showColorStoryFn === 'function') {
      showColorStoryFn(storyId, { scroll: true, smooth: true });
    }
  }

  /**
   * Story-library-style picture grid: one thumbnail card per coloring story.
   */
  function refreshProgressCards(container) {
    container.textContent = '';
    container.classList.add('tdb-cat-story-grid');
    for (var s = 0; s < STORIES.length; s++) {
      var story = STORIES[s];
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'tdb-cat-progress-card tdb-cat-story-grid-card';
      card.setAttribute('data-tdb-jump-story', story.id);

      var thumbWrap = document.createElement('span');
      thumbWrap.className = 'tdb-cat-story-grid-thumb-wrap';
      thumbWrap.setAttribute('aria-hidden', 'true');
      var src = storyThumbSrc(story);
      if (src) {
        var img = document.createElement('img');
        img.className = 'tdb-cat-story-grid-thumb';
        img.src = src;
        img.alt = '';
        img.setAttribute('alt', '');
        img.loading = s < 8 ? 'eager' : 'lazy';
        img.decoding = 'async';
        img.width = 280;
        img.height = 224;
        img.addEventListener('error', function () {
          this.style.display = 'none';
          var badge = this.parentNode && this.parentNode.querySelector('.tdb-cat-progress-card-badge');
          if (badge) badge.hidden = false;
        });
        thumbWrap.appendChild(img);
      }
      var badge = document.createElement('span');
      badge.className = 'tdb-cat-progress-card-thumb tdb-cat-progress-card-badge';
      badge.textContent = (story.title || '?').charAt(0);
      if (src) badge.hidden = true;
      thumbWrap.appendChild(badge);

      var st = statusLabel(story);
      card.setAttribute(
        'aria-label',
        (story.title || 'Story') + ' — ' + st.text + ' — open to color'
      );

      var title = document.createElement('p');
      title.className = 'tdb-cat-progress-card-title tdb-cat-story-grid-title';
      title.textContent = story.title;

      card.appendChild(thumbWrap);
      card.appendChild(title);
      card.addEventListener('click', function () {
        jumpToColorStory(this.getAttribute('data-tdb-jump-story'));
      });
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
      if (on) ensureSceneJl(panels[i]);
    }
  }

  function normalizeStoryQuery(raw) {
    if (!raw) return '';
    var val = String(raw).trim().toLowerCase();
    if (!val) return '';
    if (STORY_QUERY_ALIASES[val]) return STORY_QUERY_ALIASES[val];
    var compact = val.replace(/[^a-z0-9]+/g, '');
    if (STORY_QUERY_ALIASES[compact]) return STORY_QUERY_ALIASES[compact];
    for (var i = 0; i < STORIES.length; i++) {
      if (STORIES[i].id === val) return val;
    }
    for (var j = 0; j < STORIES.length; j++) {
      if (STORIES[j].id.replace(/[^a-z0-9]+/g, '') === compact) return STORIES[j].id;
    }
    return '';
  }

  function getStoryMetaById(storyId) {
    if (!storyId) return null;
    for (var i = 0; i < STORIES.length; i++) {
      if (STORIES[i].id === storyId) return STORIES[i];
    }
    return null;
  }

  function renderStoryBridge(target, storyMeta, handoffMeta) {
    if (!target) return;
    target.innerHTML = '';
    var storyBridgeNote = document.createElement('p');
    storyBridgeNote.className = 'section-note';
    var noteStrong = document.createElement('strong');
    noteStrong.textContent = 'Now coloring:';
    storyBridgeNote.appendChild(noteStrong);
    storyBridgeNote.appendChild(document.createTextNode(' ' + (storyMeta ? storyMeta.title : 'This story') + '. Save one scene, then step back into the story when you are ready.'));
    target.appendChild(storyBridgeNote);
    var storyBridgeActions = document.createElement('div');
    storyBridgeActions.className = 'cta-group';
    var storyLink = document.createElement('a');
    storyLink.className = 'btn btn-secondary';
    storyLink.href = handoffMeta && handoffMeta.storyHref
      ? handoffMeta.storyHref
      : '/kids/corner.html';
    storyLink.textContent = 'Back to the story';
    storyBridgeActions.appendChild(storyLink);
    if (handoffMeta && handoffMeta.sourceHref) {
      var sourceLink = document.createElement('a');
      sourceLink.className = 'btn btn-secondary';
      sourceLink.href = handoffMeta.sourceHref;
      sourceLink.textContent = handoffMeta.sourceLabel || 'Back to the family lane';
      storyBridgeActions.appendChild(sourceLink);
    }
    target.appendChild(storyBridgeActions);
    if (target.hidden) target.hidden = false;
  }

  function init() {
    var requestedStoryId = '';
    var gentleStoryKey = '';
    var gentleNextKey = '';
    try {
      var params = new URLSearchParams(window.location.search || '');
      requestedStoryId = normalizeStoryQuery(params.get('story'));
      gentleStoryKey = String(params.get('gentleStory') || '').trim();
      if (
        params.get('gentle') === '1' &&
        window.TDB_GENTLE_JOURNEY &&
        typeof window.TDB_GENTLE_JOURNEY.hasKey === 'function' &&
        window.TDB_GENTLE_JOURNEY.hasKey(gentleStoryKey)
      ) {
        gentleNextKey = window.TDB_GENTLE_JOURNEY.getNextKey(gentleStoryKey) || '';
      } else {
        gentleStoryKey = '';
      }
    } catch (e) {
      requestedStoryId = '';
      gentleStoryKey = '';
      gentleNextKey = '';
    }
    var requestedStorySection = null;

    var mount = document.getElementById('tdb-cat-root');
    if (!mount) return;

    mount.setAttribute('aria-label', 'Color and tell my story');

    var progressOuter = document.createElement('div');
    progressOuter.className = 'tdb-cat-progress-outer tdb-cat-story-grid-outer';

    var progressWrap = document.createElement('div');
    progressWrap.className = 'tdb-cat-progress tdb-cat-story-grid';
    progressWrap.setAttribute('role', 'region');
    progressWrap.setAttribute('aria-labelledby', 'tdb-cat-choose-h');
    progressWrap.setAttribute('aria-label', 'Coloring story pictures');
    progressWrap.tabIndex = 0;

    var gridLead = document.createElement('p');
    gridLead.className = 'section-note tdb-cat-story-grid-lead';
    gridLead.textContent = STORIES.length + ' Bible stories to color.';

    progressOuter.appendChild(gridLead);
    progressOuter.appendChild(progressWrap);
    mount.appendChild(progressOuter);
    if (requestedStoryId) {
      var storyMeta = getStoryMetaById(requestedStoryId);
      var handoffMeta = STORY_RETURN_HANDOFFS[requestedStoryId] || null;
      var topStoryBridge = document.getElementById('tdb-cat-story-bridge-top');
      if (topStoryBridge) {
        renderStoryBridge(topStoryBridge, storyMeta, handoffMeta);
      } else {
        var storyBridge = document.createElement('div');
        storyBridge.className = 'tdb-cat-story-bridge';
        renderStoryBridge(storyBridge, storyMeta, handoffMeta);
        mount.appendChild(storyBridge);
      }
    }
    if (gentleStoryKey) {
      var gentleNote = document.createElement('div');
      gentleNote.className = 'cta-group';
      var currentLink = document.createElement('a');
      currentLink.className = 'btn btn-secondary';
      currentLink.href = '/kids/corner.html?story=' + encodeURIComponent(gentleStoryKey) + '&gentle=1';
      currentLink.textContent = 'Back to this gentle story';
      gentleNote.appendChild(currentLink);
      if (gentleNextKey) {
        var nextLink = document.createElement('a');
        nextLink.className = 'btn btn-primary';
        nextLink.href = '/kids/corner.html?story=' + encodeURIComponent(gentleNextKey) + '&gentle=1';
        nextLink.textContent = 'Open next gentle story';
        gentleNote.appendChild(nextLink);
      }
      mount.appendChild(gentleNote);
    }

    var clearAllWrap = document.createElement('div');
    clearAllWrap.className = 'tdb-cat-clear-all-wrap';
    var clearAllBtn = document.createElement('button');
    clearAllBtn.type = 'button';
    clearAllBtn.className = 'btn btn-secondary tdb-cat-clear-all';
    clearAllBtn.textContent = 'Clear saved stories';
    clearAllBtn.setAttribute(
      'aria-label',
      'Remove all Color and Tell saved pictures on this device and reload the page'
    );
    clearAllBtn.addEventListener('click', function () {
      if (
        !window.confirm(
          'Remove every Color & Tell saved picture on this device? The page will refresh so the coloring tools reset too.'
        )
      ) {
        return;
      }
      clearAllColorTellStorage();
      window.location.reload();
    });
    clearAllWrap.appendChild(clearAllBtn);
    mount.appendChild(clearAllWrap);

    buildSlideshowShell();

    function refreshAllProgress() {
      refreshProgressCards(progressWrap);
    }

    var storyIo = null;
    if (typeof IntersectionObserver === 'function') {
      storyIo = new IntersectionObserver(
        function (entries) {
          for (var ei = 0; ei < entries.length; ei++) {
            if (!entries[ei].isIntersecting) continue;
            var vis = entries[ei].target;
            if (vis.hidden) continue;
            var near =
              vis.querySelector('.tdb-cat-panel:not([hidden])') ||
              vis.querySelector('.tdb-cat-panel');
            if (near) ensureSceneJl(near);
          }
        },
        { root: null, rootMargin: '120px 0px', threshold: 0.05 }
      );
    }

    function buildStorySection(story) {
        var section = document.createElement('section');
        section.className = 'tdb-cat-story';
        if (story.scenes.length === 1) {
          section.classList.add('is-single-scene');
        }
        section.setAttribute('data-tdb-story', story.id);

        var h2 = document.createElement('h2');
        h2.className = 'tdb-cat-story-title';
        h2.tabIndex = -1;
        h2.textContent = story.title;

        var lead = document.createElement('p');
        lead.className = 'tdb-cat-story-lead';
        lead.textContent = story.lead;

        var celebrate = document.createElement('p');
        celebrate.className = 'tdb-cat-story-celebrate';
        celebrate.setAttribute('role', 'status');

        var hearBtn = document.createElement('button');
        hearBtn.type = 'button';
        hearBtn.className = 'btn btn-secondary tdb-cat-hear-story no-print';
        hearBtn.textContent = 'Hear the story';
        hearBtn.setAttribute('aria-pressed', 'false');
        hearBtn.setAttribute(
          'aria-label',
          'Hear the story of ' + story.title + ' while you color, read by a male storyteller. Nothing is uploaded.'
        );
        hearBtn.addEventListener('click', function () {
          playStoryListen(story, hearBtn);
        });

        var listenText = COLORING_LISTEN[story.id] || '';
        var listenWrap = null;
        if (listenText) {
          listenWrap = document.createElement('details');
          listenWrap.className = 'tdb-cat-listen-story';
          var listenSum = document.createElement('summary');
          listenSum.textContent = 'The story you hear';
          var listenP = document.createElement('p');
          listenP.textContent = listenText;
          listenWrap.appendChild(listenSum);
          listenWrap.appendChild(listenP);
        }

        var isSingle = story.scenes.length === 1;
        var tablist = null;
        if (!isSingle) {
          tablist = document.createElement('div');
          tablist.className = 'tdb-cat-tabs';
          tablist.setAttribute('role', 'tablist');
          tablist.setAttribute('aria-label', story.title + ' scenes');
        }

        var panelsWrap = document.createElement('div');
        panelsWrap.className = 'tdb-cat-panels' + (isSingle ? ' tdb-cat-single-panel' : '');

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
            // Short tab label: "1 · caption snippet" so kids see the story beat
            var tabCap = (sc.caption || '').trim();
            if (tabCap.length > 28) tabCap = tabCap.slice(0, 26) + '…';
            tab.textContent = tabCap
              ? sceneIdx + 1 + ' · ' + tabCap
              : 'Scene ' + (sceneIdx + 1);
            tab.title = sc.caption || 'Scene ' + (sceneIdx + 1);
            tab.addEventListener('click', function () {
              selectTab(story, sceneIdx, section);
            });
            if (tablist) {
              tablist.appendChild(tab);
            }

            var panel = document.createElement('div');
            panel.className = 'tdb-cat-panel';
            panel.id = 'panel-' + story.id + '-' + sc.id;
            panel.setAttribute('role', 'tabpanel');
            if (tablist) {
              panel.setAttribute('aria-labelledby', 'tab-' + story.id + '-' + sc.id);
            }
            panel.hidden = sceneIdx !== 0;

            var storyCard = buildSceneStoryCard(
              story,
              sc,
              sceneIdx,
              story.scenes.length
            );

            // Defer heavy jl-coloringbook until the panel is shown (ensureSceneJl).
            panel._tdbScene = sc;
            var jlBox = document.createElement('div');
            jlBox.className = 'tdb-cat-jl-wrap kids-gold-frame';
            var jlPlaceholder = document.createElement('p');
            jlPlaceholder.className = 'tdb-cat-jl-placeholder section-note';
            jlPlaceholder.textContent = 'Tap this story to load the coloring page…';
            jlBox.appendChild(jlPlaceholder);

            var verseStrip = buildVerseStrip(sc.verse || story.verse);

            var printBtn = document.createElement('button');
            printBtn.type = 'button';
            printBtn.className = 'no-print kids-print-btn';
            printBtn.textContent = 'Print this scene';
            printBtn.setAttribute('aria-label', 'Print coloring page with KJV verse');
            printBtn.addEventListener('click', function () {
              ensureSceneJl(panel);
              window.printColoringScene();
            });

            var saveBtn = document.createElement('button');
            saveBtn.type = 'button';
            saveBtn.className = 'btn btn-primary tdb-cat-save-scene no-print';
            saveBtn.textContent = 'Save this scene to My Story';

            var msg = document.createElement('p');
            msg.className = 'tdb-cat-scene-saved-msg no-print';
            if (getSaved(story.id, sc.id)) {
              msg.textContent = 'Saved on this device — you can change it anytime.';
            }

            saveBtn.addEventListener('click', function () {
              var jl = getPanelJl(panel);
              if (!jl || typeof jl.exportCompositePng !== 'function') {
                window.alert('Coloring is still loading. Wait a moment, then try again.');
                return;
              }
              jl.exportCompositePng()
                .then(function (png) {
                  if (!png) {
                    window.alert(
                      'Picture is not ready yet. Try again in a second.'
                    );
                    return null;
                  }
                  // Keep story title + caption + KJV under the saved picture.
                  return compositeStoryTextUnderImage(png, story, sc);
                })
                .then(function (pngWithText) {
                  if (!pngWithText) return null;
                  return pngToJpeg(pngWithText, JPEG_QUALITY);
                })
                .then(function (jpeg) {
                  if (!jpeg) return;
                  try {
                    setSaved(story.id, sc.id, jpeg);
                  } catch (err) {
                    if (err && err.name === 'QuotaExceededError') {
                      window.alert(
                        'This device ran out of save space. Tap “Clear saved stories” under the progress cards, or ask a grown-up to free browser storage.'
                      );
                    } else {
                      window.alert('That did not save. Try again.');
                    }
                    return;
                  }
                  msg.textContent = 'Saved! This scene is in your story.';
                  refreshAllProgress();
                  updateStoryUI(story, section, watchBtn, celebrate);
                })
                .catch(function () {
                  window.alert('Picture did not save. Try again.');
                });
            });

            panel.appendChild(storyCard);
            panel.appendChild(jlBox);
            panel.appendChild(verseStrip);
            panel.appendChild(printBtn);
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

        var startOverBtn = document.createElement('button');
        startOverBtn.type = 'button';
        startOverBtn.className = 'btn btn-secondary tdb-cat-start-over';
        startOverBtn.textContent = 'Start this story over';
        startOverBtn.setAttribute(
          'aria-label',
          'Clear saved pictures and coloring for ' + story.title + ' on this device'
        );
        startOverBtn.addEventListener('click', function () {
          if (
            !window.confirm(
              'Clear all saved scenes for ' +
                story.title +
                ' on this device? Coloring on each scene will reset too.'
            )
          ) {
            return;
          }
          stopStoryListen();
          clearStorySnapshots(story);
          clearJlStrokesInSection(section);
          section.querySelectorAll('.tdb-cat-scene-saved-msg').forEach(function (m) {
            m.textContent = '';
          });
          selectTab(story, 0, section);
          refreshAllProgress();
          updateStoryUI(story, section, watchBtn, celebrate);
        });

        var printBoardBtn = document.createElement('button');
        printBoardBtn.type = 'button';
        printBoardBtn.className = 'btn btn-secondary tdb-cat-print-storyboard no-print';
        printBoardBtn.textContent =
          story.scenes.length >= 2 ? 'Print storyboard' : 'Print this story';
        printBoardBtn.setAttribute(
          'aria-label',
          'Print a blank storyboard page for ' + story.title + ' with short KJV lines'
        );
        printBoardBtn.addEventListener('click', function () {
          printStoryboard(story);
        });

        var actions = document.createElement('div');
        actions.className = 'tdb-cat-story-actions';
        actions.appendChild(watchBtn);
        actions.appendChild(printBoardBtn);
        actions.appendChild(startOverBtn);

        section.appendChild(h2);
        section.appendChild(lead);
        section.appendChild(hearBtn);
        if (listenWrap) section.appendChild(listenWrap);
        section.appendChild(celebrate);
        if (tablist) {
          section.appendChild(tablist);
        }
        section.appendChild(panelsWrap);
        section.appendChild(actions);
        if (story.idea) {
          var ideaNote = document.createElement('p');
          ideaNote.className = 'section-note tdb-cat-story-idea';
          ideaNote.textContent = 'One big idea: ' + story.idea;
          section.appendChild(ideaNote);
        }

        var hint = document.createElement('p');
        hint.className = 'section-note';
        hint.id = 'tdb-cat-watch-hint-' + story.id;
        hint.textContent =
          'Hear the story while you color. Watch the scenes you’ve saved — one is enough. More panels make a fuller storyboard.';
        section.appendChild(hint);

        mount.appendChild(section);
        updateStoryUI(story, section, watchBtn, celebrate);
        if (storyIo) storyIo.observe(section);
        return section;
    }

    function showOneColorStory(storyId, opts) {
      var story = getStoryMetaById(storyId);
      if (!story) return null;
      opts = opts || {};
      try {
        stopStoryListen();
      } catch (_stop) { /* no-op */ }
      var sec = mount.querySelector('.tdb-cat-story[data-tdb-story="' + story.id + '"]');
      if (!sec) {
        sec = buildStorySection(story);
      }
      mount.querySelectorAll('.tdb-cat-story').forEach(function (other) {
        if (other === sec) return;
        other.hidden = true;
        other.classList.add('tdb-cat-story--deferred');
      });
      sec.hidden = false;
      sec.classList.remove('tdb-cat-story--deferred');
      var prevStart = document.getElementById('tdb-cat-story-start');
      if (prevStart && prevStart !== sec) prevStart.removeAttribute('id');
      sec.id = 'tdb-cat-story-start';
      if (progressOuter && progressOuter.parentNode) {
        progressOuter.parentNode.insertBefore(sec, progressOuter);
      }
      gridLead.textContent =
        'Or pick another picture below. ' + STORIES.length + ' Bible stories.';
      var panel =
        sec.querySelector('.tdb-cat-panel:not([hidden])') ||
        sec.querySelector('.tdb-cat-panel');
      if (panel) ensureSceneJl(panel);
      if (opts.scroll && typeof sec.scrollIntoView === 'function') {
        sec.scrollIntoView({
          behavior: opts.smooth ? 'smooth' : 'auto',
          block: 'start'
        });
      }
      if (opts.focusTitle) {
        try {
          var titleEl = sec.querySelector('.tdb-cat-story-title');
          if (titleEl && typeof titleEl.focus === 'function') {
            titleEl.focus({ preventScroll: true });
          }
        } catch (_f) { /* no-op */ }
      }
      return sec;
    }

    showColorStoryFn = showOneColorStory;

    refreshAllProgress();
    if (requestedStoryId) {
      requestedStorySection = showOneColorStory(requestedStoryId, {
        scroll: true,
        smooth: false,
        focusTitle: true
      });
    }
  }

  function boot() {
    fetch('/kids/data/coloring-listen.json?v=' + LISTEN_AUDIO_VERSION)
      .then(function (r) {
        return r.ok ? r.json() : {};
      })
      .then(function (j) {
        COLORING_LISTEN = (j && j.hear) || {};
        init();
      })
      .catch(function () {
        init();
      });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
