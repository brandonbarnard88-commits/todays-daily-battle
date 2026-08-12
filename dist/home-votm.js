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
        btn.title = 'Listen is not open in this browser. The verse on the page is still here.';
        var ic = btn.querySelector('.tdb-votm-read-aloud__ic');
        var lbl = btn.querySelector('.tdb-votm-read-aloud__label');
        if (ic) ic.setAttribute('hidden', '');
        if (lbl) lbl.textContent = 'Listen not open here';
        else btn.textContent = 'Listen not open here';
      } else {
        var votmIdleAria = 'Listen to this month\u2019s KJV memory verse with your device speakers';
        var votmStopAria = 'Stop reading this month\u2019s KJV memory verse';
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', function () {
          var T = window.TDB_memoryVerses;
          if (!T || !window.speechSynthesis) return;
          if (btn.getAttribute('aria-pressed') === 'true') {
            try {
              window.speechSynthesis.cancel();
            } catch (eCancel) {}
            btn.setAttribute('aria-pressed', 'false');
            btn.setAttribute('aria-label', votmIdleAria);
            return;
          }
          var m = T.getMonthlyForDate(new Date());
          if (!m) return;
          try {
            window.speechSynthesis.cancel();
          } catch (e) {}
          var u = new SpeechSynthesisUtterance(m.ref + ' (KJV). ' + m.text);
          u.rate = 0.9;
          u.onstart = function () {
            btn.setAttribute('aria-pressed', 'true');
            btn.setAttribute('aria-label', votmStopAria);
          };
          u.onend = function () {
            btn.setAttribute('aria-pressed', 'false');
            btn.setAttribute('aria-label', votmIdleAria);
          };
          u.onerror = function () {
            btn.setAttribute('aria-pressed', 'false');
            btn.setAttribute('aria-label', votmIdleAria);
          };
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
