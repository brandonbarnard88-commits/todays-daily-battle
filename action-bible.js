(function () {
  'use strict';

  var DATA_URL = 'action-bible-365.json';
  var RESUME_KEY = 'tdb_action_bible_resume_v1';
  var WATCHED_KEY = 'tdb_action_bible_watched_v1';
  var state = {
    all: [],
    filtered: [],
    index: 0,
    timer: null,
    isLooping: true,
    reducedMotion: false,
    resume: null,
    watched: {},
    dayToSeason: {},
    seasonStats: {}
  };

  function byId(id) { return document.getElementById(id); }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setStatus(msg) {
    var el = byId('ab-status');
    if (el) el.textContent = msg;
  }

  function setEpisodeNote(msg) {
    var el = byId('ab-episode-note');
    if (el) el.textContent = msg;
  }

  function readResume() {
    try {
      var raw = window.localStorage.getItem(RESUME_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function readWatched() {
    try {
      var raw = window.localStorage.getItem(WATCHED_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return {};
      return parsed;
    } catch (err) {
      return {};
    }
  }

  function writeResume(payload) {
    try {
      window.localStorage.setItem(RESUME_KEY, JSON.stringify(payload));
    } catch (err) {
      // Ignore storage failures; playback should continue without persistence.
    }
  }

  function writeWatched(payload) {
    try {
      window.localStorage.setItem(WATCHED_KEY, JSON.stringify(payload));
    } catch (err) {
      // Ignore storage failures; playback should continue without persistence.
    }
  }

  function countWatchedEntries() {
    return Object.keys(state.watched || {}).filter(function (key) {
      return !!state.watched[key];
    }).length;
  }

  function markWatched(day) {
    var numericDay = Number(day || 0);
    if (!numericDay) return;
    if (state.watched[String(numericDay)]) return;
    state.watched[String(numericDay)] = true;
    writeWatched(state.watched);
    refreshSeasonCardProgress();
  }

  function persistResume() {
    var item = current();
    if (!item) return;
    var seasonEl = byId('ab-season');
    var testamentEl = byId('ab-testament');
    var searchEl = byId('ab-search');
    var payload = {
      day: Number(item.day || 0),
      season: String((seasonEl && seasonEl.value) || ''),
      testament: String((testamentEl && testamentEl.value) || ''),
      query: String((searchEl && searchEl.value) || ''),
      savedAt: Date.now()
    };
    writeResume(payload);
    state.resume = payload;
    renderResume();
  }

  function renderResume() {
    var host = byId('ab-resume');
    if (!host) return;
    var resume = state.resume;
    if (!resume || !resume.day) {
      host.innerHTML =
        '<h3>Continue Watching</h3>' +
        '<p>No saved progress yet. Start any episode to enable instant resume.</p>';
      return;
    }
    var when = '';
    if (resume.savedAt) {
      var d = new Date(resume.savedAt);
      if (!isNaN(d.getTime())) when = d.toLocaleString();
    }
    var watchedTotal = countWatchedEntries();
    host.innerHTML =
      '<h3>Continue Watching</h3>' +
      '<p><strong>Resume point:</strong> Entry ' + esc(resume.day) + '</p>' +
      '<p><strong>Season:</strong> ' + esc(resume.season || 'All seasons') + ' · <strong>Testament:</strong> ' + esc(resume.testament || 'All') + '</p>' +
      '<p><strong>Archive progress:</strong> ' + esc(watchedTotal) + ' watched entries</p>' +
      '<p><strong>Last saved:</strong> ' + esc(when || 'recently') + '</p>' +
      '<button class="btn btn-primary" type="button" id="ab-resume-play">Resume Playback</button>' +
      '<button class="btn btn-secondary" type="button" id="ab-reset-progress">Reset Progress</button>';
  }

  function resumePlayback() {
    var resume = state.resume || readResume();
    if (!resume || !resume.day) {
      setStatus('No saved playback session found yet.');
      return;
    }
    var seasonEl = byId('ab-season');
    var testamentEl = byId('ab-testament');
    var searchEl = byId('ab-search');
    if (seasonEl) seasonEl.value = String(resume.season || '');
    if (testamentEl) testamentEl.value = String(resume.testament || '');
    if (searchEl) searchEl.value = String(resume.query || '');
    applyFilter();
    var idx = -1;
    for (var i = 0; i < state.filtered.length; i++) {
      if (Number(state.filtered[i].day) === Number(resume.day)) {
        idx = i;
        break;
      }
    }
    if (idx < 0 && state.filtered.length) idx = 0;
    if (idx < 0) {
      setStatus('Saved session could not be resumed with current data.');
      return;
    }
    state.index = idx;
    renderCurrent();
    startAuto();
    setStatus('Resumed playback from entry ' + state.filtered[idx].day + '.');
    setEpisodeNote('Continue watching resumed.');
  }

  function resetProgress() {
    state.watched = {};
    state.resume = null;
    try {
      window.localStorage.removeItem(WATCHED_KEY);
      window.localStorage.removeItem(RESUME_KEY);
    } catch (err) {
      // Ignore storage failures.
    }
    renderResume();
    refreshSeasonCardProgress();
    setStatus('Playback history cleared.');
    setEpisodeNote('Progress reset complete.');
  }

  function startFeaturedEpisode() {
    var host = byId('ab-featured-episode');
    if (!host || !state.all.length) return;
    var day = Number(host.getAttribute('data-featured-day') || 0);
    var season = String(host.getAttribute('data-featured-season') || '').trim();
    if (season) {
      var seasonSelect = byId('ab-season');
      if (seasonSelect) seasonSelect.value = season;
    }
    applyFilter();
    if (!state.filtered.length) {
      setStatus('Featured episode could not be loaded with current filters.');
      setEpisodeNote('Featured episode unavailable right now.');
      return;
    }
    var idx = 0;
    for (var i = 0; i < state.filtered.length; i++) {
      if (Number(state.filtered[i].day) === day) {
        idx = i;
        break;
      }
    }
    state.index = idx;
    renderCurrent();
    startAuto();
    setStatus('Featured episode started: Entry ' + day + '.');
    setEpisodeNote('Now playing featured episode.');
  }

  function updateProgress() {
    var bar = byId('ab-progress-bar');
    var label = byId('ab-progress-label');
    if (!bar || !label) return;
    var total = state.filtered.length;
    if (!total) {
      bar.max = 1;
      bar.value = 0;
      label.textContent = 'No entries match current filters.';
      return;
    }
    bar.max = total;
    bar.value = Math.min(total, state.index + 1);
    label.textContent = 'Progress: ' + (state.index + 1) + ' of ' + total + ' filtered entries.';
  }

  function clampIndex() {
    if (!state.filtered.length) {
      state.index = 0;
      return;
    }
    state.index = Math.max(0, Math.min(state.filtered.length - 1, state.index));
  }

  function current() {
    clampIndex();
    return state.filtered[state.index] || null;
  }

  function renderCurrent() {
    var el = byId('ab-current');
    if (!el) return;
    var item = current();
    if (!item) {
      el.innerHTML = '<p>No entries match this filter.</p>';
      updateProgress();
      return;
    }
    el.innerHTML =
      '<h3>Entry ' + esc(item.day) + ' · ' + esc(item.characterName) + '</h3>' +
      '<p><strong>Verse:</strong> ' + esc(item.keyVerseRef) + '</p>' +
      '<p><strong>Scene:</strong> ' + esc(item.scene) + ' · <strong>Tier:</strong> ' + esc(item.tier) + '</p>' +
      '<div class="ab-meta-row">' +
        '<span class="ab-chip">' + esc(item.testament || 'Unknown Testament') + '</span>' +
        '<span class="ab-chip">' + esc(item.documentarySeason || 'Archive') + '</span>' +
        '<span class="ab-chip">' + esc(item.keyVerseBook || 'Unknown Book') + '</span>' +
      '</div>' +
      '<details class="ab-prompts"><summary>Avatar Prompt</summary><code>' + esc(item.avatarPrompt) + '</code></details>' +
      '<details class="ab-prompts"><summary>Cartoon Prompt</summary><code>' + esc(item.cartoonPrompt) + '</code></details>';
    var dayInput = byId('ab-day');
    if (dayInput) dayInput.value = item.day;
    if (!state.reducedMotion) {
      el.classList.remove('ab-current-transition');
      window.requestAnimationFrame(function () {
        el.classList.add('ab-current-transition');
      });
    }
    markWatched(item.day);
    persistResume();
    setEpisodeNote('Episode cue: ' + (item.documentarySeason || 'Archive') + ' · ' + (item.testament || 'Unknown Testament') + '.');
    updateProgress();
  }

  function renderGrid() {
    var grid = byId('ab-grid');
    if (!grid) return;
    if (!state.filtered.length) {
      grid.innerHTML = '<p class="section-note">No entries match your search.</p>';
      return;
    }
    grid.innerHTML = state.filtered.map(function (item, idx) {
      return '' +
        '<article class="ab-card">' +
          '<h3>Entry ' + esc(item.day) + ' · ' + esc(item.characterName) + '</h3>' +
          '<p><strong>Verse:</strong> ' + esc(item.keyVerseRef) + '</p>' +
          '<p><strong>Scene:</strong> ' + esc(item.scene) + '</p>' +
          '<div class="ab-meta-row">' +
            '<span class="ab-chip">' + esc(item.testament || 'Unknown Testament') + '</span>' +
            '<span class="ab-chip">' + esc(item.documentarySeason || 'Archive') + '</span>' +
          '</div>' +
          '<button class="btn btn-secondary" type="button" data-ab-index="' + idx + '">Load Entry</button>' +
        '</article>';
    }).join('');
    grid.querySelectorAll('button[data-ab-index]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.index = Number(btn.getAttribute('data-ab-index') || 0);
        renderCurrent();
      });
    });
  }

  function applyFilter() {
    stopAuto();
    var q = String((byId('ab-search') && byId('ab-search').value) || '').trim().toLowerCase();
    var testament = String((byId('ab-testament') && byId('ab-testament').value) || '').trim();
    var season = String((byId('ab-season') && byId('ab-season').value) || '').trim();
    if (!q) {
      state.filtered = state.all.filter(function (item) {
        if (testament && String(item.testament || '') !== testament) return false;
        if (season && String(item.documentarySeason || '') !== season) return false;
        return true;
      });
      state.index = 0;
      renderCurrent();
      renderGrid();
      if (testament || season) setStatus('Showing ' + state.filtered.length + ' entries after filter selection.');
      else setStatus('Showing all ' + state.filtered.length + ' documentary entries.');
      if (season) setEpisodeNote('Episode mode ready for ' + season + '.');
      else setEpisodeNote('Episode mode standby: select a season, then play.');
      return;
    }
    state.filtered = state.all.filter(function (item) {
      if (testament && String(item.testament || '') !== testament) return false;
      if (season && String(item.documentarySeason || '') !== season) return false;
      return String(item.characterName || '').toLowerCase().indexOf(q) !== -1 ||
        String(item.keyVerseRef || '').toLowerCase().indexOf(q) !== -1 ||
        ('entry ' + String(item.day)).indexOf(q) !== -1 ||
        ('day ' + String(item.day)).indexOf(q) !== -1 ||
        String(item.keyVerseBook || '').toLowerCase().indexOf(q) !== -1 ||
        String(item.documentarySeason || '').toLowerCase().indexOf(q) !== -1;
    });
    state.index = 0;
    renderCurrent();
    renderGrid();
    setStatus('Showing ' + state.filtered.length + ' filtered entries.');
    setEpisodeNote('Episode search focus active (' + state.filtered.length + ' matches).');
  }

  function stopAuto() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
  }

  function nextEntry(loop) {
    if (!state.filtered.length) return;
    if (state.index < state.filtered.length - 1) {
      state.index += 1;
      renderCurrent();
      return true;
    } else if (loop) {
      state.index = 0;
      renderCurrent();
      return true;
    }
    renderCurrent();
    return false;
  }

  function startAuto() {
    stopAuto();
    if (!state.filtered.length) return;
    var interval = Number((byId('ab-interval') && byId('ab-interval').value) || 6000);
    state.timer = setInterval(function () {
      var moved = nextEntry(state.isLooping);
      if (!moved && !state.isLooping) {
        stopAuto();
        setStatus('Documentary reached the final filtered entry. Enable loop to continue.');
        setEpisodeNote('Episode complete. Choose another season or enable loop.');
      }
    }, Math.max(1500, interval));
    setStatus('Documentary mode playing across ' + state.filtered.length + ' entries.');
    setEpisodeNote('Now playing ' + state.filtered.length + ' entries in current documentary set.');
  }

  function playSelectedSeason() {
    var seasonEl = byId('ab-season');
    if (!seasonEl || !seasonEl.value) {
      setStatus('Select a documentary season first, then start episode mode.');
      setEpisodeNote('Episode mode needs a selected season.');
      return;
    }
    applyFilter();
    if (!state.filtered.length) {
      setStatus('No entries available for this season with current filters.');
      setEpisodeNote('Episode mode unavailable for current filter combination.');
      return;
    }
    state.index = 0;
    renderCurrent();
    renderGrid();
    startAuto();
    setStatus('Episode mode started for "' + seasonEl.value + '" (' + state.filtered.length + ' entries).');
    setEpisodeNote('Now playing season: ' + seasonEl.value + '.');
  }

  function jumpDay() {
    var day = Number((byId('ab-day') && byId('ab-day').value) || 0);
    if (!day) return;
    var idx = -1;
    for (var i = 0; i < state.filtered.length; i++) {
      if (Number(state.filtered[i].day) === day) { idx = i; break; }
    }
    if (idx >= 0) {
      state.index = idx;
      renderCurrent();
      setStatus('Jumped to entry ' + day + '.');
    }
  }

  function safeJsonParse(raw, fallback) {
    try {
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (err) {
      return fallback;
    }
  }

  function hashText(input) {
    var h = 2166136261;
    var str = String(input || '');
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function inferCharacterGender(name) {
    var key = String(name || '').trim().toLowerCase();
    var first = key.split(/\s+/)[0] || '';
    var femaleNames = {
      'eve': true, 'sarah': true, 'rebekah': true, 'rachel': true, 'leah': true,
      'miriam': true, 'deborah': true, 'ruth': true, 'esther': true, 'hannah': true,
      'naomi': true, 'abigail': true, 'bathsheba': true, 'elizabeth': true, 'mary': true,
      'martha': true, 'lydia': true, 'priscilla': true, 'lois': true, 'eunice': true,
      'delilah': true, 'jezebel': true, 'rahab': true, 'tamar': true
    };
    return femaleNames[first] ? 'female' : 'male';
  }

  function hasArmorPiece(pieces, piece) {
    if (!Array.isArray(pieces)) return false;
    var needle = String(piece || '').toLowerCase();
    for (var i = 0; i < pieces.length; i++) {
      if (String(pieces[i] || '').toLowerCase() === needle) return true;
    }
    return false;
  }

  function buildUserAvatarState(item) {
    var armor = safeJsonParse(window.localStorage.getItem('tdb_household_armor') || '{}', {});
    var pieces = Array.isArray(armor.pieces) ? armor.pieces : [];
    var progressDays = safeJsonParse(window.localStorage.getItem('tdb_curriculum_progress_days') || '[]', []);
    var progressCount = Array.isArray(progressDays) ? progressDays.length : 0;
    var swordGlow = safeJsonParse(window.localStorage.getItem('tdb_daily_tile_sword_glow') || 'false', false) === true;
    var faceChoices = ['🙂', '😌', '🛡️', '⚔️', '✨'];
    var genderSelect = byId('ab-avatar-gender');
    var selectedGender = String((genderSelect && genderSelect.value) || 'auto');
    var deviceHash = String(window.localStorage.getItem('tdb_daily_tile_device_hash') || 'action-bible-local');
    var faceSeed = faceChoices[hashText(deviceHash) % faceChoices.length];
    if (selectedGender === 'male') faceSeed = '👨';
    else if (selectedGender === 'female') faceSeed = '👩';
    return {
      label: 'Your Witness · Entry ' + String((item && item.day) || ''),
      face: faceSeed,
      gender: selectedGender === 'auto' ? 'unspecified' : selectedGender,
      helmet: hasArmorPiece(pieces, 'helmet') || progressCount >= 73,
      breastplate: hasArmorPiece(pieces, 'breastplate') || progressCount >= 146,
      belt: hasArmorPiece(pieces, 'belt') || progressCount >= 219,
      shield: hasArmorPiece(pieces, 'shield') || progressCount >= 292,
      sword: hasArmorPiece(pieces, 'sword') || progressCount >= 365,
      swordGlow: swordGlow,
      familyLabel: 'Scripture focus: ' + String((item && item.characterName) || 'Story witness')
    };
  }

  function buildStoryCharacterAvatar(item) {
    var gender = String((item && item.characterGender) || '').toLowerCase();
    if (gender !== 'female' && gender !== 'male') gender = inferCharacterGender(item && item.characterName);
    return {
      label: 'Scripture Witness · ' + String((item && item.characterName) || 'Faithful witness'),
      face: gender === 'female' ? '👩' : '👨',
      gender: gender,
      helmet: true,
      breastplate: true,
      belt: true,
      shield: true,
      sword: true,
      swordGlow: true,
      familyLabel: String((item && item.testament) || 'Scripture Story')
    };
  }

  function panelBackgroundFor(scene, step) {
    var key = String(scene || 'dawn');
    var gradients = {
      dawn: [
        'linear-gradient(135deg,#0f172a,#1e3a8a 45%,#38bdf8)',
        'linear-gradient(130deg,#111827,#0f766e 48%,#2dd4bf)'
      ],
      storm: [
        'linear-gradient(135deg,#0b1021,#312e81 42%,#0ea5e9)',
        'linear-gradient(130deg,#111827,#1d4ed8 46%,#7dd3fc)'
      ],
      forest: [
        'linear-gradient(130deg,#111827,#14532d 44%,#22c55e)',
        'linear-gradient(130deg,#052e16,#166534 44%,#4ade80)'
      ],
      night: [
        'linear-gradient(130deg,#020617,#312e81 46%,#6366f1)',
        'linear-gradient(130deg,#0f172a,#4338ca 46%,#a5b4fc)'
      ],
      river: [
        'linear-gradient(130deg,#082f49,#0369a1 48%,#38bdf8)',
        'linear-gradient(130deg,#0c4a6e,#0284c7 46%,#67e8f9)'
      ],
      forge: [
        'linear-gradient(130deg,#111827,#7c2d12 44%,#fb7185)',
        'linear-gradient(130deg,#1f2937,#9a3412 44%,#f97316)'
      ],
      summit: [
        'linear-gradient(130deg,#111827,#3f3f46 48%,#eab308)',
        'linear-gradient(130deg,#27272a,#52525b 46%,#facc15)'
      ],
      golden: [
        'linear-gradient(130deg,#1e1b4b,#854d0e 52%,#facc15)',
        'linear-gradient(130deg,#312e81,#a16207 52%,#fde68a)'
      ]
    };
    var options = gradients[key] || gradients.dawn;
    return options[step % options.length];
  }

  function buildPanelsForEntry(item) {
    var ref = String((item && item.keyVerseRef) || 'Joshua 1:9');
    var name = String((item && item.characterName) || 'Warrior');
    var scene = String((item && item.scene) || 'dawn');
    var prompt = String((item && item.cartoonPrompt) || '').split(',');
    var beats = prompt.map(function (part) { return String(part || '').trim(); }).filter(Boolean);
    var beatA = beats[2] || 'faith-forward movement';
    var beatB = beats[3] || 'obedience under pressure';
    return [
      {
        caption: 'Entry ' + item.day + ': ' + name + ' steps into the ' + scene + ' watch.',
        kjv: 'Stand therefore in the strength of the Lord. (' + ref + ')',
        bg: panelBackgroundFor(scene, 0),
        scene: scene
      },
      {
        caption: name + ' presses forward with ' + beatA + '.',
        kjv: 'Be strong and of a good courage. (' + ref + ')',
        bg: panelBackgroundFor(scene, 1),
        scene: scene
      },
      {
        caption: 'The battle turn comes through ' + beatB + '.',
        kjv: 'The LORD shall fight for you, and ye shall hold your peace. (' + ref + ')',
        bg: panelBackgroundFor(scene, 0),
        scene: scene
      },
      {
        caption: name + ' finishes this entry with focused faith.',
        kjv: 'Thanks be to God, which giveth us the victory. (' + ref + ')',
        bg: panelBackgroundFor(scene, 1),
        scene: scene
      }
    ];
  }

  function previewCartoon() {
    var item = current();
    if (!item) return;
    if (!(window.TDBCartoonPlayer && typeof window.TDBCartoonPlayer.open === 'function')) {
      setStatus('Cartoon preview is unavailable on this page right now.');
      return;
    }
    window.TDBCartoonPlayer.open({
      characterName: item.characterName,
      battleTitle: 'Entry ' + item.day + ' · ' + item.characterName,
      modeLabel: 'Action Bible Documentary Preview',
      userInitiated: true,
      useMyAvatar: true,
      mentorAvatar: buildStoryCharacterAvatar(item),
      userAvatar: buildUserAvatarState(item),
      panels: buildPanelsForEntry(item),
      options: { showEndPanel: true }
    });
    setStatus('Loaded cinematic preview with your avatar for Entry ' + item.day + '.');
  }

  function wire() {
    byId('ab-search') && byId('ab-search').addEventListener('input', applyFilter);
    byId('ab-day') && byId('ab-day').addEventListener('change', jumpDay);
    byId('ab-testament') && byId('ab-testament').addEventListener('change', applyFilter);
    byId('ab-season') && byId('ab-season').addEventListener('change', applyFilter);
    byId('ab-loop') && byId('ab-loop').addEventListener('change', function (e) {
      state.isLooping = !!(e && e.target && e.target.checked);
      setStatus(state.isLooping ? 'Looping enabled for documentary playback.' : 'Looping disabled. Playback stops at the final filtered entry.');
    });
    byId('ab-play-all') && byId('ab-play-all').addEventListener('click', startAuto);
    byId('ab-play-season') && byId('ab-play-season').addEventListener('click', playSelectedSeason);
    byId('ab-pause') && byId('ab-pause').addEventListener('click', function () {
      stopAuto();
      setStatus('Documentary mode paused.');
      setEpisodeNote('Playback paused. Resume when ready.');
    });
    byId('ab-next') && byId('ab-next').addEventListener('click', function () { nextEntry(false); });
    byId('ab-prev') && byId('ab-prev').addEventListener('click', function () {
      if (!state.filtered.length) return;
      state.index = Math.max(0, state.index - 1);
      renderCurrent();
    });
    byId('ab-preview-cartoon') && byId('ab-preview-cartoon').addEventListener('click', previewCartoon);
    byId('ab-featured-episode') && byId('ab-featured-episode').addEventListener('click', function (event) {
      var btn = event && event.target && event.target.closest ? event.target.closest('button[data-start-featured="true"]') : null;
      if (!btn) return;
      startFeaturedEpisode();
    });
    byId('ab-season-cards') && byId('ab-season-cards').addEventListener('click', function (event) {
      var btn = event && event.target && event.target.closest ? event.target.closest('button[data-season]') : null;
      if (!btn) return;
      var season = String(btn.getAttribute('data-season') || '').trim();
      if (!season) return;
      var seasonSelect = byId('ab-season');
      if (seasonSelect) seasonSelect.value = season;
      playSelectedSeason();
    });
    byId('ab-resume') && byId('ab-resume').addEventListener('click', function (event) {
      var resumeBtn = event && event.target && event.target.closest ? event.target.closest('#ab-resume-play') : null;
      if (resumeBtn) {
        resumePlayback();
        return;
      }
      var resetBtn = event && event.target && event.target.closest ? event.target.closest('#ab-reset-progress') : null;
      if (resetBtn) {
        resetProgress();
      }
    });
    document.addEventListener('keydown', function (event) {
      var target = event && event.target;
      var tag = target && target.tagName ? String(target.tagName).toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (target && target.isContentEditable)) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextEntry(false);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (!state.filtered.length) return;
        state.index = Math.max(0, state.index - 1);
        renderCurrent();
      } else if (event.key === ' ') {
        event.preventDefault();
        if (state.timer) {
          stopAuto();
          setStatus('Documentary mode paused.');
        } else {
          startAuto();
        }
      }
    });
  }

  function init() {
    wire();
    fetch(DATA_URL)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('data_load_failed')); })
      .then(function (json) {
        var rows = Array.isArray(json && json.days) ? json.days : [];
        state.all = rows;
        state.filtered = rows.slice();
        state.index = 0;
        state.resume = readResume();
        state.watched = readWatched();
        hydrateSeasonFilter(rows);
        renderSeasonCards(rows);
        renderFeaturedEpisode(rows);
        renderResume();
        renderCurrent();
        renderGrid();
        var dayInput = byId('ab-day');
        if (dayInput) {
          dayInput.max = String(rows.length);
          dayInput.placeholder = '1-' + rows.length;
        }
        var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        state.reducedMotion = !!prefersReducedMotion;
        var intervalEl = byId('ab-interval');
        if (prefersReducedMotion && intervalEl) intervalEl.value = '9000';
        var loopEl = byId('ab-loop');
        if (loopEl) state.isLooping = !!loopEl.checked;
        updateProgress();
        setStatus('Loaded ' + rows.length + ' entries. Play all for full documentary mode.');
        setEpisodeNote('Episode mode standby: select a season, then play.');
      })
      .catch(function () {
        setStatus('Action Bible documentary data could not be loaded.');
      });
  }

  function hydrateSeasonFilter(rows) {
    var select = byId('ab-season');
    if (!select) return;
    var seen = {};
    var seasons = [];
    for (var i = 0; i < rows.length; i++) {
      var season = String(rows[i].documentarySeason || '').trim();
      if (!season || seen[season]) continue;
      seen[season] = true;
      seasons.push(season);
    }
    seasons.sort();
    for (var j = 0; j < seasons.length; j++) {
      var opt = document.createElement('option');
      opt.value = seasons[j];
      opt.textContent = seasons[j];
      select.appendChild(opt);
    }
  }

  function renderSeasonCards(rows) {
    var host = byId('ab-season-cards');
    if (!host) return;
    if (!Array.isArray(rows) || !rows.length) {
      host.innerHTML = '<p class="section-note">Season trailers will appear when data is loaded.</p>';
      return;
    }
    var buckets = {};
    state.dayToSeason = {};
    for (var i = 0; i < rows.length; i++) {
      var item = rows[i] || {};
      var season = String(item.documentarySeason || '').trim() || 'Archive';
      var itemDay = Number(item.day || 0);
      if (!buckets[season]) {
        buckets[season] = {
          season: season,
          count: 0,
          first: Number(item.day || 0),
          last: Number(item.day || 0),
          testament: String(item.testament || '').trim() || 'Unknown Testament'
        };
      }
      buckets[season].count += 1;
      var day = Number(item.day || 0);
      if (day > 0 && (buckets[season].first === 0 || day < buckets[season].first)) buckets[season].first = day;
      if (day > buckets[season].last) buckets[season].last = day;
      if (itemDay > 0) state.dayToSeason[String(itemDay)] = season;
    }
    state.seasonStats = buckets;
    var cards = Object.keys(buckets).sort().map(function (key) {
      var b = buckets[key];
      return '' +
        '<article class="ab-season-card" data-season-card="' + esc(b.season) + '">' +
          '<h3>' + esc(b.season) + '</h3>' +
          '<p>' + esc(b.testament) + '</p>' +
          '<p>' + esc(String(b.count)) + ' entries · Entry ' + esc(String(b.first)) + ' to ' + esc(String(b.last)) + '</p>' +
          '<div class="ab-season-progress">' +
            '<progress data-season-progress-bar="' + esc(b.season) + '" max="' + esc(String(b.count)) + '" value="0"></progress>' +
            '<p class="ab-season-progress-label" data-season-progress-label="' + esc(b.season) + '">0% watched</p>' +
          '</div>' +
          '<button class="btn btn-secondary" type="button" data-season="' + esc(b.season) + '">Play This Season</button>' +
        '</article>';
    }).join('');
    host.innerHTML = cards;
    refreshSeasonCardProgress();
  }

  function renderFeaturedEpisode(rows) {
    var host = byId('ab-featured-episode');
    if (!host) return;
    if (!Array.isArray(rows) || !rows.length) {
      host.innerHTML = '<h3>Featured Episode</h3><p>No entries are available yet.</p>';
      return;
    }
    var seasons = [];
    var bySeason = {};
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i] || {};
      var season = String(row.documentarySeason || 'Archive').trim();
      if (!bySeason[season]) {
        bySeason[season] = [];
        seasons.push(season);
      }
      bySeason[season].push(row);
    }
    seasons.sort();
    var today = new Date();
    var seed = Number(today.getUTCFullYear()) * 1000 + Number(today.getUTCMonth() + 1) * 50 + Number(today.getUTCDate());
    var season = seasons[seed % seasons.length];
    var seasonRows = bySeason[season] || rows;
    var pick = seasonRows[Math.floor(seasonRows.length / 2)] || rows[0];
    if (!pick) return;
    host.setAttribute('data-featured-day', String(pick.day));
    host.setAttribute('data-featured-season', season);
    host.innerHTML =
      '<h3>Featured Episode · ' + esc(season) + '</h3>' +
      '<p><strong>Start point:</strong> Entry ' + esc(pick.day) + ' · ' + esc(pick.characterName) + '</p>' +
      '<p><strong>Verse anchor:</strong> ' + esc(pick.keyVerseRef) + '</p>' +
      '<p>Daily curated spotlight for a premium documentary flow.</p>' +
      '<button class="btn btn-primary" type="button" data-start-featured="true">Play Featured Episode</button>';
  }

  function refreshSeasonCardProgress() {
    var seasonCounts = {};
    var keys = Object.keys(state.watched || {});
    for (var i = 0; i < keys.length; i++) {
      var day = keys[i];
      if (!state.watched[day]) continue;
      var season = state.dayToSeason[day];
      if (!season) continue;
      seasonCounts[season] = (seasonCounts[season] || 0) + 1;
    }
    Object.keys(state.seasonStats || {}).forEach(function (season) {
      var total = Number((state.seasonStats[season] && state.seasonStats[season].count) || 0);
      var watched = Number(seasonCounts[season] || 0);
      var pct = total > 0 ? Math.round((watched / total) * 100) : 0;
      var bar = document.querySelector('progress[data-season-progress-bar="' + season.replace(/"/g, '\\"') + '"]');
      var label = document.querySelector('[data-season-progress-label="' + season.replace(/"/g, '\\"') + '"]');
      if (bar) {
        bar.max = total || 1;
        bar.value = Math.min(total || 1, watched);
      }
      if (label) label.textContent = pct + '% watched (' + watched + '/' + total + ')';
    });
    renderResume();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
