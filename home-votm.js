/**
 * Homepage — verse-of-the-month listen control + mobile memory jump pill.
 * Depends on memory-verses.js (same page, defer order).
 */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function () {
    var btn = document.getElementById('tdb-votm-read-aloud');
    if (btn) {
      if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
        btn.title = 'Read-aloud is not available in this browser.';
        btn.textContent = 'Read aloud unavailable';
      } else {
        btn.addEventListener('click', function () {
          var T = window.TDB_memoryVerses;
          if (!T || !window.speechSynthesis) return;
          var m = T.getMonthlyForDate(new Date());
          if (!m) return;
          try {
            window.speechSynthesis.cancel();
          } catch (e) {}
          var u = new SpeechSynthesisUtterance(m.ref + ' (KJV). ' + m.text);
          u.rate = 0.9;
          window.speechSynthesis.speak(u);
          try {
            if (typeof window.trackEvent === 'function') {
              window.trackEvent('home_votm_listen', { month_index: m.month });
            }
          } catch (e2) {}
        });
      }
    }

    var pill = document.getElementById('tdb-float-memory-pill');
    if (!pill) return;

    function tick() {
      var wide = window.matchMedia('(min-width: 769px)').matches;
      if (wide) {
        pill.hidden = true;
        return;
      }
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      pill.hidden = y < 220;
    }

    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
  });
})();
