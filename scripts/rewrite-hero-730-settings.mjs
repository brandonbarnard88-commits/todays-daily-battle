#!/usr/bin/env node
/**
 * Rewrite hero “What was going on” so every queue day has its own verse-true
 * setting. Chapter-band paste and factory “said this to…: Title” stamps go.
 *
 *   node scripts/rewrite-hero-730-settings.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { loadYear365 } from './lib/hero-daily-verse-pick.mjs';
import { situationForChapter } from './lib/bible-situation-map.mjs';
import {
  bookOf,
  chapterOf,
  evaluateTeachingFields,
  leadingSpeakerInText,
  situationLooksWrongForRef,
  speakerBelongsToBook,
} from './lib/verse-teaching-guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const explPath = path.join(root, 'hero-daily-365-explanations.js');

function loadExplanationsSrc() {
  return fs.readFileSync(explPath, 'utf8');
}

function extractArrayLiteral(src) {
  const marker = 'global.__TDB_HERO_DAILY_EXPLANATIONS = ';
  const start = src.indexOf(marker);
  if (start < 0) throw new Error('explanations array marker not found');
  const bracket = src.indexOf('[', start);
  let depth = 0;
  let end = -1;
  for (let i = bracket; i < src.length; i++) {
    const ch = src[i];
    if (ch === '[') depth += 1;
    else if (ch === ']') {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) throw new Error('could not find end of explanations array');
  return { before: src.slice(0, bracket), arraySrc: src.slice(bracket, end), after: src.slice(end) };
}

function loadExplanations() {
  const code = loadExplanationsSrc();
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  return sandbox.__TDB_HERO_DAILY_EXPLANATIONS;
}

function stripSuperscription(s) {
  let t = String(s || '').replace(/\s+/g, ' ').trim();
  t = t.replace(/^[-–—]\s*(A Psalm[^.]*\.\s*)+/i, '');
  t = t.replace(/^[-–—]\s*(Of David[^.]*\.\s*)+/i, '');
  t = t.replace(/^[-–—]\s*(A Song[^.]*\.\s*)+/i, '');
  t = t.replace(/^To the chief Musician[^.]*\.\s*/i, '');
  t = t.replace(/^A Psalm of[^.]*\.\s*/i, '');
  t = t.replace(/^Maschil of[^.]*\.\s*/i, '');
  t = t.replace(/^To the chief Musician upon[^.]*\.\s*/i, '');
  return t.replace(/\s+/g, ' ').trim();
}

function firstClause(s, max) {
  const cut = stripSuperscription(s).split(/(?<=[.!?])\s+/)[0] || stripSuperscription(s);
  const t = cut.length <= max ? cut : cut.slice(0, max).replace(/\s+\S*$/, '');
  return t.replace(/\s+/g, ' ').trim();
}

function uncap(s) {
  const t = String(s || '').trim();
  if (!t) return t;
  if (/^(The Lord|God|Jesus|Christ|I |O )\b/.test(t)) return t;
  return t.charAt(0).toLowerCase() + t.slice(1);
}

function endsSent(s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t) return t;
  return /[.!?]$/.test(t) ? t : t + '.';
}

function gospelBook(ref) {
  return /^(Matthew|Mark|Luke|John|Acts)\b/i.test(bookOf(ref));
}

function jesusOk(ref) {
  return /^(Matthew|Mark|Luke|John|Acts|Revelation|[123] John)\b/i.test(bookOf(ref));
}

function startsWrong(s, ref) {
  const t = String(s || '').trim();
  if (/^jesus\b/i.test(t) && !jesusOk(ref)) return true;
  const lead = leadingSpeakerInText(t);
  if (lead && !speakerBelongsToBook(lead, ref)) return true;
  return false;
}

function isFactorySetting(s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (/In this passage of Scripture/i.test(t)) return true;
  if (/spoken by .+ to .+/i.test(t) && t.length < 100) return true;
  if (/said this to /i.test(t) && /:\s*[A-Z][^:]{0,48}$/.test(t)) return true;
  if (/^Letter to /i.test(t)) return true;
  return false;
}

