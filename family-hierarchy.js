(function () {
  'use strict';

  var FAMILY_KEY = 'tdb_family_link_code';
  var FAMILY_REGISTRY_KEY = 'tdb_family_registry_v1';
  var AVATAR_KEY = 'tdb_device_avatar_seed';
  var ROLE_KEY = 'tdb_family_role_v1';

  function safeParse(raw, fallback) {
    try {
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function readRegistry() {
    return safeParse(localStorage.getItem(FAMILY_REGISTRY_KEY) || '{}', {});
  }

  function writeRegistry(registry) {
    try { localStorage.setItem(FAMILY_REGISTRY_KEY, JSON.stringify(registry || {})); } catch (e) {}
  }

  function isChurchCode(code) {
    return /^church-/i.test(String(code || '').trim());
  }

  function getFamilyCode() {
    var code = '';
    try { code = String(localStorage.getItem(FAMILY_KEY) || '').trim(); } catch (e) {}
    if (code) return code;
    code = 'household-' + Math.random().toString(36).slice(2, 8);
    try { localStorage.setItem(FAMILY_KEY, code); } catch (e2) {}
    return code;
  }

  function setFamilyCode(code) {
    var next = String(code || '').trim();
    if (!next) return '';
    try { localStorage.setItem(FAMILY_KEY, next); } catch (e) {}
    return next;
  }

  function deviceHash() {
    try {
      var cached = localStorage.getItem(AVATAR_KEY);
      if (cached) return cached;
      var raw = [
        navigator.userAgent || '',
        navigator.language || '',
        String(screen && screen.width || 0) + 'x' + String(screen && screen.height || 0),
        Intl.DateTimeFormat().resolvedOptions().timeZone || ''
      ].join('|');
      var h = 2166136261;
      for (var i = 0; i < raw.length; i++) {
        h ^= raw.charCodeAt(i);
        h = (h * 16777619) >>> 0;
      }
      var out = 'avatar-' + h.toString(36);
      localStorage.setItem(AVATAR_KEY, out);
      return out;
    } catch (e) {
      return 'avatar-local';
    }
  }

  function pickBrotherSister(seed) {
    var h = 0;
    var s = String(seed || '');
    for (var i = 0; i < s.length; i++) h = (h + s.charCodeAt(i)) % 1000;
    return (h % 2 === 0) ? 'Brother' : 'Sister';
  }

  function getRole() {
    var role = '';
    try { role = String(localStorage.getItem(ROLE_KEY) || '').toLowerCase(); } catch (e) {}
    if (role === 'parent' || role === 'kid') return role;
    return '';
  }

  function setRole(role) {
    var next = String(role || '').toLowerCase();
    if (next !== 'parent' && next !== 'kid') next = 'parent';
    try { localStorage.setItem(ROLE_KEY, next); } catch (e) {}
    return next;
  }

  function ensureMember(code, progress, gems, options) {
    var opts = options && typeof options === 'object' ? options : {};
    var familyCode = String(code || getFamilyCode());
    var registry = readRegistry();
    if (!registry[familyCode]) registry[familyCode] = { members: {}, updatedAt: Date.now() };
    if (!registry[familyCode].members) registry[familyCode].members = {};

    var id = deviceHash();
    var members = registry[familyCode].members;
    var member = members[id] || {};
    var existingIds = Object.keys(members);
    var role = opts.role || getRole() || (existingIds.length === 0 ? 'parent' : 'kid');
    if (role !== 'parent' && role !== 'kid') role = 'parent';
    setRole(role);

    member.avatarId = id;
    member.progress = Number(progress || member.progress || 0);
    member.gems = Number(gems || member.gems || 0);
    member.role = role;
    member.parentId = opts.parentId || member.parentId || '';
    member.linked = !!(member.parentId || role === 'parent');
    member.updatedAt = Date.now();
    members[id] = member;
    registry[familyCode].updatedAt = Date.now();
    writeRegistry(registry);
    document.dispatchEvent(new CustomEvent('tdb-family-updated', {
      detail: {
        code: familyCode,
        member: member,
        family: getFamilyAggregate(familyCode)
      }
    }));
    return member;
  }

  function resolveLinkInput(rawInput) {
    var raw = String(rawInput || '').trim();
    if (!raw) return { ok: false, reason: 'missing' };
    if (/^merge:/i.test(raw)) {
      var parts = raw.split(':');
      if (parts.length < 3) return { ok: false, reason: 'invalid_merge_code' };
      var code = String(parts[1] || '').trim();
      var parentId = String(parts[2] || '').trim();
      if (!code || !parentId) return { ok: false, reason: 'invalid_merge_code' };
      return { ok: true, code: code, role: 'kid', parentId: parentId, merged: true };
    }
    return { ok: true, code: raw, role: '', parentId: '', merged: false };
  }

  function buildMergeCode(code, parentId) {
    var c = String(code || getFamilyCode()).trim();
    var pid = String(parentId || deviceHash()).trim();
    if (!c || !pid) return '';
    return 'merge:' + c + ':' + pid;
  }

  function getFamilyAggregate(code) {
    var registry = readRegistry();
    var familyCode = String(code || getFamilyCode());
    var fam = registry[familyCode] || { members: {} };
    var members = Object.keys(fam.members || {}).map(function (k) { return fam.members[k]; });
    var totalProgress = members.reduce(function (sum, m) { return sum + (m.progress || 0); }, 0);
    var mergedProgress = Math.min(365, totalProgress);
    var totalGems = members.reduce(function (sum, m) { return sum + (m.gems || 0); }, 0);
    return {
      members: members,
      memberCount: members.length || 1,
      mergedProgress: mergedProgress,
      mergedGems: totalGems
    };
  }

  function getHierarchy(code, options) {
    var familyCode = String(code || getFamilyCode());
    var opts = options && typeof options === 'object' ? options : {};
    var churchMode = opts.churchMode === true || isChurchCode(familyCode);
    var aggregate = getFamilyAggregate(familyCode);
    var members = aggregate.members.slice().sort(function (a, b) {
      return Number(a.updatedAt || 0) - Number(b.updatedAt || 0);
    });
    var meId = deviceHash();
    var parent = members.find(function (m) { return m.role === 'parent'; }) || members[0] || null;
    var kids = members.filter(function (m) { return m !== parent; });
    var merged = kids.some(function (m) { return !!m.parentId; });
    var relationLabel = function (member) {
      if (!member) return '';
      if (churchMode && !merged) return '';
      if (!parent) return '';
      if (member.avatarId === parent.avatarId && meId !== parent.avatarId) return 'Your parent';
      if (member.avatarId !== parent.avatarId && meId === parent.avatarId) return 'Your kid';
      return '';
    };
    var visualLabel = function (member) {
      if (!member) return 'Member';
      if (churchMode) return pickBrotherSister(member.avatarId || member.role || '');
      return member.role === 'parent' ? 'Parent' : 'Kid';
    };
    return {
      code: familyCode,
      meId: meId,
      parent: parent,
      kids: kids,
      merged: merged,
      churchMode: churchMode,
      relationLabel: relationLabel,
      visualLabel: visualLabel
    };
  }

  window.TDBFamilyHierarchy = {
    getFamilyCode: getFamilyCode,
    setFamilyCode: setFamilyCode,
    deviceHash: deviceHash,
    setRole: setRole,
    getRole: getRole,
    ensureMember: ensureMember,
    resolveLinkInput: resolveLinkInput,
    buildMergeCode: buildMergeCode,
    getFamilyAggregate: getFamilyAggregate,
    getHierarchy: getHierarchy,
    isChurchCode: isChurchCode,
    pickBrotherSister: pickBrotherSister
  };
})();
