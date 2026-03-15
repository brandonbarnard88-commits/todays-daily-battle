/**
 * Ask the Word — Bible Q&A on bible-tool.html
 * Wires input, button, fetch to Supabase bible-qa Edge Function, fallback to kjv.json keyword search.
 * Runs on DOMContentLoaded so elements exist. Cache-busted via ?v= in script src.
 */
(function () {
  'use strict';

  function init() {
    var input = document.getElementById('bible-qa-search');
    var btn = document.getElementById('bible-qa-btn');
    var result = document.getElementById('qa-result');
    var prayerEl = document.getElementById('qa-prayer-prompt');

    if (!input || !btn || !result) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Ask the Word: missing #bible-qa-search, #bible-qa-btn, or #qa-result');
      }
      return;
    }

    var CACHE_KEY = 'tdb-ask-the-word-cache';
    var CACHE_TTL = 24 * 60 * 60 * 1000;

    function escapeHtml(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }

    function getCache() {
      try {
        var r = localStorage.getItem(CACHE_KEY);
        return r ? JSON.parse(r) : {};
      } catch (e) {
        return {};
      }
    }

    function setCache(k, v) {
      try {
        var c = getCache();
        c[k] = { v: v, t: Date.now() };
        var keys = Object.keys(c);
        if (keys.length > 50) {
          keys.sort(function (a, b) { return (c[a].t || 0) - (c[b].t || 0); });
          for (var i = 0; i < keys.length - 50; i++) delete c[keys[i]];
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(c));
      } catch (e) {}
    }

    function getCached(q) {
      var k = q.toLowerCase().replace(/\s+/g, ' ').trim();
      var c = getCache();
      var e = c[k];
      if (!e || !e.v) return null;
      if (Date.now() - (e.t || 0) > CACHE_TTL) {
        delete c[k];
        return null;
      }
      return e.v;
    }

    function isOffTopic(q) {
      var l = q.toLowerCase();
      return /pineapple|pizza|football|sports|movie|netflix|recipe|cooking/.test(l);
    }

    function verseLink(ref) {
      var r = String(ref || '').trim();
      if (!r) return '';
      return '<a href="reader.html?ref=' + encodeURIComponent(r) + '" class="qa-verse-link">' + escapeHtml(r) + '</a>';
    }

    function localSearch(q) {
      var urls = ['kjv.json', '/kjv.json', 'https://todaysdailybattle.com/kjv.json'];
      function tryF(i) {
        if (i >= urls.length) return Promise.reject();
        return fetch(urls[i])
          .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
          .catch(function () { return tryF(i + 1); });
      }
      return tryF(0).then(function (arr) {
        if (!Array.isArray(arr)) {
          return { answer: 'Not sure—try "hope" or read John 14.', sources: ['John 14:6'] };
        }
        var words = q.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
        var syn = { love: ['love', 'charity'], wrote: ['wrote', 'paul', 'author'] };
        for (var i = 0; i < words.length; i++) {
          if (syn[words[i]]) words = words.concat(syn[words[i]]);
        }
        var scored = [];
        for (var j = 0; j < arr.length; j++) {
          var v = arr[j];
          if (!v || !v.ref || !v.text) continue;
          var txt = ((v.ref || '') + ' ' + (v.text || '')).toLowerCase();
          var sc = 0;
          for (var k = 0; k < words.length; k++) {
            if (words[k].length >= 2 && txt.indexOf(words[k]) !== -1) sc++;
          }
          if (sc > 0) scored.push({ v: v, sc: sc });
        }
        scored.sort(function (a, b) { return b.sc - a.sc; });
        var top = scored.slice(0, 3).map(function (x) { return x.v; });
        if (!top.length) top = arr.slice(0, 3).filter(function (v) { return v && v.ref; });
        var parts = top.map(function (v) {
          var s = (v.text || '').substring(0, 80);
          return v.ref + ' — ' + (v.text && v.text.length > 80 ? s + '…' : s);
        });
        return {
          answer: parts.length ? 'From the Word: ' + parts.join(' ') : 'Not sure—try "hope" or read John 14.',
          sources: top.map(function (v) { return v.ref; })
        };
      });
    }

    function invokeBibleQa(q) {
      var cfg = window.TDB_CONFIG || {};
      var url = (cfg.SUPABASE_URL || '').replace(/\/$/, '') + '/functions/v1/bible-qa';
      var key = cfg.SUPABASE_ANON_KEY || '';
      if (!url || url === '/functions/v1/bible-qa' || !key) {
        return Promise.reject(new Error('Config missing'));
      }
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
        body: JSON.stringify({ query: q })
      }).then(function (r) {
        if (!r.ok && r.status === 404) return Promise.reject(new Error('not deployed'));
        return r.json().catch(function () { return Promise.reject(); });
      });
    }

    function render(data) {
      var src = Array.isArray(data.sources) && data.sources.length
        ? data.sources.map(verseLink).join(', ')
        : '';
      result.innerHTML = '<p class="qa-answer">' + escapeHtml(data.answer) + '</p>' +
        (src ? '<p class="qa-sources">Sources: ' + src + '</p>' : '');
      result.classList.remove('hidden');
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (prayerEl) {
        prayerEl.classList.add('hidden');
        prayerEl.setAttribute('aria-hidden', 'true');
      }
      if (data.prayer_prompt) {
        var pt = String(data.prayer_prompt).trim();
        if (pt && prayerEl) {
          prayerEl.querySelector('.prompt-text').textContent = '\u201c' + pt + '\u201d';
          prayerEl.classList.remove('hidden');
          prayerEl.setAttribute('aria-hidden', 'false');
          var cb = prayerEl.querySelector('.copy-btn');
          if (cb) {
            cb.onclick = function () {
              navigator.clipboard.writeText(pt).then(function () {
                if (typeof showEliteToast === 'function') showEliteToast('Prompt copied');
              }).catch(function () {});
            };
          }
        }
      }
    }

    function setLoading(on) {
      btn.disabled = on;
      btn.innerHTML = on ? '<span class="qa-spinner" aria-hidden="true"></span> Asking…' : 'Ask';
    }

    function runAsk() {
      var q = (input.value || '').trim();
      if (!q) return;
      if (isOffTopic(q)) {
        result.classList.remove('hidden');
        result.innerHTML = '<p class="qa-answer">I don\'t know—talk to a pastor.</p>';
        if (prayerEl) prayerEl.classList.add('hidden');
        return;
      }
      var cached = getCached(q);
      if (cached) {
        render(cached);
        return;
      }
      setLoading(true);
      result.classList.remove('hidden');
      result.innerHTML = '<p class="empty">Seeking the Word…</p>';
      var cfg = window.TDB_CONFIG || {};
      var hasSupabase = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
      var req = hasSupabase ? invokeBibleQa(q) : Promise.reject(new Error('Config missing'));
      req.then(function (res) {
        setLoading(false);
        if (res && res.answer) {
          setCache(q.toLowerCase().replace(/\s+/g, ' ').trim(), res);
          render(res);
          return;
        }
        return localSearch(q).then(function (d) {
          setCache(q.toLowerCase().replace(/\s+/g, ' ').trim(), d);
          render(d);
        });
      }).catch(function () {
        return localSearch(q).then(function (d) {
          setLoading(false);
          setCache(q.toLowerCase().replace(/\s+/g, ' ').trim(), d);
          render(d);
        }).catch(function () {
          setLoading(false);
          result.innerHTML = '<p class="empty">Check your connection—or use verse lookup below.</p>';
          if (prayerEl) prayerEl.classList.add('hidden');
        });
      });
    }

    btn.addEventListener('click', runAsk);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        runAsk();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
