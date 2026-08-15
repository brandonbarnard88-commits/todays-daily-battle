/**
 * Full-Bible situation map: what was going on when this chapter/passage was spoken or written.
 * Used by build-verse-context to give every verse a real historical/literary backdrop.
 * Prefer specific ranges in verse-context-ranges.json; this fills the rest.
 */

/** @type {Record<string, Array<{ from: number, thru: number, situation: string, about?: string, to?: string }>>} */
export const BOOK_CHAPTER_SITUATIONS = {
  Genesis: [
    { from: 1, thru: 1, situation: 'God is creating the heavens and the earth from nothing.', about: 'Moses (recording God’s Word)', to: 'Israel — and anyone hearing creation’s beginning' },
    { from: 2, thru: 2, situation: 'God forms Adam and Eve and places them in the garden of Eden.', about: 'Moses (recording God’s Word)', to: 'Israel — and anyone hearing how people began' },
    { from: 3, thru: 3, situation: 'The serpent tempts Eve and Adam; sin enters the world and fellowship with God is broken.', about: 'The serpent, Eve, Adam, and the Lord God', to: 'Adam and Eve — and all of us after the fall' },
    { from: 4, thru: 5, situation: 'Cain murders Abel; generations pass from Adam toward the flood.', about: 'Moses (recording God’s Word)', to: 'Israel learning the cost of sin' },
    { from: 6, thru: 9, situation: 'The world is filled with violence; God saves Noah’s family through the flood and makes a covenant.', about: 'The Lord (through Moses’ account of Noah)', to: 'Noah’s household — and every generation under God’s promise' },
    { from: 10, thru: 11, situation: 'Nations spread after the flood; Babel rises in pride and God scatters the languages.', about: 'Moses (recording God’s Word)', to: 'Israel remembering how the nations began' },
    { from: 12, thru: 14, situation: 'God calls Abram to leave home; promise and conflict begin in Canaan.', about: 'The Lord and Abram (through Moses)', to: 'Abram — and all who walk by promise' },
    { from: 15, thru: 17, situation: 'God cuts covenant with Abram, renames him Abraham, and promises a son.', about: 'The Lord and Abraham', to: 'Abraham — and all who wait on God’s promise' },
    { from: 18, thru: 19, situation: 'The Lord visits Abraham; Sodom is judged and Lot is rescued.', about: 'The Lord, Abraham, and the angels', to: 'Abraham’s household — and all who intercede for the lost' },
    { from: 20, thru: 21, situation: 'Isaac is born to Abraham and Sarah in old age; Hagar and Ishmael are sent out.', about: 'Moses (recording Abraham’s story)', to: 'Abraham’s family under promise' },
    { from: 22, thru: 22, situation: 'God tests Abraham; Isaac is nearly offered, then God provides a ram.', about: 'The Lord and Abraham', to: 'Abraham — and all who trust God with what they love' },
    { from: 23, thru: 26, situation: 'Sarah dies; Isaac marries Rebekah; conflict and blessing continue in the family line.', about: 'Moses (recording the patriarchs)', to: 'Israel tracing God’s promise through the fathers' },
    { from: 27, thru: 28, situation: 'Jacob steals Esau’s blessing and flees; God meets him at Bethel.', about: 'Isaac, Rebekah, Jacob, and Esau (through Moses)', to: 'A broken family — and all who need God to meet them on the run' },
    { from: 29, thru: 31, situation: 'Jacob serves Laban, marries Leah and Rachel, and finally flees with his household.', about: 'Moses (recording Jacob’s years with Laban)', to: 'Jacob’s household under pressure' },
    { from: 32, thru: 33, situation: 'Jacob wrestles with God and is reconciled, carefully, with Esau.', about: 'Jacob and the Lord (through Moses)', to: 'Anyone facing a hard reunion' },
    { from: 34, thru: 36, situation: 'Violence and sorrow hit Jacob’s family; Esau’s line is listed.', about: 'Moses (recording Jacob’s troubles)', to: 'Israel seeing sin’s damage in the family' },
    { from: 37, thru: 41, situation: 'Joseph is sold into Egypt, imprisoned, then raised to interpret Pharaoh’s dreams.', about: 'Moses (recording Joseph’s story)', to: 'Anyone betrayed yet held by God' },
    { from: 42, thru: 45, situation: 'Joseph’s brothers come to Egypt for grain; Joseph tests them and reveals himself.', about: 'Joseph and his brothers (through Moses)', to: 'Families needing truth and mercy' },
    { from: 46, thru: 50, situation: 'Jacob’s family settles in Egypt; Jacob dies; Joseph forgives his brothers.', about: 'Joseph (through Moses)', to: 'His brothers — and all who need forgiveness after harm' }
  ],
  Exodus: [
    { from: 1, thru: 2, situation: 'Israel is enslaved in Egypt; Moses is born and flees after killing an Egyptian.', about: 'Moses (recording deliverance)', to: 'Israel remembering bondage and God’s rescue' },
    { from: 3, thru: 4, situation: 'God calls Moses from the burning bush to free Israel; Moses resists, then goes.', about: 'The Lord and Moses', to: 'Moses — and all who feel too small for a call' },
    { from: 5, thru: 11, situation: 'Moses confronts Pharaoh; plagues fall on Egypt as Pharaoh hardens his heart.', about: 'The Lord, Moses, and Pharaoh', to: 'Israel under oppression — and all who wait for deliverance' },
    { from: 12, thru: 13, situation: 'The Passover night; Israel leaves Egypt in haste with unleavened bread.', about: 'The Lord (through Moses)', to: 'Israel on the night of deliverance' },
    { from: 14, thru: 15, situation: 'Israel is trapped at the sea; God parts the waters and Egypt is overthrown; Israel sings.', about: 'Moses (recording the Lord’s deliverance)', to: 'Israel at the sea — and all who need a way through' },
    { from: 16, thru: 18, situation: 'God provides manna and water; Amalek is fought; Jethro advises Moses.', about: 'Moses (recording the wilderness)', to: 'Israel learning to trust God day by day' },
    { from: 19, thru: 24, situation: 'Israel camps at Sinai; God gives the Ten Commandments and the covenant law.', about: 'God', to: 'Israel at Sinai' },
    { from: 25, thru: 31, situation: 'God gives detailed plans for the tabernacle and the priesthood.', about: 'The Lord (through Moses)', to: 'Israel learning how a holy God dwells among them' },
    { from: 32, thru: 34, situation: 'Israel makes the golden calf; Moses intercedes; God renews the covenant.', about: 'Moses, Israel, and the Lord', to: 'A people who broke faith — and all who need mercy after failure' },
    { from: 35, thru: 40, situation: 'Israel builds the tabernacle; the glory of the Lord fills the finished house.', about: 'Moses (recording the building)', to: 'Israel seeing God move in among them' }
  ],
  Leviticus: [
    { from: 1, thru: 7, situation: 'At Sinai, God teaches Israel how offerings deal with sin and thanksgiving.', about: 'The Lord (through Moses)', to: 'Israel learning holiness before God' },
    { from: 8, thru: 10, situation: 'Aaron and his sons are set apart as priests; strange fire brings judgment.', about: 'Moses and Aaron (through the Lord)', to: 'Priests and people learning holy nearness' },
    { from: 11, thru: 16, situation: 'Laws of clean and unclean; the Day of Atonement covers the nation’s sin.', about: 'The Lord (through Moses)', to: 'Israel needing covering and purity' },
    { from: 17, thru: 27, situation: 'Holiness laws for daily life, festivals, and the land’s rest.', about: 'The Lord (through Moses)', to: 'Israel called to be holy as God is holy' }
  ],
  Numbers: [
    { from: 1, thru: 10, situation: 'Israel is counted and ordered around the tabernacle for the march from Sinai.', about: 'Moses (recording the Lord’s command)', to: 'Israel preparing to move as God’s camp' },
    { from: 11, thru: 14, situation: 'The people complain; spies fear Canaan; a generation is sentenced to die in the wilderness.', about: 'Moses, the spies, and the Lord', to: 'Israel under unbelief — and all who fear the next step' },
    { from: 15, thru: 19, situation: 'Laws continue; Korah rebels; the earth swallows the rebels; purification is taught.', about: 'Moses and Aaron (through the Lord)', to: 'Israel learning the cost of rebellion' },
    { from: 20, thru: 21, situation: 'Moses strikes the rock; Aaron dies; serpents come; Israel wins early battles east of Jordan.', about: 'Moses (recording the wilderness end)', to: 'Israel near the land, still tested' },
    { from: 22, thru: 25, situation: 'Balak hires Balaam to curse Israel; God turns curses into blessing; Israel falls into idolatry at Peor.', about: 'Balaam, Balak, and the Lord', to: 'Israel under spiritual attack' },
    { from: 26, thru: 36, situation: 'A new generation is numbered; inheritance laws and the journey’s last stages are set.', about: 'Moses (recording the new census)', to: 'The generation that will enter the land' }
  ],
  Deuteronomy: [
    { from: 1, thru: 4, situation: 'On the edge of Canaan, Moses retells the wilderness story and calls Israel to hear God again.', about: 'Moses', to: 'Israel on the edge of the land' },
    { from: 5, thru: 11, situation: 'Moses repeats the Ten Commandments and presses love for the Lord with the whole heart.', about: 'Moses', to: 'Israel about to enter the land' },
    { from: 12, thru: 26, situation: 'Moses lays out laws for worship, justice, and life in the land.', about: 'Moses', to: 'Israel preparing to live under God’s rule' },
    { from: 27, thru: 30, situation: 'Blessings and curses are set before Israel; Moses urges them to choose life.', about: 'Moses', to: 'Israel choosing covenant faithfulness' },
    { from: 31, thru: 34, situation: 'Joshua is commissioned; Moses sings, blesses the tribes, and dies on Mount Nebo.', about: 'Moses (and the narrator)', to: 'Israel at the death of their leader' }
  ],
  Joshua: [
    { from: 1, thru: 5, situation: 'Joshua takes command; Israel crosses the Jordan; Jericho falls by faith.', about: 'The Lord to Joshua (and the narrator)', to: 'Joshua — and anyone stepping into a hard new season' },
    { from: 6, thru: 12, situation: 'Israel conquers key cities in Canaan; sin at Ai is judged; southern and northern kings fall.', about: 'The narrator of Joshua', to: 'Israel taking the land God promised' },
    { from: 13, thru: 22, situation: 'The land is divided among the tribes; some settle east of Jordan.', about: 'Joshua (and the narrator)', to: 'The tribes receiving their inheritance' },
    { from: 23, thru: 24, situation: 'Joshua’s farewell: choose whom you will serve; Israel renews the covenant at Shechem.', about: 'Joshua', to: 'Israel after the conquest' }
  ],
  Judges: [
    { from: 1, thru: 3, situation: 'After Joshua, Israel fails to finish the conquest; cycles of sin and oppression begin.', about: 'The narrator of Judges', to: 'Israel in the days when every man did what was right in his own eyes' },
    { from: 4, thru: 5, situation: 'Deborah and Barak deliver Israel; Jael strikes Sisera; a victory song is sung.', about: 'Deborah, Barak, and the narrator', to: 'Israel under Canaanite oppression' },
    { from: 6, thru: 8, situation: 'Gideon fights Midian with a small band after testing God’s call with the fleece.', about: 'Gideon and the Lord (through the narrator)', to: 'Israel under Midian — and the fearful called to courage' },
    { from: 9, thru: 12, situation: 'Abimelech’s violence; Jephthah’s vow; more judges rise and fall.', about: 'The narrator of Judges', to: 'Israel in chaos between deliverers' },
    { from: 13, thru: 16, situation: 'Samson is born, fights the Philistines, and dies pulling down the temple of Dagon.', about: 'The narrator of Judges (with Samson)', to: 'Israel under Philistine pressure' },
    { from: 17, thru: 21, situation: 'Idolatry and civil war expose how far Israel has fallen without a king.', about: 'The narrator of Judges', to: 'Israel at moral bottom' }
  ],
  Ruth: [
    { from: 1, thru: 1, situation: 'In the days of the judges, Naomi loses husband and sons in Moab; Ruth clings to her and to Israel’s God.', about: 'The narrator of Ruth (with Naomi and Ruth)', to: 'Families under loss — and all who choose loyal love' },
    { from: 2, thru: 2, situation: 'Ruth gleans in Boaz’s field; he shows kindness beyond the law’s bare minimum.', about: 'The narrator of Ruth', to: 'The poor and the kind in Bethlehem' },
    { from: 3, thru: 4, situation: 'Ruth seeks Boaz as kinsman-redeemer; they marry; Obed is born in David’s line.', about: 'The narrator of Ruth', to: 'Bethlehem — and all waiting for redemption' }
  ],
  '1 Samuel': [
    { from: 1, thru: 3, situation: 'Hannah prays for a son; Samuel is born and serves under Eli; God calls the boy by name.', about: 'The narrator of Samuel (with Hannah, Eli, and Samuel)', to: 'Israel under corrupt priests — and the barren who pray' },
    { from: 4, thru: 7, situation: 'The ark is captured and returned; Samuel judges Israel and calls them back to the Lord.', about: 'The narrator of Samuel', to: 'Israel after defeat and recovery' },
    { from: 8, thru: 12, situation: 'Israel demands a king; Saul is anointed, confirmed in battle, and warned to obey.', about: 'Samuel, Saul, and the Lord', to: 'Israel choosing a king' },
    { from: 13, thru: 15, situation: 'Saul disobeys; God rejects him as king; the kingdom will pass to another.', about: 'Samuel and Saul', to: 'Saul — and all who put image before obedience' },
    { from: 16, thru: 17, situation: 'David is anointed; he fights Goliath while Saul’s army freezes in fear.', about: 'The narrator of Samuel (with David and Goliath)', to: 'Israel facing a giant — and anyone facing what feels too big' },
    { from: 18, thru: 20, situation: 'Saul envies David; Jonathan covenants with David; David flees for his life.', about: 'David, Jonathan, and Saul (through the narrator)', to: 'The hunted and the loyal friend' },
    { from: 21, thru: 27, situation: 'David lives as a fugitive; Saul pursues him; David spares Saul’s life more than once.', about: 'David and Saul (through the narrator)', to: 'Anyone running while still choosing mercy' },
    { from: 28, thru: 31, situation: 'Saul consults a medium; Philistines press hard; Saul and Jonathan die in battle.', about: 'The narrator of Samuel', to: 'Israel at the end of Saul’s reign' }
  ],
  '2 Samuel': [
    { from: 1, thru: 5, situation: 'David mourns Saul; he is crowned in Hebron, then over all Israel; the ark comes to Jerusalem.', about: 'David (through the narrator of Samuel)', to: 'Israel under a new king' },
    { from: 6, thru: 10, situation: 'David brings the ark with joy and fear; God covenants an everlasting house with David; wars expand the kingdom.', about: 'David and the Lord (through the narrator)', to: 'David’s court — and all who long for a lasting kingdom' },
    { from: 11, thru: 12, situation: 'David commits adultery with Bathsheba and arranges Uriah’s death; Nathan confronts him.', about: 'David, Bathsheba, Uriah, and Nathan', to: 'A fallen king — and all who need to repent' },
    { from: 13, thru: 18, situation: 'Absalom’s violence and rebellion tear David’s house; David flees, then grieves his son’s death.', about: 'David and Absalom (through the narrator)', to: 'A broken royal family' },
    { from: 19, thru: 24, situation: 'David returns to rule; further trouble and a census bring plague; David buys a threshing floor for an altar.', about: 'David (through the narrator)', to: 'Israel at the close of David’s wars' }
  ],
  '1 Kings': [
    { from: 1, thru: 2, situation: 'Solomon is made king after court intrigue; David dies; Solomon asks for wisdom.', about: 'The narrator of Kings (with David and Solomon)', to: 'Israel at the transfer of the throne' },
    { from: 3, thru: 8, situation: 'Solomon’s wisdom is famous; the temple is built and dedicated; God’s glory fills the house.', about: 'Solomon (through the narrator)', to: 'Israel at the height of the kingdom' },
    { from: 9, thru: 11, situation: 'Solomon’s heart turns after foreign gods; the kingdom is warned it will split.', about: 'The narrator of Kings', to: 'A king who had everything and drifted' },
    { from: 12, thru: 16, situation: 'The kingdom divides under Rehoboam and Jeroboam; kings rise and fall in both north and south.', about: 'The narrator of Kings', to: 'Israel and Judah under the kings' },
    { from: 17, thru: 19, situation: 'Elijah faces Ahab and Jezebel; fire falls on Carmel; Elijah flees and hears the still small voice.', about: 'Elijah and the Lord (through the narrator)', to: 'Israel under Baal worship — and the weary prophet' },
    { from: 20, thru: 22, situation: 'Wars with Syria; Naboth’s vineyard; Ahab dies in battle as Micaiah warned.', about: 'The narrator of Kings', to: 'Ahab’s court under judgment' }
  ],
  '2 Kings': [
    { from: 1, thru: 8, situation: 'Elijah is taken up; Elisha’s ministry begins with miracles and mercy in a dark kingdom.', about: 'Elijah, Elisha, and the narrator', to: 'Israel and Judah in the days of the prophets' },
    { from: 9, thru: 10, situation: 'Jehu destroys Ahab’s house and Baal worship, yet does not fully walk in God’s ways.', about: 'The narrator of Kings', to: 'The northern kingdom under Jehu' },
    { from: 11, thru: 17, situation: 'Joash repairs the temple; the north keeps sinning until Assyria carries Israel away.', about: 'The narrator of Kings', to: 'Israel heading toward exile' },
    { from: 18, thru: 20, situation: 'Hezekiah trusts the Lord; Assyria threatens Jerusalem; God delivers, then Hezekiah shows his treasure.', about: 'Hezekiah and Isaiah (through the narrator)', to: 'Judah under Assyrian threat' },
    { from: 21, thru: 23, situation: 'Manasseh’s evil; Josiah’s reforms and the rediscovered book of the law.', about: 'The narrator of Kings', to: 'Judah swinging between idolatry and revival' },
    { from: 24, thru: 25, situation: 'Babylon besieges Jerusalem; the temple falls; Judah goes into exile.', about: 'The narrator of Kings', to: 'Judah at the fall of the city' }
  ],
  '1 Chronicles': [
    { from: 1, thru: 9, situation: 'Genealogies retell Israel’s story for exiles who need to know who they are.', about: 'The chronicler', to: 'Exiles remembering God’s story' },
    { from: 10, thru: 16, situation: 'Saul dies; David becomes king; the ark is brought up with worship and thanksgiving.', about: 'The chronicler (with David’s story)', to: 'Exiles remembering true worship under David' },
    { from: 17, thru: 22, situation: 'God covenants with David; preparations begin for the temple Solomon will build.', about: 'David and the Lord (through the chronicler)', to: 'Exiles hoping in David’s line' },
    { from: 23, thru: 29, situation: 'Levites and priests are organized; David charges Solomon and the people give willingly.', about: 'David (through the chronicler)', to: 'Exiles learning generous worship' }
  ],
  '2 Chronicles': [
    { from: 1, thru: 9, situation: 'Solomon asks for wisdom; the temple is built and filled with glory.', about: 'Solomon (through the chronicler)', to: 'Exiles remembering the temple’s beginning' },
    { from: 10, thru: 20, situation: 'The kingdom divides; some kings seek the Lord, others fall; God still sends help.', about: 'The chronicler', to: 'Judah under the kings' },
    { from: 21, thru: 28, situation: 'Wicked and reforming kings alternate; the temple is neglected and restored by turns.', about: 'The chronicler', to: 'Judah needing reform' },
    { from: 29, thru: 32, situation: 'Hezekiah cleanses the temple and keeps Passover; Assyria threatens; God delivers.', about: 'Hezekiah (through the chronicler)', to: 'Judah under pressure' },
    { from: 33, thru: 36, situation: 'Manasseh repents late; Josiah reforms; Babylon takes Judah into exile; a return is promised.', about: 'The chronicler', to: 'Exiles at the end of the kingdom story' }
  ],
  Ezra: [
    { from: 1, thru: 3, situation: 'Cyrus lets the exiles return; the altar and temple foundation are laid amid opposition.', about: 'Ezra (and the narrator)', to: 'Returned exiles rebuilding' },
    { from: 4, thru: 6, situation: 'Enemies stop the work; prophets stir the people; the temple is finished under Darius.', about: 'The narrator of Ezra', to: 'Builders under harassment' },
    { from: 7, thru: 10, situation: 'Ezra brings the law; mixed marriages grieve him; the people repent.', about: 'Ezra', to: 'Returned exiles learning holiness again' }
  ],
  Nehemiah: [
    { from: 1, thru: 3, situation: 'Nehemiah weeps for Jerusalem’s walls; he rides to the city and rebuilds under mockery and threat.', about: 'Nehemiah', to: 'Returned exiles rebuilding walls and faith' },
    { from: 4, thru: 7, situation: 'Workers hold tools and weapons; internal injustice is confronted; the wall is finished.', about: 'Nehemiah', to: 'Builders under pressure' },
    { from: 8, thru: 10, situation: 'Ezra reads the law; the people weep, then rejoice; they renew the covenant.', about: 'Ezra and Nehemiah', to: 'A people hearing God’s Word again' },
    { from: 11, thru: 13, situation: 'Jerusalem is resettled; dedications are sung; Nehemiah reforms abuses once more.', about: 'Nehemiah', to: 'Jerusalem after the wall' }
  ],
  Esther: [
    { from: 1, thru: 2, situation: 'In Persia, Queen Vashti is removed; Esther is chosen queen while hiding she is a Jew.', about: 'The narrator of Esther', to: 'God’s people under foreign rule' },
    { from: 3, thru: 5, situation: 'Haman plots genocide; Esther risks her life to approach the king.', about: 'The narrator of Esther (with Esther and Mordecai)', to: 'Jews under a death decree' },
    { from: 6, thru: 10, situation: 'Haman is hanged; the Jews defend themselves; Purim is established.', about: 'The narrator of Esther', to: 'Jews delivered in Persia' }
  ],
  Job: [
    { from: 1, thru: 2, situation: 'Job loses children, wealth, and health; he refuses to curse God.', about: 'Job, his friends, and the Lord (through the narrator)', to: 'Anyone sitting with suffering and questions' },
    { from: 3, thru: 31, situation: 'Job and his friends debate why the righteous suffer; answers grow harsh and thin.', about: 'Job and his friends', to: 'Sufferers and would-be counselors' },
    { from: 32, thru: 37, situation: 'Young Elihu speaks into Job’s debate before the Lord answers from the whirlwind — pressing that God is just and greater than human argument.', about: 'Elihu', to: 'Job’s circle' },
    { from: 38, thru: 42, situation: 'The Lord answers Job from the whirlwind; Job repents in dust; God restores him.', about: 'The Lord and Job', to: 'Job — and all who need God more than explanations' }
  ],
  Psalm: [
    { from: 1, thru: 1, situation: 'Opening of the Psalter: two ways — the righteous rooted like a tree, the wicked like chaff.', about: 'Israel’s wisdom psalm — two ways set before every worshiper', to: 'Worshipers choosing the path of the righteous' },
    { from: 2, thru: 2, situation: 'The nations rage against the Lord’s anointed; God sets His King on Zion.', about: 'David — Acts names him as the voice of this psalm (Acts 4:25)', to: 'The nations — and all who take refuge in the Son' },
    { from: 3, thru: 7, situation: 'David cries out while hunted or opposed; he flees enemies and asks God to rise and judge.', about: 'David', to: 'Anyone under attack who still prays' },
    { from: 8, thru: 8, situation: 'A night-sky hymn: human frailty set beside God’s majesty and care for people.', about: 'David', to: 'Anyone who feels small under the heavens' },
    { from: 9, thru: 14, situation: 'David sings of God’s justice against oppressors and of the fool who says there is no God.', about: 'David', to: 'The oppressed and those tempted to forget God' },
    { from: 15, thru: 17, situation: 'Who may dwell with God; trust when the world shakes; a plea for protection from the violent.', about: 'David', to: 'Anyone seeking integrity and refuge' },
    { from: 18, thru: 18, situation: 'David’s great victory song after the Lord delivered him from Saul and all enemies.', about: 'David', to: 'Anyone delivered after a long fight' },
    { from: 19, thru: 19, situation: 'Creation declares God’s glory; His law revives the soul; David prays to be kept from secret faults.', about: 'David', to: 'Anyone hearing God in sky and Scripture' },
    { from: 20, thru: 21, situation: 'Royal prayers for the king’s victory and thanksgiving for God’s strength.', about: 'David', to: 'God’s people praying for their leader' },
    { from: 22, thru: 22, situation: 'A sufferer’s cry of forsakenness that turns to praise — later fulfilled at the cross.', about: 'David', to: 'The suffering righteous (and all who look to Christ)' },
    { from: 23, thru: 24, situation: 'The Lord as shepherd and host; the King of glory enters; trust in green pastures and still waters.', about: 'David', to: 'Anyone who needs a Shepherd' },
    { from: 25, thru: 28, situation: 'David seeks guidance, forgiveness, and help against false friends; the Lord is his light and strength.', about: 'David', to: 'Anyone fighting fear with faith' },
    { from: 29, thru: 30, situation: 'The voice of the Lord over the waters; David thanks God for lifting him from the pit.', about: 'David', to: 'Worshipers hearing God’s power and mercy' },
    { from: 31, thru: 33, situation: 'David commits his spirit to God under pressure; confession and instruction; a new song of praise.', about: 'David', to: 'The pressured and the repentant' },
    { from: 34, thru: 34, situation: 'David, after escaping Abimelech, teaches: taste and see that the Lord is good.', about: 'David', to: 'Anyone tasting that the Lord is good' },
    { from: 35, thru: 37, situation: 'David prays against unjust attackers; wicked prosperity is temporary; delight in the Lord.', about: 'David', to: 'Anyone watching the wicked prosper for a season' },
    { from: 38, thru: 41, situation: 'David in sickness, sin-awareness, and waiting; Book I closes with the blessedness of the one who considers the poor.', about: 'David', to: 'The sick, the guilty, and the waiting' },
    { from: 42, thru: 43, situation: 'Sons of Korah: a downcast soul thirsts for God and talks itself back toward hope.', about: 'The sons of Korah', to: 'Anyone whose soul is cast down' },
    { from: 44, thru: 49, situation: 'National lament, a royal wedding song, God as refuge in trouble, and the vanity of trusting riches.', about: 'The sons of Korah', to: 'Worshipers in joy and national distress' },
    { from: 50, thru: 51, situation: 'God summons His people to true worship; David confesses after Nathan confronts him about Bathsheba.', about: 'Asaph and David', to: 'God — and any heart needing mercy after failure' },
    { from: 52, thru: 60, situation: 'David under Saul’s pursuit and Doeg’s betrayal; cries from caves and defeat; God still rules.', about: 'David', to: 'The hunted and the betrayed' },
    { from: 61, thru: 68, situation: 'David seeks higher rock, waits on God alone, and leads joyful processions of praise.', about: 'David', to: 'Worshipers needing a rock higher than themselves' },
    { from: 69, thru: 71, situation: 'Deep waters of reproach and aging faith: David cries for rescue and keeps hoping in the Lord.', about: 'David', to: 'The reproached and the aging who still hope' },
    { from: 72, thru: 72, situation: 'Book II closes with a royal prayer for the king’s justice and blessing — “Amen, and Amen.”', about: 'Solomon (or a prayer for Solomon)', to: 'Those praying for a just king' },
    { from: 73, thru: 77, situation: 'Asaph nearly slips seeing the wicked prosper, then enters God’s sanctuary and remembers His deeds.', about: 'Asaph', to: 'The faithful confused by injustice' },
    { from: 78, thru: 83, situation: 'Israel’s history retold as warning; Jerusalem under threat; a cry for God to act against enemies.', about: 'Asaph', to: 'A people needing to remember and return' },
    { from: 84, thru: 85, situation: 'Longing for God’s courts; mercy and truth meet; the Lord is sun and shield.', about: 'The sons of Korah', to: 'Pilgrims longing for God’s house' },
    { from: 86, thru: 86, situation: 'David prays for mercy when he is poor and needy; God is good and ready to forgive.', about: 'David', to: 'Anyone poor in spirit who still calls on God' },
    { from: 87, thru: 87, situation: 'Zion is the city God loves; people from the nations are counted as born there.', about: 'The sons of Korah', to: 'Worshipers of Zion — and the nations gathered in' },
    { from: 88, thru: 88, situation: 'Heman cries from the edge of the grave; darkness is his closest companion, yet he still prays.', about: 'Heman the Ezrahite', to: 'Anyone whose prayer feels like night with no morning yet' },
    { from: 89, thru: 89, situation: 'Ethan wrestles with the seeming failure of David’s line while still singing God’s mercy.', about: 'Ethan the Ezrahite', to: 'Those clinging to God’s promise when it looks broken' },
    { from: 90, thru: 90, situation: 'Moses numbers our short days and asks God to establish the work of our hands.', about: 'Moses — a prayer of the man of God', to: 'A people numbering their days' },
    { from: 91, thru: 91, situation: 'A hymn of refuge under the shadow of the Almighty — protection for those who dwell in the secret place.', about: 'Israel’s refuge hymn — sung for those who dwell in the secret place of the Most High', to: 'Anyone who needs shelter under the Almighty' },
    { from: 92, thru: 92, situation: 'A Sabbath song of thanksgiving: the psalmist praises the Lord because His works make the heart glad and the righteous still flourish in old age.', about: 'A Sabbath song in Israel’s worship — thanksgiving that God’s works still make the heart glad', to: 'Worshipers giving thanks for God’s works' },
    { from: 93, thru: 93, situation: 'The Lord reigns: floods and noise cannot unseat Him; He is robed in majesty forever.', about: 'Israel’s congregation — a song that the Lord is King over the flood', to: 'Anyone who needs to know God still reigns' },
    /* Psalm 94 is not a “Lord reigns” enthronement hymn — it is a cry against injustice, then mercy when the foot slips. */
    { from: 94, thru: 94, situation: 'A cry against unjust thrones: the psalmist names oppression, then testifies that when his foot slipped, the Lord’s mercy held him up.', about: 'An unnamed psalm of Israel — a cry against unjust thrones, then mercy when the foot slips', to: 'Anyone whose footing feels uncertain under pressure' },
    { from: 95, thru: 95, situation: 'Come, sing to the Lord as King: do not harden your heart as Israel did in the wilderness.', about: 'David — Hebrews names him as the voice of this psalm (Hebrews 4:7)', to: 'Israel gathered to worship — and anyone whose heart is growing hard' },
    { from: 96, thru: 97, situation: 'Worship the Lord as King: a new song for all lands, idol-smashing glory, and joy for the upright.', about: 'Israel’s congregation — a song that the Lord is King over all the earth', to: 'All lands called to joyful worship' },
    { from: 98, thru: 100, situation: 'A new song for all the earth; holy worship; enter His gates with thanksgiving.', about: 'Israel’s congregation — calling all lands to enter His gates with thanksgiving', to: 'All lands called to joyful worship' },
    { from: 101, thru: 103, situation: 'A king’s vow of integrity; an afflicted cry that becomes hope; David blesses the Lord who forgives and crowns with mercy.', about: 'David', to: 'Leaders and all who need mercy remembered' },
    { from: 104, thru: 106, situation: 'Creation praise; retelling of God’s faithfulness and Israel’s failures; Book IV ends in “Hallelujah.”', about: 'Israel remembering — creation praise and the story of God’s faithfulness', to: 'A people remembering creation and covenant' },
    { from: 107, thru: 107, situation: 'Book V opens: the redeemed from trouble give thanks — desert, prison, sickness, and storm.', about: 'The redeemed of the Lord — giving thanks after desert, prison, sickness, and storm', to: 'The redeemed telling what God has done' },
    { from: 108, thru: 110, situation: 'David’s confidence in battle; curses on the wicked; the Lord says to my Lord, “Sit at my right hand.”', about: 'David', to: 'God’s people under the Messiah’s reign' },
    { from: 111, thru: 118, situation: 'Hallelujah psalms: fear of the Lord, the righteous lifted, idols mocked, and “His mercy endures forever.”', about: 'Israel’s Hallel — congregation praise that His mercy endures forever', to: 'All who praise the Lord' },
    { from: 119, thru: 119, situation: 'The great acrostic love-song to God’s Word — law, precepts, and path for life.', about: 'A worshiper in love with God’s Word — walking by law, precepts, and path', to: 'Anyone learning to walk by Scripture' },
    { from: 120, thru: 134, situation: 'Songs of Ascents: pilgrims going up to Jerusalem sing of help, peace, and blessing.', about: 'Pilgrim songs of ascent — Israel going up to Jerusalem', to: 'Travelers and worshipers going up to God’s house' },
    { from: 135, thru: 137, situation: 'Praise for the living God versus idols; by the rivers of Babylon, exiles weep for Zion.', about: 'Israel in exile and return — praise of the living God, and weeping by Babylon’s rivers', to: 'Exiles and all who refuse false gods' },
    { from: 138, thru: 145, situation: 'David’s personal thanksgiving, God’s searching knowledge, protection in battle, and a forever kingdom.', about: 'David', to: 'Anyone fully known and still loved by God' },
    { from: 146, thru: 150, situation: 'Final Hallelujah chorus: trust not in princes; everything that has breath praise the Lord.', about: 'Israel’s closing Hallelujah — everything that has breath, praise the Lord', to: 'All creation called to praise' }
  ],
  Proverbs: [
    { from: 1, thru: 9, situation: 'Solomon (and the wise) urge a son to choose wisdom over the path of fools.', about: 'Solomon giving wisdom', to: 'Everyone seeking guidance' },
    { from: 10, thru: 24, situation: 'Short proverbs for daily life: work, words, friends, and the fear of the Lord.', about: 'Solomon giving wisdom', to: 'Anyone learning a straight path' },
    { from: 25, thru: 29, situation: 'More of Solomon’s proverbs, copied later by Hezekiah’s men.', about: 'Solomon (copied for Judah)', to: 'Leaders and people needing wisdom' },
    { from: 30, thru: 31, situation: 'Words of Agur and Lemuel; a portrait of a capable, faithful woman.', about: 'Agur and Lemuel (and the wise)', to: 'Anyone seeking humility and a wise home' }
  ],
  Ecclesiastes: [
    { from: 1, thru: 6, situation: 'The Preacher tests pleasure, work, and wisdom “under the sun” and finds vanity without God.', about: 'Solomon (the Preacher)', to: 'Anyone asking what lasts under the sun' },
    { from: 7, thru: 12, situation: 'The Preacher pushes toward the fear of God as the end of the matter.', about: 'Solomon (the Preacher)', to: 'The weary and the searching' }
  ],
  'Song of Solomon': [
    { from: 1, thru: 8, situation: 'A celebration of covenant love between bride and bridegroom, sung in Israel’s poetry.', about: 'Solomon', to: 'Readers hearing covenant love sung aloud' }
  ],
  Isaiah: [
    { from: 1, thru: 12, situation: 'Isaiah confronts Judah’s sin and offers hope of a holy remnant and a coming king.', about: 'Isaiah', to: 'Judah — and all who need comfort and warning' },
    { from: 13, thru: 23, situation: 'Oracles against the nations around Judah.', about: 'Isaiah', to: 'Judah watching the nations under God' },
    { from: 24, thru: 35, situation: 'Judgment and joy; a highway of holiness; God defends Zion.', about: 'Isaiah', to: 'A people under threat who need God to reign' },
    { from: 36, thru: 39, situation: 'Assyria threatens Jerusalem in Hezekiah’s day; God delivers; then Babylon’s future rise is hinted.', about: 'Isaiah (with Hezekiah’s story)', to: 'Judah under Assyrian siege' },
    { from: 40, thru: 48, situation: 'Comfort for exiles: God is incomparable; idols are nothing; a servant will bring justice.', about: 'Isaiah (comfort from God)', to: 'Weary Judah — and anyone waiting on the Lord' },
    { from: 49, thru: 55, situation: 'The Servant suffers for sins; free pardon is offered; the word of God stands forever.', about: 'Isaiah', to: 'Israel — and all who look to the Suffering Servant' },
    { from: 56, thru: 66, situation: 'Promises of a new heavens and new earth; a call to true fasting and hope for the nations.', about: 'Isaiah', to: 'Exiles and returnees longing for full restoration' }
  ],
  Jeremiah: [
    { from: 1, thru: 10, situation: 'Jeremiah is called as a youth to warn Judah before Babylon comes.', about: 'Jeremiah', to: 'Judah and the exiles' },
    { from: 11, thru: 20, situation: 'Jeremiah faces plots, loneliness, and the cost of speaking God’s word.', about: 'Jeremiah', to: 'A prophet under pressure' },
    { from: 21, thru: 29, situation: 'Kings reject the word; false prophets promise peace; Jeremiah sends a letter to the first exiles.', about: 'Jeremiah (letter from the Lord)', to: 'Exiles in Babylon — and all waiting for hope' },
    { from: 30, thru: 33, situation: 'Promises of a new covenant written on the heart.', about: 'Jeremiah', to: 'Broken people promised restoration' },
    { from: 34, thru: 39, situation: 'Jerusalem falls; Jeremiah is preserved when the city burns.', about: 'Jeremiah (through the narrator)', to: 'Judah at the fall' },
    { from: 40, thru: 45, situation: 'After the fall, remnant leaders drag Jeremiah to Egypt against God’s word.', about: 'Jeremiah', to: 'The remnant still running from God' },
    { from: 46, thru: 52, situation: 'Oracles against the nations; Jerusalem’s fall is retold.', about: 'Jeremiah', to: 'Nations and Judah under judgment' }
  ],
  Lamentations: [
    { from: 1, thru: 5, situation: 'Jerusalem has fallen; the poet weeps, yet hopes in mercies new every morning.', about: 'Jeremiah', to: 'Exiles mourning Jerusalem' }
  ],
  Ezekiel: [
    { from: 1, thru: 3, situation: 'By the river Chebar in exile, Ezekiel sees God’s glory and is called as a watchman.', about: 'Ezekiel', to: 'Exiles by the river Chebar' },
    { from: 4, thru: 24, situation: 'Sign-acts and oracles announce Jerusalem’s siege and the reason for judgment.', about: 'Ezekiel', to: 'Exiles who still hoped the city would stand' },
    { from: 25, thru: 32, situation: 'Ezekiel speaks oracles against surrounding nations — Ammon, Moab, Edom, Philistia, Tyre, and Egypt — while Judah sits in exile.', about: 'Ezekiel', to: 'Exiles watching the nations' },
    { from: 33, thru: 39, situation: 'After Jerusalem falls, God promises a new heart, a shepherd, and dry bones raised.', about: 'Ezekiel', to: 'Exiles needing hope after the city fell' },
    { from: 40, thru: 48, situation: 'A vision of a restored temple and the Lord’s glory returning.', about: 'Ezekiel', to: 'Exiles longing for God’s presence again' }
  ],
  Daniel: [
    { from: 1, thru: 1, situation: 'Daniel and friends are taken to Babylon and refuse the king’s food.', about: 'Daniel (and the narrator)', to: 'Exiles learning faithfulness under pressure' },
    { from: 2, thru: 2, situation: 'Daniel interprets Nebuchadnezzar’s dream of kingdoms; God alone reveals secrets.', about: 'Daniel', to: 'A pagan court — and all who need wisdom from God' },
    { from: 3, thru: 3, situation: 'Three friends refuse to bow to the image and are thrown into the fiery furnace.', about: 'The narrator of Daniel', to: 'Exiles under pressure — and all who refuse to bow' },
    { from: 4, thru: 5, situation: 'Nebuchadnezzar is humbled; Belshazzar sees the writing on the wall as Babylon falls.', about: 'Daniel', to: 'Proud kings — and those watching empires change' },
    { from: 6, thru: 6, situation: 'Daniel is cast into the lions’ den for praying; God shuts the lions’ mouths.', about: 'The narrator of Daniel', to: 'Faithful servants under threat' },
    { from: 7, thru: 12, situation: 'Visions of beasts, weeks, and the Son of man; hope beyond earthly kingdoms.', about: 'Daniel', to: 'Exiles needing a future beyond empires' }
  ],
  Hosea: [
    { from: 1, thru: 3, situation: 'Hosea’s marriage to Gomer becomes a living picture of Israel’s unfaithfulness and God’s pursuing love.', about: 'Hosea', to: 'Israel called back to faithful love' },
    { from: 4, thru: 14, situation: 'Charges against Israel’s idolatry; a final plea to return to the Lord.', about: 'Hosea', to: 'The northern kingdom near collapse' }
  ],
  Joel: [
    { from: 1, thru: 3, situation: 'A locust plague and drought become a call to repent before the day of the Lord.', about: 'Joel', to: 'Judah facing the day of the Lord' }
  ],
  Amos: [
    { from: 1, thru: 9, situation: 'A shepherd from Tekoa denounces Israel’s injustice and empty worship.', about: 'Amos', to: 'Israel under God’s justice' }
  ],
  Obadiah: [
    { from: 1, thru: 1, situation: 'Edom is judged for gloating over Jerusalem’s fall.', about: 'Obadiah', to: 'Edom — and all who exalt themselves' }
  ],
  Jonah: [
    { from: 1, thru: 2, situation: 'Jonah runs from God’s call to Nineveh; a storm and a great fish stop him.', about: 'The narrator of Jonah (and the Lord)', to: 'Jonah — and anyone running from mercy' },
    { from: 3, thru: 4, situation: 'Nineveh repents; Jonah resents God’s compassion.', about: 'Jonah and the Lord', to: 'A prophet angry at mercy — and all who need a bigger heart' }
  ],
  Micah: [
    { from: 1, thru: 7, situation: 'Micah warns Samaria and Jerusalem; he asks what the Lord requires: justice, mercy, humility.', about: 'Micah', to: 'Judah hearing what the Lord requires' }
  ],
  Nahum: [
    { from: 1, thru: 3, situation: 'Nineveh’s cruelty will be answered; the Lord is slow to anger and great in power.', about: 'Nahum', to: 'Nineveh under judgment' }
  ],
  Habakkuk: [
    { from: 1, thru: 3, situation: 'Habakkuk complains about violence; God will use Babylon; the righteous live by faith.', about: 'Habakkuk', to: 'Judah waiting for God’s answer' }
  ],
  Zephaniah: [
    { from: 1, thru: 3, situation: 'The day of the Lord is near; a humble remnant will trust the Lord and rejoice.', about: 'Zephaniah', to: 'Judah in the day of the Lord' }
  ],
  Haggai: [
    { from: 1, thru: 2, situation: 'Returned exiles have paneled houses but a ruined temple; God stirs them to rebuild.', about: 'Haggai', to: 'Returned exiles rebuilding the house' }
  ],
  Zechariah: [
    { from: 1, thru: 8, situation: 'Night visions encourage the temple builders; Joshua the high priest is cleansed.', about: 'Zechariah', to: 'Returned exiles needing hope' },
    { from: 9, thru: 14, situation: 'A humble king comes on a donkey; a fountain opens for sin; the Lord will be king over all the earth.', about: 'Zechariah', to: 'A people waiting for Messiah and full cleansing' }
  ],
  Malachi: [
    { from: 1, thru: 4, situation: 'After the return, priests and people grow careless; God calls them to return and promises a messenger.', about: 'Malachi', to: 'Israel called to return to the Lord' }
  ],
  Matthew: [
    { from: 1, thru: 2, situation: 'Jesus’ birth and early years; wise men worship; Joseph flees to Egypt.', about: 'Jesus (through Matthew)', to: 'His disciples and the crowds (and you today)' },
    { from: 3, thru: 4, situation: 'John baptizes; Jesus is baptized and tempted in the wilderness; He begins preaching in Galilee.', about: 'Jesus (through Matthew)', to: 'Israel hearing the kingdom draw near' },
    { from: 5, thru: 7, situation: 'Jesus teaches the Sermon on the Mount: heart righteousness, prayer, and the narrow way.', about: 'Jesus', to: 'His disciples on the mount (and you today)' },
    { from: 8, thru: 10, situation: 'Miracles of healing and authority; the Twelve are sent out.', about: 'Jesus (through Matthew)', to: 'Crowds and disciples seeing the kingdom’s power' },
    { from: 11, thru: 12, situation: 'Jesus invites the weary to rest; conflict with Pharisees grows.', about: 'Jesus', to: 'The weary and heavy laden (and you today)' },
    { from: 13, thru: 13, situation: 'By the sea, Jesus teaches parables of the kingdom — sower, weeds, mustard seed, treasure — so crowds and disciples learn how the kingdom grows.', about: 'Jesus (through Matthew)', to: 'Crowds and disciples learning how the kingdom grows' },
    { from: 14, thru: 17, situation: 'John is killed; Jesus feeds multitudes, walks on water, and predicts the cross; Peter confesses Him as Christ.', about: 'Jesus (through Matthew)', to: 'Disciples learning who He is' },
    { from: 18, thru: 18, situation: 'Jesus teaches about little ones, humility, seeking the lost sheep, and forgiving brothers seventy times seven.', about: 'Jesus', to: 'His disciples — and all who guard the vulnerable and practice forgiveness' },
    { from: 19, thru: 20, situation: 'Teaching on marriage, riches, and greatness; Jesus sets His face toward Jerusalem.', about: 'Jesus (through Matthew)', to: 'Disciples on the road to the cross' },
    { from: 21, thru: 23, situation: 'Triumphal entry; cleansing the temple; debates with leaders in Jerusalem.', about: 'Jesus (through Matthew)', to: 'Jerusalem in Passion Week' },
    { from: 24, thru: 25, situation: 'Jesus speaks of the end and the call to watchful faithfulness.', about: 'Jesus (through Matthew)', to: 'Disciples needing endurance' },
    { from: 26, thru: 28, situation: 'Last Supper, Gethsemane, trial, cross, and resurrection.', about: 'Jesus (through Matthew)', to: 'Disciples — and all who need a risen Savior' }
  ],
  Mark: [
    { from: 1, thru: 3, situation: 'Jesus’ ministry begins with power: preaching, healing, and conflict in Galilee.', about: 'Jesus (through Mark)', to: 'His disciples and those listening (and you today)' },
    { from: 4, thru: 5, situation: 'Parables by the sea; a storm stilled; a demoniac, a bleeding woman, and Jairus’s daughter.', about: 'Jesus (through Mark)', to: 'Disciples in the storm (and you today)' },
    { from: 6, thru: 8, situation: 'Rejection at Nazareth; feeding multitudes; the disciples still slow to understand.', about: 'Jesus (through Mark)', to: 'Crowds and half-seeing disciples' },
    { from: 9, thru: 10, situation: 'Transfiguration; teaching on greatness and the cross; Jesus heads toward Jerusalem.', about: 'Jesus (through Mark)', to: 'Disciples learning the way of the cross' },
    { from: 11, thru: 13, situation: 'Entry into Jerusalem; temple cleansing; Olivet discourse.', about: 'Jesus (through Mark)', to: 'Jerusalem in the final week' },
    { from: 14, thru: 16, situation: 'Betrayal, trial, crucifixion, empty tomb.', about: 'Jesus (through Mark)', to: 'Disciples — and all who need the risen Christ' }
  ],
  Luke: [
    { from: 1, thru: 2, situation: 'Births of John and Jesus; shepherds hear good news; the child grows in favor with God and man.', about: 'Jesus (through Luke)', to: 'His disciples and those listening (and you today)' },
    { from: 3, thru: 4, situation: 'John’s preaching; Jesus’ baptism, genealogy, temptation, and rejection at Nazareth.', about: 'Jesus (through Luke)', to: 'Israel hearing the kingdom announced' },
    { from: 5, thru: 9, situation: 'Calling disciples; healings; the Twelve sent; the Transfiguration; the turn toward Jerusalem.', about: 'Jesus (through Luke)', to: 'Disciples learning to follow' },
    { from: 10, thru: 19, situation: 'On the road to Jerusalem: Good Samaritan, Lord’s Prayer, lost sheep/coin/son, rich fool, Zacchaeus.', about: 'Jesus (through Luke)', to: 'Sinners and seekers (and you today)' },
    { from: 20, thru: 21, situation: 'Teaching in the temple; widow’s mites; signs of the end.', about: 'Jesus (through Luke)', to: 'Jerusalem’s final days of teaching' },
    { from: 22, thru: 24, situation: 'Last Supper, arrest, cross, Emmaus road, and resurrection appearances.', about: 'Jesus (through Luke)', to: 'Disciples — and all who need opened Scriptures and a risen Lord' }
  ],
  John: [
    { from: 1, thru: 2, situation: 'The Word becomes flesh; first disciples follow; water becomes wine at Cana.', about: 'Jesus (through John)', to: 'His disciples and those listening (and you today)' },
    { from: 3, thru: 4, situation: 'Jesus teaches Nicodemus about new birth; speaks with a Samaritan woman at the well.', about: 'Jesus', to: 'Nicodemus — and anyone needing new birth' },
    { from: 5, thru: 6, situation: 'Healing at Bethesda; feeding the five thousand; Bread of Life discourse.', about: 'Jesus (through John)', to: 'Crowds seeking signs — and disciples needing real food' },
    { from: 7, thru: 10, situation: 'Conflict at feasts in Jerusalem; the man born blind; the Good Shepherd.', about: 'Jesus (through John)', to: 'Jerusalem under debate about who Jesus is' },
    { from: 11, thru: 12, situation: 'Lazarus is raised; Mary anoints Jesus; the triumphal entry approaches the cross.', about: 'Jesus (through John)', to: 'Friends of Jesus facing death and glory' },
    { from: 13, thru: 17, situation: 'Upper room: footwashing, comfort, true vine, and high priestly prayer the night before the cross.', about: 'Jesus', to: 'His disciples the night before the cross' },
    { from: 18, thru: 19, situation: 'Arrest, trials, crucifixion; “It is finished.”', about: 'Jesus (through John)', to: 'All who need the finished work of the cross' },
    { from: 20, thru: 21, situation: 'Empty tomb; Thomas believes; Peter is restored by the sea.', about: 'Jesus (through John)', to: 'Disciples — and all who need a risen, restoring Lord' }
  ],
  Acts: [
    { from: 1, thru: 2, situation: 'Jesus ascends; the Spirit falls at Pentecost; the church is born in Jerusalem.', about: 'Luke (with Peter’s preaching)', to: 'Jerusalem at Pentecost — and the church ever since' },
    { from: 3, thru: 7, situation: 'Healings and bold preaching; Stephen is martyred; persecution scatters believers.', about: 'Luke', to: 'The early church under pressure' },
    { from: 8, thru: 12, situation: 'The gospel reaches Samaria and Gentiles; Saul is converted; Peter is freed from prison.', about: 'Luke', to: 'The church learning the gospel is for all nations' },
    { from: 13, thru: 15, situation: 'Paul’s first missionary journey; the Jerusalem council settles Gentile faith.', about: 'Luke (with Paul and Barnabas)', to: 'Churches learning grace for the nations' },
    { from: 16, thru: 20, situation: 'Paul’s journeys through Macedonia and Greece; many churches planted amid riot and joy.', about: 'Luke (with Paul)', to: 'The expanding Gentile mission' },
    { from: 21, thru: 28, situation: 'Paul is arrested in Jerusalem and taken to Rome under guard, still preaching Christ.', about: 'Luke (with Paul)', to: 'Paul on trial — and all who witness under chains' }
  ],
  Romans: [
    { from: 1, thru: 3, situation: 'Paul writes to Rome: all have sinned; justification is by faith like Abraham’s.', about: 'Paul', to: 'Believers in Rome (and you today)' },
    { from: 4, thru: 5, situation: 'Abraham believed God; peace with God comes through Christ, not law-keeping.', about: 'Paul', to: 'Believers justified by faith (and you today)' },
    { from: 6, thru: 8, situation: 'Dead to sin, alive to God; struggle and Spirit; no condemnation for those in Christ.', about: 'Paul', to: 'Believers in the Spirit (and you today)' },
    { from: 9, thru: 11, situation: 'Paul wrestles with Israel’s unbelief and God’s mercy to Jew and Gentile.', about: 'Paul', to: 'Roman believers needing a big view of God’s plan' },
    { from: 12, thru: 16, situation: 'Living sacrifices: renewed minds, love, and unity in the Roman house churches.', about: 'Paul', to: 'Believers offering their lives (and you today)' }
  ],
  '1 Corinthians': [
    { from: 1, thru: 4, situation: 'Paul writes a gifted but divided church in Corinth about the cross and true wisdom.', about: 'Paul', to: 'the church at Corinth (and you today)' },
    { from: 5, thru: 7, situation: 'Moral failures, lawsuits, and marriage questions in a pagan city.', about: 'Paul', to: 'Corinth learning holiness in a corrupt culture' },
    { from: 8, thru: 10, situation: 'Meat offered to idols; rights laid down for the weak; Israel’s wilderness as a warning; God is faithful in temptation.', about: 'Paul', to: 'the church at Corinth facing temptation (and you today)' },
    { from: 11, thru: 14, situation: 'The Lord’s Supper and spiritual gifts; love is the more excellent way; orderly worship.', about: 'Paul', to: 'A gifted but unloving church (and you today)' },
    { from: 15, thru: 16, situation: 'The resurrection of Christ and of the dead; final instructions and greetings.', about: 'Paul', to: 'Corinth needing certainty that Christ is risen' }
  ],
  '2 Corinthians': [
    { from: 1, thru: 7, situation: 'Paul defends a tearful ministry of comfort and reconciliation after conflict with Corinth.', about: 'Paul', to: 'the church at Corinth (and you today)' },
    { from: 8, thru: 9, situation: 'Paul urges generous giving for the poor saints.', about: 'Paul', to: 'Corinth learning cheerful generosity' },
    { from: 10, thru: 13, situation: 'Paul boasts in weakness; a thorn in the flesh; strength made perfect in weakness.', about: 'Paul', to: 'Weak believers who need grace (and you today)' }
  ],
  Galatians: [
    { from: 1, thru: 2, situation: 'Paul confronts churches turning to another gospel of law-keeping for status with God.', about: 'Paul', to: 'the churches of Galatia (and you today)' },
    { from: 3, thru: 4, situation: 'Abraham believed; the law was a tutor; sons and heirs through Christ.', about: 'Paul', to: 'Galatians tempted to finish by flesh what began by Spirit' },
    { from: 5, thru: 6, situation: 'Freedom in the Spirit; fruit of the Spirit; bearing one another’s burdens.', about: 'Paul', to: 'Churches learning freedom in the Spirit (and you today)' }
  ],
  Ephesians: [
    { from: 1, thru: 3, situation: 'Paul (likely from prison) unfolds every spiritual blessing in Christ and one new humanity of Jew and Gentile.', about: 'Paul', to: 'believers in Ephesus (and you today)' },
    { from: 4, thru: 6, situation: 'Walk worthy: unity, purity, marriage, and the armor of God against spiritual war.', about: 'Paul', to: 'Believers in spiritual battle (and you today)' }
  ],
  Philippians: [
    { from: 1, thru: 2, situation: 'Paul writes from prison with joy; Christ is preached; the mind of Christ is humility.', about: 'Paul', to: 'the church at Philippi (and you today)' },
    { from: 3, thru: 3, situation: 'Paul counts status as loss for Christ; he presses toward the prize.', about: 'Paul', to: 'Philippi learning true righteousness' },
    { from: 4, thru: 4, situation: 'Rejoice; do not be anxious; the peace of God guards hearts; contentment in every state through Christ.', about: 'Paul', to: 'the church at Philippi (and you today)' }
  ],
  Colossians: [
    { from: 1, thru: 2, situation: 'Paul exalts Christ’s supremacy against hollow philosophy in Colosse.', about: 'Paul', to: 'believers in Colosse (and you today)' },
    { from: 3, thru: 4, situation: 'Set minds above; put on love; household codes; prayer and gracious speech.', about: 'Paul', to: 'Believers setting minds above (and you today)' }
  ],
  '1 Thessalonians': [
    { from: 1, thru: 3, situation: 'Paul thanks God for a young church under persecution and urges holy living.', about: 'Paul', to: 'believers in Thessalonica (and you today)' },
    { from: 4, thru: 5, situation: 'Comfort about those who sleep in Christ; the day of the Lord; encourage one another.', about: 'Paul', to: 'Thessalonians grieving with hope' }
  ],
  '2 Thessalonians': [
    { from: 1, thru: 3, situation: 'Paul steadies a shaken church about the day of the Lord and idle living.', about: 'Paul', to: 'believers in Thessalonica (and you today)' }
  ],
  '1 Timothy': [
    { from: 1, thru: 6, situation: 'Paul coaches Timothy on doctrine, prayer, leaders, and godliness in Ephesus.', about: 'Paul', to: 'Timothy (and every young believer)' }
  ],
  '2 Timothy': [
    { from: 1, thru: 4, situation: 'Paul’s last letter from prison: fan the gift; endure hardship; preach the word.', about: 'Paul', to: 'Timothy (and every timid heart)' }
  ],
  Titus: [
    { from: 1, thru: 3, situation: 'Paul instructs Titus to appoint elders and teach sound living on Crete.', about: 'Paul', to: 'Titus (and church leaders)' }
  ],
  Philemon: [
    { from: 1, thru: 1, situation: 'Paul appeals for Onesimus, a runaway slave now a brother in Christ.', about: 'Paul', to: 'Philemon (and the church in his house)' }
  ],
  Hebrews: [
    { from: 1, thru: 4, situation: 'A sermon-letter to pressured Hebrew believers: Jesus is better than angels, Moses, and the old priesthood.', about: 'The writer of Hebrews', to: 'Hebrew believers holding fast to Christ' },
    { from: 5, thru: 10, situation: 'Jesus the high priest after Melchizedek; a better covenant; draw near with boldness.', about: 'The writer of Hebrews', to: 'Believers tempted to shrink back' },
    { from: 11, thru: 13, situation: 'Hall of faith; run with patience; practical holiness and praise.', about: 'The writer of Hebrews', to: 'Hebrew believers holding faith' }
  ],
  James: [
    { from: 1, thru: 5, situation: 'James writes scattered believers under trial about real faith that works in speech, mercy, and patience.', about: 'James', to: 'scattered believers under trial' }
  ],
  '1 Peter': [
    { from: 1, thru: 2, situation: 'Peter encourages elect exiles: living hope, holy living, and Christ the cornerstone.', about: 'Peter', to: 'believers in suffering and hope' },
    { from: 3, thru: 5, situation: 'Household life, suffering for righteousness, casting care on God, resisting the devil.', about: 'Peter', to: 'Believers casting care on God' }
  ],
  '2 Peter': [
    { from: 1, thru: 3, situation: 'Peter warns against false teachers and points to the Lord’s coming and sure word.', about: 'Peter', to: 'believers growing in grace and knowledge' }
  ],
  '1 John': [
    { from: 1, thru: 2, situation: 'John writes about fellowship, light, and assurance against early antichrist lies.', about: 'John', to: 'beloved children walking in the light' },
    /* 3 is sons-of-God / love-in-deed — not 4:1 “test the spirits” or 5:4 “victory.” */
    { from: 3, thru: 3, situation: 'John marvels that the Father calls us children of God, and says real love must show in deed and truth—not in word only.', about: 'John', to: 'Beloved children learning they are God’s sons' },
    /* 4:1–6 tests spirits; 4:7–21 is love-of-God. Default the chapter to the love half (most calendar days). */
    { from: 4, thru: 4, situation: 'John urges the church to love one another because love is of God: whoever loves is born of God and knows God, and God is love.', about: 'John', to: 'Beloved children learning God’s love' },
    { from: 5, thru: 5, situation: 'John writes that faith in the Son is the victory that overcomes the world, and that God has given eternal life in His Son.', about: 'John', to: 'Believers holding the record that life is in the Son' }
  ],
  '2 John': [
    { from: 1, thru: 1, situation: 'John urges a church to walk in truth and refuse false teachers.', about: 'John', to: 'the elect lady and her children' }
  ],
  '3 John': [
    { from: 1, thru: 1, situation: 'John commends Gaius for hospitality and confronts Diotrephes’ pride.', about: 'John', to: 'Gaius' }
  ],
  Jude: [
    { from: 1, thru: 1, situation: 'Jude urges believers to contend for the faith against ungodly infiltrators.', about: 'Jude', to: 'believers called to contend for the faith' }
  ],
  Revelation: [
    { from: 1, thru: 3, situation: 'John on Patmos sees the risen Christ; letters to seven churches in Asia.', about: 'John (from Jesus Christ)', to: 'the seven churches — and every reader' },
    { from: 4, thru: 11, situation: 'Throne room worship; seals and trumpets unfold judgment and mercy.', about: 'John (from God)', to: 'The church needing endurance under pressure' },
    { from: 12, thru: 18, situation: 'Dragon, beasts, and Babylon; the Lamb’s people endure.', about: 'John (from God)', to: 'Saints in a hostile world' },
    { from: 19, thru: 22, situation: 'Christ returns; new heaven and new earth; the river of life; “Even so, come, Lord Jesus.”', about: 'John (from God)', to: 'The church hoping for the new creation' }
  ]
};

