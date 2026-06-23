#!/usr/bin/env node
/**
 * Batch 13 – NT Stories & Early Church (301–325) package writer.
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const storiesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'kids', 'stories');

const STORIES = [
  {
    file: 'pentecost-holy-spirit-package.md',
    title: 'Pentecost — God’s Spirit Comes',
    ref: 'Acts 2:4',
    emotional: 'God sends His Spirit to help us every day.',
    keyKjv: '“And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance.” (Acts 2:4)',
    retelling38: 'After Jesus went to heaven, the disciples waited and prayed. God sent the Holy Spirit like wind and fire. The disciples were filled with joy and courage to tell everyone about Jesus.',
    coloring: 'Disciples in an upper room with wind and flames of fire above their heads, faces full of joy.',
    response: '“God’s Spirit is with you to help you every day.”',
    tags: 'pentecost, holy spirit, acts, church, gentle',
  },
  {
    file: 'stephen-stones-package.md',
    title: 'Stephen Trusts Jesus',
    ref: 'Acts 7:59',
    emotional: 'Trusting Jesus even when things are hard.',
    keyKjv: '“Lord Jesus, receive my spirit.” (Acts 7:59)',
    retelling38: 'Stephen told the people about Jesus even when they were angry. He looked up and saw Jesus in heaven. He asked Jesus to take care of him, and he went to be with Jesus.',
    coloring: 'Stephen looking up to heaven with a peaceful face while soft light shines down.',
    response: '“Jesus is with you even in the hardest moments.”',
    tags: 'stephen, martyrdom, faith, acts, gentle',
  },
  {
    file: 'philip-ethiopian-revisited-package.md',
    title: 'Philip and the Ethiopian',
    ref: 'Acts 8:29',
    emotional: 'Listening to God’s quiet voice and helping one person.',
    keyKjv: '“Then the Spirit said unto Philip, Go near, and join thyself to this chariot.” (Acts 8:29)',
    retelling38: 'Philip listened when God told him to run to a chariot. He helped the man understand the Bible, and the man believed in Jesus and was baptized.',
    coloring: 'Philip running beside a chariot talking happily to the man inside.',
    response: '“God can use you to help one person at a time.”',
    tags: 'philip, ethiopian, acts, obedience, gentle',
  },
  {
    file: 'saul-conversion-package.md',
    title: 'Saul Meets Jesus',
    ref: 'Acts 9:4',
    emotional: 'Jesus can change even the hardest hearts.',
    keyKjv: '“Saul, Saul, why persecutest thou me?” (Acts 9:4)',
    retelling38: 'Saul was mean to Jesus’ friends, but on the road to Damascus a bright light shone and Jesus spoke to him. Saul became Paul and spent his life telling others about Jesus.',
    coloring: 'Saul on the ground with bright light shining down and Jesus’ voice speaking to him.',
    response: '“Jesus can change any heart and make it new.”',
    tags: 'saul, paul, conversion, acts, gentle',
  },
  {
    file: 'dorcas-helping-revisited-package.md',
    title: 'Dorcas Helps Others',
    ref: 'Acts 9:36',
    emotional: 'Using what we have to show kindness.',
    keyKjv: '“This woman was full of good works and almsdeeds which she did.” (Acts 9:36)',
    retelling38: 'Dorcas made clothes for widows and helped anyone who needed it. When she died, her friends prayed and God brought her back. Her kindness was remembered.',
    coloring: 'Dorcas sitting happily sewing colorful clothes for smiling widows.',
    response: '“God can use your hands to show love every day.”',
    tags: 'dorcas, tabitha, kindness, acts, gentle',
  },
  {
    file: 'peter-cornelius-package.md',
    title: 'Peter and Cornelius',
    ref: 'Acts 10:34',
    emotional: 'God shows us that everyone is welcome in His family.',
    keyKjv: '“Of a truth I perceive that God is no respecter of persons.” (Acts 10:34)',
    retelling38: 'Peter learned that God loves every person the same. He went to Cornelius’ house and told them about Jesus. The whole house believed.',
    coloring: 'Peter standing in Cornelius’ house telling the good news while everyone listens happily.',
    response: '“Jesus welcomes everyone into His family.”',
    tags: 'peter, cornelius, acts, welcome, gentle',
  },
  {
    file: 'barnabas-encourages-revisited-package.md',
    title: 'Barnabas the Encourager',
    ref: 'Acts 11:23',
    emotional: 'Being a friend who cheers others on for Jesus.',
    keyKjv: '“And the son of consolation… Barnabas… exhorted them all.” (Acts 11:23)',
    retelling38: 'Barnabas was called the Son of Encouragement. He stood beside new believers and said kind words that helped them keep trusting Jesus.',
    coloring: 'Barnabas standing with new friends, smiling and patting a shoulder.',
    response: '“You can be someone’s encourager just like Barnabas.”',
    tags: 'barnabas, encouragement, acts, gentle',
  },
  {
    file: 'paul-first-journey-package.md',
    title: 'Paul’s First Journey',
    ref: 'Acts 13:52',
    emotional: 'God goes with us when we tell others about Jesus.',
    keyKjv: '“And the disciples were filled with joy, and with the Holy Ghost.” (Acts 13:52)',
    retelling38: 'Paul and Barnabas traveled to many towns telling people about Jesus. Even when it was hard, God was with them and many believed.',
    coloring: 'Paul and Barnabas walking on a dusty road with happy faces, telling people about Jesus.',
    response: '“God goes with us when we share His love.”',
    tags: 'paul, barnabas, journey, acts, gentle',
  },
  {
    file: 'lydia-conversion-package.md',
    title: 'Lydia Believes',
    ref: 'Acts 16:14',
    emotional: 'God opens hearts when we listen to His Word.',
    keyKjv: '“And the Lord opened the heart of Lydia.” (Acts 16:14)',
    retelling38: 'Lydia sat by the river listening to Paul. God opened her heart and she believed in Jesus right away. She opened her home to help others.',
    coloring: 'Lydia sitting peacefully by the river with Paul speaking kindly nearby.',
    response: '“God can open our hearts when we listen to His Word.”',
    tags: 'lydia, conversion, acts, gentle',
  },
  {
    file: 'silas-paul-singing-revisited-package.md',
    title: 'Paul and Silas Sing in Jail',
    ref: 'Acts 16:25',
    emotional: 'Praising God even when things are hard.',
    keyKjv: '“And at midnight Paul and Silas prayed, and sang praises unto God.” (Acts 16:25)',
    retelling38: 'Paul and Silas were in jail but they sang songs to God. God sent an earthquake and their chains fell off.',
    coloring: 'Paul and Silas sitting in chains singing with happy faces.',
    response: '“Praise opens the way for God’s power.”',
    tags: 'paul, silas, prison, praise, acts, gentle',
  },
  {
    file: 'eutychus-fallen-revisited-package.md',
    title: 'Eutychus Is Safe',
    ref: 'Acts 20:10',
    emotional: 'Friends who stay close when someone gets hurt.',
    keyKjv: '“And Paul went down, and fell on him, and embracing him said, Trouble not yourselves; for his life is in him.” (Acts 20:10)',
    retelling38: 'Young Eutychus fell from a window while Paul was teaching. Paul hugged him and God brought him back to life. Friends stayed close and helped.',
    coloring: 'Paul gently holding Eutychus after he fell.',
    response: '“Friends stay close when you need help.”',
    tags: 'eutychus, paul, friends, acts, gentle',
  },
  {
    file: 'paul-shipwreck-revisited-package.md',
    title: 'Paul in the Storm',
    ref: 'Acts 27:22',
    emotional: 'God keeps us safe even in big storms.',
    keyKjv: '“And Paul said… there shall be no loss of any man’s life among you, but of the ship.” (Acts 27:22)',
    retelling38: 'Paul was on a ship in a terrible storm. Everyone was afraid, but Paul trusted God’s promise. The ship broke apart, yet every person reached land safely.',
    coloring: 'Paul standing calmly on a broken ship while others look scared.',
    response: '“God can keep you safe even in the biggest storm.”',
    tags: 'paul, shipwreck, storm, acts, gentle',
  },
  {
    file: 'onesiphorus-paul-revisited-package.md',
    title: 'Onesiphorus Visits Paul',
    ref: '2 Timothy 1:16',
    emotional: 'Being a loyal friend even when times are hard.',
    keyKjv: '“For he oft refreshed me, and was not ashamed of my chain.” (2 Timothy 1:16)',
    retelling38: 'When Paul was in prison, Onesiphorus searched for him and brought encouragement. He was a true friend who stayed close.',
    coloring: 'Onesiphorus visiting Paul in prison with a kind smile and small gifts.',
    response: '“True friends stick close no matter what.”',
    tags: 'onesiphorus, paul, friendship, gentle',
  },
  {
    file: 'timothy-paul-friendship-revisited-package.md',
    title: 'Timothy and Paul',
    ref: 'Philippians 2:20',
    emotional: 'A younger friend learning from an older one.',
    keyKjv: '“For I have no man likeminded, who will naturally care for your state.” (Philippians 2:20)',
    retelling38: 'Young Timothy traveled with Paul and learned to love people the way Jesus does. Paul called him a son and a true friend.',
    coloring: 'Young Timothy walking beside Paul on a dusty road, talking happily.',
    response: '“Friends help each other grow closer to Jesus.”',
    tags: 'timothy, paul, friendship, gentle',
  },
  {
    file: 'aquila-priscilla-revisited-package.md',
    title: 'Aquila and Priscilla',
    ref: 'Romans 16:3',
    emotional: 'Husband and wife working together for God.',
    keyKjv: '“Greet Priscilla and Aquila my helpers in Christ Jesus.” (Romans 16:3)',
    retelling38: 'Aquila and Priscilla worked side by side making tents and helping the church. They opened their home and taught others about Jesus.',
    coloring: 'Aquila and Priscilla sewing tents together with cheerful teamwork.',
    response: '“Families who love Jesus can help each other grow.”',
    tags: 'aquila, priscilla, teamwork, gentle',
  },
  {
    file: 'epaphras-prayer-revisited-package.md',
    title: 'Epaphras Prays for Friends',
    ref: 'Colossians 4:12',
    emotional: 'Being a quiet friend who prays for others.',
    keyKjv: '“Epaphras, who is one of you, a servant of Christ, saluteth you, always labouring fervently for you in prayers.” (Colossians 4:12)',
    retelling38: 'Epaphras prayed hard for his friends even when he was far away. His prayers showed deep love and care.',
    coloring: 'Epaphras kneeling quietly with hands folded, thinking of his friends.',
    response: '“Praying for friends is one of the kindest things we can do.”',
    tags: 'epaphras, prayer, colossians, gentle',
  },
  {
    file: 'philemon-onesimus-revisited-package.md',
    title: 'Philemon Welcomes Onesimus',
    ref: 'Philemon 1:16',
    emotional: 'Forgiving and welcoming someone back into the family.',
    keyKjv: '“Receive him… as a brother beloved.” (Philemon 1:16)',
    retelling38: 'Philemon forgave Onesimus and welcomed him home like a brother. Forgiveness turned a servant into a brother.',
    coloring: 'Philemon and Onesimus hugging as brothers in a warm home.',
    response: '“Forgiveness opens the door to new friendship.”',
    tags: 'philemon, onesimus, forgiveness, gentle',
  },
  {
    file: 'titus-encouragement-revisited-package.md',
    title: 'Titus Brings Joy',
    ref: '2 Corinthians 7:15',
    emotional: 'Being a friend who brings good news and cheer.',
    keyKjv: '“And his inward affection is more abundant toward you.” (2 Corinthians 7:15)',
    retelling38: 'Titus was sent to help the church and brought back happy news that made Paul’s heart glad. He was a true encouraging friend.',
    coloring: 'Titus running to Paul with a joyful letter in hand.',
    response: '“Good friends bring joy to each other’s hearts.”',
    tags: 'titus, encouragement, corinthians, gentle',
  },
  {
    file: 'nymphas-house-church-revisited-package.md',
    title: 'Church in Nymphas’ Home',
    ref: 'Colossians 4:15',
    emotional: 'Opening your home so friends can learn about God.',
    keyKjv: '“Salute the brethren which are in Laodicea, and Nymphas, and the church which is in his house.” (Colossians 4:15)',
    retelling38: 'Nymphas opened his house so friends could meet, pray, and learn about Jesus together.',
    coloring: 'People gathered happily in Nymphas’ simple home for church.',
    response: '“Your home can be a place of kindness and friendship.”',
    tags: 'nymphas, house church, hospitality, gentle',
  },
  {
    file: 'gaius-hospitality-revisited-package.md',
    title: 'Gaius Welcomes Travelers',
    ref: '3 John 1:5',
    emotional: 'Being a friend who welcomes travelers.',
    keyKjv: '“Beloved, thou doest faithfully whatsoever thou doest to the brethren.” (3 John 1:5)',
    retelling38: 'Gaius opened his home and helped traveling preachers. John said his kindness was faithful and pleasing to God.',
    coloring: 'Gaius standing at his door welcoming tired travelers with food and smiles.',
    response: '“Welcoming others is a beautiful way to show God’s love.”',
    tags: 'gaius, hospitality, 3 john, gentle',
  },
];

function buildPackage(s) {
  return `# ${s.title} (${s.ref})

## Emotional Focus
${s.emotional}

## Key KJV
${s.keyKjv}

## Gentle Retelling (3–8)
${s.retelling38}

## Gentle Retelling (9–12)


## Gentle Retelling (13–17)


## Coloring Prompt
${s.coloring}

## Read-Along Flow + Response
${s.response}

**Search tags:** ${s.tags}
**Verse:** ${s.ref}
**Flow:** color → listen → gentle loop or next
`;
}

let n = 0;
for (const s of STORIES) {
  writeFileSync(join(storiesDir, s.file), buildPackage(s), 'utf8');
  n++;
}
console.log(`Wrote ${n} Batch 13 package.md files.`);
