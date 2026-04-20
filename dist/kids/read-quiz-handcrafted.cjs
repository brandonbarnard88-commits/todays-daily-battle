'use strict';

/**
 * Overrides merged into kids-read-quiz-data.js (see scripts/generate-kids-read-quiz-data.mjs).
 *
 * Keep this file tiny: only keys that must differ from auto-generation.
 * Two library cards share one Joshua 6 read+quiz — same pack for both keys.
 * David & Goliath: full read-along sections + quiz live in read-quiz-david-pack.cjs (keys david + davidGoliath).
 * David & Jonathan: read-quiz-david-jonathan-pack.cjs (keys davidJonathan + davidJonathanFriendship).
 * David spares Saul in the cave: read-quiz-david-cave-pack.cjs (key davidCave).
 * David & Abigail: read-quiz-david-abigail-pack.cjs (keys davidAbigail + abigailWise).
 * Psalm 23: read-quiz-psalm23-pack.cjs (keys psalm23 + psalm23Shepherd).
 * David harp before Saul: read-quiz-david-harp-pack.cjs (key davidHarp).
 * David king over Israel: read-quiz-david-king-pack.cjs (key davidKing).
 * Solomon asks for wisdom: read-quiz-solomon-wisdom-pack.cjs (key solomonWisdom).
 * Solomon and the two mothers: read-quiz-solomon-two-mothers-pack.cjs (key solomonTwoMothers).
 * Solomon builds the temple: read-quiz-solomon-temple-pack.cjs (key solomonTemple).
 * Elijah and the ravens: read-quiz-elijah-ravens-pack.cjs (key elijahRavens).
 * Elijah and the widow of Zarephath: read-quiz-elijah-widow-pack.cjs (key elijahWidow).
 * Elijah and the fire on Mount Carmel: read-quiz-elijah-fire-carmel-pack.cjs (key elijahFire).
 * Elijah and the still small voice (Horeb): read-quiz-elijah-horeb-pack.cjs (key elijahHoreb).
 * Elijah calls Elisha (field / mantle): read-quiz-elijah-calls-elisha-pack.cjs (key elijahElijahElisha).
 * Elijah taken up in the fiery chariot: read-quiz-elijah-chariot-pack.cjs (key elijahChariot).
 * Elisha's first miracles (Jericho waters + widow's oil): read-quiz-elisha-miracles-pack.cjs (key elishaMiracles).
 * Elisha and the widow's oil (full): read-quiz-elisha-oil-pack.cjs (key elishaOil).
 * Elisha and the Shunammite's son: read-quiz-elisha-shunammite-pack.cjs (key elishaShunammite).
 * Naaman healed of leprosy: read-quiz-naaman-healed-pack.cjs (keys naamanHealed, naamanDip, naaman).
 * Elisha and the floating axe: read-quiz-elisha-floating-axe-pack.cjs (key elishaFloatingAxe).
 * Elisha and the chariots of fire (Dothan): read-quiz-elisha-chariots-pack.cjs (key elishaChariots).
 *
 * All other stories use buildPack() — short beats, panel alts + apply when no narration,
 * no filler (see generator).
 */

const davidReadQuizPack = require('./read-quiz-david-pack.cjs');
const davidJonathanReadQuizPack = require('./read-quiz-david-jonathan-pack.cjs');
const davidCaveReadQuizPack = require('./read-quiz-david-cave-pack.cjs');
const davidAbigailReadQuizPack = require('./read-quiz-david-abigail-pack.cjs');
const psalm23ReadQuizPack = require('./read-quiz-psalm23-pack.cjs');
const davidHarpReadQuizPack = require('./read-quiz-david-harp-pack.cjs');
const davidKingReadQuizPack = require('./read-quiz-david-king-pack.cjs');
const solomonWisdomReadQuizPack = require('./read-quiz-solomon-wisdom-pack.cjs');
const solomonTwoMothersReadQuizPack = require('./read-quiz-solomon-two-mothers-pack.cjs');
const solomonTempleReadQuizPack = require('./read-quiz-solomon-temple-pack.cjs');
const elijahRavensReadQuizPack = require('./read-quiz-elijah-ravens-pack.cjs');
const elijahWidowReadQuizPack = require('./read-quiz-elijah-widow-pack.cjs');
const elijahFireCarmelReadQuizPack = require('./read-quiz-elijah-fire-carmel-pack.cjs');
const elijahHorebReadQuizPack = require('./read-quiz-elijah-horeb-pack.cjs');
const elijahCallsElishaReadQuizPack = require('./read-quiz-elijah-calls-elisha-pack.cjs');
const elijahChariotReadQuizPack = require('./read-quiz-elijah-chariot-pack.cjs');
const elishaMiraclesReadQuizPack = require('./read-quiz-elisha-miracles-pack.cjs');
const elishaOilReadQuizPack = require('./read-quiz-elisha-oil-pack.cjs');
const elishaShunammiteReadQuizPack = require('./read-quiz-elisha-shunammite-pack.cjs');
const naamanHealedReadQuizPack = require('./read-quiz-naaman-healed-pack.cjs');
const elishaFloatingAxeReadQuizPack = require('./read-quiz-elisha-floating-axe-pack.cjs');
const elishaChariotsReadQuizPack = require('./read-quiz-elisha-chariots-pack.cjs');

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

