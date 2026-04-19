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

/** The sun stands still — Joshua 10:12-14 (KJV). */
function buildSunStandsStillReadQuiz() {
  return {
    kjvRef: 'Joshua 10:12-14 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          "The kings of the land gathered together to fight against God's people. Joshua and the children of Israel went out to meet them.",
        caption: 'God\'s people go forward',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'In the middle of the battle, Joshua prayed to the Lord where all Israel could hear: "Sun, stand thou still upon Gibeon; and thou, Moon, in the valley of Ajalon."',
        caption: 'Joshua prays aloud',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And the sun stood still, and the moon stayed, until the people had avenged themselves upon their enemies.',
        caption: 'The sun and moon wait',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'So the sun stood still in the midst of heaven, and hasted not to go down about a whole day.',
        caption: 'A day like no other',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'There was no day like that before it or after it, that the Lord hearkened unto the voice of a man: for the Lord fought for Israel.',
        caption: 'The Lord fought for Israel',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      "The kings of the land gathered together to fight against God's people. Joshua and the children of Israel went out to meet them.",
      'In the middle of the battle, Joshua prayed to the Lord where all Israel could hear: "Sun, stand thou still upon Gibeon; and thou, Moon, in the valley of Ajalon."',
      'And the sun stood still, and the moon stayed, until the people had avenged themselves upon their enemies.',
      'So the sun stood still in the midst of heaven, and hasted not to go down about a whole day.',
      'There was no day like that before it or after it, that the Lord hearkened unto the voice of a man: for the Lord fought for Israel.',
      'For you: God hears when we pray — and He is mighty to help. You can tell Him what you need and trust His loving care.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Joshua 10:12-14', 'Genesis 1:1', 'Matthew 5'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the Bible note. (Answer: Joshua 10:12-14.)'
      },
      {
        question: 'What did Joshua ask the sun and moon to do?',
        choices: [
          'Run away and hide.',
          'Turn into stars.',
          'Stand still and stay — sun on Gibeon, moon in the valley of Ajalon.',
          'Fall from the sky.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—that is what Joshua spoke in faith before all Israel.',
        wrongFeedback:
          'Listen for Joshua\'s prayer in the story. (Answer: Stand still and stay….)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God does not hear when people pray.',
          'The Bible is only pretend stories.',
          'Only grown-ups may talk to God.',
          'The Lord hears prayer and is mighty to help His people — even the sun and moon obey Him.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the "For you" heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's power and care? (Answer: The Lord hears prayer….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'Joshua rode a bicycle to the moon.',
          'The sun stood still in the midst of heaven about a whole day.',
          'Everyone turned into butterflies.',
          'The river turned into soda pop.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches God\'s Word? (Answer: The sun stood still….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore God until we are older.',
          'Never tell anyone we need help.',
          'Only pray when we are perfect.',
          'Thank God that He hears you — pray honestly and trust Jesus, who always prays for His people.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show trust and thankfulness? Pick the one that honors Him. (Answer: Thank God that He hears you….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading The Sun Stands Still with God's Word today.",
    takeaway:
      'God hearkened to Joshua — the Lord fought for Israel, and there was no day like it.',
    prayer:
      'God, thank You for the Bible. Thank You that You hear me when I pray. Help me trust You today. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled protected mood, no fighting, no fear, no blood, no text in image: Joshua standing calmly on a gentle hill with one hand raised toward heaven in prayer, bright sun and soft moon both visible together in open sky, below a few soldiers of Israel with shields and swords lowered looking up in quiet wonder, soft hills minimal background, plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joshua prays — sun and moon (joshua 10)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Sun stand still upon Gibeon',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lord fought for Israel',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A day like no other — God hears prayer'
    ],
    readAlongImages: []
  };
}

/** Achan — Joshua 7:1-26 (KJV); gentle focus on confession and mercy. */
function buildAchanReadQuiz() {
  return {
    kjvRef: 'Joshua 7:1-26 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'After Jericho, Israel went to fight against the city of Ai. But they were defeated and some men died.',
        caption: 'A hard day at Ai',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Joshua asked the Lord why this had happened. The Lord said someone had taken things that belonged to Him and hidden them.',
        caption: 'The Lord speaks plainly',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Joshua called all the people together. One by one they came forward until the sin was found with a man named Achan.',
        caption: 'Seeking the truth together',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Achan said, "Indeed I have sinned against the Lord God of Israel."',
        caption: 'Achan tells the truth',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'The trouble was taken away from the camp. Then the Lord was no longer angry, and He helped His people again.',
        caption: 'Mercy and a clean camp',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'After Jericho, the children of Israel went to fight against the small city of Ai. But they were defeated and some men died.',
      'Joshua was sad and asked the Lord why this had happened. The Lord told him that someone in the camp had taken things from Jericho that belonged to the Lord and had hidden them.',
      'Joshua called all the people together. One by one the tribes came forward until the sin was found with a man named Achan.',
      'Achan confessed, "Indeed I have sinned against the Lord God of Israel."',
      'The trouble was taken away from the camp. Then the Lord was no longer angry, and He helped His people win the next battle against Ai.',
      'God showed both His holiness and His mercy that day. When we do wrong and tell the truth, He forgives and makes things right again.',
      'For you: God is holy and kind. When you are sorry, tell Him — Jesus washes our sin away and helps us walk in truth.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Psalm 23', 'Joshua 7:1-26', 'Genesis 1:1', 'Matthew 5'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the Bible note. (Answer: Joshua 7:1-26.)'
      },
      {
        question: 'What did Achan do when the truth came out?',
        choices: [
          'He ran away from camp.',
          'He pretended nothing was wrong.',
          'He said, "Indeed I have sinned against the Lord God of Israel."',
          'He blamed Joshua only.'
        ],
        correctIndex: 2,
        correctFeedback: 'Yes—telling the truth to God is the first step back.',
        wrongFeedback:
          'Listen for Achan\'s own words in the story. (Answer: Indeed I have sinned….)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God does not care about honesty.',
          'The Bible is only pretend stories.',
          'We should hide wrong forever.',
          'God is holy, but when we confess, He forgives and helps His people go forward.'
        ],
        correctIndex: 3,
        correctFeedback: 'Exactly—that lines up with the story and the "For you" heart of it.',
        wrongFeedback:
          "Reread the last paragraph slowly. Which option matches God's holiness and mercy? (Answer: God is holy, but when we confess….)"
      },
      {
        question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
        choices: [
          'A dragon stole the ark.',
          'Someone hid what belonged to the Lord from Jericho.',
          'Everyone turned into birds.',
          'The river turned into paint.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—that detail comes from the story God gave us.',
        wrongFeedback:
          'Cross out the joke answers. Which one matches Joshua 7? (Answer: Someone hid what belonged….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Never say sorry.',
          'Hide mistakes from grown-ups always.',
          'Only pray when we feel perfect.',
          'Tell God when you are sorry and ask Jesus to help you tell the truth — He forgives.'
        ],
        correctIndex: 3,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Think: does this choice show honesty and trust in God? Pick the one that honors Him. (Answer: Tell God when you are sorry….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Achan's Sin and Restoration with God's Word today.",
    takeaway:
      'When Achan confessed, the trouble was removed — God is holy, and He is merciful to the honest heart.',
    prayer:
      'God, thank You for the Bible. Thank You that You forgive when we tell the truth. Help me obey You and trust Jesus. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, honest hopeful mood, no anger on faces, no violence, no text in image: Joshua standing calmly with people of Israel gathered in gentle circle, in middle Achan kneeling quietly with sorry peaceful face confessing, small pile on ground beside him simple robe fold wedge shapes silver bar gold wedge shapes, soft hills gentle sky minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joshua and Israel seek the Lord after Ai (joshua 7)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Achan tells the truth',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God is holy and merciful',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Trouble removed — camp clean again'
    ],
    readAlongImages: []
  };
}

