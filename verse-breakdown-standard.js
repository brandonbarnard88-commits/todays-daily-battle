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
    CLS: {
      container: 'verse-breakdown-container',
      bigKjv: 'big-kjv',
      verseBody: 'verse-body',
      breakdownRoot: 'verse-breakdown',
      nextStep: 'next-step',
      prayerBlock: 'prayer-block'
    }
  };
})();