function pickBandClause(sit, text) {
  const raw = String(sit || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!raw) return '';
  const parts = raw
    .split(/\s*[;—–]\s+/)
    .map((p) => p.replace(/:+$/, '').trim())
    .filter((p) => p.length >= 16);
  if (parts.length < 2) return raw.replace(/:+$/, '').trim();
  const vTok = new Set(
    String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4)
  );
  let best = parts[parts.length - 1];
  let bestN = -1;
  for (const p of parts) {
    let n = 0;
    for (const w of p.toLowerCase().split(/[^a-z0-9]+/)) {
      if (vTok.has(w)) n += 1;
    }
    if (n > bestN) {
      bestN = n;
      best = p;
    }
  }
  if (bestN === 0) {
    const skipTitle = parts.find(
      (p) =>
        p.length >= 22 &&
        !/^(Hallelujah|Hall of|Songs of|Short proverbs|Letter to|A new song|Jericho falls)/i.test(p)
    );
    best = skipTitle || parts[0];
  }
  return best;
}

function chapterFrame(ref, text) {
  const book = bookOf(ref);
  const ch = chapterOf(ref);
  const band = situationForChapter(book === 'Psalms' ? 'Psalm' : book, ch);
  const picked = pickBandClause(band && band.situation, text);
  return firstClause(picked, 108);
}

function verseQuote(text) {
  let t = stripSuperscription(text);
  const semi = t.split(/\s*;\s*/)[0].trim();
  if (semi.length >= 18 && semi.length <= 80) t = semi;
  else t = firstClause(t, 72);
  t = t.replace(/[.!?]$/, '');
  t = t
    .replace(/\bthy\b/gi, 'your')
    .replace(/\bthou\b/gi, 'you')
    .replace(/\bthee\b/gi, 'you')
    .replace(/\bthine\b/gi, 'your')
    .replace(/\bhath\b/gi, 'has')
    .replace(/\bshalt\b/gi, 'shall')
    .replace(/\bsaith\b/gi, 'says')
    .replace(/\bshew\b/gi, 'show')
    .replace(/\bdwelleth\b/gi, 'dwells')
    .replace(/\bcometh\b/gi, 'comes')
    .replace(/\bWatch ye\b/gi, 'Watch')
    .replace(/\bGo ye\b/gi, 'Go')
    .replace(/\bCome ye\b/gi, 'Come')
    .replace(/\bye\b/g, 'you');
  t = t.replace(/\s+/g, ' ').trim();
  while (
    /\b(in|of|the|and|or|to|for|a|with|under|from|by|who|which|that|my|his|your|our|their|through)\.?$/i.test(
      t
    ) &&
    t.split(/\s+/).length > 5
  ) {
    t = t.replace(/\s+\S+$/, '').trim();
  }
  return t;
}

