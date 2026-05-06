;(function () {
  'use strict';

  if (typeof window === 'undefined') return;
  if (window.TDBKidsShared) return;

  var kidSupabaseClient = null;
  var kidSupabaseInitPromise = null;
  var kidSupabaseDeferResolve = null;

  function tdbSetHtml(el, html) {
    if (!el) return;
    var s = html == null ? '' : String(html);
    var pol = window.trustedTypes && window.trustedTypes.defaultPolicy;
    if (pol && typeof pol.createHTML === 'function') {
      try {
        el.innerHTML = pol.createHTML(s);
        return;
      } catch (_) {
        try {
          var wash = typeof DOMPurify !== 'undefined' && DOMPurify.sanitize
            ? DOMPurify.sanitize(s, { RETURN_TRUSTED_TYPE: false })
            : s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
          el.innerHTML = pol.createHTML(wash);
          return;
        } catch (__) {
          try { el.innerHTML = pol.createHTML(''); } catch (___) {}
          return;
        }
      }
    }
    try {
      el.innerHTML = s;
    } catch (____) {
      try { el.textContent = String(s).replace(/<[^>]+>/g, ' '); } catch (_____) {}
    }
  }

  function tdbClearHtml(el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function decodeEntitiesForPlainUi(str) {
    if (str == null || str === '') return '';
    var out = String(str);
    var prev;
    for (var n = 0; n < 12; n++) {
      prev = out;
      out = out.replace(/&amp;/g, '&');
      if (out === prev) break;
    }
    out = out
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#0*39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, '\u00a0');
    out = out.replace(/&#(\d{1,7});/g, function (_, num) {
      var code = parseInt(num, 10);
      return code >= 0 && code <= 0x10ffff ? String.fromCharCode(code) : '';
    });
    out = out.replace(/&#x([0-9a-fA-F]{1,6});/g, function (_, hex) {
      var code = parseInt(hex, 16);
      return code >= 0 && code <= 0x10ffff ? String.fromCharCode(code) : '';
    });
    return out;
  }

  function plainTextForUi(value) {
    if (value == null || value === '') return '';
    var text = decodeEntitiesForPlainUi(String(value));
    if (typeof window.tdbCleanForPlainDisplay === 'function') {
      return window.tdbCleanForPlainDisplay(text);
    }
    if (typeof window.tdbStripAngleMarkupForPlainText === 'function') {
      return window.tdbStripAngleMarkupForPlainText(text);
    }
    return String(text).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function normalizeBibleStoriesForUi(stories) {
    if (!stories || typeof stories !== 'object') return;
    var keys = Object.keys(stories);
    for (var si = 0; si < keys.length; si++) {
      var story = stories[keys[si]];
      if (!story || typeof story !== 'object') continue;
      if (story.title != null) story.title = plainTextForUi(story.title);
      if (story.caption != null) story.caption = plainTextForUi(story.caption);
      if (story.kjvRef != null) story.kjvRef = plainTextForUi(story.kjvRef);
      if (story.videoTitle != null) story.videoTitle = plainTextForUi(story.videoTitle);
      if (story.narration != null) story.narration = plainTextForUi(story.narration);
      var ctx = story.kidContext;
      if (ctx && typeof ctx === 'object') {
        if (ctx.who != null) ctx.who = plainTextForUi(ctx.who);
        if (ctx.to != null) ctx.to = plainTextForUi(ctx.to);
        if (ctx.apply != null) ctx.apply = plainTextForUi(ctx.apply);
      }
      var panels = story.panels;
      if (Array.isArray(panels)) {
        for (var pi = 0; pi < panels.length; pi++) {
          var panel = panels[pi];
          if (panel && panel.alt != null) panel.alt = plainTextForUi(String(panel.alt));
        }
      }
    }
  }

  function createKidSupabaseClientInstance() {
    var cfg = window.TDB_CONFIG || {};
    var supabaseUrl = cfg.SUPABASE_URL;
    var supabaseKey = cfg.SUPABASE_ANON_KEY;
    var lib = window.supabase && window.supabase.createClient ? window.supabase : (typeof supabase !== 'undefined' ? supabase : null);
    if (!supabaseUrl || !supabaseKey || !lib || !lib.createClient) return null;
    var storage = null;
    try {
      storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : undefined;
    } catch (_) {}
    var opts = {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    };
    if (storage) opts.auth.storage = storage;
    try {
      return lib.createClient(supabaseUrl, supabaseKey, opts);
    } catch (e) {
      if (typeof console !== 'undefined' && console.warn) console.warn('Supabase client init failed:', e);
      return null;
    }
  }

  function getKidSupabaseClient(immediate) {
    if (kidSupabaseClient) return Promise.resolve(kidSupabaseClient);
    if (immediate) {
      kidSupabaseClient = createKidSupabaseClientInstance();
      if (kidSupabaseDeferResolve) {
        var resolveImmediate = kidSupabaseDeferResolve;
        kidSupabaseDeferResolve = null;
        kidSupabaseInitPromise = null;
        resolveImmediate(kidSupabaseClient);
      }
      return Promise.resolve(kidSupabaseClient);
    }
    if (kidSupabaseInitPromise) return kidSupabaseInitPromise;
    kidSupabaseInitPromise = new Promise(function (resolve) {
      kidSupabaseDeferResolve = resolve;
      var run = function () {
        if (!kidSupabaseClient) kidSupabaseClient = createKidSupabaseClientInstance();
        kidSupabaseDeferResolve = null;
        kidSupabaseInitPromise = null;
        resolve(kidSupabaseClient);
      };
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(run, { timeout: 1500 });
      } else {
        setTimeout(run, 500);
      }
    });
    return kidSupabaseInitPromise;
  }

  function withKidSupabase(immediate, fn) {
    return getKidSupabaseClient(immediate).then(function (client) {
      if (!client) return;
      try {
        var result = fn(client);
        if (result && typeof result.then === 'function') return result;
      } catch (e) {
        if (typeof console !== 'undefined' && console.warn) console.warn('Supabase operation failed:', e);
      }
    });
  }

  window.TDBKidsShared = {
    setHtml: tdbSetHtml,
    clearHtml: tdbClearHtml,
    decodeEntitiesForPlainUi: decodeEntitiesForPlainUi,
    plainTextForUi: plainTextForUi,
    normalizeBibleStoriesForUi: normalizeBibleStoriesForUi,
    createKidSupabaseClientInstance: createKidSupabaseClientInstance,
    getKidSupabaseClient: getKidSupabaseClient,
    withKidSupabase: withKidSupabase
  };
})();
