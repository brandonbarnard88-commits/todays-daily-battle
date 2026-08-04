(function () {
  'use strict';

  var STORAGE_KEY = 'tdb_print_pack_choice_v1';
  var DEFAULT_PACK_ID = 'anxiety-anchor';
  var PACKS = [
    {
      id: 'anxiety-anchor',
      title: 'Anxiety Anchor Pack',
      subtitle: 'Four steady KJV sheets for noisy days and overfull thoughts.',
      description: 'When your chest feels tight and the day feels loud, print one small set of anchors. These pages are built for breathing room, not pressure.',
      audience: 'general',
      usage: [
        'Read one sheet slowly, not all four at once.',
        'Let one sentence settle before you move on.',
        'Use the writing space for one honest prayer or one next step.'
      ],
      chips: ['KJV only', 'Offline after first visit', 'Ink-friendly'],
      cards: [
        {
          sharedKey: 'painWontQuit7',
          index: 2,
          title: 'One verse, one breath',
          extraSections: [
            { label: 'Quiet step', source: 'action' }
          ]
        },
        {
          sharedKey: 'psalmsComfort7',
          index: 2,
          title: 'Present help in trouble',
          extraSections: [
            { label: 'Quiet step', source: 'action' }
          ]
        },
        {
          sharedKey: 'heavyHope7',
          index: 4,
          title: 'Rest for the heavy moment',
          extraSections: [
            { label: 'Quiet step', source: 'action' }
          ]
        },
        {
          sharedKey: 'heavyHope7',
          index: 6,
          title: 'Peace that guards',
          extraSections: [
            { label: 'Quiet step', source: 'action' }
          ]
        }
      ]
    },
    {
      id: 'bedtime-peace-littles',
      title: 'Bedtime Peace for Littles',
      subtitle: 'Four calm bedtime sheets for little hearts and tired grown-ups.',
      description: 'Print this when bedtime needs less fixing and more quiet. Each sheet gives you one KJV verse, one calm family prompt, and room to draw instead of forcing a long devotion.',
      audience: 'family',
      usage: [
        'Choose one sheet for tonight and save the others for later.',
        'Read the verse once, then ask one gentle question.',
        'Let a drawing, whisper, or short prayer be enough.'
      ],
      chips: ['Family-first', 'KJV only', 'Paper-friendly'],
      cards: [
        {
          sharedKey: 'psalmsComfortFamily7',
          index: 0,
          title: 'The Shepherd stays close',
          extraSections: [
            { label: 'Talk together', source: 'talkTogether' },
            { label: 'Draw together', source: 'drawPrompt' },
            { label: 'Parent whisper', source: 'parentPrompt' }
          ]
        },
        {
          sharedKey: 'psalmsComfortFamily7',
          index: 3,
          title: 'Light for the room',
          extraSections: [
            { label: 'Talk together', source: 'talkTogether' },
            { label: 'Draw together', source: 'drawPrompt' },
            { label: 'Parent whisper', source: 'parentPrompt' }
          ]
        },
        {
          sharedKey: 'psalmsComfortFamily7',
          index: 4,
          title: 'Under His shadow',
          extraSections: [
            { label: 'Talk together', source: 'talkTogether' },
            { label: 'Draw together', source: 'drawPrompt' },
            { label: 'Parent whisper', source: 'parentPrompt' }
          ]
        },
        {
          sharedKey: 'familyWorshipTrenches7',
          index: 0,
          title: 'Jesus in the middle',
          extraSections: [
            { label: 'Talk together', source: 'talkTogether' },
            { label: 'Draw together', source: 'drawPrompt' },
            { label: 'Parent whisper', source: 'parentPrompt' }
          ]
        }
      ]
    },
    {
      id: 'grief-comfort',
      title: 'Grief Comfort Bundle',
      subtitle: 'Four quiet companion sheets for loss, heaviness, and waiting.',
      description: 'This pack does not rush grief or make it tidy. It gives you a few true words to hold when sorrow is heavy and hope feels far away.',
      audience: 'general',
      usage: [
        'Print the whole bundle or only the sheet you need today.',
        'Read the verse out loud if you can bear hearing it.',
        'Use the writing space for names, tears, questions, or silence.'
      ],
      chips: ['Gentle grief care', 'KJV only', 'No pressure'],
      cards: [
        {
          sharedKey: 'psalmsComfort7',
          index: 1,
          title: 'Near the broken heart',
          extraSections: [
            { label: 'Quiet step', source: 'action' }
          ]
        },
        {
          sharedKey: 'painWontQuit7',
          index: 1,
          title: 'New mercies this morning',
          extraSections: [
            { label: 'Quiet step', source: 'action' }
          ]
        },
        {
          sharedKey: 'heavyHope7',
          index: 2,
          title: 'Oil for heaviness',
          extraSections: [
            { label: 'Quiet step', source: 'action' }
          ]
        },
        {
          sharedKey: 'painWontQuit7',
          index: 5,
          title: 'Pain will not have the last word',
          extraSections: [
            { label: 'Quiet step', source: 'action' }
          ]
        }
      ]
    }
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function getPackById(id) {
    for (var i = 0; i < PACKS.length; i++) {
      if (PACKS[i].id === id) return PACKS[i];
    }
    return PACKS[0];
  }

  function getSharedRows() {
    return window.TDB_PLANS_BATTLE_SHARED || {};
  }

  function getRow(sharedKey, index) {
    var rows = getSharedRows()[sharedKey];
    if (!Array.isArray(rows)) return null;
    return rows[index] || null;
  }

  function readSelectedPackId() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      var fromQuery = String(params.get('pack') || '').trim();
      if (fromQuery) return getPackById(fromQuery).id;
    } catch (e) {}
    try {
      var stored = String(localStorage.getItem(STORAGE_KEY) || '').trim();
      if (stored) return getPackById(stored).id;
    } catch (e2) {}
    return DEFAULT_PACK_ID;
  }

  function writeSelectedPackId(packId) {
    try {
      localStorage.setItem(STORAGE_KEY, packId);
    } catch (e) {}
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('pack', packId);
      window.history.replaceState({}, '', url.toString());
    } catch (e2) {}
  }

  function getBreakdown(row, pack, card) {
    var override = {};
    if (row.plain) override.plain = row.plain;
    if (row.today) override.today = row.today;
    if (pack.audience === 'family') {
      override.forGroup = row.familyLive || row.familyTogether || row.parentPrompt || '';
    } else if (card && card.forGroup) {
      override.forGroup = card.forGroup;
    }
    if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') {
      try {
        return window.TDBVerseBreakdown.getBreakdown(row.ref, row.text, {
          group: pack.audience === 'family' ? 'family' : 'general',
          override: override
        });
      } catch (e) {}
    }
    return {
      plainExplanation: override.plain || row.plain || 'A steady truth from Scripture for real life today.',
      groupApplication: override.forGroup || 'For your group: let this verse shape the next faithful step.',
      modernApplication: override.today || row.action || 'Carry this verse into the next honest moment.',
      about: row.speaker || '',
      source: 'fallback'
    };
  }

  function buildCardData(pack, card) {
    var row = getRow(card.sharedKey, card.index);
    if (!row) {
      return {
        missing: true,
        title: card.title || 'Pack sheet unavailable'
      };
    }
    var breakdown = getBreakdown(row, pack, card);
    return {
      title: card.title || row.title,
      verseTitle: row.title || card.title || row.ref,
      ref: row.ref,
      text: row.text,
      speaker: row.speaker || '',
      plainEnglish: breakdown.plainExplanation || row.plain || '',
      forGroup: breakdown.groupApplication || '',
      realLifeToday: breakdown.modernApplication || row.today || '',
      prayer: row.prayer || '',
      writingPrompt: row.drawPrompt || row.action || row.today || 'Write one honest line before you fold this page.',
      extraSections: (card.extraSections || []).map(function (section) {
        return {
          label: section.label,
          text: row[section.source] || ''
        };
      }).filter(function (section) {
        return section.text;
      })
    };
  }

  function addTextSection(parent, label, text, extraClass) {
    if (!text) return;
    var wrap = el('section', 'ppg-copy-card' + (extraClass ? ' ' + extraClass : ''));
    wrap.appendChild(el('h3', 'ppg-copy-card__label', label));
    wrap.appendChild(el('p', 'ppg-copy-card__text', text));
    parent.appendChild(wrap);
  }

  function buildWritingLines(promptText) {
    var wrap = el('section', 'ppg-writing-zone');
    wrap.appendChild(el('h3', 'ppg-copy-card__label', 'Write or sketch'));
    wrap.appendChild(el('p', 'ppg-writing-prompt', promptText));
    var lines = el('div', 'ppg-lines');
    for (var i = 0; i < 6; i++) {
      lines.appendChild(el('span', 'ppg-lines__line', ''));
    }
    wrap.appendChild(lines);
    return wrap;
  }

  function renderCover(root, pack) {
    var article = el('article', 'ppg-sheet ppg-sheet--cover');
    var hero = el('div', 'ppg-sheet__cover-intro');
    hero.appendChild(el('p', 'ppg-sheet__eyebrow', 'Printable Pack Generator'));
    hero.appendChild(el('h2', 'ppg-sheet__title', pack.title));
    hero.appendChild(el('p', 'ppg-sheet__subtitle', pack.subtitle));
    hero.appendChild(el('p', 'ppg-sheet__description', pack.description));
    article.appendChild(hero);

    var chipRow = el('div', 'ppg-chip-row');
    (pack.chips || []).forEach(function (chip) {
      chipRow.appendChild(el('span', 'ppg-chip', chip));
    });
    article.appendChild(chipRow);

    var grid = el('div', 'ppg-cover-grid');
    addTextSection(grid, 'How to use it', (pack.usage || []).join(' '));
    addTextSection(grid, 'Inside this pack', 'Four ink-friendly KJV sheets with calm breakdowns, prayer space, and room to write or draw.');
    addTextSection(grid, 'Quiet reminder', 'These pages are companions, not homework. Use one sheet, fold it, revisit it, or leave blank space blank.');
    article.appendChild(grid);

    root.appendChild(article);
  }

  function renderCard(root, pack, cardData, index) {
    var article = el('article', 'ppg-sheet');
    article.setAttribute('aria-label', pack.title + ', sheet ' + String(index + 1));

    if (cardData.missing) {
      article.appendChild(el('h2', 'ppg-sheet__title', cardData.title));
      article.appendChild(el('p', 'ppg-sheet__description', 'The source content for this sheet did not load—that is all right. Refresh and try again.'));
      root.appendChild(article);
      return;
    }

    article.appendChild(el('p', 'ppg-sheet__eyebrow', 'Sheet ' + String(index + 1)));
    article.appendChild(el('h2', 'ppg-sheet__title', cardData.title));
    if (cardData.speaker) {
      article.appendChild(el('p', 'ppg-sheet__speaker', cardData.speaker));
    }
    article.appendChild(el('p', 'ppg-sheet__ref', cardData.ref + ' (KJV)'));

    var verse = el('div', 'ppg-verse');
    verse.textContent = cardData.text;
    article.appendChild(verse);

    var breakdownGrid = el('div', 'ppg-breakdown-grid');
    addTextSection(breakdownGrid, 'What it means', cardData.plainEnglish);
    addTextSection(breakdownGrid, 'For your group', cardData.forGroup);
    addTextSection(breakdownGrid, 'For today', cardData.realLifeToday);
    article.appendChild(breakdownGrid);

    if (cardData.extraSections.length) {
      var extras = el('div', 'ppg-extra-grid');
      cardData.extraSections.forEach(function (section) {
        addTextSection(extras, section.label, section.text, 'ppg-copy-card--soft');
      });
      article.appendChild(extras);
    }

    addTextSection(article, 'Quiet prayer', cardData.prayer, 'ppg-copy-card--prayer');
    article.appendChild(buildWritingLines(cardData.writingPrompt));
    root.appendChild(article);
  }

  function renderPack(pack) {
    var root = byId('ppg-pack-root');
    if (!root) return;
    root.replaceChildren();
    renderCover(root, pack);
    pack.cards.forEach(function (card, index) {
      renderCard(root, pack, buildCardData(pack, card), index);
    });
    var title = pack.title + ' • Printable Pack Generator • Today\'s Daily Battle';
    document.title = title;
    var heroTitle = byId('ppg-current-pack-title');
    if (heroTitle) heroTitle.textContent = pack.title;
    var heroSubtitle = byId('ppg-current-pack-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = pack.subtitle;
    var live = byId('ppg-status');
    if (live) live.textContent = pack.title + ' loaded.';
  }

  function markChooser(packId) {
    var buttons = document.querySelectorAll('[data-pack-choice]');
    buttons.forEach(function (button) {
      var active = button.getAttribute('data-pack-choice') === packId;
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      button.classList.toggle('is-active', active);
    });
  }

  function setActivePack(packId, shouldTrack) {
    var pack = getPackById(packId);
    writeSelectedPackId(pack.id);
    markChooser(pack.id);
    renderPack(pack);
    if (shouldTrack && typeof window.trackEvent === 'function') {
      window.trackEvent('print_pack_generator_select', { pack_id: pack.id });
    }
  }

  function copyCurrentLink() {
    var status = byId('ppg-status');
    var text = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (status) status.textContent = 'Pack link copied.';
      }).catch(function () {
        if (status) status.textContent = 'Copy did not go through—that is all right. You can copy the URL from the address bar.';
      });
      return;
    }
    if (status) status.textContent = 'Copy is not available in this browser—that is all right. You can copy the URL from the address bar.';
  }

  function wire() {
    var chooser = byId('ppg-chooser');
    if (chooser) {
      PACKS.forEach(function (pack) {
        var button = el('button', 'ppg-choice');
        button.type = 'button';
        button.setAttribute('data-pack-choice', pack.id);
        button.setAttribute('aria-pressed', 'false');
        button.appendChild(el('span', 'ppg-choice__title', pack.title));
        button.appendChild(el('span', 'ppg-choice__text', pack.subtitle));
        button.addEventListener('click', function () {
          setActivePack(pack.id, true);
        });
        chooser.appendChild(button);
      });
    }

    var printBtn = byId('ppg-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('print_pack_generator_print');
        }
        window.print();
      });
    }

    var copyBtn = byId('ppg-copy-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', copyCurrentLink);
    }

    setActivePack(readSelectedPackId(), false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
