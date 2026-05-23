/**
 * Calm page — guided breathing (60s / 2min / 5min), device-local, no streaks.
 */
(function () {
  'use strict';

  var KJV_BETWEEN = {
    60: [
      { text: 'Be still, and know that I am God.', ref: 'Psalm 46:10' },
      { text: 'What time I am afraid, I will trust in thee.', ref: 'Psalm 56:3' },
      { text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee.', ref: 'Isaiah 26:3' }
    ],
    120: [
      { text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', ref: 'Matthew 11:28' },
      { text: 'It is of the LORD\u2019S mercies that we are not consumed, because his compassions fail not.', ref: 'Lamentations 3:22' },
      { text: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.', ref: 'Philippians 4:7' },
      { text: 'Cast thy burden upon the LORD, and he shall sustain thee.', ref: 'Psalm 55:22' }
    ],
    300: [
      { text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.', ref: 'Isaiah 40:31' },
      { text: 'The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures.', ref: 'Psalm 23:1\u20132' },
      { text: 'My grace is sufficient for thee: for my strength is made perfect in weakness.', ref: '2 Corinthians 12:9' },
      { text: 'My soul, wait thou only upon God; for my expectation is from him.', ref: 'Psalm 62:5' },
      { text: 'Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself.', ref: 'Matthew 6:34' },
      { text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed.', ref: 'Joshua 1:9' },
      { text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.', ref: 'Psalm 91:1' },
      { text: 'If God be for us, who can be against us?', ref: 'Romans 8:31' }
    ]
  };

  var COMPLETE_COPY = {
    60: 'You did it.<br>Rest here for a moment.',
    120: 'Two quiet minutes.<br>Rest here as long as you need.',
    300: 'Five minutes of steady breath.<br>Rest here\u2014He sees you.'
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function trackCalm(eventName, params) {
    if (typeof window.trackEvent === 'function') {
      window.trackEvent(eventName, params || {});
      return;
    }
    if (typeof gtag === 'function') {
      gtag('event', eventName, params || {});
    }
  }

  function initCalmBreathe() {
    var startBtn = byId('start-breathe');
    var stopBtn = byId('stop-breathe');
    var circle = byId('breathe-circle');
    var text = byId('breathe-text');
    var complete = byId('breathe-complete');
    var completeText = byId('breathe-complete-text');
    var restartBtn = byId('restart-breathe');
    var kjvLine = byId('breathe-kjv-line');
    var progressWrap = byId('breathe-progress-wrap');
    var progressBar = byId('breathe-progress');
    var progressFill = byId('breathe-progress-fill');
    var progressLabel = byId('breathe-progress-label');
    var durationGroup = byId('breathe-duration-pick');
    var pickerWrap = byId('breathe-picker-wrap');
    if (!startBtn || !circle || !text || !complete) return;

    var tickId = null;
    var selectedSec = 60;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var phases = reduceMotion
      ? [
          { label: 'Inhale\u2026', ms: 5200 },
          { label: 'Hold\u2026', ms: 2800 },
          { label: 'Exhale\u2026', ms: 7800 }
        ]
      : [
          { label: 'Inhale\u2026', ms: 4000 },
          { label: 'Hold\u2026', ms: 2000 },
          { label: 'Exhale\u2026', ms: 6000 }
        ];
    var cycleMs = phases.reduce(function (a, p) { return a + p.ms; }, 0);

    function totalMsFor(sec) {
      if (!reduceMotion) return sec * 1000;
      if (sec === 60) return 72000;
      if (sec === 120) return 144000;
      return 360000;
    }

    function kjvIntervalFor(sec) {
      return sec >= 300 ? 2 : 1;
    }

    function phaseLabelAt(elapsedMs) {
      var t = elapsedMs % cycleMs;
      var acc = 0;
      for (var i = 0; i < phases.length; i++) {
        acc += phases[i].ms;
        if (t < acc) return phases[i].label;
      }
      return phases[phases.length - 1].label;
    }

    function formatTimeLeft(ms) {
      var sec = Math.max(0, Math.ceil(ms / 1000));
      if (sec >= 60) {
        var min = Math.floor(sec / 60);
        var rem = sec % 60;
        if (rem === 0) return min + (min === 1 ? ' minute left' : ' minutes left');
        return min + ' min ' + rem + ' s left';
      }
      return sec + (sec === 1 ? ' second left' : ' seconds left');
    }

    function setSelectedDuration(sec) {
      selectedSec = sec;
      if (!durationGroup) return;
      var buttons = durationGroup.querySelectorAll('[data-breathe-sec]');
      buttons.forEach(function (btn) {
        var on = Number(btn.getAttribute('data-breathe-sec')) === sec;
        btn.classList.toggle('is-selected', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      startBtn.setAttribute(
        'aria-label',
        'Start ' + (sec === 60 ? '60-second' : sec === 120 ? '2-minute' : '5-minute') + ' guided breathing exercise'
      );
    }

    function hideKjv() {
      if (!kjvLine) return;
      kjvLine.classList.add('hidden');
      kjvLine.textContent = '';
    }

    function showKjv(phrase) {
      if (!kjvLine || !phrase) return;
      kjvLine.textContent = '';
      var span = document.createElement('span');
      span.className = 'breathe-kjv-text';
      span.textContent = '\u201C' + phrase.text + '\u201D';
      var cite = document.createElement('cite');
      cite.className = 'breathe-kjv-ref';
      cite.textContent = phrase.ref + ' (KJV)';
      kjvLine.appendChild(span);
      kjvLine.appendChild(document.createTextNode(' '));
      kjvLine.appendChild(cite);
      kjvLine.classList.remove('hidden');
    }

    function setProgress(elapsed, total) {
      if (!progressWrap || !progressFill || !progressBar) return;
      var pct = total > 0 ? Math.min(100, Math.round((elapsed / total) * 100)) : 0;
      progressFill.style.width = pct + '%';
      progressBar.setAttribute('aria-valuenow', String(pct));
      if (progressLabel) {
        progressLabel.textContent = formatTimeLeft(total - elapsed);
      }
    }

    function stopBreathe() {
      if (tickId != null) {
        clearInterval(tickId);
        tickId = null;
      }
    }

    function resetToPicker() {
      stopBreathe();
      circle.classList.add('hidden');
      circle.setAttribute('aria-hidden', 'true');
      complete.classList.add('hidden');
      if (progressWrap) {
        progressWrap.classList.add('hidden');
        progressWrap.setAttribute('aria-hidden', 'true');
      }
      hideKjv();
      text.textContent = 'Inhale\u2026';
      if (pickerWrap) pickerWrap.classList.remove('hidden');
      startBtn.classList.remove('hidden');
      if (stopBtn) stopBtn.classList.add('hidden');
      if (durationGroup) durationGroup.removeAttribute('hidden');
    }

    function finishSession(totalMs) {
      stopBreathe();
      circle.classList.add('hidden');
      circle.setAttribute('aria-hidden', 'true');
      if (progressWrap) {
        progressWrap.classList.add('hidden');
        progressWrap.setAttribute('aria-hidden', 'true');
      }
      hideKjv();
      if (stopBtn) stopBtn.classList.add('hidden');
      if (completeText) {
        completeText.innerHTML = COMPLETE_COPY[selectedSec] || COMPLETE_COPY[60];
      }
      complete.classList.remove('hidden');
      trackCalm('calm_breathe_complete', { duration_sec: selectedSec });
    }

    function startBreathing() {
      stopBreathe();
      var totalMs = totalMsFor(selectedSec);
      var pool = KJV_BETWEEN[selectedSec] || KJV_BETWEEN[60];
      var kjvEvery = kjvIntervalFor(selectedSec);
      var lastCycle = -1;
      var lastLabel = '';

      if (pickerWrap) pickerWrap.classList.add('hidden');
      startBtn.classList.add('hidden');
      if (durationGroup) durationGroup.setAttribute('hidden', '');
      if (stopBtn) stopBtn.classList.remove('hidden');
      circle.classList.remove('hidden');
      circle.setAttribute('aria-hidden', 'false');
      complete.classList.add('hidden');
      hideKjv();
      if (progressWrap) {
        progressWrap.classList.remove('hidden');
        progressWrap.setAttribute('aria-hidden', 'false');
      }
      setProgress(0, totalMs);

      var startTime = Date.now();

      function tick() {
        var elapsed = Date.now() - startTime;
        if (elapsed >= totalMs) {
          finishSession(totalMs);
          return;
        }
        var cycleIndex = Math.floor(elapsed / cycleMs);
        if (cycleIndex !== lastCycle) {
          if (cycleIndex >= 1 && cycleIndex % kjvEvery === 0) {
            var phraseIndex = Math.floor(cycleIndex / kjvEvery) - 1;
            showKjv(pool[phraseIndex % pool.length]);
          }
          lastCycle = cycleIndex;
        }
        var label = phaseLabelAt(elapsed);
        if (label !== lastLabel) {
          lastLabel = label;
          text.textContent = label;
        }
        setProgress(elapsed, totalMs);
      }

      tick();
      tickId = setInterval(tick, 200);
      trackCalm('calm_breathe_start', { duration_sec: selectedSec });
    }

    if (durationGroup) {
      durationGroup.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-breathe-sec]');
        if (!btn || tickId != null) return;
        setSelectedDuration(Number(btn.getAttribute('data-breathe-sec')) || 60);
      });
    }

    startBtn.addEventListener('click', startBreathing);
    if (stopBtn) {
      stopBtn.addEventListener('click', resetToPicker);
    }
    if (restartBtn) {
      restartBtn.addEventListener('click', function () {
        complete.classList.add('hidden');
        if (pickerWrap) pickerWrap.classList.remove('hidden');
        startBtn.classList.remove('hidden');
        if (durationGroup) durationGroup.removeAttribute('hidden');
        text.textContent = 'Inhale\u2026';
      });
    }

    setSelectedDuration(60);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalmBreathe);
  } else {
    initCalmBreathe();
  }
})();
