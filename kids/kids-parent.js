/**
 * Parent Dashboard — reads kid's streak, doodles, badges from localStorage.
 * No login. Same keys as kids-battle.js.
 */
(function () {
  'use strict';

  const KIDS_STREAK_KEY = 'kidsStreak';
  const KIDS_DOODLE_KEY = 'kidsDoodle';
  const BETA_CODE_KEY = 'kidsBetaCode';
  const KID_NAME_KEY = 'kidName';
  const KID_REFLECTION_KEY = 'kidReflection';
  const KIDS_FAMILY_CODE_KEY = 'familyCode';
  const LIBRARY_VIEWED_KEY = 'kidsLibraryViewedStories';
  const BADGES = [
    { id: 'faith-fighter', label: 'Faith Fighter', days: 1 },
    { id: 'bible-boss', label: 'Bible Boss', days: 3 },
    { id: 'faith-hero', label: 'Faith Hero', days: 7 },
    { id: 'brave-heart', label: 'Brave Heart', days: 14 }
  ];

  function tdbPlainTextForUi(s) {
    function finishPlain(t) {
      if (typeof window.tdbCleanForPlainDisplay === 'function') {
        return window.tdbCleanForPlainDisplay(t);
      }
      if (typeof window.tdbStripAngleMarkupForPlainText === 'function') {
        return window.tdbStripAngleMarkupForPlainText(t);
      }
      return String(t || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    if (s == null || s === '') return '';
    var str = String(s);
    var prev;
    for (var n = 0; n < 12; n++) {
      prev = str;
      str = str.replace(/&amp;/g, '&');
      if (str === prev) break;
    }
    try {
      var div = document.createElement('div');
      if (typeof window.tdbSetHtml === 'function') {
        window.tdbSetHtml(div, str);
        var decoded = div.textContent;
        if (typeof decoded === 'string') return finishPlain(decoded);
      }
    } catch (_) {}
    try {
      var pol = window.trustedTypes && window.trustedTypes.defaultPolicy;
      if (pol && typeof pol.createHTML === 'function') {
        var t = document.createElement('textarea');
        var ns = window.__tdbNativeInnerHTMLSet;
        if (ns) ns.call(t, pol.createHTML(str));
        else t.innerHTML = pol.createHTML(str);
        var out = t.value;
        if (typeof out === 'string') return finishPlain(out);
      }
    } catch (_) {}
    return finishPlain(str);
  }

  function getStreakData() {
    try {
      const raw = localStorage.getItem(KIDS_STREAK_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function getCurrentStreak() {
    const data = getStreakData();
    return Number(data.count || 0);
  }

  function getDoodleGallery() {
    const items = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(KIDS_DOODLE_KEY) && key.length > KIDS_DOODLE_KEY.length) {
          const date = key.slice(KIDS_DOODLE_KEY.length);
          if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            const dataUrl = localStorage.getItem(key);
            if (dataUrl) items.push({ date, dataUrl });
          }
        }
      }
      items.sort((a, b) => b.date.localeCompare(a.date));
    } catch (e) {}
    return items;
  }

  function getKidName() {
    try {
      const n = localStorage.getItem(KID_NAME_KEY);
      return (n && typeof n === 'string') ? n.trim() : '';
    } catch (e) { return ''; }
  }

  function renderStreak() {
    const streak = getCurrentStreak();
    const el = document.getElementById('parent-streak-display');
    const badge = document.getElementById('parent-proud-badge');
    const kidName = getKidName();
    const streakText = '🔥 ' + streak + ' day' + (streak === 1 ? '' : 's');
    if (el) el.textContent = kidName ? 'Kid: ' + kidName + ' — ' + streakText : streakText;
    if (badge) badge.classList.toggle('hidden', streak < 7);
  }

  function fetchDoodlesFromStorage(callback) {
    var code = null;
    try { code = localStorage.getItem(BETA_CODE_KEY); } catch (e) {}
    if (!code || !navigator.onLine) { callback([]); return; }
    var cfg = window.TDB_CONFIG || {};
    var supabaseUrl = cfg.SUPABASE_URL;
    var supabaseKey = cfg.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) { callback([]); return; }
    try {
      var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
      if (!supabase || !supabase.createClient) { callback([]); return; }
      var client = supabase.createClient(supabaseUrl, supabaseKey);
      client.storage.from('kid-doodles').list('doodles/' + code, { sortBy: { column: 'created_at', order: 'desc' }, limit: 5 })
        .then(function (res) {
          if (res.error) { callback([]); return; }
          var kidName = getKidName() || 'Kiddo';
          var items = (res.data || []).filter(function (o) { return o.name && o.name.endsWith('.png'); }).map(function (o) {
            var path = 'doodles/' + code + '/' + o.name;
            var match = o.name.match(/^(.+)-(\d+)\.png$/);
            var parsedName = match ? match[1].replace(/_/g, ' ') : 'Kiddo';
            var ts = match ? parseInt(match[2], 10) : (o.created_at ? new Date(o.created_at).getTime() : Date.now());
            var d = new Date(ts);
            var dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            var url = client.storage.from('kid-doodles').getPublicUrl(path).data.publicUrl;
            return { url: url, date: dateStr, kidName: parsedName, fromStorage: true };
          });
          callback(items);
        })
        .catch(function () { callback([]); });
    } catch (e) { callback([]); }
  }

  function clearGallery(gallery) {
    while (gallery.firstChild) gallery.removeChild(gallery.firstChild);
  }

  function renderDoodles() {
    const gallery = document.getElementById('parent-doodles-gallery');
    const emptyCopy = document.getElementById('parent-doodles-empty-copy');
    if (!gallery) return;
    function setEmptyCopyVisible(show) {
      if (emptyCopy) emptyCopy.classList.toggle('hidden', !show);
    }
    setEmptyCopyVisible(false);
    clearGallery(gallery);
    var loadingP = document.createElement('p');
    loadingP.className = 'kids-doodles-loading';
    loadingP.textContent = 'Loading doodles…';
    gallery.appendChild(loadingP);
    var localItems = getDoodleGallery().map(function (item) {
      return { dataUrl: item.dataUrl, date: item.date, kidName: getKidName() || 'Kiddo', fromStorage: false };
    });
    fetchDoodlesFromStorage(function (storageItems) {
      var items = storageItems.length > 0 ? storageItems : localItems.slice(0, 5);
      clearGallery(gallery);
      if (items.length === 0) {
        setEmptyCopyVisible(true);
        return;
      }
      setEmptyCopyVisible(false);
      items.forEach(function (item) {
        const wrap = document.createElement('div');
        wrap.className = 'kids-doodle-gallery-item kids-doodle-polaroid';
        const img = document.createElement('img');
        img.src = item.fromStorage ? item.url : item.dataUrl;
        img.alt = 'Doodle from ' + item.date;
        img.loading = 'lazy';
        const label = document.createElement('span');
        label.className = 'kids-doodle-date';
        label.textContent = 'Drawn by ' + (item.kidName || 'Kiddo') + ' on ' + item.date;
        wrap.appendChild(img);
        wrap.appendChild(label);
        gallery.appendChild(wrap);
      });
    });
  }

  function renderParentCode() {
    var section = document.getElementById('kids-parent-code-section');
    var display = document.getElementById('kids-parent-code-display');
    var usedEl = document.getElementById('kids-parent-code-used');
    if (!section || !display) return;
    var code = null;
    try { code = localStorage.getItem(BETA_CODE_KEY); } catch (e) {}
    if (code) {
      display.textContent = code;
      section.classList.remove('hidden');
      if (usedEl) usedEl.classList.add('hidden');
      var cfg = window.TDB_CONFIG || {};
      var supabaseUrl = cfg.SUPABASE_URL;
      var supabaseKey = cfg.SUPABASE_ANON_KEY;
      if (usedEl && navigator.onLine && supabaseUrl && supabaseKey) {
        try {
          var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
          if (supabase && supabase.createClient) {
            var client = supabase.createClient(supabaseUrl, supabaseKey);
            client.rpc('check_invite_code_status', { code: code }).then(function (res) {
              if (!res.error && res.data && res.data.found && res.data.used && usedEl) {
                usedEl.classList.remove('hidden');
              }
            }).catch(function () {});
          }
        } catch (e) {}
      }
    } else {
      section.classList.add('hidden');
    }
  }

  function renderBadges() {
    const list = document.getElementById('parent-badges-list');
    if (!list) return;
    const streak = getCurrentStreak();
    const viewedCount = getViewedStories().length;
    list.innerHTML = '';
    const starter = document.createElement('span');
    starter.className = 'kids-badge little-explorer' + (viewedCount > 0 ? '' : ' locked');
    starter.textContent = (viewedCount > 0 ? '★ ' : '☆ ') + 'Little Explorer';
    list.appendChild(starter);
    BADGES.forEach(function (b) {
      const span = document.createElement('span');
      span.className = 'kids-badge ' + b.id + (streak >= b.days ? '' : ' locked');
      span.textContent = (streak >= b.days ? '★ ' : '☆ ') + b.label;
      list.appendChild(span);
    });
    if (viewedCount >= 7) {
      const span = document.createElement('span');
      span.className = 'kids-badge story-master';
      span.textContent = '★ Story Master';
      list.appendChild(span);
    }
  }

  function getViewedStories() {
    try {
      const raw = localStorage.getItem(LIBRARY_VIEWED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function getDailyKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getKidReflectionFromLocalStorage() {
    try {
      const raw = localStorage.getItem(KID_REFLECTION_KEY);
      const val = raw ? JSON.parse(raw) : {};
      const today = getDailyKey();
      const entry = val[today];
      return (entry && entry.text) ? { text: entry.text, verse: entry.verse || '', date: today } : null;
    } catch (e) { return null; }
  }

  function fetchKidReflectionsFromSupabase(callback) {
    var code = null;
    try { code = (localStorage.getItem(BETA_CODE_KEY) || localStorage.getItem(KIDS_FAMILY_CODE_KEY) || '').trim().toUpperCase(); } catch (e) {}
    if (!code || code.length !== 6 || !navigator.onLine) { callback(null); return; }
    var cfg = window.TDB_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) { callback(null); return; }
    try {
      var supabase = window.supabase && window.supabase.createClient ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
      if (!supabase) { callback(null); return; }
      supabase.rpc('get_kid_reflections', { p_code: code })
        .then(function (res) {
          if (res.error || !res.data || !Array.isArray(res.data) || res.data.length === 0) { callback(null); return; }
          var r = res.data[0];
          callback(r ? { text: r.reflection, verse: r.verse_ref || '', date: r.reflection_date } : null);
        })
        .catch(function () { callback(null); });
    } catch (e) { callback(null); }
  }

  function renderLibraryBadges() {
    const row = document.getElementById('parent-library-badges');
    if (!row) return;
    const viewedCount = getViewedStories().length;
    while (row.firstChild) row.removeChild(row.firstChild);
    const badges = [
      { id: 'story-explorer', min: 10, icon: '🛡️', label: 'Story Explorer', text: '10 stories explored!' },
      { id: 'bible-champ', min: 20, icon: '👑', label: 'Bible Champ', text: '20 stories—wow!' }
    ];
    badges.forEach(function (b) {
      if (viewedCount >= b.min) {
        const span = document.createElement('span');
        span.className = 'kids-library-badge ' + b.id + ' kids-badge-fade-in';
        span.setAttribute('aria-label', b.label + ': ' + b.text);
        span.textContent = b.icon + ' ' + b.label + ' — ' + b.text;
        row.appendChild(span);
      }
    });
  }

  function renderFavorites() {
    const grid = document.getElementById('parent-favorites-grid');
    const emptyFavCopy = document.getElementById('parent-favorites-empty-copy');
    const section = grid ? grid.closest('section') : null;
    if (!grid) return;
    function setFavEmptyVisible(show) {
      if (emptyFavCopy) emptyFavCopy.classList.toggle('hidden', !show);
    }
    function showKidThought(reflection) {
      if (!section || !reflection || !reflection.text) {
        var thoughtEl = document.getElementById('parent-kid-thought');
        if (thoughtEl) thoughtEl.classList.add('hidden');
        return;
      }
      var thoughtEl = document.getElementById('parent-kid-thought');
      if (!thoughtEl) {
        thoughtEl = document.createElement('p');
        thoughtEl.id = 'parent-kid-thought';
        thoughtEl.className = 'kids-parent-kid-thought';
        section.insertBefore(thoughtEl, grid);
      }
      var dateStr = reflection.date ? new Date(reflection.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'today';
      thoughtEl.textContent = "Kid's Thought on " + dateStr + ': ' + tdbPlainTextForUi(reflection.text || '') + (reflection.verse ? ' (' + tdbPlainTextForUi(reflection.verse) + ')' : '');
      thoughtEl.classList.remove('hidden');
    }
    fetchKidReflectionsFromSupabase(function (fromSupabase) {
      var reflection = fromSupabase || getKidReflectionFromLocalStorage();
      showKidThought(reflection);
    });
    const viewed = getViewedStories();
    const stories = (typeof window !== 'undefined' && window.TDB_BIBLE_STORIES) ? window.TDB_BIBLE_STORIES : {};
    const last5 = viewed.slice(-5).reverse();
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    if (last5.length === 0) {
      setFavEmptyVisible(true);
      return;
    }
    setFavEmptyVisible(false);
    last5.forEach(function (key) {
      const s = stories[key];
      const title = (s && s.title) ? s.title : (key || 'Story');
      const panels = (s && s.panels && s.panels.length) ? s.panels : [];
      const thumb = panels[0] ? (typeof panels[0] === 'object' ? panels[0].src : panels[0]) : 'panel-noah-1.svg';
      const ctx = (s && s.kidContext) ? s.kidContext : null;
      const apply = (ctx && ctx.apply) ? ctx.apply : 'Talk about what God did in this story!';
      const card = document.createElement('a');
      card.href = 'corner.html';
      card.className = 'kids-parent-favorite-card';
      card.setAttribute('aria-label', 'View ' + tdbPlainTextForUi(title) + ' in Library');
      const img = document.createElement('img');
      img.src = thumb;
      img.alt = '';
      img.loading = 'lazy';
      const titleSpan = document.createElement('span');
      titleSpan.className = 'kids-parent-favorite-title';
      titleSpan.textContent = tdbPlainTextForUi(title);
      const talkSpan = document.createElement('span');
      talkSpan.className = 'kids-parent-favorite-talk';
      talkSpan.textContent = 'Talk about: ' + tdbPlainTextForUi(apply);
      card.appendChild(img);
      card.appendChild(titleSpan);
      card.appendChild(talkSpan);
      grid.appendChild(card);
    });
  }

  function wirePrintGuide() {
    const btn = document.getElementById('parent-print-guide');
    if (!btn) return;
    btn.addEventListener('click', function () {
      window.print();
    });
  }

  function init() {
    renderParentCode();
    renderStreak();
    renderDoodles();
    renderBadges();
    renderFavorites();
    renderLibraryBadges();
    wirePrintGuide();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
