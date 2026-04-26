/**
 * Play Zone: weekly KJV line from __TDB_KIDS_VERSES_365, story progress, trigger buttons.
 * Depends on kids-verses-365.js for verse list; story math may use tdbComputeStoryMasterState (kids-corner.js).
 */
(function () {
  'use strict';

  var LIB_KEY = 'kidsLibraryStoryMasterProgress';
  var SEED = [
    { ref: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.' },
    { ref: 'Matthew 19:14', text: 'Suffer the little children to come unto me.' },
    { ref: 'Joshua 1:9', text: 'Be strong and of a good courage; be not afraid.' }
  ];

  function dayOfYear(d) {
    var start = new Date(d.getFullYear(), 0, 0);
    var diff = d - start;
    return Math.floor(diff / 86400000);
  }

  function pickWeeklyVerse() {
    var list = (typeof globalThis !== 'undefined' && globalThis.__TDB_KIDS_VERSES_365) ? globalThis.__TDB_KIDS_VERSES_365 : null;
    if (list && list.length) {
      var doy = dayOfYear(new Date());
      var idx = Math.floor(doy / 7) % list.length;
      return list[idx];
    }
    return SEED[dayOfYear(new Date()) % SEED.length];
  }

  function getProgress() {
    if (typeof globalThis.tdbComputeStoryMasterState === 'function') {
      var st = globalThis.tdbComputeStoryMasterState();
      if (st) {
        return {
          value: Math.min(st.total, st.effective),
          max: st.total,
          pct: st.pct,
          tier: st.tierLabel || ''
        };
      }
    }
    try {
      var raw = globalThis.localStorage.getItem(LIB_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      var n = Array.isArray(arr) ? arr.length : 0;
      var max = 307;
      return {
        value: Math.min(n, max),
        max: max,
        pct: Math.min(100, Math.round(100 * Math.min(n, max) / max)),
        tier: ''
      };
    } catch (e) {
      return { value: 0, max: 307, pct: 0, tier: '' };
    }
  }

  function fillWeeklyVerse() {
    var lineEl = document.getElementById('kids-weekly-verse-line');
    var refEl = document.getElementById('kids-weekly-verse-ref');
    if (!lineEl || !refEl) return;
    var v = pickWeeklyVerse();
    lineEl.textContent = v && v.text ? v.text : '';
    refEl.textContent = v && v.ref ? 'KJV — ' + v.ref : '';
  }

  function fillProgress() {
    var bar = document.getElementById('kids-play-progress-bar');
    var pct = document.getElementById('kids-play-progress-pct');
    var tier = document.getElementById('kids-play-tier-pill');
    if (!bar) return;
    var p = getProgress();
    bar.max = p.max;
    bar.value = p.value;
    bar.setAttribute('aria-valuemax', String(p.max));
    bar.setAttribute('aria-valuenow', String(p.value));
    bar.setAttribute('aria-label', 'Stories explored: ' + p.value + ' of ' + p.max);
    if (pct) pct.textContent = p.pct + '%';
    if (tier) {
      if (p.tier) {
        tier.textContent = p.tier;
        tier.classList.remove('hidden');
        tier.setAttribute('aria-hidden', 'false');
      } else {
        tier.textContent = '';
        tier.classList.add('hidden');
        tier.setAttribute('aria-hidden', 'true');
      }
    }
  }

  function wireButtons(root) {
    var randomBtn = document.getElementById('kids-play-zone-random');
    if (randomBtn) {
      randomBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById('kids-library-random-btn');
        if (target) target.click();
        else {
          globalThis.location.href = 'corner.html?random=1';
        }
      });
    }
    var journeyBtn = document.getElementById('kids-play-zone-journey');
    if (journeyBtn) {
      journeyBtn.addEventListener('click', function () {
        var j = document.getElementById('kids-journey-start-btn') || document.getElementById('kids-journey-continue-btn');
        if (j) {
          j.click();
          var grid = document.getElementById('kids-library-grid');
          if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          globalThis.location.href = 'corner.html?journey=1';
        }
      });
    }
  }

  function run() {
    fillWeeklyVerse();
    fillProgress();
    wireButtons(document);
  }

  function schedule() {
    run();
    setTimeout(run, 80);
    setTimeout(run, 400);
    setTimeout(run, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
})();
