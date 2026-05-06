'use strict';

/**
 * Handcrafted read-along + quiz for David & Goliath (keys `david` + `davidGoliath`).
 * Read-along: KJV 1 Samuel 17:1-11, 32-50 only (stops before v51 for a gentle tap-through).
 * Merged by scripts/generate-kids-read-quiz-data.mjs — edit here, not only in kids-read-quiz-data.js.
 */
module.exports = {
  kjvRef: '1 Samuel 17:1-11, 32-50 (KJV)',
  verseExcerpt:
    'Thou comest to me with a sword, and with a spear, and with a shield: but I come to thee in the name of the LORD of hosts, the God of the armies of Israel, whom thou hast defied. — 1 Samuel 17:45 (KJV)',
  readAlongTitle: 'Read along',
  /** Shown under wrong-answer hints in the story quiz (kids-corner.js). */
  quizWrongHumilityHint: "David couldn't win that fight alone—and neither can we. God could.",
  hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
  readAlongSections: [
    {
      text:
        'Now the Philistines gathered together their armies to battle, and were gathered together at Shochoh, which belongeth to Judah, and pitched between Shochoh and Azekah, in Ephesdammim. And Saul and the men of Israel were gathered together, and pitched by the valley of Elah, and set the battle in array against the Philistines. And the Philistines stood on a mountain on the one side, and Israel stood on a mountain on the other side: and there was a valley between them. And there went out a champion out of the camp of the Philistines, named Goliath, of Gath, whose height was six cubits and a span.',
      caption: 'Armies in the valley — Goliath comes out',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'And he had an helmet of brass upon his head, and he was armed with a coat of mail; and the weight of the coat was five thousand shekels of brass. And he had greaves of brass upon his legs, and a target of brass between his shoulders. And the staff of his spear was like a weaver\'s beam; and his spear\'s head weighed six hundred shekels of iron: and one bearing a shield went before him. And he stood and cried unto the armies of Israel, and said unto them, Why are ye come out to set your battle in array? am not I a Philistine, and ye servants to Saul? choose you a man for you, and let him come down to me. If he be able to fight with me, and to kill me, then will we be your servants: but if I prevail against him, and kill him, then shall ye be our servants, and serve us. And the Philistine said, I defy the armies of Israel this day; give me a man, that we may fight together. When Saul and all Israel heard those words of the Philistine, they were dismayed, and greatly afraid.',
      caption: 'Goliath\'s challenge — all Israel afraid',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'And David said to Saul, Let no man\'s heart fail because of him; thy servant will go and fight with this Philistine. And Saul said to David, Thou art not able to go against this Philistine to fight with him: for thou art but a youth, and he a man of war from his youth. And David said unto Saul, Thy servant kept his father\'s sheep, and there came a lion, and a bear, and took a lamb out of the flock: And I went out after him, and smote him, and delivered it out of his mouth: and when he arose against me, I caught him by his beard, and smote him, and slew him. Thy servant slew both the lion and the bear: and this uncircumcised Philistine shall be as one of them, seeing he hath defied the armies of the living God. David said moreover, The LORD that delivered me out of the paw of the lion, and out of the paw of the bear, he will deliver me out of the hand of this Philistine. And Saul said unto David, Go, and the LORD be with thee.',
      caption: 'David — thy servant will go; the living God',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'And Saul armed David with his armour, and he put an helmet of brass upon his head; also he armed him with a coat of mail. And David girded his sword upon his armour, and he assayed to go; for he had not proved it. And David said unto Saul, I cannot go with these; for I have not proved them. And David put them off him. And he took his staff in his hand, and chose him five smooth stones out of the brook, and put them in a shepherd\'s bag which he had, even in a scrip; and his sling was in his hand: and he drew near to the Philistine. And the Philistine came on and drew near unto David; and the man that bare the shield went before him. And when the Philistine looked about, and saw David, he disdained him: for he was but a youth, and ruddy, and of a fair countenance. And the Philistine said unto David, Am I a dog, that thou comest to me with staves? And the Philistine cursed David by his gods. And the Philistine said to David, Come to me, and I will give thy flesh unto the fowls of the air, and to the beasts of the field.',
      caption: 'Five smooth stones — drawing near',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'Then said David to the Philistine, Thou comest to me with a sword, and with a spear, and with a shield: but I come to thee in the name of the LORD of hosts, the God of the armies of Israel, whom thou hast defied. This day will the LORD deliver thee into mine hand; and I will smite thee, and take thine head from thee; and I will give the carcases of the host of the Philistines this day unto the fowls of the air, and to the wild beasts of the earth; that all the earth may know that there is a God in Israel. And all this assembly shall know that the LORD saveth not with sword and spear: for the battle is the LORD\'s, and he will give you into our hands. And it came to pass, when the Philistine arose, and came, and drew nigh to meet David, that David hastened, and ran toward the army to meet the Philistine. And David put his hand in his bag, and took thence a stone, and slang it, and smote the Philistine in his forehead, that the stone sunk into his forehead; and he fell upon his face to the earth. So David prevailed over the Philistine with a sling and with a stone, and smote the Philistine, and slew him; but there was no sword in the hand of David.',
      caption: 'In the name of the LORD — the stone; no sword in David\'s hand',
      image: 'panel-david-3.svg'
    }
  ],
  paragraphs: [
    'The Philistines gathered their armies to fight against Israel. Their champion was a giant named Goliath who was over nine feet tall. Every day for forty days he stood and shouted, "Choose you a man, and let him come down to me. If he be able to fight with me, and to kill me, then will we be your servants: but if I prevail against him, and kill him, then shall ye be our servants."',
    'All the men of Israel were afraid.',
    'David, a young shepherd boy, came to the camp with food for his brothers. He heard Goliath\'s words and asked, "Who is this uncircumcised Philistine, that he should defy the armies of the living God?"',
    'David said to King Saul, "Let no man\'s heart fail because of him; thy servant will go and fight with this Philistine."',
    'Saul tried to put his own armor on David, but David took it off. He took his staff, five smooth stones from the brook, and his sling.',
    'David ran toward Goliath and said, "Thou comest to me with a sword, and with a spear, and with a shield: but I come to thee in the name of the Lord of hosts… This day will the Lord deliver thee into mine hand."',
    'David put a stone in his sling, and slung it, and smote the Philistine in his forehead. The stone sank into his forehead, and he fell upon his face to the earth.',
    'So David prevailed with a sling and a stone, and there was no sword in the hand of David. The Lord gave David the victory that day because David trusted in the name of the Lord.',
    'The Bible goes on to tell how David finished the giant that day; the important heart-lesson is this: the battle was the Lord\'s.',
    'For you: Real courage is trusting God — He is with you when trouble feels huge.'
  ],
  quizHeading: 'Quiz — think it through',
  questions: [
    {
      question: 'Who was the Philistine champion who defied Israel?',
      choices: ['Goliath', 'David', 'King Saul', 'Samuel'],
      correctIndex: 0,
      correctFeedback: 'Yes — and God was greater still.',
      wrongFeedback: 'Think of the very tall man from Gath. (Answer: Goliath.)'
    },
    {
      question: 'How did Israel\'s army feel when they heard Goliath?',
      choices: ['They were glad.', 'They were dismayed, and greatly afraid.', 'They sang.', 'They went home.'],
      correctIndex: 1,
      correctFeedback: 'Honest — and God still had a plan.',
      wrongFeedback: 'Listen for afraid. (Answer: …greatly afraid….)'
    },
    {
      question: 'What did David take besides his sling?',
      choices: ['Ten heavy stones.', 'Five smooth stones from the brook.', 'A chariot.', 'Nothing.'],
      correctIndex: 1,
      correctFeedback: 'Simple tools — big trust in God.',
      wrongFeedback: 'Think brook. (Answer: Five smooth stones….)'
    },
    {
      question: 'How did David say he came to the giant?',
      choices: [
        'In his own pride.',
        'In the name of the LORD of hosts, the God of the armies of Israel.',
        'To run away.',
        'Without speaking.'
      ],
      correctIndex: 1,
      correctFeedback: 'Beautiful — God\'s name first.',
      wrongFeedback: 'Listen for LORD of hosts. (Answer: In the name of the LORD….)'
    },
    {
      question: 'How did David prevail over the Philistine?',
      choices: [
        'With Saul\'s sword in his hand.',
        'With a sling and a stone — no sword in David\'s hand.',
        'The story does not say.',
        'He did not fight.'
      ],
      correctIndex: 1,
      correctFeedback: 'The Lord gave the victory.',
      wrongFeedback: 'Listen for sling. (Answer: …with a sling and with a stone….)'
    }
  ],
  doneHeading: 'You did it!',
  doneMessage: 'Great job reading David and Goliath with God\'s Word today.',
  takeaway:
    'David trusted the living God — the battle was the LORD\'s — and He gave the victory.',
  prayer:
    'Lord, when we feel small or afraid, help us trust You like David. Thank You that the battle is Yours. Amen.',
  imagePrompts: [
    'Simple peaceful black-and-white line-art young children bold thick outlines large open spaces young David standing bravely calmly sling in hand five smooth stones at feet giant Goliath distant smaller spear shield far away not scary David face looks up trusting heaven soft hills sky background courageous faithful mood no blood minimal white space ages 3-8 coloring page',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Living God armies (1 sam 17)',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Five smooth stones sling',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Name of the LORD of hosts',
    'Hand-drawn bouncy cartoon kids KJV mood soft blues gold friendly not scary no text Sling and stone victory'
  ]
};
