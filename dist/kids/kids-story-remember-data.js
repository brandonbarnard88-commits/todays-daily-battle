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
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
