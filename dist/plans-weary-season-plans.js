/**
 * Weary-season Plans — device-local merge into PLANS (plans.html).
 */
(function () {
  'use strict';

  var WEARY = {
    parentinvisible: {
      id: 'parentinvisible',
      icon: '\uD83C\uDF31',
      label: 'When Parenting Feels Overwhelming and Invisible',
      desc: 'Six gentle KJV days when the work is constant and no one seems to notice&mdash;laundry, lunches, midnight worries, and holy ordinary labor. God sees what the room does not applaud. Pairs with <a href="kids/porch-read-god-sees-quiet-work.html">porch read-aloud for little ears</a>.',
      key: 'tdb-plan-parentinvisible-day',
      max: 6,
      days: [
        {
          title: 'Do not grow weary',
          ref: 'Galatians 6:9',
          text: 'And let us not be weary in well doing: for in due season we shall reap, if we faint not.',
          speaker: 'Paul \u2014 urging steady love in the church',
          plain: 'Invisible labor still counts as well doing. The harvest is His timetable, not the applause meter.',
          today: 'What good work felt unseen today?',
          action: 'If you want, tell Him one task no one thanked you for\u2014no fixing required.',
          prayer: 'Lord, when I am weary in well doing, keep me from fainting. Amen.',
          goal: 'If it helps, one slow breath before the next demand\u2014skip if survival mode is all you have.'
        },
        {
          title: 'I will not forget thee',
          ref: 'Isaiah 49:15',
          text: 'Can a woman forget her sucking child, that she should not have compassion on the son of her womb? yea, they may forget, yet will I not forget thee.',
          speaker: 'The Lord \u2014 comfort to exiled Israel',
          plain: 'Even when human memory fails, His compassion on you does not.',
          today: 'Where do you feel forgotten in the middle of everyone else\u2019s needs?',
          action: 'If you can, whisper \u201cThou wilt not forget me\u201d once. That is prayer.',
          prayer: 'Father, when I feel forgotten, remind me Thou wilt not forget me. Amen.',
          goal: 'If you want, return to this line when the house feels loud and you feel small.'
        },
        {
          title: 'As unto the Lord',
          ref: 'Colossians 3:23-24',
          text: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men; Knowing that of the Lord ye shall receive the reward of the inheritance: for ye serve the Lord Christ.',
          speaker: 'Paul \u2014 slaves and free alike under Christ',
          plain: 'The audience for dishes, homework help, and bedtime resets is ultimately Christ\u2014not the scoreboard.',
          today: 'What chore today can you offer as unto Him, not for praise?',
          action: 'If you want, pick one ordinary task and do it quietly as unto the Lord.',
          prayer: 'Lord Christ, I serve Thee in the hidden work. Receive it. Amen.',
          goal: 'If it feels right, thank Him once for one unseen mercy that showed up anyway.'
        },
        {
          title: 'Seen in secret',
          ref: 'Matthew 6:6',
          text: 'But thou, when thou prayest, enter into thy closet, and when thou hast shut thy door, pray to thy Father which is in secret; and thy Father which seeth in secret shall reward thee openly.',
          speaker: 'Jesus \u2014 Sermon on the Mount',
          plain: 'Secret prayer is not wasted. The Father who sees in secret is the same One who sees the midnight bottle and the early alarm.',
          today: 'When could you pray behind a closed door for two minutes?',
          action: 'If you can, shut the door once and speak honestly\u2014words optional.',
          prayer: 'Father which seest in secret, meet me in the quiet. Amen.',
          goal: 'If you want, one honest sentence in secret today counts as full prayer.'
        },
        {
          title: 'Her children arise up',
          ref: 'Proverbs 31:28',
          text: 'Her children arise up, and call her blessed; her husband also, and he praiseth her.',
          speaker: 'Lemuel \u2014 the virtuous woman praised',
          plain: 'Blessing may come late or quietly\u2014yet faithfulness still shapes the home.',
          today: 'What true word might your children need from you, even if praise feels far off?',
          action: 'If you want, speak one true blessing over a child\u2014short is holy.',
          prayer: 'Lord, let my labor bear fruit in their hearts in Thy time. Amen.',
          goal: 'If it helps, write one sentence you hope they remember when they are grown.'
        },
        {
          title: 'Renewed day by day',
          ref: '2 Corinthians 4:16',
          text: 'For which cause we faint not; but though our outward man perish, yet the inward man is renewed day by day.',
          speaker: 'Paul \u2014 jars of clay carrying treasure',
          plain: 'Exhaustion in the body is real; renewal in the inner person is still His work.',
          today: 'What part of you feels worn thin on the outside?',
          action: 'If you want, ask Him to renew the inward person before tomorrow\u2019s shift begins.',
          prayer: 'Renew the inward man, Lord. I faint not because Thou art faithful. Amen.',
          goal: 'Bookmark this plan\u2014invisible parenting weeks circle; the porch stays open.'
        }
      ]
    },

    griefwaves: {
      id: 'griefwaves',
      icon: '\uD83C\uDF0A',
      label: 'When Grief Returns in Waves',
      desc: 'Six KJV days when sorrow surges again after you thought the worst had passed&mdash;anniversaries, rooms, songs, ordinary Tuesdays. No schedule for healing. Come as you are.',
      key: 'tdb-plan-griefwaves-day',
      max: 6,
      days: [
        {
          title: 'Deep calleth unto deep',
          ref: 'Psalm 42:7',
          text: 'Deep calleth unto deep at the noise of thy waterspouts: all thy waves and thy billows are gone over me.',
          speaker: 'The psalmist \u2014 thirsting for God in trouble',
          plain: 'Grief waves are not failure. They are honest depth meeting His depth.',
          today: 'What triggered the wave today\u2014a date, a smell, a silence?',
          action: 'If you want, name the wave once to Him without explaining it away.',
          prayer: 'Lord, the billows have gone over me. Hold me in the deep. Amen.',
          goal: 'If it helps, let the wave come without grading yourself for feeling it again.'
        },
        {
          title: 'Tears in thy bottle',
          ref: 'Psalm 56:8',
          text: 'Thou tellest my wanderings: put thou my tears into thy bottle: are they not in thy book?',
          speaker: 'David \u2014 pursued and weeping',
          plain: 'He counts wanderings and keeps tears. Nothing is wasted or unseen.',
          today: 'How many tears felt private today?',
          action: 'If you can, tell Him \u201cThese tears are Yours to keep.\u201d',
          prayer: 'Put my tears into Thy bottle, Lord. Thou tellest my wanderings. Amen.',
          goal: 'If you want, cry without apology for five minutes\u2014He is not embarrassed.'
        },
        {
          title: 'Remembering still',
          ref: 'Lamentations 3:19-20',
          text: 'Remembering mine affliction and my misery, the wormwood and the gall. My soul hath them still in remembrance, and is humbled in me.',
          speaker: 'Jeremiah \u2014 honest grief in ruins',
          plain: 'Memory that still hurts is not disobedience. Humility before sorrow is allowed here.',
          today: 'What memory returned uninvited?',
          action: 'If you want, sit with the memory five minutes\u2014no rush to fix.',
          prayer: 'Lord, my soul hath them still in remembrance. Humble me gently. Amen.',
          goal: 'If it feels right, read Lamentations 3:21\u201323 next\u2014mercy still follows honest grief.'
        },
        {
          title: 'Acquainted with grief',
          ref: 'Isaiah 53:3',
          text: 'He is despised and rejected of men; a man of sorrows, and acquainted with grief: and we hid as it were our faces from him; he was despised, and we esteemed him not.',
          speaker: 'Isaiah \u2014 the suffering servant',
          plain: 'Your Savior is not unfamiliar with sorrow. He does not ask you to pretend the wave is shallow.',
          today: 'Where does grief feel lonely today?',
          action: 'If you want, whisper \u201cThou art acquainted with grief\u201d as one line of prayer.',
          prayer: 'Man of sorrows, be acquainted with my grief today. Amen.',
          goal: 'If it helps, one short visit to Isaiah 53 when the wave feels isolating.'
        },
        {
          title: 'Not worthy to compare',
          ref: 'Romans 8:18',
          text: 'For I reckon that the sufferings of this present time are not worthy to be compared with the glory which shall be revealed in us.',
          speaker: 'Paul \u2014 creation groaning with us',
          plain: 'This does not minimize today\u2019s ache. It anchors it in a glory you cannot yet see.',
          today: 'Can you hold both\u2014real pain now and hope not yet visible?',
          action: 'If you want, write one honest sentence about today and one about hope deferred.',
          prayer: 'Lord, the suffering is real. Keep my hope in Thy glory. Amen.',
          goal: 'If you want, return to Romans 8:18 when the wave asks if anything good remains.'
        },
        {
          title: 'Living fountains',
          ref: 'Revelation 7:17',
          text: 'For the Lamb which is in the midst of the throne shall feed them, and shall lead them unto living fountains of waters: and God shall wipe away all tears from their eyes.',
          speaker: 'John \u2014 the great multitude before the throne',
          plain: 'Waves will come until that day. The Lamb who feeds and leads is the same end of every tear.',
          today: 'After six days, what do you want to tell the Lamb about the waves?',
          action: 'If you want, read this verse once aloud\u2014even if your voice shakes.',
          prayer: 'Lamb on the throne, lead me to living water. Wipe every tear in Thy time. Amen.',
          goal: 'Pairs with <a href="plans.html?plan=aftergrief">After Grief</a> when you need a longer soft return.'
        }
      ]
    },

    pastorhardweek: {
      id: 'pastorhardweek',
      icon: '\uD83D\uDE4F',
      label: 'Steady Strength for Pastors in a Hard Week',
      desc: 'Five KJV days for shepherds carrying criticism, crisis calls, empty pews, or their own hidden weariness. No performance badge&mdash;preach, rest, feed, and trust the Finisher.',
      key: 'tdb-plan-pastorhardweek-day',
      max: 5,
      days: [
        {
          title: 'Renew their strength',
          ref: 'Isaiah 40:31',
          text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
          speaker: 'Isaiah \u2014 comfort to exhausted servants',
          plain: 'Waiting is not quitting. Strength renews on His schedule, not the calendar of demands.',
          today: 'Where are you running on fumes instead of waiting?',
          action: 'If you can, ten minutes of stillness before the next call\u2014phone off if possible.',
          prayer: 'Lord, renew my strength. Teach me to wait on Thee. Amen.',
          goal: 'If you want, one unhurried breath before opening the study door tomorrow.'
        },
        {
          title: 'Preach the word',
          ref: '2 Timothy 4:2',
          text: 'Preach the word; be instant in season, out of season; reprove, rebuke, exhort with all longsuffering and doctrine.',
          speaker: 'Paul \u2014 final charge to Timothy',
          plain: 'Hard weeks still need the Word\u2014not hype, not your cleverness, the Scripture itself.',
          today: 'What are you tempted to soften or skip because the room feels heavy?',
          action: 'If you want, read the text aloud once before you craft a single outline line.',
          prayer: 'Help me preach Thy word with longsuffering, Lord. Amen.',
          goal: 'If it helps, trust the text to carry more weight than your energy does.'
        },
        {
          title: 'Rest a while',
          ref: 'Mark 6:31',
          text: 'And he said unto them, Come ye yourselves apart into a desert place, and rest a while: for there were many coming and going, and they had no leisure so much as to eat.',
          speaker: 'Jesus \u2014 to apostles amid constant demand',
          plain: 'Even Jesus sent weary ministers apart. Rest is not dereliction.',
          today: 'When did you last eat unhurried or sit without a phone?',
          action: 'If you can, one meal today without multitasking\u2014even fifteen minutes.',
          prayer: 'Lord, call me apart. Help me rest a while without guilt. Amen.',
          goal: 'If you want, block one hour this week as desert place\u2014protect it like a meeting.'
        },
        {
          title: 'Feed willingly',
          ref: '1 Peter 5:2-3',
          text: 'Feed the flock of God which is among you, taking the oversight thereof, not by constraint, but willingly; not for filthy lucre, but of a ready mind; Neither as being lords over God\u2019s heritage, but being ensamples to the flock.',
          speaker: 'Peter \u2014 elders among scattered churches',
          plain: 'Oversight is feeding, not lording. A ready mind includes admitting you are tired too.',
          today: 'Where has constraint replaced willingness this week?',
          action: 'If you want, pray for one family by name\u2014feed with intercession before the next sermon.',
          prayer: 'Make me willing, Lord. Keep me an example, not a lord. Amen.',
          goal: 'If it feels right, ask one trusted friend how you seem this week\u2014listen without defending.'
        },
        {
          title: 'He will perform it',
          ref: 'Philippians 1:6',
          text: 'Being confident of this very thing, that he which hath begun a good work in you will perform it until the day of Jesus Christ:',
          speaker: 'Paul \u2014 grateful for the Philippian church',
          plain: 'The good work in you is His project too. Hard weeks do not void His confidence.',
          today: 'What good work do you fear He has abandoned in you?',
          action: 'If you want, thank Him for one work He started that you did not finish alone.',
          prayer: 'Finish Thy good work in me, Lord, until the day of Christ. Amen.',
          goal: 'See also <a href="plans.html?plan=preachingthroughexhaustion">Preaching Through Exhaustion</a> for longer pastoral care.'
        }
      ]
    },

    anxietyexhaust: {
      id: 'anxietyexhaust',
      icon: '\uD83C\uDF19',
      label: 'Finding Rest When Anxiety and Exhaustion Mix',
      desc: 'Seven KJV days when worry and weariness tangle&mdash;3 a.m. thoughts, tired but wired, body spent and mind loud. Spiritual care alongside any medical help you use for sleep or anxiety.',
      key: 'tdb-plan-anxietyexhaust-day',
      max: 7,
      days: [
        {
          title: 'Come unto me',
          ref: 'Matthew 11:28',
          text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
          speaker: 'Jesus \u2014 to the weary and burdened',
          plain: 'Anxious exhaustion is a kind of heavy laden. Rest begins with coming, not performing.',
          today: 'What burden sits on your chest today?',
          action: 'If you can, speak \u201cI come\u201d once to Him\u2014no eloquence needed.',
          prayer: 'Lord, I come heavy laden. Give me rest. Amen.',
          goal: 'If you want, read Matthew 11:28\u201330 once before bed tonight.'
        },
        {
          title: 'He giveth sleep',
          ref: 'Psalm 127:2',
          text: 'It is vain for you to rise up early, to sit up late, to eat the bread of sorrows: for so he giveth his beloved sleep.',
          speaker: 'Solomon \u2014 unless the Lord build the house',
          plain: 'Grinding harder does not always quiet anxiety. Sleep is gift, not reward for finishing worry.',
          today: 'Are you eating the bread of sorrows at night?',
          action: 'If you can, set one boundary tonight\u2014screens off, one psalm, then lie down.',
          prayer: 'Give Thy beloved sleep, Lord. I release the bread of sorrows. Amen.',
          goal: 'If it helps, choose one hour to stop problem-solving tonight\u2014anxiety may protest; that is normal.'
        },
        {
          title: 'Peace that keepeth',
          ref: 'Philippians 4:6-7',
          text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
          speaker: 'Paul \u2014 from a Roman cell',
          plain: 'Careful for nothing is invitation, not scolding. Peace guards when understanding runs out.',
          today: 'What request needs to be made known instead of rehearsed?',
          action: 'If you want, write one request and one thanks on paper\u2014then stop rereading it.',
          prayer: 'Let Thy peace keep my heart and mind in Christ Jesus. Amen.',
          goal: 'If you want, repeat one thanksgiving when worry loops back\u2014short counts.'
        },
        {
          title: 'Lay me down in peace',
          ref: 'Psalm 4:8',
          text: 'I will both lay me down in peace, and sleep: for thou, Lord, only makest me dwell in safety.',
          speaker: 'David \u2014 evening confidence',
          plain: 'Safety is His to give while your body rests.',
          today: 'Does the bed feel like a battlefield tonight?',
          action: 'If you can, whisper the verse once with lights off.',
          prayer: 'Lord, only Thou makest me dwell in safety. I lay me down in peace. Amen.',
          goal: 'Pairs with <a href="plans.html?plan=restlessnights">Peace for Restless Nights</a> when nights stay hard.'
        },
        {
          title: 'Quietness and confidence',
          ref: 'Isaiah 30:15',
          text: 'For thus saith the Lord GOD, the Holy One of Israel; In returning and rest shall ye be saved; in quietness and in confidence shall be your strength: and ye would not.',
          speaker: 'The Lord \u2014 to a people who preferred escape plans',
          plain: 'Strength in anxiety often looks like quiet return, not louder striving.',
          today: 'Where are you refusing rest because fear says you must keep moving?',
          action: 'If you want, five minutes of quietness\u2014timer optional, panic allowed but not obeyed.',
          prayer: 'Holy One of Israel, teach me returning and rest. Amen.',
          goal: 'If it feels right, notice one moment today when quietness was enough.'
        },
        {
          title: 'Arise and eat',
          ref: '1 Kings 19:5-8',
          text: 'And as he lay and slept under a juniper tree, behold, then an angel touched him, and said unto him, Arise and eat. And he looked, and, behold, there was a cake baken on the coals, and a cruse of water at his head. And he did eat and drink, and laid him down again. And the angel of the LORD came again the second time, and touched him, and said, Arise and eat; because the journey is too great for thee.',
          speaker: 'Elijah \u2014 after Mount Carmel and deep despair',
          plain: 'God met exhausted Elijah with sleep and food before the next assignment. Body care is not unspiritual.',
          today: 'Have you eaten and drunk enough for the journey ahead?',
          action: 'If you can, one simple meal and water without scrolling\u2014receive it as provision.',
          prayer: 'Lord, the journey is too great for me. Touch me with rest and bread. Amen.',
          goal: 'If you want, ask for medical or counselor help when anxiety and exhaustion persist\u2014wisdom, not failure.'
        },
        {
          title: 'Rest for the people of God',
          ref: 'Hebrews 4:9-10',
          text: 'There remaineth therefore a rest to the people of God. For he that is entered into his rest, he also hath ceased from his own works, as God did from his.',
          speaker: 'The writer \u2014 Christ greater than Joshua',
          plain: 'Ceasing from your own works is not laziness\u2014it is trust that His work holds you.',
          today: 'After seven days, what work are you still trying to finish in your own strength?',
          action: 'If you want, name one thing to cease from tonight and leave it with Him.',
          prayer: 'Lead me into Thy rest. I cease from my own works and trust Thee. Amen.',
          goal: 'Bookmark <a href="calm.html">Need a verse now</a> when anxiety spikes between plan days.'
        }
      ]
    },

    spirituallydry: {
      id: 'spirituallydry',
      icon: '\uD83C\uDF42',
      label: 'When You Feel Spiritually Dry',
      desc: 'Six gentle KJV days when prayer feels flat and God feels far&mdash;not failure, not a report card. Wait in the dark with small, grace-filled steps. No trying harder; just staying with the Vine.',
      key: 'tdb-plan-spirituallydry-day',
      max: 6,
      days: [
        {
          title: 'The honest thirst',
          ref: 'Psalm 42:1-2',
          text: 'As the hart panteth after the water brooks, so panteth my soul after thee, O God. My soul thirsteth for God, for the living God: when shall I come and appear before God?',
          speaker: 'The psalmist \u2014 thirsting in exile',
          plain: 'Dryness is not failure. It is the honest cry of a heart that still knows it needs God.',
          today: 'How dry does prayer feel right now\u2014flat, distant, or mechanical?',
          action: 'If you can, sit quietly two minutes and tell the Lord how dry you feel. No fancy words.',
          prayer: 'Lord, my soul thirsteth for Thee. I bring the dryness to Thee. Help me wait. Amen.',
          goal: 'If it helps, speak the truth about how you feel without shame\u2014one sentence counts.'
        },
        {
          title: 'Mercy that never fails',
          ref: 'Lamentations 3:22-23',
          text: 'It is of the LORD\u2019S mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.',
          speaker: 'Jeremiah \u2014 honest grief, then mercy remembered',
          plain: 'When feelings are dry, His mercy is not. His faithfulness does not depend on how alive you feel.',
          today: 'Can you receive mercy before the feeling returns?',
          action: 'If you want, read this verse slowly three times when you first open the app today.',
          prayer: 'Father, my heart feels empty, but Thy mercies are new this morning. I rest in Thy faithfulness, not my feelings. Amen.',
          goal: 'If it feels right, thank Him once for mercy that did not run out yesterday.'
        },
        {
          title: 'Walking in darkness',
          ref: 'Isaiah 50:10',
          text: 'Who is among you that feareth the LORD, that obeyeth the voice of his servant, that walketh in darkness, and hath no light? let him trust in the name of the LORD, and stay upon his God.',
          speaker: 'The Lord \u2014 to servants in the dark',
          plain: 'The answer in dryness is not try harder. It is trust and stay.',
          today: 'Where are you walking with no light and no feeling to guide you?',
          action: 'If you can, one small act of obedience today\u2014one chapter, one honest sentence of prayer, one quiet kindness\u2014even if you feel nothing.',
          prayer: 'Lord, I walk in darkness and have no light. I trust Thy name and stay upon Thee. Hold me. Amen.',
          goal: 'If you want, obey in the dark without waiting for feelings to catch up.'
        },
        {
          title: 'Waiting on the Lord',
          ref: 'Psalm 62:5',
          text: 'My soul, wait thou only upon God; for my expectation is from him.',
          speaker: 'David \u2014 when enemies and noise pressed in',
          plain: 'When everything feels dry, the soul is invited to wait on God alone.',
          today: 'What are you expecting from your own heart instead of from Him?',
          action: 'If you can, one quiet minute today with no agenda\u2014just wait. Timer optional.',
          prayer: 'My soul, wait thou only upon God. My expectation is from Thee. Amen.',
          goal: 'If it helps, practice waiting without rushing God for a feeling.'
        },
        {
          title: 'Abiding when we feel nothing',
          ref: 'John 15:5',
          text: 'I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing.',
          speaker: 'Jesus \u2014 the night before the cross',
          plain: 'Abiding is not a feeling. It is staying connected to the Vine when fruit feels far off.',
          today: 'Where are you tempted to prove your faith by effort instead of staying?',
          action: 'If you want, tell the Lord once: \u201cI am the branch and Thou art the Vine. I stay with Thee.\u201d',
          prayer: 'Lord Jesus, even when I feel dry and fruitless, I abide in Thee. Amen.',
          goal: 'If it feels right, rest in the truth that staying with Jesus is enough today.'
        },
        {
          title: 'Hope that returns',
          ref: 'Habakkuk 3:17-18',
          text: 'Although the fig tree shall not blossom, neither shall fruit be in the vines; the labour of the olive shall fail, and the fields shall yield no meat; the flock shall be cut off from the fold, and there shall be no herd in the stalls: Yet I will rejoice in the LORD, I will joy in the God of my salvation.',
          speaker: 'Habakkuk \u2014 barren fields, yet rejoicing in God',
          plain: 'Joy can live beside dryness. A quiet yet can stand in a barren season.',
          today: 'What looks fruitless right now\u2014and can you still say yet before the Lord?',
          action: 'If you want, write or speak \u201cYet I will rejoice in the LORD\u201d once today.',
          prayer: 'Father, though my heart feels dry, yet I will rejoice in Thee and joy in the God of my salvation. Amen.',
          goal: 'Pairs with <a href="plans.html?plan=doubtassurance">Doubt \u2192 Assurance</a> or <a href="plans.html?plan=universitydoubt">University of Doubt</a> when questions crowd the dry season.'
        }
      ]
    }
  };

  window.TDB_mergeWearySeasonPlans = function mergeWearySeasonPlans(plansObj) {
    if (!plansObj) return;
    Object.keys(WEARY).forEach(function (id) {
      if (!plansObj[id]) plansObj[id] = WEARY[id];
    });
  };
})();
