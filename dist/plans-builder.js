/**
 * Mix-and-match Battle Plan builder — device-local custom lanes from full plan days.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tdb_custom_plans_v1';
  var MAX_DAYS = 14;
  var CURATED = [
    'battle',
    'universityanxiety',
    'universitygrief',
    'universityparenting',
    'peace',
    'hope',
    'steadydays',
    'simplethanks',
    'armorofgod',
    'parentweary',
    'heavyhope',
    'gratitude',
    'forgiveness',
    'restlessnights'
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function slugify(s) {
    return String(s || 'lane')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'lane';
  }

  function loadCustomPlans() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveCustomPlans(arr) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      return true;
    } catch (e) {
      return false;
    }
  }

  function cloneDay(day, sourcePlanId, dayIndex) {
    var d = {};
    var k;
    if (!day || typeof day !== 'object') return d;
    for (k in day) {
      if (Object.prototype.hasOwnProperty.call(day, k)) d[k] = day[k];
    }
    d.title = d.title || 'Day ' + (dayIndex + 1);
    d._tdbSource = sourcePlanId + ':' + (dayIndex + 1);
    return d;
  }

  window.TDB_mergeCustomBattlePlans = function mergeCustomBattlePlans(plansObj) {
    if (!plansObj) return;
    loadCustomPlans().forEach(function (cp) {
      if (!cp || !cp.id || !Array.isArray(cp.days) || !cp.days.length) return;
      var id = String(cp.id);
      if (plansObj[id]) return;
      plansObj[id] = {
        id: id,
        icon: cp.icon || '📋',
        label: cp.label || 'My lane',
        desc: cp.desc || 'Your mix-and-match lane on this device.',
        key: 'tdb-plan-' + id + '-day',
        max: cp.days.length,
        days: cp.days,
        custom: true
      };
    });
  };

  function getPlans() {
    if (typeof window.__TDBPlansBuilderGetPlans === 'function') {
      return window.__TDBPlansBuilderGetPlans();
    }
    return null;
  }

  function openPlan(id) {
    if (typeof window.__TDBPlansBuilderOpenPlan === 'function') {
      window.__TDBPlansBuilderOpenPlan(id);
    } else {
      window.location.href = 'plans.html?plan=' + encodeURIComponent(id);
    }
  }

  function appendPlanRow(plan) {
    var list = byId('planList');
    if (!list || !plan) return;
    if (list.querySelector('[data-plan="' + plan.id + '"]')) return;
    var a = document.createElement('a');
    a.href = 'plans.html?plan=' + encodeURIComponent(plan.id);
    a.className = 'plan-row plan-row--custom';
    a.setAttribute('data-plan', plan.id);
    a.setAttribute('aria-label', plan.label + ' — ' + plan.max + ' days (your lane)');
    a.innerHTML =
      '<span class="plan-row-icon" aria-hidden="true">' +
      (plan.icon || '📋') +
      '</span>' +
      '<div class="plan-row-info"><h2>' +
      escapeHtml(plan.label) +
      '</h2><p>Your mix on this device — full KJV days you chose.</p></div>' +
      '<div class="plan-row-meta"><span class="plan-badge">' +
      plan.max +
      ' days</span><span class="plan-progress-pill" id="planPill-' +
      plan.id +
      '">Not started</span></div>';
    list.insertBefore(a, list.firstChild);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function initBuilderUi() {
    var section = byId('plans-builder-section');
    if (!section) return;

    var planSelect = byId('plans-builder-source-plan');
    var daySelect = byId('plans-builder-source-day');
    var queue = byId('plans-builder-queue');
    var status = byId('plans-builder-status');
    var nameInput = byId('plans-builder-name');
    var draft = [];

    function setStatus(msg) {
      if (status) status.textContent = msg || '';
    }

    function populatePlanSelect() {
      var plans = getPlans();
      if (!planSelect || !plans) return;
      planSelect.textContent = '';
      CURATED.forEach(function (id) {
        var p = plans[id];
        if (!p || !p.days || !p.days.length) return;
        var opt = document.createElement('option');
        opt.value = id;
        opt.textContent = (p.icon ? p.icon + ' ' : '') + (p.label || id) + ' (' + p.days.length + ' days)';
        planSelect.appendChild(opt);
      });
      refreshDaySelect();
    }

    function refreshDaySelect() {
      if (!daySelect || !planSelect) return;
      var plans = getPlans();
      var p = plans && plans[planSelect.value];
      daySelect.textContent = '';
      if (!p || !p.days) return;
      var i;
      for (i = 0; i < p.days.length; i++) {
        var opt = document.createElement('option');
        opt.value = String(i);
        var t = (p.days[i] && p.days[i].title) || 'Day ' + (i + 1);
        var r = (p.days[i] && p.days[i].ref) || '';
        opt.textContent = 'Day ' + (i + 1) + (r ? ' — ' + r : '') + (t ? ' · ' + t : '');
        daySelect.appendChild(opt);
      }
    }

    function renderQueue() {
      if (!queue) return;
      queue.textContent = '';
      if (!draft.length) {
        var empty = document.createElement('li');
        empty.className = 'plans-builder-queue-empty';
        empty.textContent = 'No days yet — add one from a plan above.';
        queue.appendChild(empty);
        return;
      }
      draft.forEach(function (item, idx) {
        var li = document.createElement('li');
        li.className = 'plans-builder-queue-item';
        var label = document.createElement('span');
        label.className = 'plans-builder-queue-label';
        label.textContent =
          (idx + 1) +
          '. ' +
          (item.planLabel || item.planId) +
          ' · Day ' +
          (item.dayIndex + 1) +
          (item.ref ? ' — ' + item.ref : '');
        var actions = document.createElement('span');
        actions.className = 'plans-builder-queue-actions';
        var up = document.createElement('button');
        up.type = 'button';
        up.className = 'btn btn-secondary plans-builder-queue-btn';
        up.textContent = '↑';
        up.setAttribute('aria-label', 'Move day up');
        up.disabled = idx === 0;
        up.addEventListener('click', function () {
          var t = draft[idx - 1];
          draft[idx - 1] = draft[idx];
          draft[idx] = t;
          renderQueue();
        });
        var down = document.createElement('button');
        down.type = 'button';
        down.className = 'btn btn-secondary plans-builder-queue-btn';
        down.textContent = '↓';
        down.setAttribute('aria-label', 'Move day down');
        down.disabled = idx === draft.length - 1;
        down.addEventListener('click', function () {
          var t = draft[idx + 1];
          draft[idx + 1] = draft[idx];
          draft[idx] = t;
          renderQueue();
        });
        var rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'btn btn-secondary plans-builder-queue-btn';
        rm.textContent = 'Remove';
        rm.addEventListener('click', function () {
          draft.splice(idx, 1);
          renderQueue();
        });
        actions.appendChild(up);
        actions.appendChild(down);
        actions.appendChild(rm);
        li.appendChild(label);
        li.appendChild(actions);
        queue.appendChild(li);
      });
    }

    var addBtn = byId('plans-builder-add-day');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var plans = getPlans();
        if (!plans || !planSelect) return;
        if (draft.length >= MAX_DAYS) {
          setStatus('Up to ' + MAX_DAYS + ' days keeps the lane gentle.');
          return;
        }
        var pid = planSelect.value;
        var p = plans[pid];
        if (!p || !p.days || !p.days.length) return;
        var di = parseInt(daySelect.value, 10) || 0;
        if (di < 0 || di >= p.days.length) return;
        var day = p.days[di];
        draft.push({
          planId: pid,
          planLabel: p.label || pid,
          dayIndex: di,
          ref: day.ref || '',
          day: cloneDay(day, pid, di)
        });
        renderQueue();
        setStatus('Added day ' + (di + 1) + ' from ' + (p.label || pid) + '.');
      });
    }

    if (planSelect) planSelect.addEventListener('change', refreshDaySelect);

    var saveBtn = byId('plans-builder-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        if (draft.length < 2) {
          setStatus('Pick at least two days — even a short lane counts.');
          return;
        }
        var name = String((nameInput && nameInput.value) || '').trim() || 'My quiet lane';
        var baseId = 'custom-' + slugify(name);
        var id = baseId;
        var existing = loadCustomPlans();
        var n = 2;
        while (existing.some(function (x) {
          return x.id === id;
        })) {
          id = baseId + '-' + n;
          n++;
        }
        var days = draft.map(function (item, i) {
          var d = cloneDay(item.day, item.planId, item.dayIndex);
          d.title = d.title || 'Day ' + (i + 1);
          return d;
        });
        var entry = {
          id: id,
          icon: '📋',
          label: name,
          desc: 'Your mix-and-match lane — ' + days.length + ' full KJV days on this device.',
          days: days,
          createdAt: new Date().toISOString()
        };
        existing.unshift(entry);
        if (!saveCustomPlans(existing)) {
          setStatus('Could not save — your browser storage may be full.');
          return;
        }
        var plans = getPlans();
        if (plans) {
          window.TDB_mergeCustomBattlePlans(plans);
          appendPlanRow(plans[id]);
        }
        setStatus('Saved. Opening your lane…');
        draft.length = 0;
        renderQueue();
        if (nameInput) nameInput.value = '';
        try {
          if (typeof trackEvent === 'function') {
            trackEvent('plans_builder_saved', { days: days.length });
          }
        } catch (e) {}
        openPlan(id);
      });
    }

    loadCustomPlans().forEach(function (cp) {
      appendPlanRow({ id: cp.id, label: cp.label, icon: cp.icon, max: cp.days.length });
    });

    populatePlanSelect();
    renderQueue();
  }

  window.TDB_initPlansBuilder = initBuilderUi;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBuilderUi);
  } else {
    initBuilderUi();
  }
})();
