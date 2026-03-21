'use strict';

/** Shared read+quiz for both Jericho library cards (same event, Joshua 6). */
function buildJerichoReadQuiz() {
  return {
    kjvRef: 'Joshua 6',
    hintAboveQuiz: "Read the story carefully — God's plan was different than usual!",
    paragraphs: [
      'God told Joshua that His people would take the city of Jericho. The walls were tall and very strong.',
      'God gave a special plan: "March around the city once a day for six days. Be quiet. Priests carry the ark and blow trumpets."',
      'The people obeyed. They marched quietly every day. On the seventh day they marched seven times around the city.',
      'After the seventh march, Joshua shouted, "Shout! The Lord has given you the city!"',
      'The people shouted loud together. Suddenly the walls fell down flat! God gave them the victory because they trusted and obeyed Him.'
    ],
    quizHeading: 'What Do You Remember?',
    questions: [
      {
        question: 'What did God tell Joshua to do with Jericho?',
        choices: [
          'Fight with swords right away',
          'March around the city quietly',
          'Climb the walls with ladders',
          'Wait for the walls to fall alone'
        ],
        correctIndex: 1,
        correctFeedback: 'Yes! God had a special obedience plan — marching showed trust in Him.',
        wrongFeedback:
          "Not quite. The Bible doesn't say to fight with swords or climb. God told them to march around quietly for six days, then seven times on the seventh day — that was the way to win!"
      },
      {
        question: 'How many times did they march on the seventh day?',
        choices: ['One time', 'Three times', 'Seven times', 'Ten times'],
        correctIndex: 2,
        correctFeedback: "Correct! Seven times on the seventh day — God's number for completeness.",
        wrongFeedback:
          "Let's check the story: God said to march around once each day for six days, but on the seventh day, march seven times. The answer is seven!"
      },
      {
        question: 'What did the people do after the last march?',
        choices: ['Ran away', 'Shouted loudly', 'Sang a song', 'Threw stones'],
        correctIndex: 1,
        correctFeedback: 'Exactly! They shouted together when Joshua gave the command — and the walls fell!',
        wrongFeedback:
          "Close, but they didn't run or sing. After marching, Joshua said \"Shout!\" and they shouted loud — that's when the walls came down (Joshua 6:20)."
      },
      {
        question: 'Why did the walls fall down?',
        choices: [
          'Because the trumpets were loud',
          'Because the people shouted',
          'Because God made it happen',
          'Because the walls were old'
        ],
        correctIndex: 2,
        correctFeedback: 'Right! God gave the victory — the people obeyed, and He did the miracle.',
        wrongFeedback:
          "The trumpets and shouting were part of the plan, but they weren't magic. The real reason is that God made the walls fall when His people obeyed Him."
      },
      {
        question: 'What can we learn from Jericho?',
        choices: [
          'God likes quiet marching',
          'Obeying God brings victory',
          'Shouting always wins',
          'Walls fall by themselves'
        ],
        correctIndex: 1,
        correctFeedback: 'Perfect! When we trust and obey God, even impossible things can happen.',
        wrongFeedback:
          "Almost! The story shows that victory came from obedience, not just noise or time passing. Trust and obey God — that is the lesson!"
      }
    ],
    doneHeading: 'You Did It!',
    doneMessage: 'Great job listening to the story and answering! You earned a star.',
    takeaway: 'Obeying God, even when the plan seems strange, leads to victory.',
    prayer: "Dear God, help me obey You even when I don't understand. I trust You. Amen.",
    imagePrompts: [
      'bright bouncy cartoon for kids: Israelite army marching silently around tall Jericho walls, priests with trumpets and ark of the covenant, sunny day, no text',
      'colorful kid illustration: Joshua leading people in a circle around the city, serious faces, dust on ground, big strong walls, no text',
      'fun cartoon style for children: seventh day march, people going around Jericho seven times, trumpets blowing, excitement in air, no text',
      "exciting Bible scene for kids: huge Jericho walls crumbling and falling down flat, Israelites shouting in joy, dust cloud, God's power shown",
      'happy ending cartoon: Israelites walking into the city of Jericho, smiling, praising God, bright colors, no text'
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
      kjvRef: 'Mark 4:35–41',
      hintAboveQuiz: 'Pay attention to what Jesus did and said!',
      readAlongImages: [],
      paragraphs: [
        'Jesus and His disciples were in a boat on the lake. Jesus was very tired and fell asleep.',
        'Suddenly a big storm came. Waves crashed over the boat. The disciples were scared!',
        'They woke Jesus and said, "Master, carest thou not that we perish?" (Mark 4:38, KJV).',
        'Jesus stood up and said to the wind and waves, "Peace, be still" (Mark 4:39, KJV). Right away the storm stopped. Everything was calm.',
        'Jesus asked, "Why are ye so fearful? how is it that ye have no faith?" The disciples were amazed and said, "What manner of man is this, that even the wind and the sea obey him?"'
      ],
      quizHeading: 'Test Your Understanding',
      questions: [
        {
          question: 'What was Jesus doing during the storm?',
          choices: ['Rowing the boat', 'Sleeping', 'Calming the storm', 'Teaching the disciples'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jesus was so tired He slept, even in a storm.',
          wrongFeedback:
            'Not quite. The Bible says Jesus was asleep in the boat when the storm started (Mark 4:38). He trusted God completely.'
        },
        {
          question: 'What did the disciples say to Jesus?',
          choices: [
            'Help us row!',
            'We are not scared!',
            'Master, carest thou not that we perish?',
            "Let's jump out!"
          ],
          correctIndex: 2,
          correctFeedback: 'Right! They were afraid and asked if Jesus cared.',
          wrongFeedback:
            'Reread paragraph three. In the King James Bible they said, "Master, carest thou not that we perish?" They were scared they might drown.'
        },
        {
          question: 'What did Jesus say to the storm?',
          choices: ['Go away!', 'Peace, be still', 'Stop now!', 'Be calm!'],
          correctIndex: 1,
          correctFeedback: 'Exactly! "Peace, be still" (Mark 4:39, KJV) — and the storm obeyed Him immediately.',
          wrongFeedback:
            'Look at paragraph four. The King James Bible records Jesus\'s short command to the wind and waves. (Answer: Peace, be still.)'
        },
        {
          question: 'How did the disciples feel after the storm stopped?',
          choices: ['Happy and calm', 'Amazed and afraid', 'Angry at Jesus', 'Sleepy again'],
          correctIndex: 1,
          correctFeedback: 'Yes! They were amazed — "Who is this? Even the wind and waves obey Him!"',
          wrongFeedback:
            'The Bible says they wondered with fear and amazement. They asked who Jesus was — because only God has power over nature!'
        },
        {
          question: 'What can we learn from this story?',
          choices: [
            'Storms are fun',
            'Jesus has power over everything',
            'Disciples are always brave',
            'Boats sink easily'
          ],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus has power over storms — and over our fears too.',
          wrongFeedback:
            'The big lesson is that Jesus is in control of everything, even when we feel scared. We can trust Him!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: "You earned a star for trusting Jesus' power!",
      takeaway: 'Jesus has power over everything — even storms. We can trust Him when we are afraid.',
      prayer:
        'Jesus, when I am scared, help me remember You are with me and have power over everything. Amen.',
      imagePrompts: [
        'bright cartoon for kids: Jesus sleeping in a boat while disciples row, calm lake at first, no text',
        'fun kid illustration: big storm on the lake, huge waves crashing into the boat, disciples looking scared, Jesus asleep',
        'colorful Bible scene for children: Jesus standing up in the boat, speaking to the storm, wind and waves calming down',
        'exciting cartoon: storm suddenly stops, lake flat and peaceful, disciples amazed looking at Jesus',
        'happy ending illustration: boat on calm water, Jesus smiling at disciples, peace and faith shown, no text'
      ]
    },
    goodSamaritan: {
      kjvRef: 'Luke 10:25–37',
      hintAboveQuiz: 'Look for who helped and why!',
      readAlongImages: [],
      paragraphs: [
        'A man asked Jesus, "Who is my neighbor?" Jesus told a story to answer.',
        'A traveler was attacked by robbers. They took his things and hurt him. He lay on the road, injured.',
        'A priest walked by and saw him — but he crossed to the other side and kept going.',
        'Then a Levite (another religious man) did the same — he passed by without helping.',
        'But a Samaritan (who was from a different group) saw him. He felt sorry, stopped, bandaged the man, put him on his donkey, took him to an inn, and paid for his care.'
      ],
      quizHeading: 'Who Is My Neighbor?',
      questions: [
        {
          question: 'What happened to the traveler?',
          choices: ['He got lost', 'Robbers attacked him', 'He fell asleep', 'He met friends'],
          correctIndex: 1,
          correctFeedback: 'Yes! Robbers hurt him and took his things.',
          wrongFeedback:
            "Let's read the beginning: The man was attacked by robbers on the road. They left him injured."
        },
        {
          question: 'Who was the first person to see the hurt man?',
          choices: ['A Samaritan', 'A priest', 'A Levite', 'Jesus'],
          correctIndex: 1,
          correctFeedback: 'Right! A priest saw him first but walked past.',
          wrongFeedback:
            'The story says a priest came by first. He looked at the man but crossed to the other side.'
        },
        {
          question: 'Who helped the hurt man?',
          choices: ['The priest', 'The Levite', 'A Samaritan', 'The robbers'],
          correctIndex: 2,
          correctFeedback: "Yes! The Samaritan stopped and helped, even though others didn't.",
          wrongFeedback:
            "The priest and Levite passed by. It was the Samaritan — from a different group — who showed kindness."
        },
        {
          question: 'What did the Samaritan do for the man?',
          choices: [
            'Walked past',
            'Bandaged him and took him to an inn',
            'Took his things',
            'Called for help'
          ],
          correctIndex: 1,
          correctFeedback: 'Exactly! He bandaged wounds, put him on his donkey, and paid for care.',
          wrongFeedback:
            "The Samaritan didn't walk past or take things. He helped by bandaging, carrying, and paying for the inn."
        },
        {
          question: 'What does this story teach us?',
          choices: [
            'Only help friends',
            'Help anyone who needs it',
            'Ignore hurt people',
            'Be rich to help'
          ],
          correctIndex: 1,
          correctFeedback: 'Perfect! Everyone is our neighbor — show love and help anyone in need.',
          wrongFeedback:
            "The point of Jesus' story is that our neighbor is anyone who needs help. The Samaritan showed love to a stranger!"
        }
      ],
      doneHeading: 'You Did It!',
      doneMessage: 'Great job learning who your neighbor is!',
      takeaway: 'Love your neighbor — that means helping anyone who needs it.',
      prayer: 'God, help me see people who need help and show them kindness. Amen.',
      imagePrompts: [
        'bright kid cartoon: traveler attacked by robbers on a road, hurt and left alone, no text',
        'colorful Bible illustration for children: priest walking past injured man on the ground, looking away, no text',
        'fun cartoon style: Levite also passing by the hurt man, crossing to the other side, no text',
        'kind Samaritan scene for kids: Samaritan helping injured man, bandaging wounds, putting him on donkey, caring face',
        'happy ending cartoon: Samaritan at inn paying the innkeeper to take care of the hurt man, warm and kind, no text'
      ]
    },
    lostSheep: {
      kjvRef: 'Luke 15:3–7',
      hintAboveQuiz: 'Think about how much the shepherd cared for the one lost sheep!',
      readAlongImages: [],
      paragraphs: [
        'Jesus told a story about a shepherd who had 100 sheep.',
        'One day, one sheep got lost. The shepherd left the 99 safe sheep and went to search for the lost one.',
        'He looked everywhere until he found it! He was so happy.',
        'The shepherd carried the sheep home on his shoulders.',
        'He called his friends and said, "Rejoice with me! I found my lost sheep!" Jesus said, "There is joy in heaven when one sinner turns to God." That matches Luke 15:7 (KJV): "joy shall be in heaven over one sinner that repenteth."'
      ],
      quizHeading: 'Find the Lost Sheep',
      questions: [
        {
          question: 'How many sheep did the shepherd have?',
          choices: ['10', '50', '100', '200'],
          correctIndex: 2,
          correctFeedback: 'Yes! 100 sheep — and he noticed when one was missing.',
          wrongFeedback:
            "The story says 100 sheep. That's a big flock, and he still cared about each one!"
        },
        {
          question: 'What did the shepherd do when one sheep was lost?',
          choices: [
            'Stayed with the 99',
            'Went to search for it',
            'Waited for it to come back',
            'Called the police'
          ],
          correctIndex: 1,
          correctFeedback: 'Right! He left the 99 and searched until he found it.',
          wrongFeedback:
            "He didn't stay or wait. The shepherd loved every sheep, so he went looking right away."
        },
        {
          question: 'How did the shepherd carry the lost sheep home?',
          choices: ['In a bag', 'On his shoulders', 'By pulling it', 'Letting it walk'],
          correctIndex: 1,
          correctFeedback: 'Yes! He carried it on his shoulders — so gentle and happy.',
          wrongFeedback:
            'The Bible says he put it on his shoulders and carried it home. That shows great care!'
        },
        {
          question: 'What did the shepherd do when he found the sheep?',
          choices: ['Got angry', 'Called friends to rejoice', 'Punished it', 'Sold it'],
          correctIndex: 1,
          correctFeedback: 'Exactly! He was so happy he called friends to celebrate.',
          wrongFeedback:
            'He was joyful, not angry. He said "Rejoice with me!" because the lost was found!'
        },
        {
          question: 'What does Jesus say happens in heaven?',
          choices: [
            'Angels are sad',
            'Joy when one sinner turns to God',
            'Nothing special',
            'Only big groups matter'
          ],
          correctIndex: 1,
          correctFeedback: 'Perfect! Heaven rejoices when even one person comes back to God.',
          wrongFeedback:
            'The story ends with Jesus saying there is joy in heaven over one sinner who repents. God cares about each person!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God rejoices over you too!',
      takeaway: 'God loves each one of us so much — He searches for the lost.',
      prayer: "God, thank You for loving me and searching for me when I'm lost. Amen.",
      imagePrompts: [
        'bright cartoon for kids: shepherd with 100 sheep on green hills, peaceful scene, no text',
        'fun kid illustration: one sheep missing, shepherd looking worried, 99 sheep safe in field, no text',
        'colorful Bible scene for children: shepherd searching high and low for lost sheep, mountains and bushes',
        'happy cartoon: shepherd finding the lost sheep, big smile, carrying it on shoulders',
        'joyful ending illustration: shepherd with friends celebrating, carrying sheep home, party feeling, no text'
      ]
    },
    creation: {
      kjvRef: 'Genesis 1',
      hintAboveQuiz: 'Remember what God made each day!',
      readAlongImages: [],
      paragraphs: [
        'In the beginning, God created everything. There was nothing, just darkness.',
        'On Day 1, God said, "Let there be light!" And there was light. He called it day and night.',
        'On Day 2, God made the sky and separated waters above and below.',
        'On Day 3, He made dry land, seas, and plants of every kind.',
        'On Day 4, God made the sun, moon, and stars. On Day 5, He made birds and sea creatures. On Day 6, He made animals and people. God saw everything was good.'
      ],
      quizHeading: 'Creation Days',
      questions: [
        {
          question: 'What did God create on Day 1?',
          choices: ['Animals', 'Light', 'Plants', 'Stars'],
          correctIndex: 1,
          correctFeedback: 'Yes! God said "Let there be light" — and there was light!',
          wrongFeedback:
            'Not quite. Animals and plants came later. On Day 1, God made light and separated it from darkness (Genesis 1:3).'
        },
        {
          question: 'What did God make on Day 3?',
          choices: ['Sun and moon', 'Birds and fish', 'Dry land and plants', 'People'],
          correctIndex: 2,
          correctFeedback: 'Right! Dry land, seas, and all kinds of plants.',
          wrongFeedback:
            'Sun and moon were Day 4, birds and fish Day 5, people Day 6. Day 3 was land and plants growing!'
        },
        {
          question: 'What did God say after making everything?',
          choices: ['It is okay', 'It is good', 'It is perfect', 'It is finished'],
          correctIndex: 1,
          correctFeedback: 'Yes! "God saw all that He had made, and it was very good."',
          wrongFeedback:
            'Close, but the Bible says "very good" — everything was perfect at the start!'
        },
        {
          question: 'Who did God make on Day 6?',
          choices: ['Only animals', 'Birds and fish', 'Animals and people', 'Stars and sky'],
          correctIndex: 2,
          correctFeedback: 'Exactly! Animals and then man and woman — in His image.',
          wrongFeedback:
            'Birds/fish were Day 5, stars/sky earlier. Day 6 was land animals and people.'
        },
        {
          question: 'What does Creation teach us?',
          choices: ['God made everything', 'God is weak', 'Nothing matters', 'We are alone'],
          correctIndex: 0,
          correctFeedback: 'Perfect! God created everything good — and He made us special.',
          wrongFeedback:
            'The big truth is God made everything on purpose. He is powerful and loves us!'
        }
      ],
      doneHeading: 'Wow!',
      doneMessage: 'You earned a star — God made you too!',
      takeaway: 'God created everything good, and He made us in His image to love Him.',
      prayer: 'God, thank You for making the world and me. You are amazing! Amen.',
      imagePrompts: [
        "bright bouncy cartoon for kids: dark empty void before creation, God's light starting to shine, no text",
        'fun kid illustration: Day 1 — light and darkness separated, bright sun-like glow vs night, no text',
        'colorful Bible scene for children: Day 2 — blue sky forming, waters above and below, fluffy clouds, no text',
        'exciting cartoon: Day 3 — land rising from sea, green plants and trees growing everywhere, no text',
        'happy ending illustration: Days 4–6 — sun/moon/stars, birds flying, animals and people in garden, warm golden light, no text'
      ]
    }
};
