(function () {
  'use strict';

  var TYPE_DICT = {
    adjective: {
      peaceful: true, anxious: true, afraid: true, hopeful: true, faithful: true, joyful: true,
      angry: true, grateful: true, patient: true, kind: true, pure: true, strong: true, weak: true,
      weary: true, broken: true, lonely: true, holy: true
    },
    verb: {
      pray: true, trust: true, forgive: true, obey: true, rest: true, wait: true, serve: true,
      love: true, endure: true, resist: true, seek: true, stand: true, believe: true, ask: true
    },
    noun: {
      peace: true, hope: true, fear: true, faith: true, strength: true, wisdom: true, courage: true,
      joy: true, grief: true, stress: true, purpose: true, identity: true, love: true, prayer: true,
      family: true, marriage: true, church: true, village: true
    }
  };

  var MULTI_TYPE = {
    hope: ['noun', 'verb'],
    love: ['noun', 'verb'],
    trust: ['noun', 'verb'],
    rest: ['noun', 'verb'],
    peace: ['noun', 'adjective']
  };

  function unique(arr) {
    var out = [];
    var seen = {};
    (arr || []).forEach(function (v) {
      if (!v || seen[v]) return;
      seen[v] = true;
      out.push(v);
    });
    return out;
  }

  function tokenize(input) {
    return String(input || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 10);
  }

  function detectBySuffix(word, hits) {
    if (!word) return;
    if (/(ful|ous|ive|able|al|less|ic|ary|ish|y)$/.test(word)) hits.push('adjective');
    if (/(ing|ed|ize|ise|fy)$/.test(word)) hits.push('verb');
    if (/(tion|ness|ment|ship|hood|ism)$/.test(word)) hits.push('noun');
  }

  function parseWordType(input) {
    var tokens = tokenize(input);
    var hits = [];
    var found = {};
    tokens.forEach(function (word) {
      if (TYPE_DICT.adjective[word]) hits.push('adjective');
      if (TYPE_DICT.verb[word]) hits.push('verb');
      if (TYPE_DICT.noun[word]) hits.push('noun');
      if (MULTI_TYPE[word]) hits = hits.concat(MULTI_TYPE[word]);
      detectBySuffix(word, hits);
      if (TYPE_DICT.adjective[word] || TYPE_DICT.verb[word] || TYPE_DICT.noun[word] || MULTI_TYPE[word]) {
        found[word] = true;
      }
    });
    hits = unique(hits);
    var primary = 'noun';
    if (hits.indexOf('adjective') !== -1) primary = 'adjective';
    else if (hits.indexOf('verb') !== -1) primary = 'verb';
    return {
      input: String(input || ''),
      tokens: tokens,
      hits: hits,
      primaryType: primary,
      matchedWords: Object.keys(found),
      actionLabel: primary === 'adjective' ? 'Feel it?' : (primary === 'verb' ? 'Pray now?' : 'Read full?')
    };
  }

  window.TDBWordParser = {
    parse: parseWordType
  };
})();
