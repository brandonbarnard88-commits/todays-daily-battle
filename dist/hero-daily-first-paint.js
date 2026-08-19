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
    if (/1\s*peter\s+1:3/i.test(ref) || /begotten us again unto a lively hope/i.test(bodyLower)) {
      themeKey = 'hope';
      todayLine = 'In ' + yr + ', hope is often treated like a mood. This verse says living hope comes from Jesus rising from the dead — not from you talking yourself up.';
      youLine = 'Living hope is not a mood you have to manufacture. Jesus rose, so hope can stand even when you feel thin.';
      stepLine = 'So do this: Before the next task, bless His name with these words: “Blessed be the God and Father of our Lord Jesus.”';
    } else if (/anxious|careful|worry|fear|afraid|trouble|dismay|terror/i.test(bodyLower)) {
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
      todayLine = 'In ' + yr + ', people often feel behind, ashamed, or hard on themselves. This verse points to God’s mercy, not a leftover performance stamp.';
      youLine = 'Mercy in this verse is help from God for the day you are actually in — not a prize you earn first.';
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
    } else if (/\blove\b|\bcharity\b|\bbeloved\b/i.test(bodyLower)) {
      themeKey = 'love';
      todayLine = 'In ' + yr + ', love is often treated as a mood, a brand, or a feeling you wait to have. This verse says love starts with God — then we give it to one another.';
      youLine = 'You are not asked to manufacture love from an empty tank. Love is of God. Receive it, then give one person a share of it today.';
      stepLine = 'So do this: Choose one person to treat gently because of this verse.';
    } else if (/light|shepherd|save|salvation|bless/i.test(bodyLower)) {
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
    if (/1\s*peter\s+1:3/.test(r) || /begotten us again unto a lively hope/.test(lower)) {
      return 'God’s mercy has given us a living hope — not a mood, but new life because Jesus rose from the dead.';
    }
    if (/91:1/.test(r) || /secret place|shadow of the almighty|dwell/.test(lower)) {
      return 'When you stay close to God, you rest under His protection — safe in His care.';
    }
    if (/11:28/.test(r) || /come unto me|heavy laden|give you rest/.test(lower)) {
      return 'Come to Jesus as you are, tired and carrying too much. He will give you rest.';
    }
    if (/23:1/.test(r) || /lord is my shepherd|shall not want/.test(lower)) {
      return 'The Lord takes care of me like a shepherd. With Him, I have what I need.';
    }
    if (body.length >= 18) {
      var cut = body.split(/[.!?]/)[0] || body;
      if (cut.length > 110) cut = cut.slice(0, 107).replace(/\s+\S*$/, '');
      return cut.replace(/[.!?]$/, '') + '.';
    }
    return '';
  }

  function resolveHeroContext(ref, dayEx) {
    var liveSit = '';
    var liveAbout = '';
    var liveTo = '';
    if (typeof window.TDB_resolveVerseContext === 'function') {
      try {
        var hit = window.TDB_resolveVerseContext(ref);
        if (hit) {
          liveSit = sanitizeText(hit.situation || hit.setting || '');
          liveAbout = sanitizeText(hit.about || '');
          liveTo = sanitizeText(hit.to || '');
        }
      } catch (eCtx) { /* non-fatal */ }
    }
    /* Prefer this day's curated setting (verse-true). Live context is fallback. */
    if (dayEx && dayEx.about && dayEx.to) {
      return {
        about: sanitizeText(dayEx.about) || liveAbout,
        to: sanitizeText(dayEx.to) || liveTo,
        setting: sanitizeText(dayEx.setting || '') || liveSit
      };
    }
    if (liveAbout && liveTo) {
      return { about: liveAbout, to: liveTo, setting: liveSit };
    }
    var book = parseHeroBookName(ref);
    var row = heroBookRow(book);
    if (row) return { about: sanitizeText(row.s), to: sanitizeText(row.a), setting: liveSit };
    return { about: '', to: '', setting: liveSit };
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
      to: sanitizeText((dayEx && dayEx.to) || data.to || ctx.to || ''),
      setting: sanitizeText((dayEx && dayEx.setting) || data.setting || ctx.setting || ''),
      plain: sanitizeText(data.plain || curatedPlain || (offline && offline.plain) || (mood && mood.lines && mood.lines[0]) || (gen && gen.plain) || (lines[0] || '')),
      today: sanitizeText((dayEx && dayEx.today) || data.today || (offline && offline.today) || (mood && mood.lines && mood.lines[1]) || (gen && gen.today) || (lines[1] || '')),
      modernApplication: sanitizeText((dayEx && dayEx.modernApplication) || data.modernApplication || (gen && gen.modernApplication) || ''),
      action: sanitizeText(data.action || (curatedStep ? ('So do this: ' + curatedStep) : '') || (offline && offline.action) || (mood && mood.app) || (gen && gen.action) || appText),
      prayer: sanitizeText((dayEx && dayEx.prayer) || data.prayer || '')
    };
  }

  function pickHeroVerseForToday() {
    var YEAR365 = window.__TDB_HERO_DAILY_YEAR;
    if (YEAR365 && YEAR365.length) {
      var d = new Date();
      var todayUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      var epoch = Date.UTC(2026, 0, 1);
      var days = Math.floor((todayUtc - epoch) / 86400000);
      var idx = ((days % YEAR365.length) + YEAR365.length) % YEAR365.length;
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
    Job: { s: 'Job and the Lord', a: 'All' }, Psalm: { s: 'A named voice in the Psalms — David, Asaph, Moses, or Israel’s worship', a: 'Everyone hurting or thankful' }, Psalms: { s: 'A named voice in the Psalms — David, Asaph, Moses, or Israel’s worship', a: 'Everyone hurting or thankful' },
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

  /** Canonical ref key for binding dig-deeper to the on-screen verse. */
  function normalizeHeroBoundRef(ref) {
    return sanitizeText(ref || '')
      .replace(/\s*\(KJV\)\s*$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function readDisplayedHeroRef() {
    var el = document.getElementById('heroRef');
    if (!el) return '';
    return normalizeHeroBoundRef(el.textContent || '');
  }

  function readDisplayedHeroText() {
    var el = document.getElementById('heroVerse');
    if (!el) return '';
    return sanitizeText(el.textContent || '')
      .replace(/^[\s\u201c\u201d"']+|[\s\u201c\u201d"']+$/g, '')
      .trim();
  }

  function stampHeroDigDeeperBoundRef(ref) {
    var key = normalizeHeroBoundRef(ref);
    ['heroVotdBreakdown', 'heroDigDeeper', 'heroSimpleBreakdown', 'heroVbdPrimary'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        try {
          if (key) el.setAttribute('data-tdb-bound-ref', key);
          else el.removeAttribute('data-tdb-bound-ref');
        } catch (eStamp) { /* non-fatal */ }
      }
    });
  }

  function readHeroDigDeeperBoundRef() {
    var el =
      document.getElementById('heroVotdBreakdown') ||
      document.getElementById('heroSimpleBreakdown') ||
      document.getElementById('heroDigDeeper') ||
      document.getElementById('heroVbdPrimary');
    if (!el) return '';
    return normalizeHeroBoundRef(el.getAttribute('data-tdb-bound-ref') || '');
  }

  /** Never show situation/meaning if they are not bound to the verse on screen. */
  function hideHeroTeachingIfMismatched() {
    var displayed = readDisplayedHeroRef();
    var bound = readHeroDigDeeperBoundRef();
    var wrap = document.getElementById('heroVbdPrimary');
    if (wrap) {
      var ok = !!(displayed && bound && bound === displayed);
      if (ok) {
        wrap.removeAttribute('data-tdb-teaching-locked');
        try { wrap.hidden = false; } catch (eShow) { /* non-fatal */ }
      } else {
        wrap.setAttribute('data-tdb-teaching-locked', '1');
        try { wrap.hidden = true; } catch (eHide) { /* non-fatal */ }
      }
    }
    var bbe = document.getElementById('heroBbeSimple');
    if (bbe) {
      var bbeRef = normalizeHeroBoundRef(bbe.getAttribute('data-bbe-ref') || '');
      var bbeOk = !!(displayed && bbeRef && bbeRef === displayed);
      try { bbe.hidden = !bbeOk; } catch (eBbeHide) { /* non-fatal */ }
    }
  }

  /**
   * Hard clear — never leave yesterday’s situation/who/step under a new verse.
   * Call before every dig-deeper fill.
   */
  function clearHeroDigDeeperShell() {
    setVotdRowVisible(
      document.getElementById('heroVbdRowSit'),
      document.getElementById('heroDeepSituation'),
      ''
    );
    setVotdRowVisible(
      document.getElementById('heroVbdRowWho'),
      document.getElementById('heroDeepWho'),
      ''
    );
    setVotdRowVisible(
      document.getElementById('heroVbdRowAud'),
      document.getElementById('heroDeepAudience'),
      ''
    );
    setVotdRowVisible(
      document.getElementById('heroVbdRowCtx'),
      document.getElementById('heroDeepContext'),
      ''
    );
    setVotdRowVisible(
      document.getElementById('heroVbdRowYou'),
      document.getElementById('heroDeepYou'),
      ''
    );
    var simpleOut = document.getElementById('heroSimpleBreakdown');
    if (simpleOut) simpleOut.textContent = '';
    var sitOut = document.getElementById('heroSimpleSituation');
    if (sitOut) sitOut.textContent = '';
    var meanOut = document.getElementById('heroSimpleMeaning');
    if (meanOut) meanOut.textContent = '';
    var stepOut = document.getElementById('heroVotdOneStep');
    if (stepOut) stepOut.textContent = '';
    var prayerTarget = document.getElementById('heroVotdPrayer');
    if (prayerTarget) prayerTarget.textContent = '';
    stampHeroDigDeeperBoundRef('');
  }

  /** Thin “X speaking to Y” stamp — never prefer this over a real narrative. */
  function isThinSpeakerLine(s) {
    var t = sanitizeText(s);
    if (!t) return true;
    if (/ speaking to /i.test(t) && t.length < 100) return true;
    if (/^.{3,55}\s+speaking to\s+/i.test(t) && t.length < 120) return true;
    return false;
  }

  /** Weak plain stamps from last-resort theme engine, plus BBE used as a takeaway. */
  function isBbeEchoMeaning(plain, ref) {
    var t = sanitizeText(plain);
    if (!t) return false;
    if (/^My loved ones, let us have love for one another/i.test(t)) return true;
    try {
      if (window.TDBTeachingQuality && typeof window.TDBTeachingQuality.isBbeEcho === 'function') {
        return !!window.TDBTeachingQuality.isBbeEcho(t, ref);
      }
      if (window.TDBBbeSimple && typeof window.TDBBbeSimple.getTextSync === 'function') {
        var bbe = sanitizeText(window.TDBBbeSimple.getTextSync(ref) || '');
        if (bbe && t.toLowerCase() === bbe.toLowerCase()) return true;
      }
    } catch (eBbe) { /* non-fatal */ }
    return false;
  }

  function takeawayForHeroRef(ref, verseText) {
    var r = String(ref || '').toLowerCase();
    if (/^1\s+john\s+4:7/.test(r) || /beloved, let us love one another/.test(String(verseText || '').toLowerCase())) {
      return 'Love is not something you manufacture — it comes from God. When you love others, you are showing you belong to Him.';
    }
    if (/^psalm\s+96:1/.test(r) || /o sing unto the lord a new song/.test(String(verseText || '').toLowerCase())) {
      return 'The whole earth is invited to sing a new song to the Lord — praise that is alive, not leftover.';
    }
    if (/^psalm\s+96:2/.test(r) || /bless his name.*salvation from day to day/.test(String(verseText || '').toLowerCase())) {
      return 'Bless the Lord’s name and show His salvation today, then again tomorrow — not a one-day song.';
    }
    try {
      if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') {
        var bd = window.TDBVerseBreakdown.getBreakdown(ref, verseText || '', { group: 'general' }) || {};
        var mean = sanitizeText(bd.plainMeaningOnly || bd.layman || '');
        if (mean && !isWeakMeaningStamp(mean) && !isBbeEchoMeaning(mean, ref)) return mean;
      }
    } catch (eBd) { /* non-fatal */ }
    return '';
  }

  function isWeakMeaningStamp(s) {
    var t = sanitizeText(s);
    if (!t) return true;
    if (/^In plain terms for life today:/i.test(t)) return true;
    if (/Sit with that until one phrase lands/i.test(t)) return true;
    if (/^Read this verse slowly/i.test(t)) return true;
    if (/^What was going on:\s*.{0,60}speaking to/i.test(t)) return true;
    if (/^My loved ones, let us have love for one another/i.test(t)) return true;
    if (/God'?s care is for you today/i.test(t) && /day feels thin/i.test(t)) return true;
    if (/kindness meets you as you are/i.test(t) && /not after you perform/i.test(t)) return true;
    if (/take the verse as it stands/i.test(t)) return true;
    if (/This word is for you in the day you are actually living/i.test(t)) return true;
    return false;
  }

  /** Higher score = better teaching copy. Prefer long narrative over speaker-line. */
  function scoreSituationLine(s) {
    var t = sanitizeText(s).replace(/^What was going on:\s*/i, '').trim();
    if (!t) return 0;
    if (isThinSpeakerLine(t)) return 8;
    var score = t.length;
    if (t.length >= 55) score += 40;
    if (t.length >= 90) score += 30;
    if (/[.!?]/.test(t)) score += 15;
    if (/\b(commit|plans|work|proverb|psalm|sermon|cross|exile|disciple)/i.test(t)) score += 20;
    return score;
  }

  function scoreMeaningLine(s) {
    var t = sanitizeText(s)
      .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
      .replace(/^What it means:\s*/i, '')
      .trim();
    if (!t) return 0;
    if (isWeakMeaningStamp(t)) return 5;
    return t.length + (t.length >= 40 ? 25 : 0);
  }

  function pickBestText(candidates, scorer) {
    var best = '';
    var bestScore = 0;
    for (var i = 0; i < candidates.length; i++) {
      var c = sanitizeText(candidates[i]);
      if (!c) continue;
      var sc = scorer(c);
      if (sc > bestScore) {
        bestScore = sc;
        best = c;
      }
    }
    return best;
  }

  /** Snapshot currently painted hero dig-deeper (only safe when bound to the same ref). */
  function readHeroDigDeeperDomSnapshot() {
    var sitPrimary = sanitizeText(
      document.getElementById('heroSimpleSituation') &&
        document.getElementById('heroSimpleSituation').textContent
    );
    var sitDeep = sanitizeText(
      document.getElementById('heroDeepSituation') &&
        document.getElementById('heroDeepSituation').textContent
    );
    var meanPrimary = sanitizeText(
      document.getElementById('heroSimpleMeaning') &&
        document.getElementById('heroSimpleMeaning').textContent
    );
    var simple = sanitizeText(
      document.getElementById('heroSimpleBreakdown') &&
        document.getElementById('heroSimpleBreakdown').textContent
    );
    var who = sanitizeText(
      document.getElementById('heroDeepWho') && document.getElementById('heroDeepWho').textContent
    );
    var aud = sanitizeText(
      document.getElementById('heroDeepAudience') &&
        document.getElementById('heroDeepAudience').textContent
    );
    var context = sanitizeText(
      document.getElementById('heroDeepContext') &&
        document.getElementById('heroDeepContext').textContent
    );
    var youLine = sanitizeText(
      document.getElementById('heroDeepYou') &&
        document.getElementById('heroDeepYou').textContent
    );
    var meanFromSimple = '';
    if (simple && /What it means:/i.test(simple)) {
      meanFromSimple = simple.replace(/^What was going on:[\s\S]*?What it means:\s*/i, '').trim();
    }
    var sitFromSimple = '';
    if (simple && /^What was going on:/i.test(simple)) {
      sitFromSimple = simple.replace(/^What was going on:\s*/i, '').replace(/\.?\s*What it means:[\s\S]*$/i, '').trim();
    }
    return {
      boundRef: readHeroDigDeeperBoundRef() || '',
      displayedRef: readDisplayedHeroRef() || '',
      situation: pickBestText([sitPrimary, sitDeep, sitFromSimple], scoreSituationLine),
      meaning: pickBestText([meanPrimary, meanFromSimple], scoreMeaningLine),
      who: who,
      audience: aud,
      context: context,
      you: youLine
    };
  }

  /** SSR often ships yesterday’s verse (or Solomon stubs). Never keep that under a different ref. */
  function snapshotMatchesTargetRef(snap, targetRef) {
    if (!snap || typeof snap !== 'object') return false;
    var target = normalizeHeroBoundRef(targetRef);
    if (!target) return false;
    var bound = normalizeHeroBoundRef(snap.boundRef || '');
    /* Unbound leftover HTML is yesterday until inject stamps today’s ref. Never trust it. */
    if (!bound || bound !== target) return false;
    if (snap.situation && situationLooksWrongForRefRuntime(snap.situation, target)) return false;
    if (snap.who && !speakerBelongsToBookRuntime(snap.who, target)) return false;
    return true;
  }

  /** Book name for attribution checks (aligned with build-time verse-teaching-guard). */
  function bookOfHeroRef(ref) {
    var m = String(ref || '').match(/^((?:[1-3]\s+)?[A-Za-z][A-Za-z\s.]+?)\s+\d+:/);
    return m ? m[1].replace(/\./g, '').replace(/\s+/g, ' ').trim() : '';
  }

  function chapterOfHeroRef(ref) {
    var m = String(ref || '').match(/\s+(\d+):\d+/);
    return m ? Number(m[1]) : 0;
  }

  /** Runtime fail-safe: wrong speaker must never paint (blank better than Solomon under a Psalm). */
  function speakerBelongsToBookRuntime(about, ref) {
    if (typeof window !== 'undefined' && window.TDB_verseAccuracy && typeof window.TDB_verseAccuracy.speakerBelongsToBook === 'function') {
      return window.TDB_verseAccuracy.speakerBelongsToBook(about, ref);
    }
    var a = String(about || '').toLowerCase();
    var book = bookOfHeroRef(ref).toLowerCase();
    if (!a || !book) return true;
    if (/^isaiah\b/.test(book) && /\bdavid\b/.test(a) && !/isaiah/.test(a)) return false;
    if (/^joshua\b/.test(book) && /\bdavid\b/.test(a) && !/joshua/.test(a)) return false;
    if (/^deuteronomy\b/.test(book) && /\bdavid\b/.test(a) && !/moses/.test(a)) return false;
    if (/^matthew\b|^mark\b|^luke\b|^john\b/.test(book) && /\bdavid\b/.test(a) && !/jesus/.test(a)) return false;
    if (/^proverbs\b|^ecclesiastes\b/.test(book) && /\bdavid\b/.test(a) && !/solomon/.test(a)) return false;
    if (
      /^romans\b|^corinthians\b|^galatians\b|^ephesians\b|^philippians\b|^colossians\b|^timothy\b/.test(book) &&
      /\bdavid\b/.test(a) &&
      !/paul/.test(a)
    ) {
      return false;
    }
    if (/\bsolomon\b/.test(a)) {
      if (/^psalm/.test(book)) {
        var ch = chapterOfHeroRef(ref);
        if (ch === 72 && /prayer for solomon|for the king|solomon \(or/i.test(a)) return true;
        if (ch === 127 && /solomon|song of degrees/i.test(a)) return true;
        return false;
      }
      if (/^matthew\b|^mark\b|^luke\b|^john\b|^acts\b/.test(book)) return false;
      if (
        /^romans\b|^corinthians\b|^galatians\b|^ephesians\b|^philippians\b|^colossians\b|^thessalonians\b|^timothy\b|^titus\b|^philemon\b|^hebrews\b|^james\b|^peter\b|^jude\b|^revelation\b/.test(
          book
        )
      ) {
        return false;
      }
    }
    if (/\bpaul\b/.test(a) && /^psalm|^matthew\b|^mark\b|^luke\b|^john\b/.test(book) && !/paul/.test(book)) {
      return false;
    }
    return true;
  }

  function situationLooksWrongForRefRuntime(sit, ref) {
    if (typeof window !== 'undefined' && window.TDB_verseAccuracy && typeof window.TDB_verseAccuracy.situationLooksWrongForRef === 'function') {
      return window.TDB_verseAccuracy.situationLooksWrongForRef(sit, ref);
    }
    var s = String(sit || '');
    var r = String(ref || '');
    if (!s || !r) return false;
    if (!/^Psalm(s)?\s+92:/i.test(r) && /Sabbath song of thanksgiving/i.test(s)) return true;
    if (/floods,\s*thrones,\s*and idols|floods and noise cannot unseat/i.test(s)) {
      if (!/^Psalm(s)?\s+93:/i.test(r)) return true;
    }
    if (/straight path for work and plans|learning a straight path/i.test(s) && !/^Proverbs\b/i.test(r)) {
      return true;
    }
    if (/Love one another;\s*test the spirits;\s*God is love;\s*victory that overcomes/i.test(s)) {
      return true;
    }
    if (/victory that overcomes the world/i.test(s) && !/^1 John\s+5:/i.test(r)) {
      return true;
    }
    if (/test the spirits/i.test(s) && !/^1 John\s+4:[1-6]\b/i.test(r)) {
      return true;
    }
    if (/john urges the church to love one another/i.test(s) && !/^1 John\s+4:/i.test(r)) {
      return true;
    }
    var lead = String(s)
      .replace(/^What was going on:\s*/i, '')
      .trim()
      .match(/^(?:the\s+apostle\s+|the\s+prophet\s+)?(solomon|paul|david|peter|james|jude|isaiah|moses|john)\b/i);
    if (lead && lead[1] && !speakerBelongsToBookRuntime(lead[1], r)) return true;
    return false;
  }

  function audienceLooksWrongForRefRuntime(aud, ref) {
    var a = String(aud || '');
    var r = String(ref || '');
    if (!a || !r) return false;
    if (/^Psalm/i.test(r) && /straight path for work and plans/i.test(a)) return true;
    if (!/^Proverbs\b/i.test(r) && /straight path for work and plans/i.test(a)) return true;
    return false;
  }

  /**
   * Missing is better than wrong. Drop Who/Situation/Audience that cannot belong to this verse.
   * Prefer safe resolver fallbacks when available.
   */
  function sanitizeDigDeeperFieldsForRef(ref, fields) {
    var f = fields || {};
    var who = sanitizeText(f.who);
    var situation = sanitizeText(f.situation);
    var audience = sanitizeText(f.audience);
    var blocked = [];
    if (who && !speakerBelongsToBookRuntime(who, ref)) {
      blocked.push('who');
      who = '';
    }
    if (situation && situationLooksWrongForRefRuntime(situation, ref)) {
      blocked.push('situation');
      situation = '';
    }
    if (audience && audienceLooksWrongForRefRuntime(audience, ref)) {
      blocked.push('audience');
      audience = '';
    }
    if (blocked.length && typeof console !== 'undefined' && console.warn) {
      try {
        console.warn('[TDB dig-deeper] blocked mismatched fields for', ref, blocked.join(','));
      } catch (eW) { /* non-fatal */ }
    }
    if (blocked.length && typeof window !== 'undefined' && window.tdbTrack) {
      try {
        window.tdbTrack('tdb_dig_deeper_blocked', { ref: String(ref || ''), fields: blocked.join(',') });
      } catch (eT) { /* non-fatal */ }
    }
    return {
      who: who,
      situation: situation,
      audience: audience,
      blocked: blocked
    };
  }

  /** Thin speaker-line or weak plain stamp — force upgrade when better data is available. */
  function heroDigDeeperLooksWeak() {
    var snap = readHeroDigDeeperDomSnapshot();
    var sit = snap.situation;
    var mean = snap.meaning;
    if (isWeakMeaningStamp(mean)) return true;
    if (isThinSpeakerLine(sit)) return true;
    if (!sit || sit.length < 12) return true;
    if (!mean || mean.length < 12) return true;
    var ctx = sanitizeText(
      document.getElementById('heroDeepContext') &&
        document.getElementById('heroDeepContext').textContent
    );
    if (/life can feel loud|hold this verse as written/i.test(ctx)) return true;
    /* Primary and deep must agree when both present — desync means a partial overwrite. */
    var sitP = sanitizeText(
      document.getElementById('heroSimpleSituation') &&
        document.getElementById('heroSimpleSituation').textContent
    );
    var sitD = sanitizeText(
      document.getElementById('heroDeepSituation') &&
        document.getElementById('heroDeepSituation').textContent
    );
    if (sitP && sitD && scoreSituationLine(sitP) > 40 && isThinSpeakerLine(sitD)) return true;
    return false;
  }

  /**
   * If dig-deeper is bound to a different ref than #heroRef, or content is weak while
   * better context exists, rebuild. Mismatched/stale dig-deeper must never stay on screen.
   * Never wipe a strong SSR line with a weaker recompute.
   */
  function ensureHeroDigDeeperMatchesDisplayedVerse() {
    var displayed = readDisplayedHeroRef();
    if (!displayed) return false;
    var bound = readHeroDigDeeperBoundRef();
    var weak = heroDigDeeperLooksWeak();
    if (bound && bound === displayed && !weak) return false;
    var text = readDisplayedHeroText();
    var v = normalizeVerse({ ref: displayed, text: text });
    if (!v.ref) return false;
    var snap = readHeroDigDeeperDomSnapshot();
    var snapOk = snapshotMatchesTargetRef(snap, displayed);
    var liveSit = '';
    var liveAbout = '';
    var liveTo = '';
    try {
      if (typeof window.TDB_resolveVerseContext === 'function') {
        var hit = window.TDB_resolveVerseContext(displayed) || {};
        liveSit = sanitizeText(hit.situation || hit.setting || '');
        liveAbout = sanitizeText(hit.about || '');
        liveTo = sanitizeText(hit.to || '');
      }
    } catch (eLive) { /* non-fatal */ }
    var bestSit = sanitizeText(v.setting || '');
    if (!bestSit) {
      bestSit = pickBestText(
        [liveSit, snapOk ? snap.situation : ''],
        scoreSituationLine
      );
    }
    var bestPlain = pickBestText([v.plain, snapOk ? snap.meaning : ''], scoreMeaningLine);
    /* Prefer day-explanation plain/step when integrity re-runs after context loads. */
    applyHeroVotdFromInputs(v, {
      plainExplanation: bestPlain || v.plain || '',
      groupApplication: v.today || '',
      modernApplication: v.modernApplication || '',
      practicalStep: v.action || v.app || '',
      about: v.about || v.speaker || liveAbout || (snapOk ? snap.who : '') || '',
      to: v.to || liveTo || (snapOk ? snap.audience : '') || '',
      setting: bestSit || v.setting || '',
      situation: bestSit || v.setting || '',
      preserveDomSnapshot: snapOk ? snap : null
    });
    return true;
  }

  window.__TDB_ensureHeroDigDeeperMatchesDisplayedVerse = ensureHeroDigDeeperMatchesDisplayedVerse;
  window.__TDB_clearHeroDigDeeperShell = clearHeroDigDeeperShell;

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
  function defaultRelatesTodayLine(year, verseText) {
    var y = typeof year === 'number' ? year : currentYearFresh();
    var hook = sanitizeText(verseText || '').replace(/\s+/g, ' ').trim();
    if (hook.length > 72) hook = hook.slice(0, 69).replace(/\s+\S*$/, '') + '…';
    if (hook) return 'In ' + y + ', hold this verse as written: “' + hook.replace(/[.!?]$/, '') + '.”';
    return 'In ' + y + ', hold this verse as written.';
  }

  /** Action/step lines often land in modernApplication by mistake — keep them out of “How it relates today”. */
  function looksLikeActionStepLine(s) {
    var t = sanitizeText(s);
    if (!t) return false;
    return /^(so do this:|name one |name the |sit still|sit with|write one|list three|list one|ask god|pray this|pray it|return to this|take one|say the|say one|read the verse|read it slowly|thank god|end the day|hold this truth|use this verse|before you open|do one concrete|do one kind)/i.test(
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
    try {
      if (typeof window.TDB_GET_HERO_EXPLANATION_BY_REF === 'function') {
        var liveEx = window.TDB_GET_HERO_EXPLANATION_BY_REF(v.ref);
        if (liveEx) {
          var liveModern = sanitizeText(liveEx.modernApplication);
          var liveToday = sanitizeText(liveEx.today);
          var haveModern = sanitizeText(v.modernApplication);
          if (liveModern && (!haveModern || /life can feel loud|hold this verse as written/i.test(haveModern))) {
            v.modernApplication = liveModern;
          }
          if (liveToday && !sanitizeText(v.today)) v.today = liveToday;
        }
      }
    } catch (eLiveEx) { /* non-fatal */ }
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
    var meaningOnly = plainE || sanitizeText(v.plain) || sanitizeText(lines[0] || '') || sanitizeText(v.app);
    meaningOnly = meaningOnly.replace(/^What was going on:[\s\S]*?What it means:\s*/i, '').trim();
    /* Always prefer curated plain over weak theme stamps (even if stamp came first). */
    if (isWeakMeaningStamp(meaningOnly) || isBbeEchoMeaning(meaningOnly, v.ref)) {
      var betterPlain = pickBestText(
        [sanitizeText(v.plain), sanitizeText(sh.preserveDomSnapshot && sh.preserveDomSnapshot.meaning)],
        scoreMeaningLine
      );
      if (betterPlain && !isWeakMeaningStamp(betterPlain) && !isBbeEchoMeaning(betterPlain, v.ref)) {
        meaningOnly = betterPlain;
      } else {
        meaningOnly = takeawayForHeroRef(v.ref, v.text || v.kjv || '') || meaningOnly;
      }
    }
    /* Live resolver + shared + same-ref DOM only — never keep Solomon/SSR stubs under a psalm. */
    var snapIn = sh.preserveDomSnapshot || null;
    var snapOk = snapshotMatchesTargetRef(snapIn, v.ref);
    var snapSit = snapOk ? sanitizeText(snapIn && snapIn.situation) : '';
    var snapMean = snapOk ? sanitizeText(snapIn && snapIn.meaning) : '';
    var snapWho = snapOk ? sanitizeText(snapIn && snapIn.who) : '';
    var snapAud = snapOk ? sanitizeText(snapIn && snapIn.audience) : '';
    function sitForThisRef(s) {
      var t = sanitizeText(s);
      if (!t) return '';
      if (situationLooksWrongForRefRuntime(t, v.ref)) return '';
      return t;
    }
    var situation = sitForThisRef(v.setting || '');
    if (!situation) {
      situation = pickBestText(
        [
          sitForThisRef(ctx.setting || ''),
          sitForThisRef(sh.situation || ''),
          sitForThisRef(sh.setting || ''),
          sitForThisRef(snapSit)
        ],
        scoreSituationLine
      );
    }
    /* Last resort only: speaker-line when nothing longer exists. */
    if (!situation && ctx.about && ctx.to) {
      situation = sanitizeText(ctx.about) + ' speaking to ' + sanitizeText(ctx.to) + '.';
    }
    if (isThinSpeakerLine(situation)) {
      var upgradeSit = pickBestText(
        [
          sanitizeText(v.setting || ''),
          sanitizeText(sh.situation || sh.setting || ''),
          snapSit
        ],
        scoreSituationLine
      );
      if (upgradeSit && scoreSituationLine(upgradeSit) > scoreSituationLine(situation)) {
        situation = upgradeSit;
      }
    }
    var meaningClean = meaningOnly.replace(/^What it means:\s*/i, '');
    if (isWeakMeaningStamp(meaningClean) || isBbeEchoMeaning(meaningClean, v.ref)) {
      var upgradeMean = pickBestText(
        [
          sanitizeText(v.plain),
          sanitizeText(sh.plainExplanation || sh.plain || ''),
          snapMean
        ],
        scoreMeaningLine
      );
      if (upgradeMean && !isWeakMeaningStamp(upgradeMean) && !isBbeEchoMeaning(upgradeMean, v.ref)) {
        meaningClean = upgradeMean;
      } else {
        meaningClean = takeawayForHeroRef(v.ref, v.text || v.kjv || '') || meaningClean;
      }
    }
    var simple = meaningClean;
    if (situation && meaningClean) {
      simple =
        'What was going on: ' +
        situation.replace(/\.$/, '') +
        '. What it means: ' +
        meaningClean;
    }
    var who = aboutA || sanitizeText(v.about) || sanitizeText(v.speaker) || ctx.about;
    /* Prefer fuller who over stripped bare name — only when both name the same speaker family. */
    if (who && who.length < 12 && ctx.about && sanitizeText(ctx.about).length > who.length) {
      who = sanitizeText(ctx.about);
    }
    /* Same-ref DOM only (length alone used to keep “Solomon giving wisdom” under Psalms). */
    if (snapWho && sanitizeText(snapWho).length > sanitizeText(who).length + 4) {
      who = snapWho;
    }
    if (!who) {
      if (row) {
        who = row.s + ' (through the words of Scripture, KJV).';
      } else {
        who = 'The Holy Spirit speaking through Scripture (KJV).';
      }
    }
    var audience = sanitizeText(v.to) || audienceShared || ctx.to;
    if (snapAud && sanitizeText(snapAud).length > sanitizeText(audience).length + 4) {
      audience = snapAud;
    }
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
    function isThinRelatesToday(s) {
      return /life can feel loud|hold this verse as written/i.test(sanitizeText(s));
    }
    var snapCtx = snapOk ? sanitizeText(snapIn && snapIn.context) : '';
    var curatedNow = sanitizeText(v.modernApplication || '');
    if (isThinRelatesToday(curatedNow)) curatedNow = '';
    var relatesToday = curatedNow;
    if (!relatesToday || looksLikeActionStepLine(relatesToday)) {
      relatesToday = modernA;
    }
    if (!relatesToday || looksLikeActionStepLine(relatesToday) || isThinRelatesToday(relatesToday)) {
      if (snapCtx && !isThinRelatesToday(snapCtx) && !looksLikeActionStepLine(snapCtx)) {
        relatesToday = snapCtx;
      } else {
        relatesToday = curatedNow || '';
      }
    }
    if (isThinRelatesToday(relatesToday)) relatesToday = curatedNow || (snapCtx && !isThinRelatesToday(snapCtx) ? snapCtx : '');
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
      relatesToday = curatedNow || (snapCtx && !isThinRelatesToday(snapCtx) ? snapCtx : '');
    }
    if (relYou && relYou === simple) {
      relYou = '';
    }
    if (!relYou) {
      var hookYou = sanitizeText(v.text || '').replace(/\s+/g, ' ').trim();
      if (hookYou.length > 72) hookYou = hookYou.slice(0, 69).replace(/\s+\S*$/, '') + '…';
      relYou = hookYou
        ? 'Hold this verse in the hour you are in: “' + hookYou.replace(/[.!?]$/, '') + '.”'
        : (audience || 'This verse is for the hour you are actually in.');
    }
    var oneStep = stepPrefer || sanitizeText(v.action) || sanitizeText(v.app);
    if (!oneStep) {
      var stdFb = window.TDB_verseBreakdownStandard;
      oneStep =
        stdFb && typeof stdFb.nextStepFallback === 'function'
          ? stdFb.nextStepFallback()
          : 'Read it slowly one more time—then thank God aloud for one true thing inside it before you move.';
    }
    var prayer = sanitizeText(v.prayer || sh.heroPrayer || sh.simplePrayer);
    if (!prayer || /sink .+ into my heart/i.test(prayer)) {
      var dayPray = '';
      try {
        if (typeof window.TDB_GET_HERO_EXPLANATION_BY_REF === 'function') {
          var prayRow = window.TDB_GET_HERO_EXPLANATION_BY_REF(v.ref);
          dayPray = sanitizeText(prayRow && prayRow.prayer);
        }
      } catch (ePray) { dayPray = ''; }
      if (dayPray) prayer = dayPray;
    }
    if (!prayer || /sink .+ into my heart/i.test(prayer)) prayer = buildHeroVotdPrayer(v.ref);
    /* Runtime fail-safe: never return Solomon/wrong-cluster copy for this ref. */
    var safe = sanitizeDigDeeperFieldsForRef(v.ref, {
      who: who,
      situation: situation,
      audience: audience
    });
    who = safe.who;
    situation = safe.situation;
    audience = safe.audience;
    if (situation && meaningClean) {
      simple =
        'What was going on: ' +
        situation.replace(/\.$/, '') +
        '. What it means: ' +
        meaningClean;
    } else if (meaningClean) {
      simple = meaningClean;
    } else {
      simple = situation || '';
    }
    return {
      simple: simple,
      meaningOnly: meaningClean || meaningOnly,
      who: who,
      audience: audience,
      situation: situation,
      relatesToday: relatesToday,
      relYou: relYou,
      oneStep: oneStep,
      prayer: prayer,
      year: yr,
      setting: sanitizeText(situation || ctx.setting || '')
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
    var refKey = normalizeHeroBoundRef(v && v.ref);
    if (!refKey) return;

    /* Snapshot strong SSR/inject lines before wipe — never downgrade teaching quality. */
    var shIn = shared || {};
    if (!shIn.preserveDomSnapshot) {
      shIn = Object.assign({}, shIn, { preserveDomSnapshot: readHeroDigDeeperDomSnapshot() });
    }

    /* Atomic replace: wipe stale dig-deeper before writing this ref’s fields. */
    clearHeroDigDeeperShell();

    var lesson = computeHeroVotdBreakdownLessonFields(v, shIn);
    var simple = lesson.simple;
    var who = lesson.who;
    var audience = lesson.audience;
    var situation = lesson.situation || lesson.setting || '';
    var meaningOnly = sanitizeText(lesson.meaningOnly || '');
    if (!meaningOnly && simple) {
      meaningOnly = /^What was going on:/i.test(simple)
        ? simple.replace(/^What was going on:[\s\S]*?What it means:\s*/i, '').trim()
        : simple;
    }
    /* Prefer stronger lines only when the pre-clear DOM was already bound to this same verse. */
    var snap = shIn.preserveDomSnapshot || {};
    if (snapshotMatchesTargetRef(snap, refKey)) {
      var snapSitOk = snap.situation && !situationLooksWrongForRefRuntime(snap.situation, refKey)
        ? snap.situation
        : '';
      situation = pickBestText([situation, snapSitOk], scoreSituationLine);
      meaningOnly = pickBestText([meaningOnly, snap.meaning], scoreMeaningLine);
    }
    /* Last line of defense before paint — blank mismatched fields rather than show them. */
    var paintSafe = sanitizeDigDeeperFieldsForRef(refKey, {
      who: who,
      situation: situation,
      audience: audience
    });
    who = paintSafe.who;
    situation = paintSafe.situation;
    audience = paintSafe.audience;
    if (situation && meaningOnly) {
      simple =
        'What was going on: ' +
        situation.replace(/\.$/, '') +
        '. What it means: ' +
        meaningOnly;
    } else if (meaningOnly) {
      simple = meaningOnly;
    } else {
      simple = situation || '';
    }
    var relatesToday = lesson.relatesToday;
    var relYou = lesson.relYou;
    var oneStep = lesson.oneStep;
    var prayer = lesson.prayer;
    var yr = lesson.year;
    function isThinRelatesTodayPaint(s) {
      return /life can feel loud|hold this verse as written/i.test(sanitizeText(s));
    }
    if (!relatesToday || isThinRelatesTodayPaint(relatesToday) || looksLikeActionStepLine(relatesToday)) {
      var keepCtx = '';
      if (snapshotMatchesTargetRef(snap, refKey)) {
        keepCtx = sanitizeText(snap.context);
      }
      if (keepCtx && !isThinRelatesTodayPaint(keepCtx) && !looksLikeActionStepLine(keepCtx)) {
        relatesToday = keepCtx;
      } else {
        try {
          if (typeof window.TDB_GET_HERO_EXPLANATION_BY_REF === 'function') {
            var paintEx = window.TDB_GET_HERO_EXPLANATION_BY_REF(refKey);
            var paintModern = sanitizeText(paintEx && paintEx.modernApplication);
            if (paintModern && !isThinRelatesTodayPaint(paintModern) && !looksLikeActionStepLine(paintModern)) {
              relatesToday = paintModern;
            } else {
              relatesToday = '';
            }
          } else {
            relatesToday = '';
          }
        } catch (ePaintEx) {
          relatesToday = '';
        }
      }
    }
    /* Combined line is a11y-only legacy; keep text but never show it (CSS hard-hides). */
    simpleOut.textContent = simple;
    simpleOut.setAttribute('aria-hidden', 'true');
    try {
      simpleOut.hidden = true;
    } catch (eHide) { /* non-fatal */ }
    var sitPrimary = document.getElementById('heroSimpleSituation');
    var meanPrimary = document.getElementById('heroSimpleMeaning');
    /* Primary split owns situation/meaning; dig-deeper situation row stays hidden (no duplicate). */
    if (sitPrimary) sitPrimary.textContent = situation || '';
    if (meanPrimary) meanPrimary.textContent = meaningOnly || '';
    setVotdRowVisible(document.getElementById('heroVbdRowSit'), document.getElementById('heroDeepSituation'), '');
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

    /* Stamp BEFORE cross-ref/plan hydrate so partial failures still know the bound ref. */
    stampHeroDigDeeperBoundRef(refKey);
    hideHeroTeachingIfMismatched();
    var wrap = document.getElementById('heroVotdBreakdown');
    if (wrap) {
      try {
        wrap.setAttribute('data-tdb-hero-votd', '1');
      } catch (e) { /* non-fatal */ }
    }

    var std = window.TDB_verseBreakdownStandard;
    if (std && typeof std.hydrateHeroDigDeeper === 'function') {
      std.hydrateHeroDigDeeper(v && v.ref ? v.ref : '', v && v.text ? v.text : '');
    }
    /* Cross-ref hydrate must not leave dig-deeper on another verse — re-stamp after. */
    stampHeroDigDeeperBoundRef(refKey);
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
    var has365 = YEAR365 && YEAR365.length;
    /* Prefer calendar pick whenever 365 is loaded — never trust stale inject for dig-deeper. */
    var useDomPrebuilt = prebuilt && !has365;
    var hasPools = OFFLINE_PACK.length > 0 || VERSES.length > 0;
    if (!useDomPrebuilt && !has365 && !hasPools) return;

    var verseRaw = useDomPrebuilt ? parseHeroFromDom(heroVerse, heroRef) : pickHeroVerseForToday();
    if (!verseRaw || !verseRaw.ref) return;
    if (verseRaw.text) verseRaw.text = normalizeHeroKjvLine(verseRaw.text);
    verseRaw.text = repairMatthew514ByRef(verseRaw.ref, verseRaw.text);
    var v = normalizeVerse(verseRaw);
    if (!v.ref) return;
    var sig = v.ref + '\0' + v.text;
    if (window.__TDB_HERO_FIRST_PAINT_SIGNATURE === sig) {
      /* Same verse text — still repair dig-deeper if bound ref drifted or was wiped. */
      ensureHeroDigDeeperMatchesDisplayedVerse();
      return;
    }

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
    hideHeroTeachingIfMismatched();

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

    var title = 'Today\u2019s Daily Battle \u2014 Today\u2019s Verse \u2014 ' + v.ref;
    document.title = title;
    var metaDesc = document.querySelector('meta[name="description"]');
    var desc = 'Today\u2019s verse: ' + v.ref + ' (KJV). Less scroll, more soul. For Family, For Country, For GOD. No ads, no login wall.';
    if (metaDesc) metaDesc.setAttribute('content', desc);
    try {
      if (!window.__tdbTimeToFirstVerseLogged) {
        window.__tdbTimeToFirstVerseLogged = true;
        var ms = Math.round(
          (window.performance && typeof performance.now === 'function')
            ? performance.now()
            : 0
        );
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('time_to_first_verse', {
            ms: ms,
            ref: String(v.ref || '').slice(0, 64),
            source: 'hero_daily_first_paint'
          });
        }
        if (window.performance && typeof performance.mark === 'function') {
          performance.mark('tdb-first-verse');
        }
      }
    } catch (eTtfv) { /* non-fatal */ }
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
      modernApplication: v.modernApplication || '',
      practicalStep: v.action || v.app,
      about: v.about || v.speaker,
      to: v.to,
      setting: v.setting || '',
      situation: v.setting || ''
    } : {
      about: v.about || v.speaker,
      to: v.to,
      setting: v.setting || '',
      situation: v.setting || ''
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

  /**
   * Continuous integrity: dig-deeper must always match #heroRef.
   * Catches race conditions (inject + 365 + breakdown engine) that used to leave Psalm 92 under Prov 16:3.
   */
  (function wireHeroDigDeeperIntegrityLock() {
    var scheduled = false;
    function runCheck() {
      scheduled = false;
      try {
        ensureHeroDigDeeperMatchesDisplayedVerse();
      } catch (eLock) { /* non-fatal */ }
    }
    function scheduleCheck() {
      try { hideHeroTeachingIfMismatched(); } catch (eHideNow) { /* non-fatal */ }
      if (scheduled) return;
      scheduled = true;
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(function () {
          window.setTimeout(runCheck, 0);
        });
      } else {
        window.setTimeout(runCheck, 0);
      }
    }
    try {
      window.addEventListener('tdb-hero-verse-updated', scheduleCheck);
      window.addEventListener('tdb-red-letter-changed', scheduleCheck);
      document.addEventListener('DOMContentLoaded', scheduleCheck);
      window.addEventListener('load', scheduleCheck);
      /* Delayed passes after deferred engines (breakdown, 365, explanations). */
      window.setTimeout(scheduleCheck, 400);
      window.setTimeout(scheduleCheck, 1500);
      window.setTimeout(scheduleCheck, 4000);
      var heroRefEl = document.getElementById('heroRef');
      if (heroRefEl && typeof MutationObserver === 'function') {
        var mo = new MutationObserver(scheduleCheck);
        mo.observe(heroRefEl, { childList: true, characterData: true, subtree: true });
      }
    } catch (eWire) { /* non-fatal */ }
  })();

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
      if (/\boverwhelmed\b|\boverwhelm\b|\bmy spirit was overwhelmed\b|multitude of my thoughts within me\b|troubled on every side.? yet not distressed\b|\bwait thou only upon god\b|\bcasting all your care\b|\bheavy laden\b|\bcast thy burden\b/.test(low)) return 'overwhelm';
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
      if (/\bthank|thanks|thanksgiving|grateful|made me glad|gladness|glad through|light is sown|upright in heart|works of (thy|your) hands|rejoice|joyful|joy in|praise\w* unto|magnify|joyful noise|bless the lord, o my soul|enter.*thanksgiving\b/.test(low)) return 'gratitude';
      if (/\bdoubt(s|ed|ful|eth)?\b|unbelief|disbelief|faithless|be not faithless|waver(ing|ed|eth)?\b|staggered not|help thou mine|mine unbelief|look we for another|art thou he that should come\b/.test(low)) return 'doubt';
      if (/\bproverbs\b|commit thy works|commit your works|thoughts shall be established|wisdom\b|understanding\b|fear of the lord is the beginning\b/.test(low)) return 'wisdom';
      if (/\bhope|hopeless|discouraged\b/.test(low)) return 'hope';
      if (/\blove one another\b|\blove is of god\b|\bperfect love\b|\bfirst loved us\b|\bcharity suffereth\b|\bbeloved, let us love\b/.test(low)) {
        return 'love';
      }
      if (/\bpsalm\b/.test(low)) return 'gratitude';
      return 'hope';
    }
    var UOG_PLANS = {
      wisdom: [
        { href: '/plans.html?plan=proverbswisdom', label: 'Proverbs of Wisdom' },
        { href: '/plans.html?plan=trust', label: 'Trust in Uncertainty' },
        { href: '/plans.html?plan=peace', label: '7-Day Peace' }
      ],
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
      love: [
        { href: '/reading-plan.html?study=love-one-another', label: 'Love One Another' },
        { href: '/plans.html?plan=peacemakers', label: 'Peacemakers' },
        { href: '/plans.html?plan=gratitude', label: '7-Day Gratitude' }
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
