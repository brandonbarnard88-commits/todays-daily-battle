/**
 * Shared helpers for Kids mini-games — fun + educational (KJV).
 * Device-local only: no accounts, no public leaderboards.
 */
(function (global) {
  'use strict';

  var SCORE_KEY = 'tdbKidsGameScoresV1';

  function dayIndex() {
    var d = new Date();
    var start = new Date(d.getFullYear(), 0, 0);
    var diff = d - start;
    return Math.floor(diff / 86400000);
  }

  /** Deterministic shuffle seed from day + salt */
  function seededRandom(seed) {
    var s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function seededShuffle(arr, seed) {
    var rnd = seededRandom(seed);
    var x = arr.slice();
    for (var i = x.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = x[i];
      x[i] = x[j];
      x[j] = t;
    }
    return x;
  }

  function loadScores() {
    try {
      var raw = localStorage.getItem(SCORE_KEY);
      var o = raw ? JSON.parse(raw) : {};
      return o && typeof o === 'object' ? o : {};
    } catch (e) {
      return {};
    }
  }

  function saveScores(o) {
    try {
      localStorage.setItem(SCORE_KEY, JSON.stringify(o));
    } catch (e) { /* no-op */ }
  }

  /**
   * @param {string} gameId
   * @param {{ pairs?: number, round?: number, level?: number, tries?: number, wins?: number }} patch
   */
  function recordScore(gameId, patch) {
    var all = loadScores();
    var g = all[gameId] || {
      bestPairsRound: 0,
      totalPairs: 0,
      totalWins: 0,
      bestLevel: 0,
      bestFindTries: 99,
      playDays: {}
    };
    if (patch.pairs != null) {
      g.totalPairs = (g.totalPairs || 0) + patch.pairs;
      if (patch.pairs > (g.bestPairsRound || 0)) g.bestPairsRound = patch.pairs;
    }
    if (patch.wins) g.totalWins = (g.totalWins || 0) + patch.wins;
    if (patch.level != null && patch.level > (g.bestLevel || 0)) g.bestLevel = patch.level;
    if (patch.tries != null && patch.tries > 0 && patch.tries < (g.bestFindTries || 99)) {
      g.bestFindTries = patch.tries;
    }
    var day = String(dayIndex());
    g.playDays = g.playDays || {};
    g.playDays[day] = true;
    /* keep last 40 day keys only */
    var keys = Object.keys(g.playDays);
    if (keys.length > 40) {
      keys.sort();
      keys.slice(0, keys.length - 40).forEach(function (k) {
        delete g.playDays[k];
      });
    }
    all[gameId] = g;
    saveScores(all);
    return g;
  }

  function getScore(gameId) {
    return loadScores()[gameId] || null;
  }

  function streakDays(gameId) {
    var g = getScore(gameId);
    if (!g || !g.playDays) return 0;
    var streak = 0;
    var d = dayIndex();
    while (g.playDays[String(d)]) {
      streak += 1;
      d -= 1;
      if (streak > 40) break;
    }
    return streak;
  }

  /** Kid-friendly plain line for common KJV snippets — each phrase must stay unique. */
  var PLAIN_MAP = [
    { re: /shepherd/i, plain: 'God cares for me like a shepherd', icon: '🐑', who: 'Shepherd' },
    { re: /lamp unto my feet|word is a lamp/i, plain: 'God’s Word shows me the way', icon: '💡', who: 'Light' },
    { re: /little children|suffer the|suffer little/i, plain: 'Jesus welcomes kids', icon: '⭐', who: 'Jesus' },
    { re: /be not afraid|fear not|whom shall I fear|fear thou not/i, plain: 'I do not have to be scared', icon: '🛡️', who: 'Brave' },
    { re: /careth for you|cast.*care|cast thy burden/i, plain: 'I can give God my worries', icon: '🙏', who: 'Care' },
    { re: /loved the world|first loved us/i, plain: 'God loved us first', icon: '❤️', who: 'Love' },
    { re: /peace, be still|great calm|peace I leave|my peace I give/i, plain: 'Jesus can calm the storm', icon: '🌊', who: 'Peace' },
    { re: /ask, and it shall|seek, and ye|lack wisdom/i, plain: 'I can talk to God anytime', icon: '🙏', who: 'Pray' },
    { re: /whatsoever ye would that men/i, plain: 'Treat others the way I want to be treated', icon: '🤝', who: 'Kind' },
    { re: /joyful noise/i, plain: 'I can make a joyful noise to God', icon: '🎺', who: 'Joy' },
    { re: /sing unto the lord|sing of thy|i will sing/i, plain: 'I can sing and bless the Lord’s name', icon: '🎵', who: 'Sing' },
    { re: /rejoice/i, plain: 'I can be glad in the Lord', icon: '☀️', who: 'Joy' },
    { re: /give thanks|o give thanks/i, plain: 'I can thank the Lord because He is good', icon: '🙏', who: 'Thanks' },
    { re: /trust in the lord/i, plain: 'I can trust God with my whole heart', icon: '💪', who: 'Trust' },
    { re: /strengtheneth me|i can do all things/i, plain: 'Jesus gives me strength', icon: '💪', who: 'Strong' },
    { re: /wonderfully made/i, plain: 'God made me on purpose', icon: '✨', who: 'You' },
    { re: /refuge and strength|present help/i, plain: 'God is my safe place', icon: '🏰', who: 'Safe' },
    { re: /battle is the lord/i, plain: 'God fights for me', icon: '⚔️', who: 'David' },
    { re: /taste and see/i, plain: 'God is good—try trusting Him', icon: '🍯', who: 'Good' },
    { re: /be still/i, plain: 'Quiet your heart—God is God', icon: '🤫', who: 'Still' },
    { re: /this is the day/i, plain: 'Today is a gift from God', icon: '📅', who: 'Today' },
    { re: /helper.*fear|i will not fear/i, plain: 'The Lord helps me', icon: '🤝', who: 'Help' },
    { re: /lift up mine eyes/i, plain: 'I look to God for help', icon: '⛰️', who: 'Help' },
    { re: /my rock|my fortress/i, plain: 'The Lord is my rock', icon: '🪨', who: 'Safe' },
    { re: /path of life/i, plain: 'God shows me the path of life', icon: '🌿', who: 'Path' },
    { re: /angels charge/i, plain: 'God sends help to watch over me', icon: '✨', who: 'Help' },
    { re: /spirit of fear/i, plain: 'God does not give a scared spirit', icon: '🛡️', who: 'Brave' },
    { re: /wait on the lord|waited patiently/i, plain: 'I can wait on the Lord', icon: '⏳', who: 'Wait' },
    { re: /heartily, as to the lord/i, plain: 'I can do my work for the Lord', icon: '🛠️', who: 'Work' },
    { re: /strong in the lord/i, plain: 'I can be strong in the Lord', icon: '💪', who: 'Strong' },
    { re: /father pitieth/i, plain: 'God cares like a good father', icon: '💛', who: 'Father' },
    { re: /whole heart/i, plain: 'I can praise God with my whole heart', icon: '💛', who: 'Praise' },
    { re: /fruit of the spirit/i, plain: 'Love, joy, and peace grow in us', icon: '🍇', who: 'Fruit' },
    { re: /strength and my shield/i, plain: 'The Lord is my strength and shield', icon: '🛡️', who: 'Safe' },
    { re: /word of the lord is right/i, plain: 'God’s Word is right and true', icon: '📖', who: 'Bible' },
    { re: /hope thou in god|i will hope/i, plain: 'I can put my hope in God', icon: '🌅', who: 'Hope' },
    { re: /possible to him that believeth/i, plain: 'Believe—God can do it', icon: '⭐', who: 'Faith' },
    { re: /hear the word of god/i, plain: 'Hear God’s Word and hold it', icon: '👂', who: 'Hear' },
    { re: /mercy endureth|his mercy|tender mercies/i, plain: 'God’s mercy does not run out', icon: '💧', who: 'Mercy' },
    { re: /giveth wisdom|cometh knowledge|get wisdom/i, plain: 'God gives wisdom', icon: '🦉', who: 'Wise' },
    { re: /regard the prayer|despise their prayer|heareth prayer/i, plain: 'God hears my prayer', icon: '🙏', who: 'Heard' },
    { re: /call upon me|call upon the lord/i, plain: 'I can call on God', icon: '📞', who: 'Call' },
    { re: /new every morning/i, plain: 'God’s mercies are new today', icon: '🌅', who: 'Morning' }
  ];

  function firstClause(text) {
    var t = String(text || '').replace(/\s+/g, ' ').trim();
    if (!t) return '';
    var cut = t.split(/[;:]/)[0].trim();
    if (cut.length < 14) {
      var parts = t.split(/[,.]/);
      cut = ((parts[0] || '') + (parts[1] ? ', ' + parts[1] : '')).trim();
    }
    if (cut.length > 70) cut = cut.slice(0, 67).replace(/\s+\S*$/, '');
    return cut.replace(/[,;:\s]+$/, '');
  }

  function softenKjvClause(text) {
    return String(text || '')
      .replace(/\bunto\b/gi, 'to')
      .replace(/\bthy\b/gi, 'your')
      .replace(/\bthine\b/gi, 'your')
      .replace(/\bthou\b/gi, 'you')
      .replace(/\bthee\b/gi, 'you')
      .replace(/\bye\b/gi, 'you')
      .replace(/\bhath\b/gi, 'has')
      .replace(/\bshew\b/gi, 'show')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function bookWho(ref) {
    var r = String(ref || '').trim();
    var m = r.match(/^(?:\d+\s+)?[A-Za-z]+/);
    return m ? m[0] : 'Bible';
  }

  function plainForKjv(text, ref) {
    var t = String(text || '');
    var i;
    for (i = 0; i < PLAIN_MAP.length; i++) {
      if (PLAIN_MAP[i].re.test(t)) {
        return {
          plain: PLAIN_MAP[i].plain,
          icon: PLAIN_MAP[i].icon,
          who: PLAIN_MAP[i].who,
          clue: PLAIN_MAP[i].plain,
          mapped: true
        };
      }
    }
    var clause = softenKjvClause(firstClause(t)) || 'This verse is about the Lord';
    return {
      plain: clause,
      icon: '📖',
      who: bookWho(ref),
      clue: clause,
      mapped: false
    };
  }

  function threeWords(text) {
    return String(text || '')
      .replace(/[^\w\s'-]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .join(' ');
  }

  function shortKjvLine(text) {
    return softenKjvClause(firstClause(text)) || String(text || '');
  }

  function doorFromRef(ref, id, blob) {
    var r = String(ref || '').toLowerCase();
    var key = String(id || '').toLowerCase();
    var hay = (key + ' ' + r + ' ' + String(blob || '')).toLowerCase();
    if (/p23|psalm 23|shepherd/.test(hay)) {
      return { story: 'psalm23Shepherd', color: 'good-shepherd', label: 'the Good Shepherd' };
    }
    if (/kids|mark 10:14|children|suffer/.test(hay)) {
      return { story: 'jesusBlessKids', color: 'jesus-children', label: 'Jesus and the children' };
    }
    if (/battle|1 samuel 17|goliath|david/.test(hay) && !/jonathan/.test(hay)) {
      return { story: 'davidGoliath', color: 'david', label: 'David and Goliath' };
    }
    if (/peace|mark 4:39|storm|be still/.test(hay) && !/psalm 46:10/.test(r)) {
      return { story: 'jesusCalmsStorm', color: 'jesus-storm', label: 'Jesus calms the storm' };
    }
    if (/lost|luke 15/.test(hay)) {
      return { story: 'lostSheep', color: 'lost-sheep', label: 'the lost sheep' };
    }
    if (/joshua 1:9|good courage|jericho/.test(hay)) {
      return { story: 'joshuaJericho', color: 'jericho', label: 'Joshua' };
    }
    return null;
  }

  /** Fixed educational pairs with character art chips */
  var MATCH_CORE = [
    { id: 'p23', plain: 'God is my caring shepherd', short: 'God cares', shortKjv: 'The Lord is my shepherd', kjv: 'The Lord is my shepherd; I shall not want.', ref: 'Psalm 23:1', icon: '🐑', who: 'Shepherd', clue: 'a shepherd who cares', teach: 'Jesus cares for you the way a good shepherd cares for sheep.', story: 'psalm23Shepherd', color: 'good-shepherd', door: 'the Good Shepherd' },
    { id: 'kids', plain: 'Jesus says kids can come', short: 'Kids can come', shortKjv: 'Suffer the little children to come', kjv: 'Suffer the little children to come unto me.', ref: 'Mark 10:14', icon: '⭐', who: 'Jesus', clue: 'children being welcomed', teach: 'You are welcome with Jesus—kids matter to Him.', story: 'jesusBlessKids', color: 'jesus-children', door: 'Jesus and the children' },
    { id: 'strong', plain: 'Be brave—God is with you', short: 'Be brave', shortKjv: 'Be strong and of a good courage', kjv: 'Be strong and of a good courage; be not afraid.', ref: 'Joshua 1:9', icon: '🛡️', who: 'Joshua', clue: 'being brave, not afraid', teach: 'Courage means trusting God is with you, not that you never feel small.', story: 'joshuaJericho', color: 'jericho', door: 'Joshua' },
    { id: 'care', plain: 'Give your worries to God', short: 'Give worries', shortKjv: 'He careth for you', kjv: 'Casting all your care upon him; for he careth for you.', ref: '1 Peter 5:7', icon: '🙏', who: 'Friend', clue: 'giving God your worries', teach: 'You do not have to carry every worry alone—God cares.' },
    { id: 'light', plain: 'God’s Word shows the way', short: 'Word shows way', shortKjv: 'Thy word is a lamp', kjv: 'Thy word is a lamp unto my feet, and a light unto my path.', ref: 'Psalm 119:105', icon: '💡', who: 'Light', clue: 'a lamp on a path', teach: 'Reading the Bible helps us know the next right step.' },
    { id: 'love', plain: 'God loved the world', short: 'God loved us', shortKjv: 'God so loved the world', kjv: 'For God so loved the world, that he gave his only begotten Son.', ref: 'John 3:16', icon: '❤️', who: 'Love', clue: 'God loving the world', teach: 'God’s love is a gift—Jesus came for us.', story: 'jesusBlessKids', color: 'jesus-children', door: 'Jesus and the children' },
    { id: 'peace', plain: 'Jesus can calm the storm', short: 'Storm, be still', shortKjv: 'Peace, be still', kjv: 'Peace, be still. And the wind ceased, and there was a great calm.', ref: 'Mark 4:39', icon: '🌊', who: 'Jesus', clue: 'a storm going still', teach: 'When life feels stormy, Jesus still speaks peace.', story: 'jesusCalmsStorm', color: 'jesus-storm', door: 'Jesus calms the storm' },
    { id: 'pray', plain: 'Ask God—He hears you', short: 'Ask God', shortKjv: 'Ask, and it shall be given you', kjv: 'Ask, and it shall be given you; seek, and ye shall find.', ref: 'Matthew 7:7', icon: '🙏', who: 'Pray', clue: 'asking and seeking', teach: 'Prayer is talking with God—He invites you to ask and seek.' },
    { id: 'kind', plain: 'Treat others kindly', short: 'Be kind', shortKjv: 'Do ye even so to them', kjv: 'All things whatsoever ye would that men should do to you, do ye even so to them.', ref: 'Matthew 7:12', icon: '🤝', who: 'Kind', clue: 'treating others the way you want', teach: 'The Golden Rule: treat others the way you want to be treated.' },
    { id: 'trust', plain: 'Trust God with all your heart', short: 'Trust God', shortKjv: 'Trust in the Lord', kjv: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding.', ref: 'Proverbs 3:5', icon: '💪', who: 'Trust', clue: 'trusting with your whole heart', teach: 'Trust means leaning on God even when we do not know everything.' },
    { id: 'strength', plain: 'Jesus gives me strength', short: 'Jesus makes strong', shortKjv: 'I can do all things through Christ', kjv: 'I can do all things through Christ which strengtheneth me.', ref: 'Philippians 4:13', icon: '💪', who: 'Strong', clue: 'Christ making you strong', teach: 'Our strength is not only muscles—Christ helps us obey and love.' },
    { id: 'made', plain: 'God made me on purpose', short: 'Made on purpose', shortKjv: 'I am wonderfully made', kjv: 'I am fearfully and wonderfully made.', ref: 'Psalm 139:14', icon: '✨', who: 'You', clue: 'being made on purpose', teach: 'You are not an accident—God made you with care.' },
    { id: 'battle', plain: 'The battle is the Lord’s', short: 'God fights', shortKjv: 'The battle is the Lord\'s', kjv: 'The battle is the Lord\'s.', ref: '1 Samuel 17:47', icon: '⚔️', who: 'David', clue: 'whose battle it really is', teach: 'David faced Goliath trusting God—not his own size.', story: 'davidGoliath', color: 'david', door: 'David and Goliath' },
    { id: 'refuge', plain: 'God is my safe place', short: 'Safe place', shortKjv: 'God is our refuge', kjv: 'God is our refuge and strength, a very present help.', ref: 'Psalm 46:1', icon: '🏰', who: 'Safe', clue: 'a safe place and present help', teach: 'When you need help now, God is a present help.' },
    { id: 'rejoice', plain: 'Rejoice in the Lord', short: 'Be glad', shortKjv: 'Rejoice in the Lord alway', kjv: 'Rejoice in the Lord alway: and again I say, Rejoice.', ref: 'Philippians 4:4', icon: '☀️', who: 'Joy', clue: 'rejoicing in the Lord', teach: 'Joy can grow even on hard days because the Lord is near.' },
    { id: 'still', plain: 'Be still—know God', short: 'Be still', shortKjv: 'Be still, and know', kjv: 'Be still, and know that I am God.', ref: 'Psalm 46:10', icon: '🤫', who: 'Still', clue: 'being still and knowing God', teach: 'Quiet moments help us remember who God is.', story: 'psalm23Shepherd', color: 'good-shepherd', door: 'the Good Shepherd' }
  ];

  function facePlain(pair, size) {
    if (!pair) return '';
    if (size === 'little') return pair.short || threeWords(pair.plain) || pair.plain;
    return pair.plain;
  }

  function faceKjv(pair, size) {
    if (!pair) return '';
    if (size === 'little') return pair.shortKjv || shortKjvLine(pair.kjv);
    return pair.kjv;
  }

  function doorForPair(pair) {
    if (!pair) return null;
    if (pair.story || pair.color) {
      return {
        story: pair.story || '',
        color: pair.color || '',
        label: pair.door || 'this story'
      };
    }
    return doorFromRef(pair.ref, pair.id, (pair.plain || '') + ' ' + (pair.kjv || '') + ' ' + (pair.who || ''));
  }

  function pickWinDoor(pairs) {
    var i;
    var list = pairs || [];
    for (i = 0; i < list.length; i++) {
      var d = doorForPair(list[i]);
      if (d && (d.story || d.color)) return d;
    }
    return null;
  }

  function fillWinDoors(el, pairsOrDoor) {
    if (!el) return;
    el.textContent = '';
    var d;
    if (pairsOrDoor && !Array.isArray(pairsOrDoor) && (pairsOrDoor.story || pairsOrDoor.color || pairsOrDoor.label)) {
      d = {
        story: pairsOrDoor.story || '',
        color: pairsOrDoor.color || '',
        label: pairsOrDoor.label || pairsOrDoor.door || 'this story'
      };
    } else {
      d = pickWinDoor(pairsOrDoor);
    }
    var prompt = document.createElement('p');
    prompt.className = 'kg-next-prompt';
    prompt.textContent = d && (d.story || d.color) ? 'A door is open:' : 'Keep going:';
    el.appendChild(prompt);
    var a = document.createElement('a');
    a.className = 'kg-next-story';
    if (d && d.story) {
      a.href = '/kids/corner.html?story=' + encodeURIComponent(d.story);
      a.textContent = 'Read ' + (d.label || 'this story');
    } else {
      a.href = '/kids/corner.html?choose=1#kids-library-grid';
      a.textContent = 'Read a story';
    }
    el.appendChild(a);
    var c = document.createElement('a');
    c.className = 'kg-next-color';
    if (d && d.color) {
      c.href = '/coloring.html?story=' + encodeURIComponent(d.color);
      c.textContent = 'Color ' + (d.label || 'this story');
    } else {
      c.href = '/coloring.html';
      c.textContent = 'Color a page';
    }
    el.appendChild(c);
    var game = gameDoorFor(d);
    if (game) {
      var g = document.createElement('a');
      g.className = 'kg-next-game';
      g.href = game.href;
      g.textContent = game.label;
      el.appendChild(g);
    }
  }

  function gameDoorFor(d) {
    var here = '';
    try { here = String(location.pathname || '').toLowerCase(); } catch (e) {}
    var key = d ? String((d.story || '') + ' ' + (d.color || '') + ' ' + (d.label || '')).toLowerCase() : '';
    var sheep = { href: '/kids/lost-sheep.html', label: 'Find the sheep' };
    var path = { href: '/kids/shepherds-path.html', label: 'Step the path' };
    var match = { href: '/kids/match-buddies.html', label: 'Match the Verse' };
    var memory = { href: '/kids/memory-flock.html', label: 'Memory flock' };
    var onSheep = /lost-sheep/.test(here);
    var onPath = /shepherds-path/.test(here);
    var onMatch = /match-buddies/.test(here);
    var onMem = /memory-flock/.test(here);
    if (/psalm23|good-shepherd|shepherd/.test(key)) {
      return onPath ? sheep : path;
    }
    if (/lostsheep|lost-sheep|lost sheep/.test(key)) {
      return onSheep ? path : sheep;
    }
    if (/storm|jesuscalms/.test(key)) {
      return onPath ? match : path;
    }
    if (onMatch) return memory;
    if (onMem) return match;
    if (onPath || onSheep) return match;
    return null;
  }

  function pickCalmVoice() {
    try {
      if (!global.speechSynthesis || typeof global.speechSynthesis.getVoices !== 'function') return null;
      var voices = global.speechSynthesis.getVoices() || [];
      return (
        voices.filter(function (v) {
          return v.lang && /^en-us/i.test(v.lang) && /samantha|ava|zoe|karen|moira|neural|natural|premium|google us english|aria|jenny/i.test(v.name || '') && !/\b(daniel|fred|alex)\b/i.test(v.name || '');
        })[0] ||
        voices.filter(function (v) { return v.lang && /^en-us/i.test(v.lang) && v.localService && !/\b(daniel|fred|alex)\b/i.test(v.name || ''); })[0] ||
        voices.filter(function (v) { return v.lang && /^en/i.test(v.lang) && !/\b(daniel|fred|alex)\b/i.test(v.name || ''); })[0] ||
        null
      );
    } catch (e) {
      return null;
    }
  }

  function speakCalm(text) {
    var t = String(text || '').replace(/\s+/g, ' ').trim();
    if (!t) return;
    if (typeof global.tdbKidsSpeakCalm === 'function') {
      try { if (global.speechSynthesis) global.speechSynthesis.cancel(); } catch (e0) {}
      global.tdbKidsSpeakCalm(t);
      return;
    }
    if (typeof global.speechSynthesis === 'undefined' || typeof global.SpeechSynthesisUtterance !== 'function') return;
    try {
      global.speechSynthesis.cancel();
      var u = new global.SpeechSynthesisUtterance(t);
      u.lang = 'en-US';
      u.rate = 0.92;
      u.pitch = 1.04;
      u.volume = 1;
      var voice = pickCalmVoice();
      if (voice) u.voice = voice;
      global.speechSynthesis.speak(u);
    } catch (e1) { /* no-op */ }
  }

  function speakPair(pair) {
    if (!pair) return;
    var kid = String(pair.plain || pair.short || '').replace(/\.$/, '');
    var verse = String(pair.kjv || pair.shortKjv || '').trim();
    var line = kid;
    if (verse && kid && kid.toLowerCase() !== verse.toLowerCase()) line = kid + '. ' + verse;
    else if (verse) line = verse;
    speakCalm(line);
  }

  function fillHearButton(container, pair) {
    if (!container) return;
    var old = container.querySelector('.kg-hear-pair');
    if (old) old.parentNode.removeChild(old);
    if (!pair) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'kg-hear-pair';
    b.textContent = 'Hear this pair';
    b.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      speakPair(pair);
    });
    container.appendChild(b);
  }

  function verseWords(text, count) {
    var want = count || 5;
    function split(s) {
      return String(s || '').replace(/[;:,.!?]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
    }
    var words = split(text);
    if (!words.length) {
      return split('The Lord is my shepherd I shall not want').slice(0, want);
    }
    return words.slice(0, want);
  }

  var FAMILY_KEY = 'tdbKidsFamilyTurn';

  function getFamilyTurn() {
    try { return localStorage.getItem(FAMILY_KEY) === '1'; } catch (e) { return false; }
  }

  function setFamilyTurn(on) {
    try { localStorage.setItem(FAMILY_KEY, on ? '1' : '0'); } catch (e2) {}
    return !!on;
  }

  function bindFamilyTurn(onChange) {
    var box = document.getElementById('kg-family-turn');
    if (!box) return getFamilyTurn();
    box.checked = getFamilyTurn();
    box.addEventListener('change', function () {
      var on = setFamilyTurn(!!box.checked);
      if (typeof onChange === 'function') onChange(on);
    });
    return box.checked;
  }

  function todayGames(name) {
    var n = String(name || '').toLowerCase();
    if (/shepherd/.test(n)) return ['match', 'path', 'sheep'];
    if (/still|peace|storm|brave/.test(n)) return ['match', 'path'];
    if (/love|glad|light/.test(n)) return ['match', 'memory'];
    return ['match', 'memory'];
  }

  function clueIdea(pair) {
    if (!pair) return 'the big idea you already picked';
    if (pair.clue) return pair.clue;
    var who = String(pair.who || '').trim();
    if (who && who !== 'Bible' && who !== 'You' && who !== 'Friend') {
      return 'the same idea as “' + who + '”';
    }
    var plain = String(pair.plain || '').replace(/\.$/, '');
    if (plain.length > 8 && plain.length < 48) return plain;
    return 'the same big idea as the card you already picked';
  }

  /** Nudge after a miss — never names the matching card, verse, or number. */
  function missHint(pair, n, size) {
    var idea = clueIdea(pair);
    var misses = n || 1;
    var ico = (pair && pair.icon) || '⭐';
    if (size === 'little') {
      return ico + (misses <= 1
        ? ' Look for a card that feels like this picture.'
        : ' The matching card belongs with this picture.');
    }
    if (size === 'bigger') {
      if (misses < 2) return 'Not that pair.';
      if (misses === 2) return 'Read the leftover lines again.';
      return 'Stay with the first card. Hunt for the matching idea.';
    }
    if (misses <= 1) {
      return 'Not that pair. Think about ' + idea + '—then try a different leftover card.';
    }
    if (misses === 2) {
      return 'Still not it. Read the leftover cards slowly and listen for ' + idea + '.';
    }
    return 'Keep the first card. Hunt for the matching idea, not the same words. Think: ' + idea + '.';
  }

  var SIZE_KEY = 'tdbKidsPlaySize';
  var SIZES = {
    little: { id: 'little', label: 'Little', pairs: 2, pairRounds: [2, 2, 3], sheep: [6, 9], sheepCols: ['cols3', 'cols3'], path: [4, 5], timer: false },
    middle: { id: 'middle', label: 'Middle', pairs: 4, pairRounds: [4, 5, 6], sheep: [9, 12, 16], sheepCols: ['cols3', 'cols4', 'cols4'], path: [5, 7, 9], timer: false },
    bigger: { id: 'bigger', label: 'Bigger', pairs: 6, pairRounds: [6, 7, 8], sheep: [16, 20], sheepCols: ['cols4', 'cols5'], path: [9, 12], timer: true }
  };

  function getSize() {
    try {
      var s = localStorage.getItem(SIZE_KEY);
      if (s && SIZES[s]) return s;
    } catch (e) {}
    return 'middle';
  }

  function setSize(id) {
    if (!SIZES[id]) id = 'middle';
    try { localStorage.setItem(SIZE_KEY, id); } catch (e2) {}
    return id;
  }

  function sizeConfig(id) {
    return SIZES[id || getSize()] || SIZES.middle;
  }

  function mixName(pairs) {
    var tags = (pairs || []).map(function (p) {
      return String((p && (p.who || p.clue || p.plain || p.door || p.story)) || '').toLowerCase();
    }).join(' ');
    if (/shepherd/.test(tags)) return 'Shepherd day';
    if (/brave|joshua|afraid|fear/.test(tags)) return 'Brave day';
    if (/love/.test(tags)) return 'Love day';
    if (/peace|still|storm/.test(tags)) return 'Still day';
    if (/joy|sing|rejoice|glad/.test(tags)) return 'Glad day';
    if (/light|lamp/.test(tags)) return 'Light day';
    return 'Verse friends day';
  }

  function sealInfo(gameId) {
    var n = streakDays(gameId) || 0;
    return {
      days: n,
      on: n >= 3,
      text: n >= 3 ? n + '-day seal' : n ? n + (n === 1 ? ' day' : ' days') : ''
    };
  }

  function bindSizePicker(onChange) {
    var wrap = document.querySelector('.kg-sizes');
    if (!wrap) return getSize();
    var current = getSize();
    function paint() {
      [].forEach.call(wrap.querySelectorAll('[data-kg-size]'), function (btn) {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-kg-size') === current ? 'true' : 'false');
      });
    }
    wrap.addEventListener('click', function (ev) {
      var t = ev.target.closest ? ev.target.closest('[data-kg-size]') : null;
      if (!t) return;
      current = setSize(t.getAttribute('data-kg-size'));
      paint();
      if (typeof onChange === 'function') onChange(current);
    });
    paint();
    return current;
  }

  function dailyCorePairs(count) {
    var n = count || 4;
    return seededShuffle(MATCH_CORE, dayIndex() * 17 + 3).slice(0, Math.min(n, MATCH_CORE.length));
  }

  /** Blend daily 365 verses into match pairs when available */
  function dailyVersePairs(count) {
    var list = global.__TDB_KIDS_VERSES_365;
    if (!list || !list.length) return dailyCorePairs(count);
    var day = dayIndex();
    var out = [];
    var used = {};
    var usedPlain = {};
    var i;
    for (i = 0; i < list.length && out.length < (count || 4); i++) {
      var v = list[(day + i * 7) % list.length];
      if (!v || !v.text || used[v.ref]) continue;
      var probe = plainForKjv(v.text, v.ref);
      if (!probe.mapped) continue;
      var plainKey = String(probe.plain || '').toLowerCase();
      if (plainKey && usedPlain[plainKey]) continue;
      used[v.ref] = true;
      if (plainKey) usedPlain[plainKey] = true;
      var meta = probe;
      var door = doorFromRef(v.ref, '', meta.plain + ' ' + v.text);
      out.push({
        id: 'd' + out.length + '_' + String(v.ref).replace(/\W+/g, ''),
        plain: meta.plain,
        short: threeWords(meta.plain),
        shortKjv: shortKjvLine(v.text),
        kjv: v.text,
        ref: v.ref,
        icon: meta.icon,
        who: meta.who,
        clue: meta.clue || meta.plain || meta.who || 'the same big idea',
        teach: meta.plain + ' — that is what ' + v.ref + ' is saying.',
        story: door && door.story ? door.story : '',
        color: door && door.color ? door.color : '',
        door: door && door.label ? door.label : ''
      });
    }
    /* fill from core if needed */
    if (out.length < (count || 4)) {
      var core = dailyCorePairs(8);
      for (i = 0; i < core.length && out.length < (count || 4); i++) {
        out.push(core[i]);
      }
    }
    return out;
  }

  function takeUniquePairs(list, count) {
    var want = count || 4;
    var seenId = {};
    var seenPlain = {};
    var seenRef = {};
    var out = [];
    var i;
    for (i = 0; i < list.length && out.length < want; i++) {
      var p = list[i];
      if (!p || !p.kjv) continue;
      var id = String(p.id || '');
      var plainKey = String(p.plain || '').toLowerCase();
      var refKey = String(p.ref || '').toLowerCase();
      if (id && seenId[id]) continue;
      if (plainKey && seenPlain[plainKey]) continue;
      if (refKey && seenRef[refKey]) continue;
      if (id) seenId[id] = true;
      if (plainKey) seenPlain[plainKey] = true;
      if (refKey) seenRef[refKey] = true;
      out.push(p);
    }
    return out;
  }

  function mixDailyAndCore(count) {
    var want = count || 4;
    var size = getSize();
    var coreWant = size === 'little' ? want : Math.max(1, Math.ceil(want / 2));
    var core = dailyCorePairs(Math.max(coreWant, 4));
    var daily = dailyVersePairs(want);
    return seededShuffle(takeUniquePairs(core.concat(daily), want), dayIndex() * 31 + want);
  }

  global.tdbKidsGameKit = {
    dayIndex: dayIndex,
    seededShuffle: seededShuffle,
    recordScore: recordScore,
    getScore: getScore,
    streakDays: streakDays,
    plainForKjv: plainForKjv,
    clueIdea: clueIdea,
    missHint: missHint,
    getSize: getSize,
    setSize: setSize,
    sizeConfig: sizeConfig,
    mixName: mixName,
    sealInfo: sealInfo,
    bindSizePicker: bindSizePicker,
    facePlain: facePlain,
    faceKjv: faceKjv,
    doorForPair: doorForPair,
    pickWinDoor: pickWinDoor,
    fillWinDoors: fillWinDoors,
    gameDoorFor: gameDoorFor,
    speakCalm: speakCalm,
    speakPair: speakPair,
    fillHearButton: fillHearButton,
    verseWords: verseWords,
    getFamilyTurn: getFamilyTurn,
    setFamilyTurn: setFamilyTurn,
    bindFamilyTurn: bindFamilyTurn,
    todayGames: todayGames,
    MATCH_CORE: MATCH_CORE,
    dailyCorePairs: dailyCorePairs,
    dailyVersePairs: dailyVersePairs,
    mixDailyAndCore: mixDailyAndCore
  };
})(typeof window !== 'undefined' ? window : this);
