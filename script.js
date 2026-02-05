async function loadBible() {
  try {
    const response = await fetch('kjv.json');
    console.log('Fetch status for kjv.json:', response.status);
    if (!response.ok) throw new Error('Fetch failed with status ' + response.status);
    bible = await response.json();
    console.log('Bible loaded successfully - number of verses:', Object.keys(bible).length);
  } catch (err) {
    console.error('Error loading kjv.json:', err.message);
  }
}
let bible = {}; // Loaded KJV
document.getElementById('search-btn').addEventListener('click', () => {
  document.getElementById('loading').style.display = 'block';
  setTimeout(() => {
    const input = document.getElementById('query').value;
    const tier = document.getElementById('tier').value;
    const parsed = parseQuery(input);
    const results = executeQuery(parsed, tier);
    renderResults(results);
    document.getElementById('loading').style.display = 'none';
  }, 0); // Async sim for loading
});
const topics = {
  anger: {
    synonyms: ['angry', 'wrath', 'mad', 'furious', 'rage'],
    verses: ['Psalms 37:8', 'Proverbs 14:29', 'James 1:20', 'Ephesians 4:26', 'Proverbs 15:1'],
    guidance: {
      kid: "When you feel mad, take a deep breath and ask God to help you calm down.",
      teen: "Anger is normal, but don't let it make you sin. Talk it out with a friend or pray.",
      adult: "Control your wrath, as it doesn't lead to righteousness. Seek peace quickly.",
      pastor: "Use these verses to teach on managing anger in sermons; emphasize forgiveness and self-control."
    }
  },
  fear: {
    synonyms: ['afraid', 'anxious', 'worried', 'scared', 'panic'],
    verses: ['Isaiah 41:10', '2 Timothy 1:7', '1 John 4:18', 'Psalms 34:4', 'Proverbs 29:25'],
    guidance: {
      kid: "God is with you, so don't be scared. He's like a big hug!",
      teen: "Fear can feel big, but God gives power and love. Trust Him.",
      adult: "Cast out fear with perfect love; God hasn't given a spirit of fear.",
      pastor: "Preach on fear as a snare; use these for counseling anxious congregants."
    }
  },
  grief: {
    synonyms: ['sorrow', 'mourning', 'loss', 'sadness', 'heartbroken'],
    verses: ['Psalms 34:18', 'Revelation 21:4', 'Matthew 5:4', 'Psalms 147:3', '2 Corinthians 1:3'],
    guidance: {
      kid: "When you're sad, God is close and will make you feel better.",
      teen: "It's okay to grieve; God comforts those who are hurting.",
      adult: "The Lord binds up wounds and is near the brokenhearted.",
      pastor: "Incorporate into grief ministry; highlight eternal hope without sorrow."
    }
  },
  lust: {
    synonyms: ['desire', 'temptation', 'craving', 'impure'],
    verses: ['Matthew 5:28', '1 John 2:16', 'Galatians 5:16', '2 Timothy 2:22', '1 Corinthians 6:18'],
    guidance: {
      kid: "Think good thoughts and run from bad ones.",
      teen: "Flee from wrong desires; walk in the Spirit instead.",
      adult: "Guard your heart against lust of the flesh; it's not from God.",
      pastor: "Address in purity teachings; stress fleeing and pursuing righteousness."
    }
  },
  discipline: {
    synonyms: ['self-control', 'correction', 'training', 'reproof'],
    verses: ['Proverbs 12:1', 'Hebrews 12:11', '2 Timothy 1:7', 'Proverbs 25:28', 'Proverbs 13:24'],
    guidance: {
      kid: "Learning rules helps you grow strong, like practicing sports.",
      teen: "Discipline might hurt now, but it leads to good things later.",
      adult: "Embrace correction; it yields peaceful fruit of righteousness.",
      pastor: "Use for parenting classes; model godly discipline in leadership."
    }
  },
  leadership: {
    synonyms: ['leader', 'authority', 'guide', 'shepherd'],
    verses: ['1 Timothy 4:12', 'Proverbs 11:14', 'Matthew 20:26', 'Acts 20:28', 'Romans 12:8'],
    guidance: {
      kid: "Be a good example, even if you're young.",
      teen: "Lead by serving others, like Jesus did.",
      adult: "True leadership is servant-hearted, not lording over others.",
      pastor: "Oversee the flock diligently; seek counsel for wise guidance."
    }
  }
};

