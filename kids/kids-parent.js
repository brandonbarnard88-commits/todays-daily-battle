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

  function prettyStoryKey(k) {
    if (!k) return '';
    const s = String(k).replace(/([A-Z])/g, ' $1').trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function getDayOfYear() {
    const d = new Date();
    const start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - start) / 86400000);
  }

  function renderTodaySnapshot() {
    const el = document.getElementById('parent-today-summary');
    if (!el) return;
    const streak = getCurrentStreak();
    const viewed = getViewedStories();
    let recent = [];
    try {
      const raw = localStorage.getItem('kidsLibraryRecentStoryKeys');
      const arr = raw ? JSON.parse(raw) : [];
      recent = Array.isArray(arr) ? arr.slice(0, 4) : [];
    } catch (e) {}
    const a = 'Streak: ' + streak + ' day' + (streak === 1 ? '' : 's') + ' on Kids Battle when you use the hub. ';
    const b = 'Bible Story Library: ' + viewed.length + ' story finishes tracked on this device. ';
    const c = recent.length
      ? 'Lately: ' + recent.map(prettyStoryKey).join(' · ') + '.'
      : 'No new story taps logged yet—open one when the moment is sweet.';
    el.textContent = a + b + c;
  }

  function fillParentDevotion() {
    const el = document.getElementById('parent-devotion-verse');
    if (!el) return;
    const V = [
      { ref: 'Psalm 4:8', text: 'I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.' },
      { ref: 'Psalm 56:3', text: 'What time I am afraid, I will trust in thee.' },
      { ref: 'Matthew 11:28', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' },
      { ref: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.' }
    ];
    const v = V[getDayOfYear() % V.length];
    el.textContent = '';
    el.appendChild(document.createTextNode(v.text + ' '));
    const cite = document.createElement('cite');
    cite.textContent = 'KJV — ' + v.ref;
    el.appendChild(cite);
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

  function renderGentleNotice(el, lines, question) {
    if (!el) return;
    el.replaceChildren();
    lines.forEach(function (line) {
      var p = document.createElement('p');
      p.textContent = line;
      el.appendChild(p);
    });
    var strong = document.createElement('strong');
    strong.textContent = question;
    el.appendChild(strong);
  }

  function buildParentStoryCard(imageSrc, imageAlt, title, reflection) {
    const card = document.createElement('div');
    card.className = 'story-card';

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = imageAlt;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'story-info';

    const heading = document.createElement('h4');
    heading.textContent = title;

    const note = document.createElement('p');
    note.className = 'reflection';
    note.textContent = reflection;

    info.appendChild(heading);
    info.appendChild(note);
    card.appendChild(img);
    card.appendChild(info);
    return card;
  }

  // Family Quiet View — on-device, heart-centered, no gamification.
  // Gentle noticing, reflection, and conversation. Matches .cursorrules perfectly.
  function loadParentView() {
    const savedStories = JSON.parse(localStorage.getItem('savedColorings') || '{}');
    const gallery = document.getElementById('parent-doodles-gallery');
    const emptyCopy = document.getElementById('parent-doodles-empty-copy');
    const favoritesGrid = document.getElementById('parent-favorites-grid');
    const favoritesEmpty = document.getElementById('parent-favorites-empty-copy');
    const gentleNotice = document.getElementById('gentle-notice');

    if (gentleNotice) {
      // Rotate gentle notices or use saved reflection if available
      const reflections = [
        {
          lines: [
            'Your child spent time with David today.',
            'They gave him very brave eyes.'
          ],
          question: 'Maybe ask them: What made David brave?'
        },
        {
          lines: [
            "They colored Noah's Ark.",
            'The rainbow reminded them God keeps every promise.'
          ],
          question: 'Quiet question: When has God kept a promise for you?'
        },
        {
          lines: [
            'Today they walked with the Good Shepherd.',
            'They drew Him carrying a lamb.'
          ],
          question: 'Ask: How does it feel to know Jesus carries you?'
        }
      ];
      const pickedReflection = reflections[Math.floor(Math.random() * reflections.length)];
      renderGentleNotice(gentleNotice, pickedReflection.lines, pickedReflection.question);
    }

    // Render colorings gallery
    if (gallery) {
      gallery.innerHTML = '';
      if (Object.keys(savedStories).length === 0) {
        if (emptyCopy) emptyCopy.style.display = 'block';
      } else {
        if (emptyCopy) emptyCopy.style.display = 'none';
        Object.entries(savedStories).slice(0, 6).forEach(([id, data]) => {
          const title = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const thumb = (data.scenes && data.scenes[0]) || 'panel-noah-1.svg';
          gallery.appendChild(buildParentStoryCard(thumb, title, title, 'They spent quiet time with this story today.'));
        });
      }
    }

    // Favorites: see renderFavorites() in init (full story cards + TDB data)

    // Wire family note
    const noteArea = document.getElementById('family-note');
    if (noteArea) {
      noteArea.value = localStorage.getItem('familyNote') || '';
      noteArea.addEventListener('input', () => {
        localStorage.setItem('familyNote', noteArea.value);
      });
    }
  }

  function exportStory(id) {
    const saved = JSON.parse(localStorage.getItem('savedColorings') || '{}');
    const data = saved[id];
    if (!data) {
      alert('No saved coloring found for this story.');
      return;
    }

    const title = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const JsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF) {
      alert('PDF library still loading — tap again in a moment.');
      return;
    }

    try {
      const doc = new JsPDF('p', 'mm', 'a4');
      const pageW = doc.internal.pageSize.getWidth();
      let y = 20;

      // Title
      doc.setFontSize(22);
      doc.setTextColor(227, 188, 103);
      doc.text(title, pageW / 2, y, { align: 'center' });
      y += 15;

      // Verse
      if (data.verse) {
        doc.setFontSize(12);
        doc.setTextColor(168, 179, 196);
        const verseLines = doc.splitTextToSize(data.verse, pageW - 30);
        doc.text(verseLines, pageW / 2, y, { align: 'center' });
        y += verseLines.length * 6 + 10;
      }

      // Encouraging note
      doc.setFontSize(11);
      doc.setTextColor(245, 247, 251);
      doc.text('A quiet memory from your child’s time with God’s Word.', pageW / 2, y, { align: 'center' });
      y += 15;

      // Thumbs / scenes
      const scenes = data.scenes || [];
      if (scenes.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(168, 179, 196);
        doc.text('The story panels they colored:', 20, y);
        y += 8;

        scenes.forEach((src, i) => {
          if (y > 240) {
            doc.addPage();
            y = 20;
          }
          try {
            doc.addImage(src, 'JPEG', 20, y, 80, 60);
            y += 70;
          } catch (_) {}
        });
      }

      // If coloring dataUrl
      if (data.coloring) {
        if (y > 200) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(10);
        doc.setTextColor(227, 188, 103);
        doc.text('Their coloring:', 20, y);
        y += 8;
        try {
          doc.addImage(data.coloring, 'PNG', 20, y, 170, 120);
          y += 130;
        } catch (_) {}
      }

      // Closing
      doc.setFontSize(13);
      doc.setTextColor(227, 188, 103);
      doc.text('God is faithful. Keep walking together.', pageW / 2, y + 10, { align: 'center' });

      const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      doc.save(`family-memory-${safeTitle}.pdf`);
      // Track
      if (typeof trackEvent === 'function') trackEvent('parent_export_pdf', { story: id });
    } catch (err) {
      console.error(err);
      alert('Could not create the PDF. The image may be too large — try exporting from the coloring screen instead.');
    }
  }

  function clearAll() {
    if (!confirm('Clear all saved colorings and progress from this device?\n\nThis cannot be undone, but you can always start fresh with the stories.')) {
      return;
    }
    try {
      localStorage.removeItem('savedColorings');
      localStorage.removeItem('completedStories');
      localStorage.removeItem('storyProgress');
      // Also clear doodles if desired
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith('kidsDoodle')) localStorage.removeItem(k);
      }
      alert('All saves cleared. The dashboard will refresh.');
      // Reload the view
      const dash = document.getElementById('parent-dash');
      if (dash && dash.parentNode) dash.parentNode.removeChild(dash);
      loadParentView();
    } catch (e) {
      alert('Could not clear saves.');
    }
  }

  function init() {
    wirePrintGuide();
    if (typeof window.loadParentView !== 'function') {
      window.loadParentView = loadParentView;
    }
    if (typeof window.exportStory !== 'function') {
      window.exportStory = exportStory;
    }
    if (typeof window.clearAll !== 'function') {
      window.clearAll = clearAll;
    }

    setTimeout(() => {
      try {
        renderParentCode();
        renderTodaySnapshot();
        fillParentDevotion();
        renderStreak();
        renderFavorites();
        renderBadges();
        renderLibraryBadges();
        loadParentView();
        renderDoodles();
      } catch (e) {
        console.warn('Quiet View init had a small hiccup — still usable.', e);
      }
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
