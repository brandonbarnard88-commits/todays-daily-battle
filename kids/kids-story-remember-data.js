/**
 * Kids Story Remember — handcrafted “What happened next?” beats for flagship stories.
 * Keys match TDB_BIBLE_STORIES / TDB_KIDS_READ_QUIZ.
 * Fallback: kids-story-remember.js builds beats from read-along captions when missing.
 */
(function (global) {
  'use strict';

  global.TDB_KIDS_STORY_REMEMBER = {
    davidGoliath: {
      title: 'What happened next?',
      encouragement: 'Put the story in order — God was with David!',
      beats: [
        { id: 'a', label: 'Goliath shouts at God’s people' },
        { id: 'b', label: 'Young David trusts the Lord' },
        { id: 'c', label: 'David takes his sling and stones' },
        { id: 'd', label: 'The giant falls — God wins the day' }
      ]
    },
    jesusChildren: {
      title: 'What happened next?',
      encouragement: 'Tap the parts in order — Jesus welcomes little ones!',
      beats: [
        { id: 'a', label: 'Parents bring children to Jesus' },
        { id: 'b', label: 'Disciples try to send them away' },
        { id: 'c', label: 'Jesus says, Let them come' },
        { id: 'd', label: 'Jesus blesses the children' }
      ]
    },
    goodShepherd: {
      title: 'What happened next?',
      encouragement: 'Order the story — the Shepherd finds His sheep!',
      beats: [
        { id: 'a', label: 'One little sheep is lost' },
        { id: 'b', label: 'The Shepherd goes looking' },
        { id: 'c', label: 'He finds the sheep' },
        { id: 'd', label: 'He carries it safely home' }
      ]
    },
    noah: {
      title: 'What happened next?',
      encouragement: 'Put Noah’s story in order!',
      beats: [
        { id: 'a', label: 'God tells Noah to build the ark' },
        { id: 'b', label: 'Animals go in two by two' },
        { id: 'c', label: 'The rain comes, then the waters go down' },
        { id: 'd', label: 'God sets a rainbow promise in the sky' }
      ]
    },
    lostSheep: {
      title: 'What happened next?',
      encouragement: 'What happened next? You can do it!',
      beats: [
        { id: 'a', label: 'Ninety-nine sheep are safe' },
        { id: 'b', label: 'One sheep wanders away' },
        { id: 'c', label: 'The shepherd searches until he finds it' },
        { id: 'd', label: 'He rejoices — the lost is found' }
      ]
    },
    prodigalSon: {
      title: 'What happened next?',
      encouragement: 'Order the welcome-home story!',
      beats: [
        { id: 'a', label: 'The younger son leaves home' },
        { id: 'b', label: 'He wastes what he was given' },
        { id: 'c', label: 'He turns back toward his father' },
        { id: 'd', label: 'Father runs to welcome him with love' }
      ]
    },
    goodSamaritan: {
      title: 'What happened next?',
      encouragement: 'Who showed mercy? Put it in order!',
      beats: [
        { id: 'a', label: 'A man is hurt on the road' },
        { id: 'b', label: 'Some people pass by' },
        { id: 'c', label: 'A Samaritan stops to help' },
        { id: 'd', label: 'He cares for him and pays the inn' }
      ]
    },
    feedingFiveThousand: {
      title: 'What happened next?',
      encouragement: 'Jesus provides — order the story!',
      beats: [
        { id: 'a', label: 'A big crowd is hungry' },
        { id: 'b', label: 'A boy shares five loaves and two fish' },
        { id: 'c', label: 'Jesus gives thanks and multiplies the food' },
        { id: 'd', label: 'Everyone eats — baskets left over' }
      ]
    },
    danielLionsDen: {
      title: 'What happened next?',
      encouragement: 'God kept Daniel safe — put the story in order!',
      beats: [
        { id: 'a', label: 'Daniel keeps praying to God' },
        { id: 'b', label: 'He is put in the lions’ den' },
        { id: 'c', label: 'God shuts the lions’ mouths' },
        { id: 'd', label: 'Daniel is safe — God is faithful' }
      ]
    },
    mustardSeed: {
      title: 'What happened next?',
      encouragement: 'Small faith, big God — order the picture!',
      beats: [
        { id: 'a', label: 'Jesus talks about a tiny seed' },
        { id: 'b', label: 'The seed is planted' },
        { id: 'c', label: 'It grows into a big plant' },
        { id: 'd', label: 'Birds rest in its branches' }
      ]
    },
    creation: {
      title: 'What happened next?',
      encouragement: 'God made everything good — put the days in order!',
      beats: [
        { id: 'a', label: 'God makes light' },
        { id: 'b', label: 'God makes sky, land, and seas' },
        { id: 'c', label: 'God makes plants, sun, moon, and animals' },
        { id: 'd', label: 'God makes people — and rests on the seventh day' }
      ]
    },
    womanAtWell: {
      title: 'What happened next?',
      encouragement: 'Jesus meets her with living water — order the story!',
      beats: [
        { id: 'a', label: 'Jesus rests at the well' },
        { id: 'b', label: 'A woman comes for water' },
        { id: 'c', label: 'Jesus talks with her about living water' },
        { id: 'd', label: 'She runs to tell others about Him' }
      ]
    },
    zacchaeus: {
      title: 'What happened next?',
      encouragement: 'Jesus sees Zacchaeus — put it in order!',
      beats: [
        { id: 'a', label: 'Zacchaeus climbs a tree to see Jesus' },
        { id: 'b', label: 'Jesus looks up and calls him' },
        { id: 'c', label: 'Jesus goes to his house' },
        { id: 'd', label: 'Zacchaeus’s heart is changed' }
      ]
    },
    jesusWalksWater: {
      title: 'What happened next?',
      encouragement: 'Jesus saves Peter — order the story!',
      beats: [
        { id: 'a', label: 'The disciples are in a boat in the wind' },
        { id: 'b', label: 'Jesus walks on the water toward them' },
        { id: 'c', label: 'Peter walks, then gets afraid' },
        { id: 'd', label: 'Jesus catches him — “Be not afraid”' }
      ]
    },
    houseOnRock: {
      title: 'What happened next?',
      encouragement: 'Wise or foolish builder — put Jesus’ story in order!',
      beats: [
        { id: 'a', label: 'A wise man builds on rock' },
        { id: 'b', label: 'A foolish man builds on sand' },
        { id: 'c', label: 'The storm comes' },
        { id: 'd', label: 'The house on rock stands firm' }
      ]
    },
    sower: {
      title: 'What happened next?',
      encouragement: 'The sower’s seeds — order the story!',
      beats: [
        { id: 'a', label: 'A sower scatters seed' },
        { id: 'b', label: 'Some seed falls on hard ground' },
        { id: 'c', label: 'Some falls among thorns' },
        { id: 'd', label: 'Some falls on good ground and grows' }
      ]
    },
    /* —— More flagship packs (batch 2) —— */
    manna: {
      title: 'What happened next?',
      encouragement: 'God feeds His people — put it in order!',
      beats: [
        { id: 'a', label: 'God promises bread from heaven' },
        { id: 'b', label: 'White flakes appear on the ground' },
        { id: 'c', label: 'Moses names the manna' },
        { id: 'd', label: 'They gather only what they need each day' }
      ]
    },
    redSea: {
      title: 'What happened next?',
      encouragement: 'God makes a way — order the story!',
      beats: [
        { id: 'a', label: 'Israel is trapped at the sea' },
        { id: 'b', label: 'Moses lifts his hand as God said' },
        { id: 'c', label: 'The waters part — dry ground' },
        { id: 'd', label: 'God’s people walk through safely' }
      ]
    },
    jerichoWalls: {
      title: 'What happened next?',
      encouragement: 'The walls fall — put Joshua’s story in order!',
      beats: [
        { id: 'a', label: 'Jericho has strong walls' },
        { id: 'b', label: 'God gives Joshua the plan' },
        { id: 'c', label: 'They obey every quiet step' },
        { id: 'd', label: 'God makes the walls fall' }
      ]
    },
    fallOfJericho: {
      title: 'What happened next?',
      encouragement: 'The walls fall — put Joshua’s story in order!',
      beats: [
        { id: 'a', label: 'Jericho has strong walls' },
        { id: 'b', label: 'God gives Joshua the plan' },
        { id: 'c', label: 'They obey every quiet step' },
        { id: 'd', label: 'God makes the walls fall' }
      ]
    },
    jordanCrossing: {
      title: 'What happened next?',
      encouragement: 'Through the river with God — order the story!',
      beats: [
        { id: 'a', label: 'Israel stands at the river' },
        { id: 'b', label: 'God says what will happen' },
        { id: 'c', label: 'Dry ground appears in the river' },
        { id: 'd', label: 'They cross safely to the other side' }
      ]
    },
    ruthNaomi: {
      title: 'What happened next?',
      encouragement: 'Ruth stays faithful — put it in order!',
      beats: [
        { id: 'a', label: 'Naomi loses her family in a far land' },
        { id: 'b', label: 'Ruth will not leave her' },
        { id: 'c', label: 'They return toward Bethlehem' },
        { id: 'd', label: '“Thy people shall be my people”' }
      ]
    },
    esther: {
      title: 'What happened next?',
      encouragement: 'Brave queen for such a time — order the story!',
      beats: [
        { id: 'a', label: 'Esther is far from home' },
        { id: 'b', label: 'A hard plan threatens her people' },
        { id: 'c', label: 'Esther is brave and goes to the king' },
        { id: 'd', label: 'God uses her “for such a time as this”' }
      ]
    },
    elijahRavens: {
      title: 'What happened next?',
      encouragement: 'God cares for Elijah — order the story!',
      beats: [
        { id: 'a', label: 'Elijah speaks God’s word about the rain' },
        { id: 'b', label: 'God says hide by the brook' },
        { id: 'c', label: 'Elijah stays by the water' },
        { id: 'd', label: 'Ravens bring bread and meat morning and evening' }
      ]
    },
    elijahFire: {
      title: 'What happened next?',
      encouragement: 'The Lord answers by fire — put it in order!',
      beats: [
        { id: 'a', label: '“If the Lord be God, follow him”' },
        { id: 'b', label: 'False prophets call all day — no fire' },
        { id: 'c', label: 'Elijah prepares the altar for the Lord' },
        { id: 'd', label: 'Elijah prays — God answers with fire' }
      ]
    },
    jesusBirth: {
      title: 'What happened next?',
      encouragement: 'Jesus is born — order the story!',
      beats: [
        { id: 'a', label: 'Mary and Joseph travel to Bethlehem' },
        { id: 'b', label: 'There is no room in the inn' },
        { id: 'c', label: 'Baby Jesus is laid in a manger' },
        { id: 'd', label: 'Angels tell the shepherds good news' }
      ]
    },
    jesusCalmsStorm: {
      title: 'What happened next?',
      encouragement: 'Peace, be still — put it in order!',
      beats: [
        { id: 'a', label: 'Jesus and the disciples are in a boat' },
        { id: 'b', label: 'A great storm rises' },
        { id: 'c', label: 'Jesus speaks to the wind and sea' },
        { id: 'd', label: 'There is a great calm' }
      ]
    },
    jesusFeeds5000: {
      title: 'What happened next?',
      encouragement: 'Jesus feeds the crowd — order the story!',
      beats: [
        { id: 'a', label: 'A big crowd is hungry' },
        { id: 'b', label: 'A boy shares five loaves and two fish' },
        { id: 'c', label: 'Jesus gives thanks and multiplies the food' },
        { id: 'd', label: 'Everyone eats — baskets left over' }
      ]
    },
    lazarus: {
      title: 'What happened next?',
      encouragement: 'Jesus and Lazarus — put the story in order!',
      beats: [
        { id: 'a', label: 'Lazarus is sick — friends send for Jesus' },
        { id: 'b', label: 'Jesus comes when Lazarus has died' },
        { id: 'c', label: 'Jesus weeps with those who weep' },
        { id: 'd', label: 'Jesus calls Lazarus out of the tomb' }
      ]
    },
    tombEmpty: {
      title: 'What happened next?',
      encouragement: 'He is risen — order the story!',
      beats: [
        { id: 'a', label: 'Friends come early to the tomb' },
        { id: 'b', label: 'The stone is rolled away' },
        { id: 'c', label: 'The tomb is empty' },
        { id: 'd', label: 'Jesus is risen — good news to tell' }
      ]
    },
    resurrection: {
      title: 'What happened next?',
      encouragement: 'He is risen — order the story!',
      beats: [
        { id: 'a', label: 'Friends come early to the tomb' },
        { id: 'b', label: 'The stone is rolled away' },
        { id: 'c', label: 'The tomb is empty' },
        { id: 'd', label: 'Jesus is risen — good news to tell' }
      ]
    },
    jesusResurrection: {
      title: 'What happened next?',
      encouragement: 'He is risen — order the story!',
      beats: [
        { id: 'a', label: 'Friends come early to the tomb' },
        { id: 'b', label: 'The stone is rolled away' },
        { id: 'c', label: 'The tomb is empty' },
        { id: 'd', label: 'Jesus is risen — good news to tell' }
      ]
    },
    roadToEmmaus: {
      title: 'What happened next?',
      encouragement: 'Jesus walks with them — put it in order!',
      beats: [
        { id: 'a', label: 'Two friends walk to Emmaus, sad' },
        { id: 'b', label: 'A stranger walks with them' },
        { id: 'c', label: 'He opens the Scriptures to them' },
        { id: 'd', label: 'They know Him in the breaking of bread' }
      ]
    },
    pentecost: {
      title: 'What happened next?',
      encouragement: 'The Spirit comes — order the story!',
      beats: [
        { id: 'a', label: 'The disciples wait together' },
        { id: 'b', label: 'A sound like a mighty wind' },
        { id: 'c', label: 'They speak of God’s wonderful works' },
        { id: 'd', label: 'Peter preaches — many believe' }
      ]
    },
    paulDamascus: {
      title: 'What happened next?',
      encouragement: 'Jesus changes Saul — put it in order!',
      beats: [
        { id: 'a', label: 'Saul travels to hurt Jesus’ followers' },
        { id: 'b', label: 'A bright light from heaven stops him' },
        { id: 'c', label: 'Jesus speaks — “Why persecutest thou me?”' },
        { id: 'd', label: 'Saul’s heart is turned — he will follow Jesus' }
      ]
    },
    josephSold: {
      title: 'What happened next?',
      encouragement: 'God is with Joseph — order the story!',
      beats: [
        { id: 'a', label: 'Joseph’s brothers are jealous' },
        { id: 'b', label: 'They sell Joseph away' },
        { id: 'c', label: 'Joseph goes to Egypt' },
        { id: 'd', label: 'God is still with him there' }
      ]
    },
    mosesBush: {
      title: 'What happened next?',
      encouragement: 'The burning bush — put it in order!',
      beats: [
        { id: 'a', label: 'Moses sees a bush on fire that does not burn up' },
        { id: 'b', label: 'God calls his name' },
        { id: 'c', label: 'Moses takes off his shoes — holy ground' },
        { id: 'd', label: 'God sends him to help His people' }
      ]
    },
    tenCommandments: {
      title: 'What happened next?',
      encouragement: 'God gives His words — order the story!',
      beats: [
        { id: 'a', label: 'Israel camps at the mountain' },
        { id: 'b', label: 'God speaks with power and glory' },
        { id: 'c', label: 'Moses receives God’s commandments' },
        { id: 'd', label: 'God teaches love for Him and for people' }
      ]
    },
    armorOfGod: {
      title: 'What happened next?',
      encouragement: 'Put on the whole armour — order the pieces!',
      beats: [
        { id: 'a', label: 'Be strong in the Lord' },
        { id: 'b', label: 'Stand with truth and righteousness' },
        { id: 'c', label: 'Take the shield of faith' },
        { id: 'd', label: 'Pray always — the battle is the Lord’s' }
      ]
    },
    psalm23: {
      title: 'What happened next?',
      encouragement: 'The Lord is my shepherd — walk the psalm!',
      beats: [
        { id: 'a', label: 'The Lord is my shepherd' },
        { id: 'b', label: 'Green pastures and still waters' },
        { id: 'c', label: 'He is with me in the valley' },
        { id: 'd', label: 'Goodness and mercy follow me' }
      ]
    },
    jesusBlessKids: {
      title: 'What happened next?',
      encouragement: 'Jesus welcomes little ones — order the story!',
      beats: [
        { id: 'a', label: 'Parents bring children so Jesus will touch them' },
        { id: 'b', label: 'Disciples try to stop them' },
        { id: 'c', label: 'Jesus is displeased with that' },
        { id: 'd', label: 'He puts His hands on the children and blesses them' }
      ]
    },
    jonah: {
      title: 'What happened next?',
      encouragement: 'Jonah and God’s mercy — put it in order!',
      beats: [
        { id: 'a', label: 'God sends Jonah to Nineveh' },
        { id: 'b', label: 'Jonah runs the other way' },
        { id: 'c', label: 'A great fish — Jonah prays' },
        { id: 'd', label: 'Jonah goes — God shows mercy' }
      ]
    },
    davidAnointed: {
      title: 'What happened next?',
      encouragement: 'God looks on the heart — order the story!',
      beats: [
        { id: 'a', label: 'Samuel is sent to Jesse’s house' },
        { id: 'b', label: 'The tall brothers pass by' },
        { id: 'c', label: 'God chooses the youngest — David' },
        { id: 'd', label: 'David is anointed; the Spirit is with him' }
      ]
    },
    gideonMidianites: {
      title: 'What happened next?',
      encouragement: 'God’s small army wins — order the story!',
      beats: [
        { id: 'a', label: 'Too many soldiers for the battle' },
        { id: 'b', label: 'Gideon listens as God counts them down' },
        { id: 'c', label: 'Only three hundred remain' },
        { id: 'd', label: 'They trust God — and He gives the victory' }
      ]
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
