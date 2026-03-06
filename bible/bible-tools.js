/**
 * Bible Tools — Concordance search. Loads concordance.json, shows refs, verse card + Highlight.
 */
(function () {
  'use strict';

  const HIGHLIGHTS_KEY = 'bibleHighlights';
  const CONCORDANCE_URL = '../concordance.json';
  const KJV_URL = '../kjv.json';
  const CHAPTERS_URL = '../chapters.json';
  const BIBLE_READ_STREAK_KEY = 'bibleReadStreak';
  const QUIZ_TAKEN_KEY = 'quizTaken';
  const MEMORY_DONE_KEY = 'memoryDone';

  /* Verse of the Week themes (for memory game) */
  var VERSE_OF_WEEK_THEMES = [
    { verses: [
      { ref: 'Joshua 1:9', text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.' },
      { ref: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee; be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.' },
      { ref: '2 Timothy 1:7', text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.' },
      { ref: 'Psalm 27:1', text: 'The Lord is my light and my salvation; whom shall I fear? the Lord is the strength of my life; of whom shall I be afraid?' },
      { ref: '1 Corinthians 16:13', text: 'Watch ye, stand fast in the faith, quit you like men, be strong.' }
    ]},
    { verses: [
      { ref: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
      { ref: 'Romans 5:8', text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.' },
      { ref: '1 Corinthians 13:4', text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,' },
      { ref: 'John 15:11', text: 'These things have I spoken unto you, that my joy might remain in you, and that your joy might be full.' },
      { ref: 'Psalm 34:18', text: 'The Lord is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.' }
    ]},
    { verses: [
      { ref: 'Hebrews 11:1', text: 'Now faith is the substance of things hoped for, the evidence of things not seen.' },
      { ref: 'Ephesians 2:8', text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:' },
      { ref: 'Romans 10:17', text: 'So then faith cometh by hearing, and hearing by the word of God.' },
      { ref: 'Hebrews 12:1', text: 'Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and run with patience the race that is set before us,' },
      { ref: 'James 1:12', text: 'Blessed is the man that endureth temptation: for when he is tried, he shall receive the crown of life, which the Lord hath promised to them that love him.' }
    ]},
    { verses: [
      { ref: 'Jeremiah 29:11', text: 'For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.' },
      { ref: 'Romans 15:13', text: 'Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.' },
      { ref: 'Romans 8:28', text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
      { ref: 'Psalm 16:11', text: 'Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore.' }
    ]},
    { verses: [
      { ref: 'John 14:27', text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.' },
      { ref: 'Isaiah 26:3', text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.' },
      { ref: 'Philippians 4:7', text: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.' },
      { ref: 'Matthew 11:28', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' },
      { ref: '1 Peter 5:7', text: 'Casting all your care upon him; for he careth for you.' }
    ]}
  ];

  /* Bible Quiz: 5 questions per chapter */
  var BIBLE_QUIZ_QUESTIONS = {
    'Psalm 23': [
      { q: 'Who is the shepherd?', options: ['David', 'The Lord', 'Moses', 'Abraham'], correct: 1 },
      { q: 'Where does the shepherd lead?', options: ['Desert', 'Green pastures', 'City', 'Mountain'], correct: 1 },
      { q: 'In the valley of the shadow of death, the psalmist will fear ___.', options: ['evil', 'nothing', 'enemies', 'darkness'], correct: 1 },
      { q: 'What runneth over?', options: ['Oil', 'Water', 'My cup', 'Rivers'], correct: 2 },
      { q: 'Who wrote Psalm 23?', options: ['Solomon', 'Moses', 'David', 'Asaph'], correct: 2 }
    ],
    'Psalm 91': [
      { q: 'Who dwells in the secret place of the Most High?', options: ['Angels', 'The believer', 'Moses', 'Israel'], correct: 1 },
      { q: 'God shall deliver from the snare of the ___.', options: ['enemy', 'fowler', 'lion', 'serpent'], correct: 1 },
      { q: 'Under what shall you trust?', options: ['His hand', 'His wings', 'His rod', 'His word'], correct: 1 },
      { q: 'Who gives charge over you?', options: ['The king', 'Angels', 'Prophets', 'Priests'], correct: 1 },
      { q: 'What will satisfy the one who loves God?', options: ['Wealth', 'Long life', 'Power', 'Fame'], correct: 1 }
    ],
    'Matthew 5:1-12': [
      { q: 'Who went up into a mountain to teach?', options: ['Moses', 'Peter', 'Jesus', 'Paul'], correct: 2 },
      { q: '"Blessed are the poor in spirit" — theirs is the ___.', options: ['earth', 'kingdom of heaven', 'comfort', 'mercy'], correct: 1 },
      { q: 'Who shall inherit the earth?', options: ['The strong', 'The meek', 'The wise', 'The rich'], correct: 1 },
      { q: 'Blessed are the ___ for they shall see God.', options: ['merciful', 'peacemakers', 'pure in heart', 'meek'], correct: 2 },
      { q: 'When persecuted, Jesus says to ___.', options: ['flee', 'rejoice', 'weep', 'fight'], correct: 1 }
    ],
    'Proverbs 3:1-12': [
      { q: 'Trust in the Lord with all your ___.', options: ['might', 'heart', 'mind', 'soul'], correct: 1 },
      { q: 'Lean not unto your own ___.', options: ['strength', 'understanding', 'wisdom', 'plans'], correct: 1 },
      { q: 'In all your ways ___ Him.', options: ['serve', 'acknowledge', 'praise', 'follow'], correct: 1 },
      { q: 'Honour the Lord with your ___.', options: ['prayers', 'substance', 'songs', 'works'], correct: 1 },
      { q: 'Whom does the Lord correct?', options: ['Strangers', 'Enemies', 'Those He loves', 'The wicked'], correct: 2 }
    ]
  };

  /* Verse Maps: place → verses (ref + short label) */
  var VERSE_MAPS_PLACES = {
    bethlehem: {
      name: 'Bethlehem',
      verses: [
        { ref: 'Micah 5:2', label: 'Birthplace of Messiah foretold' },
        { ref: 'Luke 2:4', label: 'Joseph and Mary go to Bethlehem' },
        { ref: 'Luke 2:7', label: 'Jesus born here' },
        { ref: 'Matthew 2:1', label: 'Wise men seek the King' },
        { ref: 'Matthew 2:6', label: 'Ruler from Bethlehem' },
        { ref: 'Ruth 1:19', label: 'Naomi returns with Ruth' },
        { ref: '1 Samuel 16:1', label: 'Samuel anoints David' },
        { ref: 'Genesis 35:19', label: 'Rachel buried near Bethlehem' }
      ]
    },
    jordan: {
      name: 'Jordan',
      verses: [
        { ref: 'Matthew 3:13', label: 'Jesus baptized in the Jordan' },
        { ref: 'Mark 1:9', label: 'John baptizes Jesus' },
        { ref: 'Joshua 3:17', label: 'Israel crosses the Jordan' },
        { ref: '2 Kings 5:14', label: 'Naaman healed in the Jordan' },
        { ref: 'John 1:28', label: 'John baptizing at Bethany beyond Jordan' },
        { ref: 'Matthew 4:25', label: 'Crowds from beyond the Jordan' },
        { ref: 'Deuteronomy 34:1', label: 'Moses views the Promised Land' }
      ]
    },
    jerusalem: {
      name: 'Jerusalem',
      verses: [
        { ref: 'Psalm 122:6', label: 'Pray for the peace of Jerusalem' },
        { ref: 'Matthew 21:10', label: 'Jesus enters Jerusalem' },
        { ref: 'Luke 19:41', label: 'Jesus weeps over Jerusalem' },
        { ref: 'Acts 2:5', label: 'Pentecost in Jerusalem' },
        { ref: 'Revelation 21:2', label: 'New Jerusalem' },
        { ref: '2 Samuel 5:7', label: 'David captures Jerusalem' },
        { ref: '1 Kings 6:1', label: 'Solomon builds the temple' },
        { ref: 'Nehemiah 2:17', label: 'Nehemiah rebuilds the walls' }
      ]
    },
    nazareth: {
      name: 'Nazareth',
      verses: [
        { ref: 'Luke 1:26', label: 'Angel visits Mary in Nazareth' },
        { ref: 'Luke 2:51', label: 'Jesus grows up in Nazareth' },
        { ref: 'Matthew 2:23', label: 'Jesus called a Nazarene' },
        { ref: 'Matthew 4:13', label: 'Jesus settles in Nazareth' },
        { ref: 'Luke 4:16', label: 'Jesus reads in synagogue' },
        { ref: 'John 1:46', label: 'Can anything good come from Nazareth?' }
      ]
    },
    galilee: {
      name: 'Galilee',
      verses: [
        { ref: 'Matthew 4:18', label: 'Jesus calls disciples by the Sea' },
        { ref: 'Matthew 28:7', label: 'Jesus will go before you to Galilee' },
        { ref: 'John 2:1', label: 'Wedding at Cana in Galilee' },
        { ref: 'Matthew 4:23', label: 'Jesus teaches throughout Galilee' },
        { ref: 'Mark 1:14', label: 'Jesus preaches in Galilee' },
        { ref: 'Isaiah 9:1', label: 'Galilee of the nations' }
      ]
    },
    sinai: {
      name: 'Mount Sinai',
      verses: [
        { ref: 'Exodus 19:20', label: 'Lord descends on Sinai' },
        { ref: 'Exodus 20:1', label: 'Ten Commandments given' },
        { ref: 'Exodus 31:18', label: 'Tablets of the covenant' },
        { ref: 'Deuteronomy 5:2', label: 'Covenant made at Horeb' },
        { ref: '1 Kings 19:8', label: 'Elijah travels to Horeb' }
      ]
    }
  };

  var concordance = {};
  var bible = {};
  var currentNoteRef = null;
  var currentSearchWord = '';

  function getHighlights() {
    try {
      var raw = localStorage.getItem(HIGHLIGHTS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function setHighlight(ref, note) {
    var h = getHighlights();
    h[ref] = { note: (note || '').trim(), highlighted: true };
    try { localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(h)); } catch (e) {}
    syncHighlightToSupabase(ref, h[ref].note);
  }

  function removeHighlight(ref) {
    var h = getHighlights();
    delete h[ref];
    try { localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(h)); } catch (e) {}
  }

  function getOrCreateAnonId() {
    var key = 'bibleHubAnonId';
    try {
      var id = localStorage.getItem(key);
      if (id && id.length > 10) return id;
      id = 'b-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(key, id);
      return id;
    } catch (e) { return 'b-anon-' + Date.now(); }
  }

  function syncHighlightToSupabase(ref, note) {
    var cfg = window.TDB_CONFIG || {};
    var supabaseUrl = cfg.SUPABASE_URL;
    var supabaseKey = cfg.SUPABASE_ANON_KEY;
    if (!navigator.onLine || !supabaseUrl || !supabaseKey) return;
    try {
      var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
      if (!supabase || !supabase.createClient) return;
      var client = supabase.createClient(supabaseUrl, supabaseKey);
      client.rpc('upsert_bible_highlight', { p_anon_id: getOrCreateAnonId(), p_verse_ref: ref, p_note: note || '' }).catch(function () {});
    } catch (e) {}
  }

  function escapeHtml(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function highlightWord(text, word) {
    if (!word || !text) return escapeHtml(text);
    var re = new RegExp('(' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escapeHtml(text).replace(re, '<span class="concordance-word-highlight">$1</span>');
  }

  function loadData() {
    return Promise.all([
      fetch(CONCORDANCE_URL).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }),
      fetch(KJV_URL).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; })
    ]).then(function (results) {
      concordance = results[0] || {};
      bible = {};
      (results[1] || []).forEach(function (v) {
        if (v && v.ref && v.text) bible[v.ref] = v.text;
      });
    });
  }

  function searchConcordance(word) {
    var w = (word || '').trim().toLowerCase();
    if (!w) return [];
    var refs = concordance[w] || [];
    return refs;
  }

  function renderConcordanceResults(refs, word) {
    var container = document.getElementById('concordance-results');
    var countEl = document.getElementById('concordance-count');
    var listEl = document.getElementById('concordance-list');
    if (!container || !listEl) return;

    currentSearchWord = word || '';

    if (refs.length === 0) {
      if (countEl) countEl.textContent = word ? 'No verse matches found yet.' : 'Type a word above to search the concordance.';
      listEl.innerHTML = word ? '<p class="concordance-empty">No matches for "' + escapeHtml(word) + '". Try terms like faith, mercy, peace, hope, or fear.</p>' : '';
      var card = document.getElementById('concordance-verse-card');
      if (card) card.classList.add('hidden');
      return;
    }

    if (countEl) countEl.textContent = refs.length + ' hit' + (refs.length === 1 ? '' : 's');
    listEl.innerHTML = refs.map(function (ref, i) {
      return '<li class="concordance-ref-item" data-ref="' + escapeHtml(ref) + '" role="button" tabindex="0">' +
        '<span class="concordance-ref-num">' + (i + 1) + '.</span> ' +
        '<span class="concordance-ref-text">' + escapeHtml(ref) + '</span>' +
        '</li>';
    }).join('');

    listEl.querySelectorAll('.concordance-ref-item').forEach(function (li) {
      li.addEventListener('click', function () { showVerseCard(li.dataset.ref); });
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showVerseCard(li.dataset.ref); }
      });
    });
  }

  function showVerseCard(ref) {
    var card = document.getElementById('concordance-verse-card');
    var refEl = document.getElementById('concordance-verse-ref');
    var textEl = document.getElementById('concordance-verse-text');
    var btn = document.getElementById('concordance-highlight-btn');
    if (!card || !refEl || !textEl || !btn) return;

    var text = bible[ref] || '';
    var h = getHighlights();
    var isHighlighted = !!(h[ref] && h[ref].highlighted);

    refEl.textContent = ref;
    textEl.innerHTML = highlightWord(text, currentSearchWord);
    btn.textContent = isHighlighted ? 'Edit note' : 'Highlight';
    btn.dataset.ref = ref;
    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function openNoteModal(ref) {
    currentNoteRef = ref;
    var modal = document.getElementById('concordance-note-modal');
    var title = document.getElementById('concordance-note-title');
    var refEl = document.getElementById('concordance-note-ref');
    var input = document.getElementById('concordance-note-input');
    var removeBtn = document.getElementById('concordance-note-remove');
    var h = getHighlights();
    var data = h[ref] || {};
    if (modal) modal.classList.remove('hidden');
    if (title) title.textContent = (data.highlighted ? 'Edit' : 'Add') + ' note';
    if (refEl) refEl.textContent = ref;
    if (input) {
      input.value = data.note || '';
      input.placeholder = 'This reminded me of…';
    }
    if (removeBtn) removeBtn.style.display = data.highlighted ? 'inline-block' : 'none';
    if (input) setTimeout(function () { input.focus(); }, 100);
  }

  function closeNoteModal() {
    currentNoteRef = null;
    var modal = document.getElementById('concordance-note-modal');
    if (modal) modal.classList.add('hidden');
  }

  function saveNote() {
    if (!currentNoteRef) return;
    var input = document.getElementById('concordance-note-input');
    var note = input ? input.value.trim() : '';
    setHighlight(currentNoteRef, note);
    closeNoteModal();
    var btn = document.getElementById('concordance-highlight-btn');
    if (btn && btn.dataset.ref === currentNoteRef) btn.textContent = 'Edit note';
    var vmBtn = document.getElementById('verse-maps-highlight-btn');
    if (vmBtn && vmBtn.dataset.ref === currentNoteRef) vmBtn.textContent = 'Edit note';
  }

  function removeNote() {
    if (!currentNoteRef) return;
    removeHighlight(currentNoteRef);
    closeNoteModal();
    var btn = document.getElementById('concordance-highlight-btn');
    if (btn && btn.dataset.ref === currentNoteRef) btn.textContent = 'Highlight';
    var vmBtn = document.getElementById('verse-maps-highlight-btn');
    if (vmBtn && vmBtn.dataset.ref === currentNoteRef) vmBtn.textContent = 'Highlight';
  }

  function getVerseMapsPlace(query) {
    var q = (query || '').trim().toLowerCase().replace(/\s+/g, '');
    if (!q) return null;
    if (VERSE_MAPS_PLACES[q]) return VERSE_MAPS_PLACES[q];
    var keys = Object.keys(VERSE_MAPS_PLACES);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf(q) === 0 || q.indexOf(keys[i]) === 0) return VERSE_MAPS_PLACES[keys[i]];
    }
    return null;
  }

  function showVerseMaps(placeName) {
    var content = document.getElementById('verse-maps-content');
    var iframe = document.getElementById('verse-maps-iframe');
    var listEl = document.getElementById('verse-maps-verse-list');
    var card = document.getElementById('verse-maps-verse-card');
    if (!content || !iframe || !listEl) return;

    var place = getVerseMapsPlace(placeName);
    var displayName = place ? place.name : (placeName || 'Unknown');
    var verses = place ? place.verses : [];

    iframe.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(displayName) + '&t=k&z=12&output=embed';
    content.classList.remove('hidden');

    if (verses.length === 0) {
      listEl.innerHTML = '<p class="verse-maps-no-verses">No preset verses for this place. Try Bethlehem, Jordan, Jerusalem, Nazareth, Galilee, or Mount Sinai.</p>';
    } else {
      listEl.innerHTML = verses.map(function (v) {
        return '<div class="verse-maps-verse-item" data-ref="' + escapeHtml(v.ref) + '" role="button" tabindex="0">' +
          '<span class="verse-ref">' + escapeHtml(v.ref) + '</span>' +
          '<span class="verse-label">— ' + escapeHtml(v.label) + '</span>' +
          '</div>';
      }).join('');

      listEl.querySelectorAll('.verse-maps-verse-item').forEach(function (el) {
        el.addEventListener('click', function () { showVerseMapsVerseCard(el.dataset.ref); });
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showVerseMapsVerseCard(el.dataset.ref); }
        });
      });
    }

    if (card) card.classList.add('hidden');
  }

  function showVerseMapsVerseCard(ref) {
    var card = document.getElementById('verse-maps-verse-card');
    var refEl = document.getElementById('verse-maps-verse-ref');
    var textEl = document.getElementById('verse-maps-verse-text');
    var btn = document.getElementById('verse-maps-highlight-btn');
    if (!card || !refEl || !textEl || !btn) return;

    var text = bible[ref] || '';
    var h = getHighlights();
    var isHighlighted = !!(h[ref] && h[ref].highlighted);

    refEl.textContent = ref;
    textEl.textContent = text;
    btn.textContent = isHighlighted ? 'Edit note' : 'Highlight';
    btn.dataset.ref = ref;
    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* Bible Quiz */
  var quizChapters = [];
  var quizState = { currentIndex: 0, answers: [], selected: null };

  function getDailyKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getWeekKey() {
    return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  }

  function getStreakData() {
    try {
      var raw = localStorage.getItem(BIBLE_READ_STREAK_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function markReadToday() {
    var data = getStreakData();
    var today = getDailyKey();
    var lastDay = data.lastKey || '';
    var count = Number(data.count || 0);
    if (lastDay === today) return count;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var prevDay = yesterday.getFullYear() + '-' + String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + String(yesterday.getDate()).padStart(2, '0');
    if (lastDay === prevDay) count += 1;
    else count = 1;
    try {
      localStorage.setItem(BIBLE_READ_STREAK_KEY, JSON.stringify({ count: count, lastKey: today }));
    } catch (e) {}
    syncQuizStreakToSupabase(count, today);
    return count;
  }

  function syncQuizStreakToSupabase(count, lastDay) {
    var cfg = window.TDB_CONFIG || {};
    if (!navigator.onLine || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return;
    try {
      var supabase = window.supabase && window.supabase.createClient ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
      if (supabase) supabase.rpc('upsert_adult_streak', { p_anon_id: getOrCreateAnonId(), p_streak_count: count, p_last_day: lastDay }).catch(function () {});
    } catch (e) {}
  }

  function loadQuizChapters() {
    return fetch(CHAPTERS_URL).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; })
      .then(function (arr) { quizChapters = arr || []; return quizChapters; });
  }

  function getTodayChapterIndex() {
    return Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % (quizChapters.length || 1);
  }

  function isQuizTakenThisWeek() {
    try {
      var w = localStorage.getItem(QUIZ_TAKEN_KEY);
      return w === String(getWeekKey());
    } catch (e) { return false; }
  }

  function setQuizTaken() {
    try { localStorage.setItem(QUIZ_TAKEN_KEY, String(getWeekKey())); } catch (e) {}
  }

  function openQuizModal() {
    if (quizChapters.length === 0) return;
    var idx = getTodayChapterIndex();
    var ch = quizChapters[idx];
    var questions = ch ? BIBLE_QUIZ_QUESTIONS[ch.chapter] : null;
    if (!questions || questions.length < 5) {
      var hint = document.getElementById('bible-quiz-hint');
      if (hint) hint.textContent = 'Today\'s chapter quiz is still being prepared. Check back shortly.';
      return;
    }
    if (isQuizTakenThisWeek()) {
      var hint = document.getElementById('bible-quiz-hint');
      if (hint) hint.textContent = 'Quiz already taken this week. Come back next week!';
      return;
    }
    quizState = { currentIndex: 0, answers: [], selected: null };
    var modal = document.getElementById('bible-quiz-modal');
    var title = document.getElementById('bible-quiz-modal-title');
    var chapterEl = document.getElementById('bible-quiz-chapter');
    var questionsEl = document.getElementById('bible-quiz-questions');
    var resultEl = document.getElementById('bible-quiz-result');
    var actionsEl = document.getElementById('bible-quiz-actions');
    if (modal) modal.classList.remove('hidden');
    if (title) title.textContent = 'Today\'s Quiz';
    if (chapterEl) chapterEl.textContent = ch.chapter;
    if (chapterEl) chapterEl.classList.remove('hidden');
    if (resultEl) resultEl.classList.add('hidden');
    if (actionsEl) actionsEl.classList.remove('hidden');
    quizState.chapter = ch.chapter;
    quizState.questions = questions;
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    var questionsEl = document.getElementById('bible-quiz-questions');
    var nextBtn = document.getElementById('bible-quiz-next');
    if (!questionsEl || !quizState.questions) return;
    var i = quizState.currentIndex;
    var q = quizState.questions[i];
    if (!q) return;
    questionsEl.innerHTML = '<p class="bible-quiz-q-text">' + (i + 1) + '. ' + escapeHtml(q.q) + '</p>' +
      '<div class="bible-quiz-options">' +
      q.options.map(function (opt, j) {
        return '<label class="bible-quiz-option"><input type="radio" name="quiz-opt" value="' + j + '"> <span>' + escapeHtml(opt) + '</span></label>';
      }).join('') +
      '</div>';
    questionsEl.querySelectorAll('input[name="quiz-opt"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        quizState.selected = parseInt(radio.value, 10);
        if (nextBtn) nextBtn.disabled = false;
      });
    });
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.textContent = i < quizState.questions.length - 1 ? 'Next' : 'Finish';
    }
  }

  function nextQuizQuestion() {
    if (quizState.selected === null) return;
    var correct = quizState.questions[quizState.currentIndex].correct;
    quizState.answers.push({ selected: quizState.selected, correct: correct });
    quizState.currentIndex += 1;
    quizState.selected = null;
    if (quizState.currentIndex >= quizState.questions.length) {
      finishQuiz();
    } else {
      renderQuizQuestion();
    }
  }

  function finishQuiz() {
    var questionsEl = document.getElementById('bible-quiz-questions');
    var resultEl = document.getElementById('bible-quiz-result');
    var scoreEl = document.getElementById('bible-quiz-score');
    var messageEl = document.getElementById('bible-quiz-message');
    var actionsEl = document.getElementById('bible-quiz-actions');
    var chapterEl = document.getElementById('bible-quiz-chapter');
    if (!questionsEl || !resultEl) return;
    var correctCount = quizState.answers.filter(function (a) { return a.selected === a.correct; }).length;
    var total = quizState.questions.length;
    var passed = correctCount >= 4;
    questionsEl.innerHTML = quizState.questions.map(function (q, i) {
      var a = quizState.answers[i];
      var ok = a && a.selected === a.correct;
      var icon = ok ? '<span class="bible-quiz-icon-ok" aria-hidden="true">✓</span>' : '<span class="bible-quiz-icon-x" aria-hidden="true">✗</span>';
      var ansText = a ? escapeHtml(q.options[a.selected]) : '';
      if (!ok && a) ansText += ' (correct: ' + escapeHtml(q.options[a.correct]) + ')';
      return '<div class="bible-quiz-review-item ' + (ok ? 'correct' : 'wrong') + '">' + icon + ' ' + (i + 1) + '. ' + escapeHtml(q.q) + ' → ' + ansText + '</div>';
    }).join('');
    if (chapterEl) chapterEl.classList.add('hidden');
    if (scoreEl) scoreEl.textContent = correctCount + '/' + total;
    if (messageEl) {
      messageEl.textContent = passed ? 'Strong work - +1 weekly streak.' : 'Keep going - review the chapter and try again next week.';
      messageEl.className = 'bible-quiz-message ' + (passed ? 'bible-quiz-win' : '');
    }
    resultEl.classList.remove('hidden');
    actionsEl.classList.add('hidden');
    if (passed) {
      setQuizTaken();
      markReadToday();
      if (typeof window.tdbConfetti === 'function') window.tdbConfetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#22c55e', '#fbbf24', '#d4af37'] });
      else if (typeof confetti === 'function') try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#22c55e', '#fbbf24', '#d4af37'] }); } catch (e) {}
    }
  }

  function closeQuizModal() {
    var modal = document.getElementById('bible-quiz-modal');
    if (modal) modal.classList.add('hidden');
    var hint = document.getElementById('bible-quiz-hint');
    if (hint) hint.textContent = 'Test your knowledge of today\'s chapter.';
  }

  /* Verse Memory Game */
  var memoryState = { cards: [], currentIndex: 0, results: [], checked: false };

  function createBlankedVerse(text, ref) {
    var words = text.split(/\s+/);
    if (words.length < 3) return null;
    var candid = [];
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      var clean = w.replace(/[^\w]/g, '');
      if (clean.length >= 4) candid.push({ idx: i, word: w, clean: clean.toLowerCase() });
    }
    if (candid.length === 0) return null;
    var pick = candid[Math.floor(Math.random() * candid.length)];
    var display = words.slice();
    display[pick.idx] = '_____';
    return {
      display: display.join(' ') + ' – ' + ref,
      answer: pick.clean,
      hint: (pick.word || '').replace(/[^\w]+$/, '')
    };
  }

  function collectMemoryVerses() {
    var out = [];
    var chIdx = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % (quizChapters.length || 1);
    var ch = quizChapters[chIdx];
    if (ch && ch.verses) {
      ch.verses.forEach(function (v) {
        var ref = ch.chapter + ':' + (v.ref || '');
        var blanked = createBlankedVerse(v.text || '', ref);
        if (blanked) out.push(blanked);
      });
    }
    var weekIdx = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000)) % VERSE_OF_WEEK_THEMES.length;
    var theme = VERSE_OF_WEEK_THEMES[weekIdx];
    if (theme && theme.verses) {
      theme.verses.forEach(function (v) {
        var blanked = createBlankedVerse(v.text || '', v.ref || '');
        if (blanked) out.push(blanked);
      });
    }
    return out;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function isMemoryDoneToday() {
    try {
      var d = localStorage.getItem(MEMORY_DONE_KEY);
      return d === getDailyKey();
    } catch (e) { return false; }
  }

  function setMemoryDone() {
    try { localStorage.setItem(MEMORY_DONE_KEY, getDailyKey()); } catch (e) {}
  }

  function addMemoryStreakBonus() {
    var data = getStreakData();
    var count = Number(data.count || 0);
    count += 0.5;
    count = Math.ceil(count);
    try {
      localStorage.setItem(BIBLE_READ_STREAK_KEY, JSON.stringify({ count: count, lastKey: data.lastKey || getDailyKey() }));
    } catch (e) {}
    syncQuizStreakToSupabase(count, data.lastKey || getDailyKey());
  }

  function openMemoryModal() {
    if (isMemoryDoneToday()) {
      var hint = document.getElementById('verse-memory-hint');
      if (hint) hint.textContent = 'Memory game already done today. Come back tomorrow!';
      return;
    }
    var verses = collectMemoryVerses();
    if (verses.length < 5) {
      var hint = document.getElementById('verse-memory-hint');
      if (hint) hint.textContent = 'Not enough verses are loaded yet. Check back shortly.';
      return;
    }
    memoryState = { cards: shuffle(verses).slice(0, 5), currentIndex: 0, results: [], checked: false };
    var modal = document.getElementById('verse-memory-modal');
    var resultEl = document.getElementById('verse-memory-result');
    var actionsEl = document.getElementById('verse-memory-actions');
    if (modal) modal.classList.remove('hidden');
    if (resultEl) resultEl.classList.add('hidden');
    if (actionsEl) actionsEl.classList.remove('hidden');
    renderMemoryCard();
  }

  function renderMemoryCard() {
    var cardsEl = document.getElementById('verse-memory-cards');
    var nextBtn = document.getElementById('verse-memory-next');
    if (!cardsEl || !memoryState.cards.length) return;
    var i = memoryState.currentIndex;
    var card = memoryState.cards[i];
    var result = memoryState.results[i];
    var isLast = i === memoryState.cards.length - 1;
    if (result !== undefined) {
      var icon = result.correct ? '<span class="verse-memory-icon-ok" aria-hidden="true">✓</span>' : '<span class="verse-memory-icon-x" aria-hidden="true">✗</span>';
      var hint = result.correct ? '' : ' (correct: ' + escapeHtml(result.hint) + ')';
      cardsEl.innerHTML = '<div class="verse-memory-card verse-memory-card-flipped">' +
        '<p class="verse-memory-blanked">' + escapeHtml(card.display) + '</p>' +
        '<p class="verse-memory-feedback ' + (result.correct ? 'correct' : 'wrong') + '">' + icon + ' ' + escapeHtml(result.userAnswer || '(blank)') + hint + '</p>' +
        '</div>';
    } else {
      cardsEl.innerHTML = '<div class="verse-memory-card">' +
        '<p class="verse-memory-blanked">' + escapeHtml(card.display) + '</p>' +
        '<input type="text" id="verse-memory-input" class="verse-memory-input" placeholder="Type the missing word" autocomplete="off" aria-label="Your answer">' +
        '</div>';
      var inp = document.getElementById('verse-memory-input');
      if (inp) {
        setTimeout(function () { inp.focus(); }, 100);
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); nextMemoryCard(); }
        });
      }
    }
    if (nextBtn) {
      nextBtn.textContent = result !== undefined ? (isLast ? 'Finish' : 'Next') : (isLast ? 'Finish' : 'Next');
    }
  }

  function nextMemoryCard() {
    var i = memoryState.currentIndex;
    var card = memoryState.cards[i];
    var result = memoryState.results[i];
    if (result === undefined) {
      var inp = document.getElementById('verse-memory-input');
      var userAnswer = inp ? (inp.value || '').trim() : '';
      var correct = userAnswer.toLowerCase() === card.answer;
      memoryState.results[i] = { correct: correct, userAnswer: userAnswer, hint: card.hint };
      renderMemoryCard();
      return;
    }
    memoryState.currentIndex += 1;
    if (memoryState.currentIndex >= memoryState.cards.length) {
      finishMemoryGame();
    } else {
      renderMemoryCard();
    }
  }

  function finishMemoryGame() {
    var cardsEl = document.getElementById('verse-memory-cards');
    var resultEl = document.getElementById('verse-memory-result');
    var scoreEl = document.getElementById('verse-memory-score');
    var messageEl = document.getElementById('verse-memory-message');
    var actionsEl = document.getElementById('verse-memory-actions');
    if (!resultEl) return;
    var correctCount = memoryState.results.filter(function (r) { return r && r.correct; }).length;
    var total = memoryState.cards.length;
    var passed = correctCount >= 3;
    cardsEl.innerHTML = memoryState.cards.map(function (c, j) {
      var r = memoryState.results[j];
      var ok = r && r.correct;
      var icon = ok ? '<span class="verse-memory-icon-ok">✓</span>' : '<span class="verse-memory-icon-x">✗</span>';
      var hint = ok ? '' : ' (correct: ' + escapeHtml(c.hint) + ')';
      return '<div class="verse-memory-review-item ' + (ok ? 'correct' : 'wrong') + '">' + icon + ' ' + escapeHtml(c.display) + ' → ' + escapeHtml(r ? r.userAnswer : '') + hint + '</div>';
    }).join('');
    if (scoreEl) scoreEl.textContent = correctCount + '/' + total;
    if (messageEl) {
      messageEl.textContent = passed ? 'Great recall - +0.5 streak bonus.' : 'Keep practicing - try again tomorrow.';
      messageEl.className = 'verse-memory-message ' + (passed ? 'verse-memory-win' : '');
    }
    resultEl.classList.remove('hidden');
    actionsEl.classList.add('hidden');
    setMemoryDone();
    if (passed) {
      addMemoryStreakBonus();
      if (typeof window.tdbConfetti === 'function') window.tdbConfetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#22c55e', '#d4af37'] });
      else if (typeof confetti === 'function') try { confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#22c55e', '#d4af37'] }); } catch (e) {}
    }
  }

  function closeMemoryModal() {
    var modal = document.getElementById('verse-memory-modal');
    if (modal) modal.classList.add('hidden');
    var hint = document.getElementById('verse-memory-hint');
    if (hint) hint.textContent = 'Fill in the blank. From today\'s chapter or this week\'s theme.';
  }

  function init() {
    loadData().then(function () {
      renderConcordanceResults([], '');
      var searchInput = document.getElementById('concordance-search-input');
      var searchBtn = document.getElementById('concordance-search-btn');

      /* Verse Maps */
      var vmInput = document.getElementById('verse-maps-input');
      var vmBtn = document.getElementById('verse-maps-show-btn');
      if (vmBtn && vmInput) {
        vmBtn.addEventListener('click', function () {
          var q = vmInput.value.trim();
          if (q) showVerseMaps(q);
        });
        vmInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            var q = vmInput.value.trim();
            if (q) showVerseMaps(q);
          }
        });
      }
      var vmHighlightBtn = document.getElementById('verse-maps-highlight-btn');
      if (vmHighlightBtn) {
        vmHighlightBtn.addEventListener('click', function () {
          var ref = vmHighlightBtn.dataset.ref;
          if (ref) openNoteModal(ref);
        });
      }
      var vmAccordion = document.getElementById('verse-maps-accordion-trigger');
      var vmList = document.getElementById('verse-maps-verse-list');
      if (vmAccordion && vmList) {
        vmAccordion.addEventListener('click', function () {
          var expanded = vmAccordion.getAttribute('aria-expanded') === 'true';
          vmAccordion.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      }

      /* Bible Quiz */
      loadQuizChapters().then(function () {
        var hint = document.getElementById('bible-quiz-hint');
        var takeQuizBtn = document.getElementById('take-quiz-btn');
        if (isQuizTakenThisWeek()) {
          if (hint) hint.textContent = 'Quiz already taken this week. Come back next week!';
          if (takeQuizBtn) takeQuizBtn.disabled = true;
        }
      });
      var takeQuizBtn = document.getElementById('take-quiz-btn');
      if (takeQuizBtn) takeQuizBtn.addEventListener('click', openQuizModal);

      /* Verse Memory */
      var memHint = document.getElementById('verse-memory-hint');
      var memBtn = document.getElementById('memorize-verse-btn');
      if (isMemoryDoneToday()) {
        if (memHint) memHint.textContent = 'Memory game already done today. Come back tomorrow!';
        if (memBtn) memBtn.disabled = true;
      }
      if (memBtn) memBtn.addEventListener('click', openMemoryModal);
      var memNextBtn = document.getElementById('verse-memory-next');
      if (memNextBtn) memNextBtn.addEventListener('click', nextMemoryCard);
      var memCloseBtn = document.getElementById('verse-memory-close');
      if (memCloseBtn) memCloseBtn.addEventListener('click', closeMemoryModal);
      var memModal = document.getElementById('verse-memory-modal');
      if (memModal) memModal.addEventListener('click', function (e) { if (e.target === memModal) closeMemoryModal(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && memModal && !memModal.classList.contains('hidden')) { closeMemoryModal(); e.preventDefault(); }
      });
      var quizNextBtn = document.getElementById('bible-quiz-next');
      if (quizNextBtn) quizNextBtn.addEventListener('click', nextQuizQuestion);
      var quizCloseBtn = document.getElementById('bible-quiz-close');
      if (quizCloseBtn) quizCloseBtn.addEventListener('click', closeQuizModal);
      var quizModal = document.getElementById('bible-quiz-modal');
      if (quizModal) quizModal.addEventListener('click', function (e) { if (e.target === quizModal) closeQuizModal(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && quizModal && !quizModal.classList.contains('hidden')) { closeQuizModal(); e.preventDefault(); }
      });

      function doSearch() {
        var q = searchInput ? searchInput.value.trim() : '';
        if (!q) {
          renderConcordanceResults([], '');
          document.getElementById('concordance-verse-card').classList.add('hidden');
          return;
        }
        var refs = searchConcordance(q);
        renderConcordanceResults(refs, q);
      }

      if (searchBtn) searchBtn.addEventListener('click', doSearch);
      if (searchInput) {
        searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch(); });
        searchInput.addEventListener('input', function () {
          var q = (searchInput.value || '').trim().toLowerCase();
          if (q.length >= 2) {
            var refs = searchConcordance(q);
            renderConcordanceResults(refs, q);
          } else if (q.length === 0) {
            renderConcordanceResults([], '');
            document.getElementById('concordance-verse-card').classList.add('hidden');
          }
        });
      }

      var highlightBtn = document.getElementById('concordance-highlight-btn');
      if (highlightBtn) {
        highlightBtn.addEventListener('click', function () {
          var ref = highlightBtn.dataset.ref;
          if (ref) openNoteModal(ref);
        });
      }

      var saveBtn = document.getElementById('concordance-note-save');
      var removeBtn = document.getElementById('concordance-note-remove');
      if (saveBtn) saveBtn.addEventListener('click', saveNote);
      if (removeBtn) removeBtn.addEventListener('click', removeNote);

      var modal = document.getElementById('concordance-note-modal');
      if (modal) {
        modal.addEventListener('click', function (e) {
          if (e.target === modal) closeNoteModal();
        });
      }
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && currentNoteRef) {
          closeNoteModal();
          e.preventDefault();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
