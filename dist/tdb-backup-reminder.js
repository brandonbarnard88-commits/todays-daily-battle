/**
 * Site-wide gentle backup reminder — device-only notes, verses, and plan marks.
 * Shares snooze/last-export keys with My Study (mystudy.js).
 */
(function () {
  'use strict';

  var SNOOZE_KEY = 'tdb_mystudy_backup_snooze_until_ms';
  var LAST_BACKUP_KEY = 'tdb_mystudy_last_backup_ms';
  var SEEN_KEY = 'tdb_site_backup_banner_seen_v1';
  var RETURNING_KEY = 'has_visited_porch';

  function lsGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function lsSet(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  }

  function pathBase() {
    try {
      var p = String(window.location.pathname || '/');
      return p.split('/').pop() || 'index.html';
    } catch (e) {
      return '';
    }
  }

  function shouldSkipPage() {
    var p = String(window.location.pathname || '');
    if (/\/kids\//i.test(p) || /^\/kids\/?$/i.test(p)) return true;
    if (/\/admin/i.test(p) || /404-admin/i.test(p)) return true;
    if (/\/embed\//i.test(p)) return true;
    if (/mystudy\.html$/i.test(pathBase())) return true;
    return false;
  }

  function parseJson(raw) {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function hasPlanMarks() {
    try {
      var i;
      for (i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && /^tdb-plan-.+-day$/i.test(k)) {
          var v = localStorage.getItem(k);
          if (v && String(v).trim() && String(v) !== '0') return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function hasWorthwhileData() {
    var saved = parseJson(lsGet('tdb_my_saved_verses_v1'));
    if (Array.isArray(saved) && saved.length > 0) return true;

    var study = parseJson(lsGet('tdb_my_study_v1'));
    if (study) {
      if (study.notes && String(study.notes).trim()) return true;
      if (study.prayer && String(study.prayer).trim()) return true;
      if (study.verseRef && String(study.verseRef).trim()) return true;
    }

    var streak = parseJson(lsGet('dailyBattleStreak'));
    if (streak && Array.isArray(streak.dates) && streak.dates.length > 0) return true;

    var mem = parseJson(lsGet('tdb_memorize_lite_v1'));
    if (mem && Array.isArray(mem.queue) && mem.queue.length > 0) return true;

    var ribbon = parseJson(lsGet('tdb_mobius_loop_journal_v1'));
    if (ribbon && Array.isArray(ribbon.entries) && ribbon.entries.length > 0) return true;

    if (hasPlanMarks()) return true;
    return false;
  }

  function backupIsStale() {
    var lastMs = parseInt(lsGet(LAST_BACKUP_KEY) || '0', 10) || 0;
    if (!lastMs) return true;
    return Date.now() - lastMs > 14 * 86400000;
  }

  function isSnoozed() {
    var until = parseInt(lsGet(SNOOZE_KEY) || '0', 10) || 0;
    return Date.now() < until;
  }

  function isReturningVisitor() {
    return lsGet(RETURNING_KEY) === '1' || lsGet(SEEN_KEY) === '1';
  }

  function shouldShow() {
    if (shouldSkipPage()) return false;
    if (!hasWorthwhileData()) return false;
    if (isSnoozed()) return false;
    if (!backupIsStale()) return false;
    if (!isReturningVisitor()) return false;
    if (document.getElementById('tdb-backup-reminder')) return false;
    return true;
  }

  function track(name, params) {
    try {
      if (typeof window.trackEvent === 'function') window.trackEvent(name, params || {});
    } catch (e) {}
  }

  function dismissBar(bar, snoozeDays) {
    if (!bar || !bar.parentNode) return;
    bar.parentNode.removeChild(bar);
    document.documentElement.classList.remove('tdb-backup-reminder-open');
    if (snoozeDays > 0) {
      lsSet(SNOOZE_KEY, String(Date.now() + snoozeDays * 86400000));
    }
  }

  function mount() {
    if (!shouldShow()) return;

    var bar = document.createElement('div');
    bar.id = 'tdb-backup-reminder';
    bar.className = 'tdb-backup-reminder';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Backup reminder');
    bar.setAttribute('aria-live', 'polite');

    var copy = document.createElement('p');
    copy.className = 'tdb-backup-reminder__copy';
    copy.textContent =
      'Your notes, verses, and quiet steps live on this device only. A JSON backup in My Study takes one tap—and gives you a file you can keep.';

    var actions = document.createElement('div');
    actions.className = 'tdb-backup-reminder__actions';

    var go = document.createElement('a');
    go.className = 'btn btn-secondary tdb-backup-reminder__btn';
    go.href = '/mystudy.html#panel-note-library';
    go.textContent = 'Open backup in My Study';

    var later = document.createElement('button');
    later.type = 'button';
    later.className = 'btn btn-secondary tdb-backup-reminder__btn';
    later.textContent = 'Remind me in a week';
    later.addEventListener('click', function () {
      dismissBar(bar, 7);
      track('backup_reminder_snooze', { days: 7, surface: 'site' });
    });

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'tdb-backup-reminder__close';
    close.setAttribute('aria-label', 'Dismiss backup reminder');
    close.textContent = '×';
    close.addEventListener('click', function () {
      lsSet(SEEN_KEY, '1');
      dismissBar(bar, 14);
      track('backup_reminder_dismiss', { surface: 'site' });
    });

    actions.appendChild(go);
    actions.appendChild(later);
    actions.appendChild(close);
    bar.appendChild(copy);
    bar.appendChild(actions);
    document.body.appendChild(bar);
    document.documentElement.classList.add('tdb-backup-reminder-open');
    lsSet(SEEN_KEY, '1');
    track('backup_reminder_show', { surface: 'site' });
  }

  function init() {
    if (document.body) {
      mount();
    } else {
      document.addEventListener('DOMContentLoaded', mount, { once: true });
    }
  }

  init();
})();
