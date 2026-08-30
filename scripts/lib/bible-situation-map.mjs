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
    { from: 31, thru: 31, situation: 'Moses commissions Joshua: be strong and of a good courage; the Lord goes with you and will not fail you.', about: 'Moses', to: 'Joshua — and Israel at the death of their leader' },
    { from: 32, thru: 34, situation: 'Moses sings, blesses the tribes, and dies on Mount Nebo.', about: 'Moses (and the narrator)', to: 'Israel at the death of their leader' }
  ],
  Joshua: [
    { from: 1, thru: 5, situation: 'Joshua takes command; Israel crosses the Jordan and prepares for the land.', about: 'The Lord to Joshua (and the narrator)', to: 'Joshua — and anyone stepping into a hard new season' },
    { from: 6, thru: 6, situation: 'Jericho falls as Israel marches around the city in obedience.', about: 'The narrator of Joshua', to: 'Israel taking the land God promised' },
    { from: 7, thru: 12, situation: 'Israel conquers key cities in Canaan; sin at Ai is judged; southern and northern kings fall.', about: 'The narrator of Joshua', to: 'Israel taking the land God promised' },
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
    { from: 16, thru: 16, situation: 'Samuel is sent to anoint a king among Jesse’s sons; the Lord refuses Eliab’s looks and looks on the heart.', about: 'Samuel and the Lord (with Jesse’s sons)', to: 'Samuel — and all who judge by appearance' },
    { from: 17, thru: 17, situation: 'David faces Goliath while Saul’s army freezes in fear.', about: 'The narrator of Samuel (with David and Goliath)', to: 'Israel facing a giant — and anyone facing what feels too big' },
    { from: 18, thru: 20, situation: 'Saul envies David; Jonathan covenants with David; David flees for his life.', about: 'David, Jonathan, and Saul (through the narrator)', to: 'The hunted and the loyal friend' },
    { from: 21, thru: 27, situation: 'David lives as a fugitive; Saul pursues him; David spares Saul’s life more than once.', about: 'David and Saul (through the narrator)', to: 'Anyone running while still choosing mercy' },
    { from: 28, thru: 31, situation: 'Saul consults a medium; Philistines press hard; Saul and Jonathan die in battle.', about: 'The narrator of Samuel', to: 'Israel at the end of Saul’s reign' }
  ],
  '2 Samuel': [
    { from: 1, thru: 5, situation: 'David mourns Saul; he is crowned in Hebron, then over all Israel; the ark comes to Jerusalem.', about: 'David (through the narrator of Samuel)', to: 'Israel under a new king' },
    { from: 6, thru: 10, situation: 'David brings the ark with joy and fear; God covenants an everlasting house with David; wars expand the kingdom.', about: 'David and the Lord (through the narrator)', to: 'David’s court — and all who long for a lasting kingdom' },
    { from: 11, thru: 12, situation: 'David commits adultery with Bathsheba and arranges Uriah’s death; Nathan confronts him.', about: 'David, Bathsheba, Uriah, and Nathan', to: 'A fallen king — and all who need to repent' },
    { from: 13, thru: 18, situation: 'Absalom’s violence and rebellion tear David’s house; David flees, then grieves his son’s death.', about: 'David and Absalom (through the narrator)', to: 'A broken royal family' },
    { from: 19, thru: 21, situation: 'David returns to rule after Absalom; further trouble and a famine test the kingdom.', about: 'David (through the narrator)', to: 'Israel after civil war' },
    { from: 22, thru: 22, situation: 'David sings a song of deliverance: God is his rock, fortress, and shield after the Lord saved him from all his enemies.', about: 'David', to: 'Anyone delivered after a long fight' },
    { from: 23, thru: 24, situation: 'David’s last words and mighty men; a census brings plague; he buys a threshing floor for an altar.', about: 'David (through the narrator)', to: 'Israel at the close of David’s wars' }
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
    { from: 9, thru: 9, situation: 'David thanks God who judges righteously and is a refuge for the oppressed.', about: 'David', to: 'The oppressed who need a just judge' },
    { from: 10, thru: 10, situation: 'The psalmist asks why the Lord stands afar off while the wicked hunt the poor, then trusts that God hears the desire of the humble.', about: 'David', to: 'The poor and the hunted who still pray' },
    { from: 11, thru: 11, situation: 'David takes refuge in the Lord when the foundations seem destroyed and the wicked aim at the upright.', about: 'David', to: 'Anyone tempted to flee when the ground feels gone' },
    { from: 12, thru: 12, situation: 'David cries that the godly man ceases; the Lord will keep the poor from lying lips.', about: 'David', to: 'Anyone surrounded by empty, proud speech' },
    { from: 13, thru: 13, situation: 'David asks how long the Lord will forget him, then trusts in His mercy and sings.', about: 'David', to: 'Anyone waiting through a long silence' },
    { from: 14, thru: 14, situation: 'The fool says in his heart there is no God; the Lord looks down and seeks the one who understands.', about: 'David', to: 'Those tempted to forget God — and all who seek Him' },
    { from: 15, thru: 15, situation: 'David asks who may abide in God’s tabernacle: the one who walks uprightly and speaks truth in the heart.', about: 'David', to: 'Anyone asking who may dwell with God' },
    { from: 16, thru: 16, situation: 'David trusts God with his portion and his cup; God will show the path of life and fullness of joy.', about: 'David', to: 'Anyone who needs a path of life' },
    { from: 17, thru: 17, situation: 'David pleads to be kept as the apple of God’s eye, hidden under the shadow of His wings from the violent.', about: 'David', to: 'Anyone needing protection from the violent' },
    { from: 18, thru: 18, situation: 'David’s great victory song after the Lord delivered him from Saul and all enemies.', about: 'David', to: 'Anyone delivered after a long fight' },
    { from: 19, thru: 19, situation: 'Creation declares God’s glory; His law revives the soul; David prays to be kept from secret faults.', about: 'David', to: 'Anyone hearing God in sky and Scripture' },
    { from: 20, thru: 20, situation: 'A royal prayer: the Lord hear the king in the day of trouble and remember all his offerings.', about: 'David', to: 'God’s people praying for their leader' },
    { from: 21, thru: 21, situation: 'Thanksgiving after the king’s victory: the king joys in God’s strength, not his own.', about: 'David', to: 'God’s people giving thanks for their leader' },
    { from: 22, thru: 22, situation: 'A sufferer’s cry of forsakenness that turns to praise — later fulfilled at the cross.', about: 'David', to: 'The suffering righteous (and all who look to Christ)' },
    { from: 23, thru: 23, situation: 'David sings of the Lord as his own shepherd: green pastures, still waters, a table, and a house forever.', about: 'David', to: 'Anyone who needs a Shepherd' },
    { from: 24, thru: 24, situation: 'The earth is the Lord’s; the King of glory comes in through the lifted gates.', about: 'David', to: 'Worshipers welcoming the King of glory' },
    { from: 25, thru: 25, situation: 'David lifts his soul to God and asks to be shown His ways, remembered in mercy, not in sin.', about: 'David', to: 'Anyone needing guidance and pardon' },
    { from: 26, thru: 26, situation: 'David asks to be judged in integrity: he will not sit with the wicked, and he will walk in his uprightness.', about: 'David', to: 'Anyone clinging to integrity under accusation' },
    { from: 27, thru: 27, situation: 'David seeks the Lord’s face under pressure: the Lord is his light and salvation; he will wait and be of good courage.', about: 'David', to: 'Anyone fighting fear with faith' },
    { from: 28, thru: 28, situation: 'David cries to the Lord his rock; his heart trusts, and he is helped — the Lord is his strength and shield.', about: 'David', to: 'Anyone who needs a rock that answers' },
    { from: 29, thru: 29, situation: 'The voice of the Lord over the waters: glory and strength; the Lord sits King at the flood.', about: 'David', to: 'Worshipers hearing God’s power in the storm' },
    { from: 30, thru: 30, situation: 'David thanks God for lifting him from the pit: weeping may endure for a night, but joy comes in the morning.', about: 'David', to: 'Anyone lifted after a dark night' },
    { from: 31, thru: 31, situation: 'David, hunted and pressed, commits his spirit into God’s hand; the Lord is his fortress.', about: 'David', to: 'Anyone under pressure who still trusts God' },
    { from: 32, thru: 32, situation: 'David teaches after forgiveness: blessed is the one whose transgression is forgiven; he instructs the upright.', about: 'David', to: 'The forgiven — and anyone who needs to confess' },
    { from: 33, thru: 33, situation: 'A new song of praise: Rejoice in the Lord, O ye righteous; praise is comely for the upright, for His word is right.', about: 'Israel’s congregation — a psalm of praise (untitled in the KJV)', to: 'The righteous called to rejoice — and you when praise is due' },
    { from: 34, thru: 34, situation: 'David, after escaping Abimelech, teaches: the Lord is near to the brokenhearted and saves those of a contrite spirit; taste and see that the Lord is good.', about: 'David', to: 'The brokenhearted — and anyone tasting that the Lord is good' },
    { from: 35, thru: 35, situation: 'David prays against unjust attackers: plead my cause, O Lord, with them that strive with me.', about: 'David', to: 'Anyone under unfair attack who still prays' },
    { from: 36, thru: 36, situation: 'David contrasts the wicked with God’s mercy: how excellent is His lovingkindness; in His light we see light.', about: 'David', to: 'Anyone who needs mercy bigger than the wicked' },
    { from: 37, thru: 37, situation: 'David teaches people not to fret when the wicked prosper: delight in the Lord; commit your way to Him.', about: 'David', to: 'Anyone watching the wicked prosper for a season' },
    { from: 38, thru: 38, situation: 'David is sick and sin-aware: he does not hide his iniquity, and he waits for the Lord to hear.', about: 'David', to: 'The sick and the guilty who still pray' },
    { from: 39, thru: 39, situation: 'David measures his days: man at his best state is vanity; his hope is in the Lord.', about: 'David', to: 'Anyone feeling how short life is' },
    { from: 40, thru: 40, situation: 'David waited patiently in the pit; the Lord brought him up and put a new song in his mouth.', about: 'David', to: 'Anyone who has waited a long time to be heard' },
    { from: 41, thru: 41, situation: 'Book I closes: blessed is he that considereth the poor; even a familiar friend has lifted the heel.', about: 'David', to: 'The sick, the betrayed, and those who still show mercy' },
    { from: 42, thru: 43, situation: 'Sons of Korah: a downcast soul thirsts for God and talks itself back toward hope.', about: 'The sons of Korah', to: 'Anyone whose soul is cast down' },
    { from: 44, thru: 44, situation: 'National lament after defeat: we have heard of God’s help in our fathers’ days, yet now we are cast off.', about: 'The sons of Korah', to: 'A people who cannot make the defeat make sense' },
    { from: 45, thru: 45, situation: 'A royal wedding song for the king: grace is poured upon his lips; the queen stands in gold of Ophir.', about: 'The sons of Korah', to: 'Worshipers celebrating the king’s marriage' },
    { from: 46, thru: 46, situation: 'When the earth shakes and nations rage, this psalm declares God is a present refuge and strength — “be still, and know that I am God.”', about: 'The sons of Korah', to: 'Anyone in trouble who needs a refuge' },
    { from: 47, thru: 47, situation: 'God is gone up with a shout: He is King over the nations; clap your hands, all ye people.', about: 'The sons of Korah', to: 'Worshipers glad that God is King' },
    { from: 48, thru: 48, situation: 'Great is the Lord in the city of our God: Zion’s beauty, and a God who will be our guide even unto death.', about: 'The sons of Korah', to: 'Worshipers looking at Zion and needing a guide' },
    { from: 49, thru: 49, situation: 'A wisdom psalm: they that trust in their wealth cannot redeem a brother; man that is in honour abides not.', about: 'The sons of Korah', to: 'Anyone tempted to trust riches' },
    { from: 50, thru: 50, situation: 'Asaph: the mighty God summons His people — He wants thanksgiving and a kept word, not empty sacrifice.', about: 'Asaph', to: 'God’s people called to true worship' },
    { from: 51, thru: 51, situation: 'David confesses after Nathan confronts him about Bathsheba: have mercy; create in me a clean heart.', about: 'David', to: 'Any heart needing mercy after failure' },
    { from: 52, thru: 52, situation: 'David answers Doeg’s betrayal: the wicked boast, but those who trust in God’s mercy are like a green olive tree.', about: 'David', to: 'The betrayed who still trust God’s mercy' },
    { from: 53, thru: 53, situation: 'The fool says in his heart there is no God; God looks down from heaven upon the children of men.', about: 'David', to: 'Those tempted to live as if God were not there' },
    { from: 54, thru: 54, situation: 'When the Ziphites betray David, he calls God his helper: save me, O God, by Thy name.', about: 'David', to: 'Anyone needing help when people turn on them' },
    { from: 55, thru: 55, situation: 'David is crushed by a friend’s treachery and casts his burden on the Lord, who will sustain him.', about: 'David', to: 'Anyone whose friend has turned against them' },
    { from: 56, thru: 56, situation: 'When the Philistines took David in Gath, he says: what time I am afraid, I will trust in Thee — God bottles every tear.', about: 'David', to: 'Anyone afraid in enemy territory' },
    { from: 57, thru: 57, situation: 'David, in the cave fleeing Saul, asks mercy and says his heart is fixed: he will sing and give praise.', about: 'David', to: 'The hunted who still praise God' },
    { from: 58, thru: 58, situation: 'David names unjust judges who will not hear; surely there is a God that judgeth in the earth.', about: 'David', to: 'Anyone watching crooked judgment' },
    { from: 59, thru: 59, situation: 'When Saul sent men to watch David’s house, he asks deliverance and will sing of God’s mercy in the morning.', about: 'David', to: 'Anyone watched and hunted who still sings' },
    { from: 60, thru: 60, situation: 'After a hard campaign, David owns that through God they shall do valiantly: man’s help is vain.', about: 'David', to: 'Anyone who has felt cast off in battle' },
    { from: 61, thru: 61, situation: 'David is at the end of himself and asks to be led to the rock that is higher than he.', about: 'David', to: 'Anyone needing a rock higher than themselves' },
    { from: 62, thru: 62, situation: 'David waits on God alone: he is my rock and my salvation; I shall not be moved.', about: 'David', to: 'Anyone learning to wait instead of forcing the next thing' },
    { from: 63, thru: 63, situation: 'In the wilderness of Judah, David thirsts for God early and says His lovingkindness is better than life.', about: 'David', to: 'Anyone dry and still seeking God' },
    { from: 64, thru: 64, situation: 'David asks to be preserved from the secret counsel of the wicked and from the insurrection of workers of iniquity.', about: 'David', to: 'Anyone targeted in secret' },
    { from: 65, thru: 65, situation: 'Praise waits in Zion: God hears prayer, stills the sea, and crowns the year with goodness.', about: 'David', to: 'Worshipers bringing prayer and harvest thanks' },
    { from: 66, thru: 66, situation: 'Make a joyful noise: God has proved His people as silver, then brought them into a wealthy place.', about: 'David', to: 'Anyone tried by fire who still blesses God' },
    { from: 67, thru: 67, situation: 'God be merciful unto us and bless us, that His way may be known upon earth — all nations singing.', about: 'Israel’s congregation', to: 'All peoples who need God’s blessing known' },
    { from: 68, thru: 68, situation: 'Let God arise: a joyful procession of praise, the God of salvation bearing His people daily.', about: 'David', to: 'Worshipers in procession who need a God who bears them' },
    { from: 69, thru: 69, situation: 'Deep waters of reproach: David sinks in mire, is hated without a cause, and still hopes in God’s salvation.', about: 'David', to: 'The reproached who still cry to God' },
    { from: 70, thru: 70, situation: 'A short cry: make haste, O God, to deliver me; let those who love Thy salvation say, God be magnified.', about: 'David', to: 'Anyone who needs help now, not later' },
    { from: 71, thru: 71, situation: 'Aging faith: David has trusted from youth and asks not to be forsaken when he is old and greyheaded.', about: 'David', to: 'The aging who still hope' },
    { from: 72, thru: 72, situation: 'Book II closes with a royal prayer for the king’s justice and blessing — “Amen, and Amen.”', about: 'Solomon (or a prayer for Solomon)', to: 'Those praying for a just king' },
    { from: 73, thru: 73, situation: 'Asaph nearly slips seeing the wicked prosper, then enters God’s sanctuary and understands their end.', about: 'Asaph', to: 'The faithful confused by injustice' },
    { from: 74, thru: 74, situation: 'Asaph laments a ruined sanctuary: the enemy has roared in the congregation; God is still King of old.', about: 'Asaph', to: 'A people watching holy things torn down' },
    { from: 75, thru: 75, situation: 'Asaph gives thanks: promotion comes from God; He puts down one and sets up another.', about: 'Asaph', to: 'Anyone waiting for God to judge fairly' },
    { from: 76, thru: 76, situation: 'In Judah God is known: He breaks the bow and the shield; He is more glorious than the mountains of prey.', about: 'Asaph', to: 'A people who need God to be feared' },
    { from: 77, thru: 77, situation: 'Asaph cries in the night, then remembers the years of the right hand of the Most High.', about: 'Asaph', to: 'Anyone whose comfort will not come until he remembers' },
    { from: 78, thru: 78, situation: 'Asaph retells Israel’s history as warning: they forgot God’s works; He still chose Judah and David.', about: 'Asaph', to: 'A people who need to remember and not repeat' },
    { from: 79, thru: 79, situation: 'The heathen have come into God’s inheritance; Asaph asks how long, and for help for the glory of His name.', about: 'Asaph', to: 'A people whose city and honor have been defiled' },
    { from: 80, thru: 80, situation: 'Give ear, O Shepherd of Israel: turn us again; the vine brought out of Egypt is burned.', about: 'Asaph', to: 'A people asking to be restored' },
    { from: 81, thru: 81, situation: 'Sing aloud: if My people would hearken, God would have subdued their enemies and fed them with honey from the rock.', about: 'Asaph', to: 'A people who will not listen — and any who still might' },
    { from: 82, thru: 82, situation: 'God stands in the congregation of the mighty and judges unjust judges: defend the poor and fatherless.', about: 'Asaph', to: 'Judges — and all who watch the weak get no justice' },
    { from: 83, thru: 83, situation: 'A confederacy gathers to cut Israel off from being a nation; Asaph asks God not to keep silence.', about: 'Asaph', to: 'A people surrounded and asking God to act' },
    { from: 84, thru: 84, situation: 'How amiable are Thy tabernacles: the sons of Korah long for God’s courts; a day there is better than a thousand.', about: 'The sons of Korah', to: 'Pilgrims longing for God’s house' },
    { from: 85, thru: 85, situation: 'The Lord has been favourable unto the land; mercy and truth are met together — righteousness and peace have kissed.', about: 'The sons of Korah', to: 'A people asking God to revive them again' },
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
    { from: 96, thru: 96, situation: 'Worship the Lord as King: a new song for all lands, and glory due His name.', about: 'Israel’s congregation — a song that the Lord is King over all the earth', to: 'All lands called to joyful worship' },
    { from: 97, thru: 97, situation: 'The Lord reigns: idols are put to shame, Zion is glad, and light is sown for the righteous.', about: 'Israel’s congregation singing that the Lord reigns', to: 'The upright waiting for light and gladness' },
    { from: 98, thru: 98, situation: 'A new song because the Lord has done marvellous things — His salvation made known.', about: 'Israel’s congregation singing because He has already acted', to: 'Anyone who needs praise to answer what God has done' },
    { from: 99, thru: 99, situation: 'The Lord reigns in Zion, holy and high above the people.', about: 'Israel’s congregation before the Holy One in Zion', to: 'Worshipers who need to know who is actually high' },
    { from: 100, thru: 100, situation: 'Make a joyful noise, all lands; serve the Lord with gladness; enter His gates with thanksgiving.', about: 'Israel’s congregation calling all lands to glad worship', to: 'All lands called to joyful thanksgiving' },
    { from: 101, thru: 101, situation: 'A king’s vow of integrity: David will walk with a perfect heart in his house and refuse the wicked.', about: 'David', to: 'Leaders vowing a clean house before God' },
    { from: 102, thru: 102, situation: 'An afflicted cry that becomes hope: the psalmist pours out his trouble, then trusts God will arise and build Zion.', about: 'An afflicted psalmist', to: 'Anyone whose days are like a shadow' },
    { from: 103, thru: 103, situation: 'David blesses the Lord who forgives all iniquity, heals, and removes transgressions as far as the east is from the west.', about: 'David', to: 'Every soul that needs mercy remembered' },
    { from: 104, thru: 104, situation: 'Bless the Lord, O my soul: a creation hymn — He stretches the heavens, feeds the creatures, and renews the face of the earth.', about: 'Israel’s congregation — a psalm of creation praise (untitled in the KJV)', to: 'Anyone seeing the world and needing to bless the Maker' },
    { from: 105, thru: 105, situation: 'Give thanks and remember His marvellous works: the covenant with Abraham, Joseph, and the exodus — God kept His word.', about: 'Israel remembering the covenant story (untitled in the KJV)', to: 'A people who need to remember that God keeps promise' },
    { from: 106, thru: 106, situation: 'We have sinned with our fathers: Israel’s failures are named, and still He remembered His covenant — Book IV ends in Hallelujah.', about: 'Israel confessing its story (untitled in the KJV)', to: 'A people who have failed and still need mercy' },
    { from: 107, thru: 107, situation: 'Book V opens: the redeemed from trouble give thanks — desert, prison, sickness, and storm.', about: 'The redeemed of the Lord — giving thanks after desert, prison, sickness, and storm', to: 'The redeemed telling what God has done' },
    { from: 108, thru: 108, situation: 'David’s heart is fixed: he will sing praise among the nations, and through God they shall do valiantly.', about: 'David', to: 'Anyone who needs courage for the next fight' },
    { from: 109, thru: 109, situation: 'David is slandered and repaid evil for good; he asks God not to hold His peace, and praises Him among the multitude.', about: 'David', to: 'Anyone repaid evil for good' },
    { from: 110, thru: 110, situation: 'The Lord said unto my Lord, Sit thou at my right hand: a priest-king after Melchizedek, ruling in the midst of enemies.', about: 'David', to: 'God’s people under the Messiah’s reign' },
    { from: 111, thru: 111, situation: 'Praise ye the Lord: His works are great and remembered; the fear of the Lord is the beginning of wisdom.', about: 'Israel’s congregation — a Hallelujah of His works (untitled in the KJV)', to: 'All who would be wise in the fear of the Lord' },
    { from: 112, thru: 112, situation: 'Praise ye the Lord: blessed is the man that feareth the Lord; his heart is fixed, trusting in the Lord.', about: 'Israel’s congregation — a Hallelujah of the one who fears the Lord (untitled in the KJV)', to: 'Anyone learning to fear the Lord and stay fixed' },
    { from: 113, thru: 113, situation: 'Praise ye the Lord from the rising of the sun: He raiseth the poor out of the dust and maketh the barren a joyful mother.', about: 'Israel’s congregation — a Hallelujah of the God who lifts the low (untitled in the KJV)', to: 'The poor and the barren — and all who praise from sunrise to sunset' },
    { from: 114, thru: 114, situation: 'When Israel went out of Egypt, the sea fled and the mountains skipped: Judah was His sanctuary.', about: 'Israel’s congregation remembering the exodus (untitled in the KJV)', to: 'A people who need to remember that creation moved for their deliverance' },
    { from: 115, thru: 115, situation: 'Not unto us, O Lord: their idols are silver and gold; our God is in the heavens and hath done whatsoever He hath pleased.', about: 'Israel’s congregation against dead idols (untitled in the KJV)', to: 'Anyone tempted to trust what cannot speak or save' },
    { from: 116, thru: 116, situation: 'I love the Lord, because He hath heard my voice: the psalmist was brought low, and He saved him — what shall I render?', about: 'A thankful worshiper (untitled in the KJV)', to: 'Anyone who has been heard after being brought low' },
    { from: 117, thru: 117, situation: 'O praise the Lord, all ye nations: His merciful kindness is great, and His truth endureth for ever.', about: 'Israel’s congregation calling the nations (untitled in the KJV)', to: 'All nations — and you when praise is due' },
    { from: 118, thru: 118, situation: 'O give thanks, for He is good: the stone which the builders refused is become the head; this is the day the Lord hath made.', about: 'Israel’s congregation after rescue (untitled in the KJV)', to: 'All who need to thank Him for a day He made' },
    { from: 119, thru: 119, situation: 'The great acrostic love-song to God’s Word — law, precepts, and path for life.', about: 'A worshiper in love with God’s Word — walking by law, precepts, and path', to: 'Anyone learning to walk by Scripture' },
    { from: 120, thru: 120, situation: 'A song of ascents in distress: deliver my soul from lying lips; I am for peace, they are for war.', about: 'A pilgrim going up (untitled in the KJV)', to: 'Anyone tired of lying lips on the road' },
    { from: 121, thru: 121, situation: 'A song of ascents: I will lift up mine eyes unto the hills — my help comes from the Lord, who made heaven and earth.', about: 'A pilgrim going up (untitled in the KJV)', to: 'Travelers who need to know where help actually comes from' },
    { from: 122, thru: 122, situation: 'A song of ascents of David: I was glad when they said, Let us go into the house of the Lord — pray for the peace of Jerusalem.', about: 'David', to: 'Worshipers glad to go up to God’s house' },
    { from: 123, thru: 123, situation: 'A song of ascents: unto Thee lift I up mine eyes, O Thou that dwellest in the heavens — we are filled with contempt.', about: 'A pilgrim going up (untitled in the KJV)', to: 'Anyone looked down on who still looks up' },
    { from: 124, thru: 124, situation: 'A song of ascents of David: if it had not been the Lord who was on our side, the waters had swallowed us.', about: 'David', to: 'Anyone who knows they would not have made it without Him' },
    { from: 125, thru: 125, situation: 'A song of ascents: they that trust in the Lord shall be as mount Zion, which cannot be removed.', about: 'A pilgrim going up (untitled in the KJV)', to: 'Anyone who needs to be as unmoved as Zion' },
    { from: 126, thru: 126, situation: 'A song of ascents: when the Lord turned again the captivity of Zion, we were like them that dream — they that sow in tears shall reap in joy.', about: 'A pilgrim going up (untitled in the KJV)', to: 'Anyone sowing in tears and waiting for harvest' },
    { from: 127, thru: 127, situation: 'A song of ascents for Solomon: except the Lord build the house, they labour in vain that build it.', about: 'Solomon (a song of degrees for Solomon)', to: 'Builders, watchmen, and parents who need the Lord to build' },
    { from: 128, thru: 128, situation: 'A song of ascents: blessed is every one that feareth the Lord; thy wife shall be as a fruitful vine.', about: 'A pilgrim going up (untitled in the KJV)', to: 'Households learning the blessing of the fear of the Lord' },
    { from: 129, thru: 129, situation: 'A song of ascents: many a time have they afflicted me from my youth, yet they have not prevailed.', about: 'A pilgrim going up (untitled in the KJV)', to: 'Anyone long afflicted who has not been finished' },
    { from: 130, thru: 130, situation: 'A song of ascents from the depths: if Thou, Lord, shouldest mark iniquities, who shall stand? with Him is plenteous redemption.', about: 'A pilgrim going up (untitled in the KJV)', to: 'Anyone crying from the depths for mercy' },
    { from: 131, thru: 131, situation: 'A song of ascents of David: my heart is not haughty; I have quieted myself as a weaned child.', about: 'David', to: 'Anyone who needs a quieted soul' },
    { from: 132, thru: 132, situation: 'A song of ascents: Lord, remember David — he swore to find a place for the Lord; God chose Zion.', about: 'A pilgrim going up (untitled in the KJV)', to: 'A people asking God to remember His oath to David' },
    { from: 133, thru: 133, situation: 'A song of ascents of David: behold how good and how pleasant it is for brethren to dwell together in unity.', about: 'David', to: 'Brothers who need to dwell together in unity' },
    { from: 134, thru: 134, situation: 'A song of ascents: bless ye the Lord, all ye servants who stand by night in the house of the Lord.', about: 'A pilgrim going up (untitled in the KJV)', to: 'Night watchers in God’s house' },
    { from: 135, thru: 135, situation: 'Praise ye the Lord: our God is above all gods; the idols of the heathen are silver and gold — they have mouths, but they speak not.', about: 'Israel’s congregation (untitled in the KJV)', to: 'Anyone tempted to trust a god that cannot speak' },
    { from: 136, thru: 136, situation: 'O give thanks unto the Lord; for He is good: for His mercy endureth for ever — creation, exodus, and daily bread named one by one.', about: 'Israel’s congregation (untitled in the KJV)', to: 'All who need to thank Him that His mercy has not run out' },
    { from: 137, thru: 137, situation: 'By the rivers of Babylon, there we sat down, yea, we wept: how shall we sing the Lord’s song in a strange land?', about: 'Exiles by Babylon’s rivers (untitled in the KJV)', to: 'Anyone far from home who will not forget Zion' },
    { from: 138, thru: 138, situation: 'David will praise God with his whole heart: He has magnified His word above all His name, and will perfect that which concerns him.', about: 'David', to: 'Anyone whose strength is small and still needs Him to perfect the work' },
    { from: 139, thru: 139, situation: 'O Lord, Thou hast searched me: David is fully known — fearfully and wonderfully made — and asks to be led in the way everlasting.', about: 'David', to: 'Anyone fully known and still loved by God' },
    { from: 140, thru: 140, situation: 'Deliver me, O Lord, from the evil man: David asks preservation from violent men and from their sharp tongues.', about: 'David', to: 'Anyone under violent and lying attack' },
    { from: 141, thru: 141, situation: 'David asks that his prayer be set forth as incense, and that the Lord keep the door of his lips.', about: 'David', to: 'Anyone who needs help with mouth and heart at night' },
    { from: 142, thru: 142, situation: 'Maschil of David, a prayer when he was in the cave: no man cared for my soul; Thou art my refuge.', about: 'David', to: 'Anyone in a cave with no one left to care' },
    { from: 143, thru: 143, situation: 'Hear my prayer, O Lord: the enemy has persecuted my soul; cause me to hear Thy lovingkindness in the morning.', about: 'David', to: 'Anyone whose soul is persecuted and needs morning mercy' },
    { from: 144, thru: 144, situation: 'Blessed be the Lord my strength, which teacheth my hands to war: David asks rescue, then blessing on sons and daughters.', about: 'David', to: 'Anyone who needs both strength for battle and peace at home' },
    { from: 145, thru: 145, situation: 'David’s forever-kingdom psalm: I will extol Thee, my God, O King; the Lord is good to all, and His tender mercies are over all His works.', about: 'David', to: 'Anyone who needs a King whose mercy is over all His works' },
    { from: 146, thru: 146, situation: 'Hallelujah: trust not in princes; the Lord keeps truth forever and raises those who are bowed down.', about: 'Israel’s closing Hallelujah', to: 'Anyone tempted to trust princes instead of the Lord' },
    { from: 147, thru: 147, situation: 'Hallelujah: the Lord heals the broken in heart and binds up their wounds; He counts the stars and feeds His people.', about: 'Israel’s closing Hallelujah', to: 'The brokenhearted — and all creation called to praise' },
    { from: 148, thru: 148, situation: 'Praise ye the Lord from the heavens: angels, sun, moon, and all His hosts — let them praise the name of the Lord.', about: 'Israel’s closing Hallelujah (untitled in the KJV)', to: 'All creation in heaven called to praise' },
    { from: 149, thru: 149, situation: 'Sing unto the Lord a new song: let the saints be joyful in glory; the high praises of God in their mouth.', about: 'Israel’s closing Hallelujah (untitled in the KJV)', to: 'The saints called to a new song' },
    { from: 150, thru: 150, situation: 'Praise God in His sanctuary: let every thing that hath breath praise the Lord.', about: 'Israel’s closing Hallelujah (untitled in the KJV)', to: 'Every thing that has breath' }
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
    { from: 1, thru: 6, situation: 'Isaiah confronts Judah’s sin; he sees the Lord high and lifted up and is sent: holy, holy, holy.', about: 'Isaiah', to: 'Judah under warning — and all who need to be made clean to speak' },
    { from: 7, thru: 12, situation: 'The sign of Immanuel; unto us a child is born; a remnant returns, and a king from Jesse’s stem.', about: 'Isaiah', to: 'Judah under threat — and all who need a coming king' },
    { from: 13, thru: 23, situation: 'Oracles against the nations around Judah.', about: 'Isaiah', to: 'Judah watching the nations under God' },
    { from: 24, thru: 27, situation: 'The earth is judged; God will swallow up death in victory, and Judah is told to trust in the Lord forever.', about: 'Isaiah', to: 'A people under threat who need God to reign' },
    { from: 28, thru: 32, situation: 'Woes on drunken Ephraim and on those who trust Egypt; God will be a crown of glory to the remnant.', about: 'Isaiah', to: 'Judah tempted to trust the wrong help' },
    { from: 33, thru: 33, situation: 'O Lord, be gracious unto us; we have waited for Thee: be Thou their arm every morning, our salvation in the time of trouble.', about: 'Isaiah', to: 'Anyone waiting for God to be gracious in trouble' },
    { from: 34, thru: 35, situation: 'Nations are judged; a highway of holiness is opened, and the ransomed of the Lord return with singing.', about: 'Isaiah', to: 'The ransomed waiting for a way home' },
    { from: 36, thru: 39, situation: 'Assyria threatens Jerusalem in Hezekiah’s day; God delivers; then Babylon’s future rise is hinted.', about: 'Isaiah (with Hezekiah’s story)', to: 'Judah under Assyrian siege' },
    { from: 40, thru: 40, situation: 'Comfort ye my people: the Lord comes as a shepherd who gathers the lambs, and they that wait on Him renew their strength.', about: 'Isaiah (comfort from God)', to: 'Weary Judah — and anyone waiting on the Lord' },
    { from: 41, thru: 41, situation: 'The Lord comforts fearful Israel in exile: Fear thou not; for I am with thee — strength and help from His right hand.', about: 'Isaiah (the Lord speaking)', to: 'Fearful people — and you when fear is loud' },
    { from: 42, thru: 42, situation: 'The Lord’s servant will bring justice to the nations; God will not break the bruised reed.', about: 'Isaiah (comfort from God)', to: 'Exiles who need a gentle servant-king' },
    { from: 43, thru: 43, situation: 'The Lord names and redeems His people: Fear not, for I have redeemed thee; I have called thee by thy name; thou art mine.', about: 'Isaiah (the Lord speaking)', to: 'Exiles who need to know they belong to God' },
    { from: 44, thru: 48, situation: 'God is incomparable; idols are nothing; He names Cyrus and says there is no God beside Him.', about: 'Isaiah (comfort from God)', to: 'Exiles tempted to trust idols' },
    { from: 49, thru: 52, situation: 'The Lord’s servant is a light to the nations; Zion feels forgotten, yet God says He will not forget His people.', about: 'Isaiah', to: 'Zion feeling forgotten — and all who need to know they are named' },
    { from: 53, thru: 53, situation: 'The Servant suffers for sins; He is wounded for our transgressions.', about: 'Isaiah', to: 'Israel — and all who look to the Suffering Servant' },
    { from: 54, thru: 55, situation: 'Free pardon is offered; the word of God stands forever; come, buy wine and milk without money.', about: 'Isaiah', to: 'The thirsty and the poor who cannot pay' },
    { from: 56, thru: 59, situation: 'A call to true fasting and justice; sin has separated the people from God.', about: 'Isaiah', to: 'Returnees tempted to empty religion' },
    { from: 60, thru: 62, situation: 'Zion’s light and the Spirit of the Lord on the anointed to bind up the brokenhearted and proclaim liberty.', about: 'Isaiah', to: 'The brokenhearted and captives waiting for good news' },
    { from: 63, thru: 66, situation: 'Promises of a new heavens and new earth; the Lord comes to save and to judge.', about: 'Isaiah', to: 'Exiles and returnees longing for full restoration' }
  ],
  Jeremiah: [
    { from: 1, thru: 10, situation: 'Jeremiah is called as a youth to warn Judah before Babylon comes.', about: 'Jeremiah', to: 'Judah and the exiles' },
    { from: 11, thru: 20, situation: 'Jeremiah faces plots, loneliness, and the cost of speaking God’s word.', about: 'Jeremiah', to: 'A prophet under pressure' },
    { from: 21, thru: 28, situation: 'Kings reject the word; false prophets promise peace; Jeremiah wears the yoke of Babylon and is opposed.', about: 'Jeremiah', to: 'Judah refusing the word before the fall' },
    { from: 29, thru: 29, situation: 'Jeremiah writes to the first exiles in Babylon: seek the peace of the city; God’s thoughts toward them are peace, and an expected end.', about: 'Jeremiah (letter from the Lord)', to: 'Exiles in Babylon — and all waiting for hope' },
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
    { from: 8, thru: 9, situation: 'Jesus heals with authority — leper, centurion, storm, and the sick — and calls Matthew.', about: 'Jesus (through Matthew)', to: 'Crowds and disciples seeing the kingdom’s power' },
    { from: 10, thru: 10, situation: 'Jesus sends the Twelve: freely ye have received, freely give; fear not them which kill the body.', about: 'Jesus', to: 'The Twelve being sent (and you today)' },
    { from: 11, thru: 12, situation: 'Jesus invites the weary to rest; conflict with Pharisees grows.', about: 'Jesus', to: 'The weary and heavy laden (and you today)' },
    { from: 13, thru: 13, situation: 'By the sea, Jesus teaches parables of the kingdom — sower, weeds, mustard seed, treasure — so crowds and disciples learn how the kingdom grows.', about: 'Jesus (through Matthew)', to: 'Crowds and disciples learning how the kingdom grows' },
    { from: 14, thru: 14, situation: 'After John’s death, Jesus feeds the five thousand and walks on the sea — the crowds still come.', about: 'Jesus (through Matthew)', to: 'Disciples learning who He is' },
    { from: 15, thru: 15, situation: 'Jesus confronts tradition, heals, and feeds the four thousand.', about: 'Jesus (through Matthew)', to: 'Crowds and disciples seeing His mercy' },
    { from: 16, thru: 16, situation: 'Peter confesses Jesus as the Christ; Jesus begins to speak of the cross.', about: 'Jesus (through Matthew)', to: 'Disciples learning who He is' },
    { from: 17, thru: 17, situation: 'Jesus is transfigured; the disciples cannot heal a boy, and He teaches that faith as a grain of mustard seed is enough.', about: 'Jesus (through Matthew)', to: 'The disciples who could not heal the boy (and you today)' },
    { from: 18, thru: 18, situation: 'Jesus teaches about little ones, humility, seeking the lost sheep, and forgiving brothers seventy times seven.', about: 'Jesus', to: 'His disciples — and all who guard the vulnerable and practice forgiveness' },
    { from: 19, thru: 19, situation: 'Jesus teaches on marriage, blesses little children, and meets the rich young man.', about: 'Jesus (through Matthew)', to: 'Disciples — and parents bringing children to Him' },
    { from: 20, thru: 20, situation: 'The vineyard laborers; greatness as service; Jesus sets His face toward Jerusalem.', about: 'Jesus (through Matthew)', to: 'Disciples on the road to the cross' },
    { from: 21, thru: 21, situation: 'Jesus enters Jerusalem as King, cleanses the temple, and is challenged by the leaders.', about: 'Jesus (through Matthew)', to: 'Jerusalem on the day the King rode in' },
    { from: 22, thru: 22, situation: 'Wedding-feast parable and debates in the temple: render unto Caesar; the great commandment.', about: 'Jesus (through Matthew)', to: 'Jerusalem’s leaders — and all who test Him' },
    { from: 23, thru: 23, situation: 'Jesus woes the scribes and Pharisees: they say and do not; He would have gathered Jerusalem as a hen her chickens.', about: 'Jesus', to: 'Hypocrites — and a city He still longed to gather' },
    { from: 24, thru: 25, situation: 'Jesus speaks of the end and the call to watchful faithfulness.', about: 'Jesus (through Matthew)', to: 'Disciples needing endurance' },
    { from: 26, thru: 26, situation: 'Last Supper, Gethsemane, betrayal, and Peter’s denial — the night before the cross.', about: 'Jesus (through Matthew)', to: 'Disciples on the night He was betrayed' },
    { from: 27, thru: 27, situation: 'Jesus is tried, crucified, and buried; the veil of the temple is rent.', about: 'Jesus (through Matthew)', to: 'All who need the finished cross' },
    { from: 28, thru: 28, situation: 'The tomb is empty; Jesus meets the women and the eleven, and sends them to the nations.', about: 'Jesus (through Matthew)', to: 'Disciples — and all who need a risen Savior' },
  ],
  Mark: [
    { from: 1, thru: 3, situation: 'Jesus’ ministry begins with power: preaching, healing, and conflict in Galilee.', about: 'Jesus (through Mark)', to: 'His disciples and those listening (and you today)' },
    { from: 4, thru: 5, situation: 'Parables by the sea; a storm stilled; a demoniac, a bleeding woman, and Jairus’s daughter.', about: 'Jesus (through Mark)', to: 'Disciples in the storm (and you today)' },
    { from: 6, thru: 6, situation: 'Jesus is rejected at Nazareth; later He feeds the five thousand and walks on the sea.', about: 'Jesus (through Mark)', to: 'Crowds and disciples learning who He is' },
    { from: 7, thru: 7, situation: 'Jesus confronts tradition that voids the word; He heals the Syrophenician’s daughter and the deaf.', about: 'Jesus (through Mark)', to: 'Anyone hiding behind tradition — and outsiders He still heals' },
    { from: 8, thru: 8, situation: 'Jesus feeds the four thousand; Peter confesses Him as Christ; He begins to speak of the cross.', about: 'Jesus (through Mark)', to: 'Half-seeing disciples who need a second touch' },
    { from: 9, thru: 9, situation: 'Jesus is transfigured; the disciples cannot cast out a spirit; He teaches that the first shall be last.', about: 'Jesus (through Mark)', to: 'Disciples learning the way of the cross' },
    { from: 10, thru: 10, situation: 'Jesus teaches on marriage, blesses little children, and the rich young man goes away sorrowful; they go up to Jerusalem.', about: 'Jesus (through Mark)', to: 'Disciples on the road to the cross' },
    { from: 11, thru: 13, situation: 'Entry into Jerusalem; temple cleansing; Olivet discourse.', about: 'Jesus (through Mark)', to: 'Jerusalem in the final week' },
    { from: 14, thru: 16, situation: 'Betrayal, trial, crucifixion, empty tomb.', about: 'Jesus (through Mark)', to: 'Disciples — and all who need the risen Christ' }
  ],
  Luke: [
    { from: 1, thru: 2, situation: 'Births of John and Jesus; shepherds hear good news; the child grows in favor with God and man.', about: 'Jesus (through Luke)', to: 'His disciples and those listening (and you today)' },
    { from: 3, thru: 4, situation: 'John’s preaching; Jesus’ baptism, genealogy, temptation, and rejection at Nazareth.', about: 'Jesus (through Luke)', to: 'Israel hearing the kingdom announced' },
    { from: 5, thru: 5, situation: 'Jesus calls Simon, heals, and eats with publicans: they that are whole need not a physician.', about: 'Jesus (through Luke)', to: 'Sinners called to follow' },
    { from: 6, thru: 6, situation: 'Jesus names the Twelve and teaches the sermon on the plain: love your enemies; be merciful as your Father.', about: 'Jesus (through Luke)', to: 'Disciples learning a new way to live' },
    { from: 7, thru: 7, situation: 'A centurion’s servant is healed; a widow’s son is raised; a sinful woman anoints Jesus’ feet.', about: 'Jesus (through Luke)', to: 'The humble who come to Him — and the proud who watch' },
    { from: 8, thru: 8, situation: 'The sower; the storm stilled; Legion; Jairus’s daughter and the woman with the issue of blood.', about: 'Jesus (through Luke)', to: 'Disciples in the storm — and anyone who needs to be made whole' },
    { from: 9, thru: 9, situation: 'The Twelve are sent; the five thousand fed; Jesus is transfigured, then sets His face toward Jerusalem.', about: 'Jesus (through Luke)', to: 'Disciples learning to follow the cross-ward road' },
    { from: 10, thru: 10, situation: 'Jesus sends seventy others, then answers a lawyer with the Good Samaritan, then sits in Martha’s house.', about: 'Jesus (through Luke)', to: 'Sinners and seekers (and you today)' },
    { from: 11, thru: 11, situation: 'Jesus teaches His disciples to pray; He warns against empty religion.', about: 'Jesus (through Luke)', to: 'Disciples learning to pray' },
    { from: 12, thru: 12, situation: 'Jesus tells the rich fool parable and says, Fear not, little flock — do not be anxious; your Father knows your need.', about: 'Jesus (through Luke)', to: 'Disciples tempted to fear and to store up treasure' },
    { from: 13, thru: 14, situation: 'Healings on the Sabbath; parables of the kingdom and of the great supper.', about: 'Jesus (through Luke)', to: 'Guests and outcasts hearing the kingdom invitation' },
    { from: 15, thru: 15, situation: 'Lost sheep, lost coin, and the prodigal son — heaven’s joy over one sinner who repents.', about: 'Jesus (through Luke)', to: 'Sinners and seekers (and you today)' },
    { from: 16, thru: 16, situation: 'The unjust steward; you cannot serve God and mammon; the rich man and Lazarus.', about: 'Jesus (through Luke)', to: 'Anyone trusting riches more than God' },
    { from: 17, thru: 17, situation: 'Offenses, mustard-seed faith, ten lepers, and the days of the Son of man — one turns back to give thanks.', about: 'Jesus (through Luke)', to: 'The thankful — and anyone who has been made clean' },
    { from: 18, thru: 18, situation: 'The persistent widow; the Pharisee and the publican; little children; the rich ruler; they go up to Jerusalem.', about: 'Jesus (through Luke)', to: 'The proud and the humble who pray' },
    { from: 19, thru: 19, situation: 'In Jericho Jesus finds Zacchaeus: the Son of man is come to seek and to save that which was lost.', about: 'Jesus (through Luke)', to: 'The lost whom the Son of man came to seek' },
    { from: 20, thru: 21, situation: 'Teaching in the temple; widow’s mites; signs of the end.', about: 'Jesus (through Luke)', to: 'Jerusalem’s final days of teaching' },
    { from: 22, thru: 24, situation: 'Last Supper, arrest, cross, Emmaus road, and resurrection appearances.', about: 'Jesus (through Luke)', to: 'Disciples — and all who need opened Scriptures and a risen Lord' }
  ],
  John: [
    { from: 1, thru: 1, situation: 'The Word becomes flesh and dwells among us; first disciples follow the Lamb of God.', about: 'Jesus (through John)', to: 'Anyone who needs the Word made flesh' },
    { from: 2, thru: 2, situation: 'Water becomes wine at Cana; Jesus cleanses the temple and speaks of the temple of His body.', about: 'Jesus (through John)', to: 'Disciples seeing His glory begin' },
    { from: 3, thru: 3, situation: 'Jesus teaches Nicodemus at night about new birth: God so loved the world that He gave His only begotten Son.', about: 'Jesus', to: 'Nicodemus in the night — and you when you need to know God actually loved the world' },
    { from: 4, thru: 4, situation: 'Jesus speaks with a Samaritan woman at the well: He is the living water, and many in her city believe.', about: 'Jesus', to: 'The woman at the well — and anyone thirsty for living water' },
    { from: 5, thru: 5, situation: 'Jesus heals at Bethesda on the sabbath and says the Son does what He sees the Father do.', about: 'Jesus (through John)', to: 'The impotent man — and anyone waiting by a pool that cannot save' },
    { from: 6, thru: 6, situation: 'Jesus feeds the five thousand, walks on the sea, and says He is the bread of life.', about: 'Jesus (through John)', to: 'Crowds seeking bread — and disciples needing the true food' },
    { from: 7, thru: 7, situation: 'At the feast of tabernacles, debate rises over who Jesus is.', about: 'Jesus (through John)', to: 'Jerusalem under debate about who Jesus is' },
    { from: 8, thru: 8, situation: 'Jesus speaks in the temple: I am the light of the world; He tells the truth that sets people free.', about: 'Jesus (through John)', to: 'Those in the temple hearing His claim' },
    { from: 9, thru: 9, situation: 'Jesus heals a man born blind; the Pharisees investigate and the man worships Him.', about: 'Jesus (through John)', to: 'The man born blind — and all who need sight' },
    { from: 10, thru: 10, situation: 'Jesus is the Good Shepherd who gives His life for the sheep.', about: 'Jesus (through John)', to: 'His sheep who hear His voice' },
    { from: 11, thru: 11, situation: 'Lazarus is dead four days; Jesus weeps, then calls him out: I am the resurrection and the life.', about: 'Jesus (through John)', to: 'Friends of Jesus facing death' },
    { from: 12, thru: 12, situation: 'Mary anoints Jesus; He enters Jerusalem; a grain of wheat must fall and die — the hour is come.', about: 'Jesus (through John)', to: 'Those watching the hour of His glory come' },
    { from: 13, thru: 13, situation: 'In the upper room Jesus washes the disciples’ feet and gives a new commandment: love one another.', about: 'Jesus', to: 'His disciples the night before the cross' },
    { from: 14, thru: 14, situation: 'Let not your heart be troubled: Jesus is the way, the truth, and the life; He leaves peace, not as the world gives.', about: 'Jesus', to: 'Troubled disciples the night before the cross' },
    { from: 15, thru: 15, situation: 'Jesus is the true vine: abide in Me; without Me ye can do nothing; love one another as I have loved you.', about: 'Jesus', to: 'Disciples learning to abide' },
    { from: 16, thru: 16, situation: 'Jesus tells them it is expedient that He go: the Comforter will come; in the world ye shall have tribulation, but be of good cheer.', about: 'Jesus', to: 'Disciples about to be scattered' },
    { from: 17, thru: 17, situation: 'Jesus’ high priestly prayer: He prays for those the Father has given Him, and for all who will believe through their word.', about: 'Jesus', to: 'His own — and all who will believe through their word' },
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
    { from: 6, thru: 6, situation: 'Dead to sin, alive to God: do not let sin reign; the wages of sin is death, but the gift of God is eternal life.', about: 'Paul', to: 'Believers in the Spirit (and you today)' },
    { from: 7, thru: 7, situation: 'Paul describes the struggle with the law: the good I would, I do not; who shall deliver me?', about: 'Paul', to: 'Believers in the Spirit (and you today)' },
    { from: 8, thru: 8, situation: 'No condemnation for those in Christ; the Spirit of adoption; nothing can separate us from the love of God.', about: 'Paul', to: 'Believers in the Spirit (and you today)' },
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
    { from: 4, thru: 4, situation: 'Paul calls the church to walk worthy: one body, one Spirit, put off the old man and speak truth in love.', about: 'Paul', to: 'believers in Ephesus (and you today)' },
    { from: 5, thru: 5, situation: 'Walk in love and light; husbands and wives are taught Christlike marriage.', about: 'Paul', to: 'believers in Ephesus (and you today)' },
    { from: 6, thru: 6, situation: 'Paul turns to the household — children, fathers, servants — then arms the church with the whole armor of God.', about: 'Paul', to: 'Believers in spiritual battle (and you today)' }
  ],
  Philippians: [
    { from: 1, thru: 2, situation: 'Paul writes from prison with joy; Christ is preached; the mind of Christ is humility.', about: 'Paul', to: 'the church at Philippi (and you today)' },
    { from: 3, thru: 3, situation: 'Paul counts status as loss for Christ; he presses toward the prize.', about: 'Paul', to: 'Philippi learning true righteousness' },
    { from: 4, thru: 4, situation: 'Rejoice; do not be anxious; the peace of God guards hearts; contentment in every state through Christ.', about: 'Paul', to: 'the church at Philippi (and you today)' }
  ],
  Colossians: [
    { from: 1, thru: 2, situation: 'Paul exalts Christ’s supremacy against hollow philosophy in Colosse.', about: 'Paul', to: 'believers in Colosse (and you today)' },
    { from: 3, thru: 3, situation: 'Set minds above; put on love; wives, husbands, children, and fathers are taught a new household life in Christ.', about: 'Paul', to: 'Believers setting minds above (and you today)' },
    { from: 4, thru: 4, situation: 'Continue in prayer; walk in wisdom toward outsiders; speech seasoned with grace.', about: 'Paul', to: 'believers in Colosse (and you today)' }
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
    { from: 1, thru: 1, situation: 'Paul, from prison, tells Timothy to fan the gift of God: God has not given a spirit of fear, but of power, of love, and of a sound mind.', about: 'Paul', to: 'Timothy (and every timid heart)' },
    { from: 2, thru: 4, situation: 'Endure hardness as a good soldier; preach the word; Paul finishes his course.', about: 'Paul', to: 'Timothy (and every timid heart)' }
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
    { from: 11, thru: 11, situation: 'The hall of faith: elders who believed God when they could not yet see the promise.', about: 'The writer of Hebrews', to: 'Hebrew believers holding faith' },
    { from: 12, thru: 12, situation: 'Run with patience the race set before you, looking unto Jesus; the Father chastens sons He loves.', about: 'The writer of Hebrews', to: 'Believers running with patience' },
    { from: 13, thru: 13, situation: 'Let brotherly love continue; be content; He hath said, I will never leave thee nor forsake thee.', about: 'The writer of Hebrews', to: 'Hebrew believers holding fast to Christ' }
  ],
  James: [
    { from: 1, thru: 5, situation: 'James writes scattered believers under trial about real faith that works in speech, mercy, and patience.', about: 'James', to: 'scattered believers under trial' }
  ],
  '1 Peter': [
    { from: 1, thru: 1, situation: 'Peter writes to elect exiles and blesses God for new birth and living hope through Christ’s resurrection.', about: 'Peter', to: 'elect exiles in suffering and hope' },
    { from: 2, thru: 2, situation: 'Peter calls elect exiles to holy living and names Christ the living cornerstone.', about: 'Peter', to: 'believers in suffering and hope' },
    { from: 3, thru: 4, situation: 'Household life and suffering for righteousness; live unto God and love one another fervently.', about: 'Peter', to: 'Believers in suffering and hope' },
    { from: 5, thru: 5, situation: 'Peter closes: humble yourselves under God’s hand, cast all your care on Him, for He cares for you, and resist the devil.', about: 'Peter', to: 'Believers casting care on God' }
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
  if (sit && sit.length >= 55) {
    return /[.!?]$/.test(sit) ? sit : sit + '.';
  }
  if (sit && a && t) {
    const who = a.replace(/^The\s+/, 'the ');
    const audience = t.replace(/^The\s+/, 'the ');
    return who.charAt(0).toUpperCase() + who.slice(1) + ' said this to ' + audience + ': ' + sit.replace(/[.!?]$/, '') + '.';
  }
  if (sit) return /[.!?]$/.test(sit) ? sit : sit + '.';
  if (a && t) return a + ' said this to ' + t + '.';
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
