'use strict';

/**
 * Overrides merged into kids-read-quiz-data.js (see scripts/generate-kids-read-quiz-data.mjs).
 *
 * Keep this file tiny: only keys that must differ from auto-generation.
 * Two library cards share one Joshua 6 read+quiz — same pack for both keys.
 * David & Goliath: full read-along sections + quiz live in read-quiz-david-pack.cjs (keys david + davidGoliath).
 *
 * All other stories use buildPack() — short beats, panel alts + apply when no narration,
 * no filler (see generator).
 */

const davidReadQuizPack = require('./read-quiz-david-pack.cjs');

/** Shared read+quiz for both Jericho library cards — Fall of Jericho (Joshua 6:1-5, 11-16, 20). */
function buildJerichoReadQuiz() {
  var lordWord =
    'The Lord told Joshua, "See, I have given into thine hand Jericho. Ye shall compass the city, all ye men of war, and go round about the city once. Thus shalt thou do six days. And seven priests shall bear before the ark seven trumpets of rams\' horns. On the seventh day ye shall compass the city seven times, and the priests shall blow with the trumpets. And it shall come to pass, that when they make a long blast with the ram\'s horn, all the people shall shout with a great shout; and the wall of the city shall fall down flat."';

  return {
    kjvRef: 'Joshua 6:1-5, 11-16, 20 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "God's people had come to the strong city of Jericho. The walls were tall and thick, and the gates were shut tight.",
        caption: 'A city with strong walls',
        image: 'panel-david-1.svg'
      },
      {
        text: lordWord,
        caption: 'The Lord tells Joshua the plan',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Joshua and the people did exactly as the Lord commanded. For six days they marched around the city once each day. On the seventh day they marched around it seven times. The priests blew the trumpets, and at the long blast the people shouted with a great shout.',
        caption: 'They obeyed every step',
        image: 'panel-david-2.svg'
      },
      {
        text: 'And the wall fell down flat.',
        caption: 'God made the walls fall',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'The people went up into the city, every man straight before him, and they took the city — because the Lord had given it to them.',
        caption: 'The Lord gave the victory',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      "God's people had come to the strong city of Jericho. The walls were tall and thick, and the gates were shut tight.",
      lordWord,
      'Joshua and the people did exactly as the Lord commanded. For six days they marched around the city once each day. On the seventh day they marched around it seven times. The priests blew the trumpets, and at the long blast the people shouted with a great shout.',
      'And the wall fell down flat.',
      'The people went up into the city, every man straight before him, and they took the city — because the Lord had given it to them.',
      'For you: When God asks you to obey—even when the plan feels strange—He can do what no one else can do. Trust Him step by step.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Joshua 6:1-5, 11-16, 20', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Joshua 6:1-5, 11-16, 20.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'Joshua and the Lord', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback:
          'Look for who gave the plan and who obeyed. (Answer: Joshua and the Lord.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never helps His people.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'When God\'s people obeyed His plan, He brought the walls down and gave them the city.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: When God's people obeyed….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship knocked the walls down.',
          'On the seventh day they marched around the city seven times, then shouted, and the wall fell down flat.',
          'A talking toaster became king of Jericho.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Ask God to help you obey His Word—trust Him even when His way seems surprising.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Ask God to help you obey….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading the Fall of Jericho with God's Word today.",
    takeaway:
      'God gave Joshua a careful plan—march, trumpets, shout—and the wall fell flat. Obedience and faith belong together.',
    prayer:
      'God, thank You for the Bible. Thank You that You are mighty and true. Help me obey You and trust You today. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled victorious mood, no soldiers fighting, no weapons, no fear, no text in image: great walls of Jericho falling down flat in gentle broken sections, Joshua and priests calmly in foreground with trumpets raised, people of Israel shouting with happy trusting faces, soft sky minimal city background, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: March around Jericho — day by day (joshua 6)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Priests with ram\'s horn trumpets and the ark',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Seventh day — seven times around the city',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Walls fall flat — God gave the city (jericho)'
    ],
    readAlongImages: []
  };
}

/** Moses Sea-Split — full read-along + quiz (Exodus 14:21-31). */
function buildRedSeaReadQuiz() {
  return {
    kjvRef: 'Exodus 14:21-31 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "God's people were afraid. The great Egyptian army was chasing them, and in front of them was the wide Red Sea. They had nowhere to go.",
        caption: 'Trapped between the sea and the army',
        image: 'panel-noah-1.svg'
      },
      {
        text: "But Moses stretched out his hand over the sea, just as God told him.",
        caption: 'Moses obeys God',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'And the Lord caused the sea to go back all night with a strong east wind. The waters divided.',
        caption: 'God opens a path',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'The children of Israel walked into the sea upon dry ground, with walls of water on their right hand and on their left.',
        caption: 'Safe road through the sea',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          "When the Egyptians tried to follow, God told Moses to stretch out his hand again. The waters returned and covered all the chariots and the horsemen. Not one of them remained.",
        caption: 'God saves His people',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          'That day the Lord saved Israel. And the people feared the Lord, and believed the Lord and His servant Moses.',
        caption: 'Israel trusts God and Moses',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      "God's people were afraid. The great Egyptian army was chasing them, and in front of them was the wide Red Sea. They had nowhere to go.",
      "But Moses stretched out his hand over the sea, just as God told him.",
      'And the Lord caused the sea to go back all night with a strong east wind. The waters divided.',
      'The children of Israel walked into the sea upon dry ground, with walls of water on their right hand and on their left.',
      "When the Egyptians tried to follow, God told Moses to stretch out his hand again. The waters returned and covered all the chariots and the horsemen. Not one of them remained.",
      'That day the Lord saved Israel. And the people feared the Lord, and believed the Lord and His servant Moses.',
      'For you: When you feel stuck or afraid, God can still make a way. Pray and trust Him—He is strong to save.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'John 3:16', 'Genesis 1:1', 'Exodus 14:21-31'],
        correctIndex: 3,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 14:21-31.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Only Pharaoh', 'God', 'A talking animal', 'Nobody'],
        correctIndex: 1,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'We should hide from God when we mess up.',
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'God made a way through the sea and saved His people when they trusted Him.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God made a way through the sea….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'A talking toaster became king of the city.',
          'Everyone decided to never sleep again.',
          'Moses stretched out his hand over the sea, and the waters divided.'
        ],
        correctIndex: 3,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'When you feel stuck or afraid, pray and trust God—He can make a way.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: pray and trust God….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Moses Sea-Split with God's Word today.",
    takeaway:
      'God opened the sea, brought Israel through on dry ground, and closed the waters behind them. He still makes a way for those who trust Him.',
    prayer:
      'God, thank You for the Bible. Thank You that You save and lead Your people. Help me trust You when I feel afraid. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces for crayons, peaceful not scary, no text in image: Moses on dry ground with staff stretched over the Red Sea, sea parted into two gentle walls of water, wide safe path in the middle, families walking calmly through, soft sky lines, no chariots or soldiers visible, ages 3-8 coloring page style',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses stretching his hand over the sea – God parts the waters (red sea)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People walking on dry ground between walls of water – God makes a way (exodus 14)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Israelites at the shore – sea about to open (moses)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Walls of water on each side – families walking through (staff)'
    ],
    readAlongImages: []
  };
}