/** Ruth and Naomi — Ruth 1:1-18 (KJV); loyalty, Moab, promise. */
function buildRuthNaomiReadQuiz() {
  return {
    kjvRef: 'Ruth 1:1-18 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Now it came to pass in the days when the judges ruled, that there was a famine in the land. And a certain man of Bethlehemjudah went to sojourn in the country of Moab, he, and his wife, and his two sons. And the name of the man was Elimelech, and the name of his wife Naomi, and the name of his two sons Mahlon and Chilion, Ephrathites of Bethlehemjudah. And they came into the country of Moab, and continued there.',
        caption: 'A hard time — a journey to Moab',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'And Elimelech Naomi\'s husband died; and she was left, and her two sons. And they took them wives of the women of Moab; the name of the one was Orpah, and the name of the other Ruth: and they dwelled there about ten years. And Mahlon and Chilion died also both of them; and the woman was left of her two sons and her husband.',
        caption: 'Sorrow — Naomi was left alone',
        image: 'panel-noah-1.svg'
      },
      {
        text:
          'Then she arose with her daughters in law, that she might return from the country of Moab: for she had heard in the country of Moab how that the LORD had visited his people in giving them bread. Wherefore she went forth out of the place where she was, and her two daughters in law with her; and they went on the way to return unto the land of Judah.',
        caption: 'Homeward — bread in Bethlehem again',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'And Naomi said unto her two daughters in law, Go, return each to her mother\'s house: the LORD deal kindly with you, as ye have dealt with the dead, and with me. And they lifted up their voice, and wept again: and Orpah kissed her mother in law; but Ruth clave unto her. And she said, Behold, thy sister in law is gone back unto her people, and unto her gods: return thou after thy sister in law.',
        caption: 'One kissed goodbye — one stayed',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'And Ruth said, Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God: where thou diest, will I die, and there will I be buried: the LORD do so to me, and more also, if ought but death part thee and me.',
        caption: 'Ruth\'s promise',
        image: 'panel-noah-2.svg'
      },
      {
        text:
          'When she saw that she was stedfastly minded to go with her, then she left speaking unto her.',
        caption: 'Steadfast — Naomi knew Ruth would not turn back',
        image: 'panel-noah-3.svg'
      }
    ],
    paragraphs: [
      'There was a famine in the land, and a woman named Naomi went to live in Moab with her husband and two sons. In time her husband and both sons died, and Naomi was left alone and sad.',
      'Naomi decided to return to Bethlehem. Her two daughters-in-law started to go with her, but Naomi told them to go back to their own mothers.',
      'One daughter-in-law kissed Naomi and went back. But Ruth said, "Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God."',
      'Ruth would not leave Naomi. She chose to stay with her and love her like family.',
      'The two women walked together back to Bethlehem, and the Lord was with them.',
      'For you: God blesses loyal love — you can ask Him to help you be kind and true like Ruth.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Ruth 2', 'Ruth 1:1-18', 'Judges 16', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Ruth 1:1-18.)'
      },
      {
        question: 'Why did Naomi\'s family first go to Moab?',
        choices: [
          'There was a famine in Bethlehem.',
          'They wanted to see the ocean.',
          'They were looking for gold.',
          'They had never heard of God.'
        ],
        correctIndex: 0,
        correctFeedback: 'Right — hard times sometimes move families.',
        wrongFeedback: 'Think famine. (Answer: Famine in the land….)'
      },
      {
        question: 'What did Ruth say about going with Naomi?',
        choices: [
          'Whither thou goest, I will go; thy people shall be my people, and thy God my God.',
          'I will never speak again.',
          'I will only stay one hour.',
          'I forgot the way.'
        ],
        correctIndex: 0,
        correctFeedback: 'Beautiful — loyal words from the heart.',
        wrongFeedback: 'Listen for goest and people. (Answer: Whither thou goest… thy people… thy God….)'
      },
      {
        question: 'What did Orpah do?',
        choices: [
          'She kissed Naomi and returned to her people.',
          'She built a tall tower.',
          'She stayed in Moab forever with Ruth.',
          'She went to Egypt.'
        ],
        correctIndex: 0,
        correctFeedback: 'Yes — each woman chose her path.',
        wrongFeedback: 'Think kiss and return. (Answer: Orpah kissed… and went back….)'
      },
      {
        question: 'What is one gentle lesson for today?',
        choices: [
          'Loyal love and choosing God\'s people pleases the Lord.',
          'Never help anyone.',
          'Run away from family.',
          'Hide the Bible.'
        ],
        correctIndex: 0,
        correctFeedback: 'Lovely — kindness with courage matters to God.',
        wrongFeedback: 'Pick loyal love. (Answer: Loyal love… choosing God\'s people….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Ruth and Naomi with God's Word today.",
    takeaway:
      'Ruth clave unto Naomi — whither thou goest, I will go — and God went with them.',
    prayer:
      'God, thank You for Ruth\'s loyal love. Help me love others kindly and choose You. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces warm comforting mood two women Ruth and Naomi walking together gentle path toward distant simple town Bethlehem soft hills Ruth holds Naomi arm or hand small travel bundles kind loyal faces plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Famine and sojourn Moab (ruth 1)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Orpah kisses Naomi',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Whither thou goest I will go',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Two women come to Bethlehem'
    ],
    readAlongImages: []
  };
}

/** Ruth and Boaz in the field — Ruth 2:1-17 (KJV); glean, kindness, provision. */
function buildRuthBoazReadQuiz() {
  return {
    kjvRef: 'Ruth 2:1-17 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'And Naomi had a kinsman of her husband\'s, a mighty man of wealth, of the family of Elimelech; and his name was Boaz. And Ruth the Moabitess said unto Naomi, Let me now go to the field, and glean ears of corn after him in whose sight I shall find grace. And she said unto her, Go, my daughter. And she went, and came, and gleaned in the field after the reapers: and her hap was to light on a part of the field belonging unto Boaz, who was of the kindred of Elimelech.',
        caption: 'Harvest time — Ruth asks to glean',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And, behold, Boaz came from Bethlehem, and said unto the reapers, The LORD be with you. And they answered him, The LORD bless thee. Then said Boaz unto his servant that was set over the reapers, Whose damsel is this? And the servant that was set over the reapers answered and said, It is the Moabitish damsel that came back with Naomi out of the country of Moab: And she said, I pray you, let me glean and gather after the reapers among the sheaves: so she came, and hath continued even from the morning until now, that she tarried a little in the house.',
        caption: 'Boaz sees Ruth in his field',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Then said Boaz unto Ruth, Hearest thou not, my daughter? Go not to glean in another field, neither go from hence, but abide here fast by my maidens: Let thine eyes be on the field that they do reap, and go thou after them: have I not charged the young men that they shall not touch thee? and when thou art athirst, go unto the vessels, and drink of that which the young men have drawn.',
        caption: 'Kind words — stay here and drink',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Then she fell on her face, and bowed herself to the ground, and said unto him, Why have I found grace in thine eyes, that thou shouldest take knowledge of me, seeing I am a stranger? And Boaz answered and said unto her, It hath fully been shewed me, all that thou hast done unto thy mother in law since the death of thine husband: and how thou hast left thy father and thy mother, and the land of thy nativity, and art come unto a people which thou knewest not heretofore. The LORD recompense thy work, and a full reward be given thee of the LORD God of Israel, under whose wings thou art come to trust.',
        caption: 'Why such kindness? — The Lord recompense thy work',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'Then she said, Let me find favour in thy sight, my lord; for that thou hast comforted me, and for that thou hast spoken friendly unto thine handmaid, though I be not like unto one of thine handmaidens. And Boaz said unto her, At mealtime come thou hither, and eat of the bread, and dip thy morsel in the vinegar. And she sat beside the reapers: and he reached her parched corn, and she did eat, and was sufficed, and left. And when she was risen up to glean, Boaz commanded his young men, saying, Let her glean even among the sheaves, and reproach her not: And let fall also some of the handfuls of purpose for her, and leave them, that she may glean them, and rebuke her not. So she gleaned in the field until even, and beat out that she had gleaned: and it was about an ephah of barley.',
        caption: 'Till evening — an ephah of barley',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'Naomi and Ruth had come back to Bethlehem. It was harvest time. Ruth said to Naomi, "Let me now go to the field, and glean ears of corn after him in whose sight I shall find grace."',
      'Ruth went and gleaned in the field of a man named Boaz, who was a rich kinsman of Naomi.',
      'Boaz came to the field and saw Ruth. He asked his servant whose damsel she was. The servant told him she was the Moabitish woman who came back with Naomi.',
      'Boaz spoke kindly to Ruth. He said, "Go not to glean in another field… abide here fast by my maidens. Let thine eyes be on the field that they do reap, and go thou after them. Have I not charged the young men that they shall not touch thee? And when thou art athirst, go unto the vessels, and drink."',
      'Ruth bowed herself to the ground and said, "Why have I found grace in thine eyes?"',
      'Boaz answered, "It hath fully been shewed me all that thou hast done unto thy mother in law… The Lord recompense thy work, and a full reward be given thee of the Lord God of Israel, under whose wings thou art come to trust."',
      'Ruth gleaned in Boaz\'s field until evening. She beat out what she had gleaned, and it was about an ephah of barley.',
      'For you: God sees faithful love — and He often cares for us through the kindness of others.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Ruth 1:1', 'Ruth 2:1-17', 'Judges 7', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Ruth 2:1-17.)'
      },
      {
        question: 'What did Ruth ask Naomi to let her do?',
        choices: [
          'Stay home always.',
          'Go to the field and glean ears of corn.',
          'Build a ship.',
          'Forget Bethlehem.'
        ],
        correctIndex: 1,
        correctFeedback: 'Right — honest work in the harvest.',
        wrongFeedback: 'Think field and glean. (Answer: Glean ears of corn….)'
      },
      {
        question: 'Whose field did Ruth glean in?',
        choices: ['A stranger far away.', 'Boaz — a kinsman of Naomi.', 'Only Orpah\'s field.', 'No field at all.'],
        correctIndex: 1,
        correctFeedback: 'Yes — God guided her steps.',
        wrongFeedback: 'Think kinsman. (Answer: Boaz….)'
      },
      {
        question: 'What did Boaz tell Ruth about drinking?',
        choices: [
          'Never drink water.',
          'When thou art athirst, go unto the vessels, and drink.',
          'Only at night.',
          'Only in Moab.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — gentle care.',
        wrongFeedback: 'Listen for athirst and drink. (Answer: When thou art athirst… drink….)'
      },
      {
        question: 'About how much barley did Ruth gather that day?',
        choices: ['Nothing.', 'About an ephah of barley.', 'One tiny seed.', 'A whole city.'],
        correctIndex: 1,
        correctFeedback: 'Exactly — God provided through the day.',
        wrongFeedback: 'Think measure. (Answer: About an ephah….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Ruth and Boaz in the Field with God's Word today.",
    takeaway:
      'Boaz spoke kindly — the LORD recompense thy work — and Ruth went home with barley for the table.',
    prayer:
      'God, thank You for people who speak kindly. Thank You that You see hard work and loyal love. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces warm thankful mood Ruth in grain field holding small barley bundle kind Boaz nearby gentle faces few soft background workers with sheaves distant soft hills harvest sky minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Ruth asks to glean (ruth 2)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Boaz The LORD be with you',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Abide here and drink',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Ephah of barley blessing'
    ],
    readAlongImages: []
  };
}

