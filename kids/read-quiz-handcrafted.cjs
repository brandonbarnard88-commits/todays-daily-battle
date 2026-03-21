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
    },
    creationLight: {
      kjvRef: 'Genesis 1:1–5',
      hintAboveQuiz: 'Remember what God did on the very first day!',
      readAlongImages: [],
      paragraphs: [
        'In the beginning, God created the heavens and the earth. Everything was dark and empty.',
        'God said, "Let there be light!" And there was light. God saw that the light was good.',
        'He separated the light from the darkness. God called the light "day" and the darkness "night".',
        'There was evening, and there was morning — the first day.',
        'God made light on the very first day so we could see His wonderful creation.'
      ],
      quizHeading: 'Day 1 Questions',
      questions: [
        {
          question: 'What was everything like before God started creating?',
          choices: ['Bright and colorful', 'Dark and empty', 'Full of animals', 'Covered in water'],
          correctIndex: 1,
          correctFeedback: 'Yes! It was dark and empty — then God began.',
          wrongFeedback:
            'Not quite. The Bible says the earth was without form and empty, and darkness was upon the face of the deep (Genesis 1:2). God started with nothing ready yet!'
        },
        {
          question: 'What did God say on the first day?',
          choices: ['Let there be animals', 'Let there be light', 'Let there be people', 'Let there be stars'],
          correctIndex: 1,
          correctFeedback: 'Right! "Let there be light!" — and light appeared.',
          wrongFeedback:
            'Animals and people came much later. On Day 1, God commanded light to appear (Genesis 1:3).'
        },
        {
          question: 'What did God call the light?',
          choices: ['Night', 'Day', 'Sky', 'Stars'],
          correctIndex: 1,
          correctFeedback: 'Exactly! He called the light "day" and the darkness "night".',
          wrongFeedback:
            'Night is darkness. God named the light "day" so we could tell time (Genesis 1:5).'
        },
        {
          question: 'What happened after God made light?',
          choices: ['He rested', 'He separated it from darkness', 'He made plants', 'He made animals'],
          correctIndex: 1,
          correctFeedback: 'Yes! He separated light from darkness — that was the first day.',
          wrongFeedback:
            'Rest came later. Plants were Day 3, animals Day 6. First He separated light and dark.'
        },
        {
          question: 'What does Day 1 teach us about God?',
          choices: ['God likes darkness', 'God speaks and things happen', 'God needs help', 'God is weak'],
          correctIndex: 1,
          correctFeedback:
            'Perfect! God just spoke — "Let there be light" — and it happened. He is powerful!',
          wrongFeedback:
            "The story shows God's word has power. He did not need help — His command was enough!"
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God spoke light into being!',
      takeaway: 'God is powerful — He speaks and creation listens.',
      prayer: 'God, thank You for making light. Help me listen to Your words every day. Amen.',
      imagePrompts: [
        'bright bouncy cartoon for kids: completely dark empty void before creation, no light anywhere, no text',
        'fun kid illustration: bright words "Let there be light" feeling, glow breaking through darkness, colorful burst, no text on image',
        'colorful Bible scene for children: light and darkness separated, day side bright, night side dark and starry, no text',
        'exciting cartoon: first day complete, warm light over land and sea, peaceful feel, no text',
        'happy ending illustration: beautiful sunrise over waters, sense of God\'s good gift of light, gold accents, no text'
      ]
    },
    adamEve: {
      kjvRef: 'Genesis 2:7–25; 3:1–24',
      hintAboveQuiz: 'Remember what God said they could and could not do!',
      readAlongImages: [],
      paragraphs: [
        'God made the first man, Adam, from dust and breathed life into him. Adam named all the animals.',
        'God saw Adam needed a helper. He made Eve from Adam\'s rib while Adam slept.',
        'They lived in a beautiful garden called Eden with God. They could eat any fruit except one tree.',
        'A serpent tricked Eve into eating the forbidden fruit. She gave some to Adam, and he ate too.',
        'Because they disobeyed, sin came into the world. God sent them out of the garden, but He still loved them. One day He would send the Savior, Jesus, to undo what sin broke.'
      ],
      quizHeading: 'Adam & Eve Questions',
      questions: [
        {
          question: 'How did God make Adam?',
          choices: ['From a rib', 'From dust', 'From an animal', 'From light'],
          correctIndex: 1,
          correctFeedback: 'Yes! God formed Adam from dust and breathed life into him.',
          wrongFeedback:
            "Eve came from Adam's rib later. Adam was made from the ground (Genesis 2:7)."
        },
        {
          question: 'What did God make for Adam because he was alone?',
          choices: ['A new animal', 'Eve', 'A house', 'More friends'],
          correctIndex: 1,
          correctFeedback: 'Right! God made Eve from Adam\'s rib to be his helper.',
          wrongFeedback:
            'Adam named the animals, but none was right for him. God made Eve specially (Genesis 2:18–22).'
        },
        {
          question: 'What was the one tree they could not eat from?',
          choices: ['Tree of life', 'Tree of knowledge of good and evil', 'Orange tree', 'Banana tree'],
          correctIndex: 1,
          correctFeedback: 'Yes! God said not to eat from that tree.',
          wrongFeedback:
            'The tree of life was different. God warned them about the tree of knowledge of good and evil (Genesis 2:17).'
        },
        {
          question: 'Who tricked Eve into eating the fruit?',
          choices: ['Adam', 'The serpent', 'God', 'An angel'],
          correctIndex: 1,
          correctFeedback: 'Correct! The serpent (Satan) tricked her.',
          wrongFeedback:
            'Adam ate after Eve. The Bible says the serpent was more subtle and deceived her (Genesis 3:1–6).'
        },
        {
          question: 'What happened because Adam and Eve disobeyed?',
          choices: ['They stayed in Eden forever', 'Sin came into the world', 'They got more fruit', 'Nothing changed'],
          correctIndex: 1,
          correctFeedback: 'Yes! Sin entered, but God still loved them and planned the Savior.',
          wrongFeedback:
            'They had to leave Eden. Disobedience brought sin and separation, but God still cared for them.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God still loves us even when we disobey.',
      takeaway:
        'God made us to live with Him, but sin separates us — He sent Jesus to bring us back.',
      prayer: 'God, forgive me when I disobey. Thank You for loving me and sending Jesus. Amen.',
      imagePrompts: [
        'bright cartoon for kids: God forming Adam from dust, breath of life, garden background, no text',
        'fun kid illustration: Adam naming animals in Eden, smiling, friendly animals around him, no text',
        "colorful Bible scene for children: God creating Eve while Adam sleeps, gentle peaceful light, no text",
        'serious kid-safe cartoon: Eve and Adam near the forbidden tree, serpent nearby, humble colors not scary, no text',
        'hopeful ending illustration: Adam and Eve leaving Eden, distant light suggesting God\'s promise, no text'
      ]
    },
    cainAbel: {
      kjvRef: 'Genesis 4:1–16',
      paragraphs: [
        'Adam and Eve had two sons: Cain and Abel. Cain was a farmer, Abel was a shepherd.',
        'They brought offerings to God. Abel brought the best of his lambs — God was pleased.',
        'Cain brought some of his crops, but his heart wasn\'t right. God was not pleased.',
        'Cain got very angry. God warned him, "Sin is waiting to control you — do what is right."',
        'Cain didn\'t listen. He hurt Abel. God asked, "Where is your brother?" Cain said, "I don\'t know." God punished Cain, but also protected him with a mark.'
      ],
      imagePrompts: [
        'bright bouncy cartoon for kids: Cain farming crops, Abel tending sheep, brothers working, no text',
        'colorful kid illustration: Cain and Abel bringing offerings to God, Abel with lamb, Cain with crops, no text',
        'fun Bible scene for children: God accepting Abel\'s offering, warm light, Cain looking angry, no text',
        'sad gentle cartoon: empty field, sense of loss and sorrow after brothers fought, no violence shown, no text',
        'hopeful ending illustration: God talking to Cain, mark for protection, distant road, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Look at the hearts of Cain and Abel!',
      quizHeading: 'Cain & Abel Questions',
      questions: [
        {
          question: 'What did Abel bring to God?',
          choices: ['Crops from his farm', 'The best of his lambs', 'A song', 'Money'],
          correctIndex: 1,
          correctFeedback: 'Yes! Abel brought the best of his flock — God was pleased.',
          wrongFeedback:
            'Cain brought crops. Abel brought the best lambs because he gave from his heart (Genesis 4:4).'
        },
        {
          question: 'Why was God not pleased with Cain\'s offering?',
          choices: ['It was too small', 'Cain\'s heart wasn\'t right', 'It was the wrong food', 'God doesn\'t like vegetables'],
          correctIndex: 1,
          correctFeedback: 'Right! God looks at our hearts, not just what we give.',
          wrongFeedback:
            'Size didn\'t matter. The Bible says Cain\'s offering was rejected because his heart wasn\'t right (Genesis 4:5).'
        },
        {
          question: 'What did God warn Cain about?',
          choices: ['Sin is waiting to control you', 'Be nicer to Abel', 'Give more offerings', 'Don\'t eat fruit'],
          correctIndex: 0,
          correctFeedback: 'Yes! God said sin was like a wild animal waiting to attack — choose right!',
          wrongFeedback:
            'God wasn\'t talking about fruit. He warned Cain that sin was crouching at the door, ready to control him if he didn\'t do right (Genesis 4:7).'
        },
        {
          question: 'What did Cain do to Abel?',
          choices: ['Shared his food', 'Helped him', 'Hurt him', 'Played with him'],
          correctIndex: 2,
          correctFeedback: 'Correct! Cain hurt his brother because of jealousy.',
          wrongFeedback:
            'They were brothers, but Cain was angry. The Bible says Cain attacked and killed Abel (Genesis 4:8).'
        },
        {
          question: 'What can we learn from Cain and Abel?',
          choices: ['Give God your best', 'Be jealous', 'Hurt others when angry', 'Hide from God'],
          correctIndex: 0,
          correctFeedback: 'Perfect! Give God your best with a right heart — He knows what\'s inside.',
          wrongFeedback:
            'The story shows jealousy and anger lead to sin. But Abel gave from a good heart — that\'s what pleases God!'
        }
      ],
      doneHeading: 'You Did It!',
      doneMessage: 'Great job learning about giving God your best!',
      takeaway: 'God looks at our hearts. Give Him your best with love.',
      prayer: 'God, help me give You my best with a happy heart. Amen.'
    },
    towerBabel: {
      kjvRef: 'Genesis 11:1–9',
      paragraphs: [
        'After the flood, everyone spoke one language. They decided to build a big tower that reached heaven.',
        'They wanted to make a name for themselves and not be scattered over the earth.',
        'God came down and saw their plan. He said, "If they keep this up, nothing will stop them."',
        'God confused their language so they couldn\'t understand each other. They stopped building the tower.',
        'The place was called Babel because God confused their language. Then He scattered the people over the earth.'
      ],
      imagePrompts: [
        'bright cartoon for kids: people building tall tower toward heaven, bricks and tools, one language, no text',
        'fun kid illustration: group of people working together on huge tower, proud faces, sky high, no text',
        'colorful Bible scene for children: God looking down from heaven at the tower, serious expression, no text',
        'exciting cartoon: people suddenly speaking different languages, confused faces, tower unfinished, no text',
        'peaceful illustration: families settling in new lands under wide sky, many nations, soft colors, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Why did the people want to build the tower?',
      quizHeading: 'Tower of Babel Questions',
      questions: [
        {
          question: 'What did the people all speak at first?',
          choices: ['Many languages', 'One language', 'Animal sounds', 'No words'],
          correctIndex: 1,
          correctFeedback: 'Yes! Everyone spoke one language, so they could work together easily.',
          wrongFeedback:
            'Different languages came later. At the beginning, the whole world had one language (Genesis 11:1).'
        },
        {
          question: 'What did the people want to build?',
          choices: ['A big house', 'A tall tower to heaven', 'A boat', 'A garden'],
          correctIndex: 1,
          correctFeedback: 'Right! A tower that reached the sky — to make a name for themselves.',
          wrongFeedback:
            'Not a house or garden. They said "Let us build a city with a tower that reaches to heaven" (Genesis 11:4).'
        },
        {
          question: 'Why did they want to build it?',
          choices: ['To help God', 'To make a name for themselves', 'To hide from God', 'To grow food'],
          correctIndex: 1,
          correctFeedback: 'Yes! They wanted fame and to stay together instead of spreading out.',
          wrongFeedback:
            'They weren\'t helping God. Their plan was pride — to make themselves great, not obey God\'s command to fill the earth.'
        },
        {
          question: 'What did God do to stop them?',
          choices: ['Sent a flood', 'Confused their language', 'Sent animals', 'Blew the tower down'],
          correctIndex: 1,
          correctFeedback: 'Exactly! God confused their language so they couldn\'t work together.',
          wrongFeedback:
            'No flood this time. He mixed up their words — they couldn\'t understand each other anymore (Genesis 11:7).'
        },
        {
          question: 'What does this story teach us?',
          choices: ['Build big towers', 'Pride leads to problems', 'God likes confusion', 'Stay in one place'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Pride makes us think we don\'t need God — humility and obedience please Him.',
          wrongFeedback:
            'The tower was about pride and disobedience. God scattered them to fulfill His plan — humility is better!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star for learning about humility!',
      takeaway: 'Pride leads to confusion, but humility and obedience honor God.',
      prayer: 'God, help me stay humble and obey You, not try to be great on my own. Amen.'
    },
    abrahamIsaac: {
      kjvRef: 'Genesis 22:1–19',
      paragraphs: [
        'God promised Abraham and Sarah a son, Isaac, even though they were old. Isaac was born!',
        'Later God tested Abraham. He said, "Take your son Isaac and offer him as a sacrifice on a mountain."',
        'Abraham obeyed, even though it hurt. He took Isaac and wood for the fire to the mountain.',
        'Isaac asked, "Where is the lamb?" Abraham said, "God will provide."',
        'Abraham was ready to obey, but God stopped him. He provided a ram caught in a bush instead. God said, "Because you obeyed, I will bless you greatly."'
      ],
      imagePrompts: [
        'bright cartoon for kids: old Abraham and Sarah with baby Isaac, happy family, no text',
        'fun kid illustration: Abraham walking with young Isaac and donkey to the mountain, carrying wood, no text',
        'colorful Bible scene for children: Isaac asking Abraham about the lamb, Abraham answering, trusting faces, no text',
        'gentle cartoon: bright angel light from above, Abraham listening, ram in thicket nearby, no weapons, no text',
        'happy ending illustration: Abraham and Isaac together safely, ram nearby, blessing light, bright colors, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Abraham trusted God completely — even when it was hard!',
      quizHeading: 'Abraham & Isaac Questions',
      questions: [
        {
          question: 'Who did God promise to Abraham and Sarah?',
          choices: ['A daughter', 'A son named Isaac', 'A big house', 'Many animals'],
          correctIndex: 1,
          correctFeedback: 'Yes! God kept His promise — Isaac was born when they were old.',
          wrongFeedback:
            'Not animals or a house. God promised a son, even in old age (Genesis 21:1–3).'
        },
        {
          question: 'What did God ask Abraham to do as a test?',
          choices: ['Give away all his sheep', 'Offer Isaac as a sacrifice', 'Move to a new land again', 'Build an altar'],
          correctIndex: 1,
          correctFeedback: 'Right! God tested Abraham\'s faith with a very hard command.',
          wrongFeedback:
            'He had already moved. This test was to offer his son Isaac — but God had a plan (Genesis 22:2).'
        },
        {
          question: 'What did Isaac ask on the way?',
          choices: ['Are we there yet?', 'Where is the lamb?', 'Can I go home?', 'Is this a game?'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Where is the lamb for the sacrifice?"',
          wrongFeedback:
            'Isaac was carrying wood and noticed something missing. He asked about the lamb (Genesis 22:7).'
        },
        {
          question: 'What did Abraham answer about the lamb?',
          choices: ['We forgot it', 'God will provide', 'You are the lamb', 'We don\'t need one'],
          correctIndex: 1,
          correctFeedback: 'Exactly! "God Himself will provide the lamb." Abraham trusted God.',
          wrongFeedback:
            'Abraham didn\'t say they forgot. He believed God would provide — and He did!'
        },
        {
          question: 'What happened when Abraham obeyed?',
          choices: ['God stopped him and provided a ram', 'The sacrifice happened', 'Isaac ran away', 'God was angry'],
          correctIndex: 0,
          correctFeedback: 'Yes! God stopped him and provided a ram caught in a bush.',
          wrongFeedback:
            'The test ended when Abraham showed faith. God provided the ram instead — He always keeps His promises!'
        }
      ],
      doneHeading: 'You Did It!',
      doneMessage: 'Great job learning about trusting God!',
      takeaway: 'Trust and obey God even when it\'s hard — He always provides.',
      prayer: 'God, help me trust You completely, even when things are scary. Amen.'
    },
    josephCoat: {
      kjvRef: 'Genesis 37',
      paragraphs: [
        'Jacob loved his son Joseph more than his other sons. He gave Joseph a beautiful coat of many colours.',
        'Joseph had dreams that one day his family would bow to him. He told his brothers about the dreams.',
        'The brothers were jealous and angry. They hated Joseph because of his dreams and the special coat.',
        'One day the brothers planned to hurt Joseph. They threw him into a dry well.',
        'Later they sold him to traders going to Egypt. They told Jacob a wild animal ate Joseph. But God was with Joseph.'
      ],
      imagePrompts: [
        'bright bouncy cartoon for kids: Jacob giving Joseph a colourful coat, Joseph smiling, brothers watching jealously, no text',
        'fun kid illustration: Joseph telling his brothers about his dream, stars and sheaves bowing to him, brothers angry, no text',
        'colorful Bible scene for children: empty dry well from above, sense of trouble, no violence shown, no text',
        'exciting cartoon: traders meeting brothers, Joseph with caravan toward Egypt, worried but brave face, no text',
        'hopeful ending illustration: Joseph far from home with warm light suggesting God watching over him, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Look at how jealousy hurt the family!',
      quizHeading: 'Joseph\'s Coat Questions',
      questions: [
        {
          question: 'What special gift did Jacob give Joseph?',
          choices: ['A new donkey', 'A coat of many colours', 'A big farm', 'A crown'],
          correctIndex: 1,
          correctFeedback: 'Yes! A beautiful coat — it made his brothers jealous.',
          wrongFeedback:
            'Not a donkey or crown. Jacob gave him a coat of many colours because he loved Joseph dearly (Genesis 37:3).'
        },
        {
          question: 'What did Joseph dream about his family?',
          choices: ['They would be rich', 'They would bow to him', 'They would get lost', 'They would fight'],
          correctIndex: 1,
          correctFeedback: 'Right! In his dreams, his family bowed to him — God was showing the future.',
          wrongFeedback:
            'Not fighting or getting lost. Joseph dreamed his brothers\' sheaves bowed to his (Genesis 37:5–8).'
        },
        {
          question: 'Why were Joseph\'s brothers angry?',
          choices: ['He took their toys', 'They were jealous of the coat and dreams', 'He ate their food', 'He was older'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jealousy over the coat and dreams made them hate him.',
          wrongFeedback:
            'He didn\'t take toys or food. The brothers hated him because Jacob loved him more and his dreams sounded like he\'d rule over them.'
        },
        {
          question: 'What did the brothers do to Joseph?',
          choices: ['Gave him gifts', 'Threw him in a well and sold him', 'Helped him farm', 'Took him to Egypt themselves'],
          correctIndex: 1,
          correctFeedback: 'Correct! They threw him in a pit then sold him to traders.',
          wrongFeedback:
            'They didn\'t help or gift him. They put him in a dry well, then sold him to Ishmeelite traders (Genesis 37:28).'
        },
        {
          question: 'What can we learn from Joseph\'s brothers?',
          choices: ['Jealousy is good', 'Jealousy hurts people', 'Dreams are bad', 'Coats are important'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jealousy leads to bad choices — love others instead.',
          wrongFeedback:
            'The story shows jealousy caused pain. God wants us to be happy for others, not jealous!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star for learning about jealousy!',
      takeaway: 'Jealousy hurts families — God wants us to love and be thankful.',
      prayer: 'God, help me not be jealous. Help me love my family and friends. Amen.'
    },
    josephSold: {
      kjvRef: 'Genesis 37:12–36',
      paragraphs: [
        'Joseph\'s brothers were jealous of him. They hated his special coat and his dreams.',
        'One day Jacob sent Joseph to check on his brothers who were with the sheep.',
        'The brothers saw Joseph coming. They planned to hurt him and threw him into an empty well.',
        'Some traders came by. The brothers pulled Joseph out and sold him for money.',
        'They dipped Joseph\'s coat in goat blood and showed it to Jacob. Jacob thought a wild animal killed Joseph. But God was with Joseph in Egypt.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Joseph wearing colourful coat, walking to find his brothers, open path, no text',
        'fun kid illustration: brothers seeing Joseph coming, angry faces, planning something, no text',
        'colorful Bible scene for children: dry well from above, small figure looking up, no violence, no text',
        'exciting cartoon: traders arriving, brothers and caravan, silver exchanged, no text',
        'sad but hopeful illustration: father grieving over torn coat with red stain, gentle light from above, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The brothers were very jealous — see what they did!',
      quizHeading: 'Joseph Sold Questions',
      questions: [
        {
          question: 'Why did Joseph\'s brothers hate him?',
          choices: ['He was slow', 'Jealous of coat and dreams', 'He ate their food', 'He was too tall'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jealousy over the coat and dreams made them angry.',
          wrongFeedback:
            'Not food or height. They hated the special treatment and dreams where they bowed to him.'
        },
        {
          question: 'What did Jacob ask Joseph to do?',
          choices: ['Stay home', 'Check on his brothers with the sheep', 'Make a new coat', 'Go to Egypt'],
          correctIndex: 1,
          correctFeedback: 'Right! Jacob sent him to see if the brothers were okay.',
          wrongFeedback:
            'Not to make a coat or go to Egypt alone. Jacob sent him to see how the brothers and flocks were doing (Genesis 37:14).'
        },
        {
          question: 'What did the brothers do when they saw Joseph?',
          choices: ['Hugged him', 'Threw him in a well', 'Gave him food', 'Ran away'],
          correctIndex: 1,
          correctFeedback: 'Correct! They threw him into an empty well.',
          wrongFeedback:
            'They didn\'t hug or feed him. In anger, they put him in a dry pit (Genesis 37:24).'
        },
        {
          question: 'How did the brothers trick Jacob?',
          choices: ['Told him Joseph ran away', 'Dipped coat in blood', 'Hid Joseph', 'Said Joseph was king'],
          correctIndex: 1,
          correctFeedback: 'Yes! They dipped the coat in goat blood and said a wild animal ate him.',
          wrongFeedback:
            'They didn\'t hide him or say he was king. They showed the bloody coat so Jacob thought Joseph was dead.'
        },
        {
          question: 'What can we learn from this part of Joseph\'s story?',
          choices: ['Jealousy is okay', 'God is with us even in hard times', 'Trick your family', 'Run away from problems'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Even when bad things happen, God is with us — like He was with Joseph.',
          wrongFeedback:
            'The story shows jealousy causes pain, but God never left Joseph. Trust Him in hard times!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star for seeing God\'s faithfulness!',
      takeaway: 'God is with us even when others hurt us.',
      prayer: 'God, thank You for being with me always. Help me trust You in hard times. Amen.'
    },
    josephDreams: {
      kjvRef: 'Genesis 37:5–11',
      paragraphs: [
        'Joseph dreamed that he and his brothers tied sheaves in the field — and their sheaves bowed down to his sheaf.',
        'He told his brothers. They hated him even more. "Will you rule over us?" they asked.',
        'Joseph dreamed again: the sun, moon, and eleven stars bowed down to him.',
        'He told his father and brothers. His father Jacob wondered, but kept the saying in his heart.',
        'Those dreams came from God\'s plan. Years later, every part came true — God keeps His word.'
      ],
      imagePrompts: [
        'bouncy cartoon: golden sheaves of grain in a field, one upright, others bowing, soft dream swirls, no text',
        'kid illustration: angry brothers listening to Joseph, tents in background, no text',
        'night sky dream: sun moon and eleven stars, gentle glow, friendly not scary, no text',
        'family scene: Jacob listening, brothers upset, desert camp, no text',
        'peaceful closing: starry sky over Egypt-shaped horizon far away, hope, gold accent, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'What bowed down in Joseph\'s dreams?',
      quizHeading: 'Joseph\'s Dreams Questions',
      questions: [
        {
          question: 'In Joseph\'s first dream, what bowed to his sheaf?',
          choices: ['Birds', 'His brothers\' sheaves', 'Camels', 'Stars only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Their sheaves bowed — a picture of honour one day.',
          wrongFeedback:
            'Joseph said, "your sheaves... stood round about, and made obeisance to my sheaf" (Genesis 37:7).'
        },
        {
          question: 'How did the brothers feel when Joseph told the dream?',
          choices: ['They were excited', 'They hated him more', 'They laughed happily', 'They forgot it'],
          correctIndex: 1,
          correctFeedback: 'Right — they did not want him to rule over them.',
          wrongFeedback:
            'The Bible says they hated him yet the more for his dreams and for his words (Genesis 37:8).'
        },
        {
          question: 'What else bowed in his second dream?',
          choices: ['Only animals', 'Sun, moon, and eleven stars', 'Pharaoh', 'A ladder'],
          correctIndex: 1,
          correctFeedback: 'Exactly — a picture of his whole family.',
          wrongFeedback:
            'He told of the sun and moon and eleven stars worshipping him (Genesis 37:9).'
        },
        {
          question: 'What did Jacob do with the saying?',
          choices: ['Forgot it', 'Observed the saying', 'Tore the coat', 'Sent Joseph away'],
          correctIndex: 1,
          correctFeedback: 'Yes — he kept it in mind, even while correcting Joseph.',
          wrongFeedback:
            'Jacob rebuked Joseph gently, but still observed the saying — he wondered what God meant (Genesis 37:11).'
        },
        {
          question: 'What do Joseph\'s dreams teach us about God?',
          choices: ['God breaks promises', 'God\'s plan can be bigger than jealousy', 'Dreams never matter', 'Families never fight'],
          correctIndex: 1,
          correctFeedback: 'Beautiful — God was working a rescue plan for many people.',
          wrongFeedback:
            'Jealousy was loud, but God\'s plan still moved forward — He is faithful.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You learned how God spoke through Joseph\'s dreams!',
      takeaway: 'God\'s plans are sure — even when people do not understand yet.',
      prayer: 'God, help me trust Your plans and speak kindly when others feel jealous. Amen.'
    },
    josephRuler: {
      kjvRef: 'Genesis 41:37–45',
      paragraphs: [
        'Pharaoh dreamed of fat cows and thin cows, and full heads of grain and thin ones. No one could explain it.',
        'Joseph said God would show the meaning: seven good years of food, then seven years of famine.',
        'Pharaoh saw God\'s Spirit was with Joseph. He made Joseph ruler over all Egypt — only Pharaoh was higher.',
        'Joseph rode in a chariot, wore fine linen, and gathered extra grain during the good years.',
        'When famine came, Egypt had bread because Joseph obeyed God. God turned years of pain into years of saving lives.'
      ],
      imagePrompts: [
        'cartoon for kids: Pharaoh on throne listening, Joseph speaking kindly, palace columns, no text',
        'fun illustration: fat cows and thin cows in dream clouds, simple shapes, no text',
        'colorful scene: Joseph in linen with chain, storing grain in big jars, no text',
        'exciting cartoon: Joseph in chariot, respectful crowd, Egyptian skyline, no text',
        'hopeful ending: full storehouses and families receiving bread, warm light, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Who put Joseph in charge — and why?',
      quizHeading: 'Joseph Ruler in Egypt',
      questions: [
        {
          question: 'Who could not explain Pharaoh\'s dreams at first?',
          choices: ['Joseph', 'Pharaoh\'s wise men', 'Jacob', 'Miriam'],
          correctIndex: 1,
          correctFeedback: 'Yes — then Joseph gave God the credit for the answer.',
          wrongFeedback:
            'Pharaoh\'s magicians and wise men could not interpret — Joseph said interpretations belong to God (Genesis 41:8, 16).'
        },
        {
          question: 'What did the dreams mean?',
          choices: ['Seven wars', 'Seven good years then seven famine years', 'Seven boats', 'Seven coats'],
          correctIndex: 1,
          correctFeedback: 'Right! Store food in the good years for the lean years.',
          wrongFeedback:
            'Joseph said seven years of plenty would come, then seven years of grievous famine (Genesis 41:29–31).'
        },
        {
          question: 'What job did Pharaoh give Joseph?',
          choices: ['Shepherd only', 'Ruler over Egypt under Pharaoh', 'Baker', 'Prison guard'],
          correctIndex: 1,
          correctFeedback: 'Exactly — second only to Pharaoh.',
          wrongFeedback:
            'Pharaoh said, "Thou shalt be over my house, and according unto thy word shall all my people be ruled" (Genesis 41:40).'
        },
        {
          question: 'What did Joseph do during the seven full years?',
          choices: ['Hid in the palace', 'Gathered and stored grain', 'Went back to Canaan', 'Burned the fields'],
          correctIndex: 1,
          correctFeedback: 'Yes! He saved up food for the hard years ahead.',
          wrongFeedback:
            'Joseph gathered corn as the sand of the sea — very much — until he stopped counting (Genesis 41:49).'
        },
        {
          question: 'What can we remember about God from this story?',
          choices: ['God forgets prisoners', 'God lifts up the faithful in His time', 'Famine always wins', 'Dreams never help'],
          correctIndex: 1,
          correctFeedback: 'Beautiful — God remembered Joseph and used him to save many.',
          wrongFeedback:
            'Joseph stayed faithful through prison; when God lifted him, many lives were spared.'
        }
      ],
      doneHeading: 'You Did It!',
      doneMessage: 'You saw how God made Joseph a blessing!',
      takeaway: 'God can use faithful people to feed and save others.',
      prayer: 'God, help me be faithful like Joseph and give You the credit. Amen.'
    },
    mosesBaby: {
      kjvRef: 'Exodus 2:1–10; 3:1–10',
      paragraphs: [
        'A wicked king in Egypt was afraid of God\'s people. He ordered Hebrew baby boys thrown into the river.',
        'Moses\' mother hid him as long as she could. Then she made a little ark of bulrushes, put baby Moses inside, and set him among the reeds by the river. His sister Miriam watched nearby.',
        'Pharaoh\'s daughter found the basket. She felt pity and paid Moses\' mother to nurse him. Later Moses grew up in the palace as her son.',
        'When Moses was grown, he fled to the desert. One day he saw a bush on fire — but it did not burn up!',
        'God called from the bush: "Moses, Moses." He told Moses to take off his shoes — the ground was holy. God said, "I AM" — and He would send Moses to help His people.'
      ],
      imagePrompts: [
        'gentle cartoon: mother placing baby in woven basket among river reeds, sister watching, no text',
        'bright scene: princess and handmaids by the water, open basket, soft colors, no text',
        'kid illustration: baby Moses safe in arms, palace hints in background, no text',
        'desert cartoon: burning bush with flame but green leaves, Moses amazed, sandals off, no text',
        'hopeful ending: Moses listening, gentle light from bush, staff at side, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Watch the river — then watch the bush!',
      quizHeading: 'Moses: Basket & Burning Bush',
      questions: [
        {
          question: 'Why was baby Moses hidden?',
          choices: ['He was noisy', 'The king wanted Hebrew baby boys killed', 'He was sick', 'He was lost'],
          correctIndex: 1,
          correctFeedback: 'Yes — Pharaoh\'s command was cruel, but God had a plan.',
          wrongFeedback:
            'Pharaoh told his people to cast Hebrew sons into the river — Moses\' mom hid him instead (Exodus 1:22, 2:2).'
        },
        {
          question: 'Where did Moses\' mother put him?',
          choices: ['In a palace room', 'In an ark of bulrushes on the river', 'In a cave', 'On a camel'],
          correctIndex: 1,
          correctFeedback: 'Right — a small basket-boat among the reeds.',
          wrongFeedback:
            'She made an ark of bulrushes, daubed it, and laid him in the flags by the river (Exodus 2:3).'
        },
        {
          question: 'Who found baby Moses?',
          choices: ['A soldier', 'Pharaoh\'s daughter', 'Jacob', 'Joseph'],
          correctIndex: 1,
          correctFeedback: 'Exactly — she had compassion on the crying baby.',
          wrongFeedback:
            'Pharaoh\'s daughter came down to wash and saw the ark among the flags (Exodus 2:5–6).'
        },
        {
          question: 'What was strange about the burning bush?',
          choices: ['It was plastic', 'It burned but was not consumed', 'It had no leaves', 'It was underwater'],
          correctIndex: 1,
          correctFeedback: 'Yes! God used it to catch Moses\' attention.',
          wrongFeedback:
            'The bush burned with fire, yet the bush was not consumed — Moses turned aside to see (Exodus 3:2–3).'
        },
        {
          question: 'What did God tell Moses at the bush?',
          choices: ['Go fishing', 'Take off thy shoes — holy ground; I will send thee to Pharaoh', 'Build a tower', 'Stay silent'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Moses would go with God\'s help.',
          wrongFeedback:
            'God said draw not nigh hither: put off thy shoes — holy ground — and He would send Moses to Pharaoh (Exodus 3:5, 10).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You learned God saves babies and calls brave hearts!',
      takeaway: 'God protects the small and speaks to those who listen.',
      prayer: 'God, thank You for watching over me. Help me obey when You call. Amen.'
    }
};