/** Burning Bush — full read-along + quiz (Exodus 3:1-6; card may note fuller Exodus 3 in the library). */
function buildMosesBushReadQuiz() {
  return {
    kjvRef: 'Exodus 3:1-6 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "Moses was taking care of his father-in-law's sheep in the desert. One day he came to the mountain of God, called Horeb.",
        caption: 'Moses and the sheep at Horeb',
        image: 'panel-jesus-1.svg'
      },
      {
        text:
          'He saw a most wonderful thing. A bush was burning with fire, but the bush was not burned up. The flames danced, yet the leaves stayed green and whole.',
        caption: 'Fire in the bush—yet it is not consumed',
        image: 'panel-jesus-1.svg'
      },
      {
        text:
          'Moses said, "I will turn aside and see this great sight, why the bush is not burnt."',
        caption: 'Moses draws near',
        image: 'panel-jesus-2.svg'
      },
      {
        text:
          'When the Lord saw that Moses turned to look, God called to him out of the midst of the bush, "Moses, Moses." And Moses said, "Here am I."',
        caption: 'God calls by name',
        image: 'panel-jesus-2.svg'
      },
      {
        text:
          'God said, "Draw not nigh hither: put off thy shoes from off thy feet, for the place whereon thou standest is holy ground."',
        caption: 'Holy ground',
        image: 'panel-jesus-3.svg'
      },
      {
        text:
          'Then God told Moses who He was — the God of his fathers, Abraham, Isaac, and Jacob. And Moses hid his face, for he was afraid to look upon God.',
        caption: 'The God of Abraham, Isaac, and Jacob',
        image: 'panel-jesus-3.svg'
      }
    ],
    paragraphs: [
      "Moses was taking care of his father-in-law's sheep in the desert. One day he came to the mountain of God, called Horeb.",
      'He saw a most wonderful thing. A bush was burning with fire, but the bush was not burned up.',
      'Moses said, "I will turn aside and see this great sight, why the bush is not burnt."',
      'When the Lord saw that Moses turned to look, God called to him out of the midst of the bush, "Moses, Moses." And Moses said, "Here am I."',
      'God said, "Draw not nigh hither: put off thy shoes from off thy feet, for the place whereon thou standest is holy ground."',
      'Then God told Moses who He was — the God of his fathers, Abraham, Isaac, and Jacob. And Moses hid his face, for he was afraid to look upon God.',
      'For you: When God speaks, we listen with quiet hearts. You can say "Here am I" too—He loves to call His children.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Exodus 3:1-6', 'Genesis 1:1', 'John 3:16'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 3:1-6.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'God', 'Pharaoh'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'We should hide from God when we mess up.',
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'God is holy. He called Moses from the bush and told him to stand on holy ground with reverence.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God is holy….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A talking toaster became king of the city.',
          'The bush burned with fire but was not burned up.',
          'A spaceship landed in the parking lot.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Listen when God speaks—in His Word and in prayer—and answer with a willing heart.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Listen when God speaks….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Burning Bush with God's Word today.",
    takeaway:
      'God met Moses in holy fire that did not destroy the bush. He knows your name too—and He is worthy of quiet reverence.',
    prayer:
      'God, thank You for the Bible. Thank You that You speak to Your people. Help me listen with a soft heart. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open areas for crayons, joyful wonder not fear, no text in image: Moses near a large bush on a quiet desert hill, gentle flames rising from the bush center, leaves and branches clearly not burned, Moses surprised but calm, one hand slightly raised, staff in the other, soft desert hills behind, minimal lines, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses sees a bush on fire (moses)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God calls Moses from the bush (bush)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses takes off his shoes on holy ground (exodus 3)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses hides his face before God (fire)'
    ],
    readAlongImages: []
  };
}

