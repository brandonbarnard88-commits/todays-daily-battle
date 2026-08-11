/**
 * 365-Day Bible Curriculum viewer.
 * Loads curriculum.json, renders story/verse by day, Verse Mode dropdown, armor checkpoints.
 * Dark mode, JS-only, no paywalls.
 */
(function () {
  'use strict';

  var CURRICULUM_DAYS_KEY = 'tdb_curriculum_days_completed';
  var CURRICULUM_LAST_DAY_KEY = 'tdb_curriculum_last_day';
var CHECKPOINTS = [
  { key: 'helmet', label: 'Helmet of Wisdom', day: 73, gem: 'sapphire' },
  { key: 'breastplate', label: 'Breastplate of Righteousness', day: 146, gem: 'ruby' },
  { key: 'belt', label: 'Belt of Truth', day: 219, gem: 'emerald' },
  { key: 'shield', label: 'Shield (Ten Commandments slab)', day: 292, gem: 'diamond' },
  { key: 'sword', label: 'Sword (cross + faith/hope/love)', day: 365, gem: 'amethyst' }
];

  var data = { days: [] };
  var currentDay = 1;
  var verseMode = 'quick';

  function getTodayDayOfYear() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 86400000;
    return Math.floor(diff / oneDay);
  }

  function getCompletedDays() {
    try {
      var raw = localStorage.getItem(CURRICULUM_DAYS_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function markDayComplete(day) {
    var completed = getCompletedDays();
    if (completed.indexOf(day) === -1) {
      completed.push(day);
      completed.sort(function (a, b) { return a - b; });
      try {
        localStorage.setItem(CURRICULUM_DAYS_KEY, JSON.stringify(completed));
        localStorage.setItem(CURRICULUM_LAST_DAY_KEY, String(day));
      } catch (e) {}
    }
  }

  function getUnlockedPieces() {
    var completed = getCompletedDays();
  return CHECKPOINTS.filter(function (p) { return completed.length >= p.day; }).map(function (p) { return p.key; });
  }

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderStory(entry) {
    if (!entry) return '<p class="section-note">Day not found.</p>';
  var modeText = verseMode === 'kid' ? entry.kidSafeVersion : verseMode === 'teen' ? entry.teenVersion : verseMode === 'pastor' ? entry.pastorVersion : entry.impact;
    var html =
      '<h2>' + esc(entry.name) + '</h2>' +
      '<div class="story-meta">Day ' + entry.day + ' of 365</div>' +
      '<div class="story-block"><strong>Before God</strong>' + esc(entry.preGodBrief) + '</div>' +
      '<div class="story-block"><strong>Impact / Change</strong>' + esc(entry.impact) + '</div>' +
      '<div class="story-block"><strong>After God</strong>' + esc(entry.postGodBrief) + '</div>' +
      '<div class="curriculum-verse">' +
      '<span class="verse-ref">' + esc(entry.keyVerse && entry.keyVerse.ref) + '</span> (KJV)' +
      '<div class="verse-text">' + esc(entry.keyVerse && entry.keyVerse.text) + '</div>' +
      '<div class="verse-mode"><strong>Today:</strong> ' + esc(modeText) + '</div>' +
      '</div>';
    return html;
  }

  function renderArmor() {
    var unlocked = getUnlockedPieces();
    var avatar = document.getElementById('curriculum-avatar');
    if (avatar) {
      avatar.className = 'curriculum-avatar';
      unlocked.forEach(function (k) { avatar.classList.add(k); });
    }
    CHECKPOINTS.forEach(function (p) {
      var li = document.getElementById('check-' + p.key);
      if (!li) return;
      var isUnlocked = unlocked.indexOf(p.key) !== -1;
      li.innerHTML = (isUnlocked ? '<span class="check" aria-hidden="true">✓</span>' : '<span class="lock" aria-hidden="true">🔒</span>') +
        ' ' + esc(p.label) + ' — Day ' + esc(String(p.day)) + ' • gem: ' + esc(p.gem);
    });
  }

  function showDay(dayNum) {
    currentDay = Math.max(1, Math.min(365, parseInt(dayNum, 10) || 1));
    var input = document.getElementById('curriculum-day-input');
    if (input) input.value = currentDay;

    var entry = data.days[currentDay - 1];
    var content = document.getElementById('curriculum-content');
    if (content) content.innerHTML = renderStory(entry);

    var prev = document.getElementById('curriculum-prev');
    var next = document.getElementById('curriculum-next');
    if (prev) prev.disabled = currentDay <= 1;
    if (next) next.disabled = currentDay >= 365;

    markDayComplete(currentDay);
    renderArmor();
  }

  function initTabs() {
    var tabs = document.querySelectorAll('[data-curriculum-tab]');
    var panels = document.querySelectorAll('.curriculum-panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-curriculum-tab');
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) {
          p.classList.remove('active');
          if (p.id === 'curriculum-' + target + '-panel') {
            p.classList.add('active');
          }
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      });
    });
  }

  function init() {
    fetch('curriculum.json')
      .then(function (r) { return r.json(); })
      .then(function (json) {
        data = json;
        var input = document.getElementById('curriculum-day-input');
        var last = localStorage.getItem(CURRICULUM_LAST_DAY_KEY);
        var today = getTodayDayOfYear();
        var startDay = last ? parseInt(last, 10) : (today <= 365 ? today : 1);
        if (input) {
          input.value = startDay;
          input.addEventListener('change', function () {
            showDay(input.value);
          });
        }
        showDay(startDay);

        var modeSelect = document.getElementById('curriculum-verse-mode');
        if (modeSelect) {
          modeSelect.value = verseMode;
          modeSelect.addEventListener('change', function () {
            verseMode = modeSelect.value;
            showDay(currentDay);
          });
        }

        document.getElementById('curriculum-prev')?.addEventListener('click', function () {
          showDay(currentDay - 1);
        });
        document.getElementById('curriculum-next')?.addEventListener('click', function () {
          showDay(currentDay + 1);
        });
        document.getElementById('curriculum-today')?.addEventListener('click', function () {
          var d = getTodayDayOfYear();
          showDay(d <= 365 ? d : 1);
        });
      })
      .catch(function () {
        var content = document.getElementById('curriculum-content');
        if (content) content.innerHTML = '<p class="section-note">Curriculum did not load. Verify that curriculum.json is available.</p>';
      });

    initTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
