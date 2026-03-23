'use strict';

/**
 * Handcrafted read-along + quiz for David & Goliath (keys `david` + `davidGoliath`).
 * Merged by scripts/generate-kids-read-quiz-data.mjs — edit here, not only in kids-read-quiz-data.js.
 */
module.exports = {
  kjvRef: '1 Samuel 17:45–50',
  verseExcerpt:
    'Thou comest to me with a sword, and with a spear, and with a shield: but I come to thee in the name of the Lord of hosts, the God of the armies of Israel, whom thou hast defied. — 1 Samuel 17:45 (KJV)',
  readAlongTitle: 'Read along',
  /** Shown under wrong-answer hints in the story quiz (kids-corner.js). */
  quizWrongHumilityHint: "David couldn't win that fight alone—and neither can we. God could.",
  hintAboveQuiz: 'Use the pictures and captions as you read.',
  readAlongSections: [
    {
      text:
        "The giant Goliath was huge and loud. Day after day he made fun of God's people and dared someone to fight him. God's army was afraid—but God was still on Israel's side.",
      caption: "Panel 1: Goliath mocks God's army",
      image: 'panel-david-1.svg'
    },
    {
      text:
        'Little David was not a soldier yet. He was a shepherd boy who loved God and watched sheep. When David heard Goliath, he did not want God\'s name to be laughed at.',
      caption: 'Panel 2: David, a faithful shepherd',
      image: 'panel-david-1.svg'
    },
    {
      text:
        'David trusted God more than a shiny sword. He picked up his sling and five smooth stones. He told Goliath he came in the Lord\'s name—not in his own strength.',
      caption: 'Panel 3: David with sling and stones',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'David ran toward the giant. He swung his sling once. The stone flew straight—and struck the giant. The Lord used one brave boy who believed Him.',
      caption: 'Panel 4: The stone flies',
      image: 'panel-david-2.svg'
    },
    {
      text:
        'Goliath fell. God gave the victory. The scary bully did not win—faith in God did. That day everyone saw that the Lord saves His people.',
      caption: 'Panel 5: God gives the victory',
      image: 'panel-david-3.svg'
    },
    {
      text:
        'For you: Sometimes your "giant" feels like fear, worry, or a hard person. Remember David—God is bigger than any giant. You can trust Him and take the next brave step with Him.',
      caption: 'Panel 6: God is bigger than any giant',
      image: 'panel-david-3.svg'
    }
  ],
  paragraphs: [
    "The giant Goliath was huge and loud. Day after day he made fun of God's people and dared someone to fight him. God's army was afraid—but God was still on Israel's side.",
    'Little David was not a soldier yet. He was a shepherd boy who loved God and watched sheep. When David heard Goliath, he did not want God\'s name to be laughed at.',
    'David trusted God more than a shiny sword. He picked up his sling and five smooth stones. He told Goliath he came in the Lord\'s name—not in his own strength.',
    'David ran toward the giant. He swung his sling once. The stone flew straight—and struck the giant. The Lord used one brave boy who believed Him.',
    'Goliath fell. God gave the victory. The scary bully did not win—faith in God did. That day everyone saw that the Lord saves His people.',
    'For you: Sometimes your "giant" feels like fear, worry, or a hard person. Remember David—God is bigger than any giant. You can trust Him and take the next brave step with Him.'
  ],
  quizHeading: "Now let's see what you remember!",
  questions: [
    {
      question: "Who was the giant that made fun of God's army?",
      choices: ['Goliath', 'David', 'King Saul', 'Sheep'],
      correctIndex: 0,
      correctFeedback: 'Yes! Goliath was the big bully—but God was with David. ⭐',
      wrongFeedback: "Not quite—think about who was very tall and kept shouting at Israel's army."
    },
    {
      question: 'What did David use when he went out to meet the giant?',
      choices: ['Only a metal sword', 'A sling and stones', 'A fishing net', 'A chariot'],
      correctIndex: 1,
      correctFeedback: 'Yes! Great job! ⭐ God helped David be brave with what he had.',
      wrongFeedback: 'Close! Remember what David picked up from the brook and swung toward the giant.'
    },
    {
      question: 'Why could David be brave?',
      choices: [
        'He forgot about God',
        'He trusted the Lord and came in God\'s name',
        'He wanted to show off',
        'He thought he was bigger than everyone'
      ],
      correctIndex: 1,
      correctFeedback: "That's it—David's strength was God's strength.",
      wrongFeedback: 'Think about what David said about the Lord of hosts—the God of Israel\'s armies.'
    },
    {
      question: 'What happened when the stone hit Goliath?',
      choices: [
        'Goliath ran away',
        'The giant fell—God gave the victory',
        'Nothing happened',
        'David dropped his sling'
      ],
      correctIndex: 1,
      correctFeedback: 'Right—the Lord won that battle.',
      wrongFeedback: 'Picture the last panels: who fell, and who got the victory?'
    },
    {
      question: 'What can we remember when we feel scared?',
      choices: [
        'God is bigger than any giant',
        'We should hide from God',
        'Scary things always win',
        'Prayer does not matter'
      ],
      correctIndex: 0,
      correctFeedback: 'Beautiful—hold onto that truth today.',
      wrongFeedback: 'Remember the "for you" part: who is bigger than fear or a hard day?'
    }
  ],
  doneHeading: 'You did awesome!',
  doneMessage: 'You did awesome! God is bigger than any giant.',
  takeaway: 'David was small, but he trusted the living God. When trouble feels huge, remember: the Lord is with you.',
  prayer: "God, thank You for the Bible. When I feel scared, help me trust You like David. In Jesus' name, amen.",
  imagePrompts: [
    'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David as shepherd boy – Small but faithful (david)',
    'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David faces Goliath – God is bigger than any giant (goliath)',
    "Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David wins with God's help – One stone, one faith (brave)",
    'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David as shepherd boy – Small but faithful (battle)',
    'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: David faces Goliath – God is bigger than any giant (shepherd)'
  ]
};