/** Victory at Ai — Joshua 8:1-8, 18-23, 26-29 (KJV); obedience and restoration. */
function buildBattleOfAiReadQuiz() {
  return {
    kjvRef: 'Joshua 8:1-8, 18-23, 26-29 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text: 'After the trouble was taken away, the Lord spoke to Joshua again.',
        caption: 'The Lord speaks again',
        image: 'panel-david-1.svg'
      },
      {
        text:
          '"Fear not, neither be thou dismayed. Go up to Ai. I have given into thy hand the king of Ai and his city."',
        caption: 'Do not fear — I have given Ai',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Joshua obeyed the Lord. He sent some men to hide behind the city. The army marched toward Ai.',
        caption: 'Hide, then march',
        image: 'panel-david-2.svg'
      },
      {
        text: 'When the men of Ai chased them, Joshua stretched out his spear.',
        caption: 'The sign with the spear',
        image: 'panel-david-2.svg'
      },
      {
        text: 'The hidden men rose up and set the city on fire.',
        caption: 'The city awakens to fire',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Then Israel turned back and the Lord gave them the victory. Joshua did exactly as the Lord commanded.',
        caption: 'Victory — the Lord fought for them',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'After the trouble in the camp was taken away, the Lord spoke to Joshua again. "Fear not, neither be thou dismayed. Take all the people of war with thee, and go up to Ai. See, I have given into thy hand the king of Ai, and his people, and his city, and his land."',
      'Joshua obeyed the Lord. He chose men to hide in ambush behind the city. The main army marched toward Ai as before. When the men of Ai came out to fight, Joshua and his army pretended to run away. The men of Ai chased them.',
      'Then Joshua stretched out his spear toward Ai. The hidden men rose up quickly, entered the city, and set it on fire. The army of Israel turned back and fought. The Lord gave them the victory that day.',
      'Joshua did exactly as the Lord commanded, and the people remembered that the Lord fights for those who obey Him.',
      'For you: When God gives a step, take it — He is with everyone who trusts and obeys Him.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Joshua 6', 'Joshua 8:1-8, 18-23, 26-29', 'Judges 4', '1 Samuel 17'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block, or check the Bible note. (Answer: Joshua 8:1-8, 18-23, 26-29.)'
      },
      {
        question: 'What did the Lord tell Joshua at the start?',
        choices: [
          'Stay home and do nothing.',
          'Fear not — go up to Ai; I have given the king of Ai into thy hand.',
          'Forget about Ai forever.',
          'Build a boat instead.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—God gave courage and a clear promise.',
        wrongFeedback:
          'Listen for God\'s words to Joshua in the read-along. (Answer: Fear not… I have given….)'
      },
      {
        question: 'What did Joshua do when the men of Ai chased Israel\'s army?',
        choices: [
          'He went to sleep.',
          'He stretched out his spear toward Ai.',
          'He left the camp.',
          'He hid in a whale.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right—that was the sign for the ambush.',
        wrongFeedback:
          'Remember the moment when the chase turned. (Answer: He stretched out his spear….)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never helps His people.',
          'Obeying the Lord step by step — He gives victory in His way.',
          'We never need to say sorry to God.',
          'Battles are only luck.'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly—that matches the story and the "For you" heart of it.',
        wrongFeedback:
          'Reread the close about Joshua obeying and the Lord fighting for those who obey. (Answer: Obeying the Lord step by step….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore what God says in the Bible.',
          'Only obey when it is easy.',
          'Ask God to help you listen and obey today — He is faithful.',
          'Never pray about hard things.'
        ],
        correctIndex: 2,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Pick the choice that shows trust and obedience. (Answer: Ask God to help you listen….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Victory at Ai with God's Word today.",
    takeaway:
      'Joshua obeyed every step the Lord gave — and the Lord gave the victory. God is faithful when we listen.',
    prayer:
      'God, thank You for the Bible. Thank You that You help us when we obey. Teach me to listen to You today. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful obedient mood, no fighting, no fear on faces, no scary battle, no text in image: Joshua standing on gentle hill with spear stretched out toward distant city walls of Ai, soft simple flame shapes rising gently from city large open areas for coloring, a few soldiers of Israel walking back toward Joshua with calm thankful faces, soft hills and sky minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lord speaks — Fear not, go up to Ai (joshua 8)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ambush and obedient march',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joshua stretches out his spear',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lord gives victory at Ai'
    ],
    readAlongImages: []
  };
}

/** Deborah and Barak — Judges 4:1-16 (KJV); God speaks, obedience, deliverance. */
function buildDeborahBarakReadQuiz() {
  return {
    kjvRef: 'Judges 4:1-16 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text: 'The children of Israel did evil, and a strong king troubled them for many years.',
        caption: 'A hard time for God\'s people',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'Deborah was a judge who sat under a palm tree. She helped the people know what the Lord wanted.',
        caption: 'Wisdom under the tree',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'Deborah told Barak, "The Lord God of Israel commands thee: go up to mount Tabor with ten thousand men. I will deliver Sisera, the captain of Jabin\'s army, into thine hand."',
        caption: 'God\'s command',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Barak said he would go only if Deborah went with him. Deborah answered, "I will surely go with thee… for the Lord shall sell Sisera into the hand of a woman."',
        caption: 'Together they obey',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Barak and the men went up to battle. The Lord discomfited Sisera and all his host before Barak; they fell by the edge of the sword, and not a man was left.',
        caption: 'The Lord gives victory',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'The Lord gave His people rest that day because they listened to His word through Deborah.',
        caption: 'Rest after listening',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'The children of Israel did evil in the sight of the Lord, and He allowed a strong king named Jabin to trouble them for twenty years.',
      'Deborah was a prophetess and judge in Israel. She sat under a palm tree and helped the people know what the Lord wanted.',
      'One day Deborah sent for Barak and told him, "The Lord God of Israel commands thee, Go and draw toward mount Tabor, and take with thee ten thousand men. I will deliver Sisera, the captain of Jabin\'s army, into thine hand."',
      'Barak said he would go only if Deborah went with him. Deborah answered, "I will surely go with thee… for the Lord shall sell Sisera into the hand of a woman."',
      'Barak and the men of Israel went up to battle. The Lord discomfited Sisera, and all his chariots, and all his host, with the edge of the sword before Barak; all the host of Sisera fell upon the edge of the sword; and there was not a man left.',
      'The Lord gave Israel rest and victory that day because they listened to His word through Deborah.',
      'For you: God still speaks in the Bible — listen, obey, and trust Him to help you.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 6', 'Judges 4:1-16', 'Ruth 1', '1 Samuel 17'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback:
          'Skim the line under the title in the story block. (Answer: Judges 4:1-16.)'
      },
      {
        question: 'Who was Deborah?',
        choices: [
          'A queen in Egypt.',
          'A prophetess and judge who helped Israel hear the Lord.',
          'A soldier with no faith.',
          'A farmer who never prayed.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right—God gave her wisdom to lead and speak His Word.',
        wrongFeedback:
          'Think: who sat under the palm tree? (Answer: A prophetess and judge….)'
      },
      {
        question: 'What did Barak ask Deborah?',
        choices: [
          'To stay home alone.',
          'To go with him when he obeyed the Lord.',
          'To hide from the enemy.',
          'To build a ship.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes—he wanted her with him as they obeyed God.',
        wrongFeedback:
          'Listen for Barak\'s condition in the story. (Answer: To go with him….)'
      },
      {
        question: 'Which choice sounds most like what this story teaches?',
        choices: [
          'God never helps His people.',
          'When we listen to God\'s Word and obey, He delivers and gives rest.',
          'We should never trust women leaders.',
          'The Bible is only pretend.'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly—that lines up with Deborah, Barak, and the Lord.',
        wrongFeedback:
          'Reread the last lines about listening and victory. (Answer: When we listen….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Ignore the Bible.',
          'Ask God to help you listen to His Word today like Deborah helped Israel.',
          'Only obey when we feel afraid.',
          'Never pray with family.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
        wrongFeedback:
          'Pick the choice that shows listening and trust. (Answer: Ask God to help you listen….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Deborah and Barak with God's Word today.",
    takeaway:
      'God raised up Deborah to speak His Word — when Israel listened and obeyed, the Lord gave victory and rest.',
    prayer:
      'God, thank You for the Bible. Thank You for Deborah and Barak. Help me listen to You and obey. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful courageous mood, no fighting, no fear on faces, no scary battle, no text in image: Deborah sitting calmly under tall palm tree with large frond shapes open for coloring, Barak standing listening with calm ready face, soft background gentle hills few soldiers of Israel with shields lowered standing quietly, soft sky minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Deborah under the palm tree (judges 4)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lord\'s command to Barak',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Deborah goes with Barak',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lord gives Israel victory'
    ],
    readAlongImages: []
  };
}

/** Gideon's fleece — Judges 6:11-40 (KJV); angel, signs, gentle patience. */
function buildGideonFleeceReadQuiz() {
  return {
    kjvRef: 'Judges 6:11-40 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text: 'The children of Israel cried out to the Lord because the Midianites were troubling them.',
        caption: 'A cry for help',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'God chose a man named Gideon to deliver His people. The angel of the Lord came to Gideon and said, "The Lord is with thee, thou mighty man of valour."',
        caption: 'A gentle, strong word',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'Gideon felt small and afraid. He put a fleece of wool on the ground and prayed for a sign.',
        caption: 'Honest prayer',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'In the morning the fleece was wet with dew, but the ground all around was dry.',
        caption: 'The first sign',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Gideon asked for one more sign: let the fleece be dry only, and let the ground be covered with dew. God did exactly as Gideon asked.',
        caption: 'The second sign',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'Gideon knew the Lord was with him, and he began to obey God\'s call.',
        caption: 'Trust grows',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'The children of Israel cried out to the Lord because the Midianites were troubling them. God chose a man named Gideon to deliver His people.',
      'One day Gideon was threshing wheat in a winepress, hiding from the Midianites, when the angel of the Lord appeared to him and said, "The Lord is with thee, thou mighty man of valour."',
      'Gideon felt small and afraid. He asked for a sign. That night he put a fleece of wool on the threshingfloor. He prayed, "If the dew be on the fleece only, and it be dry upon all the earth beside, then shall I know that thou wilt save Israel by mine hand."',
      'In the morning the fleece was wet with dew, but the ground was dry. Gideon asked for one more sign: "Let it now be dry only upon the fleece, and upon all the ground let there be dew."',
      'God did exactly as Gideon asked. The fleece was dry, but the ground was covered with dew.',
      'Gideon knew the Lord was with him, and he began to obey God\'s call.',
      'For you: God is patient when we pray — He loves honest hearts that look to Him.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 7', 'Judges 6:11-40', 'Ruth 2', 'Genesis 12'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 6:11-40.)'
      },
      {
        question: 'What did the angel call Gideon?',
        choices: [
          'A sleepy shepherd.',
          'Thou mighty man of valour — the Lord is with thee.',
          'A man too proud to pray.',
          'Someone God forgot.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — God saw courage in him before Gideon felt brave.',
        wrongFeedback: 'Listen for the angel\'s words in the story. (Answer: Mighty man of valour….)'
      },
      {
        question: 'What was special about the first morning with the fleece?',
        choices: [
          'Everything was underwater.',
          'The fleece was full of dew, but the ground around it was dry.',
          'The fleece disappeared.',
          'Nothing happened.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — God answered Gideon\'s prayer clearly.',
        wrongFeedback: 'Remember wet wool, dry earth. (Answer: Dew on the fleece only….)'
      },
      {
        question: 'What happened the second time Gideon asked?',
        choices: [
          'God was too busy.',
          'The fleece was dry, but the ground was wet with dew.',
          'Gideon ran away.',
          'The Midianites won at once.'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly — God did exactly as Gideon asked.',
        wrongFeedback: 'Flip the first sign in your mind. (Answer: Fleece dry, ground dewy….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Never tell God when we feel afraid.',
          'Talk to God honestly when we feel small — He is patient and near.',
          'Only brave people may pray.',
          'Hide every question from God.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — that is faith with honest words.',
        wrongFeedback: 'Pick the choice that shows trust and talking to God. (Answer: Talk to God honestly….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Gideon's Fleece with God's Word today.",
    takeaway:
      'God called Gideon brave when he still felt afraid — and answered his prayers so he could trust and obey.',
    prayer:
      'God, thank You for the Bible. Thank You that You hear me when I pray. Help me trust You like Gideon learned to. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled trusting mood, no army, no fear face, no text in image: Gideon kneeling calmly beside large piece of fleece wool on ground, soft dew drops on fleece sparkling simple circles, ground all around fleece clearly dry open space, Gideon face hopeful thankful looking up, gentle night sky few small stars soft hills background minimal lines plenty of white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Angel speaks — mighty man of valour (judges 6)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Fleece on the threshingfloor',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Dew on the fleece only',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God answers again — dry fleece, wet ground'
    ],
    readAlongImages: []
  };
}

/** Gideon's 300 — Judges 7:1-22 (KJV); small army, big God. */
function buildGideonMidianitesReadQuiz() {
  return {
    kjvRef: 'Judges 7:1-22 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'The Midianites came against Israel like many grasshoppers. Gideon gathered many men, but the Lord said the people were too many.',
        caption: 'Too many soldiers?',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'He sent home everyone who was afraid — twenty-two thousand left. Ten thousand remained, and still the Lord said there were too many.',
        caption: 'Listening to God\'s count',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'At the water, three hundred lapped with their hand to their mouth. The Lord said, "By the three hundred men that lapped will I save you."',
        caption: 'Three hundred chosen',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'That night each man took a trumpet, an empty pitcher, and a torch inside the pitcher. They surrounded the Midianite camp in the dark.',
        caption: 'A quiet circle of trust',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'They blew their trumpets, brake the pitchers, held up the torches, and cried, "The sword of the LORD, and of Gideon!"',
        caption: 'The Lord\'s sword',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'The Lord set every man\'s sword against his fellow; the host fled. God gave Israel the victory with only three hundred men.',
        caption: 'Victory — God\'s way',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'The Midianites had come against Israel like a great swarm of grasshoppers. Gideon gathered many men to fight, but the Lord said the people were too many.',
      'God told Gideon to send home everyone who was afraid. Twenty-two thousand men left, and only ten thousand remained. Still the Lord said there were too many.',
      'Then God told Gideon to take the men down to the water. Three hundred men lapped the water with their hand to their mouth. The rest bowed down to drink. The Lord said, "By the three hundred men that lapped will I save you."',
      'That night God gave Gideon a strange plan. The three hundred men each took a trumpet, an empty pitcher, and a torch inside the pitcher. They surrounded the Midianite camp in the dark.',
      'At the right time they blew their trumpets, brake the pitchers, and held up the torches. They cried, "The sword of the LORD, and of Gideon!"',
      'The Lord set every man\'s sword against his fellow, even throughout all the host: and the host fled. God gave Israel the victory that night with only three hundred men.',
      'For you: God does not need a big crowd — He blesses the few who listen and obey.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 6', 'Judges 7:1-22', 'Judges 8', '1 Samuel 17'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 7:1-22.)'
      },
      {
        question: 'How many men did the Lord keep with Gideon after the water test?',
        choices: ['Three thousand', 'Three hundred', 'Thirty', 'Three'],
        correctIndex: 1,
        correctFeedback: 'Right — a small band God could use for His glory.',
        wrongFeedback: 'Remember the title: three hundred. (Answer: Three hundred.)'
      },
      {
        question: 'What did each of the three hundred carry that night?',
        choices: [
          'Only shields.',
          'A trumpet, an empty pitcher, and a torch (lamp) in the pitcher.',
          'Nothing — they hid.',
          'Only spears.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — a strange plan that showed God\'s power.',
        wrongFeedback: 'Listen for trumpet, pitcher, and light. (Answer: Trumpet, pitcher, torch….)'
      },
      {
        question: 'What did they cry when the pitchers broke?',
        choices: [
          'We are afraid!',
          'The sword of the LORD, and of Gideon!',
          'Run away!',
          'We want more soldiers!'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly — the battle belonged to the Lord.',
        wrongFeedback: 'Think of whose sword they trusted. (Answer: The sword of the LORD….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Trust only big crowds.',
          'When God asks you to obey, take the next step — He is mighty to save.',
          'Never try hard things.',
          'Hide from the Bible.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — faith with feet, like those three hundred.',
        wrongFeedback: 'Pick trust and obedience. (Answer: Obey — He is mighty to save….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Gideon's Three Hundred with God's Word today.",
    takeaway:
      'God trimmed the army to show His strength — three hundred who obeyed saw the Lord win the night.',
    prayer:
      'God, thank You for the Bible. Thank You that You are strong when I feel small. Help me obey You today. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled victorious mood, no fighting, no scared faces, no blood, no text in image: night scene soft starry sky distant simple tent shapes, row of several soldiers of Israel calm brave faces each holding trumpet one hand and broken pitcher pieces other hand with bright torch flame glowing upward simple flame shapes, plenty open areas on robes trumpets shards torches, minimal background plenty white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Too many soldiers — God chooses (judges 7)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Three hundred at the water',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Trumpets, pitchers, lamps in the dark',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The sword of the LORD, and of Gideon'
    ],
    readAlongImages: []
  };
}

/** Samson's birth — Judges 13:1-25 (KJV); promise, Nazarite, angel, blessing. */
function buildSamsonBirthReadQuiz() {
  return {
    kjvRef: 'Judges 13:1-25 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'The children of Israel did evil again, and the Philistines troubled them. There was a man named Manoah whose wife had no children.',
        caption: 'A hard time — a longing heart',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'The angel of the Lord appeared to her and said, "Thou shalt conceive, and bear a son. No razor shall come on his head, for the child shall be a Nazarite unto God from the womb. He shall begin to deliver Israel out of the hand of the Philistines."',
        caption: 'God\'s promise',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'She told Manoah. He prayed that the angel would come again. The angel returned and spoke the same words.',
        caption: 'Manoah prays — the angel comes again',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Manoah offered a sacrifice upon a rock to the Lord. When the flame went up toward heaven, the angel of the Lord ascended in the flame of the altar.',
        caption: 'Up in the flame — holy wonder',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'Manoah and his wife were afraid, yet the Lord had shewed them great things. In time a son was born, and they called his name Samson.',
        caption: 'Welcome, Samson',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'The child grew, and the Lord blessed him.',
        caption: 'The Lord\'s blessing',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'The children of Israel did evil again, and the Lord let the Philistines trouble them.',
      'There was a man named Manoah whose wife had no children. One day the angel of the Lord appeared to her and said, "Thou shalt conceive, and bear a son. No razor shall come on his head, for the child shall be a Nazarite unto God from the womb. He shall begin to deliver Israel out of the hand of the Philistines."',
      'The woman told her husband. Manoah prayed that the angel would come again and teach them what to do.',
      'The angel returned and repeated the words. Then Manoah offered a sacrifice, and when the flame went up toward heaven from the altar, the angel of the Lord ascended in the flame.',
      'Manoah and his wife were afraid, but the Lord had shown them something holy. In time a son was born, and they called his name Samson. The child grew, and the Lord blessed him.',
      'For you: Before Samson was strong, God had already chosen him — God knows your name too.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 16', 'Judges 13:1-25', 'Judges 7', 'Ruth 1'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 13:1-25.)'
      },
      {
        question: 'What special promise did the angel give about the coming son?',
        choices: [
          'He would never sleep.',
          'He would be a Nazarite unto God from the womb — no razor on his head.',
          'He would build a great ship.',
          'He would live in Egypt forever.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — set apart for God from the very beginning.',
        wrongFeedback: 'Listen for Nazarite and razor. (Answer: Nazarite… no razor….)'
      },
      {
        question: 'What happened when Manoah offered the sacrifice?',
        choices: [
          'Nothing at all.',
          'The angel of the Lord went up to heaven in the flame of the altar.',
          'It started to snow.',
          'Everyone ran away from Zorah.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — a moment full of holy wonder.',
        wrongFeedback: 'Think flame and heaven. (Answer: Angel… in the flame….)'
      },
      {
        question: 'What was the baby\'s name?',
        choices: ['Gideon', 'Samson', 'Manoah', 'Jonathan'],
        correctIndex: 1,
        correctFeedback: 'Exactly — the child the Lord blessed.',
        wrongFeedback: 'The title of the story helps. (Answer: Samson.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Believe that God can work His kind plans — even when we cannot see how yet.',
          'Never pray about hard things.',
          'Only grown-ups matter to God.',
          'Hide from the Bible.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful — quiet trust pleases God.',
        wrongFeedback: 'Pick trust in God\'s kindness. (Answer: Believe God can work….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samson's Birth and Call with God's Word today.",
    takeaway:
      'God promised a deliverer before Samson was born — He hears His people and keeps His Word.',
    prayer:
      'God, thank You for the Bible. Thank You that You bless children and families. Help me trust You today. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, hopeful holy mood, no fear on faces, no scary expressions, no text in image: Manoah and wife kneeling calmly together simple robes, angel of Lord standing before them with gentle wing shapes simple curves kind calm face, small stone altar background soft flame lines rising upward minimal, soft sky gentle hills plenty white space, ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Angel speaks to Manoah\'s wife (judges 13)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A Nazarite promised from the womb',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Offering and flame — angel ascends',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samson — the Lord blessed the child'
    ],
    readAlongImages: []
  };
}

/** Samson and the lion — Judges 14:5-9 (KJV); Spirit of the Lord, strength, honey. */
function buildSamsonLionReadQuiz() {
  return {
    kjvRef: 'Judges 14:5-9 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text: 'Samson went down toward Timnath. A young lion roared against him.',
        caption: 'Something fierce on the path',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'The Spirit of the LORD came mightily upon him, and he rent him as he would have rent a kid, and he had nothing in his hand.',
        caption: 'God\'s strength — not boasting',
        image: 'panel-noah-1.svg'
      },
      {
        text: 'After a time he turned aside to see the carcass of the lion: and, behold, there was a swarm of bees and honey in the carcass of the lion.',
        caption: 'A sweet surprise',
        image: 'panel-noah-2.svg'
      },
      {
        text: 'He took thereof in his hands, and went on eating, and came to his father and mother, and he gave them, and they did eat.',
        caption: 'Sharing the honey',
        image: 'panel-noah-3.svg'
      },
      {
        text: 'But he told not them that he had taken the honey out of the carcass of the lion.',
        caption: 'A quiet secret for now',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'Samson grew up strong. One day he went toward Timnath, and a young lion roared against him.',
      'The Spirit of the LORD came mightily upon Samson, and he rent the lion as he would have rent a kid, though he had nothing in his hand.',
      'Later, when he passed by the same place again, he turned aside to see the carcass of the lion. Behold, there was a swarm of bees and honey in the body of the lion.',
      'Samson took some of the honey in his hands and went on eating it. He gave some to his father and mother, and they ate too. But he did not tell them where he had found the sweet honey.',
      'For you: The Lord gives strength when you need it — and He can bring kindness you did not expect.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 13', 'Judges 14:5-9', 'Judges 7', 'Ruth 2'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 14:5-9.)'
      },
      {
        question: 'What came upon Samson when the young lion roared against him?',
        choices: [
          'He ran away alone.',
          'The Spirit of the LORD came mightily upon him.',
          'He built a big ship.',
          'He forgot where he was going.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — God gave him strength for that moment.',
        wrongFeedback: 'Listen for Spirit and mightily. (Answer: Spirit of the LORD….)'
      },
      {
        question: 'What did Samson find in the carcass of the lion later?',
        choices: ['Only dust.', 'A swarm of bees and honey.', 'A bag of gold.', 'Nothing at all.'],
        correctIndex: 1,
        correctFeedback: 'Yes — God turned a hard memory into sweetness.',
        wrongFeedback: 'Think bees and honey. (Answer: Swarm of bees and honey.)'
      },
      {
        question: 'What did Samson do with some of the honey?',
        choices: [
          'He threw it away.',
          'He ate and gave some to his father and mother.',
          'He hid it forever.',
          'He sold it in the market.'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly — a gentle share with family.',
        wrongFeedback: 'Think eat and parents. (Answer: Ate and gave… father and mother.)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Thank Him that He can give strength and kindness — even after hard moments.',
          'Never tell anyone about the Bible.',
          'Only grown-ups need God\'s help.',
          'Hide when anything feels hard.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful — quiet trust and gratitude please God.',
        wrongFeedback: 'Pick thankfulness and trust. (Answer: Thank Him… strength and kindness….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samson and the Lion with God's Word today.",
    takeaway:
      'The Spirit of the LORD came mightily upon Samson — God\'s strength for the fierce moment, and honey as a gentle surprise afterward.',
    prayer:
      'God, thank You for the Bible. Thank You that You are strong and kind. When I feel small or scared, help me trust You. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art for young children, bold thick outlines, large open spaces, wonder-filled strong thankful mood, calm faces no anger no scary expressions no text in image: young Samson standing beside large gentle resting lion overcome peaceful mane, Samson holds honeycomb piece two small bee shapes nearby soft path soft hills minimal background plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Young lion and the Spirit\'s strength (judges 14)',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Bees and honey in the lion',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samson shares honey with parents',
      'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God gives strength when we need it'
    ],
    readAlongImages: []
  };
}

/** Samson and Delilah — Judges 16:4-21 (KJV); secret, Nazarite, mercy. */
function buildSamsonDelilahReadQuiz() {
  return {
    kjvRef: 'Judges 16:4-21 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'And it came to pass afterward, that he loved a woman in the valley of Sorek, whose name was Delilah. And the lords of the Philistines came up unto her, and said unto her, Entice him, and see wherein his great strength lieth, and by what means we may prevail against him, that we may bind him to afflict him: and we will give thee every one of us eleven hundred pieces of silver.',
        caption: 'Love and a hard ask',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'And it came to pass, when she pressed him daily with her words, and urged him, so that his soul was vexed unto death; That he told her all his heart, and said unto her, There hath not come a razor upon mine head; for I have been a Nazarite unto God from my mother\'s womb: if I be shaven, then my strength will go from me, and I shall become weak, and be like any other man.',
        caption: 'The secret he should have kept for God',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'And when Delilah saw that he had told her all his heart, she sent and called for the lords of the Philistines, saying, Come up this once, for he hath shewed me all his heart. Then the lords of the Philistines came up unto her, and brought money in their hand. And she made him sleep upon her knees; and she called for a man, and she caused him to shave off the seven locks of his head; and she began to afflict him, and his strength went from him.',
        caption: 'While he slept — his strength went',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'And she said, The Philistines be upon thee, Samson. And he awoke out of his sleep, and said, I will go out as at other times before, and shake myself. And he wist not that the LORD was departed from him.',
        caption: 'He did not know — yet',
        image: 'panel-noah-3.svg'
      },
      {
        text:
          'But the Philistines took him, and put out his eyes, and brought him down to Gaza, and bound him with fetters of brass; and he did grind in the prison house.',
        caption: 'A hard turn — the Lord had not left him forever',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'Samson loved a woman named Delilah who lived in the valley of Sorek. The lords of the Philistines came to her and said, "Entice him, and see wherein his great strength lieth."',
      'Delilah asked Samson many times, "Tell me, I pray thee, wherein thy great strength lieth." At first Samson gave her wrong answers, but she kept pressing him.',
      'Finally Samson told her all his heart: "There hath not come a razor upon mine head; for I have been a Nazarite unto God from my mother\'s womb. If I be shaven, then my strength will go from me, and I shall become weak, and be like any other man."',
      'While Samson slept on her knees, Delilah called a man to shave off the seven locks of his head. His strength went from him.',
      'The Philistines took Samson and put out his eyes. But even then the Lord had not left him forever.',
      'For you: Some secrets belong to God and to wise grown-ups you trust — and when we are sorry, God\'s mercy is still near.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 14', 'Judges 16:4-21', 'Ruth 1', 'Judges 7'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 16:4-21.)'
      },
      {
        question: 'What did the lords of the Philistines want Delilah to find out?',
        choices: [
          'What Samson liked to eat.',
          'Wherein Samson\'s great strength lieth.',
          'How tall Samson was.',
          'Samson\'s favorite color.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — they wanted his secret.',
        wrongFeedback: 'Listen for strength. (Answer: Wherein his great strength….)'
      },
      {
        question: 'What did Samson finally say was tied to his strength?',
        choices: [
          'His sandals.',
          'No razor on his head — a Nazarite unto God; if shaven, he would become weak.',
          'A golden belt.',
          'How much he slept.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — God had set him apart.',
        wrongFeedback: 'Think Nazarite and razor. (Answer: No razor… Nazarite… if shaven….)'
      },
      {
        question: 'What happened after the seven locks were shaved?',
        choices: [
          'He grew taller.',
          'His strength went from him.',
          'He sang a song.',
          'Nothing changed.'
        ],
        correctIndex: 1,
        correctFeedback: 'Exactly — a sad consequence.',
        wrongFeedback: 'Think strength. (Answer: His strength went from him.)'
      },
      {
        question: 'What is one gentle lesson for today?',
        choices: [
          'Guard precious things God gives you; ask a trusted grown-up when you are not sure what to share.',
          'Tell every secret to everyone.',
          'Never talk to God.',
          'Hide the Bible.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful — wisdom and honesty together.',
        wrongFeedback: 'Pick wisdom and trust. (Answer: Guard… ask a trusted grown-up….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samson and Delilah with God's Word today.",
    takeaway:
      'Samson told a secret meant for God — his strength left — yet God\'s mercy would not end there.',
    prayer:
      'God, thank You for the Bible. Help me be honest with You. Teach me what to keep sacred and whom to trust. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces honest calm mood sad not mean faces no anger no text Samson sleeping head on Delilah lap long hair locks Delilah seated gentle sad face holding shears near hair simple tent room background plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Delilah asks Samson (judges 16)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Samson tells his heart Nazarite razor',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Seven locks shorn strength departs',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text God\'s mercy still ahead'
    ],
    readAlongImages: []
  };
}

/** Samson and the Pillars — Judges 16:23-30 (KJV); prayer, pillars, God hears. */
function buildSamsonPillarsReadQuiz() {
  return {
    kjvRef: 'Judges 16:23-30 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Then the lords of the Philistines gathered them together for to offer a great sacrifice unto Dagon their god, and to rejoice: for they said, Our god hath delivered Samson our enemy into our hand. And when the people saw him, they praised their god: for they said, Our god hath delivered into our hands our enemy, and the destroyer of our country, which slew many of us. And it came to pass, when their hearts were merry, that they said, Call for Samson, that he may make us sport. And they called for Samson out of the prison house; and he made them sport: and they set him between the pillars.',
        caption: 'They did not know the Lord had not forgotten him',
        image: 'panel-daniel-1.svg'
      },
      {
        text:
          'And Samson said unto the lad that held him by the hand, Suffer me that I may feel the pillars whereupon the house standeth, that I may lean upon them. Now the house was full of men and women; and all the lords of the Philistines were there; and there were upon the roof about three thousand men and women, that beheld while Samson made sport.',
        caption: 'Between the two middle pillars',
        image: 'panel-daniel-2.svg'
      },
      {
        text:
          'And Samson called unto the LORD, and said, O Lord GOD, remember me, I pray thee, and strengthen me, I pray thee, only this once, O God, that I may be at once avenged of the Philistines for my two eyes.',
        caption: 'One honest prayer',
        image: 'panel-daniel-2.svg'
      },
      {
        text:
          'And Samson took hold of the two middle pillars upon which the house stood, and on which it was borne up, of the one with his right hand, and of the other with his left. And Samson said, Let me die with the Philistines. And he bowed himself with all his might; and the house fell upon the lords, and upon all the people that were therein. So the dead which he slew at his death were more than they which he slew in his life.',
        caption: 'The Lord gave strength one last time',
        image: 'panel-daniel-3.svg'
      }
    ],
    paragraphs: [
      'The Philistines brought Samson out to make sport of him in the house of Dagon their god. They did not know that the Lord had not forgotten him.',
      'Samson was placed between the two middle pillars that held up the house. He prayed, "O Lord God, remember me, I pray thee, and strengthen me, I pray thee, only this once, O God."',
      'Then Samson took hold of the two middle pillars, one with his right hand and the other with his left. He bowed himself with all his might and said, "Let me die with the Philistines."',
      'The house fell upon the lords and all the people that were in it. So the dead which he slew at his death were more than they which he slew in his life.',
      'In this way the Lord gave Samson strength one last time to deliver His people from their enemies.',
      'For you: God hears prayer — even when the room feels loud, He can give quiet strength.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Judges 16:4', 'Judges 16:23-30', 'Judges 14', 'Ruth 2'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Judges 16:23-30.)'
      },
      {
        question: 'What did Samson pray?',
        choices: [
          'To forget God.',
          'O Lord GOD, remember me, I pray thee, and strengthen me, I pray thee, only this once, O God.',
          'To hide forever.',
          'To never speak again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — honest words to the Lord.',
        wrongFeedback: 'Listen for remember and strengthen. (Answer: Remember me… strengthen me… only this once….)'
      },
      {
        question: 'What did Samson take hold of?',
        choices: [
          'A small stone only.',
          'The two middle pillars upon which the house stood.',
          'A river.',
          'Nothing at all.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — both pillars, right and left.',
        wrongFeedback: 'Think pillars. (Answer: Two middle pillars….)'
      },
      {
        question: 'What happened when he bowed himself with all his might?',
        choices: [
          'The house fell upon the lords and all the people that were therein.',
          'Everyone went home quietly.',
          'Nothing moved.',
          'The sun stood still.'
        ],
        correctIndex: 0,
        correctFeedback: 'Exactly — the record says the house fell.',
        wrongFeedback: 'Think house and fell. (Answer: The house fell….)'
      },
      {
        question: 'What is one good way to respond to God after this story?',
        choices: [
          'Talk to Him honestly — He still hears when we pray.',
          'Never pray when we feel weak.',
          'Only grown-ups may pray.',
          'Hide from the Bible.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful — quiet trust in prayer.',
        wrongFeedback: 'Pick honest prayer. (Answer: Talk to Him honestly….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samson and the Pillars with God's Word today.",
    takeaway:
      'Samson prayed — remember me, strengthen me this once — and the Lord answered with strength for His people.',
    prayer:
      'Lord God, thank You that You hear prayer. When I feel small or tired, help me speak honestly to You. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces hopeful reverent mood calm prayerful face looking up no fear no falling debris no text Samson standing between two large pillars indoors hands resting gently on each pillar long hair simple robe simple beams ceiling minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text House of Dagon crowd (judges 16)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Samson between the pillars',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text O Lord God remember me',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text God gives strength one last time'
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
  joshuaCharge: buildJoshuaChargeReadQuiz(),
  sunStandsStill: buildSunStandsStillReadQuiz(),
  achan: buildAchanReadQuiz(),
  battleOfAi: buildBattleOfAiReadQuiz(),
  deborahBarak: buildDeborahBarakReadQuiz(),
  gideonFleece: buildGideonFleeceReadQuiz(),
  gideonMidianites: buildGideonMidianitesReadQuiz(),
  samsonBirth: buildSamsonBirthReadQuiz(),
  samsonLion: buildSamsonLionReadQuiz(),
  samsonDelilah: buildSamsonDelilahReadQuiz(),
  samson: buildSamsonPillarsReadQuiz()
};
