/**
 * Kids Story Remember — “What happened next?” sequence game (no scores, no shame).
 * Mounts into the story read-quiz flow: Hear → Remember → Questions → Color optional.
 */
(function (global) {
  'use strict';

  function plain(s) {
    if (typeof global.tdbPlainTextForUi === 'function') return global.tdbPlainTextForUi(s);
    return String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  /**
   * Build ordered beats for a story key.
   * @returns {{ title: string, encouragement: string, beats: Array<{id:string,label:string}> }|null}
   */
  function getRememberPack(storyKey, readQuizPack) {
    var hand = (global.TDB_KIDS_STORY_REMEMBER || {})[storyKey];
    if (hand && Array.isArray(hand.beats) && hand.beats.length >= 3) {
      return {
        title: hand.title || 'What happened next?',
        encouragement: hand.encouragement || 'Put the story in order!',
        beats: hand.beats.map(function (b, i) {
          return { id: String(b.id || 'b' + i), label: plain(b.label) };
        }).filter(function (b) { return b.label; })
      };
    }
    var sections = readQuizPack && Array.isArray(readQuizPack.readAlongSections)
      ? readQuizPack.readAlongSections
      : [];
    if (sections.length >= 3) {
      var beats = [];
      for (var i = 0; i < Math.min(4, sections.length); i++) {
        var sec = sections[i] || {};
        var label = plain(sec.caption || '');
        if (!label && sec.text) {
          label = plain(String(sec.text).split(/[.!?]/)[0]).slice(0, 72);
          if (label.length > 60) label = label.slice(0, 57) + '…';
        }
        if (!label) label = 'Part ' + (i + 1);
        beats.push({ id: 'auto-' + i, label: label });
      }
      if (beats.length >= 3) {
        return {
          title: 'What happened next?',
          encouragement: 'Tap the cards in the right order — you can do it!',
          beats: beats
        };
      }
    }
    return null;
  }

  /**
   * @param {HTMLElement} host
   * @param {object} opts
   * @param {string} opts.storyKey
   * @param {object} [opts.readQuizPack]
   * @param {function} [opts.onComplete] — called when sequence is correct
   * @param {function} [opts.onSkip] — optional skip to questions
   * @returns {boolean} true if mounted
   */
  function mountRememberGame(host, opts) {
    opts = opts || {};
    if (!host) return false;
    var pack = getRememberPack(opts.storyKey, opts.readQuizPack);
    if (!pack || !pack.beats || pack.beats.length < 3) return false;

    var correctOrder = pack.beats.map(function (b) { return b.id; });
    var labelsById = {};
    pack.beats.forEach(function (b) { labelsById[b.id] = b.label; });

    var root = document.createElement('section');
    root.className = 'kids-remember';
    root.setAttribute('aria-label', 'Remember the story');
    // Journey strip lives in kids-corner.js (Hear → Remember → Color) — avoid a second banner here.

    var h = document.createElement('h4');
    h.className = 'kids-remember-title';
    h.textContent = plain(pack.title);
    root.appendChild(h);

    var lead = document.createElement('p');
    lead.className = 'kids-remember-lead';
    lead.textContent = plain(pack.encouragement);
    root.appendChild(lead);

    var status = document.createElement('p');
    status.className = 'kids-remember-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.textContent = 'Tap the first thing that happened.';
    root.appendChild(status);

    var slots = document.createElement('ol');
    slots.className = 'kids-remember-slots';
    slots.setAttribute('aria-label', 'Story in order');
    var slotEls = [];
    for (var s = 0; s < pack.beats.length; s++) {
      var li = document.createElement('li');
      li.className = 'kids-remember-slot';
      li.dataset.index = String(s);
      var num = document.createElement('span');
      num.className = 'kids-remember-slot-num';
      num.textContent = String(s + 1);
      var lab = document.createElement('span');
      lab.className = 'kids-remember-slot-label';
      lab.textContent = '?';
      li.appendChild(num);
      li.appendChild(lab);
      slots.appendChild(li);
      slotEls.push(li);
    }
    root.appendChild(slots);

    var bank = document.createElement('div');
    bank.className = 'kids-remember-bank';
    bank.setAttribute('role', 'group');
    bank.setAttribute('aria-label', 'Story pieces to put in order');

    var chosen = [];
    var remaining = shuffle(pack.beats.map(function (b) { return b.id; }));

    function refreshSlots() {
      for (var i = 0; i < slotEls.length; i++) {
        var lab = slotEls[i].querySelector('.kids-remember-slot-label');
        if (!lab) continue;
        if (chosen[i]) {
          lab.textContent = labelsById[chosen[i]] || '';
          slotEls[i].classList.add('kids-remember-slot--filled');
        } else {
          lab.textContent = '?';
          slotEls[i].classList.remove('kids-remember-slot--filled');
        }
      }
    }

    function setStatus(msg, kind) {
      status.textContent = msg;
      status.className = 'kids-remember-status' + (kind ? ' kids-remember-status--' + kind : '');
    }

    function checkComplete() {
      if (chosen.length < correctOrder.length) return;
      var ok = true;
      for (var i = 0; i < correctOrder.length; i++) {
        if (chosen[i] !== correctOrder[i]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        setStatus('Yes! You remembered the story. 🌟', 'win');
        bank.classList.add('kids-remember-bank--done');
        Array.prototype.forEach.call(bank.querySelectorAll('button'), function (b) {
          b.disabled = true;
        });
        try {
          localStorage.setItem('kidsStoryRememberDone:' + opts.storyKey, String(Date.now()));
        } catch (e) {}
        var more = document.createElement('div');
        more.className = 'kids-remember-more';
        var go = document.createElement('button');
        go.type = 'button';
        go.className = 'btn kids-btn-primary kids-remember-continue';
        go.textContent = 'More remember questions';
        go.addEventListener('click', function () {
          if (typeof opts.onComplete === 'function') opts.onComplete({ mode: 'questions' });
        });
        more.appendChild(go);
        var again = document.createElement('button');
        again.type = 'button';
        again.className = 'btn btn-secondary kids-remember-again';
        again.textContent = 'Play order again';
        again.addEventListener('click', function () {
          if (root.parentNode) root.parentNode.removeChild(root);
          mountRememberGame(host, opts);
        });
        more.appendChild(again);
        root.appendChild(more);
        try {
          if (global.tdbLittleShepherd && typeof global.tdbLittleShepherd.notify === 'function') {
            global.tdbLittleShepherd.notify('rememberComplete', { key: opts.storyKey });
          }
        } catch (eN) {}
        return;
      }
      // Wrong order — gentle reset, no shame
      setStatus('Almost! Let’s try the order again — you’ve got this.', 'retry');
      root.classList.add('kids-remember--shake');
      setTimeout(function () {
        root.classList.remove('kids-remember--shake');
        chosen = [];
        remaining = shuffle(pack.beats.map(function (b) { return b.id; }));
        tdbClear(bank);
        remaining.forEach(addCard);
        refreshSlots();
        setStatus('Tap the first thing that happened.', '');
      }, 900);
    }

    function tdbClear(el) {
      if (typeof global.tdbClearHtml === 'function') global.tdbClearHtml(el);
      else while (el.firstChild) el.removeChild(el.firstChild);
    }

    function addCard(id) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kids-remember-card';
      btn.dataset.id = id;
      btn.textContent = labelsById[id] || id;
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        chosen.push(id);
        btn.disabled = true;
        btn.classList.add('kids-remember-card--used');
        refreshSlots();
        if (chosen.length < correctOrder.length) {
          setStatus('Nice! Now pick what happened next.', 'ok');
        }
        checkComplete();
      });
      bank.appendChild(btn);
    }

    remaining.forEach(addCard);
    root.appendChild(bank);

    var actions = document.createElement('p');
    actions.className = 'kids-remember-actions';
    var skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'btn-link kids-remember-skip';
    skip.textContent = 'Skip to questions';
    skip.addEventListener('click', function () {
      if (typeof opts.onSkip === 'function') opts.onSkip();
      else if (typeof opts.onComplete === 'function') opts.onComplete({ mode: 'skip' });
    });
    actions.appendChild(skip);
    root.appendChild(actions);

    // Insert at top of host (after any prior content caller may have)
    host.appendChild(root);
    refreshSlots();
    return true;
  }

  global.TDBKidsStoryRemember = {
    getRememberPack: getRememberPack,
    mountRememberGame: mountRememberGame
  };
})(typeof window !== 'undefined' ? window : globalThis);