/** Passover Lamb — read-along + quiz (Exodus 12:7-13; card may show 12:1-14). */
function buildPassoverLambReadQuiz() {
  return {
    kjvRef: 'Exodus 12:7-13 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'God told Moses and Aaron what His people must do so the angel of death would pass over their houses. Each family was to take a perfect little lamb and keep it until the evening.',
        caption: 'A lamb for each home',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'Then they would kill the lamb and take some of its blood. With a bunch of hyssop they would strike the blood on the two side posts and on the upper door post of their house.',
        caption: 'Blood on the doorposts',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'God said, "When I see the blood, I will pass over you, and the plague shall not be upon you to destroy you."',
        caption: "God's promise",
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'That night, the children of Israel did exactly as the Lord commanded. They put the blood on their doors. They stayed inside their houses and ate the roasted lamb with bitter herbs and unleavened bread.',
        caption: 'Inside, safe together',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          'Because of the blood on the door, the Lord passed over their houses and kept them safe.',
        caption: 'Passed over—kept safe',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'God told Moses and Aaron what His people must do so the angel of death would pass over their houses.',
      'Each family was to take a perfect little lamb and keep it until the evening. Then they would kill the lamb and take some of its blood.',
      'With a bunch of hyssop they would strike the blood on the two side posts and on the upper door post of their house.',
      'God said, "When I see the blood, I will pass over you, and the plague shall not be upon you to destroy you."',
      'That night, the children of Israel did exactly as the Lord commanded. They put the blood on their doors. They stayed inside and ate the roasted lamb with bitter herbs and unleavened bread.',
      'Because of the blood on the door, the Lord passed over their houses and kept them safe.',
      'For you: God keeps everyone who trusts His way of rescue. Jesus is the Lamb who saves us—believe Him, and you are safe in Him.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['John 3:16', 'Genesis 1:1', 'Exodus 12:7-13', 'Psalm 23'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 12:7-13.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Pharaoh only', 'God', 'Only sheep'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'When God sees the blood He commanded, He passes over His people and keeps them safe.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: When God sees the blood….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Everyone decided to never sleep again.',
          'They struck the blood on the doorposts with hyssop.',
          'A talking toaster became king of the city.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Thank God for His rescue—and trust Jesus, the Lamb who saves us.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Thank God… trust Jesus….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Passover Lamb with God's Word today.",
    takeaway:
      'God saw the blood on the door and passed over His people. He still saves everyone who trusts His Lamb—Jesus.',
    prayer:
      'God, thank You for the Bible. Thank You for the Passover—and for Jesus, who saves us. Help me trust You. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open coloring areas, hopeful protected mood, no scary shadows or plagues, no text in image: humble house door at night with two side posts and lintel, father gently touching hyssop with blood to doorposts, clear drops and branch strokes, family calm inside open doorway, soft starry sky, minimal ground, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A lamb is chosen—spotless and perfect (passover)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Blood painted on the doorposts (hyssop)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The angel passes over—God saves His people (exodus 12)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Family safe inside—roasted lamb meal (lamb)'
    ],
    readAlongImages: []
  };
}

/** Manna — read-along + quiz (Exodus 16:4-5, 13-15, 31; card may show 16:1-36). */
function buildMannaReadQuiz() {
  return {
    kjvRef: 'Exodus 16:4-5, 13-15, 31 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'The children of Israel had been walking in the wilderness for many days. They were hungry and began to grumble. God heard them and spoke to Moses: "Behold, I will rain bread from heaven for you. The people shall go out and gather a certain amount every day."',
        caption: 'God hears and promises bread',
        image: 'panel-jonah-1.svg'
      },
      {
        text:
          'The next morning, when the dew was gone, there on the ground lay small, white flakes like frost. The people looked at it and said, "What is it?" for they did not know what it was.',
        caption: 'White flakes on the ground',
        image: 'panel-jonah-2.svg'
      },
      {
        text: 'Moses said, "This is the bread which the Lord hath given you to eat."',
        caption: 'Moses names the manna',
        image: 'panel-jonah-2.svg'
      },
      {
        text:
          'Every morning the manna came. It tasted sweet, like wafers made with honey. The people gathered just enough for each day, and on the sixth day they gathered twice as much so they could rest on the Sabbath.',
        caption: 'Daily bread and the sixth day',
        image: 'panel-jonah-3.svg'
      },
      {
        text:
          'God gave them this bread from heaven every single day for forty years, until they came to the land He promised.',
        caption: 'Forty years of daily care',
        image: 'panel-jonah-3.svg'
      }
    ],
    paragraphs: [
      'The children of Israel had been walking in the wilderness for many days. They were hungry and began to grumble.',
      'God heard them and spoke to Moses: "Behold, I will rain bread from heaven for you. The people shall go out and gather a certain amount every day."',
      'The next morning, when the dew was gone, there on the ground lay small, white flakes like frost. The people looked at it and said, "What is it?" for they did not know what it was.',
      'Moses said, "This is the bread which the Lord hath given you to eat."',
      'Every morning the manna came. It tasted sweet, like wafers made with honey. The people gathered just enough for each day, and on the sixth day they gathered twice as much so they could rest on the Sabbath.',
      'God gave them this bread from heaven every single day for forty years, until they came to the land He promised.',
      'For you: God gives enough for today. When you worry about tomorrow, remember His daily kindness—and thank Him for Jesus, the true bread of life.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Exodus 16:4-5, 13-15, 31', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 16:4-5, 13-15, 31.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'God', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God gave bread from heaven every morning—enough for each day—because He cares for His people.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God gave bread from heaven….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the parking lot.',
          'Small white flakes like frost appeared on the ground after the dew lifted.',
          'A talking toaster became king of the city.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Thank God for today’s bread—trust Him for what you need one day at a time.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Thank God for today….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Manna from Heaven with God's Word today.",
    takeaway:
      'God rained bread from heaven every morning—sweet, daily, enough. He still cares for His children today.',
    prayer:
      'God, thank You for the Bible. Thank You for feeding Your people in the wilderness. Help me trust You for each day. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled thankful mood, no grumbling faces, no heavy shadows, no text in image: early morning wilderness, ground covered with small delicate manna flakes like frost, a few children in simple robes gently gathering manna into baskets and bowls with calm happy faces, soft desert hills, bright morning sky with gentle sun rays, minimal lines, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Manna falling from heaven – God sends bread (exodus 16)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People gathering manna each morning – God provides daily (manna)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: White flakes on the ground like frost (bread)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses explains this is the bread the Lord gave (wilderness)'
    ],
    readAlongImages: []
  };
}