function whoLead(about, ref) {
  const a = String(about || '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[—–(]/)[0]
    .trim();
  if (!a || a.length > 56) return '';
  if (startsWrong(a, ref)) return '';
  if (situationLooksWrongForRef(a, ref)) return '';
  return a;
}

const HARD = {
  'Psalm 23:1':
    'David is singing of the Lord as his own shepherd — this first line says he shall not want, because the Shepherd Himself tends him.',
  'Psalm 23:2':
    'Still in the shepherd psalm: David pictures green pastures and still waters — the Lord making him lie down, not driving him.',
  'Psalm 23:3':
    'David is still under the Shepherd’s care: this line is the restoring — He brings the soul back and leads in right paths for His name.',
  'Psalm 23:4':
    'The shepherd psalm goes into the valley of the shadow of death. David says he will not fear there, because the Lord is with him.',
  'Psalm 23:5':
    'David is still the sheep of the Lord — now at a table set in front of enemies, head anointed, cup running over.',
  'Psalm 23:6':
    'The shepherd psalm closes: goodness and mercy follow him all his days, and he will dwell in the Lord’s house forever.',
  'Psalm 119:105':
    'In the long acrostic love-song to God’s Word, this verse names the Word as a lamp for the feet — light for the next step, not always the whole road.',
  'Psalm 96:2':
    'Israel is calling every land to sing a new song to the Lord as King. The verse: bless His name and show His salvation today, then again tomorrow.',
  'Psalm 46:10':
    'When the earth shakes and nations rage, this psalm says God is a present refuge — then this line stops the striving: be still, and know that He is God.',
  'Psalm 46:1':
    'The sons of Korah sing while the earth shakes: God is our refuge and strength, a very present help in trouble — not a distant one.',
  'Philippians 4:13':
    'Paul writes from a Roman prison to friends in Philippi. This line is not a boast about every goal — he can face whatever state he is in because Christ strengthens him.',
  'Philippians 4:6':
    'Paul writes from prison: do not be anxious — in everything, by prayer and thanksgiving, let your requests be made known to God.',
  'Philippians 4:7':
    'Still in the prison letter to Philippi: after prayer, the peace of God will keep hearts and minds — a guard, not a mood.',
  'Philippians 4:4':
    'From prison Paul tells Philippi to rejoice in the Lord always — then says it again, because joy here is a command, not a feeling.',
  'Philippians 4:8':
    'Paul is teaching a prison-letter church what to put in the mind: whatever is true, honest, just, pure, lovely — think on these.',
  'Philippians 4:19':
    'Paul has just spoken of contentment and their gift. This line is the promise: God will supply all their need according to His riches in glory by Christ.',
  'Philippians 4:11':
    'Paul writes from prison about contentment: he has learned, in whatever state he is, to be content — not because the cell is easy.',
  'Philippians 4:9':
    'Paul closes the prison letter’s teaching: what they have learned and seen in him, they are to do — and the God of peace will be with them.',
  'Matthew 7:7':
    'Jesus is on the mount teaching how to live before the Father. This line is the open door: ask, seek, knock — the Father is not hiding.',
  'John 3:16':
    'Jesus is talking with Nicodemus at night about new birth. The verse: God so loved the world that He gave His only Son.',
  '1 John 4:19':
    'John is teaching the church why love is possible at all: we love Him because He first loved us — love starts with God, not with our effort.',
  'Joshua 1:9':
    'Joshua has just taken command after Moses’ death. The verse: be strong and of a good courage; the Lord your God is with you wherever you go.',
  'Romans 5:1':
    'Paul is teaching Rome that Abraham believed God. The verse: being justified by faith, we have peace with God through our Lord Jesus Christ.',
  'Psalm 6:9':
    'David is crying out in trouble and tears. The verse: the Lord has heard my supplication; the Lord will receive my prayer.',
  'Psalm 52:8':
    'David is answering Doeg’s betrayal. The verse: I am like a green olive tree in the house of God; I trust in His mercy forever.',
  'Psalm 66:1':
    'David is leading a joyful procession of praise. This opening line is for every land: make a joyful noise unto God, all ye lands.',
  'Psalm 134:2':
    'This is a short song of ascent for night servants in the temple. The verse: lift up your hands in the sanctuary, and bless the Lord.',
  'Isaiah 40:31':
    'Isaiah is comforting weary exiles that God does not faint. The verse: they that wait upon the Lord shall renew their strength.',
  '1 Samuel 17:47':
    'David stands before Goliath and Saul’s frozen army. This line is the point of the fight: the battle is the Lord’s, not Israel’s to finish alone.',
  'Psalm 91:11':
    'This is the refuge psalm — dwelling in the secret place of the Most High. This verse says He gives His angels charge over you, to keep you in His ways.',
  'Psalm 121:7':
    'A pilgrim song of ascent on the road up to Jerusalem. The verse: the Lord shall preserve you from all evil — He keeps the soul.',
  'Psalm 139:14':
    'David marvels that God searches him and formed him in the womb. This line is the wonder: he is fearfully and wonderfully made — not an accident.',
  'Psalm 56:3':
    'David is hunted and afraid. The verse: when I am afraid, I will trust in You — not later, now.',
  '2 Timothy 1:7':
    'Paul writes from prison to timid Timothy. This verse names the gift: God has not given a spirit of fear, but of power, love, and a sound mind.',
  'Isaiah 41:10':
    'Isaiah speaks for the Lord to fearful exiles. This line is the hold: fear not, for I am with you — I will strengthen you and uphold you.',
  'Matthew 19:14':
    'Jesus is on the road, blessing children the disciples wanted sent away. This verse is His word: let the little children come; do not forbid them.',
  'Nahum 1:7':
    'Nahum is announcing judgment on Nineveh’s cruelty. In the same breath this verse says the Lord is good, a strong hold in the day of trouble for those who trust Him.',
  'Nehemiah 8:10':
    'Ezra has read the law; the people are weeping. Nehemiah tells them this day is holy — the joy of the Lord is their strength, not their tears alone.',
  'Revelation 3:20':
    'John on Patmos writes the risen Christ’s letter to Laodicea. The verse: He stands at the door and knocks; if anyone opens, He will come in.',
  'Zephaniah 3:17':
    'Zephaniah has warned of the day of the Lord. The verse: the Lord in the midst of you is mighty; He will save and rejoice over you.',
  'Psalm 8:2':
    'David is looking at the night sky and human smallness. This verse says strength is ordained out of the mouth of babes — praise that stills the enemy.',
  'Hebrews 13:6':
    'The writer of Hebrews is telling a pressured church how to live. The verse: the Lord is my helper, and I will not fear what man can do.',
  'Luke 11:28':
    'A woman has just blessed Jesus’ mother. He answers with this verse: blessed are they that hear the word of God and keep it.',
  'Psalm 34:8':
    'David, after escaping Abimelech, teaches the gathered: taste and see that the Lord is good — this is invitation, not a report from far off.',
  'Psalm 100:5':
    'Israel is being called through the gates with thanksgiving. This verse is why: the Lord is good, His mercy everlasting, His truth to all generations.',
  'Psalm 91:1':
    'This is the refuge hymn — dwelling in the secret place of the Most High. This verse says the one who lives there stays under the shadow of the Almighty.',
  'Psalm 100:4':
    'Israel is being called to enter the Lord’s gates. This verse is how: with thanksgiving and praise — bless His name as you come in.',
  'Psalm 118:29':
    'This Hallelujah psalm is Israel’s thanks after rescue. This last line is the refrain: give thanks unto the Lord, for He is good; His mercy endures forever.',
  'Psalm 118:24':
    'Israel is in the Hallel, thanking the Lord after being rescued. The verse: this is the day the Lord has made; we will rejoice and be glad in it.',
  'Romans 8:31':
    'Paul is teaching Rome there is no condemnation in Christ. The verse: if God be for us, who can be against us?',
  'Hebrews 12:2':
    'The writer of Hebrews tells a pressured church to run with patience. The verse: looking unto Jesus, the author and finisher of our faith.',
  'Ephesians 3:20':
    'Paul writes from prison about the riches of Christ in the church. The verse: He is able to do exceeding abundantly above all we ask or think.',
  'Proverbs 3:5':
    'Solomon is teaching his son the fear of the Lord. The verse: trust in the Lord with all your heart, and do not lean on your own understanding.',
  '1 John 4:18':
    'John is teaching the church about perfect love. The verse: there is no fear in love; perfect love casts out fear.',
  'Matthew 5:3':
    'Jesus opens the Sermon on the Mount with blessings that turn the world upside down. This first one is for the poor in spirit — the kingdom is theirs.',
  'Matthew 6:26':
    'Jesus is on the mount teaching people not to worry. This verse points at the birds: your heavenly Father feeds them — you are worth more than they.',
  'Psalm 91:4':
    'This is the refuge hymn under the shadow of the Almighty. The verse: He shall cover you with His feathers, and under His wings you trust.',
  'Micah 6:8':
    'Micah is telling a people who want the right offering what God actually wants. The verse: do justly, love mercy, and walk humbly with your God.',
  'Joshua 1:8':
    'Joshua has just taken command. The verse: this law shall not depart; meditate in it day and night, so you may do it.',
  'Psalm 32:7':
    'David has confessed and been forgiven. The verse: You are my hiding place; You shall preserve me from trouble.',
  'Jeremiah 1:5':
    'Jeremiah is a youth being called to warn Judah. The verse: before I formed you in the belly I knew you; I ordained you a prophet.',
  '1 John 5:11':
    'John is writing that eternal life is in the Son. The verse: God has given us eternal life, and this life is in His Son.',
  'Psalm 86:15':
    'David is poor and needy, asking for mercy. This verse names who God is: a God full of compassion, gracious, longsuffering, and plenteous in mercy and truth.',
  'Psalm 107:8':
    'Book V opens with the redeemed giving thanks after desert, prison, sickness, and storm. The verse: oh that men would praise the Lord for His goodness.',
  'Joel 2:25':
    'Joel has called the people to repent after locust and drought. The verse: I will restore to you the years that the locust has eaten.',
  'Hebrews 6:19':
    'The writer of Hebrews is telling pressured believers to hold the promise. The verse: which hope we have as an anchor of the soul, sure and steadfast.',
  '1 Thessalonians 5:24':
    'Paul is comforting Thessalonica about the day of the Lord and holy living. The verse: faithful is He that calls you, who also will do it.',
  'Psalm 121:1-2':
    'A pilgrim song on the road up to Jerusalem. This verse lifts the eyes to the hills, then answers: help comes from the Lord, who made heaven and earth.',
  'Psalm 121:8':
    'Still on the ascent road: the Lord shall preserve your going out and your coming in, from this time forth and even forevermore.',
  'Colossians 3:23':
    'Paul is teaching Colosse to set their minds above and put on love. The verse: whatever you do, do it heartily, as to the Lord.',
  'Galatians 5:22':
    'Paul is teaching Galatia freedom in the Spirit, not a return to the law. This verse names the fruit: love, joy, peace, and the rest that the Spirit grows.',
  'Jeremiah 29:11':
    'Jeremiah writes to exiles in Babylon, not to a people going home tomorrow. This verse is God’s thought toward them: plans of peace, and a future.',
  '1 Peter 5:7':
    'Peter is writing to elect exiles under pressure. The verse: cast all your care on Him, for He cares for you.',
  '1 Corinthians 16:13':
    'Paul is closing the Corinth letter after the resurrection chapter. The verse: stand fast in the faith; be strong.',
  'Psalm 37:4':
    'David is teaching people not to fret when the wicked prosper. The verse: delight yourself also in the Lord, and He will give you the desires of your heart.',
  'Psalm 27:1':
    'David is seeking the Lord’s face under pressure. This opening line is the light: the Lord is my light and my salvation; whom shall I fear?',
  'Psalm 19:14':
    'David has just praised God in the sky and in the law. This last line is the prayer: let the words of my mouth and the meditation of my heart be acceptable.',
  'Psalm 34:18':
    'David, after escaping Abimelech, teaches the gathered. The verse: the Lord is near to the brokenhearted and saves those of a crushed spirit.',
  'Psalm 32:8':
    'David has confessed and been forgiven. The verse: I will instruct you and teach you in the way you should go.',
  'Psalm 40:1':
    'David has been in the pit and waited. The verse: I waited patiently for the Lord, and He inclined unto me and heard my cry.',
  'Psalm 42:11':
    'The sons of Korah are talking a downcast soul back toward hope. The verse: hope in God, for I shall yet praise Him.',
  'Psalm 103:13':
    'David is blessing the Lord who forgives and crowns with mercy. The verse: as a father pities his children, so the Lord pities those who fear Him.',
  'Psalm 145:9':
    'David is praising a forever kingdom. The verse: the Lord is good to all, and His tender mercies are over all His works.',
  '1 Timothy 4:12':
    'Paul is coaching Timothy how to lead in Ephesus. The verse: let no one despise your youth; be an example in word, love, and faith.',
  '2 Corinthians 9:8':
    'Paul is urging Corinth to give generously for the poor saints. The verse: God is able to make all grace abound, so you have enough for every good work.',
  'Psalm 36:7':
    'David is contrasting the wicked with God’s mercy. The verse: how excellent is Your lovingkindness; the children of men put their trust under Your wings.',
  'Psalm 4:7':
    'David is crying out at night while opposed. The verse: You have put gladness in my heart, more than in the time their grain and wine increased.',
  'Psalm 31:3':
    'David is committing himself to God under pressure. The verse: You are my rock and my fortress; therefore for Your name’s sake lead me and guide me.',
  'Psalm 33:4':
    'David is calling for a new song of praise. This verse is why: the word of the Lord is right, and all His works are done in truth.',
  'Psalm 37:5':
    'David is teaching people not to fret when the wicked prosper. The verse: commit your way unto the Lord; trust also in Him, and He shall bring it to pass.',
  'Psalm 59:16':
    'David is under Saul’s pursuit. The verse: I will sing of Your power; yes, I will sing aloud of Your mercy in the morning.',
  'Matthew 6:33':
    'Jesus is on the mount, teaching people not to worry about food and clothes. The verse: seek the kingdom of God and His righteousness.',
  'John 14:6':
    'Jesus is in the upper room the night before the cross, comforting troubled disciples. The verse: I am the way, the truth, and the life.',
  'Romans 8:28':
    'Paul is teaching Rome about life in the Spirit and a groaning creation. The verse: all things work together for good to them that love God.',
  'Psalm 46:7':
    'The sons of Korah sing while nations rage. The verse: the Lord of hosts is with us; the God of Jacob is our refuge.',
  'Psalm 119:11':
    'In the long acrostic love-song to God’s Word, this verse is the hiding: Your word have I hid in my heart, that I might not sin against You.',
  'Psalm 119:50':
    'Still in the long love-song to God’s Word, this verse is the comfort: this is my comfort in my affliction, for Your word has given me life.',
  'Psalm 119:165':
    'In the acrostic love-song to God’s Word, this verse is the peace: great peace have they which love Your law, and nothing shall offend them.',
  'Psalm 18:2':
    'David’s great victory song after deliverance from Saul. This verse names the Lord as rock, fortress, and deliverer — the one he runs to.',
  'Psalm 16:11':
    'David is trusting God with his portion and his cup. The verse: You will show me the path of life; in Your presence is fullness of joy.',
  'Psalm 27:14':
    'David has been seeking the Lord’s face under pressure. The verse: wait on the Lord; be of good courage.',
  'Psalm 28:7':
    'David is crying for help against the wicked. The verse: the Lord is his strength and shield; his heart trusted, and he is helped.',
  '1 Chronicles 16:34':
    'The ark has come to Jerusalem; David’s appointed singers give thanks. The verse: give thanks, for He is good; His mercy endures forever.',
  '1 Chronicles 16:11':
    'The ark is in the city; David’s psalm of thanks is being sung. The verse: seek the Lord and His strength; seek His face always.',
};

function isUglySetting(s) {
  const t = String(s || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (/;\./.test(t)) return true;
  if (/\b(of|the|and|or|a|with|under|from|by|who|which)\.$/.test(t)) return true;
  if (/\b(to the|for the|in the|of the|from the)\.$/.test(t)) return true;
  if (/,\s*”/.test(t) || /,.”/.test(t)) return true;
  if (/set inside [a-z][^.]{0,48}:/.test(t)) return true;
  if (/yours heart/i.test(t)) return true;
  if (/from from /i.test(t)) return true;
  if (/,\s+and a\./.test(t)) return true;
  if (/Hallelujah psalms:\s*$/i.test(t) || /hallelujah psalms:\./i.test(t)) return true;
  if (/^Hall of faith/i.test(t)) return true;
  if (/Songs of Ascents:\s*$/i.test(t)) return true;
  if (/This verse:\s*.{0,28}\.$/.test(t)) return true;
  if (/Here the words are .{0,36}\.$/.test(t)) return true;
  if (/\b(dwell in|lives in)\.$/.test(t)) return true;
  if (/Watch you,/.test(t)) return true;
  if (/\b(with|the|my|his|your|our|their|a|an|to|for|and|or|through)\.”/.test(t)) return true;
  if (/The line itself is /i.test(t)) return true;
  if (/The words here:/i.test(t)) return true;
  if (/in that setting\.?$/i.test(t)) return true;
  if (/Songs of Ascents:\s*$/i.test(t) || /songs of Ascents:\s*[—–-]/.test(t)) return true;
  if (/Sermon on the Mount:\s*$/.test(t) || /Sermon on the Mount:\s*The words/.test(t)) return true;
  if (/Jericho falls by faith/i.test(t)) return true;
  return false;
}

function okLine(line, ref, text) {
  const p = String(line || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!p || p.length < 40 || p.length > 220) return false;
  if (isFactorySetting(p)) return false;
  if (isUglySetting(p)) return false;
  if (startsWrong(p, ref)) return false;
  if (situationLooksWrongForRef(p, ref)) return false;
  const judged = evaluateTeachingFields({
    ref,
    setting: p,
    verseText: text,
  });
  if (!judged.ok) return false;
  return true;
}

function hashStyle(ref) {
  let h = 0;
  const s = String(ref || '');
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}

function buildSetting(ref, text, about) {
  if (HARD[ref] && okLine(HARD[ref], ref, text)) return HARD[ref];

  const frameBare = chapterFrame(ref, text).replace(/[.!?]$/, '');
  const quote = verseQuote(text);
  const who = whoLead(about, ref);
  const book = bookOf(ref);
  const style = hashStyle(ref) % 3;

  const candidates = [];
  if (/^Psalm/i.test(book)) {
    candidates.push(frameBare + '. This verse says, “' + quote + '.”');
    candidates.push('In this psalm — ' + uncap(frameBare) + ' — the line is, “' + quote + '.”');
    if (who) candidates.push(who + ' in that moment. The words are, “' + quote + '.”');
  } else if (gospelBook(ref)) {
    const jesusWho = who && /^jesus/i.test(who) ? 'Jesus' : who || 'Jesus';
    candidates.push(jesusWho + ' is in this moment — ' + uncap(frameBare) + '. He says, “' + quote + '.”');
    candidates.push(frameBare + ' This verse says, “' + quote + '.”');
    candidates.push('On that day — ' + uncap(frameBare) + ' — the words are, “' + quote + '.”');
  } else {
    if (who) {
      candidates.push(who + ' — ' + uncap(frameBare) + '. This verse says, “' + quote + '.”');
      candidates.push(who + ' in that setting. The line is, “' + quote + '.”');
    }
    candidates.push(frameBare + '. This verse says, “' + quote + '.”');
    candidates.push('In that moment — ' + uncap(frameBare) + ' — the words are, “' + quote + '.”');
  }

  const ordered = [];
  if (candidates[style]) ordered.push(candidates[style]);
  for (const c of candidates) {
    if (ordered.indexOf(c) === -1) ordered.push(c);
  }
  for (const c of ordered) {
    const line = endsSent(String(c).replace(/\s+/g, ' ').trim());
    if (okLine(line, ref, text)) return line;
  }

  const shortQ = firstClause(stripSuperscription(text), 48).replace(/[.!?]$/, '');
  const rescue = endsSent(frameBare + '. The line on the page is “' + shortQ + '.”');
  if (okLine(rescue, ref, text)) return rescue;
  const last = endsSent((who ? who + ' — ' : '') + frameBare + ' — “' + shortQ + '.”');
  if (okLine(last, ref, text)) return last.slice(0, 220);
  return rescue.slice(0, 220);
}

function needsRewrite(setting, ref, usedCount) {
  const s = String(setting || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (HARD[ref]) return s !== HARD[ref];
  if (!s || s.length < 40) return true;
  if (usedCount > 1) return true;
  if (isFactorySetting(s)) return true;
  if (isUglySetting(s)) return true;
  if (startsWrong(s, ref)) return true;
  if (situationLooksWrongForRef(s, ref)) return true;
  if (/This verse:|Here the words are|set inside /i.test(s)) return true;
  return false;
}

function uniquify(line, text, ref, used) {
  let next = endsSent(String(line || '').replace(/\s+/g, ' ').trim());
  const keyOf = (s) =>
    String(s || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  if (!used[keyOf(next)] || used[keyOf(next)] === ref) return next;
  const hook = verseQuote(text);
  const quoted = firstClause(stripSuperscription(text), 44).replace(/[.!?]$/, '');
  const tries = [
    next.replace(/[.!?]$/, '') + ' The words are: “' + quoted + '.”',
    next.replace(/[.!?]$/, '') + ' (' + hook + ')',
    endsSent(chapterFrame(ref, text)).replace(/[.!?]$/, '') + ' — “' + quoted + '.”',
  ];
  for (const t of tries) {
    const line2 = endsSent(String(t).replace(/\s+/g, ' ').trim()).slice(0, 220);
    if (okLine(line2, ref, text) && (!used[keyOf(line2)] || used[keyOf(line2)] === ref)) {
      return line2;
    }
  }
  const forced = (next.replace(/[.!?]$/, '') + ' — “' + quoted + '.”').slice(0, 220);
  return endsSent(forced);
}

function main() {
  const year = loadYear365(root);
  const src = loadExplanationsSrc();
  const parts = extractArrayLiteral(src);
  const rows = JSON.parse(parts.arraySrc);
  const byRef = Object.create(null);
  for (const row of rows) {
    if (row && row.ref) byRef[String(row.ref).replace(/\s*\(KJV\)\s*$/i, '').trim()] = row;
  }

  const counts = Object.create(null);
  for (const row of rows) {
    const k = String(row.setting || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!k) continue;
    counts[k] = (counts[k] || 0) + 1;
  }

  let need = 0;
  let kept = 0;
  const updates = Object.create(null);
  for (let i = 0; i < year.length; i++) {
    const cal = year[i];
    const ref = String(cal.ref || '')
      .replace(/\s*\(KJV\)\s*$/i, '')
      .trim();
    const row = byRef[ref];
    if (!row) continue;
    const text = String(cal.text || row.text || '').trim();
    const old = String(row.setting || '')
      .replace(/\s+/g, ' ')
      .trim();
    const usedCount = counts[old] || 0;
    if (!needsRewrite(old, ref, usedCount)) {
      kept += 1;
      continue;
    }
    updates[ref] = buildSetting(ref, text, row.about);
    need += 1;
  }

  const used = Object.create(null);
  for (const row of rows) {
    const ref = String(row.ref || '')
      .replace(/\s*\(KJV\)\s*$/i, '')
      .trim();
    if (updates[ref]) continue;
    const k = String(row.setting || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    if (k) used[k] = ref;
  }
  for (const [ref, setting] of Object.entries(updates)) {
    const row = byRef[ref] || {};
    const text = String((year.find((v) => v && v.ref === ref) || {}).text || row.text || '').trim();
    const next = uniquify(setting, text, ref, used);
    updates[ref] = next;
    used[next.toLowerCase()] = ref;
  }

  let written = 0;
  for (const row of rows) {
    const ref = String(row.ref || '')
      .replace(/\s*\(KJV\)\s*$/i, '')
      .trim();
    if (!updates[ref]) continue;
    row.setting = updates[ref];
    written += 1;
  }

  fs.writeFileSync(explPath, parts.before + JSON.stringify(rows, null, 2) + parts.after);

  const fresh = loadExplanations();
  const setCount = Object.create(null);
  let stillReuse = 0;
  let stillBad = 0;
  const leftover = [];
  for (const row of fresh) {
    const ref = String(row.ref || '').trim();
    const s = String(row.setting || '')
      .replace(/\s+/g, ' ')
      .trim();
    const k = s.toLowerCase();
    setCount[k] = (setCount[k] || 0) + 1;
    if (!okLine(s, ref, row.text) || isFactorySetting(s)) {
      stillBad += 1;
      if (leftover.length < 12) leftover.push(ref + ' | ' + s.slice(0, 90));
    }
  }
  const reused = Object.values(setCount).filter((n) => n > 1);
  stillReuse = reused.reduce((a, b) => a + b, 0);

  console.log(
    'rewrite-hero-730-settings: kept',
    kept,
    'rewrote',
    written,
    'unique',
    Object.keys(setCount).length,
    '/',
    fresh.length,
    'still-reuse-days',
    stillReuse,
    'still-bad',
    stillBad
  );
  if (leftover.length) {
    leftover.forEach((l) => console.log(' ·', l));
  }
  if (stillReuse > 0 || stillBad > 0) process.exitCode = 1;
}

main();
