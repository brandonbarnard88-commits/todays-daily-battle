/**
 * KJV heritage tree — main line of promise + gentle side branches.
 * Consumed by one-family-tree.js on one-family-in-christ.html
 */
(function (global) {
  'use strict';

  function v(ref, text) {
    return { ref: ref, text: text };
  }

  var MAIN_LINE = [
    {
      id: 'god',
      name: 'God',
      relation: 'Creator and Father',
      era: 'In the beginning',
      verses: [
        v('Genesis 1:1', 'In the beginning God created the heaven and the earth.'),
        v('Genesis 1:27', 'So God created man in his own image, in the image of God created he him; male and female created he them.')
      ],
      note: 'Every family line begins here — in Him we live and move and have our being.'
    },
    {
      id: 'adam',
      name: 'Adam',
      relation: 'First man — son of God (by creation)',
      era: 'Eden',
      parentId: 'god',
      verses: [
        v('Genesis 2:7', 'And the LORD God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul.'),
        v('Luke 3:38', '…Adam, which was the son of God.')
      ],
      note: 'Humanity begins in breath and nearness to God.'
    },
    {
      id: 'eve',
      name: 'Eve',
      relation: 'Mother of all living — from Adam',
      era: 'Eden',
      spouseOf: 'adam',
      verses: [
        v('Genesis 2:21-22', 'And the LORD God caused a deep sleep to fall upon Adam, and he slept: and he took one of his ribs, and closed up the flesh instead thereof; And the rib, which the LORD God had taken from man, made he a woman, and brought her unto the man.'),
        v('Genesis 3:20', 'And Adam called his wife\'s name Eve; because she was the mother of all living.')
      ],
      note: 'She stands beside Adam — the story of humanity is never only one person alone.'
    },
    {
      id: 'seth',
      name: 'Seth',
      relation: 'Son of Adam',
      era: 'After Eden',
      parentId: 'adam',
      verses: [v('Genesis 5:3', 'And Adam lived an hundred and thirty years, and begat a son in his own likeness, after his image; and called his name Seth:')],
      note: 'Through Seth the line of faith continues when the world grows harsh.'
    },
    { id: 'enos', name: 'Enos', relation: 'Son of Seth', parentId: 'seth', verses: [v('Genesis 5:6', 'And Seth lived an hundred and five years, and begat Enos:')] },
    { id: 'cainan', name: 'Cainan', relation: 'Son of Enos', parentId: 'enos', verses: [v('Genesis 5:9', 'And Enos lived ninety years, and begat Cainan:')] },
    { id: 'mahalaleel', name: 'Mahalaleel', relation: 'Son of Cainan', parentId: 'cainan', verses: [v('Genesis 5:12', 'And Cainan lived seventy years, and begat Mahalaleel:')] },
    { id: 'jared', name: 'Jared', relation: 'Son of Mahalaleel', parentId: 'mahalaleel', verses: [v('Genesis 5:15', 'And Mahalaleel lived sixty and five years, and begat Jared:')] },
    {
      id: 'enoch',
      name: 'Enoch',
      relation: 'Son of Jared',
      parentId: 'jared',
      verses: [v('Genesis 5:22-24', 'And Enoch walked with God after he begat Methuselah three hundred years… And Enoch walked with God: and he was not; for God took him.')],
      note: 'He walked with God — a quiet picture of belonging in the long list of names.'
    },
    { id: 'methuselah', name: 'Methuselah', relation: 'Son of Enoch', parentId: 'enoch', verses: [v('Genesis 5:25', 'And Enoch lived sixty and five years, and begat Methuselah:')] },
    { id: 'lamech', name: 'Lamech', relation: 'Son of Methuselah', parentId: 'methuselah', verses: [v('Genesis 5:28', 'And Methuselah lived an hundred eighty and seven years, and begat Lamech:')] },
    {
      id: 'noah',
      name: 'Noah',
      relation: 'Son of Lamech',
      parentId: 'lamech',
      verses: [
        v('Genesis 6:8', 'But Noah found grace in the eyes of the LORD.'),
        v('Genesis 7:1', 'And the LORD said unto Noah, Come thou and all thy house into the ark; for thee have I seen righteous before me in this generation.')
      ],
      note: 'One household preserved — judgment and mercy in the same story.'
    },
    { id: 'shem', name: 'Shem', relation: 'Son of Noah', parentId: 'noah', verses: [v('Genesis 5:32', '…Noah was five hundred years old: and Noah begat Shem, Ham, and Japheth.')] },
    { id: 'arphaxad', name: 'Arphaxad', relation: 'Son of Shem', parentId: 'shem', verses: [v('Genesis 11:10', 'These are the generations of Shem: Shem was an hundred years old, and begat Arphaxad two years after the flood:')] },
    { id: 'salah', name: 'Salah', relation: 'Son of Arphaxad', parentId: 'arphaxad', verses: [v('Genesis 11:12', 'And Arphaxad lived five and thirty years, and begat Salah:')] },
    { id: 'eber', name: 'Eber', relation: 'Son of Salah', parentId: 'salah', verses: [v('Genesis 11:14', 'And Salah lived thirty years, and begat Eber:')] },
    { id: 'peleg', name: 'Peleg', relation: 'Son of Eber', parentId: 'eber', verses: [v('Genesis 11:16', 'And Eber lived four and thirty years, and begat Peleg:')] },
    { id: 'reu', name: 'Reu', relation: 'Son of Peleg', parentId: 'peleg', verses: [v('Genesis 11:18', 'And Peleg lived thirty years, and begat Reu:')] },
    { id: 'serug', name: 'Serug', relation: 'Son of Reu', parentId: 'reu', verses: [v('Genesis 11:20', 'And Reu lived two and thirty years, and begat Serug:')] },
    { id: 'nahor', name: 'Nahor', relation: 'Son of Serug', parentId: 'serug', verses: [v('Genesis 11:22', 'And Serug lived thirty years, and begat Nahor:')] },
    { id: 'terah', name: 'Terah', relation: 'Son of Nahor', parentId: 'nahor', verses: [v('Genesis 11:24', 'And Nahor lived nine and twenty years, and begat Terah:')] },
    {
      id: 'abraham',
      name: 'Abraham',
      relation: 'Son of Terah — father of the promise',
      era: 'Patriarchs',
      parentId: 'terah',
      verses: [
        v('Genesis 12:1-2', 'Now the LORD had said unto Abram, Get thee out of thy country… and I will make of thee a great nation, and I will bless thee, and make thy name great; and thou shalt be a blessing:'),
        v('Genesis 17:5', 'Neither shall thy name any more be called Abram, but thy name shall be Abraham; for a father of many nations have I made thee.')
      ],
      note: 'The covenant narrows onto one family line — and through it, every nation will be blessed.'
    },
    {
      id: 'isaac',
      name: 'Isaac',
      relation: 'Son of Abraham and Sarah',
      parentId: 'abraham',
      verses: [v('Genesis 21:12', '…in Isaac shall thy seed be called.')],
      note: 'The child of promise — laughter after waiting.'
    },
    {
      id: 'jacob',
      name: 'Jacob',
      relation: 'Son of Isaac — Israel',
      parentId: 'isaac',
      verses: [v('Genesis 32:28', 'And he said, Thy name shall be called no more Jacob, but Israel: for as a prince hast thou power with God and with men, and hast prevailed.')],
      note: 'Renamed Israel — twelve tribes grow from his sons; Judah carries the royal line.'
    },
    {
      id: 'judah',
      name: 'Judah',
      relation: 'Son of Jacob',
      parentId: 'jacob',
      verses: [v('Genesis 49:10', 'The sceptre shall not depart from Judah, nor a lawgiver from between his feet, until Shiloh come; and unto him shall the gathering of the people be.')],
      note: 'From Judah kings and Messiah will come.'
    },
    {
      id: 'phares',
      name: 'Phares',
      relation: 'Son of Judah (of Tamar)',
      parentId: 'judah',
      verses: [v('Matthew 1:3', 'And Judas begat Phares and Zara of Thamar;')],
      note: 'God writes redemption into a messy family story.'
    },
    { id: 'esrom', name: 'Esrom', relation: 'Son of Phares', parentId: 'phares', verses: [v('Matthew 1:3', '…and Phares begat Esrom;')] },
    { id: 'aram', name: 'Aram', relation: 'Son of Esrom', parentId: 'esrom', verses: [v('Matthew 1:3-4', '…and Esrom begat Aram; And Aram begat Aminadab;')] },
    { id: 'aminadab', name: 'Aminadab', relation: 'Son of Aram', parentId: 'aram', verses: [v('Matthew 1:4', 'And Aram begat Aminadab;')] },
    { id: 'naasson', name: 'Naasson', relation: 'Son of Aminadab', parentId: 'aminadab', verses: [v('Matthew 1:4', '…and Aminadab begat Naasson;')] },
    {
      id: 'salmon',
      name: 'Salmon',
      relation: 'Son of Naasson',
      parentId: 'naasson',
      verses: [v('Matthew 1:5', 'And Salmon begat Booz of Rachab;')],
      note: 'Rahab the Gentile enters the line here — see the branch below.'
    },
    {
      id: 'boaz',
      name: 'Boaz',
      relation: 'Son of Salmon (of Rahab)',
      parentId: 'salmon',
      verses: [v('Matthew 1:5', 'And Salmon begat Booz of Rachab; and Booz begat Obed of Ruth;')],
      note: 'Ruth the Moabitess is grafted in — welcome at the table of promise.'
    },
    {
      id: 'obed',
      name: 'Obed',
      relation: 'Son of Boaz (of Ruth)',
      parentId: 'boaz',
      verses: [v('Ruth 4:17', '…and they called his name Obed: he is the father of Jesse, the father of David.')]
    },
    {
      id: 'jesse',
      name: 'Jesse',
      relation: 'Son of Obed',
      parentId: 'obed',
      verses: [v('1 Samuel 16:1', '…for I have provided me a king among his sons.')]
    },
    {
      id: 'david',
      name: 'David',
      relation: 'Son of Jesse — king',
      era: 'Kings of Judah',
      parentId: 'jesse',
      verses: [
        v('1 Samuel 16:13', '…and the Spirit of the LORD came upon David from that day forward.'),
        v('Matthew 1:1', 'The book of the generation of Jesus Christ, the son of David, the son of Abraham.')
      ],
      note: 'Shepherd, psalmist, king — the promise takes a crown.'
    },
    { id: 'solomon', name: 'Solomon', relation: 'Son of David', parentId: 'david', verses: [v('Matthew 1:6', 'And Jesse begat David the king; and David the king begat Solomon of her that had been the wife of Urias;')] },
    { id: 'roboam', name: 'Roboam', relation: 'Son of Solomon', parentId: 'solomon', verses: [v('Matthew 1:7', 'And Solomon begat Roboam;')] },
    { id: 'abia', name: 'Abia', relation: 'Son of Roboam', parentId: 'roboam', verses: [v('Matthew 1:7', '…and Roboam begat Abia;')] },
    { id: 'asa', name: 'Asa', relation: 'Son of Abia', parentId: 'abia', verses: [v('Matthew 1:7-8', '…and Abia begat Asa;')] },
    { id: 'josaphat', name: 'Josaphat', relation: 'Son of Asa', parentId: 'asa', verses: [v('Matthew 1:8', '…and Asa begat Josaphat;')] },
    { id: 'joram', name: 'Joram', relation: 'Son of Josaphat', parentId: 'josaphat', verses: [v('Matthew 1:8', '…and Josaphat begat Joram;')] },
    { id: 'ozias', name: 'Ozias', relation: 'Son of Joram', parentId: 'joram', verses: [v('Matthew 1:8-9', '…and Joram begat Ozias;')] },
    { id: 'joatham', name: 'Joatham', relation: 'Son of Ozias', parentId: 'ozias', verses: [v('Matthew 1:9', '…and Ozias begat Joatham;')] },
    { id: 'achaz', name: 'Achaz', relation: 'Son of Joatham', parentId: 'joatham', verses: [v('Matthew 1:9', '…and Joatham begat Achaz;')] },
    { id: 'ezekias', name: 'Ezekias', relation: 'Son of Achaz', parentId: 'achaz', verses: [v('Matthew 1:9-10', '…and Achaz begat Ezekias;')] },
    { id: 'manasses', name: 'Manasses', relation: 'Son of Ezekias', parentId: 'ezekias', verses: [v('Matthew 1:10', '…and Ezekias begat Manasses;')] },
    { id: 'amon', name: 'Amon', relation: 'Son of Manasses', parentId: 'manasses', verses: [v('Matthew 1:10', '…and Manasses begat Amon;')] },
    { id: 'josias', name: 'Josias', relation: 'Son of Amon', parentId: 'amon', verses: [v('Matthew 1:10', '…and Amon begat Josias;')] },
    {
      id: 'jechonias',
      name: 'Jechonias',
      relation: 'Son of Josias — exile',
      parentId: 'josias',
      verses: [v('Matthew 1:11', 'And Josias begat Jechonias and his brethren, about the time they were carried away to Babylon:')],
      note: 'The line walks through exile — God does not forget His people in captivity.'
    },
    { id: 'salathiel', name: 'Salathiel', relation: 'Son of Jechonias', parentId: 'jechonias', verses: [v('Matthew 1:12', 'And after they were brought to Babylon, Jechonias begat Salathiel;')] },
    { id: 'zorobabel', name: 'Zorobabel', relation: 'Son of Salathiel', parentId: 'salathiel', verses: [v('Matthew 1:12', '…and Salathiel begat Zorobabel;')] },
    { id: 'abiud', name: 'Abiud', relation: 'Son of Zorobabel', parentId: 'zorobabel', verses: [v('Matthew 1:13', 'And Zorobabel begat Abiud;')] },
    { id: 'eliakim', name: 'Eliakim', relation: 'Son of Abiud', parentId: 'abiud', verses: [v('Matthew 1:13', '…and Abiud begat Eliakim;')] },
    { id: 'azor', name: 'Azor', relation: 'Son of Eliakim', parentId: 'eliakim', verses: [v('Matthew 1:13-14', '…and Eliakim begat Azor;')] },
    { id: 'sadoc', name: 'Sadoc', relation: 'Son of Azor', parentId: 'azor', verses: [v('Matthew 1:14', '…and Azor begat Sadoc;')] },
    { id: 'achim', name: 'Achim', relation: 'Son of Sadoc', parentId: 'sadoc', verses: [v('Matthew 1:14', '…and Sadoc begat Achim;')] },
    { id: 'eliud', name: 'Eliud', relation: 'Son of Achim', parentId: 'achim', verses: [v('Matthew 1:14-15', '…and Achim begat Eliud;')] },
    { id: 'eleazar', name: 'Eleazar', relation: 'Son of Eliud', parentId: 'eliud', verses: [v('Matthew 1:15', '…and Eliud begat Eleazar;')] },
    { id: 'matthan', name: 'Matthan', relation: 'Son of Eleazar', parentId: 'eleazar', verses: [v('Matthew 1:15', '…and Eleazar begat Matthan;')] },
    {
      id: 'jacob-father-joseph',
      name: 'Jacob',
      relation: 'Son of Matthan — father of Joseph',
      parentId: 'matthan',
      verses: [v('Matthew 1:15-16', '…and Matthan begat Jacob; And Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ.')]
    },
    {
      id: 'joseph',
      name: 'Joseph',
      relation: 'Husband of Mary — of the house of David',
      parentId: 'jacob-father-joseph',
      verses: [
        v('Matthew 1:16', 'And Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ.'),
        v('Luke 2:4', '…Joseph also went up from Galilee… unto the city of David, which is called Bethlehem; (because he was of the house and lineage of David:)')
      ],
      note: 'He guards the Christ-child — legal father in the line of David.'
    },
    {
      id: 'mary',
      name: 'Mary',
      relation: 'Mother of Jesus — by the Holy Ghost',
      spouseOf: 'joseph',
      verses: [
        v('Luke 1:31', 'And, behold, thou shalt conceive in thy womb, and bring forth a son, and shalt call his name JESUS.'),
        v('Luke 1:35', 'The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also that holy thing which shall be born of thee shall be called the Son of God.')
      ],
      note: 'The virgin birth — God Himself enters the family story.'
    },
    {
      id: 'jesus',
      name: 'Jesus Christ',
      relation: 'Son of David, Son of Abraham — Son of God',
      era: 'Fulfillment',
      parentId: 'mary',
      verses: [
        v('Matthew 1:1', 'The book of the generation of Jesus Christ, the son of David, the son of Abraham.'),
        v('Galatians 4:4-5', 'But when the fulness of the time was come, God sent forth his Son, made of a woman, made under the law, To redeem them that were under the law, that we might receive the adoption of sons.')
      ],
      note: 'The trunk of every promise — in Him the tree finds its meaning.'
    }
  ];

  var BRANCHES = [
    {
      id: 'rahab',
      name: 'Rahab',
      relation: 'Mother of Boaz in the line (by Salmon) — of Jericho',
      connectTo: 'salmon',
      verses: [
        v('Joshua 2:11', '…for the LORD your God, he is God in heaven above, and in earth beneath.'),
        v('Matthew 1:5', 'And Salmon begat Booz of Rachab;')
      ],
      note: 'A Gentile woman welcomed by faith — already in the family God was building toward Christ.'
    },
    {
      id: 'ruth',
      name: 'Ruth',
      relation: 'Wife of Boaz — the Moabitess',
      connectTo: 'boaz',
      verses: [
        v('Ruth 1:16', '…whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God:'),
        v('Matthew 1:5', '…and Booz begat Obed of Ruth;')
      ],
      note: 'Loyal love across borders — grafted into Israel and into Messiah\'s line.'
    },
    {
      id: 'tamar',
      name: 'Tamar',
      relation: 'Mother of Phares in the line — of Judah',
      connectTo: 'phares',
      verses: [v('Matthew 1:3', 'And Judas begat Phares and Zara of Thamar;')],
      note: 'God does not hide hard stories — He redeems them.'
    }
  ];

  var SECTIONS = [
    { id: 'intro', title: 'Gentle opening' },
    { id: 'beginning', title: 'The tree begins', startId: 'god', endId: 'eve' },
    { id: 'to-noah', title: 'Adam to Noah', startId: 'seth', endId: 'noah' },
    { id: 'to-abraham', title: 'Noah to Abraham', startId: 'shem', endId: 'abraham' },
    { id: 'to-david', title: 'Abraham to David', startId: 'isaac', endId: 'david' },
    { id: 'to-christ', title: 'David to Christ', startId: 'solomon', endId: 'jesus' },
    { id: 'branches', title: 'Gentle side branches' },
    { id: 'adoption', title: 'Our place in the family' }
  ];

  global.TDB_BIBLE_HERITAGE = {
    pageTitle: 'One Family in Christ',
    intro: {
      heading: 'One story, one family',
      paragraphs: [
        'God created humanity in His image. From the very beginning we were meant to live in family with Him.',
        'Scripture traces one main line of promise — from Adam through Abraham and David to Jesus Christ. Along the way, God again and again welcomes outsiders, survivors, and the overlooked into that same story.',
        'This page is a calm map of that line (KJV). Read slowly. You are not outside this tree — through Christ, God offers adoption into His household.'
      ]
    },
    sections: SECTIONS,
    mainLine: MAIN_LINE,
    branches: BRANCHES,
    adoption: {
      heading: 'Grafted in by grace',
      paragraphs: [
        'The long list of names is not only history. It points to One Person — and to every person He calls near.',
        'If you belong to Christ, you are not a stranger at the edge of the story. You are a child of God.'
      ],
      verses: [
        v('Romans 8:14-15', 'For as many as are led by the Spirit of God, they are the sons of God. For ye have not received the spirit of bondage again to fear; but ye have received the Spirit of adoption, whereby we cry, Abba, Father.'),
        v('Romans 8:17', 'And if children, then heirs; heirs of God, and joint-heirs with Christ…'),
        v('Ephesians 1:5', 'Having predestinated us unto the adoption of children by Jesus Christ to himself, according to the good pleasure of his will,'),
        v('Galatians 3:28-29', 'There is neither Jew nor Greek… for ye are all one in Christ Jesus. And if ye be Christ\'s, then are ye Abraham\'s seed, and heirs according to the promise.')
      ],
      closing: 'This tree points to Jesus. In Him, you belong.'
    },
    links: [
      { href: '/one-family-in-christ-print.html', label: 'Print the main line (one page)' },
      { href: '/plans.html?plan=afterhardtalk', label: 'After a Hard Conversation (7 days)' },
      { href: '/plans.html?plan=peace', label: '7-Day Peace' },
      { href: '/plans.html?plan=heartalone', label: 'When the Heart Feels Alone' },
      { href: '/family-rhythm.html', label: 'Family rhythm hub' },
      { href: '/reader.html?book=Matthew&chapter=1', label: 'Read Matthew 1 (KJV)' }
    ]
  };
})(typeof window !== 'undefined' ? window : this);