/** Ten Commandments — read-along + quiz (Exodus 20:1-17). */
function buildTenCommandmentsReadQuiz() {
  var commandmentsBlock =
    'God spoke these words:\n\n' +
    '"I am the Lord thy God, which have brought thee out of the land of Egypt, out of the house of bondage.\n\n' +
    'Thou shalt have no other gods before me.\n\n' +
    'Thou shalt not make unto thee any graven image.\n\n' +
    'Thou shalt not take the name of the Lord thy God in vain.\n\n' +
    'Remember the sabbath day, to keep it holy.\n\n' +
    'Honour thy father and thy mother.\n\n' +
    'Thou shalt not kill.\n\n' +
    'Thou shalt not commit adultery.\n\n' +
    'Thou shalt not steal.\n\n' +
    'Thou shalt not bear false witness against thy neighbour.\n\n' +
    'Thou shalt not covet thy neighbour\'s house, thou shalt not covet thy neighbour\'s wife, nor his manservant, nor his maidservant, nor his ox, nor his ass, nor any thing that is thy neighbour\'s."';

  return {
    kjvRef: 'Exodus 20:1-17 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "God's people had come to the foot of Mount Sinai. A thick cloud covered the mountain, and there was thunder and lightning. The mountain shook, and the people were afraid.",
        caption: 'At the holy mountain',
        image: 'panel-david-1.svg'
      },
      {
        text: 'Moses went up the mountain to meet with God.',
        caption: 'Moses goes up to God',
        image: 'panel-david-1.svg'
      },
      {
        text: commandmentsBlock,
        caption: 'God speaks His law',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'God wrote these ten commandments on two tables of stone and gave them to Moses so His people would know how to love Him and love each other.',
        caption: 'Written on stone',
        image: 'panel-david-2.svg'
      },
      {
        text: 'The people stood far off, but Moses drew near to the thick darkness where God was.',
        caption: 'Moses draws near',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      "God's people had come to the foot of Mount Sinai. A thick cloud covered the mountain, and there was thunder and lightning. The mountain shook, and the people were afraid.",
      'Moses went up the mountain to meet with God.',
      commandmentsBlock,
      'God wrote these ten commandments on two tables of stone and gave them to Moses so His people would know how to love Him and love each other.',
      'The people stood far off, but Moses drew near to the thick darkness where God was.',
      "For you: God's commandments teach us to love Him first and to honor others with truth and kindness. When we need help to obey, we can pray and ask Him for a willing heart."
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Exodus 20:1-17', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Exodus 20:1-17.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'God', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God gave His commandments so His people would know how to love Him and love each other.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God gave His commandments….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed on the mountain.',
          'God wrote the ten commandments on two tables of stone for Moses.',
          'A talking toaster gave new laws to Egypt.',
          'The people built a roller coaster on the moon.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Ask God to help you honor Him and love others the way His words say.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Ask God to help you….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading the Ten Commandments with God's Word today.",
    takeaway:
      'God spoke His law on Sinai and gave Moses stone tablets—holy words that teach us to love God and love our neighbor.',
    prayer:
      'God, thank You for the Bible. Thank You for Your good commandments. Help me honor You and care for others. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, reverent wonder not fear, soft lightning only, no scary faces, no dark shadows, no text in image: Moses on Mount Sinai holding two blank stone tablets, gentle clouds and soft lightning lines around mountain top, calm reverent Moses, God shown only as soft light rays from heaven, minimal sky and mountain lines, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses on the mountain – God speaks (exodus 20)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Two stone tablets – Ten Commandments',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Cloud and thunder at Sinai – holy ground',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses brings God\'s law to the people (tablets)'
    ],
    readAlongImages: []
  };
}

/** Golden Calf — read-along + quiz (Exodus 32:1-8, 15-20, 30-32). */
function buildGoldenCalfReadQuiz() {
  return {
    kjvRef: 'Exodus 32:1-8, 15-20, 30-32 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'While Moses was still on the mountain with God, the people grew impatient. They asked Aaron to make them a god they could see.',
        caption: 'Waiting turned to impatience',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Aaron took their golden earrings, melted them, and made a golden calf. The people bowed down and danced around it.',
        caption: 'A calf of gold',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'When Moses came down from the mountain carrying the two stone tablets, he saw the calf and the dancing. His anger burned, and he threw the tablets and broke them at the foot of the mountain.',
        caption: 'The tablets break',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Moses burned the golden calf, ground it to powder, scattered it on the water, and made the people drink it.',
        caption: 'Wrong worship undone',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'Then Moses stood before the Lord and prayed, "Oh, this people have sinned a great sin. Yet now, if thou wilt forgive their sin—; and if not, blot me, I pray thee, out of thy book which thou hast written."',
        caption: 'Moses pleads for mercy',
        image: 'panel-david-3.svg'
      },
      {
        text: "God heard Moses' prayer and showed mercy to His people.",
        caption: 'God hears and is merciful',
        image: 'panel-david-1.svg'
      }
    ],
    paragraphs: [
      'While Moses was still on the mountain with God, the people grew impatient. They asked Aaron to make them a god they could see.',
      'Aaron took their golden earrings, melted them, and made a golden calf. The people bowed down and danced around it.',
      'When Moses came down from the mountain carrying the two stone tablets, he saw the calf and the dancing. His anger burned, and he threw the tablets and broke them at the foot of the mountain.',
      'Moses burned the golden calf, ground it to powder, scattered it on the water, and made the people drink it.',
      'Then Moses stood before the Lord and prayed, "Oh, this people have sinned a great sin. Yet now, if thou wilt forgive their sin—; and if not, blot me, I pray thee, out of thy book which thou hast written."',
      "God heard Moses' prayer and showed mercy to His people.",
      'For you: When we choose wrong, God is still merciful. We can tell Him we are sorry, trust Jesus who saves us, and worship Him alone.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Exodus 32:1-8, 15-20, 30-32', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Exodus 32:1-8, 15-20, 30-32.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'Moses and God', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback:
          'Look for who the story follows first—names in the title often help. (Answer: Moses and God.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God is merciful—even when His people sin, He hears prayer and can forgive.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God is merciful….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed at the camp.',
          'Aaron made a golden calf and the people bowed down before it.',
          'A talking toaster became king of Egypt.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Say sorry to God, worship Him alone, and thank Him for His mercy in Jesus.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Say sorry to God….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Golden Calf with God's Word today.",
    takeaway:
      "God's people chose a visible idol, but Moses prayed—and God showed mercy. Jesus is the only Savior we need.",
    prayer:
      'God, thank You for the Bible. Thank You that You forgive when we turn to You. Help me worship You alone. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, honest yet hopeful mood, focus on prayer not anger, no wild dancing, no text in image: Moses on mountain path holding two broken stone tablet pieces, small golden calf statue quiet in distance with few people standing sadly nearby, Moses sorrowful but calm with hands lifted praying toward heaven, soft mountain lines gentle sky, minimal background, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People waiting at the mountain – Moses with God (exodus 32)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Golden calf – wrong worship (idol)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Broken stone tablets at the mountain (moses)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses praying for the people – God\'s mercy'
    ],
    readAlongImages: []
  };
}

