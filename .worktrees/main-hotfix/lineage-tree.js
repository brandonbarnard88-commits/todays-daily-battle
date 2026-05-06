/**
 * Deep-tab lineage tree:
 * - Historical roots + Tier 2 branches
 * - Family merge/gem state shared with armor map
 * - Family hierarchy strip (parent top, kid branch)
 */
(function () {
  'use strict';

  var CHECKPOINTS = [73, 146, 219, 292, 365];
  var PIECES = ['helmet', 'breastplate', 'belt', 'shield', 'sword'];
  var ARMOR_PATH = [
    'plain',
    'helmet: wisdom gold/sapphire',
    'breastplate: righteousness ruby',
    'belt: truth emerald',
    'shield: Ten Commandments diamond slab',
    'sword: upright cross 3-blades faith/hope/love platinum'
  ];
  var PROGRESS_KEY = 'tdb_curriculum_progress_days';
  var FAMILY_KEY = 'tdb_family_link_code';
  var FAMILY_REGISTRY_KEY = 'tdb_family_registry_v1';
  var AVATAR_KEY = 'tdb_device_avatar_seed';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function normalizeName(v) {
    return String(v || '')
      .toLowerCase()
      .replace(/\(.*?\)/g, '')
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function readProgressCount() {
    try {
      var arr = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]');
      return Array.isArray(arr) ? arr.length : 0;
    } catch (e) {
      return 0;
    }
  }

  function fallbackShared() {
    function readRegistry() {
      try {
        var raw = JSON.parse(localStorage.getItem(FAMILY_REGISTRY_KEY) || '{}');
        return raw && typeof raw === 'object' ? raw : {};
      } catch (e) { return {}; }
    }
    function writeRegistry(v) {
      try { localStorage.setItem(FAMILY_REGISTRY_KEY, JSON.stringify(v || {})); } catch (e) {}
    }
    function deviceHash() {
      try {
        var cached = localStorage.getItem(AVATAR_KEY);
        if (cached) return cached;
        var raw = [navigator.userAgent || '', navigator.language || '', Intl.DateTimeFormat().resolvedOptions().timeZone || ''].join('|');
        var h = 2166136261;
        for (var i = 0; i < raw.length; i++) {
          h ^= raw.charCodeAt(i);
          h = (h * 16777619) >>> 0;
        }
        var out = 'avatar-' + h.toString(36);
        localStorage.setItem(AVATAR_KEY, out);
        return out;
      } catch (e) { return 'avatar-local'; }
    }
    function familyCode() {
      var code = localStorage.getItem(FAMILY_KEY);
      if (code) return code;
      code = 'household-local';
      try { localStorage.setItem(FAMILY_KEY, code); } catch (e) {}
      return code;
    }
    function gemCount(days) {
      var checkpoints = CHECKPOINTS.filter(function (d) { return days >= d; }).length;
      return days + checkpoints * 7;
    }
    function registerFamilyMember(code) {
      var registry = readRegistry();
      var key = code || familyCode();
      var id = deviceHash();
      if (!registry[key]) registry[key] = { members: {} };
      if (!registry[key].members) registry[key].members = {};
      var progress = readProgressCount();
      registry[key].members[id] = {
        avatarId: id,
        progress: progress,
        gems: gemCount(progress),
        role: Object.keys(registry[key].members).length > 1 ? 'kid' : 'parent',
        updatedAt: Date.now()
      };
      writeRegistry(registry);
      return registry[key];
    }
    function getFamilyAggregate(code) {
      var registry = readRegistry();
      var fam = registry[code || familyCode()] || { members: {} };
      var members = Object.keys(fam.members || {}).map(function (k) { return fam.members[k]; });
      var totalProgress = members.reduce(function (sum, m) { return sum + (m.progress || 0); }, 0);
      var mergedProgress = Math.min(365, totalProgress);
      var mergedGems = members.reduce(function (sum, m) { return sum + (m.gems || 0); }, 0);
      return { members: members, memberCount: members.length, mergedProgress: mergedProgress, mergedGems: mergedGems };
    }
    return {
      getFamilyCode: familyCode,
      registerFamilyMember: registerFamilyMember,
      getFamilyAggregate: getFamilyAggregate,
      gemCount: gemCount
    };
  }

  function sharedApi() {
    if (window.TDBFamilyShared && typeof window.TDBFamilyShared.getFamilyAggregate === 'function') return window.TDBFamilyShared;
    return fallbackShared();
  }

  function hierarchyApi() {
    if (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.getHierarchy === 'function') return window.TDBFamilyHierarchy;
    return null;
  }

  function unlockedPieces(days) {
    return CHECKPOINTS.filter(function (d) { return days >= d; }).map(function (_, i) { return PIECES[i]; });
  }

  function armorLabel(days) {
    var pieces = unlockedPieces(days);
    if (!pieces.length) return ARMOR_PATH[0];
    return ARMOR_PATH.slice(0, pieces.length + 1).join(' -> ');
  }

  function letterAvatar(name) {
    var label = String(name || '?').trim().charAt(0).toUpperCase() || '?';
    var encoded = encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="84" height="84">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs>' +
      '<rect width="84" height="84" rx="42" fill="url(#g)"/>' +
      '<circle cx="42" cy="42" r="39" fill="none" stroke="#facc15" stroke-opacity="0.6"/>' +
      '<text x="50%" y="56%" text-anchor="middle" font-size="34" fill="#fde68a" font-family="Inter,Arial,sans-serif">' + label + '</text>' +
      '</svg>'
    );
    return 'data:image/svg+xml;utf8,' + encoded;
  }

  function pickCharAvatar(c) {
    if (!c || typeof c !== 'object') return '';
    return c.avatarLink || c.avatar || c.avatarUrl || c.image || c.imageUrl || c.portrait || '';
  }

  function buildCharacterIndex(chars) {
    var idx = {};
    (chars || []).forEach(function (c) { idx[normalizeName(c.name)] = c; });
    return idx;
  }

  function resolveAvatar(node, charIdx) {
    var raw = String(node.avatarLink || '').trim();
    if (raw && raw.indexOf('characters://') === 0) {
      var charName = raw.slice('characters://'.length);
      var c = charIdx[normalizeName(charName)] || charIdx[normalizeName(node.name)];
      var picked = pickCharAvatar(c);
      return picked || letterAvatar(node.name);
    }
    if (raw) return raw;
    return letterAvatar(node.name);
  }

  function tier2Branches(chars, rootSet) {
    var rows = (chars || [])
      .filter(function (c) { return c && c.tier === 'Tier 2'; })
      .filter(function (c) { return !rootSet[normalizeName(c.name)]; })
      .sort(function (a, b) { return String(a.name || '').localeCompare(String(b.name || '')); });
    return rows.map(function (c) {
      var name = String(c.name || '').trim();
      var letter = (name.charAt(0).toUpperCase().match(/[A-Z]/) || ['#'])[0];
      return {
        rootGroup: 'Tier 2 Branch',
        branchLabel: 'Tier 2 - ' + letter,
        branchLetter: letter,
        name: name,
        dateRange: '~Era',
        keyVerse: c.keyKJVVerse || '',
        avatarLink: 'characters://' + name,
        armorState: 'plain',
        biblicalGems: ['emerald:truth'],
        comicPrompt: c.comicPrompt || ('comic ' + name + ' battle lineage node, dark bg')
      };
    });
  }

  var lineageUiState = {
    query: '',
    showTier2: false
  };

  function renderHierarchyStrip(code, fam) {
    var list = document.getElementById('lineage-tree-list');
    if (!list) return;
    var hApi = hierarchyApi();
    if (!hApi) return;
    var hierarchy = hApi.getHierarchy(code, { churchMode: hApi.isChurchCode ? hApi.isChurchCode(code) : false });
    if (!hierarchy || !hierarchy.parent) return;
    var parent = hierarchy.parent;
    var html = '<article class="lineage-node lineage-node-family">' +
      '<div class="lineage-dot" aria-hidden="true"></div>' +
      '<img class="lineage-avatar" loading="lazy" decoding="async" src="' + esc(letterAvatar('P')) + '" alt="">' +
      '<div class="lineage-content lineage-family-content">' +
      '<p class="lineage-pill">Family hierarchy</p>' +
      '<div class="family-hierarchy-stack">';
    html += '<div class="family-hierarchy-node family-hierarchy-parent">';
    html += '<span class="lineage-member-chip">' + esc(hierarchy.visualLabel(parent)) + '</span>';
    if (hierarchy.relationLabel(parent)) html += '<span class="family-role-tag">' + esc(hierarchy.relationLabel(parent)) + '</span>';
    html += '</div>';
    if (hierarchy.kids && hierarchy.kids.length) {
      html += '<div class="family-hierarchy-branch">';
      hierarchy.kids.slice(0, 4).forEach(function (kid) {
        html += '<div class="family-hierarchy-node family-hierarchy-kid">';
        html += '<span class="lineage-member-chip">' + esc(hierarchy.visualLabel(kid)) + '</span>';
        if (hierarchy.relationLabel(kid)) html += '<span class="family-role-tag">' + esc(hierarchy.relationLabel(kid)) + '</span>';
        html += '</div>';
      });
      html += '</div>';
    }
    html += '</div>' +
      '<p class="section-note util-mb-0_25">Merged progress: ' + esc(String(fam.mergedProgress || 0)) + '/365</p>' +
      '</div></article>';
    list.insertAdjacentHTML('afterbegin', html);
  }

  function nodeHtml(n, i, days, pieceClass, charIdx, total) {
    var branch = n.branchLabel ? '<p class="section-note util-mb-0_25 lineage-branch"><strong>' + esc(n.branchLabel) + '</strong></p>' : '';
    var gemsList = Array.isArray(n.biblicalGems) ? n.biblicalGems.join(' • ') : '';
    return '<article class="lineage-node">' +
      '<div class="lineage-dot" aria-hidden="true"></div>' +
      '<img class="lineage-avatar' + pieceClass + '" loading="lazy" decoding="async" src="' + esc(resolveAvatar(n, charIdx)) + '" alt="">' +
      '<div class="lineage-content' + pieceClass + '">' +
      '<p class="lineage-pill">' + esc(n.rootGroup || 'Root') + '</p>' +
      '<h4>' + esc(n.name) + '</h4>' +
      branch +
      '<p class="section-note util-mb-0_25">' + esc(n.dateRange || '~Era') + '</p>' +
      '<p class="section-note util-mb-0_25">Key verse: ' + esc(n.keyVerse || '—') + '</p>' +
      '<p class="section-note util-mb-0_25">Armor: ' + esc(armorLabel(days)) + '</p>' +
      '<p class="section-note util-mb-0_25">Node state: ' + esc(n.armorState || 'plain') + '</p>' +
      '<p class="section-note util-mb-0_25">Biblical gems: ' + esc(gemsList || 'emerald:truth') + '</p>' +
      (n.comicPrompt ? '<p class="section-note util-mb-0">Prompt: ' + esc(n.comicPrompt) + '</p>' : '') +
      '</div>' +
      (i < total - 1 ? '<div class="lineage-connector" aria-hidden="true"></div>' : '') +
      '</article>';
  }

  function render(roots, tier2Nodes, chars, family) {
    var list = document.getElementById('lineage-tree-list');
    var gemsEl = document.getElementById('lineage-crest-gems');
    var codeEl = document.getElementById('lineage-crest-code');
    var membersEl = document.getElementById('lineage-crest-members');
    if (!list || !gemsEl) return;

    var shared = sharedApi();
    var fam = family || { mergedProgress: 0, mergedGems: 0, memberCount: 1 };
    var days = fam.mergedProgress || 0;
    var gems = fam.mergedGems || shared.gemCount(days);
    var code = shared.getFamilyCode ? shared.getFamilyCode() : 'household-local';
    var pieces = unlockedPieces(days);
    var pieceClass = pieces.map(function (p) { return ' node-' + p; }).join('');
    var charIdx = buildCharacterIndex(chars || []);

    gemsEl.textContent = String(gems);
    if (codeEl) codeEl.textContent = code;
    if (membersEl) membersEl.textContent = String(fam.memberCount || 1);
    if (days <= 0 && gemsEl && gemsEl.parentElement) {
      gemsEl.parentElement.setAttribute('title', 'Start Day 1 in 365-Day Curriculum to begin gem progress.');
    }

    var query = String(lineageUiState.query || '').trim().toLowerCase();
    var rootsFiltered = (roots || []).filter(function (n) {
      if (!query) return true;
      return String(n.name || '').toLowerCase().indexOf(query) !== -1 || String(n.keyVerse || '').toLowerCase().indexOf(query) !== -1;
    });
    var tier2Filtered = (tier2Nodes || []).filter(function (n) {
      if (!query) return true;
      return String(n.name || '').toLowerCase().indexOf(query) !== -1 || String(n.keyVerse || '').toLowerCase().indexOf(query) !== -1;
    });

    var rootsHtml = rootsFiltered.map(function (n, i) {
      return nodeHtml(n, i, days, pieceClass, charIdx, rootsFiltered.length);
    }).join('');

    var tier2Html = '';
    if (lineageUiState.showTier2 || query) {
      var groups = {};
      tier2Filtered.forEach(function (n) {
        var letter = n.branchLetter || '#';
        if (!groups[letter]) groups[letter] = [];
        groups[letter].push(n);
      });
      var letters = Object.keys(groups).sort();
      if (letters.length) {
        tier2Html = '<section class="lineage-tier2-wrap" aria-label="Tier 2 branches">';
        letters.forEach(function (letter) {
          var items = groups[letter] || [];
          tier2Html += '<details class="lineage-tier2-group"><summary>Tier 2 - ' + esc(letter) + ' (' + items.length + ')</summary><div class="lineage-tier2-items">';
          tier2Html += items.map(function (n, i) {
            return nodeHtml(n, i, days, pieceClass, charIdx, items.length);
          }).join('');
          tier2Html += '</div></details>';
        });
        tier2Html += '</section>';
      } else if (query) {
        tier2Html = '<p class="section-note lineage-tier2-empty">No Tier 2 matches for "' + esc(query) + '".</p>';
      }
    } else {
      tier2Html = '<p class="section-note lineage-tier2-empty">Tier 2 branches are collapsed. Tap "Show Tier 2 branches" to browse A-Z.</p>';
    }

    list.innerHTML = rootsHtml + tier2Html;
    renderHierarchyStrip(code, fam);
  }

  function wireLineageControls(roots, tier2Nodes, chars, fam) {
    var searchEl = document.getElementById('lineage-search');
    var toggleEl = document.getElementById('lineage-tier2-toggle');
    if (searchEl && !searchEl.__tdbWired) {
      searchEl.__tdbWired = true;
      searchEl.addEventListener('input', function () {
        lineageUiState.query = String(searchEl.value || '');
        render(roots, tier2Nodes, chars, fam);
      });
    }
    if (toggleEl && !toggleEl.__tdbWired) {
      toggleEl.__tdbWired = true;
      toggleEl.addEventListener('click', function () {
        lineageUiState.showTier2 = !lineageUiState.showTier2;
        toggleEl.textContent = lineageUiState.showTier2 ? 'Hide Tier 2 branches' : 'Show Tier 2 branches';
        toggleEl.setAttribute('aria-expanded', lineageUiState.showTier2 ? 'true' : 'false');
        render(roots, tier2Nodes, chars, fam);
      });
    }
  }

  function init() {
    var host = document.getElementById('lineage-tree-list');
    if (!host) return;
    var shared = sharedApi();
    var code = shared.getFamilyCode ? shared.getFamilyCode() : 'household-local';
    if (shared.registerFamilyMember) shared.registerFamilyMember(code);
    var fam = shared.getFamilyAggregate ? shared.getFamilyAggregate(code) : { mergedProgress: readProgressCount(), mergedGems: 0, memberCount: 1 };

    Promise.all([
      fetch('tree.json').then(function (r) { return r.json(); }),
      fetch('characters.json').then(function (r) { return r.json(); })
    ]).then(function (pair) {
      var tree = pair[0] || {};
      var cjson = pair[1] || {};
      var roots = Array.isArray(tree.nodes) ? tree.nodes : [];
      var chars = Array.isArray(cjson.characters) ? cjson.characters : [];
      var rootSet = {};
      roots.forEach(function (n) { rootSet[normalizeName(n.name)] = true; });
      var tier2 = tier2Branches(chars, rootSet);
      wireLineageControls(roots, tier2, chars, fam);
      render(roots, tier2, chars, fam);
    }).catch(function () {
      host.textContent = 'Lineage data did not load—that is all right. Try again in a moment.';
    });

    document.addEventListener('tdb-family-updated', function (evt) {
      var family = (evt && evt.detail && evt.detail.family) || null;
      Promise.all([
        fetch('tree.json').then(function (r) { return r.json(); }),
        fetch('characters.json').then(function (r) { return r.json(); })
      ]).then(function (pair) {
        var tree = pair[0] || {};
        var cjson = pair[1] || {};
        var roots = Array.isArray(tree.nodes) ? tree.nodes : [];
        var chars = Array.isArray(cjson.characters) ? cjson.characters : [];
        var rootSet = {};
        roots.forEach(function (n) { rootSet[normalizeName(n.name)] = true; });
        var tier2 = tier2Branches(chars, rootSet);
        var mergedFamily = family || fam;
        wireLineageControls(roots, tier2, chars, mergedFamily);
        render(roots, tier2, chars, mergedFamily);
      }).catch(function () {});
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
