/**
 * Another verse — tap only. Today’s official KJV stays on the card above.
 * Picks a different complete queue verse. Does not shuffle on reload.
 */
(function () {
  'use strict';

  var EPOCH = Date.UTC(2026, 0, 1);
  var seen = [];

  function $(id) {
    return document.getElementById(id);
  }

  function norm(ref) {
    return String(ref || '')
      .replace(/\s*\(KJV\)\s*$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function leftover(s) {
    var t = String(s || '').toLowerCase();
    return (
      /in 2026/.test(t) ||
      /this verse still says/.test(t) ||
      /platforms make people look tall/.test(t) ||
      /praise feels too public/.test(t) ||
      /screen look taller/.test(t)
    );
  }

  function officialToday(arr) {
    if (!arr || !arr.length) return null;
    var d = new Date();
    var todayUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    var days = Math.floor((todayUtc - EPOCH) / 86400000);
    var idx = ((days % arr.length) + arr.length) % arr.length;
    return arr[idx] || null;
  }

  function pickOther(arr, todayRef) {
    if (!arr || arr.length < 2) return null;
    var want = norm(todayRef);
    var pool = [];
    var i;
    for (i = 0; i < arr.length; i++) {
      var row = arr[i];
      if (!row || !row.ref || !row.text) continue;
      var r = norm(row.ref);
      if (!r || r === want) continue;
      if (seen.indexOf(r) !== -1) continue;
      pool.push(row);
    }
    if (!pool.length) {
      seen = [];
      for (i = 0; i < arr.length; i++) {
        if (arr[i] && norm(arr[i].ref) && norm(arr[i].ref) !== want) pool.push(arr[i]);
      }
    }
    if (!pool.length) return null;
    var pick = pool[Math.floor(Math.random() * pool.length)];
    seen.push(norm(pick.ref));
    if (seen.length > 24) seen.shift();
    return pick;
  }

  function explain(ref) {
    var list = window.__TDB_HERO_DAILY_EXPLANATIONS;
    var want = norm(ref);
    if (!list || !list.length || !want) return null;
    var i;
    for (i = 0; i < list.length; i++) {
      if (norm(list[i].ref) === want) return list[i];
    }
    return null;
  }

  function setText(el, value) {
    if (!el) return;
    el.textContent = value || '';
  }

  function paint(verse) {
    var desk = $('tdbAnotherVerseDesk');
    var refEl = $('tdbAnotherVerseRef');
    var textEl = $('tdbAnotherVerseText');
    var sitEl = $('tdbAnotherVerseSit');
    var meanEl = $('tdbAnotherVerseMean');
    var sitWrap = $('tdbAnotherVerseSitWrap');
    var meanWrap = $('tdbAnotherVerseMeanWrap');
    var bbe = $('tdbAnotherVerseBbe');
    if (!desk || !verse) return;
    var ref = norm(verse.ref);
    var text = String(verse.text || '').replace(/\s+/g, ' ').trim();
    setText(refEl, ref + ' (KJV)');
    if (textEl) {
      while (textEl.firstChild) textEl.removeChild(textEl.firstChild);
      if (window.TDBRedLetter && typeof window.TDBRedLetter.applyToElement === 'function') {
        window.TDBRedLetter.applyToElement(textEl, ref, text, { quote: true });
      } else {
        textEl.textContent = '\u201c' + text + '\u201d';
      }
    }
    var ex = explain(ref);
    var sit = ex && !leftover(ex.setting) ? String(ex.setting || '').trim() : '';
    var mean = ex && !leftover(ex.plain) ? String(ex.plain || '').trim() : '';
    if (!sit) sit = 'The verse: ' + text;
    if (sitWrap) sitWrap.hidden = !sit;
    if (meanWrap) meanWrap.hidden = !mean;
    setText(sitEl, sit);
    setText(meanEl, mean);
    desk.hidden = false;
    desk.setAttribute('data-tdb-bound-ref', ref);
    if (bbe) {
      bbe.hidden = false;
      bbe.setAttribute('data-bbe-ref', ref);
      var body = bbe.querySelector('.tdb-bbe-simple__body') || bbe;
      if (window.TDBBbeSimple && typeof window.TDBBbeSimple.fillHost === 'function') {
        window.TDBBbeSimple.fillHost(body, ref);
      }
    }
    try {
      desk.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) {}
  }

  function ensureYear() {
    if (window.__TDB_HERO_DAILY_YEAR && window.__TDB_HERO_DAILY_YEAR.length) {
      return Promise.resolve(window.__TDB_HERO_DAILY_YEAR);
    }
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = '/hero-daily-365-data.js?v=20260820-heb';
      s.onload = function () {
        resolve(window.__TDB_HERO_DAILY_YEAR || []);
      };
      s.onerror = function () {
        resolve([]);
      };
      document.head.appendChild(s);
    });
  }

  function ensureExplain() {
    if (window.__TDB_HERO_DAILY_EXPLANATIONS) return Promise.resolve();
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = '/hero-daily-365-explanations.js?v=20260831desk79';
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        resolve();
      };
      document.head.appendChild(s);
    });
  }

  function onTap() {
    var btn = $('tdbAnotherVerseBtn');
    if (btn) btn.disabled = true;
    Promise.all([ensureYear(), ensureExplain()])
      .then(function (pack) {
        var arr = pack[0];
        var today = officialToday(arr);
        var other = pickOther(arr, today && today.ref);
        if (other) paint(other);
      })
      .then(function () {
        if (btn) btn.disabled = false;
      })
      .catch(function () {
        if (btn) btn.disabled = false;
      });
  }

  function init() {
    var btn = $('tdbAnotherVerseBtn');
    if (!btn) return;
    btn.addEventListener('click', onTap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
