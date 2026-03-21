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
      kjvRef: 'Genesis 40',
      paragraphs: [
        'Joseph was in prison in Egypt. Two of Pharaoh\'s servants were there too: the cupbearer and the baker.',
        'Both had strange dreams. Joseph said, "God will help me understand your dreams."',
        'The cupbearer dreamed of a vine with three branches that produced grapes. Joseph said, "In three days Pharaoh will restore you to your position."',
        'The baker dreamed of three baskets of bread on his head, birds eating from them. Joseph said, "In three days Pharaoh will take your life."',
        'Everything happened as Joseph said. The cupbearer forgot Joseph, but God was still with him in prison.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Joseph talking kindly with cupbearer and baker in a stone room, soft light, no text',
        'fun kid illustration: cupbearer dreaming of vine with three branches and grapes, dream cloud, no text',
        'colorful Bible scene for children: baker dreaming of three baskets on head, birds near bread, worried face, no text',
        'exciting cartoon: Joseph explaining, cupbearer hopeful, baker solemn, simple bars in background, no text',
        'hopeful ending illustration: cupbearer serving at court again, small inset of Joseph still waiting, warm sky, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Joseph helped others even in prison — God was with him!',
      quizHeading: 'Joseph\'s Dreams in Prison',
      questions: [
        {
          question: 'Who was in prison with Joseph?',
          choices: ['His brothers', 'Pharaoh\'s cupbearer and baker', 'The king', 'His father'],
          correctIndex: 1,
          correctFeedback: 'Yes! Pharaoh\'s cupbearer and baker were there too.',
          wrongFeedback:
            'Not his brothers or father. Two of Pharaoh\'s officers were imprisoned with him (Genesis 40:1–3).'
        },
        {
          question: 'What did Joseph say about their dreams?',
          choices: ['They were scary', 'God will help me understand them', 'Forget them', 'Tell Pharaoh first'],
          correctIndex: 1,
          correctFeedback: 'Right! Joseph trusted God to give the meaning.',
          wrongFeedback:
            'He did not say to forget them. He said, "Do not interpretations belong to God?" — God helped him explain (Genesis 40:8).'
        },
        {
          question: 'What did the cupbearer\'s dream mean?',
          choices: ['He would die', 'He would be restored in three days', 'He would escape', 'He would get more wine'],
          correctIndex: 1,
          correctFeedback: 'Yes! In three days he would be back serving Pharaoh.',
          wrongFeedback:
            'Not death or escape. Joseph said the three branches meant three days until Pharaoh lifted up his head — restored (Genesis 40:12–13).'
        },
        {
          question: 'What happened to the baker?',
          choices: ['He was freed', 'Pharaoh took his life in three days', 'He became king', 'He got new baskets'],
          correctIndex: 1,
          correctFeedback: 'Correct! In three days it happened as Joseph said.',
          wrongFeedback:
            'The birds eating from the baskets meant Pharaoh would lift up his head — off from him. It was sad news (Genesis 40:16–19).'
        },
        {
          question: 'What can we learn from Joseph in prison?',
          choices: ['God forgets us in hard times', 'God is with us and uses us to help others', 'Dreams are not important', 'Prison is fun'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Even in prison, God was with Joseph and used him to help others.',
          wrongFeedback:
            'The story shows God never left Joseph. He gave him wisdom to understand dreams and comfort the prisoners!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star for seeing God\'s faithfulness in hard times!',
      takeaway: 'God is with us everywhere — even in prison — and can use us to help others.',
      prayer: 'God, thank You for being with me always. Help me help others even when things are hard. Amen.'
    },
    josephRuler: {
      kjvRef: 'Genesis 41',
      paragraphs: [
        'Pharaoh had two dreams: seven fat cows eaten by seven thin cows, and seven good heads of grain eaten by seven thin ones.',
        'No one could explain the dreams. The cupbearer remembered Joseph and told Pharaoh about him.',
        'Joseph was brought from prison. He said, "God will give Pharaoh the meaning. Seven good years are coming, then seven bad years of famine."',
        'Joseph advised, "Choose a wise man to store food during the good years." Pharaoh said, "You are wise — you will be in charge."',
        'Joseph became ruler over Egypt. He stored food. When famine came, his family came for food — and God\'s plan brought them together again.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Pharaoh dreaming of seven fat cows and seven thin cows by the river, no text',
        'fun kid illustration: Pharaoh dreaming of seven good grain heads and thin ones eating them, worried face, no text',
        'colorful Bible scene for children: Joseph before Pharaoh on throne, explaining dreams, no text',
        'exciting cartoon: Joseph in fine clothes, grain being stored in jars, busy helpers, no text',
        'happy ending illustration: brothers bowing before Joseph in Egypt, tears and forgiveness mood, soft light, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Joseph went from prison to ruler — God had a plan!',
      quizHeading: 'Joseph Becomes Ruler Questions',
      questions: [
        {
          question: 'What did Pharaoh dream about?',
          choices: ['Cows and grain', 'Ships and gold', 'Mountains and rivers', 'Stars and moon'],
          correctIndex: 0,
          correctFeedback: 'Yes! Seven fat cows eaten by thin ones, and grain the same.',
          wrongFeedback:
            'Not ships or stars. Pharaoh dreamed of cows and grain — seven good and seven bad (Genesis 41:1–7).'
        },
        {
          question: 'Who remembered Joseph and told Pharaoh?',
          choices: ['His brothers', 'The cupbearer', 'The baker', 'His father'],
          correctIndex: 1,
          correctFeedback: 'Right! The cupbearer remembered Joseph from prison.',
          wrongFeedback:
            'His brothers were not there. The chief butler remembered Joseph could interpret dreams (Genesis 41:9–13).'
        },
        {
          question: 'What did the dreams mean?',
          choices: ['Seven good years then seven bad years of famine', 'Seven parties', 'Seven new friends', 'Seven animals'],
          correctIndex: 0,
          correctFeedback: 'Exactly! God showed seven good years followed by seven years of need.',
          wrongFeedback:
            'Not parties or friends. Joseph said seven years of plenty, then seven years of famine (Genesis 41:29–31).'
        },
        {
          question: 'What did Pharaoh do after Joseph explained?',
          choices: ['Put him back in prison', 'Made him ruler over Egypt', 'Gave him food only', 'Sent him home'],
          correctIndex: 1,
          correctFeedback: 'Yes! Pharaoh set Joseph over the land — second only to himself.',
          wrongFeedback:
            'Not back to prison. Pharaoh saw God\'s wisdom in Joseph and made him ruler (Genesis 41:39–41).'
        },
        {
          question: 'What can we learn from Joseph becoming ruler?',
          choices: ['God forgets us', 'God has a plan and uses hard times for good', 'Dreams are silly', 'Be jealous'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God turned Joseph\'s hard years into blessing for many.',
          wrongFeedback:
            'The story shows God had a plan. What others meant for harm, God used for good!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God has a plan!',
      takeaway: 'God can use hard times for good — trust His plan.',
      prayer: 'God, thank You for having a plan for me. Help me trust You in hard times. Amen.'
    },
    mosesBaby: {
      kjvRef: 'Exodus 2:1–10',
      paragraphs: [
        'A baby boy was born to a Hebrew family. The king said all Hebrew boys must be thrown in the river.',
        'The mother hid the baby for three months. Then she made a basket of reeds, put him in it, and placed it in the river among the reeds.',
        'The baby\'s sister Miriam watched from a distance.',
        'Pharaoh\'s daughter came to bathe in the river. She saw the basket and opened it. She felt sorry for the baby and said, "This is one of the Hebrew babies."',
        'Miriam asked if she could get a Hebrew nurse. Pharaoh\'s daughter said yes. The mother nursed him until he was older, then he became Pharaoh\'s daughter\'s son — named Moses.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Hebrew mother hiding baby Moses, gentle and loving, no text',
        'fun kid illustration: mother making basket of reeds, baby inside, floating among river reeds, no text',
        'colorful Bible scene for children: Miriam watching the basket from the riverbank, hopeful, no text',
        'exciting cartoon: Pharaoh\'s daughter finding the basket in reeds, opening it, baby crying softly, no text',
        'happy ending illustration: baby with princess, mother as nurse nearby, warm safe mood, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God protected baby Moses in a special way!',
      quizHeading: 'Moses in the Basket Questions',
      questions: [
        {
          question: 'Why did the mother hide baby Moses?',
          choices: ['He was noisy', 'The king wanted to hurt Hebrew boys', 'He was sick', 'She didn\'t want him'],
          correctIndex: 1,
          correctFeedback: 'Yes! The king ordered Hebrew boys cast into the river.',
          wrongFeedback:
            'Not noise or sickness. Pharaoh\'s command was cruel toward Hebrew baby boys (Exodus 1:22).'
        },
        {
          question: 'What did the mother make for the baby?',
          choices: ['A toy', 'A basket of reeds', 'A boat', 'A blanket'],
          correctIndex: 1,
          correctFeedback: 'Right! An ark of bulrushes, daubed with slime and pitch.',
          wrongFeedback:
            'She made an ark of bulrushes for him and laid it among the flags by the river (Exodus 2:3).'
        },
        {
          question: 'Who watched the basket?',
          choices: ['The father', 'Miriam (sister)', 'The king', 'A soldier'],
          correctIndex: 1,
          correctFeedback: 'Yes! Miriam watched to see what would happen.',
          wrongFeedback:
            'His sister stood afar off to know what would be done to him (Exodus 2:4).'
        },
        {
          question: 'Who found the baby?',
          choices: ['A fisherman', 'Pharaoh\'s daughter', 'A shepherd', 'The mother'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Pharaoh\'s daughter had compassion on him.',
          wrongFeedback:
            'Pharaoh\'s daughter came down to wash and saw the ark among the flags (Exodus 2:5–6).'
        },
        {
          question: 'What can we learn from Moses in the basket?',
          choices: ['God doesn\'t protect babies', 'God protects His people even in danger', 'Rivers are always safe', 'Hide everything'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God watched over baby Moses and used Pharaoh\'s daughter to save him.',
          wrongFeedback:
            'The story shows God\'s care. Even when the king was cruel, God saved Moses for His purpose!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God protects His people!',
      takeaway: 'God protects us and has a plan, even when things look scary.',
      prayer: 'God, thank You for protecting me. Help me trust Your plan. Amen.'
    },
    mosesBush: {
      kjvRef: 'Exodus 3:1–4:17',
      paragraphs: [
        'Moses was taking care of sheep in the desert. He saw a bush on fire — but it didn\'t burn up!',
        'God called to him from the bush: "Moses! Moses!" Moses said, "Here I am."',
        'God said, "I am the God of Abraham, Isaac, and Jacob. I have seen my people suffering in Egypt. Go to Pharaoh and bring them out."',
        'Moses was afraid. He said, "Who am I? They won\'t listen to me." God said, "I will be with you."',
        'God gave Moses signs: his staff turned into a serpent, then back. God said, "I AM THAT I AM" — go in My name.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Moses tending sheep in desert, burning bush with green leaves, no text',
        'fun kid illustration: Moses taking off sandals, holy ground, gentle fire glow, no text',
        'colorful Bible scene for children: voice from bright bush, Moses listening, desert mountains, no text',
        'exciting cartoon: staff becoming serpent then staff again, simple shapes, surprised face, no text',
        'hopeful ending illustration: Moses with staff, path toward Egypt, light ahead, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God spoke to Moses from a burning bush — what a miracle!',
      quizHeading: 'Burning Bush Questions',
      questions: [
        {
          question: 'What was Moses doing when he saw the burning bush?',
          choices: ['Farming', 'Tending sheep', 'Building', 'Sleeping'],
          correctIndex: 1,
          correctFeedback: 'Yes! He kept the flock of Jethro in the desert.',
          wrongFeedback:
            'Not farming. Moses led the flock to the backside of the desert and came to Horeb (Exodus 3:1).'
        },
        {
          question: 'What was special about the bush?',
          choices: ['It was gold', 'It burned but didn\'t burn up', 'It sang', 'It grew fruit'],
          correctIndex: 1,
          correctFeedback: 'Right! The bush burned with fire, yet was not consumed.',
          wrongFeedback:
            'The angel of the Lord appeared in a flame of fire out of the midst of a bush — it was not consumed (Exodus 3:2).'
        },
        {
          question: 'What did God tell Moses to do?',
          choices: ['Stay in the desert', 'Go to Pharaoh and bring Israel out of Egypt', 'Build a temple', 'Forget the people'],
          correctIndex: 1,
          correctFeedback: 'Yes! God sent Moses to bring His people out.',
          wrongFeedback:
            'God said, "Come now therefore, and I will send thee unto Pharaoh, that thou mayest bring forth my people" (Exodus 3:10).'
        },
        {
          question: 'What did Moses say when God called him?',
          choices: ['Who are you?', 'Here I am', 'Go away', 'I\'m busy'],
          correctIndex: 1,
          correctFeedback: 'Exactly! "Here am I" — ready to listen.',
          wrongFeedback:
            'He answered, "Here am I" when God called his name (Exodus 3:4).'
        },
        {
          question: 'What did God say His name is?',
          choices: ['I AM THAT I AM', 'King of kings', 'Lord of light', 'Maker of stars'],
          correctIndex: 0,
          correctFeedback: 'Perfect! "I AM THAT I AM" — God is eternal.',
          wrongFeedback:
            'God said unto Moses, "I AM THAT I AM" — tell Israel "I AM" hath sent me (Exodus 3:14).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God calls us too!',
      takeaway: 'God sees our suffering and calls us to help others — He is with us.',
      prayer: 'God, thank You for seeing us and calling us. Help me say "Here I am" to You. Amen.'
    },
    redSea: {
      kjvRef: 'Exodus 14',
      paragraphs: [
        'Moses led God\'s people out of Egypt. Pharaoh changed his mind and chased them with chariots.',
        'The people were trapped — the Red Sea was in front, Pharaoh\'s army behind. They were afraid.',
        'Moses said, "Fear ye not, stand still, and see the salvation of the Lord."',
        'God told Moses to stretch out his staff. The sea divided — dry ground appeared between walls of water!',
        'The people walked through on dry land. When the army followed, God brought the waters together — God\'s people were safe.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Israelites leaving Egypt, Moses leading, chariots far behind, no text',
        'fun kid illustration: sea ahead, army behind, worried crowd, no text',
        'colorful Bible scene for children: Moses stretching rod over sea, wind and water moving, no text',
        'exciting cartoon: dry path between tall walls of water, families walking safely, no text',
        'happy ending illustration: people on far shore praising, calm sea, sunrise hope, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God made a way when there seemed to be no way!',
      quizHeading: 'Red Sea Questions',
      questions: [
        {
          question: 'Why were the people afraid at the Red Sea?',
          choices: ['It was dark', 'Pharaoh\'s army was chasing them', 'They were hungry', 'They forgot Moses'],
          correctIndex: 1,
          correctFeedback: 'Yes! The army was behind and the sea in front.',
          wrongFeedback:
            'Pharaoh and his host followed after them with horses and chariots (Exodus 14:9).'
        },
        {
          question: 'What did Moses tell the people?',
          choices: ['Run away', 'Fear not — stand still and see God save you', 'Fight alone', 'Go home'],
          correctIndex: 1,
          correctFeedback: 'Right! Stand still — the Lord will fight for you.',
          wrongFeedback:
            'Moses said, "Fear ye not, stand still, and see the salvation of the Lord" (Exodus 14:13).'
        },
        {
          question: 'What did God tell Moses to do?',
          choices: ['Run', 'Stretch out your staff over the sea', 'Shout loud', 'Pray only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Moses stretched his rod — the Lord drove the sea back.',
          wrongFeedback:
            'God said lift up thy rod, and stretch out thine hand over the sea, and divide it (Exodus 14:16).'
        },
        {
          question: 'What happened when the people walked through?',
          choices: ['They swam', 'They walked on dry ground between walls of water', 'They sank', 'The army helped'],
          correctIndex: 1,
          correctFeedback: 'Exactly! A dry path in the midst of the sea.',
          wrongFeedback:
            'The children of Israel went upon dry ground in the midst of the sea (Exodus 14:22).'
        },
        {
          question: 'What does the Red Sea teach us?',
          choices: ['God leaves us trapped', 'God makes a way when there seems to be none', 'Armies always win', 'Don\'t trust leaders'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God delivers His people.',
          wrongFeedback:
            'The Lord saved Israel that day — He can make a way through what looks impossible!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God makes a way!',
      takeaway: 'When we feel trapped, God can make a way — trust Him.',
      prayer: 'God, when I feel stuck, show me Your way. Thank You for Your power. Amen.'
    },
    tenCommandments: {
      kjvRef: 'Exodus 20:1–17',
      paragraphs: [
        'God led His people out of Egypt. They came to Mount Sinai. There was thunder, lightning, and a thick cloud.',
        'God came down on the mountain in fire. He spoke the Ten Commandments to the people.',
        'The first four are about loving God: No other gods, no idols, no wrong use of God\'s name, keep the Sabbath holy.',
        'The last six are about loving others: Honour parents, no murder, no adultery, no stealing, no false witness, no coveting.',
        'The people were afraid and asked Moses to speak to God for them. God gave the commandments so they could live His way.'
      ],
      imagePrompts: [
        'bright bouncy cartoon for kids: Mount Sinai with thunder clouds, lightning, fire on top, people at bottom, no text',
        'fun kid illustration: God speaking from mountain, two stone tablets, Moses listening, no text',
        'colorful Bible scene for children: people trembling at base of mountain, Moses with God above, no text',
        'exciting cartoon: two stone tablets glowing, simple symbols suggesting love for God and neighbour, no text',
        'happy ending illustration: families learning together, peaceful camp, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God gave rules because He loves us!',
      quizHeading: 'Ten Commandments Questions',
      questions: [
        {
          question: 'Where did God give the Ten Commandments?',
          choices: ['In Egypt', 'At Mount Sinai', 'In the desert only', 'In Canaan'],
          correctIndex: 1,
          correctFeedback: 'Yes! At Mount Sinai after leaving Egypt.',
          wrongFeedback:
            'Not Egypt or Canaan. God spoke from the mountain with thunder and fire (Exodus 19–20).'
        },
        {
          question: 'How many commandments did God give?',
          choices: ['Five', 'Ten', 'Twenty', 'One hundred'],
          correctIndex: 1,
          correctFeedback: 'Right! Ten special rules to help us love God and people.',
          wrongFeedback:
            'Not five or twenty. God gave exactly ten commandments (Exodus 20:1–17).'
        },
        {
          question: 'What are the first four commandments about?',
          choices: ['Loving others', 'Loving God', 'Eating food', 'Building houses'],
          correctIndex: 1,
          correctFeedback: 'Yes! They tell us how to love and honour God.',
          wrongFeedback:
            'Not others or food. The first four are about God: no other gods, no idols, honour His name, keep the Sabbath holy.'
        },
        {
          question: 'What does "honour thy father and thy mother" mean?',
          choices: ['Obey and respect them', 'Ignore them', 'Give them gifts only', 'Fight with them'],
          correctIndex: 0,
          correctFeedback: 'Perfect! Honour means obey and respect parents — it is one of God\'s rules.',
          wrongFeedback:
            'Not ignore or fight. God said to honour father and mother that thy days may be long (Exodus 20:12).'
        },
        {
          question: 'Why did God give the commandments?',
          choices: ['To make life hard', 'To help us live His way and love others', 'To punish us', 'To confuse us'],
          correctIndex: 1,
          correctFeedback: 'Yes! God gave rules out of love — to help us live right.',
          wrongFeedback:
            'Not to punish or confuse. They teach His people to love Him and each other well.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star for learning God\'s rules!',
      takeaway: 'God gave rules because He loves us — they show us how to love Him and others.',
      prayer: 'God, thank You for Your rules. Help me obey them with a happy heart. Amen.'
    },
    goldenCalf: {
      kjvRef: 'Exodus 32',
      paragraphs: [
        'Moses went up Mount Sinai to talk with God. The people waited a long time.',
        'They got impatient. They asked Aaron, "Make us gods to go before us." Aaron made a golden calf from their jewellery.',
        'The people said, "These be thy gods, O Israel, which brought thee up out of the land of Egypt!" They had a feast and worshiped the calf.',
        'God told Moses the people had corrupted themselves. Moses was angry and broke the stone tablets when he saw the calf.',
        'Moses prayed for the people. God forgave in mercy, but sin still had serious consequences. God still loved His people.'
      ],
      imagePrompts: [
        'bright cartoon for kids: people waiting at base of Mount Sinai, Moses up the mountain, no text',
        'fun kid illustration: Aaron and people bringing gold, shaping a calf figure, no text',
        'colorful Bible scene for children: crowd celebrating wrongly near a golden calf, teachable not party-glorifying, no text',
        'exciting cartoon: Moses coming down with tablets, seeing the camp, broken tablets at feet, no text',
        'hopeful ending illustration: Moses praying upward, people bowing heads sorry, soft light, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The people forgot God quickly — what did they do wrong?',
      quizHeading: 'Golden Calf Questions',
      questions: [
        {
          question: 'Why did the people make a golden calf?',
          choices: ['They were hungry', 'Moses was gone too long and they got impatient', 'They wanted a new pet', 'God told them to'],
          correctIndex: 1,
          correctFeedback: 'Yes! They got tired of waiting and wanted something to lead them.',
          wrongFeedback:
            'Not hunger or a pet. Moses was up the mountain a long time, so they asked Aaron to make gods (Exodus 32:1).'
        },
        {
          question: 'What did Aaron do with the people\'s gold?',
          choices: ['Hid it', 'Made a golden calf', 'Gave it to Moses', 'Threw it away'],
          correctIndex: 1,
          correctFeedback: 'Right! He melted it and shaped a calf idol.',
          wrongFeedback:
            'Not hide or throw. Aaron fashioned it with a graving tool after he received their golden earrings (Exodus 32:2–4).'
        },
        {
          question: 'What did the people say about the calf?',
          choices: ['These be thy gods, O Israel, which brought thee up', 'This is a toy', 'This is Moses', 'This is food'],
          correctIndex: 0,
          correctFeedback: 'Yes! They worshiped the calf instead of the Lord.',
          wrongFeedback:
            'They did not call it a toy. They said, "These be thy gods, O Israel, which brought thee up out of the land of Egypt" (Exodus 32:4).'
        },
        {
          question: 'How did Moses react when he came down?',
          choices: ['He danced with them', 'He broke the stone tablets', 'He joined the feast', 'He ignored it'],
          correctIndex: 1,
          correctFeedback: 'Correct! Moses was angry and broke the tablets.',
          wrongFeedback:
            'He did not join them. His anger waxed hot, and he cast the tablets out of his hands and broke them (Exodus 32:19).'
        },
        {
          question: 'What can we learn from the golden calf?',
          choices: ['Make idols when waiting', 'Worship God only', 'Forget God\'s rules', 'Gold is best'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Worship God alone — do not make idols or forget Him.',
          wrongFeedback:
            'Impatience led to awful sin. God wants our whole heart — no substitutes!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star for remembering to worship God only!',
      takeaway: 'Worship God alone — don\'t let impatience lead to wrong choices.',
      prayer: 'God, help me worship only You. Keep my heart true. Amen.'
    },
    spiesInCanaan: {
      kjvRef: 'Numbers 13–14',
      paragraphs: [
        'God told Moses to send twelve spies into Canaan, the promised land.',
        'The spies came back after forty days. Ten said, "The land is good but the people are giants — we cannot win."',
        'Joshua and Caleb said, "The land is wonderful! God is with us — let us go up at once and possess it."',
        'The people listened to the ten fearful spies and wept. They wanted to go back to Egypt.',
        'God was grieved by their unbelief. That generation would not enter the land — only their children would. God still kept His promise.'
      ],
      imagePrompts: [
        'bright cartoon for kids: twelve men exploring green hills and vineyards, big grape cluster, no text',
        'fun kid illustration: two men carrying huge grapes on a pole between them, amazed faces, no text',
        'colorful Bible scene for children: ten men looking scared at shadow of giants, two men standing brave, no text',
        'exciting cartoon: crowd weeping, Moses and Aaron bowed, desert tents, no text',
        'hopeful ending illustration: Joshua and Caleb strong in foreground, younger generation beyond, sunrise, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Two spies trusted God — the others were afraid!',
      quizHeading: 'Spies in Canaan Questions',
      questions: [
        {
          question: 'How many spies did Moses send?',
          choices: ['Two', 'Ten', 'Twelve', 'Forty'],
          correctIndex: 2,
          correctFeedback: 'Yes! Twelve spies — one from each tribe.',
          wrongFeedback:
            'Not two or ten. Moses sent twelve men to search the land of Canaan (Numbers 13:1–3).'
        },
        {
          question: 'What did the spies find in Canaan?',
          choices: ['A desert', 'A land flowing with milk and honey', 'Only giants', 'Nothing'],
          correctIndex: 1,
          correctFeedback: 'Right! It was beautiful and full of good things.',
          wrongFeedback:
            'They brought back one cluster of grapes so big two men carried it — it flowed with milk and honey (Numbers 13:27).'
        },
        {
          question: 'Who said God would help them take the land?',
          choices: ['The ten spies', 'Joshua and Caleb', 'Moses only', 'The whole crowd'],
          correctIndex: 1,
          correctFeedback: 'Yes! Joshua and Caleb trusted God.',
          wrongFeedback:
            'The ten brought an evil report. Caleb said, "Let us go up at once, and possess it; for we are well able to overcome it" (Numbers 13:30).'
        },
        {
          question: 'What did the people want to do after hearing the report?',
          choices: ['Go in and take the land', 'Go back to Egypt', 'Stay quiet', 'Fight the giants alone'],
          correctIndex: 1,
          correctFeedback: 'Correct! They wanted to return — that showed unbelief.',
          wrongFeedback:
            'They said, "Let us make a captain, and let us return into Egypt" (Numbers 14:4).'
        },
        {
          question: 'What can we learn from the spies?',
          choices: ['Be afraid of big problems', 'Trust God even when things look hard', 'Always follow the crowd', 'Give up easily'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Trust God — He keeps His promises.',
          wrongFeedback:
            'The ten saw giants. Joshua and Caleb saw God. Faith is stronger than fear!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star for trusting God\'s promises!',
      takeaway: 'Trust God\'s promises — don\'t let fear stop you.',
      prayer: 'God, help me trust Your promises even when things look scary. Amen.'
    },
    rahabJericho: {
      kjvRef: 'Joshua 2; 6:22–25',
      paragraphs: [
        'Joshua sent two spies into Jericho. A woman named Rahab hid them on her roof.',
        'The king\'s men came looking for the spies. Rahab said they had gone another way — and helped the men escape by a rope from her window.',
        'Rahab said, "I know that the LORD hath given you the land." She asked them to save her family when God gave the city.',
        'The spies told her to bind a scarlet cord in her window. When the walls fell, Joshua sent them to bring out Rahab and all hers.',
        'Rahab believed in God and was saved. She became part of God\'s people.'
      ],
      imagePrompts: [
        'bright cartoon for kids: two spies on a flat roof, Rahab quietly helping, clay houses, no text',
        'fun kid illustration: Rahab at door speaking calmly to soldiers, spies hidden, no text',
        'colorful Bible scene for children: rope from window at night, spies lowering safely, no text',
        'exciting cartoon: scarlet cord hanging from window, city wall behind, no text',
        'happy ending illustration: Rahab with family safe, walls fallen in distance, gentle light, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Rahab believed in God and helped His people!',
      quizHeading: 'Rahab Questions',
      questions: [
        {
          question: 'Who hid the spies in Jericho?',
          choices: ['The king', 'Rahab', 'Joshua', 'The priests'],
          correctIndex: 1,
          correctFeedback: 'Yes! Rahab hid them on her roof.',
          wrongFeedback:
            'Not the king or Joshua. Rahab took the men and hid them on the roof of her house (Joshua 2:4–6).'
        },
        {
          question: 'What did Rahab do when the king\'s men came?',
          choices: ['Gave up the spies', 'Sent the searchers another way and hid the spies', 'Helped capture them', 'Ran away'],
          correctIndex: 1,
          correctFeedback: 'Right! She protected them and pointed the soldiers elsewhere.',
          wrongFeedback:
            'She did not give them up. She hid the spies and said they had gone out when it was dark (Joshua 2:4–5).'
        },
        {
          question: 'What did Rahab ask the spies?',
          choices: ['Harm my family', 'Save my family when you take the city', 'Give me gold only', 'Leave me alone'],
          correctIndex: 1,
          correctFeedback: 'Yes! She believed in God and asked for kindness.',
          wrongFeedback:
            'She said she knew the Lord had given them the land and asked to save her father\'s household alive (Joshua 2:12–13).'
        },
        {
          question: 'What was the sign for Rahab\'s house?',
          choices: ['A flag', 'A scarlet cord in the window', 'A lamp', 'A door mark'],
          correctIndex: 1,
          correctFeedback: 'Exactly! A scarlet line in the window.',
          wrongFeedback:
            'She bound the line of scarlet thread in the window as the token (Joshua 2:18).'
        },
        {
          question: 'What can we learn from Rahab?',
          choices: ['Hide from God\'s people', 'Believe in God and help others', 'Fear only kings', 'Keep every secret'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Rahab believed and acted bravely — God saved her.',
          wrongFeedback:
            'She trusted the Lord God of heaven and earth — faith changes everything!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — faith saves!',
      takeaway: 'Faith in God saves us — even when we were far from Him.',
      prayer: 'God, thank You for saving anyone who believes in You. Help my faith grow. Amen.'
    },
    joshuaAi: {
      kjvRef: 'Joshua 8',
      paragraphs: [
        'After Jericho, Joshua led the people against the city of Ai.',
        'The first attack failed because Achan had taken things God said belonged to Him from Jericho.',
        'God told Joshua to remove the sin from the camp. Achan confessed, and the trouble was purged.',
        'God gave a new plan: part of the army hid, part pretended to flee. The men of Ai chased Israel.',
        'The hidden soldiers took the city. God gave the victory when the people obeyed.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Joshua leading people toward a small city on a hill, no text',
        'fun kid illustration: soldiers turning back, battle not going well, surprised faces, no text',
        'colorful Bible scene for children: serious moment of truth — hidden things brought out, humble colours, no text',
        'exciting cartoon: ambush diagram style — some soldiers hiding, some running as decoy, simple and clear, no text',
        'happy ending illustration: people thankful, city quiet, dawn light, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Sin caused trouble, but God gave a new plan!',
      quizHeading: 'Battle of Ai Questions',
      questions: [
        {
          question: 'Why did the first attack on Ai fail?',
          choices: ['Too many soldiers', 'Sin in the camp — Achan disobeyed God', 'Bad weather', 'No plan'],
          correctIndex: 1,
          correctFeedback: 'Yes! One man\'s disobedience brought defeat.',
          wrongFeedback:
            'Israel could not stand before their enemies because accursed thing was in the camp (Joshua 7:11–12).'
        },
        {
          question: 'What did God tell Joshua to do?',
          choices: ['Give up', 'Remove the sin from the camp', 'Attack again the same way', 'Build a wall'],
          correctIndex: 1,
          correctFeedback: 'Right! Deal with the sin first.',
          wrongFeedback:
            'God said to sanctify the people — the trespass must be put away before victory (Joshua 7:13).'
        },
        {
          question: 'What was the new plan for Ai?',
          choices: ['Full frontal attack only', 'Ambush with hidden soldiers', 'Wait forever', 'Run away'],
          correctIndex: 1,
          correctFeedback: 'Yes! Hide part of the army, draw the city out, then take it.',
          wrongFeedback:
            'Joshua laid an ambush behind the city as the Lord commanded (Joshua 8:3–8).'
        },
        {
          question: 'What happened when the men of Ai chased Israel?',
          choices: ['They caught everyone', 'The hidden men took the city', 'They turned back', 'Rain stopped them'],
          correctIndex: 1,
          correctFeedback: 'Correct! The trap worked — the city was left open.',
          wrongFeedback:
            'When Ai pursued Joshua\'s men, those in ambush rose and entered the city (Joshua 8:19).'
        },
        {
          question: 'What can we learn from Ai?',
          choices: ['Sin does not matter', 'Obedience brings victory', 'Always charge first', 'Hide from problems'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Turn from sin and obey God — He helps His people win.',
          wrongFeedback:
            'Sin blocked God\'s help; when the camp was clean, He fought for them again!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star for learning obedience matters!',
      takeaway: 'Obedience to God brings victory — deal with sin quickly.',
      prayer: 'God, help me obey You and turn from sin. Thank You for victory. Amen.'
    },
    balaamDonkey: {
      kjvRef: 'Numbers 22:21–35',
      paragraphs: [
        'King Balak hired Balaam to curse Israel. Balaam started on his donkey to go to Balak.',
        'God sent an angel with a sword to block the path. The donkey saw the angel and stopped.',
        'Balaam beat the donkey to move it. God opened the donkey\'s mouth — it spoke!',
        'The donkey said, "What have I done unto thee?" Balaam was angry — he answered the donkey!',
        'Then God opened Balaam\'s eyes — he saw the angel. The angel said, "Go with the men: but only the word that I shall speak unto thee, that thou shalt speak."'
      ],
      imagePrompts: [
        'bright bouncy cartoon for kids: Balaam riding donkey on narrow path, angel with sword blocking way, donkey stopping, no text',
        'fun kid illustration: donkey looking at angel, Balaam confused and angry, striking donkey, no text',
        'colorful Bible scene for children: donkey speaking to Balaam, Balaam surprised, miracle moment, no text',
        'exciting cartoon: Balaam seeing the angel with sword, donkey beside him, humble light, no text',
        'hopeful ending illustration: Balaam bowing to angel, ready to obey God, path ahead, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God used a donkey to stop Balaam from doing wrong!',
      quizHeading: 'Balaam & Talking Donkey Questions',
      questions: [
        {
          question: 'Why was Balaam going to Balak?',
          choices: ['To bless Israel', 'To curse Israel', 'To join Israel', 'To fight Balak'],
          correctIndex: 1,
          correctFeedback: 'Yes! Balak wanted Balaam to curse God\'s people.',
          wrongFeedback:
            'Not bless or join. Balak hired Balaam to curse Israel so he could defeat them (Numbers 22:6).'
        },
        {
          question: 'What did the donkey see that Balaam didn\'t?',
          choices: ['Food', 'An angel with a sword', 'A friend', 'A river'],
          correctIndex: 1,
          correctFeedback: 'Right! The donkey saw the angel blocking the path.',
          wrongFeedback:
            'Not food or friend. The donkey saw the angel of the Lord standing in the way (Numbers 22:23).'
        },
        {
          question: 'What happened when Balaam beat the donkey?',
          choices: ['Donkey ran faster', 'Donkey spoke to him', 'Donkey disappeared', 'Angel left'],
          correctIndex: 1,
          correctFeedback: 'Exactly! God made the donkey talk: "What have I done unto thee?"',
          wrongFeedback:
            'The donkey did not run away. The Lord opened the mouth of the ass (Numbers 22:28).'
        },
        {
          question: 'What did God do after Balaam saw the angel?',
          choices: ['Punished Balaam forever', 'Told him to go but speak only God\'s words', 'Sent him home only', 'Made him king'],
          correctIndex: 1,
          correctFeedback: 'Yes! Go with the men — but say only what God says.',
          wrongFeedback:
            'The angel said go with the men, but only the word God would give him might he speak (Numbers 22:35).'
        },
        {
          question: 'What can we learn from the talking donkey?',
          choices: ['Donkeys always talk', 'God can use anything to warn us', 'Ignore trouble', 'Travel alone'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God can use even a donkey to stop us from wrong paths.',
          wrongFeedback:
            'The miracle shows God\'s care — He stopped Balaam from harming Israel with a curse!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God speaks in surprising ways!',
      takeaway: 'God can use anything to guide us — listen to His warnings.',
      prayer: 'God, thank You for protecting me. Help me listen when You speak. Amen.'
    },
    balaakCurse: {
      kjvRef: 'Numbers 22:1–20',
      paragraphs: [
        'Israel was strong after the Exodus. King Balak of Moab was afraid they would take his land.',
        'Balak sent messengers to Balaam: "Come curse this people so I can defeat them."',
        'Balaam asked God. God said, "Thou shalt not go with them; thou shalt not curse the people: for they are blessed."',
        'Balak sent more important men with more money. Balaam wanted the reward.',
        'God allowed Balaam to go with them but warned him — he must speak only what God said. Balaam went.'
      ],
      imagePrompts: [
        'bright cartoon for kids: King Balak watching Israel camp from a hill, worried face, no text',
        'fun kid illustration: messengers offering Balaam money and gifts to curse Israel, Balaam thinking, no text',
        'colorful Bible scene for children: Balaam praying to God about going with messengers, no text',
        'exciting cartoon: more important men arriving at Balaam\'s house, bigger rewards promised, no text',
        'hopeful ending illustration: Balaam on donkey heading toward Moab, angel light far off, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Balak wanted curses — but God protects His people!',
      quizHeading: 'Balak Hires Balaam Questions',
      questions: [
        {
          question: 'Why was Balak afraid of Israel?',
          choices: ['They were weak', 'They were strong and growing', 'They were far away', 'They had no food'],
          correctIndex: 1,
          correctFeedback: 'Yes! Israel was victorious — Balak feared them.',
          wrongFeedback:
            'Not weak. Moab was sore afraid of the children of Israel (Numbers 22:2–3).'
        },
        {
          question: 'What did Balak ask Balaam to do?',
          choices: ['Bless Israel', 'Curse Israel', 'Join Israel', 'Ignore Israel'],
          correctIndex: 1,
          correctFeedback: 'Right! Curse Israel so Balak could win.',
          wrongFeedback:
            'Not bless. Balak wanted Balaam to curse this people (Numbers 22:6).'
        },
        {
          question: 'What did God say the first time Balaam asked?',
          choices: ['Go curse them', 'Do not go with them — do not curse; they are blessed', 'Take the money', 'Stay home only'],
          correctIndex: 1,
          correctFeedback: 'Yes! God said not to curse — Israel is blessed.',
          wrongFeedback:
            'God said, "Thou shalt not curse the people: for they are blessed" (Numbers 22:12).'
        },
        {
          question: 'Why did Balaam want to go the second time?',
          choices: ['To help Israel', 'For the reward and honour', 'To see the king only', 'To make friends'],
          correctIndex: 1,
          correctFeedback: 'Correct! Tempted by money and position.',
          wrongFeedback:
            'Balak promised to promote Balaam to very great honour (Numbers 22:17).'
        },
        {
          question: 'What can we learn from Balaam\'s choice?',
          choices: ['Always take money', 'Obey God even when tempted', 'Curse others', 'Ignore God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Obey God — don\'t let greed lead you wrong.',
          wrongFeedback:
            'Temptation is strong, but God wants obedience over rewards!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God protects His people!',
      takeaway: 'God\'s blessings are stronger than any curse — obey Him.',
      prayer: 'God, thank You for blessing me. Help me obey You always. Amen.'
    },
    balaamBlessing: {
      kjvRef: 'Numbers 23–24',
      paragraphs: [
        'Balaam went to Balak. Balak built altars and offered sacrifices.',
        'Balaam asked God what to say. God put blessings in his mouth — not curses!',
        'Three times Balak took Balaam to different places to curse Israel. Each time Balaam blessed them more.',
        'Balak was angry: "I hired you to curse — not bless!" Balaam said, "Must I not take heed to speak that which the LORD hath put in my mouth?"',
        'Balaam prophesied, "How goodly are thy tents, O Jacob, and thy tabernacles, O Israel!" No curse could stand against God\'s people.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Balaam and Balak on mountain, altars with sacrifices, no text',
        'fun kid illustration: Balaam speaking blessings over Israel camp, Balak surprised, no text',
        'colorful Bible scene for children: second location, Balaam blessing again, Balak angry, no text',
        'exciting cartoon: third try, Balaam prophesying good things, Israel camp peaceful below, no text',
        'happy ending illustration: tents in valley, soft light, sense of God protecting Israel, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God turned every curse attempt into a blessing!',
      quizHeading: 'Balaam Blesses Israel Questions',
      questions: [
        {
          question: 'What did Balak build for Balaam?',
          choices: ['A house', 'Altars for sacrifices', 'A tower', 'A boat'],
          correctIndex: 1,
          correctFeedback: 'Yes! Altars before each try at a curse.',
          wrongFeedback:
            'Balak built seven altars and offered sacrifices (Numbers 23:1).'
        },
        {
          question: 'What did God put in Balaam\'s mouth?',
          choices: ['Curses', 'Blessings', 'Silence', 'Songs'],
          correctIndex: 1,
          correctFeedback: 'Right! Blessings instead of curses — every time.',
          wrongFeedback:
            'The Lord put a word in Balaam\'s mouth — blessing came out (Numbers 23:5).'
        },
        {
          question: 'How many times did Balak try to curse Israel?',
          choices: ['One', 'Two', 'Three', 'Four'],
          correctIndex: 2,
          correctFeedback: 'Yes! Three times — three blessings!',
          wrongFeedback:
            'Balak tried from three high places — blessings each time (Numbers 23–24).'
        },
        {
          question: 'What did Balaam say when Balak got angry?',
          choices: ['I will curse now', 'I can only speak what God tells me', 'Give me more money', 'I quit'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Balaam had to obey God.',
          wrongFeedback:
            'He said, "Must I not take heed to speak that which the LORD hath put in my mouth?" (Numbers 23:12).'
        },
        {
          question: 'What can we learn from Balaam\'s blessings?',
          choices: ['God can be cursed', 'God blesses His people — no curse stands', 'Money wins', 'Listen to kings only'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God\'s blessing is stronger than any curse.',
          wrongFeedback:
            'The story shows God protects His people — what He blesses, no enemy can undo!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God\'s blessings win!',
      takeaway: 'God\'s blessings are stronger than any curse — trust Him.',
      prayer: 'God, thank You for Your strong blessings. Protect me always. Amen.'
    },
    jordanCrossing: {
      kjvRef: 'Joshua 3–4',
      paragraphs: [
        'Joshua led the people to the Jordan River. It was flood season — the water was high.',
        'God told Joshua, "When the priests carrying the ark step into the river, the water will stop."',
        'The priests stepped in. The water piled up upstream — dry ground appeared across the river!',
        'All the people crossed on dry land while the ark stood in the middle. God held back the water.',
        'After crossing, they took twelve stones from the riverbed and built a memorial — to remember God\'s power.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Israelites at high Jordan River, ark ready, no text',
        'fun kid illustration: priests stepping into river with ark, water stopping upstream, no text',
        'colorful Bible scene for children: dry path through river, people crossing safely, ark in middle, no text',
        'exciting cartoon: twelve men carrying stones from riverbed, dry ground, no text',
        'happy ending illustration: memorial stones set up, people remembering God\'s miracle, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God made another way through water — just like the Red Sea!',
      quizHeading: 'Crossing the Jordan Questions',
      questions: [
        {
          question: 'What river did they cross?',
          choices: ['Red Sea', 'Jordan River', 'Nile', 'Euphrates'],
          correctIndex: 1,
          correctFeedback: 'Yes! The Jordan — it was flooded.',
          wrongFeedback:
            'Not the Red Sea. This was Jordan at the time the banks overflow (Joshua 3:15).'
        },
        {
          question: 'What did the priests carry into the river?',
          choices: ['Food', 'The ark of the covenant', 'Stones only', 'Weapons only'],
          correctIndex: 1,
          correctFeedback: 'Right! The ark — God\'s presence went first.',
          wrongFeedback:
            'When their feet touched the water, Jordan stopped — the priests bore the ark (Joshua 3:13, 15).'
        },
        {
          question: 'What happened when the priests stepped in?',
          choices: ['They swam', 'Water stopped upstream', 'Rain fell', 'Fish jumped'],
          correctIndex: 1,
          correctFeedback: 'Yes! The water piled up — a dry path!',
          wrongFeedback:
            'The waters rose up upon an heap — Israel crossed on dry ground (Joshua 3:16–17).'
        },
        {
          question: 'What did they take from the riverbed?',
          choices: ['Fish', 'Twelve stones for a memorial', 'Water jars', 'Mud only'],
          correctIndex: 1,
          correctFeedback: 'Correct! Twelve stones to remember God\'s power.',
          wrongFeedback:
            'Twelve stones, one man from each tribe, for a sign (Joshua 4:5–7).'
        },
        {
          question: 'What does the Jordan crossing teach us?',
          choices: ['God leaves us trapped', 'God makes ways through impossible things', 'Rivers are always easy', 'Don\'t trust leaders'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God opens paths when we obey.',
          wrongFeedback:
            'The story shows God\'s power and faithfulness — He made a way as He promised!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God makes a way!',
      takeaway: 'God makes ways through impossible situations — remember His power.',
      prayer: 'God, thank You for making ways for me. Help me trust You. Amen.'
    },
    battleOfAi: {
      kjvRef: 'Joshua 8',
      paragraphs: [
        'After Jericho, Joshua tried to take Ai. The first attack failed because of sin in the camp — Achan had taken forbidden things.',
        'God told Joshua to remove the sin. Achan confessed — the sin was dealt with.',
        'God gave a new plan: ambush Ai. Some soldiers hid. The main army pretended to flee.',
        'The men of Ai chased them. The hidden soldiers attacked the city from behind.',
        'Ai was captured. God gave victory when the people obeyed and dealt with sin.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Joshua leading army toward Ai, confident faces, no text',
        'fun kid illustration: first battle failing, Israelites turning back from Ai, surprised faces, no text',
        'colorful Bible scene for children: Achan confessing sin, serious humble moment, no text',
        'exciting cartoon: ambush — hidden soldiers moving while main group draws enemy out, no text',
        'happy ending illustration: people thankful, victory won, soft morning light, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Sin caused the first loss — obedience brought victory!',
      quizHeading: 'Battle of Ai Questions',
      questions: [
        {
          question: 'Why did the first attack on Ai fail?',
          choices: ['Too many soldiers', 'Sin in the camp (Achan)', 'Bad weather', 'No plan'],
          correctIndex: 1,
          correctFeedback: 'Yes! Achan took what God said not to take — sin blocked victory.',
          wrongFeedback:
            'Israel could not stand before enemies because of the accursed thing (Joshua 7:11–12).'
        },
        {
          question: 'What did God tell Joshua to do first?',
          choices: ['Attack again the same way', 'Remove the sin', 'Give up', 'Build a wall'],
          correctIndex: 1,
          correctFeedback: 'Right! Deal with sin before trying again.',
          wrongFeedback:
            'God said sanctify the people — the trespass must be put away (Joshua 7:13).'
        },
        {
          question: 'What was the new plan for Ai?',
          choices: ['Full frontal attack only', 'Ambush with hidden soldiers', 'Wait for night only', 'Run away'],
          correctIndex: 1,
          correctFeedback: 'Yes! Hide some, pretend to flee, then strike from behind.',
          wrongFeedback:
            'Joshua laid an ambush behind the city (Joshua 8:3–8).'
        },
        {
          question: 'What happened when Ai chased the Israelites?',
          choices: ['They caught them all', 'Hidden soldiers took the city', 'They turned back', 'Rain stopped them'],
          correctIndex: 1,
          correctFeedback: 'Correct! The trap worked — the city was left open.',
          wrongFeedback:
            'The ambush rose and burnt Ai with fire while the men were drawn away (Joshua 8:19).'
        },
        {
          question: 'What can we learn from the second Ai battle?',
          choices: ['Sin does not matter', 'Obedience brings victory', 'Always attack first', 'Hide from problems'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Obey God and deal with sin — victory follows.',
          wrongFeedback:
            'Sin blocked God\'s help the first time; obedience opened the way!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — obedience wins!',
      takeaway: 'Obedience to God brings victory — deal with sin quickly.',
      prayer: 'God, help me obey You and turn from sin. Thank You for victory. Amen.'
    },

    gideonFleece: {
      kjvRef: 'Judges 6:36–40',
      paragraphs: [
        'God chose Gideon to save Israel from the Midianites. Gideon was unsure and asked for a sign.',
        'Gideon put a wool fleece on the ground and said, "If You are with me, make the fleece wet with dew but the ground dry." God did it.',
        'Gideon asked again: "Make the fleece dry and the ground wet with dew." God did it again the next night.',
        'Gideon knew God was truly with him. He gathered an army, but God said it was too big.',
        'God wanted Gideon to trust Him alone, not the size of his army or signs.'
      ],
      imagePrompts: [
        'bright bouncy cartoon for kids: Gideon laying fleece on ground at night, dew falling, curious face, no text',
        'fun kid illustration: Gideon checking fleece — wet fleece, dry ground around it, amazed look, no text',
        'colorful Bible scene for children: second test, fleece completely dry, ground covered in dew, Gideon praying, no text',
        'exciting cartoon: Gideon trusting God, small army gathering, faith growing, no text',
        'hopeful ending illustration: Gideon ready to lead, God’s presence strong, bright colors, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Gideon needed signs to be sure — God answered patiently!',
      quizHeading: 'Gideon & Fleece Questions',
      questions: [
        {
          question: 'Why did Gideon ask God for signs with the fleece?',
          choices: ['He was cold', 'He wanted to be sure God was with him', 'He wanted wool', 'He was bored'],
          correctIndex: 1,
          correctFeedback: 'Yes! Gideon was afraid and needed confirmation.',
          wrongFeedback: 'Not cold or wool. Gideon asked for signs to know God would help him in battle (Judges 6:36).'
        },
        {
          question: 'What was the first fleece sign?',
          choices: ['Fleece dry, ground wet', 'Fleece wet, ground dry', 'Fleece on fire', 'Fleece gone'],
          correctIndex: 1,
          correctFeedback: 'Right! Wet fleece and dry ground — God did it exactly.',
          wrongFeedback: 'The first request was fleece wet and ground dry. God answered perfectly (Judges 6:37–38).'
        },
        {
          question: 'What was the second sign Gideon asked for?',
          choices: ['Fleece wet again', 'Fleece dry and ground wet', 'Fleece burning', 'Fleece floating'],
          correctIndex: 1,
          correctFeedback: 'Yes! Fleece dry, ground wet — God answered again.',
          wrongFeedback: 'Not wet again. The second test was the opposite: fleece dry, ground wet (Judges 6:39–40).'
        },
        {
          question: 'What did Gideon learn from the fleece signs?',
          choices: ['God is not powerful', 'God is with him', 'Fleece is magic', 'Don’t ask God'],
          correctIndex: 1,
          correctFeedback: 'Exactly! God answered and showed He was with Gideon.',
          wrongFeedback: 'The fleece proved God’s presence and power. Gideon could trust Him for the battle.'
        },
        {
          question: 'What can we learn from Gideon’s fleece?',
          choices: ['God never answers', 'God is patient and answers when we seek Him', 'Signs are bad', 'Never pray'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God is patient and answers honest prayers for confirmation.',
          wrongFeedback: 'The story shows God is kind. He answered Gideon’s fears with clear signs!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God answers when we seek Him!',
      takeaway: 'God is patient and answers when we honestly seek Him — trust His signs.',
      prayer: 'God, when I\'m unsure, help me seek You. Thank You for answering. Amen.'
    },

    gideonMidianites: {
      kjvRef: 'Judges 7',
      paragraphs: [
        'Gideon had a large army, but God said it was too many — they might think they won by themselves.',
        'God told Gideon to send home the fearful. Then God reduced the army again to only 300 men.',
        'God gave a strange plan: 300 men with trumpets, empty jars, and torches. They surrounded the Midianite camp at night.',
        'They blew trumpets, smashed jars, shouted "A sword for the Lord and for Gideon!" The Midianites panicked and fought each other.',
        'God gave victory with only 300 men. Gideon learned to trust God’s power, not his own.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Gideon with big army, God saying "too many", no text',
        'fun kid illustration: fearful soldiers leaving, Gideon left with 300 brave men, no text',
        'colorful Bible scene for children: 300 men with jars, trumpets, and torches at night, ready for ambush, no text',
        'exciting cartoon: jars breaking, torches shining, trumpets loud, Midianites running in chaos, no text',
        'happy ending illustration: Gideon victorious with 300 men, praising God, bright morning, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God won with only 300 men — His power is enough!',
      quizHeading: 'Gideon’s 300 Questions',
      questions: [
        {
          question: 'Why did God say Gideon’s army was too big?',
          choices: ['They were weak', 'They might think they won by their own strength', 'They had no food', 'They were tired'],
          correctIndex: 1,
          correctFeedback: 'Yes! God wanted them to trust Him, not their numbers.',
          wrongFeedback: 'Not weakness. God said the army was too big — they might take credit for the victory (Judges 7:2).'
        },
        {
          question: 'How many men were left after God reduced the army?',
          choices: ['300', '3,000', '30,000', '300,000'],
          correctIndex: 0,
          correctFeedback: 'Right! Only 300 — God’s perfect small number.',
          wrongFeedback: 'Not thousands. God reduced it to 300 so everyone would know the win was from Him (Judges 7:7).'
        },
        {
          question: 'What did the 300 men carry?',
          choices: ['Swords and shields', 'Trumpets, jars, and torches', 'Bows and arrows', 'Horses'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Trumpets, jars with torches inside — God’s unusual weapons.',
          wrongFeedback: 'Not swords. They had trumpets, empty jars, and torches — God caused confusion with them (Judges 7:16).'
        },
        {
          question: 'What happened when the 300 shouted?',
          choices: ['The Midianites surrendered', 'The Midianites fought each other', 'The Midianites ran away quietly', 'Nothing'],
          correctIndex: 1,
          correctFeedback: 'Yes! The enemy panicked and turned on each other.',
          wrongFeedback: 'They didn’t surrender quietly. God caused confusion — the Midianites fought themselves (Judges 7:22).'
        },
        {
          question: 'What can we learn from Gideon’s 300?',
          choices: ['Big armies win', 'God wins with small numbers when we trust Him', 'Torches are magic', 'Never fight at night'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God’s power is greater than any army — trust Him.',
          wrongFeedback: 'The story shows victory is God’s, not ours. Trust Him even when you feel small!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God’s power is enough!',
      takeaway: 'God wins with small numbers — trust His power, not your own.',
      prayer: 'God, thank You for Your power. Help me trust You when I feel small. Amen.'
    },

    deborahBarak: {
      kjvRef: 'Judges 4',
      paragraphs: [
        'Deborah was a judge and prophetess. People came to her under a palm tree for God’s wisdom.',
        'Israel was oppressed by King Jabin and his commander Sisera with 900 iron chariots.',
        'God told Deborah to call Barak: "Lead the army against Sisera — I will give you victory."',
        'Barak said, "I will go only if you come with me." Deborah agreed and said the victory would go to a woman.',
        'God confused Sisera’s army. Jael killed Sisera with a tent peg. Israel was free for 40 years.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Deborah under palm tree judging people, wise and kind face, no text',
        'fun kid illustration: Deborah telling Barak to fight Sisera, Barak asking her to come, no text',
        'colorful Bible scene for children: Barak and Deborah leading army, God fighting for them, no text',
        'exciting cartoon: Sisera’s chariots stuck, Jael helping defeat him, victory moment, no text',
        'happy ending illustration: Israel free, Deborah singing victory song, people celebrating, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Deborah listened to God and led with courage!',
      quizHeading: 'Deborah & Barak Questions',
      questions: [
        {
          question: 'What was Deborah’s role?',
          choices: ['Queen', 'Judge and prophetess', 'Soldier', 'Farmer'],
          correctIndex: 1,
          correctFeedback: 'Yes! She judged Israel and spoke God’s words.',
          wrongFeedback: 'Not queen or soldier. Deborah was a judge and prophetess (Judges 4:4).'
        },
        {
          question: 'Who oppressed Israel?',
          choices: ['Pharaoh', 'King Jabin and Sisera', 'Philistines', 'Amalekites'],
          correctIndex: 1,
          correctFeedback: 'Right! Jabin and Sisera with iron chariots.',
          wrongFeedback: 'Not Pharaoh. It was King Jabin of Canaan and commander Sisera (Judges 4:2).'
        },
        {
          question: 'What did Barak say before going to battle?',
          choices: ['I will go alone', 'I will go only if Deborah comes', 'I am afraid', 'I will not fight'],
          correctIndex: 1,
          correctFeedback: 'Yes! He wanted Deborah with him.',
          wrongFeedback: 'Not alone. Barak said "If you will go with me, I will go" (Judges 4:8).'
        },
        {
          question: 'How did God help win the battle?',
          choices: ['Sent rain and mud', 'Gave them swords', 'Made Sisera sleep', 'All of the above'],
          correctIndex: 0,
          correctFeedback: 'Yes! Rain and mud stuck the chariots — God fought for them.',
          wrongFeedback: 'God sent rain that made the ground muddy — chariots stuck. God gave the victory!'
        },
        {
          question: 'What can we learn from Deborah?',
          choices: ['Women can’t lead', 'Listen to God and be courageous', 'Never fight', 'Hide from enemies'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Deborah listened to God and showed courage.',
          wrongFeedback: 'God uses anyone who listens. Deborah was brave and wise — victory came!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God uses courageous people!',
      takeaway: 'Listen to God and be courageous — He gives victory.',
      prayer: 'God, help me listen to You and be brave like Deborah. Amen.'
    },

    samsonBirth: {
      kjvRef: 'Judges 13',
      paragraphs: [
        'Manoah and his wife had no children. An angel appeared to the wife and said she would have a son.',
        'The angel said the boy would be a Nazirite — never cut his hair, never drink wine, never eat unclean food.',
        'The wife told Manoah. He prayed, and the angel came again to confirm the rules.',
        'The woman had a son and named him Samson. God blessed him, and the Spirit of the Lord began to move in him.',
        'Samson would deliver Israel from the Philistines — God had a special plan for him.'
      ],
      imagePrompts: [
        'bright cartoon for kids: angel appearing to Manoah’s wife, surprised but happy, no text',
        'fun kid illustration: angel telling the wife about baby Samson and Nazirite rules, no text',
        'colorful Bible scene for children: Manoah praying, angel appearing again to confirm, no text',
        'exciting cartoon: baby Samson born, parents happy, God blessing the baby, no text',
        'hopeful ending illustration: young Samson growing strong, Spirit of the Lord with him, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God had a special plan for baby Samson from the start!',
      quizHeading: 'Samson’s Birth Questions',
      questions: [
        {
          question: 'Who appeared to Samson’s mother?',
          choices: ['A king', 'An angel of the Lord', 'A priest', 'A neighbor'],
          correctIndex: 1,
          correctFeedback: 'Yes! An angel told her she would have a special son.',
          wrongFeedback: 'Not a king or priest. The angel of the Lord appeared (Judges 13:3).'
        },
        {
          question: 'What special promise did the angel give?',
          choices: ['A daughter', 'A son who would be a Nazirite', 'A farm', 'A crown'],
          correctIndex: 1,
          correctFeedback: 'Right! A son who would be set apart for God.',
          wrongFeedback: 'Not a daughter or farm. The angel said she would have a son who would deliver Israel (Judges 13:5).'
        },
        {
          question: 'What were the Nazirite rules?',
          choices: ['Never cut hair, no wine, no unclean food', 'Eat only fruit', 'Sleep all day', 'Never speak'],
          correctIndex: 0,
          correctFeedback: 'Yes! No razor, no wine, no unclean food — set apart.',
          wrongFeedback: 'Not fruit or silence. No razor on head, no wine, no unclean food (Judges 13:7).'
        },
        {
          question: 'What did Manoah do when he heard?',
          choices: ['Ignored it', 'Prayed for the angel to return', 'Built a temple', 'Ran away'],
          correctIndex: 1,
          correctFeedback: 'Correct! He prayed and the angel came back.',
          wrongFeedback: 'Not ignore or run. Manoah prayed for confirmation (Judges 13:8–9).'
        },
        {
          question: 'What can we learn from Samson’s birth?',
          choices: ['God has special plans for each of us', 'Babies are not important', 'Angels are scary', 'Never pray'],
          correctIndex: 0,
          correctFeedback: 'Perfect! God has a purpose for every life — even before birth.',
          wrongFeedback: 'The story shows God chose Samson before he was born. He has plans for you too!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God has plans for you!',
      takeaway: 'God has a special plan for every life — trust His purpose for you.',
      prayer: 'God, thank You for having a plan for my life. Help me follow it. Amen.'
    },

    ruthNaomi: {
      kjvRef: 'Ruth 1–4',
      paragraphs: [
        'Naomi lost her husband and two sons in Moab. She was left with her daughters-in-law, Orpah and Ruth.',
        'Naomi decided to return to Bethlehem. She told the girls to go back to their families.',
        'Orpah left, but Ruth said, "Where you go I will go. Your people will be my people, and your God my God."',
        'Ruth worked in the fields of Boaz, a relative of Naomi. Boaz showed kindness to Ruth.',
        'Boaz married Ruth. They had a son, Obed — grandfather of King David. God used Ruth in His big plan for Jesus.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Naomi, Ruth, and Orpah walking, sad faces, no text',
        'fun kid illustration: Ruth saying "Where you go I will go" to Naomi, loving moment, no text',
        'colorful Bible scene for children: Ruth working in Boaz’s field, picking grain, kind face, no text',
        'exciting cartoon: Boaz and Ruth getting married, happy celebration, no text',
        'happy ending illustration: baby Obed in Ruth’s arms, Naomi smiling, family together, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Ruth chose loyalty and God — and God blessed her!',
      quizHeading: 'Ruth & Naomi Questions',
      questions: [
        {
          question: 'What happened to Naomi’s family in Moab?',
          choices: ['They moved back', 'Her husband and sons died', 'They got rich', 'They found new friends'],
          correctIndex: 1,
          correctFeedback: 'Yes! She lost her husband and two sons.',
          wrongFeedback: 'Not moved back. Naomi’s husband and sons died, leaving her with Ruth and Orpah (Ruth 1:3–5).'
        },
        {
          question: 'What did Ruth say to Naomi?',
          choices: ['I will go home', 'Where you go I will go — your God my God', 'I am afraid', 'Goodbye'],
          correctIndex: 1,
          correctFeedback: 'Right! Ruth chose to stay and follow Naomi’s God.',
          wrongFeedback: 'Not goodbye. Ruth said "Your people will be my people, your God my God" (Ruth 1:16).'
        },
        {
          question: 'Where did Ruth work to help Naomi?',
          choices: ['In a shop', 'In Boaz’s field', 'In the temple', 'At home'],
          correctIndex: 1,
          correctFeedback: 'Yes! She gleaned grain in Boaz’s field.',
          wrongFeedback: 'Not shop or temple. Ruth worked picking leftover grain (Ruth 2:2–3).'
        },
        {
          question: 'Who showed kindness to Ruth?',
          choices: ['The king', 'Boaz', 'The priest', 'Orpah'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Boaz was kind and later married Ruth.',
          wrongFeedback: 'Not the king. Boaz, a relative, showed kindness and became her husband (Ruth 4).'
        },
        {
          question: 'What can we learn from Ruth?',
          choices: ['Run away when hard', 'Stay loyal and trust God', 'Hide from family', 'Never help others'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Ruth’s loyalty and faith brought blessing.',
          wrongFeedback: 'Ruth chose loyalty and God — she became part of Jesus’ family line!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — loyalty and faith win!',
      takeaway: 'Loyalty and trusting God bring beautiful blessings.',
      prayer: 'God, help me be loyal like Ruth and trust You always. Amen.'
    }
};
