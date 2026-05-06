/**
 * Maps Bible character names (lowercase) to arrays of key verse references.
 * Use for verse lookup by person, study guides, etc.
 */
(function (root) {
  root.PEOPLE_VERSE_MAP = root.PEOPLE_VERSE_MAP || {
    "jesus": ["John 3:16", "Matthew 28:6", "Philippians 2:9", "Hebrews 12:2", "Revelation 1:8"],
    "mary magdalene": ["Luke 8:2", "John 19:25", "John 20:1", "Mark 16:9"],
    "moses": ["Exodus 2:10", "Exodus 3:4", "Exodus 14:21", "Exodus 20:1", "Deuteronomy 34:5"],
    "david": ["1 Samuel 16:7", "1 Samuel 17:45", "2 Samuel 7:12", "Psalm 23:1", "Psalm 51:1"],
    "abraham": ["Genesis 12:1", "Genesis 15:6", "Genesis 22:2", "Hebrews 11:8"],
    "paul": ["Acts 9:4", "Acts 13:2", "Romans 8:38", "2 Timothy 4:7", "Philippians 4:13"],
    "peter": ["Matthew 16:16", "Matthew 26:74", "John 21:15", "Acts 2:14", "Acts 3:6"],
    "esther": ["Esther 2:17", "Esther 4:14", "Esther 5:2", "Esther 7:3"],
    "daniel": ["Daniel 1:8", "Daniel 3:17", "Daniel 6:10", "Daniel 6:22"],
    "noah": ["Genesis 6:22", "Genesis 7:1", "Genesis 9:13", "Hebrews 11:7"],
    "sarah": ["Genesis 18:12", "Genesis 21:2", "Hebrews 11:11"],
    "joseph": ["Genesis 37:28", "Genesis 41:41", "Genesis 50:20"],
    "ruth": ["Ruth 1:16", "Ruth 2:2", "Ruth 4:13", "Matthew 1:5"],
    "elijah": ["1 Kings 17:1", "1 Kings 18:39", "2 Kings 2:11", "Malachi 4:5"],
    "mary": ["Luke 1:38", "Luke 1:46", "Luke 2:19", "John 19:25"],
    "john the baptist": ["Matthew 3:11", "Matthew 3:16", "Luke 1:13", "John 1:29"],
    "joshua": ["Joshua 1:9", "Joshua 6:20", "Joshua 24:15"],
    "job": ["Job 1:21", "Job 2:10", "Job 42:10", "James 5:11"],
    "rahab": ["Joshua 2:11", "Joshua 6:25", "Hebrews 11:31", "James 2:25"],
    "solomon": ["1 Kings 3:9", "1 Kings 6:1", "Proverbs 1:1", "Ecclesiastes 1:1"],
    "stephen": ["Acts 6:5", "Acts 6:8", "Acts 7:55", "Acts 7:60"],
    "timothy": ["Acts 16:1", "1 Timothy 1:2", "2 Timothy 1:5", "2 Timothy 4:7"],
    "adam": ["Genesis 1:27", "Genesis 2:7", "Genesis 3:15", "Romans 5:12"],
    "eve": ["Genesis 2:22", "Genesis 3:4", "Genesis 3:20", "1 Timothy 2:13"],
    "isaac": ["Genesis 22:2", "Genesis 22:12", "Genesis 26:24", "Hebrews 11:20"],
    "jacob": ["Genesis 28:12", "Genesis 32:28", "Genesis 49:10", "Hebrews 11:21"],
    "aaron": ["Exodus 4:14", "Exodus 28:1", "Numbers 17:8", "Hebrews 5:4"],
    "samson": ["Judges 13:24", "Judges 16:17", "Judges 16:28", "Hebrews 11:32"],
    "elisha": ["2 Kings 2:9", "2 Kings 2:12", "2 Kings 5:14", "2 Kings 13:21"],
    "jonah": ["Jonah 1:3", "Jonah 2:10", "Jonah 3:5", "Matthew 12:40"],
    "lazarus": ["John 11:43", "John 12:1", "John 12:9"],
    "deborah": ["Judges 4:4", "Judges 4:9", "Judges 5:1"],
    "gideon": ["Judges 6:12", "Judges 6:36", "Judges 7:7", "Hebrews 11:32"],
    "samuel": ["1 Samuel 3:4", "1 Samuel 3:10", "1 Samuel 16:13", "Hebrews 11:32"],
    "nehemiah": ["Nehemiah 1:4", "Nehemiah 2:4", "Nehemiah 6:15"],
    "isaiah": ["Isaiah 6:8", "Isaiah 7:14", "Isaiah 53:5", "Matthew 3:3"],
    "jeremiah": ["Jeremiah 1:5", "Jeremiah 29:11", "Jeremiah 31:31", "Lamentations 3:22"],
    "martha": ["Luke 10:38", "Luke 10:40", "John 11:21", "John 11:27"],
    "barnabas": ["Acts 4:36", "Acts 9:27", "Acts 11:24", "Acts 13:2"],
    "john": ["John 13:23", "John 19:26", "John 20:2", "Revelation 1:1"],
    "enoch": ["Genesis 5:24", "Hebrews 11:5", "Jude 1:14"],
    "caleb": ["Numbers 13:30", "Numbers 14:24", "Joshua 14:12", "Joshua 14:14"],
    "ezra": ["Ezra 7:6", "Ezra 7:10", "Nehemiah 8:1", "Nehemiah 8:8"],
    "ezekiel": ["Ezekiel 1:1", "Ezekiel 37:1", "Ezekiel 37:14"],
    "hannah": ["1 Samuel 1:10", "1 Samuel 1:27", "1 Samuel 2:1"],
    "hezekiah": ["2 Kings 18:5", "2 Kings 19:15", "2 Chronicles 30:1", "2 Chronicles 32:8"],
    "matthew": ["Matthew 9:9", "Matthew 10:3", "Mark 2:14"],
    "nicodemus": ["John 3:1", "John 3:4", "John 7:50", "John 19:39"],
    "philip": ["John 1:43", "John 6:5", "John 14:8", "Acts 8:26"],
    "thomas": ["John 11:16", "John 20:25", "John 20:28"],
    "elizabeth": ["Luke 1:13", "Luke 1:41", "Luke 1:57"],
    "anna": ["Luke 2:36", "Luke 2:38"],
    "andrew": ["John 1:40", "John 1:42", "John 6:8", "John 12:22"],
    "luke": ["Luke 1:1", "Acts 16:10", "Colossians 4:14", "2 Timothy 4:11"],
    "mark": ["Acts 12:12", "Acts 15:37", "2 Timothy 4:11", "Mark 1:1"],
    "silas": ["Acts 15:40", "Acts 16:25", "1 Thessalonians 1:1", "2 Thessalonians 1:1"],
    "priscilla": ["Acts 18:2", "Acts 18:18", "Acts 18:26", "Romans 16:3"],
    "aquila": ["Acts 18:2", "Acts 18:18", "Acts 18:26", "Romans 16:3"],
    "lydia": ["Acts 16:14", "Acts 16:15", "Acts 16:40"],
    "cornelius": ["Acts 10:1", "Acts 10:3", "Acts 10:44", "Acts 10:48"],
    "bartholomew": ["Matthew 10:3", "John 1:45", "John 1:49", "Acts 1:13"],
    "judas thaddaeus": ["Matthew 10:3", "Luke 6:16", "John 14:22", "Jude 1:1"],
    "simon the zealot": ["Matthew 10:4", "Mark 3:18", "Luke 6:15", "Acts 1:13"],
    "judas iscariot": ["Matthew 26:14", "Matthew 26:48", "Matthew 27:5", "John 13:27"],
    "saul": ["1 Samuel 10:1", "1 Samuel 15:23", "1 Samuel 31:4"],
    "bathsheba": ["2 Samuel 11:3", "2 Samuel 12:24", "1 Kings 1:15", "1 Kings 1:28"],
    "boaz": ["Ruth 2:1", "Ruth 3:11", "Ruth 4:9", "Matthew 1:5"],
    "naomi": ["Ruth 1:4", "Ruth 1:20", "Ruth 2:20", "Ruth 4:14"],
    "mordecai": ["Esther 2:7", "Esther 4:14", "Esther 6:10", "Esther 8:2"],
    "josiah": ["2 Kings 22:2", "2 Kings 22:11", "2 Kings 23:25", "2 Chronicles 34:3"],
    "zechariah": ["Luke 1:11", "Luke 1:13", "Luke 1:67", "Luke 1:79"],
    "malachi": ["Malachi 1:1", "Malachi 3:1", "Malachi 4:5"],
    "hosea": ["Hosea 1:2", "Hosea 3:1", "Hosea 11:8"],
    "amos": ["Amos 1:1", "Amos 5:24", "Amos 7:14"],
    "mary of bethany": ["Luke 10:39", "Luke 10:42", "John 11:2", "John 12:3"],
    "zacchaeus": ["Luke 19:2", "Luke 19:5", "Luke 19:8", "Luke 19:9"],
    "titus": ["Galatians 2:3", "2 Corinthians 8:6", "Titus 1:4", "Titus 1:5"],
    "apollos": ["Acts 18:24", "Acts 18:26", "Acts 19:1", "1 Corinthians 1:12"],
    "dorcas": ["Acts 9:36", "Acts 9:39", "Acts 9:40", "Acts 9:41"],
    "abel": ["Genesis 4:4", "Genesis 4:8", "Hebrews 11:4", "1 John 3:12"],
    "cain": ["Genesis 4:5", "Genesis 4:8", "Genesis 4:15", "1 John 3:12"],
    "melchizedek": ["Genesis 14:18", "Genesis 14:20", "Hebrews 5:6", "Hebrews 7:1"],
    "shadrach": ["Daniel 1:7", "Daniel 3:16", "Daniel 3:25", "Daniel 3:28"],
    "meshach": ["Daniel 1:7", "Daniel 3:16", "Daniel 3:25", "Daniel 3:28"],
    "abednego": ["Daniel 1:7", "Daniel 3:16", "Daniel 3:25", "Daniel 3:28"],
    "nebuchadnezzar": ["Daniel 2:46", "Daniel 3:15", "Daniel 4:34", "Daniel 4:37"],
    "cyrus": ["2 Chronicles 36:22", "Ezra 1:1", "Ezra 1:2", "Isaiah 44:28"],
    "pontius pilate": ["Matthew 27:2", "Matthew 27:24", "John 18:38", "John 19:19"],
    "herod": ["Matthew 2:3", "Matthew 2:16", "Matthew 14:1", "Luke 23:11"],
    "caiaphas": ["Matthew 26:3", "Matthew 26:57", "John 11:50", "John 18:14"],
    "simon of cyrene": ["Matthew 27:32", "Mark 15:21", "Luke 23:26"],
    "cleopas": ["Luke 24:18", "Luke 24:31", "Luke 24:32"],
    "bartimaeus": ["Mark 10:46", "Mark 10:52", "Luke 18:35"],
    "centurion": ["Matthew 8:5", "Matthew 8:8", "Matthew 8:10", "Luke 7:6"],
    "eunice": ["2 Timothy 1:5", "Acts 16:1"],
    "lois": ["2 Timothy 1:5"],
    "seth": ["Genesis 4:25", "Genesis 5:3", "Luke 3:38"],
    "ishmael": ["Genesis 16:11", "Genesis 16:15", "Genesis 21:9", "Genesis 21:20"],
    "hagar": ["Genesis 16:7", "Genesis 16:13", "Genesis 21:17", "Galatians 4:24"],
    "goliath": ["1 Samuel 17:4", "1 Samuel 17:45", "1 Samuel 17:50"],
    "jonathan": ["1 Samuel 18:1", "1 Samuel 18:3", "1 Samuel 20:42", "2 Samuel 1:26"],
    "eli": ["1 Samuel 1:9", "1 Samuel 3:8", "1 Samuel 4:18"],
    "naaman": ["2 Kings 5:1", "2 Kings 5:14", "2 Kings 5:15", "Luke 4:27"],
    "jehoshaphat": ["1 Kings 22:5", "2 Chronicles 17:3", "2 Chronicles 20:20"],
    "manasseh": ["2 Kings 21:1", "2 Kings 21:2", "2 Chronicles 33:12", "2 Chronicles 33:13"],
    "darius": ["Daniel 5:31", "Daniel 6:1", "Daniel 6:16", "Daniel 6:23"],
    "matthias": ["Acts 1:23", "Acts 1:26"],
    "gamaliel": ["Acts 5:34", "Acts 22:3"],
    "philip the evangelist": ["Acts 6:5", "Acts 8:5", "Acts 8:26", "Acts 8:38"],
    "joseph": ["Matthew 1:19", "Matthew 1:24", "Matthew 2:13", "Luke 2:4"],
    "simeon": ["Luke 2:25", "Luke 2:28", "Luke 2:34"],
    "jairus": ["Matthew 9:18", "Mark 5:22", "Luke 8:41", "Luke 8:54"],
    "samaritan woman": ["John 4:7", "John 4:9", "John 4:25", "John 4:39"],
    "philemon": ["Philemon 1:1", "Philemon 1:10", "Philemon 1:17"],
    "onesimus": ["Philemon 1:10", "Philemon 1:16", "Colossians 4:9"],
    "agabus": ["Acts 11:28", "Acts 21:10", "Acts 21:11"],
    "penitent thief": ["Luke 23:40", "Luke 23:42", "Luke 23:43"],
    "barabbas": ["Matthew 27:16", "Matthew 27:21", "Matthew 27:26", "John 18:40"],
    "syrophoenician woman": ["Matthew 15:22", "Matthew 15:28", "Mark 7:26"],
    "rich young ruler": ["Matthew 19:16", "Matthew 19:22", "Mark 10:17", "Luke 18:18"],
    "woman with issue of blood": ["Matthew 9:20", "Matthew 9:22", "Mark 5:25", "Luke 8:43"],
    "rebekah": ["Genesis 24:15", "Genesis 24:67", "Genesis 25:23", "Genesis 27:13"],
    "rachel": ["Genesis 29:18", "Genesis 29:30", "Genesis 35:18", "Matthew 2:18"],
    "leah": ["Genesis 29:16", "Genesis 29:35", "Genesis 30:17"],
    "esau": ["Genesis 25:34", "Genesis 27:36", "Genesis 33:4", "Hebrews 12:16"],
    "lot": ["Genesis 13:10", "Genesis 19:1", "Genesis 19:16", "2 Peter 2:7"],
    "miriam": ["Exodus 15:20", "Numbers 12:1", "Numbers 12:10", "Micah 6:4"],
    "jethro": ["Exodus 2:18", "Exodus 3:1", "Exodus 18:1", "Exodus 18:24"],
    "zerubbabel": ["Ezra 2:2", "Ezra 3:2", "Haggai 1:1", "Zechariah 4:6"],
    "haggai": ["Haggai 1:1", "Haggai 1:5", "Haggai 2:4"],
    "micah": ["Micah 5:2", "Micah 6:8", "Matthew 2:6"],
    "tamar": ["Genesis 38:6", "Genesis 38:24", "Genesis 38:29", "Matthew 1:3"],
    "ahab": ["1 Kings 16:30", "1 Kings 18:17", "1 Kings 21:19", "1 Kings 22:35"],
    "jezebel": ["1 Kings 18:4", "1 Kings 19:2", "1 Kings 21:7", "2 Kings 9:33"],
    "joel": ["Joel 1:1", "Joel 2:28", "Acts 2:16"],
    "obadiah": ["Obadiah 1:1", "1 Kings 18:3"],
    "nahum": ["Nahum 1:1", "Nahum 1:3", "Nahum 1:7"],
    "habakkuk": ["Habakkuk 1:2", "Habakkuk 2:4", "Habakkuk 3:17", "Romans 1:17"],
    "zephaniah": ["Zephaniah 1:1", "Zephaniah 2:3", "Zephaniah 3:17"],
    "james the less": ["Matthew 10:3", "Mark 3:18", "Acts 1:13"],
    "joseph of arimathea": ["Matthew 27:57", "Matthew 27:59", "Mark 15:43", "John 19:38"]
  };
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);

/** Load after people-verse-map.js. Returns bio + verses for a person, or null. */
function getPersonBio(name) {
  var key = (name || "").toLowerCase().trim();
  if (!key) return null;
  var verses = (typeof PEOPLE_VERSE_MAP !== "undefined" && PEOPLE_VERSE_MAP[key]) || [];
  var bio = (typeof BIBLE_CHARACTERS !== "undefined" && BIBLE_CHARACTERS[key]) || null;
  if (bio) return { name: bio.name, who: bio.who, did: bio.did, impact: bio.impact, verses: verses };
  if (verses.length) return { name: name, who: "", did: "", impact: "", verses: verses };
  return null;
}

/** Async: fetch bible-characters.json, find person, merge with verses. */
function getPersonBioAsync(name) {
  var key = (name || "").toLowerCase().trim();
  if (!key) return Promise.resolve(null);
  var verses = (typeof PEOPLE_VERSE_MAP !== "undefined" && PEOPLE_VERSE_MAP[key]) || [];
  return fetch("/bible-characters.json")
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (arr) {
      var person = null;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].name && arr[i].name.toLowerCase().trim() === key) {
          person = arr[i];
          break;
        }
      }
      if (!person) return verses.length ? { name: name, who: "", did: "", impact: "", verses: verses } : null;
      return { name: person.name, who: person.who, did: person.did, impact: person.impact, verses: verses };
    })
    .catch(function () { return null; });
}
