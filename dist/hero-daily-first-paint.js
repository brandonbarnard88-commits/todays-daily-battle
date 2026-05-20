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

  /** Strip accidental markdown / junk from synced KJV one-liners (e.g. **Ye** swallowed by plain-text cleaners → " are …"). */
  function normalizeHeroKjvLine(t) {
    var s = sanitizeText(t).replace(/\uFEFF/g, '');
    s = s.replace(/\*\*([^*]{0,400}?)\*\*/g, '$1').replace(/\*([^*\n]{0,400}?)\*/g, '$1');
    s = s.replace(/__([^_]{0,400}?)__/g, '$1');
    s = s.replace(/\s+/g, ' ').trim();
    // KJV Matt 5:14: rare markdown/strip paths leave only "are the light…" — restore the missing "Ye".
    if (/^are the light of the world\.?$/i.test(s)) {
      s = 'Ye are the light of the world.';
    }
    // Leading stray quotes / spaces before "are the light…" (e.g. '"' + ' are the light …')
    if (/^[\"'\u201c\u2018\u201d\u2019]*\s*are the light of the world\.?\s*[\"'\u201c\u201d]*$/i.test(s)) {
      s = 'Ye are the light of the world.';
    }
    // Inline clause / short line (<— unique to this verse): any "are the light …" fragment without Ye.
    if (s.length <= 220 && !/\bye\b/i.test(s) && /\bare the light of the world\.?$/i.test(s.trim())) {
      s = 'Ye are the light of the world.';
    }
    return s;
  }

  /** Normalize ref for comparisons (handles Mt/Matt shorthand; strips (KJV)). */
  function normalizeRefBare(ref) {
    var u = String(ref || '').replace(/\uFEFF/g, '').replace(/\*\*/g, '');
    /* Word-boundary Matt avoids eating "Matthew" (Matt\\b does not match "Matthew"). */
    u = u.replace(/\s*\(KJV\)\s*$/i, '').replace(/^Matt\b\.?\s+/i, 'Matthew ').replace(/^Mt\.?\s+/i, 'Matthew ');
    u = u.replace(/\s+/g, ' ').trim();
    return u;
  }

  /** When ref matches Matthew 5:14 but body lost "Ye", restore exact KJV (build + edge browsers). */
  function repairMatthew514ByRef(ref, text) {
    var r = normalizeRefBare(ref);
    if (!/^matthew\s+5\s*:\s*14$/i.test(r)) return text;
    var t = sanitizeText(text).replace(/\uFEFF/g, '').replace(/\s+/g, ' ').trim();
    t = normalizeHeroKjvLine(t);
    if (/^ye\s+/i.test(t)) return t;
    if (/^are the light of the world\.?$/i.test(t)) return 'Ye are the light of the world.';
    if (/^[\"'\u201c\u2018]*\s*are the light of the world\.?$/i.test(t)) return 'Ye are the light of the world.';
    return 'Ye are the light of the world.';
  }
  window.__TDB_normalizeHeroKjvText = normalizeHeroKjvLine;
  window.__TDB_repairMatthew514ByRef = repairMatthew514ByRef;

  function parseHeroFromDom(heroVerseEl, heroRefEl) {
    var refLine = normalizeRefBare(
      sanitizeText(heroRefEl && heroRefEl.textContent).replace(/<[^>]*>/g, '').replace(/\*\*/g, '')
    );
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
    var r = normalizeRefBare(ref || '');
    var tLower = sanitizeText(text).toLowerCase();
    // Safe year (currentYearFresh defined later in file; falls back gracefully)
    var getYr = function () {
      if (typeof currentYearFresh === 'function') return currentYearFresh();
      if (typeof window !== 'undefined' && window.TDB_verseBreakdownStandard && typeof window.TDB_verseBreakdownStandard.currentYear === 'function') {
        return window.TDB_verseBreakdownStandard.currentYear();
      }
      try { return new Date().getFullYear(); } catch (e) { return 2026; }
    };
    var yr = getYr();

    // Prayer + belief verses (Mark 11:24, Matthew 21:22, etc.) — *actual* breakdown of this verse (not meta text about "what the breakdown is"). Matches daily-verse-breakdown skill, VERSE-BREAKDOWN-RULE.md, quiet-dawn tone. No hype.
    if (/ (11:24|21:22|pray.*believ|believ.*pray|receive.*them|ask.*believ|desire.*pray)/.test(r.toLowerCase() + ' ' + tLower) || /mark 11|matthew 21/.test(r.toLowerCase())) {
      return {
        lines: [
          'Jesus teaches that real prayer is paired with belief — you ask, then trust that your Father hears and answers.',
          'What things soever ye desire, when ye pray, believe that ye receive them.',
          'This is not forcing an outcome. It is resting in the One who already knows your need.'
        ],
        speaker: 'Jesus',
        about: 'Jesus, speaking to His disciples right after they saw the fig tree wither because of unbelief.',
        to: 'His disciples who had just witnessed the power of faith (and for us today when we bring real needs to God).',
        plain: 'When you bring a real need to God in prayer, believe that He hears you and will answer. Hold that belief quietly in your heart instead of rushing to worry.',
        modernApplication: 'In ' + yr + ' we often pray and then immediately start carrying the worry again. This verse meets you in that exact moment with a simple, steady invitation: ask once, then believe He has heard.',
        today: 'In ' + yr + ' we often pray and then immediately start carrying the worry again. This verse meets you in that exact moment with a simple, steady invitation: ask once, then believe He has heard.',
        action: 'So do this: Name the one thing heaviest on your heart right now. Pray it out loud. Then quietly say, “I believe you hear me,” and thank Him before you move on. Leave it with Him.'
      };
    }

    // Strength while waiting (Isaiah 40:31 family)
    if (/40:31|isaiah 40|wait upon|renew.*strength|mount up with wings/i.test(r.toLowerCase() + ' ' + tLower)) {
      return {
        lines: [
          'Those who wait on the Lord get fresh strength from Him. They rise above what wears them down.',
          'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
          'Waiting on Him is active trust, not passive. He carries what you cannot.'
        ],
        speaker: 'Isaiah',
        about: 'The prophet Isaiah, bringing comfort from God to His weary people.',
        to: 'God’s people in exile who felt worn out and hopeless (and for anyone today who feels they have no strength left).',
        plain: 'If you wait on the Lord instead of rushing or giving up, He will renew your strength. You will rise like an eagle, run without wearing out, and walk steady.',
        modernApplication: 'In ' + yr + ' the same battles can leave you exhausted. This verse is for the exact moment you feel you have nothing left — God gives fresh strength to those who look to Him instead of ahead or behind.',
        today: 'In ' + yr + ' the same battles can leave you exhausted. This verse is for the exact moment you feel you have nothing left — God gives fresh strength to those who look to Him instead of ahead or behind.',
        action: 'So do this: When weariness hits, pause, read this verse out loud once, picture His strength under you like eagle wings. Then take the next small step He gives.'
      };
    }

    // “Nothing is impossible with God” family (Luke 1:37, Genesis 18:14, Matthew 19:26, etc.)
    if (/1:37|18:14|19:26|nothing.*impossible|impossible.*god|possible.*god/i.test(r.toLowerCase() + ' ' + tLower) || /luke 1|genesis 18|matthew 19/.test(r.toLowerCase())) {
      return {
        lines: [
          'What looks impossible to us is still possible for God. He is not limited by what we can see or do.',
          sanitizeText(text),
          'Trust the One who makes a way where there is no way.'
        ],
        speaker: 'Gabriel (and ultimately God)',
        about: 'The angel Gabriel speaking to Mary about the miracle of Jesus’ birth.',
        to: 'Mary, and through her to everyone who faces what seems humanly impossible.',
        plain: 'With God, nothing is truly impossible. What looks hopeless or out of reach to us is still possible for Him.',
        modernApplication: 'In ' + yr + ' we face situations that feel final or impossible — health, relationships, future, provision. This verse reminds you that God is not bound by the limits you see.',
        today: 'In ' + yr + ' we face situations that feel final or impossible — health, relationships, future, provision. This verse reminds you that God is not bound by the limits you see.',
        action: 'So do this: Name the one thing that feels impossible right now. Say out loud, “With God this is possible,” then thank Him and take the next small step He gives.'
      };
    }

    // Strong generic fallback — verse-aware using book context + simple theme detection. Always provides full who/audience/year-context/you-now/layman/step per rule + skill. No vague "companion" meta.
    var book = parseHeroBookName(ref);
    var ctx = heroBookRow(book) || { s: 'The biblical writer', a: 'God’s people in their time' };
    var theme = '';
    var bodyLower = sanitizeText(text).toLowerCase();
    if (/anxious|careful|worry|fear|afraid|trouble|peace|rest|heavy|burden|cast|wait|strength|weary|faint|eagle|mount|renew/i.test(bodyLower)) theme = 'weariness or fear';
    else if (/hope|trust|believe|pray|receive|ask|faith|possible/i.test(bodyLower)) theme = 'trust and prayer';
    else if (/love|grace|mercy|forgiv|comfort|shepherd|light|salvation/i.test(bodyLower)) theme = 'God’s care';
    else theme = 'your current battle';

    return {
      lines: [
        'This word from Scripture meets you exactly where you are today.',
        sanitizeText(text),
        'Let one clear promise or command stay with you as you walk the next hour.'
      ],
      speaker: ctx.s,
      about: ctx.s + ' (through the words of the KJV).',
      to: ctx.a + ' — and for you in ' + yr + ' facing the same kind of battle.',
      plain: sanitizeText(text) + ' — God can do what looks impossible to us.',
      modernApplication: 'In ' + yr + ', ' + theme + ' can feel heavy or confusing. This verse cuts through with a quiet, steady truth you can carry without performing or pretending.',
      today: 'In ' + yr + ', ' + theme + ' can feel heavy or confusing. This verse cuts through with a quiet, steady truth you can carry without performing or pretending.',
      action: 'So do this: Read the verse slowly one more time out loud. Thank God for one true thing it says to your exact situation today, then take the next small step with that line in mind.'
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

  /** Book-level speaker/audience (matches verse-breakdown.js BOOK_CONTEXT for consistent hero “deep” fields). */
  var HERO_BOOK_CTX = {
    Genesis: { s: 'Moses', a: 'Israel' }, Exodus: { s: 'Moses', a: 'Israel' }, Leviticus: { s: 'Moses', a: 'Israel' }, Numbers: { s: 'Moses', a: 'Israel' }, Deuteronomy: { s: 'Moses', a: 'Israel' },
    Joshua: { s: 'Joshua', a: 'Israel' }, Judges: { s: 'Unknown', a: 'Israel' }, Ruth: { s: 'Unknown', a: 'Israel' },
    '1 Samuel': { s: 'Samuel', a: 'Israel' }, '2 Samuel': { s: 'Nathan', a: 'Israel' }, '1 Kings': { s: 'Unknown', a: 'Israel' }, '2 Kings': { s: 'Unknown', a: 'Israel' },
    '1 Chronicles': { s: 'Chronicler', a: 'Exiles' }, '2 Chronicles': { s: 'Chronicler', a: 'Exiles' }, Ezra: { s: 'Ezra', a: 'Exiles' }, Nehemiah: { s: 'Nehemiah', a: 'Exiles' }, Esther: { s: 'Unknown', a: 'Israel' },
    Job: { s: 'Job and the Lord', a: 'All' }, Psalm: { s: 'David or another psalm writer', a: 'Everyone hurting or thankful' }, Psalms: { s: 'David or another psalm writer', a: 'Everyone hurting or thankful' },
    Proverbs: { s: 'Solomon giving wisdom', a: 'Everyone seeking guidance' }, Ecclesiastes: { s: 'Solomon', a: 'All' }, 'Song of Solomon': { s: 'Solomon', a: 'All' },
    Isaiah: { s: 'Isaiah', a: 'Judah' }, Jeremiah: { s: 'Jeremiah', a: 'Judah and the exiles' }, Lamentations: { s: 'Jeremiah', a: 'Exiles' }, Ezekiel: { s: 'Ezekiel', a: 'Exiles' }, Daniel: { s: 'Daniel', a: 'Exiles' },
    Hosea: { s: 'Hosea', a: 'Israel' }, Joel: { s: 'Joel', a: 'Judah' }, Amos: { s: 'Amos', a: 'Israel' }, Obadiah: { s: 'Obadiah', a: 'Edom' }, Jonah: { s: 'Jonah', a: 'Nineveh' }, Micah: { s: 'Micah', a: 'Judah' }, Nahum: { s: 'Nahum', a: 'Nineveh' }, Habakkuk: { s: 'Habakkuk', a: 'Judah' }, Zephaniah: { s: 'Zephaniah', a: 'Judah' }, Haggai: { s: 'Haggai', a: 'Exiles' }, Zechariah: { s: 'Zechariah', a: 'Exiles' }, Malachi: { s: 'Malachi', a: 'Israel' },
    Matthew: { s: 'Jesus', a: 'Believers' }, Mark: { s: 'Jesus', a: 'Believers' }, Luke: { s: 'Jesus', a: 'Believers' }, John: { s: 'Jesus', a: 'Believers' }, Acts: { s: 'Luke', a: 'Church' },
    Romans: { s: 'Paul', a: 'Rome' }, '1 Corinthians': { s: 'Paul', a: 'Corinth' }, '2 Corinthians': { s: 'Paul', a: 'Corinth' }, Galatians: { s: 'Paul', a: 'Galatia' }, Ephesians: { s: 'Paul', a: 'Ephesus' }, Philippians: { s: 'Paul', a: 'Philippi' }, Colossians: { s: 'Paul', a: 'Colosse' }, '1 Thessalonians': { s: 'Paul', a: 'Thessalonica' }, '2 Thessalonians': { s: 'Paul', a: 'Thessalonica' }, '1 Timothy': { s: 'Paul', a: 'Timothy' }, '2 Timothy': { s: 'Paul', a: 'Timothy' }, Titus: { s: 'Paul', a: 'Titus' }, Philemon: { s: 'Paul', a: 'Philemon' }, Hebrews: { s: 'Unknown', a: 'Hebrew believers' }, James: { s: 'James', a: 'Believers' }, '1 Peter': { s: 'Peter', a: 'Believers' }, '2 Peter': { s: 'Peter', a: 'Believers' }, '1 John': { s: 'John', a: 'Believers' }, '2 John': { s: 'John', a: 'Believers' }, '3 John': { s: 'John', a: 'Gaius' }, Jude: { s: 'Jude', a: 'Believers' }, Revelation: { s: 'John', a: 'Seven churches' }
  };

  function parseHeroBookName(ref) {
    var m = String(ref || '').match(/^(.+?)\s+\d+:\d+/);
    return m ? m[1].trim() : '';
  }

  function heroBookRow(book) {
    if (!book) return null;
    if (HERO_BOOK_CTX[book]) return HERO_BOOK_CTX[book];
    if (book === 'Psalm') return HERO_BOOK_CTX.Psalms;
    return null;
  }

  function setVotdRowVisible(rowEl, pEl, text) {
    var t = sanitizeText(text);
    if (pEl) pEl.textContent = t;
    if (rowEl) rowEl.hidden = !t;
  }

  function currentYearFresh() {
    if (typeof window.TDB_verseBreakdownStandard === 'object' && window.TDB_verseBreakdownStandard && typeof window.TDB_verseBreakdownStandard.currentYear === 'function') {
      return window.TDB_verseBreakdownStandard.currentYear();
    }
    try {
      return new Date().getFullYear();
    } catch (eY) {
      return 2026;
    }
  }

  /** When no curated “today / culture” line exists, still anchor the verse in “now”. */
  function defaultRelatesTodayLine(year) {
    var std = window.TDB_verseBreakdownStandard;
    if (std && typeof std.defaultRelatesTodayLine === 'function') {
      return std.defaultRelatesTodayLine(year);
    }
    var y = typeof year === 'number' ? year : currentYearFresh();
    return 'In ' + y + ', life can feel loud—headlines, hurry, tension. God’s Word here still cuts through as something steady you can carry today.';
  }

  /** One short petition tied to today’s verse (never stores user text). */
  function buildHeroVotdPrayer(refFull) {
    var std = window.TDB_verseBreakdownStandard;
    if (std && typeof std.prayerForRef === 'function') {
      return std.prayerForRef(refFull);
    }
    var r = sanitizeText(refFull);
    var cue = r || 'this verse';
    return 'Lord, sink ' + cue + ' into my heart—not as noise, but as truth that changes how I walk. In Jesus\u2019 name, Amen.';
  }

  /** True when text matches verse-breakdown.js buildGroupApplication() audience lane (not a personal "you" line). */
  function isLikelyAudienceLaneBlurb(txt) {
    var s = sanitizeText(txt);
    if (!s) return false;
    return /^For\s+(your\s+)?group:|^For\s+kids:|^For\s+teens:|^For\s+families:|^For\s+pastors?:|^For\s+leaders:|^For\s+church\s+leaders?:|^For\s+missionaries:|^For\s+street\s+preachers?:|^For\s+Bible\s+study\s+groups?:/i.test(
      s
    );
  }

  /**
   * Same lesson-field logic as Today’s verse deep breakdown (curator “you” first; skip audience “For …” boilerplate).
   */
  function computeHeroVotdBreakdownLessonFields(v, shared) {
    var sh = shared || {};
    var plainE = sanitizeText(sh.plainExplanation != null ? sh.plainExplanation : sh.plain);
    var groupA = sanitizeText(sh.groupApplication != null ? sh.groupApplication : sh.group);
    var modernA = sanitizeText(sh.modernApplication != null ? sh.modernApplication : sh.modern);
    var aboutA = sanitizeText(sh.about);
    var stepPrefer = sanitizeText(sh.practicalStep != null ? sh.practicalStep : sh.oneStep);
    var yr = currentYearFresh();
    var lines = Array.isArray(v.lines) ? v.lines : [];
    var book = parseHeroBookName(v.ref);
    var row = heroBookRow(book);
    var simple = plainE || sanitizeText(v.plain) || sanitizeText(lines[0] || '') || sanitizeText(v.app);
    var who = aboutA || sanitizeText(v.speaker);
    if (!who) {
      if (row) {
        who = row.s + ' (through the words of Scripture, KJV).';
      } else {
        who = 'The Holy Spirit speaking through Scripture (KJV).';
      }
    }
    var audience = row
      ? (row.s === 'Jesus'
          ? 'His disciples who had just seen His word wither a fig tree — and for us when we bring real needs to Him.'
          : 'Originally for ' + row.a + ' in their time. The same word speaks to us today.')
      : 'Written for God’s people in Scripture—and for anyone listening now, including you.';
    var relatesToday = modernA;
    if (!relatesToday) {
      relatesToday = defaultRelatesTodayLine(yr);
    }
    var curatorYou = sanitizeText(v.today) || sanitizeText(lines[1] || '');
    var relYou = curatorYou;
    if (!relYou && modernA) {
      relYou = modernA;
    }
    if (!relYou && groupA && !isLikelyAudienceLaneBlurb(groupA)) {
      relYou = groupA;
    }
    if (relYou && relatesToday && relYou === relatesToday) {
      relatesToday = defaultRelatesTodayLine(yr);
    }
    if (relYou && relYou === simple) {
      relYou = 'Hold this word as God speaking kindly to you—today, personally—not as a slogan you have to manufacture.';
    } else if (!relYou) {
      relYou = 'Hold this word as God speaking kindly to you—today, personally—not as a slogan you have to manufacture.';
    }
    var oneStep = stepPrefer || sanitizeText(v.action) || sanitizeText(v.app);
    if (!oneStep) {
      var stdFb = window.TDB_verseBreakdownStandard;
      oneStep =
        stdFb && typeof stdFb.nextStepFallback === 'function'
          ? stdFb.nextStepFallback()
          : 'Read it slowly one more time—then thank God aloud for one true thing inside it before you move.';
    }
    var prayer = sanitizeText(sh.heroPrayer || sh.simplePrayer);
    if (!prayer) prayer = buildHeroVotdPrayer(v.ref);
    return {
      simple: simple,
      who: who,
      audience: audience,
      relatesToday: relatesToday,
      relYou: relYou,
      oneStep: oneStep,
      prayer: prayer,
      year: yr
    };
  }

  /**
   * Fills #heroSimpleBreakdown + deep fields. Shared payload can include plain / group / modern / about /
   * practicalStep (explicit one-step separate from modern “culture” line).
   * Exposed for index.html renderVerseContent when verse-breakdown hydrates.
   */
  function applyHeroVotdFromInputs(v, shared) {
    var simpleOut = document.getElementById('heroSimpleBreakdown');
    if (!simpleOut) return;
    var lesson = computeHeroVotdBreakdownLessonFields(v, shared);
    var simple = lesson.simple;
    var who = lesson.who;
    var audience = lesson.audience;
    var relatesToday = lesson.relatesToday;
    var relYou = lesson.relYou;
    var oneStep = lesson.oneStep;
    var prayer = lesson.prayer;
    var yr = lesson.year;
    simpleOut.textContent = simple;
    setVotdRowVisible(document.getElementById('heroVbdRowWho'), document.getElementById('heroDeepWho'), who);
    setVotdRowVisible(document.getElementById('heroVbdRowAud'), document.getElementById('heroDeepAudience'), audience);
    setVotdRowVisible(document.getElementById('heroVbdRowCtx'), document.getElementById('heroDeepContext'), relatesToday);
    setVotdRowVisible(document.getElementById('heroVbdRowYou'), document.getElementById('heroDeepYou'), relYou);
    var stepOut = document.getElementById('heroVotdOneStep');
    var stepWrap = document.getElementById('heroVotdNextStep');
    if (stepOut) stepOut.textContent = oneStep;
    if (stepWrap) stepWrap.hidden = false;
    var prayerTarget = document.getElementById('heroVotdPrayer');
    var prayerWrap = document.getElementById('heroVotdPrayerBlock');
    if (prayerTarget) prayerTarget.textContent = prayer;
    if (prayerWrap) prayerWrap.hidden = false;
    try {
      var yrChip = document.getElementById('heroVotdBreakdownYear');
      if (yrChip) yrChip.textContent = String(yr);
    } catch (eYChip) { /* non-fatal */ }
    var std = window.TDB_verseBreakdownStandard;
    if (std && typeof std.hydrateHeroDigDeeper === 'function') {
      std.hydrateHeroDigDeeper(v && v.ref ? v.ref : '', v && v.text ? v.text : '');
    }
    var wrap = document.getElementById('heroVotdBreakdown');
    if (wrap) {
      try {
        wrap.setAttribute('data-tdb-hero-votd', '1');
      } catch (e) { /* non-fatal */ }
    }
    var heroBreakdown = document.getElementById('heroBreakdown');
    var panelsEl = document.getElementById('heroBreakdownPanels');
    var heroApplication = document.getElementById('heroApplication');
    if (heroBreakdown) {
      heroBreakdown.replaceChildren();
      heroBreakdown.setAttribute('hidden', '');
      heroBreakdown.setAttribute('aria-hidden', 'true');
    }
    if (panelsEl) panelsEl.replaceChildren();
    if (heroApplication) {
      heroApplication.textContent = '';
      heroApplication.style.display = 'none';
    }
  }
  window.__TDB_applyHeroVotdFromInputs = applyHeroVotdFromInputs;
  window.__TDB_computeHeroVotdBreakdownLessonFields = computeHeroVotdBreakdownLessonFields;

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
    if (verseRaw.text) verseRaw.text = normalizeHeroKjvLine(verseRaw.text);
    verseRaw.text = repairMatthew514ByRef(verseRaw.ref, verseRaw.text);
    var v = normalizeVerse(verseRaw);
    if (!v.ref) return;
    var sig = v.ref + '\0' + v.text;
    if (window.__TDB_HERO_FIRST_PAINT_SIGNATURE === sig) return;

    var heroBreakdown = document.getElementById('heroBreakdown');
    var heroApplication = document.getElementById('heroApplication');
    var panelsEl = document.getElementById('heroBreakdownPanels');

    if (window.TDBRedLetter && typeof window.TDBRedLetter.applyToElement === 'function') {
      window.TDBRedLetter.applyToElement(heroVerse, v.ref, v.text, { quote: true });
    } else {
      heroVerse.textContent = '\u201c' + v.text + '\u201d';
    }
    try {
      heroVerse.classList.add('verse-body');
    } catch (eCls) { /* non-fatal */ }
    var bkStd = window.TDB_verseBreakdownStandard;
    if (bkStd && typeof bkStd.fillBigKjvStrong === 'function') {
      bkStd.fillBigKjvStrong(heroRef, v.ref);
    } else {
      heroRef.textContent = v.ref + ' (KJV)';
    }

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

    var hasRich = !!(v.plain || v.today || v.action);
    if (!hasRich) {
      if (heroBreakdown) {
        heroBreakdown.replaceChildren();
        heroBreakdown.setAttribute('hidden', '');
        heroBreakdown.setAttribute('aria-hidden', 'true');
      }
      if (panelsEl) panelsEl.replaceChildren();
      if (heroApplication) {
        heroApplication.textContent = '';
        heroApplication.style.display = 'none';
      }
    }
    applyHeroVotdFromInputs(v, hasRich ? {
      plainExplanation: v.plain,
      groupApplication: v.today,
      modernApplication: '',
      practicalStep: v.action || v.app,
      about: v.speaker
    } : null);

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

  /** Homepage: soften Verse-of-day hub rhythm wording; dismiss merged welcome card → hint strip. */
  (function hydrateHomeRhythmWelcome() {
    if (!document.getElementById('home-primary-flow')) return;
    try {
      var rhythmLine =
        document.querySelector('.gentle-rhythm-line') ||
        document.querySelector('#verse-of-the-month .rhythm-note');
      if (rhythmLine) {
        rhythmLine.textContent = 'One gentle day at a time \u2014 no score, just today.';
      }
    } catch (_) { /* non-fatal */ }
    try {
      var dismissBtn = document.getElementById('tdbNewHereDismissBtn');
      if (!dismissBtn) return;
      dismissBtn.addEventListener('click', function () {
        var card = document.getElementById('tdbNewHereCard');
        var hint = document.getElementById('tdbNewHereHint');
        if (card) card.style.display = 'none';
        if (hint) hint.style.display = 'block';
      });
    } catch (_) { /* non-fatal */ }
  })();

  /**
   * University of God: map today’s verse to 2–3 on-site Battle Plan “courses” (KJV, already on /plans).
   * Exposed before index inline verse render; script.js redefines the same on load for other pages.
   */
  (function tdbUogCurriculum() {
    function uogInferTopicFromRefText(ref, text) {
      var low = (String(ref || '') + ' ' + String(text || '')).toLowerCase();
      if (/\banxiety|anxious|worry|stressed?|careful for nothing|careful\b/.test(low)) return 'anxiety';
      if (/\bfear|afraid|panic|scared|terror\b/.test(low)) return 'fear';
      if (/(closet|secret place|shut thy door|a great while before day|a solitary|draw nigh to god|ears are open|double minded|in secret;|in secret,|in secret\.|in secret\)|seeth in secret|seen in secret)\b/.test(low)) return 'secretprayer';
      if (/\bregret\w*|\bif only\b|should have|second guess|second-guess|hindsight|what if i|replaying yesterday|godly sorrow worketh|repentance to salvation|no condemnation to them which are in christ|forgetting those things which are behind|pressed toward the mark\b/.test(low)) return 'regret';
      if (/\bmy spirit was overwhelmed\b|multitude of my thoughts within me\b|troubled on every side.? yet not distressed\b|\bwait thou only upon god\b|\bcasting all your care\b/.test(low)) return 'overwhelm';
      if (/\bgrief|grieve|grieving|mourning|mourn(ed|ing)?|bereave|bereft|\bloss\b|funeral|widow|orphan|weep|weeping|broken\s*heart|contrite|\bsorrow\b/.test(low)) return 'grief';
      if (/\bwait(ing)?\b|tarry|not yet|\bpatience\b|\bpatient\b|hope for that we see not|appointed time|delayed?\b/.test(low)) return 'waiting';
      if (/\bparent\w*\s+fear\b|fear for (my |our )?(child|children|kids)\b|\blittle ones should perish\b|\bgreat shall be the peace of thy children\b|\bsuffer the little children to come\b/.test(low)) return 'parentfear';
      if (/\bparent(ing)?\b|\bchildren\b|\bchild\b|\bmother\b|\bmothers?\b|ye fathers,|fathers, provoke|train up|nurture|admonition|heritage of|little ones|toddler|babies\b/.test(low)) return 'parenting';
      if (/\bexhaust|exhausted|weariness|\bweary\b|\btired\b|weary in well|faint|fainted|heavily laden|no might|satiated the weary|sorrowful soul|giveth his beloved sleep|bread of sorrows|strength is made perfect in weakness|renew their strength|mount up with wings\b/.test(low)) return 'exhaustion';
      if (/\bcompar(e|ing|ison|ed)?\b|comparing themselves|envy|envying|vainglory|esteem other better|commending themselves|measuring themselves|contentment|godliness with content|where envying and strife\b/.test(low)) return 'comparison';
      if (/\b(wrath|angry|anger)\b|slow to anger|slow to wrath|be ye angry|sun go down upon your wrath|grievous words stir|furious man|make no friendship with an angry|deferreth his anger|ruleth his spirit|wrath of man worketh|put away.*wrath|angry man\b/.test(low)) return 'anger';
      if (/\breconcil|reconciled|reconciliation|gained thy brother|between thee and him alone|live peaceably with all|quarrel against|forbearing one another|first be reconciled|ministry of reconciliation|word of reconciliation\b/.test(low)) return 'brokenrelations';
      if (/\bforgive|forgiveness|forgave|forgiven|trespass|trespasses\b/.test(low)) return 'forgiveness';
      if (/\bbitter(ness|ly)?\b|gall of bitterness|root of bitterness|bitter envying|gall and\b/.test(low)) return 'bitterness';
      if (/\blonely|loneliness|\bforsaken\b|forsake me|no companion|desolate and afflicted|solitary in families|comfortless\b/.test(low)) return 'loneliness';
      if (/\bthank|thanks|thanksgiving|grateful|praise\w* unto|magnify|joyful noise|bless the lord, o my soul|enter.*thanksgiving\b/.test(low)) return 'gratitude';
      if (/\bdoubt(s|ed|ful|eth)?\b|unbelief|disbelief|faithless|be not faithless|waver(ing|ed|eth)?\b|staggered not|help thou mine|mine unbelief|look we for another|art thou he that should come\b/.test(low)) return 'doubt';
      if (/\bhope|hopeless|discouraged\b/.test(low)) return 'hope';
      return 'hope';
    }
    var UOG_PLANS = {
      anxiety: [
        { href: '/plans.html?plan=universityoverwhelm', label: 'University of Overwhelm' },
        { href: '/plans.html?plan=universityanxiety', label: 'Anxiety & Fear' },
        { href: '/plans.html?plan=worrytrust', label: 'Worry to Trust' },
        { href: '/plans.html?plan=peace', label: '7-Day Peace' }
      ],
      fear: [
        { href: '/plans.html?plan=universityanxiety', label: 'Anxiety & Fear' },
        { href: '/plans.html?plan=fearnot14', label: 'Fear Not (14 days)' },
        { href: '/plans.html?plan=fearfaith', label: 'Fear to Faith' }
      ],
      secretprayer: [
        { href: '/plans.html?plan=universitysecretprayer', label: 'Secret Prayer' },
        { href: '/plans.html?plan=lordsprayer', label: "The Lord's Prayer" },
        { href: '/plans.html?plan=peace', label: '7-Day Peace' }
      ],
      grief: [
        { href: '/plans.html?plan=universitygrief', label: 'University of Grief' },
        { href: '/plans.html?plan=griefhope', label: 'Grief to Hope' },
        { href: '/plans.html?plan=psalmscomfort', label: 'Psalms of Comfort' }
      ],
      waiting: [
        { href: '/plans.html?plan=universitywaiting', label: 'University of Waiting' },
        { href: '/plans.html?plan=hopeuncertain', label: 'When Hope Feels Thin' },
        { href: '/plans.html?plan=trust', label: 'Trust in Uncertainty' }
      ],
      parenting: [
        { href: '/plans.html?plan=universityparenting', label: 'Parenting Young Kids' },
        { href: '/plans.html?plan=universityparentfear', label: 'Fear for My Children' },
        { href: '/plans.html?plan=parenting', label: 'Parenting' },
        { href: '/plans.html?plan=familyworship', label: 'Family Worship' }
      ],
      exhaustion: [
        { href: '/plans.html?plan=universityexhaustion', label: 'Exhaustion' },
        { href: '/plans.html?plan=universityoverwhelm', label: 'University of Overwhelm' },
        { href: '/plans.html?plan=universitycontentment', label: 'Contentment in Small Seasons' },
        { href: '/plans.html?plan=wearyhands', label: 'Weary Hands' },
        { href: '/plans.html?plan=peace', label: '7-Day Peace' }
      ],
      gratitude: [
        { href: '/plans.html?plan=universitygratitude', label: 'Gratitude' },
        { href: '/plans.html?plan=universitycontentment', label: 'Contentment in Small Seasons' },
        { href: '/plans.html?plan=gratitude', label: '7-Day Gratitude' },
        { href: '/plans.html?plan=psalmspraise', label: 'Psalms of Praise' }
      ],
      loneliness: [
        { href: '/plans.html?plan=universityloneliness', label: 'University of Loneliness' },
        { href: '/plans.html?plan=heartalone', label: 'Heart Feels Alone' },
        { href: '/plans.html?plan=universitygrief', label: 'University of Grief' }
      ],
      forgiveness: [
        { href: '/plans.html?plan=universityforgiveness', label: 'University of Forgiveness' },
        { href: '/plans.html?plan=forgiveness', label: 'Forgiveness' },
        { href: '/plans.html?plan=lettinggo', label: 'Letting Go' }
      ],
      brokenrelations: [
        { href: '/plans.html?plan=universitybroken', label: 'University of Broken Relationships' },
        { href: '/plans.html?plan=universityforgiveness', label: 'University of Forgiveness' },
        { href: '/plans.html?plan=peacemakers', label: 'Peacemakers' }
      ],
      comparison: [
        { href: '/plans.html?plan=universitycontentment', label: 'Contentment in Small Seasons' },
        { href: '/plans.html?plan=universitycomparison', label: 'University of Comparison' },
        { href: '/plans.html?plan=universitygratitude', label: 'University of Gratitude' },
        { href: '/plans.html?plan=peace', label: '7-Day Peace' }
      ],
      anger: [
        { href: '/plans.html?plan=universityanger', label: 'University of Anger' },
        { href: '/plans.html?plan=angerpeace', label: 'Anger to Peace' },
        { href: '/plans.html?plan=peacemakers', label: 'Peacemakers' }
      ],
      regret: [
        { href: '/plans.html?plan=universityregret', label: 'University of Regret' },
        { href: '/plans.html?plan=universitycontentment', label: 'Contentment in Small Seasons' },
        { href: '/plans.html?plan=universityforgiveness', label: 'University of Forgiveness' },
        { href: '/plans.html?plan=universitygrief', label: 'University of Grief' }
      ],
      doubt: [
        { href: '/plans.html?plan=universitydoubt', label: 'University of Doubt' },
        { href: '/plans.html?plan=doubtassurance', label: 'Doubt to Assurance' },
        { href: '/plans.html?plan=trust', label: 'Trust in Uncertainty' }
      ],
      bitterness: [
        { href: '/plans.html?plan=universitybitterness', label: 'University of Bitterness' },
        { href: '/plans.html?plan=universityforgiveness', label: 'University of Forgiveness' },
        { href: '/plans.html?plan=lettinggo', label: 'Letting Go' }
      ],
      overwhelm: [
        { href: '/plans.html?plan=universityoverwhelm', label: 'University of Overwhelm' },
        { href: '/plans.html?plan=overwhelmedburnout', label: 'Overwhelmed / Burnout' },
        { href: '/plans.html?plan=universityexhaustion', label: 'Exhaustion' }
      ],
      parentfear: [
        { href: '/plans.html?plan=universityparentfear', label: 'Fear for My Children' },
        { href: '/plans.html?plan=universityparenting', label: 'Parenting Young Kids' },
        { href: '/plans.html?plan=littlehearts', label: 'Little Hearts, Big Fear' }
      ],
      hope: [
        { href: '/plans.html?plan=hopeuncertain', label: 'When Hope Feels Thin' },
        { href: '/plans.html?plan=universitywaiting', label: 'University of Waiting' },
        { href: '/plans.html?plan=praisethanks30', label: 'Praise and Thanksgiving' }
      ]
    };
    window.tdbUogBuildCurriculumPlanList = function (ref, text) {
      var t = uogInferTopicFromRefText(ref, String(text || ''));
      return UOG_PLANS[t] || UOG_PLANS.hope;
    };
  })();
})();
