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
    },

    hannahSamuel: {
      kjvRef: '1 Samuel 1–2',
      paragraphs: [
        'Hannah had no children and was very sad. She prayed to God at the temple with all her heart.',
        'She promised, "If You give me a son, I will give him back to You to serve You all his life."',
        'Eli the priest saw her praying silently. He blessed her: "Go in peace, may God grant your request."',
        'God heard Hannah\'s prayer. She had a son and named him Samuel. She kept her promise and brought him to the temple to serve God with Eli.',
        'Hannah thanked God with a beautiful song. Samuel grew up to be a great prophet and judge for Israel.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Hannah praying earnestly at the temple, tears but hopeful, no text',
        'fun kid illustration: Eli the priest blessing Hannah, gentle moment, no text',
        'colorful Bible scene for children: Hannah holding baby Samuel, happy tears, family joy, no text',
        'exciting cartoon: Hannah bringing young Samuel to temple, giving him to Eli, promise kept, no text',
        'happy ending illustration: Samuel serving God, growing strong, Hannah praising, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Hannah prayed with all her heart — God answered!',
      quizHeading: 'Hannah & Samuel Questions',
      questions: [
        {
          question: 'Why was Hannah sad?',
          choices: ['She had no children', 'She lost her home', 'She was hungry', 'She was tired'],
          correctIndex: 0,
          correctFeedback: 'Yes! Hannah had no children and prayed for a son.',
          wrongFeedback: 'Not home or hunger. She was sad because she couldn\'t have children (1 Samuel 1:6–8).'
        },
        {
          question: 'What did Hannah promise God?',
          choices: ['Give her son back to serve God', 'Give him lots of toys', 'Keep him home', 'Name him Eli'],
          correctIndex: 0,
          correctFeedback: 'Right! She promised to give him to God\'s service.',
          wrongFeedback: 'Not toys or home. Hannah vowed "I will give him to the Lord all the days of his life" (1 Samuel 1:11).'
        },
        {
          question: 'What did Eli do when he saw Hannah praying?',
          choices: ['Ignored her', 'Blessed her', 'Laughed at her', 'Sent her away'],
          correctIndex: 1,
          correctFeedback: 'Yes! Eli blessed her — "Go in peace, may God grant your request."',
          wrongFeedback: 'He didn\'t ignore or laugh. Eli saw her heart and blessed her (1 Samuel 1:17).'
        },
        {
          question: 'What did Hannah do when Samuel was old enough?',
          choices: ['Kept him home', 'Brought him to the temple to serve God', 'Took him to the king', 'Forgot her promise'],
          correctIndex: 1,
          correctFeedback: 'Exactly! She kept her promise and gave Samuel to God.',
          wrongFeedback: 'She didn\'t keep him or forget. Hannah brought him to Eli at the temple (1 Samuel 1:24–28).'
        },
        {
          question: 'What can we learn from Hannah?',
          choices: ['Prayer doesn\'t matter', 'Pray with all your heart — God hears', 'Never make promises', 'Hide your sadness'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God hears honest, heartfelt prayers.',
          wrongFeedback: 'Hannah\'s story shows God answers persistent prayer from the heart!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God hears your prayers!',
      takeaway: 'Pray with all your heart — God hears and answers.',
      prayer: 'God, thank You for hearing my prayers. Help me pray with faith. Amen.'
    },

    samuelBirth: {
      kjvRef: '1 Samuel 1–2',
      paragraphs: [
        'Hannah prayed for a son and promised to give him to God. God gave her Samuel.',
        'When Samuel was old enough, Hannah brought him to the temple to serve God with Eli the priest.',
        'Hannah sang a beautiful song of praise to God for His help and power.',
        'Samuel grew up in the temple and learned to serve God. God was with him.',
        'Samuel became a great prophet who spoke God\'s words to Israel.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Hannah bringing young Samuel to temple, giving him to Eli, loving moment, no text',
        'fun kid illustration: Hannah singing praise song to God, joyful face, no text',
        'colorful Bible scene for children: young Samuel serving in temple with Eli, learning, no text',
        'exciting cartoon: God with young Samuel, growing strong, no text',
        'happy ending illustration: Samuel as prophet speaking God\'s words, people listening, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Hannah kept her promise — God blessed her!',
      quizHeading: 'Samuel\'s Birth & Dedication Questions',
      questions: [
        {
          question: 'What did Hannah promise God if He gave her a son?',
          choices: ['Give him back to serve God', 'Keep him home', 'Give him toys', 'Name him Eli'],
          correctIndex: 0,
          correctFeedback: 'Yes! She promised to dedicate him to God\'s service.',
          wrongFeedback: 'Not toys or home. Hannah vowed "I will give him to the Lord all the days of his life" (1 Samuel 1:11).'
        },
        {
          question: 'What did Hannah do when Samuel was old enough?',
          choices: ['Kept him home', 'Brought him to the temple to serve God', 'Took him to the king', 'Forgot her promise'],
          correctIndex: 1,
          correctFeedback: 'Exactly! She kept her promise and gave Samuel to God.',
          wrongFeedback: 'She didn\'t keep him or forget. Hannah brought him to Eli at the temple (1 Samuel 1:24–28).'
        },
        {
          question: 'What did Hannah do after giving Samuel to God?',
          choices: ['Cried', 'Sang a song of praise', 'Left quietly', 'Asked for more children'],
          correctIndex: 1,
          correctFeedback: 'Yes! Hannah sang a beautiful song thanking God.',
          wrongFeedback: 'She didn\'t cry or leave quietly. Hannah prayed a song of praise to God (1 Samuel 2:1–10).'
        },
        {
          question: 'Where did Samuel grow up?',
          choices: ['With his parents', 'In the temple serving God', 'In the palace', 'In the fields'],
          correctIndex: 1,
          correctFeedback: 'Right! Samuel grew up in the temple with Eli.',
          wrongFeedback: 'Not with parents. Samuel ministered to the Lord under Eli (1 Samuel 2:11).'
        },
        {
          question: 'What can we learn from Hannah and Samuel?',
          choices: ['Keep promises to God', 'Never pray', 'Forget vows', 'Hide sadness'],
          correctIndex: 0,
          correctFeedback: 'Perfect! Keep promises to God — He hears and blesses.',
          wrongFeedback: 'Hannah kept her vow — God blessed her and used Samuel greatly!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God hears promises!',
      takeaway: 'Keep promises to God — He hears and blesses faithfulness.',
      prayer: 'God, help me keep promises to You. Thank You for hearing me. Amen.'
    },

    samuelCalls: {
      kjvRef: '1 Samuel 3',
      paragraphs: [
        'Samuel served God in the temple with Eli. One night God called, "Samuel! Samuel!"',
        'Samuel thought it was Eli calling. He ran to Eli three times saying, "Here I am."',
        'Eli realized it was God calling Samuel. He told Samuel, "Say, \'Speak, Lord, for Your servant is listening.\'"',
        'God called again. Samuel said, "Speak, for Your servant is listening." God gave Samuel a message.',
        'Samuel grew up, and God was with him. Everyone knew Samuel was a prophet of the Lord.'
      ],
      imagePrompts: [
        'bright cartoon for kids: young Samuel sleeping in temple, God calling "Samuel!", no text',
        'fun kid illustration: Samuel running to Eli three times, "Here I am!", no text',
        'colorful Bible scene for children: Eli teaching Samuel what to say, gentle moment, no text',
        'exciting cartoon: Samuel saying "Speak, Lord, for Your servant is listening", God speaking, no text',
        'happy ending illustration: Samuel as prophet, people listening to God\'s words, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God called Samuel by name — Samuel listened!',
      quizHeading: 'Samuel Hears God Questions',
      questions: [
        {
          question: 'Where was Samuel when God called him?',
          choices: ['At home', 'In the temple sleeping', 'In the fields', 'At school'],
          correctIndex: 1,
          correctFeedback: 'Yes! Samuel was sleeping in the temple.',
          wrongFeedback: 'Not home or fields. Samuel lay down in the temple of the Lord (1 Samuel 3:3).'
        },
        {
          question: 'How many times did Samuel run to Eli?',
          choices: ['One', 'Three', 'Five', 'Ten'],
          correctIndex: 1,
          correctFeedback: 'Right! Three times — he thought Eli was calling.',
          wrongFeedback: 'Not one or five. God called Samuel three times before Eli realized it was God (1 Samuel 3:4–8).'
        },
        {
          question: 'What did Eli tell Samuel to say?',
          choices: ['Go away', 'Speak, Lord, for Your servant is listening', 'Who are You?', 'I\'m sleeping'],
          correctIndex: 1,
          correctFeedback: 'Exactly! "Speak, Lord, for Your servant is listening."',
          wrongFeedback: 'Not go away. Eli said if God calls again, say "Speak, Lord, for Your servant hears" (1 Samuel 3:9).'
        },
        {
          question: 'What did Samuel say when God called the fourth time?',
          choices: ['Here I am', 'Speak, for Your servant is listening', 'Go away', 'Who is it?'],
          correctIndex: 1,
          correctFeedback: 'Yes! Samuel listened and responded correctly.',
          wrongFeedback: 'Not "Here I am" again. Samuel said "Speak, for Your servant is listening" (1 Samuel 3:10).'
        },
        {
          question: 'What can we learn from Samuel\'s call?',
          choices: ['Ignore God\'s voice', 'Listen when God calls', 'Run away from God', 'Never pray at night'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Listen when God calls — say "Here I am."',
          wrongFeedback: 'The story shows God calls people by name. Samuel listened and became a great prophet!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God calls us too!',
      takeaway: 'Listen when God calls — say "Here I am."',
      prayer: 'God, when You call me, help me say "Here I am." Speak, Lord. Amen.'
    },

    samuelAnointsDavid: {
      kjvRef: '1 Samuel 16:1–13',
      paragraphs: [
        'God told Samuel to go to Bethlehem and anoint a new king. Samuel was afraid of Saul, but God said "Go."',
        'Samuel went to Jesse\'s house. Jesse brought his sons before Samuel, starting with the oldest.',
        'God said, "Do not look at his appearance — I look at the heart." Samuel passed over Jesse\'s older sons.',
        'The youngest, David, was out with the sheep. Samuel said, "Send for him."',
        'David came in. God said, "This is the one." Samuel anointed David with oil — the Spirit of the Lord came on him powerfully.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Samuel arriving at Jesse\'s house, oil horn ready, no text',
        'fun kid illustration: Jesse bringing his tall strong sons before Samuel, Samuel shaking head, no text',
        'colorful Bible scene for children: God telling Samuel "I look at the heart", Samuel waiting, no text',
        'exciting cartoon: young David coming from sheep, ruddy face, Samuel anointing him with oil, no text',
        'happy ending illustration: Spirit of the Lord coming on David, glowing, brothers watching, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God chose David by his heart, not looks!',
      quizHeading: 'Samuel Anoints David Questions',
      questions: [
        {
          question: 'Why did God send Samuel to Bethlehem?',
          choices: ['To visit friends', 'To anoint a new king', 'To sell sheep', 'To build a temple'],
          correctIndex: 1,
          correctFeedback: 'Yes! To anoint the next king — David.',
          wrongFeedback: 'Not friends or sheep. God said "Fill your horn with oil and go to Bethlehem — I have chosen a king" (1 Samuel 16:1).'
        },
        {
          question: 'What did God tell Samuel about choosing the king?',
          choices: ['Look at height', 'Look at the heart', 'Choose the oldest', 'Choose the richest'],
          correctIndex: 1,
          correctFeedback: 'Right! "Man looks at the outward appearance, but the Lord looks at the heart."',
          wrongFeedback: 'Not height or oldest. God said "Do not consider his appearance… I look at the heart" (1 Samuel 16:7).'
        },
        {
          question: 'Where was David when Samuel came?',
          choices: ['In the house', 'With the sheep', 'At school', 'In the city'],
          correctIndex: 1,
          correctFeedback: 'Yes! David was the youngest, out tending sheep.',
          wrongFeedback: 'Not in the house. David was the youngest son — with the sheep (1 Samuel 16:11).'
        },
        {
          question: 'What happened when Samuel anointed David?',
          choices: ['Nothing', 'The Spirit of the Lord came on him powerfully', 'He cried', 'He ran away'],
          correctIndex: 1,
          correctFeedback: 'Exactly! God\'s Spirit came on David from that day.',
          wrongFeedback: 'Not nothing. The Spirit of the Lord rushed upon David powerfully after anointing (1 Samuel 16:13).'
        },
        {
          question: 'What can we learn from God choosing David?',
          choices: ['God cares about looks', 'God looks at the heart', 'God chooses the oldest', 'God likes tall people'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God chooses by heart, not appearance.',
          wrongFeedback: 'The story shows God values inner character — a heart after Him!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God looks at the heart!',
      takeaway: 'God chooses by the heart — be a person after God\'s own heart.',
      prayer: 'God, help me have a heart that pleases You. Amen.'
    },

    davidGoliath: {
      kjvRef: '1 Samuel 17',
      paragraphs: [
        'The Philistines had a giant named Goliath. He was over nine feet tall and challenged Israel every day.',
        'David was a young shepherd bringing food to his brothers. He heard Goliath mocking God\'s army.',
        'David said, "Who is this who defies the living God?" He told Saul, "Let me fight him."',
        'David took his sling and five smooth stones. He said, "You come with sword and spear — I come in the name of the Lord!"',
        'David slung a stone. It hit Goliath in the forehead. The giant fell. David won the victory for God\'s people.'
      ],
      imagePrompts: [
        'bright cartoon for kids: giant Goliath taunting Israelite army, huge size, no text',
        'fun kid illustration: young David hearing Goliath, angry face, ready to fight, no text',
        'colorful Bible scene for children: David talking to Saul, sling in hand, confident, no text',
        'exciting cartoon: David running toward Goliath, sling spinning, stone flying, no text',
        'happy ending illustration: Goliath fallen, David victorious, Israelites cheering, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'David trusted God, not his size!',
      quizHeading: 'David & Goliath Questions',
      questions: [
        {
          question: 'Who was the giant challenging Israel?',
          choices: ['Saul', 'Goliath', 'David', 'Samuel'],
          correctIndex: 1,
          correctFeedback: 'Yes! Goliath mocked God\'s people daily.',
          wrongFeedback: 'Not Saul or David. Goliath was the Philistine giant (1 Samuel 17:8–10).'
        },
        {
          question: 'What did David say when he heard Goliath?',
          choices: ['I\'m scared', 'Who is this who defies the living God?', 'Let\'s run', 'I\'m too small'],
          correctIndex: 1,
          correctFeedback: 'Right! David was upset that Goliath mocked God.',
          wrongFeedback: 'He wasn\'t scared. David said "Who is this uncircumcised Philistine that he should defy the armies of the living God?" (1 Samuel 17:26).'
        },
        {
          question: 'What did David use to fight Goliath?',
          choices: ['A sword', 'A sling and stone', 'A spear', 'A shield'],
          correctIndex: 1,
          correctFeedback: 'Yes! Sling and five smooth stones — God guided the stone.',
          wrongFeedback: 'Not sword or spear. David said "I come in the name of the Lord" with a sling (1 Samuel 17:45).'
        },
        {
          question: 'What happened when David slung the stone?',
          choices: ['It missed', 'It hit Goliath in the forehead', 'Goliath caught it', 'It bounced off'],
          correctIndex: 1,
          correctFeedback: 'Exactly! The stone hit — Goliath fell face down.',
          wrongFeedback: 'It didn\'t miss or bounce. The stone sank into Goliath\'s forehead — he fell (1 Samuel 17:49).'
        },
        {
          question: 'What can we learn from David & Goliath?',
          choices: ['Size matters most', 'Trust God over your own strength', 'Never fight giants', 'Run from problems'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God gives victory when we trust Him.',
          wrongFeedback: 'The story shows faith in God beats any giant. David trusted God, not his size!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God gives victory!',
      takeaway: 'Trust God over your own strength — He defeats giants.',
      prayer: 'God, help me trust You when things feel too big. Amen.'
    },

    davidSaul: {
      kjvRef: '1 Samuel 18–19',
      paragraphs: [
        'David became famous after Goliath. Saul put him in charge of the army. The people sang, "Saul has slain thousands, David tens of thousands."',
        'Saul became jealous and angry. He tried to kill David with a spear twice.',
        'Saul\'s son Jonathan loved David like a brother. They made a covenant of friendship.',
        'Saul sent David to battle the Philistines — hoping he would die. But David won every time.',
        'David stayed faithful to God and to Saul. God protected David from Saul\'s jealousy.'
      ],
      imagePrompts: [
        'bright cartoon for kids: David leading army, people cheering, Saul watching jealously, no text',
        'fun kid illustration: women singing "David tens of thousands", Saul angry, no text',
        'colorful Bible scene for children: Saul throwing spear at David, David dodging, no text',
        'exciting cartoon: Jonathan and David making friendship promise, hands together, no text',
        'hopeful ending illustration: David victorious in battle, God protecting him, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Saul was jealous, but God protected David!',
      quizHeading: 'David & Saul Questions',
      questions: [
        {
          question: 'Why did Saul become jealous of David?',
          choices: ['David was weak', 'People praised David more', 'David took his throne', 'David ate his food'],
          correctIndex: 1,
          correctFeedback: 'Yes! The people sang David\'s praises higher than Saul\'s.',
          wrongFeedback: 'Not throne or food. The women sang "Saul has slain thousands, David tens of thousands" (1 Samuel 18:7).'
        },
        {
          question: 'What did Saul try to do to David?',
          choices: ['Give him gifts', 'Kill him with a spear', 'Make him king', 'Send him home'],
          correctIndex: 1,
          correctFeedback: 'Right! Saul threw a spear at David twice.',
          wrongFeedback: 'Not gifts. Saul was angry and tried to pin David to the wall with a spear (1 Samuel 18:11).'
        },
        {
          question: 'Who was David\'s best friend?',
          choices: ['Saul', 'Jonathan (Saul\'s son)', 'Goliath', 'Samuel'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jonathan loved David like his own soul.',
          wrongFeedback: 'Not Saul or Goliath. Jonathan and David made a covenant of friendship (1 Samuel 18:1–3).'
        },
        {
          question: 'What happened when Saul sent David to battle?',
          choices: ['David lost', 'David won every time', 'David ran away', 'David joined Philistines'],
          correctIndex: 1,
          correctFeedback: 'Exactly! David succeeded — God was with him.',
          wrongFeedback: 'Saul hoped David would die, but God gave him victory every time (1 Samuel 18:14).'
        },
        {
          question: 'What can we learn from David & Saul?',
          choices: ['Jealousy is good', 'God protects the faithful', 'Hate your enemies', 'Give up easily'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God protects those who stay faithful.',
          wrongFeedback: 'David stayed loyal and God kept him safe from Saul\'s jealousy!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God protects the faithful!',
      takeaway: 'God protects those who stay faithful — even from jealousy.',
      prayer: 'God, protect me and help me stay faithful to You. Amen.'
    },

    davidJonathan: {
      kjvRef: '1 Samuel 18–20',
      paragraphs: [
        'Jonathan, Saul\'s son, loved David like his own brother. Their souls were knit together.',
        'Jonathan made a covenant with David — they promised to be loyal friends forever.',
        'Jonathan gave David his robe, sword, bow, and belt — signs of deep friendship.',
        'When Saul wanted to kill David, Jonathan warned him and helped him escape.',
        'Jonathan and David wept together when they had to part. Jonathan said, "The Lord be between you and me forever."'
      ],
      imagePrompts: [
        'bright cartoon for kids: David and Jonathan becoming friends, shaking hands, no text',
        'fun kid illustration: Jonathan giving David his robe, sword, bow, and belt, happy moment, no text',
        'colorful Bible scene for children: Jonathan warning David about Saul\'s plan, secret meeting, no text',
        'exciting cartoon: David escaping from Saul, Jonathan helping him hide, no text',
        'sad but hopeful illustration: David and Jonathan weeping and hugging, promising friendship forever, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jonathan and David were true friends!',
      quizHeading: 'David & Jonathan Questions',
      questions: [
        {
          question: 'How did Jonathan feel about David?',
          choices: ['Hated him', 'Loved him like a brother', 'Was jealous', 'Ignored him'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jonathan loved David as his own soul.',
          wrongFeedback: 'Not hate or jealousy. Their souls were knit together — true friendship (1 Samuel 18:1).'
        },
        {
          question: 'What did Jonathan give David as a sign of friendship?',
          choices: ['Food', 'His robe, sword, bow, and belt', 'A horse', 'Money'],
          correctIndex: 1,
          correctFeedback: 'Right! Jonathan gave David his own things — deep loyalty.',
          wrongFeedback: 'Not food or money. Jonathan gave his robe, sword, bow, and belt (1 Samuel 18:4).'
        },
        {
          question: 'What did Jonathan do when Saul wanted to kill David?',
          choices: ['Helped Saul', 'Warned David and helped him escape', 'Ignored it', 'Fought David'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jonathan risked his life to protect his friend.',
          wrongFeedback: 'Not help Saul. Jonathan warned David and made a plan to save him (1 Samuel 19–20).'
        },
        {
          question: 'What did Jonathan and David do when they had to part?',
          choices: ['Fought', 'Wept together and renewed their promise', 'Forgot each other', 'Ran away'],
          correctIndex: 1,
          correctFeedback: 'Exactly! They wept and promised friendship forever.',
          wrongFeedback: 'They didn\'t fight or forget. They wept and said "The Lord be between you and me forever" (1 Samuel 20:42).'
        },
        {
          question: 'What can we learn from David & Jonathan?',
          choices: ['True friends are loyal', 'Friends betray you', 'Never trust anyone', 'Be jealous of friends'],
          correctIndex: 0,
          correctFeedback: 'Perfect! True friendship is loyal and sacrificial.',
          wrongFeedback: 'Jonathan risked everything for David. Real friends love and protect each other!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — true friends are loyal!',
      takeaway: 'True friendship is loyal and sacrificial — love your friends like Jonathan loved David.',
      prayer: 'God, thank You for true friends. Help me be a loyal friend. Amen.'
    },

    davidSaulJealousy: {
      kjvRef: '1 Samuel 18–19',
      paragraphs: [
        'After Goliath, David became famous. The people sang, "Saul has slain thousands, David tens of thousands."',
        'Saul became jealous. He tried to kill David with a spear twice while David played the harp for him.',
        'Saul\'s son Jonathan loved David like a brother. They made a covenant of friendship.',
        'Saul sent David to battle the Philistines — hoping he would die. But David won every time.',
        'God protected David from Saul\'s jealousy. David stayed faithful and humble.'
      ],
      imagePrompts: [
        'bright cartoon for kids: David leading army, people cheering, Saul watching jealously, no text',
        'fun kid illustration: women singing "David tens of thousands", Saul angry, no text',
        'colorful Bible scene for children: Saul throwing spear at David, David dodging, no text',
        'exciting cartoon: Jonathan and David making friendship promise, hands together, no text',
        'hopeful ending illustration: David victorious in battle, God protecting him, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Saul was jealous, but God protected David!',
      quizHeading: 'David & Saul\'s Jealousy Questions',
      questions: [
        {
          question: 'Why did Saul become jealous of David?',
          choices: ['David was weak', 'People praised David more', 'David took his throne', 'David ate his food'],
          correctIndex: 1,
          correctFeedback: 'Yes! The people sang David\'s praises higher than Saul\'s.',
          wrongFeedback: 'Not throne or food. The women sang "Saul has slain thousands, David tens of thousands" (1 Samuel 18:7).'
        },
        {
          question: 'What did Saul try to do to David?',
          choices: ['Give him gifts', 'Kill him with a spear', 'Make him king', 'Send him home'],
          correctIndex: 1,
          correctFeedback: 'Right! Saul threw a spear at David twice.',
          wrongFeedback: 'Not gifts. Saul was angry and tried to pin David to the wall with a spear (1 Samuel 18:11).'
        },
        {
          question: 'Who was David\'s best friend?',
          choices: ['Saul', 'Jonathan (Saul\'s son)', 'Goliath', 'Samuel'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jonathan loved David like his own soul.',
          wrongFeedback: 'Not Saul or Goliath. Jonathan and David made a covenant of friendship (1 Samuel 18:1–3).'
        },
        {
          question: 'What happened when Saul sent David to battle?',
          choices: ['David lost', 'David won every time', 'David ran away', 'David joined Philistines'],
          correctIndex: 1,
          correctFeedback: 'Exactly! David succeeded — God was with him.',
          wrongFeedback: 'Saul hoped David would die, but God gave him victory every time (1 Samuel 18:14).'
        },
        {
          question: 'What can we learn from David & Saul?',
          choices: ['Jealousy is good', 'God protects the faithful', 'Hate your enemies', 'Give up easily'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God protects those who stay faithful.',
          wrongFeedback: 'David stayed loyal and God kept him safe from Saul\'s jealousy!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God protects the faithful!',
      takeaway: 'God protects those who stay faithful — even from jealousy.',
      prayer: 'God, protect me and help me stay faithful to You. Amen.'
    },

    davidJonathanFriendship: {
      kjvRef: '1 Samuel 18–20',
      paragraphs: [
        'Jonathan, Saul\'s son, loved David like his own brother. Their souls were knit together.',
        'Jonathan made a covenant with David — they promised to be loyal friends forever.',
        'Jonathan gave David his robe, sword, bow, and belt — signs of deep friendship.',
        'When Saul wanted to kill David, Jonathan warned him and helped him escape.',
        'Jonathan and David wept together when they had to part. Jonathan said, "The Lord be between you and me forever."'
      ],
      imagePrompts: [
        'bright cartoon for kids: David and Jonathan becoming friends, shaking hands, no text',
        'fun kid illustration: Jonathan giving David his robe, sword, bow, and belt, happy moment, no text',
        'colorful Bible scene for children: Jonathan warning David about Saul\'s plan, secret meeting, no text',
        'exciting cartoon: David escaping from Saul, Jonathan helping him hide, no text',
        'sad but hopeful illustration: David and Jonathan weeping and hugging, promising friendship forever, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jonathan and David were true friends!',
      quizHeading: 'David & Jonathan Friendship Questions',
      questions: [
        {
          question: 'How did Jonathan feel about David?',
          choices: ['Hated him', 'Loved him like a brother', 'Was jealous', 'Ignored him'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jonathan loved David as his own soul.',
          wrongFeedback: 'Not hate or jealousy. Their souls were knit together — true friendship (1 Samuel 18:1).'
        },
        {
          question: 'What did Jonathan give David as a sign of friendship?',
          choices: ['Food', 'His robe, sword, bow, and belt', 'A horse', 'Money'],
          correctIndex: 1,
          correctFeedback: 'Right! Jonathan gave David his own things — deep loyalty.',
          wrongFeedback: 'Not food or money. Jonathan gave his robe, sword, bow, and belt (1 Samuel 18:4).'
        },
        {
          question: 'What did Jonathan do when Saul wanted to kill David?',
          choices: ['Helped Saul', 'Warned David and helped him escape', 'Ignored it', 'Fought David'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jonathan risked his life to protect his friend.',
          wrongFeedback: 'Not help Saul. Jonathan warned David and made a plan to save him (1 Samuel 19–20).'
        },
        {
          question: 'What did Jonathan and David do when they had to part?',
          choices: ['Fought', 'Wept together and renewed their promise', 'Forgot each other', 'Ran away'],
          correctIndex: 1,
          correctFeedback: 'Exactly! They wept and promised friendship forever.',
          wrongFeedback: 'They didn\'t fight or forget. They wept and said "The Lord be between you and me forever" (1 Samuel 20:42).'
        },
        {
          question: 'What can we learn from David & Jonathan?',
          choices: ['True friends are loyal', 'Friends betray you', 'Never trust anyone', 'Be jealous of friends'],
          correctIndex: 0,
          correctFeedback: 'Perfect! True friendship is loyal and sacrificial.',
          wrongFeedback: 'Jonathan risked everything for David. Real friends love and protect each other!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — true friends are loyal!',
      takeaway: 'True friendship is loyal and sacrificial — love your friends like Jonathan loved David.',
      prayer: 'God, thank You for true friends. Help me be a loyal friend. Amen.'
    },

    saulKing: {
      kjvRef: '1 Samuel 9–10',
      paragraphs: [
        'The people wanted a king like other nations. God told Samuel to anoint Saul as king.',
        'Saul was tall and handsome. He was looking for lost donkeys when he met Samuel.',
        'Samuel privately anointed Saul with oil. He said, "The Lord has chosen you to be prince over His people."',
        'Samuel gathered the people. The lot fell on Saul. The people shouted, "Long live the king!"',
        'God\'s Spirit came on Saul, and he prophesied. Saul became Israel\'s first king.'
      ],
      imagePrompts: [
        'bright cartoon for kids: people asking Samuel for a king, serious faces, no text',
        'fun kid illustration: tall Saul looking for lost donkeys, meeting Samuel, no text',
        'colorful Bible scene for children: Samuel anointing Saul privately with oil, special moment, no text',
        'exciting cartoon: people shouting "Long live the king!" when Saul chosen, happy crowd, no text',
        'hopeful ending illustration: Saul with God\'s Spirit, prophesying, people cheering, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God chose Saul as the first king!',
      quizHeading: 'Saul Becomes King Questions',
      questions: [
        {
          question: 'Why did the people want a king?',
          choices: ['To be like other nations', 'To have more food', 'To fight less', 'To have a new leader'],
          correctIndex: 0,
          correctFeedback: 'Yes! They wanted a king like other nations.',
          wrongFeedback: 'Not food or less fighting. The people said "Give us a king to judge us like all the nations" (1 Samuel 8:5).'
        },
        {
          question: 'What was Saul doing when he met Samuel?',
          choices: ['Praying', 'Looking for lost donkeys', 'Fighting', 'Building'],
          correctIndex: 1,
          correctFeedback: 'Right! Saul was searching for his father\'s donkeys.',
          wrongFeedback: 'Not praying or fighting. Saul was looking for lost donkeys when he met Samuel (1 Samuel 9:3–5).'
        },
        {
          question: 'What did Samuel do to Saul privately?',
          choices: ['Gave him food', 'Anointed him with oil', 'Sent him home', 'Made him leave'],
          correctIndex: 1,
          correctFeedback: 'Yes! Samuel anointed Saul as prince over Israel.',
          wrongFeedback: 'Not food or send home. Samuel poured oil on Saul\'s head privately (1 Samuel 10:1).'
        },
        {
          question: 'How did the people choose Saul publicly?',
          choices: ['By vote', 'By lot', 'By fight', 'By race'],
          correctIndex: 1,
          correctFeedback: 'Correct! The lot fell on Saul — God\'s choice.',
          wrongFeedback: 'Not vote or fight. The lot was cast and fell on Saul (1 Samuel 10:20–21).'
        },
        {
          question: 'What can we learn from Saul becoming king?',
          choices: ['God chooses leaders', 'People always choose best', 'Kings are bad', 'Never ask for a king'],
          correctIndex: 0,
          correctFeedback: 'Perfect! God chooses and anoints leaders for His plan.',
          wrongFeedback: 'The story shows God selected Saul — even if the people asked for a king out of impatience.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God chooses leaders!',
      takeaway: 'God chooses and anoints leaders for His plan — trust His choices.',
      prayer: 'God, thank You for choosing leaders. Help me trust Your plan. Amen.'
    },

    saulDisobedience: {
      kjvRef: '1 Samuel 13; 15',
      paragraphs: [
        'Saul was king, but he disobeyed God. He offered a sacrifice himself instead of waiting for Samuel.',
        'Samuel said, "You have not kept the Lord\'s command — your kingdom will not last."',
        'Later, God told Saul to destroy the Amalekites completely. Saul spared their king and the best animals.',
        'Samuel confronted Saul: "Obedience is better than sacrifice." Saul\'s disobedience cost him the kingdom.',
        'God rejected Saul as king. He was looking for a man after His own heart — David.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Saul offering sacrifice himself, impatient face, no text',
        'fun kid illustration: Samuel arriving late, Saul explaining, Samuel sad, no text',
        'colorful Bible scene for children: Saul sparing Amalekite king and animals, disobeying God, no text',
        'exciting cartoon: Samuel confronting Saul, "Obedience better than sacrifice", serious moment, no text',
        'hopeful ending illustration: God looking for David, Saul rejected, future hope, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Obedience matters more than sacrifice!',
      quizHeading: 'Saul\'s Disobedience Questions',
      questions: [
        {
          question: 'What did Saul do wrong the first time?',
          choices: ['Waited for Samuel', 'Offered sacrifice himself', 'Fought alone', 'Built a temple'],
          correctIndex: 1,
          correctFeedback: 'Yes! Saul didn\'t wait for Samuel and offered the sacrifice himself.',
          wrongFeedback: 'Not wait or fight. Saul offered the sacrifice before Samuel arrived (1 Samuel 13:8–14).'
        },
        {
          question: 'What did Samuel say to Saul?',
          choices: ['Your kingdom will last forever', 'Your kingdom will not last', 'You are great', 'Wait longer'],
          correctIndex: 1,
          correctFeedback: 'Right! "Your kingdom will not endure" because of disobedience.',
          wrongFeedback: 'Not last forever. Samuel said Saul\'s kingdom would not continue because he didn\'t obey (1 Samuel 13:14).'
        },
        {
          question: 'What did God tell Saul to do to the Amalekites?',
          choices: ['Make friends', 'Destroy them completely', 'Give them gifts', 'Trade with them'],
          correctIndex: 1,
          correctFeedback: 'Yes! Completely destroy them — no sparing.',
          wrongFeedback: 'Not friends or gifts. God commanded "Utterly destroy all that they have" (1 Samuel 15:3).'
        },
        {
          question: 'What did Saul do instead?',
          choices: ['Obeyed fully', 'Spared the king and best animals', 'Ran away', 'Fought harder'],
          correctIndex: 1,
          correctFeedback: 'Correct! Saul spared King Agag and the best sheep and cattle.',
          wrongFeedback: 'Not obeyed fully. Saul spared the best to sacrifice — but God wanted obedience (1 Samuel 15:9).'
        },
        {
          question: 'What can we learn from Saul\'s disobedience?',
          choices: ['Obedience is better than sacrifice', 'Disobey when convenient', 'God likes partial obedience', 'Never listen to prophets'],
          correctIndex: 0,
          correctFeedback: 'Perfect! Obedience is better than sacrifice — God wants a willing heart.',
          wrongFeedback: 'Samuel said "To obey is better than sacrifice" (1 Samuel 15:22). God values full obedience!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — obedience matters!',
      takeaway: 'Obedience is better than sacrifice — God wants a willing heart.',
      prayer: 'God, help me obey You fully. Thank You for Your love. Amen.'
    },

    davidAnointed: {
      kjvRef: '1 Samuel 16:1–13',
      paragraphs: [
        'God told Samuel to go to Bethlehem and anoint a new king. Samuel was afraid of Saul, but God said "Go."',
        'Samuel went to Jesse\'s house. Jesse brought his older sons before Samuel, but God said no.',
        'God told Samuel, "Do not look at appearance — I look at the heart."',
        'The youngest son, David, was out with the sheep. Samuel sent for him.',
        'God said, "This is the one." Samuel anointed David with oil — the Spirit of the Lord came on him powerfully.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Samuel arriving at Jesse\'s house, oil horn ready, no text',
        'fun kid illustration: Jesse bringing tall strong sons before Samuel, Samuel shaking head, no text',
        'colorful Bible scene for children: God telling Samuel "I look at the heart", Samuel waiting, no text',
        'exciting cartoon: young David coming from sheep, ruddy face, Samuel anointing him with oil, no text',
        'happy ending illustration: Spirit of the Lord coming on David, glowing, brothers watching, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God chose David by his heart, not looks!',
      quizHeading: 'David Anointed Questions',
      questions: [
        {
          question: 'Why did God send Samuel to Bethlehem?',
          choices: ['To visit friends', 'To anoint a new king', 'To sell sheep', 'To build a temple'],
          correctIndex: 1,
          correctFeedback: 'Yes! To anoint the next king — David.',
          wrongFeedback: 'Not friends or sheep. God said "Fill your horn with oil and go to Bethlehem — I have chosen a king" (1 Samuel 16:1).'
        },
        {
          question: 'What did God tell Samuel about choosing the king?',
          choices: ['Look at height', 'Look at the heart', 'Choose the oldest', 'Choose the richest'],
          correctIndex: 1,
          correctFeedback: 'Right! "Man looks at the outward appearance, but the Lord looks at the heart."',
          wrongFeedback: 'Not height or oldest. God said "Do not consider his appearance… I look at the heart" (1 Samuel 16:7).'
        },
        {
          question: 'Where was David when Samuel came?',
          choices: ['In the house', 'With the sheep', 'At school', 'In the city'],
          correctIndex: 1,
          correctFeedback: 'Yes! David was the youngest, out tending sheep.',
          wrongFeedback: 'Not in the house. David was the youngest son — with the sheep (1 Samuel 16:11).'
        },
        {
          question: 'What happened when Samuel anointed David?',
          choices: ['Nothing', 'The Spirit of the Lord came on him powerfully', 'He cried', 'He ran away'],
          correctIndex: 1,
          correctFeedback: 'Exactly! God\'s Spirit came on David from that day.',
          wrongFeedback: 'Not nothing. The Spirit of the Lord rushed upon David powerfully after anointing (1 Samuel 16:13).'
        },
        {
          question: 'What can we learn from God choosing David?',
          choices: ['God cares about looks', 'God looks at the heart', 'God chooses the oldest', 'God likes tall people'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God chooses by heart, not appearance.',
          wrongFeedback: 'The story shows God values inner character — a heart after Him!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God looks at the heart!',
      takeaway: 'God chooses by the heart — be a person after God\'s own heart.',
      prayer: 'God, help me have a heart that pleases You. Amen.'
    },

    solomonWisdom: {
      kjvRef: '1 Kings 3',
      paragraphs: [
        'Solomon became king after David. God appeared to him in a dream and said, "Ask for whatever you want."',
        'Solomon asked for wisdom to judge the people righteously. God was pleased.',
        'God gave Solomon great wisdom — more than anyone before or after.',
        'He also gave Solomon riches and honor because he asked for wisdom first.',
        'Solomon\'s wisdom became famous. People came from far away to hear him.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Solomon as young king, God appearing in dream, no text',
        'fun kid illustration: Solomon asking God for wisdom, humble face, no text',
        'colorful Bible scene for children: God giving Solomon wisdom, glowing light, no text',
        'exciting cartoon: Solomon judging wisely between two mothers, people amazed, no text',
        'happy ending illustration: people from far lands coming to hear Solomon\'s wisdom, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Solomon asked for wisdom — God gave him more than he asked!',
      quizHeading: 'Solomon\'s Wisdom Questions',
      questions: [
        {
          question: 'What did God offer Solomon in a dream?',
          choices: ['Riches', 'Ask for whatever you want', 'Power', 'Long life'],
          correctIndex: 1,
          correctFeedback: 'Yes! God said "Ask for whatever you want."',
          wrongFeedback: 'Not riches or power first. God said "Ask what I shall give you" (1 Kings 3:5).'
        },
        {
          question: 'What did Solomon ask for?',
          choices: ['Riches', 'Wisdom to judge the people', 'A big army', 'A long life'],
          correctIndex: 1,
          correctFeedback: 'Right! Wisdom to lead God\'s people righteously.',
          wrongFeedback: 'Not riches or army. Solomon asked for "an understanding heart to judge Your people" (1 Kings 3:9).'
        },
        {
          question: 'Was God pleased with Solomon\'s request?',
          choices: ['No, He was angry', 'Yes, He was pleased', 'He ignored it', 'He punished him'],
          correctIndex: 1,
          correctFeedback: 'Yes! God was pleased because Solomon asked for wisdom.',
          wrongFeedback: 'God was pleased. He gave Solomon wisdom, riches, and honor (1 Kings 3:10–13).'
        },
        {
          question: 'What else did God give Solomon?',
          choices: ['Nothing', 'Riches and honor', 'A new kingdom', 'Enemies'],
          correctIndex: 1,
          correctFeedback: 'Exactly! God gave wisdom, riches, and honor.',
          wrongFeedback: 'God gave more than asked — wisdom plus riches and honor (1 Kings 3:13).'
        },
        {
          question: 'What can we learn from Solomon\'s request?',
          choices: ['Ask for money first', 'Ask for wisdom to serve others', 'Never ask God anything', 'Ask for power'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Ask for wisdom to serve God and people.',
          wrongFeedback: 'Solomon asked for wisdom to judge righteously — God blessed him greatly for it!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — wisdom is the best gift!',
      takeaway: 'Ask God for wisdom to serve others — He gives generously.',
      prayer: 'God, give me wisdom to do what is right. Thank You for Your help. Amen.'
    },

    solomonTemple: {
      kjvRef: '1 Kings 5–8',
      paragraphs: [
        'Solomon built a beautiful temple for God in Jerusalem. It took seven years.',
        'The temple had cedar wood, gold, and precious stones. It was a place for God\'s presence.',
        'When the temple was finished, Solomon brought the ark of the covenant into the Holy of Holies.',
        'God\'s glory filled the temple like a cloud. The priests could not stand to minister.',
        'Solomon prayed a long prayer of dedication. He asked God to hear prayers made toward the temple.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Solomon overseeing temple construction, workers building, no text',
        'fun kid illustration: beautiful temple with cedar wood, gold, and stones, grand design, no text',
        'colorful Bible scene for children: priests bringing ark into Holy of Holies, solemn moment, no text',
        'exciting cartoon: God\'s glory cloud filling the temple, priests unable to stand, no text',
        'happy ending illustration: Solomon praying dedication prayer, people worshiping, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Solomon built a house for God — God filled it with glory!',
      quizHeading: 'Solomon Builds the Temple Questions',
      questions: [
        {
          question: 'What did Solomon build for God?',
          choices: ['A palace', 'A temple', 'A wall', 'A garden'],
          correctIndex: 1,
          correctFeedback: 'Yes! A beautiful temple in Jerusalem.',
          wrongFeedback: 'Not a palace or garden. Solomon built the temple for God\'s name (1 Kings 5–6).'
        },
        {
          question: 'How long did it take to build the temple?',
          choices: ['One year', 'Seven years', 'Twenty years', 'Forty years'],
          correctIndex: 1,
          correctFeedback: 'Right! Seven years to complete the temple.',
          wrongFeedback: 'Not one or forty. It took seven years to build (1 Kings 6:38).'
        },
        {
          question: 'What was brought into the Holy of Holies?',
          choices: ['Gold', 'The ark of the covenant', 'Animals', 'Food'],
          correctIndex: 1,
          correctFeedback: 'Yes! The ark was placed in the most holy place.',
          wrongFeedback: 'Not gold or animals. The priests brought the ark into the Holy of Holies (1 Kings 8:6).'
        },
        {
          question: 'What filled the temple when the ark was placed?',
          choices: ['Smoke', 'God\'s glory cloud', 'Music', 'People'],
          correctIndex: 1,
          correctFeedback: 'Exactly! God\'s glory filled the temple like a cloud.',
          wrongFeedback: 'Not smoke or music. The glory of the Lord filled the house so priests could not stand (1 Kings 8:10–11).'
        },
        {
          question: 'What can we learn from Solomon\'s temple?',
          choices: ['God doesn\'t care about houses', 'God\'s presence is special', 'Build big buildings', 'Forget God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God\'s presence is holy and special.',
          wrongFeedback: 'The temple showed God\'s glory. He is near when we worship Him!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God\'s presence is special!',
      takeaway: 'God\'s presence is holy — He is near when we worship Him.',
      prayer: 'God, thank You for being near. Help me worship You. Amen.'
    },

    elijahFireFromHeaven: {
      kjvRef: '1 Kings 18',
      paragraphs: [
        'King Ahab and Queen Jezebel worshiped Baal. Elijah said, "The Lord is God — not Baal."',
        'Elijah challenged 450 prophets of Baal on Mount Carmel. "Let\'s see whose god answers with fire."',
        'The Baal prophets prayed all day — no fire. Elijah prayed once. God sent fire from heaven that burned the sacrifice, stones, water, and dust!',
        'The people shouted, "The Lord — He is God!" Elijah prayed for rain — clouds came and rain fell.',
        'Elijah showed God\'s power. The people turned back to the true God.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Elijah on Mount Carmel facing 450 Baal prophets, altar ready, no text',
        'fun kid illustration: Baal prophets praying and dancing, no fire, tired faces, no text',
        'colorful Bible scene for children: Elijah praying, fire from heaven burning sacrifice and water, people amazed, no text',
        'exciting cartoon: people shouting "The Lord is God!", Baal prophets gone, victory moment, no text',
        'happy ending illustration: rain clouds coming, land green again, people rejoicing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Elijah showed God is the only true God!',
      quizHeading: 'Elijah on Mount Carmel Questions',
      questions: [
        {
          question: 'Who did the prophets of Baal worship?',
          choices: ['The Lord', 'Baal', 'Elijah', 'Ahab'],
          correctIndex: 1,
          correctFeedback: 'Yes! They worshiped Baal — a false god.',
          wrongFeedback: 'Not the Lord. The 450 prophets worshiped Baal (1 Kings 18:19).'
        },
        {
          question: 'What did Elijah challenge the prophets to do?',
          choices: ['Dance all day', 'See whose god sends fire on the altar', 'Build a tower', 'Run a race'],
          correctIndex: 1,
          correctFeedback: 'Right! "Let the God who answers by fire be God."',
          wrongFeedback: 'Not dance or race. Elijah said "Call on the name of your god… I will call on the name of the Lord" (1 Kings 18:24).'
        },
        {
          question: 'What happened when the Baal prophets prayed?',
          choices: ['Fire came', 'Nothing — no answer', 'Rain fell', 'The altar burned'],
          correctIndex: 1,
          correctFeedback: 'Yes! They prayed all day — no fire came.',
          wrongFeedback: 'No fire or rain. They called, danced, and cut themselves — but no one answered (1 Kings 18:26–29).'
        },
        {
          question: 'What happened when Elijah prayed?',
          choices: ['Nothing', 'Fire from heaven burned everything', 'The people left', 'Baal answered'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Fire fell and consumed the sacrifice, wood, stones, dust, and water.',
          wrongFeedback: 'Not nothing. God sent fire that burned everything on the altar (1 Kings 18:38).'
        },
        {
          question: 'What can we learn from Elijah on Mount Carmel?',
          choices: ['Baal is real', 'The Lord is the only true God', 'Fire is magic', 'Never pray aloud'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The Lord is God — He answers by fire and power.',
          wrongFeedback: 'The people shouted "The Lord — He is God!" (1 Kings 18:39). Trust the true God!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — the Lord is God!',
      takeaway: 'The Lord is the only true God — trust Him alone.',
      prayer: 'God, thank You for being the true God. Help me worship only You. Amen.'
    },

    elijahElijahElisha: {
      kjvRef: '1 Kings 19:19–21',
      paragraphs: [
        'Elijah was a great prophet. God told him to anoint Elisha as the next prophet.',
        'Elijah found Elisha plowing with twelve yoke of oxen. Elijah threw his cloak over Elisha.',
        'Elisha knew what it meant. He said goodbye to his parents and followed Elijah.',
        'Elisha served Elijah and learned from him. He became Elijah\'s helper.',
        'Elisha was ready to take Elijah\'s place when God called Elijah home.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Elijah throwing his cloak over Elisha plowing oxen, special moment, no text',
        'fun kid illustration: Elisha saying goodbye to parents, leaving to follow Elijah, no text',
        'colorful Bible scene for children: Elisha serving Elijah, learning from him, no text',
        'exciting cartoon: Elisha ready to take Elijah\'s place, mantle passed, no text',
        'hopeful ending illustration: Elisha as prophet, God with him, people listening, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Elisha left everything to follow and serve Elijah!',
      quizHeading: 'Elijah Calls Elisha Questions',
      questions: [
        {
          question: 'What was Elisha doing when Elijah found him?',
          choices: ['Praying', 'Plowing with oxen', 'Building', 'Sleeping'],
          correctIndex: 1,
          correctFeedback: 'Yes! Elisha was plowing with twelve yoke of oxen.',
          wrongFeedback: 'Not praying or building. Elisha was plowing when Elijah passed by (1 Kings 19:19).'
        },
        {
          question: 'What did Elijah do to call Elisha?',
          choices: ['Gave him money', 'Threw his cloak over him', 'Shouted his name', 'Sent a letter'],
          correctIndex: 1,
          correctFeedback: 'Right! Elijah threw his cloak over Elisha — a sign to follow.',
          wrongFeedback: 'Not money or shout. The cloak meant "Come follow me as prophet" (1 Kings 19:19).'
        },
        {
          question: 'What did Elisha do after the cloak?',
          choices: ['Ran away', 'Said goodbye to parents and followed Elijah', 'Stayed home', 'Fought Elijah'],
          correctIndex: 1,
          correctFeedback: 'Yes! Elisha kissed his parents goodbye and followed.',
          wrongFeedback: 'He didn\'t stay or run. Elisha left his oxen and followed Elijah (1 Kings 19:20–21).'
        },
        {
          question: 'What did Elisha become?',
          choices: ['A farmer', 'Elijah\'s helper and next prophet', 'A king', 'A priest'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Elisha served Elijah and became the next prophet.',
          wrongFeedback: 'Not farmer or king. Elisha was Elijah\'s attendant and took his place later.'
        },
        {
          question: 'What can we learn from Elisha?',
          choices: ['Stay home always', 'Leave everything to follow God\'s call', 'Never obey leaders', 'Hate family'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Elisha left all to follow God\'s call.',
          wrongFeedback: 'The story shows Elisha was willing to leave everything to serve God and Elijah!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — follow God\'s call!',
      takeaway: 'When God calls, be ready to leave everything and follow Him.',
      prayer: 'God, when You call me, help me follow You fully. Amen.'
    },

    elijahChariot: {
      kjvRef: '2 Kings 2:1–14',
      paragraphs: [
        'The Lord would take Elijah up into heaven by a whirlwind. Elisha went with him from Gilgal to Bethel, Jericho, and Jordan.',
        'Elijah said, "Tarry here… the Lord hath sent me to Jordan." Elisha said, "As the Lord liveth… I will not leave thee."',
        'Elijah took his mantle and smote the waters — they divided. They crossed on dry ground.',
        'A chariot of fire and horses of fire appeared. Elijah went up by a whirlwind into heaven. Elisha cried, "My father, my father… the chariot of Israel."',
        'Elisha took Elijah\'s mantle, smote the Jordan, and said, "Where is the Lord God of Elijah?" The waters divided — Elisha crossed over.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Elijah and Elisha walking from Gilgal to Jordan, no text',
        'fun kid illustration: Elijah smiting waters with mantle, Jordan divided, no text',
        'colorful Bible scene for children: chariot of fire and horses, Elijah taken up in whirlwind, no text',
        'exciting cartoon: Elisha crying "My father… chariot of Israel", mantle falls, no text',
        'hopeful ending illustration: Elisha smiting Jordan, waters divide again, God of Elijah with him, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Elijah went up to heaven — Elisha crossed the Jordan again with God!',
      quizHeading: 'Elijah\'s Fiery Chariot Questions',
      questions: [
        {
          question: 'Where was Elijah taken?',
          choices: ['To Egypt', 'Up into heaven by a whirlwind', 'To Babylon', 'To the sea'],
          correctIndex: 1,
          correctFeedback: 'Yes! Taken up into heaven by a whirlwind.',
          wrongFeedback: 'The Lord would take Elijah up into heaven by a whirlwind (2 Kings 2:1).'
        },
        {
          question: 'What did Elisha refuse to do?',
          choices: ['Leave Elijah', 'Follow Elijah', 'Pray', 'Cross Jordan'],
          correctIndex: 0,
          correctFeedback: 'Yes! "As the Lord liveth… I will not leave thee."',
          wrongFeedback: 'Elisha said "As the Lord liveth… I will not leave thee" (2 Kings 2:2,4,6).'
        },
        {
          question: 'How did Elijah part the Jordan?',
          choices: ['With a staff', 'Smote the waters with his mantle', 'With prayer only', 'With fire'],
          correctIndex: 1,
          correctFeedback: 'Right! Smote the waters with his mantle — divided.',
          wrongFeedback: 'Elijah took his mantle and smote the waters — they divided (2 Kings 2:8).'
        },
        {
          question: 'What took Elijah up?',
          choices: ['A donkey', 'A chariot of fire and horses of fire', 'A boat', 'An angel'],
          correctIndex: 1,
          correctFeedback: 'Yes! Chariot of fire and horses of fire, whirlwind.',
          wrongFeedback: 'There appeared a chariot of fire, and horses of fire… Elijah went up by a whirlwind (2 Kings 2:11).'
        },
        {
          question: 'What can we learn from Elijah\'s chariot?',
          choices: ['God abandons prophets', 'God takes faithful servants — Elisha carries on', 'Never follow', 'Fear fire'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God takes faithful servants — Elisha carries on.',
          wrongFeedback: 'Elijah taken up — Elisha received his mantle and continued the work!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God takes the faithful!',
      takeaway: 'God takes faithful servants — the work continues.',
      prayer: 'God, thank You for faithful servants. Help me carry on Your work. Amen.'
    },

    elishaMiracles: {
      kjvRef: '2 Kings 2:19–22; 4:1–7; 4:8–37; 5',
      paragraphs: [
        'Elisha did many miracles after Elijah was taken. He healed bad water in Jericho with salt.',
        'A widow had no money. Elisha told her to borrow jars and pour her little oil into them. The oil kept flowing until all jars were full!',
        'A Shunammite woman\'s son died. Elisha prayed and lay on the boy. The boy sneezed seven times and opened his eyes!',
        'Naaman had leprosy. Elisha told him to wash seven times in the Jordan. Naaman obeyed and was healed!',
        'God used Elisha to show His power and love for people.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Elisha throwing salt into bad water, water becoming clean, no text',
        'fun kid illustration: widow pouring oil into many jars, oil never stopping, happy face, no text',
        'colorful Bible scene for children: Elisha praying over dead boy, boy sneezing and waking, miracle moment, no text',
        'exciting cartoon: Naaman washing in Jordan seven times, skin healed, no text',
        'happy ending illustration: Elisha helping people, God\'s power shown, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Elisha did miracles to help people and show God\'s power!',
      quizHeading: 'Elisha\'s Miracles Questions',
      questions: [
        {
          question: 'How did Elisha heal the bad water in Jericho?',
          choices: ['With salt', 'With prayer only', 'With a new river', 'With fire'],
          correctIndex: 0,
          correctFeedback: 'Yes! Elisha threw salt into the spring — God healed it.',
          wrongFeedback: 'Not prayer only. Elisha used salt as God instructed (2 Kings 2:19–22).'
        },
        {
          question: 'What did Elisha tell the widow to do with her oil?',
          choices: ['Sell it', 'Pour it into borrowed jars', 'Drink it', 'Throw it away'],
          correctIndex: 1,
          correctFeedback: 'Right! The oil kept flowing until all jars were full.',
          wrongFeedback: 'Not sell or drink. Elisha said borrow jars — the oil multiplied (2 Kings 4:1–7).'
        },
        {
          question: 'What happened to the Shunammite woman\'s son?',
          choices: ['He ran away', 'He died and Elisha raised him', 'He got sick', 'He moved away'],
          correctIndex: 1,
          correctFeedback: 'Yes! The boy died — Elisha prayed and he lived again.',
          wrongFeedback: 'Not ran away. The son died — Elisha lay on him and he sneezed seven times (2 Kings 4:32–35).'
        },
        {
          question: 'How was Naaman healed of leprosy?',
          choices: ['By eating special food', 'By washing seven times in the Jordan', 'By giving money', 'By sleeping'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Naaman washed seven times — God healed him.',
          wrongFeedback: 'Not food or money. Elisha said "Wash in the Jordan seven times" (2 Kings 5:10).'
        },
        {
          question: 'What can we learn from Elisha\'s miracles?',
          choices: ['God doesn\'t help people', 'God uses prophets to show His power and love', 'Miracles are fake', 'Never obey prophets'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God used Elisha to help and show His love.',
          wrongFeedback: 'The miracles showed God cares for people and has power over sickness and death!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God\'s power helps people!',
      takeaway: 'God uses His servants to show His power and love for people.',
      prayer: 'God, thank You for Your power. Help me trust You to help others. Amen.'
    },

    elishaFloatingAxe: {
      kjvRef: '2 Kings 6:1–7',
      paragraphs: [
        'Elisha\'s helpers were building a place to live. One man\'s axe head fell into the Jordan River.',
        'The man was upset — the axe was borrowed. Elisha asked, "Where did it fall?"',
        'Elisha cut a stick and threw it into the water. The iron axe head floated to the top!',
        'The man picked it up. God did a miracle through Elisha.',
        'Elisha showed God cares about small things too.'
      ],
      imagePrompts: [
        'bright cartoon for kids: men building a house near river, axe head falling into water, no text',
        'fun kid illustration: man sad about lost borrowed axe head in river, Elisha asking "Where did it fall?", no text',
        'colorful Bible scene for children: Elisha throwing stick into water, axe head floating up, miracle moment, no text',
        'exciting cartoon: man picking up floating axe head, happy face, no text',
        'happy ending illustration: men working again, axe head back, praising God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God cares about small things — even a lost axe head!',
      quizHeading: 'Floating Axe Head Questions',
      questions: [
        {
          question: 'What happened to the man\'s axe head?',
          choices: ['It broke', 'It fell into the Jordan River', 'It got stolen', 'It disappeared'],
          correctIndex: 1,
          correctFeedback: 'Yes! The iron axe head fell into the water.',
          wrongFeedback: 'Not broke or stolen. The axe head fell off into the Jordan (2 Kings 6:5).'
        },
        {
          question: 'Why was the man upset?',
          choices: ['It was expensive', 'It was borrowed', 'It was old', 'It was heavy'],
          correctIndex: 1,
          correctFeedback: 'Right! The axe was borrowed — he had to return it.',
          wrongFeedback: 'Not expensive or old. The man said "Alas, my master! It was borrowed" (2 Kings 6:5).'
        },
        {
          question: 'What did Elisha do?',
          choices: ['Jumped in the river', 'Cut a stick and threw it into the water', 'Prayed silently', 'Called for help'],
          correctIndex: 1,
          correctFeedback: 'Yes! Elisha threw a stick — the iron floated.',
          wrongFeedback: 'Not jump or pray silently. Elisha cut a stick and threw it in — the iron axe head floated (2 Kings 6:6).'
        },
        {
          question: 'What happened to the axe head?',
          choices: ['Sank deeper', 'Floated to the top', 'Disappeared', 'Turned to gold'],
          correctIndex: 1,
          correctFeedback: 'Exactly! The iron axe head floated — miracle!',
          wrongFeedback: 'Iron doesn\'t float normally. God made it float so the man could pick it up!'
        },
        {
          question: 'What can we learn from the floating axe head?',
          choices: ['God doesn\'t care about small things', 'God cares about small things too', 'Never borrow tools', 'Iron floats'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God cares about even small problems.',
          wrongFeedback: 'The miracle shows God cares about everyday needs — He helped the man with a lost tool!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God cares about small things!',
      takeaway: 'God cares about even small things in our lives.',
      prayer: 'God, thank You for caring about my small problems. Help me trust You. Amen.'
    },

    isaiahMessianic: {
      kjvRef: 'Isaiah 7:14; 9:6–7; 53:4–6',
      paragraphs: [
        'Isaiah prophesied: "Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel."',
        'Unto us a child is born, unto us a son is given. His name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.',
        'Of the increase of his government and peace there shall be no end. He shall reign on the throne of David forever.',
        'He was wounded for our transgressions, bruised for our iniquities. The chastisement of our peace was upon him — by his stripes we are healed.',
        'All we like sheep have gone astray — the Lord laid on him the iniquity of us all. Isaiah spoke of the coming Messiah.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Isaiah prophesying a virgin shall conceive, Immanuel, no text',
        'fun kid illustration: child born, called Wonderful Counsellor, Prince of Peace, no text',
        'colorful Bible scene for children: Messiah reigning on throne of David forever, no text',
        'hopeful ending illustration: wounded for transgressions, by stripes we are healed, gentle not graphic, no text',
        'exciting cartoon: sheep gone astray, Lord laying iniquity on Him, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Isaiah prophesied the coming Messiah!',
      quizHeading: 'Isaiah Messianic Prophecies Questions',
      questions: [
        {
          question: 'What did Isaiah prophesy about a virgin?',
          choices: ['She shall have no son', 'A virgin shall conceive and bear a son — Immanuel', 'She shall be queen', 'She shall fight'],
          correctIndex: 1,
          correctFeedback: 'Yes! "A virgin shall conceive, and bear a son… Immanuel."',
          wrongFeedback: 'Isaiah prophesied "Behold, a virgin shall conceive… call his name Immanuel" (Isaiah 7:14).'
        },
        {
          question: 'What names did Isaiah give the child?',
          choices: ['Ordinary, Weak', 'Wonderful, Counsellor, Mighty God, Everlasting Father, Prince of Peace', 'King only', 'Judge only'],
          correctIndex: 1,
          correctFeedback: 'Right! Wonderful, Counsellor, Mighty God, Everlasting Father, Prince of Peace.',
          wrongFeedback: 'For unto us a child is born… his name shall be called Wonderful, Counsellor… (Isaiah 9:6).'
        },
        {
          question: 'What did Isaiah say about the Messiah\'s government?',
          choices: ['It will end', 'Of the increase of his government and peace there shall be no end', 'It is small', 'It is weak'],
          correctIndex: 1,
          correctFeedback: 'Yes! No end to His government and peace.',
          wrongFeedback: 'Of the increase of his government and peace there shall be no end (Isaiah 9:7).'
        },
        {
          question: 'Why was He wounded?',
          choices: ['For His own sins', 'For our transgressions and iniquities', 'For riches', 'For power'],
          correctIndex: 1,
          correctFeedback: 'Right! Wounded for our transgressions, bruised for our iniquities.',
          wrongFeedback: 'He was wounded for our transgressions… by his stripes we are healed (Isaiah 53:5).'
        },
        {
          question: 'What can we learn from Isaiah\'s prophecies?',
          choices: ['Messiah never comes', 'Isaiah prophesied the coming Savior — Jesus', 'Ignore prophets', 'Never read Isaiah'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Isaiah prophesied the coming Messiah — Jesus.',
          wrongFeedback: 'Isaiah spoke of the Savior who would be born, reign, and die for our sins!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Isaiah prophesied Jesus!',
      takeaway: 'Isaiah prophesied the coming Savior — Jesus.',
      prayer: 'God, thank You for sending Jesus. Help me trust Your promises. Amen.'
    },

    jeremiahWeeping: {
      kjvRef: 'Lamentations 1–5',
      paragraphs: [
        'Jeremiah wept over Jerusalem after its fall. "How doth the city sit solitary, that was full of people!"',
        'She is become as a widow. Her gates are desolate, her priests sigh, her virgins are afflicted.',
        'Judah is gone into captivity because of affliction and great servitude. She dwells among the heathen, finds no rest.',
        'Jeremiah cried, "Is it nothing to you, all ye that pass by? behold, and see if there be any sorrow like unto my sorrow."',
        'Yet he hoped: "It is of the Lord\'s mercies that we are not consumed… great is thy faithfulness."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jeremiah weeping over fallen Jerusalem, city solitary, no text',
        'fun kid illustration: Jerusalem as widow, gates desolate, priests sighing, no text',
        'colorful Bible scene for children: Judah in captivity, no rest among heathen, no text',
        'exciting cartoon: Jeremiah crying "Is it nothing to you… any sorrow like my sorrow?", no text',
        'hopeful ending illustration: mercies of the Lord, great faithfulness, hope in God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jeremiah wept for Jerusalem — yet hoped in God\'s mercies!',
      quizHeading: 'Jeremiah Weeping Questions',
      questions: [
        {
          question: 'What did Jeremiah weep over?',
          choices: ['His own house', 'Jerusalem after its fall', 'The sea', 'The mountains'],
          correctIndex: 1,
          correctFeedback: 'Yes! Over Jerusalem — solitary, once full of people.',
          wrongFeedback: 'Jeremiah wept over Jerusalem: "How doth the city sit solitary…" (Lamentations 1:1).'
        },
        {
          question: 'What had happened to Jerusalem?',
          choices: ['It grew stronger', 'Become as a widow, gates desolate', 'Became rich', 'Remained full'],
          correctIndex: 1,
          correctFeedback: 'Right! Become as a widow, gates desolate.',
          wrongFeedback: 'She is become as a widow… her gates are desolate (Lamentations 1:1).'
        },
        {
          question: 'Why was Judah in captivity?',
          choices: ['Because of blessing', 'Because of affliction and great servitude', 'Because they were strong', 'Because of wealth'],
          correctIndex: 1,
          correctFeedback: 'Yes! Because of affliction and great servitude.',
          wrongFeedback: 'Judah is gone into captivity because of affliction and great servitude (Lamentations 1:3).'
        },
        {
          question: 'What did Jeremiah cry to passers-by?',
          choices: ['Nothing', 'Is it nothing to you… any sorrow like my sorrow?', 'Be happy', 'Go away'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Is it nothing to you, all ye that pass by?"',
          wrongFeedback: 'Jeremiah cried "Is it nothing to you, all ye that pass by? behold, and see if there be any sorrow like unto my sorrow" (Lamentations 1:12).'
        },
        {
          question: 'What hope did Jeremiah have?',
          choices: ['No hope', 'Mercies of the Lord — great is thy faithfulness', 'Give up', 'Forget God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Mercies of the Lord — great faithfulness.',
          wrongFeedback: 'It is of the Lord\'s mercies that we are not consumed… great is thy faithfulness (Lamentations 3:22–23).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — hope in God\'s mercies!',
      takeaway: 'Even in sorrow, hope in God\'s mercies — great is His faithfulness.',
      prayer: 'God, thank You for Your mercies. Help me hope in You. Amen.'
    },

    ezekielValleyBones: {
      kjvRef: 'Ezekiel 37:1–14',
      paragraphs: [
        'The hand of the Lord was upon Ezekiel; he was set down in the midst of a valley full of bones — behold, they were very dry.',
        'God said, Son of man, can these bones live? Ezekiel answered, O Lord God, thou knowest.',
        'Prophesy unto these bones: Hear ye the word of the Lord. There was a noise and a shaking — bone came to bone, sinews and flesh came up, skin covered them, yet there was no breath.',
        'Prophesy unto the wind: Come from the four winds, O breath, and breathe upon these slain, that they may live. Breath came into them, and they lived, and stood up upon their feet, an exceeding great army.',
        'God said, These bones are the whole house of Israel… I will put my spirit in you, and ye shall live, and I shall place you in your own land — then shall ye know that I the Lord have spoken it.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Ezekiel in valley of dry bones, bones scattered, no text',
        'fun kid illustration: God asking Son of man can these bones live, Ezekiel humble, no text',
        'colorful Bible scene for children: Ezekiel prophesying, bones joining, sinews and skin, no text',
        'exciting cartoon: breath from four winds, army standing, hope, no text',
        'hopeful ending illustration: God\'s spirit, people living, promise, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God can bring life to dry bones — He can bring life to us!',
      quizHeading: 'Valley of Dry Bones Questions',
      questions: [
        {
          question: 'Where did God set Ezekiel?',
          choices: ['A mountain', 'A valley full of very dry bones', 'A river only', 'A palace'],
          correctIndex: 1,
          correctFeedback: 'Yes! Midst of a valley full of bones — very dry.',
          wrongFeedback: 'The Lord… set me down in the midst of the valley which was full of bones (Ezekiel 37:1).'
        },
        {
          question: 'What did God ask?',
          choices: ['Can these bones live?', 'Can you build?', 'Can you fly?', 'Can you sing?'],
          correctIndex: 0,
          correctFeedback: 'Right! Son of man, can these bones live?',
          wrongFeedback: 'God asked "Son of man, can these bones live?" (Ezekiel 37:3).'
        },
        {
          question: 'What did Ezekiel first prophesy to?',
          choices: ['The wind only', 'The bones — Hear ye the word of the Lord', 'The king', 'The sky'],
          correctIndex: 1,
          correctFeedback: 'Yes! Prophesy unto these bones.',
          wrongFeedback: 'Prophesy unto these bones, and say unto them, Hear ye the word of the Lord (Ezekiel 37:4).'
        },
        {
          question: 'What happened when he prophesied to the breath?',
          choices: ['Nothing', 'Breath entered — they lived and stood, an exceeding great army', 'They fell apart', 'They hid'],
          correctIndex: 1,
          correctFeedback: 'Yes! The breath came — they stood on their feet.',
          wrongFeedback: 'The breath came into them, and they lived, and stood up upon their feet, an exceeding great army (Ezekiel 37:10).'
        },
        {
          question: 'What can we learn from the valley of dry bones?',
          choices: ['God cannot revive hope', 'God can bring life — He will put His Spirit in His people', 'Bones always stay dead', 'Never speak God\'s word'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Nothing is too hopeless for the Lord.',
          wrongFeedback: 'I will put my spirit in you, and ye shall live (Ezekiel 37:14).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God brings life!',
      takeaway: 'God can bring life to anything — even dry bones.',
      prayer: 'God, thank Thee for bringing life. Put Thy Spirit in me. Amen.'
    },

    danielFieryFurnace: {
      kjvRef: 'Daniel 3',
      paragraphs: [
        'King Nebuchadnezzar made a golden image. He commanded everyone to bow down to it.',
        'Shadrach, Meshach, and Abednego refused. They said, "Our God can deliver us — but even if He doesn\'t, we will not bow."',
        'The king was furious. He heated the furnace seven times hotter and threw the three men in.',
        'The flames were so hot they killed the guards. But the king saw four men walking in the fire — unharmed!',
        'The king called them out. They were not hurt. The king praised their God.'
      ],
      imagePrompts: [
        'bright cartoon for kids: King making golden image, people bowing, three men standing tall, no text',
        'fun kid illustration: Shadrach, Meshach, Abednego refusing to bow, brave faces, no text',
        'colorful Bible scene for children: furnace heated seven times hotter, three men thrown in, no text',
        'exciting cartoon: king seeing four men walking in fire, unharmed, angel with them, no text',
        'happy ending illustration: three men out of furnace, not even smell of smoke, king praising God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The three men trusted God — even in the fire!',
      quizHeading: 'Fiery Furnace Questions',
      questions: [
        {
          question: 'What did the king make everyone bow to?',
          choices: ['A statue of himself', 'A golden image', 'A tree', 'A mountain'],
          correctIndex: 1,
          correctFeedback: 'Yes! A golden image he built.',
          wrongFeedback: 'Not himself or tree. The king made a golden image and commanded all to bow (Daniel 3:1–5).'
        },
        {
          question: 'Who refused to bow?',
          choices: ['The king\'s sons', 'Shadrach, Meshach, and Abednego', 'Daniel', 'All the people'],
          correctIndex: 1,
          correctFeedback: 'Right! The three Hebrew men refused.',
          wrongFeedback: 'Not Daniel or all. Shadrach, Meshach, and Abednego would not bow (Daniel 3:12).'
        },
        {
          question: 'What did the three men say to the king?',
          choices: ['We will bow', 'Our God can deliver us — but even if not, we will not bow', 'We are afraid', 'We will bow if you pay us'],
          correctIndex: 1,
          correctFeedback: 'Yes! They trusted God completely.',
          wrongFeedback: 'Not bow or afraid. They said "Our God is able to deliver us… but if not, we will not serve your gods" (Daniel 3:17–18).'
        },
        {
          question: 'How hot was the furnace?',
          choices: ['Normal', 'Seven times hotter', 'A little hotter', 'Cold'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Seven times hotter — very hot!',
          wrongFeedback: 'The king ordered it heated seven times hotter (Daniel 3:19).'
        },
        {
          question: 'What can we learn from the fiery furnace?',
          choices: ['Never trust God in danger', 'God protects those who stand for Him', 'Bow to idols', 'Run from kings'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God protects those who stand firm for Him.',
          wrongFeedback: 'The three men stood firm — God walked with them in the fire!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God protects the faithful!',
      takeaway: 'God protects those who stand firm for Him — even in fire.',
      prayer: 'God, help me stand firm for You. Thank You for Your protection. Amen.'
    },

    danielLionsDen: {
      kjvRef: 'Daniel 6',
      paragraphs: [
        'Daniel prayed to God three times a day, even after a law forbade it. The king signed the decree — pray only to him or be thrown to lions.',
        'Daniel continued praying with windows open toward Jerusalem. His enemies told the king.',
        'The king was grieved but cast Daniel into the lions\' den. A stone was laid and sealed.',
        'The king fasted all night. At dawn he cried, "Daniel, servant of the living God, is thy God able to deliver thee?"',
        'Daniel answered, "My God hath sent his angel, and hath shut the lions\' mouths." The king was glad — the men who had lied about Daniel faced the king\'s justice.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Daniel praying three times a day, windows open toward Jerusalem, no text',
        'fun kid illustration: enemies telling king about Daniel praying, no text',
        'colorful Bible scene for children: Daniel thrown into lions\' den, stone sealed, king grieved, no text',
        'exciting cartoon: king at dawn asking "Is thy God able?", Daniel safe, no text',
        'hopeful ending illustration: Daniel coming out unharmed, lions calm, king praising God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Daniel prayed even when forbidden — God shut the lions\' mouths!',
      quizHeading: 'Daniel in Lions\' Den Questions',
      questions: [
        {
          question: 'How often did Daniel pray?',
          choices: ['Once a day', 'Three times a day', 'Never', 'Only at night'],
          correctIndex: 1,
          correctFeedback: 'Yes! Three times a day with windows open.',
          wrongFeedback: 'Daniel prayed three times a day toward Jerusalem (Daniel 6:10).'
        },
        {
          question: 'What law did the king sign?',
          choices: ['Pray to God only', 'Pray only to the king for 30 days or lions', 'No praying at all', 'Pray to lions'],
          correctIndex: 1,
          correctFeedback: 'Right! Pray only to the king or be thrown to lions.',
          wrongFeedback: 'The decree said pray only to the king for 30 days or be cast into the lions\' den (Daniel 6:7).'
        },
        {
          question: 'What did Daniel do when the law passed?',
          choices: ['Stopped praying', 'Kept praying three times a day', 'Prayed to the king', 'Hid'],
          correctIndex: 1,
          correctFeedback: 'Yes! Daniel kept his habit — praying to God.',
          wrongFeedback: 'Daniel continued praying three times a day (Daniel 6:10).'
        },
        {
          question: 'What did God do in the lions\' den?',
          choices: ['Nothing', 'Sent an angel to shut the lions\' mouths', 'Made Daniel sleep', 'Sent fire'],
          correctIndex: 1,
          correctFeedback: 'Yes! Angel shut the lions\' mouths.',
          wrongFeedback: 'God sent His angel to shut the lions\' mouths (Daniel 6:22).'
        },
        {
          question: 'What can we learn from Daniel in the lions\' den?',
          choices: ['Never pray', 'Keep praying even when forbidden', 'Obey bad laws', 'Hide faith'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Keep praying — God protects the faithful.',
          wrongFeedback: 'Daniel prayed despite the law — God delivered him!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — keep praying!',
      takeaway: 'Keep praying even when forbidden — God protects the faithful.',
      prayer: 'God, help me pray to You always. Thank You for protection. Amen.'
    },

    ezraReturn: {
      kjvRef: 'Ezra 1–10; Nehemiah 8–9',
      paragraphs: [
        'God stirred the heart of Cyrus king of Persia to make a decree: let the Jews return to Jerusalem to build the house of the Lord.',
        'Ezra led many back. They brought vessels of gold and silver for the temple. The people wept when they saw the foundation laid.',
        'Ezra read the book of the law before the people. They stood and said "Amen" and lifted up their hands. They wept when they heard the words.',
        'Nehemiah said "This day is holy unto the Lord — mourn not." They kept the feast of tabernacles and rejoiced greatly.',
        'Ezra prayed and confessed the sins of the people. Many repented and put away strange wives. The people renewed the covenant with God.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Cyrus king of Persia making decree, Jews preparing to return, no text',
        'fun kid illustration: Ezra leading people back to Jerusalem, carrying temple vessels, no text',
        'colorful Bible scene for children: Ezra reading the law, people standing with hands lifted, saying Amen, no text',
        'exciting cartoon: people weeping then rejoicing at feast of tabernacles, no text',
        'hopeful ending illustration: Ezra praying, people repenting and renewing covenant, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Ezra led the return — people renewed the covenant!',
      quizHeading: 'Ezra Return Questions',
      questions: [
        {
          question: 'Who made the decree for the Jews to return?',
          choices: ['Pharaoh', 'Cyrus king of Persia', 'Saul', 'David'],
          correctIndex: 1,
          correctFeedback: 'Yes! God stirred Cyrus to let the Jews return.',
          wrongFeedback: 'Not Pharaoh. Cyrus king of Persia made the decree (Ezra 1:1).'
        },
        {
          question: 'What did the people bring back for the temple?',
          choices: ['Food', 'Vessels of gold and silver', 'Animals', 'Clothes'],
          correctIndex: 1,
          correctFeedback: 'Right! Vessels of gold and silver for the house of the Lord.',
          wrongFeedback: 'Not food or clothes. They brought vessels for the temple (Ezra 1:7–11).'
        },
        {
          question: 'What did Ezra read to the people?',
          choices: ['Stories', 'The book of the law', 'Songs', 'Letters'],
          correctIndex: 1,
          correctFeedback: 'Yes! The book of the law — people wept.',
          wrongFeedback: 'Ezra read the book of the law before the people (Ezra 7:10; Nehemiah 8:1–8).'
        },
        {
          question: 'What did Nehemiah say to the weeping people?',
          choices: ['Mourn more', 'This day is holy — mourn not', 'Go home', 'Be silent'],
          correctIndex: 1,
          correctFeedback: 'Right! "This day is holy unto the Lord — mourn not."',
          wrongFeedback: 'Nehemiah said "This day is holy unto the Lord your God — mourn not" (Nehemiah 8:9).'
        },
        {
          question: 'What can we learn from Ezra\'s return?',
          choices: ['Forget God\'s law', 'Return to God\'s ways and obey', 'Never read Scripture', 'Stay in exile'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Return to God\'s ways — renew the covenant.',
          wrongFeedback: 'Ezra led the people to repent, read the law, and renew the covenant — God restores obedience!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — return to God\'s ways!',
      takeaway: 'Return to God\'s ways and obey His Word — He restores His people.',
      prayer: 'God, help me return to Your ways. Thank You for Your Word. Amen.'
    },

    nehemiahWalls: {
      kjvRef: 'Nehemiah 1–6',
      paragraphs: [
        'Nehemiah was cupbearer to King Artaxerxes. He heard Jerusalem\'s walls were broken.',
        'Nehemiah prayed and asked the king for permission to rebuild. The king said yes.',
        'Nehemiah went to Jerusalem. He inspected the walls at night and planned the work.',
        'Enemies mocked and threatened them. Nehemiah said, "The God of heaven will prosper us."',
        'They worked with one hand on tools and one on weapons. The walls were finished in 52 days!'
      ],
      imagePrompts: [
        'bright cartoon for kids: Nehemiah sad hearing about broken walls, praying, no text',
        'fun kid illustration: Nehemiah asking King Artaxerxes for permission, king listening, no text',
        'colorful Bible scene for children: Nehemiah inspecting broken walls at night, determined face, no text',
        'exciting cartoon: people building walls, one hand on tools, one on sword, enemies mocking, no text',
        'happy ending illustration: finished walls of Jerusalem, people celebrating, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Nehemiah rebuilt the walls despite opposition!',
      quizHeading: 'Nehemiah & the Walls Questions',
      questions: [
        {
          question: 'What made Nehemiah sad?',
          choices: ['The king was mean', 'Jerusalem\'s walls were broken', 'He lost his job', 'He was hungry'],
          correctIndex: 1,
          correctFeedback: 'Yes! The walls were broken and gates burned.',
          wrongFeedback: 'Not job or hunger. Nehemiah heard the walls were broken and gates burned (Nehemiah 1:3).'
        },
        {
          question: 'What did Nehemiah do first?',
          choices: ['Ran away', 'Prayed and asked the king', 'Built alone', 'Gave up'],
          correctIndex: 1,
          correctFeedback: 'Right! He prayed and asked King Artaxerxes for help.',
          wrongFeedback: 'Not run or build alone. Nehemiah prayed, then asked the king for permission (Nehemiah 2:1–8).'
        },
        {
          question: 'How did Nehemiah inspect the walls?',
          choices: ['In the day with everyone', 'At night on a donkey', 'From far away', 'Never'],
          correctIndex: 1,
          correctFeedback: 'Yes! At night on a donkey — secretly.',
          wrongFeedback: 'Not in day or far. Nehemiah rode out at night to inspect the walls (Nehemiah 2:12–15).'
        },
        {
          question: 'What did the enemies do?',
          choices: ['Helped build', 'Mocked and threatened', 'Joined the work', 'Left them alone'],
          correctIndex: 1,
          correctFeedback: 'Correct! They mocked and threatened the builders.',
          wrongFeedback: 'Not help or join. Enemies laughed and threatened to attack (Nehemiah 4:1–3).'
        },
        {
          question: 'What can we learn from Nehemiah?',
          choices: ['Give up when opposed', 'Pray and work despite opposition', 'Never rebuild', 'Trust enemies'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Pray and work — God prospers us.',
          wrongFeedback: 'Nehemiah prayed and worked with one hand on tools and one on weapons. God helped them finish!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — pray and work!',
      takeaway: 'Pray and work despite opposition — God prospers His people.',
      prayer: 'God, help me pray and work for You even when it\'s hard. Amen.'
    },

    malachiMessage: {
      kjvRef: 'Malachi 1–4',
      paragraphs: [
        'Malachi was the last Old Testament prophet. He spoke to people who had returned from exile.',
        'God said, "I have loved you," but they asked, "How have You loved us?"',
        'Malachi warned them: honor God with your best offerings, not leftovers.',
        'He told them to turn back to God. God promised to send Elijah before the great day.',
        'Malachi ended with hope: "The Sun of Righteousness will rise with healing in His wings."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Malachi speaking to people, scroll in hand, no text',
        'fun kid illustration: people asking "How have You loved us?", God answering, no text',
        'colorful Bible scene for children: people bringing poor offerings, God wanting their best, no text',
        'exciting cartoon: promise of Elijah coming before the great day, no text',
        'hopeful ending illustration: Sun of Righteousness rising, healing wings, bright future, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Malachi was the last prophet before silence!',
      quizHeading: 'Malachi\'s Message Questions',
      questions: [
        {
          question: 'What did God say to the people through Malachi?',
          choices: ['I hate you', 'I have loved you', 'Go away', 'Forget Me'],
          correctIndex: 1,
          correctFeedback: 'Yes! "I have loved you" — but they doubted.',
          wrongFeedback: 'Not hate or go away. God said "I have loved you" (Malachi 1:2).'
        },
        {
          question: 'What did the people ask God?',
          choices: ['How have You loved us?', 'Why are You angry?', 'When will You come?', 'What do You want?'],
          correctIndex: 0,
          correctFeedback: 'Right! "How have You loved us?" — they doubted God\'s love.',
          wrongFeedback: 'Not why angry. They questioned "How have You loved us?" (Malachi 1:2).'
        },
        {
          question: 'What did Malachi tell them about offerings?',
          choices: ['Give your worst', 'Give your best', 'Don\'t give anything', 'Give money only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Honor God with your best — not leftovers.',
          wrongFeedback: 'Not worst or nothing. God said "Offer it to your governor — would he accept it?" (Malachi 1:8).'
        },
        {
          question: 'Who did God promise to send before the great day?',
          choices: ['Moses', 'Elijah', 'David', 'Samuel'],
          correctIndex: 1,
          correctFeedback: 'Yes! Elijah before the great and dreadful day.',
          wrongFeedback: 'Not Moses or David. "Behold, I will send you Elijah the prophet" (Malachi 4:5).'
        },
        {
          question: 'What can we learn from Malachi\'s message?',
          choices: ['God doesn\'t love us', 'Honor God with your best', 'Forget offerings', 'Doubt God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Honor God fully — He loves us.',
          wrongFeedback: 'Malachi called the people to give their best and turn back to God!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — honor God with your best!',
      takeaway: 'Honor God with your best — He loves us and keeps His promises.',
      prayer: 'God, help me give You my best. Thank You for Your love. Amen.'
    },

    johnBaptist: {
      kjvRef: 'Luke 3; Matthew 3',
      paragraphs: [
        'John the Baptist lived in the wilderness. He wore camel\'s hair and ate locusts and honey.',
        'John preached, "Repent, for the kingdom of heaven is near!" People came to be baptized.',
        'John said, "I baptize with water, but One is coming who is greater. He will baptize with the Holy Spirit and fire."',
        'Jesus came to be baptized. The heavens opened, the Spirit descended like a dove, and God said, "This is My beloved Son."',
        'John prepared the way for Jesus, the Savior.'
      ],
      imagePrompts: [
        'bright cartoon for kids: John the Baptist in wilderness, camel hair clothes, locusts and honey, no text',
        'fun kid illustration: John preaching "Repent!", people coming to river, no text',
        'colorful Bible scene for children: John baptizing people in Jordan River, no text',
        'exciting cartoon: Jesus being baptized, heavens open, dove descending, voice from heaven, no text',
        'happy ending illustration: John pointing to Jesus, "Behold the Lamb of God!", no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'John prepared the way for Jesus!',
      quizHeading: 'John the Baptist Questions',
      questions: [
        {
          question: 'Where did John the Baptist live?',
          choices: ['In a palace', 'In the wilderness', 'In the city', 'By the sea'],
          correctIndex: 1,
          correctFeedback: 'Yes! In the wilderness, eating locusts and honey.',
          wrongFeedback: 'Not palace or city. John lived in the wilderness (Matthew 3:4).'
        },
        {
          question: 'What did John preach?',
          choices: ['Be rich', 'Repent, the kingdom is near', 'Fight the Romans', 'Build temples'],
          correctIndex: 1,
          correctFeedback: 'Right! "Repent, for the kingdom of heaven is at hand."',
          wrongFeedback: 'Not riches or fighting. John preached repentance and baptized for forgiveness (Matthew 3:2).'
        },
        {
          question: 'Who did John say was coming after him?',
          choices: ['A king', 'One greater — Jesus', 'Elijah again', 'Moses'],
          correctIndex: 1,
          correctFeedback: 'Yes! One greater who would baptize with the Holy Spirit.',
          wrongFeedback: 'Not Elijah or Moses. John said "One mightier than I is coming" (Luke 3:16).'
        },
        {
          question: 'What happened when Jesus was baptized?',
          choices: ['Nothing', 'Heavens opened, Spirit like a dove, voice from heaven', 'Rain fell', 'John ran away'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Heavens opened, Spirit descended, God said "This is My beloved Son."',
          wrongFeedback: 'Not nothing or rain. The heavens opened, the Spirit came down like a dove, and God spoke (Matthew 3:16–17).'
        },
        {
          question: 'What can we learn from John the Baptist?',
          choices: ['Prepare the way for Jesus', 'Never preach', 'Ignore God', 'Stay in wilderness'],
          correctIndex: 0,
          correctFeedback: 'Perfect! John prepared the way for Jesus — we can too.',
          wrongFeedback: 'John\'s job was to prepare hearts for Jesus. We can point others to Him!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — prepare the way for Jesus!',
      takeaway: 'Prepare the way for Jesus — repent and point others to Him.',
      prayer: 'Jesus, thank You for coming. Help me prepare my heart for You. Amen.'
    },

    jesusBirth: {
      kjvRef: 'Luke 2; Matthew 1–2',
      paragraphs: [
        'Mary was going to have a baby — Jesus. An angel told Joseph to take Mary as his wife.',
        'They traveled to Bethlehem. There was no room in the inn, so Jesus was born in a stable.',
        'Mary laid Jesus in a manger. Shepherds heard angels say, "Unto you is born a Savior!"',
        'Wise men saw a star and followed it. They brought gifts: gold, frankincense, and myrrh.',
        'Jesus is God\'s Son — the Savior of the world.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Mary and Joseph traveling to Bethlehem, no room at inn, no text',
        'fun kid illustration: baby Jesus born in stable, laid in manger, Mary and Joseph, no text',
        'colorful Bible scene for children: angels telling shepherds "Unto you is born a Savior", no text',
        'exciting cartoon: wise men following star, bringing gifts, no text',
        'happy ending illustration: Jesus in manger, shepherds and wise men worshiping, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus was born in a humble stable — God with us!',
      quizHeading: 'Birth of Jesus Questions',
      questions: [
        {
          question: 'Where was Jesus born?',
          choices: ['In a palace', 'In a stable', 'In a temple', 'By the sea'],
          correctIndex: 1,
          correctFeedback: 'Yes! In a stable because no room in the inn.',
          wrongFeedback: 'Not palace or temple. Jesus was born in Bethlehem in a stable (Luke 2:7).'
        },
        {
          question: 'What did Mary lay Jesus in?',
          choices: ['A bed', 'A manger', 'A basket', 'A chair'],
          correctIndex: 1,
          correctFeedback: 'Right! A manger — a feeding trough for animals.',
          wrongFeedback: 'Not bed or basket. Mary laid Him in a manger (Luke 2:7).'
        },
        {
          question: 'Who heard angels announce Jesus\' birth?',
          choices: ['Kings', 'Shepherds', 'Priests', 'Soldiers'],
          correctIndex: 1,
          correctFeedback: 'Yes! Shepherds heard "Unto you is born a Savior."',
          wrongFeedback: 'Not kings or priests. Angels appeared to shepherds in the fields (Luke 2:8–11).'
        },
        {
          question: 'What did the wise men bring to Jesus?',
          choices: ['Toys', 'Gold, frankincense, and myrrh', 'Food', 'Clothes'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Gold, frankincense, and myrrh — gifts for a king.',
          wrongFeedback: 'Not toys or food. Wise men brought gold, frankincense, and myrrh (Matthew 2:11).'
        },
        {
          question: 'What can we learn from Jesus\' birth?',
          choices: ['God came humbly', 'God only likes palaces', 'Babies are weak', 'Never travel'],
          correctIndex: 0,
          correctFeedback: 'Perfect! God came humbly as a baby to save us.',
          wrongFeedback: 'Jesus was born in a stable — God came humbly to be with us and save us!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is born!',
      takeaway: 'Jesus came humbly to save us — God is with us!',
      prayer: 'Jesus, thank You for coming to save me. Help me follow You. Amen.'
    },

    jesusBaptism: {
      kjvRef: 'Matthew 3:13–17; Mark 1:9–11; Luke 3:21–22',
      paragraphs: [
        'Jesus came from Galilee to the Jordan River to be baptized by John.',
        'John said, "I need to be baptized by You, and You come to me?" Jesus replied, "Let it be so now — it is proper to fulfill all righteousness."',
        'John baptized Jesus. As Jesus came up from the water, the heavens opened.',
        'The Spirit of God descended like a dove and rested on Him. A voice from heaven said, "This is My beloved Son, with whom I am well pleased."',
        'God the Father affirmed Jesus as His Son before Jesus began His ministry.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus coming to John at the Jordan River, ready to be baptized, no text',
        'fun kid illustration: John baptizing Jesus in the river, water flowing, no text',
        'colorful Bible scene for children: heavens opening, Spirit like a dove descending on Jesus, no text',
        'exciting cartoon: voice from heaven saying "This is My beloved Son", bright light, no text',
        'happy ending illustration: Jesus affirmed by God, peaceful moment, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God the Father spoke from heaven at Jesus\' baptism!',
      quizHeading: 'Jesus\' Baptism Questions',
      questions: [
        {
          question: 'Who baptized Jesus?',
          choices: ['Peter', 'John the Baptist', 'Moses', 'Elijah'],
          correctIndex: 1,
          correctFeedback: 'Yes! John the Baptist baptized Jesus in the Jordan.',
          wrongFeedback: 'Not Peter or Moses. John baptized Jesus (Matthew 3:13–16).'
        },
        {
          question: 'What did John say when Jesus came to be baptized?',
          choices: ['I need to be baptized by You', 'You are not worthy', 'Come back later', 'I am greater'],
          correctIndex: 0,
          correctFeedback: 'Right! John felt unworthy and said "I need to be baptized by You."',
          wrongFeedback: 'John said "I need to be baptized by You, and comest thou to me?" (Matthew 3:14).'
        },
        {
          question: 'What happened when Jesus came up from the water?',
          choices: ['Nothing', 'Heavens opened, Spirit like a dove descended', 'It rained', 'The river dried up'],
          correctIndex: 1,
          correctFeedback: 'Yes! Heavens opened, dove descended, voice spoke.',
          wrongFeedback: 'Not rain or dry. The heavens opened, the Spirit descended like a dove, and a voice spoke (Matthew 3:16–17).'
        },
        {
          question: 'What did the voice from heaven say?',
          choices: ['You are not My Son', 'This is My beloved Son, with whom I am well pleased', 'Go away', 'Be silent'],
          correctIndex: 1,
          correctFeedback: 'Exactly! "This is My beloved Son, with whom I am well pleased."',
          wrongFeedback: 'Not go away. God the Father said "This is My beloved Son, in whom I am well pleased" (Matthew 3:17).'
        },
        {
          question: 'What can we learn from Jesus\' baptism?',
          choices: ['Jesus was sinful', 'God affirms His Son', 'Baptism is not important', 'John was greater'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God affirmed Jesus as His beloved Son.',
          wrongFeedback: 'Jesus was sinless and fulfilled righteousness. God the Father publicly affirmed Him!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God affirms Jesus!',
      takeaway: 'God affirms Jesus as His beloved Son — listen to Him.',
      prayer: 'God, thank You for Jesus. Help me listen to Your Son. Amen.'
    },

    jesusTemptation: {
      kjvRef: 'Matthew 4:1–11; Luke 4:1–13',
      paragraphs: [
        'After His baptism, the Spirit led Jesus into the wilderness to be tempted by the devil.',
        'Jesus fasted 40 days and nights. He was hungry. The devil said, "Turn stones to bread." Jesus replied, "Man shall not live by bread alone, but by every word from God."',
        'The devil took Jesus to the temple top: "Jump down — angels will save You." Jesus said, "Do not put the Lord your God to the test."',
        'On a high mountain, the devil showed all kingdoms and said, "Worship me — I will give them to You." Jesus said, "Worship the Lord your God only."',
        'The devil left. Angels came and ministered to Jesus. Jesus overcame temptation with God\'s Word.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus in wilderness, fasting 40 days, hungry, no text',
        'fun kid illustration: sly tempter tempting Jesus to turn stones to bread, Jesus quoting Scripture, no text',
        'colorful Bible scene for children: tempter taking Jesus to temple top, saying "Jump", no text',
        'exciting cartoon: tempter showing kingdoms from high mountain, Jesus saying "Worship God only", no text',
        'happy ending illustration: tempter leaving, angels ministering to Jesus, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus used God\'s Word to fight temptation!',
      quizHeading: 'Jesus Tempted in the Wilderness Questions',
      questions: [
        {
          question: 'Where did the Spirit lead Jesus after baptism?',
          choices: ['To the city', 'Into the wilderness to be tempted', 'To the temple', 'To the sea'],
          correctIndex: 1,
          correctFeedback: 'Yes! Into the wilderness for 40 days of temptation.',
          wrongFeedback: 'Not city or temple. The Spirit led Jesus into the wilderness to be tempted (Matthew 4:1).'
        },
        {
          question: 'How long did Jesus fast?',
          choices: ['7 days', '40 days and nights', '3 days', '1 year'],
          correctIndex: 1,
          correctFeedback: 'Right! 40 days and nights — He was hungry.',
          wrongFeedback: 'Not 7 or 3. Jesus fasted 40 days and nights (Matthew 4:2).'
        },
        {
          question: 'What was the devil\'s first temptation?',
          choices: ['Jump from temple', 'Turn stones to bread', 'Worship me', 'Give up fasting'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Turn these stones into bread" — Jesus said no.',
          wrongFeedback: 'First was bread. Jesus replied "Man shall not live by bread alone" (Matthew 4:3–4).'
        },
        {
          question: 'What did Jesus say to every temptation?',
          choices: ['Okay', 'God\'s Word', 'I give up', 'You win'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Jesus answered each time with Scripture.',
          wrongFeedback: 'Jesus quoted God\'s Word every time — He overcame by Scripture!'
        },
        {
          question: 'What can we learn from Jesus\' temptation?',
          choices: ['Give in to temptation', 'Use God\'s Word to fight temptation', 'Temptation is good', 'Never fast'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Use God\'s Word to fight temptation — Jesus did.',
          wrongFeedback: 'Jesus showed us how to resist: stand on God\'s Word!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus overcame temptation!',
      takeaway: 'Use God\'s Word to fight temptation — Jesus showed us how.',
      prayer: 'Jesus, thank You for overcoming temptation. Help me use Your Word too. Amen.'
    },

    jesusFirstMiracle: {
      kjvRef: 'John 2:1–11',
      paragraphs: [
        'Jesus, His mother Mary, and disciples were at a wedding in Cana. The wine ran out.',
        'Mary told Jesus. He said, "My hour has not yet come," but Mary told servants, "Do whatever He tells you."',
        'Jesus told servants to fill six stone water jars with water — to the brim.',
        'Jesus said, "Draw some out and take it to the master of the feast." They did. The water had become wine!',
        'The master tasted it and said it was the best wine. This was Jesus\' first miracle — His disciples believed in Him.'
      ],
      imagePrompts: [
        'bright cartoon for kids: wedding in Cana, people celebrating, wine running out, no text',
        'fun kid illustration: Mary telling Jesus "They have no wine", servants listening, no text',
        'colorful Bible scene for children: Jesus telling servants to fill six stone jars with water, no text',
        'exciting cartoon: servants drawing water-turned-wine, master of feast tasting, surprised face, no text',
        'happy ending illustration: wedding celebration continues, disciples believing in Jesus, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus\' first miracle — water became wine!',
      quizHeading: 'Jesus\' First Miracle Questions',
      questions: [
        {
          question: 'Where was Jesus when He did His first miracle?',
          choices: ['In a desert', 'At a wedding in Cana', 'On a mountain', 'In Jerusalem'],
          correctIndex: 1,
          correctFeedback: 'Yes! At a wedding in Cana.',
          wrongFeedback: 'Not desert or mountain. It was a wedding feast in Cana of Galilee (John 2:1).'
        },
        {
          question: 'What problem happened at the wedding?',
          choices: ['No food', 'No wine', 'No music', 'No guests'],
          correctIndex: 1,
          correctFeedback: 'Right! The wine ran out.',
          wrongFeedback: 'Not food or music. They ran out of wine (John 2:3).'
        },
        {
          question: 'What did Mary tell the servants?',
          choices: ['Do nothing', 'Do whatever He tells you', 'Run away', 'Ask the master'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Do whatever He tells you."',
          wrongFeedback: 'Mary said "Whatsoever He saith unto you, do it" (John 2:5).'
        },
        {
          question: 'What did Jesus tell the servants to do?',
          choices: ['Fill jars with wine', 'Fill six stone jars with water', 'Wait for more wine', 'Pour out water'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Fill six stone water jars with water — to the brim.',
          wrongFeedback: 'Not wine. They filled with water, then Jesus turned it into wine (John 2:7).'
        },
        {
          question: 'What can we learn from Jesus\' first miracle?',
          choices: ['Wine is important', 'Jesus has power and cares about celebrations', 'Never go to weddings', 'Jesus ignores problems'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus has power and cares about our needs and joy.',
          wrongFeedback: 'Jesus turned water to wine — showing His power and care for people!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus\' first miracle!',
      takeaway: 'Jesus has power and cares about our needs and joy.',
      prayer: 'Jesus, thank You for Your power. Help me trust You in everything. Amen.'
    },

    jesusCallingDisciples: {
      kjvRef: 'Matthew 4:18–22; Luke 5:1–11',
      paragraphs: [
        'Jesus was walking by the Sea of Galilee. He saw two brothers fishing: Simon Peter and Andrew.',
        'Jesus said, "Follow me, and I will make you fishers of men." They left their nets and followed Him.',
        'He saw James and John in a boat with their father Zebedee. Jesus called them. They left the boat and followed.',
        'Later, Jesus taught from Peter\'s boat. He told Peter to cast nets — they caught so many fish the nets broke!',
        'Peter said, "Depart from me, for I am a sinful man." Jesus said, "Do not be afraid — from now on you will catch men."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus walking by Sea of Galilee, seeing Peter and Andrew fishing, no text',
        'fun kid illustration: Jesus saying "Follow me, I will make you fishers of men", Peter and Andrew leaving nets, no text',
        'colorful Bible scene for children: Jesus calling James and John in boat, they leaving to follow, no text',
        'exciting cartoon: miraculous catch of fish, nets full and breaking, Peter amazed, no text',
        'happy ending illustration: disciples following Jesus, becoming fishers of men, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus called ordinary fishermen to follow Him!',
      quizHeading: 'Jesus Calls Disciples Questions',
      questions: [
        {
          question: 'What were Peter and Andrew doing when Jesus called them?',
          choices: ['Farming', 'Fishing', 'Building', 'Teaching'],
          correctIndex: 1,
          correctFeedback: 'Yes! They were casting nets by the sea.',
          wrongFeedback: 'Not farming. Peter and Andrew were fishermen when Jesus called them (Matthew 4:18).'
        },
        {
          question: 'What did Jesus say to Peter and Andrew?',
          choices: ['Go away', 'Follow me, I will make you fishers of men', 'Give me fish', 'Stay here'],
          correctIndex: 1,
          correctFeedback: 'Right! "Follow me, and I will make you fishers of men."',
          wrongFeedback: 'Not give fish. Jesus said, "Follow me, and I will make you fishers of men" (Matthew 4:19).'
        },
        {
          question: 'What did James and John do when Jesus called them?',
          choices: ['Stayed with father', 'Left boat and followed', 'Laughed', 'Ran away'],
          correctIndex: 1,
          correctFeedback: 'Yes! They left their boat and father to follow.',
          wrongFeedback: 'They didn\'t stay. James and John left the ship and followed Jesus (Matthew 4:22).'
        },
        {
          question: 'What happened when Jesus told Peter to cast nets?',
          choices: ['Nothing', 'Caught so many fish the nets broke', 'Caught one fish', 'Boat sank'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Miraculous catch — nets breaking!',
          wrongFeedback: 'Not nothing. They caught so many fish the nets began to break (Luke 5:6–7).'
        },
        {
          question: 'What can we learn from Jesus calling disciples?',
          choices: ['Jesus only calls important people', 'Jesus calls ordinary people to follow Him', 'Never leave your job', 'Fish are more important'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus calls ordinary people to follow and fish for people.',
          wrongFeedback: 'Jesus called fishermen — ordinary men — to be His disciples!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus calls us too!',
      takeaway: 'Jesus calls ordinary people to follow Him and fish for people.',
      prayer: 'Jesus, thank You for calling me. Help me follow You. Amen.'
    },

    jesusSermonMount: {
      kjvRef: 'Matthew 5–7',
      paragraphs: [
        'Jesus went up on a mountain and taught the crowds. He began with the Beatitudes: "Blessed are the poor in spirit…"',
        'He said, "Blessed are those who mourn, the meek, those who hunger for righteousness, the merciful, the pure in heart, the peacemakers, those persecuted for righteousness."',
        'Jesus taught, "You are the light of the world — let your light shine."',
        'He gave the Golden Rule: "Do to others as you would have them do to you."',
        'Jesus ended with "Everyone who hears these words and puts them into practice is like a wise man who built his house on the rock."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus teaching crowds on a mountain, people listening, no text',
        'fun kid illustration: Beatitudes — poor in spirit, meek, merciful, peacemakers, no text',
        'colorful Bible scene for children: Jesus saying "You are the light of the world", people shining, no text',
        'exciting cartoon: Golden Rule — doing to others what you want done, kind actions, no text',
        'happy ending illustration: wise man building house on rock, storm coming but house stands, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus taught how to live God\'s way!',
      quizHeading: 'Sermon on the Mount Questions',
      questions: [
        {
          question: 'Where did Jesus give the Beatitudes?',
          choices: ['In a boat', 'On a mountain', 'In the temple', 'By the sea'],
          correctIndex: 1,
          correctFeedback: 'Yes! On a mountain — the Sermon on the Mount.',
          wrongFeedback: 'Not boat or temple. Jesus went up on the mountain and taught (Matthew 5:1).'
        },
        {
          question: 'Who did Jesus say are blessed?',
          choices: ['The rich', 'The poor in spirit, meek, merciful', 'The strong', 'The angry'],
          correctIndex: 1,
          correctFeedback: 'Right! Blessed are the poor in spirit, meek, merciful, etc.',
          wrongFeedback: 'Not rich or strong. "Blessed are the poor in spirit… the meek… the merciful…" (Matthew 5:3–7).'
        },
        {
          question: 'What did Jesus say about being the light of the world?',
          choices: ['Hide it', 'Let your light shine', 'Turn it off', 'Give it away'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Let your light shine before others."',
          wrongFeedback: 'Not hide. Jesus said "Let your light so shine before men, that they may see your good works" (Matthew 5:16).'
        },
        {
          question: 'What is the Golden Rule?',
          choices: ['Do to others as you would have them do to you', 'Take what you want', 'Ignore others', 'Hurt those who hurt you'],
          correctIndex: 0,
          correctFeedback: 'Perfect! Treat others the way you want to be treated.',
          wrongFeedback: 'Jesus said, "Whatsoever ye would that men should do to you, do ye even so to them" (Matthew 7:12).'
        },
        {
          question: 'What can we learn from the Sermon on the Mount?',
          choices: ['Live God\'s way — build on the rock', 'Build on sand', 'Never listen to Jesus', 'Ignore teachings'],
          correctIndex: 0,
          correctFeedback: 'Yes! Hear and do Jesus\' words — build your life on the rock.',
          wrongFeedback: 'Jesus said those who hear and practice His words are like a wise man building on rock!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — live God\'s way!',
      takeaway: 'Hear and do Jesus\' words — build your life on the rock.',
      prayer: 'Jesus, help me hear and do Your words. Build my life on You. Amen.'
    },

    jesusHealsBlind: {
      kjvRef: 'John 9',
      paragraphs: [
        'Jesus saw a man blind from birth. The disciples asked, "Who sinned?" Jesus said, "Neither hath this man sinned, nor his parents: but that the works of God should be made manifest in him."',
        'Jesus spat on the ground, made clay, anointed the man\'s eyes, and told him, "Go, wash in the pool of Siloam."',
        'The man went, washed, and came back seeing! His neighbors were amazed.',
        'The Pharisees questioned him. The man said, "One thing I know, that, whereas I was blind, now I see."',
        'Jesus found him and said, "Dost thou believe on the Son of God?" The man said, "Lord, I believe," and worshiped Him.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus making clay with spittle, putting on blind man\'s eyes, no text',
        'fun kid illustration: blind man washing in Pool of Siloam, eyes opening, seeing for first time, no text',
        'colorful Bible scene for children: neighbors amazed, man saying "I was blind, now I see", no text',
        'exciting cartoon: man telling leaders "One thing I know: I was blind, now I see", no text',
        'happy ending illustration: Jesus finding the man, man worshiping Him, joyful, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus healed a man born blind — so God\'s works could be seen!',
      quizHeading: 'Jesus Heals the Blind Man Questions',
      questions: [
        {
          question: 'Why was the man blind from birth (according to Jesus)?',
          choices: ['Because he sinned', 'So the works of God might be displayed', 'Because his parents sinned', 'No reason'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jesus said it was so God\'s works could be seen in him.',
          wrongFeedback: 'Not because he or his parents sinned. Jesus said it was "that the works of God should be made manifest in him" (John 9:3).'
        },
        {
          question: 'What did Jesus do to the blind man\'s eyes?',
          choices: ['Prayed only', 'Made clay with spittle and put it on them', 'Touched them', 'Washed them'],
          correctIndex: 1,
          correctFeedback: 'Right! Jesus made clay with spittle and anointed his eyes.',
          wrongFeedback: 'Not pray or touch only. He spat, made clay, and anointed the eyes (John 9:6).'
        },
        {
          question: 'Where did Jesus tell the man to go?',
          choices: ['To the temple', 'To the pool of Siloam', 'To his home', 'To the king'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Go, wash in the pool of Siloam."',
          wrongFeedback: 'Not temple or home. Jesus sent him to wash in the pool of Siloam (John 9:7).'
        },
        {
          question: 'What did the man say to those who questioned him?',
          choices: ['I don\'t know', 'One thing I know: I was blind, now I see', 'Jesus is bad', 'Give me money'],
          correctIndex: 1,
          correctFeedback: 'Exactly! "One thing I know: I was blind, now I see."',
          wrongFeedback: 'He spoke boldly: "One thing I know, that, whereas I was blind, now I see" (John 9:25).'
        },
        {
          question: 'What can we learn from the blind man?',
          choices: ['Doubt Jesus', 'Believe and worship Jesus', 'Never wash', 'Stay blind'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The man believed and worshiped Jesus.',
          wrongFeedback: 'He went from blind to seeing and from not knowing to worshiping Jesus — faith grows!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus opens eyes!',
      takeaway: 'Jesus has power to heal and open eyes — believe and worship Him.',
      prayer: 'Jesus, thank You for opening eyes. Help me see You clearly. Amen.'
    },

    jesusHealsParalytic: {
      kjvRef: 'Mark 2:1–12',
      paragraphs: [
        'Jesus was teaching in a house. So many people came that there was no room, not even at the door.',
        'Four friends brought a paralyzed man on a bed. They could not get through the crowd.',
        'They uncovered the roof, let the bed down where Jesus was, and lowered the man to Him.',
        'Jesus saw their faith. He said, "Son, thy sins be forgiven thee." The scribes thought, "Who can forgive sins but God only?"',
        'Jesus said, "Whether is it easier to say… Thy sins be forgiven thee; or… Arise, take up thy bed, and walk?" Then He told the man to rise — and he walked home, healed!'
      ],
      imagePrompts: [
        'bright cartoon for kids: crowded house with Jesus teaching, people everywhere, no text',
        'fun kid illustration: four friends carrying paralyzed man on mat, climbing roof, no text',
        'colorful Bible scene for children: friends lowering man through roof opening to Jesus, no text',
        'exciting cartoon: Jesus saying "Arise, take up thy bed, and walk", man standing up, no text',
        'happy ending illustration: man walking home carrying bed, friends rejoicing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Friends\' faith helped their paralyzed friend!',
      quizHeading: 'Jesus Heals the Paralytic Questions',
      questions: [
        {
          question: 'Why couldn\'t the friends get the paralyzed man to Jesus?',
          choices: ['The door was locked', 'The house was too crowded', 'They were late', 'The man refused'],
          correctIndex: 1,
          correctFeedback: 'Yes! The house was packed — no way in.',
          wrongFeedback: 'Not locked or late. So many gathered they could not come near unto Him (Mark 2:2).'
        },
        {
          question: 'What did the four friends do?',
          choices: ['Gave up', 'Opened the roof and lowered him down', 'Waited outside', 'Asked Jesus to come out'],
          correctIndex: 1,
          correctFeedback: 'Right! They uncovered the roof and let him down on his bed.',
          wrongFeedback: 'They did not wait. They uncovered the roof and let him down before Jesus (Mark 2:4).'
        },
        {
          question: 'What did Jesus say first to the man?',
          choices: ['Arise, and walk', 'Son, thy sins be forgiven thee', 'Go home', 'Be quiet'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Son, thy sins be forgiven thee."',
          wrongFeedback: 'Not walk first. Jesus said "Son, thy sins be forgiven thee" (Mark 2:5).'
        },
        {
          question: 'What did Jesus prove by healing the man?',
          choices: ['He had power to forgive sins', 'He could run fast', 'He could teach', 'He could eat'],
          correctIndex: 0,
          correctFeedback: 'Exactly! He showed He had authority on earth to forgive sins.',
          wrongFeedback: 'Jesus proved He could forgive sins by telling the sick of the palsy to rise and walk (Mark 2:10–11).'
        },
        {
          question: 'What can we learn from the friends and the healing?',
          choices: ['Faith helps others', 'Never carry friends', 'Jesus can\'t forgive sins', 'Roofs are strong'],
          correctIndex: 0,
          correctFeedback: 'Perfect! Friends\' faith brought the man to Jesus — He forgave and healed.',
          wrongFeedback: 'The four friends\' faith led to the miracle — Jesus forgives and heals!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — friends\' faith helps!',
      takeaway: 'Friends\' faith can bring others to Jesus — He forgives and heals.',
      prayer: 'Jesus, thank You for forgiving and healing. Help me bring my friends to You. Amen.'
    },

    jesusCalmsStorm: {
      kjvRef: 'Mark 4:35–41',
      paragraphs: [
        'Jesus and His disciples were in a ship on the sea. Jesus was asleep on a pillow.',
        'A great storm arose. Waves beat into the ship — it was full. The disciples were afraid.',
        'They woke Him: "Master, carest thou not that we perish?"',
        'Jesus arose, rebuked the wind, and said unto the sea, "Peace, be still." The wind ceased — there was a great calm.',
        'He said unto them, "Why are ye so fearful? how is it that ye have no faith?" They feared greatly and said one to another, "What manner of man is this, that even the wind and the sea obey him?"'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus sleeping in boat while disciples row, calm at first, no text',
        'fun kid illustration: big storm, huge waves crashing into boat, disciples scared, Jesus asleep, no text',
        'colorful Bible scene for children: Jesus standing up, speaking to storm, wind and waves calming, no text',
        'exciting cartoon: storm suddenly stops, sea peaceful, disciples amazed, no text',
        'happy ending illustration: boat on calm water, Jesus with disciples, peace and faith, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus has power over storms — and our fears!',
      quizHeading: 'Jesus Calms the Storm Questions',
      questions: [
        {
          question: 'What was Jesus doing during the storm?',
          choices: ['Rowing', 'Sleeping', 'Calming the storm', 'Teaching'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jesus was asleep on a pillow in the ship.',
          wrongFeedback: 'Not rowing or teaching. He was in the hinder part of the ship, asleep on a pillow (Mark 4:38).'
        },
        {
          question: 'What did the disciples say to Jesus?',
          choices: ['We\'re fine', 'Master, carest thou not that we perish?', 'Let\'s swim', 'Help us row'],
          correctIndex: 1,
          correctFeedback: 'Right! They were afraid and woke Him.',
          wrongFeedback: 'They cried, "Master, carest thou not that we perish?" (Mark 4:38).'
        },
        {
          question: 'What did Jesus say to the wind and sea?',
          choices: ['Go away', 'Peace, be still', 'Be loud', 'Keep going'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Peace, be still" — and the wind ceased.',
          wrongFeedback: 'Jesus said "Peace, be still" — and the wind ceased, and there was a great calm (Mark 4:39).'
        },
        {
          question: 'How did the disciples feel after?',
          choices: ['Happy and calm', 'Amazed and afraid', 'Angry', 'Sleepy'],
          correctIndex: 1,
          correctFeedback: 'Yes! They feared greatly and wondered who He was.',
          wrongFeedback: 'They feared exceedingly and said, "What manner of man is this, that even the wind and the sea obey him?" (Mark 4:41).'
        },
        {
          question: 'What can we learn from Jesus calming the storm?',
          choices: ['Storms are fun', 'Jesus has power over everything — trust Him', 'Disciples are always brave', 'Boats sink easily'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus has power over storms — and our fears.',
          wrongFeedback: 'Jesus showed He is Lord over nature. We can trust Him when afraid!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus calms storms!',
      takeaway: 'Jesus has power over everything — trust Him in storms.',
      prayer: 'Jesus, when I\'m afraid, help me trust Your power. Amen.'
    },

    jesusFeeds5000: {
      kjvRef: 'John 6:1–14',
      paragraphs: [
        'A great multitude followed Jesus. It was late and they were hungry.',
        'Jesus asked Philip, "Whence shall we buy bread, that these may eat?" Philip said two hundred pennyworth would not be enough.',
        'Andrew found a lad with five barley loaves and two small fishes. Jesus took them, gave thanks, and distributed.',
        'The disciples gave to everyone — as much as they would. About five thousand men sat down, besides women and children.',
        'They filled twelve baskets with fragments. The people said, "This is of a truth that prophet that should come into the world."'
      ],
      imagePrompts: [
        'bright cartoon for kids: huge crowd following Jesus on hillside, hungry faces, no text',
        'fun kid illustration: boy giving five loaves and two fish to Jesus, disciples watching, no text',
        'colorful Bible scene for children: Jesus giving thanks, breaking bread, miracle starting, no text',
        'exciting cartoon: disciples passing food, everyone eating plenty, baskets filling, no text',
        'happy ending illustration: twelve baskets of leftovers, people amazed, praising Jesus, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus fed thousands with just five loaves and two fish!',
      quizHeading: 'Jesus Feeds 5,000 Questions',
      questions: [
        {
          question: 'About how many men were fed?',
          choices: ['100', 'About five thousand (plus women and children)', '50', '500'],
          correctIndex: 1,
          correctFeedback: 'Yes! About five thousand men, besides women and children.',
          wrongFeedback: 'John says the men numbered about five thousand (John 6:10).'
        },
        {
          question: 'What did Philip say about buying bread?',
          choices: ['We have plenty', 'Two hundred pennyworth would not be enough', 'Let\'s share', 'Go home'],
          correctIndex: 1,
          correctFeedback: 'Right! Philip said two hundred pennyworth would not suffice.',
          wrongFeedback: 'Philip said "Two hundred pennyworth of bread is not sufficient for them" (John 6:7).'
        },
        {
          question: 'What did the lad have?',
          choices: ['Ten loaves', 'Five barley loaves and two small fishes', 'A big cake', 'Nothing'],
          correctIndex: 1,
          correctFeedback: 'Yes! Five barley loaves and two small fishes.',
          wrongFeedback: 'A lad had five barley loaves, and two small fishes (John 6:9).'
        },
        {
          question: 'What did Jesus do with the food?',
          choices: ['Threw it away', 'Gave thanks and distributed — everyone ate', 'Ate it alone', 'Gave it to animals'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Jesus gave thanks and there was enough for all.',
          wrongFeedback: 'Jesus gave thanks, distributed to the disciples, and they fed the multitude (John 6:11).'
        },
        {
          question: 'What can we learn from Jesus feeding 5,000?',
          choices: ['Jesus can\'t help with little', 'Jesus can multiply little into much', 'Never share food', 'Hunger is good'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus can take little and make it enough.',
          wrongFeedback: 'Jesus took five loaves and two fishes and fed thousands — God provides!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus provides!',
      takeaway: 'Jesus can multiply little into much — trust Him to provide.',
      prayer: 'Jesus, thank You for providing. Help me trust You with little. Amen.'
    },

    jesusWalksWater: {
      kjvRef: 'Matthew 14:22–33',
      paragraphs: [
        'Jesus sent the disciples ahead in a ship while He went up into a mountain alone to pray.',
        'The ship was in the midst of the sea, tossed with waves — the wind was contrary. The disciples were troubled.',
        'In the fourth watch Jesus went unto them, walking on the sea. They thought it was a spirit and cried out for fear.',
        'Jesus said, "Be of good cheer; it is I; be not afraid." Peter said, "Lord, if it be thou, bid me come unto thee on the water." Jesus said, "Come."',
        'Peter walked on the water to Jesus, but when he saw the wind, he sank. Jesus caught him: "O thou of little faith, wherefore didst thou doubt?" They worshiped Him in the ship.'
      ],
      imagePrompts: [
        'bright cartoon for kids: disciples in boat on stormy sea, Jesus praying alone on mountain, no text',
        'fun kid illustration: stormy waves tossing boat, disciples afraid, no text',
        'colorful Bible scene for children: Jesus walking on water toward boat, disciples thinking spirit, no text',
        'exciting cartoon: Peter walking on water to Jesus, then sinking, Jesus catching him, no text',
        'happy ending illustration: Jesus and Peter in boat, disciples worshiping, storm calm, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus walks on water — Peter tries too!',
      quizHeading: 'Jesus Walks on Water Questions',
      questions: [
        {
          question: 'Why were the disciples troubled in the ship?',
          choices: ['It was dark', 'The wind was contrary and the sea tossed', 'They were hungry', 'Jesus was gone'],
          correctIndex: 1,
          correctFeedback: 'Yes! The ship was tossed with waves in the wind.',
          wrongFeedback: 'The ship was in the midst of the sea, tossed with waves, for the wind was contrary (Matthew 14:24).'
        },
        {
          question: 'What did the disciples think when they saw Jesus on the water?',
          choices: ['A friend', 'A spirit', 'A fish', 'A boat'],
          correctIndex: 1,
          correctFeedback: 'Right! They cried out, thinking it was a spirit.',
          wrongFeedback: 'They were troubled, saying, "It is a spirit" (Matthew 14:26).'
        },
        {
          question: 'What did Jesus say to calm them?',
          choices: ['Go away', 'Be of good cheer; it is I; be not afraid', 'Swim to me', 'Stay still'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Be of good cheer; it is I; be not afraid."',
          wrongFeedback: 'Jesus said, "Be of good cheer; it is I; be not afraid" (Matthew 14:27).'
        },
        {
          question: 'What did Peter do?',
          choices: ['Stayed in boat', 'Walked on the water toward Jesus', 'Jumped in fear', 'Slept'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Peter walked on the water to go to Jesus.',
          wrongFeedback: 'Peter asked Jesus to bid him come — and he walked on the water (Matthew 14:28–29).'
        },
        {
          question: 'What can we learn from Peter walking on water?',
          choices: ['Never step out of boat', 'Keep eyes on Jesus — faith walks on water', 'Doubt is good', 'Storms are fun'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Keep eyes on Jesus — faith walks on water.',
          wrongFeedback: 'When Peter saw the wind boisterous, he sank. Keep your focus on Jesus!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — keep eyes on Jesus!',
      takeaway: 'Keep your eyes on Jesus — faith walks on water.',
      prayer: 'Jesus, help me keep my eyes on You in storms. Amen.'
    },

    jesusParableSower: {
      kjvRef: 'Matthew 13:1–23; Mark 4:1–20; Luke 8:4–15',
      paragraphs: [
        'Jesus told a parable about a sower sowing seed. Some fell by the wayside — fowls devoured them.',
        'Some fell on stony ground — they sprang up quickly but had no root and withered in the sun.',
        'Some fell among thorns — thorns choked them and they yielded no fruit.',
        'Some fell on good ground — they brought forth fruit: some thirty, some sixty, some a hundredfold.',
        'Jesus explained: the seed is the word of God. Hearts are like soil. Good ground hears the word, understands it, and bears fruit.'
      ],
      imagePrompts: [
        'bright cartoon for kids: farmer sowing seeds, some on path eaten by birds, no text',
        'fun kid illustration: seeds on rocky ground, plants springing up then withering, no text',
        'colorful Bible scene for children: seeds among thorns, plants choked, no crop, no text',
        'exciting cartoon: seeds in good soil, plants growing tall and fruitful, thirty sixty hundredfold, no text',
        'happy ending illustration: Jesus explaining parable to disciples, heart-soil picture, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The seed is God\'s word — the soil is our heart!',
      quizHeading: 'Parable of the Sower Questions',
      questions: [
        {
          question: 'What did the sower sow?',
          choices: ['Coins', 'Seed', 'Stones', 'Water'],
          correctIndex: 1,
          correctFeedback: 'Yes! Seed — and Jesus said it stands for the word of God.',
          wrongFeedback: 'Not coins or stones. A sower went forth to sow seed (Matthew 13:3–4).'
        },
        {
          question: 'What happened to the seed by the wayside?',
          choices: ['Grew tall', 'Fowls devoured them', 'They bore fruit', 'They withered'],
          correctIndex: 1,
          correctFeedback: 'Right! The fowls came and devoured them.',
          wrongFeedback: 'Not grew or fruit. The fowls came and devoured them (Matthew 13:4).'
        },
        {
          question: 'What happened to the seed on stony places?',
          choices: ['Grew deep roots', 'Sprang up quickly but withered', 'Were devoured', 'Bore much fruit'],
          correctIndex: 1,
          correctFeedback: 'Yes! They sprang up but had no root and withered.',
          wrongFeedback: 'Not deep roots. They had no root and withered away (Matthew 13:5–6).'
        },
        {
          question: 'What happened to the seed on good ground?',
          choices: ['Nothing', 'Brought forth fruit — thirty, sixty, or a hundredfold', 'Were choked', 'Were devoured'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Good ground brought forth fruit abundantly.',
          wrongFeedback: 'Not nothing or choked. Some brought forth thirty, some sixty, some a hundred (Matthew 13:8).'
        },
        {
          question: 'What can we learn from the Parable of the Sower?',
          choices: ['Ignore God\'s word', 'Be good ground — hear, understand, and bear fruit', 'Seed is bad', 'Never listen to parables'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Be good ground for God\'s word.',
          wrongFeedback: 'Jesus explained — good ground hears the word, understands it, and bears fruit!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — be good soil!',
      takeaway: 'Be good soil for God\'s word — hear, understand, and produce fruit.',
      prayer: 'God, make my heart good soil for Your word. Help me grow and bear fruit. Amen.'
    },

    jesusParableMustardSeed: {
      kjvRef: 'Matthew 13:31–32; Mark 4:30–32; Luke 13:18–19',
      paragraphs: [
        'Jesus told a parable: "The kingdom of heaven is like to a grain of mustard seed."',
        'The mustard seed is the least of all seeds — yet when grown, it is the greatest among herbs and becometh a tree.',
        'Birds lodge in its branches. The tiny seed becomes a shelter.',
        'Jesus showed the kingdom starts small but grows great and welcomes many.',
        'He also taught that faith as a grain of mustard seed can do great things in God\'s power.'
      ],
      imagePrompts: [
        'bright cartoon for kids: tiny mustard seed in hand, very small, no text',
        'fun kid illustration: seed planted in ground, tiny sprout starting, no text',
        'colorful Bible scene for children: mustard plant growing large, birds perching in branches, no text',
        'exciting cartoon: big branches, birds nesting, shelter for all, no text',
        'happy ending illustration: kingdom of heaven growing from small to great, people finding shelter, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The kingdom starts small but grows big!',
      quizHeading: 'Parable of the Mustard Seed Questions',
      questions: [
        {
          question: 'What is the kingdom of heaven like?',
          choices: ['A big mountain', 'A grain of mustard seed', 'A river', 'A house'],
          correctIndex: 1,
          correctFeedback: 'Yes! Like a tiny mustard seed that grows huge.',
          wrongFeedback: 'Not mountain or river. "The kingdom of heaven is like to a grain of mustard seed" (Matthew 13:31).'
        },
        {
          question: 'Why is the mustard seed special?',
          choices: ['It is the largest seed', 'It is the least of all seeds but grows to be greatest among herbs', 'It is colorful', 'It is sweet'],
          correctIndex: 1,
          correctFeedback: 'Right! Smallest seed — yet it grows to be the greatest among herbs.',
          wrongFeedback: 'Not largest. It is the least of all seeds, but when grown is greatest among herbs (Matthew 13:32).'
        },
        {
          question: 'What do the birds do in the branches?',
          choices: ['Eat every seed', 'Come and lodge in the branches', 'Fly away forever', 'Build nests only on the ground'],
          correctIndex: 1,
          correctFeedback: 'Yes! The birds come and lodge in the branches.',
          wrongFeedback: 'The fowls of the air come and lodge in the branches (Matthew 13:32).'
        },
        {
          question: 'What does the parable teach about the kingdom?',
          choices: ['It stays small', 'It starts small but grows great', 'It disappears', 'It is weak'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Starts small, grows great, gives shelter.',
          wrongFeedback: 'The kingdom starts tiny but grows and welcomes many!'
        },
        {
          question: 'What can we learn from the mustard seed?',
          choices: ['Small faith is useless', 'Even small faith, like a mustard seed, can grow and move mountains', 'Never plant seeds', 'Big is always better'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Faith as a grain of mustard seed can move mountains (Matthew 17:20).',
          wrongFeedback: 'Jesus said if ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove (Matthew 17:20).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — small faith grows!',
      takeaway: 'Small faith can grow big — like a mustard seed into a tree.',
      prayer: 'God, grow my small faith into something big for You. Amen.'
    },

    jesusParableGoodShepherd: {
      kjvRef: 'John 10:1–18',
      paragraphs: [
        'Jesus said, "I am the good shepherd: the good shepherd giveth his life for the sheep."',
        'A hireling flees when he seeth the wolf coming. The good shepherd knoweth His sheep, and His sheep know His voice.',
        'The sheep follow Him, for they know His voice. A stranger they will not follow.',
        'Jesus said, "And other sheep I have, which are not of this fold: them also I must bring."',
        'He laid down His life for the sheep and took it again. He is the good shepherd who loves His own.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus as good shepherd, carrying sheep, gentle face, no text',
        'fun kid illustration: sheep following Jesus, knowing His voice, safe and happy, no text',
        'colorful Bible scene for children: hireling running from danger, Jesus protecting sheep, no text',
        'exciting cartoon: Jesus calling other sheep, one flock, one shepherd, no text',
        'happy ending illustration: good shepherd loving and protecting sheep, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus is the good shepherd who loves His sheep!',
      quizHeading: 'Good Shepherd Questions',
      questions: [
        {
          question: 'Who is the good shepherd?',
          choices: ['A hireling', 'Jesus', 'A wolf', 'A king'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jesus is the good shepherd.',
          wrongFeedback: 'Not hireling or wolf. Jesus said, "I am the good shepherd" (John 10:11).'
        },
        {
          question: 'What does the good shepherd do for the sheep?',
          choices: ['Flees when danger comes', 'Giveth his life for the sheep', 'Hires help only', 'Ignores them'],
          correctIndex: 1,
          correctFeedback: 'Right! The good shepherd giveth his life for the sheep.',
          wrongFeedback: 'The hireling fleeth. The good shepherd giveth his life for the sheep (John 10:11–12).'
        },
        {
          question: 'How do the sheep know the shepherd?',
          choices: ['By sight only', 'They know His voice', 'By smell', 'By touch only'],
          correctIndex: 1,
          correctFeedback: 'Yes! The sheep follow, for they know His voice.',
          wrongFeedback: 'Jesus said His sheep know His voice (John 10:4).'
        },
        {
          question: 'What did Jesus say about other sheep?',
          choices: ['I don\'t want them', 'I have other sheep not of this fold — I must bring them', 'They are bad', 'Stay away'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Other sheep I have, which are not of this fold."',
          wrongFeedback: 'Jesus said, "Them also I must bring, and they shall hear my voice" (John 10:16).'
        },
        {
          question: 'What can we learn from the good shepherd?',
          choices: ['Run from trouble', 'Jesus loves and protects His sheep', 'Sheep are alone', 'Never follow His voice'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus loves, protects, and laid down His life for us.',
          wrongFeedback: 'Jesus is the good shepherd — He knoweth us, calleth us, and saveth us!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is the good shepherd!',
      takeaway: 'Jesus is the good shepherd — He loves, knows, and protects His sheep.',
      prayer: 'Jesus, thank You for being my good shepherd. Lead me always. Amen.'
    },

    jesusLazarus: {
      kjvRef: 'John 11:1–44',
      paragraphs: [
        'Lazarus was sick. His sisters Mary and Martha sent word to Jesus: "Lord, behold, he whom thou lovest is sick."',
        'Jesus abode two days. He said, "This sickness is not unto death, but for the glory of God, that the Son of God might be glorified thereby."',
        'When Jesus came, Lazarus had been dead four days. Martha said, "Lord, if thou hadst been here, my brother had not died."',
        'Jesus said, "I am the resurrection, and the life." He went to the cave and cried with a loud voice, "Lazarus, come forth."',
        'Lazarus came forth, bound hand and foot with graveclothes. Many believed on Jesus because of this miracle.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Mary and Martha sending message to Jesus, Lazarus sick, no text',
        'fun kid illustration: Jesus waiting, saying this is for God\'s glory, no text',
        'colorful Bible scene for children: Jesus arriving, Martha speaking in grief, no text',
        'exciting cartoon: Jesus at tomb, calling "Lazarus, come forth!", Lazarus walking out, no text',
        'happy ending illustration: Lazarus alive, family rejoicing, people believing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus raised Lazarus — showing He is the resurrection!',
      quizHeading: 'Raising Lazarus Questions',
      questions: [
        {
          question: 'Who was sick and died?',
          choices: ['Mary', 'Lazarus', 'Martha', 'Jesus'],
          correctIndex: 1,
          correctFeedback: 'Yes! Lazarus, whom Jesus loved.',
          wrongFeedback: 'Not Mary or Martha. Lazarus was sick and died (John 11:1–14).'
        },
        {
          question: 'What did Jesus say about Lazarus\' sickness?',
          choices: ['It will only end in death', 'This sickness is not unto death — for God\'s glory', 'It is nothing', 'Ignore it'],
          correctIndex: 1,
          correctFeedback: 'Right! It was for the glory of God.',
          wrongFeedback: 'Jesus said it was "for the glory of God, that the Son of God might be glorified thereby" (John 11:4).'
        },
        {
          question: 'How long had Lazarus been dead when Jesus arrived?',
          choices: ['One day', 'Four days', 'Seven days', 'One month'],
          correctIndex: 1,
          correctFeedback: 'Yes! Four days in the grave.',
          wrongFeedback: 'Not one day. He had lain in the grave four days (John 11:17).'
        },
        {
          question: 'What did Jesus cry at the tomb?',
          choices: ['Lazarus, sleep', 'Lazarus, come forth', 'Go away', 'Be quiet'],
          correctIndex: 1,
          correctFeedback: 'Exactly! "Lazarus, come forth" — and he did.',
          wrongFeedback: 'Jesus cried with a loud voice, "Lazarus, come forth" (John 11:43).'
        },
        {
          question: 'What can we learn from raising Lazarus?',
          choices: ['Jesus can\'t raise the dead', 'Jesus is the resurrection and the life', 'Death is forever', 'Never cry'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus is the resurrection and the life.',
          wrongFeedback: 'Jesus said, "I am the resurrection, and the life" — He hath power over death (John 11:25).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is the resurrection!',
      takeaway: 'Jesus is the resurrection and the life — He has power over death.',
      prayer: 'Jesus, thank You for being the resurrection. Give me eternal life. Amen.'
    },

    jesusTriumphalEntry: {
      kjvRef: 'Matthew 21:1–11; Mark 11:1–11; Luke 19:28–44; John 12:12–19',
      paragraphs: [
        'Jesus rode into Jerusalem on a colt, the foal of an ass. Multitudes spread garments and branches in the way.',
        'They cried, "Hosanna to the son of David: Blessed is he that cometh in the name of the Lord!"',
        'The city was moved, saying, "Who is this?" The multitude said, "This is Jesus the prophet of Nazareth of Galilee."',
        'Jesus went into the temple and cast out those who bought and sold, saying, "It is written, My house shall be called the house of prayer."',
        'The people praised Him. This began the week that led to the cross — yet He came as the promised King.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus riding donkey into Jerusalem, crowds waving palms, no text',
        'fun kid illustration: people spreading cloaks and branches on road, shouting Hosanna, no text',
        'colorful Bible scene for children: city asking "Who is this?", crowds naming Jesus the prophet, no text',
        'exciting cartoon: Jesus in temple, cleansing the house of prayer, no text',
        'happy ending illustration: people praising Jesus, palm branches waving, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus entered Jerusalem as King — the people shouted Hosanna!',
      quizHeading: 'Triumphal Entry Questions',
      questions: [
        {
          question: 'How did Jesus ride into Jerusalem?',
          choices: ['On a horse', 'On a colt, the foal of an ass', 'Walking only', 'In a chariot'],
          correctIndex: 1,
          correctFeedback: 'Yes! On a colt — as the prophets foretold.',
          wrongFeedback: 'Not horse or chariot. Jesus sat upon an ass, and a colt the foal of an ass (Matthew 21:5–7).'
        },
        {
          question: 'What did the multitudes cry?',
          choices: ['Hosanna to the son of David!', 'Go away!', 'Who are You?', 'Be quiet'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Hosanna to the son of David: Blessed is he that cometh in the name of the Lord!"',
          wrongFeedback: 'They cried, "Hosanna to the son of David" (Matthew 21:9).'
        },
        {
          question: 'What did the city ask?',
          choices: ['What is this noise?', 'Who is this?', 'Where is the king?', 'Why branches?'],
          correctIndex: 1,
          correctFeedback: 'Right! "Who is this?"',
          wrongFeedback: 'All the city asked, "Who is this?" (Matthew 21:10).'
        },
        {
          question: 'What did the multitude answer?',
          choices: ['A king only', 'This is Jesus the prophet of Nazareth of Galilee', 'A teacher only', 'A carpenter only'],
          correctIndex: 1,
          correctFeedback: 'Yes! "This is Jesus the prophet of Nazareth of Galilee."',
          wrongFeedback: 'The multitude said, "This is Jesus the prophet of Nazareth of Galilee" (Matthew 21:11).'
        },
        {
          question: 'What can we learn from the triumphal entry?',
          choices: ['Jesus is not King', 'Jesus is the promised King — praise Him', 'Never rejoice', 'Stay silent'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus is the promised King — Hosanna!',
          wrongFeedback: 'The people welcomed Jesus as the son of David — we can praise Him too!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Hosanna to the King!',
      takeaway: 'Jesus is the promised King — praise Him with joy.',
      prayer: 'Jesus, You are the King. Hosanna in the highest! Amen.'
    },

    jesusLastSupper: {
      kjvRef: 'Matthew 26:17–30; Mark 14:12–26; Luke 22:7–20; 1 Corinthians 11:23–26',
      paragraphs: [
        'Jesus ate the Passover with His disciples. He took bread, gave thanks, brake it, and said, "This is My body, which is given for you: this do in remembrance of Me."',
        'He took the cup and said, "This cup is the new testament in My blood, which is shed for you."',
        'Jesus said, "Verily I say unto you, that one of you shall betray Me." They were exceeding sorrowful. Judas asked, "Is it I?" He said unto him, "Thou hast said."',
        'When they had sung an hymn, they went out into the Mount of Olives.',
        'Jesus gave His church the Lord\'s Supper — to remember His death until He comes again.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus with disciples at Passover table, bread and cup, no text',
        'fun kid illustration: Jesus breaking bread, saying this is My body, disciples listening, no text',
        'colorful Bible scene for children: Jesus passing cup, new testament in My blood, no text',
        'exciting cartoon: Jesus saying one will betray Him, disciples sad, Judas uneasy, no text',
        'hopeful ending illustration: disciples singing hymn, going to Mount of Olives, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus gave the Lord\'s Supper to remember His sacrifice!',
      quizHeading: 'The Last Supper Questions',
      questions: [
        {
          question: 'What meal did Jesus eat with His disciples?',
          choices: ['Breakfast', 'Passover meal', 'Birthday party', 'Picnic'],
          correctIndex: 1,
          correctFeedback: 'Yes! The Passover with His twelve disciples.',
          wrongFeedback: 'Not breakfast or picnic. They made ready the Passover (Matthew 26:17–19).'
        },
        {
          question: 'What did Jesus say about the bread?',
          choices: ['This is My body given for you', 'This is just bread', 'Eat more', 'Share with others'],
          correctIndex: 0,
          correctFeedback: 'Right! "This is My body, which is given for you: this do in remembrance of Me."',
          wrongFeedback: 'Jesus said, "This is My body, which is given for you: this do in remembrance of Me" (Luke 22:19).'
        },
        {
          question: 'What did Jesus say about the cup?',
          choices: ['This cup is the new testament in My blood', 'This is only juice', 'Drink it fast', 'Give it away'],
          correctIndex: 0,
          correctFeedback: 'Yes! "This cup is the new testament in My blood, which is shed for you."',
          wrongFeedback: 'Jesus said, "This cup is the new testament in My blood, which is shed for you" (Luke 22:20).'
        },
        {
          question: 'What did Jesus say about one disciple?',
          choices: ['One shall betray Me', 'One shall be king', 'One shall leave', 'One shall sing'],
          correctIndex: 0,
          correctFeedback: 'Correct! "One of you shall betray Me."',
          wrongFeedback: 'Jesus said, "Verily I say unto you, that one of you shall betray Me" (Matthew 26:21).'
        },
        {
          question: 'What can we learn from the Last Supper?',
          choices: ['Never eat with friends', 'Remember Jesus\' sacrifice', 'Forget Jesus', 'Eat quickly'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The Lord\'s Supper reminds us of Jesus\' death for us.',
          wrongFeedback: 'Jesus said, "This do in remembrance of Me" — remember His sacrifice!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — remember Jesus\' sacrifice!',
      takeaway: 'Remember Jesus\' sacrifice — He gave His body and blood for us.',
      prayer: 'Jesus, thank You for Your sacrifice. Help me remember You always. Amen.'
    },

    jesusGardenGethsemane: {
      kjvRef: 'Matthew 26:36–46; Mark 14:32–42; Luke 22:39–46',
      paragraphs: [
        'Jesus went to Gethsemane with His disciples. He said, "Sit ye here, while I go and pray yonder."',
        'He prayed, "O My Father, if it be possible, let this cup pass from Me: nevertheless not as I will, but as Thou wilt."',
        'He found the disciples sleeping. He said unto Peter, "What, could ye not watch with Me one hour?"',
        'In Luke\'s account, His sweat was as great drops of blood, and an angel appeared strengthening Him.',
        'Jesus said, "The hour is come; behold, the Son of man is betrayed." Judas came with a band of men.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus and disciples in Gethsemane garden, Jesus praying, no text',
        'fun kid illustration: Jesus praying alone, not My will but Thine, peaceful strength, no text',
        'colorful Bible scene for children: disciples sleeping while Jesus prays, gentle moment, no text',
        'exciting cartoon: angel strengthening Jesus, sorrow yet trust in God, no text',
        'hopeful ending illustration: Judas arriving with crowd, Jesus standing faithful, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus prayed in agony — "Not My will, but Thine."',
      quizHeading: 'Garden of Gethsemane Questions',
      questions: [
        {
          question: 'Where did Jesus go to pray?',
          choices: ['Jerusalem only', 'Gethsemane', 'The temple court', 'The sea'],
          correctIndex: 1,
          correctFeedback: 'Yes! A place called Gethsemane — with His disciples.',
          wrongFeedback: 'Jesus came with them to a place called Gethsemane (Matthew 26:36).'
        },
        {
          question: 'What did Jesus pray?',
          choices: ['Let this cup pass — yet not as I will, but as Thou wilt', 'Give Me power only', 'Take Me away', 'I need no help'],
          correctIndex: 0,
          correctFeedback: 'Yes! "If it be possible, let this cup pass… nevertheless not as I will, but as Thou wilt."',
          wrongFeedback: 'Jesus prayed, "O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt" (Matthew 26:39).'
        },
        {
          question: 'What did Jesus find the disciples doing?',
          choices: ['Praying', 'Sleeping', 'Watching', 'Singing'],
          correctIndex: 1,
          correctFeedback: 'Right! They slept — "Could ye not watch with Me one hour?"',
          wrongFeedback: 'He found them sleeping (Matthew 26:40).'
        },
        {
          question: 'Who strengthened Jesus in His agony (Luke\'s account)?',
          choices: ['The disciples', 'An angel from heaven', 'Peter only', 'Judas'],
          correctIndex: 1,
          correctFeedback: 'Yes! An angel appeared from heaven strengthening Him.',
          wrongFeedback: 'There appeared an angel unto Him from heaven, strengthening Him (Luke 22:43).'
        },
        {
          question: 'What can we learn from Gethsemane?',
          choices: ['Pray only when easy', 'Pray God\'s will even when it is hard', 'Never pray alone', 'Give up when sad'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Submit to God\'s will — "not as I will, but as Thou wilt."',
          wrongFeedback: 'Jesus yielded to the Father\'s will in deep sorrow — we can trust Him too!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — pray God\'s will!',
      takeaway: 'Pray "Thy will be done" — even when it is hard.',
      prayer: 'God, Thy will be done in my life. Help me pray like Jesus. Amen.'
    },

    jesusCrucifixion: {
      kjvRef: 'Matthew 27; Mark 15; Luke 23; John 19',
      paragraphs: [
        'Jesus was betrayed, arrested, tried, and delivered to be crucified.',
        'They led Him to Golgotha, a place of a skull. They crucified Him between two thieves.',
        'Jesus said, "Father, forgive them; for they know not what they do."',
        'From the sixth hour there was darkness over the land unto the ninth hour. Jesus cried, "It is finished," and yielded up His spirit.',
        'The veil of the temple was rent. The earth quaked. He died for our sins — the just for the unjust.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus carrying cross toward hill, solemn loving face, no gore, no text',
        'fun kid illustration: three crosses on hill, gentle light, no violence, no text',
        'colorful Bible scene for children: darkness over land, Jesus forgiving, no text',
        'exciting cartoon: temple veil tearing, earth trembling, God\'s plan fulfilled, no text',
        'hopeful ending illustration: cross showing love and sacrifice for sins, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus died for our sins — the greatest love!',
      quizHeading: 'Jesus Crucified Questions',
      questions: [
        {
          question: 'Where was Jesus crucified?',
          choices: ['In the temple', 'Golgotha — a place of a skull', 'By the sea only', 'In a garden only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Golgotha — the place of a skull.',
          wrongFeedback: 'They came unto a place called Golgotha (Matthew 27:33).'
        },
        {
          question: 'What did Jesus say about those who crucified Him?',
          choices: ['Punish them', 'Father, forgive them; for they know not what they do', 'I hate you', 'Go away'],
          correctIndex: 1,
          correctFeedback: 'Right! He prayed for their forgiveness.',
          wrongFeedback: 'Jesus said, "Father, forgive them; for they know not what they do" (Luke 23:34).'
        },
        {
          question: 'What happened from the sixth to the ninth hour?',
          choices: ['Bright sun', 'Darkness over all the land', 'Rain only', 'Music'],
          correctIndex: 1,
          correctFeedback: 'Yes! Darkness over the land.',
          wrongFeedback: 'From the sixth hour there was darkness over all the land unto the ninth hour (Matthew 27:45).'
        },
        {
          question: 'What did Jesus cry before He gave up His spirit?',
          choices: ['It is finished', 'Help Me only', 'I am alone only', 'Goodbye only'],
          correctIndex: 0,
          correctFeedback: 'Yes! "It is finished" — He bowed His head and gave up the ghost.',
          wrongFeedback: 'When Jesus had received the vinegar, He said, "It is finished" (John 19:30).'
        },
        {
          question: 'What can we learn from Jesus\' crucifixion?',
          choices: ['Jesus did not love us', 'He died for our sins', 'Death is the end for all', 'Never forgive'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Christ died for our sins — the just for the unjust.',
          wrongFeedback: 'He bare our sins in His own body on the tree — by His stripes we are healed (1 Peter 2:24).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus died for us!',
      takeaway: 'Jesus died for our sins — the greatest love.',
      prayer: 'Jesus, thank You for dying for me. Forgive my sins. Amen.'
    },

    jesusResurrection: {
      kjvRef: 'Matthew 28; Mark 16; Luke 24; John 20',
      paragraphs: [
        'Jesus\' body was laid in a tomb. A great stone sealed the door.',
        'On the first day of the week, Mary Magdalene and the other Mary came. There was a great earthquake — an angel rolled back the stone.',
        'The angel said, "Fear not… He is not here: for He is risen, as He said."',
        'As they went, Jesus met them. They held Him by the feet and worshiped Him.',
        'Jesus is alive! He rose again the third day according to the Scriptures — death could not hold Him.'
      ],
      imagePrompts: [
        'bright cartoon for kids: sealed tomb, stone in front, quiet morning, no text',
        'fun kid illustration: women at tomb, stone rolled away, angel bright, no text',
        'colorful Bible scene for children: angel saying He is risen, joy and wonder, no text',
        'exciting cartoon: Jesus alive meeting women, they worship, no text',
        'happy ending illustration: Jesus alive, disciples rejoicing, hope eternal, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus is alive — He rose from the dead!',
      quizHeading: 'Jesus\' Resurrection Questions',
      questions: [
        {
          question: 'Where was Jesus\' body laid after He died?',
          choices: ['A palace', 'A tomb sealed with a stone', 'A river', 'A public square'],
          correctIndex: 1,
          correctFeedback: 'Yes! In Joseph\'s new tomb, rolled a great stone.',
          wrongFeedback: 'Joseph laid the body in his own new tomb (Matthew 27:59–60).'
        },
        {
          question: 'What did the women find at the tomb?',
          choices: ['Jesus asleep inside', 'The stone rolled away — the tomb empty', 'Only soldiers', 'Flowers only'],
          correctIndex: 1,
          correctFeedback: 'Right! The angel had rolled away the stone.',
          wrongFeedback: 'The angel rolled back the stone from the door (Matthew 28:2).'
        },
        {
          question: 'What did the angel say?',
          choices: ['He is dead forever', 'He is not here: for He is risen', 'Go away', 'Be quiet'],
          correctIndex: 1,
          correctFeedback: 'Yes! "He is not here: for He is risen, as He said."',
          wrongFeedback: 'The angel said, "He is not here: for he is risen, as he said" (Matthew 28:6).'
        },
        {
          question: 'Who met Jesus first as they went to tell the disciples (Matthew)?',
          choices: ['The eleven disciples first', 'The women (Mary Magdalene and the other Mary)', 'The guards first', 'Pilate'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jesus met them — they worshiped Him.',
          wrongFeedback: 'Jesus met them, saying, "All hail." They came and held Him by the feet (Matthew 28:9).'
        },
        {
          question: 'What can we learn from the resurrection?',
          choices: ['Death wins', 'Jesus conquered death — He is alive', 'Never believe', 'Tombs always stay closed'],
          correctIndex: 1,
          correctFeedback: 'Perfect! He is risen — we have living hope!',
          wrongFeedback: 'Christ died for our sins… He was buried… He rose again the third day (1 Corinthians 15:3–4).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is alive!',
      takeaway: 'Jesus conquered death — He is alive forever!',
      prayer: 'Jesus, thank You for rising from the dead. I believe in You! Amen.'
    },

    jesusAscension: {
      kjvRef: 'Luke 24:50–53; Acts 1:6–11',
      paragraphs: [
        'After He rose, Jesus showed Himself alive for forty days, speaking of the things pertaining to the kingdom of God.',
        'He commanded them to wait at Jerusalem for the promise of the Father — "Ye shall be baptized with the Holy Ghost."',
        'He said, "Ye shall be witnesses unto Me… unto the uttermost part of the earth."',
        'He led them out to Bethany, lifted up His hands, blessed them, and was carried up into heaven while they beheld.',
        'Two men in white apparel said, "This same Jesus… shall so come in like manner as ye have seen Him go into heaven." They returned with great joy.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus teaching disciples after resurrection, joyful, no text',
        'fun kid illustration: Jesus telling disciples to wait for the Spirit, promise of power, no text',
        'colorful Bible scene for children: Jesus blessing disciples, ascending toward heaven, no text',
        'exciting cartoon: cloud receiving Jesus, disciples looking up, angels speaking, no text',
        'happy ending illustration: disciples worshiping, returning with joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus ascended to heaven — He will return!',
      quizHeading: 'Jesus\' Ascension Questions',
      questions: [
        {
          question: 'How long did Jesus show Himself after He rose?',
          choices: ['One day', 'Forty days', 'One year', 'Three days only'],
          correctIndex: 1,
          correctFeedback: 'Yes! He was seen of them forty days.',
          wrongFeedback: 'He was seen of them forty days, speaking of the kingdom of God (Acts 1:3).'
        },
        {
          question: 'What did Jesus tell the disciples to wait for in Jerusalem?',
          choices: ['A new earthly king', 'The promise of the Father — the Holy Ghost', 'More food only', 'A boat'],
          correctIndex: 1,
          correctFeedback: 'Right! Wait for the promise of the Father.',
          wrongFeedback: 'He said, "Wait for the promise of the Father… ye shall be baptized with the Holy Ghost" (Acts 1:4–5).'
        },
        {
          question: 'Where was Jesus when He was taken up (Acts)?',
          choices: ['In the temple only', 'On the mount called Olivet', 'By the sea only', 'In a closed room only'],
          correctIndex: 1,
          correctFeedback: 'Yes! He led them out as far as Bethany — near Olivet.',
          wrongFeedback: 'He was taken up from the mount called Olivet (Acts 1:12).'
        },
        {
          question: 'What did the two men in white say?',
          choices: ['Jesus will never return', 'This same Jesus shall so come in like manner', 'Go home', 'Forget Him'],
          correctIndex: 1,
          correctFeedback: 'Exactly! He will return as He went.',
          wrongFeedback: 'This same Jesus… shall so come in like manner as ye have seen Him go into heaven (Acts 1:11).'
        },
        {
          question: 'What can we learn from Jesus\' ascension?',
          choices: ['Jesus left us forever', 'Jesus is in heaven and will return', 'The disciples had no joy', 'Never look up'],
          correctIndex: 1,
          correctFeedback: 'Perfect! He reigns in heaven — and He will come again!',
          wrongFeedback: 'He ascended to the Father — and promised to come again the same way!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus will return!',
      takeaway: 'Jesus is in heaven and will return — live ready for Him.',
      prayer: 'Jesus, thank You for ascending. Come back soon. Amen.'
    },

    pentecost: {
      kjvRef: 'Acts 2',
      paragraphs: [
        'Jesus told the disciples to wait at Jerusalem for the promise of the Father. They continued with one accord in prayer.',
        'When the day of Pentecost was come, suddenly there came a sound from heaven as of a rushing mighty wind. Cloven tongues like fire sat upon each of them.',
        'They were all filled with the Holy Ghost, and began to speak with other tongues as the Spirit gave them utterance. Devout men from every nation heard them speak in their own languages.',
        'Peter stood up and preached: God hath made that same Jesus, whom ye crucified, both Lord and Christ. He called them to repent and be baptized in the name of Jesus Christ for the remission of sins.',
        'They that gladly received his word were baptized — about three thousand souls were added that day. The church grew with joy and unity.'
      ],
      imagePrompts: [
        'bright cartoon for kids: disciples praying together in upper room, waiting for Holy Spirit, no text',
        'fun kid illustration: sound like wind, tongues like fire on disciples, no text',
        'colorful Bible scene for children: disciples speaking in different languages, crowd amazed, no text',
        'exciting cartoon: Peter preaching to huge crowd, people listening, no text',
        'happy ending illustration: many baptized, church growing, joy and unity, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The Holy Spirit came — the church was born!',
      quizHeading: 'Day of Pentecost Questions',
      questions: [
        {
          question: 'What did Jesus tell the disciples to do?',
          choices: ['Go home', 'Wait at Jerusalem for the promise of the Father', 'Build a temple first', 'Travel far at once'],
          correctIndex: 1,
          correctFeedback: 'Yes! Wait for the promise of the Holy Ghost.',
          wrongFeedback: 'Jesus commanded them to wait for the promise of the Father (Acts 1:4).'
        },
        {
          question: 'What happened on the day of Pentecost?',
          choices: ['Nothing', 'Wind, cloven tongues like fire, speaking in other tongues', 'Only rain', 'Only an earthquake'],
          correctIndex: 1,
          correctFeedback: 'Right! A rushing mighty wind, fire-like tongues, and they spoke in other languages.',
          wrongFeedback: 'A sound from heaven as of a rushing mighty wind, cloven tongues like fire, and they spoke with other tongues (Acts 2:2–4).'
        },
        {
          question: 'What did Peter call the people to do?',
          choices: ['Forget Jesus', 'Repent and be baptized in the name of Jesus Christ', 'Give money only', 'Build more buildings'],
          correctIndex: 1,
          correctFeedback: 'Yes! Repent and be baptized for the remission of sins.',
          wrongFeedback: 'Peter said, "Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins" (Acts 2:38).'
        },
        {
          question: 'How many souls were added that day?',
          choices: ['About 30', 'About 300', 'About 3,000', 'About 30,000'],
          correctIndex: 2,
          correctFeedback: 'Yes! About three thousand souls.',
          wrongFeedback: 'The same day were added unto them about three thousand souls (Acts 2:41).'
        },
        {
          question: 'What can we learn from Pentecost?',
          choices: ['The Holy Spirit does not matter', 'The Holy Spirit empowers the church to witness', 'Never wait on God', 'Forget the gospel'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The Spirit came and the church was born with power.',
          wrongFeedback: 'Pentecost shows God pours out His Spirit and empowers believers to tell others about Jesus!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — the Holy Spirit came!',
      takeaway: 'The Holy Spirit empowers the church — wait for His power.',
      prayer: 'God, fill me with Your Holy Spirit. Help me share Jesus. Amen.'
    },

    peterHealsLame: {
      kjvRef: 'Acts 3',
      paragraphs: [
        'Peter and John went up together into the temple. A man lame from his mother\'s womb was laid daily at the gate called Beautiful to ask alms.',
        'He asked for money. Peter said, "Silver and gold have I none; but such as I have give I thee: In the name of Jesus Christ of Nazareth rise up and walk."',
        'Peter took him by the right hand and lifted him up. Immediately his feet and ankle bones received strength. He leaping up stood, walked, and entered the temple with them, praising God.',
        'The people wondered. Peter preached that faith in Jesus\' name had made this man strong — not their own power.',
        'Many heard the word and believed. The Lord added to the church.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Peter and John at temple gate Beautiful, lame man asking alms, no text',
        'fun kid illustration: Peter saying in the name of Jesus Christ rise up and walk, man surprised, no text',
        'colorful Bible scene for children: man leaping and walking, praising God, people amazed, no text',
        'exciting cartoon: Peter preaching Jesus raised from the dead, no text',
        'happy ending illustration: people believing, joy in the Lord, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Peter healed in Jesus\' name — faith in Jesus!',
      quizHeading: 'Peter Heals Lame Man Questions',
      questions: [
        {
          question: 'Where was the lame man laid daily?',
          choices: ['At the market', 'At the temple gate called Beautiful', 'At home only', 'By the sea'],
          correctIndex: 1,
          correctFeedback: 'Yes! At the gate of the temple called Beautiful.',
          wrongFeedback: 'They laid him daily at the gate of the temple which is called Beautiful (Acts 3:2).'
        },
        {
          question: 'What did Peter say to him?',
          choices: ['Here is silver and gold', 'In the name of Jesus Christ of Nazareth rise up and walk', 'Go away', 'Pray harder alone'],
          correctIndex: 1,
          correctFeedback: 'Right! Silver and gold I have not — but in Jesus\' name, walk.',
          wrongFeedback: 'Peter said, "In the name of Jesus Christ of Nazareth rise up and walk" (Acts 3:6).'
        },
        {
          question: 'What happened to his feet and ankles?',
          choices: ['They stayed weak', 'They received strength immediately', 'They hurt more', 'They vanished'],
          correctIndex: 1,
          correctFeedback: 'Yes! His feet and ankle bones received strength.',
          wrongFeedback: 'Immediately his feet and ankle bones received strength (Acts 3:7).'
        },
        {
          question: 'What did Peter say made the man strong?',
          choices: ['Peter\'s own power', 'Faith in Jesus\' name', 'The temple gate', 'Money'],
          correctIndex: 1,
          correctFeedback: 'Yes! Faith in Jesus\' name.',
          wrongFeedback: 'His name through faith in his name hath made this man strong (Acts 3:16).'
        },
        {
          question: 'What can we learn from this miracle?',
          choices: ['Jesus has no power today', 'Faith in Jesus\' name has power', 'Never help the poor', 'Miracles are pretend'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus is alive — His name still saves and heals.',
          wrongFeedback: 'The lame man walked because of faith in the name of Jesus!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — faith in Jesus heals!',
      takeaway: 'Faith in Jesus\' name has power — trust Him.',
      prayer: 'Jesus, thank You for Your power. Help my faith grow. Amen.'
    },

    peterJailBreak: {
      kjvRef: 'Acts 12:1–19',
      paragraphs: [
        'Herod stretched forth his hands to vex certain of the church. He killed James and imprisoned Peter.',
        'The church prayed without ceasing for Peter. He slept between two soldiers, bound with two chains, keepers before the door.',
        'The angel of the Lord came, a light shined in the prison, and the angel smote Peter on the side and raised him up. The chains fell off.',
        'The angel led him past the first and second ward, and the iron gate opened to them of its own accord. Peter thought he saw a vision.',
        'When Peter came to the house where many prayed for him, they were astonished. Herod sought him and found him not. God delivered Peter.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Peter in prison asleep between soldiers, chains, no text',
        'fun kid illustration: angel and light in cell, waking Peter, no text',
        'colorful Bible scene for children: chains fallen off, angel leading Peter, no text',
        'exciting cartoon: iron gate opening by itself, Peter walking free, no text',
        'happy ending illustration: Peter at prayer meeting, friends amazed, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The church prayed — God sent an angel to free Peter!',
      quizHeading: 'Peter\'s Jail Break Questions',
      questions: [
        {
          question: 'Why was Peter in prison?',
          choices: ['He stole', 'Herod had taken him to please the people', 'He was sick', 'He asked to rest'],
          correctIndex: 1,
          correctFeedback: 'Yes! Herod seized Peter after killing James.',
          wrongFeedback: 'Herod stretched forth his hands to vex the church and imprisoned Peter (Acts 12:1–5).'
        },
        {
          question: 'What was the church doing for Peter?',
          choices: ['Nothing', 'Praying without ceasing', 'Feasting', 'Sleeping only'],
          correctIndex: 1,
          correctFeedback: 'Right! Prayer was made without ceasing of the church unto God for him.',
          wrongFeedback: 'Prayer was made without ceasing of the church unto God for him (Acts 12:5).'
        },
        {
          question: 'Who came to Peter in the prison?',
          choices: ['A guard only', 'The angel of the Lord', 'Herod', 'John'],
          correctIndex: 1,
          correctFeedback: 'Yes! The angel of the Lord appeared and a light shined.',
          wrongFeedback: 'The angel of the Lord came upon him, and a light shined in the prison (Acts 12:7).'
        },
        {
          question: 'How did Peter get out?',
          choices: ['He broke the chains alone', 'The angel led him and the iron gate opened by itself', 'The guards opened all doors', 'He dug a tunnel'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Chains fell off, angel led him, the gate opened to them of its own accord.',
          wrongFeedback: 'The iron gate opened to them of his own accord (Acts 12:10).'
        },
        {
          question: 'What can we learn from Peter\'s escape?',
          choices: ['Prayer is useless', 'God hears prayer and delivers His people', 'Never pray at night', 'Sleep in chains'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The church prayed — God sent an angel.',
          wrongFeedback: 'They prayed without ceasing — and God brought Peter out!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God answers prayer!',
      takeaway: 'God answers prayer and delivers His people.',
      prayer: 'God, thank You for answering prayer. Help me pray for others. Amen.'
    },

    stephenMartyr: {
      kjvRef: 'Acts 6:8–7:60',
      paragraphs: [
        'Stephen, full of faith and power, did great wonders and signs among the people.',
        'They disputed with him but could not resist the wisdom and spirit by which he spake. They set up false witnesses against him.',
        'Before the council Stephen rehearsed Israel\'s history and said, "Ye stiffnecked and uncircumcised in heart and ears, ye do always resist the Holy Ghost."',
        'They were cut to the heart. He looked up steadfastly into heaven, and saw the glory of God, and Jesus standing on the right hand of God.',
        'They cast him out and stoned him. He called upon God, "Lord Jesus, receive my spirit," and kneeled down and cried, "Lord, lay not this sin to their charge." He fell asleep in the Lord.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Stephen full of faith, wonders among people, no text',
        'fun kid illustration: leaders unable to answer Stephen\'s wisdom, no text',
        'colorful Bible scene for children: Stephen speaking boldly before council, no text',
        'exciting cartoon: heaven opened, Jesus standing at God\'s right hand, no text',
        'hopeful ending illustration: Stephen praying forgiveness, peaceful face, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Stephen stood boldly for Jesus — even to death!',
      quizHeading: 'Stephen the Martyr Questions',
      questions: [
        {
          question: 'How does Acts describe Stephen?',
          choices: ['Full of fear', 'Full of faith and power', 'Full of money', 'Full of anger'],
          correctIndex: 1,
          correctFeedback: 'Yes! Full of faith and power, doing signs.',
          wrongFeedback: 'Stephen, full of faith and power, did great wonders and miracles among the people (Acts 6:8).'
        },
        {
          question: 'Why did opponents turn against him?',
          choices: ['He helped them too much', 'They could not resist the wisdom and spirit by which he spake', 'He was silent', 'He was rich'],
          correctIndex: 1,
          correctFeedback: 'Right! They disputed but could not withstand his wisdom.',
          wrongFeedback: 'They were not able to resist the wisdom and the spirit by which he spake (Acts 6:10).'
        },
        {
          question: 'What did Stephen see at the right hand of God?',
          choices: ['Angels only', 'The Son of man standing on the right hand of God', 'An empty throne', 'Nothing'],
          correctIndex: 1,
          correctFeedback: 'Yes! He saw Jesus standing on the right hand of God.',
          wrongFeedback: 'Behold, I see the heavens opened, and the Son of man standing on the right hand of God (Acts 7:56).'
        },
        {
          question: 'What did Stephen pray about those who stoned him?',
          choices: ['Punish them', 'Lay not this sin to their charge', 'Save my body only', 'Curse them'],
          correctIndex: 1,
          correctFeedback: 'Exactly! He asked God not to lay the sin to their charge.',
          wrongFeedback: 'Lord, lay not this sin to their charge — like Jesus on the cross (Acts 7:60).'
        },
        {
          question: 'What can we learn from Stephen?',
          choices: ['Hide your faith', 'Stand firm for Jesus and forgive', 'Run from every trial', 'Stay quiet always'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Bold truth and forgiving love — like Christ.',
          wrongFeedback: 'Stephen was the first martyr for Christ — he trusted Jesus to the end!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — stand firm for Jesus!',
      takeaway: 'Stand firm for Jesus — even to death — and forgive others.',
      prayer: 'Jesus, help me stand firm for You. Help me forgive like Stephen. Amen.'
    },

    philipEthiopian: {
      kjvRef: 'Acts 8:26–40',
      paragraphs: [
        'An angel of the Lord spake unto Philip, saying, "Arise, and go toward the south unto the way that goeth down from Jerusalem unto Gaza." Philip arose and went.',
        'He met a man of Ethiopia, a eunuch of great authority, who had come to worship and was reading Esaias the prophet in his chariot.',
        'Philip ran to him and asked, "Understandest thou what thou readest?" He said, "How can I, except some man should guide me?"',
        'Philip preached unto him Jesus, beginning at that Scripture. When they saw water, the eunuch said, "See, here is water; what doth hinder me to be baptized?"',
        'They went down into the water, and Philip baptized him. The eunuch went on his way rejoicing. The Spirit caught Philip away.'
      ],
      imagePrompts: [
        'bright cartoon for kids: angel telling Philip to go toward Gaza road, no text',
        'fun kid illustration: Philip meeting Ethiopian reading scroll in chariot, no text',
        'colorful Bible scene for children: Philip explaining Isaiah, man listening, no text',
        'exciting cartoon: water in view, Ethiopian eager to be baptized, no text',
        'happy ending illustration: baptism, man rejoicing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Philip obeyed and explained Jesus to the Ethiopian!',
      quizHeading: 'Philip & Ethiopian Questions',
      questions: [
        {
          question: 'Where did the angel send Philip?',
          choices: ['North only', 'Toward the south, the desert way from Jerusalem to Gaza', 'East only', 'West only'],
          correctIndex: 1,
          correctFeedback: 'Yes! South toward the way from Jerusalem to Gaza.',
          wrongFeedback: 'Arise, and go toward the south unto the way that goeth down from Jerusalem unto Gaza (Acts 8:26).'
        },
        {
          question: 'What was the Ethiopian reading?',
          choices: ['A letter', 'Esaias the prophet', 'A map', 'A songbook'],
          correctIndex: 1,
          correctFeedback: 'Right! The book of the prophet Esaias.',
          wrongFeedback: 'He read Esaias the prophet (Acts 8:28).'
        },
        {
          question: 'What did Philip ask him?',
          choices: ['Understandest thou what thou readest?', 'Where art thou going?', 'Give me silver', 'Stop thy chariot forever'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Understandest thou what thou readest?"',
          wrongFeedback: 'Philip said, "Understandest thou what thou readest?" (Acts 8:30).'
        },
        {
          question: 'What did the eunuch answer?',
          choices: ['I understand all', 'How can I, except some man should guide me?', 'I care not', 'Leave me'],
          correctIndex: 1,
          correctFeedback: 'Right! He needed someone to guide him.',
          wrongFeedback: 'How can I, except some man should guide me? (Acts 8:31).'
        },
        {
          question: 'What can we learn from Philip and the Ethiopian?',
          choices: ['Never explain Scripture', 'Obey God and share Jesus with others', 'Stay home always', 'Ignore travelers'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Obedience and a willing mouth — God saves.',
          wrongFeedback: 'Philip obeyed, opened the Scripture, and the man believed and was baptized!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — share Jesus!',
      takeaway: 'Obey God and share Jesus with others — He reaches everyone.',
      prayer: 'God, help me obey and share Jesus with people I meet. Amen.'
    },

    paulConversion: {
      kjvRef: 'Acts 9:1–19',
      paragraphs: [
        'Saul, breathing out threatenings and slaughter against the disciples, desired letters to Damascus to bring bound any that called on the name of Jesus.',
        'As he journeyed, suddenly there shined round about him a light from heaven. He fell and heard a voice: "Saul, Saul, why persecutest thou Me?"',
        'He said, "Who art Thou, Lord?" The Lord said, "I am Jesus whom thou persecutest." Saul arose from the earth blind, and saw no man three days.',
        'The Lord said to Ananias in a vision, "Go… enquire for one called Saul of Tarsus." Ananias laid hands on him: "Brother Saul, the Lord… hath sent me, that thou mightest receive thy sight, and be filled with the Holy Ghost."',
        'Immediately there fell from his eyes as it had been scales — he received sight, arose, and was baptized. Then Saul preached Christ in the synagogues: "He is the Son of God."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Saul riding toward Damascus with letters, stern face, no text',
        'fun kid illustration: light from heaven, Saul fallen, Jesus voice, no text',
        'colorful Bible scene for children: Saul blind in Damascus, fasting and praying three days, no text',
        'exciting cartoon: Ananias laying hands on Saul, scales falling, no text',
        'happy ending illustration: Paul preaching Jesus, crowd listening, changed heart, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus turned Saul from persecutor to preacher!',
      quizHeading: 'Paul’s Conversion Questions',
      questions: [
        {
          question: 'What was Saul doing before he met Jesus?',
          choices: ['Helping Christians', 'Persecuting those who called on Jesus’ name', 'Building synagogues', 'Praying daily in peace'],
          correctIndex: 1,
          correctFeedback: 'Yes! Saul was breathing threatenings and slaughter against the disciples.',
          wrongFeedback: 'Saul desired letters to bind men and women who called on the name of Jesus (Acts 9:1–2).'
        },
        {
          question: 'What happened on the road to Damascus?',
          choices: ['He fell and heard Jesus speak', 'He found treasure', 'He got lost in the desert', 'He met old friends'],
          correctIndex: 0,
          correctFeedback: 'Right! A light from heaven — he fell and heard, "Saul, Saul, why persecutest thou Me?"',
          wrongFeedback: 'A light shined about him; he fell and heard Jesus’ voice (Acts 9:3–4).'
        },
        {
          question: 'What did Jesus say to Saul?',
          choices: ['Thou art great', 'Saul, Saul, why persecutest thou Me?', 'Go home', 'Be still forever'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Saul, Saul, why persecutest thou Me?"',
          wrongFeedback: 'Jesus said, "Saul, Saul, why persecutest thou Me?" (Acts 9:4).'
        },
        {
          question: 'Whom did the Lord send to Saul in Damascus?',
          choices: ['Peter', 'Ananias', 'Barnabas', 'John'],
          correctIndex: 1,
          correctFeedback: 'Yes! Ananias laid hands on him — he received sight and the Holy Ghost.',
          wrongFeedback: 'The Lord told Ananias in a vision to go to Saul (Acts 9:10–18).'
        },
        {
          question: 'What can we learn from Paul’s conversion?',
          choices: ['Jesus cannot change anyone', 'Jesus can change even the hardest heart', 'We must never change', 'We should hurt others'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The persecutor became a preacher — Christ transforms lives.',
          wrongFeedback: 'Saul became Paul — Jesus still saves and changes those who oppose Him!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus changes lives!',
      takeaway: 'Jesus can change even the hardest hearts — trust Him.',
      prayer: 'Jesus, thank You for changing lives. Change my heart too. Amen.'
    },

    paulBarnabas: {
      kjvRef: 'Acts 13–14',
      paragraphs: [
        'At Antioch, as they ministered to the Lord and fasted, the Holy Ghost said, "Separate me Barnabas and Saul for the work whereunto I have called them."',
        'When they had fasted and prayed, they laid their hands on them and sent them away. So they, being sent forth by the Holy Ghost, departed unto Seleucia and sailed to Cyprus.',
        'They preached the word in the synagogues of the Jews. In many places multitudes believed; yet some rose up and spoke against them.',
        'When the Jews stirred up devout and honourable women and the chief men, and persecuted Paul and Barnabas, they shook off the dust of their feet against them and went to Iconium.',
        'Through mighty signs and wonders God confirmed the word of His grace. Returning to Antioch, they rehearsed all that God had done with them — and the disciples were glad.'
      ],
      imagePrompts: [
        'bright cartoon for kids: church at Antioch praying and fasting, sense of Holy Spirit speaking, no text',
        'fun kid illustration: hands laid on Barnabas and Paul, sending them out, no text',
        'colorful Bible scene for children: preaching in Cyprus, people listening, no text',
        'exciting cartoon: Pisidian Antioch or synagogue, some believing some opposing, no text',
        'happy ending illustration: Paul and Barnabas back at Antioch, church rejoicing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Barnabas and Paul were sent to spread the gospel!',
      quizHeading: 'Paul & Barnabas Sent Out Questions',
      questions: [
        {
          question: 'From where were Barnabas and Saul sent?',
          choices: ['Jerusalem only', 'Antioch', 'Rome', 'Ephesus'],
          correctIndex: 1,
          correctFeedback: 'Yes! The church at Antioch sent them forth by the Holy Ghost.',
          wrongFeedback: 'The Holy Ghost spoke at Antioch — "Separate me Barnabas and Saul" (Acts 13:1–3).'
        },
        {
          question: 'What did the Holy Ghost say?',
          choices: ['Stay home always', 'Separate me Barnabas and Saul for the work I have called them to', 'Build a temple first', 'Give silver and gold only'],
          correctIndex: 1,
          correctFeedback: 'Right! Separate them for the work whereunto He called them.',
          wrongFeedback: 'The Spirit said, "Separate me Barnabas and Saul for the work whereunto I have called them" (Acts 13:2).'
        },
        {
          question: 'What did the church do before they sent them?',
          choices: ['They fasted, prayed, and laid hands on them', 'They gave money only', 'They ignored them', 'They argued only'],
          correctIndex: 0,
          correctFeedback: 'Yes! They ministered, fasted, prayed, laid hands, and sent them away.',
          wrongFeedback: 'They had fasted and prayed, and laid their hands on them (Acts 13:3).'
        },
        {
          question: 'What happened in the cities they visited?',
          choices: ['Nothing at all', 'Many believed, some opposed, God confirmed with signs', 'They quit preaching', 'They built no testimony'],
          correctIndex: 1,
          correctFeedback: 'Correct! Belief, opposition, and God bearing witness with signs and wonders.',
          wrongFeedback: 'God confirmed the word with signs; yet persecution also arose (Acts 13–14).'
        },
        {
          question: 'What can we learn from Paul and Barnabas?',
          choices: ['Never obey the Spirit', 'Obey the Spirit and spread the gospel', 'Stay in one room always', 'Flee all trouble without witness'],
          correctIndex: 1,
          correctFeedback: 'Perfect! They went where God sent them and preached Christ boldly.',
          wrongFeedback: 'The church obeyed the Spirit — Paul and Barnabas went forth with the gospel!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — obey the Spirit!',
      takeaway: 'Obey the Holy Spirit and spread the gospel — God works through us.',
      prayer: 'God, help me obey Your Spirit and share Jesus. Amen.'
    },

    paulFirstJourney: {
      kjvRef: 'Acts 13–14',
      paragraphs: [
        'Paul and Barnabas sailed to Cyprus and preached the word in the synagogues of the Jews. They found a certain sorcerer, a false prophet, named Bar-jesus.',
        'He withstood them, seeking to turn away the deputy from the faith. Then Paul, filled with the Holy Ghost, said he was full of subtlety — "thou shalt be blind, not seeing the sun for a season." Immediately mist and darkness fell on him.',
        'When they were at Antioch in Pisidia, Paul stood up and preached Jesus — that through Him forgiveness of sins is preached, and by Him all that believe are justified.',
        'The next sabbath almost the whole city came; but the Jews stirred up devout women and the chief men, and raised persecution. Paul and Barnabas shook off the dust of their feet and came to Iconium.',
        'So they spake boldly in the Lord, which gave testimony unto the word of His grace, granting signs and wonders to be done by their hands.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul and Barnabas sailing to Cyprus, boat on sea, no text',
        'fun kid illustration: Paul confronting sorcerer Elymas Bar-jesus, darkness and blindness, no text',
        'colorful Bible scene for children: Paul preaching in synagogue Pisidian Antioch, people listening, no text',
        'exciting cartoon: dust shaken off feet, moving on to Iconium, no text',
        'hopeful ending illustration: bold preaching, signs and wonders, God’s grace, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul and Barnabas preached boldly — God confirmed with power!',
      quizHeading: 'Paul’s First Journey Questions',
      questions: [
        {
          question: 'Where did Paul and Barnabas go first on this journey?',
          choices: ['Rome', 'Cyprus', 'Jerusalem only', 'Corinth'],
          correctIndex: 1,
          correctFeedback: 'Yes! They sailed to Cyprus.',
          wrongFeedback: 'They departed unto Seleucia and from thence sailed to Cyprus (Acts 13:4).'
        },
        {
          question: 'Who opposed them in Cyprus?',
          choices: ['A king only', 'Bar-jesus the sorcerer', 'A disciple only', 'A priest who believed'],
          correctIndex: 1,
          correctFeedback: 'Right! Elymas the sorcerer — Bar-jesus — withstood them.',
          wrongFeedback: 'A certain sorcerer, a false prophet, named Bar-jesus, withstood them (Acts 13:6–8).'
        },
        {
          question: 'What happened to the sorcerer?',
          choices: ['He believed at once', 'He was blind for a season', 'He ran away laughing', 'He helped them preach'],
          correctIndex: 1,
          correctFeedback: 'Yes! Mist and darkness fell on him — blind for a season.',
          wrongFeedback: 'Paul said he should be blind — immediately mist and darkness fell on him (Acts 13:11).'
        },
        {
          question: 'What did Paul do at Antioch in Pisidia?',
          choices: ['Built a house', 'Preached Jesus in the synagogue', 'Fought soldiers', 'Left without speaking'],
          correctIndex: 1,
          correctFeedback: 'Correct! He preached Christ and forgiveness through Him.',
          wrongFeedback: 'Paul and Barnabas went into the synagogue and preached the word (Acts 13:14–16).'
        },
        {
          question: 'What can we learn from Paul’s first journey?',
          choices: ['Preach boldly — God confirms His word', 'Never travel for Christ', 'Hide from all trouble', 'Give up when opposed'],
          correctIndex: 0,
          correctFeedback: 'Perfect! Bold preaching — the Lord granted signs and wonders.',
          wrongFeedback: 'They spake boldly; the Lord gave testimony with signs and wonders (Acts 14:3).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — preach boldly!',
      takeaway: 'Preach boldly — God confirms His word with power.',
      prayer: 'God, give me courage to preach Your word. Confirm it with Your power. Amen.'
    },

    councilJerusalem: {
      kjvRef: 'Acts 15',
      paragraphs: [
        'Certain men taught the brethren, "Except ye be circumcised after the manner of Moses, ye cannot be saved." Paul and Barnabas had no small dissension with them.',
        'The church sent Paul and Barnabas to Jerusalem unto the apostles and elders about this question. When they were come, they declared all things God had done with them.',
        'Peter rose up and said God made choice that the Gentiles should hear the word and believe — and He gave them the Holy Ghost, purifying their hearts by faith. Why tempt ye God to put a yoke on their necks?',
        'James answered, agreeing with the prophets: we trouble not them which from among the Gentiles are turned to God, but write that they abstain from pollutions of idols, and fornication, and things strangled, and from blood.',
        'They wrote letters by them: "It seemed good unto the Holy Ghost, and to us, to lay upon you no greater burden" — and the brethren rejoiced for the consolation.'
      ],
      imagePrompts: [
        'bright cartoon for kids: early church leaders discussing, serious but kind faces, no text',
        'fun kid illustration: Paul and Barnabas arriving in Jerusalem, meeting apostles, no text',
        'colorful Bible scene for children: Peter speaking to the council about Gentiles and the Holy Ghost, no text',
        'exciting cartoon: James and leaders agreeing, scroll or letter, no text',
        'happy ending illustration: letter to Gentile churches, believers rejoicing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The church settled how to welcome Gentile believers!',
      quizHeading: 'Jerusalem Council Questions',
      questions: [
        {
          question: 'What were some men teaching?',
          choices: ['Gentiles must be circumcised to be saved', 'Gentiles need no God', 'Gentiles cannot believe', 'Gentiles should leave'],
          correctIndex: 0,
          correctFeedback: 'Yes! Unless circumcised after Moses, ye cannot be saved.',
          wrongFeedback: 'Certain men said, "Except ye be circumcised… ye cannot be saved" (Acts 15:1).'
        },
        {
          question: 'Who rose up first to speak at the council?',
          choices: ['Paul', 'Peter', 'James', 'Barnabas'],
          correctIndex: 1,
          correctFeedback: 'Yes! Peter testified how God gave the Holy Ghost to Gentiles.',
          wrongFeedback: 'Peter rose up and rehearsed how God chose that Gentiles should hear and believe (Acts 15:7).'
        },
        {
          question: 'What did Peter say about Gentiles?',
          choices: ['Put a yoke on their necks', 'God purified their hearts by faith', 'They must keep the whole law to be loved', 'Send them away empty'],
          correctIndex: 1,
          correctFeedback: 'Right! God gave them the Holy Ghost — hearts purified by faith.',
          wrongFeedback: 'Peter said God purified their hearts by faith — why tempt God with a yoke? (Acts 15:8–10).'
        },
        {
          question: 'What did the apostles and elders decide?',
          choices: ['Lay the whole law on Gentiles', 'Not burden them beyond a few needful things', 'Say Gentiles cannot be saved', 'Ignore Paul and Barnabas'],
          correctIndex: 1,
          correctFeedback: 'Yes! No greater burden — abstain from idols, fornication, strangled things, and blood.',
          wrongFeedback: 'James judged not to trouble them, but to write these abstentions (Acts 15:19–20).'
        },
        {
          question: 'What can we learn from the Jerusalem council?',
          choices: ['Salvation by works of the law only', 'Salvation by grace through faith in Christ', 'Never meet together', 'Turn away all nations'],
          correctIndex: 1,
          correctFeedback: 'Perfect! We are saved through the grace of the Lord Jesus Christ.',
          wrongFeedback: 'Peter and James pointed to faith and the Holy Ghost — not a yoke of bondage (Acts 15:10–11).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — saved by grace!',
      takeaway: 'Salvation is by grace through faith — not the deeds of the law.',
      prayer: 'God, thank You for salvation by grace. Help me walk worthy of the Lord. Amen.'
    },

    paulSecondJourney: {
      kjvRef: 'Acts 15:36–18:22',
      paragraphs: [
        'Paul said unto Barnabas, "Let us go again and visit our brethren." They parted: Barnabas took Mark; Paul chose Silas and went through Syria and Cilicia, confirming the churches.',
        'At Philippi, a damsel possessed with a spirit of divination followed them many days. Paul, grieved, commanded the spirit to come out in the name of Jesus — her masters caught Paul and Silas and thrust them into the inner prison.',
        'At midnight Paul and Silas prayed, and sang praises unto God — the prisoners heard them. Suddenly there was a great earthquake; the foundations shook, doors opened, and every one’s bands were loosed.',
        'The keeper awaking saw the doors open — he drew his sword. Paul cried, "Do thyself no harm — we are all here." He said, "Sirs, what must I do to be saved?" They said, "Believe on the Lord Jesus Christ, and thou shalt be saved, and thy house."',
        'He washed their stripes; he was baptized, he and all his, straightway. Paul afterward passed through Thessalonica, Berea, Athens, and Corinth, preaching Jesus Christ.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul with Silas, Barnabas with Mark, parting ways kindly, no text',
        'fun kid illustration: Paul casting spirit out of slave girl at Philippi, no text',
        'colorful Bible scene for children: Paul and Silas in stocks singing at midnight, earthquake light, no text',
        'exciting cartoon: jailer asking what must I do to be saved, Paul answering, no text',
        'happy ending illustration: Paul preaching in Corinth, churches growing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul and Silas sang in prison — God shook the doors open!',
      quizHeading: 'Paul’s Second Journey Questions',
      questions: [
        {
          question: 'Whom did Paul take after he and Barnabas parted?',
          choices: ['Barnabas', 'Silas', 'John Mark', 'Peter'],
          correctIndex: 1,
          correctFeedback: 'Yes! Paul chose Silas and went, being recommended by the brethren.',
          wrongFeedback: 'Paul took Silas; Barnabas took Mark (Acts 15:37–40).'
        },
        {
          question: 'What happened to Paul and Silas at Philippi?',
          choices: ['They were honoured only', 'Cast into prison after the spirit came out of the damsel', 'They built a palace', 'They sailed away at once'],
          correctIndex: 1,
          correctFeedback: 'Right! Beaten and thrust into the inner prison.',
          wrongFeedback: 'Her masters caught them and brought them to the magistrates — they were beaten and imprisoned (Acts 16:16–24).'
        },
        {
          question: 'What did Paul and Silas do at midnight?',
          choices: ['Slept silently', 'Prayed and sang praises unto God', 'Escaped by themselves', 'Wept without hope'],
          correctIndex: 1,
          correctFeedback: 'Yes! They prayed and sang — the prisoners heard them.',
          wrongFeedback: 'At midnight Paul and Silas prayed, and sang praises unto God (Acts 16:25).'
        },
        {
          question: 'What did the keeper of the prison ask?',
          choices: ['How to break the wall', 'Sirs, what must I do to be saved?', 'Give me silver', 'Who are ye?'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Believe on the Lord Jesus Christ, and thou shalt be saved."',
          wrongFeedback: 'He asked what he must do to be saved; they pointed him to Christ (Acts 16:30–31).'
        },
        {
          question: 'What can we learn from Paul’s second journey?',
          choices: ['Never praise God in pain', 'God hears prayer and praise — He opens doors', 'Sing only when happy', 'Avoid every hard place'],
          correctIndex: 1,
          correctFeedback: 'Perfect! In the dungeon they worshipped — God sent an earthquake and saved the jailer.',
          wrongFeedback: 'Their prayer and praise shook the prison — God still hears His children!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — praise God in hard times!',
      takeaway: 'Praise God in hard times — He delivers and saves.',
      prayer: 'God, help me praise You even in hard times. Thank You for deliverance. Amen.'
    },

    paulThirdJourney: {
      kjvRef: 'Acts 18:23–21:17',
      paragraphs: [
        'Paul began his third journey, strengthening the disciples in Galatia and Phrygia.',
        'He spent over two years in Ephesus, teaching daily in the hall of Tyrannus. All Asia heard the word of the Lord.',
        'God wrought special miracles by the hands of Paul — even handkerchiefs or aprons from him healed the sick and cast out evil spirits.',
        'Demetrius the silversmith stirred a riot because people turned from idols. The city was filled with confusion.',
        'Paul encouraged the churches in Macedonia and Greece, then returned to Troas and on to Jerusalem.'
      ],
      imagePrompts: [
        'bright bouncy cartoon for kids: Paul traveling to strengthen disciples in Galatia, map background, no text',
        'fun kid illustration: Paul teaching in Ephesus hall for two years, people listening, no text',
        'colorful Bible scene for children: handkerchiefs and aprons healing sick, God’s power through Paul, no text',
        'exciting cartoon: riot in Ephesus, silversmiths angry about idols, Paul calm, no text',
        'happy ending illustration: Paul in Macedonia and Greece, encouraging churches, joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul’s third journey — God did special miracles!',
      quizHeading: 'Paul’s Third Journey Questions',
      questions: [
        {
          question: 'Where did Paul spend over two years?',
          choices: ['Jerusalem', 'Ephesus', 'Rome', 'Athens'],
          correctIndex: 1,
          correctFeedback: 'Yes! In Ephesus — teaching daily and miracles.',
          wrongFeedback: 'Not Jerusalem or Rome. Paul stayed in Ephesus over two years (Acts 19:10).'
        },
        {
          question: 'What unusual miracles happened through Paul?',
          choices: ['Handkerchiefs and aprons healed people', 'Water turned to wine', 'Bread multiplied', 'Blind eyes opened'],
          correctIndex: 0,
          correctFeedback: 'Right! Even items touched by Paul healed the sick and cast out spirits.',
          wrongFeedback: 'Not wine or bread. God wrought special miracles so handkerchiefs and aprons healed (Acts 19:11–12).'
        },
        {
          question: 'Why did a riot start in Ephesus?',
          choices: ['Paul was too quiet', 'Silversmiths feared losing idol business', 'People loved Paul too much', 'Weather was bad'],
          correctIndex: 1,
          correctFeedback: 'Yes! Silversmiths were angry about lost business.',
          wrongFeedback: 'Not quiet or weather. Demetrius the silversmith stirred a riot (Acts 19:23–27).'
        },
        {
          question: 'Where did Paul go after Ephesus?',
          choices: ['Back home', 'Macedonia, Greece, and Troas', 'Egypt', 'Rome early'],
          correctIndex: 1,
          correctFeedback: 'Correct! To Macedonia, Greece, and Troas — encouraging churches.',
          wrongFeedback: 'Not home or Egypt. Paul went to Macedonia and Greece (Acts 20:1–6).'
        },
        {
          question: 'What can we learn from Paul’s third journey?',
          choices: ['Preaching is easy', 'God does miracles and protects when we obey', 'Never travel', 'Stop teaching'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God worked powerfully and protected Paul.',
          wrongFeedback: 'Paul obeyed and preached — God confirmed with miracles and protection!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God works powerfully!',
      takeaway: 'God does miracles and protects when we obey and preach.',
      prayer: 'God, thank You for Your power. Help me obey and share Your word. Amen.'
    },

    paulEphesus: {
      kjvRef: 'Acts 19',
      paragraphs: [
        'Paul arrived in Ephesus. He baptized disciples in Jesus’ name and laid hands — they received the Holy Spirit and spoke with tongues.',
        'Paul taught in the synagogue for three months. Some hardened their hearts, so he moved to the hall of Tyrannus for two years.',
        'God wrought special miracles by Paul’s hands — handkerchiefs and aprons touched by him healed the sick and cast out evil spirits.',
        'Some Jewish exorcists tried to use Jesus’ name but failed. The evil spirit said, "Jesus I know, Paul I know, but who are ye?"',
        'Many believed. They burned sorcery books worth fifty thousand pieces of silver. The word of the Lord grew mightily.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul in Ephesus baptizing disciples, Holy Spirit coming, no text',
        'fun kid illustration: Paul teaching in hall of Tyrannus, people listening, no text',
        'colorful Bible scene for children: handkerchiefs healing sick, miracles through Paul, no text',
        'exciting cartoon: evil spirit overpowering Jewish exorcists, "Jesus I know, Paul I know", no text',
        'happy ending illustration: people burning sorcery books, gospel spreading, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God worked special miracles in Ephesus!',
      quizHeading: 'Paul in Ephesus Questions',
      questions: [
        {
          question: 'What happened when Paul laid hands on disciples?',
          choices: ['They left', 'They received the Holy Spirit and spoke with tongues', 'They argued', 'They slept'],
          correctIndex: 1,
          correctFeedback: 'Yes! They received the Holy Spirit and spoke in tongues.',
          wrongFeedback: 'Not leave or argue. Paul baptized them and laid hands — Holy Spirit came (Acts 19:6).'
        },
        {
          question: 'Where did Paul teach after the synagogue?',
          choices: ['In a palace', 'In the hall of Tyrannus for two years', 'Outside the city', 'At home'],
          correctIndex: 1,
          correctFeedback: 'Right! The hall of Tyrannus — daily for two years.',
          wrongFeedback: 'Not palace or home. Paul taught daily in the hall of Tyrannus (Acts 19:9–10).'
        },
        {
          question: 'What special miracles happened?',
          choices: ['Handkerchiefs and aprons healed people', 'Water turned to wine', 'Bread multiplied', 'Blind eyes opened'],
          correctIndex: 0,
          correctFeedback: 'Yes! Items touched by Paul healed and cast out spirits.',
          wrongFeedback: 'Not wine or bread. God wrought special miracles so handkerchiefs and aprons healed (Acts 19:11–12).'
        },
        {
          question: 'What did the evil spirit say to Jewish exorcists?',
          choices: ['Welcome', 'Jesus I know, Paul I know, but who are ye?', 'Help me', 'Leave now'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Jesus I know, Paul I know, but who are ye?"',
          wrongFeedback: 'The spirit answered "Jesus I know, Paul I know, but who are ye?" and attacked them (Acts 19:15–16).'
        },
        {
          question: 'What can we learn from Paul in Ephesus?',
          choices: ['Sorcery is good', 'God’s power defeats evil', 'Never preach', 'Burn books'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God’s power defeats evil and spreads the gospel.',
          wrongFeedback: 'Many believed and burned sorcery books worth fifty thousand pieces of silver — the word grew mightily!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God’s power defeats evil!',
      takeaway: 'God’s power defeats evil and spreads the gospel.',
      prayer: 'God, thank You for Your power. Help me spread Your word. Amen.'
    },

    paulEutychus: {
      kjvRef: 'Acts 20:7–12',
      paragraphs: [
        'Paul was in Troas preaching late into the night. A young man named Eutychus sat in a window.',
        'Paul preached long — Eutychus fell asleep, fell from the third story, and was taken up dead.',
        'Paul went down, embraced him, and said, "Do not be alarmed — his life is in him."',
        'Eutychus was alive! Paul continued preaching until dawn.',
        'The people were greatly comforted and praised God.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul preaching late at night in Troas, people listening, Eutychus in window, no text',
        'fun kid illustration: Eutychus falling asleep, falling from third story window, no text',
        'colorful Bible scene for children: Paul embracing Eutychus, saying "His life is in him", no text',
        'exciting cartoon: Eutychus alive again, people amazed, no text',
        'happy ending illustration: Paul preaching until dawn, people comforted, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul raised Eutychus from the dead — God’s power!',
      quizHeading: 'Paul Raises Eutychus Questions',
      questions: [
        {
          question: 'Where was Paul preaching late at night?',
          choices: ['Jerusalem', 'Troas', 'Rome', 'Ephesus'],
          correctIndex: 1,
          correctFeedback: 'Yes! In Troas — preaching long.',
          wrongFeedback: 'Not Jerusalem or Ephesus. Paul preached in Troas until midnight (Acts 20:7).'
        },
        {
          question: 'What happened to Eutychus?',
          choices: ['He left early', 'He fell asleep, fell from window, and died', 'He sang', 'He prayed'],
          correctIndex: 1,
          correctFeedback: 'Right! He fell from the third story and was taken up dead.',
          wrongFeedback: 'He fell asleep in the window and fell — died (Acts 20:9).'
        },
        {
          question: 'What did Paul do?',
          choices: ['Ignored him', 'Embraced him and said "His life is in him"', 'Called a doctor', 'Left'],
          correctIndex: 1,
          correctFeedback: 'Yes! Paul embraced him — "Do not be alarmed, his life is in him."',
          wrongFeedback: 'Not ignore or doctor. Paul went down, embraced him, and said his life was in him (Acts 20:10).'
        },
        {
          question: 'What happened after Paul embraced him?',
          choices: ['Nothing', 'Eutychus was alive', 'Paul cried', 'The meeting ended'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Eutychus was alive — Paul continued preaching!',
          wrongFeedback: 'Not nothing. Eutychus was raised — they were greatly comforted (Acts 20:12).'
        },
        {
          question: 'What can we learn from Eutychus?',
          choices: ['Never listen to long preaching', 'God has power over death', 'Sleep in windows', 'Stop preaching'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God has power over death — Paul raised him.',
          wrongFeedback: 'The miracle shows God’s power through Paul — life restored!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God has power over death!',
      takeaway: 'God has power over death — trust Him.',
      prayer: 'God, thank You for Your power over death. Help me trust You. Amen.'
    },

    paulShipwreck: {
      kjvRef: 'Acts 27–28',
      paragraphs: [
        'Paul was a prisoner on a ship to Rome. A violent storm hit — the ship was driven helplessly.',
        'The sailors feared they would die. Paul said, "An angel told me no one will be lost — only the ship."',
        'After 14 days, they saw land. The ship ran aground on Malta. All 276 people reached shore safely.',
        'On Malta, Paul gathered sticks for a fire. A viper bit him — he shook it off and was unharmed.',
        'The islanders thought he was a god. Paul healed many sick — God protected him.'
      ],
      imagePrompts: [
        'bright cartoon for kids: ship in violent storm, waves crashing, Paul on board, no text',
        'fun kid illustration: Paul encouraging sailors, "No one will be lost", angel message, no text',
        'colorful Bible scene for children: ship running aground on Malta, people safe on shore, no text',
        'exciting cartoon: Paul gathering sticks, viper biting him, shaking it off unharmed, no text',
        'happy ending illustration: Paul healing sick on Malta, islanders amazed, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God protected Paul and all 276 on the ship!',
      quizHeading: 'Paul’s Shipwreck Questions',
      questions: [
        {
          question: 'What happened to the ship Paul was on?',
          choices: ['Sailed smoothly', 'Hit by violent storm', 'Sank immediately', 'Turned back'],
          correctIndex: 1,
          correctFeedback: 'Yes! A violent storm drove it helplessly.',
          wrongFeedback: 'Not smooth or turn back. A tempest hit (Acts 27:14–20).'
        },
        {
          question: 'What did Paul say during the storm?',
          choices: ['We will all die', 'An angel said no one will be lost', 'Jump overboard', 'Pray harder'],
          correctIndex: 1,
          correctFeedback: 'Right! "An angel told me no one will be lost — only the ship."',
          wrongFeedback: 'Not die. Paul encouraged "No one will be lost" — angel message (Acts 27:23–24).'
        },
        {
          question: 'How many people were on the ship?',
          choices: ['76', '276', '500', '1000'],
          correctIndex: 1,
          correctFeedback: 'Yes! 276 souls — all safe.',
          wrongFeedback: 'Not 76. "All 276 persons on board" reached shore safely (Acts 27:37, 44).'
        },
        {
          question: 'What happened when Paul gathered sticks on Malta?',
          choices: ['Nothing', 'Viper bit him — he shook it off unharmed', 'He burned the sticks', 'He left'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Viper bit him — he shook it off, no harm.',
          wrongFeedback: 'A viper fastened on his hand — he shook it into fire, unharmed (Acts 28:3–5).'
        },
        {
          question: 'What can we learn from Paul’s shipwreck?',
          choices: ['God doesn’t protect', 'God protects His people in danger', 'Never sail', 'Fear storms'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God protected all 276 — His plan prevailed.',
          wrongFeedback: 'God kept His promise — no one lost, even in shipwreck!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God protects in danger!',
      takeaway: 'God protects His people in danger — trust His promises.',
      prayer: 'God, thank You for protection. Help me trust You in storms. Amen.'
    },

    paulRome: {
      kjvRef: 'Acts 28',
      paragraphs: [
        'Paul arrived in Rome as a prisoner. He was allowed to live in his own house with a guard.',
        'Paul called Jewish leaders. He explained he was bound for the hope of Israel — Jesus.',
        'Some believed, some did not. Paul quoted Isaiah: "They have closed their eyes."',
        'Paul said, "This salvation of God has been sent to the Gentiles — they will listen."',
        'Paul preached boldly in Rome for two years, teaching about Jesus and the kingdom.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul arriving in Rome as prisoner, chain to guard, house, no text',
        'fun kid illustration: Paul speaking to Jewish leaders in Rome, explaining Jesus, no text',
        'colorful Bible scene for children: Paul quoting Isaiah, some believing, some not, no text',
        'exciting cartoon: Paul saying salvation sent to Gentiles, people listening, no text',
        'happy ending illustration: Paul preaching boldly for two years, kingdom message, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul preached boldly in Rome — even as a prisoner!',
      quizHeading: 'Paul in Rome Questions',
      questions: [
        {
          question: 'How did Paul live in Rome?',
          choices: ['In prison cell', 'In his own house with a guard', 'In the palace', 'On the street'],
          correctIndex: 1,
          correctFeedback: 'Yes! In his own house with a soldier guard.',
          wrongFeedback: 'Not cell or palace. Paul was allowed to live by himself with a soldier (Acts 28:16).'
        },
        {
          question: 'Who did Paul call first in Rome?',
          choices: ['Romans', 'Jewish leaders', 'Gentiles', 'Soldiers'],
          correctIndex: 1,
          correctFeedback: 'Right! Jewish leaders — to explain his chains.',
          wrongFeedback: 'Not Romans or Gentiles first. Paul called Jewish leaders (Acts 28:17).'
        },
        {
          question: 'What did Paul explain to them?',
          choices: ['He was guilty', 'He was bound for the hope of Israel — Jesus', 'He wanted money', 'He was leaving'],
          correctIndex: 1,
          correctFeedback: 'Yes! Bound for the hope of Israel — Jesus.',
          wrongFeedback: 'Not guilty. Paul said "I am bound with this chain because of the hope of Israel" (Acts 28:20).'
        },
        {
          question: 'What did Paul say about the Gentiles?',
          choices: ['They will not listen', 'Salvation sent to Gentiles — they will listen', 'Gentiles are bad', 'Forget Gentiles'],
          correctIndex: 1,
          correctFeedback: 'Exactly! "This salvation of God has been sent to the Gentiles — they will listen."',
          wrongFeedback: 'Paul quoted Isaiah then said Gentiles would listen (Acts 28:28).'
        },
        {
          question: 'What can we learn from Paul in Rome?',
          choices: ['Stop preaching when in chains', 'Preach boldly even in chains', 'Never go to Rome', 'Give up hope'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Paul preached boldly for two years in chains.',
          wrongFeedback: 'Paul welcomed all who came — preaching the kingdom boldly!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — preach boldly in chains!',
      takeaway: 'Preach boldly even in hard situations — God uses us.',
      prayer: 'God, give me boldness to preach even in hard times. Amen.'
    },

    paulLetters: {
      kjvRef: 'Romans–Philemon',
      paragraphs: [
        'Paul wrote letters to churches and brethren — holy scripture for our learning. In Romans he preached the gospel: the righteousness of God revealed from faith to faith.',
        'To Corinth he wrote of charity: charity suffereth long, and is kind; envieth not; vaunteth not itself — the body is one, yet many members.',
        'To the Galatians he cried, Stand fast in the liberty wherewith Christ hath made us free. To Ephesians he taught one body, one Spirit, one hope of your calling.',
        'Philippians rings with joy: Rejoice in the Lord alway. Colossians lifts up Christ as head of all principality and power — beware philosophy that spoils.',
        'All these epistles are God-breathed truth — they teach us to live unto Christ today.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul writing letters, scroll and reed pen, churches in mind, no text',
        'fun kid illustration: charity patient and kind, gentle heart shapes, no text',
        'colorful Bible scene for children: many believers one body, unity, no text',
        'exciting cartoon: rejoice in the Lord always, joyful faithful face, no text',
        'happy ending illustration: congregations reading letters, learning together, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul wrote letters to help churches live for Jesus!',
      quizHeading: 'Paul’s Letters Questions',
      questions: [
        {
          question: 'What does Romans especially teach?',
          choices: ['Only food laws', 'The gospel — righteousness by faith', 'How to build houses', 'Genealogies only'],
          correctIndex: 1,
          correctFeedback: 'Yes! The gospel is the power of God unto salvation — from faith to faith.',
          wrongFeedback: 'Romans declares the righteousness of God revealed from faith to faith (Romans 1:16–17).'
        },
        {
          question: 'How does Paul describe charity in 1 Corinthians 13?',
          choices: ['Quick to anger', 'Suffereth long, and is kind', 'Seeketh her own only', 'Endeth quickly'],
          correctIndex: 1,
          correctFeedback: 'Right! Charity suffereth long, and is kind; envieth not.',
          wrongFeedback: 'Charity suffereth long, and is kind; envieth not; vaunteth not itself (1 Corinthians 13:4).'
        },
        {
          question: 'What did Paul urge the Galatians?',
          choices: ['Return to bondage', 'Stand fast in the liberty wherewith Christ made them free', 'Hide the gospel', 'Trust in circumcision only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Stand fast — be not entangled again with the yoke of bondage.',
          wrongFeedback: 'Stand fast therefore in the liberty wherewith Christ hath made us free (Galatians 5:1).'
        },
        {
          question: 'What does Philippians often call us to?',
          choices: ['Fear always', 'Rejoice in the Lord alway', 'Stay silent', 'Forget prayer'],
          correctIndex: 1,
          correctFeedback: 'Yes! Rejoice in the Lord alway — and again I say, Rejoice.',
          wrongFeedback: 'Rejoice in the Lord alway: and again I say, Rejoice (Philippians 4:4).'
        },
        {
          question: 'What can we learn from Paul’s letters?',
          choices: ['Ignore Scripture', 'They are God’s Word — live for Jesus', 'Never read epistles', 'Forget the church'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Paul’s writings are part of holy Scripture for doctrine and instruction.',
          wrongFeedback: 'All scripture is profitable — Paul’s letters teach faith, love, unity, and joy in Christ!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — live for Jesus!',
      takeaway: 'Paul’s letters help us live for Jesus — they are God’s Word.',
      prayer: 'God, thank You for Paul’s letters. Help me live for Jesus. Amen.'
    },

    paulPrisonEpistles: {
      kjvRef: 'Ephesians, Philippians, Colossians, Philemon',
      paragraphs: [
        'Paul wrote Ephesians, Philippians, Colossians, and Philemon as a prisoner of Jesus Christ — chains did not silence the gospel.',
        'In Ephesians he taught one body, one Spirit, one hope, one Lord, one faith, one baptism, one God and Father of all.',
        'Philippians shines with joy from bonds: Rejoice in the Lord alway — Christ is preached while Paul is set for the defence of the gospel.',
        'Colossians exalts Christ: He is before all things, and by Him all things consist — beware being spoiled through philosophy.',
        'Philemon beseeched love for Onesimus — no longer a servant, but a brother beloved — receive him as thyself.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul in bonds writing letters, gentle light, no text',
        'fun kid illustration: one body many members, unity, one Spirit, no text',
        'colorful Bible scene for children: Paul rejoicing though in prison, no text',
        'exciting cartoon: Christ supreme, all things by Him, no text',
        'happy ending illustration: forgiveness, brother welcomed home in love, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul wrote joyful, faithful letters even from prison!',
      quizHeading: 'Paul’s Prison Epistles Questions',
      questions: [
        {
          question: 'Which books are often called Paul’s prison epistles?',
          choices: ['Romans and Hebrews', 'Ephesians, Philippians, Colossians, Philemon', 'Genesis and Exodus', 'Matthew and Mark'],
          correctIndex: 1,
          correctFeedback: 'Yes! Written while Paul was a prisoner for Christ.',
          wrongFeedback: 'Paul was a prisoner when he wrote Ephesians, Philippians, Colossians, and Philemon (Ephesians 3:1; Philippians 1:13).'
        },
        {
          question: 'What did Ephesians stress about the church?',
          choices: ['Many divisions', 'One body, one Spirit, one hope', 'No hope', 'No love'],
          correctIndex: 1,
          correctFeedback: 'Right! One body, one Spirit, one hope of your calling.',
          wrongFeedback: 'There is one body, and one Spirit… one hope of your calling (Ephesians 4:4).'
        },
        {
          question: 'What spirit fills Philippians?',
          choices: ['Despair', 'Joy — "Rejoice in the Lord alway"', 'Bitterness', 'Pride only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Rejoice in the Lord alway — and again I say, Rejoice.',
          wrongFeedback: 'Rejoice in the Lord alway — Paul wrote from bonds (Philippians 1:13; 4:4).'
        },
        {
          question: 'What does Colossians say about Christ?',
          choices: ['He is least', 'He is before all things — all things consist in Him', 'He is not God', 'He is hidden'],
          correctIndex: 1,
          correctFeedback: 'Exactly! He is before all things, and by Him all things consist.',
          wrongFeedback: 'He is before all things, and by him all things consist (Colossians 1:17).'
        },
        {
          question: 'What can we learn from these prison letters?',
          choices: ['Joy only when free', 'Joy, unity, and truth even in suffering', 'Stop writing', 'Give up hope'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Christ was magnified in Paul’s bonds — we can trust God in trouble too.',
          wrongFeedback: 'Paul’s prison epistles teach joy in the Lord and sound doctrine — God strengthens His own!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — joy in chains!',
      takeaway: 'Joy and unity even in hard times — God gives strength.',
      prayer: 'God, thank You for joy in hard times. Help me stay united in Christ. Amen.'
    },

    paulEndurance: {
      kjvRef: '2 Timothy 4:6–8',
      paragraphs: [
        'Paul wrote to Timothy near the end: For I am now ready to be offered, and the time of my departure is at hand.',
        'I have fought a good fight, I have finished my course, I have kept the faith.',
        'Henceforth there is laid up for me a crown of righteousness, which the Lord, the righteous judge, shall give me at that day: and not to me only, but unto all them also that love his appearing.',
        'Paul had endured afflictions, persecutions, sufferings — all for the elect’s sake, that they might obtain salvation.',
        'His finish line calls every believer: hold fast, preach the word, look for Christ’s appearing.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul aged, writing to Timothy, faithful face, no text',
        'fun kid illustration: fought a good fight, finished course, kept the faith, no text',
        'colorful Bible scene for children: crown of righteousness, looking to Christ, no text',
        'exciting cartoon: Paul steadfast through hardship for the gospel, no text',
        'happy ending illustration: faithful servant welcomed home, peace, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul finished strong — "I have kept the faith!"',
      quizHeading: 'Paul’s Endurance Questions',
      questions: [
        {
          question: 'What did Paul say he had done?',
          choices: ['Given up', 'Fought a good fight, finished his course, kept the faith', 'Forgotten Christ', 'Run away'],
          correctIndex: 1,
          correctFeedback: 'Yes! I have fought a good fight, I have finished my course, I have kept the faith.',
          wrongFeedback: 'I have fought a good fight, I have finished my course, I have kept the faith (2 Timothy 4:7).'
        },
        {
          question: 'How did Paul describe his life nearing the end?',
          choices: ['A waste', 'Ready to be offered — his departure at hand', 'Easy and soft', 'Full of silver only'],
          correctIndex: 1,
          correctFeedback: 'Right! Ready to be offered — the time of departure at hand.',
          wrongFeedback: 'For I am now ready to be offered, and the time of my departure is at hand (2 Timothy 4:6).'
        },
        {
          question: 'What did Paul look for from the Lord?',
          choices: ['Nothing', 'A crown of righteousness', 'More chains only', 'Earthly crown only'],
          correctIndex: 1,
          correctFeedback: 'Yes! A crown of righteousness the righteous Judge shall give.',
          wrongFeedback: 'Henceforth there is laid up for me a crown of righteousness (2 Timothy 4:8).'
        },
        {
          question: 'Who else shares that hope?',
          choices: ['Paul alone', 'All them that love his appearing', 'Only kings', 'No one else'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Not to me only, but unto all that love his appearing.',
          wrongFeedback: 'And not to me only, but unto all them also that love his appearing (2 Timothy 4:8).'
        },
        {
          question: 'What can we learn from Paul’s endurance?',
          choices: ['Quit when it hurts', 'Finish the course — keep the faith', 'Avoid all suffering', 'Forget Jesus'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Endure hardness as a good soldier of Jesus Christ.',
          wrongFeedback: 'Paul finished his course — we too can keep faith in Christ to the end!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — finish the race!',
      takeaway: 'Finish the race — keep the faith and look forward to Jesus’ return.',
      prayer: 'God, help me finish my course strong. Thank You for Paul’s example. Amen.'
    },

    johnPatmos: {
      kjvRef: 'Revelation 1',
      paragraphs: [
        'I John… was in the isle that is called Patmos, for the word of God, and for the testimony of Jesus Christ. I was in the Spirit on the Lord’s day.',
        'I heard behind me a great voice, as of a trumpet, saying, I am Alpha and Omega, the first and the last.',
        'John turned and saw one like unto the Son of man — hair white as wool, eyes as a flame of fire, feet like fine brass, voice as the sound of many waters.',
        'He laid his right hand on John: Fear not; I am the first and the last: I am he that liveth, and was dead; and, behold, I am alive for evermore, Amen.',
        'Write therefore the things thou hast seen — the things which are, and shall be hereafter — unto the seven churches.'
      ],
      imagePrompts: [
        'bright cartoon for kids: John on rocky Patmos isle, Lord’s day, Spirit, no text',
        'fun kid illustration: voice great as trumpet, John turning, no text',
        'colorful Bible scene for children: Son of man glorious, white hair, eyes like fire, feet like brass, no text',
        'exciting cartoon: Fear not — I am alive for evermore, comforting hand, no text',
        'hopeful ending illustration: John writing, seven churches, scroll, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'John saw Jesus glorified on Patmos!',
      quizHeading: 'John on Patmos Questions',
      questions: [
        {
          question: 'Where was John when he received the vision?',
          choices: ['Jerusalem', 'The isle called Patmos', 'Rome only', 'Ephesus marketplace'],
          correctIndex: 1,
          correctFeedback: 'Yes! Patmos — for the word of God and testimony of Jesus.',
          wrongFeedback: 'I was in the isle that is called Patmos (Revelation 1:9).'
        },
        {
          question: 'What did John hear at first?',
          choices: ['A whisper', 'A great voice, as of a trumpet', 'Silence only', 'Birdsong only'],
          correctIndex: 1,
          correctFeedback: 'Right! A great voice, as of a trumpet.',
          wrongFeedback: 'I heard behind me a great voice, as of a trumpet (Revelation 1:10).'
        },
        {
          question: 'How did the Lord describe Himself?',
          choices: ['Alpha and Omega, the first and the last', 'A mere teacher', 'Only a king of earth', 'Absent'],
          correctIndex: 0,
          correctFeedback: 'Yes! Alpha and Omega — the first and the last.',
          wrongFeedback: 'I am Alpha and Omega, the first and the last (Revelation 1:8, 11).'
        },
        {
          question: 'What did Jesus tell John?',
          choices: ['Fear greatly', 'Fear not — I am alive for evermore', 'Flee the island', 'Hide thy face always'],
          correctIndex: 1,
          correctFeedback: 'Yes! Fear not… I am he that liveth, and was dead… alive for evermore.',
          wrongFeedback: 'Fear not; I am the first and the last… I am alive for evermore (Revelation 1:17–18).'
        },
        {
          question: 'What can we learn from John on Patmos?',
          choices: ['Christ is dead', 'Jesus lives forever — He is coming again', 'God has no word for the church', 'Visions do not matter'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The Living One was dead and is alive — He shows His churches the path.',
          wrongFeedback: 'John saw the risen, glorified Christ — faithful unto death receives the crown of life!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is alive forever!',
      takeaway: 'Jesus is alive forever — He is coming again.',
      prayer: 'Jesus, thank You for being alive forever. Come soon! Amen.'
    },

    revelationNewHeaven: {
      kjvRef: 'Revelation 21–22',
      paragraphs: [
        'John saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea.',
        'He heard a great voice out of heaven: Behold, the tabernacle of God is with men, and he will dwell with them… God shall wipe away all tears… there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain.',
        'He that sat upon the throne said, Behold, I make all things new. The holy city, new Jerusalem, descended out of heaven from God, prepared as a bride adorned for her husband.',
        'The city had no need of the sun, neither of the moon, to shine in it: for the glory of God did lighten it, and the Lamb is the light thereof.',
        'The river of life proceeded out of the throne of God and of the Lamb; the tree of life bore twelve manner of fruits. He that testifieth saith, Surely I come quickly. Amen.'
      ],
      imagePrompts: [
        'bright cartoon for kids: new heaven and new earth, old passed away, no text',
        'fun kid illustration: God wiping tears, no more death or pain, no text',
        'colorful Bible scene for children: New Jerusalem coming down, bride adorned, no text',
        'exciting cartoon: river of life, tree of life, healing leaves, no text',
        'happy ending illustration: throne, Lamb, surely I come quickly, joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God will make all things new — no more tears!',
      quizHeading: 'New Heaven & New Earth Questions',
      questions: [
        {
          question: 'What did John see?',
          choices: ['Only the old earth', 'A new heaven and a new earth', 'An empty sky', 'Nothing'],
          correctIndex: 1,
          correctFeedback: 'Yes! A new heaven and a new earth — the first passed away.',
          wrongFeedback: 'I saw a new heaven and a new earth: for the first heaven and the first earth were passed away (Revelation 21:1).'
        },
        {
          question: 'What did He that sat on the throne say?',
          choices: ['All stays broken', 'Behold, I make all things new', 'Turn back', 'Fear only'],
          correctIndex: 1,
          correctFeedback: 'Right! Behold, I make all things new.',
          wrongFeedback: 'And he that sat upon the throne said, Behold, I make all things new (Revelation 21:5).'
        },
        {
          question: 'What will be gone for God’s people there?',
          choices: ['Joy and light', 'Death, sorrow, crying, and pain', 'God’s presence', 'The Lamb'],
          correctIndex: 1,
          correctFeedback: 'Yes! No more death, sorrow, crying, or pain.',
          wrongFeedback: 'There shall be no more death, neither sorrow, nor crying, neither shall there be any more pain (Revelation 21:4).'
        },
        {
          question: 'What lights the holy city?',
          choices: ['Sun and moon only', 'The glory of God and the Lamb', 'Torches only', 'Stars only'],
          correctIndex: 1,
          correctFeedback: 'Yes! The glory of God lightens it — the Lamb is the light thereof.',
          wrongFeedback: 'The city had no need of the sun… for the glory of God did lighten it, and the Lamb is the light thereof (Revelation 21:23).'
        },
        {
          question: 'What can we learn from the new heaven and earth?',
          choices: ['Hope is vain', 'God will make all things new — trust His promise', 'Pain lasts forever', 'Never look up'],
          correctIndex: 1,
          correctFeedback: 'Perfect! He that sat upon the throne makes all things new — come, Lord Jesus!',
          wrongFeedback: 'Revelation ends with sure hope — God dwells with His people and renews all things!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God makes all things new!',
      takeaway: 'God will make all things new — no more pain or tears.',
      prayer: 'God, thank You for the promise of new heaven and earth. Come soon! Amen.'
    },

    jesusGreatCommission: {
      kjvRef: 'Matthew 28:16–20; Mark 16:15–18',
      paragraphs: [
        'The eleven disciples went into Galilee, unto a mountain where Jesus had appointed them. When they saw Him, they worshipped Him.',
        'Jesus came and spake unto them, saying, All power is given unto me in heaven and in earth.',
        'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost: teaching them to observe all things whatsoever I have commanded you.',
        'He promised, Lo, I am with you alway, even unto the end of the world.',
        'Mark records: Go ye into all the world, and preach the gospel to every creature — signs followed them that believed, for the Lord worked with them.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus on a mountain in Galilee, disciples worshipping, no text',
        'fun kid illustration: Jesus teaching all power in heaven and earth is given unto Me, no text',
        'colorful Bible scene for children: go teach all nations, baptize, teach to observe His commands, no text',
        'exciting cartoon: disciples going out, baptizing, teaching, no text',
        'happy ending illustration: Jesus promise I am with you alway, comforting presence, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus’ last charge — teach all nations — He is with us!',
      quizHeading: 'Great Commission Questions',
      questions: [
        {
          question: 'Where did Jesus meet the disciples to give this charge?',
          choices: ['Jerusalem wall', 'A mountain in Galilee where He appointed them', 'Only in the temple', 'By the sea of Tiberias only'],
          correctIndex: 1,
          correctFeedback: 'Yes! They went into Galilee unto the mountain Jesus had appointed.',
          wrongFeedback: 'The eleven went into Galilee unto a mountain where Jesus had appointed them (Matthew 28:16).'
        },
        {
          question: 'What did Jesus say was given unto Him?',
          choices: ['Little power', 'All power in heaven and in earth', 'Power over Rome only', 'No authority'],
          correctIndex: 1,
          correctFeedback: 'Right! All power in heaven and in earth.',
          wrongFeedback: 'All power is given unto me in heaven and in earth (Matthew 28:18).'
        },
        {
          question: 'What did Jesus command?',
          choices: ['Stay hidden', 'Go, teach all nations, baptize, teach to observe His commands', 'Build great towers', 'Fight with swords'],
          correctIndex: 1,
          correctFeedback: 'Yes! Go ye therefore, and teach all nations… baptizing… teaching them to observe all things.',
          wrongFeedback: 'Go ye therefore, and teach all nations, baptizing them… (Matthew 28:19).'
        },
        {
          question: 'What promise did Jesus give?',
          choices: ['I leave you alone', 'I am with you alway, even unto the end of the world', 'You will fail', 'Return never'],
          correctIndex: 1,
          correctFeedback: 'Exactly! Lo, I am with you alway, even unto the end of the world.',
          wrongFeedback: 'I am with you alway, even unto the end of the world (Matthew 28:20).'
        },
        {
          question: 'What can we learn from the Great Commission?',
          choices: ['Hide the gospel', 'Go and make disciples — Jesus is with His church', 'Never baptize', 'Forget teaching'],
          correctIndex: 1,
          correctFeedback: 'Perfect! We go in His authority — He is with us always.',
          wrongFeedback: 'Jesus sends His people to teach and baptize — and walks with them to the world’s end!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — go make disciples!',
      takeaway: 'Go and teach all nations — Jesus is with us always.',
      prayer: 'Jesus, thank You for being with me alway. Help me obey Your commission. Amen.'
    },

    holySpiritPentecost: {
      kjvRef: 'Acts 2:1–13',
      paragraphs: [
        'When the day of Pentecost was fully come, they were all with one accord in one place.',
        'Suddenly there came a sound from heaven as of a rushing mighty wind, and it filled all the house where they were sitting.',
        'There appeared unto them cloven tongues like as of fire, and it sat upon each of them. They were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance.',
        'Devout men from every nation under heaven heard them speak in their own language — some marvelled; others mocked, saying they were full of new wine.',
        'Peter would soon stand and show this was the outpouring God promised — not drunkenness, but the Spirit poured forth.'
      ],
      imagePrompts: [
        'bright cartoon for kids: disciples one accord in one place, day of Pentecost, no text',
        'fun kid illustration: rushing mighty wind filling the house, no text',
        'colorful Bible scene for children: cloven tongues like fire on each, speaking in other tongues, no text',
        'exciting cartoon: crowd amazed and some mocking new wine, no text',
        'hopeful ending illustration: Peter about to preach truth from Joel, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Wind, fire, tongues — the church was filled with power!',
      quizHeading: 'Pentecost & Holy Spirit Questions',
      questions: [
        {
          question: 'When did this happen?',
          choices: ['Passover only', 'The day of Pentecost was fully come', 'Christmas', 'Sabbath evening only'],
          correctIndex: 1,
          correctFeedback: 'Yes! When the day of Pentecost was fully come.',
          wrongFeedback: 'When the day of Pentecost was fully come, they were all with one accord in one place (Acts 2:1).'
        },
        {
          question: 'What sound came from heaven?',
          choices: ['A still small whisper only', 'As of a rushing mighty wind', 'Only silence', 'A trumpet only'],
          correctIndex: 1,
          correctFeedback: 'Right! A sound as of a rushing mighty wind.',
          wrongFeedback: 'There came a sound from heaven as of a rushing mighty wind (Acts 2:2).'
        },
        {
          question: 'What appeared on each of them?',
          choices: ['Crowns of gold', 'Cloven tongues like as of fire', 'Dove wings', 'Lamps only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Cloven tongues like as of fire sat upon each.',
          wrongFeedback: 'There appeared cloven tongues like as of fire… and it sat upon each of them (Acts 2:3).'
        },
        {
          question: 'What did they do when filled with the Holy Ghost?',
          choices: ['Slept', 'Spake with other tongues as the Spirit gave utterance', 'Fled the city', 'Hid in silence'],
          correctIndex: 1,
          correctFeedback: 'Exactly! They began to speak with other tongues, as the Spirit gave them utterance.',
          wrongFeedback: 'They were all filled with the Holy Ghost, and began to speak with other tongues (Acts 2:4).'
        },
        {
          question: 'What can we learn from Pentecost?',
          choices: ['The Spirit does not matter', 'God pours out His Spirit and empowers His church', 'Never gather', 'Forget Christ'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The Spirit came with power — the church was born to witness.',
          wrongFeedback: 'Pentecost shows God filling believers to declare His works in every tongue!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Holy Spirit power!',
      takeaway: 'The Holy Spirit empowers believers — God keeps His promise.',
      prayer: 'God, fill me with Thy Holy Spirit. Help me speak of Jesus. Amen.'
    },

    peterPentecostSermon: {
      kjvRef: 'Acts 2:14–41',
      paragraphs: [
        'Peter, standing up with the eleven, lifted up his voice: Ye men of Judaea, and all ye that dwell at Jerusalem, be this known unto you, and hearken to my words.',
        'These are not drunken, as ye suppose, seeing it is but the third hour of the day. But this is that which was spoken by the prophet Joel — I will pour out of my Spirit upon all flesh.',
        'He preached Jesus of Nazareth, approved of God among you by miracles — ye have taken, and by wicked hands have crucified and slain: whom God hath raised up, having loosed the pains of death.',
        'When they heard this, they were pricked in their heart, and said unto Peter and the rest of the apostles, Men and brethren, what shall we do?',
        'Peter said, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost. They that gladly received his word were baptized — about three thousand souls.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Peter with the eleven, lifting up his voice to the multitude, no text',
        'fun kid illustration: not drunk — third hour of the day — Joel’s prophecy, no text',
        'colorful Bible scene for children: preaching Jesus crucified and raised from the dead, no text',
        'exciting cartoon: people pricked in heart asking what shall we do, no text',
        'happy ending illustration: many baptized, three thousand souls, glad receiving the word, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Peter preached Christ crucified and risen — thousands believed!',
      quizHeading: 'Peter’s Pentecost Sermon Questions',
      questions: [
        {
          question: 'What did Peter say about drunkenness?',
          choices: ['They are drunk', 'These are not drunken — it is but the third hour of the day', 'Wine is good', 'Ignore the hour'],
          correctIndex: 1,
          correctFeedback: 'Yes! Not drunken — it is but the third hour.',
          wrongFeedback: 'These are not drunken, as ye suppose, seeing it is but the third hour of the day (Acts 2:15).'
        },
        {
          question: 'Which prophet did Peter quote first?',
          choices: ['Isaiah', 'Joel', 'Moses only', 'Jeremiah'],
          correctIndex: 1,
          correctFeedback: 'Right! But this is that which was spoken by the prophet Joel.',
          wrongFeedback: 'But this is that which was spoken by the prophet Joel (Acts 2:16).'
        },
        {
          question: 'What did Peter preach about Jesus?',
          choices: ['He failed', 'Ye crucified Him — God raised Him up, having loosed the pains of death', 'He stayed dead', 'He left no witness'],
          correctIndex: 1,
          correctFeedback: 'Yes! Crucified and slain — God raised Him up.',
          wrongFeedback: 'Whom God hath raised up, having loosed the pains of death (Acts 2:23–24).'
        },
        {
          question: 'What did the hearers ask?',
          choices: ['Who art thou?', 'Men and brethren, what shall we do?', 'Give us silver', 'Depart from us'],
          correctIndex: 1,
          correctFeedback: 'Yes! Pricked in their heart — what shall we do?',
          wrongFeedback: 'They said… Men and brethren, what shall we do? (Acts 2:37).'
        },
        {
          question: 'What can we learn from Peter’s sermon?',
          choices: ['Never preach sin', 'Repent, be baptized, receive the Holy Ghost — the gospel saves', 'Stay in unbelief', 'Hide from Christ'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Repentance, baptism, and the gift of the Spirit — for all who call on the Lord.',
          wrongFeedback: 'Repent, and be baptized… ye shall receive the gift of the Holy Ghost (Acts 2:38).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — repent and believe!',
      takeaway: 'Repent, be baptized, receive the Holy Ghost — Christ is Lord and Saviour.',
      prayer: 'God, prick my heart to repent. Fill me with Thy Holy Spirit. Amen.'
    },

    earlyChurchLife: {
      kjvRef: 'Acts 2:42–47',
      paragraphs: [
        'They continued stedfastly in the apostles’ doctrine and fellowship, and in breaking of bread, and in prayers.',
        'Fear came upon every soul: and many wonders and signs were done by the apostles.',
        'All that believed were together, and had all things common; and sold their possessions and goods, and parted them to all men, as every man had need.',
        'They continued daily with one accord in the temple, and breaking bread from house to house, did eat their meat with gladness and singleness of heart, praising God.',
        'And the Lord added to the church daily such as should be saved.'
      ],
      imagePrompts: [
        'bright cartoon for kids: believers learning apostles’ doctrine, fellowship, breaking bread, prayer, no text',
        'fun kid illustration: sharing goods, selling possessions, giving to every man as he had need, no text',
        'colorful Bible scene for children: temple and homes, breaking bread with glad hearts, no text',
        'exciting cartoon: praising God, singleness of heart, favour with people, no text',
        'happy ending illustration: Lord adding to the church daily such as should be saved, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'One heart — Word, fellowship, bread, prayer!',
      quizHeading: 'Early Church Life Questions',
      questions: [
        {
          question: 'In what did they continue stedfastly?',
          choices: ['Apostles’ doctrine, fellowship, breaking of bread, and prayers', 'Quarrelling', 'Buying only', 'Hiding at home'],
          correctIndex: 0,
          correctFeedback: 'Yes! Doctrine, fellowship, breaking of bread, prayers.',
          wrongFeedback: 'They continued stedfastly in the apostles’ doctrine and fellowship, and in breaking of bread, and in prayers (Acts 2:42).'
        },
        {
          question: 'How did they treat their possessions?',
          choices: ['Hoarded all', 'Had all things common — sold and parted to every man as he had need', 'Gave nothing', 'Sold only to enemies'],
          correctIndex: 1,
          correctFeedback: 'Right! All things common — parted to every man as every man had need.',
          wrongFeedback: 'They sold their possessions and goods, and parted them to all men, as every man had need (Acts 2:44–45).'
        },
        {
          question: 'Where did they meet daily?',
          choices: ['Only in the wilderness', 'In the temple, and from house to house', 'In markets only', 'Far from Jerusalem'],
          correctIndex: 1,
          correctFeedback: 'Yes! Daily in the temple, breaking bread from house to house.',
          wrongFeedback: 'They continued daily with one accord in the temple, and breaking bread from house to house (Acts 2:46).'
        },
        {
          question: 'What did the Lord do daily?',
          choices: ['Subtracted believers', 'Added to the church daily such as should be saved', 'Closed the doors', 'Forgot them'],
          correctIndex: 1,
          correctFeedback: 'Exactly! The Lord added such as should be saved.',
          wrongFeedback: 'The Lord added to the church daily such as should be saved (Acts 2:47).'
        },
        {
          question: 'What can we learn from the early church?',
          choices: ['Live selfishly', 'Word, fellowship, prayer, generosity — God builds His church', 'Never meet', 'Forget breaking of bread'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Glad hearts, praising God — the Lord still adds those who are saved.',
          wrongFeedback: 'They praised God and had favour with all the people — and the Lord added daily!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — live in unity!',
      takeaway: 'Continue in the Word, fellowship, and prayer — God adds to His church.',
      prayer: 'God, help our church follow Christ together in love and truth. Amen.'
    },

    revelationThroneRoom: {
      kjvRef: 'Revelation 4–5',
      paragraphs: [
        'After these things John looked, and behold, a door was opened in heaven: the first voice… said, Come up hither, and I will shew thee things which must be hereafter.',
        'He saw a throne set in heaven, and one sat on the throne — jasper and sardine stone, an emerald rainbow round about the throne.',
        'Round about the throne were four and twenty seats with elders clothed in white, with crowns of gold; seven lamps of fire before the throne — the seven Spirits of God.',
        'Four beasts full of eyes gave glory and honour and thanks to Him that sat on the throne, who liveth for ever and ever — the elders cast their crowns before the throne, worshipping.',
        'In the right hand of Him that sat on the throne John saw a book sealed with seven seals — the Lion of the tribe of Juda, the Root of David, prevailed to open the book: the Lamb as it had been slain is worthy — every creature said, Blessing, and honour, and glory, and power, be unto him that sitteth upon the throne, and unto the Lamb for ever and ever.'
      ],
      imagePrompts: [
        'bright cartoon for kids: open door in heaven, Come up hither, no text',
        'fun kid illustration: throne, jasper, rainbow like emerald, no text',
        'colorful Bible scene for children: twenty-four elders, seven lamps, four living creatures praising, no text',
        'exciting cartoon: elders casting crowns before the throne, worship, no text',
        'happy ending illustration: Lamb in midst of throne, worthy to take the book, all creation worshipping, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Heaven’s throne — the Lamb is worthy!',
      quizHeading: 'Throne Room in Heaven Questions',
      questions: [
        {
          question: 'What did John see opened in heaven?',
          choices: ['A window only', 'A door — Come up hither', 'A gate of pearl only', 'Nothing'],
          correctIndex: 1,
          correctFeedback: 'Yes! A door was opened — Come up hither.',
          wrongFeedback: 'Behold, a door was opened in heaven… Come up hither (Revelation 4:1).'
        },
        {
          question: 'What were in the midst of the throne, and round about the throne?',
          choices: ['Twelve soldiers', 'Four beasts full of eyes before and behind', 'Seven mountains', 'Two dragons'],
          correctIndex: 1,
          correctFeedback: 'Right! Four beasts full of eyes — giving glory to Him that sat on the throne.',
          wrongFeedback: 'In the midst of the throne, and round about the throne, were four beasts full of eyes (Revelation 4:6).'
        },
        {
          question: 'Who alone was worthy to take the sealed book?',
          choices: ['An elder', 'The Lion of the tribe of Juda, the Root of David — the Lamb as it had been slain', 'John', 'An angel alone'],
          correctIndex: 1,
          correctFeedback: 'Yes! The Lamb prevailed — worthy is the Lamb.',
          wrongFeedback: 'The Lion of the tribe of Juda… hath prevailed to open the book (Revelation 5:5).'
        },
        {
          question: 'What did the elders do with their crowns?',
          choices: ['Kept them', 'Cast them before the throne', 'Threw them away in anger', 'Hid them'],
          correctIndex: 1,
          correctFeedback: 'Exactly! They worshipped Him that liveth for ever and ever.',
          wrongFeedback: 'The four and twenty elders… cast their crowns before the throne (Revelation 4:10).'
        },
        {
          question: 'What can we learn from the throne room vision?',
          choices: ['God is small', 'God reigns — the Lamb is worthy of all worship', 'Heaven is dull', 'Never praise'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Worthy is the Lamb — blessing, honour, glory, and power!',
          wrongFeedback: 'Thou art worthy… for thou wast slain, and hast redeemed us to God (Revelation 5:9).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — worthy is the Lamb!',
      takeaway: 'God reigns in heaven — the Lamb alone is worthy.',
      prayer: 'Lord, Thou art worthy of all praise. Help me worship Thee in spirit and truth. Amen.'
    },

    paulTimothy: {
      kjvRef: '1 Timothy 1–6; 2 Timothy 1–4',
      paragraphs: [
        'Paul wrote to Timothy, his own son in the faith. He charged him to teach sound doctrine and turn from fables and endless genealogies.',
        'Paul said, "Fight the good fight of faith." He told Timothy to be strong in the grace that is in Christ Jesus and endure hardness as a good soldier of Jesus Christ.',
        'He told Timothy to be an example to the believers in word, in conversation, in charity, in spirit, in faith, in purity — and not to neglect the gift that was given him.',
        'In his last letter Paul wrote, I have fought a good fight, I have finished my course, I have kept the faith.',
        'He charged Timothy to preach the word; be instant in season, out of season; reprove, rebuke, exhort with all longsuffering and doctrine.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul writing to Timothy, scroll and pen, mentor and student, no text',
        'fun kid illustration: Timothy teaching sound doctrine, people listening, no text',
        'colorful Bible scene for children: Timothy setting example in word, love, faith, purity, no text',
        'exciting cartoon: Paul saying I have fought the good fight, crown of righteousness ahead, no text',
        'happy ending illustration: Timothy preaching the word, encouraging others, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul encouraged Timothy to fight the good fight!',
      quizHeading: 'Paul to Timothy Questions',
      questions: [
        {
          question: 'Who did Paul call his son in the faith?',
          choices: ['Barnabas', 'Timothy', 'Titus', 'Silas'],
          correctIndex: 1,
          correctFeedback: 'Yes! Timothy — Paul mentored him.',
          wrongFeedback: 'Paul wrote unto Timothy, mine own son in the faith (1 Timothy 1:2).'
        },
        {
          question: 'What did Paul urge Timothy to do?',
          choices: ['Fight the good fight of faith', 'Give up', 'Be silent', 'Stay home'],
          correctIndex: 0,
          correctFeedback: 'Right! Fight the good fight of faith.',
          wrongFeedback: 'Fight the good fight of faith, lay hold on eternal life (1 Timothy 6:12).'
        },
        {
          question: 'What example did Paul tell Timothy to set?',
          choices: ['In word, conversation, charity, spirit, faith, purity', 'In wealth', 'In power', 'In hiding'],
          correctIndex: 0,
          correctFeedback: 'Yes! Be thou an example of the believers in word, in conversation, in charity, in spirit, in faith, in purity.',
          wrongFeedback: 'Let no man despise thy youth; but be thou an example of the believers… in faith, in purity (1 Timothy 4:12).'
        },
        {
          question: 'What did Paul say near the end of his life?',
          choices: ['I have failed', 'I have fought a good fight, finished my course, kept the faith', 'I am weak', 'I regret everything'],
          correctIndex: 1,
          correctFeedback: 'Yes! I have fought a good fight, I have finished my course, I have kept the faith.',
          wrongFeedback: 'I have fought a good fight, I have finished my course, I have kept the faith (2 Timothy 4:7).'
        },
        {
          question: 'What can we learn from Paul to Timothy?',
          choices: ['Give up when it is hard', 'Fight the good fight and keep the faith', 'Never teach', 'Be silent'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Fight the good fight — keep the faith.',
          wrongFeedback: 'Paul encouraged Timothy to endure and preach the word — we can follow Christ the same way.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — fight the good fight!',
      takeaway: 'Fight the good fight and keep the faith — endure for Jesus.',
      prayer: 'God, help me fight the good fight and keep the faith. Amen.'
    },

    paulTitus: {
      kjvRef: 'Titus 1–3',
      paragraphs: [
        'Paul wrote to Titus in Crete. He told him to ordain elders in every city — blameless, holding fast the faithful word, able to teach sound doctrine.',
        'Paul warned of unruly talkers who subvert whole houses, teaching things they ought not for filthy lucre — rebuke them sharply that they may be sound in the faith.',
        'Titus was to teach older men to be sober, grave, temperate; older women to be teachers of good things; younger women to love their husbands and children.',
        'The grace of God that bringeth salvation hath appeared to all men, teaching us that, denying ungodliness and worldly lusts, we should live soberly, righteously, and godly.',
        'We are saved by grace — not by works of righteousness we have done — yet being justified by His grace, we should be careful to maintain good works.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul writing to Titus in Crete, scroll and pen, no text',
        'fun kid illustration: Titus appointing elders, wise men chosen, no text',
        'colorful Bible scene for children: older women teaching younger women, families loving, no text',
        'exciting cartoon: grace teaching us to turn from wrong and live upright, no text',
        'happy ending illustration: people saved by grace, eager to do good, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul told Titus to appoint good leaders!',
      quizHeading: 'Paul to Titus Questions',
      questions: [
        {
          question: 'Where was Titus when Paul wrote to him?',
          choices: ['Rome', 'Crete', 'Ephesus', 'Jerusalem'],
          correctIndex: 1,
          correctFeedback: 'Yes! Titus was in Crete.',
          wrongFeedback: 'For this cause left I thee in Crete, that thou shouldest set in order the things that are wanting (Titus 1:5).'
        },
        {
          question: 'What did Paul tell Titus to do?',
          choices: ['Leave Crete', 'Ordain elders in every city who are blameless', 'Ignore false teachers', 'Build temples'],
          correctIndex: 1,
          correctFeedback: 'Right! Ordain elders — blameless, holding fast faithful doctrine.',
          wrongFeedback: 'For this cause left I thee in Crete… and ordain elders in every city (Titus 1:5).'
        },
        {
          question: 'What did Paul say about unruly teachers?',
          choices: ['They are good', 'Rebuke them sharply', 'Follow them', 'Give them money'],
          correctIndex: 1,
          correctFeedback: 'Yes! Rebuke them sharply — they teach for wrong gain.',
          wrongFeedback: 'Wherefore rebuke them sharply, that they may be sound in the faith (Titus 1:13).'
        },
        {
          question: 'What does grace teach us?',
          choices: ['To say yes to sin', 'To deny ungodliness and live soberly, righteously, and godly', 'To be selfish', 'To ignore others'],
          correctIndex: 1,
          correctFeedback: 'Right! Grace teaches us to turn from sin and walk uprightly.',
          wrongFeedback: 'Teaching us that, denying ungodliness and worldly lusts, we should live soberly, righteously, and godly (Titus 2:12).'
        },
        {
          question: 'What can we learn from Paul to Titus?',
          choices: ['Salvation by our own works alone', 'Saved by grace — careful to maintain good works', 'Never appoint leaders', 'Ignore false teachers'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Saved by grace — maintain good works.',
          wrongFeedback: 'Not by works of righteousness which we have done… being justified by his grace (Titus 3:5, 7); maintain good works (Titus 3:8).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — live by grace!',
      takeaway: 'Salvation by grace — be careful to maintain good works.',
      prayer: 'God, thank You for grace. Help me do good eagerly. Amen.'
    },

    paulPhilemon: {
      kjvRef: 'Philemon 1',
      paragraphs: [
        'Paul wrote to Philemon about Onesimus — once unprofitable to Philemon, but now profitable to Paul and to Philemon in the Lord.',
        'Paul said, I beseech thee for my son Onesimus, whom I have begotten in my bonds — which in time past was to thee unprofitable, but now profitable to thee and to me.',
        'Paul asked Philemon to receive Onesimus for ever; not now as a servant, but above a servant, a brother beloved — receive him as unto myself.',
        'If Onesimus owed anything, Paul wrote, put that on mine account — I will repay it.',
        'Paul hoped Philemon would forgive and welcome Onesimus as a brother in Christ — knowing that Philemon would do even more than Paul asked.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul writing letter to Philemon about Onesimus, no text',
        'fun kid illustration: Onesimus meeting Paul, becoming a brother in Christ, no text',
        'colorful Bible scene for children: Paul asking receive him as a beloved brother, no text',
        'exciting cartoon: Philemon welcoming Onesimus back, forgiveness, no text',
        'happy ending illustration: Onesimus as brother in Christ, hearts united, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul asked Philemon to forgive and welcome Onesimus as a brother!',
      quizHeading: 'Paul to Philemon Questions',
      questions: [
        {
          question: 'Who was Onesimus?',
          choices: ['A king', 'Onesimus — once unprofitable, then a brother in the Lord', 'A soldier only', 'A priest'],
          correctIndex: 1,
          correctFeedback: 'Yes! Onesimus became profitable to Paul and Philemon in Christ.',
          wrongFeedback: 'I beseech thee for my son Onesimus… in time past was to thee unprofitable, but now profitable (Philemon 10–11).'
        },
        {
          question: 'What did Paul say Onesimus had been to Philemon before?',
          choices: ['Always perfect', 'Unprofitable — now profitable in the Lord', 'A stranger only', 'His enemy always'],
          correctIndex: 1,
          correctFeedback: 'Right! Once unprofitable — now profitable to thee and to me.',
          wrongFeedback: 'Which in time past was to thee unprofitable, but now profitable to thee and to me (Philemon 11).'
        },
        {
          question: 'How did Paul ask Philemon to receive Onesimus?',
          choices: ['As a servant only', 'Above a servant — a brother beloved', 'As a stranger', 'As an enemy'],
          correctIndex: 1,
          correctFeedback: 'Yes! Not now as a servant, but a brother beloved.',
          wrongFeedback: 'Not now as a servant, but above a servant, a brother beloved (Philemon 16).'
        },
        {
          question: 'What did Paul offer to do?',
          choices: ['Nothing', 'Put any wrong to mine account — I will repay', 'Punish Onesimus', 'Take Onesimus away'],
          correctIndex: 1,
          correctFeedback: 'Correct! Paul offered to repay.',
          wrongFeedback: 'If he hath wronged thee, or oweth thee ought, put that on mine account (Philemon 18).'
        },
        {
          question: 'What can we learn from Paul to Philemon?',
          choices: ['Forgive and welcome as brother', 'Never forgive', 'Stay angry', 'Turn away runaways'],
          correctIndex: 0,
          correctFeedback: 'Perfect! Forgive and welcome as brother in Christ.',
          wrongFeedback: 'Paul asked for love and brotherhood — showing Christ’s heart toward others.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — forgive and welcome!',
      takeaway: 'Forgive and welcome as brother in Christ — show His love.',
      prayer: 'God, help me forgive and welcome others as brothers. Amen.'
    },

    hebrewsFaith: {
      kjvRef: 'Hebrews 11',
      paragraphs: [
        'Now faith is the substance of things hoped for, the evidence of things not seen — through faith the elders obtained a good report.',
        'By faith Abel offered unto God a more excellent sacrifice than Cain. By faith Enoch was translated that he should not see death; for before his translation he had this testimony, that he pleased God.',
        'By faith Noah, being warned of God of things not seen as yet, prepared an ark to the saving of his house. By faith Abraham obeyed when he was called to go out into a place he would afterward receive for an inheritance.',
        'By faith Moses, when he was come to years, refused to be called the son of Pharaoh’s daughter, choosing rather to suffer affliction with the people of God than to enjoy the pleasures of sin for a season.',
        'These all died in faith… desiring a better country, that is, an heavenly — wherefore God is not ashamed to be called their God: for he hath prepared for them a city.'
      ],
      imagePrompts: [
        'bright cartoon for kids: heroes of faith — Abel, Enoch, Noah, Abraham, Moses, Rahab, no text',
        'fun kid illustration: Noah building ark, family saved, faith in God’s word, no text',
        'colorful Bible scene for children: Abraham leaving home, trusting God’s call, no text',
        'exciting cartoon: Moses choosing to suffer with God’s people, brave heart, no text',
        'hopeful ending illustration: heroes looking to a heavenly country, God with them, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Faith is trusting God — heroes of faith obeyed!',
      quizHeading: 'Hebrews Faith Chapter Questions',
      questions: [
        {
          question: 'What is faith according to Hebrews?',
          choices: ['Substance of things hoped for, evidence of things not seen', 'Seeing everything first', 'Doubting God', 'Never trusting'],
          correctIndex: 0,
          correctFeedback: 'Yes! Now faith is the substance of things hoped for, the evidence of things not seen.',
          wrongFeedback: 'Now faith is the substance of things hoped for, the evidence of things not seen (Hebrews 11:1).'
        },
        {
          question: 'By faith who offered a more excellent sacrifice?',
          choices: ['Cain', 'Abel', 'Noah', 'Abraham'],
          correctIndex: 1,
          correctFeedback: 'Yes! By faith Abel offered unto God a more excellent sacrifice than Cain.',
          wrongFeedback: 'By faith Abel offered unto God a more excellent sacrifice than Cain (Hebrews 11:4).'
        },
        {
          question: 'By faith who was translated that he should not see death?',
          choices: ['Enoch', 'Elijah', 'Moses', 'David'],
          correctIndex: 0,
          correctFeedback: 'Right! Enoch pleased God and was translated.',
          wrongFeedback: 'By faith Enoch was translated that he should not see death (Hebrews 11:5).'
        },
        {
          question: 'By faith who prepared an ark?',
          choices: ['Noah', 'Abraham', 'Moses', 'Rahab'],
          correctIndex: 0,
          correctFeedback: 'Yes! Noah prepared an ark to the saving of his house.',
          wrongFeedback: 'By faith Noah… prepared an ark to the saving of his house (Hebrews 11:7).'
        },
        {
          question: 'What can we learn from the heroes of faith?',
          choices: ['Faith is useless', 'Faith obeys God and looks to His promises', 'Never obey', 'Forget God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Faith obeys and looks forward to God’s promises.',
          wrongFeedback: 'Hebrews 11 shows faith leads to obedience and hope in God’s heavenly country.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — faith obeys God!',
      takeaway: 'Faith obeys God and looks forward to His promises.',
      prayer: 'God, grow my faith to obey and trust Your promises. Amen.'
    },

    jamesFaithWorks: {
      kjvRef: 'James 2:14–26',
      paragraphs: [
        'James asked, What doth it profit, my brethren, though a man say he hath faith, and have not works? can faith save him?',
        'If a brother or sister be naked, and destitute of daily food, and one of you say unto them, Depart in peace, be ye warmed and filled; notwithstanding ye give them not those things which are needful to the body — what doth it profit?',
        'Even so faith, if it hath not works, is dead, being alone. Yea, a man may say, Thou hast faith, and I have works: shew me thy faith without thy works, and I will shew thee my faith by my works.',
        'Thou believest that there is one God; thou doest well: the devils also believe, and tremble.',
        'Was not Abraham our father justified by works, when he had offered Isaac his son upon the altar? Seest thou how faith wrought with his works, and by works was faith made perfect?'
      ],
      imagePrompts: [
        'bright cartoon for kids: person saying they have faith but not helping a needy brother, no text',
        'fun kid illustration: James teaching faith shows in good works, words vs action, no text',
        'colorful Bible scene for children: devils believe and tremble, no text',
        'exciting cartoon: Abraham offering Isaac, faith made perfect with works, no text',
        'happy ending illustration: faith and good works together, living for God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Faith without works is dead — show faith by doing!',
      quizHeading: 'James — Faith & Works Questions',
      questions: [
        {
          question: 'What did James say about faith without works?',
          choices: ['It is alive', 'It is dead', 'It is strong enough alone without helping', 'It never needs action'],
          correctIndex: 1,
          correctFeedback: 'Yes! Faith, if it hath not works, is dead.',
          wrongFeedback: 'Faith, if it hath not works, is dead, being alone (James 2:17).'
        },
        {
          question: 'What example did James give of faith that does not help?',
          choices: ['Giving food and clothing', 'Saying depart in peace, be warmed and filled, without giving what they need', 'Praying with love', 'Sharing gladly'],
          correctIndex: 1,
          correctFeedback: 'Right! Words without help do not save the cold and hungry.',
          wrongFeedback: 'If a brother or sister be naked and destitute of daily food… and one of you say… be ye warmed and filled; notwithstanding ye give them not (James 2:15–16).'
        },
        {
          question: 'What did James say devils do?',
          choices: ['Believe and obey God', 'Believe — and tremble', 'Ignore God', 'Help people gladly'],
          correctIndex: 1,
          correctFeedback: 'Yes! The devils also believe, and tremble.',
          wrongFeedback: 'Thou believest that there is one God; thou doest well: the devils also believe, and tremble (James 2:19).'
        },
        {
          question: 'How does James describe Abraham’s faith with his works?',
          choices: ['Faith only, no works needed', 'Justified by works when he offered Isaac — faith made perfect', 'By hiding', 'By riches'],
          correctIndex: 1,
          correctFeedback: 'Yes! Faith wrought with his works, and by works was faith made perfect.',
          wrongFeedback: 'Was not Abraham our father justified by works, when he had offered Isaac… Seest thou how faith wrought with his works (James 2:21–22).'
        },
        {
          question: 'What can we learn from James on faith and works?',
          choices: ['True faith never needs good works', 'Faith without works is dead — show faith by doing good', 'We are saved by works alone', 'Never do good'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Faith without works is dead — let your faith show in good deeds.',
          wrongFeedback: 'James taught that living faith produces action — love God and love your neighbour in truth.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — faith shows in good works!',
      takeaway: 'Faith without works is dead — show faith by doing good.',
      prayer: 'God, help my faith show in what I do. Thank You for grace. Amen.'
    },

    peterFirstLetter: {
      kjvRef: '1 Peter 1–5',
      paragraphs: [
        'Peter wrote to scattered believers facing trials. Blessed be the God and Father of our Lord Jesus Christ, which according to his abundant mercy hath begotten us again unto a lively hope by the resurrection of Jesus Christ from the dead.',
        'He called them to be holy in all manner of conversation, because God is holy. See that ye love one another with a pure heart fervently.',
        'He taught honour toward governors and masters, doing good with patience. It is better, if the will of God be so, that ye suffer for well doing, than for evil doing.',
        'Humble yourselves therefore under the mighty hand of God, that he may exalt you in due time: casting all your care upon him; for he careth for you.',
        'Be sober, be vigilant; because your adversary the devil, as a roaring lion, walketh about, seeking whom he may devour — whom resist stedfast in the faith.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Peter writing letter to believers in trial, hope in Jesus resurrection, no text',
        'fun kid illustration: believers loving one another with pure hearts, no text',
        'colorful Bible scene for children: doing good and honouring rulers with respect, no text',
        'exciting cartoon: humble under God mighty hand, casting care on Him, He cares, no text',
        'hopeful ending illustration: devil as roaring lion, believers alert and sober, God protecting, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Peter encouraged suffering believers to hope in Jesus!',
      quizHeading: '1 Peter Questions',
      questions: [
        {
          question: 'What did Peter say believers are begotten again unto?',
          choices: ['A lively hope by Jesus’ resurrection from the dead', 'A dead hope', 'Riches only', 'Power only'],
          correctIndex: 0,
          correctFeedback: 'Yes! Begotten again unto a lively hope by the resurrection of Jesus Christ.',
          wrongFeedback: 'Blessed be the God… which… hath begotten us again unto a lively hope by the resurrection of Jesus Christ from the dead (1 Peter 1:3).'
        },
        {
          question: 'How did Peter tell believers to love one another?',
          choices: ['With hate', 'With a pure heart fervently', 'Not at all', 'Only in words'],
          correctIndex: 1,
          correctFeedback: 'Right! Love one another with a pure heart fervently.',
          wrongFeedback: 'See that ye love one another with a pure heart fervently (1 Peter 1:22).'
        },
        {
          question: 'What did Peter say about suffering for doing good?',
          choices: ['It is better to suffer for well doing than for evil doing', 'Suffering is always wrong', 'Never do good', 'Only suffer for evil'],
          correctIndex: 0,
          correctFeedback: 'Yes! Better to suffer for well doing, if God so will, than for evil doing.',
          wrongFeedback: 'It is better, if the will of God be so, that ye suffer for well doing, than for evil doing (1 Peter 3:17).'
        },
        {
          question: 'What did Peter tell believers to do with their cares?',
          choices: ['Keep them alone', 'Cast them on God — He careth for you', 'Worry more', 'Hide them'],
          correctIndex: 1,
          correctFeedback: 'Yes! Casting all your care upon him; for he careth for you.',
          wrongFeedback: 'Casting all your care upon him; for he careth for you (1 Peter 5:7).'
        },
        {
          question: 'What can we learn from 1 Peter?',
          choices: ['Trials mean God forgot us', 'Hope in Jesus, love fervently, humble yourselves under God’s hand', 'Never love', 'Give up hope'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Lively hope, pure love, humble hearts — God cares for you.',
          wrongFeedback: 'Peter pointed to Christ’s resurrection hope, holy love, and casting every care on Him.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — hope in Jesus!',
      takeaway: 'Hope in Jesus, love one another, humble yourselves — God careth for you.',
      prayer: 'God, thank You for lively hope in Jesus. Help me love and humble myself. Amen.'
    },

    peterSecondLetter: {
      kjvRef: '2 Peter 1–3',
      paragraphs: [
        'Peter wrote to stir up pure minds by way of remembrance: add to your faith virtue; and to virtue knowledge; and to knowledge temperance; and to temperance patience; and to patience godliness; and to godliness brotherly kindness; and to brotherly kindness charity.',
        'He warned that false teachers shall privily bring in damnable heresies, denying the Lord that bought them — through covetousness with feigned words they make merchandise of souls.',
        'God spared not the angels that sinned, but cast them down to hell; spared not the old world, but saved Noah; turning the cities of Sodom and Gomorrha into ashes condemned them.',
        'The Lord is not slack concerning his promise, as some men count slackness; but is longsuffering to us-ward, not willing that any should perish, but that all should come to repentance.',
        'Peter urged holy conversation and godliness, looking for the day of the Lord — the heavens shall pass away with a great noise, and we look for new heavens and a new earth wherein dwelleth righteousness.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Peter writing second letter, faith growing with virtue knowledge patience love, no text',
        'fun kid illustration: believers growing in godliness and kindness, no text',
        'colorful Bible scene for children: false teachers misleading with smooth words, no text',
        'exciting cartoon: God judged angels and Sodom, saved Noah in ark, no text',
        'hopeful ending illustration: Lord longsuffering, repentance, holy living, new heavens and earth hope, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Peter reminded believers to grow and watch for false teachers!',
      quizHeading: '2 Peter Questions',
      questions: [
        {
          question: 'What did Peter tell believers to add to their faith?',
          choices: ['Evil only', 'Virtue, knowledge, temperance, patience, godliness, brotherly kindness, charity', 'Money only', 'Boasting only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Add to faith virtue, knowledge, temperance, patience, godliness, kindness, charity.',
          wrongFeedback: 'Giving all diligence, add to your faith virtue; and to virtue knowledge… unto brotherly kindness charity (2 Peter 1:5–7).'
        },
        {
          question: 'What did Peter warn false teachers would do?',
          choices: ['Teach truth openly', 'Privily bring in damnable heresies, denying the Lord', 'Help everyone freely', 'Only read Scripture'],
          correctIndex: 1,
          correctFeedback: 'Right! They privily bring in damnable heresies.',
          wrongFeedback: 'There shall be false teachers among you, who privily shall bring in damnable heresies, even denying the Lord that bought them (2 Peter 2:1).'
        },
        {
          question: 'Whom did Peter say God judged in his examples?',
          choices: ['Noah only', 'Angels that sinned, the old world, Sodom and Gomorrha', 'Abraham only', 'Moses only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Angels cast down, old world drowned, Sodom and Gomorrha ashes.',
          wrongFeedback: 'God spared not the angels that sinned… spared not the old world… turning… Sodom and Gomorrha into ashes (2 Peter 2:4–6).'
        },
        {
          question: 'Why is the Lord longsuffering?',
          choices: ['He wants any to perish', 'Not willing that any should perish — all should come to repentance', 'He forgets', 'He is weak'],
          correctIndex: 1,
          correctFeedback: 'Yes! Not willing that any should perish, but that all should come to repentance.',
          wrongFeedback: 'The Lord… is longsuffering to us-ward, not willing that any should perish, but that all should come to repentance (2 Peter 3:9).'
        },
        {
          question: 'What can we learn from 2 Peter?',
          choices: ['Grow in faith and watch for false teachers', 'Never grow', 'Believe every new idea', 'Ignore God’s patience'],
          correctIndex: 0,
          correctFeedback: 'Perfect! Grow in grace and knowledge — stand firm on God’s Word.',
          wrongFeedback: 'Peter urged diligence in virtue and warned against heresy — trust God’s longsuffering toward repentance.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — grow in faith!',
      takeaway: 'Grow in faith and watch for false teachers — the Lord is longsuffering.',
      prayer: 'God, help me grow in faith and discern false teaching. Thank You for patience toward repentance. Amen.'
    },

    johnFirstLetter: {
      kjvRef: '1 John 1–5',
      paragraphs: [
        'John wrote: This then is the message which we have heard of him… God is light, and in him is no darkness at all. If we walk in the light, we have fellowship one with another, and the blood of Jesus Christ his Son cleanseth us from all sin.',
        'If we say that we have no sin, we deceive ourselves, and the truth is not in us. If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.',
        'My little children, these things write I unto you, that ye sin not. And if any man sin, we have an advocate with the Father, Jesus Christ the righteous.',
        'Hereby perceive we the love of God, because he laid down his life for us: and we ought to lay down our lives for the brethren.',
        'These things have I written unto you that believe on the name of the Son of God; that ye may know that ye have eternal life, and that ye may believe on the name of the Son of God.'
      ],
      imagePrompts: [
        'bright cartoon for kids: John writing God is light, no darkness, walking in light together, no text',
        'fun kid illustration: confessing sins, God faithful to forgive and cleanse, no text',
        'colorful Bible scene for children: Jesus Christ the righteous as advocate with the Father, no text',
        'exciting cartoon: Jesus laying down His life for us, love we copy toward others, no text',
        'happy ending illustration: believers knowing eternal life in the Son of God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'John wrote about walking in light, confessing sin, and love!',
      quizHeading: '1 John Questions',
      questions: [
        {
          question: 'What did John say God is?',
          choices: ['Darkness', 'Light — in him is no darkness at all', 'Part light part dark', 'Hidden only'],
          correctIndex: 1,
          correctFeedback: 'Yes! God is light, and in him is no darkness at all.',
          wrongFeedback: 'God is light, and in him is no darkness at all (1 John 1:5).'
        },
        {
          question: 'What if we say we have no sin?',
          choices: ['We speak truth', 'We deceive ourselves — the truth is not in us', 'We are perfect', 'We need no Saviour'],
          correctIndex: 1,
          correctFeedback: 'Right! We deceive ourselves, and the truth is not in us.',
          wrongFeedback: 'If we say that we have no sin, we deceive ourselves, and the truth is not in us (1 John 1:8).'
        },
        {
          question: 'Who is our advocate with the Father when we sin?',
          choices: ['Ourselves only', 'Jesus Christ the righteous', 'Angels only', 'No one'],
          correctIndex: 1,
          correctFeedback: 'Yes! We have an advocate with the Father, Jesus Christ the righteous.',
          wrongFeedback: 'If any man sin, we have an advocate with the Father, Jesus Christ the righteous (1 John 2:1).'
        },
        {
          question: 'How did John say we see God’s love?',
          choices: ['He laid down his life for us', 'He gave money only', 'He stayed far away', 'He judged only'],
          correctIndex: 0,
          correctFeedback: 'Yes! Hereby perceive we the love of God, because he laid down his life for us.',
          wrongFeedback: 'Hereby perceive we the love of God, because he laid down his life for us (1 John 3:16).'
        },
        {
          question: 'What can we learn from 1 John?',
          choices: ['Walk in darkness', 'Walk in light, confess sin, love the brethren', 'Sin is fine if hidden', 'Never need Jesus'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Walk in the light, confess sin, love one another in truth.',
          wrongFeedback: 'John wrote that ye may know ye have eternal life — fellowship in light and cleansing in Christ.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — walk in light & love!',
      takeaway: 'Walk in light, confess sin, love others — know eternal life in Christ.',
      prayer: 'God, help me walk in Your light and love my brethren. Thank You for Jesus our advocate. Amen.'
    },

    judeWarning: {
      kjvRef: 'Jude 1',
      paragraphs: [
        'Jude wrote: it was needful for me to write unto you, and exhort you that ye should earnestly contend for the faith which was once delivered unto the saints. For there are certain men crept in unawares, who were before of old ordained to this condemnation, ungodly men, turning the grace of our God into lasciviousness, and denying the only Lord God, and our Lord Jesus Christ.',
        'He reminded them how the Lord destroyed them that believed not, saved Israel out of Egypt, destroyed them that believed not, and the angels which kept not their first estate — and Cain, Balaam, Core.',
        'These are spots in your feasts of charity, clouds they are without water, carried about of winds; trees whose fruit withereth, twice dead, plucked up by the roots; raging waves of the sea, foaming out their own shame; wandering stars, to whom is reserved the blackness of darkness for ever.',
        'But ye, beloved, building up yourselves on your most holy faith, praying in the Holy Ghost, keep yourselves in the love of God, looking for the mercy of our Lord Jesus Christ unto eternal life.',
        'Jude closed with praise: Now unto him that is able to keep you from falling, and to present you faultless before the presence of his glory with exceeding joy, to the only wise God our Saviour, be glory and majesty, dominion and power, both now and ever. Amen.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jude writing contend for the faith once delivered, no text',
        'fun kid illustration: false teachers creeping in unawares, denying the Lord, no text',
        'colorful Bible scene for children: Bible examples of judgment and warning, no text',
        'exciting cartoon: wandering stars, clouds without water, reserved for darkness — sober warning art, no text',
        'hopeful ending illustration: believers building up in faith, praying, God able to keep from falling, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jude warned to contend for the faith!',
      quizHeading: 'Jude’s Warning Questions',
      questions: [
        {
          question: 'What did Jude exhort believers to do?',
          choices: ['Ignore error', 'Earnestly contend for the faith once delivered unto the saints', 'Follow every teacher', 'Stay silent always'],
          correctIndex: 1,
          correctFeedback: 'Yes! Earnestly contend for the faith which was once delivered unto the saints.',
          wrongFeedback: 'I… exhort you that ye should earnestly contend for the faith which was once delivered unto the saints (Jude 3).'
        },
        {
          question: 'Who had crept in unawares?',
          choices: ['Faithful apostles', 'Ungodly men denying the Lord Jesus Christ', 'Angels only', 'Children only'],
          correctIndex: 1,
          correctFeedback: 'Right! Certain men crept in unawares — ungodly, denying our Lord Jesus Christ.',
          wrongFeedback: 'There are certain men crept in unawares… ungodly men… denying the only Lord God, and our Lord Jesus Christ (Jude 4).'
        },
        {
          question: 'Which warnings did Jude recall?',
          choices: ['Israel in Egypt, angels that sinned, Cain, Balaam, Core', 'Only Noah’s ark', 'David’s harp only', 'Paul’s ship only'],
          correctIndex: 0,
          correctFeedback: 'Yes! He pointed to judgment and rebellion in Scripture’s examples.',
          wrongFeedback: 'Jude recalled Israel, angels that sinned, Cain, Balaam, Core, and more (Jude 5–11).'
        },
        {
          question: 'What did Jude tell beloved believers to do?',
          choices: ['Building up on most holy faith, praying in the Holy Ghost, keeping in God’s love', 'Give up', 'Follow false teachers', 'Forget prayer'],
          correctIndex: 0,
          correctFeedback: 'Right! Build up in faith, pray in the Holy Ghost, keep in God’s love.',
          wrongFeedback: 'Building up yourselves on your most holy faith, praying in the Holy Ghost, keep yourselves in the love of God (Jude 20–21).'
        },
        {
          question: 'What can we learn from Jude?',
          choices: ['Contend for the faith — God is able to keep you', 'Believe every wind of doctrine', 'Never pray', 'Be careless'],
          correctIndex: 0,
          correctFeedback: 'Perfect! Stand for the truth — He is able to keep you from falling.',
          wrongFeedback: 'Jude urged contending for the faith and ended with God’s power to keep us unto glory.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — contend for the faith!',
      takeaway: 'Contend for the faith — God is able to keep you from falling.',
      prayer: 'God, help me contend for the faith. Thank You for keeping me in Christ. Amen.'
    },

    revelationLetters: {
      kjvRef: 'Revelation 1–3',
      paragraphs: [
        'John heard the Lord’s voice like a trumpet: I am Alpha and Omega, the first and the last. He saw seven golden candlesticks, and in the midst seven stars — the seven stars are the angels of the seven churches, and the seven candlesticks are the seven churches.',
        'Jesus sent John letters for seven churches in Asia: Ephesus, Smyrna, Pergamos, Thyatira, Sardis, Philadelphia, and Laodicea — each heard what the Spirit said.',
        'Some were praised for works and patience; some were warned to repent — Ephesus was told they had left their first love; Laodicea was neither cold nor hot, but lukewarm.',
        'Over and over Jesus said, He that hath an ear, let him hear what the Spirit saith unto the churches — to him that overcometh He promised crowns, white raiment, names confessed before the Father, and to sup with Him.',
        'The call is clear: be faithful, hold fast, repent, open the door — Jesus walks in the midst of the churches and knows our works.'
      ],
      imagePrompts: [
        'bright cartoon for kids: seven golden lampstands, Jesus in midst, stars in His hand, no text',
        'fun kid illustration: scrolls or letters to seven cities, map of Asia churches, no text',
        'colorful Bible scene for children: faithful church and church needing repentance, no text',
        'exciting cartoon: lukewarm warning and open door for Philadelphia, no text',
        'happy ending illustration: overcomer promises — crown, white raiment, feast with Jesus, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus wrote to seven churches — listen to the Spirit!',
      quizHeading: 'Letters to the Seven Churches Questions',
      questions: [
        {
          question: 'How many churches received these special letters?',
          choices: ['Three', 'Seven', 'Twelve', 'One'],
          correctIndex: 1,
          correctFeedback: 'Yes! Seven churches in Asia.',
          wrongFeedback: 'The seven candlesticks are the seven churches (Revelation 1:20).'
        },
        {
          question: 'What did the seven golden candlesticks represent?',
          choices: ['Seven mountains', 'The seven churches', 'Seven seas', 'Seven kings only'],
          correctIndex: 1,
          correctFeedback: 'Right! The seven candlesticks which thou sawest are the seven churches.',
          wrongFeedback: 'The seven candlesticks which thou sawest are the seven churches (Revelation 1:20).'
        },
        {
          question: 'What did Jesus say to him that hath an ear?',
          choices: ['Sleep', 'Hear what the Spirit saith unto the churches', 'Run away', 'Hide the letter'],
          correctIndex: 1,
          correctFeedback: 'Yes! He that hath an ear, let him hear what the Spirit saith unto the churches.',
          wrongFeedback: 'He that hath an ear, let him hear what the Spirit saith unto the churches (e.g. Revelation 2:7).'
        },
        {
          question: 'What had Ephesus left, according to Jesus?',
          choices: ['Their city', 'Their first love', 'Their Bibles', 'Their names'],
          correctIndex: 1,
          correctFeedback: 'Thou hast left thy first love — remember, repent, do the first works.',
          wrongFeedback: 'Thou hast left thy first love (Revelation 2:4).'
        },
        {
          question: 'What can we learn from the seven letters?',
          choices: ['Jesus does not see the church', 'Jesus knows our works — repent, endure, overcome', 'All churches are the same', 'Never listen'],
          correctIndex: 1,
          correctFeedback: 'Perfect! He walks among the lampstands — hear His correction and promise.',
          wrongFeedback: 'These things saith he that walketh in the midst of the seven golden candlesticks (Revelation 2:1).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — hear what the Spirit saith!',
      takeaway: 'Jesus knows His church — repent, be faithful, overcome.',
      prayer: 'Lord Jesus, help me hear what the Spirit saith, and follow Thee faithfully. Amen.'
    },

    revelationSeals: {
      kjvRef: 'Revelation 6–8:1',
      paragraphs: [
        'John saw the Lamb open the first seal: a white horse, and he that sat on him had a bow; and a crown was given unto him, and he went forth conquering.',
        'The second seal: a red horse; power was given to him that sat thereon to take peace from the earth, and that they should kill one another.',
        'The third seal: a black horse; he that sat on him had a pair of balances — a measure of wheat for a penny, famine prices.',
        'The fourth seal: a pale horse; his name that sat on him was Death, and Hell followed with him — power was given over the fourth part of the earth, to kill with sword, hunger, death, and beasts.',
        'The fifth seal: souls under the altar cried, How long, O Lord? They were given white robes and told to rest until their brethren should be fulfilled. The sixth seal: great earthquake, sun black, moon blood, stars fell — men hid from the wrath of the Lamb. When the Lamb opened the seventh seal, there was silence in heaven about the space of half an hour.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Lamb opening first seal, white horse rider with bow and crown, no text',
        'fun kid illustration: red horse, peace taken from earth, people in strife, no text',
        'colorful Bible scene for children: black horse with balances, famine, no text',
        'exciting cartoon: pale horse Death, hell following, fourth part of earth, no text',
        'hopeful ending illustration: souls under altar in white robes, sixth seal sky dark, silence in heaven, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The Lamb opens the seals — God is sovereign!',
      quizHeading: 'Seven Seals Questions',
      questions: [
        {
          question: 'Who opened the seals on the book?',
          choices: ['John only', 'The Lamb (Jesus)', 'A beast', 'Twenty-four elders alone'],
          correctIndex: 1,
          correctFeedback: 'Yes! The Lamb — Jesus — loosed the seals.',
          wrongFeedback: 'The Lamb opened the seals of the book (Revelation 6:1; see 5:5–9).'
        },
        {
          question: 'What came forth when the first seal was opened?',
          choices: ['A red horse only', 'A white horse — rider with bow and crown', 'Death only', 'A scroll'],
          correctIndex: 1,
          correctFeedback: 'Right! A white horse; he that sat on him had a bow, and a crown was given him.',
          wrongFeedback: 'A white horse… he that sat on him had a bow; and a crown was given unto him (Revelation 6:2).'
        },
        {
          question: 'What did the second seal bring?',
          choices: ['Peace for all', 'Power to take peace from the earth — men kill one another', 'Rain and crops', 'Silence only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Power was given to take peace from the earth.',
          wrongFeedback: 'Power was given to him that sat thereon to take peace from the earth (Revelation 6:4).'
        },
        {
          question: 'What did the rider on the black horse hold?',
          choices: ['A sword only', 'A pair of balances (scales)', 'A crown only', 'A trumpet'],
          correctIndex: 1,
          correctFeedback: 'Right! A pair of balances — famine prices.',
          wrongFeedback: 'Lo, a black horse; and he that sat on him had a pair of balances in his hand (Revelation 6:5).'
        },
        {
          question: 'What can we learn from the seals?',
          choices: ['God is not on His throne', 'God is sovereign — the Lamb opens history according to His will', 'Never read Revelation', 'Judgment is pretend'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The Lamb is worthy — God reigns over judgment and mercy.',
          wrongFeedback: 'The seals show the Lamb’s authority and God’s righteous government of the world.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God is sovereign!',
      takeaway: 'The Lamb is worthy — God reigns over judgment and history.',
      prayer: 'Lord, Thou art worthy. Help me trust Thy holy will. Amen.'
    },

    revelationTrumpets: {
      kjvRef: 'Revelation 8–11',
      paragraphs: [
        'When the seventh seal was opened, there was silence in heaven about the space of half an hour. Seven angels stood before God, and seven trumpets were given them.',
        'The first angel sounded: hail and fire mingled with blood were cast upon the earth; the third part of trees was burnt up, and all green grass.',
        'The second angel sounded: a great mountain burning with fire was cast into the sea; the third part of the sea became blood, a third part of creatures died, ships destroyed.',
        'The third angel sounded: a great star fell, called Wormwood; the third part of waters became wormwood, and many men died. The fourth angel sounded: the third part of sun, moon, and stars was smitten — day and night darkened.',
        'The fifth and sixth trumpets brought woe upon men — yet they repented not. The seventh angel sounded: voices in heaven said, The kingdoms of this world are become the kingdoms of our Lord, and of his Christ; and he shall reign for ever and ever.'
      ],
      imagePrompts: [
        'bright cartoon for kids: silence in heaven, seven angels with trumpets before God, no text',
        'fun kid illustration: hail and fire mingled with blood, third of trees burned, no text',
        'colorful Bible scene for children: burning mountain cast into sea, ships broken, no text',
        'exciting cartoon: star Wormwood falling, bitter waters, no text',
        'hopeful ending illustration: seventh trumpet, kingdoms of the world become Christ’s, worship, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Trumpets warn — God calls sinners to repent!',
      quizHeading: 'Seven Trumpets Questions',
      questions: [
        {
          question: 'What happened when the seventh seal was opened?',
          choices: ['Immediate trumpet', 'Silence in heaven about half an hour', 'The sea dried up', 'A feast'],
          correctIndex: 1,
          correctFeedback: 'Yes! Silence in heaven about the space of half an hour.',
          wrongFeedback: 'When he had opened the seventh seal, there was silence in heaven about the space of half an hour (Revelation 8:1).'
        },
        {
          question: 'What did the first trumpet bring?',
          choices: ['Only rain', 'Hail and fire mingled with blood — third part of trees and grass burned', 'Locusts', 'Darkness only'],
          correctIndex: 1,
          correctFeedback: 'Right! Hail and fire mingled with blood upon the earth.',
          wrongFeedback: 'Hail and fire mingled with blood… the third part of trees was burnt up, and all green grass (Revelation 8:7).'
        },
        {
          question: 'What fell at the third trumpet?',
          choices: ['A great star called Wormwood', 'A white horse', 'A crown', 'A sword'],
          correctIndex: 0,
          correctFeedback: 'Yes! Wormwood made the waters bitter — many died.',
          wrongFeedback: 'There fell a great star from heaven, burning as it were a lamp, and it fell upon the third part of the rivers… the name of the star is Wormwood (Revelation 8:10–11).'
        },
        {
          question: 'What did the fourth trumpet strike?',
          choices: ['Only the sea', 'The third part of the sun, moon, and stars', 'The Lamb', 'Jerusalem only'],
          correctIndex: 1,
          correctFeedback: 'Right! A third of sun, moon, and stars smitten.',
          wrongFeedback: 'The fourth angel sounded… the third part of the sun was smitten… moon… stars (Revelation 8:12).'
        },
        {
          question: 'What can we learn from the trumpets?',
          choices: ['God never warns', 'God’s judgments show sin is serious — repent while He is patient', 'Ignore Scripture', 'Never fear God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Humble your heart — turn to the Lord.',
          wrongFeedback: 'They repented not of their deeds (Revelation 9:20–21) — yet God’s patience still calls us to repentance (2 Peter 3:9).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — hear God’s warning!',
      takeaway: 'God’s warnings are real — repent and trust Christ.',
      prayer: 'God, soften my heart to repent and follow Thee. Amen.'
    },

    revelationBeasts: {
      kjvRef: 'Revelation 13',
      paragraphs: [
        'John saw a beast rise up out of the sea, having seven heads and ten horns, and upon his horns ten crowns, and upon his heads the name of blasphemy.',
        'The dragon gave him his power, and his seat, and great authority. All the world wondered after the beast and worshipped the dragon which gave power unto the beast.',
        'There was given unto him a mouth speaking great things and blasphemies — and power to make war with the saints and to overcome them.',
        'Another beast came up out of the earth; he had two horns like a lamb, and he spake as a dragon.',
        'He exerciseth all the power of the first beast… causeth the earth to worship the first beast, and causeth all to receive a mark in their right hand or forehead — no man might buy or sell save he that had the mark. Here is wisdom: the number of the beast is the number of a man — six hundred threescore and six.'
      ],
      imagePrompts: [
        'bright cartoon for kids: beast from sea, seven heads, ten horns, crowns, no text',
        'fun kid illustration: dragon giving power, people wondering after the beast, no text',
        'colorful Bible scene for children: beast speaking great blasphemies, war on saints, no text',
        'exciting cartoon: second beast from earth, horns like lamb, voice like dragon, no text',
        'hopeful ending illustration: faithful saints refusing mark, trusting God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The beasts oppose God — stay faithful to Jesus!',
      quizHeading: 'The Beasts in Revelation Questions',
      questions: [
        {
          question: 'Where did the first beast come from?',
          choices: ['Out of heaven', 'Out of the sea', 'Out of the temple only', 'Out of the desert sand only'],
          correctIndex: 1,
          correctFeedback: 'Yes! A beast rose up out of the sea.',
          wrongFeedback: 'I saw a beast rise up out of the sea (Revelation 13:1).'
        },
        {
          question: 'Who gave the beast his power and seat?',
          choices: ['The Lamb', 'The dragon (Satan)', 'John', 'The elders'],
          correctIndex: 1,
          correctFeedback: 'Right! The dragon gave him power, seat, and great authority.',
          wrongFeedback: 'The dragon gave him his power, and his seat, and great authority (Revelation 13:2).'
        },
        {
          question: 'What did the beast do to the saints?',
          choices: ['Made peace only', 'Made war on them and overcame them', 'Fed them only', 'Ignored them'],
          correctIndex: 1,
          correctFeedback: 'Yes! Power to make war with the saints and overcome them.',
          wrongFeedback: 'Power was given him… to make war with the saints, and to overcome them (Revelation 13:7).'
        },
        {
          question: 'What did the second beast cause?',
          choices: ['Worship of God only', 'The earth to worship the first beast', 'Everyone to flee', 'Rain only'],
          correctIndex: 1,
          correctFeedback: 'Yes! He causeth the earth to worship the first beast.',
          wrongFeedback: 'He exerciseth all the power of the first beast… and causeth the earth and them which dwell therein to worship the first beast (Revelation 13:12).'
        },
        {
          question: 'What can we learn from the beasts?',
          choices: ['Take any mark offered', 'Worship God alone — be faithful though the world pressures you', 'Follow the dragon', 'Hide from Jesus'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Fear God more than popularity — cling to Christ.',
          wrongFeedback: 'The beast demands worship and compliance — God’s people trust the Lamb who was slain (Revelation 5:9, 13:8).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — be faithful to Jesus!',
      takeaway: 'Worship God alone — be faithful when the world pressures you.',
      prayer: 'Lord Jesus, I worship Thee. Keep me faithful to Thee alone. Amen.'
    },

    revelationThousandYears: {
      kjvRef: 'Revelation 20',
      paragraphs: [
        'John saw an angel come down from heaven with the key of the bottomless pit and a great chain. He laid hold on the dragon, that old serpent, which is the Devil, and Satan, and bound him a thousand years, and cast him into the bottomless pit.',
        'Satan was shut up that he should deceive the nations no more till the thousand years should be fulfilled: after that he must be loosed a little season.',
        'John saw thrones — souls beheaded for the witness of Jesus lived and reigned with Christ a thousand years. This is the first resurrection: blessed and holy is he that hath part in it.',
        'When the thousand years are expired, Satan shall be loosed out of his prison, and shall go out to deceive the nations and gather them to battle. Fire came down from God out of heaven and devoured them.',
        'The devil was cast into the lake of fire and brimstone… and the dead were judged out of those things written in the books. Death and hell were cast into the lake of fire.'
      ],
      imagePrompts: [
        'bright cartoon for kids: angel with key and chain binding dragon, bottomless pit, no text',
        'fun kid illustration: saints reigning with Christ, thrones, thousand years, no text',
        'colorful Bible scene for children: Satan loosed, nations deceived, armies gathered, no text',
        'exciting cartoon: fire from heaven devouring enemies, no text',
        'hopeful ending illustration: devil in lake of fire, great white throne judgment, God’s justice, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Satan bound — then loosed — then judged forever!',
      quizHeading: 'Thousand Years & Final Judgment Questions',
      questions: [
        {
          question: 'What did the angel do to Satan for a thousand years?',
          choices: ['Let him go free', 'Bound him and cast him into the bottomless pit', 'Made him king', 'Ignored him'],
          correctIndex: 1,
          correctFeedback: 'Yes! Bound a thousand years in the bottomless pit.',
          wrongFeedback: 'He laid hold on the dragon… bound him a thousand years, and cast him into the bottomless pit (Revelation 20:1–3).'
        },
        {
          question: 'Who reigned with Christ a thousand years?',
          choices: ['Only angels in heaven', 'Souls beheaded for Jesus’ witness — first resurrection', 'Only Roman kings', 'No one'],
          correctIndex: 1,
          correctFeedback: 'Right! They lived and reigned with Christ a thousand years.',
          wrongFeedback: 'I saw the souls of them that were beheaded for the witness of Jesus… and they lived and reigned with Christ a thousand years (Revelation 20:4).'
        },
        {
          question: 'What happened after the thousand years ended?',
          choices: ['Nothing more', 'Satan loosed a little season, deceives nations', 'New Jerusalem instantly with no battle', 'The sea returned'],
          correctIndex: 1,
          correctFeedback: 'Yes! Loosed to deceive the nations again for a short time.',
          wrongFeedback: 'When the thousand years are expired, Satan shall be loosed out of his prison (Revelation 20:7).'
        },
        {
          question: 'Where was the devil cast at the end?',
          choices: ['Back to the pit only', 'Into the lake of fire and brimstone', 'Into the sea only', 'Up to heaven'],
          correctIndex: 1,
          correctFeedback: 'Yes! Cast into the lake of fire and brimstone for ever.',
          wrongFeedback: 'The devil… was cast into the lake of fire and brimstone (Revelation 20:10).'
        },
        {
          question: 'What can we learn from Revelation 20?',
          choices: ['Evil wins in the end', 'God’s justice is sure — the faithful reign; evil is judged', 'Never hope', 'Judgment is a story only'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Christ reigns — Satan’s end is sealed.',
          wrongFeedback: 'Blessed and holy is he that hath part in the first resurrection (Revelation 20:6).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God’s justice prevails!',
      takeaway: 'God’s justice is sure — Christ reigns; evil is judged.',
      prayer: 'Lord, thank Thee for final justice. Keep me faithful unto Thee. Amen.'
    },

    revelationNewJerusalem: {
      kjvRef: 'Revelation 21–22',
      paragraphs: [
        'John saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea.',
        'He saw the holy city, new Jerusalem, coming down from God out of heaven, prepared as a bride adorned for her husband. God shall wipe away all tears — no more death, sorrow, crying, or pain.',
        'He that sat upon the throne said, Behold, I make all things new. He will dwell with them, and they shall be his people, and God himself shall be with them, and be their God.',
        'The city had no need of the sun, neither of the moon, to shine in it: the glory of God did lighten it, and the Lamb is the light thereof. The nations shall walk in the light of it.',
        'John saw a pure river of water of life… and the tree of life. The Spirit and the bride say, Come. Let him that heareth say, Come. Whosoever will, let him take the water of life freely.'
      ],
      imagePrompts: [
        'bright cartoon for kids: new heaven and new earth, old passed away, no text',
        'fun kid illustration: New Jerusalem descending like a bride, God wiping tears, no text',
        'colorful Bible scene for children: throne voice — Behold I make all things new, no text',
        'exciting cartoon: city lit by God’s glory and the Lamb, nations walking in light, no text',
        'happy ending illustration: river of life, tree of life, Spirit and bride say Come, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God makes all things new — Come, thirsty soul!',
      quizHeading: 'New Jerusalem Questions',
      questions: [
        {
          question: 'What did John see after the first heaven and earth?',
          choices: ['The same world only', 'A new heaven and a new earth', 'Only darkness', 'Only the sea bigger'],
          correctIndex: 1,
          correctFeedback: 'Yes! A new heaven and a new earth.',
          wrongFeedback: 'I saw a new heaven and a new earth: for the first heaven and the first earth were passed away (Revelation 21:1).'
        },
        {
          question: 'What did He that sat on the throne say?',
          choices: ['All things stay old', 'Behold, I make all things new', 'Turn back', 'Forget my people'],
          correctIndex: 1,
          correctFeedback: 'Right! Behold, I make all things new.',
          wrongFeedback: 'And he that sat upon the throne said, Behold, I make all things new (Revelation 21:5).'
        },
        {
          question: 'What will be gone for God’s people there?',
          choices: ['Joy and light', 'Death, sorrow, crying, and pain', 'God’s presence', 'The Lamb'],
          correctIndex: 1,
          correctFeedback: 'Yes! God shall wipe away all tears — no more death and pain.',
          wrongFeedback: 'God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain (Revelation 21:4).'
        },
        {
          question: 'What lights the holy city?',
          choices: ['Sun and moon only', 'The glory of God and the Lamb', 'Torches only', 'Stars only'],
          correctIndex: 1,
          correctFeedback: 'Yes! The city has no need of sun or moon — God and the Lamb are the light.',
          wrongFeedback: 'The city had no need of the sun… the glory of God did lighten it, and the Lamb is the light thereof (Revelation 21:23).'
        },
        {
          question: 'What can we learn from New Jerusalem?',
          choices: ['Pain lasts forever', 'God renews all things — Come to the water of life', 'Never hope', 'Jesus stays away'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The Spirit and the bride say, Come.',
          wrongFeedback: 'Whosoever will, let him take the water of life freely (Revelation 22:17).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God makes all things new!',
      takeaway: 'God makes all things new — Come, take the water of life freely.',
      prayer: 'Lord Jesus, thank Thee for the new heaven and earth. Come, Lord. Amen.'
    },

    revelationWomanDragon: {
      kjvRef: 'Revelation 12',
      paragraphs: [
        'A great wonder in heaven: a woman clothed with the sun, the moon under her feet, and upon her head a crown of twelve stars — travailing in birth, pained to be delivered.',
        'Another wonder: a great red dragon, having seven heads and ten horns, and seven crowns upon his heads — his tail drew the third part of the stars; the dragon stood before the woman to devour her child as soon as it was born.',
        'She brought forth a man child, who was to rule all nations with a rod of iron: her child was caught up unto God, and to his throne.',
        'Michael and his angels fought against the dragon; the dragon fought and his angels, and prevailed not — he was cast out, that old serpent, called the Devil, and Satan.',
        'They overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death.'
      ],
      imagePrompts: [
        'bright cartoon for kids: woman clothed with sun, moon under feet, crown of twelve stars, expecting child, no text',
        'fun kid illustration: great red dragon seven heads ten horns waiting to devour child, no text',
        'colorful Bible scene for children: man child caught up to God and His throne, no text',
        'exciting cartoon: Michael and angels fighting dragon, dragon cast out of heaven to earth, no text',
        'hopeful ending illustration: saints overcoming by blood of Lamb and testimony, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'They overcame by the blood of the Lamb!',
      quizHeading: 'Woman, Child & Dragon Questions',
      questions: [
        {
          question: 'What wonder appeared in heaven first?',
          choices: ['The dragon only', 'A woman clothed with the sun, moon under feet, crown of twelve stars', 'A beast from the sea', 'A throne alone'],
          correctIndex: 1,
          correctFeedback: 'Yes! A woman clothed with the sun, the moon under her feet, twelve-star crown.',
          wrongFeedback: 'There appeared a great wonder in heaven; a woman clothed with the sun… (Revelation 12:1).'
        },
        {
          question: 'What did the red dragon want to do?',
          choices: ['Protect the woman', 'Devour her child as soon as it was born', 'Give gifts', 'Sing praise'],
          correctIndex: 1,
          correctFeedback: 'Right! The dragon stood before the woman to devour her child.',
          wrongFeedback: 'The dragon stood before the woman… to devour her child as soon as it was born (Revelation 12:4).'
        },
        {
          question: 'What happened to the man child?',
          choices: ['The dragon devoured him', 'He was caught up unto God, and to his throne', 'He hid in Egypt', 'He stayed in the manger'],
          correctIndex: 1,
          correctFeedback: 'Yes! Caught up unto God, and to his throne.',
          wrongFeedback: 'Her child was caught up unto God, and to his throne (Revelation 12:5).'
        },
        {
          question: 'Who fought the dragon in heaven?',
          choices: ['The woman', 'Michael and his angels', 'The twenty-four elders only', 'John'],
          correctIndex: 1,
          correctFeedback: 'Yes! Michael and his angels fought against the dragon.',
          wrongFeedback: 'There was war in heaven: Michael and his angels fought against the dragon (Revelation 12:7).'
        },
        {
          question: 'How did they overcome the dragon?',
          choices: ['By their own strength only', 'By the blood of the Lamb and the word of their testimony', 'By hiding only', 'By paying money'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The blood of the Lamb and the word of their testimony.',
          wrongFeedback: 'They overcame him by the blood of the Lamb, and by the word of their testimony (Revelation 12:11).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — overcome by the Lamb’s blood!',
      takeaway: 'Overcome by the blood of the Lamb and the word of your testimony.',
      prayer: 'Lord Jesus, thank Thee for Thy blood. Help me stand true for Thee. Amen.'
    },

    revelationSongsAndHarvest: {
      kjvRef: 'Revelation 14–15',
      paragraphs: [
        'John looked, and lo, the Lamb stood on mount Sion, and with him an hundred forty and four thousand, having his Father’s name written in their foreheads. They sang a new song before the throne — no man could learn that song but the redeemed.',
        'These are they which follow the Lamb whithersoever he goeth; they are virgins, and in their mouth was found no guile.',
        'An angel flew with the everlasting gospel: Fear God, and give glory to him; for the hour of his judgment is come. Another cried, Babylon is fallen. A third warned: worship not the beast nor his image, neither receive his mark.',
        'Another angel thrust in his sickle — the earth was reaped; the vintage of the earth was gathered into the great winepress of the wrath of God.',
        'John saw them that had gotten the victory over the beast stand on a sea of glass mingled with fire, having the harps of God — they sing the song of Moses the servant of God, and the song of the Lamb.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Lamb on Mount Zion, 144000 with Father’s name on foreheads, no text',
        'fun kid illustration: redeemed singing new song before throne, following the Lamb, no text',
        'colorful Bible scene for children: three angels flying, everlasting gospel, Babylon fallen, mark warning, no text',
        'exciting cartoon: angel with sickle reaping ripe earth, no text',
        'hopeful ending illustration: victors on sea of glass mingled with fire, harps, song of Moses and Lamb, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The redeemed sing — victory over the beast!',
      quizHeading: 'Songs & Harvest Questions',
      questions: [
        {
          question: 'Who stood on mount Sion with the Lamb?',
          choices: ['The dragon', 'An hundred forty and four thousand with Father’s name in their foreheads', 'The beast only', 'Ten kings only'],
          correctIndex: 1,
          correctFeedback: 'Yes! The Lamb with the hundred forty and four thousand.',
          wrongFeedback: 'The Lamb stood on mount Sion, and with him an hundred forty and four thousand (Revelation 14:1).'
        },
        {
          question: 'What did the redeemed sing?',
          choices: ['An old psalm only', 'A new song only they could learn', 'Silence', 'A battle cry'],
          correctIndex: 1,
          correctFeedback: 'Right! A new song before the throne.',
          wrongFeedback: 'They sung as it were a new song… no man could learn that song but the hundred and forty and four thousand (Revelation 14:3).'
        },
        {
          question: 'What did the first flying angel proclaim?',
          choices: ['Fear God, and give glory to him — the hour of his judgment is come', 'Worship the beast', 'Hide from heaven', 'Babylon shall never fall'],
          correctIndex: 0,
          correctFeedback: 'Yes! Fear God, and give glory to him; for the hour of his judgment is come.',
          wrongFeedback: 'Fear God, and give glory to him; for the hour of his judgment is come (Revelation 14:7).'
        },
        {
          question: 'What did the third angel warn against?',
          choices: ['Prayer', 'Worshipping the beast and receiving his mark', 'Reading Scripture', 'Singing'],
          correctIndex: 1,
          correctFeedback: 'Yes! Worship not the beast, his image, nor receive his mark.',
          wrongFeedback: 'If any man worship the beast and his image, and receive his mark… (Revelation 14:9).'
        },
        {
          question: 'What can we learn from these chapters?',
          choices: ['God never judges', 'The redeemed sing God’s praise — His judgment is true and good', 'Never sing', 'Ignore the gospel'],
          correctIndex: 1,
          correctFeedback: 'Perfect! True worship and the songs of Moses and the Lamb honour God.',
          wrongFeedback: 'They sing the song of Moses… and the song of the Lamb (Revelation 15:3).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — sing the Lamb’s song!',
      takeaway: 'Fear God, give Him glory — the Lamb is worthy of true worship.',
      prayer: 'Lord, Thou art worthy. Help me fear Thee and glorify Thy name. Amen.'
    },

    revelationSupperAndKing: {
      kjvRef: 'Revelation 19',
      paragraphs: [
        'John heard a great voice of much people in heaven, saying, Alleluia; Salvation, and glory, and honour, and power, unto the Lord our God.',
        'The marriage of the Lamb is come, and his wife hath made herself ready — to her was granted that she should be arrayed in fine linen, clean and white: for the fine linen is the righteousness of saints.',
        'John saw heaven opened, and behold a white horse; he that sat upon him was called Faithful and True, and in righteousness he doth judge and make war. His name is The Word of God, King of kings, and Lord of lords.',
        'The beast was taken, and with him the false prophet that wrought miracles before him — these both were cast alive into a lake of fire burning with brimstone.',
        'The fowls were called to the supper of the great God — the Lord God omnipotent reigneth.'
      ],
      imagePrompts: [
        'bright cartoon for kids: great multitude in heaven shouting Alleluia, joy, no text',
        'fun kid illustration: marriage of the Lamb, bride in fine linen white and clean, no text',
        'colorful Bible scene for children: Faithful and True on white horse, Word of God, King of kings, no text',
        'exciting cartoon: beast and false prophet cast into lake of fire, no text',
        'hopeful ending illustration: God omnipotent reigneth, heaven’s joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Alleluia! The marriage of the Lamb!',
      quizHeading: 'Marriage Supper & King Questions',
      questions: [
        {
          question: 'What did the great multitude cry?',
          choices: ['Alleluia — salvation, glory, honour, and power to the Lord', 'Be silent', 'We surrender', 'Flee'],
          correctIndex: 0,
          correctFeedback: 'Yes! Alleluia; Salvation, and glory, and honour, and power, unto the Lord our God.',
          wrongFeedback: 'A great voice… saying, Alleluia; Salvation, and glory, and honour, and power (Revelation 19:1, 6).'
        },
        {
          question: 'What does the fine linen of the bride represent?',
          choices: ['Gold coins', 'The righteousness of saints', 'Purple robes of kings', 'Animal skins'],
          correctIndex: 1,
          correctFeedback: 'Right! The fine linen is the righteousness of saints.',
          wrongFeedback: 'The fine linen is the righteousness of saints (Revelation 19:8).'
        },
        {
          question: 'How did the Word of God appear when heaven opened?',
          choices: ['On a red horse', 'On a white horse — Faithful and True, King of kings', 'On foot only', 'Hidden in a cloud only'],
          correctIndex: 1,
          correctFeedback: 'Yes! A white horse; he that sat upon him was called Faithful and True.',
          wrongFeedback: 'I saw heaven opened, and behold a white horse; and he that sat upon him was called Faithful and True (Revelation 19:11).'
        },
        {
          question: 'What happened to the beast and false prophet?',
          choices: ['They escaped', 'Cast alive into the lake of fire burning with brimstone', 'They repented', 'They ruled Jerusalem'],
          correctIndex: 1,
          correctFeedback: 'Yes! Cast alive into the lake of fire.',
          wrongFeedback: 'The beast was taken, and with him the false prophet… cast alive into a lake of fire burning with brimstone (Revelation 19:20).'
        },
        {
          question: 'What can we learn from Revelation 19?',
          choices: ['Evil wins forever', 'Jesus reigns — the marriage of the Lamb and true judgment', 'Never rejoice', 'God is weak'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The Lord God omnipotent reigneth.',
          wrongFeedback: 'The Lord God omnipotent reigneth (Revelation 19:6).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Alleluia! Jesus reigns!',
      takeaway: 'The Lamb’s bride is ready — Christ is Faithful and True.',
      prayer: 'Lord Jesus, thank Thee for Thy victory. Make me ready for Thy marriage supper. Amen.'
    },

    revelationBabylonFall: {
      kjvRef: 'Revelation 17–18',
      paragraphs: [
        'John saw a woman sit upon a scarlet coloured beast, full of names of blasphemy, having seven heads and ten horns — upon her forehead a name: Mystery, Babylon the Great, the Mother of Harlots and Abominations of the Earth.',
        'She was arrayed in purple and scarlet colour, decked with gold, precious stones, and pearls, having a golden cup in her hand full of abominations and filthiness of her fornication — drunk with the blood of the saints.',
        'The ten horns shall hate the whore, make her desolate and naked, eat her flesh, and burn her with fire — God hath put in their hearts to fulfil his will.',
        'Another angel cried mightily, Babylon the great is fallen, is fallen — merchants and kings wail, for her riches are gone in one hour.',
        'A voice from heaven said, Come out of her, my people, that ye be not partakers of her sins, and that ye receive not of her plagues — Rejoice over her, thou heaven, and ye holy apostles and prophets.'
      ],
      imagePrompts: [
        'bright cartoon for kids: woman on scarlet beast, mystery Babylon, golden cup, no text',
        'fun kid illustration: kings and merchants weeping over fallen riches, no text',
        'colorful Bible scene for children: beast and horns hate the city, fire, no text',
        'exciting cartoon: angel crying Babylon is fallen is fallen, no text',
        'hopeful ending illustration: God’s people coming out, heaven rejoicing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Come out of her, my people — Babylon falls!',
      quizHeading: 'Babylon’s Fall Questions',
      questions: [
        {
          question: 'What name was on the woman’s forehead?',
          choices: ['Jerusalem', 'Mystery, Babylon the Great, Mother of Harlots', 'Rome only', 'Mary'],
          correctIndex: 1,
          correctFeedback: 'Yes! Mystery, Babylon the Great.',
          wrongFeedback: 'Upon her forehead was a name written, Mystery, Babylon the Great (Revelation 17:5).'
        },
        {
          question: 'What was she drunk with?',
          choices: ['Water only', 'The blood of the saints and martyrs', 'Oil', 'Milk'],
          correctIndex: 1,
          correctFeedback: 'Right! Drunk with the blood of the saints.',
          wrongFeedback: 'Drunken with the blood of the saints, and with the blood of the martyrs of Jesus (Revelation 17:6).'
        },
        {
          question: 'What did the ten horns do to her?',
          choices: ['Crowned her queen', 'Hated her, made her desolate, burned her with fire', 'Built her towers', 'Ignored her'],
          correctIndex: 1,
          correctFeedback: 'Yes! Hated, stripped, eaten, burned.',
          wrongFeedback: 'These shall hate the whore, and shall make her desolate… and shall burn her with fire (Revelation 17:16).'
        },
        {
          question: 'What did the mighty angel cry?',
          choices: ['Babylon shall stand forever', 'Babylon the great is fallen, is fallen', 'Come into Babylon', 'Peace, peace'],
          correctIndex: 1,
          correctFeedback: 'Yes! Babylon the great is fallen, is fallen.',
          wrongFeedback: 'Babylon the great is fallen, is fallen (Revelation 18:2).'
        },
        {
          question: 'What can we learn from Babylon’s fall?',
          choices: ['Stay in sin’s crowd', 'Come out of her — do not share her sins or plagues', 'Love money more than God', 'Never rejoice in justice'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God calls His people out — heaven rejoices at His judgments.',
          wrongFeedback: 'Come out of her, my people, that ye be not partakers of her sins (Revelation 18:4).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — come out and be holy!',
      takeaway: 'Come out of corrupt Babylon — share not in her sins.',
      prayer: 'Lord, call me out of evil. Keep me clean in Thy truth. Amen.'
    },

    johnSecondThirdLetters: {
      kjvRef: '2 John; 3 John',
      paragraphs: [
        'The elder unto the elect lady and her children… I beseech thee, lady, not as though I wrote a new commandment, but that which we had from the beginning, that we love one another. And this is love, that we walk after his commandments.',
        'Many deceivers are entered into the world, who confess not that Jesus Christ is come in the flesh. Look to yourselves, that we lose not those things which we have wrought, but receive a full reward.',
        'The elder unto the wellbeloved Gaius, whom I love in the truth… I have no greater joy than to hear that my children walk in truth. For the brethren’s sake thou hast done faithfully… thou shalt do well to send them on their way after a godly sort.',
        'I wrote unto the church: but Diotrephes, who loveth to have the preeminence among them, receiveth us not… forbiddeth them that would, and casteth them out of the church.',
        'Demetrius hath good report of all men, and of the truth itself: yea, and we also bear record; and ye know that our record is true. Beloved, follow not that which is evil, but that which is good.'
      ],
      imagePrompts: [
        'bright cartoon for kids: John writing to elect lady and children, walk in truth and love, no text',
        'fun kid illustration: deceivers not confessing Christ come in the flesh, do not bid them God speed, no text',
        'colorful Bible scene for children: Gaius welcoming brethren, hospitality for truth, no text',
        'exciting cartoon: Diotrephes refusing brethren, wanting first place, no text',
        'happy ending illustration: Demetrius good report, follow good not evil, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Walk in truth; welcome brethren; follow good!',
      quizHeading: '2 John & 3 John Questions',
      questions: [
        {
          question: 'What is love in 2 John?',
          choices: ['Walking after God’s commandments', 'Buying gifts only', 'Staying silent always', 'Ignoring truth'],
          correctIndex: 0,
          correctFeedback: 'Yes! This is love, that we walk after his commandments.',
          wrongFeedback: 'This is love, that we walk after his commandments (2 John 1:6).'
        },
        {
          question: 'What did John say to do with deceivers who deny Jesus Christ come in the flesh?',
          choices: ['Receive them into your house and bid them God speed', 'Receive him not… neither bid him God speed', 'Follow them', 'Give them money'],
          correctIndex: 1,
          correctFeedback: 'Right! Receive him not into your house, neither bid him God speed.',
          wrongFeedback: 'Receive him not into your house, neither bid him God speed (2 John 1:10–11).'
        },
        {
          question: 'Whom did John praise in 3 John?',
          choices: ['Diotrephes', 'Gaius — faithful hospitality to the brethren', 'Demetrius only', 'No one'],
          correctIndex: 1,
          correctFeedback: 'Yes! Gaius walked in truth and lodged brethren faithfully.',
          wrongFeedback: 'Beloved, thou doest faithfully whatsoever thou doest to the brethren (3 John 1:5–6).'
        },
        {
          question: 'What was wrong with Diotrephes?',
          choices: ['He loved preeminence and refused the brethren', 'He sang too loud', 'He gave too much', 'He was too shy'],
          correctIndex: 0,
          correctFeedback: 'Yes! He loved to have the preeminence and cast out those who helped.',
          wrongFeedback: 'Diotrephes, who loveth to have the preeminence among them, receiveth us not (3 John 1:9–10).'
        },
        {
          question: 'What can we learn from 2 & 3 John?',
          choices: ['Walk in truth and love, welcome workers for Christ, follow good', 'Seek preeminence', 'Turn away all travellers', 'Follow evil'],
          correctIndex: 0,
          correctFeedback: 'Perfect! Truth, love, hospitality, and following good.',
          wrongFeedback: 'Follow not that which is evil, but that which is good (3 John 1:11).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — walk in truth & love!',
      takeaway: 'Walk in truth and love; welcome Christ’s servants; follow good.',
      prayer: 'Lord, help me walk in Thy truth, love the brethren, and follow good. Amen.'
    },

    actsApollosPriscilla: {
      kjvRef: 'Acts 18:24–28',
      paragraphs: [
        'A Jew named Apollos came to Ephesus. He was eloquent and mighty in the scriptures, but he knew only the baptism of John.',
        'He spake boldly in the synagogue. When Priscilla and Aquila heard him, they took him unto them, and expounded unto him the way of God more perfectly.',
        'Apollos was willing to learn. When he was disposed to pass into Achaia, the brethren wrote, exhorting the disciples to receive him.',
        'He helped them much which had believed through grace. He mightily convinced the Jews, and that publickly, shewing by the scriptures that Jesus was Christ.',
        'Priscilla and Aquila taught Apollos more perfectly — God uses teachers to grow His servants.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Apollos speaking boldly in synagogue, eloquent and mighty in scriptures, no text',
        'fun kid illustration: Priscilla and Aquila with Apollos, expounding the way of God more perfectly, no text',
        'colorful Bible scene for children: letters from brethren, Apollos going to Achaia, no text',
        'exciting cartoon: Apollos helping believers, convincing Jews from scriptures that Jesus is Christ, no text',
        'happy ending illustration: Priscilla and Aquila teaching, Apollos growing, God using teachers, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Priscilla and Aquila taught Apollos more perfectly!',
      quizHeading: 'Apollos & Priscilla/Aquila Questions',
      questions: [
        {
          question: 'What did Apollos know only?',
          choices: ['The baptism of John', 'The full gospel', 'Nothing', 'Greek philosophy'],
          correctIndex: 0,
          correctFeedback: 'Yes! He knew only the baptism of John.',
          wrongFeedback: 'Apollos was eloquent and mighty in scriptures, but knew only the baptism of John (Acts 18:25).'
        },
        {
          question: 'Who took Apollos aside to teach him?',
          choices: ['Paul and Barnabas', 'Priscilla and Aquila', 'Peter and John', 'The synagogue leaders'],
          correctIndex: 1,
          correctFeedback: 'Right! Priscilla and Aquila expounded the way of God more perfectly.',
          wrongFeedback: 'Not Paul and Barnabas. Priscilla and Aquila took him unto them (Acts 18:26).'
        },
        {
          question: 'What did Apollos do after learning more?',
          choices: ['Stayed in Ephesus', 'Went to Achaia and helped believers', 'Quit preaching', 'Argued with Priscilla'],
          correctIndex: 1,
          correctFeedback: 'Yes! He passed into Achaia and helped them much which believed.',
          wrongFeedback: 'Not stay or quit. When he was disposed to pass into Achaia, the brethren wrote… and he helped them much (Acts 18:27–28).'
        },
        {
          question: 'How did Apollos convince the Jews?',
          choices: ['With miracles', 'Shewing by the scriptures that Jesus was Christ', 'With money', 'With force'],
          correctIndex: 1,
          correctFeedback: 'Right! Mightily convinced the Jews, shewing by the scriptures that Jesus was Christ.',
          wrongFeedback: 'He mightily convinced the Jews… shewing by the scriptures that Jesus was Christ (Acts 18:28).'
        },
        {
          question: 'What can we learn from Apollos & Priscilla/Aquila?',
          choices: ['Never teach others', 'Teach more perfectly — God uses teachers to grow His servants', 'Stay silent', 'Argue with others'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Teach more perfectly — God uses teachers to grow His servants.',
          wrongFeedback: 'Priscilla and Aquila expounded the way of God more perfectly unto Apollos — he grew and helped others!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — teach more perfectly!',
      takeaway: 'Teach more perfectly — God uses teachers to grow His servants.',
      prayer: 'God, thank You for teachers. Help me learn and teach Your truth. Amen.'
    },

    actsPaulBeforeAgrippa: {
      kjvRef: 'Acts 25–26',
      paragraphs: [
        'Paul was kept in Caesarea. Governor Festus heard the case. Paul appealed unto Caesar to be tried in Rome.',
        'King Agrippa and Bernice came to Caesarea. Festus told Agrippa of Paul’s case. Agrippa said, "Bring him before me."',
        'Paul spoke boldly: "I stand here testifying to small and great… that Christ should suffer, and that he should be the first that should rise from the dead."',
        'Festus said with a loud voice, "Paul, thou art beside thyself; much learning doth make thee mad." Paul answered, "I am not mad, most noble Festus."',
        'Agrippa said unto Paul, "Almost thou persuadest me to be a Christian." Paul replied, "I would to God, that not only thou, but also all that hear me this day, were both almost, and altogether such as I am."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul appealing to Caesar, Festus listening, no text',
        'fun kid illustration: King Agrippa and Bernice arriving, Festus explaining the case, no text',
        'colorful Bible scene for children: Paul speaking boldly before Agrippa, testifying about Christ, no text',
        'exciting cartoon: Festus saying Paul thou art mad, Paul replying calmly, no text',
        'hopeful ending illustration: Agrippa almost persuaded, Paul wishing all were like him, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul testified boldly before kings — almost persuading Agrippa!',
      quizHeading: 'Paul Before Agrippa Questions',
      questions: [
        {
          question: 'Why did Paul appeal to Caesar?',
          choices: ['To escape', 'To be tried in Rome', 'To stay in Caesarea', 'To see Festus'],
          correctIndex: 1,
          correctFeedback: 'Yes! Paul appealed to Caesar for trial in Rome.',
          wrongFeedback: 'Not escape or stay. Paul appealed unto Caesar (Acts 25:11).'
        },
        {
          question: 'Who came to hear Paul’s case?',
          choices: ['King Agrippa and Bernice', 'The emperor', 'The Jews', 'The disciples'],
          correctIndex: 0,
          correctFeedback: 'Yes! King Agrippa and Bernice came to Caesarea.',
          wrongFeedback: 'Festus told Agrippa about Paul — Agrippa said bring him before me (Acts 25:22).'
        },
        {
          question: 'What did Paul testify about?',
          choices: ['His travels', 'Christ should suffer and rise from the dead', 'His money', 'His food'],
          correctIndex: 1,
          correctFeedback: 'Right! Paul testified that Christ should suffer and rise from the dead.',
          wrongFeedback: 'Paul said that Christ should suffer, and that he should be the first that should rise from the dead (Acts 26:23).'
        },
        {
          question: 'What did Festus say to Paul?',
          choices: ['Thou art wise', 'Paul, thou art beside thyself; much learning doth make thee mad', 'Thou art guilty', 'Thou art free'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Paul, thou art beside thyself; much learning doth make thee mad."',
          wrongFeedback: 'Festus said "Paul, thou art beside thyself; much learning doth make thee mad" (Acts 26:24).'
        },
        {
          question: 'What did Agrippa say to Paul?',
          choices: ['Almost thou persuadest me to be a Christian', 'I hate you', 'Go away', 'You are guilty'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Almost thou persuadest me to be a Christian."',
          wrongFeedback: 'Agrippa said "Almost thou persuadest me to be a Christian" (Acts 26:28).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — testify boldly!',
      takeaway: 'Testify boldly about Jesus — He can persuade hearts.',
      prayer: 'Jesus, help me testify boldly like Paul. Thank You for Your power. Amen.'
    },

    actsPaulMelita: {
      kjvRef: 'Acts 28:1–10',
      paragraphs: [
        'The shipwreck survivors landed on Melita. The barbarians showed unusual kindness and kindled a fire.',
        'Paul gathered sticks for the fire. A viper fastened on his hand. The people expected him to swell or fall down dead.',
        'Paul shook off the viper into the fire and felt no harm. The barbarians said he was a god.',
        'The father of Publius lay sick of fever and dysentery. Paul entered, prayed, laid his hands on him, and healed him.',
        'All the sick on the island came — Paul healed them. The islanders honoured them and laded them with such things as were necessary.'
      ],
      imagePrompts: [
        'bright cartoon for kids: survivors landing on Melita, barbarians kind with fire, no text',
        'fun kid illustration: Paul gathering sticks, viper biting hand, shaking it off, no text',
        'colorful Bible scene for children: barbarians saying he is a god, Paul unharmed, no text',
        'exciting cartoon: Paul praying over Publius, healing fever, no text',
        'hopeful ending illustration: sick people healed, islanders honouring Paul, supplies given, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God protected Paul on Melita — even from a viper!',
      quizHeading: 'Paul on Melita Questions',
      questions: [
        {
          question: 'How did the barbarians treat the survivors?',
          choices: ['With anger', 'With unusual kindness and fire', 'With chains', 'They ignored them'],
          correctIndex: 1,
          correctFeedback: 'Yes! The barbarians showed unusual kindness.',
          wrongFeedback: 'The barbarians showed us no little kindness and kindled a fire (Acts 28:2).'
        },
        {
          question: 'What happened when Paul gathered sticks?',
          choices: ['Nothing', 'A viper fastened on his hand — he shook it off unharmed', 'He fell in fire', 'He left'],
          correctIndex: 1,
          correctFeedback: 'Right! Viper bit him — he shook it off, no harm.',
          wrongFeedback: 'A viper fastened on his hand — he shook it into the fire and felt no harm (Acts 28:3–5).'
        },
        {
          question: 'What did the barbarians say after the viper?',
          choices: ['He is evil', 'He is a god', 'He is weak', 'He is sick'],
          correctIndex: 1,
          correctFeedback: 'Yes! They changed their minds and said he was a god.',
          wrongFeedback: 'They changed their minds, and said that he was a god (Acts 28:6).'
        },
        {
          question: 'Who did Paul heal on Melita?',
          choices: ['Only himself', 'Publius’ father and all the sick', 'The king', 'No one'],
          correctIndex: 1,
          correctFeedback: 'Yes! Publius’ father and all the sick on the island.',
          wrongFeedback: 'Paul healed Publius’ father with fever and dysentery, then all the sick (Acts 28:8–9).'
        },
        {
          question: 'What can we learn from Paul on Melita?',
          choices: ['God doesn’t protect', 'God protects and uses us in danger', 'Never gather sticks', 'Fear snakes'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God protects and uses us even in danger.',
          wrongFeedback: 'God protected Paul from the viper and used him to heal many!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God protects in danger!',
      takeaway: 'God protects and uses us even in danger.',
      prayer: 'God, thank You for protection. Use me wherever I am. Amen.'
    },

    romansRoadKids: {
      kjvRef: 'Romans 3:23; 5:8; 6:23; 10:9–10',
      paragraphs: [
        'All have sinned, and come short of the glory of God. No one is good enough on their own.',
        'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.',
        'For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.',
        'If thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.',
        'For with the heart man believeth unto righteousness; and with the mouth confession is made unto salvation.'
      ],
      imagePrompts: [
        'bright cartoon for kids: people falling short of God’s glory, sin shown gently, no text',
        'fun kid illustration: God showing love, Christ dying for sinners, no text',
        'colorful Bible scene for children: wages of sin death, gift of God eternal life, no text',
        'exciting cartoon: confess Jesus as Lord, believe in heart, saved, no text',
        'happy ending illustration: heart believing, mouth confessing, righteousness and salvation, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The Romans Road — the simple path to salvation!',
      quizHeading: 'Romans Road Questions',
      questions: [
        {
          question: 'What does Romans 3:23 say?',
          choices: ['All have sinned, and come short of the glory of God', 'All are good', 'No one sins', 'God is far'],
          correctIndex: 0,
          correctFeedback: 'Yes! All have sinned and come short of God’s glory.',
          wrongFeedback: 'Romans 3:23: "All have sinned, and come short of the glory of God."'
        },
        {
          question: 'What does Romans 5:8 say about God’s love?',
          choices: ['God loves only good people', 'While we were yet sinners, Christ died for us', 'God hates sinners', 'Love is earned'],
          correctIndex: 1,
          correctFeedback: 'Right! "While we were yet sinners, Christ died for us."',
          wrongFeedback: 'Romans 5:8: "God commendeth his love toward us, in that, while we were yet sinners, Christ died for us."'
        },
        {
          question: 'What are the wages of sin?',
          choices: ['Life', 'Death', 'Riches', 'Joy'],
          correctIndex: 1,
          correctFeedback: 'Yes! The wages of sin is death.',
          wrongFeedback: 'Romans 6:23: "The wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord."'
        },
        {
          question: 'What must we do to be saved (Romans 10:9)?',
          choices: ['Confess Jesus as Lord and believe God raised Him', 'Work hard', 'Be good', 'Give money'],
          correctIndex: 0,
          correctFeedback: 'Yes! Confess with mouth, believe in heart — saved.',
          wrongFeedback: 'Romans 10:9: "If thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart… thou shalt be saved."'
        },
        {
          question: 'What can we learn from the Romans Road?',
          choices: ['Salvation is hard', 'Salvation is by grace through faith in Jesus', 'Never confess', 'Sin is okay'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Salvation is by grace through faith in Jesus.',
          wrongFeedback: 'The Romans Road shows the simple gospel: all sinned, Christ died, believe and confess — saved!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — the Romans Road to salvation!',
      takeaway: 'Salvation is by grace through faith in Jesus — confess and believe.',
      prayer: 'Jesus, I believe You died for me and rose again. Forgive my sins. Amen.'
    },

    corinthiansOneBody: {
      kjvRef: '1 Corinthians 12',
      paragraphs: [
        'Paul wrote to Corinth about spiritual gifts. There are diversities of gifts, but the same Spirit.',
        'The body is one but has many members. The eye cannot say to the hand, "I have no need of thee."',
        'God set the members in the body as it pleased Him. The weaker parts are necessary.',
        'If one member suffers, all suffer with it. If one member is honoured, all rejoice with it.',
        'Now ye are the body of Christ, and members in particular. Use your gifts to build up the church.'
      ],
      imagePrompts: [
        'bright cartoon for kids: body with many parts — eye, hand, foot, working together, no text',
        'fun kid illustration: eye saying I have no need of thee to hand, no text',
        'colorful Bible scene for children: weaker parts honored, no division, unity, no text',
        'exciting cartoon: one part suffering, whole body feels it, no text',
        'happy ending illustration: church as body of Christ, gifts used to help, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The church is one body with many parts!',
      quizHeading: 'One Body Questions',
      questions: [
        {
          question: 'What are the different gifts from?',
          choices: ['The same Spirit', 'Different spirits', 'People', 'Money'],
          correctIndex: 0,
          correctFeedback: 'Yes! Different gifts, but the same Spirit.',
          wrongFeedback: 'Not different spirits. "There are diversities of gifts, but the same Spirit" (1 Corinthians 12:4).'
        },
        {
          question: 'What did Paul say about the body?',
          choices: ['It is many bodies', 'The body is one but has many members', 'No parts needed', 'Parts fight'],
          correctIndex: 1,
          correctFeedback: 'Right! One body, many members — all needed.',
          wrongFeedback: 'Paul said "The body is one and has many members" (1 Corinthians 12:12).'
        },
        {
          question: 'Can the eye say to the hand "I have no need of thee"?',
          choices: ['Yes', 'No', 'Maybe', 'Sometimes'],
          correctIndex: 1,
          correctFeedback: 'Right! No — the eye cannot say that; every part is needed.',
          wrongFeedback: 'Paul said the eye cannot say unto the hand, I have no need of thee (1 Corinthians 12:21).'
        },
        {
          question: 'What happens if one member suffers?',
          choices: ['Nothing', 'All members suffer with it', 'Only that part hurts', 'The body grows'],
          correctIndex: 1,
          correctFeedback: 'Yes! All members suffer with it.',
          wrongFeedback: 'Not nothing. "If one member suffer, all the members suffer with it" (1 Corinthians 12:26).'
        },
        {
          question: 'What can we learn from one body?',
          choices: ['Parts are separate', 'The church is one body — honor all parts', 'Weaker parts useless', 'No unity'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The church is one body — honor the weaker parts.',
          wrongFeedback: 'Paul taught no division — honor weaker parts, all needed!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — we are one body!',
      takeaway: 'The church is one body — honor all parts and work together.',
      prayer: 'God, thank You for making us one body. Help us honor each part. Amen.'
    },

    philippiansJoy: {
      kjvRef: 'Philippians 1:21; 2:5–11; 4:4–7, 13',
      paragraphs: [
        'Paul wrote from prison: "For to me to live is Christ, and to die is gain." He rejoiced even in chains.',
        'He told believers to have the mind of Christ: humble, obedient, even to death on the cross. God exalted Him.',
        'Paul said, "Rejoice in the Lord alway: and again I say, Rejoice." Let your moderation be known unto all men.',
        'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. The peace of God shall keep your hearts.',
        'Paul ended: "I can do all things through Christ which strengtheneth me." Joy comes from Christ, not circumstances.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul in prison writing to live is Christ, joyful face despite chains, no text',
        'fun kid illustration: Christ humbling Himself to death on cross, then exalted by God, no text',
        'colorful Bible scene for children: believers rejoicing Rejoice in the Lord alway, no text',
        'exciting cartoon: praying with thanksgiving, peace guarding hearts and minds, no text',
        'happy ending illustration: Paul saying I can do all things through Christ, strength from Jesus, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul rejoiced in prison — joy in Christ!',
      quizHeading: 'Philippians Joy Questions',
      questions: [
        {
          question: 'What did Paul say "to live is Christ" means?',
          choices: ['Life is hard', 'To live is Christ, and to die is gain', 'Life is money', 'Life is sad'],
          correctIndex: 1,
          correctFeedback: 'Yes! "For to me to live is Christ, and to die is gain."',
          wrongFeedback: 'Paul rejoiced in prison: "For to me to live is Christ, and to die is gain" (Philippians 1:21).'
        },
        {
          question: 'What mind did Paul say to have?',
          choices: ['Proud mind', 'Mind of Christ — humble and obedient', 'Angry mind', 'Selfish mind'],
          correctIndex: 1,
          correctFeedback: 'Right! Have the mind of Christ — humble to death on cross.',
          wrongFeedback: 'Paul said "Let this mind be in you, which was also in Christ Jesus" — humble obedience (Philippians 2:5–8).'
        },
        {
          question: 'What did Paul say to do always?',
          choices: ['Worry', 'Rejoice in the Lord alway', 'Be angry', 'Give up'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Rejoice in the Lord alway: and again I say, Rejoice."',
          wrongFeedback: 'Paul said "Rejoice in the Lord alway: and again I say, Rejoice" (Philippians 4:4).'
        },
        {
          question: 'What guards hearts when we pray with thanksgiving?',
          choices: ['Fear', 'Peace of God', 'Anger', 'Money'],
          correctIndex: 1,
          correctFeedback: 'Right! Peace of God guards hearts and minds.',
          wrongFeedback: 'Paul said "The peace of God… shall keep your hearts and minds through Christ Jesus" (Philippians 4:7).'
        },
        {
          question: 'What can we learn from Philippians?',
          choices: ['Joy only when free', 'Joy in Christ — I can do all things through Him', 'Never rejoice', 'Give up'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Joy in Christ — "I can do all things through Christ which strengtheneth me."',
          wrongFeedback: 'Paul wrote from prison: "I can do all things through Christ which strengtheneth me" (Philippians 4:13)!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — rejoice in the Lord!',
      takeaway: 'Rejoice in Christ always — He gives strength and peace.',
      prayer: 'Jesus, thank You for joy and strength. Help me rejoice always. Amen.'
    },

    colossiansChristSupreme: {
      kjvRef: 'Colossians 1:15–20; 3:1–4, 12–17',
      paragraphs: [
        'Paul wrote to Colossae: Christ is the image of the invisible God, the firstborn of every creature.',
        'All things were created by Him and for Him. He is before all things — in Him all things consist.',
        'He is the head of the body, the church. In Him dwells all the fulness of the Godhead bodily.',
        'Paul said, "Set your affection on things above, not on things on the earth." Our life is hid with Christ in God.',
        'Put on therefore, as the elect of God, bowels of mercies, kindness, humbleness of mind, meekness, longsuffering. Let the peace of God rule in your hearts.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Christ as image of God, creator of all, no text',
        'fun kid illustration: all things created by Christ, holding together, no text',
        'colorful Bible scene for children: Christ head of church, reconciling by blood on cross, no text',
        'exciting cartoon: setting affection on things above, life hid with Christ, no text',
        'happy ending illustration: putting on mercy, kindness, humility, peace ruling, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Christ is supreme — all things created by Him!',
      quizHeading: 'Colossians Christ Supreme Questions',
      questions: [
        {
          question: 'Who is Christ according to Colossians?',
          choices: ['A prophet', 'The image of the invisible God', 'A teacher', 'A king only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Christ is the image of the invisible God.',
          wrongFeedback: 'Not prophet or teacher. "Who is the image of the invisible God, the firstborn of every creature" (Colossians 1:15).'
        },
        {
          question: 'What did Christ create?',
          choices: ['Only people', 'All things — by Him and for Him', 'Nothing', 'Only heaven'],
          correctIndex: 1,
          correctFeedback: 'Right! All things created by Him and for Him.',
          wrongFeedback: 'Not only people. "For by him were all things created… all things were created by him, and for him" (Colossians 1:16).'
        },
        {
          question: 'What is Christ head of?',
          choices: ['The world', 'The church', 'The angels', 'The stars'],
          correctIndex: 1,
          correctFeedback: 'Yes! Christ is the head of the church.',
          wrongFeedback: 'Not world or angels. "He is the head of the body, the church" (Colossians 1:18).'
        },
        {
          question: 'What did Paul say to set affection on?',
          choices: ['Things on earth', 'Things above', 'Money', 'Power'],
          correctIndex: 1,
          correctFeedback: 'Right! "Set your affection on things above, not on things on the earth."',
          wrongFeedback: 'Paul said "Set your affection on things above, not on things on the earth" (Colossians 3:2).'
        },
        {
          question: 'What can we learn from Colossians?',
          choices: ['Christ is not supreme', 'Christ is supreme — put on mercy and peace', 'Never love', 'Be selfish'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Christ is supreme — put on mercy, kindness, humility, peace.',
          wrongFeedback: 'Colossians shows Christ supreme and calls us to live in love and unity!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Christ is supreme!',
      takeaway: 'Christ is supreme — put on mercy, kindness, humility, and peace.',
      prayer: 'Jesus, You are supreme. Help me live in Your love. Amen.'
    },

    thessaloniansHope: {
      kjvRef: '1 Thessalonians 4:13–18; 5:16–24',
      paragraphs: [
        'Paul comforted believers about those who sleep in Jesus. "We which are alive… shall not prevent them which are asleep."',
        'The Lord will descend with shout, voice of the archangel, trump of God. Dead in Christ rise first.',
        'Then we which are alive shall be caught up together with them in the clouds to meet the Lord in the air.',
        'Comfort one another with these words. "The day of the Lord cometh as a thief in the night."',
        'Paul said, "Rejoice evermore. Pray without ceasing. In every thing give thanks… Quench not the Spirit."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul comforting believers about those asleep in Jesus, no text',
        'fun kid illustration: Lord descending with shout, dead in Christ rising, no text',
        'colorful Bible scene for children: alive caught up in clouds to meet Lord, no text',
        'exciting cartoon: day of the Lord as thief in night, watchful believers, no text',
        'hopeful ending illustration: rejoice, pray without ceasing, give thanks, Spirit not quenched, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Comfort about those asleep in Jesus — we will meet Him!',
      quizHeading: 'Thessalonians Hope Questions',
      questions: [
        {
          question: 'What did Paul comfort believers about?',
          choices: ['Those who sleep in Jesus', 'Money', 'Food', 'Weather'],
          correctIndex: 0,
          correctFeedback: 'Yes! About those who have died in Christ.',
          wrongFeedback: 'Not money. Paul comforted "concerning them which are asleep" (1 Thessalonians 4:13).'
        },
        {
          question: 'What happens when the Lord descends?',
          choices: ['Nothing', 'Dead in Christ rise first', 'People hide', 'Sun stops'],
          correctIndex: 1,
          correctFeedback: 'Right! Dead in Christ rise first, then alive caught up.',
          wrongFeedback: 'Not nothing. "The dead in Christ shall rise first" (1 Thessalonians 4:16).'
        },
        {
          question: 'What did Paul say to comfort them?',
          choices: ['Be sad', 'Comfort one another with these words', 'Forget the dead', 'Cry more'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Comfort one another with these words."',
          wrongFeedback: 'Paul said "Wherefore comfort one another with these words" (1 Thessalonians 4:18).'
        },
        {
          question: 'What did Paul say about the day of the Lord?',
          choices: ['It comes slowly', 'It comes as a thief in the night', 'It never comes', 'It is far away'],
          correctIndex: 1,
          correctFeedback: 'Yes! "The day of the Lord so cometh as a thief in the night."',
          wrongFeedback: 'Paul said the day comes as a thief in the night (1 Thessalonians 5:2).'
        },
        {
          question: 'What can we learn from Thessalonians?',
          choices: ['Be sad about death', 'Comfort with hope of resurrection, rejoice, pray, give thanks', 'Never pray', 'Quench the Spirit'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Comfort with resurrection hope, rejoice, pray, give thanks.',
          wrongFeedback: 'Paul said "Rejoice evermore. Pray without ceasing. In every thing give thanks" (1 Thessalonians 5:16–18).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — comfort with hope!',
      takeaway: 'Comfort with hope of resurrection — rejoice, pray, give thanks.',
      prayer: 'God, thank You for resurrection hope. Help me rejoice and pray always. Amen.'
    },

    timothyYouthExample: {
      kjvRef: '1 Timothy 4:12',
      paragraphs: [
        'Paul wrote to young Timothy: "Let no man despise thy youth; but be thou an example of the believers."',
        'Be an example in word (speech), in conversation (conduct), in charity (love), in spirit, in faith, in purity.',
        'Paul told Timothy to give attendance to reading, exhortation, doctrine. Neglect not the gift in him.',
        'Meditate upon these things — give thyself wholly to them so all may see thy profiting.',
        'Timothy was young but called to lead by example — God uses young people who obey.'
      ],
      imagePrompts: [
        'bright cartoon for kids: young Timothy leading, being example to believers, no text',
        'fun kid illustration: Timothy showing example in speech, conduct, love, faith, purity, no text',
        'colorful Bible scene for children: Timothy reading, exhorting, teaching doctrine, no text',
        'exciting cartoon: gift in Timothy, meditating, progress seen, no text',
        'hopeful ending illustration: young Timothy leading church, God using him, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Young Timothy called to be an example!',
      quizHeading: 'Timothy Youth Example Questions',
      questions: [
        {
          question: 'What did Paul tell Timothy not to let happen?',
          choices: ['Be an example', 'Let no man despise thy youth', 'Read Scripture', 'Pray'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Let no man despise thy youth."',
          wrongFeedback: 'Not be example. Paul said "Let no man despise thy youth" (1 Timothy 4:12).'
        },
        {
          question: 'What was Timothy to be an example in?',
          choices: ['Word, conversation, charity, spirit, faith, purity', 'Money, power, fame', 'Fighting, hiding', 'Silence'],
          correctIndex: 0,
          correctFeedback: 'Right! Example in word, conduct, love, spirit, faith, purity.',
          wrongFeedback: 'Paul said "Be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity" (1 Timothy 4:12).'
        },
        {
          question: 'What did Paul tell Timothy to give attendance to?',
          choices: ['Reading, exhortation, doctrine', 'Games', 'Sleep', 'Food'],
          correctIndex: 0,
          correctFeedback: 'Yes! Reading, exhortation, doctrine.',
          wrongFeedback: 'Not games. Paul said "Give attendance to reading, to exhortation, to doctrine" (1 Timothy 4:13).'
        },
        {
          question: 'What did Paul say not to neglect?',
          choices: ['The gift in him', 'Money', 'Friends', 'Sleep'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Neglect not the gift that is in thee."',
          wrongFeedback: 'Paul said "Neglect not the gift that is in thee" (1 Timothy 4:14).'
        },
        {
          question: 'What can we learn from Timothy?',
          choices: ['Young people useless', 'Young people can lead by example', 'Never obey', 'Be lazy'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Young people can lead by example in faith and purity.',
          wrongFeedback: 'Paul told young Timothy to be an example — God uses young people!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — young people lead by example!',
      takeaway: 'Young people can lead by example in faith, love, and purity.',
      prayer: "God, use me even when I'm young. Help me be an example. Amen."
    },

    actsPaulMarsHill: {
      kjvRef: 'Acts 17:22–34',
      paragraphs: [
        "Paul stood in the midst of Mars' hill in Athens. He saw the city full of idols.",
        'Paul said, "Ye men of Athens, I perceive that in all things ye are too superstitious." He pointed to an altar "To the Unknown God."',
        'Paul preached: "Whom therefore ye ignorantly worship, him declare I unto you. God made the world… He giveth to all life, and breath, and all things."',
        'Paul said God is not far from any of us. "In him we live, and move, and have our being."',
        'Some mocked, some said "We will hear thee again." But certain believed — among them Dionysius and Damaris.'
      ],
      imagePrompts: [
        "bright cartoon for kids: Paul in Athens on Mars' hill, city full of idols, no text",
        'fun kid illustration: Paul pointing to altar To the Unknown God, speaking to crowd, no text',
        'colorful Bible scene for children: Paul preaching whom ye ignorantly worship him declare I unto you, no text',
        'exciting cartoon: Paul preaching in him we live and move and have our being, some listening, some mocking, no text',
        'hopeful ending illustration: believers like Dionysius and Damaris, people turning to God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul preached to idol-worshipers in Athens — some believed!',
      quizHeading: "Paul on Mars' Hill Questions",
      questions: [
        {
          question: 'Where did Paul preach in Athens?',
          choices: ['In a temple', "On Mars' hill", 'By the sea', 'In a house'],
          correctIndex: 1,
          correctFeedback: "Yes! In the midst of Mars' hill (Areopagus).",
          wrongFeedback: "Not temple or sea. Paul stood in the midst of Mars' hill (Acts 17:22)."
        },
        {
          question: 'What did Paul notice about the city?',
          choices: ['It was empty', 'It was full of idols', 'It had no altars', 'It was peaceful'],
          correctIndex: 1,
          correctFeedback: 'Right! "I perceive that in all things ye are too superstitious."',
          wrongFeedback: 'Paul said "I perceive that in all things ye are too superstitious" (Acts 17:22).'
        },
        {
          question: 'What altar did Paul point to?',
          choices: ['To Zeus', 'To the Unknown God', 'To Apollo', 'To Artemis'],
          correctIndex: 1,
          correctFeedback: 'Yes! "To the Unknown God."',
          wrongFeedback: 'Paul said "Whom therefore ye ignorantly worship, him declare I unto you" pointing to the altar "To the Unknown God" (Acts 17:23).'
        },
        {
          question: 'What did Paul say about God?',
          choices: ['He is far away', 'In him we live, and move, and have our being', 'He needs temples', 'He is small'],
          correctIndex: 1,
          correctFeedback: 'Right! "In him we live, and move, and have our being."',
          wrongFeedback: 'Paul said "For in him we live, and move, and have our being" (Acts 17:28).'
        },
        {
          question: 'What can we learn from Paul on Mars\' hill?',
          choices: ['Ignore idols', 'Preach Jesus boldly to anyone', 'Never speak to Greeks', 'Worship unknown gods'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Preach Jesus boldly — some will believe.',
          wrongFeedback: 'Paul preached to idol-worshipers — some mocked, but some believed!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — preach boldly!',
      takeaway: 'Preach Jesus boldly to anyone — some will believe.',
      prayer: 'Jesus, help me preach boldly like Paul. Thank You for reaching everyone. Amen.'
    },

    abigailWise: {
      kjvRef: '1 Samuel 25',
      paragraphs: [
        'Nabal was churlish and evil in his doings. David\'s young men had kept his sheep in Carmel; they were not hurt nor missing anything — yet Nabal answered David\'s messengers roughly and sent them away empty.',
        'David said, Every man gird on his sword. But Abigail, Nabal\'s wife, heard in the house how her husband had shamed David\'s servants.',
        'She hasted, and took two hundred loaves, bottles of wine, sheep ready dressed, clusters of raisins, cakes of figs, and laid them on asses — she met David in the covert of the hill and bowed herself to the ground.',
        'She pleaded: Let not my lord regard this man of Belial, even Nabal… the Lord will certainly make my lord a sure house, because my lord fighteth the battles of the Lord, and evil hath not been found in thee.',
        'David blessed God for sending her: Go in peace to thine house; see, I have hearkened to thy voice. When the Lord smote Nabal, Abigail became David\'s wife — wisdom turned away wrath.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Abigail on donkeys with bread and food gifts, humble bow, no text',
        'fun kid illustration: David and men with swords paused, listening to wise woman, no text',
        'colorful Bible scene for children: Carmel hills, servants with supplies, peaceful meeting, no text',
        'exciting cartoon: Abigail speaking kindly, turning away anger, no text',
        'hopeful ending illustration: David blessing God for her counsel, calm faces, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Abigail\'s gentle words turned away David\'s anger!',
      quizHeading: 'Abigail\'s Wisdom Questions',
      questions: [
        {
          question: 'How did Nabal treat David\'s messengers?',
          choices: ['Kindly with gifts', 'Roughly — sent them away empty', 'He invited them to feast', 'He did not notice them'],
          correctIndex: 1,
          correctFeedback: 'Yes! Nabal answered David\'s servants roughly and sent them away empty.',
          wrongFeedback: 'Read how Nabal answered David\'s young men — he was harsh and gave nothing (1 Samuel 25:10–11).'
        },
        {
          question: 'What did Abigail bring to meet David?',
          choices: ['Only words', 'Bread, wine, dressed meat, raisins, figs on asses', 'Gold coins only', 'Weapons'],
          correctIndex: 1,
          correctFeedback: 'Right! She loaded food and drink on asses and hurried to meet David.',
          wrongFeedback: 'She took loaves, wine, sheep, raisins, figs, and more — see 1 Samuel 25:18.'
        },
        {
          question: 'What did Abigail ask David not to do?',
          choices: ['Pray', 'Avenge himself with bloodguilt when the Lord would build his house', 'Eat bread', 'Trust God'],
          correctIndex: 1,
          correctFeedback: 'Yes! She begged him not to shed blood in his own vengeance — the Lord would judge Nabal.',
          wrongFeedback: 'She said, let this not be a stumblingblock… when the Lord shall have done to Nabal what pleaseth him (1 Samuel 25:31).'
        },
        {
          question: 'How did David respond to Abigail?',
          choices: ['He refused her', 'He blessed the Lord for her counsel and sent her in peace', 'He took Nabal\'s house by force', 'He ignored her'],
          correctIndex: 1,
          correctFeedback: 'Yes! David said, Blessed be the Lord God of Israel… and blessed be thy advice.',
          wrongFeedback: 'David said, Blessed be thy advice, and blessed be thou… Go up in peace to thine house (1 Samuel 25:32–35).'
        },
        {
          question: 'What can we learn from Abigail?',
          choices: ['Stir up anger', 'Humble, quick peacemaking honours God and saves trouble', 'Stay silent when people fight', 'Hoard food'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Gentle words and generous deeds can cool hot anger.',
          wrongFeedback: 'A soft answer turneth away wrath (Proverbs 15:1) — Abigail lived it when danger was real.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — choose wisdom like Abigail!',
      takeaway: 'Quick, humble words and generous deeds can turn away wrath.',
      prayer: 'God, give me wisdom like Abigail — help me make peace and honour Thee. Amen.'
    },

    alphaOmega: {
      kjvRef: 'Revelation 1:8, 11, 17–18',
      paragraphs: [
        'John was in the isle called Patmos for the word of God and the testimony of Jesus Christ. He heard a great voice as of a trumpet behind him.',
        'The voice said, I am Alpha and Omega, the first and the last: and, What thou seest, write in a book, and send it unto the seven churches which are in Asia.',
        'John turned to see the voice. He saw seven golden candlesticks; in the midst one like unto the Son of man, clothed with a garment down to the foot, girt about the paps with a golden girdle.',
        'He laid his right hand upon John, saying, Fear not; I am the first and the last: I am he that liveth, and was dead; and, behold, I am alive for evermore, Amen; and have the keys of hell and of death.',
        'Jesus also said, I am Alpha and Omega, the beginning and the end, the Lord, which is, and which was, and which is to come, the Almighty — He rules time, death, and life.'
      ],
      imagePrompts: [
        'bright cartoon for kids: John on Patmos, golden candlesticks, gentle risen Christ figure, no text',
        'fun kid illustration: Alpha and Omega letters glowing softly, first and last, no text',
        'colorful Bible scene for children: Christ with golden sash among lampstands, comforting hand, no text',
        'exciting cartoon: keys of death and hell shown as humble symbols, life over death, no text',
        'hopeful ending illustration: Jesus alive for evermore, calm victorious light, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus is the First and the Last — alive for evermore!',
      quizHeading: 'Alpha and Omega Questions',
      questions: [
        {
          question: 'What titles did the voice use for Himself?',
          choices: ['Only a teacher', 'Alpha and Omega, the first and the last', 'A Roman king', 'An angel only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Alpha and Omega, the first and the last.',
          wrongFeedback: 'The Lord said, I am Alpha and Omega, the first and the last (Revelation 1:11).'
        },
        {
          question: 'What did Jesus tell John when John fell at His feet?',
          choices: ['Go away', 'Fear not — I am the first and the last, alive for evermore', 'Hide in a cave', 'Stop writing'],
          correctIndex: 1,
          correctFeedback: 'Right! Fear not; I am he that liveth, and was dead… I am alive for evermore.',
          wrongFeedback: 'He said, Fear not; I am the first and the last (Revelation 1:17–18).'
        },
        {
          question: 'What does Jesus have the keys of?',
          choices: ['Only Jerusalem', 'Hell and of death', 'Only the sea', 'The temple treasury'],
          correctIndex: 1,
          correctFeedback: 'Yes! The keys of hell and of death.',
          wrongFeedback: 'He hath the keys of hell and of death (Revelation 1:18).'
        },
        {
          question: 'What else does Revelation 1:8 call the Lord?',
          choices: ['Weak and unsure', 'The Lord… which is, and which was, and which is to come, the Almighty', 'A stranger', 'Silent'],
          correctIndex: 1,
          correctFeedback: 'Yes! Which is, and which was, and which is to come, the Almighty.',
          wrongFeedback: 'The Lord said, I am Alpha and Omega… the Almighty (Revelation 1:8).'
        },
        {
          question: 'What can we learn from Alpha and Omega?',
          choices: ['Jesus is temporary', 'Jesus spans all time — trust Him with your whole story', 'God is far away', 'The end does not matter'],
          correctIndex: 1,
          correctFeedback: 'Perfect! He is beginning and end — worthy of all trust.',
          wrongFeedback: 'He is the first and the last — from start to finish, Jesus is Lord (Revelation 1:17).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is first and last!',
      takeaway: 'Jesus is Alpha and Omega — He conquered death and holds its keys.',
      prayer: 'Lord Jesus, Thou art first and last. I trust Thee with my life. Amen.'
    },

    alphaOmega2: {
      kjvRef: 'Revelation 22:12–13',
      paragraphs: [
        'Near the close of the Bible, Jesus said, Behold, I come quickly; and my reward is with me, to give every man according as his work shall be.',
        'He declared, I am Alpha and Omega, the beginning and the end, the first and the last.',
        'He who testifieth these things saith, Surely I come quickly. Amen. Even so, come, Lord Jesus.',
        'The Spirit and the bride say, Come. And let him that heareth say, Come. And let him that is athirst come — whosoever will, let him take the water of life freely.',
        'From beginning to end, the same Lord who started creation finishes His promise — He is faithful.'
      ],
      imagePrompts: [
        'bright cartoon for kids: open scroll, gentle light, Jesus words I come quickly, no text',
        'fun kid illustration: Alpha Omega beginning end, soft gold and blue, no text',
        'colorful Bible scene for children: river of life invitation, thirsty welcome, no text',
        'exciting cartoon: Spirit and bride saying Come, humble joy, no text',
        'hopeful ending illustration: Amen come Lord Jesus, peaceful dawn, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The Bible\'s end still points to Jesus — Come, Lord Jesus!',
      quizHeading: 'Alpha and Omega — The End Questions',
      questions: [
        {
          question: 'What did Jesus say about His coming?',
          choices: ['Never', 'Behold, I come quickly', 'Only in secret codes', 'Only for angels'],
          correctIndex: 1,
          correctFeedback: 'Yes! Behold, I come quickly.',
          wrongFeedback: 'Jesus said, Behold, I come quickly (Revelation 22:12).'
        },
        {
          question: 'How did Jesus name Himself in Revelation 22:13?',
          choices: ['A mere prophet', 'Alpha and Omega, the beginning and the end, the first and the last', 'Only a carpenter', 'A judge with no mercy'],
          correctIndex: 1,
          correctFeedback: 'Right! The same eternal titles as in chapter 1.',
          wrongFeedback: 'I am Alpha and Omega, the beginning and the end, the first and the last (Revelation 22:13).'
        },
        {
          question: 'What does Jesus bring with Him?',
          choices: ['Nothing', 'His reward, to give every man according to his work', 'Only fear', 'Stones only'],
          correctIndex: 1,
          correctFeedback: 'Yes! My reward is with me, to give every man according as his work shall be.',
          wrongFeedback: 'My reward is with me, to give every man according as his work shall be (Revelation 22:12).'
        },
        {
          question: 'Who invites thirsty people to come?',
          choices: ['No one', 'The Spirit and the bride — whosoever will may take the water of life', 'Only kings', 'Only priests'],
          correctIndex: 1,
          correctFeedback: 'Yes! Let him that is athirst come — whosoever will, let him take the water of life freely.',
          wrongFeedback: 'The Spirit and the bride say, Come… whosoever will, let him take the water of life freely (Revelation 22:17).'
        },
        {
          question: 'What can we learn from the end of Revelation?',
          choices: ['God forgets His promises', 'Jesus finishes faithfully — say with John, Come, Lord Jesus', 'The story has no hope', 'We need not obey'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Even so, come, Lord Jesus — He keeps every word.',
          wrongFeedback: 'He which testifieth these things saith, Surely I come quickly. Amen. Even so, come, Lord Jesus (Revelation 22:20).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is the beginning and the end!',
      takeaway: 'Jesus is coming — His reward is with Him; welcome others to the water of life.',
      prayer: 'Lord Jesus, even so, come. Help me invite others to Thee. Amen.'
    },

    angelMary: {
      kjvRef: 'Luke 1:26–38',
      paragraphs: [
        'The angel Gabriel was sent from God unto a city of Galilee, named Nazareth, to a virgin espoused to a man whose name was Joseph, of the house of David; and the virgin\'s name was Mary.',
        'The angel said unto her, Hail, thou that art highly favoured, the Lord is with thee: blessed art thou among women. She was troubled at his saying.',
        'Fear not, Mary: for thou hast found favour with God. And, behold, thou shalt conceive in thy womb, and bring forth a son, and shalt call his name JESUS.',
        'He shall be great, and shall be called the Son of the Highest: and the Lord God shall give unto him the throne of his father David: and of his kingdom there shall be no end.',
        'Mary said, Behold the handmaid of the Lord; be it unto me according to thy word. And the angel departed from her.'
      ],
      imagePrompts: [
        'bright cartoon for kids: gentle angel Gabriel and young Mary in Nazareth home, soft light, no text',
        'fun kid illustration: Mary listening, troubled then peaceful, no text',
        'colorful Bible scene for children: Mary yielding as God\'s servant, humble hands, no text',
        'exciting cartoon: promise of child Jesus, crown imagery subtle, no text',
        'hopeful ending illustration: angel departing, Mary trusting God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Mary said yes — "be it unto me according to thy word."',
      quizHeading: 'Angel Visits Mary Questions',
      questions: [
        {
          question: 'Who was sent to Mary?',
          choices: ['Peter', 'The angel Gabriel', 'Moses', 'John the Baptist'],
          correctIndex: 1,
          correctFeedback: 'Yes! The angel Gabriel was sent… unto Mary.',
          wrongFeedback: 'The angel Gabriel was sent from God unto… Mary (Luke 1:26–27).'
        },
        {
          question: 'What did Gabriel call Mary?',
          choices: ['Forgotten', 'Highly favoured — blessed among women', 'Too young', 'Unworthy'],
          correctIndex: 1,
          correctFeedback: 'Right! Hail, thou that art highly favoured… blessed art thou among women.',
          wrongFeedback: 'Hail, thou that art highly favoured, the Lord is with thee: blessed art thou among women (Luke 1:28).'
        },
        {
          question: 'What was she told to name her son?',
          choices: ['Gabriel', 'JESUS', 'Joseph', 'David'],
          correctIndex: 1,
          correctFeedback: 'Yes! Thou shalt call his name JESUS.',
          wrongFeedback: 'Thou shalt conceive… and shalt call his name JESUS (Luke 1:31).'
        },
        {
          question: 'What kind of kingdom was promised about Him?',
          choices: ['A kingdom that ends quickly', 'Of his kingdom there shall be no end', 'Only in Nazareth', 'Without God'],
          correctIndex: 1,
          correctFeedback: 'Yes! Of his kingdom there shall be no end.',
          wrongFeedback: 'The Lord God shall give unto him the throne of his father David: and… there shall be no end (Luke 1:32–33).'
        },
        {
          question: 'What can we learn from Mary\'s answer?',
          choices: ['Refuse God quietly', 'Yield to God — "be it unto me according to thy word"', 'Run away', 'Argue first'],
          correctIndex: 1,
          correctFeedback: 'Perfect! She trusted God\'s plan with a servant heart.',
          wrongFeedback: 'Mary said, Behold the handmaid of the Lord; be it unto me according to thy word (Luke 1:38).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — trust God like Mary!',
      takeaway: 'When God calls, answer with a willing heart — His plans are good.',
      prayer: 'Lord, make me willing like Mary — be it unto me according to Thy word. Amen.'
    },

    annaProphet: {
      kjvRef: 'Luke 2:36–38',
      paragraphs: [
        'There was one Anna, a prophetess, the daughter of Phanuel, of the tribe of Aser: she was of a great age, and had lived with an husband seven years from her virginity;',
        'She was a widow of about fourscore and four years, which departed not from the temple, but served God with fastings and prayers night and day.',
        'When Mary and Joseph brought the child Jesus to the temple after the days of her purification, faithful people waited in Jerusalem for God to redeem Israel.',
        'Anna came in that instant, gave thanks likewise unto the Lord, and spake of him to all them that looked for redemption in Jerusalem.',
        'Her long years of prayer turned into praise — God let her see the Saviour she had waited for.'
      ],
      imagePrompts: [
        'bright cartoon for kids: elderly Anna in temple, praying quietly, oil lamp soft glow, no text',
        'fun kid illustration: Mary and Joseph with baby Jesus, Anna drawing near, no text',
        'colorful Bible scene for children: Anna with uplifted hands thanking God, no text',
        'exciting cartoon: Anna speaking to people who looked for redemption, gentle crowd, no text',
        'hopeful ending illustration: temple courts, hope on faces, baby Jesus small in arms, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Anna never quit praying — then she saw Jesus!',
      quizHeading: 'Anna the Prophetess Questions',
      questions: [
        {
          question: 'Who was Anna?',
          choices: ['A soldier', 'A prophetess who stayed in the temple with fastings and prayers', 'A queen of Rome', 'A sailor'],
          correctIndex: 1,
          correctFeedback: 'Yes! A prophetess… departed not from the temple… with fastings and prayers night and day.',
          wrongFeedback: 'Anna, a prophetess… which departed not from the temple, but served God with fastings and prayers (Luke 2:36–37).'
        },
        {
          question: 'How long had Anna been a widow (about)?',
          choices: ['One year', 'About fourscore and four years', 'Ten days', 'She was not a widow'],
          correctIndex: 1,
          correctFeedback: 'Right! A widow of about fourscore and four years.',
          wrongFeedback: 'She was a widow of about fourscore and four years (Luke 2:37).'
        },
        {
          question: 'What did Anna do when she saw the child?',
          choices: ['She hid', 'Gave thanks unto the Lord, and spake of him to them that looked for redemption', 'She argued', 'She slept'],
          correctIndex: 1,
          correctFeedback: 'Yes! Thanks and testimony to those waiting for God\'s redemption.',
          wrongFeedback: 'She… gave thanks likewise unto the Lord, and spake of him to all them that looked for redemption in Jerusalem (Luke 2:38).'
        },
        {
          question: 'What tribe was Anna from?',
          choices: ['Judah only', 'Aser (Asher)', 'Levi', 'Benjamin'],
          correctIndex: 1,
          correctFeedback: 'Yes! Of the tribe of Aser.',
          wrongFeedback: 'The daughter of Phanuel, of the tribe of Aser (Luke 2:36).'
        },
        {
          question: 'What can we learn from Anna?',
          choices: ['Stop praying when old', 'Keep serving God — He shows His Son to faithful hearts', 'Only young people serve', 'Stay away from church'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Steady prayer prepared her to recognize God\'s gift.',
          wrongFeedback: 'She served God with fastings and prayers night and day — then praised Him for Jesus (Luke 2:37–38).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — keep praying like Anna!',
      takeaway: 'Pray and wait on God — He sends Jesus to those who look for Him.',
      prayer: 'God, help me pray and praise Thee like Anna. Thank Thee for Jesus. Amen.'
    },

    armorBelt: {
      kjvRef: 'Ephesians 6:14',
      paragraphs: [
        'Paul wrote: Be strong in the Lord, and in the power of his might. Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.',
        'We wrestle not against flesh and blood, but against spiritual wickedness in high places. Wherefore take unto you the whole armour of God, that ye may be able to withstand in the evil day.',
        'Stand therefore, having your loins girt about with truth — like a belt holding a soldier\'s robe ready for battle.',
        'Truth is first: knowing and speaking what God says, not lies or half-truths.',
        'When your heart is wrapped in God\'s truth, you are ready to stand with all the rest of His armour.'
      ],
      imagePrompts: [
        'bright cartoon for kids: young warrior putting on glowing belt labeled truth gently no letters, no text',
        'fun kid illustration: belt holding robe ready for service, honest faces, no text',
        'colorful Bible scene for children: Ephesians armour theme, peaceful strength, no text',
        'exciting cartoon: standing firm in daylight, truth as foundation, no text',
        'hopeful ending illustration: child praying with open Bible, truth from God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Girt your loins with truth — the first piece of God\'s armour!',
      quizHeading: 'Belt of Truth Questions',
      questions: [
        {
          question: 'What does Paul say to gird first when you stand?',
          choices: ['Gold chains', 'Your loins with truth', 'Only your shoes', 'Nothing'],
          correctIndex: 1,
          correctFeedback: 'Yes! Having your loins girt about with truth.',
          wrongFeedback: 'Stand therefore, having your loins girt about with truth (Ephesians 6:14).'
        },
        {
          question: 'Who gives us strength to stand?',
          choices: ['Only ourselves', 'The Lord, and the power of his might', 'Angry words', 'Money'],
          correctIndex: 1,
          correctFeedback: 'Right! Be strong in the Lord, and in the power of his might.',
          wrongFeedback: 'Be strong in the Lord, and in the power of his might (Ephesians 6:10).'
        },
        {
          question: 'What are we really wrestling against?',
          choices: ['Only people we dislike', 'Principalities, powers, rulers of darkness, spiritual wickedness', 'Sports teams', 'Weather'],
          correctIndex: 1,
          correctFeedback: 'Yes! Not flesh and blood alone — spiritual darkness.',
          wrongFeedback: 'We wrestle not against flesh and blood, but… spiritual wickedness in high places (Ephesians 6:12).'
        },
        {
          question: 'Why put on the whole armour of God?',
          choices: ['To look scary', 'To withstand the evil day and stand when it is over', 'To boast', 'To hide from church'],
          correctIndex: 1,
          correctFeedback: 'Yes! That ye may be able to withstand in the evil day, and having done all, to stand.',
          wrongFeedback: 'Take unto you the whole armour of God… withstand in the evil day (Ephesians 6:13).'
        },
        {
          question: 'What can we learn from the belt of truth?',
          choices: ['Lies are fine sometimes', 'Start with God\'s truth — it holds you ready for every battle', 'Truth does not matter', 'Only adults need truth'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Truth is the first piece — build on what God says.',
          wrongFeedback: 'Truth comes first: girt about with truth, then the rest of the armour follows (Ephesians 6:14).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — wrap yourself in God\'s truth!',
      takeaway: 'Gird yourself with truth — be strong in the Lord.',
      prayer: 'Lord, help me love Thy truth and live by it every day. Amen.'
    },

    armorOfGod: {
      kjvRef: 'Ephesians 6:10–18',
      paragraphs: [
        'Finally, my brethren, be strong in the Lord, and in the power of his might. Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.',
        'Stand therefore: having your loins girt about with truth, the breastplate of righteousness, your feet shod with the preparation of the gospel of peace; and take the helmet of salvation, and the sword of the Spirit, which is the word of God.',
        'Above all, taking the shield of faith, wherewith ye shall be able to quench all the fiery darts of the wicked.',
        'Praying always with all prayer and supplication in the Spirit, watching thereunto with all perseverance and supplication for all saints.',
        'God does not leave you bare — every piece helps you stand, trust, speak Scripture, and pray.'
      ],
      imagePrompts: [
        'bright cartoon for kids: friendly knight with belt breastplate shield helmet sword peaceful not scary, no text',
        'fun kid illustration: feet ready to share peace, gospel shoes, no text',
        'colorful Bible scene for children: shield stopping fiery darts, faith, no text',
        'exciting cartoon: hands folded praying for others, perseverance, no text',
        'hopeful ending illustration: whole armour glowing softly, child standing tall, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Put on the whole armor — pray for all saints!',
      quizHeading: 'Armor of God Questions',
      questions: [
        {
          question: 'What must we put on to stand against the devil\'s wiles?',
          choices: ['Only a helmet', 'The whole armour of God', 'Nothing', 'Our own anger'],
          correctIndex: 1,
          correctFeedback: 'Yes! Put on the whole armour of God.',
          wrongFeedback: 'Put on the whole armour of God, that ye may be able to stand against the wiles of the devil (Ephesians 6:11).'
        },
        {
          question: 'What is the sword of the Spirit?',
          choices: ['A metal toy', 'The word of God', 'Our loud voice only', 'Money'],
          correctIndex: 1,
          correctFeedback: 'Right! The sword of the Spirit… is the word of God.',
          wrongFeedback: 'The sword of the Spirit, which is the word of God (Ephesians 6:17).'
        },
        {
          question: 'What does the shield of faith do?',
          choices: ['Hides us from God', 'Quenches the fiery darts of the wicked', 'Makes us proud', 'Stops us from reading'],
          correctIndex: 1,
          correctFeedback: 'Yes! The shield of faith… shall quench all the fiery darts of the wicked.',
          wrongFeedback: 'Above all, taking the shield of faith… quench all the fiery darts of the wicked (Ephesians 6:16).'
        },
        {
          question: 'How should we pray, according to Paul?',
          choices: ['Never', 'Always with all prayer and supplication in the Spirit', 'Only when afraid', 'Only for ourselves'],
          correctIndex: 1,
          correctFeedback: 'Yes! Praying always… for all saints.',
          wrongFeedback: 'Praying always with all prayer and supplication in the Spirit… for all saints (Ephesians 6:18).'
        },
        {
          question: 'What can we learn from Ephesians 6?',
          choices: ['Fight alone in our own strength', 'God outfits us — truth, faith, Scripture, prayer — to stand firm', 'Armour is pretend', 'Do not help others'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The whole armour plus prayer keeps you standing.',
          wrongFeedback: 'Take the whole armour of God… praying always (Ephesians 6:13, 18).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — put on God\'s whole armor!',
      takeaway: 'Truth, righteousness, peace, faith, salvation, God\'s Word, and prayer — stand firm.',
      prayer: 'Lord, clothe me in Thy whole armor and teach me to pray for others. Amen.'
    },

    armorShield: {
      kjvRef: 'Ephesians 6:16',
      paragraphs: [
        'Above all, taking the shield of faith, wherewith ye shall be able to quench all the fiery darts of the wicked.',
        'Fiery darts are like sudden temptations, lies, or fears that fly at your heart.',
        'Faith trusts what God has said — even when you cannot see the whole picture.',
        'When you lift faith toward God, those darts lose their power — they cannot stick.',
        'Keep your shield up daily: remember Jesus, speak His promises, and ask Him for help.'
      ],
      imagePrompts: [
        'bright cartoon for kids: child with wooden shield blocking soft glowing arrows, not violent, no text',
        'fun kid illustration: fiery darts bouncing off shield of faith, no text',
        'colorful Bible scene for children: standing behind faith shield in storm, calm face, no text',
        'exciting cartoon: remembering Jesus cross and empty tomb, faith strong, no text',
        'hopeful ending illustration: family praying together, shields of faith, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Faith quenches the wicked one\'s fiery darts!',
      quizHeading: 'Shield of Faith Questions',
      questions: [
        {
          question: 'What does Paul say to take above all?',
          choices: ['A toy', 'The shield of faith', 'Only money', 'Silence always'],
          correctIndex: 1,
          correctFeedback: 'Yes! Above all, taking the shield of faith.',
          wrongFeedback: 'Above all, taking the shield of faith (Ephesians 6:16).'
        },
        {
          question: 'What can the shield of faith do?',
          choices: ['Quench all the fiery darts of the wicked', 'Make problems disappear instantly always', 'Replace prayer', 'Hide sin'],
          correctIndex: 0,
          correctFeedback: 'Right! Quench all the fiery darts of the wicked.',
          wrongFeedback: 'Wherewith ye shall be able to quench all the fiery darts of the wicked (Ephesians 6:16).'
        },
        {
          question: 'What is faith in simple terms here?',
          choices: ['Guessing', 'Trusting God and what He has said', 'Being loud', 'Ignoring the Bible'],
          correctIndex: 1,
          correctFeedback: 'Yes! Faith believes God — that is how the shield works.',
          wrongFeedback: 'Faith comes by hearing… the word of God (Romans 10:17) — trust His words.'
        },
        {
          question: 'Who sends the fiery darts?',
          choices: ['God', 'The wicked one — the devil\'s schemes', 'Our parents', 'The weather'],
          correctIndex: 1,
          correctFeedback: 'Paul links them to the wicked — part of spiritual battle.',
          wrongFeedback: 'The fiery darts of the wicked (Ephesians 6:16) fit the devil\'s wiles in the same chapter.'
        },
        {
          question: 'What can we learn from the shield of faith?',
          choices: ['Give up when tempted', 'Lift trust toward God — He helps you stand when lies and fears fly at you', 'Never tell anyone', 'Faith means no effort'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Faith is active trust — keep your shield up.',
          wrongFeedback: 'Taking the shield of faith… quench all the fiery darts (Ephesians 6:16).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — hold up faith!',
      takeaway: 'Lift the shield of faith — quench the devil\'s fiery darts.',
      prayer: 'Lord, grow my faith. Help me trust Thee when temptations come. Amen.'
    },

    armorSword: {
      kjvRef: 'Ephesians 6:17',
      paragraphs: [
        'Take the helmet of salvation, and the sword of the Spirit, which is the word of God.',
        'The sword of the Spirit is not for hurting people — it is God\'s Word used in the Spirit\'s power.',
        'Jesus answered the devil with Scripture — It is written — and the enemy had to flee.',
        'When wrong thoughts come, you can speak what God says: truth cuts through confusion.',
        'Hide God\'s words in your heart — read, listen, memorize — so the Spirit can bring them to mind in time of need.'
      ],
      imagePrompts: [
        'bright cartoon for kids: open Bible as gentle sword of light not violent, no text',
        'fun kid illustration: Jesus in wilderness holding Scripture scroll, calm, no text',
        'colorful Bible scene for children: helmet of salvation and sword together, no text',
        'exciting cartoon: child reciting verse with peace, darkness fading, no text',
        'hopeful ending illustration: family reading Bible together, word of God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The sword of the Spirit is the word of God!',
      quizHeading: 'Sword of the Spirit Questions',
      questions: [
        {
          question: 'What is the sword of the Spirit?',
          choices: ['A toy sword', 'The word of God', 'Angry shouting', 'Magic words'],
          correctIndex: 1,
          correctFeedback: 'Yes! The sword of the Spirit, which is the word of God.',
          wrongFeedback: 'The sword of the Spirit, which is the word of God (Ephesians 6:17).'
        },
        {
          question: 'What else does Paul pair with the sword in the same verse?',
          choices: ['A drum', 'The helmet of salvation', 'A crown of thorns only', 'Sandals only'],
          correctIndex: 1,
          correctFeedback: 'Right! Take the helmet of salvation, and the sword of the Spirit.',
          wrongFeedback: 'Take the helmet of salvation, and the sword of the Spirit (Ephesians 6:17).'
        },
        {
          question: 'How did Jesus use Scripture against the tempter?',
          choices: ['He ignored the Bible', 'It is written — He answered with God\'s Word', 'He ran away only', 'He argued with jokes'],
          correctIndex: 1,
          correctFeedback: 'Yes! He said, It is written, three times (Matthew 4:4, 7, 10).',
          wrongFeedback: 'Jesus met temptation with It is written — God\'s Word (Matthew 4).'
        },
        {
          question: 'Why hide God\'s word in your heart?',
          choices: ['To show off', 'So the Spirit can remind you in trouble and help you not sin', 'To forget it', 'To replace prayer'],
          correctIndex: 1,
          correctFeedback: 'Yes! Thy word have I hid in mine heart, that I might not sin against thee (Psalm 119:11).',
          wrongFeedback: 'Hiding Scripture helps you obey — Psalm 119:11 ties memory to not sinning.'
        },
        {
          question: 'What can we learn from the sword of the Spirit?',
          choices: ['Never read the Bible', 'God\'s Word is your weapon — use it with the Spirit, not to hurt people', 'Only pastors need Scripture', 'Words do not matter'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Speak God\'s truth in love — the Word clears lies.',
          wrongFeedback: 'The sword of the Spirit is the word of God (Ephesians 6:17) — for spiritual battle, not bullying.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — wield God\'s Word!',
      takeaway: 'The word of God is your sword — learn it, speak it, live it.',
      prayer: 'Lord, write Thy word on my heart. Help me use Scripture in love. Amen.'
    },

    ascension: {
      kjvRef: 'Acts 1:6–11',
      paragraphs: [
        'The disciples asked, "Lord, wilt thou at this time restore again the kingdom to Israel?" Jesus said, "It is not for you to know the times or the seasons."',
        'Jesus said, "Ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me… unto the uttermost part of the earth."',
        'When He had spoken, He was taken up; and a cloud received Him out of their sight.',
        'Two men in white apparel stood by and said, "Ye men of Galilee, why stand ye gazing up into heaven? This same Jesus… shall so come in like manner as ye have seen him go into heaven."',
        'The disciples returned to Jerusalem with great joy, waiting for the promise of the Father.'
      ],
      imagePrompts: [
        'bright cartoon for kids: disciples asking Jesus about the kingdom, no text',
        'fun kid illustration: Jesus promising power of Holy Ghost, be witnesses, no text',
        'colorful Bible scene for children: Jesus taken up, cloud receiving Him, no text',
        'exciting cartoon: two men in white saying "Why stand ye gazing?", Jesus will return, no text',
        'hopeful ending illustration: disciples returning to Jerusalem with joy, waiting for promise, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus ascended — He will return!',
      quizHeading: 'Jesus\' Ascension Questions',
      questions: [
        {
          question: 'What did the disciples ask Jesus?',
          choices: ['When will You return?', 'Wilt thou restore the kingdom to Israel?', 'Where are You going?', 'Who is the Holy Ghost?'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Wilt thou at this time restore again the kingdom to Israel?"',
          wrongFeedback: 'They asked "Lord, wilt thou at this time restore again the kingdom to Israel?" (Acts 1:6).'
        },
        {
          question: 'What did Jesus say they would receive?',
          choices: ['Money', 'Power, after the Holy Ghost is come upon you', 'A kingdom', 'Food'],
          correctIndex: 1,
          correctFeedback: 'Right! Power after the Holy Ghost comes.',
          wrongFeedback: 'Jesus said "Ye shall receive power, after that the Holy Ghost is come upon you" (Acts 1:8).'
        },
        {
          question: 'What happened to Jesus?',
          choices: ['He stayed', 'He was taken up, a cloud received Him', 'He walked away', 'He slept'],
          correctIndex: 1,
          correctFeedback: 'Yes! Taken up, a cloud received Him.',
          wrongFeedback: 'While they beheld, he was taken up; and a cloud received him out of their sight (Acts 1:9).'
        },
        {
          question: 'What did the two men in white say?',
          choices: ['He is gone forever', 'This same Jesus shall so come in like manner', 'Go home', 'Fear not'],
          correctIndex: 1,
          correctFeedback: 'Yes! "This same Jesus… shall so come in like manner as ye have seen him go."',
          wrongFeedback: 'The two men said "This same Jesus… shall so come in like manner" (Acts 1:11).'
        },
        {
          question: 'What can we learn from Jesus\' ascension?',
          choices: ['Jesus is gone forever', 'Jesus will return — wait for the Holy Ghost', 'Never wait', 'Doubt His return'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus will return — wait for the Holy Ghost.',
          wrongFeedback: 'Jesus ascended — He will return, and we wait for the promise!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus will return!',
      takeaway: 'Jesus ascended — He will return.',
      prayer: 'Jesus, thank You for ascending. Help me wait for Your return. Amen.'
    },

    beastMark: {
      kjvRef: 'Revelation 13:16–18',
      paragraphs: [
        'John saw a beast rising out of the sea, speaking great things and blasphemies — many wondered after the beast.',
        'The second beast caused all to receive a mark in their right hand, or in their foreheads: that no man might buy or sell, save he that had the mark, or the name of the beast, or the number of his name.',
        'Here is wisdom. Let him that hath understanding count the number of the beast: for it is the number of a man; and his number is Six hundred threescore and six.',
        'The picture is not a math puzzle to scare you — it warns God\'s people: do not worship the beast or its image; stay faithful to Jesus.',
        'Belong to the Lamb: His name is written on those who love Him — that is the mark that lasts forever.'
      ],
      imagePrompts: [
        'bright cartoon for kids: gentle John writing vision scroll, calm not scary, no text',
        'fun kid illustration: crowd choosing between humble cross and proud beast silhouette, no text',
        'colorful Bible scene for children: Lamb of God in light, safe hope, no text',
        'exciting cartoon: child praying with Bible, Jesus first, no text',
        'hopeful ending illustration: Jesus shepherd protecting sheep, love not fear, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Stay faithful to Jesus — do not worship the beast!',
      quizHeading: 'The Beast and the Mark Questions',
      questions: [
        {
          question: 'What did the second beast try to make everyone do?',
          choices: ['Sing only', 'Receive a mark in hand or forehead to buy and sell', 'Plant gardens', 'Build a tower'],
          correctIndex: 1,
          correctFeedback: 'Yes! A mark so only those marked could buy or sell.',
          wrongFeedback: 'He causeth all… to receive a mark in their right hand, or in their foreheads (Revelation 13:16).'
        },
        {
          question: 'What is the number of the beast?',
          choices: ['Seven', 'Six hundred threescore and six', 'Twelve', 'Forty'],
          correctIndex: 1,
          correctFeedback: 'Right! Six hundred threescore and six — 666.',
          wrongFeedback: 'His number is Six hundred threescore and six (Revelation 13:18).'
        },
        {
          question: 'What does the vision warn us to do?',
          choices: ['Worship power that hates God', 'Love Jesus first — do not worship the beast or its image', 'Hide always', 'Ignore the Bible'],
          correctIndex: 1,
          correctFeedback: 'Yes! Stay faithful to God, not to evil power.',
          wrongFeedback: 'Elsewhere John warns worshipping the beast and image (Revelation 13:15–17; 14:9–11).'
        },
        {
          question: 'Who has real wisdom in this verse?',
          choices: ['Only proud kings', 'Him that hath understanding — God gives discernment', 'No one', 'Fortune tellers'],
          correctIndex: 1,
          correctFeedback: 'Yes! Here is wisdom. Let him that hath understanding count…',
          wrongFeedback: 'Here is wisdom. Let him that hath understanding count the number of the beast (Revelation 13:18).'
        },
        {
          question: 'What can we learn today?',
          choices: ['666 is a joke', 'Jesus is Lord — trust Him more than money, popularity, or fear', 'Numbers save us', 'We cannot obey God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Love and obey Jesus — He is stronger than any beast.',
          wrongFeedback: 'The point is loyalty: worship God, not the beast\'s system (Revelation 13–14).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is Lord!',
      takeaway: 'Stay faithful to Jesus — His people belong to the Lamb.',
      prayer: 'Lord Jesus, Thou art my King. Help me love Thee more than anything in this world. Amen.'
    },

    betrayal: {
      kjvRef: 'Matthew 26:47–50',
      paragraphs: [
        'While Jesus yet spake, lo, Judas, one of the twelve, came, and with him a great multitude with swords and staves, from the chief priests and elders of the people.',
        'Judas went before them and said, Whomsoever I shall kiss, that same is he: hold him fast. That was the sign he chose — a friend\'s kiss to point out the Son of God.',
        'Judas came to him, and said, Hail, master; and kissed him. And Jesus said unto him, Friend, wherefore art thou come? The Lord knew what the kiss meant — yet He went forward to save us.',
        'Then came they, and laid hands on Jesus, and took him. The disciples were afraid — but the story shows both the pain of betrayal and Jesus\' steady love.',
        'In another Gospel Jesus also said, Judas, betrayest thou the Son of man with a kiss? — showing how deep the hurt was, and how steady His love still was.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus calm in garden, crowd with torches far off, solemn not gory, no text',
        'fun kid illustration: Judas kiss, Jesus sad eyes still loving, no text',
        'colorful Bible scene for children: disciples startled, Peter with sword moment, no text',
        'exciting cartoon: Jesus willing to go — love for us, no text',
        'hopeful ending illustration: cross far hint, forgiveness theme, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus knew Judas — yet He loved to the end.',
      quizHeading: 'Judas Betrays Jesus Questions',
      questions: [
        {
          question: 'Who led the crowd to Jesus?',
          choices: ['Peter', 'Judas, one of the twelve', 'Pilate', 'Mary'],
          correctIndex: 1,
          correctFeedback: 'Yes! Judas, one of the twelve, came with a multitude.',
          wrongFeedback: 'Judas, one of the twelve, came, and with him a great multitude (Matthew 26:47).'
        },
        {
          question: 'How did Judas mark which man to seize?',
          choices: ['He shouted a name', 'Whomsoever I shall kiss, that same is he', 'He pointed with a flag', 'He stayed silent'],
          correctIndex: 1,
          correctFeedback: 'Right! The kiss was the cruel sign.',
          wrongFeedback: 'Whomsoever I shall kiss, that same is he: hold him fast (Matthew 26:48).'
        },
        {
          question: 'What did Jesus say to Judas in Matthew when Judas kissed Him?',
          choices: ['Fight me', 'Friend, wherefore art thou come?', 'Run away', 'Thank you'],
          correctIndex: 1,
          correctFeedback: 'Yes! Friend, wherefore art thou come? — then they took Jesus.',
          wrongFeedback: 'And Jesus said unto him, Friend, wherefore art thou come? (Matthew 26:50). The "betrayest thou… with a kiss?" line is in Luke 22:48.'
        },
        {
          question: 'What did the crowd do then?',
          choices: ['They left', 'They laid hands on Jesus, and took him', 'They sang', 'They ate supper'],
          correctIndex: 1,
          correctFeedback: 'Yes! They seized Jesus.',
          wrongFeedback: 'Then came they, and laid hands on Jesus, and took him (Matthew 26:50).'
        },
        {
          question: 'What can we learn?',
          choices: ['Betrayal is fine', 'Jesus stayed faithful when a friend failed — He can heal our hurts and forgive us too', 'Never trust anyone', 'Jesus was surprised and angry only'],
          correctIndex: 1,
          correctFeedback: 'Perfect! His love did not stop at Judas\' kiss.',
          wrongFeedback: 'Jesus knew, loved, and went on to die for sinners — including us (Matthew 26:50; Luke 22:48).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus loves faithfully!',
      takeaway: 'Even when friends fail, Jesus\' love is steady — turn to Him.',
      prayer: 'Lord Jesus, thank Thee for loving me when I fail. Help me be faithful to Thee. Amen.'
    },

    comeLordJesus: {
      kjvRef: 'Revelation 22:17–21',
      paragraphs: [
        'The Spirit and the bride say, Come. And let him that heareth say, Come. And let him that is athirst come. And whosoever will, let him take the water of life freely.',
        'For I testify unto every man that heareth the words of the prophecy of this book, If any man shall add unto these things, God shall add unto him the plagues that are written in this book.',
        'He which testifieth these things saith, Surely I come quickly. Amen. Even so, come, Lord Jesus.',
        'The grace of our Lord Jesus Christ be with you all. Amen.',
        'John ended the Bible with a prayer — not fear, but longing for Jesus. We can pray the same: Come, Lord Jesus.'
      ],
      imagePrompts: [
        'bright cartoon for kids: open Bible last page, soft light, peaceful prayer, no text',
        'fun kid illustration: river of life invitation, thirsty welcome, no text',
        'colorful Bible scene for children: bride and Spirit saying Come, gentle, no text',
        'exciting cartoon: child praying Amen come Lord Jesus, dawn sky, no text',
        'hopeful ending illustration: Jesus face gentle in clouds hint, hope, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The Bible ends with "Come, Lord Jesus!"',
      quizHeading: 'Come, Lord Jesus Questions',
      questions: [
        {
          question: 'Who says "Come" first in Revelation 22:17?',
          choices: ['Only angels', 'The Spirit and the bride', 'Pharaoh', 'No one'],
          correctIndex: 1,
          correctFeedback: 'Yes! The Spirit and the bride say, Come.',
          wrongFeedback: 'The Spirit and the bride say, Come (Revelation 22:17).'
        },
        {
          question: 'Who may take the water of life?',
          choices: ['Only rich people', 'Whosoever will', 'Only kings', 'No one today'],
          correctIndex: 1,
          correctFeedback: 'Right! Whosoever will, let him take the water of life freely.',
          wrongFeedback: 'Whosoever will, let him take the water of life freely (Revelation 22:17).'
        },
        {
          question: 'What did Jesus say about His coming?',
          choices: ['I will never come', 'Surely I come quickly', 'Wait a thousand years silently', 'Only John may come'],
          correctIndex: 1,
          correctFeedback: 'Yes! Surely I come quickly.',
          wrongFeedback: 'He which testifieth these things saith, Surely I come quickly (Revelation 22:20).'
        },
        {
          question: 'How did John answer?',
          choices: ['Go away', 'Amen. Even so, come, Lord Jesus', 'Be quiet', 'I am afraid only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Amen. Even so, come, Lord Jesus.',
          wrongFeedback: 'Amen. Even so, come, Lord Jesus (Revelation 22:20).'
        },
        {
          question: 'What can we learn?',
          choices: ['The Bible has no ending', 'Invite others to Jesus, thirst for Him, and pray for His return with joy', 'Never say Amen', 'Grace does not matter'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Come, take the water of life — and pray Maranatha with hope.',
          wrongFeedback: 'The grace of our Lord Jesus Christ be with you all. Amen (Revelation 22:21).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Come, Lord Jesus!',
      takeaway: 'Say yes to Jesus — pray for His coming and share His invitation.',
      prayer: 'Lord Jesus, Amen — even so, come. Let Thy grace be with us. Amen.'
    },

    crossCarry: {
      kjvRef: 'Luke 23:26',
      paragraphs: [
        'When Jesus was led away to be crucified, the soldiers laid hold upon one Simon, a Cyrenian, coming out of the country, and on him they laid the cross, that he might bear it after Jesus.',
        'Jesus had already been beaten and weakened — the wood was heavy. Simon did not plan this duty, yet he walked behind the Lord.',
        'The moment reminds us: Jesus carried our sins; sometimes God asks us to help carry a burden for someone else.',
        'Galatians says, Bear ye one another\'s burdens, and so fulfil the law of Christ — Simon lived a picture of that love.',
        'When you help a friend who is sad, tired, or in trouble, you are walking a little like Simon — close to Jesus.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Simon of Cyrene helping carry wooden cross behind Jesus, solemn gentle not gory, no text',
        'fun kid illustration: dusty road to skull hill, compassion in Simon\'s face, no text',
        'colorful Bible scene for children: Roman guard nearby, focus on help not cruelty detail, no text',
        'exciting cartoon: two children sharing a heavy backpack, kindness, no text',
        'hopeful ending illustration: hands helping hands, Jesus love in background light, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Simon bore the cross after Jesus — we can help others too.',
      quizHeading: 'Simon Helps Carry the Cross Questions',
      questions: [
        {
          question: 'Who was made to carry the cross?',
          choices: ['Peter', 'Simon, a Cyrenian', 'Pilate', 'John only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Simon… they laid the cross, that he might bear it after Jesus.',
          wrongFeedback: 'They laid hold upon one Simon, a Cyrenian… on him they laid the cross (Luke 23:26).'
        },
        {
          question: 'Where was Simon from?',
          choices: ['Jerusalem only', 'Cyrene — he was coming out of the country', 'Rome', 'Egypt'],
          correctIndex: 1,
          correctFeedback: 'Right! A Cyrenian, coming out of the country.',
          wrongFeedback: 'Simon, a Cyrenian, coming out of the country (Luke 23:26).'
        },
        {
          question: 'Whom did Simon follow as he carried the wood?',
          choices: ['Judas', 'Jesus', 'The crowd only', 'No one'],
          correctIndex: 1,
          correctFeedback: 'Yes! Bear it after Jesus.',
          wrongFeedback: 'That he might bear it after Jesus (Luke 23:26).'
        },
        {
          question: 'What New Testament verse fits Simon\'s deed?',
          choices: ['Love money', 'Bear ye one another\'s burdens, and so fulfil the law of Christ', 'Hide from friends', 'Never help'],
          correctIndex: 1,
          correctFeedback: 'Yes! Helping burdens shows Christ\'s love.',
          wrongFeedback: 'Bear ye one another\'s burdens, and so fulfil the law of Christ (Galatians 6:2).'
        },
        {
          question: 'What can we learn?',
          choices: ['Ignore people who hurt', 'When God opens a door to help, step in — small acts of help follow Jesus', 'Only adults help', 'Carrying is always easy'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Be a Simon — share the load with kindness.',
          wrongFeedback: 'Simon helped Jesus in His hour — we help others in ours (Luke 23:26; Galatians 6:2).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — help carry burdens in love!',
      takeaway: 'Bear one another\'s burdens — that fulfils Christ\'s law of love.',
      prayer: 'Lord Jesus, thank Thee for carrying my sin. Help me help others. Amen.'
    },

    crucifixion: {
      kjvRef: 'Matthew 27; Mark 15; Luke 23; John 19',
      paragraphs: [
        'Jesus was betrayed, tried, and sentenced to die on the cross. Soldiers mocked Him and put a crown of thorns upon His head.',
        'They led Him to Golgotha, a place of a skull. They crucified Him between two thieves. Jesus said, Father, forgive them; for they know not what they do.',
        'From the sixth hour to the ninth hour there was darkness over all the land. When Jesus had received the vinegar, he said, It is finished: and he bowed his head, and gave up the ghost.',
        'The veil of the temple was rent in twain from the top to the bottom. The centurion watching said, Truly this was the Son of God.',
        'They laid His body in a tomb. He died for our sins — but death could not hold Him: He rose again the third day.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus carrying cross toward hill, gentle solemn style, no gore, no text',
        'fun kid illustration: three crosses on hill silhouette, sky dark, no blood detail, no text',
        'colorful Bible scene for children: torn veil in temple, awe, no text',
        'exciting cartoon: centurion in armor looking up, wonder, no text',
        'hopeful ending illustration: sealed tomb at dusk, promise of morning resurrection, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus died for our sins — the greatest love!',
      quizHeading: 'Crucifixion Questions',
      questions: [
        {
          question: 'Where was Jesus crucified?',
          choices: ['In the temple', 'Golgotha, a place of a skull', 'By the sea alone', 'In Joseph\'s house'],
          correctIndex: 1,
          correctFeedback: 'Yes! Golgotha — the place of a skull.',
          wrongFeedback: 'They came unto a place called Golgotha, that is to say, a place of a skull (Matthew 27:33).'
        },
        {
          question: 'What did Jesus pray for those who crucified Him (Luke)?',
          choices: ['Punish them', 'Father, forgive them; for they know not what they do', 'Forget them', 'Go away'],
          correctIndex: 1,
          correctFeedback: 'Right! He asked the Father to forgive them.',
          wrongFeedback: 'Then said Jesus, Father, forgive them; for they know not what they do (Luke 23:34).'
        },
        {
          question: 'What happened over the land while He hung on the cross?',
          choices: ['Bright sun all day', 'Darkness from the sixth hour to the ninth hour', 'Snow', 'Thunder only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Darkness over all the land those hours.',
          wrongFeedback: 'Now from the sixth hour there was darkness over all the land unto the ninth hour (Matthew 27:45).'
        },
        {
          question: 'What did Jesus say in John just before He gave up His spirit?',
          choices: ['I am lost', 'It is finished', 'I will not die', 'Leave Me'],
          correctIndex: 1,
          correctFeedback: 'Yes! It is finished — then He bowed His head.',
          wrongFeedback: 'When Jesus therefore had received the vinegar, he said, It is finished: and he bowed his head, and gave up the ghost (John 19:30).'
        },
        {
          question: 'What can we learn from the crucifixion?',
          choices: ['Jesus did not love us', 'Christ died for our sins — God\'s love to save us', 'The story ends at the tomb', 'We should not forgive'],
          correctIndex: 1,
          correctFeedback: 'Perfect! He bore our sin — trust Him for forgiveness and life.',
          wrongFeedback: 'Christ died for our sins according to the scriptures (1 Corinthians 15:3) — the cross is love.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus died for us!',
      takeaway: 'Jesus died for our sins — the greatest love.',
      prayer: 'Lord Jesus, thank Thee for dying for me. Forgive my sins and make me Thine. Amen.'
    },

    danielPray: {
      kjvRef: 'Daniel 6',
      paragraphs: [
        'King Darius made a firm decree that whosoever should ask a petition of any God or man for thirty days, save of the king, should be cast into the den of lions.',
        'Daniel knew the writing was signed. He went into his house; his windows being open in his chamber toward Jerusalem, he kneeled upon his knees three times a day, and prayed, and gave thanks before his God, as he did aforetime.',
        'The presidents and princes told the king. The king was displeased with himself, yet they cast Daniel into the den of lions; a stone was brought, and laid upon the mouth of the den.',
        'The king passed the night fasting. At dawn he cried, O Daniel, servant of the living God, is thy God, whom thou servest continually, able to deliver thee from the lions?',
        'Daniel answered, My God hath sent his angel, and hath shut the lions\' mouths. The king commanded that Daniel\'s accusers be cast to the lions — and the lions brake all their bones.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Daniel praying by open window toward Jerusalem, peaceful courage, no text',
        'fun kid illustration: jealous officials whispering to king, no text',
        'colorful Bible scene for children: stone over lions\' den, worried king, no text',
        'exciting cartoon: Daniel among calm lions at dawn, angel light hint, no text',
        'happy ending illustration: king glad, Daniel safe, God praised, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Daniel prayed as always — God shut the lions\' mouths!',
      quizHeading: 'Daniel Prays Three Times a Day Questions',
      questions: [
        {
          question: 'How often did Daniel pray?',
          choices: ['Once a week', 'Three times a day', 'Never', 'Only when afraid'],
          correctIndex: 1,
          correctFeedback: 'Yes! Three times a day, as aforetime.',
          wrongFeedback: 'He kneeled… three times a day, and prayed… before his God, as he did aforetime (Daniel 6:10).'
        },
        {
          question: 'What did the king\'s decree forbid for thirty days?',
          choices: ['Eating bread', 'Asking any petition of any God or man, save of the king — or lions', 'Walking in the city', 'Reading'],
          correctIndex: 1,
          correctFeedback: 'Right! Only to the king — or the lions\' den.',
          wrongFeedback: 'Whosoever shall ask a petition of any God or man for thirty days, save of thee, O king, he shall be cast into the den of lions (Daniel 6:7).'
        },
        {
          question: 'What did Daniel do when the decree was signed?',
          choices: ['Stopped praying', 'Prayed three times a day with windows open toward Jerusalem', 'Prayed only in secret whispers', 'Left the city'],
          correctIndex: 1,
          correctFeedback: 'Yes! He kept praying openly to God.',
          wrongFeedback: 'Daniel… kneeled… three times a day, and prayed… as he did aforetime (Daniel 6:10).'
        },
        {
          question: 'How did God keep Daniel safe?',
          choices: ['Daniel fought the lions', 'God sent His angel and shut the lions\' mouths', 'The lions were not real', 'The king pulled him out at midnight'],
          correctIndex: 1,
          correctFeedback: 'Yes! My God hath sent his angel, and hath shut the lions\' mouths.',
          wrongFeedback: 'My God hath sent his angel, and hath shut the lions\' mouths (Daniel 6:22).'
        },
        {
          question: 'What can we learn from Daniel?',
          choices: ['Hide from God when laws are hard', 'Keep praying and obeying God — He is able to deliver', 'Only kings may pray', 'Give up when scared'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God is greater than any decree.',
          wrongFeedback: 'Daniel served God continually — God delivered him (Daniel 6:16, 22).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — keep praying!',
      takeaway: 'Keep praying to God — He hears and can deliver.',
      prayer: 'God, help me pray to Thee faithfully. Thank Thee for hearing me. Amen.'
    },

    davidCave: {
      kjvRef: '1 Samuel 22:1–2; 24',
      paragraphs: [
        'David fled from Saul and hid in the cave Adullam. Every one that was in distress, every one that was in debt, and every one that was discontented, gathered themselves unto him; and he became a captain over them: about four hundred men.',
        'God was with David even in the cave — those men looked to him for leadership.',
        'Later Saul sought David. When Saul entered the cave to cover his feet, David\'s men whispered, Behold, the day of which the Lord said unto thee, Behold, I will deliver thine enemy into thine hand.',
        'David arose and cut off the skirt of Saul\'s robe privily. His heart smote him — he spared Saul\'s life and said, The Lord forbid that I should do this thing unto my lord\'s anointed.',
        'David showed mercy. Saul wept and said, Thou art more righteous than I: for thou hast rewarded me good, whereas I have rewarded thee evil.'
      ],
      imagePrompts: [
        'bright cartoon for kids: David with band of men near cave mouth, hopeful not scary, no text',
        'fun kid illustration: Saul in cave unaware, David quietly cutting skirt of robe, no text',
        'colorful Bible scene for children: David holding piece of robe, conviction in eyes, no text',
        'exciting cartoon: David calling to Saul from distance, showing mercy, no text',
        'hopeful ending illustration: Saul moved, David humble, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'David spared Saul — the Lord\'s anointed!',
      quizHeading: 'David Hides in the Cave Questions',
      questions: [
        {
          question: 'Where did David hide from Saul?',
          choices: ['The palace', 'The cave Adullam', 'Egypt', 'The tabernacle only'],
          correctIndex: 1,
          correctFeedback: 'Yes! The cave Adullam — about four hundred men joined him.',
          wrongFeedback: 'David… escaped to the cave Adullam (1 Samuel 22:1).'
        },
        {
          question: 'Who gathered to David there?',
          choices: ['Only kings', 'Men in distress, in debt, and discontented', 'Philistine soldiers', 'Priests only'],
          correctIndex: 1,
          correctFeedback: 'Right! About four hundred such men.',
          wrongFeedback: 'Every one that was in distress… in debt… discontented, gathered… unto him (1 Samuel 22:2).'
        },
        {
          question: 'What did David\'s men say when Saul was in the cave?',
          choices: ['Behold, the day when the Lord will deliver thine enemy into thine hand', 'Run to Egypt', 'Kill everyone', 'Say nothing'],
          correctIndex: 0,
          correctFeedback: 'Yes! They said the Lord would deliver Saul into David\'s hand.',
          wrongFeedback: 'Behold, the day of which the Lord said unto thee, Behold, I will deliver thine enemy into thine hand (1 Samuel 24:4).'
        },
        {
          question: 'What did David do to Saul\'s robe?',
          choices: ['Burned it all', 'Cut off the skirt privily but hurt not Saul', 'Tore it publicly', 'Sold it'],
          correctIndex: 1,
          correctFeedback: 'Yes! He cut the skirt secretly — then spared him.',
          wrongFeedback: 'David arose, and cut off the skirt of Saul\'s robe privily (1 Samuel 24:4).'
        },
        {
          question: 'What can we learn from David in the cave?',
          choices: ['Strike when you have the chance', 'Show mercy — the Lord forbids harming His anointed wrongly', 'Hide forever', 'Trust only swords'],
          correctIndex: 1,
          correctFeedback: 'Perfect! David honoured God more than revenge.',
          wrongFeedback: 'The Lord forbid that I should do this thing unto my lord, the Lord\'s anointed (1 Samuel 24:6).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — show mercy!',
      takeaway: 'Show mercy when you could harm — God honours a humble heart.',
      prayer: 'Lord, help me show mercy like David. Keep me from evil revenge. Amen.'
    },

    davidHarp: {
      kjvRef: '1 Samuel 16:14–23',
      paragraphs: [
        'The Spirit of the Lord departed from Saul, and an evil spirit from the Lord troubled him. His servants said, Let our lord now command thy servants… to seek out a man, who is a cunning player on an harp.',
        'They found David, the son of Jesse, an cunning player, and a mighty valiant man, and a man of war, and prudent in matters, and a comely person, and the Lord is with him.',
        'David came to Saul and stood before him: and he loved him greatly; and he became his armourbearer. Saul sent to Jesse, saying, Let David, I pray thee, stand before me; for he hath found favour in my sight.',
        'And it came to pass, when the evil spirit from God was upon Saul, that David took an harp, and played with his hand: so Saul was refreshed, and was well, and the evil spirit departed from him.',
        'God used David\'s music — a gift for peace when darkness pressed the king.'
      ],
      imagePrompts: [
        'bright cartoon for kids: young David with harp before troubled Saul on couch, gentle light, no text',
        'fun kid illustration: evil spirit cloud lifting as music plays, calm faces, no text',
        'colorful Bible scene for children: Jesse\'s son introduced, comely and ruddy, no text',
        'exciting cartoon: David as armourbearer, loyal service, no text',
        'happy ending illustration: refreshed king, peaceful room, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'David played — the evil spirit departed!',
      quizHeading: 'David Plays the Harp Questions',
      questions: [
        {
          question: 'What troubled Saul after the Spirit of the Lord departed from him?',
          choices: ['An evil spirit from the Lord', 'Only hunger', 'A broken leg', 'Rain'],
          correctIndex: 0,
          correctFeedback: 'Yes! An evil spirit… troubled him.',
          wrongFeedback: 'The Spirit of the Lord departed from Saul, and an evil spirit from the Lord troubled him (1 Samuel 16:14).'
        },
        {
          question: 'What did Saul\'s servants suggest they find?',
          choices: ['A new crown', 'A man who can play the harp well', 'A lion tamer', 'A cook'],
          correctIndex: 1,
          correctFeedback: 'Right! A cunning player on an harp.',
          wrongFeedback: 'Seek out a man, who is a cunning player on an harp (1 Samuel 16:16).'
        },
        {
          question: 'Whom did they bring?',
          choices: ['Samuel only', 'David the son of Jesse', 'Jonathan', 'Goliath'],
          correctIndex: 1,
          correctFeedback: 'Yes! David — the Lord was with him.',
          wrongFeedback: 'Then answered one of the servants, and said, Behold, I have seen a son of Jesse… (1 Samuel 16:18).'
        },
        {
          question: 'What happened when David played the harp?',
          choices: ['Saul grew worse', 'Saul was refreshed and well; the evil spirit departed', 'David ran away', 'Nothing'],
          correctIndex: 1,
          correctFeedback: 'Yes! Refreshed, well, evil spirit gone.',
          wrongFeedback: 'David took an harp, and played… so Saul was refreshed, and was well, and the evil spirit departed from him (1 Samuel 16:23).'
        },
        {
          question: 'What can we learn from David\'s harp?',
          choices: ['Music never helps', 'God can use your gifts to bring peace to others', 'Hide every talent', 'Only adults worship'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Offer your gifts to God — He uses them.',
          wrongFeedback: 'God used David\'s playing to help Saul (1 Samuel 16:23).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God uses music!',
      takeaway: 'God can use music and gifts to bring peace.',
      prayer: 'Lord, thank Thee for music. Use my gifts for Thy glory. Amen.'
    },

    davidSheep: {
      kjvRef: '1 Samuel 16:11; 17:15, 34–37',
      paragraphs: [
        'Samuel said to Jesse, Are here all thy children? Jesse answered, There remaineth yet the youngest, and, behold, he keepeth the sheep. Samuel said, Send and fetch him.',
        'David was ruddy, and of a beautiful countenance, and goodly to look at. The Lord said, Arise, anoint him: for this is he.',
        'David went and returned from Saul to feed his father\'s sheep at Bethlehem — faithful in the small work.',
        'When Goliath defied Israel, David told Saul, Thy servant kept his father\'s sheep… there came a lion, and a bear, and took a lamb… I went out after him, and smote him, and delivered it out of his mouth.',
        'The Lord that delivered me out of the paw of the lion… will deliver me out of the hand of this Philistine. David trusted the same God for sheep and giants.'
      ],
      imagePrompts: [
        'bright cartoon for kids: young David with flock in Bethlehem hills, peaceful, no text',
        'fun kid illustration: Samuel asking Jesse if these are all his sons, no text',
        'colorful Bible scene for children: David anointed, ruddy and fair, no text',
        'exciting cartoon: David defending lamb from lion or bear, brave not gory, no text',
        'hopeful ending illustration: David with sling, trusting God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Faithful with sheep — God chose David\'s heart!',
      quizHeading: 'David Keeps the Sheep Questions',
      questions: [
        {
          question: 'What was the youngest son doing when Samuel came?',
          choices: ['Fighting Goliath', 'Keeping the sheep', 'Sleeping in the palace', 'Building a house'],
          correctIndex: 1,
          correctFeedback: 'Yes! He keepeth the sheep.',
          wrongFeedback: 'There remaineth yet the youngest, and, behold, he keepeth the sheep (1 Samuel 16:11).'
        },
        {
          question: 'What did the Lord say when David stood before Samuel?',
          choices: ['Send him away', 'Arise, anoint him: for this is he', 'Wait ten years', 'He is too small'],
          correctIndex: 1,
          correctFeedback: 'Right! Arise, anoint him: for this is he.',
          wrongFeedback: 'The Lord said, Arise, anoint him: for this is he (1 Samuel 16:12).'
        },
        {
          question: 'What animals did David say he took a lamb from?',
          choices: ['Wolf and fox', 'A lion and a bear', 'Snake and bird', 'Deer only'],
          correctIndex: 1,
          correctFeedback: 'Yes! He delivered the lamb from lion and bear.',
          wrongFeedback: 'There came a lion, and a bear, and took a lamb out of the flock (1 Samuel 17:34).'
        },
        {
          question: 'Whom did David say would deliver him from Goliath?',
          choices: ['Only Saul\'s armour', 'The Lord that delivered him from the lion and the bear', 'Luck', 'No one'],
          correctIndex: 1,
          correctFeedback: 'Yes! The same Lord who saved him before.',
          wrongFeedback: 'The Lord that delivered me out of the paw of the lion… will deliver me out of the hand of this Philistine (1 Samuel 17:37).'
        },
        {
          question: 'What can we learn from David keeping sheep?',
          choices: ['Small jobs do not matter', 'Be faithful in little — God sees the heart and gives strength for big trials', 'Only oldest sons matter', 'Never watch animals'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God chose David\'s heart — faithfulness counted.',
          wrongFeedback: 'Man looketh on the outward appearance, but the Lord looketh on the heart (1 Samuel 16:7).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God chooses the faithful!',
      takeaway: 'Be faithful in small things — God looks on the heart.',
      prayer: 'Lord, make my heart like David\'s — faithful to Thee in all I do. Amen.'
    },

    deborahJudge: {
      kjvRef: 'Judges 4–5',
      paragraphs: [
        'Deborah, a prophetess, judged Israel at that time; she dwelt under the palm tree of Deborah between Ramah and Bethel, and the children of Israel came up to her for judgment.',
        'Jabin king of Canaan oppressed Israel twenty years — Sisera was captain of his host with nine hundred chariots of iron. Deborah sent for Barak: Hath not the Lord God of Israel commanded thee, Go and draw toward mount Tabor, and take ten thousand men?',
        'Barak said, If thou wilt go with me, then I will go: but if thou wilt not go with me, then I will not go. Deborah said she would go, yet the journey would not be for his honour — the Lord would sell Sisera into the hand of a woman.',
        'The Lord discomfited Sisera and all his chariots; Sisera fled on his feet to Jael\'s tent. She covered him, gave him milk, and when he slept she smote the nail into his temples — so God subdued Jabin before Israel.',
        'Deborah and Barak sang that the princes of Israel offered themselves willingly — and the land had rest forty years.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Deborah under palm tree, people coming for judgment, peaceful wisdom, no text',
        'fun kid illustration: Deborah speaking God\'s command to Barak, Mount Tabor hint, no text',
        'colorful Bible scene for children: battle won, chariots confused, no gore, no text',
        'exciting cartoon: tent scene gentle silhouette, milk and rest, no graphic peg, no text',
        'hopeful ending illustration: Deborah and Barak praising God, peaceful land, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Deborah heard God — Israel had rest forty years!',
      quizHeading: 'Deborah the Judge Questions',
      questions: [
        {
          question: 'What was Deborah\'s role in Israel?',
          choices: ['Queen only', 'A prophetess who judged Israel', 'A Philistine spy', 'High priest'],
          correctIndex: 1,
          correctFeedback: 'Yes! A prophetess — the people came to her for judgment.',
          wrongFeedback: 'Deborah, a prophetess… judged Israel at that time (Judges 4:4).'
        },
        {
          question: 'Who oppressed Israel then?',
          choices: ['Egypt', 'Jabin king of Canaan and Sisera his captain', 'Assyria', 'Babylon'],
          correctIndex: 1,
          correctFeedback: 'Right! Nine hundred chariots of iron — hard bondage.',
          wrongFeedback: 'Jabin king of Canaan… mightily oppressed the children of Israel (Judges 4:2–3).'
        },
        {
          question: 'What did Barak say to Deborah?',
          choices: ['I go alone', 'If thou wilt go with me, then I will go', 'I refuse', 'Send someone else'],
          correctIndex: 1,
          correctFeedback: 'Yes! He would not go without her.',
          wrongFeedback: 'If thou wilt go with me, then I will go: but if thou wilt not go with me, then I will not go (Judges 4:8).'
        },
        {
          question: 'How did Sisera die?',
          choices: ['In open battle only', 'Jael smote a nail into his temples while he slept', 'He escaped to Egypt', 'He repented publicly'],
          correctIndex: 1,
          correctFeedback: 'Right! God used Jael — Sisera trusted the wrong tent.',
          wrongFeedback: 'She put her hand to the nail… and smote Sisera, she pierced through his temples (Judges 4:21).'
        },
        {
          question: 'What can we learn from Deborah?',
          choices: ['God only uses fear', 'God speaks through faithful leaders — obey His word and He gives victory', 'Never help others', 'Judges never pray'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Deborah heard God and led — the land had rest.',
          wrongFeedback: 'So God subdued on that day Jabin the king of Canaan before the children of Israel (Judges 4:23).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God uses faithful leaders!',
      takeaway: 'Listen for God\'s voice — obey and He can give peace.',
      prayer: 'God, help me obey Thee like Deborah and Barak. Thank Thee for victory in Thee. Amen.'
    },

    dorcasRaise: {
      kjvRef: 'Acts 9:36–43',
      paragraphs: [
        'In Joppa there was a disciple named Tabitha (Dorcas). She was full of good works and almsdeeds which she did.',
        'She made coats and garments for the widows. When she died, they washed her and laid her in an upper chamber.',
        'They sent for Peter. When he came, the widows showed him the coats and garments Dorcas made.',
        'Peter put them all forth, prayed, turned to the body, and said, "Tabitha, arise." She opened her eyes and sat up.',
        'Peter called the saints and widows — many believed on the Lord. God raised her to life!'
      ],
      imagePrompts: [
        'bright cartoon for kids: Dorcas making coats for widows, helping the poor, no text',
        'fun kid illustration: Dorcas dies, widows weeping and showing coats to Peter, no text',
        'colorful Bible scene for children: Peter praying alone with Dorcas, reverent, no text',
        'exciting cartoon: Peter saying Tabitha arise, Dorcas opening eyes and sitting up, no text',
        'hopeful ending illustration: Peter calling saints and widows, many believing, joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Peter raised Dorcas — many believed!',
      quizHeading: 'Dorcas Raised to Life Questions',
      questions: [
        {
          question: 'What was Dorcas full of?',
          choices: ['Evil', 'Good works and almsdeeds', 'Laziness', 'Anger'],
          correctIndex: 1,
          correctFeedback: 'Yes! Full of good works and almsdeeds.',
          wrongFeedback: 'Dorcas was full of good works and almsdeeds which she did (Acts 9:36).'
        },
        {
          question: 'What did Dorcas make for the widows?',
          choices: ['Food', 'Coats and garments', 'Toys', 'Books'],
          correctIndex: 1,
          correctFeedback: 'Right! Coats and garments for the widows.',
          wrongFeedback: 'The widows showed the coats and garments Dorcas made (Acts 9:39).'
        },
        {
          question: 'Who did they send for when Dorcas died?',
          choices: ['Paul', 'Peter', 'John', 'James'],
          correctIndex: 1,
          correctFeedback: 'Yes! They sent for Peter.',
          wrongFeedback: 'They sent for Peter (Acts 9:38).'
        },
        {
          question: 'What did Peter say to Dorcas?',
          choices: ['Sleep', 'Tabitha, arise', 'Go away', 'Be quiet'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Tabitha, arise."',
          wrongFeedback: 'Peter said "Tabitha, arise" — she opened her eyes (Acts 9:40).'
        },
        {
          question: 'What can we learn from Dorcas?',
          choices: ['Do no good works', 'Do good works — God can use them for His glory', 'Never help widows', 'Hide talents'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Do good works — God can raise up and use them.',
          wrongFeedback: 'Dorcas\' good works were remembered — many believed after she was raised!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — do good works!',
      takeaway: 'Do good works — God can use them for His glory.',
      prayer: 'God, help me do good works like Dorcas. Thank You for Your power. Amen.'
    },

    dragonFight: {
      kjvRef: 'Revelation 12:7–12',
      paragraphs: [
        'There was war in heaven: Michael and his angels fought against the dragon; and the dragon fought and his angels, and prevailed not.',
        'Neither was their place found any more in heaven. That great dragon was cast out, that old serpent, called the Devil, and Satan, which deceiveth the whole world: he was cast out into the earth, and his angels were cast out with him.',
        'I heard a loud voice saying in heaven, Now is come salvation, and strength, and the kingdom of our God, and the power of his Christ.',
        'For the accuser of our brethren is cast down, which accused them before our God day and night. They overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death.',
        'Therefore rejoice, ye heavens, and ye that dwell in them. Woe to the earth — yet Christ\'s people have victory in the Lamb.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Michael and good angels, dragon cast down, not horror, no text',
        'fun kid illustration: heaven rejoicing, light breaking, no text',
        'colorful Bible scene for children: saints with Lamb, testimony, courage, no text',
        'exciting cartoon: open scroll or voice from heaven, hope, no text',
        'hopeful ending illustration: children praying, cross light, peace, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'They overcame by the blood of the Lamb!',
      quizHeading: 'Dragon Fight in Heaven Questions',
      questions: [
        {
          question: 'Who fought the dragon?',
          choices: ['John only', 'Michael and his angels', 'The beasts', 'Ten kings'],
          correctIndex: 1,
          correctFeedback: 'Yes! Michael and his angels fought the dragon.',
          wrongFeedback: 'There was war in heaven: Michael and his angels fought against the dragon (Revelation 12:7).'
        },
        {
          question: 'What happened to the dragon?',
          choices: ['He won heaven', 'He was cast out into the earth — no place left in heaven', 'He became an angel again', 'He disappeared'],
          correctIndex: 1,
          correctFeedback: 'Right! Cast out with his angels.',
          wrongFeedback: 'The great dragon was cast out… into the earth (Revelation 12:9).'
        },
        {
          question: 'What is the dragon called?',
          choices: ['A pet', 'That old serpent, the Devil, and Satan', 'Gabriel', 'A lamb'],
          correctIndex: 1,
          correctFeedback: 'Yes! The deceiver of the world.',
          wrongFeedback: 'That old serpent, called the Devil, and Satan (Revelation 12:9).'
        },
        {
          question: 'What did the loud voice in heaven say had come?',
          choices: ['Only fear', 'Salvation, strength, the kingdom of our God, and the power of his Christ', 'Winter', 'Silence'],
          correctIndex: 1,
          correctFeedback: 'Yes! Good news for heaven.',
          wrongFeedback: 'Now is come salvation, and strength, and the kingdom of our God, and the power of his Christ (Revelation 12:10).'
        },
        {
          question: 'How did they overcome him?',
          choices: ['By silver coins', 'By the blood of the Lamb, and by the word of their testimony', 'By hiding only', 'By shouting at people'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Faith in Jesus and bold witness.',
          wrongFeedback: 'They overcame him by the blood of the Lamb, and by the word of their testimony (Revelation 12:11).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — overcome by the Lamb!',
      takeaway: 'Overcome by the Lamb\'s blood and faithful testimony.',
      prayer: 'Lord Jesus, thank Thee for Thy blood. Help me stand true for Thee. Amen.'
    },

    emmausRoad: {
      kjvRef: 'Luke 24:13–35',
      paragraphs: [
        'Two of them went that same day to a village called Emmaus, threescore furlongs from Jerusalem, talking together of all these things.',
        'Jesus himself drew near, but their eyes were holden that they should not know him. He said, What manner of communications are these that ye have one to another, as ye walk, and are sad?',
        'They told how Jesus of Nazareth was crucified — we trusted it had been he which should have redeemed Israel. He said unto them, O fools, and slow of heart to believe all that the prophets have spoken.',
        'Beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself. They constrained him, Abide with us.',
        'At meat he took bread, and blessed it, and brake, and gave unto them. Their eyes were opened, and they knew him — and he vanished. They said, Did not our heart burn within us, while he talked with us by the way, and while he opened to us the scriptures?'
      ],
      imagePrompts: [
        'bright cartoon for kids: dusty road, two walkers, stranger Jesus beside them, warm sunset, no text',
        'fun kid illustration: sad faces explaining crucifixion, Jesus listening, no text',
        'colorful Bible scene for children: Jesus opening scroll teaching, hearts stirred, no text',
        'exciting cartoon: table with broken bread, eyes wide, joy, no text',
        'hopeful ending illustration: two running back to Jerusalem, good news, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Their hearts burned — He opened the scriptures!',
      quizHeading: 'Road to Emmaus Questions',
      questions: [
        {
          question: 'Where were the two disciples going?',
          choices: ['Jerusalem', 'Emmaus', 'Nazareth', 'Damascus'],
          correctIndex: 1,
          correctFeedback: 'Yes! A village called Emmaus.',
          wrongFeedback: 'They went to a village called Emmaus, which was from Jerusalem about threescore furlongs (Luke 24:13).'
        },
        {
          question: 'Why were they sad?',
          choices: ['They lost money', 'Jesus of Nazareth was crucified — they hoped He would redeem Israel', 'They missed supper', 'They feared rain'],
          correctIndex: 1,
          correctFeedback: 'Right! They poured out their grief about the cross.',
          wrongFeedback: 'Concerning Jesus of Nazareth… they crucified him: and we trusted it had been he which should have redeemed Israel (Luke 24:19–21).'
        },
        {
          question: 'What did Jesus call them at first?',
          choices: ['O fools, and slow of heart to believe all that the prophets have spoken', 'O wise men', 'My enemies', 'Strangers only'],
          correctIndex: 0,
          correctFeedback: 'Yes! He urged them to believe all the prophets wrote.',
          wrongFeedback: 'O fools, and slow of heart to believe all that the prophets have spoken (Luke 24:25).'
        },
        {
          question: 'When did they know Him?',
          choices: ['At the start of the road', 'When he took bread, blessed, brake, and gave — then their eyes were opened', 'In the temple only', 'Never'],
          correctIndex: 1,
          correctFeedback: 'Yes! At the breaking of bread.',
          wrongFeedback: 'Their eyes were opened, and they knew him… he vanished… (Luke 24:30–31).'
        },
        {
          question: 'What can we learn?',
          choices: ['Scripture does not matter', 'Jesus opens the scriptures — our hearts burn when we walk with Him', 'Never invite strangers', 'Stay on the road forever'],
          correctIndex: 1,
          correctFeedback: 'Perfect! He made the Bible about Himself clear to them.',
          wrongFeedback: 'Did not our heart burn within us… while he opened to us the scriptures? (Luke 24:32).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — walk with Jesus!',
      takeaway: 'Jesus opens the scriptures — stay close to Him.',
      prayer: 'Lord Jesus, walk with me and open Thy word to my heart. Amen.'
    },

    estherBanquet: {
      kjvRef: 'Esther 5–7',
      paragraphs: [
        'Queen Esther put on her royal apparel, stood in the king\'s inner court, and touched the top of the sceptre when Ahasuerus held it out — she found favour in his sight.',
        'The king asked, What wilt thou, queen Esther? it shall be given thee… unto half of the kingdom. She invited the king and Haman to a banquet that day.',
        'At the feast the king asked again. Esther said, My petition and my request is; if I have found favour… I will do to morrow as the king\'s word.',
        'On the second banquet the king repeated his offer. Esther answered, If I have found favour… let my life be given me at my petition, and my people at my request: for we are sold… to be destroyed… slain…',
        'The king asked, Who is he? Esther said, The adversary and enemy is this wicked Haman. The king arose in wrath — God used Esther\'s courage to save His people.'
      ],
      imagePrompts: [
        'bright cartoon for kids: queen Esther in royal robes, king\'s sceptre, humble courage, no text',
        'fun kid illustration: banquet table, king, queen, Haman, elegant not scary, no text',
        'colorful Bible scene for children: Esther speaking bravely, king listening, no text',
        'exciting cartoon: king standing, justice moment, no gore, no text',
        'hopeful ending illustration: Jewish people safe, thanking God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Esther spoke at the right moment — God saves His people!',
      quizHeading: 'Esther\'s Banquet Questions',
      questions: [
        {
          question: 'Whom did Esther invite to her banquet?',
          choices: ['Only the princes', 'The king and Haman', 'Mordecai only', 'The priests'],
          correctIndex: 1,
          correctFeedback: 'Yes! The king and Haman came to the feast.',
          wrongFeedback: 'Esther answered… let the king and Haman come this day unto the banquet (Esther 5:4).'
        },
        {
          question: 'What did the king offer Esther?',
          choices: ['Nothing', 'Even to half of the kingdom', 'Gold only', 'A new palace'],
          correctIndex: 1,
          correctFeedback: 'Right! He asked what she wished — unto half the kingdom.',
          wrongFeedback: 'What is thy request? even to the half of the kingdom it shall be performed (Esther 5:3).'
        },
        {
          question: 'What did Esther ask for at the second feast?',
          choices: ['More wine', 'Her life and her people — they were sold to be destroyed', 'A crown', 'To leave the palace'],
          correctIndex: 1,
          correctFeedback: 'Yes! She pleaded for herself and her people.',
          wrongFeedback: 'Let my life be given me at my petition, and my people at my request (Esther 7:3–4).'
        },
        {
          question: 'Whom did Esther name as the enemy?',
          choices: ['The king', 'This wicked Haman', 'Mordecai', 'Herself'],
          correctIndex: 1,
          correctFeedback: 'Yes! The adversary and enemy.',
          wrongFeedback: 'The adversary and enemy is this wicked Haman (Esther 7:6).'
        },
        {
          question: 'What can we learn from Esther?',
          choices: ['Stay silent always', 'Courage and timing — God can use you to help others', 'Banquets are wrong', 'Never pray'],
          correctIndex: 1,
          correctFeedback: 'Perfect! She risked speaking — God saved many.',
          wrongFeedback: 'Who knoweth whether thou art come to the kingdom for such a time as this? (Esther 4:14).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — courage for such a time!',
      takeaway: 'Trust God for courage — He can use you to save and bless others.',
      prayer: 'God, give me courage like Esther. Help me speak truth in love. Amen.'
    },

    estherCrown: {
      kjvRef: 'Esther 2:15–18',
      paragraphs: [
        'Esther was brought unto king Ahasuerus into his house royal. She required nothing but what Hegai the king\'s chamberlain appointed — and she obtained favour in the sight of all them that looked upon her.',
        'The king loved Esther above all the women, and she obtained grace and favour in his sight more than all the virgins; so that he set the royal crown upon her head, and made her queen instead of Vashti.',
        'The king made a great feast unto all his princes and his servants, even Esther\'s feast; and he made a release to the provinces, and gave gifts, according to the state of the king.',
        'Esther had not yet shewed her kindred nor her people; as Mordecai had charged her: Mordecai sat in the king\'s gate.',
        'Later Mordecai would ask, Who knoweth whether thou art come to the kingdom for such a time as this? — God had placed Esther where she could help save her people.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Esther before King Ahasuerus, gentle favour, no text',
        'fun kid illustration: royal crown placed on Esther, queen, no text',
        'colorful Bible scene for children: feast for princes, gifts, joy, no text',
        'exciting cartoon: Mordecai at king\'s gate, Esther faithful, no text',
        'hopeful ending illustration: queen in palace, God\'s hand in timing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Esther became queen — God had a purpose ahead!',
      quizHeading: 'Esther Becomes Queen Questions',
      questions: [
        {
          question: 'Who set the royal crown on Esther?',
          choices: ['Mordecai', 'King Ahasuerus', 'Hegai', 'Vashti'],
          correctIndex: 1,
          correctFeedback: 'Yes! The king loved Esther and made her queen.',
          wrongFeedback: 'He set the royal crown upon her head, and made her queen instead of Vashti (Esther 2:17).'
        },
        {
          question: 'What did Esther require for her presentation?',
          choices: ['Many jewels she chose herself', 'Nothing but what Hegai the chamberlain appointed', 'Only what Vashti wore', 'Nothing at all from anyone'],
          correctIndex: 1,
          correctFeedback: 'Right! She trusted the king\'s overseer.',
          wrongFeedback: 'She required nothing but what Hegai the king\'s chamberlain, the keeper of the women, appointed (Esther 2:15).'
        },
        {
          question: 'What did the king do at Esther\'s feast?',
          choices: ['Made a release to the provinces, and gave gifts', 'Took tribute from all', 'Cancelled the feast', 'Sent Esther away'],
          correctIndex: 0,
          correctFeedback: 'Yes! Release and gifts according to the king\'s state.',
          wrongFeedback: 'He made a release to the provinces, and gave gifts, according to the state of the king (Esther 2:18).'
        },
        {
          question: 'Had Esther told who her people were?',
          choices: ['Yes, to everyone', 'Not yet — she had not shewed her kindred nor her people', 'Only to Haman', 'Only to the princes'],
          correctIndex: 1,
          correctFeedback: 'Yes! Mordecai had charged her not to tell.',
          wrongFeedback: 'Esther had not yet shewed her kindred nor her people (Esther 2:20).'
        },
        {
          question: 'What can we learn?',
          choices: ['God has no plan', 'God places people for His purpose — Mordecai later spoke of "such a time as this"', 'Never obey the king', 'Hide from God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Trust God\'s timing for courage ahead.',
          wrongFeedback: 'Who knoweth whether thou art come to the kingdom for such a time as this? (Esther 4:14).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God places us for His purpose!',
      takeaway: 'God places people for His purpose — be faithful where He puts you.',
      prayer: 'God, thank Thee for where Thou hast set me. Use me for Thy glory. Amen.'
    },

    estherFast: {
      kjvRef: 'Esther 4–5',
      paragraphs: [
        'Haman sought to destroy all Jews. Mordecai sent Esther word: Who knoweth whether thou art come to the kingdom for such a time as this?',
        'Esther sent answer: Go, gather together all the Jews… and fast ye for me, and neither eat nor drink three days, night or day: I also and my maidens will fast likewise; and so will I go in unto the king, which is not according to the law: and if I perish, I perish.',
        'On the third day Esther put on her royal apparel, and stood in the inner court… the king held out to Esther the golden sceptre.',
        'The king said, What wilt thou, queen Esther? it shall be given thee to the half of the kingdom. Esther requested the king and Haman come to a banquet she had prepared.',
        'She risked her life to obey God — fasting and courage went together.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Mordecai at gate, message to Esther, solemn, no text',
        'fun kid illustration: Jews fasting, Esther and maidens praying, no text',
        'colorful Bible scene for children: Esther in royal robes, inner court, golden sceptre, no text',
        'exciting cartoon: banquet invitation, king listening, no text',
        'hopeful ending illustration: courage, If I perish I perish, trust, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Esther fasted — then went to the king unbidden!',
      quizHeading: 'Esther Fasts & Goes to the King Questions',
      questions: [
        {
          question: 'What did Mordecai say about Esther\'s place?',
          choices: ['Hide always', 'Who knoweth whether thou art come… for such a time as this?', 'Leave the city', 'Obey Haman'],
          correctIndex: 1,
          correctFeedback: 'Yes! Perhaps she was raised up to help.',
          wrongFeedback: 'Who knoweth whether thou art come to the kingdom for such a time as this? (Esther 4:14).'
        },
        {
          question: 'What did Esther ask the Jews to do?',
          choices: ['Fast for her three days, night or day', 'Fight the palace guard', 'Leave Shushan', 'Pay money only'],
          correctIndex: 0,
          correctFeedback: 'Right! Fast — she and her maidens would too.',
          wrongFeedback: 'Fast ye for me, and neither eat nor drink three days, night or day: I also and my maidens will fast likewise (Esther 4:16).'
        },
        {
          question: 'What did Esther say if the king refused?',
          choices: ['I will not go', 'If I perish, I perish', 'Send Mordecai', 'Wait a year'],
          correctIndex: 1,
          correctFeedback: 'Yes! Brave trust in God.',
          wrongFeedback: 'If I perish, I perish (Esther 4:16).'
        },
        {
          question: 'What did the king do when he saw Esther in the court?',
          choices: ['Ignored her', 'Held out the golden sceptre', 'Called guards', 'Left the room'],
          correctIndex: 1,
          correctFeedback: 'Yes! She touched the top of the sceptre.',
          wrongFeedback: 'The king held out to Esther the golden sceptre… (Esther 5:2).'
        },
        {
          question: 'What can we learn?',
          choices: ['Never fast', 'Pray, fast, and step out in courage — God gives favour', 'Kings never listen', 'Stay silent always'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Seek God first, then obey.',
          wrongFeedback: 'Esther fasted, then found favour — God used her (Esther 4:16; 5:2).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — fast and trust God!',
      takeaway: 'Fast and pray — then obey God with courage.',
      prayer: 'God, give me courage like Esther. Help me seek Thee first. Amen.'
    },

    euniceMother: {
      kjvRef: '2 Timothy 1:5–7; 3:15',
      paragraphs: [
        'Paul wrote, When I call to remembrance the unfeigned faith that is in thee, which dwelt first in thy grandmother Lois, and thy mother Eunice; and I am persuaded that in thee also.',
        'Eunice and Lois taught Timothy sincere faith before Paul ever laid hands on him.',
        'From a child thou hast known the holy scriptures, which are able to make thee wise unto salvation through faith which is in Christ Jesus.',
        'Paul charged, Stir up the gift of God, which is in thee… For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
        'Mothers and grandmothers who love God pass down His Word — it can live in children from the start.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Eunice and Lois with young Timothy, scroll or kindness, no text',
        'fun kid illustration: child learning scriptures at home, warmth, no text',
        'colorful Bible scene for children: Paul writing, remembering their faith, no text',
        'exciting cartoon: Timothy serving, confident not fearful, no text',
        'hopeful ending illustration: faith handed down generations, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Unfeigned faith — from Lois and Eunice to Timothy!',
      quizHeading: 'Eunice: Faithful Mother Questions',
      questions: [
        {
          question: 'Who was Timothy\'s mother?',
          choices: ['Lois', 'Eunice', 'Priscilla', 'Mary'],
          correctIndex: 1,
          correctFeedback: 'Yes! Eunice — Lois was his grandmother.',
          wrongFeedback: 'Faith… dwelt first in thy grandmother Lois, and thy mother Eunice (2 Timothy 1:5).'
        },
        {
          question: 'What kind of faith did they have?',
          choices: ['Feigned', 'Unfeigned — sincere', 'Cold', 'Secret only'],
          correctIndex: 1,
          correctFeedback: 'Right! Real faith, not pretend.',
          wrongFeedback: 'The unfeigned faith that is in thee, which dwelt first in… Lois, and… Eunice (2 Timothy 1:5).'
        },
        {
          question: 'What had Timothy known from a child?',
          choices: ['Only games', 'The holy scriptures', 'Greek myths', 'Fighting'],
          correctIndex: 1,
          correctFeedback: 'Yes! The holy scriptures.',
          wrongFeedback: 'From a child thou hast known the holy scriptures (2 Timothy 3:15).'
        },
        {
          question: 'What did Paul tell Timothy to stir up?',
          choices: ['Fear', 'The gift of God — God gave spirit of power, love, sound mind', 'Anger', 'Money'],
          correctIndex: 1,
          correctFeedback: 'Yes! Stir up the gift… not fear.',
          wrongFeedback: 'Stir up the gift of God… God hath not given us the spirit of fear; but of power, and of love, and of a sound mind (2 Timothy 1:6–7).'
        },
        {
          question: 'What can we learn from Eunice?',
          choices: ['Do not teach children', 'Faithful parents pass God\'s Word to children', 'Scripture is only for adults', 'Hide belief'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Teach the Bible early with love.',
          wrongFeedback: 'Timothy\'s faith began at home with Lois and Eunice (2 Timothy 1:5).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — faithful mothers teach!',
      takeaway: 'Pass down sincere faith and Scripture — God blesses it.',
      prayer: 'Lord, help me teach Thy word faithfully like Eunice. Amen.'
    },

    everyKneeBow: {
      kjvRef: 'Philippians 2:8–11',
      paragraphs: [
        'Christ Jesus humbled himself, and became obedient unto death, even the death of the cross.',
        'Wherefore God also hath highly exalted him, and given him a name which is above every name.',
        'That at the name of Jesus every knee should bow, of things in heaven, and things in earth, and things under the earth.',
        'And that every tongue should confess that Jesus Christ is Lord, to the glory of God the Father.',
        'Bow your heart to Him gladly now — one day every knee will bow and every tongue confess.'
      ],
      imagePrompts: [
        'bright cartoon for kids: exalted Jesus, gentle light, name above all, no text',
        'fun kid illustration: knees bowing in heaven and earth, humble worship, no text',
        'colorful Bible scene for children: tongues confessing Jesus is Lord, joy, no text',
        'exciting cartoon: cross then crown, humble then exalted, no text',
        'hopeful ending illustration: glory to God the Father, peace, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus humbled — then God exalted Him!',
      quizHeading: 'Every Knee Shall Bow Questions',
      questions: [
        {
          question: 'What did God give Jesus after His obedience?',
          choices: ['A low place', 'A name which is above every name', 'Silver only', 'No honour'],
          correctIndex: 1,
          correctFeedback: 'Yes! Highly exalted.',
          wrongFeedback: 'Given him a name which is above every name (Philippians 2:9).'
        },
        {
          question: 'What will every knee do at Jesus\' name?',
          choices: ['Ignore Him', 'Bow', 'Run', 'Hide'],
          correctIndex: 1,
          correctFeedback: 'Yes! Every knee should bow.',
          wrongFeedback: 'At the name of Jesus every knee should bow… in heaven, and… in earth, and… under the earth (Philippians 2:10).'
        },
        {
          question: 'What will every tongue confess?',
          choices: ['Jesus is not Lord', 'That Jesus Christ is Lord, to the glory of God the Father', 'We are lords', 'Nothing'],
          correctIndex: 1,
          correctFeedback: 'Right! Confess Jesus Christ is Lord.',
          wrongFeedback: 'Every tongue should confess that Jesus Christ is Lord, to the glory of God the Father (Philippians 2:11).'
        },
        {
          question: 'Why did God exalt Him?',
          choices: ['He was proud', 'He humbled himself — obedient unto death, even the death of the cross', 'He was rich', 'He refused the cross'],
          correctIndex: 1,
          correctFeedback: 'Yes! The path was humility first.',
          wrongFeedback: 'He humbled himself… obedient unto death, even the death of the cross (Philippians 2:8).'
        },
        {
          question: 'What can we learn?',
          choices: ['Jesus is not Lord', 'Jesus is Lord — honour Him with our lives today', 'Never confess Christ', 'Pride pleases God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Bow your heart to Jesus now.',
          wrongFeedback: 'Every tongue shall confess… Jesus Christ is Lord (Philippians 2:11).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is Lord!',
      takeaway: 'Jesus Christ is Lord — every knee will bow and every tongue confess.',
      prayer: 'Lord Jesus, Thou art Lord. I bow to Thee and thank Thee for saving me. Amen.'
    },

    faithMountain: {
      kjvRef: 'Matthew 17:20; Mark 11:23–24',
      paragraphs: [
        'Jesus said to His disciples, "If ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove hence to yonder place; and it shall remove."',
        'Nothing shall be impossible unto you. Faith as small as a mustard seed can move mountains.',
        'Jesus taught that with faith we can say to a mountain, "Be thou removed, and be thou cast into the sea," and it shall be done.',
        'But we must believe and not doubt in our hearts. Whatever we ask in prayer, believing, we shall receive.',
        'Faith moves mountains — trust God for the impossible.'
      ],
      imagePrompts: [
        'bright cartoon for kids: tiny mustard seed in hand, Jesus teaching, no text',
        'fun kid illustration: disciple saying to mountain Remove hence, mountain moving, gentle not magic show, no text',
        'colorful Bible scene for children: faith as mustard seed, nothing impossible, no text',
        'exciting cartoon: mountain cast into sea by faith, no doubt, no text',
        'happy ending illustration: praying with belief, receiving from God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Faith as a mustard seed can move mountains!',
      quizHeading: 'Faith That Moves Mountains Questions',
      questions: [
        {
          question: 'What size faith did Jesus say can move mountains?',
          choices: ['Huge faith', 'Faith as a grain of mustard seed', 'No faith', 'Giant faith'],
          correctIndex: 1,
          correctFeedback: 'Yes! Faith as a grain of mustard seed.',
          wrongFeedback: 'Jesus said "If ye have faith as a grain of mustard seed… nothing shall be impossible" (Matthew 17:20).'
        },
        {
          question: 'What can faith as a mustard seed do?',
          choices: ['Nothing', 'Move mountains', 'Only help small things', 'Make people laugh'],
          correctIndex: 1,
          correctFeedback: 'Right! Move mountains — nothing impossible.',
          wrongFeedback: 'Jesus said "Ye shall say unto this mountain, Remove hence… and it shall remove" (Matthew 17:20).'
        },
        {
          question: 'What did Jesus say about doubt?',
          choices: ['Doubt is good', 'Believe and not doubt in your heart', 'Doubt everything', 'Never pray'],
          correctIndex: 1,
          correctFeedback: 'Yes! Believe and not doubt — it shall be done.',
          wrongFeedback: 'Jesus said "Whosoever shall say unto this mountain, Be thou removed… and shall not doubt in his heart" (Mark 11:23).'
        },
        {
          question: 'What happens when we ask in prayer believing?',
          choices: ['Nothing', 'We shall receive', 'God says no', 'We wait forever'],
          correctIndex: 1,
          correctFeedback: 'Yes! "What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them."',
          wrongFeedback: 'Jesus said "What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them" (Mark 11:24).'
        },
        {
          question: 'What can we learn from faith moving mountains?',
          choices: ['Faith is weak', 'Faith as small as a mustard seed can do the impossible', 'Never ask God', 'Doubt God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Faith as a mustard seed moves mountains — trust God.',
          wrongFeedback: 'Jesus taught faith can move mountains — believe and pray!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — faith moves mountains!',
      takeaway: 'Faith as a mustard seed can move mountains — believe and pray.',
      prayer: 'God, grow my faith like a mustard seed. Help me move mountains. Amen.'
    },

    forgive70x7: {
      kjvRef: 'Matthew 18:21–35',
      paragraphs: [
        'Peter asked Jesus, "Lord, how oft shall my brother sin against me, and I forgive him? till seven times?"',
        'Jesus said, "I say not unto thee, Until seven times: but, Until seventy times seven."',
        'Jesus told a parable: a king forgave a servant who owed ten thousand talents. But that servant would not forgive a fellow servant who owed a hundred pence.',
        'The king was angry and delivered the unforgiving servant to the tormentors. Jesus said, "So likewise shall my heavenly Father do also unto you, if ye from your hearts forgive not every one his brother their trespasses."',
        'Forgive others as God forgives us — from the heart.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Peter asking Jesus how oft shall I forgive, no text',
        'fun kid illustration: Jesus saying seventy times seven, no text',
        'colorful Bible scene for children: king forgiving servant ten thousand talents, no text',
        'exciting cartoon: unforgiving servant took fellow by the throat for hundred pence, no text',
        'hopeful ending illustration: Jesus teaching forgive from heart, peace, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Forgive seventy times seven — from the heart!',
      quizHeading: 'Forgive Seventy Times Seven Questions',
      questions: [
        {
          question: 'How many times did Peter ask if he should forgive?',
          choices: ['Seven times', 'Ten times', 'Fifty times', 'Once'],
          correctIndex: 0,
          correctFeedback: 'Yes! Peter asked "till seven times?"',
          wrongFeedback: 'Peter asked "Lord, how oft shall my brother sin against me, and I forgive him? till seven times?" (Matthew 18:21).'
        },
        {
          question: 'What did Jesus answer?',
          choices: ['Seven times', 'Until seventy times seven', 'Never forgive', 'Only once'],
          correctIndex: 1,
          correctFeedback: 'Right! "Until seventy times seven."',
          wrongFeedback: 'Jesus said "I say not unto thee, Until seven times: but, Until seventy times seven" (Matthew 18:22).'
        },
        {
          question: 'What did the king do in the parable?',
          choices: ['Punished the servant', 'Forgave ten thousand talents', 'Took more money', 'Ignored the debt'],
          correctIndex: 1,
          correctFeedback: 'Yes! Forgave the servant ten thousand talents.',
          wrongFeedback: 'The king had compassion and forgave the debt (Matthew 18:27).'
        },
        {
          question: 'What did the forgiven servant do?',
          choices: ['Forgave others', 'Took a fellow servant by the throat for a hundred pence', 'Gave money away', 'Helped others'],
          correctIndex: 1,
          correctFeedback: 'Yes! Would not forgive a small debt.',
          wrongFeedback: 'He took a fellow servant by the throat for a hundred pence (Matthew 18:28).'
        },
        {
          question: 'What can we learn from forgive seventy times seven?',
          choices: ['Forgive only seven times', 'Forgive from the heart — as God forgives us', 'Never forgive', 'Keep count'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Forgive from the heart — God forgives us.',
          wrongFeedback: 'Jesus taught "If ye from your hearts forgive not every one his brother their trespasses" (Matthew 18:35).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — forgive from the heart!',
      takeaway: 'Forgive from the heart — as God forgives us.',
      prayer: 'God, thank You for forgiving me. Help me forgive others from the heart. Amen.'
    },

    goliathChallenge: {
      kjvRef: '1 Samuel 17:8–11, 16, 23–30',
      paragraphs: [
        'Goliath the Philistine champion stood and cried to the armies of Israel: "Choose you a man for you, and let him come down to me."',
        'He said, "If he be able to fight with me, and to kill me, then will we be your servants: but if I prevail against him… ye shall be our servants."',
        'Goliath defied the armies of the living God for forty days, morning and evening. Israel was dismayed and greatly afraid.',
        'David heard Goliath\'s words and asked, "Who is this uncircumcised Philistine, that he should defy the armies of the living God?"',
        'David\'s brother Eliab was angry with him, but David said, "What have I now done?" He continued asking about the reward for killing Goliath.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Goliath the giant champion shouting challenge to Israel, no text',
        'fun kid illustration: Goliath saying choose you a man I will fight him, no text',
        'colorful Bible scene for children: Israel afraid for forty days, Goliath defying God, no text',
        'exciting cartoon: David hearing Goliath, asking who is this that he should defy, no text',
        'hopeful ending illustration: David questioning reward for killing Goliath, faith rising, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Goliath defied Israel — David asked who would fight!',
      quizHeading: 'Goliath\'s Challenge Questions',
      questions: [
        {
          question: 'What did Goliath say to the armies of Israel?',
          choices: ['Come help me', 'Choose you a man… let him come down to me', 'Run away', 'Be my servants'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Choose you a man for you, and let him come down to me."',
          wrongFeedback: 'Goliath said "Choose you a man… if he kill me, then will we be your servants" (1 Samuel 17:8).'
        },
        {
          question: 'What would happen if Goliath won?',
          choices: ['Israel free', 'Israel his servants', 'Peace forever', 'No change'],
          correctIndex: 1,
          correctFeedback: 'Right! "Ye shall be our servants, and serve us."',
          wrongFeedback: 'If Goliath prevailed, Israel would serve Philistines (1 Samuel 17:9).'
        },
        {
          question: 'How long did Goliath defy Israel?',
          choices: ['One day', 'Forty days, morning and evening', 'A week', 'A year'],
          correctIndex: 1,
          correctFeedback: 'Yes! Forty days, morning and evening.',
          wrongFeedback: 'Goliath defied the armies for forty days (1 Samuel 17:16).'
        },
        {
          question: 'What did David ask when he heard Goliath?',
          choices: ['Who is this uncircumcised Philistine?', 'Let me run away', 'Give me money', 'Be quiet'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Who is this uncircumcised Philistine, that he should defy the armies of the living God?"',
          wrongFeedback: 'David asked "Who is this uncircumcised Philistine, that he should defy the armies of the living God?" (1 Samuel 17:26).'
        },
        {
          question: 'What can we learn from Goliath\'s challenge?',
          choices: ['Fear giants', 'Trust God against giants', 'Never ask questions', 'Defy God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Trust God — David questioned the defiance of the living God.',
          wrongFeedback: 'David asked who would fight the one defying the living God — faith rises!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — trust God against giants!',
      takeaway: 'Trust God against giants — question defiance of the living God.',
      prayer: 'God, thank You for power over giants. Help me trust You. Amen.'
    },

    gardenPrayer: {
      kjvRef: 'Matthew 26:36–46; Luke 22:44',
      paragraphs: [
        'Jesus went to Gethsemane with His disciples. He said, "My soul is exceeding sorrowful, even unto death: tarry ye here, and watch with me."',
        'Jesus prayed, "O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt."',
        'He found the disciples sleeping. He said to Peter, "What, could ye not watch with me one hour?"',
        'He prayed again, saying the same words. Luke records that in agony His sweat was as it were great drops of blood falling down to the ground.',
        'Jesus said, "Rise, let us be going: behold, he is at hand that doth betray me." The hour had come.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus going to Gethsemane with disciples, sorrowful face, no text',
        'fun kid illustration: Jesus praying let this cup pass thy will be done, no text',
        'colorful Bible scene for children: disciples sleeping, Jesus returning, no text',
        'exciting cartoon: Jesus praying again, sweat as drops of blood, gentle no gore, no text',
        'hopeful ending illustration: Jesus saying Rise let us be going, hour come, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus prayed in Gethsemane — "thy will be done"!',
      quizHeading: 'Garden Prayer Questions',
      questions: [
        {
          question: 'Where did Jesus go with His disciples?',
          choices: ['Jerusalem', 'Gethsemane', 'Bethlehem', 'Galilee'],
          correctIndex: 1,
          correctFeedback: 'Yes! To Gethsemane.',
          wrongFeedback: 'Jesus went with them to a place called Gethsemane (Matthew 26:36).'
        },
        {
          question: 'What did Jesus say His soul was?',
          choices: ['Happy', 'Exceeding sorrowful, even unto death', 'Angry', 'Tired'],
          correctIndex: 1,
          correctFeedback: 'Yes! "My soul is exceeding sorrowful, even unto death."',
          wrongFeedback: 'Jesus said "My soul is exceeding sorrowful, even unto death" (Matthew 26:38).'
        },
        {
          question: 'What did Jesus pray?',
          choices: ['Let this cup pass… nevertheless not as I will, but as thou wilt', 'Give me power', 'Take me away', 'I am ready'],
          correctIndex: 0,
          correctFeedback: 'Yes! "O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt."',
          wrongFeedback: 'Jesus prayed "let this cup pass… not as I will, but as thou wilt" (Matthew 26:39).'
        },
        {
          question: 'What did Jesus find the disciples doing?',
          choices: ['Praying', 'Sleeping', 'Watching', 'Singing'],
          correctIndex: 1,
          correctFeedback: 'Yes! Sleeping — Jesus said "Could ye not watch with me one hour?"',
          wrongFeedback: 'He found them sleeping (Matthew 26:40).'
        },
        {
          question: 'What can we learn from the garden prayer?',
          choices: ['Pray only when easy', 'Pray "thy will be done" even in sorrow', 'Never pray alone', 'Give up in agony'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Pray "thy will be done" even when hard.',
          wrongFeedback: 'Jesus submitted to God\'s will in agony — we can too!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — pray "thy will be done"!',
      takeaway: 'Pray "thy will be done" — even in sorrow.',
      prayer: 'God, Your will be done in my life. Help me pray like Jesus. Amen.'
    },

    pentecostFire: {
      kjvRef: 'Acts 2:1–4',
      paragraphs: [
        'When the day of Pentecost was fully come, the disciples were all with one accord in one place.',
        'Suddenly there came a sound from heaven as of a rushing mighty wind, and it filled all the house where they were sitting.',
        'There appeared unto them cloven tongues like as of fire, and it sat upon each of them.',
        'They were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance.',
        'The Holy Ghost came with power — wind and fire — filling the disciples.'
      ],
      imagePrompts: [
        'bright cartoon for kids: disciples together in one place, waiting, no text',
        'fun kid illustration: rushing mighty wind filling the house, no text',
        'colorful Bible scene for children: cloven tongues like fire sitting on each disciple, no text',
        'exciting cartoon: disciples filled with Holy Ghost, speaking with other tongues, no text',
        'hopeful ending illustration: Holy Ghost power — wind and fire on disciples, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The Holy Ghost came with wind and fire!',
      quizHeading: 'Pentecost Fire Questions',
      questions: [
        {
          question: 'Where were the disciples when Pentecost came?',
          choices: ['Scattered', 'All with one accord in one place', 'In the temple', 'On a mountain'],
          correctIndex: 1,
          correctFeedback: 'Yes! All with one accord in one place.',
          wrongFeedback: 'They were all with one accord in one place (Acts 2:1).'
        },
        {
          question: 'What sound came from heaven?',
          choices: ['Music', 'A rushing mighty wind', 'Thunder', 'Silence'],
          correctIndex: 1,
          correctFeedback: 'Right! A rushing mighty wind filled the house.',
          wrongFeedback: 'Suddenly a sound from heaven as of a rushing mighty wind (Acts 2:2).'
        },
        {
          question: 'What appeared on each disciple?',
          choices: ['Crowns', 'Cloven tongues like as of fire', 'Wings', 'Light bulbs'],
          correctIndex: 1,
          correctFeedback: 'Yes! Cloven tongues like as of fire.',
          wrongFeedback: 'There appeared cloven tongues like as of fire on each of them (Acts 2:3).'
        },
        {
          question: 'What happened when they were filled with the Holy Ghost?',
          choices: ['They slept', 'They spoke with other tongues', 'They ran away', 'They hid'],
          correctIndex: 1,
          correctFeedback: 'Yes! Began to speak with other tongues.',
          wrongFeedback: 'They were filled with the Holy Ghost, and began to speak with other tongues (Acts 2:4).'
        },
        {
          question: 'What can we learn from Pentecost fire?',
          choices: ['Holy Ghost is weak', 'The Holy Ghost comes with power', 'Never wait', 'Forget Jesus'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The Holy Ghost came with power — wind and fire.',
          wrongFeedback: 'Pentecost shows the Holy Ghost filling believers with power!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Holy Ghost power!',
      takeaway: 'The Holy Ghost comes with power — wind and fire.',
      prayer: 'God, fill me with Thy Holy Ghost. Thank Thee for Thy power. Amen.'
    },

    pentecostTongues: {
      kjvRef: 'Acts 2:4–21',
      paragraphs: [
        'The disciples spoke with other tongues as the Spirit gave them utterance. Devout men from every nation under heaven heard them speak in their own language.',
        'They were all amazed and marvelled: "How hear we every man in our own tongue?"',
        'Some said "These men are full of new wine." Others asked "What meaneth this?"',
        'Peter stood up with the eleven and said, "These are not drunken… this is that which was spoken by the prophet Joel."',
        'God poured out His Spirit on all flesh — sons and daughters prophesy, young men see visions, old men dream dreams, as Joel foretold.'
      ],
      imagePrompts: [
        'bright cartoon for kids: disciples speaking in tongues, crowd from many nations hearing own language, no text',
        'fun kid illustration: people amazed, how hear we every man in our own tongue, no text',
        'colorful Bible scene for children: some saying full of new wine, others asking what meaneth this, no text',
        'exciting cartoon: Peter standing with the eleven, explaining Pentecost, no text',
        'hopeful ending illustration: God pouring Spirit on all flesh, prophesy, visions, dreams, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Disciples spoke in tongues — crowd heard in their own languages!',
      quizHeading: 'Pentecost Tongues Questions',
      questions: [
        {
          question: 'What did the disciples do when filled with the Spirit?',
          choices: ['Slept', 'Spoke with other tongues', 'Ran away', 'Hid'],
          correctIndex: 1,
          correctFeedback: 'Yes! Spoke with other tongues as the Spirit gave utterance.',
          wrongFeedback: 'They spoke with other tongues as the Spirit gave them utterance (Acts 2:4).'
        },
        {
          question: 'Who heard them speak in their own language?',
          choices: ['Only Jews', 'Devout men from every nation', 'Only Romans', 'Only Greeks'],
          correctIndex: 1,
          correctFeedback: 'Right! Devout men from every nation under heaven.',
          wrongFeedback: 'Devout men from every nation under heaven heard them speak in their own language (Acts 2:5–6).'
        },
        {
          question: 'What did some people say about the disciples?',
          choices: ['They are full of new wine', 'They are wise', 'They are quiet', 'They are angry'],
          correctIndex: 0,
          correctFeedback: 'Yes! "These men are full of new wine."',
          wrongFeedback: 'Others mocking said "These men are full of new wine" (Acts 2:13).'
        },
        {
          question: 'What did Peter explain?',
          choices: ['They are drunk', 'This is that which was spoken by Joel', 'They are sleeping', 'They are lost'],
          correctIndex: 1,
          correctFeedback: 'Yes! "This is that which was spoken by the prophet Joel."',
          wrongFeedback: 'Peter said "This is that which was spoken by the prophet Joel" (Acts 2:16).'
        },
        {
          question: 'What can we learn from Pentecost tongues?',
          choices: ['Holy Ghost is silent', 'Holy Ghost empowers us to speak truth to all nations', 'Never speak', 'Hide faith'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Holy Ghost empowers to speak truth to all nations.',
          wrongFeedback: 'The Spirit enabled them to speak in other tongues — people heard the gospel in their own language!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Holy Ghost empowers!',
      takeaway: 'Holy Ghost empowers us to speak truth to all nations.',
      prayer: 'God, fill me with Thy Spirit. Help me speak Thy truth. Amen.'
    },

    stephen: {
      kjvRef: 'Acts 6:8–7:60',
      paragraphs: [
        'Stephen was full of faith and power. He did great wonders and miracles among the people.',
        'Some disputed with Stephen, but they could not resist the wisdom and the spirit by which he spake.',
        'False witnesses accused him of blasphemy. Stephen spoke boldly before the council about God’s dealings with Israel.',
        'Stephen said, "Behold, I see the heavens opened, and the Son of man standing on the right hand of God."',
        'They stoned Stephen. He cried, "Lord Jesus, receive my spirit." He prayed, "Lord, lay not this sin to their charge." Stephen fell asleep.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Stephen doing great wonders and miracles, people amazed, no text',
        'fun kid illustration: Stephen speaking with wisdom, opponents unable to resist, no text',
        'colorful Bible scene for children: Stephen before council, false witnesses accusing, no text',
        'exciting cartoon: Stephen seeing heavens opened, Jesus standing at God’s right hand, no text',
        'hopeful ending illustration: Stephen stoned, praying for forgiveness, peaceful courage, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Stephen saw heaven open — faithful unto death!',
      quizHeading: 'Stephen Questions',
      questions: [
        {
          question: 'What was Stephen full of?',
          choices: ['Fear', 'Faith and power', 'Anger', 'Money'],
          correctIndex: 1,
          correctFeedback: 'Yes! Full of faith and power — did great wonders.',
          wrongFeedback: 'Stephen was full of faith and power (Acts 6:8).'
        },
        {
          question: 'Who accused Stephen?',
          choices: ['His friends', 'False witnesses', 'The apostles', 'The king'],
          correctIndex: 1,
          correctFeedback: 'Right! False witnesses accused him of blasphemy.',
          wrongFeedback: 'False witnesses said he spoke blasphemous words (Acts 6:11–14).'
        },
        {
          question: 'What did Stephen see?',
          choices: ['Nothing', 'Heavens opened, Son of man standing at God’s right hand', 'A throne only', 'Angels only'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Behold, I see the heavens opened, and the Son of man standing on the right hand of God."',
          wrongFeedback: 'Stephen said "Behold, I see the heavens opened…" (Acts 7:56).'
        },
        {
          question: 'What did Stephen pray while being stoned?',
          choices: ['Punish them', 'Lord, lay not this sin to their charge', 'Save me', 'I hate them'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Lord, lay not this sin to their charge."',
          wrongFeedback: 'Stephen prayed "Lord, lay not this sin to their charge" (Acts 7:60).'
        },
        {
          question: 'What can we learn from Stephen?',
          choices: ['Never speak boldly', 'Stand firm and forgive — like Stephen', 'Run from trouble', 'Be quiet always'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Stand firm and forgive — Stephen trusted Jesus to the end.',
          wrongFeedback: 'Stephen stood boldly and forgave his killers — a true witness!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — stand firm and forgive!',
      takeaway: 'Stand firm for Jesus and forgive — Stephen showed the way.',
      prayer: 'Jesus, help me stand firm and forgive like Stephen. Amen.'
    },

    paulDamascus: {
      kjvRef: 'Acts 9:1–19',
      paragraphs: [
        'Saul breathed out threatenings and slaughter against the disciples. He asked letters to Damascus to bring believers bound.',
        'As he journeyed, a light from heaven shone round about him. He fell to the earth and heard a voice: "Saul, Saul, why persecutest thou me?"',
        'Saul said, "Who art thou, Lord?" The Lord said, "I am Jesus whom thou persecutest." Saul was blind three days.',
        'God told Ananias in a vision to go to Saul. Ananias laid hands on him: "Brother Saul, the Lord… hath sent me, that thou mightest receive thy sight, and be filled with the Holy Ghost."',
        'Scales fell from Saul’s eyes. He arose, was baptized, and preached Christ in the synagogues.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Saul riding to Damascus with letters, breathing threatenings, no text',
        'fun kid illustration: light from heaven, Saul falling, Jesus speaking Saul Saul, no text',
        'colorful Bible scene for children: Saul blind three days, praying, no text',
        'exciting cartoon: Ananias laying hands on Saul, scales falling, sight restored, no text',
        'hopeful ending illustration: Saul baptized, preaching Christ, transformed, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Saul persecuted — Jesus met him on the road!',
      quizHeading: 'Paul on Damascus Road Questions',
      questions: [
        {
          question: 'What did Saul do against the disciples?',
          choices: ['Helped them', 'Breathed threatenings and slaughter', 'Taught them', 'Prayed with them'],
          correctIndex: 1,
          correctFeedback: 'Yes! Saul breathed out threatenings and slaughter.',
          wrongFeedback: 'Saul breathed out threatenings and slaughter against the disciples (Acts 9:1).'
        },
        {
          question: 'What happened as Saul journeyed?',
          choices: ['Nothing', 'Light from heaven shone, he fell, heard Jesus', 'He found treasure', 'He met friends'],
          correctIndex: 1,
          correctFeedback: 'Right! Light shone, he fell, heard "Saul, Saul, why persecutest thou me?"',
          wrongFeedback: 'A light from heaven shone, he fell, and heard Jesus (Acts 9:3–4).'
        },
        {
          question: 'What did Jesus say to Saul?',
          choices: ['You are great', 'Saul, Saul, why persecutest thou me?', 'Go home', 'Be quiet'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Saul, Saul, why persecutest thou me?"',
          wrongFeedback: 'Jesus said "Saul, Saul, why persecutest thou me?" (Acts 9:4).'
        },
        {
          question: 'Who did God send to heal Saul?',
          choices: ['Peter', 'Ananias', 'Barnabas', 'John'],
          correctIndex: 1,
          correctFeedback: 'Yes! Ananias laid hands — scales fell, sight restored, filled with Holy Ghost.',
          wrongFeedback: 'God told Ananias to go to Saul (Acts 9:10–18).'
        },
        {
          question: 'What can we learn from Paul on Damascus road?',
          choices: ['Jesus can’t change people', 'Jesus changes hearts — persecutor to preacher', 'Never change', 'Persecute others'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus changes hearts — Saul became Paul.',
          wrongFeedback: 'Saul persecuted — Jesus met him and transformed him into a preacher!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus changes hearts!',
      takeaway: 'Jesus changes hearts — from persecutor to preacher.',
      prayer: 'Jesus, thank You for changing lives. Change my heart too. Amen.'
    },

    philipChariot: {
      kjvRef: 'Acts 8:26–40',
      paragraphs: [
        'An angel of the Lord spoke to Philip: "Arise, and go toward the south unto the way that goeth down from Jerusalem unto Gaza." Philip obeyed.',
        'An Ethiopian eunuch sat in his chariot reading Isaiah. Philip asked, "Understandest thou what thou readest?"',
        'The eunuch said, "How can I, except some man should guide me?" Philip preached Jesus from the scripture.',
        'They came to water. The eunuch said, "See, here is water; what doth hinder me to be baptized?"',
        'Philip baptized him. The eunuch went on his way rejoicing. The Spirit caught Philip away.'
      ],
      imagePrompts: [
        'bright cartoon for kids: angel telling Philip to go south to Gaza road, no text',
        'fun kid illustration: Philip meeting Ethiopian in chariot reading Isaiah, no text',
        'colorful Bible scene for children: Philip preaching Jesus from the scripture, no text',
        'exciting cartoon: eunuch asking what doth hinder me to be baptized, water nearby, no text',
        'hopeful ending illustration: Philip baptizing eunuch, man rejoicing, Spirit taking Philip away, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Philip obeyed — baptized the Ethiopian!',
      quizHeading: 'Philip & Ethiopian Chariot Questions',
      questions: [
        {
          question: 'What did the angel tell Philip?',
          choices: ['Stay home', 'Go south to the way to Gaza', 'Go north', 'Hide'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Arise, and go toward the south unto the way… to Gaza."',
          wrongFeedback: 'Angel said "Arise, and go toward the south unto the way that goeth down from Jerusalem unto Gaza" (Acts 8:26).'
        },
        {
          question: 'What was the Ethiopian reading?',
          choices: ['A letter', 'Isaiah the prophet', 'A map', 'A song'],
          correctIndex: 1,
          correctFeedback: 'Right! Reading Isaiah the prophet.',
          wrongFeedback: 'The eunuch was reading Isaiah the prophet (Acts 8:28).'
        },
        {
          question: 'What did Philip ask the Ethiopian?',
          choices: ['Understandest thou what thou readest?', 'Where are you going?', 'Give me money', 'Stop reading'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Understandest thou what thou readest?"',
          wrongFeedback: 'Philip asked "Understandest thou what thou readest?" (Acts 8:30).'
        },
        {
          question: 'What did the eunuch say?',
          choices: ['Yes I do', 'How can I, except some man should guide me?', 'I don’t care', 'Leave me alone'],
          correctIndex: 1,
          correctFeedback: 'Right! "How can I, except some man should guide me?"',
          wrongFeedback: 'The eunuch said "How can I, except some man should guide me?" (Acts 8:31).'
        },
        {
          question: 'What can we learn from Philip & the Ethiopian?',
          choices: ['Never explain Scripture', 'Obey God and share Jesus with anyone', 'Stay home', 'Ignore strangers'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Obey God and share the gospel with anyone.',
          wrongFeedback: 'Philip obeyed the angel and explained Jesus — the eunuch believed and was baptized!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — share Jesus!',
      takeaway: 'Obey God and share Jesus with anyone — He reaches everyone.',
      prayer: 'God, help me obey Thy Spirit and share Jesus with people I meet. Amen.'
    },

    peterShadow: {
      kjvRef: 'Acts 5:12–16',
      paragraphs: [
        'Peter and the apostles wrought many signs and wonders among the people. They were all with one accord in Solomon\'s porch.',
        'People brought the sick into the streets and laid them on beds and couches, that at the least the shadow of Peter passing by might overshadow some of them.',
        'Multitudes from cities round about brought the sick and them that were vexed with unclean spirits — they were healed every one.',
        'The people magnified them. The high priest and Sadducees were filled with indignation.',
        'God healed through Peter — great signs and wonders in the early church; the power was God\'s, not magic.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Peter and apostles doing signs and wonders, people in streets, no text',
        'fun kid illustration: sick people laid on beds so Peter\'s shadow might pass over them, no text',
        'colorful Bible scene for children: multitudes from cities bringing sick and possessed, all healed, no text',
        'exciting cartoon: people magnifying apostles, high priest indignant, no text',
        'hopeful ending illustration: God healing through Peter, early church growing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Peter\'s shadow — God\'s power healed!',
      quizHeading: 'Peter\'s Shadow Heals Questions',
      questions: [
        {
          question: 'Where did Peter and the apostles meet?',
          choices: ['In a house', 'In Solomon\'s porch', 'In the temple only', 'On a mountain'],
          correctIndex: 1,
          correctFeedback: 'Yes! In Solomon\'s porch.',
          wrongFeedback: 'They were with one accord in Solomon\'s porch (Acts 5:12).'
        },
        {
          question: 'What did people do with the sick?',
          choices: ['Hid them', 'Laid them on beds so Peter\'s shadow might overshadow them', 'Took them home', 'Ignored them'],
          correctIndex: 1,
          correctFeedback: 'Right! Laid them on beds and couches so Peter\'s shadow might pass by.',
          wrongFeedback: 'They laid the sick in the streets… that the shadow of Peter passing by might overshadow some (Acts 5:15).'
        },
        {
          question: 'Who brought the sick and vexed with unclean spirits?',
          choices: ['Only Jerusalem', 'Multitudes from cities round about', 'Only priests', 'No one'],
          correctIndex: 1,
          correctFeedback: 'Yes! Multitudes from surrounding cities.',
          wrongFeedback: 'Multitudes from cities round about brought the sick and vexed with unclean spirits (Acts 5:16).'
        },
        {
          question: 'What happened to all who were brought?',
          choices: ['They stayed sick', 'They were healed every one', 'They were ignored', 'They were punished'],
          correctIndex: 1,
          correctFeedback: 'Yes! They were healed every one.',
          wrongFeedback: 'They were healed every one (Acts 5:16).'
        },
        {
          question: 'What can we learn from Peter\'s shadow?',
          choices: ['Shadows are magic', 'God heals through His servants — it is His power', 'Never help sick', 'Peter was afraid'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God worked through Peter — many healed, church grew!',
          wrongFeedback: 'God worked signs and wonders — the honour belongs to Him, not tricks.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God heals through His servants!',
      takeaway: 'God heals through His servants — great signs and wonders.',
      prayer: 'God, thank Thee for healing. Use me to help others. Amen.'
    },

    paulSilas: {
      kjvRef: 'Acts 16:16–40',
      paragraphs: [
        'A damsel possessed with a spirit of divination followed Paul and Silas, crying "These men are the servants of the most high God." Paul cast out the spirit in Jesus\' name.',
        'Her masters were angry — they brought Paul and Silas to the magistrates. They were beaten and cast into the inner prison.',
        'At midnight Paul and Silas prayed, and sang praises unto God. The prisoners heard them.',
        'Suddenly there was a great earthquake. The foundations of the prison were shaken; doors opened, and every one\'s bands were loosed.',
        'The keeper of the prison asked, "Sirs, what must I do to be saved?" Paul said, "Believe on the Lord Jesus Christ, and thou shalt be saved, and thy house." They believed and were baptized.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul and Silas in Philippi, damsel following them, no text',
        'fun kid illustration: Paul casting out spirit, masters angry, no text',
        'colorful Bible scene for children: Paul and Silas beaten and cast into prison, no text',
        'exciting cartoon: midnight prayer and singing, earthquake, doors open, bands loosed, no text',
        'hopeful ending illustration: jailer asking what must I do to be saved, Paul answering, family baptized, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Paul and Silas sang in prison — God sent an earthquake!',
      quizHeading: 'Paul and Silas Sing in Prison Questions',
      questions: [
        {
          question: 'What spirit did the damsel have?',
          choices: ['A good spirit', 'A spirit of divination', 'A happy spirit', 'A quiet spirit'],
          correctIndex: 1,
          correctFeedback: 'Yes! A spirit of divination — she cried that they were servants of the most high God.',
          wrongFeedback: 'A damsel possessed with a spirit of divination followed them (Acts 16:16).'
        },
        {
          question: 'Why were Paul and Silas beaten?',
          choices: ['They helped her', 'Her masters were angry after the spirit was cast out', 'They stole', 'They sang'],
          correctIndex: 1,
          correctFeedback: 'Right! Masters angry after Paul cast out the spirit — accused them.',
          wrongFeedback: 'Her masters saw their gain was gone — they caught and accused Paul and Silas (Acts 16:19–23).'
        },
        {
          question: 'What did Paul and Silas do at midnight?',
          choices: ['Slept', 'Prayed and sang praises to God', 'Ran away', 'Cried'],
          correctIndex: 1,
          correctFeedback: 'Yes! Prayed and sang praises — prisoners heard.',
          wrongFeedback: 'At midnight Paul and Silas prayed, and sang praises unto God (Acts 16:25).'
        },
        {
          question: 'What happened during the earthquake?',
          choices: ['Nothing', 'Doors opened, every one\'s bands loosed', 'Prison collapsed only', 'Guards fled only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Earthquake — doors opened, bands loosed.',
          wrongFeedback: 'There was a great earthquake — the doors opened, and every one\'s bands were loosed (Acts 16:26).'
        },
        {
          question: 'What can we learn from Paul and Silas in prison?',
          choices: ['Never sing', 'Pray and praise in hard times — God is with us', 'Give up', 'Be silent'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Pray and praise in hard times — God hears.',
          wrongFeedback: 'Paul and Silas sang — God sent earthquake, saved the jailer!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — pray and praise in hard times!',
      takeaway: 'Pray and praise in hard times — God is with us.',
      prayer: 'God, help me pray and praise even in hard times. Thank Thee for deliverance. Amen.'
    },

    lydiaSell: {
      kjvRef: 'Acts 16:11–15',
      paragraphs: [
        'Paul and his companions came to Philippi. On the sabbath they went out of the city by a river side, where prayer was wont to be made.',
        'A woman named Lydia, a seller of purple, of the city of Thyatira, heard Paul. The Lord opened her heart to attend unto the things spoken.',
        'She and her household were baptized. She said, "If ye have judged me to be faithful to the Lord, come into my house, and abide there."',
        'She constrained them to stay. Lydia opened her home to the gospel workers.',
        'Lydia believed and showed hospitality — among the first in Philippi to follow Christ.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul and companions at river in Philippi, prayer meeting, no text',
        'fun kid illustration: Lydia seller of purple listening to Paul, Lord opening her heart, no text',
        'colorful Bible scene for children: Lydia and household baptized, no text',
        'exciting cartoon: Lydia saying come into my house and abide there, no text',
        'hopeful ending illustration: Lydia opening home to gospel workers, hospitality joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Lydia opened her heart and home — the Lord opened her heart!',
      quizHeading: 'Lydia Opens Her Heart Questions',
      questions: [
        {
          question: 'Where did Paul go on the sabbath in Philippi?',
          choices: ['To the synagogue', 'To the river where prayer was wont to be made', 'To the market', 'To the palace'],
          correctIndex: 1,
          correctFeedback: 'Yes! To the river where prayer was made.',
          wrongFeedback: 'They went… by a river side, where prayer was wont to be made (Acts 16:13).'
        },
        {
          question: 'Who heard Paul at the river?',
          choices: ['A man', 'Lydia, seller of purple', 'A child', 'A king'],
          correctIndex: 1,
          correctFeedback: 'Right! Lydia, a seller of purple from Thyatira.',
          wrongFeedback: 'A woman named Lydia, a seller of purple, heard them (Acts 16:14).'
        },
        {
          question: 'What happened to Lydia\'s heart?',
          choices: ['It closed', 'The Lord opened her heart to attend to the things spoken', 'It was angry', 'It was sad'],
          correctIndex: 1,
          correctFeedback: 'Yes! The Lord opened her heart.',
          wrongFeedback: 'The Lord opened her heart to attend unto the things spoken by Paul (Acts 16:14).'
        },
        {
          question: 'What did Lydia and her household do?',
          choices: ['Left the city', 'Were baptized', 'Rejected Paul', 'Sold purple only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Lydia and her household were baptized.',
          wrongFeedback: 'She was baptized, and her household (Acts 16:15).'
        },
        {
          question: 'What can we learn from Lydia?',
          choices: ['Never open home', 'Open heart and home to the Lord and His people', 'Ignore preachers', 'Stay alone'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Open heart and home — God honours hospitality.',
          wrongFeedback: 'Lydia believed, was baptized, and opened her home — a pattern of welcome!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — open heart and home!',
      takeaway: 'Open heart and home to the gospel — God uses hospitality.',
      prayer: 'God, thank Thee for open hearts. Help me share the gospel and welcome others. Amen.'
    },

    phoebeDeacon: {
      kjvRef: 'Romans 16:1–2',
      paragraphs: [
        'Paul wrote to the church in Rome about Phebe: "I commend unto you Phebe our sister, which is a servant of the church which is at Cenchrea."',
        'She had been a succourer of many, and of Paul also. Paul asked them to receive her in the Lord, as becometh saints.',
        'In the KJV she is called a servant of the church — the same Greek word is often translated deacon in other Bibles. She helped many believers.',
        'Paul said to assist her in whatsoever business she had need of them — she had been a helper of many.',
        'Phebe served faithfully — a pattern of love and dependability for the church.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Phebe servant of the church at Cenchrea, helping people, no text',
        'fun kid illustration: Phebe succouring many, including Paul, no text',
        'colorful Bible scene for children: Paul commending Phebe to the church in Rome, no text',
        'exciting cartoon: church receiving Phebe as becometh saints, no text',
        'hopeful ending illustration: Phebe helping believers, faithful service, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Phebe — servant of the church, helper of many!',
      quizHeading: 'Phebe, Servant of the Church Questions',
      questions: [
        {
          question: 'What was Phebe called in Romans 16:1 (KJV)?',
          choices: ['A queen', 'A servant of the church at Cenchrea', 'A soldier', 'A priest'],
          correctIndex: 1,
          correctFeedback: 'Yes! Phebe was a servant of the church.',
          wrongFeedback: 'Paul commended "Phebe our sister, which is a servant of the church which is at Cenchrea" (Romans 16:1).'
        },
        {
          question: 'What had Phebe been to many?',
          choices: ['A trouble', 'A succourer (helper)', 'A stranger', 'A ruler'],
          correctIndex: 1,
          correctFeedback: 'Right! A succourer of many, and of Paul also.',
          wrongFeedback: 'She hath been a succourer of many, and of myself also (Romans 16:2).'
        },
        {
          question: 'What did Paul ask the church to do for Phebe?',
          choices: ['Ignore her', 'Receive her in the Lord as becometh saints', 'Send her away', 'Judge her'],
          correctIndex: 1,
          correctFeedback: 'Yes! Receive her in the Lord as becometh saints.',
          wrongFeedback: 'Paul said "That ye receive her in the Lord, as becometh saints" (Romans 16:2).'
        },
        {
          question: 'What did Paul say to do for Phebe?',
          choices: ['Nothing', 'Assist her in whatsoever business she hath need of you', 'Avoid her', 'Question her'],
          correctIndex: 1,
          correctFeedback: 'Yes! Assist her in whatsoever business she hath need of you.',
          wrongFeedback: 'Paul said "assist her in whatsoever business she hath need of you" (Romans 16:2).'
        },
        {
          question: 'What can we learn from Phebe?',
          choices: ['Serving does not matter', 'God honours faithful servants who help His people', 'Never help others', 'Be selfish'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Phebe helped many — God commends such love.',
          wrongFeedback: 'Phebe was a servant of the church — succourer of many, including Paul!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — serve faithfully!',
      takeaway: 'Serve faithfully — God commends helpers like Phebe.',
      prayer: 'God, thank Thee for faithful servants like Phebe. Help me serve others. Amen.'
    },

    paulShip: {
      kjvRef: 'Acts 27',
      paragraphs: [
        'Paul was a prisoner on a ship sailing to Rome. A tempestuous wind called Euroclydon caught the ship.',
        'The sailors feared they would be lost. Paul stood and said, "Fear not… there shall be no loss of any man\'s life among you, but of the ship."',
        'An angel appeared to Paul saying, "Fear not, Paul; thou must be brought before Caesar." Paul encouraged the men.',
        'After fourteen days of storm, they drew near land. The ship ran aground. All 276 souls escaped safely to shore.',
        'God protected Paul and all on board — no life was lost, just as the angel said.'
      ],
      imagePrompts: [
        'bright cartoon for kids: ship in terrible storm, waves crashing, Paul on board, no text',
        'fun kid illustration: Paul saying fear not no loss of life, men afraid, no text',
        'colorful Bible scene for children: angel appearing to Paul, fear not thou must be brought before Caesar, no text',
        'exciting cartoon: ship running aground after 14 days, all 276 escaping to shore, no text',
        'hopeful ending illustration: all safe on land, God protecting Paul and crew, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God protected Paul in the storm — no life lost!',
      quizHeading: 'Paul\'s Ship in the Storm Questions',
      questions: [
        {
          question: 'What storm caught the ship?',
          choices: ['A calm wind', 'A tempestuous wind called Euroclydon', 'A gentle breeze', 'No storm'],
          correctIndex: 1,
          correctFeedback: 'Yes! A tempestuous wind called Euroclydon.',
          wrongFeedback: 'There arose against it a tempestuous wind, called Euroclydon (Acts 27:14).'
        },
        {
          question: 'What did Paul say to the men?',
          choices: ['We will all die', 'Fear not… no loss of any man\'s life, but of the ship', 'Jump overboard', 'Pray harder'],
          correctIndex: 1,
          correctFeedback: 'Right! "Fear not… there shall be no loss of any man\'s life among you, but of the ship."',
          wrongFeedback: 'Paul said "Fear not… there shall be no loss of any man\'s life" (Acts 27:22).'
        },
        {
          question: 'What did the angel say to Paul?',
          choices: ['Fear not, Paul; thou must be brought before Caesar', 'Surrender', 'Go home', 'Hide'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Fear not, Paul; thou must be brought before Caesar."',
          wrongFeedback: 'The angel said "Fear not, Paul; thou must be brought before Caesar" (Acts 27:24).'
        },
        {
          question: 'How many souls were on the ship?',
          choices: ['76', '276', '500', '1000'],
          correctIndex: 1,
          correctFeedback: 'Yes! All 276 souls escaped safely.',
          wrongFeedback: 'There were in all in the ship two hundred threescore and sixteen souls (Acts 27:37).'
        },
        {
          question: 'What can we learn from Paul\'s ship in the storm?',
          choices: ['God doesn\'t protect', 'God protects His people in danger', 'Never sail', 'Fear storms'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God protects — no life lost.',
          wrongFeedback: 'God kept His promise — all 276 safe, just as Paul said!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God protects in storms!',
      takeaway: 'God protects His people in danger — trust His word.',
      prayer: 'God, thank You for protection in storms. Help me trust You. Amen.'
    },

    priscillaTeach: {
      kjvRef: 'Acts 18:24–28',
      paragraphs: [
        'A Jew named Apollos came to Ephesus. He was eloquent and mighty in the scriptures, but he knew only the baptism of John.',
        'He spake boldly in the synagogue. When Priscilla and Aquila heard him, they took him unto them and expounded unto him the way of God more perfectly.',
        'Apollos was willing to learn. He went to Achaia with letters from the brethren.',
        'He mightily convinced the Jews that Jesus was Christ, shewing it by the scriptures.',
        'Priscilla and Aquila taught Apollos more perfectly — God uses teachers to grow His servants.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Apollos speaking boldly in synagogue, eloquent and mighty in scriptures, no text',
        'fun kid illustration: Priscilla and Aquila taking Apollos aside, expounding the way more perfectly, no text',
        'colorful Bible scene for children: Apollos receiving letters from brethren, going to Achaia, no text',
        'exciting cartoon: Apollos helping believers, convincing Jews from scriptures that Jesus is Christ, no text',
        'hopeful ending illustration: Priscilla and Aquila teaching, Apollos growing, God using teachers, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Priscilla and Aquila taught Apollos more perfectly!',
      quizHeading: 'Priscilla & Aquila Teach Questions',
      questions: [
        {
          question: 'What did Apollos know only?',
          choices: ['The baptism of John', 'The full gospel', 'Nothing', 'Greek philosophy'],
          correctIndex: 0,
          correctFeedback: 'Yes! He knew only the baptism of John.',
          wrongFeedback: 'Apollos was eloquent and mighty in scriptures, but knew only the baptism of John (Acts 18:25).'
        },
        {
          question: 'Who took Apollos aside to teach him?',
          choices: ['Paul and Barnabas', 'Priscilla and Aquila', 'Peter and John', 'The synagogue leaders'],
          correctIndex: 1,
          correctFeedback: 'Right! Priscilla and Aquila expounded the way of God more perfectly.',
          wrongFeedback: 'Priscilla and Aquila took him unto them and expounded unto him the way of God more perfectly (Acts 18:26).'
        },
        {
          question: 'What did Apollos do after learning more?',
          choices: ['Stayed in Ephesus', 'Went to Achaia and helped believers', 'Quit preaching', 'Argued with Priscilla'],
          correctIndex: 1,
          correctFeedback: 'Yes! Went to Achaia, helped believers through grace.',
          wrongFeedback: 'Apollos went to Achaia and helped them much which had believed through grace (Acts 18:27).'
        },
        {
          question: 'How did Apollos convince the Jews?',
          choices: ['With miracles', 'Shewing by the scriptures that Jesus was Christ', 'With money', 'With force'],
          correctIndex: 1,
          correctFeedback: 'Right! Mightily convinced them by the scriptures.',
          wrongFeedback: 'Apollos "mightily convinced the Jews… shewing by the scriptures that Jesus was Christ" (Acts 18:28).'
        },
        {
          question: 'What can we learn from Priscilla & Aquila teaching Apollos?',
          choices: ['Never teach others', 'Teach more perfectly — God uses teachers to grow His servants', 'Stay silent', 'Argue with others'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Teach more perfectly — God uses teachers.',
          wrongFeedback: 'Priscilla and Aquila taught Apollos more perfectly — he grew and helped others!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — teach more perfectly!',
      takeaway: 'Teach more perfectly — God uses teachers to grow His servants.',
      prayer: 'God, thank You for teachers. Help me learn and teach Your truth. Amen.'
    },

    priscillaTent: {
      kjvRef: 'Acts 18:1–3, 18–19',
      paragraphs: [
        'Paul came to Corinth and found Aquila and Priscilla, Jews who had been expelled from Rome. They were tentmakers by trade.',
        'Paul abode with them and wrought — they were of the same craft, making tents together.',
        'Paul reasoned in the synagogue every sabbath. When Silas and Timotheus came, Paul was pressed in the spirit and testified to the Jews that Jesus was Christ.',
        'Priscilla and Aquila worked with Paul, making tents and serving the gospel.',
        'They later went with Paul toward Ephesus and continued teaching and serving.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Paul meeting Aquila and Priscilla in Corinth, tentmaking, no text',
        'fun kid illustration: Paul, Aquila, Priscilla working together on tents, no text',
        'colorful Bible scene for children: Paul reasoning in synagogue every sabbath, no text',
        'exciting cartoon: Silas and Timotheus arriving, Paul pressed in spirit, testifying, no text',
        'hopeful ending illustration: Priscilla and Aquila with Paul toward Ephesus, serving gospel, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Priscilla and Aquila were tentmakers with Paul!',
      quizHeading: 'Priscilla & Aquila Tentmakers Questions',
      questions: [
        {
          question: 'What trade did Aquila and Priscilla have?',
          choices: ['Fishermen', 'Tentmakers', 'Farmers', 'Carpenters'],
          correctIndex: 1,
          correctFeedback: 'Yes! They were tentmakers by trade.',
          wrongFeedback: 'Paul abode with them because they were of the same craft — tentmakers (Acts 18:3).'
        },
        {
          question: 'Why did Paul abide with them?',
          choices: ['They were rich', 'They were of the same craft — tentmakers', 'They were family', 'They were famous'],
          correctIndex: 1,
          correctFeedback: 'Right! Paul abode with them and worked — same craft.',
          wrongFeedback: 'Paul abode with them and wrought — they were of the same craft (Acts 18:3).'
        },
        {
          question: 'What did Paul do every sabbath?',
          choices: ['Rest', 'Reasoned in the synagogue', 'Traveled', 'Built tents only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Reasoned in the synagogue every sabbath.',
          wrongFeedback: 'Paul reasoned in the synagogue every sabbath (Acts 18:4).'
        },
        {
          question: 'Who came to Paul later?',
          choices: ['Peter and John', 'Silas and Timotheus', 'Barnabas', 'Aquila only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Silas and Timotheus came — Paul was pressed in the spirit.',
          wrongFeedback: 'When Silas and Timotheus were come from Macedonia, Paul was pressed in the spirit (Acts 18:5).'
        },
        {
          question: 'What can we learn from Priscilla & Aquila tentmakers?',
          choices: ['Work is bad', 'Work and serve the gospel together', 'Never work', 'Hide faith'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Work and serve the gospel together.',
          wrongFeedback: 'Priscilla and Aquila worked as tentmakers with Paul — served the gospel!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — work and serve together!',
      takeaway: 'Work and serve the gospel together — God uses everyday work.',
      prayer: 'God, thank You for work. Help me serve You in my daily tasks. Amen.'
    },

    greatCommission: {
      kjvRef: 'Matthew 28:18–20',
      paragraphs: [
        'Jesus came and spake unto them, saying, "All power is given unto me in heaven and in earth."',
        'He said, "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost."',
        'Teach them to observe all things whatsoever I have commanded you.',
        'Jesus promised, "Lo, I am with you alway, even unto the end of the world."',
        'The Great Commission — go, teach, baptize — Jesus is with us always.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus speaking to disciples on mountain, all power is given unto me, no text',
        'fun kid illustration: Jesus saying go ye therefore and teach all nations, no text',
        'colorful Bible scene for children: disciples baptizing, teaching obedience, no text',
        'exciting cartoon: Jesus promising lo I am with you alway, disciples going out, no text',
        'hopeful ending illustration: Great Commission go teach baptize, Jesus with us, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus\' Great Commission — go teach all nations!',
      quizHeading: 'Great Commission Questions',
      questions: [
        {
          question: 'What did Jesus say about His power?',
          choices: ['No power', 'All power is given unto me in heaven and in earth', 'Some power', 'Power is shared'],
          correctIndex: 1,
          correctFeedback: 'Yes! "All power is given unto me in heaven and in earth."',
          wrongFeedback: 'Jesus said "All power is given unto me in heaven and in earth" (Matthew 28:18).'
        },
        {
          question: 'What did Jesus command?',
          choices: ['Stay home', 'Go teach all nations, baptizing them', 'Build temples', 'Fight enemies'],
          correctIndex: 1,
          correctFeedback: 'Right! "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost."',
          wrongFeedback: 'Jesus commanded "Go ye therefore, and teach all nations" (Matthew 28:19).'
        },
        {
          question: 'What did Jesus say to teach them?',
          choices: ['Nothing', 'To observe all things I have commanded you', 'To ignore commandments', 'To follow men'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Teaching them to observe all things whatsoever I have commanded you."',
          wrongFeedback: 'Jesus said "Teaching them to observe all things whatsoever I have commanded you" (Matthew 28:20).'
        },
        {
          question: 'What promise did Jesus give?',
          choices: ['I will leave you', 'Lo, I am with you alway, even unto the end of the world', 'You are alone', 'Come back soon'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Lo, I am with you alway, even unto the end of the world."',
          wrongFeedback: 'Jesus promised "Lo, I am with you alway, even unto the end of the world" (Matthew 28:20).'
        },
        {
          question: 'What can we learn from the Great Commission?',
          choices: ['Keep gospel secret', 'Go teach and baptize — Jesus is with us always', 'Stay quiet', 'Forget teaching'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Go teach and baptize — Jesus is with us always.',
          wrongFeedback: 'Jesus\' final command — go, teach, baptize — He is with us!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — go make disciples!',
      takeaway: 'Go teach and baptize all nations — Jesus is with us always.',
      prayer: 'Jesus, thank You for being with us always. Help me make disciples. Amen.'
    },

    prodigalSon: {
      kjvRef: 'Luke 15:11–32',
      paragraphs: [
        'A certain man had two sons. The younger said, "Father, give me the portion of goods that falleth to me." The father divided his living.',
        'The younger son went into a far country and wasted his substance with riotous living. He was in want and fed swine.',
        'He came to himself and said, "I will arise and go to my father… I have sinned against heaven, and before thee."',
        'The father saw him afar off, ran, fell on his neck, and kissed him. He said, "Bring forth the best robe… let us eat, and be merry."',
        'The elder son was angry. The father said, "It was meet that we should make merry… for this thy brother was dead, and is alive again."'
      ],
      imagePrompts: [
        'bright cartoon for kids: younger son asking father for portion, no text',
        'fun kid illustration: younger son wasting substance in far country, feeding swine, no text',
        'colorful Bible scene for children: son returning, father running to meet him, no text',
        'exciting cartoon: father putting best robe on son, killing fatted calf, no text',
        'hopeful ending illustration: elder son angry, father saying this thy brother was dead and is alive again, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The prodigal son returned — the father rejoiced!',
      quizHeading: 'Prodigal Son Questions',
      questions: [
        {
          question: 'What did the younger son ask his father?',
          choices: ['Give me the portion of goods that falleth to me', 'Give me more work', 'Let me stay', 'Help me'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Father, give me the portion of goods that falleth to me."',
          wrongFeedback: 'The younger son said "Father, give me the portion of goods that falleth to me" (Luke 15:12).'
        },
        {
          question: 'What did the son do in the far country?',
          choices: ['Saved money', 'Wasted his substance with riotous living', 'Worked hard', 'Helped others'],
          correctIndex: 1,
          correctFeedback: 'Right! Wasted his substance with riotous living.',
          wrongFeedback: 'He wasted his substance with riotous living (Luke 15:13).'
        },
        {
          question: 'What did the son say when he came to himself?',
          choices: ['I will stay here', 'I will arise and go to my father… I have sinned', 'I am rich', 'I am strong'],
          correctIndex: 1,
          correctFeedback: 'Yes! "I will arise and go to my father… I have sinned against heaven."',
          wrongFeedback: 'He came to himself and said "I will arise and go to my father… I have sinned" (Luke 15:18).'
        },
        {
          question: 'What did the father do when he saw his son?',
          choices: ['Punished him', 'Ran, fell on his neck, kissed him', 'Ignored him', 'Sent him away'],
          correctIndex: 1,
          correctFeedback: 'Right! Ran, fell on his neck, and kissed him.',
          wrongFeedback: 'The father saw him afar off, had compassion, ran, fell on his neck, and kissed him (Luke 15:20).'
        },
        {
          question: 'What can we learn from the prodigal son?',
          choices: ['Never return home', 'God rejoices when sinners repent', 'Stay in sin', 'Never forgive'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God rejoices when sinners repent — welcome home.',
          wrongFeedback: 'The father rejoiced — "this thy brother was dead, and is alive again" (Luke 15:32).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God rejoices over repentance!',
      takeaway: 'God rejoices when sinners repent — welcome home.',
      prayer: 'God, thank You for rejoicing over me. Help me repent and return. Amen.'
    },

    elijahFire: {
      kjvRef: '1 Kings 18:20–40',
      paragraphs: [
        'Elijah challenged the prophets of Baal on Mount Carmel. He said, "Let the God that answereth by fire be God."',
        'The prophets of Baal called on their god all day — no answer, no fire. Elijah mocked them: "Cry aloud… perhaps he is asleep."',
        'Elijah built an altar, put the bullock on it, and poured water three times over the sacrifice until the trench was full.',
        'Elijah prayed: "Hear me, O Lord… that this people may know that thou art the Lord God." Fire fell from heaven and consumed the sacrifice, wood, stones, dust, and licked up the water.',
        'The people fell on their faces and said, "The Lord, he is the God." God showed Baal was nothing — Israel was called back to the Lord alone.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Elijah challenging prophets of Baal on Mount Carmel, no text',
        'fun kid illustration: prophets of Baal calling on their god, no fire, no text',
        'colorful Bible scene for children: Elijah building altar, pouring water three times, trench full, no text',
        'exciting cartoon: Elijah praying, fire falling from heaven, consuming sacrifice and water, no text',
        'hopeful ending illustration: people saying The Lord he is the God, reverent joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Elijah prayed — fire fell from heaven!',
      quizHeading: 'Elijah & Fire from Heaven Questions',
      questions: [
        {
          question: 'Where did Elijah challenge the prophets of Baal?',
          choices: ['In the city', 'On Mount Carmel', 'By the sea', 'In a cave'],
          correctIndex: 1,
          correctFeedback: 'Yes! On Mount Carmel.',
          wrongFeedback: 'Elijah challenged them on Mount Carmel (1 Kings 18:19–20).'
        },
        {
          question: 'What did Elijah say about the true God?',
          choices: ['Let the God that answereth by fire be God', 'Let Baal answer', 'Let us wait', 'Let us fight'],
          correctIndex: 0,
          correctFeedback: 'Right! "Let the God that answereth by fire be God."',
          wrongFeedback: 'Elijah said "The God that answereth by fire, let him be God" (1 Kings 18:24).'
        },
        {
          question: 'What happened when the prophets of Baal called?',
          choices: ['Fire fell', 'No answer, no fire', 'Rain came', 'They won'],
          correctIndex: 1,
          correctFeedback: 'Yes! No answer, no fire all day.',
          wrongFeedback: 'They called on Baal all day — no voice, no answer, no fire (1 Kings 18:26).'
        },
        {
          question: 'What did Elijah do at the altar?',
          choices: ['Burned it dry', 'Poured water three times over the sacrifice', 'Left it empty', 'Broke it'],
          correctIndex: 1,
          correctFeedback: 'Yes! Poured water three times until the trench was full.',
          wrongFeedback: 'They poured water on the burnt sacrifice three times, and the trench was full (1 Kings 18:33–35).'
        },
        {
          question: 'What can we learn from Elijah & fire from heaven?',
          choices: ['Baal is strong', 'The Lord is God — He answers by fire', 'Never pray', 'Doubt God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! The Lord is God — He answers by fire.',
          wrongFeedback: 'Fire fell from heaven — the people said "The Lord, he is the God" (1 Kings 18:39).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — the Lord is God!',
      takeaway: 'The Lord is God — He answers by fire.',
      prayer: 'God, thank You for answering prayer. Help me trust You. Amen.'
    },

    elishaOil: {
      kjvRef: '2 Kings 4:1–7',
      paragraphs: [
        'A widow cried to Elisha: her husband died, and the creditor came to take her two sons as bondmen.',
        'Elisha asked, "What hast thou in the house?" She said, "Thy handmaid hath not any thing in the house, save a pot of oil."',
        'Elisha said, "Go, borrow vessels… shut the door upon thee and thy sons, and pour out into all those vessels."',
        'She poured — the oil stayed until all vessels were full. Elisha said, "Go, sell the oil, and pay thy debt, and live thou and thy children of the rest."',
        'God multiplied the oil — the widow and her sons were saved from debt.'
      ],
      imagePrompts: [
        'bright cartoon for kids: widow crying to Elisha, sons in danger, gentle not scary, no text',
        'fun kid illustration: Elisha asking what hast thou in the house, widow with pot of oil, no text',
        'colorful Bible scene for children: widow borrowing vessels, shutting door, pouring oil, no text',
        'exciting cartoon: oil multiplying until all vessels full, wonder, no text',
        'hopeful ending illustration: widow selling oil, paying debt, sons safe, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God multiplied the widow\'s oil — saved her sons!',
      quizHeading: 'Elisha & the Widow\'s Oil Questions',
      questions: [
        {
          question: 'Why did the widow cry to Elisha?',
          choices: ['She was happy', 'Creditor came to take her sons as bondmen', 'She had too much oil', 'She wanted to fight'],
          correctIndex: 1,
          correctFeedback: 'Yes! Creditor came to take her sons.',
          wrongFeedback: 'Her husband died, creditor came to take her two sons (2 Kings 4:1).'
        },
        {
          question: 'What did the widow have in the house?',
          choices: ['Nothing', 'A pot of oil', 'Gold', 'Food'],
          correctIndex: 1,
          correctFeedback: 'Right! "Not any thing… save a pot of oil."',
          wrongFeedback: 'She said "Thy handmaid hath not any thing in the house, save a pot of oil" (2 Kings 4:2).'
        },
        {
          question: 'What did Elisha tell her to do?',
          choices: ['Pour out in one vessel', 'Borrow vessels, shut the door, pour out', 'Give up', 'Sell her sons'],
          correctIndex: 1,
          correctFeedback: 'Yes! Borrow vessels, shut the door, pour out into them.',
          wrongFeedback: 'Elisha said "Go, borrow thee vessels… shut the door upon thee and thy sons, and pour out" (2 Kings 4:3–4).'
        },
        {
          question: 'What happened when she poured?',
          choices: ['Oil stopped immediately', 'Oil stayed until all vessels were full', 'Oil disappeared', 'Oil spilled'],
          correctIndex: 1,
          correctFeedback: 'Yes! Oil stayed until all vessels were full.',
          wrongFeedback: 'The oil stayed until all vessels were full (2 Kings 4:5–6).'
        },
        {
          question: 'What can we learn from Elisha & the widow\'s oil?',
          choices: ['God cannot multiply', 'God multiplies little into much', 'Never ask for help', 'Give up in debt'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God multiplies little into much.',
          wrongFeedback: 'God multiplied the oil — widow paid debt and lived of the rest!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God multiplies little!',
      takeaway: 'God multiplies little into much — trust Him in need.',
      prayer: 'God, thank You for multiplying little. Help me trust You. Amen.'
    },

    naaman: {
      kjvRef: '2 Kings 5:1–15',
      paragraphs: [
        'Naaman was captain of the host of Syria — a great man, but he was a leper.',
        'A little maid from Israel said, "Would God my lord were with the prophet in Samaria! he would recover him of his leprosy."',
        'Naaman came to Elisha. Elisha sent a messenger: "Go and wash in Jordan seven times, and thy flesh shall come again."',
        'Naaman was angry — he thought Elisha would strike his hand and call on God. His servants said, "If the prophet had bid thee do some great thing, wouldest thou not have done it?"',
        'Naaman dipped seven times in Jordan — his flesh came again like a little child. He returned to Elisha and said, "Now I know that there is no God in all the earth, but in Israel."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Naaman the great captain, leprosy shown gently, no text',
        'fun kid illustration: little maid telling Naaman about Elisha in Samaria, no text',
        'colorful Bible scene for children: Naaman at Elisha\'s house, messenger saying wash in Jordan seven times, no text',
        'exciting cartoon: Naaman angry, servants urging simple obedience, no text',
        'hopeful ending illustration: Naaman dipping seven times, flesh restored, peace, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Naaman dipped in Jordan — healed by God!',
      quizHeading: 'Naaman Healed in Jordan Questions',
      questions: [
        {
          question: 'Who was Naaman?',
          choices: ['A poor man', 'Captain of the host of Syria — a great man, but leper', 'A prophet', 'A king'],
          correctIndex: 1,
          correctFeedback: 'Yes! Great man, captain, but a leper.',
          wrongFeedback: 'Naaman was captain of the host of the king of Syria… but he was a leper (2 Kings 5:1).'
        },
        {
          question: 'What did the little maid say?',
          choices: ['Elisha is bad', 'Would God my lord were with the prophet in Samaria!', 'Go home', 'Stay sick'],
          correctIndex: 1,
          correctFeedback: 'Right! "Would God my lord were with the prophet… he would recover him."',
          wrongFeedback: 'The little maid said "Would God my lord were with the prophet… he would recover him" (2 Kings 5:3).'
        },
        {
          question: 'What did Elisha tell Naaman to do?',
          choices: ['Pay money', 'Go and wash in Jordan seven times', 'Bring gifts', 'Fight'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Go and wash in Jordan seven times."',
          wrongFeedback: 'Elisha said "Go and wash in Jordan seven times, and thy flesh shall come again" (2 Kings 5:10).'
        },
        {
          question: 'Why was Naaman angry?',
          choices: ['He wanted only great deeds', 'He thought Elisha would strike hand and call on God', 'He loved Jordan first', 'He was healed too fast'],
          correctIndex: 1,
          correctFeedback: 'Right! Thought Elisha would strike hand and call on God.',
          wrongFeedback: 'Naaman was angry — thought Elisha would "strike his hand over the place, and recover the leper" (2 Kings 5:11).'
        },
        {
          question: 'What can we learn from Naaman?',
          choices: ['Obey great things only', 'Obey simple commands — God heals', 'Never wash', 'Doubt prophets'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Obey simple commands — God heals.',
          wrongFeedback: 'Naaman dipped seven times — flesh like a child, believed in God of Israel!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — obey simple commands!',
      takeaway: 'Obey simple commands — God heals and saves.',
      prayer: 'God, help me obey Your simple commands. Thank You for healing. Amen.'
    },

    fieryFurnace: {
      kjvRef: 'Daniel 3',
      paragraphs: [
        'King Nebuchadnezzar made a golden image. He commanded all to fall down and worship it when music played.',
        'Shadrach, Meshach, and Abednego refused. They said, "Our God is able to deliver us… but if not, we will not serve thy gods."',
        'The king was furious. He heated the furnace seven times hotter and cast the three men in.',
        'The flames killed the men who carried them. The king saw four men walking in the fire — unharmed. The fourth was like the Son of God.',
        'The king called them out. They were not hurt, not even the smell of fire on them. The king blessed their God.'
      ],
      imagePrompts: [
        'bright cartoon for kids: king commanding worship of golden image, no text',
        'fun kid illustration: Shadrach Meshach Abednego refusing to bow, brave calm faces, no text',
        'colorful Bible scene for children: furnace heated seven times hotter, three men faithful, no text',
        'exciting cartoon: king seeing four in fire, fourth like Son of God, gentle wonder, no text',
        'hopeful ending illustration: three friends out unharmed, king amazed, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'They refused to bow — God walked with them in the fire!',
      quizHeading: 'Fiery Furnace Questions',
      questions: [
        {
          question: 'What did the king command everyone to do?',
          choices: ['Bow to the golden image', 'Pray to God', 'Run away', 'Fight'],
          correctIndex: 0,
          correctFeedback: 'Yes! Fall down and worship the golden image.',
          wrongFeedback: 'The king commanded all to fall down and worship the golden image (Daniel 3:4–5).'
        },
        {
          question: 'What did Shadrach, Meshach, and Abednego say?',
          choices: ['We will bow', 'Our God is able to deliver us… but if not, we will not serve thy gods', 'We are afraid', 'We will bow if you pay us'],
          correctIndex: 1,
          correctFeedback: 'Right! "Our God is able… but if not, we will not serve thy gods."',
          wrongFeedback: 'They said "Our God is able to deliver us… but if not, we will not serve thy gods" (Daniel 3:17–18).'
        },
        {
          question: 'How hot was the furnace?',
          choices: ['Normal', 'Seven times hotter', 'A little hotter', 'Cold'],
          correctIndex: 1,
          correctFeedback: 'Yes! Seven times hotter.',
          wrongFeedback: 'The king commanded to heat the furnace seven times more (Daniel 3:19).'
        },
        {
          question: 'What did the king see in the fire?',
          choices: ['Three men', 'Four men — fourth like the Son of God', 'Nothing', 'Fire only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Four men walking in the fire — fourth like the Son of God.',
          wrongFeedback: 'The king saw four men walking in the midst of the fire, the fourth like the Son of God (Daniel 3:25).'
        },
        {
          question: 'What can we learn from the fiery furnace?',
          choices: ['Bow to idols', 'God protects those who stand for Him', 'Run from kings', 'Never trust God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God protects those who stand firm for Him.',
          wrongFeedback: 'The three men stood firm — God walked with them in the fire!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God protects in fire!',
      takeaway: 'God protects those who stand firm for Him — even in fire.',
      prayer: 'God, help me stand firm for You. Thank You for protection. Amen.'
    },

    samson: {
      kjvRef: 'Judges 13–16',
      paragraphs: [
        'An angel told Manoah\'s wife she would bear a son — a Nazarite from the womb. No razor on his head, no wine, no unclean thing.',
        'The Spirit of the Lord began to move Samson at times. When a young lion roared against him, the Spirit came mightily — he tore it as one would tear a kid.',
        'Samson loved Delilah. She pressed him for the secret of his strength. He said his hair — if shaved, he would be weak.',
        'Delilah shaved his head while he slept. The Philistines took him, put out his eyes, and bound him.',
        'Samson prayed for strength one last time. He pushed the pillars — the house fell, and he died with many enemies — more in his death than in his life.'
      ],
      imagePrompts: [
        'bright cartoon for kids: angel telling Manoah\'s wife about son, Nazarite vow, no text',
        'fun kid illustration: young Samson and lion, strength from God, not gory, no text',
        'colorful Bible scene for children: Samson and Delilah, secret of hair, no text',
        'exciting cartoon: Delilah cutting hair, Philistines, sombre not cruel detail, no text',
        'hopeful ending illustration: Samson praying, pillars, courage and cost, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Samson\'s strength from God — keep vows to the Lord!',
      quizHeading: 'Samson Questions',
      questions: [
        {
          question: 'What was Samson to be from birth?',
          choices: ['A king', 'A Nazarite — no razor, no wine', 'A priest', 'A farmer'],
          correctIndex: 1,
          correctFeedback: 'Yes! A Nazarite from the womb.',
          wrongFeedback: 'The angel said he would be a Nazarite — no razor, no wine (Judges 13:5).'
        },
        {
          question: 'When a young lion roared against Samson, what happened?',
          choices: ['He ran away', 'The Spirit of the Lord came mightily — he tore the lion', 'He called for help', 'He fed it'],
          correctIndex: 1,
          correctFeedback: 'Right! God gave him strength against the lion.',
          wrongFeedback: 'The Spirit of the LORD came mightily upon him… and he rent him as he would have rent a kid (Judges 14:6).'
        },
        {
          question: 'What was the secret of Samson\'s strength?',
          choices: ['His muscles alone', 'His hair — if shaved, he would be weak', 'His food', 'His friends'],
          correctIndex: 1,
          correctFeedback: 'Yes! His hair — if shaved, he would be weak.',
          wrongFeedback: 'Samson said "If I be shaven, then my strength will go from me" (Judges 16:17).'
        },
        {
          question: 'What happened when Delilah shaved his head?',
          choices: ['He became stronger', 'Philistines took him, put out his eyes', 'He ran away', 'Nothing'],
          correctIndex: 1,
          correctFeedback: 'Yes! Philistines took him, put out his eyes.',
          wrongFeedback: 'Delilah shaved his head — his strength went, Philistines took him (Judges 16:19–21).'
        },
        {
          question: 'What can we learn from Samson?',
          choices: ['Strength is only hair', 'Strength from God — keep faith and vows to Him', 'Never trust God', 'Break vows'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Strength from God — obey His commands.',
          wrongFeedback: 'Samson\'s strength was from God — he lost it when he broke his Nazarite vow!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — strength from God!',
      takeaway: 'Strength from God — obey His commands.',
      prayer: 'God, thank You for strength. Help me obey Your commands. Amen.'
    },

    jonahVine: {
      kjvRef: 'Jonah 4',
      paragraphs: [
        'God had spared great city Nineveh when they repented. Jonah went out east of the city and made a booth — he was very displeased and angry.',
        'The Lord said, "Doest thou well to be angry?" Jonah wanted to see his own way, not God\'s mercy.',
        'God prepared a gourd to come up over Jonah, that it might be a shadow over his head. Jonah was glad for the plant.',
        'God prepared a worm when the morning rose the next day — it smote the gourd, and it withered. The sun beat upon Jonah\'s head.',
        'God asked Jonah if he had pity on the plant. Should not God spare Nineveh — many people who knew not their right hand from their left? God cares for people.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jonah sitting outside city, upset, booth, no text',
        'fun kid illustration: God asking Jonah "Doest thou well to be angry?", calm teaching moment, no text',
        'colorful Bible scene for children: big leafy gourd vine shading Jonah, he is glad, no text',
        'exciting cartoon: little worm, withered vine, warm sun, Jonah uncomfortable, not scary, no text',
        'hopeful ending illustration: God\'s heart for the city — many people, compassion, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God cared for Jonah — and for the whole city!',
      quizHeading: 'Jonah & the Vine Questions',
      questions: [
        {
          question: 'How did Jonah feel after Nineveh repented?',
          choices: ['Joyful only', 'Displeased and angry', 'Sleepy', 'Hungry'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jonah was displeased — he had to learn about God\'s mercy.',
          wrongFeedback: 'It displeased Jonah exceedingly, and he was angry (Jonah 4:1).'
        },
        {
          question: 'What did God prepare to shade Jonah?',
          choices: ['A tent of cloth', 'A gourd plant over his head', 'A cloud only', 'A tree far away'],
          correctIndex: 1,
          correctFeedback: 'Right! A gourd came up for a shadow over his head.',
          wrongFeedback: 'The Lord God prepared a gourd… that it might be a shadow over his head (Jonah 4:6).'
        },
        {
          question: 'What happened to the gourd?',
          choices: ['It grew forever', 'God prepared a worm — it withered', 'Jonah cut it', 'Birds ate it'],
          correctIndex: 1,
          correctFeedback: 'Yes! A worm smote the gourd, and it withered.',
          wrongFeedback: 'God prepared a worm… and it smote the gourd, that it withered (Jonah 4:7).'
        },
        {
          question: 'What did God care about besides the plant?',
          choices: ['Only animals', 'The many people of Nineveh', 'Storms only', 'Boats only'],
          correctIndex: 1,
          correctFeedback: 'Yes! God cared for the city full of people.',
          wrongFeedback: 'Should not I spare Nineveh, that great city… of more than sixscore thousand persons (Jonah 4:11).'
        },
        {
          question: 'What can we learn from Jonah and the vine?',
          choices: ['God only loves some people', 'God\'s mercy is bigger than our moods — He loves people', 'Plants do not matter', 'Never obey God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God\'s heart is wide — He loves people deeply.',
          wrongFeedback: 'God taught Jonah that souls matter more than our comfort or anger!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God loves people!',
      takeaway: 'God\'s mercy is bigger than our moods — He loves every person.',
      prayer: 'God, help me love people the way You do. Thank You for mercy. Amen.'
    },

    tenPlagues: {
      kjvRef: 'Exodus 7–12',
      paragraphs: [
        'God sent Moses and Aaron to Pharaoh: "Let my people go." Pharaoh refused — God sent ten plagues.',
        'Water to blood, frogs, lice, flies, murrain on cattle, boils, hail, locusts, darkness, death of firstborn.',
        'Each plague showed God\'s power. Pharaoh hardened his heart until the last plague.',
        'The Lord said, "About midnight will I go out into the midst of Egypt: and all the firstborn… shall die."',
        'Israel obeyed — kept the Passover. God brought them out of Egypt with a mighty hand.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Moses and Aaron before Pharaoh, "Let my people go", no text',
        'fun kid illustration: water turned to blood, frogs everywhere, no text',
        'colorful Bible scene for children: hail, locusts, darkness over Egypt, no text',
        'solemn hopeful cartoon: Passover night, lamb blood on doorposts, families trusting God inside, calm not graphic, no text',
        'hopeful ending illustration: Israel leaving Egypt, God\'s mighty hand, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God sent ten plagues — let my people go!',
      quizHeading: 'Ten Plagues Questions',
      questions: [
        {
          question: 'What did Moses and Aaron say to Pharaoh?',
          choices: ['Give us money', 'Let my people go', 'Build a temple', 'Fight us'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Let my people go."',
          wrongFeedback: 'Moses and Aaron said "Thus saith the Lord… Let my people go" (Exodus 7:16).'
        },
        {
          question: 'How many plagues did God send?',
          choices: ['Five', 'Ten', 'Fifteen', 'One'],
          correctIndex: 1,
          correctFeedback: 'Right! Ten plagues.',
          wrongFeedback: 'God sent ten plagues on Egypt (Exodus 7–12).'
        },
        {
          question: 'What was the last plague?',
          choices: ['Frogs', 'Death of firstborn', 'Hail', 'Locusts'],
          correctIndex: 1,
          correctFeedback: 'Yes! Death of the firstborn.',
          wrongFeedback: 'The last plague was death of the firstborn (Exodus 12:29).'
        },
        {
          question: 'What did Israel do to be spared?',
          choices: ['Prayed only', 'Marked doors with blood of lamb', 'Hid', 'Fought Egyptians'],
          correctIndex: 1,
          correctFeedback: 'Right! Marked doors with blood — Passover.',
          wrongFeedback: 'They killed the lamb and struck blood on the door posts (Exodus 12:7, 13).'
        },
        {
          question: 'What can we learn from the ten plagues?',
          choices: ['Pharaoh is stronger', 'God\'s power delivers His people', 'Never obey God', 'Stay in Egypt'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God\'s power delivers His people.',
          wrongFeedback: 'God sent plagues and brought Israel out with a mighty hand!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God delivers!',
      takeaway: 'God\'s power delivers His people — trust Him.',
      prayer: 'God, thank You for Your power. Help me trust You to deliver. Amen.'
    },

    passoverLamb: {
      kjvRef: 'Exodus 12',
      paragraphs: [
        'God told Moses and Aaron: take a lamb without blemish on the tenth day, keep it until the fourteenth.',
        'Kill the lamb at even. Take blood and strike on the two side posts and upper door post.',
        'Eat the flesh roasted with fire, with unleavened bread and bitter herbs. Eat it in haste — girded loins, shoes on feet, staff in hand.',
        'The blood shall be a token — when I see the blood, I will pass over you. The plague shall not destroy you.',
        'This is the Lord\'s Passover. The Lord smote all the firstborn in Egypt — Israel was spared.'
      ],
      imagePrompts: [
        'bright cartoon for kids: family choosing lamb without blemish, no text',
        'fun kid illustration: striking blood on door posts and lintel, no text',
        'colorful Bible scene for children: eating lamb roasted, unleavened bread, bitter herbs, girded, no text',
        'exciting cartoon: blood as token — Lord passing over, gentle light, no text',
        'hopeful ending illustration: Israel safe inside marked homes, dawn of deliverance, calm not graphic, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The blood on the door — God passed over!',
      quizHeading: 'Passover Lamb Questions',
      questions: [
        {
          question: 'What did God tell them to take?',
          choices: ['A goat', 'A lamb without blemish', 'A cow', 'A bird'],
          correctIndex: 1,
          correctFeedback: 'Yes! A lamb without blemish.',
          wrongFeedback: 'Take a lamb without blemish (Exodus 12:5).'
        },
        {
          question: 'Where did they put the blood?',
          choices: ['On the ground', 'On the two side posts and upper door post', 'On the roof', 'On the windows'],
          correctIndex: 1,
          correctFeedback: 'Right! On the two side posts and upper door post.',
          wrongFeedback: 'Strike the blood on the two side posts and on the upper door post (Exodus 12:7).'
        },
        {
          question: 'How did they eat the lamb?',
          choices: ['Raw', 'Roasted with fire, unleavened bread, bitter herbs', 'Boiled', 'Fried'],
          correctIndex: 1,
          correctFeedback: 'Yes! Roasted with fire, unleavened bread, bitter herbs.',
          wrongFeedback: 'They shall eat the flesh in that night, roast with fire, and unleavened bread (Exodus 12:8).'
        },
        {
          question: 'What was the blood for?',
          choices: ['Decoration', 'A token — when I see the blood, I will pass over you', 'To scare enemies', 'To mark territory'],
          correctIndex: 1,
          correctFeedback: 'Yes! A token — God passed over houses with blood.',
          wrongFeedback: 'The blood shall be to you for a token… when I see the blood, I will pass over you (Exodus 12:13).'
        },
        {
          question: 'What can we learn from the Passover lamb?',
          choices: ['Blood is scary', 'God spares those who obey His word', 'Never eat lamb', 'Ignore plagues'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God spares those who obey His word.',
          wrongFeedback: 'The blood saved them — God passed over the marked houses!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God spares the obedient!',
      takeaway: 'God spares those who obey His word — the Passover lamb.',
      prayer: 'God, thank You for sparing us. Help me obey Your word. Amen.'
    },

    mosesStaffSnake: {
      kjvRef: 'Exodus 7:8–13',
      paragraphs: [
        'The Lord spoke to Moses and Aaron: "Take thy rod… it shall become a serpent."',
        'Moses and Aaron went to Pharaoh. Aaron cast down the rod before Pharaoh — it became a serpent.',
        'Pharaoh called the wise men and sorcerers. They cast down their rods — they became serpents.',
        'Aaron\'s rod swallowed up their rods. Pharaoh\'s heart was hardened — he would not listen.',
        'God showed His power — Aaron\'s rod became a serpent and swallowed the others.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Moses and Aaron before Pharaoh, rod in hand, no text',
        'fun kid illustration: Aaron casting rod down — becomes serpent, no text',
        'colorful Bible scene for children: Pharaoh\'s wise men casting rods, becoming serpents, no text',
        'exciting cartoon: Aaron\'s rod swallowing the others, Pharaoh watching, no text',
        'hopeful ending illustration: God\'s power shown, Pharaoh hardened but God stronger, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Aaron\'s rod became a serpent — swallowed the others!',
      quizHeading: 'Moses\' Staff Becomes Snake Questions',
      questions: [
        {
          question: 'What did God tell Moses and Aaron to do?',
          choices: ['Throw the rod — it shall become a serpent', 'Hide the rod', 'Break the rod', 'Give the rod to Pharaoh'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Take thy rod… it shall become a serpent."',
          wrongFeedback: 'God said "Take thy rod… and it shall become a serpent" (Exodus 7:9).'
        },
        {
          question: 'What happened when Aaron cast down the rod?',
          choices: ['Nothing', 'It became a serpent', 'It broke', 'It flew away'],
          correctIndex: 1,
          correctFeedback: 'Right! The rod became a serpent.',
          wrongFeedback: 'Aaron cast down his rod before Pharaoh, and it became a serpent (Exodus 7:10).'
        },
        {
          question: 'What did Pharaoh\'s wise men do?',
          choices: ['Prayed', 'Cast down their rods — became serpents', 'Ran away', 'Helped Aaron'],
          correctIndex: 1,
          correctFeedback: 'Yes! Cast down rods — became serpents.',
          wrongFeedback: 'The wise men and sorcerers cast down their rods — they became serpents (Exodus 7:11).'
        },
        {
          question: 'What happened to their serpents?',
          choices: ['They won', 'Aaron\'s rod swallowed them up', 'They fought', 'They disappeared'],
          correctIndex: 1,
          correctFeedback: 'Yes! Aaron\'s rod swallowed up their rods.',
          wrongFeedback: 'Aaron\'s rod swallowed up their rods (Exodus 7:12).'
        },
        {
          question: 'What can we learn from Moses\' staff snake?',
          choices: ['Tricks beat God', 'God\'s power is greater', 'Never use rods', 'Fear serpents'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God\'s power is greater — Aaron\'s rod swallowed theirs.',
          wrongFeedback: 'God showed His power — Pharaoh\'s heart hardened, but God was stronger!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God\'s power is greater!',
      takeaway: 'God\'s power is greater — trust Him over anything else.',
      prayer: 'God, thank You for Your power. Help me trust You. Amen.'
    },

    mosesSea: {
      kjvRef: 'Exodus 14',
      paragraphs: [
        'Pharaoh pursued Israel. The people were sore afraid — trapped by the Red Sea.',
        'Moses said, "Fear ye not, stand still, and see the salvation of the Lord."',
        'The Lord said to Moses, "Lift thou up thy rod… divide the sea." Moses stretched out his hand over the sea.',
        'The Lord caused the sea to go back by a strong east wind all night. The waters were divided — dry ground.',
        'Israel went through the sea on dry ground. The waters returned and covered Pharaoh\'s army — Israel saw the great work of the Lord.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Israel trapped by Red Sea, Pharaoh\'s army coming, no text',
        'fun kid illustration: Moses saying "Fear not, stand still", no text',
        'colorful Bible scene for children: Moses stretching rod over sea, strong east wind, waters divide, no text',
        'exciting cartoon: Israel walking on dry ground through the sea, walls of water, no text',
        'hopeful ending illustration: waters returning, Israel safe on the shore, praising God, not gory, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Moses parted the Red Sea — God delivered Israel!',
      quizHeading: 'Moses Parts the Red Sea Questions',
      questions: [
        {
          question: 'Why were the people afraid?',
          choices: ['Hungry', 'Trapped by Red Sea, Pharaoh pursuing', 'Lost', 'Tired'],
          correctIndex: 1,
          correctFeedback: 'Yes! Trapped by sea, Pharaoh pursuing.',
          wrongFeedback: 'Pharaoh pursued — Israel was sore afraid (Exodus 14:10).'
        },
        {
          question: 'What did Moses say?',
          choices: ['Run away', 'Fear ye not, stand still, and see the salvation of the Lord', 'Fight them', 'Give up'],
          correctIndex: 1,
          correctFeedback: 'Right! "Fear ye not, stand still, and see the salvation of the Lord."',
          wrongFeedback: 'Moses said "Fear ye not, stand still, and see the salvation of the Lord" (Exodus 14:13).'
        },
        {
          question: 'What did God tell Moses to do?',
          choices: ['Pray only', 'Lift up thy rod and divide the sea', 'Wait', 'Surrender'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Lift thou up thy rod… divide the sea."',
          wrongFeedback: 'The Lord said "Lift thou up thy rod… and divide the sea" (Exodus 14:16).'
        },
        {
          question: 'How did the sea part?',
          choices: ['By tricks', 'By strong east wind all night, dry ground', 'By boats', 'By rain'],
          correctIndex: 1,
          correctFeedback: 'Right! Strong east wind, waters divided, dry ground.',
          wrongFeedback: 'The Lord caused the sea to go back by a strong east wind… dry land (Exodus 14:21).'
        },
        {
          question: 'What can we learn from Moses parting the sea?',
          choices: ['Fear enemies', 'Trust God — He delivers', 'Never cross water', 'Give up'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Trust God — He delivers His people.',
          wrongFeedback: 'God parted the sea — Israel safe, Pharaoh\'s army stopped!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — trust God to deliver!',
      takeaway: 'Trust God — He delivers His people.',
      prayer: 'God, thank You for deliverance. Help me trust You. Amen.'
    },

    joshuaJordan: {
      kjvRef: 'Joshua 3–4',
      paragraphs: [
        'Joshua told the people, "Sanctify yourselves: for tomorrow the Lord will do wonders among you."',
        'The priests bearing the ark of the covenant stood in Jordan. The waters stood and rose up in a heap very far.',
        'All Israel passed over on dry ground. The priests stood firm in the midst of Jordan until all passed.',
        'Joshua commanded twelve men to take twelve stones from the midst of Jordan and set them up as a memorial.',
        'The waters returned when the priests came out. The people feared Joshua as they feared Moses — God was with him.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Joshua telling people to sanctify, Lord will do wonders, no text',
        'fun kid illustration: priests with ark standing in Jordan, waters heap up, no text',
        'colorful Bible scene for children: Israel passing on dry ground, priests in midst, no text',
        'exciting cartoon: twelve men taking stones from Jordan, setting up memorial, no text',
        'hopeful ending illustration: waters returning, people respecting Joshua, God with him, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Joshua crossed Jordan on dry ground — God was with him!',
      quizHeading: 'Joshua at Jordan Questions',
      questions: [
        {
          question: 'What did Joshua tell the people?',
          choices: ['Run away', 'Sanctify yourselves — tomorrow the Lord will do wonders', 'Fight now', 'Go back'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Sanctify yourselves: for tomorrow the Lord will do wonders."',
          wrongFeedback: 'Joshua said "Sanctify yourselves: for to morrow the Lord will do wonders among you" (Joshua 3:5).'
        },
        {
          question: 'Who stood in Jordan with the ark?',
          choices: ['The people', 'The priests bearing the ark', 'The king', 'The children'],
          correctIndex: 1,
          correctFeedback: 'Right! The priests bearing the ark stood in Jordan.',
          wrongFeedback: 'The priests that bare the ark stood firm on dry ground in the midst of Jordan (Joshua 3:17).'
        },
        {
          question: 'What happened to the waters?',
          choices: ['They flowed faster', 'Stood and rose up in a heap', 'Dried up completely', 'Flooded'],
          correctIndex: 1,
          correctFeedback: 'Yes! Waters stood and rose up in a heap very far.',
          wrongFeedback: 'The waters… stood and rose up upon an heap (Joshua 3:16).'
        },
        {
          question: 'What did Joshua command twelve men to do?',
          choices: ['Fight', 'Take twelve stones from Jordan for a memorial', 'Build a bridge', 'Pray'],
          correctIndex: 1,
          correctFeedback: 'Yes! Take twelve stones for a memorial.',
          wrongFeedback: 'Joshua commanded twelve men to take twelve stones… and set them up for a memorial (Joshua 4:1–9).'
        },
        {
          question: 'What can we learn from Joshua at Jordan?',
          choices: ['God is not with us', 'God is with His people — they crossed on dry ground', 'Never cross rivers', 'Fear water'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God is with His people — they crossed on dry ground.',
          wrongFeedback: 'The Lord was with Joshua — waters parted, memorial stones set!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God is with His people!',
      takeaway: 'God is with His people — He parts the way.',
      prayer: 'God, thank You for being with us. Help me trust You. Amen.'
    },

    redSeaCrossing: {
      kjvRef: 'Exodus 14',
      paragraphs: [
        'Pharaoh pursued Israel with chariots. The people cried out: "Because there were no graves in Egypt, hast thou taken us away to die in the wilderness?"',
        'Moses said, "Fear ye not, stand still, and see the salvation of the Lord, which he will shew to you to day."',
        'The Lord said to Moses, "Lift thou up thy rod, and stretch out thine hand over the sea, and divide it."',
        'Moses stretched out his hand over the sea. The Lord caused the sea to go back by a strong east wind all that night — dry ground, waters a wall on left and right.',
        'Israel passed through on dry ground. The waters returned and covered Pharaoh\'s army — not one remained. Israel saw the great work of the Lord and feared Him.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Pharaoh\'s chariots pursuing Israel to the Red Sea, people afraid, no text',
        'fun kid illustration: Moses saying "Fear ye not, stand still", no text',
        'colorful Bible scene for children: Moses stretching rod, strong east wind, sea parting, no text',
        'exciting cartoon: Israel walking on dry ground between walls of water, no text',
        'hopeful ending illustration: waters returning, Israel safe on shore praising God, not gory, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Moses parted the Red Sea — Israel safe, Pharaoh\'s army stopped!',
      quizHeading: 'Red Sea Crossing Questions',
      questions: [
        {
          question: 'Why were the people afraid?',
          choices: ['Hungry', 'Pharaoh pursuing with chariots', 'Lost', 'Tired'],
          correctIndex: 1,
          correctFeedback: 'Yes! Pharaoh pursued with chariots.',
          wrongFeedback: 'Pharaoh pursued Israel with all his chariots (Exodus 14:9).'
        },
        {
          question: 'What did Moses say?',
          choices: ['Run away', 'Fear ye not, stand still, and see the salvation of the Lord', 'Fight them', 'Give up'],
          correctIndex: 1,
          correctFeedback: 'Right! "Fear ye not, stand still, and see the salvation of the Lord."',
          wrongFeedback: 'Moses said "Fear ye not, stand still, and see the salvation of the Lord" (Exodus 14:13).'
        },
        {
          question: 'What did God tell Moses to do?',
          choices: ['Pray only', 'Lift up thy rod and stretch out thine hand over the sea', 'Wait', 'Surrender'],
          correctIndex: 1,
          correctFeedback: 'Yes! Lift up rod and stretch hand over the sea.',
          wrongFeedback: 'The Lord said "Lift thou up thy rod… and stretch out thine hand over the sea" (Exodus 14:16).'
        },
        {
          question: 'How did the sea part?',
          choices: ['By tricks', 'By strong east wind all night, dry ground', 'By boats', 'By rain'],
          correctIndex: 1,
          correctFeedback: 'Right! Strong east wind, waters a wall on left and right.',
          wrongFeedback: 'The Lord caused the sea to go back by a strong east wind… the waters were a wall (Exodus 14:21–22).'
        },
        {
          question: 'What can we learn from the Red Sea crossing?',
          choices: ['Fear enemies', 'Trust God — He delivers', 'Never cross water', 'Give up'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Trust God — He delivers His people.',
          wrongFeedback: 'God parted the sea — Israel safe, Pharaoh\'s army stopped!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — trust God to deliver!',
      takeaway: 'Trust God — He delivers His people.',
      prayer: 'God, thank You for deliverance. Help me trust You. Amen.'
    },

    jordanCrossing: {
      kjvRef: 'Joshua 3–4',
      paragraphs: [
        'Joshua told the people, "Sanctify yourselves: for to morrow the Lord will do wonders among you."',
        'The priests bearing the ark of the covenant stood in Jordan. The waters stood and rose up in a heap very far.',
        'All Israel passed over on dry ground. The priests stood firm in the midst of Jordan until all passed.',
        'Joshua commanded twelve men to take twelve stones from the midst of Jordan and set them up as a memorial.',
        'The waters returned when the priests came out. The people feared Joshua as they feared Moses — God was with him.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Joshua telling people to sanctify, Lord will do wonders, no text',
        'fun kid illustration: priests with ark standing in Jordan, waters heap up, no text',
        'colorful Bible scene for children: Israel passing on dry ground, priests in midst, no text',
        'exciting cartoon: twelve men taking stones from Jordan, setting up memorial, no text',
        'hopeful ending illustration: waters returning, people respecting Joshua, God with him, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Israel crossed Jordan on dry ground — God was with them!',
      quizHeading: 'Jordan Crossing Questions',
      questions: [
        {
          question: 'What did Joshua tell the people?',
          choices: ['Run away', 'Sanctify yourselves — tomorrow the Lord will do wonders', 'Fight now', 'Go back'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Sanctify yourselves: for to morrow the Lord will do wonders."',
          wrongFeedback: 'Joshua said "Sanctify yourselves: for to morrow the Lord will do wonders among you" (Joshua 3:5).'
        },
        {
          question: 'Who stood in Jordan with the ark?',
          choices: ['The people', 'The priests bearing the ark', 'The king', 'The children'],
          correctIndex: 1,
          correctFeedback: 'Right! The priests bearing the ark stood in Jordan.',
          wrongFeedback: 'The priests that bare the ark stood firm on dry ground in the midst of Jordan (Joshua 3:17).'
        },
        {
          question: 'What happened to the waters?',
          choices: ['They flowed faster', 'Stood and rose up in a heap', 'Dried up completely', 'Flooded'],
          correctIndex: 1,
          correctFeedback: 'Yes! Waters stood and rose up in a heap very far.',
          wrongFeedback: 'The waters… stood and rose up upon an heap (Joshua 3:16).'
        },
        {
          question: 'What did Joshua command twelve men to do?',
          choices: ['Fight', 'Take twelve stones from Jordan for a memorial', 'Build a bridge', 'Pray'],
          correctIndex: 1,
          correctFeedback: 'Yes! Take twelve stones for a memorial.',
          wrongFeedback: 'Joshua commanded twelve men to take twelve stones… and set them up for a memorial (Joshua 4:1–9).'
        },
        {
          question: 'What can we learn from crossing the Jordan?',
          choices: ['God is not with us', 'God is with His people — they crossed on dry ground', 'Never cross rivers', 'Fear water'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God is with His people — they crossed on dry ground.',
          wrongFeedback: 'The Lord was with Joshua — waters parted, memorial stones set!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God is with His people!',
      takeaway: 'God is with His people — He parts the way.',
      prayer: 'God, thank You for being with us. Help me trust You. Amen.'
    },

    jerichoWalls: {
      kjvRef: 'Joshua 6',
      paragraphs: [
        'God told Joshua: "Ye shall compass the city… once: and the priests shall blow with rams\' horns."',
        'For six days they compassed the city once, priests bearing the ark, blowing rams\' horns. On the seventh day they compassed seven times.',
        'Joshua said, "Shout; for the Lord hath given you the city." The people shouted with a great shout — the wall fell down flat.',
        'God gave them the city as He promised. Joshua spoke God\'s warning about rebuilding Jericho — God\'s word is to be kept.',
        'The walls of Jericho fell by faith and obedience — God gave the victory.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Joshua and Israel compassing Jericho once, priests with rams\' horns, no text',
        'fun kid illustration: six days marching around city, ark and horns, no text',
        'colorful Bible scene for children: seventh day — seven times around, shouting, no text',
        'exciting cartoon: great shout, walls of Jericho falling down flat, not scary gory, no text',
        'hopeful ending illustration: Israel thankful, God giving victory, calm joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Walls of Jericho fell by faith and obedience!',
      quizHeading: 'Walls of Jericho Fall Questions',
      questions: [
        {
          question: 'What did God tell Joshua to do?',
          choices: ['Attack immediately', 'Compass the city once, priests blow rams\' horns', 'Build ladders', 'Surrender'],
          correctIndex: 1,
          correctFeedback: 'Yes! Compass the city once, priests blow rams\' horns.',
          wrongFeedback: 'God said "Ye shall compass the city… once: and the priests shall blow with rams\' horns" (Joshua 6:3–4).'
        },
        {
          question: 'How many days did they compass once?',
          choices: ['One day', 'Six days', 'Seven days', 'Forty days'],
          correctIndex: 1,
          correctFeedback: 'Right! Six days compassing once.',
          wrongFeedback: 'They compassed the city once for six days (Joshua 6:14).'
        },
        {
          question: 'What happened on the seventh day?',
          choices: ['Nothing', 'Compassed seven times, shouted, walls fell', 'They rested', 'They fought'],
          correctIndex: 1,
          correctFeedback: 'Yes! Compassed seven times, shouted, walls fell.',
          wrongFeedback: 'On the seventh day they compassed seven times… and the wall fell down flat (Joshua 6:15, 20).'
        },
        {
          question: 'What did Joshua say when it was time to shout?',
          choices: ['Shout louder', 'Shout; for the Lord hath given you the city', 'Run away', 'Build again'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Shout; for the Lord hath given you the city."',
          wrongFeedback: 'Joshua said "Shout; for the Lord hath given you the city" (Joshua 6:16).'
        },
        {
          question: 'What can we learn from Jericho walls?',
          choices: ['Obey only easy things', 'Obey God — He gives victory', 'Never march', 'Doubt God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Obey God — He gives victory.',
          wrongFeedback: 'Walls fell by faith and obedience — God gave the victory!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — obey God for victory!',
      takeaway: 'Obey God — He gives victory.',
      prayer: 'God, help me obey You. Thank You for victory. Amen.'
    },

    burningBush: {
      kjvRef: 'Exodus 3:1–10',
      paragraphs: [
        'Moses kept the flock of Jethro. He came to the mountain of God, Horeb. The angel of the Lord appeared in a flame of fire out of a bush.',
        'The bush burned with fire, but was not consumed. Moses turned aside to see the great sight.',
        'God called, "Moses, Moses." Moses said, "Here am I." God said, "Put off thy shoes… the place whereon thou standest is holy ground."',
        'God said, "I am the God of thy father… I have surely seen the affliction of my people… I am come down to deliver them."',
        'God sent Moses to Pharaoh: "Come now therefore, and I will send thee unto Pharaoh, that thou mayest bring forth my people."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Moses with flock at Horeb, bush burning but not consumed, no text',
        'fun kid illustration: Moses turning aside to see the burning bush, no text',
        'colorful Bible scene for children: God calling "Moses, Moses", "Here am I", no text',
        'exciting cartoon: God saying "Put off thy shoes… holy ground", no text',
        'hopeful ending illustration: God sending Moses to deliver Israel from Pharaoh, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Moses saw the burning bush — God called him!',
      quizHeading: 'Burning Bush Questions',
      questions: [
        {
          question: 'Where did Moses see the burning bush?',
          choices: ['In Egypt', 'At the mountain of God, Horeb', 'By the sea', 'In a city'],
          correctIndex: 1,
          correctFeedback: 'Yes! At the mountain of God, Horeb.',
          wrongFeedback: 'Moses came to the mountain of God, even to Horeb (Exodus 3:1).'
        },
        {
          question: 'What was special about the bush?',
          choices: ['It was green', 'It burned with fire but was not consumed', 'It had fruit', 'It was cold'],
          correctIndex: 1,
          correctFeedback: 'Right! Burned with fire but not consumed.',
          wrongFeedback: 'The bush burned with fire, and the bush was not consumed (Exodus 3:2).'
        },
        {
          question: 'What did God say when Moses turned aside?',
          choices: ['Go away', 'Moses, Moses… put off thy shoes, holy ground', 'Run', 'Be silent'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Moses, Moses… put off thy shoes from off thy feet, for the place whereon thou standest is holy ground."',
          wrongFeedback: 'God called "Moses, Moses" and said "put off thy shoes… the place is holy ground" (Exodus 3:4–5).'
        },
        {
          question: 'What did God say He had seen?',
          choices: ['Nothing', 'The affliction of my people in Egypt', 'Riches', 'Power'],
          correctIndex: 1,
          correctFeedback: 'Yes! "I have surely seen the affliction of my people."',
          wrongFeedback: 'God said "I have surely seen the affliction of my people… in Egypt" (Exodus 3:7).'
        },
        {
          question: 'What can we learn from the burning bush?',
          choices: ['God is far away', 'God calls and sends His people', 'Never turn aside', 'Fear fire'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God calls and sends His people.',
          wrongFeedback: 'God called Moses at the burning bush — sent him to deliver Israel!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God calls and sends!',
      takeaway: 'God calls and sends His people — listen and obey.',
      prayer: 'God, thank You for calling us. Help me listen and obey. Amen.'
    },

    manna: {
      kjvRef: 'Exodus 16',
      paragraphs: [
        'Israel murmured in the wilderness: "Would to God we had died in Egypt!" God said, "I will rain bread from heaven for you."',
        'In the morning dew lay round the camp. When the dew vanished, small round thing appeared — manna like coriander seed, white, taste of wafers with honey.',
        'Moses said, "This is the bread which the Lord hath given you to eat." Gather an omer for each person.',
        'Some gathered more, some less — it was enough for all. On the sixth day they gathered twice as much for the sabbath.',
        'God provided manna every day for forty years — trust Him for daily bread.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Israel murmuring in wilderness, God promising bread from heaven, no text',
        'fun kid illustration: morning dew, manna like coriander seed appearing, no text',
        'colorful Bible scene for children: people gathering manna, one omer each, no text',
        'exciting cartoon: sixth day gathering twice for sabbath, no text',
        'hopeful ending illustration: manna every day for forty years, God providing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God rained manna from heaven — daily bread!',
      quizHeading: 'Manna from Heaven Questions',
      questions: [
        {
          question: 'Why did Israel murmur?',
          choices: ['They were full', 'They were hungry in the wilderness', 'They were rich', 'They were tired'],
          correctIndex: 1,
          correctFeedback: 'Yes! Hungry in the wilderness.',
          wrongFeedback: 'Israel murmured: "Would to God we had died… when we sat by the flesh pots" (Exodus 16:3).'
        },
        {
          question: 'What did God promise?',
          choices: ['Nothing', 'Bread from heaven', 'Gold', 'Water only'],
          correctIndex: 1,
          correctFeedback: 'Right! "I will rain bread from heaven for you."',
          wrongFeedback: 'God said "I will rain bread from heaven for you" (Exodus 16:4).'
        },
        {
          question: 'What did the manna look like?',
          choices: ['Big rocks', 'Small round thing, white, taste of wafers with honey', 'Red fruit', 'Green leaves'],
          correctIndex: 1,
          correctFeedback: 'Yes! Small round thing, white, taste of wafers with honey.',
          wrongFeedback: 'It was like coriander seed, white; and the taste of it was like wafers made with honey (Exodus 16:31).'
        },
        {
          question: 'How much did they gather?',
          choices: ['More or less — it was enough for all', 'All the same amount', 'None', 'Too much'],
          correctIndex: 0,
          correctFeedback: 'Yes! Some gathered more, some less — it was enough.',
          wrongFeedback: 'He that gathered much had nothing over, and he that gathered little had no lack (Exodus 16:18).'
        },
        {
          question: 'What can we learn from manna?',
          choices: ['God does not provide', 'God provides daily bread — trust Him', 'Never gather', 'Complain'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God provides daily bread — trust Him.',
          wrongFeedback: 'God rained manna every day for forty years — trust Him for daily needs!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God provides daily!',
      takeaway: 'God provides daily bread — trust Him.',
      prayer: 'God, thank You for daily provision. Help me trust You. Amen.'
    },

    sarahLaughs: {
      kjvRef: 'Genesis 18:9–15',
      paragraphs: [
        'Three men came to Abraham\'s tent. They asked, "Where is Sarah thy wife?" Abraham said, "Behold, in the tent."',
        'One said, "I will certainly return unto thee according to the time of life; and, lo, Sarah thy wife shall have a son."',
        'Sarah heard it in the tent door. She laughed within herself, saying, "After I am waxed old shall I have pleasure, my lord being old also?"',
        'The Lord said to Abraham, "Wherefore did Sarah laugh… Is any thing too hard for the Lord?"',
        'Sarah denied laughing, but the Lord said, "Nay; but thou didst laugh." God\'s promise is never too hard — even when it seems impossible.'
      ],
      imagePrompts: [
        'bright cartoon for kids: three men visiting Abraham\'s tent, asking for Sarah, no text',
        'fun kid illustration: Sarah listening from tent door, laughing to herself, no text',
        'colorful Bible scene for children: Lord speaking to Abraham about Sarah\'s laugh, no text',
        'exciting cartoon: Abraham and Sarah hearing promise of a son, wonder, no text',
        'hopeful ending illustration: God\'s promise — nothing too hard for the Lord, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Sarah laughed at God\'s promise — nothing is too hard for Him!',
      quizHeading: 'Sarah Laughs Questions',
      questions: [
        {
          question: 'What did the visitors ask Abraham?',
          choices: ['Where is thy wife Sarah?', 'Where is thy son?', 'Where is thy tent?', 'Where is thy food?'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Where is Sarah thy wife?"',
          wrongFeedback: 'They asked "Where is Sarah thy wife?" (Genesis 18:9).'
        },
        {
          question: 'What did the Lord promise Sarah?',
          choices: ['Nothing', 'She would have a son', 'Riches', 'A new tent'],
          correctIndex: 1,
          correctFeedback: 'Right! Sarah thy wife shall have a son.',
          wrongFeedback: 'The Lord said "Sarah thy wife shall have a son" (Genesis 18:10).'
        },
        {
          question: 'Why did Sarah laugh?',
          choices: ['She was happy', 'She thought it impossible — old age', 'She was sad', 'She didn\'t hear'],
          correctIndex: 1,
          correctFeedback: 'Yes! After she was old, and Abraham old, she laughed.',
          wrongFeedback: 'Sarah laughed within herself: "After I am waxed old shall I have pleasure, my lord being old also?" (Genesis 18:12).'
        },
        {
          question: 'What did the Lord ask Abraham?',
          choices: ['Why did Sarah laugh?', 'Is any thing too hard for the Lord?', 'Where is Sarah?', 'Both 1 and 2'],
          correctIndex: 3,
          correctFeedback: 'Yes! "Wherefore did Sarah laugh?… Is any thing too hard for the Lord?"',
          wrongFeedback: 'The Lord said "Wherefore did Sarah laugh… Is any thing too hard for the Lord?" (Genesis 18:13–14).'
        },
        {
          question: 'What can we learn from Sarah laughing?',
          choices: ['Doubt God\'s promises', 'Nothing is too hard for God', 'Never laugh', 'God forgets promises'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Nothing is too hard for God — He keeps His promises.',
          wrongFeedback: 'Sarah laughed because it seemed impossible — but God said "Is any thing too hard for the Lord?"'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — nothing is too hard for God!',
      takeaway: 'Nothing is too hard for God — He keeps His promises.',
      prayer: 'God, thank You that nothing is too hard for You. Help me trust Your promises. Amen.'
    },

    jacobLadder: {
      kjvRef: 'Genesis 28:10–22',
      paragraphs: [
        'Jacob left Beersheba and went toward Haran. He lighted upon a certain place and lay down to sleep.',
        'He dreamed: a ladder set up on the earth, top reached to heaven. Angels of God ascending and descending on it.',
        'The Lord stood above it and said, "I am the Lord God of Abraham thy father… I am with thee, and will keep thee in all places whither thou goest."',
        'Jacob awoke and said, "Surely the Lord is in this place; and I knew it not." He called the place Bethel — "house of God."',
        'Jacob vowed: "If God will be with me… this stone… shall be God\'s house." He poured oil on the pillar.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jacob traveling from Beersheba to Haran, lying down to sleep, no text',
        'fun kid illustration: Jacob\'s dream — ladder to heaven, angels going up and down, no text',
        'colorful Bible scene for children: Lord standing above ladder, promising to be with Jacob, no text',
        'exciting cartoon: Jacob awake, saying "Surely the Lord is in this place", naming Bethel, no text',
        'hopeful ending illustration: Jacob setting up stone pillar, pouring oil, vowing to God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jacob\'s ladder dream — God promised to be with him!',
      quizHeading: 'Jacob\'s Ladder Questions',
      questions: [
        {
          question: 'Where was Jacob going?',
          choices: ['To Egypt', 'Toward Haran', 'To Jerusalem', 'To the sea'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jacob went toward Haran.',
          wrongFeedback: 'Jacob went out from Beersheba and went toward Haran (Genesis 28:10).'
        },
        {
          question: 'What did Jacob dream about?',
          choices: ['A boat', 'A ladder set up on the earth, top to heaven, angels ascending and descending', 'A mountain', 'A river'],
          correctIndex: 1,
          correctFeedback: 'Right! A ladder to heaven with angels going up and down.',
          wrongFeedback: 'He dreamed… a ladder set up on the earth… angels of God ascending and descending (Genesis 28:12).'
        },
        {
          question: 'What did the Lord say to Jacob?',
          choices: ['I am against thee', 'I am with thee, and will keep thee', 'Go home', 'Be silent'],
          correctIndex: 1,
          correctFeedback: 'Yes! "I am with thee, and will keep thee in all places."',
          wrongFeedback: 'The Lord said "I am with thee, and will keep thee in all places whither thou goest" (Genesis 28:15).'
        },
        {
          question: 'What did Jacob call the place?',
          choices: ['Canaan', 'Bethel — house of God', 'Egypt', 'Haran'],
          correctIndex: 1,
          correctFeedback: 'Yes! Bethel — "Surely the Lord is in this place."',
          wrongFeedback: 'Jacob called the name of that place Bethel (Genesis 28:19).'
        },
        {
          question: 'What can we learn from Jacob\'s ladder?',
          choices: ['God is far away', 'God is with us — heaven and earth connected', 'Never dream', 'Fear angels'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God is with us — heaven and earth connected.',
          wrongFeedback: 'Jacob said "Surely the Lord is in this place" — God promised to be with him!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God is with us!',
      takeaway: 'God is with us — heaven and earth connected.',
      prayer: 'God, thank You for being with me. Help me know You are near. Amen.'
    },

    josephPrison: {
      kjvRef: 'Genesis 39–40',
      paragraphs: [
        'Joseph was sold into Egypt. Potiphar bought him and made him overseer of his house. The Lord was with Joseph.',
        'Joseph\'s master\'s wife tempted him. Joseph fled — "How then can I do this great wickedness, and sin against God?"',
        'She lied, and Joseph was put in prison. The Lord was with him there and gave him favor with the keeper.',
        'The king\'s butler and baker were imprisoned. Joseph interpreted their dreams — one was restored, the other faced Pharaoh\'s judgment, as Joseph said.',
        'The butler forgot Joseph — but God was with him in prison, preparing for greater things.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Joseph in Potiphar\'s house, overseer, Lord with him, no text',
        'fun kid illustration: Potiphar\'s wife tempting Joseph, Joseph fleeing, no text',
        'colorful Bible scene for children: Joseph in prison, keeper showing favor, no text',
        'exciting cartoon: Joseph interpreting dreams for butler and baker, no text',
        'hopeful ending illustration: butler restored, Joseph still faithful in prison, God with him, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Joseph in prison — God was with him!',
      quizHeading: 'Joseph in Prison Questions',
      questions: [
        {
          question: 'What did Joseph become in Potiphar\'s house?',
          choices: ['Slave only', 'Overseer of the house', 'Prisoner', 'Cook'],
          correctIndex: 1,
          correctFeedback: 'Yes! Overseer — Lord was with him.',
          wrongFeedback: 'Joseph found grace… he made him overseer over his house (Genesis 39:4).'
        },
        {
          question: 'What did Joseph say when tempted?',
          choices: ['Yes please', 'How can I sin against God?', 'I will tell Potiphar', 'I am afraid'],
          correctIndex: 1,
          correctFeedback: 'Right! "How then can I do this great wickedness, and sin against God?"',
          wrongFeedback: 'Joseph said "How then can I do this great wickedness, and sin against God?" (Genesis 39:9).'
        },
        {
          question: 'What happened after Joseph fled?',
          choices: ['He was rewarded', 'He was put in prison', 'He became free', 'He left Egypt'],
          correctIndex: 1,
          correctFeedback: 'Yes! Joseph was put in prison.',
          wrongFeedback: 'Joseph was put into prison (Genesis 39:20).'
        },
        {
          question: 'What did Joseph do for the butler and baker?',
          choices: ['Ignored them', 'Interpreted their dreams', 'Fought them', 'Fed them'],
          correctIndex: 1,
          correctFeedback: 'Yes! Interpreted their dreams.',
          wrongFeedback: 'Joseph interpreted the dreams of the butler and baker (Genesis 40:5–23).'
        },
        {
          question: 'What can we learn from Joseph in prison?',
          choices: ['God abandons us', 'God is with us even in prison', 'Never obey', 'Give up'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God is with us even in prison.',
          wrongFeedback: 'The Lord was with Joseph in prison — gave him favor!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God is with us in prison!',
      takeaway: 'God is with us even in prison — He gives favor.',
      prayer: 'God, thank You for being with me always. Help me trust You. Amen.'
    },

    pharaohDreams: {
      kjvRef: 'Genesis 41',
      paragraphs: [
        'Pharaoh dreamed of seven fat cows eaten by seven lean cows, and seven good ears of corn eaten by seven thin ears.',
        'No one could interpret the dreams. The butler remembered Joseph and told Pharaoh.',
        'Joseph was brought from prison. He said, "It is not in me: God shall give Pharaoh an answer of peace."',
        'Joseph interpreted: seven good years followed by seven years of famine. "Let Pharaoh look out a man discreet and wise."',
        'Pharaoh made Joseph ruler over Egypt — second only to him. Joseph gathered grain in the good years to prepare for famine.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Pharaoh dreaming of fat and lean cows, corn, no text',
        'fun kid illustration: butler remembering Joseph in prison, telling Pharaoh, no text',
        'colorful Bible scene for children: Joseph before Pharaoh, interpreting dreams, no text',
        'exciting cartoon: Pharaoh making Joseph ruler, giving him ring and chain, no text',
        'hopeful ending illustration: Joseph gathering grain in good years, preparing for famine, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Joseph interpreted Pharaoh\'s dreams — became ruler!',
      quizHeading: 'Pharaoh\'s Dreams Questions',
      questions: [
        {
          question: 'What did Pharaoh dream about?',
          choices: ['Cows and corn', 'Ships', 'Gold', 'War'],
          correctIndex: 0,
          correctFeedback: 'Yes! Seven fat cows eaten by seven lean, and corn.',
          wrongFeedback: 'Pharaoh dreamed of seven fat cows eaten by seven lean, and seven good ears eaten by thin ears (Genesis 41:1–7).'
        },
        {
          question: 'Who remembered Joseph?',
          choices: ['Pharaoh', 'The butler', 'The baker', 'Potiphar'],
          correctIndex: 1,
          correctFeedback: 'Right! The butler remembered Joseph.',
          wrongFeedback: 'The chief butler remembered Joseph (Genesis 41:9).'
        },
        {
          question: 'What did Joseph say about interpreting?',
          choices: ['It is easy', 'It is not in me: God shall give Pharaoh an answer', 'I don\'t know', 'Pay me first'],
          correctIndex: 1,
          correctFeedback: 'Yes! "It is not in me: God shall give Pharaoh an answer."',
          wrongFeedback: 'Joseph said "It is not in me: God shall give Pharaoh an answer of peace" (Genesis 41:16).'
        },
        {
          question: 'What did Joseph interpret the dreams to mean?',
          choices: ['Seven good years and seven famine years', 'Seven wars', 'Seven riches', 'Seven kings'],
          correctIndex: 0,
          correctFeedback: 'Right! Seven good years followed by seven famine years.',
          wrongFeedback: 'Seven years of great plenty, then seven years of famine (Genesis 41:25–32).'
        },
        {
          question: 'What can we learn from Pharaoh\'s dreams?',
          choices: ['Dreams are meaningless', 'God gives wisdom to interpret and prepare', 'Never trust dreams', 'Ignore warnings'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God gives wisdom to interpret and prepare.',
          wrongFeedback: 'Joseph interpreted by God\'s wisdom — Egypt prepared for famine!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God gives wisdom!',
      takeaway: 'God gives wisdom to interpret and prepare.',
      prayer: 'God, thank You for wisdom. Help me listen and prepare. Amen.'
    },

    rahabRope: {
      kjvRef: 'Joshua 2',
      paragraphs: [
        'Joshua sent two spies to Jericho. They came to Rahab\'s house. She hid them on the roof under flax.',
        'The king of Jericho sent to Rahab: "Bring forth the men that are come to thee." Rahab said, "They are gone."',
        'Rahab said to the spies, "I know the Lord hath given you the land… make me a true token."',
        'The spies said, "Bind this line of scarlet thread in the window… when we come into the land, thou shalt be spared."',
        'Rahab let them down by a cord through the window. She and her house were spared when Jericho fell.'
      ],
      imagePrompts: [
        'bright cartoon for kids: two spies entering Rahab\'s house in Jericho, no text',
        'fun kid illustration: Rahab hiding spies on roof under flax, no text',
        'colorful Bible scene for children: king\'s men asking for spies, Rahab saying they are gone, no text',
        'exciting cartoon: Rahab binding scarlet cord in window, spies escaping, no text',
        'hopeful ending illustration: Rahab and family safe, walls down, God\'s mercy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Rahab hid the spies — scarlet cord saved her!',
      quizHeading: 'Rahab & the Scarlet Rope Questions',
      questions: [
        {
          question: 'Where did the spies go in Jericho?',
          choices: ['To the king\'s palace', 'To Rahab\'s house', 'To the temple', 'To the market'],
          correctIndex: 1,
          correctFeedback: 'Yes! To Rahab\'s house.',
          wrongFeedback: 'The spies lodged in Rahab\'s house in Jericho (Joshua 2:1).'
        },
        {
          question: 'What did Rahab do with the spies?',
          choices: ['Turned them in', 'Hid them on the roof under flax', 'Ignored them', 'Fought them'],
          correctIndex: 1,
          correctFeedback: 'Right! Hid them on the roof under flax.',
          wrongFeedback: 'Rahab hid them with the stalks of flax upon the roof (Joshua 2:6).'
        },
        {
          question: 'What did Rahab ask for?',
          choices: ['Gold', 'A true token — spare her family', 'Food', 'Weapons'],
          correctIndex: 1,
          correctFeedback: 'Yes! A true token to spare her family.',
          wrongFeedback: 'Rahab said "Make me a true token" (Joshua 2:12).'
        },
        {
          question: 'What did the spies give Rahab?',
          choices: ['A sword', 'A line of scarlet thread for the window', 'A map', 'Money'],
          correctIndex: 1,
          correctFeedback: 'Right! Scarlet thread to bind in the window.',
          wrongFeedback: 'The spies said "Bind this line of scarlet thread in the window" (Joshua 2:18).'
        },
        {
          question: 'What can we learn from Rahab & the scarlet rope?',
          choices: ['Hide spies', 'Faith in God saves — scarlet cord as token', 'Never help strangers', 'Fear kings'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Faith in God saves — scarlet cord as token.',
          wrongFeedback: 'Rahab believed and was spared — scarlet cord marked her house!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — faith saves!',
      takeaway: 'Faith in God saves — the scarlet cord marked her house.',
      prayer: 'God, thank You for saving by faith. Help me trust You. Amen.'
    },

    parableSower: {
      kjvRef: 'Matthew 13:1–23',
      paragraphs: [
        'Jesus sat by the sea and taught in parables. "A sower went forth to sow."',
        'Some seed fell by the way side — fowls devoured it. Some on stony places — sprang up but withered.',
        'Some among thorns — choked. Some on good ground — brought forth fruit, some hundredfold, some sixty, some thirty.',
        'Jesus explained: the seed is the word of the kingdom. The good ground is he that heareth and understandeth.',
        'He that hath ears to hear, let him hear. The parable teaches how people receive God\'s word.'
      ],
      imagePrompts: [
        'bright cartoon for kids: sower scattering seed in a field, no text',
        'fun kid illustration: seed by the way side, birds eating, no text',
        'colorful Bible scene for children: seed on stony ground, plants withering, no text',
        'exciting cartoon: seed among thorns, choked; seed on good ground, fruit, no text',
        'hopeful ending illustration: good soil, hundredfold harvest, people listening, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The sower and the seed — how we receive God\'s word!',
      quizHeading: 'Parable of the Sower Questions',
      questions: [
        {
          question: 'What is the seed in the parable?',
          choices: ['Money', 'The word of the kingdom', 'Birds', 'Thorns'],
          correctIndex: 1,
          correctFeedback: 'Yes! The seed is the word of the kingdom.',
          wrongFeedback: 'The seed is the word of the kingdom (Matthew 13:19).'
        },
        {
          question: 'What happened to seed by the way side?',
          choices: ['Grew tall', 'Fowls devoured it', 'Brought fruit', 'Withered'],
          correctIndex: 1,
          correctFeedback: 'Right! Fowls devoured it.',
          wrongFeedback: 'Some fell by the way side, and the fowls came and devoured them (Matthew 13:4).'
        },
        {
          question: 'What did seed on stony places do?',
          choices: ['Stayed small', 'Sprang up but withered because no root', 'Gave hundredfold', 'Choked'],
          correctIndex: 1,
          correctFeedback: 'Yes! Sprang up quickly but withered.',
          wrongFeedback: 'Some fell upon stony places… they withered away (Matthew 13:5–6).'
        },
        {
          question: 'What did the good ground produce?',
          choices: ['Nothing', 'Fruit — some hundredfold, sixty, thirty', 'Thorns', 'Birds'],
          correctIndex: 1,
          correctFeedback: 'Yes! Fruit — hundredfold, sixty, thirty.',
          wrongFeedback: 'Other fell into good ground, and brought forth fruit (Matthew 13:8).'
        },
        {
          question: 'What can we learn from the sower?',
          choices: ['God\'s word never grows', 'How we receive God\'s word matters — good soil hears and understands', 'Never sow', 'Ignore parables'],
          correctIndex: 1,
          correctFeedback: 'Perfect! How we receive God\'s word matters — good soil hears and understands.',
          wrongFeedback: 'Jesus explained the parable so we would be good soil!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — be good soil!',
      takeaway: 'How we receive God\'s word matters — be good soil.',
      prayer: 'God, help my heart be good soil for Your word. Amen.'
    },

    parableTalents: {
      kjvRef: 'Matthew 25:14–30',
      paragraphs: [
        'The kingdom of heaven is like a man travelling into a far country. He called his servants and delivered his goods.',
        'To one he gave five talents, to another two, to another one — to every man according to his ability.',
        'The five-talent servant traded and gained five more. The two-talent servant gained two more. The one-talent servant dug in the earth and hid his lord\'s money.',
        'The lord returned and reckoned. He said to the faithful servants, "Well done, thou good and faithful servant… enter thou into the joy of thy lord."',
        'To the one-talent servant he said, "Thou wicked and slothful servant… cast ye the unprofitable servant into outer darkness." Use what God gives you!'
      ],
      imagePrompts: [
        'bright cartoon for kids: master giving talents to servants — five, two, one, no text',
        'fun kid illustration: five-talent servant trading and gaining more, no text',
        'colorful Bible scene for children: two-talent servant also gaining more, no text',
        'exciting cartoon: one-talent servant hiding money in ground, no text',
        'hopeful ending illustration: master saying "Well done" to faithful servants, joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Use the talents God gives you — be faithful!',
      quizHeading: 'Parable of the Talents Questions',
      questions: [
        {
          question: 'How many talents did the master give?',
          choices: ['Five to each', 'Five, two, and one', 'Ten to one', 'None'],
          correctIndex: 1,
          correctFeedback: 'Yes! Five, two, and one — according to ability.',
          wrongFeedback: 'To one he gave five talents, to another two, to another one (Matthew 25:15).'
        },
        {
          question: 'What did the five-talent servant do?',
          choices: ['Hid it', 'Traded and gained five more', 'Spent it', 'Gave it away'],
          correctIndex: 1,
          correctFeedback: 'Right! Traded and gained five more.',
          wrongFeedback: 'He that had received five talents went and traded… and gained other five (Matthew 25:16).'
        },
        {
          question: 'What did the one-talent servant do?',
          choices: ['Gained more', 'Hid his lord\'s money in the earth', 'Traded wisely', 'Gave it back'],
          correctIndex: 1,
          correctFeedback: 'Yes! Dug in the earth and hid it.',
          wrongFeedback: 'He that had received one went and digged in the earth, and hid his lord\'s money (Matthew 25:18).'
        },
        {
          question: 'What did the master say to the faithful servants?',
          choices: ['Well done, thou good and faithful servant… enter into the joy of thy lord', 'You are wicked', 'Go away', 'Give back'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Well done… enter thou into the joy of thy lord."',
          wrongFeedback: 'The master said "Well done, thou good and faithful servant… enter thou into the joy of thy lord" (Matthew 25:21).'
        },
        {
          question: 'What can we learn from the parable of the talents?',
          choices: ['Hide what God gives', 'Use and be faithful with what God gives you', 'Never work', 'Be lazy'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Be faithful with what God gives you.',
          wrongFeedback: 'The master rewarded the faithful servants — use your talents!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — be faithful with your talents!',
      takeaway: 'Be faithful with what God gives you — use your talents.',
      prayer: 'God, thank You for what You\'ve given me. Help me use it faithfully. Amen.'
    },

    lostCoin: {
      kjvRef: 'Luke 15:8–10',
      paragraphs: [
        'Jesus said, "What woman having ten pieces of silver, if she lose one piece, doth not light a candle, and sweep the house, and seek diligently till she find it?"',
        'When she hath found it, she calleth her friends and neighbours together, saying, "Rejoice with me; for I have found the piece which I had lost."',
        'Jesus said, "Likewise, I say unto you, there is joy in the presence of the angels of God over one sinner that repenteth."',
        'The lost coin shows how God searches for the lost. One sinner repenting brings joy in heaven.',
        'She sought one coin until she found it—God seeks the lost the same way; heaven rejoices over one sinner that repenteth.'
      ],
      imagePrompts: [
        'bright cartoon for kids: woman with ten silver coins, losing one, no text',
        'fun kid illustration: woman lighting candle, sweeping house, searching diligently, no text',
        'colorful Bible scene for children: woman finding the lost coin, rejoicing, no text',
        'exciting cartoon: woman calling friends and neighbours, "Rejoice with me!", no text',
        'hopeful ending illustration: joy in heaven over one sinner that repenteth, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'God searches for the lost — one sinner repenting brings joy in heaven!',
      quizHeading: 'Lost Coin Questions',
      questions: [
        {
          question: 'How many silver pieces did the woman have?',
          choices: ['One', 'Ten', 'Fifty', 'A hundred'],
          correctIndex: 1,
          correctFeedback: 'Yes! Ten pieces of silver.',
          wrongFeedback: 'What woman having ten pieces of silver… (Luke 15:8).'
        },
        {
          question: 'What did she do when she lost one?',
          choices: ['Gave up', 'Light a candle, sweep the house, seek diligently', 'Buy more', 'Cry'],
          correctIndex: 1,
          correctFeedback: 'Right! Light a candle, sweep, seek diligently.',
          wrongFeedback: 'She lighteth a candle, and sweepeth the house, and seeketh diligently till she find it (Luke 15:8).'
        },
        {
          question: 'What did she say when she found it?',
          choices: ['I am rich', 'Rejoice with me; for I have found the piece which I had lost', 'It was nothing', 'Keep it secret'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Rejoice with me; for I have found the piece which I had lost."',
          wrongFeedback: 'She calleth her friends and neighbours, saying, Rejoice with me (Luke 15:9).'
        },
        {
          question: 'What did Jesus say brings joy in heaven?',
          choices: ['Ninety-nine who need no repentance', 'One sinner that repenteth', 'Money', 'Parties'],
          correctIndex: 1,
          correctFeedback: 'Yes! One sinner that repenteth.',
          wrongFeedback: 'There is joy in the presence of the angels of God over one sinner that repenteth (Luke 15:10).'
        },
        {
          question: 'What can we learn from the lost coin?',
          choices: ['God doesn\'t search', 'God searches for the lost — one repentant sinner brings joy in heaven', 'Never lose anything', 'Hide coins'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God searches for the lost — one repentant sinner brings joy.',
          wrongFeedback: 'The woman searched until she found it — God rejoices when one returns!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God rejoices over the lost!',
      takeaway: 'God searches for the lost — one repentant sinner brings joy in heaven.',
      prayer: 'God, thank You for searching for me. Help me return to You. Amen.'
    },

    persistentWidow: {
      kjvRef: 'Luke 18:1–8',
      paragraphs: [
        'Jesus spake a parable to teach that men ought always to pray, and not to faint.',
        'There was a judge in a city who feared not God, neither regarded man. A widow came to him saying, "Avenge me of mine adversary."',
        'For a while he would not. But afterward he said, "Though I fear not God, nor regard man, yet because this widow troubleth me, I will avenge her."',
        'Jesus said, "Hear what the unjust judge saith. Shall not God avenge his own elect, which cry day and night unto him?"',
        'God will avenge speedily. Nevertheless when the Son of man cometh, shall he find faith on the earth?'
      ],
      imagePrompts: [
        'bright cartoon for kids: widow going to unjust judge again and again, no text',
        'fun kid illustration: judge saying "I will avenge her because she troubleth me", no text',
        'colorful Bible scene for children: widow crying "Avenge me!", judge finally listening, no text',
        'exciting cartoon: God hearing His elect who cry day and night, no text',
        'hopeful ending illustration: Jesus asking "Shall he find faith on the earth?", people praying, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The persistent widow — keep praying and don\'t faint!',
      quizHeading: 'Persistent Widow Questions',
      questions: [
        {
          question: 'Why did Jesus tell the parable?',
          choices: ['To teach men ought always to pray, and not to faint', 'To teach giving up', 'To teach money', 'To teach fighting'],
          correctIndex: 0,
          correctFeedback: 'Yes! Men ought always to pray, and not to faint.',
          wrongFeedback: 'Jesus spake a parable to this end, that men ought always to pray, and not to faint (Luke 18:1).'
        },
        {
          question: 'What kind of judge was in the city?',
          choices: ['A good judge', 'One who feared not God, neither regarded man', 'A kind man', 'A priest'],
          correctIndex: 1,
          correctFeedback: 'Right! He feared not God, neither regarded man.',
          wrongFeedback: 'There was in a city a judge, which feared not God, neither regarded man (Luke 18:2).'
        },
        {
          question: 'What did the widow keep saying?',
          choices: ['Give me money', 'Avenge me of mine adversary', 'Leave me alone', 'Help others'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Avenge me of mine adversary."',
          wrongFeedback: 'The widow came unto him, saying, Avenge me of mine adversary (Luke 18:3).'
        },
        {
          question: 'Why did the judge finally help her?',
          choices: ['He liked her', 'Because she troubleth me', 'He feared God', 'She paid him'],
          correctIndex: 1,
          correctFeedback: 'Yes! Because she troubleth me.',
          wrongFeedback: 'He said "Because this widow troubleth me, I will avenge her" (Luke 18:5).'
        },
        {
          question: 'What can we learn from the persistent widow?',
          choices: ['Give up praying', 'Keep praying and don\'t faint — God will answer', 'Never ask', 'Pray once'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Keep praying and don\'t faint — God will answer.',
          wrongFeedback: 'Jesus taught men ought always to pray, and not to faint!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — keep praying!',
      takeaway: 'Keep praying and don\'t faint — God will answer.',
      prayer: 'God, help me keep praying and not faint. Thank You for hearing me. Amen.'
    },

    richYoungRuler: {
      kjvRef: 'Matthew 19:16–22',
      paragraphs: [
        'A young man came to Jesus and asked, "Good Master, what good thing shall I do, that I may have eternal life?"',
        'Jesus said, "Keep the commandments." The young man said, "All these have I kept from my youth up: what lack I yet?"',
        'Jesus said, "If thou wilt be perfect, go and sell that thou hast, and give to the poor… and come and follow me."',
        'The young man went away sorrowful — he had great possessions.',
        'Jesus said, "It is easier for a camel to go through the eye of a needle, than for a rich man to enter into the kingdom of God."'
      ],
      imagePrompts: [
        'bright cartoon for kids: young man asking Jesus "What good thing shall I do?", no text',
        'fun kid illustration: Jesus saying "Keep the commandments", young man saying he has, no text',
        'colorful Bible scene for children: Jesus saying "Sell that thou hast, and give to the poor", no text',
        'exciting cartoon: young man going away sorrowful, great possessions, no text',
        'hopeful ending illustration: Jesus saying camel through needle\'s eye, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The rich young ruler — what lack I yet?',
      quizHeading: 'Rich Young Ruler Questions',
      questions: [
        {
          question: 'What did the young man ask Jesus?',
          choices: ['How to be rich', 'What good thing shall I do to have eternal life?', 'Who are you?', 'Give me money'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Good Master, what good thing shall I do, that I may have eternal life?"',
          wrongFeedback: 'The young man asked "Good Master, what good thing shall I do, that I may have eternal life?" (Matthew 19:16).'
        },
        {
          question: 'What did Jesus tell him first?',
          choices: ['Sell everything', 'Keep the commandments', 'Pray more', 'Give to the poor'],
          correctIndex: 1,
          correctFeedback: 'Right! "Keep the commandments."',
          wrongFeedback: 'Jesus said "If thou wilt enter into life, keep the commandments" (Matthew 19:17).'
        },
        {
          question: 'What did the young man say he had done?',
          choices: ['Nothing', 'All these have I kept from my youth up', 'Broken them', 'Ignored them'],
          correctIndex: 1,
          correctFeedback: 'Yes! "All these have I kept from my youth up."',
          wrongFeedback: 'The young man said "All these things have I kept from my youth up" (Matthew 19:20).'
        },
        {
          question: 'What did Jesus tell him to do next?',
          choices: ['Stay rich', 'Sell that thou hast, give to the poor, and follow me', 'Do nothing', 'Pray only'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Sell that thou hast… and come and follow me."',
          wrongFeedback: 'Jesus said "If thou wilt be perfect, go and sell that thou hast… and come and follow me" (Matthew 19:21).'
        },
        {
          question: 'What can we learn from the rich young ruler?',
          choices: ['Riches are everything', 'Following Jesus may cost us our possessions', 'Never ask Jesus', 'Keep everything'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Following Jesus may cost us our possessions.',
          wrongFeedback: 'The young man went away sorrowful because he had great possessions (Matthew 19:22).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — follow Jesus!',
      takeaway: 'Following Jesus may cost us our possessions — choose Him.',
      prayer: 'Jesus, help me follow You above everything. Amen.'
    },

    palmSunday: {
      kjvRef: 'Matthew 21:1–11; Mark 11:1–11; Luke 19:28–44; John 12:12–19',
      paragraphs: [
        'Jesus sent two disciples to fetch a colt. "Go into the village… ye shall find an ass tied, and a colt with her."',
        'They brought the colt. The disciples cast their garments on it; Jesus sat thereon.',
        'A very great multitude spread their garments in the way; others cut down branches from the trees and strawed them in the way.',
        'The multitudes cried, "Hosanna to the Son of David! Blessed is he that cometh in the name of the Lord!"',
        'The whole city was moved. They said, "This is Jesus the prophet of Nazareth of Galilee."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus sending disciples for the colt, no text',
        'fun kid illustration: disciples bringing colt, casting garments on it, Jesus riding, no text',
        'colorful Bible scene for children: multitude spreading garments and branches in the way, no text',
        'exciting cartoon: crowds crying "Hosanna to the Son of David!", waving branches, no text',
        'hopeful ending illustration: whole city moved, "This is Jesus the prophet", no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus enters Jerusalem on Palm Sunday — Hosanna!',
      quizHeading: 'Palm Sunday Questions',
      questions: [
        {
          question: 'What did Jesus send disciples to fetch?',
          choices: ['A horse', 'A colt (young donkey)', 'A camel', 'A chariot'],
          correctIndex: 1,
          correctFeedback: 'Yes! A colt — an ass tied, and a colt with her.',
          wrongFeedback: 'Jesus said "Ye shall find an ass tied, and a colt with her" (Matthew 21:2).'
        },
        {
          question: 'What did the disciples do with their garments?',
          choices: ['Threw them away', 'Cast them on the colt for Jesus to sit', 'Wore them', 'Gave to poor'],
          correctIndex: 1,
          correctFeedback: 'Right! Cast garments on the colt.',
          wrongFeedback: 'They cast their garments upon the colt (Matthew 21:7).'
        },
        {
          question: 'What did the multitude spread in the way?',
          choices: ['Gold', 'Their garments and branches from trees', 'Food', 'Water'],
          correctIndex: 1,
          correctFeedback: 'Yes! Garments and branches from trees.',
          wrongFeedback: 'A very great multitude spread their garments in the way; others cut down branches (Matthew 21:8).'
        },
        {
          question: 'What did the crowds cry?',
          choices: ['Hosanna to the Son of David!', 'Crucify him!', 'Who is this?', 'Go away'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Hosanna to the Son of David!"',
          wrongFeedback: 'The multitudes cried "Hosanna to the Son of David!" (Matthew 21:9).'
        },
        {
          question: 'What can we learn from Palm Sunday?',
          choices: ['Jesus is not king', 'Jesus enters as King — people praise Him', 'Never shout', 'Fear crowds'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus enters as King — people praise Him.',
          wrongFeedback: 'The city was moved — "This is Jesus the prophet of Nazareth of Galilee" (Matthew 21:10–11).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Hosanna!',
      takeaway: 'Jesus enters as King — people praise Him.',
      prayer: 'Jesus, thank You for coming as King. Help me praise You. Amen.'
    },

    lastSupper: {
      kjvRef: 'Matthew 26:17–30; Mark 14:12–26; Luke 22:7–23',
      paragraphs: [
        'The disciples asked, "Where wilt thou that we prepare for thee to eat the passover?" Jesus said, "Go into the city to such a man, and say, The Master saith, My time is at hand."',
        'They prepared the passover. Jesus sat down with the twelve. He took bread, blessed it, broke it, and said, "Take, eat; this is my body."',
        'He took the cup, gave thanks, and gave it to them, saying, "Drink ye all of it; For this is my blood of the new testament, which is shed for many for the remission of sins."',
        'Jesus said, "One of you shall betray me." They were exceeding sorrowful. Judas said, "Master, is it I?" Jesus said, "Thou hast said."',
        'After the supper they sang an hymn and went out to the mount of Olives. Jesus instituted the Lord\'s Supper.'
      ],
      imagePrompts: [
        'bright cartoon for kids: disciples preparing passover, asking Jesus where, no text',
        'fun kid illustration: Jesus at table with twelve, taking bread, blessing it, no text',
        'colorful Bible scene for children: Jesus taking cup, "This is my blood", no text',
        'exciting cartoon: Jesus saying "One of you shall betray me", disciples sorrowful, no text',
        'hopeful ending illustration: singing hymn, going to Mount of Olives, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The Last Supper — Jesus institutes the Lord\'s Supper!',
      quizHeading: 'Last Supper Questions',
      questions: [
        {
          question: 'What did the disciples ask Jesus?',
          choices: ['Where to eat?', 'Where wilt thou that we prepare for thee to eat the passover?', 'When to eat?', 'What to eat?'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Where wilt thou that we prepare for thee to eat the passover?"',
          wrongFeedback: 'The disciples asked "Where wilt thou that we prepare for thee to eat the passover?" (Matthew 26:17).'
        },
        {
          question: 'What did Jesus say about the bread?',
          choices: ['Throw it away', 'Take, eat; this is my body', 'Give it to poor', 'Break it later'],
          correctIndex: 1,
          correctFeedback: 'Right! "Take, eat; this is my body."',
          wrongFeedback: 'Jesus took bread, blessed it, broke it, and said "Take, eat; this is my body" (Matthew 26:26).'
        },
        {
          question: 'What did Jesus say about the cup?',
          choices: ['Drink later', 'This is my blood of the new testament', 'Pour it out', 'Share with Judas'],
          correctIndex: 1,
          correctFeedback: 'Yes! "This is my blood of the new testament."',
          wrongFeedback: 'He took the cup… "Drink ye all of it; For this is my blood of the new testament" (Matthew 26:27–28).'
        },
        {
          question: 'What did Jesus say about betrayal?',
          choices: ['One of you shall betray me', 'All will betray me', 'No one will', 'Judas is innocent'],
          correctIndex: 0,
          correctFeedback: 'Yes! "One of you shall betray me."',
          wrongFeedback: 'Jesus said "One of you shall betray me" (Matthew 26:21).'
        },
        {
          question: 'What can we learn from the Last Supper?',
          choices: ['Never eat bread', 'Jesus gave His body and blood for us', 'Forget communion', 'Betray friends'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus gave His body and blood for us.',
          wrongFeedback: 'Jesus instituted the Lord\'s Supper — remembrance of His sacrifice!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — remember Jesus\' sacrifice!',
      takeaway: 'Jesus gave His body and blood for us — remember the Lord\'s Supper.',
      prayer: 'Jesus, thank You for Your body and blood. Help me remember You. Amen.'
    },

    trial: {
      kjvRef: 'Matthew 26:57–68; 27:11–26; Mark 14:53–65; 15:1–15; Luke 22:66–23:25; John 18:28–19:16',
      paragraphs: [
        'They led Jesus to Caiaphas the high priest. The scribes and elders sought false witness against Him.',
        'False witnesses came. Jesus held his peace. The high priest said, "Answerest thou nothing?" Jesus said, "Thou hast said."',
        'Before Pilate, Jesus said, "My kingdom is not of this world." Pilate said, "Art thou a king then?" Jesus said, "Thou sayest that I am a king."',
        'Pilate found no fault in Him. The crowd cried "Crucify him!" Pilate washed his hands and delivered Jesus to be crucified.',
        'Jesus was tried and condemned — He stood silent before His accusers.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus led to Caiaphas, false witnesses speaking, no text',
        'fun kid illustration: high priest asking "Answerest thou nothing?", Jesus silent, no text',
        'colorful Bible scene for children: Jesus before Pilate, "My kingdom is not of this world", no text',
        'cartoon for kids: worried Pilate, tense crowd, Pilate washing hands, calm colors, no text',
        'hopeful ending illustration: Jesus condemned, standing silent, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus tried and condemned — He stood silent!',
      quizHeading: 'Jesus\' Trial Questions',
      questions: [
        {
          question: 'Where was Jesus led first?',
          choices: ['To Pilate', 'To Caiaphas the high priest', 'To Herod', 'To the crowd'],
          correctIndex: 1,
          correctFeedback: 'Yes! To Caiaphas the high priest.',
          wrongFeedback: 'They led Him away to Caiaphas the high priest (Matthew 26:57).'
        },
        {
          question: 'What did false witnesses do?',
          choices: ['Told truth', 'Sought false witness against Jesus', 'Helped Jesus', 'Prayed'],
          correctIndex: 1,
          correctFeedback: 'Right! Sought false witness.',
          wrongFeedback: 'The scribes and elders sought false witness against Jesus (Matthew 26:59).'
        },
        {
          question: 'What did Jesus say before Pilate?',
          choices: ['My kingdom is not of this world', 'I am guilty', 'Crucify me', 'Free Barabbas'],
          correctIndex: 0,
          correctFeedback: 'Yes! "My kingdom is not of this world."',
          wrongFeedback: 'Jesus answered "My kingdom is not of this world" (John 18:36).'
        },
        {
          question: 'What did Pilate do?',
          choices: ['Freed Jesus', 'Washed his hands and delivered Him to be crucified', 'Fought the crowd', 'Prayed'],
          correctIndex: 1,
          correctFeedback: 'Yes! Washed hands and delivered Him.',
          wrongFeedback: 'Pilate washed his hands and delivered Jesus to be crucified (Matthew 27:24–26).'
        },
        {
          question: 'What can we learn from Jesus\' trial?',
          choices: ['Jesus was guilty', 'Jesus stood silent and innocent', 'Never stand trial', 'Blame others'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus stood silent and innocent.',
          wrongFeedback: 'Jesus was tried and condemned — innocent, yet He paid the price!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus stood innocent!',
      takeaway: 'Jesus stood silent and innocent — He paid the price for us.',
      prayer: 'Jesus, thank You for standing for me. Help me stand for You. Amen.'
    },

    roadToEmmaus: {
      kjvRef: 'Luke 24:13–35',
      paragraphs: [
        'Two disciples went to Emmaus, talking about Jesus\' death. Jesus drew near but their eyes were holden.',
        'Jesus asked, "What manner of communications are these?" They said, "Jesus of Nazareth was crucified."',
        'Jesus said, "O fools, and slow of heart to believe all that the prophets have spoken." He expounded the scriptures.',
        'They said, "Abide with us." At meat, Jesus took bread, blessed, brake, and gave it. Their eyes were opened — He vanished.',
        'They said, "Did not our heart burn within us?" They returned to Jerusalem and told the eleven.'
      ],
      imagePrompts: [
        'bright cartoon for kids: two disciples walking to Emmaus, Jesus joining them, no text',
        'fun kid illustration: Jesus asking "What communications are these?", disciples sad, no text',
        'colorful Bible scene for children: Jesus expounding scriptures, hearts burning, no text',
        'exciting cartoon: Jesus breaking bread, eyes opened, Jesus vanishes, no text',
        'hopeful ending illustration: disciples returning to Jerusalem, telling the eleven, joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus walked with disciples on Emmaus road — hearts burned!',
      quizHeading: 'Road to Emmaus Questions',
      questions: [
        {
          question: 'Where were the two disciples going?',
          choices: ['Jerusalem', 'Emmaus', 'Galilee', 'Bethlehem'],
          correctIndex: 1,
          correctFeedback: 'Yes! To Emmaus.',
          wrongFeedback: 'Two of them went that same day to a village called Emmaus (Luke 24:13).'
        },
        {
          question: 'Why were they sad?',
          choices: ['Lost money', 'Jesus was crucified', 'Hungry', 'Rained'],
          correctIndex: 1,
          correctFeedback: 'Right! Jesus was crucified — hoped He would redeem Israel.',
          wrongFeedback: 'They were sad because Jesus was crucified (Luke 24:17–21).'
        },
        {
          question: 'What did Jesus say to them?',
          choices: ['O fools, slow of heart to believe', 'You are wise', 'Go home', 'Be quiet'],
          correctIndex: 0,
          correctFeedback: 'Yes! "O fools, and slow of heart to believe all that the prophets have spoken."',
          wrongFeedback: 'Jesus said "O fools, and slow of heart to believe" (Luke 24:25).'
        },
        {
          question: 'When were their eyes opened?',
          choices: ['On the road', 'When He broke bread', 'When He left', 'Never'],
          correctIndex: 1,
          correctFeedback: 'Yes! At supper, when He broke bread.',
          wrongFeedback: 'Their eyes were opened when He took bread, blessed, and brake it (Luke 24:30–31).'
        },
        {
          question: 'What can we learn from Emmaus road?',
          choices: ['Jesus is not known', 'Jesus is known in breaking of bread — hearts burn', 'Never walk with strangers', 'Forget scriptures'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus is known in breaking of bread — hearts burn.',
          wrongFeedback: 'They said "Did not our heart burn within us… while he opened the scriptures?" (Luke 24:32).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — hearts burn with Jesus!',
      takeaway: 'Jesus is known in breaking of bread — hearts burn when He opens the scriptures.',
      prayer: 'Jesus, thank You for walking with us. Open the scriptures to our hearts. Amen.'
    },

    resurrection: {
      kjvRef: 'Matthew 28:1–10; Mark 16:1–8; Luke 24:1–12; John 20:1–18',
      paragraphs: [
        'Very early in the morning the first day of the week, women came to the sepulchre with spices.',
        'The stone was rolled away. An angel said, "Fear not ye: for I know that ye seek Jesus, which was crucified. He is not here: for he is risen."',
        'The angel said, "Go quickly, and tell his disciples that he is risen from the dead."',
        'Jesus met them and said, "All hail." They came and held him by the feet and worshipped him.',
        'Jesus said, "Be not afraid: go tell my brethren that they go into Galilee, and there shall they see me."'
      ],
      imagePrompts: [
        'bright cartoon for kids: women coming to tomb early morning with spices, no text',
        'fun kid illustration: stone rolled away, angel saying "He is not here: for he is risen", no text',
        'colorful Bible scene for children: angel telling women "Go quickly, tell disciples", no text',
        'exciting cartoon: Jesus meeting women, "All hail", they worship, no text',
        'hopeful ending illustration: Jesus saying "Go tell my brethren", joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus is risen — He is not here!',
      quizHeading: 'Resurrection Questions',
      questions: [
        {
          question: 'When did the women come to the tomb?',
          choices: ['Night', 'Very early in the morning the first day of the week', 'Afternoon', 'Next week'],
          correctIndex: 1,
          correctFeedback: 'Yes! Very early the first day of the week.',
          wrongFeedback: 'Very early in the morning the first day of the week (Matthew 28:1).'
        },
        {
          question: 'What did the angel say?',
          choices: ['Jesus is dead', 'He is not here: for he is risen', 'Stay here', 'Fear greatly'],
          correctIndex: 1,
          correctFeedback: 'Yes! "He is not here: for he is risen."',
          wrongFeedback: 'The angel said "He is not here: for he is risen" (Matthew 28:6).'
        },
        {
          question: 'What did the angel tell the women to do?',
          choices: ['Stay silent', 'Go quickly, tell disciples he is risen', 'Go home', 'Pray'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Go quickly, and tell his disciples that he is risen."',
          wrongFeedback: 'The angel said "Go quickly, and tell his disciples that he is risen from the dead" (Matthew 28:7).'
        },
        {
          question: 'What did Jesus say when He met them?',
          choices: ['Go away', 'All hail', 'Fear me', 'I am gone'],
          correctIndex: 1,
          correctFeedback: 'Yes! "All hail."',
          wrongFeedback: 'Jesus met them and said "All hail" (Matthew 28:9).'
        },
        {
          question: 'What can we learn from the resurrection?',
          choices: ['Jesus is dead', 'Jesus is risen — death is defeated', 'Never believe', 'Fear tomb'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus is risen — death is defeated.',
          wrongFeedback: 'The tomb was empty — Jesus is risen!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is risen!',
      takeaway: 'Jesus is risen — death is defeated.',
      prayer: 'Jesus, thank You for rising again. Help me believe and share the good news. Amen.'
    },

    jesusTempt: {
      kjvRef: 'Matthew 4:1–11',
      paragraphs: [
        'Jesus was led up of the Spirit into the wilderness to be tempted of the devil. He fasted forty days and forty nights.',
        'The tempter came and said, "If thou be the Son of God, command that these stones be made bread." Jesus answered, "It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God."',
        'The devil took Him to the holy city and set Him on a pinnacle of the temple, saying, "Cast thyself down." Jesus said, "It is written again, Thou shalt not tempt the Lord thy God."',
        'The devil took Him to an exceeding high mountain and shewed Him all the kingdoms of the world, saying, "All these things will I give thee, if thou wilt fall down and worship me."',
        'Jesus said, "Get thee hence, Satan: for it is written, Thou shalt worship the Lord thy God, and him only shalt thou serve." The devil left Him, and angels came and ministered unto Him.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus fasting in the wilderness forty days, no text',
        'fun kid illustration: tempter saying "Command these stones be bread", Jesus quoting Scripture, no text',
        'colorful Bible scene for children: devil on pinnacle of temple, "Cast thyself down", Jesus replying, no text',
        'exciting cartoon: devil showing kingdoms of world, "Fall down and worship me", Jesus saying "Get thee hence, Satan", no text',
        'hopeful ending illustration: angels ministering to Jesus after temptation, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus was tempted — He answered with Scripture!',
      quizHeading: 'Jesus Tempted in Wilderness Questions',
      questions: [
        {
          question: 'Where was Jesus led to be tempted?',
          choices: ['To a city', 'Into the wilderness', 'To the temple', 'To a mountain only'],
          correctIndex: 1,
          correctFeedback: 'Yes! Into the wilderness.',
          wrongFeedback: 'Jesus was led up of the Spirit into the wilderness to be tempted (Matthew 4:1).'
        },
        {
          question: 'How long did Jesus fast?',
          choices: ['Seven days', 'Forty days and forty nights', 'One day', 'Three days'],
          correctIndex: 1,
          correctFeedback: 'Right! Forty days and forty nights.',
          wrongFeedback: 'He fasted forty days and forty nights (Matthew 4:2).'
        },
        {
          question: 'What did Jesus answer to the first temptation?',
          choices: ['Make bread', 'Man shall not live by bread alone, but by every word of God', 'I will do it', 'Silence'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God."',
          wrongFeedback: 'Jesus answered "It is written, Man shall not live by bread alone…" (Matthew 4:4).'
        },
        {
          question: 'What did Jesus say to the devil on the temple pinnacle?',
          choices: ['Jump', 'Thou shalt not tempt the Lord thy God', 'I will jump', 'Show me more'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Thou shalt not tempt the Lord thy God."',
          wrongFeedback: 'Jesus said "It is written again, Thou shalt not tempt the Lord thy God" (Matthew 4:7).'
        },
        {
          question: 'What can we learn from Jesus\' temptation?',
          choices: ['Give in to temptation', 'Answer temptation with Scripture', 'Never fast', 'Doubt God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Answer temptation with Scripture.',
          wrongFeedback: 'Jesus used God\'s Word to defeat temptation — we can too!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — answer with Scripture!',
      takeaway: 'Answer temptation with Scripture — Jesus shows us how.',
      prayer: 'Jesus, thank You for overcoming temptation. Help me use Your Word. Amen.'
    },

    weddingWine: {
      kjvRef: 'John 2:1–11',
      paragraphs: [
        'There was a marriage in Cana of Galilee. The mother of Jesus was there. Jesus and His disciples were called also.',
        'They wanted wine. Jesus\' mother said, "They have no wine." Jesus said, "Woman, what have I to do with thee? mine hour is not yet come."',
        'His mother said to the servants, "Whatsoever he saith unto you, do it." There were six waterpots of stone.',
        'Jesus said, "Fill the waterpots with water." They filled them to the brim. Jesus said, "Draw out now, and bear unto the governor of the feast."',
        'The water was made wine. The governor tasted it and said, "Thou hast kept the good wine until now." This beginning of miracles manifested forth his glory.'
      ],
      imagePrompts: [
        'bright cartoon for kids: wedding in Cana, Jesus and disciples invited, no text',
        'fun kid illustration: Mary saying "They have no wine", Jesus replying, no text',
        'colorful Bible scene for children: Mary telling servants "Whatsoever he saith unto you, do it", no text',
        'exciting cartoon: Jesus saying "Fill the waterpots", servants filling, no text',
        'hopeful ending illustration: water made wine, governor tasting, joy at wedding, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus turns water into wine — first miracle!',
      quizHeading: 'Water into Wine Questions',
      questions: [
        {
          question: 'Where was the marriage?',
          choices: ['Jerusalem', 'Cana of Galilee', 'Bethlehem', 'Nazareth'],
          correctIndex: 1,
          correctFeedback: 'Yes! In Cana of Galilee.',
          wrongFeedback: 'There was a marriage in Cana of Galilee (John 2:1).'
        },
        {
          question: 'What did Mary say to Jesus?',
          choices: ['They have plenty', 'They have no wine', 'They have water', 'They have food'],
          correctIndex: 1,
          correctFeedback: 'Right! "They have no wine."',
          wrongFeedback: 'Mary said "They have no wine" (John 2:3).'
        },
        {
          question: 'What did Jesus say to the servants?',
          choices: ['Do nothing', 'Fill the waterpots with water', 'Pour out', 'Buy wine'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Fill the waterpots with water."',
          wrongFeedback: 'Jesus saith unto them "Fill the waterpots with water" (John 2:7).'
        },
        {
          question: 'What did the water become?',
          choices: ['More water', 'Wine', 'Juice', 'Milk'],
          correctIndex: 1,
          correctFeedback: 'Yes! The water was made wine.',
          wrongFeedback: 'The water was made wine (John 2:9).'
        },
        {
          question: 'What can we learn from water into wine?',
          choices: ['Jesus does no miracles', 'Jesus\' first miracle shows His glory', 'Never attend weddings', 'Doubt Jesus'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus\' first miracle manifested His glory.',
          wrongFeedback: 'This beginning of miracles manifested forth his glory (John 2:11).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus\' first miracle!',
      takeaway: 'Jesus\' first miracle shows His glory — trust Him.',
      prayer: 'Jesus, thank You for Your miracles. Help me trust You. Amen.'
    },

    healBlind: {
      kjvRef: 'John 9',
      paragraphs: [
        'Jesus saw a man blind from birth. The disciples asked, "Who did sin, this man, or his parents?" Jesus said, "Neither… that the works of God should be made manifest in him."',
        'Jesus spat on the ground, made clay, anointed the eyes of the blind man, and said, "Go, wash in the pool of Siloam."',
        'The man went and washed, and came seeing. The neighbours said, "Is not this he that sat and begged?"',
        'The Pharisees asked how he received sight. He said, "A man called Jesus made clay, anointed mine eyes, and said unto me, Go to the pool of Siloam, and wash."',
        'The man said, "One thing I know, that, whereas I was blind, now I see." Jesus found him and said, "Dost thou believe on the Son of God?" He said, "Lord, I believe."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus seeing blind man from birth, disciples asking who sinned, no text',
        'fun kid illustration: Jesus making clay with spit, anointing blind man\'s eyes, no text',
        'colorful Bible scene for children: blind man washing in pool of Siloam, coming seeing, no text',
        'exciting cartoon: neighbours asking "Is not this he?", man saying "I was blind, now I see", no text',
        'hopeful ending illustration: Jesus finding man, "Dost thou believe?", man saying "Lord, I believe", no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus healed a man born blind — "Now I see!"',
      quizHeading: 'Jesus Heals Blind Man Questions',
      questions: [
        {
          question: 'What did the disciples ask Jesus?',
          choices: ['Who is blind?', 'Who did sin, this man or his parents?', 'Why heal him?', 'How to heal?'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Who did sin, this man, or his parents?"',
          wrongFeedback: 'Disciples asked "Master, who did sin, this man, or his parents?" (John 9:2).'
        },
        {
          question: 'What did Jesus say about the blindness?',
          choices: ['Punishment', 'Neither… that the works of God should be made manifest', 'His fault', 'Parents\' fault'],
          correctIndex: 1,
          correctFeedback: 'Right! "Neither… that the works of God should be made manifest in him."',
          wrongFeedback: 'Jesus answered "Neither hath this man sinned, nor his parents: but that the works of God should be made manifest" (John 9:3).'
        },
        {
          question: 'What did Jesus do to the blind man\'s eyes?',
          choices: ['Prayed only', 'Made clay of spittle, anointed his eyes', 'Washed them', 'Covered them'],
          correctIndex: 1,
          correctFeedback: 'Yes! Made clay of spittle, anointed his eyes.',
          wrongFeedback: 'He spat on the ground, made clay, anointed the eyes (John 9:6).'
        },
        {
          question: 'Where did Jesus tell him to go?',
          choices: ['To the temple', 'To the pool of Siloam and wash', 'To his home', 'To the river'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Go, wash in the pool of Siloam."',
          wrongFeedback: 'Jesus said "Go, wash in the pool of Siloam" (John 9:7).'
        },
        {
          question: 'What can we learn from Jesus healing the blind man?',
          choices: ['Jesus can\'t heal', 'Jesus heals and reveals God\'s works', 'Never ask questions', 'Doubt miracles'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus heals and reveals God\'s works.',
          wrongFeedback: 'The man said "One thing I know, that, whereas I was blind, now I see" (John 9:25).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus heals!',
      takeaway: 'Jesus heals and reveals God\'s works — "Now I see!"',
      prayer: 'Jesus, thank You for healing. Open my eyes to see You. Amen.'
    },

    jairus: {
      kjvRef: 'Mark 5:21–43',
      paragraphs: [
        'Jairus, a ruler of the synagogue, came to Jesus and said, "My little daughter lieth at the point of death: I pray thee, come and lay thy hands on her."',
        'Jesus went with him. A woman with an issue of blood touched His garment and was healed. Jesus said, "Who touched me?"',
        'Messengers came from Jairus\' house: "Thy daughter is dead." Jesus said, "Be not afraid, only believe."',
        'Jesus took Peter, James, John, the father and mother into the room. He said, "Talitha cumi" — "Damsel, I say unto thee, arise."',
        'The damsel arose and walked. They were astonished with great astonishment. Jesus commanded they give her meat.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jairus begging Jesus to heal his daughter, no text',
        'fun kid illustration: woman touching Jesus\' garment, healed, no text',
        'colorful Bible scene for children: messengers saying "Thy daughter is dead", Jesus saying "Only believe", no text',
        'exciting cartoon: Jesus saying "Talitha cumi", girl arising, no text',
        'hopeful ending illustration: girl walking, parents astonished, Jesus commanding give her meat, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus raised Jairus\' daughter — "Only believe!"',
      quizHeading: 'Jairus\' Daughter Questions',
      questions: [
        {
          question: 'Who came to Jesus?',
          choices: ['A leper', 'Jairus, ruler of synagogue', 'A blind man', 'A centurion'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jairus, a ruler of the synagogue.',
          wrongFeedback: 'There came a ruler of the synagogue, Jairus (Mark 5:22).'
        },
        {
          question: 'What did Jairus ask Jesus?',
          choices: ['Heal me', 'Come and lay thy hands on my daughter', 'Give me money', 'Teach me'],
          correctIndex: 1,
          correctFeedback: 'Right! "Come and lay thy hands on her."',
          wrongFeedback: 'Jairus said "My little daughter lieth at the point of death… come and lay thy hands on her" (Mark 5:23).'
        },
        {
          question: 'What did Jesus say when messengers came?',
          choices: ['Too late', 'Be not afraid, only believe', 'Go home', 'Pray more'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Be not afraid, only believe."',
          wrongFeedback: 'Jesus said "Be not afraid, only believe" (Mark 5:36).'
        },
        {
          question: 'What did Jesus say to the girl?',
          choices: ['Sleep', 'Talitha cumi — Damsel, arise', 'Be quiet', 'Wake up'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Talitha cumi" — Damsel, arise.',
          wrongFeedback: 'Jesus took her by the hand, and said "Talitha cumi" (Mark 5:41).'
        },
        {
          question: 'What can we learn from Jairus\' daughter?',
          choices: ['Jesus can\'t raise dead', 'Only believe — Jesus has power over death', 'Never ask Jesus', 'Fear death'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Only believe — Jesus has power over death.',
          wrongFeedback: 'Jesus raised the girl — "Be not afraid, only believe."'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — only believe!',
      takeaway: 'Only believe — Jesus has power over death.',
      prayer: 'Jesus, thank You for Your power. Help me believe. Amen.'
    },

    transfigure: {
      kjvRef: 'Matthew 17:1–13',
      paragraphs: [
        'Jesus took Peter, James, and John up a high mountain. He was transfigured before them — His face shone as the sun, raiment white as light.',
        'Moses and Elias appeared talking with Jesus. Peter said, "Lord, it is good for us to be here… let us make three tabernacles."',
        'A bright cloud overshadowed them. A voice from the cloud said, "This is my beloved Son, in whom I am well pleased; hear ye him."',
        'The disciples fell on their faces and were sore afraid. Jesus came and touched them, saying, "Arise, and be not afraid."',
        'They saw no man save Jesus only. Jesus charged them to tell no man until the Son of man be risen again from the dead.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus taking Peter, James, John up high mountain, no text',
        'fun kid illustration: Jesus transfigured, face shining, raiment white, Moses and Elias, no text',
        'colorful Bible scene for children: bright cloud, voice saying "This is my beloved Son", no text',
        'exciting cartoon: disciples falling on faces, afraid, Jesus touching them, no text',
        'hopeful ending illustration: Jesus only, disciples seeing Him, charged to tell no man yet, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus transfigured — "This is my beloved Son!"',
      quizHeading: 'Transfiguration Questions',
      questions: [
        {
          question: 'Who did Jesus take up the mountain?',
          choices: ['All disciples', 'Peter, James, and John', 'The crowd', 'Moses and Elias'],
          correctIndex: 1,
          correctFeedback: 'Yes! Peter, James, and John.',
          wrongFeedback: 'Jesus took Peter, James, and John (Matthew 17:1).'
        },
        {
          question: 'What happened to Jesus?',
          choices: ['He slept', 'He was transfigured — face shone, raiment white', 'He left', 'He prayed only'],
          correctIndex: 1,
          correctFeedback: 'Right! Transfigured — face shone as sun, raiment white as light.',
          wrongFeedback: 'He was transfigured before them… his face did shine as the sun (Matthew 17:2).'
        },
        {
          question: 'Who appeared talking with Jesus?',
          choices: ['Angels', 'Moses and Elias', 'The disciples', 'The crowd'],
          correctIndex: 1,
          correctFeedback: 'Yes! Moses and Elias.',
          wrongFeedback: 'There appeared unto them Moses and Elias talking with him (Matthew 17:3).'
        },
        {
          question: 'What did the voice from the cloud say?',
          choices: ['This is my servant', 'This is my beloved Son… hear ye him', 'Be quiet', 'Go away'],
          correctIndex: 1,
          correctFeedback: 'Yes! "This is my beloved Son, in whom I am well pleased; hear ye him."',
          wrongFeedback: 'A voice out of the cloud said "This is my beloved Son… hear ye him" (Matthew 17:5).'
        },
        {
          question: 'What can we learn from the transfiguration?',
          choices: ['Jesus is ordinary', 'Jesus is God\'s beloved Son — listen to Him', 'Never climb mountains', 'Doubt Jesus'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus is God\'s beloved Son — listen to Him.',
          wrongFeedback: 'The voice said "This is my beloved Son… hear ye him."'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — listen to God\'s Son!',
      takeaway: 'Jesus is God\'s beloved Son — listen to Him.',
      prayer: 'Jesus, thank You for being God\'s Son. Help me listen to You. Amen.'
    },

    zacchaeus: {
      kjvRef: 'Luke 19:1–10',
      paragraphs: [
        'Jesus entered Jericho and passed through. There was a man named Zacchaeus, chief among the publicans, rich, but short of stature.',
        'He sought to see Jesus but could not for the press of people. He ran before and climbed up into a sycamore tree to see Him.',
        'Jesus came to the place, looked up, and said, "Zacchaeus, make haste, and come down; for to day I must abide at thy house."',
        'Zacchaeus made haste and came down, received Him joyfully. The people murmured, "He is gone to be guest with a man that is a sinner."',
        'Zacchaeus said, "Behold, Lord, the half of my goods I give to the poor; and if I have taken any thing from any man by false accusation, I restore him fourfold." Jesus said, "This day is salvation come to this house."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus entering Jericho, Zacchaeus short, climbing sycamore tree, no text',
        'fun kid illustration: Jesus looking up at Zacchaeus, saying "Come down", no text',
        'colorful Bible scene for children: Zacchaeus coming down, receiving Jesus joyfully, no text',
        'exciting cartoon: people murmuring "He is gone to a sinner", Zacchaeus promising to give half to poor, no text',
        'hopeful ending illustration: Jesus saying "Salvation come to this house", Zacchaeus changed, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Zacchaeus climbed a tree — Jesus called him by name!',
      quizHeading: 'Zacchaeus Questions',
      questions: [
        {
          question: 'What was Zacchaeus\' job?',
          choices: ['Priest', 'Chief among the publicans', 'Soldier', 'Farmer'],
          correctIndex: 1,
          correctFeedback: 'Yes! Chief among the publicans — rich but short.',
          wrongFeedback: 'Zacchaeus was chief among the publicans, and he was rich (Luke 19:2).'
        },
        {
          question: 'Why did Zacchaeus climb the tree?',
          choices: ['To hide', 'To see Jesus because he was short', 'To escape', 'To shout'],
          correctIndex: 1,
          correctFeedback: 'Right! To see Jesus — he was short of stature.',
          wrongFeedback: 'He sought to see Jesus… but could not for the press, because he was little of stature (Luke 19:3).'
        },
        {
          question: 'What did Jesus say to Zacchaeus?',
          choices: ['Go away', 'Zacchaeus, make haste, and come down', 'Climb higher', 'Be quiet'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Zacchaeus, make haste, and come down."',
          wrongFeedback: 'Jesus looked up and said "Zacchaeus, make haste, and come down" (Luke 19:5).'
        },
        {
          question: 'What did Zacchaeus promise?',
          choices: ['Nothing', 'Half of my goods to the poor, restore fourfold if defrauded', 'Give all away', 'Keep his money'],
          correctIndex: 1,
          correctFeedback: 'Right! "The half of my goods I give to the poor… I restore fourfold."',
          wrongFeedback: 'Zacchaeus said "Behold, Lord, the half of my goods I give to the poor… I restore him fourfold" (Luke 19:8).'
        },
        {
          question: 'What can we learn from Zacchaeus?',
          choices: ['Stay short', 'Jesus calls sinners by name — salvation comes', 'Never climb trees', 'Keep money'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus calls sinners by name — salvation comes.',
          wrongFeedback: 'Jesus said "This day is salvation come to this house" (Luke 19:9).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus calls sinners!',
      takeaway: 'Jesus calls sinners by name — salvation comes to those who repent.',
      prayer: 'Jesus, thank You for calling me. Help me repent and follow You. Amen.'
    },

    lazarus: {
      kjvRef: 'John 11:1–44',
      paragraphs: [
        'Lazarus was sick. Mary and Martha sent to Jesus: "Lord, behold, he whom thou lovest is sick." Jesus said, "This sickness is not unto death, but for the glory of God."',
        'Jesus abode two days where He was. Then He said to disciples, "Our friend Lazarus sleepeth; but I go, that I may awake him out of sleep."',
        'Jesus came to Bethany. Martha said, "Lord, if thou hadst been here, my brother had not died." Jesus said, "Thy brother shall rise again."',
        'Jesus wept. He came to the grave. They took away the stone. Jesus cried, "Lazarus, come forth." Lazarus came out, bound hand and foot with graveclothes.',
        'Jesus said, "Loose him, and let him go." Many believed on Jesus because of this miracle.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Mary and Martha sending message to Jesus, Lazarus sick, no text',
        'fun kid illustration: Jesus saying "Lazarus sleepeth", going to Bethany, no text',
        'colorful Bible scene for children: Jesus weeping, Martha saying "If thou hadst been here", no text',
        'exciting cartoon: Jesus crying "Lazarus, come forth", Lazarus coming out of tomb, no text',
        'hopeful ending illustration: Lazarus loosed, many believing, joy, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus raised Lazarus — "Come forth!"',
      quizHeading: 'Jesus Raises Lazarus Questions',
      questions: [
        {
          question: 'Who was sick?',
          choices: ['Mary', 'Lazarus', 'Martha', 'Jesus'],
          correctIndex: 1,
          correctFeedback: 'Yes! Lazarus was sick.',
          wrongFeedback: 'Lazarus was sick (John 11:1).'
        },
        {
          question: 'What did Jesus say about the sickness?',
          choices: ['It is unto death', 'This sickness is not unto death, but for the glory of God', 'It is nothing', 'Pray more'],
          correctIndex: 1,
          correctFeedback: 'Right! "This sickness is not unto death, but for the glory of God."',
          wrongFeedback: 'Jesus said "This sickness is not unto death, but for the glory of God" (John 11:4).'
        },
        {
          question: 'What did Jesus say about Lazarus?',
          choices: ['He is dead', 'He sleepeth', 'He is fine', 'He is gone'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Our friend Lazarus sleepeth."',
          wrongFeedback: 'Jesus said "Our friend Lazarus sleepeth" (John 11:11).'
        },
        {
          question: 'What did Jesus cry at the grave?',
          choices: ['Lazarus, come forth', 'Lazarus, sleep', 'Lazarus, go away', 'Lazarus, wake up'],
          correctIndex: 0,
          correctFeedback: 'Yes! "Lazarus, come forth."',
          wrongFeedback: 'Jesus cried with a loud voice, "Lazarus, come forth" (John 11:43).'
        },
        {
          question: 'What can we learn from Jesus raising Lazarus?',
          choices: ['Jesus can\'t raise dead', 'Jesus has power over death', 'Never believe', 'Fear graves'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus has power over death.',
          wrongFeedback: 'Jesus raised Lazarus — many believed!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus has power over death!',
      takeaway: 'Jesus has power over death — believe in Him.',
      prayer: 'Jesus, thank You for power over death. Help me believe in You. Amen.'
    },

    tombEmpty: {
      kjvRef: 'Matthew 28:1–10',
      paragraphs: [
        'In the end of the sabbath, as it began to dawn toward the first day of the week, Mary Magdalene and the other Mary came to see the sepulchre.',
        'There was a great earthquake. The angel of the Lord descended, rolled back the stone, and sat upon it.',
        'The angel said to the women, "Fear not ye: for I know that ye seek Jesus, which was crucified. He is not here: for he is risen, as he said."',
        'The women departed quickly from the sepulchre with fear and great joy. Jesus met them and said, "All hail."',
        'They came and held Him by the feet and worshipped Him. Jesus said, "Be not afraid: go tell my brethren."'
      ],
      imagePrompts: [
        'bright cartoon for kids: women coming to tomb early morning, no text',
        'fun kid illustration: great earthquake, angel rolling stone, sitting on it, no text',
        'colorful Bible scene for children: angel saying "He is not here: for he is risen", no text',
        'exciting cartoon: women leaving with fear and joy, Jesus meeting them, no text',
        'hopeful ending illustration: women holding Jesus\' feet, worshipping, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'The tomb was empty — Jesus is risen!',
      quizHeading: 'Empty Tomb Questions',
      questions: [
        {
          question: 'Who came to the sepulchre?',
          choices: ['The disciples', 'Mary Magdalene and the other Mary', 'The soldiers', 'The priests'],
          correctIndex: 1,
          correctFeedback: 'Yes! Mary Magdalene and the other Mary.',
          wrongFeedback: 'Mary Magdalene and the other Mary came to see the sepulchre (Matthew 28:1).'
        },
        {
          question: 'What happened to the stone?',
          choices: ['It stayed', 'Angel rolled it back and sat upon it', 'It disappeared', 'Soldiers moved it'],
          correctIndex: 1,
          correctFeedback: 'Right! Angel rolled it back and sat upon it.',
          wrongFeedback: 'The angel rolled back the stone and sat upon it (Matthew 28:2).'
        },
        {
          question: 'What did the angel say?',
          choices: ['Jesus is dead', 'He is not here: for he is risen', 'Stay here', 'Fear greatly'],
          correctIndex: 1,
          correctFeedback: 'Yes! "He is not here: for he is risen."',
          wrongFeedback: 'The angel said "He is not here: for he is risen, as he said" (Matthew 28:6).'
        },
        {
          question: 'What did Jesus say when He met them?',
          choices: ['Go away', 'All hail', 'Fear me', 'I am gone'],
          correctIndex: 1,
          correctFeedback: 'Yes! "All hail."',
          wrongFeedback: 'Jesus met them and said "All hail" (Matthew 28:9).'
        },
        {
          question: 'What can we learn from the empty tomb?',
          choices: ['Jesus is dead', 'Jesus is risen — death is defeated', 'Never visit tombs', 'Doubt'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus is risen — death is defeated.',
          wrongFeedback: 'The tomb was empty — Jesus is risen!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is risen!',
      takeaway: 'Jesus is risen — death is defeated.',
      prayer: 'Jesus, thank You for rising again. Help me believe and share the good news. Amen.'
    },

    thomasDoubt: {
      kjvRef: 'John 20:24–29',
      paragraphs: [
        'Thomas, one of the twelve, was not with them when Jesus came. The disciples said, "We have seen the Lord." Thomas said, "Except I shall see in his hands the print of the nails… I will not believe."',
        'After eight days Jesus came again, the doors being shut. He said, "Peace be unto you."',
        'Jesus said to Thomas, "Reach hither thy finger, and behold my hands; and reach hither thy hand, and thrust it into my side: and be not faithless, but believing."',
        'Thomas answered, "My Lord and my God." Jesus said, "Thomas, because thou hast seen me, thou hast believed: blessed are they that have not seen, and yet have believed."',
        'Jesus showed Himself to doubting Thomas — blessed are those who believe without seeing.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Thomas not with disciples, others saying "We have seen the Lord", no text',
        'fun kid illustration: Thomas saying "Except I see the print of the nails", no text',
        'colorful Bible scene for children: Jesus appearing again, doors shut, saying "Peace be unto you", no text',
        'exciting cartoon: Jesus inviting Thomas to see His hands, "be not faithless, but believing", gentle, no text',
        'hopeful ending illustration: Thomas saying "My Lord and my God", Jesus blessing believers who have not seen, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Doubting Thomas saw Jesus — "My Lord and my God!"',
      quizHeading: 'Doubting Thomas Questions',
      questions: [
        {
          question: 'Why did Thomas not believe?',
          choices: ['He saw Jesus', 'Except I see the print of the nails', 'He was afraid', 'He was busy'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Except I shall see in his hands the print of the nails."',
          wrongFeedback: 'Thomas said "Except I shall see in his hands the print of the nails… I will not believe" (John 20:25).'
        },
        {
          question: 'When did Jesus appear again?',
          choices: ['Next day', 'After eight days', 'One week later', 'Never'],
          correctIndex: 1,
          correctFeedback: 'Right! After eight days.',
          wrongFeedback: 'After eight days again his disciples were within, and Thomas with them (John 20:26).'
        },
        {
          question: 'What did Jesus say to Thomas?',
          choices: ['Be quiet', 'Reach hither thy finger… be not faithless, but believing', 'Go away', 'Believe without seeing'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Reach hither thy finger… thrust it into my side: and be not faithless, but believing."',
          wrongFeedback: 'Jesus said "Reach hither thy finger… and be not faithless, but believing" (John 20:27).'
        },
        {
          question: 'What did Thomas say?',
          choices: ['No', 'My Lord and my God', 'I still doubt', 'Who are you?'],
          correctIndex: 1,
          correctFeedback: 'Yes! "My Lord and my God."',
          wrongFeedback: 'Thomas answered "My Lord and my God" (John 20:28).'
        },
        {
          question: 'What did Jesus say about those who believe without seeing?',
          choices: ['They are foolish', 'Blessed are they that have not seen, and yet have believed', 'They are weak', 'They are lost'],
          correctIndex: 1,
          correctFeedback: 'Perfect! "Blessed are they that have not seen, and yet have believed."',
          wrongFeedback: 'Jesus said "Blessed are they that have not seen, and yet have believed" (John 20:29).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — blessed are those who believe!',
      takeaway: 'Blessed are those who believe without seeing — Jesus is Lord.',
      prayer: 'Jesus, thank You for showing Yourself. Help me believe without seeing. Amen.'
    },

    jesus: {
      kjvRef: 'Matthew; Mark; Luke; John (Gospels overview)',
      paragraphs: [
        'Jesus is the Son of God. He was born in Bethlehem to Mary and Joseph. Angels announced His birth to shepherds.',
        'Jesus grew up in Nazareth. At age twelve He taught in the temple. "I must be about my Father\'s business."',
        'Jesus was baptized by John. The Spirit descended like a dove, and God said, "This is my beloved Son."',
        'Jesus taught with authority, healed the sick, cast out demons, fed thousands, calmed storms, and raised the dead.',
        'Jesus died on the cross for our sins and rose again. He is the way, the truth, and the life.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus born in Bethlehem, angels to shepherds, no text',
        'fun kid illustration: young Jesus teaching in temple at age twelve, no text',
        'colorful Bible scene for children: Jesus baptized, Spirit like dove, God\'s voice, no text',
        'exciting cartoon: Jesus healing sick, calming storm, feeding thousands, no text',
        'hopeful ending illustration: risen Jesus, gentle light, peace and hope, the way the truth the life, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus — Son of God, Savior, Teacher!',
      quizHeading: 'Jesus Questions',
      questions: [
        {
          question: 'Where was Jesus born?',
          choices: ['Nazareth', 'Bethlehem', 'Jerusalem', 'Galilee'],
          correctIndex: 1,
          correctFeedback: 'Yes! In Bethlehem.',
          wrongFeedback: 'Jesus was born in Bethlehem (Luke 2:4–7).'
        },
        {
          question: 'What did young Jesus say in the temple?',
          choices: ['I am bored', 'I must be about my Father\'s business', 'I want food', 'I am king'],
          correctIndex: 1,
          correctFeedback: 'Right! "I must be about my Father\'s business."',
          wrongFeedback: 'Jesus said "Wist ye not that I must be about my Father\'s business?" (Luke 2:49).'
        },
        {
          question: 'What happened at Jesus\' baptism?',
          choices: ['Nothing', 'Spirit descended like a dove, God said "This is my beloved Son"', 'He was crowned', 'He left'],
          correctIndex: 1,
          correctFeedback: 'Yes! Spirit like a dove, God\'s voice.',
          wrongFeedback: 'The Spirit descended like a dove, and a voice said "This is my beloved Son" (Matthew 3:16–17).'
        },
        {
          question: 'What did Jesus do during His ministry?',
          choices: ['Only taught', 'Healed sick, cast out demons, fed thousands, raised dead', 'Built houses', 'Traveled alone'],
          correctIndex: 1,
          correctFeedback: 'Yes! Healed, cast out demons, fed thousands, raised dead.',
          wrongFeedback: 'Jesus healed the sick, cast out demons, fed thousands, calmed storms, raised the dead.'
        },
        {
          question: 'What can we learn from Jesus?',
          choices: ['Jesus is not Savior', 'Jesus is the way, the truth, and the life', 'Never follow Jesus', 'Doubt Jesus'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus is the way, the truth, and the life.',
          wrongFeedback: 'Jesus said "I am the way, the truth, and the life" (John 14:6).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus is Savior!',
      takeaway: 'Jesus is the way, the truth, and the life — follow Him.',
      prayer: 'Jesus, thank You for being my Savior. Help me follow You. Amen.'
    },

    jesusManger: {
      kjvRef: 'Luke 2:1–20',
      paragraphs: [
        'Caesar Augustus decreed a tax. Joseph and Mary went to Bethlehem. Mary brought forth her firstborn son.',
        'She wrapped Him in swaddling clothes and laid Him in a manger — there was no room in the inn.',
        'Shepherds in the field saw an angel: "Fear not: for, behold, I bring you good tidings of great joy… unto you is born this day… a Saviour."',
        'The angel said, "Ye shall find the babe wrapped in swaddling clothes, lying in a manger." A multitude of heavenly host praised God.',
        'The shepherds found Jesus in the manger and told everyone. They returned glorifying and praising God.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Mary and Joseph traveling to Bethlehem, no text',
        'fun kid illustration: Jesus born, wrapped in swaddling clothes, laid in manger, no text',
        'colorful Bible scene for children: angel to shepherds "Fear not… good tidings of great joy", no text',
        'exciting cartoon: heavenly host praising God, shepherds going to manger, no text',
        'hopeful ending illustration: shepherds finding Jesus, glorifying and praising God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus born in a manger — good tidings of great joy!',
      quizHeading: 'Jesus in the Manger Questions',
      questions: [
        {
          question: 'Why did Mary and Joseph go to Bethlehem?',
          choices: ['Vacation', 'Tax decree by Caesar Augustus', 'To visit family', 'To see the temple'],
          correctIndex: 1,
          correctFeedback: 'Yes! Tax decree by Caesar Augustus.',
          wrongFeedback: 'There went out a decree from Caesar Augustus… to be taxed (Luke 2:1).'
        },
        {
          question: 'Where was Jesus laid?',
          choices: ['In a bed', 'In a manger — no room in the inn', 'In a palace', 'In a cave'],
          correctIndex: 1,
          correctFeedback: 'Right! Laid in a manger — no room in the inn.',
          wrongFeedback: 'She… laid him in a manger; because there was no room for them in the inn (Luke 2:7).'
        },
        {
          question: 'What did the angel say to the shepherds?',
          choices: ['Fear greatly', 'Fear not: good tidings of great joy… a Saviour is born', 'Go home', 'Be quiet'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Fear not… good tidings of great joy… unto you is born… a Saviour."',
          wrongFeedback: 'The angel said "Fear not: for, behold, I bring you good tidings of great joy" (Luke 2:10).'
        },
        {
          question: 'What did the shepherds do after seeing Jesus?',
          choices: ['Stayed silent', 'Told everyone and praised God', 'Forgot', 'Went back to sheep'],
          correctIndex: 1,
          correctFeedback: 'Yes! Told everyone and returned glorifying God.',
          wrongFeedback: 'They made known abroad the saying… and returned, glorifying and praising God (Luke 2:17, 20).'
        },
        {
          question: 'What can we learn from Jesus in the manger?',
          choices: ['Jesus was born in luxury', 'Jesus came as Saviour — good tidings of great joy', 'Never celebrate birth', 'Fear angels'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus came as Saviour — good tidings of great joy.',
          wrongFeedback: 'The angel brought good tidings — Jesus is born Saviour!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — good tidings of great joy!',
      takeaway: 'Jesus came as Saviour — good tidings of great joy.',
      prayer: 'Jesus, thank You for coming as Saviour. Help me share the good news. Amen.'
    },

    jesusTemple: {
      kjvRef: 'Luke 2:41–52',
      paragraphs: [
        'Every year Joseph and Mary went to Jerusalem for the passover. When Jesus was twelve they went up.',
        'After the feast they returned. Jesus stayed behind in Jerusalem. They sought Him sorrowing.',
        'After three days they found Him in the temple, sitting in the midst of the doctors, both hearing them, and asking them questions.',
        'All that heard Him were astonished at His understanding and answers. Mary said, "Son, why hast thou thus dealt with us?"',
        'Jesus said, "Wist ye not that I must be about my Father\'s business?" He went down with them and was subject unto them.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Joseph and Mary going to Jerusalem for passover, Jesus twelve years old, no text',
        'fun kid illustration: Jesus staying behind in temple, parents seeking sorrowing, no text',
        'colorful Bible scene for children: Jesus in temple with doctors, asking questions, astonishing them, no text',
        'exciting cartoon: Mary saying "Son, why hast thou thus dealt with us?", Jesus answering, no text',
        'hopeful ending illustration: Jesus going home with parents, subject to them, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus at age twelve in the temple — about my Father\'s business!',
      quizHeading: 'Jesus in the Temple Questions',
      questions: [
        {
          question: 'How old was Jesus when He stayed in the temple?',
          choices: ['Six', 'Twelve', 'Eighteen', 'Thirty'],
          correctIndex: 1,
          correctFeedback: 'Yes! Twelve years old.',
          wrongFeedback: 'When he was twelve years old, they went up to Jerusalem (Luke 2:42).'
        },
        {
          question: 'Where did they find Jesus?',
          choices: ['In the market', 'In the temple, sitting with doctors', 'By the sea', 'At home'],
          correctIndex: 1,
          correctFeedback: 'Right! In the temple, sitting with the doctors.',
          wrongFeedback: 'They found him in the temple, sitting in the midst of the doctors (Luke 2:46).'
        },
        {
          question: 'What were people astonished at?',
          choices: ['His height', 'His understanding and answers', 'His clothes', 'His food'],
          correctIndex: 1,
          correctFeedback: 'Yes! His understanding and answers.',
          wrongFeedback: 'All that heard him were astonished at his understanding and answers (Luke 2:47).'
        },
        {
          question: 'What did Jesus say to His parents?',
          choices: ['I was lost', 'Wist ye not that I must be about my Father\'s business?', 'I am sorry', 'I want to stay'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Wist ye not that I must be about my Father\'s business?"',
          wrongFeedback: 'Jesus said "Wist ye not that I must be about my Father\'s business?" (Luke 2:49).'
        },
        {
          question: 'What can we learn from Jesus in the temple?',
          choices: ['Never listen to parents', 'Jesus was about His Father\'s business — obey God', 'Stay away from temple', 'Be disobedient'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus was about His Father\'s business — obey God.',
          wrongFeedback: 'Jesus was subject to His parents and about His Father\'s business!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — about my Father\'s business!',
      takeaway: 'Jesus was about His Father\'s business — obey God.',
      prayer: 'God, help me be about Your business. Thank You for Jesus. Amen.'
    },

    johnBaptize: {
      kjvRef: 'Matthew 3:13–17',
      paragraphs: [
        'Jesus came from Galilee to Jordan unto John, to be baptized of him. John forbade Him, saying, "I have need to be baptized of thee."',
        'Jesus said, "Suffer it to be so now: for thus it becometh us to fulfil all righteousness." Then John suffered Him.',
        'Jesus was baptized. He went up straightway out of the water. The heavens were opened unto Him.',
        'The Spirit of God descended like a dove, lighting upon Him. A voice from heaven said, "This is my beloved Son, in whom I am well pleased."',
        'Jesus was baptized — the Father and the Spirit testified to Him.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Jesus coming to John at Jordan to be baptized, no text',
        'fun kid illustration: John saying "I have need to be baptized of thee", Jesus replying, no text',
        'colorful Bible scene for children: Jesus baptized, coming up out of water, no text',
        'exciting cartoon: heavens opened, Spirit like dove descending, voice from heaven, no text',
        'hopeful ending illustration: Jesus with Spirit, Father saying "This is my beloved Son", no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus baptized — Spirit like a dove, God\'s voice!',
      quizHeading: 'John Baptizes Jesus Questions',
      questions: [
        {
          question: 'Where did Jesus go to be baptized?',
          choices: ['To the temple', 'To Jordan unto John', 'To Galilee', 'To Nazareth'],
          correctIndex: 1,
          correctFeedback: 'Yes! To Jordan unto John.',
          wrongFeedback: 'Jesus came from Galilee to Jordan unto John (Matthew 3:13).'
        },
        {
          question: 'What did John say to Jesus?',
          choices: ['I need to baptize You', 'I have need to be baptized of thee', 'You are not worthy', 'Go away'],
          correctIndex: 1,
          correctFeedback: 'Right! "I have need to be baptized of thee."',
          wrongFeedback: 'John forbade him, saying, "I have need to be baptized of thee" (Matthew 3:14).'
        },
        {
          question: 'Why did Jesus want to be baptized?',
          choices: ['To show off', 'To fulfil all righteousness', 'To get wet', 'To please John'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Thus it becometh us to fulfil all righteousness."',
          wrongFeedback: 'Jesus said "Suffer it to be so now: for thus it becometh us to fulfil all righteousness" (Matthew 3:15).'
        },
        {
          question: 'What happened when Jesus came up out of the water?',
          choices: ['Nothing', 'Heavens opened, Spirit like a dove, voice from heaven', 'Storm', 'Crowd cheered'],
          correctIndex: 1,
          correctFeedback: 'Yes! Heavens opened, Spirit like dove, voice said "This is my beloved Son."',
          wrongFeedback: 'The heavens were opened unto him, and he saw the Spirit of God descending like a dove… and a voice from heaven (Matthew 3:16–17).'
        },
        {
          question: 'What can we learn from Jesus\' baptism?',
          choices: ['Jesus is ordinary', 'Jesus fulfils righteousness — Father and Spirit testify', 'Never be baptized', 'Doubt God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Jesus fulfils righteousness — Father and Spirit testify.',
          wrongFeedback: 'Jesus was baptized — heavens opened, Spirit descended, God\'s voice!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — Jesus fulfils righteousness!',
      takeaway: 'Jesus fulfils righteousness — Father and Spirit testify.',
      prayer: 'Jesus, thank You for fulfilling all righteousness. Help me follow You. Amen.'
    },

    jesusBlessKids: {
      kjvRef: 'Mark 10:13–16',
      paragraphs: [
        'They brought young children to Jesus that He should touch them. The disciples rebuked those that brought them.',
        'Jesus was much displeased and said, "Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God."',
        'Jesus took them up in His arms, put His hands upon them, and blessed them.',
        'Jesus said, "Whosoever shall not receive the kingdom of God as a little child, he shall not enter therein."',
        'Jesus loves children — the kingdom belongs to those who come to Him with childlike faith.'
      ],
      imagePrompts: [
        'bright cartoon for kids: people bringing children to Jesus, disciples rebuking, no text',
        'fun kid illustration: Jesus displeased, saying "Suffer the little children to come unto me", no text',
        'colorful Bible scene for children: Jesus taking children in arms, blessing them, no text',
        'exciting cartoon: Jesus saying "Of such is the kingdom of God", no text',
        'hopeful ending illustration: children with Jesus, childlike faith, kingdom of God, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Jesus blesses the children — kingdom belongs to such!',
      quizHeading: 'Jesus Blesses Children Questions',
      questions: [
        {
          question: 'What did people bring to Jesus?',
          choices: ['Money', 'Young children', 'Food', 'Gifts'],
          correctIndex: 1,
          correctFeedback: 'Yes! Young children to touch them.',
          wrongFeedback: 'They brought young children to him, that he should touch them (Mark 10:13).'
        },
        {
          question: 'What did the disciples do?',
          choices: ['Helped bring them', 'Rebuked those that brought them', 'Blessed them', 'Ignored them'],
          correctIndex: 1,
          correctFeedback: 'Right! Rebuked those that brought them.',
          wrongFeedback: 'The disciples rebuked those that brought them (Mark 10:13).'
        },
        {
          question: 'What did Jesus say?',
          choices: ['Send them away', 'Suffer the little children to come unto me', 'Be quiet', 'Give them money'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Suffer the little children to come unto me, and forbid them not."',
          wrongFeedback: 'Jesus said "Suffer the little children to come unto me, and forbid them not" (Mark 10:14).'
        },
        {
          question: 'What did Jesus do to the children?',
          choices: ['Pushed them away', 'Took them up in His arms, put hands on them, blessed them', 'Ignored them', 'Sent them home'],
          correctIndex: 1,
          correctFeedback: 'Yes! Took them up in His arms, put hands on them, blessed them.',
          wrongFeedback: 'He took them up in his arms, put his hands upon them, and blessed them (Mark 10:16).'
        },
        {
          question: 'What can we learn from Jesus blessing children?',
          choices: ['Children are unimportant', 'Kingdom of God belongs to those with childlike faith', 'Never bring children', 'Doubt Jesus'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Kingdom belongs to those with childlike faith.',
          wrongFeedback: 'Jesus said "Of such is the kingdom of God… Whosoever shall not receive the kingdom of God as a little child…" (Mark 10:14–15).'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — childlike faith!',
      takeaway: 'Kingdom of God belongs to those with childlike faith.',
      prayer: 'Jesus, thank You for loving children. Give me childlike faith. Amen.'
    },

    fallOfJericho: {
      kjvRef: 'Joshua 6:1–21',
      paragraphs: [
        'God told Joshua: "Ye shall compass the city… once: and the priests shall blow with rams\' horns."',
        'For six days they compassed the city once, priests bearing the ark, blowing rams\' horns. On the seventh day they compassed seven times.',
        'Joshua said, "Shout; for the Lord hath given you the city." The people shouted with a great shout — the wall fell down flat.',
        'They took the city. Joshua said, "Cursed be the man… that buildeth this city Jericho."',
        'The walls of Jericho fell by faith and obedience — God gave the victory.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Joshua and Israel compassing Jericho once, priests with rams\' horns, no text',
        'fun kid illustration: six days marching around city, ark and horns, no text',
        'colorful Bible scene for children: seventh day — seven times around, shouting, no text',
        'exciting cartoon: great shout, walls of Jericho falling down flat, no text',
        'hopeful ending illustration: Israel taking city, God giving victory, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Walls of Jericho fell by faith and obedience!',
      quizHeading: 'Fall of Jericho Questions',
      questions: [
        {
          question: 'What did God tell Joshua to do?',
          choices: ['Attack immediately', 'Compass the city once, priests blow rams\' horns', 'Build ladders', 'Surrender'],
          correctIndex: 1,
          correctFeedback: 'Yes! Compass the city once, priests blow rams\' horns.',
          wrongFeedback: 'God said "Ye shall compass the city… once: and the priests shall blow with rams\' horns" (Joshua 6:3–4).'
        },
        {
          question: 'How many days did they compass once?',
          choices: ['One day', 'Six days', 'Seven days', 'Forty days'],
          correctIndex: 1,
          correctFeedback: 'Right! Six days compassing once.',
          wrongFeedback: 'They compassed the city once for six days (Joshua 6:14).'
        },
        {
          question: 'What happened on the seventh day?',
          choices: ['Nothing', 'Compassed seven times, shouted, walls fell', 'They rested', 'They fought'],
          correctIndex: 1,
          correctFeedback: 'Yes! Compassed seven times, shouted, walls fell.',
          wrongFeedback: 'On the seventh day they compassed seven times… and the wall fell down flat (Joshua 6:15, 20).'
        },
        {
          question: 'What did Joshua tell the people when it was time to shout?',
          choices: ['Shout louder', 'The Lord hath given you the city', 'Run away', 'Build again'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Shout; for the Lord hath given you the city."',
          wrongFeedback: 'Joshua said "Shout; for the Lord hath given you the city" (Joshua 6:16).'
        },
        {
          question: 'What can we learn from Jericho walls?',
          choices: ['Obey only easy things', 'Obey God — He gives victory', 'Never march', 'Doubt God'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Obey God — He gives victory.',
          wrongFeedback: 'Walls fell by faith and obedience — God gave the victory!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — obey God for victory!',
      takeaway: 'Obey God — He gives victory.',
      prayer: 'God, help me obey You. Thank You for victory. Amen.'
    },

    samsonHair: {
      kjvRef: 'Judges 16',
      paragraphs: [
        'Samson loved Delilah. She asked the secret of his strength. He said his hair — if shaved, he would be weak.',
        'Delilah shaved his head while he slept. The Philistines took him, put out his eyes, and bound him.',
        'Samson was brought to the temple of Dagon. The people gathered to see him.',
        'Samson prayed for strength one last time. He pushed the pillars — the house fell. God answered his prayer.',
        'Samson\'s strength was from God — even when he lost it, God heard his final prayer.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Samson telling Delilah secret of strength, hair, no text',
        'fun kid illustration: Delilah shaving Samson\'s head while he sleeps, no text',
        'colorful Bible scene for children: Samson blinded, bound, brought to temple of Dagon, no text',
        'exciting cartoon: Samson praying for strength, pushing pillars, building shaking, no text',
        'hopeful ending illustration: God hearing Samson\'s prayer, strength for one last stand, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Samson\'s hair cut — strength lost & restored by prayer!',
      quizHeading: 'Samson\'s Hair Questions',
      questions: [
        {
          question: 'What was the secret of Samson\'s strength?',
          choices: ['His muscles', 'His hair — if shaved, he would be weak', 'His food', 'His friends'],
          correctIndex: 1,
          correctFeedback: 'Yes! His hair — if shaved, he would be weak.',
          wrongFeedback: 'Samson said "If I be shaven, then my strength will go from me" (Judges 16:17).'
        },
        {
          question: 'What did Delilah do?',
          choices: ['Helped him', 'Shaved his head while he slept', 'Cut his hair in public', 'Prayed for him'],
          correctIndex: 1,
          correctFeedback: 'Right! Shaved his head while he slept.',
          wrongFeedback: 'Delilah made him sleep upon her knees; she called for a man to shave off his hair (Judges 16:19).'
        },
        {
          question: 'What happened to Samson after his hair was cut?',
          choices: ['He became stronger', 'Philistines took him, put out his eyes', 'He ran away', 'Nothing'],
          correctIndex: 1,
          correctFeedback: 'Yes! Philistines took him, put out his eyes.',
          wrongFeedback: 'The Philistines took him, put out his eyes, and bound him (Judges 16:21).'
        },
        {
          question: 'What did Samson do in the temple?',
          choices: ['Prayed for strength, pushed the pillars', 'Slept', 'Fought alone', 'Prayed for mercy'],
          correctIndex: 0,
          correctFeedback: 'Yes! Prayed for strength, pushed the pillars.',
          wrongFeedback: 'Samson prayed and said "Let me die with the Philistines" — he bowed himself with all his might (Judges 16:28–30).'
        },
        {
          question: 'What can we learn from Samson\'s hair?',
          choices: ['Strength from hair only', 'Strength from God — obey His commands', 'Never trust God', 'Break vows'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Strength from God — obey His commands.',
          wrongFeedback: 'Samson\'s strength was from God — he lost it when he broke his Nazarite vow!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — strength from God!',
      takeaway: 'Strength from God — obey His commands.',
      prayer: 'God, thank You for strength. Help me obey Your commands. Amen.'
    },

    naamanDip: {
      kjvRef: '2 Kings 5:1–15',
      paragraphs: [
        'Naaman was captain of the host of Syria — a great man, but he was a leper.',
        'A little maid from Israel said, "Would God my lord were with the prophet in Samaria! he would recover him of his leprosy."',
        'Naaman came to Elisha. Elisha sent a messenger: "Go and wash in Jordan seven times, and thy flesh shall come again."',
        'Naaman was angry — he thought Elisha would strike his hand and call on God. His servants said, "If the prophet had bid thee do some great thing, wouldest thou not have done it?"',
        'Naaman dipped seven times in Jordan — his flesh came again like a little child. He returned to Elisha and said, "Now I know that there is no God in all the earth, but in Israel."'
      ],
      imagePrompts: [
        'bright cartoon for kids: Naaman the great captain, but with leprosy, no text',
        'fun kid illustration: little maid telling Naaman about Elisha in Samaria, no text',
        'colorful Bible scene for children: Naaman at Elisha\'s house, messenger saying "Wash in Jordan seven times", no text',
        'exciting cartoon: Naaman angry, servants saying "If great thing, wouldest thou not?", no text',
        'hopeful ending illustration: Naaman dipping seven times, flesh like a child, believing in God of Israel, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Naaman dipped in Jordan — healed by God!',
      quizHeading: 'Naaman Dips in Jordan Questions',
      questions: [
        {
          question: 'Who was Naaman?',
          choices: ['A poor man', 'Captain of the host of Syria — a great man, but leper', 'A prophet', 'A king'],
          correctIndex: 1,
          correctFeedback: 'Yes! Great man, captain, but a leper.',
          wrongFeedback: 'Naaman was captain of the host of the king of Syria… but he was a leper (2 Kings 5:1).'
        },
        {
          question: 'What did the little maid say?',
          choices: ['Elisha is bad', 'Would God my lord were with the prophet in Samaria!', 'Go home', 'Stay sick'],
          correctIndex: 1,
          correctFeedback: 'Right! "Would God my lord were with the prophet… he would recover him."',
          wrongFeedback: 'The little maid said "Would God my lord were with the prophet… he would recover him" (2 Kings 5:3).'
        },
        {
          question: 'What did Elisha tell Naaman to do?',
          choices: ['Pay money', 'Go and wash in Jordan seven times', 'Bring gifts', 'Fight'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Go and wash in Jordan seven times."',
          wrongFeedback: 'Elisha said "Go and wash in Jordan seven times, and thy flesh shall come again" (2 Kings 5:10).'
        },
        {
          question: 'Why was Naaman angry?',
          choices: ['He wanted a great thing', 'He thought Elisha would strike hand and call on God', 'He liked Jordan', 'He was healed too fast'],
          correctIndex: 1,
          correctFeedback: 'Right! Thought Elisha would strike hand and call on God.',
          wrongFeedback: 'Naaman was angry — thought Elisha would "strike his hand over the place, and recover the leper" (2 Kings 5:11).'
        },
        {
          question: 'What can we learn from Naaman?',
          choices: ['Obey great things only', 'Obey simple commands — God heals', 'Never wash', 'Doubt prophets'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Obey simple commands — God heals.',
          wrongFeedback: 'Naaman dipped seven times — flesh like a child, believed in God of Israel!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — obey simple commands!',
      takeaway: 'Obey simple commands — God heals and saves.',
      prayer: 'God, help me obey Your simple commands. Thank You for healing. Amen.'
    },

    ruthGlean: {
      kjvRef: 'Ruth 2',
      paragraphs: [
        'Ruth said to Naomi, "Let me go to the field and glean ears of corn." Naomi said, "Go, my daughter."',
        'Ruth came to the field of Boaz. Boaz saw her and asked who she was. He said, "Hearest thou not, my daughter?"',
        'Boaz told his servants to let her glean even among the sheaves and to let fall some handfuls for her.',
        'Ruth gleaned until even. She beat out what she had gleaned — about an ephah of barley.',
        'Ruth returned to Naomi and showed her what she had gleaned. Naomi said, "The man is near of kin unto us." God provided for Ruth.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Ruth asking Naomi to glean in the field, no text',
        'fun kid illustration: Ruth gleaning in Boaz\'s field, Boaz watching, no text',
        'colorful Bible scene for children: Boaz telling servants to let fall handfuls for Ruth, no text',
        'exciting cartoon: Ruth gleaning until evening, beating out barley, no text',
        'hopeful ending illustration: Ruth returning to Naomi with barley, God providing, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Ruth gleaned in Boaz\'s field — God provided!',
      quizHeading: 'Ruth Gleans Questions',
      questions: [
        {
          question: 'What did Ruth ask Naomi?',
          choices: ['To leave', 'Let me go to the field and glean ears of corn', 'To rest', 'To fight'],
          correctIndex: 1,
          correctFeedback: 'Yes! "Let me go to the field and glean ears of corn."',
          wrongFeedback: 'Ruth said "Let me now go to the field, and glean ears of corn" (Ruth 2:2).'
        },
        {
          question: 'Whose field did Ruth go to?',
          choices: ['Naomi\'s', 'Boaz\'s', 'The king\'s', 'A stranger\'s'],
          correctIndex: 1,
          correctFeedback: 'Right! Boaz\'s field.',
          wrongFeedback: 'Her hap was to light on a part of the field belonging unto Boaz (Ruth 2:3).'
        },
        {
          question: 'What did Boaz tell his servants?',
          choices: ['Send her away', 'Let her glean even among the sheaves, let fall handfuls', 'Ignore her', 'Give her money'],
          correctIndex: 1,
          correctFeedback: 'Yes! Let her glean among the sheaves, let fall handfuls.',
          wrongFeedback: 'Boaz said "Let her glean even among the sheaves… and let fall also some of the handfuls" (Ruth 2:15–16).'
        },
        {
          question: 'How much did Ruth glean?',
          choices: ['A little', 'About an ephah of barley', 'Nothing', 'A few ears'],
          correctIndex: 1,
          correctFeedback: 'Yes! About an ephah of barley.',
          wrongFeedback: 'She gleaned… about an ephah of barley (Ruth 2:17).'
        },
        {
          question: 'What can we learn from Ruth gleaning?',
          choices: ['God doesn\'t provide', 'God provides for the faithful', 'Never glean', 'Give up'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God provides for the faithful.',
          wrongFeedback: 'Ruth gleaned and God provided through Boaz — faithfulness rewarded!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God provides!',
      takeaway: 'God provides for the faithful.',
      prayer: 'God, thank You for providing. Help me be faithful. Amen.'
    },

    esther: {
      kjvRef: 'Esther 2–7',
      paragraphs: [
        'Esther was taken to King Ahasuerus. She obtained favor in the sight of all. The king loved Esther above all women and made her queen.',
        'Haman was advanced above all princes. He hated Mordecai because Mordecai would not bow. Haman plotted to destroy all Jews.',
        'Esther fasted three days. She went to the king uncalled. The king extended the golden sceptre.',
        'Esther invited the king and Haman to a banquet. At the second banquet she said, "The adversary and enemy is this wicked Haman."',
        'The king was wroth. Haman was hanged on the gallows he prepared for Mordecai. The Jews were saved.'
      ],
      imagePrompts: [
        'bright cartoon for kids: Esther before King Ahasuerus, obtaining favor, crowned queen, no text',
        'fun kid illustration: Haman angry at Mordecai for not bowing, plotting, no text',
        'colorful Bible scene for children: Esther fasting, going to king uncalled, sceptre extended, no text',
        'exciting cartoon: Esther at banquet, revealing Haman as enemy, king wroth, no text',
        'hopeful ending illustration: Jews safe, joy and relief, wicked plan stopped, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Esther risked her life — God saved her people!',
      quizHeading: 'Esther Saves Her People Questions',
      questions: [
        {
          question: 'Who became queen?',
          choices: ['Vashti', 'Esther', 'Mary', 'Ruth'],
          correctIndex: 1,
          correctFeedback: 'Yes! Esther became queen.',
          wrongFeedback: 'The king loved Esther above all women and made her queen (Esther 2:17).'
        },
        {
          question: 'Why did Haman hate Mordecai?',
          choices: ['Mordecai was rich', 'Mordecai would not bow to Haman', 'Mordecai fought him', 'Mordecai was king'],
          correctIndex: 1,
          correctFeedback: 'Right! Mordecai would not bow.',
          wrongFeedback: 'Haman hated Mordecai because he would not bow (Esther 3:2–5).'
        },
        {
          question: 'What did Esther do before going to the king?',
          choices: ['Fasted three days', 'Prayed only', 'Ran away', 'Fought Haman'],
          correctIndex: 0,
          correctFeedback: 'Yes! Fasted three days.',
          wrongFeedback: 'Esther fasted three days and three nights (Esther 4:16).'
        },
        {
          question: 'What did Esther say at the banquet?',
          choices: ['Nothing', 'The adversary and enemy is this wicked Haman', 'I am afraid', 'Give me money'],
          correctIndex: 1,
          correctFeedback: 'Yes! "The adversary and enemy is this wicked Haman."',
          wrongFeedback: 'Esther said "The adversary and enemy is this wicked Haman" (Esther 7:6).'
        },
        {
          question: 'What can we learn from Esther?',
          choices: ['Hide faith', 'God uses people to save His people', 'Never fast', 'Fear kings'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God uses people to save His people.',
          wrongFeedback: 'Esther risked her life — God saved the Jews!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God saves His people!',
      takeaway: 'God uses people to save His people — trust Him.',
      prayer: 'God, thank You for using Esther. Help me trust You. Amen.'
    },

    hannahPray: {
      kjvRef: '1 Samuel 1',
      paragraphs: [
        'Hannah had no child. Peninnah vexed her sore, because the Lord had shut up her womb. Hannah wept and would not eat.',
        'Year by year Hannah went up to the house of the Lord in Shiloh. She prayed in her heart; only her lips moved, but her voice was not heard.',
        'Eli the priest thought she had been drunken. Hannah said, "No, my lord, I am a woman of a sorrowful spirit… I have poured out my soul before the Lord."',
        'Eli answered, "Go in peace: and the God of Israel grant thee thy petition." Hannah went her way, and her countenance was no more sad.',
        'The Lord remembered Hannah. She bare a son, and called his name Samuel, saying, Because I have asked him of the Lord. When he was weaned, she brought him to minister before the Lord.'
      ],
      imagePrompts: [
        'gentle cartoon for kids: Hannah sad at table while others eat, Peninnah in background, Shiloh feeling, no text',
        'bright kid illustration: Hannah praying silently in tabernacle, lips moving, Eli watching from distance, no text',
        'colorful Bible scene: Eli speaking kindly to Hannah, Hannah explaining she is not drunken but sorrowful, no text',
        'hopeful cartoon: Hannah smiling, peaceful face after Eli\'s blessing, walking away lighter, no text',
        'warm ending illustration: Hannah with baby Samuel, dedicating child to serve the Lord, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Hannah poured out her heart — God heard!',
      quizHeading: 'Hannah Prays Questions',
      questions: [
        {
          question: 'Why was Hannah so sad?',
          choices: ['She was sick', 'She had no child and was sorely provoked', 'She lost her home', 'She feared the king'],
          correctIndex: 1,
          correctFeedback: 'Yes! She had no child and was sorely provoked.',
          wrongFeedback: 'The Lord had shut up her womb, and Peninnah vexed her sore (1 Samuel 1:5–7).'
        },
        {
          question: 'What did Eli think when he saw Hannah praying?',
          choices: ['She was singing', 'She had been drunken', 'She was hiding', 'She was asleep'],
          correctIndex: 1,
          correctFeedback: 'Right! Eli thought she had been drunken.',
          wrongFeedback: 'Eli said unto her, "How long wilt thou be drunken?" (1 Samuel 1:14).'
        },
        {
          question: 'What did Hannah tell Eli she was doing?',
          choices: ['Complaining', 'Pouring out her soul before the Lord', 'Counting money', 'Planning a feast'],
          correctIndex: 1,
          correctFeedback: 'Yes! Pouring out her soul before the Lord.',
          wrongFeedback: 'Hannah said, "I… have poured out my soul before the Lord" (1 Samuel 1:15).'
        },
        {
          question: 'What did God give Hannah?',
          choices: ['A new house', 'A son named Samuel', 'A crown', 'Silver and gold'],
          correctIndex: 1,
          correctFeedback: 'Perfect! A son named Samuel.',
          wrongFeedback: 'The Lord remembered her; she bare a son, and called his name Samuel (1 Samuel 1:19–20).'
        },
        {
          question: 'What can we learn from Hannah?',
          choices: ['God does not hear kids', 'God hears when we pour out our hearts to Him', 'Never pray in public', 'Hide our feelings'],
          correctIndex: 1,
          correctFeedback: 'Yes! God hears when we pour out our hearts.',
          wrongFeedback: 'Hannah was honest with God — and He answered in His time!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God hears prayer!',
      takeaway: 'Pour out your heart to God — He hears and cares.',
      prayer: 'God, thank You that You hear me. Help me trust You with what hurts. Amen.'
    },

    widowOil: {
      kjvRef: '2 Kings 4:1–7',
      paragraphs: [
        'A widow cried to Elisha: "Thy servant my husband is dead… the creditor is come to take unto him my two sons to be bondmen."',
        'Elisha asked, "What hast thou in the house?" She said, "Thine handmaid hath not any thing… save a pot of oil."',
        'Elisha said, "Go, borrow him vessels abroad of all thy neighbours… not a few." When she came in, she shut the door upon her and her sons, and poured out into the vessels.',
        'When the vessels were full, she said to her son, "Bring me yet a vessel." He said, "There is not a vessel more." And the oil stayed.',
        'Elisha said, "Go, sell the oil, and pay thy debt, and live thou and thy children of the rest." God multiplied what little she had.'
      ],
      imagePrompts: [
        'gentle cartoon for kids: worried widow with two sons, creditor feeling, simple home, no text',
        'bright kid illustration: widow showing Elisha (or prophet) one small pot of oil, empty cupboards, no text',
        'colorful Bible scene: sons bringing many borrowed jars, mother shutting the door to pour, no text',
        'exciting cartoon: oil pouring and filling jar after jar, wonder on faces, no text',
        'hopeful ending: widow and sons relieved, debt paid, jars and peace, God provides, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'A little oil — God filled every jar!',
      quizHeading: 'The Widow\'s Oil Questions',
      questions: [
        {
          question: 'Who did the widow cry to?',
          choices: ['The king', 'Elisha', 'A soldier', 'Her neighbour only'],
          correctIndex: 1,
          correctFeedback: 'Yes! She cried unto Elisha.',
          wrongFeedback: 'She cried unto Elisha, "Thy servant my husband is dead" (2 Kings 4:1).'
        },
        {
          question: 'What did she have in the house?',
          choices: ['Many jars of oil', 'Nothing but a pot of oil', 'Gold coins', 'Bread only'],
          correctIndex: 1,
          correctFeedback: 'Right! Nothing but a pot of oil.',
          wrongFeedback: 'She said, "Save a pot of oil" (2 Kings 4:2).'
        },
        {
          question: 'What did Elisha tell her to borrow?',
          choices: ['Money', 'Vessels — not a few', 'Horses', 'New clothes'],
          correctIndex: 1,
          correctFeedback: 'Yes! Vessels from her neighbours — not a few.',
          wrongFeedback: 'Elisha said, "Borrow him vessels… not a few" (2 Kings 4:3).'
        },
        {
          question: 'When did the oil stop flowing?',
          choices: ['After one jar', 'When there were no more vessels to fill', 'At sunset', 'When she was afraid'],
          correctIndex: 1,
          correctFeedback: 'Yes! When there was not a vessel more.',
          wrongFeedback: 'When the vessels were full, she was told there was not a vessel more — and the oil stayed (2 Kings 4:6).'
        },
        {
          question: 'What can we learn from the widow?',
          choices: ['Hide what we have', 'God can bless a little when we obey', 'Never ask for help', 'Oil is magic'],
          correctIndex: 1,
          correctFeedback: 'Perfect! God can bless a little when we obey.',
          wrongFeedback: 'She obeyed Elisha — God provided enough to pay the debt and live!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — God provides!',
      takeaway: 'Bring what little you have to God — He can make it enough.',
      prayer: 'God, thank You for providing. Help me obey You one step at a time. Amen.'
    },

    maryMagdalene: {
      kjvRef: 'John 20:1–18',
      paragraphs: [
        'Early the first day of the week, Mary Magdalene came to the sepulchre when it was yet dark, and saw the stone taken away from the sepulchre.',
        'She ran and told Simon Peter and the other disciple. They ran, saw the linen clothes, and went unto their own home.',
        'Mary stood without, weeping. She looked into the sepulchre and saw two angels in white. They said, "Woman, why weepest thou?"',
        'She turned back and saw Jesus standing, and knew not that it was Jesus. He said, "Woman, why weepest thou? whom seekest thou?" She supposed him to be the gardener.',
        'Jesus saith unto her, "Mary." She turned and said, "Rabboni." Jesus said, "Touch me not… but go to my brethren, and say unto them, I ascend unto my Father."'
      ],
      imagePrompts: [
        'gentle dawn cartoon: empty tomb, stone rolled away, Mary alone, soft light, no text',
        'kid illustration: Mary running, disciples listening, urgency and hope, no text',
        'colorful scene: angels in white, Mary weeping at tomb, tender question, no text',
        'warm garden scene: risen Jesus, Mary mistaking Him for gardener, peaceful, no text',
        'joyful ending: Jesus calls her name, Mary recognizing Him, good news to share, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'He called her name — the Lord is risen!',
      quizHeading: 'Mary at the Tomb Questions',
      questions: [
        {
          question: 'What did Mary see at the sepulchre first?',
          choices: ['Jesus walking', 'The stone taken away', 'Angels on the roof', 'Soldiers only'],
          correctIndex: 1,
          correctFeedback: 'Yes! The stone taken away.',
          wrongFeedback: 'She saw the stone taken away from the sepulchre (John 20:1).'
        },
        {
          question: 'Who ran with Mary\'s news to the tomb?',
          choices: ['Only Mary', 'Peter and the other disciple', 'Roman soldiers', 'Mary\'s sisters'],
          correctIndex: 1,
          correctFeedback: 'Right! Peter and the other disciple.',
          wrongFeedback: 'Simon Peter and the other disciple ran to the sepulchre (John 20:3–4).'
        },
        {
          question: 'Whom did Mary suppose Jesus to be?',
          choices: ['The high priest', 'The gardener', 'Peter', 'An angel'],
          correctIndex: 1,
          correctFeedback: 'Yes! She supposed him to be the gardener.',
          wrongFeedback: 'She supposed him to be the gardener (John 20:15).'
        },
        {
          question: 'What did Jesus say that helped Mary know Him?',
          choices: ['Follow me', 'Mary', 'Peace be unto you', 'Feed my sheep'],
          correctIndex: 1,
          correctFeedback: 'Perfect! He said her name: "Mary."',
          wrongFeedback: 'Jesus saith unto her, Mary (John 20:16).'
        },
        {
          question: 'What can we learn from Mary?',
          choices: ['Run away from Jesus', 'Jesus knows His own and calls them by name', 'Never weep', 'Stay silent'],
          correctIndex: 1,
          correctFeedback: 'Yes! Jesus knows His own and calls them.',
          wrongFeedback: 'Jesus met Mary in her tears — and sent her with good news for His brethren!'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — He is risen!',
      takeaway: 'Jesus is alive — He knows you and calls you.',
      prayer: 'Lord Jesus, thank You that You rose again. Help me follow You today. Amen.'
    },

    maryAnoint: {
      kjvRef: 'John 12:1–8',
      paragraphs: [
        'Six days before the passover Jesus came to Bethany, where Lazarus was, whom he raised from the dead.',
        'They made him a supper; Martha served: and Lazarus was one of them that sat at the table with him.',
        'Then took Mary a pound of ointment of spikenard, very costly, and anointed the feet of Jesus, and wiped his feet with her hair: and the house was filled with the odour of the ointment.',
        'Judas Iscariot murmured that it should have been sold for the poor — not because he cared for the poor, but because he was a thief.',
        'Jesus said, "Let her alone: against the day of my burying hath she kept this. For the poor always ye have with you; but me ye have not always."'
      ],
      imagePrompts: [
        'warm cartoon: supper at Bethany, Lazarus at table with Jesus, friendly light, no text',
        'kid illustration: Martha serving, simple joyful meal, no text',
        'reverent colorful scene: Mary pouring costly spikenard on Jesus\' feet, hair as towel, no text',
        'calm scene: Judas frowning, complaint in air, contrast with Mary\'s love, no text',
        'tender ending: Jesus defending Mary, beautiful act remembered, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Mary gave Jesus her best — costly love!',
      quizHeading: 'Mary Anoints Jesus\' Feet Questions',
      questions: [
        {
          question: 'Where did this supper happen?',
          choices: ['Jerusalem wall', 'Bethany', 'Nazareth', 'Capernaum sea'],
          correctIndex: 1,
          correctFeedback: 'Yes! Bethany, where Lazarus lived.',
          wrongFeedback: 'Jesus came to Bethany, where Lazarus was (John 12:1).'
        },
        {
          question: 'Who served at the supper?',
          choices: ['Lazarus only', 'Martha', 'Peter', 'Mary only'],
          correctIndex: 1,
          correctFeedback: 'Right! Martha served.',
          wrongFeedback: 'They made him a supper; and Martha served (John 12:2).'
        },
        {
          question: 'What did Mary pour on Jesus\' feet?',
          choices: ['Water only', 'Ointment of spikenard, very costly', 'Wine', 'Oil for lamps'],
          correctIndex: 1,
          correctFeedback: 'Yes! Ointment of spikenard, very costly.',
          wrongFeedback: 'Mary took a pound of ointment of spikenard, very costly (John 12:3).'
        },
        {
          question: 'Who complained about the ointment?',
          choices: ['Martha', 'Judas Iscariot', 'Lazarus', 'Nicodemus'],
          correctIndex: 1,
          correctFeedback: 'Yes! Judas Iscariot.',
          wrongFeedback: 'Then saith one of his disciples, Judas Iscariot… (John 12:4).'
        },
        {
          question: 'What can we learn from Mary?',
          choices: ['Hide love for Jesus', 'Extravagant love for Jesus is precious to Him', 'Only money matters', 'Never give gifts'],
          correctIndex: 1,
          correctFeedback: 'Perfect! Love for Jesus is precious to Him.',
          wrongFeedback: 'Jesus said Mary kept it against the day of His burying — her act was worship, not waste.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — love Jesus with your best!',
      takeaway: 'Give Jesus your best — costly love honors Him.',
      prayer: 'Jesus, thank You for receiving my love. Help me honor You with my heart. Amen.'
    },

    ruthMoab: {
      kjvRef: 'Ruth 1',
      paragraphs: [
        'In the days when the judges ruled there was a famine in the land. Elimelech, his wife Naomi, and their two sons left Bethlehemjudah to sojourn in the country of Moab.',
        'Elimelech died. His sons took wives of Moab — Orpah and Ruth. Then both sons died also; Naomi was left without her two sons and her husband.',
        'Naomi heard the Lord had visited His people with bread. She arose to return to Bethlehem, and urged her daughters in law to go back to their mothers\' houses and find rest.',
        'Orpah kissed Naomi and returned. Ruth clave unto her. Ruth said, "Entreat me not to leave thee… for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God."',
        'When Naomi saw Ruth was stedfastly minded to go with her, she left speaking unto her. So they went until they came to Bethlehem in the beginning of barley harvest.'
      ],
      imagePrompts: [
        'gentle cartoon: family traveling dusty road from Bethlehem toward Moab, famine feeling, no text',
        'kid illustration: Naomi sorrowful, Ruth and Orpah beside her, loss and kindness, no text',
        'colorful scene: Naomi urging daughters in law, tears, hard goodbye, no text',
        'warm loyal scene: Ruth clinging to Naomi, vow of faithfulness, no text',
        'hopeful ending: two women entering Bethlehem at barley harvest, new chapter, God\'s hand, no text'
      ],
      readAlongImages: [],
      hintAboveQuiz: 'Ruth chose Naomi\'s God — loyal love!',
      quizHeading: 'Ruth and Naomi Questions',
      questions: [
        {
          question: 'Why did Elimelech\'s family go to Moab?',
          choices: ['For a party', 'Because of famine in Judah', 'To fight a war', 'To see the king'],
          correctIndex: 1,
          correctFeedback: 'Yes! Because of famine.',
          wrongFeedback: 'There was a famine in the land… they went to sojourn in Moab (Ruth 1:1–2).'
        },
        {
          question: 'What happened to Naomi in Moab?',
          choices: ['She became queen', 'She lost her husband and both sons', 'She grew rich', 'She forgot God'],
          correctIndex: 1,
          correctFeedback: 'Right! She lost her husband and both sons.',
          wrongFeedback: 'Elimelech died… Mahlon and Chilion died also (Ruth 1:3–5).'
        },
        {
          question: 'What did Orpah do?',
          choices: ['Stayed silent', 'Kissed Naomi and returned to her people', 'Ran ahead', 'Argued with Ruth'],
          correctIndex: 1,
          correctFeedback: 'Yes! She kissed her and returned.',
          wrongFeedback: 'Orpah kissed her mother in law; but Ruth clave unto her (Ruth 1:14).'
        },
        {
          question: 'What did Ruth say about Naomi\'s God?',
          choices: ['I will find another god', 'Thy God shall be my God', 'I do not believe', 'Tell me later'],
          correctIndex: 1,
          correctFeedback: 'Perfect! "Thy God shall be my God."',
          wrongFeedback: 'Ruth said, "thy people shall be my people, and thy God my God" (Ruth 1:16).'
        },
        {
          question: 'What can we learn from Ruth?',
          choices: ['Loyalty does not matter', 'Faithful love and choosing God\'s people pleases Him', 'Always stay in Moab', 'Never help family'],
          correctIndex: 1,
          correctFeedback: 'Yes! Faithful love pleases God.',
          wrongFeedback: 'Ruth stayed with Naomi and took Naomi\'s God as her own — God honors faithful love.'
        }
      ],
      doneHeading: 'Great Job!',
      doneMessage: 'You earned a star — faithful love!',
      takeaway: 'Stay faithful to those you love — and to God — He leads the way.',
      prayer: 'God, thank You for Ruth\'s example. Help me love faithfully and trust Your plan. Amen.'
    }
};
