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
  var RELATIONS_DICT_URL = 'relations-dict.json';
  var KJV_DICT_URLS = ['/kjv.json', 'kjv.json'];
  var BREAKDOWN_LABEL = 'Verse Breakdown';
  var BREAKDOWN_ARIA = 'Open verse breakdown';
  var RELATIONS_FALLBACK = {
    anxiety: {
      line: "Your boss just texted 'urgent'—same as Paul's friends panicking. Pray first."
    },
    fear: {
      line: "The news cycle feels loud and scary. Same fear, same answer: bring it to God first."
    },
    hope: {
      line: 'Bad day? This verse meets you there. Hold hope and take the next faithful step.'
    }
  };
  var relationsDictCache = null;
  var relationsDictPromise = null;
  var bibleDictPromise = null;

  function byId(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Collapse &amp; chains and decode one layer so UI never shows &amp;amp; (matches script.js / kids-corner pattern). */
  function tdbPlainTextForUi(str) {
    function finishPlain(t) {
      if (typeof window.tdbCleanForPlainDisplay === 'function') {
        return window.tdbCleanForPlainDisplay(t);
      }
      if (typeof window.tdbStripAngleMarkupForPlainText === 'function') {
        return window.tdbStripAngleMarkupForPlainText(t);
      }
      return String(t || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    if (str == null || str === '') return '';
    var s = String(str);
    var prev;
    for (var i = 0; i < 12; i++) {
      prev = s;
      s = s.replace(/&amp;/g, '&');
      if (s === prev) break;
    }
    if (typeof window.tdbSetHtml === 'function') {
      try {
        var div = document.createElement('div');
        window.tdbSetHtml(div, s);
        var decoded = div.textContent;
        if (typeof decoded === 'string') return finishPlain(decoded);
      } catch (e) {}
    }
    /* Prefer native innerHTML on a div (not textarea)—WebKit can expose textarea sinks separately from Element TT patches. */
    try {
      var pol2 = window.trustedTypes && window.trustedTypes.defaultPolicy;
      var nativeSet2 = window.__tdbNativeInnerHTMLSet;
      if (pol2 && typeof pol2.createHTML === 'function' && nativeSet2) {
        var div2 = document.createElement('div');
        nativeSet2.call(div2, pol2.createHTML(s));
        var out2 = div2.textContent;
        if (typeof out2 === 'string') return finishPlain(out2);
      }
    } catch (e2) {}
    return finishPlain(s);
  }

  function escapeHtmlPlain(str) {
    return esc(tdbPlainTextForUi(str));
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

  function plainSpeaker(raw) {
    var s = String(raw || '').trim();
    if (!s) return 'Bible writer';
    if (/jesus/i.test(s)) return 'Jesus';
    if (/paul/i.test(s)) return 'Paul';
    if (/david/i.test(s)) return 'David';
    if (/moses/i.test(s)) return 'Moses';
    if (/john/i.test(s)) return 'John';
    if (/isaiah/i.test(s)) return 'Isaiah';
    if (/jeremiah/i.test(s)) return 'Jeremiah';
    if (/solomon/i.test(s)) return 'Solomon';
    if (/unknown/i.test(s)) return 'Bible writer';
    s = s.split('/')[0].split(',')[0].replace(/\(.*?\)/g, '').trim();
    return s || 'Bible writer';
  }

  function plainAudience(raw) {
    var s = String(raw || '').trim();
    if (!s) return 'People listening back then';
    if (/believers|church/i.test(s)) return 'His friends who needed hope';
    if (/everyone|all humanity|all\b/i.test(s)) return 'People like us';
    if (/rome/i.test(s)) return 'His friends in Rome';
    if (/ephesus/i.test(s)) return 'His friends in Ephesus';
    if (/philippi/i.test(s)) return 'His friends in Philippi';
    if (/galatia/i.test(s)) return 'His friends in Galatia';
    if (/israel|judah|exiles/i.test(s)) return 'His people in a hard season';
    return s.length > 46 ? (s.slice(0, 43) + '...') : s;
  }

  function loadRelationsDict() {
    if (relationsDictCache) return Promise.resolve(relationsDictCache);
    if (relationsDictPromise) return relationsDictPromise;
    relationsDictPromise = fetch(RELATIONS_DICT_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('relations_dict_failed');
        return res.json();
      })
      .then(function (json) {
        var data = (json && typeof json === 'object') ? json : {};
        relationsDictCache = Object.assign({}, RELATIONS_FALLBACK, data);
        return relationsDictCache;
      })
      .catch(function () {
        relationsDictCache = Object.assign({}, RELATIONS_FALLBACK);
        return relationsDictCache;
      });
    return relationsDictPromise;
  }

  function getContextNeedle() {
    var ids = ['main-search', 'q', 'mystudy-search', 'query', 'search'];
    var parts = [];
    ids.forEach(function (id) {
      var el = byId(id);
      if (!el) return;
      var v = (typeof el.value === 'string' ? el.value : (el.textContent || ''));
      if (v) parts.push(String(v));
    });
    try {
      var params = new URLSearchParams(window.location.search || '');
      ['q', 'topic', 'ref'].forEach(function (k) {
        var v = params.get(k);
        if (v) parts.push(v);
      });
    } catch (e) {}
    return parts.join(' ').toLowerCase();
  }

  function inferRelationTopic(ref, text) {
    var low = (String(ref || '') + ' ' + String(text || '') + ' ' + getContextNeedle()).toLowerCase();
    if (/\banxiety|anxious|worry|stressed?|stress|urgent|careful\b/.test(low)) return 'anxiety';
    if (/\bfear|afraid|panic|panicking|news cycle|scared|terror\b/.test(low)) return 'fear';
    if (/\bhope|hopeless|bad day|down|weary|tired\b/.test(low)) return 'hope';
    return 'hope';
  }

  function buildRelationLine(topic, dict) {
    var data = dict && typeof dict === 'object' ? dict : RELATIONS_FALLBACK;
    var key = String(topic || 'hope');
    var item = data[key] || data.hope || RELATIONS_FALLBACK.hope;
    if (typeof item === 'string') return tdbPlainTextForUi(item);
    if (item && item.line) return tdbPlainTextForUi(String(item.line));
    return tdbPlainTextForUi(RELATIONS_FALLBACK.hope.line);
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
      about: plainSpeaker(base.about || ''),
      to: plainAudience(base.to || ''),
      layman: base.layman || '',
      applies: base.applies || '',
      bubbleTitle: '',
      bubbleEmoji: ''
    };
    var raw = tdbPlainTextForUi(String(text || '').replace(/<[^>]+>/g, '').trim());
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
    var raw = tdbPlainTextForUi(String(text || '').replace(/<[^>]+>/g, '').trim());
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

  /**
   * Build modal DOM without innerHTML so CSP Trusted Types + DOMPurify cannot strip controls
   * (raw innerHTML goes through the default policy and may remove interactive nodes).
   */
  function buildVerseModalDom(modal) {
    modal.id = 'tdb-verse-breakdown-modal';
    modal.className = 'verse-modal hidden';
    while (modal.firstChild) modal.removeChild(modal.firstChild);

    var backdrop = document.createElement('div');
    backdrop.className = 'verse-modal-backdrop';
    modal.appendChild(backdrop);

    var inner = document.createElement('div');
    inner.className = 'verse-modal-inner';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'verse-modal-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.appendChild(document.createTextNode('\u00d7'));
    inner.appendChild(closeBtn);

    var agePrompt = document.createElement('div');
    agePrompt.className = 'verse-age-prompt hidden';
    agePrompt.id = 'verse-age-prompt';
    var pickP = document.createElement('p');
    pickP.className = 'section-note util-mb-0_5';
    pickP.appendChild(document.createTextNode('Pick your style:'));
    agePrompt.appendChild(pickP);
    var ageActions = document.createElement('div');
    ageActions.className = 'verse-age-actions';
    ['kid', 'teen', 'adult'].forEach(function (age) {
      var ab = document.createElement('button');
      ab.type = 'button';
      ab.className = 'btn btn-secondary';
      ab.setAttribute('data-age', age);
      ab.appendChild(document.createTextNode(age.charAt(0).toUpperCase() + age.slice(1)));
      ageActions.appendChild(ab);
    });
    agePrompt.appendChild(ageActions);
    inner.appendChild(agePrompt);

    var refH = document.createElement('h3');
    refH.className = 'verse-modal-ref';
    inner.appendChild(refH);

    var textP = document.createElement('p');
    textP.className = 'verse-modal-text';
    inner.appendChild(textP);

    var bubble = document.createElement('div');
    bubble.className = 'verse-modal-bubble';
    bubble.id = 'verse-modal-bubble';
    inner.appendChild(bubble);

    var breakdown = document.createElement('div');
    breakdown.className = 'verse-modal-breakdown';

    function addBkRow(className, strongLabel, dataBk) {
      var row = document.createElement('p');
      row.className = className;
      var st = document.createElement('strong');
      st.appendChild(document.createTextNode(strongLabel));
      row.appendChild(st);
      row.appendChild(document.createTextNode(' '));
      var sp = document.createElement('span');
      sp.setAttribute('data-bk', dataBk);
      row.appendChild(sp);
      breakdown.appendChild(row);
    }

    addBkRow('verse-modal-speaker', 'Who said it?', 'about');
    addBkRow('verse-modal-audience', 'Who to:', 'to');
    addBkRow('verse-modal-today', 'Plain talk:', 'layman');
    addBkRow('verse-modal-today', 'How it fits you:', 'applies');
    addBkRow('verse-modal-relates', 'How it relates today?', 'relates');

    var actions = document.createElement('div');
    actions.className = 'verse-modal-actions';
    [['pray', 'Pray it'], ['note', 'Save'], ['share', 'Share']].forEach(function (pair) {
      var actBtn = document.createElement('button');
      actBtn.type = 'button';
      actBtn.className = 'btn btn-secondary';
      actBtn.setAttribute('data-action', pair[0]);
      actBtn.appendChild(document.createTextNode(pair[1]));
      actions.appendChild(actBtn);
    });
    breakdown.appendChild(actions);
    inner.appendChild(breakdown);
    modal.appendChild(inner);
  }

  function ensureModal() {
    var modal = byId('tdb-verse-breakdown-modal');
    var shellOk = modal &&
      modal.querySelector('.verse-modal-close') &&
      modal.querySelector('.verse-modal-ref') &&
      modal.querySelector('.verse-modal-inner');
    if (shellOk) return modal;
    if (!modal) {
      modal = document.createElement('div');
      document.body.appendChild(modal);
    }
    buildVerseModalDom(modal);
    if (!modal.querySelector('.verse-modal-close') || !modal.querySelector('.verse-modal-ref')) {
      buildVerseModalDom(modal);
    }
    function closeModal() {
      var ref = modal.getAttribute('data-ref') || '';
      if (typeof window.trackEvent === 'function') window.trackEvent('verse_breakdown_close', { ref: ref.slice(0, 32) });
      modal.classList.add('closing');
      setTimeout(function () {
        modal.classList.remove('closing');
        modal.classList.add('hidden');
      }, 120);
    }
    var closeHit = modal.querySelector('.verse-modal-close');
    var backdropHit = modal.querySelector('.verse-modal-backdrop');
    if (closeHit) closeHit.addEventListener('click', closeModal);
    if (backdropHit) backdropHit.addEventListener('click', closeModal);
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
    var refEl = modal.querySelector('.verse-modal-ref');
    var verseTextEl = modal.querySelector('.verse-modal-text');
    var aboutEl = modal.querySelector('[data-bk="about"]');
    var toEl = modal.querySelector('[data-bk="to"]');
    var layEl = modal.querySelector('[data-bk="layman"]');
    var appEl = modal.querySelector('[data-bk="applies"]');
    var relEl = modal.querySelector('[data-bk="relates"]');
    if (!refEl || !verseTextEl || !aboutEl || !toEl || !layEl || !appEl || !relEl) return;
    var ageMode = getAgeMode();
    var prompt = byId('verse-age-prompt');
    if (!ageMode && prompt) prompt.classList.remove('hidden');
    if (!ageMode) ageMode = inferAgeFromContext() || 'adult';
    modal.setAttribute('data-age-mode', ageMode);
    var resolvedText = cleanVerseText(text || '') || getBibleVerseText(ref);
    var breakdown = personalizeBreakdown(getBreakdown(ref, resolvedText), ageMode, ref, resolvedText);
    var bubble = byId('verse-modal-bubble');
    refEl.textContent = tdbPlainTextForUi(ref || 'Verse');
    verseTextEl.textContent = resolvedText || 'Loading verse text...';
    aboutEl.textContent = tdbPlainTextForUi(breakdown.about || '—');
    toEl.textContent = tdbPlainTextForUi(breakdown.to || '—');
    layEl.textContent = tdbPlainTextForUi(breakdown.layman || '—');
    appEl.textContent = tdbPlainTextForUi(breakdown.applies || '—');
    var topic = inferRelationTopic(ref, resolvedText);
    relEl.textContent = buildRelationLine(topic, RELATIONS_FALLBACK);
    modal.setAttribute('data-ref', tdbPlainTextForUi(ref || ''));
    modal.setAttribute('data-text', resolvedText || '');
    if (bubble) {
      bubble.textContent = tdbPlainTextForUi(breakdown.bubbleTitle || 'Plain') + (breakdown.bubbleEmoji ? (' ' + breakdown.bubbleEmoji) : '');
      bubble.className = 'verse-modal-bubble verse-modal-bubble-' + ageMode;
    }
    modal.classList.remove('hidden');
    if (typeof window.trackEvent === 'function') window.trackEvent('verse_breakdown_open', { ref: (ref || '').slice(0, 32) });
    (function setupScrollDepth() {
      var inner = modal.querySelector('.verse-modal-inner');
      if (!inner) return;
      var fired = false;
      function onScroll() {
        if (fired) return;
        var scrolled = inner.scrollTop + inner.clientHeight;
        if (scrolled >= inner.scrollHeight * 0.5) {
          fired = true;
          if (typeof window.trackEvent === 'function') window.trackEvent('verse_breakdown_scrolled_50', { ref: (ref || '').slice(0, 32) });
          inner.removeEventListener('scroll', onScroll);
        }
      }
      inner.addEventListener('scroll', onScroll);
    })();
    if (!resolvedText && ref) {
      loadBibleDict().then(function () {
        if (modal.getAttribute('data-ref') !== String(ref || '')) return;
        var lazyText = getBibleVerseText(ref);
        if (!lazyText) return;
        var lazyBreakdown = personalizeBreakdown(getBreakdown(ref, lazyText), ageMode, ref, lazyText);
        var lazyTextEl = modal.querySelector('.verse-modal-text');
        var lazyLay = modal.querySelector('[data-bk="layman"]');
        var lazyApp = modal.querySelector('[data-bk="applies"]');
        if (lazyTextEl) lazyTextEl.textContent = lazyText;
        if (lazyLay) lazyLay.textContent = tdbPlainTextForUi(lazyBreakdown.layman || '—');
        if (lazyApp) lazyApp.textContent = tdbPlainTextForUi(lazyBreakdown.applies || '—');
        modal.setAttribute('data-text', lazyText);
      });
    }
    loadRelationsDict().then(function (dict) {
      if (modal.getAttribute('data-ref') !== String(ref || '')) return;
      if (resolvedText && modal.getAttribute('data-text') !== String(resolvedText || '')) return;
      var relatesEl = modal.querySelector('[data-bk="relates"]');
      if (relatesEl) relatesEl.textContent = buildRelationLine(topic, dict);
    });
  }

  function addButton(container, ref, text) {
    if (!container || !ref || !text) return;
    if (container.querySelector('.tdb-breakdown-btn')) return;
    var existing = Array.prototype.slice.call(container.querySelectorAll('button, a'));
    for (var i = 0; i < existing.length; i++) {
      var label = String(existing[i].textContent || '').trim().toLowerCase();
      if (label === 'breakdown' || label === 'verse breakdown') return;
    }
    var row = ensureActionRow(container);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary tdb-breakdown-btn';
    btn.textContent = BREAKDOWN_LABEL;
    btn.setAttribute('aria-label', BREAKDOWN_ARIA);
    btn.addEventListener('click', function () { open(ref, text); });
    row.appendChild(btn);
  }

  function ensureActionRow(container) {
    if (!container || typeof container.querySelector !== 'function') return container;
    var existing = container.querySelector('.card-actions, .mystudy-share-actions, .verse-actions, .cta-group, .tdb-verse-actions');
    if (existing) return existing;
    var row = document.createElement('div');
    row.className = 'tdb-verse-actions card-actions';
    var anchor = container.querySelector('p:last-of-type, .verse-text, .kids-verse-text, .concordance-verse-text, .verse-maps-verse-text');
    if (anchor && anchor.parentNode === container && anchor.nextSibling) {
      container.insertBefore(row, anchor.nextSibling);
    } else {
      container.appendChild(row);
    }
    return row;
  }

  function extractRefFromText(text) {
    var s = String(text || '').replace(/\s+/g, ' ').trim();
    if (!s) return '';
    var m = s.match(/\b([1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+){0,3}\s+\d+:\d+(?:-\d+)?)\b/);
    return m ? m[1].replace(/\s+/g, ' ').trim() : '';
  }

  function cleanVerseText(text) {
    return tdbPlainTextForUi(String(text || '').replace(/\s+/g, ' ').trim());
  }

  function getBibleVerseText(ref) {
    var r = String(ref || '').trim();
    if (!r) return '';
    var direct = (window.bible && window.bible[r]) || (window.kjvData && window.kjvData[r]) || '';
    if (direct) return cleanVerseText(direct);
    if (typeof window.getBibleVerseText === 'function') {
      try { return cleanVerseText(window.getBibleVerseText(r) || ''); } catch (e) {}
    }
    return '';
  }

  function loadBibleDict() {
    if (bibleDictPromise) return bibleDictPromise;
    bibleDictPromise = (async function () {
      for (var i = 0; i < KJV_DICT_URLS.length; i++) {
        try {
          var res = await fetch(KJV_DICT_URLS[i], { cache: 'force-cache' });
          if (!res.ok) throw new Error('status_' + res.status);
          var json = await res.json();
          if (json && typeof json === 'object') {
            window.kjvData = json;
            return json;
          }
        } catch (e) {}
      }
      return {};
    })();
    return bibleDictPromise;
  }

  function extractRefAndText(container) {
    if (!container) return { ref: '', text: '' };
    var ref = String(
      container.getAttribute('data-ref') ||
      container.getAttribute('data-verse-ref') ||
      ''
    ).trim();
    if (!ref) {
      var refNode = container.querySelector('.verse-ref, .smart-ref, .kids-verse-ref, .concordance-verse-ref, .verse-maps-verse-ref');
      if (refNode) ref = extractRefFromText(refNode.textContent || '');
    }
    if (!ref) {
      var strong = container.querySelector('strong');
      if (strong) ref = extractRefFromText(strong.textContent || '');
    }
    if (!ref) ref = extractRefFromText(container.textContent || '');

    var text = String(
      container.getAttribute('data-text') ||
      container.getAttribute('data-verse-text') ||
      ''
    ).trim();
    if (!text) {
      var textNode = container.querySelector('.verse-text, .smart-verse, .kids-verse-text, .concordance-verse-text, .verse-maps-verse-text');
      if (textNode) text = cleanVerseText(textNode.textContent || '');
    }
    if (!text) {
      var p = container.querySelector('p');
      if (p) text = cleanVerseText(p.textContent || '');
    }
    if (!text && ref) text = getBibleVerseText(ref);
    return { ref: cleanVerseText(ref), text: cleanVerseText(text) };
  }

  function findActionRow(container) {
    if (!container || typeof container.querySelector !== 'function') return null;
    return container.querySelector('.card-actions, .verse-actions, .mystudy-share-actions, .cta-group');
  }

  function enhanceVerseContainers(root) {
    var host = root && root.querySelectorAll ? root : document;
    var selectors = [
      '.verse-card',
      '.smart-card',
      '.verse-item',
      '.ab-card',
      '.curriculum-verse',
      '.kids-battle-verse',
      '.bible-study-verse-card',
      '.verse-of-week-panel',
      '.verse-maps-verse-item',
      '.concordance-ref-item',
      '#daily-battle-card',
      '#daily-verse-card',
      '#church-daily-verse-card',
      '#concordance-verse-card',
      '#verse-maps-verse-card'
    ];
    var seen = new Set();
    selectors.forEach(function (sel) {
      host.querySelectorAll(sel).forEach(function (el) {
        if (!el || seen.has(el)) return;
        seen.add(el);
        if (el.classList && el.classList.contains('daily-battle-loading')) return;
        var pair = extractRefAndText(el);
        if (!pair.ref || !pair.text) return;
        var row = findActionRow(el) || el;
        addButton(row, pair.ref, pair.text);
      });
    });
  }

  function wireAutoEnhance() {
    if (window.__tdbVerseBreakdownAutoEnhanced) return;
    window.__tdbVerseBreakdownAutoEnhanced = true;
    normalizeExistingBreakdownButtons(document);
    enhanceVerseContainers(document);
    if (!document.body || typeof MutationObserver !== 'function') return;
    var queued = false;
    var observer = new MutationObserver(function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        normalizeExistingBreakdownButtons(document);
        enhanceVerseContainers(document);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function normalizeExistingBreakdownButtons(root) {
    var host = root && root.querySelectorAll ? root : document;
    host.querySelectorAll('button, a').forEach(function (el) {
      var label = String(el.textContent || '').trim().toLowerCase();
      if (label !== 'breakdown' && label !== 'verse breakdown') return;
      el.classList.add('tdb-breakdown-btn');
      if (label !== BREAKDOWN_LABEL.toLowerCase()) el.textContent = BREAKDOWN_LABEL;
      el.setAttribute('aria-label', BREAKDOWN_ARIA);
    });
  }

  window.TDBVerseBreakdown = {
    open: open,
    getBreakdown: getBreakdown,
    addButton: addButton,
    getAgeMode: getAgeMode,
    setAgeMode: setAgeMode
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireAutoEnhance);
  else wireAutoEnhance();
})();
