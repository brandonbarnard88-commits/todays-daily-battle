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
  function defaultRelatesTodayLine(year, verseText) {
    var y = typeof year === 'number' && !isNaN(year) ? year : currentYear();
    var hook = sanitize(verseText || '').replace(/\s+/g, ' ').trim();
    if (hook.length > 72) hook = hook.slice(0, 69).replace(/\s+\S*$/, '') + '…';
    if (hook) return 'In ' + y + ', this verse still says: “' + hook.replace(/[.!?]$/, '') + '.”';
    return 'In ' + y + ', this verse still speaks into the hour you are in.';
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

  function normalizeRefKey(ref) {
    return sanitize(ref).replace(/\s+/g, ' ').trim();
  }

  function readerUrlForRef(ref) {
    var r = normalizeRefKey(ref);
    if (!r) return 'reader.html';
    return 'reader.html?ref=' + encodeURIComponent(r);
  }

  /** @param {string} ref @param {number} [limit] */
  function getCuratedCrossRefs(ref, limit) {
    var max = typeof limit === 'number' && limit > 0 ? limit : 5;
    var clean = normalizeRefKey(ref);
    var map =
      typeof globalThis !== 'undefined' && globalThis._tdbCrossRefsRefsMap && typeof globalThis._tdbCrossRefsRefsMap === 'object'
        ? globalThis._tdbCrossRefsRefsMap
        : null;
    var raw = map && clean && Array.isArray(map[clean]) ? map[clean] : [];
    var out = [];
    for (var i = 0; i < raw.length && out.length < max; i++) {
      var x = normalizeRefKey(raw[i]);
      if (x && x !== clean) out.push(x);
    }
    if (!out.length && clean && typeof window !== 'undefined' && typeof window.getRelatedRefsForVerse === 'function') {
      try {
        out = (window.getRelatedRefsForVerse(clean) || []).slice(0, max);
      } catch (eRel) {
        out = [];
      }
    }
    return out;
  }

  /** @param {HTMLElement|null} containerEl @param {string[]} refs */
  function fillCrossRefLinks(containerEl, refs) {
    if (!containerEl) return;
    containerEl.replaceChildren();
    var list = Array.isArray(refs) ? refs : [];
    if (!list.length) return;
    list.forEach(function (r, i) {
      if (i > 0) containerEl.appendChild(document.createTextNode(', '));
      var a = document.createElement('a');
      a.className = 'tdb-dig-deeper__cross-link cross-ref-link';
      a.href = readerUrlForRef(r);
      a.textContent = r;
      containerEl.appendChild(a);
    });
  }

  function heroDigDeeperHasDeepRows() {
    var ids = ['heroVbdRowWho', 'heroVbdRowAud', 'heroVbdRowCtx', 'heroVbdRowYou'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && !el.hidden) return true;
    }
    return false;
  }

  function syncDigDeeperBlockVisibility(detailsEl, cfg) {
    if (!detailsEl) return;
    cfg = cfg || {};
    var hasDeep = false;
    if (typeof cfg.hasDeepRows === 'function') {
      hasDeep = cfg.hasDeepRows();
    } else if (cfg.deepRoot) {
      hasDeep = cfg.deepRoot.childElementCount > 0;
    }
    var hasCross = !!(cfg.crossWrap && !cfg.crossWrap.hidden);
    var hasPlan = !!(cfg.planWrap && !cfg.planWrap.hidden);
    var hasNext = !!(cfg.nextWrap && !cfg.nextWrap.hidden);
    if (hasDeep || hasCross || hasPlan || hasNext) {
      detailsEl.hidden = false;
      detailsEl.removeAttribute('hidden');
    } else {
      detailsEl.hidden = true;
      detailsEl.setAttribute('hidden', '');
    }
  }

  function syncHeroDigDeeperVisibility() {
    syncDigDeeperBlockVisibility(document.getElementById('heroDigDeeper'), {
      hasDeepRows: heroDigDeeperHasDeepRows,
      crossWrap: document.getElementById('heroDigDeeperCross'),
      planWrap: document.getElementById('heroDigDeeperPlan')
    });
  }

  function createDigDeeperSummary(mainText, hintText) {
    var summary = document.createElement('summary');
    summary.className = 'tdb-dig-deeper__summary';
    var main = document.createElement('span');
    main.className = 'tdb-dig-deeper__main';
    main.textContent = mainText || 'More from the Word';
    summary.appendChild(main);
    if (hintText) {
      var hint = document.createElement('span');
      hint.className = 'tdb-dig-deeper__hint';
      hint.textContent = hintText;
      summary.appendChild(hint);
    }
    return summary;
  }

  function createDigDeeperCrossSection() {
    var crossWrap = document.createElement('div');
    crossWrap.className = 'tdb-dig-deeper__cross';
    crossWrap.hidden = true;
    var h4 = document.createElement('h4');
    h4.className = 'tdb-dig-deeper__cross-label';
    h4.textContent = 'See also (KJV)';
    var list = document.createElement('p');
    list.className = 'tdb-dig-deeper__cross-list';
    crossWrap.appendChild(h4);
    crossWrap.appendChild(list);
    return { wrap: crossWrap, list: list };
  }

  function createDigDeeperLinkSection(className, linkClassName) {
    var wrap = document.createElement('p');
    wrap.className = className || 'tdb-dig-deeper__plan';
    wrap.hidden = true;
    var link = document.createElement('a');
    link.className = linkClassName || 'tdb-dig-deeper__plan-link';
    wrap.appendChild(link);
    return { wrap: wrap, link: link };
  }

  function fillCurriculumPlanLink(ref, verseText, planWrap, planLink) {
    if (!planWrap || !planLink) return;
    var build =
      typeof window !== 'undefined' && typeof window.tdbUogBuildCurriculumPlanList === 'function'
        ? window.tdbUogBuildCurriculumPlanList
        : null;
    var rows = build ? build(ref, verseText) || [] : [];
    var row = rows.length ? rows[0] : null;
    if (row && row.href) {
      planLink.href = row.href;
      planLink.textContent = row.label ? 'Continue in ' + row.label + ' \u2192' : 'Continue in this Battle Plan \u2192';
      planWrap.hidden = false;
      planWrap.removeAttribute('hidden');
    } else {
      planWrap.hidden = true;
      planWrap.setAttribute('hidden', '');
    }
  }

  function ensureCrossRefsMapLoaded(then) {
    var done = typeof then === 'function' ? then : function () {};
    if (typeof globalThis !== 'undefined' && globalThis._tdbCrossRefsRefsMap) {
      done();
      return;
    }
    if (typeof window !== 'undefined' && typeof window.ensureCrossRefsLoaded === 'function') {
      window.ensureCrossRefsLoaded().then(done).catch(done);
      return;
    }
    if (typeof fetch !== 'function') {
      done();
      return;
    }
    fetch('cross-refs.json', { credentials: 'same-origin' })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (data && data.refs && typeof globalThis !== 'undefined') {
          globalThis._tdbCrossRefsRefsMap = data.refs;
        }
        done();
      })
      .catch(done);
  }

  /**
   * Shared Dig Deeper hydration for homepage hero, Battle Plan day cards, and Ask the Word results.
   * @param {{ ref?: string, text?: string }} verseData
   * @param {HTMLElement|null} container unused; reserved for future mount helpers
   * @param {object} [options]
   */
  function hydrateDigDeeperBlock(verseData, container, options) {
    options = options || {};
    var ref = normalizeRefKey(verseData && verseData.ref);
    var verseText = verseData && verseData.text ? verseData.text : '';
    var details = options.detailsEl || null;
    if (!details) return;

    var crossWrap = options.crossWrap || null;
    var crossListEl = options.crossListEl || null;
    var planWrap = options.planWrap || null;
    var planLinkEl = options.planLinkEl || null;
    var nextWrap = options.nextWrap || null;
    var nextLinkEl = options.nextLinkEl || null;

    if (options.fillCurriculumPlan && planWrap && planLinkEl) {
      fillCurriculumPlanLink(ref, verseText, planWrap, planLinkEl);
    }

    if (nextWrap && nextLinkEl && options.nextInPlan && options.nextInPlan.href) {
      nextLinkEl.href = options.nextInPlan.href;
      nextLinkEl.textContent = options.nextInPlan.label || 'Next day in this plan \u2192';
      nextWrap.hidden = false;
      nextWrap.removeAttribute('hidden');
    } else if (nextWrap) {
      nextWrap.hidden = true;
      nextWrap.setAttribute('hidden', '');
    }

    var visibilityCfg = {
      deepRoot: options.deepRoot || null,
      hasDeepRows: options.hasDeepRows,
      crossWrap: crossWrap,
      planWrap: planWrap,
      nextWrap: nextWrap
    };

    syncDigDeeperBlockVisibility(details, visibilityCfg);

    if (!ref || !crossWrap || !crossListEl) return;

    ensureCrossRefsMapLoaded(function () {
      var refs = getCuratedCrossRefs(ref, options.crossRefLimit || 5);
      if (refs.length) {
        fillCrossRefLinks(crossListEl, refs);
        crossWrap.hidden = false;
        crossWrap.removeAttribute('hidden');
      } else {
        crossWrap.hidden = true;
        crossWrap.setAttribute('hidden', '');
      }
      syncDigDeeperBlockVisibility(details, visibilityCfg);
    });
  }

  /** Ask the Word search result cards — cross-refs + curriculum plan link; no next-day link. */
  function hydrateAskTheTeacherDigDeeper(verseData, options) {
    return hydrateDigDeeperBlock(verseData, null, Object.assign({ fillCurriculumPlan: true }, options || {}));
  }

  /** @param {string} ref @param {string} [verseText] */
  function hydrateHeroDigDeeper(ref, verseText) {
    hydrateDigDeeperBlock({ ref: ref, text: verseText }, null, {
      detailsEl: document.getElementById('heroDigDeeper'),
      deepRoot: document.getElementById('heroDeepBreakdown'),
      hasDeepRows: heroDigDeeperHasDeepRows,
      crossWrap: document.getElementById('heroDigDeeperCross'),
      crossListEl: document.getElementById('heroDigDeeperCrossList'),
      planWrap: document.getElementById('heroDigDeeperPlan'),
      planLinkEl: document.getElementById('heroDigDeeperPlanLink'),
      fillCurriculumPlan: true
    });
    var legacyWrap = document.getElementById('tdb-hero-curriculum-slot');
    if (legacyWrap) {
      legacyWrap.hidden = true;
      legacyWrap.setAttribute('hidden', '');
    }
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
    normalizeRefKey: normalizeRefKey,
    getCuratedCrossRefs: getCuratedCrossRefs,
    fillCrossRefLinks: fillCrossRefLinks,
    hydrateHeroDigDeeper: hydrateHeroDigDeeper,
    hydrateAskTheTeacherDigDeeper: hydrateAskTheTeacherDigDeeper,
    hydrateDigDeeperBlock: hydrateDigDeeperBlock,
    syncHeroDigDeeperVisibility: syncHeroDigDeeperVisibility,
    syncDigDeeperBlockVisibility: syncDigDeeperBlockVisibility,
    createDigDeeperSummary: createDigDeeperSummary,
    createDigDeeperCrossSection: createDigDeeperCrossSection,
    createDigDeeperLinkSection: createDigDeeperLinkSection,
    CLS: {
      container: 'verse-breakdown-container',
      bigKjv: 'big-kjv',
      verseBody: 'verse-body',
      breakdownRoot: 'verse-breakdown',
      nextStep: 'next-step',
      prayerBlock: 'prayer-block',
      reflection: 'tdb-vb-reflection',
      digDeeper: 'tdb-dig-deeper'
    }
  };
})();
