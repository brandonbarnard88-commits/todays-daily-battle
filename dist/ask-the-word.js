/**
 * Ask the Word — Bible Q&A on bible-tool.html
 * Unified brain: ask-the-word-core.js (curated + full KJV offline).
 * Optional online assist via Supabase bible-qa when curated/local is thin.
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

    var CACHE_KEY = 'tdb-ask-the-word-cache-v2';
    var CACHE_TTL = 24 * 60 * 60 * 1000;

    function escapeHtml(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }

    function plainAnswerText(s) {
      if (typeof window.tdbCleanForPlainDisplay === 'function') {
        return window.tdbCleanForPlainDisplay(s);
      }
      if (typeof window.tdbStripAngleMarkupForPlainText === 'function') {
        return window.tdbStripAngleMarkupForPlainText(s);
      }
      var str = String(s || '').trim();
      if (!str) return '';
      return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
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

    function cacheKey(q) {
      return q.toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function verseCardHtml(ref, text) {
      var r = escapeHtml(String(ref || '').trim());
      var t = escapeHtml(String(text || '').trim());
      var refRaw = String(ref || '').trim();
      var textRaw = String(text || '').trim();
      var link = refRaw ? 'reader.html?ref=' + encodeURIComponent(refRaw) : '';
      return '<div class="qa-verse-card"' +
        (refRaw ? ' data-ref="' + r + '"' : '') +
        (textRaw ? ' data-verse-text="' + t + '"' : '') +
        '>' +
        '<span class="qa-verse-ref">' +
          (link ? '<a href="' + link + '" class="qa-verse-link">' + r + '</a>' : r) +
        '</span>' +
        (textRaw ? '<span class="qa-verse-text">\u201c' + t + '\u201d</span>' : '') +
        '</div>';
    }

    function nextStepsBlock(data) {
      if (window.TDBAskTheWord && typeof window.TDBAskTheWord.nextStepsHtml === 'function') {
        return window.TDBAskTheWord.nextStepsHtml(data.next_steps || [], escapeHtml);
      }
      return '';
    }

    function ensureNextStepsStyles() {
      if (document.getElementById('tdb-qa-next-steps-style')) return;
      var st = document.createElement('style');
      st.id = 'tdb-qa-next-steps-style';
      st.textContent =
        '.qa-next-steps{margin-top:1rem;padding-top:0.75rem;border-top:1px solid rgba(148,163,184,0.2);}' +
        '.qa-next-steps-label{font-size:0.85rem;opacity:0.85;margin:0 0 0.4rem;}' +
        '.qa-next-steps-row{display:flex;flex-wrap:wrap;gap:0.45rem;}' +
        '.qa-next-step{display:inline-block;padding:0.35rem 0.7rem;border-radius:999px;border:1px solid rgba(212,175,55,0.45);' +
        'color:inherit;text-decoration:none;font-size:0.88rem;background:rgba(212,175,55,0.08);}' +
        '.qa-next-step:hover,.qa-next-step:focus{background:rgba(212,175,55,0.18);outline:none;}' +
        '.qa-from-note{font-size:0.8rem;opacity:0.7;margin:0.5rem 0 0;}';
      document.head.appendChild(st);
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
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
        body: JSON.stringify({ query: q })
      }).then(function (r) {
        if (!r.ok) return Promise.reject(new Error('not ok ' + r.status));
        return r.json().catch(function () { return Promise.reject(new Error('bad json')); });
      });
    }

    function normalizeServerPayload(res) {
      if (!res || !res.answer) return null;
      var verses = [];
      if (Array.isArray(res.verses) && res.verses.length) {
        verses = res.verses.map(function (v) {
          return { ref: v.ref || v.reference || '', text: v.text || v.verse_text || '' };
        }).filter(function (v) { return v.ref; });
      } else if (Array.isArray(res.sources) && res.sources.length) {
        verses = res.sources.map(function (ref) {
          return { ref: String(ref || ''), text: '' };
        }).filter(function (v) { return v.ref; });
      }
      // Reject useless generic-only server payloads with wrong/empty verses
      var generic = /that is a real question, not small talk/i.test(res.answer || '');
      var hasText = verses.some(function (v) { return v.text && v.text.length > 5; });
      if (generic && !hasText) return null;
      return {
        answer: res.answer,
        verses: verses,
        sources: verses.map(function (v) { return v.ref; }),
        prayer_prompt: res.prayer_prompt || '',
        answer_mode: res.answer_mode,
        query_kind: res.query_kind,
        next_steps: res.next_steps || null,
        from: 'server'
      };
    }

    function qualityScore(data) {
      if (!data || !data.answer) return 0;
      var score = 10;
      if (data.curated_id || data.from === 'curated') score += 100;
      if (data.from === 'reference') score += 80;
      var verses = data.verses || [];
      score += Math.min(verses.length, 5) * 8;
      verses.forEach(function (v) {
        if (v.text && v.text.length > 10) score += 12;
      });
      if (/not small talk|fake certainty|soft-focus fluff/i.test(data.answer)) score -= 40;
      if (data.from === 'empty') score -= 20;
      return score;
    }

    function localAnswer(q) {
      if (window.TDBAskTheWord && typeof window.TDBAskTheWord.answer === 'function') {
        return window.TDBAskTheWord.answer(q);
      }
      return Promise.resolve({
        answer: 'Ask the Word core is still loading. Try again in a moment, or use verse lookup below.',
        verses: [],
        sources: [],
        prayer_prompt: 'Lord, meet me in Your Word. Amen.',
        next_steps: [{ kind: 'spine', label: 'Learn the Word path', href: '/learn-the-word.html' }],
        from: 'empty'
      });
    }

    function render(data) {
      ensureNextStepsStyles();
      var answerHtml = '<p class="qa-answer">' + escapeHtml(plainAnswerText(data.answer)) + '</p>';

      var versesHtml = '';
      if (Array.isArray(data.verses) && data.verses.length) {
        versesHtml = '<div class="qa-verse-list">' +
          data.verses
            .filter(function (v) { return v && (v.ref || v.text); })
            .map(function (v) { return verseCardHtml(v.ref, v.text); })
            .join('') +
          '</div>';
      } else if (Array.isArray(data.sources) && data.sources.length) {
        var srcLinks = data.sources.map(function (ref) {
          var r = String(ref || '').trim();
          if (!r) return '';
          return '<a href="reader.html?ref=' + encodeURIComponent(r) + '" class="qa-verse-link">' + escapeHtml(r) + '</a>';
        }).filter(Boolean).join(', ');
        if (srcLinks) versesHtml = '<p class="qa-sources">Sources: ' + srcLinks + '</p>';
      }

      var stepsHtml = nextStepsBlock(data);
      if (!data.next_steps || !data.next_steps.length) {
        // ensure teaching loop even on server payloads
        data.next_steps = [
          { kind: 'spine', label: 'Learn the Word path', href: '/learn-the-word.html' },
          { kind: 'plans', label: 'Battle Plans', href: '/plans.html' },
          { kind: 'lessons', label: 'Life Lessons', href: '/life-lessons.html' }
        ];
        stepsHtml = nextStepsBlock(data);
      }

      result.innerHTML = answerHtml + versesHtml + stepsHtml;
      result.classList.remove('hidden');
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (typeof window.TDBVerseBreakdown === 'object' &&
          typeof window.TDBVerseBreakdown.injectInlineBreakdown === 'function') {
        result.querySelectorAll('.qa-verse-card[data-ref]').forEach(function (card) {
          var ref = card.getAttribute('data-ref') || '';
          var text = card.getAttribute('data-verse-text') || '';
          if (ref) {
            try { window.TDBVerseBreakdown.injectInlineBreakdown(card, ref, text); } catch (e) {}
          }
        });
      }

      if (prayerEl) {
        prayerEl.classList.add('hidden');
        prayerEl.setAttribute('aria-hidden', 'true');
      }
      if (data.prayer_prompt) {
        var pt = String(data.prayer_prompt).trim();
        var promptTextEl = prayerEl && prayerEl.querySelector('.prompt-text');
        if (pt && prayerEl && promptTextEl) {
          promptTextEl.textContent = '\u201c' + pt + '\u201d';
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
      btn.innerHTML = on ? '<span class="qa-spinner" aria-hidden="true"></span> Asking\u2026' : 'Ask';
    }

    function runAsk() {
      var q = (input.value || '').trim();
      if (!q) return;
      var cached = getCached(q);
      if (cached) {
        render(cached);
        return;
      }
      setLoading(true);
      result.classList.remove('hidden');
      result.innerHTML = '<p class="empty">Seeking the Word\u2026</p>';

      // Offline-first: core always runs; server only upgrades if better
      localAnswer(q).then(function (local) {
        var cfg = window.TDB_CONFIG || {};
        var hasSupabase = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
        var localScore = qualityScore(local);
        // If curated or solid local hit, skip flaky server
        if (localScore >= 80 || local.from === 'curated' || local.from === 'reference') {
          setLoading(false);
          setCache(cacheKey(q), local);
          render(local);
          return null;
        }
        if (!hasSupabase) {
          setLoading(false);
          setCache(cacheKey(q), local);
          render(local);
          return null;
        }
        return invokeBibleQa(q).then(function (res) {
          setLoading(false);
          var remote = normalizeServerPayload(res);
          if (remote && qualityScore(remote) > localScore) {
            // Attach teaching loops if server omitted them
            if (!remote.next_steps || !remote.next_steps.length) {
              remote.next_steps = local.next_steps;
            }
            setCache(cacheKey(q), remote);
            render(remote);
          } else {
            setCache(cacheKey(q), local);
            render(local);
          }
        }).catch(function () {
          setLoading(false);
          setCache(cacheKey(q), local);
          render(local);
        });
      }).catch(function () {
        setLoading(false);
        result.innerHTML = '<p class="empty">We couldn\u2019t reach an answer just now\u2014that is all right. Check your connection, or use verse lookup below. <a href="/learn-the-word.html">Learn the Word</a> stays ready when you are.</p>';
        if (prayerEl) prayerEl.classList.add('hidden');
      });
    }

    btn.addEventListener('click', runAsk);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        runAsk();
      }
    });

    // Prefetch core data idle
    if (window.TDBAskTheWord && typeof window.TDBAskTheWord.prefetch === 'function') {
      var idle = window.requestIdleCallback || function (cb) { setTimeout(cb, 400); };
      idle(function () { window.TDBAskTheWord.prefetch(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
