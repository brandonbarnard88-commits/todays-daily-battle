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

    // Psalm 90:14 — mercy that wakes joy (common calendar verse; keep specific).
    if (/^psalm\s+90\s*:\s*14$/i.test(r) || /satisfy us early with thy mercy/i.test(tLower)) {
      return {
        lines: [
          'Ask God to meet you early with kindness, so your whole day can hold real joy.',
          sanitizeText(text),
          'Mercy first — then gladness that lasts longer than a mood.'
        ],
        speaker: 'Moses (Psalm 90)',
        about: 'Moses, praying for God’s people who felt how short and hard life can be.',
        to: 'Israel learning to number their days — and anyone today who needs mercy before the day runs them.',
        plain: 'God, fill us early with Your kindness, so we can rejoice and be glad all day long.',
        modernApplication: 'In ' + yr + ', mornings often start with a phone, a worry list, or a rush. This verse asks for mercy first — kindness from God before the day starts pushing.',
        today: 'Before the noise starts, ask God for mercy early. Joy grows better after kindness than after hurry.',
        action: 'So do this: Before you open messages, pray once: “Satisfy me early with Your mercy.” Then name one thing you can be glad for today.'
      };
    }

    // Strong generic fallback — real layman restatement (not archaic word-swap of the KJV).
    var book = parseHeroBookName(ref);
    var ctx = heroBookRow(book) || { s: 'The biblical writer', a: 'God’s people in their time' };
    var body = sanitizeText(text);
    var bodyLower = body.toLowerCase();
    var curatedPlain = '';
    var dayStep = '';
    try {
      // Prefer the 365 hand-crafted Grove explanations (quality over bulk stamps).
      if (typeof window.TDB_GET_HERO_EXPLANATION_BY_REF === 'function') {
        var dayEx = window.TDB_GET_HERO_EXPLANATION_BY_REF(ref);
        if (dayEx && dayEx.plain) {
          curatedPlain = sanitizeText(dayEx.plain || '');
          dayStep = sanitizeText(dayEx.step || '');
        }
      }
      if ((!curatedPlain || isWeakHeroPlainPaint(curatedPlain, body)) && typeof window.getPlainMeaning === 'function') {
        curatedPlain = sanitizeText(window.getPlainMeaning(ref) || '');
      }
    } catch (_) {}
    var plainEasy = curatedPlain;
    if (!plainEasy || isWeakHeroPlainPaint(plainEasy, body)) {
      plainEasy = buildThemeLaymanPlainPaint(ref, body);
    }
    var themeKey = 'steady';
    var todayLine = '';
    var youLine = '';
    var stepLine = '';
    if (/anxious|careful|worry|fear|afraid|trouble|dismay|terror/i.test(bodyLower)) {
      themeKey = 'fear';
      todayLine = 'In ' + yr + ', fear still shows up in texts, bills, headlines, and quiet 2 AM thoughts. This verse meets that pressure with God’s steady word.';
      youLine = 'You do not have to pretend you are fine. Bring the fear to God and let this verse hold you while you take the next small step.';
      stepLine = 'So do this: Say the verse out loud once. Name the fear in one short sentence. Then ask God to carry it with you for the next hour.';
    } else if (/peace|rest|still|quiet|calm/i.test(bodyLower)) {
      themeKey = 'peace';
      todayLine = 'In ' + yr + ', quiet is rare. This verse offers a real place to set the day down — not by escaping life, but by turning to God in it.';
      youLine = 'If your mind will not settle, this word is for that exact restlessness.';
      stepLine = 'So do this: Sit still for thirty seconds. Read the verse slowly. Whisper, “I receive Your peace,” then take one calm next step.';
    } else if (/mercy|grace|forgiv|compassion|lovingkindness|kind/i.test(bodyLower)) {
      themeKey = 'mercy';
      todayLine = 'In ' + yr + ', people often feel behind, ashamed, or hard on themselves. This verse points to God’s kindness, not your performance.';
      youLine = 'You can come to God as you are. Mercy is not a prize for finishing strong — it is help for right now.';
      stepLine = 'So do this: Tell God one place you need mercy today. Thank Him for it before you try to fix anything.';
    } else if (/strength|strong|courage|wait|weary|faint|renew|help|uphold/i.test(bodyLower)) {
      themeKey = 'strength';
      todayLine = 'In ' + yr + ', tiredness can feel like failure. This verse reminds you there is strength beyond your own.';
      youLine = 'When you feel empty, this word is not asking you to push harder — it is inviting you to lean on God.';
      stepLine = 'So do this: Read the verse once out loud. Ask God for strength for the next task only — not the whole week.';
    } else if (/hope|trust|believe|faith|pray|ask|cast|burden|care/i.test(bodyLower)) {
      themeKey = 'trust';
      todayLine = 'In ' + yr + ', trust gets tested by waiting, silence, and unanswered questions. This verse calls you to hand the weight to God.';
      youLine = 'You can bring Him the real thing on your mind — not a polished prayer.';
      stepLine = 'So do this: Name one worry. Pray it in one sentence. Then say, “I trust You with this,” and leave it there for now.';
    } else if (/made me glad|glad through|works of (thy|your) hands|rejoice|glad|joy|thanks|thanksgiving|praise/i.test(bodyLower)) {
      themeKey = 'gratitude';
      todayLine = 'In ' + yr + ', gladness is easy to skip when the day feels ordinary or hard. This verse says real joy can rise from looking at what God has already done.';
      youLine = 'If your heart feels flat, you do not have to fake cheer. Look at one work of God you can still name — that is enough to start gladness.';
      stepLine = 'So do this: Name one work of God you can see this week — then thank Him for it out loud.';
    } else if (/love|light|shepherd|save|salvation|bless/i.test(bodyLower)) {
      themeKey = 'care';
      todayLine = 'In ' + yr + ', good news can feel thin. This verse holds God’s care in plain sight — something solid to rest in.';
      youLine = 'This word is for you personally: God’s care is not abstract. It meets you in the day you are actually living.';
      stepLine = 'So do this: Read the verse again. Thank God for one true kindness in it. Carry that one line into your next conversation.';
    } else {
      todayLine = 'In ' + yr + ', this verse still speaks into ordinary pressure — work, home, waiting, and quiet battles nobody else sees.';
      youLine = 'Hold this word as God speaking kindly to you today — not as a slogan, but as truth for your next step.';
      stepLine = 'So do this: Read it slowly one more time out loud. Thank God for one clear thing it says, then take the next small step with that line in mind.';
    }
    if (!plainEasy) {
      plainEasy = 'Read this verse slowly. Let one clear phrase stay with you through the next hour.';
    } else if (plainEasy.length > 220) {
      plainEasy = plainEasy.slice(0, 217).trim() + '…';
    }
    if (dayStep) {
      stepLine = 'So do this: ' + dayStep;
    }

    return {
      lines: [
        plainEasy,
        body,
        'Let one clear promise or command stay with you as you walk the next hour.'
      ],
      speaker: ctx.s,
      about: ctx.s + ' (through the words of the KJV).',
      to: ctx.a + ' — and for you in ' + yr + ' facing the same kind of battle.',
      plain: plainEasy,
      modernApplication: todayLine,
      today: youLine,
      action: stepLine,
      themeKey: themeKey
    };
  }

  /** Light KJV → easy English for first-paint layman terms (full engine may refine later). */
  function rephraseHeroKjvToPlain(text) {
    var map = {
      careful: 'worried', beseech: 'ask', thee: 'you', thou: 'you', thy: 'your', thine: 'your', ye: 'you',
      hath: 'has', doth: 'does', shalt: 'shall', wilt: 'will', art: 'are',
      believeth: 'believes', loveth: 'loves', giveth: 'gives', knoweth: 'knows', maketh: 'makes',
      strengtheneth: 'strengthens', keepeth: 'keeps', worketh: 'works', satisfieth: 'satisfies',
      unto: 'to', saith: 'says', verily: 'truly', behold: 'look',
      labour: 'work', laden: 'burdened', dismayed: 'discouraged', whosoever: 'whoever', whatsoever: 'whatever',
      brethren: 'brothers', everlasting: 'forever', mercy: 'kindness', rejoice: 'be glad',
      sustain: 'hold you up', cast: 'give', burden: 'heavy worry'
    };
    var s = sanitizeText(text);
    Object.keys(map).forEach(function (k) {
      var re = new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      s = s.replace(re, map[k]);
    });
    return s.replace(/\s+/g, ' ').trim();
  }

  /** Detect near-verbatim “plain” lines (archaic swap / In plain words: echo). */
  function isWeakHeroPlainPaint(plain, verseText) {
    var pRaw = sanitizeText(plain);
    if (!pRaw) return true;
    if (/^This verse says something true from God for real life today/i.test(pRaw)) return true;
    var strip = function (s) {
      return String(s || '')
        .replace(/^\s*In plain words:\s*/i, '')
        .replace(/^\s*Plain English:\s*/i, '')
        .replace(/^\s*Key idea:\s*/i, '')
        .trim();
    };
    var norm = function (s) {
      var t = strip(s).toLowerCase();
      t = rephraseHeroKjvToPlain(t).toLowerCase();
      return t.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    };
    var p = norm(pRaw);
    var v = norm(verseText);
    if (!p) return true;
    if (v && p === v) return true;
    if (v && (p.indexOf(v) === 0 || v.indexOf(p) === 0) && Math.abs(p.length - v.length) < 48) return true;
    if (v) {
      var pTok = p.split(' ').filter(Boolean);
      var vSet = {};
      v.split(' ').filter(Boolean).forEach(function (tok) { vSet[tok] = true; });
      if (pTok.length >= 6) {
        var hit = 0;
        pTok.forEach(function (tok) { if (vSet[tok]) hit += 1; });
        if (hit / pTok.length >= 0.72) return true;
      }
    }
    return false;
  }

  function buildThemeLaymanPlainPaint(ref, text) {
    var body = sanitizeText(text);
    var lower = body.toLowerCase();
    var r = sanitizeText(ref).toLowerCase();
    if (/91:1/.test(r) || /secret place|shadow of the almighty|dwell/.test(lower)) {
      return 'When you stay close to God, you rest under His protection — safe in His care.';
    }
    if (/11:28/.test(r) || /come unto me|heavy laden|give you rest/.test(lower)) {
      return 'Come to Jesus as you are, tired and carrying too much. He will give you rest.';
    }
    if (/23:1/.test(r) || /lord is my shepherd|shall not want/.test(lower)) {
      return 'The Lord takes care of me like a shepherd. With Him, I have what I need.';
    }
    if (/anxious|careful|worry|fear|afraid|dismay|terror/.test(lower)) {
      return 'You do not have to carry fear alone. Bring it to God and let Him steady you.';
    }
    if (/peace|rest|still|quiet|calm/.test(lower)) {
      return 'God offers real rest — a quiet place to set the day down with Him.';
    }
    if (/mercy|grace|forgiv|compassion|lovingkindness/.test(lower)) {
      return "God's kindness meets you as you are — not after you perform.";
    }
    if (/strength|strong|courage|weary|faint|renew|uphold/.test(lower)) {
      return 'When you feel empty, God gives strength beyond your own.';
    }
    if (/hope|trust|believe|faith|pray|cast|burden/.test(lower)) {
      return 'Hand the real weight to God. Trust that He hears and holds you.';
    }
    if (/love|shepherd|save|salvation|rejoice|glad|joy|bless/.test(lower)) {
      return "God's care is for you today — something solid to hold when the day feels thin.";
    }
    return 'Read this verse slowly. Let one clear phrase stay with you through the next hour.';
  }

  function resolveHeroContext(ref, dayEx) {
    if (dayEx && dayEx.about && dayEx.to) {
      return {
        about: sanitizeText(dayEx.about),
        to: sanitizeText(dayEx.to),
        setting: sanitizeText(dayEx.setting || '')
      };
    }
    if (typeof window.TDB_resolveVerseContext === 'function') {
      try {
        var hit = window.TDB_resolveVerseContext(ref);
        if (hit && hit.about && hit.to) {
          return {
            about: sanitizeText(hit.about),
            to: sanitizeText(hit.to),
            setting: sanitizeText(hit.setting || '')
          };
        }
      } catch (eCtx) { /* non-fatal */ }
    }
    var book = parseHeroBookName(ref);
    var row = heroBookRow(book);
    if (row) return { about: sanitizeText(row.s), to: sanitizeText(row.a), setting: '' };
    return { about: '', to: '', setting: '' };
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
    var dayEx = null;
    try {
      if (typeof window.TDB_GET_HERO_EXPLANATION_BY_REF === 'function') {
        dayEx = window.TDB_GET_HERO_EXPLANATION_BY_REF(ref);
      }
    } catch (eEx) { dayEx = null; }
    var ctx = resolveHeroContext(ref, dayEx);

    var lines = Array.isArray(data.lines) && data.lines.length ? data.lines
      : (offline && Array.isArray(offline.lines) && offline.lines.length) ? offline.lines.slice()
      : (mood && Array.isArray(mood.lines) && mood.lines.length) ? mood.lines.slice()
      : (gen ? gen.lines : [excerptLine(text), 'Let it remind you that God is for you\u2014not distant, not harsh.', 'Give Him thanks for one clear gift in these words, then carry it kindly into your day.']);

    var appText = sanitizeText(data.app || (offline && offline.app) || (mood && mood.app) || (gen && gen.app) || '');
    var curatedPlain = dayEx && dayEx.plain ? sanitizeText(dayEx.plain) : '';
    var curatedStep = dayEx && dayEx.step ? sanitizeText(dayEx.step) : '';
    return {
      ref: ref || sanitizeText(offline && offline.ref) || sanitizeText(mood && mood.ref) || '',
      text: text || sanitizeText(offline && offline.text) || sanitizeText(mood && mood.text) || '',
      lines: lines,
      app: appText,
      speaker: sanitizeText(data.speaker || ctx.about || (offline && offline.speaker) || (gen && gen.speaker) || ''),
      about: sanitizeText(data.about || ctx.about || ''),
      to: sanitizeText(data.to || ctx.to || ''),
      setting: sanitizeText(data.setting || ctx.setting || ''),
      plain: sanitizeText(data.plain || curatedPlain || (offline && offline.plain) || (mood && mood.lines && mood.lines[0]) || (gen && gen.plain) || (lines[0] || '')),
      today: sanitizeText(data.today || (offline && offline.today) || (mood && mood.lines && mood.lines[1]) || (gen && gen.today) || (lines[1] || '')),
      action: sanitizeText(data.action || (curatedStep ? ('So do this: ' + curatedStep) : '') || (offline && offline.action) || (mood && mood.app) || (gen && gen.action) || appText)
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

  /** Action/step lines often land in modernApplication by mistake — keep them out of “How it relates today”. */
  function looksLikeActionStepLine(s) {
    var t = sanitizeText(s);
    if (!t) return false;
    return /^(so do this:|name one |name the |sit still|sit with|write one|list three|list one|ask god|pray this|pray it|return to this|take one|say the|say one|read the verse|read it slowly|thank god|end the day|hold this truth|use this verse|before you open)/i.test(
      t
    );
  }

  function looksLikeCultureLine(s) {
    var t = sanitizeText(s);
    if (!t) return false;
    return /\b20\d{2}\b|headlines|hurry|tension|bills|2 am|phone|ordinary|good news can feel|life can feel|quiet is rare|trust gets tested|tiredness can feel|people often feel/i.test(
      t
    );
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
    var audienceShared = sanitizeText(sh.to != null ? sh.to : sh.audience);
    var stepPrefer = sanitizeText(sh.practicalStep != null ? sh.practicalStep : sh.oneStep);
    var yr = currentYearFresh();
    var lines = Array.isArray(v.lines) ? v.lines : [];
    var book = parseHeroBookName(v.ref);
    var row = heroBookRow(book);
    var ctx = resolveHeroContext(v.ref, {
      about: aboutA || sanitizeText(v.about),
      to: audienceShared || sanitizeText(v.to),
      setting: sanitizeText(v.setting || sh.setting || '')
    });
    var simple = plainE || sanitizeText(v.plain) || sanitizeText(lines[0] || '') || sanitizeText(v.app);
    var who = aboutA || sanitizeText(v.about) || sanitizeText(v.speaker) || ctx.about;
    if (!who) {
      if (row) {
        who = row.s + ' (through the words of Scripture, KJV).';
      } else {
        who = 'The Holy Spirit speaking through Scripture (KJV).';
      }
    }
    var audience = audienceShared || sanitizeText(v.to) || ctx.to;
    if (!audience) {
      audience = row
        ? 'Originally for ' + row.a + ' in their time. The same word speaks to us today.'
        : 'Written for God’s people in Scripture—and for anyone listening now, including you.';
    }
    /* Overrides often put the action in modernApplication — demote those to the step slot. */
    if (modernA && looksLikeActionStepLine(modernA) && !looksLikeCultureLine(modernA)) {
      if (!stepPrefer) stepPrefer = modernA;
      modernA = '';
    }
    var relatesToday = modernA;
    if (!relatesToday || looksLikeActionStepLine(relatesToday)) {
      relatesToday = defaultRelatesTodayLine(yr);
    }
    var curatorYou = sanitizeText(v.today);
    /* lines[1] is often the raw KJV body — do not use it as a personal line. */
    if (!curatorYou && lines[1] && lines[1] !== sanitizeText(v.text) && lines[1].length < 160) {
      var l1 = sanitizeText(lines[1]);
      if (l1 && l1 !== simple && !looksLikeActionStepLine(l1)) curatorYou = l1;
    }
    var relYou = curatorYou;
    if (relYou && looksLikeActionStepLine(relYou)) {
      if (!stepPrefer) stepPrefer = relYou;
      relYou = '';
    }
    if (!relYou && groupA && !isLikelyAudienceLaneBlurb(groupA) && !looksLikeActionStepLine(groupA)) {
      relYou = groupA;
    }
    if (relYou && relatesToday && relYou === relatesToday) {
      relatesToday = defaultRelatesTodayLine(yr);
    }
    if (relYou && relYou === simple) {
      relYou = 'This word is for you in the day you are actually living — not a slogan, but a truth you can hold.';
    } else if (!relYou) {
      relYou = 'This word is for you in the day you are actually living — not a slogan, but a truth you can hold.';
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
      year: yr,
      setting: sanitizeText(ctx.setting || '')
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
    /* BBE simpler English — always-open on home; fill as soon as ref is known. */
    try {
      var bbeRef = v && v.ref ? String(v.ref).replace(/\s*\(KJV\)\s*$/i, '').trim() : '';
      var bbeHost = document.getElementById('heroBbeSimple');
      if (bbeHost && bbeRef) {
        bbeHost.setAttribute('data-bbe-ref', bbeRef);
        var bbeStatus = bbeHost.querySelector('[data-bbe-status]');
        var bbeText = bbeHost.querySelector('[data-bbe-text]');
        if (bbeStatus) bbeStatus.textContent = '';
        if (bbeText) bbeText.textContent = '';
        bbeHost.removeAttribute('data-bbe-loaded');
        var alwaysOpen = bbeHost.getAttribute('data-bbe-always-open') === '1' || bbeHost.tagName !== 'DETAILS';
        if ((alwaysOpen || bbeHost.open) && window.TDBBbeSimple && typeof window.TDBBbeSimple.fillHost === 'function') {
          window.TDBBbeSimple.fillHost(bbeHost.querySelector('.tdb-bbe-simple__body') || bbeHost, bbeRef);
        }
      } else if (bbeRef && window.TDBBbeSimple && typeof window.TDBBbeSimple.wireHero === 'function') {
        window.TDBBbeSimple.wireHero(bbeRef);
      }
    } catch (eBbe) { /* non-fatal */ }
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
      about: v.about || v.speaker,
      to: v.to,
      setting: v.setting || ''
    } : {
      about: v.about || v.speaker,
      to: v.to,
      setting: v.setting || ''
    });

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
    s.src = 'hero-daily-365-data.js?v=20260802-calendar-mix';
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
        if (card) {
          card.setAttribute('hidden', '');
          card.style.display = '';
        }
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
      if (/\bthank|thanks|thanksgiving|grateful|made me glad|glad through|works of (thy|your) hands|rejoice|joyful|joy in|praise\w* unto|magnify|joyful noise|bless the lord, o my soul|enter.*thanksgiving\b/.test(low)) return 'gratitude';
      if (/\bdoubt(s|ed|ful|eth)?\b|unbelief|disbelief|faithless|be not faithless|waver(ing|ed|eth)?\b|staggered not|help thou mine|mine unbelief|look we for another|art thou he that should come\b/.test(low)) return 'doubt';
      if (/\bhope|hopeless|discouraged\b/.test(low)) return 'hope';
      return 'peace';
    }
    var UOG_PLANS = {
      anxiety: [
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
        { href: '/plans.html?plan=universitygrief', label: 'Grief' },
        { href: '/plans.html?plan=griefhope', label: 'Grief to Hope' },
        { href: '/plans.html?plan=psalmscomfort', label: 'Psalms of Comfort' }
      ],
      waiting: [
        { href: '/plans.html?plan=universitywaiting', label: 'Waiting' },
        { href: '/plans.html?plan=trust', label: 'Trust in Uncertainty' },
        { href: '/plans.html?plan=hopeuncertain', label: 'When Hope Feels Thin' }
      ],
      parenting: [
        { href: '/plans.html?plan=universityparenting', label: 'Parenting Young Kids' },
        { href: '/plans.html?plan=parenting', label: 'Parenting' },
        { href: '/plans.html?plan=familyworship', label: 'Family Worship' }
      ],
      exhaustion: [
        { href: '/plans.html?plan=universityexhaustion', label: 'Exhaustion' },
        { href: '/plans.html?plan=wearyhands', label: 'Weary Hands' },
        { href: '/plans.html?plan=peace', label: '7-Day Peace' }
      ],
      gratitude: [
        { href: '/plans.html?plan=psalmspraise', label: 'Psalms of Praise' },
        { href: '/plans.html?plan=gratitude', label: '7-Day Gratitude' },
        { href: '/plans.html?plan=praisethanks30', label: 'Praise and Thanksgiving' },
        { href: '/plans.html?plan=universitygratitude', label: 'Gratitude track' }
      ],
      loneliness: [
        { href: '/plans.html?plan=heartalone', label: 'Heart Feels Alone' },
        { href: '/plans.html?plan=universityloneliness', label: 'Loneliness' },
        { href: '/plans.html?plan=universitygrief', label: 'Grief' }
      ],
      forgiveness: [
        { href: '/plans.html?plan=forgiveness', label: 'Forgiveness' },
        { href: '/plans.html?plan=lettinggo', label: 'Letting Go' },
        { href: '/plans.html?plan=universityforgiveness', label: 'Forgiveness track' }
      ],
      brokenrelations: [
        { href: '/plans.html?plan=peacemakers', label: 'Peacemakers' },
        { href: '/plans.html?plan=universitybroken', label: 'Broken Relationships' },
        { href: '/plans.html?plan=forgiveness', label: 'Forgiveness' }
      ],
      comparison: [
        { href: '/plans.html?plan=universitycontentment', label: 'Contentment' },
        { href: '/plans.html?plan=universitygratitude', label: 'Gratitude' },
        { href: '/plans.html?plan=peace', label: '7-Day Peace' }
      ],
      anger: [
        { href: '/plans.html?plan=angerpeace', label: 'Anger to Peace' },
        { href: '/plans.html?plan=peacemakers', label: 'Peacemakers' },
        { href: '/plans.html?plan=universityanger', label: 'Anger track' }
      ],
      regret: [
        { href: '/plans.html?plan=universityregret', label: 'Regret' },
        { href: '/plans.html?plan=forgiveness', label: 'Forgiveness' },
        { href: '/plans.html?plan=universitygrief', label: 'Grief' }
      ],
      doubt: [
        { href: '/plans.html?plan=doubtassurance', label: 'Doubt to Assurance' },
        { href: '/plans.html?plan=trust', label: 'Trust in Uncertainty' },
        { href: '/plans.html?plan=universitydoubt', label: 'Doubt track' }
      ],
      bitterness: [
        { href: '/plans.html?plan=lettinggo', label: 'Letting Go' },
        { href: '/plans.html?plan=forgiveness', label: 'Forgiveness' },
        { href: '/plans.html?plan=universitybitterness', label: 'Bitterness track' }
      ],
      overwhelm: [
        { href: '/plans.html?plan=overwhelmedburnout', label: 'Overwhelmed / Burnout' },
        { href: '/plans.html?plan=universityexhaustion', label: 'Exhaustion' },
        { href: '/plans.html?plan=peace', label: '7-Day Peace' }
      ],
      parentfear: [
        { href: '/plans.html?plan=universityparentfear', label: 'Fear for My Children' },
        { href: '/plans.html?plan=littlehearts', label: 'Little Hearts, Big Fear' },
        { href: '/plans.html?plan=universityparenting', label: 'Parenting Young Kids' }
      ],
      hope: [
        { href: '/plans.html?plan=hopeuncertain', label: 'When Hope Feels Thin' },
        { href: '/plans.html?plan=trust', label: 'Trust in Uncertainty' },
        { href: '/plans.html?plan=praisethanks30', label: 'Praise and Thanksgiving' }
      ],
      peace: [
        { href: '/plans.html?plan=peace', label: '7-Day Peace' },
        { href: '/plans.html?plan=psalmspraise', label: 'Psalms of Praise' },
        { href: '/plans.html?plan=gratitude', label: '7-Day Gratitude' }
      ]
    };
    window.tdbUogBuildCurriculumPlanList = function (ref, text) {
      var t = uogInferTopicFromRefText(ref, String(text || ''));
      return UOG_PLANS[t] || UOG_PLANS.hope;
    };
  })();
})();
