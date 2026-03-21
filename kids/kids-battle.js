/**
 * Kids Battle — standalone logic for kids/index.html
 * Verse, prayer, streak, badges, doodle. Uses localStorage. Offline-capable.
 * KJV verses = public domain. No third-party content.
 */
(function () {
  'use strict';

  // Shared with Kids Coloring (coloring.html) — hub for all kid stuff; one streak across both
  const KIDS_STREAK_KEY = 'kidsStreak';
  const KIDS_DOODLE_KEY = 'kidsDoodle';
  const KIDS_VERSE_INDEX_KEY = 'kidsVerseIndex';
  const KIDS_FAMILY_CODE_KEY = 'familyCode';
  const KIDS_LIBRARY_VIEWED_KEY = 'kidsLibraryViewedStories';
  const KID_NAME_KEY = 'kidName';
  const KID_REFLECTION_KEY = 'kidReflection';
  const KID_QUIZ_DONE_KEY = 'kidQuizDone';
  const KID_MEMORY_DONE_KEY = 'kidMemoryDone';

  const KID_QUIZ_QUESTIONS = {
    '1 samuel 17': [
      { question: 'Who did David fight?', options: ['Goliath', 'A lion', 'A bear', 'King Saul'], correct: 0 },
      { question: 'Who helped David win?', options: ['His brothers', 'God', 'King Saul', 'The army'], correct: 1 },
      { question: 'What did David use?', options: ['A sword', 'A sling and stones', 'A spear', 'His fists'], correct: 1 }
    ],
    'psalm 23': [
      { question: 'Who wrote Psalm 23?', options: ['Moses', 'David', 'Jesus', 'Paul'], correct: 1 },
      { question: 'What does "The Lord is my shepherd" mean?', options: ['God is a farmer', 'God takes care of me', 'God has sheep', 'God is far away'], correct: 1 },
      { question: 'David was a ___ before he was king.', options: ['Soldier', 'Shepherd', 'Fisherman', 'Builder'], correct: 1 }
    ],
    'daniel 6': [
      { question: 'Where did Daniel get thrown?', options: ['A river', 'A fire', 'A lions\' den', 'A prison'], correct: 2 },
      { question: 'Who shut the lions\' mouths?', options: ['Daniel', 'The king', 'God\'s angel', 'A guard'], correct: 2 },
      { question: 'Why was Daniel in trouble?', options: ['He stole', 'He prayed to God', 'He lied', 'He ran away'], correct: 1 }
    ],
    'jonah 1': [
      { question: 'What swallowed Jonah?', options: ['A whale', 'A great fish', 'A shark', 'A dolphin'], correct: 1 },
      { question: 'Why did Jonah run?', options: ['He was scared', 'He didn\'t want to obey God', 'He was lost', 'He was playing'], correct: 1 },
      { question: 'Who sent the fish?', options: ['The sailors', 'Jonah', 'God', 'The king'], correct: 2 }
    ],
    'joshua 1': [
      { question: 'Who became leader after Moses?', options: ['Aaron', 'Joshua', 'Caleb', 'David'], correct: 1 },
      { question: 'What did God tell Joshua?', options: ['Be afraid', 'Be strong and courageous', 'Stay home', 'Run away'], correct: 1 },
      { question: 'Who was with Joshua?', options: ['Nobody', 'God', 'Only his family', 'The enemy'], correct: 1 }
    ],
    'matthew 19': [
      { question: 'Who said "Let the children come to me"?', options: ['Moses', 'David', 'Jesus', 'Paul'], correct: 2 },
      { question: 'Jesus loves ___!', options: ['Only adults', 'Kids', 'Nobody', 'Just some people'], correct: 1 },
      { question: 'What did Jesus\' friends try to do?', options: ['Send kids away', 'Bring more kids', 'Play with kids', 'Teach kids'], correct: 0 }
    ],
    'philippians 4': [
      { question: 'Who wrote "I can do all things through Christ"?', options: ['Jesus', 'David', 'Paul', 'Moses'], correct: 2 },
      { question: 'What gives us strength?', options: ['Food', 'Sleep', 'Christ', 'Toys'], correct: 2 },
      { question: 'Paul was a ___ who loved Jesus.', options: ['King', 'Shepherd', 'Missionary', 'Farmer'], correct: 2 }
    ],
    'john 3': [
      { question: 'Who does God love?', options: ['Only some people', 'The whole world', 'Nobody', 'Just kids'], correct: 1 },
      { question: 'What did God give because He loves us?', options: ['Toys', 'His only Son', 'Money', 'A book'], correct: 1 },
      { question: 'What happens when we believe in Jesus?', options: ['Nothing', 'We live forever with God', 'We get rich', 'We get tired'], correct: 1 }
    ],
    'ephesians 6': [
      { question: 'Where does our strength come from?', options: ['Ourselves', 'The Lord', 'Friends', 'Food'], correct: 1 },
      { question: 'What should we put on?', options: ['A costume', 'God\'s armor', 'A hat', 'Shoes'], correct: 1 },
      { question: 'God\'s armor includes ___.', options: ['A sword', 'Truth and faith', 'A shield only', 'Nothing'], correct: 1 }
    ],
    'isaiah 41': [
      { question: 'What does God say when we\'re afraid?', options: ['Run!', 'I am with thee', 'Hide!', 'Cry!'], correct: 1 },
      { question: 'Who is with us?', options: ['Nobody', 'God', 'Only our family', 'The teacher'], correct: 1 },
      { question: 'God says "Fear thou ___"', options: ['A lot', 'Not', 'Sometimes', 'Always'], correct: 1 }
    ],
    'default': [
      { question: 'Who helps us be brave?', options: ['Nobody', 'God', 'Only our parents', 'Toys'], correct: 1 },
      { question: 'What does God\'s word do?', options: ['Nothing', 'Lights our path', 'Makes us sleepy', 'Runs away'], correct: 1 },
      { question: 'Who loves us most?', options: ['Our friends', 'God', 'Pets', 'Video games'], correct: 1 }
    ]
  };

  const KIDS_TOPICS = [
    { topic: 'brave', label: 'Brave ⚔️' },
    { topic: 'friends', label: 'Friends 👫' },
    { topic: 'love', label: 'God Loves Me ❤️' },
    { topic: 'animals', label: 'Animals 🦁' },
    { topic: 'strength', label: 'Be Strong 💪' },
    { topic: 'peace', label: 'Peace 😌' }
  ];

  const KID_FRIENDLY_TRANSLATIONS = {
    'philippians 4:13': 'God makes me strong for anything!',
    'joshua 1:9': "Be brave! God is with you—don't be afraid!",
    'psalm 23:1': "God is my helper—I have everything I need!",
    'matthew 19:14': "Jesus says: Let the kids come to Me!",
    'ephesians 6:10': "God makes you strong—trust His power!",
    'isaiah 41:10': "Don't be scared—God is right here with you!",
    'john 3:16': "God loves you so much He sent Jesus. Believe in Him!",
    'john 14:27': "Jesus gives you peace—don't worry!",
    'matthew 6:26': "God feeds the birds—He'll take care of you too!",
    '1 samuel 17:47': "The battle is God's—He fights for you!",
    'proverbs 3:5': "Trust God with your whole heart!",
    'psalm 46:10': "Be still and know God is with you!",
    'psalm 119:105': "God's word lights up your path!",
    'romans 8:28': "God makes everything work for good when you love Him!",
    'jeremiah 29:11': "God has great plans for you!",
    'jonah 1:17': "God sent a big fish to stop Jonah from running!",
    'daniel 6:22': "God sent an angel to shut the lions' mouths—I was safe!",
    'exodus 3:4': "God called Moses from a burning bush!",
    'exodus 14:21': "God made a way through the sea!",
    'exodus 16:4': "God gives bread from heaven—He gives what we need!",
    'exodus 20:1': "God gives rules to keep us safe!",
    'judges 16:28': "God gives strength—use it for good!",
    'daniel 3:25': "God kept Shadrach, Meshach, and Abednego safe in the fire!",
    'esther 4:14': "You were made for such a time as this—be brave!",
    'luke 2:11': "Jesus came as a baby—God loves us!",
    'matthew 14:27': "Jesus says: Don't be afraid—I'm here!",
    'matthew 14:19': "Jesus feeds everyone—He cares!",
    'luke 10:37': "Love your neighbor—help anyone!",
    'luke 15:20': "God welcomes you home—come back!",
    'luke 19:5': "Jesus sees you—even if you're small!",
    'john 11:43': "Jesus gives life—Lazarus, come out!",
    'matthew 28:6': "Jesus beat death—He lives forever!",
    'genesis 1:3': "God said 'Let there be light!'—and it happened!",
    'joshua 6:20': "The walls fell down—God makes walls fall!",
    '1 samuel 17:34': "David protected his sheep from lion and bear—God protects us!",
    '1 kings 18:38': "Fire fell from heaven—God answers! He's real!",
    '2 kings 4:6': "The oil kept filling—God multiplies!",
    '2 kings 5:14': "Naaman dipped seven times—obey God, get healed!",
    'matthew 14:25': "Jesus walks on the water—He lifts us!",
    'luke 15:6': "Rejoice! The lost sheep is found—you're never lost!",
    'matthew 21:9': "Hosanna! Jesus rides the donkey—welcome the King!",
    'luke 22:19': "This is My body—Jesus shares bread, He loves us!",
    'matthew 4:4': "Jesus says no—use God's word!",
    'matthew 13:23': "Plant good words—grow strong!",
    'mark 10:21': "Give to others—follow Jesus!",
    'mark 12:43': "Small gifts matter—God sees!",
    'matthew 26:39': "Jesus talks to God—talk to Him!",
    'matthew 26:50': "Friends fail—Jesus forgives!",
    'john 18:37': "Jesus stays quiet—trust God!",
    'john 19:30': "Jesus dies for us—love wins!",
    'luke 24:31': "Jesus walks with us—He explains!",
    'acts 1:9': "Jesus goes up—He's with God!",
    'acts 2:4': "Holy Spirit fills them—power inside!",
    'acts 7:60': "Stephen forgives—be like him!",
    'acts 9:3': "Jesus changes Paul—He changes us!",
    'revelation 21:4': "God wipes away tears—no more sad!",
    'ruth 1:16': "Your people shall be my people—be kind!",
    'matthew 25:21': "Use what God gave you—grow it!",
    'ephesians 6:11': "Put on God's armor—you're strong!"
  };

  const KID_CONTEXT = {
    'philippians 4:13': {
      who: 'Paul (a guy who loved Jesus)',
      to: 'His friends in a church far away',
      apply: "When you're scared or tired, say: 'God, give me strength!' — then try the hard thing!"
    },
    'joshua 1:9': {
      who: 'God',
      to: 'Joshua (a brave leader)',
      apply: "When you have to do something new, remember God is with you—go for it!"
    },
    'psalm 23:1': {
      who: 'David (a shepherd who became king)',
      to: 'Everyone who trusts God',
      apply: "When you're worried, God is your helper—like a shepherd cares for his sheep!"
    },
    'matthew 19:14': {
      who: 'Jesus',
      to: 'His friends (who tried to send kids away)',
      apply: "Jesus loves kids! You can always come to Him—no matter what."
    },
    'ephesians 6:10': {
      who: 'Paul',
      to: 'Christians in Ephesus',
      apply: "Put on God's armor (truth, faith, peace)—you're strong when you trust Him!"
    },
    'isaiah 41:10': {
      who: 'God',
      to: 'His people who were afraid',
      apply: "God says: Don't be scared—I'm right here with you!"
    },
    'john 3:16': {
      who: 'Jesus (through John)',
      to: 'The whole world',
      apply: "God loves you so much He sent Jesus. Believe in Him and you'll live forever with God!"
    },
    'john 14:27': {
      who: 'Jesus',
      to: 'His disciples before He left',
      apply: "When you're worried, remember: Jesus gives you peace that nothing else can!"
    },
    'matthew 6:26': {
      who: 'Jesus',
      to: 'People worried about food and clothes',
      apply: "God feeds the birds—He'll take care of you too! Don't worry."
    },
    '1 samuel 17:47': {
      who: 'David (to Goliath)',
      to: 'The giant and everyone watching',
      apply: "The battle is God's! When something seems too big, trust God to help you."
    },
    'jonah 1:17': {
      who: 'The Bible writer',
      to: 'Everyone reading',
      apply: "When you run from God, He still loves you—come back and obey!"
    },
    'daniel 6:22': {
      who: 'Daniel',
      to: 'King Darius and us',
      apply: "When you're in trouble for praying, God protects you—just keep talking to Him!"
    },
    'exodus 3:4': {
      who: 'God',
      to: 'Moses (at the burning bush)',
      apply: "God called Moses from a burning bush! When God calls you, say yes—He will help you!"
    },
    'exodus 14:21': {
      who: 'God',
      to: 'Moses and the Israelites',
      apply: "God makes a way! When things seem impossible, trust Him—He can do anything!"
    },
    'exodus 16:4': {
      who: 'God',
      to: 'The Israelites in the wilderness',
      apply: "God gives what we need! Trust Him for your food, your family—He takes care of you!"
    },
    'exodus 20:1': {
      who: 'God',
      to: 'Moses and the Israelites',
      apply: "God gives rules to keep us safe! Love God and love others—that's what matters!"
    },
    'judges 16:28': {
      who: 'God',
      to: 'Samson',
      apply: "God gives power—use it right! Be strong for good, not for showing off."
    },
    'daniel 3:25': {
      who: 'God',
      to: 'Shadrach, Meshach, and Abednego',
      apply: "God keeps friends safe! When you stand for God, He stands with you!"
    },
    'esther 4:14': {
      who: 'Mordecai',
      to: 'Esther',
      apply: "Be brave—God uses you! You were made for such a time as this!"
    },
    'luke 2:11': {
      who: 'The angel',
      to: 'The shepherds',
      apply: "Jesus came as a baby—God loves us! Christmas is about God's greatest gift!"
    },
    'matthew 14:27': {
      who: 'Jesus',
      to: 'His disciples in the storm',
      apply: "Jesus stops storms—trust Him! When you're scared, He says: Don't be afraid—I'm here!"
    },
    'matthew 14:19': {
      who: 'Jesus',
      to: 'The 5,000 people',
      apply: "Jesus feeds everyone—He cares! Give God what you have—He can multiply it!"
    },
    'luke 10:37': {
      who: 'Jesus',
      to: 'A man who asked who his neighbor is',
      apply: "Love your neighbor—help anyone! Be kind to people who need you."
    },
    'luke 15:20': {
      who: 'Jesus',
      to: 'People who wondered if God forgives',
      apply: "God welcomes you home! No matter what you did, come back—He runs to meet you!"
    },
    'luke 19:5': {
      who: 'Jesus',
      to: 'Zacchaeus',
      apply: "Jesus sees you—even if you're small! He knows your name and wants to be your friend!"
    },
    'john 11:43': {
      who: 'Jesus',
      to: 'Lazarus (in the tomb)',
      apply: "Jesus gives life—don't be sad! He is the Resurrection and the Life!"
    },
    'matthew 28:6': {
      who: 'The angel',
      to: 'The women at the tomb',
      apply: "Jesus beat death—He lives forever! That's why we celebrate Easter—He won!"
    },
    'genesis 1:3': {
      who: 'God',
      to: 'Everyone',
      apply: "God said 'Let there be light!'—and it happened! God made everything—wow!"
    },
    'joshua 6:20': {
      who: 'God',
      to: 'Joshua and the Israelites',
      apply: "God makes walls fall—trust Him! Obey God even when it seems weird!"
    },
    '1 samuel 17:34': {
      who: 'David',
      to: 'King Saul',
      apply: "David protected sheep—God protects us! Like a shepherd cares for his flock!"
    },
    '1 kings 18:38': {
      who: 'God',
      to: 'Elijah and all Israel',
      apply: "God answers with fire—He's real! The LORD is God—trust Him alone!"
    },
    '2 kings 4:6': {
      who: 'God',
      to: 'The widow through Elisha',
      apply: "God multiplies—He provides! Give God what you have—He can do more!"
    },
    '2 kings 5:14': {
      who: 'God',
      to: 'Naaman',
      apply: "Obey God—get healed! Even when it seems simple, do what He says!"
    },
    'matthew 14:25': {
      who: 'Jesus',
      to: 'His disciples',
      apply: "Jesus walks on waves—He lifts us! Keep your eyes on Him—don't be afraid!"
    },
    'luke 15:6': {
      who: 'Jesus',
      to: "People who wondered about God's love",
      apply: "Jesus finds lost sheep—you're never lost! God searches for you!"
    },
    'matthew 21:9': {
      who: 'The crowds',
      to: 'Jesus',
      apply: "Hosanna! Jesus rides the donkey—welcome Him! He is the King of Kings!"
    },
    'luke 22:19': {
      who: 'Jesus',
      to: 'His disciples',
      apply: "Jesus shares bread—He loves us! Remember Him when you eat together!"
    },
    'matthew 4:4': {
      who: 'Jesus',
      to: 'The devil (and us)',
      apply: "Jesus says no—use God's word! When the devil lies, quote the Bible!"
    },
    'matthew 13:23': {
      who: 'Jesus',
      to: 'The crowds',
      apply: "Plant good words—grow strong! Let God's word take root in your heart!"
    },
    'mark 10:21': {
      who: 'Jesus',
      to: 'The rich young ruler',
      apply: "Give to others—follow Jesus! He's worth more than anything!"
    },
    'mark 12:43': {
      who: 'Jesus',
      to: 'His disciples',
      apply: "Small gifts matter—God sees! Give what you have from the heart!"
    },
    'matthew 26:39': {
      who: 'Jesus',
      to: 'God the Father',
      apply: "Jesus talks to God—talk to Him! Pray when you're scared or sad!"
    },
    'matthew 26:50': {
      who: 'Jesus',
      to: 'Judas',
      apply: "Even friends fail—Jesus forgives! He still loves you when people hurt you."
    },
    'john 18:37': {
      who: 'Jesus',
      to: 'Pilate',
      apply: "Jesus stays quiet—trust God! When things are unfair, He knows the truth!"
    },
    'john 19:30': {
      who: 'Jesus',
      to: 'The whole world',
      apply: "Jesus dies for us—love wins! He took our sins so we could be free!"
    },
    'luke 24:31': {
      who: 'Jesus',
      to: 'Cleopas and his friend',
      apply: "Jesus walks with us—He explains! He's with you on every road!"
    },
    'acts 1:9': {
      who: 'Jesus',
      to: 'His disciples',
      apply: "Jesus goes up—He's with God! He promised to come back—spread His love!"
    },
    'acts 2:4': {
      who: 'God',
      to: 'The disciples',
      apply: "Holy Spirit comes—power for us! God fills you with His Spirit!"
    },
    'acts 7:60': {
      who: 'Stephen',
      to: 'Those who stoned him',
      apply: "Stephen forgives—be like him! Even when hurt, pray for others!"
    },
    'acts 9:3': {
      who: 'Jesus',
      to: 'Saul (Paul)',
      apply: "Jesus changes Paul—He changes us! No one is too far for God!"
    },
    'revelation 21:4': {
      who: 'God',
      to: 'Everyone who believes',
      apply: "God makes new home—no more sad! No tears, no pain—forever with Him!"
    },
    'ruth 1:16': {
      who: 'Ruth',
      to: 'Naomi',
      apply: "Be kind—God sees! Loyalty and kindness matter to Him!"
    },
    'matthew 25:21': {
      who: 'Jesus',
      to: 'His disciples',
      apply: "Use what God gave you—grow it! Don't hide your gifts—use them!"
    },
    'ephesians 6:11': {
      who: 'Paul',
      to: 'Christians in Ephesus',
      apply: "Put on God's armor—you're strong! Truth, faith, peace—stand firm!"
    }
  };

  const BOOK_CONTEXT = {
    genesis: { who: 'Moses (by the Holy Spirit)', to: 'God\'s people learning their beginnings' },
    exodus: { who: 'Moses (by the Holy Spirit)', to: 'God\'s people learning trust and obedience' },
    leviticus: { who: 'Moses (by the Holy Spirit)', to: 'God\'s people learning how to live holy' },
    numbers: { who: 'Moses (by the Holy Spirit)', to: 'God\'s people in the wilderness' },
    deuteronomy: { who: 'Moses', to: 'Israel before entering the promised land' },
    joshua: { who: 'Joshua / biblical record', to: 'God\'s people learning courage and obedience' },
    judges: { who: 'Biblical record', to: 'God\'s people who needed to return to God' },
    ruth: { who: 'Biblical record', to: 'God\'s people learning loyalty and kindness' },
    '1 samuel': { who: 'Biblical record', to: 'God\'s people learning courage and leadership' },
    '2 samuel': { who: 'Biblical record', to: 'God\'s people learning about David and God\'s promises' },
    '1 kings': { who: 'Biblical record', to: 'God\'s people learning wisdom and faithfulness' },
    '2 kings': { who: 'Biblical record', to: 'God\'s people learning trust in hard times' },
    psalm: { who: 'David and other worship leaders', to: 'God\'s people in prayer and worship' },
    proverbs: { who: 'Solomon (mostly)', to: 'God\'s people learning wise living' },
    isaiah: { who: 'Isaiah', to: 'God\'s people who needed comfort and correction' },
    jeremiah: { who: 'Jeremiah', to: 'God\'s people in a hard season' },
    daniel: { who: 'Daniel / biblical record', to: 'God\'s people learning faith under pressure' },
    jonah: { who: 'Biblical record', to: 'God\'s people learning mercy and obedience' },
    matthew: { who: 'Matthew', to: 'People learning Jesus is the promised King' },
    mark: { who: 'Mark', to: 'People learning what Jesus did with power and compassion' },
    luke: { who: 'Luke', to: 'People learning the careful story of Jesus' },
    john: { who: 'John', to: 'People learning to believe in Jesus' },
    acts: { who: 'Luke', to: 'People learning how the early church grew' },
    romans: { who: 'Paul', to: 'The church in Rome' },
    '1 corinthians': { who: 'Paul', to: 'The church in Corinth' },
    '2 corinthians': { who: 'Paul', to: 'The church in Corinth' },
    galatians: { who: 'Paul', to: 'Churches in Galatia' },
    ephesians: { who: 'Paul', to: 'Believers in Ephesus' },
    philippians: { who: 'Paul', to: 'Believers in Philippi' },
    colossians: { who: 'Paul', to: 'Believers in Colossae' },
    '1 thessalonians': { who: 'Paul', to: 'Believers in Thessalonica' },
    '2 thessalonians': { who: 'Paul', to: 'Believers in Thessalonica' },
    '1 timothy': { who: 'Paul', to: 'Timothy, a young church leader' },
    '2 timothy': { who: 'Paul', to: 'Timothy, to stay strong and faithful' },
    titus: { who: 'Paul', to: 'Titus, a church leader' },
    philemon: { who: 'Paul', to: 'Philemon, a believer and friend' },
    hebrews: { who: 'Biblical letter writer', to: 'Believers tempted to give up' },
    james: { who: 'James', to: 'Believers learning faith-in-action' },
    '1 peter': { who: 'Peter', to: 'Believers facing trials' },
    '2 peter': { who: 'Peter', to: 'Believers growing in truth' },
    '1 john': { who: 'John', to: 'Believers learning truth and love' },
    '2 john': { who: 'John', to: 'A church family' },
    '3 john': { who: 'John', to: 'A believer named Gaius' },
    jude: { who: 'Jude', to: 'Believers called to stand for truth' },
    revelation: { who: 'John', to: 'Churches needing hope and endurance' }
  };

  const KIDS_VERSES = [
  { ref: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.' },
  { ref: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.' },
  { ref: 'Joshua 1:9', text: 'Be strong and of a good courage; be not afraid.' },
  { ref: 'Matthew 19:14', text: 'Suffer little children to come unto me.' },
  { ref: 'Psalm 119:105', text: 'Thy word is a lamp unto my feet.' },
  { ref: 'Ephesians 6:10', text: 'Be strong in the Lord, and in the power of his might.' },
  { ref: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee.' },
  { ref: 'Proverbs 3:5', text: 'Trust in the Lord with all thine heart.' },
  { ref: '1 Samuel 17:47', text: 'The battle is the Lord\'s.' },
  { ref: 'Jonah 1:17', text: 'Now the Lord had prepared a great fish to swallow up Jonah. And Jonah was in the belly of the fish three days and three nights.' },
  { ref: 'Daniel 6:22', text: 'My God hath sent his angel, and hath shut the lions\' mouths, that they have not hurt me.' },
  { ref: 'Romans 8:28', text: 'All things work together for good to them that love God.' },
  { ref: 'Psalm 46:10', text: 'Be still, and know that I am God.' },
  { ref: 'Matthew 6:26', text: 'Behold the fowls of the air: your heavenly Father feedeth them.' },
  { ref: 'John 14:27', text: 'Peace I leave with you, my peace I give unto you.' },
  { ref: 'Psalm 56:3', text: 'What time I am afraid, I will trust in thee.' },
  { ref: 'Colossians 3:23', text: 'Whatsoever ye do, do it heartily, as to the Lord.' },
  { ref: 'Psalm 139:14', text: 'I am fearfully and wonderfully made.' },
  { ref: 'Jeremiah 29:11', text: 'For I know the thoughts that I think toward you.' },
  { ref: 'Luke 11:28', text: 'Blessed are they that hear the word of God.' },
  { ref: 'Psalm 34:8', text: 'O taste and see that the Lord is good.' },
  { ref: '2 Timothy 1:7', text: 'God hath not given us the spirit of fear.' },
  { ref: 'Psalm 100:5', text: 'The Lord is good; his mercy is everlasting.' },
  { ref: 'Hebrews 13:6', text: 'The Lord is my helper, and I will not fear.' },
  { ref: 'Psalm 37:4', text: 'Delight thyself also in the Lord; and he shall give thee the desires of thine heart.' },
  { ref: '1 Peter 5:7', text: 'Casting all your care upon him; for he careth for you.' },
  { ref: 'Psalm 121:1-2', text: 'I will lift up mine eyes unto the hills, from whence cometh my help.' },
  { ref: 'Matthew 5:16', text: 'Let your light so shine before men.' },
  { ref: 'Psalm 18:2', text: 'The Lord is my rock, and my fortress.' },
  { ref: 'Isaiah 40:31', text: 'They that wait upon the Lord shall renew their strength.' },
  { ref: 'Proverbs 17:22', text: 'A merry heart doeth good like a medicine.' },
  { ref: 'Psalm 16:11', text: 'Thou wilt shew me the path of life.' },
  { ref: 'Psalm 118:24', text: 'This is the day which the Lord hath made; we will rejoice.' },
  { ref: '1 John 4:19', text: 'We love him, because he first loved us.' },
  { ref: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help.' },
  { ref: 'Nehemiah 8:10', text: 'The joy of the Lord is your strength.' },
  { ref: 'Psalm 27:1', text: 'The Lord is my light and my salvation; whom shall I fear?' },
  { ref: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son.' },
  { ref: 'Psalm 34:14', text: 'Depart from evil, and do good; seek peace.' },
  { ref: 'Psalm 4:7', text: 'Thou hast put gladness in my heart.' },
  { ref: 'Matthew 11:28', text: 'Come unto me, all ye that labour, and I will give you rest.' },
  { ref: 'Proverbs 22:6', text: 'Train up a child in the way he should go.' },
  { ref: 'Psalm 121:7', text: 'The Lord shall preserve thee from all evil.' },
  { ref: '1 Corinthians 16:13', text: 'Watch ye, stand fast in the faith, be strong.' },
  { ref: 'Romans 15:13', text: 'The God of hope fill you with all joy and peace.' },
  { ref: 'Psalm 91:11', text: 'He shall give his angels charge over thee.' },
  { ref: 'Hebrews 11:1', text: 'Faith is the substance of things hoped for.' },
  { ref: 'Psalm 34:18', text: 'The Lord is nigh unto them that are of a broken heart.' },
  { ref: 'Isaiah 26:3', text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee.' },
  { ref: 'Romans 8:38', text: 'Neither death, nor life shall separate us from the love of God.' },
  { ref: 'Psalm 27:14', text: 'Wait on the Lord: be of good courage.' },
  { ref: 'Philippians 4:6', text: 'Be careful for nothing; but in every thing by prayer let your requests be made known.' },
  { ref: 'Philippians 4:7', text: 'The peace of God shall keep your hearts and minds.' },
  { ref: 'Psalm 32:8', text: 'I will instruct thee and teach thee in the way which thou shalt go.' },
  { ref: 'Proverbs 16:3', text: 'Commit thy works unto the Lord, and thy thoughts shall be established.' },
  { ref: 'Psalm 37:5', text: 'Commit thy way unto the Lord; trust also in him.' },
  { ref: 'Isaiah 43:2', text: 'When thou passest through the waters, I will be with thee.' },
  { ref: 'Psalm 145:9', text: 'The Lord is good to all: and his tender mercies are over all his works.' },
  { ref: 'Psalm 103:13', text: 'Like as a father pitieth his children, so the Lord pitieth them that fear him.' },
  { ref: 'Matthew 7:7', text: 'Ask, and it shall be given you; seek, and ye shall find.' },
  { ref: 'Psalm 9:1', text: 'I will praise thee, O Lord, with my whole heart.' },
  { ref: 'Psalm 19:14', text: 'Let the words of my mouth be acceptable in thy sight.' },
  { ref: 'Psalm 28:7', text: 'The Lord is my strength and my shield.' },
  { ref: 'Psalm 31:24', text: 'Be of good courage, and he shall strengthen your heart.' },
  { ref: 'Psalm 33:4', text: 'The word of the Lord is right; and all his works are done in truth.' },
  { ref: 'Psalm 40:1', text: 'I waited patiently for the Lord; and he inclined unto me.' },
  { ref: 'Psalm 42:11', text: 'Hope thou in God: for I shall yet praise him.' },
  { ref: 'Psalm 55:22', text: 'Cast thy burden upon the Lord, and he shall sustain thee.' },
  { ref: 'Psalm 59:16', text: 'I will sing of thy power; yea, I will sing aloud of thy mercy.' },
  { ref: 'Psalm 61:2', text: 'From the end of the earth will I cry unto thee, when my heart is overwhelmed.' },
  { ref: 'Psalm 62:5', text: 'My soul, wait thou only upon God; for my expectation is from him.' },
  { ref: 'Psalm 66:20', text: 'Blessed be God, which hath not turned away my prayer.' },
  { ref: 'Psalm 68:19', text: 'Blessed be the Lord, who daily loadeth us with benefits.' },
  { ref: 'Psalm 71:14', text: 'I will hope continually, and will yet praise thee more and more.' },
  { ref: 'Psalm 73:26', text: 'God is the strength of my heart, and my portion for ever.' },
  { ref: 'Psalm 86:5', text: 'For thou, Lord, art good, and ready to forgive.' },
  { ref: 'Psalm 90:12', text: 'So teach us to number our days, that we may apply our hearts unto wisdom.' },
  { ref: 'Psalm 94:19', text: 'In the multitude of my thoughts within me thy comforts delight my soul.' },
  { ref: 'Psalm 103:2', text: 'Bless the Lord, O my soul, and forget not all his benefits.' },
  { ref: 'Psalm 103:4', text: 'Who redeemeth thy life from destruction; who crowneth thee with lovingkindness.' },
  { ref: 'Psalm 107:1', text: 'O give thanks unto the Lord, for he is good.' },
  { ref: 'Psalm 118:6', text: 'The Lord is on my side; I will not fear.' },
  { ref: 'Psalm 118:14', text: 'The Lord is my strength and song.' },
  { ref: 'Psalm 119:11', text: 'Thy word have I hid in mine heart, that I might not sin against thee.' },
  { ref: 'Psalm 119:50', text: 'This is my comfort in my affliction: for thy word hath quickened me.' },
  { ref: 'Psalm 119:76', text: 'Let, I pray thee, thy merciful kindness be for my comfort.' },
  { ref: 'Psalm 119:165', text: 'Great peace have they which love thy law.' },
  { ref: 'Psalm 121:3', text: 'He will not suffer thy foot to be moved.' },
  { ref: 'Psalm 121:8', text: 'The Lord shall preserve thy going out and thy coming in.' },
  { ref: 'Psalm 138:3', text: 'In the day when I cried thou answeredst me, and strengthenedst me.' },
  { ref: 'Psalm 143:8', text: 'Cause me to hear thy lovingkindness in the morning.' },
  { ref: 'Psalm 145:18', text: 'The Lord is nigh unto all them that call upon him.' },
  { ref: 'Psalm 147:3', text: 'He healeth the broken in heart, and bindeth up their wounds.' },
  { ref: 'Psalm 150:6', text: 'Let every thing that hath breath praise the Lord.' },
  { ref: 'Proverbs 2:6', text: 'The Lord giveth wisdom: out of his mouth cometh knowledge.' },
  { ref: 'Proverbs 4:23', text: 'Keep thy heart with all diligence; for out of it are the issues of life.' },
  { ref: 'Proverbs 12:25', text: 'Heaviness in the heart of man maketh it stoop: but a good word maketh it glad.' },
  { ref: 'Proverbs 14:30', text: 'A sound heart is the life of the flesh.' },
  { ref: 'Proverbs 15:1', text: 'A soft answer turneth away wrath.' },
  { ref: 'Proverbs 15:3', text: 'The eyes of the Lord are in every place.' },
  { ref: 'Proverbs 16:9', text: 'A man\'s heart deviseth his way: but the Lord directeth his steps.' },
  { ref: 'Proverbs 18:10', text: 'The name of the Lord is a strong tower.' },
  { ref: 'Proverbs 20:7', text: 'The just man walketh in his integrity: his children are blessed after him.' },
  { ref: 'Proverbs 22:1', text: 'A good name is rather to be chosen than great riches.' },
  { ref: 'Proverbs 28:26', text: 'He that trusteth in the Lord shall be made fat.' },
  { ref: 'Isaiah 26:4', text: 'Trust ye in the Lord for ever: for in the Lord Jehovah is everlasting strength.' },
  { ref: 'Isaiah 33:2', text: 'Be thou our arm every morning, our salvation also in the time of trouble.' },
  { ref: 'Isaiah 40:29', text: 'He giveth power to the faint; and to them that have no might he increaseth strength.' },
  { ref: 'Isaiah 43:4', text: 'Since thou wast precious in my sight, thou hast been honourable.' },
  { ref: 'Isaiah 49:16', text: 'Behold, I have graven thee upon the palms of my hands.' },
  { ref: 'Isaiah 54:10', text: 'My kindness shall not depart from thee.' },
  { ref: 'Isaiah 55:6', text: 'Seek ye the Lord while he may be found, call ye upon him while he is near.' },
  { ref: 'Isaiah 58:11', text: 'The Lord shall guide thee continually, and satisfy thy soul in drought.' },
  { ref: 'Jeremiah 17:7', text: 'Blessed is the man that trusteth in the Lord.' },
  { ref: 'Jeremiah 31:3', text: 'I have loved thee with an everlasting love.' },
  { ref: 'Lamentations 3:22', text: 'It is of the Lord\'s mercies that we are not consumed.' },
  { ref: 'Lamentations 3:23', text: 'His compassions fail not. They are new every morning.' },
  { ref: 'Nahum 1:7', text: 'The Lord is good, a strong hold in the day of trouble.' },
  { ref: 'Zephaniah 3:17', text: 'The Lord thy God in the midst of thee is mighty; he will save.' },
  { ref: 'Matthew 5:14', text: 'Ye are the light of the world.' },
  { ref: 'Matthew 5:44', text: 'Love your enemies, bless them that curse you.' },
  { ref: 'Matthew 6:33', text: 'Seek ye first the kingdom of God, and his righteousness.' },
  { ref: 'Matthew 7:12', text: 'All things whatsoever ye would that men should do to you, do ye even so to them.' },
  { ref: 'Matthew 18:20', text: 'Where two or three are gathered together in my name, there am I in the midst of them.' },
  { ref: 'Matthew 21:22', text: 'All things, whatsoever ye shall ask in prayer, believing, ye shall receive.' },
  { ref: 'Mark 9:23', text: 'All things are possible to him that believeth.' },
  { ref: 'Mark 10:27', text: 'With God all things are possible.' },
  { ref: 'Mark 11:24', text: 'What things soever ye desire, when ye pray, believe that ye receive them.' },
  { ref: 'Luke 1:37', text: 'With God nothing shall be impossible.' },
  { ref: 'Luke 6:31', text: 'As ye would that men should do to you, do ye also to them likewise.' },
  { ref: 'Luke 6:38', text: 'Give, and it shall be given unto you; good measure, pressed down.' },
  { ref: 'Luke 12:32', text: 'Fear not, little flock; for it is your Father\'s good pleasure to give you the kingdom.' },
  { ref: 'John 1:12', text: 'As many as received him, to them gave he power to become the sons of God.' },
  { ref: 'John 6:35', text: 'I am the bread of life: he that cometh to me shall never hunger.' },
  { ref: 'John 8:12', text: 'I am the light of the world: he that followeth me shall not walk in darkness.' },
  { ref: 'John 10:11', text: 'I am the good shepherd: the good shepherd giveth his life for the sheep.' },
  { ref: 'John 10:28', text: 'I give unto them eternal life; and they shall never perish.' },
  { ref: 'John 11:25', text: 'I am the resurrection, and the life.' },
  { ref: 'John 13:34', text: 'A new commandment I give unto you, That ye love one another.' },
  { ref: 'John 14:1', text: 'Let not your heart be troubled: ye believe in God, believe also in me.' },
  { ref: 'John 14:6', text: 'I am the way, the truth, and the life.' },
  { ref: 'John 15:12', text: 'This is my commandment, That ye love one another, as I have loved you.' },
  { ref: 'John 16:33', text: 'In the world ye shall have tribulation: but be of good cheer; I have overcome the world.' },
  { ref: 'Romans 5:5', text: 'The love of God is shed abroad in our hearts by the Holy Ghost.' },
  { ref: 'Romans 8:31', text: 'If God be for us, who can be against us?' },
  { ref: 'Romans 8:37', text: 'Nay, in all these things we are more than conquerors through him that loved us.' },
  { ref: 'Romans 12:12', text: 'Rejoicing in hope; patient in tribulation; continuing instant in prayer.' },
  { ref: 'Romans 14:8', text: 'Whether we live therefore, or die, we are the Lord\'s.' },
  { ref: '1 Corinthians 13:4', text: 'Charity suffereth long, and is kind.' },
  { ref: '1 Corinthians 13:13', text: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.' },
  { ref: '2 Corinthians 4:16', text: 'Though our outward man perish, yet the inward man is renewed day by day.' },
  { ref: '2 Corinthians 5:7', text: 'We walk by faith, not by sight.' },
  { ref: '2 Corinthians 12:9', text: 'My grace is sufficient for thee: for my strength is made perfect in weakness.' },
  { ref: 'Galatians 5:22', text: 'The fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith.' },
  { ref: 'Galatians 6:9', text: 'Let us not be weary in well doing: for in due season we shall reap.' },
  { ref: 'Ephesians 2:10', text: 'We are his workmanship, created in Christ Jesus unto good works.' },
  { ref: 'Ephesians 4:32', text: 'Be ye kind one to another, tenderhearted, forgiving one another.' },
  { ref: 'Ephesians 6:11', text: 'Put on the whole armour of God, that ye may be able to stand.' },
  { ref: 'Philippians 1:6', text: 'He which hath begun a good work in you will perform it until the day of Jesus Christ.' },
  { ref: 'Philippians 2:13', text: 'For it is God which worketh in you both to will and to do of his good pleasure.' },
  { ref: 'Philippians 4:4', text: 'Rejoice in the Lord alway: and again I say, Rejoice.' },
  { ref: 'Philippians 4:8', text: 'Whatsoever things are true, honest, just, pure, lovely, think on these things.' },
  { ref: 'Philippians 4:19', text: 'My God shall supply all your need according to his riches in glory.' },
  { ref: 'Colossians 3:12', text: 'Put on therefore, as the elect of God, bowels of mercies, kindness, humbleness of mind.' },
  { ref: 'Colossians 3:20', text: 'Children, obey your parents in all things: for this is well pleasing unto the Lord.' },
  { ref: '1 Thessalonians 5:11', text: 'Comfort yourselves together, and edify one another.' },
  { ref: '1 Thessalonians 5:16', text: 'Rejoice evermore.' },
  { ref: '1 Thessalonians 5:17', text: 'Pray without ceasing.' },
  { ref: '2 Thessalonians 3:3', text: 'The Lord is faithful, who shall stablish you, and keep you from evil.' },
  { ref: '1 Timothy 4:12', text: 'Let no man despise thy youth; but be thou an example of the believers.' },
  { ref: '2 Timothy 2:15', text: 'Study to shew thyself approved unto God, a workman that needeth not to be ashamed.' },
  { ref: 'Hebrews 4:16', text: 'Let us therefore come boldly unto the throne of grace.' },
  { ref: 'Hebrews 10:23', text: 'Let us hold fast the profession of our faith without wavering.' },
  { ref: 'Hebrews 12:2', text: 'Looking unto Jesus the author and finisher of our faith.' },
  { ref: 'James 1:5', text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally.' },
  { ref: 'James 1:17', text: 'Every good gift and every perfect gift is from above.' },
  { ref: 'James 4:8', text: 'Draw nigh to God, and he will draw nigh to you.' },
  { ref: '1 Peter 2:9', text: 'Ye are a chosen generation, a royal priesthood, an holy nation.' },
  { ref: '1 Peter 3:15', text: 'Sanctify the Lord God in your hearts: and be ready always to give an answer.' },
  { ref: '1 Peter 4:8', text: 'And above all things have fervent charity among yourselves: for charity shall cover the multitude of sins.' },
  { ref: '1 John 1:9', text: 'If we confess our sins, he is faithful and just to forgive us our sins.' },
  { ref: '1 John 3:1', text: 'Behold, what manner of love the Father hath bestowed upon us.' },
  { ref: '1 John 4:4', text: 'Greater is he that is in you, than he that is in the world.' },
  { ref: '1 John 4:7', text: 'Beloved, let us love one another: for love is of God.' },
  { ref: '1 John 4:18', text: 'There is no fear in love; but perfect love casteth out fear.' },
  { ref: '1 John 5:14', text: 'This is the confidence that we have in him, that, if we ask any thing according to his will, he heareth us.' },
  { ref: 'Revelation 3:20', text: 'Behold, I stand at the door, and knock: if any man hear my voice, I will come in to him.' },
  { ref: 'Psalm 1:1', text: 'Blessed is the man that walketh not in the counsel of the ungodly.' },
  { ref: 'Psalm 4:8', text: 'I will both lay me down in peace, and sleep: for thou, Lord, only makest me dwell in safety.' },
  { ref: 'Psalm 5:3', text: 'My voice shalt thou hear in the morning, O Lord.' },
  { ref: 'Psalm 6:9', text: 'The Lord hath heard my supplication; the Lord will receive my prayer.' },
  { ref: 'Psalm 7:10', text: 'My defence is of God, which saveth the upright in heart.' },
  { ref: 'Psalm 8:2', text: 'Out of the mouth of babes and sucklings hast thou ordained strength.' },
  { ref: 'Psalm 10:17', text: 'Lord, thou hast heard the desire of the humble: thou wilt prepare their heart.' },
  { ref: 'Psalm 11:7', text: 'The righteous Lord loveth righteousness.' },
  { ref: 'Psalm 12:6', text: 'The words of the Lord are pure words.' },
  { ref: 'Psalm 13:5', text: 'I have trusted in thy mercy; my heart shall rejoice in thy salvation.' },
  { ref: 'Psalm 14:5', text: 'God is in the generation of the righteous.' },
  { ref: 'Psalm 17:6', text: 'I have called upon thee, for thou wilt hear me, O God.' },
  { ref: 'Psalm 20:4', text: 'Grant thee according to thine own heart, and fulfil all thy counsel.' },
  { ref: 'Psalm 22:4', text: 'Our fathers trusted in thee: they trusted, and thou didst deliver them.' },
  { ref: 'Psalm 25:4', text: 'Shew me thy ways, O Lord; teach me thy paths.' },
  { ref: 'Psalm 25:5', text: 'Lead me in thy truth, and teach me: for thou art the God of my salvation.' },
  { ref: 'Psalm 26:1', text: 'I have trusted also in the Lord; therefore I shall not slide.' },
  { ref: 'Psalm 29:11', text: 'The Lord will give strength unto his people; the Lord will bless his people with peace.' },
  { ref: 'Psalm 30:5', text: 'Weeping may endure for a night, but joy cometh in the morning.' },
  { ref: 'Psalm 31:3', text: 'For thou art my rock and my fortress; therefore for thy name\'s sake lead me, and guide me.' },
  { ref: 'Psalm 33:18', text: 'Behold, the eye of the Lord is upon them that fear him.' },
  { ref: 'Psalm 34:4', text: 'I sought the Lord, and he heard me, and delivered me from all my fears.' },
  { ref: 'Psalm 34:7', text: 'The angel of the Lord encampeth round about them that fear him, and delivereth them.' },
  { ref: 'Psalm 34:9', text: 'O fear the Lord, ye his saints: for there is no want to them that fear him.' },
  { ref: 'Psalm 35:9', text: 'And my soul shall be joyful in the Lord.' },
  { ref: 'Psalm 36:5', text: 'Thy mercy, O Lord, is in the heavens.' },
  { ref: 'Psalm 37:3', text: 'Trust in the Lord, and do good; so shalt thou dwell in the land.' },
  { ref: 'Psalm 37:7', text: 'Rest in the Lord, and wait patiently for him.' },
  { ref: 'Psalm 37:23', text: 'The steps of a good man are ordered by the Lord.' },
  { ref: 'Psalm 37:25', text: 'I have been young, and now am old; yet have I not seen the righteous forsaken.' },
  { ref: 'Psalm 37:39', text: 'The salvation of the righteous is of the Lord: he is their strength in the time of trouble.' },
  { ref: 'Psalm 40:3', text: 'And he hath put a new song in my mouth, even praise unto our God.' },
  { ref: 'Psalm 40:4', text: 'Blessed is that man that maketh the Lord his trust.' },
  { ref: 'Psalm 41:1', text: 'Blessed is he that considereth the poor: the Lord will deliver him in time of trouble.' },
  { ref: 'Psalm 43:3', text: 'O send out thy light and thy truth: let them lead me.' },
  { ref: 'Psalm 43:4', text: 'Then will I go unto the altar of God, unto God my exceeding joy.' },
  { ref: 'Psalm 44:8', text: 'In God we boast all the day long, and praise thy name for ever.' },
  { ref: 'Psalm 46:7', text: 'The Lord of hosts is with us; the God of Jacob is our refuge.' },
  { ref: 'Psalm 47:1', text: 'O clap your hands, all ye people; shout unto God with the voice of triumph.' },
  { ref: 'Psalm 48:14', text: 'For this God is our God for ever and ever: he will be our guide even unto death.' },
  { ref: 'Psalm 50:15', text: 'Call upon me in the day of trouble: I will deliver thee.' },
  { ref: 'Psalm 51:10', text: 'Create in me a clean heart, O God; and renew a right spirit within me.' },
  { ref: 'Psalm 52:8', text: 'I am like a green olive tree in the house of God: I trust in the mercy of God for ever and ever.' },
  { ref: 'Psalm 54:4', text: 'Behold, God is mine helper: the Lord is with them that uphold my soul.' },
  { ref: 'Psalm 55:16', text: 'As for me, I will call upon God; and the Lord shall save me.' },
  { ref: 'Psalm 56:4', text: 'In God I will praise his word, in God I have put my trust; I will not fear what flesh can do unto me.' },
  { ref: 'Psalm 57:2', text: 'I will cry unto God most high; unto God that performeth all things for me.' },
  { ref: 'Psalm 59:9', text: 'Because of his strength will I wait upon thee: for God is my defence.' },
  { ref: 'Psalm 59:17', text: 'Unto thee, O my strength, will I sing: for God is my defence.' },
  { ref: 'Psalm 61:3', text: 'For thou hast been a shelter for me, and a strong tower from the enemy.' },
  { ref: 'Psalm 62:1', text: 'Truly my soul waiteth upon God: from him cometh my salvation.' },
  { ref: 'Psalm 62:6', text: 'He only is my rock and my salvation: he is my defence.' },
  { ref: 'Psalm 63:1', text: 'O God, thou art my God; early will I seek thee.' },
  { ref: 'Psalm 63:3', text: 'Because thy lovingkindness is better than life, my lips shall praise thee.' },
  { ref: 'Psalm 64:10', text: 'The righteous shall be glad in the Lord, and shall trust in him.' },
  { ref: 'Psalm 65:4', text: 'Blessed is the man whom thou choosest, and causest to approach unto thee.' },
  { ref: 'Psalm 66:8', text: 'O bless our God, ye people, and make the voice of his praise to be heard.' },
  { ref: 'Psalm 67:1', text: 'God be merciful unto us, and bless us; and cause his face to shine upon us.' },
  { ref: 'Psalm 68:35', text: 'O God, thou art terrible out of thy holy places: the God of Israel is he that giveth strength and power unto his people.' },
  { ref: 'Psalm 69:32', text: 'The humble shall see this, and be glad: and your heart shall live that seek God.' },
  { ref: 'Psalm 70:4', text: 'Let all those that seek thee rejoice and be glad in thee.' },
  { ref: 'Psalm 71:5', text: 'For thou art my hope, O Lord God: thou art my trust from my youth.' },
  { ref: 'Psalm 71:8', text: 'Let my mouth be filled with thy praise and with thy honour all the day.' },
  { ref: 'Psalm 72:18', text: 'Blessed be the Lord God, the God of Israel, who only doeth wondrous things.' },
  { ref: 'Psalm 74:12', text: 'For God is my King of old, working salvation in the midst of the earth.' },
  { ref: 'Psalm 75:1', text: 'Unto thee, O God, do we give thanks, unto thee do we give thanks.' },
  { ref: 'Psalm 76:4', text: 'Thou art more glorious and excellent than the mountains of prey.' },
  { ref: 'Psalm 77:14', text: 'Thou art the God that doest wonders: thou hast declared thy strength among the people.' },
  { ref: 'Psalm 78:4', text: 'We will not hide them from their children, shewing to the generation to come the praises of the Lord.' },
  { ref: 'Psalm 79:13', text: 'So we thy people and sheep of thy pasture will give thee thanks for ever.' },
  { ref: 'Psalm 80:3', text: 'Turn us again, O God, and cause thy face to shine; and we shall be saved.' },
  { ref: 'Psalm 81:10', text: 'I am the Lord thy God, which brought thee out of the land of Egypt: open thy mouth wide, and I will fill it.' },
  { ref: 'Psalm 82:3', text: 'Defend the poor and fatherless: do justice to the afflicted and needy.' },
  { ref: 'Psalm 84:11', text: 'For the Lord God is a sun and shield: the Lord will give grace and glory.' },
  { ref: 'Psalm 85:6', text: 'Wilt thou not revive us again: that thy people may rejoice in thee?' },
  { ref: 'Psalm 86:15', text: 'But thou, O Lord, art a God full of compassion, and gracious, longsuffering, and plenteous in mercy and truth.' },
  { ref: 'Psalm 87:3', text: 'Glorious things are spoken of thee, O city of God.' },
  { ref: 'Psalm 88:13', text: 'But unto thee have I cried, O Lord; and in the morning shall my prayer prevent thee.' },
  { ref: 'Psalm 89:1', text: 'I will sing of the mercies of the Lord for ever.' },
  { ref: 'Psalm 89:15', text: 'Blessed is the people that know the joyful sound: they shall walk, O Lord, in the light of thy countenance.' },
  { ref: 'Psalm 90:2', text: 'Before the mountains were brought forth, or ever thou hadst formed the earth and the world, even from everlasting to everlasting, thou art God.' },
  { ref: 'Psalm 90:14', text: 'O satisfy us early with thy mercy; that we may rejoice and be glad all our days.' },
  { ref: 'Psalm 91:1', text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.' },
  { ref: 'Psalm 91:2', text: 'I will say of the Lord, He is my refuge and my fortress: my God; in him will I trust.' },
  { ref: 'Psalm 92:1', text: 'It is a good thing to give thanks unto the Lord, and to sing praises unto thy name, O most High.' },
  { ref: 'Psalm 92:4', text: 'For thou, Lord, hast made me glad through thy work.' },
  { ref: 'Psalm 93:4', text: 'The Lord on high is mightier than the noise of many waters.' },
  { ref: 'Psalm 94:18', text: 'When I said, My foot slippeth; thy mercy, O Lord, held me up.' },
  { ref: 'Psalm 95:1', text: 'O come, let us sing unto the Lord: let us make a joyful noise to the rock of our salvation.' },
  { ref: 'Psalm 95:7', text: 'For he is our God; and we are the people of his pasture, and the sheep of his hand.' },
  { ref: 'Psalm 96:1', text: 'O sing unto the Lord a new song: sing unto the Lord, all the earth.' },
  { ref: 'Psalm 96:2', text: 'Sing unto the Lord, bless his name; shew forth his salvation from day to day.' },
  { ref: 'Psalm 97:11', text: 'Light is sown for the righteous, and gladness for the upright in heart.' },
  { ref: 'Psalm 98:1', text: 'O sing unto the Lord a new song; for he hath done marvellous things.' },
  { ref: 'Psalm 99:2', text: 'The Lord is great in Zion; and he is high above all the people.' },
  { ref: 'Psalm 100:1', text: 'Make a joyful noise unto the Lord, all ye lands.' },
  { ref: 'Psalm 100:2', text: 'Serve the Lord with gladness: come before his presence with singing.' },
  { ref: 'Psalm 100:3', text: 'Know ye that the Lord he is God: it is he that hath made us, and not we ourselves.' },
  { ref: 'Psalm 100:4', text: 'Enter into his gates with thanksgiving, and into his courts with praise.' },
  { ref: 'Psalm 101:1', text: 'I will sing of mercy and judgment: unto thee, O Lord, will I sing.' },
  { ref: 'Psalm 102:17', text: 'He will regard the prayer of the destitute, and not despise their prayer.' },
  { ref: 'Psalm 103:1', text: 'Bless the Lord, O my soul: and all that is within me, bless his holy name.' },
  { ref: 'Psalm 103:3', text: 'Who forgiveth all thine iniquities; who healeth all thy diseases.' },
  { ref: 'Psalm 103:5', text: 'Who satisfieth thy mouth with good things; so that thy youth is renewed like the eagle\'s.' },
  { ref: 'Psalm 103:8', text: 'The Lord is merciful and gracious, slow to anger, and plenteous in mercy.' },
  { ref: 'Psalm 103:11', text: 'For as the heaven is high above the earth, so great is his mercy toward them that fear him.' },
  { ref: 'Psalm 103:12', text: 'As far as the east is from the west, so far hath he removed our transgressions from us.' },
  { ref: 'Psalm 103:17', text: 'But the mercy of the Lord is from everlasting to everlasting upon them that fear him.' },
  { ref: 'Psalm 104:1', text: 'Bless the Lord, O my soul. O Lord my God, thou art very great.' },
  { ref: 'Psalm 104:33', text: 'I will sing unto the Lord as long as I live: I will sing praise to my God while I have my being.' },
  { ref: 'Psalm 105:1', text: 'O give thanks unto the Lord; call upon his name: make known his deeds among the people.' },
  { ref: 'Psalm 106:1', text: 'Praise ye the Lord. O give thanks unto the Lord; for he is good.' },
  { ref: 'Psalm 107:8', text: 'Oh that men would praise the Lord for his goodness, and for his wonderful works to the children of men!' },
  { ref: 'Psalm 107:9', text: 'For he satisfieth the longing soul, and filleth the hungry soul with goodness.' },
  { ref: 'Psalm 108:1', text: 'O God, my heart is fixed; I will sing and give praise, even with my glory.' },
  { ref: 'Psalm 108:4', text: 'For thy mercy is great above the heavens: and thy truth reacheth unto the clouds.' },
  { ref: 'Psalm 109:30', text: 'I will greatly praise the Lord with my mouth; yea, I will praise him among the multitude.' },
  { ref: 'Psalm 111:1', text: 'Praise ye the Lord. I will praise the Lord with my whole heart.' },
  { ref: 'Psalm 111:4', text: 'He hath made his wonderful works to be remembered: the Lord is gracious and full of compassion.' },
  { ref: 'Psalm 112:1', text: 'Praise ye the Lord. Blessed is the man that feareth the Lord.' },
  { ref: 'Psalm 112:4', text: 'Unto the upright there ariseth light in the darkness: he is gracious, and full of compassion, and righteous.' },
  { ref: 'Psalm 113:2', text: 'Blessed be the name of the Lord from this time forth and for evermore.' },
  { ref: 'Psalm 113:3', text: 'From the rising of the sun unto the going down of the same the Lord\'s name is to be praised.' },
  { ref: 'Psalm 114:7', text: 'Tremble, thou earth, at the presence of the Lord, at the presence of the God of Jacob.' },
  { ref: 'Psalm 115:12', text: 'The Lord hath been mindful of us: he will bless us.' },
  { ref: 'Psalm 116:1', text: 'I love the Lord, because he hath heard my voice and my supplications.' },
  { ref: 'Psalm 116:2', text: 'Because he hath inclined his ear unto me, therefore will I call upon him as long as I live.' },
  { ref: 'Psalm 116:5', text: 'Gracious is the Lord, and righteous; yea, our God is merciful.' },
  { ref: 'Psalm 116:7', text: 'Return unto thy rest, O my soul; for the Lord hath dealt bountifully with thee.' },
  { ref: 'Psalm 117:1', text: 'O praise the Lord, all ye nations: praise him, all ye people.' },
  { ref: 'Psalm 117:2', text: 'For his merciful kindness is great toward us: and the truth of the Lord endureth for ever.' },
  { ref: 'Psalm 118:1', text: 'O give thanks unto the Lord; for he is good: because his mercy endureth for ever.' },
  { ref: 'Psalm 118:5', text: 'I called upon the Lord in distress: the Lord answered me, and set me in a large place.' },
  { ref: 'Psalm 118:8', text: 'It is better to trust in the Lord than to put confidence in man.' },
  { ref: 'Psalm 118:17', text: 'I shall not die, but live, and declare the works of the Lord.' },
  { ref: 'Psalm 118:21', text: 'I will praise thee: for thou hast heard me, and art become my salvation.' },
  { ref: 'Psalm 118:23', text: 'This is the Lord\'s doing; it is marvellous in our eyes.' },
  { ref: 'Psalm 118:28', text: 'Thou art my God, and I will praise thee: thou art my God, I will exalt thee.' },
  { ref: 'Psalm 118:29', text: 'O give thanks unto the Lord; for he is good: for his mercy endureth for ever.' },
  { ref: 'Psalm 119:9', text: 'Wherewithal shall a young man cleanse his way? by taking heed thereto according to thy word.' },
  { ref: 'Psalm 119:18', text: 'Open thou mine eyes, that I may behold wondrous things out of thy law.' },
  { ref: 'Psalm 119:27', text: 'Make me to understand the way of thy precepts: so shall I talk of thy wondrous works.' },
  { ref: 'Psalm 119:28', text: 'My soul melteth for heaviness: strengthen thou me according unto thy word.' },
  { ref: 'Psalm 119:32', text: 'I will run the way of thy commandments, when thou shalt enlarge my heart.' },
  { ref: 'Psalm 119:45', text: 'And I will walk at liberty: for I seek thy precepts.' },
  { ref: 'Psalm 119:65', text: 'Thou hast dealt well with thy servant, O Lord, according unto thy word.' },
  { ref: 'Psalm 119:67', text: 'Before I was afflicted I went astray: but now have I kept thy word.' },
  { ref: 'Psalm 119:68', text: 'Thou art good, and doest good; teach me thy statutes.' },
  { ref: 'Psalm 119:73', text: 'Thy hands have made me and fashioned me: give me understanding, that I may learn thy commandments.' },
  { ref: 'Psalm 119:89', text: 'For ever, O Lord, thy word is settled in heaven.' },
  { ref: 'Psalm 119:93', text: 'I will never forget thy precepts: for with them thou hast quickened me.' },
  { ref: 'Psalm 119:97', text: 'O how love I thy law! it is my meditation all the day.' },
  { ref: 'Psalm 119:103', text: 'How sweet are thy words unto my taste! yea, sweeter than honey to my mouth!' },
  { ref: 'Psalm 119:114', text: 'Thou art my hiding place and my shield: I hope in thy word.' },
  { ref: 'Psalm 119:116', text: 'Uphold me according unto thy word, that I may live: and let me not be ashamed of my hope.' },
  { ref: 'Psalm 119:130', text: 'The entrance of thy words giveth light; it giveth understanding unto the simple.' },
  { ref: 'Psalm 119:133', text: 'Order my steps in thy word: and let not any iniquity have dominion over me.' },
  { ref: 'Psalm 119:140', text: 'Thy word is very pure: therefore thy servant loveth it.' },
  { ref: 'Psalm 119:160', text: 'Thy word is true from the beginning: and every one of thy righteous judgments endureth for ever.' },
  { ref: 'Psalm 119:162', text: 'I rejoice at thy word, as one that findeth great spoil.' },
  { ref: 'Psalm 119:175', text: 'Let my soul live, and it shall praise thee; and let thy judgments help me.' },
  { ref: 'Psalm 121:4', text: 'Behold, he that keepeth Israel shall neither slumber nor sleep.' },
  { ref: 'Psalm 121:5', text: 'The Lord is thy keeper: the Lord is thy shade upon thy right hand.' },
  { ref: 'Psalm 121:6', text: 'The sun shall not smite thee by day, nor the moon by night.' },
  { ref: 'Psalm 124:8', text: 'Our help is in the name of the Lord, who made heaven and earth.' },
  { ref: 'Psalm 125:1', text: 'They that trust in the Lord shall be as mount Zion, which cannot be removed.' },
  { ref: 'Psalm 126:2', text: 'Then was our mouth filled with laughter, and our tongue with singing.' },
  { ref: 'Psalm 126:3', text: 'The Lord hath done great things for us; whereof we are glad.' },
  { ref: 'Psalm 127:2', text: 'It is vain for you to rise up early, to sit up late: for so he giveth his beloved sleep.' },
  { ref: 'Psalm 128:1', text: 'Blessed is every one that feareth the Lord; that walketh in his ways.' },
  { ref: 'Psalm 130:5', text: 'I wait for the Lord, my soul doth wait, and in his word do I hope.' },
  { ref: 'Psalm 130:7', text: 'Let Israel hope in the Lord: for with the Lord there is mercy.' },
  { ref: 'Psalm 131:3', text: 'Let Israel hope in the Lord from henceforth and for ever.' },
  { ref: 'Psalm 133:1', text: 'Behold, how good and how pleasant it is for brethren to dwell together in unity!' },
  { ref: 'Psalm 134:2', text: 'Lift up your hands in the sanctuary, and bless the Lord.' },
  { ref: 'Psalm 135:3', text: 'Praise the Lord; for the Lord is good: sing praises unto his name; for it is pleasant.' },
  { ref: 'Psalm 136:1', text: 'O give thanks unto the Lord; for he is good: for his mercy endureth for ever.' },
  { ref: 'Psalm 138:7', text: 'Though I walk in the midst of trouble, thou wilt revive me.' },
  { ref: 'Psalm 139:17', text: 'How precious also are thy thoughts unto me, O God! how great is the sum of them!' },
  { ref: 'Psalm 145:14', text: 'The Lord upholdeth all that fall, and raiseth up all those that be bowed down.' }
];

  const KIDS_PRAYERS = [
    'Hey God, make me strong like Jesus today!',
    'Thanks for being my shepherd—keep me safe!',
    'God, help me be brave like Joshua!',
    'Jesus, let me run to you every day!',
    'Shine your light on my path, Lord!',
    'Give me power to do what\'s right!',
    'You\'re with me—no fear!',
    'I trust you, God—with everything!',
    'Fight my battles for me, Lord!',
    'God, help me obey You like Jonah did!',
    'God, protect me when I pray—like You protected Daniel!',
    'Turn every hard thing into good!',
    'Help me be quiet and know you\'re God!',
    'Thanks for feeding the birds—feed me too!',
    'Fill me with your peace, Jesus!',
    'When I\'m scared, I\'ll trust you!',
    'Help me work hard like it\'s for you!',
    'Thanks for making me awesome!',
    'I know you have big plans for me!',
    'Let me hear your words every day!',
    'You taste so good, Lord!',
    'No fear—just your power!',
    'You\'re good forever—yay!',
    'You\'re my helper—no worries!',
    'Make my heart happy in you!',
    'I give you my worries—you care!',
    'Lift my eyes up—help\'s coming!',
    'Let my light shine bright!',
    'You\'re my rock—I\'m safe!',
    'Wait on you—I\'ll fly high!',
    'Make me laugh and feel better!',
    'Show me the best path, God!',
    'Thank You for this day—help me rejoice!',
    'Jesus, I love You because You first loved me!',
    'God, You are my safe place. Thank You!',
    'Lord, fill me with joy and strength today!',
    'Lord, You are my light. I am not afraid!',
    'Thank You, God, for loving the whole world!',
    'God, help me do good and seek peace!',
    'God, being with You makes me so happy!',
    'God, I come to You when I am tired. Thank You!',
    'Lord, help me follow Your way!',
    'Lord, keep me safe from evil today!',
    'Jesus, help me stand strong in the faith!',
    'God, fill me with joy and peace today!',
    'Thank You for Your angels watching over me!',
    'Jesus, help me have faith in what I cannot see!',
    'Lord, I give You my worries. You care for me!',
    'Hey God, give me perfect peace when I think on You!',
    'Nothing can separate me from Your love—thanks!',
    'Help me wait and be brave, Lord!',
    'I\'ll pray about everything—no worries!',
    'Your peace guards my heart—thank You!',
    'Show me the way to go, God!',
    'I give You my plans—guide my thoughts!',
    'I trust You with my path, Lord!',
    'You\'re with me through deep waters—thanks!',
    'You\'re good to everyone—yay!',
    'You\'re like a loving Dad—thank You!',
    'I\'ll ask and seek—You answer!',
    'I\'ll praise You with my whole heart!',
    'Let my words be good, Lord!',
    'You\'re my strength and shield—thanks!',
    'Make me brave and strong, God!',
    'Your word is right and true!',
    'I\'ll wait for You, Lord—You hear me!',
    'I\'ll hope in You and praise You!',
    'I give You my burdens—You hold me!',
    'I\'ll sing of Your power and mercy!',
    'When I\'m overwhelmed, I cry to You!',
    'I wait on You alone, God!',
    'You hear my prayers—bless You!',
    'You load me with good things every day!',
    'I\'ll hope and praise You more and more!',
    'You\'re the strength of my heart forever!',
    'You\'re good and ready to forgive!',
    'Teach me to use my days wisely!',
    'Your comfort makes my soul happy!',
    'I won\'t forget all Your benefits!',
    'You crown me with love—thanks!',
    'Thanks for being good, Lord!',
    'You\'re on my side—I won\'t fear!',
    'You\'re my strength and my song!',
    'Help me hide Your word in my heart!',
    'Your word gives me comfort!',
    'Show me Your mercy, Lord!',
    'I love Your law—great peace!',
    'You won\'t let my foot slip!',
    'Keep my going out and coming in!',
    'You answered when I cried—thanks!',
    'Let me hear Your love in the morning!',
    'You\'re near when I call—yay!',
    'Heal broken hearts, Lord—including mine!',
    'Let everything that breathes praise You!',
    'Give me wisdom, Lord!',
    'Help me guard my heart!',
    'A good word makes me glad!',
    'Keep my heart healthy, God!',
    'Help me give soft answers!',
    'Your eyes see everything—You\'re with me!',
    'Direct my steps, Lord!',
    'Your name is my strong tower!',
    'Bless my family, God!',
    'Help me choose a good name!',
    'I trust You—You make me strong!',
    'You\'re my strength forever!',
    'Be my arm every morning, Lord!',
    'Give power to the weak—that\'s me sometimes!',
    'I\'m precious to You—thanks!',
    'You\'ve got me written on Your hands!',
    'Your kindness never leaves me!',
    'Help me seek You while I can!',
    'Guide me and fill me up, Lord!',
    'Blessed are those who trust You!',
    'You love me with an everlasting love!',
    'Your mercies are new every morning!',
    'You\'re my strong hold in trouble!',
    'You\'re mighty to save—thank You!',
    'I\'m the light of the world—help me shine!',
    'Help me love my enemies, Jesus!',
    'I\'ll seek Your kingdom first!',
    'Help me treat others like I want to be treated!',
    'You\'re with us when we gather—thanks!',
    'I believe—give me what I ask!',
    'All things are possible with You!',
    'With You nothing is impossible!',
    'I\'ll pray and believe, Lord!',
    'Help me do to others as I\'d want done!',
    'I\'ll give—You give back more!',
    'Don\'t fear, little flock—thanks!',
    'I received You—I\'m Your child!',
    'You\'re the bread of life—I\'ll never hunger!',
    'You\'re the light—I won\'t walk in darkness!',
    'You\'re my good shepherd—thanks!',
    'You give eternal life—I\'ll never perish!',
    'You\'re the resurrection and the life!',
    'Help me love others like You said!',
    'Don\'t let my heart be troubled!',
    'You\'re the way, truth, and life!',
    'Help me love others as You loved me!',
    'You overcame the world—I can be brave!',
    'Your love is in my heart!',
    'If You\'re for me, who can be against me?',
    'I\'m more than a conqueror through You!',
    'Help me rejoice in hope and pray!',
    'I\'m Yours whether I live or die!',
    'Love is patient and kind—help me be that!',
    'Faith, hope, love—greatest is love!',
    'Renew me inside every day!',
    'I walk by faith, not by sight!',
    'Your grace is enough when I\'m weak!',
    'Fill me with Your fruit—love, joy, peace!',
    'Don\'t let me get tired of doing good!',
    'I\'m Your workmanship—made for good works!',
    'Help me be kind and forgiving!',
    'I\'ll put on Your armor, Lord!',
    'You\'ll finish the good work in me!',
    'You work in me to do Your will!',
    'I\'ll rejoice in You always!',
    'Help me think on good things!',
    'You supply all I need—thanks!',
    'Clothe me with mercy and kindness!',
    'Help me obey my parents!',
    'Comfort and build up others!',
    'I\'ll rejoice evermore!',
    'Help me pray without ceasing!',
    'You\'re faithful to keep me from evil!',
    'I\'m young but I can be an example!',
    'Help me study to please You!',
    'I\'ll come boldly to Your throne!',
    'I\'ll hold fast to my faith!',
    'I\'m looking to Jesus!',
    'Give me wisdom when I ask!',
    'Every good gift is from You!',
    'Draw near to me as I draw near to You!',
    'I\'m chosen and special—thanks!',
    'Help me be ready to share about You!',
    'Let me love others a lot!',
    'You forgive when I confess—thanks!',
    'What amazing love You\'ve given me!',
    'Greater are You in me than the world!',
    'Help me love others—love is from You!',
    'Perfect love casts out fear!',
    'You hear when I ask according to Your will!',
    'You\'re knocking—I\'ll let You in!',
    'Help me walk in Your ways!',
    'I\'ll sleep in peace—You keep me safe!',
    'You hear my voice in the morning!',
    'You receive my prayer—thanks!',
    'You save the upright—thank You!',
    'Even kids can show Your strength!',
    'You hear the humble—prepare my heart!',
    'You love righteousness!',
    'Your words are pure!',
    'I trust Your mercy—my heart rejoices!',
    'You\'re with the righteous!',
    'You hear me when I call!',
    'Grant my heart\'s desires!',
    'My family trusted You—You delivered!',
    'Show me Your ways, Lord!',
    'Lead me in Your truth!',
    'I trust You—I won\'t slip!',
    'Give strength and peace to Your people!',
    'Joy comes in the morning!',
    'You\'re my rock and fortress!',
    'Your eye is on those who fear You!',
    'You delivered me from my fears!',
    'Your angel camps around me!',
    'There\'s no want for those who fear You!',
    'My soul is joyful in You!',
    'Your mercy is huge!',
    'I\'ll trust You and do good!',
    'I\'ll rest and wait for You!',
    'You order my steps!',
    'You never forsake the righteous!',
    'You save the righteous!',
    'You put a new song in my mouth!',
    'Blessed is the one who trusts You!',
    'Bless those who care for the poor!',
    'Send Your light and truth to lead me!',
    'You\'re my exceeding joy!',
    'I\'ll praise Your name all day!',
    'You\'re my God forever—my guide!',
    'I\'ll call on You in trouble!',
    'Create a clean heart in me!',
    'I trust Your mercy forever!',
    'You\'re my helper!',
    'I\'ll call on You—You\'ll save me!',
    'I won\'t fear what people can do!',
    'You perform all things for me!',
    'You\'re my defence—I\'ll wait on You!',
    'I\'ll sing to You—You\'re my strength!',
    'You\'re my shelter and strong tower!',
    'My salvation comes from You!',
    'You\'re my rock and salvation!',
    'I\'ll seek You early!',
    'Your love is better than life!',
    'The righteous trust in You!',
    'You choose me to come near!',
    'Bless our God, everyone!',
    'You give strength to Your people!',
    'The humble seek You and live!',
    'Let those who seek You rejoice!',
    'You\'re my hope from my youth!',
    'Fill my mouth with Your praise!',
    'You do wondrous things!',
    'You work salvation!',
    'I give You thanks!',
    'You\'re glorious and excellent!',
    'You do wonders!',
    'We\'ll tell the next generation Your praise!',
    'We\'re Your sheep—thanks forever!',
    'Shine on us and save us!',
    'Open my mouth and fill it!',
    'Defend the poor and needy!',
    'You\'re my sun and shield!',
    'Revive us that we may rejoice!',
    'You\'re full of compassion!',
    'Glorious things are spoken of You!',
    'I cry to You in the morning!',
    'I\'ll sing of Your mercies forever!',
    'Blessed are those who know Your joy!',
    'You\'re God from everlasting!',
    'Satisfy us with Your mercy!',
    'I dwell in Your secret place!',
    'You\'re my refuge and fortress!',
    'It\'s good to give You thanks!',
    'You\'ve made me glad!',
    'You\'re mightier than the waters!',
    'Your mercy held me up!',
    'Let\'s sing to You!',
    'We\'re the sheep of Your hand!',
    'Sing to You a new song!',
    'Bless Your name—show Your salvation!',
    'Light and gladness for the upright!',
    'You\'ve done marvellous things!',
    'You\'re great and high above all!',
    'Make a joyful noise!',
    'Serve You with gladness!',
    'You made us—we\'re Yours!',
    'Enter with thanksgiving!',
    'I\'ll sing of mercy to You!',
    'You regard the prayer of the needy!',
    'Bless You, O my soul!',
    'You forgive and heal!',
    'You satisfy with good things!',
    'You\'re merciful and gracious!',
    'Your mercy is as high as heaven!',
    'You\'ve removed my sins far away!',
    'Your mercy is everlasting!',
    'You\'re very great!',
    'I\'ll sing to You as long as I live!',
    'Give thanks and make known Your deeds!',
    'Praise You—You\'re good!',
    'Praise You for Your wonderful works!',
    'You satisfy the hungry soul!',
    'My heart is fixed—I\'ll sing!',
    'Your mercy is great!',
    'I\'ll praise You with my mouth!',
    'I\'ll praise You with my whole heart!',
    'You\'re gracious and full of compassion!',
    'Blessed is the one who fears You!',
    'Light rises for the upright!',
    'Blessed be Your name forever!',
    'Your name is to be praised!',
    'You\'re mindful of us!',
    'I love You because You heard me!',
    'I\'ll call on You as long as I live!',
    'You\'re gracious and merciful!',
    'Return to rest—You\'ve been good!',
    'Praise You, all nations!',
    'Your kindness is great!',
    'Thanks—You\'re good!',
    'You answered me in distress!',
    'Better to trust You than people!',
    'I\'ll live and declare Your works!',
    'You heard me—You\'re my salvation!',
    'This is Your doing—marvellous!',
    'You\'re my God—I\'ll praise You!',
    'Thanks—Your mercy endures forever!',
    'Help me cleanse my way by Your word!',
    'Open my eyes to see Your wonders!',
    'Help me understand Your precepts!',
    'Strengthen me according to Your word!',
    'Enlarge my heart to run Your way!',
    'I\'ll walk in liberty—I seek Your precepts!',
    'You\'ve dealt well with me!',
    'I\'ve kept Your word now!',
    'You\'re good—teach me!',
    'You made me—give me understanding!',
    'Your word is settled forever!',
    'I won\'t forget Your precepts!',
    'I love Your law—I meditate all day!',
    'Your words are sweeter than honey!',
    'You\'re my hiding place and shield!',
    'Uphold me according to Your word!',
    'Your words give light!',
    'Order my steps in Your word!',
    'Your word is very pure!',
    'Your word is true forever!',
    'I rejoice at Your word!',
    'Let my soul live and praise You!',
    'You never sleep—You keep Israel!',
    'You\'re my keeper and my shade!',
    'Sun and moon won\'t hurt me!',
    'Our help is in Your name!',
    'Those who trust You won\'t be moved!',
    'Our mouth filled with laughter!',
    'You\'ve done great things for us!',
    'You give Your beloved sleep!',
    'Blessed are those who fear You!',
    'I wait for You—I hope in Your word!',
    'With You there is mercy!',
    'Israel hopes in You forever!',
    'How good when we dwell together!',
    'Lift my hands and bless You!',
    'Praise You—You\'re good!',
    'Thanks—Your mercy endures forever!',
    'Revive me when I\'m in trouble!',
    'Your thoughts toward me are precious!',
    'You lift up those who fall!',
    'Help me walk in wisdom today!',
    'You\'re my portion forever!',
    'Fill me with Your Spirit\'s fruit!',
    'I\'ll trust You with my whole heart!',
    'You\'re my deliverer—thanks!',
    'Keep me in perfect peace!'
  ];

  const BADGES = [
    { id: 'faith-fighter', label: 'Faith Fighter', days: 1 },
    { id: 'bible-boss', label: 'Bible Boss', days: 3 },
    { id: 'faith-hero', label: 'Faith Hero', days: 7 },
    { id: 'brave-heart', label: 'Brave Heart', days: 14 }
  ];

  const KIDS_REMIND_OPTED_KEY = 'kidsRemindOpted';
  const FAITH_TRAIL_STOPS = [
    { day: 1, icon: '🌟', label: 'Day 1' },
    { day: 2, icon: '💪', label: 'Day 2' },
    { day: 3, icon: '📖', label: 'Day 3' },
    { day: 4, icon: '🙏', label: 'Day 4' },
    { day: 5, icon: '❤️', label: 'Day 5' },
    { day: 6, icon: '⚔️', label: 'Day 6' },
    { day: 7, icon: '🏆', label: 'Day 7' }
  ];

  function getDailyKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function getNextVerseIndex() {
    var index = 0;
    try {
      index = parseInt(localStorage.getItem(KIDS_VERSE_INDEX_KEY), 10) || 0;
    } catch (e) {}
    return index % KIDS_VERSES.length;
  }

  /** Bible story carousels — 3-panel comic strips + optional video. Cycle weekly: one story per week (up to 52). */
  var bibleStories = {
    david: {
      title: 'David & Goliath',
      panels: [
        { src: 'panel-david-1.svg', alt: 'David as shepherd boy – Small but faithful' },
        { src: 'panel-david-2.svg', alt: 'David faces Goliath – God is bigger than any giant' },
        { src: 'panel-david-3.svg', alt: "David wins with God's help – One stone, one faith" }
      ],
      caption: 'Swipe to see how God helped David be brave! ⚔️',
      videoId: 'QuLN7IWFJNY',
      videoTitle: 'David and Goliath – Animated!',
      keywords: ['david', 'goliath', 'brave', 'battle', 'shepherd', 'slingshot'],
      kjvRef: '1 Samuel 17',
      kidContext: { who: 'David', to: 'Goliath (and us)', apply: "David was small, but he trusted God. Goliath was a giant who made everyone afraid. David said, 'The battle is the Lord\'s!' He took five stones and his sling. One stone hit Goliath, and God gave the victory. When your giant feels too big—fear, worry, or a bully—remember: God is bigger. Be brave. He fights for you." },
      narration: "David and Goliath – 1 Samuel 17. Goliath was a huge giant. He shouted at God's army every day. Everyone was scared—except David. David was young and small, but he knew God. He said, 'Who is this giant? The Lord will deliver him into my hand.' David ran toward Goliath with a sling and five stones. He swung once—and the stone hit Goliath. The giant fell. God gave David the victory! For you: Your giants might be fear, worry, or someone who hurts you. God is bigger. Trust Him and be brave."
    },
    noah: {
      title: "Noah's Ark",
      panels: [
        { src: 'panel-noah-1.svg', alt: "Noah building the huge ark – Obeying God's instructions" },
        { src: 'panel-noah-2.svg', alt: 'Animals marching two by two into the ark – God saves His creation' },
        { src: 'panel-noah-3.svg', alt: "Rainbow in the sky after the flood – God's promise never to flood the earth again" }
      ],
      caption: "Swipe to see God's promise with Noah and the rainbow! 🌈",
      videoId: 'qzYjy6lhRag',
      videoTitle: "Noah's Ark – Animated!",
      keywords: ['noah', 'ark', 'rainbow', 'promise', 'flood', 'animals'],
      kjvRef: 'Genesis 6–9',
      kidContext: { who: 'God', to: 'Noah and his family', apply: "God told Noah to build the ark and save the animals. Noah obeyed, even when it seemed strange. God kept His promise to protect them and gave a rainbow as a sign. When things feel scary or hard, remember: God keeps His promises to you too! You can trust Him every day." },
      narration: "Noah's Ark – Genesis 6 to 9. Long ago, people were doing bad things. God was sad, but Noah was a good man who walked with God. God told Noah, 'Build a big boat called an ark.' Noah obeyed and built it just right. God sent animals two by two into the ark—elephants, lions, birds, everything! Noah's family went in too. God shut the door. Then it rained for 40 days and nights. Water covered the whole earth. But everyone in the ark was safe. After many months, the water went down. Noah sent a dove—it came back with an olive leaf! Plants were growing again. God said, 'Never again will I flood the whole earth.' He put a beautiful rainbow in the sky as His promise. God keeps His promises! For you: When you obey God, even when it's hard or takes a long time, He protects you and gives new beginnings. Trust Him today."
    },
    jesus: {
      title: 'Jesus the Good Shepherd',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus the good shepherd' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus calling the children' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus loves you!' }
      ],
      caption: 'Swipe to see Jesus loving the children and being our shepherd! ❤️',
      videoId: '8qPP0SgxAvw',
      videoTitle: 'Jesus the Good Shepherd – Animated!',
      keywords: ['jesus', 'shepherd', 'children', 'love', 'lamb'],
      kjvRef: 'John 10',
      kidContext: { who: 'Jesus', to: 'The children (and you!)', apply: 'Jesus wants YOU! Come to Him—He loves you like a shepherd loves his sheep!' }
    },
    jonah: {
      title: 'Jonah & the Big Fish',
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Jonah running away on a ship – Disobeying God' },
        { src: 'panel-jonah-2.svg', alt: 'Big fish swallowing Jonah – God gets his attention' },
        { src: 'panel-jonah-3.svg', alt: 'Jonah praying inside the fish – God hears and forgives' }
      ],
      caption: 'Swipe to see Jonah learn to obey God! 🐋',
      videoId: 'WOSadLyqshg',
      videoTitle: "Jonah and the Fish – Saddleback Kids!",
      keywords: ['jonah', 'whale', 'fish', 'obey', 'nineveh'],
      kjvRef: 'Jonah 1:17',
      kidContext: { who: 'God', to: 'Jonah (and us)', apply: "Jonah ran from God, but God sent a big fish to swallow him. Jonah prayed, and God saved him. Jonah learned to obey. God gives us second chances too! When you make a mistake, pray and turn back to God—He loves you and forgives." },
      narration: "Jonah Whale – Jonah 1:17. God told Jonah, 'Go to Nineveh and tell the people to turn from their bad ways.' Jonah didn't want to, so he ran away on a ship. A big storm came. Jonah said, 'Throw me into the sea.' The sailors did, and a huge fish swallowed Jonah. Inside the fish for three days, Jonah prayed and said sorry. God made the fish spit Jonah out on dry land. God gave Jonah a second chance and sent him to Nineveh again. The people listened and turned to God! God gives second chances! For you: If you run from God or make a mistake, pray and say sorry. He forgives and gives you a new start."
    },
    daniel: {
      title: 'Daniel & the Lions',
      panels: [
        { src: 'panel-daniel-1.svg', alt: "Daniel praying at his window – Staying faithful to God" },
        { src: 'panel-daniel-2.svg', alt: "Daniel thrown into the lions' den – Facing danger bravely" },
        { src: 'panel-daniel-3.svg', alt: "Daniel safe among the lions – God shuts their mouths" }
      ],
      caption: 'Swipe to see God protect Daniel! 🦁',
      videoId: 'odcRHDqcVlc',
      videoTitle: "Daniel and the Lions' Den – God's Story!",
      keywords: ['daniel', 'lion', 'lions', 'den', 'pray', 'protect'],
      kjvRef: 'Daniel 6:22',
      kidContext: { who: 'God', to: 'Daniel (and us)', apply: "Daniel prayed to God even when it was against the law. God sent an angel to shut the lions' mouths. Daniel was safe all night! When you stand up for what's right and trust God, He is with you and protects you, just like He did for Daniel." },
      narration: "Daniel and the Lions – Daniel 6:22. Daniel loved God and prayed every day. Some bad men tricked the king into making a law: 'No one can pray to anyone but the king.' Daniel kept praying to God anyway. The king was sad, but he had to throw Daniel into the lions' den. The king worried all night. In the morning, Daniel was safe! God sent an angel to shut the lions' mouths. Daniel said, 'My God sent his angel and shut the lions' mouths.' God protects those who trust Him! For you: When it's hard to do the right thing, pray and trust God. He is with you and keeps you safe."
    },
    adamEve: {
      title: 'Adam & Eve',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Adam and Eve in the garden' },
        { src: 'panel-jesus-2.svg', alt: 'The serpent and the apple' },
        { src: 'panel-jesus-3.svg', alt: 'God still loves them' }
      ],
      caption: 'Swipe to see the first family in God\'s garden! 🌳',
      videoId: 'l7TDvJrjjz0',
      videoTitle: 'Adam and Eve – Saddleback Kids!',
      keywords: ['adam', 'eve', 'garden', 'apple', 'hide', 'eden', 'creation'],
      kjvRef: 'Genesis 3',
      kidContext: { who: 'God', to: 'Adam and Eve (the first people)', apply: 'God made you special! Even when we make mistakes, He still loves us.' }
    },
    cainAbel: {
      title: 'Cain & Abel',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Cain and Abel bring offerings' },
        { src: 'panel-jesus-2.svg', alt: 'God is pleased with Abel' },
        { src: 'panel-jesus-3.svg', alt: 'God warns Cain about anger' }
      ],
      caption: 'Swipe to see why giving our best to God matters! 🐑',
      videoId: 'vT8Yjc-4es8',
      videoTitle: "Cain and Abel – Bible Story for Kids!",
      keywords: ['cain', 'abel', 'jealousy', 'offering', 'brothers'],
      kjvRef: 'Genesis 4',
      kidContext: { who: 'God', to: 'Cain and Abel (first brothers)', apply: 'Give God your best! When you feel jealous, talk to God instead of getting angry.' }
    },
    towerBabel: {
      title: 'Tower of Babel',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'People build a tall tower' },
        { src: 'panel-noah-2.svg', alt: 'God mixes up their words' },
        { src: 'panel-noah-3.svg', alt: 'Everyone speaks different languages' }
      ],
      caption: 'Swipe to see how God made many languages! 🌍',
      videoId: '4EQh7C-IUcM',
      videoTitle: 'Tower of Babel – Bible Stories for Kids!',
      keywords: ['babel', 'tower', 'confusion', 'languages', 'babylon'],
      kjvRef: 'Genesis 11',
      kidContext: { who: 'God', to: 'The people building the tower', apply: 'God is bigger than any tower! He made all the languages—that\'s why we have so many ways to talk!' }
    },
    abrahamIsaac: {
      title: 'Abraham & Isaac',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Abraham and Isaac walk up the mountain' },
        { src: 'panel-jesus-2.svg', alt: 'Abraham trusts God' },
        { src: 'panel-jesus-3.svg', alt: 'God provides a ram!' }
      ],
      caption: 'Swipe to see Abraham trust God—and God provide! 🐏',
      videoId: '8QTk848O-yQ',
      videoTitle: 'Abraham and Isaac – Bible Stories for Kids!',
      keywords: ['abraham', 'isaac', 'sacrifice', 'ram', 'trust', 'faith'],
      kjvRef: 'Genesis 22',
      kidContext: { who: 'God', to: 'Abraham (father of faith)', apply: 'When you trust God, He takes care of you. Abraham obeyed—and God provided!' }
    },
    josephCoat: {
      title: "Joseph & the Coat",
      panels: [
        { src: 'panel-david-1.svg', alt: "Joseph wearing his coat of many colors – Loved by his father" },
        { src: 'panel-david-2.svg', alt: "Brothers selling Joseph to traders – Jealousy turns to betrayal" },
        { src: 'panel-david-3.svg', alt: "Joseph as leader in Egypt – God turns bad into good" }
      ],
      caption: 'Swipe to see Joseph\'s dreams and his special coat! 🌈',
      videoId: 'MKW6ylouF1s',
      videoTitle: "Joseph's Coat of Many Colors – Bible Stories!",
      keywords: ['joseph', 'coat', 'dreams', 'brothers', 'colors'],
      kjvRef: 'Genesis 37:3',
      kidContext: { who: 'God', to: 'Joseph (Jacob\'s son)', apply: "Joseph's brothers were jealous of his special coat and dreams. They sold him into slavery, but God used it for good—Joseph became a leader in Egypt and saved his family. Even when bad things happen, God can turn them into something good. Trust Him with your hard days." },
      narration: "Joseph and the Coat – Genesis 37:3. Joseph had a beautiful coat of many colors from his dad. His brothers were jealous. Joseph had dreams that one day they would bow to him. The brothers got angry and sold Joseph to traders going to Egypt. Joseph worked hard in Egypt, but bad things kept happening—he was put in prison unfairly. But God was with Joseph. He helped interpret dreams and became second in command to Pharaoh. When a famine came, Joseph's brothers came to Egypt for food. Joseph forgave them and saved his whole family! God turned bad into good. For you: When people are mean or life feels unfair, remember God can use it for something good. Stay faithful—He has a plan."
    },
    josephSold: {
      title: 'Joseph Sold to Egypt',
      panels: [
        { src: 'panel-david-2.svg', alt: 'Joseph\'s brothers see him coming — anger and jealousy' },
        { src: 'panel-noah-1.svg', alt: 'Joseph alone in a pit — scary moment, God still sees him' },
        { src: 'panel-david-3.svg', alt: 'Merchants traveling toward Egypt — Joseph\'s hard road begins' }
      ],
      caption: 'Swipe to see a hard day for Joseph — God did not leave him! 🐪',
      videoId: '',
      videoTitle: '',
      keywords: ['joseph', 'sold', 'egypt', 'pit', 'brothers', 'genesis 37', 'ishmeelites', 'merchants'],
      kjvRef: 'Genesis 37:28',
      kidContext: { who: 'God', to: 'Joseph (hurt by his brothers)', apply: 'Joseph\'s brothers did something terribly wrong, but God stayed with Joseph. When people hurt you or life feels unfair, God sees you — He can still work good in His time.' }
    },
    mosesBush: {
      title: 'Moses & the Burning Bush',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Moses sees a bush on fire' },
        { src: 'panel-jesus-2.svg', alt: 'God calls Moses from the bush' },
        { src: 'panel-jesus-3.svg', alt: 'Moses takes his staff—God sends him' }
      ],
      caption: 'Swipe to see God call Moses from the burning bush! 🔥',
      videoId: 'bWcwZIV-ip8',
      videoTitle: "Moses and the Burning Bush – Bible Stories for Kids!",
      keywords: ['moses', 'bush', 'fire', 'staff', 'call', 'exodus 3', 'burning'],
      kjvRef: 'Exodus 3',
      kidContext: { who: 'God', to: 'Moses (in the desert)', apply: 'God called Moses from a burning bush! When God calls you, say yes—He will help you!' }
    },
    redSea: {
      title: 'Red Sea Crossing',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Israelites trapped by the Red Sea – Pharaoh's army chasing" },
        { src: 'panel-noah-2.svg', alt: "Moses stretching his hand over the sea – God parts the waters" },
        { src: 'panel-noah-3.svg', alt: "People walking on dry ground between walls of water – God makes a way" }
      ],
      caption: 'Swipe to see God make a way through the sea! 🌊',
      videoId: 'GYZh5eY6FGg',
      videoTitle: 'Moses Parts the Red Sea – Animated Bible Story!',
      keywords: ['moses', 'red sea', 'waters', 'part', 'exodus 14', 'egypt', 'escape'],
      kjvRef: 'Exodus 14:21',
      kidContext: { who: 'God', to: 'Moses and the Israelites', apply: "The Israelites were trapped between the Red Sea and the Egyptian army. God told Moses to stretch out his hand—the sea split open, and they walked through on dry ground. God makes a way even when there seems to be no way. Trust Him when you feel stuck—He will lead you through." },
      narration: "Moses Sea-Split – Exodus 14:21. The Israelites escaped Egypt, but Pharaoh chased them with his army. They were trapped—the Red Sea in front, soldiers behind. The people were afraid and cried to Moses. God said, 'Stretch out your hand over the sea.' Moses obeyed. A strong east wind blew all night, and the sea split in two! The Israelites walked on dry ground between walls of water. When the Egyptians followed, God closed the sea and saved His people. God makes a way! For you: When you feel trapped or don't know what to do, pray and trust God. He can make a path where there is none and lead you safely."
    },
    manna: {
      title: 'Manna from Heaven',
      panels: [
        { src: 'panel-jonah-1.svg', alt: "Israelites hungry in the desert – Complaining to Moses" },
        { src: 'panel-jonah-2.svg', alt: "Manna falling from heaven – God sends bread" },
        { src: 'panel-jonah-3.svg', alt: "People gathering manna each morning – God provides daily" }
      ],
      caption: 'Swipe to see God give bread from heaven! 🍞',
      videoId: 'Ln5Aa8jiEAM',
      videoTitle: 'Manna and Quail – Exodus 16 Bible Story!',
      keywords: ['manna', 'bread', 'heaven', 'desert', 'exodus 16', 'food', 'provide'],
      kjvRef: 'Exodus 16:15',
      kidContext: { who: 'God', to: 'The Israelites in the wilderness', apply: "God sent bread from heaven every morning for His people in the desert. They called it manna. God gives us what we need each day. When you worry about tomorrow, trust Him—He provides just enough, one day at a time." },
      narration: "Manna from Heaven – Exodus 16:15. The Israelites were hungry in the desert. They grumbled, but God said, 'I will rain bread from heaven for you.' Every morning, white flakes appeared on the ground like frost. It tasted like honey wafers! They called it manna. God told them to gather only what they needed for each day—no more, no less. On the sixth day they gathered extra for the Sabbath. God provided every morning! For you: God gives us what we need each day—food, strength, love. When you feel worried or empty, trust Him. He provides just enough, right when you need it."
    },
    tenCommandments: {
      title: 'Ten Commandments',
      panels: [
        { src: 'panel-david-1.svg', alt: "Moses on Mount Sinai – God speaks to him" },
        { src: 'panel-david-2.svg', alt: "God writing the Ten Commandments on stone tablets" },
        { src: 'panel-david-3.svg', alt: "Moses bringing the tablets down – God's good rules for His people" }
      ],
      caption: 'Swipe to see God give rules to keep us safe! 📜',
      videoId: 'P12cLzy1-3Q',
      videoTitle: 'The Ten Commandments – Bible Stories for Kids!',
      keywords: ['ten commandments', 'moses', 'mountain', 'tablets', 'exodus 20', 'rules', 'law'],
      kjvRef: 'Exodus 20:1-17',
      kidContext: { who: 'God', to: 'Moses and the Israelites', apply: "God gave Moses ten rules on stone tablets to help people love God and love others. They were good laws to live by. God's rules show us how to live happy and right. When you follow them, you honor God and treat people well." },
      narration: "Ten Commandments – Exodus 20:1-17. The Israelites came to Mount Sinai. God called Moses up the mountain. There, God spoke ten important rules and wrote them on stone tablets. The first four were about loving God: no other gods, no idols, honor His name, keep the Sabbath. The last six were about loving others: honor parents, no murder, no stealing, no lying, no wanting what others have. God gave these rules to help His people live good lives. For you: God's rules are like guardrails—they keep you safe and happy. Love God with all your heart, and love others like yourself. Following them makes life better."
    },
    goldenCalf: {
      title: 'The Golden Calf',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Israel waits at the mountain while Moses is with God' },
        { src: 'panel-david-2.svg', alt: 'A golden calf — the people worship wrongly' },
        { src: 'panel-david-3.svg', alt: 'Moses breaks the tablets — God still forgives His people' }
      ],
      caption: 'Swipe to see why we worship God alone! 🐂',
      videoId: '',
      videoTitle: '',
      keywords: ['golden calf', 'exodus 32', 'idol', 'moses', 'aaron', 'worship', 'sinai'],
      kjvRef: 'Exodus 32',
      kidContext: { who: 'God', to: 'Israel', apply: 'Impatience led to idolatry — wait for God and worship Him only.' }
    },
    spiesInCanaan: {
      title: 'Spies in Canaan',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Twelve spies see how good the land is' },
        { src: 'panel-noah-2.svg', alt: 'Huge grapes — ten spies are afraid of giants' },
        { src: 'panel-noah-3.svg', alt: 'Joshua and Caleb trust God to give the land' }
      ],
      caption: 'Swipe to see faith beat fear! 🍇',
      videoId: '',
      videoTitle: '',
      keywords: ['spies', 'canaan', 'numbers 13', 'joshua', 'caleb', 'grapes', 'giants'],
      kjvRef: 'Numbers 13',
      kidContext: { who: 'God', to: 'Israel', apply: 'Giants look big, but God is bigger — trust His promise.' }
    },
    samson: {
      title: 'Samson & His Strength',
      panels: [
        { src: 'panel-daniel-1.svg', alt: "Samson with long hair – Strong because of God" },
        { src: 'panel-daniel-2.svg', alt: "Delilah cutting Samson's hair – Losing his strength" },
        { src: 'panel-daniel-3.svg', alt: "Samson pushing the pillars – God gives power one last time" }
      ],
      caption: 'Swipe to see God give Samson strength! 💪',
      videoId: 'vnRAdASpsz4',
      videoTitle: "Samson and Delilah – Bible Lessons for Kids!",
      keywords: ['samson', 'hair', 'strength', 'pillars', 'judges 16', 'power', 'delilah'],
      kjvRef: 'Judges 16:30',
      kidContext: { who: 'God', to: 'Samson (a strong man)', apply: "Samson was super strong because God gave him power, but he didn't always use it wisely. In the end, he prayed for strength one last time and brought down the pillars to defeat the enemies. God gives us strength too—use it to help others and honor Him, not for selfish things." },
      narration: "Samson and the Pillars – Judges 16:30. Samson was born with special strength from God—no razor on his head. He fought bad guys and did amazing things. But Samson made mistakes and told his secret to Delilah. She cut his hair, and his strength left. The enemies captured him and made fun of him in their temple. Samson prayed, 'Lord, remember me and give me strength just this once.' God answered! Samson pushed the two middle pillars, and the whole building fell on the enemies and himself. God gave him power one last time. For you: God gives you strength in different ways. Use it to do good, help others, and follow Him—not for showing off or getting even."
    },
    fieryFurnace: {
      title: 'Fiery Furnace',
      panels: [
        { src: 'panel-daniel-1.svg', alt: "Three friends refusing to bow – Standing for God" },
        { src: 'panel-daniel-2.svg', alt: "Thrown into the fiery furnace – Heat so hot it kills soldiers" },
        { src: 'panel-daniel-3.svg', alt: "Four men walking in the fire – God protects His friends" }
      ],
      caption: 'Swipe to see God keep friends safe in the fire! 🔥',
      videoId: 'kAzX-Icrbm0',
      videoTitle: 'The Fiery Furnace – Shadrach, Meshach & Abednego!',
      keywords: ['fiery furnace', 'shadrach', 'meshach', 'abednego', 'fire', 'angel', 'daniel 3'],
      kjvRef: 'Daniel 3:25',
      kidContext: { who: 'God', to: 'Shadrach, Meshach, and Abednego', apply: "Shadrach, Meshach, and Abednego refused to bow to a statue. They were thrown into a hot furnace, but God walked with them and kept them safe. When you're in a tough or scary situation, God is right there with you—He never leaves you alone." },
      narration: "Fiery Furnace Three – Daniel 3:25. King Nebuchadnezzar made a huge gold statue and said everyone must bow to it or be thrown into a fiery furnace. Shadrach, Meshach, and Abednego loved God and said, 'We will not bow.' The king was furious and made the furnace seven times hotter. The soldiers who threw them in died from the heat. But the king looked in and saw four men walking around! The fourth looked like the Son of God. The three friends came out unharmed—no burns, no smoke smell. God was with them in the fire! For you: When you face hard times or pressure to do wrong, stand strong for God. He is with you in the fire and will protect you."
    },
    esther: {
      title: 'Esther Saves Her People',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Esther becomes queen – God puts her in place' },
        { src: 'panel-jesus-2.svg', alt: 'Esther goes to the king – Brave when it mattered' },
        { src: 'panel-jesus-3.svg', alt: 'God uses her to save the people – Such a time as this!' }
      ],
      caption: 'Swipe to see Esther be brave—God uses you! 👑',
      videoId: '7945Bh5iG_A',
      videoTitle: 'The Story of Esther – Bible Stories for Kids!',
      keywords: ['esther', 'queen', 'king', 'brave', 'save', 'such a time'],
      kjvRef: 'Esther 4',
      kidContext: { who: 'God', to: 'Esther (queen who saved her people)', apply: "Esther was chosen to be queen. When bad men wanted to hurt God's people, her uncle told her, 'Who knows? Maybe you were made queen for such a time as this.' Esther bravely went to the king and asked for help. God used her to save her people! You are where you are for a reason. Be brave when it matters." },
      narration: "Esther Saves Her People – Esther 4. Esther was a queen, but a bad man named Haman wanted to hurt all of God's people. Esther's uncle Mordecai said, 'Who knows? Maybe you were made queen for such a time as this.' Esther was scared—but she prayed and went to the king. She told him the truth. The king listened and stopped Haman. God used Esther to save her people! For you: God put you where you are for a reason. When it's hard to be brave, pray and step forward. He uses you."
    },
    jesusBirth: {
      title: 'Jesus Birth',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Mary and Joseph travel to Bethlehem' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus born in a manger' },
        { src: 'panel-jesus-3.svg', alt: 'Shepherds and angels celebrate!' }
      ],
      caption: 'Swipe to see Jesus come as a baby—God loves us! 🎄',
      videoId: 'v3656G6tWuI',
      videoTitle: 'The Story of Christmas – Jesus is Born!',
      keywords: ['jesus', 'birth', 'manger', 'shepherds', 'angels', 'bethlehem', 'luke 2', 'christmas'],
      kjvRef: 'Luke 2',
      kidContext: { who: 'God', to: 'The whole world', apply: 'Jesus came as a baby—God loves us! Christmas is about God\'s greatest gift!' }
    },
    jesusCalmsStorm: {
      title: 'Jesus Calms the Storm',
      panels: [
        { src: 'panel-jonah-1.svg', alt: "Storm raging on the lake – Disciples afraid in the boat" },
        { src: 'panel-jonah-2.svg', alt: "Jesus sleeping in the storm – Trusting God" },
        { src: 'panel-jonah-3.svg', alt: "Jesus speaking to the wind and waves – Peace, be still" }
      ],
      caption: 'Swipe to see Jesus calm the storm—trust Him! ⛵',
      videoId: 'uYLHqdSO9OY',
      videoTitle: 'Jesus Calms the Storm – Bible Story for Kids!',
      keywords: ['jesus', 'storm', 'boat', 'waves', 'peace', 'matthew 14', 'mark 4'],
      kjvRef: 'Mark 4:39',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: "The disciples were scared in a big storm, but Jesus spoke and the wind and waves obeyed Him. He asked them, 'Why are you so afraid?' Jesus is with you in every storm. When you feel scared, call on Him—He can bring peace." },
      narration: "Jesus Calms the Boat – Mark 4:39. Jesus and His disciples were crossing the lake in a boat. A huge storm came up—waves crashed, wind howled, and the boat was filling with water. The disciples were terrified and woke Jesus, saying, 'Master, don't You care that we are perishing?' Jesus stood up and said to the wind and waves, 'Peace, be still.' Immediately the wind stopped, and there was a great calm. Jesus asked them, 'Why are you so fearful? How is it that you have no faith?' The disciples were amazed—'Even the wind and sea obey Him!' For you: When life feels stormy or scary, Jesus is right there with you. Call on Him—He has power to bring peace to your heart."
    },
    jesusFeeds5000: {
      title: 'Jesus Feeds 5,000',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Big crowd, one boy with bread and fish' },
        { src: 'panel-noah-2.svg', alt: 'Jesus blesses the food' },
        { src: 'panel-noah-3.svg', alt: 'Everyone eats—baskets left over!' }
      ],
      caption: 'Swipe to see Jesus feed everyone—He cares! 🍞🐟',
      videoId: 'S6rj9cAJrWE',
      videoTitle: 'Jesus Feeds the 5,000 – Saddleback Kids!',
      keywords: ['jesus', 'feeds', '5000', 'bread', 'fish', 'miracle', 'matthew 14', 'john 6'],
      kjvRef: 'John 6',
      kidContext: { who: 'Jesus', to: 'The 5,000 people (and us)', apply: 'Jesus feeds everyone—He cares! Give God what you have—He can multiply it!' }
    },
    goodSamaritan: {
      title: 'Good Samaritan',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Man hurt on the road' },
        { src: 'panel-david-2.svg', alt: 'Samaritan stops to help' },
        { src: 'panel-david-3.svg', alt: 'Love your neighbor—help anyone!' }
      ],
      caption: 'Swipe to see the Good Samaritan help a stranger! 🤝',
      videoId: 'juBnHljnB0I',
      videoTitle: 'The Good Samaritan – Bible Story for Kids!',
      keywords: ['good samaritan', 'neighbor', 'help', 'stranger', 'bandage', 'luke 10'],
      kjvRef: 'Luke 10',
      kidContext: { who: 'Jesus', to: 'A man who asked "Who is my neighbor?"', apply: 'Love your neighbor—help anyone! Be kind to people who need you.' }
    },
    prodigalSon: {
      title: 'Prodigal Son',
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Son runs away with his money' },
        { src: 'panel-jonah-2.svg', alt: 'Son comes back sorry' },
        { src: 'panel-jonah-3.svg', alt: 'Father runs to welcome him home!' }
      ],
      caption: 'Swipe to see the father welcome his son home! 🏠',
      videoId: '29qEf9afdcA',
      videoTitle: 'The Prodigal Son – Bible Stories for Kids!',
      keywords: ['prodigal', 'son', 'run away', 'come back', 'party', 'forgiveness', 'luke 15'],
      kjvRef: 'Luke 15',
      kidContext: { who: 'Jesus', to: 'People who wondered if God forgives', apply: 'God welcomes you home! No matter what you did, come back—He runs to meet you!' }
    },
    zacchaeus: {
      title: 'Zacchaeus',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Zacchaeus climbs a tree to see' },
        { src: 'panel-david-2.svg', alt: 'Jesus looks up and sees him' },
        { src: 'panel-david-3.svg', alt: 'Jesus says: I\'m coming to your house!' }
      ],
      caption: 'Swipe to see Jesus call Zacchaeus—He sees you! 🌳',
      videoId: 'U-HjFU4wkUY',
      videoTitle: 'The Story of Zacchaeus – Bible Story for Kids!',
      keywords: ['zacchaeus', 'tree', 'short', 'jesus calls', 'luke 19', 'tax collector'],
      kjvRef: 'Luke 19',
      kidContext: { who: 'Jesus', to: 'Zacchaeus (a short man in a tree)', apply: 'Jesus sees you—even if you\'re small! He knows your name and wants to be your friend!' }
    },
    lazarus: {
      title: 'Lazarus Raised',
      panels: [
        { src: 'panel-jesus-1.svg', alt: "Mary and Martha sad – Lazarus is dead" },
        { src: 'panel-jesus-2.svg', alt: "Jesus at the tomb – Calling Lazarus out" },
        { src: 'panel-jesus-3.svg', alt: "Lazarus walking out alive – Jesus has power over death" }
      ],
      caption: 'Swipe to see Jesus give life—don\'t be sad! ✨',
      videoId: '1FT04jjh3Q8',
      videoTitle: 'Jesus Raised Lazarus – God\'s Story!',
      keywords: ['lazarus', 'raised', 'dead', 'come out', 'alive', 'john 11'],
      kjvRef: 'John 11:43-44',
      kidContext: { who: 'Jesus', to: 'Mary, Martha, and Lazarus', apply: "Lazarus was dead for 4 days, but Jesus called him out of the tomb. Lazarus came back to life! Jesus has power over death. When we feel sad or hopeless, Jesus can bring new life and hope. Trust Him—He is the resurrection and the life." },
      narration: "Lazarus Rise – John 11:43-44. Lazarus was very sick, and his sisters Mary and Martha sent for Jesus. But Jesus waited. When He arrived, Lazarus had died and was in the tomb for 4 days. Jesus went to the tomb and said, 'Lazarus, come forth!' Lazarus came out, still wrapped in grave clothes. Jesus said, 'Loose him, and let him go.' Everyone was amazed—Jesus has power over death! For you: When things feel dead or hopeless, Jesus can bring new life. He is the resurrection. Trust Him with your hardest days—He has power to make things new."
    },
    resurrection: {
      title: 'Resurrection',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Women go to the tomb' },
        { src: 'panel-jesus-2.svg', alt: 'Empty tomb—stone rolled away!' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus is alive—He lives forever!' }
      ],
      caption: 'Swipe to see Jesus beat death—He lives forever! 🕊️',
      videoId: '2_dKPsPDXGM',
      videoTitle: 'Jesus Rose from the Grave – Kids Club Bible Story!',
      keywords: ['resurrection', 'empty tomb', 'alive', 'easter', 'matthew 28', 'john 20'],
      kjvRef: 'Matthew 28',
      kidContext: { who: 'God', to: 'The whole world', apply: 'Jesus beat death—He lives forever! That\'s why we celebrate Easter—He won!' }
    },
    creation: {
      title: 'Creation',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'God says: Let there be light!' },
        { src: 'panel-noah-2.svg', alt: 'God makes animals and people' },
        { src: 'panel-noah-3.svg', alt: 'God rests—He made everything!' }
      ],
      caption: 'Swipe to see God make the world! 🌍',
      videoId: 'teu7BCZTgDs',
      videoTitle: 'Creation (Genesis 1-2) – Saddleback Kids!',
      keywords: ['creation', 'genesis 1', 'light', 'animals', 'rest', 'god made'],
      kjvRef: 'Genesis 1',
      kidContext: { who: 'God', to: 'Everyone', apply: 'God made everything—wow! You are part of His amazing creation!' }
    },
    fallOfJericho: {
      title: 'Fall of Jericho',
      panels: [
        { src: 'panel-david-1.svg', alt: "Israelites marching around Jericho – Obeying God's strange plan" },
        { src: 'panel-david-2.svg', alt: "Trumpets blowing on day 7 – Time to shout" },
        { src: 'panel-david-3.svg', alt: "Walls of Jericho falling down – God gives victory" }
      ],
      caption: 'Swipe to see God make the walls fall—trust Him! 🏛️',
      videoId: 'Ertlm3D9Cfs',
      videoTitle: 'The Walls of Jericho – Bible Story for Kids!',
      keywords: ['jericho', 'walls', 'trumpets', 'joshua 6', 'march', 'obey'],
      kjvRef: 'Joshua 6:20',
      kidContext: { who: 'God', to: 'Joshua and the Israelites', apply: "God told Joshua to march around Jericho for 7 days, blow trumpets, and shout. It seemed strange, but they obeyed. The walls fell down! When God asks you to do something that doesn't make sense, obey—He has a reason and will make it work." },
      narration: "Fall of Jericho – Joshua 6:20. The Israelites came to Jericho, a strong city with big walls. God told Joshua, 'March around the city once a day for 6 days. On day 7, march 7 times, blow trumpets, and shout!' The people obeyed, even though it seemed weird. On day 7, they marched, trumpets blew, they shouted—and the walls fell flat! The Israelites marched in and took the city. God gave them the victory because they obeyed. For you: Sometimes God asks us to do things that seem odd or hard. Trust Him and obey. He makes impossible things happen when we follow His way."
    },
    davidSheep: {
      title: 'David & the Sheep',
      panels: [
        { src: 'panel-david-1.svg', alt: 'David watches his sheep' },
        { src: 'panel-david-2.svg', alt: 'David fights lion and bear' },
        { src: 'panel-david-3.svg', alt: 'David plays harp—God protects!' }
      ],
      caption: 'Swipe to see David protect sheep—God protects us! 🐑',
      videoId: 'N5zP9YxUaLI',
      videoTitle: 'David, Lion & Bear – Bible Stories for Kids!',
      keywords: ['david', 'sheep', 'shepherd', 'harp', 'lion', '1 samuel 17'],
      kjvRef: '1 Samuel 17',
      kidContext: { who: 'David', to: 'King Saul (and us)', apply: 'David protected sheep—God protects us! Like a shepherd cares for his flock!' }
    },
    elijahFire: {
      title: 'Elijah & Fire',
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Elijah vs prophets of Baal' },
        { src: 'panel-jonah-2.svg', alt: 'Baal does nothing' },
        { src: 'panel-jonah-3.svg', alt: 'God sends fire—He\'s real!' }
      ],
      caption: 'Swipe to see God answer with fire—He\'s real! 🔥',
      videoId: 'dKcQHonmOi8',
      videoTitle: 'Elijah and the Prophets of Baal – Bible Story!',
      keywords: ['elijah', 'baal', 'fire', 'carmel', '1 kings 18', 'altar'],
      kjvRef: '1 Kings 18',
      kidContext: { who: 'God', to: 'Elijah and all Israel', apply: 'God answers with fire—He\'s real! The LORD is God—trust Him alone!' }
    },
    elishaOil: {
      title: 'Elisha & the Widow\'s Oil',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Widow has only a little oil' },
        { src: 'panel-noah-2.svg', alt: 'Elisha says: pour into jars' },
        { src: 'panel-noah-3.svg', alt: 'Oil multiplies—God provides!' }
      ],
      caption: 'Swipe to see God multiply oil—He provides! 🫙',
      videoId: '6E2WJ0vp4g4',
      videoTitle: 'Elisha and the Widow\'s Oil – Animated Bible Story!',
      keywords: ['elisha', 'oil', 'widow', '2 kings 4', 'multiply', 'jar'],
      kjvRef: '2 Kings 4',
      kidContext: { who: 'God', to: 'The widow through Elisha', apply: 'God multiplies—He provides! Give God what you have—He can do more!' }
    },
    naaman: {
      title: 'Naaman & the River',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Naaman has leprosy' },
        { src: 'panel-jesus-2.svg', alt: 'Elisha says: dip in Jordan' },
        { src: 'panel-jesus-3.svg', alt: 'Naaman obeys—healed!' }
      ],
      caption: 'Swipe to see Naaman obey—get healed! 💧',
      videoId: '8Y1Sh5bZAiM',
      videoTitle: "God's Story: Naaman – Bible Story for Kids!",
      keywords: ['naaman', 'river', 'leprosy', 'dip', 'jordan', '2 kings 5', 'elisha'],
      kjvRef: '2 Kings 5',
      kidContext: { who: 'God', to: 'Naaman (through Elisha)', apply: 'Obey God—get healed! Even when it seems simple, do what He says!' }
    },
    jesusWalksWater: {
      title: 'Jesus Walks on Water',
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Disciples in boat, big waves' },
        { src: 'panel-jonah-2.svg', alt: 'Jesus walks on the water' },
        { src: 'panel-jonah-3.svg', alt: 'Peter walks too—Jesus lifts us!' }
      ],
      caption: 'Swipe to see Jesus walk on waves—He lifts us! 🌊',
      videoId: 'U69Ag6wEyB0',
      videoTitle: 'Jesus Walks on Water – Stories of the Bible!',
      keywords: ['jesus', 'walks', 'water', 'peter', 'waves', 'matthew 14'],
      kjvRef: 'Matthew 14',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Jesus walks on waves—He lifts us! Keep your eyes on Him—don\'t be afraid!' }
    },
    lostSheep: {
      title: 'Lost Sheep',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Shepherd has 100 sheep' },
        { src: 'panel-jesus-2.svg', alt: 'One is lost—he goes to find it' },
        { src: 'panel-jesus-3.svg', alt: 'Found! Jesus finds lost sheep!' }
      ],
      caption: 'Swipe to see Jesus find the lost sheep—you\'re never lost! 🐑',
      videoId: 'CLpq2K-Jf0M',
      videoTitle: 'The Parable of the Lost Sheep – Animated Bible Story!',
      keywords: ['lost sheep', 'parable', 'shepherd', 'luke 15', 'find', 'rejoice'],
      kjvRef: 'Luke 15',
      kidContext: { who: 'Jesus', to: 'People who wondered about God\'s love', apply: 'Jesus finds lost sheep—you\'re never lost! God searches for you!' }
    },
    palmSunday: {
      title: 'Palm Sunday',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus rides a donkey' },
        { src: 'panel-jesus-2.svg', alt: 'People wave palm branches' },
        { src: 'panel-jesus-3.svg', alt: 'Hosanna! Welcome the King!' }
      ],
      caption: 'Swipe to see Jesus ride the donkey—welcome Him! 🌿',
      videoId: 'PCqqhfltyKM',
      videoTitle: 'Palm Sunday – Jesus Enters Jerusalem!',
      keywords: ['palm sunday', 'hosanna', 'donkey', 'jerusalem', 'matthew 21', 'luke 19'],
      kjvRef: 'Matthew 21',
      kidContext: { who: 'The crowds', to: 'Jesus (the King)', apply: 'Hosanna! Jesus rides the donkey—welcome Him! He is the King of Kings!' }
    },
    lastSupper: {
      title: 'Last Supper',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus and the disciples at table' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus breaks bread' },
        { src: 'panel-jesus-3.svg', alt: 'This is My body—He loves us!' }
      ],
      caption: 'Swipe to see Jesus share bread—He loves us! 🍞',
      videoId: 'y-SrXeZcVhU',
      videoTitle: 'The Last Supper – Sharefaith Kids!',
      keywords: ['last supper', 'bread', 'wine', 'luke 22', 'matthew 26', 'passover'],
      kjvRef: 'Luke 22',
      kidContext: { who: 'Jesus', to: 'His twelve disciples', apply: 'Jesus shares bread—He loves us! Remember Him when you eat together!' }
    },
    jesusTemptation: {
      title: "Jesus' Temptation",
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Jesus in the desert, hungry' },
        { src: 'panel-jonah-2.svg', alt: 'Devil tempts Him' },
        { src: 'panel-jonah-3.svg', alt: 'Jesus says no—uses God\'s word!' }
      ],
      caption: "Swipe to see Jesus say no—use God's word! 📖",
      videoId: 'CN77fk1xNPQ',
      videoTitle: "Temptation of Jesus – Matthew 4 | Sharefaith Kids!",
      keywords: ['temptation', 'desert', 'devil', 'matthew 4', 'word', 'stones'],
      kjvRef: 'Matthew 4',
      kidContext: { who: 'Jesus', to: 'Us (when we\'re tempted)', apply: "Jesus says no—use God's word! When the devil lies, quote the Bible!" }
    },
    parableSower: {
      title: 'Parable of the Sower',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Farmer scatters seeds' },
        { src: 'panel-noah-2.svg', alt: 'Seeds on path, rocks, thorns' },
        { src: 'panel-noah-3.svg', alt: 'Good soil—seeds grow strong!' }
      ],
      caption: 'Swipe to see seeds grow—plant good words! 🌱',
      videoId: 'Y01N77fQrTU',
      videoTitle: 'The Parable of the Sower – Animated Scripture Lesson!',
      keywords: ['sower', 'parable', 'seeds', 'soil', 'grow', 'matthew 13', 'mark 4'],
      kjvRef: 'Matthew 13',
      kidContext: { who: 'Jesus', to: 'The crowds (and us)', apply: 'Plant good words—grow strong! Let God\'s word take root in your heart!' }
    },
    richYoungRuler: {
      title: 'Rich Young Ruler',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Rich man asks Jesus' },
        { src: 'panel-david-2.svg', alt: 'Jesus says: give to the poor' },
        { src: 'panel-david-3.svg', alt: 'Follow Jesus—He\'s worth more!' }
      ],
      caption: 'Swipe to see Jesus say: give and follow! 💝',
      videoId: 'Z5tCVTOLnQ0',
      videoTitle: 'The Rich Young Ruler – Animated Bible Story!',
      keywords: ['rich young ruler', 'give', 'follow', 'mark 10', 'matthew 19', 'treasure'],
      kjvRef: 'Mark 10',
      kidContext: { who: 'Jesus', to: 'The rich young ruler', apply: 'Give to others—follow Jesus! He\'s worth more than anything!' }
    },
    widowsMite: {
      title: "Widow's Mite",
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Rich people give big gifts' },
        { src: 'panel-jesus-2.svg', alt: 'Widow gives two small coins' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus says: she gave more!' }
      ],
      caption: 'Swipe to see the widow\'s gift—God sees! 🪙',
      videoId: 'cauP52JaBdQ',
      videoTitle: "The Widow's Coins – Animated Bible Story!",
      keywords: ['widow', 'mite', 'coins', 'mark 12', 'luke 21', 'small gift'],
      kjvRef: 'Mark 12',
      kidContext: { who: 'Jesus', to: 'His disciples', apply: 'Small gifts matter—God sees! Give what you have from the heart!' }
    },
    gardenPrayer: {
      title: 'Garden Prayer',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus in the garden' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus prays to the Father' },
        { src: 'panel-jesus-3.svg', alt: 'Not My will—Your will be done!' }
      ],
      caption: 'Swipe to see Jesus pray—talk to God! 🙏',
      videoId: 'mk7Ey0XDx0w',
      videoTitle: 'Garden of Gethsemane – CQ Kids!',
      keywords: ['gethsemane', 'garden', 'prayer', 'matthew 26', 'mark 14', 'luke 22'],
      kjvRef: 'Matthew 26',
      kidContext: { who: 'Jesus', to: 'God the Father (and us)', apply: 'Jesus talks to God—talk to Him! Pray when you\'re scared or sad!' }
    },
    betrayal: {
      title: 'Betrayal (Judas)',
      panels: [
        { src: 'panel-jonah-1.svg', alt: 'Judas leads the crowd' },
        { src: 'panel-jonah-2.svg', alt: 'Judas kisses Jesus' },
        { src: 'panel-jonah-3.svg', alt: 'Friends fail—Jesus forgives!' }
      ],
      caption: 'Swipe to see Judas betray—Jesus still forgives! 💔',
      videoId: '79iFRXt4470',
      videoTitle: 'Judas Betrays Jesus – Bible Stories!',
      keywords: ['judas', 'betrayal', 'kiss', 'matthew 26', 'mark 14', 'fail'],
      kjvRef: 'Matthew 26',
      kidContext: { who: 'Jesus', to: 'Judas (and us)', apply: 'Even friends fail—Jesus forgives! He still loves you when people hurt you.' }
    },
    trial: {
      title: 'Trial (Pilate)',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Jesus before Pilate' },
        { src: 'panel-david-2.svg', alt: 'Pilate asks: Are you the King?' },
        { src: 'panel-david-3.svg', alt: 'Jesus stays quiet—trust God!' }
      ],
      caption: 'Swipe to see Jesus before Pilate—trust God! ⚖️',
      videoId: 'zmYLuYfPQI8',
      videoTitle: 'Jesus & Pilate – The Miracle Maker!',
      keywords: ['pilate', 'trial', 'quiet', 'john 18', 'matthew 27', 'king'],
      kjvRef: 'John 18',
      kidContext: { who: 'Jesus', to: 'Pilate (and us)', apply: 'Jesus stays quiet—trust God! When things are unfair, He knows the truth!' }
    },
    crucifixion: {
      title: 'Crucifixion',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus carries the cross' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus on the cross' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus dies for us—love wins!' }
      ],
      caption: 'Swipe to see Jesus on the cross—love wins! ✝️',
      videoId: 'bNq5tWl3OGk',
      videoTitle: 'Crucifixion and Death of Jesus – Animated Bible Stories!',
      keywords: ['crucifixion', 'cross', 'love', 'matthew 27', 'john 19', 'dies'],
      kjvRef: 'John 19',
      kidContext: { who: 'Jesus', to: 'The whole world', apply: 'Jesus dies for us—love wins! He took our sins so we could be free!' }
    },
    roadToEmmaus: {
      title: 'Road to Emmaus',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Two disciples walk to Emmaus' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus walks with them' },
        { src: 'panel-jesus-3.svg', alt: 'Jesus explains—they recognize Him!' }
      ],
      caption: 'Swipe to see Jesus walk with us—He explains! 🛤️',
      videoId: 'PPsWHNa84Tc',
      videoTitle: 'Jesus on the Road to Emmaus – LifeKids!',
      keywords: ['emmaus', 'road', 'walk', 'luke 24', 'explain', 'bread'],
      kjvRef: 'Luke 24',
      kidContext: { who: 'Jesus', to: 'Cleopas and his friend', apply: 'Jesus walks with us—He explains! He\'s with you on every road!' }
    },
    ascension: {
      title: 'Ascension',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Jesus with His disciples' },
        { src: 'panel-jesus-2.svg', alt: 'Jesus goes up to heaven' },
        { src: 'panel-jesus-3.svg', alt: 'He\'s with God—He\'ll come back!' }
      ],
      caption: 'Swipe to see Jesus go up—He\'s with God! ☁️',
      videoId: 'TedR27BUBfw',
      videoTitle: 'Jesus Goes to Heaven – Stories of the Bible!',
      keywords: ['ascension', 'heaven', 'up', 'acts 1', 'luke 24', 'promise'],
      kjvRef: 'Acts 1',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Jesus goes up—He\'s with God! He promised to come back—spread His love!' }
    },
    pentecost: {
      title: 'Pentecost',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Disciples waiting in Jerusalem' },
        { src: 'panel-jesus-2.svg', alt: 'Holy Spirit comes—wind and fire!' },
        { src: 'panel-jesus-3.svg', alt: 'They speak in tongues—power for us!' }
      ],
      caption: 'Swipe to see the Holy Spirit come—power for us! 🔥',
      videoId: '0kWV5-JQ9Yg',
      videoTitle: 'Pentecost – God Gives Us the Holy Spirit | LifeKids!',
      keywords: ['pentecost', 'holy spirit', 'tongues', 'acts 2', 'fire', 'wind'],
      kjvRef: 'Acts 2',
      kidContext: { who: 'God', to: 'The disciples (and us)', apply: 'Holy Spirit comes—power for us! God fills you with His Spirit!' }
    },
    stephen: {
      title: 'Stephen',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Stephen preaches about Jesus' },
        { src: 'panel-david-2.svg', alt: 'People throw stones' },
        { src: 'panel-david-3.svg', alt: 'Stephen forgives—be like him!' }
      ],
      caption: 'Swipe to see Stephen forgive—be like him! 💎',
      videoId: 'J9wp38EfRqA',
      videoTitle: 'The Stoning of Stephen – Bible Story!',
      keywords: ['stephen', 'martyr', 'stones', 'forgive', 'acts 7', 'first'],
      kjvRef: 'Acts 7',
      kidContext: { who: 'Stephen', to: 'Those who stoned him (and us)', apply: 'Stephen forgives—be like him! Even when hurt, pray for others!' }
    },
    paulDamascus: {
      title: 'Paul & Damascus',
      panels: [
        { src: 'panel-jesus-1.svg', alt: 'Saul on the road' },
        { src: 'panel-jesus-2.svg', alt: 'Bright light—Jesus speaks!' },
        { src: 'panel-jesus-3.svg', alt: 'Saul becomes Paul—Jesus changes us!' }
      ],
      caption: 'Swipe to see Jesus change Paul—He changes us! ✨',
      videoId: 'oi95cv0tk9Q',
      videoTitle: 'Paul, Jesus, and the Road to Damascus – LifeKids!',
      keywords: ['paul', 'damascus', 'saul', 'light', 'change', 'acts 9'],
      kjvRef: 'Acts 9',
      kidContext: { who: 'Jesus', to: 'Saul (who became Paul)', apply: 'Jesus changes Paul—He changes us! No one is too far for God!' }
    },
    heavenPromise: {
      title: 'Heaven Promise',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'New heaven and new earth' },
        { src: 'panel-noah-2.svg', alt: 'God wipes away every tear' },
        { src: 'panel-noah-3.svg', alt: 'No more sad—God\'s new home!' }
      ],
      caption: 'Swipe to see God\'s new home—no more sad! 🏠',
      videoId: 'ZWyITw1yuoA',
      videoTitle: 'Heavenly Hope – Revelation 21 | Kids Church!',
      keywords: ['heaven', 'revelation 21', 'no tears', 'new home', 'promise'],
      kjvRef: 'Revelation 21',
      kidContext: { who: 'God', to: 'Everyone who believes', apply: 'God makes new home—no more sad! No tears, no pain—forever with Him!' }
    },
    ruthBoaz: {
      title: 'Ruth & Boaz',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Ruth stays with Naomi' },
        { src: 'panel-david-2.svg', alt: 'Ruth gleans in Boaz\'s field' },
        { src: 'panel-david-3.svg', alt: 'Boaz is kind—God sees!' }
      ],
      caption: 'Swipe to see Ruth and Boaz—be kind, God sees! 🌾',
      videoId: 'irThVpdeSXk',
      videoTitle: "God's Story: Ruth – Bible Story for Kids!",
      keywords: ['ruth', 'boaz', 'loyalty', 'harvest', 'naomi', 'ruth 1'],
      kjvRef: 'Ruth 1',
      kidContext: { who: 'God', to: 'Ruth and Boaz', apply: 'Be kind—God sees! Loyalty and kindness matter to Him!' }
    },
    parableTalents: {
      title: 'Parable of Talents',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Master gives money to servants' },
        { src: 'panel-noah-2.svg', alt: 'Two servants use it—grow it!' },
        { src: 'panel-noah-3.svg', alt: 'Use what God gave you—grow it!' }
      ],
      caption: 'Swipe to see servants use gifts—grow what God gave! 💰',
      videoId: '4M7BHiN5Ro0',
      videoTitle: "God's Story: Parable of the Talents!",
      keywords: ['talents', 'parable', 'money', 'servants', 'matthew 25', 'gifts'],
      kjvRef: 'Matthew 25',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Use what God gave you—grow it! Don\'t hide your gifts—use them!' }
    },
    armorOfGod: {
      title: 'Armor of God',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Belt of truth, breastplate' },
        { src: 'panel-david-2.svg', alt: 'Helmet, shield, sword' },
        { src: 'panel-david-3.svg', alt: 'Put on God\'s armor—you\'re strong!' }
      ],
      caption: 'Swipe to see God\'s armor—you\'re strong! ⚔️',
      videoId: 'pFNzSpXhI_c',
      videoTitle: 'The Armor of God – Stories of the Bible!',
      keywords: ['armor', 'ephesians 6', 'helmet', 'sword', 'shield', 'truth'],
      kjvRef: 'Ephesians 6',
      kidContext: { who: 'Paul', to: 'Christians in Ephesus (and us)', apply: 'Put on God\'s armor—you\'re strong! Truth, faith, peace—stand firm!' }
    },
    /* ── Week 1 (13–24) ── */
    mosesSea: {
      title: 'Moses Parts the Sea',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Israelites trapped by the Red Sea – Pharaoh's army chasing" },
        { src: 'panel-noah-2.svg', alt: "Moses stretching his hand over the sea – God parts the waters" },
        { src: 'panel-noah-3.svg', alt: "People walking on dry ground between walls of water – God makes a way" }
      ],
      caption: 'Swipe to see God split the sea—He makes a way! 🌊',
      videoId: 'GYZh5eY6FGg',
      videoTitle: 'Moses Parts the Red Sea – Animated Bible Story!',
      keywords: ['moses', 'red sea', 'staff', 'parting', 'exodus 14', 'miracle'],
      kjvRef: 'Exodus 14:21',
      kidContext: { who: 'God', to: 'Moses and Israel', apply: "The Israelites were trapped between the Red Sea and the Egyptian army. God told Moses to stretch out his hand—the sea split open, and they walked through on dry ground. God makes a way even when there seems to be no way. Trust Him when you feel stuck—He will lead you through." },
      narration: "Moses Sea-Split – Exodus 14:21. The Israelites escaped Egypt, but Pharaoh chased them with his army. They were trapped—the Red Sea in front, soldiers behind. The people were afraid and cried to Moses. God said, 'Stretch out your hand over the sea.' Moses obeyed. A strong east wind blew all night, and the sea split in two! The Israelites walked on dry ground between walls of water. When the Egyptians followed, God closed the sea and saved His people. God makes a way! For you: When you feel trapped or don't know what to do, pray and trust God. He can make a path where there is none and lead you safely."
    },
    burningBush: {
      title: 'The Burning Bush',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Moses seeing the burning bush – Fire but no ashes" },
        { src: 'panel-noah-2.svg', alt: "God speaking from the bush – Calling Moses by name" },
        { src: 'panel-noah-3.svg', alt: "Moses taking off his shoes – Holy ground with God" }
      ],
      caption: 'Swipe to see God call Moses from the burning bush! 🔥',
      videoId: 'bWcwZIV-ip8',
      videoTitle: "Moses and the Burning Bush – Bible Stories for Kids!",
      keywords: ['moses', 'burning bush', 'fire', 'exodus 3', 'holy ground', 'call'],
      kjvRef: 'Exodus 3:2',
      kidContext: { who: 'God', to: 'Moses', apply: "Moses saw a bush on fire but not burning up. God spoke from the bush and told Moses His name and plan. God speaks to us too—through His Word, prayer, and quiet moments. Listen for His voice and obey when He calls you." },
      narration: "Burning Bush – Exodus 3:2. Moses was taking care of sheep when he saw something amazing—a bush burning with fire but not burning up. He went closer. God called from the bush, 'Moses, Moses!' God said, 'I am the God of your fathers. I have seen My people's suffering in Egypt. Go tell Pharaoh to let them go.' Moses was afraid, but God promised, 'I will be with you.' God even told Moses His name: 'I AM THAT I AM.' God speaks to us! For you: God still speaks today—through the Bible, prayer, and when your heart feels a gentle nudge. Listen, trust, and obey when He calls your name."
    },
    tenPlagues: {
      title: 'Ten Plagues of Egypt',
      panels: [
        { src: 'panel-david-1.svg', alt: "Moses and Aaron before Pharaoh – Asking to let people go" },
        { src: 'panel-david-2.svg', alt: "Plagues coming on Egypt – God shows His power" },
        { src: 'panel-david-3.svg', alt: "Passover door with blood – God protects His people" }
      ],
      caption: 'Swipe to see God\'s power over Egypt—nothing stops Him! 🐸',
      videoId: '',
      videoTitle: '',
      keywords: ['plagues', 'egypt', 'frogs', 'darkness', 'exodus 8', 'pharaoh'],
      kjvRef: 'Exodus 7–12',
      kidContext: { who: 'God', to: 'Pharaoh and Egypt', apply: "God sent ten plagues to show Pharaoh He was stronger than any false gods. The last plague was hard, but God protected His people with the Passover lamb. God shows His power to save and protect. When you face big problems, remember God is stronger than anything." },
      narration: "Ten Plagues – Exodus 7 to 12. Pharaoh would not let God's people go. God sent Moses and Aaron to tell him, 'Let My people go.' Pharaoh said no, so God sent ten plagues: water to blood, frogs, lice, flies, sick animals, boils, hail, locusts, darkness, and finally the death of the firstborn. Each plague showed God was stronger than Egypt's gods. For the last plague, God told His people to put lamb blood on their doors—the angel passed over them. Pharaoh finally let them go! God shows His power to save. For you: When bad things happen or people are mean, God is stronger than anything. Trust Him—He protects and sets free."
    },
    manna: {
      title: 'Manna from Heaven',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Israelites hungry in the desert – Complaining to Moses" },
        { src: 'panel-noah-2.svg', alt: "Manna falling from heaven – God sends bread" },
        { src: 'panel-noah-3.svg', alt: "People gathering manna each morning – God provides daily" }
      ],
      caption: 'Swipe to see God feed His people with bread from heaven! 🍞',
      videoId: 'Ln5Aa8jiEAM',
      videoTitle: 'Manna and Quail – Exodus 16 Bible Story!',
      keywords: ['manna', 'bread', 'heaven', 'desert', 'exodus 16', 'provide'],
      kjvRef: 'Exodus 16:15',
      kidContext: { who: 'God', to: 'Israel in the wilderness', apply: "God sent bread from heaven every morning for His people in the desert. They called it manna. God gives us what we need each day. When you worry about tomorrow, trust Him—He provides just enough, one day at a time." },
      narration: "Manna from Heaven – Exodus 16:15. The Israelites were hungry in the desert. They grumbled, but God said, 'I will rain bread from heaven for you.' Every morning, white flakes appeared on the ground like frost. It tasted like honey wafers! They called it manna. God told them to gather only what they needed for each day—no more, no less. On the sixth day they gathered extra for the Sabbath. God provided every morning! For you: God gives us what we need each day—food, strength, love. When you feel worried or empty, trust Him. He provides just enough, right when you need it."
    },
    tenCommandments: {
      title: 'Ten Commandments',
      panels: [
        { src: 'panel-david-1.svg', alt: "Moses on Mount Sinai – God speaks to him" },
        { src: 'panel-david-2.svg', alt: "God writing the Ten Commandments on stone tablets" },
        { src: 'panel-david-3.svg', alt: "Moses bringing the tablets down – God's good rules for His people" }
      ],
      caption: 'Swipe to see God give rules to keep us safe! 📜',
      videoId: 'P12cLzy1-3Q',
      videoTitle: 'The Ten Commandments – Bible Stories for Kids!',
      keywords: ['ten commandments', 'moses', 'mountain', 'tablets', 'exodus 20', 'rules'],
      kjvRef: 'Exodus 20:1-17',
      kidContext: { who: 'God', to: 'Moses and Israel', apply: "God gave Moses ten rules on stone tablets to help people love God and love others. They were good laws to live by. God's rules show us how to live happy and right. When you follow them, you honor God and treat people well." },
      narration: "Ten Commandments – Exodus 20:1-17. The Israelites came to Mount Sinai. God called Moses up the mountain. There, God spoke ten important rules and wrote them on stone tablets. The first four were about loving God: no other gods, no idols, honor His name, keep the Sabbath. The last six were about loving others: honor parents, no murder, no stealing, no lying, no wanting what others have. God gave these rules to help His people live good lives. For you: God's rules are like guardrails—they keep you safe and happy. Love God with all your heart, and love others like yourself. Following them makes life better."
    },
    elijahFire: {
      title: 'Elijah and the Fire',
      panels: [
        { src: 'panel-david-1.svg', alt: "Elijah building the altar and pouring water – Setting up the challenge" },
        { src: 'panel-david-2.svg', alt: "Prophets of Baal praying with no answer – False gods fail" },
        { src: 'panel-david-3.svg', alt: "Fire falling from heaven on Elijah's altar – God answers prayer" }
      ],
      caption: 'Swipe to see God answer Elijah with fire! 🔥',
      videoId: 'dKcQHonmOi8',
      videoTitle: 'Elijah and the Prophets of Baal – Bible Story!',
      keywords: ['elijah', 'fire', 'altar', '1 kings 18', 'baal', 'miracle'],
      kjvRef: '1 Kings 18:38',
      kidContext: { who: 'God', to: 'Elijah and Israel', apply: "Elijah prayed for fire from heaven to show God was real, and God sent fire that burned everything. The people saw and believed. When you pray and trust God, He hears and answers in His perfect way. Keep praying—God shows up!" },
      narration: "Elijah Fire on Carmel – 1 Kings 18:38. The people of Israel were worshiping false gods. Elijah said, 'Let's see whose God is real.' He built an altar, put a sacrifice on it, and poured water over it three times. The prophets of Baal prayed all day, but nothing happened. Elijah prayed, 'Lord God, let it be known that You are God in Israel.' Suddenly fire fell from heaven! It burned the sacrifice, the wood, the stones, and even licked up the water in the trench. The people shouted, 'The Lord, He is God!' For you: When things seem impossible or people doubt God, pray and trust Him. God hears your prayers and shows His power in amazing ways."
    },
    elishaOil: {
      title: 'Elisha and the Oil',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Widow asking Elisha for help – She has only a little oil" },
        { src: 'panel-noah-2.svg', alt: "Widow borrowing pots from neighbors – Obeying Elisha" },
        { src: 'panel-noah-3.svg', alt: "Oil filling every pot – God multiplies abundantly" }
      ],
      caption: 'Swipe to see God multiply oil—He provides! 🫙',
      videoId: '6E2WJ0vp4g4',
      videoTitle: 'Elisha and the Widow\'s Oil – Animated Bible Story!',
      keywords: ['elisha', 'oil', 'widow', '2 kings 4', 'multiply', 'miracle'],
      kjvRef: '2 Kings 4:6',
      kidContext: { who: 'God', to: 'The widow through Elisha', apply: "A widow had only a little oil. Elisha told her to borrow pots—God filled them all! She sold the oil and paid her debts. God can multiply the little you have when you trust Him and obey. Bring what you have to God—He can make it enough." },
      narration: "Elisha Oil Pots – 2 Kings 4:6. A poor widow owed money and was afraid her sons would be taken as slaves. She asked Elisha for help. Elisha asked, 'What do you have in the house?' She said, 'Only a little oil.' Elisha told her, 'Go borrow empty pots from your neighbors—don't borrow just a few.' She obeyed. She poured her little oil into the pots. God made the oil keep flowing until every pot was full! She sold the oil, paid her debts, and had money left. God multiplies! For you: When you feel like you don't have enough—time, money, courage—bring it to God. Obey Him, and watch Him multiply what you have to meet your needs."
    },
    naamanDip: {
      title: 'Naaman Dips in the River',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Naaman with leprosy – Proud captain needing help" },
        { src: 'panel-noah-2.svg', alt: "Naaman dipping in the Jordan River – Obeying Elisha" },
        { src: 'panel-noah-3.svg', alt: "Naaman healed – Skin clean like new" }
      ],
      caption: 'Swipe to see Naaman healed—obey and be made new! 💧',
      videoId: '8Y1Sh5bZAiM',
      videoTitle: "God's Story: Naaman – Bible Story for Kids!",
      keywords: ['naaman', 'river', 'jordan', '2 kings 5', 'leprosy', 'heal', 'obey'],
      kjvRef: '2 Kings 5:14',
      kidContext: { who: 'God', to: 'Naaman through Elisha', apply: "Naaman had a bad skin disease. Elisha told him to wash in the Jordan River seven times. Naaman was proud but obeyed—and God healed him completely. When God asks you to do something simple, obey. He can heal and help in ways you don't expect." },
      narration: "Naaman Washed Clean – 2 Kings 5:14. Naaman was a great army captain, but he had leprosy. A little servant girl said, 'Go to the prophet in Israel—God can heal you.' Naaman went to Elisha. Elisha said, 'Go wash in the Jordan River seven times.' Naaman was angry—'The rivers in my country are better!' But his servants said, 'If he asked something hard, you would do it—why not this?' Naaman obeyed, dipped seven times, and his skin became clean like a child's! God healed him. For you: Sometimes God asks us to do simple things like pray, forgive, or be kind. Obey even if it seems small—God can do big miracles when we trust and follow Him."
    },
    creationLight: {
      title: '"Let There Be Light"',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Dark empty earth – Before God spoke" },
        { src: 'panel-noah-2.svg', alt: "God saying 'Let there be light' – Creation begins" },
        { src: 'panel-noah-3.svg', alt: "Light and darkness separated – First day complete" }
      ],
      caption: 'Swipe to see God speak light into darkness! ☀️',
      videoId: 'teu7BCZTgDs',
      videoTitle: 'Creation (Genesis 1-2) – Saddleback Kids!',
      keywords: ['creation', 'light', 'genesis 1', 'let there be light', 'darkness', 'god speaks'],
      kjvRef: 'Genesis 1:3',
      kidContext: { who: 'God', to: 'All creation', apply: "God spoke, 'Let there be light,' and light appeared. Everything God made was good. He created the world perfectly for us. When you see the beauty around you—sun, sky, animals—remember God made it all with His word. Thank Him for His wonderful creation." },
      narration: "Creation Day One – Genesis 1:3. In the beginning, God created the heavens and the earth. It was dark and empty. God said, 'Let there be light,' and there was light! God saw the light and called it good. He separated light from darkness—He called light Day and darkness Night. That was the first day. God made everything perfectly by speaking it into being. For you: Look around at the sun, sky, trees, animals—God made them all. He spoke, and they came to be. Thank God for creating such a beautiful world for you to enjoy and take care of."
    },
    adamEve: {
      title: 'Adam and Eve',
      panels: [
        { src: 'panel-jesus-1.svg', alt: "God making Adam from dust – Breathing life into him" },
        { src: 'panel-jesus-2.svg', alt: "Adam and Eve in the beautiful Garden of Eden" },
        { src: 'panel-jesus-3.svg', alt: "God walking with Adam and Eve – Perfect friendship" }
      ],
      caption: 'Swipe to see the first family in God\'s garden! 🌳',
      videoId: 'l7TDvJrjjz0',
      videoTitle: 'Adam and Eve – Saddleback Kids!',
      keywords: ['adam', 'eve', 'garden', 'snake', 'genesis 3', 'fruit', 'choice'],
      kjvRef: 'Genesis 2:15',
      kidContext: { who: 'God', to: 'Adam and Eve', apply: "God made Adam and Eve and put them in a beautiful garden. They walked with God and had everything they needed. But they disobeyed. God still loved them and promised a Savior. God gives us good things and loves us even when we make mistakes." },
      narration: "Adam and Eve Garden – Genesis 2:15. God made Adam from dust and breathed life into him. God planted a beautiful garden called Eden with every good tree and a river. God put Adam in the garden to care for it. God made Eve from Adam's rib so they could be together. They walked with God every day in the cool of the evening. God gave them one rule: don't eat from the tree of the knowledge of good and evil. For you: God made the world perfect and gave us good things. He wants to walk with you too. When we make mistakes, God still loves us and has a plan to make everything right again."
    },
    towerBabel: {
      title: 'Tower of Babel',
      panels: [
        { src: 'panel-noah-1.svg', alt: "People building the tall tower – Trying to reach heaven" },
        { src: 'panel-noah-2.svg', alt: "God confusing their languages – People can't understand" },
        { src: 'panel-noah-3.svg', alt: "People scattering across the earth – God scatters pride" }
      ],
      caption: 'Swipe to see what happens when people forget God! 🏗️',
      videoId: '4EQh7C-IUcM',
      videoTitle: 'Tower of Babel – Bible Stories for Kids!',
      keywords: ['babel', 'tower', 'genesis 11', 'languages', 'pride', 'scatter'],
      kjvRef: 'Genesis 11:4',
      kidContext: { who: 'God', to: 'All people', apply: "People wanted to build a tall tower to make a name for themselves instead of honoring God. God confused their languages so they couldn't finish. When we try to be big without God, it leads to confusion. Stay humble and give glory to God in everything you do." },
      narration: "Tower of Babel – Genesis 11:4. After the flood, people spoke one language. They said, 'Let's build a city and a tower whose top reaches heaven, so we can make a name for ourselves.' They wanted to be famous without God. God came down and said, 'They are one people with one language—nothing will be impossible for them.' God confused their language so they couldn't understand each other. They stopped building and scattered over the earth. For you: When we want to be famous or big without God, it causes confusion and separation. Stay humble, honor God, and work together in His name—He blesses that."
    },
    /* ── Week 2 (25–36) ── */
    abrahamIsaac: {
      title: 'Abraham and Isaac',
      panels: [
        { src: 'panel-david-1.svg', alt: "Abraham and Isaac walking up the mountain – Trusting God" },
        { src: 'panel-david-2.svg', alt: "Isaac on the altar – Abraham ready to obey" },
        { src: 'panel-david-3.svg', alt: "Ram in the bush – God provides a sacrifice" }
      ],
      caption: 'Swipe to see Abraham trust God—He always provides! 🐏',
      videoId: '8QTk848O-yQ',
      videoTitle: 'Abraham and Isaac – Bible Stories for Kids!',
      keywords: ['abraham', 'isaac', 'altar', 'ram', 'genesis 22', 'trust', 'provide'],
      kjvRef: 'Genesis 22:12',
      kidContext: { who: 'God', to: 'Abraham', apply: "God asked Abraham to sacrifice his son Isaac, but Abraham trusted God. God stopped him and provided a ram instead. Abraham showed he loved God most. When God asks you to trust Him with something precious, obey—He always provides and has a better plan." },
      narration: "Abraham and Isaac – Genesis 22:12. God promised Abraham a son, and Isaac was born when Abraham was very old. God tested Abraham: 'Take Isaac and offer him as a sacrifice.' Abraham obeyed, even though it hurt. He took Isaac up the mountain. Isaac asked, 'Where is the lamb?' Abraham said, 'God will provide.' Abraham bound Isaac on the altar. An angel stopped him! God said, 'Now I know you fear God.' A ram was caught in a bush—Abraham sacrificed it instead. God provided! For you: Sometimes God asks us to trust Him with our most precious things. Obey and trust—He always provides and has something better in mind."
    },
    sarahLaughs: {
      title: 'Sarah Laughs',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'An angel visits Abraham\'s tent' },
        { src: 'panel-noah-2.svg', alt: 'Sarah hears she will have a baby' },
        { src: 'panel-noah-3.svg', alt: 'Sarah laughs—then holds baby Isaac!' }
      ],
      caption: 'Swipe to see God do the impossible for Sarah! 😂',
      videoId: '',
      videoTitle: '',
      keywords: ['sarah', 'laugh', 'angel', 'genesis 18', 'baby', 'impossible', 'promise'],
      kjvRef: 'Genesis 18',
      kidContext: { who: 'God', to: 'Sarah and Abraham', apply: 'Nothing is impossible with God! He keeps every promise.' }
    },
    jacobLadder: {
      title: 'Jacob\'s Ladder',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Jacob sleeping with a stone pillow – Running away" },
        { src: 'panel-noah-2.svg', alt: "Ladder from earth to heaven with angels – God's promise" },
        { src: 'panel-noah-3.svg', alt: "Jacob setting up the stone pillar – God is here" }
      ],
      caption: 'Swipe to see Jacob\'s dream of heaven! 🪜',
      videoId: '',
      videoTitle: '',
      keywords: ['jacob', 'ladder', 'dream', 'angels', 'genesis 28', 'heaven', 'promise'],
      kjvRef: 'Genesis 28:12',
      kidContext: { who: 'God', to: 'Jacob', apply: "Jacob was running away, but God showed him a ladder to heaven with angels going up and down. God promised to be with him and bring him home. Even when you're far from home or feel alone, God is with you and has good plans for your future." },
      narration: "Jacob Dream Ladder – Genesis 28:12. Jacob had to run away from his brother Esau. He slept on a stone pillow under the stars. In a dream, he saw a ladder reaching from earth to heaven with angels going up and down. God stood above it and said, 'I am the Lord God of Abraham and Isaac. I will give you this land. Your family will be many. I am with you and will keep you wherever you go.' Jacob woke up and said, 'God is in this place!' He set up the stone as a pillar and called it Bethel—House of God. For you: When you feel alone or far away, God is still with you. He promises to watch over you and bring you safely through every journey."
    },
    josephDreams: {
      title: 'Joseph Interprets Dreams',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Joseph in prison — cupbearer and baker need help' },
        { src: 'panel-noah-2.svg', alt: 'Joseph explains the vine and the baskets — God shows the meaning' },
        { src: 'panel-david-3.svg', alt: 'God is still with Joseph — faithful in the hard place' }
      ],
      caption: 'Swipe to see God help Joseph understand dreams in prison! 🍇',
      videoId: '',
      videoTitle: '',
      keywords: ['joseph', 'prison', 'dreams', 'cupbearer', 'baker', 'genesis 40', 'interpret'],
      kjvRef: 'Genesis 40',
      kidContext: { who: 'God', to: 'Joseph in prison', apply: 'Joseph trusted God to explain dreams — and helped others even while he waited. God is with you in hard places too.' }
    },
    josephPrison: {
      title: 'Joseph in Prison',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Joseph is put in prison' },
        { src: 'panel-noah-2.svg', alt: 'The cupbearer has a dream—Joseph explains' },
        { src: 'panel-noah-3.svg', alt: 'God is with Joseph even in prison' }
      ],
      caption: 'Swipe to see God with Joseph in the hard place! 🪣',
      videoId: '',
      videoTitle: '',
      keywords: ['joseph', 'prison', 'cupbearer', 'dream', 'genesis 40', 'faithful'],
      kjvRef: 'Genesis 40',
      kidContext: { who: 'God', to: 'Joseph in prison', apply: 'God is with you in hard places! He never forgets you.' }
    },
    pharaohDreams: {
      title: 'Pharaoh\'s Dreams',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Pharaoh dreams of fat and thin cows' },
        { src: 'panel-david-2.svg', alt: 'Joseph explains: 7 good years, 7 hard years' },
        { src: 'panel-david-3.svg', alt: 'Joseph is put in charge—God\'s plan works!' }
      ],
      caption: 'Swipe to see God use Joseph to save everyone! 🐄',
      videoId: '',
      videoTitle: '',
      keywords: ['pharaoh', 'dreams', 'cows', 'joseph', 'genesis 41', 'famine', 'wisdom'],
      kjvRef: 'Genesis 41',
      kidContext: { who: 'God', to: 'Joseph (through Pharaoh)', apply: 'God promotes the faithful! Stay humble and trust His timing.' }
    },
    josephRuler: {
      title: 'Joseph Ruler in Egypt',
      panels: [
        { src: 'panel-david-3.svg', alt: 'Joseph dressed in linen — second in command under Pharaoh' },
        { src: 'panel-david-2.svg', alt: 'Grain stored in Egypt during the seven full years' },
        { src: 'panel-david-1.svg', alt: 'God gave Joseph wisdom to feed many people' }
      ],
      caption: 'Swipe to see God lift Joseph up to save lives! 🌾',
      videoId: '',
      videoTitle: '',
      keywords: ['joseph', 'egypt', 'ruler', 'pharaoh', 'genesis 41', 'grain', 'famine', 'second'],
      kjvRef: 'Genesis 41:41',
      kidContext: { who: 'God', to: 'Joseph', apply: 'After many hard years, God honored faithful Joseph and used him to save lives. God can use your faithful days too.' }
    },
    mosesBaby: {
      title: 'Baby Moses in the Basket',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Moses' mom making the basket – Protecting her baby" },
        { src: 'panel-noah-2.svg', alt: "Basket floating on the river – God keeps Moses safe" },
        { src: 'panel-noah-3.svg', alt: "Pharaoh's daughter finding Moses – God has a plan" }
      ],
      caption: 'Swipe to see God protect baby Moses! 🌿',
      videoId: '',
      videoTitle: '',
      keywords: ['moses', 'basket', 'nile', 'princess', 'exodus 2', 'protect', 'baby'],
      kjvRef: 'Exodus 2:5',
      kidContext: { who: 'God', to: 'Baby Moses', apply: "Baby Moses was hidden in a basket on the river to stay safe from the king. God protected him, and Pharaoh's daughter found and adopted him. God watches over you too, even when things seem scary—He has a plan for your life." },
      narration: "Baby Moses Basket – Exodus 2:5. The king was afraid of the Israelites and ordered baby boys to be killed. Moses' mom hid him for three months. She made a basket, put baby Moses in it, and set it in the river reeds. His big sister Miriam watched. Pharaoh's daughter came to bathe and found the basket. She felt sorry for the baby and adopted him as her son. Moses grew up in the palace, but God had a big plan for him to lead His people! God watched over baby Moses. For you: When you feel small or scared, remember God is watching over you. He has a plan and protects you, just like He did for Moses."
    },
    mosesStaffSnake: {
      title: 'Moses\' Staff Becomes a Snake',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Moses throws his staff down' },
        { src: 'panel-david-2.svg', alt: 'It becomes a snake!' },
        { src: 'panel-david-3.svg', alt: 'God shows His power through Moses' }
      ],
      caption: 'Swipe to see God\'s power through Moses\' staff! 🐍',
      videoId: '',
      videoTitle: '',
      keywords: ['moses', 'staff', 'snake', 'exodus 7', 'pharaoh', 'sign', 'power'],
      kjvRef: 'Exodus 7',
      kidContext: { who: 'God', to: 'Moses (and Pharaoh)', apply: 'God\'s power is real! He gives us what we need to do His work.' }
    },
    passoverLamb: {
      title: 'The Passover Lamb',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A lamb is chosen—spotless and perfect' },
        { src: 'panel-noah-2.svg', alt: 'Blood painted on the doorposts' },
        { src: 'panel-noah-3.svg', alt: 'The angel passes over—God saves His people' }
      ],
      caption: 'Swipe to see God\'s rescue—the Passover lamb! 🐑',
      videoId: '',
      videoTitle: '',
      keywords: ['passover', 'lamb', 'blood', 'doorposts', 'exodus 12', 'rescue', 'save'],
      kjvRef: 'Exodus 12',
      kidContext: { who: 'God', to: 'Israel in Egypt', apply: 'Jesus is our Passover Lamb! He saves us—just believe and be covered.' }
    },
    redSeaCrossing: {
      title: 'Red Sea Crossing',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Egypt\'s army chases Israel' },
        { src: 'panel-noah-2.svg', alt: 'God tangles the chariot wheels' },
        { src: 'panel-noah-3.svg', alt: 'Israel is safe—Egypt is stopped!' }
      ],
      caption: 'Swipe to see God stop the enemy at the sea! 🌊',
      videoId: '',
      videoTitle: '',
      keywords: ['red sea', 'chariot', 'egypt', 'exodus 14', 'army', 'rescue'],
      kjvRef: 'Exodus 14',
      kidContext: { who: 'God', to: 'Israel', apply: 'God stops the enemy for you! When you\'re afraid, He fights your battle.' }
    },
    /* ── Week 3 (37–48) ── */
    joshuaJordan: {
      title: 'Joshua at the Jordan',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Priests carry the ark to the Jordan' },
        { src: 'panel-noah-2.svg', alt: 'They step in—the river stops!' },
        { src: 'panel-noah-3.svg', alt: 'Israel crosses on dry ground' }
      ],
      caption: 'Swipe to see God stop the Jordan River—He always leads! 🏞️',
      videoId: '',
      videoTitle: '',
      keywords: ['joshua', 'jordan', 'ark', 'river', 'joshua 3', 'priests', 'miracle'],
      kjvRef: 'Joshua 3',
      kidContext: { who: 'God', to: 'Joshua and Israel', apply: 'God leads you into the new! Step forward in faith—He holds the water back.' }
    },
    jerichoWalls: {
      title: 'Walls of Jericho Fall',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Israel marches around Jericho' },
        { src: 'panel-david-2.svg', alt: 'Trumpets blow—people shout!' },
        { src: 'panel-david-3.svg', alt: 'The walls fall down—God wins!' }
      ],
      caption: 'Swipe to see God tumble those walls—He wins every battle! 🎺',
      videoId: '',
      videoTitle: '',
      keywords: ['jericho', 'walls', 'trumpets', 'joshua 6', 'march', 'shout', 'victory'],
      kjvRef: 'Joshua 6',
      kidContext: { who: 'God', to: 'Joshua and Israel', apply: 'God wins battles in surprising ways! Obey—then shout for joy.' }
    },
    joshuaAi: {
      title: 'Joshua and Ai',
      panels: [
        { src: 'panel-david-1.svg', alt: 'First attack on Ai — Israel stumbles' },
        { src: 'panel-david-2.svg', alt: 'Sin is found and removed from the camp' },
        { src: 'panel-david-3.svg', alt: 'God gives Joshua victory at Ai' }
      ],
      caption: 'Swipe to see obedience bring victory! 🏙️',
      videoId: '',
      videoTitle: '',
      keywords: ['joshua', 'ai', 'achan', 'joshua 7', 'joshua 8', 'obey', 'ambush'],
      kjvRef: 'Joshua 8',
      kidContext: { who: 'God', to: 'Joshua and Israel', apply: 'Hidden sin blocked the win — when the camp obeyed God again, He gave the city.' }
    },
    rahabRope: {
      title: 'Rahab\'s Scarlet Cord',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Rahab hides the spies' },
        { src: 'panel-noah-2.svg', alt: 'She hangs a scarlet cord in the window' },
        { src: 'panel-noah-3.svg', alt: 'Rahab and her family are saved!' }
      ],
      caption: 'Swipe to see how faith in God saves! 🔴',
      videoId: '',
      videoTitle: '',
      keywords: ['rahab', 'cord', 'spies', 'joshua 2', 'window', 'scarlet', 'faith', 'save'],
      kjvRef: 'Joshua 2',
      kidContext: { who: 'God', to: 'Rahab', apply: 'Faith saves! Even when you\'re afraid, trust God and He rescues you.' }
    },
    rahabJericho: {
      title: 'Rahab at Jericho',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Rahab hides the two spies on her roof' },
        { src: 'panel-noah-2.svg', alt: 'Scarlet cord in the window — a sign of faith' },
        { src: 'panel-noah-3.svg', alt: 'Rahab and her family brought out safe' }
      ],
      caption: 'Swipe to see faith in God save a whole family! 🏠',
      videoId: '',
      videoTitle: '',
      keywords: ['rahab', 'jericho', 'spies', 'joshua 2', 'cord', 'scarlet', 'faith'],
      kjvRef: 'Joshua 2',
      kidContext: { who: 'God', to: 'Rahab', apply: 'She believed the Lord is God in heaven above — and He kept her safe.' }
    },
    balaamDonkey: {
      title: 'Balaam\'s Talking Donkey',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Balaam rides his donkey' },
        { src: 'panel-david-2.svg', alt: 'The donkey sees the angel and stops' },
        { src: 'panel-david-3.svg', alt: 'The donkey speaks—God uses anything!' }
      ],
      caption: 'Swipe to see God speak through a donkey—He uses anyone! 🫏',
      videoId: '',
      videoTitle: '',
      keywords: ['balaam', 'donkey', 'angel', 'numbers 22', 'talking', 'listen', 'obey'],
      kjvRef: 'Numbers 22',
      kidContext: { who: 'God', to: 'Balaam', apply: 'God can use anyone to speak truth! Always listen—even when it\'s surprising.' }
    },
    samsonHair: {
      title: 'Samson\'s Hair',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Samson has long hair—God\'s strength' },
        { src: 'panel-noah-2.svg', alt: 'Delilah cuts his hair while he sleeps' },
        { src: 'panel-noah-3.svg', alt: 'Samson calls on God one last time' }
      ],
      caption: 'Swipe to see Samson\'s story—stay close to God! 💪',
      videoId: '',
      videoTitle: '',
      keywords: ['samson', 'hair', 'delilah', 'judges 16', 'strength', 'cut', 'power'],
      kjvRef: 'Judges 16',
      kidContext: { who: 'God', to: 'Samson', apply: 'Your strength comes from God! Stay close to Him and nothing can stop you.' }
    },
    ruthGlean: {
      title: 'Ruth Gleans in the Field',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Ruth with Naomi – Staying loyal in hard times" },
        { src: 'panel-noah-2.svg', alt: "Ruth gleaning in the fields – Working hard and faithfully" },
        { src: 'panel-noah-3.svg', alt: "Boaz noticing Ruth – God blesses kindness" }
      ],
      caption: 'Swipe to see Ruth\'s faithfulness—God sees your hard work! 🌾',
      videoId: '',
      videoTitle: '',
      keywords: ['ruth', 'glean', 'boaz', 'field', 'ruth 2', 'faithful', 'kind'],
      kjvRef: 'Ruth 2:2',
      kidContext: { who: 'God', to: 'Ruth and Naomi', apply: "Ruth stayed loyal to her mother-in-law Naomi and worked hard gleaning in the fields. God saw her kindness and blessed her with Boaz. When you are faithful and kind, even in hard times, God notices and takes care of you." },
      narration: "Ruth Gleans – Ruth 2:2. Ruth's husband died, and she could have gone back home. But she said to Naomi, 'Your people will be my people, and your God my God.' They went to Bethlehem. Ruth worked in the fields picking leftover grain. The owner, Boaz, noticed her kindness and hard work. He told his workers to leave extra grain for her and protected her. Boaz married Ruth, and they had a son who became part of Jesus' family line! God saw Ruth's faithfulness and blessed her. For you: When you stay loyal, help others, and work hard, God sees it. He blesses faithfulness and can turn hard times into joy."
    },
    samuelCall: {
      title: 'God Calls Samuel',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Samuel sleeps in the temple' },
        { src: 'panel-noah-2.svg', alt: 'A voice calls: Samuel! Samuel!' },
        { src: 'panel-noah-3.svg', alt: 'Samuel answers: Speak, Lord—I\'m listening!' }
      ],
      caption: 'Swipe to see God call Samuel—He calls you too! 👂',
      videoId: '',
      videoTitle: '',
      keywords: ['samuel', 'call', 'temple', '1 samuel 3', 'eli', 'voice', 'listen'],
      kjvRef: '1 Samuel 3',
      kidContext: { who: 'God', to: 'Young Samuel', apply: 'God calls children! Say yes: "Speak, Lord—I am listening."' }
    },
    davidHarp: {
      title: 'David Plays the Harp',
      panels: [
        { src: 'panel-david-1.svg', alt: 'David watches his sheep in the field' },
        { src: 'panel-david-2.svg', alt: 'He plays and sings to God' },
        { src: 'panel-david-3.svg', alt: 'God listens—worship from the heart!' }
      ],
      caption: 'Swipe to see David worship God in the fields! 🎶',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'harp', 'worship', 'sheep', '1 samuel 16', 'music', 'praise'],
      kjvRef: '1 Samuel 16',
      kidContext: { who: 'David', to: 'God', apply: 'God loves your worship! Sing and praise wherever you are.' }
    },
    goliathChallenge: {
      title: 'Goliath\'s Challenge',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Goliath shouts—who will fight me?' },
        { src: 'panel-david-2.svg', alt: 'Everyone is afraid—except David' },
        { src: 'panel-david-3.svg', alt: 'David says: The Lord will deliver you!' }
      ],
      caption: 'Swipe to see David face the giant—God wins! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: ['goliath', 'challenge', 'david', '1 samuel 17', 'giant', 'brave', 'faith'],
      kjvRef: '1 Samuel 17',
      kidContext: { who: 'David', to: 'Goliath (and us)', apply: 'God is bigger than any giant! Face your fears—He\'s with you.' }
    },
    davidAnointed: {
      title: 'David Is Anointed King',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Samuel visits Jesse\'s family' },
        { src: 'panel-david-2.svg', alt: 'God says: man looks at the outside—I look at the heart' },
        { src: 'panel-david-3.svg', alt: 'Oil on David\'s head—the youngest chosen!' }
      ],
      caption: 'Swipe to see God choose David—He looks at your heart! 💛',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'anoint', 'samuel', '1 samuel 16', 'king', 'heart', 'chosen'],
      kjvRef: '1 Samuel 16',
      kidContext: { who: 'God', to: 'David', apply: 'God looks at your heart! Be faithful where you are—He sees you.' }
    },
    saulSpear: {
      title: 'Saul Throws a Spear at David',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'David plays harp for King Saul' },
        { src: 'panel-noah-2.svg', alt: 'Saul throws a spear in jealousy' },
        { src: 'panel-noah-3.svg', alt: 'David escapes—trust God, not fear!' }
      ],
      caption: 'Swipe to see David trust God—not react in anger! 🎯',
      videoId: '',
      videoTitle: '',
      keywords: ['saul', 'spear', 'david', '1 samuel 18', 'jealous', 'escape', 'trust'],
      kjvRef: '1 Samuel 18',
      kidContext: { who: 'God', to: 'David', apply: 'When people are unkind, trust God! He is your protection.' }
    },
    davidCave: {
      title: 'David Hides in the Cave',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'David hides in the cave of Adullam' },
        { src: 'panel-noah-2.svg', alt: 'He writes songs to God even here' },
        { src: 'panel-noah-3.svg', alt: 'God is with David in the dark place' }
      ],
      caption: 'Swipe to see David trust God even in the cave! 🕳️',
      videoId: '',
      videoTitle: '',
      keywords: ['david', 'cave', 'adullam', '1 samuel 22', 'hiding', 'prayer', 'psalm'],
      kjvRef: '1 Samuel 22',
      kidContext: { who: 'David', to: 'God', apply: 'Even in dark or scary times, God is with you! Talk to Him wherever you are.' }
    },
    /* ── Week 4 (49–60) ── */
    elishaRaised: {
      title: 'Elisha Raises a Boy',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A Shunammite\'s son dies' },
        { src: 'panel-noah-2.svg', alt: 'Elisha stretches over him and prays' },
        { src: 'panel-noah-3.svg', alt: 'The boy sneezes seven times—alive!' }
      ],
      caption: 'Swipe to see God bring a boy back to life! 🤧',
      videoId: '',
      videoTitle: '',
      keywords: ['elisha', 'raise', 'shunammite', '2 kings 4', 'boy', 'dead', 'life', 'miracle'],
      kjvRef: '2 Kings 4',
      kidContext: { who: 'God', to: 'Elisha and the Shunammite', apply: 'God can bring life back! Nothing is too hard for Him.' }
    },
    estherCrown: {
      title: 'Queen Esther\'s Courage',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Esther is made queen' },
        { src: 'panel-noah-2.svg', alt: 'Haman plots to destroy the Jews' },
        { src: 'panel-noah-3.svg', alt: 'Esther goes to the king—God gives courage!' }
      ],
      caption: 'Swipe to see Esther\'s courage save her people! 👑',
      videoId: '',
      videoTitle: '',
      keywords: ['esther', 'crown', 'queen', 'esther 5', 'scepter', 'courage', 'save'],
      kjvRef: 'Esther 5',
      kidContext: { who: 'God', to: 'Esther', apply: 'God puts you where you are for a reason! Be brave—maybe it\'s for such a time as this.' }
    },
    nehemiahWalls: {
      title: 'Nehemiah Rebuilds the Walls',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Nehemiah prays and makes a plan' },
        { src: 'panel-david-2.svg', alt: 'Workers build with tools in one hand, sword in the other' },
        { src: 'panel-david-3.svg', alt: 'The walls are rebuilt in 52 days—God did it!' }
      ],
      caption: 'Swipe to see Nehemiah rebuild—pray and work together! 🧱',
      videoId: '',
      videoTitle: '',
      keywords: ['nehemiah', 'walls', 'jerusalem', 'nehemiah 4', 'rebuild', 'pray', 'sword'],
      kjvRef: 'Nehemiah 4',
      kidContext: { who: 'God', to: 'Nehemiah and Israel', apply: 'Pray, then work! God helps us rebuild what\'s broken.' }
    },
    jobSuffering: {
      title: 'Job\'s Suffering',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Job loses everything—still trusts God' },
        { src: 'panel-noah-2.svg', alt: 'Friends sit with him but don\'t understand' },
        { src: 'panel-noah-3.svg', alt: 'God speaks—and restores Job!' }
      ],
      caption: 'Swipe to see Job\'s faith in hard times—God is enough! 🌧️',
      videoId: '',
      videoTitle: '',
      keywords: ['job', 'suffering', 'boils', 'friends', 'job 2', 'trust', 'faith', 'restore'],
      kjvRef: 'Job 2',
      kidContext: { who: 'God', to: 'Job', apply: 'You can trust God in hard times! He always comes through for those who hold on.' }
    },
    psalm23Shepherd: {
      title: 'The Lord Is My Shepherd',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A shepherd leads sheep to green pastures' },
        { src: 'panel-noah-2.svg', alt: 'Still waters—rest and peace' },
        { src: 'panel-noah-3.svg', alt: 'God leads us—we shall not want!' }
      ],
      caption: 'Swipe to see God as your Good Shepherd! 🐑',
      videoId: '',
      videoTitle: '',
      keywords: ['psalm 23', 'shepherd', 'sheep', 'staff', 'peace', 'david', 'green pastures'],
      kjvRef: 'Psalm 23',
      kidContext: { who: 'God', to: 'David (and us)', apply: 'God is your Good Shepherd! He leads you, protects you, and gives you rest.' }
    },
    solomonWisdom: {
      title: 'Solomon\'s Wisdom',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Two moms argue about a baby' },
        { src: 'panel-david-2.svg', alt: 'Solomon says: bring a sword!' },
        { src: 'panel-david-3.svg', alt: 'The real mom speaks up—God gives wisdom!' }
      ],
      caption: 'Swipe to see Solomon use God\'s wisdom! 👶',
      videoId: '',
      videoTitle: '',
      keywords: ['solomon', 'wisdom', 'baby', 'sword', '1 kings 3', 'judge', 'moms'],
      kjvRef: '1 Kings 3',
      kidContext: { who: 'God', to: 'Solomon', apply: 'Ask God for wisdom! He gives it freely to those who ask.' }
    },
    elijahChariot: {
      title: 'Elijah\'s Fiery Chariot',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Elijah and Elisha walk together' },
        { src: 'panel-noah-2.svg', alt: 'Fiery horses and chariot appear' },
        { src: 'panel-noah-3.svg', alt: 'Elijah goes up to heaven in a whirlwind!' }
      ],
      caption: 'Swipe to see Elijah taken up to heaven! 🔥',
      videoId: '',
      videoTitle: '',
      keywords: ['elijah', 'chariot', 'fire', '2 kings 2', 'whirlwind', 'heaven', 'elisha'],
      kjvRef: '2 Kings 2',
      kidContext: { who: 'God', to: 'Elijah', apply: 'God honors His faithful servants! Heaven is real—and it\'s wonderful.' }
    },
    jonahVine: {
      title: 'Jonah and the Vine',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jonah sits angry outside Nineveh' },
        { src: 'panel-noah-2.svg', alt: 'A vine grows up to shade him—then a worm eats it' },
        { src: 'panel-noah-3.svg', alt: 'God says: I care about people even more than the vine' }
      ],
      caption: 'Swipe to see God\'s big heart—He cares for everyone! 🌿',
      videoId: '',
      videoTitle: '',
      keywords: ['jonah', 'vine', 'worm', 'jonah 4', 'nineveh', 'anger', 'mercy'],
      kjvRef: 'Jonah 4',
      kidContext: { who: 'God', to: 'Jonah', apply: 'God loves everyone—even people we think don\'t deserve it. So should we!' }
    },
    danielPray: {
      title: 'Daniel Prays Three Times a Day',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A new law says no praying' },
        { src: 'panel-noah-2.svg', alt: 'Daniel opens his window and prays anyway' },
        { src: 'panel-noah-3.svg', alt: 'God protects Daniel!' }
      ],
      caption: 'Swipe to see Daniel pray no matter what—so brave! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['daniel', 'pray', 'window', 'daniel 6', 'law', 'brave', 'lions'],
      kjvRef: 'Daniel 6',
      kidContext: { who: 'God', to: 'Daniel', apply: 'Nothing should stop you from praying! God sees your faithfulness.' }
    },
    estherBanquet: {
      title: 'Esther\'s Banquet',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Esther invites the king to a banquet' },
        { src: 'panel-noah-2.svg', alt: 'Haman arrives thinking he\'s honored' },
        { src: 'panel-noah-3.svg', alt: 'Esther reveals Haman\'s evil plan—he is shocked!' }
      ],
      caption: 'Swipe to see Esther stand up for her people! 🍷',
      videoId: '',
      videoTitle: '',
      keywords: ['esther', 'banquet', 'haman', 'esther 7', 'king', 'courage', 'reveal'],
      kjvRef: 'Esther 7',
      kidContext: { who: 'God', to: 'Esther (through timing)', apply: 'God gives you the right moment! Be ready—He orders the steps.' }
    },
    /* ── Week 5 (61–72) ── */
    angelMary: {
      title: 'Angel Visits Mary',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Angel Gabriel appears with a lily' },
        { src: 'panel-noah-2.svg', alt: 'Gabriel says: Fear not, Mary—you are chosen!' },
        { src: 'panel-noah-3.svg', alt: 'Mary says: I will do what God says!' }
      ],
      caption: 'Swipe to see the angel tell Mary the great news! 🌸',
      videoId: '',
      videoTitle: '',
      keywords: ['angel', 'mary', 'gabriel', 'luke 1', 'fear not', 'chosen', 'jesus'],
      kjvRef: 'Luke 1',
      kidContext: { who: 'God', to: 'Mary', apply: 'God chooses ordinary people! When God calls you, say yes like Mary.' }
    },
    shepherdsStar: {
      title: 'Shepherds and the Star',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Shepherds watch their flock at night' },
        { src: 'panel-noah-2.svg', alt: 'Angels fill the sky singing!' },
        { src: 'panel-noah-3.svg', alt: 'They run to Bethlehem—Jesus is born!' }
      ],
      caption: 'Swipe to see the shepherds run to baby Jesus! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['shepherds', 'star', 'angels', 'luke 2', 'bethlehem', 'birth', 'glory'],
      kjvRef: 'Luke 2',
      kidContext: { who: 'God', to: 'The shepherds', apply: 'God shares good news first with humble people! Run to Jesus—everyone is invited.' }
    },
    jesusManger: {
      title: 'Baby Jesus in the Manger',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mary and Joseph find a stable' },
        { src: 'panel-noah-2.svg', alt: 'Jesus is born and laid in a manger' },
        { src: 'panel-noah-3.svg', alt: 'Wise men bring gifts—a King is born!' }
      ],
      caption: 'Swipe to see the night Jesus was born! 🎁',
      videoId: '',
      videoTitle: '',
      keywords: ['jesus', 'manger', 'baby', 'luke 2', 'bethlehem', 'wise men', 'star', 'born'],
      kjvRef: 'Luke 2',
      kidContext: { who: 'God', to: 'The whole world', apply: 'Jesus came for you! God\'s greatest gift is His Son.' }
    },
    jesusTemple: {
      title: 'Jesus Teaches in the Temple',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mary and Joseph lose track of Jesus' },
        { src: 'panel-noah-2.svg', alt: 'They find Him in the temple—teaching elders!' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: I must be about my Father\'s business' }
      ],
      caption: 'Swipe to see Jesus in the temple—even as a kid! 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['jesus', 'temple', 'teaching', 'luke 2', 'elders', 'wisdom', 'boy', 'father'],
      kjvRef: 'Luke 2',
      kidContext: { who: 'Jesus', to: 'The teachers (and us)', apply: 'Jesus loved God\'s house and Word even as a boy—so can you!' }
    },
    johnBaptize: {
      title: 'John Baptizes Jesus',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'John preaches by the river Jordan' },
        { src: 'panel-noah-2.svg', alt: 'Jesus steps into the water' },
        { src: 'panel-noah-3.svg', alt: 'A dove lands—God says: This is my Son!' }
      ],
      caption: 'Swipe to see Jesus baptized—the dove and the voice! 🕊️',
      videoId: '',
      videoTitle: '',
      keywords: ['john', 'baptize', 'jordan', 'matthew 3', 'dove', 'voice', 'heaven', 'spirit'],
      kjvRef: 'Matthew 3',
      kidContext: { who: 'God', to: 'Jesus (and us)', apply: 'God said yes to Jesus—He says yes to you too! Baptism is a big, happy yes.' }
    },
    jesusTempt: {
      title: 'Jesus Is Tempted',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus fasts in the desert for 40 days' },
        { src: 'panel-noah-2.svg', alt: 'The devil tries to trick Jesus with bread, power, and glory' },
        { src: 'panel-noah-3.svg', alt: 'Jesus uses God\'s Word—the devil leaves!' }
      ],
      caption: 'Swipe to see Jesus fight temptation with Scripture! 📜',
      videoId: '',
      videoTitle: '',
      keywords: ['jesus', 'temptation', 'desert', 'matthew 4', 'devil', 'bread', 'scripture', 'word'],
      kjvRef: 'Matthew 4',
      kidContext: { who: 'Jesus', to: 'The devil (and us)', apply: 'Use God\'s Word when you\'re tempted! Jesus showed us how—it works.' }
    },
    weddingWine: {
      title: 'Water into Wine',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A wedding runs out of wine' },
        { src: 'panel-noah-2.svg', alt: 'Mary tells Jesus—He says: Fill the jars' },
        { src: 'panel-noah-3.svg', alt: 'Water becomes wine—the first miracle!' }
      ],
      caption: 'Swipe to see Jesus\' first miracle at the wedding! 🍷',
      videoId: '',
      videoTitle: '',
      keywords: ['wedding', 'wine', 'water', 'john 2', 'miracle', 'cana', 'mary'],
      kjvRef: 'John 2',
      kidContext: { who: 'Jesus', to: 'The wedding guests', apply: 'Jesus loves to help! When we bring Him our empty jars, He fills them.' }
    },
    healBlind: {
      title: 'Jesus Heals a Blind Man',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A man is born blind' },
        { src: 'panel-noah-2.svg', alt: 'Jesus puts mud on his eyes' },
        { src: 'panel-noah-3.svg', alt: 'He washes and sees—I was blind, now I see!' }
      ],
      caption: 'Swipe to see Jesus open blind eyes! 👁️',
      videoId: '',
      videoTitle: '',
      keywords: ['blind', 'heal', 'mud', 'john 9', 'eyes', 'wash', 'see', 'miracle'],
      kjvRef: 'John 9',
      kidContext: { who: 'Jesus', to: 'The blind man', apply: 'Jesus opens our eyes—in our hearts too! Ask Him to help you see.' }
    },
    jesusBlessKids: {
      title: 'Jesus Blesses the Children',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Disciples try to send kids away' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: Let the little children come to me!' },
        { src: 'panel-noah-3.svg', alt: 'He holds them—they are of such is the kingdom!' }
      ],
      caption: 'Swipe to see Jesus love and bless kids just like you! ❤️',
      videoId: '',
      videoTitle: '',
      keywords: ['jesus', 'children', 'bless', 'mark 10', 'kids', 'kingdom', 'come'],
      kjvRef: 'Mark 10',
      kidContext: { who: 'Jesus', to: 'The children (and you!)', apply: 'Jesus wants YOU! He invites every child to come to Him.' }
    },
    /* ── Week 6 (73–84) ── */
    mustardSeed: {
      title: 'The Mustard Seed',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A tiny mustard seed in a hand' },
        { src: 'panel-noah-2.svg', alt: 'It\'s planted in the ground' },
        { src: 'panel-noah-3.svg', alt: 'It grows into the biggest tree—birds nest in it!' }
      ],
      caption: 'Swipe to see a tiny seed grow huge—faith works! 🌱',
      videoId: '',
      videoTitle: '',
      keywords: ['mustard seed', 'faith', 'tree', 'matthew 13', 'kingdom', 'grow', 'small'],
      kjvRef: 'Matthew 13',
      kidContext: { who: 'Jesus', to: 'His disciples', apply: 'Faith as small as a seed can move mountains! Don\'t give up—keep trusting.' }
    },
    healLeper: {
      title: 'Jesus Heals Ten Lepers',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Ten lepers call out: Jesus, have mercy!' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: Go show yourselves to the priest' },
        { src: 'panel-noah-3.svg', alt: 'As they go—all ten are clean!' }
      ],
      caption: 'Swipe to see Jesus heal ten lepers—be thankful! 🙌',
      videoId: '',
      videoTitle: '',
      keywords: ['leper', 'heal', 'luke 17', 'mercy', 'clean', 'thankful', 'ten'],
      kjvRef: 'Luke 17',
      kidContext: { who: 'Jesus', to: 'The lepers', apply: 'Jesus heals and cleans us inside! Always say thank you to Him.' }
    },
    jairus: {
      title: 'Jairus\' Daughter Raised',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jairus begs Jesus: my daughter is dying!' },
        { src: 'panel-noah-2.svg', alt: 'News arrives: she is gone...' },
        { src: 'panel-noah-3.svg', alt: 'Jesus takes her hand: Talitha cumi! She rises!' }
      ],
      caption: 'Swipe to see Jesus bring a girl back to life! 🌸',
      videoId: '',
      videoTitle: '',
      keywords: ['jairus', 'daughter', 'raise', 'mark 5', 'talitha cumi', 'miracle', 'faith'],
      kjvRef: 'Mark 5',
      kidContext: { who: 'Jesus', to: 'Jairus and his daughter', apply: 'Jesus is never too late! Keep believing even when it seems impossible.' }
    },
    transfigure: {
      title: 'Jesus\' Transfiguration',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus goes up the mountain with Peter, James, and John' },
        { src: 'panel-noah-2.svg', alt: 'His face shines like the sun—His clothes glow white' },
        { src: 'panel-noah-3.svg', alt: 'God\'s voice says: This is my Son—listen to Him!' }
      ],
      caption: 'Swipe to see Jesus glow on the mountain! ✨',
      videoId: '',
      videoTitle: '',
      keywords: ['transfigure', 'mountain', 'matthew 17', 'glow', 'moses', 'elijah', 'cloud'],
      kjvRef: 'Matthew 17',
      kidContext: { who: 'God', to: 'Peter, James, John', apply: 'Jesus is the Son of God—really listen to Him! He is glorious.' }
    },
    judasKiss: {
      title: 'Judas Betrays Jesus',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Soldiers come to the garden with torches' },
        { src: 'panel-noah-2.svg', alt: 'Judas kisses Jesus—a signal to arrest Him' },
        { src: 'panel-noah-3.svg', alt: 'Jesus goes peacefully—He loves us that much' }
      ],
      caption: 'Swipe to see Jesus stay calm—even when betrayed! 🕯️',
      videoId: '',
      videoTitle: '',
      keywords: ['judas', 'betray', 'kiss', 'matthew 26', 'arrest', 'garden', 'soldiers'],
      kjvRef: 'Matthew 26',
      kidContext: { who: 'Jesus', to: 'Judas (and us)', apply: 'Even when people hurt you, choose love like Jesus did! He forgave.' }
    },
    /* ── Week 7 (85–96) ── */
    crossCarry: {
      title: 'Simon Helps Carry the Cross',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus is made to carry His cross' },
        { src: 'panel-noah-2.svg', alt: 'Simon of Cyrene is asked to help' },
        { src: 'panel-noah-3.svg', alt: 'Sometimes God calls us to help carry burdens' }
      ],
      caption: 'Swipe to see Simon help carry—be a helper! 🤝',
      videoId: '',
      videoTitle: '',
      keywords: ['cross', 'simon', 'carry', 'luke 23', 'cyrene', 'help', 'burden'],
      kjvRef: 'Luke 23',
      kidContext: { who: 'God', to: 'Simon (and us)', apply: 'God calls us to help carry each other\'s burdens! Be a Simon for someone today.' }
    },
    crucifixion: {
      title: 'Jesus on the Cross',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus is nailed to the cross' },
        { src: 'panel-noah-2.svg', alt: 'Darkness covers the land' },
        { src: 'panel-noah-3.svg', alt: 'It is finished—He did it for us!' }
      ],
      caption: 'Swipe to see Jesus give His life—for you! ❤️',
      videoId: 'bNq5tWl3OGk',
      videoTitle: 'Crucifixion and Death of Jesus – Animated Bible Stories!',
      keywords: ['crucifixion', 'cross', 'nails', 'john 19', 'love', 'finished', 'sacrifice'],
      kjvRef: 'John 19',
      kidContext: { who: 'Jesus', to: 'Everyone who will believe', apply: 'Jesus died because He loves you! That love is the greatest love ever.' }
    },
    tombEmpty: {
      title: 'The Empty Tomb',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Women come early to the tomb' },
        { src: 'panel-noah-2.svg', alt: 'The stone is rolled away!' },
        { src: 'panel-noah-3.svg', alt: 'An angel says: He is not here—He is risen!' }
      ],
      caption: 'Swipe to see the empty tomb—Jesus is alive! 🪨',
      videoId: '',
      videoTitle: '',
      keywords: ['tomb', 'empty', 'risen', 'matthew 28', 'angel', 'stone', 'resurrection'],
      kjvRef: 'Matthew 28',
      kidContext: { who: 'Jesus', to: 'The women (and us)', apply: 'Jesus is alive! Death couldn\'t hold Him—and He gives that life to you!' }
    },
    emmausRoad: {
      title: 'Road to Emmaus',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Two disciples walk to Emmaus, sad' },
        { src: 'panel-noah-2.svg', alt: 'A stranger joins them—it\'s Jesus!' },
        { src: 'panel-noah-3.svg', alt: 'He breaks bread—their eyes open!' }
      ],
      caption: 'Swipe to see Jesus walk with sad hearts—He walks with yours! 🛤️',
      videoId: '',
      videoTitle: '',
      keywords: ['emmaus', 'road', 'luke 24', 'disciples', 'walk', 'stranger', 'bread', 'recognize'],
      kjvRef: 'Luke 24',
      kidContext: { who: 'Jesus', to: 'Two disciples', apply: 'Jesus walks with you even when you don\'t recognize Him! He never leaves.' }
    },
    thomasDoubt: {
      title: 'Thomas Touches Jesus\' Hands',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Thomas says: I won\'t believe until I see!' },
        { src: 'panel-noah-2.svg', alt: 'Jesus appears and shows His hands' },
        { src: 'panel-noah-3.svg', alt: 'Thomas cries: My Lord and my God!' }
      ],
      caption: 'Swipe to see Jesus answer Thomas\'s doubts—He answers yours too! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['thomas', 'doubt', 'john 20', 'hands', 'believe', 'risen', 'faith'],
      kjvRef: 'John 20',
      kidContext: { who: 'Jesus', to: 'Thomas', apply: 'It\'s okay to have questions! Jesus is patient—keep coming back to Him.' }
    },
    pentecostFire: {
      title: 'Pentecost—Fire and Wind',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Disciples wait together in a room' },
        { src: 'panel-noah-2.svg', alt: 'Wind fills the house—fire on each head!' },
        { src: 'panel-noah-3.svg', alt: 'They speak in new languages—the Holy Spirit is here!' }
      ],
      caption: 'Swipe to see the Holy Spirit arrive with fire and wind! 🔥',
      videoId: '',
      videoTitle: '',
      keywords: ['pentecost', 'fire', 'wind', 'acts 2', 'holy spirit', 'tongues', 'disciples'],
      kjvRef: 'Acts 2',
      kidContext: { who: 'Holy Spirit', to: 'The disciples (and us)', apply: 'God\'s Spirit lives in you! He gives you power, love, and boldness.' }
    },
    peterShadow: {
      title: 'Peter\'s Shadow Heals',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Sick people line the streets' },
        { src: 'panel-noah-2.svg', alt: 'Peter walks by—his shadow touches them' },
        { src: 'panel-noah-3.svg', alt: 'They are healed! God\'s power is in His people' }
      ],
      caption: 'Swipe to see God\'s power flow through Peter! 🌟',
      videoId: '',
      videoTitle: '',
      keywords: ['peter', 'shadow', 'heal', 'acts 5', 'miracle', 'sick', 'power'],
      kjvRef: 'Acts 5',
      kidContext: { who: 'God', to: 'Peter (and us)', apply: 'God works through ordinary people! You carry His presence—make it count.' }
    },
    paulDamascus: {
      title: 'Paul on the Road to Damascus',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Saul rides to persecute Christians' },
        { src: 'panel-david-2.svg', alt: 'A blinding light—Jesus speaks: Why do you fight me?' },
        { src: 'panel-david-3.svg', alt: 'Saul becomes Paul—a new man!' }
      ],
      caption: 'Swipe to see God change Paul completely—He changes hearts! ⚡',
      videoId: 'oi95cv0tk9Q',
      videoTitle: 'Paul, Jesus, and the Road to Damascus – LifeKids!',
      keywords: ['paul', 'damascus', 'saul', 'acts 9', 'light', 'blind', 'change', 'conversion'],
      kjvRef: 'Acts 9',
      kidContext: { who: 'Jesus', to: 'Saul/Paul', apply: 'God can change anyone! No one is too far from His reach—not even you or your friends.' }
    },
    paulShipwreck: {
      title: 'Paul\'s Shipwreck',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul sails in a terrible storm' },
        { src: 'panel-noah-2.svg', alt: 'The ship breaks apart—Paul swims to shore' },
        { src: 'panel-noah-3.svg', alt: 'A snake bites Paul—he is fine! God protects him' }
      ],
      caption: 'Swipe to see Paul survive the storm—God keeps His own! ⛵',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'shipwreck', 'storm', 'acts 28', 'snake', 'island', 'protect'],
      kjvRef: 'Acts 28',
      kidContext: { who: 'God', to: 'Paul', apply: 'God protects His people through storms! When life gets hard, He keeps you safe.' }
    },
    paulSilas: {
      title: 'Paul and Silas Sing in Jail',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul and Silas are beaten and jailed' },
        { src: 'panel-noah-2.svg', alt: 'At midnight—they sing and pray!' },
        { src: 'panel-noah-3.svg', alt: 'An earthquake—the prison opens! They stay and the jailer believes' }
      ],
      caption: 'Swipe to see Paul and Silas worship in the dark! 🎶',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'silas', 'jail', 'acts 16', 'sing', 'pray', 'earthquake', 'midnight'],
      kjvRef: 'Acts 16',
      kidContext: { who: 'God', to: 'Paul and Silas', apply: 'Praise God even in hard places! Your worship opens doors—literally.' }
    },
    tenVirgins: {
      title: 'The Ten Virgins',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Ten virgins wait with lamps' },
        { src: 'panel-noah-2.svg', alt: 'Five are wise—they brought extra oil' },
        { src: 'panel-noah-3.svg', alt: 'Be ready—Jesus is coming!' }
      ],
      caption: 'Swipe to see the ten virgins—always be ready! 🪔',
      videoId: '',
      videoTitle: '',
      keywords: ['virgins', 'lamps', 'oil', 'matthew 25', 'ready', 'wise', 'foolish', 'return'],
      kjvRef: 'Matthew 25',
      kidContext: { who: 'Jesus', to: 'His followers (and us)', apply: 'Be ready! Fill up with God\'s Word and Spirit every day—don\'t run empty.' }
    },
    /* ── Week 8 (97–108) ── */
    armorShield: {
      title: 'The Shield of Faith',
      panels: [
        { src: 'panel-david-1.svg', alt: 'A knight holds up his shield' },
        { src: 'panel-david-2.svg', alt: 'Arrows of doubt and fear fly—blocked by faith' },
        { src: 'panel-david-3.svg', alt: 'Stand firm—faith stops every attack!' }
      ],
      caption: 'Swipe to see the shield of faith block every arrow! 🛡️',
      videoId: '',
      videoTitle: '',
      keywords: ['armor', 'shield', 'faith', 'ephesians 6', 'arrows', 'protect', 'stand'],
      kjvRef: 'Ephesians 6',
      kidContext: { who: 'Paul', to: 'Christians (and us)', apply: 'Hold up your shield of faith! When doubt or fear comes, believe—God blocks it.' }
    },
    armorSword: {
      title: 'The Sword of the Spirit',
      panels: [
        { src: 'panel-david-1.svg', alt: 'A sword labeled "Word of God"' },
        { src: 'panel-david-2.svg', alt: 'Jesus used Scripture against the devil' },
        { src: 'panel-david-3.svg', alt: 'Know God\'s Word—it\'s your best weapon!' }
      ],
      caption: 'Swipe to see the Word of God as your sword! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: ['armor', 'sword', 'word', 'ephesians 6', 'scripture', 'spirit', 'fight'],
      kjvRef: 'Ephesians 6',
      kidContext: { who: 'Paul', to: 'Christians (and us)', apply: 'Know your Bible! God\'s Word is a sword—it defeats darkness and confusion.' }
    },
    fruitSpirit: {
      title: 'Fruit of the Spirit',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A tree full of beautiful fruit' },
        { src: 'panel-noah-2.svg', alt: 'Love, joy, peace, patience—God\'s fruit' },
        { src: 'panel-noah-3.svg', alt: 'Stay connected to Jesus—grow good fruit!' }
      ],
      caption: 'Swipe to see the fruit God grows in you! 🍎',
      videoId: '',
      videoTitle: '',
      keywords: ['fruit', 'spirit', 'galatians 5', 'love', 'joy', 'peace', 'patience', 'kind'],
      kjvRef: 'Galatians 5',
      kidContext: { who: 'Holy Spirit', to: 'All believers (and us)', apply: 'Stay close to Jesus like a branch on a vine—good fruit grows naturally!' }
    },
    loveChapter: {
      title: 'Love Is Patient and Kind',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A heart shape glows with light' },
        { src: 'panel-noah-2.svg', alt: 'Love is patient, love is kind...' },
        { src: 'panel-noah-3.svg', alt: 'Love never fails—God is love!' }
      ],
      caption: 'Swipe to see what real love looks like! ❤️',
      videoId: '',
      videoTitle: '',
      keywords: ['love', '1 corinthians 13', 'patient', 'kind', 'heart', 'never fails'],
      kjvRef: '1 Corinthians 13',
      kidContext: { who: 'Paul', to: 'The church (and us)', apply: 'Love isn\'t a feeling—it\'s a choice! Choose to be patient and kind like God.' }
    },
    faithMustard: {
      title: 'Faith Like a Mustard Seed',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A tiny seed in someone\'s hand' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: this much faith moves mountains' },
        { src: 'panel-noah-3.svg', alt: 'Even small faith is enough—God does the rest!' }
      ],
      caption: 'Swipe to see how small faith can move mountains! 🏔️',
      videoId: '',
      videoTitle: '',
      keywords: ['faith', 'mustard seed', 'matthew 17', 'mountain', 'move', 'believe', 'small'],
      kjvRef: 'Matthew 17',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'You don\'t need huge faith—just genuine faith! Give it to God and watch.' }
    },
    prayerKnock: {
      title: 'Ask, Seek, Knock',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A person stands at a door and knocks' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: Ask and it will be given!' },
        { src: 'panel-noah-3.svg', alt: 'The door opens—God answers!' }
      ],
      caption: 'Swipe to see the promise: ask, seek, knock—He answers! 🚪',
      videoId: '',
      videoTitle: '',
      keywords: ['ask', 'seek', 'knock', 'matthew 7', 'prayer', 'door', 'answer', 'receive'],
      kjvRef: 'Matthew 7',
      kidContext: { who: 'Jesus', to: 'His followers (and us)', apply: 'Keep knocking! God loves when you keep coming to Him in prayer.' }
    },
    worryBirds: {
      title: 'Don\'t Worry—Look at the Birds',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Birds fly freely—they don\'t worry' },
        { src: 'panel-noah-2.svg', alt: 'Lilies grow without stress—God clothes them' },
        { src: 'panel-noah-3.svg', alt: 'You are worth more—God takes care of you!' }
      ],
      caption: 'Swipe to see why you don\'t need to worry—God\'s got you! 🐦',
      videoId: '',
      videoTitle: '',
      keywords: ['worry', 'birds', 'lilies', 'matthew 6', 'sparrows', 'care', 'trust'],
      kjvRef: 'Matthew 6',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'God feeds the birds—He definitely takes care of you! Don\'t worry; trust.' }
    },
    forgive70x7: {
      title: 'Forgive Seventy Times Seven',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Peter asks: how many times should I forgive?' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: seventy times seven—always!' },
        { src: 'panel-noah-3.svg', alt: 'Two brothers hug—forgiveness sets you free!' }
      ],
      caption: 'Swipe to see why forgiving feels so good! 🤗',
      videoId: '',
      videoTitle: '',
      keywords: ['forgive', '70 times', 'matthew 18', 'peter', 'always', 'mercy', 'hug'],
      kjvRef: 'Matthew 18',
      kidContext: { who: 'Jesus', to: 'Peter (and us)', apply: 'Forgiveness is never too much! When you forgive, you\'re free—not the other person.' }
    },
    widowMite: {
      title: 'The Widow\'s Two Coins',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Rich people put lots of money in the treasury' },
        { src: 'panel-noah-2.svg', alt: 'A poor widow puts in two tiny coins' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: she gave the most—she gave all!' }
      ],
      caption: 'Swipe to see the widow\'s offering—God sees the heart! 🪙',
      videoId: '',
      videoTitle: '',
      keywords: ['widow', 'mite', 'coins', 'mark 12', 'offering', 'give', 'heart', 'all'],
      kjvRef: 'Mark 12',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'God sees generosity, not amount! Give from your heart—even a little is big to God.' }
    },
    richYoungRuler: {
      title: 'The Rich Young Ruler',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A rich young man asks: what must I do to have eternal life?' },
        { src: 'panel-noah-2.svg', alt: 'Jesus says: sell all, give to the poor, follow me' },
        { src: 'panel-noah-3.svg', alt: 'He walks away sad—things can\'t satisfy like God' }
      ],
      caption: 'Swipe to see what matters more than stuff—Jesus! 💎',
      videoId: 'Z5tCVTOLnQ0',
      videoTitle: 'The Rich Young Ruler – Animated Bible Story!',
      keywords: ['rich', 'young ruler', 'mark 10', 'eternal life', 'camel', 'needle', 'follow'],
      kjvRef: 'Mark 10',
      kidContext: { who: 'Jesus', to: 'The rich young man (and us)', apply: 'Nothing is worth more than following Jesus! Let go of what holds you back.' }
    },
    maryAnoint: {
      title: 'Mary Anoints Jesus\' Feet',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mary breaks open expensive perfume' },
        { src: 'panel-noah-2.svg', alt: 'She pours it on Jesus\' feet and wipes with her hair' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: what she did will be remembered forever!' }
      ],
      caption: 'Swipe to see Mary\'s beautiful act of worship! 🌹',
      videoId: '',
      videoTitle: '',
      keywords: ['mary', 'anoint', 'perfume', 'john 12', 'feet', 'worship', 'pour'],
      kjvRef: 'John 12',
      kidContext: { who: 'Mary', to: 'Jesus', apply: 'Give Jesus your best—not just what\'s left! Extravagant love honors Him.' }
    },
    /* ── Week 9 (109–120) ── */
    stephenStones: {
      title: 'Stephen Sees Heaven',
      panels: [
        { src: 'panel-david-1.svg', alt: 'Stephen preaches boldly about Jesus' },
        { src: 'panel-david-2.svg', alt: 'They throw stones—Stephen looks up' },
        { src: 'panel-david-3.svg', alt: 'He sees Jesus standing—and forgives them!' }
      ],
      caption: 'Swipe to see Stephen\'s courage and forgiveness—amazing! 💎',
      videoId: '',
      videoTitle: '',
      keywords: ['stephen', 'stones', 'acts 7', 'forgive', 'heaven', 'bold', 'first martyr'],
      kjvRef: 'Acts 7',
      kidContext: { who: 'Jesus', to: 'Stephen', apply: 'Be bold for Jesus—even when it\'s hard! And always forgive like Stephen did.' }
    },
    philipChariot: {
      title: 'Philip and the Ethiopian',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Philip is sent to a desert road' },
        { src: 'panel-noah-2.svg', alt: 'An Ethiopian reads Isaiah in his chariot' },
        { src: 'panel-noah-3.svg', alt: 'Philip explains—the Ethiopian believes and is baptized!' }
      ],
      caption: 'Swipe to see Philip share the good news on the road! 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['philip', 'ethiopian', 'chariot', 'acts 8', 'isaiah', 'read', 'baptize', 'explain'],
      kjvRef: 'Acts 8',
      kidContext: { who: 'God', to: 'Philip (and us)', apply: 'Be ready to share Jesus wherever you go! God sets up divine appointments.' }
    },
    paulShip: {
      title: 'Paul\'s Ship in the Storm',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul sails toward Rome in a big storm' },
        { src: 'panel-noah-2.svg', alt: 'An angel says: fear not—all 276 will be safe' },
        { src: 'panel-noah-3.svg', alt: 'They swim to shore—everyone safe, just like God said!' }
      ],
      caption: 'Swipe to see God keep His word in the storm! ⛵',
      videoId: '',
      videoTitle: '',
      keywords: ['paul', 'ship', 'storm', 'acts 27', 'angel', 'safe', 'fear not'],
      kjvRef: 'Acts 27',
      kidContext: { who: 'God', to: 'Paul and the sailors', apply: 'God keeps His promises in storms! When you\'re afraid, His word says: fear not.' }
    },
    revelationThrone: {
      title: 'The Throne in Heaven',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'John sees an open door to heaven' },
        { src: 'panel-noah-2.svg', alt: 'A glorious throne surrounded by a rainbow' },
        { src: 'panel-noah-3.svg', alt: 'Elders bow and worship—heaven is amazing!' }
      ],
      caption: 'Swipe to see John\'s vision of God\'s throne! 🌈',
      videoId: '',
      videoTitle: '',
      keywords: ['revelation', 'throne', 'heaven', 'revelation 4', 'rainbow', 'elders', 'worship'],
      kidContext: { who: 'God', to: 'John (and us)', apply: 'Heaven is real and beautiful! Worship God now—that\'s what heaven is like forever.' }
    },
    fourHorsemen: {
      title: 'The Four Horsemen',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The Lamb opens four seals' },
        { src: 'panel-noah-2.svg', alt: 'Four horses come: white, red, black, pale' },
        { src: 'panel-noah-3.svg', alt: 'God shows what will happen—He is in control!' }
      ],
      caption: 'Swipe to see the four horses of Revelation! 🐎',
      videoId: '',
      videoTitle: '',
      keywords: ['horsemen', 'revelation 6', 'seals', 'white', 'red', 'black', 'pale', 'lamb'],
      kidContext: { who: 'God', to: 'John (and us)', apply: 'Even big scary things are in God\'s hands! He knows the end—and He wins.' }
    },
    alphaOmega: {
      title: 'I Am the Alpha and Omega',
      panels: [
        { src: 'panel-noah-1.svg', alt: '"I am the Alpha and Omega" says the Lord' },
        { src: 'panel-noah-2.svg', alt: 'The first and the last—the beginning and the end' },
        { src: 'panel-noah-3.svg', alt: 'Jesus is Lord of everything—always!' }
      ],
      caption: 'Swipe to see Jesus as the beginning and end of everything! ∞',
      videoId: '',
      videoTitle: '',
      keywords: ['alpha', 'omega', 'revelation 1', 'beginning', 'end', 'lord', 'eternal'],
      kidContext: { who: 'God', to: 'John (and us)', apply: 'God started everything and He finishes it! He has the first word and the last word.' }
    },
    newHeaven: {
      title: 'New Heaven and New Earth',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'God makes all things new!' },
        { src: 'panel-noah-2.svg', alt: 'No more tears, no more pain, no more death' },
        { src: 'panel-noah-3.svg', alt: 'God\'s home is with His people forever!' }
      ],
      caption: 'Swipe to see God\'s brand-new world—no more sad! 🏠',
      videoId: '',
      videoTitle: '',
      keywords: ['new heaven', 'earth', 'revelation 21', 'no tears', 'new', 'eternal', 'gold'],
      kidContext: { who: 'God', to: 'All His people', apply: 'The best is coming! A new world with no pain, no sadness—only God and joy.' }
    },
    treeOfLife: {
      title: 'The Tree of Life',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A beautiful tree grows by the river' },
        { src: 'panel-noah-2.svg', alt: 'It bears twelve kinds of fruit every month' },
        { src: 'panel-noah-3.svg', alt: 'Its leaves heal the nations—God provides!' }
      ],
      caption: 'Swipe to see the Tree of Life in the new city! 🌿',
      videoId: '',
      videoTitle: '',
      keywords: ['tree of life', 'revelation 22', 'fruit', 'heal', 'leaves', 'river', 'nations'],
      kidContext: { who: 'God', to: 'His people in the new creation', apply: 'God\'s healing never runs out! In His new world, everything is made whole.' }
    },
    riverOfLife: {
      title: 'The River of Life',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A crystal-clear river flows from the throne' },
        { src: 'panel-noah-2.svg', alt: 'The tree of life grows on both banks' },
        { src: 'panel-noah-3.svg', alt: 'God\'s throne is there—eternal life!' }
      ],
      caption: 'Swipe to see the river flowing from God\'s throne! 💧',
      videoId: '',
      videoTitle: '',
      keywords: ['river', 'life', 'revelation 22', 'crystal', 'throne', 'tree', 'eternal'],
      kidContext: { who: 'God', to: 'All His people', apply: 'Living water flows from God forever! Come to Him—He is the source of all life.' }
    },
    lambBook: {
      title: 'The Lamb\'s Book of Life',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A great book is opened before the throne' },
        { src: 'panel-noah-2.svg', alt: 'Names are written—those who belong to Jesus' },
        { src: 'panel-noah-3.svg', alt: 'Believe in Jesus—your name is in it!' }
      ],
      caption: 'Swipe to see the Book of Life—is your name written? 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['lamb', 'book of life', 'revelation 21', 'names', 'written', 'believe', 'eternal'],
      kidContext: { who: 'God', to: 'All who believe', apply: 'Believe in Jesus and your name is in the Lamb\'s Book of Life! That\'s the best news.' }
    },
    dragonFight: {
      title: 'Michael Fights the Dragon',
      panels: [
        { src: 'panel-david-1.svg', alt: 'A great dragon fights in heaven' },
        { src: 'panel-david-2.svg', alt: 'Michael and the angels battle the dragon' },
        { src: 'panel-david-3.svg', alt: 'The dragon is thrown down—God\'s angels win!' }
      ],
      caption: 'Swipe to see Michael fight the dragon—God\'s angels win! ⚔️',
      videoId: '',
      videoTitle: '',
      keywords: ['dragon', 'michael', 'revelation 12', 'angels', 'battle', 'heaven', 'satan', 'fight'],
      kidContext: { who: 'God', to: 'John (and us)', apply: 'God\'s angels fight for you! Evil is already beaten—Jesus won at the cross.' }
    },
    beastMark: {
      title: 'The Number 666',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'John sees a beast—a symbol of evil power' },
        { src: 'panel-noah-2.svg', alt: '666 is the number—a warning to stay true' },
        { src: 'panel-noah-3.svg', alt: 'Choose God\'s mark—belong to Jesus, not the world!' }
      ],
      caption: 'Swipe to see why belonging to Jesus is everything! 🔑',
      videoId: '',
      videoTitle: '',
      keywords: ['beast', '666', 'revelation 13', 'mark', 'forehead', 'warning', 'choose'],
      kidContext: { who: 'God', to: 'John (and us)', apply: 'Choose Jesus—belong to Him, not the world! His mark of love is the one that lasts.' }
    },
    /* ── Week 10 (121–132) ── */
    rahabWindow: {
      title: 'Rahab Hangs the Cord',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Rahab lets the spies down by a rope' },
        { src: 'panel-noah-2.svg', alt: 'She ties the scarlet cord in the window' },
        { src: 'panel-noah-3.svg', alt: 'God keeps His promise—she is saved!' }
      ],
      caption: 'Swipe to see Rahab\'s faith and God\'s promise! 🔴',
      videoId: '',
      videoTitle: '',
      keywords: ['rahab', 'window', 'cord', 'scarlet', 'joshua 2', 'rope', 'faith', 'save'],
      kidContext: { who: 'God', to: 'Rahab', apply: 'Even outsiders are welcomed by God! Faith is the cord that saves—hold on!' }
    },
    deborahJudge: {
      title: 'Deborah the Judge',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Deborah sits under the palm tree judging' },
        { src: 'panel-noah-2.svg', alt: 'She calls Barak to lead—but goes herself!' },
        { src: 'panel-noah-3.svg', alt: 'Israel is delivered—God uses Deborah!' }
      ],
      caption: 'Swipe to see Deborah lead Israel with wisdom and courage! 🌴',
      videoId: '',
      videoTitle: '',
      keywords: ['deborah', 'judge', 'palm tree', 'judges 4', 'barak', 'brave', 'leader'],
      kidContext: { who: 'God', to: 'Deborah (and us)', apply: 'God uses girls too! Be brave, be wise—He can use you in big ways.' }
    },
    jaelTent: {
      title: 'Jael\'s Courage',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The enemy general Sisera flees to Jael\'s tent' },
        { src: 'panel-noah-2.svg', alt: 'Jael gives him shelter—and courage to act' },
        { src: 'panel-noah-3.svg', alt: 'God\'s victory comes through unexpected hands!' }
      ],
      caption: 'Swipe to see God win through brave Jael! ⛺',
      videoId: '',
      videoTitle: '',
      keywords: ['jael', 'tent', 'sisera', 'judges 4', 'peg', 'courage', 'victory'],
      kidContext: { who: 'God', to: 'Jael', apply: 'God uses ordinary people in extraordinary moments! Be ready—your moment may come.' }
    },
    abigailWise: {
      title: 'Abigail\'s Wisdom',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'David\'s men are angry—Nabal was rude' },
        { src: 'panel-noah-2.svg', alt: 'Abigail quickly brings bread and gifts' },
        { src: 'panel-noah-3.svg', alt: 'David\'s anger calms—wise words prevent disaster!' }
      ],
      caption: 'Swipe to see Abigail use wisdom to stop a fight! 🍞',
      videoId: '',
      videoTitle: '',
      keywords: ['abigail', 'wise', 'nabal', '1 samuel 25', 'bread', 'donkey', 'peace', 'wisdom'],
      kidContext: { who: 'God', to: 'Abigail (and us)', apply: 'Wise words stop anger and save lives! Be quick to bring peace, not fuel.' }
    },
    hannahPray: {
      title: 'Hannah Prays for a Baby',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Hannah weeps and prays at the temple' },
        { src: 'panel-noah-2.svg', alt: 'She makes a vow to God' },
        { src: 'panel-noah-3.svg', alt: 'God answers—baby Samuel is born!' }
      ],
      caption: 'Swipe to see God answer Hannah\'s prayer! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['hannah', 'pray', 'baby', '1 samuel 1', 'temple', 'samuel', 'vow', 'answer'],
      kidContext: { who: 'God', to: 'Hannah', apply: 'God hears every prayer! Pour out your heart—He is listening and He cares.' }
    },
    maryMagdalene: {
      title: 'Mary Magdalene at the Tomb',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mary comes early, weeping at the empty tomb' },
        { src: 'panel-noah-2.svg', alt: 'She sees Jesus—mistakes Him for the gardener' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says her name: Mary! She knows Him!' }
      ],
      caption: 'Swipe to see the moment Jesus called Mary\'s name! 🌅',
      videoId: '',
      videoTitle: '',
      keywords: ['mary magdalene', 'tomb', 'john 20', 'risen', 'gardener', 'name', 'love'],
      kidContext: { who: 'Jesus', to: 'Mary Magdalene', apply: 'Jesus knows your name and calls you! He is always the first to find His own.' }
    },
    lydiaSell: {
      title: 'Lydia Opens Her Heart',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Lydia sells purple cloth by the river' },
        { src: 'panel-noah-2.svg', alt: 'Paul preaches—Lydia listens carefully' },
        { src: 'panel-noah-3.svg', alt: 'God opens her heart—she believes and is baptized!' }
      ],
      caption: 'Swipe to see Lydia\'s open heart—God opens our hearts! 💜',
      videoId: '',
      videoTitle: '',
      keywords: ['lydia', 'purple', 'acts 16', 'cloth', 'believe', 'baptize', 'heart', 'open'],
      kidContext: { who: 'God', to: 'Lydia', apply: 'God is the one who opens our hearts to believe! Ask Him to open yours.' }
    },
    priscillaTeach: {
      title: 'Priscilla and Aquila Teach',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Priscilla and Aquila hear Apollos preach' },
        { src: 'panel-noah-2.svg', alt: 'They invite him and teach him more fully' },
        { src: 'panel-noah-3.svg', alt: 'Apollos grows—we all need good teachers!' }
      ],
      caption: 'Swipe to see Priscilla teach Apollos—help each other grow! 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['priscilla', 'aquila', 'apollos', 'acts 18', 'teach', 'tent', 'explain', 'grow'],
      kidContext: { who: 'God', to: 'Priscilla, Aquila, and Apollos', apply: 'Help each other understand God better! Teaching is one of God\'s gifts.' }
    },
    ruthMoab: {
      title: 'Ruth Stays with Naomi',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Ruth and Naomi at a crossroads' },
        { src: 'panel-noah-2.svg', alt: 'Ruth says: wherever you go, I will go!' },
        { src: 'panel-noah-3.svg', alt: 'Ruth gleans in Boaz\'s field—God provides!' }
      ],
      caption: 'Swipe to see Ruth\'s faithful love for Naomi! 🌾',
      videoId: '',
      videoTitle: '',
      keywords: ['ruth', 'naomi', 'moab', 'ruth 2', 'loyal', 'wherever', 'field', 'faithful'],
      kidContext: { who: 'God', to: 'Ruth', apply: 'Stick with those you love even in hard times! Loyalty is a gift—and God honors it.' }
    },
    estherFast: {
      title: 'Esther Fasts and Goes to the King',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mordecai tells Esther: you must act!' },
        { src: 'panel-noah-2.svg', alt: 'Esther fasts three days with all the Jews' },
        { src: 'panel-noah-3.svg', alt: 'Esther goes to the king—scepter out, she\'s safe!' }
      ],
      caption: 'Swipe to see Esther fast, pray, and step out brave! 👑',
      videoId: '',
      videoTitle: '',
      keywords: ['esther', 'fast', 'esther 4', 'scepter', 'pray', 'brave', 'mordecai'],
      kidContext: { who: 'God', to: 'Esther', apply: 'Fast, pray, then go! God gives courage to those who seek Him first.' }
    },
    sarahPromise: {
      title: 'Sarah Receives the Promise',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'God promises Sarah a baby—at 90!' },
        { src: 'panel-noah-2.svg', alt: 'She laughed—but God said: is anything too hard?' },
        { src: 'panel-noah-3.svg', alt: 'Baby Isaac is born—the promise kept!' }
      ],
      caption: 'Swipe to see God keep His promise to Sarah! 👶',
      videoId: '',
      videoTitle: '',
      keywords: ['sarah', 'promise', 'genesis 18', 'isaac', 'laugh', 'impossible', 'faithful'],
      kidContext: { who: 'God', to: 'Sarah', apply: 'God always keeps His promises! Even the ones that seem impossible are safe in His hands.' }
    },
    miriamSong: {
      title: 'Miriam Sings to the Lord',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Israel is safe on the other side of the sea' },
        { src: 'panel-noah-2.svg', alt: 'Miriam takes her tambourine and leads the women' },
        { src: 'panel-noah-3.svg', alt: 'She sings: The Lord has triumphed gloriously!' }
      ],
      caption: 'Swipe to see Miriam lead worship by the sea! 🥁',
      videoId: '',
      videoTitle: '',
      keywords: ['miriam', 'song', 'tambourine', 'exodus 15', 'worship', 'dance', 'sea', 'praise'],
      kidContext: { who: 'God', to: 'Miriam (and us)', apply: 'When God saves you—sing about it! Let praise pour out.' }
    },
    /* ── Week 11 (133–144) ── */
    annaProphet: {
      title: 'Anna the Prophetess',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Anna prays in the temple day and night' },
        { src: 'panel-noah-2.svg', alt: 'Mary and Joseph bring baby Jesus to the temple' },
        { src: 'panel-noah-3.svg', alt: 'Anna sees Jesus—she praises God!' }
      ],
      caption: 'Swipe to see Anna recognize baby Jesus—she never stopped praying! 🕍',
      videoId: '',
      videoTitle: '',
      keywords: ['anna', 'prophet', 'temple', 'luke 2', 'baby jesus', 'pray', 'praise'],
      kidContext: { who: 'God', to: 'Anna', apply: 'Never stop praying! Like Anna—stay close to God and He will show you His glory.' }
    },
    widowOil: {
      title: 'The Widow\'s Endless Oil',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A widow owes money—only a little oil left' },
        { src: 'panel-noah-2.svg', alt: 'Elisha says: pour into every jar you can find' },
        { src: 'panel-noah-3.svg', alt: 'Oil fills every jar—God provides more than enough!' }
      ],
      caption: 'Swipe to see God\'s endless supply for the widow! 🫙',
      videoId: '',
      videoTitle: '',
      keywords: ['widow', 'oil', 'elisha', '2 kings 4', 'jars', 'multiply', 'provide'],
      kidContext: { who: 'God', to: 'The widow through Elisha', apply: 'God\'s supply never runs out! Bring what little you have—He multiplies it.' }
    },
    persistentWidow: {
      title: 'The Persistent Widow',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A widow goes to the judge day after day' },
        { src: 'panel-noah-2.svg', alt: 'The judge refuses—but she keeps coming back' },
        { src: 'panel-noah-3.svg', alt: 'He finally helps her—keep praying, God hears!' }
      ],
      caption: 'Swipe to see the woman who kept asking—and got her answer! 🚪',
      videoId: '',
      videoTitle: '',
      keywords: ['widow', 'persistent', 'judge', 'luke 18', 'keep asking', 'prayer', 'justice'],
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Don\'t give up in prayer! God always answers those who keep coming to Him.' }
    },
    samaritanWoman: {
      title: 'The Woman at the Well',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A Samaritan woman draws water at noon' },
        { src: 'panel-noah-2.svg', alt: 'Jesus asks for water—she\'s surprised He\'d talk to her' },
        { src: 'panel-noah-3.svg', alt: 'He offers living water—she runs to tell everyone!' }
      ],
      caption: 'Swipe to see Jesus change a woman\'s life at the well! 💧',
      videoId: '',
      videoTitle: '',
      keywords: ['samaritan', 'woman', 'well', 'john 4', 'water', 'living water', 'believe', 'tell'],
      kidContext: { who: 'Jesus', to: 'The Samaritan woman', apply: 'Jesus talks to everyone—even those people ignore! He offers living water to all.' }
    },
    marthaServe: {
      title: 'Martha Serves Jesus',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Martha busily prepares food for Jesus' },
        { src: 'panel-noah-2.svg', alt: 'She asks: don\'t you care I\'m doing all this?' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: one thing is needed—choose the best thing!' }
      ],
      caption: 'Swipe to see what Jesus says about busyness and rest! 🍽️',
      videoId: '',
      videoTitle: '',
      keywords: ['martha', 'serve', 'luke 10', 'busy', 'kitchen', 'best', 'mary', 'one thing'],
      kidContext: { who: 'Jesus', to: 'Martha', apply: 'Don\'t be so busy you miss being with Jesus! Choose His presence first—then serve.' }
    },
    marySit: {
      title: 'Mary Sits at Jesus\' Feet',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Mary sits and listens to Jesus' },
        { src: 'panel-noah-2.svg', alt: 'Martha is busy—Mary sits still' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: Mary chose the better thing!' }
      ],
      caption: 'Swipe to see Mary choose the one thing that matters—listening! 👂',
      videoId: '',
      videoTitle: '',
      keywords: ['mary', 'sit', 'listen', 'luke 10', 'feet', 'better thing', 'jesus', 'word'],
      kidContext: { who: 'Jesus', to: 'Mary (and us)', apply: 'Sit with Jesus! Listening to Him is the most important thing you can do each day.' }
    },
    dorcasRaise: {
      title: 'Dorcas Is Raised to Life',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Dorcas loved people—she made clothes for the poor' },
        { src: 'panel-noah-2.svg', alt: 'She died—friends mourn and call Peter' },
        { src: 'panel-noah-3.svg', alt: 'Peter prays—she opens her eyes! Life again!' }
      ],
      caption: 'Swipe to see Dorcas raised back to life! 🧵',
      videoId: '',
      videoTitle: '',
      keywords: ['dorcas', 'raise', 'acts 9', 'peter', 'clothes', 'poor', 'widow', 'life'],
      kidContext: { who: 'God', to: 'Dorcas and Peter', apply: 'Your kindness matters to God! And He can raise what seems dead to life again.' }
    },
    phoebeDeacon: {
      title: 'Phoebe the Deacon',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul writes: Phoebe is a deacon of the church' },
        { src: 'panel-noah-2.svg', alt: 'She carries Paul\'s letter to Rome' },
        { src: 'panel-noah-3.svg', alt: 'She serves faithfully—a helper of many!' }
      ],
      caption: 'Swipe to see Phoebe faithfully serve God\'s people! ✉️',
      videoId: '',
      videoTitle: '',
      keywords: ['phoebe', 'deacon', 'romans 16', 'letter', 'rome', 'serve', 'faithful'],
      kidContext: { who: 'God', to: 'Phoebe (and us)', apply: 'Faithful service matters! Like Phoebe—do your part well and God calls it great.' }
    },
    juniaApostle: {
      title: 'Junia the Apostle',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Paul greets Andronicus and Junia in Romans' },
        { src: 'panel-noah-2.svg', alt: 'He calls them outstanding among the apostles' },
        { src: 'panel-noah-3.svg', alt: 'Junia was in prison for the gospel—so brave!' }
      ],
      caption: 'Swipe to see Junia honored as a brave servant of Jesus! 🌟',
      videoId: '',
      videoTitle: '',
      keywords: ['junia', 'apostle', 'romans 16', 'paul', 'brave', 'gospel', 'outstanding'],
      kidContext: { who: 'God', to: 'Junia (and us)', apply: 'God calls you by name and honors your faithfulness! You are seen and valued.' }
    },
    loisTimothy: {
      title: 'Lois Passes Faith to Timothy',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Lois is Timothy\'s grandmother and a woman of faith' },
        { src: 'panel-noah-2.svg', alt: 'She teaches Timothy God\'s Word from childhood' },
        { src: 'panel-noah-3.svg', alt: 'Timothy becomes a great minister—faith passed on!' }
      ],
      caption: 'Swipe to see how Grandma Lois shaped Timothy\'s faith! 📖',
      videoId: '',
      videoTitle: '',
      keywords: ['lois', 'timothy', '2 timothy 1', 'grandmother', 'faith', 'scripture', 'teach'],
      kidContext: { who: 'God', to: 'Lois and Timothy', apply: 'Faith is passed on! Listen to godly people in your family—they give you something priceless.' }
    },
    euniceMother: {
      title: 'Eunice: A Faithful Mother',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Eunice is Timothy\'s mother' },
        { src: 'panel-noah-2.svg', alt: 'She teaches him scripture as a child' },
        { src: 'panel-noah-3.svg', alt: 'Timothy grows up to serve God—thank you, Mom!' }
      ],
      caption: 'Swipe to see how a faithful mom changes the world! 💛',
      videoId: '',
      videoTitle: '',
      keywords: ['eunice', 'mother', '2 timothy 1', 'timothy', 'scripture', 'teach', 'faith'],
      kidContext: { who: 'God', to: 'Eunice and Timothy', apply: 'Thank God for people who teach you His Word! A faithful mom is a gift from heaven.' }
    },
    priscillaTent: {
      title: 'Priscilla and Aquila: Tentmakers',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Priscilla and Aquila make tents for a living' },
        { src: 'panel-noah-2.svg', alt: 'Paul works with them—they grow together' },
        { src: 'panel-noah-3.svg', alt: 'Their home becomes a church—faithful servants!' }
      ],
      caption: 'Swipe to see how Priscilla and Aquila served God together! ⛺',
      videoId: '',
      videoTitle: '',
      keywords: ['priscilla', 'tent', 'aquila', 'acts 18', 'paul', 'work', 'church', 'teach'],
      kidContext: { who: 'God', to: 'Priscilla and Aquila', apply: 'Your home can be a place where God works! Serve Him together with your family.' }
    },
    /* ── Week 12 (145–160) ── */
    lazarus: {
      title: 'Jesus Raises Lazarus',
      panels: [
        { src: 'panel-noah-1.svg', alt: "Mary and Martha sad – Lazarus is dead" },
        { src: 'panel-noah-2.svg', alt: "Jesus at the tomb – Calling Lazarus out" },
        { src: 'panel-noah-3.svg', alt: "Lazarus walking out alive – Jesus has power over death" }
      ],
      caption: 'Swipe to see Jesus raise Lazarus from the dead! 🪨',
      videoId: '1FT04jjh3Q8',
      videoTitle: 'Jesus Raised Lazarus – God\'s Story!',
      keywords: ['lazarus', 'raise', 'john 11', 'resurrection', 'mary', 'martha', 'come out'],
      kjvRef: 'John 11:43-44',
      kidContext: { who: 'Jesus', to: 'Mary and Martha (and us)', apply: "Lazarus was dead for 4 days, but Jesus called him out of the tomb. Lazarus came back to life! Jesus has power over death. When we feel sad or hopeless, Jesus can bring new life and hope. Trust Him—He is the resurrection and the life." },
      narration: "Lazarus Rise – John 11:43-44. Lazarus was very sick, and his sisters Mary and Martha sent for Jesus. But Jesus waited. When He arrived, Lazarus had died and was in the tomb for 4 days. Jesus went to the tomb and said, 'Lazarus, come forth!' Lazarus came out, still wrapped in grave clothes. Jesus said, 'Loose him, and let him go.' Everyone was amazed—Jesus has power over death! For you: When things feel dead or hopeless, Jesus can bring new life. He is the resurrection. Trust Him with your hardest days—He has power to make things new."
    },
    greatCommission: {
      title: 'The Great Commission',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus appears on a mountain in Galilee' },
        { src: 'panel-noah-2.svg', alt: 'He says: Go and make disciples of all nations' },
        { src: 'panel-noah-3.svg', alt: 'And I am with you always—to the end!' }
      ],
      caption: 'Swipe to see Jesus send His followers to the whole world! 🌍',
      videoId: '',
      videoTitle: '',
      keywords: ['great commission', 'matthew 28', 'go', 'make disciples', 'baptize', 'nations', 'with you always'],
      kjvRef: 'Matthew 28',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'You are sent! Tell everyone the good news—and Jesus is with you every step.' }
    },
    ascension: {
      title: 'Jesus Ascends to Heaven',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus blesses His disciples' },
        { src: 'panel-noah-2.svg', alt: 'He rises up—a cloud takes Him away' },
        { src: 'panel-noah-3.svg', alt: 'Angels say: He will come back the same way!' }
      ],
      caption: 'Swipe to see Jesus go up to heaven—He\'s coming back! ☁️',
      videoId: 'TedR27BUBfw',
      videoTitle: 'Jesus Goes to Heaven – Stories of the Bible!',
      keywords: ['ascension', 'acts 1', 'heaven', 'cloud', 'angels', 'return', 'go'],
      kjvRef: 'Acts 1',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Jesus went to prepare a place for you! He is coming back—be ready and joyful.' }
    },
    pentecostTongues: {
      title: 'Tongues of Fire at Pentecost',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Disciples wait in prayer together' },
        { src: 'panel-noah-2.svg', alt: 'Fire rests on each one—they speak in new languages' },
        { src: 'panel-noah-3.svg', alt: 'Three thousand believe that day—the church begins!' }
      ],
      caption: 'Swipe to see the Holy Spirit arrive with fire! 🔥',
      videoId: '',
      videoTitle: '',
      keywords: ['pentecost', 'tongues', 'acts 2', 'fire', 'languages', 'spirit', 'church', 'power'],
      kjvRef: 'Acts 2',
      kidContext: { who: 'Holy Spirit', to: 'The disciples (and all believers)', apply: 'God\'s Spirit lives in you! You have power to tell the world about Jesus.' }
    },
    armorBelt: {
      title: 'Belt of Truth',
      panels: [
        { src: 'panel-david-1.svg', alt: 'A warrior puts on the belt of truth' },
        { src: 'panel-david-2.svg', alt: 'Truth holds everything together' },
        { src: 'panel-david-3.svg', alt: 'Stand firm in God\'s truth—it never changes!' }
      ],
      caption: 'Swipe to see the belt of truth—God\'s Word holds it all! 🪢',
      videoId: '',
      videoTitle: '',
      keywords: ['armor', 'belt', 'truth', 'ephesians 6', 'stand', 'firm', 'word'],
      kjvRef: 'Ephesians 6',
      kidContext: { who: 'Paul', to: 'Christians (and us)', apply: 'Truth is your foundation! Know what God says—and stand on it every day.' }
    },
    prayerCloset: {
      title: 'Pray in Your Closet',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus says: go into your room and shut the door' },
        { src: 'panel-noah-2.svg', alt: 'Pray to your Father in secret' },
        { src: 'panel-noah-3.svg', alt: 'Your Father who sees in secret will reward you!' }
      ],
      caption: 'Swipe to see how to pray in private—God loves it! 🚪',
      videoId: '',
      videoTitle: '',
      keywords: ['prayer', 'closet', 'matthew 6', 'secret', 'room', 'father', 'reward'],
      kjvRef: 'Matthew 6',
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Private prayer matters most! Find a quiet place and just talk to God—He\'s listening.' }
    },
    faithMountain: {
      title: 'Faith That Moves Mountains',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus says: if you have faith as a mustard seed' },
        { src: 'panel-noah-2.svg', alt: 'Nothing will be impossible for you' },
        { src: 'panel-noah-3.svg', alt: 'A mountain moves—because faith in God does the impossible!' }
      ],
      caption: 'Swipe to see how faith really moves mountains! 🏔️',
      videoId: '',
      videoTitle: '',
      keywords: ['faith', 'mountain', 'matthew 17', 'impossible', 'mustard', 'move', 'believe'],
      kidContext: { who: 'Jesus', to: 'His disciples (and us)', apply: 'Say it out loud: nothing is impossible with God! Your faith moves things in the spirit.' }
    },
    loveNeighbor: {
      title: 'Love Your Neighbor',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A lawyer asks: who is my neighbor?' },
        { src: 'panel-noah-2.svg', alt: 'The Samaritan stops to help the wounded man' },
        { src: 'panel-noah-3.svg', alt: 'Jesus says: go and do the same!' }
      ],
      caption: 'Swipe to see what loving your neighbor really looks like! ❤️',
      videoId: '',
      videoTitle: '',
      keywords: ['neighbor', 'love', 'luke 10', 'good samaritan', 'help', 'stranger', 'kind'],
      kidContext: { who: 'Jesus', to: 'The lawyer (and us)', apply: 'Your neighbor is anyone who needs help! Go—be the one who stops and cares.' }
    },
    heavenDoor: {
      title: 'The Door to Heaven',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'Jesus says: I stand at the door and knock' },
        { src: 'panel-noah-2.svg', alt: 'If anyone opens—I will come in!' },
        { src: 'panel-noah-3.svg', alt: 'Open the door to Jesus—He is waiting!' }
      ],
      caption: 'Swipe to see Jesus knock on your heart\'s door—open it! 🚪',
      videoId: '',
      videoTitle: '',
      keywords: ['door', 'knock', 'revelation 3', 'come in', 'heart', 'jesus', 'open'],
      kidContext: { who: 'Jesus', to: 'The church (and us)', apply: 'Jesus is knocking right now! Open the door—He wants to come in and stay.' }
    },
    revelationBride: {
      title: 'The Lamb and His Bride',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The new city comes down—adorned like a bride' },
        { src: 'panel-noah-2.svg', alt: 'The marriage supper of the Lamb!' },
        { src: 'panel-noah-3.svg', alt: 'God with His people—forever and ever!' }
      ],
      caption: 'Swipe to see the great wedding day—Jesus and His people! 💍',
      videoId: '',
      videoTitle: '',
      keywords: ['bride', 'lamb', 'revelation 21', 'wedding', 'supper', 'feast', 'forever'],
      kidContext: { who: 'God', to: 'All His people', apply: 'The best day is coming—Jesus\' wedding feast! All who believe are invited—that means you!' }
    },
    treeFruit: {
      title: 'The Tree That Heals Nations',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The tree of life grows by the river' },
        { src: 'panel-noah-2.svg', alt: 'Its leaves heal every nation' },
        { src: 'panel-noah-3.svg', alt: 'In God\'s city—everything is made whole!' }
      ],
      caption: 'Swipe to see the healing tree in God\'s new city! 🌿',
      videoId: '',
      videoTitle: '',
      keywords: ['tree', 'fruit', 'revelation 22', 'heal', 'nations', 'leaves', 'life'],
      kidContext: { who: 'God', to: 'All creation', apply: 'God\'s healing reaches every nation! His love is for everyone—share it.' }
    },
    noNight: {
      title: 'No Night in God\'s City',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'The new city glows—no sun or moon needed' },
        { src: 'panel-noah-2.svg', alt: 'God\'s glory is the light' },
        { src: 'panel-noah-3.svg', alt: 'No night there—God\'s light never goes out!' }
      ],
      caption: 'Swipe to see a world lit only by God\'s glory! ☀️',
      videoId: '',
      videoTitle: '',
      keywords: ['night', 'light', 'revelation 22', 'glory', 'god', 'city', 'shine', 'dark'],
      kidContext: { who: 'God', to: 'All His people', apply: 'You never need to be afraid of the dark—God\'s light is coming! And it lasts forever.' }
    },
    everyKneeBow: {
      title: 'Every Knee Shall Bow',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'A great throne of glory' },
        { src: 'panel-noah-2.svg', alt: 'Every knee bows—in heaven and on earth' },
        { src: 'panel-noah-3.svg', alt: 'Every tongue confesses: Jesus Christ is Lord!' }
      ],
      caption: 'Swipe to see every knee bow to Jesus—the day is coming! 🙇',
      videoId: '',
      videoTitle: '',
      keywords: ['knee bow', 'philippians 2', 'every tongue', 'lord', 'throne', 'praise', 'glory'],
      kidContext: { who: 'God', to: 'All people', apply: 'One day everyone will know Jesus is Lord! Choose to bow your heart to Him now—gladly.' }
    },
    newEarth: {
      title: 'The New Earth',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'God says: Behold, I make all things new!' },
        { src: 'panel-noah-2.svg', alt: 'No more pain, no more crying, no more death' },
        { src: 'panel-noah-3.svg', alt: 'The new earth—perfected and full of God\'s love!' }
      ],
      caption: 'Swipe to see God\'s brand-new perfect earth! 🌍',
      videoId: '',
      videoTitle: '',
      keywords: ['new earth', 'revelation 21', 'all things new', 'no pain', 'perfect', 'eternal', 'glory'],
      kidContext: { who: 'God', to: 'All creation', apply: 'The best world is coming! God is making all things new—and He never makes anything bad.' }
    },
    alphaOmega2: {
      title: 'Alpha and Omega—The End',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'I am the Alpha and the Omega, the First and Last' },
        { src: 'panel-noah-2.svg', alt: 'The beginning and the end—Jesus is eternal' },
        { src: 'panel-noah-3.svg', alt: 'He was, He is, and He is to come—forever!' }
      ],
      caption: 'Swipe to see Jesus: the beginning, middle, and end of everything! ∞',
      videoId: '',
      videoTitle: '',
      keywords: ['alpha omega', 'revelation 22', 'first', 'last', 'beginning', 'end', 'eternal', 'forever'],
      kidContext: { who: 'Jesus', to: 'All creation', apply: 'Jesus is the start and finish of your story too! Give Him every chapter.' }
    },
    comeLordJesus: {
      title: '"Come, Lord Jesus!"',
      panels: [
        { src: 'panel-noah-1.svg', alt: 'John hears Jesus say: I am coming quickly!' },
        { src: 'panel-noah-2.svg', alt: 'John answers: Amen—come, Lord Jesus!' },
        { src: 'panel-noah-3.svg', alt: 'Every heart that loves Him says: come!' }
      ],
      caption: 'Swipe to hear the last prayer in the Bible—come, Lord Jesus! 🙏',
      videoId: '',
      videoTitle: '',
      keywords: ['come lord jesus', 'revelation 22', 'amen', 'quickly', 'maranatha', 'last', 'return'],
      kjvRef: 'Revelation 22',
      kidContext: { who: 'Jesus', to: 'John (and us)', apply: 'The last word of the Bible is a prayer: Come, Lord Jesus! Say it with your whole heart.' }
    }
  };

  function getCartoonForVerse(ref, text, index) {
    var low = (ref + ' ' + text).toLowerCase();
    var dayIndex = index;
    var isWeeklyStory = (dayIndex % 7) === 0;
    var storyKeys = [
      'david', 'noah', 'jesus', 'jonah', 'daniel', 'adamEve', 'cainAbel', 'towerBabel',
      'abrahamIsaac', 'josephCoat', 'josephSold', 'josephDreams', 'josephPrison', 'pharaohDreams', 'josephRuler', 'mosesBaby', 'mosesBush', 'redSea', 'manna', 'tenCommandments', 'goldenCalf', 'spiesInCanaan',
      'samson', 'fieryFurnace', 'esther', 'jesusBirth', 'jesusCalmsStorm', 'jesusFeeds5000',
      'goodSamaritan', 'prodigalSon', 'zacchaeus', 'lazarus', 'resurrection', 'creation',
      'fallOfJericho', 'davidSheep', 'elijahFire', 'elishaOil', 'naaman', 'jesusWalksWater',
      'lostSheep', 'palmSunday', 'lastSupper', 'jesusTemptation', 'parableSower',
      'richYoungRuler', 'widowsMite', 'gardenPrayer', 'betrayal', 'trial', 'crucifixion',
      'roadToEmmaus', 'ascension', 'pentecost', 'stephen', 'paulDamascus', 'heavenPromise',
      'ruthBoaz', 'parableTalents', 'armorOfGod',
      /* Week 1 */
      'mosesSea', 'burningBush', 'tenPlagues', 'manna', 'tenCommandments', 'elijahFire',
      'elishaOil', 'naamanDip', 'creationLight', 'adamEve', 'towerBabel',
      /* Week 2 */
      'abrahamIsaac', 'sarahLaughs', 'jacobLadder', 'josephDreams', 'josephPrison',
      'pharaohDreams', 'josephRuler', 'mosesBaby', 'mosesStaffSnake', 'passoverLamb', 'redSeaCrossing',
      /* Week 3 */
      'joshuaJordan', 'jerichoWalls', 'joshuaAi', 'rahabRope', 'rahabJericho', 'goldenCalf', 'spiesInCanaan', 'balaamDonkey', 'samsonHair',
      'ruthGlean', 'samuelCall', 'davidHarp', 'goliathChallenge', 'davidAnointed',
      'saulSpear', 'davidCave',
      /* Week 4 */
      'elishaRaised', 'estherCrown', 'nehemiahWalls', 'jobSuffering', 'psalm23Shepherd',
      'solomonWisdom', 'elijahChariot', 'jonahVine', 'danielPray', 'estherBanquet',
      /* Week 5 */
      'angelMary', 'shepherdsStar', 'jesusManger', 'jesusTemple', 'johnBaptize',
      'jesusTempt', 'weddingWine', 'healBlind', 'jesusBlessKids',
      /* Week 6 */
      'mustardSeed', 'healLeper', 'jairus', 'transfigure', 'judasKiss',
      /* Week 7 */
      'crossCarry', 'crucifixion', 'tombEmpty', 'emmausRoad', 'thomasDoubt',
      'pentecostFire', 'peterShadow', 'paulShipwreck', 'paulSilas', 'tenVirgins',
      /* Week 8 */
      'armorShield', 'armorSword', 'fruitSpirit', 'loveChapter', 'faithMustard',
      'prayerKnock', 'worryBirds', 'forgive70x7', 'widowMite', 'richYoungRuler',
      'maryAnoint',
      /* Week 9 */
      'stephenStones', 'philipChariot', 'paulShip', 'revelationThrone', 'fourHorsemen',
      'alphaOmega', 'newHeaven', 'treeOfLife', 'riverOfLife', 'lambBook',
      'dragonFight', 'beastMark',
      /* Week 10 */
      'rahabWindow', 'deborahJudge', 'jaelTent', 'abigailWise', 'hannahPray',
      'maryMagdalene', 'lydiaSell', 'priscillaTeach', 'ruthMoab', 'estherFast',
      'sarahPromise', 'miriamSong',
      /* Week 11 */
      'annaProphet', 'widowOil', 'persistentWidow', 'samaritanWoman', 'marthaServe',
      'marySit', 'dorcasRaise', 'phoebeDeacon', 'juniaApostle', 'loisTimothy',
      'euniceMother', 'priscillaTent',
      /* Week 12 */
      'lazarus', 'greatCommission', 'ascension', 'pentecostTongues', 'armorBelt',
      'prayerCloset', 'faithMountain', 'loveNeighbor', 'heavenDoor', 'revelationBride',
      'treeFruit', 'noNight', 'everyKneeBow', 'newEarth', 'alphaOmega2', 'comeLordJesus'
    ];
    var weeklyStoryIndex = Math.floor(dayIndex / 7) % storyKeys.length;
    if (/armor of god|ephesians 6|helmet|sword.*spirit|breastplate/.test(low)) {
      return { type: 'carousel', story: 'armorOfGod' };
    }
    if (/david.*sheep|shepherd.*david|1 samuel 17:34|harp|lion.*bear/.test(low)) {
      return { type: 'carousel', story: 'davidSheep' };
    }
    if (/david|goliath|battle|1 samuel|joshua 1:9|philippians 4:13|ephesians 6:10|brave|courage|strong|strength|strengthen|strengtheneth/.test(low)) {
      return { type: 'carousel', story: 'david' };
    }
    if (/noah|ark|rainbow|promise|flood|matthew 6:26|bird|fowl|feedeth|two by two/.test(low)) {
      return { type: 'carousel', story: 'noah' };
    }
    if (/shepherd|psalm 23|children|matthew 19|jesus|love|john 10|john 3:16|come unto me/.test(low)) {
      return { type: 'carousel', story: 'jesus' };
    }
    if (/jonah|whale|fish|obey|nineveh|big fish|run away/.test(low)) {
      return { type: 'carousel', story: 'jonah' };
    }
    if (/daniel|lion|lions|den|pray|protect|shut mouths/.test(low)) {
      return { type: 'carousel', story: 'daniel' };
    }
    if (/adam|eve|garden|eden|genesis 3|apple|serpent|creation/.test(low)) {
      return { type: 'carousel', story: 'adamEve' };
    }
    if (/cain|abel|offering|jealous|brother|genesis 4/.test(low)) {
      return { type: 'carousel', story: 'cainAbel' };
    }
    if (/babel|tower|language|languages|confusion|genesis 11/.test(low)) {
      return { type: 'carousel', story: 'towerBabel' };
    }
    if (/abraham|isaac|ram|sacrifice|genesis 22|moriah/.test(low)) {
      return { type: 'carousel', story: 'abrahamIsaac' };
    }
    if (/joseph|coat|dreams|genesis 37|many colors/.test(low)) {
      return { type: 'carousel', story: 'josephCoat' };
    }
    if (/moses|burning bush|exodus 3|staff|bush|fire/.test(low)) {
      return { type: 'carousel', story: 'mosesBush' };
    }
    if (/red sea|part.*sea|exodus 14|waters part|egypt|pharaoh/.test(low)) {
      return { type: 'carousel', story: 'redSea' };
    }
    if (/manna|bread.*heaven|exodus 16|wilderness|desert.*food/.test(low)) {
      return { type: 'carousel', story: 'manna' };
    }
    if (/ten commandments|commandments|exodus 20|tablets|mountain.*moses/.test(low)) {
      return { type: 'carousel', story: 'tenCommandments' };
    }
    if (/samson|delilah|pillars|judges 16|hair.*strength/.test(low)) {
      return { type: 'carousel', story: 'samson' };
    }
    if (/fiery furnace|shadrach|meshach|abednego|daniel 3/.test(low)) {
      return { type: 'carousel', story: 'fieryFurnace' };
    }
    if (/esther|queen|such a time|save.*people|haman/.test(low)) {
      return { type: 'carousel', story: 'esther' };
    }
    if (/luke 2|bethlehem|manger|shepherds|christmas|jesus.*born/.test(low)) {
      return { type: 'carousel', story: 'jesusBirth' };
    }
    if (/calm.*storm|storm.*calm|boat|waves|matthew 14:27|mark 4/.test(low)) {
      return { type: 'carousel', story: 'jesusCalmsStorm' };
    }
    if (/feeds 5000|5000|five thousand|loaves|fish.*bread|matthew 14:19|john 6/.test(low)) {
      return { type: 'carousel', story: 'jesusFeeds5000' };
    }
    if (/good samaritan|samaritan|neighbor|luke 10/.test(low)) {
      return { type: 'carousel', story: 'goodSamaritan' };
    }
    if (/prodigal|lost son|luke 15|come back|welcome home/.test(low)) {
      return { type: 'carousel', story: 'prodigalSon' };
    }
    if (/zacchaeus|sycamore|tree.*jesus|luke 19/.test(low)) {
      return { type: 'carousel', story: 'zacchaeus' };
    }
    if (/lazarus|come out|john 11|raised.*dead/.test(low)) {
      return { type: 'carousel', story: 'lazarus' };
    }
    if (/resurrection|empty tomb|risen|easter|matthew 28|john 20/.test(low)) {
      return { type: 'carousel', story: 'resurrection' };
    }
    if (/creation|genesis 1|let there be light|god made/.test(low)) {
      return { type: 'carousel', story: 'creation' };
    }
    if (/jericho|walls fall|joshua 6|trumpets/.test(low)) {
      return { type: 'carousel', story: 'fallOfJericho' };
    }
    if (/elijah|baal|carmel|1 kings 18|fire.*heaven/.test(low)) {
      return { type: 'carousel', story: 'elijahFire' };
    }
    if (/elisha|widow.*oil|2 kings 4|oil.*jar/.test(low)) {
      return { type: 'carousel', story: 'elishaOil' };
    }
    if (/naaman|jordan.*dip|2 kings 5|leprosy/.test(low)) {
      return { type: 'carousel', story: 'naaman' };
    }
    if (/walks on water|walk.*water|matthew 14:25|peter.*water/.test(low)) {
      return { type: 'carousel', story: 'jesusWalksWater' };
    }
    if (/lost sheep|parable.*sheep|luke 15:6|ninety.*nine/.test(low)) {
      return { type: 'carousel', story: 'lostSheep' };
    }
    if (/palm sunday|hosanna|donkey.*jerusalem|matthew 21:9|luke 19:38/.test(low)) {
      return { type: 'carousel', story: 'palmSunday' };
    }
    if (/last supper|bread.*wine|luke 22:19|matthew 26:26|passover/.test(low)) {
      return { type: 'carousel', story: 'lastSupper' };
    }
    if (/temptation|matthew 4|devil|desert|stones.*bread/.test(low)) {
      return { type: 'carousel', story: 'jesusTemptation' };
    }
    if (/sower|parable.*seed|matthew 13|mark 4.*seed|soil/.test(low)) {
      return { type: 'carousel', story: 'parableSower' };
    }
    if (/rich young ruler|mark 10:17|matthew 19:16|sell.*possessions/.test(low)) {
      return { type: 'carousel', story: 'richYoungRuler' };
    }
    if (/widow.*mite|widow.*coin|mark 12:41|luke 21:2/.test(low)) {
      return { type: 'carousel', story: 'widowsMite' };
    }
    if (/gethsemane|garden.*prayer|matthew 26:36|mark 14:32/.test(low)) {
      return { type: 'carousel', story: 'gardenPrayer' };
    }
    if (/judas|betrayal|kiss.*betray|matthew 26:48/.test(low)) {
      return { type: 'carousel', story: 'betrayal' };
    }
    if (/pilate|trial|john 18:28|matthew 27:11/.test(low)) {
      return { type: 'carousel', story: 'trial' };
    }
    if (/crucifixion|cross|calvary|matthew 27:33|john 19:17/.test(low)) {
      return { type: 'carousel', story: 'crucifixion' };
    }
    if (/emmaus|luke 24:13|road.*walk|cleopas/.test(low)) {
      return { type: 'carousel', story: 'roadToEmmaus' };
    }
    if (/ascension|acts 1:9|goes.*heaven|luke 24:51/.test(low)) {
      return { type: 'carousel', story: 'ascension' };
    }
    if (/pentecost|holy spirit|acts 2|tongues.*fire/.test(low)) {
      return { type: 'carousel', story: 'pentecost' };
    }
    if (/stephen|acts 7|stoning|martyr/.test(low)) {
      return { type: 'carousel', story: 'stephen' };
    }
    if (/paul|damascus|saul.*convert|acts 9/.test(low)) {
      return { type: 'carousel', story: 'paulDamascus' };
    }
    if (/revelation 21|no tears|new jerusalem|heaven.*promise/.test(low)) {
      return { type: 'carousel', story: 'heavenPromise' };
    }
    if (/ruth|boaz|naomi|ruth 1|glean|harvest/.test(low)) {
      return { type: 'carousel', story: 'ruthBoaz' };
    }
    if (/parable.*talent|talents|matthew 25|servants.*money/.test(low)) {
      return { type: 'carousel', story: 'parableTalents' };
    }
    if (isWeeklyStory) {
      return { type: 'carousel', story: storyKeys[weeklyStoryIndex] };
    }
    var panels = [
      { type: 'single', src: 'panel-david.svg', alt: 'David with slingshot', caption: 'Be brave like David!', anim: 'cartoon-slide-david' },
      { type: 'single', src: 'panel-noah.svg', alt: "Noah's ark", caption: 'God keeps His promises!', anim: 'cartoon-slide-noah' },
      { type: 'single', src: 'panel-jesus.svg', alt: 'Jesus loves children', caption: 'Jesus loves you!', anim: 'cartoon-slide-jesus' },
      { type: 'single', src: 'panel-jonah.svg', alt: 'Jonah and the big fish', caption: 'Obey God like Jonah!', anim: 'cartoon-slide-jonah' },
      { type: 'single', src: 'panel-daniel.svg', alt: 'Daniel in the lions den', caption: 'God protects when you pray!', anim: 'cartoon-slide-daniel' }
    ];
    return panels[index % 5];
  }

  function getStreakData() {
    try {
      const raw = localStorage.getItem(KIDS_STREAK_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function saveStreakData(data) {
    try { localStorage.setItem(KIDS_STREAK_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function markTodayDone(reflectionBonus) {
    const today = getDailyKey();
    const data = getStreakData();
    const last = data.lastKey || '';
    const count = Number(data.count || 0);
    let nextCount = count;
    if (last !== today) {
      nextCount = last ? count + 1 : 1;
    }
    if (reflectionBonus) nextCount += 0.5;
    saveStreakData({ lastKey: today, count: nextCount });
    return nextCount;
  }

  function isDoneToday() {
    const data = getStreakData();
    return data.lastKey === getDailyKey();
  }

  function getCurrentStreak() {
    const data = getStreakData();
    return Number(data.count || 0);
  }

  function didMissYesterday() {
    const data = getStreakData();
    const last = data.lastKey || '';
    if (!last) return false;
    const lastDate = new Date(last + 'T12:00:00');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return lastDate.getTime() < yesterday.setHours(0, 0, 0, 0);
  }

  function renderVerseAndPrayer() {
    var index = getNextVerseIndex();
    var q = '';
    try {
      var params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
      q = (params.get('q') || '').trim();
    } catch (e) {}
    if (q) {
      var indices = getFilteredVerseIndices(q);
      if (indices.length > 0) index = indices[0];
    }
    var v = KIDS_VERSES[index];
    var p = KIDS_PRAYERS[index];
    var refEl = document.getElementById('kids-verse-ref');
    var textEl = document.getElementById('kids-verse-text');
    var prayerEl = document.getElementById('kids-prayer-text');
    var kidText = getKidText(v.ref) || v.text;
    if (refEl) refEl.textContent = v.ref;
    if (textEl) textEl.textContent = kidText;
    if (prayerEl) prayerEl.textContent = p;
    renderKidContext(v.ref, kidText || v.text);
    var cartoon = getCartoonForVerse(v.ref, v.text, index);
    var container = document.getElementById('kids-cartoon-container');
    if (!container) return;
    if (cartoon.type === 'carousel') {
      var story = bibleStories[cartoon.story];
      var panelsHtml = (story.panels || []).map(function (p) {
        return '<img src="' + escapeHtml(p.src || '') + '" alt="' + escapeHtml(p.alt || '') + '" class="comic-panel" width="200" height="160">';
      }).join('');
      var videoTitle = escapeHtml(story.videoTitle || '');
      var safeVideoId = safeYouTubeId(story.videoId);
      var btnHtml = safeVideoId ? '<button type="button" class="watch-video-btn" data-video-id="' + safeVideoId + '" data-title="' + videoTitle + '">🎥 Watch the story move! (2 min)</button>' : '';
      container.innerHTML = '<div class="comic-carousel"><div class="panels-container">' + panelsHtml + '</div><p class="comic-caption">' + escapeHtml(story.caption || '') + '</p>' + btnHtml + '</div>';
    } else {
      container.innerHTML = '<div class="bible-cartoon ' + escapeHtml(cartoon.anim || '') + '"><img src="' + escapeHtml(cartoon.src || '') + '" alt="' + escapeHtml(cartoon.alt || '') + '" class="cartoon-img" width="200" height="160"><p class="cartoon-caption">' + escapeHtml(cartoon.caption || '') + '</p></div>';
    }
    if (!q) {
      try {
        localStorage.setItem(KIDS_VERSE_INDEX_KEY, String((index + 1) % KIDS_VERSES.length));
      } catch (e) {}
    }
  }

  function renderStreak() {
    const raw = getCurrentStreak();
    const streak = Math.ceil(raw);
    const el = document.getElementById('kids-streak-display');
    if (el) {
      el.textContent = streak >= 1
        ? '🔥 ' + streak + ' day' + (streak === 1 ? '' : 's') + ' — keep going!'
        : '🔥 0 days — start today!';
    }
  }

  function renderDoneState() {
    const done = isDoneToday();
    const btn = document.getElementById('kids-mark-done');
    const msg = document.getElementById('kids-done-msg');
    if (btn) {
      btn.disabled = done;
      btn.textContent = done ? 'Completed Today ✓' : 'I Did It Today!';
    }
    if (msg) msg.classList.toggle('hidden', !done);
  }

  function renderComeBackNudge() {
    const nudge = document.getElementById('kids-come-back-nudge');
    const remindBtn = document.getElementById('kids-remind-btn');
    if (!nudge) return;
    const missed = didMissYesterday();
    const streak = getCurrentStreak();
    nudge.classList.toggle('hidden', !missed || streak === 0);
    if (remindBtn) {
      const opted = !!localStorage.getItem(KIDS_REMIND_OPTED_KEY);
      remindBtn.textContent = opted ? '🔔 Reminders on' : '🔔 Remind me when I miss a day';
      remindBtn.classList.toggle('opted', opted);
    }
  }

  function wireRemindBtn() {
    const btn = document.getElementById('kids-remind-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (localStorage.getItem(KIDS_REMIND_OPTED_KEY)) return;
      if (!('Notification' in window)) return;
      Notification.requestPermission().then(function (perm) {
        if (perm === 'granted') {
          localStorage.setItem(KIDS_REMIND_OPTED_KEY, '1');
          renderComeBackNudge();
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js?v=20260320').then(function () {
              return navigator.serviceWorker.ready;
            }).then(function (reg) {
              if (reg.pushManager && window.TDB_CONFIG && window.TDB_CONFIG.VAPID_PUBLIC_KEY) {
                try {
                  var key = window.TDB_CONFIG.VAPID_PUBLIC_KEY;
                  var padding = '='.repeat((4 - key.length % 4) % 4);
                  var base64Url = (key + padding).replace(/-/g, '+').replace(/_/g, '/');
                  var raw = atob(base64Url);
                  var arr = new Uint8Array(raw.length);
                  for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
                  return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: arr });
                } catch (e) {}
              }
            }).catch(function () {});
          }
        }
      });
    });
  }

  function renderBadges(prevStreak) {
    const streak = getCurrentStreak();
    const list = document.getElementById('kids-badges-list');
    if (!list) return;
    list.innerHTML = '';
    BADGES.forEach(function (b) {
      const wasLocked = (prevStreak || 0) < b.days;
      const nowUnlocked = streak >= b.days;
      const span = document.createElement('span');
      span.className = 'kids-badge ' + b.id + (nowUnlocked ? '' : ' locked');
      span.textContent = (nowUnlocked ? '★ ' : '☆ ') + b.label;
      span.title = nowUnlocked ? 'Unlocked at ' + b.days + ' days!' : 'Unlock at ' + b.days + ' days';
      list.appendChild(span);
      if (wasLocked && nowUnlocked) triggerBadgeConfetti(span);
    });
  }

  function triggerBadgeConfetti(anchor) {
    const colors = ['#ffd93d', '#ff9f43', '#ee5a5a', '#6bcb77', '#9b59b6', '#ff6b9d'];
    const container = document.createElement('div');
    container.className = 'kids-confetti-burst';
    container.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:visible;';
    for (var i = 0; i < 12; i++) {
      var p = document.createElement('span');
      p.className = 'kids-confetti-piece';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--angle', (i * 30) + 'deg');
      container.appendChild(p);
    }
    var rect = anchor.getBoundingClientRect();
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;left:' + rect.left + 'px;top:' + rect.top + 'px;width:' + rect.width + 'px;height:' + rect.height + 'px;z-index:9998;';
    wrap.appendChild(container);
    document.body.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 800);
  }

  function getCurrentVerseRef() {
    var refEl = document.getElementById('kids-verse-ref');
    return refEl ? refEl.textContent.trim() : '';
  }

  function getVerseIndex(ref) {
    if (!ref) return -1;
    var r = ref.toLowerCase().trim();
    for (var i = 0; i < KIDS_VERSES.length; i++) {
      if (KIDS_VERSES[i].ref.toLowerCase().trim() === r) return i;
    }
    return -1;
  }

  function loadKidReflection() {
    var inp = document.getElementById('kid-reflection');
    if (!inp) return;
    try {
      var raw = localStorage.getItem(KID_REFLECTION_KEY);
      var val = raw ? JSON.parse(raw) : {};
      var today = getDailyKey();
      var entry = val[today];
      inp.value = (entry && entry.text) ? entry.text : '';
    } catch (e) {}
  }

  function saveKidReflection() {
    var inp = document.getElementById('kid-reflection');
    if (!inp) return;
    try {
      var raw = localStorage.getItem(KID_REFLECTION_KEY);
      var val = raw ? JSON.parse(raw) : {};
      var today = getDailyKey();
      var text = (inp.value || '').trim();
      var verse = getCurrentVerseRef();
      val[today] = { date: new Date().toDateString(), text: text, verse: verse };
      localStorage.setItem(KID_REFLECTION_KEY, JSON.stringify(val));
      showKidReflectionSaved(false);
      syncKidReflectionToSupabase(today, text, verse);
    } catch (e) {}
  }

  var kidReflectionQueue = [];

  function showKidReflectionSaved(synced) {
    var el = document.getElementById('kid-reflection-saved');
    if (!el) return;
    el.textContent = synced ? 'Synced! ⭐' : 'Saved! ⭐';
    el.classList.remove('hidden');
    clearTimeout(showKidReflectionSaved._t);
    showKidReflectionSaved._t = setTimeout(function () { el.classList.add('hidden'); }, 2000);
  }

  function syncKidReflectionToSupabase(dateKey, text, verseRef) {
    var code = null;
    try { code = localStorage.getItem(KIDS_FAMILY_CODE_KEY); } catch (e) {}
    if (!code || code.length !== 6) return;
    var cfg = window.TDB_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return;
    var item = { p_code: code, p_date: dateKey, p_verse: verseRef || '', p_text: text || '' };
    if (!navigator.onLine) {
      kidReflectionQueue.push(item);
      return;
    }
    try {
      var supabase = window.supabase && window.supabase.createClient ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
      if (!supabase) return;
      supabase.rpc('upsert_kid_reflection', item)
        .then(function (res) {
          if (res.error) { kidReflectionQueue.push(item); return; }
          showKidReflectionSaved(true);
        })
        .catch(function () { kidReflectionQueue.push(item); });
    } catch (e) { kidReflectionQueue.push(item); }
  }

  function flushKidReflectionQueue() {
    if (kidReflectionQueue.length === 0 || !navigator.onLine) return;
    var cfg = window.TDB_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return;
    try {
      var supabase = window.supabase && window.supabase.createClient ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
      if (!supabase) return;
      var items = kidReflectionQueue.splice(0);
      kidReflectionQueue = [];
      items.forEach(function (item) {
        supabase.rpc('upsert_kid_reflection', item)
          .then(function (res) { if (res && res.error) kidReflectionQueue.push(item); })
          .catch(function () { kidReflectionQueue.push(item); });
      });
    } catch (e) {}
  }

  function wireKidReflection() {
    var inp = document.getElementById('kid-reflection');
    if (!inp) return;
    var saveTimer;
    inp.addEventListener('input', function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(saveKidReflection, 500);
    });
    inp.addEventListener('blur', saveKidReflection);
    window.addEventListener('online', flushKidReflectionQueue);
  }

  function getQuizKeyForVerse(ref) {
    if (!ref || typeof ref !== 'string') return 'default';
    var s = ref.toLowerCase().trim().replace(/\s+/g, ' ');
    var m = s.match(/^(\d?\s*\w+)\s+(\d+)/);
    if (m) return (m[1] + ' ' + m[2]).trim();
    return 'default';
  }

  function getQuizForVerse(ref) {
    var key = getQuizKeyForVerse(ref);
    return KID_QUIZ_QUESTIONS[key] || KID_QUIZ_QUESTIONS['default'];
  }

  function isQuizDoneToday() {
    try {
      return localStorage.getItem(KID_QUIZ_DONE_KEY) === getDailyKey();
    } catch (e) { return false; }
  }

  function setQuizDoneToday() {
    try {
      localStorage.setItem(KID_QUIZ_DONE_KEY, getDailyKey());
    } catch (e) {}
  }

  function triggerQuizConfetti() {
    var colors = ['#ffd93d', '#4dabf7', '#ffd93d', '#339af0', '#ffd93d', '#4dabf7'];
    var wrap = document.createElement('div');
    wrap.className = 'kids-quiz-confetti-wrap';
    wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:visible;';
    for (var i = 0; i < 24; i++) {
      var p = document.createElement('span');
      p.className = 'kids-quiz-confetti-piece';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--dx', (Math.random() - 0.5) * 200 + 'px');
      p.style.setProperty('--dy', (Math.random() - 0.5) * 200 + 'px');
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 1200);
  }

  function wireQuiz() {
    var btn = document.getElementById('kids-quiz-btn');
    var modal = document.getElementById('kids-quiz-modal');
    var closeBtn = document.getElementById('kids-quiz-close');
    var submitBtn = document.getElementById('kids-quiz-submit');
    var questionsEl = document.getElementById('kids-quiz-questions');
    var resultEl = document.getElementById('kids-quiz-result');
    var resultMsg = document.getElementById('kids-quiz-result-msg');
    var resultClose = document.getElementById('kids-quiz-result-close');
    if (!btn || !modal || !questionsEl) return;

    function renderQuizButton() {
      var done = isQuizDoneToday();
      btn.disabled = done;
      btn.textContent = done ? 'Quiz done today! ✓' : 'Quiz Time! 🎉';
    }

    function openQuiz() {
      if (isQuizDoneToday()) return;
      var ref = getCurrentVerseRef();
      var questions = getQuizForVerse(ref);
      questionsEl.innerHTML = '';
      questions.forEach(function (q, i) {
        var wrap = document.createElement('div');
        wrap.className = 'kids-quiz-q-wrap';
        wrap.dataset.correct = String(q.correct);
        var opts = (q.options || []).slice();
        opts.forEach(function (opt, j) {
          var label = document.createElement('label');
          label.className = 'kids-quiz-option';
          label.innerHTML = '<input type="radio" name="quiz-q' + i + '" value="' + j + '" aria-label="' + escapeHtml(opt || '') + '"> <span>' + escapeHtml(opt || '') + '</span>';
          wrap.appendChild(label);
        });
        var title = document.createElement('p');
        title.className = 'kids-quiz-q-title';
        title.textContent = (i + 1) + '. ' + (q.question || '');
        wrap.insertBefore(title, wrap.firstChild);
        questionsEl.appendChild(wrap);
      });
      resultEl.classList.add('hidden');
      submitBtn.classList.remove('hidden');
      modal.classList.remove('hidden');
    }

    function closeQuiz() {
      modal.classList.add('hidden');
      renderQuizButton();
    }

    function scoreQuiz() {
      var wraps = questionsEl.querySelectorAll('.kids-quiz-q-wrap');
      var correct = 0;
      wraps.forEach(function (wrap) {
        var rad = wrap.querySelector('input:checked');
        var ans = rad ? parseInt(rad.value, 10) : -1;
        var corr = parseInt(wrap.dataset.correct || '0', 10);
        if (ans === corr) {
          correct++;
          wrap.classList.add('kids-quiz-correct');
        } else {
          wrap.classList.add('kids-quiz-wrong');
        }
      });
      return correct;
    }

    btn.addEventListener('click', openQuiz);
    closeBtn && closeBtn.addEventListener('click', closeQuiz);
    submitBtn.addEventListener('click', function () {
      var score = scoreQuiz();
      var total = questionsEl.querySelectorAll('.kids-quiz-q-wrap').length;
      submitBtn.classList.add('hidden');
      resultEl.classList.remove('hidden');
      if (score === total && total >= 3) {
        resultMsg.textContent = 'Awesome! +1 streak 🔥';
        resultMsg.classList.remove('kids-quiz-fail');
        resultMsg.classList.add('kids-quiz-win');
        triggerQuizConfetti();
        var prevStreak = getCurrentStreak();
        var data = getStreakData();
        var count = Number(data.count || 0);
        saveStreakData({ lastKey: getDailyKey(), count: count + 1 });
        setQuizDoneToday();
        syncKidStreak();
        renderStreak();
        renderDoneState();
        renderComeBackNudge();
        renderBadges(Math.ceil(prevStreak));
        renderFaithTrail();
      } else {
        resultMsg.textContent = 'Great effort - review the verse prompts and try again tomorrow. 🌟';
        resultMsg.classList.remove('kids-quiz-win');
        resultMsg.classList.add('kids-quiz-fail');
      }
    });
    resultClose && resultClose.addEventListener('click', closeQuiz);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeQuiz();
    });
    renderQuizButton();
  }

  function isMemoryDoneToday() {
    try {
      return localStorage.getItem(KID_MEMORY_DONE_KEY) === getDailyKey();
    } catch (e) { return false; }
  }

  function setMemoryDoneToday() {
    try {
      localStorage.setItem(KID_MEMORY_DONE_KEY, getDailyKey());
    } catch (e) {}
  }

  function pickBlanksFromVerse(text) {
    if (!text || typeof text !== 'string') return [];
    var skip = { 'the': 1, 'and': 1, 'for': 1, 'that': 1, 'with': 1, 'his': 1, 'her': 1, 'him': 1, 'you': 1, 'thy': 1, 'thou': 1, 'unto': 1, 'have': 1, 'has': 1, 'are': 1, 'was': 1, 'is': 1, 'a': 1, 'an': 1, 'of': 1, 'to': 1, 'in': 1, 'it': 1, 'be': 1, 'not': 1, 'he': 1, 'me': 1, 'my': 1, 'so': 1 };
    var words = text.replace(/[.,;:!?]/g, '').split(/\s+/);
    var candidates = [];
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (w.length >= 4 && !skip[w.toLowerCase()]) candidates.push({ word: w, index: i });
    }
    if (candidates.length < 3) {
      candidates = [];
      for (var j = 0; j < words.length && candidates.length < 3; j++) {
        if (words[j].length >= 2) candidates.push({ word: words[j], index: j });
      }
    }
    return candidates.slice(0, 3);
  }

  function wireMemory() {
    var btn = document.getElementById('kids-memory-btn');
    var modal = document.getElementById('kids-memory-modal');
    var closeBtn = document.getElementById('kids-memory-close');
    var blanksEl = document.getElementById('kids-memory-blanks');
    var refEl = document.getElementById('kids-memory-ref');
    var submitBtn = document.getElementById('kids-memory-submit');
    var resultEl = document.getElementById('kids-memory-result');
    var resultMsg = document.getElementById('kids-memory-result-msg');
    var nextBtn = document.getElementById('kids-memory-next');
    if (!btn || !modal || !blanksEl) return;

    function renderMemoryButton() {
      btn.disabled = isMemoryDoneToday();
      btn.textContent = isMemoryDoneToday() ? 'Memorized today! ✓' : 'Memorize This! 🧠';
    }

    function openMemory() {
      if (isMemoryDoneToday()) return;
      var ref = getCurrentVerseRef();
      var idx = getVerseIndex(ref);
      if (idx < 0 || idx >= KIDS_VERSES.length) return;
      var v = KIDS_VERSES[idx];
      var text = getKidText(v.ref) || v.text;
      var blanks = pickBlanksFromVerse(text);
      if (blanks.length < 1) return;
      var words = text.replace(/[.,;:!?]/g, '').split(/\s+/);
      var blankIndices = {};
      blanks.forEach(function (b) { blankIndices[b.index] = b.word; });
      if (refEl) refEl.textContent = ref;
      blanksEl.innerHTML = '';
      var verseHtml = '<p class="kids-memory-verse">';
      for (var k = 0; k < words.length; k++) {
        if (blankIndices[k] !== undefined) {
          verseHtml += '_____ ';
        } else {
          verseHtml += escapeHtml(words[k]) + ' ';
        }
      }
      verseHtml += '</p>';
      blanksEl.innerHTML = verseHtml;
      blanks.forEach(function (b, i) {
        var wrap = document.createElement('div');
        wrap.className = 'kids-memory-input-wrap';
        wrap.dataset.answer = b.word.toLowerCase();
        wrap.dataset.hint = 'Starts with ' + (b.word.charAt(0).toUpperCase()) + '!';
        var label = document.createElement('label');
        label.textContent = 'Word ' + (i + 1) + ':';
        label.className = 'kids-memory-label';
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'kids-memory-input';
        inp.placeholder = 'Type the word';
        inp.autocomplete = 'off';
        inp.setAttribute('aria-label', 'Word ' + (i + 1));
        wrap.appendChild(label);
        wrap.appendChild(inp);
        blanksEl.appendChild(wrap);
      });
      resultEl.classList.add('hidden');
      submitBtn.classList.remove('hidden');
      modal.classList.remove('hidden');
    }

    function closeMemory() {
      modal.classList.add('hidden');
      renderMemoryButton();
    }

    function triggerMemoryConfetti() {
      var colors = ['#ffd93d', '#4dabf7', '#ffd93d', '#339af0'];
      var wrap = document.createElement('div');
      wrap.className = 'kids-quiz-confetti-wrap';
      wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:visible;';
      for (var i = 0; i < 20; i++) {
        var p = document.createElement('span');
        p.className = 'kids-quiz-confetti-piece';
        p.style.background = colors[i % colors.length];
        p.style.setProperty('--dx', (Math.random() - 0.5) * 180 + 'px');
        p.style.setProperty('--dy', (Math.random() - 0.5) * 180 + 'px');
        wrap.appendChild(p);
      }
      document.body.appendChild(wrap);
      setTimeout(function () { wrap.remove(); }, 1000);
    }

    btn.addEventListener('click', openMemory);
    closeBtn && closeBtn.addEventListener('click', closeMemory);
    nextBtn && nextBtn.addEventListener('click', closeMemory);
    submitBtn.addEventListener('click', function () {
      var wraps = blanksEl.querySelectorAll('.kids-memory-input-wrap');
      var correct = 0;
      wraps.forEach(function (wrap) {
        var inp = wrap.querySelector('.kids-memory-input');
        var ans = (inp ? inp.value : '').trim().toLowerCase();
        var expected = (wrap.dataset.answer || '').toLowerCase();
        var hint = wrap.dataset.hint || 'Close - check the verse again and retry.';
        var hintEl = wrap.querySelector('.kids-memory-hint');
        if (ans === expected) {
          correct++;
          wrap.classList.remove('kids-memory-wrong');
          wrap.classList.add('kids-memory-correct');
          if (hintEl) hintEl.remove();
        } else {
          wrap.classList.remove('kids-memory-correct');
          wrap.classList.add('kids-memory-wrong');
          if (!hintEl) {
            var h = document.createElement('span');
            h.className = 'kids-memory-hint';
            h.textContent = hint;
            wrap.appendChild(h);
          }
        }
      });
      if (correct === wraps.length && wraps.length >= 1) {
        submitBtn.classList.add('hidden');
        resultEl.classList.remove('hidden');
        resultMsg.textContent = 'You got it! +0.5 streak 🔥';
        resultMsg.classList.remove('kids-memory-fail');
        resultMsg.classList.add('kids-memory-win');
        triggerMemoryConfetti();
        var data = getStreakData();
        var count = Number(data.count || 0);
        saveStreakData({ lastKey: data.lastKey || getDailyKey(), count: count + 0.5 });
        setMemoryDoneToday();
        syncKidStreak();
        renderStreak();
        renderBadges(Math.ceil(count));
        renderFaithTrail();
      }
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeMemory();
    });
    renderMemoryButton();
  }

  function wireMarkDone() {
    const btn = document.getElementById('kids-mark-done');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (isDoneToday()) return;
      saveKidReflection();
      var reflectionText = (document.getElementById('kid-reflection') || {}).value || '';
      var reflectionBonus = reflectionText.trim().length > 10;
      var prevStreak = getCurrentStreak();
      markTodayDone(reflectionBonus);
      renderStreak();
      renderDoneState();
      renderComeBackNudge();
      renderBadges(Math.ceil(prevStreak));
      renderFaithTrail();
      syncKidStreak();
    });
  }

  function wireDoodle() {
    const openBtn = document.getElementById('kids-doodle-btn');
    const modal = document.getElementById('kids-doodle-modal');
    const closeBtn = document.getElementById('kids-doodle-close');
    const canvas = document.getElementById('kids-doodle-canvas');
    const colorInput = document.getElementById('kids-doodle-color');
    const sizeInput = document.getElementById('kids-doodle-size');
    const clearBtn = document.getElementById('kids-doodle-clear');
    const saveBtn = document.getElementById('kids-doodle-save');
    const downloadBtn = document.getElementById('kids-doodle-download');

    if (!openBtn || !modal || !canvas) return;

    let ctx = canvas.getContext('2d');
    let drawing = false;
    let lastX = 0, lastY = 0;

    function initCanvas() {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const saved = localStorage.getItem(KIDS_DOODLE_KEY + getDailyKey());
      if (saved) {
        const img = new Image();
        img.onload = function () { ctx.drawImage(img, 0, 0); };
        img.src = saved;
      }
    }

    function startDraw(e) {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      lastX = (e.clientX - rect.left) * scaleX;
      lastY = (e.clientY - rect.top) * scaleY;
    }

    function draw(e) {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      ctx.strokeStyle = colorInput ? colorInput.value : '#000';
      ctx.lineWidth = sizeInput ? sizeInput.value : 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastX = x;
      lastY = y;
    }

    function stopDraw() { drawing = false; }

    function saveToLocal() {
      try {
        localStorage.setItem(KIDS_DOODLE_KEY + getDailyKey(), canvas.toDataURL('image/png'));
      } catch (e) {}
    }

    function uploadDoodleToSupabase() {
      var familyCode = null;
      try { familyCode = localStorage.getItem(KIDS_FAMILY_CODE_KEY); } catch (e) {}
      if (!familyCode || !navigator.onLine) return;
      var cfg = window.TDB_CONFIG || {};
      var supabaseUrl = cfg.SUPABASE_URL;
      var supabaseKey = cfg.SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) return;
      var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
      if (!supabase || !supabase.createClient) return;
      var kidName = getKidName() || 'Kiddo';
      var safeName = kidName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 20);
      var path = 'doodles/' + familyCode + '/' + safeName + '-' + Date.now() + '.png';
      fetch(canvas.toDataURL('image/png'))
        .then(function (r) { return r.blob(); })
        .then(function (blob) {
          var client = supabase.createClient(supabaseUrl, supabaseKey);
          return client.storage.from('kid-doodles').upload(path, blob, { contentType: 'image/png', upsert: false });
        })
        .then(function (res) {
          if (res.error) return;
          try { localStorage.setItem(KIDS_DOODLE_KEY + getDailyKey() + '_uploaded', '1'); } catch (e) {}
        })
        .catch(function () {});
    }

    openBtn.addEventListener('click', function () {
      initCanvas();
      modal.classList.remove('hidden');
    });

    if (closeBtn) closeBtn.addEventListener('click', function () {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.add('hidden');
    });

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    canvas.addEventListener('touchstart', function (e) {
      e.preventDefault();
      const t = e.touches[0];
      startDraw({ clientX: t.clientX, clientY: t.clientY });
    });
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      const t = e.touches[0];
      draw({ clientX: t.clientX, clientY: t.clientY });
    });
    canvas.addEventListener('touchend', stopDraw);

    if (clearBtn) clearBtn.addEventListener('click', function () {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      try { localStorage.removeItem(KIDS_DOODLE_KEY + getDailyKey()); } catch (e) {}
    });

    if (saveBtn) saveBtn.addEventListener('click', function () {
      saveToLocal();
      uploadDoodleToSupabase();
      modal.classList.add('hidden');
    });

    if (downloadBtn) downloadBtn.addEventListener('click', function () {
      const a = document.createElement('a');
      a.download = 'kids-battle-doodle.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      saveToLocal();
    });
  }

  function wireSidebar() {
    const toggle = document.getElementById('sidebar-toggle');
    const appShell = document.querySelector('.app-shell');
    if (toggle && appShell) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        appShell.classList.toggle('sidebar-open');
      });
    }
  }

  function wireVerseSpeak() {
    const btn = document.getElementById('kids-verse-speak');
    const refEl = document.getElementById('kids-verse-ref');
    const textEl = document.getElementById('kids-verse-text');
    if (!btn || !textEl) return;
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      btn.style.display = 'none';
      return;
    }
    btn.addEventListener('click', function () {
      try { window.speechSynthesis.cancel(); } catch (_) {}
      var ref = refEl ? refEl.textContent.trim() : '';
      var text = (ref ? ref + '. ' : '') + (textEl.textContent || '').trim();
      if (!text) return;
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      var voices = window.speechSynthesis.getVoices();
      var en = voices.filter(function (v) { return v.lang.startsWith('en'); })[0];
      if (en) u.voice = en;
      window.speechSynthesis.speak(u);
    });
  }

  function generateShareImage(callback) {
    var refEl = document.getElementById('kids-verse-ref');
    var textEl = document.getElementById('kids-verse-text');
    var ref = refEl ? refEl.textContent : '';
    var text = textEl ? textEl.textContent : '';
    var doodleData = null;
    try {
      doodleData = localStorage.getItem(KIDS_DOODLE_KEY + getDailyKey());
    } catch (e) {}
    var c = document.createElement('canvas');
    c.width = 600;
    c.height = doodleData ? 700 : 500;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ffd93d';
    ctx.font = 'bold 28px Bangers, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('I won today\'s Kids Battle!', 300, 50);
    ctx.fillStyle = '#ff9f43';
    ctx.font = 'bold 20px Nunito, sans-serif';
    ctx.fillText(ref, 300, 90);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px Comic Neue, sans-serif';
    var words = text.split(/\s+/);
    var lines = [];
    var line = '';
    for (var w = 0; w < words.length; w++) {
      var test = line ? line + ' ' + words[w] : words[w];
      if (test.length <= 42) line = test;
      else { if (line) lines.push(line); line = words[w]; }
    }
    if (line) lines.push(line);
    var y = 130;
    lines.forEach(function (ln) {
      ctx.fillText(ln, 300, y);
      y += 28;
    });
    if (doodleData) {
      var img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 50, 180, 500, 350);
        ctx.fillStyle = '#ffd93d';
        ctx.font = 'bold 24px Bangers, sans-serif';
        ctx.fillText('Today\'s Daily Battle', 300, c.height - 30);
        callback(c.toDataURL('image/png'));
      };
      img.onerror = function () { callback(c.toDataURL('image/png')); };
      img.src = doodleData;
    } else {
      ctx.fillStyle = '#ffd93d';
      ctx.font = 'bold 24px Bangers, sans-serif';
      ctx.fillText('Today\'s Daily Battle', 300, c.height - 30);
      callback(c.toDataURL('image/png'));
    }
  }

  function wireShareBtn() {
    var shareBtn = document.getElementById('kids-share-btn');
    var doodleShareBtn = document.getElementById('kids-doodle-share');
    function doShare() {
      generateShareImage(function (dataUrl) {
        var blob = dataUrlToBlob(dataUrl);
        var file = new File([blob], 'kids-battle-win.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({
            title: 'I won today\'s Kids Battle!',
            text: 'Check out my verse and doodle from Today\'s Daily Battle!',
            files: [file]
          }).catch(function () { fallbackDownload(dataUrl); });
        } else {
          fallbackDownload(dataUrl);
        }
      });
    }
    function dataUrlToBlob(dataUrl) {
      var arr = dataUrl.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8 = new Uint8Array(n);
      for (var i = 0; i < n; i++) u8[i] = bstr.charCodeAt(i);
      return new Blob([u8], { type: mime });
    }
    function fallbackDownload(dataUrl) {
      var a = document.createElement('a');
      a.download = 'kids-battle-win.png';
      a.href = dataUrl;
      a.click();
    }
    if (shareBtn) shareBtn.addEventListener('click', doShare);
    if (doodleShareBtn) doodleShareBtn.addEventListener('click', doShare);
  }

  const KIDS_TRAIL_WELCOME_KEY = 'kidsTrailWelcomeShown';

  function renderFaithTrail() {
    var section = document.getElementById('kids-faith-trail');
    var board = document.getElementById('kids-faith-trail-board');
    if (!section || !board) return;
    var streak = getCurrentStreak();
    if (streak < 1) {
      section.classList.add('hidden');
      return;
    }
    section.classList.remove('hidden');
    var welcomeEl = section.querySelector('.kids-trail-welcome');
    if (welcomeEl) welcomeEl.remove();
    if (!localStorage.getItem(KIDS_TRAIL_WELCOME_KEY)) {
      try { localStorage.setItem(KIDS_TRAIL_WELCOME_KEY, '1'); } catch (e) {}
      var welcome = document.createElement('p');
      welcome.className = 'kids-trail-welcome';
      welcome.textContent = "Welcome to the Trail! You're on Day " + streak + " — collect icons to win the week! ⚔️🏆";
      welcome.setAttribute('role', 'status');
      section.insertBefore(welcome, board);
    }
    board.innerHTML = '';
    FAITH_TRAIL_STOPS.forEach(function (stop) {
      var span = document.createElement('span');
      span.className = 'kids-trail-stop' + (streak >= stop.day ? ' unlocked' : ' locked');
      span.innerHTML = '<span class="kids-trail-icon">' + escapeHtml(stop.icon) + '</span><span class="kids-trail-label">' + escapeHtml(stop.label) + '</span>';
      span.title = streak >= stop.day ? 'Completed!' : 'Unlock at day ' + stop.day;
      board.appendChild(span);
    });
  }

  var TOPIC_KEYWORDS = {
    brave: 'brave|courage|strong|strength|strengthen|afraid',
    friends: 'friend|kind|love|together|one another',
    love: 'love|loved|loveth|charity',
    animals: 'bird|fowl|feedeth|ark|noah|animal|sheep|lion',
    strength: 'strength|strong|strengthen|power',
    peace: 'peace|rest|calm'
  };

  var KIDS_MEANING_SIGNALS = {
    fear: ['fear', 'afraid', 'scared', 'panic'],
    stress: ['anxiety', 'worry', 'stressed', 'overwhelmed', 'nervous'],
    sadness: ['sad', 'grief', 'lonely', 'hurt', 'loss'],
    peace: ['peace', 'calm', 'rest'],
    strength: ['strength', 'strong', 'weak', 'brave', 'courage'],
    love: ['love', 'kind', 'friend', 'friends']
  };
  var KIDS_ACTION_SIGNALS = {
    pray: ['pray', 'prayer', 'ask'],
    trust: ['trust', 'believe', 'faith'],
    obey: ['obey', 'follow', 'listen'],
    help: ['help', 'serve', 'care', 'kind']
  };
  var KIDS_OUTCOME_SIGNALS = {
    peace: ['peace', 'calm', 'rest'],
    courage: ['courage', 'brave', 'strong'],
    comfort: ['comfort', 'heal', 'safe'],
    joy: ['joy', 'glad', 'rejoice']
  };

  function tokenizeKidsQuery(topicOrQuery) {
    return String(topicOrQuery || '')
      .toLowerCase()
      .replace(/[^a-z0-9:\s]/g, ' ')
      .split(/\s+/)
      .map(function (w) { return w.trim(); })
      .filter(function (w) { return !!w && w !== 'search' && w !== 'find'; });
  }

  function pickKidsSignal(tokens, dict, fallback) {
    var bestKey = fallback || '';
    var bestHits = 0;
    Object.keys(dict).forEach(function (key) {
      var words = dict[key];
      var hits = 0;
      tokens.forEach(function (t) {
        if (words.indexOf(t) !== -1) hits += 1;
      });
      if (hits > bestHits) {
        bestHits = hits;
        bestKey = key;
      }
    });
    return bestKey;
  }

  function getKidsSearchInsights(topicOrQuery) {
    if (!KIDS_VERSES.length) return { query: '', tokens: [], indices: [], meaning: 'fear', action: 'pray', outcome: 'peace' };
    var q = String(topicOrQuery || '').toLowerCase().trim();
    if (!q) return { query: '', tokens: [], indices: [], meaning: 'fear', action: 'pray', outcome: 'peace' };
    var tokens = tokenizeKidsQuery(q);
    var pattern = TOPIC_KEYWORDS[q] || q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp(pattern, 'i');
    var meaning = pickKidsSignal(tokens, KIDS_MEANING_SIGNALS, 'fear');
    var action = pickKidsSignal(tokens, KIDS_ACTION_SIGNALS, 'pray');
    var outcome = pickKidsSignal(tokens, KIDS_OUTCOME_SIGNALS, 'peace');
    var scored = [];
    for (var i = 0; i < KIDS_VERSES.length; i++) {
      var v = KIDS_VERSES[i];
      var kidText = getKidText(v.ref) || v.text;
      var ctx = getKidContext(v.ref, kidText || v.text);
      var combined = (v.ref + ' ' + v.text + ' ' + kidText + ' ' + (ctx.apply || '')).toLowerCase();
      var score = 0;
      if (re.test(combined)) score += 4;
      tokens.forEach(function (t) {
        if (t && combined.indexOf(t) !== -1) score += 2;
      });
      (KIDS_MEANING_SIGNALS[meaning] || []).forEach(function (w) { if (combined.indexOf(w) !== -1) score += 2; });
      (KIDS_ACTION_SIGNALS[action] || []).forEach(function (w) { if (combined.indexOf(w) !== -1) score += 2; });
      (KIDS_OUTCOME_SIGNALS[outcome] || []).forEach(function (w) { if (combined.indexOf(w) !== -1) score += 1; });
      if (score > 0) scored.push({ index: i, score: score });
    }
    scored.sort(function (a, b) { return b.score - a.score; });
    return {
      query: q,
      tokens: tokens,
      indices: scored.map(function (row) { return row.index; }),
      meaning: meaning,
      action: action,
      outcome: outcome
    };
  }

  function inferKidsAgeBand(topicOrQuery) {
    var q = String(topicOrQuery || '').toLowerCase();
    if (/\b(little|young|small|early|toddler|first grade|2nd grade|3rd grade)\b/.test(q)) return 'little';
    if (/\b(preteen|tween|middle school|4th grade|5th grade|6th grade)\b/.test(q)) return 'preteen';
    if (/\b(teen|teenager|youth|older kid|junior high|7th grade|8th grade)\b/.test(q)) return 'teen';
    return 'preteen';
  }

  function simplifyKidsApply(apply, ageBand) {
    var text = String(apply || '').replace(/\s+/g, ' ').trim();
    if (!text) return ageBand === 'little'
      ? 'Tell Jesus how you feel, then take one kind step.'
      : 'Pray honestly, trust God, and take one faithful step today.';
    if (ageBand === 'little') {
      if (text.length > 88) text = text.slice(0, 85) + '...';
      return text;
    }
    if (ageBand === 'teen') return text;
    if (text.length > 130) return text.slice(0, 127) + '...';
    return text;
  }

  function buildKidsBreakdown(verse, context, insights) {
    var focusMap = {
      fear: 'feeling scared',
      stress: 'big worries',
      sadness: 'sad moments',
      peace: 'calm hearts',
      strength: 'hard moments',
      love: 'loving others'
    };
    var actionMap = {
      pray: 'talk to God in prayer',
      trust: 'trust God',
      obey: 'follow what God says',
      help: 'show kindness and help others'
    };
    var outcomeMap = {
      peace: 'peace',
      courage: 'courage',
      comfort: 'comfort',
      joy: 'joy'
    };
    var focus = focusMap[insights.meaning] || 'real life';
    var action = actionMap[insights.action] || 'talk to God';
    var outcome = outcomeMap[insights.outcome] || 'peace';
    var ageBand = inferKidsAgeBand(insights.query);
    var apply = String((context && context.apply) || '').trim();
    if (!apply) apply = 'Pray and take one kind step today.';
    apply = simplifyKidsApply(apply, ageBand);
    if (ageBand === 'little') {
      return {
        ageBand: ageBand,
        ageLabel: 'Younger Kids',
        breakdown: 'God sees your heart when you feel ' + focus + '. This verse says you can ' + action + '. God gives ' + outcome + ' and stays close to you.',
        apply: apply
      };
    }
    if (ageBand === 'teen') {
      return {
        ageBand: ageBand,
        ageLabel: 'Older Kids / Teens',
        breakdown: 'This verse meets you in ' + focus + ', not in fake positivity. It calls you to ' + action + ' and trust God when pressure rises. As you walk it out, God builds real ' + outcome + ' in your daily life.',
        apply: apply
      };
    }
    return {
      ageBand: ageBand,
      ageLabel: 'Preteens',
      breakdown: 'This verse helps when kids face ' + focus + '. It teaches us to ' + action + ' and remember God is near. God can give ' + outcome + ' one step at a time.',
      apply: apply
    };
  }

  function getFilteredVerseIndices(topicOrQuery) {
    return getKidsSearchInsights(topicOrQuery).indices;
  }

  function normalizeRefKey(ref) {
    var key = String(ref || '').toLowerCase().trim();
    if (!key) return '';
    key = key.replace(/\s*\((?:kjv|niv|esv|nlt|amp|msg)\)\s*$/i, '');
    key = key.replace(/[–—]/g, '-');
    key = key.replace(/[;,]+/g, ' ');
    key = key.replace(/\s+/g, ' ');
    key = key.replace(/\.$/, '');
    return key;
  }

  function resolveContextKey(ref) {
    var key = normalizeRefKey(ref);
    if (!key) return '';
    if (KID_CONTEXT[key]) return key;
    if (KID_FRIENDLY_TRANSLATIONS[key]) return key;
    var firstVerse = key.replace(/(:\d+)-\d+\b/, '$1');
    if (KID_CONTEXT[firstVerse]) return firstVerse;
    var chapterOnly = key.replace(/:\d+\b.*/, '');
    if (KID_CONTEXT[chapterOnly]) return chapterOnly;
    return key;
  }

  function bookFromRef(ref) {
    var key = normalizeRefKey(ref);
    if (!key) return '';
    var m = key.match(/^([1-3]?\s*[a-z]+(?:\s+[a-z]+)*)\s+\d+:\d+/i);
    if (!m) return '';
    return m[1].replace(/\s+/g, ' ').trim();
  }

  function deriveApplyText(ref, kidText) {
    var simple = String(kidText || '').trim();
    if (simple) return simple;
    var book = bookFromRef(ref);
    if (book === 'psalm' || book === 'proverbs') return 'Pray this verse to God and practice it today.';
    if (book === 'matthew' || book === 'mark' || book === 'luke' || book === 'john') return 'Watch how Jesus lived, then copy Him in one choice today.';
    return 'Ask God to help you live this verse today, one brave step at a time.';
  }

  function renderKidContext(ref, verseText) {
    var ctxEl = document.getElementById('kids-verse-context');
    if (!ctxEl) return;
    var ctx = getKidContext(ref, verseText);
    ctxEl.classList.remove('hidden');
    ctxEl.innerHTML = '<p class="kids-context-who"><strong>Who said it:</strong> ' + escapeHtml(ctx.who || '') + '</p>' +
      '<p class="kids-context-to"><strong>To whom:</strong> ' + escapeHtml(ctx.to || '') + '</p>' +
      '<p class="kids-context-apply"><strong>For you:</strong> ' + escapeHtml(ctx.apply || '') + '</p>';
  }

  function setMainVerse(index) {
    if (index < 0 || index >= KIDS_VERSES.length) return;
    var v = KIDS_VERSES[index];
    var p = KIDS_PRAYERS[index];
    var kidText = getKidText(v.ref) || v.text;
    var refEl = document.getElementById('kids-verse-ref');
    var textEl = document.getElementById('kids-verse-text');
    var prayerEl = document.getElementById('kids-prayer-text');
    if (refEl) refEl.textContent = v.ref;
    if (textEl) textEl.textContent = kidText;
    if (prayerEl) prayerEl.textContent = p;
    renderKidContext(v.ref, kidText || v.text);
    var cartoon = getCartoonForVerse(v.ref, v.text, index);
    var container = document.getElementById('kids-cartoon-container');
    if (container) {
      if (cartoon.type === 'carousel') {
        var story = bibleStories[cartoon.story];
        var panelsHtml = (story.panels || []).map(function (p) {
          return '<img src="' + escapeHtml(p.src || '') + '" alt="' + escapeHtml(p.alt || '') + '" class="comic-panel" width="200" height="160">';
        }).join('');
        var videoTitle = escapeHtml(story.videoTitle || '');
        var safeVideoId = safeYouTubeId(story.videoId);
        var btnHtml = safeVideoId ? '<button type="button" class="watch-video-btn" data-video-id="' + safeVideoId + '" data-title="' + videoTitle + '">🎥 Watch the story move! (2 min)</button>' : '';
        container.innerHTML = '<div class="comic-carousel"><div class="panels-container">' + panelsHtml + '</div><p class="comic-caption">' + escapeHtml(story.caption || '') + '</p>' + btnHtml + '</div>';
      } else {
        container.innerHTML = '<div class="bible-cartoon ' + escapeHtml(cartoon.anim || '') + '"><img src="' + escapeHtml(cartoon.src || '') + '" alt="' + escapeHtml(cartoon.alt || '') + '" class="cartoon-img" width="200" height="160"><p class="cartoon-caption">' + escapeHtml(cartoon.caption || '') + '</p></div>';
      }
    }
  }

  function getKidText(ref) {
    var key = resolveContextKey(ref);
    return KID_FRIENDLY_TRANSLATIONS[key] || null;
  }

  function getKidContext(ref, verseText) {
    var key = resolveContextKey(ref);
    var curated = KID_CONTEXT[key];
    if (curated) return curated;

    if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.getBreakdown === 'function') {
      try {
        var breakdown = window.TDBVerseBreakdown.getBreakdown(ref, verseText || '');
        if (breakdown && (breakdown.about || breakdown.to || breakdown.applies)) {
          return {
            who: breakdown.about || 'Bible speaker in this passage',
            to: breakdown.to || 'God\'s people',
            apply: breakdown.applies || deriveApplyText(ref, verseText || '')
          };
        }
      } catch (e) {}
    }

    var book = bookFromRef(key);
    var base = BOOK_CONTEXT[book] || { who: 'God\'s Word', to: 'God\'s people' };
    return {
      who: base.who,
      to: base.to,
      apply: deriveApplyText(key, getKidText(key))
    };
  }

  function escapeHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function safeYouTubeId(id) {
    var s = String(id || '').trim();
    return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : '';
  }

  function renderFilteredResults(topicOrQuery) {
    var resultsEl = document.getElementById('kids-search-results');
    if (!resultsEl) return;
    var insights = getKidsSearchInsights(topicOrQuery);
    var indices = insights.indices;
    var maxShow = 5;
    if (indices.length === 0) {
      resultsEl.innerHTML = '<p class="kids-search-no-match">Try "brave" or "friends"!</p>';
      resultsEl.classList.remove('hidden');
      return;
    }
    var html = '';
    var topMatches = indices.slice(0, 3).map(function (idx) {
      var v = KIDS_VERSES[idx];
      var text = String((v && v.text) || '').trim();
      var snippet = text.length > 80 ? (text.slice(0, 77) + '...') : text;
      return '<li><strong>' + escapeHtml(v.ref || '') + '</strong> — ' + escapeHtml(snippet) + '</li>';
    }).join('');
    var strongestVerse = KIDS_VERSES[indices[0]];
    var strongestCtx = getKidContext(strongestVerse.ref, strongestVerse.text);
    var strongestBreakdown = buildKidsBreakdown(strongestVerse, strongestCtx, insights);
    html += '<div class="kids-result-card kids-search-summary">' +
      '<span class="kids-result-context kids-summary-kicker"><strong>KJV matches:</strong></span>' +
      '<ul class="kids-search-summary-list">' + topMatches + '</ul>' +
      '<span class="kids-result-context kids-summary-age"><strong>Age fit:</strong> ' + escapeHtml(strongestBreakdown.ageLabel || 'Preteens') + '</span>' +
      '<span class="kids-result-ref kids-summary-ref">' + escapeHtml(strongestVerse.ref || '') + '</span>' +
      '<span class="kids-result-text kids-summary-text">"' + escapeHtml(strongestVerse.text || '') + '"</span>' +
      '<span class="kids-result-context kids-summary-breakdown">' + escapeHtml(strongestBreakdown.breakdown) + '</span>' +
      '<span class="kids-result-context kids-summary-application"><strong>Try this today:</strong> ' + escapeHtml(strongestBreakdown.apply) + '</span>' +
      '</div>';
    for (var i = 0; i < Math.min(indices.length, maxShow); i++) {
      var idx = indices[i];
      var v = KIDS_VERSES[idx];
      var p = KIDS_PRAYERS[idx];
      var kidText = getKidText(v.ref) || v.text;
      var ctx = getKidContext(v.ref, kidText || v.text);
      var refEsc = escapeHtml(v.ref);
      var textEsc = escapeHtml(kidText);
      var whoEsc = escapeHtml(ctx.who);
      var toEsc = escapeHtml(ctx.to);
      var applyEsc = escapeHtml(ctx.apply);
      html += '<button type="button" class="kids-result-card" data-index="' + idx + '">' +
        '<span class="kids-result-ref">' + refEsc + '</span>' +
        '<span class="kids-result-text">"' + textEsc + '"</span>' +
        '<span class="kids-result-context">' +
        'Who said it? ' + whoEsc + '<br>' +
        'Who it was said to? ' + toEsc + '<br>' +
        'How to use it today? ' + applyEsc +
        '</span>' +
        '</button>';
    }
    resultsEl.innerHTML = html;
    resultsEl.classList.remove('hidden');
  }

  function applyTopicFilter(topicOrQuery) {
    var indices = getFilteredVerseIndices(topicOrQuery);
    renderFilteredResults(topicOrQuery);
    if (indices.length > 0) {
      setMainVerse(indices[0]);
    }
  }

  function renderKidsTopicButtons() {
    var container = document.getElementById('kids-topic-buttons');
    if (!container || !Array.isArray(KIDS_TOPICS) || KIDS_TOPICS.length === 0) return;
    var html = '';
    KIDS_TOPICS.forEach(function (item) {
      html += '<button type="button" class="kids-topic-btn" data-topic="' + (item.topic || '').replace(/"/g, '&quot;') + '">' + (item.label || item.topic) + '</button>';
    });
    container.innerHTML = html;
  }

  function wireKidsSearch() {
    var form = document.getElementById('kids-search-form');
    var input = document.getElementById('kids-search-input');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var query = input ? input.value : '';
        applyTopicFilter(query);
      });
    }
    try {
      var params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
      var q = (params.get('q') || '').trim();
      if (q && input) {
        input.value = q;
        renderFilteredResults(q);
      }
    } catch (e) {}
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.kids-topic-btn') : null;
      if (btn && btn.getAttribute('data-topic')) {
        e.preventDefault();
        var topic = btn.getAttribute('data-topic');
        if (input) input.value = topic;
        applyTopicFilter(topic);
      }
      var card = e.target && e.target.closest ? e.target.closest('.kids-result-card') : null;
      if (card && card.getAttribute('data-index')) {
        e.preventDefault();
        var idx = parseInt(card.getAttribute('data-index'), 10);
        if (!isNaN(idx)) setMainVerse(idx);
      }
    });
  }

  function wireVideoModal() {
    document.addEventListener('click', function (e) {
      if (e.target.classList && e.target.classList.contains('watch-video-btn')) {
        var id = safeYouTubeId(e.target.getAttribute('data-video-id'));
        var title = e.target.getAttribute('data-title') || '';
        if (!id) return;
        var titleEl = document.getElementById('video-modal-title');
        var frameEl = document.getElementById('video-frame');
        var modalEl = document.getElementById('video-modal');
        if (titleEl) titleEl.textContent = title;
        if (frameEl) frameEl.src = 'https://www.youtube.com/embed/' + id + '?rel=0&modestbranding=1&playsinline=1';
        if (modalEl) modalEl.classList.remove('hidden');
      }
      if (e.target.id === 'video-modal' || (e.target.classList && e.target.classList.contains('kids-video-modal-close'))) {
        var modal = document.getElementById('video-modal');
        var frame = document.getElementById('video-frame');
        if (modal) modal.classList.add('hidden');
        if (frame) frame.src = '';
      }
    });
  }

  function renderFamilyCode() {
    var section = document.getElementById('kids-family-code-section');
    var form = document.getElementById('kids-family-code-form');
    var status = document.getElementById('kids-family-code-status');
    var errorEl = document.getElementById('kids-family-code-error');
    if (!section || !form || !status) return;
    var code = null;
    try { code = localStorage.getItem(KIDS_FAMILY_CODE_KEY); } catch (e) {}
    if (errorEl) errorEl.classList.add('hidden');
    if (code) {
      form.classList.add('hidden');
      status.classList.remove('hidden');
    } else {
      form.classList.remove('hidden');
      status.classList.add('hidden');
    }
  }

  function syncKidStreak() {
    var code = null;
    try { code = localStorage.getItem(KIDS_FAMILY_CODE_KEY); } catch (e) {}
    if (!code || code.length !== 6) return;
    var cfg = window.TDB_CONFIG || {};
    var supabaseUrl = cfg.SUPABASE_URL;
    var supabaseKey = cfg.SUPABASE_ANON_KEY;
    if (!navigator.onLine || !supabaseUrl || !supabaseKey) return;
    var data = getStreakData();
    var streak = Math.ceil(Number(data.count || 0));
    var lastDay = data.lastKey || getDailyKey();
    try {
      var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
      if (supabase && supabase.createClient) {
        var client = supabase.createClient(supabaseUrl, supabaseKey);
        client.rpc('upsert_kid_streak', { p_code: code, p_streak_count: streak, p_last_day: lastDay }).catch(function () {});
      }
    } catch (e) {}
  }

  function notifyParentOnRedeem(code) {
    var cfg = window.TDB_CONFIG || {};
    var supabaseUrl = cfg.SUPABASE_URL;
    if (!supabaseUrl || !navigator.onLine) return;
    var lastStoryKey = null;
    try {
      var raw = localStorage.getItem(KIDS_LIBRARY_VIEWED_KEY);
      var viewed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(viewed) && viewed.length > 0) lastStoryKey = viewed[viewed.length - 1];
    } catch (e) {}
    var stories = window.TDB_BIBLE_STORIES || {};
    var s = lastStoryKey ? stories[lastStoryKey] : null;
    var lastStoryTitle = (s && s.title) ? s.title : '';
    var lastStoryApply = (s && s.kidContext && s.kidContext.apply) ? s.kidContext.apply : '';
    var url = (supabaseUrl.replace(/\/$/, '') + '/functions/v1/notify-parent-on-redeem');
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code, lastStoryTitle: lastStoryTitle, lastStoryApply: lastStoryApply })
    }).catch(function () {});
  }

  function wireFamilyCodeForm() {
    var form = document.getElementById('kids-family-code-form');
    var input = document.getElementById('kids-family-code-input');
    var errorEl = document.getElementById('kids-family-code-error');
    if (!form || !input) return;

    function hideCodeError() {
      if (errorEl) { errorEl.classList.add('hidden'); errorEl.textContent = ''; }
    }

    function showCodeError(msg) {
      if (errorEl) { errorEl.textContent = msg; errorEl.classList.remove('hidden'); }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideCodeError();
      var code = (input.value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (code.length !== 6) {
        showCodeError('Enter a 6-character code from your parent.');
        return;
      }

      var cfg = window.TDB_CONFIG || {};
      var supabaseUrl = cfg.SUPABASE_URL;
      var supabaseKey = cfg.SUPABASE_ANON_KEY;
      if (!navigator.onLine || !supabaseUrl || !supabaseKey) {
        showCodeError('Internet is required to connect. Please retry when back online.');
        return;
      }

      try {
        var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
        if (!supabase || !supabase.createClient) {
          showCodeError('Something went wrong. Please try again.');
          return;
        }
        var client = supabase.createClient(supabaseUrl, supabaseKey);
        client.rpc('redeem_invite_code', { code: code }).then(function (res) {
          if (res.error) {
            showCodeError('Something went wrong. Please try again.');
            return;
          }
          var data = res.data;
          if (data && data.ok) {
            try { localStorage.setItem(KIDS_FAMILY_CODE_KEY, code); } catch (err) {}
            hideCodeError();
            renderFamilyCode();
            notifyParentOnRedeem(code);
          } else {
            var reason = (data && data.reason) || 'invalid';
            if (reason === 'used') {
              showCodeError('Sorry, code already taken!');
            } else {
              showCodeError('Invalid code. Check with your parent.');
            }
          }
        }).catch(function () {
          showCodeError('Something went wrong. Please try again.');
        });
      } catch (err) {
        showCodeError('Something went wrong. Please try again.');
      }
    });
  }

  function renderStoryOfDay() {
    var el = document.getElementById('kids-story-of-day');
    var thumb = document.getElementById('kids-story-of-day-thumb');
    var titleEl = document.getElementById('kids-story-of-day-title');
    var captionEl = document.getElementById('kids-story-of-day-caption');
    var link = document.querySelector('.kids-story-of-day-link');
    if (!el || !bibleStories) return;
    var keys = Object.keys(bibleStories);
    if (keys.length === 0) return;
    var weekMs = 7 * 24 * 60 * 60 * 1000;
    var idx = Math.floor(Date.now() / weekMs) % keys.length;
    var key = keys[idx];
    var story = bibleStories[key];
    if (!story) return;
    var panels = story.panels || [];
    var thumbSrc = panels[0] ? panels[0].src : 'panel-david-1.svg';
    var thumbAlt = panels[0] && panels[0].alt ? panels[0].alt : (story.title || key);
    var caption = (story.caption || 'Swipe in Kids Story Library to see!').replace(/<[^>]+>/g, '');
    if (thumb) { thumb.src = thumbSrc; thumb.alt = thumbAlt; }
    if (titleEl) titleEl.textContent = story.title || key;
    if (captionEl) captionEl.textContent = caption;
    if (link) link.href = 'corner.html?story=' + encodeURIComponent(key);
  }

  function getKidName() {
    try {
      var n = localStorage.getItem(KID_NAME_KEY);
      return (n && typeof n === 'string') ? n.trim() : '';
    } catch (e) { return ''; }
  }

  function updateKidGreeting() {
    var name = getKidName();
    var badge = document.getElementById('kids-greeting-badge');
    var tagline = document.getElementById('kids-hero-tagline');
    if (name) {
      if (badge) badge.textContent = 'Hey, ' + name + '! Faith Trail';
    } else {
      if (badge) badge.textContent = '🔥 Faith Trail';
    }
    if (tagline) tagline.textContent = "Two minutes. One verse. One prayer. You're a hero!";
  }

  function showKidNameModalIfNeeded() {
    if (getKidName()) return;
    var modal = document.getElementById('kids-name-modal');
    if (modal) modal.classList.remove('hidden');
  }

  function wireShareStreak() {
    var btn = document.getElementById('kids-share-streak');
    var toast = document.getElementById('kids-share-toast');
    if (!btn) return;
    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(function () { toast.classList.add('hidden'); }, 2500);
    }
    btn.addEventListener('click', function () {
      var streak = getCurrentStreak();
      var shareUrl = 'https://todaysdailybattle.com/kids/';
      var shareText = "My streak's " + streak + " day" + (streak === 1 ? '' : 's') + "—join the Faith Trail!";
      if (navigator.share) {
        navigator.share({
          title: 'Kids Battle Streak!',
          text: shareText,
          url: shareUrl
        }).then(function () { showToast('Shared!'); }).catch(function () {
          copyAndToast(shareText + ' ' + shareUrl, showToast);
        });
      } else {
        copyAndToast(shareText + ' ' + shareUrl, showToast);
      }
    });
    function copyAndToast(text, fn) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { fn('Link copied!'); }).catch(function () { fn('Link: ' + text); });
      } else {
        fn('Link: ' + text);
      }
    }
  }

  function wireKidNameModal() {
    var modal = document.getElementById('kids-name-modal');
    var input = document.getElementById('kids-name-input');
    var saveBtn = document.getElementById('kids-name-save');
    if (!modal || !input || !saveBtn) return;
    function closeAndUpdate() {
      modal.classList.add('hidden');
      updateKidGreeting();
    }
    saveBtn.addEventListener('click', function () {
      var val = (input.value || '').trim() || 'Kiddo';
      try {
        localStorage.setItem(KID_NAME_KEY, val);
        closeAndUpdate();
      } catch (e) {}
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveBtn.click();
      }
    });
  }

  function init() {
    renderKidsTopicButtons();
    renderVerseAndPrayer();
    loadKidReflection();
    renderStreak();
    renderDoneState();
    renderComeBackNudge();
    renderBadges();
    renderStoryOfDay();
    updateKidGreeting();
    showKidNameModalIfNeeded();
    wireKidNameModal();
    syncKidStreak();
    renderFaithTrail();
    renderFamilyCode();
    wireKidsSearch();
    wireKidReflection();
    wireQuiz();
    wireMemory();
    wireMarkDone();
    wireRemindBtn();
    wireFamilyCodeForm();
    wireDoodle();
    wireVerseSpeak();
    wireShareBtn();
    wireShareStreak();
    wireSidebar();
    wireVideoModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  var STORY_THEMES = {
    david: 'Protection', noah: 'Obedience', jesus: 'Love', jonah: 'Obedience', daniel: 'Miracles',
    adamEve: 'Protection', cainAbel: 'Obedience', towerBabel: 'Obedience', abrahamIsaac: 'Obedience', josephCoat: 'Protection', josephSold: 'Protection',
    mosesBush: 'Protection', redSea: 'Miracles', manna: 'Miracles', tenCommandments: 'Obedience', goldenCalf: 'Obedience', spiesInCanaan: 'Obedience', samson: 'Protection',
    fieryFurnace: 'Miracles', esther: 'Protection', jesusBirth: 'Miracles', jesusCalmsStorm: 'Miracles', jesusFeeds5000: 'Miracles',
    goodSamaritan: 'Love', prodigalSon: 'Love', zacchaeus: 'Love', lazarus: 'Miracles', resurrection: 'Miracles',
    creation: 'Obedience', fallOfJericho: 'Obedience', davidSheep: 'Love', elijahFire: 'Miracles', elishaOil: 'Miracles',
    naaman: 'Obedience', jesusWalksWater: 'Miracles', lostSheep: 'Love', palmSunday: 'Protection', lastSupper: 'Love',
    jesusTemptation: 'Obedience', parableSower: 'Protection', richYoungRuler: 'Obedience', widowsMite: 'Love', gardenPrayer: 'Protection',
    betrayal: 'Protection', trial: 'Protection', crucifixion: 'Love', roadToEmmaus: 'Love', ascension: 'Protection',
    pentecost: 'Miracles', stephen: 'Protection', paulDamascus: 'Protection', heavenPromise: 'Protection',
    ruthBoaz: 'Love', parableTalents: 'Obedience', armorOfGod: 'Obedience',
    /* Week 1 */
    mosesSea: 'Miracles', burningBush: 'Obedience', tenPlagues: 'Miracles', naamanDip: 'Obedience',
    creationLight: 'Miracles', elijahFire: 'Miracles', elishaOil: 'Miracles', towerBabel: 'Obedience',
    /* Week 2 */
    sarahLaughs: 'Miracles', jacobLadder: 'Protection', josephDreams: 'Protection',
    josephPrison: 'Protection', pharaohDreams: 'Miracles', josephRuler: 'Miracles', mosesBaby: 'Protection',
    mosesStaffSnake: 'Miracles', passoverLamb: 'Love', redSeaCrossing: 'Protection',
    /* Week 3 */
    joshuaJordan: 'Miracles', jerichoWalls: 'Obedience', joshuaAi: 'Obedience', rahabRope: 'Obedience', rahabJericho: 'Obedience',
    balaamDonkey: 'Obedience', samsonHair: 'Protection', ruthGlean: 'Love',
    samuelCall: 'Obedience', davidHarp: 'Love', goliathChallenge: 'Protection',
    davidAnointed: 'Obedience', saulSpear: 'Protection', davidCave: 'Protection',
    /* Week 4 */
    elishaRaised: 'Miracles', estherCrown: 'Protection', nehemiahWalls: 'Obedience',
    jobSuffering: 'Protection', psalm23Shepherd: 'Love', solomonWisdom: 'Obedience',
    elijahChariot: 'Miracles', jonahVine: 'Love', danielPray: 'Obedience', estherBanquet: 'Protection',
    /* Week 5 */
    angelMary: 'Miracles', shepherdsStar: 'Love', jesusManger: 'Love', jesusTemple: 'Obedience',
    johnBaptize: 'Obedience', jesusTempt: 'Obedience', weddingWine: 'Miracles',
    healBlind: 'Miracles', jesusBlessKids: 'Love',
    /* Week 6 */
    mustardSeed: 'Obedience', healLeper: 'Miracles', jairus: 'Miracles',
    transfigure: 'Miracles', judasKiss: 'Love',
    /* Week 7 */
    crossCarry: 'Love', tombEmpty: 'Miracles', emmausRoad: 'Love', thomasDoubt: 'Obedience',
    pentecostFire: 'Miracles', peterShadow: 'Miracles', paulShipwreck: 'Protection',
    paulSilas: 'Protection', tenVirgins: 'Obedience',
    /* Week 8 */
    armorShield: 'Protection', armorSword: 'Protection', fruitSpirit: 'Love',
    loveChapter: 'Love', faithMustard: 'Obedience', prayerKnock: 'Obedience',
    worryBirds: 'Protection', forgive70x7: 'Love', widowMite: 'Love', maryAnoint: 'Love',
    /* Week 9 */
    stephenStones: 'Protection', philipChariot: 'Obedience', paulShip: 'Protection',
    revelationThrone: 'Miracles', fourHorsemen: 'Protection', alphaOmega: 'Obedience',
    newHeaven: 'Love', treeOfLife: 'Love', riverOfLife: 'Love', lambBook: 'Obedience',
    dragonFight: 'Protection', beastMark: 'Obedience',
    /* Week 10 */
    rahabWindow: 'Obedience', deborahJudge: 'Protection', jaelTent: 'Protection',
    abigailWise: 'Love', hannahPray: 'Miracles', maryMagdalene: 'Love',
    lydiaSell: 'Obedience', priscillaTeach: 'Obedience', ruthMoab: 'Love',
    estherFast: 'Obedience', sarahPromise: 'Miracles', miriamSong: 'Love',
    /* Week 11 */
    annaProphet: 'Obedience', widowOil: 'Miracles', persistentWidow: 'Obedience',
    samaritanWoman: 'Love', marthaServe: 'Obedience', marySit: 'Obedience',
    dorcasRaise: 'Miracles', phoebeDeacon: 'Obedience', juniaApostle: 'Obedience',
    loisTimothy: 'Love', euniceMother: 'Love', priscillaTent: 'Obedience',
    /* Week 12 */
    greatCommission: 'Obedience', pentecostTongues: 'Miracles', armorBelt: 'Protection',
    prayerCloset: 'Obedience', faithMountain: 'Obedience', loveNeighbor: 'Love',
    heavenDoor: 'Love', revelationBride: 'Love', treeFruit: 'Love', noNight: 'Love',
    everyKneeBow: 'Obedience', newEarth: 'Love', alphaOmega2: 'Obedience', comeLordJesus: 'Love'
  };

  if (typeof window !== 'undefined') {
    window.TDB_BIBLE_STORIES = bibleStories;
    window.TDB_BIBLE_STORY_KEYS = Object.keys(bibleStories);
    window.TDB_STORY_THEMES = STORY_THEMES;
  }
})();