/** Ruth at the threshing floor — Ruth 3:1-18 (KJV); obedience, kindness, redemption. */
function buildRuthThreshingReadQuiz() {
  return {
    kjvRef: 'Ruth 3:1-18 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Then Naomi her mother in law said unto her, My daughter, shall I not seek rest for thee, that it may be well with thee? And now is not Boaz of our kindred, with whose maidens thou wast? Behold, he winnoweth barley to night in the threshingfloor. Wash thyself therefore, and anoint thee, and put thy raiment upon thee, and get thee down to the floor: but make not thyself known unto the man, until he shall have done eating and drinking. And it shall be, when he lieth down, that thou shalt mark the place where he shall lie, and thou shalt go in, and uncover his feet, and lay thee down; and he will tell thee what thou shalt do. And she said unto her, All that thou sayest unto me I will do.',
        caption: 'Naomi\'s loving plan — rest for Ruth',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And she went down unto the floor, and did according to all that her mother in law bade her. And when Boaz had eaten and drunk, and his heart was merry, he went to lie down at the end of the heap of corn: and she came softly, and uncovered his feet, and laid her down.',
        caption: 'A quiet night — at the heap of corn',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And it came to pass at midnight, that the man was afraid, and turned: and, behold, a woman lay at his feet. And he said, Who art thou? And she answered, I am Ruth thine handmaid: spread therefore thy skirt over thine handmaid; for thou art a near kinsman.',
        caption: 'Who art thou? — spread thy skirt',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And he said, Blessed be thou of the LORD, my daughter: thou hast shewed more kindness in the latter end than at the beginning, inasmuch as thou followedst not young men, whether poor or rich. And now, my daughter, fear not; I will do to thee all that thou requirest: for all the city of my people doth know that thou art a virtuous woman.',
        caption: 'Fear not — thou art a virtuous woman',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And now it is true that I am thy near kinsman: howbeit there is a kinsman nearer than I. Tarry this night, and it shall be in the morning, that if he will perform unto thee the part of a kinsman, well; let him do the kinsman\'s part: but if he will not do the part of a kinsman to thee, then will I do the part of a kinsman to thee, as the LORD liveth: lie down until the morning.',
        caption: 'The kinsman\'s part — lie down until the morning',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And she lay at his feet until the morning: and she rose up before one could know another. And he said, Let it not be known that a woman came into the floor. Also he said, Bring the vail that thou hast upon thee, and hold it. And when she held it, he measured six measures of barley, and laid it on her: and she went into the city. And when she came to her mother in law, she said, Who art thou, my daughter? And she told her all that the man had done unto her. And she said, These six measures of barley gave he me; for he said to me, Go not empty unto thy mother in law. Then said she, Sit still, my daughter, until thou know how the matter will fall: for the man will not be in rest, until he have finished the thing this day.',
        caption: 'Six measures — Naomi waits with hope',
        image: 'panel-david-1.svg'
      }
    ],
    paragraphs: [
      'Naomi loved Ruth and wanted to find a safe home for her. She told Ruth what to do.',
      'That night, when Boaz had finished eating and drinking and was sleeping at the threshing floor, Ruth came quietly. She lay down at his feet.',
      'At midnight Boaz woke and saw a woman at his feet. He asked, "Who art thou?"',
      'Ruth answered, "I am Ruth thine handmaid: spread therefore thy skirt over thine handmaid; for thou art a near kinsman."',
      'Boaz said kindly, "Blessed be thou of the Lord… fear not. I will do to thee all that thou requirest: for all the city of my people doth know that thou art a virtuous woman."',
      'Boaz gave Ruth six measures of barley to take home to Naomi and said he would do the part of a kinsman if the nearer kinsman would not.',
      'Ruth returned to Naomi with a full heart, and Naomi said, "The man will not be in rest until he have finished the thing this day."',
      'For you: God honors loyal love and works redemption in His time.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Ruth 2:1', 'Ruth 3:1-18', 'Judges 16', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Ruth 3:1-18.)'
      },
      {
        question: 'What did Ruth say to Boaz when he asked who she was?',
        choices: [
          'I will go home and forget.',
          'I am Ruth thine handmaid: spread therefore thy skirt over thine handmaid; for thou art a near kinsman.',
          'I want to fight a giant.',
          'I will never glean again.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — honest and trusting words.',
        wrongFeedback: 'Listen for handmaid and kinsman. (Answer: I am Ruth thine handmaid….)'
      },
      {
        question: 'What did Boaz tell Ruth not to do?',
        choices: ['Fear.', 'Sing.', 'Run away from Bethlehem.', 'Help Naomi.'],
        correctIndex: 0,
        correctFeedback: 'Right — fear not.',
        wrongFeedback: 'He spoke peace first. (Answer: Fear not.)'
      },
      {
        question: 'How much barley did Boaz give Ruth to carry home?',
        choices: ['None.', 'Six measures of barley.', 'One tiny grain.', 'A whole city.'],
        correctIndex: 1,
        correctFeedback: 'Yes — generous care for the table.',
        wrongFeedback: 'Think counted gift. (Answer: Six measures….)'
      },
      {
        question: 'What did Naomi say the man would do about the matter?',
        choices: [
          'Forget it forever.',
          'Not be in rest until he have finished the thing this day.',
          'Send them away.',
          'Hide in the field.'
        ],
        correctIndex: 1,
        correctFeedback: 'Hopeful — she trusted he would finish it well.',
        wrongFeedback: 'Listen for rest and finished. (Answer: Not be in rest until….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Ruth at the Threshing Floor with God's Word today.",
    takeaway:
      'Ruth obeyed with a quiet heart; Boaz answered with kindness and kept his word about the kinsman\'s part.',
    prayer:
      'God, thank You for people who speak kindly and keep their word. Thank You that You are our Redeemer. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces Ruth kneeling calmly at feet of Boaz on threshing floor at night Boaz sitting up gently kind face few barley stalks nearby soft night sky gentle stars simple floor lines hopeful trusting mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Naomi seek rest (ruth 3)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Who art thou spread skirt',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Fear not virtuous woman',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Six measures barley home'
    ],
    readAlongImages: []
  };
}

