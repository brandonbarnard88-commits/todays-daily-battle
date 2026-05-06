(function () {
  'use strict';

  var CHARACTERS_URL = 'characters.json';
  var STREAK_KEY = 'dailyBattleStreak';
  var ARMOR_KEY = 'tdb_household_armor';
  var DAILY_HASH_KEY = 'tdb_daily_tile_device_hash';
  var FAMILY_CODE_KEY = 'tdb_family_link_code';
  var ALT_FAMILY_CODE_KEY = 'tdb_curriculum_family_id';
  var SWORD_GLOW_KEY = 'tdb_daily_tile_sword_glow';
  var REALISM_KEY = 'tdb_daily_tile_realism_v1';
  var CATCHUP_MAX_DAYS = 7;
  var FEMALE_BIBLE_NAMES = {
    eve: true, sarah: true, rebekah: true, rachel: true, leah: true, miriam: true,
    rahab: true, deborah: true, ruth: true, hannah: true, esther: true, naomi: true,
    abigail: true, bathsheba: true, elizabeth: true, mary: true, martha: true, lydia: true,
    priscilla: true, lois: true, eunice: true, delilah: true, jezebel: true, tamar: true,
    salome: true, anna: true, phoebe: true, sapphira: true, joanna: true, susanna: true
  };
  var NEW_TESTAMENT_BOOKS = {
    matthew: true, mark: true, luke: true, john: true, acts: true, romans: true,
    '1 corinthians': true, '2 corinthians': true, galatians: true, ephesians: true,
    philippians: true, colossians: true, '1 thessalonians': true, '2 thessalonians': true,
    '1 timothy': true, '2 timothy': true, titus: true, philemon: true, hebrews: true,
    james: true, '1 peter': true, '2 peter': true, '1 john': true, '2 john': true,
    '3 john': true, jude: true, revelation: true
  };

  function $(id) { return document.getElementById(id); }

  function safeJsonParse(raw, fallback) {
    try {
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (e) {
      return fallback;
    }
  }

  function sanitizeRealism(value) {
    var v = String(value || '').trim().toLowerCase();
    if (v === 'balanced' || v === 'detailed' || v === 'ultra') return v;
    return 'detailed';
  }

  function getPortraitRealism() {
    try {
      return sanitizeRealism(localStorage.getItem(REALISM_KEY) || 'detailed');
    } catch (e) {
      return 'detailed';
    }
  }

  function setPortraitRealism(value) {
    var v = sanitizeRealism(value);
    try { localStorage.setItem(REALISM_KEY, v); } catch (e) {}
    return v;
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
    var portraitUrl = portraitUrlForCharacter(characterName, useAvatarFace);
    var gender = /esther|ruth/i.test(String(characterName || '')) ? 'female' : 'male';
    return {
      label: useAvatarFace ? ('Your avatar' + (stageTag ? (' · ' + stageTag) : '')) : ('Story hero: ' + String(characterName || 'David')),
      face: stage && stage.face ? stage.face : face,
      portraitUrl: portraitUrl,
      gender: gender,
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

  function portraitUrlForCharacter(characterName, useAvatarFace) {
    if (useAvatarFace) return '/icons/avatar-portrait-scout.svg';
    var key = String(characterName || '').toLowerCase();
    if (key.indexOf('moses') !== -1) return '/icons/avatar-portrait-moses.svg';
    if (key.indexOf('esther') !== -1) return '/icons/avatar-portrait-esther.svg';
    if (key.indexOf('ruth') !== -1) return '/icons/avatar-portrait-ruth.svg';
    if (key.indexOf('paul') !== -1) return '/icons/avatar-portrait-paul.svg';
    if (key.indexOf('david') !== -1) return '/icons/avatar-portrait-david.svg';
    return '/icons/avatar-portrait-scout.svg';
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

  function inferCharacterGender(character) {
    var explicit = String((character && (character.characterGender || character.gender || character.sex)) || '').trim().toLowerCase();
    if (explicit === 'female' || explicit === 'male') return explicit;
    var first = String((character && character.name) || '').trim().toLowerCase().split(/\s+/)[0] || '';
    return FEMALE_BIBLE_NAMES[first] ? 'female' : 'male';
  }

  function bookFromRef(ref) {
    var m = String(ref || '').trim().match(/^(.+?)\s+\d+:\d+/);
    return m ? m[1].toLowerCase() : '';
  }

  function buildCharacterAvatarDataUri(character, realism) {
    if (!character || typeof character !== 'object') return '';
    var name = String(character.name || '').trim() || 'Witness';
    var verseRef = String(character.keyKJVVerse || character.keyVerseRef || '').trim();
    var tier = String(character.tier || 'Tier 2').trim().toLowerCase();
    var seed = hashText(name + '|' + verseRef + '|' + tier);
    var gender = inferCharacterGender(character);
    var nt = !!NEW_TESTAMENT_BOOKS[bookFromRef(verseRef)];
    var lowerName = name.toLowerCase();
    var realismMode = sanitizeRealism(realism || getPortraitRealism());
    var isBalanced = realismMode === 'balanced';
    var isUltra = realismMode === 'ultra';

    var skinTones = ['#F2D3B0', '#E8C09A', '#D9A47B', '#BA7E55', '#8F5E3B'];
    var hairTones = ['#1F2937', '#3F2A1F', '#6B4226', '#111827', '#4A2D1A'];
    var oldRobe = ['#7C2D12', '#4C1D95', '#14532D', '#1E3A8A', '#9A3412'];
    var oldMantle = ['#D6B98E', '#C4B5FD', '#86EFAC', '#93C5FD', '#FDBA74'];
    var newRobe = ['#1E3A8A', '#0F766E', '#4338CA', '#374151', '#7C3AED'];
    var newMantle = ['#BFDBFE', '#99F6E4', '#C4B5FD', '#E5E7EB', '#DDD6FE'];
    var accent = ['#F59E0B', '#EAB308', '#60A5FA', '#34D399', '#F472B6'];

    var skin = skinTones[seed % skinTones.length];
    var hair = hairTones[(seed >>> 3) % hairTones.length];
    var robe = (nt ? newRobe : oldRobe)[(seed >>> 5) % (nt ? newRobe.length : oldRobe.length)];
    var mantle = (nt ? newMantle : oldMantle)[(seed >>> 7) % (nt ? newMantle.length : oldMantle.length)];
    var trim = accent[(seed >>> 9) % accent.length];

    var ageBand = 'adult';
    if (/samuel|david|timothy|josiah|jeremiah|mary/.test(lowerName)) ageBand = 'youth';
    if (/abraham|moses|aaron|elizabeth|sarah|noah|jacob|isaac|anna|zechariah/.test(lowerName) || tier === 'tier 1') ageBand = 'elder';

    var role = 'witness';
    if (/solomon|david|saul|esther|hezekiah|josiah/.test(lowerName)) role = 'king';
    else if (/moses|aaron|elijah|elisha|isaiah|jeremiah|ezekiel|daniel|hosea|joel|amos|jonah|micah|zechariah|malachi|john/.test(lowerName)) role = 'prophet';
    else if (/peter|paul|james|timothy|titus|barnabas|silas|luke/.test(lowerName)) role = 'apostle';
    else if (/levi|aaron|ezra|zacharias/.test(lowerName)) role = 'priest';
    else if (/abel|david|amos|jacob|isaac|rachel|rehoboam/.test(lowerName)) role = 'shepherd';

    var beard = (gender === 'male') && ageBand !== 'youth' && !/john|samuel|david|daniel|joseph/.test(lowerName);
    var hasCrown = role === 'king';
    var hasVeil = gender === 'female';
    var hasStaff = role === 'prophet' || role === 'shepherd';
    var hasScroll = role === 'apostle' || role === 'priest';
    var hasWarriorStrap = role === 'king' || /joshua|gideon|samson|saul|david/.test(lowerName);
    var hasScar = isUltra && hasWarriorStrap && (seed % 2 === 0);
    var eyeOffset = (seed % 3) - 1;
    var eyeY = 32.8 + eyeOffset;
    var browY = 29.6 + eyeOffset;
    var noseBridgeY = 34.2 + eyeOffset;
    var mouthY = 40.3 + eyeOffset;
    var iris = accent[(seed >>> 11) % accent.length];
    var faceShapeAlt = (seed & 1) === 0;
    var jawHighlight = (seed & 2) === 2;
    var shoulderSlope = (seed & 4) === 4 ? 1 : 0;
    var leftEyeX = 58.7;
    var rightEyeX = 69.3;
    var femaleHairStrands = hasVeil
      ? '<path d="M52.2 35.8C52.2 49.2 44.1 59.8 40 71.2C48.8 66.8 53.2 61.1 57.1 55.2" stroke="' + hair + '" stroke-width="5.1" stroke-linecap="round"/>'
        + '<path d="M75.8 35.8C75.8 49.2 83.9 59.8 88 71.2C79.2 66.8 74.8 61.1 70.9 55.2" stroke="' + hair + '" stroke-width="5.1" stroke-linecap="round"/>'
      : '';
    var tierLines = !isBalanced && ageBand === 'elder'
      ? '<path d="M55 27.3H59.2" stroke="rgba(15,23,42,0.2)" stroke-width="1"/><path d="M68.8 27.3H73" stroke="rgba(15,23,42,0.2)" stroke-width="1"/>'
      : '';
    var youthSoften = !isBalanced && ageBand === 'youth'
      ? '<ellipse cx="58.8" cy="41.3" rx="1.8" ry="0.9" fill="rgba(255,182,193,0.22)"/><ellipse cx="69.2" cy="41.3" rx="1.8" ry="0.9" fill="rgba(255,182,193,0.22)"/>'
      : '';
    var elderNaso = !isBalanced && ageBand === 'elder'
      ? '<path d="M59.6 38.8C60.2 40.1 60.2 41.2 59.6 42.2" stroke="rgba(124,74,45,0.26)" stroke-width="0.8" stroke-linecap="round"/><path d="M68.4 38.8C67.8 40.1 67.8 41.2 68.4 42.2" stroke="rgba(124,74,45,0.26)" stroke-width="0.8" stroke-linecap="round"/>'
      : '';
    var roleAdornment = role === 'priest'
      ? '<rect x="56.5" y="57.6" width="15" height="9" rx="2" fill="#D4AF37"/><rect x="59" y="60" width="10" height="4" rx="1" fill="#FEF3C7"/>'
      : role === 'apostle'
        ? '<path d="M74 72H86V78H74Z" fill="#E5E7EB"/><path d="M74 72L78 70" stroke="#9CA3AF" stroke-width="1"/><path d="M86 72L82 70" stroke="#9CA3AF" stroke-width="1"/>'
        : role === 'shepherd'
          ? '<ellipse cx="54" cy="77.6" rx="4.6" ry="2.2" fill="#7C5A33"/>'
          : '';

    var detailedSvg = ''
      + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">'
      + '<rect width="128" height="128" rx="64" fill="#0B1220"/>'
      + '<ellipse cx="64" cy="44" rx="35" ry="29" fill="rgba(255,255,255,0.04)"/>'
      + '<circle cx="64" cy="64" r="56" stroke="rgba(248,250,252,0.22)" stroke-width="2"/>'
      + (hasCrown ? '<path d="M44 23L52 14L64 22L76 14L84 23V29H44V23Z" fill="#FBBF24"/>' : '')
      + (hasVeil ? '<path d="M48 31C48 22 55 16 64 16C73 16 80 22 80 31V52H48V31Z" fill="' + mantle + '"/>' : '')
      + (faceShapeAlt
        ? '<ellipse cx="64" cy="33.5" rx="12.1" ry="13.2" fill="' + skin + '"/>'
        : '<path d="M52.2 31.2C52.2 23.4 57.2 20.2 64 20.2C70.8 20.2 75.8 23.4 75.8 31.2V37.4C75.8 44.5 70.8 47.7 64 47.7C57.2 47.7 52.2 44.5 52.2 37.4V31.2Z" fill="' + skin + '"/>')
      + (isBalanced ? '' : '<ellipse cx="60.3" cy="33.5" rx="3.6" ry="2.3" fill="rgba(255,255,255,0.11)"/>')
      + (isBalanced ? '' : '<ellipse cx="67.9" cy="33.5" rx="3.6" ry="2.3" fill="rgba(255,255,255,0.11)"/>')
      + '<path d="M52 33C52 24 57 19 64 19C71 19 76 24 76 33V36H52V33Z" fill="' + hair + '"/>'
      + femaleHairStrands
      + '<path d="M56.4 ' + browY + 'C57.8 ' + (browY - 0.9) + ' 59.4 ' + (browY - 0.9) + ' 60.8 ' + browY + '" stroke="#1F2937" stroke-width="1.4" stroke-linecap="round"/>'
      + '<path d="M67.2 ' + browY + 'C68.6 ' + (browY - 0.9) + ' 70.2 ' + (browY - 0.9) + ' 71.6 ' + browY + '" stroke="#1F2937" stroke-width="1.4" stroke-linecap="round"/>'
      + '<ellipse cx="' + leftEyeX + '" cy="' + eyeY + '" rx="2.2" ry="1.7" fill="#F8FAFC"/>'
      + '<ellipse cx="' + rightEyeX + '" cy="' + eyeY + '" rx="2.2" ry="1.7" fill="#F8FAFC"/>'
      + '<circle cx="' + leftEyeX + '" cy="' + eyeY + '" r="0.92" fill="' + iris + '"/>'
      + '<circle cx="' + rightEyeX + '" cy="' + eyeY + '" r="0.92" fill="' + iris + '"/>'
      + '<circle cx="' + leftEyeX + '" cy="' + eyeY + '" r="0.48" fill="#0F172A"/>'
      + '<circle cx="' + rightEyeX + '" cy="' + eyeY + '" r="0.48" fill="#0F172A"/>'
      + (isBalanced ? '' : '<circle cx="' + (leftEyeX - 0.4) + '" cy="' + (eyeY - 0.4) + '" r="0.2" fill="#FFFFFF"/>')
      + (isBalanced ? '' : '<circle cx="' + (rightEyeX - 0.4) + '" cy="' + (eyeY - 0.4) + '" r="0.2" fill="#FFFFFF"/>')
      + '<path d="M64 ' + noseBridgeY + 'L63.6 ' + (noseBridgeY + 2.6) + 'C63.5 ' + (noseBridgeY + 3.2) + ' 64.2 ' + (noseBridgeY + 3.5) + ' 64.8 ' + (noseBridgeY + 3.2) + '" stroke="rgba(124,74,45,0.45)" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<ellipse cx="56.7" cy="38.2" rx="2.1" ry="1.05" fill="rgba(124,74,45,0.14)"/>'
      + '<ellipse cx="71.3" cy="38.2" rx="2.1" ry="1.05" fill="rgba(124,74,45,0.14)"/>'
      + youthSoften
      + elderNaso
      + '<path d="M59.6 ' + mouthY + 'C60.9 ' + (mouthY + 1.2) + ' 62.5 ' + (mouthY + 1.8) + ' 64 ' + (mouthY + 1.8) + 'C65.5 ' + (mouthY + 1.8) + ' 67.1 ' + (mouthY + 1.2) + ' 68.4 ' + mouthY + '" stroke="#7C4A2D" stroke-width="1.55" stroke-linecap="round"/>'
      + (isBalanced ? '' : '<path d="M60.7 ' + (mouthY + 0.4) + 'H67.3" stroke="rgba(255,255,255,0.2)" stroke-width="0.6" stroke-linecap="round"/>')
      + (!isBalanced && jawHighlight ? '<path d="M56.2 43.5C58.6 45.4 61.2 46.2 64 46.2C66.8 46.2 69.4 45.4 71.8 43.5" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" stroke-linecap="round"/>' : '')
      + (hasScar ? '<path d="M71.4 31.2L69.7 35.9" stroke="rgba(153,27,27,0.55)" stroke-width="0.95" stroke-linecap="round"/>' : '')
      + (beard ? '<path d="M57 40C58 44 60 47 64 47C68 47 70 44 71 40" fill="' + hair + '"/>' : '')
      + tierLines
      + '<rect x="60" y="45" width="8" height="5" rx="2" fill="' + skin + '"/>'
      + '<path d="M41 ' + (57 + shoulderSlope) + 'C45 48 52 45 64 45C76 45 83 48 87 ' + (57 - shoulderSlope) + 'L83 95H45L41 ' + (57 + shoulderSlope) + 'Z" fill="' + robe + '"/>'
      + '<path d="M49 56L64 50L79 56L75 88H53L49 56Z" fill="' + mantle + '"/>'
      + '<path d="M58 58H70V87H58V58Z" fill="' + robe + '"/>'
      + (hasWarriorStrap ? '<path d="M54 56L72 84" stroke="rgba(45,23,12,0.56)" stroke-width="2.1" stroke-linecap="round"/>' : '')
      + roleAdornment
      + '<path d="M53 88H75L79 96H49L53 88Z" fill="rgba(15,23,42,0.32)"/>'
      + (isBalanced ? '' : '<path d="M49 63C54 66 58 67 64 67C70 67 74 66 79 63" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>')
      + (isBalanced ? '' : '<path d="M51 71C55 73 59 74 64 74C69 74 73 73 77 71" stroke="rgba(255,255,255,0.15)" stroke-width="0.9"/>')
      + '<path d="M58 68H70" stroke="' + trim + '" stroke-width="3" stroke-linecap="round"/>'
      + '<path d="M58 76H70" stroke="' + trim + '" stroke-width="3" stroke-linecap="round"/>'
      + '<path d="M48.5 61.2L40.2 83.4" stroke="' + mantle + '" stroke-width="6" stroke-linecap="round"/>'
      + '<path d="M79.5 61.2L87.8 83.4" stroke="' + mantle + '" stroke-width="6" stroke-linecap="round"/>'
      + (isBalanced ? '' : '<path d="M43.2 77.3L40.4 83.7" stroke="rgba(255,255,255,0.24)" stroke-width="1" stroke-linecap="round"/>')
      + (isBalanced ? '' : '<path d="M84.8 77.3L87.6 83.7" stroke="rgba(255,255,255,0.24)" stroke-width="1" stroke-linecap="round"/>')
      + '<ellipse cx="39.9" cy="84.2" rx="3.1" ry="3.4" fill="' + skin + '"/>'
      + '<ellipse cx="88.1" cy="84.2" rx="3.1" ry="3.4" fill="' + skin + '"/>'
      + (hasStaff ? '<path d="M90 62L95 98" stroke="#B45309" stroke-width="3" stroke-linecap="round"/>' : '')
      + '<path d="M55 95H62V108H55Z" fill="#1F2937"/>'
      + '<path d="M66 95H73V108H66Z" fill="#1F2937"/>'
      + (isBalanced ? '' : '<path d="M55 99H62" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>')
      + (isBalanced ? '' : '<path d="M66 99H73" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>')
      + '<rect x="52.6" y="107.4" width="9.6" height="4.2" rx="2" fill="#111827"/>'
      + '<rect x="65.8" y="107.4" width="9.6" height="4.2" rx="2" fill="#111827"/>'
      + (isUltra ? '<path d="M52.8 109.2H61.8" stroke="rgba(255,255,255,0.15)" stroke-width="0.7"/>' : '')
      + (isUltra ? '<path d="M66 109.2H75" stroke="rgba(255,255,255,0.15)" stroke-width="0.7"/>' : '')
      + '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(detailedSvg);
  }

  function findCharacterAvatar(character) {
    if (!character || typeof character !== 'object') return '';
    return character.avatarLink || character.avatar || character.avatarUrl || character.image || character.imageUrl || character.portrait || '';
  }

  function setTileAvatar(character) {
    var avatarEl = $('daily-tile-avatar');
    if (!avatarEl) return;
    var src = findCharacterAvatar(character);
    var generated = '';
    if (!src) generated = buildCharacterAvatarDataUri(character, getPortraitRealism());
    if (!src && generated) src = generated;
    if (src) {
      avatarEl.classList.remove('tdb-avatar-has-photo');
      avatarEl.classList.add('tdb-avatar-no-photo');
      avatarEl.textContent = '';
      avatarEl.style.backgroundImage = '';
      avatarEl.style.backgroundSize = '';
      avatarEl.style.backgroundPosition = '';
      avatarEl.style.backgroundRepeat = '';
      avatarEl.style.setProperty('--tdb-avatar-emblem', 'url("' + String(src).replace(/"/g, '\\"') + '")');
      avatarEl.style.setProperty('--tdb-avatar-render-size', generated ? '78% auto' : 'cover');
      return;
    }
    avatarEl.classList.remove('tdb-avatar-has-photo');
    avatarEl.classList.add('tdb-avatar-no-photo');
    avatarEl.style.backgroundImage = '';
    avatarEl.style.backgroundSize = '';
    avatarEl.style.backgroundPosition = '';
    avatarEl.style.backgroundRepeat = '';
    avatarEl.style.removeProperty('--tdb-avatar-emblem');
    avatarEl.style.removeProperty('--tdb-avatar-render-size');
    avatarEl.textContent = '';
  }

  async function pickCharacter() {
    var timeoutMs = 5000;
    var timeoutPromise = new Promise(function (_resolve, reject) {
      setTimeout(function () { reject(new Error('character_fetch_timeout')); }, timeoutMs);
    });
    var json = await Promise.race([
      fetch(CHARACTERS_URL).then(function (r) { return r.json(); }),
      timeoutPromise
    ]);
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
    if (typeof window !== 'undefined') window.__tdbDailyTileWatchLastRun = Date.now();
    try {
      localStorage.setItem('tdb_nba_last_watch_at', String(Date.now()));
    } catch (e0) {}
    if (window.__tdbStartWatchLaunchTransition && typeof window.__tdbStartWatchLaunchTransition === 'function') {
      window.__tdbStartWatchLaunchTransition();
    }
    if (!window.TDBCartoonPlayer || typeof window.TDBCartoonPlayer.open !== 'function') {
      setTileStatus('Story player is still loading. Try again in a moment.');
      var dailyBtn = $('daily-btn');
      if (dailyBtn && typeof dailyBtn.click === 'function') {
        setTimeout(function () { dailyBtn.click(); }, 120);
      }
      return;
    }
    var useMyAvatar = !!(($('daily-tile-use-avatar') || {}).checked);
    var userAvatar = await buildUserAvatarState(useMyAvatar, character && character.name ? character.name : 'David');
    window.TDBCartoonPlayer.open({
      characterName: character.name || 'David',
      battleTitle: title,
      userInitiated: true,
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
    if (window.__tdbMaybeCelebrateFirstWinFromWatch && typeof window.__tdbMaybeCelebrateFirstWinFromWatch === 'function') {
      window.__tdbMaybeCelebrateFirstWinFromWatch();
    }
  }

  function init() {
    var useAvatarCb = $('daily-tile-use-avatar');
    var realismSelect = $('daily-tile-realism-select');
    var avatarChoiceSelect = $('daily-tile-avatar-choice');
    var tile = $('daily-tile-home');
    var watchBtn = $('daily-tile-watch-btn');
    var charEl = $('daily-tile-character');
    var titleEl = $('daily-tile-title');
    var avatarEl = $('daily-tile-avatar');
    if (!tile || !watchBtn || !charEl || !titleEl || !avatarEl) return;
    var activeCharacter = { name: 'David' };
    var activeTitle = 'Giant Slayer';
    var watchLocked = false;

    watchBtn.addEventListener('click', function () {
      if (watchLocked) return;
      watchLocked = true;
      watchBtn.disabled = true;
      Promise.resolve(launchStory(activeCharacter, activeTitle)).finally(function () {
        watchLocked = false;
        watchBtn.disabled = false;
      });
    });

    if (realismSelect) {
      realismSelect.value = getPortraitRealism();
      realismSelect.addEventListener('change', function () {
        var mode = setPortraitRealism(realismSelect.value);
        setTileAvatar(activeCharacter || { name: 'David' });
        setTileStatus('Portrait realism: ' + mode + '.');
      });
    }

    document.addEventListener('tdb:avatar-choice-updated', function () {
      setTileAvatar(activeCharacter || { name: 'David' });
    });

    pickCharacter().then(function (character) {
      activeCharacter = character || { name: 'David' };
      var charName = (character && character.name) ? character.name : 'David';
      var title = battleTitleFor(charName);
      activeTitle = title;
      charEl.textContent = 'Character: ' + charName + ' (character-tailored portrait)';
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
                userInitiated: true,
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
                  showEndPanel: false,
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
      if (avatarChoiceSelect && !avatarChoiceSelect.value) avatarChoiceSelect.value = 'auto';
    }).catch(function () {
      activeCharacter = { name: 'David' };
      activeTitle = 'Giant Slayer';
      charEl.textContent = 'Character: David (character-tailored portrait)';
      titleEl.textContent = 'Giant Slayer';
      setTileAvatar({ name: 'David' });
      setTileStatus('Loaded fallback character. Tap Watch to start your story.');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
