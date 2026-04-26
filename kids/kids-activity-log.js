/**
 * Local-only "what we did" log for kids — parents read in Parent Dashboard.
 * No network; RLS N/A. Max ~24 entries, rolling.
 */
(function (global) {
  'use strict';
  var KEY = 'tdbKidsActivityLogV1';
  var MAX = 24;

  function read() {
    try {
      var raw = global.localStorage.getItem(KEY);
      if (!raw) return [];
      var a = JSON.parse(raw);
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function write(arr) {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(arr));
    } catch (e) { /* no-op */ }
  }

  function logActivity(entry) {
    if (!entry || typeof entry !== 'object') return;
    var t = String(entry.type || 'visit').slice(0, 40);
    var label = String(entry.label || '').slice(0, 200);
    if (!label) return;
    var row = { t: t, l: label, at: entry.at && typeof entry.at === 'number' ? entry.at : Date.now() };
    var a = read();
    a.push(row);
    if (a.length > MAX) a = a.slice(a.length - MAX);
    write(a);
  }

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function todayYmd() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function getTodaySummaryLines() {
    var y = todayYmd();
    var a = read();
    var lines = [];
    for (var i = a.length - 1; i >= 0; i--) {
      var it = a[i];
      if (!it || !it.at) continue;
      var d = new Date(it.at);
      var iy = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
      if (iy !== y) continue;
      if (it.l) lines.push({ type: it.t, text: it.l });
    }
    return lines;
  }

  function formatTodayForParent() {
    var lines = getTodaySummaryLines();
    if (!lines.length) return 'Nothing logged on this device yet today — sit together and open a story, game, or coloring page here.';
    var out = ['On this device today:'];
    for (var j = 0; j < lines.length; j++) {
      out.push('• ' + lines[j].text);
    }
    return out.join('\n');
  }

  global.tdbKidsActivityLog = {
    log: logActivity,
    getTodaySummaryLines: getTodaySummaryLines,
    formatTodayForParent: formatTodayForParent
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
