(function () {
  'use strict';

  var STORAGE_KEY = 'tdb_family_mode_enabled_v1';

  var BRIDGE_BY_REF = {
    'philippians 4:13': {
      kidLine: 'Jesus gives us strength for the hard thing in front of us.',
      familyAction: 'At dinner or bedtime, let each person name one hard thing and stand tall while you say the verse once together.',
      prayer: 'Lord Jesus, give our house strength for what feels heavy today. Amen.',
      storyHref: '/kids/corner.html?story=david',
      colorHref: '/coloring.html?story=david',
      prayerHref: '/kids/prayer-activities.html',
      familyHref: '/family.html#family-daily-verse-root'
    },
    'proverbs 12:25': {
      kidLine: 'A heavy heart needs a kind word.',
      familyAction: 'Take one minute and let every person speak one gentle sentence over someone else in the room.',
      prayer: 'Lord, make our words light-giving and kind today. Amen.',
      storyHref: '/kids/corner.html?story=jesus',
      colorHref: '/coloring.html?story=jesus',
      prayerHref: '/kids/prayer-activities.html',
      familyHref: '/family.html#family-prayer-wall'
    },
    'psalm 23:1': {
      kidLine: 'The Lord takes care of us like a perfect Shepherd.',
      familyAction: 'Have everyone say one thing God already provided today, even if it feels small.',
      prayer: 'Shepherd of our home, thank You for caring for us today. Amen.',
      storyHref: '/kids/corner.html?story=jesus',
      colorHref: '/coloring.html?story=jesus',
      prayerHref: '/kids/prayer-activities.html',
      familyHref: '/family.html#family-daily-verse-root'
    },
    'isaiah 41:10': {
      kidLine: 'You do not face this day alone. God is with you.',
      familyAction: 'Put a hand on a shoulder and say, "God is with you today," to each person once.',
      prayer: 'God, hold our family steady and near. Amen.',
      storyHref: '/kids/corner.html?story=daniel',
      colorHref: '/coloring.html?story=daniel',
      prayerHref: '/kids/prayer-activities.html',
      familyHref: '/family.html#family-daily-verse-root'
    },
    'joshua 1:9': {
      kidLine: 'Be brave. God goes with you.',
      familyAction: 'Name one new or scary thing ahead, then say the verse before leaving the room.',
      prayer: 'Lord, make us brave because You are near. Amen.',
      storyHref: '/kids/corner.html?story=joshua',
      colorHref: '/coloring.html?story=creation',
      prayerHref: '/kids/prayer-activities.html',
      familyHref: '/family.html#family-daily-verse-root'
    },
    'john 14:27': {
      kidLine: 'Jesus gives peace that the day cannot steal.',
      familyAction: 'Sit still for ten seconds together, then whisper the calmest word from the verse.',
      prayer: 'Jesus, lay Your peace over this home today. Amen.',
      storyHref: '/kids/corner.html?story=jesusCalmsStorm',
      colorHref: '/coloring.html?story=jesus-storm',
      prayerHref: '/kids/prayer-activities.html',
      familyHref: '/family.html#family-prayer-wall'
    },
    'john 3:16': {
      kidLine: 'God loved the world so much that He gave us Jesus.',
      familyAction: 'Let each person finish this sentence: "God showed love when..." and keep it to one line.',
      prayer: 'Father, thank You for loving us and sending Jesus. Amen.',
      storyHref: '/kids/corner.html?story=jesus',
      colorHref: '/coloring.html?story=jesus',
      prayerHref: '/kids/prayer-activities.html',
      familyHref: '/family.html#family-daily-verse-root'
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

  function readStoredToggle() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function saveToggle(enabled) {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    } catch (e) {}
  }

  function deduceBridge(ref, verseText) {
    var key = normalizeRef(ref);
    if (BRIDGE_BY_REF[key]) return BRIDGE_BY_REF[key];
    var text = plain(verseText).toLowerCase();
    if (/fear|afraid|dismayed|strong|strength|courage/.test(text)) {
      return {
        kidLine: 'God helps scared hearts stand steady.',
        familyAction: 'Say the verse once, then let each person name one brave next step for today.',
        prayer: 'Lord, strengthen us for what is in front of us today. Amen.',
        storyHref: '/kids/corner.html?story=david',
        colorHref: '/coloring.html?story=david',
        prayerHref: '/kids/prayer-activities.html',
        familyHref: '/family.html#family-daily-verse-root'
      };
    }
    if (/peace|rest|quiet|still/.test(text)) {
      return {
        kidLine: 'God gives a quieter heart than the day around us.',
        familyAction: 'Pause for ten seconds, breathe once together, then repeat the calmest line from the verse.',
        prayer: 'Prince of Peace, settle this home in You today. Amen.',
        storyHref: '/kids/corner.html?story=jesusCalmsStorm',
        colorHref: '/coloring.html?story=jesus-storm',
        prayerHref: '/kids/prayer-activities.html',
        familyHref: '/family.html#family-prayer-wall'
      };
    }
    if (/love|loveth|charity|kind|kindness/.test(text)) {
      return {
        kidLine: 'God teaches us to love in ways that can be seen.',
        familyAction: 'Pick one person in your home and say one kind sentence they can carry with them today.',
        prayer: 'God, fill our home with patient and true love. Amen.',
        storyHref: '/kids/corner.html?story=goodSamaritan',
        colorHref: '/coloring.html?story=good-samaritan',
        prayerHref: '/kids/prayer-activities.html',
        familyHref: '/family.html#family-daily-verse-root'
      };
    }
    return {
      kidLine: 'This same KJV verse can live in a child-sized heart too.',
      familyAction: 'Read the verse once together, then let each person say one word they want to remember.',
      prayer: 'Lord, make this verse useful in our real home today. Amen.',
      storyHref: '/kids/corner.html',
      colorHref: '/coloring.html',
      prayerHref: '/kids/prayer-activities.html',
      familyHref: '/family.html#family-daily-verse-root'
    };
  }

  function speakBridge(ref, data) {
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') return;
    var text = [
      plain(ref),
      data.kidLine,
      data.familyAction,
      data.prayer
    ].filter(Boolean).join('. ');
    if (!text) return;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  function buildAgeSteps(ref, verseText, data) {
    var refLabel = plain(ref);
    var verseLine = plain(verseText);
    return {
      littles: data.kidLine + ' Say it once, then draw one part of ' + refLabel + '.',
      middles: data.familyAction + ' End by repeating one short line from the verse together.',
      older: 'Read ' + refLabel + ' slowly, say what it shows about God in one sentence, and answer it with one honest step today.' + (verseLine ? ' Verse line: ' + verseLine : '')
    };
  }

  function renderBridge() {
    var root = byId('tdbFamilyModeBridge');
    var refEl = byId('heroRef');
    var verseEl = byId('heroVerse');
    if (!root || !refEl || !verseEl) return;

    var ref = plain(refEl.textContent);
    var verseText = plain(verseEl.textContent);
    if (!ref || !verseText) return;

    var data = deduceBridge(ref, verseText);
    var kidLine = byId('tdbFamilyModeKidLine');
    var action = byId('tdbFamilyModeAction');
    var prayer = byId('tdbFamilyModePrayer');
    var storyLink = byId('tdbFamilyModeStory');
    var colorLink = byId('tdbFamilyModeColor');
    var prayerLink = byId('tdbFamilyModePrayerLink');
    var familyLink = byId('tdbFamilyModeFamily');
    var refBadge = byId('tdbFamilyModeRef');
    var listenBtn = byId('tdbFamilyModeListen');
    var ageLittles = byId('tdbFamilyModeAgeLittles');
    var ageMiddles = byId('tdbFamilyModeAgeMiddles');
    var ageOlder = byId('tdbFamilyModeAgeOlder');
    var ageSteps = buildAgeSteps(ref, verseText, data);

    if (refBadge) refBadge.textContent = ref + ' (KJV)';
    if (kidLine) kidLine.textContent = data.kidLine;
    if (action) action.textContent = data.familyAction;
    if (prayer) prayer.textContent = data.prayer;
    if (ageLittles) ageLittles.textContent = ageSteps.littles;
    if (ageMiddles) ageMiddles.textContent = ageSteps.middles;
    if (ageOlder) ageOlder.textContent = ageSteps.older;
    if (storyLink) storyLink.href = data.storyHref;
    if (colorLink) colorLink.href = data.colorHref;
    if (prayerLink) prayerLink.href = data.prayerHref;
    if (familyLink) familyLink.href = data.familyHref;
    if (listenBtn) {
      listenBtn.onclick = function () {
        speakBridge(ref, data);
      };
    }
  }

  function syncToggleUi() {
    var toggleBtn = byId('tdbFamilyModeToggle');
    var body = byId('tdbFamilyModeBody');
    var enabled = readStoredToggle();
    if (body) body.hidden = !enabled;
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      toggleBtn.textContent = enabled ? 'Family Mode on' : 'Turn on Family Mode';
    }
  }

  function wire() {
    var toggleBtn = byId('tdbFamilyModeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var next = !readStoredToggle();
        saveToggle(next);
        syncToggleUi();
        if (typeof window.trackEvent === 'function') {
          try {
            window.trackEvent('home_family_mode_toggle', { enabled: next ? 1 : 0 });
          } catch (e) {}
        }
      });
    }
    syncToggleUi();
    renderBridge();
    window.addEventListener('tdb-hero-verse-updated', renderBridge);
    setTimeout(renderBridge, 300);
    setTimeout(renderBridge, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
