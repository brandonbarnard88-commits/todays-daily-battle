/**
 * Quiet “Pick up where you left off” band for My Study / Reader (local only).
 * Reuses existing keys — no new storage. Hidden when nothing relevant exists.
 */
(function (global) {
  'use strict';

  var MEM_KEY = 'tdb_memorize_lite_v1';
  var RECENT_PLANS_KEY = 'tdb_recent_plans_v1';
  var RESUME_KEY = 'tdb_reader_resume_v1';
  var RECENT_CHAPTERS_KEY = 'tdb_reader_recent_chapters_v1';
  var MEM_INTERVALS_DAYS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
  var DAY_MS = 86400000;
  var MEM_LOOKAHEAD_MS = 3 * DAY_MS;

  function clampStr(s, max) {
    var t = String(s || '').replace(/\u0000/g, '').trim();
    if (t.length > max) return t.slice(0, max);
    return t;
  }

  function getTopInProgressPlan() {
    try {
      var raw = localStorage.getItem(RECENT_PLANS_KEY);
      if (raw) {
        var ids = JSON.parse(raw);
        if (Array.isArray(ids) && ids.length) {
          for (var i = 0; i < ids.length; i++) {
            var pid = String(ids[i] || '').trim();
            if (!pid) continue;
            var pkey = pid === 'battle' ? 'tdb-plan-day' : 'tdb-plan-' + pid + '-day';
            var prog = parseInt(localStorage.getItem(pkey) || '0', 10) || 0;
            if (prog <= 0) continue;
            var maxRaw = localStorage.getItem('tdb-plan-' + pid + '-max');
            var pmax = maxRaw ? parseInt(maxRaw, 10) || 0 : 0;
            if (pmax > 0 && prog >= pmax) continue;
            var plabel = clampStr(localStorage.getItem('tdb-plan-' + pid + '-label') || pid, 52);
            return { id: pid, label: plabel, dayNumber: prog + 1, max: pmax || null };
          }
        }
      }
    } catch (_) {}
    try {
      if (global.TDBPlanProgress && typeof global.TDBPlanProgress.partitionActiveCompleted === 'function') {
        var parts = global.TDBPlanProgress.partitionActiveCompleted();
        var active = (parts && parts.active) || [];
        if (active.length) {
          var p0 = active[0];
          var id = p0.planId || p0.key || '';
          if (id) {
            return {
              id: id,
              label: clampStr(p0.label || id, 52),
              dayNumber: (parseInt(p0.day, 10) || 0) + 1,
              max: p0.max || null
            };
          }
        }
      }
    } catch (_) {}
    return null;
  }

  function normalizeMemEntry(e) {
    if (!e || typeof e !== 'object') return e;
    if (e.intervalIdx == null && e.step != null) {
      e.intervalIdx = Math.min(MEM_INTERVALS_DAYS.length - 1, Math.max(0, Number(e.step) || 0));
    }
    if (e.intervalIdx == null) e.intervalIdx = 0;
    return e;
  }

  function memNextDueMs(entry) {
    if (!entry) return 0;
    normalizeMemEntry(entry);
    var override = Number(entry.nextDueOverrideMs);
    if (!isNaN(override) && override > Date.now()) return override;
    var idx = Math.min(Math.max(Number(entry.intervalIdx) || 0, 0), MEM_INTERVALS_DAYS.length - 1);
    var ef = Number(entry.easeFactor) || 2;
    var days = MEM_INTERVALS_DAYS[idx] * (ef / 2);
    if (days < 0.9) days = 0.9;
    if (days > 200) days = 200;
    var base = entry.lastReviewed ? Date.parse(entry.lastReviewed) : Date.parse(entry.added || new Date().toISOString());
    if (isNaN(base)) base = Date.now();
    return base + days * DAY_MS;
  }

  function getSoonestMemorize() {
    try {
      var raw = localStorage.getItem(MEM_KEY);
      var o = raw ? JSON.parse(raw) : null;
      if (!o || !o.refs || typeof o.refs !== 'object') return null;
      var rows = Object.keys(o.refs).map(function (k) {
        var entry = o.refs[k];
        normalizeMemEntry(entry);
        return { ref: String(k || '').replace(/\s+/g, ' ').trim(), dueAt: memNextDueMs(entry) };
      }).filter(function (r) { return r.ref; });
      rows.sort(function (a, b) { return a.dueAt - b.dueAt; });
      return rows.length ? rows[0] : null;
    } catch (_) {
      return null;
    }
  }

  function getReaderResume() {
    try {
      if (global.TDBStudyCompanion && typeof global.TDBStudyCompanion.getReaderResume === 'function') {
        return global.TDBStudyCompanion.getReaderResume();
      }
    } catch (_) {}
    try {
      var o = JSON.parse(localStorage.getItem(RESUME_KEY) || 'null');
      if (!o || typeof o !== 'object' || !o.book || !o.chapter) return null;
      return { book: String(o.book), chapter: String(o.chapter) };
    } catch (_) {
      return null;
    }
  }

  function getRecentChapter() {
    try {
      if (global.TDBStudyCompanion && typeof global.TDBStudyCompanion.getRecentChapters === 'function') {
        var list = global.TDBStudyCompanion.getRecentChapters();
        if (Array.isArray(list) && list.length && list[0] && list[0].book) {
          return {
            book: String(list[0].book),
            chapter: String(list[0].chapter || ''),
            label: list[0].label || (list[0].book + ' ' + list[0].chapter)
          };
        }
      }
    } catch (_) {}
    try {
      var raw = localStorage.getItem(RECENT_CHAPTERS_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr) && arr.length && arr[0] && arr[0].book) {
        return {
          book: String(arr[0].book),
          chapter: String(arr[0].chapter || ''),
          label: arr[0].label || (arr[0].book + ' ' + arr[0].chapter)
        };
      }
    } catch (_) {}
    return null;
  }

  /**
   * @param {string} [rootId]
   * @param {{ preferChapter?: boolean, skipChapter?: boolean }} [opts]
   */
  function paintContinueSurface(rootId, opts) {
    var root = document.getElementById(rootId || 'tdb-continue-surface');
    if (!root) return false;
    var link = document.getElementById('tdb-continue-surface-link') || root.querySelector('.tdb-continue-surface__link');
    var title = document.getElementById('tdb-continue-surface-title') || root.querySelector('.tdb-continue-surface__title');
    if (!link || !title) return false;

    opts = opts || {};
    var href = '';
    var label = '';
    var kind = '';

    var plan = getTopInProgressPlan();
    if (plan && plan.id) {
      href = 'plans.html?plan=' + encodeURIComponent(plan.id);
      label = plan.label + ' — Day ' + plan.dayNumber + (plan.max ? ' of ' + plan.max : '');
      kind = 'plan';
    }

    if (!href) {
      var mem = getSoonestMemorize();
      var now = Date.now();
      if (mem && mem.ref && mem.dueAt <= now + MEM_LOOKAHEAD_MS) {
        href = 'memorize.html';
        label = clampStr(mem.ref, 44) + ' — gentle review when you are ready';
        kind = 'memorize';
      }
    }

    if (!href && !opts.skipChapter) {
      var ch = opts.preferChapter !== false ? (getReaderResume() || getRecentChapter()) : getRecentChapter();
      if (ch && ch.book && ch.chapter) {
        href =
          'reader.html?book=' +
          encodeURIComponent(ch.book) +
          '&chapter=' +
          encodeURIComponent(String(ch.chapter));
        label = (ch.label || (ch.book + ' ' + ch.chapter)) + ' (KJV)';
        kind = 'chapter';
      }
    }

    if (!href) {
      root.hidden = true;
      root.setAttribute('hidden', '');
      return false;
    }

    link.href = href;
    title.textContent = label;
    link.setAttribute('aria-label', 'Continue: ' + label);
    link.setAttribute('data-tdb-continue-kind', kind);
    root.hidden = false;
    root.removeAttribute('hidden');
    return true;
  }

  function boot() {
    if (document.getElementById('tdb-continue-surface')) {
      var page = (document.body && document.body.getAttribute('data-tdb-continue-page')) || '';
      paintContinueSurface('tdb-continue-surface', {
        skipChapter: page === 'reader',
        preferChapter: page === 'mystudy'
      });
    }
  }

  global.TDB_paintContinueSurface = paintContinueSurface;
  global.TDB_getTopInProgressPlan = getTopInProgressPlan;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
