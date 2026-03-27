#!/usr/bin/env node
/**
 * One short battle-minded line per KJV book (human tone, no hype).
 * Run: node scripts/build-book-intros.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, '..', 'book-intros.json');

const intros = {
  Genesis: 'Creation, fall, and promise: God keeps covenant when people fail. The long war between faith and self-rule starts here.',
  Exodus: 'Rescue and law: God hears the cry of the burdened and teaches a freed people how to walk with Him.',
  Leviticus: 'Holiness in daily life: sacrifice, purity, and nearness to God—grace and boundary for a camp at war with sin.',
  Numbers: 'Wilderness years: grumbling versus trust; God stays faithful through forty years of testing.',
  Deuteronomy: 'Second law, same heart: remember what God did, choose life, teach the next generation before battle.',
  Joshua: 'Taking ground: courage, obedience, and one generation that must decide whom they will serve.',
  Judges: 'Cycles of compromise: when everyone does what is right in their own eyes, God still raises deliverers.',
  Ruth: 'Loyalty and redemption: ordinary faithfulness in famine; God weaves a Moabitess into the line of the King.',
  '1 Samuel': 'Kingship begins: God’s prophet, a flawed king, and the search for a heart after God.',
  '2 Samuel': 'David’s reign: triumph, sin, and consequence—grace that does not erase accountability.',
  '1 Kings': 'Temple and split: wisdom, idolatry, and the question of who is really on the throne.',
  '2 Kings': 'Prophets and exile: last chances, judgment, and the hope that God is not finished with His people.',
  '1 Chronicles': 'Genealogy and worship: Israel’s story retold for those who need to remember who they are.',
  '2 Chronicles': 'Kings and temple: revival, pride, and exile—God’s eyes still run to and fro the earth.',
  Ezra: 'Return and rebuild: Scripture read again; holiness and courage after shame.',
  Nehemiah: 'Walls and hearts: prayer, work, and opposition—leadership that weeps then acts.',
  Esther: 'Hidden providence: no verse names God, yet deliverance for His people is unmistakable.',
  Job: 'Suffering and silence: friends miss the mark; God answers out of the whirlwind, not the courtroom.',
  Psalm: 'Prayer book for battle: lament, trust, thanks, and kingship—honest words for honest days.',
  Proverbs: 'Wisdom for the path: fear of the Lord first; practical sense for mouth, money, and neighbor.',
  Ecclesiastes: 'Vanity under the sun: life without God as center is smoke; fear God and keep His commandments.',
  'Song of Solomon': 'Love and desire: covenant affection within God’s order; read also as echo of God and His people.',
  Isaiah: 'Judgment and comfort: holy King, suffering Servant, new creation—light for nations in darkness.',
  Jeremiah: 'Tears and truth: a prophet who loves the city God must discipline; a new covenant on the heart.',
  Lamentations: 'Grief in ruins: honest sorrow after fall; yet “great is thy faithfulness” still stands.',
  Ezekiel: 'Glory and exile: visions of God’s presence leaving and returning; hearts of stone to hearts of flesh.',
  Daniel: 'Faith in empire: prayer when law forbids it; God rules the beasts and the years.',
  Hosea: 'Unfaithful love: God’s steadfastness to a people who play the harlot; mercy over sacrifice.',
  Joel: 'Day of the Lord: locusts, repentance, and Spirit poured out—wake up before it is too late.',
  Amos: 'Justice for the poor: worship without righteousness is noise; let justice run down as waters.',
  Obadiah: 'Pride of Edom: God judges those who gloat over Jacob’s hurt; the kingdom belongs to the Lord.',
  Jonah: 'Mercy beyond borders: a prophet who runs; Nineveh repents; God cares for cattle and city alike.',
  Micah: 'Do justly, love mercy: small-town prophet; Bethlehem named; God pardons the remnant.',
  Nahum: 'Nineveh’s fall: God is slow to anger but not soft on cruelty; comfort for the oppressed.',
  Habakkuk: 'Why evil prospers: faith that waits though the fig tree fails; joy in the God who saves.',
  Zephaniah: 'Day near at hand: silence before God; joy for the humble remnant when the King reigns.',
  Haggai: 'Rebuild the house: post-exile lethargy; God’s glory worth more than paneled homes.',
  Zechariah: 'Visions and branches: return, cleanse, and look—your King comes lowly on a colt.',
  Malachi: 'Covenant weariness: “Wherein hast thou loved us?” God answers; Elijah’s spirit before the great day.',
  Matthew: 'Kingdom of heaven: Jesus as promised King, teacher, and sacrifice—God with us to the end.',
  Mark: 'Servant who rushes: immediacy, cross before crown; who do men say that I am?',
  Luke: 'Son of Man for outsiders: mercy, meals, and a journey to Jerusalem for the world’s life.',
  John: 'Believe: signs point to the Word made flesh; life in His name for those who trust.',
  Acts: 'Witness in power: the Spirit spreads the church from Jerusalem to Rome—doors open, stones fly.',
  Romans: 'Gospel unpacked: wrath, grace, union with Christ, one body—obedience from faith for all nations.',
  '1 Corinthians': 'Church in a city: cross-shaped wisdom, body life, love that never fails.',
  '2 Corinthians': 'Weakness as strength: Paul’s thorn; treasure in earthen vessels; reconciliation ministry.',
  Galatians: 'Freedom: not circumcision but faith working through love—stand fast in liberty.',
  Ephesians: 'Seated with Christ: one new man, armor for the long war, prayer for all saints.',
  Philippians: 'Joy in chains: Christ magnified in life or death; mind of humility as His.',
  Colossians: 'Fullness in Christ: not philosophy or rule; put off old man, put on love which binds.',
  '1 Thessalonians': 'Hope of His coming: dead in Christ rise first; comfort one another with these words.',
  '2 Thessalonians': 'Steadfast under rumor: don’t be shaken; pray God counts you worthy of His calling.',
  '1 Timothy': 'Order in the house: faithful sayings, widows, elders—fight the good fight.',
  '2 Timothy': 'Last charge: Scripture God-breathed; endure hardship; crown laid up.',
  Titus: 'Sound doctrine on Crete: older saints, younger saints, grace that teaches sober living.',
  Philemon: 'Onesimus: gospel rewrites a slave letter; love beyond what is required.',
  Hebrews: 'Better: Christ over angels, Moses, priesthood—draw near, hold fast, stir up love.',
  James: 'Faith that works: trials, tongue, care for widows—show me thy faith without works.',
  '1 Peter': 'Strangers scattered: suffering honorably; hope living in fearful hearts.',
  '2 Peter': 'Remember: false teachers, day of the Lord, grow in grace and knowledge.',
  '1 John': 'Know you have life: light, love, spirit of antichrist—believe on the Son.',
  '2 John': 'Walk in truth: do not bid false teachers God speed—love with discernment.',
  '3 John': 'Hospitality and Diotrephes: support those who go forth for the name.',
  Jude: 'Contend once delivered: examples of judgment; keep in God’s love.',
  Revelation: 'Jesus wins: letters, seals, trumpets, King of kings—no more curse; come, Lord Jesus.'
};

const order = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job',
  'Psalm', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
  'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
  'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

const payload = { version: 1, about: 'Short book intros for chapter reader — KJV site, battle-minded tone.', books: {} };
for (const b of order) {
  payload.books[b] = intros[b] || 'God speaks in this book; read slowly and ask what truth He means for your fight today.';
}

fs.writeFileSync(out, JSON.stringify(payload, null, 0) + '\n', 'utf8');
console.log('Wrote', out, Object.keys(payload.books).length, 'books');
