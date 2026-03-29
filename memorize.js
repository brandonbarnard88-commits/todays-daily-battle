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
    if (!comp || typeof comp.listMemorizeQueue !== 'function') {
      if (grow) grow.textContent = '';
      return;
    }
    var rows = comp.listMemorizeQueue();
    if (grow) {
      if (!rows.length) {
        grow.textContent = '';
      } else {
        grow.textContent =
          'Growing strong: ' +
          rows.length +
          ' verse' +
          (rows.length === 1 ? '' : 's') +
          ' in your gentle queue on this device.';
      }
    }
    if (empty) empty.style.display = rows.length ? 'none' : '';
    if (!ul) return;
    ul.textContent = '';
    var now = Date.now();
    rows.forEach(function (row) {
      var li = document.createElement('li');
      var span = document.createElement('span');
      span.textContent = row.ref;
      li.appendChild(span);
      var due = row.dueAt <= now;
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
      ul.appendChild(li);
    });
    renderMemProgressRhythm(rows, now);
  }

  function renderMemProgressRhythm(rows, now) {
    var wrap = byId('mem-progress-rhythm');
    var sum = byId('mem-progress-summary');
    if (!wrap) return;
    if (!rows.length) {
      wrap.hidden = true;
      wrap.innerHTML = '';
      if (sum) {
        sum.hidden = true;
        sum.textContent = '';
      }
      return;
    }
    wrap.hidden = false;
    wrap.setAttribute('role', 'presentation');
    wrap.setAttribute('aria-hidden', 'true');
    var due = 0;
    var later = 0;
    wrap.innerHTML = '';
    rows.forEach(function (row) {
      var isDue = row.dueAt <= now;
      if (isDue) due++;
      else later++;
      var dot = document.createElement('span');
      dot.className = 'mem-rhythm-dot' + (isDue ? ' mem-rhythm-dot--due' : '');
      dot.title = row.ref + (isDue ? ' — ready when you are' : ' — resting until later');
      wrap.appendChild(dot);
    });
    if (sum) {
      sum.hidden = false;
      var parts = [];
      if (due) parts.push(due === 1 ? '1 ready when you are' : due + ' ready when you are');
      if (later) parts.push(later === 1 ? '1 resting' : later + ' resting');
      sum.textContent = parts.join(' · ') + ' — no scores, just rhythm.';
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
    var body = '';
    rows.forEach(function (row) {
      var t = memTextCache[row.ref] || '';
      body += '<article class="mem-print-card"><h2 class="mem-print-ref">' + esc(row.ref) + '</h2>';
      if (t) {
        body += '<p class="mem-print-text">' + esc(t) + '</p>';
      } else {
        body +=
          '<p class="mem-print-missing">Verse text will appear after you load this reference once on the Memorize page on this device.</p>';
      }
      body += '</article>';
    });
    var html =
      '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>KJV memory cards</title><style>' +
      '@page{margin:1.2cm}' +
      'body{font-family:Georgia,serif;line-height:1.55;color:#111;max-width:48rem;margin:0 auto;padding:1rem}' +
      '.mem-print-card{border:1px solid #ccc;border-radius:10px;padding:1rem 1.15rem;margin-bottom:1.35rem;page-break-inside:avoid}' +
      '.mem-print-ref{margin:0 0 .45rem;font-size:1.08rem;color:#1a1a1a}' +
      '.mem-print-text{margin:0;font-size:1rem}' +
      '.mem-print-missing{margin:0;font-size:.9rem;color:#555;font-style:italic}' +
      'h1{font-size:1.22rem;margin:0 0 .75rem}' +
      '.lead{font-size:.88rem;color:#444;margin:0 0 1.35rem;line-height:1.5}' +
      '</style></head><body><h1>KJV memory cards</h1><p class="lead">From this device only. Fold, cut, or tuck in your Bible&mdash;no streaks, no scores.</p>' +
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

  function exportList() {
    if (!comp || typeof comp.listMemorizeQueue !== 'function') return;
    var rows = comp.listMemorizeQueue();
    if (!rows.length) {
      setStatus('Add a verse to your list first.', true);
      return;
    }
    var lines = ['My memory list (KJV) — Today's Daily Battle', 'Private export from this device.', ''];
    rows.forEach(function (r) {
      var t = memTextCache[r.ref] || '';
      lines.push(r.ref + (t ? '\n' + t : ''));
      lines.push('');
    });
    downloadText('memorize-list-' + new Date().toISOString().slice(0, 10) + '.txt', lines.join('\n'));
    setStatus('Download started.');
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
    var ex = byId('mem-export-txt');
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
    if (ex) ex.addEventListener('click', exportList);

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
