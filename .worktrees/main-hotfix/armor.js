/**
 * Armor enhancements for Deep tab:
 * - Family-linked golden road map
 * - Gem tally by day/checkpoint
 * - Admin-only "Mac Daddy" local bling editor
 */
(function () {
  'use strict';

  var browserCore = window.TDBBrowserCore || null;

  var PROGRESS_KEY = 'tdb_curriculum_progress_days';
  var FAMILY_KEY = 'tdb_family_link_code';
  var FAMILY_REGISTRY_KEY = 'tdb_family_registry_v1';
  var MAC_DADDY_KEY = 'tdb_mac_daddy_override';
  var MAC_DADDY_START_KEY = 'tdb_mac_daddy_start';
  var AVATAR_KEY = 'tdb_device_avatar_seed';
  var START_FALLBACK = '2024-11-03T00:00:00Z';
  var CHECKPOINTS = [73, 146, 219, 292, 365];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function getProgressCount() {
    try {
      var arr = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]');
      return Array.isArray(arr) ? arr.length : 0;
    } catch (e) { return 0; }
  }

  function readFamilyRegistry() {
    try {
      var obj = JSON.parse(localStorage.getItem(FAMILY_REGISTRY_KEY) || '{}');
      return obj && typeof obj === 'object' ? obj : {};
    } catch (e) { return {}; }
  }

  function writeFamilyRegistry(data) {
    try { localStorage.setItem(FAMILY_REGISTRY_KEY, JSON.stringify(data || {})); } catch (e) {}
  }

  function getFamilyCode() {
    if (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.getFamilyCode === 'function') {
      return window.TDBFamilyHierarchy.getFamilyCode();
    }
    var code = localStorage.getItem(FAMILY_KEY);
    if (code) return code;
    code = 'household-' + Math.random().toString(36).slice(2, 8);
    try { localStorage.setItem(FAMILY_KEY, code); } catch (e) {}
    return code;
  }

  function deviceHash() {
    if (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.deviceHash === 'function') {
      return window.TDBFamilyHierarchy.deviceHash();
    }
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

  function gemCount(days) {
    var checkpoints = CHECKPOINTS.filter(function (d) { return days >= d; }).length;
    return days + checkpoints * 7;
  }

  function registerFamilyMember(code) {
    if (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.ensureMember === 'function') {
      return window.TDBFamilyHierarchy.ensureMember(code, getProgressCount(), gemCount(getProgressCount()));
    }
    var registry = readFamilyRegistry();
    var key = code || getFamilyCode();
    if (!registry[key]) registry[key] = { members: {} };
    if (!registry[key].members) registry[key].members = {};
    var id = deviceHash();
    var progress = getProgressCount();
    registry[key].members[id] = {
      avatarId: id,
      progress: progress,
      gems: gemCount(progress),
      updatedAt: Date.now()
    };
    writeFamilyRegistry(registry);
    return registry[key];
  }

  function getFamilyAggregate(code) {
    if (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.getFamilyAggregate === 'function') {
      return window.TDBFamilyHierarchy.getFamilyAggregate(code);
    }
    var registry = readFamilyRegistry();
    var fam = registry[code || getFamilyCode()] || { members: {} };
    var members = Object.keys(fam.members || {}).map(function (k) { return fam.members[k]; });
    var totalProgress = members.reduce(function (sum, m) { return sum + (m.progress || 0); }, 0);
    var mergedProgress = Math.min(365, totalProgress);
    var totalGems = members.reduce(function (sum, m) { return sum + (m.gems || 0); }, 0);
    return {
      members: members,
      memberCount: members.length,
      mergedProgress: mergedProgress,
      mergedGems: totalGems
    };
  }

  // Shared family state API for Deep-tab modules (lineage/map/avatar).
  window.TDBFamilyShared = {
    CHECKPOINTS: CHECKPOINTS.slice(),
    gemCount: gemCount,
    getFamilyCode: getFamilyCode,
    registerFamilyMember: registerFamilyMember,
    getFamilyAggregate: getFamilyAggregate,
    deviceHash: deviceHash
  };

  function renderGoldenRoad() {
    var target = document.getElementById('golden-road-map');
    if (!target) return;
    var code = getFamilyCode();
    registerFamilyMember(code);
    var family = getFamilyAggregate(code);
    var days = family.mergedProgress;
    var pct = Math.max(0, Math.min(100, Math.round((days / 365) * 100)));
    var gems = family.mergedGems;
    var hierarchy = (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.getHierarchy === 'function')
      ? window.TDBFamilyHierarchy.getHierarchy(code, { churchMode: /^church-/i.test(code) })
      : null;
    var memberBadges = family.members.slice(0, 8).map(function (m) {
      return '<span class="lineage-member-chip">' + esc(String((m.avatarId || '').replace('avatar-', '') || 'member')) + '</span>';
    }).join(' ');
    var hierarchyHtml = '';
    if (hierarchy && hierarchy.parent) {
      var parent = hierarchy.parent;
      var parentTag = hierarchy.relationLabel(parent);
      hierarchyHtml += '<div class="family-hierarchy-stack">';
      hierarchyHtml += '<div class="family-hierarchy-node family-hierarchy-parent">';
      hierarchyHtml += '<span class="lineage-member-chip">' + esc(hierarchy.visualLabel(parent)) + '</span>';
      if (parentTag) hierarchyHtml += '<span class="family-role-tag">' + esc(parentTag) + '</span>';
      if (!hierarchy.churchMode || hierarchy.merged) {
        hierarchyHtml += '<span class="family-id-chip">' + esc(String((parent.avatarId || '').replace('avatar-', '') || 'parent')) + '</span>';
      }
      hierarchyHtml += '</div>';
      if (hierarchy.kids.length) {
        hierarchyHtml += '<div class="family-hierarchy-branch">';
        hierarchy.kids.slice(0, 4).forEach(function (kid) {
          var kidTag = hierarchy.relationLabel(kid);
          hierarchyHtml += '<div class="family-hierarchy-node family-hierarchy-kid">';
          hierarchyHtml += '<span class="lineage-member-chip">' + esc(hierarchy.visualLabel(kid)) + '</span>';
          if (kidTag) hierarchyHtml += '<span class="family-role-tag">' + esc(kidTag) + '</span>';
          if (!hierarchy.churchMode || hierarchy.merged) {
            hierarchyHtml += '<span class="family-id-chip">' + esc(String((kid.avatarId || '').replace('avatar-', '') || 'kid')) + '</span>';
          }
          hierarchyHtml += '</div>';
        });
        hierarchyHtml += '</div>';
      }
      hierarchyHtml += '</div>';
    }
    target.innerHTML =
      '<div class="gold-trail"><span class="gold-fill" style="width:' + pct + '%"></span></div>' +
      '<p class="section-note util-mb-0">Family <strong>' + esc(code) + '</strong> • merged progress ' + days + '/365 (' + pct + '%) • gems: ' + gems + ' • members: ' + family.memberCount + '</p>' +
      (hierarchyHtml || ('<p class="section-note util-mb-0_25">' + memberBadges + '</p>'));
    document.dispatchEvent(new CustomEvent('tdb-family-updated', { detail: { code: code, family: family } }));
  }

  function daysSinceStart() {
    var raw = localStorage.getItem(MAC_DADDY_START_KEY) || START_FALLBACK;
    if (!localStorage.getItem(MAC_DADDY_START_KEY)) {
      try { localStorage.setItem(MAC_DADDY_START_KEY, START_FALLBACK); } catch (e) {}
    }
    var start = new Date(raw).getTime();
    var now = Date.now();
    if (!isFinite(start) || start <= 0) return 0;
    return Math.max(0, Math.floor((now - start) / 86400000));
  }

  async function isAdmin() {
    try {
      if (browserCore && typeof browserCore.getSupabaseClient === 'function' && typeof browserCore.isAdminUser === 'function') {
        var sharedClient = await browserCore.getSupabaseClient({ auth: { detectSessionInUrl: true } });
        return browserCore.isAdminUser(sharedClient);
      }
      if (!window.supabase || !window.TDB_CONFIG) return false;
      var client = window.__tdbSupabaseClient;
      if (!client) {
        client = window.supabase.createClient(window.TDB_CONFIG.SUPABASE_URL, window.TDB_CONFIG.SUPABASE_ANON_KEY);
        window.__tdbSupabaseClient = client;
      }
      var sess = await client.auth.getSession();
      var user = sess && sess.data && sess.data.session && sess.data.session.user;
      return !!(user && user.app_metadata && user.app_metadata.role === 'admin');
    } catch (e) {
      return false;
    }
  }

  function readMacDaddy() {
    try {
      return JSON.parse(localStorage.getItem(MAC_DADDY_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function writeMacDaddy(v) {
    try { localStorage.setItem(MAC_DADDY_KEY, JSON.stringify(v || {})); } catch (e) {}
  }

  function wireFamilyControls() {
    var input = document.getElementById('family-link-code');
    var save = document.getElementById('family-link-save');
    var status = document.getElementById('family-link-status');
    if (!input || !save) return;
    input.value = getFamilyCode();
    save.addEventListener('click', function () {
      var v = (input.value || '').trim();
      if (!v) return;
      var resolved = (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.resolveLinkInput === 'function')
        ? window.TDBFamilyHierarchy.resolveLinkInput(v)
        : { ok: true, code: v, role: '', parentId: '', merged: false };
      if (!resolved.ok) {
        if (status) status.textContent = 'Invalid family merge code.';
        return;
      }
      try { localStorage.setItem(FAMILY_KEY, resolved.code); } catch (e) {}
      if (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.ensureMember === 'function') {
        window.TDBFamilyHierarchy.ensureMember(resolved.code, getProgressCount(), gemCount(getProgressCount()), {
          role: resolved.role || '',
          parentId: resolved.parentId || ''
        });
      } else {
        registerFamilyMember(resolved.code);
      }
      if (status) {
        if (resolved.merged) status.textContent = 'Merged to parent branch: ' + resolved.code;
        else {
          var mergeCode = (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.buildMergeCode === 'function')
            ? window.TDBFamilyHierarchy.buildMergeCode(resolved.code, deviceHash())
            : '';
          status.textContent = mergeCode
            ? ('Linked: ' + resolved.code + ' • Merge code: ' + mergeCode)
            : ('Linked: ' + resolved.code);
        }
      }
      renderGoldenRoad();
    });
  }

  function renderAvatarSeed() {
    var avatar = document.getElementById('deep-curriculum-avatar');
    if (!avatar) return;
    var hash = deviceHash();
    var palettes = ['#64748b', '#7c3aed', '#0ea5e9', '#22c55e', '#f59e0b'];
    var idx = 0;
    for (var i = 0; i < hash.length; i++) idx = (idx + hash.charCodeAt(i)) % palettes.length;
    avatar.style.background = 'linear-gradient(145deg,' + palettes[idx] + ',#2d3748)';
    avatar.setAttribute('title', hash);
  }

  function wireMacDaddy() {
    var open = document.getElementById('mac-daddy-open');
    var modal = document.getElementById('mac-daddy-modal');
    var close = document.getElementById('mac-daddy-close');
    var save = document.getElementById('mac-daddy-save');
    var daysEl = document.getElementById('mac-daddy-days');
    if (!open || !modal || !close || !save || !daysEl) return;

    isAdmin().then(function (ok) {
      if (!ok) return;
      open.classList.remove('hidden');
      daysEl.textContent = 'Days since start: ' + daysSinceStart();
      var data = readMacDaddy();
      ['helmet', 'breastplate', 'belt', 'shield', 'sword'].forEach(function (k) {
        var el = document.getElementById('md-' + k);
        if (el) el.checked = !!data[k];
      });
      var gems = document.getElementById('md-gems');
      if (gems) gems.value = String(data.gems || 0);
    });

    open.addEventListener('click', function () { modal.classList.remove('hidden'); });
    close.addEventListener('click', function () { modal.classList.add('hidden'); });
    save.addEventListener('click', function () {
      var payload = {
        helmet: !!(document.getElementById('md-helmet') || {}).checked,
        breastplate: !!(document.getElementById('md-breastplate') || {}).checked,
        belt: !!(document.getElementById('md-belt') || {}).checked,
        shield: !!(document.getElementById('md-shield') || {}).checked,
        sword: !!(document.getElementById('md-sword') || {}).checked,
        gems: parseInt((document.getElementById('md-gems') || {}).value || '0', 10) || 0
      };
      writeMacDaddy(payload);
      alert('Mac Daddy bling saved.');
      modal.classList.add('hidden');
    });
  }

  function init() {
    if (!document.getElementById('toolbox-content')) return;
    wireFamilyControls();
    wireMacDaddy();
    renderAvatarSeed();
    renderGoldenRoad();
    // Keep in sync as curriculum progress updates.
    setInterval(renderGoldenRoad, 4000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
