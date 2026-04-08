(function () {
  'use strict';

  var CREST_KEY = 'tdb_family_crests_v1';
  var PROMPT_KEY = 'tdb_family_crest_prompted_v1';
  var FAMILY_KEY = 'tdb_family_link_code';

  var BASES = { gold: ['#b8860b', '#facc15'] };
  var GEMS = {
    ruby: '#ef4444',
    sapphire: '#60a5fa',
    emerald: '#34d399',
    diamond: '#e5e7eb'
  };
  var SYMBOLS = ['ark', 'sling', 'star', 'dove', 'cross', 'olive'];

  function byId(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function safeParse(raw, fallback) {
    try {
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function readMap(key) {
    return safeParse(localStorage.getItem(key) || '{}', {});
  }
  function writeMap(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value || {})); } catch (e) {}
  }
  function getFamilyCode() {
    if (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.getFamilyCode === 'function') {
      return window.TDBFamilyHierarchy.getFamilyCode();
    }
    var code = '';
    try { code = String(localStorage.getItem(FAMILY_KEY) || '').trim(); } catch (e) {}
    return code || 'household-local';
  }
  function normalizeCrest(crest) {
    var c = crest && typeof crest === 'object' ? crest : {};
    var base = 'gold';
    var symbol = String(c.symbol || 'cross').toLowerCase();
    if (SYMBOLS.indexOf(symbol) === -1) symbol = 'cross';
    var gems = Array.isArray(c.gems) ? c.gems.filter(function (g) { return !!GEMS[g]; }) : ['ruby'];
    if (gems.length < 2) {
      if (!gems.length) gems = ['ruby', 'sapphire'];
      else gems = [gems[0], gems[0] === 'ruby' ? 'sapphire' : 'ruby'];
    }
    if (gems.length > 2) gems = gems.slice(0, 2);
    return { base: base, symbol: symbol, gems: gems, updatedAt: Date.now() };
  }

  function getCrest(code) {
    var map = readMap(CREST_KEY);
    var crest = map[String(code || getFamilyCode())];
    return crest ? normalizeCrest(crest) : null;
  }

  function saveCrest(code, crest) {
    var key = String(code || getFamilyCode());
    var map = readMap(CREST_KEY);
    map[key] = normalizeCrest(crest);
    writeMap(CREST_KEY, map);
    document.dispatchEvent(new CustomEvent('tdb-crest-updated', { detail: { code: key, crest: map[key] } }));
    return map[key];
  }

  function crestLabel(crest) {
    if (!crest) return 'Family Crest';
    return crest.symbol + ' with ' + crest.gems.join('/') + ' gems';
  }

  function symbolSvg(symbol) {
    if (symbol === 'ark') {
      return '<path d="M18 46h44c0 8-7 14-16 14H34c-9 0-16-6-16-14z" fill="currentColor"/><path d="M22 44h36l-4-9H26z" fill="currentColor" opacity="0.8"/>';
    }
    if (symbol === 'sling') {
      return '<path d="M24 52c8-10 9-18 8-26M56 52c-8-10-9-18-8-26" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="40" cy="28" r="6" fill="currentColor"/>';
    }
    if (symbol === 'star') {
      return '<path d="M40 17l6.5 13.3L61 32l-10.5 10.2L53 56l-13-7-13 7 2.5-13.8L19 32l14.5-1.7z" fill="currentColor"/>';
    }
    if (symbol === 'dove') {
      return '<path d="M33 37c9-12 15-8 22-6-4 2-7 4-8 7 3 0 6 1 9 3-9 3-17 3-23 2-5 4-9 7-14 8 3-3 6-6 7-11-3-1-6-3-9-6 6 1 10 2 16 3z" fill="currentColor"/>';
    }
    if (symbol === 'olive') {
      return '<path d="M26 53c8-8 16-17 20-31" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="31" cy="44" rx="6" ry="3" fill="currentColor"/><ellipse cx="41" cy="35" rx="6" ry="3" fill="currentColor"/><ellipse cx="49" cy="27" rx="5" ry="3" fill="currentColor"/>';
    }
    return '<path d="M37 16h6v16h14v6H43v16h-6V38H23v-6h14V16z" fill="currentColor"/>';
  }

  function crestSvgData(crest, size) {
    var c = normalizeCrest(crest || {});
    var pair = BASES[c.base] || BASES.gold;
    var gemNodes = c.gems.map(function (g, i) {
      var x = [16, 64][i] || 40;
      var y = [16, 64][i] || 40;
      return '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + (GEMS[g] || '#f8fafc') + '" fill-opacity="0.9" />';
    }).join('');
    var svg = '' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 80 80">' +
      '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="' + pair[0] + '"/><stop offset="100%" stop-color="' + pair[1] + '"/></linearGradient></defs>' +
      '<path d="M40 6l28 9v22c0 19-14 31-28 37C26 68 12 56 12 37V15z" fill="url(#bg)" />' +
      '<path d="M40 6l28 9v22c0 19-14 31-28 37C26 68 12 56 12 37V15z" fill="none" stroke="rgba(2,6,23,0.62)" stroke-width="2" />' +
      gemNodes +
      '<g transform="translate(0,0)" style="color:#f8fafc">' + symbolSvg(c.symbol) + '</g>' +
      '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function ensureBadge() {
    var onHome = (location.pathname === '/' || /\/index\.html$/i.test(location.pathname));
    if (!onHome) return null;
    var badge = byId('family-crest-badge');
    if (badge) return badge;
    badge = document.createElement('button');
    badge.id = 'family-crest-badge';
    badge.type = 'button';
    badge.className = 'family-crest-badge hidden';
    badge.setAttribute('aria-label', 'Open family crest');
    badge.innerHTML = '<img class="family-crest-badge-img" alt=""><span class="family-crest-walk-line"></span>';
    document.body.appendChild(badge);
    badge.addEventListener('click', openZoom);
    badge.addEventListener('mouseenter', function () { showHover(true); });
    badge.addEventListener('mouseleave', function () { showHover(false); });
    return badge;
  }

  function ensureHover() {
    var el = byId('family-crest-hover');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'family-crest-hover';
    el.className = 'family-crest-hover hidden';
    document.body.appendChild(el);
    return el;
  }

  function showHover(show) {
    var crest = getCrest();
    var hover = ensureHover();
    if (!crest) {
      hover.classList.add('hidden');
      return;
    }
    hover.textContent = 'Family Crest';
    hover.classList.toggle('hidden', !show);
  }

  function ensureRoadBanner() {
    var map = byId('golden-road-map');
    if (!map) return;
    var banner = byId('family-crest-road-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'family-crest-road-banner';
      banner.className = 'family-crest-road-banner hidden';
      map.appendChild(banner);
    }
    map.addEventListener('mouseenter', function () {
      var crest = getCrest();
      if (!crest) return;
      banner.textContent = 'Family Crest';
      banner.classList.remove('hidden');
    });
    map.addEventListener('mouseleave', function () {
      banner.classList.add('hidden');
    });
  }

  function refreshBadge() {
    var badge = ensureBadge();
    if (!badge) return;
    var crest = getCrest();
    if (!crest) {
      badge.classList.add('hidden');
      return;
    }
    badge.classList.remove('hidden');
    var img = badge.querySelector('.family-crest-badge-img');
    if (img) img.src = crestSvgData(crest, 80);
    badge.title = 'Family Crest';
  }

  function ensureZoomModal() {
    var modal = byId('family-crest-zoom-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'family-crest-zoom-modal';
    modal.className = 'modal hidden family-crest-zoom-modal';
    modal.innerHTML = '' +
      '<div class="modal-inner family-crest-zoom-inner">' +
      '<button type="button" class="intent-modal-close" id="family-crest-zoom-close" aria-label="Dismiss">×</button>' +
      '<h2 class="section-divider">Family Crest</h2>' +
      '<img id="family-crest-zoom-img" class="family-crest-zoom-img" alt="Family crest">' +
      '<p id="family-crest-zoom-meta" class="section-note"></p>' +
      '<div id="family-crest-zoom-avatars" class="family-crest-zoom-avatars"></div>' +
      '</div>';
    document.body.appendChild(modal);
    var close = byId('family-crest-zoom-close');
    if (close) close.addEventListener('click', function () { modal.classList.add('hidden'); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.add('hidden'); });
    return modal;
  }

  function avatarChipsHtml(code) {
    var family = (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.getHierarchy === 'function')
      ? window.TDBFamilyHierarchy.getHierarchy(code, { churchMode: false })
      : null;
    if (!family || !family.parent) return '<p class="section-note util-mb-0">No linked avatars yet. Connect your household to show your family crest lineup.</p>';
    var html = '<div class="family-hierarchy-stack">';
    html += '<div class="family-hierarchy-node family-hierarchy-parent"><span class="lineage-member-chip">Parent</span></div>';
    if (family.kids.length) {
      html += '<div class="family-hierarchy-branch">';
      family.kids.forEach(function () {
        html += '<div class="family-hierarchy-node family-hierarchy-kid"><span class="lineage-member-chip">Kid</span></div>';
      });
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function openZoom() {
    var crest = getCrest();
    if (!crest) return;
    var modal = ensureZoomModal();
    var code = getFamilyCode();
    var img = byId('family-crest-zoom-img');
    var meta = byId('family-crest-zoom-meta');
    var avatars = byId('family-crest-zoom-avatars');
    if (img) img.src = crestSvgData(crest, 220);
    if (meta) meta.textContent = 'Family Crest: ' + crestLabel(crest);
    if (avatars) avatars.innerHTML = avatarChipsHtml(code);
    modal.classList.remove('hidden');
  }

  function injectParentCrestAboveKid() {
    var wrap = document.querySelector('.family-hierarchy-stack');
    if (!wrap) return;
    if (wrap.querySelector('.family-parent-crest')) return;
    var code = getFamilyCode();
    var crest = getCrest(code);
    if (!crest) return;
    var role = (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.getRole === 'function')
      ? window.TDBFamilyHierarchy.getRole()
      : '';
    var node = document.createElement('div');
    node.className = 'family-parent-crest';
    node.innerHTML = '<img class="family-parent-crest-img" alt="Parent crest" src="' + esc(crestSvgData(crest, 60)) + '"><span class="family-role-tag">' + (role === 'kid' ? "Your family's crest—cool!" : 'Family crest') + '</span>';
    wrap.insertBefore(node, wrap.firstChild);
  }

  function ensurePickerModal() {
    var modal = byId('family-crest-picker-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'family-crest-picker-modal';
    modal.className = 'modal hidden';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Choose your family crest');
    modal.innerHTML = '' +
      '<div class="modal-inner glass family-crest-picker-inner">' +
      '<button type="button" class="intent-modal-close" data-action="close" aria-label="Dismiss">×</button>' +
      '<h2 class="section-divider">Make your family crest?</h2>' +
      '<p class="section-note">Pick one symbol and two gems.</p>' +
      '<label class="sr-only" for="family-crest-picker-symbol">Crest symbol</label>' +
      '<select id="family-crest-picker-symbol" class="search-input">' +
      '<option value="ark">Ark</option>' +
      '<option value="sling">Sling</option>' +
      '<option value="star">Star</option>' +
      '<option value="dove">Dove</option>' +
      '<option value="cross">Cross</option>' +
      '<option value="olive">Olive</option>' +
      '</select>' +
      '<fieldset id="family-crest-picker-gems" class="family-crest-picker-gems">' +
      '<legend>Choose two gems</legend>' +
      '<label><input type="checkbox" value="ruby"> Ruby</label>' +
      '<label><input type="checkbox" value="sapphire"> Sapphire</label>' +
      '<label><input type="checkbox" value="emerald"> Emerald</label>' +
      '<label><input type="checkbox" value="diamond"> Diamond</label>' +
      '</fieldset>' +
      '<div class="form-actions">' +
      '<button type="button" class="btn btn-secondary" data-action="close">Not now</button>' +
      '<button type="button" class="btn btn-primary" data-action="save">Save crest</button>' +
      '</div>' +
      '<p id="family-crest-picker-status" class="section-note" aria-live="polite"></p>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      var actionNode = e.target && e.target.closest ? e.target.closest('[data-action]') : null;
      if (!actionNode && e.target === modal) actionNode = { getAttribute: function () { return 'close'; } };
      if (!actionNode) return;
      var action = actionNode.getAttribute('data-action');
      if (action === 'close') {
        modal.classList.add('hidden');
      }
      if (action === 'save') {
        var code = modal.getAttribute('data-code') || getFamilyCode();
        var symbolEl = byId('family-crest-picker-symbol');
        var gemsWrap = byId('family-crest-picker-gems');
        var status = byId('family-crest-picker-status');
        var gems = [];
        if (gemsWrap) {
          gemsWrap.querySelectorAll('input[type="checkbox"]:checked').forEach(function (cb) { gems.push(cb.value); });
        }
        if (gems.length !== 2) {
          if (status) status.textContent = 'Select exactly 2 gems.';
          return;
        }
        saveCrest(code, {
          base: 'gold',
          symbol: symbolEl ? symbolEl.value : 'cross',
          gems: gems
        });
        if (status) status.textContent = 'Family crest saved.';
        setTimeout(function () { modal.classList.add('hidden'); }, 240);
      }
    });
    var gemsWrap = byId('family-crest-picker-gems');
    if (gemsWrap) {
      gemsWrap.addEventListener('change', function (e) {
        var target = e.target;
        if (!target || target.type !== 'checkbox') return;
        var checked = Array.prototype.slice.call(gemsWrap.querySelectorAll('input[type="checkbox"]:checked'));
        if (checked.length > 2) target.checked = false;
      });
    }
    return modal;
  }

  function openPickerForCode(code) {
    var modal = ensurePickerModal();
    var familyCode = String(code || getFamilyCode());
    modal.setAttribute('data-code', familyCode);
    var existing = getCrest(familyCode) || normalizeCrest({ base: 'gold', symbol: 'cross', gems: ['ruby', 'sapphire'] });
    var symbolEl = byId('family-crest-picker-symbol');
    if (symbolEl) symbolEl.value = existing.symbol;
    var gemsWrap = byId('family-crest-picker-gems');
    if (gemsWrap) {
      gemsWrap.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
        cb.checked = existing.gems.indexOf(cb.value) !== -1;
      });
    }
    var status = byId('family-crest-picker-status');
    if (status) status.textContent = '';
    modal.classList.remove('hidden');
  }

  function maybePromptCreateCrest(code, family) {
    var familyCode = String(code || getFamilyCode());
    var role = (window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.getRole === 'function')
      ? window.TDBFamilyHierarchy.getRole()
      : '';
    if (role !== 'parent') return;
    var memberCount = family && family.memberCount ? Number(family.memberCount) : 0;
    if (memberCount < 2) return;
    if (getCrest(familyCode)) return;
    var prompted = readMap(PROMPT_KEY);
    if (prompted[familyCode]) return;
    prompted[familyCode] = Date.now();
    writeMap(PROMPT_KEY, prompted);
    openPickerForCode(familyCode);
  }

  function initGenerator() {
    var form = byId('crest-generator-form');
    if (!form) return;
    var params = new URLSearchParams(location.search || '');
    var code = String(params.get('code') || getFamilyCode());
    var existing = getCrest(code) || normalizeCrest({ base: 'gold', symbol: 'cross', gems: ['ruby', 'sapphire'] });
    var symbolEl = byId('crest-symbol');
    var gemsWrap = byId('crest-gems');
    var preview = byId('crest-preview');
    var status = byId('crest-status');
    var saveBtn = byId('crest-save');
    var hint = byId('crest-gem-hint');
    if (symbolEl) symbolEl.value = existing.symbol;
    if (gemsWrap) {
      gemsWrap.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
        cb.checked = existing.gems.indexOf(cb.value) !== -1;
      });
    }
    function selectedGems() {
      var gems = [];
      if (gemsWrap) {
        gemsWrap.querySelectorAll('input[type="checkbox"]:checked').forEach(function (cb) { gems.push(cb.value); });
      }
      if (gems.length < 2) return [];
      return gems.slice(0, 2);
    }
    function drawPreview() {
      var gems = selectedGems();
      var crest = normalizeCrest({
        base: 'gold',
        symbol: symbolEl ? symbolEl.value : 'cross',
        gems: gems.length ? gems : ['ruby', 'sapphire']
      });
      if (hint) {
        hint.textContent = gems.length === 2 ? 'Great: 2 gems selected.' : 'Pick exactly 2 gems.';
      }
      if (preview) preview.src = crestSvgData(crest, 240);
    }
    if (gemsWrap) {
      gemsWrap.addEventListener('change', function (e) {
        var target = e.target;
        if (!target || target.type !== 'checkbox') return;
        var checked = Array.prototype.slice.call(gemsWrap.querySelectorAll('input[type="checkbox"]:checked'));
        if (checked.length > 2) {
          target.checked = false;
        }
      });
    }
    form.addEventListener('change', drawPreview);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var gems = selectedGems();
      if (gems.length !== 2) {
        if (status) status.textContent = 'Select exactly 2 gems.';
        return;
      }
      var crest = normalizeCrest({
        base: 'gold',
        symbol: symbolEl ? symbolEl.value : 'cross',
        gems: gems
      });
      saveCrest(code, crest);
      if (status) status.textContent = 'Saved to family code: ' + code;
      if (saveBtn) {
        var prev = saveBtn.textContent;
        saveBtn.textContent = 'Saved';
        setTimeout(function () { saveBtn.textContent = prev; }, 1200);
      }
    });
    drawPreview();
  }

  function initHome() {
    refreshBadge();
    ensureRoadBanner();
    injectParentCrestAboveKid();
    document.addEventListener('tdb-family-updated', function (evt) {
      var detail = (evt && evt.detail) || {};
      maybePromptCreateCrest(detail.code || getFamilyCode(), detail.family || null);
      refreshBadge();
      setTimeout(injectParentCrestAboveKid, 40);
    });
    document.addEventListener('tdb-crest-updated', function () {
      refreshBadge();
      setTimeout(injectParentCrestAboveKid, 40);
    });
  }

  function initHomeWhenReady() {
    var tries = 0;
    var maxTries = 40;
    function ready() {
      return !!(window.TDBFamilyHierarchy && typeof window.TDBFamilyHierarchy.getFamilyCode === 'function');
    }
    if (ready()) {
      initHome();
      return;
    }
    var timer = setInterval(function () {
      tries += 1;
      if (ready() || tries >= maxTries) {
        clearInterval(timer);
        initHome();
      }
    }, 50);
  }

  window.TDBCrest = {
    getCrest: getCrest,
    saveCrest: saveCrest,
    crestSvgData: crestSvgData,
    maybePromptCreateCrest: maybePromptCreateCrest,
    refreshBadge: refreshBadge
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initGenerator();
      initHomeWhenReady();
    });
  } else {
    initGenerator();
    initHomeWhenReady();
  }
})();
