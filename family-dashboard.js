(function () {
  'use strict';

  var FAMILY_PRAYER_KEY = 'tdb-family-prayer-wall-v1';
  var JOURNAL_KEY = 'tdb_what_god_has_done_v1';
  var KIDS_STREAK_KEY = 'kidsStreak';
  var KIDS_STORIES_KEY = 'kidsLibraryViewedStories';
  var KID_NAME_KEY = 'kidName';

  var BRIDGE_BY_REF = {
    'philippians 4:13': {
      line: 'Jesus gives our house strength for the hard thing in front of us.',
      step: 'Name one hard thing and say the verse before the next task.',
      planHref: 'plans.html?plan=familyworship'
    },
    'proverbs 12:25': {
      line: 'A heavy heart needs a kind word in real time.',
      step: 'Speak one gentle sentence over someone in your home today.',
      planHref: 'plans.html?plan=psalmscomfortfamily'
    },
    'psalm 23:1': {
      line: 'The Lord is enough care for everyone under this roof today.',
      step: 'Say one thing God already provided before the meal ends.',
      planHref: 'plans.html?plan=psalmscomfortfamily'
    },
    'isaiah 41:10': {
      line: 'God is with your family in the hard room, not only after it passes.',
      step: 'Put a hand on a shoulder and say, "God is with you today."',
      planHref: 'plans.html?plan=familyworship'
    }
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function plain(s) {
    return String(s || '')
      .replace(/\(KJV\)/gi, '')
      .replace(/[“”"]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeRef(ref) {
    return plain(ref).toLowerCase();
  }

  function jsonFromStorage(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function readArrayLength(key) {
    var value = jsonFromStorage(key);
    return Array.isArray(value) ? value.length : 0;
  }

  function readJournalCount() {
    var value = jsonFromStorage(JOURNAL_KEY);
    return value && Array.isArray(value.entries) ? value.entries.length : 0;
  }

  function readStreak() {
    var value = jsonFromStorage(KIDS_STREAK_KEY);
    return value && value.count ? Math.ceil(Number(value.count || 0)) : 0;
  }

  function getKidName() {
    try {
      return String(localStorage.getItem(KID_NAME_KEY) || '').trim();
    } catch (e) {
      return '';
    }
  }

  function deriveVerseBridge(ref, verseText) {
    var key = normalizeRef(ref);
    if (BRIDGE_BY_REF[key]) return BRIDGE_BY_REF[key];
    var text = plain(verseText).toLowerCase();
    if (/peace|rest|still|quiet/.test(text)) {
      return {
        line: 'This verse slows the room down and reminds the family where peace comes from.',
        step: 'Pause together for ten seconds, then repeat the calmest word from the verse.',
        planHref: 'plans.html?plan=psalmscomfortfamily'
      };
    }
    if (/fear|afraid|strength|strong|courage/.test(text)) {
      return {
        line: 'This verse helps the family stand steadier than fear.',
        step: 'Say the verse once before the next hard conversation or task.',
        planHref: 'plans.html?plan=familyworship'
      };
    }
    return {
      line: 'The same KJV verse from home can guide the whole household in one small step.',
      step: 'Read it once together, then let each person keep one word from it.',
      planHref: 'plans.html?plan=familyworship'
    };
  }

  function speakVerse(ref, text, line, step) {
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') return;
    var message = [plain(ref), plain(text), line, step].filter(Boolean).join('. ');
    if (!message) return;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    var utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.92;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  function progressValue(key) {
    try {
      return parseInt(localStorage.getItem(key) || '0', 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function pickPlanState() {
    var plans = [
      { key: 'tdb-plan-familyworship-day', max: 7, href: 'plans.html?plan=familyworship', label: 'Family Worship in the Trenches' },
      { key: 'tdb-plan-psalmscomfortfamily-day', max: 7, href: 'plans.html?plan=psalmscomfortfamily', label: 'Psalms of Comfort (Family Edition)' },
      { key: 'tdb-plan-parenting-day', max: 7, href: 'plans.html?plan=parenting', label: 'Parenting in Faith' }
    ];
    for (var i = 0; i < plans.length; i++) {
      var current = progressValue(plans[i].key);
      if (current > 0 && current < plans[i].max) {
        return {
          line: 'Next up: ' + plans[i].label + ' — day ' + (current + 1) + ' of ' + plans[i].max + '.',
          note: 'The site already knows where you left off on this device.',
          href: plans[i].href,
          cta: 'Continue day ' + (current + 1)
        };
      }
    }
    return {
      line: 'Nothing has to be built from scratch today. Start with the gentlest seven-day family path.',
      note: 'Family Worship in the Trenches is the best first doorway if nothing is started yet.',
      href: 'plans.html?plan=familyworship',
      cta: 'Start Family Worship'
    };
  }

  function render() {
    var verseRef = byId('family-daily-verse-ref');
    var verseText = byId('family-daily-verse-text');
    var verseLine = byId('family-dashboard-verse-line');
    var verseStep = byId('family-dashboard-verse-step');
    var verseLink = byId('family-dashboard-verse-link');
    var verseSpeak = byId('family-dashboard-verse-speak');
    var kidsLine = byId('family-dashboard-kids-line');
    var kidsNote = byId('family-dashboard-kids-note');
    var prayerLine = byId('family-dashboard-prayer-line');
    var journalLine = byId('family-dashboard-journal-line');
    var planLine = byId('family-dashboard-plan-line');
    var planNote = byId('family-dashboard-plan-note');
    var planLink = byId('family-dashboard-plan-link');

    var ref = verseRef ? plain(verseRef.textContent) : '';
    var text = verseText ? plain(verseText.textContent) : '';
    var verseBridge = deriveVerseBridge(ref, text);
    if (verseLine) verseLine.textContent = verseBridge.line;
    if (verseStep) verseStep.textContent = verseBridge.step;
    if (verseLink) verseLink.href = '#family-daily-verse-root';
    if (verseSpeak) {
      verseSpeak.disabled = !ref || !text;
      verseSpeak.onclick = function () {
        speakVerse(ref, text, verseBridge.line, verseBridge.step);
      };
    }

    var prayerCount = readArrayLength(FAMILY_PRAYER_KEY);
    var journalCount = readJournalCount();
    if (prayerLine) {
      prayerLine.textContent = prayerCount > 0
        ? 'Household prayer list: ' + prayerCount + ' line' + (prayerCount === 1 ? '' : 's') + ' saved on this device.'
        : 'Household prayer list: none saved yet. One short name or need is enough.';
    }
    if (journalLine) {
      journalLine.textContent = journalCount > 0
        ? 'What God has done: ' + journalCount + ' private note' + (journalCount === 1 ? '' : 's') + ' saved.'
        : 'What God has done: no notes yet. One sentence of faithfulness is enough.';
    }

    var storyCount = readArrayLength(KIDS_STORIES_KEY);
    var streak = readStreak();
    var kidName = getKidName();
    if (kidsLine) {
      kidsLine.textContent = storyCount > 0 || streak > 0
        ? (kidName ? kidName + ' has ' : 'This device has ') + storyCount + ' story touch' + (storyCount === 1 ? '' : 'es') + ' and a ' + streak + '-day Kids Battle trail.'
        : 'No kids progress has started here yet. One story opens the path.';
    }
    if (kidsNote) {
      kidsNote.textContent = storyCount > 0
        ? 'Use the Parent Dashboard to notice faithfulness before numbers and keep the tone gentle.'
        : 'Kids progress stays mercy-first. No leaderboard, no pressure, no cloud required.';
    }

    var planState = pickPlanState();
    if (planLine) planLine.textContent = planState.line;
    if (planNote) planNote.textContent = planState.note;
    if (planLink) {
      planLink.href = planState.href;
      planLink.textContent = planState.cta;
    }
  }

  function start() {
    render();
    setTimeout(render, 450);
    setTimeout(render, 1500);
    window.addEventListener('tdb-bible-ready', render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
