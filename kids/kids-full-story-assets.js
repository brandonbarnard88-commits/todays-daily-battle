/**
 * Full-length Bible story videos + WebVTT read-along.
 * AUTO-GENERATED: keys match TDB_BIBLE_STORIES in kids-battle.js (181 stories).
 * Regenerate: node scripts/generate-kids-full-story-assets.js
 * Paths use kebab-case story keys under /media/kids-stories/
 * Playback is gated: add a key to FULL_STORY_LIVE_KEYS when mp4+vtt are deployed.
 */
(function (global) {
  'use strict';

  /**
   * When a story key is listed here, the modal uses <video> + <track> for that story.
   * Add keys gradually as you ship each full animation + captions.
   * To enable all at once (after full rollout), replace with: new Set(Object.keys(FULL_STORY_MEDIA))
   */
  var FULL_STORY_LIVE_KEYS = new Set([]);

  /** @type {Object.<string, Object>} */
  var FULL_STORY_MEDIA = {
    abigailWise: {
      mp4: '/media/kids-stories/abigail-wise.mp4',
      webm: '/media/kids-stories/abigail-wise.webm',
      captionsVtt: '/media/kids-stories/abigail-wise.vtt'
    },
    abrahamIsaac: {
      mp4: '/media/kids-stories/abraham-isaac.mp4',
      webm: '/media/kids-stories/abraham-isaac.webm',
      captionsVtt: '/media/kids-stories/abraham-isaac.vtt'
    },
    adamEve: {
      mp4: '/media/kids-stories/adam-eve.mp4',
      webm: '/media/kids-stories/adam-eve.webm',
      captionsVtt: '/media/kids-stories/adam-eve.vtt'
    },
    alphaOmega: {
      mp4: '/media/kids-stories/alpha-omega.mp4',
      webm: '/media/kids-stories/alpha-omega.webm',
      captionsVtt: '/media/kids-stories/alpha-omega.vtt'
    },
    alphaOmega2: {
      mp4: '/media/kids-stories/alpha-omega2.mp4',
      webm: '/media/kids-stories/alpha-omega2.webm',
      captionsVtt: '/media/kids-stories/alpha-omega2.vtt'
    },
    angelMary: {
      mp4: '/media/kids-stories/angel-mary.mp4',
      webm: '/media/kids-stories/angel-mary.webm',
      captionsVtt: '/media/kids-stories/angel-mary.vtt'
    },
    annaProphet: {
      mp4: '/media/kids-stories/anna-prophet.mp4',
      webm: '/media/kids-stories/anna-prophet.webm',
      captionsVtt: '/media/kids-stories/anna-prophet.vtt'
    },
    armorBelt: {
      mp4: '/media/kids-stories/armor-belt.mp4',
      webm: '/media/kids-stories/armor-belt.webm',
      captionsVtt: '/media/kids-stories/armor-belt.vtt'
    },
    armorOfGod: {
      mp4: '/media/kids-stories/armor-of-god.mp4',
      webm: '/media/kids-stories/armor-of-god.webm',
      captionsVtt: '/media/kids-stories/armor-of-god.vtt'
    },
    armorShield: {
      mp4: '/media/kids-stories/armor-shield.mp4',
      webm: '/media/kids-stories/armor-shield.webm',
      captionsVtt: '/media/kids-stories/armor-shield.vtt'
    },
    armorSword: {
      mp4: '/media/kids-stories/armor-sword.mp4',
      webm: '/media/kids-stories/armor-sword.webm',
      captionsVtt: '/media/kids-stories/armor-sword.vtt'
    },
    ascension: {
      mp4: '/media/kids-stories/ascension.mp4',
      webm: '/media/kids-stories/ascension.webm',
      captionsVtt: '/media/kids-stories/ascension.vtt'
    },
    balaakCurse: {
      mp4: '/media/kids-stories/balaak-curse.mp4',
      webm: '/media/kids-stories/balaak-curse.webm',
      captionsVtt: '/media/kids-stories/balaak-curse.vtt'
    },
    balaamBlessing: {
      mp4: '/media/kids-stories/balaam-blessing.mp4',
      webm: '/media/kids-stories/balaam-blessing.webm',
      captionsVtt: '/media/kids-stories/balaam-blessing.vtt'
    },
    balaamDonkey: {
      mp4: '/media/kids-stories/balaam-donkey.mp4',
      webm: '/media/kids-stories/balaam-donkey.webm',
      captionsVtt: '/media/kids-stories/balaam-donkey.vtt'
    },
    battleOfAi: {
      mp4: '/media/kids-stories/battle-of-ai.mp4',
      webm: '/media/kids-stories/battle-of-ai.webm',
      captionsVtt: '/media/kids-stories/battle-of-ai.vtt'
    },
    beastMark: {
      mp4: '/media/kids-stories/beast-mark.mp4',
      webm: '/media/kids-stories/beast-mark.webm',
      captionsVtt: '/media/kids-stories/beast-mark.vtt'
    },
    betrayal: {
      mp4: '/media/kids-stories/betrayal.mp4',
      webm: '/media/kids-stories/betrayal.webm',
      captionsVtt: '/media/kids-stories/betrayal.vtt'
    },
    burningBush: {
      mp4: '/media/kids-stories/burning-bush.mp4',
      webm: '/media/kids-stories/burning-bush.webm',
      captionsVtt: '/media/kids-stories/burning-bush.vtt'
    },
    cainAbel: {
      mp4: '/media/kids-stories/cain-abel.mp4',
      webm: '/media/kids-stories/cain-abel.webm',
      captionsVtt: '/media/kids-stories/cain-abel.vtt'
    },
    comeLordJesus: {
      mp4: '/media/kids-stories/come-lord-jesus.mp4',
      webm: '/media/kids-stories/come-lord-jesus.webm',
      captionsVtt: '/media/kids-stories/come-lord-jesus.vtt'
    },
    creation: {
      mp4: '/media/kids-stories/creation.mp4',
      webm: '/media/kids-stories/creation.webm',
      captionsVtt: '/media/kids-stories/creation.vtt'
    },
    creationLight: {
      mp4: '/media/kids-stories/creation-light.mp4',
      webm: '/media/kids-stories/creation-light.webm',
      captionsVtt: '/media/kids-stories/creation-light.vtt'
    },
    crossCarry: {
      mp4: '/media/kids-stories/cross-carry.mp4',
      webm: '/media/kids-stories/cross-carry.webm',
      captionsVtt: '/media/kids-stories/cross-carry.vtt'
    },
    crucifixion: {
      mp4: '/media/kids-stories/crucifixion.mp4',
      webm: '/media/kids-stories/crucifixion.webm',
      captionsVtt: '/media/kids-stories/crucifixion.vtt'
    },
    daniel: {
      mp4: '/media/kids-stories/daniel.mp4',
      webm: '/media/kids-stories/daniel.webm',
      captionsVtt: '/media/kids-stories/daniel.vtt'
    },
    danielPray: {
      mp4: '/media/kids-stories/daniel-pray.mp4',
      webm: '/media/kids-stories/daniel-pray.webm',
      captionsVtt: '/media/kids-stories/daniel-pray.vtt'
    },
    david: {
      mp4: '/media/kids-stories/david.mp4',
      webm: '/media/kids-stories/david.webm',
      captionsVtt: '/media/kids-stories/david.vtt'
    },
    davidAnointed: {
      mp4: '/media/kids-stories/david-anointed.mp4',
      webm: '/media/kids-stories/david-anointed.webm',
      captionsVtt: '/media/kids-stories/david-anointed.vtt'
    },
    davidCave: {
      mp4: '/media/kids-stories/david-cave.mp4',
      webm: '/media/kids-stories/david-cave.webm',
      captionsVtt: '/media/kids-stories/david-cave.vtt'
    },
    davidHarp: {
      mp4: '/media/kids-stories/david-harp.mp4',
      webm: '/media/kids-stories/david-harp.webm',
      captionsVtt: '/media/kids-stories/david-harp.vtt'
    },
    davidSheep: {
      mp4: '/media/kids-stories/david-sheep.mp4',
      webm: '/media/kids-stories/david-sheep.webm',
      captionsVtt: '/media/kids-stories/david-sheep.vtt'
    },
    deborahJudge: {
      mp4: '/media/kids-stories/deborah-judge.mp4',
      webm: '/media/kids-stories/deborah-judge.webm',
      captionsVtt: '/media/kids-stories/deborah-judge.vtt'
    },
    dorcasRaise: {
      mp4: '/media/kids-stories/dorcas-raise.mp4',
      webm: '/media/kids-stories/dorcas-raise.webm',
      captionsVtt: '/media/kids-stories/dorcas-raise.vtt'
    },
    dragonFight: {
      mp4: '/media/kids-stories/dragon-fight.mp4',
      webm: '/media/kids-stories/dragon-fight.webm',
      captionsVtt: '/media/kids-stories/dragon-fight.vtt'
    },
    elijahChariot: {
      mp4: '/media/kids-stories/elijah-chariot.mp4',
      webm: '/media/kids-stories/elijah-chariot.webm',
      captionsVtt: '/media/kids-stories/elijah-chariot.vtt'
    },
    elijahFire: {
      mp4: '/media/kids-stories/elijah-fire.mp4',
      webm: '/media/kids-stories/elijah-fire.webm',
      captionsVtt: '/media/kids-stories/elijah-fire.vtt'
    },
    elishaOil: {
      mp4: '/media/kids-stories/elisha-oil.mp4',
      webm: '/media/kids-stories/elisha-oil.webm',
      captionsVtt: '/media/kids-stories/elisha-oil.vtt'
    },
    elishaRaised: {
      mp4: '/media/kids-stories/elisha-raised.mp4',
      webm: '/media/kids-stories/elisha-raised.webm',
      captionsVtt: '/media/kids-stories/elisha-raised.vtt'
    },
    emmausRoad: {
      mp4: '/media/kids-stories/emmaus-road.mp4',
      webm: '/media/kids-stories/emmaus-road.webm',
      captionsVtt: '/media/kids-stories/emmaus-road.vtt'
    },
    esther: {
      mp4: '/media/kids-stories/esther.mp4',
      webm: '/media/kids-stories/esther.webm',
      captionsVtt: '/media/kids-stories/esther.vtt'
    },
    estherBanquet: {
      mp4: '/media/kids-stories/esther-banquet.mp4',
      webm: '/media/kids-stories/esther-banquet.webm',
      captionsVtt: '/media/kids-stories/esther-banquet.vtt'
    },
    estherCrown: {
      mp4: '/media/kids-stories/esther-crown.mp4',
      webm: '/media/kids-stories/esther-crown.webm',
      captionsVtt: '/media/kids-stories/esther-crown.vtt'
    },
    estherFast: {
      mp4: '/media/kids-stories/esther-fast.mp4',
      webm: '/media/kids-stories/esther-fast.webm',
      captionsVtt: '/media/kids-stories/esther-fast.vtt'
    },
    euniceMother: {
      mp4: '/media/kids-stories/eunice-mother.mp4',
      webm: '/media/kids-stories/eunice-mother.webm',
      captionsVtt: '/media/kids-stories/eunice-mother.vtt'
    },
    everyKneeBow: {
      mp4: '/media/kids-stories/every-knee-bow.mp4',
      webm: '/media/kids-stories/every-knee-bow.webm',
      captionsVtt: '/media/kids-stories/every-knee-bow.vtt'
    },
    faithMountain: {
      mp4: '/media/kids-stories/faith-mountain.mp4',
      webm: '/media/kids-stories/faith-mountain.webm',
      captionsVtt: '/media/kids-stories/faith-mountain.vtt'
    },
    faithMustard: {
      mp4: '/media/kids-stories/faith-mustard.mp4',
      webm: '/media/kids-stories/faith-mustard.webm',
      captionsVtt: '/media/kids-stories/faith-mustard.vtt'
    },
    fallOfJericho: {
      mp4: '/media/kids-stories/fall-of-jericho.mp4',
      webm: '/media/kids-stories/fall-of-jericho.webm',
      captionsVtt: '/media/kids-stories/fall-of-jericho.vtt'
    },
    fieryFurnace: {
      mp4: '/media/kids-stories/fiery-furnace.mp4',
      webm: '/media/kids-stories/fiery-furnace.webm',
      captionsVtt: '/media/kids-stories/fiery-furnace.vtt'
    },
    forgive70x7: {
      mp4: '/media/kids-stories/forgive70x7.mp4',
      webm: '/media/kids-stories/forgive70x7.webm',
      captionsVtt: '/media/kids-stories/forgive70x7.vtt'
    },
    fourHorsemen: {
      mp4: '/media/kids-stories/four-horsemen.mp4',
      webm: '/media/kids-stories/four-horsemen.webm',
      captionsVtt: '/media/kids-stories/four-horsemen.vtt'
    },
    fruitSpirit: {
      mp4: '/media/kids-stories/fruit-spirit.mp4',
      webm: '/media/kids-stories/fruit-spirit.webm',
      captionsVtt: '/media/kids-stories/fruit-spirit.vtt'
    },
    gardenPrayer: {
      mp4: '/media/kids-stories/garden-prayer.mp4',
      webm: '/media/kids-stories/garden-prayer.webm',
      captionsVtt: '/media/kids-stories/garden-prayer.vtt'
    },
    goldenCalf: {
      mp4: '/media/kids-stories/golden-calf.mp4',
      webm: '/media/kids-stories/golden-calf.webm',
      captionsVtt: '/media/kids-stories/golden-calf.vtt'
    },
    goliathChallenge: {
      mp4: '/media/kids-stories/goliath-challenge.mp4',
      webm: '/media/kids-stories/goliath-challenge.webm',
      captionsVtt: '/media/kids-stories/goliath-challenge.vtt'
    },
    goodSamaritan: {
      mp4: '/media/kids-stories/good-samaritan.mp4',
      webm: '/media/kids-stories/good-samaritan.webm',
      captionsVtt: '/media/kids-stories/good-samaritan.vtt'
    },
    greatCommission: {
      mp4: '/media/kids-stories/great-commission.mp4',
      webm: '/media/kids-stories/great-commission.webm',
      captionsVtt: '/media/kids-stories/great-commission.vtt'
    },
    hannahPray: {
      mp4: '/media/kids-stories/hannah-pray.mp4',
      webm: '/media/kids-stories/hannah-pray.webm',
      captionsVtt: '/media/kids-stories/hannah-pray.vtt'
    },
    healBlind: {
      mp4: '/media/kids-stories/heal-blind.mp4',
      webm: '/media/kids-stories/heal-blind.webm',
      captionsVtt: '/media/kids-stories/heal-blind.vtt'
    },
    healLeper: {
      mp4: '/media/kids-stories/heal-leper.mp4',
      webm: '/media/kids-stories/heal-leper.webm',
      captionsVtt: '/media/kids-stories/heal-leper.vtt'
    },
    heavenDoor: {
      mp4: '/media/kids-stories/heaven-door.mp4',
      webm: '/media/kids-stories/heaven-door.webm',
      captionsVtt: '/media/kids-stories/heaven-door.vtt'
    },
    heavenPromise: {
      mp4: '/media/kids-stories/heaven-promise.mp4',
      webm: '/media/kids-stories/heaven-promise.webm',
      captionsVtt: '/media/kids-stories/heaven-promise.vtt'
    },
    jacobLadder: {
      mp4: '/media/kids-stories/jacob-ladder.mp4',
      webm: '/media/kids-stories/jacob-ladder.webm',
      captionsVtt: '/media/kids-stories/jacob-ladder.vtt'
    },
    jaelTent: {
      mp4: '/media/kids-stories/jael-tent.mp4',
      webm: '/media/kids-stories/jael-tent.webm',
      captionsVtt: '/media/kids-stories/jael-tent.vtt'
    },
    jairus: {
      mp4: '/media/kids-stories/jairus.mp4',
      webm: '/media/kids-stories/jairus.webm',
      captionsVtt: '/media/kids-stories/jairus.vtt'
    },
    jerichoWalls: {
      mp4: '/media/kids-stories/jericho-walls.mp4',
      webm: '/media/kids-stories/jericho-walls.webm',
      captionsVtt: '/media/kids-stories/jericho-walls.vtt'
    },
    jesus: {
      mp4: '/media/kids-stories/jesus.mp4',
      webm: '/media/kids-stories/jesus.webm',
      captionsVtt: '/media/kids-stories/jesus.vtt'
    },
    jesusBirth: {
      mp4: '/media/kids-stories/jesus-birth.mp4',
      webm: '/media/kids-stories/jesus-birth.webm',
      captionsVtt: '/media/kids-stories/jesus-birth.vtt'
    },
    jesusBlessKids: {
      mp4: '/media/kids-stories/jesus-bless-kids.mp4',
      webm: '/media/kids-stories/jesus-bless-kids.webm',
      captionsVtt: '/media/kids-stories/jesus-bless-kids.vtt'
    },
    jesusCalmsStorm: {
      mp4: '/media/kids-stories/jesus-calms-storm.mp4',
      webm: '/media/kids-stories/jesus-calms-storm.webm',
      captionsVtt: '/media/kids-stories/jesus-calms-storm.vtt'
    },
    jesusFeeds5000: {
      mp4: '/media/kids-stories/jesus-feeds5000.mp4',
      webm: '/media/kids-stories/jesus-feeds5000.webm',
      captionsVtt: '/media/kids-stories/jesus-feeds5000.vtt'
    },
    jesusManger: {
      mp4: '/media/kids-stories/jesus-manger.mp4',
      webm: '/media/kids-stories/jesus-manger.webm',
      captionsVtt: '/media/kids-stories/jesus-manger.vtt'
    },
    jesusTemple: {
      mp4: '/media/kids-stories/jesus-temple.mp4',
      webm: '/media/kids-stories/jesus-temple.webm',
      captionsVtt: '/media/kids-stories/jesus-temple.vtt'
    },
    jesusTempt: {
      mp4: '/media/kids-stories/jesus-tempt.mp4',
      webm: '/media/kids-stories/jesus-tempt.webm',
      captionsVtt: '/media/kids-stories/jesus-tempt.vtt'
    },
    jesusTemptation: {
      mp4: '/media/kids-stories/jesus-temptation.mp4',
      webm: '/media/kids-stories/jesus-temptation.webm',
      captionsVtt: '/media/kids-stories/jesus-temptation.vtt'
    },
    jesusWalksWater: {
      mp4: '/media/kids-stories/jesus-walks-water.mp4',
      webm: '/media/kids-stories/jesus-walks-water.webm',
      captionsVtt: '/media/kids-stories/jesus-walks-water.vtt'
    },
    jobSuffering: {
      mp4: '/media/kids-stories/job-suffering.mp4',
      webm: '/media/kids-stories/job-suffering.webm',
      captionsVtt: '/media/kids-stories/job-suffering.vtt'
    },
    johnBaptize: {
      mp4: '/media/kids-stories/john-baptize.mp4',
      webm: '/media/kids-stories/john-baptize.webm',
      captionsVtt: '/media/kids-stories/john-baptize.vtt'
    },
    jonah: {
      mp4: '/media/kids-stories/jonah.mp4',
      webm: '/media/kids-stories/jonah.webm',
      captionsVtt: '/media/kids-stories/jonah.vtt'
    },
    jonahVine: {
      mp4: '/media/kids-stories/jonah-vine.mp4',
      webm: '/media/kids-stories/jonah-vine.webm',
      captionsVtt: '/media/kids-stories/jonah-vine.vtt'
    },
    jordanCrossing: {
      mp4: '/media/kids-stories/jordan-crossing.mp4',
      webm: '/media/kids-stories/jordan-crossing.webm',
      captionsVtt: '/media/kids-stories/jordan-crossing.vtt'
    },
    josephCoat: {
      mp4: '/media/kids-stories/joseph-coat.mp4',
      webm: '/media/kids-stories/joseph-coat.webm',
      captionsVtt: '/media/kids-stories/joseph-coat.vtt'
    },
    josephDreams: {
      mp4: '/media/kids-stories/joseph-dreams.mp4',
      webm: '/media/kids-stories/joseph-dreams.webm',
      captionsVtt: '/media/kids-stories/joseph-dreams.vtt'
    },
    josephPrison: {
      mp4: '/media/kids-stories/joseph-prison.mp4',
      webm: '/media/kids-stories/joseph-prison.webm',
      captionsVtt: '/media/kids-stories/joseph-prison.vtt'
    },
    josephRuler: {
      mp4: '/media/kids-stories/joseph-ruler.mp4',
      webm: '/media/kids-stories/joseph-ruler.webm',
      captionsVtt: '/media/kids-stories/joseph-ruler.vtt'
    },
    josephSold: {
      mp4: '/media/kids-stories/joseph-sold.mp4',
      webm: '/media/kids-stories/joseph-sold.webm',
      captionsVtt: '/media/kids-stories/joseph-sold.vtt'
    },
    joshuaAi: {
      mp4: '/media/kids-stories/joshua-ai.mp4',
      webm: '/media/kids-stories/joshua-ai.webm',
      captionsVtt: '/media/kids-stories/joshua-ai.vtt'
    },
    joshuaJordan: {
      mp4: '/media/kids-stories/joshua-jordan.mp4',
      webm: '/media/kids-stories/joshua-jordan.webm',
      captionsVtt: '/media/kids-stories/joshua-jordan.vtt'
    },
    judasKiss: {
      mp4: '/media/kids-stories/judas-kiss.mp4',
      webm: '/media/kids-stories/judas-kiss.webm',
      captionsVtt: '/media/kids-stories/judas-kiss.vtt'
    },
    juniaApostle: {
      mp4: '/media/kids-stories/junia-apostle.mp4',
      webm: '/media/kids-stories/junia-apostle.webm',
      captionsVtt: '/media/kids-stories/junia-apostle.vtt'
    },
    lambBook: {
      mp4: '/media/kids-stories/lamb-book.mp4',
      webm: '/media/kids-stories/lamb-book.webm',
      captionsVtt: '/media/kids-stories/lamb-book.vtt'
    },
    lastSupper: {
      mp4: '/media/kids-stories/last-supper.mp4',
      webm: '/media/kids-stories/last-supper.webm',
      captionsVtt: '/media/kids-stories/last-supper.vtt'
    },
    lazarus: {
      mp4: '/media/kids-stories/lazarus.mp4',
      webm: '/media/kids-stories/lazarus.webm',
      captionsVtt: '/media/kids-stories/lazarus.vtt'
    },
    loisTimothy: {
      mp4: '/media/kids-stories/lois-timothy.mp4',
      webm: '/media/kids-stories/lois-timothy.webm',
      captionsVtt: '/media/kids-stories/lois-timothy.vtt'
    },
    lostSheep: {
      mp4: '/media/kids-stories/lost-sheep.mp4',
      webm: '/media/kids-stories/lost-sheep.webm',
      captionsVtt: '/media/kids-stories/lost-sheep.vtt'
    },
    loveChapter: {
      mp4: '/media/kids-stories/love-chapter.mp4',
      webm: '/media/kids-stories/love-chapter.webm',
      captionsVtt: '/media/kids-stories/love-chapter.vtt'
    },
    loveNeighbor: {
      mp4: '/media/kids-stories/love-neighbor.mp4',
      webm: '/media/kids-stories/love-neighbor.webm',
      captionsVtt: '/media/kids-stories/love-neighbor.vtt'
    },
    lydiaSell: {
      mp4: '/media/kids-stories/lydia-sell.mp4',
      webm: '/media/kids-stories/lydia-sell.webm',
      captionsVtt: '/media/kids-stories/lydia-sell.vtt'
    },
    manna: {
      mp4: '/media/kids-stories/manna.mp4',
      webm: '/media/kids-stories/manna.webm',
      captionsVtt: '/media/kids-stories/manna.vtt'
    },
    marthaServe: {
      mp4: '/media/kids-stories/martha-serve.mp4',
      webm: '/media/kids-stories/martha-serve.webm',
      captionsVtt: '/media/kids-stories/martha-serve.vtt'
    },
    maryAnoint: {
      mp4: '/media/kids-stories/mary-anoint.mp4',
      webm: '/media/kids-stories/mary-anoint.webm',
      captionsVtt: '/media/kids-stories/mary-anoint.vtt'
    },
    maryMagdalene: {
      mp4: '/media/kids-stories/mary-magdalene.mp4',
      webm: '/media/kids-stories/mary-magdalene.webm',
      captionsVtt: '/media/kids-stories/mary-magdalene.vtt'
    },
    marySit: {
      mp4: '/media/kids-stories/mary-sit.mp4',
      webm: '/media/kids-stories/mary-sit.webm',
      captionsVtt: '/media/kids-stories/mary-sit.vtt'
    },
    miriamSong: {
      mp4: '/media/kids-stories/miriam-song.mp4',
      webm: '/media/kids-stories/miriam-song.webm',
      captionsVtt: '/media/kids-stories/miriam-song.vtt'
    },
    mosesBaby: {
      mp4: '/media/kids-stories/moses-baby.mp4',
      webm: '/media/kids-stories/moses-baby.webm',
      captionsVtt: '/media/kids-stories/moses-baby.vtt'
    },
    mosesBush: {
      mp4: '/media/kids-stories/moses-bush.mp4',
      webm: '/media/kids-stories/moses-bush.webm',
      captionsVtt: '/media/kids-stories/moses-bush.vtt'
    },
    mosesSea: {
      mp4: '/media/kids-stories/moses-sea.mp4',
      webm: '/media/kids-stories/moses-sea.webm',
      captionsVtt: '/media/kids-stories/moses-sea.vtt'
    },
    mosesStaffSnake: {
      mp4: '/media/kids-stories/moses-staff-snake.mp4',
      webm: '/media/kids-stories/moses-staff-snake.webm',
      captionsVtt: '/media/kids-stories/moses-staff-snake.vtt'
    },
    mustardSeed: {
      mp4: '/media/kids-stories/mustard-seed.mp4',
      webm: '/media/kids-stories/mustard-seed.webm',
      captionsVtt: '/media/kids-stories/mustard-seed.vtt'
    },
    naaman: {
      mp4: '/media/kids-stories/naaman.mp4',
      webm: '/media/kids-stories/naaman.webm',
      captionsVtt: '/media/kids-stories/naaman.vtt'
    },
    naamanDip: {
      mp4: '/media/kids-stories/naaman-dip.mp4',
      webm: '/media/kids-stories/naaman-dip.webm',
      captionsVtt: '/media/kids-stories/naaman-dip.vtt'
    },
    nehemiahWalls: {
      mp4: '/media/kids-stories/nehemiah-walls.mp4',
      webm: '/media/kids-stories/nehemiah-walls.webm',
      captionsVtt: '/media/kids-stories/nehemiah-walls.vtt'
    },
    newEarth: {
      mp4: '/media/kids-stories/new-earth.mp4',
      webm: '/media/kids-stories/new-earth.webm',
      captionsVtt: '/media/kids-stories/new-earth.vtt'
    },
    newHeaven: {
      mp4: '/media/kids-stories/new-heaven.mp4',
      webm: '/media/kids-stories/new-heaven.webm',
      captionsVtt: '/media/kids-stories/new-heaven.vtt'
    },
    noNight: {
      mp4: '/media/kids-stories/no-night.mp4',
      webm: '/media/kids-stories/no-night.webm',
      captionsVtt: '/media/kids-stories/no-night.vtt'
    },
    noah: {
      mp4: '/media/kids-stories/noah.mp4',
      webm: '/media/kids-stories/noah.webm',
      captionsVtt: '/media/kids-stories/noah.vtt'
    },
    palmSunday: {
      mp4: '/media/kids-stories/palm-sunday.mp4',
      webm: '/media/kids-stories/palm-sunday.webm',
      captionsVtt: '/media/kids-stories/palm-sunday.vtt'
    },
    parableSower: {
      mp4: '/media/kids-stories/parable-sower.mp4',
      webm: '/media/kids-stories/parable-sower.webm',
      captionsVtt: '/media/kids-stories/parable-sower.vtt'
    },
    parableTalents: {
      mp4: '/media/kids-stories/parable-talents.mp4',
      webm: '/media/kids-stories/parable-talents.webm',
      captionsVtt: '/media/kids-stories/parable-talents.vtt'
    },
    passoverLamb: {
      mp4: '/media/kids-stories/passover-lamb.mp4',
      webm: '/media/kids-stories/passover-lamb.webm',
      captionsVtt: '/media/kids-stories/passover-lamb.vtt'
    },
    paulDamascus: {
      mp4: '/media/kids-stories/paul-damascus.mp4',
      webm: '/media/kids-stories/paul-damascus.webm',
      captionsVtt: '/media/kids-stories/paul-damascus.vtt'
    },
    paulShip: {
      mp4: '/media/kids-stories/paul-ship.mp4',
      webm: '/media/kids-stories/paul-ship.webm',
      captionsVtt: '/media/kids-stories/paul-ship.vtt'
    },
    paulShipwreck: {
      mp4: '/media/kids-stories/paul-shipwreck.mp4',
      webm: '/media/kids-stories/paul-shipwreck.webm',
      captionsVtt: '/media/kids-stories/paul-shipwreck.vtt'
    },
    paulSilas: {
      mp4: '/media/kids-stories/paul-silas.mp4',
      webm: '/media/kids-stories/paul-silas.webm',
      captionsVtt: '/media/kids-stories/paul-silas.vtt'
    },
    pentecost: {
      mp4: '/media/kids-stories/pentecost.mp4',
      webm: '/media/kids-stories/pentecost.webm',
      captionsVtt: '/media/kids-stories/pentecost.vtt'
    },
    pentecostFire: {
      mp4: '/media/kids-stories/pentecost-fire.mp4',
      webm: '/media/kids-stories/pentecost-fire.webm',
      captionsVtt: '/media/kids-stories/pentecost-fire.vtt'
    },
    pentecostTongues: {
      mp4: '/media/kids-stories/pentecost-tongues.mp4',
      webm: '/media/kids-stories/pentecost-tongues.webm',
      captionsVtt: '/media/kids-stories/pentecost-tongues.vtt'
    },
    persistentWidow: {
      mp4: '/media/kids-stories/persistent-widow.mp4',
      webm: '/media/kids-stories/persistent-widow.webm',
      captionsVtt: '/media/kids-stories/persistent-widow.vtt'
    },
    peterShadow: {
      mp4: '/media/kids-stories/peter-shadow.mp4',
      webm: '/media/kids-stories/peter-shadow.webm',
      captionsVtt: '/media/kids-stories/peter-shadow.vtt'
    },
    pharaohDreams: {
      mp4: '/media/kids-stories/pharaoh-dreams.mp4',
      webm: '/media/kids-stories/pharaoh-dreams.webm',
      captionsVtt: '/media/kids-stories/pharaoh-dreams.vtt'
    },
    philipChariot: {
      mp4: '/media/kids-stories/philip-chariot.mp4',
      webm: '/media/kids-stories/philip-chariot.webm',
      captionsVtt: '/media/kids-stories/philip-chariot.vtt'
    },
    phoebeDeacon: {
      mp4: '/media/kids-stories/phoebe-deacon.mp4',
      webm: '/media/kids-stories/phoebe-deacon.webm',
      captionsVtt: '/media/kids-stories/phoebe-deacon.vtt'
    },
    prayerCloset: {
      mp4: '/media/kids-stories/prayer-closet.mp4',
      webm: '/media/kids-stories/prayer-closet.webm',
      captionsVtt: '/media/kids-stories/prayer-closet.vtt'
    },
    prayerKnock: {
      mp4: '/media/kids-stories/prayer-knock.mp4',
      webm: '/media/kids-stories/prayer-knock.webm',
      captionsVtt: '/media/kids-stories/prayer-knock.vtt'
    },
    priscillaTeach: {
      mp4: '/media/kids-stories/priscilla-teach.mp4',
      webm: '/media/kids-stories/priscilla-teach.webm',
      captionsVtt: '/media/kids-stories/priscilla-teach.vtt'
    },
    priscillaTent: {
      mp4: '/media/kids-stories/priscilla-tent.mp4',
      webm: '/media/kids-stories/priscilla-tent.webm',
      captionsVtt: '/media/kids-stories/priscilla-tent.vtt'
    },
    prodigalSon: {
      mp4: '/media/kids-stories/prodigal-son.mp4',
      webm: '/media/kids-stories/prodigal-son.webm',
      captionsVtt: '/media/kids-stories/prodigal-son.vtt'
    },
    psalm23Shepherd: {
      mp4: '/media/kids-stories/psalm23-shepherd.mp4',
      webm: '/media/kids-stories/psalm23-shepherd.webm',
      captionsVtt: '/media/kids-stories/psalm23-shepherd.vtt'
    },
    rahabJericho: {
      mp4: '/media/kids-stories/rahab-jericho.mp4',
      webm: '/media/kids-stories/rahab-jericho.webm',
      captionsVtt: '/media/kids-stories/rahab-jericho.vtt'
    },
    rahabRope: {
      mp4: '/media/kids-stories/rahab-rope.mp4',
      webm: '/media/kids-stories/rahab-rope.webm',
      captionsVtt: '/media/kids-stories/rahab-rope.vtt'
    },
    rahabWindow: {
      mp4: '/media/kids-stories/rahab-window.mp4',
      webm: '/media/kids-stories/rahab-window.webm',
      captionsVtt: '/media/kids-stories/rahab-window.vtt'
    },
    redSea: {
      mp4: '/media/kids-stories/red-sea.mp4',
      webm: '/media/kids-stories/red-sea.webm',
      captionsVtt: '/media/kids-stories/red-sea.vtt'
    },
    redSeaCrossing: {
      mp4: '/media/kids-stories/red-sea-crossing.mp4',
      webm: '/media/kids-stories/red-sea-crossing.webm',
      captionsVtt: '/media/kids-stories/red-sea-crossing.vtt'
    },
    resurrection: {
      mp4: '/media/kids-stories/resurrection.mp4',
      webm: '/media/kids-stories/resurrection.webm',
      captionsVtt: '/media/kids-stories/resurrection.vtt'
    },
    revelationBride: {
      mp4: '/media/kids-stories/revelation-bride.mp4',
      webm: '/media/kids-stories/revelation-bride.webm',
      captionsVtt: '/media/kids-stories/revelation-bride.vtt'
    },
    revelationThrone: {
      mp4: '/media/kids-stories/revelation-throne.mp4',
      webm: '/media/kids-stories/revelation-throne.webm',
      captionsVtt: '/media/kids-stories/revelation-throne.vtt'
    },
    richYoungRuler: {
      mp4: '/media/kids-stories/rich-young-ruler.mp4',
      webm: '/media/kids-stories/rich-young-ruler.webm',
      captionsVtt: '/media/kids-stories/rich-young-ruler.vtt'
    },
    riverOfLife: {
      mp4: '/media/kids-stories/river-of-life.mp4',
      webm: '/media/kids-stories/river-of-life.webm',
      captionsVtt: '/media/kids-stories/river-of-life.vtt'
    },
    roadToEmmaus: {
      mp4: '/media/kids-stories/road-to-emmaus.mp4',
      webm: '/media/kids-stories/road-to-emmaus.webm',
      captionsVtt: '/media/kids-stories/road-to-emmaus.vtt'
    },
    ruthBoaz: {
      mp4: '/media/kids-stories/ruth-boaz.mp4',
      webm: '/media/kids-stories/ruth-boaz.webm',
      captionsVtt: '/media/kids-stories/ruth-boaz.vtt'
    },
    ruthGlean: {
      mp4: '/media/kids-stories/ruth-glean.mp4',
      webm: '/media/kids-stories/ruth-glean.webm',
      captionsVtt: '/media/kids-stories/ruth-glean.vtt'
    },
    ruthMoab: {
      mp4: '/media/kids-stories/ruth-moab.mp4',
      webm: '/media/kids-stories/ruth-moab.webm',
      captionsVtt: '/media/kids-stories/ruth-moab.vtt'
    },
    samaritanWoman: {
      mp4: '/media/kids-stories/samaritan-woman.mp4',
      webm: '/media/kids-stories/samaritan-woman.webm',
      captionsVtt: '/media/kids-stories/samaritan-woman.vtt'
    },
    samson: {
      mp4: '/media/kids-stories/samson.mp4',
      webm: '/media/kids-stories/samson.webm',
      captionsVtt: '/media/kids-stories/samson.vtt'
    },
    samsonHair: {
      mp4: '/media/kids-stories/samson-hair.mp4',
      webm: '/media/kids-stories/samson-hair.webm',
      captionsVtt: '/media/kids-stories/samson-hair.vtt'
    },
    samuelCall: {
      mp4: '/media/kids-stories/samuel-call.mp4',
      webm: '/media/kids-stories/samuel-call.webm',
      captionsVtt: '/media/kids-stories/samuel-call.vtt'
    },
    sarahLaughs: {
      mp4: '/media/kids-stories/sarah-laughs.mp4',
      webm: '/media/kids-stories/sarah-laughs.webm',
      captionsVtt: '/media/kids-stories/sarah-laughs.vtt'
    },
    sarahPromise: {
      mp4: '/media/kids-stories/sarah-promise.mp4',
      webm: '/media/kids-stories/sarah-promise.webm',
      captionsVtt: '/media/kids-stories/sarah-promise.vtt'
    },
    saulSpear: {
      mp4: '/media/kids-stories/saul-spear.mp4',
      webm: '/media/kids-stories/saul-spear.webm',
      captionsVtt: '/media/kids-stories/saul-spear.vtt'
    },
    shepherdsStar: {
      mp4: '/media/kids-stories/shepherds-star.mp4',
      webm: '/media/kids-stories/shepherds-star.webm',
      captionsVtt: '/media/kids-stories/shepherds-star.vtt'
    },
    solomonWisdom: {
      mp4: '/media/kids-stories/solomon-wisdom.mp4',
      webm: '/media/kids-stories/solomon-wisdom.webm',
      captionsVtt: '/media/kids-stories/solomon-wisdom.vtt'
    },
    spiesInCanaan: {
      mp4: '/media/kids-stories/spies-in-canaan.mp4',
      webm: '/media/kids-stories/spies-in-canaan.webm',
      captionsVtt: '/media/kids-stories/spies-in-canaan.vtt'
    },
    stephen: {
      mp4: '/media/kids-stories/stephen.mp4',
      webm: '/media/kids-stories/stephen.webm',
      captionsVtt: '/media/kids-stories/stephen.vtt'
    },
    stephenStones: {
      mp4: '/media/kids-stories/stephen-stones.mp4',
      webm: '/media/kids-stories/stephen-stones.webm',
      captionsVtt: '/media/kids-stories/stephen-stones.vtt'
    },
    tenCommandments: {
      mp4: '/media/kids-stories/ten-commandments.mp4',
      webm: '/media/kids-stories/ten-commandments.webm',
      captionsVtt: '/media/kids-stories/ten-commandments.vtt'
    },
    tenPlagues: {
      mp4: '/media/kids-stories/ten-plagues.mp4',
      webm: '/media/kids-stories/ten-plagues.webm',
      captionsVtt: '/media/kids-stories/ten-plagues.vtt'
    },
    tenVirgins: {
      mp4: '/media/kids-stories/ten-virgins.mp4',
      webm: '/media/kids-stories/ten-virgins.webm',
      captionsVtt: '/media/kids-stories/ten-virgins.vtt'
    },
    thomasDoubt: {
      mp4: '/media/kids-stories/thomas-doubt.mp4',
      webm: '/media/kids-stories/thomas-doubt.webm',
      captionsVtt: '/media/kids-stories/thomas-doubt.vtt'
    },
    tombEmpty: {
      mp4: '/media/kids-stories/tomb-empty.mp4',
      webm: '/media/kids-stories/tomb-empty.webm',
      captionsVtt: '/media/kids-stories/tomb-empty.vtt'
    },
    towerBabel: {
      mp4: '/media/kids-stories/tower-babel.mp4',
      webm: '/media/kids-stories/tower-babel.webm',
      captionsVtt: '/media/kids-stories/tower-babel.vtt'
    },
    transfigure: {
      mp4: '/media/kids-stories/transfigure.mp4',
      webm: '/media/kids-stories/transfigure.webm',
      captionsVtt: '/media/kids-stories/transfigure.vtt'
    },
    treeFruit: {
      mp4: '/media/kids-stories/tree-fruit.mp4',
      webm: '/media/kids-stories/tree-fruit.webm',
      captionsVtt: '/media/kids-stories/tree-fruit.vtt'
    },
    treeOfLife: {
      mp4: '/media/kids-stories/tree-of-life.mp4',
      webm: '/media/kids-stories/tree-of-life.webm',
      captionsVtt: '/media/kids-stories/tree-of-life.vtt'
    },
    trial: {
      mp4: '/media/kids-stories/trial.mp4',
      webm: '/media/kids-stories/trial.webm',
      captionsVtt: '/media/kids-stories/trial.vtt'
    },
    weddingWine: {
      mp4: '/media/kids-stories/wedding-wine.mp4',
      webm: '/media/kids-stories/wedding-wine.webm',
      captionsVtt: '/media/kids-stories/wedding-wine.vtt'
    },
    widowMite: {
      mp4: '/media/kids-stories/widow-mite.mp4',
      webm: '/media/kids-stories/widow-mite.webm',
      captionsVtt: '/media/kids-stories/widow-mite.vtt'
    },
    widowOil: {
      mp4: '/media/kids-stories/widow-oil.mp4',
      webm: '/media/kids-stories/widow-oil.webm',
      captionsVtt: '/media/kids-stories/widow-oil.vtt'
    },
    widowsMite: {
      mp4: '/media/kids-stories/widows-mite.mp4',
      webm: '/media/kids-stories/widows-mite.webm',
      captionsVtt: '/media/kids-stories/widows-mite.vtt'
    },
    worryBirds: {
      mp4: '/media/kids-stories/worry-birds.mp4',
      webm: '/media/kids-stories/worry-birds.webm',
      captionsVtt: '/media/kids-stories/worry-birds.vtt'
    },
    zacchaeus: {
      mp4: '/media/kids-stories/zacchaeus.mp4',
      webm: '/media/kids-stories/zacchaeus.webm',
      captionsVtt: '/media/kids-stories/zacchaeus.vtt'
    },
  };

  global.TDB_KIDS_FULL_STORY_MEDIA = FULL_STORY_MEDIA;
  global.TDB_KIDS_FULL_STORY_LIVE_KEYS = FULL_STORY_LIVE_KEYS;

  global.getKidsFullStoryMedia = function (storyKey) {
    var k = String(storyKey || '').trim();
    if (!k || !FULL_STORY_MEDIA[k]) return null;
    if (!FULL_STORY_LIVE_KEYS.has(k)) return null;
    var o = FULL_STORY_MEDIA[k];
    if (!o || typeof o !== 'object') return null;
    if (!o.mp4 && !o.webm) return null;
    return o;
  };
})(typeof window !== 'undefined' ? window : this);
