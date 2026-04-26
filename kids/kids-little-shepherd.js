/**
 * Little Shepherd — mascot copy pools + daily adventure + tap-to-hear fun facts.
 * KJV-only site: voice is warm, not hype. textContent only (no HTML injection).
 */
(function (global) {
  'use strict';

  var WELCOME = [
    'Hi friend! I am Little Shepherd. Want to hear a Bible story today?',
    'Hey there! I have been waiting for you. Ready for a quiet adventure?',
    'Hello! I am Little Shepherd. Let us go find Jesus together!',
    'Good morning! Want to color, play, or hear a story?',
    'Hi! My sheep are all safe… now I am ready to be with you!',
    'Welcome! Jesus loves when we spend time together.',
    'Hey buddy! I brought my staff. What should we do first?',
    'I am so glad you are here! Let us open the Bible and have fun.',
    'Hello, my friend! Which gentle adventure should we take today?',
    'Yay, you are here! I was hoping you would come play with me.',
    'Hi there! I know a lot of stories about Jesus. Want to hear one?',
    'Little Shepherd is here! Let us make today a happy day with God.',
    'Hi! I am Little Shepherd. My sheep are resting — now it is our time to play!',
    'You came! I am so happy to see you today.',
    'Hello, my friend! Let us fill our hearts with God’s Word.',
    'I brought my favorite stories. Which one should we open first?',
    'Welcome to my quiet pasture! Want to explore with me?',
    'Hey there! Jesus is glad you showed up. Let us have a calm, fun time together.',
    'I am Little Shepherd. Want to learn about God together?',
    'You made it! Let us make today special with the Bible.',
    "Hi! I am Little Shepherd. Tap me when you want a fun fact or a cheer."
  ];

  var FUN_FACTS = [
    'Fun fact: my job is to stay close, walk slowly, and help sheep feel safe—kind of like a grown-up on the bleachers, but in a field.',
    'Fun fact: a shepherd’s staff is for guiding and gentle lifting—not for poking at friends. Ours is for “come this way” kind of help.',
    'Fun fact: I hum songs about green grass and still water. It keeps my heart from rushing.',
    'Fun fact: sheep know their shepherd’s voice. I want to know Jesus’ words that way, too—calm, clear, true.',
    'Fun fact: I have grass stains on purpose. It means I walked the path with someone instead of just watching a screen.',
    'Fun fact: I pack snacks, water, and one short prayer before we start—because even small trips need Jesus first.'
  ];

  var CHEER = [
    'Wow! You did a good job. Jesus is happy when we try with Him.',
    'That was wonderful! You are getting stronger in God’s Word—little by little.',
    'Great job, my friend! I am proud of you for sticking with it.',
    'You did it! God loves a brave, honest heart.',
    'Yay! You are a good listener. Want to try another one when you are ready?',
    'I knew you could do it! You are a real Bible friend.',
    'That made my heart happy. You are a gift!',
    'Well done! Let us tell Jesus thank you together.',
    "You are so smart! God is pleased when we come to Him as we are.",
    'Amazing! Keep going—small steps are still real steps with Jesus.'
  ];

  var MATCH_WIN = [
    'You matched the pairs! The Bible is full of true lines that belong together—nice work, friend.',
    'Great matching! You kept your eyes on the words, and that is how we learn Jesus’ voice better.',
    'Big win! Every match is a little reminder: God’s Word fits together in beautiful ways.',
    "Shepherd cheer: you finished the set. Want to go hear one of those stories for real?"
  ];

  var BEDTIME = [
    'Sleepy time? Jesus sees you when you are quiet, when you wiggle, and when you are scared of the dark. You are safe in Him.',
    'Goodnight, little sheep. Breathe in slow, think of one Bible word you liked today, and rest.',
    "The sun went down, but the Good Shepherd does not. He stays near—always.",
    "Close your eyes when you are ready. Jesus loves you, and tomorrow is a new morning with Him."
  ];

  var RETURN_AFTER_GAP = [
    'You are back! I saved a place by the quiet fence. Want one story, one color page, or one short game today?',
    'Hey! The pasture missed your footsteps. Pick one small thing, and we will do it with Jesus.',
    "I wondered when I would see you again. No rush—one tap at a time is enough."
  ];

  /** Picks a stable "today" line so it does not change every refresh. */
  function dayKey() {
    var d = new Date();
    return d.getFullYear() * 1000 + (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 86400000;
  }

  function pickByDay(arr) {
    if (!arr || !arr.length) return '';
    var k = dayKey();
    return arr[Math.floor(Math.abs(Math.sin(k)) * 100000) % arr.length];
  }

  var ADVENTURES = [
    { line: "Today’s pick: a surprise Bible story—tap the big button.", href: '/kids/corner.html?random=1', label: 'Open a story' },
    { line: "Today’s pick: one calm color page you can actually paint.", href: '/coloring.html?story=jesus-children', label: 'Open coloring' },
    { line: "Today’s pick: a tiny loop to watch—good for a reset.", href: '/kids-corner.html', label: 'Open a short loop' },
    { line: "Today’s pick: match a few verse friends together.", href: '/kids/match-buddies.html', label: 'Open match game' },
    { line: "Today’s pick: let Gentle Journey choose your next peaceful story.", href: '/kids/corner.html?journey=1', label: 'Start Gentle Journey' }
  ];

  function fillTodayAdventure() {
    var lineEl = document.getElementById('kids-today-adventure-line');
    var linkEl = document.getElementById('kids-today-adventure-link');
    if (!lineEl || !linkEl) return;
    var a = ADVENTURES[dayKey() % ADVENTURES.length];
    lineEl.textContent = a.line;
    linkEl.textContent = a.label;
    linkEl.setAttribute('href', a.href);
  }

  function setBubbleVoice(el, text) {
    if (!el) return;
    el.textContent = text;
  }

  function canUseSpeechSynthesis() {
    return typeof global.speechSynthesis !== 'undefined' && typeof global.SpeechSynthesisUtterance === 'function';
  }

  function initHearButton(lineEl) {
    var hear = document.getElementById('kids-shepherd-hear');
    if (!hear || !lineEl) return;
    if (!canUseSpeechSynthesis()) {
      hear.setAttribute('hidden', '');
      hear.setAttribute('aria-hidden', 'true');
      return;
    }
    hear.removeAttribute('hidden');
    hear.removeAttribute('aria-hidden');
    hear.addEventListener('click', function () {
      var raw = lineEl.textContent || '';
      var t = raw.replace(/\u00a0/g, ' ').trim();
      if (!t) return;
      try {
        global.speechSynthesis.cancel();
        var u = new global.SpeechSynthesisUtterance(t);
        u.lang = 'en-US';
        u.rate = 0.9;
        u.pitch = 1.02;
        global.speechSynthesis.speak(u);
      } catch (e) {
        /* no-op */
      }
    });
  }

  function lastVisitKey() {
    return 'tdbLSShepherdLastVisit';
  }

  function maybeWelcomeReturnMessage(welcomeLineEl) {
    try {
      var now = Date.now();
      var raw = global.localStorage.getItem(lastVisitKey());
      var prev = raw ? parseInt(raw, 10) : 0;
      if (isFinite(prev) && prev > 0 && now - prev > 3 * 86400000) {
        var pick = pickByDay(RETURN_AFTER_GAP);
        if (pick) {
          setBubbleVoice(welcomeLineEl, pick);
        }
      }
      global.localStorage.setItem(lastVisitKey(), String(now));
    } catch (e) {
      /* no-op */
    }
  }

  var MASCOT_POSES = [
    { src: 'shepherd-mascot-welcome.svg', label: 'Little Shepherd waves hello' },
    { src: 'shepherd-mascot-point.svg', label: 'Little Shepherd points the way' },
    { src: 'shepherd-mascot-sheep.svg', label: 'Little Shepherd with a small sheep' }
  ];

  function setShepherdPose(n) {
    var img = document.getElementById('kids-shepherd-hero');
    if (!img || !MASCOT_POSES.length) return;
    var i = ((n % MASCOT_POSES.length) + MASCOT_POSES.length) % MASCOT_POSES.length;
    var pose = MASCOT_POSES[i];
    if (img.getAttribute('src') !== pose.src) {
      img.setAttribute('src', pose.src);
    }
    img.setAttribute('alt', pose.label);
  }

  function initMascotTap(bubbleLineEl) {
    var btn = document.getElementById('kids-mascot-tap');
    if (!btn || !bubbleLineEl) return;
    setShepherdPose(0);
    var pool = FUN_FACTS.concat(CHEER);
    var n = 0;
    btn.addEventListener('click', function () {
      n += 1;
      var t = pool[(n + dayKey()) % pool.length];
      setBubbleVoice(bubbleLineEl, t);
      setShepherdPose(1 + (n % 2));
    });
  }

  function init() {
    var lineEl = document.getElementById('kids-little-shepherd-line');
    if (!lineEl) return;

    if (document.getElementById('kids-shepherd-hero')) {
      setShepherdPose(0);
    }
    setBubbleVoice(lineEl, pickByDay(WELCOME));
    if (document.getElementById('kids-mascot-tap')) {
      maybeWelcomeReturnMessage(lineEl);
      initMascotTap(lineEl);
    }
    if (document.getElementById('kids-today-adventure-line')) {
      fillTodayAdventure();
    }
    initHearButton(lineEl);
  }

  if (global.document) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  global.tdbLittleShepherd = {
    pickWelcome: function () { return pickByDay(WELCOME); },
    pickMatchWin: function () { return pickByDay(MATCH_WIN); },
    pickBedtime: function () { return pickByDay(BEDTIME); },
    pickCheer: function () { return pickByDay(CHEER); },
    setShepherdPose: setShepherdPose
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
