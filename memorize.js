(function () {
  'use strict';

  var comp = typeof window !== 'undefined' ? window.TDBStudyCompanion : null;
  var memTextCache = {};
  var memCurrentRef = '';
  var memCurrentText = '';
  var memCardShowsText = false;
  var memHideOn = false;
  var memHintTimer = null;
  var memUtter = null;
  var memRepeatClearTimer = null;
  var memGoodPulseTimer = null;
  var memQueueFilterDueOnly = false;
  /** Matches bible-study-companion MEM_INTERVALS_DAYS length minus one (rhythm normalization). */
  var MEM_INTERVAL_IDX_MAX = 10;
  var MEM_RHYTHM_SEEDS = 7;

  function byId(id) {
    return document.getElementById(id);
  }

  function setStatus(msg, isErr) {
    var el = byId('mem-status');
    if (!el) return;
    el.textContent = msg || '';
    el.style.color = isErr ? '#fca5a5' : '';
  }

  function parseRefLoose(raw) {
    var t = String(raw || '').trim();
    var m = t.match(/^((?:[1-3]\s+)?[a-zA-Z][a-zA-Z.\s']+?)\s+(\d+)\s*:\s*(\d+)$/i);
    if (!m) return null;
    return {
      book: m[1].replace(/\s+/g, ' ').trim(),
      chapter: m[2],
      verse: m[3],
      label: m[1].replace(/\s+/g, ' ').trim() + ' ' + m[2] + ':' + m[3]
    };
  }

  function fetchKjvVerse(parsed) {
    var path =
      encodeURIComponent(parsed.book).replace(/%20/g, '+') + '+' + encodeURIComponent(String(parsed.chapter));
    var url = 'https://bible-api.com/' + path + '?translation=kjv';
    return fetch(url)
      .then(function (res) {
        return res.ok ? res.json() : Promise.reject(new Error('network'));
      })
      .then(function (data) {
        var verses = Array.isArray(data && data.verses) ? data.verses : [];
        var want = String(parsed.verse);
        var hit = verses.filter(function (v) {
          return String(v.verse || '') === want;
        })[0];
        if (!hit) return Promise.reject(new Error('notfound'));
        var text = String(hit.text || '').trim();
        if (!text) return Promise.reject(new Error('empty'));
        return text;
      });
  }

  function showCard(ref, text) {
    memCurrentRef = ref;
    memCurrentText = text;
    memTextCache[ref] = text;
    var card = byId('mem-card');
    var refEl = byId('mem-card-ref');
    var bodyEl = byId('mem-card-body');
    if (refEl) refEl.textContent = ref;
    if (bodyEl) {
      bodyEl.textContent = '';
      bodyEl.appendChild(document.createTextNode(text));
    }
    if (card) {
      card.classList.remove('hidden');
      memCardShowsText = false;
      memHideOn = false;
      card.classList.remove('mem-card--text');
      card.classList.remove('mem-hide');
      updateFlipUi();
    }
    var flip = byId('mem-flip');
    var ht = byId('mem-hide-toggle');
    var kn = byId('mem-mark-known');
    var rv = byId('mem-mark-review');
    var rep = byId('mem-repeat-along');
    if (flip) flip.classList.remove('hidden');
    if (ht) {
      ht.classList.remove('hidden');
      ht.setAttribute('aria-pressed', 'false');
    }
    if (kn) kn.classList.remove('hidden');
    if (rv) rv.classList.remove('hidden');
    if (rep) rep.classList.remove('hidden');
  }

  function updateFlipUi() {
    var card = byId('mem-card');
    if (!card) return;
    if (memCardShowsText) {
      card.classList.add('mem-card--text');
    } else {
      card.classList.remove('mem-card--text');
    }
    if (memHideOn && memCardShowsText) {
      applyHideWords();
    } else {
      card.classList.remove('mem-hide');
      var bodyEl = byId('mem-card-body');
      if (bodyEl && memCurrentText) {
        bodyEl.textContent = '';
        bodyEl.appendChild(document.createTextNode(memCurrentText));
      }
    }
  }

  function buildHiddenTextForPrint(text) {
    var raw = String(text || '');
    if (!raw.trim()) return '';
    var parts = raw.split(/(\s+)/);
    var indices = [];
    for (var i = 0; i < parts.length; i++) {
      if (!/^\s+$/.test(parts[i]) && parts[i].length > 3) indices.push(i);
    }
    var hideCount = Math.max(1, Math.floor(indices.length * 0.35));
    var pick = {};
    while (Object.keys(pick).length < hideCount && indices.length) {
      var j = indices[Math.floor(Math.random() * indices.length)];
      pick[j] = true;
    }
    var out = '';
    for (var k = 0; k < parts.length; k++) {
      if (pick[k] && !/^\s+$/.test(parts[k])) {
        var len = Math.min(14, Math.max(5, parts[k].length));
        out += '\u2014'.repeat(len);
      } else {
        out += parts[k];
      }
    }
    return out.replace(/\s+/g, ' ').trim();
  }

  function applyHideWords() {
    var bodyEl = byId('mem-card-body');
    if (!bodyEl || !memCurrentText) return;
    bodyEl.textContent = '';
    var parts = memCurrentText.split(/(\s+)/);
    var wordIdx = 0;
    var indices = [];
    for (var i = 0; i < parts.length; i++) {
      if (!/^\s+$/.test(parts[i]) && parts[i].length > 3) {
        indices.push(i);
        wordIdx++;
      }
    }
    var hideCount = Math.max(1, Math.floor(indices.length * 0.35));
    var pick = {};
    while (Object.keys(pick).length < hideCount && indices.length) {
      var j = indices[Math.floor(Math.random() * indices.length)];
      pick[j] = true;
    }
    for (var k = 0; k < parts.length; k++) {
      if (pick[k]) {
        var sp = document.createElement('span');
        sp.className = 'mem-hidden-bit';
        sp.textContent = parts[k];
        bodyEl.appendChild(sp);
      } else {
        bodyEl.appendChild(document.createTextNode(parts[k]));
      }
    }
  }

  function renderQueue() {
    var ul = byId('mem-queue-list');
    var empty = byId('mem-queue-empty');
    var grow = byId('mem-growing');
    var fe = byId('mem-queue-filter-empty');
    var btnDue = byId('mem-review-due');
    var btnFull = byId('mem-show-full-queue');
    if (!comp || typeof comp.listMemorizeQueue !== 'function') {
      if (grow) grow.textContent = '';
      return;
    }
    var now = Date.now();
    var allRows = comp.listMemorizeQueue();
    var rows = memQueueFilterDueOnly ? allRows.filter(function (r) {
      return r.dueAt <= now;
    }) : allRows;
    if (grow) {
      grow.textContent = '';
    }
    if (empty) empty.style.display = allRows.length ? 'none' : '';
    if (fe) {
      if (memQueueFilterDueOnly && allRows.length && !rows.length) {
        fe.hidden = false;
        fe.textContent =
          'Nothing is due for review right now — a quiet mercy. Tap Show full list when you want every verse.';
      } else {
        fe.hidden = true;
        fe.textContent = '';
      }
    }
    if (btnFull) {
      if (memQueueFilterDueOnly) btnFull.classList.remove('hidden');
      else btnFull.classList.add('hidden');
    }
    if (btnDue && allRows.length) {
      var dueCount = allRows.filter(function (r) {
        return r.dueAt <= now;
      }).length;
      btnDue.disabled = !dueCount;
      btnDue.setAttribute('aria-label', dueCount ? 'Show only verses due for review' : 'No verses due right now');
    } else if (btnDue) {
      btnDue.disabled = true;
    }
    if (!ul) return;
    ul.textContent = '';
    rows.forEach(function (row) {
      var li = document.createElement('li');
      var due = row.dueAt <= now;
      if (due) li.classList.add('mem-queue-due');
      var span = document.createElement('span');
      span.textContent = row.ref;
      li.appendChild(span);
      var hint = document.createElement('span');
      hint.className = 'section-note';
      hint.style.marginLeft = '0.25rem';
      if (due) {
        hint.textContent = 'Ready for a gentle review.';
      } else {
        var days = Math.max(1, Math.ceil((row.dueAt - now) / 86400000));
        hint.textContent = 'Next quiet check-in in about ' + days + ' day' + (days === 1 ? '' : 's') + '.';
      }
      li.appendChild(hint);
      var rm = String(row.ref || '').match(/^(.+)\s(\d+):(\d+)$/);
      var open = document.createElement('a');
      if (rm) {
        open.href =
          'reader.html?book=' +
          encodeURIComponent(rm[1].trim()) +
          '&chapter=' +
          encodeURIComponent(rm[2]) +
          '&ref=' +
          encodeURIComponent(row.ref);
      } else {
        open.href = 'reader.html';
      }
      open.className = 'section-note';
      open.style.marginLeft = '0.35rem';
      open.textContent = 'Open in reader';
      li.appendChild(open);
      var loadOne = document.createElement('button');
      loadOne.type = 'button';
      loadOne.className = 'btn btn-secondary';
      loadOne.style.fontSize = '0.82rem';
      loadOne.style.padding = '0.35rem 0.65rem';
      loadOne.style.minHeight = '40px';
      loadOne.textContent = 'Load on card';
      loadOne.setAttribute('aria-label', 'Load ' + row.ref + ' on the verse card above');
      loadOne.addEventListener('click', function () {
        var p = parseRefLoose(row.ref);
        if (!p) return;
        setStatus('Loading…');
        fetchKjvVerse(p)
          .then(function (text) {
            showCard(p.label, text);
            setStatus('Loaded ' + row.ref + '. Flip or review when you want.');
            try {
              document.getElementById('mem-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } catch (eScroll) {}
          })
          .catch(function () {
            setStatus('Could not load that verse. Check connection or open the reader.', true);
          });
      });
      li.appendChild(loadOne);
      ul.appendChild(li);
    });
    renderMemProgressRhythm(allRows, now);
  }

  function renderMemProgressRhythm(allRows, now) {
    var wrap = byId('mem-progress-rhythm');
    var sum = byId('mem-progress-summary');
    var lab = byId('mem-rhythm-label');
    if (!wrap) return;
    if (!allRows.length) {
      wrap.hidden = true;
      wrap.innerHTML = '';
      if (lab) lab.hidden = true;
      if (sum) {
        sum.hidden = true;
        sum.textContent = '';
      }
      return;
    }
    if (lab) lab.hidden = false;
    wrap.hidden = false;
    wrap.setAttribute('role', 'presentation');
    wrap.setAttribute('aria-hidden', 'true');
    var due = 0;
    var later = 0;
    var sumNorm = 0;
    var dueAny = false;
    allRows.forEach(function (row) {
      var isDue = row.dueAt <= now;
      if (isDue) {
        due++;
        dueAny = true;
      } else later++;
      var idx = row.entry && row.entry.intervalIdx != null ? Number(row.entry.intervalIdx) : 0;
      if (isNaN(idx) || idx < 0) idx = 0;
      sumNorm += Math.min(1, idx / MEM_INTERVAL_IDX_MAX);
    });
    var avg = sumNorm / allRows.length;
    var grownThrough = Math.min(MEM_RHYTHM_SEEDS - 1, Math.round(avg * (MEM_RHYTHM_SEEDS - 1)));
    wrap.textContent = '';
    var s;
    for (s = 0; s < MEM_RHYTHM_SEEDS; s++) {
      var seed = document.createElement('span');
      seed.className = 'mem-seed';
      if (s <= grownThrough) seed.classList.add('mem-seed--grown');
      if (dueAny && s === grownThrough) seed.classList.add('mem-seed--glow');
      seed.title = 'Gentle rhythm in your list — not a score';
      wrap.appendChild(seed);
    }
    if (sum) {
      sum.hidden = false;
      var parts = [];
      if (due) parts.push(due === 1 ? '1 ready when you are' : due + ' ready when you are');
      if (later) parts.push(later === 1 ? '1 resting' : later + ' resting');
      sum.textContent = parts.join(' · ') + '.';
    }
  }

  function printMemoryCards() {
    if (!comp || typeof comp.listMemorizeQueue !== 'function') return;
    var rows = comp.listMemorizeQueue();
    if (!rows.length) {
      setStatus('Add a verse to your list first.', true);
      return;
    }
    var esc = function (s) {
      return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
    var footer = 'todaysdailybattle.com &mdash; private &amp; offline';
    var body = '';
    rows.forEach(function (row) {
      var t = memTextCache[row.ref] || '';
      var backText = t ? buildHiddenTextForPrint(t) : '';
      body += '<div class="mem-print-pair">';
      body += '<section class="mem-print-face mem-print-front">';
      body += '<p class="mem-print-ref">' + esc(row.ref) + '</p>';
      if (t) {
        body += '<p class="mem-print-body">' + esc(t) + '</p>';
      } else {
        body +=
          '<p class="mem-print-missing">Load this reference once on the Memorize page on this device to fill the text.</p>';
      }
      body += '<p class="mem-print-footer">' + footer + '</p>';
      body += '</section>';
      body += '<section class="mem-print-face mem-print-back">';
      body += '<p class="mem-print-ref">' + esc(row.ref) + '</p>';
      body += '<p class="mem-print-back-hint">Back &mdash; hide-words side. Print <strong>double-sided</strong> (flip on long edge).</p>';
      if (backText) {
        body += '<p class="mem-print-body mem-print-body--back">' + esc(backText) + '</p>';
      } else {
        body += '<p class="mem-print-missing">No hide-words text until the verse is loaded on Memorize.</p>';
      }
      body += '<p class="mem-print-footer">' + footer + '</p>';
      body += '</section></div>';
    });
    var html =
      '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>KJV memory cards</title><style>' +
      '@page{margin:1cm}' +
      'body{font-family:Georgia,serif;line-height:1.55;color:#1a1a1a;margin:0;padding:0.75rem;background:#fafafa}' +
      '@media screen and (max-width:540px){body{padding:0.5rem}.mem-print-face{padding:0.9rem 1rem!important;min-height:auto!important}.mem-print-ref{font-size:1.1rem!important}.mem-print-body{font-size:1.2rem!important}.mem-print-body--back{font-size:1.12rem!important}}' +
      'h1{font-size:1.2rem;margin:0 0 .5rem}' +
      '.lead{font-size:.85rem;color:#444;margin:0 0 1rem;line-height:1.45;max-width:40rem}' +
      '.mem-print-pair{page-break-after:always;margin-bottom:0}' +
      '.mem-print-pair:last-child{page-break-after:auto}' +
      '.mem-print-face{page-break-inside:avoid;min-height:42vh;box-sizing:border-box;padding:1.15rem 1.25rem;border:1px solid #ccc;border-radius:12px;margin:0 0 .65rem;background:#fff}' +
      '.mem-print-ref{margin:0 0 .85rem;font-size:1.2rem;font-weight:700;color:#111;letter-spacing:.01em}' +
      '.mem-print-body{margin:0;font-size:1.38rem;line-height:1.58;color:#111}' +
      '.mem-print-body--back{font-size:1.28rem;letter-spacing:.02em}' +
      '.mem-print-back-hint{margin:0 0 .75rem;font-size:.8rem;color:#555;line-height:1.4}' +
      '.mem-print-missing{margin:0;font-size:.95rem;color:#555;font-style:italic}' +
      '.mem-print-footer{margin:1.75rem 0 0;font-size:.68rem;color:#666;letter-spacing:.02em}' +
      '</style></head><body><h1>KJV memory cards</h1><p class="lead">King James Version. One verse per sheet pair: front = full text, back = gentle blanks. Trim or fold. No scores.</p>' +
      body +
      '</body></html>';
    try {
      var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var w = window.open(url, '_blank', 'noopener,noreferrer');
      if (w) {
        w.addEventListener(
          'load',
          function () {
            try {
              w.print();
            } catch (eP) {}
            setTimeout(function () {
              URL.revokeObjectURL(url);
            }, 120000);
          },
          { once: true }
        );
        try {
          if (typeof trackEvent === 'function') trackEvent('memorize_print_cards', { count: rows.length });
        } catch (eT) {}
        setStatus('Print sheet opened. If nothing appears, allow pop-ups for this site.');
      } else {
        URL.revokeObjectURL(url);
        setStatus('Pop-up blocked. Allow pop-ups to open the print sheet.', true);
      }
    } catch (e) {
      setStatus('Could not open print sheet. Try again in a moment.', true);
    }
  }

  function downloadText(filename, text) {
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  function getExportRowsOrBail() {
    if (!comp || typeof comp.listMemorizeQueue !== 'function') return null;
    var rows = comp.listMemorizeQueue();
    if (!rows.length) {
      setStatus('Add a verse to your list first.', true);
      return null;
    }
    return rows;
  }

  function exportListTxt() {
    var rows = getExportRowsOrBail();
    if (!rows) return;
    var lines = [
      'My memory list (KJV) — Today\'s Daily Battle',
      'Private export from this device.',
      ''
    ];
    rows.forEach(function (r) {
      var t = memTextCache[r.ref] || '';
      lines.push(r.ref);
      if (t) lines.push(t);
      lines.push('');
    });
    downloadText('memorize-list-' + new Date().toISOString().slice(0, 10) + '.txt', lines.join('\n'));
    setStatus('Plain text download started.');
    try {
      if (typeof trackEvent === 'function') trackEvent('memorize_export', { format: 'txt' });
    } catch (e) {}
  }

  function exportListMd() {
    var rows = getExportRowsOrBail();
    if (!rows) return;
    var lines = [
      '# KJV memory list',
      '',
      '_Today\'s Daily Battle — private export from this device._',
      ''
    ];
    rows.forEach(function (r) {
      var t = memTextCache[r.ref] || '';
      lines.push('## ' + r.ref);
      lines.push('');
      lines.push(t || '_Verse text: load this reference on the Memorize page to cache it here._');
      lines.push('');
    });
    downloadText('memorize-list-' + new Date().toISOString().slice(0, 10) + '.md', lines.join('\n'));
    setStatus('Markdown download started.');
    try {
      if (typeof trackEvent === 'function') trackEvent('memorize_export', { format: 'md' });
    } catch (e) {}
  }

  function exportListJson() {
    var rows = getExportRowsOrBail();
    if (!rows) return;
    var payload = {
      version: 1,
      source: 'todaysdailybattle-memorize',
      exported: new Date().toISOString(),
      verses: rows.map(function (r) {
        return { ref: r.ref, text: memTextCache[r.ref] || '' };
      })
    };
    downloadText(
      'memorize-list-' + new Date().toISOString().slice(0, 10) + '.json',
      JSON.stringify(payload, null, 2)
    );
    setStatus('JSON backup download started.');
    try {
      if (typeof trackEvent === 'function') trackEvent('memorize_export', { format: 'json' });
    } catch (e) {}
  }

  function speakVerse() {
    if (!memCurrentText || !memCurrentRef) {
      setStatus('Load a verse first.', true);
      return;
    }
    clearRepeatAlongVisuals();
    if (!('speechSynthesis' in window)) {
      var na = byId('mem-audio-note');
      if (na) na.classList.remove('hidden');
      return;
    }
    try {
      if (memUtter) speechSynthesis.cancel();
    } catch (e) {}
    var u = new SpeechSynthesisUtterance(memCurrentRef + '. ' + memCurrentText);
    u.rate = 0.88;
    memUtter = u;
    u.onend = function () {
      memUtter = null;
      var stop = byId('mem-speak-stop');
      if (stop) stop.hidden = true;
    };
    speechSynthesis.speak(u);
    var stop = byId('mem-speak-stop');
    if (stop) stop.hidden = false;
  }

  function stopSpeak() {
    try {
      speechSynthesis.cancel();
    } catch (e) {}
    var stop = byId('mem-speak-stop');
    if (stop) stop.hidden = true;
    clearRepeatAlongVisuals();
  }

  function clearRepeatAlongVisuals() {
    var card = byId('mem-card');
    if (card) {
      card.classList.remove('mem-card--listening');
      card.classList.remove('mem-card--your-turn');
    }
    if (memRepeatClearTimer) {
      clearTimeout(memRepeatClearTimer);
      memRepeatClearTimer = null;
    }
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  /** Listen, then gentle visual cue to speak aloud (no mic; private on-device). */
  function repeatAfterMe() {
    if (!memCurrentText || !memCurrentRef) {
      setStatus('Load a verse first.', true);
      return;
    }
    if (!('speechSynthesis' in window)) {
      setStatus('Speaking is not available here. You can still read aloud quietly.', true);
      return;
    }
    clearRepeatAlongVisuals();
    try {
      speechSynthesis.cancel();
    } catch (e) {}
    var card = byId('mem-card');
    var u = new SpeechSynthesisUtterance(memCurrentRef + '. ' + memCurrentText);
    u.rate = 0.8;
    memUtter = u;
    u.onstart = function () {
      if (card) card.classList.add('mem-card--listening');
    };
    u.onend = function () {
      memUtter = null;
      var stop = byId('mem-speak-stop');
      if (stop) stop.hidden = true;
      if (card) {
        card.classList.remove('mem-card--listening');
        if (!prefersReducedMotion()) card.classList.add('mem-card--your-turn');
      }
      setStatus('Your turn — say it out loud at your own pace. No rush.');
      memRepeatClearTimer = setTimeout(function () {
        if (card) card.classList.remove('mem-card--your-turn');
        memRepeatClearTimer = null;
      }, prefersReducedMotion() ? 1200 : 5200);
    };
    u.onerror = function () {
      memUtter = null;
      clearRepeatAlongVisuals();
      setStatus('Could not play audio. Try again when you are ready.', true);
    };
    speechSynthesis.speak(u);
    var stop = byId('mem-speak-stop');
    if (stop) stop.hidden = false;
  }

  function firstLetterHints(text) {
    return String(text || '')
      .split(/\s+/)
      .map(function (w) {
        var m = w.match(/[a-zA-Z]/);
        return m ? m[0] + '·' : '';
      })
      .join(' ')
      .trim();
  }

  function init() {
    var loadBtn = byId('mem-load-verse');
    var addBtn = byId('mem-add-queue');
    var inp = byId('mem-ref-input');
    var flip = byId('mem-flip');
    var ht = byId('mem-hide-toggle');
    var kn = byId('mem-mark-known');
    var rv = byId('mem-mark-review');
    var ta = byId('mem-type-area');
    var hintBtn = byId('mem-type-hint-now');
    var clearBtn = byId('mem-type-clear');
    var printCards = byId('mem-print-cards');
    var exTxt = byId('mem-export-txt');
    var exMd = byId('mem-export-md');
    var exJson = byId('mem-export-json');
    var reviewDue = byId('mem-review-due');
    var showFull = byId('mem-show-full-queue');
    var spk = byId('mem-speak');
    var spkStop = byId('mem-speak-stop');
    var rep = byId('mem-repeat-along');

    if (loadBtn && inp) {
      loadBtn.addEventListener('click', function () {
        var p = parseRefLoose(inp.value);
        if (!p) {
          setStatus('Use a reference like John 3:16 or Psalm 23:1.', true);
          return;
        }
        setStatus('Loading…');
        fetchKjvVerse(p)
          .then(function (text) {
            showCard(p.label, text);
            setStatus('Loaded. Flip the card or add to your list when you want.');
          })
          .catch(function () {
            setStatus('Could not load that verse. Check the reference and connection.', true);
          });
      });
    }

    if (addBtn && comp && typeof comp.toggleMemorize === 'function') {
      addBtn.addEventListener('click', function () {
        if (!memCurrentRef) {
          setStatus('Load a verse first.', true);
          return;
        }
        if (comp.isMemorizing(memCurrentRef)) {
          setStatus('Already in your memory list.');
          return;
        }
        comp.toggleMemorize(memCurrentRef);
        setStatus('Added to your gentle queue (also in My Study).');
        renderQueue();
      });
    }

    if (flip) {
      flip.addEventListener('click', function () {
        memCardShowsText = !memCardShowsText;
        updateFlipUi();
      });
    }

    if (ht) {
      ht.addEventListener('click', function () {
        memHideOn = !memHideOn;
        ht.setAttribute('aria-pressed', memHideOn ? 'true' : 'false');
        if (!memCardShowsText) memCardShowsText = true;
        updateFlipUi();
      });
    }

    if (kn && comp && typeof comp.markMemorizeReviewed === 'function') {
      kn.addEventListener('click', function () {
        if (!memCurrentRef) return;
        comp.markMemorizeReviewed(memCurrentRef, 'good');
        setStatus('Logged as remembered — your next reminder will wait a little longer.');
        var card = byId('mem-card');
        if (card) {
          card.classList.remove('mem-card--good-pulse');
          if (memGoodPulseTimer) clearTimeout(memGoodPulseTimer);
          card.classList.add('mem-card--good-pulse');
          memGoodPulseTimer = setTimeout(function () {
            if (card) card.classList.remove('mem-card--good-pulse');
            memGoodPulseTimer = null;
          }, prefersReducedMotion() ? 400 : 1000);
        }
        renderQueue();
      });
    }

    if (rv && comp && typeof comp.markMemorizeReviewed === 'function') {
      rv.addEventListener('click', function () {
        if (!memCurrentRef) return;
        comp.markMemorizeReviewed(memCurrentRef, 'again');
        setStatus('Kept close on your queue — we will nudge again sooner. Still no pressure.');
        renderQueue();
      });
    }

    if (ta) {
      ta.addEventListener('input', function () {
        clearTimeout(memHintTimer);
        memHintTimer = setTimeout(function () {
          var hint = byId('mem-type-hint');
          if (hint && memCurrentText) {
            hint.textContent = 'Gentle hint: ' + firstLetterHints(memCurrentText);
          }
        }, 950);
      });
    }

    if (hintBtn) {
      hintBtn.addEventListener('click', function () {
        var hint = byId('mem-type-hint');
        if (hint && memCurrentText) {
          hint.textContent = 'Gentle hint: ' + firstLetterHints(memCurrentText);
        } else if (hint) {
          hint.textContent = 'Load a verse first.';
        }
      });
    }

    if (clearBtn && ta) {
      clearBtn.addEventListener('click', function () {
        ta.value = '';
        var hint = byId('mem-type-hint');
        if (hint) hint.textContent = 'Pause about a second after typing to show first-letter hints for words.';
      });
    }

    if (printCards) printCards.addEventListener('click', printMemoryCards);
    if (exTxt) exTxt.addEventListener('click', exportListTxt);
    if (exMd) exMd.addEventListener('click', exportListMd);
    if (exJson) exJson.addEventListener('click', exportListJson);

    if (reviewDue) {
      reviewDue.addEventListener('click', function () {
        memQueueFilterDueOnly = true;
        renderQueue();
        setStatus('Showing verses that are due for a gentle review.');
      });
    }
    if (showFull) {
      showFull.addEventListener('click', function () {
        memQueueFilterDueOnly = false;
        renderQueue();
        setStatus('Full memory list.');
      });
    }

    if (spk) spk.addEventListener('click', speakVerse);
    if (spkStop) spkStop.addEventListener('click', stopSpeak);
    if (rep) rep.addEventListener('click', repeatAfterMe);

    renderQueue();

    if (!('speechSynthesis' in window)) {
      var na = byId('mem-audio-note');
      if (na) na.classList.remove('hidden');
      if (spk) spk.disabled = true;
      if (rep) rep.disabled = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