export function situationForChapter(book, chapter) {
  const b = book === 'Psalms' ? 'Psalm' : book;
  const bands = BOOK_CHAPTER_SITUATIONS[b];
  if (!bands) {
    return {
      situation: 'God’s Word is spoken into real history for real people — and it still speaks.',
      about: '',
      to: ''
    };
  }
  const ch = Number(chapter) || 1;
  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    if (ch >= band.from && ch <= band.thru) {
      return {
        situation: band.situation,
        about: band.about || '',
        to: band.to || ''
      };
    }
  }
  const last = bands[bands.length - 1];
  return {
    situation: last.situation,
    about: last.about || '',
    to: last.to || ''
  };
}

/**
 * Compose a one-line “what was going on” that always includes situation.
 */
export function composeSituationLine(situation, about, to) {
  const sit = String(situation || '').replace(/\s+/g, ' ').trim();
  const a = String(about || '').replace(/\s+/g, ' ').trim();
  const t = String(to || '').replace(/\s+/g, ' ').trim();
  if (sit && a && t) {
    return sit.replace(/\.$/, '') + ' — spoken by ' + a + ' to ' + t + '.';
  }
  if (sit) return /[.!?]$/.test(sit) ? sit : sit + '.';
  if (a && t) return a + ' speaking to ' + t + '.';
  return 'God’s Word spoken into a real moment — still true for you.';
}

/**
 * Combine situation + plain meaning for teaching (user request: both together).
 */
export function composeContextAndMeaning(situationLine, plain) {
  const sit = String(situationLine || '').replace(/\s+/g, ' ').trim();
  const p = String(plain || '').replace(/\s+/g, ' ').trim();
  if (sit && p) {
    const sitClean = sit.replace(/\.$/, '');
    // Avoid doubling if plain already starts with situation-ish words
    if (p.toLowerCase().indexOf(sitClean.slice(0, 24).toLowerCase()) === 0) return p;
    return 'What was going on: ' + sitClean + '. What it means: ' + p.replace(/^What it means:\s*/i, '');
  }
  if (p) return p;
  if (sit) return sit;
  return '';
}
