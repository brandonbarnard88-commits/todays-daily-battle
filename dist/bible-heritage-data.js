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

  var WIDER_FAMILY = [
    {
      id: 'women',
      title: 'Women in the line & beside it',
      summaryLabel: 'Show women in the family story (16)',
      intro:
        'The main trunk above names many fathers; Scripture also remembers mothers, wives, and faithful women beside the line. Matthew names several without shame — God welcomed them into the story of Christ.',
      people: [
        {
          id: 'eve-wider',
          name: 'Eve',
          relation: 'Mother of all living — with Adam on the trunk above',
          trunkRef: true,
          verses: [
            v('Genesis 3:20', 'And Adam called his wife\'s name Eve; because she was the mother of all living.')
          ],
          note: 'Every human family begins with her — the line of promise runs through real marriage and real sorrow.'
        },
        {
          id: 'sarah',
          name: 'Sarah',
          relation: 'Wife of Abraham — mother of Isaac',
          connectTo: 'abraham',
          verses: [
            v('Genesis 17:19', 'And God said, Sarah thy wife shall bear thee a son indeed; and thou shalt call his name Isaac: and I will establish my covenant with him for an everlasting covenant, and with his seed after him.')
          ],
          note: 'She waited long — God kept His word when her hope felt finished.'
        },
        {
          id: 'rebekah',
          name: 'Rebekah',
          relation: 'Wife of Isaac — mother of Jacob and Esau',
          connectTo: 'isaac',
          verses: [
            v('Genesis 24:67', 'And Isaac brought her into his mother Sarah\'s tent, and took Rebekah, and she became his wife; and he loved her: and Isaac was comforted after his mother\'s death.')
          ],
          note: 'Chosen for the next generation — love and promise pass through her household.'
        },
        {
          id: 'leah',
          name: 'Leah',
          relation: 'Wife of Jacob — mother of Judah',
          connectTo: 'judah',
          verses: [
            v('Genesis 29:35', 'And she conceived again, and bare a son: and she said, Now will I praise the LORD: therefore she called his name Judah; and left bearing.')
          ],
          note: 'From Judah the royal line and Messiah would come — God saw her in a hard marriage.'
        },
        {
          id: 'rachel',
          name: 'Rachel',
          relation: 'Wife of Jacob — mother of Joseph and Benjamin',
          connectTo: 'jacob',
          verses: [
            v('Genesis 30:22', 'And God remembered Rachel, and God hearkened to her, and opened her womb.')
          ],
          note: 'Her sons carry Israel forward — grief and longing are not forgotten by God.'
        },
        {
          id: 'tamar-wider',
          name: 'Tamar',
          relation: 'Mother of Phares in Judah\'s line',
          connectTo: 'phares',
          verses: [v('Matthew 1:3', 'And Judas begat Phares and Zara of Thamar;')],
          note: 'Matthew does not hide hard stories — God redeems and still keeps His promise.'
        },
        {
          id: 'rahab-wider',
          name: 'Rahab',
          relation: 'Mother of Boaz in the line (by Salmon)',
          connectTo: 'salmon',
          verses: [
            v('Joshua 2:11', '…for the LORD your God, he is God in heaven above, and in earth beneath.'),
            v('Matthew 1:5', 'And Salmon begat Booz of Rachab;')
          ],
          note: 'A Gentile who feared the LORD — grafted into Israel and into Messiah\'s line.'
        },
        {
          id: 'ruth-wider',
          name: 'Ruth',
          relation: 'Wife of Boaz — the Moabitess',
          connectTo: 'boaz',
          verses: [
            v('Ruth 1:16', '…whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God:'),
            v('Matthew 1:5', '…and Booz begat Obed of Ruth;')
          ],
          note: 'Loyal love across borders — she is not a footnote but a grandmother of David.'
        },
        {
          id: 'bathsheba',
          name: 'Bathsheba',
          relation: 'Wife of David — mother of Solomon in the line',
          connectTo: 'solomon',
          verses: [
            v('Matthew 1:6', 'And Jesse begat David the king; and David the king begat Solomon of her that had been the wife of Urias;')
          ],
          note: 'Matthew names the painful past honestly — yet Solomon still stands in the line toward Christ.'
        },
        {
          id: 'hannah',
          name: 'Hannah',
          relation: 'Mother of Samuel the prophet',
          relationBeside: 'Beside the royal line — mother of Samuel who anointed David',
          verses: [
            v('1 Samuel 1:27', 'For this child I prayed; and the LORD hath given me my petition which I asked of him:')
          ],
          note: 'Her prayer shaped a nation — God hears the weary who keep coming to Him.'
        },
        {
          id: 'miriam',
          name: 'Miriam',
          relation: 'Sister of Moses and Aaron',
          relationBeside: 'Beside the Exodus — prophetess who led praise',
          verses: [
            v('Exodus 15:20', 'And Miriam the prophetess, the sister of Aaron, took a timbrel in her hand; and all the women went out after her with timbrels and with dances.')
          ],
          note: 'She stood in the deliverance God gave — a voice beside the lawgiver.'
        },
        {
          id: 'deborah',
          name: 'Deborah',
          relation: 'Judge and prophetess in Israel',
          relationBeside: 'Beside the judges — led Israel when men hesitated',
          verses: [
            v('Judges 4:4', 'And Deborah, a prophetess, the wife of Lapidoth, she judged Israel at that time.')
          ],
          note: 'God raised whom He pleased — courage at a desperate hour.'
        },
        {
          id: 'esther',
          name: 'Esther',
          relation: 'Queen in Persia — Jewish deliverer',
          relationBeside: 'Beside the exile — queen for such a time',
          verses: [
            v('Esther 4:14', '…and who knoweth whether thou art come to the kingdom for such a time as this?')
          ],
          note: 'Hidden identity, open risk — many lived because she stepped forward.'
        },
        {
          id: 'elizabeth',
          name: 'Elizabeth',
          relation: 'Mother of John the Baptist — kinswoman of Mary',
          relationBeside: 'Beside Christ\'s coming — faithful in old age',
          verses: [
            v('Luke 1:42', 'And she spake out with a loud voice, and said, Blessed art thou among women, and blessed is the fruit of thy womb.')
          ],
          note: 'Her miracle prepared the way — the family story bends toward Bethlehem.'
        },
        {
          id: 'anna',
          name: 'Anna',
          relation: 'Prophetess in the temple',
          relationBeside: 'Beside the infant Christ — waited decades to see Him',
          verses: [
            v('Luke 2:37-38', '…she was a widow of about fourscore and four years, which departed not from the temple… And she coming in that instant gave thanks likewise unto the Lord, and spake of him to all them that looked for redemption in Jerusalem.')
          ],
          note: 'Long waiting, then joy — she told everyone who hoped in God\'s redemption.'
        },
        {
          id: 'mary-wider',
          name: 'Mary',
          relation: 'Mother of Jesus — on the trunk above',
          trunkRef: true,
          connectTo: 'mary',
          verses: [
            v('Luke 1:38', 'And Mary said, Behold the handmaid of the Lord; be it unto me according to thy word.')
          ],
          note: 'The line of promise becomes flesh in her — see her also in David to Christ above.'
        }
      ]
    },
    {
      id: 'witnesses',
      title: 'The cloud of witnesses',
      summaryLabel: 'Show the cloud of witnesses (7)',
      intro:
        'The main line runs from Adam to Christ. After the cross, Scripture names another kind of family — believers who pray, suffer, encourage, and belong to one another. Hebrews calls them a cloud of witnesses: not spectators far away, but sisters and brothers who already ran their race and still cheer us toward patience.',
      anchorVerse: v(
        'Hebrews 12:1',
        'Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us,'
      ),
      closing:
        'Father, thank You that we are not alone on hard days. Surround us with Your Word, with faithful people, and with the hope of Christ. Help us run today with patience — not to prove ourselves, but because we belong to Your household. In Jesus\' name, Amen.',
      people: [
        {
          id: 'priscilla-aquila',
          name: 'Priscilla & Aquila',
          relation: 'Tentmakers — teachers and hosts in the early church',
          relationBeside: 'Beside Paul — opened their home and taught Apollos',
          verses: [
            v('Acts 18:26', 'And he began to speak boldly in the synagogue: whom when Aquila and Priscilla had heard, they took him unto them, and expounded unto him the way of God more perfectly.'),
            v('Romans 16:3', 'Greet Priscilla and Aquila my helpers in Christ Jesus:')
          ],
          note: 'Ordinary work, open table, clear Word — the family of God often grows in kitchens and workshops as much as in temples.'
        },
        {
          id: 'lydia',
          name: 'Lydia',
          relation: 'Seller of purple — first convert in Philippi',
          relationBeside: 'Beside the missionary road — hostess of the church in her house',
          verses: [
            v('Acts 16:14-15', 'And a certain woman named Lydia, a seller of purple, of the city of Thyatira, which worshipped God, heard us: whose heart the Lord opened, that she attended unto the things which were spoken of Paul. And when she was baptized, and her household, she besought us, saying, If ye have judged me to be faithful to the Lord, come into my house, and abide there.')
          ],
          note: 'The Lord opened her heart — then she opened her home. Belonging often begins with a simple invitation to stay.'
        },
        {
          id: 'paul-silas',
          name: 'Paul & Silas',
          relation: 'Apostle and companion — prisoners who prayed at midnight',
          relationBeside: 'Beside the Philippian jail — praise when the night felt endless',
          verses: [
            v('Acts 16:25', 'And at midnight Paul and Silas prayed, and sang praises unto God: and the prisoners heard them.'),
            v('Acts 16:34', 'And when he had brought them into his house, he set meat before them, and rejoiced, believing in God with all his house.')
          ],
          note: 'Chains could not silence their worship — God turned a prison cell into a doorway for a whole household to believe.'
        },
        {
          id: 'timothy',
          name: 'Timothy',
          relation: 'Son in the faith — pastor from Lystra',
          relationBeside: 'Beside Paul — young, faithful, often afraid, still sent',
          verses: [
            v('2 Timothy 1:5', 'When I call to remembrance the unfeigned faith that is in thee, which dwelt first in thy grandmother Lois, and thy mother Eunice; and I am persuaded that in thee also.'),
            v('1 Timothy 1:2', 'Unto Timothy, my own son in the faith: Grace, mercy, and peace, from God our Father and Jesus Christ our Lord.')
          ],
          note: 'Faith handed down through a mother and grandmother — then carried forward in gentleness, not swagger.'
        },
        {
          id: 'onesimus',
          name: 'Onesimus',
          relation: 'Once a runaway servant — now a beloved brother',
          relationBeside: 'Beside Philemon — reconciled and sent back in love',
          verses: [
            v('Philemon 1:10', 'I beseech thee for my son Onesimus, whom I have begotten in my bonds:'),
            v('Colossians 4:9', 'With Onesimus, a faithful and beloved brother, who is one of you.')
          ],
          note: 'A broken relationship became family language — Paul called him son and brother, not a problem to hide.'
        },
        {
          id: 'barnabas',
          name: 'Barnabas',
          relation: 'Son of consolation — encourager of the early church',
          relationBeside: 'Beside Paul and John Mark — stood with people others had quit on',
          verses: [
            v('Acts 4:36', 'And Joses, who by the apostles was surnamed Barnabas, (which is, being interpreted, The son of consolation,) a Levite, and of the country of Cyprus:'),
            v('Acts 11:24', 'For he was a good man, and full of the Holy Ghost and of faith: and much people was added unto the Lord.')
          ],
          note: 'His name meant encouragement — the cloud of witnesses includes those who make room for second chances.'
        },
        {
          id: 'stephen',
          name: 'Stephen',
          relation: 'Deacon and first martyr — full of faith and the Holy Ghost',
          relationBeside: 'Beside the young church — saw heaven open as stones fell',
          verses: [
            v('Acts 6:5', 'And the saying pleased the whole multitude: and they chose Stephen, a man full of faith and of the Holy Ghost, and Philip, and Prochorus, and Nicanor, and Timon, and Parmenas, and Nicolas a proselyte of Antioch:'),
            v('Acts 7:59', 'And they stoned Stephen, calling upon God, and saying, Lord Jesus, receive my spirit.')
          ],
          note: 'He did not run his race for applause — he finished looking to Christ, and the church remembered.'
        }
      ]
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
    { id: 'wider-women', title: 'Women in the line & beside it' },
    { id: 'wider-witnesses', title: 'The cloud of witnesses' },
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
    widerFamily: WIDER_FAMILY,
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
      { href: '/plans.html?plan=longheavydays', label: 'When the days feel long and heavy (7 days)' },
      { href: '/plans.html?plan=peace', label: '7-Day Peace' },
      { href: '/plans.html?plan=heartalone', label: 'When the Heart Feels Alone' },
      { href: '/family-rhythm.html', label: 'Family rhythm hub' },
      { href: '/reader.html?book=Matthew&chapter=1', label: 'Read Matthew 1 (KJV)' }
    ]
  };
})(typeof window !== 'undefined' ? window : this);
