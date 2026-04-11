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
  var KJV_DICT_URLS = ['/kjv.json'];
  var INLINE_SUMMARY = 'Break it down';
  var INLINE_SUMMARY_ARIA = 'Open a plain-language breakdown under this verse';
  var inlinePanelUid = 0;
  var RELATIONS_FALLBACK = {
    anxiety: {
      line: "When the weight feels too heavy to carry alone, this verse reminds you there is a place to set it down."
    },
    fear: {
      line: "The things that keep you up at night are known. This verse meets you in the dark with steady truth."
    },
    hope: {
      line: "Even when today feels thin, this verse holds a quiet promise that lasts longer than the feeling."
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
    if (/\b(careful|worry|anxious|fear|afraid)\b/.test(l)) return 'This verse meets you when fear presses close. You are not asked to carry it alone.';
    if (/\b(hope|hopeth|hoped)\b/.test(l)) return 'Even when the day feels thin, this verse holds something steady.';
    if (/\b(peace|rest)\b/.test(l)) return 'This verse offers a quiet place to set the day down.';
    if (/\b(strength|strong|strengthen)\b/.test(l)) return 'This verse reminds you there is strength beyond your own.';
    return 'Sit with this verse for one slow minute. What does it ask of you today?';
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
    relationsDictPromise = Promise.resolve().then(function () {
      // Keep breakdown copy self-contained so optional companion JSON never creates noisy 404s.
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

  function attachPanelScrollAnalytics(root) {
    var panel = root && root.querySelector ? root.querySelector('.tdb-vb-inline-panel') : null;
    if (!panel) return;
    if (root.__tdbVbScrollCleanup) {
      try {
        root.__tdbVbScrollCleanup();
      } catch (eCl) {}
      root.__tdbVbScrollCleanup = null;
    }
    var fired = false;
    function onScroll() {
      if (fired) return;
      if (panel.scrollTop + panel.clientHeight >= panel.scrollHeight * 0.45) {
        fired = true;
        var ref1 = root.getAttribute('data-ref') || '';
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('verse_breakdown_scrolled_50', { ref: ref1.slice(0, 32) });
        }
        panel.removeEventListener('scroll', onScroll);
        root.__tdbVbScrollCleanup = null;
      }
    }
    panel.addEventListener('scroll', onScroll);
    root.__tdbVbScrollCleanup = function () {
      panel.removeEventListener('scroll', onScroll);
    };
  }

  function setInlineBreakdownOpen(root, open) {
    if (!root || !root.classList) return;
    var wasOpen = root.classList.contains('is-open');
    var toggle = root.querySelector('.tdb-vb-inline-toggle');
    var panel = root.querySelector('.tdb-vb-inline-panel');
    if (open) root.classList.add('is-open');
    else root.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (panel) {
      if (open) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    }
    if (!open && root.__tdbVbScrollCleanup) {
      try {
        root.__tdbVbScrollCleanup();
      } catch (eC2) {}
      root.__tdbVbScrollCleanup = null;
    }
    if (open && !wasOpen) {
      if (typeof window.trackEvent === 'function') {
        var ref0 = root.getAttribute('data-ref') || '';
        window.trackEvent('verse_breakdown_open', { ref: ref0.slice(0, 32) });
      }
      attachPanelScrollAnalytics(root);
    }
  }

  function buildInlineDetailsElement() {
    inlinePanelUid += 1;
    var uid = inlinePanelUid;
    var details = document.createElement('div');
    details.className = 'tdb-verse-breakdown-inline';
    details.setAttribute('data-tdb-breakdown-inline', '1');

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'tdb-vb-inline-toggle btn btn-secondary';
    toggle.id = 'tdb-vb-toggle-' + uid;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'tdb-vb-panel-' + uid);
    toggle.setAttribute('aria-label', INLINE_SUMMARY_ARIA);
    var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'tdb-vb-inline-toggle-icon');
    icon.setAttribute('width', '18');
    icon.setAttribute('height', '18');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.setAttribute('aria-hidden', 'true');
    var p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p1.setAttribute('d', 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20');
    icon.appendChild(p1);
    var p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p2.setAttribute('d', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z');
    icon.appendChild(p2);
    var p3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    p3.setAttribute('x1', '12');
    p3.setAttribute('y1', '6');
    p3.setAttribute('x2', '12');
    p3.setAttribute('y2', '12');
    icon.appendChild(p3);
    var p4 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    p4.setAttribute('x1', '10');
    p4.setAttribute('y1', '14');
    p4.setAttribute('x2', '14');
    p4.setAttribute('y2', '14');
    icon.appendChild(p4);
    var label = document.createElement('span');
    label.className = 'tdb-vb-inline-toggle-label';
    label.appendChild(document.createTextNode(INLINE_SUMMARY));
    toggle.appendChild(icon);
    toggle.appendChild(label);
    details.appendChild(toggle);

    var panel = document.createElement('div');
    panel.className = 'tdb-vb-inline-panel';
    panel.id = 'tdb-vb-panel-' + uid;
    panel.setAttribute('hidden', '');
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', toggle.id);

    var agePrompt = document.createElement('div');
    agePrompt.className = 'verse-age-prompt tdb-vb-age-prompt hidden';
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
    panel.appendChild(agePrompt);

    var refH = document.createElement('h3');
    refH.className = 'tdb-vb-inline-ref';
    panel.appendChild(refH);

    var textP = document.createElement('p');
    textP.className = 'tdb-vb-inline-verse-text section-note';
    textP.setAttribute('aria-live', 'polite');
    panel.appendChild(textP);

    var bubble = document.createElement('div');
    bubble.className = 'tdb-vb-inline-bubble';
    panel.appendChild(bubble);

    var breakdown = document.createElement('div');
    breakdown.className = 'tdb-vb-inline-breakdown';

    function addBkRow(className, strongLabel, dataBk) {
      var row = document.createElement('p');
      row.className = 'tdb-vb-inline-row ' + className;
      var st = document.createElement('strong');
      st.appendChild(document.createTextNode(strongLabel));
      row.appendChild(st);
      row.appendChild(document.createTextNode(' '));
      var sp = document.createElement('span');
      sp.setAttribute('data-bk', dataBk);
      row.appendChild(sp);
      breakdown.appendChild(row);
    }

    addBkRow('tdb-vb-inline-speaker', 'Who said it?', 'about');
    addBkRow('tdb-vb-inline-audience', 'Who to:', 'to');
    addBkRow('tdb-vb-inline-plain', 'Plain talk:', 'layman');
    addBkRow('tdb-vb-inline-fit', 'How it fits you:', 'applies');
    addBkRow('tdb-vb-inline-relates', 'How it relates today?', 'relates');

    var actions = document.createElement('div');
    actions.className = 'tdb-vb-inline-actions';
    [['pray', 'Pray it'], ['note', 'Save'], ['share', 'Share']].forEach(function (pair) {
      var actBtn = document.createElement('button');
      actBtn.type = 'button';
      actBtn.className = 'btn btn-secondary';
      actBtn.setAttribute('data-action', pair[0]);
      actBtn.appendChild(document.createTextNode(pair[1]));
      actions.appendChild(actBtn);
    });
    breakdown.appendChild(actions);
    panel.appendChild(breakdown);

    var hideBtn = document.createElement('button');
    hideBtn.type = 'button';
    hideBtn.className = 'tdb-vb-inline-hide link-button util-mt-0_75';
    hideBtn.setAttribute('aria-label', 'Collapse verse breakdown');
    hideBtn.appendChild(document.createTextNode('Hide breakdown'));
    panel.appendChild(hideBtn);

    details.appendChild(panel);
    return details;
  }

  function wireInlineDetailsEvents(details) {
    if (!details || details.getAttribute('data-tdb-vb-wired') === '1') return;
    details.setAttribute('data-tdb-vb-wired', '1');

    var toggleBtn = details.querySelector('.tdb-vb-inline-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var next = !details.classList.contains('is-open');
        setInlineBreakdownOpen(details, next);
      });
    }

    details.querySelectorAll('.tdb-vb-age-prompt .verse-age-actions [data-age]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = setAgeMode(btn.getAttribute('data-age') || 'adult');
        details.setAttribute('data-age-mode', mode);
        var prompt = details.querySelector('.tdb-vb-age-prompt');
        if (prompt) prompt.classList.add('hidden');
        var r = details.getAttribute('data-ref') || '';
        var t = details.getAttribute('data-text') || '';
        populateInlineDetails(details, r, t);
      });
    });

    details.querySelectorAll('.tdb-vb-inline-actions [data-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-action');
        var ref = details.getAttribute('data-ref') || '';
        var text = details.getAttribute('data-text') || '';
        var layman = details.querySelector('[data-bk="layman"]') ? details.querySelector('[data-bk="layman"]').textContent : '';
        var applies = details.querySelector('[data-bk="applies"]') ? details.querySelector('[data-bk="applies"]').textContent : '';
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

    var hideBtn = details.querySelector('.tdb-vb-inline-hide');
    if (hideBtn) {
      hideBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        setInlineBreakdownOpen(details, false);
        try {
          var tg = details.querySelector('.tdb-vb-inline-toggle');
          if (tg && typeof tg.focus === 'function') tg.focus();
        } catch (eH) {}
      });
    }
  }

  function runInlineLazyLoads(details, ref, resolvedText, ageMode, topic) {
    var refKey = tdbPlainTextForUi(ref || '');
    if (!resolvedText && ref) {
      loadBibleDict().then(function () {
        if (details.getAttribute('data-ref') !== refKey) return;
        var lazyText = getBibleVerseText(ref);
        if (!lazyText) return;
        var lazyBreakdown = personalizeBreakdown(getBreakdown(ref, lazyText), ageMode, ref, lazyText);
        var lazyTextEl = details.querySelector('.tdb-vb-inline-verse-text');
        var lazyLay = details.querySelector('[data-bk="layman"]');
        var lazyApp = details.querySelector('[data-bk="applies"]');
        if (lazyTextEl) lazyTextEl.textContent = lazyText;
        if (lazyLay) lazyLay.textContent = tdbPlainTextForUi(lazyBreakdown.layman || '—');
        if (lazyApp) lazyApp.textContent = tdbPlainTextForUi(lazyBreakdown.applies || '—');
        details.setAttribute('data-text', lazyText);
      });
    }
    loadRelationsDict().then(function (dict) {
      if (details.getAttribute('data-ref') !== refKey) return;
      var relatesEl = details.querySelector('[data-bk="relates"]');
      if (relatesEl) relatesEl.textContent = buildRelationLine(topic, dict);
    });
  }

  function populateInlineDetails(details, ref, text) {
    if (!details) return;
    var refEl = details.querySelector('.tdb-vb-inline-ref');
    var verseTextEl = details.querySelector('.tdb-vb-inline-verse-text');
    var aboutEl = details.querySelector('[data-bk="about"]');
    var toEl = details.querySelector('[data-bk="to"]');
    var layEl = details.querySelector('[data-bk="layman"]');
    var appEl = details.querySelector('[data-bk="applies"]');
    var relEl = details.querySelector('[data-bk="relates"]');
    if (!refEl || !verseTextEl || !aboutEl || !toEl || !layEl || !appEl || !relEl) return;

    var ageMode = getAgeMode();
    var prompt = details.querySelector('.tdb-vb-age-prompt');
    if (!ageMode && prompt) prompt.classList.remove('hidden');
    if (!ageMode) ageMode = inferAgeFromContext() || 'adult';
    details.setAttribute('data-age-mode', ageMode);

    var resolvedText = cleanVerseText(text || '') || getBibleVerseText(ref);
    var breakdown = personalizeBreakdown(getBreakdown(ref, resolvedText), ageMode, ref, resolvedText);
    var topic = inferRelationTopic(ref, resolvedText);

    refEl.textContent = tdbPlainTextForUi(ref || 'Verse');
    verseTextEl.textContent = resolvedText || 'Loading verse text...';
    aboutEl.textContent = tdbPlainTextForUi(breakdown.about || '—');
    toEl.textContent = tdbPlainTextForUi(breakdown.to || '—');
    layEl.textContent = tdbPlainTextForUi(breakdown.layman || '—');
    appEl.textContent = tdbPlainTextForUi(breakdown.applies || '—');
    relEl.textContent = buildRelationLine(topic, RELATIONS_FALLBACK);

    details.setAttribute('data-ref', tdbPlainTextForUi(ref || ''));
    details.setAttribute('data-text', resolvedText || '');

    var bubble = details.querySelector('.tdb-vb-inline-bubble');
    if (bubble) {
      bubble.textContent = tdbPlainTextForUi(breakdown.bubbleTitle || 'Plain') + (breakdown.bubbleEmoji ? (' ' + breakdown.bubbleEmoji) : '');
      bubble.className = 'tdb-vb-inline-bubble tdb-vb-inline-bubble-' + ageMode;
    }

    runInlineLazyLoads(details, ref, resolvedText, ageMode, topic);
  }

  function removeLegacyVerseModal() {
    var modal = byId('tdb-verse-breakdown-modal');
    if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
  }

  function findExistingInline(host) {
    if (!host) return null;
    if (host.id === 'lookup-result') {
      return host.querySelector('.tdb-verse-breakdown-inline');
    }
    if (host.classList && host.classList.contains('context-line')) {
      return host.querySelector(':scope > .tdb-verse-breakdown-inline');
    }
    return host.querySelector('.tdb-verse-breakdown-inline');
  }

  function getInsertionPoint(host) {
    if (!host) return null;

    if (host.classList && host.classList.contains('context-line')) {
      var firstTool = host.querySelector('.reader-verse-xref-btn, .reader-verse-wordstudy-btn');
      return { parent: host, before: firstTool || null };
    }

    if (host.querySelector('#daily-ref') && host.querySelector('#daily-text')) {
      var dtp = host.querySelector('#daily-text');
      if (dtp && dtp.parentNode === host) {
        return { parent: host, before: dtp.nextSibling };
      }
    }

    if (host.id === 'church-daily-verse-card') {
      var ctv = host.querySelector('#church-daily-verse-text');
      if (ctv && ctv.parentNode === host) {
        return { parent: host, before: ctv.nextSibling };
      }
    }

    if (host.querySelector('#church-daily-ref') && host.querySelector('#church-daily-text')) {
      var ctp = host.querySelector('#church-daily-text');
      if (ctp && ctp.parentNode === host) {
        return { parent: host, before: ctp.nextSibling };
      }
    }

    if (host.id === 'tdb-cartoon-verse-host') {
      var kov = host.querySelector('#tdb-kjv-overlay');
      if (kov && kov.parentNode === host) {
        return { parent: host, before: kov.nextSibling };
      }
    }

    if (host.id === 'lookup-result') {
      var lt = host.querySelector('#lookup-text');
      if (lt && lt.parentNode) {
        return { parent: lt.parentNode, before: lt.nextSibling };
      }
    }

    if (host.id === 'daily-verse-card') {
      var bq = host.querySelector('blockquote.daily-verse-body');
      if (bq && bq.parentNode === host) {
        return { parent: host, before: bq.nextSibling };
      }
      var dt = host.querySelector('#daily-verse-text');
      if (dt && dt.parentNode) {
        return { parent: dt.parentNode, before: dt.nextSibling };
      }
    }

    if (host.id === 'verseCard') {
      var row = host.querySelector('.verse-ref-row');
      if (row && row.parentNode === host) {
        return { parent: host, before: row.nextSibling };
      }
    }

    if (host.id === 'verse-container' || host.id === 'desktop-verse') {
      var bqCalm = host.querySelector('blockquote.daily-verse-body');
      if (bqCalm && bqCalm.parentNode === host) {
        return { parent: host, before: bqCalm.nextSibling };
      }
      var vt = host.querySelector('#verse-text, #desktop-verse-text');
      if (vt && vt.parentNode) {
        return { parent: vt.parentNode, before: vt.nextSibling };
      }
    }

    if (host.classList && host.classList.contains('mystudy-verse-card')) {
      var mt = host.querySelector('#mystudy-verse-text');
      if (mt && mt.parentNode === host) {
        return { parent: host, before: mt.nextSibling };
      }
    }

    if (host.id === 'mystudy-highlight-detail') {
      var ht = host.querySelector('#mystudy-highlight-text');
      if (ht && ht.parentNode === host) {
        return { parent: host, before: ht.nextSibling };
      }
    }

    if (host.classList && host.classList.contains('mystudy-result')) {
      var preview = host.querySelector('p.section-note');
      if (preview && preview.parentNode === host) {
        return { parent: host, before: preview.nextSibling };
      }
    }

    if (host.classList && /\bverse-item\b/.test(host.className)) {
      var vip = host.querySelector(':scope > strong + p') || host.querySelector(':scope > p');
      if (vip && vip.parentNode === host) {
        return { parent: host, before: vip.nextSibling };
      }
    }

    var verseP = host.querySelector('.verse-card > p');
    if (verseP && verseP.parentNode) {
      return { parent: verseP.parentNode, before: verseP.nextSibling };
    }

    var fallback = host.querySelector('.verse-text, .smart-verse, .concordance-verse-text, .verse-maps-verse-text, blockquote');
    if (fallback && fallback.parentNode) {
      return { parent: fallback.parentNode, before: fallback.nextSibling };
    }

    return { parent: host, before: null };
  }

  function injectInlineBreakdown(host, ref, text) {
    if (!host || !ref || !text) return;
    if (shouldSkipVerseBreakdownHost(host)) return;
    var existing = findExistingInline(host);
    if (existing) {
      wireInlineDetailsEvents(existing);
      populateInlineDetails(existing, ref, text);
      return;
    }

    var pt = getInsertionPoint(host);
    if (!pt || !pt.parent) return;

    var details = buildInlineDetailsElement();
    wireInlineDetailsEvents(details);
    populateInlineDetails(details, ref, text);

    if (pt.before) {
      pt.parent.insertBefore(details, pt.before);
    } else {
      pt.parent.appendChild(details);
    }
  }

  function open(ref, text) {
    var normalizedRef = tdbPlainTextForUi(ref || '');
    var list = document.querySelectorAll('.tdb-verse-breakdown-inline[data-ref]');
    for (var i = 0; i < list.length; i++) {
      if (list[i].getAttribute('data-ref') === normalizedRef) {
        setInlineBreakdownOpen(list[i], true);
        try {
          list[i].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (e) {}
        if (text) populateInlineDetails(list[i], ref, text);
        return;
      }
    }
  }

  function shouldSkipVerseBreakdownHost(el) {
    if (!el || typeof el.closest !== 'function') return true;
    try {
      var path = String((window.location && window.location.pathname) || '').toLowerCase();
      if (path.indexOf('coloring.html') !== -1) return true;
    } catch (e0) {}
    if (el.closest('#tdb-cat-root')) return true;
    if (el.closest('[data-tdb-no-verse-breakdown="1"]')) return true;
    if (el.classList && el.classList.contains('tdb-verse-breakdown-inline')) return true;
    if (el.closest('.tdb-verse-breakdown-inline')) return true;
    return false;
  }

  function addButton(container, ref, text) {
    if (!container || !ref || !text) return;
    var host = container;
    if (typeof container.closest === 'function') {
      var c = container.closest('#daily-verse-card, #verseCard, #lookup-result, #verse-container, #desktop-verse, .mystudy-verse-card, #mystudy-highlight-detail, .mystudy-result, .verse-card, .context-line, .smart-card, .verse-item');
      if (c) host = c;
    }
    injectInlineBreakdown(host, ref, text);
  }

  function snippetFromContextLine(line) {
    if (!line || !line.cloneNode) return '';
    try {
      var clone = line.cloneNode(true);
      var kill = clone.querySelectorAll('.reader-verse-xref-btn, .reader-verse-wordstudy-btn, .tdb-breakdown-btn, .tdb-verse-breakdown-inline');
      for (var i = 0; i < kill.length; i++) {
        var n = kill[i];
        if (n.parentNode) n.parentNode.removeChild(n);
      }
      var st = clone.querySelector('strong');
      if (st && st.parentNode) st.parentNode.removeChild(st);
      return cleanVerseText(clone.textContent || '');
    } catch (e) {
      return '';
    }
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

    var dref = container.querySelector && container.querySelector('#daily-ref');
    var dtxt = container.querySelector && container.querySelector('#daily-text');
    if (dref && dtxt) {
      var rD = extractRefFromText(String(dref.textContent || '')) || cleanVerseText(dref.textContent || '');
      var tD = cleanVerseText(dtxt.textContent || '');
      if (!tD && rD) tD = getBibleVerseText(rD);
      if (rD && tD) return { ref: rD, text: tD };
    }

    if (container.id === 'church-daily-verse-card') {
      var cvr = container.querySelector('#church-daily-verse-ref');
      var cvt = container.querySelector('#church-daily-verse-text');
      if (cvr && cvt) {
        var rV = extractRefFromText(String(cvr.textContent || '')) || cleanVerseText(cvr.textContent || '');
        var tV = cleanVerseText(cvt.textContent || '');
        if (!tV && rV) tV = getBibleVerseText(rV);
        if (rV && tV) return { ref: rV, text: tV };
      }
    }

    var cref = container.querySelector && container.querySelector('#church-daily-ref');
    var ctxt = container.querySelector && container.querySelector('#church-daily-text');
    if (cref && ctxt) {
      var rC = extractRefFromText(String(cref.textContent || '')) || cleanVerseText(cref.textContent || '');
      var tC = cleanVerseText(ctxt.textContent || '');
      if (/loading/i.test(rC) || /loading/i.test(tC)) return { ref: '', text: '' };
      if (!tC && rC) tC = getBibleVerseText(rC);
      if (rC && tC) return { ref: rC, text: tC };
    }

    if (container.id === 'tdb-cartoon-verse-host') {
      var rCart = cleanVerseText(container.getAttribute('data-ref') || '');
      var tCart = cleanVerseText(container.getAttribute('data-text') || '');
      var rCartOk = extractRefFromText(rCart) || rCart;
      if (!tCart && rCartOk) tCart = getBibleVerseText(rCartOk);
      if (rCartOk && tCart) return { ref: rCartOk, text: tCart };
    }

    if (container.classList && container.classList.contains('context-line')) {
      var attrRef = String(container.getAttribute('data-ref') || '').trim();
      var refLine = cleanVerseText(attrRef);
      var refOk = extractRefFromText(refLine) || refLine;
      if (!refOk) {
        var st0 = container.querySelector('strong');
        var rawStrong = st0 ? String(st0.textContent || '').trim() : '';
        refOk = extractRefFromText(rawStrong) || cleanVerseText(rawStrong);
      }
      var textLine = snippetFromContextLine(container);
      if (!textLine && refOk) textLine = getBibleVerseText(refOk);
      if (refOk && textLine) return { ref: refOk, text: textLine };
    }

    if (container.id === 'lookup-result') {
      var lr = byId('lookup-ref');
      var lt = byId('lookup-text');
      var rL = lr ? cleanVerseText(lr.textContent || '') : '';
      var tL = lt ? cleanVerseText(lt.textContent || '') : '';
      var rOk = extractRefFromText(rL) || rL;
      if (!tL && rOk) tL = getBibleVerseText(rOk);
      if (rOk && tL) return { ref: rOk, text: tL };
    }

    if (container.classList && container.classList.contains('mystudy-verse-card')) {
      var mr = container.querySelector('#mystudy-verse-ref');
      var mt = container.querySelector('#mystudy-verse-text');
      var mRefRaw = mr ? String(mr.textContent || '').replace(/\s+/g, ' ').trim() : '';
      if (/nothing here yet/i.test(mRefRaw)) return { ref: '', text: '' };
      var mTextRaw = mt ? String(mt.textContent || '').replace(/\s+/g, ' ').trim() : '';
      var mRefOk = extractRefFromText(mRefRaw) || cleanVerseText(mRefRaw);
      var mTextOk = cleanVerseText(mTextRaw);
      if (!mTextOk && mRefOk) mTextOk = getBibleVerseText(mRefOk);
      if (mRefOk && mTextOk) return { ref: mRefOk, text: mTextOk };
    }

    if (container.id === 'mystudy-highlight-detail') {
      var hr = byId('mystudy-highlight-ref');
      var ht = byId('mystudy-highlight-text');
      var hRefRaw = hr ? String(hr.textContent || '').replace(/\s+/g, ' ').trim() : '';
      if (!hRefRaw) return { ref: '', text: '' };
      var hTextRaw = ht ? String(ht.textContent || '').replace(/\s+/g, ' ').trim() : '';
      var hRefOk = extractRefFromText(hRefRaw) || cleanVerseText(hRefRaw);
      var hTextOk = cleanVerseText(hTextRaw);
      if (!hTextOk && hRefOk) hTextOk = getBibleVerseText(hRefOk);
      if (hRefOk && hTextOk) return { ref: hRefOk, text: hTextOk };
    }

    if (typeof window.tdbGetDailyVerseRefFromCard === 'function' && typeof window.tdbGetDailyVerseTextFromCard === 'function') {
      var tRef = window.tdbGetDailyVerseRefFromCard(container);
      var tText = window.tdbGetDailyVerseTextFromCard(container);
      var refC = cleanVerseText(tRef);
      var textC = cleanVerseText(tText);
      var refCard = extractRefFromText(refC) || refC;
      if (!textC && refCard) textC = getBibleVerseText(refCard);
      if (refCard && textC) return { ref: refCard, text: textC };
    }

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
      var dr = container.querySelector('#daily-verse-ref');
      if (dr) ref = extractRefFromText(dr.textContent || '');
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
      var textNode = container.querySelector('.verse-text, .smart-verse, .kids-verse-text, .concordance-verse-text, .verse-maps-verse-text, #verse-text, #desktop-verse-text');
      if (textNode) text = cleanVerseText(textNode.textContent || '');
    }
    if (!text) {
      var dt = container.querySelector('#daily-verse-text');
      if (dt) text = cleanVerseText(dt.textContent || '');
    }
    if (!text) {
      var hv = container.querySelector('#heroVerse');
      if (hv) {
        text = String(hv.textContent || '').replace(/^[\s"\u201c]+|[\s"\u201d]+$/g, '').replace(/\s+/g, ' ').trim();
        text = cleanVerseText(text);
      }
    }
    if (!text) {
      var p = container.querySelector('p');
      if (p) text = cleanVerseText(p.textContent || '');
    }
    if (!text && ref) text = getBibleVerseText(ref);
    return { ref: cleanVerseText(ref), text: cleanVerseText(text) };
  }

  function enhanceVerseContainers(root) {
    var host = root && root.querySelectorAll ? root : document;
    /* IDs before .verse-card so #daily-verse-card is not consumed first as a generic .verse-card */
    var selectors = [
      '#daily-verse-card',
      '#daily-battle-card',
      '#church-daily-verse-card',
      '#tdb-cartoon-verse-host',
      'article.church-board-card',
      '#concordance-verse-card',
      '#verse-maps-verse-card',
      '#verseCard',
      '#verse-container',
      '#desktop-verse',
      '#lookup-result',
      '#mystudy-highlight-detail',
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
      '.context-line',
      '.mystudy-result'
    ];
    var seen = new Set();
    selectors.forEach(function (sel) {
      host.querySelectorAll(sel).forEach(function (el) {
        if (!el || seen.has(el)) return;
        seen.add(el);
        if (shouldSkipVerseBreakdownHost(el)) return;
        if (el.classList && el.classList.contains('daily-battle-loading')) return;
        /* Homepage #verseCard: rich panels (#heroBreakdownPanels) already explain the calendar verse; skip second “Break it down” UI. */
        if (el.id === 'verseCard') {
          try {
            var pHome = String((window.location && window.location.pathname) || '');
            if (pHome === '/' || /\/index\.html?$/i.test(pHome)) return;
          } catch (eHome) {}
        }
        var pair = extractRefAndText(el);
        if (!pair.ref || !pair.text) return;
        injectInlineBreakdown(el, pair.ref, pair.text);
      });
    });
  }

  function wireAutoEnhance() {
    if (window.__tdbVerseBreakdownAutoEnhanced) return;
    window.__tdbVerseBreakdownAutoEnhanced = true;
    removeLegacyVerseBreakdownUi(document);
    enhanceVerseContainers(document);
    window.addEventListener('load', function () {
      removeLegacyVerseBreakdownUi(document);
      enhanceVerseContainers(document);
    });
    window.addEventListener('tdb-daily-verse-updated', function () {
      removeLegacyVerseBreakdownUi(document);
      enhanceVerseContainers(document);
    });
    window.addEventListener('tdb-calm-verse-updated', function () {
      enhanceVerseContainers(document);
    });
    if (!document.body || typeof MutationObserver !== 'function') return;
    var queued = false;
    var observer = new MutationObserver(function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        removeLegacyVerseBreakdownUi(document);
        enhanceVerseContainers(document);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function removeLegacyVerseBreakdownUi(root) {
    removeLegacyVerseModal();
    var host = root && root.querySelectorAll ? root : document;
    host.querySelectorAll('.tdb-breakdown-btn').forEach(function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    ['breakdown-lookup', 'breakdown-daily', 'mystudy-breakdown-selected', 'mystudy-breakdown-highlight', 'church-daily-breakdown'].forEach(function (id) {
      /* IDs removed from HTML over time; safe if absent */
      var el = byId(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    host.querySelectorAll('button[data-role="breakdown"]').forEach(function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
  }

  window.TDBVerseBreakdown = {
    open: open,
    getBreakdown: getBreakdown,
    addButton: addButton,
    injectInlineBreakdown: injectInlineBreakdown,
    populateInlineDetails: populateInlineDetails,
    getAgeMode: getAgeMode,
    setAgeMode: setAgeMode
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireAutoEnhance);
  else wireAutoEnhance();
})();
