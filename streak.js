(function () {
  'use strict';

  var AVATAR_PROGRESS_KEY = 'avatar-progress';

  function safeParse(raw, fallback) {
    try {
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (e) {
      return fallback;
    }
  }

  function hasPiece(pieces, needle) {
    var list = Array.isArray(pieces) ? pieces : [];
    var n = String(needle || '').toLowerCase();
    for (var i = 0; i < list.length; i++) {
      if (String(list[i] || '').toLowerCase().indexOf(n) !== -1) return true;
    }
    return false;
  }

  function normalizeFrame(raw, fallbackFace) {
    var item = raw && typeof raw === 'object' ? raw : {};
    var pieces = Array.isArray(item.pieces) ? item.pieces : [];
    return {
      label: String(item.label || 'Your avatar'),
      face: String(item.face || fallbackFace || '🛡'),
      helmet: !!item.helmet || hasPiece(pieces, 'helmet'),
      breastplate: !!item.breastplate || hasPiece(pieces, 'breastplate'),
      belt: !!item.belt || hasPiece(pieces, 'belt'),
      shield: !!item.shield || hasPiece(pieces, 'shield'),
      sword: !!item.sword || hasPiece(pieces, 'sword'),
      swordGlow: !!item.swordGlow || hasPiece(pieces, 'glow')
    };
  }

  function fallbackFrames(total, fallbackFace) {
    var out = [];
    for (var i = 0; i < total; i++) {
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

  function getAvatarProgressFrames(total, fallbackFace) {
    var count = Math.max(1, Number(total || 0));
    var raw = safeParse(localStorage.getItem(AVATAR_PROGRESS_KEY) || '[]', []);
    if (!Array.isArray(raw) || !raw.length) return fallbackFrames(count, fallbackFace);
    var normalized = raw.map(function (entry) {
      return normalizeFrame(entry, fallbackFace);
    });
    var out = [];
    for (var i = 0; i < count; i++) {
      out.push(normalized[Math.min(i, normalized.length - 1)]);
    }
    return out;
  }

  window.TDBStreakCatchup = {
    getAvatarProgressFrames: getAvatarProgressFrames
  };
})();
