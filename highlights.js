(function () {
  'use strict';

  var STORAGE_KEY = 'tdb_mystudy_highlights_v1';
  var SYNC_KEY = 'mystudy_highlights';
  var PORTRAIT_PROMPT = 'comic praying hands, golden glow, dark bg, no faces';
  var MAX_NOTE = 900;
  var state = {
    items: [],
    selectedId: '',
    refs: null,
    setTab: null,
    client: null,
    userId: '',
    syncReady: false
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function safeText(str, max) {
    var out = String(str || '').replace(/\s+/g, ' ').trim();
    if (typeof max === 'number' && out.length > max) return out.slice(0, max);
    return out;
  }

  function makeId(ref) {
    return 'hl_' + safeText(ref || '').toLowerCase().replace(/[^a-z0-9]+/g, '_') + '_' + Date.now().toString(36);
  }

  function loadLocal() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveLocal(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items || []));
    } catch (e) {}
  }

  function mergeItems(localItems, remoteItems) {
    var merged = {};
    (localItems || []).forEach(function (item) {
      if (item && item.id) merged[item.id] = item;
    });
    (remoteItems || []).forEach(function (item) {
      if (!item || !item.id) return;
      var existing = merged[item.id];
      if (!existing) {
        merged[item.id] = item;
        return;
      }
      var localAt = Date.parse(existing.updatedAt || existing.createdAt || 0) || 0;
      var remoteAt = Date.parse(item.updatedAt || item.createdAt || 0) || 0;
      if (remoteAt >= localAt) merged[item.id] = item;
    });
    return Object.keys(merged).map(function (k) { return merged[k]; })
      .sort(function (a, b) {
        var aAt = Date.parse(a.updatedAt || a.createdAt || 0) || 0;
        var bAt = Date.parse(b.updatedAt || b.createdAt || 0) || 0;
        return bAt - aAt;
      });
  }

  function getSdk() {
    if (typeof window === 'undefined') return null;
    if (window.supabase && typeof window.supabase.createClient === 'function') return window.supabase;
    return null;
  }

  async function ensureSyncClient() {
    if (state.syncReady) return state.client;
    state.syncReady = true;
    var cfg = window.TDB_CONFIG || {};
    var sdk = getSdk();
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY || !sdk) return null;
    try {
      state.client = sdk.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
      var sessionResult = await state.client.auth.getSession();
      var user = sessionResult && sessionResult.data && sessionResult.data.session && sessionResult.data.session.user;
      state.userId = user && user.id ? String(user.id) : '';
      return state.client;
    } catch (e) {
      state.client = null;
      return null;
    }
  }

  async function pullRemote() {
    var client = await ensureSyncClient();
    if (!client || !state.userId) return null;
    try {
      var result = await client
        .from('user_sync_data')
        .select('sync_value')
        .eq('user_id', state.userId)
        .eq('sync_key', SYNC_KEY)
        .maybeSingle();
      if (result && !result.error && result.data && result.data.sync_value && Array.isArray(result.data.sync_value.items)) {
        return result.data.sync_value.items;
      }
    } catch (e) {}
    return null;
  }

  async function pushRemote() {
    var client = await ensureSyncClient();
    if (!client || !state.userId) return false;
    try {
      var payload = { items: state.items, updatedAt: nowIso() };
      var upsertResult = await client
        .from('user_sync_data')
        .upsert(
          { user_id: state.userId, sync_key: SYNC_KEY, sync_value: payload, updated_at: nowIso() },
          { onConflict: 'user_id,sync_key' }
        );
      return !upsertResult.error;
    } catch (e) {
      return false;
    }
  }

  function setStatus(message) {
    if (!state.refs || !state.refs.status) return;
    state.refs.status.textContent = message || '';
  }

  function renderGrid() {
    if (!state.refs || !state.refs.grid) return;
    var grid = state.refs.grid;
    grid.innerHTML = '';
    if (!state.items.length) {
      var note = document.createElement('p');
      note.className = 'section-note';
      note.textContent = 'No highlights saved yet. Open a verse and tap Highlight to build your library.';
      grid.appendChild(note);
      return;
    }
    state.items.forEach(function (item) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'mystudy-highlight-card';
      card.setAttribute('aria-label', 'Open highlight ' + item.ref);
      card.dataset.highlightId = item.id;

      var portrait = document.createElement('div');
      portrait.className = 'mystudy-highlight-portrait';
      portrait.setAttribute('aria-hidden', 'true');
      portrait.dataset.prompt = item.portraitPrompt || PORTRAIT_PROMPT;
      card.appendChild(portrait);

      var ref = document.createElement('p');
      ref.className = 'mystudy-highlight-ref';
      ref.textContent = item.ref || 'Verse';
      card.appendChild(ref);

      card.addEventListener('click', function () {
        openDetail(item.id);
      });
      grid.appendChild(card);
    });
  }

  function openDetail(id) {
    state.selectedId = id || '';
    if (!state.refs || !state.refs.detail) return;
    var item = state.items.find(function (it) { return it.id === state.selectedId; });
    if (!item) {
      state.refs.detail.classList.add('hidden');
      return;
    }
    state.refs.ref.textContent = item.ref || '';
    state.refs.text.textContent = item.text || '';
    state.refs.note.textContent = item.note ? 'Note: ' + item.note : 'No note added yet. Add one to capture why this verse matters today.';
    state.refs.detail.classList.remove('hidden');
  }

  function notifyUpdate() {
    document.dispatchEvent(new CustomEvent('tdb:highlights-updated', { detail: { count: state.items.length } }));
  }

  async function hydrate() {
    state.items = loadLocal();
    renderGrid();
    var remote = await pullRemote();
    if (Array.isArray(remote)) {
      state.items = mergeItems(state.items, remote);
      saveLocal(state.items);
      renderGrid();
      setStatus('Highlights synced for this account.');
    } else {
      setStatus('Highlights are private on this device unless you are signed in.');
    }
    notifyUpdate();
  }

  async function saveHighlight(payload) {
    var ref = safeText(payload && payload.ref, 90);
    var text = safeText(payload && payload.text, 1400);
    var note = safeText(payload && payload.note, MAX_NOTE);
    if (!ref || !text) return null;
    var existing = state.items.find(function (it) { return it.ref.toLowerCase() === ref.toLowerCase(); });
    var item = existing || {
      id: makeId(ref),
      ref: ref,
      createdAt: nowIso()
    };
    item.text = text;
    item.note = note;
    item.updatedAt = nowIso();
    item.portraitPrompt = PORTRAIT_PROMPT;

    if (!existing) state.items.unshift(item);
    saveLocal(state.items);
    renderGrid();
    openDetail(item.id);
    notifyUpdate();
    var synced = await pushRemote();
    setStatus(synced ? 'Highlight saved and synced.' : 'Highlight saved on this device.');
    return item;
  }

  async function removeHighlight(id) {
    var targetId = id || state.selectedId;
    if (!targetId) return;
    state.items = state.items.filter(function (it) { return it.id !== targetId; });
    state.selectedId = '';
    saveLocal(state.items);
    renderGrid();
    if (state.refs && state.refs.detail) state.refs.detail.classList.add('hidden');
    await pushRemote();
    setStatus('Highlight removed.');
    notifyUpdate();
  }

  function getHighlights() {
    return state.items.slice();
  }

  function buildShareText(item) {
    if (!item) return '';
    var lines = [
      'Shared from My Study',
      item.ref + ' — ' + item.text
    ];
    if (item.note) lines.push('Note: ' + item.note);
    return lines.join('\n');
  }

  function copyText(text) {
    if (!text) return Promise.resolve(false);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () { return false; });
    }
    return Promise.resolve(false);
  }

  async function shareSelectedToChurch() {
    var item = state.items.find(function (it) { return it.id === state.selectedId; });
    if (!item) return;
    if (window.TDBChurchShare && typeof window.TDBChurchShare.shareHighlight === 'function') {
      try {
        await window.TDBChurchShare.shareHighlight(item);
        setStatus('Shared to Church.');
        return;
      } catch (e) {}
    }
    var copied = await copyText(buildShareText(item));
    setStatus(copied ? 'Share text copied. Paste in Church hub.' : 'Could not share right now.');
  }

  function initMyStudyHighlights(options) {
    state.setTab = options && typeof options.setTab === 'function' ? options.setTab : null;
    state.refs = {
      status: byId('mystudy-highlights-status'),
      grid: byId('mystudy-highlights-grid'),
      detail: byId('mystudy-highlight-detail'),
      ref: byId('mystudy-highlight-ref'),
      text: byId('mystudy-highlight-text'),
      note: byId('mystudy-highlight-note'),
      shareBtn: byId('mystudy-share-church'),
      removeBtn: byId('mystudy-remove-highlight')
    };
    if (!state.refs.grid) return;
    state.refs.shareBtn && state.refs.shareBtn.addEventListener('click', shareSelectedToChurch);
    state.refs.removeBtn && state.refs.removeBtn.addEventListener('click', function () { removeHighlight(); });
    hydrate();
  }

  window.TDBHighlights = {
    initMyStudyHighlights: initMyStudyHighlights,
    saveHighlight: saveHighlight,
    removeHighlight: removeHighlight,
    getHighlights: getHighlights,
    PORTRAIT_PROMPT: PORTRAIT_PROMPT
  };
})();