async function loadBible() {
  try {
    const response = await fetch('kjv.json');
    console.log('Fetch status for kjv.json:', response.status);
    if (!response.ok) throw new Error('Fetch failed with status ' + response.status);
    bible = await response.json();
    console.log('Bible loaded successfully - number of verses:', Object.keys(bible).length);
  } catch (err) {
    console.error('Error loading kjv.json:', err.message);
  }
}

function normalizeInput(input) {
  return input.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '');
}

function parseQuery(input) {
  const normalized = normalizeInput(input);
  const tokens = normalized.split(' ');

  // Detect reference e.g. "john 3:16"
  const refRegex = /^(\w+)\s*\d+:\d+$/;
  const match = normalized.match(refRegex);
  if (match) {
    return { intent: 'reference', payload: normalized };
  }

  // Topic scoring
  const topicScores = {};
  Object.keys(topics).forEach(topic => {
    let score = 0;
    tokens.forEach(token => {
      if (topic.includes(token) || topics[topic].synonyms.some(syn => syn.includes(token))) score++;
    });
    if (score > 0) topicScores[topic] = score;
  });
  const topTopic = Object.keys(topicScores).sort((a,b) => topicScores[b] - topicScores[a])[0];
  if (topTopic) {
    return { intent: 'topic', payload: { topic: topTopic } };
  }

  // Default keyword
  return { intent: 'keyword', payload: { keywords: tokens } };
}

function executeQuery(parsed, tier) {
  const results = { intent: parsed.intent, tier, verses: [], guidance: null, trace: [] };

  if (parsed.intent === 'reference') {
    const key = parsed.payload;
    if (bible[key]) {
      results.verses.push({ ref: key, text: bible[key] });
      results.trace.push(`Matched reference: ${key}`);
    }
  } else if (parsed.intent === 'topic') {
    const topic = topics[parsed.payload.topic];
    topic.verses.forEach(ref => {
      if (bible[ref]) results.verses.push({ ref, text: bible[ref] });
    });
    results.guidance = topic.guidance[tier] || topic.guidance.adult;
    results.trace.push(`Detected topic: ${parsed.payload.topic}`);
  } else { // keyword
    const keywords = parsed.payload.keywords;
    const matches = Object.entries(bible)
      .map(([ref, text]) => {
        const normText = normalizeInput(text);
        const score = keywords.reduce((acc, kw) => acc + (normText.includes(kw) ? 1 : 0), 0);
        if (score > 0) {
          const snippet = text.replace(new RegExp(keywords.join('|'), 'gi'), '<span class="highlight">$&</span>');
          return { ref, text: snippet, score };
        }
      })
      .filter(Boolean)
      .sort((a,b) => b.score - a.score)
      .slice(0, 10);
    results.verses = matches.map(m => ({ ref: m.ref, text: m.text }));
    results.trace.push(`Keyword matches: ${matches.length} found`);
  }

  return results;
}

function renderResults(results) {
  const output = document.getElementById('output');
  output.innerHTML = '';
const shareBtn = document.createElement('button');
shareBtn.className = 'share-btn';
shareBtn.textContent = 'Share';
shareBtn.onclick = () => {
  navigator.clipboard.writeText(`${v.ref}: ${v.text.replace(/<[^>]+>/g, '')}`);
  alert('Verse copied to clipboard!');
};
card.appendChild(shareBtn);
  if (results.verses.length === 0) {
    output.innerHTML = '<p>No results found. Try another query!</p>';
    return;
  }
  results.verses.forEach(v => {
    const card = document.createElement('div');
    card.className = 'verse-card';
    card.innerHTML = `<strong>${v.ref}</strong>: ${v.text}`;
    output.appendChild(card);
  });
  if (results.guidance) {
    const guide = document.createElement('div');
    guide.className = 'guidance';
    guide.textContent = results.guidance;
    output.appendChild(guide);
  }
}

document.getElementById('daily-btn').addEventListener('click', () => {
  const today = new Date().toDateString();
  const topicKeys = Object.keys(topics);
  const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const index = seed % topicKeys.length;
  const dailyTopic = topicKeys[index];
  document.getElementById('query').value = dailyTopic;
  const tier = document.getElementById('tier').value;
  const parsed = parseQuery(dailyTopic);
  const results = executeQuery(parsed, tier);
  renderResults(results);
  const message = document.createElement('div');
  message.style.fontWeight = 'bold';
  message.style.marginBottom = '10px';
  message.textContent = `Today's battle is against ${dailyTopic.toUpperCase()}! Conquer it with God's Word.`;
document.getElementById('dark-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
  document.getElementById('output').prepend(message);
});
  });
});