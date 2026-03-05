/**
 * Deep-tab inline curriculum widget for index.html.
 * Includes day view, armor progression, and family map.
 */
(function () {
  'use strict';

  var STORAGE_PROGRESS = 'tdb_curriculum_progress_days';
  var STORAGE_FAMILY = 'tdb_curriculum_family_id';
  var STORAGE_MODE_PREF = 'tdb_curriculum_mode_pref';
  var ARMOR = [
    { key: 'helmet', label: 'Helmet of Wisdom', unlockDay: 73, gem: 'sapphire' },
    { key: 'breastplate', label: 'Breastplate of Righteousness', unlockDay: 146, gem: 'ruby' },
    { key: 'belt', label: 'Belt of Truth', unlockDay: 219, gem: 'emerald' },
    { key: 'shield', label: 'Shield (Ten Commandments slab)', unlockDay: 292, gem: 'diamond' },
    { key: 'sword', label: 'Sword (cross + faith/hope/love)', unlockDay: 365, gem: 'amethyst' }
  ];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function dayOfYear() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    return Math.max(1, Math.min(365, Math.floor((now - start) / 86400000)));
  }

  function readProgress() {
    try {
      var raw = localStorage.getItem(STORAGE_PROGRESS);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveProgressDay(day) {
    var arr = readProgress();
    if (arr.indexOf(day) === -1) {
      arr.push(day);
      arr.sort(function (a, b) { return a - b; });
      try { localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(arr)); } catch (e) {}
    }
  }

  function familyId() {
    var id = localStorage.getItem(STORAGE_FAMILY);
    if (!id) {
      id = 'family-' + Math.random().toString(36).slice(2, 8);
      try { localStorage.setItem(STORAGE_FAMILY, id); } catch (e) {}
    }
    return id;
  }

  function unlockedPieces(totalCompleted) {
    return ARMOR.filter(function (p) { return totalCompleted >= p.unlockDay; });
  }

  function getModePref() {
    var pref = localStorage.getItem(STORAGE_MODE_PREF);
    return pref || 'quick';
  }

  function seasonalTake(mode, text) {
    var yearIndex = Math.abs(new Date().getFullYear() - 2026) % 4;
    var takes = {
      kid: [
        'Gentle take: brave trust with Jesus close.',
        'Gentle take: love first, courage next.',
        'Gentle take: hope shines in hard days.',
        'Gentle take: Jesus helps kind hearts stay strong.'
      ],
      teen: [
        'Real talk: what if your squad ditches you? Jesus did not.',
        'Real talk: pressure is loud, but truth stays louder.',
        'Real talk: identity in Christ beats approval loops.',
        'Real talk: stay loyal when the room flips.'
      ],
      pastor: [
        "Pastor lens: real-world grind—Paul's chains still preached.",
        'Pastor lens: suffering forms witness, not silence.',
        'Pastor lens: context anchors application.',
        'Pastor lens: same word, fresh season, faithful exposition.'
      ],
      quick: [
        'Today lens: same truth, fresh step.',
        'Today lens: walk it out one day at a time.',
        'Today lens: practical obedience now.',
        'Today lens: steady hope for this moment.'
      ]
    };
    var arr = takes[mode] || takes.quick;
    return (text || '') + ' ' + arr[yearIndex];
  }

  function renderArmorAndMap() {
    var progress = readProgress();
    var completed = progress.length;
    var avatar = document.getElementById('deep-curriculum-avatar');
    var list = document.getElementById('deep-curriculum-armor-list');
    var map = document.getElementById('deep-curriculum-map');
    var summary = document.getElementById('deep-curriculum-summary');
    if (!avatar || !list || !map || !summary) return;

    var unlocked = unlockedPieces(completed);
    avatar.className = 'deep-avatar';
    unlocked.forEach(function (p) { avatar.classList.add('piece-' + p.key); });

    var listHtml = '';
    for (var i = 0; i < ARMOR.length; i++) {
      var p = ARMOR[i];
      var on = completed >= p.unlockDay;
      listHtml += '<li>' + (on ? '✓' : '🔒') + ' ' + esc(p.label) + ' • gem: ' + esc(p.gem) + ' • day ' + p.unlockDay + '</li>';
    }
    list.innerHTML = listHtml;

    var percent = Math.max(0, Math.min(100, Math.round((completed / 365) * 100)));
    map.innerHTML =
      '<div class="gold-trail"><span class="gold-fill" style="width:' + percent + '%"></span></div>' +
      '<p class="section-note util-mb-0">Family <strong>' + esc(familyId()) + '</strong> on streets of gold: ' + completed + '/365 days (' + percent + '%).</p>';

    summary.textContent = 'Armor progress: ' + completed + '/365 days completed.';
  }

  function init() {
    var content = document.getElementById('deep-curriculum-content');
    var dayInput = document.getElementById('deep-curriculum-day');
    var modeSelect = document.getElementById('deep-curriculum-mode');
    var prevBtn = document.getElementById('deep-curriculum-prev');
    var nextBtn = document.getElementById('deep-curriculum-next');
    if (!content || !dayInput || !modeSelect || !prevBtn || !nextBtn) return;

    var days = [];
    var currentDay = 1;

    function normalizeCharacterRow(row, dayNum) {
      if (!row) return null;
      // Supports either characters.json rows or existing curriculum rows.
      if (row.name && row.preGodBrief && row.postGodBrief && row.keyKJVVerse) {
        return {
          day: dayNum,
          name: row.name,
          preGodBrief: row.preGodBrief,
          impact: row.impact || '',
          postGodBrief: row.postGodBrief,
          keyVerse: { ref: row.keyKJVVerse, text: '' },
          kidSafeVersion: row.kid || '',
          teenVersion: row.teen || '',
          pastorVersion: row.pastor || ''
        };
      }
      return row;
    }

    function render() {
      var idx = Math.max(1, Math.min(365, parseInt(dayInput.value, 10) || 1));
      currentDay = idx;
      dayInput.value = String(idx);
      var mode = getModePref();
      var row = days[idx - 1];
      if (!row) {
        content.textContent = 'No curriculum entry found.';
        return;
      }
      saveProgressDay(idx);
      var modeText = mode === 'kid' ? row.kidSafeVersion : mode === 'teen' ? row.teenVersion : mode === 'pastor' ? row.pastorVersion : row.impact;
      modeText = seasonalTake(mode, modeText);
      content.innerHTML =
        '<strong>Day ' + idx + '</strong> — ' + esc(row.name) +
        '<br><strong>Before God:</strong> ' + esc(row.preGodBrief) +
        '<br><strong>Impact:</strong> ' + esc(row.impact) +
        '<br><strong>After God:</strong> ' + esc(row.postGodBrief) +
        '<br><strong>KJV:</strong> ' + esc(row.keyVerse && row.keyVerse.ref) + (row.keyVerse && row.keyVerse.text ? (' — ' + esc(row.keyVerse.text)) : '') +
        '<br><strong>' + esc(mode.charAt(0).toUpperCase() + mode.slice(1)) + ':</strong> ' + esc(modeText);
      prevBtn.disabled = idx <= 1;
      nextBtn.disabled = idx >= 365;
      renderArmorAndMap();
    }

    fetch('characters.json')
      .then(function (r) { return r.json(); })
      .then(function (json) {
        var chars = Array.isArray(json.characters) ? json.characters : [];
        if (chars.length) {
          days = [];
          for (var i = 0; i < 365; i++) {
            days.push(normalizeCharacterRow(chars[i % chars.length], i + 1));
          }
        } else {
          throw new Error('no characters');
        }
      })
      .catch(function () {
        return fetch('curriculum.json')
          .then(function (r) { return r.json(); })
          .then(function (json) {
            days = Array.isArray(json.days) ? json.days : [];
          });
      })
      .then(function () {
        if (days.length) dayInput.value = String(dayOfYear());
        modeSelect.value = getModePref();
        render();
      })
      .catch(function () {
        content.textContent = 'Could not load curriculum.';
      });

    dayInput.addEventListener('change', render);
    modeSelect.addEventListener('change', function () {
      var selected = modeSelect.value || 'quick';
      try { localStorage.setItem(STORAGE_MODE_PREF, selected); } catch (e) {}
      render();
    });
    prevBtn.addEventListener('click', function () {
      dayInput.value = String(Math.max(1, currentDay - 1));
      render();
    });
    nextBtn.addEventListener('click', function () {
      dayInput.value = String(Math.min(365, currentDay + 1));
      render();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