/** Bronze serpent — read-along + quiz (Numbers 21:4-9; card may show 21:1-9). */
function buildBronzeSerpentReadQuiz() {
  return {
    kjvRef: 'Numbers 21:4-9 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'The children of Israel grew tired and discouraged on their long journey through the wilderness. They spoke against God and against Moses.',
        caption: 'A hard day on the journey',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'So the Lord sent fiery serpents among the people, and the serpents bit them. Many people died.',
        caption: 'Serious consequences',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'The people came to Moses and said, "We have sinned, for we have spoken against the Lord, and against thee. Pray unto the Lord, that he take away the serpents from us."',
        caption: 'We have sinned—please pray',
        image: 'panel-david-2.svg'
      },
      {
        text: 'Moses prayed for the people.',
        caption: 'Moses prays',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And the Lord said unto Moses, "Make thee a fiery serpent, and set it upon a pole: and it shall come to pass, that every one that is bitten, when he looketh upon it, shall live."',
        caption: 'God gives a way to live',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'Moses made a serpent of brass and put it upon a pole. And it came to pass, that if a serpent had bitten any man, when he beheld the serpent of brass, he lived.',
        caption: 'Look and live',
        image: 'panel-david-1.svg'
      }
    ],
    paragraphs: [
      'The children of Israel grew tired and discouraged on their long journey through the wilderness. They spoke against God and against Moses.',
      'So the Lord sent fiery serpents among the people, and the serpents bit them. Many people died.',
      'The people came to Moses and said, "We have sinned, for we have spoken against the Lord, and against thee. Pray unto the Lord, that he take away the serpents from us."',
      'Moses prayed for the people.',
      'And the Lord said unto Moses, "Make thee a fiery serpent, and set it upon a pole: and it shall come to pass, that every one that is bitten, when he looketh upon it, shall live."',
      'Moses made a serpent of brass and put it upon a pole. And it came to pass, that if a serpent had bitten any man, when he beheld the serpent of brass, he lived.',
      'For you: When we are sorry and look to God in faith, He is merciful. Jesus said the Son of man must be lifted up—everyone who believes in Him has eternal life.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Numbers 21:4-9', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Numbers 21:4-9.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'God and Moses', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback:
          'Look for who the story follows first—names in the title often help. (Answer: God and Moses.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never hears when kids pray.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God gave a way to live—when they looked to what He said, they were healed.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God gave a way to live….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the desert.',
          'Moses put a serpent of brass on a pole, and those who looked lived.',
          'A talking toaster became king of the camp.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Say sorry when we grumble, and look to Jesus—trust Him to save and help.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Say sorry… look to Jesus….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Bronze Serpent with God's Word today.",
    takeaway:
      'God heard Moses\' prayer and gave a lifted serpent—simple trust brought life. Jesus is the greater rescue for everyone who believes.',
    prayer:
      'God, thank You for the Bible. Thank You that You forgive and heal when we turn to You. Help me trust Jesus every day. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful trusting mood, no snakes on ground, no pain or fear on faces, no text in image: Moses calmly in wilderness holding tall pole with serpent of brass wrapped gently around top, several bitten people nearby sitting or standing quietly looking up at brass serpent with calm hopeful faces, soft desert hills gentle sky, minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses prays for the people in the wilderness (numbers 21)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Brass serpent lifted on a pole – look and live',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People say sorry and ask Moses to pray',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God\'s mercy in the desert (bronze serpent)'
    ],
    readAlongImages: []
  };
}

/** Tabernacle — read-along + quiz (Exodus 40:34-38; card may show 40:1-38). */
function buildTabernacleReadQuiz() {
  return {
    kjvRef: 'Exodus 40:34-38 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'God told Moses exactly how to build a special tent called the tabernacle. It would be God\'s house in the middle of the camp so He could dwell with His people.',
        caption: 'God\'s tent in the camp',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'The people brought gifts with glad hearts — gold, silver, fine cloth, wood, and more. Skilled workers made the curtains, the altar, the lampstand, the table, and the beautiful ark of the covenant.',
        caption: 'Glad gifts and careful work',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'When everything was finished just as God commanded, Moses set up the tabernacle. He put the furniture in its place and hung the veil.',
        caption: 'Moses finishes the setup',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Then a cloud covered the tent of the congregation, and the glory of the Lord filled the tabernacle.',
        caption: 'Glory fills the tent',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'The cloud stayed over the tabernacle by day, and fire was on it by night. When the cloud moved, the people followed. When the cloud stayed, they rested.',
        caption: 'Cloud by day, fire by night',
        image: 'panel-david-3.svg'
      },
      {
        text: 'In this way the Lord was with His people everywhere they went.',
        caption: 'God with His people',
        image: 'panel-david-1.svg'
      }
    ],
    paragraphs: [
      'God told Moses exactly how to build a special tent called the tabernacle. It would be God\'s house in the middle of the camp so He could dwell with His people.',
      'The people brought gifts with glad hearts — gold, silver, fine cloth, wood, and more. Skilled workers made the curtains, the altar, the lampstand, the table, and the beautiful ark of the covenant.',
      'When everything was finished just as God commanded, Moses set up the tabernacle. He put the furniture in its place and hung the veil.',
      'Then a cloud covered the tent of the congregation, and the glory of the Lord filled the tabernacle.',
      'The cloud stayed over the tabernacle by day, and fire was on it by night. When the cloud moved, the people followed. When the cloud stayed, they rested.',
      'In this way the Lord was with His people everywhere they went.',
      'For you: God wanted to be close to His people—and He still draws near to everyone who trusts Him. Jesus is Immanuel: God with us.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Exodus 40:34-38', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Exodus 40:34-38.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'The Lord and Moses', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback:
          'Look for who the story follows first—names in the title often help. (Answer: The Lord and Moses.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never wants to be near His people.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God filled the tabernacle with His glory—He stayed close to His people day and night.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God filled the tabernacle….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed on the tent.',
          'A cloud covered the tent and the glory of the Lord filled the tabernacle.',
          'A talking toaster became high priest.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Thank God that He draws near—and welcome Jesus, who is God with us.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Thank God… welcome Jesus….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Tabernacle with God's Word today.",
    takeaway:
      'God\'s glory filled the finished tabernacle—cloud by day, fire by night—so His people knew He was with them.',
    prayer:
      'God, thank You for the Bible. Thank You that You want to be with Your people. Help me draw near to You through Jesus. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, joyful holy protected mood, no overwhelming detail, no text in image: completed tabernacle tent in middle of wilderness camp with beautiful curtains and open entrance, gentle cloud resting above tabernacle with soft rays of glory downward, few children of Israel nearby with calm happy faces looking at cloud, soft desert hills minimal background, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People bring gifts for the tabernacle (exodus 35-39)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses sets up the tent of meeting',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Glory cloud fills the tabernacle (exodus 40)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Cloud by day fire by night above God\'s tent'
    ],
    readAlongImages: []
  };
}

