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
    if (flip) flip.classList.remove('hidden');
    if (ht) {
      ht.classList.remove('hidden');
      ht.setAttribute('aria-pressed', 'false');
    }
    if (kn) kn.classList.remove('hidden');
    if (rv) rv.classList.remove('hidden');
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
    rows.forEach(function (row) {
      var li = document.createElement('li');
      var span = document.createElement('span');
      span.textContent = row.ref;
      li.appendChild(span);
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
    var ex = byId('mem-export-txt');
    var spk = byId('mem-speak');
    var spkStop = byId('mem-speak-stop');

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
        comp.markMemorizeReviewed(memCurrentRef);
        setStatus('Marked as reviewed for this gentle rhythm.');
        renderQueue();
      });
    }

    if (rv) {
      rv.addEventListener('click', function () {
        setStatus('Kept in your queue for next time. No pressure.');
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

    if (ex) ex.addEventListener('click', exportList);

    if (spk) spk.addEventListener('click', speakVerse);
    if (spkStop) spkStop.addEventListener('click', stopSpeak);

    renderQueue();

    if (!('speechSynthesis' in window)) {
      var na = byId('mem-audio-note');
      if (na) na.classList.remove('hidden');
      if (spk) spk.disabled = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
