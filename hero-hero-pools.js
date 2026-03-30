/**
 * Homepage hero fallback pools (OFFLINE_PACK + mood VERSES) for normalizeVerse + legacy rotation.
 * Loaded sync on the homepage (before inline hero logic) so window.__TDB_HERO_* exists; keep hero-daily-first-paint.js smaller/defer-friendly.
 */
(function (global) {
  'use strict';

  global.__TDB_HERO_OFFLINE_PACK = [
    {
      ref: 'Philippians 4:6-7',
      text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
      lines: ['Prayer + supplication + thanksgiving—not silent panic.', 'Peace stands guard over heart and mind.', 'Write it, pray it, thank three.'],
      app: "Write down the one thing you're most worried about. Pray the verse over it. Thank God for 3 things (big or small).",
      speaker: 'Paul, writing from prison to the church at Philippi.',
      plain: 'Stop letting worry control every detail. Pray it all out + thank God anyway. Peace then stands guard over your heart and mind.',
      today: 'Your thoughts are racing ahead to disasters. This verse interrupts the loop — hand it over, give thanks, receive supernatural peace.',
      action: "Write down the one thing you're most worried about. Pray the verse over it. Thank God for 3 things (big or small)."
    },
    {
      ref: 'Matthew 11:28',
      text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
      lines: ['Jesus welcomes the worn-out.', 'Rest starts with surrender.', 'No performance required to come.'],
      app: "Breathe and pray: 'Jesus, I come as I am. Give me rest today.'",
      speaker: 'Jesus speaking to the exhausted crowds — and directly to you',
      plain: "Jesus is not calling the put-together. He's calling the tired. The overloaded. The ones running on empty.",
      today: "You don't have to fix yourself before you come to Him. You come broken, and He handles the rest.",
      action: "Say it plain: 'Jesus, I'm tired. I come.' That's the whole prayer."
    },
    {
      ref: 'Isaiah 41:10',
      text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
      lines: ['Fear loosens when God is near.', 'You are upheld, not abandoned.', 'His righteousness holds you steady.'],
      app: "Say, 'God is with me,' three times before your next hard task.",
      speaker: 'God directly to Israel in a terrifying season — and to you in yours',
      plain: "God says 'I will' five times in this verse. He's not maybe-ing you. He is with you, He's your God, He will strengthen, He will help, He will hold you up.",
      today: "That situation where you feel alone and unsteady? This is God's answer to it.",
      action: "Say out loud: 'Fear not — He is with me.' Say it until you mean it."
    },
    {
      ref: 'Psalm 23:1',
      text: 'The LORD is my shepherd; I shall not want.',
      lines: ['He provides before you feel the lack.', 'Wanting less is finding more of Him.', 'A shepherd leads—not drives.'],
      app: "Name one thing you're trusting Him to provide today.",
      speaker: 'David — a real shepherd — writing about being one himself',
      plain: "A shepherd doesn't ask the sheep to figure it out. He leads, feeds, protects. David knew this from experience and turned it into a confession of trust.",
      today: "You don't have to scramble. You don't have to hustle God. He's already ahead of your need.",
      action: "Say: 'You are my shepherd. I trust You with what I don't have yet.'"
    },
    {
      ref: 'Proverbs 3:5-6',
      text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
      lines: ['Full trust means releasing the outcome.', 'Your understanding has a ceiling—His doesn\'t.', 'Acknowledge Him first; direction follows.'],
      app: "Before one decision today, say: 'I trust You with this.'",
      speaker: 'Solomon — the wisest man alive — admitting wisdom isn\'t enough on its own',
      plain: "Even the smartest guy in the room says: don't trust your own read on things. Trust God with your whole heart and let Him steer.",
      today: 'That decision you keep overthinking? Stop leaning on your own analysis. Hand it to Him.',
      action: "Before you decide anything big today, say: 'I acknowledge You first. Direct me.'"
    },
    {
      ref: 'Romans 8:28',
      text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
      lines: ['All things—not just the easy ones.', "Good is God's definition, not yours.", 'The called already have the promise.'],
      app: "Bring one hard thing to God and say: 'I believe You can turn this.'",
      speaker: 'Paul — who had been beaten, jailed, and shipwrecked — saying this anyway',
      plain: "He doesn't say some things or good things. All things. Including the things that look like total disasters right now.",
      today: "That thing you can't see any good in? God's 'all things' includes it. He's not finished with it yet.",
      action: "Say: 'I don't see it yet, but I believe You're working it for good.'"
    },
    {
      ref: 'Psalm 46:1',
      text: 'God is our refuge and strength, a very present help in trouble.',
      lines: ['He is present—not distant—in trouble.', 'Refuge means you can actually run to Him.', 'Strength comes from the same place as safety.'],
      app: "When pressure rises today, say: 'You are my refuge right now.'",
      speaker: 'The sons of Korah writing after surviving a national crisis',
      plain: "Not a distant, theoretical God — a very present one. Right here. Right now. When things are falling apart, He's not watching from a distance.",
      today: "In the middle of whatever is hitting you today, He is already there.",
      action: "Run to Him like a shelter. Say: 'You are my refuge. I'm coming to You right now.'"
    },
    {
      ref: 'John 3:16',
      text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      lines: ['Love this big required the costliest gift.', 'Whosoever means no one is excluded.', 'Belief is the door—He already opened it.'],
      app: "Receive this love as if you're hearing it for the first time today.",
      speaker: 'Jesus speaking to Nicodemus at night — and to you reading this right now',
      plain: "God loved the world so much He gave what cost Him the most. Not rules. Not religion. His Son. And the only requirement is to believe.",
      today: "You don't earn this. You don't deserve it more on good days. It's a gift — take it.",
      action: "Receive it like it's personal: 'God loved me. He gave for me. I believe.'"
    },
    {
      ref: 'Matthew 5:4',
      text: 'Blessed are they that mourn: for they shall be comforted.',
      lines: ['Mourning is named, not shamed.', 'Comfort is promised—personally.', 'Jesus blesses the honest ache.'],
      app: 'Name one loss to God. Ask Him for the comfort He promised.',
      speaker: 'Jesus—to everyone who grieves openly and quietly',
      plain: "He doesn't rush past sorrow. Blessing and mourning belong in the same sentence because He is coming with comfort.",
      today: "Whatever you're carrying alone today—He spoke this beatitude for people exactly in your shoes.",
      action: 'Say one true sentence of grief in prayer. Wait. Let Him answer gentle.'
    },
    {
      ref: '2 Timothy 1:7',
      text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
      lines: ['Fear is not from God—power is.', 'Love and a sound mind come as a set.', "You already have what fear says you lack."],
      app: "Replace one fearful thought today with: 'God gave me power for this.'",
      speaker: 'Paul to Timothy — a young, anxious leader who needed to hear this',
      plain: "Fear is not your inheritance from God. Power is. Love is. A clear, steady mind is. When fear shows up, it's not coming from Him.",
      today: 'That anxiety spiraling in you right now? Not from God. Challenge it with what He actually gave you.',
      action: "Every time fear rises today, say: 'That's not from God. He gave me power, love, and a sound mind.'"
    }
  ];

  global.__TDB_HERO_VERSES = [
    {
      mood: 'anxious',
      ref: 'Philippians 4:6-7',
      text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
      lines: ['Prayer + supplication + thanksgiving—not silent panic.', 'Peace stands guard over heart and mind.', 'Write it, pray it, thank three.'],
      app: "Write down the one thing you're most worried about. Pray the verse over it. Thank God for 3 things (big or small)."
    },
    {
      mood: 'tired',
      ref: 'Matthew 11:28',
      text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
      lines: ['Jesus welcomes the worn-out.', 'Rest starts with surrender.', 'No performance required to come.'],
      app: "Breathe and pray: 'Jesus, I come as I am. Give me rest today.'"
    },
    {
      mood: 'afraid',
      ref: 'Isaiah 41:10',
      text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
      lines: ['Fear loosens when God is near.', 'You are upheld, not alone.', 'His righteousness holds you steady.'],
      app: "Say, 'God is with me,' three times before your next hard task."
    },
    {
      mood: 'grateful',
      ref: 'Psalm 118:24',
      text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.',
      lines: ['Today is God-given.', 'Joy grows through gratitude.', 'Gladness is a choice made in truth.'],
      app: 'Write one thanks to God and carry it all day.'
    },
    {
      mood: 'angry',
      ref: 'Ephesians 4:26',
      text: 'Be ye angry, and sin not: let not the sun go down upon your wrath:',
      lines: ['Scripture names anger honestly.', 'Sin is not in the feeling but the response.', 'Resolve before the day closes.'],
      app: 'Pray first, then send one peaceful message.'
    },
    {
      mood: 'hopeful',
      ref: 'Romans 15:13',
      text: 'Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.',
      lines: ['Hope is Spirit-powered.', 'Joy and peace grow in believing.', 'Abundance here means overflow—not just enough.'],
      app: 'Name one stuck place and ask God for fresh hope there.'
    },
    {
      mood: 'sad',
      ref: 'Matthew 5:4',
      text: 'Blessed are they that mourn: for they shall be comforted.',
      lines: ['Mourning is named, not shamed.', 'Comfort is promised—personally.', 'Jesus blesses the honest ache.'],
      app: 'Name one loss to God. Ask Him for the comfort He promised.'
    },
    {
      mood: 'lonely',
      ref: 'Isaiah 41:10',
      text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
      lines: ["God doesn't drift when people do.", 'His presence is not dependent on circumstances.', 'He holds you when no one else is there.'],
      app: "Sit quietly and say: 'You are with me.' Let that land."
    }
  ];
})(typeof window !== 'undefined' ? window : this);
