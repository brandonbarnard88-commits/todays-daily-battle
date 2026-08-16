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

  /** Kid-friendly plain line for common KJV snippets */
  var PLAIN_MAP = [
    { re: /shepherd/i, plain: 'God cares for me like a shepherd', icon: '🐑', who: 'Shepherd' },
    { re: /lamp unto my feet/i, plain: 'God’s Word shows me the way', icon: '💡', who: 'Light' },
    { re: /little children|suffer the/i, plain: 'Jesus welcomes kids', icon: '⭐', who: 'Jesus' },
    { re: /be not afraid|fear not|whom shall I fear/i, plain: 'I do not have to be scared', icon: '🛡️', who: 'Brave' },
    { re: /careth for you|cast.*care/i, plain: 'I can give God my worries', icon: '🙏', who: 'Care' },
    { re: /loved the world|first loved us/i, plain: 'God loved us first', icon: '❤️', who: 'Love' },
    { re: /peace, be still|great calm/i, plain: 'Jesus can calm the storm', icon: '🌊', who: 'Peace' },
    { re: /ask, and it shall|seek, and ye/i, plain: 'I can talk to God anytime', icon: '🙏', who: 'Pray' },
    { re: /whatsoever ye would that men/i, plain: 'Treat others the way I want to be treated', icon: '🤝', who: 'Kind' },
    { re: /rejoice/i, plain: 'I can be glad in the Lord', icon: '☀️', who: 'Joy' },
    { re: /trust in the lord/i, plain: 'I can trust God with my whole heart', icon: '💪', who: 'Trust' },
    { re: /strengtheneth me|i can do all things/i, plain: 'Jesus gives me strength', icon: '💪', who: 'Strong' },
    { re: /wonderfully made/i, plain: 'God made me on purpose', icon: '✨', who: 'You' },
    { re: /refuge and strength|present help/i, plain: 'God is my safe place', icon: '🏰', who: 'Safe' },
    { re: /battle is the lord/i, plain: 'God fights for me', icon: '⚔️', who: 'David' },
    { re: /taste and see/i, plain: 'God is good—try trusting Him', icon: '🍯', who: 'Good' },
    { re: /be still/i, plain: 'Quiet your heart—God is God', icon: '🤫', who: 'Still' },
    { re: /this is the day/i, plain: 'Today is a gift from God', icon: '📅', who: 'Today' },
    { re: /helper.*fear/i, plain: 'The Lord helps me', icon: '🤝', who: 'Help' },
    { re: /word is a lamp/i, plain: 'God’s Word lights my steps', icon: '📖', who: 'Bible' }
  ];

  function plainForKjv(text) {
    var t = String(text || '');
    for (var i = 0; i < PLAIN_MAP.length; i++) {
      if (PLAIN_MAP[i].re.test(t)) return PLAIN_MAP[i];
    }
    return { plain: 'God’s Word is true and good', icon: '📖', who: 'Bible' };
  }

  /** Fixed educational pairs with character art chips */
  var MATCH_CORE = [
    { id: 'p23', plain: 'God is my caring shepherd', kjv: 'The Lord is my shepherd; I shall not want.', ref: 'Psalm 23:1', icon: '🐑', who: 'Shepherd', teach: 'Jesus cares for you the way a good shepherd cares for sheep.' },
    { id: 'kids', plain: 'Jesus says kids can come', kjv: 'Suffer the little children to come unto me.', ref: 'Mark 10:14', icon: '⭐', who: 'Jesus', teach: 'You are welcome with Jesus—kids matter to Him.' },
    { id: 'strong', plain: 'Be brave—God is with you', kjv: 'Be strong and of a good courage; be not afraid.', ref: 'Joshua 1:9', icon: '🛡️', who: 'Joshua', teach: 'Courage means trusting God is with you, not that you never feel small.' },
    { id: 'care', plain: 'Give your worries to God', kjv: 'Casting all your care upon him; for he careth for you.', ref: '1 Peter 5:7', icon: '🙏', who: 'Friend', teach: 'You do not have to carry every worry alone—God cares.' },
    { id: 'light', plain: 'God’s Word shows the way', kjv: 'Thy word is a lamp unto my feet, and a light unto my path.', ref: 'Psalm 119:105', icon: '💡', who: 'Light', teach: 'Reading the Bible helps us know the next right step.' },
    { id: 'love', plain: 'God loved the world', kjv: 'For God so loved the world, that he gave his only begotten Son.', ref: 'John 3:16', icon: '❤️', who: 'Love', teach: 'God’s love is a gift—Jesus came for us.' },
    { id: 'peace', plain: 'Jesus can calm the storm', kjv: 'Peace, be still. And the wind ceased, and there was a great calm.', ref: 'Mark 4:39', icon: '🌊', who: 'Jesus', teach: 'When life feels stormy, Jesus still speaks peace.' },
    { id: 'pray', plain: 'Ask God—He hears you', kjv: 'Ask, and it shall be given you; seek, and ye shall find.', ref: 'Matthew 7:7', icon: '🙏', who: 'Pray', teach: 'Prayer is talking with God—He invites you to ask and seek.' },
    { id: 'kind', plain: 'Treat others kindly', kjv: 'All things whatsoever ye would that men should do to you, do ye even so to them.', ref: 'Matthew 7:12', icon: '🤝', who: 'Kind', teach: 'The Golden Rule: treat others the way you want to be treated.' },
    { id: 'trust', plain: 'Trust God with all your heart', kjv: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding.', ref: 'Proverbs 3:5', icon: '💪', who: 'Trust', teach: 'Trust means leaning on God even when we do not know everything.' },
    { id: 'strength', plain: 'Jesus gives me strength', kjv: 'I can do all things through Christ which strengtheneth me.', ref: 'Philippians 4:13', icon: '💪', who: 'Strong', teach: 'Our strength is not only muscles—Christ helps us obey and love.' },
    { id: 'made', plain: 'God made me on purpose', kjv: 'I am fearfully and wonderfully made.', ref: 'Psalm 139:14', icon: '✨', who: 'You', teach: 'You are not an accident—God made you with care.' },
    { id: 'battle', plain: 'The battle is the Lord’s', kjv: 'The battle is the Lord\'s.', ref: '1 Samuel 17:47', icon: '⚔️', who: 'David', teach: 'David faced Goliath trusting God—not his own size.' },
    { id: 'refuge', plain: 'God is my safe place', kjv: 'God is our refuge and strength, a very present help.', ref: 'Psalm 46:1', icon: '🏰', who: 'Safe', teach: 'When you need help now, God is a present help.' },
    { id: 'rejoice', plain: 'Rejoice in the Lord', kjv: 'Rejoice in the Lord alway: and again I say, Rejoice.', ref: 'Philippians 4:4', icon: '☀️', who: 'Joy', teach: 'Joy can grow even on hard days because the Lord is near.' },
    { id: 'still', plain: 'Be still—know God', kjv: 'Be still, and know that I am God.', ref: 'Psalm 46:10', icon: '🤫', who: 'Still', teach: 'Quiet moments help us remember who God is.' }
  ];

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
    var i;
    for (i = 0; i < list.length && out.length < (count || 4); i++) {
      var v = list[(day + i * 7) % list.length];
      if (!v || !v.text || used[v.ref]) continue;
      used[v.ref] = true;
      var meta = plainForKjv(v.text);
      out.push({
        id: 'd' + out.length + '_' + String(v.ref).replace(/\W+/g, ''),
        plain: meta.plain,
        kjv: v.text,
        ref: v.ref,
        icon: meta.icon,
        who: meta.who,
        teach: 'Today’s line: ' + v.ref + ' — listen for what it says about God.'
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

  function mixDailyAndCore(count) {
    var half = Math.ceil((count || 4) / 2);
    var daily = dailyVersePairs(half);
    var core = dailyCorePairs(count || 4);
    var map = {};
    var mixed = [];
    daily.concat(core).forEach(function (p) {
      if (!map[p.id] && mixed.length < (count || 4)) {
        map[p.id] = true;
        mixed.push(p);
      }
    });
    return seededShuffle(mixed, dayIndex() * 31 + (count || 4));
  }

  global.tdbKidsGameKit = {
    dayIndex: dayIndex,
    seededShuffle: seededShuffle,
    recordScore: recordScore,
    getScore: getScore,
    streakDays: streakDays,
    plainForKjv: plainForKjv,
    MATCH_CORE: MATCH_CORE,
    dailyCorePairs: dailyCorePairs,
    dailyVersePairs: dailyVersePairs,
    mixDailyAndCore: mixDailyAndCore
  };
})(typeof window !== 'undefined' ? window : this);
