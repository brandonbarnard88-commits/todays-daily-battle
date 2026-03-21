/**
 * Read-aloud story blocks + multiple-choice quiz (pedagogical wrong-answer hints).
 * Keys match TDB_BIBLE_STORIES (177 stories).
 * Regenerate: npm run kids:generate-read-quiz
 * Hand-tuned packs: kids/read-quiz-handcrafted.cjs (david, noah, jonah, daniel).
 */
(function (global) {
  'use strict';

  global.TDB_KIDS_READ_QUIZ = {
  "abigailWise": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Abigail's Wisdom.",
      "We read about this in the Bible.",
      "Wise words stop anger and save lives!",
      "Be quick to bring peace, not fuel.",
      "We learn from God and how God cares for Abigail."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "Matthew 28",
          "Jonah 4",
          "1 Samuel 17"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Stephen",
          "God",
          "Jesus"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "Wise words stop anger and save lives! Be quick to bring peace, not fuel.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Wise words stop anger and save lives! Be quick to bring peace, not fuel..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "David's men are angry—Nabal was rude"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Wise words stop anger and save lives! Be quick to bring peace, not fuel.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Wise words stop anger and save lives! Be quick to bring peace, not fuel..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Abigail's Wisdom with God's Word today.",
    "takeaway": "Wise words stop anger and save lives! Be quick to bring peace, not fuel.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Abigail's Wisdom. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David's men are angry—Nabal was rude (abigail)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Abigail quickly brings bread and gifts (wise)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David's anger calms—wise words prevent disaster! (nabal)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David's men are angry—Nabal was rude (1 samuel 25)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Abigail quickly brings bread and gifts (bread)"
    ]
  },
  "abrahamIsaac": {
    "kjvRef": "Genesis 22:1–19",
    "paragraphs": [
      "God promised Abraham and Sarah a son, Isaac, even though they were old. Isaac was born!",
      "Later God tested Abraham. He said, \"Take your son Isaac and offer him as a sacrifice on a mountain.\"",
      "Abraham obeyed, even though it hurt. He took Isaac and wood for the fire to the mountain.",
      "Isaac asked, \"Where is the lamb?\" Abraham said, \"God will provide.\"",
      "Abraham was ready to obey, but God stopped him. He provided a ram caught in a bush instead. God said, \"Because you obeyed, I will bless you greatly.\""
    ],
    "imagePrompts": [
      "bright cartoon for kids: old Abraham and Sarah with baby Isaac, happy family, no text",
      "fun kid illustration: Abraham walking with young Isaac and donkey to the mountain, carrying wood, no text",
      "colorful Bible scene for children: Isaac asking Abraham about the lamb, Abraham answering, trusting faces, no text",
      "gentle cartoon: bright angel light from above, Abraham listening, ram in thicket nearby, no weapons, no text",
      "happy ending illustration: Abraham and Isaac together safely, ram nearby, blessing light, bright colors, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "Abraham trusted God completely — even when it was hard!",
    "quizHeading": "Abraham & Isaac Questions",
    "questions": [
      {
        "question": "Who did God promise to Abraham and Sarah?",
        "choices": [
          "A daughter",
          "A son named Isaac",
          "A big house",
          "Many animals"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! God kept His promise — Isaac was born when they were old.",
        "wrongFeedback": "Not animals or a house. God promised a son, even in old age (Genesis 21:1–3)."
      },
      {
        "question": "What did God ask Abraham to do as a test?",
        "choices": [
          "Give away all his sheep",
          "Offer Isaac as a sacrifice",
          "Move to a new land again",
          "Build an altar"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! God tested Abraham's faith with a very hard command.",
        "wrongFeedback": "He had already moved. This test was to offer his son Isaac — but God had a plan (Genesis 22:2)."
      },
      {
        "question": "What did Isaac ask on the way?",
        "choices": [
          "Are we there yet?",
          "Where is the lamb?",
          "Can I go home?",
          "Is this a game?"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! \"Where is the lamb for the sacrifice?\"",
        "wrongFeedback": "Isaac was carrying wood and noticed something missing. He asked about the lamb (Genesis 22:7)."
      },
      {
        "question": "What did Abraham answer about the lamb?",
        "choices": [
          "We forgot it",
          "God will provide",
          "You are the lamb",
          "We don't need one"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! \"God Himself will provide the lamb.\" Abraham trusted God.",
        "wrongFeedback": "Abraham didn't say they forgot. He believed God would provide — and He did!"
      },
      {
        "question": "What happened when Abraham obeyed?",
        "choices": [
          "God stopped him and provided a ram",
          "The sacrifice happened",
          "Isaac ran away",
          "God was angry"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes! God stopped him and provided a ram caught in a bush.",
        "wrongFeedback": "The test ended when Abraham showed faith. God provided the ram instead — He always keeps His promises!"
      }
    ],
    "doneHeading": "You Did It!",
    "doneMessage": "Great job learning about trusting God!",
    "takeaway": "Trust and obey God even when it's hard — He always provides.",
    "prayer": "God, help me trust You completely, even when things are scary. Amen."
  },
  "adamEve": {
    "kjvRef": "Genesis 2:7–25; 3:1–24",
    "hintAboveQuiz": "Remember what God said they could and could not do!",
    "readAlongImages": [],
    "paragraphs": [
      "God made the first man, Adam, from dust and breathed life into him. Adam named all the animals.",
      "God saw Adam needed a helper. He made Eve from Adam's rib while Adam slept.",
      "They lived in a beautiful garden called Eden with God. They could eat any fruit except one tree.",
      "A serpent tricked Eve into eating the forbidden fruit. She gave some to Adam, and he ate too.",
      "Because they disobeyed, sin came into the world. God sent them out of the garden, but He still loved them. One day He would send the Savior, Jesus, to undo what sin broke."
    ],
    "quizHeading": "Adam & Eve Questions",
    "questions": [
      {
        "question": "How did God make Adam?",
        "choices": [
          "From a rib",
          "From dust",
          "From an animal",
          "From light"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! God formed Adam from dust and breathed life into him.",
        "wrongFeedback": "Eve came from Adam's rib later. Adam was made from the ground (Genesis 2:7)."
      },
      {
        "question": "What did God make for Adam because he was alone?",
        "choices": [
          "A new animal",
          "Eve",
          "A house",
          "More friends"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! God made Eve from Adam's rib to be his helper.",
        "wrongFeedback": "Adam named the animals, but none was right for him. God made Eve specially (Genesis 2:18–22)."
      },
      {
        "question": "What was the one tree they could not eat from?",
        "choices": [
          "Tree of life",
          "Tree of knowledge of good and evil",
          "Orange tree",
          "Banana tree"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! God said not to eat from that tree.",
        "wrongFeedback": "The tree of life was different. God warned them about the tree of knowledge of good and evil (Genesis 2:17)."
      },
      {
        "question": "Who tricked Eve into eating the fruit?",
        "choices": [
          "Adam",
          "The serpent",
          "God",
          "An angel"
        ],
        "correctIndex": 1,
        "correctFeedback": "Correct! The serpent (Satan) tricked her.",
        "wrongFeedback": "Adam ate after Eve. The Bible says the serpent was more subtle and deceived her (Genesis 3:1–6)."
      },
      {
        "question": "What happened because Adam and Eve disobeyed?",
        "choices": [
          "They stayed in Eden forever",
          "Sin came into the world",
          "They got more fruit",
          "Nothing changed"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Sin entered, but God still loved them and planned the Savior.",
        "wrongFeedback": "They had to leave Eden. Disobedience brought sin and separation, but God still cared for them."
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star — God still loves us even when we disobey.",
    "takeaway": "God made us to live with Him, but sin separates us — He sent Jesus to bring us back.",
    "prayer": "God, forgive me when I disobey. Thank You for loving me and sending Jesus. Amen.",
    "imagePrompts": [
      "bright cartoon for kids: God forming Adam from dust, breath of life, garden background, no text",
      "fun kid illustration: Adam naming animals in Eden, smiling, friendly animals around him, no text",
      "colorful Bible scene for children: God creating Eve while Adam sleeps, gentle peaceful light, no text",
      "serious kid-safe cartoon: Eve and Adam near the forbidden tree, serpent nearby, humble colors not scary, no text",
      "hopeful ending illustration: Adam and Eve leaving Eden, distant light suggesting God's promise, no text"
    ]
  },
  "alphaOmega": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "I Am the Alpha and Omega.",
      "We read about this in the Bible.",
      "God started everything and He finishes it!",
      "He has the first word and the last word.",
      "We learn from God and how God cares for John."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 13",
          "Jonah 4",
          "the Bible",
          "Matthew 7"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Stephen",
          "The crowds",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God started everything and He finishes it! He has the first word and the last word.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God started everything and He finishes it! He has the first word and the last word..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "\"I am the Alpha and Omega\" says the Lord",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "God started everything and He finishes it! He has the first word and the last word.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God started everything and He finishes it! He has the first word and the last word..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading I Am the Alpha and Omega with God's Word today.",
    "takeaway": "God started everything and He finishes it! He has the first word and the last word.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in I Am the Alpha and Omega. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: \"I am the Alpha and Omega\" says the Lord (alpha)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The first and the last—the beginning and the end (omega)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus is Lord of everything—always! (revelation 1)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: \"I am the Alpha and Omega\" says the Lord (beginning)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The first and the last—the beginning and the end (end)"
    ]
  },
  "alphaOmega2": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Alpha and Omega—The End.",
      "We read about this in the Bible.",
      "Jesus is the start and finish of your story too!",
      "Give Him every chapter.",
      "We learn from Jesus and how God cares for All creation."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Job 2",
          "Galatians 5",
          "the Bible",
          "Exodus 3"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Holy Spirit",
          "Mary",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus is the start and finish of your story too! Give Him every chapter.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus is the start and finish of your story too! Give Him every chapter..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "I am the Alpha and the Omega, the First and Last",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Jesus is the start and finish of your story too! Give Him every chapter.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus is the start and finish of your story too! Give Him every chapter..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Alpha and Omega—The End with God's Word today.",
    "takeaway": "Jesus is the start and finish of your story too! Give Him every chapter.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Alpha and Omega—The End. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: I am the Alpha and the Omega, the First and Last (alpha omega)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The beginning and the end—Jesus is eternal (revelation 22)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He was, He is, and He is to come—forever! (first)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: I am the Alpha and the Omega, the First and Last (last)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The beginning and the end—Jesus is eternal (beginning)"
    ]
  },
  "angelMary": {
    "kjvRef": "Luke 1",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Angel Visits Mary.",
      "We read about this in Luke 1.",
      "God chooses ordinary people!",
      "When God calls you, say yes like Mary.",
      "We learn from God and how God cares for Mary."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Ephesians 6",
          "Luke 1",
          "Genesis 28:12",
          "1 Kings 18"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 1.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Mary",
          "The crowds",
          "Holy Spirit"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "God chooses ordinary people! When God calls you, say yes like Mary."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God chooses ordinary people! When God calls you, say yes like Mary..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Angel Gabriel appears with a lily",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "God chooses ordinary people! When God calls you, say yes like Mary.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God chooses ordinary people! When God calls you, say yes like Mary..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Angel Visits Mary with God's Word today.",
    "takeaway": "God chooses ordinary people! When God calls you, say yes like Mary.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Angel Visits Mary. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Angel Gabriel appears with a lily (angel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Gabriel says: Fear not, Mary—you are chosen! (mary)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary says: I will do what God says! (gabriel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Angel Gabriel appears with a lily (luke 1)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Gabriel says: Fear not, Mary—you are chosen! (fear not)"
    ]
  },
  "annaProphet": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Anna the Prophetess.",
      "We read about this in the Bible.",
      "Never stop praying!",
      "Like Anna—stay close to God and He will show you His glory.",
      "We learn from God and how God cares for Anna."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Daniel 6",
          "Jonah 1:17",
          "the Bible",
          "Luke 10"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Mary",
          "Holy Spirit",
          "David"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "Never stop praying! Like Anna—stay close to God and He will show you His glory."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Never stop praying! Like Anna—stay close to God and He will show you His glory..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Anna prays in the temple day and night",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Never stop praying! Like Anna—stay close to God and He will show you His glory.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Never stop praying! Like Anna—stay close to God and He will show you His glory..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Anna the Prophetess with God's Word today.",
    "takeaway": "Never stop praying! Like Anna—stay close to God and He will show you His glory.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Anna the Prophetess. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Anna prays in the temple day and night (anna)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary and Joseph bring baby Jesus to the temple (prophet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Anna sees Jesus—she praises God! (temple)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Anna prays in the temple day and night (luke 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary and Joseph bring baby Jesus to the temple (baby jesus)"
    ]
  },
  "armorBelt": {
    "kjvRef": "Ephesians 6",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Belt of Truth.",
      "We read about this in Ephesians 6.",
      "Truth is your foundation!",
      "Know what God says—and stand on it every day.",
      "We learn from Paul and how God cares for Christians."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Esther 5",
          "Mark 10",
          "Luke 15",
          "Ephesians 6"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Ephesians 6.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Mary",
          "Paul",
          "Stephen"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Paul.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "Truth is your foundation! Know what God says—and stand on it every day.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Truth is your foundation! Know what God says—and stand on it every day..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A warrior puts on the belt of truth",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Truth is your foundation! Know what God says—and stand on it every day."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Truth is your foundation! Know what God says—and stand on it every day..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Belt of Truth with God's Word today.",
    "takeaway": "Truth is your foundation! Know what God says—and stand on it every day.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Belt of Truth. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A warrior puts on the belt of truth (armor)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Truth holds everything together (belt)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Stand firm in God's truth—it never changes! (truth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A warrior puts on the belt of truth (ephesians 6)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Truth holds everything together (stand)"
    ]
  },
  "armorOfGod": {
    "kjvRef": "Ephesians 6",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Armor of God.",
      "We read about this in Ephesians 6.",
      "Put on God's armor—you're strong!",
      "Truth, faith, peace—stand firm!",
      "We learn from Paul and how God cares for Christians in Ephesus."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Acts 8",
          "Exodus 7–12",
          "Exodus 14:21",
          "Ephesians 6"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Ephesians 6.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Holy Spirit",
          "David",
          "Mary"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Paul.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "Put on God's armor—you're strong! Truth, faith, peace—stand firm!",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Put on God's armor—you're strong! Truth, faith, peace—stand firm!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Belt of truth, breastplate",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older.",
          "Put on God's armor—you're strong! Truth, faith, peace—stand firm!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Put on God's armor—you're strong! Truth, faith, peace—stand firm!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Armor of God with God's Word today.",
    "takeaway": "Put on God's armor—you're strong! Truth, faith, peace—stand firm!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Armor of God. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Belt of truth, breastplate (armor)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Helmet, shield, sword (ephesians 6)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Put on God's armor—you're strong! (helmet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Belt of truth, breastplate (sword)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Helmet, shield, sword (shield)"
    ]
  },
  "armorShield": {
    "kjvRef": "Ephesians 6",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Shield of Faith.",
      "We read about this in Ephesians 6.",
      "Hold up your shield of faith!",
      "When doubt or fear comes, believe—God blocks it.",
      "We learn from Paul and how God cares for Christians."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 41:41",
          "Ephesians 6",
          "Exodus 14",
          "Nehemiah 4"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Ephesians 6.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "David",
          "Holy Spirit",
          "Jesus"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Paul.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Hold up your shield of faith! When doubt or fear comes, believe—God blocks it."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Hold up your shield of faith! When doubt or fear comes, believe—God blocks it..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A knight holds up his shield",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Hold up your shield of faith! When doubt or fear comes, believe—God blocks it.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Hold up your shield of faith! When doubt or fear comes, believe—God blocks it..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Shield of Faith with God's Word today.",
    "takeaway": "Hold up your shield of faith! When doubt or fear comes, believe—God blocks it.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Shield of Faith. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A knight holds up his shield (armor)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Arrows of doubt and fear fly—blocked by faith (shield)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Stand firm—faith stops every attack! (faith)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A knight holds up his shield (ephesians 6)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Arrows of doubt and fear fly—blocked by faith (arrows)"
    ]
  },
  "armorSword": {
    "kjvRef": "Ephesians 6",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Sword of the Spirit.",
      "We read about this in Ephesians 6.",
      "Know your Bible!",
      "God's Word is a sword—it defeats darkness and confusion.",
      "We learn from Paul and how God cares for Christians."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 2",
          "Acts 9",
          "John 11:43-44",
          "Ephesians 6"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Ephesians 6.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Mary",
          "Holy Spirit",
          "The crowds"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Paul.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "Know your Bible! God's Word is a sword—it defeats darkness and confusion.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Know your Bible! God's Word is a sword—it defeats darkness and confusion..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A sword labeled \"Word of God\"",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Know your Bible! God's Word is a sword—it defeats darkness and confusion."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Know your Bible! God's Word is a sword—it defeats darkness and confusion..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Sword of the Spirit with God's Word today.",
    "takeaway": "Know your Bible! God's Word is a sword—it defeats darkness and confusion.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Sword of the Spirit. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A sword labeled \"Word of God\" (armor)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus used Scripture against the devil (sword)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Know God's Word—it's your best weapon! (word)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A sword labeled \"Word of God\" (ephesians 6)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus used Scripture against the devil (scripture)"
    ]
  },
  "ascension": {
    "kjvRef": "Acts 1",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Ascension.",
      "We read about this in Acts 1.",
      "Jesus goes up—He's with God!",
      "He promised to come back—spread His love!",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 18",
          "Acts 27",
          "Acts 1",
          "Ephesians 6"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 1.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Holy Spirit",
          "Paul",
          "David",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus goes up—He's with God! He promised to come back—spread His love!",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus goes up—He's with God! He promised to come back—spread His love!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Jesus with His disciples",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Jesus goes up—He's with God! He promised to come back—spread His love!",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus goes up—He's with God! He promised to come back—spread His love!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Ascension with God's Word today.",
    "takeaway": "Jesus goes up—He's with God! He promised to come back—spread His love!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Ascension. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus with His disciples (ascension)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus goes up to heaven (heaven)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He's with God—He'll come back! (up)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus with His disciples (acts 1)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus goes up to heaven (luke 24)"
    ]
  },
  "balaamDonkey": {
    "kjvRef": "Numbers 22",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Balaam's Talking Donkey.",
      "We read about this in Numbers 22.",
      "God can use anyone to speak truth!",
      "Always listen—even when it's surprising.",
      "We learn from God and how God cares for Balaam."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 13",
          "Genesis 11",
          "Numbers 22",
          "Matthew 7"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Numbers 22.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Holy Spirit",
          "David",
          "Paul"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "God can use anyone to speak truth! Always listen—even when it's surprising."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God can use anyone to speak truth! Always listen—even when it's surprising..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Balaam rides his donkey",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "God can use anyone to speak truth! Always listen—even when it's surprising.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God can use anyone to speak truth! Always listen—even when it's surprising..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Balaam's Talking Donkey with God's Word today.",
    "takeaway": "God can use anyone to speak truth! Always listen—even when it's surprising.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Balaam's Talking Donkey. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Balaam rides his donkey (balaam)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The donkey sees the angel and stops (donkey)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The donkey speaks—God uses anything! (angel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Balaam rides his donkey (numbers 22)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The donkey sees the angel and stops (talking)"
    ]
  },
  "beastMark": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Number 666.",
      "We read about this in the Bible.",
      "Choose Jesus—belong to Him, not the world!",
      "His mark of love is the one that lasts.",
      "We learn from God and how God cares for John."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 16:15",
          "1 Kings 3",
          "the Bible",
          "Acts 16"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "David",
          "Paul",
          "Jesus"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "Choose Jesus—belong to Him, not the world! His mark of love is the one that lasts."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Choose Jesus—belong to Him, not the world! His mark of love is the one that lasts..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "John sees a beast—a symbol of evil power",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Choose Jesus—belong to Him, not the world! His mark of love is the one that lasts.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Choose Jesus—belong to Him, not the world! His mark of love is the one that lasts..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Number 666 with God's Word today.",
    "takeaway": "Choose Jesus—belong to Him, not the world! His mark of love is the one that lasts.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Number 666. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: John sees a beast—a symbol of evil power (beast)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: 666 is the number—a warning to stay true (666)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Choose God's mark—belong to Jesus, not the world! (revelation 13)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: John sees a beast—a symbol of evil power (mark)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: 666 is the number—a warning to stay true (forehead)"
    ]
  },
  "betrayal": {
    "kjvRef": "Matthew 26",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Betrayal (Judas).",
      "We read about this in Matthew 26.",
      "Even friends fail—Jesus forgives!",
      "He still loves you when people hurt you.",
      "We learn from Jesus and how God cares for Judas."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Esther 4",
          "Matthew 26",
          "Luke 22",
          "John 10"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 26.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Stephen",
          "God",
          "The crowds"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Even friends fail—Jesus forgives! He still loves you when people hurt you."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Even friends fail—Jesus forgives! He still loves you when people hurt you..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Judas leads the crowd",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Even friends fail—Jesus forgives! He still loves you when people hurt you.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Even friends fail—Jesus forgives! He still loves you when people hurt you..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Betrayal (Judas) with God's Word today.",
    "takeaway": "Even friends fail—Jesus forgives! He still loves you when people hurt you.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Betrayal (Judas). Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Judas leads the crowd (judas)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Judas kisses Jesus (betrayal)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Friends fail—Jesus forgives! (kiss)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Judas leads the crowd (matthew 26)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Judas kisses Jesus (mark 14)"
    ]
  },
  "burningBush": {
    "kjvRef": "Exodus 3:2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Burning Bush – Exodus 3:2. Moses was taking care of sheep when he saw something amazing—a bush burning with fire but not burning up.",
      "He went closer. God called from the bush, 'Moses, Moses!' God said, 'I am the God of your fathers.",
      "I have seen My people's suffering in Egypt. Go tell Pharaoh to let them go.' Moses was afraid, but God promised, 'I will be with you.' God even told Moses His name: 'I AM THAT I AM.' God speaks to us!",
      "For you: God still speaks today—through the Bible, prayer, and when your heart feels a gentle nudge.",
      "Listen, trust, and obey when He calls your name."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 3:2",
          "Genesis 1",
          "Joshua 6:20",
          "John 6"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 3:2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Stephen",
          "Paul",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Moses saw a bush on fire but not burning up. God spoke from the bush and told Moses His name and plan. God speaks to us too—through His…",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Moses saw a bush on fire but not burning up. God spoke from the bush and told Moses His….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Moses seeing the burning bush – Fire but no ashes",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God still speaks today—through the Bible, prayer, and when your heart feels a gentle nudge. Listen, trust, and obey…",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God still speaks today—through the Bible, prayer, and when your heart feels a gentle….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Burning Bush with God's Word today.",
    "takeaway": "Moses saw a bush on fire but not burning up. God spoke from the bush and told Moses His name and plan. God speaks to us too—through His Word, prayer, and quiet moments. Listen for His voice and obey…",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Burning Bush. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses seeing the burning bush – Fire but no ashes (moses)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God speaking from the bush – Calling Moses by name (burning bush)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses taking off his shoes – Holy ground with God (fire)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses seeing the burning bush – Fire but no ashes (exodus 3)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God speaking from the bush – Calling Moses by name (holy ground)"
    ]
  },
  "cainAbel": {
    "kjvRef": "Genesis 4:1–16",
    "paragraphs": [
      "Adam and Eve had two sons: Cain and Abel. Cain was a farmer, Abel was a shepherd.",
      "They brought offerings to God. Abel brought the best of his lambs — God was pleased.",
      "Cain brought some of his crops, but his heart wasn't right. God was not pleased.",
      "Cain got very angry. God warned him, \"Sin is waiting to control you — do what is right.\"",
      "Cain didn't listen. He hurt Abel. God asked, \"Where is your brother?\" Cain said, \"I don't know.\" God punished Cain, but also protected him with a mark."
    ],
    "imagePrompts": [
      "bright bouncy cartoon for kids: Cain farming crops, Abel tending sheep, brothers working, no text",
      "colorful kid illustration: Cain and Abel bringing offerings to God, Abel with lamb, Cain with crops, no text",
      "fun Bible scene for children: God accepting Abel's offering, warm light, Cain looking angry, no text",
      "sad gentle cartoon: empty field, sense of loss and sorrow after brothers fought, no violence shown, no text",
      "hopeful ending illustration: God talking to Cain, mark for protection, distant road, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "Look at the hearts of Cain and Abel!",
    "quizHeading": "Cain & Abel Questions",
    "questions": [
      {
        "question": "What did Abel bring to God?",
        "choices": [
          "Crops from his farm",
          "The best of his lambs",
          "A song",
          "Money"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Abel brought the best of his flock — God was pleased.",
        "wrongFeedback": "Cain brought crops. Abel brought the best lambs because he gave from his heart (Genesis 4:4)."
      },
      {
        "question": "Why was God not pleased with Cain's offering?",
        "choices": [
          "It was too small",
          "Cain's heart wasn't right",
          "It was the wrong food",
          "God doesn't like vegetables"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! God looks at our hearts, not just what we give.",
        "wrongFeedback": "Size didn't matter. The Bible says Cain's offering was rejected because his heart wasn't right (Genesis 4:5)."
      },
      {
        "question": "What did God warn Cain about?",
        "choices": [
          "Sin is waiting to control you",
          "Be nicer to Abel",
          "Give more offerings",
          "Don't eat fruit"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes! God said sin was like a wild animal waiting to attack — choose right!",
        "wrongFeedback": "God wasn't talking about fruit. He warned Cain that sin was crouching at the door, ready to control him if he didn't do right (Genesis 4:7)."
      },
      {
        "question": "What did Cain do to Abel?",
        "choices": [
          "Shared his food",
          "Helped him",
          "Hurt him",
          "Played with him"
        ],
        "correctIndex": 2,
        "correctFeedback": "Correct! Cain hurt his brother because of jealousy.",
        "wrongFeedback": "They were brothers, but Cain was angry. The Bible says Cain attacked and killed Abel (Genesis 4:8)."
      },
      {
        "question": "What can we learn from Cain and Abel?",
        "choices": [
          "Give God your best",
          "Be jealous",
          "Hurt others when angry",
          "Hide from God"
        ],
        "correctIndex": 0,
        "correctFeedback": "Perfect! Give God your best with a right heart — He knows what's inside.",
        "wrongFeedback": "The story shows jealousy and anger lead to sin. But Abel gave from a good heart — that's what pleases God!"
      }
    ],
    "doneHeading": "You Did It!",
    "doneMessage": "Great job learning about giving God your best!",
    "takeaway": "God looks at our hearts. Give Him your best with love.",
    "prayer": "God, help me give You my best with a happy heart. Amen."
  },
  "comeLordJesus": {
    "kjvRef": "Revelation 22",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "\"Come, Lord Jesus!\".",
      "We read about this in Revelation 22.",
      "The last word of the Bible is a prayer: Come, Lord Jesus!",
      "Say it with your whole heart.",
      "We learn from Jesus and how God cares for John."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Revelation 22",
          "Acts 16",
          "Exodus 16:15",
          "John 6"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Revelation 22.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Jesus",
          "Holy Spirit",
          "David"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "The last word of the Bible is a prayer: Come, Lord Jesus! Say it with your whole heart.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: The last word of the Bible is a prayer: Come, Lord Jesus! Say it with your whole heart..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "John hears Jesus say: I am coming quickly!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "The last word of the Bible is a prayer: Come, Lord Jesus! Say it with your whole heart.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: The last word of the Bible is a prayer: Come, Lord Jesus! Say it with your whole heart..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading \"Come, Lord Jesus!\" with God's Word today.",
    "takeaway": "The last word of the Bible is a prayer: Come, Lord Jesus! Say it with your whole heart.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in \"Come, Lord Jesus!\". Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: John hears Jesus say: I am coming quickly! (come lord jesus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: John answers: Amen—come, Lord Jesus! (revelation 22)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Every heart that loves Him says: come! (amen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: John hears Jesus say: I am coming quickly! (quickly)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: John answers: Amen—come, Lord Jesus! (maranatha)"
    ]
  },
  "creation": {
    "kjvRef": "Genesis 1",
    "hintAboveQuiz": "Remember what God made each day!",
    "readAlongImages": [],
    "paragraphs": [
      "In the beginning, God created everything. There was nothing, just darkness.",
      "On Day 1, God said, \"Let there be light!\" And there was light. He called it day and night.",
      "On Day 2, God made the sky and separated waters above and below.",
      "On Day 3, He made dry land, seas, and plants of every kind.",
      "On Day 4, God made the sun, moon, and stars. On Day 5, He made birds and sea creatures. On Day 6, He made animals and people. God saw everything was good."
    ],
    "quizHeading": "Creation Days",
    "questions": [
      {
        "question": "What did God create on Day 1?",
        "choices": [
          "Animals",
          "Light",
          "Plants",
          "Stars"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! God said \"Let there be light\" — and there was light!",
        "wrongFeedback": "Not quite. Animals and plants came later. On Day 1, God made light and separated it from darkness (Genesis 1:3)."
      },
      {
        "question": "What did God make on Day 3?",
        "choices": [
          "Sun and moon",
          "Birds and fish",
          "Dry land and plants",
          "People"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right! Dry land, seas, and all kinds of plants.",
        "wrongFeedback": "Sun and moon were Day 4, birds and fish Day 5, people Day 6. Day 3 was land and plants growing!"
      },
      {
        "question": "What did God say after making everything?",
        "choices": [
          "It is okay",
          "It is good",
          "It is perfect",
          "It is finished"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! \"God saw all that He had made, and it was very good.\"",
        "wrongFeedback": "Close, but the Bible says \"very good\" — everything was perfect at the start!"
      },
      {
        "question": "Who did God make on Day 6?",
        "choices": [
          "Only animals",
          "Birds and fish",
          "Animals and people",
          "Stars and sky"
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly! Animals and then man and woman — in His image.",
        "wrongFeedback": "Birds/fish were Day 5, stars/sky earlier. Day 6 was land animals and people."
      },
      {
        "question": "What does Creation teach us?",
        "choices": [
          "God made everything",
          "God is weak",
          "Nothing matters",
          "We are alone"
        ],
        "correctIndex": 0,
        "correctFeedback": "Perfect! God created everything good — and He made us special.",
        "wrongFeedback": "The big truth is God made everything on purpose. He is powerful and loves us!"
      }
    ],
    "doneHeading": "Wow!",
    "doneMessage": "You earned a star — God made you too!",
    "takeaway": "God created everything good, and He made us in His image to love Him.",
    "prayer": "God, thank You for making the world and me. You are amazing! Amen.",
    "imagePrompts": [
      "bright bouncy cartoon for kids: dark empty void before creation, God's light starting to shine, no text",
      "fun kid illustration: Day 1 — light and darkness separated, bright sun-like glow vs night, no text",
      "colorful Bible scene for children: Day 2 — blue sky forming, waters above and below, fluffy clouds, no text",
      "exciting cartoon: Day 3 — land rising from sea, green plants and trees growing everywhere, no text",
      "happy ending illustration: Days 4–6 — sun/moon/stars, birds flying, animals and people in garden, warm golden light, no text"
    ]
  },
  "creationLight": {
    "kjvRef": "Genesis 1:1–5",
    "hintAboveQuiz": "Remember what God did on the very first day!",
    "readAlongImages": [],
    "paragraphs": [
      "In the beginning, God created the heavens and the earth. Everything was dark and empty.",
      "God said, \"Let there be light!\" And there was light. God saw that the light was good.",
      "He separated the light from the darkness. God called the light \"day\" and the darkness \"night\".",
      "There was evening, and there was morning — the first day.",
      "God made light on the very first day so we could see His wonderful creation."
    ],
    "quizHeading": "Day 1 Questions",
    "questions": [
      {
        "question": "What was everything like before God started creating?",
        "choices": [
          "Bright and colorful",
          "Dark and empty",
          "Full of animals",
          "Covered in water"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! It was dark and empty — then God began.",
        "wrongFeedback": "Not quite. The Bible says the earth was without form and empty, and darkness was upon the face of the deep (Genesis 1:2). God started with nothing ready yet!"
      },
      {
        "question": "What did God say on the first day?",
        "choices": [
          "Let there be animals",
          "Let there be light",
          "Let there be people",
          "Let there be stars"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! \"Let there be light!\" — and light appeared.",
        "wrongFeedback": "Animals and people came much later. On Day 1, God commanded light to appear (Genesis 1:3)."
      },
      {
        "question": "What did God call the light?",
        "choices": [
          "Night",
          "Day",
          "Sky",
          "Stars"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! He called the light \"day\" and the darkness \"night\".",
        "wrongFeedback": "Night is darkness. God named the light \"day\" so we could tell time (Genesis 1:5)."
      },
      {
        "question": "What happened after God made light?",
        "choices": [
          "He rested",
          "He separated it from darkness",
          "He made plants",
          "He made animals"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! He separated light from darkness — that was the first day.",
        "wrongFeedback": "Rest came later. Plants were Day 3, animals Day 6. First He separated light and dark."
      },
      {
        "question": "What does Day 1 teach us about God?",
        "choices": [
          "God likes darkness",
          "God speaks and things happen",
          "God needs help",
          "God is weak"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! God just spoke — \"Let there be light\" — and it happened. He is powerful!",
        "wrongFeedback": "The story shows God's word has power. He did not need help — His command was enough!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star — God spoke light into being!",
    "takeaway": "God is powerful — He speaks and creation listens.",
    "prayer": "God, thank You for making light. Help me listen to Your words every day. Amen.",
    "imagePrompts": [
      "bright bouncy cartoon for kids: completely dark empty void before creation, no light anywhere, no text",
      "fun kid illustration: bright words \"Let there be light\" feeling, glow breaking through darkness, colorful burst, no text on image",
      "colorful Bible scene for children: light and darkness separated, day side bright, night side dark and starry, no text",
      "exciting cartoon: first day complete, warm light over land and sea, peaceful feel, no text",
      "happy ending illustration: beautiful sunrise over waters, sense of God's good gift of light, gold accents, no text"
    ]
  },
  "crossCarry": {
    "kjvRef": "Luke 23",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Simon Helps Carry the Cross.",
      "We read about this in Luke 23.",
      "God calls us to help carry each other's burdens!",
      "Be a Simon for someone today.",
      "We learn from God and how God cares for Simon."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 23",
          "Matthew 6",
          "Exodus 7",
          "John 20"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 23.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "David",
          "Paul",
          "Jesus",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God calls us to help carry each other's burdens! Be a Simon for someone today.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God calls us to help carry each other's burdens! Be a Simon for someone today..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Jesus is made to carry His cross",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God calls us to help carry each other's burdens! Be a Simon for someone today.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God calls us to help carry each other's burdens! Be a Simon for someone today..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Simon Helps Carry the Cross with God's Word today.",
    "takeaway": "God calls us to help carry each other's burdens! Be a Simon for someone today.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Simon Helps Carry the Cross. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus is made to carry His cross (cross)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Simon of Cyrene is asked to help (simon)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Sometimes God calls us to help carry burdens (carry)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus is made to carry His cross (luke 23)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Simon of Cyrene is asked to help (cyrene)"
    ]
  },
  "crucifixion": {
    "kjvRef": "John 19",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Crucifixion.",
      "We read about this in John 19.",
      "Jesus dies for us—love wins!",
      "He took our sins so we could be free!",
      "We learn from Jesus and how God cares for The whole world."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "John 19",
          "Exodus 32",
          "Daniel 6:22",
          "Matthew 3"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: John 19.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Mary",
          "Stephen",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Jesus dies for us—love wins! He took our sins so we could be free!",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus dies for us—love wins! He took our sins so we could be free!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Jesus carries the cross",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Jesus dies for us—love wins! He took our sins so we could be free!",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus dies for us—love wins! He took our sins so we could be free!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Crucifixion with God's Word today.",
    "takeaway": "Jesus dies for us—love wins! He took our sins so we could be free!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Crucifixion. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus carries the cross (crucifixion)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus on the cross (cross)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus dies for us—love wins! (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus carries the cross (matthew 27)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus on the cross (john 19)"
    ]
  },
  "daniel": {
    "kjvRef": "Daniel 6",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Daniel loved God and had served King Darius faithfully. Jealous leaders tricked the king into making a law: for thirty days, no one could pray to anyone except the king—or they would be thrown to the lions.",
      "Daniel knew the law, but he also knew God came first. He went home, opened his window toward Jerusalem, and prayed three times a day like he always had. He did not hide.",
      "The men caught Daniel praying and told the king. The king liked Daniel, but the law could not be changed. Daniel was thrown into a den of hungry lions. A stone was placed over the door.",
      "The king could not sleep. At dawn he ran to the den and called, \"Daniel, servant of the living God, hath thy God delivered thee?\" Daniel answered that God had sent His angel and shut the lions' mouths—they had not hurt him, because he was innocent before God.",
      "King Darius told everyone to respect Daniel's God—the God who delivers and saves. Daniel's brave faith reminds us: obey God first, even when rules feel scary. God can shut the \"lions\" we fear."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Why was Daniel thrown into the lions' den?",
        "choices": [
          "He stole from the king",
          "He kept praying to God even when a law said not to",
          "He was mean to animals",
          "He forgot to go to work"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Daniel obeyed God instead of the wrong law.",
        "wrongFeedback": "What was the new rule about prayer—and what did Daniel still do openly? Reread paragraphs one and two. (Answer: He kept praying to God even when a law said not to.)"
      },
      {
        "question": "What did Daniel do every day at home?",
        "choices": [
          "He hid under his bed",
          "He prayed with his window open toward Jerusalem",
          "He only ate dessert",
          "He wrote letters to lions"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—his habit was to pray honestly to God.",
        "wrongFeedback": "Find the sentence about his window and Jerusalem. (Answer: He prayed with his window open toward Jerusalem.)"
      },
      {
        "question": "Who shut the lions' mouths so Daniel was safe?",
        "choices": [
          "The king sneaked in at night",
          "God sent His angel",
          "Daniel sang them to sleep with a lullaby",
          "The lions were not real"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—Daniel said God sent His angel (Daniel 6:22, KJV).",
        "wrongFeedback": "What does Daniel tell the king about his protection? Look at his answer from inside the den. (Answer: God sent His angel.)"
      },
      {
        "question": "How did the king feel before morning?",
        "choices": [
          "He slept peacefully",
          "He worried and could not rest",
          "He threw a party",
          "He forgot about Daniel"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—the king cared and hurried to the den at dawn.",
        "wrongFeedback": "Read the sentence that starts the night after Daniel was thrown in. (Answer: He worried and could not rest.)"
      },
      {
        "question": "What is one lesson for us from Daniel?",
        "choices": [
          "Pray only when it is easy",
          "We can obey God first, even when we are afraid",
          "Lions are pets",
          "Laws never matter"
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—faith sometimes means courage, and God is with us.",
        "wrongFeedback": "Think: did Daniel hide his faith or show it? Who helped him in the den? (Answer: We can obey God first, even when we are afraid.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job learning from Daniel's courage.",
    "takeaway": "God sees you when you choose to do right. You can pray like Daniel—openly and honestly.",
    "prayer": "God, help me do right even when I feel scared, and thank You for being with me. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon: man with peaceful face praying by an open window, soft morning light, simple room, no text.",
      "Hand-drawn bouncy cartoon: worried officials pointing, kind king looking conflicted, scroll with law, no text.",
      "Hand-drawn bouncy cartoon: stone rolled over cave-like den opening, lions silhouettes inside (not gory), dusk, no text.",
      "Hand-drawn bouncy cartoon: king at opening calling down, man inside unharmed among resting lions, gentle style, no text.",
      "Hand-drawn bouncy cartoon: man standing thankful at sunrise, lion napping peacefully behind him, golden light, no text."
    ]
  },
  "danielPray": {
    "kjvRef": "Daniel 6",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Daniel Prays Three Times a Day.",
      "We read about this in Daniel 6.",
      "Nothing should stop you from praying!",
      "God sees your faithfulness.",
      "We learn from God and how God cares for Daniel."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Daniel 6",
          "Luke 22",
          "Exodus 12",
          "John 10"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Daniel 6.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Stephen",
          "God",
          "Paul",
          "Jesus"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "Nothing should stop you from praying! God sees your faithfulness.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Nothing should stop you from praying! God sees your faithfulness..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A new law says no praying"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Nothing should stop you from praying! God sees your faithfulness.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Nothing should stop you from praying! God sees your faithfulness..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Daniel Prays Three Times a Day with God's Word today.",
    "takeaway": "Nothing should stop you from praying! God sees your faithfulness.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Daniel Prays Three Times a Day. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A new law says no praying (daniel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Daniel opens his window and prays anyway (pray)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God protects Daniel! (window)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A new law says no praying (daniel 6)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Daniel opens his window and prays anyway (law)"
    ]
  },
  "david": {
    "kjvRef": "1 Samuel 17",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "God's army and the Philistine army faced each other across a valley. Every day a huge warrior named Goliath came out. He shouted for someone to fight him. God's soldiers felt afraid.",
      "David was young. He was bringing food to his brothers when he heard Goliath. David loved God. He said someone should stand up for God's people.",
      "King Saul's armor was too big for David, so David took it off. He picked up five smooth stones from the brook and his sling. He trusted God—not the spear or sword.",
      "David ran toward Goliath. He said he came in the name of the Lord of hosts. He put one stone in the sling, swung it, and let it fly. The stone hit Goliath. The giant fell. God gave the victory.",
      "David won because God was with him—not because he was the tallest or the strongest. The Bible says, \"The battle is the Lord's\" (1 Samuel 17:47, KJV). When something in your life feels like a giant, you can pray and trust God too."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Who was the giant that scared God's people?",
        "choices": [
          "Saul",
          "Goliath",
          "David",
          "Samuel"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Goliath was the giant. He was loud and scary, but God was bigger.",
        "wrongFeedback": "Not quite. Ask yourself: who walked out every day and dared someone to fight? Reread the first paragraph, then try again. (If you're stuck: the answer is Goliath.)"
      },
      {
        "question": "What did David trust when he went to fight?",
        "choices": [
          "His own strength only",
          "God's help",
          "The king's armor only",
          "Running away"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! David trusted the Lord. He even said the battle belonged to God.",
        "wrongFeedback": "Think about what David said about God's name—and why he took off Saul's heavy armor. Which choice shows trust in God? Try again. (Answer: God's help.)"
      },
      {
        "question": "How many smooth stones did David take from the brook?",
        "choices": [
          "One",
          "Three",
          "Five",
          "Ten"
        ],
        "correctIndex": 2,
        "correctFeedback": "Correct—five stones. God guided one stone to do the job.",
        "wrongFeedback": "Look for the number in the story where David stops at the brook. Count what he picked up, then choose again. (Answer: five.)"
      },
      {
        "question": "What happened when David used his sling?",
        "choices": [
          "The stone missed",
          "Goliath caught the stone",
          "The stone hit Goliath",
          "Goliath ran away first"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes! The stone hit Goliath. God gave the victory.",
        "wrongFeedback": "Picture the scene: one stone, one swing. What does the story say happened next? Check the paragraph about the sling. (Answer: The stone hit Goliath.)"
      },
      {
        "question": "Why did David win?",
        "choices": [
          "He was taller than Goliath",
          "He had the best sword",
          "God was with him",
          "The army fought for him first"
        ],
        "correctIndex": 2,
        "correctFeedback": "Perfect! The battle is the Lord's. God was with David.",
        "wrongFeedback": "David was small. His sling was simple. What did David say about whose battle it was? Reread the last paragraph. (Answer: God was with him.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job thinking through God's story today.",
    "takeaway": "God is stronger than anything that scares us. You can talk to Him anytime.",
    "prayer": "God, when I feel small or afraid, help me trust You like David. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon: young shepherd boy with sling on a green hill, army tents in distance, bright sky, kid-safe, no text.",
      "Hand-drawn bouncy cartoon: very tall armored warrior shouting across a valley, small boy watching bravely, colorful, no text.",
      "Hand-drawn bouncy cartoon: boy choosing smooth stones by a brook, wooden sling, peaceful stream, no text.",
      "Hand-drawn bouncy cartoon: boy with sling mid-action, stone flying toward giant silhouette (not graphic), golden light, no text.",
      "Hand-drawn bouncy cartoon: boy raising hands in thanks on a hillside, soft sunset, peaceful smile, no text."
    ]
  },
  "davidAnointed": {
    "kjvRef": "1 Samuel 16",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "David Is Anointed King.",
      "We read about this in 1 Samuel 16.",
      "God looks at your heart!",
      "Be faithful where you are—He sees you.",
      "We learn from God and how God cares for David."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 4",
          "Acts 2",
          "1 Samuel 16",
          "John 12"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 1 Samuel 16.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Stephen",
          "The crowds",
          "Mary"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "God looks at your heart! Be faithful where you are—He sees you."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God looks at your heart! Be faithful where you are—He sees you..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Samuel visits Jesse's family",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "God looks at your heart! Be faithful where you are—He sees you.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God looks at your heart! Be faithful where you are—He sees you..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading David Is Anointed King with God's Word today.",
    "takeaway": "God looks at your heart! Be faithful where you are—He sees you.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in David Is Anointed King. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samuel visits Jesse's family (david)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God says: man looks at the outside—I look at the heart (anoint)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Oil on David's head—the youngest chosen! (samuel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samuel visits Jesse's family (1 samuel 16)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God says: man looks at the outside—I look at the heart (king)"
    ]
  },
  "davidCave": {
    "kjvRef": "1 Samuel 22",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "David Hides in the Cave.",
      "We read about this in 1 Samuel 22.",
      "Even in dark or scary times, God is with you!",
      "Talk to Him wherever you are.",
      "We learn from David and how God cares for God."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 6",
          "John 20",
          "1 Samuel 22",
          "Exodus 7"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 1 Samuel 22.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "God",
          "David",
          "Jesus"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: David.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Even in dark or scary times, God is with you! Talk to Him wherever you are.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Even in dark or scary times, God is with you! Talk to Him wherever you are..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot.",
          "David hides in the cave of Adullam"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Even in dark or scary times, God is with you! Talk to Him wherever you are.",
          "Ignore God until we are older."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Even in dark or scary times, God is with you! Talk to Him wherever you are..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading David Hides in the Cave with God's Word today.",
    "takeaway": "Even in dark or scary times, God is with you! Talk to Him wherever you are.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in David Hides in the Cave. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David hides in the cave of Adullam (david)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He writes songs to God even here (cave)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God is with David in the dark place (adullam)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David hides in the cave of Adullam (1 samuel 22)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He writes songs to God even here (hiding)"
    ]
  },
  "davidHarp": {
    "kjvRef": "1 Samuel 16",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "David Plays the Harp.",
      "We read about this in 1 Samuel 16.",
      "God loves your worship!",
      "Sing and praise wherever you are.",
      "We learn from David and how God cares for God."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "1 Samuel 16",
          "Genesis 1:3",
          "Matthew 18",
          "Matthew 14"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 1 Samuel 16.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Holy Spirit",
          "Paul",
          "Mary",
          "David"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: David.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God loves your worship! Sing and praise wherever you are.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God loves your worship! Sing and praise wherever you are..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "David watches his sheep in the field",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God loves your worship! Sing and praise wherever you are.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God loves your worship! Sing and praise wherever you are..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading David Plays the Harp with God's Word today.",
    "takeaway": "God loves your worship! Sing and praise wherever you are.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in David Plays the Harp. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David watches his sheep in the field (david)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He plays and sings to God (harp)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God listens—worship from the heart! (worship)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David watches his sheep in the field (sheep)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He plays and sings to God (1 samuel 16)"
    ]
  },
  "davidSheep": {
    "kjvRef": "1 Samuel 17",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "David & the Sheep.",
      "We read about this in 1 Samuel 17.",
      "David protected sheep—God protects us!",
      "Like a shepherd cares for his flock!",
      "We learn from David and how God cares for King Saul."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "1 Samuel 17",
          "Matthew 26",
          "Numbers 13",
          "Esther 7"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 1 Samuel 17.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Mary",
          "Holy Spirit",
          "David"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: David.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "David protected sheep—God protects us! Like a shepherd cares for his flock!",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: David protected sheep—God protects us! Like a shepherd cares for his flock!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "David watches his sheep",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "David protected sheep—God protects us! Like a shepherd cares for his flock!",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: David protected sheep—God protects us! Like a shepherd cares for his flock!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading David & the Sheep with God's Word today.",
    "takeaway": "David protected sheep—God protects us! Like a shepherd cares for his flock!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in David & the Sheep. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David watches his sheep (david)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David fights lion and bear (sheep)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David plays harp—God protects! (shepherd)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David watches his sheep (harp)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David fights lion and bear (lion)"
    ]
  },
  "deborahJudge": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Deborah the Judge.",
      "We read about this in the Bible.",
      "God uses girls too!",
      "Be brave, be wise—He can use you in big ways.",
      "We learn from God and how God cares for Deborah."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 13",
          "Genesis 11",
          "the Bible",
          "Matthew 7"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Mary",
          "Holy Spirit",
          "David"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "God uses girls too! Be brave, be wise—He can use you in big ways."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God uses girls too! Be brave, be wise—He can use you in big ways..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Deborah sits under the palm tree judging",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "God uses girls too! Be brave, be wise—He can use you in big ways.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God uses girls too! Be brave, be wise—He can use you in big ways..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Deborah the Judge with God's Word today.",
    "takeaway": "God uses girls too! Be brave, be wise—He can use you in big ways.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Deborah the Judge. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Deborah sits under the palm tree judging (deborah)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She calls Barak to lead—but goes herself! (judge)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Israel is delivered—God uses Deborah! (palm tree)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Deborah sits under the palm tree judging (judges 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She calls Barak to lead—but goes herself! (barak)"
    ]
  },
  "dorcasRaise": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Dorcas Is Raised to Life.",
      "We read about this in the Bible.",
      "Your kindness matters to God!",
      "And He can raise what seems dead to life again.",
      "We learn from God and how God cares for Dorcas and Peter."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Acts 5",
          "Acts 7",
          "Exodus 2:5",
          "the Bible"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Stephen",
          "God",
          "Paul"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "Your kindness matters to God! And He can raise what seems dead to life again.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Your kindness matters to God! And He can raise what seems dead to life again..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Dorcas loved people—she made clothes for the poor",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Your kindness matters to God! And He can raise what seems dead to life again."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Your kindness matters to God! And He can raise what seems dead to life again..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Dorcas Is Raised to Life with God's Word today.",
    "takeaway": "Your kindness matters to God! And He can raise what seems dead to life again.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Dorcas Is Raised to Life. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Dorcas loved people—she made clothes for the poor (dorcas)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She died—friends mourn and call Peter (raise)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Peter prays—she opens her eyes! Life again! (acts 9)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Dorcas loved people—she made clothes for the poor (peter)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She died—friends mourn and call Peter (clothes)"
    ]
  },
  "dragonFight": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Michael Fights the Dragon.",
      "We read about this in the Bible.",
      "God's angels fight for you!",
      "Evil is already beaten—Jesus won at the cross.",
      "We learn from God and how God cares for John."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "John 11:43-44",
          "Luke 2",
          "Esther 7"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "God",
          "Holy Spirit",
          "Mary"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God's angels fight for you! Evil is already beaten—Jesus won at the cross.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God's angels fight for you! Evil is already beaten—Jesus won at the cross..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A great dragon fights in heaven"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God's angels fight for you! Evil is already beaten—Jesus won at the cross.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God's angels fight for you! Evil is already beaten—Jesus won at the cross..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Michael Fights the Dragon with God's Word today.",
    "takeaway": "God's angels fight for you! Evil is already beaten—Jesus won at the cross.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Michael Fights the Dragon. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A great dragon fights in heaven (dragon)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Michael and the angels battle the dragon (michael)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The dragon is thrown down—God's angels win! (revelation 12)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A great dragon fights in heaven (angels)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Michael and the angels battle the dragon (battle)"
    ]
  },
  "elijahChariot": {
    "kjvRef": "2 Kings 2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Elijah's Fiery Chariot.",
      "We read about this in 2 Kings 2.",
      "God honors His faithful servants!",
      "Heaven is real—and it's wonderful.",
      "We learn from God and how God cares for Elijah."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "2 Kings 2",
          "Daniel 6:22",
          "Luke 10",
          "Mark 12"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 2 Kings 2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Stephen",
          "God",
          "Jesus"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God honors His faithful servants! Heaven is real—and it's wonderful.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God honors His faithful servants! Heaven is real—and it's wonderful..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "Elijah and Elisha walk together"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God honors His faithful servants! Heaven is real—and it's wonderful.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God honors His faithful servants! Heaven is real—and it's wonderful..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Elijah's Fiery Chariot with God's Word today.",
    "takeaway": "God honors His faithful servants! Heaven is real—and it's wonderful.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Elijah's Fiery Chariot. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elijah and Elisha walk together (elijah)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Fiery horses and chariot appear (chariot)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elijah goes up to heaven in a whirlwind! (fire)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elijah and Elisha walk together (2 kings 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Fiery horses and chariot appear (whirlwind)"
    ]
  },
  "elijahFire": {
    "kjvRef": "1 Kings 18",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Elijah & Fire.",
      "We read about this in 1 Kings 18.",
      "God answers with fire—He's real!",
      "The LORD is God—trust Him alone!",
      "We learn from God and how God cares for Elijah and all Israel."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "1 Kings 18",
          "1 Samuel 3",
          "Acts 9",
          "John 11:43-44"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 1 Kings 18.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "David",
          "God",
          "Mary",
          "Holy Spirit"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God answers with fire—He's real! The LORD is God—trust Him alone!",
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God answers with fire—He's real! The LORD is God—trust Him alone!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Elijah vs prophets of Baal"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God answers with fire—He's real! The LORD is God—trust Him alone!",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God answers with fire—He's real! The LORD is God—trust Him alone!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Elijah & Fire with God's Word today.",
    "takeaway": "God answers with fire—He's real! The LORD is God—trust Him alone!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Elijah & Fire. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elijah vs prophets of Baal (elijah)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Baal does nothing (baal)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God sends fire—He's real! (fire)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elijah vs prophets of Baal (carmel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Baal does nothing (1 kings 18)"
    ]
  },
  "elishaOil": {
    "kjvRef": "2 Kings 4",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Elisha & the Widow's Oil.",
      "We read about this in 2 Kings 4.",
      "God multiplies—He provides!",
      "Give God what you have—He can do more!",
      "We learn from God and how God cares for The widow through Elisha."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 1",
          "2 Kings 4",
          "Matthew 6",
          "John 20"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 2 Kings 4.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "The crowds",
          "God",
          "Holy Spirit"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God multiplies—He provides! Give God what you have—He can do more!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God multiplies—He provides! Give God what you have—He can do more!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Widow has only a little oil",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "God multiplies—He provides! Give God what you have—He can do more!",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God multiplies—He provides! Give God what you have—He can do more!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Elisha & the Widow's Oil with God's Word today.",
    "takeaway": "God multiplies—He provides! Give God what you have—He can do more!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Elisha & the Widow's Oil. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Widow has only a little oil (elisha)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elisha says: pour into jars (oil)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Oil multiplies—God provides! (widow)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Widow has only a little oil (2 kings 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elisha says: pour into jars (multiply)"
    ]
  },
  "elishaRaised": {
    "kjvRef": "2 Kings 4",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Elisha Raises a Boy.",
      "We read about this in 2 Kings 4.",
      "God can bring life back!",
      "Nothing is too hard for Him.",
      "We learn from God and how God cares for Elisha and the Shunammite."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 2:5",
          "Acts 7",
          "Acts 5",
          "2 Kings 4"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 2 Kings 4.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Jesus",
          "Stephen",
          "Paul"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "God can bring life back! Nothing is too hard for Him.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God can bring life back! Nothing is too hard for Him..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A Shunammite's son dies",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "God can bring life back! Nothing is too hard for Him."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God can bring life back! Nothing is too hard for Him..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Elisha Raises a Boy with God's Word today.",
    "takeaway": "God can bring life back! Nothing is too hard for Him.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Elisha Raises a Boy. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A Shunammite's son dies (elisha)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elisha stretches over him and prays (raise)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The boy sneezes seven times—alive! (shunammite)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A Shunammite's son dies (2 kings 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elisha stretches over him and prays (boy)"
    ]
  },
  "emmausRoad": {
    "kjvRef": "Luke 24",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Road to Emmaus.",
      "We read about this in Luke 24.",
      "Jesus walks with you even when you don't recognize Him!",
      "He never leaves.",
      "We learn from Jesus and how God cares for Two disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "1 Samuel 22",
          "Genesis 41:41",
          "Revelation 21",
          "Luke 24"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 24.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Stephen",
          "The crowds",
          "God"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "Jesus walks with you even when you don't recognize Him! He never leaves.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus walks with you even when you don't recognize Him! He never leaves..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Two disciples walk to Emmaus, sad",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Jesus walks with you even when you don't recognize Him! He never leaves."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus walks with you even when you don't recognize Him! He never leaves..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Road to Emmaus with God's Word today.",
    "takeaway": "Jesus walks with you even when you don't recognize Him! He never leaves.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Road to Emmaus. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Two disciples walk to Emmaus, sad (emmaus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A stranger joins them—it's Jesus! (road)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He breaks bread—their eyes open! (luke 24)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Two disciples walk to Emmaus, sad (disciples)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A stranger joins them—it's Jesus! (walk)"
    ]
  },
  "esther": {
    "kjvRef": "Esther 4",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Esther Saves Her People – Esther 4. Esther was a queen, but a bad man named Haman wanted to hurt all of God's people.",
      "Esther's uncle Mordecai said, 'Who knows? Maybe you were made queen for such a time as this.' Esther was scared—but she prayed and went to the king.",
      "She told him the truth. The king listened and stopped Haman.",
      "God used Esther to save her people! For you: God put you where you are for a reason.",
      "When it's hard to be brave, pray and step forward. He uses you."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Esther 4",
          "Joshua 6:20",
          "Revelation 22",
          "John 6"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Esther 4.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Jesus",
          "Stephen",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Esther was chosen to be queen. When bad men wanted to hurt God's people, her uncle told her, 'Who knows? Maybe you were made queen for…",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Esther was chosen to be queen. When bad men wanted to hurt God's people, her uncle told….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Esther becomes queen – God puts her in place",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God put you where you are for a reason. When it's hard to be brave, pray and step forward. He uses you.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God put you where you are for a reason. When it's hard to be brave, pray and step….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Esther Saves Her People with God's Word today.",
    "takeaway": "Esther was chosen to be queen. When bad men wanted to hurt God's people, her uncle told her, 'Who knows? Maybe you were made queen for such a time as this.' Esther bravely went to the king and asked…",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Esther Saves Her People. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther becomes queen – God puts her in place (esther)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther goes to the king – Brave when it mattered (queen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God uses her to save the people – Such a time as this! (king)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther becomes queen – God puts her in place (brave)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther goes to the king – Brave when it mattered (save)"
    ]
  },
  "estherBanquet": {
    "kjvRef": "Esther 7",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Esther's Banquet.",
      "We read about this in Esther 7.",
      "God gives you the right moment!",
      "Be ready—He orders the steps.",
      "We learn from God and how God cares for Esther."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Joshua 6:20",
          "Revelation 22",
          "Esther 7",
          "John 6"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Esther 7.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Holy Spirit",
          "Mary",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God gives you the right moment! Be ready—He orders the steps.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God gives you the right moment! Be ready—He orders the steps..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Esther invites the king to a banquet",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "God gives you the right moment! Be ready—He orders the steps.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God gives you the right moment! Be ready—He orders the steps..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Esther's Banquet with God's Word today.",
    "takeaway": "God gives you the right moment! Be ready—He orders the steps.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Esther's Banquet. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther invites the king to a banquet (esther)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Haman arrives thinking he's honored (banquet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther reveals Haman's evil plan—he is shocked! (haman)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther invites the king to a banquet (esther 7)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Haman arrives thinking he's honored (king)"
    ]
  },
  "estherCrown": {
    "kjvRef": "Esther 5",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Queen Esther's Courage.",
      "We read about this in Esther 5.",
      "God puts you where you are for a reason!",
      "Be brave—maybe it's for such a time as this.",
      "We learn from God and how God cares for Esther."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 2:5",
          "Esther 5",
          "Acts 7",
          "Acts 5"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Esther 5.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Mary",
          "The crowds",
          "Holy Spirit"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God puts you where you are for a reason! Be brave—maybe it's for such a time as this."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God puts you where you are for a reason! Be brave—maybe it's for such a time as this..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Esther is made queen",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "God puts you where you are for a reason! Be brave—maybe it's for such a time as this.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God puts you where you are for a reason! Be brave—maybe it's for such a time as this..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Queen Esther's Courage with God's Word today.",
    "takeaway": "God puts you where you are for a reason! Be brave—maybe it's for such a time as this.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Queen Esther's Courage. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther is made queen (esther)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Haman plots to destroy the Jews (crown)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther goes to the king—God gives courage! (queen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther is made queen (esther 5)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Haman plots to destroy the Jews (scepter)"
    ]
  },
  "estherFast": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Esther Fasts and Goes to the King.",
      "We read about this in the Bible.",
      "Fast, pray, then go!",
      "God gives courage to those who seek Him first.",
      "We learn from God and how God cares for Esther."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Judges 16",
          "Exodus 12",
          "the Bible",
          "Luke 1"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Jesus",
          "Stephen",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Fast, pray, then go! God gives courage to those who seek Him first.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Fast, pray, then go! God gives courage to those who seek Him first..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Mordecai tells Esther: you must act!",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Fast, pray, then go! God gives courage to those who seek Him first.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Fast, pray, then go! God gives courage to those who seek Him first..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Esther Fasts and Goes to the King with God's Word today.",
    "takeaway": "Fast, pray, then go! God gives courage to those who seek Him first.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Esther Fasts and Goes to the King. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mordecai tells Esther: you must act! (esther)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther fasts three days with all the Jews (fast)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther goes to the king—scepter out, she's safe! (esther 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mordecai tells Esther: you must act! (scepter)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Esther fasts three days with all the Jews (pray)"
    ]
  },
  "euniceMother": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Eunice: A Faithful Mother.",
      "We read about this in the Bible.",
      "Thank God for people who teach you His Word!",
      "A faithful mom is a gift from heaven.",
      "We learn from God and how God cares for Eunice and Timothy."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 41",
          "Revelation 22",
          "the Bible",
          "Exodus 20:1-17"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "David",
          "Holy Spirit",
          "God",
          "Paul"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "Thank God for people who teach you His Word! A faithful mom is a gift from heaven."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Thank God for people who teach you His Word! A faithful mom is a gift from heaven..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Eunice is Timothy's mother",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Thank God for people who teach you His Word! A faithful mom is a gift from heaven.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Thank God for people who teach you His Word! A faithful mom is a gift from heaven..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Eunice: A Faithful Mother with God's Word today.",
    "takeaway": "Thank God for people who teach you His Word! A faithful mom is a gift from heaven.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Eunice: A Faithful Mother. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Eunice is Timothy's mother (eunice)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She teaches him scripture as a child (mother)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Timothy grows up to serve God—thank you, Mom! (2 timothy 1)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Eunice is Timothy's mother (timothy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She teaches him scripture as a child (scripture)"
    ]
  },
  "everyKneeBow": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Every Knee Shall Bow.",
      "We read about this in the Bible.",
      "One day everyone will know Jesus is Lord!",
      "Choose to bow your heart to Him now—gladly.",
      "We learn from God and how God cares for All people."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "1 Kings 3",
          "Esther 4",
          "the Bible",
          "Matthew 26"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Stephen",
          "The crowds",
          "Mary"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "One day everyone will know Jesus is Lord! Choose to bow your heart to Him now—gladly."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: One day everyone will know Jesus is Lord! Choose to bow your heart to Him now—gladly..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A great throne of glory",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "One day everyone will know Jesus is Lord! Choose to bow your heart to Him now—gladly.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: One day everyone will know Jesus is Lord! Choose to bow your heart to Him now—gladly..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Every Knee Shall Bow with God's Word today.",
    "takeaway": "One day everyone will know Jesus is Lord! Choose to bow your heart to Him now—gladly.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Every Knee Shall Bow. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A great throne of glory (knee bow)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Every knee bows—in heaven and on earth (philippians 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Every tongue confesses: Jesus Christ is Lord! (every tongue)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A great throne of glory (lord)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Every knee bows—in heaven and on earth (throne)"
    ]
  },
  "faithMountain": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Faith That Moves Mountains.",
      "We read about this in the Bible.",
      "Say it out loud: nothing is impossible with God!",
      "Your faith moves things in the spirit.",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Joshua 6:20",
          "Genesis 1",
          "the Bible",
          "John 6"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Stephen",
          "Mary",
          "The crowds",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Say it out loud: nothing is impossible with God! Your faith moves things in the spirit.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Say it out loud: nothing is impossible with God! Your faith moves things in the spirit..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Jesus says: if you have faith as a mustard seed",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Say it out loud: nothing is impossible with God! Your faith moves things in the spirit.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Say it out loud: nothing is impossible with God! Your faith moves things in the spirit..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Faith That Moves Mountains with God's Word today.",
    "takeaway": "Say it out loud: nothing is impossible with God! Your faith moves things in the spirit.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Faith That Moves Mountains. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: if you have faith as a mustard seed (faith)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Nothing will be impossible for you (mountain)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A mountain moves—because faith in God does the impossible! (matthew 17)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: if you have faith as a mustard seed (impossible)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Nothing will be impossible for you (mustard)"
    ]
  },
  "faithMustard": {
    "kjvRef": "Matthew 17",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Faith Like a Mustard Seed.",
      "We read about this in Matthew 17.",
      "You don't need huge faith—just genuine faith!",
      "Give it to God and watch.",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "1 Samuel 17",
          "Matthew 17",
          "Ruth 2:2",
          "the Bible"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 17.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "The crowds",
          "Jesus",
          "Holy Spirit"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "You don't need huge faith—just genuine faith! Give it to God and watch."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: You don't need huge faith—just genuine faith! Give it to God and watch..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A tiny seed in someone's hand",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "You don't need huge faith—just genuine faith! Give it to God and watch.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: You don't need huge faith—just genuine faith! Give it to God and watch..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Faith Like a Mustard Seed with God's Word today.",
    "takeaway": "You don't need huge faith—just genuine faith! Give it to God and watch.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Faith Like a Mustard Seed. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A tiny seed in someone's hand (faith)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: this much faith moves mountains (mustard seed)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Even small faith is enough—God does the rest! (matthew 17)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A tiny seed in someone's hand (mountain)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: this much faith moves mountains (move)"
    ]
  },
  "fallOfJericho": {
    "kjvRef": "Joshua 6",
    "hintAboveQuiz": "Read the story carefully — God's plan was different than usual!",
    "paragraphs": [
      "God told Joshua that His people would take the city of Jericho. The walls were tall and very strong.",
      "God gave a special plan: \"March around the city once a day for six days. Be quiet. Priests carry the ark and blow trumpets.\"",
      "The people obeyed. They marched quietly every day. On the seventh day they marched seven times around the city.",
      "After the seventh march, Joshua shouted, \"Shout! The Lord has given you the city!\"",
      "The people shouted loud together. Suddenly the walls fell down flat! God gave them the victory because they trusted and obeyed Him."
    ],
    "quizHeading": "What Do You Remember?",
    "questions": [
      {
        "question": "What did God tell Joshua to do with Jericho?",
        "choices": [
          "Fight with swords right away",
          "March around the city quietly",
          "Climb the walls with ladders",
          "Wait for the walls to fall alone"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! God had a special obedience plan — marching showed trust in Him.",
        "wrongFeedback": "Not quite. The Bible doesn't say to fight with swords or climb. God told them to march around quietly for six days, then seven times on the seventh day — that was the way to win!"
      },
      {
        "question": "How many times did they march on the seventh day?",
        "choices": [
          "One time",
          "Three times",
          "Seven times",
          "Ten times"
        ],
        "correctIndex": 2,
        "correctFeedback": "Correct! Seven times on the seventh day — God's number for completeness.",
        "wrongFeedback": "Let's check the story: God said to march around once each day for six days, but on the seventh day, march seven times. The answer is seven!"
      },
      {
        "question": "What did the people do after the last march?",
        "choices": [
          "Ran away",
          "Shouted loudly",
          "Sang a song",
          "Threw stones"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! They shouted together when Joshua gave the command — and the walls fell!",
        "wrongFeedback": "Close, but they didn't run or sing. After marching, Joshua said \"Shout!\" and they shouted loud — that's when the walls came down (Joshua 6:20)."
      },
      {
        "question": "Why did the walls fall down?",
        "choices": [
          "Because the trumpets were loud",
          "Because the people shouted",
          "Because God made it happen",
          "Because the walls were old"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right! God gave the victory — the people obeyed, and He did the miracle.",
        "wrongFeedback": "The trumpets and shouting were part of the plan, but they weren't magic. The real reason is that God made the walls fall when His people obeyed Him."
      },
      {
        "question": "What can we learn from Jericho?",
        "choices": [
          "God likes quiet marching",
          "Obeying God brings victory",
          "Shouting always wins",
          "Walls fall by themselves"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! When we trust and obey God, even impossible things can happen.",
        "wrongFeedback": "Almost! The story shows that victory came from obedience, not just noise or time passing. Trust and obey God — that is the lesson!"
      }
    ],
    "doneHeading": "You Did It!",
    "doneMessage": "Great job listening to the story and answering! You earned a star.",
    "takeaway": "Obeying God, even when the plan seems strange, leads to victory.",
    "prayer": "Dear God, help me obey You even when I don't understand. I trust You. Amen.",
    "imagePrompts": [
      "bright bouncy cartoon for kids: Israelite army marching silently around tall Jericho walls, priests with trumpets and ark of the covenant, sunny day, no text",
      "colorful kid illustration: Joshua leading people in a circle around the city, serious faces, dust on ground, big strong walls, no text",
      "fun cartoon style for children: seventh day march, people going around Jericho seven times, trumpets blowing, excitement in air, no text",
      "exciting Bible scene for kids: huge Jericho walls crumbling and falling down flat, Israelites shouting in joy, dust cloud, God's power shown",
      "happy ending cartoon: Israelites walking into the city of Jericho, smiling, praising God, bright colors, no text"
    ],
    "readAlongImages": []
  },
  "fieryFurnace": {
    "kjvRef": "Daniel 3:25",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Fiery Furnace Three – Daniel 3:25. King Nebuchadnezzar made a huge gold statue and said everyone must bow to it or be thrown into a fiery furnace.",
      "Shadrach, Meshach, and Abednego loved God and said, 'We will not bow.' The king was furious and made the furnace seven times hotter. The soldiers who threw them in died from the heat.",
      "But the king looked in and saw four men walking around! The fourth looked like the Son of God.",
      "The three friends came out unharmed—no burns, no smoke smell. God was with them in the fire!",
      "For you: When you face hard times or pressure to do wrong, stand strong for God. He is with you in the fire and will protect you."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Daniel 3:25",
          "Genesis 22",
          "Judges 16:30",
          "1 Samuel 16"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Daniel 3:25.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Stephen",
          "The crowds",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Shadrach, Meshach, and Abednego refused to bow to a statue. They were thrown into a hot furnace, but God walked with them and kept them…",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Shadrach, Meshach, and Abednego refused to bow to a statue. They were thrown into a hot….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Three friends refusing to bow – Standing for God",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "When you face hard times or pressure to do wrong, stand strong for God. He is with you in the fire and will protect you.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: When you face hard times or pressure to do wrong, stand strong for God. He is with you….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Fiery Furnace with God's Word today.",
    "takeaway": "Shadrach, Meshach, and Abednego refused to bow to a statue. They were thrown into a hot furnace, but God walked with them and kept them safe. When you're in a tough or scary situation, God is right…",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Fiery Furnace. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Three friends refusing to bow – Standing for God (fiery furnace)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Thrown into the fiery furnace – Heat so hot it kills soldiers (shadrach)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Four men walking in the fire – God protects His friends (meshach)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Three friends refusing to bow – Standing for God (abednego)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Thrown into the fiery furnace – Heat so hot it kills soldiers (fire)"
    ]
  },
  "forgive70x7": {
    "kjvRef": "Matthew 18",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Forgive Seventy Times Seven.",
      "We read about this in Matthew 18.",
      "Forgiveness is never too much!",
      "When you forgive, you're free—not the other person.",
      "We learn from Jesus and how God cares for Peter."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "John 20",
          "Genesis 1",
          "Matthew 6",
          "Matthew 18"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 18.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Mary",
          "Jesus",
          "Stephen"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "Forgiveness is never too much! When you forgive, you're free—not the other person.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Forgiveness is never too much! When you forgive, you're free—not the other person..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Peter asks: how many times should I forgive?",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older.",
          "Forgiveness is never too much! When you forgive, you're free—not the other person."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Forgiveness is never too much! When you forgive, you're free—not the other person..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Forgive Seventy Times Seven with God's Word today.",
    "takeaway": "Forgiveness is never too much! When you forgive, you're free—not the other person.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Forgive Seventy Times Seven. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Peter asks: how many times should I forgive? (forgive)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: seventy times seven—always! (70 times)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Two brothers hug—forgiveness sets you free! (matthew 18)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Peter asks: how many times should I forgive? (peter)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: seventy times seven—always! (always)"
    ]
  },
  "fourHorsemen": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Four Horsemen.",
      "We read about this in the Bible.",
      "Even big scary things are in God's hands!",
      "He knows the end—and He wins.",
      "We learn from God and how God cares for John."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "Matthew 7",
          "Genesis 11",
          "Luke 23"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Jesus",
          "David",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Even big scary things are in God's hands! He knows the end—and He wins.",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Even big scary things are in God's hands! He knows the end—and He wins..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "The Lamb opens four seals",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Even big scary things are in God's hands! He knows the end—and He wins.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Even big scary things are in God's hands! He knows the end—and He wins..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Four Horsemen with God's Word today.",
    "takeaway": "Even big scary things are in God's hands! He knows the end—and He wins.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Four Horsemen. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lamb opens four seals (horsemen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Four horses come: white, red, black, pale (revelation 6)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God shows what will happen—He is in control! (seals)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Lamb opens four seals (white)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Four horses come: white, red, black, pale (red)"
    ]
  },
  "fruitSpirit": {
    "kjvRef": "Galatians 5",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Fruit of the Spirit. We read about this in Galatians 5.",
      "Stay close to Jesus like a branch on a vine—good fruit grows naturally! We learn from Holy Spirit and how God cares for All believers.",
      "Even when we feel small, God sees us and loves us.",
      "Praying helps our hearts remember what is true.",
      "We can obey God one step at a time with His help."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Galatians 5",
          "Matthew 21",
          "Joshua 8",
          "Mark 5"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Galatians 5.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Holy Spirit",
          "God",
          "Jesus"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Holy Spirit.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Stay close to Jesus like a branch on a vine—good fruit grows naturally!",
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Stay close to Jesus like a branch on a vine—good fruit grows naturally!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A tree full of beautiful fruit"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Stay close to Jesus like a branch on a vine—good fruit grows naturally!",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Stay close to Jesus like a branch on a vine—good fruit grows naturally!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Fruit of the Spirit with God's Word today.",
    "takeaway": "Stay close to Jesus like a branch on a vine—good fruit grows naturally!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Fruit of the Spirit. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A tree full of beautiful fruit (fruit)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Love, joy, peace, patience—God's fruit (spirit)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Stay connected to Jesus—grow good fruit! (galatians 5)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A tree full of beautiful fruit (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Love, joy, peace, patience—God's fruit (joy)"
    ]
  },
  "gardenPrayer": {
    "kjvRef": "Matthew 26",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Garden Prayer.",
      "We read about this in Matthew 26.",
      "Jesus talks to God—talk to Him!",
      "Pray when you're scared or sad!",
      "We learn from Jesus and how God cares for God the Father."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 32",
          "Matthew 26",
          "John 2",
          "Daniel 6:22"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 26.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Holy Spirit",
          "Mary",
          "David"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Jesus talks to God—talk to Him! Pray when you're scared or sad!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus talks to God—talk to Him! Pray when you're scared or sad!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Jesus in the garden",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "Jesus talks to God—talk to Him! Pray when you're scared or sad!",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus talks to God—talk to Him! Pray when you're scared or sad!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Garden Prayer with God's Word today.",
    "takeaway": "Jesus talks to God—talk to Him! Pray when you're scared or sad!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Garden Prayer. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus in the garden (gethsemane)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus prays to the Father (garden)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Not My will—Your will be done! (prayer)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus in the garden (matthew 26)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus prays to the Father (mark 14)"
    ]
  },
  "goldenCalf": {
    "kjvRef": "Exodus 32",
    "paragraphs": [
      "Moses went up Mount Sinai to talk with God. The people waited a long time.",
      "They got impatient. They asked Aaron, \"Make us gods to go before us.\" Aaron made a golden calf from their jewellery.",
      "The people said, \"These be thy gods, O Israel, which brought thee up out of the land of Egypt!\" They had a feast and worshiped the calf.",
      "God told Moses the people had corrupted themselves. Moses was angry and broke the stone tablets when he saw the calf.",
      "Moses prayed for the people. God forgave in mercy, but sin still had serious consequences. God still loved His people."
    ],
    "imagePrompts": [
      "bright cartoon for kids: people waiting at base of Mount Sinai, Moses up the mountain, no text",
      "fun kid illustration: Aaron and people bringing gold, shaping a calf figure, no text",
      "colorful Bible scene for children: crowd celebrating wrongly near a golden calf, teachable not party-glorifying, no text",
      "exciting cartoon: Moses coming down with tablets, seeing the camp, broken tablets at feet, no text",
      "hopeful ending illustration: Moses praying upward, people bowing heads sorry, soft light, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "The people forgot God quickly — what did they do wrong?",
    "quizHeading": "Golden Calf Questions",
    "questions": [
      {
        "question": "Why did the people make a golden calf?",
        "choices": [
          "They were hungry",
          "Moses was gone too long and they got impatient",
          "They wanted a new pet",
          "God told them to"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! They got tired of waiting and wanted something to lead them.",
        "wrongFeedback": "Not hunger or a pet. Moses was up the mountain a long time, so they asked Aaron to make gods (Exodus 32:1)."
      },
      {
        "question": "What did Aaron do with the people's gold?",
        "choices": [
          "Hid it",
          "Made a golden calf",
          "Gave it to Moses",
          "Threw it away"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! He melted it and shaped a calf idol.",
        "wrongFeedback": "Not hide or throw. Aaron fashioned it with a graving tool after he received their golden earrings (Exodus 32:2–4)."
      },
      {
        "question": "What did the people say about the calf?",
        "choices": [
          "These be thy gods, O Israel, which brought thee up",
          "This is a toy",
          "This is Moses",
          "This is food"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes! They worshiped the calf instead of the Lord.",
        "wrongFeedback": "They did not call it a toy. They said, \"These be thy gods, O Israel, which brought thee up out of the land of Egypt\" (Exodus 32:4)."
      },
      {
        "question": "How did Moses react when he came down?",
        "choices": [
          "He danced with them",
          "He broke the stone tablets",
          "He joined the feast",
          "He ignored it"
        ],
        "correctIndex": 1,
        "correctFeedback": "Correct! Moses was angry and broke the tablets.",
        "wrongFeedback": "He did not join them. His anger waxed hot, and he cast the tablets out of his hands and broke them (Exodus 32:19)."
      },
      {
        "question": "What can we learn from the golden calf?",
        "choices": [
          "Make idols when waiting",
          "Worship God only",
          "Forget God's rules",
          "Gold is best"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! Worship God alone — do not make idols or forget Him.",
        "wrongFeedback": "Impatience led to awful sin. God wants our whole heart — no substitutes!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star for remembering to worship God only!",
    "takeaway": "Worship God alone — don't let impatience lead to wrong choices.",
    "prayer": "God, help me worship only You. Keep my heart true. Amen."
  },
  "goliathChallenge": {
    "kjvRef": "1 Samuel 17",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Goliath's Challenge.",
      "We read about this in 1 Samuel 17.",
      "God is bigger than any giant!",
      "Face your fears—He's with you.",
      "We learn from David and how God cares for Goliath."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Joshua 6:20",
          "Revelation 22",
          "1 Samuel 17",
          "John 6"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 1 Samuel 17.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Stephen",
          "God",
          "David"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: David.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God is bigger than any giant! Face your fears—He's with you.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God is bigger than any giant! Face your fears—He's with you..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Goliath shouts—who will fight me?",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "God is bigger than any giant! Face your fears—He's with you.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God is bigger than any giant! Face your fears—He's with you..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Goliath's Challenge with God's Word today.",
    "takeaway": "God is bigger than any giant! Face your fears—He's with you.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Goliath's Challenge. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Goliath shouts—who will fight me? (goliath)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Everyone is afraid—except David (challenge)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David says: The Lord will deliver you! (david)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Goliath shouts—who will fight me? (1 samuel 17)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Everyone is afraid—except David (giant)"
    ]
  },
  "goodSamaritan": {
    "kjvRef": "Luke 10:25–37",
    "hintAboveQuiz": "Look for who helped and why!",
    "readAlongImages": [],
    "paragraphs": [
      "A man asked Jesus, \"Who is my neighbor?\" Jesus told a story to answer.",
      "A traveler was attacked by robbers. They took his things and hurt him. He lay on the road, injured.",
      "A priest walked by and saw him — but he crossed to the other side and kept going.",
      "Then a Levite (another religious man) did the same — he passed by without helping.",
      "But a Samaritan (who was from a different group) saw him. He felt sorry, stopped, bandaged the man, put him on his donkey, took him to an inn, and paid for his care."
    ],
    "quizHeading": "Who Is My Neighbor?",
    "questions": [
      {
        "question": "What happened to the traveler?",
        "choices": [
          "He got lost",
          "Robbers attacked him",
          "He fell asleep",
          "He met friends"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Robbers hurt him and took his things.",
        "wrongFeedback": "Let's read the beginning: The man was attacked by robbers on the road. They left him injured."
      },
      {
        "question": "Who was the first person to see the hurt man?",
        "choices": [
          "A Samaritan",
          "A priest",
          "A Levite",
          "Jesus"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! A priest saw him first but walked past.",
        "wrongFeedback": "The story says a priest came by first. He looked at the man but crossed to the other side."
      },
      {
        "question": "Who helped the hurt man?",
        "choices": [
          "The priest",
          "The Levite",
          "A Samaritan",
          "The robbers"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes! The Samaritan stopped and helped, even though others didn't.",
        "wrongFeedback": "The priest and Levite passed by. It was the Samaritan — from a different group — who showed kindness."
      },
      {
        "question": "What did the Samaritan do for the man?",
        "choices": [
          "Walked past",
          "Bandaged him and took him to an inn",
          "Took his things",
          "Called for help"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! He bandaged wounds, put him on his donkey, and paid for care.",
        "wrongFeedback": "The Samaritan didn't walk past or take things. He helped by bandaging, carrying, and paying for the inn."
      },
      {
        "question": "What does this story teach us?",
        "choices": [
          "Only help friends",
          "Help anyone who needs it",
          "Ignore hurt people",
          "Be rich to help"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! Everyone is our neighbor — show love and help anyone in need.",
        "wrongFeedback": "The point of Jesus' story is that our neighbor is anyone who needs help. The Samaritan showed love to a stranger!"
      }
    ],
    "doneHeading": "You Did It!",
    "doneMessage": "Great job learning who your neighbor is!",
    "takeaway": "Love your neighbor — that means helping anyone who needs it.",
    "prayer": "God, help me see people who need help and show them kindness. Amen.",
    "imagePrompts": [
      "bright kid cartoon: traveler attacked by robbers on a road, hurt and left alone, no text",
      "colorful Bible illustration for children: priest walking past injured man on the ground, looking away, no text",
      "fun cartoon style: Levite also passing by the hurt man, crossing to the other side, no text",
      "kind Samaritan scene for kids: Samaritan helping injured man, bandaging wounds, putting him on donkey, caring face",
      "happy ending cartoon: Samaritan at inn paying the innkeeper to take care of the hurt man, warm and kind, no text"
    ]
  },
  "greatCommission": {
    "kjvRef": "Matthew 28",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Great Commission.",
      "We read about this in Matthew 28.",
      "You are sent!",
      "Tell everyone the good news—and Jesus is with you every step.",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Acts 28",
          "Matthew 28",
          "Mark 4:39",
          "1 Corinthians 13"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 28.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Stephen",
          "Jesus",
          "Mary"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "You are sent! Tell everyone the good news—and Jesus is with you every step."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: You are sent! Tell everyone the good news—and Jesus is with you every step..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Jesus appears on a mountain in Galilee",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "You are sent! Tell everyone the good news—and Jesus is with you every step.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: You are sent! Tell everyone the good news—and Jesus is with you every step..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Great Commission with God's Word today.",
    "takeaway": "You are sent! Tell everyone the good news—and Jesus is with you every step.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Great Commission. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus appears on a mountain in Galilee (great commission)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He says: Go and make disciples of all nations (matthew 28)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: And I am with you always—to the end! (go)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus appears on a mountain in Galilee (make disciples)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He says: Go and make disciples of all nations (baptize)"
    ]
  },
  "hannahPray": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Hannah Prays for a Baby.",
      "We read about this in the Bible.",
      "God hears every prayer!",
      "Pour out your heart—He is listening and He cares.",
      "We learn from God and how God cares for Hannah."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Mark 4:39",
          "Acts 28",
          "1 Corinthians 13",
          "the Bible"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Stephen",
          "The crowds",
          "Jesus"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "God hears every prayer! Pour out your heart—He is listening and He cares.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God hears every prayer! Pour out your heart—He is listening and He cares..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Hannah weeps and prays at the temple",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "God hears every prayer! Pour out your heart—He is listening and He cares."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God hears every prayer! Pour out your heart—He is listening and He cares..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Hannah Prays for a Baby with God's Word today.",
    "takeaway": "God hears every prayer! Pour out your heart—He is listening and He cares.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Hannah Prays for a Baby. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Hannah weeps and prays at the temple (hannah)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She makes a vow to God (pray)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God answers—baby Samuel is born! (baby)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Hannah weeps and prays at the temple (1 samuel 1)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She makes a vow to God (temple)"
    ]
  },
  "healBlind": {
    "kjvRef": "John 9",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jesus Heals a Blind Man.",
      "We read about this in John 9.",
      "Jesus opens our eyes—in our hearts too!",
      "Ask Him to help you see.",
      "We learn from Jesus and how God cares for The blind man."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "John 9",
          "Genesis 11",
          "Genesis 1:3",
          "Matthew 7"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: John 9.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "David",
          "God",
          "Jesus",
          "Paul"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "Jesus opens our eyes—in our hearts too! Ask Him to help you see.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus opens our eyes—in our hearts too! Ask Him to help you see..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A man is born blind"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Jesus opens our eyes—in our hearts too! Ask Him to help you see.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus opens our eyes—in our hearts too! Ask Him to help you see..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jesus Heals a Blind Man with God's Word today.",
    "takeaway": "Jesus opens our eyes—in our hearts too! Ask Him to help you see.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jesus Heals a Blind Man. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A man is born blind (blind)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus puts mud on his eyes (heal)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He washes and sees—I was blind, now I see! (mud)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A man is born blind (john 9)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus puts mud on his eyes (eyes)"
    ]
  },
  "healLeper": {
    "kjvRef": "Luke 17",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jesus Heals Ten Lepers.",
      "We read about this in Luke 17.",
      "Jesus heals and cleans us inside!",
      "Always say thank you to Him.",
      "We learn from Jesus and how God cares for The lepers."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 23",
          "Luke 17",
          "Job 2",
          "Matthew 18"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 17.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Holy Spirit",
          "David",
          "Paul"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "Jesus heals and cleans us inside! Always say thank you to Him."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus heals and cleans us inside! Always say thank you to Him..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Ten lepers call out: Jesus, have mercy!",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Jesus heals and cleans us inside! Always say thank you to Him.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus heals and cleans us inside! Always say thank you to Him..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jesus Heals Ten Lepers with God's Word today.",
    "takeaway": "Jesus heals and cleans us inside! Always say thank you to Him.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jesus Heals Ten Lepers. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ten lepers call out: Jesus, have mercy! (leper)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: Go show yourselves to the priest (heal)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: As they go—all ten are clean! (luke 17)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ten lepers call out: Jesus, have mercy! (mercy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: Go show yourselves to the priest (clean)"
    ]
  },
  "heavenDoor": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Door to Heaven.",
      "We read about this in the Bible.",
      "Jesus is knocking right now!",
      "Open the door—He wants to come in and stay.",
      "We learn from Jesus and how God cares for The church."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "Joshua 6:20",
          "John 6",
          "Genesis 1"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Holy Spirit",
          "Jesus",
          "The crowds",
          "Mary"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "Jesus is knocking right now! Open the door—He wants to come in and stay.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus is knocking right now! Open the door—He wants to come in and stay..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "Jesus says: I stand at the door and knock"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Jesus is knocking right now! Open the door—He wants to come in and stay.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus is knocking right now! Open the door—He wants to come in and stay..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Door to Heaven with God's Word today.",
    "takeaway": "Jesus is knocking right now! Open the door—He wants to come in and stay.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Door to Heaven. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: I stand at the door and knock (door)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: If anyone opens—I will come in! (knock)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Open the door to Jesus—He is waiting! (revelation 3)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: I stand at the door and knock (come in)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: If anyone opens—I will come in! (heart)"
    ]
  },
  "heavenPromise": {
    "kjvRef": "Revelation 21",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Heaven Promise.",
      "We read about this in Revelation 21.",
      "God makes new home—no more sad!",
      "No tears, no pain—forever with Him!",
      "We learn from God and how God cares for Everyone who believes."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "1 Kings 18",
          "Revelation 21",
          "Joshua 8",
          "Mark 5"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Revelation 21.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Stephen",
          "The crowds",
          "Mary"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "God makes new home—no more sad! No tears, no pain—forever with Him!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God makes new home—no more sad! No tears, no pain—forever with Him!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "New heaven and new earth",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "God makes new home—no more sad! No tears, no pain—forever with Him!",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God makes new home—no more sad! No tears, no pain—forever with Him!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Heaven Promise with God's Word today.",
    "takeaway": "God makes new home—no more sad! No tears, no pain—forever with Him!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Heaven Promise. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: New heaven and new earth (heaven)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God wipes away every tear (revelation 21)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: No more sad—God's new home! (no tears)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: New heaven and new earth (new home)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God wipes away every tear (promise)"
    ]
  },
  "jacobLadder": {
    "kjvRef": "Genesis 28:12",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jacob Dream Ladder – Genesis 28:12. Jacob had to run away from his brother Esau.",
      "He slept on a stone pillow under the stars. In a dream, he saw a ladder reaching from earth to heaven with angels going up and down.",
      "God stood above it and said, 'I am the Lord God of Abraham and Isaac. I will give you this land.",
      "Your family will be many. I am with you and will keep you wherever you go.' Jacob woke up and said, 'God is in this place!' He set up the stone as a pillar and called it Bethel—House of God.",
      "For you: When you feel alone or far away, God is still with you. He promises to watch over you and bring you safely through every journey."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Daniel 6:22",
          "Exodus 32",
          "Genesis 28:12",
          "Mark 12"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Genesis 28:12.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "God",
          "David",
          "Holy Spirit"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jacob was running away, but God showed him a ladder to heaven with angels going up and down. God promised to be with him and bring him…",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jacob was running away, but God showed him a ladder to heaven with angels going up and….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot.",
          "Jacob sleeping with a stone pillow – Running away"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "When you feel alone or far away, God is still with you. He promises to watch over you and bring you safely through…",
          "Ignore God until we are older."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: When you feel alone or far away, God is still with you. He promises to watch over you….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jacob's Ladder with God's Word today.",
    "takeaway": "Jacob was running away, but God showed him a ladder to heaven with angels going up and down. God promised to be with him and bring him home. Even when you're far from home or feel alone, God is with…",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jacob's Ladder. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jacob sleeping with a stone pillow – Running away (jacob)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ladder from earth to heaven with angels – God's promise (ladder)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jacob setting up the stone pillar – God is here (dream)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jacob sleeping with a stone pillow – Running away (angels)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ladder from earth to heaven with angels – God's promise (genesis 28)"
    ]
  },
  "jaelTent": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jael's Courage.",
      "We read about this in the Bible.",
      "God uses ordinary people in extraordinary moments!",
      "Be ready—your moment may come.",
      "We learn from God and how God cares for Jael."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "Numbers 22",
          "Luke 24",
          "1 Samuel 18"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Stephen",
          "God",
          "Paul",
          "Jesus"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "God uses ordinary people in extraordinary moments! Be ready—your moment may come.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God uses ordinary people in extraordinary moments! Be ready—your moment may come..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "The enemy general Sisera flees to Jael's tent"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God uses ordinary people in extraordinary moments! Be ready—your moment may come.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God uses ordinary people in extraordinary moments! Be ready—your moment may come..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jael's Courage with God's Word today.",
    "takeaway": "God uses ordinary people in extraordinary moments! Be ready—your moment may come.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jael's Courage. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The enemy general Sisera flees to Jael's tent (jael)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jael gives him shelter—and courage to act (tent)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God's victory comes through unexpected hands! (sisera)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The enemy general Sisera flees to Jael's tent (judges 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jael gives him shelter—and courage to act (peg)"
    ]
  },
  "jairus": {
    "kjvRef": "Mark 5",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jairus' Daughter Raised.",
      "We read about this in Mark 5.",
      "Jesus is never too late!",
      "Keep believing even when it seems impossible.",
      "We learn from Jesus and how God cares for Jairus and his daughter."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 13",
          "Genesis 11",
          "Matthew 7",
          "Mark 5"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Mark 5.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "God",
          "Stephen",
          "Paul"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "Jesus is never too late! Keep believing even when it seems impossible.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus is never too late! Keep believing even when it seems impossible..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Jairus begs Jesus: my daughter is dying!",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Jesus is never too late! Keep believing even when it seems impossible."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus is never too late! Keep believing even when it seems impossible..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jairus' Daughter Raised with God's Word today.",
    "takeaway": "Jesus is never too late! Keep believing even when it seems impossible.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jairus' Daughter Raised. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jairus begs Jesus: my daughter is dying! (jairus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: News arrives: she is gone... (daughter)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus takes her hand: Talitha cumi! She rises! (raise)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jairus begs Jesus: my daughter is dying! (mark 5)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: News arrives: she is gone... (talitha cumi)"
    ]
  },
  "jerichoWalls": {
    "kjvRef": "Joshua 6",
    "hintAboveQuiz": "Read the story carefully — God's plan was different than usual!",
    "paragraphs": [
      "God told Joshua that His people would take the city of Jericho. The walls were tall and very strong.",
      "God gave a special plan: \"March around the city once a day for six days. Be quiet. Priests carry the ark and blow trumpets.\"",
      "The people obeyed. They marched quietly every day. On the seventh day they marched seven times around the city.",
      "After the seventh march, Joshua shouted, \"Shout! The Lord has given you the city!\"",
      "The people shouted loud together. Suddenly the walls fell down flat! God gave them the victory because they trusted and obeyed Him."
    ],
    "quizHeading": "What Do You Remember?",
    "questions": [
      {
        "question": "What did God tell Joshua to do with Jericho?",
        "choices": [
          "Fight with swords right away",
          "March around the city quietly",
          "Climb the walls with ladders",
          "Wait for the walls to fall alone"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! God had a special obedience plan — marching showed trust in Him.",
        "wrongFeedback": "Not quite. The Bible doesn't say to fight with swords or climb. God told them to march around quietly for six days, then seven times on the seventh day — that was the way to win!"
      },
      {
        "question": "How many times did they march on the seventh day?",
        "choices": [
          "One time",
          "Three times",
          "Seven times",
          "Ten times"
        ],
        "correctIndex": 2,
        "correctFeedback": "Correct! Seven times on the seventh day — God's number for completeness.",
        "wrongFeedback": "Let's check the story: God said to march around once each day for six days, but on the seventh day, march seven times. The answer is seven!"
      },
      {
        "question": "What did the people do after the last march?",
        "choices": [
          "Ran away",
          "Shouted loudly",
          "Sang a song",
          "Threw stones"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! They shouted together when Joshua gave the command — and the walls fell!",
        "wrongFeedback": "Close, but they didn't run or sing. After marching, Joshua said \"Shout!\" and they shouted loud — that's when the walls came down (Joshua 6:20)."
      },
      {
        "question": "Why did the walls fall down?",
        "choices": [
          "Because the trumpets were loud",
          "Because the people shouted",
          "Because God made it happen",
          "Because the walls were old"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right! God gave the victory — the people obeyed, and He did the miracle.",
        "wrongFeedback": "The trumpets and shouting were part of the plan, but they weren't magic. The real reason is that God made the walls fall when His people obeyed Him."
      },
      {
        "question": "What can we learn from Jericho?",
        "choices": [
          "God likes quiet marching",
          "Obeying God brings victory",
          "Shouting always wins",
          "Walls fall by themselves"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! When we trust and obey God, even impossible things can happen.",
        "wrongFeedback": "Almost! The story shows that victory came from obedience, not just noise or time passing. Trust and obey God — that is the lesson!"
      }
    ],
    "doneHeading": "You Did It!",
    "doneMessage": "Great job listening to the story and answering! You earned a star.",
    "takeaway": "Obeying God, even when the plan seems strange, leads to victory.",
    "prayer": "Dear God, help me obey You even when I don't understand. I trust You. Amen.",
    "imagePrompts": [
      "bright bouncy cartoon for kids: Israelite army marching silently around tall Jericho walls, priests with trumpets and ark of the covenant, sunny day, no text",
      "colorful kid illustration: Joshua leading people in a circle around the city, serious faces, dust on ground, big strong walls, no text",
      "fun cartoon style for children: seventh day march, people going around Jericho seven times, trumpets blowing, excitement in air, no text",
      "exciting Bible scene for kids: huge Jericho walls crumbling and falling down flat, Israelites shouting in joy, dust cloud, God's power shown",
      "happy ending cartoon: Israelites walking into the city of Jericho, smiling, praising God, bright colors, no text"
    ],
    "readAlongImages": []
  },
  "jesus": {
    "kjvRef": "John 10",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jesus the Good Shepherd.",
      "We read about this in John 10.",
      "Jesus wants YOU!",
      "Come to Him—He loves you like a shepherd loves his sheep!",
      "We learn from Jesus and how God cares for The children."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Joshua 6",
          "Luke 22",
          "Luke 24",
          "John 10"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: John 10.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Mary",
          "Jesus",
          "Stephen"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "Jesus wants YOU! Come to Him—He loves you like a shepherd loves his sheep!",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus wants YOU! Come to Him—He loves you like a shepherd loves his sheep!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Jesus the good shepherd",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Jesus wants YOU! Come to Him—He loves you like a shepherd loves his sheep!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus wants YOU! Come to Him—He loves you like a shepherd loves his sheep!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jesus the Good Shepherd with God's Word today.",
    "takeaway": "Jesus wants YOU! Come to Him—He loves you like a shepherd loves his sheep!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jesus the Good Shepherd. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus the good shepherd (jesus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus calling the children (shepherd)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus loves you! (children)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus the good shepherd (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus calling the children (lamb)"
    ]
  },
  "jesusBirth": {
    "kjvRef": "Luke 2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jesus Birth.",
      "We read about this in Luke 2.",
      "Jesus came as a baby—God loves us!",
      "Christmas is about God's greatest gift!",
      "We learn from God and how God cares for The whole world."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 2",
          "Genesis 4",
          "Esther 5",
          "Exodus 20:1-17"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Stephen",
          "God",
          "Jesus"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus came as a baby—God loves us! Christmas is about God's greatest gift!",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus came as a baby—God loves us! Christmas is about God's greatest gift!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot.",
          "Mary and Joseph travel to Bethlehem"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Jesus came as a baby—God loves us! Christmas is about God's greatest gift!",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus came as a baby—God loves us! Christmas is about God's greatest gift!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jesus Birth with God's Word today.",
    "takeaway": "Jesus came as a baby—God loves us! Christmas is about God's greatest gift!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jesus Birth. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary and Joseph travel to Bethlehem (jesus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus born in a manger (birth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Shepherds and angels celebrate! (manger)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary and Joseph travel to Bethlehem (shepherds)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus born in a manger (angels)"
    ]
  },
  "jesusBlessKids": {
    "kjvRef": "Mark 10",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jesus Blesses the Children.",
      "We read about this in Mark 10.",
      "Jesus wants YOU!",
      "He invites every child to come to Him.",
      "We learn from Jesus and how God cares for The children."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 41:41",
          "Nehemiah 4",
          "Exodus 14",
          "Mark 10"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Mark 10.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "The crowds",
          "Stephen",
          "God"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "Jesus wants YOU! He invites every child to come to Him.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus wants YOU! He invites every child to come to Him..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Disciples try to send kids away",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Jesus wants YOU! He invites every child to come to Him."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus wants YOU! He invites every child to come to Him..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jesus Blesses the Children with God's Word today.",
    "takeaway": "Jesus wants YOU! He invites every child to come to Him.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jesus Blesses the Children. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Disciples try to send kids away (jesus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: Let the little children come to me! (children)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He holds them—they are of such is the kingdom! (bless)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Disciples try to send kids away (mark 10)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: Let the little children come to me! (kids)"
    ]
  },
  "jesusCalmsStorm": {
    "kjvRef": "Mark 4:35–41",
    "hintAboveQuiz": "Pay attention to what Jesus did and said!",
    "readAlongImages": [],
    "paragraphs": [
      "Jesus and His disciples were in a boat on the lake. Jesus was very tired and fell asleep.",
      "Suddenly a big storm came. Waves crashed over the boat. The disciples were scared!",
      "They woke Jesus and said, \"Master, carest thou not that we perish?\" (Mark 4:38, KJV).",
      "Jesus stood up and said to the wind and waves, \"Peace, be still\" (Mark 4:39, KJV). Right away the storm stopped. Everything was calm.",
      "Jesus asked, \"Why are ye so fearful? how is it that ye have no faith?\" The disciples were amazed and said, \"What manner of man is this, that even the wind and the sea obey him?\""
    ],
    "quizHeading": "Test Your Understanding",
    "questions": [
      {
        "question": "What was Jesus doing during the storm?",
        "choices": [
          "Rowing the boat",
          "Sleeping",
          "Calming the storm",
          "Teaching the disciples"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Jesus was so tired He slept, even in a storm.",
        "wrongFeedback": "Not quite. The Bible says Jesus was asleep in the boat when the storm started (Mark 4:38). He trusted God completely."
      },
      {
        "question": "What did the disciples say to Jesus?",
        "choices": [
          "Help us row!",
          "We are not scared!",
          "Master, carest thou not that we perish?",
          "Let's jump out!"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right! They were afraid and asked if Jesus cared.",
        "wrongFeedback": "Reread paragraph three. In the King James Bible they said, \"Master, carest thou not that we perish?\" They were scared they might drown."
      },
      {
        "question": "What did Jesus say to the storm?",
        "choices": [
          "Go away!",
          "Peace, be still",
          "Stop now!",
          "Be calm!"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! \"Peace, be still\" (Mark 4:39, KJV) — and the storm obeyed Him immediately.",
        "wrongFeedback": "Look at paragraph four. The King James Bible records Jesus's short command to the wind and waves. (Answer: Peace, be still.)"
      },
      {
        "question": "How did the disciples feel after the storm stopped?",
        "choices": [
          "Happy and calm",
          "Amazed and afraid",
          "Angry at Jesus",
          "Sleepy again"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! They were amazed — \"Who is this? Even the wind and waves obey Him!\"",
        "wrongFeedback": "The Bible says they wondered with fear and amazement. They asked who Jesus was — because only God has power over nature!"
      },
      {
        "question": "What can we learn from this story?",
        "choices": [
          "Storms are fun",
          "Jesus has power over everything",
          "Disciples are always brave",
          "Boats sink easily"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! Jesus has power over storms — and over our fears too.",
        "wrongFeedback": "The big lesson is that Jesus is in control of everything, even when we feel scared. We can trust Him!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star for trusting Jesus' power!",
    "takeaway": "Jesus has power over everything — even storms. We can trust Him when we are afraid.",
    "prayer": "Jesus, when I am scared, help me remember You are with me and have power over everything. Amen.",
    "imagePrompts": [
      "bright cartoon for kids: Jesus sleeping in a boat while disciples row, calm lake at first, no text",
      "fun kid illustration: big storm on the lake, huge waves crashing into the boat, disciples looking scared, Jesus asleep",
      "colorful Bible scene for children: Jesus standing up in the boat, speaking to the storm, wind and waves calming down",
      "exciting cartoon: storm suddenly stops, lake flat and peaceful, disciples amazed looking at Jesus",
      "happy ending illustration: boat on calm water, Jesus smiling at disciples, peace and faith shown, no text"
    ]
  },
  "jesusFeeds5000": {
    "kjvRef": "John 6",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jesus Feeds 5,000.",
      "We read about this in John 6.",
      "Jesus feeds everyone—He cares!",
      "Give God what you have—He can multiply it!",
      "We learn from Jesus and how God cares for The 5."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Acts 2",
          "Numbers 13",
          "Matthew 26",
          "John 6"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: John 6.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Stephen",
          "Jesus",
          "Paul"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "Jesus feeds everyone—He cares! Give God what you have—He can multiply it!",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus feeds everyone—He cares! Give God what you have—He can multiply it!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Big crowd, one boy with bread and fish",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Jesus feeds everyone—He cares! Give God what you have—He can multiply it!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus feeds everyone—He cares! Give God what you have—He can multiply it!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jesus Feeds 5,000 with God's Word today.",
    "takeaway": "Jesus feeds everyone—He cares! Give God what you have—He can multiply it!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jesus Feeds 5,000. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Big crowd, one boy with bread and fish (jesus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus blesses the food (feeds)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Everyone eats—baskets left over! (5000)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Big crowd, one boy with bread and fish (bread)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus blesses the food (fish)"
    ]
  },
  "jesusManger": {
    "kjvRef": "Luke 2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Baby Jesus in the Manger.",
      "We read about this in Luke 2.",
      "Jesus came for you!",
      "God's greatest gift is His Son.",
      "We learn from God and how God cares for The whole world."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Judges 16",
          "Luke 2",
          "1 Samuel 22",
          "Genesis 3"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Holy Spirit",
          "Mary",
          "David"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "Jesus came for you! God's greatest gift is His Son."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus came for you! God's greatest gift is His Son..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Mary and Joseph find a stable",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Jesus came for you! God's greatest gift is His Son.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus came for you! God's greatest gift is His Son..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Baby Jesus in the Manger with God's Word today.",
    "takeaway": "Jesus came for you! God's greatest gift is His Son.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Baby Jesus in the Manger. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary and Joseph find a stable (jesus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus is born and laid in a manger (manger)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Wise men bring gifts—a King is born! (baby)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary and Joseph find a stable (luke 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus is born and laid in a manger (bethlehem)"
    ]
  },
  "jesusTemple": {
    "kjvRef": "Luke 2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jesus Teaches in the Temple. We read about this in Luke 2.",
      "Jesus loved God's house and Word even as a boy—so can you! We learn from Jesus and how God cares for The teachers.",
      "Even when we feel small, God sees us and loves us.",
      "Praying helps our hearts remember what is true.",
      "We can obey God one step at a time with His help."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Acts 1",
          "1 Samuel 18",
          "Luke 2",
          "2 Kings 4"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "David",
          "God",
          "Paul",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus loved God's house and Word even as a boy—so can you!",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus loved God's house and Word even as a boy—so can you!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Mary and Joseph lose track of Jesus",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Jesus loved God's house and Word even as a boy—so can you!",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus loved God's house and Word even as a boy—so can you!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jesus Teaches in the Temple with God's Word today.",
    "takeaway": "Jesus loved God's house and Word even as a boy—so can you!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jesus Teaches in the Temple. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary and Joseph lose track of Jesus (jesus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They find Him in the temple—teaching elders! (temple)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: I must be about my Father's business (teaching)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary and Joseph lose track of Jesus (luke 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They find Him in the temple—teaching elders! (elders)"
    ]
  },
  "jesusTempt": {
    "kjvRef": "Matthew 4",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jesus Is Tempted.",
      "We read about this in Matthew 4.",
      "Use God's Word when you're tempted!",
      "Jesus showed us how—it works.",
      "We learn from Jesus and how God cares for The devil."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 1",
          "Revelation 21",
          "2 Kings 2",
          "Matthew 4"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 4.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Stephen",
          "The crowds",
          "God"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "Use God's Word when you're tempted! Jesus showed us how—it works.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Use God's Word when you're tempted! Jesus showed us how—it works..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Jesus fasts in the desert for 40 days",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Use God's Word when you're tempted! Jesus showed us how—it works."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Use God's Word when you're tempted! Jesus showed us how—it works..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jesus Is Tempted with God's Word today.",
    "takeaway": "Use God's Word when you're tempted! Jesus showed us how—it works.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jesus Is Tempted. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus fasts in the desert for 40 days (jesus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The devil tries to trick Jesus with bread, power, and glory (temptation)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus uses God's Word—the devil leaves! (desert)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus fasts in the desert for 40 days (matthew 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The devil tries to trick Jesus with bread, power, and glory (devil)"
    ]
  },
  "jesusTemptation": {
    "kjvRef": "Matthew 4",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jesus' Temptation.",
      "We read about this in Matthew 4.",
      "Jesus says no—use God's word!",
      "When the devil lies, quote the Bible!",
      "We learn from Jesus and how God cares for Us."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 22",
          "Judges 16:30",
          "Matthew 4",
          "1 Samuel 16"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 4.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Holy Spirit",
          "Mary",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus says no—use God's word! When the devil lies, quote the Bible!",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus says no—use God's word! When the devil lies, quote the Bible!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Jesus in the desert, hungry",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Jesus says no—use God's word! When the devil lies, quote the Bible!",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus says no—use God's word! When the devil lies, quote the Bible!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jesus' Temptation with God's Word today.",
    "takeaway": "Jesus says no—use God's word! When the devil lies, quote the Bible!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jesus' Temptation. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus in the desert, hungry (temptation)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Devil tempts Him (desert)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says no—uses God's word! (devil)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus in the desert, hungry (matthew 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Devil tempts Him (word)"
    ]
  },
  "jesusWalksWater": {
    "kjvRef": "Matthew 14",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jesus Walks on Water.",
      "We read about this in Matthew 14.",
      "Jesus walks on waves—He lifts us!",
      "Keep your eyes on Him—don't be afraid!",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 14",
          "Matthew 26",
          "Numbers 13",
          "Esther 4"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 14.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "Holy Spirit",
          "David",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus walks on waves—He lifts us! Keep your eyes on Him—don't be afraid!",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus walks on waves—He lifts us! Keep your eyes on Him—don't be afraid!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Disciples in boat, big waves",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Jesus walks on waves—He lifts us! Keep your eyes on Him—don't be afraid!",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus walks on waves—He lifts us! Keep your eyes on Him—don't be afraid!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jesus Walks on Water with God's Word today.",
    "takeaway": "Jesus walks on waves—He lifts us! Keep your eyes on Him—don't be afraid!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jesus Walks on Water. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Disciples in boat, big waves (jesus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus walks on the water (walks)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Peter walks too—Jesus lifts us! (water)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Disciples in boat, big waves (peter)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus walks on the water (waves)"
    ]
  },
  "jobSuffering": {
    "kjvRef": "Job 2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Job's Suffering.",
      "We read about this in Job 2.",
      "You can trust God in hard times!",
      "He always comes through for those who hold on.",
      "We learn from God and how God cares for Job."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 22",
          "Judges 16",
          "Exodus 12",
          "Job 2"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Job 2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Paul",
          "Jesus",
          "David"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "You can trust God in hard times! He always comes through for those who hold on.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: You can trust God in hard times! He always comes through for those who hold on..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Job loses everything—still trusts God",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "You can trust God in hard times! He always comes through for those who hold on."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: You can trust God in hard times! He always comes through for those who hold on..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Job's Suffering with God's Word today.",
    "takeaway": "You can trust God in hard times! He always comes through for those who hold on.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Job's Suffering. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Job loses everything—still trusts God (job)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Friends sit with him but don't understand (suffering)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God speaks—and restores Job! (boils)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Job loses everything—still trusts God (friends)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Friends sit with him but don't understand (job 2)"
    ]
  },
  "johnBaptize": {
    "kjvRef": "Matthew 3",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "John Baptizes Jesus.",
      "We read about this in Matthew 3.",
      "God said yes to Jesus—He says yes to you too!",
      "Baptism is a big, happy yes.",
      "We learn from God and how God cares for Jesus."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Numbers 13",
          "Matthew 26",
          "Acts 2",
          "Matthew 3"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 3.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Paul",
          "Jesus",
          "David"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "God said yes to Jesus—He says yes to you too! Baptism is a big, happy yes.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God said yes to Jesus—He says yes to you too! Baptism is a big, happy yes..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "John preaches by the river Jordan",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older.",
          "God said yes to Jesus—He says yes to you too! Baptism is a big, happy yes."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God said yes to Jesus—He says yes to you too! Baptism is a big, happy yes..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading John Baptizes Jesus with God's Word today.",
    "takeaway": "God said yes to Jesus—He says yes to you too! Baptism is a big, happy yes.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in John Baptizes Jesus. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: John preaches by the river Jordan (john)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus steps into the water (baptize)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A dove lands—God says: This is my Son! (jordan)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: John preaches by the river Jordan (matthew 3)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus steps into the water (dove)"
    ]
  },
  "jonah": {
    "kjvRef": "Jonah 1–3",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "God told His prophet Jonah, \"Go to Nineveh and tell the people to turn from their wrong ways.\" Nineveh was a big city, and Jonah did not want to go. Instead, he bought a ticket and sailed the opposite direction.",
      "God sent a powerful storm. The sailors were afraid. Jonah said the storm was because he had run from God—throw me into the sea, he said, so you can be safe. They tried rowing harder first, then they did as he asked.",
      "God prepared a great fish. It swallowed Jonah. Inside that dark place for three days and three nights, Jonah prayed. He thanked God and said he would obey. God spoke to the fish, and it spit Jonah out onto dry land.",
      "God spoke again: Go to Nineveh. This time Jonah went. He walked through the city and said God would judge their evil. The people—from the king to the common folk—believed God. They fasted, prayed, and turned from their wrong.",
      "God showed mercy. Jonah learned (the hard way) that God cares about people who need a second chance—including us when we say sorry and turn back to Him."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where did God first send Jonah to preach?",
        "choices": [
          "Jerusalem",
          "Nineveh",
          "Egypt",
          "Babylon"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Nineveh was the city God cared about.",
        "wrongFeedback": "Look at the very first sentence—what city name does God say? (Answer: Nineveh.)"
      },
      {
        "question": "How did Jonah try to run away?",
        "choices": [
          "He hid in a cave",
          "He took a ship going the other way",
          "He rode a camel east",
          "He stayed home silently"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—Jonah went to sea instead of obeying.",
        "wrongFeedback": "Did Jonah walk to the city—or pay to go somewhere else? Reread paragraph one. (Answer: He took a ship going the other way.)"
      },
      {
        "question": "What did God send when Jonah was at sea?",
        "choices": [
          "A calm breeze",
          "A great storm",
          "A parade",
          "Snow"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! The storm got everyone's attention.",
        "wrongFeedback": "What made the sailors so scared on the boat? Check paragraph two. (Answer: A great storm.)"
      },
      {
        "question": "How long was Jonah inside the great fish?",
        "choices": [
          "One hour",
          "Three days and three nights",
          "One year",
          "Three minutes"
        ],
        "correctIndex": 1,
        "correctFeedback": "Correct—that matches what Jonah prayed through.",
        "wrongFeedback": "Search the story for \"three\" near the fish. (Answer: Three days and three nights.)"
      },
      {
        "question": "What did the people of Nineveh do when they heard God's warning?",
        "choices": [
          "They laughed and ignored Jonah",
          "They believed God and turned from their wrong",
          "They chased Jonah out",
          "They built more ships"
        ],
        "correctIndex": 1,
        "correctFeedback": "Wonderful—they repented, and God showed mercy.",
        "wrongFeedback": "Read the paragraph about Jonah walking through the city—did they mock him or change? (Answer: They believed God and turned from their wrong.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job following Jonah's story about obeying and second chances.",
    "takeaway": "When we run from what God asks, He can still reach us. Saying sorry and obeying is brave.",
    "prayer": "God, when I want to run away, turn my heart back to You. Help me obey. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon: prophet-looking man sneaking toward a wooden ship with luggage, city behind him, colorful, no text.",
      "Hand-drawn bouncy cartoon: stormy waves, worried sailors on deck, big waves, not too scary, no text.",
      "Hand-drawn bouncy cartoon: big friendly fish shape (not scary) with prayer hands silhouette inside, underwater light, no text.",
      "Hand-drawn bouncy cartoon: same man walking through ancient city street with simple robe, people listening, no text.",
      "Hand-drawn bouncy cartoon: king on throne looking humble, people praying, soft light, hopeful mood, no text."
    ]
  },
  "jonahVine": {
    "kjvRef": "Jonah 4",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jonah and the Vine.",
      "We read about this in Jonah 4.",
      "God loves everyone—even people we think don't deserve it.",
      "So should we!",
      "We learn from God and how God cares for Jonah."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 7",
          "Matthew 6",
          "Matthew 3",
          "Jonah 4"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Jonah 4.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Paul",
          "Jesus",
          "David"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "God loves everyone—even people we think don't deserve it. So should we!",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God loves everyone—even people we think don't deserve it. So should we!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Jonah sits angry outside Nineveh",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older.",
          "God loves everyone—even people we think don't deserve it. So should we!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God loves everyone—even people we think don't deserve it. So should we!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jonah and the Vine with God's Word today.",
    "takeaway": "God loves everyone—even people we think don't deserve it. So should we!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jonah and the Vine. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jonah sits angry outside Nineveh (jonah)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A vine grows up to shade him—then a worm eats it (vine)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God says: I care about people even more than the vine (worm)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jonah sits angry outside Nineveh (jonah 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A vine grows up to shade him—then a worm eats it (nineveh)"
    ]
  },
  "josephCoat": {
    "kjvRef": "Genesis 37",
    "paragraphs": [
      "Jacob loved his son Joseph more than his other sons. He gave Joseph a beautiful coat of many colours.",
      "Joseph had dreams that one day his family would bow to him. He told his brothers about the dreams.",
      "The brothers were jealous and angry. They hated Joseph because of his dreams and the special coat.",
      "One day the brothers planned to hurt Joseph. They threw him into a dry well.",
      "Later they sold him to traders going to Egypt. They told Jacob a wild animal ate Joseph. But God was with Joseph."
    ],
    "imagePrompts": [
      "bright bouncy cartoon for kids: Jacob giving Joseph a colourful coat, Joseph smiling, brothers watching jealously, no text",
      "fun kid illustration: Joseph telling his brothers about his dream, stars and sheaves bowing to him, brothers angry, no text",
      "colorful Bible scene for children: empty dry well from above, sense of trouble, no violence shown, no text",
      "exciting cartoon: traders meeting brothers, Joseph with caravan toward Egypt, worried but brave face, no text",
      "hopeful ending illustration: Joseph far from home with warm light suggesting God watching over him, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "Look at how jealousy hurt the family!",
    "quizHeading": "Joseph's Coat Questions",
    "questions": [
      {
        "question": "What special gift did Jacob give Joseph?",
        "choices": [
          "A new donkey",
          "A coat of many colours",
          "A big farm",
          "A crown"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! A beautiful coat — it made his brothers jealous.",
        "wrongFeedback": "Not a donkey or crown. Jacob gave him a coat of many colours because he loved Joseph dearly (Genesis 37:3)."
      },
      {
        "question": "What did Joseph dream about his family?",
        "choices": [
          "They would be rich",
          "They would bow to him",
          "They would get lost",
          "They would fight"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! In his dreams, his family bowed to him — God was showing the future.",
        "wrongFeedback": "Not fighting or getting lost. Joseph dreamed his brothers' sheaves bowed to his (Genesis 37:5–8)."
      },
      {
        "question": "Why were Joseph's brothers angry?",
        "choices": [
          "He took their toys",
          "They were jealous of the coat and dreams",
          "He ate their food",
          "He was older"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Jealousy over the coat and dreams made them hate him.",
        "wrongFeedback": "He didn't take toys or food. The brothers hated him because Jacob loved him more and his dreams sounded like he'd rule over them."
      },
      {
        "question": "What did the brothers do to Joseph?",
        "choices": [
          "Gave him gifts",
          "Threw him in a well and sold him",
          "Helped him farm",
          "Took him to Egypt themselves"
        ],
        "correctIndex": 1,
        "correctFeedback": "Correct! They threw him in a pit then sold him to traders.",
        "wrongFeedback": "They didn't help or gift him. They put him in a dry well, then sold him to Ishmeelite traders (Genesis 37:28)."
      },
      {
        "question": "What can we learn from Joseph's brothers?",
        "choices": [
          "Jealousy is good",
          "Jealousy hurts people",
          "Dreams are bad",
          "Coats are important"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! Jealousy leads to bad choices — love others instead.",
        "wrongFeedback": "The story shows jealousy caused pain. God wants us to be happy for others, not jealous!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star for learning about jealousy!",
    "takeaway": "Jealousy hurts families — God wants us to love and be thankful.",
    "prayer": "God, help me not be jealous. Help me love my family and friends. Amen."
  },
  "josephDreams": {
    "kjvRef": "Genesis 40",
    "paragraphs": [
      "Joseph was in prison in Egypt. Two of Pharaoh's servants were there too: the cupbearer and the baker.",
      "Both had strange dreams. Joseph said, \"God will help me understand your dreams.\"",
      "The cupbearer dreamed of a vine with three branches that produced grapes. Joseph said, \"In three days Pharaoh will restore you to your position.\"",
      "The baker dreamed of three baskets of bread on his head, birds eating from them. Joseph said, \"In three days Pharaoh will take your life.\"",
      "Everything happened as Joseph said. The cupbearer forgot Joseph, but God was still with him in prison."
    ],
    "imagePrompts": [
      "bright cartoon for kids: Joseph talking kindly with cupbearer and baker in a stone room, soft light, no text",
      "fun kid illustration: cupbearer dreaming of vine with three branches and grapes, dream cloud, no text",
      "colorful Bible scene for children: baker dreaming of three baskets on head, birds near bread, worried face, no text",
      "exciting cartoon: Joseph explaining, cupbearer hopeful, baker solemn, simple bars in background, no text",
      "hopeful ending illustration: cupbearer serving at court again, small inset of Joseph still waiting, warm sky, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "Joseph helped others even in prison — God was with him!",
    "quizHeading": "Joseph's Dreams in Prison",
    "questions": [
      {
        "question": "Who was in prison with Joseph?",
        "choices": [
          "His brothers",
          "Pharaoh's cupbearer and baker",
          "The king",
          "His father"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Pharaoh's cupbearer and baker were there too.",
        "wrongFeedback": "Not his brothers or father. Two of Pharaoh's officers were imprisoned with him (Genesis 40:1–3)."
      },
      {
        "question": "What did Joseph say about their dreams?",
        "choices": [
          "They were scary",
          "God will help me understand them",
          "Forget them",
          "Tell Pharaoh first"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! Joseph trusted God to give the meaning.",
        "wrongFeedback": "He did not say to forget them. He said, \"Do not interpretations belong to God?\" — God helped him explain (Genesis 40:8)."
      },
      {
        "question": "What did the cupbearer's dream mean?",
        "choices": [
          "He would die",
          "He would be restored in three days",
          "He would escape",
          "He would get more wine"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! In three days he would be back serving Pharaoh.",
        "wrongFeedback": "Not death or escape. Joseph said the three branches meant three days until Pharaoh lifted up his head — restored (Genesis 40:12–13)."
      },
      {
        "question": "What happened to the baker?",
        "choices": [
          "He was freed",
          "Pharaoh took his life in three days",
          "He became king",
          "He got new baskets"
        ],
        "correctIndex": 1,
        "correctFeedback": "Correct! In three days it happened as Joseph said.",
        "wrongFeedback": "The birds eating from the baskets meant Pharaoh would lift up his head — off from him. It was sad news (Genesis 40:16–19)."
      },
      {
        "question": "What can we learn from Joseph in prison?",
        "choices": [
          "God forgets us in hard times",
          "God is with us and uses us to help others",
          "Dreams are not important",
          "Prison is fun"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! Even in prison, God was with Joseph and used him to help others.",
        "wrongFeedback": "The story shows God never left Joseph. He gave him wisdom to understand dreams and comfort the prisoners!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star for seeing God's faithfulness in hard times!",
    "takeaway": "God is with us everywhere — even in prison — and can use us to help others.",
    "prayer": "God, thank You for being with me always. Help me help others even when things are hard. Amen."
  },
  "josephPrison": {
    "kjvRef": "Genesis 40",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Joseph in Prison.",
      "We read about this in Genesis 40.",
      "God is with you in hard places!",
      "He never forgets you.",
      "We learn from God and how God cares for Joseph in prison."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "John 6",
          "John 12",
          "Acts 2",
          "Genesis 40"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Genesis 40.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "The crowds",
          "Stephen",
          "Jesus"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "God is with you in hard places! He never forgets you.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God is with you in hard places! He never forgets you..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Joseph is put in prison",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "God is with you in hard places! He never forgets you."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God is with you in hard places! He never forgets you..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Joseph in Prison with God's Word today.",
    "takeaway": "God is with you in hard places! He never forgets you.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Joseph in Prison. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joseph is put in prison (joseph)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The cupbearer has a dream—Joseph explains (prison)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God is with Joseph even in prison (cupbearer)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joseph is put in prison (dream)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The cupbearer has a dream—Joseph explains (genesis 40)"
    ]
  },
  "josephRuler": {
    "kjvRef": "Genesis 41",
    "paragraphs": [
      "Pharaoh had two dreams: seven fat cows eaten by seven thin cows, and seven good heads of grain eaten by seven thin ones.",
      "No one could explain the dreams. The cupbearer remembered Joseph and told Pharaoh about him.",
      "Joseph was brought from prison. He said, \"God will give Pharaoh the meaning. Seven good years are coming, then seven bad years of famine.\"",
      "Joseph advised, \"Choose a wise man to store food during the good years.\" Pharaoh said, \"You are wise — you will be in charge.\"",
      "Joseph became ruler over Egypt. He stored food. When famine came, his family came for food — and God's plan brought them together again."
    ],
    "imagePrompts": [
      "bright cartoon for kids: Pharaoh dreaming of seven fat cows and seven thin cows by the river, no text",
      "fun kid illustration: Pharaoh dreaming of seven good grain heads and thin ones eating them, worried face, no text",
      "colorful Bible scene for children: Joseph before Pharaoh on throne, explaining dreams, no text",
      "exciting cartoon: Joseph in fine clothes, grain being stored in jars, busy helpers, no text",
      "happy ending illustration: brothers bowing before Joseph in Egypt, tears and forgiveness mood, soft light, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "Joseph went from prison to ruler — God had a plan!",
    "quizHeading": "Joseph Becomes Ruler Questions",
    "questions": [
      {
        "question": "What did Pharaoh dream about?",
        "choices": [
          "Cows and grain",
          "Ships and gold",
          "Mountains and rivers",
          "Stars and moon"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes! Seven fat cows eaten by thin ones, and grain the same.",
        "wrongFeedback": "Not ships or stars. Pharaoh dreamed of cows and grain — seven good and seven bad (Genesis 41:1–7)."
      },
      {
        "question": "Who remembered Joseph and told Pharaoh?",
        "choices": [
          "His brothers",
          "The cupbearer",
          "The baker",
          "His father"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! The cupbearer remembered Joseph from prison.",
        "wrongFeedback": "His brothers were not there. The chief butler remembered Joseph could interpret dreams (Genesis 41:9–13)."
      },
      {
        "question": "What did the dreams mean?",
        "choices": [
          "Seven good years then seven bad years of famine",
          "Seven parties",
          "Seven new friends",
          "Seven animals"
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly! God showed seven good years followed by seven years of need.",
        "wrongFeedback": "Not parties or friends. Joseph said seven years of plenty, then seven years of famine (Genesis 41:29–31)."
      },
      {
        "question": "What did Pharaoh do after Joseph explained?",
        "choices": [
          "Put him back in prison",
          "Made him ruler over Egypt",
          "Gave him food only",
          "Sent him home"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Pharaoh set Joseph over the land — second only to himself.",
        "wrongFeedback": "Not back to prison. Pharaoh saw God's wisdom in Joseph and made him ruler (Genesis 41:39–41)."
      },
      {
        "question": "What can we learn from Joseph becoming ruler?",
        "choices": [
          "God forgets us",
          "God has a plan and uses hard times for good",
          "Dreams are silly",
          "Be jealous"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! God turned Joseph's hard years into blessing for many.",
        "wrongFeedback": "The story shows God had a plan. What others meant for harm, God used for good!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star — God has a plan!",
    "takeaway": "God can use hard times for good — trust His plan.",
    "prayer": "God, thank You for having a plan for me. Help me trust You in hard times. Amen."
  },
  "josephSold": {
    "kjvRef": "Genesis 37:12–36",
    "paragraphs": [
      "Joseph's brothers were jealous of him. They hated his special coat and his dreams.",
      "One day Jacob sent Joseph to check on his brothers who were with the sheep.",
      "The brothers saw Joseph coming. They planned to hurt him and threw him into an empty well.",
      "Some traders came by. The brothers pulled Joseph out and sold him for money.",
      "They dipped Joseph's coat in goat blood and showed it to Jacob. Jacob thought a wild animal killed Joseph. But God was with Joseph in Egypt."
    ],
    "imagePrompts": [
      "bright cartoon for kids: Joseph wearing colourful coat, walking to find his brothers, open path, no text",
      "fun kid illustration: brothers seeing Joseph coming, angry faces, planning something, no text",
      "colorful Bible scene for children: dry well from above, small figure looking up, no violence, no text",
      "exciting cartoon: traders arriving, brothers and caravan, silver exchanged, no text",
      "sad but hopeful illustration: father grieving over torn coat with red stain, gentle light from above, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "The brothers were very jealous — see what they did!",
    "quizHeading": "Joseph Sold Questions",
    "questions": [
      {
        "question": "Why did Joseph's brothers hate him?",
        "choices": [
          "He was slow",
          "Jealous of coat and dreams",
          "He ate their food",
          "He was too tall"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Jealousy over the coat and dreams made them angry.",
        "wrongFeedback": "Not food or height. They hated the special treatment and dreams where they bowed to him."
      },
      {
        "question": "What did Jacob ask Joseph to do?",
        "choices": [
          "Stay home",
          "Check on his brothers with the sheep",
          "Make a new coat",
          "Go to Egypt"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! Jacob sent him to see if the brothers were okay.",
        "wrongFeedback": "Not to make a coat or go to Egypt alone. Jacob sent him to see how the brothers and flocks were doing (Genesis 37:14)."
      },
      {
        "question": "What did the brothers do when they saw Joseph?",
        "choices": [
          "Hugged him",
          "Threw him in a well",
          "Gave him food",
          "Ran away"
        ],
        "correctIndex": 1,
        "correctFeedback": "Correct! They threw him into an empty well.",
        "wrongFeedback": "They didn't hug or feed him. In anger, they put him in a dry pit (Genesis 37:24)."
      },
      {
        "question": "How did the brothers trick Jacob?",
        "choices": [
          "Told him Joseph ran away",
          "Dipped coat in blood",
          "Hid Joseph",
          "Said Joseph was king"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! They dipped the coat in goat blood and said a wild animal ate him.",
        "wrongFeedback": "They didn't hide him or say he was king. They showed the bloody coat so Jacob thought Joseph was dead."
      },
      {
        "question": "What can we learn from this part of Joseph's story?",
        "choices": [
          "Jealousy is okay",
          "God is with us even in hard times",
          "Trick your family",
          "Run away from problems"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! Even when bad things happen, God is with us — like He was with Joseph.",
        "wrongFeedback": "The story shows jealousy causes pain, but God never left Joseph. Trust Him in hard times!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star for seeing God's faithfulness!",
    "takeaway": "God is with us even when others hurt us.",
    "prayer": "God, thank You for being with me always. Help me trust You in hard times. Amen."
  },
  "joshuaAi": {
    "kjvRef": "Joshua 8",
    "paragraphs": [
      "After Jericho, Joshua led the people against the city of Ai.",
      "The first attack failed because Achan had taken things God said belonged to Him from Jericho.",
      "God told Joshua to remove the sin from the camp. Achan confessed, and the trouble was purged.",
      "God gave a new plan: part of the army hid, part pretended to flee. The men of Ai chased Israel.",
      "The hidden soldiers took the city. God gave the victory when the people obeyed."
    ],
    "imagePrompts": [
      "bright cartoon for kids: Joshua leading people toward a small city on a hill, no text",
      "fun kid illustration: soldiers turning back, battle not going well, surprised faces, no text",
      "colorful Bible scene for children: serious moment of truth — hidden things brought out, humble colours, no text",
      "exciting cartoon: ambush diagram style — some soldiers hiding, some running as decoy, simple and clear, no text",
      "happy ending illustration: people thankful, city quiet, dawn light, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "Sin caused trouble, but God gave a new plan!",
    "quizHeading": "Battle of Ai Questions",
    "questions": [
      {
        "question": "Why did the first attack on Ai fail?",
        "choices": [
          "Too many soldiers",
          "Sin in the camp — Achan disobeyed God",
          "Bad weather",
          "No plan"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! One man's disobedience brought defeat.",
        "wrongFeedback": "Israel could not stand before their enemies because accursed thing was in the camp (Joshua 7:11–12)."
      },
      {
        "question": "What did God tell Joshua to do?",
        "choices": [
          "Give up",
          "Remove the sin from the camp",
          "Attack again the same way",
          "Build a wall"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! Deal with the sin first.",
        "wrongFeedback": "God said to sanctify the people — the trespass must be put away before victory (Joshua 7:13)."
      },
      {
        "question": "What was the new plan for Ai?",
        "choices": [
          "Full frontal attack only",
          "Ambush with hidden soldiers",
          "Wait forever",
          "Run away"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Hide part of the army, draw the city out, then take it.",
        "wrongFeedback": "Joshua laid an ambush behind the city as the Lord commanded (Joshua 8:3–8)."
      },
      {
        "question": "What happened when the men of Ai chased Israel?",
        "choices": [
          "They caught everyone",
          "The hidden men took the city",
          "They turned back",
          "Rain stopped them"
        ],
        "correctIndex": 1,
        "correctFeedback": "Correct! The trap worked — the city was left open.",
        "wrongFeedback": "When Ai pursued Joshua's men, those in ambush rose and entered the city (Joshua 8:19)."
      },
      {
        "question": "What can we learn from Ai?",
        "choices": [
          "Sin does not matter",
          "Obedience brings victory",
          "Always charge first",
          "Hide from problems"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! Turn from sin and obey God — He helps His people win.",
        "wrongFeedback": "Sin blocked God's help; when the camp was clean, He fought for them again!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star for learning obedience matters!",
    "takeaway": "Obedience to God brings victory — deal with sin quickly.",
    "prayer": "God, help me obey You and turn from sin. Thank You for victory. Amen."
  },
  "joshuaJordan": {
    "kjvRef": "Joshua 3",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Joshua at the Jordan.",
      "We read about this in Joshua 3.",
      "God leads you into the new!",
      "Step forward in faith—He holds the water back.",
      "We learn from God and how God cares for Joshua and Israel."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 16:15",
          "1 Kings 3",
          "Acts 16",
          "Joshua 3"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Joshua 3.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Mary",
          "Holy Spirit",
          "The crowds"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "God leads you into the new! Step forward in faith—He holds the water back.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God leads you into the new! Step forward in faith—He holds the water back..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Priests carry the ark to the Jordan",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "God leads you into the new! Step forward in faith—He holds the water back."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God leads you into the new! Step forward in faith—He holds the water back..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Joshua at the Jordan with God's Word today.",
    "takeaway": "God leads you into the new! Step forward in faith—He holds the water back.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Joshua at the Jordan. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Priests carry the ark to the Jordan (joshua)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They step in—the river stops! (jordan)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Israel crosses on dry ground (ark)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Priests carry the ark to the Jordan (river)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They step in—the river stops! (joshua 3)"
    ]
  },
  "judasKiss": {
    "kjvRef": "Matthew 26",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Judas Betrays Jesus.",
      "We read about this in Matthew 26.",
      "Even when people hurt you, choose love like Jesus did!",
      "He forgave.",
      "We learn from Jesus and how God cares for Judas."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 26",
          "Genesis 28:12",
          "Genesis 37:28",
          "1 Kings 18"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 26.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "David",
          "Jesus",
          "Holy Spirit"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Even when people hurt you, choose love like Jesus did! He forgave.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Even when people hurt you, choose love like Jesus did! He forgave..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "Soldiers come to the garden with torches"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Even when people hurt you, choose love like Jesus did! He forgave.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Even when people hurt you, choose love like Jesus did! He forgave..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Judas Betrays Jesus with God's Word today.",
    "takeaway": "Even when people hurt you, choose love like Jesus did! He forgave.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Judas Betrays Jesus. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Soldiers come to the garden with torches (judas)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Judas kisses Jesus—a signal to arrest Him (betray)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus goes peacefully—He loves us that much (kiss)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Soldiers come to the garden with torches (matthew 26)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Judas kisses Jesus—a signal to arrest Him (arrest)"
    ]
  },
  "juniaApostle": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Junia the Apostle.",
      "We read about this in the Bible.",
      "God calls you by name and honors your faithfulness!",
      "You are seen and valued.",
      "We learn from God and how God cares for Junia."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "Nehemiah 4",
          "Exodus 14",
          "Mark 12"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Stephen",
          "The crowds",
          "Jesus",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God calls you by name and honors your faithfulness! You are seen and valued.",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God calls you by name and honors your faithfulness! You are seen and valued..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Paul greets Andronicus and Junia in Romans",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God calls you by name and honors your faithfulness! You are seen and valued.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God calls you by name and honors your faithfulness! You are seen and valued..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Junia the Apostle with God's Word today.",
    "takeaway": "God calls you by name and honors your faithfulness! You are seen and valued.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Junia the Apostle. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul greets Andronicus and Junia in Romans (junia)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He calls them outstanding among the apostles (apostle)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Junia was in prison for the gospel—so brave! (romans 16)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul greets Andronicus and Junia in Romans (paul)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He calls them outstanding among the apostles (brave)"
    ]
  },
  "lambBook": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Lamb's Book of Life.",
      "We read about this in the Bible.",
      "Believe in Jesus and your name is in the Lamb's Book of Life!",
      "That's the best news.",
      "We learn from God and how God cares for All who believe."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "Matthew 18",
          "Luke 23",
          "Matthew 14"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Holy Spirit",
          "David",
          "Mary",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Believe in Jesus and your name is in the Lamb's Book of Life! That's the best news.",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Believe in Jesus and your name is in the Lamb's Book of Life! That's the best news..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A great book is opened before the throne",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Believe in Jesus and your name is in the Lamb's Book of Life! That's the best news.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Believe in Jesus and your name is in the Lamb's Book of Life! That's the best news..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Lamb's Book of Life with God's Word today.",
    "takeaway": "Believe in Jesus and your name is in the Lamb's Book of Life! That's the best news.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Lamb's Book of Life. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A great book is opened before the throne (lamb)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Names are written—those who belong to Jesus (book of life)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Believe in Jesus—your name is in it! (revelation 21)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A great book is opened before the throne (names)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Names are written—those who belong to Jesus (written)"
    ]
  },
  "lastSupper": {
    "kjvRef": "Luke 22",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Last Supper.",
      "We read about this in Luke 22.",
      "Jesus shares bread—He loves us!",
      "Remember Him when you eat together!",
      "We learn from Jesus and how God cares for His twelve disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 22",
          "Matthew 4",
          "Daniel 3:25",
          "Genesis 1:3"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 22.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Holy Spirit",
          "Jesus",
          "Paul",
          "David"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus shares bread—He loves us! Remember Him when you eat together!",
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus shares bread—He loves us! Remember Him when you eat together!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Jesus and the disciples at table"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Jesus shares bread—He loves us! Remember Him when you eat together!",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus shares bread—He loves us! Remember Him when you eat together!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Last Supper with God's Word today.",
    "takeaway": "Jesus shares bread—He loves us! Remember Him when you eat together!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Last Supper. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus and the disciples at table (last supper)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus breaks bread (bread)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: This is My body—He loves us! (wine)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus and the disciples at table (luke 22)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus breaks bread (matthew 26)"
    ]
  },
  "lazarus": {
    "kjvRef": "John 11:43-44",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Lazarus Rise – John 11:43-44. Lazarus was very sick, and his sisters Mary and Martha sent for Jesus.",
      "But Jesus waited. When He arrived, Lazarus had died and was in the tomb for 4 days.",
      "Jesus went to the tomb and said, 'Lazarus, come forth!' Lazarus came out, still wrapped in grave clothes. Jesus said, 'Loose him, and let him go.' Everyone was amazed—Jesus has power over death!",
      "For you: When things feel dead or hopeless, Jesus can bring new life. He is the resurrection.",
      "Trust Him with your hardest days—He has power to make things new."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 25",
          "Genesis 22",
          "John 11:43-44",
          "Judges 16:30"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: John 11:43-44.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Stephen",
          "The crowds",
          "Mary"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "Lazarus was dead for 4 days, but Jesus called him out of the tomb. Lazarus came back to life! Jesus has power over death. When we feel sad…"
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Lazarus was dead for 4 days, but Jesus called him out of the tomb. Lazarus came back to….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Mary and Martha sad – Lazarus is dead",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "When things feel dead or hopeless, Jesus can bring new life. He is the resurrection. Trust Him with your hardest…",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: When things feel dead or hopeless, Jesus can bring new life. He is the resurrection.….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Lazarus Raised with God's Word today.",
    "takeaway": "Lazarus was dead for 4 days, but Jesus called him out of the tomb. Lazarus came back to life! Jesus has power over death. When we feel sad or hopeless, Jesus can bring new life and hope. Trust…",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Lazarus Raised. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary and Martha sad – Lazarus is dead (lazarus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus at the tomb – Calling Lazarus out (raised)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Lazarus walking out alive – Jesus has power over death (dead)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary and Martha sad – Lazarus is dead (come out)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus at the tomb – Calling Lazarus out (alive)"
    ]
  },
  "loisTimothy": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Lois Passes Faith to Timothy.",
      "We read about this in the Bible.",
      "Faith is passed on!",
      "Listen to godly people in your family—they give you something priceless.",
      "We learn from God and how God cares for Lois and Timothy."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "John 10",
          "Esther 4",
          "Matthew 26"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "God",
          "Stephen",
          "The crowds"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "Faith is passed on! Listen to godly people in your family—they give you something priceless.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Faith is passed on! Listen to godly people in your family—they give you something….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Lois is Timothy's grandmother and a woman of faith"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Faith is passed on! Listen to godly people in your family—they give you something priceless.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Faith is passed on! Listen to godly people in your family—they give you something….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Lois Passes Faith to Timothy with God's Word today.",
    "takeaway": "Faith is passed on! Listen to godly people in your family—they give you something priceless.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Lois Passes Faith to Timothy. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Lois is Timothy's grandmother and a woman of faith (lois)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She teaches Timothy God's Word from childhood (timothy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Timothy becomes a great minister—faith passed on! (2 timothy 1)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Lois is Timothy's grandmother and a woman of faith (grandmother)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She teaches Timothy God's Word from childhood (faith)"
    ]
  },
  "lostSheep": {
    "kjvRef": "Luke 15:3–7",
    "hintAboveQuiz": "Think about how much the shepherd cared for the one lost sheep!",
    "readAlongImages": [],
    "paragraphs": [
      "Jesus told a story about a shepherd who had 100 sheep.",
      "One day, one sheep got lost. The shepherd left the 99 safe sheep and went to search for the lost one.",
      "He looked everywhere until he found it! He was so happy.",
      "The shepherd carried the sheep home on his shoulders.",
      "He called his friends and said, \"Rejoice with me! I found my lost sheep!\" Jesus said, \"There is joy in heaven when one sinner turns to God.\" That matches Luke 15:7 (KJV): \"joy shall be in heaven over one sinner that repenteth.\""
    ],
    "quizHeading": "Find the Lost Sheep",
    "questions": [
      {
        "question": "How many sheep did the shepherd have?",
        "choices": [
          "10",
          "50",
          "100",
          "200"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes! 100 sheep — and he noticed when one was missing.",
        "wrongFeedback": "The story says 100 sheep. That's a big flock, and he still cared about each one!"
      },
      {
        "question": "What did the shepherd do when one sheep was lost?",
        "choices": [
          "Stayed with the 99",
          "Went to search for it",
          "Waited for it to come back",
          "Called the police"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! He left the 99 and searched until he found it.",
        "wrongFeedback": "He didn't stay or wait. The shepherd loved every sheep, so he went looking right away."
      },
      {
        "question": "How did the shepherd carry the lost sheep home?",
        "choices": [
          "In a bag",
          "On his shoulders",
          "By pulling it",
          "Letting it walk"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! He carried it on his shoulders — so gentle and happy.",
        "wrongFeedback": "The Bible says he put it on his shoulders and carried it home. That shows great care!"
      },
      {
        "question": "What did the shepherd do when he found the sheep?",
        "choices": [
          "Got angry",
          "Called friends to rejoice",
          "Punished it",
          "Sold it"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! He was so happy he called friends to celebrate.",
        "wrongFeedback": "He was joyful, not angry. He said \"Rejoice with me!\" because the lost was found!"
      },
      {
        "question": "What does Jesus say happens in heaven?",
        "choices": [
          "Angels are sad",
          "Joy when one sinner turns to God",
          "Nothing special",
          "Only big groups matter"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! Heaven rejoices when even one person comes back to God.",
        "wrongFeedback": "The story ends with Jesus saying there is joy in heaven over one sinner who repents. God cares about each person!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star — God rejoices over you too!",
    "takeaway": "God loves each one of us so much — He searches for the lost.",
    "prayer": "God, thank You for loving me and searching for me when I'm lost. Amen.",
    "imagePrompts": [
      "bright cartoon for kids: shepherd with 100 sheep on green hills, peaceful scene, no text",
      "fun kid illustration: one sheep missing, shepherd looking worried, 99 sheep safe in field, no text",
      "colorful Bible scene for children: shepherd searching high and low for lost sheep, mountains and bushes",
      "happy cartoon: shepherd finding the lost sheep, big smile, carrying it on shoulders",
      "joyful ending illustration: shepherd with friends celebrating, carrying sheep home, party feeling, no text"
    ]
  },
  "loveChapter": {
    "kjvRef": "1 Corinthians 13",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Love Is Patient and Kind.",
      "We read about this in 1 Corinthians 13.",
      "Love isn't a feeling—it's a choice!",
      "Choose to be patient and kind like God.",
      "We learn from Paul and how God cares for The church."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "1 Corinthians 13",
          "the Bible",
          "1 Samuel 17",
          "Matthew 28"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 1 Corinthians 13.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Holy Spirit",
          "Mary",
          "Paul"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Paul.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Love isn't a feeling—it's a choice! Choose to be patient and kind like God.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Love isn't a feeling—it's a choice! Choose to be patient and kind like God..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "A heart shape glows with light",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Love isn't a feeling—it's a choice! Choose to be patient and kind like God.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Love isn't a feeling—it's a choice! Choose to be patient and kind like God..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Love Is Patient and Kind with God's Word today.",
    "takeaway": "Love isn't a feeling—it's a choice! Choose to be patient and kind like God.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Love Is Patient and Kind. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A heart shape glows with light (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Love is patient, love is kind... (1 corinthians 13)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Love never fails—God is love! (patient)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A heart shape glows with light (kind)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Love is patient, love is kind... (heart)"
    ]
  },
  "loveNeighbor": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Love Your Neighbor.",
      "We read about this in the Bible.",
      "Your neighbor is anyone who needs help!",
      "Go—be the one who stops and cares.",
      "We learn from Jesus and how God cares for The lawyer."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Revelation 22",
          "the Bible",
          "Genesis 41",
          "Exodus 20:1-17"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Paul",
          "David",
          "God"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Your neighbor is anyone who needs help! Go—be the one who stops and cares."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Your neighbor is anyone who needs help! Go—be the one who stops and cares..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A lawyer asks: who is my neighbor?",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "Your neighbor is anyone who needs help! Go—be the one who stops and cares.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Your neighbor is anyone who needs help! Go—be the one who stops and cares..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Love Your Neighbor with God's Word today.",
    "takeaway": "Your neighbor is anyone who needs help! Go—be the one who stops and cares.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Love Your Neighbor. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A lawyer asks: who is my neighbor? (neighbor)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Samaritan stops to help the wounded man (love)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: go and do the same! (luke 10)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A lawyer asks: who is my neighbor? (good samaritan)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The Samaritan stops to help the wounded man (help)"
    ]
  },
  "lydiaSell": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Lydia Opens Her Heart.",
      "We read about this in the Bible.",
      "God is the one who opens our hearts to believe!",
      "Ask Him to open yours.",
      "We learn from God and how God cares for Lydia."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "Psalm 23",
          "John 18",
          "2 Kings 5"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "David",
          "Jesus",
          "God",
          "Paul"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God is the one who opens our hearts to believe! Ask Him to open yours.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God is the one who opens our hearts to believe! Ask Him to open yours..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot.",
          "Lydia sells purple cloth by the river"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God is the one who opens our hearts to believe! Ask Him to open yours.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God is the one who opens our hearts to believe! Ask Him to open yours..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Lydia Opens Her Heart with God's Word today.",
    "takeaway": "God is the one who opens our hearts to believe! Ask Him to open yours.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Lydia Opens Her Heart. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Lydia sells purple cloth by the river (lydia)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul preaches—Lydia listens carefully (purple)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God opens her heart—she believes and is baptized! (acts 16)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Lydia sells purple cloth by the river (cloth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul preaches—Lydia listens carefully (believe)"
    ]
  },
  "manna": {
    "kjvRef": "Exodus 16:15",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Manna from Heaven – Exodus 16:15. The Israelites were hungry in the desert. They grumbled, but God said, 'I will rain bread from heaven for you.' Every morning, white flakes appeared on the ground like frost.",
      "It tasted like honey wafers! They called it manna.",
      "God told them to gather only what they needed for each day—no more, no less. On the sixth day they gathered extra for the Sabbath.",
      "God provided every morning! For you: God gives us what we need each day—food, strength, love.",
      "When you feel worried or empty, trust Him. He provides just enough, right when you need it."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 16:15",
          "Acts 28",
          "1 Samuel 18",
          "Luke 15"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 16:15.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Stephen",
          "Mary",
          "God",
          "The crowds"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God sent bread from heaven every morning for His people in the desert. They called it manna. God gives us what we need each day. When you…",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God sent bread from heaven every morning for His people in the desert. They called it….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot.",
          "Israelites hungry in the desert – Complaining to Moses"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "God gives us what we need each day—food, strength, love. When you feel worried or empty, trust Him. He provides just…",
          "Ignore God until we are older."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God gives us what we need each day—food, strength, love. When you feel worried or empty,….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Manna from Heaven with God's Word today.",
    "takeaway": "God sent bread from heaven every morning for His people in the desert. They called it manna. God gives us what we need each day. When you worry about tomorrow, trust Him—He provides just enough, one…",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Manna from Heaven. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Israelites hungry in the desert – Complaining to Moses (manna)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Manna falling from heaven – God sends bread (bread)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People gathering manna each morning – God provides daily (heaven)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Israelites hungry in the desert – Complaining to Moses (desert)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Manna falling from heaven – God sends bread (exodus 16)"
    ]
  },
  "marthaServe": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Martha Serves Jesus.",
      "We read about this in the Bible.",
      "Don't be so busy you miss being with Jesus!",
      "Choose His presence first—then serve.",
      "We learn from Jesus and how God cares for Martha."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 18",
          "the Bible",
          "2 Kings 4",
          "Acts 1"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Paul",
          "God",
          "Stephen"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "Don't be so busy you miss being with Jesus! Choose His presence first—then serve."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Don't be so busy you miss being with Jesus! Choose His presence first—then serve..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Martha busily prepares food for Jesus",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Don't be so busy you miss being with Jesus! Choose His presence first—then serve.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Don't be so busy you miss being with Jesus! Choose His presence first—then serve..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Martha Serves Jesus with God's Word today.",
    "takeaway": "Don't be so busy you miss being with Jesus! Choose His presence first—then serve.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Martha Serves Jesus. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Martha busily prepares food for Jesus (martha)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She asks: don't you care I'm doing all this? (serve)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: one thing is needed—choose the best thing! (luke 10)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Martha busily prepares food for Jesus (busy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She asks: don't you care I'm doing all this? (kitchen)"
    ]
  },
  "maryAnoint": {
    "kjvRef": "John 12",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Mary Anoints Jesus' Feet.",
      "We read about this in John 12.",
      "Give Jesus your best—not just what's left!",
      "Extravagant love honors Him.",
      "We learn from Mary and how God cares for Jesus."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 37:28",
          "John 12",
          "1 Kings 18",
          "Genesis 28:12"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: John 12.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Paul",
          "Mary",
          "God"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Mary.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "Give Jesus your best—not just what's left! Extravagant love honors Him."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Give Jesus your best—not just what's left! Extravagant love honors Him..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Mary breaks open expensive perfume",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "Give Jesus your best—not just what's left! Extravagant love honors Him.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Give Jesus your best—not just what's left! Extravagant love honors Him..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Mary Anoints Jesus' Feet with God's Word today.",
    "takeaway": "Give Jesus your best—not just what's left! Extravagant love honors Him.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Mary Anoints Jesus' Feet. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary breaks open expensive perfume (mary)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She pours it on Jesus' feet and wipes with her hair (anoint)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: what she did will be remembered forever! (perfume)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary breaks open expensive perfume (john 12)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She pours it on Jesus' feet and wipes with her hair (feet)"
    ]
  },
  "maryMagdalene": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Mary Magdalene at the Tomb.",
      "We read about this in the Bible.",
      "Jesus knows your name and calls you!",
      "He is always the first to find His own.",
      "We learn from Jesus and how God cares for Mary Magdalene."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 1:3",
          "Daniel 3:25",
          "the Bible",
          "John 20"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Holy Spirit",
          "Jesus",
          "Paul",
          "David"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus knows your name and calls you! He is always the first to find His own.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus knows your name and calls you! He is always the first to find His own..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot.",
          "Mary comes early, weeping at the empty tomb"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Jesus knows your name and calls you! He is always the first to find His own.",
          "Ignore God until we are older."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus knows your name and calls you! He is always the first to find His own..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Mary Magdalene at the Tomb with God's Word today.",
    "takeaway": "Jesus knows your name and calls you! He is always the first to find His own.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Mary Magdalene at the Tomb. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary comes early, weeping at the empty tomb (mary magdalene)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She sees Jesus—mistakes Him for the gardener (tomb)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says her name: Mary! She knows Him! (john 20)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary comes early, weeping at the empty tomb (risen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She sees Jesus—mistakes Him for the gardener (gardener)"
    ]
  },
  "marySit": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Mary Sits at Jesus' Feet.",
      "We read about this in the Bible.",
      "Sit with Jesus!",
      "Listening to Him is the most important thing you can do each day.",
      "We learn from Jesus and how God cares for Mary."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "John 2",
          "Joshua 2",
          "the Bible",
          "Daniel 6:22"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Holy Spirit",
          "Paul",
          "David",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Sit with Jesus! Listening to Him is the most important thing you can do each day.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Sit with Jesus! Listening to Him is the most important thing you can do each day..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Mary sits and listens to Jesus",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Sit with Jesus! Listening to Him is the most important thing you can do each day.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Sit with Jesus! Listening to Him is the most important thing you can do each day..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Mary Sits at Jesus' Feet with God's Word today.",
    "takeaway": "Sit with Jesus! Listening to Him is the most important thing you can do each day.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Mary Sits at Jesus' Feet. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary sits and listens to Jesus (mary)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Martha is busy—Mary sits still (sit)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: Mary chose the better thing! (listen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary sits and listens to Jesus (luke 10)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Martha is busy—Mary sits still (feet)"
    ]
  },
  "miriamSong": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Miriam Sings to the Lord.",
      "We read about this in the Bible.",
      "When God saves you—sing about it!",
      "Let praise pour out.",
      "We learn from God and how God cares for Miriam."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "1 Samuel 16",
          "the Bible",
          "Genesis 37:3",
          "John 9"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Paul",
          "David",
          "Jesus"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "When God saves you—sing about it! Let praise pour out."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: When God saves you—sing about it! Let praise pour out..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Israel is safe on the other side of the sea",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "When God saves you—sing about it! Let praise pour out.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: When God saves you—sing about it! Let praise pour out..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Miriam Sings to the Lord with God's Word today.",
    "takeaway": "When God saves you—sing about it! Let praise pour out.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Miriam Sings to the Lord. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Israel is safe on the other side of the sea (miriam)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Miriam takes her tambourine and leads the women (song)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She sings: The Lord has triumphed gloriously! (tambourine)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Israel is safe on the other side of the sea (exodus 15)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Miriam takes her tambourine and leads the women (worship)"
    ]
  },
  "mosesBaby": {
    "kjvRef": "Exodus 2:1–10",
    "paragraphs": [
      "A baby boy was born to a Hebrew family. The king said all Hebrew boys must be thrown in the river.",
      "The mother hid the baby for three months. Then she made a basket of reeds, put him in it, and placed it in the river among the reeds.",
      "The baby's sister Miriam watched from a distance.",
      "Pharaoh's daughter came to bathe in the river. She saw the basket and opened it. She felt sorry for the baby and said, \"This is one of the Hebrew babies.\"",
      "Miriam asked if she could get a Hebrew nurse. Pharaoh's daughter said yes. The mother nursed him until he was older, then he became Pharaoh's daughter's son — named Moses."
    ],
    "imagePrompts": [
      "bright cartoon for kids: Hebrew mother hiding baby Moses, gentle and loving, no text",
      "fun kid illustration: mother making basket of reeds, baby inside, floating among river reeds, no text",
      "colorful Bible scene for children: Miriam watching the basket from the riverbank, hopeful, no text",
      "exciting cartoon: Pharaoh's daughter finding the basket in reeds, opening it, baby crying softly, no text",
      "happy ending illustration: baby with princess, mother as nurse nearby, warm safe mood, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "God protected baby Moses in a special way!",
    "quizHeading": "Moses in the Basket Questions",
    "questions": [
      {
        "question": "Why did the mother hide baby Moses?",
        "choices": [
          "He was noisy",
          "The king wanted to hurt Hebrew boys",
          "He was sick",
          "She didn't want him"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! The king ordered Hebrew boys cast into the river.",
        "wrongFeedback": "Not noise or sickness. Pharaoh's command was cruel toward Hebrew baby boys (Exodus 1:22)."
      },
      {
        "question": "What did the mother make for the baby?",
        "choices": [
          "A toy",
          "A basket of reeds",
          "A boat",
          "A blanket"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! An ark of bulrushes, daubed with slime and pitch.",
        "wrongFeedback": "She made an ark of bulrushes for him and laid it among the flags by the river (Exodus 2:3)."
      },
      {
        "question": "Who watched the basket?",
        "choices": [
          "The father",
          "Miriam (sister)",
          "The king",
          "A soldier"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Miriam watched to see what would happen.",
        "wrongFeedback": "His sister stood afar off to know what would be done to him (Exodus 2:4)."
      },
      {
        "question": "Who found the baby?",
        "choices": [
          "A fisherman",
          "Pharaoh's daughter",
          "A shepherd",
          "The mother"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! Pharaoh's daughter had compassion on him.",
        "wrongFeedback": "Pharaoh's daughter came down to wash and saw the ark among the flags (Exodus 2:5–6)."
      },
      {
        "question": "What can we learn from Moses in the basket?",
        "choices": [
          "God doesn't protect babies",
          "God protects His people even in danger",
          "Rivers are always safe",
          "Hide everything"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! God watched over baby Moses and used Pharaoh's daughter to save him.",
        "wrongFeedback": "The story shows God's care. Even when the king was cruel, God saved Moses for His purpose!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star — God protects His people!",
    "takeaway": "God protects us and has a plan, even when things look scary.",
    "prayer": "God, thank You for protecting me. Help me trust Your plan. Amen."
  },
  "mosesBush": {
    "kjvRef": "Exodus 3:1–4:17",
    "paragraphs": [
      "Moses was taking care of sheep in the desert. He saw a bush on fire — but it didn't burn up!",
      "God called to him from the bush: \"Moses! Moses!\" Moses said, \"Here I am.\"",
      "God said, \"I am the God of Abraham, Isaac, and Jacob. I have seen my people suffering in Egypt. Go to Pharaoh and bring them out.\"",
      "Moses was afraid. He said, \"Who am I? They won't listen to me.\" God said, \"I will be with you.\"",
      "God gave Moses signs: his staff turned into a serpent, then back. God said, \"I AM THAT I AM\" — go in My name."
    ],
    "imagePrompts": [
      "bright cartoon for kids: Moses tending sheep in desert, burning bush with green leaves, no text",
      "fun kid illustration: Moses taking off sandals, holy ground, gentle fire glow, no text",
      "colorful Bible scene for children: voice from bright bush, Moses listening, desert mountains, no text",
      "exciting cartoon: staff becoming serpent then staff again, simple shapes, surprised face, no text",
      "hopeful ending illustration: Moses with staff, path toward Egypt, light ahead, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "God spoke to Moses from a burning bush — what a miracle!",
    "quizHeading": "Burning Bush Questions",
    "questions": [
      {
        "question": "What was Moses doing when he saw the burning bush?",
        "choices": [
          "Farming",
          "Tending sheep",
          "Building",
          "Sleeping"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! He kept the flock of Jethro in the desert.",
        "wrongFeedback": "Not farming. Moses led the flock to the backside of the desert and came to Horeb (Exodus 3:1)."
      },
      {
        "question": "What was special about the bush?",
        "choices": [
          "It was gold",
          "It burned but didn't burn up",
          "It sang",
          "It grew fruit"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! The bush burned with fire, yet was not consumed.",
        "wrongFeedback": "The angel of the Lord appeared in a flame of fire out of the midst of a bush — it was not consumed (Exodus 3:2)."
      },
      {
        "question": "What did God tell Moses to do?",
        "choices": [
          "Stay in the desert",
          "Go to Pharaoh and bring Israel out of Egypt",
          "Build a temple",
          "Forget the people"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! God sent Moses to bring His people out.",
        "wrongFeedback": "God said, \"Come now therefore, and I will send thee unto Pharaoh, that thou mayest bring forth my people\" (Exodus 3:10)."
      },
      {
        "question": "What did Moses say when God called him?",
        "choices": [
          "Who are you?",
          "Here I am",
          "Go away",
          "I'm busy"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! \"Here am I\" — ready to listen.",
        "wrongFeedback": "He answered, \"Here am I\" when God called his name (Exodus 3:4)."
      },
      {
        "question": "What did God say His name is?",
        "choices": [
          "I AM THAT I AM",
          "King of kings",
          "Lord of light",
          "Maker of stars"
        ],
        "correctIndex": 0,
        "correctFeedback": "Perfect! \"I AM THAT I AM\" — God is eternal.",
        "wrongFeedback": "God said unto Moses, \"I AM THAT I AM\" — tell Israel \"I AM\" hath sent me (Exodus 3:14)."
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star — God calls us too!",
    "takeaway": "God sees our suffering and calls us to help others — He is with us.",
    "prayer": "God, thank You for seeing us and calling us. Help me say \"Here I am\" to You. Amen."
  },
  "mosesSea": {
    "kjvRef": "Exodus 14:21",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Moses Sea-Split – Exodus 14:21. The Israelites escaped Egypt, but Pharaoh chased them with his army. They were trapped—the Red Sea in front, soldiers behind.",
      "The people were afraid and cried to Moses. God said, 'Stretch out your hand over the sea.' Moses obeyed.",
      "A strong east wind blew all night, and the sea split in two! The Israelites walked on dry ground between walls of water.",
      "When the Egyptians followed, God closed the sea and saved His people. God makes a way!",
      "For you: When you feel trapped or don't know what to do, pray and trust God. He can make a path where there is none and lead you safely."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 37:28",
          "Ruth 2:2",
          "Exodus 14:21",
          "Matthew 21"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 14:21.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "The crowds",
          "God",
          "Holy Spirit"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "The Israelites were trapped between the Red Sea and the Egyptian army. God told Moses to stretch out his hand—the sea split open, and they…"
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: The Israelites were trapped between the Red Sea and the Egyptian army. God told Moses to….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Israelites trapped by the Red Sea – Pharaoh's army chasing",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "When you feel trapped or don't know what to do, pray and trust God. He can make a path where there is none and lead…",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: When you feel trapped or don't know what to do, pray and trust God. He can make a path….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Moses Parts the Sea with God's Word today.",
    "takeaway": "The Israelites were trapped between the Red Sea and the Egyptian army. God told Moses to stretch out his hand—the sea split open, and they walked through on dry ground. God makes a way even when…",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Moses Parts the Sea. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Israelites trapped by the Red Sea – Pharaoh's army chasing (moses)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses stretching his hand over the sea – God parts the waters (red sea)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People walking on dry ground between walls of water – God makes a way (staff)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Israelites trapped by the Red Sea – Pharaoh's army chasing (parting)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses stretching his hand over the sea – God parts the waters (exodus 14)"
    ]
  },
  "mosesStaffSnake": {
    "kjvRef": "Exodus 7",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Moses' Staff Becomes a Snake.",
      "We read about this in Exodus 7.",
      "God's power is real!",
      "He gives us what we need to do His work.",
      "We learn from God and how God cares for Moses."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 7",
          "Revelation 22",
          "Matthew 17",
          "Mark 4:39"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 7.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "David",
          "Paul",
          "Holy Spirit",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God's power is real! He gives us what we need to do His work.",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God's power is real! He gives us what we need to do His work..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Moses throws his staff down",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God's power is real! He gives us what we need to do His work.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God's power is real! He gives us what we need to do His work..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Moses' Staff Becomes a Snake with God's Word today.",
    "takeaway": "God's power is real! He gives us what we need to do His work.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Moses' Staff Becomes a Snake. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses throws his staff down (moses)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: It becomes a snake! (staff)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God shows His power through Moses (snake)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses throws his staff down (exodus 7)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: It becomes a snake! (pharaoh)"
    ]
  },
  "mustardSeed": {
    "kjvRef": "Matthew 13",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Mustard Seed.",
      "We read about this in Matthew 13.",
      "Faith as small as a seed can move mountains!",
      "Don't give up—keep trusting.",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 13",
          "Esther 7",
          "Exodus 3:2",
          "Luke 2"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 13.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "David",
          "Paul",
          "Holy Spirit",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Faith as small as a seed can move mountains! Don't give up—keep trusting.",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Faith as small as a seed can move mountains! Don't give up—keep trusting..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A tiny mustard seed in a hand",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Faith as small as a seed can move mountains! Don't give up—keep trusting.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Faith as small as a seed can move mountains! Don't give up—keep trusting..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Mustard Seed with God's Word today.",
    "takeaway": "Faith as small as a seed can move mountains! Don't give up—keep trusting.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Mustard Seed. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A tiny mustard seed in a hand (mustard seed)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: It's planted in the ground (faith)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: It grows into the biggest tree—birds nest in it! (tree)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A tiny mustard seed in a hand (matthew 13)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: It's planted in the ground (kingdom)"
    ]
  },
  "naaman": {
    "kjvRef": "2 Kings 5",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Naaman & the River.",
      "We read about this in 2 Kings 5.",
      "Obey God—get healed!",
      "Even when it seems simple, do what He says!",
      "We learn from God and how God cares for Naaman."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Acts 7",
          "Esther 7",
          "2 Kings 5",
          "Exodus 3:2"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 2 Kings 5.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "The crowds",
          "Mary",
          "Holy Spirit"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "Obey God—get healed! Even when it seems simple, do what He says!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Obey God—get healed! Even when it seems simple, do what He says!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Naaman has leprosy",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Obey God—get healed! Even when it seems simple, do what He says!",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Obey God—get healed! Even when it seems simple, do what He says!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Naaman & the River with God's Word today.",
    "takeaway": "Obey God—get healed! Even when it seems simple, do what He says!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Naaman & the River. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Naaman has leprosy (naaman)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elisha says: dip in Jordan (river)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Naaman obeys—healed! (leprosy)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Naaman has leprosy (dip)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elisha says: dip in Jordan (jordan)"
    ]
  },
  "naamanDip": {
    "kjvRef": "2 Kings 5:14",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Naaman Washed Clean – 2 Kings 5:14. Naaman was a great army captain, but he had leprosy.",
      "A little servant girl said, 'Go to the prophet in Israel—God can heal you.' Naaman went to Elisha. Elisha said, 'Go wash in the Jordan River seven times.' Naaman was angry—'The rivers in my country are better!' But his servants said, 'If he asked something hard, you would do it—why not this?' Naaman obeyed, dipped seven times, and his skin became clean like a child's!",
      "God healed him.",
      "For you: Sometimes God asks us to do simple things like pray, forgive, or be kind.",
      "Obey even if it seems small—God can do big miracles when we trust and follow Him."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 7–12",
          "Acts 8",
          "2 Kings 5:14",
          "Revelation 22"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 2 Kings 5:14.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Jesus",
          "Stephen",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Naaman had a bad skin disease. Elisha told him to wash in the Jordan River seven times. Naaman was proud but obeyed—and God healed him…",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Naaman had a bad skin disease. Elisha told him to wash in the Jordan River seven times.….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Naaman with leprosy – Proud captain needing help",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Sometimes God asks us to do simple things like pray, forgive, or be kind. Obey even if it seems small—God can do big…",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Sometimes God asks us to do simple things like pray, forgive, or be kind. Obey even if….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Naaman Dips in the River with God's Word today.",
    "takeaway": "Naaman had a bad skin disease. Elisha told him to wash in the Jordan River seven times. Naaman was proud but obeyed—and God healed him completely. When God asks you to do something simple, obey. He…",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Naaman Dips in the River. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Naaman with leprosy – Proud captain needing help (naaman)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Naaman dipping in the Jordan River – Obeying Elisha (river)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Naaman healed – Skin clean like new (jordan)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Naaman with leprosy – Proud captain needing help (2 kings 5)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Naaman dipping in the Jordan River – Obeying Elisha (leprosy)"
    ]
  },
  "nehemiahWalls": {
    "kjvRef": "Nehemiah 4",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Nehemiah Rebuilds the Walls.",
      "We read about this in Nehemiah 4.",
      "Pray, then work!",
      "God helps us rebuild what's broken.",
      "We learn from God and how God cares for Nehemiah and Israel."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Acts 2",
          "Numbers 13",
          "Matthew 26",
          "Nehemiah 4"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Nehemiah 4.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Jesus",
          "God",
          "David"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "Pray, then work! God helps us rebuild what's broken.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Pray, then work! God helps us rebuild what's broken..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Nehemiah prays and makes a plan",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Pray, then work! God helps us rebuild what's broken."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Pray, then work! God helps us rebuild what's broken..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Nehemiah Rebuilds the Walls with God's Word today.",
    "takeaway": "Pray, then work! God helps us rebuild what's broken.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Nehemiah Rebuilds the Walls. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Nehemiah prays and makes a plan (nehemiah)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Workers build with tools in one hand, sword in the other (walls)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The walls are rebuilt in 52 days—God did it! (jerusalem)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Nehemiah prays and makes a plan (nehemiah 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Workers build with tools in one hand, sword in the other (rebuild)"
    ]
  },
  "newEarth": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The New Earth.",
      "We read about this in the Bible.",
      "The best world is coming!",
      "God is making all things new—and He never makes anything bad.",
      "We learn from God and how God cares for All creation."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 17",
          "2 Kings 5:14",
          "Genesis 40",
          "the Bible"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "The crowds",
          "Mary",
          "Stephen"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "The best world is coming! God is making all things new—and He never makes anything bad.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: The best world is coming! God is making all things new—and He never makes anything bad..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "God says: Behold, I make all things new!",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "The best world is coming! God is making all things new—and He never makes anything bad."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: The best world is coming! God is making all things new—and He never makes anything bad..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The New Earth with God's Word today.",
    "takeaway": "The best world is coming! God is making all things new—and He never makes anything bad.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The New Earth. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God says: Behold, I make all things new! (new earth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: No more pain, no more crying, no more death (revelation 21)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The new earth—perfected and full of God's love! (all things new)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God says: Behold, I make all things new! (no pain)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: No more pain, no more crying, no more death (perfect)"
    ]
  },
  "newHeaven": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "New Heaven and New Earth.",
      "We read about this in the Bible.",
      "The best is coming!",
      "A new world with no pain, no sadness—only God and joy.",
      "We learn from God and how God cares for All His people."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "1 Corinthians 13",
          "Acts 28",
          "1 Samuel 18"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "David",
          "Jesus",
          "Paul",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The best is coming! A new world with no pain, no sadness—only God and joy.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: The best is coming! A new world with no pain, no sadness—only God and joy..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "God makes all things new!",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "The best is coming! A new world with no pain, no sadness—only God and joy.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: The best is coming! A new world with no pain, no sadness—only God and joy..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading New Heaven and New Earth with God's Word today.",
    "takeaway": "The best is coming! A new world with no pain, no sadness—only God and joy.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in New Heaven and New Earth. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God makes all things new! (new heaven)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: No more tears, no more pain, no more death (earth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God's home is with His people forever! (revelation 21)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God makes all things new! (no tears)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: No more tears, no more pain, no more death (new)"
    ]
  },
  "noah": {
    "kjvRef": "Genesis 6–9",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Long ago, many people stopped obeying God. Their hearts were full of wrong choices. God was sad, but one man walked with God—Noah. God told Noah to build a huge boat called an ark. It had to be strong enough for a great storm.",
      "Noah obeyed, even when it took a long time and other people may have laughed. God said animals would come—two of every kind, male and female—and Noah's family would be safe inside. When everything was ready, God told them to enter. Then God shut the door.",
      "Rain fell. Water rose. The whole earth that people could see was covered with water. But inside the ark, Noah, his family, and the animals floated safely. God remembered Noah. The water went down little by little.",
      "Noah sent out a dove. The first time it found nowhere to rest. Later it brought back an olive leaf—plants were growing again! When the ground was dry, God told them to come out. Noah worshiped God with a thankful heart.",
      "God put a rainbow in the sky as a sign: He would never flood the whole world that way again. The rainbow reminds us that God keeps His promises. \"I do set my bow in the cloud, and it shall be for a token of a covenant between me and the earth\" (Genesis 9:13, KJV)."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Who obeyed God and built the ark?",
        "choices": [
          "Moses",
          "Noah",
          "Jonah",
          "David"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Noah walked with God and did what God said, even when it was hard.",
        "wrongFeedback": "Think: who spent years building a big boat before the flood? Reread the first two paragraphs. (Answer: Noah.)"
      },
      {
        "question": "How did the animals come to the ark?",
        "choices": [
          "Noah had to catch every animal alone",
          "Two by two, as God sent them",
          "They flew in on balloons",
          "They stayed outside in the rain"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! God sent the animals. Noah trusted God to bring them.",
        "wrongFeedback": "Look for how the pairs came—did Noah trap them all by himself? Check the paragraph about obeying and entering the ark. (Answer: Two by two, as God sent them.)"
      },
      {
        "question": "What did Noah send out to see if the earth was drying?",
        "choices": [
          "A kite",
          "A dove",
          "A paper airplane",
          "A fish"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! The dove brought back an olive leaf—new life was growing.",
        "wrongFeedback": "Which bird helped Noah know plants were coming back? Skim the paragraph after the flood. (Answer: A dove.)"
      },
      {
        "question": "What sign did God put in the sky after the flood?",
        "choices": [
          "A shooting star",
          "A rainbow",
          "A big kite",
          "Lightning only"
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful! The rainbow is God's promise token—He keeps His word.",
        "wrongFeedback": "What colorful arc appears after rain today—and what did God \"set in the cloud\"? Read the last paragraph. (Answer: A rainbow.)"
      },
      {
        "question": "What is one big lesson from Noah's story?",
        "choices": [
          "We never need to obey parents",
          "God keeps His promises—and we can obey Him even when others do not",
          "Boats are scary",
          "Rainbows are only decoration"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! Obedience and God's faithfulness go together.",
        "wrongFeedback": "Ask: what does the rainbow teach about God? What did Noah do when God spoke? Reread the ending. (Answer: God keeps His promises—and we can obey Him even when others do not.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job walking through Noah's story with God.",
    "takeaway": "When God asks you to obey, you can say yes—even if it takes time. God remembers you.",
    "prayer": "God, help me obey You like Noah, and help me remember Your promises. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon: bearded man with hammer and wood planks building a huge wooden ark, sunny day, animals peeking in background, kid-safe, no text.",
      "Hand-drawn bouncy cartoon: pairs of friendly animals (elephants, lions, birds) walking up a ramp into a big boat, colorful, no text.",
      "Hand-drawn bouncy cartoon: ark floating on blue water with rain clouds above, small window light warm inside, not scary, no text.",
      "Hand-drawn bouncy cartoon: dove carrying a green olive branch flying toward a man on dry ground, smile, hope, no text.",
      "Hand-drawn bouncy cartoon: bright rainbow over green hills, happy family and animals nearby, peaceful, no text."
    ]
  },
  "noNight": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "No Night in God's City.",
      "We read about this in the Bible.",
      "You never need to be afraid of the dark—God's light is coming!",
      "And it lasts forever.",
      "We learn from God and how God cares for All His people."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "Ephesians 6",
          "1 Samuel 3",
          "1 Kings 18"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Jesus",
          "Stephen",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "You never need to be afraid of the dark—God's light is coming! And it lasts forever.",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: You never need to be afraid of the dark—God's light is coming! And it lasts forever..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "The new city glows—no sun or moon needed",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "You never need to be afraid of the dark—God's light is coming! And it lasts forever.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: You never need to be afraid of the dark—God's light is coming! And it lasts forever..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading No Night in God's City with God's Word today.",
    "takeaway": "You never need to be afraid of the dark—God's light is coming! And it lasts forever.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in No Night in God's City. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The new city glows—no sun or moon needed (night)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God's glory is the light (light)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: No night there—God's light never goes out! (revelation 22)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The new city glows—no sun or moon needed (glory)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God's glory is the light (god)"
    ]
  },
  "palmSunday": {
    "kjvRef": "Matthew 21",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Palm Sunday. We read about this in Matthew 21.",
      "Hosanna!",
      "Jesus rides the donkey—welcome Him!",
      "He is the King of Kings!",
      "We learn from The crowds and how God cares for Jesus."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Daniel 6:22",
          "Matthew 3",
          "Exodus 32",
          "Matthew 21"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 21.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Paul",
          "David",
          "Holy Spirit"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: The crowds.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "Hosanna! Jesus rides the donkey—welcome Him! He is the King of Kings!",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Hosanna! Jesus rides the donkey—welcome Him! He is the King of Kings!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Jesus rides a donkey",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Hosanna! Jesus rides the donkey—welcome Him! He is the King of Kings!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Hosanna! Jesus rides the donkey—welcome Him! He is the King of Kings!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Palm Sunday with God's Word today.",
    "takeaway": "Hosanna! Jesus rides the donkey—welcome Him! He is the King of Kings!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Palm Sunday. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus rides a donkey (palm sunday)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People wave palm branches (hosanna)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Hosanna! Welcome the King! (donkey)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus rides a donkey (jerusalem)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People wave palm branches (matthew 21)"
    ]
  },
  "parableSower": {
    "kjvRef": "Matthew 13",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Parable of the Sower.",
      "We read about this in Matthew 13.",
      "Plant good words—grow strong!",
      "Let God's word take root in your heart!",
      "We learn from Jesus and how God cares for The crowds."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 13",
          "John 18",
          "Psalm 23",
          "2 Kings 5"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 13.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Jesus",
          "Stephen",
          "God"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Plant good words—grow strong! Let God's word take root in your heart!",
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Plant good words—grow strong! Let God's word take root in your heart!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Farmer scatters seeds"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Plant good words—grow strong! Let God's word take root in your heart!",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Plant good words—grow strong! Let God's word take root in your heart!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Parable of the Sower with God's Word today.",
    "takeaway": "Plant good words—grow strong! Let God's word take root in your heart!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Parable of the Sower. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Farmer scatters seeds (sower)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Seeds on path, rocks, thorns (parable)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Good soil—seeds grow strong! (seeds)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Farmer scatters seeds (soil)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Seeds on path, rocks, thorns (grow)"
    ]
  },
  "parableTalents": {
    "kjvRef": "Matthew 25",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Parable of Talents.",
      "We read about this in Matthew 25.",
      "Use what God gave you—grow it!",
      "Don't hide your gifts—use them!",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 40",
          "Matthew 25",
          "1 Samuel 22",
          "Luke 17"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 25.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Holy Spirit",
          "Mary",
          "David"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Use what God gave you—grow it! Don't hide your gifts—use them!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Use what God gave you—grow it! Don't hide your gifts—use them!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Master gives money to servants",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "Use what God gave you—grow it! Don't hide your gifts—use them!",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Use what God gave you—grow it! Don't hide your gifts—use them!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Parable of Talents with God's Word today.",
    "takeaway": "Use what God gave you—grow it! Don't hide your gifts—use them!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Parable of Talents. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Master gives money to servants (talents)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Two servants use it—grow it! (parable)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Use what God gave you—grow it! (money)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Master gives money to servants (servants)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Two servants use it—grow it! (matthew 25)"
    ]
  },
  "passoverLamb": {
    "kjvRef": "Exodus 12",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Passover Lamb.",
      "We read about this in Exodus 12.",
      "Jesus is our Passover Lamb!",
      "He saves us—just believe and be covered.",
      "We learn from God and how God cares for Israel in Egypt."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 12",
          "Galatians 5",
          "John 19",
          "Job 2"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 12.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Jesus",
          "Stephen",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Jesus is our Passover Lamb! He saves us—just believe and be covered.",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus is our Passover Lamb! He saves us—just believe and be covered..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A lamb is chosen—spotless and perfect",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Jesus is our Passover Lamb! He saves us—just believe and be covered.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus is our Passover Lamb! He saves us—just believe and be covered..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Passover Lamb with God's Word today.",
    "takeaway": "Jesus is our Passover Lamb! He saves us—just believe and be covered.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Passover Lamb. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A lamb is chosen—spotless and perfect (passover)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Blood painted on the doorposts (lamb)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The angel passes over—God saves His people (blood)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A lamb is chosen—spotless and perfect (doorposts)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Blood painted on the doorposts (exodus 12)"
    ]
  },
  "paulDamascus": {
    "kjvRef": "Acts 9",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Paul & Damascus.",
      "We read about this in Acts 9.",
      "Jesus changes Paul—He changes us!",
      "No one is too far for God!",
      "We learn from Jesus and how God cares for Saul."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 41",
          "Exodus 2:5",
          "Acts 9",
          "Exodus 20:1-17"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 9.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Mary",
          "Holy Spirit",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus changes Paul—He changes us! No one is too far for God!",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus changes Paul—He changes us! No one is too far for God!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Saul on the road",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Jesus changes Paul—He changes us! No one is too far for God!",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus changes Paul—He changes us! No one is too far for God!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Paul & Damascus with God's Word today.",
    "takeaway": "Jesus changes Paul—He changes us! No one is too far for God!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Paul & Damascus. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Saul on the road (paul)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Bright light—Jesus speaks! (damascus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Saul becomes Paul—Jesus changes us! (saul)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Saul on the road (light)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Bright light—Jesus speaks! (change)"
    ]
  },
  "paulShip": {
    "kjvRef": "Acts 27",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Paul's Ship in the Storm.",
      "We read about this in Acts 27.",
      "God keeps His promises in storms!",
      "When you're afraid, His word says: fear not.",
      "We learn from God and how God cares for Paul and the sailors."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Mark 10",
          "Acts 27",
          "Acts 28",
          "Luke 15"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 27.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Jesus",
          "Paul",
          "Stephen"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God keeps His promises in storms! When you're afraid, His word says: fear not."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God keeps His promises in storms! When you're afraid, His word says: fear not..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Paul sails toward Rome in a big storm",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "God keeps His promises in storms! When you're afraid, His word says: fear not.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God keeps His promises in storms! When you're afraid, His word says: fear not..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Paul's Ship in the Storm with God's Word today.",
    "takeaway": "God keeps His promises in storms! When you're afraid, His word says: fear not.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Paul's Ship in the Storm. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul sails toward Rome in a big storm (paul)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: An angel says: fear not—all 276 will be safe (ship)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They swim to shore—everyone safe, just like God said! (storm)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul sails toward Rome in a big storm (acts 27)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: An angel says: fear not—all 276 will be safe (angel)"
    ]
  },
  "paulShipwreck": {
    "kjvRef": "Acts 28",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Paul's Shipwreck.",
      "We read about this in Acts 28.",
      "God protects His people through storms!",
      "When life gets hard, He keeps you safe.",
      "We learn from God and how God cares for Paul."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "John 20",
          "Genesis 1",
          "Matthew 6",
          "Acts 28"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 28.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Jesus",
          "God",
          "David"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "God protects His people through storms! When life gets hard, He keeps you safe.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God protects His people through storms! When life gets hard, He keeps you safe..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Paul sails in a terrible storm",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older.",
          "God protects His people through storms! When life gets hard, He keeps you safe."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God protects His people through storms! When life gets hard, He keeps you safe..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Paul's Shipwreck with God's Word today.",
    "takeaway": "God protects His people through storms! When life gets hard, He keeps you safe.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Paul's Shipwreck. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul sails in a terrible storm (paul)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The ship breaks apart—Paul swims to shore (shipwreck)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A snake bites Paul—he is fine! God protects him (storm)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul sails in a terrible storm (acts 28)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The ship breaks apart—Paul swims to shore (snake)"
    ]
  },
  "paulSilas": {
    "kjvRef": "Acts 16",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Paul and Silas Sing in Jail.",
      "We read about this in Acts 16.",
      "Praise God even in hard places!",
      "Your worship opens doors—literally.",
      "We learn from God and how God cares for Paul and Silas."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Galatians 5",
          "Acts 16",
          "Exodus 3",
          "Job 2"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 16.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "The crowds",
          "Stephen",
          "Mary"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Praise God even in hard places! Your worship opens doors—literally."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Praise God even in hard places! Your worship opens doors—literally..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Paul and Silas are beaten and jailed",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Praise God even in hard places! Your worship opens doors—literally.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Praise God even in hard places! Your worship opens doors—literally..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Paul and Silas Sing in Jail with God's Word today.",
    "takeaway": "Praise God even in hard places! Your worship opens doors—literally.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Paul and Silas Sing in Jail. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul and Silas are beaten and jailed (paul)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: At midnight—they sing and pray! (silas)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: An earthquake—the prison opens! They stay and the jailer believes (jail)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul and Silas are beaten and jailed (acts 16)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: At midnight—they sing and pray! (sing)"
    ]
  },
  "pentecost": {
    "kjvRef": "Acts 2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Pentecost.",
      "We read about this in Acts 2.",
      "Holy Spirit comes—power for us!",
      "God fills you with His Spirit!",
      "We learn from God and how God cares for The disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Acts 2",
          "Exodus 14",
          "2 Kings 5:14",
          "Mark 12"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Mary",
          "Stephen",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Holy Spirit comes—power for us! God fills you with His Spirit!",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Holy Spirit comes—power for us! God fills you with His Spirit!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Disciples waiting in Jerusalem",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Holy Spirit comes—power for us! God fills you with His Spirit!",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Holy Spirit comes—power for us! God fills you with His Spirit!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Pentecost with God's Word today.",
    "takeaway": "Holy Spirit comes—power for us! God fills you with His Spirit!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Pentecost. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Disciples waiting in Jerusalem (pentecost)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Holy Spirit comes—wind and fire! (holy spirit)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They speak in tongues—power for us! (tongues)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Disciples waiting in Jerusalem (acts 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Holy Spirit comes—wind and fire! (fire)"
    ]
  },
  "pentecostFire": {
    "kjvRef": "Acts 2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Pentecost—Fire and Wind.",
      "We read about this in Acts 2.",
      "God's Spirit lives in you!",
      "He gives you power, love, and boldness.",
      "We learn from Holy Spirit and how God cares for The disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Acts 2",
          "Revelation 22",
          "Exodus 7–12",
          "Acts 8"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Holy Spirit",
          "Stephen",
          "God"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Holy Spirit.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God's Spirit lives in you! He gives you power, love, and boldness.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God's Spirit lives in you! He gives you power, love, and boldness..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Disciples wait together in a room"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God's Spirit lives in you! He gives you power, love, and boldness.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God's Spirit lives in you! He gives you power, love, and boldness..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Pentecost—Fire and Wind with God's Word today.",
    "takeaway": "God's Spirit lives in you! He gives you power, love, and boldness.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Pentecost—Fire and Wind. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Disciples wait together in a room (pentecost)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Wind fills the house—fire on each head! (fire)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They speak in new languages—the Holy Spirit is here! (wind)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Disciples wait together in a room (acts 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Wind fills the house—fire on each head! (holy spirit)"
    ]
  },
  "pentecostTongues": {
    "kjvRef": "Acts 2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Tongues of Fire at Pentecost.",
      "We read about this in Acts 2.",
      "God's Spirit lives in you!",
      "You have power to tell the world about Jesus.",
      "We learn from Holy Spirit and how God cares for The disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 23",
          "Matthew 14",
          "Acts 2",
          "Matthew 18"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Paul",
          "Holy Spirit",
          "God"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Holy Spirit.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God's Spirit lives in you! You have power to tell the world about Jesus."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God's Spirit lives in you! You have power to tell the world about Jesus..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Disciples wait in prayer together",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "God's Spirit lives in you! You have power to tell the world about Jesus.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God's Spirit lives in you! You have power to tell the world about Jesus..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Tongues of Fire at Pentecost with God's Word today.",
    "takeaway": "God's Spirit lives in you! You have power to tell the world about Jesus.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Tongues of Fire at Pentecost. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Disciples wait in prayer together (pentecost)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Fire rests on each one—they speak in new languages (tongues)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Three thousand believe that day—the church begins! (acts 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Disciples wait in prayer together (fire)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Fire rests on each one—they speak in new languages (languages)"
    ]
  },
  "persistentWidow": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Persistent Widow.",
      "We read about this in the Bible.",
      "Don't give up in prayer!",
      "God always answers those who keep coming to Him.",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Esther 4",
          "Matthew 26",
          "the Bible",
          "John 10"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "David",
          "Holy Spirit",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Don't give up in prayer! God always answers those who keep coming to Him.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Don't give up in prayer! God always answers those who keep coming to Him..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "A widow goes to the judge day after day",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Don't give up in prayer! God always answers those who keep coming to Him.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Don't give up in prayer! God always answers those who keep coming to Him..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Persistent Widow with God's Word today.",
    "takeaway": "Don't give up in prayer! God always answers those who keep coming to Him.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Persistent Widow. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A widow goes to the judge day after day (widow)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The judge refuses—but she keeps coming back (persistent)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He finally helps her—keep praying, God hears! (judge)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A widow goes to the judge day after day (luke 18)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The judge refuses—but she keeps coming back (keep asking)"
    ]
  },
  "peterShadow": {
    "kjvRef": "Acts 5",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Peter's Shadow Heals.",
      "We read about this in Acts 5.",
      "God works through ordinary people!",
      "You carry His presence—make it count.",
      "We learn from God and how God cares for Peter."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 3",
          "Acts 5",
          "Daniel 6:22",
          "Exodus 32"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 5.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "The crowds",
          "God",
          "Holy Spirit"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God works through ordinary people! You carry His presence—make it count."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God works through ordinary people! You carry His presence—make it count..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Sick people line the streets",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "God works through ordinary people! You carry His presence—make it count.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God works through ordinary people! You carry His presence—make it count..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Peter's Shadow Heals with God's Word today.",
    "takeaway": "God works through ordinary people! You carry His presence—make it count.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Peter's Shadow Heals. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Sick people line the streets (peter)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Peter walks by—his shadow touches them (shadow)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They are healed! God's power is in His people (heal)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Sick people line the streets (acts 5)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Peter walks by—his shadow touches them (miracle)"
    ]
  },
  "pharaohDreams": {
    "kjvRef": "Genesis 41",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Pharaoh's Dreams.",
      "We read about this in Genesis 41.",
      "God promotes the faithful!",
      "Stay humble and trust His timing.",
      "We learn from God and how God cares for Joseph."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 41",
          "Matthew 26",
          "Esther 4",
          "Numbers 13"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Genesis 41.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Holy Spirit",
          "Paul",
          "God",
          "David"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God promotes the faithful! Stay humble and trust His timing.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God promotes the faithful! Stay humble and trust His timing..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "Pharaoh dreams of fat and thin cows"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God promotes the faithful! Stay humble and trust His timing.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God promotes the faithful! Stay humble and trust His timing..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Pharaoh's Dreams with God's Word today.",
    "takeaway": "God promotes the faithful! Stay humble and trust His timing.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Pharaoh's Dreams. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Pharaoh dreams of fat and thin cows (pharaoh)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joseph explains: 7 good years, 7 hard years (dreams)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joseph is put in charge—God's plan works! (cows)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Pharaoh dreams of fat and thin cows (joseph)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Joseph explains: 7 good years, 7 hard years (genesis 41)"
    ]
  },
  "philipChariot": {
    "kjvRef": "Acts 8",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Philip and the Ethiopian.",
      "We read about this in Acts 8.",
      "Be ready to share Jesus wherever you go!",
      "God sets up divine appointments.",
      "We learn from God and how God cares for Philip."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 21",
          "Genesis 22",
          "Judges 16:30",
          "Acts 8"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 8.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "The crowds",
          "Mary",
          "Stephen"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "Be ready to share Jesus wherever you go! God sets up divine appointments.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Be ready to share Jesus wherever you go! God sets up divine appointments..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Philip is sent to a desert road",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Be ready to share Jesus wherever you go! God sets up divine appointments."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Be ready to share Jesus wherever you go! God sets up divine appointments..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Philip and the Ethiopian with God's Word today.",
    "takeaway": "Be ready to share Jesus wherever you go! God sets up divine appointments.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Philip and the Ethiopian. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Philip is sent to a desert road (philip)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: An Ethiopian reads Isaiah in his chariot (ethiopian)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Philip explains—the Ethiopian believes and is baptized! (chariot)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Philip is sent to a desert road (acts 8)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: An Ethiopian reads Isaiah in his chariot (isaiah)"
    ]
  },
  "phoebeDeacon": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Phoebe the Deacon.",
      "We read about this in the Bible.",
      "Faithful service matters!",
      "Like Phoebe—do your part well and God calls it great.",
      "We learn from God and how God cares for Phoebe."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "Acts 1",
          "2 Kings 4",
          "Mark 5"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Stephen",
          "The crowds",
          "Jesus",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Faithful service matters! Like Phoebe—do your part well and God calls it great.",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Faithful service matters! Like Phoebe—do your part well and God calls it great..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Paul writes: Phoebe is a deacon of the church",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Faithful service matters! Like Phoebe—do your part well and God calls it great.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Faithful service matters! Like Phoebe—do your part well and God calls it great..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Phoebe the Deacon with God's Word today.",
    "takeaway": "Faithful service matters! Like Phoebe—do your part well and God calls it great.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Phoebe the Deacon. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul writes: Phoebe is a deacon of the church (phoebe)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She carries Paul's letter to Rome (deacon)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She serves faithfully—a helper of many! (romans 16)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul writes: Phoebe is a deacon of the church (letter)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She carries Paul's letter to Rome (rome)"
    ]
  },
  "prayerCloset": {
    "kjvRef": "Matthew 6",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Pray in Your Closet.",
      "We read about this in Matthew 6.",
      "Private prayer matters most!",
      "Find a quiet place and just talk to God—He's listening.",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 6",
          "Matthew 14",
          "Matthew 18",
          "Exodus 2:5"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 6.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "Holy Spirit",
          "David",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Private prayer matters most! Find a quiet place and just talk to God—He's listening.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Private prayer matters most! Find a quiet place and just talk to God—He's listening..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Jesus says: go into your room and shut the door",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Private prayer matters most! Find a quiet place and just talk to God—He's listening.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Private prayer matters most! Find a quiet place and just talk to God—He's listening..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Pray in Your Closet with God's Word today.",
    "takeaway": "Private prayer matters most! Find a quiet place and just talk to God—He's listening.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Pray in Your Closet. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: go into your room and shut the door (prayer)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Pray to your Father in secret (closet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Your Father who sees in secret will reward you! (matthew 6)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: go into your room and shut the door (secret)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Pray to your Father in secret (room)"
    ]
  },
  "prayerKnock": {
    "kjvRef": "Matthew 7",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Ask, Seek, Knock.",
      "We read about this in Matthew 7.",
      "Keep knocking!",
      "God loves when you keep coming to Him in prayer.",
      "We learn from Jesus and how God cares for His followers."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 14",
          "Exodus 2:5",
          "Matthew 7",
          "Matthew 18"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 7.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Holy Spirit",
          "Jesus",
          "Mary"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Keep knocking! God loves when you keep coming to Him in prayer.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Keep knocking! God loves when you keep coming to Him in prayer..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot.",
          "A person stands at a door and knocks"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Keep knocking! God loves when you keep coming to Him in prayer.",
          "Ignore God until we are older."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Keep knocking! God loves when you keep coming to Him in prayer..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Ask, Seek, Knock with God's Word today.",
    "takeaway": "Keep knocking! God loves when you keep coming to Him in prayer.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Ask, Seek, Knock. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A person stands at a door and knocks (ask)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: Ask and it will be given! (seek)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The door opens—God answers! (knock)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A person stands at a door and knocks (matthew 7)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: Ask and it will be given! (prayer)"
    ]
  },
  "priscillaTeach": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Priscilla and Aquila Teach.",
      "We read about this in the Bible.",
      "Help each other understand God better!",
      "Teaching is one of God's gifts.",
      "We learn from God and how God cares for Priscilla."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 37:3",
          "2 Kings 5",
          "Psalm 23",
          "the Bible"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Paul",
          "David",
          "Holy Spirit"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "Help each other understand God better! Teaching is one of God's gifts.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Help each other understand God better! Teaching is one of God's gifts..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Priscilla and Aquila hear Apollos preach",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Help each other understand God better! Teaching is one of God's gifts."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Help each other understand God better! Teaching is one of God's gifts..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Priscilla and Aquila Teach with God's Word today.",
    "takeaway": "Help each other understand God better! Teaching is one of God's gifts.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Priscilla and Aquila Teach. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Priscilla and Aquila hear Apollos preach (priscilla)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They invite him and teach him more fully (aquila)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Apollos grows—we all need good teachers! (apollos)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Priscilla and Aquila hear Apollos preach (acts 18)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They invite him and teach him more fully (teach)"
    ]
  },
  "priscillaTent": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Priscilla and Aquila: Tentmakers.",
      "We read about this in the Bible.",
      "Your home can be a place where God works!",
      "Serve Him together with your family.",
      "We learn from God and how God cares for Priscilla and Aquila."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 6–9",
          "Luke 19",
          "Ruth 1",
          "the Bible"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Holy Spirit",
          "David",
          "Mary"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "Your home can be a place where God works! Serve Him together with your family.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Your home can be a place where God works! Serve Him together with your family..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Priscilla and Aquila make tents for a living",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Your home can be a place where God works! Serve Him together with your family."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Your home can be a place where God works! Serve Him together with your family..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Priscilla and Aquila: Tentmakers with God's Word today.",
    "takeaway": "Your home can be a place where God works! Serve Him together with your family.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Priscilla and Aquila: Tentmakers. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Priscilla and Aquila make tents for a living (priscilla)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul works with them—they grow together (tent)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Their home becomes a church—faithful servants! (aquila)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Priscilla and Aquila make tents for a living (acts 18)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Paul works with them—they grow together (paul)"
    ]
  },
  "prodigalSon": {
    "kjvRef": "Luke 15",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Prodigal Son.",
      "We read about this in Luke 15.",
      "God welcomes you home!",
      "No matter what you did, come back—He runs to meet you!",
      "We learn from Jesus and how God cares for People who wondered if God forgives."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 37:28",
          "Matthew 21",
          "Ruth 2:2",
          "Luke 15"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 15.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Mary",
          "The crowds",
          "Stephen"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "God welcomes you home! No matter what you did, come back—He runs to meet you!",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God welcomes you home! No matter what you did, come back—He runs to meet you!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Son runs away with his money",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "God welcomes you home! No matter what you did, come back—He runs to meet you!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God welcomes you home! No matter what you did, come back—He runs to meet you!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Prodigal Son with God's Word today.",
    "takeaway": "God welcomes you home! No matter what you did, come back—He runs to meet you!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Prodigal Son. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Son runs away with his money (prodigal)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Son comes back sorry (son)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Father runs to welcome him home! (run away)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Son runs away with his money (come back)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Son comes back sorry (party)"
    ]
  },
  "psalm23Shepherd": {
    "kjvRef": "Psalm 23",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Lord Is My Shepherd.",
      "We read about this in Psalm 23.",
      "God is your Good Shepherd!",
      "He leads you, protects you, and gives you rest.",
      "We learn from God and how God cares for David."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 10",
          "Daniel 6",
          "Psalm 23",
          "Jonah 1:17"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Psalm 23.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "David",
          "Holy Spirit",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God is your Good Shepherd! He leads you, protects you, and gives you rest.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God is your Good Shepherd! He leads you, protects you, and gives you rest..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "A shepherd leads sheep to green pastures",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "God is your Good Shepherd! He leads you, protects you, and gives you rest.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God is your Good Shepherd! He leads you, protects you, and gives you rest..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Lord Is My Shepherd with God's Word today.",
    "takeaway": "God is your Good Shepherd! He leads you, protects you, and gives you rest.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Lord Is My Shepherd. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A shepherd leads sheep to green pastures (psalm 23)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Still waters—rest and peace (shepherd)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God leads us—we shall not want! (sheep)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A shepherd leads sheep to green pastures (staff)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Still waters—rest and peace (peace)"
    ]
  },
  "rahabJericho": {
    "kjvRef": "Joshua 2; 6:22–25",
    "paragraphs": [
      "Joshua sent two spies into Jericho. A woman named Rahab hid them on her roof.",
      "The king's men came looking for the spies. Rahab said they had gone another way — and helped the men escape by a rope from her window.",
      "Rahab said, \"I know that the LORD hath given you the land.\" She asked them to save her family when God gave the city.",
      "The spies told her to bind a scarlet cord in her window. When the walls fell, Joshua sent them to bring out Rahab and all hers.",
      "Rahab believed in God and was saved. She became part of God's people."
    ],
    "imagePrompts": [
      "bright cartoon for kids: two spies on a flat roof, Rahab quietly helping, clay houses, no text",
      "fun kid illustration: Rahab at door speaking calmly to soldiers, spies hidden, no text",
      "colorful Bible scene for children: rope from window at night, spies lowering safely, no text",
      "exciting cartoon: scarlet cord hanging from window, city wall behind, no text",
      "happy ending illustration: Rahab with family safe, walls fallen in distance, gentle light, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "Rahab believed in God and helped His people!",
    "quizHeading": "Rahab Questions",
    "questions": [
      {
        "question": "Who hid the spies in Jericho?",
        "choices": [
          "The king",
          "Rahab",
          "Joshua",
          "The priests"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Rahab hid them on her roof.",
        "wrongFeedback": "Not the king or Joshua. Rahab took the men and hid them on the roof of her house (Joshua 2:4–6)."
      },
      {
        "question": "What did Rahab do when the king's men came?",
        "choices": [
          "Gave up the spies",
          "Sent the searchers another way and hid the spies",
          "Helped capture them",
          "Ran away"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! She protected them and pointed the soldiers elsewhere.",
        "wrongFeedback": "She did not give them up. She hid the spies and said they had gone out when it was dark (Joshua 2:4–5)."
      },
      {
        "question": "What did Rahab ask the spies?",
        "choices": [
          "Harm my family",
          "Save my family when you take the city",
          "Give me gold only",
          "Leave me alone"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! She believed in God and asked for kindness.",
        "wrongFeedback": "She said she knew the Lord had given them the land and asked to save her father's household alive (Joshua 2:12–13)."
      },
      {
        "question": "What was the sign for Rahab's house?",
        "choices": [
          "A flag",
          "A scarlet cord in the window",
          "A lamp",
          "A door mark"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! A scarlet line in the window.",
        "wrongFeedback": "She bound the line of scarlet thread in the window as the token (Joshua 2:18)."
      },
      {
        "question": "What can we learn from Rahab?",
        "choices": [
          "Hide from God's people",
          "Believe in God and help others",
          "Fear only kings",
          "Keep every secret"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! Rahab believed and acted bravely — God saved her.",
        "wrongFeedback": "She trusted the Lord God of heaven and earth — faith changes everything!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star — faith saves!",
    "takeaway": "Faith in God saves us — even when we were far from Him.",
    "prayer": "God, thank You for saving anyone who believes in You. Help my faith grow. Amen."
  },
  "rahabRope": {
    "kjvRef": "Joshua 2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Rahab's Scarlet Cord.",
      "We read about this in Joshua 2.",
      "Faith saves!",
      "Even when you're afraid, trust God and He rescues you.",
      "We learn from God and how God cares for Rahab."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Esther 7",
          "Joshua 2",
          "Acts 7",
          "Exodus 3:2"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Joshua 2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Paul",
          "God",
          "Stephen"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "Faith saves! Even when you're afraid, trust God and He rescues you."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Faith saves! Even when you're afraid, trust God and He rescues you..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Rahab hides the spies",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "Faith saves! Even when you're afraid, trust God and He rescues you.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Faith saves! Even when you're afraid, trust God and He rescues you..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Rahab's Scarlet Cord with God's Word today.",
    "takeaway": "Faith saves! Even when you're afraid, trust God and He rescues you.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Rahab's Scarlet Cord. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rahab hides the spies (rahab)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She hangs a scarlet cord in the window (cord)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rahab and her family are saved! (spies)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rahab hides the spies (joshua 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She hangs a scarlet cord in the window (window)"
    ]
  },
  "rahabWindow": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Rahab Hangs the Cord.",
      "We read about this in the Bible.",
      "Even outsiders are welcomed by God!",
      "Faith is the cord that saves—hold on!",
      "We learn from God and how God cares for Rahab."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Daniel 6",
          "Luke 10",
          "Jonah 1:17",
          "the Bible"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Jesus",
          "God",
          "David"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "Even outsiders are welcomed by God! Faith is the cord that saves—hold on!",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Even outsiders are welcomed by God! Faith is the cord that saves—hold on!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Rahab lets the spies down by a rope",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Even outsiders are welcomed by God! Faith is the cord that saves—hold on!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Even outsiders are welcomed by God! Faith is the cord that saves—hold on!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Rahab Hangs the Cord with God's Word today.",
    "takeaway": "Even outsiders are welcomed by God! Faith is the cord that saves—hold on!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Rahab Hangs the Cord. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rahab lets the spies down by a rope (rahab)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She ties the scarlet cord in the window (window)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God keeps His promise—she is saved! (cord)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rahab lets the spies down by a rope (scarlet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She ties the scarlet cord in the window (joshua 2)"
    ]
  },
  "redSea": {
    "kjvRef": "Exodus 14",
    "paragraphs": [
      "Moses led God's people out of Egypt. Pharaoh changed his mind and chased them with chariots.",
      "The people were trapped — the Red Sea was in front, Pharaoh's army behind. They were afraid.",
      "Moses said, \"Fear ye not, stand still, and see the salvation of the Lord.\"",
      "God told Moses to stretch out his staff. The sea divided — dry ground appeared between walls of water!",
      "The people walked through on dry land. When the army followed, God brought the waters together — God's people were safe."
    ],
    "imagePrompts": [
      "bright cartoon for kids: Israelites leaving Egypt, Moses leading, chariots far behind, no text",
      "fun kid illustration: sea ahead, army behind, worried crowd, no text",
      "colorful Bible scene for children: Moses stretching rod over sea, wind and water moving, no text",
      "exciting cartoon: dry path between tall walls of water, families walking safely, no text",
      "happy ending illustration: people on far shore praising, calm sea, sunrise hope, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "God made a way when there seemed to be no way!",
    "quizHeading": "Red Sea Questions",
    "questions": [
      {
        "question": "Why were the people afraid at the Red Sea?",
        "choices": [
          "It was dark",
          "Pharaoh's army was chasing them",
          "They were hungry",
          "They forgot Moses"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! The army was behind and the sea in front.",
        "wrongFeedback": "Pharaoh and his host followed after them with horses and chariots (Exodus 14:9)."
      },
      {
        "question": "What did Moses tell the people?",
        "choices": [
          "Run away",
          "Fear not — stand still and see God save you",
          "Fight alone",
          "Go home"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! Stand still — the Lord will fight for you.",
        "wrongFeedback": "Moses said, \"Fear ye not, stand still, and see the salvation of the Lord\" (Exodus 14:13)."
      },
      {
        "question": "What did God tell Moses to do?",
        "choices": [
          "Run",
          "Stretch out your staff over the sea",
          "Shout loud",
          "Pray only"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Moses stretched his rod — the Lord drove the sea back.",
        "wrongFeedback": "God said lift up thy rod, and stretch out thine hand over the sea, and divide it (Exodus 14:16)."
      },
      {
        "question": "What happened when the people walked through?",
        "choices": [
          "They swam",
          "They walked on dry ground between walls of water",
          "They sank",
          "The army helped"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! A dry path in the midst of the sea.",
        "wrongFeedback": "The children of Israel went upon dry ground in the midst of the sea (Exodus 14:22)."
      },
      {
        "question": "What does the Red Sea teach us?",
        "choices": [
          "God leaves us trapped",
          "God makes a way when there seems to be none",
          "Armies always win",
          "Don't trust leaders"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! God delivers His people.",
        "wrongFeedback": "The Lord saved Israel that day — He can make a way through what looks impossible!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star — God makes a way!",
    "takeaway": "When we feel trapped, God can make a way — trust Him.",
    "prayer": "God, when I feel stuck, show me Your way. Thank You for Your power. Amen."
  },
  "redSeaCrossing": {
    "kjvRef": "Exodus 14",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Red Sea Crossing.",
      "We read about this in Exodus 14.",
      "God stops the enemy for you!",
      "When you're afraid, He fights your battle.",
      "We learn from God and how God cares for Israel."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 17",
          "Exodus 14",
          "Exodus 7–12",
          "Revelation 22"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 14.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Stephen",
          "God",
          "Mary"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God stops the enemy for you! When you're afraid, He fights your battle."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God stops the enemy for you! When you're afraid, He fights your battle..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Egypt's army chases Israel",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "God stops the enemy for you! When you're afraid, He fights your battle.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God stops the enemy for you! When you're afraid, He fights your battle..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Red Sea Crossing with God's Word today.",
    "takeaway": "God stops the enemy for you! When you're afraid, He fights your battle.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Red Sea Crossing. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Egypt's army chases Israel (red sea)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God tangles the chariot wheels (chariot)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Israel is safe—Egypt is stopped! (egypt)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Egypt's army chases Israel (exodus 14)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God tangles the chariot wheels (army)"
    ]
  },
  "resurrection": {
    "kjvRef": "Matthew 28",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Resurrection.",
      "We read about this in Matthew 28.",
      "Jesus beat death—He lives forever!",
      "That's why we celebrate Easter—He won!",
      "We learn from God and how God cares for The whole world."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 28",
          "Ephesians 6",
          "1 Kings 18",
          "Mark 5"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 28.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Paul",
          "Stephen",
          "Jesus",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus beat death—He lives forever! That's why we celebrate Easter—He won!",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus beat death—He lives forever! That's why we celebrate Easter—He won!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Women go to the tomb",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Jesus beat death—He lives forever! That's why we celebrate Easter—He won!",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus beat death—He lives forever! That's why we celebrate Easter—He won!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Resurrection with God's Word today.",
    "takeaway": "Jesus beat death—He lives forever! That's why we celebrate Easter—He won!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Resurrection. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Women go to the tomb (resurrection)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Empty tomb—stone rolled away! (empty tomb)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus is alive—He lives forever! (alive)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Women go to the tomb (easter)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Empty tomb—stone rolled away! (matthew 28)"
    ]
  },
  "revelationBride": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Lamb and His Bride.",
      "We read about this in the Bible.",
      "The best day is coming—Jesus' wedding feast!",
      "All who believe are invited—that means you!",
      "We learn from God and how God cares for All His people."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "Genesis 3",
          "Judges 16:30",
          "1 Samuel 22"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Stephen",
          "The crowds",
          "Mary",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The best day is coming—Jesus' wedding feast! All who believe are invited—that means you!",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: The best day is coming—Jesus' wedding feast! All who believe are invited—that means you!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "The new city comes down—adorned like a bride",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "The best day is coming—Jesus' wedding feast! All who believe are invited—that means you!",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: The best day is coming—Jesus' wedding feast! All who believe are invited—that means you!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Lamb and His Bride with God's Word today.",
    "takeaway": "The best day is coming—Jesus' wedding feast! All who believe are invited—that means you!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Lamb and His Bride. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The new city comes down—adorned like a bride (bride)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The marriage supper of the Lamb! (lamb)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God with His people—forever and ever! (revelation 21)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The new city comes down—adorned like a bride (wedding)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The marriage supper of the Lamb! (supper)"
    ]
  },
  "revelationThrone": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Throne in Heaven.",
      "We read about this in the Bible.",
      "Heaven is real and beautiful!",
      "Worship God now—that's what heaven is like forever.",
      "We learn from God and how God cares for John."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Numbers 22",
          "1 Samuel 18",
          "the Bible",
          "Luke 24"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "David",
          "Holy Spirit",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Heaven is real and beautiful! Worship God now—that's what heaven is like forever.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Heaven is real and beautiful! Worship God now—that's what heaven is like forever..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "John sees an open door to heaven",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Heaven is real and beautiful! Worship God now—that's what heaven is like forever.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Heaven is real and beautiful! Worship God now—that's what heaven is like forever..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Throne in Heaven with God's Word today.",
    "takeaway": "Heaven is real and beautiful! Worship God now—that's what heaven is like forever.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Throne in Heaven. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: John sees an open door to heaven (revelation)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A glorious throne surrounded by a rainbow (throne)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elders bow and worship—heaven is amazing! (heaven)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: John sees an open door to heaven (revelation 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A glorious throne surrounded by a rainbow (rainbow)"
    ]
  },
  "richYoungRuler": {
    "kjvRef": "Mark 10",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Rich Young Ruler.",
      "We read about this in Mark 10.",
      "Give to others—follow Jesus!",
      "He's worth more than anything!",
      "We learn from Jesus and how God cares for The rich young ruler."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 19",
          "Luke 10",
          "Daniel 6",
          "Mark 10"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Mark 10.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "The crowds",
          "Mary",
          "Stephen"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "Give to others—follow Jesus! He's worth more than anything!",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Give to others—follow Jesus! He's worth more than anything!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Rich man asks Jesus",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older.",
          "Give to others—follow Jesus! He's worth more than anything!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Give to others—follow Jesus! He's worth more than anything!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Rich Young Ruler with God's Word today.",
    "takeaway": "Give to others—follow Jesus! He's worth more than anything!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Rich Young Ruler. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rich man asks Jesus (rich young ruler)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: give to the poor (give)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Follow Jesus—He's worth more! (follow)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rich man asks Jesus (mark 10)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: give to the poor (matthew 19)"
    ]
  },
  "riverOfLife": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The River of Life.",
      "We read about this in the Bible.",
      "Living water flows from God forever!",
      "Come to Him—He is the source of all life.",
      "We learn from God and how God cares for All His people."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "Daniel 6",
          "Mark 12",
          "Luke 10"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Mary",
          "Stephen",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Living water flows from God forever! Come to Him—He is the source of all life.",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Living water flows from God forever! Come to Him—He is the source of all life..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A crystal-clear river flows from the throne",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Living water flows from God forever! Come to Him—He is the source of all life.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Living water flows from God forever! Come to Him—He is the source of all life..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The River of Life with God's Word today.",
    "takeaway": "Living water flows from God forever! Come to Him—He is the source of all life.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The River of Life. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A crystal-clear river flows from the throne (river)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The tree of life grows on both banks (life)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God's throne is there—eternal life! (revelation 22)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A crystal-clear river flows from the throne (crystal)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The tree of life grows on both banks (throne)"
    ]
  },
  "roadToEmmaus": {
    "kjvRef": "Luke 24",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Road to Emmaus.",
      "We read about this in Luke 24.",
      "Jesus walks with us—He explains!",
      "He's with you on every road!",
      "We learn from Jesus and how God cares for Cleopas and his friend."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 24",
          "1 Samuel 3",
          "Acts 9",
          "John 11:43-44"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 24.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "Jesus",
          "David",
          "Holy Spirit"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus walks with us—He explains! He's with you on every road!",
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus walks with us—He explains! He's with you on every road!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Two disciples walk to Emmaus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Jesus walks with us—He explains! He's with you on every road!",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus walks with us—He explains! He's with you on every road!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Road to Emmaus with God's Word today.",
    "takeaway": "Jesus walks with us—He explains! He's with you on every road!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Road to Emmaus. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Two disciples walk to Emmaus (emmaus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus walks with them (road)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus explains—they recognize Him! (walk)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Two disciples walk to Emmaus (luke 24)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus walks with them (explain)"
    ]
  },
  "ruthBoaz": {
    "kjvRef": "Ruth 1",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Ruth & Boaz.",
      "We read about this in Ruth 1.",
      "Be kind—God sees!",
      "Loyalty and kindness matter to Him!",
      "We learn from God and how God cares for Ruth and Boaz."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Ruth 1",
          "Matthew 7",
          "John 18",
          "Matthew 13"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Ruth 1.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Holy Spirit",
          "Paul",
          "God",
          "David"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Be kind—God sees! Loyalty and kindness matter to Him!",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Be kind—God sees! Loyalty and kindness matter to Him!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "Ruth stays with Naomi"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Be kind—God sees! Loyalty and kindness matter to Him!",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Be kind—God sees! Loyalty and kindness matter to Him!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Ruth & Boaz with God's Word today.",
    "takeaway": "Be kind—God sees! Loyalty and kindness matter to Him!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Ruth & Boaz. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth stays with Naomi (ruth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth gleans in Boaz's field (boaz)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Boaz is kind—God sees! (loyalty)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth stays with Naomi (harvest)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth gleans in Boaz's field (naomi)"
    ]
  },
  "ruthGlean": {
    "kjvRef": "Ruth 2:2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Ruth Gleans – Ruth 2:2. Ruth's husband died, and she could have gone back home.",
      "But she said to Naomi, 'Your people will be my people, and your God my God.' They went to Bethlehem. Ruth worked in the fields picking leftover grain.",
      "The owner, Boaz, noticed her kindness and hard work. He told his workers to leave extra grain for her and protected her.",
      "Boaz married Ruth, and they had a son who became part of Jesus' family line! God saw Ruth's faithfulness and blessed her.",
      "For you: When you stay loyal, help others, and work hard, God sees it. He blesses faithfulness and can turn hard times into joy."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Joshua 2",
          "Daniel 6:22",
          "Mark 12",
          "Ruth 2:2"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Ruth 2:2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Mary",
          "Holy Spirit",
          "The crowds"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "Ruth stayed loyal to her mother-in-law Naomi and worked hard gleaning in the fields. God saw her kindness and blessed her with Boaz. When…",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Ruth stayed loyal to her mother-in-law Naomi and worked hard gleaning in the fields. God….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Ruth with Naomi – Staying loyal in hard times",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "When you stay loyal, help others, and work hard, God sees it. He blesses faithfulness and can turn hard times into joy."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: When you stay loyal, help others, and work hard, God sees it. He blesses faithfulness….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Ruth Gleans in the Field with God's Word today.",
    "takeaway": "Ruth stayed loyal to her mother-in-law Naomi and worked hard gleaning in the fields. God saw her kindness and blessed her with Boaz. When you are faithful and kind, even in hard times, God notices…",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Ruth Gleans in the Field. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth with Naomi – Staying loyal in hard times (ruth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth gleaning in the fields – Working hard and faithfully (glean)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Boaz noticing Ruth – God blesses kindness (boaz)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth with Naomi – Staying loyal in hard times (field)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth gleaning in the fields – Working hard and faithfully (ruth 2)"
    ]
  },
  "ruthMoab": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Ruth Stays with Naomi.",
      "We read about this in the Bible.",
      "Stick with those you love even in hard times!",
      "Loyalty is a gift—and God honors it.",
      "We learn from God and how God cares for Ruth."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Joshua 8",
          "Ruth 2:2",
          "Matthew 21",
          "the Bible"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "The crowds",
          "Mary",
          "Stephen"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "Stick with those you love even in hard times! Loyalty is a gift—and God honors it.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Stick with those you love even in hard times! Loyalty is a gift—and God honors it..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Ruth and Naomi at a crossroads",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Stick with those you love even in hard times! Loyalty is a gift—and God honors it."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Stick with those you love even in hard times! Loyalty is a gift—and God honors it..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Ruth Stays with Naomi with God's Word today.",
    "takeaway": "Stick with those you love even in hard times! Loyalty is a gift—and God honors it.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Ruth Stays with Naomi. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth and Naomi at a crossroads (ruth)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth says: wherever you go, I will go! (naomi)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth gleans in Boaz's field—God provides! (moab)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth and Naomi at a crossroads (ruth 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ruth says: wherever you go, I will go! (loyal)"
    ]
  },
  "samaritanWoman": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Woman at the Well.",
      "We read about this in the Bible.",
      "Jesus talks to everyone—even those people ignore!",
      "He offers living water to all.",
      "We learn from Jesus and how God cares for The Samaritan woman."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Acts 27",
          "Genesis 18",
          "Luke 15",
          "the Bible"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "David",
          "Paul",
          "Holy Spirit"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "Jesus talks to everyone—even those people ignore! He offers living water to all.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus talks to everyone—even those people ignore! He offers living water to all..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A Samaritan woman draws water at noon",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older.",
          "Jesus talks to everyone—even those people ignore! He offers living water to all."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus talks to everyone—even those people ignore! He offers living water to all..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Woman at the Well with God's Word today.",
    "takeaway": "Jesus talks to everyone—even those people ignore! He offers living water to all.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Woman at the Well. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A Samaritan woman draws water at noon (samaritan)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus asks for water—she's surprised He'd talk to her (woman)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He offers living water—she runs to tell everyone! (well)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A Samaritan woman draws water at noon (john 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus asks for water—she's surprised He'd talk to her (water)"
    ]
  },
  "samson": {
    "kjvRef": "Judges 16:30",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Samson and the Pillars – Judges 16:30. Samson was born with special strength from God—no razor on his head. He fought bad guys and did amazing things.",
      "But Samson made mistakes and told his secret to Delilah. She cut his hair, and his strength left.",
      "The enemies captured him and made fun of him in their temple. Samson prayed, 'Lord, remember me and give me strength just this once.' God answered!",
      "Samson pushed the two middle pillars, and the whole building fell on the enemies and himself. God gave him power one last time.",
      "For you: God gives you strength in different ways. Use it to do good, help others, and follow Him—not for showing off or getting even."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Judges 16:30",
          "Ruth 1",
          "Genesis 6–9",
          "the Bible"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Judges 16:30.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "The crowds",
          "Mary",
          "Stephen",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "Samson was super strong because God gave him power, but he didn't always use it wisely. In the end, he prayed for strength one last time…",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Samson was super strong because God gave him power, but he didn't always use it wisely.….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Samson with long hair – Strong because of God",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God gives you strength in different ways. Use it to do good, help others, and follow Him—not for showing off or…",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God gives you strength in different ways. Use it to do good, help others, and follow….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Samson & His Strength with God's Word today.",
    "takeaway": "Samson was super strong because God gave him power, but he didn't always use it wisely. In the end, he prayed for strength one last time and brought down the pillars to defeat the enemies. God gives…",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Samson & His Strength. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samson with long hair – Strong because of God (samson)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Delilah cutting Samson's hair – Losing his strength (hair)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samson pushing the pillars – God gives power one last time (strength)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samson with long hair – Strong because of God (pillars)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Delilah cutting Samson's hair – Losing his strength (judges 16)"
    ]
  },
  "samsonHair": {
    "kjvRef": "Judges 16",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Samson's Hair.",
      "We read about this in Judges 16.",
      "Your strength comes from God!",
      "Stay close to Him and nothing can stop you.",
      "We learn from God and how God cares for Samson."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Judges 16",
          "Acts 8",
          "John 20",
          "Exodus 14:21"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Judges 16.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "God",
          "Stephen",
          "The crowds"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "Your strength comes from God! Stay close to Him and nothing can stop you.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Your strength comes from God! Stay close to Him and nothing can stop you..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "Samson has long hair—God's strength"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Your strength comes from God! Stay close to Him and nothing can stop you.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Your strength comes from God! Stay close to Him and nothing can stop you..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Samson's Hair with God's Word today.",
    "takeaway": "Your strength comes from God! Stay close to Him and nothing can stop you.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Samson's Hair. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samson has long hair—God's strength (samson)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Delilah cuts his hair while he sleeps (hair)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samson calls on God one last time (delilah)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samson has long hair—God's strength (judges 16)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Delilah cuts his hair while he sleeps (strength)"
    ]
  },
  "samuelCall": {
    "kjvRef": "1 Samuel 3",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "God Calls Samuel.",
      "We read about this in 1 Samuel 3.",
      "God calls children!",
      "Say yes: \"Speak, Lord—I am listening.\" We learn from God and how God cares for Young Samuel.",
      "Say yes: \"Speak, Lord—I am listening.\"."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "1 Samuel 3",
          "Joshua 2",
          "2 Kings 5:14",
          "Mark 12"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 1 Samuel 3.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "Holy Spirit",
          "David",
          "God"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God calls children! Say yes: \"Speak, Lord—I am listening.\"",
          "God never hears when kids pray."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God calls children! Say yes: \"Speak, Lord—I am listening.\".)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Samuel sleeps in the temple",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God calls children! Say yes: \"Speak, Lord—I am listening.\"",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God calls children! Say yes: \"Speak, Lord—I am listening.\".)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading God Calls Samuel with God's Word today.",
    "takeaway": "God calls children! Say yes: \"Speak, Lord—I am listening.\"",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in God Calls Samuel. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samuel sleeps in the temple (samuel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A voice calls: Samuel! Samuel! (call)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samuel answers: Speak, Lord—I'm listening! (temple)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Samuel sleeps in the temple (1 samuel 3)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A voice calls: Samuel! Samuel! (eli)"
    ]
  },
  "sarahLaughs": {
    "kjvRef": "Genesis 18",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Sarah Laughs.",
      "We read about this in Genesis 18.",
      "Nothing is impossible with God!",
      "He keeps every promise.",
      "We learn from God and how God cares for Sarah and Abraham."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 18",
          "Exodus 7",
          "Matthew 6",
          "Jonah 1:17"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Genesis 18.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "David",
          "Jesus",
          "God",
          "Paul"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Nothing is impossible with God! He keeps every promise.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Nothing is impossible with God! He keeps every promise..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "An angel visits Abraham's tent"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Nothing is impossible with God! He keeps every promise.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Nothing is impossible with God! He keeps every promise..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Sarah Laughs with God's Word today.",
    "takeaway": "Nothing is impossible with God! He keeps every promise.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Sarah Laughs. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: An angel visits Abraham's tent (sarah)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Sarah hears she will have a baby (laugh)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Sarah laughs—then holds baby Isaac! (angel)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: An angel visits Abraham's tent (genesis 18)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Sarah hears she will have a baby (baby)"
    ]
  },
  "sarahPromise": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Sarah Receives the Promise.",
      "We read about this in the Bible.",
      "God always keeps His promises!",
      "Even the ones that seem impossible are safe in His hands.",
      "We learn from God and how God cares for Sarah."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Esther 4",
          "the Bible",
          "Luke 22",
          "John 10"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "David",
          "Holy Spirit",
          "Paul"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray.",
          "God always keeps His promises! Even the ones that seem impossible are safe in His hands."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God always keeps His promises! Even the ones that seem impossible are safe in His hands..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "God promises Sarah a baby—at 90!",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "God always keeps His promises! Even the ones that seem impossible are safe in His hands.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God always keeps His promises! Even the ones that seem impossible are safe in His hands..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Sarah Receives the Promise with God's Word today.",
    "takeaway": "God always keeps His promises! Even the ones that seem impossible are safe in His hands.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Sarah Receives the Promise. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God promises Sarah a baby—at 90! (sarah)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She laughed—but God said: is anything too hard? (promise)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Baby Isaac is born—the promise kept! (genesis 18)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God promises Sarah a baby—at 90! (isaac)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: She laughed—but God said: is anything too hard? (laugh)"
    ]
  },
  "saulSpear": {
    "kjvRef": "1 Samuel 18",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Saul Throws a Spear at David.",
      "We read about this in 1 Samuel 18.",
      "When people are unkind, trust God!",
      "He is your protection.",
      "We learn from God and how God cares for David."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 14",
          "1 Samuel 18",
          "Acts 5",
          "Exodus 2:5"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 1 Samuel 18.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "The crowds",
          "Stephen",
          "Mary"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "When people are unkind, trust God! He is your protection."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: When people are unkind, trust God! He is your protection..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "David plays harp for King Saul",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "When people are unkind, trust God! He is your protection.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: When people are unkind, trust God! He is your protection..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Saul Throws a Spear at David with God's Word today.",
    "takeaway": "When people are unkind, trust God! He is your protection.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Saul Throws a Spear at David. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David plays harp for King Saul (saul)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Saul throws a spear in jealousy (spear)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David escapes—trust God, not fear! (david)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David plays harp for King Saul (1 samuel 18)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Saul throws a spear in jealousy (jealous)"
    ]
  },
  "shepherdsStar": {
    "kjvRef": "Luke 2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Shepherds and the Star.",
      "We read about this in Luke 2.",
      "God shares good news first with humble people!",
      "Run to Jesus—everyone is invited.",
      "We learn from God and how God cares for The shepherds."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 6–9",
          "Ruth 1",
          "Luke 19",
          "Luke 2"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "David",
          "Holy Spirit",
          "Mary"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "God shares good news first with humble people! Run to Jesus—everyone is invited.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God shares good news first with humble people! Run to Jesus—everyone is invited..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Shepherds watch their flock at night",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "God shares good news first with humble people! Run to Jesus—everyone is invited."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God shares good news first with humble people! Run to Jesus—everyone is invited..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Shepherds and the Star with God's Word today.",
    "takeaway": "God shares good news first with humble people! Run to Jesus—everyone is invited.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Shepherds and the Star. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Shepherds watch their flock at night (shepherds)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Angels fill the sky singing! (star)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They run to Bethlehem—Jesus is born! (angels)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Shepherds watch their flock at night (luke 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Angels fill the sky singing! (bethlehem)"
    ]
  },
  "solomonWisdom": {
    "kjvRef": "1 Kings 3",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Solomon's Wisdom.",
      "We read about this in 1 Kings 3.",
      "Ask God for wisdom!",
      "He gives it freely to those who ask.",
      "We learn from God and how God cares for Solomon."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 18",
          "Matthew 14",
          "Luke 23",
          "1 Kings 3"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: 1 Kings 3.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Stephen",
          "God",
          "Paul"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "Ask God for wisdom! He gives it freely to those who ask.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Ask God for wisdom! He gives it freely to those who ask..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Two moms argue about a baby",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older.",
          "Ask God for wisdom! He gives it freely to those who ask."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Ask God for wisdom! He gives it freely to those who ask..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Solomon's Wisdom with God's Word today.",
    "takeaway": "Ask God for wisdom! He gives it freely to those who ask.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Solomon's Wisdom. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Two moms argue about a baby (solomon)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Solomon says: bring a sword! (wisdom)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The real mom speaks up—God gives wisdom! (baby)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Two moms argue about a baby (sword)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Solomon says: bring a sword! (1 kings 3)"
    ]
  },
  "spiesInCanaan": {
    "kjvRef": "Numbers 13–14",
    "paragraphs": [
      "God told Moses to send twelve spies into Canaan, the promised land.",
      "The spies came back after forty days. Ten said, \"The land is good but the people are giants — we cannot win.\"",
      "Joshua and Caleb said, \"The land is wonderful! God is with us — let us go up at once and possess it.\"",
      "The people listened to the ten fearful spies and wept. They wanted to go back to Egypt.",
      "God was grieved by their unbelief. That generation would not enter the land — only their children would. God still kept His promise."
    ],
    "imagePrompts": [
      "bright cartoon for kids: twelve men exploring green hills and vineyards, big grape cluster, no text",
      "fun kid illustration: two men carrying huge grapes on a pole between them, amazed faces, no text",
      "colorful Bible scene for children: ten men looking scared at shadow of giants, two men standing brave, no text",
      "exciting cartoon: crowd weeping, Moses and Aaron bowed, desert tents, no text",
      "hopeful ending illustration: Joshua and Caleb strong in foreground, younger generation beyond, sunrise, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "Two spies trusted God — the others were afraid!",
    "quizHeading": "Spies in Canaan Questions",
    "questions": [
      {
        "question": "How many spies did Moses send?",
        "choices": [
          "Two",
          "Ten",
          "Twelve",
          "Forty"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes! Twelve spies — one from each tribe.",
        "wrongFeedback": "Not two or ten. Moses sent twelve men to search the land of Canaan (Numbers 13:1–3)."
      },
      {
        "question": "What did the spies find in Canaan?",
        "choices": [
          "A desert",
          "A land flowing with milk and honey",
          "Only giants",
          "Nothing"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! It was beautiful and full of good things.",
        "wrongFeedback": "They brought back one cluster of grapes so big two men carried it — it flowed with milk and honey (Numbers 13:27)."
      },
      {
        "question": "Who said God would help them take the land?",
        "choices": [
          "The ten spies",
          "Joshua and Caleb",
          "Moses only",
          "The whole crowd"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Joshua and Caleb trusted God.",
        "wrongFeedback": "The ten brought an evil report. Caleb said, \"Let us go up at once, and possess it; for we are well able to overcome it\" (Numbers 13:30)."
      },
      {
        "question": "What did the people want to do after hearing the report?",
        "choices": [
          "Go in and take the land",
          "Go back to Egypt",
          "Stay quiet",
          "Fight the giants alone"
        ],
        "correctIndex": 1,
        "correctFeedback": "Correct! They wanted to return — that showed unbelief.",
        "wrongFeedback": "They said, \"Let us make a captain, and let us return into Egypt\" (Numbers 14:4)."
      },
      {
        "question": "What can we learn from the spies?",
        "choices": [
          "Be afraid of big problems",
          "Trust God even when things look hard",
          "Always follow the crowd",
          "Give up easily"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! Trust God — He keeps His promises.",
        "wrongFeedback": "The ten saw giants. Joshua and Caleb saw God. Faith is stronger than fear!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star for trusting God's promises!",
    "takeaway": "Trust God's promises — don't let fear stop you.",
    "prayer": "God, help me trust Your promises even when things look scary. Amen."
  },
  "stephen": {
    "kjvRef": "Acts 7",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Stephen.",
      "We read about this in Acts 7.",
      "Stephen forgives—be like him!",
      "Even when hurt, pray for others!",
      "We learn from Stephen and how God cares for Those who stoned him."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Joshua 2",
          "Mark 12",
          "Acts 7",
          "2 Kings 5:14"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 7.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "Stephen",
          "David",
          "Holy Spirit"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Stephen.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Stephen forgives—be like him! Even when hurt, pray for others!",
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Stephen forgives—be like him! Even when hurt, pray for others!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Stephen preaches about Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Stephen forgives—be like him! Even when hurt, pray for others!",
          "Ignore God until we are older."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Stephen forgives—be like him! Even when hurt, pray for others!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Stephen with God's Word today.",
    "takeaway": "Stephen forgives—be like him! Even when hurt, pray for others!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Stephen. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Stephen preaches about Jesus (stephen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People throw stones (martyr)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Stephen forgives—be like him! (stones)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Stephen preaches about Jesus (forgive)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: People throw stones (acts 7)"
    ]
  },
  "stephenStones": {
    "kjvRef": "Acts 7",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Stephen Sees Heaven.",
      "We read about this in Acts 7.",
      "Be bold for Jesus—even when it's hard!",
      "And always forgive like Stephen did.",
      "We learn from Jesus and how God cares for Stephen."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Acts 7",
          "Matthew 13",
          "Matthew 7",
          "John 18"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Acts 7.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "Holy Spirit",
          "The crowds",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Be bold for Jesus—even when it's hard! And always forgive like Stephen did.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Be bold for Jesus—even when it's hard! And always forgive like Stephen did..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Stephen preaches boldly about Jesus",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Be bold for Jesus—even when it's hard! And always forgive like Stephen did.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Be bold for Jesus—even when it's hard! And always forgive like Stephen did..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Stephen Sees Heaven with God's Word today.",
    "takeaway": "Be bold for Jesus—even when it's hard! And always forgive like Stephen did.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Stephen Sees Heaven. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Stephen preaches boldly about Jesus (stephen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They throw stones—Stephen looks up (stones)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: He sees Jesus standing—and forgives them! (acts 7)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Stephen preaches boldly about Jesus (forgive)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: They throw stones—Stephen looks up (heaven)"
    ]
  },
  "tenCommandments": {
    "kjvRef": "Exodus 20:1–17",
    "paragraphs": [
      "God led His people out of Egypt. They came to Mount Sinai. There was thunder, lightning, and a thick cloud.",
      "God came down on the mountain in fire. He spoke the Ten Commandments to the people.",
      "The first four are about loving God: No other gods, no idols, no wrong use of God's name, keep the Sabbath holy.",
      "The last six are about loving others: Honour parents, no murder, no adultery, no stealing, no false witness, no coveting.",
      "The people were afraid and asked Moses to speak to God for them. God gave the commandments so they could live His way."
    ],
    "imagePrompts": [
      "bright bouncy cartoon for kids: Mount Sinai with thunder clouds, lightning, fire on top, people at bottom, no text",
      "fun kid illustration: God speaking from mountain, two stone tablets, Moses listening, no text",
      "colorful Bible scene for children: people trembling at base of mountain, Moses with God above, no text",
      "exciting cartoon: two stone tablets glowing, simple symbols suggesting love for God and neighbour, no text",
      "happy ending illustration: families learning together, peaceful camp, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "God gave rules because He loves us!",
    "quizHeading": "Ten Commandments Questions",
    "questions": [
      {
        "question": "Where did God give the Ten Commandments?",
        "choices": [
          "In Egypt",
          "At Mount Sinai",
          "In the desert only",
          "In Canaan"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! At Mount Sinai after leaving Egypt.",
        "wrongFeedback": "Not Egypt or Canaan. God spoke from the mountain with thunder and fire (Exodus 19–20)."
      },
      {
        "question": "How many commandments did God give?",
        "choices": [
          "Five",
          "Ten",
          "Twenty",
          "One hundred"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! Ten special rules to help us love God and people.",
        "wrongFeedback": "Not five or twenty. God gave exactly ten commandments (Exodus 20:1–17)."
      },
      {
        "question": "What are the first four commandments about?",
        "choices": [
          "Loving others",
          "Loving God",
          "Eating food",
          "Building houses"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! They tell us how to love and honour God.",
        "wrongFeedback": "Not others or food. The first four are about God: no other gods, no idols, honour His name, keep the Sabbath holy."
      },
      {
        "question": "What does \"honour thy father and thy mother\" mean?",
        "choices": [
          "Obey and respect them",
          "Ignore them",
          "Give them gifts only",
          "Fight with them"
        ],
        "correctIndex": 0,
        "correctFeedback": "Perfect! Honour means obey and respect parents — it is one of God's rules.",
        "wrongFeedback": "Not ignore or fight. God said to honour father and mother that thy days may be long (Exodus 20:12)."
      },
      {
        "question": "Why did God give the commandments?",
        "choices": [
          "To make life hard",
          "To help us live His way and love others",
          "To punish us",
          "To confuse us"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! God gave rules out of love — to help us live right.",
        "wrongFeedback": "Not to punish or confuse. They teach His people to love Him and each other well."
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star for learning God's rules!",
    "takeaway": "God gave rules because He loves us — they show us how to love Him and others.",
    "prayer": "God, thank You for Your rules. Help me obey them with a happy heart. Amen."
  },
  "tenPlagues": {
    "kjvRef": "Exodus 7–12",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Ten Plagues – Exodus 7 to 12. Pharaoh would not let God's people go.",
      "God sent Moses and Aaron to tell him, 'Let My people go.' Pharaoh said no, so God sent ten plagues: water to blood, frogs, lice, flies, sick animals, boils, hail, locusts, darkness, and finally the death of the firstborn. Each plague showed God was stronger than Egypt's gods.",
      "For the last plague, God told His people to put lamb blood on their doors—the angel passed over them. Pharaoh finally let them go!",
      "God shows His power to save. For you: When bad things happen or people are mean, God is stronger than anything.",
      "Trust Him—He protects and sets free."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "1 Corinthians 13",
          "Exodus 7–12",
          "Matthew 17",
          "Mark 4:39"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Exodus 7–12.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Stephen",
          "Jesus",
          "God",
          "The crowds"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God sent ten plagues to show Pharaoh He was stronger than any false gods. The last plague was hard, but God protected His people with the…"
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God sent ten plagues to show Pharaoh He was stronger than any false gods. The last….)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Moses and Aaron before Pharaoh – Asking to let people go",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "When bad things happen or people are mean, God is stronger than anything. Trust Him—He protects and sets free.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: When bad things happen or people are mean, God is stronger than anything. Trust Him—He….)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Ten Plagues of Egypt with God's Word today.",
    "takeaway": "God sent ten plagues to show Pharaoh He was stronger than any false gods. The last plague was hard, but God protected His people with the Passover lamb. God shows His power to save and protect. When…",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Ten Plagues of Egypt. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses and Aaron before Pharaoh – Asking to let people go (plagues)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Plagues coming on Egypt – God shows His power (egypt)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Passover door with blood – God protects His people (frogs)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Moses and Aaron before Pharaoh – Asking to let people go (darkness)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Plagues coming on Egypt – God shows His power (exodus 8)"
    ]
  },
  "tenVirgins": {
    "kjvRef": "Matthew 25",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Ten Virgins.",
      "We read about this in Matthew 25.",
      "Be ready!",
      "Fill up with God's Word and Spirit every day—don't run empty.",
      "We learn from Jesus and how God cares for His followers."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 24",
          "Joshua 6",
          "Matthew 25",
          "Numbers 22"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 25.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Stephen",
          "Jesus",
          "Mary",
          "The crowds"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Be ready! Fill up with God's Word and Spirit every day—don't run empty.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Be ready! Fill up with God's Word and Spirit every day—don't run empty..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot.",
          "Ten virgins wait with lamps"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Be ready! Fill up with God's Word and Spirit every day—don't run empty.",
          "Ignore God until we are older."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Be ready! Fill up with God's Word and Spirit every day—don't run empty..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Ten Virgins with God's Word today.",
    "takeaway": "Be ready! Fill up with God's Word and Spirit every day—don't run empty.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Ten Virgins. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ten virgins wait with lamps (virgins)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Five are wise—they brought extra oil (lamps)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Be ready—Jesus is coming! (oil)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Ten virgins wait with lamps (matthew 25)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Five are wise—they brought extra oil (ready)"
    ]
  },
  "thomasDoubt": {
    "kjvRef": "John 20",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Thomas Touches Jesus' Hands.",
      "We read about this in John 20.",
      "It's okay to have questions!",
      "Jesus is patient—keep coming back to Him.",
      "We learn from Jesus and how God cares for Thomas."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 12",
          "John 20",
          "Luke 1",
          "Judges 16"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: John 20.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Mary",
          "The crowds",
          "Holy Spirit"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "It's okay to have questions! Jesus is patient—keep coming back to Him."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: It's okay to have questions! Jesus is patient—keep coming back to Him..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Thomas says: I won't believe until I see!",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "It's okay to have questions! Jesus is patient—keep coming back to Him.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: It's okay to have questions! Jesus is patient—keep coming back to Him..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Thomas Touches Jesus' Hands with God's Word today.",
    "takeaway": "It's okay to have questions! Jesus is patient—keep coming back to Him.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Thomas Touches Jesus' Hands. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Thomas says: I won't believe until I see! (thomas)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus appears and shows His hands (doubt)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Thomas cries: My Lord and my God! (john 20)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Thomas says: I won't believe until I see! (hands)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus appears and shows His hands (believe)"
    ]
  },
  "tombEmpty": {
    "kjvRef": "Matthew 28",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Empty Tomb.",
      "We read about this in Matthew 28.",
      "Jesus is alive!",
      "Death couldn't hold Him—and He gives that life to you!",
      "We learn from Jesus and how God cares for The women."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Luke 15",
          "Acts 27",
          "Matthew 28",
          "Mark 10"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 28.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "Jesus",
          "The crowds",
          "Stephen"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus is alive! Death couldn't hold Him—and He gives that life to you!",
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus is alive! Death couldn't hold Him—and He gives that life to you!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "Women come early to the tomb"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Jesus is alive! Death couldn't hold Him—and He gives that life to you!",
          "Ignore God until we are older."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus is alive! Death couldn't hold Him—and He gives that life to you!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Empty Tomb with God's Word today.",
    "takeaway": "Jesus is alive! Death couldn't hold Him—and He gives that life to you!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Empty Tomb. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Women come early to the tomb (tomb)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The stone is rolled away! (empty)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: An angel says: He is not here—He is risen! (risen)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Women come early to the tomb (matthew 28)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The stone is rolled away! (angel)"
    ]
  },
  "towerBabel": {
    "kjvRef": "Genesis 11:1–9",
    "paragraphs": [
      "After the flood, everyone spoke one language. They decided to build a big tower that reached heaven.",
      "They wanted to make a name for themselves and not be scattered over the earth.",
      "God came down and saw their plan. He said, \"If they keep this up, nothing will stop them.\"",
      "God confused their language so they couldn't understand each other. They stopped building the tower.",
      "The place was called Babel because God confused their language. Then He scattered the people over the earth."
    ],
    "imagePrompts": [
      "bright cartoon for kids: people building tall tower toward heaven, bricks and tools, one language, no text",
      "fun kid illustration: group of people working together on huge tower, proud faces, sky high, no text",
      "colorful Bible scene for children: God looking down from heaven at the tower, serious expression, no text",
      "exciting cartoon: people suddenly speaking different languages, confused faces, tower unfinished, no text",
      "peaceful illustration: families settling in new lands under wide sky, many nations, soft colors, no text"
    ],
    "readAlongImages": [],
    "hintAboveQuiz": "Why did the people want to build the tower?",
    "quizHeading": "Tower of Babel Questions",
    "questions": [
      {
        "question": "What did the people all speak at first?",
        "choices": [
          "Many languages",
          "One language",
          "Animal sounds",
          "No words"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! Everyone spoke one language, so they could work together easily.",
        "wrongFeedback": "Different languages came later. At the beginning, the whole world had one language (Genesis 11:1)."
      },
      {
        "question": "What did the people want to build?",
        "choices": [
          "A big house",
          "A tall tower to heaven",
          "A boat",
          "A garden"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right! A tower that reached the sky — to make a name for themselves.",
        "wrongFeedback": "Not a house or garden. They said \"Let us build a city with a tower that reaches to heaven\" (Genesis 11:4)."
      },
      {
        "question": "Why did they want to build it?",
        "choices": [
          "To help God",
          "To make a name for themselves",
          "To hide from God",
          "To grow food"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes! They wanted fame and to stay together instead of spreading out.",
        "wrongFeedback": "They weren't helping God. Their plan was pride — to make themselves great, not obey God's command to fill the earth."
      },
      {
        "question": "What did God do to stop them?",
        "choices": [
          "Sent a flood",
          "Confused their language",
          "Sent animals",
          "Blew the tower down"
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly! God confused their language so they couldn't work together.",
        "wrongFeedback": "No flood this time. He mixed up their words — they couldn't understand each other anymore (Genesis 11:7)."
      },
      {
        "question": "What does this story teach us?",
        "choices": [
          "Build big towers",
          "Pride leads to problems",
          "God likes confusion",
          "Stay in one place"
        ],
        "correctIndex": 1,
        "correctFeedback": "Perfect! Pride makes us think we don't need God — humility and obedience please Him.",
        "wrongFeedback": "The tower was about pride and disobedience. God scattered them to fulfill His plan — humility is better!"
      }
    ],
    "doneHeading": "Great Job!",
    "doneMessage": "You earned a star for learning about humility!",
    "takeaway": "Pride leads to confusion, but humility and obedience honor God.",
    "prayer": "God, help me stay humble and obey You, not try to be great on my own. Amen."
  },
  "transfigure": {
    "kjvRef": "Matthew 17",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Jesus' Transfiguration.",
      "We read about this in Matthew 17.",
      "Jesus is the Son of God—really listen to Him!",
      "He is glorious.",
      "We learn from God and how God cares for Peter."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Esther 7",
          "Matthew 17",
          "Acts 7",
          "Exodus 3:2"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 17.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Stephen",
          "Jesus",
          "God",
          "The crowds"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "Jesus is the Son of God—really listen to Him! He is glorious."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus is the Son of God—really listen to Him! He is glorious..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Jesus goes up the mountain with Peter, James, and John",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "Jesus is the Son of God—really listen to Him! He is glorious.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus is the Son of God—really listen to Him! He is glorious..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Jesus' Transfiguration with God's Word today.",
    "takeaway": "Jesus is the Son of God—really listen to Him! He is glorious.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Jesus' Transfiguration. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus goes up the mountain with Peter, James, and John (transfigure)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: His face shines like the sun—His clothes glow white (mountain)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: God's voice says: This is my Son—listen to Him! (matthew 17)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus goes up the mountain with Peter, James, and John (glow)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: His face shines like the sun—His clothes glow white (moses)"
    ]
  },
  "treeFruit": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Tree That Heals Nations.",
      "We read about this in the Bible.",
      "God's healing reaches every nation!",
      "His love is for everyone—share it.",
      "We learn from God and how God cares for All creation."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Psalm 23",
          "John 19",
          "John 18",
          "the Bible"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "The crowds",
          "Mary",
          "Stephen"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "We should hide from God when we mess up.",
          "God's healing reaches every nation! His love is for everyone—share it.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God's healing reaches every nation! His love is for everyone—share it..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "The tree of life grows by the river",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "God's healing reaches every nation! His love is for everyone—share it."
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God's healing reaches every nation! His love is for everyone—share it..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Tree That Heals Nations with God's Word today.",
    "takeaway": "God's healing reaches every nation! His love is for everyone—share it.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Tree That Heals Nations. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The tree of life grows by the river (tree)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Its leaves heal every nation (fruit)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: In God's city—everything is made whole! (revelation 22)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: The tree of life grows by the river (heal)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Its leaves heal every nation (nations)"
    ]
  },
  "treeOfLife": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Tree of Life.",
      "We read about this in the Bible.",
      "God's healing never runs out!",
      "In His new world, everything is made whole.",
      "We learn from God and how God cares for His people in the new creation."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "the Bible",
          "1 Corinthians 13",
          "Mark 4:39",
          "Matthew 17"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Mary",
          "God",
          "Stephen",
          "The crowds"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God's healing never runs out! In His new world, everything is made whole.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God's healing never runs out! In His new world, everything is made whole..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A beautiful tree grows by the river"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God's healing never runs out! In His new world, everything is made whole.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God's healing never runs out! In His new world, everything is made whole..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Tree of Life with God's Word today.",
    "takeaway": "God's healing never runs out! In His new world, everything is made whole.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Tree of Life. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A beautiful tree grows by the river (tree of life)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: It bears twelve kinds of fruit every month (revelation 22)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Its leaves heal the nations—God provides! (fruit)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A beautiful tree grows by the river (heal)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: It bears twelve kinds of fruit every month (leaves)"
    ]
  },
  "trial": {
    "kjvRef": "John 18",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Trial (Pilate).",
      "We read about this in John 18.",
      "Jesus stays quiet—trust God!",
      "When things are unfair, He knows the truth!",
      "We learn from Jesus and how God cares for Pilate."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Numbers 13",
          "Esther 7",
          "Exodus 3:2",
          "John 18"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: John 18.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Paul",
          "David",
          "Holy Spirit"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "Jesus stays quiet—trust God! When things are unfair, He knows the truth!",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus stays quiet—trust God! When things are unfair, He knows the truth!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Jesus before Pilate",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Jesus stays quiet—trust God! When things are unfair, He knows the truth!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus stays quiet—trust God! When things are unfair, He knows the truth!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Trial (Pilate) with God's Word today.",
    "takeaway": "Jesus stays quiet—trust God! When things are unfair, He knows the truth!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Trial (Pilate). Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus before Pilate (pilate)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Pilate asks: Are you the King? (trial)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus stays quiet—trust God! (quiet)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus before Pilate (john 18)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Pilate asks: Are you the King? (matthew 27)"
    ]
  },
  "weddingWine": {
    "kjvRef": "John 2",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Water into Wine.",
      "We read about this in John 2.",
      "Jesus loves to help!",
      "When we bring Him our empty jars, He fills them.",
      "We learn from Jesus and how God cares for The wedding guests."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "John 2",
          "Matthew 3",
          "Exodus 14:21",
          "Exodus 32"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: John 2.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Stephen",
          "Jesus",
          "Paul",
          "God"
        ],
        "correctIndex": 1,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "The Bible is only pretend stories.",
          "God never hears when kids pray.",
          "Jesus loves to help! When we bring Him our empty jars, He fills them.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 2,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus loves to help! When we bring Him our empty jars, He fills them..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A wedding runs out of wine"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Jesus loves to help! When we bring Him our empty jars, He fills them.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus loves to help! When we bring Him our empty jars, He fills them..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Water into Wine with God's Word today.",
    "takeaway": "Jesus loves to help! When we bring Him our empty jars, He fills them.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Water into Wine. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A wedding runs out of wine (wedding)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary tells Jesus—He says: Fill the jars (wine)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Water becomes wine—the first miracle! (water)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A wedding runs out of wine (john 2)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Mary tells Jesus—He says: Fill the jars (miracle)"
    ]
  },
  "widowMite": {
    "kjvRef": "Mark 12",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Widow's Two Coins.",
      "We read about this in Mark 12.",
      "God sees generosity, not amount!",
      "Give from your heart—even a little is big to God.",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Galatians 5",
          "John 19",
          "Mark 12",
          "Job 2"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Mark 12.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Holy Spirit",
          "Paul",
          "David",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God sees generosity, not amount! Give from your heart—even a little is big to God.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God sees generosity, not amount! Give from your heart—even a little is big to God..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A spaceship landed in the parking lot.",
          "A talking toaster became king of the city.",
          "Rich people put lots of money in the treasury",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "God sees generosity, not amount! Give from your heart—even a little is big to God.",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God sees generosity, not amount! Give from your heart—even a little is big to God..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Widow's Two Coins with God's Word today.",
    "takeaway": "God sees generosity, not amount! Give from your heart—even a little is big to God.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Widow's Two Coins. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rich people put lots of money in the treasury (widow)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A poor widow puts in two tiny coins (mite)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: she gave the most—she gave all! (coins)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rich people put lots of money in the treasury (mark 12)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A poor widow puts in two tiny coins (offering)"
    ]
  },
  "widowOil": {
    "kjvRef": "the Bible",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "The Widow's Endless Oil.",
      "We read about this in the Bible.",
      "God's supply never runs out!",
      "Bring what little you have—He multiplies it.",
      "We learn from God and how God cares for The widow through Elisha."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Genesis 41:41",
          "the Bible",
          "2 Kings 2",
          "Revelation 21"
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: the Bible.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Paul",
          "God",
          "Stephen"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: God.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up.",
          "God's supply never runs out! Bring what little you have—He multiplies it."
        ],
        "correctIndex": 3,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God's supply never runs out! Bring what little you have—He multiplies it..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A widow owes money—only a little oil left",
          "A talking toaster became king of the city.",
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot."
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Never say sorry when we do wrong.",
          "God's supply never runs out! Bring what little you have—He multiplies it.",
          "Ignore God until we are older.",
          "Only be kind to people who are exactly like us."
        ],
        "correctIndex": 1,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God's supply never runs out! Bring what little you have—He multiplies it..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading The Widow's Endless Oil with God's Word today.",
    "takeaway": "God's supply never runs out! Bring what little you have—He multiplies it.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in The Widow's Endless Oil. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A widow owes money—only a little oil left (widow)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elisha says: pour into every jar you can find (oil)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Oil fills every jar—God provides more than enough! (elisha)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: A widow owes money—only a little oil left (2 kings 4)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Elisha says: pour into every jar you can find (jars)"
    ]
  },
  "widowsMite": {
    "kjvRef": "Mark 12",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Widow's Mite.",
      "We read about this in Mark 12.",
      "Small gifts matter—God sees!",
      "Give what you have from the heart!",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Exodus 3",
          "Exodus 20:1-17",
          "Genesis 41",
          "Mark 12"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Mark 12.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Jesus",
          "Paul",
          "God",
          "David"
        ],
        "correctIndex": 0,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "We should hide from God when we mess up.",
          "Small gifts matter—God sees! Give what you have from the heart!",
          "God never hears when kids pray.",
          "The Bible is only pretend stories."
        ],
        "correctIndex": 1,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Small gifts matter—God sees! Give what you have from the heart!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A spaceship landed in the parking lot.",
          "Rich people give big gifts",
          "A talking toaster became king of the city."
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Ignore God until we are older.",
          "Never say sorry when we do wrong.",
          "Only be kind to people who are exactly like us.",
          "Small gifts matter—God sees! Give what you have from the heart!"
        ],
        "correctIndex": 3,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Small gifts matter—God sees! Give what you have from the heart!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Widow's Mite with God's Word today.",
    "takeaway": "Small gifts matter—God sees! Give what you have from the heart!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Widow's Mite. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rich people give big gifts (widow)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Widow gives two small coins (mite)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: she gave more! (coins)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Rich people give big gifts (mark 12)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Widow gives two small coins (luke 21)"
    ]
  },
  "worryBirds": {
    "kjvRef": "Matthew 6",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Don't Worry—Look at the Birds.",
      "We read about this in Matthew 6.",
      "God feeds the birds—He definitely takes care of you!",
      "Don't worry; trust.",
      "We learn from Jesus and how God cares for His disciples."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "Matthew 6",
          "Acts 5",
          "Exodus 20:1-17",
          "Exodus 2:5"
        ],
        "correctIndex": 0,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Matthew 6.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "Holy Spirit",
          "Paul",
          "Jesus",
          "David"
        ],
        "correctIndex": 2,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "God feeds the birds—He definitely takes care of you! Don't worry; trust.",
          "God never hears when kids pray.",
          "The Bible is only pretend stories.",
          "We should hide from God when we mess up."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: God feeds the birds—He definitely takes care of you! Don't worry; trust..)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "Everyone decided to never sleep again.",
          "A talking toaster became king of the city.",
          "A spaceship landed in the parking lot.",
          "Birds fly freely—they don't worry"
        ],
        "correctIndex": 3,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "God feeds the birds—He definitely takes care of you! Don't worry; trust.",
          "Only be kind to people who are exactly like us.",
          "Never say sorry when we do wrong.",
          "Ignore God until we are older."
        ],
        "correctIndex": 0,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: God feeds the birds—He definitely takes care of you! Don't worry; trust..)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Don't Worry—Look at the Birds with God's Word today.",
    "takeaway": "God feeds the birds—He definitely takes care of you! Don't worry; trust.",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Don't Worry—Look at the Birds. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Birds fly freely—they don't worry (worry)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Lilies grow without stress—God clothes them (birds)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: You are worth more—God takes care of you! (lilies)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Birds fly freely—they don't worry (matthew 6)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Lilies grow without stress—God clothes them (sparrows)"
    ]
  },
  "zacchaeus": {
    "kjvRef": "Luke 19",
    "hintAboveQuiz": "Use the comic pictures above while you read.",
    "paragraphs": [
      "Zacchaeus.",
      "We read about this in Luke 19.",
      "Jesus sees you—even if you're small!",
      "He knows your name and wants to be your friend!",
      "We learn from Jesus and how God cares for Zacchaeus."
    ],
    "quizHeading": "Quiz — think it through",
    "questions": [
      {
        "question": "Where is this story found in the Bible?",
        "choices": [
          "John 9",
          "1 Samuel 16",
          "Luke 19",
          "Genesis 37:3"
        ],
        "correctIndex": 2,
        "correctFeedback": "Yes—that matches this story's place in God's Word.",
        "wrongFeedback": "Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: Luke 19.)"
      },
      {
        "question": "Who do we mainly learn from or watch in this story?",
        "choices": [
          "God",
          "The crowds",
          "Stephen",
          "Jesus"
        ],
        "correctIndex": 3,
        "correctFeedback": "Right—keep that person (or group) in mind as you think about God.",
        "wrongFeedback": "Look for who the story follows first—names in the title often help. (Answer: Jesus.)"
      },
      {
        "question": "Which choice sounds most like what this story teaches?",
        "choices": [
          "Jesus sees you—even if you're small! He knows your name and wants to be your friend!",
          "We should hide from God when we mess up.",
          "The Bible is only pretend stories.",
          "God never hears when kids pray."
        ],
        "correctIndex": 0,
        "correctFeedback": "Exactly—that lines up with the story and the “For you” heart of it.",
        "wrongFeedback": "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: Jesus sees you—even if you're small! He knows your name and wants to be your friend!.)"
      },
      {
        "question": "Which detail belongs in this Bible story (not a silly made-up one)?",
        "choices": [
          "A talking toaster became king of the city.",
          "Zacchaeus climbs a tree to see",
          "A spaceship landed in the parking lot.",
          "Everyone decided to never sleep again."
        ],
        "correctIndex": 1,
        "correctFeedback": "Yes—that detail comes from the story God gave us.",
        "wrongFeedback": "Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)"
      },
      {
        "question": "What is one good way to respond to God after this story?",
        "choices": [
          "Only be kind to people who are exactly like us.",
          "Ignore God until we are older.",
          "Jesus sees you—even if you're small! He knows your name and wants to be your friend!",
          "Never say sorry when we do wrong."
        ],
        "correctIndex": 2,
        "correctFeedback": "Beautiful—that is faith with feet: small, real, and pleasing to God.",
        "wrongFeedback": "Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: Jesus sees you—even if you're small! He knows your name and wants to be your friend!.)"
      }
    ],
    "doneHeading": "You did it!",
    "doneMessage": "Great job reading Zacchaeus with God's Word today.",
    "takeaway": "Jesus sees you—even if you're small! He knows your name and wants to be your friend!",
    "prayer": "God, thank You for the Bible. Help me remember what You showed me in Zacchaeus. Amen.",
    "imagePrompts": [
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Zacchaeus climbs a tree to see (zacchaeus)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus looks up and sees him (tree)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus says: I'm coming to your house! (short)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Zacchaeus climbs a tree to see (jesus calls)",
      "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: Jesus looks up and sees him (luke 19)"
    ]
  }
};
})(typeof window !== 'undefined' ? window : this);
