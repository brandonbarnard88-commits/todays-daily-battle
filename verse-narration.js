/**
 * On-device verse / chapter narration — speechSynthesis queue, optional soft ambient bed,
 * phrase pauses, repeat, reader line highlight. Private; no network audio.
 * Exposes window.TDBVerseNarration. Companion to script.js stopTts / setTtsPlaying via events.
 *
 * Roadmap: optional bundled human narration (e.g. plan days, Möbius) may ship as static files
 * later—opt-in / local only—without changing the default “nothing uploaded for playback” story.
 */
(function (global) {
  'use strict';

  var LS_RATE = 'tdb_verse_narr_rate';
  var LS_PHRASE_PAUSE = 'tdb_verse_narr_phrase_pause';
  var LS_REPEAT = 'tdb_verse_narr_repeat';
  var LS_AMBIENT = 'tdb_verse_narr_ambient';
  var LS_VOICE_PREF = 'tdb_voice_pref';
  /** 1–10 UI level; maps to undertone gain when ambient is on */
  var LS_AMBIENT_LEVEL = 'tdb_verse_narr_ambient_level';
  var AMBIENT_GAIN_MIN = 0.018;
  var AMBIENT_GAIN_MAX = 0.078;

  var RATE_PRESETS = { very_slow: 0.68, slow: 0.78, normal: 0.88 };
  var PHRASE_PAUSE_MS = 480;
  var BETWEEN_VERSE_MS = 320;

  var ambientCtx = null;
  var ambientStopFn = null;
  var queueToken = 0;
  var runningToken = 0;

  function getStoredRatePreset() {
    try {
      var v = localStorage.getItem(LS_RATE);
      if (v && RATE_PRESETS[v] != null) return v;
    } catch (e) {}
    return 'slow';
  }

  function setStoredRatePreset(p) {
    try {
      if (p && RATE_PRESETS[p] != null) localStorage.setItem(LS_RATE, p);
    } catch (e) {}
  }

  function getPhrasePause() {
    try {
      return localStorage.getItem(LS_PHRASE_PAUSE) !== '0';
    } catch (e) {
      return true;
    }
  }

  function setPhrasePause(on) {
    try {
      localStorage.setItem(LS_PHRASE_PAUSE, on ? '1' : '0');
    } catch (e) {}
  }

  function getRepeat() {
    try {
      return localStorage.getItem(LS_REPEAT) === '1';
    } catch (e) {
      return false;
    }
  }

  function setRepeat(on) {
    try {
      localStorage.setItem(LS_REPEAT, on ? '1' : '0');
    } catch (e) {}
  }

  function getAmbient() {
    try {
      var v = localStorage.getItem(LS_AMBIENT);
      return v === 'soft' ? 'soft' : 'off';
    } catch (e) {
      return 'off';
    }
  }

  function setAmbient(mode) {
    try {
      localStorage.setItem(LS_AMBIENT, mode === 'soft' ? 'soft' : 'off');
    } catch (e) {}
  }

  function getVoicePref() {
    try {
      var pref = localStorage.getItem(LS_VOICE_PREF);
      return pref === 'calm_female' || pref === 'calm_male' ? pref : 'auto';
    } catch (e) {
      return 'auto';
    }
  }

  function clamp(n, lo, hi) {
    return Math.min(hi, Math.max(lo, n));
  }

  function levelToGain(level) {
    var lv = clamp(Number(level) || 5, 1, 10);
    return AMBIENT_GAIN_MIN + ((lv - 1) / 9) * (AMBIENT_GAIN_MAX - AMBIENT_GAIN_MIN);
  }

  function gainToLevel(gain) {
    var g = clamp(Number(gain) || levelToGain(5), AMBIENT_GAIN_MIN, AMBIENT_GAIN_MAX);
    var lv = 1 + Math.round(((g - AMBIENT_GAIN_MIN) / (AMBIENT_GAIN_MAX - AMBIENT_GAIN_MIN)) * 9);
    return clamp(lv, 1, 10);
  }

  function getAmbientLevel() {
    try {
      var raw = localStorage.getItem(LS_AMBIENT_LEVEL);
      var n = parseInt(raw, 10);
      if (!isNaN(n) && n >= 1 && n <= 10) return n;
    } catch (e) {}
    return 5;
  }

  function setAmbientLevel(level) {
    try {
      var lv = clamp(parseInt(level, 10) || 5, 1, 10);
      localStorage.setItem(LS_AMBIENT_LEVEL, String(lv));
    } catch (e) {}
  }

  function currentAmbientGain() {
    return levelToGain(getAmbientLevel());
  }

  function notifyPlaying(playing) {
    try {
      global.dispatchEvent(new CustomEvent('tdb-verse-tts-playing', { detail: { playing: !!playing } }));
    } catch (e) {}
  }

  function broadcastProgress(opts, detail) {
    try {
      global.dispatchEvent(new CustomEvent('tdb-verse-tts-progress', { detail: detail }));
    } catch (e) {}
    if (opts && typeof opts.onProgress === 'function') {
      try {
        opts.onProgress(detail);
      } catch (e2) {}
    }
  }

  function clearProgressBroadcast() {
    broadcastProgress(null, { active: false, index: 0, total: 0, source: '' });
  }

  function pickVoice(synth) {
    var voices = synth.getVoices() || [];
    if (!voices.length) return null;
    var pref = getVoicePref();
    var en = function (v) {
      return ((v && v.lang) || '').toLowerCase().indexOf('en') === 0;
    };
    function findByName(rx) {
      return voices.find(function (v) {
        return en(v) && rx.test((v.name || '').toLowerCase());
      });
    }
    if (pref === 'calm_female') {
      return (
        findByName(/(aria|jenny|sara|zira|samantha|victoria|ava|allison|karen|moira|susan|serena|salli|female|woman)/) ||
        voices.find(function (v) {
          return en(v) && v.localService;
        }) ||
        voices.find(en) ||
        voices[0]
      );
    }
    if (pref === 'calm_male') {
      return (
        findByName(/(guy|davis|daniel|alex|fred|male|man|matthew|christopher|ryan|aaron)/) ||
        voices.find(function (v) {
          return en(v) && v.localService;
        }) ||
        voices.find(en) ||
        voices[0]
      );
    }
    var natural = voices.filter(function (v) {
      return (
        en(v) &&
        /(natural|neural|premium|enhanced|siri|google us english|microsoft (aria|jenny|sara))/i.test(v.name || '')
      );
    });
    var warm = voices.filter(function (v) {
      return (
        en(v) &&
        /(female|woman|zira|samantha|victoria|ava|allison|karen|moira|susan|aria|serena|salli|jenny|daniel|alex)/i.test(
          v.name || ''
        )
      );
    });
    return (
      natural[0] ||
      warm[0] ||
      voices.find(function (v) {
        return en(v) && v.localService;
      }) ||
      voices.find(en) ||
      voices[0]
    );
  }

  function stopAmbient() {
    if (typeof ambientStopFn === 'function') {
      try {
        ambientStopFn();
      } catch (e) {}
    }
    ambientStopFn = null;
    if (ambientCtx) {
      try {
        ambientCtx.close();
      } catch (e2) {}
    }
    ambientCtx = null;
  }

  function startSoftAmbient() {
    stopAmbient();
    if (getAmbient() !== 'soft') return;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return;
    try {
      ambientCtx = new AC();
      var sampleRate = ambientCtx.sampleRate;
      var seconds = 2;
      var n = Math.floor(sampleRate * seconds);
      var buffer = ambientCtx.createBuffer(1, n, sampleRate);
      var data = buffer.getChannelData(0);
      var last = 0;
      for (var i = 0; i < n; i++) {
        var white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
      var src = ambientCtx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      var filter = ambientCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 380;
      var gain = ambientCtx.createGain();
      gain.gain.value = currentAmbientGain();
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ambientCtx.destination);
      src.start(0);
      ambientStopFn = function () {
        try {
          src.stop();
        } catch (s) {}
        try {
          src.disconnect();
        } catch (d) {}
        try {
          filter.disconnect();
        } catch (d2) {}
        try {
          gain.disconnect();
        } catch (d3) {}
      };
    } catch (err) {
      stopAmbient();
    }
  }

  function splitPhrases(text) {
    var t = String(text || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!t) return [];
    var chunks = t.split(/(?<=[;.:])\s+/);
    var out = [];
    chunks.forEach(function (c) {
      var x = c.trim();
      if (x) out.push(x);
    });
    return out.length ? out : [t];
  }

  function clearReaderHighlight() {
    document.querySelectorAll('.context-line.reader-verse-line--tts-active').forEach(function (el) {
      el.classList.remove('reader-verse-line--tts-active');
    });
  }

  function verseStudyHighlightEl() {
    return document.getElementById('vs-full-verse') || document.getElementById('tdb-vs-verse');
  }

  function clearVerseStudyHighlight() {
    var v = verseStudyHighlightEl();
    if (v) v.classList.remove('tdb-vs-verse--tts-speak');
  }

  function clearHeroHighlight(el) {
    if (el && el.classList) el.classList.remove('tdb-tts-highlight-active');
  }

  function stop() {
    queueToken++;
    runningToken = queueToken;
    try {
      if (global.speechSynthesis) global.speechSynthesis.cancel();
    } catch (e) {}
    stopAmbient();
    clearReaderHighlight();
    clearVerseStudyHighlight();
    var hv = document.getElementById('heroVerse');
    if (hv) clearHeroHighlight(hv);
    notifyPlaying(false);
    clearProgressBroadcast();
  }

  function isSpeaking() {
    try {
      return global.speechSynthesis && (global.speechSynthesis.speaking || global.speechSynthesis.pending);
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {Array<{text:string, el?: Element|null}>} segments
   * @param {object} opts
   */
  function speakSegments(segments, opts) {
    opts = opts || {};
    if (!global.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return false;
    var list = (segments || []).filter(function (s) {
      return s && String(s.text || '').trim();
    });
    if (!list.length) return false;

    stop();
    queueToken++;
    var myTok = queueToken;
    runningToken = myTok;

    var rateKey = opts.ratePreset || getStoredRatePreset();
    var rate = RATE_PRESETS[rateKey] != null ? RATE_PRESETS[rateKey] : RATE_PRESETS.slow;
    var phrasePause = opts.phrasePause !== undefined ? opts.phrasePause : getPhrasePause();
    var pauseMs = opts.pauseMs != null ? opts.pauseMs : PHRASE_PAUSE_MS;
    var repeat = opts.repeat !== undefined ? opts.repeat : getRepeat();
    var synth = global.speechSynthesis;
    var voice = pickVoice(synth);
    var heroEl = opts.highlightEl || null;
    var progressSrc = opts.progressSource || '';
    var totalPhrases = list.length;

    startSoftAmbient();
    notifyPlaying(true);

    var i = 0;

    function clearLineHL() {
      if (opts.highlightMode === 'reader') clearReaderHighlight();
      if (opts.highlightMode === 'verse-study') clearVerseStudyHighlight();
      if (heroEl) clearHeroHighlight(heroEl);
    }

    function applyHL(el) {
      clearLineHL();
      if (opts.highlightMode === 'reader' && el && el.classList) el.classList.add('reader-verse-line--tts-active');
      var vs = verseStudyHighlightEl();
      if (opts.highlightMode === 'verse-study' && vs) vs.classList.add('tdb-vs-verse--tts-speak');
      if (heroEl && heroEl.classList) heroEl.classList.add('tdb-tts-highlight-active');
    }

    function speakNext() {
      if (myTok !== queueToken) return;
      if (i >= list.length) {
        if (repeat) {
          i = 0;
          setTimeout(speakNext, phrasePause ? pauseMs : 0);
          return;
        }
        stopAmbient();
        clearLineHL();
        notifyPlaying(false);
        broadcastProgress(opts, { active: false, index: 0, total: 0, source: progressSrc });
        if (typeof opts.onComplete === 'function') opts.onComplete();
        return;
      }

      var seg = list[i];
      var ut = new SpeechSynthesisUtterance(String(seg.text));
      ut.rate = rate;
      ut.pitch = opts.calm ? 0.97 : 1;
      ut.lang = 'en-US';
      if (voice) ut.voice = voice;

      ut.onstart = function () {
        if (myTok !== queueToken) return;
        applyHL(seg.el || null);
        broadcastProgress(opts, {
          active: true,
          index: i + 1,
          total: totalPhrases,
          source: progressSrc
        });
      };
      ut.onend = function () {
        if (myTok !== queueToken) return;
        i++;
        var delay = 0;
        if (i < list.length) {
          if (phrasePause) delay = pauseMs;
          else if (typeof opts.betweenChunkMs === 'number') delay = opts.betweenChunkMs;
        }
        if (delay) setTimeout(speakNext, delay);
        else speakNext();
      };
      ut.onerror = function () {
        if (myTok !== queueToken) return;
        i++;
        speakNext();
      };

      try {
        synth.speak(ut);
      } catch (err) {
        i++;
        speakNext();
      }
    }

    speakNext();
    return true;
  }

  function speakPlainText(text, opts) {
    var t = String(text || '').trim();
    if (!t) return false;
    var phrasePause = opts && opts.phrasePause !== undefined ? opts.phrasePause : getPhrasePause();
    var parts = phrasePause ? splitPhrases(t) : [t];
    var segs = parts.map(function (p) {
      return { text: p, el: null };
    });
    return speakSegments(segs, opts || {});
  }

  function speakReaderLines(lineElements, opts) {
    opts = opts || {};
    var phrasePause = opts.phrasePause !== undefined ? opts.phrasePause : getPhrasePause();
    var segs = [];
    for (var j = 0; j < lineElements.length; j++) {
      var line = lineElements[j];
      var clone = line.cloneNode(true);
      var strong = clone.querySelector('strong');
      if (strong) strong.remove();
      var body = (clone.textContent || '').replace(/\s+/g, ' ').trim();
      if (!body) continue;
      if (phrasePause) {
        var phrases = splitPhrases(body);
        for (var p = 0; p < phrases.length; p++) {
          segs.push({ text: phrases[p], el: line });
        }
      } else {
        segs.push({ text: body, el: line });
      }
    }
    var o = Object.assign({}, opts, {
      highlightMode: 'reader',
      pauseMs: PHRASE_PAUSE_MS,
      betweenChunkMs: phrasePause ? undefined : BETWEEN_VERSE_MS
    });
    return speakSegments(segs, o);
  }

  global.TDBVerseNarration = {
    stop: stop,
    isSpeaking: isSpeaking,
    speakSegments: speakSegments,
    speakPlainText: speakPlainText,
    speakReaderLines: speakReaderLines,
    splitPhrases: splitPhrases,
    getRatePreset: getStoredRatePreset,
    setRatePreset: setStoredRatePreset,
    getPhrasePause: getPhrasePause,
    setPhrasePause: setPhrasePause,
    getRepeat: getRepeat,
    setRepeat: setRepeat,
    getAmbient: getAmbient,
    setAmbient: setAmbient,
    getAmbientLevel: getAmbientLevel,
    setAmbientLevel: setAmbientLevel,
    getVoicePref: getVoicePref,
    RATE_PRESETS: RATE_PRESETS
  };
})(typeof window !== 'undefined' ? window : this);