/** Ruth's redemption at the gate — Ruth 4:1-17 (KJV); kinsman-redeemer, Obed, joy. */
function buildRuthRedemptionReadQuiz() {
  return {
    kjvRef: 'Ruth 4:1-17 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Then went Boaz up to the gate, and sat him down there: and, behold, the kinsman of whom Boaz spake came by; unto whom he said, Ho, such a one! turn aside, sit down here. And he turned aside, and sat down. And he took ten men of the elders of the city, and said, Sit ye down here. And they sat down.',
        caption: 'At the gate — elders sit as witnesses',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And he said unto the kinsman, Naomi, that is come again out of the country of Moab, selleth a parcel of land, which was our brother Elimelech\'s: And I thought to advertise thee, saying, Buy it before the inhabitants, and before the elders of my people. If thou wilt redeem it, redeem it: but if thou wilt not redeem it, then tell me, that I may know: for there is none to redeem it beside thee; and I am after thee. And he said, I will redeem it.',
        caption: 'The field of Naomi — I will redeem it',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'Then said Boaz, What day thou buyest the field of the hand of Naomi, thou must buy it also of Ruth the Moabitess, the wife of the dead, to raise up the name of the dead upon his inheritance. And the kinsman said, I cannot redeem it for myself, lest I mar mine own inheritance: redeem thou my right to thyself; for I cannot redeem it.',
        caption: 'The nearer kinsman cannot — redeem thou my right',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Now this was the manner in former time in Israel concerning redeeming and concerning changing, for to confirm all things; a man plucked off his shoe, and gave it to his neighbour: and this was a testimony in Israel. Therefore the kinsman said unto Boaz, Buy it for thee. So he drew off his shoe.',
        caption: 'The shoe — a testimony in Israel',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And Boaz said unto the elders, and unto all the people, Ye are witnesses this day, that I have bought all that was Elimelech\'s, and all that was Chilion\'s and Mahlon\'s, of the hand of Naomi. Moreover Ruth the Moabitess, the wife of Mahlon, have I purchased to be my wife, to raise up the name of the dead upon his inheritance, that the name of the dead be not cut off from among his brethren, and from the gate of his place: ye are witnesses this day.',
        caption: 'Ye are witnesses — purchased to be my wife',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And all the people that were in the gate, and the elders, said, We are witnesses. The LORD make the woman that is come into thine house like Rachel and like Leah, which two did build the house of Israel: and do thou worthily in Ephratah, and be famous in Bethlehem: And let thy house be like the house of Pharez, whom Tamar bare unto Judah, of the seed which the LORD shall give thee of this young woman.',
        caption: 'We are witnesses — the Lord make her like Rachel and Leah',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'So Boaz took Ruth, and she was his wife: and when he went in unto her, the LORD gave her conception, and she bare a son. And the women said unto Naomi, Blessed be the LORD, which hath not left thee this day without a kinsman, that his name may be famous in Israel. And he shall be unto thee a restorer of thy life, and a nourisher of thine old age: for thy daughter in law, which loveth thee, which is better to thee than seven sons, hath born him. And Naomi took the child, and laid it in her bosom, and became nurse unto it. And the women her neighbours gave it a name, saying, There is a son born to Naomi; and they called his name Obed: he is the father of Jesse, the father of David.',
        caption: 'A son — Obed — joy for Naomi',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'Boaz went up to the gate of the city and called the nearer kinsman. He told him about Naomi\'s land and Ruth. The nearer kinsman could not redeem it, so he gave up his right.',
      'Then Boaz said to the elders and all the people, "Ye are witnesses this day that I have bought all that was Naomi\'s, and also Ruth the Moabitess, to be my wife."',
      'The people blessed Boaz and said, "The Lord make the woman that is come into thine house like Rachel and like Leah… and be famous in Bethlehem."',
      'Boaz took Ruth, and she became his wife. The Lord gave them a son, and they called his name Obed.',
      'Obed became the father of Jesse, and Jesse the father of David.',
      'Naomi took the child and laid him in her bosom, and the women said, "There is a son born to Naomi… and they called his name Obed: he is the father of Jesse, the father of David."',
      'In this way God turned Naomi\'s sadness into joy and brought Ruth into the family of Israel.',
      'For you: God keeps His promises — He cares for His people and gives a Redeemer.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['Ruth 3:1', 'Ruth 4:1-17', 'Judges 7', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: Ruth 4:1-17.)'
      },
      {
        question: 'Where did Boaz speak with the kinsman and the elders?',
        choices: ['In a far country.', 'At the gate of the city.', 'Only in a field.', 'Under the sea.'],
        correctIndex: 1,
        correctFeedback: 'Right — a public, honest place.',
        wrongFeedback: 'Think city and witnesses. (Answer: At the gate….)'
      },
      {
        question: 'What did Boaz say the people were?',
        choices: ['Asleep.', 'Witnesses this day.', 'Angry.', 'Lost.'],
        correctIndex: 1,
        correctFeedback: 'Beautiful — open and true.',
        wrongFeedback: 'Listen for witnesses. (Answer: Ye are witnesses….)'
      },
      {
        question: 'What was the baby\'s name?',
        choices: ['Moses.', 'Obed.', 'Goliath.', 'Jonah.'],
        correctIndex: 1,
        correctFeedback: 'Yes — a gift from the Lord.',
        wrongFeedback: 'Think Ruth 4. (Answer: Obed.)'
      },
      {
        question: 'Who was Obed the father of?',
        choices: ['Pharaoh.', 'Jesse.', 'Haman.', 'Nobody.'],
        correctIndex: 1,
        correctFeedback: 'Right — toward David\'s line.',
        wrongFeedback: 'Think grandfather. (Answer: Jesse.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Ruth's Redemption with God's Word today.",
    takeaway:
      'Boaz kept his word at the gate; the Lord gave a son; Naomi\'s heart was filled with joy again.',
    prayer:
      'God, thank You for faithful promises and for Jesus our Redeemer. Thank You for turning sadness into joy. Amen.',
    imagePrompts: [
      'Simple joyful black-and-white line-art young children bold thick outlines large open spaces Boaz and Ruth standing happily at city gate elders and people watching kindly Boaz holds sandal sign of redemption foreground Naomi sitting smiling baby Obed in arms soft gate gentle sky warm thankful mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Ye are witnesses (ruth 4)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Drew off his shoe',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Like Rachel and Leah blessing',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Son born to Naomi Obed'
    ],
    readAlongImages: []
  };
}

