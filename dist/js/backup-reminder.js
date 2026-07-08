/**
 * Gentle backup reminder — shows only on visits 2–4, counted once per calendar day.
 * Exports everything in localStorage to JSON. No upload. No account. No pressure.
 */
(function () {
  'use strict';

  var SEEN_KEY = 'tDB_backupReminderSeen';
  var VISITS_KEY = 'tDB_porchVisits';
  var LAST_DAY_KEY = 'tDB_porchVisitsLastDay';

  function todayYmd() {
    return new Date().toISOString().slice(0, 10);
  }

  function bumpVisitOncePerDay() {
    var today = todayYmd();
    if (localStorage.getItem(LAST_DAY_KEY) === today) {
      return parseInt(localStorage.getItem(VISITS_KEY) || '0', 10) || 0;
    }
    localStorage.setItem(LAST_DAY_KEY, today);
    var n = (parseInt(localStorage.getItem(VISITS_KEY) || '0', 10) || 0) + 1;
    localStorage.setItem(VISITS_KEY, String(n));
    return n;
  }

  function exportBackup() {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key) data[key] = localStorage.getItem(key);
    }
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'todays-daily-battle-backup-' + todayYmd() + '.json';
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);

    localStorage.setItem(SEEN_KEY, 'true');
    dismiss();
  }

  function dismiss() {
    var banner = document.getElementById('backup-reminder');
    if (banner) banner.hidden = true;
    localStorage.setItem(SEEN_KEY, 'true');
  }

  function maybeShow() {
    if (localStorage.getItem(SEEN_KEY)) return;
    var visits = bumpVisitOncePerDay();
    if (visits < 2 || visits > 4) return;
    var banner = document.getElementById('backup-reminder');
    if (banner) banner.hidden = false;
  }

  document.addEventListener('DOMContentLoaded', function () {
    maybeShow();
    var exportBtn = document.getElementById('backup-export-btn');
    var dismissBtn = document.getElementById('backup-dismiss-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportBackup);
    if (dismissBtn) dismissBtn.addEventListener('click', dismiss);
  });
})();
