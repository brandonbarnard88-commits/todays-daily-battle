/**
 * Homepage hero: deterministic daily verse + breakdown (runs after sync hero-hero-pools.js and hero-daily-365-data.js).
 * Production dist/: build injects today’s verse into index.html (data-tdb-hero-prebuilt) so HTML can
 *   paint before JS; if the 365 calendar is not present we read that DOM verse to avoid legacy-pool drift.
 * Primary: 365-verse UTC day-of-year (__TDB_HERO_DAILY_YEAR) when hero-daily-365-data.js is available.
 * Pools: hero-hero-pools.js (OFFLINE_PACK + VERSES) for normalizeVerse + legacy rotation fallback.
 */
(function () {
  'use strict';

  var OFFLINE_PACK = window.__TDB_HERO_OFFLINE_PACK || [];
  var VERSES = window.__TDB_HERO_VERSES || [];
  var HERO_DAILY_VERSE_ROTATION_EPOCH = 20535;

  function sanitizeText(value) {
    return String(value == null ? '' : value);
  }

  function parseHeroFromDom(heroVerseEl, heroRefEl) {
    var refLine = sanitizeText(heroRefEl && heroRefEl.textContent).replace(/\s*\(KJV\)\s*$/i, '').trim();
    var raw = sanitizeText(heroVerseEl && heroVerseEl.textContent).trim();
    if (raw.charCodeAt(0) === 0x201c && raw.charCodeAt(raw.length - 1) === 0x201d) {
      raw = raw.slice(1, -1);
    } else if (raw.charAt(0) === '"' && raw.charAt(raw.length - 1) === '"') {
      raw = raw.slice(1, -1);
    }
    return { ref: refLine, text: raw };
  }

  function findOfflineByRef(ref) {
    for (var oi = 0; oi < OFFLINE_PACK.length; oi++) {
      if (OFFLINE_PACK[oi].ref === ref) return OFFLINE_PACK[oi];
    }
    return null;
  }

  function findMoodByRef(ref) {
    for (var mi = 0; mi < VERSES.length; mi++) {
      if (VERSES[mi].ref === ref) return VERSES[mi];
    }
    return null;
  }

  function defaultHeroEnrichment(ref, text) {
    var body = sanitizeText(text);
    var excerpt = body.length > 110 ? body.slice(0, 107).trim() + '\u2026' : body;
    return {
      lines: [
        'Let the words land gently\u2014God is steady in what He said.',
        excerpt,
        'Thank Him for one true thing in this verse; let gratitude lift the next step.'
      ],
      app: 'Read it twice, slowly. Smile once on purpose\u2014then tell God thank you for something specific in the verse.',
      speaker: '',
      plain: 'Scripture meets you plainly here: light for the path and food for today.',
      today: 'You can receive this as encouragement without earning it\u2014that is how His words work.',
      action: 'Share one line with someone you love (text or voice)\u2014blessing travels both ways.'
    };
  }

  function normalizeVerse(data) {
    var ref = sanitizeText(data.ref);
    var text = sanitizeText(data.text);
    function excerptLine(t) {
      var s = sanitizeText(t);
      return s.length > 120 ? s.slice(0, 117).trim() + '\u2026' : s;
    }
    var offline = findOfflineByRef(ref);
    var mood = findMoodByRef(ref);
    var gen = !offline ? defaultHeroEnrichment(ref, text) : null;

    var lines = Array.isArray(data.lines) && data.lines.length ? data.lines
      : (offline && Array.isArray(offline.lines) && offline.lines.length) ? offline.lines.slice()
      : (mood && Array.isArray(mood.lines) && mood.lines.length) ? mood.lines.slice()
      : (gen ? gen.lines : [excerptLine(text), 'Let it remind you that God is for you\u2014not distant, not harsh.', 'Give Him thanks for one clear gift in these words, then carry it kindly into your day.']);

    var appText = sanitizeText(data.app || (offline && offline.app) || (mood && mood.app) || (gen && gen.app) || '');
    return {
      ref: ref || sanitizeText(offline && offline.ref) || sanitizeText(mood && mood.ref) || '',
      text: text || sanitizeText(offline && offline.text) || sanitizeText(mood && mood.text) || '',
      lines: lines,
      app: appText,
      speaker: sanitizeText(data.speaker || (offline && offline.speaker) || ''),
      plain: sanitizeText(data.plain || (offline && offline.plain) || (mood && mood.lines && mood.lines[0]) || (gen && gen.plain) || (lines[0] || '')),
      today: sanitizeText(data.today || (offline && offline.today) || (mood && mood.lines && mood.lines[1]) || (gen && gen.today) || (lines[1] || '')),
      action: sanitizeText(data.action || (offline && offline.action) || (mood && mood.app) || (gen && gen.action) || appText)
    };
  }

  function pickHeroVerseForToday() {
    var YEAR365 = window.__TDB_HERO_DAILY_YEAR;
    if (YEAR365 && YEAR365.length) {
      var d = new Date();
      var y = d.getUTCFullYear();
      var jan1 = Date.UTC(y, 0, 1);
      var todayUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      var dayOfYear = Math.floor((todayUtc - jan1) / 86400000) + 1;
      var idx = (dayOfYear - 1) % YEAR365.length;
      return YEAR365[idx];
    }
    var seenRefs = Object.create(null);
    var heroPool = [];
    [OFFLINE_PACK, VERSES].forEach(function (arr) {
      for (var i = 0; i < arr.length; i++) {
        var v = arr[i];
        if (v && v.ref && !seenRefs[v.ref]) {
          seenRefs[v.ref] = true;
          heroPool.push(v);
        }
      }
    });
    var daySeed = Math.floor(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()) / 86400000);
    var poolLen = heroPool.length;
    var legacyIdx = poolLen ? ((daySeed - HERO_DAILY_VERSE_ROTATION_EPOCH) % poolLen + poolLen) % poolLen : 0;
    return heroPool[legacyIdx];
  }

  window.__TDB_pickRawHeroByUtcDay = pickHeroVerseForToday;
  window.__TDB_normalizeHeroVerseFirstPaint = normalizeVerse;

  function applyHeroFirstPaint() {
    var heroVerse = document.getElementById('heroVerse');
    var heroRef = document.getElementById('heroRef');
    if (!heroVerse || !heroRef) return;

    var verseCard = document.getElementById('verseCard');
    var prebuilt = verseCard && verseCard.getAttribute('data-tdb-hero-prebuilt') === '1';
    var YEAR365 = window.__TDB_HERO_DAILY_YEAR;
    var useDomPrebuilt = prebuilt && (!YEAR365 || !YEAR365.length);
    var has365 = YEAR365 && YEAR365.length;
    var hasPools = OFFLINE_PACK.length > 0 || VERSES.length > 0;
    if (!useDomPrebuilt && !has365 && !hasPools) return;

    var verseRaw = useDomPrebuilt ? parseHeroFromDom(heroVerse, heroRef) : pickHeroVerseForToday();
    if (!verseRaw || !verseRaw.ref) return;
    var v = normalizeVerse(verseRaw);
    if (!v.ref) return;
    var sig = v.ref + '\0' + v.text;
    if (window.__TDB_HERO_FIRST_PAINT_SIGNATURE === sig) return;

    var heroBreakdown = document.getElementById('heroBreakdown');
    var heroApplication = document.getElementById('heroApplication');
    var panelsEl = document.getElementById('heroBreakdownPanels');

    heroVerse.textContent = '\u201c' + v.text + '\u201d';
    heroRef.textContent = v.ref + ' (KJV)';

    // #readChapterLink is below the fold; loadTodaysVerse syncs it when first paint already ran.
    var link = document.getElementById('readChapterLink');
    var refStr = v.ref;
    if (link && refStr) {
      var m = refStr.match(/^(.+?)\s+(\d+):\d+/);
      if (m) {
        var book = encodeURIComponent(m[1].trim());
        var chapter = encodeURIComponent(m[2]);
        link.href = 'reader.html?book=' + book + '&chapter=' + chapter + '&ref=' + encodeURIComponent(refStr.trim().replace(/\s+/g, ' '));
        link.setAttribute('aria-label', 'Read ' + m[1] + ' chapter ' + m[2] + ' in full context');
      }
    }

    var title = 'Today\u2019s Daily Battle: ' + v.ref + ' \u2014 Daily KJV Verse';
    document.title = title;
    var metaDesc = document.querySelector('meta[name="description"]');
    var desc = 'Today\u2019s verse: ' + v.ref + ' (KJV). Search by how you\u2019re really feeling, quiet prayer wall, works offline. No ads, no login, no mess.';
    if (metaDesc) metaDesc.setAttribute('content', desc);
    ['og:title', 'twitter:title'].forEach(function (p) {
      var el = document.querySelector('meta[property="' + p + '"], meta[name="' + p + '"]');
      if (el) el.setAttribute('content', title);
    });
    ['og:description', 'twitter:description'].forEach(function (p) {
      var el = document.querySelector('meta[property="' + p + '"], meta[name="' + p + '"]');
      if (el) el.setAttribute('content', desc);
    });

    if (heroBreakdown) heroBreakdown.replaceChildren();
    var hasRich = v.speaker || v.plain || v.today || v.action;
    if (hasRich && panelsEl) {
      if (heroBreakdown) heroBreakdown.style.display = 'none';
      panelsEl.replaceChildren();
      var spec = [
        { label: 'Who\u2019s speaking', text: v.speaker, mod: '' },
        { label: 'Real talk', text: v.plain, mod: '' },
        { label: 'How it lands today', text: v.today, mod: '' },
        { label: 'Do this', text: v.action, mod: 'hbp-panel--action' }
      ];
      for (var si = 0; si < spec.length; si++) {
        var row = spec[si];
        if (!row.text) continue;
        var panel = document.createElement('div');
        panel.className = 'hbp-panel' + (row.mod ? ' ' + row.mod : '');
        var lbl = document.createElement('p');
        lbl.className = 'hbp-label';
        lbl.textContent = row.label;
        var p = document.createElement('p');
        p.className = 'hbp-text';
        p.textContent = row.text;
        panel.appendChild(lbl);
        panel.appendChild(p);
        panelsEl.appendChild(panel);
      }
      if (heroApplication) {
        heroApplication.textContent = '';
        heroApplication.style.display = 'none';
      }
    } else {
      if (heroBreakdown) heroBreakdown.style.display = '';
      if (panelsEl) panelsEl.replaceChildren();
      var displayLines = v.lines.slice(0, 3);
      for (var li = 0; li < displayLines.length; li++) {
        var listItem = document.createElement('li');
        listItem.textContent = sanitizeText(displayLines[li]);
        heroBreakdown.appendChild(listItem);
      }
      if (heroApplication) {
        heroApplication.textContent = v.app;
        heroApplication.style.display = '';
      }
    }

    var imgText = document.getElementById('verseImgText');
    var imgRef = document.getElementById('verseImgRef');
    if (imgText) imgText.textContent = '\u201c' + v.text + '\u201d';
    if (imgRef) imgRef.textContent = v.ref;

    window.__TDB_HERO_FIRST_PAINT_SIGNATURE = sig;
    window.__TDB_HERO_FIRST_PAINT_REF = v.ref;

    try {
      if (typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('tdb-hero-verse-updated'));
      }
    } catch (eHeroEvt) { /* non-fatal */ }
  }

  window.__TDB_reapplyHeroFirstPaint = applyHeroFirstPaint;

  /** Backstop only: load the 365 calendar after idle if the page did not include it up front. */
  function scheduleHero365Hydrate() {
    if (window.__TDB_HERO365_LOAD_SCHEDULED) return;
    if (window.__TDB_HERO_DAILY_YEAR && window.__TDB_HERO_DAILY_YEAR.length) return;
    window.__TDB_HERO365_LOAD_SCHEDULED = true;
    var s = document.createElement('script');
    s.src = 'hero-daily-365-data.js?v=20260325b';
    s.async = true;
    s.setAttribute('data-tdb-hero365', '1');
    s.onload = function () {
      try {
        applyHeroFirstPaint();
      } catch (e365) { /* non-fatal */ }
    };
    s.onerror = function () {
      window.__TDB_HERO365_LOAD_SCHEDULED = false;
    };
    (document.head || document.documentElement).appendChild(s);
  }

  applyHeroFirstPaint();
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(function () { scheduleHero365Hydrate(); }, { timeout: 2500 });
  } else {
    window.setTimeout(scheduleHero365Hydrate, 1);
  }
})();
