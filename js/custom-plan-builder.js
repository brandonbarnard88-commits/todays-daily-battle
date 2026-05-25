/**
 * Gentle custom Battle Plan builder — today’s verse + My Study saves.
 * Storage: tDB_myBattlePlans (porch key) + tdb_custom_plans_v1 (Battle Plans runner).
 * No upload. No account. Fully offline after first load.
 */
(function () {
  'use strict';

  var PLANS_KEY = 'tDB_myBattlePlans';
  var PLANS_RUNNER_KEY = 'tdb_custom_plans_v1';
  var DAILY_KEY = 'tDB_dailyVerse';
  var SAVED_KEYS = ['tDB_savedVerses', 'tdb_my_saved_verses_v1', 'savedVerses'];
  var MIN_VERSES = 3;
  var MAX_VERSES = 7;

  var selected = [];

  function byId(id) {
    return document.getElementById(id);
  }

  function todayYmd() {
    return new Date().toISOString().slice(0, 10);
  }

  function setStatus(msg) {
    var el = byId('builder-status');
    if (el) el.textContent = msg || '';
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function normalizeVerse(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var ref = String(raw.reference || raw.ref || '').trim();
    var text = String(raw.text || raw.verse || '').trim();
    if (!ref || !text) return null;
    return { reference: ref, text: text };
  }

  function verseKey(v) {
    return (v.reference || '').toLowerCase() + '|' + (v.text || '').slice(0, 40);
  }

  function parseJson(raw) {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function readDailyFromStorage() {
    var cached = parseJson(localStorage.getItem(DAILY_KEY));
    if (cached) {
      var v = normalizeVerse(cached);
      if (v && (!cached.date || cached.date === todayYmd())) return v;
    }
    try {
      var raw = localStorage.getItem('tdb_offline_battle_' + todayYmd());
      if (raw) {
        var ob = JSON.parse(raw);
        var fromOb = normalizeVerse({ ref: ob.ref, text: ob.verse || ob.text });
        if (fromOb) return fromOb;
      }
    } catch (e) {}
    return null;
  }

  function cacheDailyVerse(v) {
    try {
      localStorage.setItem(
        DAILY_KEY,
        JSON.stringify({ reference: v.reference, text: v.text, date: todayYmd() })
      );
    } catch (e) {}
  }

  function fetchDailyVerse() {
    return fetch('/today-kjv-verse.json', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('no verse');
        return r.json();
      })
      .then(function (j) {
        var v = normalizeVerse(j);
        if (!v) throw new Error('empty verse');
        cacheDailyVerse(v);
        return v;
      });
  }

  function gatherSavedVerses() {
    var seen = new Set();
    var out = [];
    SAVED_KEYS.forEach(function (key) {
      var raw = localStorage.getItem(key);
      var data = parseJson(raw);
      if (!data) return;
      var list = Array.isArray(data) ? data : data.items && Array.isArray(data.items) ? data.items : [];
      list.forEach(function (item) {
        var v = normalizeVerse(item);
        if (!v) return;
        var k = verseKey(v);
        if (seen.has(k)) return;
        seen.add(k);
        out.push(v);
      });
    });
    return out;
  }

  function emptyMessage(text) {
    return '<p class="custom-plan-builder__empty section-note">' + escapeHtml(text) + '</p>';
  }

  function renderVerseCard(v, addLabel) {
    var card = document.createElement('article');
    card.className = 'custom-plan-builder__verse-item';
    card.innerHTML =
      '<p class="custom-plan-builder__verse-text">' +
      escapeHtml(v.text) +
      '</p>' +
      '<p class="custom-plan-builder__verse-ref">' +
      escapeHtml(v.reference) +
      ' (KJV)</p>';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary custom-plan-builder__add-btn';
    btn.textContent = addLabel || 'Add to plan';
    btn.addEventListener('click', function () {
      addVerse(v);
    });
    card.appendChild(btn);
    return card;
  }

  function renderDailySection(v) {
    var section = byId('daily-section');
    if (!section) return;
    section.textContent = '';
    if (!v) {
      section.innerHTML = emptyMessage(
        'Today\u2019s verse is not loaded yet. Visit the porch once while online, then come back.'
      );
      return;
    }
    section.appendChild(renderVerseCard(v, 'Add today\u2019s verse'));
  }

  function renderSavedSection(list) {
    var section = byId('saved-section');
    if (!section) return;
    section.textContent = '';
    if (!list.length) {
      section.innerHTML = emptyMessage(
        'No saved verses in My Study yet. Save a verse on the porch, then return here.'
      );
      return;
    }
    list.forEach(function (v) {
      section.appendChild(renderVerseCard(v, 'Add to plan'));
    });
  }

  function updateSelectedCount() {
    var el = byId('selected-count');
    if (!el) return;
    var n = selected.length;
    el.textContent =
      n +
      ' verse' +
      (n === 1 ? '' : 's') +
      ' \u2014 three to seven feels peaceful.';
  }

  function renderSelected() {
    var container = byId('selected-verses');
    if (!container) return;
    container.textContent = '';
    if (!selected.length) {
      container.innerHTML = emptyMessage('Tap verses above when you\u2019re ready.');
      updateSelectedCount();
      return;
    }
    selected.forEach(function (v, i) {
      var card = document.createElement('article');
      card.className = 'custom-plan-builder__verse-item custom-plan-builder__verse-item--selected';
      card.innerHTML =
        '<p class="custom-plan-builder__verse-text">' +
        escapeHtml(v.text) +
        '</p>' +
        '<p class="custom-plan-builder__verse-ref">' +
        escapeHtml(v.reference) +
        ' (KJV)</p>';
      var actions = document.createElement('div');
      actions.className = 'custom-plan-builder__row-actions';
      var up = document.createElement('button');
      up.type = 'button';
      up.className = 'btn btn-secondary custom-plan-builder__mini-btn';
      up.textContent = '\u2191';
      up.setAttribute('aria-label', 'Move verse up');
      up.disabled = i === 0;
      up.addEventListener('click', function () {
        moveUp(i);
      });
      var down = document.createElement('button');
      down.type = 'button';
      down.className = 'btn btn-secondary custom-plan-builder__mini-btn';
      down.textContent = '\u2193';
      down.setAttribute('aria-label', 'Move verse down');
      down.disabled = i === selected.length - 1;
      down.addEventListener('click', function () {
        moveDown(i);
      });
      var rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'btn btn-secondary custom-plan-builder__mini-btn';
      rm.textContent = 'Remove';
      rm.addEventListener('click', function () {
        removeVerse(i);
      });
      actions.appendChild(up);
      actions.appendChild(down);
      actions.appendChild(rm);
      card.appendChild(actions);
      container.appendChild(card);
    });
    updateSelectedCount();
  }

  function addVerse(v) {
    var norm = normalizeVerse(v);
    if (!norm) return;
    if (selected.length >= MAX_VERSES) {
      setStatus('Seven verses feels peaceful \u2014 save this plan and start another when you\u2019re ready.');
      return;
    }
    var k = verseKey(norm);
    for (var i = 0; i < selected.length; i++) {
      if (verseKey(selected[i]) === k) {
        setStatus('That verse is already in your plan.');
        return;
      }
    }
    selected.push(norm);
    renderSelected();
    setStatus('');
  }

  function moveUp(i) {
    if (i <= 0) return;
    var t = selected[i - 1];
    selected[i - 1] = selected[i];
    selected[i] = t;
    renderSelected();
  }

  function moveDown(i) {
    if (i >= selected.length - 1) return;
    var t = selected[i + 1];
    selected[i + 1] = selected[i];
    selected[i] = t;
    renderSelected();
  }

  function removeVerse(i) {
    selected.splice(i, 1);
    renderSelected();
  }

  function slugify(s) {
    return String(s || 'lane')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 36) || 'lane';
  }

  function loadPlansArray() {
    var raw = localStorage.getItem(PLANS_KEY);
    var arr = parseJson(raw);
    return Array.isArray(arr) ? arr : [];
  }

  function savePlansArray(arr) {
    localStorage.setItem(PLANS_KEY, JSON.stringify(arr));
  }

  function bridgeToPlansRunner(plan) {
    var existing = [];
    try {
      existing = JSON.parse(localStorage.getItem(PLANS_RUNNER_KEY) || '[]');
      if (!Array.isArray(existing)) existing = [];
    } catch (e) {
      existing = [];
    }
    var id = String(plan.id).replace(/^custom-/, '');
    var days = plan.verses.map(function (v, i) {
      return {
        title: 'Day ' + (i + 1),
        ref: v.reference,
        text: v.text,
        plain: 'A KJV verse you chose for this gentle plan.',
        today: 'What is one honest line this verse speaks to you today?',
        action: 'If you want, read it once aloud.',
        prayer: 'Lord, meet me in Your Word today. Amen.',
        goal: 'From your custom plan \u2014 saved on this device.',
        _tdbSource: 'custom-plan-builder:' + (i + 1)
      };
    });
    var entry = {
      id: id,
      icon: '\uD83D\uDCCB',
      label: plan.title,
      desc: 'Your gentle plan \u2014 ' + days.length + ' KJV verses on this device.',
      days: days,
      createdAt: new Date().toISOString()
    };
    existing = existing.filter(function (x) {
      return x && x.id !== id;
    });
    existing.unshift(entry);
    localStorage.setItem(PLANS_RUNNER_KEY, JSON.stringify(existing));
    return id;
  }

  function saveCustomPlan() {
    var titleInput = byId('plan-title');
    var title = titleInput && titleInput.value ? String(titleInput.value).trim() : '';
    if (!title) title = 'My Gentle Plan';
    if (selected.length < MIN_VERSES) {
      setStatus(
        'A plan feels steadier with at least three verses \u2014 add a few more when you\u2019re ready.'
      );
      return;
    }
    var id = 'custom-' + slugify(title) + '-' + Date.now().toString(36);
    var newPlan = {
      id: id,
      title: title,
      verses: selected.slice(),
      dateCreated: todayYmd()
    };
    var plans = loadPlansArray();
    plans.unshift(newPlan);
    savePlansArray(plans);
    var runnerId = bridgeToPlansRunner(newPlan);
    setStatus('Saved on this device. Opening your plan \u2026');
    window.location.href = 'plans.html?plan=' + encodeURIComponent(runnerId);
  }

  function initSources() {
    var daily = readDailyFromStorage();
    if (daily) {
      renderDailySection(daily);
    } else {
      renderDailySection(null);
      fetchDailyVerse()
        .then(function (v) {
          renderDailySection(v);
        })
        .catch(function () {
          renderDailySection(null);
        });
    }
    renderSavedSection(gatherSavedVerses());
    renderSelected();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSources();
    var saveBtn = byId('save-custom-plan');
    var cancelBtn = byId('cancel-custom-plan');
    if (saveBtn) saveBtn.addEventListener('click', saveCustomPlan);
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        if (window.history.length > 1) window.history.back();
        else window.location.href = 'plans.html';
      });
    }
  });
})();
