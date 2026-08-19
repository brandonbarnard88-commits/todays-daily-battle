/**
 * Ask the Word — unified teaching / Q&A brain (client).
 * Curated answers first → full KJV keyword search → honest closest-principles.
 * Used by ask-the-word.js (bible-tool) and available to homepage as window.TDBAskTheWord.
 *
 * Offline-first: answers JSON + kjv-full load from /data/ after first visit (SW cacheable).
 */
(function (global) {
  'use strict';

  var ANSWERS_URLS = [
    '/data/ask-the-word-answers.json',
    'data/ask-the-word-answers.json',
    '/ask-the-word-answers.json'
  ];
  var KJV_URLS = [
    '/data/kjv-full.json',
    'data/kjv-full.json',
    '/data/kjv-verses.json',
    'data/kjv-verses.json'
  ];

  var STOP = {
    i: 1, me: 1, my: 1, the: 1, a: 1, an: 1, and: 1, or: 1, to: 1, of: 1, for: 1,
    with: 1, at: 1, is: 1, am: 1, are: 1, was: 1, were: 1, be: 1, it: 1, this: 1,
    that: 1, do: 1, does: 1, did: 1, how: 1, what: 1, who: 1, when: 1, where: 1,
    why: 1, can: 1, could: 1, would: 1, should: 1, about: 1, tell: 1, please: 1,
    bible: 1, scripture: 1, say: 1, says: 1, mean: 1, meaning: 1
  };

  var OFF_TOPIC = /pineapple|pizza|football|nfl|nba|sports|movie|netflix|recipe|cooking|stock market|\bstocks?\b|ticker|crypto|weather|bitcoin|malware|javascript:|<script/i;

  var LEARN_SPINE = [
    {
      id: 'creation',
      title: 'God & creation',
      blurb: 'Who God is and how the story begins.',
      href: '/learn-the-word.html#spine-creation',
      verses: ['Genesis 1:1', 'John 1:1-3', 'Psalm 19:1']
    },
    {
      id: 'fall-promise',
      title: 'Fall & promise',
      blurb: 'Sin, sorrow, and the first hope.',
      href: '/learn-the-word.html#spine-fall',
      verses: ['Genesis 3:15', 'Romans 5:12', 'Romans 5:19']
    },
    {
      id: 'israel',
      title: 'Israel & covenant',
      blurb: 'Promise people, law, prophets, waiting.',
      href: '/learn-the-word.html#spine-israel',
      verses: ['Genesis 12:1-3', 'Exodus 20:1-3', 'Jeremiah 31:33']
    },
    {
      id: 'christ',
      title: 'Christ in the Gospels',
      blurb: 'Jesus — who He is, what He did, what He said.',
      href: '/learn-the-word.html#spine-christ',
      verses: ['John 1:14', 'John 3:16', 'Luke 19:10', 'John 11:35']
    },
    {
      id: 'church',
      title: 'Church & walk',
      blurb: 'Acts to the letters — life together in Christ.',
      href: '/learn-the-word.html#spine-church',
      verses: ['Acts 2:42', 'Ephesians 2:8-9', 'Galatians 5:22-23']
    },
    {
      id: 'hope',
      title: 'Hope & forever',
      blurb: 'Christ returns; tears end; the Lamb reigns.',
      href: '/learn-the-word.html#spine-hope',
      verses: ['Revelation 21:4', '1 Thessalonians 4:16-17', 'Titus 2:13']
    }
  ];

  var PLAN_LABELS = {
    forgiveness: 'Forgiveness plan',
    griefhope: 'Grief → Hope',
    fearfaith: 'Fear → Faith',
    worrytrust: 'Worry → Trust',
    gospeljohn: 'Gospel of John',
    peace: 'Peace plan',
    universityanxiety: 'Anxiety & fear',
    smallchurchheavy: 'Small church heavy',
    comeuntome: 'Come unto Me',
    parentweary: 'Parent weary'
  };

  var state = {
    answers: null,
    answersPromise: null,
    kjv: null,
    kjvPromise: null,
    kjvList: null
  };

  function fetchFirst(urls) {
    var i = 0;
    function next() {
      if (i >= urls.length) return Promise.reject(new Error('fetch failed'));
      var url = urls[i++];
      return fetch(url, { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) return next();
          return r.json();
        })
        .catch(function () { return next(); });
    }
    return next();
  }

  function loadAnswers() {
    if (state.answers) return Promise.resolve(state.answers);
    if (state.answersPromise) return state.answersPromise;
    state.answersPromise = fetchFirst(ANSWERS_URLS)
      .then(function (data) {
        var list = Array.isArray(data) ? data : [];
        // Merge live homepage catalog if already parsed in memory
        if (global.TDB_BIBLICAL_ANSWERS && Array.isArray(global.TDB_BIBLICAL_ANSWERS)) {
          list = mergeAnswerCatalogs(list, global.TDB_BIBLICAL_ANSWERS);
        }
        state.answers = list;
        return list;
      })
      .catch(function () {
        state.answers = Array.isArray(global.TDB_BIBLICAL_ANSWERS) ? normalizeLegacyAnswers(global.TDB_BIBLICAL_ANSWERS) : [];
        return state.answers;
      });
    return state.answersPromise;
  }

  function normalizeLegacyAnswers(raw) {
    return (raw || []).map(function (e) {
      return {
        id: e.id,
        type: e.type || 'life',
        triggers: e.triggers || [],
        answer: e.answer || '',
        verses: (e.verses || []).map(function (ref) {
          return typeof ref === 'string' ? { ref: ref, text: '' } : ref;
        }),
        sources: (e.verses || []).map(function (ref) {
          return typeof ref === 'string' ? ref : (ref && ref.ref);
        }).filter(Boolean),
        plan: e.plan || null,
        lesson: e.lesson || null,
        prayer: e.prayer || null
      };
    });
  }

  function mergeAnswerCatalogs(primary, legacy) {
    var byId = {};
    primary.forEach(function (e) { if (e && e.id) byId[e.id] = e; });
    normalizeLegacyAnswers(legacy).forEach(function (e) {
      if (!e || !e.id) return;
      if (!byId[e.id]) byId[e.id] = e;
    });
    return Object.keys(byId).map(function (k) { return byId[k]; });
  }

  function loadKjv() {
    if (state.kjv && state.kjvList) return Promise.resolve(state.kjv);
    if (state.kjvPromise) return state.kjvPromise;
    state.kjvPromise = fetchFirst(KJV_URLS)
      .then(function (data) {
        if (Array.isArray(data)) {
          state.kjvList = data.filter(function (v) { return v && v.ref && v.text; });
          state.kjv = {};
          state.kjvList.forEach(function (v) { state.kjv[v.ref] = v.text; });
        } else if (data && typeof data === 'object') {
          state.kjv = data;
          state.kjvList = Object.keys(data).map(function (ref) {
            return { ref: ref, text: data[ref] };
          });
        } else {
          state.kjv = {};
          state.kjvList = [];
        }
        return state.kjv;
      })
      .catch(function () {
        state.kjv = {};
        state.kjvList = [];
        return state.kjv;
      });
    return state.kjvPromise;
  }

  function normalize(q) {
    return String(q || '')
      .toLowerCase()
      .replace(/['']/g, "'")
      .replace(/[^\w\s':-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokens(q) {
    return normalize(q).split(/\s+/).filter(function (t) {
      return t.length > 1 && !STOP[t];
    });
  }

  function fillVerseTexts(verses) {
    var map = state.kjv || {};
    return (verses || []).map(function (v) {
      var ref = typeof v === 'string' ? v : (v && v.ref) || '';
      var text = (typeof v === 'object' && v && v.text) || map[ref] || '';
      if (!text && ref.indexOf('Psalms ') === 0) text = map['Psalm ' + ref.slice(7)] || '';
      if (!text && ref.indexOf('Psalm ') === 0) text = map['Psalms ' + ref.slice(6)] || '';
      var range = ref.match(/^(.+?\s\d+:\d+)-\d+$/);
      if (!text && range) text = map[range[1]] || '';
      return { ref: ref, text: text };
    }).filter(function (v) { return v.ref; });
  }

  function scoreTrigger(norm, trigger) {
    var t = normalize(trigger);
    if (!t) return 0;
    if (norm === t) return 100;
    if (norm.indexOf(t) !== -1) return 80 + Math.min(t.length, 20);
    if (t.indexOf(norm) !== -1 && norm.length >= 8) return 60;
    // token overlap
    var nt = tokens(norm);
    var tt = tokens(t);
    if (!nt.length || !tt.length) return 0;
    var hit = 0;
    for (var i = 0; i < tt.length; i++) {
      if (nt.indexOf(tt[i]) !== -1) hit++;
    }
    if (hit === tt.length && tt.length >= 2) return 50 + hit;
    if (hit >= 2) return 20 + hit * 5;
    return 0;
  }

  function findCurated(query, catalog) {
    var norm = normalize(query);
    if (!norm || norm.split(/\s+/).length < 1) return null;
    var best = null;
    var bestScore = 0;
    var bestTrigLen = 0;
    for (var i = 0; i < catalog.length; i++) {
      var entry = catalog[i];
      var triggers = entry.triggers || [];
      for (var j = 0; j < triggers.length; j++) {
        var trig = triggers[j];
        var sc = scoreTrigger(norm, trig);
        var tlen = normalize(trig).length;
        // Prefer higher score; on ties prefer longer (more specific) trigger
        if (sc > bestScore || (sc === bestScore && sc >= 80 && tlen > bestTrigLen)) {
          bestScore = sc;
          bestTrigLen = tlen;
          best = entry;
        }
      }
    }
    if (best && bestScore >= 20) return best;
    return null;
  }

  function keywordSearch(query, limit) {
    limit = limit || 5;
    var list = state.kjvList || [];
    if (!list.length) return [];
    var words = tokens(query);
    if (!words.length) return [];
    var scored = [];
    for (var i = 0; i < list.length; i++) {
      var v = list[i];
      var hay = ((v.ref || '') + ' ' + (v.text || '')).toLowerCase();
      var sc = 0;
      for (var k = 0; k < words.length; k++) {
        if (hay.indexOf(words[k]) !== -1) sc += words[k].length >= 4 ? 3 : 2;
        if ((v.ref || '').toLowerCase().indexOf(words[k]) !== -1) sc += 4;
      }
      if (sc > 0) scored.push({ v: v, sc: sc });
    }
    scored.sort(function (a, b) { return b.sc - a.sc; });
    return scored.slice(0, limit).map(function (x) {
      return { ref: x.v.ref, text: x.v.text };
    });
  }

  function defaultPrayer(query, mode) {
    if (mode === 'knowledge') {
      return 'Lord, teach me from Your Word. Keep me from confusion, and help me walk in the truth You show me. Amen.';
    }
    if (mode === 'closest_principles') {
      return 'Lord, meet me honestly where Scripture is clear and keep me humble where mystery remains. Amen.';
    }
    return 'Lord, meet me in this. Let Your Word be my anchor right now. Amen.';
  }

  function buildNextSteps(entry, query, verses) {
    var steps = [];
    if (entry && entry.plan) {
      steps.push({
        kind: 'plan',
        label: PLAN_LABELS[entry.plan] || 'Related Battle Plan',
        href: '/plans.html?plan=' + encodeURIComponent(entry.plan)
      });
    }
    if (entry && entry.lesson) {
      steps.push({
        kind: 'lesson',
        label: 'Sit longer in a Life Lesson',
        href: entry.lesson.charAt(0) === '/' ? entry.lesson : '/' + entry.lesson
      });
    }
    var firstRef = verses && verses[0] && verses[0].ref;
    if (firstRef) {
      var chapterRef = firstRef.replace(/:\d+(-\d+)?$/, '');
      steps.push({
        kind: 'chapter',
        label: 'Read the full chapter',
        href: '/reader.html?ref=' + encodeURIComponent(firstRef)
      });
      steps.push({
        kind: 'study',
        label: 'Break this verse down',
        href: '/bible-tool.html?ref=' + encodeURIComponent(firstRef)
      });
    }
    steps.push({
      kind: 'spine',
      label: 'Learn the Word path',
      href: '/learn-the-word.html'
    });
    // Dedup by href
    var seen = {};
    return steps.filter(function (s) {
      if (!s.href || seen[s.href]) return false;
      seen[s.href] = 1;
      return true;
    }).slice(0, 4);
  }

  function spineHint(query) {
    var n = normalize(query);
    if (/\b(genesis|creation|created|beginning|dinosaur|behemoth)\b/.test(n)) return LEARN_SPINE[0];
    if (/\b(fall|adam|eve|sin entered|garden)\b/.test(n)) return LEARN_SPINE[1];
    if (/\b(moses|abraham|israel|covenant|exodus|david|prophet)\b/.test(n)) return LEARN_SPINE[2];
    if (/\b(jesus|gospel|matthew|mark|luke|john|disciples|parable|crucif|resurrect)\b/.test(n)) return LEARN_SPINE[3];
    if (/\b(paul|church|acts|epistle|romans|ephesians|baptism)\b/.test(n)) return LEARN_SPINE[4];
    if (/\b(revelation|heaven|return of christ|second coming|hope forever)\b/.test(n)) return LEARN_SPINE[5];
    return null;
  }

  function responseFromEntry(entry, query) {
    var verses = fillVerseTexts(entry.verses || entry.sources || []);
    var answer = entry.answer || 'Here is what the Word says about that:';
    var prayer = entry.prayer || defaultPrayer(query, entry.type === 'knowledge' ? 'knowledge' : 'life');
    var next = buildNextSteps(entry, query, verses);
    var spine = spineHint(query);
    if (spine) {
      next = [{ kind: 'spine', label: spine.title + ' (Learn path)', href: spine.href }].concat(next);
      // dedup
      var seen = {};
      next = next.filter(function (s) {
        if (seen[s.href]) return false;
        seen[s.href] = 1;
        return true;
      }).slice(0, 4);
    }
    return {
      answer: answer,
      verses: verses,
      sources: verses.map(function (v) { return v.ref; }),
      prayer_prompt: prayer,
      answer_mode: entry.type === 'knowledge' ? 'key_scriptures' : 'strong_verses',
      query_kind: entry.type === 'knowledge' ? 'question' : 'statement',
      curated_id: entry.id || null,
      next_steps: next,
      from: 'curated'
    };
  }

  function responseFromSearch(query, verses) {
    var mode = /^(who|what|when|where|why|how)\b/i.test(String(query || '').trim()) || String(query).indexOf('?') !== -1
      ? 'key_scriptures'
      : 'strong_verses';
    var lead = mode === 'key_scriptures'
      ? 'That is a real question. Here are the strongest KJV matches on this device — read them slowly, then open the chapter for full context.'
      : 'Here is what the Word brings near for that. Stay with the verse that lands; open the chapter when you can.';
    if (!verses.length) {
      return {
        answer: 'I could not pin a clear verse match yet. Try a shorter phrase, a feeling (peace, grief), a name (Ruth, Paul), or a reference like John 3:16. Or open Learn the Word for a steady path.',
        verses: [],
        sources: [],
        prayer_prompt: defaultPrayer(query, 'closest_principles'),
        answer_mode: 'closest_principles',
        query_kind: 'question',
        curated_id: null,
        next_steps: buildNextSteps(null, query, []),
        from: 'empty'
      };
    }
    return {
      answer: lead,
      verses: verses,
      sources: verses.map(function (v) { return v.ref; }),
      prayer_prompt: defaultPrayer(query, mode),
      answer_mode: mode,
      query_kind: mode === 'key_scriptures' ? 'question' : 'statement',
      curated_id: null,
      next_steps: buildNextSteps(null, query, verses),
      from: 'kjv-search'
    };
  }

  /**
   * Main entry: answer a Bible / life question offline-first.
   * @returns {Promise<object>}
   */
  function answer(query) {
    var q = String(query || '').trim().slice(0, 500);
    if (!q) {
      return Promise.resolve({
        answer: 'Type a feeling, a Bible question, or a verse reference.',
        verses: [],
        sources: [],
        prayer_prompt: '',
        next_steps: [{ kind: 'spine', label: 'Learn the Word path', href: '/learn-the-word.html' }],
        from: 'empty'
      });
    }
    if (OFF_TOPIC.test(q) && !/\b(bible|scripture|god|jesus|christ|lord|pray|psalm|gospel|church|sin|faith)\b/i.test(q)) {
      return Promise.resolve({
        answer: 'This porch stays with Scripture. Ask a Bible question, name a feeling, or look up a verse — and the Word will meet you here.',
        verses: [],
        sources: [],
        prayer_prompt: '',
        answer_mode: 'closest_principles',
        next_steps: [{ kind: 'spine', label: 'Learn the Word path', href: '/learn-the-word.html' }],
        from: 'off_topic'
      });
    }

    return Promise.all([loadAnswers(), loadKjv()]).then(function (pair) {
      var catalog = pair[0] || [];
      var entry = findCurated(q, catalog);
      if (entry) return responseFromEntry(entry, q);

      // Reference lookup e.g. John 3:16
      var refGuess = q.match(/^((?:[1-3]\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+):(\d+)(?:-(\d+))?$/);
      if (refGuess && state.kjv) {
        var book = refGuess[1].replace(/\s+/g, ' ').replace(/^([1-3])\s*/, '$1 ');
        // title-case-ish
        book = book.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        // common fixes
        book = book.replace(/^Psalms\b/i, 'Psalm').replace(/^Song Of Solomon$/i, 'Song of Solomon');
        var ref = book + ' ' + refGuess[2] + ':' + refGuess[3];
        var text = state.kjv[ref] || state.kjv[ref.replace(/^Psalm /, 'Psalms ')] || '';
        if (text) {
          return {
            answer: 'Here is that passage in the King James. Read it slowly, then stay with what it actually says.',
            verses: [{ ref: ref, text: text }],
            sources: [ref],
            prayer_prompt: defaultPrayer(q, 'knowledge'),
            answer_mode: 'key_scriptures',
            query_kind: 'reference',
            next_steps: buildNextSteps(null, q, [{ ref: ref, text: text }]),
            from: 'reference'
          };
        }
      }

      var verses = keywordSearch(q, 6);
      return responseFromSearch(q, verses);
    });
  }

  /** Prefetch answers + KJV for snappy first Ask. */
  function prefetch() {
    return Promise.all([loadAnswers(), loadKjv()]).then(function () { return true; });
  }

  function getLearnSpine() {
    return LEARN_SPINE.slice();
  }

  /**
   * Render next-steps HTML (escaped).
   */
  function nextStepsHtml(steps, escapeHtml) {
    escapeHtml = escapeHtml || function (s) {
      return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
    if (!steps || !steps.length) return '';
    var parts = steps.map(function (s) {
      return '<a class="qa-next-step" href="' + escapeHtml(s.href) + '">' + escapeHtml(s.label) + '</a>';
    });
    return '<div class="qa-next-steps" role="navigation" aria-label="Keep learning">' +
      '<p class="qa-next-steps-label">Keep walking</p>' +
      '<div class="qa-next-steps-row">' + parts.join('') + '</div></div>';
  }

  global.TDBAskTheWord = {
    answer: answer,
    prefetch: prefetch,
    loadAnswers: loadAnswers,
    loadKjv: loadKjv,
    findCurated: function (q) {
      return loadAnswers().then(function (c) { return findCurated(q, c); });
    },
    getLearnSpine: getLearnSpine,
    nextStepsHtml: nextStepsHtml,
    LEARN_SPINE: LEARN_SPINE
  };
})(typeof window !== 'undefined' ? window : globalThis);
