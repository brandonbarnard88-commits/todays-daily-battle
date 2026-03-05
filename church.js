(function () {
  'use strict';

  var GROUPS_KEY = 'tdb_church_groups_v1';
  var CURRENT_CODE_KEY = 'tdb_church_current_code_v1';
  var MY_NAME_KEY = 'my-name';
  var SHOW_NAME_KEY = 'tdb_church_show_name_v1';
  var KJV_CACHE = null;

  function byId(id) { return document.getElementById(id); }
  function nowIso() { return new Date().toISOString(); }
  function dayKey(d) {
    var x = d || new Date();
    return x.getUTCFullYear() + '-' + String(x.getUTCMonth() + 1).padStart(2, '0') + '-' + String(x.getUTCDate()).padStart(2, '0');
  }
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function hashFNV1a(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return (h >>> 0).toString(16);
  }
  function getDeviceId() {
    try {
      var id = localStorage.getItem('tdb_device_avatar_hash');
      if (id) return id;
    } catch (e) {}
    var seed = (navigator.userAgent || '') + '|' + (navigator.language || '') + '|' + Date.now();
    return hashFNV1a(seed);
  }
  function normalizeCode(raw) {
    var cleaned = String(raw || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!cleaned) return '';
    return cleaned.indexOf('church-') === 0 ? cleaned : ('church-' + cleaned.replace(/^church-/, ''));
  }
  function parseFamilyId() {
    try {
      var raw = localStorage.getItem('tdb_household_armor');
      var parsed = raw ? JSON.parse(raw) : null;
      return parsed && parsed.householdId ? String(parsed.householdId) : '';
    } catch (e) { return ''; }
  }
  function loadGroups() {
    try {
      var raw = localStorage.getItem(GROUPS_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) { return {}; }
  }
  function saveGroups(groups) {
    try { localStorage.setItem(GROUPS_KEY, JSON.stringify(groups)); } catch (e) {}
  }
  function getOrCreateGroup(groups, code) {
    if (!groups[code]) {
      groups[code] = {
        code: code,
        members: [],
        board: [],
        chatEnabled: false,
        chat: [],
        mergedFamilies: []
      };
    }
    return groups[code];
  }
  function pickBrotherSister(seed) {
    return (parseInt(hashFNV1a(seed).slice(-1), 16) % 2 === 0) ? 'Brother' : 'Sister';
  }
  function ensureMember(group, code) {
    var deviceId = getDeviceId();
    var myName = '';
    var showName = false;
    var familyId = parseFamilyId();
    try { myName = (localStorage.getItem(MY_NAME_KEY) || '').trim(); } catch (e) {}
    try { showName = localStorage.getItem(SHOW_NAME_KEY) === '1'; } catch (e2) {}
    var existing = group.members.find(function (m) { return m.deviceId === deviceId; });
    var label = (showName && myName) ? myName : pickBrotherSister(deviceId + code);
    if (existing) {
      existing.label = label;
      existing.showName = !!(showName && myName);
      existing.familyId = familyId || existing.familyId || '';
      existing.updatedAt = nowIso();
      return existing;
    }
    var member = {
      id: hashFNV1a(deviceId + nowIso()),
      deviceId: deviceId,
      label: label,
      showName: !!(showName && myName),
      familyId: familyId || '',
      joinedAt: nowIso()
    };
    group.members.push(member);
    return member;
  }
  function loadCurrentCode() {
    try { return normalizeCode(localStorage.getItem(CURRENT_CODE_KEY) || ''); } catch (e) { return ''; }
  }
  function saveCurrentCode(code) {
    try { localStorage.setItem(CURRENT_CODE_KEY, code); } catch (e) {}
  }
  async function loadKjv() {
    if (KJV_CACHE) return KJV_CACHE;
    var res = await fetch('kjv.json');
    if (!res.ok) throw new Error('kjv_load_failed');
    KJV_CACHE = await res.json();
    return KJV_CACHE;
  }
  async function dailyVerseForCode(code) {
    var bible = await loadKjv();
    var refs = Object.keys(bible || {});
    if (!refs.length) return { ref: 'Psalm 27:1', text: 'The LORD is my light and my salvation; whom shall I fear?' };
    var idx = parseInt(hashFNV1a(code + ':' + dayKey(new Date())).slice(0, 8), 16) % refs.length;
    var ref = refs[idx];
    return { ref: ref, text: String(bible[ref] || '') };
  }
  function upsertFamilyMerge(group, code) {
    var familyId = parseFamilyId();
    if (!familyId) return '';
    if (group.mergedFamilies.indexOf(familyId) === -1) group.mergedFamilies.push(familyId);
    return 'Family merge linked via shared code: ' + code + ' (' + familyId + ')';
  }
  function computeStreak(board) {
    if (!Array.isArray(board) || !board.length) return 0;
    var days = {};
    board.forEach(function (item) {
      if (!item || !item.createdAt) return;
      var d = String(item.createdAt).slice(0, 10);
      days[d] = true;
    });
    var streak = 0;
    var cursor = new Date();
    for (;;) {
      var key = dayKey(cursor);
      if (!days[key]) break;
      streak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    return streak;
  }

  function render(group, code) {
    byId('church-code-status').textContent = 'Joined: ' + code;
    var base = (window.location.origin || 'https://todaysdailybattle.com') + '/church.html?group=' + encodeURIComponent(code);
    byId('church-share-link').value = base;

    var avatars = byId('church-avatar-line');
    avatars.innerHTML = '';
    if (!group.members.length) {
      avatars.innerHTML = '<span class="section-note">No members have joined this group yet.</span>';
    } else {
      group.members.forEach(function (m) {
        var chip = document.createElement('div');
        chip.className = 'church-avatar-chip' + (m.deviceId === getDeviceId() ? ' self' : '');
        chip.textContent = m.label || pickBrotherSister(m.id || '');
        avatars.appendChild(chip);
      });
    }

    var boardList = byId('church-board-list');
    boardList.innerHTML = '';
    (group.board || []).slice(0, 80).forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'church-board-item';
      li.innerHTML = '<strong>' + escapeHtml(item.type === 'prayer' ? 'Prayer' : 'Note') + ' • ' + escapeHtml(item.authorLabel || 'Brother') + '</strong><p>' + escapeHtml(item.text || '') + '</p>';
      boardList.appendChild(li);
    });

    byId('church-streak-count').textContent = computeStreak(group.board || []) + ' day' + (computeStreak(group.board || []) === 1 ? '' : 's');

    var chatEnabledCb = byId('church-chat-enabled');
    var chatWrap = byId('church-chat-wrap');
    chatEnabledCb.checked = !!group.chatEnabled;
    chatWrap.classList.toggle('hidden', !group.chatEnabled);

    var chatList = byId('church-chat-list');
    chatList.innerHTML = '';
    (group.chat || []).slice(0, 120).forEach(function (msg) {
      var li = document.createElement('li');
      li.className = 'church-chat-item';
      li.innerHTML = '<strong class="' + (msg.anonymous ? 'church-chat-item-anon' : '') + '">' + escapeHtml(msg.authorLabel || 'Anonymous') + '</strong><p>' + escapeHtml(msg.text || '') + '</p>';
      chatList.appendChild(li);
    });
  }

  async function renderDaily(code) {
    try {
      var v = await dailyVerseForCode(code);
      byId('church-daily-ref').textContent = v.ref;
      byId('church-daily-text').textContent = v.text;
      var breakdownBtn = byId('church-daily-breakdown');
      if (breakdownBtn) {
        breakdownBtn.onclick = function () {
          if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.open === 'function') {
            window.TDBVerseBreakdown.open(v.ref, v.text);
          }
        };
      }
    } catch (e) {
      byId('church-daily-ref').textContent = 'Psalm 27:1';
      byId('church-daily-text').textContent = 'The LORD is my light and my salvation; whom shall I fear?';
      var fallbackBtn = byId('church-daily-breakdown');
      if (fallbackBtn) {
        fallbackBtn.onclick = function () {
          if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.open === 'function') {
            window.TDBVerseBreakdown.open('Psalm 27:1', 'The LORD is my light and my salvation; whom shall I fear?');
          }
        };
      }
    }
  }

  function setTab(tab) {
    var tGroup = byId('church-tab-group');
    var tCenter = byId('church-tab-center');
    var panelGroup = byId('church-group-panel');
    var panelCenter = byId('church-center');
    var isGroup = tab === 'group';
    tGroup.classList.toggle('active', isGroup);
    tCenter.classList.toggle('active', !isGroup);
    tGroup.setAttribute('aria-selected', isGroup ? 'true' : 'false');
    tCenter.setAttribute('aria-selected', isGroup ? 'false' : 'true');
    panelGroup.classList.toggle('hidden', !isGroup);
    panelCenter.classList.toggle('hidden', isGroup);
  }

  function wire() {
    var groups = loadGroups();
    var params = new URLSearchParams(window.location.search || '');
    var fromUrl = normalizeCode(params.get('group') || '');
    var currentCode = fromUrl || loadCurrentCode() || 'church-789';
    var currentGroup = getOrCreateGroup(groups, currentCode);
    ensureMember(currentGroup, currentCode);
    var familyMergeText = upsertFamilyMerge(currentGroup, currentCode);
    if (familyMergeText) byId('church-family-merge-note').textContent = familyMergeText;
    saveGroups(groups);
    saveCurrentCode(currentCode);
    byId('church-code-input').value = currentCode;

    try { byId('church-my-name').value = localStorage.getItem(MY_NAME_KEY) || ''; } catch (e) {}
    try { byId('church-show-name').checked = localStorage.getItem(SHOW_NAME_KEY) === '1'; } catch (e2) {}

    render(currentGroup, currentCode);
    renderDaily(currentCode);

    byId('church-tab-group').addEventListener('click', function () { setTab('group'); });
    byId('church-tab-center').addEventListener('click', function () { setTab('center'); });

    byId('church-join-btn').addEventListener('click', function () {
      var code = normalizeCode(byId('church-code-input').value || '');
      if (!code) return;
      groups = loadGroups();
      currentGroup = getOrCreateGroup(groups, code);
      ensureMember(currentGroup, code);
      var mergeText = upsertFamilyMerge(currentGroup, code);
      if (mergeText) byId('church-family-merge-note').textContent = mergeText;
      saveGroups(groups);
      saveCurrentCode(code);
      currentCode = code;
      byId('church-code-input').value = currentCode;
      render(currentGroup, currentCode);
      renderDaily(currentCode);
      setTab('group');
    });

    byId('church-new-code-btn').addEventListener('click', function () {
      var n = Math.floor(Math.random() * 900 + 100);
      byId('church-code-input').value = 'church-' + n;
    });

    byId('church-copy-link-btn').addEventListener('click', function () {
      var v = byId('church-share-link').value || '';
      if (!v) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(v).then(function () {
          byId('church-code-status').textContent = 'Invite copied.';
        }).catch(function () {});
      }
    });

    byId('church-my-name').addEventListener('input', function () {
      try { localStorage.setItem(MY_NAME_KEY, byId('church-my-name').value.trim()); } catch (e) {}
    });
    byId('church-show-name').addEventListener('change', function () {
      try { localStorage.setItem(SHOW_NAME_KEY, byId('church-show-name').checked ? '1' : '0'); } catch (e) {}
      groups = loadGroups();
      currentGroup = getOrCreateGroup(groups, currentCode);
      ensureMember(currentGroup, currentCode);
      saveGroups(groups);
      render(currentGroup, currentCode);
    });

    byId('church-add-note-btn').addEventListener('click', function () {
      var text = (byId('church-board-note').value || '').trim();
      if (!text) return;
      groups = loadGroups();
      currentGroup = getOrCreateGroup(groups, currentCode);
      var me = ensureMember(currentGroup, currentCode);
      currentGroup.board.unshift({ id: hashFNV1a(nowIso() + text), type: 'note', text: text.slice(0, 500), authorLabel: me.label, createdAt: nowIso() });
      byId('church-board-note').value = '';
      saveGroups(groups);
      render(currentGroup, currentCode);
    });

    byId('church-add-prayer-btn').addEventListener('click', function () {
      var text = (byId('church-board-prayer').value || '').trim();
      if (!text) return;
      groups = loadGroups();
      currentGroup = getOrCreateGroup(groups, currentCode);
      var me = ensureMember(currentGroup, currentCode);
      currentGroup.board.unshift({ id: hashFNV1a(nowIso() + text), type: 'prayer', text: text.slice(0, 500), authorLabel: me.label, createdAt: nowIso() });
      byId('church-board-prayer').value = '';
      saveGroups(groups);
      render(currentGroup, currentCode);
    });

    byId('church-chat-enabled').addEventListener('change', function () {
      groups = loadGroups();
      currentGroup = getOrCreateGroup(groups, currentCode);
      currentGroup.chatEnabled = byId('church-chat-enabled').checked;
      saveGroups(groups);
      render(currentGroup, currentCode);
    });

    byId('church-chat-send-btn').addEventListener('click', function () {
      var input = byId('church-chat-input');
      var text = (input.value || '').trim();
      if (!text) return;
      groups = loadGroups();
      currentGroup = getOrCreateGroup(groups, currentCode);
      if (!currentGroup.chatEnabled) return;
      var me = ensureMember(currentGroup, currentCode);
      var anon = !!byId('church-chat-anon').checked;
      currentGroup.chat.unshift({
        id: hashFNV1a(nowIso() + text + Math.random()),
        text: text.slice(0, 240),
        anonymous: anon,
        authorLabel: anon ? pickBrotherSister(me.id + text) : me.label,
        createdAt: nowIso()
      });
      input.value = '';
      saveGroups(groups);
      render(currentGroup, currentCode);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
