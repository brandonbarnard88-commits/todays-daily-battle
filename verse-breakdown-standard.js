/**
 * Site-wide verse breakdown helpers (Today's Daily Battle porch standard).
 * DOM-building pages may use class names only; keep copy calm and plain.
 * Loads before hero-daily-first-paint.js where both are bundled.
 */
(function () {
  'use strict';

  function sanitize(value) {
    return String(value == null ? '' : value);
  }

  /** @returns {number} */
  function currentYear() {
    try {
      return new Date().getFullYear();
    } catch (eY) {
      return 2026;
    }
  }

  /** @param {number} [year] */
  function defaultRelatesTodayLine(year) {
    var y = typeof year === 'number' && !isNaN(year) ? year : currentYear();
    return (
      'In ' +
      y +
      ', life can feel loud—headlines, hurry, tension. God’s Word here still cuts through as something steady you can carry today.'
    );
  }

  /** @param {string} refFull e.g. "John 3:16" — no HTML */
  function prayerForRef(refFull) {
    var r = sanitize(refFull).trim();
    var cue = r || 'this verse';
    return (
      'Lord, sink ' +
      cue +
      ' into my heart—not as noise, but as truth that changes how I walk. In Jesus\u2019 name, Amen.'
    );
  }

  function nextStepFallback() {
    return 'Read it slowly one more time—then thank God aloud for one true thing inside it before you move.';
  }

  /**
   * Builds the "Sit with This Verse" adult reflection block (screen-only).
   * Returns a detached DOM element ready to append after the prayer block.
   */
  function buildReflectionBlock() {
    var wrap = document.createElement('div');
    wrap.className = 'tdb-vb-reflection';

    var h = document.createElement('p');
    h.className = 'tdb-vb-reflection__heading';
    h.textContent = 'Sit with This Verse';
    wrap.appendChild(h);

    var sub = document.createElement('p');
    sub.className = 'tdb-vb-reflection__sub';
    sub.textContent = 'A quiet moment with the Lord. No pressure — just honesty.';
    wrap.appendChild(sub);

    var questions = [
      'Where in your life right now is this verse speaking most clearly?',
      'What would trusting God with this look like today — even in a small way?',
      'Is there a simple prayer you want to speak to the Lord as you sit with this?'
    ];
    questions.forEach(function (q, i) {
      var d = document.createElement('div');
      d.className = 'tdb-vb-reflection-q';
      var st = document.createElement('strong');
      st.textContent = (i + 1) + '.';
      d.appendChild(st);
      d.appendChild(document.createTextNode(' ' + q));
      wrap.appendChild(d);
    });

    var still = document.createElement('p');
    still.className = 'tdb-vb-reflection__still';
    still.textContent = '\u201cBe still, and know that I am God\u2026\u201d \u2014 Psalm 46:10 (KJV)';
    wrap.appendChild(still);

    var details = document.createElement('details');
    details.className = 'tdb-vb-reflection__sat';
    var summary = document.createElement('summary');
    summary.textContent = 'I sat with this';
    details.appendChild(summary);
    var note = document.createElement('div');
    note.className = 'tdb-vb-reflection__sat-note';
    note.innerHTML = '<em>\u201cThe LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy.\u201d \u2014 Zephaniah 3:17 (KJV)</em><p>You are not alone.</p>';
    details.appendChild(note);
    wrap.appendChild(details);

    return wrap;
  }

  /**
   * Fills .big-kjv#heroRef with <strong>Ref (KJV)</strong> (legacy id preserved).
   * @param {HTMLElement|null} pEl
   * @param {string} ref
   */
  function fillBigKjvStrong(pEl, ref) {
    if (!pEl) return;
    var line = sanitize(ref).trim();
    var full = line ? line + ' (KJV)' : '(KJV)';
    pEl.textContent = '';
    var st = document.createElement('strong');
    st.textContent = full;
    pEl.appendChild(st);
  }

  window.TDB_verseBreakdownStandard = {
    currentYear: currentYear,
    defaultRelatesTodayLine: defaultRelatesTodayLine,
    prayerForRef: prayerForRef,
    nextStepFallback: nextStepFallback,
    fillBigKjvStrong: fillBigKjvStrong,
    buildReflectionBlock: buildReflectionBlock,
    CLS: {
      container: 'verse-breakdown-container',
      bigKjv: 'big-kjv',
      verseBody: 'verse-body',
      breakdownRoot: 'verse-breakdown',
      nextStep: 'next-step',
      prayerBlock: 'prayer-block',
      reflection: 'tdb-vb-reflection'
    }
  };
})();
