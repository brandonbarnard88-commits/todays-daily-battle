let bible = {};

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
  },
  anxiety: { 
    synonyms: ['worry', 'stress', 'nervous', 'uneasy'],
    verses: ['Philippians 4:6', 'Matthew 6:34', '1 Peter 5:7', 'Psalms 55:22', 'John 14:27'],
    guidance: {
      kid: "Give your worries to God, He cares for you.",
      teen: "Pray when anxious, and God's peace will guard your heart.",
      adult: "Do not be anxious; cast your cares on Him.",
      pastor: "Teach believers to replace anxiety with prayer and thanksgiving."
    }
  },
  faith: { 
    synonyms: ['belief', 'trust', 'confidence', 'assurance'],
    verses: ['Hebrews 11:1', 'Matthew 17:20', 'Romans 10:17', 'Ephesians 2:8', '2 Corinthians 5:7'],
    guidance: {
      kid: "Faith is believing God even when you can't see it.",
      teen: "Grow your faith by hearing God's Word.",
      adult: "Walk by faith, not by sight.",
      pastor: "Encourage faith as the victory that overcomes the world."
    }
  },
  forgiveness: { 
    synonyms: ['forgive', 'pardon', 'mercy', 'absolve'],
    verses: ['Ephesians 4:32', 'Matthew 6:14', 'Colossians 3:13', 'Luke 6:37', 'Acts 13:38'],
    guidance: {
      kid: "Forgive others just like God forgives you.",
      teen: "Let go of grudges; forgiveness sets you free.",
      adult: "Forgive as the Lord forgave you.",
      pastor: "Preach forgiveness as essential for spiritual health."
    }
  },
  strength: { 
    synonyms: ['power', 'might', 'fortitude', 'resilience'],
    verses: ['Philippians 4:13', 'Isaiah 40:31', 'Ephesians 6:10', 'Psalms 28:7', '2 Timothy 4:17'],
    guidance: {
      kid: "God gives you strength when you're weak.",
      teen: "Wait on the Lord to renew your strength.",
      adult: "Be strong in the Lord and in His mighty power.",
      pastor: "Teach reliance on God's strength, not our own."
    }
  },
  love: { 
    synonyms: ['affection', 'charity', 'compassion', 'kindness'],
    verses: ['1 Corinthians 13:4', 'John 3:16', 'Romans 5:8', '1 John 4:8', 'Ephesians 5:2'],
    guidance: {
      kid: "God loves you so much!",
      teen: "Love is patient and kind; show it to others.",
      adult: "Walk in love, as Christ loved us.",
      pastor: "Emphasize God's love as the foundation of faith."
    }
  }
  // Add even more topics as needed
};

const supabaseUrl = 'https://your-supabase-url.supabase.co'; // REPLACE WITH YOUR SUPABASE URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // REPLACE WITH YOUR SUPABASE ANON KEY
const supabase = Supabase.createClient(supabaseUrl, supabaseKey);

async function loadBible() {
  try {
    const response = await fetch('kjv.json');
    console.log('Fetch status for kjv.json:', response.status);
    if (!response.ok) throw new Error('Fetch failed with status ' + response.status);
    bible = await response.json();
    console.log('Bible loaded successfully - number of verses:', Object.keys(bible).length);
  } catch (err) {
    console.error('Error loading kjv.json:', err.message);
    alert('Failed to load Bible data. Please refresh.');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadBible();

  const loading = document.getElementById('loading');
  const output = document.getElementById('output');

  document.getElementById('search-btn').addEventListener('click', () => {
    loading.style.display = 'block';
    output.classList.remove('fade-in');
    setTimeout(() => {
      const input = document.getElementById('query').value;
      const tier = document.getElementById('tier').value;
      const parsed = parseQuery(input);
      const results = executeQuery(parsed, tier);
      renderResults(results);
      loading.style.display = 'none';
      output.classList.add('fade-in');
    }, 500); // Animation delay
  });

  document.getElementById('daily-btn').addEventListener('click', () => {
    loading.style.display = 'block';
    output.classList.remove('fade-in');
    setTimeout(() => {
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
      message.className = 'daily-message';
      message.textContent = `Today's battle: ${dailyTopic.toUpperCase()}! Conquer with God's Word.`;
      output.prepend(message);
      loading.style.display = 'none';
      output.classList.add('fade-in');
    }, 500);
  });

  document.getElementById('dark-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  // Supabase Auth
  document.getElementById('signup-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tier = document.getElementById('tier').value;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { tier } }
    });
    alert(error ? error.message : 'Signed up! Check email for confirmation.');
  });

  document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      const userTier = data.user.user_metadata.tier || 'adult';
      document.getElementById('tier').value = userTier;
      alert('Logged in!');
      document.getElementById('logout-btn').style.display = 'inline-block';
    }
  });

  document.getElementById('logout-btn').addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    alert(error ? error.message : 'Logged out!');
    document.getElementById('logout-btn').style.display = 'none';
  });
});