/**
 * Homepage hero: deterministic daily verse + breakdown before the rest of index.html parses.
 * Primary: 365-verse UTC day-of-year list (__TDB_HERO_DAILY_YEAR from hero-daily-365-data.js).
 * Fallback: small merged pool + HERO_DAILY_VERSE_ROTATION_EPOCH if the year list is missing.
 */
(function () {
  'use strict';

  window.__TDB_HERO_OFFLINE_PACK = [
    {
      ref: 'Philippians 4:6-7',
      text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
      lines: ['Prayer + supplication + thanksgiving—not silent panic.', 'Peace stands guard over heart and mind.', 'Write it, pray it, thank three.'],
      app: "Write down the one thing you're most worried about. Pray the verse over it. Thank God for 3 things (big or small).",
      speaker: 'Paul, writing from prison to the church at Philippi.',
      plain: 'Stop letting worry control every detail. Pray it all out + thank God anyway. Peace then stands guard over your heart and mind.',
      today: 'Your thoughts are racing ahead to disasters. This verse interrupts the loop — hand it over, give thanks, receive supernatural peace.',
      action: "Write down the one thing you're most worried about. Pray the verse over it. Thank God for 3 things (big or small)."
    },
    {
      ref: 'Matthew 11:28',
      text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
      lines: ['Jesus welcomes the worn-out.', 'Rest starts with surrender.', 'No performance required to come.'],
      app: "Breathe and pray: 'Jesus, I come as I am. Give me rest today.'",
      speaker: 'Jesus speaking to the exhausted crowds — and directly to you',
      plain: "Jesus is not calling the put-together. He's calling the tired. The overloaded. The ones running on empty.",
      today: "You don't have to fix yourself before you come to Him. You come broken, and He handles the rest.",
      action: "Say it plain: 'Jesus, I'm tired. I come.' That's the whole prayer."
    },
    {
      ref: 'Isaiah 41:10',
      text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
      lines: ['Fear loosens when God is near.', 'You are upheld, not abandoned.', 'His righteousness holds you steady.'],
      app: "Say, 'God is with me,' three times before your next hard task.",
      speaker: 'God directly to Israel in a terrifying season — and to you in yours',
      plain: "God says 'I will' five times in this verse. He's not maybe-ing you. He is with you, He's your God, He will strengthen, He will help, He will hold you up.",
      today: "That situation where you feel alone and unsteady? This is God's answer to it.",
      action: "Say out loud: 'Fear not — He is with me.' Say it until you mean it."
    },
    {
      ref: 'Psalm 23:1',
      text: 'The LORD is my shepherd; I shall not want.',
      lines: ['He provides before you feel the lack.', 'Wanting less is finding more of Him.', 'A shepherd leads—not drives.'],
      app: "Name one thing you're trusting Him to provide today.",
      speaker: 'David — a real shepherd — writing about being one himself',
      plain: "A shepherd doesn't ask the sheep to figure it out. He leads, feeds, protects. David knew this from experience and turned it into a confession of trust.",
      today: "You don't have to scramble. You don't have to hustle God. He's already ahead of your need.",
      action: "Say: 'You are my shepherd. I trust You with what I don't have yet.'"
    },
    {
      ref: 'Proverbs 3:5-6',
      text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
      lines: ['Full trust means releasing the outcome.', 'Your understanding has a ceiling—His doesn\'t.', 'Acknowledge Him first; direction follows.'],
      app: "Before one decision today, say: 'I trust You with this.'",
      speaker: 'Solomon — the wisest man alive — admitting wisdom isn\'t enough on its own',
      plain: "Even the smartest guy in the room says: don't trust your own read on things. Trust God with your whole heart and let Him steer.",
      today: 'That decision you keep overthinking? Stop leaning on your own analysis. Hand it to Him.',
      action: "Before you decide anything big today, say: 'I acknowledge You first. Direct me.'"
    },
    {
      ref: 'Romans 8:28',
      text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
      lines: ['All things—not just the easy ones.', "Good is God's definition, not yours.", 'The called already have the promise.'],
      app: "Bring one hard thing to God and say: 'I believe You can turn this.'",
      speaker: 'Paul — who had been beaten, jailed, and shipwrecked — saying this anyway',
      plain: "He doesn't say some things or good things. All things. Including the things that look like total disasters right now.",
      today: "That thing you can't see any good in? God's 'all things' includes it. He's not finished with it yet.",
      action: "Say: 'I don't see it yet, but I believe You're working it for good.'"
    },
    {
      ref: 'Psalm 46:1',
      text: 'God is our refuge and strength, a very present help in trouble.',
      lines: ['He is present—not distant—in trouble.', 'Refuge means you can actually run to Him.', 'Strength comes from the same place as safety.'],
      app: "When pressure rises today, say: 'You are my refuge right now.'",
      speaker: 'The sons of Korah writing after surviving a national crisis',
      plain: "Not a distant, theoretical God — a very present one. Right here. Right now. When things are falling apart, He's not watching from a distance.",
      today: "In the middle of whatever is hitting you today, He is already there.",
      action: "Run to Him like a shelter. Say: 'You are my refuge. I'm coming to You right now.'"
    },
    {
      ref: 'John 3:16',
      text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      lines: ['Love this big required the costliest gift.', 'Whosoever means no one is excluded.', 'Belief is the door—He already opened it.'],
      app: "Receive this love as if you're hearing it for the first time today.",
      speaker: 'Jesus speaking to Nicodemus at night — and to you reading this right now',
      plain: "God loved the world so much He gave what cost Him the most. Not rules. Not religion. His Son. And the only requirement is to believe.",
      today: "You don't earn this. You don't deserve it more on good days. It's a gift — take it.",
      action: "Receive it like it's personal: 'God loved me. He gave for me. I believe.'"
    },
    {
      ref: 'Matthew 5:4',
      text: 'Blessed are they that mourn: for they shall be comforted.',
      lines: ['Mourning is named, not shamed.', 'Comfort is promised—personally.', 'Jesus blesses the honest ache.'],
      app: 'Name one loss to God. Ask Him for the comfort He promised.',
      speaker: 'Jesus—to everyone who grieves openly and quietly',
      plain: "He doesn't rush past sorrow. Blessing and mourning belong in the same sentence because He is coming with comfort.",
      today: "Whatever you're carrying alone today—He spoke this beatitude for people exactly in your shoes.",
      action: 'Say one true sentence of grief in prayer. Wait. Let Him answer gentle.'
    },
    {
      ref: '2 Timothy 1:7',
      text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
      lines: ['Fear is not from God—power is.', 'Love and a sound mind come as a set.', "You already have what fear says you lack."],
      app: "Replace one fearful thought today with: 'God gave me power for this.'",
      speaker: 'Paul to Timothy — a young, anxious leader who needed to hear this',
      plain: "Fear is not your inheritance from God. Power is. Love is. A clear, steady mind is. When fear shows up, it's not coming from Him.",
      today: 'That anxiety spiraling in you right now? Not from God. Challenge it with what He actually gave you.',
      action: "Every time fear rises today, say: 'That's not from God. He gave me power, love, and a sound mind.'"
    }
  ];

  window.__TDB_HERO_VERSES = [
    {
      mood: 'anxious',
      ref: 'Philippians 4:6-7',
      text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
      lines: ['Prayer + supplication + thanksgiving—not silent panic.', 'Peace stands guard over heart and mind.', 'Write it, pray it, thank three.'],
      app: "Write down the one thing you're most worried about. Pray the verse over it. Thank God for 3 things (big or small)."
    },
    {
      mood: 'tired',
      ref: 'Matthew 11:28',
      text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
      lines: ['Jesus welcomes the worn-out.', 'Rest starts with surrender.', 'No performance required to come.'],
      app: "Breathe and pray: 'Jesus, I come as I am. Give me rest today.'"
    },
    {
      mood: 'afraid',
      ref: 'Isaiah 41:10',
      text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
      lines: ['Fear loosens when God is near.', 'You are upheld, not alone.', 'His righteousness holds you steady.'],
      app: "Say, 'God is with me,' three times before your next hard task."
    },
    {
      mood: 'grateful',
      ref: 'Psalm 118:24',
      text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.',
      lines: ['Today is God-given.', 'Joy grows through gratitude.', 'Gladness is a choice made in truth.'],
      app: 'Write one thanks to God and carry it all day.'
    },
    {
      mood: 'angry',
      ref: 'Ephesians 4:26',
      text: 'Be ye angry, and sin not: let not the sun go down upon your wrath:',
      lines: ['Scripture names anger honestly.', 'Sin is not in the feeling but the response.', 'Resolve before the day closes.'],
      app: 'Pray first, then send one peaceful message.'
    },
    {
      mood: 'hopeful',
      ref: 'Romans 15:13',
      text: 'Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.',
      lines: ['Hope is Spirit-powered.', 'Joy and peace grow in believing.', 'Abundance here means overflow—not just enough.'],
      app: 'Name one stuck place and ask God for fresh hope there.'
    },
    {
      mood: 'sad',
      ref: 'Matthew 5:4',
      text: 'Blessed are they that mourn: for they shall be comforted.',
      lines: ['Mourning is named, not shamed.', 'Comfort is promised—personally.', 'Jesus blesses the honest ache.'],
      app: 'Name one loss to God. Ask Him for the comfort He promised.'
    },
    {
      mood: 'lonely',
      ref: 'Isaiah 41:10',
      text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
      lines: ["God doesn't drift when people do.", 'His presence is not dependent on circumstances.', 'He holds you when no one else is there.'],
      app: "Sit quietly and say: 'You are with me.' Let that land."
    }
  ];

  var OFFLINE_PACK = window.__TDB_HERO_OFFLINE_PACK;
  var VERSES = window.__TDB_HERO_VERSES;
  var HERO_DAILY_VERSE_ROTATION_EPOCH = 20535;

  function sanitizeText(value) {
    return String(value == null ? '' : value);
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
        'Let the words land gently\u2014God is kind toward you in what He said.',
        excerpt,
        'Thank Him for one true thing in this verse; let gratitude lift the next step.'
      ],
      app: 'Read it twice, slowly. Smile once on purpose\u2014then tell God thank you for something specific in the verse.',
      speaker: '',
      plain: 'Nothing here is against you; Scripture is light for your path and food for today.',
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
    if (!heroVerse || !heroRef || !OFFLINE_PACK.length || !VERSES.length) return;

    var verseRaw = pickHeroVerseForToday();
    if (!verseRaw || !verseRaw.ref) return;
    if (!verseRaw) return;
    var v = normalizeVerse(verseRaw);

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

    window.__TDB_HERO_FIRST_PAINT_REF = v.ref;
  }

  applyHeroFirstPaint();
})();
