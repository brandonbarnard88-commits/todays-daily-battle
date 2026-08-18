#!/usr/bin/env node
/**
 * One-pass cleanup: leftover Grove templates that unique-ified themselves
 * with a verse snippet. Writes hero-daily-365-explanations.js in place.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'hero-daily-365-explanations.js');

const SETTINGS = {
  'Jeremiah 17:7':
    'Jeremiah faces plots, loneliness, and the cost of speaking God’s word. This verse blesses the one who trusts in the Lord.',
  '1 Thessalonians 5:17':
    'Paul writes the church at Thessalonica a short rule of life. This verse is the unceasing part: pray without ceasing.',
  'Colossians 3:20':
    'Paul writes household codes to Colossae. This verse names the children: obey your parents in all things, for this is well pleasing unto the Lord.',
  'Matthew 5:9':
    'Jesus teaches the Beatitudes on the mount. This verse blesses the peacemakers: they shall be called the children of God.',
  'Proverbs 20:7':
    'Solomon gives a short proverb for daily life. This verse says the just man walks in his integrity, and his children are blessed after him.',
  'Numbers 6:24':
    'Moses gives Aaron the priestly blessing for Israel. This verse is the first line: the LORD bless thee, and keep thee.',
  'Isaiah 61:3':
    'Isaiah speaks comfort to those who mourn in Zion. This verse appoints beauty for ashes — joy where there had been mourning.',
  'Matthew 5:4':
    'Jesus teaches the Beatitudes on the mount. This verse blesses them that mourn: they shall be comforted.',
  'Matthew 5:6':
    'Jesus teaches the Beatitudes on the mount. This verse blesses them that hunger and thirst after righteousness.',
  'Matthew 5:7':
    'Jesus teaches the Beatitudes on the mount. This verse blesses the merciful: they shall obtain mercy.',
  'Matthew 5:8':
    'Jesus teaches the Beatitudes on the mount. This verse blesses the pure in heart: they shall see God.',
  'John 20:29':
    'The risen Jesus speaks to Thomas after the empty tomb. This verse blesses those who have not seen, and yet have believed.',
  '1 Corinthians 15:57':
    'Paul teaches the resurrection of Christ and of the dead. This verse thanks God, who gives us the victory through our Lord Jesus Christ.',
  '2 Corinthians 1:3':
    'Paul opens a letter of comfort after conflict with Corinth. This verse blesses God, the Father of mercies and the God of all comfort.',
  'Colossians 3:16':
    'Paul writes Colossae to let Christ’s word dwell richly. This verse says teach and admonish one another in psalms, hymns, and spiritual songs.',
  '1 Thessalonians 5:18':
    'Paul writes a short rule of life to Thessalonica. This verse says in every thing give thanks: for this is the will of God in Christ Jesus.',
  'James 1:12':
    'James writes scattered believers under trial. This verse blesses the man that endureth temptation: when he is tried, he shall receive the crown of life.',
  'Matthew 5:44':
    'Jesus teaches the Sermon on the Mount. This verse says love your enemies, bless them that curse you, do good to them that hate you.',
  'Ephesians 1:3':
    'Paul blesses God for every spiritual blessing in Christ. This verse opens that blessing: Blessed be the God and Father of our Lord Jesus Christ.',
  'Colossians 4:2':
    'Paul closes household teaching with prayer. This verse says continue in prayer, and watch in the same with thanksgiving.'
};

const TO_WHEN = {
  '1 Chronicles 16:34': 'thanks has to start before the feeling arrives',
  'Psalm 100:5': 'you need to hear that the Lord is still good',
  'Psalm 59:16': 'you need a song after a hard night',
  'Psalm 86:5': 'you need a God who is ready to forgive',
  'Psalm 36:5': 'mercy has to be bigger than the sky you can see',
  'Psalm 86:15': 'you need a God who is slow to anger',
  'Psalm 90:14': 'the morning has to start with mercy, not hurry',
  'Psalm 94:18': 'your foot has already slipped',
  'Psalm 103:3': 'you need the One who forgives all your iniquities',
  'Psalm 103:8': 'you need the Lord merciful and gracious, slow to anger',
  'Psalm 108:4': 'mercy has to be great above the heavens',
  'Psalm 136:4': 'you need to remember who alone does great wonders',
  'Psalm 118:29': 'thanks has to be said while His mercy still endures',
  'Psalm 130:7': 'Israel’s hope — and yours — has to rest in the Lord',
  'Psalm 23:6': 'you need goodness and mercy still following you',
  'Psalm 85:10': 'mercy and truth have to meet in the same hour',
  'Psalm 32:1': 'you need the blessing of transgression forgiven',
  'Matthew 5:7': 'you need the mercy promised to the merciful',
  'Matthew 6:14': 'you need to forgive as you have been forgiven',
  'Ephesians 1:7': 'you need redemption through His blood',
  '1 John 1:9': 'you need to confess and be cleaned',
  'Psalm 89:14': 'justice and judgment have to hold the throne',
  'Psalm 115:1': 'the glory has to go to His name, not yours',
  'Psalm 119:64': 'the earth is already full of His mercy',
  'Psalm 138:8': 'you need the Lord to perfect what concerns you',
  'Psalm 145:8': 'you need the Lord gracious and full of compassion',
  'James 3:17': 'you need wisdom that is first pure, then peaceable'
};

const PLAINS = {
  '2 Chronicles 7:14':
    'If God’s people humble themselves, pray, and turn from their wicked ways, He will hear from heaven and heal their land.',
  'Nehemiah 1:5':
    'Nehemiah asks the great and terrible God who keeps covenant and mercy with them that love Him and keep His commandments.',
  'Psalm 23:6':
    'Surely goodness and mercy shall follow me all the days of my life — not a one-day kindness.',
  'Psalm 32:1':
    'Blessed is the one whose transgression is forgiven, whose sin is covered — that is the blessing, not a leftover mood.',
  'Micah 6:8':
    'God has shown what is good: do justly, love mercy, and walk humbly with your God.',
  'Micah 7:18':
    'There is no God like the Lord, who pardons iniquity and does not keep His anger forever.',
  'Matthew 5:7':
    'Blessed are the merciful: they shall obtain mercy — mercy given and mercy received.',
  'Ephesians 1:7':
    'In Christ we have redemption through His blood, the forgiveness of sins, according to the riches of His grace.',
  'Ephesians 4:2':
    'Walk with all lowliness and meekness, with longsuffering, forbearing one another in love.',
  'Colossians 3:16':
    'Let the word of Christ dwell in you richly — teaching and singing with grace in your hearts to the Lord.',
  '2 Thessalonians 2:16':
    'Our Lord Jesus Christ and God our Father, who loved us, give everlasting consolation and good hope through grace.',
  '2 Timothy 2:1':
    'Be strong in the grace that is in Christ Jesus — strength from His grace, not from your grit.',
  'Titus 3:5':
    'He saved us not by works of righteousness which we have done, but according to His mercy.',
  '1 Peter 5:10':
    'The God of all grace, who called you, will make you perfect, stablish, strengthen, and settle you after you have suffered a while.',
  '2 Peter 3:9':
    'The Lord is not slack concerning His promise: He is longsuffering, not willing that any should perish.',
  '1 John 1:9':
    'If we confess our sins, He is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.',
  'Jude 1:21':
    'Keep yourselves in the love of God, looking for the mercy of our Lord Jesus Christ unto eternal life.',
  'Psalm 89:14':
    'Justice and judgment are the habitation of His throne: mercy and truth go before His face.',
  'Psalm 115:1':
    'Not unto us, O Lord, but unto Thy name give glory, for Thy mercy and for Thy truth’s sake.',
  'Psalm 119:64':
    'The earth, O Lord, is full of Thy mercy: teach me Thy statutes.',
  'Psalm 138:8':
    'The Lord will perfect that which concerneth me: Thy mercy, O Lord, endureth for ever.',
  'Psalm 145:8':
    'The Lord is gracious, and full of compassion; slow to anger, and of great mercy.',
  'Ephesians 2:4':
    'God, who is rich in mercy, for His great love wherewith He loved us, made us alive with Christ.',
  '1 Peter 1:13':
    'Gird up the loins of your mind, be sober, and hope to the end for the grace that is to be brought at the revelation of Jesus Christ.'
};

function loadList() {
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = { console, window: {}, globalThis: {} };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  return { code, list: sandbox.__TDB_HERO_DAILY_EXPLANATIONS };
}

function rewriteTo(to, when) {
  return String(to || '').replace(/you have failed and still need to come/gi, when);
}

function fixComma(s) {
  return String(s || '').replace(/,\.\s*$/g, '.');
}

const { code, list } = loadList();
let nSet = 0;
let nTo = 0;
let nPlain = 0;
let nComma = 0;

for (const row of list) {
  if (SETTINGS[row.ref] && row.setting !== SETTINGS[row.ref]) {
    row.setting = SETTINGS[row.ref];
    nSet += 1;
  }
  if (TO_WHEN[row.ref] && /you have failed and still need to come/i.test(row.to || '')) {
    row.to = rewriteTo(row.to, TO_WHEN[row.ref]);
    nTo += 1;
  }
  if (PLAINS[row.ref] && row.plain !== PLAINS[row.ref]) {
    row.plain = PLAINS[row.ref];
    nPlain += 1;
  }
  const sit2 = fixComma(row.setting);
  const pl2 = fixComma(row.plain);
  if (sit2 !== row.setting) {
    row.setting = sit2;
    nComma += 1;
  }
  if (pl2 !== row.plain) {
    row.plain = pl2;
    nComma += 1;
  }
}

const start = code.indexOf('  global.__TDB_HERO_DAILY_EXPLANATIONS = [');
const end = code.indexOf('\n];\n  global.TDB_GET_HERO_DAY_EXPLANATION');
if (start < 0 || end < 0) throw new Error('could not find explanations array bounds');
const json = JSON.stringify(list, null, 2)
  .replace(/^\[/, '')
  .replace(/\]$/, '')
  .split('\n')
  .map((line, i) => (i === 0 ? line : '  ' + line))
  .join('\n');
const next =
  code.slice(0, start) +
  '  global.__TDB_HERO_DAILY_EXPLANATIONS = [' +
  json +
  code.slice(end);
fs.writeFileSync(file, next);
console.log(JSON.stringify({ nSet, nTo, nPlain, nComma, total: list.length }, null, 2));