/** Hannah's prayer at Shiloh — 1 Samuel 1:1-20 (KJV); poured-out heart, Eli's blessing, Samuel born. */
function buildHannahPrayerReadQuiz() {
  return {
    kjvRef: '1 Samuel 1:1-20 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'Now there was a certain man of Ramathaimzophim, of mount Ephraim, and his name was Elkanah, the son of Jeroham, the son of Elihu, the son of Tohu, the son of Zuph, an Ephrathite: And he had two wives; the name of the one was Hannah, and the name of the other Peninnah: and Peninnah had children, but Hannah had no children. And this man went up out of his city yearly to worship and to sacrifice unto the LORD of hosts in Shiloh. And the two sons of Eli, Hophni and Phinehas, the priests of the LORD, were there. And when the time was that Elkanah offered, he gave to Peninnah his wife, and to all her sons and her daughters, portions:',
        caption: 'Shiloh — Hannah had no children',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'But unto Hannah he gave a worthy portion; for he loved Hannah: but the LORD had shut up her womb. And her adversary also provoked her sore, for to make her fret, because the LORD had shut up her womb. And as he did so year by year, when she went up to the house of the LORD, so she provoked her; therefore she wept, and did not eat. Then said Elkanah her husband to her, Hannah, why weepest thou? and why eatest thou not? and why is thy heart grieved? am not I better to thee than ten sons?',
        caption: 'Year by year — she wept and did not eat',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'So Hannah rose up after they had eaten in Shiloh, and after they had drunk. Now Eli the priest sat upon a seat by a post of the temple of the LORD. And she was in bitterness of soul, and prayed unto the LORD, and wept sore. And she vowed a vow, and said, O LORD of hosts, if thou wilt indeed look on the affliction of thine handmaid, and remember me, and not forget thine handmaid, but wilt give unto thine handmaid a man child, then I will give him unto the LORD all the days of his life, and there shall no razor come upon his head.',
        caption: 'She prayed and vowed before the Lord',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And it came to pass, as she continued praying before the LORD, that Eli marked her mouth. Now Hannah, she spake in her heart; only her lips moved, but her voice was not heard: therefore Eli thought she had been drunken. And Eli said unto her, How long wilt thou be drunken? put away thy wine from thee.',
        caption: 'Eli saw her lips — he misunderstood',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And Hannah answered and said, No, my lord, I am a woman of a sorrowful spirit: I have drunk neither wine nor strong drink, but have poured out my soul before the LORD. Count not thine handmaid for a daughter of Belial: for out of the abundance of my complaint and grief have I spoken hitherto.',
        caption: 'Poured out my soul before the Lord',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Then Eli answered and said, Go in peace: and the God of Israel grant thee thy petition that thou hast asked of him.',
        caption: 'Go in peace — grant thee thy petition',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And she said, Let thine handmaid find grace in thy sight. So the woman went her way, and did eat, and her countenance was no more sad.',
        caption: 'Her countenance was no more sad',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And they rose up in the morning early, and worshipped before the LORD, and returned, and came to their house to Ramah: and Elkanah knew Hannah his wife; and the LORD remembered her. Wherefore it came to pass, when the time was come about after Hannah had conceived, that she bare a son, and called his name Samuel, saying, Because I have asked him of the LORD.',
        caption: 'The Lord remembered her — Samuel',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'There was a woman named Hannah who had no children, and her heart was very sad. Every year she went with her husband to the house of the Lord at Shiloh, but she cried and could not eat.',
      'One day Hannah prayed at the tabernacle with all her heart. She wept sore and made a promise to God: "O Lord of hosts, if thou wilt… give unto thine handmaid a man child, then I will give him unto the Lord all the days of his life."',
      'Eli the priest saw her lips moving but heard no voice. He thought she was drunk, but Hannah told him, "I am a woman of a sorrowful spirit… I have poured out my soul before the Lord."',
      'Eli answered, "Go in peace: and the God of Israel grant thee thy petition that thou hast asked of him."',
      'Hannah went away with a happy face. The Lord remembered Hannah, and in time she had a son. She called his name Samuel, saying, "Because I have asked him of the Lord."',
      'For you: God hears honest prayers and remembers His children in His kind time.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['1 Samuel 3:10', '1 Samuel 1:1-20', 'Ruth 4', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: 1 Samuel 1:1-20.)'
      },
      {
        question: 'Where did they go year by year to worship?',
        choices: ['Nineveh only.', 'Shiloh — the house of the Lord.', 'Egypt.', 'No where.'],
        correctIndex: 1,
        correctFeedback: 'Right — a holy place for God\'s people.',
        wrongFeedback: 'Think yearly worship. (Answer: Shiloh….)'
      },
      {
        question: 'What did Hannah say she had poured out before the Lord?',
        choices: ['Her lunch.', 'Her soul.', 'Her shoes.', 'Nothing.'],
        correctIndex: 1,
        correctFeedback: 'Beautiful — honest prayer.',
        wrongFeedback: 'Listen for poured out. (Answer: Her soul….)'
      },
      {
        question: 'What did Eli tell Hannah?',
        choices: [
          'Go away forever.',
          'Go in peace: and the God of Israel grant thee thy petition.',
          'Stop praying.',
          'Run to Egypt.'
        ],
        correctIndex: 1,
        correctFeedback: 'Gentle — God heard.',
        wrongFeedback: 'Listen for peace and petition. (Answer: Go in peace….)'
      },
      {
        question: 'What did Hannah name her son, and why?',
        choices: [
          'David, for a king.',
          'Samuel — Because I have asked him of the LORD.',
          'Moses, for the sea.',
          'She left him unnamed.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — asked of the Lord.',
        wrongFeedback: 'Think gift and asking. (Answer: Samuel… Because I have asked him….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Hannah's Prayer with God's Word today.",
    takeaway:
      'Hannah poured out her soul honestly — Eli blessed her in peace — and the LORD remembered her.',
    prayer:
      'Lord, thank You that You hear when we pray with honest hearts. Thank You that You remember us. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces Hannah kneeling calmly at tabernacle hands folded in prayer gentle tears on cheeks Eli priest standing nearby kind face soft background tabernacle tent simple curtains soft sky tender hopeful mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Shiloh house of the Lord (1 sam 1)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text O LORD of hosts vow',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Poured out my soul',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Go in peace Samuel born'
    ],
    readAlongImages: []
  };
}