/** Spies in Canaan — Joshua & Caleb faithful (Numbers 13–14). */
function buildSpiesInCanaanReadQuiz() {
  return {
    kjvRef: 'Numbers 13:1-3, 17-33; 14:1-9 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'God told Moses to send twelve men to spy out the land of Canaan that He had promised to give His people.',
        caption: 'Twelve men go to see the land',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'The men went and explored the land for forty days. They saw beautiful fruit, strong cities, and tall people. When they returned, ten of the spies said, "The land is good, but the people are too strong for us. We cannot go up against them."',
        caption: 'A good land — hard news from ten',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'But Caleb and Joshua said, "Let us go up at once, and possess it; for we are well able to overcome it. The Lord is with us. Do not fear the people of the land."',
        caption: 'Caleb and Joshua trust the Lord',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          'The people listened to the ten fearful spies and began to cry and complain. But Joshua and Caleb trusted God and tried to encourage the people to believe the Lord.',
        caption: 'Faithful words in a hard moment',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'God told Moses to send twelve men to spy out the land of Canaan that He had promised to give His people.',
      'The men went and explored the land for forty days. They saw beautiful fruit, strong cities, and tall people. When they returned, ten of the spies said, "The land is good, but the people are too strong for us. We cannot go up against them."',
      'But Caleb and Joshua said, "Let us go up at once, and possess it; for we are well able to overcome it. The Lord is with us. Do not fear the people of the land."',
      'The people listened to the ten fearful spies and began to cry and complain. But Joshua and Caleb trusted God and tried to encourage the people to believe the Lord.',
      'For you: When others are afraid, you can still trust God—He is bigger than any problem. Listen for His promise and take courage.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Numbers 13:1-3, 17-33; 14:1-9', 'John 3:16'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Numbers 13:1-3, 17-33; 14:1-9.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only sheep', 'Joshua and Caleb', 'Pharaoh only'],
        correctIndex: 2,
        correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
        wrongFeedback:
          'Look for who trusted God and spoke with courage. (Answer: Joshua and Caleb.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never helps when we are scared.',
          'The Bible is only pretend stories.',
          'We should hide from God when we mess up.',
          'God keeps His promises—when we trust Him, we can be brave like Joshua and Caleb.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God keeps His promises….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A spaceship landed in the grape patch.',
          'Caleb and Joshua said the Lord was with them and the people should not fear.',
          'A talking toaster became king of Canaan.',
          'Everyone decided to never sleep again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Pray for courage to trust God\'s promises—even when others feel afraid.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Pray for courage….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Spies in Canaan with God's Word today.",
    takeaway:
      'Joshua and Caleb looked to the Lord—the good land was His gift, and His strength was enough.',
    prayer:
      'God, thank You for the Bible. Thank You that You keep Your promises. Help me trust You when I feel afraid. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful trusting mood, no giants, no angry crowd, no scary faces, no text in image: Joshua and Caleb standing bravely but calmly each helping hold a large cluster of grapes on a pole between them, grapes big and beautiful with open coloring areas, soft background gentle hills few trees good land promised, kind confident faces looking toward people, optional tiny simple fig or pomegranate shapes far in background, minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Twelve spies see the good land (numbers 13)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Big grape cluster from Canaan',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joshua and Caleb encourage the people',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Trust God—He is with us (caleb joshua)'
    ],
    readAlongImages: []
  };
}

