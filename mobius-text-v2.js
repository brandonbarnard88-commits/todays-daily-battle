/**
 * Möbius Text Mode 2.0 — guided breathing, KJV anchor repetition (2 Timothy 1:7),
 * device-local only. Legacy line meditation remains in mobius.html (details).
 */
(function () {
  'use strict';

  var KJV_2TIM =
    'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.';
  var STUDY_KEY = 'tdb_my_study_v1';
  var BREATH_ROUNDS = 3;
  var INHALE_MS = 4000;
  var HOLD_MS = 2000;
  var EXHALE_MS = 6000;
  var VERSE_AUTO_MS = 5200;

  function $(id) {
    return document.getElementById(id);
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function setVisible(el, on) {
    if (!el) return;
    if (on) el.removeAttribute('hidden');
    else el.setAttribute('hidden', '');
  }

  function getRepCount() {
    var sel = $('mobius-v2-rep-count');
    if (!sel) return 16;
    var n = parseInt(sel.value, 10);
    if (n === 12 || n === 16 || n === 20) return n;
    return 16;
  }

  function setPhaseLabel(phaseLabel, title, sub) {
    if (!phaseLabel) return;
    phaseLabel.textContent = title;
    var subEl = $('mobius-v2-phase-sub');
    if (subEl) subEl.textContent = sub || '';
  }

  function runPhase(title, totalMs, phaseLabel, sub, countdownEl) {
    setPhaseLabel(phaseLabel, title, sub);
    return new Promise(function (resolve) {
      var end = Date.now() + totalMs;
      var iv = setInterval(function () {
        var left = Math.max(0, end - Date.now());
        if (countdownEl) countdownEl.textContent = left > 0 ? Math.ceil(left / 1000) + 's' : '';
        if (left <= 0) {
          clearInterval(iv);
          if (countdownEl) countdownEl.textContent = '';
          resolve();
        }
      }, 120);
    });
  }

  function runBreathingRound(round, phaseLabel, countdownEl, reduced) {
    var inh = reduced ? Math.min(INHALE_MS, 2500) : INHALE_MS;
    var hold = reduced ? Math.min(HOLD_MS, 1200) : HOLD_MS;
    var exh = reduced ? Math.min(EXHALE_MS, 3500) : EXHALE_MS;
    var sub = 'Round ' + round + ' of ' + BREATH_ROUNDS;
    return runPhase('Inhale — this battle is real', inh, phaseLabel, sub, countdownEl)
      .then(function () {
        return runPhase('Hold — name the weight honestly', hold, phaseLabel, sub, countdownEl);
      })
      .then(function () {
        return runPhase('Exhale — same ribbon. Same God.', exh, phaseLabel, sub, countdownEl);
      });
  }

  function runAllBreathing(phaseLabel, countdownEl, reduced) {
    var chain = Promise.resolve();
    for (var r = 1; r <= BREATH_ROUNDS; r++) {
      (function (round) {
        chain = chain.then(function () {
          return runBreathingRound(round, phaseLabel, countdownEl, reduced);
        });
      })(r);
    }
    return chain;
  }

  function runVerseReps(n, verseEl, counterEl, repHint, reduced) {
    var delay = reduced ? Math.min(VERSE_AUTO_MS, 3500) : VERSE_AUTO_MS;
    var chain = Promise.resolve();
    for (var i = 1; i <= n; i++) {
      (function (rep) {
        chain = chain.then(function () {
          if (verseEl) verseEl.textContent = KJV_2TIM;
          if (counterEl) counterEl.textContent = 'Repetition ' + rep + ' of ' + n;
          if (repHint) {
            repHint.textContent =
              'Speak quietly or read along. Tap “Next verse” to move sooner, or wait.';
          }
          return new Promise(function (resolve) {
            var tid = setTimeout(resolve, delay);
            var nextBtn = $('mobius-v2-verse-next');
            function once() {
              clearTimeout(tid);
              if (nextBtn) nextBtn.removeEventListener('click', once);
              resolve();
            }
            if (nextBtn) nextBtn.addEventListener('click', once, { once: true });
          });
        });
      })(i);
    }
    return chain;
  }

  function appendMobiusSessionToMyStudy(text) {
    var raw = localStorage.getItem(STUDY_KEY);
    var study;
    try {
      study = raw ? JSON.parse(raw) : null;
    } catch (e) {
      study = null;
    }
    if (!study || typeof study !== 'object') {
      study = {
        verseRef: '',
        verseText: '',
        notes: '',
        prayer: '',
        showName: false,
        displayName: '',
      };
    }
    var block = '\n\n—— Möbius Loop —— ' + new Date().toLocaleString() + '\n' + String(text || '');
    study.notes = (study.notes || '') + block;
    try {
      localStorage.setItem(STUDY_KEY, JSON.stringify(study));
    } catch (e) {}
  }
  window.TDB_appendMobiusSessionToMyStudy = appendMobiusSessionToMyStudy;

  function setDoneFearFaithLink() {
    var a = $('mobius-v2-done-ff-link');
    if (!a) return;
    var pr = 0;
    try {
      pr = parseInt(localStorage.getItem('tdb-plan-fearfaith-day') || '0', 10);
    } catch (e) {}
    if (pr >= 7) {
      a.setAttribute('href', 'plans.html?plan=fearfaith');
    } else if (pr <= 0) {
      a.setAttribute('href', 'plans.html?plan=fearfaith&day=1');
    } else {
      a.setAttribute('href', 'plans.html?plan=fearfaith&day=' + String(Math.min(pr + 1, 7)));
    }
  }

  function finishSession(doneEl, startBtn, repCount) {
    setVisible($('mobius-v2-breathe'), false);
    setVisible($('mobius-v2-verse'), false);
    setVisible(doneEl, true);
    if (startBtn) startBtn.removeAttribute('hidden');

    try {
      if (typeof window.bumpMobiusLoopStreak === 'function') window.bumpMobiusLoopStreak();
      if (typeof window.updateMobiusRibbonDot === 'function') window.updateMobiusRibbonDot();
    } catch (e) {}

    var summary =
      'Möbius Loop — calm path\n' +
      new Date().toLocaleString() +
      '\n\n' +
      KJV_2TIM +
      '\n— 2 Timothy 1:7 KJV\n\n' +
      'Breathing rounds: ' +
      BREATH_ROUNDS +
      '\nVerse repetitions: ' +
      repCount;
    var pre = $('mobius-v2-session-text');
    if (pre) pre.textContent = summary;

    setDoneFearFaithLink();

    var saveStatus = $('mobius-v2-save-status');
    if (saveStatus) {
      saveStatus.textContent = '';
      saveStatus.hidden = true;
    }

    try {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent('mobius_text_v2_complete');
      }
    } catch (e) {}
  }

  function init() {
    var start = $('mobius-v2-start');
    var breathe = $('mobius-v2-breathe');
    var verse = $('mobius-v2-verse');
    var done = $('mobius-v2-done');
    var phaseLabel = $('mobius-v2-phase-label');
    var countdownEl = $('mobius-v2-countdown');
    var verseText = $('mobius-v2-verse-text');
    var repCounter = $('mobius-v2-rep-counter');
    var repHint = $('mobius-v2-rep-hint');
    var copyBtn = $('mobius-v2-copy-summary');
    var printBtn = $('mobius-v2-print');
    var saveStudyBtn = $('mobius-v2-save-mystudy');

    if (!start) return;

    start.addEventListener('click', function () {
      var repCount = getRepCount();
      start.setAttribute('hidden', '');
      setVisible(done, false);
      setVisible(breathe, true);
      setVisible(verse, false);

      var reduced = prefersReducedMotion();

      runAllBreathing(phaseLabel, countdownEl, reduced)
        .then(function () {
          setVisible(breathe, false);
          setVisible(verse, true);
          return runVerseReps(repCount, verseText, repCounter, repHint, reduced);
        })
        .then(function () {
          finishSession(done, start, repCount);
        })
        .catch(function (e) {
          if (typeof console !== 'undefined' && console.warn) console.warn('mobius-text-v2', e);
          setVisible(breathe, false);
          setVisible(verse, false);
          start.removeAttribute('hidden');
        });
    });

    if (saveStudyBtn) {
      saveStudyBtn.addEventListener('click', function () {
        var pre = $('mobius-v2-session-text');
        var t = pre ? pre.textContent : '';
        if (!t) return;
        appendMobiusSessionToMyStudy(t);
        var st = $('mobius-v2-save-status');
        if (st) {
          st.hidden = false;
          st.textContent = 'Saved to My Study on this device. Open Study to see your notes.';
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var pre = $('mobius-v2-session-text');
        var t = pre ? pre.textContent : '';
        if (!t) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(t).catch(function () {});
        }
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', function () {
        var pre = $('mobius-v2-session-text');
        if (!pre || !pre.textContent) return;
        var w = window.open('', '_blank');
        if (!w) return;
        var d = w.document;
        var dt = d.createElement('title');
        dt.textContent = 'Möbius session';
        var meta = d.createElement('meta');
        meta.setAttribute('charset', 'utf-8');
        var bodyPre = d.createElement('pre');
        bodyPre.style.cssText = 'font-family:system-ui,sans-serif;white-space:pre-wrap;padding:1rem;';
        bodyPre.textContent = pre.textContent;
        d.head.appendChild(meta);
        d.head.appendChild(dt);
        d.body.appendChild(bodyPre);
        w.focus();
        w.print();
        w.close();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
