/**
 * Bible Hub — daily verse, streak, Read It!, share, greet, prayer, audio.
 * Works with script.js (renderDailyVerse, getDailyVerseRef, bible, getPlainMeaning).
 */
(function () {
  'use strict';

  const BIBLE_READ_STREAK_KEY = 'bibleReadStreak';
  const BIBLE_USER_NAME_KEY = 'bibleUserName';
  const BIBLE_PRAYER_KEY = 'biblePrayer';
  const BIBLE_REFLECTION_KEY = 'bibleReflection';
  const CHAPTERS_URL = '../chapters.json';
  const HIGHLIGHTS_KEY = 'bibleHighlights';
  const KJV_URL = '../kjv.json';

  /* Verse of the Week: 5 themes, 5 verses each. Date-based cycle. */
  var VERSE_OF_WEEK_THEMES = [
    {
      name: 'Courage',
      icon: '<svg class="verse-of-week-thumb" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 4L6 12v12c0 11 8 20 18 22 10-2 18-11 18-22V12L24 4z"/><path d="M24 16v16M16 24h16"/></svg>',
      verses: [
        { ref: 'Joshua 1:9', text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.' },
        { ref: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee; be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.' },
        { ref: '2 Timothy 1:7', text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.' },
        { ref: 'Psalm 27:1', text: 'The Lord is my light and my salvation; whom shall I fear? the Lord is the strength of my life; of whom shall I be afraid?' },
        { ref: '1 Corinthians 16:13', text: 'Watch ye, stand fast in the faith, quit you like men, be strong.' }
      ]
    },
    {
      name: 'Love',
      icon: '<svg class="verse-of-week-thumb" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 42c-8-6-16-14-16-22a8 8 0 0116 0 8 8 0 0116 0c0 8-8 16-16 22z"/></svg>',
      verses: [
        { ref: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
        { ref: 'Romans 5:8', text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.' },
        { ref: '1 Corinthians 13:4', text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,' },
        { ref: 'John 15:11', text: 'These things have I spoken unto you, that my joy might remain in you, and that your joy might be full.' },
        { ref: 'Psalm 34:18', text: 'The Lord is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.' }
      ]
    },
    {
      name: 'Faith',
      icon: '<svg class="verse-of-week-thumb" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 4l4 12h12l-10 8 4 12-10-7-10 7 4-12-10-8h12z"/></svg>',
      verses: [
        { ref: 'Hebrews 11:1', text: 'Now faith is the substance of things hoped for, the evidence of things not seen.' },
        { ref: 'Ephesians 2:8', text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:' },
        { ref: 'Romans 10:17', text: 'So then faith cometh by hearing, and hearing by the word of God.' },
        { ref: 'Hebrews 12:1', text: 'Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and run with patience the race that is set before us,' },
        { ref: 'James 1:12', text: 'Blessed is the man that endureth temptation: for when he is tried, he shall receive the crown of life, which the Lord hath promised to them that love him.' }
      ]
    },
    {
      name: 'Hope',
      icon: '<svg class="verse-of-week-thumb" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 8v32M8 24h32"/><circle cx="24" cy="24" r="6"/></svg>',
      verses: [
        { ref: 'Jeremiah 29:11', text: 'For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.' },
        { ref: 'Romans 15:13', text: 'Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.' },
        { ref: 'Romans 5:5', text: 'And hope maketh not ashamed; because the love of God is shed abroad in our hearts by the Holy Ghost which is given unto us.' },
        { ref: 'Romans 8:28', text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
        { ref: 'Psalm 16:11', text: 'Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore.' }
      ]
    },
    {
      name: 'Peace',
      icon: '<svg class="verse-of-week-thumb" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 4c-4 8-12 12-12 20 0 6 5 10 12 10s12-4 12-10c0-8-8-12-12-20z"/></svg>',
      verses: [
        { ref: 'John 14:27', text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.' },
        { ref: 'Isaiah 26:3', text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.' },
        { ref: 'Philippians 4:7', text: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.' },
        { ref: 'Matthew 11:28', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' },
        { ref: '1 Peter 5:7', text: 'Casting all your care upon him; for he careth for you.' }
      ]
    }
  ];

  function getDailyKey() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function getStreakData() {
    try {
      var raw = localStorage.getItem(BIBLE_READ_STREAK_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function getCurrentStreak() {
    var data = getStreakData();
    return Number(data.count || 0);
  }

  function isDoneToday() {
    var data = getStreakData();
    return data.lastKey === getDailyKey();
  }

  function getUserName() {
    try {
      var n = localStorage.getItem(BIBLE_USER_NAME_KEY);
      return (n && typeof n === 'string') ? n.trim() : '';
    } catch (e) { return ''; }
  }

  function getWeekKey() {
    return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  }

  function applyChallengeBonus() {
    try {
      var shared = localStorage.getItem('challengeShared');
      var applied = localStorage.getItem('challengeBonusApplied');
      if (!shared) return 0;
      var t = parseInt(shared, 10);
      var weekKey = Math.floor(t / (7 * 24 * 60 * 60 * 1000));
      if (weekKey !== getWeekKey()) return 0;
      if (applied === String(weekKey)) return 0;
      localStorage.setItem('challengeBonusApplied', String(weekKey));
      return 1;
    } catch (e) { return 0; }
  }

  function getReflectionForToday() {
    var input = document.getElementById('reflection');
    return input ? (input.value || '').trim() : '';
  }

  function hasReflectionBonus() {
    var r = getReflectionForToday();
    return r.length > 10;
  }

  function markReadToday() {
    var data = getStreakData();
    var today = getDailyKey();
    var lastDay = data.lastKey || '';
    var count = Number(data.count || 0);
    if (lastDay === today) return count;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var y = yesterday.getFullYear();
    var m = String(yesterday.getMonth() + 1).padStart(2, '0');
    var day = String(yesterday.getDate()).padStart(2, '0');
    var prevDay = y + '-' + m + '-' + day;
    if (lastDay === prevDay) count += 1;
    else count = 1;
    var bonus = applyChallengeBonus();
    if (bonus > 0) count += 1;
    if (hasReflectionBonus()) count += 0.5;
    count = Math.ceil(count);
    try {
      localStorage.setItem(BIBLE_READ_STREAK_KEY, JSON.stringify({ count: count, lastKey: today }));
    } catch (e) {}
    syncStreakToSupabase(count, today);
    return count;
  }

  function syncStreakToSupabase(count, lastDay) {
    var cfg = window.TDB_CONFIG || {};
    var supabaseUrl = cfg.SUPABASE_URL;
    var supabaseKey = cfg.SUPABASE_ANON_KEY;
    if (!navigator.onLine || !supabaseUrl || !supabaseKey) return;
    var anonId = getOrCreateAnonId();
    try {
      var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
      if (!supabase || !supabase.createClient) return;
      var client = supabase.createClient(supabaseUrl, supabaseKey);
      client.rpc('upsert_adult_streak', { p_anon_id: anonId, p_streak_count: count, p_last_day: lastDay }).catch(function () {});
    } catch (e) {}
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

  function renderGreet() {
    var el = document.getElementById('bible-hub-greet');
    if (!el) return;
    var name = getUserName() || 'Friend';
    var streak = getCurrentStreak();
    el.textContent = 'Hey, ' + name + '! Your streak: ' + streak + ' day' + (streak === 1 ? '' : 's');
  }

  function renderStreak() {
    var el = document.getElementById('bible-hub-streak');
    var btn = document.getElementById('bible-hub-read-btn');
    if (!el) return;
    var streak = getCurrentStreak();
    var done = isDoneToday();
    el.innerHTML = '🔥 ' + streak + ' day' + (streak === 1 ? '' : 's');
    if (btn) {
      btn.textContent = done ? 'Read today!' : 'Read It!';
      btn.disabled = done;
    }
  }

  var chapters = [];

  function getTodayChapterIndex() {
    var dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    return dayIndex % (chapters.length || 1);
  }

  function loadChapters() {
    return fetch(CHAPTERS_URL)
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (arr) {
        chapters = arr || [];
        return chapters;
      })
      .catch(function () {
        chapters = [];
        return [];
      });
  }

  function renderReadingPlan() {
    var nameEl = document.getElementById('bible-hub-chapter-name');
    if (!nameEl || chapters.length === 0) return;
    var idx = getTodayChapterIndex();
    var ch = chapters[idx];
    nameEl.textContent = ch ? ch.chapter : '—';
  }

  function escapeHtml(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function openChapterModal() {
    var modal = document.getElementById('bible-hub-chapter-modal');
    var titleEl = document.getElementById('bible-hub-chapter-modal-title');
    var contentEl = document.getElementById('bible-hub-chapter-content');
    var paraphraseEl = document.getElementById('bible-hub-chapter-paraphrase');
    if (!modal || !titleEl || !contentEl || !paraphraseEl) return;
    var idx = getTodayChapterIndex();
    var ch = chapters[idx];
    if (!ch) return;
    titleEl.textContent = ch.chapter;
    contentEl.innerHTML = (ch.verses || []).map(function (v) {
      return '<p class="chapter-verse"><span class="chapter-verse-num">' + escapeHtml(String(v.ref || '')) + '.</span> ' + escapeHtml(String(v.text || '')) + '</p>';
    }).join('');
    paraphraseEl.textContent = ch.paraphrase || '';
    paraphraseEl.style.display = ch.paraphrase ? 'block' : 'none';
    modal.classList.remove('hidden');
  }

  function closeChapterModal() {
    var modal = document.getElementById('bible-hub-chapter-modal');
    if (modal) modal.classList.add('hidden');
  }

  function wireChapterFinished() {
    var btn = document.getElementById('bible-hub-chapter-finished-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (!isDoneToday()) {
        savePrayer();
        saveReflection();
        markReadToday();
        renderStreak();
        renderGreet();
      }
      closeChapterModal();
    });
  }

  function wireChapterClose() {
    var btn = document.getElementById('bible-hub-chapter-close-btn');
    if (!btn) return;
    btn.addEventListener('click', closeChapterModal);
  }

  function wireChapterModalBackdrop() {
    var modal = document.getElementById('bible-hub-chapter-modal');
    if (!modal) return;
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeChapterModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeChapterModal();
        e.preventDefault();
      }
    });
  }

  var PLAIN_MEANINGS = {
    'Philippians 4:6': 'Don\'t worry—pray with thanks and tell God what you need.',
    'Philippians 4:13': 'Christ gives me strength for whatever I face today.',
    'John 3:16': 'God loves you so much He sent Jesus. Believe in Him.',
    'Joshua 1:9': 'Be strong and courageous. God is with you.',
    'Psalm 23:1': 'God is my shepherd—I have everything I need.',
    'Isaiah 41:10': 'Don\'t fear. God is with you and will strengthen you.',
    'Romans 8:28': 'God works all things for good for those who love Him.',
    'Proverbs 3:5': 'Trust God with your whole heart—don\'t rely on your own understanding.'
  };

  function updateTeaseAndExtras() {
    var card = document.getElementById('daily-verse-card');
    var tease = document.getElementById('bible-hub-ref-tease');
    var plainEl = document.getElementById('bible-hub-plain-meaning');
    if (!card || !tease) return;
    var ref = card.querySelector('strong');
    var refText = ref ? ref.textContent.trim() : '';
    if (refText) tease.textContent = refText;
    if (plainEl) {
      var plain = PLAIN_MEANINGS[refText] || (typeof getPlainMeaning === 'function' ? getPlainMeaning(refText) : '');
      if (plain) {
        plainEl.textContent = 'Plain meaning: ' + plain;
        plainEl.classList.remove('hidden');
      } else {
        plainEl.classList.add('hidden');
      }
    }
  }

  function loadPrayer() {
    var input = document.getElementById('bible-hub-prayer-input');
    if (!input) return;
    try {
      var raw = localStorage.getItem(BIBLE_PRAYER_KEY);
      var val = raw ? JSON.parse(raw) : {};
      var today = getDailyKey();
      input.value = (val[today] || val.default || '').trim();
      if (!input.value) input.placeholder = 'Lord, help me live this today.';
    } catch (e) {}
  }

  function getCurrentVerseRef() {
    var card = document.getElementById('daily-verse-card');
    var ref = card && card.querySelector('strong');
    return ref ? ref.textContent.trim() : '';
  }

  function loadReflection() {
    var input = document.getElementById('reflection');
    if (!input) return;
    try {
      var raw = localStorage.getItem(BIBLE_REFLECTION_KEY);
      var val = raw ? JSON.parse(raw) : {};
      var today = getDailyKey();
      var entry = val[today];
      var text = typeof entry === 'string' ? entry : (entry && entry.text ? entry.text : '');
      input.value = (text || '').trim();
    } catch (e) {}
  }

  function saveReflection() {
    var input = document.getElementById('reflection');
    if (!input) return;
    try {
      var raw = localStorage.getItem(BIBLE_REFLECTION_KEY);
      var val = raw ? JSON.parse(raw) : {};
      var today = getDailyKey();
      var text = (input.value || '').trim();
      var verse = getCurrentVerseRef();
      val[today] = { text: text, verse: verse };
      localStorage.setItem(BIBLE_REFLECTION_KEY, JSON.stringify(val));
      showReflectionSavedDot();
      if (navigator.onLine) syncReflectionToSupabase(today, text, verse);
    } catch (e) {}
  }

  function showReflectionSavedDot() {
    var dot = document.getElementById('reflection-saved-dot');
    if (!dot) return;
    dot.classList.remove('hidden');
    dot.textContent = 'Saved!';
    clearTimeout(showReflectionSavedDot._t);
    showReflectionSavedDot._t = setTimeout(function () {
      dot.classList.add('hidden');
    }, 2000);
  }

  function syncReflectionToSupabase(dateKey, reflection, verseRef) {
    var cfg = window.TDB_CONFIG || {};
    var supabaseUrl = cfg.SUPABASE_URL;
    var supabaseKey = cfg.SUPABASE_ANON_KEY;
    if (!navigator.onLine || !supabaseUrl || !supabaseKey) return;
    var anonId = getOrCreateAnonId();
    try {
      var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
      if (!supabase || !supabase.createClient) return;
      var client = supabase.createClient(supabaseUrl, supabaseKey);
      client.rpc('upsert_bible_reflection', {
        p_anon_id: anonId,
        p_date: dateKey,
        p_reflection: reflection || '',
        p_verse_ref: verseRef || ''
      }).catch(function () {});
    } catch (e) {}
  }

  function savePrayer() {
    var input = document.getElementById('bible-hub-prayer-input');
    if (!input) return;
    try {
      var raw = localStorage.getItem(BIBLE_PRAYER_KEY);
      var val = raw ? JSON.parse(raw) : {};
      var today = getDailyKey();
      val[today] = (input.value || '').trim();
      if (!val.default) val.default = 'Lord, help me live this today.';
      localStorage.setItem(BIBLE_PRAYER_KEY, JSON.stringify(val));
    } catch (e) {}
  }

  function wireReadBtn() {
    var btn = document.getElementById('bible-hub-read-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (isDoneToday()) return;
      savePrayer();
      saveReflection();
      markReadToday();
      renderStreak();
      renderGreet();
    });
  }

  function wireShareBtn() {
    var btn = document.getElementById('bible-hub-share-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var card = document.getElementById('daily-verse-card');
      var ref = card && card.querySelector('strong');
      var p = card && card.querySelector('p');
      var refText = ref ? ref.textContent : '';
      var verseText = p ? p.textContent : '';
      var shareText = refText && verseText
        ? refText + ': ' + verseText + ' — Less scroll. More soul. #TodaysDailyBattle'
        : 'Today\'s Daily Battle — Less scroll. More soul.';
      var url = 'https://todaysdailybattle.com/bible/';
      if (navigator.share) {
        navigator.share({
          title: 'Bible Hub — Today\'s Daily Battle',
          text: shareText,
          url: url
        }).catch(function () {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText + ' ' + url).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Share'; }, 2000);
        }).catch(function () {});
      }
    });
  }

  var ttsOfflineAudio = null;
  var TTS_OFFLINE_FALLBACK = 'psalm-23-1';
  var TTS_OFFLINE_VERSE_MAP = {
    'psalm 23:1': 'psalm-23-1',
    'psalms 23:1': 'psalm-23-1',
    'john 3:16': 'john-3-16',
    'philippians 4:6': 'philippians-4-6',
    'philippians 4:13': 'philippians-4-6',
    'joshua 1:9': 'joshua-1-9',
    'isaiah 41:10': 'isaiah-41-10'
  };

  function verseRefToMp3Key(ref) {
    if (!ref || typeof ref !== 'string') return TTS_OFFLINE_FALLBACK;
    var key = ref.toLowerCase().trim().replace(/\s+/g, ' ');
    return TTS_OFFLINE_VERSE_MAP[key] || TTS_OFFLINE_FALLBACK;
  }

  function playVerseTTS(ref, text, btnEl) {
    var btn = btnEl || document.getElementById('bible-hub-audio-btn');
    var setBtn = function (t, loading) {
      if (!btn) return;
      btn.textContent = t;
      if (loading !== undefined) {
        if (loading) btn.classList.add('loading');
        else btn.classList.remove('loading');
      }
    };
    var showToast = function (msg) {
      if (typeof window.showEliteToast === 'function') window.showEliteToast(msg);
    };

    if (!navigator.onLine) {
      if (ttsOfflineAudio && !ttsOfflineAudio.paused) {
        ttsOfflineAudio.pause();
        ttsOfflineAudio.currentTime = 0;
        ttsOfflineAudio = null;
        setBtn('Listen', false);
        return;
      }
      var mp3Key = verseRefToMp3Key(ref);
      var url = '/audio/' + mp3Key + '.mp3';
      setBtn('…', true);
      showToast('Buffering offline audio…');
      var audio = new Audio(url);
      ttsOfflineAudio = audio;
      audio.play().then(function () {
        setBtn('Stop', false);
        showToast('Offline – playing pre-recorded version');
      }).catch(function (e) {
        console.warn('Fallback audio failed:', e);
        ttsOfflineAudio = null;
        setBtn('Listen', false);
        showToast('Offline audio unavailable. Add MP3s to /audio/');
      });
      audio.onended = audio.onerror = function () {
        ttsOfflineAudio = null;
        setBtn('Listen', false);
      };
      return;
    }

    var synth = window.speechSynthesis;
    if (!synth) {
      setBtn('No audio', false);
      return;
    }
    if (synth.speaking) {
      synth.cancel();
      setBtn('Listen', false);
      return;
    }
    var u = new SpeechSynthesisUtterance(text || '');
    u.rate = 0.9;
    u.pitch = 1;
    setBtn('…', true);
    u.onend = u.onerror = function () { setBtn('Listen', false); };
    synth.speak(u);
  }

  function wireAudioBtn() {
    var btn = document.getElementById('bible-hub-audio-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var card = document.getElementById('daily-verse-card');
      var ref = card && card.querySelector('strong');
      var p = card && card.querySelector('p');
      var refText = ref ? ref.textContent.trim() : '';
      var text = (refText ? refText + '. ' : '') + (p ? p.textContent : '');
      if (!text) return;
      playVerseTTS(refText, text, btn);
    });
  }

  function wireNameModal() {
    var modal = document.getElementById('bible-hub-name-modal');
    var input = document.getElementById('bible-hub-name-input');
    var saveBtn = document.getElementById('bible-hub-name-save');
    if (!modal || !input || !saveBtn) return;
    function closeAndUpdate() {
      modal.classList.add('hidden');
      renderGreet();
    }
    saveBtn.addEventListener('click', function () {
      var val = (input.value || '').trim() || 'Friend';
      try {
        localStorage.setItem(BIBLE_USER_NAME_KEY, val);
        closeAndUpdate();
      } catch (e) {}
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); saveBtn.click(); }
    });
  }

  function showNameModalIfNeeded() {
    if (getUserName()) return;
    var modal = document.getElementById('bible-hub-name-modal');
    if (modal) modal.classList.remove('hidden');
  }

  function wirePrayerInput() {
    var input = document.getElementById('bible-hub-prayer-input');
    if (!input) return;
    var saveTimer;
    input.addEventListener('input', function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(savePrayer, 500);
    });
    input.addEventListener('blur', savePrayer);
  }

  function wireReflectionInput() {
    var input = document.getElementById('reflection');
    if (!input) return;
    var saveTimer;
    input.addEventListener('input', function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(saveReflection, 500);
    });
    input.addEventListener('blur', saveReflection);
  }

  function wireReflectionEmailOptIn() {
    var btn = document.getElementById('reflection-email-opt-in-btn');
    var form = document.getElementById('reflection-email-opt-in-form');
    var input = document.getElementById('reflection-email-input');
    var submit = document.getElementById('reflection-email-submit');
    if (!btn || !form || !input || !submit) return;
    btn.addEventListener('click', function () {
      var expanded = form.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      form.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      if (expanded) input.focus();
    });
    submit.addEventListener('click', function () {
      var email = (input.value || '').trim();
      if (!email || email.length < 5) return;
      var cfg = window.TDB_CONFIG || {};
      var supabaseUrl = cfg.SUPABASE_URL;
      var supabaseKey = cfg.SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) return;
      try {
        var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
        if (!supabase || !supabase.createClient) return;
        var client = supabase.createClient(supabaseUrl, supabaseKey);
        client.rpc('upsert_bible_reflection_subscriber', {
          p_anon_id: getOrCreateAnonId(),
          p_email: email
        }).then(function (r) {
          if (r.data && r.data.ok) {
            submit.textContent = 'Subscribed!';
            form.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
            form.setAttribute('aria-hidden', 'true');
          }
        }).catch(function () {});
      } catch (e) {}
    });
  }

  /* Verse of the Week Carousel */
  function getWeekIndex() {
    var d = new Date();
    var start = new Date(d.getFullYear(), 0, 1);
    var diff = d - start;
    var oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.floor(diff / oneWeek);
  }

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

  function removeHighlight(ref) {
    var h = getHighlights();
    delete h[ref];
    try { localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(h)); } catch (e) {}
  }

  var verseOfWeekBible = {};
  var verseOfWeekTextCache = {};
  function loadVerseOfWeekBible() {
    return fetch(KJV_URL).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; })
      .then(function (arr) {
        verseOfWeekBible = {};
        (arr || []).forEach(function (v) {
          if (v && v.ref && v.text) verseOfWeekBible[v.ref] = v.text;
        });
        if (typeof window !== 'undefined' && window.kjvData && typeof window.kjvData === 'object') {
          Object.keys(window.kjvData).forEach(function (ref) {
            if (window.kjvData[ref] && !verseOfWeekBible[ref]) verseOfWeekBible[ref] = window.kjvData[ref];
          });
        }
        return verseOfWeekBible;
      });
  }

  function getVerseText(ref) {
    return verseOfWeekTextCache[ref] || verseOfWeekBible[ref] || (typeof window !== 'undefined' && window.kjvData && window.kjvData[ref]) || '';
  }

  function renderVerseOfWeekCarousel() {
    var themeEl = document.getElementById('verse-of-week-theme');
    var panelsEl = document.getElementById('verse-of-week-panels');
    if (!themeEl || !panelsEl) return;
    var weekIdx = getWeekIndex();
    var theme = VERSE_OF_WEEK_THEMES[weekIdx % VERSE_OF_WEEK_THEMES.length];
    if (!theme) return;
    themeEl.textContent = 'This Week: ' + theme.name;
    verseOfWeekTextCache = {};
    panelsEl.innerHTML = theme.verses.map(function (v) {
      var text = v.text || getVerseText(v.ref);
      verseOfWeekTextCache[v.ref] = text;
      return '<div class="verse-of-week-panel" data-ref="' + escapeHtml(v.ref) + '" role="button" tabindex="0">' +
        theme.icon +
        '<div class="verse-of-week-panel-ref">' + escapeHtml(v.ref) + '</div>' +
        '<p class="verse-of-week-panel-text">' + escapeHtml(text || v.ref) + '</p>' +
        '<button type="button" class="verse-of-week-listen-btn" data-ref="' + escapeHtml(v.ref) + '">Listen</button>' +
        '</div>';
    }).join('');
    wireVerseOfWeekPanels();
  }

  function wireVerseOfWeekPanels() {
    var panels = document.querySelectorAll('.verse-of-week-panel');
    var listenBtns = document.querySelectorAll('.verse-of-week-listen-btn');
    panels.forEach(function (panel) {
      panel.addEventListener('click', function (e) {
        if (e.target && e.target.classList && e.target.classList.contains('verse-of-week-listen-btn')) return;
        openVerseOfWeekStudyCard(panel.dataset.ref);
      });
      panel.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (e.target && e.target.classList && e.target.classList.contains('verse-of-week-listen-btn')) return;
          openVerseOfWeekStudyCard(panel.dataset.ref);
        }
      });
    });
    listenBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var ref = btn.dataset.ref || '';
        var text = ref + '. ' + getVerseText(ref);
        if (!text) return;
        playVerseTTS(ref, text, btn);
      });
    });
  }

  function openVerseOfWeekStudyCard(ref) {
    var modal = document.getElementById('verse-of-week-study-modal');
    var titleEl = document.getElementById('verse-of-week-study-title');
    var textEl = document.getElementById('verse-of-week-study-text');
    var highlightBtn = document.getElementById('verse-of-week-study-highlight');
    if (!modal || !titleEl || !textEl || !highlightBtn) return;
    var fullText = getVerseText(ref);
    titleEl.textContent = ref;
    textEl.textContent = fullText || ref;
    highlightBtn.dataset.ref = ref;
    var h = getHighlights();
    highlightBtn.textContent = (h[ref] && h[ref].highlighted) ? 'Edit note' : 'Highlight';
    modal.classList.remove('hidden');
  }

  function closeVerseOfWeekStudyModal() {
    var modal = document.getElementById('verse-of-week-study-modal');
    if (modal) modal.classList.add('hidden');
  }

  var verseOfWeekNoteRef = null;
  function openVerseOfWeekNoteModal(ref) {
    verseOfWeekNoteRef = ref;
    var modal = document.getElementById('verse-of-week-note-modal');
    var refEl = document.getElementById('verse-of-week-note-ref');
    var input = document.getElementById('verse-of-week-note-input');
    var removeBtn = document.getElementById('verse-of-week-note-remove');
    var h = getHighlights();
    var data = h[ref] || {};
    if (modal) modal.classList.remove('hidden');
    if (refEl) refEl.textContent = ref;
    if (input) { input.value = data.note || ''; input.placeholder = 'This reminded me of…'; }
    if (removeBtn) removeBtn.style.display = (data.highlighted ? 'inline-block' : 'none');
    if (input) setTimeout(function () { input.focus(); }, 100);
  }

  function closeVerseOfWeekNoteModal() {
    verseOfWeekNoteRef = null;
    var modal = document.getElementById('verse-of-week-note-modal');
    if (modal) modal.classList.add('hidden');
  }

  function saveVerseOfWeekNote() {
    if (!verseOfWeekNoteRef) return;
    var input = document.getElementById('verse-of-week-note-input');
    var note = input ? input.value.trim() : '';
    setHighlight(verseOfWeekNoteRef, note);
    closeVerseOfWeekNoteModal();
    var highlightBtn = document.getElementById('verse-of-week-study-highlight');
    if (highlightBtn && highlightBtn.dataset.ref === verseOfWeekNoteRef) highlightBtn.textContent = 'Edit note';
  }

  function removeVerseOfWeekNote() {
    if (!verseOfWeekNoteRef) return;
    removeHighlight(verseOfWeekNoteRef);
    closeVerseOfWeekNoteModal();
    var highlightBtn = document.getElementById('verse-of-week-study-highlight');
    if (highlightBtn && highlightBtn.dataset.ref === verseOfWeekNoteRef) highlightBtn.textContent = 'Highlight';
  }

  function wireVerseOfWeekCarousel() {
    var prevBtn = document.querySelector('.verse-of-week-arrow-prev');
    var nextBtn = document.querySelector('.verse-of-week-arrow-next');
    var track = document.getElementById('verse-of-week-track');
    if (prevBtn && track) {
      prevBtn.addEventListener('click', function () {
        var w = track.offsetWidth;
        track.scrollBy({ left: -w, behavior: 'smooth' });
      });
    }
    if (nextBtn && track) {
      nextBtn.addEventListener('click', function () {
        var w = track.offsetWidth;
        track.scrollBy({ left: w, behavior: 'smooth' });
      });
    }
    var studyClose = document.getElementById('verse-of-week-study-close');
    var studyHighlight = document.getElementById('verse-of-week-study-highlight');
    if (studyClose) studyClose.addEventListener('click', closeVerseOfWeekStudyModal);
    if (studyHighlight) studyHighlight.addEventListener('click', function () {
      var ref = studyHighlight.dataset.ref;
      if (ref) openVerseOfWeekNoteModal(ref);
    });
    var studyModal = document.getElementById('verse-of-week-study-modal');
    if (studyModal) {
      studyModal.addEventListener('click', function (e) { if (e.target === studyModal) closeVerseOfWeekStudyModal(); });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (verseOfWeekNoteRef) closeVerseOfWeekNoteModal();
        else if (studyModal && !studyModal.classList.contains('hidden')) closeVerseOfWeekStudyModal();
        e.preventDefault();
      }
    });
    var noteSave = document.getElementById('verse-of-week-note-save');
    var noteRemove = document.getElementById('verse-of-week-note-remove');
    if (noteSave) noteSave.addEventListener('click', saveVerseOfWeekNote);
    if (noteRemove) noteRemove.addEventListener('click', removeVerseOfWeekNote);
    var noteModal = document.getElementById('verse-of-week-note-modal');
    if (noteModal) noteModal.addEventListener('click', function (e) { if (e.target === noteModal) closeVerseOfWeekNoteModal(); });
  }

  function init() {
    renderStreak();
    renderGreet();
    loadPrayer();
    loadReflection();
    wireReadBtn();
    wireShareBtn();
    wireAudioBtn();
    wireNameModal();
    wirePrayerInput();
    wireReflectionInput();
    wireReflectionEmailOptIn();
    wireChapterFinished();
    wireChapterClose();
    wireChapterModalBackdrop();
    showNameModalIfNeeded();
    loadChapters().then(function () {
      renderReadingPlan();
      var readChapterBtn = document.getElementById('bible-hub-read-chapter-btn');
      if (readChapterBtn) readChapterBtn.addEventListener('click', openChapterModal);
    });
    wireVerseOfWeekCarousel();
    loadVerseOfWeekBible().then(function () {
      renderVerseOfWeekCarousel();
    });
    setTimeout(updateTeaseAndExtras, 500);
    setTimeout(updateTeaseAndExtras, 1500);
    var sd = getStreakData();
    if (sd.lastKey && sd.count) syncStreakToSupabase(Number(sd.count), sd.lastKey);
    window.addEventListener('beforeunload', function () {
      saveReflection();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var card = document.getElementById('daily-verse-card');
    if (card && typeof MutationObserver !== 'undefined') {
      var obs = new MutationObserver(function () { updateTeaseAndExtras(); });
      obs.observe(card, { childList: true, subtree: true });
    }
  });
})();
