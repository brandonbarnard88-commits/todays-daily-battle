#!/usr/bin/env node
/**
 * Book introductions — battle-minded summary + optional fight / anchor verses / small step.
 * Run: node scripts/build-book-intros.mjs
 * Consumed by reader.html, bible-tool.html, bible/tools.html (via book-intros.json).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, '..', 'book-intros.json');

/** One-line orientation for every book (required). */
const SUMMARY = {
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

/** Richer entries: fight, anchors, small step — same tone as word helps. */
const EXTENDED = {
  Genesis: {
    fight: 'Who is God, who are we, and what promise outlasts the fall? The fight is faith versus self-rule.',
    anchors: ['Genesis 1:1', 'Genesis 3:15', 'Genesis 12:1', 'Genesis 15:6', 'Genesis 50:20'],
    step: 'Trace one promise from Genesis 12 to Genesis 50 in a single sitting—watch God’s covenant stay steadier than His people.'
  },
  Psalm: {
    fight: 'How to talk with God when you are afraid, angry, glad, or numb—training for real life with Him.',
    anchors: ['Psalm 23:1', 'Psalm 27:1', 'Psalm 34:18', 'Psalm 55:22', 'Psalm 121:1'],
    step: 'Pick one psalm that fits your mood today, read it aloud slowly, then pray one line back to God.'
  },
  Romans: {
    fight: 'The deep diagnosis of sin and the glorious announcement of justification by faith alone, giving believers solid ground to stand on in every battle against guilt, shame, and the flesh.',
    anchors: ['Romans 3:23', 'Romans 5:1', 'Romans 6:14', 'Romans 8:1', 'Romans 8:28'],
    step: 'Meditate on one anchor verse slowly; let it remind you that your standing with God rests on Christ’s finished work, not your daily performance.'
  },
  Ephesians: {
    fight: 'From dead in sins to seated with Christ—unity in the body and armor for the long war.',
    anchors: ['Ephesians 1:3', 'Ephesians 2:8', 'Ephesians 4:1', 'Ephesians 6:10', 'Ephesians 6:11'],
    step: 'Memorize one short phrase from Ephesians 6:10–18 this week; say it before a hard conversation.'
  },
  John: {
    fight: 'Believing Jesus is the Christ—life in His name instead of a religion you manufacture.',
    anchors: ['John 1:12', 'John 3:16', 'John 14:6', 'John 14:27', 'John 20:31'],
    step: 'Read John 3–4 and notice who believes; ask the Lord to show you one person to pray for by name.'
  },
  James: {
    fight: 'Faith that shows in the tongue, the pocket, and the widow’s row—not empty words.',
    anchors: ['James 1:2', 'James 1:5', 'James 2:17', 'James 4:7', 'James 5:16'],
    step: 'James 1:5—ask God for wisdom for one concrete decision you face this week.'
  },
  Proverbs: {
    fight: 'The fear of the Lord first—then wisdom for mouth, money, and neighbor in a loud world.',
    anchors: ['Proverbs 1:7', 'Proverbs 3:5', 'Proverbs 15:1', 'Proverbs 18:10', 'Proverbs 22:6'],
    step: 'Read the Proverbs chapter that matches today’s date; circle one verse to obey before sunset.'
  },
  Philippians: {
    fight: 'Joy in chains and thorns—Christ is enough when feelings are not; humility and prayer beat performance.',
    anchors: ['Philippians 1:21', 'Philippians 1:29', 'Philippians 2:5', 'Philippians 4:11', 'Philippians 4:13'],
    step: 'Philippians 4:6–8—name one worry, pray with thanks, then pick one “whatsoever things” from verse 8 to rehearse today. Open Battle Plans for verse-led tracks that draw on Philippians.'
  },
  '2 Corinthians': {
    fight: 'Comfort in affliction first—then pour it out; God’s strength lands in cracked jars, not polished speeches.',
    anchors: ['2 Corinthians 1:4', '2 Corinthians 4:7', '2 Corinthians 4:17', '2 Corinthians 5:17', '2 Corinthians 12:9'],
    step: 'Read 2 Corinthians 1:3–7 slowly—thank God for one way He comforted you that you can pass on to someone else this week.'
  },
  Matthew: {
    fight: 'Kingdom of heaven versus anxiety, performance, and the need to look righteous—Jesus goes for the heart first.',
    anchors: ['Matthew 5:3', 'Matthew 6:33', 'Matthew 11:28', 'Matthew 16:16', 'Matthew 28:18'],
    step: 'Read Matthew 5–7 across a week (one chapter a day) and mark one command that names you kindly.'
  },
  '1 Corinthians': {
    fight: 'Cross-shaped wisdom where the city loves status and noise—love that never fails when gifts do not.',
    anchors: ['1 Corinthians 1:18', '1 Corinthians 13:4', '1 Corinthians 15:3', '1 Corinthians 15:58', '1 Corinthians 16:14'],
    step: 'Read 1 Corinthians 13:4–7 aloud; underline one line that corrects you—pray it for your church.'
  },
  Hebrews: {
    fight: 'Will you drift from Christ, or draw near to a Priest who sat down because the work finished?',
    anchors: ['Hebrews 4:15', 'Hebrews 6:19', 'Hebrews 10:23', 'Hebrews 11:1', 'Hebrews 12:2'],
    step: 'Read Hebrews 10:19–25 aloud and pick one “let us” to obey before the week ends.'
  },
  '1 Peter': {
    fight: 'Holy living in exile when the world mislabels you—honor without fear; hope under fire.',
    anchors: ['1 Peter 1:3', '1 Peter 2:9', '1 Peter 3:15', '1 Peter 4:12', '1 Peter 5:7'],
    step: 'Name one care you rehearse in your mind; pray 1 Peter 5:7 slowly, then leave it with God in one written sentence.'
  },
  Revelation: {
    fight: 'Jesus is Lord over empire, fear, and the final lie—so hold fast until He comes.',
    anchors: ['Revelation 1:1', 'Revelation 3:20', 'Revelation 5:9', 'Revelation 19:16', 'Revelation 22:20'],
    step: 'Read one letter to the churches in Revelation 2–3; ask what Jesus says to small, tired congregations.'
  },
  Galatians: {
    fight: 'Freedom in Christ versus slavery to law-as-performance—faith working through love, not scoring points.',
    anchors: ['Galatians 2:20', 'Galatians 3:26', 'Galatians 4:6', 'Galatians 5:1', 'Galatians 6:9'],
    step: 'Galatians 5:22–23—circle one fruit you need the Spirit to grow this week; pray for it morning and night.'
  },
  Isaiah: {
    fight: 'Holy judgment and tender comfort in one voice—light to the nations, a Servant who bears what we cannot.',
    anchors: ['Isaiah 6:8', 'Isaiah 40:31', 'Isaiah 53:5', 'Isaiah 55:1', 'Isaiah 61:1'],
    step: 'Read Isaiah 53 once slowly; write one line you need Jesus to carry for you today.'
  },
  Job: {
    fight: 'Suffering without a tidy verdict—friends miss God; God answers out of the storm, not the courtroom.',
    anchors: ['Job 1:21', 'Job 13:15', 'Job 19:25', 'Job 23:10', 'Job 42:5'],
    step: 'Job 13:15—finish the sentence in your own words: “Though He slay me, yet will I __________ in Him.”'
  },
  Colossians: {
    fight: 'Fullness in Christ versus empty philosophy—your life is hidden in Him; put on love which binds peace.',
    anchors: ['Colossians 1:18', 'Colossians 2:10', 'Colossians 3:1', 'Colossians 3:14', 'Colossians 3:23'],
    step: 'Colossians 3:12–14—pick one “put on” and one “put off” for this week; keep it small and honest.'
  },
  Mark: {
    fight: 'The Servant who moves with urgency—cross before crown; who do you say the suffering Son of Man is?',
    anchors: ['Mark 1:15', 'Mark 8:34', 'Mark 9:24', 'Mark 10:45', 'Mark 16:15'],
    step: 'Read Mark 8:34–38 in one sitting; ask what “deny himself” looks like in one concrete area of your day.'
  },
  Luke: {
    fight: 'The careful, compassionate record of Jesus reaching the outsider, the broken, and the lost — showing that the Kingdom belongs to the least and the lowly.',
    anchors: ['Luke 4:18', 'Luke 5:31', 'Luke 15:20', 'Luke 19:10', 'Luke 23:43'],
    step: 'Read the parable or story attached to one anchor today and notice who Jesus is reaching — then bring one “outsider” situation in your own life to Him in prayer.'
  },
  Acts: {
    fight: 'The explosive spread of the gospel through ordinary, Spirit-filled people facing opposition, persecution, and cultural clash — proving the church is built by God, not human strategy.',
    anchors: ['Acts 1:8', 'Acts 2:42', 'Acts 4:31', 'Acts 8:4', 'Acts 28:31'],
    step: 'Pick one anchor and ask the Lord to fill you with the same boldness and dependence the early believers showed, even in small, everyday moments.'
  },
  '1 Samuel': {
    fight: 'The turbulent transition from judges to kings, exposing the human heart’s demand for a visible leader while God raises a man after His own heart — teaching us to trust God’s timing and choice over our own.',
    anchors: ['1 Samuel 8:7', '1 Samuel 13:14', '1 Samuel 15:22', '1 Samuel 16:7', '1 Samuel 17:45'],
    step: 'When you feel pressure to choose a “king” (quick fix, strong personality, or visible solution), pause and speak one anchor verse, asking God to search your heart and give you His perspective.'
  },
  Daniel: {
    fight: 'Faithful obedience and bold witness while living as exiles under hostile empires — showing that God is sovereign over kings, lions, and fiery trials, and that He delivers and reveals His plans to those who stand firm.',
    anchors: ['Daniel 1:8', 'Daniel 2:20', 'Daniel 3:17', 'Daniel 6:10', 'Daniel 9:19'],
    step: 'Choose one area where compromise feels easy this week and resolve, like Daniel, to stay faithful in the small daily discipline — then watch how God honors that stand.'
  }
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

const payload = {
  version: 6,
  about:
    'Book introductions: short orientation, optional “fight,” anchor verses, and a small step. KJV-only site; human tone. v6 adds Luke, Acts, 1 Samuel, Daniel; refreshes Romans.',
  bookOrder: order,
  books: {}
};

for (const b of order) {
  const summary = SUMMARY[b] || 'God speaks in this book; read slowly and ask what truth He means for your fight today.';
  const extra = EXTENDED[b];
  if (extra) {
    payload.books[b] = {
      summary,
      fight: extra.fight,
      anchors: extra.anchors,
      step: extra.step
    };
  } else {
    payload.books[b] = { summary };
  }
}

fs.writeFileSync(out, JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log('Wrote', out, Object.keys(payload.books).length, 'books (v' + payload.version + ')');
