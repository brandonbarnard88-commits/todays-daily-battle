/**
 * Pastor Hub — Daily verse, reflection (localStorage + Supabase), Library, Builder, Tools.
 * Uses script.js: getDailyVerseRef, bible, getBibleVerseText, getDailyKey.
 */
(function () {
  'use strict';

  const PASTOR_REFLECTION_KEY = 'pastorReflection';
  const PASTOR_BUILDER_DRAFT_KEY = 'pastorBuilderDraft';

  function getDailyKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getOrCreateAnonId() {
    try {
      var id = localStorage.getItem('pastorHubAnonId');
      if (id && id.length >= 10) return id;
      id = 'ph_' + Date.now() + '_' + Math.random().toString(36).slice(2, 12);
      localStorage.setItem('pastorHubAnonId', id);
      return id;
    } catch (e) { return 'ph_anon'; }
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  /* --- Daily verse + reflection --- */
  function renderDailyVerse() {
    var card = document.getElementById('pastor-daily-verse-card');
    var refEl = document.getElementById('pastor-daily-ref');
    if (!card) return;

    var ref = null;
    var text = '';
    var getRef = window.getDailyVerseRef || (typeof getDailyVerseRef === 'function' ? getDailyVerseRef : null);
    var getText = window.getBibleVerseText || (typeof getBibleVerseText === 'function' ? getBibleVerseText : null);
    var b = window.bible || (typeof bible !== 'undefined' ? bible : {});
    if (getRef) ref = getRef();
    if (ref && b[ref]) text = b[ref];
    else if (getText && ref) text = getText(ref);

    var fb = { ref: 'Philippians 4:6', text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.' };
    if (!ref || !text) {
      ref = fb.ref;
      text = fb.text;
    }

    if (refEl) refEl.textContent = ref;
    card.innerHTML = '<strong>' + escapeHtml(ref) + '</strong><p>' + escapeHtml(text) + '</p>';
    card.classList.add('verse-card-loaded');
  }

  function loadReflection() {
    var input = document.getElementById('pastor-reflection-input');
    if (!input) return;
    try {
      var raw = localStorage.getItem(PASTOR_REFLECTION_KEY);
      var val = raw ? JSON.parse(raw) : {};
      var today = getDailyKey();
      input.value = val[today] || '';
    } catch (e) {}
  }

  function saveReflection() {
    var input = document.getElementById('pastor-reflection-input');
    if (!input) return;
    var text = (input.value || '').trim();
    try {
      var raw = localStorage.getItem(PASTOR_REFLECTION_KEY);
      var val = raw ? JSON.parse(raw) : {};
      val[getDailyKey()] = text;
      localStorage.setItem(PASTOR_REFLECTION_KEY, JSON.stringify(val));
      showReflectionSaved();
      if (navigator.onLine) syncReflectionToSupabase(text);
    } catch (e) {}
  }

  function showReflectionSaved() {
    var dot = document.getElementById('pastor-reflection-saved');
    if (!dot) return;
    dot.textContent = 'Saved';
    dot.classList.remove('hidden');
    clearTimeout(showReflectionSaved._t);
    showReflectionSaved._t = setTimeout(function () {
      dot.classList.add('hidden');
    }, 2000);
  }

  function syncReflectionToSupabase(reflection) {
    var cfg = window.TDB_CONFIG || {};
    var url = cfg.SUPABASE_URL;
    var key = cfg.SUPABASE_ANON_KEY;
    if (!url || !key) return;
    var anonId = getOrCreateAnonId();
    try {
      var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
      if (!supabase || !supabase.createClient) return;
      var client = supabase.createClient(url, key);
      client.rpc('upsert_bible_reflection', {
        p_anon_id: anonId,
        p_date: getDailyKey(),
        p_reflection: reflection || '',
        p_verse_ref: document.getElementById('pastor-daily-ref') ? document.getElementById('pastor-daily-ref').textContent : ''
      }).catch(function () {});
    } catch (e) {}
  }

  /* --- Builder draft (shared with Library "Use This") --- */
  function getBuilderDraft() {
    try {
      return JSON.parse(localStorage.getItem(PASTOR_BUILDER_DRAFT_KEY) || '{}');
    } catch (e) { return {}; }
  }

  function setBuilderDraft(draft) {
    try {
      localStorage.setItem(PASTOR_BUILDER_DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {}
  }

  /* Pastor Dashboard MVP: Simple setter for Church Verse of the Day (uses new RPC, KJV-only, anonymous stats via trackEvent).
     One-page hub: Set Verse → Preview (with breakdown) → Share Code. PDF Sermon Builder extended from team packs.
     Integrates with team sync for dashboard. */
  window.setTeamVerse = async function(verseRef, teamCode = null) {
    if (!verseRef) return {ok: false, reason: 'missing_verse'};
    // Enforce KJV-only (app side)
    if (!verseRef.match(/^[1-3]?\s*[A-Za-z]+\s+\d+:\d+/)) {
      return {ok: false, reason: 'must_be_kjv_ref'};
    }
    const code = teamCode || localStorage.getItem('tdb_tt_active_team') || 'default';
    if (!supabase && typeof supabase !== 'undefined') initSupabaseForPastor(); // fallback
    try {
      if (supabase) {
        const { data } = await supabase.rpc('set_team_verse', {
          p_code: code,
          p_verse_ref: verseRef
        });
        if (data && data.ok) {
          if (typeof trackEvent === 'function') trackEvent('church_verse_set', { success: true });
          return data;
        }
      }
      // Local fallback for offline
      localStorage.setItem('team_verse_' + code, verseRef);
      return {ok: true, verse: verseRef, note: 'local_cache'};
    } catch (e) {
      console.error('setTeamVerse error', e);
      return {ok: false, reason: e.message};
    }
  };

  function initSupabaseForPastor() {
    // Reuse logic from team-toolkit if needed
    if (typeof supabaseClient !== 'undefined') supabase = supabaseClient;
  }

  window.PastorHub = {
    getDailyKey: getDailyKey,
    getBuilderDraft: getBuilderDraft,
    setBuilderDraft: setBuilderDraft,
    escapeHtml: escapeHtml,
    setTeamVerse: window.setTeamVerse
  };

  /* --- Init Daily page --- */
  function initDaily() {
    if (!document.getElementById('pastor-daily-verse-card')) return;
    renderDailyVerse();
    loadReflection();

    var input = document.getElementById('pastor-reflection-input');
    if (input) {
      input.addEventListener('blur', saveReflection);
      input.addEventListener('input', function () {
        clearTimeout(saveReflection._debounce);
        saveReflection._debounce = setTimeout(saveReflection, 800);
      });
    }

    if (typeof bible !== 'undefined' && Object.keys(bible).length === 0) {
      setTimeout(renderDailyVerse, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDaily);
  } else {
    initDaily();
  }
})();