/** Rahab and the scarlet cord — Joshua 2:1-21 (shared across rahab / rahabJericho / rahabRope / rahabWindow). */
function buildRahabReadQuiz() {
  return {
    kjvRef: 'Joshua 2:1-21 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Joshua sent two men to spy out the land. They came to Jericho and went into the house of a woman named Rahab.',
        caption: 'Two quiet spies',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          "The king of Jericho heard about the spies and sent men to find them. But Rahab hid the two men on her roof under stalks of flax.",
        caption: 'Hidden on the roof',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          "When the king's men asked for the spies, Rahab said they had already gone. Then she told the two men, 'I know that the Lord hath given you the land… for the Lord your God, he is God in heaven above, and in earth beneath.'",
        caption: 'She believed the Lord',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Rahab asked the men to promise that when the Lord gave them the land, they would show kindness to her family.',
        caption: 'Kindness for her household',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'The men said, "Our life for yours… Bind this line of scarlet thread in the window which thou didst let us down by."',
        caption: 'The scarlet thread',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          'Rahab tied the scarlet cord in her window. And when the Lord gave Jericho to His people, Rahab and all her family were saved because she believed the Lord.',
        caption: 'God kept His word',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'Joshua sent two men to spy out the land. They came to Jericho and went into the house of a woman named Rahab.',
      "The king of Jericho heard about the spies and sent men to find them. But Rahab hid the two men on her roof under stalks of flax.",
      "When the king's men asked for the spies, Rahab said they had already gone. Then she told the two men, 'I know that the Lord hath given you the land… for the Lord your God, he is God in heaven above, and in earth beneath.'",
      'Rahab asked the men to promise that when the Lord gave them the land, they would show kindness to her family.',
      'The men said, "Our life for yours… Bind this line of scarlet thread in the window which thou didst let us down by."',
      'Rahab tied the scarlet cord in her window. And when the Lord gave Jericho to His people, Rahab and all her family were saved because she believed the Lord.',
      'For you: God keeps His promises to everyone who trusts Him. Jesus is the greater rescue—look to Him in faith.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Genesis 1:1', 'Joshua 2:1-21', 'Matthew 5'],
        correctIndex: 2,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the first paragraph\'s Bible note. (Answer: Joshua 2:1-21.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only the king of Jericho', 'Rahab', 'Only the city wall'],
        correctIndex: 2,
        correctFeedback: 'Right—keep her brave faith in mind as you think about God.',
        wrongFeedback: 'Look for who the story follows first—names in the title often help. (Answer: Rahab.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God forgets people who are afraid.',
          'The Bible is only pretend stories.',
          'We should never tell the truth.',
          'When we trust the Lord, He keeps His promises—even small signs of faith can mean rescue.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the "For you" heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: When we trust the Lord….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A dragon painted the city pink.',
          'Rahab hid the spies under flax on the roof.',
          'The spies flew away in balloons.',
          'The wall turned into ice cream.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: Rahab hid the spies….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never say sorry when we do wrong.',
          'Only be kind to people who are exactly like us.',
          'Tell God you trust Him—like Rahab—and thank Him for keeping His Word in Jesus.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Tell God you trust Him….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Rahab and the Scarlet Cord with God's Word today.",
    takeaway:
      'Rahab believed the Lord and tied the scarlet cord—God remembered her household when Jericho fell.',
    prayer:
      'God, thank You for the Bible. Thank You that You keep Your promises. Help me trust Jesus every day. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful protected mood, no soldiers, no fear, no text in image: Rahab standing calmly at her window in the wall of Jericho gently tying a long scarlet cord hanging down outside, cord with thick bold lines and large open spaces for coloring bright red, kind peaceful face looking out with hope, below window a few simple houses and city wall with minimal lines, soft sky, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rahab welcomes two quiet spies (joshua 2)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Flax stalks on a roof — gentle hiding place',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Scarlet cord in the window — promise',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God keeps His word — family safe (rahab)'
    ],
    readAlongImages: []
  };
}

/** Crossing the Jordan — Joshua 3:14-17; 4:1-7, 18-24 (shared: jordanCrossing + joshuaJordan). */
function buildJordanCrossingReadQuiz() {
  return {
    kjvRef: 'Joshua 3:14-17; 4:1-7, 18-24 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "God's people came to the Jordan River. It was time to cross into the land the Lord had promised them.",
        caption: 'At the river',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'The Lord told Joshua, "When the soles of the feet of the priests that bear the ark of the covenant shall rest in the waters of Jordan, the waters of Jordan shall be cut off from the waters that come down from above; and they shall stand upon an heap."',
        caption: 'What God said would happen',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'The priests who carried the ark stepped into the edge of the flooded river. As soon as their feet touched the water, the river stopped flowing. The waters stood up in a great heap on one side, and the people crossed over on dry ground while the priests stood firm in the middle of the Jordan until all the people had passed over.',
        caption: 'Dry ground in the river',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'After everyone was safely on the other side, the priests came up out of the Jordan, and the waters returned to their place.',
        caption: 'Safe on the other side',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Joshua set up twelve stones from the middle of the river as a reminder. He told the people, "When your children ask in time to come, saying, What mean these stones? Then ye shall let them know that the waters of Jordan were cut off before the ark of the covenant of the Lord… that all the people of the earth might know the hand of the Lord, that it is mighty."',
        caption: 'Twelve stones — remember',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      "God's people came to the Jordan River. It was time to cross into the land the Lord had promised them.",
      'The Lord told Joshua, "When the soles of the feet of the priests that bear the ark of the covenant shall rest in the waters of Jordan, the waters of Jordan shall be cut off from the waters that come down from above; and they shall stand upon an heap."',
      'The priests who carried the ark stepped into the edge of the flooded river. As soon as their feet touched the water, the river stopped flowing. The waters stood up in a great heap on one side, and the people crossed over on dry ground while the priests stood firm in the middle of the Jordan until all the people had passed over.',
      'After everyone was safely on the other side, the priests came up out of the Jordan, and the waters returned to their place.',
      'Joshua set up twelve stones from the middle of the river as a reminder. He told the people, "When your children ask in time to come, saying, What mean these stones? Then ye shall let them know that the waters of Jordan were cut off before the ark of the covenant of the Lord… that all the people of the earth might know the hand of the Lord, that it is mighty."',
      'For you: God makes a way when we obey Him—like at the Red Sea, His hand is mighty. Trust Him with the next step He gives you.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Exodus 14', 'Joshua 3:14-17; 4:1-7, 18-24', 'Psalm 23', 'John 3:16'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the Bible note. (Answer: Joshua 3:14-17; 4:1-7, 18-24.)'
      },
      {
        question: 'Who do we mainly learn from or watch in this story?',
        choices: ['Nobody', 'Only the river', 'The Lord and His people obeying Joshua', 'Only the stones'],
        correctIndex: 2,
        correctFeedback: 'Right—God is leading; the people follow His Word through Joshua.',
        wrongFeedback:
          'Look for who gives the promise and who steps into the water in faith. (Answer: The Lord and His people obeying Joshua.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God cannot help when we feel stuck.',
          'The Bible is only pretend stories.',
          'Rivers always obey people, not God.',
          'When God says go, He can hold the water back and make a safe path for those who obey.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the "For you" heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's power and care? (Answer: When God says go….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'The ark grew wings and flew over the river.',
          'The priests\' feet touched the water and the river stopped flowing.',
          'A whale carried everyone across.',
          'The river turned into jelly.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches the pictures or paragraphs? (Answer: The priests\' feet touched the water….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never tell anyone what He has done.',
          'Only obey when we feel like it.',
          'Thank God for His mighty hand—and take the next right step He shows you, even when it feels big.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and thankfulness? Pick the one that honors Him. (Answer: Thank God for His mighty hand….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Crossing the Jordan with God's Word today.",
    takeaway:
      'The waters stood in a heap—the people crossed on dry ground—so all the earth might know the hand of the Lord is mighty.',
    prayer:
      'God, thank You for the Bible. Thank You that You make a way when we obey You. Help me trust You today. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled protected mood, no rushing water, no fear, no text in image: priests carrying ark of the covenant standing calmly on dry ground in middle of Jordan River, tall gentle walls of water standing in a heap on one side, people of Israel walking safely across dry riverbed in background, soft sky gentle riverbanks minimal lines, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Priests step into Jordan with the ark (joshua 3)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Waters stand in a heap — people cross dry ground',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Twelve stones memorial (joshua 4)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The hand of the Lord is mighty (jordan)'
    ],
    readAlongImages: []
  };
}

