(function () {
  'use strict';

  var BOOK_CONTEXT = {
    Genesis: { s: 'Moses', a: 'Israel' }, Exodus: { s: 'Moses', a: 'Israel' }, Leviticus: { s: 'Moses', a: 'Israel' }, Numbers: { s: 'Moses', a: 'Israel' }, Deuteronomy: { s: 'Moses', a: 'Israel' },
    Joshua: { s: 'Joshua', a: 'Israel' }, Judges: { s: 'Unknown', a: 'Israel' }, Ruth: { s: 'Unknown', a: 'Israel' },
    '1 Samuel': { s: 'Samuel', a: 'Israel' }, '2 Samuel': { s: 'Nathan', a: 'Israel' },
    '1 Kings': { s: 'Unknown', a: 'Israel' }, '2 Kings': { s: 'Unknown', a: 'Israel' },
    Ezra: { s: 'Ezra', a: 'Exiles' }, Nehemiah: { s: 'Nehemiah', a: 'Exiles' }, Esther: { s: 'Unknown', a: 'Israel' },
    Job: { s: 'Job/God', a: 'All' }, Psalm: { s: 'David or others praising God', a: 'Everyone hurting or thankful' }, Psalms: { s: 'David or others praising God', a: 'Everyone hurting or thankful' },
    Proverbs: { s: 'Solomon giving wisdom', a: 'Everyone seeking guidance' }, Ecclesiastes: { s: 'Solomon', a: 'All' }, 'Song of Solomon': { s: 'Solomon', a: 'All' },
    Isaiah: { s: 'Isaiah', a: 'Judah' }, Jeremiah: { s: 'Jeremiah', a: 'Judah/exiles' }, Lamentations: { s: 'Jeremiah', a: 'Exiles' }, Ezekiel: { s: 'Ezekiel', a: 'Exiles' }, Daniel: { s: 'Daniel', a: 'Exiles' },
    Hosea: { s: 'Hosea', a: 'Israel' }, Joel: { s: 'Joel', a: 'Judah' }, Amos: { s: 'Amos', a: 'Israel' }, Obadiah: { s: 'Obadiah', a: 'Edom' }, Jonah: { s: 'Jonah', a: 'Nineveh' }, Micah: { s: 'Micah', a: 'Judah' }, Nahum: { s: 'Nahum', a: 'Nineveh' },
    Matthew: { s: 'Jesus', a: 'Believers' }, Mark: { s: 'Jesus', a: 'Believers' }, Luke: { s: 'Jesus', a: 'Believers' }, John: { s: 'Jesus', a: 'Believers' }, Acts: { s: 'Luke', a: 'Church' },
    Romans: { s: 'Paul', a: 'Rome' }, Galatians: { s: 'Paul', a: 'Galatia' }, Ephesians: { s: 'Paul', a: 'Ephesus' }, Philippians: { s: 'Paul', a: 'Philippi' }, Colossians: { s: 'Paul', a: 'Colosse' },
    Revelation: { s: 'John', a: 'Seven churches' }
  };

  var ARCHAIC = {
    careful: 'worried', beseech: 'ask', supplication: 'prayer', thee: 'you', thou: 'you', thy: 'your', ye: 'you',
    hath: 'has', doth: 'does', believeth: 'believes', loveth: 'loves', giveth: 'gives', unto: 'to', saith: 'says',
    begotten: 'only', perish: 'be lost', everlasting: 'eternal', labour: 'labor', laden: 'burdened', dismayed: 'discouraged'
  };
  var AGE_KEY = 'tdb_age_mode_v1';
  var NOTE_FALLBACK_KEY = 'tdb_breakdown_notes_v1';

  function byId(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function parseBook(ref) {
    var m = String(ref || '').trim().match(/^(.+?)\s+\d+:\d+/);
    if (!m) return '';
    return /^Psalms?$/i.test(m[1]) ? 'Psalm' : m[1].trim();
  }

  function rephraseArchaic(text) {
    var s = String(text || '');
    Object.keys(ARCHAIC).forEach(function (k) {
      var re = new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      s = s.replace(re, ARCHAIC[k]);
    });
    return s.replace(/\s+/g, ' ').trim();
  }

  function inferApplies(text) {
    var l = String(text || '').toLowerCase();
    if (/\b(careful|worry|anxious|fear|afraid)\b/.test(l)) return 'Bring your fear to God in prayer and choose trust.';
    if (/\b(hope|hopeth|hoped)\b/.test(l)) return 'Hold hope in God even when today is heavy.';
    if (/\b(peace|rest)\b/.test(l)) return 'Receive God\'s peace and slow your heart before Him.';
    if (/\b(strength|strong|strengthen)\b/.test(l)) return 'Lean on God\'s strength for your next step.';
    return 'Ask: what one step of obedience does this verse invite today?';
  }

  function inferAgeFromContext() {
    try {
      var path = String((window.location && window.location.pathname) || '').toLowerCase();
      if (path.indexOf('/kids') === 0 || path.indexOf('/kids/') === 0) return 'kid';
    } catch (e) {}
    var tierEl = byId('tier');
    if (tierEl && tierEl.value) {
      var t = String(tierEl.value).toLowerCase();
      if (t === 'kid') return 'kid';
      if (t === 'teen') return 'teen';
      if (t === 'adult') return 'adult';
    }
    return '';
  }

  function getAgeMode() {
    var mode = '';
    try { mode = String(localStorage.getItem(AGE_KEY) || '').toLowerCase(); } catch (e) {}
    if (mode === 'kid' || mode === 'teen' || mode === 'adult') return mode;
    mode = inferAgeFromContext();
    return mode || '';
  }

  function setAgeMode(mode) {
    var next = String(mode || '').toLowerCase();
    if (next !== 'kid' && next !== 'teen' && next !== 'adult') next = 'adult';
    try { localStorage.setItem(AGE_KEY, next); } catch (e) {}
    return next;
  }

  function personalizeBreakdown(base, ageMode, ref, text) {
    var next = {
      about: base.about || '',
      to: base.to || '',
      layman: base.layman || '',
      applies: base.applies || '',
      bubbleTitle: '',
      bubbleEmoji: ''
    };
    var raw = String(text || '').replace(/<[^>]+>/g, '').trim();
    if (ageMode === 'kid') {
      next.bubbleTitle = 'Jesus! ';
      next.bubbleEmoji = '😊✨';
      next.layman = 'Jesus! ' + (next.layman || 'God loves you and stays with you.') + ' 😊';
      next.applies = (next.applies || 'Talk to Jesus, trust Him, and take one kind step today.') + ' 🙌';
      return next;
    }
    if (ageMode === 'teen') {
      var edgy = /philippians|ephesians|galatians|romans|corinthians|timothy|titus|philemon/i.test(String(ref || ''))
        ? 'Paul from jail says keep your faith steady under pressure.'
        : 'Real life pressure, real faith response.';
      next.bubbleTitle = 'Street note';
      next.bubbleEmoji = '⚡';
      next.layman = edgy + ' ' + (next.layman || '');
      next.applies = (next.applies || 'Choose one bold move that matches this verse today.');
      if (!next.about && /paul/i.test(raw)) next.about = 'Paul';
      return next;
    }
    next.bubbleTitle = 'Plain';
    next.bubbleEmoji = '';
    return next;
  }

  function getBreakdown(ref, text) {
    var raw = String(text || '').replace(/<[^>]+>/g, '').trim();
    var book = parseBook(ref);
    if (!book) return { layman: 'Verse not found. Try exact format like John 3:16.', about: '', to: '', applies: '' };
    var ctx = BOOK_CONTEXT[book] || { s: 'The biblical author', a: 'Original audience' };
    if (/begat|son of|daughter of|father of|generations?\s+of/i.test(raw) && raw.length < 140) {
      return { layman: 'This tracks family lines in God\'s big story.', about: ctx.s, to: ctx.a, applies: 'Every name matters to God. You matter too.' };
    }
    var layman = rephraseArchaic(raw);
    if (raw.length > 150) layman = layman.length > 120 ? ('Key idea: ' + layman.slice(0, 117) + '...') : ('Key idea: ' + layman);
    if (!layman) layman = 'A timeless truth from Scripture for real life today.';
    return { layman: layman, about: ctx.s, to: ctx.a, applies: inferApplies(raw) };
  }

  function ensureModal() {
    var modal = byId('tdb-verse-breakdown-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'tdb-verse-breakdown-modal';
    modal.className = 'verse-modal hidden';
    modal.innerHTML = '<div class="verse-modal-backdrop"></div><div class="verse-modal-inner">' +
      '<button type="button" class="verse-modal-close" aria-label="Close">&times;</button>' +
      '<div class="verse-age-prompt hidden" id="verse-age-prompt">' +
      '<p class="section-note util-mb-0_5">Pick your style:</p>' +
      '<div class="verse-age-actions">' +
      '<button type="button" class="btn btn-secondary" data-age="kid">Kid</button>' +
      '<button type="button" class="btn btn-secondary" data-age="teen">Teen</button>' +
      '<button type="button" class="btn btn-secondary" data-age="adult">Adult</button>' +
      '</div></div>' +
      '<h3 class="verse-modal-ref"></h3><p class="verse-modal-text"></p>' +
      '<div class="verse-modal-bubble" id="verse-modal-bubble"></div>' +
      '<div class="verse-modal-breakdown">' +
      '<p class="verse-modal-speaker"><strong>Who said it:</strong> <span data-bk="about"></span></p>' +
      '<p class="verse-modal-audience"><strong>Who to:</strong> <span data-bk="to"></span></p>' +
      '<p class="verse-modal-today"><strong>What it means:</strong> <span data-bk="layman"></span></p>' +
      '<p class="verse-modal-today"><strong>How it fits:</strong> <span data-bk="applies"></span></p>' +
      '<div class="verse-modal-actions">' +
      '<button type="button" class="btn btn-secondary" data-action="pray">Pray it</button>' +
      '<button type="button" class="btn btn-secondary" data-action="note">Note</button>' +
      '<button type="button" class="btn btn-secondary" data-action="share">Share</button>' +
      '</div>' +
      '</div></div>';
    document.body.appendChild(modal);
    modal.querySelector('.verse-modal-close').addEventListener('click', function () { modal.classList.add('hidden'); });
    modal.querySelector('.verse-modal-backdrop').addEventListener('click', function () { modal.classList.add('hidden'); });
    modal.querySelectorAll('.verse-age-actions [data-age]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = setAgeMode(btn.getAttribute('data-age') || 'adult');
        modal.setAttribute('data-age-mode', mode);
        var prompt = byId('verse-age-prompt');
        if (prompt) prompt.classList.add('hidden');
      });
    });
    modal.querySelectorAll('.verse-modal-actions [data-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-action');
        var ref = modal.getAttribute('data-ref') || '';
        var text = modal.getAttribute('data-text') || '';
        var layman = modal.querySelector('[data-bk="layman"]') ? modal.querySelector('[data-bk="layman"]').textContent : '';
        var applies = modal.querySelector('[data-bk="applies"]') ? modal.querySelector('[data-bk="applies"]').textContent : '';
        if (action === 'pray') {
          var prayer = 'Lord, help me live ' + (applies || layman || 'this verse') + ' today. Amen.';
          copyText(prayer, btn, 'Prayer copied!');
          return;
        }
        if (action === 'note') {
          var noteText = ref + ': ' + text + '\nMeaning: ' + layman;
          addToBestNoteField(noteText, btn);
          return;
        }
        if (action === 'share') {
          shareVerse(ref, text, btn);
        }
      });
    });
    return modal;
  }

  function copyText(text, btn, successLabel) {
    var okText = successLabel || 'Copied!';
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (btn) {
          var prev = btn.textContent;
          btn.textContent = okText;
          setTimeout(function () { btn.textContent = prev; }, 1200);
        }
      }).catch(function () {});
    }
  }

  function addToBestNoteField(text, btn) {
    var ids = ['note-input', 'mystudy-notes', 'church-reflection-input', 'church-board-note', 'church-prayer-input'];
    for (var i = 0; i < ids.length; i++) {
      var el = byId(ids[i]);
      if (el && typeof el.value === 'string') {
        el.value = (el.value ? el.value + '\n\n' : '') + text;
        try { el.focus(); } catch (e) {}
        if (btn) {
          var prev = btn.textContent;
          btn.textContent = 'Added';
          setTimeout(function () { btn.textContent = prev; }, 1200);
        }
        return;
      }
    }
    try {
      var existing = String(localStorage.getItem(NOTE_FALLBACK_KEY) || '');
      localStorage.setItem(NOTE_FALLBACK_KEY, (existing ? existing + '\n\n' : '') + text);
    } catch (e2) {}
    copyText(text, btn, 'Note copied!');
  }

  function shareVerse(ref, text, btn) {
    var shareText = (ref ? ref + ' — ' : '') + (text || '') + '\n\n' + 'todaysdailybattle.com';
    if (navigator.share) {
      navigator.share({ title: ref || 'Verse', text: shareText, url: window.location.href }).then(function () {
        if (btn) {
          var prev = btn.textContent;
          btn.textContent = 'Shared';
          setTimeout(function () { btn.textContent = prev; }, 1200);
        }
      }).catch(function () {});
      return;
    }
    copyText(shareText, btn, 'Share copied!');
  }

  function open(ref, text) {
    var modal = ensureModal();
    var ageMode = getAgeMode();
    var prompt = byId('verse-age-prompt');
    if (!ageMode && prompt) prompt.classList.remove('hidden');
    if (!ageMode) ageMode = inferAgeFromContext() || 'adult';
    modal.setAttribute('data-age-mode', ageMode);
    var breakdown = personalizeBreakdown(getBreakdown(ref, text), ageMode, ref, text);
    var bubble = byId('verse-modal-bubble');
    modal.querySelector('.verse-modal-ref').textContent = ref || 'Verse';
    modal.querySelector('.verse-modal-text').textContent = text || '';
    modal.querySelector('[data-bk="about"]').textContent = breakdown.about || '—';
    modal.querySelector('[data-bk="to"]').textContent = breakdown.to || '—';
    modal.querySelector('[data-bk="layman"]').textContent = breakdown.layman || '—';
    modal.querySelector('[data-bk="applies"]').textContent = breakdown.applies || '—';
    modal.setAttribute('data-ref', ref || '');
    modal.setAttribute('data-text', text || '');
    if (bubble) {
      bubble.textContent = (breakdown.bubbleTitle || 'Plain') + (breakdown.bubbleEmoji ? (' ' + breakdown.bubbleEmoji) : '');
      bubble.className = 'verse-modal-bubble verse-modal-bubble-' + ageMode;
    }
    modal.classList.remove('hidden');
  }

  function addButton(container, ref, text) {
    if (!container || !ref || !text) return;
    if (container.querySelector('.tdb-breakdown-btn')) return;
    var row = container.querySelector('.card-actions, .mystudy-share-actions, .verse-actions') || container;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary tdb-breakdown-btn';
    btn.textContent = 'Breakdown';
    btn.addEventListener('click', function () { open(ref, text); });
    row.appendChild(btn);
  }

  window.TDBVerseBreakdown = {
    open: open,
    getBreakdown: getBreakdown,
    addButton: addButton,
    getAgeMode: getAgeMode,
    setAgeMode: setAgeMode
  };
})();