/** Samuel's dedication and Hannah's song — 1 Sam 1:21-28; 2:1-11, 18-21 (KJV). */
function buildSamuelBirthReadQuiz() {
  return {
    kjvRef: '1 Samuel 1:21-28; 2:1-11, 18-21 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'And the man Elkanah, and all his house, went up to offer unto the LORD the yearly sacrifice, and his vow. But Hannah went not up; for she said unto her husband, I will not go up until the child be weaned, and then I will bring him, that he may appear before the LORD, and there abide for ever. And Elkanah her husband said unto her, Do what seemeth thee good; tarry until thou have weaned him; only the LORD establish his word. So the woman abode, and gave her son suck until she weaned him. And when she had weaned him, she took him up with her, with three bullocks, and one ephah of flour, and a bottle of wine, and brought him unto the house of the LORD in Shiloh: and the child was young.',
        caption: 'Weaned — brought to the house of the Lord',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And they slew a bullock, and brought the child to Eli. And she said, Oh my lord, as thy soul liveth, my lord, I am the woman that stood by thee here, praying unto the LORD. For this child I prayed; and the LORD hath given me my petition which I asked of him: Therefore also I have lent him to the LORD; as long as he liveth he shall be lent to the LORD. And he worshipped the LORD there.',
        caption: 'For this child I prayed — lent to the Lord',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And Hannah prayed, and said, My heart rejoiceth in the LORD, mine horn is exalted in the LORD: my mouth is enlarged over mine enemies; because I rejoice in thy salvation. There is none holy as the LORD: for there is none beside thee: neither is there any rock like our God.',
        caption: 'My heart rejoiceth — none holy as the Lord',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'Talk no more so exceeding proudly; let not arrogancy come out of your mouth: for the LORD is a God of knowledge, and by him actions are weighed. The bows of the mighty men are broken, and they that stumbled are girded with strength. They that were full have hired out themselves for bread; and they that were hungry ceased: so that the barren hath born seven; and she that hath many children is waxed feeble.',
        caption: 'The Lord weighs the actions of all',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'The LORD killeth, and maketh alive: he bringeth down to the grave, and bringeth up. The LORD maketh poor, and maketh rich: he bringeth low, and lifteth up. He raiseth up the poor out of the dust, and lifteth up the beggar from the dunghill, to set them among princes, and to make them inherit the throne of glory: for the pillars of the earth are the LORD\'s, and he hath set the world upon them.',
        caption: 'He raiseth up the poor — the pillars are the Lord\'s',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'He will keep the feet of his saints, and the wicked shall be silent in darkness; for by strength shall no man prevail. The adversaries of the LORD shall be broken to pieces; out of heaven shall he thunder upon them: the LORD shall judge the ends of the earth; and he shall give strength unto his king, and exalt the horn of his anointed. And Elkanah went to Ramah to his house. And the child did minister unto the LORD before Eli the priest.',
        caption: 'Samuel ministers before Eli',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'But Samuel ministered before the LORD, being a child, girded with a linen ephod. Moreover his mother made him a little coat, and brought it to him from year to year, when she came up with her husband to offer the yearly sacrifice. And Eli blessed Elkanah and his wife, and said, The LORD give thee seed of this woman for the loan which is lent to the LORD. And they went unto their own home. And the LORD visited Hannah, so that she conceived, and bare three sons and two daughters. And the child Samuel grew before the LORD.',
        caption: 'A little coat each year — the Lord visited Hannah',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'When Samuel was weaned, Hannah remembered her promise to God. She took her little boy to the house of the Lord at Shiloh.',
      'Hannah said to Eli the priest, "For this child I prayed; and the Lord hath given me my petition which I asked of him. Therefore also I have lent him to the Lord; as long as he liveth he shall be lent to the Lord."',
      'Then Hannah prayed a beautiful prayer of thanks: "My heart rejoiceth in the Lord… there is none holy as the Lord."',
      'Hannah left Samuel with Eli to serve the Lord. Every year she made him a little coat and brought it when she came up with her husband to offer the yearly sacrifice.',
      'The Lord visited Hannah, and she had three more sons and two daughters. And the child Samuel grew on, and was in favour both with the Lord, and also with men.',
      'For you: God honors promises kept in love and blesses thankful hearts.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['1 Samuel 3', '1 Samuel 1:21-28; 2:1-11, 18-21', 'Ruth 1', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: 1 Samuel 1:21-28; 2:1-11, 18-21.)'
      },
      {
        question: 'What did Hannah say she had done with Samuel?',
        choices: [
          'Hidden him at home forever.',
          'Lent him to the Lord as long as he liveth.',
          'Sold him.',
          'Sent him to Egypt.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — she kept her vow.',
        wrongFeedback: 'Listen for lent. (Answer: Lent him to the Lord….)'
      },
      {
        question: 'How did Hannah begin her prayer of thanks?',
        choices: [
          'My heart is heavy.',
          'My heart rejoiceth in the LORD.',
          'I will not pray.',
          'Leave me alone.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — thankful worship.',
        wrongFeedback: 'Think rejoicing. (Answer: My heart rejoiceth….)'
      },
      {
        question: 'What did Hannah make for Samuel each year?',
        choices: ['A crown.', 'A little coat.', 'A chariot.', 'Nothing.'],
        correctIndex: 1,
        correctFeedback: 'Tender — a mother\'s faithful care.',
        wrongFeedback: 'Think yearly visit. (Answer: A little coat….)'
      },
      {
        question: 'After this, how did the Lord bless Hannah\'s home?',
        choices: [
          'She had no more children.',
          'She bare three sons and two daughters.',
          'They moved away.',
          'The story does not say.'
        ],
        correctIndex: 1,
        correctFeedback: 'God remembered her with kindness.',
        wrongFeedback: 'Listen for visited. (Answer: Three sons and two daughters….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samuel's dedication with God's Word today.",
    takeaway:
      'Hannah kept her promise — Samuel ministered before the Lord — and God visited her home with more children.',
    prayer:
      'Lord, thank You for Hannah\'s thankful heart. Help us keep our promises to You and trust Your kindness. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces Hannah standing calmly at tabernacle little Samuel beside her she holds small coat thankful joy Eli priest nearby gentle smile tabernacle curtains soft sky warm worshipful mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Lent to the Lord (1 sam 1)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text My heart rejoiceth',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Little coat year to year',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Samuel grew before the Lord'
    ],
    readAlongImages: []
  };
}

/** Samuel hears the Lord at night — 1 Samuel 3:1-21 (KJV). */
function buildSamuelCallsReadQuiz() {
  return {
    kjvRef: '1 Samuel 3:1-21 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'And the child Samuel ministered unto the LORD before Eli. And the word of the LORD was precious in those days; there was no open vision. And it came to pass at that time, when Eli was laid down in his place, and his eyes began to wax dim, that he could not see; And ere the lamp of God went out in the temple of the LORD, where the ark of God was, and Samuel was laid down to sleep;',
        caption: 'Night in the Lord\'s house — the lamp still burning',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'That the LORD called Samuel: and he answered, Here am I. And he ran unto Eli, and said, Here am I; for thou calledst me. And he said, I called not; lie down again. And he went and lay down. And the LORD called yet again, Samuel. And Samuel arose and went to Eli, and said, Here am I; for thou didst call me. And he answered, I called not, my son; lie down again. Now Samuel did not yet know the LORD, neither was the word of the LORD yet revealed unto him.',
        caption: 'Samuel runs to Eli — I called not; lie down again',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And the LORD called Samuel again the third time. And he arose and went to Eli, and said, Here am I; for thou didst call me. And Eli perceived that the LORD had called the child. Therefore Eli said unto Samuel, Go, lie down: and it shall be, if he call thee, that thou shalt say, Speak, LORD; for thy servant heareth. So Samuel went and lay down in his place. And the LORD came, and stood, and called as at other times, Samuel, Samuel. Then Samuel answered, Speak; for thy servant heareth.',
        caption: 'Speak, LORD — Speak; for thy servant heareth',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And the LORD said to Samuel, Behold, I will do a thing in Israel, at which both the ears of every one that heareth it shall tingle. In that day I will perform against Eli all things which I have spoken concerning his house: when I begin, I will also make an end. For I have told him that I will judge his house for ever for the iniquity which he knoweth; because his sons made themselves vile, and he restrained them not. And therefore I have sworn unto the house of Eli, that the iniquity of Eli\'s house shall not be purged with sacrifice nor offering for ever.',
        caption: 'The Lord speaks — a heavy word for Eli\'s house',
        image: 'panel-david-3.svg'
      },
      {
        text:
          'And Samuel lay until the morning, and opened the doors of the house of the LORD. And Samuel feared to shew Eli the vision. Then Eli called Samuel, and said, Samuel, my son. And he answered, Here am I. And he said, What is the thing that the LORD hath said unto thee? I pray thee hide it not from me: God do so to thee, and more also, if thou hide any thing from me of all the things that he said unto thee. And Samuel told him every whit, and hid nothing from him. And he said, It is the LORD: let him do what seemeth him good.',
        caption: 'Morning — Samuel tells Eli every word',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And Samuel grew, and the LORD was with him, and did let none of his words fall to the ground. And all Israel from Dan even to Beersheba knew that Samuel was established to be a prophet of the LORD. And the LORD appeared again in Shiloh: for the LORD revealed himself to Samuel in Shiloh by the word of the LORD.',
        caption: 'Samuel grew — the Lord was with him',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'The word of the Lord was precious in those days; there was no open vision. Samuel was a young boy ministering to the Lord before Eli.',
      'One night Eli was lying down in his place, and Samuel was lying down in the temple of the Lord. The Lord called, "Samuel, Samuel!"',
      'Samuel thought it was Eli and ran to him, saying, "Here am I; for thou calledst me." Eli said, "I called not; lie down again."',
      'This happened three times. Then Eli understood that the Lord was calling the child. He said to Samuel, "Go, lie down: and it shall be, if he call thee, that thou shalt say, Speak, Lord; for thy servant heareth."',
      'So Samuel went and lay down in his place. The Lord came and stood, and called as at other times, "Samuel, Samuel!" Then Samuel answered, "Speak; for thy servant heareth."',
      'The Lord told Samuel things that would happen in Israel. And Samuel grew, and the Lord was with him, and did let none of his words fall to the ground.',
      'For you: God calls us by name in His Word — we can answer with a quiet heart, "Speak, Lord; for thy servant heareth."'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['1 Samuel 16', '1 Samuel 3:1-21', 'Ruth 2', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: 1 Samuel 3:1-21.)'
      },
      {
        question: 'At first, whom did Samuel think was calling him?',
        choices: ['King Saul.', 'Eli the priest.', 'His mother Hannah.', 'A lion.'],
        correctIndex: 1,
        correctFeedback: 'Yes — he ran to Eli each time.',
        wrongFeedback: 'Think who he ran to. (Answer: Eli….)'
      },
      {
        question: 'What did Eli tell Samuel to say if the Lord called again?',
        choices: [
          'Go away.',
          'Speak, LORD; for thy servant heareth.',
          'I am afraid.',
          'I will not listen.'
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — a listening heart.',
        wrongFeedback: 'Listen for servant heareth. (Answer: Speak, LORD….)'
      },
      {
        question: 'How did Samuel answer when the Lord called, "Samuel, Samuel!" the last time?',
        choices: [
          'I will not come.',
          'Speak; for thy servant heareth.',
          'Who is there?',
          'I am sleeping.'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes — exactly as Eli taught him.',
        wrongFeedback: 'Think short answer. (Answer: Speak; for thy servant heareth….)'
      },
      {
        question: 'How did the Lord bless Samuel as he grew?',
        choices: [
          'He forgot him.',
          'The LORD was with him, and did let none of his words fall to the ground.',
          'He sent him home forever.',
          'The story does not say.'
        ],
        correctIndex: 1,
        correctFeedback: 'God kept every word Samuel spoke as His prophet.',
        wrongFeedback: 'Listen for grew. (Answer: The LORD was with him….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading Samuel's night call with God's Word today.",
    takeaway:
      'God called Samuel by name — Eli helped him listen — and Samuel learned to answer, Speak, LORD; for thy servant heareth.',
    prayer:
      'Lord, thank You that You speak in Your Word. Help us listen with quiet hearts and answer You faithfully. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces young Samuel lying calmly in bed at night inside tabernacle soft light rays gently from above Eli kind face in doorway gentle stars simple walls wonder listening mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Here am I (1 sam 3)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Speak LORD for thy servant heareth',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Samuel Samuel called',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text The LORD was with him'
    ],
    readAlongImages: []
  };
}

/** David anointed at Bethlehem — 1 Samuel 16:1-13 (KJV). */
function buildDavidAnointedReadQuiz() {
  return {
    kjvRef: '1 Samuel 16:1-13 (KJV)',
    readAlongTitle: 'Read along',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    readAlongSections: [
      {
        text:
          'And the LORD said unto Samuel, How long wilt thou mourn for Saul, seeing I have rejected him from reigning over Israel? fill thine horn with oil, and go, I will send thee to Jesse the Bethlehemite: for I have provided me a king among his sons. And Samuel said, How can I go? if Saul hear it, he will kill me. And the LORD said, Take an heifer with thee, and say, I am come to sacrifice to the LORD. And call Jesse to the sacrifice, and I will shew thee what thou shalt do: and thou shalt anoint unto me him whom I name unto thee. And Samuel did that which the LORD spake, and came to Bethlehem. And the elders of the town trembled at his coming, and said, Comest thou peaceably? And he said, Peaceably: I am come to sacrifice unto the LORD: sanctify yourselves, and come with me to the sacrifice. And he sanctified Jesse and his sons, and called them to the sacrifice.',
        caption: 'Fill thine horn with oil — come to Jesse at Bethlehem',
        image: 'panel-david-1.svg'
      },
      {
        text:
          'And it came to pass, when they were come, that he looked on Eliab, and said, Surely the LORD\'s anointed is before him. But the LORD said unto Samuel, Look not on his countenance, or on the height of his stature; because I have refused him: for the LORD seeth not as man seeth; for man looketh on the outward appearance, but the LORD looketh on the heart. Then Jesse called Abinadab, and made him pass before Samuel. And he said, Neither hath the LORD chosen this. Then Jesse made Shammah to pass by. And he said, Neither hath the LORD chosen this. Again, Jesse made seven of his sons to pass before Samuel. And Samuel said unto Jesse, The LORD hath not chosen these.',
        caption: 'The LORD looketh on the heart — not these seven',
        image: 'panel-david-2.svg'
      },
      {
        text:
          'And Samuel said unto Jesse, Are here all thy children? And he said, There remaineth yet the youngest, and, behold, he keepeth the sheep. And Samuel said unto Jesse, Send and fetch him: for we will not sit down till he come hither. And he sent, and brought him in. Now he was ruddy, and withal of a beautiful countenance, and goodly to look to. And the LORD said, Arise, anoint him: for this is he. Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the LORD came upon David from that day forward. So Samuel rose up, and went to Ramah.',
        caption: 'The youngest from the sheep — anointed; the Spirit came on David',
        image: 'panel-david-3.svg'
      }
    ],
    paragraphs: [
      'The Lord said to Samuel, "Fill thine horn with oil, and go… unto Jesse the Bethlehemite: for I have provided me a king among his sons."',
      'Samuel came to Bethlehem and called Jesse and his sons to the sacrifice. Seven of Jesse\'s sons passed before Samuel, but the Lord said, "Look not on his countenance, or on the height of his stature… for the Lord seeth not as man seeth; for man looketh on the outward appearance, but the Lord looketh on the heart."',
      'Jesse had one more son — the youngest, who was out keeping the sheep. They sent and brought him in. He was ruddy, with bright eyes, and goodly to look upon.',
      'The Lord said, "Arise, anoint him: for this is he." Then Samuel took the horn of oil and anointed David in the midst of his brethren. And the Spirit of the Lord came upon David from that day forward.',
      'For you: God sees the heart. You can trust His kind choice — even when His ways surprise us.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'Where is this story found in the Bible?',
        choices: ['1 Samuel 17', '1 Samuel 16:1-13', 'Ruth 1', 'Psalm 23'],
        correctIndex: 1,
        correctFeedback: "Yes—that matches this story's place in God's Word.",
        wrongFeedback: 'Skim the Bible line under the title. (Answer: 1 Samuel 16:1-13.)'
      },
      {
        question: 'Whose family did Samuel visit with the horn of oil?',
        choices: ['Pharaoh\'s house.', 'Jesse the Bethlehemite.', 'Goliath\'s army.', 'Eli\'s house only.'],
        correctIndex: 1,
        correctFeedback: 'Yes — Bethlehem and Jesse\'s sons.',
        wrongFeedback: 'Think Bethlehem. (Answer: Jesse….)'
      },
      {
        question: 'What did the Lord tell Samuel about choosing?',
        choices: [
          'Choose the tallest only.',
          'Man looketh on the outward appearance, but the LORD looketh on the heart.',
          'Do not anoint anyone.',
          'Pick the oldest son always.'
        ],
        correctIndex: 1,
        correctFeedback: 'God sees what people often miss.',
        wrongFeedback: 'Listen for heart. (Answer: …looketh on the heart….)'
      },
      {
        question: 'Where was Jesse\'s youngest son before they brought him?',
        choices: ['In the palace.', 'Keeping the sheep.', 'In Egypt.', 'Hiding in a cave.'],
        correctIndex: 1,
        correctFeedback: 'Faithful in a small place — then called forward.',
        wrongFeedback: 'Think flock. (Answer: Keeping the sheep….)'
      },
      {
        question: 'What came upon David when Samuel anointed him?',
        choices: [
          'Nothing changed.',
          'The Spirit of the LORD came upon David from that day forward.',
          'He ran away.',
          'The story does not say.'
        ],
        correctIndex: 1,
        correctFeedback: 'God marked His chosen king in a holy way.',
        wrongFeedback: 'Listen for Spirit. (Answer: The Spirit of the LORD….)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job reading David's anointing with God's Word today.",
    takeaway:
      'God looked on the heart — the youngest keeper of sheep was the one the Lord named — and His Spirit came on David.',
    prayer:
      'Lord, thank You that You see our hearts. Help us trust You when Your ways are surprising. Amen.',
    imagePrompts: [
      'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces young David standing calmly middle of brothers Samuel holds horn of oil gently pouring on David head David humble bright-eyed face older brothers stand quietly around thick robes soft Bethlehem hills background wonder humble mood minimal plenty white space ages 3-8 coloring page',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Fill thine horn with oil (1 sam 16)',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text LORD looketh on the heart',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Arise anoint him for this is he',
      'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Spirit of the LORD upon David'
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
  samson: buildSamsonPillarsReadQuiz(),
  ruthNaomi: buildRuthNaomiReadQuiz(),
  ruthBoaz: buildRuthBoazReadQuiz(),
  ruthThreshing: buildRuthThreshingReadQuiz(),
  ruthRedemption: buildRuthRedemptionReadQuiz(),
  hannahPrayer: buildHannahPrayerReadQuiz(),
  samuelBirth: buildSamuelBirthReadQuiz(),
  samuelCalls: buildSamuelCallsReadQuiz(),
  samuelCall: buildSamuelCallsReadQuiz(),
  davidAnointed: buildDavidAnointedReadQuiz(),
  samuelAnointsDavid: buildDavidAnointedReadQuiz(),
  davidJonathan: davidJonathanReadQuizPack,
  davidJonathanFriendship: davidJonathanReadQuizPack,
  davidCave: davidCaveReadQuizPack,
  davidAbigail: davidAbigailReadQuizPack,
  abigailWise: davidAbigailReadQuizPack,
  psalm23: psalm23ReadQuizPack,
  psalm23Shepherd: psalm23ReadQuizPack,
  davidHarp: davidHarpReadQuizPack,
  davidKing: davidKingReadQuizPack,
  solomonWisdom: solomonWisdomReadQuizPack,
  solomonTwoMothers: solomonTwoMothersReadQuizPack,
  solomonTemple: solomonTempleReadQuizPack,
  elijahRavens: elijahRavensReadQuizPack,
  elijahWidow: elijahWidowReadQuizPack,
  elijahFire: elijahFireCarmelReadQuizPack,
  elijahHoreb: elijahHorebReadQuizPack,
  elijahElijahElisha: elijahCallsElishaReadQuizPack,
  elijahChariot: elijahChariotReadQuizPack,
  elishaMiracles: elishaMiraclesReadQuizPack,
  elishaOil: elishaOilReadQuizPack,
  elishaShunammite: elishaShunammiteReadQuizPack,
  naamanHealed: naamanHealedReadQuizPack,
  naamanDip: naamanHealedReadQuizPack,
  naaman: naamanHealedReadQuizPack,
  elishaFloatingAxe: elishaFloatingAxeReadQuizPack,
  elishaChariots: elishaChariotsReadQuizPack
};
