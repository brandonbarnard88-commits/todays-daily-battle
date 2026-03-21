'use strict';

/** Shared read+quiz for both Jericho library cards (same event, Joshua 6). */
function buildJerichoReadQuiz() {
  return {
    kjvRef: 'Joshua 6',
    hintAboveQuiz: 'Use the comic pictures above while you read.',
    paragraphs: [
      'God told Joshua and His people to take the city of Jericho. The walls were very tall and strong.',
      'God said, "March around the city once each day for six days. On the seventh day, march seven times."',
      'The people obeyed God. They marched quietly with priests carrying the ark and blowing trumpets.',
      'On the seventh day, after marching seven times, Joshua shouted, "Shout! The Lord has given you the city!"',
      'The people shouted loud. The walls fell down flat! God gave them the victory because they trusted and obeyed Him.'
    ],
    quizHeading: 'Quiz — think it through',
    questions: [
      {
        question: 'What did God tell Joshua to do with the city of Jericho?',
        choices: [
          'Attack it with swords right away',
          'March around it for seven days',
          'Climb the walls',
          'Wait for the walls to fall by themselves'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes! God had a special plan — marching and trusting Him.',
        wrongFeedback:
          "Not quite. God didn't say to fight with swords or climb. He told Joshua to march around the city quietly for six days, then seven times on the seventh day. That showed obedience! (Answer: March around it for seven days.)"
      },
      {
        question: 'For the first six days, how many times did God tell them to march around Jericho each day?',
        choices: [
          'Once each day',
          'Seven times each day',
          'They stayed in their tents',
          'They climbed the walls at night'
        ],
        correctIndex: 0,
        correctFeedback: 'Right — one lap a day built trust before the big seventh day.',
        wrongFeedback:
          'Count the days in the story: six days of the same rhythm, then a different plan on day seven. Reread paragraph two. (Answer: Once each day.)'
      },
      {
        question: 'What happened to the walls when the people shouted?',
        choices: [
          'They got taller',
          'They turned to glass',
          'Nothing happened',
          'They fell down flat'
        ],
        correctIndex: 3,
        correctFeedback: 'Yes! God did what only He can do — the walls came down.',
        wrongFeedback:
          'Picture the ending: did the city stay sealed up, or did God open the way? Check the last paragraph. (Answer: They fell down flat.)'
      },
      {
        question: 'While the people marched, who carried the ark and blew trumpets?',
        choices: [
          'Only Joshua, alone',
          'Random soldiers with drums',
          'The priests',
          'No one — they left everything behind'
        ],
        correctIndex: 2,
        correctFeedback: "Exactly — worship and God's presence went first.",
        wrongFeedback:
          'Look for who walked with the ark and who made the trumpet sound in paragraph three. (Answer: The priests.)'
      },
      {
        question: 'Why did God give Israel the victory at Jericho?',
        choices: [
          'Because the walls were already cracked',
          'Because they trusted and obeyed God',
          'Because they had the biggest army in the world',
          "Because they did not need God's help"
        ],
        correctIndex: 1,
        correctFeedback: 'Beautiful — obedience and trust please God more than our own ideas.',
        wrongFeedback:
          'Ask: did they win by sneaking, or by doing the odd thing God said? Reread the last line of the story. (Answer: Because they trusted and obeyed God.)'
      }
    ],
    doneHeading: 'You did it!',
    doneMessage: "Great job walking through Jericho with God's Word today.",
    takeaway: 'Obeying God brings victory — even when things look impossible!',
    prayer: "God, help me obey You even when I don't understand the plan. Amen.",
    imagePrompts: [
      'Bright bouncy cartoon for kids: Israelite army marching around tall Jericho walls, priests with trumpets and ark, sunny day, no text',
      'Kid cartoon style: Joshua leading people quietly around city walls, serious faces, dust on ground, no text',
      'Colorful Bible illustration for children: seventh day march, people circling walls seven times, trumpets blowing, excitement building',
      "Fun bouncy scene: huge Jericho walls falling down flat, Israelites shouting in joy, dust cloud, God's power shown",
      'Happy ending cartoon: Israelites entering Jericho, smiling, praising God, bright colors, no text'
    ],
    readAlongImages: []
  };
}

module.exports = {
    david: {
      kjvRef: '1 Samuel 17',
      hintAboveQuiz: 'Use the comic pictures above while you read.',
      paragraphs: [
        "God's army and the Philistine army faced each other across a valley. Every day a huge warrior named Goliath came out. He shouted for someone to fight him. God's soldiers felt afraid.",
        'David was young. He was bringing food to his brothers when he heard Goliath. David loved God. He said someone should stand up for God\'s people.',
        'King Saul\'s armor was too big for David, so David took it off. He picked up five smooth stones from the brook and his sling. He trusted God—not the spear or sword.',
        'David ran toward Goliath. He said he came in the name of the Lord of hosts. He put one stone in the sling, swung it, and let it fly. The stone hit Goliath. The giant fell. God gave the victory.',
        'David won because God was with him—not because he was the tallest or the strongest. The Bible says, "The battle is the Lord\'s" (1 Samuel 17:47, KJV). When something in your life feels like a giant, you can pray and trust God too.'
      ],
      quizHeading: 'Quiz — think it through',
      questions: [
        {
          question: "Who was the giant that scared God's people?",
          choices: ['Saul', 'Goliath', 'David', 'Samuel'],
          correctIndex: 1,
          correctFeedback: 'Yes! Goliath was the giant. He was loud and scary, but God was bigger.',
          wrongFeedback: "Not quite. Ask yourself: who walked out every day and dared someone to fight? Reread the first paragraph, then try again. (If you're stuck: the answer is Goliath.)"
        },
        {
          question: 'What did David trust when he went to fight?',
          choices: ['His own strength only', "God's help", "The king's armor only", 'Running away'],
          correctIndex: 1,
          correctFeedback: "Right! David trusted the Lord. He even said the battle belonged to God.",
          wrongFeedback: "Think about what David said about God's name—and why he took off Saul's heavy armor. Which choice shows trust in God? Try again. (Answer: God's help.)"
        },
        {
          question: 'How many smooth stones did David take from the brook?',
          choices: ['One', 'Three', 'Five', 'Ten'],
          correctIndex: 2,
          correctFeedback: 'Correct—five stones. God guided one stone to do the job.',
          wrongFeedback: 'Look for the number in the story where David stops at the brook. Count what he picked up, then choose again. (Answer: five.)'
        },
        {
          question: 'What happened when David used his sling?',
          choices: ['The stone missed', 'Goliath caught the stone', 'The stone hit Goliath', 'Goliath ran away first'],
          correctIndex: 2,
          correctFeedback: 'Yes! The stone hit Goliath. God gave the victory.',
          wrongFeedback: 'Picture the scene: one stone, one swing. What does the story say happened next? Check the paragraph about the sling. (Answer: The stone hit Goliath.)'
        },
        {
          question: 'Why did David win?',
          choices: ['He was taller than Goliath', 'He had the best sword', 'God was with him', 'The army fought for him first'],
          correctIndex: 2,
          correctFeedback: "Perfect! The battle is the Lord's. God was with David.",
          wrongFeedback: "David was small. His sling was simple. What did David say about whose battle it was? Reread the last paragraph. (Answer: God was with him.)"
        }
      ],
      doneHeading: 'You did it!',
      doneMessage: 'Great job thinking through God\'s story today.',
      takeaway: 'God is stronger than anything that scares us. You can talk to Him anytime.',
      prayer: 'God, when I feel small or afraid, help me trust You like David. Amen.',
      imagePrompts: [
        'Hand-drawn bouncy cartoon: young shepherd boy with sling on a green hill, army tents in distance, bright sky, kid-safe, no text.',
        'Hand-drawn bouncy cartoon: very tall armored warrior shouting across a valley, small boy watching bravely, colorful, no text.',
        'Hand-drawn bouncy cartoon: boy choosing smooth stones by a brook, wooden sling, peaceful stream, no text.',
        'Hand-drawn bouncy cartoon: boy with sling mid-action, stone flying toward giant silhouette (not graphic), golden light, no text.',
        'Hand-drawn bouncy cartoon: boy raising hands in thanks on a hillside, soft sunset, peaceful smile, no text.'
      ]
    },
    noah: {
      kjvRef: 'Genesis 6–9',
      hintAboveQuiz: 'Use the comic pictures above while you read.',
      paragraphs: [
        'Long ago, many people stopped obeying God. Their hearts were full of wrong choices. God was sad, but one man walked with God—Noah. God told Noah to build a huge boat called an ark. It had to be strong enough for a great storm.',
        'Noah obeyed, even when it took a long time and other people may have laughed. God said animals would come—two of every kind, male and female—and Noah\'s family would be safe inside. When everything was ready, God told them to enter. Then God shut the door.',
        'Rain fell. Water rose. The whole earth that people could see was covered with water. But inside the ark, Noah, his family, and the animals floated safely. God remembered Noah. The water went down little by little.',
        'Noah sent out a dove. The first time it found nowhere to rest. Later it brought back an olive leaf—plants were growing again! When the ground was dry, God told them to come out. Noah worshiped God with a thankful heart.',
        'God put a rainbow in the sky as a sign: He would never flood the whole world that way again. The rainbow reminds us that God keeps His promises. "I do set my bow in the cloud, and it shall be for a token of a covenant between me and the earth" (Genesis 9:13, KJV).'
      ],
      quizHeading: 'Quiz — think it through',
      questions: [
        {
          question: 'Who obeyed God and built the ark?',
          choices: ['Moses', 'Noah', 'Jonah', 'David'],
          correctIndex: 1,
          correctFeedback: 'Yes! Noah walked with God and did what God said, even when it was hard.',
          wrongFeedback: 'Think: who spent years building a big boat before the flood? Reread the first two paragraphs. (Answer: Noah.)'
        },
        {
          question: 'How did the animals come to the ark?',
          choices: ['Noah had to catch every animal alone', 'Two by two, as God sent them', 'They flew in on balloons', 'They stayed outside in the rain'],
          correctIndex: 1,
          correctFeedback: 'Right! God sent the animals. Noah trusted God to bring them.',
          wrongFeedback: 'Look for how the pairs came—did Noah trap them all by himself? Check the paragraph about obeying and entering the ark. (Answer: Two by two, as God sent them.)'
        },
        {
          question: 'What did Noah send out to see if the earth was drying?',
          choices: ['A kite', 'A dove', 'A paper airplane', 'A fish'],
          correctIndex: 1,
          correctFeedback: 'Yes! The dove brought back an olive leaf—new life was growing.',
          wrongFeedback: 'Which bird helped Noah know plants were coming back? Skim the paragraph after the flood. (Answer: A dove.)'
        },
        {
          question: 'What sign did God put in the sky after the flood?',
          choices: ['A shooting star', 'A rainbow', 'A big kite', 'Lightning only'],
          correctIndex: 1,
          correctFeedback: 'Beautiful! The rainbow is God\'s promise token—He keeps His word.',
          wrongFeedback: 'What colorful arc appears after rain today—and what did God "set in the cloud"? Read the last paragraph. (Answer: A rainbow.)'
        },
        {
          question: 'What is one big lesson from Noah\'s story?',
          choices: ['We never need to obey parents', 'God keeps His promises—and we can obey Him even when others do not', 'Boats are scary', 'Rainbows are only decoration'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Obedience and God\'s faithfulness go together.',
          wrongFeedback: 'Ask: what does the rainbow teach about God? What did Noah do when God spoke? Reread the ending. (Answer: God keeps His promises—and we can obey Him even when others do not.)'
        }
      ],
      doneHeading: 'You did it!',
      doneMessage: 'Great job walking through Noah\'s story with God.',
      takeaway: 'When God asks you to obey, you can say yes—even if it takes time. God remembers you.',
      prayer: 'God, help me obey You like Noah, and help me remember Your promises. Amen.',
      imagePrompts: [
        'Hand-drawn bouncy cartoon: bearded man with hammer and wood planks building a huge wooden ark, sunny day, animals peeking in background, kid-safe, no text.',
        'Hand-drawn bouncy cartoon: pairs of friendly animals (elephants, lions, birds) walking up a ramp into a big boat, colorful, no text.',
        'Hand-drawn bouncy cartoon: ark floating on blue water with rain clouds above, small window light warm inside, not scary, no text.',
        'Hand-drawn bouncy cartoon: dove carrying a green olive branch flying toward a man on dry ground, smile, hope, no text.',
        'Hand-drawn bouncy cartoon: bright rainbow over green hills, happy family and animals nearby, peaceful, no text.'
      ]
    },
    jonah: {
      kjvRef: 'Jonah 1–3',
      hintAboveQuiz: 'Use the comic pictures above while you read.',
      paragraphs: [
        'God told His prophet Jonah, "Go to Nineveh and tell the people to turn from their wrong ways." Nineveh was a big city, and Jonah did not want to go. Instead, he bought a ticket and sailed the opposite direction.',
        'God sent a powerful storm. The sailors were afraid. Jonah said the storm was because he had run from God—throw me into the sea, he said, so you can be safe. They tried rowing harder first, then they did as he asked.',
        'God prepared a great fish. It swallowed Jonah. Inside that dark place for three days and three nights, Jonah prayed. He thanked God and said he would obey. God spoke to the fish, and it spit Jonah out onto dry land.',
        'God spoke again: Go to Nineveh. This time Jonah went. He walked through the city and said God would judge their evil. The people—from the king to the common folk—believed God. They fasted, prayed, and turned from their wrong.',
        'God showed mercy. Jonah learned (the hard way) that God cares about people who need a second chance—including us when we say sorry and turn back to Him.'
      ],
      quizHeading: 'Quiz — think it through',
      questions: [
        {
          question: 'Where did God first send Jonah to preach?',
          choices: ['Jerusalem', 'Nineveh', 'Egypt', 'Babylon'],
          correctIndex: 1,
          correctFeedback: 'Yes! Nineveh was the city God cared about.',
          wrongFeedback: 'Look at the very first sentence—what city name does God say? (Answer: Nineveh.)'
        },
        {
          question: 'How did Jonah try to run away?',
          choices: ['He hid in a cave', 'He took a ship going the other way', 'He rode a camel east', 'He stayed home silently'],
          correctIndex: 1,
          correctFeedback: 'Right—Jonah went to sea instead of obeying.',
          wrongFeedback: 'Did Jonah walk to the city—or pay to go somewhere else? Reread paragraph one. (Answer: He took a ship going the other way.)'
        },
        {
          question: 'What did God send when Jonah was at sea?',
          choices: ['A calm breeze', 'A great storm', 'A parade', 'Snow'],
          correctIndex: 1,
          correctFeedback: 'Yes! The storm got everyone\'s attention.',
          wrongFeedback: 'What made the sailors so scared on the boat? Check paragraph two. (Answer: A great storm.)'
        },
        {
          question: 'How long was Jonah inside the great fish?',
          choices: ['One hour', 'Three days and three nights', 'One year', 'Three minutes'],
          correctIndex: 1,
          correctFeedback: 'Correct—that matches what Jonah prayed through.',
          wrongFeedback: 'Search the story for "three" near the fish. (Answer: Three days and three nights.)'
        },
        {
          question: 'What did the people of Nineveh do when they heard God\'s warning?',
          choices: ['They laughed and ignored Jonah', 'They believed God and turned from their wrong', 'They chased Jonah out', 'They built more ships'],
          correctIndex: 1,
          correctFeedback: 'Wonderful—they repented, and God showed mercy.',
          wrongFeedback: 'Read the paragraph about Jonah walking through the city—did they mock him or change? (Answer: They believed God and turned from their wrong.)'
        }
      ],
      doneHeading: 'You did it!',
      doneMessage: 'Great job following Jonah\'s story about obeying and second chances.',
      takeaway: 'When we run from what God asks, He can still reach us. Saying sorry and obeying is brave.',
      prayer: 'God, when I want to run away, turn my heart back to You. Help me obey. Amen.',
      imagePrompts: [
        'Hand-drawn bouncy cartoon: prophet-looking man sneaking toward a wooden ship with luggage, city behind him, colorful, no text.',
        'Hand-drawn bouncy cartoon: stormy waves, worried sailors on deck, big waves, not too scary, no text.',
        'Hand-drawn bouncy cartoon: big friendly fish shape (not scary) with prayer hands silhouette inside, underwater light, no text.',
        'Hand-drawn bouncy cartoon: same man walking through ancient city street with simple robe, people listening, no text.',
        'Hand-drawn bouncy cartoon: king on throne looking humble, people praying, soft light, hopeful mood, no text.'
      ]
    },
    daniel: {
      kjvRef: 'Daniel 6',
      hintAboveQuiz: 'Use the comic pictures above while you read.',
      paragraphs: [
        'Daniel loved God and had served King Darius faithfully. Jealous leaders tricked the king into making a law: for thirty days, no one could pray to anyone except the king—or they would be thrown to the lions.',
        'Daniel knew the law, but he also knew God came first. He went home, opened his window toward Jerusalem, and prayed three times a day like he always had. He did not hide.',
        'The men caught Daniel praying and told the king. The king liked Daniel, but the law could not be changed. Daniel was thrown into a den of hungry lions. A stone was placed over the door.',
        'The king could not sleep. At dawn he ran to the den and called, "Daniel, servant of the living God, hath thy God delivered thee?" Daniel answered that God had sent His angel and shut the lions\' mouths—they had not hurt him, because he was innocent before God.',
        'King Darius told everyone to respect Daniel\'s God—the God who delivers and saves. Daniel\'s brave faith reminds us: obey God first, even when rules feel scary. God can shut the "lions" we fear.'
      ],
      quizHeading: 'Quiz — think it through',
      questions: [
        {
          question: 'Why was Daniel thrown into the lions\' den?',
          choices: ['He stole from the king', 'He kept praying to God even when a law said not to', 'He was mean to animals', 'He forgot to go to work'],
          correctIndex: 1,
          correctFeedback: 'Yes! Daniel obeyed God instead of the wrong law.',
          wrongFeedback: 'What was the new rule about prayer—and what did Daniel still do openly? Reread paragraphs one and two. (Answer: He kept praying to God even when a law said not to.)'
        },
        {
          question: 'What did Daniel do every day at home?',
          choices: ['He hid under his bed', 'He prayed with his window open toward Jerusalem', 'He only ate dessert', 'He wrote letters to lions'],
          correctIndex: 1,
          correctFeedback: 'Right—his habit was to pray honestly to God.',
          wrongFeedback: 'Find the sentence about his window and Jerusalem. (Answer: He prayed with his window open toward Jerusalem.)'
        },
        {
          question: 'Who shut the lions\' mouths so Daniel was safe?',
          choices: ['The king sneaked in at night', "God sent His angel", 'Daniel sang them to sleep with a lullaby', 'The lions were not real'],
          correctIndex: 1,
          correctFeedback: 'Exactly—Daniel said God sent His angel (Daniel 6:22, KJV).',
          wrongFeedback: 'What does Daniel tell the king about his protection? Look at his answer from inside the den. (Answer: God sent His angel.)'
        },
        {
          question: 'How did the king feel before morning?',
          choices: ['He slept peacefully', 'He worried and could not rest', 'He threw a party', 'He forgot about Daniel'],
          correctIndex: 1,
          correctFeedback: 'Yes—the king cared and hurried to the den at dawn.',
          wrongFeedback: 'Read the sentence that starts the night after Daniel was thrown in. (Answer: He worried and could not rest.)'
        },
        {
          question: 'What is one lesson for us from Daniel?',
          choices: ['Pray only when it is easy', 'We can obey God first, even when we are afraid', 'Lions are pets', 'Laws never matter'],
          correctIndex: 1,
          correctFeedback: 'Beautiful—faith sometimes means courage, and God is with us.',
          wrongFeedback: 'Think: did Daniel hide his faith or show it? Who helped him in the den? (Answer: We can obey God first, even when we are afraid.)'
        }
      ],
      doneHeading: 'You did it!',
      doneMessage: 'Great job learning from Daniel\'s courage.',
      takeaway: 'God sees you when you choose to do right. You can pray like Daniel—openly and honestly.',
      prayer: 'God, help me do right even when I feel scared, and thank You for being with me. Amen.',
      imagePrompts: [
        'Hand-drawn bouncy cartoon: man with peaceful face praying by an open window, soft morning light, simple room, no text.',
        'Hand-drawn bouncy cartoon: worried officials pointing, kind king looking conflicted, scroll with law, no text.',
        'Hand-drawn bouncy cartoon: stone rolled over cave-like den opening, lions silhouettes inside (not gory), dusk, no text.',
        'Hand-drawn bouncy cartoon: king at opening calling down, man inside unharmed among resting lions, gentle style, no text.',
        'Hand-drawn bouncy cartoon: man standing thankful at sunrise, lion napping peacefully behind him, golden light, no text.'
      ]
    },
    fallOfJericho: buildJerichoReadQuiz(),
    jerichoWalls: buildJerichoReadQuiz(),
    jesusCalmsStorm: {
      kjvRef: 'Mark 4:39',
      hintAboveQuiz: 'Use the comic pictures above while you read.',
      readAlongImages: [],
      paragraphs: [
        'Jesus and His disciples crossed the lake in a boat. Jesus was tired, so He slept on a cushion. The sky grew dark. Wind screamed. Waves slapped the boat, and water began to fill it.',
        'The disciples had seen storms before, but this one felt deadly. They shook Jesus awake. "Master, carest thou not that we perish?" They really thought they might drown.',
        'Jesus stood up in the rocking boat. He spoke to the wind and to the waves. In the King James Bible His words are: "Peace, be still" (Mark 4:39, KJV). The wind stopped. The water went flat, as if Someone huge had hushed the whole lake.',
        'Jesus turned to His friends. "Why are ye so fearful? how is it that ye have no faith?" He was not mean—He was teaching them. The storm obeyed Him because He is God the Son. Nothing is stronger than His voice.',
        'The disciples whispered with wonder, "What manner of man is this, that even the wind and the sea obey him?" For you: when your heart feels stormy—worried, loud, shaky—tell Jesus. He is right there. He can bring peace inside you too.'
      ],
      quizHeading: 'Quiz — think it through',
      questions: [
        {
          question: 'What was happening to the boat while Jesus slept?',
          choices: [
            'The lake was perfectly calm',
            'A fierce storm tossed the boat and water came in',
            'The disciples were fishing for dinner',
            'They had already reached the other shore'
          ],
          correctIndex: 1,
          correctFeedback: 'Yes—the storm was real danger, not a small sprinkle.',
          wrongFeedback:
            'Picture the first paragraph: wind, waves, and water in the boat. Which choice matches that? (Answer: A fierce storm tossed the boat and water came in.)'
        },
        {
          question: 'What did Jesus say to the wind and the waves?',
          choices: ['Row harder!', 'Peace, be still', 'Find another boat!', 'We should turn back now'],
          correctIndex: 1,
          correctFeedback: "Right—that's what Mark records in the KJV—and the storm listened.",
          wrongFeedback:
            'Look at the sentence with the quote from Mark 4:39. What two short words did Jesus speak? (Answer: Peace, be still.)'
        },
        {
          question: 'What happened right after Jesus spoke?',
          choices: [
            'The storm grew worse',
            'The wind stopped and there was a great calm',
            'The disciples jumped overboard',
            'Nothing changed at all'
          ],
          correctIndex: 1,
          correctFeedback: 'Exactly—nature obeys its Maker.',
          wrongFeedback:
            'Reread paragraph three after the words "Peace, be still." Did it stay wild or become quiet? (Answer: The wind stopped and there was a great calm.)'
        },
        {
          question: 'What did Jesus ask His disciples about next?',
          choices: [
            'Whether they had packed enough food',
            'Why they were so fearful and why they had so little faith',
            'Who should steer the boat',
            'If they wanted to go home'
          ],
          correctIndex: 1,
          correctFeedback: 'Yes—He wanted them to trust Him in scary moments.',
          wrongFeedback:
            'Check paragraph four. Jesus questioned fear and faith—not snacks or steering. (Answer: Why they were so fearful and why they had so little faith.)'
        },
        {
          question: 'What is one true thing we can remember when we feel afraid?',
          choices: [
            'Jesus is asleep so He cannot help',
            'Jesus has power over storms—and He is with His people',
            'Storms mean God forgot us',
            'We should never tell Jesus how we feel'
          ],
          correctIndex: 1,
          correctFeedback: 'Beautiful—that is the heart of the story.',
          wrongFeedback:
            'Think: who stopped the storm, and where was He the whole time? Reread the last paragraph. (Answer: Jesus has power over storms—and He is with His people.)'
        }
      ],
      doneHeading: 'You did it!',
      doneMessage: "Great job reading about Jesus calming the storm with God's Word today.",
      takeaway: 'Jesus is stronger than what scares you. You can talk to Him in the noisy moments.',
      prayer: 'Jesus, when my heart feels stormy, please bring Your peace. I trust You. Amen.',
      imagePrompts: [
        'Bright bouncy cartoon: small boat on dark choppy waves, disciples worried, Jesus asleep on cushion, lightning far off, kid-safe, no text',
        'Kid cartoon: disciples waking Jesus, rain and spray, faces scared but hopeful, no text',
        'Colorful scene: Jesus standing in boat with hand raised toward wind and waves, light breaking through clouds, no text',
        'Peaceful cartoon: flat calm water, soft sunrise, disciples amazed faces, boat still, no text',
        'Warm ending: Jesus smiling at friends in boat, gentle water, gold accents, no text'
      ]
    },
    goodSamaritan: {
      kjvRef: 'Luke 10:25–37',
      hintAboveQuiz: 'Use the comic pictures above while you read.',
      readAlongImages: [],
      paragraphs: [
        'A teacher of the law asked Jesus what he must do to inherit eternal life. Jesus asked him what the law said. The man answered with words close to the King James Bible: love the Lord with all your heart, soul, strength, and mind—and "thy neighbour as thyself" (Luke 10:27, KJV).',
        'Wanting to justify himself, he asked, "Who is my neighbour?" Jesus answered with a story. A man was going down the road to Jericho when robbers hurt him, took his things, and left him half dead.',
        'A priest came that way, saw the hurt man, and passed on the other side. So did a Levite. Both had reasons—but neither stopped to help.',
        'A Samaritan traveler saw the man and felt deep pity. He cleaned the wounds, used oil and wine, bandaged him, put him on his own animal, walked beside him, and paid an innkeeper to care for him. He even promised to pay more if the bill grew.',
        'Jesus asked, "Which of these was neighbour unto him that fell among the thieves?" The answer was obvious—the one who showed mercy. Jesus said, "Go, and do thou likewise." Neighbor-love is action, not only a nice idea.'
      ],
      quizHeading: 'Quiz — think it through',
      questions: [
        {
          question: 'What did the law teacher quote about loving others?',
          choices: [
            'Love only people who look like you',
            'Love your neighbour as yourself',
            'Never help strangers',
            'Neighbors do not matter'
          ],
          correctIndex: 1,
          correctFeedback: 'Yes—that line from Luke 10:27 (KJV) is the hinge of the lesson.',
          wrongFeedback:
            'Reread paragraph one. Which choice matches the Bible words Jesus agreed were right? (Answer: Love your neighbour as yourself.)'
        },
        {
          question: 'What happened to the man on the road to Jericho?',
          choices: [
            'He took a nap in the grass',
            'Robbers attacked him and left him hurt and robbed',
            'He gave a speech in the temple',
            'He built a new house'
          ],
          correctIndex: 1,
          correctFeedback: 'Right—that is why someone needed help.',
          wrongFeedback:
            'Look at paragraph two after Jesus begins the story. Who hurt the traveler? (Answer: Robbers attacked him and left him hurt and robbed.)'
        },
        {
          question: 'Who passed by without helping?',
          choices: [
            'Two children with bread',
            'A priest and a Levite',
            'The Samaritan and an angel',
            'Jesus and Peter'
          ],
          correctIndex: 1,
          correctFeedback: 'Yes—Jesus used them to show that status without mercy is empty.',
          wrongFeedback:
            'Check paragraph three. Who saw the man and went to the other side? (Answer: A priest and a Levite.)'
        },
        {
          question: 'What did the Samaritan do for the hurt man?',
          choices: [
            'He ignored him completely',
            'He told him to walk home alone',
            'He cared for his wounds, carried him, and paid for shelter',
            'He only threw coins from far away'
          ],
          correctIndex: 2,
          correctFeedback: 'Exactly—love looked like time, touch, and cost.',
          wrongFeedback:
            'Skim paragraph four. List what the Samaritan actually did—bandages, animal, inn, money. Which choice matches? (Answer: He cared for his wounds, carried him, and paid for shelter.)'
        },
        {
          question: 'At the end, what did Jesus tell the law teacher to do?',
          choices: [
            'Memorize more rules and do nothing',
            'Argue with Samaritans',
            'Go and do likewise—show mercy like the true neighbor',
            'Avoid the road to Jericho forever'
          ],
          correctIndex: 2,
          correctFeedback: 'Beautiful—mercy is the assignment.',
          wrongFeedback:
            "Read the last sentence of the story. What two little words start Jesus' final command? (Answer: Go and do likewise—show mercy like the true neighbor.)"
        }
      ],
      doneHeading: 'You did it!',
      doneMessage: 'Great job learning how Jesus defines a neighbor.',
      takeaway: 'Love is not only a feeling—it is help, courage, and kindness, even when it costs you.',
      prayer: 'God, make me quick to help and slow to walk away when someone is hurting. Amen.',
      imagePrompts: [
        'Bouncy cartoon: hurt traveler on dusty road, torn clothes, kind colors not graphic, no text',
        'Kid style: priest and Levite walking past on opposite side of road, humble faces, no text',
        'Warm cartoon: Samaritan kneeling to bandage traveler, oil and cloth, donkey nearby, no text',
        'Friendly scene: inn door, Samaritan speaking to innkeeper, coins, caring mood, no text',
        'Bright ending: Jesus teaching, listener thoughtful, soft light, neighbor-love theme, no text'
      ]
    },
    lostSheep: {
      kjvRef: 'Luke 15:3–7',
      hintAboveQuiz: 'Use the comic pictures above while you read.',
      readAlongImages: [],
      paragraphs: [
        'Tax collectors and sinners drew near to hear Jesus. Some proud religious leaders grumbled, "This man receiveth sinners." Jesus heard their hearts. He told three stories about how much God cares when something lost is found.',
        'The first story is tiny but loud with joy. A shepherd has a hundred sheep. If one wanders away, he leaves the ninety-nine in the wilderness and goes after the one that is lost until he finds it.',
        'When he finds it, he lays it on his shoulders, glad and gentle. Back home he calls friends and neighbors: "Rejoice with me; for I have found my sheep which was lost" (Luke 15:6, KJV).',
        'Jesus explained the meaning: "I say unto you, that likewise joy shall be in heaven over one sinner that repenteth, more than over ninety and nine just persons, which need no repentance" (Luke 15:7, KJV). Heaven cheers when someone turns back to God.',
        'For you: if you feel far from God, you are not invisible. He searches. You can pray, "Lord, I want to come home." And if you already love Jesus, be glad—He still looks for friends who are wandering.'
      ],
      quizHeading: 'Quiz — think it through',
      questions: [
        {
          question: 'How many sheep did the shepherd have at the start?',
          choices: ['Ten', 'Fifty', 'A hundred', 'One thousand'],
          correctIndex: 2,
          correctFeedback: 'Yes—one missing still mattered to him.',
          wrongFeedback:
            'Look at the first sentence of the parable in paragraph two. What number does Jesus use? (Answer: A hundred.)'
        },
        {
          question: 'What did the shepherd do when one sheep was lost?',
          choices: [
            'He forgot about it',
            'He sold the other ninety-nine',
            'He left the ninety-nine safe and went to find the one',
            'He waited a year to see if it returned'
          ],
          correctIndex: 2,
          correctFeedback: 'Right—the story is about seeking, not shrugging.',
          wrongFeedback:
            'Reread paragraph two. Did he stay put or go search? (Answer: He left the ninety-nine safe and went to find the one.)'
        },
        {
          question: 'When he found the sheep, how did he carry it?',
          choices: ['In a cart behind him', 'On his shoulders', 'Under his hat', 'He left it to find its own way'],
          correctIndex: 1,
          correctFeedback: 'Yes—gentle strength, like a good shepherd.',
          wrongFeedback:
            'Check paragraph three—where did the sheep rest? (Answer: On his shoulders.)'
        },
        {
          question: 'What did the shepherd say when he came home?',
          choices: [
            'Hide the sheep so no one sees',
            'Rejoice with me; I have found my sheep which was lost',
            'Sell the sheep at market',
            'The sheep is not important'
          ],
          correctIndex: 1,
          correctFeedback: 'Exactly—those words are straight from Luke 15:6 (KJV).',
          wrongFeedback:
            'Look for the quoted line in paragraph three. Which choice matches? (Answer: Rejoice with me; I have found my sheep which was lost.)'
        },
        {
          question: 'What does Jesus say heaven does when one sinner repents?',
          choices: [
            'Stays silent',
            'Is less joyful than for ninety-nine who need no repentance',
            'Has joy—more than over ninety-nine who need no repentance',
            'Forgets the person'
          ],
          correctIndex: 2,
          correctFeedback: "Yes—God's joy is huge over one heart coming home.",
          wrongFeedback:
            "Read paragraph four slowly. Compare the joy over one repenting sinner to the ninety-nine. Which choice matches Jesus' words? (Answer: Has joy—more than over ninety-nine who need no repentance.)"
        }
      ],
      doneHeading: 'You did it!',
      doneMessage: "Great job hearing Jesus' story about the lost sheep.",
      takeaway: 'God looks for wandering hearts. You can always turn back—and heaven is glad.',
      prayer: 'God, thank You for seeking me. When I wander, bring me home to You. Amen.',
      imagePrompts: [
        'Soft cartoon: shepherd counting fluffy sheep on green hill, one small sheep far away, no text',
        'Kid style: shepherd walking rocky path, lantern, looking for one sheep, dusk, no text',
        'Warm scene: shepherd smiling, sheep on shoulders, safe hugging pose, gold accents, no text',
        'Joyful cartoon: neighbors celebrating, simple houses, shepherd raising hand, no text',
        'Gentle ending: Jesus with children and sheep, peaceful light, you matter mood, no text'
      ]
    }
};
