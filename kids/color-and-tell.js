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
      return { quote: m[1].trim(), ref: m[2].trim() };
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
  "/coloring-pages/david-s1.svg": "/coloring-pages/bible-stories/david-and-goliath-v2.jpg",
  "/coloring-pages/david-s2.svg": "/coloring-pages/bible-stories/david-and-goliath-v2.jpg",
  "/coloring-pages/david-s3.svg": "/coloring-pages/bible-stories/david-and-goliath-v2.jpg",
  "/coloring-pages/david-s4.svg": "/coloring-pages/bible-stories/david-and-goliath-v2.jpg",
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
  "/coloring-pages/jesus-children-s1.svg": "/coloring-pages/bible-stories/jesus-and-the-children-coloring-page.jpg",
  "/coloring-pages/jesus-children-s2.svg": "/coloring-pages/bible-stories/jesus-and-the-children-coloring-page.jpg",
  "/coloring-pages/jesus-children-s3.svg": "/coloring-pages/bible-stories/jesus-and-the-children-coloring-page.jpg",
  "/coloring-pages/jesus-children-s4.svg": "/coloring-pages/bible-stories/jesus-and-the-children-coloring-page.jpg",
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
  "/coloring-pages/lydia-purple-s1.svg": "/coloring-pages/lydia-purple.jpg",
  "/coloring-pages/lydia-purple-s2.svg": "/coloring-pages/lydia-purple.jpg",
  "/coloring-pages/lydia-purple-s3.svg": "/coloring-pages/lydia-purple.jpg",
  "/coloring-pages/lydia-purple-s4.svg": "/coloring-pages/lydia-purple.jpg",
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
  "/coloring-pages/rahab-spies-s1.svg": "/coloring-pages/rahab-spies.jpg",
  "/coloring-pages/rahab-spies-s2.svg": "/coloring-pages/rahab-spies.jpg",
  "/coloring-pages/rahab-spies-s3.svg": "/coloring-pages/rahab-spies.jpg",
  "/coloring-pages/rahab-spies-s4.svg": "/coloring-pages/rahab-spies.jpg",
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
  function bestSceneSrc(scene) {
    if (!scene || !scene.src) return '';
    return (TDB_SCENE_ART && TDB_SCENE_ART[scene.src]) || scene.src;
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
      verse: 'And God saw every thing that he had made, and, behold, it was very good. — Genesis 1:31 (KJV)',
      lead: 'Four gentle panels that walk through Creation. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God made everything good.',
      idea: 'God made everything good.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/creation-s1.svg',
          alt: 'God speaks light into the dark on the first day of Creation',
          caption: 'God speaks light into the dark.',
          verse: '“Let there be light.” — Genesis 1:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/creation-s2.svg',
          alt: 'Sky, seas, and dry land take shape as God makes a home for life',
          caption: 'Sky, seas, and land — God shapes a home.',
          verse: '“God called the dry land Earth.” — Genesis 1:10 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/creation-s3.svg',
          alt: 'Sun, moon, and living creatures fill the world God made',
          caption: 'Sun, moon, and living creatures fill the world.',
          verse: '“And God made two great lights.” — Genesis 1:16 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/creation-s4.svg',
          alt: 'People made in God’s image and a world that is very good',
          caption: 'People in His image; God rests — it is very good.',
          verse: '“Behold, it was very good.” — Genesis 1:31 (KJV)'
        }
      ]
    },
    {
      id: 'baby-moses',
      title: 'Baby Moses',
      verse: 'And the child grew, and she brought him unto Pharaoh\'s daughter, and he became her son. — Exodus 2:10 (KJV)',
      lead: 'Four gentle panels that walk through Baby Moses. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God watches over little ones.',
      idea: 'God watches over little ones.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/baby-moses-s1.svg',
          alt: 'Moses’ mother hiding baby Moses',
          caption: 'A mother hides her baby boy.',
          verse: '“She hid him three months.” — Exodus 2:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/baby-moses-s2.svg',
          alt: 'Baby Moses in a basket by the river',
          caption: 'The ark of bulrushes is laid by the river.',
          verse: '“She laid it in the flags by the river’s brink.” — Exodus 2:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/baby-moses-s3.svg',
          alt: 'Pharaoh’s daughter finding baby Moses',
          caption: 'Pharaoh’s daughter finds the child.',
          verse: '“And when she had opened it, she saw the child.” — Exodus 2:6 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/baby-moses-s4.svg',
          alt: 'Young Moses under Pharaoh’s daughter’s care',
          caption: 'Moses grows in Pharaoh’s house.',
          verse: '“And the child grew… and he became her son.” — Exodus 2:10 (KJV)'
        }
      ]
    },
    {
      id: 'moses-red-sea',
      title: 'Moses and the Red Sea',
      verse: 'And the children of Israel walked upon dry land in the midst of the sea. — Exodus 14:29 (KJV)',
      lead: 'Four gentle panels that walk through Moses and the Red Sea. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God makes a way when there seems none.',
      idea: 'God makes a way when there seems none.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/moses-red-sea-s1.svg',
          alt: 'Israel camped by the Red Sea',
          caption: 'Israel stands between the sea and Pharaoh.',
          verse: '“Fear ye not, stand still, and see the salvation of the LORD.” — Exodus 14:13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/moses-red-sea-s2.svg',
          alt: 'Moses stretching his rod over the sea',
          caption: 'Moses stretches out his hand.',
          verse: '“Lift thou up thy rod… and stretch out thine hand over the sea.” — Exodus 14:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/moses-red-sea-s3.svg',
          alt: 'Israel walking through the parted Red Sea',
          caption: 'The waters part; they walk on dry ground.',
          verse: '“And the children of Israel went into the midst of the sea upon the dry ground.” — Exodus 14:22 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/moses-red-sea-s4.svg',
          alt: 'Israel safe on the other side of the sea',
          caption: 'God delivers His people.',
          verse: '“Thus the LORD saved Israel that day.” — Exodus 14:30 (KJV)'
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
          verse: '“But Jonah rose up to flee unto Tarshish.” — Jonah 1:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jonah-s2.svg',
          alt: 'Jonah cast into the stormy sea',
          caption: 'A great storm; Jonah is cast into the sea.',
          verse: '“So they took up Jonah, and cast him forth into the sea.” — Jonah 1:15 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jonah-s3.svg',
          alt: 'Jonah and the great fish',
          caption: 'A great fish swallows Jonah.',
          verse: '“The LORD had prepared a great fish to swallow up Jonah.” — Jonah 1:17 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jonah-s4.svg',
          alt: 'Jonah on dry land after the great fish',
          caption: 'Jonah prays; God brings him to dry land.',
          verse: '“And the LORD spake unto the fish, and it vomited out Jonah.” — Jonah 2:10 (KJV)'
        }
      ]
    },
    {
      id: 'noah',
      title: 'Noah and the Ark',
      verse: 'And God remembered Noah, and every living thing... and God made a wind to pass over the earth. — Genesis 8:1 (KJV)',
      lead: 'Four gentle panels that walk through Noah and the Ark. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God keeps His promises.',
      idea: 'God keeps His promises.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/noah-s1.svg',
          alt: 'Noah building the ark',
          caption: 'God tells Noah to build an ark.',
          verse: '“Make thee an ark of gopher wood.” — Genesis 6:14 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/noah-s2.svg',
          alt: 'Animals entering Noah’s ark',
          caption: 'Animals come two by two.',
          verse: '“There went in two and two unto Noah into the ark.” — Genesis 7:9 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/noah-s3.svg',
          alt: 'The ark on the waters; God remembers Noah',
          caption: 'The flood covers the earth; God remembers Noah.',
          verse: '“And God remembered Noah.” — Genesis 8:1 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/noah-s4.svg',
          alt: 'Noah sees the rainbow after the flood',
          caption: 'A rainbow — God’s covenant of mercy.',
          verse: '“I do set my bow in the cloud.” — Genesis 9:13 (KJV)'
        }
      ]
    },
    {
      id: 'david',
      title: 'David and Goliath',
      verse: 'Then said David to the Philistine, Thou comest to me with a sword, and with a spear, and with a shield: but I come to thee in the name of the LORD of hosts. — 1 Samuel 17:45 (KJV)',
      lead: 'Four gentle panels that walk through David and Goliath. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Small faith + God is enough.',
      idea: 'Small faith + God is enough.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/david-s1.svg',
          alt: 'Goliath the giant shouts on the battlefield',
          caption: 'The giant shouts against God’s people.',
          verse: '“I defy the armies of Israel.” — 1 Samuel 17:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/david-s2.svg',
          alt: 'Young David with a sling and five smooth stones',
          caption: 'Young David comes with a sling and stones.',
          verse: '“The LORD that delivered me… will deliver me.” — 1 Samuel 17:37 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/david-s3.svg',
          alt: 'David runs toward Goliath and releases the stone',
          caption: 'David runs to meet Goliath in the Lord’s name.',
          verse: '“The battle is the LORD’s.” — 1 Samuel 17:47 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/david-s4.svg',
          alt: 'Goliath fallen; David stands with God’s help',
          caption: 'The giant falls — God helped His servant.',
          verse: '“So David prevailed over the Philistine.” — 1 Samuel 17:50 (KJV)'
        }
      ]
    },
    {
      id: 'daniel-lions',
      title: 'Daniel in the Lions\' Den',
      verse: 'My God hath sent his angel, and hath shut the lions\' mouths, that they have not hurt me. — Daniel 6:22 (KJV)',
      lead: 'Four gentle panels that walk through Daniel in the Lions\' Den. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God is with us when we are afraid.',
      idea: 'God is with us when we are afraid.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/daniel-lions-s1.svg',
          alt: 'Daniel praying by the window',
          caption: 'Daniel prays to God, as he always did.',
          verse: '“He kneeled upon his knees three times a day, and prayed.” — Daniel 6:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/daniel-lions-s2.svg',
          alt: 'Daniel being lowered into the lions’ den',
          caption: 'Daniel is cast into the lions’ den.',
          verse: '“They brought Daniel, and cast him into the den of lions.” — Daniel 6:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/daniel-lions-s3.svg',
          alt: 'Daniel sitting calmly among the lions',
          caption: 'Daniel sits calm — God shut the lions’ mouths.',
          verse: '“My God hath sent his angel, and hath shut the lions’ mouths.” — Daniel 6:22 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/daniel-lions-s4.svg',
          alt: 'The king finding Daniel safe in the morning',
          caption: 'The king finds Daniel safe in the morning.',
          verse: '“Is thy God… able to deliver thee from the lions?” — Daniel 6:20 (KJV)'
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
          verse: '“He was moved with compassion toward them.” — Matthew 14:14 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/feeding-5000-s2.svg',
          alt: 'A boy offering loaves and fishes',
          caption: 'A boy’s five loaves and two fishes.',
          verse: '“There is a lad here, which hath five barley loaves, and two small fishes.” — John 6:9 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/feeding-5000-s3.svg',
          alt: 'Jesus blessing the loaves and fishes',
          caption: 'Jesus blesses the bread and fish.',
          verse: '“And looking up to heaven, he blessed, and brake.” — Matthew 14:19 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/feeding-5000-s4.svg',
          alt: 'Crowds eating; baskets of leftovers',
          caption: 'All eat and are filled — twelve baskets left.',
          verse: '“And they did all eat, and were filled.” — Matthew 14:20 (KJV)'
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
          alt: 'Disciples in a boat in a great storm',
          caption: 'A great storm rises on the sea.',
          verse: '“There arose a great storm of wind.” — Mark 4:37 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-storm-s2.svg',
          alt: 'Disciples waking Jesus in the storm',
          caption: 'The disciples wake Jesus in fear.',
          verse: '“Master, carest thou not that we perish?” — Mark 4:38 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-storm-s3.svg',
          alt: 'Jesus rebuking the wind and sea',
          caption: 'Peace, be still.',
          verse: '“Peace, be still.” — Mark 4:39 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-storm-s4.svg',
          alt: 'Calm sea after Jesus stills the storm',
          caption: 'The wind ceases — a great calm.',
          verse: '“And the wind ceased, and there was a great calm.” — Mark 4:39 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-children',
      title: 'Jesus Welcomes the Little Children',
      verse: 'Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God. — Mark 10:14 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Welcomes the Little Children. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus welcomes children.',
      idea: 'Jesus welcomes children.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-children-s1.svg',
          alt: 'Families bring young children to Jesus',
          caption: 'Families bring little ones to Jesus.',
          verse: '“They brought young children to him.” — Mark 10:13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-children-s2.svg',
          alt: 'The disciples try to send the children away',
          caption: 'The disciples try to send them away.',
          verse: '“And his disciples rebuked those that brought them.” — Mark 10:13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-children-s3.svg',
          alt: 'Jesus welcomes the little children with open arms',
          caption: 'Jesus welcomes them with open arms.',
          verse: '“Suffer the little children to come unto me.” — Mark 10:14 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-children-s4.svg',
          alt: 'Jesus blesses the children — of such is the kingdom of God',
          caption: 'Little ones matter to God — and so do you.',
          verse: '“For of such is the kingdom of God.” — Mark 10:14 (KJV)'
        }
      ]
    },
    {
      id: 'good-samaritan',
      title: 'The Good Samaritan',
      verse: 'Go, and do thou likewise. — Luke 10:37 (KJV)',
      lead: 'Four gentle panels that walk through The Good Samaritan. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Love your neighbor with real help.',
      idea: 'Love your neighbor with real help.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/good-samaritan-s1.svg',
          alt: 'A wounded traveler on the roadside',
          caption: 'A man is hurt on the road.',
          verse: '“A certain man went down from Jerusalem to Jericho.” — Luke 10:30 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/good-samaritan-s2.svg',
          alt: 'A priest passing by the wounded man',
          caption: 'Others pass by on the other side.',
          verse: '“He passed by on the other side.” — Luke 10:31 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/good-samaritan-s3.svg',
          alt: 'The good Samaritan helping the wounded man',
          caption: 'A Samaritan has compassion.',
          verse: '“He had compassion on him.” — Luke 10:33 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/good-samaritan-s4.svg',
          alt: 'The Samaritan paying the innkeeper',
          caption: 'He cares for him — go and do likewise.',
          verse: '“Go, and do thou likewise.” — Luke 10:37 (KJV)'
        }
      ]
    },
    {
      id: 'empty-tomb',
      title: 'The Empty Tomb',
      verse: 'He is not here: for he is risen, as he said. — Matthew 28:6 (KJV)',
      lead: 'Four gentle panels that walk through The Empty Tomb. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus is alive.',
      idea: 'Jesus is alive.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/empty-tomb-s1.svg',
          alt: 'The sealed tomb with guards',
          caption: 'The tomb is sealed; soldiers keep watch.',
          verse: '“So they went, and made the sepulchre sure.” — Matthew 27:66 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/empty-tomb-s2.svg',
          alt: 'The stone rolled away from the tomb',
          caption: 'The stone is rolled away.',
          verse: '“The angel of the Lord… rolled back the stone.” — Matthew 28:2 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/empty-tomb-s3.svg',
          alt: 'The empty tomb and folded grave clothes',
          caption: 'The tomb is empty — He is not here.',
          verse: '“He is not here: for he is risen.” — Matthew 28:6 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/empty-tomb-s4.svg',
          alt: 'The women hear that Jesus is risen',
          caption: 'Good news: He is risen, as He said.',
          verse: '“Go quickly, and tell his disciples that he is risen.” — Matthew 28:7 (KJV)'
        }
      ]
    },
    {
      id: 'prodigal-son',
      title: 'The Prodigal Son',
      verse: 'For this my son was dead, and is alive again; he was lost, and is found. — Luke 15:24 (KJV)',
      lead: 'Four gentle panels that walk through The Prodigal Son. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The Father runs to welcome home.',
      idea: 'The Father runs to welcome home.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/prodigal-son-s1.svg',
          alt: 'The younger son leaving home',
          caption: 'A son asks for his share and leaves.',
          verse: '“Father, give me the portion of goods that falleth to me.” — Luke 15:12 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/prodigal-son-s2.svg',
          alt: 'The prodigal son in hunger among swine',
          caption: 'He wastes all and is in want.',
          verse: '“He began to be in want.” — Luke 15:14 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/prodigal-son-s3.svg',
          alt: 'The father running to welcome his son',
          caption: 'He comes home; the father runs to him.',
          verse: '“His father saw him, and had compassion, and ran.” — Luke 15:20 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/prodigal-son-s4.svg',
          alt: 'A joyful welcome feast for the returned son',
          caption: 'Lost, and is found — celebrate mercy.',
          verse: '“This my son was dead, and is alive again.” — Luke 15:24 (KJV)'
        }
      ]
    },
    {
      id: 'walks-on-water',
      title: 'Jesus Walks on Water',
      verse: 'And he said, Come. And when Peter was come down out of the ship, he walked on the water... — Matthew 14:29 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Walks on Water. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Keep your eyes on Jesus.',
      idea: 'Keep your eyes on Jesus.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/walks-on-water-s1.svg',
          alt: 'Jesus walking on the water toward the boat',
          caption: 'Jesus comes walking on the sea.',
          verse: '“Jesus went unto them, walking on the sea.” — Matthew 14:25 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/walks-on-water-s2.svg',
          alt: 'Peter stepping out of the boat',
          caption: 'Peter steps out toward Jesus.',
          verse: '“Lord, if it be thou, bid me come unto thee.” — Matthew 14:28 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/walks-on-water-s3.svg',
          alt: 'Jesus catching Peter on the water',
          caption: 'Fear rises; Jesus reaches for him.',
          verse: '“O thou of little faith, wherefore didst thou doubt?” — Matthew 14:31 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/walks-on-water-s4.svg',
          alt: 'Jesus and Peter safe in the boat',
          caption: 'They worship Him in the boat.',
          verse: '“Of a truth thou art the Son of God.” — Matthew 14:33 (KJV)'
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
          verse: '“He climbed up into a sycomore tree to see him.” — Luke 19:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/zacchaeus-s2.svg',
          alt: 'Jesus calling Zacchaeus down',
          caption: 'Jesus calls him by name.',
          verse: '“Zacchaeus, make haste, and come down.” — Luke 19:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/zacchaeus-s3.svg',
          alt: 'People murmuring as Jesus goes to Zacchaeus’ house',
          caption: 'Some murmur that Jesus is a guest of a sinner.',
          verse: '“That he was gone to be guest with a man that is a sinner.” — Luke 19:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/zacchaeus-s4.svg',
          alt: 'Zacchaeus welcoming Jesus with joy',
          caption: 'A changed heart — salvation comes to this house.',
          verse: '“This day is salvation come to this house.” — Luke 19:9 (KJV)'
        }
      ]
    },
    {
      id: 'woman-at-well',
      title: 'Woman at the Well',
      verse: 'Whosoever drinketh of this water shall thirst again: But whosoever drinketh of the water that I shall give him shall never thirst. — John 4:13-14 (KJV)',
      lead: 'Four gentle panels that walk through Woman at the Well. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus offers living water.',
      idea: 'Jesus offers living water.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/woman-at-well-s1.svg',
          alt: 'Jesus sits weary by Jacob’s well at noon in Samaria',
          caption: 'Jesus, being wearied with his journey, sat thus on.',
          verse: '“Whosoever drinketh of this water shall thirst again.” — John 4:6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/woman-at-well-s2.svg',
          alt: 'A Samaritan woman comes to draw water and meets Jesus',
          caption: 'There cometh a woman of Samaria to draw water: Jesus saith unto her, Give me to drink.',
          verse: '“Whosoever drinketh of this water shall thirst again.” — John 4:7 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/woman-at-well-s3.svg',
          alt: 'Jesus speaks with the woman about living water',
          caption: 'Jesus answered and said unto her, Whosoever drinketh.',
          verse: '“Whosoever drinketh of this water shall thirst again.” — John 4:14 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/woman-at-well-s4.svg',
          alt: 'The woman leaves her waterpot and runs to tell the city about Jesus',
          caption: 'The woman then left her waterpot.',
          verse: '“The.” — John 4:28-29 (KJV)'
        }
      ]
    },
    {
      id: 'ruth-naomi',
      title: 'Ruth & Naomi',
      verse: 'Intreat me not to leave thee... for whither thou goest, I will go. — Ruth 1:16 (KJV)',
      lead: 'Four gentle panels that walk through Ruth & Naomi. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Loyal love is a quiet strength.',
      idea: 'Loyal love is a quiet strength.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ruth-naomi-s1.svg',
          alt: 'Naomi urges her daughters-in-law to return home as they leave Moab',
          caption: 'Naomi said unto her two daughters in law, Go, return each to her mother’s house.',
          verse: '“Intreat me not to leave thee for whither thou goest, I will go.” — Ruth 1:8 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ruth-naomi-s2.svg',
          alt: 'Ruth clings to Naomi and makes her famous vow of loyalty',
          caption: 'Ruth said, Intreat me not to leave thee.',
          verse: '“Intreat me not to leave thee for whither thou goest, I will go.” — Ruth 1:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/ruth-naomi-s3.svg',
          alt: 'Ruth gleans in the fields of Boaz near Bethlehem',
          caption: 'Ruth the Moabitess said unto Naomi, Let me now go to.',
          verse: '“Intreat me not to leave thee for whither thou goest, I will go.” — Ruth 2:2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/ruth-naomi-s4.svg',
          alt: 'Boaz redeems Ruth at the city gate in the presence of the elders',
          caption: 'Boaz said unto the elders, Ye are witnesses this day.',
          verse: '“Moreover.” — Ruth 4:9-10 (KJV)'
        }
      ]
    },
    {
      id: 'lazarus',
      title: 'Lazarus Raised from the Dead',
      verse: 'I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live. — John 11:25 (KJV)',
      lead: 'Four gentle panels that walk through Lazarus Raised from the Dead. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus is the resurrection and the life.',
      idea: 'Jesus is the resurrection and the life.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lazarus-s1.svg',
          alt: 'Messengers telling Jesus Lazarus is sick',
          caption: 'Lazarus is sick; friends send for Jesus.',
          verse: '“Lord, behold, he whom thou lovest is sick.” — John 11:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/lazarus-s2.svg',
          alt: 'Martha meeting Jesus near Bethany',
          caption: 'Martha meets Jesus in grief.',
          verse: '“Lord, if thou hadst been here, my brother had not died.” — John 11:21 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/lazarus-s3.svg',
          alt: 'Jesus calling Lazarus from the tomb',
          caption: 'Jesus weeps; then He calls Lazarus.',
          verse: '“Lazarus, come forth.” — John 11:43 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/lazarus-s4.svg',
          alt: 'Lazarus raised from the dead',
          caption: 'Lazarus comes forth — alive.',
          verse: '“He that was dead came forth.” — John 11:44 (KJV)'
        }
      ]
    },
    {
      id: 'lost-sheep',
      title: 'The Lost Sheep',
      verse: 'Rejoice with me; for I have found my sheep which was lost. — Luke 15:6 (KJV)',
      lead: 'Four gentle panels that walk through The Lost Sheep. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The Shepherd comes for the one.',
      idea: 'The Shepherd comes for the one.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lost-sheep-s1.svg',
          alt: 'The shepherd with ninety-nine sheep, noticing one is missing',
          caption: 'What man of you, having an hundred sheep, if he lose.',
          verse: '“Rejoice with me.” — Luke 15:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/lost-sheep-s2.svg',
          alt: 'The shepherd searching through the wilderness for the lost sheep',
          caption: 'He goeth after that which is lost, until he find it.',
          verse: '“Rejoice with me.” — Luke 15:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/lost-sheep-s3.svg',
          alt: 'The shepherd finding and gently rescuing the lost sheep',
          caption: 'And when he hath found it, he layeth it on his shoulders, rejoicing.',
          verse: '“Rejoice with me.” — Luke 15:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/lost-sheep-s4.svg',
          alt: 'The shepherd bringing the sheep home to a joyful celebration',
          caption: 'And when he cometh home, he calleth together his.',
          verse: '“Rejoice with me.” — Luke 15:6 (KJV)'
        }
      ]
    },
    {
      id: 'jairus-daughter',
      title: 'Jairus\' Daughter',
      verse: 'Talitha cumi; which is, being interpreted, Damsel, I say unto thee, arise. — Mark 5:41 (KJV)',
      lead: 'Four gentle panels that walk through Jairus\' Daughter. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus’ word brings life.',
      idea: 'Jesus’ word brings life.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jairus-daughter-s1.svg',
          alt: 'Jairus, a ruler of the synagogue, falls at Jesus’ feet begging for his dying daughter',
          caption: 'There came one of the rulers of the synagogue,.',
          verse: '“And.” — Mark 5:22-23 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jairus-daughter-s2.svg',
          alt: 'Messengers bring the devastating news that the daughter has died',
          caption: 'While he yet spake, there came from the ruler of the.',
          verse: '“Talitha cumi.” — Mark 5:35 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jairus-daughter-s3.svg',
          alt: 'Jesus enters the house with only Peter, James, John and the girl’s parents',
          caption: 'He suffered no man to follow him, save Peter.',
          verse: '“Talitha cumi.” — Mark 5:37 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jairus-daughter-s4.svg',
          alt: 'Jesus takes the girl by the hand and raises her, saying Talitha cumi',
          caption: 'He took the damsel by the hand.',
          verse: '“And.” — Mark 5:41-42 (KJV)'
        }
      ]
    },
    {
      id: 'blind-man',
      title: 'Jesus Heals the Blind Man',
      verse: 'Receive thy sight: thy faith hath saved thee. — Luke 18:42 (KJV)',
      lead: 'Four gentle panels that walk through Jesus Heals the Blind Man. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus opens eyes and hearts.',
      idea: 'Jesus opens eyes and hearts.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/blind-man-s1.svg',
          alt: 'Jesus anoints the eyes of the man born blind with clay',
          caption: 'Jesus spat on the ground, made clay of the spittle.',
          verse: '“Receive thy sight.” — John 9:6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/blind-man-s2.svg',
          alt: 'The man washes in the Pool of Siloam and receives his sight',
          caption: 'The man went and washed, and came seeing. For the first time in his life, he could see.',
          verse: '“Receive thy sight.” — John 9:7 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/blind-man-s3.svg',
          alt: 'The Pharisees question the man and his parents about the miracle',
          caption: 'The Pharisees called the parents and the man,.',
          verse: '“Receive thy sight.” — John 9:19 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/blind-man-s4.svg',
          alt: 'Jesus finds the man and reveals Himself; the man worships Him',
          caption: 'Jesus said, Dost thou believe on the Son of God? The.',
          verse: '“Receive thy sight.” — John 9:38 (KJV)'
        }
      ]
    },
    {
      id: 'fishers-of-men',
      title: 'Fishers of Men',
      verse: 'Follow me, and I will make you fishers of men. — Matthew 4:19 (KJV)',
      lead: 'Four gentle panels that walk through Fishers of Men. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus calls ordinary people.',
      idea: 'Jesus calls ordinary people.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/fishers-of-men-s1.svg',
          alt: 'Jesus walks by the Sea of Galilee and sees Peter and Andrew casting their net',
          caption: 'Jesus, walking by the sea of Galilee, saw two.',
          verse: '“Follow me.” — Matthew 4:18 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/fishers-of-men-s2.svg',
          alt: 'Jesus calls Peter and Andrew: Follow me, and I will make you fishers of men',
          caption: 'And he saith unto them, Follow me.',
          verse: '“And.” — Matthew 4:19-20 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/fishers-of-men-s3.svg',
          alt: 'Jesus calls James and John, the sons of Zebedee, in their boat',
          caption: 'And going on from thence, he saw two other brethren,.',
          verse: '“Follow me.” — Matthew 4:21 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/fishers-of-men-s4.svg',
          alt: 'A miraculous catch of fish – Peter falls at Jesus’ feet as the nets break',
          caption: 'When they had this done, they inclosed a great.',
          verse: '“Follow me.” — Luke 5:11 (KJV)'
        }
      ]
    },
    {
      id: 'wedding-cana',
      title: 'Wedding at Cana',
      verse: 'This beginning of miracles did Jesus in Cana of Galilee... — John 2:11 (KJV)',
      lead: 'Four gentle panels that walk through Wedding at Cana. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus turns need into joy.',
      idea: 'Jesus turns need into joy.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/wedding-cana-s1.svg',
          alt: 'A joyful wedding feast in Cana of Galilee with Jesus and Mary among the guests',
          caption: 'There was a marriage in Cana of Galilee.',
          verse: '“And.” — John 2:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/wedding-cana-s2.svg',
          alt: 'The servants discover there is no more wine at the wedding',
          caption: 'And when they wanted wine, the mother of Jesus saith unto him, They have no wine.',
          verse: '“This beginning of miracles did Jesus in Cana of Galilee.” — John 2:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/wedding-cana-s3.svg',
          alt: 'Jesus tells the servants to fill the six stone waterpots with water',
          caption: 'Jesus saith unto them, Fill the waterpots with water. And they filled them up to the brim.',
          verse: '“This beginning of miracles did Jesus in Cana of Galilee.” — John 2:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/wedding-cana-s4.svg',
          alt: 'The master of the feast tastes the water that was made wine and is amazed',
          caption: 'When the ruler of the feast had tasted the water.',
          verse: '“This beginning of miracles did Jesus in Cana of Galilee.” — John 2:11 (KJV)'
        }
      ]
    },
    {
      id: 'mustard-seed',
      title: 'The Mustard Seed',
      verse: 'The kingdom of heaven is like to a grain of mustard seed... — Matthew 13:31',
      lead: 'Four gentle panels that walk through The Mustard Seed. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Small faith can grow.',
      idea: 'Small faith can grow.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/mustard-seed-s1.svg',
          alt: 'A very small seed',
          caption: 'The kingdom of heaven is like to a grain of mustard.',
          verse: '“The kingdom of heaven is like to a grain of mustard seed.” — Matthew 13:31 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/mustard-seed-s2.svg',
          alt: 'The seed is planted',
          caption: 'Which indeed is the least of all seeds.',
          verse: '“The kingdom of heaven is like to a grain of mustard seed.” — Matthew 13:32 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/mustard-seed-s3.svg',
          alt: 'It grows into a great tree',
          caption: 'It becometh a tree, so that the birds of the air come and lodge in the branches thereof.',
          verse: '“The kingdom of heaven is like to a grain of mustard seed.” — Matthew 13:32 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/mustard-seed-s4.svg',
          alt: 'Birds nest in the branches',
          caption: 'The birds of the air come and lodge in the branches thereof.',
          verse: '“The kingdom of heaven is like to a grain of mustard seed.” — Matthew 13:31 (KJV)'
        }
      ]
    },
    {
      id: 'the-sower',
      title: 'The Parable of the Sower',
      verse: 'But he that received seed into the good ground is he that heareth the word... — Matthew 13:23',
      lead: 'Four gentle panels that walk through The Parable of the Sower. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God’s Word wants good soil.',
      idea: 'God’s Word wants good soil.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/the-sower-s1.svg',
          alt: 'Seed by the wayside',
          caption: 'Some seeds fell by the way side, and the fowls came and devoured them up.',
          verse: '“But he that received seed into the good ground is he that.” — Matthew 13:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/the-sower-s2.svg',
          alt: 'Seed on stony places',
          caption: 'Some fell upon stony places, where they had not much earth: and forthwith they sprung up.',
          verse: '“But he that received seed into the good ground is he that.” — Matthew 13:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/the-sower-s3.svg',
          alt: 'Seed among thorns',
          caption: 'Some fell among thorns; and the thorns sprung up, and choked them.',
          verse: '“But he that received seed into the good ground is he that.” — Matthew 13:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/the-sower-s4.svg',
          alt: 'Good ground bears fruit',
          caption: 'But other fell into good ground, and brought forth fruit, some an hundredfold.',
          verse: '“But he that received seed into the good ground is he that.” — Matthew 13:23 (KJV)'
        }
      ]
    },
    {
      id: 'triumphal-entry',
      title: 'Triumphal Entry',
      verse: 'Hosanna to the Son of David: Blessed is he that cometh in the name of the Lord. — Matthew 21:9',
      lead: 'Four gentle panels that walk through Triumphal Entry. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Hosanna — the King comes in peace.',
      idea: 'Hosanna — the King comes in peace.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/triumphal-entry-s1.svg',
          alt: 'Jesus rides a donkey',
          caption: 'They brought the ass, and the colt, and put on them their clothes, and he sat thereon.',
          verse: '“Hosanna to the Son of David.” — Matthew 21:7 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/triumphal-entry-s2.svg',
          alt: 'Cloaks on the road',
          caption: 'A very great multitude spread their garments in the way.',
          verse: '“Hosanna to the Son of David.” — Matthew 21:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/triumphal-entry-s3.svg',
          alt: 'Branches cut from the trees',
          caption: 'Others cut down branches from the trees, and strawed them in the way.',
          verse: '“Hosanna to the Son of David.” — Matthew 21:8 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/triumphal-entry-s4.svg',
          alt: 'The crowd shouts Hosanna',
          caption: 'The multitudes cried, saying, Hosanna to the Son of David.',
          verse: '“Hosanna to the Son of David.” — Matthew 21:9 (KJV)'
        }
      ]
    },
    {
      id: 'lost-coin',
      title: 'The Lost Coin',
      verse: 'Rejoice with me; for I have found the piece which I had lost. — Luke 15:9',
      lead: 'Four gentle panels that walk through The Lost Coin. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Heaven rejoices when the lost is found.',
      idea: 'Heaven rejoices when the lost is found.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lost-coin-s1.svg',
          alt: 'A woman with her silver pieces',
          caption: 'What woman having ten pieces of silver, if she lose one piece, doth not light a candle?',
          verse: '“Rejoice with me.” — Luke 15:8 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/lost-coin-s2.svg',
          alt: 'She sweeps the house',
          caption: 'She sweepeth the house, and seeketh diligently till she find it.',
          verse: '“Rejoice with me.” — Luke 15:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/lost-coin-s3.svg',
          alt: 'She finds the coin',
          caption: 'And when she hath found it, she calleth her friends and her neighbours together.',
          verse: '“Rejoice with me.” — Luke 15:9 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/lost-coin-s4.svg',
          alt: 'Rejoice with friends',
          caption: 'Rejoice with me; for I have found the piece which I had lost.',
          verse: '“Rejoice with me.” — Luke 15:10 (KJV)'
        }
      ]
    },
    {
      id: 'healing-paralytic',
      title: 'Jesus Heals the Paralytic',
      verse: 'Arise, take up thy bed, and go unto thine house. — Matthew 9:6',
      lead: 'Four gentle panels that walk through Jesus Heals the Paralytic. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus forgives and heals.',
      idea: 'Jesus forgives and heals.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/healing-paralytic-s1.svg',
          alt: 'Friends bring a man on a bed',
          caption: 'They brought to him a man sick of the palsy, lying on a bed: and Jesus seeing their faith.',
          verse: '“Arise, take up thy bed.” — Matthew 9:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/healing-paralytic-s2.svg',
          alt: 'They let him down through the roof',
          caption: 'They let him down through the tiling with his couch into the midst before Jesus.',
          verse: '“Arise, take up thy bed.” — Luke 5:19 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/healing-paralytic-s3.svg',
          alt: 'Jesus forgives and heals',
          caption: 'Jesus said, Son, be of good cheer; thy sins be forgiven thee.',
          verse: '“Arise, take up thy bed.” — Matthew 9:2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/healing-paralytic-s4.svg',
          alt: 'He takes up his bed and walks',
          caption: 'Arise, take up thy bed, and go unto thine house.',
          verse: '“He.” — Matthew 9:6-8 (KJV)'
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
          caption: 'I am the good shepherd.',
          verse: '“I am the good shepherd.” — John 10:11 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/good-shepherd-s2.svg',
          alt: 'A wolf threatens the flock and the shepherd stands to protect them',
          caption: 'The hireling fleeth because he is an hireling.',
          verse: '“But.” — John 10:12-13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/good-shepherd-s3.svg',
          alt: 'The Good Shepherd lays down His life for the sheep',
          caption: 'I am the good shepherd... I lay down my life for the sheep.',
          verse: '“I.” — John 10:14-15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/good-shepherd-s4.svg',
          alt: 'The shepherd joyfully carries the rescued sheep home on His shoulders',
          caption: 'And when he hath found it, he layeth it on his shoulders, rejoicing.',
          verse: '“I am the good shepherd.” — Luke 15:5 (KJV)'
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
          caption: 'Jesus called his disciples unto him, and said, I have compassion on the multitude.',
          verse: '“And they did all eat.” — Matthew 15:32 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/feeding-4000-s2.svg',
          alt: 'A few loaves and fishes',
          caption: 'And Jesus saith unto them, How many loaves have ye?.',
          verse: '“And they did all eat.” — Matthew 15:34 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/feeding-4000-s3.svg',
          alt: 'Jesus gives thanks and breaks bread',
          caption: 'He took the seven loaves and the fishes.',
          verse: '“And they did all eat.” — Matthew 15:36 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/feeding-4000-s4.svg',
          alt: 'All eat; baskets left over',
          caption: 'They did all eat, and were filled: and they took up seven baskets full of the broken meat.',
          verse: '“And.” — Matthew 15:37-38 (KJV)'
        }
      ]
    },
    {
      id: 'wise-foolish-builders',
      title: 'The Wise and Foolish Builders',
      verse: 'Therefore whosoever heareth these sayings of mine, and doeth them, I will liken him unto a wise man... — Matthew 7:24',
      lead: 'Four gentle panels that walk through The Wise and Foolish Builders. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Build your life on His words.',
      idea: 'Build your life on His words.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/wise-foolish-builders-s1.svg',
          alt: 'A house built upon a rock',
          caption: 'Whosoever heareth these sayings of mine.',
          verse: '“Therefore whosoever heareth these sayings of mine.” — Matthew 7:24 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/wise-foolish-builders-s2.svg',
          alt: 'A house built upon the sand',
          caption: 'Every one that heareth these sayings of mine.',
          verse: '“Therefore whosoever heareth these sayings of mine.” — Matthew 7:26 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/wise-foolish-builders-s3.svg',
          alt: 'Rain and wind beat on both houses',
          caption: 'The rain descended, and the floods came, and the winds blew, and beat upon that house.',
          verse: '“Therefore whosoever heareth these sayings of mine.” — Matthew 7:25 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/wise-foolish-builders-s4.svg',
          alt: 'The rock house stands; the sand house falls',
          caption: 'It fell not: for it was founded upon a rock... great was the fall of it.',
          verse: '“And.” — Matthew 7:26-27 (KJV)'
        }
      ]
    },
    {
      id: 'the-talents',
      title: 'The Parable of the Talents',
      verse: 'Well done, thou good and faithful servant: thou hast been faithful over a few things... — Matthew 25:21',
      lead: 'Four gentle panels that walk through The Parable of the Talents. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Faithful with a little matters.',
      idea: 'Faithful with a little matters.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/the-talents-s1.svg',
          alt: 'The master gives talents',
          caption: 'Unto one he gave five talents, to another two.',
          verse: '“Well done, thou good and faithful servant.” — Matthew 25:15 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/the-talents-s2.svg',
          alt: 'Two servants trade and gain',
          caption: 'He that had received the five talents went and.',
          verse: '“Well done, thou good and faithful servant.” — Matthew 25:16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/the-talents-s3.svg',
          alt: 'One servant hides his talent',
          caption: 'He that had received one went and digged in the earth, and hid his lord\'s money.',
          verse: '“Well done, thou good and faithful servant.” — Matthew 25:18 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/the-talents-s4.svg',
          alt: 'The master returns',
          caption: 'Well done, thou good and faithful servant: thou hast been faithful over a few things.',
          verse: '“Well done, thou good and faithful servant.” — Matthew 25:21 (KJV)'
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
          caption: 'There was in a city a judge, which feared not God,.',
          verse: '“Luke 18.” — Luke 18:2-3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/persistent-widow-s2.svg',
          alt: 'The judge will not help',
          caption: 'She came unto him, saying, Avenge me of mine adversary. And he would not for a while.',
          verse: '“Luke 18.” — Luke 18:3-4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/persistent-widow-s3.svg',
          alt: 'She keeps coming',
          caption: 'Though I fear not God, nor regard man.',
          verse: '“Luke 18.” — Luke 18:4-5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/persistent-widow-s4.svg',
          alt: 'The judge grants her request',
          caption: 'Hear what the unjust judge saith. And shall not God avenge his own elect?',
          verse: '“I.” — Luke 18:6-8 (KJV)'
        }
      ]
    },
    {
      id: 'healing-leper',
      title: 'Jesus Heals the Leper',
      verse: 'I will; be thou clean. — Matthew 8:3',
      lead: 'Four gentle panels that walk through Jesus Heals the Leper. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus is willing to make clean.',
      idea: 'Jesus is willing to make clean.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/healing-leper-s1.svg',
          alt: 'A leper kneels before Jesus',
          caption: 'There came a leper and worshipped him, saying, Lord,.',
          verse: '“I will.” — Matthew 8:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/healing-leper-s2.svg',
          alt: 'Jesus touches him',
          caption: 'Jesus put forth his hand, and touched him, saying, I will; be thou clean.',
          verse: '“I will.” — Matthew 8:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/healing-leper-s3.svg',
          alt: 'He is cleansed',
          caption: 'And immediately his leprosy was cleansed.',
          verse: '“I will.” — Matthew 8:3 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/healing-leper-s4.svg',
          alt: 'Jesus sends him to the priest',
          caption: 'See thou tell no man.',
          verse: '“I will.” — Matthew 8:4 (KJV)'
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
          verse: '“He made him a coat of many colours.” — Genesis 37:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/joseph-coat-s2.svg',
          alt: 'Joseph’s brothers looking on with jealousy',
          caption: 'Joseph’s brothers are jealous.',
          verse: '“They hated him, and could not speak peaceably.” — Genesis 37:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/joseph-coat-s3.svg',
          alt: 'Joseph in a pit',
          caption: 'Joseph is cast into a pit.',
          verse: '“They cast him into a pit.” — Genesis 37:24 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/joseph-coat-s4.svg',
          alt: 'Joseph sold and taken toward Egypt',
          caption: 'Sold into Egypt — yet God is still with him.',
          verse: '“The LORD was with Joseph.” — Genesis 39:2 (KJV)'
        }
      ]
    },
    {
      id: 'joseph-dreams',
      title: 'Joseph Interprets Dreams',
      verse: 'God shall give Pharaoh an answer of peace. — Genesis 41:16',
      lead: 'Four gentle panels that walk through Joseph Interprets Dreams. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God can turn sorrow into saving.',
      idea: 'God can turn sorrow into saving.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/joseph-dreams-s1.svg',
          alt: 'Joseph in prison',
          caption: 'Joseph\'s master took him.',
          verse: '“God shall give Pharaoh an answer of peace.” — Genesis 39:20 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/joseph-dreams-s2.svg',
          alt: 'The butler and the baker dream',
          caption: 'The butler and the baker of the king of Egypt dreamed, each man his dream in one night.',
          verse: '“God shall give Pharaoh an answer of peace.” — Genesis 40:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/joseph-dreams-s3.svg',
          alt: 'Joseph before Pharaoh',
          caption: 'Pharaoh said unto Joseph, I have dreamed a dream.',
          verse: '“God shall give Pharaoh an answer of peace.” — Genesis 41:15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/joseph-dreams-s4.svg',
          alt: 'Joseph rules in Egypt',
          caption: 'Pharaoh said unto Joseph, See, I have set thee over all the land of Egypt.',
          verse: '“God shall give Pharaoh an answer of peace.” — Genesis 41:40 (KJV)'
        }
      ]
    },
    {
      id: 'burning-bush',
      title: 'Moses and the Burning Bush',
      verse: 'I AM THAT I AM. — Exodus 3:14',
      lead: 'Four gentle panels that walk through Moses and the Burning Bush. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God sees; God sends.',
      idea: 'God sees; God sends.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/burning-bush-s1.svg',
          alt: 'The bush burns with fire',
          caption: 'The angel of the LORD appeared unto him in a flame.',
          verse: '“I AM THAT I AM.” — Exodus 3:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/burning-bush-s2.svg',
          alt: 'God calls Moses',
          caption: 'God called unto him out of the midst of the bush, and said, Moses, Moses.',
          verse: '“I AM THAT I AM.” — Exodus 3:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/burning-bush-s3.svg',
          alt: 'Put off thy shoes',
          caption: 'Draw not nigh hither.',
          verse: '“I AM THAT I AM.” — Exodus 3:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/burning-bush-s4.svg',
          alt: 'Go to Pharaoh',
          caption: 'Come now therefore.',
          verse: '“And.” — Exodus 3:10-11 (KJV)'
        }
      ]
    },
    {
      id: 'jericho',
      title: 'Joshua and the Walls of Jericho',
      verse: 'And it shall come to pass, that when they make a long blast with the ram\'s horn... the wall of the city shall fall down flat. — Joshua 6:5',
      lead: 'Four gentle panels that walk through Joshua and the Walls of Jericho. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Trust and obey — walls fall.',
      idea: 'Trust and obey — walls fall.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jericho-s1.svg',
          alt: 'Israel marches around Jericho',
          caption: 'Ye shall compass the city, all ye men of war.',
          verse: '“And it shall come to pass.” — Joshua 6:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jericho-s2.svg',
          alt: 'Seven priests with trumpets',
          caption: 'Seven priests bearing seven trumpets of rams\' horns before the ark of the LORD.',
          verse: '“And it shall come to pass.” — Joshua 6:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jericho-s3.svg',
          alt: 'The people shout',
          caption: 'It shall come to pass, when they make a long blast.',
          verse: '“And it shall come to pass.” — Joshua 6:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jericho-s4.svg',
          alt: 'The wall falls down',
          caption: 'The wall fell down flat, so that the people went up.',
          verse: '“So.” — Joshua 6:20 (KJV)'
        }
      ]
    },
    {
      id: 'gideon-fleece',
      title: 'Gideon and the Fleece',
      verse: 'If thou wilt save Israel by mine hand, as thou hast said... — Judges 6:36',
      lead: 'Four gentle panels that walk through Gideon and the Fleece. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God strengthens the weak.',
      idea: 'God strengthens the weak.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/gideon-fleece-s1.svg',
          alt: 'Gideon asks God for a sign',
          caption: 'Gideon said unto God, If thou wilt save Israel by.',
          verse: '“Judges 6.” — Judges 6:36-37 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/gideon-fleece-s2.svg',
          alt: 'The fleece is wet with dew',
          caption: 'And it was so.',
          verse: '“If thou wilt save Israel by mine hand, as thou hast said.” — Judges 6:38 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/gideon-fleece-s3.svg',
          alt: 'The fleece is dry, the ground wet',
          caption: 'Let it now be dry only upon the fleece.',
          verse: '“If thou wilt save Israel by mine hand, as thou hast said.” — Judges 6:40 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/gideon-fleece-s4.svg',
          alt: 'Gideon leads the army',
          caption: 'The LORD said unto him, Arise, get thee down unto.',
          verse: '“So.” — Judges 7:9-15 (KJV)'
        }
      ]
    },
    {
      id: 'samson',
      title: 'Samson',
      verse: 'The Spirit of the LORD began to move him. — Judges 13:25',
      lead: 'Four gentle panels that walk through Samson. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Strength is a gift to use for God.',
      idea: 'Strength is a gift to use for God.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/samson-s1.svg',
          alt: 'Samson\'s great strength',
          caption: 'The Spirit of the LORD came mightily upon him.',
          verse: '“The Spirit of the LORD began to move him.” — Judges 14:6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/samson-s2.svg',
          alt: 'Samson carries the city gates',
          caption: 'Samson took the doors of the gate of the city.',
          verse: '“The Spirit of the LORD began to move him.” — Judges 16:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/samson-s3.svg',
          alt: 'Samson stands against the Philistines',
          caption: 'He smote them hip and thigh with a great slaughter.',
          verse: '“The Spirit of the LORD began to move him.” — Judges 15:8 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/samson-s4.svg',
          alt: 'The house falls; God is glorified',
          caption: 'Samson bowed himself with all his might.',
          verse: '“The Spirit of the LORD began to move him.” — Judges 16:30 (KJV)'
        }
      ]
    },
    {
      id: 'esther',
      title: 'Esther Saves Her People',
      verse: 'Who knoweth whether thou art come to the kingdom for such a time as this? — Esther 4:14',
      lead: 'Four gentle panels that walk through Esther Saves Her People. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Courage can serve God’s people.',
      idea: 'Courage can serve God’s people.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/esther-s1.svg',
          alt: 'Esther is chosen queen',
          caption: 'The king loved Esther above all the women.',
          verse: '“Who knoweth whether thou art come to the kingdom for such a time.” — Esther 2:17 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/esther-s2.svg',
          alt: 'Haman\'s plot',
          caption: 'Haman sought to destroy all the Jews that were.',
          verse: '“Who knoweth whether thou art come to the kingdom for such a time.” — Esther 3:6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/esther-s3.svg',
          alt: 'Esther comes to the king',
          caption: 'Esther put on her royal apparel.',
          verse: '“Esther 5.” — Esther 5:1-2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/esther-s4.svg',
          alt: 'The Jews rejoice',
          caption: 'Many of the people of the land became Jews; for the fear of the Jews fell upon them.',
          verse: '“Who knoweth whether thou art come to the kingdom for such a time.” — Esther 8:17 (KJV)'
        }
      ]
    },
    {
      id: 'fiery-furnace',
      title: 'Shadrach, Meshach, and Abednego',
      verse: 'Our God whom we serve is able to deliver us from the burning fiery furnace... — Daniel 3:17',
      lead: 'Four gentle panels that walk through Shadrach, Meshach, and Abednego. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God is with us in the fire.',
      idea: 'God is with us in the fire.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/fiery-furnace-s1.svg',
          alt: 'They will not bow to the image',
          caption: 'Shadrach, Meshach.',
          verse: '“Our God whom we serve is able to deliver us from the burning.” — Daniel 3:16 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/fiery-furnace-s2.svg',
          alt: 'Cast into the furnace',
          caption: 'These three men, Shadrach, Meshach.',
          verse: '“Our God whom we serve is able to deliver us from the burning.” — Daniel 3:23 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/fiery-furnace-s3.svg',
          alt: 'Four walk unhurt in the fire',
          caption: 'Lo, I see four men loose, walking in the midst of.',
          verse: '“Our God whom we serve is able to deliver us from the burning.” — Daniel 3:25 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/fiery-furnace-s4.svg',
          alt: 'They come out; not a hair is singed',
          caption: 'Nebuchadnezzar spake, saying, Blessed be the God of.',
          verse: '“Our God whom we serve is able to deliver us from the burning.” — Daniel 3:27 (KJV)'
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
          alt: 'God calls Abraham',
          caption: 'Take now thy son, thine only son Isaac, whom thou.',
          verse: '“And Abraham called the name of that place Jehovahjireh.” — Genesis 22:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/abraham-isaac-s2.svg',
          alt: 'Father and son take wood',
          caption: 'Abraham took the wood of the burnt offering.',
          verse: '“And Abraham called the name of that place Jehovahjireh.” — Genesis 22:6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/abraham-isaac-s3.svg',
          alt: 'Isaac asks about the lamb',
          caption: 'Isaac spake unto Abraham his father.',
          verse: '“And Abraham called the name of that place Jehovahjireh.” — Genesis 22:7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/abraham-isaac-s4.svg',
          alt: 'The LORD provides a ram',
          caption: 'Abraham lifted up his eyes.',
          verse: '“And.” — Genesis 22:13-14 (KJV)'
        }
      ]
    },
    {
      id: 'elijah-carmel',
      title: 'Elijah & the Fire on Mount Carmel',
      verse: 'The LORD, he is the God; the LORD, he is the God. - 1 Kings 18:39',
      lead: 'Four gentle panels that walk through Elijah & the Fire on Mount Carmel. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The LORD, He is the God.',
      idea: 'The LORD, He is the God.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elijah-carmel-s1.svg',
          alt: 'The prophets of Baal cry aloud',
          caption: 'They called on the name of Baal from morning even.',
          verse: '“1.” — 1 Kings 18:26 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-carmel-s2.svg',
          alt: 'Elijah repairs the altar',
          caption: 'Elijah took twelve stones and he made a trench about.',
          verse: '“1.” — 1 Kings 18:31-32 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-carmel-s3.svg',
          alt: 'Fire falls from heaven',
          caption: 'Then the fire of the LORD fell.',
          verse: '“1.” — 1 Kings 18:38 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-carmel-s4.svg',
          alt: 'The people worship the LORD',
          caption: 'When all the people saw it, they fell on their faces.',
          verse: '“1.” — 1 Kings 18:39 (KJV)'
        }
      ]
    },
    {
      id: 'naaman',
      title: 'Naaman Healed of Leprosy',
      verse: 'Go and wash in Jordan seven times, and thy flesh shall come again to thee, and thou shalt be clean. - 2 Kings 5:10',
      lead: 'Four gentle panels that walk through Naaman Healed of Leprosy. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Simple obedience brings healing.',
      idea: 'Simple obedience brings healing.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/naaman-s1.svg',
          alt: 'Naaman comes with horses and chariot',
          caption: 'Naaman, captain of the host of the king of Syria, was a great man... but he was a leper.',
          verse: '“2.” — 2 Kings 5:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/naaman-s2.svg',
          alt: 'Elisha sends a messenger',
          caption: 'Elisha sent a messenger unto him, saying, Go and.',
          verse: '“2.” — 2 Kings 5:10 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/naaman-s3.svg',
          alt: 'Naaman dips in Jordan',
          caption: 'Then went he down.',
          verse: '“2.” — 2 Kings 5:14 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/naaman-s4.svg',
          alt: 'His flesh is clean like a child',
          caption: 'His flesh came again like unto the flesh of a little child, and he was clean.',
          verse: '“2.” — 2 Kings 5:14 (KJV)'
        }
      ]
    },
    {
      id: 'boy-samuel',
      title: 'The Boy Samuel',
      verse: 'Speak, LORD; for thy servant heareth. - 1 Samuel 3:9',
      lead: 'Four gentle panels that walk through The Boy Samuel. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Speak, Lord; Your servant hears.',
      idea: 'Speak, Lord; Your servant hears.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/boy-samuel-s1.svg',
          alt: 'Samuel lies down in the house of the LORD',
          caption: 'Ere the lamp of God went out in the temple of the.',
          verse: '“1.” — 1 Samuel 3:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/boy-samuel-s2.svg',
          alt: 'The LORD calls Samuel',
          caption: 'The LORD called Samuel.',
          verse: '“1.” — 1 Samuel 3:4-5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/boy-samuel-s3.svg',
          alt: 'Eli tells Samuel how to answer',
          caption: 'Eli perceived that the LORD had called the child.',
          verse: '“1.” — 1 Samuel 3:8-9 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/boy-samuel-s4.svg',
          alt: 'Samuel speaks to the LORD',
          caption: 'The LORD came.',
          verse: '“1.” — 1 Samuel 3:10 (KJV)'
        }
      ]
    },
    {
      id: 'ten-lepers',
      title: 'Jesus Heals the Ten Lepers',
      verse: 'Arise, go thy way: thy faith hath made thee whole. — Luke 17:19',
      lead: 'Four gentle panels that walk through Jesus Heals the Ten Lepers. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Remember to give thanks.',
      idea: 'Remember to give thanks.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/ten-lepers-s1.svg',
          alt: 'Ten lepers stand afar off',
          caption: 'There met him ten men that were lepers, which stood.',
          verse: '“Luke 17.” — Luke 17:12-13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ten-lepers-s2.svg',
          alt: 'Jesus sends them to the priests',
          caption: 'When he saw them, he said unto them, Go shew yourselves unto the priests.',
          verse: '“Arise, go thy way.” — Luke 17:14 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/ten-lepers-s3.svg',
          alt: 'They are cleansed on the way',
          caption: 'And it came to pass, that, as they went, they were cleansed.',
          verse: '“Arise, go thy way.” — Luke 17:14 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/ten-lepers-s4.svg',
          alt: 'One returns to give thanks',
          caption: 'One of them, when he saw that he was healed, turned.',
          verse: '“Arise,.” — Luke 17:15-19 (KJV)'
        }
      ]
    },
    {
      id: 'pharisee-tax-collector',
      title: 'The Pharisee and the Tax Collector',
      verse: 'God be merciful to me a sinner. — Luke 18:13',
      lead: 'Four gentle panels that walk through The Pharisee and the Tax Collector. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Humble hearts are heard.',
      idea: 'Humble hearts are heard.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/pharisee-tax-collector-s1.svg',
          alt: 'Two men go up to pray',
          caption: 'Two men went up into the temple to pray; the one a Pharisee, and the other a publican.',
          verse: '“God be merciful to me a sinner.” — Luke 18:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/pharisee-tax-collector-s2.svg',
          alt: 'The Pharisee prays proudly',
          caption: 'The Pharisee stood and prayed thus with himself,.',
          verse: '“God be merciful to me a sinner.” — Luke 18:11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/pharisee-tax-collector-s3.svg',
          alt: 'The publican prays humbly',
          caption: 'The publican, standing afar off, would not lift up.',
          verse: '“God be merciful to me a sinner.” — Luke 18:13 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/pharisee-tax-collector-s4.svg',
          alt: 'Jesus teaches who went home justified',
          caption: 'I tell you, this man went down to his house.',
          verse: '“God be merciful to me a sinner.” — Luke 18:14 (KJV)'
        }
      ]
    },
    {
      id: 'widows-mite',
      title: 'The Widow\'s Mite',
      verse: 'This poor widow hath cast more in, than all they which have cast into the treasury. — Mark 12:43',
      lead: 'Four gentle panels that walk through The Widow\'s Mite. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God sees quiet, wholehearted giving.',
      idea: 'God sees quiet, wholehearted giving.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/widows-mite-s1.svg',
          alt: 'Jesus watches people give',
          caption: 'Jesus sat over against the treasury.',
          verse: '“This poor widow hath cast more in, than all they which have cast.” — Mark 12:41 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/widows-mite-s2.svg',
          alt: 'Many rich cast in much',
          caption: 'Many that were rich cast in much.',
          verse: '“This poor widow hath cast more in, than all they which have cast.” — Mark 12:41 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/widows-mite-s3.svg',
          alt: 'A poor widow gives two mites',
          caption: 'There came a certain poor widow, and she threw in two mites, which make a farthing.',
          verse: '“This poor widow hath cast more in, than all they which have cast.” — Mark 12:42 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/widows-mite-s4.svg',
          alt: 'Jesus says she gave the most',
          caption: 'Verily I say unto you.',
          verse: '“For.” — Mark 12:43-44 (KJV)'
        }
      ]
    },
    {
      id: 'centurion-servant',
      title: 'The Centurion\'s Servant',
      verse: 'I have not found so great faith, no, not in Israel. — Matthew 8:10',
      lead: 'Four gentle panels that walk through The Centurion\'s Servant. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Great faith trusts Jesus’ word.',
      idea: 'Great faith trusts Jesus’ word.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/centurion-servant-s1.svg',
          alt: 'The centurion asks Jesus for help',
          caption: 'There came unto him a centurion, beseeching him.',
          verse: '“Matthew 8.” — Matthew 8:5-6 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/centurion-servant-s2.svg',
          alt: 'Speak the word only',
          caption: 'I am not worthy that thou shouldest come under my.',
          verse: '“I have not found so great faith, no, not in Israel.” — Matthew 8:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/centurion-servant-s3.svg',
          alt: 'Jesus marvels at his faith',
          caption: 'When Jesus heard it, he marvelled.',
          verse: '“I have not found so great faith, no, not in Israel.” — Matthew 8:10 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/centurion-servant-s4.svg',
          alt: 'The servant is healed',
          caption: 'Jesus said unto the centurion, Go thy way.',
          verse: '“I have not found so great faith, no, not in Israel.” — Matthew 8:13 (KJV)'
        }
      ]
    },
    {
      id: 'abraham-sarah',
      title: 'Abraham & Sarah',
      verse: 'Sarah laughed within herself, saying, After I am waxed old shall I have pleasure, my lord being old also? — Genesis 18:12',
      lead: 'Four gentle panels that walk through Abraham & Sarah. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Nothing is too hard for the Lord.',
      idea: 'Nothing is too hard for the Lord.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/abraham-sarah-s1.svg',
          alt: 'Three visitors promise a son',
          caption: 'I will certainly return unto thee according to the.',
          verse: '“Sarah laughed within herself, saying, After I am waxed old shall.” — Genesis 18:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/abraham-sarah-s2.svg',
          alt: 'Sarah laughs within herself',
          caption: 'Sarah laughed within herself, saying, After I am.',
          verse: '“Sarah laughed within herself, saying, After I am waxed old shall.” — Genesis 18:12 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/abraham-sarah-s3.svg',
          alt: 'Isaac is born',
          caption: 'Sarah conceived.',
          verse: '“Sarah laughed within herself, saying, After I am waxed old shall.” — Genesis 21:2 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/abraham-sarah-s4.svg',
          alt: 'Sarah rejoices',
          caption: 'Sarah said, God hath made me to laugh, so that all that hear will laugh with me.',
          verse: '“Sarah laughed within herself, saying, After I am waxed old shall.” — Genesis 21:6 (KJV)'
        }
      ]
    },
    {
      id: 'elisha-oil',
      title: 'Elisha & the Widow\'s Oil',
      verse: 'Go, sell the oil, and pay thy debt, and live thou and thy children of the rest. - 2 Kings 4:7',
      lead: 'Four gentle panels that walk through Elisha & the Widow\'s Oil. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God multiplies what we surrender.',
      idea: 'God multiplies what we surrender.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elisha-oil-s1.svg',
          alt: 'The widow cries to Elisha',
          caption: 'The wife of one of the sons of the prophets cried.',
          verse: '“2.” — 2 Kings 4:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elisha-oil-s2.svg',
          alt: 'Borrow many empty vessels',
          caption: 'Go, borrow thee vessels abroad of all thy.',
          verse: '“2.” — 2 Kings 4:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elisha-oil-s3.svg',
          alt: 'The oil multiplies',
          caption: 'When the vessels were full.',
          verse: '“2.” — 2 Kings 4:6 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elisha-oil-s4.svg',
          alt: 'She pays her debt',
          caption: 'Then she came and told the man of God. And he said,.',
          verse: '“2.” — 2 Kings 4:7 (KJV)'
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
          alt: 'Hannah prays in bitterness of soul',
          caption: 'She was in bitterness of soul.',
          verse: '“1.” — 1 Samuel 1:10-11 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/hannah-samuel-s2.svg',
          alt: 'Eli blesses her',
          caption: 'Eli answered and said, Go in peace.',
          verse: '“1.” — 1 Samuel 1:17 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/hannah-samuel-s3.svg',
          alt: 'Samuel is born',
          caption: 'Wherefore it came to pass, when the time was come.',
          verse: '“1.” — 1 Samuel 1:20 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/hannah-samuel-s4.svg',
          alt: 'Hannah dedicates him to the LORD',
          caption: 'For this child I prayed.',
          verse: '“1.” — 1 Samuel 1:27-28 (KJV)'
        }
      ]
    },
    {
      id: 'david-jonathan',
      title: 'David & Jonathan',
      verse: 'The soul of Jonathan was knit with the soul of David, and Jonathan loved him as his own soul. - 1 Samuel 18:1',
      lead: 'Four gentle panels that walk through David & Jonathan. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: True friendship is loyal.',
      idea: 'True friendship is loyal.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/david-jonathan-s1.svg',
          alt: 'Jonathan gives David his robe',
          caption: 'Jonathan stripped himself of the robe that was upon.',
          verse: '“1.” — 1 Samuel 18:4 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/david-jonathan-s2.svg',
          alt: 'They make a covenant',
          caption: 'Then Jonathan and David made a covenant, because he loved him as his own soul.',
          verse: '“1.” — 1 Samuel 18:3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/david-jonathan-s3.svg',
          alt: 'Jonathan sends David in peace',
          caption: 'Jonathan said to David, Go in peace, forasmuch as we.',
          verse: '“1.” — 1 Samuel 20:42 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/david-jonathan-s4.svg',
          alt: 'Their souls were knit together',
          caption: 'The soul of Jonathan was knit with the soul of David.',
          verse: '“1.” — 1 Samuel 18:1 (KJV)'
        }
      ]
    },
    {
      id: 'rich-young-ruler',
      title: 'Jesus Talks with a Rich Young Man',
      verse: 'Jesus said unto him, If thou wilt be perfect, go and sell that thou hast, and give to the poor... — Matthew 19:21',
      lead: 'Four gentle panels that walk through Jesus Talks with a Rich Young Man. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Follow Jesus above all.',
      idea: 'Follow Jesus above all.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/rich-young-ruler-s1.svg',
          alt: 'The young man asks Jesus',
          caption: 'Behold, one came and said unto him, Good Master,.',
          verse: '“Jesus said unto him, If thou wilt be perfect, go and sell that.” — Matthew 19:16 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/rich-young-ruler-s2.svg',
          alt: 'Jesus tells him to sell and follow',
          caption: 'Jesus said unto him, If thou wilt be perfect, go and.',
          verse: '“Jesus said unto him, If thou wilt be perfect, go and sell that.” — Matthew 19:21 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/rich-young-ruler-s3.svg',
          alt: 'He goes away sorrowful',
          caption: 'When the young man heard that saying, he went away.',
          verse: '“Jesus said unto him, If thou wilt be perfect, go and sell that.” — Matthew 19:22 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/rich-young-ruler-s4.svg',
          alt: 'Jesus teaches about riches',
          caption: 'Jesus said unto his disciples, Verily I say unto you.',
          verse: '“With.” — Matthew 19:23 (KJV)'
        }
      ]
    },
    {
      id: 'pearl-great-price',
      title: 'The Pearl of Great Price',
      verse: 'Again, the kingdom of heaven is like unto a merchant man, seeking goodly pearls... — Matthew 13:45',
      lead: 'Four gentle panels that walk through The Pearl of Great Price. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The kingdom is worth everything.',
      idea: 'The kingdom is worth everything.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/pearl-great-price-s1.svg',
          alt: 'A merchant seeks pearls',
          caption: 'Again, the kingdom of heaven is like unto a merchant man, seeking goodly pearls.',
          verse: '“Again, the kingdom of heaven is like unto a merchant man,.” — Matthew 13:45 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/pearl-great-price-s2.svg',
          alt: 'He finds one pearl of great price',
          caption: 'Who, when he had found one pearl of great price,.',
          verse: '“Again, the kingdom of heaven is like unto a merchant man,.” — Matthew 13:46 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/pearl-great-price-s3.svg',
          alt: 'He sells all that he has',
          caption: 'He went and sold all that he had, to buy that one pearl.',
          verse: '“Again, the kingdom of heaven is like unto a merchant man,.” — Matthew 13:46 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/pearl-great-price-s4.svg',
          alt: 'The kingdom is worth everything',
          caption: 'When he had found one pearl of great price, he went.',
          verse: '“Again, the kingdom of heaven is like unto a merchant man,.” — Matthew 13:46 (KJV)'
        }
      ]
    },
    {
      id: 'withered-hand',
      title: 'Jesus Heals the Man with the Withered Hand',
      verse: 'Stretch forth thine hand. And he stretched it forth; and it was restored whole, like as the other. — Matthew 12:13',
      lead: 'Four gentle panels that walk through Jesus Heals the Man with the Withered Hand. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus restores what is broken.',
      idea: 'Jesus restores what is broken.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/withered-hand-s1.svg',
          alt: 'A man with a withered hand',
          caption: 'Behold, there was a man which had his hand withered.',
          verse: '“Stretch forth thine hand. And he stretched it forth.” — Matthew 12:10 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/withered-hand-s2.svg',
          alt: 'Jesus answers the Pharisees',
          caption: 'What man shall there be among you.',
          verse: '“Stretch forth thine hand. And he stretched it forth.” — Matthew 12:11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/withered-hand-s3.svg',
          alt: 'Stretch forth thine hand',
          caption: 'Then saith he to the man, Stretch forth thine hand. And he stretched it forth.',
          verse: '“Stretch forth thine hand. And he stretched it forth.” — Matthew 12:13 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/withered-hand-s4.svg',
          alt: 'His hand is whole like the other',
          caption: 'It was restored whole, like as the other.',
          verse: '“Stretch forth thine hand. And he stretched it forth.” — Matthew 12:13 (KJV)'
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
          verse: '“Matthew 18.” — Matthew 18:23-24 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/unforgiving-servant-s2.svg',
          alt: 'The king forgives the great debt',
          caption: 'The lord of that servant was moved with compassion.',
          verse: '“Shouldest not thou also have had compassion on thy.” — Matthew 18:27 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/unforgiving-servant-s3.svg',
          alt: 'He will not forgive his fellowservant',
          caption: 'The same servant went out.',
          verse: '“Shouldest not thou also have had compassion on thy.” — Matthew 18:28 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/unforgiving-servant-s4.svg',
          alt: 'The king is angry',
          caption: 'Shouldest not thou also have had compassion on thy.',
          verse: '“So.” — Matthew 18:33-35 (KJV)'
        }
      ]
    },
    {
      id: 'boy-david',
      title: 'The Boy David',
      verse: 'Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the LORD came upon David from that day forward. - 1 Samuel 16:13',
      lead: 'Four gentle panels that walk through The Boy David. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God looks on the heart.',
      idea: 'God looks on the heart.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/boy-david-s1.svg',
          alt: 'Samuel comes to Jesse\'s house',
          caption: 'Samuel came to Bethlehem and sanctified Jesse and.',
          verse: '“1.” — 1 Samuel 16:4-5 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/boy-david-s2.svg',
          alt: 'David keeps sheep in the field',
          caption: 'Jesse made seven of his sons to pass before Samuel.',
          verse: '“1.” — 1 Samuel 16:10-11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/boy-david-s3.svg',
          alt: 'David is anointed before his brothers',
          caption: 'Then Samuel took the horn of oil.',
          verse: '“1.” — 1 Samuel 16:13 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/boy-david-s4.svg',
          alt: 'The Spirit of the LORD is upon David',
          caption: 'The LORD said, Arise, anoint him.',
          verse: '“1.” — 1 Samuel 16:12-13 (KJV)'
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
          caption: 'Get thee hence.',
          verse: '“1.” — 1 Kings 17:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-ravens-s2.svg',
          alt: 'Ravens bring food',
          caption: 'The ravens brought him bread and flesh in the morning, and bread and flesh in the evening.',
          verse: '“1.” — 1 Kings 17:6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-ravens-s3.svg',
          alt: 'Elijah drinks from the brook',
          caption: 'And it shall be.',
          verse: '“1.” — 1 Kings 17:4-5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-ravens-s4.svg',
          alt: 'The brook dries up',
          caption: 'It came to pass after a while.',
          verse: '“1.” — 1 Kings 17:7 (KJV)'
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
          caption: 'Belshazzar the king made a great feast to a thousand.',
          verse: '“And this is the writing that was written, MENE, MENE, TEKEL,.” — Daniel 5:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/writing-on-wall-s2.svg',
          alt: 'A hand writes on the plaster',
          caption: 'In the same hour came forth fingers of a man\'s hand.',
          verse: '“And this is the writing that was written, MENE, MENE, TEKEL,.” — Daniel 5:5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/writing-on-wall-s3.svg',
          alt: 'The king is afraid',
          caption: 'Then the king\'s countenance was changed.',
          verse: '“And this is the writing that was written, MENE, MENE, TEKEL,.” — Daniel 5:6 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/writing-on-wall-s4.svg',
          alt: 'Daniel reads the writing',
          caption: 'This is the interpretation of the thing.',
          verse: '“Daniel 5.” — Daniel 5:26-27 (KJV)'
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
          caption: 'She went.',
          verse: '“The LORD recompense thy work.” — Ruth 2:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ruth-boaz-s2.svg',
          alt: 'Boaz speaks kindly to Ruth',
          caption: 'Boaz answered and said unto her, It hath fully been.',
          verse: '“The LORD recompense thy work.” — Ruth 2:11 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/ruth-boaz-s3.svg',
          alt: 'Boaz redeems at the gate',
          caption: 'Boaz said unto the elders.',
          verse: '“The LORD recompense thy work.” — Ruth 4:9 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/ruth-boaz-s4.svg',
          alt: 'Ruth and Boaz are married',
          caption: 'So Boaz took Ruth.',
          verse: '“The LORD recompense thy work.” — Ruth 4:13 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-baptism',
      title: 'Jesus Is Baptized',
      verse: 'And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him. — Matthew 3:16',
      lead: 'Four gentle panels that walk through Jesus Is Baptized. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: This is My beloved Son.',
      idea: 'This is My beloved Son.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-baptism-s1.svg',
          alt: 'John preaches at the river',
          caption: 'John the Baptist, preaching in the wilderness of.',
          verse: '“Matthew 3.” — Matthew 3:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-baptism-s2.svg',
          alt: 'Jesus comes to John to be baptized',
          caption: 'Then cometh Jesus from Galilee to Jordan unto John,.',
          verse: '“Matthew 3.” — Matthew 3:13-14 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-baptism-s3.svg',
          alt: 'John baptizes Jesus in the water',
          caption: 'Jesus answering said unto him, Suffer it to be so.',
          verse: '“And Jesus, when he was baptized, went up straightway out of the.” — Matthew 3:15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-baptism-s4.svg',
          alt: 'The Spirit descends like a dove',
          caption: 'Jesus, when he was baptized, went up straightway out.',
          verse: '“And Jesus, when he was baptized, went up straightway out of the.” — Matthew 3:16 (KJV)'
        }
      ]
    },
    {
      id: 'emmaus-road',
      title: 'The Road to Emmaus',
      verse: 'Did not our heart burn within us, while he talked with us by the way, and while he opened to us the scriptures? — Luke 24:32',
      lead: 'Four gentle panels that walk through The Road to Emmaus. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Jesus walks with us and opens the Word.',
      idea: 'Jesus walks with us and opens the Word.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/emmaus-road-s1.svg',
          alt: 'Two disciples walk sadly',
          caption: 'Behold, two of them went that same day to a village.',
          verse: '“Did not our heart burn within us, while he talked with us by the.” — Luke 24:13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/emmaus-road-s2.svg',
          alt: 'Jesus draws near and walks with them',
          caption: 'Jesus himself drew near.',
          verse: '“Luke 24.” — Luke 24:15-16 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/emmaus-road-s3.svg',
          alt: 'He breaks bread at the table',
          caption: 'He took bread.',
          verse: '“Luke 24.” — Luke 24:30-31 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/emmaus-road-s4.svg',
          alt: 'They hurry back to Jerusalem',
          caption: 'They rose up the same hour.',
          verse: '“Luke 24.” — Luke 24:33-34 (KJV)'
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
          caption: 'Now before the feast of the passover, when Jesus.',
          verse: '“John 13.” — John 13:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-washes-feet-s2.svg',
          alt: 'Jesus rises with a towel',
          caption: 'Jesus riseth from supper.',
          verse: '“If I then, your Lord and Master, have washed your feet.” — John 13:4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-washes-feet-s3.svg',
          alt: 'He pours water and washes feet',
          caption: 'After that he poureth water into a bason.',
          verse: '“If I then, your Lord and Master, have washed your feet.” — John 13:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-washes-feet-s4.svg',
          alt: 'He teaches them to love one another',
          caption: 'If I then, your Lord and Master, have washed your.',
          verse: '“John 13.” — John 13:14-15 (KJV)'
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
          caption: 'After six days Jesus taketh Peter, James.',
          verse: '“And he was transfigured before them.” — Matthew 17:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/transfiguration-s2.svg',
          alt: 'Jesus shines with Moses and Elijah',
          caption: 'He was transfigured before them.',
          verse: '“Matthew 17.” — Matthew 17:2-3 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/transfiguration-s3.svg',
          alt: 'A bright cloud overshadows them',
          caption: 'While he yet spake, behold, a bright cloud.',
          verse: '“And he was transfigured before them.” — Matthew 17:5 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/transfiguration-s4.svg',
          alt: 'Jesus stands alone with his friends',
          caption: 'When the disciples heard it, they fell on their face.',
          verse: '“Matthew 17.” — Matthew 17:6-7 (KJV)'
        }
      ]
    },
    {
      id: 'jordan-crossing',
      title: 'Crossing the Jordan',
      verse: 'And the priests that bare the ark of the covenant of the LORD stood firm on dry ground in the midst of Jordan, and all the Israelites passed over on dry ground. — Joshua 3:17',
      lead: 'Four gentle panels that walk through Crossing the Jordan. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God keeps His promise into the land.',
      idea: 'God keeps His promise into the land.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jordan-crossing-s1.svg',
          alt: 'Israel camps by the Jordan River',
          caption: 'Joshua rose early.',
          verse: '“And the priests that bare the ark of the covenant of the LORD.” — Joshua 3:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jordan-crossing-s2.svg',
          alt: 'The priests carry the ark into the river',
          caption: 'It shall come to pass, as soon as the soles of the.',
          verse: '“And the priests that bare the ark of the covenant of the LORD.” — Joshua 3:13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jordan-crossing-s3.svg',
          alt: 'The people cross on dry ground',
          caption: 'The priests which bare the ark of the covenant of.',
          verse: '“And the priests that bare the ark of the covenant of the LORD.” — Joshua 3:17 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jordan-crossing-s4.svg',
          alt: 'Twelve stones for a memorial',
          caption: 'Take you twelve men out of the people and command ye.',
          verse: '“Joshua 4.” — Joshua 4:2-3 (KJV)'
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
          verse: '“The LORD opened the mouth of the ass.” — Numbers 22:21 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/balaams-donkey-s2.svg',
          alt: 'The donkey sees the angel',
          caption: 'The angel of the LORD stood in the way for an.',
          verse: '“Numbers 22.” — Numbers 22:22-23 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/balaams-donkey-s3.svg',
          alt: 'The donkey speaks',
          caption: 'The LORD opened the mouth of the ass.',
          verse: '“The LORD opened the mouth of the ass.” — Numbers 22:28 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/balaams-donkey-s4.svg',
          alt: 'Balaam bows before the angel',
          caption: 'Then the LORD opened the eyes of Balaam.',
          verse: '“The LORD opened the mouth of the ass.” — Numbers 22:31 (KJV)'
        }
      ]
    },
    {
      id: 'elijah-taken-up',
      title: 'Elijah Taken to Heaven',
      verse: 'And Elijah went up by a whirlwind into heaven. - 2 Kings 2:11',
      lead: 'Four gentle panels that walk through Elijah Taken to Heaven. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God receives His faithful servant.',
      idea: 'God receives His faithful servant.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elijah-taken-up-s1.svg',
          alt: 'Elijah and Elisha walk together',
          caption: 'It came to pass, when the LORD would take up Elijah.',
          verse: '“2.” — 2 Kings 2:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-taken-up-s2.svg',
          alt: 'Elijah strikes the Jordan with his mantle',
          caption: 'Elijah took his mantle.',
          verse: '“2.” — 2 Kings 2:8 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-taken-up-s3.svg',
          alt: 'Chariot of fire and horses',
          caption: 'There appeared a chariot of fire.',
          verse: '“2.” — 2 Kings 2:11 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-taken-up-s4.svg',
          alt: 'Elisha picks up Elijah\'s mantle',
          caption: 'Elisha saw it.',
          verse: '“2.” — 2 Kings 2:12 (KJV)'
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
          verse: '“Nehemiah 1.” — Nehemiah 1:2-3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/nehemiah-walls-s2.svg',
          alt: 'The king sends Nehemiah',
          caption: 'The king said unto me.',
          verse: '“Nehemiah 2.” — Nehemiah 2:4-5 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/nehemiah-walls-s3.svg',
          alt: 'The people build with one hand and guard with the other',
          caption: 'They which builded on the wall.',
          verse: '“So built we the wall.” — Nehemiah 4:17 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/nehemiah-walls-s4.svg',
          alt: 'The wall is finished',
          caption: 'So the wall was finished in the twenty and fifth day.',
          verse: '“Nehemiah 6.” — Nehemiah 6:15-16 (KJV)'
        }
      ]
    },
    {
      id: 'jesus-tempted',
      title: 'Jesus Tempted in the Wilderness',
      verse: 'Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God. — Matthew 4:4',
      lead: 'Four gentle panels that walk through Jesus Tempted in the Wilderness. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Answer temptation with God’s Word.',
      idea: 'Answer temptation with God’s Word.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/jesus-tempted-s1.svg',
          alt: 'Jesus fasts in the wilderness',
          caption: 'Then was Jesus led up of the Spirit into the.',
          verse: '“Matthew 4.” — Matthew 4:1-2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/jesus-tempted-s2.svg',
          alt: 'Command these stones to be made bread',
          caption: 'If thou be the Son of God, command that these stones.',
          verse: '“Matthew 4.” — Matthew 4:3-4 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/jesus-tempted-s3.svg',
          alt: 'Cast thyself down from the temple',
          caption: 'If thou be the Son of God, cast thyself down.',
          verse: '“Matthew 4.” — Matthew 4:6-7 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/jesus-tempted-s4.svg',
          alt: 'Get thee hence, Satan',
          caption: 'The devil taketh him up into an exceeding high.',
          verse: '“Matthew 4.” — Matthew 4:8-11 (KJV)'
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
          caption: 'At midnight Paul and Silas prayed.',
          verse: '“And suddenly there was a great earthquake, so that the.” — Acts 16:25 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/paul-silas-prison-s2.svg',
          alt: 'A great earthquake shakes the prison',
          caption: 'Suddenly there was a great earthquake, so that the.',
          verse: '“And suddenly there was a great earthquake, so that the.” — Acts 16:26 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/paul-silas-prison-s3.svg',
          alt: 'The jailer draws his sword',
          caption: 'The keeper of the prison drew out his sword.',
          verse: '“Acts 16.” — Acts 16:27-28 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/paul-silas-prison-s4.svg',
          alt: 'The jailer and his house believe',
          caption: 'He took them the same hour of the night.',
          verse: '“Acts 16.” — Acts 16:33-34 (KJV)'
        }
      ]
    },
    {
      id: 'lydia-purple',
      title: 'Lydia Believes',
      verse: 'Whose heart the Lord opened, that she attended unto the things which were spoken of Paul. — Acts 16:14',
      lead: 'Four gentle panels that walk through Lydia Believes. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: The Lord opens hearts to believe.',
      idea: 'The Lord opens hearts to believe.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/lydia-purple-s1.svg',
          alt: 'Women gather to pray by the river',
          caption: 'On the sabbath we went out of the city by a river.',
          verse: '“Whose heart the Lord opened.” — Acts 16:13 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/lydia-purple-s2.svg',
          alt: 'Lydia listens to Paul',
          caption: 'A certain woman named Lydia, a seller of purple, of.',
          verse: '“Whose heart the Lord opened.” — Acts 16:14 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/lydia-purple-s3.svg',
          alt: 'She is baptized with her household',
          caption: 'When she was baptized.',
          verse: '“Whose heart the Lord opened.” — Acts 16:15 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/lydia-purple-s4.svg',
          alt: 'Lydia welcomes Paul and Silas into her home',
          caption: 'She besought us, saying, If ye have judged me to be.',
          verse: '“Whose heart the Lord opened.” — Acts 16:15 (KJV)'
        }
      ]
    },
    {
      id: 'tabitha-dorcas',
      title: 'Tabitha Raised',
      verse: 'But Peter put them all forth, and kneeled down, and prayed; and turning him to the body said, Tabitha, arise. And she opened her eyes. — Acts 9:40',
      lead: 'Four gentle panels that walk through Tabitha Raised. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Kind deeds matter to God.',
      idea: 'Kind deeds matter to God.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/tabitha-dorcas-s1.svg',
          alt: 'Dorcas helps the poor with coats',
          caption: 'This woman was full of good works and almsdeeds.',
          verse: '“Acts 9.” — Acts 9:36 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/tabitha-dorcas-s2.svg',
          alt: 'She grows sick and dies',
          caption: 'It came to pass in those days.',
          verse: '“But Peter put them all forth.” — Acts 9:37 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/tabitha-dorcas-s3.svg',
          alt: 'Peter kneels and prays',
          caption: 'Peter put them all forth.',
          verse: '“But Peter put them all forth.” — Acts 9:40 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/tabitha-dorcas-s4.svg',
          alt: 'She is alive and many believe',
          caption: 'He gave her his hand.',
          verse: '“Acts 9.” — Acts 9:41-42 (KJV)'
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
          alt: 'Mary and Joseph seeking a place to stay',
          caption: 'Mary and Joseph find no room in the inn.',
          verse: '“There was no room for them in the inn.” — Luke 2:7 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/nativity-s2.svg',
          alt: 'Baby Jesus in the manger',
          caption: 'The baby Jesus is laid in a manger.',
          verse: '“She brought forth her firstborn son… and laid him in a manger.” — Luke 2:7 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/nativity-s3.svg',
          alt: 'Angels announcing Jesus’ birth to shepherds',
          caption: 'Angels tell shepherds good tidings.',
          verse: '“Behold, I bring you good tidings of great joy.” — Luke 2:10 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/nativity-s4.svg',
          alt: 'Shepherds worshiping at the manger',
          caption: 'Shepherds find the child and glorify God.',
          verse: '“The shepherds returned, glorifying and praising God.” — Luke 2:20 (KJV)'
        }
      ]
    },
    {
      id: 'paul-shipwreck',
      title: 'Paul & the Storm at Sea',
      verse: 'And so it came to pass, that they escaped all safe to land. — Acts 27:44',
      lead: 'Four gentle panels that walk through Paul & the Storm at Sea. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God keeps His word in the storm.',
      idea: 'God keeps His word in the storm.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/paul-shipwreck-s1.svg',
          alt: 'A ship sails on the sea',
          caption: 'They put to sea… But not long after there arose.',
          verse: '“Acts 27.” — Acts 27:2 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/paul-shipwreck-s2.svg',
          alt: 'A violent storm batters the ship',
          caption: 'The ship was caught.',
          verse: '“Acts 27.” — Acts 27:15 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/paul-shipwreck-s3.svg',
          alt: 'The ship breaks apart',
          caption: 'The shipmen deemed it expedient to cast four anchors.',
          verse: '“Acts 27.” — Acts 27:29 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/paul-shipwreck-s4.svg',
          alt: 'Everyone reaches shore safely',
          caption: 'It came to pass.',
          verse: '“And so it came to pass.” — Acts 27:44 (KJV)'
        }
      ]
    },
    {
      id: 'rahab-spies',
      title: 'Rahab & the Spies',
      verse: 'Behold, when we come into the land, thou shalt bind this line of scarlet thread in the window which thou didst let us down by. — Joshua 2:18',
      lead: 'Four gentle panels that walk through Rahab & the Spies. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Faith can shelter God’s people.',
      idea: 'Faith can shelter God’s people.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/rahab-spies-s1.svg',
          alt: 'Two men come to the city wall',
          caption: 'Joshua sent two men to spy secretly, saying, Go view.',
          verse: '“Behold, when we come into the land, thou shalt bind this line of.” — Joshua 2:1 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/rahab-spies-s2.svg',
          alt: 'Rahab lets them down by a cord',
          caption: 'She let them down by a cord through the window.',
          verse: '“Behold, when we come into the land, thou shalt bind this line of.” — Joshua 2:15 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/rahab-spies-s3.svg',
          alt: 'The scarlet cord in the window',
          caption: 'Bind this line of scarlet thread in the window which.',
          verse: '“Behold, when we come into the land, thou shalt bind this line of.” — Joshua 2:18 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/rahab-spies-s4.svg',
          alt: 'The men return safely to Joshua',
          caption: 'The men went.',
          verse: '“Joshua 2.” — Joshua 2:23-24 (KJV)'
        }
      ]
    },
    {
      id: 'elijah-widow',
      title: 'Elijah & the Widow’s Oil',
      verse: 'For thus saith the LORD God of Israel, The barrel of meal shall not waste, neither shall the cruse of oil fail. - 1 Kings 17:14',
      lead: 'Four gentle panels that walk through Elijah & the Widow’s Oil. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: God’s jar does not fail.',
      idea: 'God’s jar does not fail.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/elijah-widow-s1.svg',
          alt: 'Elijah meets the widow gathering sticks',
          caption: 'He called to her.',
          verse: '“1.” — 1 Kings 17:10-11 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/elijah-widow-s2.svg',
          alt: 'She makes a small cake first for Elijah',
          caption: 'Fear not.',
          verse: '“1.” — 1 Kings 17:13 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/elijah-widow-s3.svg',
          alt: 'Jars and the cruse of oil',
          caption: 'The barrel of meal wasted not, neither did the cruse.',
          verse: '“1.” — 1 Kings 17:16 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/elijah-widow-s4.svg',
          alt: 'God provides day after day',
          caption: 'For thus saith the LORD God of Israel, The barrel of.',
          verse: '“1.” — 1 Kings 17:14 (KJV)'
        }
      ]
    },
    {
      id: 'philip-ethiopian',
      title: 'Philip & the Ethiopian',
      verse: 'And they went down both into the water, both Philip and the eunuch; and he baptized him. — Acts 8:38',
      lead: 'Four gentle panels that walk through Philip & the Ethiopian. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Scripture leads to Jesus.',
      idea: 'Scripture leads to Jesus.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/philip-ethiopian-s1.svg',
          alt: 'A chariot on the desert road',
          caption: 'Philip ran thither to him.',
          verse: '“And they went down both into the water, both Philip and the.” — Acts 8:30 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/philip-ethiopian-s2.svg',
          alt: 'Philip runs beside the chariot',
          caption: 'The Spirit said unto Philip, Go near.',
          verse: '“Acts 8.” — Acts 8:29 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/philip-ethiopian-s3.svg',
          alt: 'Philip opens the Scripture',
          caption: 'Then Philip opened his mouth.',
          verse: '“And they went down both into the water, both Philip and the.” — Acts 8:35 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/philip-ethiopian-s4.svg',
          alt: 'Baptism in the water',
          caption: 'They went down both into the water, both Philip and.',
          verse: '“Acts 8.” — Acts 8:38-39 (KJV)'
        }
      ]
    },
    {
      id: 'david-spares-saul',
      title: 'David Spares Saul',
      verse: 'Thou art more righteous than I: for thou hast rewarded me good, whereas I have rewarded thee evil. - 1 Samuel 24:17',
      lead: 'Four gentle panels that walk through David Spares Saul. Color each one, save as you go (one panel is enough), then Watch My Story to see your storyboard. One big idea: Mercy is stronger than revenge.',
      idea: 'Mercy is stronger than revenge.',
      scenes: [
        {
          id: '1',
          src: '/coloring-pages/david-spares-saul-s1.svg',
          alt: 'Saul sleeps in the cave',
          caption: 'Saul came to the sheepcotes by the way… and Saul.',
          verse: '“1.” — 1 Samuel 24:3 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/david-spares-saul-s2.svg',
          alt: 'David cuts the skirt of Saul’s robe',
          caption: 'David arose.',
          verse: '“1.” — 1 Samuel 24:4-6 (KJV)'
        },
        {
          id: '3',
          src: '/coloring-pages/david-spares-saul-s3.svg',
          alt: 'David shows Saul the piece of robe',
          caption: 'See the skirt of thy robe in my hand.',
          verse: '“1.” — 1 Samuel 24:11 (KJV)'
        },
        {
          id: '4',
          src: '/coloring-pages/david-spares-saul-s4.svg',
          alt: 'Saul weeps and goes home',
          caption: 'Saul lifted up his voice.',
          verse: '“1.” — 1 Samuel 24:16 (KJV)'
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
          verse: '“Speaking the truth in love.” — Ephesians 4:15 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ll-honesty-s2.svg',
          alt: 'A calm conversation after a hard moment',
          caption: 'A soft answer turns away wrath.',
          verse: '“A soft answer turneth away wrath.” — Proverbs 15:1 (KJV)'
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
          verse: '“Thou shalt love the Lord thy God.” — Matthew 22:37 (KJV)'
        },
        {
          id: '2',
          src: '/coloring-pages/ll-commandments-s2.svg',
          alt: 'Children helping one another with kind hands',
          caption: 'Love your neighbor as yourself.',
          verse: '“Thou shalt love thy neighbour as thyself.” — Matthew 22:39 (KJV)'
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

  function jumpToColorStory(storyId) {
    if (!storyId) return;
    var sec = document.querySelector(
      '.tdb-cat-story[data-tdb-story="' + storyId + '"]'
    );
    if (!sec) return;
    /* Reveal deferred stories when jumped from the picture grid */
    sec.hidden = false;
    sec.classList.remove('tdb-cat-story--deferred');
    try {
      var showAll = document.querySelector('.tdb-cat-show-all-stories');
      if (showAll) showAll.hidden = true;
    } catch (_e) { /* no-op */ }
    sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var firstPanel =
      sec.querySelector('.tdb-cat-panel:not([hidden])') ||
      sec.querySelector('.tdb-cat-panel');
    if (firstPanel) ensureSceneJl(firstPanel);
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
      card.setAttribute(
        'aria-label',
        (story.title || 'Story') + ' — open to color'
      );

      var thumbWrap = document.createElement('span');
      thumbWrap.className = 'tdb-cat-story-grid-thumb-wrap';
      thumbWrap.setAttribute('aria-hidden', 'true');
      var src = storyThumbSrc(story);
      if (src) {
        var img = document.createElement('img');
        img.className = 'tdb-cat-story-grid-thumb';
        img.src = src;
        img.alt = '';
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

      var openLabel = document.createElement('span');
      openLabel.className = 'tdb-cat-story-grid-open';
      openLabel.textContent = 'Color me';

      card.appendChild(thumbWrap);
      card.appendChild(title);
      card.appendChild(status);
      card.appendChild(meter);
      card.appendChild(openLabel);
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

    var note = document.createElement('p');
    note.className = 'tdb-cat-hero-note';
    note.textContent =
      'Pick a picture below, then color. Save on this device, then Watch My Story. No account needed.';

    /* Featured doors still load first for deep links; grid lists every story. */
    var FEATURED_STORY_IDS = {
      creation: true,
      david: true,
      'jesus-children': true,
      'daniel-lions': true,
      'empty-tomb': true
    };

    /* Picture grid like Story Library — always visible first. */
    var gridHeading = document.createElement('h2');
    gridHeading.className = 'tdb-cat-story-grid-heading';
    gridHeading.id = 'tdb-cat-story-grid-h';
    gridHeading.textContent = 'Pick a picture to color';

    var gridLead = document.createElement('p');
    gridLead.className = 'tdb-cat-progress-jump-hint section-note';
    gridLead.textContent =
      'Tap a card. Scroll down to paint. ' + STORIES.length + ' Bible stories.';

    var progressOuter = document.createElement('div');
    progressOuter.className = 'tdb-cat-progress-outer tdb-cat-story-grid-outer';

    var progressWrap = document.createElement('div');
    progressWrap.className = 'tdb-cat-progress tdb-cat-story-grid';
    progressWrap.setAttribute('role', 'region');
    progressWrap.setAttribute('aria-labelledby', 'tdb-cat-story-grid-h');
    progressWrap.setAttribute('aria-label', 'Coloring story pictures');
    progressWrap.tabIndex = 0;

    mount.appendChild(note);
    mount.appendChild(gridHeading);
    mount.appendChild(gridLead);
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

    var showAllStoriesBtn = document.createElement('button');
    showAllStoriesBtn.type = 'button';
    showAllStoriesBtn.className = 'btn btn-secondary tdb-cat-show-all-stories no-print';
    showAllStoriesBtn.textContent = 'Show paint tools for every story';
    showAllStoriesBtn.setAttribute(
      'aria-label',
      'Expand paint tools for every Color and Tell story on this page'
    );
    showAllStoriesBtn.addEventListener('click', function () {
      mount.querySelectorAll('.tdb-cat-story--deferred').forEach(function (sec) {
        sec.hidden = false;
        sec.classList.remove('tdb-cat-story--deferred');
      });
      showAllStoriesBtn.hidden = true;
    });
    /* Grid already lists every story; button still expands all paint sections. */
    mount.appendChild(showAllStoriesBtn);

    for (var si = 0; si < STORIES.length; si++) {
      (function (story) {
        var section = document.createElement('section');
        section.className = 'tdb-cat-story';
        if (story.scenes.length === 1) {
          section.classList.add('is-single-scene');
        }
        section.setAttribute('data-tdb-story', story.id);
        var isFeatured = !!FEATURED_STORY_IDS[story.id];
        var isRequested = !!(requestedStoryId && story.id === requestedStoryId);
        /* Deep link: focus that story. Otherwise start with five doors only. */
        if (requestedStoryId) {
          if (!isRequested) {
            section.hidden = true;
            section.classList.add('tdb-cat-story--deferred');
          }
        } else if (!isFeatured) {
          section.hidden = true;
          section.classList.add('tdb-cat-story--deferred');
        }
        if (isFeatured || isRequested) {
          if (!document.getElementById('tdb-cat-story-start')) {
            section.id = 'tdb-cat-story-start';
          }
        }
        if (requestedStoryId && story.id === requestedStoryId) {
          requestedStorySection = section;
        }

        var h2 = document.createElement('h2');
        h2.className = 'tdb-cat-story-title';
        h2.textContent = story.title;

        var lead = document.createElement('p');
        lead.className = 'tdb-cat-story-lead';
        lead.textContent = story.lead;

        var celebrate = document.createElement('p');
        celebrate.className = 'tdb-cat-story-celebrate';
        celebrate.setAttribute('role', 'status');

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
          'Watch the scenes you’ve saved — one is enough. More panels make a fuller storyboard.';
        section.appendChild(hint);

        mount.appendChild(section);
        updateStoryUI(story, section, watchBtn, celebrate);
      })(STORIES[si]);
    }

    refreshAllProgress();
    if (!mount.querySelector('.tdb-cat-story--deferred')) {
      showAllStoriesBtn.hidden = true;
    }

    // Mount only the active story's visible scene (not all 80+ books).
    function mountVisibleStory(sectionEl) {
      if (!sectionEl) return;
      var panel =
        sectionEl.querySelector('.tdb-cat-panel:not([hidden])') ||
        sectionEl.querySelector('.tdb-cat-panel');
      if (panel) ensureSceneJl(panel);
    }
    if (requestedStorySection) {
      mountVisibleStory(requestedStorySection);
    } else {
      var firstSec = mount.querySelector('.tdb-cat-story');
      mountVisibleStory(firstSec);
    }

    // When a story section scrolls near the viewport, mount its first panel once.
    if (typeof IntersectionObserver === 'function') {
      var io = new IntersectionObserver(
        function (entries) {
          for (var ei = 0; ei < entries.length; ei++) {
            if (!entries[ei].isIntersecting) continue;
            var sec = entries[ei].target;
            var p =
              sec.querySelector('.tdb-cat-panel:not([hidden])') ||
              sec.querySelector('.tdb-cat-panel');
            if (p) ensureSceneJl(p);
          }
        },
        { root: null, rootMargin: '120px 0px', threshold: 0.05 }
      );
      mount.querySelectorAll('.tdb-cat-story').forEach(function (sec) {
        io.observe(sec);
      });
    }

    if (requestedStorySection && typeof requestedStorySection.scrollIntoView === 'function') {
      requestedStorySection.scrollIntoView({ behavior: 'auto', block: 'start' });
      try {
        var requestedTitle = requestedStorySection.querySelector('.tdb-cat-story-title');
        if (requestedTitle && typeof requestedTitle.focus === 'function') requestedTitle.focus({ preventScroll: true });
      } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
