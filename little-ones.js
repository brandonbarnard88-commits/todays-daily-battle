(function () {
  'use strict';

  var STORY_OPTIONS = {
    jesus: {
      title: 'Jesus welcomes the little children',
      lead: 'A warm first stop when you want your child to feel safe, seen, and near to Jesus.',
      storyHref: '/kids/corner.html?story=jesus',
      colorHref: '/coloring.html?story=jesus',
      printHref: '/kids-coloring-pack.html?sheet=jesus-children&autoprint=1',
      imageSrc: '/coloring-pages/colored/jesus-and-the-children-coloring-page.jpg',
      imageAlt: 'Jesus welcoming children',
      prompt: 'While you color, ask: What do you see in the picture? How do you think Jesus feels about little children?',
      familyQuestion: 'Where did your child feel welcomed today?'
    },
    creation: {
      title: 'Creation',
      lead: 'A simple, bright beginning for very young children who need one peaceful picture and one clear truth.',
      storyHref: '/kids/corner.html?story=creation',
      colorHref: '/coloring.html?story=creation',
      printHref: '/kids-coloring-pack.html?sheet=creation&autoprint=1',
      imageSrc: '/coloring-pages/colored/noah-s1.jpg',
      imageAlt: 'Simple colorful creation-style preview',
      prompt: 'While you color, ask: What did God make that you love today? What color would you give the sky or the sea?',
      familyQuestion: 'What part of God’s world are we thankful for right now?'
    },
    noah: {
      title: 'Noah and the ark',
      lead: 'A comfort story for hard-weather days: God remembers, keeps, and carries through.',
      storyHref: '/kids/corner.html?story=noah',
      colorHref: '/coloring.html?story=noah',
      printHref: '/kids-coloring-pack.html?sheet=noah&autoprint=1',
      imageSrc: '/coloring-pages/colored/noah-s1.jpg',
      imageAlt: 'Noah and the ark',
      prompt: 'While you color, ask: What do you notice first? What promise do you remember when you see the rainbow?',
      familyQuestion: 'When have we seen God keep us through a hard day?'
    },
    david: {
      title: 'David and Goliath',
      lead: 'A brave little-heart story when your child needs courage in a school day, doctor visit, or new room.',
      storyHref: '/kids/corner.html?story=david',
      colorHref: '/coloring.html?story=david',
      printHref: '/kids-coloring-pack.html?sheet=david&autoprint=1',
      imageSrc: '/coloring-pages/colored/david-and-goliath-coloring-page.jpg',
      imageAlt: 'David and Goliath',
      prompt: 'While you color, ask: What looked big to David? Who helped him stand brave anyway?',
      familyQuestion: 'What feels big today, and how can we ask God for help together?'
    },
    storm: {
      title: 'Jesus calms the storm',
      lead: 'A good bedside story when the room feels loud, the day has been long, or a child needs quiet again.',
      storyHref: '/kids/corner.html?story=jesusCalmsStorm',
      colorHref: '/coloring.html?story=jesus-storm',
      printHref: '/kids-coloring-pack.html?sheet=storm&autoprint=1',
      imageSrc: '/coloring-pages/colored/daniel-in-the-lions-den-coloring-page.jpg',
      imageAlt: 'Storm and boat style preview',
      prompt: 'While you color, ask: What looked scary in the storm? What changed when Jesus spoke peace?',
      familyQuestion: 'What does peace from Jesus sound like in our house tonight?'
    },
    'good-shepherd': {
      title: 'The Good Shepherd',
      lead: 'A soft comfort story when your child needs to remember that Jesus sees, leads, and keeps His own.',
      storyHref: '/kids/corner.html?story=psalm23Shepherd',
      colorHref: '/coloring.html?story=good-shepherd',
      printHref: '/kids-coloring-pack.html?sheet=good-shepherd&autoprint=1',
      imageSrc: '/coloring-pages/colored/jesus-and-the-children-coloring-page.jpg',
      imageAlt: 'Jesus the Good Shepherd',
      prompt: 'While you color, ask: What does a good shepherd do? Where do you need Jesus to stay close today?',
      familyQuestion: 'What helps your child feel safe enough to rest today?'
    }
  };

  var AGE_SECTIONS = ['very-young', 'littles', 'family'];
  var currentStoryKey = 'jesus';
  var currentAgeSection = 'very-young';
  var pageSource = 'direct';

  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    var el = byId(id);
    if (el) el.textContent = value || '';
  }

  function setHref(id, value) {
    var el = byId(id);
    if (el) el.href = value || '#';
  }

  function setImage(id, src, alt) {
    var el = byId(id);
    if (!el) return;
    el.src = src || '';
    el.alt = alt || '';
  }

  function readQueryStory() {
    try {
      var params = new URLSearchParams(window.location.search);
      var story = String(params.get('story') || '').trim();
      return STORY_OPTIONS[story] ? story : 'jesus';
    } catch (e) {
      return 'jesus';
    }
  }

  function readQuerySource() {
    try {
      var params = new URLSearchParams(window.location.search);
      var raw = String(params.get('source') || '').trim().toLowerCase();
      return /^[a-z0-9_-]{1,24}$/.test(raw) ? raw : 'direct';
    } catch (e) {
      return 'direct';
    }
  }

  function track(eventName, params) {
    if (typeof window.trackEvent === 'function') {
      window.trackEvent(eventName, params || {});
    }
  }

  function activateStory(key, options) {
    var story = STORY_OPTIONS[key] || STORY_OPTIONS.jesus;
    currentStoryKey = key in STORY_OPTIONS ? key : 'jesus';
    setText('little-ones-feature-title', story.title);
    setText('little-ones-feature-lead', story.lead);
    setText('little-ones-feature-prompt', story.prompt);
    setText('little-ones-feature-family-question', story.familyQuestion);
    setHref('little-ones-read-story', story.storyHref);
    setHref('little-ones-color-story', story.colorHref);
    setHref('little-ones-print-story', story.printHref);
    setImage('little-ones-feature-image', story.imageSrc, story.imageAlt);

    var buttons = document.querySelectorAll('[data-little-ones-story]');
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute('data-little-ones-story') === key;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.classList.toggle('is-active', isActive);
    });

    if (!(options && options.skipTrack)) {
      track('little_ones_story_pick', {
        source: pageSource,
        starter: currentStoryKey,
        lane: currentAgeSection
      });
    }
  }

  function activateAgeSection(targetId, options) {
    currentAgeSection = AGE_SECTIONS.indexOf(targetId) >= 0 ? targetId : 'very-young';
    AGE_SECTIONS.forEach(function (id) {
      var panel = byId('little-ones-age-' + id);
      var tab = byId('little-ones-tab-' + id);
      var active = id === currentAgeSection;
      if (panel) panel.hidden = !active;
      if (tab) {
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
        tab.classList.toggle('is-active', active);
      }
    });

    if (!(options && options.skipTrack)) {
      track('little_ones_lane_pick', {
        source: pageSource,
        starter: currentStoryKey,
        lane: currentAgeSection
      });
    }
  }

  function speakCurrentVerse() {
    var ref = byId('little-ones-verse-ref');
    var text = byId('little-ones-verse-text');
    if (!ref || !text) return;
    var message = [ref.textContent, text.textContent].filter(Boolean).join('. ');
    if (!message || !('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') return;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    var utterance = new window.SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
    track('little_ones_verse_speak', {
      source: pageSource,
      starter: currentStoryKey,
      lane: currentAgeSection
    });
  }

  function startDailyVerse() {
    window.TDB_DAILY_VERSE_ROOT_ID = 'little-ones-verse-root';
    window.TDB_DAILY_VERSE_TEXT_ID = 'little-ones-verse-text';
    window.TDB_DAILY_VERSE_REF_ID = 'little-ones-verse-ref';
  }

  function wire() {
    startDailyVerse();
    pageSource = readQuerySource();

    var initialStory = readQueryStory();
    activateStory(initialStory, { skipTrack: true });
    activateAgeSection('very-young', { skipTrack: true });
    track('little_ones_open', {
      source: pageSource,
      starter: currentStoryKey,
      lane: currentAgeSection
    });

    document.querySelectorAll('[data-little-ones-story]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var nextStory = btn.getAttribute('data-little-ones-story');
        if (nextStory === currentStoryKey) return;
        activateStory(nextStory);
      });
    });

    document.querySelectorAll('[data-little-ones-age]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var nextAge = btn.getAttribute('data-little-ones-age');
        if (nextAge === currentAgeSection) return;
        activateAgeSection(nextAge);
      });
    });

    [
      { id: 'little-ones-read-story', action: 'read_story' },
      { id: 'little-ones-color-story', action: 'color_story' },
      { id: 'little-ones-print-story', action: 'print_story' }
    ].forEach(function (item) {
      var link = byId(item.id);
      if (!link) return;
      link.addEventListener('click', function () {
        track('little_ones_cta', {
          source: pageSource,
          action: item.action,
          starter: currentStoryKey,
          lane: currentAgeSection
        });
      });
    });

    var speakBtn = byId('little-ones-verse-speak');
    if (speakBtn) {
      speakBtn.addEventListener('click', speakCurrentVerse);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
