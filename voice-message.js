/**
 * Voice input for Prayer Wall message — Web Speech API, CSP-safe (event listeners only).
 * Speak into mic → transcribes into #message-text. User clicks Post to submit.
 */
(function () {
  'use strict';

  function run() {
    var btn = document.getElementById('voice-message-btn');
    var input = document.getElementById('message-text');
    if (!btn || !input) return;

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      btn.addEventListener('click', function () {
        alert('Voice not supported—type instead.');
      });
      return;
    }

    var recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    var listening = false;

    function setListening(on) {
      listening = on;
      if (on) {
        btn.classList.add('voice-pray-listening');
        btn.textContent = 'Stop';
        btn.setAttribute('aria-label', 'Stop speaking');
      } else {
        btn.classList.remove('voice-pray-listening');
        btn.textContent = 'Speak';
        btn.setAttribute('aria-label', 'Speak your message');
      }
    }

    btn.addEventListener('click', function () {
      if (listening) {
        recognition.stop();
        return;
      }
      setListening(true);
      try {
        recognition.start();
      } catch (e) {
        setListening(false);
        alert('Voice not supported—type instead.');
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
    };

    recognition.onerror = function () {
      setListening(false);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
