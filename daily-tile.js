(function () {
  'use strict';

  var CHARACTERS_URL = 'characters.json';
  var STREAK_KEY = 'dailyBattleStreak';
  var ARMOR_KEY = 'tdb_household_armor';
  var DAILY_HASH_KEY = 'tdb_daily_tile_device_hash';
  var FAMILY_CODE_KEY = 'tdb_family_link_code';
  var ALT_FAMILY_CODE_KEY = 'tdb_curriculum_family_id';
  var SWORD_GLOW_KEY = 'tdb_daily_tile_sword_glow';
  var CATCHUP_MAX_DAYS = 7;

  function $(id) { return document.getElementById(id); }

  function safeJsonParse(raw, fallback) {
    try {
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (e) {
      return fallback;
    }
  }

  function toDayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function parseDayKey(key) {
    var m = String(key || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return isNaN(d.getTime()) ? null : d;
  }

  function dayDiff(fromKey, toKey) {
    var from = parseDayKey(fromKey);
    var to = parseDayKey(toKey);
    if (!from || !to) return 0;
    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);
    var ms = to.getTime() - from.getTime();
    return Math.floor(ms / 86400000);
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

  function getDeviceHash() {
    try {
      if (window.TDBFamilyShared && typeof window.TDBFamilyShared.deviceHash === 'function') {
        return window.TDBFamilyShared.deviceHash();
      }
      var existing = localStorage.getItem(DAILY_HASH_KEY);
      if (existing) return existing;
      var raw = [
        navigator.userAgent || '',
        navigator.language || '',
        String(screen && screen.width || 0) + 'x' + String(screen && screen.height || 0),
        Intl.DateTimeFormat().resolvedOptions().timeZone || ''
      ].join('|');
      var created = 'daily-' + hashText(raw).toString(36);
      localStorage.setItem(DAILY_HASH_KEY, created);
      return created;
    } catch (e) {
      return 'daily-local';
    }
  }

  function readArmorData() {
    var raw = localStorage.getItem(ARMOR_KEY);
    var data = safeJsonParse(raw || '{}', {});
    var pieces = Array.isArray(data.pieces) ? data.pieces.slice(0, 6) : [];
    var count = typeof data.count === 'number' ? Math.max(0, Math.min(6, data.count)) : pieces.length;
    return { count: count, pieces: pieces, householdId: data.householdId || null };
  }

  function writeArmorData(data) {
    try {
      localStorage.setItem(ARMOR_KEY, JSON.stringify({
        count: Math.max(0, Math.min(6, Number(data.count || 0))),
        pieces: Array.isArray(data.pieces) ? data.pieces.slice(0, 6) : [],
        householdId: data.householdId || null
      }));
    } catch (e) {}
  }

  function ensureArmorPiece(pieceLabel) {
    var data = readArmorData();
    var has = data.pieces.some(function (p) { return String(p || '').toLowerCase() === String(pieceLabel).toLowerCase(); });
    if (!has) data.pieces.push(pieceLabel);
    data.count = data.pieces.length;
    writeArmorData(data);
    try {
      document.dispatchEvent(new CustomEvent('tdb-armor-updated', { detail: { source: 'daily_tile', piece: pieceLabel } }));
    } catch (e) {}
  }

  function readStreakData() {
    var data = safeJsonParse(localStorage.getItem(STREAK_KEY) || '{}', {});
    var dates = Array.isArray(data.dates) ? data.dates.slice(0, 700) : [];
    return {
      count: Number(data.count || 0) || 0,
      lastKey: data.lastKey || '',
      dates: dates
    };
  }

  function saveStreakData(next) {
    try { localStorage.setItem(STREAK_KEY, JSON.stringify(next)); } catch (e) {}
    if (typeof window.setSyncData === 'function') {
      try { window.setSyncData('streak', next); } catch (e2) {}
    }
  }

  function addStreakDayAndShield() {
    var now = new Date();
    var key = toDayKey(now);
    var data = readStreakData();
    if (data.lastKey !== key) {
      data.count = Math.max(1, data.count + 1);
      data.lastKey = key;
      if (data.dates.indexOf(key) === -1) data.dates.push(key);
      saveStreakData(data);
    }
    ensureArmorPiece('Shield of Faith');
  }

  function addCatchupDayAndShield(dayKey) {
    var key = String(dayKey || '').trim();
    if (!key) return;
    var data = readStreakData();
    if (data.dates.indexOf(key) === -1) data.dates.push(key);
    data.dates.sort();
    data.count = data.dates.length;
    var latest = data.dates[data.dates.length - 1];
    data.lastKey = latest || data.lastKey || toDayKey();
    saveStreakData(data);
    ensureArmorPiece('Shield of Faith');
  }

  function hasPiece(pieces, needle) {
    var n = String(needle || '').toLowerCase();
    for (var i = 0; i < pieces.length; i++) {
      if (String(pieces[i] || '').toLowerCase().indexOf(n) !== -1) return true;
    }
    return false;
  }

  async function getSyncedStreakCount() {
    if (typeof window.getSyncData !== 'function') return null;
    try {
      var data = await window.getSyncData('streak');
      if (data && typeof data === 'object') return Number(data.count || 0) || 0;
    } catch (e) {}
    return null;
  }

  function readFamilyLabel() {
    var code = localStorage.getItem(FAMILY_CODE_KEY) || localStorage.getItem(ALT_FAMILY_CODE_KEY) || '';
    if (!code && window.TDBFamilyShared && typeof window.TDBFamilyShared.getFamilyCode === 'function') {
      code = window.TDBFamilyShared.getFamilyCode();
    }
    if (!code) return '';
    var memberCount = 1;
    if (window.TDBFamilyShared && typeof window.TDBFamilyShared.getFamilyAggregate === 'function') {
      try {
        var fam = window.TDBFamilyShared.getFamilyAggregate(code);
        memberCount = Math.max(1, Number(fam.memberCount || 1));
      } catch (e) {}
    }
    return 'Joint walk · ' + code + ' · ' + memberCount + ' avatar' + (memberCount === 1 ? '' : 's');
  }

  async function buildUserAvatarState(useAvatarFace, characterName) {
    var armor = readArmorData();
    var localStreak = readStreakData().count;
    var syncedStreak = await getSyncedStreakCount();
    var streakCount = Math.max(localStreak, Number(syncedStreak || 0));
    var devHash = getDeviceHash();
    var faceChoices = ['🙂', '😌', '🛡', '⚔', '✨'];
    var face = useAvatarFace ? faceChoices[hashText(devHash) % faceChoices.length] : avatarBadgeFor(characterName || 'D');
    var familyLabel = readFamilyLabel();
    var swordGlow = safeJsonParse(localStorage.getItem(SWORD_GLOW_KEY) || 'false', false) === true;
    var progressDays = 0;
    try {
      var progress = safeJsonParse(localStorage.getItem('tdb_curriculum_progress_days') || '[]', []);
      progressDays = Array.isArray(progress) ? progress.length : 0;
    } catch (e) {}
    if (window.TDBFamilyShared && typeof window.TDBFamilyShared.getFamilyAggregate === 'function') {
      try {
        var code = (window.TDBFamilyShared.getFamilyCode && window.TDBFamilyShared.getFamilyCode()) || '';
        var fam = window.TDBFamilyShared.getFamilyAggregate(code);
        progressDays = Math.max(progressDays, Number(fam.mergedProgress || 0));
      } catch (e2) {}
    }
    var checkpoints = (window.TDBFamilyShared && Array.isArray(window.TDBFamilyShared.CHECKPOINTS))
      ? window.TDBFamilyShared.CHECKPOINTS.slice()
      : [73, 146, 219, 292, 365];
    var helmetByProgress = progressDays >= checkpoints[0];
    var breastplateByProgress = progressDays >= checkpoints[1];
    var beltByProgress = progressDays >= checkpoints[2];
    var shieldByProgress = progressDays >= checkpoints[3];
    var swordByProgress = progressDays >= checkpoints[4];
    var stage = null;
    if (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.getCurrentStage === 'function') {
      try { stage = window.TDBAvatarProgress.getCurrentStage(); } catch (e3) { stage = null; }
    }
    var stageTag = stage && stage.tag ? String(stage.tag) : '';
    return {
      label: useAvatarFace ? ('Your avatar' + (stageTag ? (' · ' + stageTag) : '')) : ('Story hero: ' + String(characterName || 'David')),
      face: stage && stage.face ? stage.face : face,
      helmet: hasPiece(armor.pieces, 'helmet') || helmetByProgress,
      breastplate: hasPiece(armor.pieces, 'breastplate') || breastplateByProgress,
      belt: hasPiece(armor.pieces, 'belt') || beltByProgress,
      shield: hasPiece(armor.pieces, 'shield') || shieldByProgress || streakCount >= 1,
      sword: hasPiece(armor.pieces, 'sword') || swordByProgress,
      swordGlow: swordGlow,
      progressDays: progressDays,
      familyLabel: familyLabel,
      stageTag: stageTag,
      crestEvolution: stage && stage.crestEvolution ? String(stage.crestEvolution) : ''
    };
  }

  function battleTitleFor(characterName) {
    var base = [
      'Giant Slayer',
      'Shield in the Night Watch',
      'Road of Courage',
      'Stand Firm, Walk On',
      'Sword of Quiet Strength',
      'Faith Over Fear'
    ];
    var seed = hashText(toDayKey() + '|' + characterName);
    return base[seed % base.length];
  }

  function dateLabelFromKey(key) {
    var d = parseDayKey(key);
    if (!d) return key;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function buildCatchupPanels(characterName, dayKey) {
    var label = dateLabelFromKey(dayKey);
    return [
      {
        caption: 'Catch-up for ' + label + ': ' + characterName + ' steps back onto the road.',
        kjv: 'Be ye steadfast, unmoveable, always abounding in the work of the Lord. (1 Corinthians 15:58)',
        bg: 'linear-gradient(135deg,#0f172a,#1e293b 45%,#7c3aed)'
      },
      {
        caption: 'What was missed is not wasted. Grace turns back the page.',
        kjv: 'I will restore to you the years that the locust hath eaten. (Joel 2:25)',
        bg: 'linear-gradient(135deg,#111827,#064e3b 42%,#14b8a6)'
      },
      {
        caption: 'Faith picks up the shield again, one day at a time.',
        kjv: 'Above all, taking the shield of faith. (Ephesians 6:16)',
        bg: 'linear-gradient(130deg,#1f2937,#4c1d95 42%,#a21caf)'
      },
      {
        caption: 'Catch-up complete for ' + label + '. Keep walking forward.',
        kjv: 'He restoreth my soul: he leadeth me in the paths of righteousness. (Psalm 23:3)',
        bg: 'linear-gradient(130deg,#1e1b4b,#854d0e 52%,#facc15)'
      }
    ];
  }

  function getAvatarCatchupFrames(total, fallbackFace) {
    var count = Math.max(1, Number(total || 0));
    if (window.TDBStreakCatchup && typeof window.TDBStreakCatchup.getAvatarProgressFrames === 'function') {
      return window.TDBStreakCatchup.getAvatarProgressFrames(count, fallbackFace || '🛡');
    }
    var out = [];
    for (var i = 0; i < count; i++) {
      out.push({
        label: 'Your avatar',
        face: fallbackFace || '🛡',
        helmet: i >= 1,
        breastplate: i >= 2,
        belt: i >= 3,
        shield: i >= 4,
        sword: i >= 5,
        swordGlow: i >= 5
      });
    }
    return out;
  }

  function getMissedDayKeys(lastKey, todayKey) {
    if (!lastKey || !todayKey) return [];
    var diff = dayDiff(lastKey, todayKey);
    var missed = Math.max(0, diff - 1);
    if (!missed) return [];
    var out = [];
    var base = parseDayKey(todayKey);
    for (var i = missed; i >= 1; i--) {
      var d = new Date(base.getTime());
      d.setDate(d.getDate() - i);
      out.push(toDayKey(d));
    }
    return out.slice(-CATCHUP_MAX_DAYS);
  }

  function avatarBadgeFor(name) {
    var initial = String(name || '?').trim().slice(0, 1).toUpperCase();
    return initial || '⚔';
  }

  function findCharacterAvatar(character) {
    if (!character || typeof character !== 'object') return '';
    return character.avatarLink || character.avatar || character.avatarUrl || character.image || character.imageUrl || character.portrait || '';
  }

  function setTileAvatar(character) {
    var avatarEl = $('daily-tile-avatar');
    if (!avatarEl) return;
    var src = findCharacterAvatar(character);
    if (src) {
      avatarEl.textContent = '';
      avatarEl.style.backgroundImage = 'url("' + String(src).replace(/"/g, '\\"') + '")';
      avatarEl.style.backgroundSize = 'cover';
      avatarEl.style.backgroundPosition = 'center';
      avatarEl.style.backgroundRepeat = 'no-repeat';
      return;
    }
    avatarEl.style.backgroundImage = '';
    avatarEl.style.backgroundSize = '';
    avatarEl.style.backgroundPosition = '';
    avatarEl.style.backgroundRepeat = '';
    avatarEl.textContent = avatarBadgeFor(character && character.name ? character.name : '?');
  }

  async function pickCharacter() {
    var json = await fetch(CHARACTERS_URL).then(function (r) { return r.json(); });
    var chars = Array.isArray(json && json.characters) ? json.characters : [];
    if (!chars.length) return { name: 'David' };
    var tier1 = chars.filter(function (c) { return c && c.tier === 'Tier 1'; });
    var source = tier1.length ? tier1 : chars;
    var seed = hashText(toDayKey() + '|' + getDeviceHash());
    return source[seed % source.length] || source[0];
  }

  function setTileStatus(text) {
    var el = $('daily-tile-avatar-status');
    if (el) el.textContent = text;
  }

  function setSwordGlow(on) {
    try { localStorage.setItem(SWORD_GLOW_KEY, JSON.stringify(!!on)); } catch (e) {}
  }

  async function launchStory(character, title) {
    if (!window.TDBCartoonPlayer || typeof window.TDBCartoonPlayer.open !== 'function') return;
    var useMyAvatar = !!(($('daily-tile-use-avatar') || {}).checked);
    var userAvatar = await buildUserAvatarState(useMyAvatar, character && character.name ? character.name : 'David');
    window.TDBCartoonPlayer.open({
      characterName: character.name || 'David',
      battleTitle: title,
      useMyAvatar: useMyAvatar,
      userAvatar: userAvatar,
      hooks: {
        onComplete: function () {
          addStreakDayAndShield();
          setTileStatus('Shield locked from streak progress. Keep walking the golden road.');
          if (typeof window.trackEvent === 'function') window.trackEvent('daily_tile_story_complete', { source: 'home' });
        },
        onPraySilent: function () {
          ensureArmorPiece('Helmet of Salvation');
          setTileStatus('Helmet snapped on after silent prayer.');
          if (typeof window.trackEvent === 'function') window.trackEvent('daily_tile_silent_prayer', { source: 'home' });
        },
        onShare: function () {
          ensureArmorPiece('Sword of the Spirit');
          setSwordGlow(true);
          setTileStatus('Sword glows after sharing your battle.');
          var text = 'Walking today\'s battle on Today\'s Daily Battle — join me.';
          var url = window.location.href;
          if (navigator.share) {
            navigator.share({ title: 'Today\'s Battle', text: text, url: url }).catch(function () {});
          } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text + ' ' + url).catch(function () {});
          }
          if (typeof window.trackEvent === 'function') window.trackEvent('daily_tile_share', { source: 'home' });
        }
      }
    });
  }

  function init() {
    var useAvatarCb = $('daily-tile-use-avatar');
    var tile = $('daily-tile-home');
    var watchBtn = $('daily-tile-watch-btn');
    var charEl = $('daily-tile-character');
    var titleEl = $('daily-tile-title');
    var avatarEl = $('daily-tile-avatar');
    if (!tile || !watchBtn || !charEl || !titleEl || !avatarEl) return;

    pickCharacter().then(function (character) {
      var charName = (character && character.name) ? character.name : 'David';
      var title = battleTitleFor(charName);
      charEl.textContent = 'Character: ' + charName + ' (plain suit start)';
      titleEl.textContent = title;
      setTileAvatar(character);
      var s = (window.TDBAvatarProgress && typeof window.TDBAvatarProgress.getCurrentStage === 'function')
        ? window.TDBAvatarProgress.getCurrentStage()
        : null;
      if (s && s.tag) {
        setTileStatus(s.tag + ' · ' + (s.title || '') + ' · ' + (s.crestEvolution || ''));
      } else {
        setTileStatus('Use My Avatar is on. Device-safe avatar hash only; no private data leaves your device.');
      }

      var streak = readStreakData();
      var missedKeys = getMissedDayKeys(streak.lastKey, toDayKey());
      if (missedKeys.length) {
        var catchupWrap = document.createElement('div');
        catchupWrap.className = 'daily-tile-catchup-wrap';
        var catchupLabel = document.createElement('p');
        catchupLabel.className = 'section-note util-mb-0';
        catchupLabel.textContent = 'Catch what you missed - watch the last ' + missedKeys.length + ' tiles?';
        var catchupBtn = document.createElement('button');
        catchupBtn.type = 'button';
        catchupBtn.className = 'btn btn-secondary daily-tile-catchup-btn';
        catchupBtn.textContent = 'Play catch-up';
        catchupWrap.appendChild(catchupLabel);
        catchupWrap.appendChild(catchupBtn);
        tile.appendChild(catchupWrap);

        catchupBtn.addEventListener('click', function () {
          if (!window.TDBCartoonPlayer || typeof window.TDBCartoonPlayer.open !== 'function') return;
          catchupBtn.disabled = true;
          var queue = missedKeys.slice();
          var done = 0;
          var useMyAvatar = true;
          var avatarFrames = getAvatarCatchupFrames(missedKeys.length, '🛡');

          function playNext() {
            if (!queue.length) {
              catchupBtn.disabled = false;
              catchupLabel.textContent = 'Catch-up complete. You are back on track.';
              setTileStatus('Catch-up finished: replayed ' + done + ' missed tile' + (done === 1 ? '' : 's') + '.');
              return;
            }
            var dayKey = queue.shift();
            var storyChar = { name: 'Your Avatar' };
            var modeLabel = 'Streak Catch-up · ' + (done + 1) + '/' + missedKeys.length + ' · ' + dateLabelFromKey(dayKey);
            var frame = avatarFrames[Math.min(done, avatarFrames.length - 1)] || {};
            buildUserAvatarState(useMyAvatar, 'Your Avatar').then(function (userAvatar) {
              userAvatar = Object.assign({}, userAvatar || {}, frame || {}, { label: 'Your avatar' });
              window.TDBCartoonPlayer.open({
                characterName: 'Your Avatar',
                battleTitle: 'Catch-up: ' + dateLabelFromKey(dayKey),
                useMyAvatar: useMyAvatar,
                userAvatar: userAvatar,
                panels: buildCatchupPanels('Your avatar', dayKey),
                modeLabel: modeLabel,
                hooks: {
                  onComplete: function () {
                    addCatchupDayAndShield(dayKey);
                    done += 1;
                  },
                  onClose: function () {
                    setTimeout(playNext, 220);
                  }
                },
                options: {
                  autoCloseAfterCompleteMs: 900
                }
              });
            });
          }

          playNext();
        });
      }

      if (useAvatarCb) {
        useAvatarCb.addEventListener('change', function () {
          if (useAvatarCb.checked) {
            setTileStatus('Using your hashed local avatar state. No private profile data leaves your device.');
          } else {
            setTileStatus('Using story character face. You can switch back to your avatar any time.');
          }
        });
      }
      watchBtn.addEventListener('click', function () { launchStory(character, title); });
    }).catch(function () {
      charEl.textContent = 'Character: David (plain suit start)';
      titleEl.textContent = 'Giant Slayer';
      setTileAvatar({ name: 'David' });
      watchBtn.addEventListener('click', function () {
        launchStory({ name: 'David' }, 'Giant Slayer');
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
