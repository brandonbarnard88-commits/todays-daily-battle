/**
 * Optional one-question restfulness note on home hero — localStorage only, no analytics.
 */
(function () {
  'use strict';
  var LS_KEY = 'tdb_porch_restfulness_v1';
  var DISMISS_DAYS = 14;

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    } catch (_) {
      return null;
    }
  }

  function writeState(payload) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch (_) {}
  }

  function shouldHide() {
    var st = readState();
    if (!st || !st.answeredAt) return false;
    var age = Date.now() - st.answeredAt;
    return age < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  }

  function init() {
    var root = document.getElementById('tdbPorchRestfulness');
    if (!root || shouldHide()) {
      if (root) root.hidden = true;
      return;
    }
    var thanks = document.getElementById('tdbPorchRestfulnessThanks');
    var buttons = root.querySelectorAll('[data-tdb-rest]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        writeState({ answer: btn.getAttribute('data-tdb-rest') || 'unsure', answeredAt: Date.now() });
        root.querySelector('.tdb-porch-restfulness__choices').hidden = true;
        if (thanks) thanks.hidden = false;
        window.setTimeout(function () {
          root.hidden = true;
        }, 2200);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
