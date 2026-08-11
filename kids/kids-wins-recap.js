/**
 * Local-only "what we did" log for kids — parents read in Family quiet view.
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
    if (entry.q && typeof entry.q === 'string') {
      row.q = String(entry.q).slice(0, 220);
    }
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
      if (it.l) {
        var rec = { type: it.t, text: it.l };
        if (it.q) rec.q = it.q;
        lines.push(rec);
      }
    }
    return lines;
  }

  function defaultQuestionForType(t) {
    if (t === 'story') return 'What is one true thing God showed you in that story?';
    if (t === 'game') return 'What verse or idea stuck with you from playing?';
    if (t === 'goodnight') return 'What do you want to tell Jesus before you sleep?';
    return 'What would you like to thank God for together?';
  }

  function formatTodayForParent() {
    var raw = read();
    var y = todayYmd();
    var out = ['On this device today:'];
    var any = false;
    for (var i = raw.length - 1; i >= 0; i--) {
      var it = raw[i];
      if (!it || !it.at || !it.l) continue;
      var d = new Date(it.at);
      var iy = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
      if (iy !== y) continue;
      any = true;
      out.push('• ' + it.l);
      var qg = it.q || defaultQuestionForType(it.t || '');
      if (qg) {
        out.push('  — Try asking: ' + qg);
      }
    }
    if (!any) {
      return 'Nothing logged on this device yet today — sit together and open a story, game, or coloring page here.';
    }
    return out.join('\n');
  }

  function formatWeekForParent() {
    var raw = read();
    var now = Date.now();
    var weekAgo = now - 7 * 86400000;
    var lines = ['Last 7 days on this device (newest at bottom of each day):'];
    if (!raw.length) {
      return 'No activity log yet — stories and games will add gentle lines here.';
    }
    var byDay = {};
    for (var i = 0; i < raw.length; i++) {
      var it = raw[i];
      if (!it || !it.at || it.at < weekAgo || !it.l) continue;
      var d = new Date(it.at);
      var key = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(it);
    }
    var keys = Object.keys(byDay).sort();
    if (!keys.length) {
      return 'No logged moments in the last 7 days.';
    }
    keys.forEach(function (k) {
      lines.push('— ' + k + ' —');
      byDay[k].forEach(function (e) {
        lines.push('• ' + e.l);
      });
    });
    return lines.join('\n');
  }

  global.tdbKidsActivityLog = {
    log: logActivity,
    getTodaySummaryLines: getTodaySummaryLines,
    formatTodayForParent: formatTodayForParent,
    formatWeekForParent: formatWeekForParent
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
