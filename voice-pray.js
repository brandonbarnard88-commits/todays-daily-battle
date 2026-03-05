/**
 * Voice input for Quick Pray — Web Speech API, CSP-safe (event listeners only).
 * Speak into mic → transcribes into #quick-pray → auto-submit on stop/silence.
 */
(function () {
  'use strict';

  function run() {
    var btn = document.getElementById('voice-pray-btn');
    var input = document.getElementById('quick-pray');
    if (!btn || !input) return;

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      btn.addEventListener('click', function () {
        alert('Voice input is not supported in this browser. Please type your prayer instead.');
      });
      return;
    }

    var recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    var listening = false;
    var defaultPlaceholder = input.placeholder || 'Add a name or intention…';

    function setListening(on) {
      listening = on;
      if (typeof window.__voicePrayListening !== 'undefined') window.__voicePrayListening = on;
      var floating = document.getElementById('floating-voice-pray');
      if (floating) floating.classList.toggle('floating-voice-pray-listening', on);
      if (on) {
        btn.classList.add('voice-pray-listening');
        btn.textContent = 'Stop';
        btn.setAttribute('aria-label', 'Stop speaking');
      } else {
        btn.classList.remove('voice-pray-listening');
        btn.innerHTML = '<span class="voice-pray-icon" aria-hidden="true">✝</span> Speak';
        btn.setAttribute('aria-label', 'Speak your prayer');
      }
    }

    btn.addEventListener('click', function () {
      if (listening) {
        recognition.stop();
        return;
      }
      setListening(true);
      input.placeholder = defaultPlaceholder;
      try {
        recognition.start();
      } catch (e) {
        setListening(false);
        alert('Voice input could not start. Please type your prayer instead.');
      }
    });

    recognition.onresult = function (e) {
      var last = e.results[e.results.length - 1];
      if (last && last[0]) {
        input.value = last[0].transcript;
      }
    };

    recognition.onend = function () {
      setListening(false);
      if (input.value.trim()) {
        var prayBtn = document.getElementById('quick-pray-btn');
        if (prayBtn) prayBtn.click();
        if (typeof window.showEliteToast === 'function') window.showEliteToast('Prayer heard—saved!');
      }
    };

    recognition.onerror = function (e) {
      setListening(false);
      input.placeholder = 'Voice failed—type instead.';
      if (typeof window.showEliteToast === 'function') window.showEliteToast('Voice failed—type instead.');
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