/** Joshua's charge — Joshua 24:14-15 (KJV). */
function buildJoshuaChargeReadQuiz() {
  return {
    kjvRef: 'Joshua 24:14-15 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Joshua had lived a long life. He had seen God keep every promise. He gathered the people to hear God\'s Word one more time.',
        caption: 'Joshua speaks to Israel',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'He said, "Now therefore fear the Lord, and serve him in sincerity and in truth: and put away the gods which your fathers served on the other side of the flood, and in Egypt; and serve ye the Lord."',
        caption: 'Serve the Lord in truth',
        image: 'panel-david-1.svg'
      },
      {
        text:
          '"And if it seem evil unto you to serve the Lord, choose you this day whom ye will serve; whether the gods which your fathers served that were on the other side of the flood, or the gods of the Amorites, in whose land ye dwell."',
        caption: 'Choose this day',
        image: 'panel-david-2.svg'
      },
      {
        text:
          '"But as for me and my house, we will serve the Lord."',
        caption: 'Joshua\'s house chooses the Lord',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'Joshua had lived a long life. He had seen God keep every promise. He gathered the people to hear God\'s Word one more time.',
      'He said, "Now therefore fear the Lord, and serve him in sincerity and in truth: and put away the gods which your fathers served on the other side of the flood, and in Egypt; and serve ye the Lord."',
      '"And if it seem evil unto you to serve the Lord, choose you this day whom ye will serve; whether the gods which your fathers served that were on the other side of the flood, or the gods of the Amorites, in whose land ye dwell."',
      '"But as for me and my house, we will serve the Lord."',
      'For you: God does not force us — He invites us. You can pray, "Lord, I choose You," and ask Jesus to help you serve Him today.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Joshua 24:14-15', 'Genesis 1:1', 'Matthew 5'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the Bible note. (Answer: Joshua 24:14-15.)'
      },
      {
        question: 'What did Joshua say his own house would do?',
        choices: [
          'Serve other gods in secret.',
          'Forget God when things got hard.',
          'We will serve the Lord.',
          'Leave the land and go back to Egypt.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that is Joshua\'s brave, clear choice.',
        wrongFeedback:
          'Listen for Joshua\'s own words about his family. (Answer: We will serve the Lord.)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never lets anyone choose.',
          'The Bible is only pretend stories.',
          'We should never pray at home.',
          'God kindly invites us to choose whom we will serve — and we can say with Joshua\'s house: we will serve the Lord.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the "For you" heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's invitation? (Answer: God kindly invites us….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Joshua rode a rocket to the moon.',
          'Choose you this day whom ye will serve.',
          'A giant sandwich fell from the sky.',
          'Everyone turned into frogs.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that phrase comes from God\'s Word in this chapter.',
        wrongFeedback:
          'Cross out the joke answers. Which line matches Joshua 24? (Answer: Choose you this day….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never tell anyone we love Jesus.',
          'Only obey when we feel like it.',
          'Tell God quietly, "I choose You," and thank Him for Jesus who helps us serve the Lord.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and love for God? Pick the one that honors Him. (Answer: Tell God quietly….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Joshua's Charge with God's Word today.",
    takeaway:
      'Joshua put the Lord first for his whole house — a calm, brave invitation we can echo in prayer.',
    prayer:
      'God, thank You for the Bible. Thank You that You invite us to serve You. Help me choose You today. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, reverent hopeful mood, no weapons, no fear, no text in image: elder Joshua standing calmly with one hand gently raised speaking to families of Israel, simple small house shape behind him suggesting home, few adults and children listening with peaceful faces, soft hills minimal sky, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joshua gathers the people (joshua 24)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Choose this day whom ye will serve',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: As for me and my house we will serve the Lord',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Serve the Lord in sincerity and truth'
    ],
    readAlongImages: []
  };
}

module.exports = {
  jerichoWalls: buildJerichoReadQuiz(),
  fallOfJericho: buildJerichoReadQuiz(),
  david: davidReadQuizPack,
  davidGoliath: davidReadQuizPack,
  redSea: buildRedSeaReadQuiz(),
  mosesBush: buildMosesBushReadQuiz(),
  burningBush: buildMosesBushReadQuiz(),
  passoverLamb: buildPassoverLambReadQuiz(),
  manna: buildMannaReadQuiz(),
  tenCommandments: buildTenCommandmentsReadQuiz(),
  goldenCalf: buildGoldenCalfReadQuiz(),
  bronzeSerpent: buildBronzeSerpentReadQuiz(),
  tabernacle: buildTabernacleReadQuiz(),
  spiesInCanaan: buildSpiesInCanaanReadQuiz(),
  rahab: buildRahabReadQuiz(),
  rahabJericho: buildRahabReadQuiz(),
  rahabRope: buildRahabReadQuiz(),
  rahabWindow: buildRahabReadQuiz(),
  jordanCrossing: buildJordanCrossingReadQuiz(),
  joshuaJordan: buildJordanCrossingReadQuiz(),
  joshuaCharge: buildJoshuaChargeReadQuiz()
};
