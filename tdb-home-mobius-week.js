/**
 * Homepage line: "My loops this week" — reads same local storage as mobius-universal.js
 * (mobiusLoops_YYYY-MM-DD Sunday week key + mobiusLoops_engaged_v1 after first loop).
 */
(function () {
  'use strict';

  var PREFIX = 'mobiusLoops_';
  var ENGAGED = 'mobiusLoops_engaged_v1';

  /** Must match mobius-universal.js getWeekKey (Sunday-start week bucket). */
  function getWeekKey() {
    var d = new Date();
    var day = d.getDay();
    var diff = d.getDate() - day;
    var sunday = new Date(d.getFullYear(), d.getMonth(), diff);
    var y = sunday.getFullYear();
    var m = String(sunday.getMonth() + 1).padStart(2, '0');
    var dayNum = String(sunday.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + dayNum;
  }

  function readWeekCount() {
    try {
      return parseInt(localStorage.getItem(PREFIX + getWeekKey()) || '0', 10);
    } catch (e) {
      return 0;
    }
  }

  function isEngaged() {
    try {
      if (localStorage.getItem(ENGAGED) === '1') return true;
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0 && parseInt(localStorage.getItem(k) || '0', 10) > 0) {
          localStorage.setItem(ENGAGED, '1');
          return true;
        }
      }
    } catch (e2) {}
    return false;
  }

  function render() {
    var el = document.getElementById('tdbHomeMobiusWeek');
    if (!el) return;
    var n = readWeekCount();
    var engaged = isEngaged();
    if (!engaged || n < 1) {
      el.hidden = true;
      while (el.firstChild) el.removeChild(el.firstChild);
      return;
    }
    el.hidden = false;
    while (el.firstChild) el.removeChild(el.firstChild);
    var msg =
      n === 1
        ? 'My loops this week: 1 quiet pass on the Möbius ribbon.'
        : 'My loops this week: ' + n + ' quiet passes on the Möbius ribbon.';
    el.appendChild(document.createTextNode(msg + ' '));
    var a = document.createElement('a');
    a.href = 'mobius.html';
    a.setAttribute('aria-label', 'Open the Möbius Loop');
    a.textContent = 'Open the loop';
    el.appendChild(a);
    el.appendChild(document.createTextNode('.'));
  }

  function wire() {
    render();
    try {
      document.addEventListener('mobius-streak-updated', function () {
        render();
      });
    } catch (e3) {}
    window.addEventListener('storage', function (ev) {
      if (!ev || (ev.key !== ENGAGED && (ev.key || '').indexOf(PREFIX) !== 0)) return;
      render();
    });
    window.addEventListener('pageshow', function () {
      render();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  window.TDB_refreshHomeMobiusWeekLine = render;
})();
