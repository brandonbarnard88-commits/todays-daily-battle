/**
 * Kids Battle — standalone logic for kids/index.html
 * Verse, prayer, streak, badges, doodle. Uses localStorage. Offline-capable.
 * KJV verses = public domain. No third-party content.
 */
(function () {
  'use strict';

  // Shared with Kids Corner (coloring.html) — hub for all kid stuff; one streak across both
  const KIDS_STREAK_KEY = 'kidsStreak';
  const KIDS_DOODLE_KEY = 'kidsDoodle';
  const KIDS_VERSE_INDEX_KEY = 'kidsVerseIndex';

  const KIDS_TOPICS = [
    { topic: 'brave', label: 'Brave' },
    { topic: 'kind', label: 'Kind' },
    { topic: 'thankful', label: 'Thankful' },
    { topic: 'help', label: 'Help' },
    { topic: 'peace', label: 'Peace' },
    { topic: 'love', label: 'Love' },
    { topic: 'jesus', label: 'Jesus' },
    { topic: 'family', label: 'Family' },
    { topic: 'God', label: 'God' },
    { topic: 'obedience', label: 'Obedience' },
    { topic: 'joy', label: 'Joy' },
    { topic: 'faith', label: 'Faith' },
    { topic: 'courage', label: 'Courage' },
    { topic: 'hope', label: 'Hope' },
    { topic: 'strength', label: 'Strength' }
  ];

  const KIDS_VERSES = [
  { ref: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.' },
  { ref: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.' },
  { ref: 'Joshua 1:9', text: 'Be strong and of a good courage; be not afraid.' },
  { ref: 'Matthew 19:14', text: 'Suffer little children to come unto me.' },
  { ref: 'Psalm 119:105', text: 'Thy word is a lamp unto my feet.' },
  { ref: 'Ephesians 6:10', text: 'Be strong in the Lord, and in the power of his might.' },
  { ref: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee.' },
  { ref: 'Proverbs 3:5', text: 'Trust in the Lord with all thine heart.' },
  { ref: '1 Samuel 17:47', text: 'The battle is the Lord\'s.' },
  { ref: 'Romans 8:28', text: 'All things work together for good to them that love God.' },
  { ref: 'Psalm 46:10', text: 'Be still, and know that I am God.' },
  { ref: 'Matthew 6:26', text: 'Behold the fowls of the air: your heavenly Father feedeth them.' },
  { ref: 'John 14:27', text: 'Peace I leave with you, my peace I give unto you.' },
  { ref: 'Psalm 56:3', text: 'What time I am afraid, I will trust in thee.' },
  { ref: 'Colossians 3:23', text: 'Whatsoever ye do, do it heartily, as to the Lord.' },
  { ref: 'Psalm 139:14', text: 'I am fearfully and wonderfully made.' },
  { ref: 'Jeremiah 29:11', text: 'For I know the thoughts that I think toward you.' },
  { ref: 'Luke 11:28', text: 'Blessed are they that hear the word of God.' },
  { ref: 'Psalm 34:8', text: 'O taste and see that the Lord is good.' },
  { ref: '2 Timothy 1:7', text: 'God hath not given us the spirit of fear.' },
  { ref: 'Psalm 100:5', text: 'The Lord is good; his mercy is everlasting.' },
  { ref: 'Hebrews 13:6', text: 'The Lord is my helper, and I will not fear.' },
  { ref: 'Psalm 37:4', text: 'Delight thyself also in the Lord; and he shall give thee the desires of thine heart.' },
  { ref: '1 Peter 5:7', text: 'Casting all your care upon him; for he careth for you.' },
  { ref: 'Psalm 121:1-2', text: 'I will lift up mine eyes unto the hills, from whence cometh my help.' },
  { ref: 'Matthew 5:16', text: 'Let your light so shine before men.' },
  { ref: 'Psalm 18:2', text: 'The Lord is my rock, and my fortress.' },
  { ref: 'Isaiah 40:31', text: 'They that wait upon the Lord shall renew their strength.' },
  { ref: 'Proverbs 17:22', text: 'A merry heart doeth good like a medicine.' },
  { ref: 'Psalm 16:11', text: 'Thou wilt shew me the path of life.' },
  { ref: 'Psalm 118:24', text: 'This is the day which the Lord hath made; we will rejoice.' },
  { ref: '1 John 4:19', text: 'We love him, because he first loved us.' },
  { ref: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help.' },
  { ref: 'Nehemiah 8:10', text: 'The joy of the Lord is your strength.' },
  { ref: 'Psalm 27:1', text: 'The Lord is my light and my salvation; whom shall I fear?' },
  { ref: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son.' },
  { ref: 'Psalm 34:14', text: 'Depart from evil, and do good; seek peace.' },
  { ref: 'Psalm 4:7', text: 'Thou hast put gladness in my heart.' },
  { ref: 'Matthew 11:28', text: 'Come unto me, all ye that labour, and I will give you rest.' },
  { ref: 'Proverbs 22:6', text: 'Train up a child in the way he should go.' },
  { ref: 'Psalm 121:7', text: 'The Lord shall preserve thee from all evil.' },
  { ref: '1 Corinthians 16:13', text: 'Watch ye, stand fast in the faith, be strong.' },
  { ref: 'Romans 15:13', text: 'The God of hope fill you with all joy and peace.' },
  { ref: 'Psalm 91:11', text: 'He shall give his angels charge over thee.' },
  { ref: 'Hebrews 11:1', text: 'Faith is the substance of things hoped for.' },
  { ref: 'Psalm 34:18', text: 'The Lord is nigh unto them that are of a broken heart.' },
  { ref: 'Isaiah 26:3', text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee.' },
  { ref: 'Romans 8:38', text: 'Neither death, nor life shall separate us from the love of God.' },
  { ref: 'Psalm 27:14', text: 'Wait on the Lord: be of good courage.' },
  { ref: 'Philippians 4:6', text: 'Be careful for nothing; but in every thing by prayer let your requests be made known.' },
  { ref: 'Philippians 4:7', text: 'The peace of God shall keep your hearts and minds.' },
  { ref: 'Psalm 32:8', text: 'I will instruct thee and teach thee in the way which thou shalt go.' },
  { ref: 'Proverbs 16:3', text: 'Commit thy works unto the Lord, and thy thoughts shall be established.' },
  { ref: 'Psalm 37:5', text: 'Commit thy way unto the Lord; trust also in him.' },
  { ref: 'Isaiah 43:2', text: 'When thou passest through the waters, I will be with thee.' },
  { ref: 'Psalm 145:9', text: 'The Lord is good to all: and his tender mercies are over all his works.' },
  { ref: 'Psalm 103:13', text: 'Like as a father pitieth his children, so the Lord pitieth them that fear him.' },
  { ref: 'Matthew 7:7', text: 'Ask, and it shall be given you; seek, and ye shall find.' },
  { ref: 'Psalm 9:1', text: 'I will praise thee, O Lord, with my whole heart.' },
  { ref: 'Psalm 19:14', text: 'Let the words of my mouth be acceptable in thy sight.' },
  { ref: 'Psalm 28:7', text: 'The Lord is my strength and my shield.' },
  { ref: 'Psalm 31:24', text: 'Be of good courage, and he shall strengthen your heart.' },
  { ref: 'Psalm 33:4', text: 'The word of the Lord is right; and all his works are done in truth.' },
  { ref: 'Psalm 40:1', text: 'I waited patiently for the Lord; and he inclined unto me.' },
  { ref: 'Psalm 42:11', text: 'Hope thou in God: for I shall yet praise him.' },
  { ref: 'Psalm 55:22', text: 'Cast thy burden upon the Lord, and he shall sustain thee.' },
  { ref: 'Psalm 59:16', text: 'I will sing of thy power; yea, I will sing aloud of thy mercy.' },
  { ref: 'Psalm 61:2', text: 'From the end of the earth will I cry unto thee, when my heart is overwhelmed.' },
  { ref: 'Psalm 62:5', text: 'My soul, wait thou only upon God; for my expectation is from him.' },
  { ref: 'Psalm 66:20', text: 'Blessed be God, which hath not turned away my prayer.' },
  { ref: 'Psalm 68:19', text: 'Blessed be the Lord, who daily loadeth us with benefits.' },
  { ref: 'Psalm 71:14', text: 'I will hope continually, and will yet praise thee more and more.' },
  { ref: 'Psalm 73:26', text: 'God is the strength of my heart, and my portion for ever.' },
  { ref: 'Psalm 86:5', text: 'For thou, Lord, art good, and ready to forgive.' },
  { ref: 'Psalm 90:12', text: 'So teach us to number our days, that we may apply our hearts unto wisdom.' },
  { ref: 'Psalm 94:19', text: 'In the multitude of my thoughts within me thy comforts delight my soul.' },
  { ref: 'Psalm 103:2', text: 'Bless the Lord, O my soul, and forget not all his benefits.' },
  { ref: 'Psalm 103:4', text: 'Who redeemeth thy life from destruction; who crowneth thee with lovingkindness.' },
  { ref: 'Psalm 107:1', text: 'O give thanks unto the Lord, for he is good.' },
  { ref: 'Psalm 118:6', text: 'The Lord is on my side; I will not fear.' },
  { ref: 'Psalm 118:14', text: 'The Lord is my strength and song.' },
  { ref: 'Psalm 119:11', text: 'Thy word have I hid in mine heart, that I might not sin against thee.' },
  { ref: 'Psalm 119:50', text: 'This is my comfort in my affliction: for thy word hath quickened me.' },
  { ref: 'Psalm 119:76', text: 'Let, I pray thee, thy merciful kindness be for my comfort.' },
  { ref: 'Psalm 119:165', text: 'Great peace have they which love thy law.' },
  { ref: 'Psalm 121:3', text: 'He will not suffer thy foot to be moved.' },
  { ref: 'Psalm 121:8', text: 'The Lord shall preserve thy going out and thy coming in.' },
  { ref: 'Psalm 138:3', text: 'In the day when I cried thou answeredst me, and strengthenedst me.' },
  { ref: 'Psalm 143:8', text: 'Cause me to hear thy lovingkindness in the morning.' },
  { ref: 'Psalm 145:18', text: 'The Lord is nigh unto all them that call upon him.' },
  { ref: 'Psalm 147:3', text: 'He healeth the broken in heart, and bindeth up their wounds.' },
  { ref: 'Psalm 150:6', text: 'Let every thing that hath breath praise the Lord.' },
  { ref: 'Proverbs 2:6', text: 'The Lord giveth wisdom: out of his mouth cometh knowledge.' },
  { ref: 'Proverbs 4:23', text: 'Keep thy heart with all diligence; for out of it are the issues of life.' },
  { ref: 'Proverbs 12:25', text: 'Heaviness in the heart of man maketh it stoop: but a good word maketh it glad.' },
  { ref: 'Proverbs 14:30', text: 'A sound heart is the life of the flesh.' },
  { ref: 'Proverbs 15:1', text: 'A soft answer turneth away wrath.' },
  { ref: 'Proverbs 15:3', text: 'The eyes of the Lord are in every place.' },
  { ref: 'Proverbs 16:9', text: 'A man\'s heart deviseth his way: but the Lord directeth his steps.' },
  { ref: 'Proverbs 18:10', text: 'The name of the Lord is a strong tower.' },
  { ref: 'Proverbs 20:7', text: 'The just man walketh in his integrity: his children are blessed after him.' },
  { ref: 'Proverbs 22:1', text: 'A good name is rather to be chosen than great riches.' },
  { ref: 'Proverbs 28:26', text: 'He that trusteth in the Lord shall be made fat.' },
  { ref: 'Isaiah 26:4', text: 'Trust ye in the Lord for ever: for in the Lord Jehovah is everlasting strength.' },
  { ref: 'Isaiah 33:2', text: 'Be thou our arm every morning, our salvation also in the time of trouble.' },
  { ref: 'Isaiah 40:29', text: 'He giveth power to the faint; and to them that have no might he increaseth strength.' },
  { ref: 'Isaiah 43:4', text: 'Since thou wast precious in my sight, thou hast been honourable.' },
  { ref: 'Isaiah 49:16', text: 'Behold, I have graven thee upon the palms of my hands.' },
  { ref: 'Isaiah 54:10', text: 'My kindness shall not depart from thee.' },
  { ref: 'Isaiah 55:6', text: 'Seek ye the Lord while he may be found, call ye upon him while he is near.' },
  { ref: 'Isaiah 58:11', text: 'The Lord shall guide thee continually, and satisfy thy soul in drought.' },
  { ref: 'Jeremiah 17:7', text: 'Blessed is the man that trusteth in the Lord.' },
  { ref: 'Jeremiah 31:3', text: 'I have loved thee with an everlasting love.' },
  { ref: 'Lamentations 3:22', text: 'It is of the Lord\'s mercies that we are not consumed.' },
  { ref: 'Lamentations 3:23', text: 'His compassions fail not. They are new every morning.' },
  { ref: 'Nahum 1:7', text: 'The Lord is good, a strong hold in the day of trouble.' },
  { ref: 'Zephaniah 3:17', text: 'The Lord thy God in the midst of thee is mighty; he will save.' },
  { ref: 'Matthew 5:14', text: 'Ye are the light of the world.' },
  { ref: 'Matthew 5:44', text: 'Love your enemies, bless them that curse you.' },
  { ref: 'Matthew 6:33', text: 'Seek ye first the kingdom of God, and his righteousness.' },
  { ref: 'Matthew 7:12', text: 'All things whatsoever ye would that men should do to you, do ye even so to them.' },
  { ref: 'Matthew 18:20', text: 'Where two or three are gathered together in my name, there am I in the midst of them.' },
  { ref: 'Matthew 21:22', text: 'All things, whatsoever ye shall ask in prayer, believing, ye shall receive.' },
  { ref: 'Mark 9:23', text: 'All things are possible to him that believeth.' },
  { ref: 'Mark 10:27', text: 'With God all things are possible.' },
  { ref: 'Mark 11:24', text: 'What things soever ye desire, when ye pray, believe that ye receive them.' },
  { ref: 'Luke 1:37', text: 'With God nothing shall be impossible.' },
  { ref: 'Luke 6:31', text: 'As ye would that men should do to you, do ye also to them likewise.' },
  { ref: 'Luke 6:38', text: 'Give, and it shall be given unto you; good measure, pressed down.' },
  { ref: 'Luke 12:32', text: 'Fear not, little flock; for it is your Father\'s good pleasure to give you the kingdom.' },
  { ref: 'John 1:12', text: 'As many as received him, to them gave he power to become the sons of God.' },
  { ref: 'John 6:35', text: 'I am the bread of life: he that cometh to me shall never hunger.' },
  { ref: 'John 8:12', text: 'I am the light of the world: he that followeth me shall not walk in darkness.' },
  { ref: 'John 10:11', text: 'I am the good shepherd: the good shepherd giveth his life for the sheep.' },
  { ref: 'John 10:28', text: 'I give unto them eternal life; and they shall never perish.' },
  { ref: 'John 11:25', text: 'I am the resurrection, and the life.' },
  { ref: 'John 13:34', text: 'A new commandment I give unto you, That ye love one another.' },
  { ref: 'John 14:1', text: 'Let not your heart be troubled: ye believe in God, believe also in me.' },
  { ref: 'John 14:6', text: 'I am the way, the truth, and the life.' },
  { ref: 'John 15:12', text: 'This is my commandment, That ye love one another, as I have loved you.' },
  { ref: 'John 16:33', text: 'In the world ye shall have tribulation: but be of good cheer; I have overcome the world.' },
  { ref: 'Romans 5:5', text: 'The love of God is shed abroad in our hearts by the Holy Ghost.' },
  { ref: 'Romans 8:31', text: 'If God be for us, who can be against us?' },
  { ref: 'Romans 8:37', text: 'Nay, in all these things we are more than conquerors through him that loved us.' },
  { ref: 'Romans 12:12', text: 'Rejoicing in hope; patient in tribulation; continuing instant in prayer.' },
  { ref: 'Romans 14:8', text: 'Whether we live therefore, or die, we are the Lord\'s.' },
  { ref: '1 Corinthians 13:4', text: 'Charity suffereth long, and is kind.' },
  { ref: '1 Corinthians 13:13', text: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.' },
  { ref: '2 Corinthians 4:16', text: 'Though our outward man perish, yet the inward man is renewed day by day.' },
  { ref: '2 Corinthians 5:7', text: 'We walk by faith, not by sight.' },
  { ref: '2 Corinthians 12:9', text: 'My grace is sufficient for thee: for my strength is made perfect in weakness.' },
  { ref: 'Galatians 5:22', text: 'The fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith.' },
  { ref: 'Galatians 6:9', text: 'Let us not be weary in well doing: for in due season we shall reap.' },
  { ref: 'Ephesians 2:10', text: 'We are his workmanship, created in Christ Jesus unto good works.' },
  { ref: 'Ephesians 4:32', text: 'Be ye kind one to another, tenderhearted, forgiving one another.' },
  { ref: 'Ephesians 6:11', text: 'Put on the whole armour of God, that ye may be able to stand.' },
  { ref: 'Philippians 1:6', text: 'He which hath begun a good work in you will perform it until the day of Jesus Christ.' },
  { ref: 'Philippians 2:13', text: 'For it is God which worketh in you both to will and to do of his good pleasure.' },
  { ref: 'Philippians 4:4', text: 'Rejoice in the Lord alway: and again I say, Rejoice.' },
  { ref: 'Philippians 4:8', text: 'Whatsoever things are true, honest, just, pure, lovely, think on these things.' },
  { ref: 'Philippians 4:19', text: 'My God shall supply all your need according to his riches in glory.' },
  { ref: 'Colossians 3:12', text: 'Put on therefore, as the elect of God, bowels of mercies, kindness, humbleness of mind.' },
  { ref: 'Colossians 3:20', text: 'Children, obey your parents in all things: for this is well pleasing unto the Lord.' },
  { ref: '1 Thessalonians 5:11', text: 'Comfort yourselves together, and edify one another.' },
  { ref: '1 Thessalonians 5:16', text: 'Rejoice evermore.' },
  { ref: '1 Thessalonians 5:17', text: 'Pray without ceasing.' },
  { ref: '2 Thessalonians 3:3', text: 'The Lord is faithful, who shall stablish you, and keep you from evil.' },
  { ref: '1 Timothy 4:12', text: 'Let no man despise thy youth; but be thou an example of the believers.' },
  { ref: '2 Timothy 2:15', text: 'Study to shew thyself approved unto God, a workman that needeth not to be ashamed.' },
  { ref: 'Hebrews 4:16', text: 'Let us therefore come boldly unto the throne of grace.' },
  { ref: 'Hebrews 10:23', text: 'Let us hold fast the profession of our faith without wavering.' },
  { ref: 'Hebrews 12:2', text: 'Looking unto Jesus the author and finisher of our faith.' },
  { ref: 'James 1:5', text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally.' },
  { ref: 'James 1:17', text: 'Every good gift and every perfect gift is from above.' },
  { ref: 'James 4:8', text: 'Draw nigh to God, and he will draw nigh to you.' },
  { ref: '1 Peter 2:9', text: 'Ye are a chosen generation, a royal priesthood, an holy nation.' },
  { ref: '1 Peter 3:15', text: 'Sanctify the Lord God in your hearts: and be ready always to give an answer.' },
  { ref: '1 Peter 4:8', text: 'And above all things have fervent charity among yourselves: for charity shall cover the multitude of sins.' },
  { ref: '1 John 1:9', text: 'If we confess our sins, he is faithful and just to forgive us our sins.' },
  { ref: '1 John 3:1', text: 'Behold, what manner of love the Father hath bestowed upon us.' },
  { ref: '1 John 4:4', text: 'Greater is he that is in you, than he that is in the world.' },
  { ref: '1 John 4:7', text: 'Beloved, let us love one another: for love is of God.' },
  { ref: '1 John 4:18', text: 'There is no fear in love; but perfect love casteth out fear.' },
  { ref: '1 John 5:14', text: 'This is the confidence that we have in him, that, if we ask any thing according to his will, he heareth us.' },
  { ref: 'Revelation 3:20', text: 'Behold, I stand at the door, and knock: if any man hear my voice, I will come in to him.' },
  { ref: 'Psalm 1:1', text: 'Blessed is the man that walketh not in the counsel of the ungodly.' },
  { ref: 'Psalm 4:8', text: 'I will both lay me down in peace, and sleep: for thou, Lord, only makest me dwell in safety.' },
  { ref: 'Psalm 5:3', text: 'My voice shalt thou hear in the morning, O Lord.' },
  { ref: 'Psalm 6:9', text: 'The Lord hath heard my supplication; the Lord will receive my prayer.' },
  { ref: 'Psalm 7:10', text: 'My defence is of God, which saveth the upright in heart.' },
  { ref: 'Psalm 8:2', text: 'Out of the mouth of babes and sucklings hast thou ordained strength.' },
  { ref: 'Psalm 10:17', text: 'Lord, thou hast heard the desire of the humble: thou wilt prepare their heart.' },
  { ref: 'Psalm 11:7', text: 'The righteous Lord loveth righteousness.' },
  { ref: 'Psalm 12:6', text: 'The words of the Lord are pure words.' },
  { ref: 'Psalm 13:5', text: 'I have trusted in thy mercy; my heart shall rejoice in thy salvation.' },
  { ref: 'Psalm 14:5', text: 'God is in the generation of the righteous.' },
  { ref: 'Psalm 17:6', text: 'I have called upon thee, for thou wilt hear me, O God.' },
  { ref: 'Psalm 20:4', text: 'Grant thee according to thine own heart, and fulfil all thy counsel.' },
  { ref: 'Psalm 22:4', text: 'Our fathers trusted in thee: they trusted, and thou didst deliver them.' },
  { ref: 'Psalm 25:4', text: 'Shew me thy ways, O Lord; teach me thy paths.' },
  { ref: 'Psalm 25:5', text: 'Lead me in thy truth, and teach me: for thou art the God of my salvation.' },
  { ref: 'Psalm 26:1', text: 'I have trusted also in the Lord; therefore I shall not slide.' },
  { ref: 'Psalm 29:11', text: 'The Lord will give strength unto his people; the Lord will bless his people with peace.' },
  { ref: 'Psalm 30:5', text: 'Weeping may endure for a night, but joy cometh in the morning.' },
  { ref: 'Psalm 31:3', text: 'For thou art my rock and my fortress; therefore for thy name\'s sake lead me, and guide me.' },
  { ref: 'Psalm 33:18', text: 'Behold, the eye of the Lord is upon them that fear him.' },
  { ref: 'Psalm 34:4', text: 'I sought the Lord, and he heard me, and delivered me from all my fears.' },
  { ref: 'Psalm 34:7', text: 'The angel of the Lord encampeth round about them that fear him, and delivereth them.' },
  { ref: 'Psalm 34:9', text: 'O fear the Lord, ye his saints: for there is no want to them that fear him.' },
  { ref: 'Psalm 35:9', text: 'And my soul shall be joyful in the Lord.' },
  { ref: 'Psalm 36:5', text: 'Thy mercy, O Lord, is in the heavens.' },
  { ref: 'Psalm 37:3', text: 'Trust in the Lord, and do good; so shalt thou dwell in the land.' },
  { ref: 'Psalm 37:7', text: 'Rest in the Lord, and wait patiently for him.' },
  { ref: 'Psalm 37:23', text: 'The steps of a good man are ordered by the Lord.' },
  { ref: 'Psalm 37:25', text: 'I have been young, and now am old; yet have I not seen the righteous forsaken.' },
  { ref: 'Psalm 37:39', text: 'The salvation of the righteous is of the Lord: he is their strength in the time of trouble.' },
  { ref: 'Psalm 40:3', text: 'And he hath put a new song in my mouth, even praise unto our God.' },
  { ref: 'Psalm 40:4', text: 'Blessed is that man that maketh the Lord his trust.' },
  { ref: 'Psalm 41:1', text: 'Blessed is he that considereth the poor: the Lord will deliver him in time of trouble.' },
  { ref: 'Psalm 43:3', text: 'O send out thy light and thy truth: let them lead me.' },
  { ref: 'Psalm 43:4', text: 'Then will I go unto the altar of God, unto God my exceeding joy.' },
  { ref: 'Psalm 44:8', text: 'In God we boast all the day long, and praise thy name for ever.' },
  { ref: 'Psalm 46:7', text: 'The Lord of hosts is with us; the God of Jacob is our refuge.' },
  { ref: 'Psalm 47:1', text: 'O clap your hands, all ye people; shout unto God with the voice of triumph.' },
  { ref: 'Psalm 48:14', text: 'For this God is our God for ever and ever: he will be our guide even unto death.' },
  { ref: 'Psalm 50:15', text: 'Call upon me in the day of trouble: I will deliver thee.' },
  { ref: 'Psalm 51:10', text: 'Create in me a clean heart, O God; and renew a right spirit within me.' },
  { ref: 'Psalm 52:8', text: 'I am like a green olive tree in the house of God: I trust in the mercy of God for ever and ever.' },
  { ref: 'Psalm 54:4', text: 'Behold, God is mine helper: the Lord is with them that uphold my soul.' },
  { ref: 'Psalm 55:16', text: 'As for me, I will call upon God; and the Lord shall save me.' },
  { ref: 'Psalm 56:4', text: 'In God I will praise his word, in God I have put my trust; I will not fear what flesh can do unto me.' },
  { ref: 'Psalm 57:2', text: 'I will cry unto God most high; unto God that performeth all things for me.' },
  { ref: 'Psalm 59:9', text: 'Because of his strength will I wait upon thee: for God is my defence.' },
  { ref: 'Psalm 59:17', text: 'Unto thee, O my strength, will I sing: for God is my defence.' },
  { ref: 'Psalm 61:3', text: 'For thou hast been a shelter for me, and a strong tower from the enemy.' },
  { ref: 'Psalm 62:1', text: 'Truly my soul waiteth upon God: from him cometh my salvation.' },
  { ref: 'Psalm 62:6', text: 'He only is my rock and my salvation: he is my defence.' },
  { ref: 'Psalm 63:1', text: 'O God, thou art my God; early will I seek thee.' },
  { ref: 'Psalm 63:3', text: 'Because thy lovingkindness is better than life, my lips shall praise thee.' },
  { ref: 'Psalm 64:10', text: 'The righteous shall be glad in the Lord, and shall trust in him.' },
  { ref: 'Psalm 65:4', text: 'Blessed is the man whom thou choosest, and causest to approach unto thee.' },
  { ref: 'Psalm 66:8', text: 'O bless our God, ye people, and make the voice of his praise to be heard.' },
  { ref: 'Psalm 67:1', text: 'God be merciful unto us, and bless us; and cause his face to shine upon us.' },
  { ref: 'Psalm 68:35', text: 'O God, thou art terrible out of thy holy places: the God of Israel is he that giveth strength and power unto his people.' },
  { ref: 'Psalm 69:32', text: 'The humble shall see this, and be glad: and your heart shall live that seek God.' },
  { ref: 'Psalm 70:4', text: 'Let all those that seek thee rejoice and be glad in thee.' },
  { ref: 'Psalm 71:5', text: 'For thou art my hope, O Lord God: thou art my trust from my youth.' },
  { ref: 'Psalm 71:8', text: 'Let my mouth be filled with thy praise and with thy honour all the day.' },
  { ref: 'Psalm 72:18', text: 'Blessed be the Lord God, the God of Israel, who only doeth wondrous things.' },
  { ref: 'Psalm 74:12', text: 'For God is my King of old, working salvation in the midst of the earth.' },
  { ref: 'Psalm 75:1', text: 'Unto thee, O God, do we give thanks, unto thee do we give thanks.' },
  { ref: 'Psalm 76:4', text: 'Thou art more glorious and excellent than the mountains of prey.' },
  { ref: 'Psalm 77:14', text: 'Thou art the God that doest wonders: thou hast declared thy strength among the people.' },
  { ref: 'Psalm 78:4', text: 'We will not hide them from their children, shewing to the generation to come the praises of the Lord.' },
  { ref: 'Psalm 79:13', text: 'So we thy people and sheep of thy pasture will give thee thanks for ever.' },
  { ref: 'Psalm 80:3', text: 'Turn us again, O God, and cause thy face to shine; and we shall be saved.' },
  { ref: 'Psalm 81:10', text: 'I am the Lord thy God, which brought thee out of the land of Egypt: open thy mouth wide, and I will fill it.' },
  { ref: 'Psalm 82:3', text: 'Defend the poor and fatherless: do justice to the afflicted and needy.' },
  { ref: 'Psalm 84:11', text: 'For the Lord God is a sun and shield: the Lord will give grace and glory.' },
  { ref: 'Psalm 85:6', text: 'Wilt thou not revive us again: that thy people may rejoice in thee?' },
  { ref: 'Psalm 86:15', text: 'But thou, O Lord, art a God full of compassion, and gracious, longsuffering, and plenteous in mercy and truth.' },
  { ref: 'Psalm 87:3', text: 'Glorious things are spoken of thee, O city of God.' },
  { ref: 'Psalm 88:13', text: 'But unto thee have I cried, O Lord; and in the morning shall my prayer prevent thee.' },
  { ref: 'Psalm 89:1', text: 'I will sing of the mercies of the Lord for ever.' },
  { ref: 'Psalm 89:15', text: 'Blessed is the people that know the joyful sound: they shall walk, O Lord, in the light of thy countenance.' },
  { ref: 'Psalm 90:2', text: 'Before the mountains were brought forth, or ever thou hadst formed the earth and the world, even from everlasting to everlasting, thou art God.' },
  { ref: 'Psalm 90:14', text: 'O satisfy us early with thy mercy; that we may rejoice and be glad all our days.' },
  { ref: 'Psalm 91:1', text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.' },
  { ref: 'Psalm 91:2', text: 'I will say of the Lord, He is my refuge and my fortress: my God; in him will I trust.' },
  { ref: 'Psalm 92:1', text: 'It is a good thing to give thanks unto the Lord, and to sing praises unto thy name, O most High.' },
  { ref: 'Psalm 92:4', text: 'For thou, Lord, hast made me glad through thy work.' },
  { ref: 'Psalm 93:4', text: 'The Lord on high is mightier than the noise of many waters.' },
  { ref: 'Psalm 94:18', text: 'When I said, My foot slippeth; thy mercy, O Lord, held me up.' },
  { ref: 'Psalm 95:1', text: 'O come, let us sing unto the Lord: let us make a joyful noise to the rock of our salvation.' },
  { ref: 'Psalm 95:7', text: 'For he is our God; and we are the people of his pasture, and the sheep of his hand.' },
  { ref: 'Psalm 96:1', text: 'O sing unto the Lord a new song: sing unto the Lord, all the earth.' },
  { ref: 'Psalm 96:2', text: 'Sing unto the Lord, bless his name; shew forth his salvation from day to day.' },
  { ref: 'Psalm 97:11', text: 'Light is sown for the righteous, and gladness for the upright in heart.' },
  { ref: 'Psalm 98:1', text: 'O sing unto the Lord a new song; for he hath done marvellous things.' },
  { ref: 'Psalm 99:2', text: 'The Lord is great in Zion; and he is high above all the people.' },
  { ref: 'Psalm 100:1', text: 'Make a joyful noise unto the Lord, all ye lands.' },
  { ref: 'Psalm 100:2', text: 'Serve the Lord with gladness: come before his presence with singing.' },
  { ref: 'Psalm 100:3', text: 'Know ye that the Lord he is God: it is he that hath made us, and not we ourselves.' },
  { ref: 'Psalm 100:4', text: 'Enter into his gates with thanksgiving, and into his courts with praise.' },
  { ref: 'Psalm 101:1', text: 'I will sing of mercy and judgment: unto thee, O Lord, will I sing.' },
  { ref: 'Psalm 102:17', text: 'He will regard the prayer of the destitute, and not despise their prayer.' },
  { ref: 'Psalm 103:1', text: 'Bless the Lord, O my soul: and all that is within me, bless his holy name.' },
  { ref: 'Psalm 103:3', text: 'Who forgiveth all thine iniquities; who healeth all thy diseases.' },
  { ref: 'Psalm 103:5', text: 'Who satisfieth thy mouth with good things; so that thy youth is renewed like the eagle\'s.' },
  { ref: 'Psalm 103:8', text: 'The Lord is merciful and gracious, slow to anger, and plenteous in mercy.' },
  { ref: 'Psalm 103:11', text: 'For as the heaven is high above the earth, so great is his mercy toward them that fear him.' },
  { ref: 'Psalm 103:12', text: 'As far as the east is from the west, so far hath he removed our transgressions from us.' },
  { ref: 'Psalm 103:17', text: 'But the mercy of the Lord is from everlasting to everlasting upon them that fear him.' },
  { ref: 'Psalm 104:1', text: 'Bless the Lord, O my soul. O Lord my God, thou art very great.' },
  { ref: 'Psalm 104:33', text: 'I will sing unto the Lord as long as I live: I will sing praise to my God while I have my being.' },
  { ref: 'Psalm 105:1', text: 'O give thanks unto the Lord; call upon his name: make known his deeds among the people.' },
  { ref: 'Psalm 106:1', text: 'Praise ye the Lord. O give thanks unto the Lord; for he is good.' },
  { ref: 'Psalm 107:8', text: 'Oh that men would praise the Lord for his goodness, and for his wonderful works to the children of men!' },
  { ref: 'Psalm 107:9', text: 'For he satisfieth the longing soul, and filleth the hungry soul with goodness.' },
  { ref: 'Psalm 108:1', text: 'O God, my heart is fixed; I will sing and give praise, even with my glory.' },
  { ref: 'Psalm 108:4', text: 'For thy mercy is great above the heavens: and thy truth reacheth unto the clouds.' },
  { ref: 'Psalm 109:30', text: 'I will greatly praise the Lord with my mouth; yea, I will praise him among the multitude.' },
  { ref: 'Psalm 111:1', text: 'Praise ye the Lord. I will praise the Lord with my whole heart.' },
  { ref: 'Psalm 111:4', text: 'He hath made his wonderful works to be remembered: the Lord is gracious and full of compassion.' },
  { ref: 'Psalm 112:1', text: 'Praise ye the Lord. Blessed is the man that feareth the Lord.' },
  { ref: 'Psalm 112:4', text: 'Unto the upright there ariseth light in the darkness: he is gracious, and full of compassion, and righteous.' },
  { ref: 'Psalm 113:2', text: 'Blessed be the name of the Lord from this time forth and for evermore.' },
  { ref: 'Psalm 113:3', text: 'From the rising of the sun unto the going down of the same the Lord\'s name is to be praised.' },
  { ref: 'Psalm 114:7', text: 'Tremble, thou earth, at the presence of the Lord, at the presence of the God of Jacob.' },
  { ref: 'Psalm 115:12', text: 'The Lord hath been mindful of us: he will bless us.' },
  { ref: 'Psalm 116:1', text: 'I love the Lord, because he hath heard my voice and my supplications.' },
  { ref: 'Psalm 116:2', text: 'Because he hath inclined his ear unto me, therefore will I call upon him as long as I live.' },
  { ref: 'Psalm 116:5', text: 'Gracious is the Lord, and righteous; yea, our God is merciful.' },
  { ref: 'Psalm 116:7', text: 'Return unto thy rest, O my soul; for the Lord hath dealt bountifully with thee.' },
  { ref: 'Psalm 117:1', text: 'O praise the Lord, all ye nations: praise him, all ye people.' },
  { ref: 'Psalm 117:2', text: 'For his merciful kindness is great toward us: and the truth of the Lord endureth for ever.' },
  { ref: 'Psalm 118:1', text: 'O give thanks unto the Lord; for he is good: because his mercy endureth for ever.' },
  { ref: 'Psalm 118:5', text: 'I called upon the Lord in distress: the Lord answered me, and set me in a large place.' },
  { ref: 'Psalm 118:8', text: 'It is better to trust in the Lord than to put confidence in man.' },
  { ref: 'Psalm 118:17', text: 'I shall not die, but live, and declare the works of the Lord.' },
  { ref: 'Psalm 118:21', text: 'I will praise thee: for thou hast heard me, and art become my salvation.' },
  { ref: 'Psalm 118:23', text: 'This is the Lord\'s doing; it is marvellous in our eyes.' },
  { ref: 'Psalm 118:28', text: 'Thou art my God, and I will praise thee: thou art my God, I will exalt thee.' },
  { ref: 'Psalm 118:29', text: 'O give thanks unto the Lord; for he is good: for his mercy endureth for ever.' },
  { ref: 'Psalm 119:9', text: 'Wherewithal shall a young man cleanse his way? by taking heed thereto according to thy word.' },
  { ref: 'Psalm 119:18', text: 'Open thou mine eyes, that I may behold wondrous things out of thy law.' },
  { ref: 'Psalm 119:27', text: 'Make me to understand the way of thy precepts: so shall I talk of thy wondrous works.' },
  { ref: 'Psalm 119:28', text: 'My soul melteth for heaviness: strengthen thou me according unto thy word.' },
  { ref: 'Psalm 119:32', text: 'I will run the way of thy commandments, when thou shalt enlarge my heart.' },
  { ref: 'Psalm 119:45', text: 'And I will walk at liberty: for I seek thy precepts.' },
  { ref: 'Psalm 119:65', text: 'Thou hast dealt well with thy servant, O Lord, according unto thy word.' },
  { ref: 'Psalm 119:67', text: 'Before I was afflicted I went astray: but now have I kept thy word.' },
  { ref: 'Psalm 119:68', text: 'Thou art good, and doest good; teach me thy statutes.' },
  { ref: 'Psalm 119:73', text: 'Thy hands have made me and fashioned me: give me understanding, that I may learn thy commandments.' },
  { ref: 'Psalm 119:89', text: 'For ever, O Lord, thy word is settled in heaven.' },
  { ref: 'Psalm 119:93', text: 'I will never forget thy precepts: for with them thou hast quickened me.' },
  { ref: 'Psalm 119:97', text: 'O how love I thy law! it is my meditation all the day.' },
  { ref: 'Psalm 119:103', text: 'How sweet are thy words unto my taste! yea, sweeter than honey to my mouth!' },
  { ref: 'Psalm 119:114', text: 'Thou art my hiding place and my shield: I hope in thy word.' },
  { ref: 'Psalm 119:116', text: 'Uphold me according unto thy word, that I may live: and let me not be ashamed of my hope.' },
  { ref: 'Psalm 119:130', text: 'The entrance of thy words giveth light; it giveth understanding unto the simple.' },
  { ref: 'Psalm 119:133', text: 'Order my steps in thy word: and let not any iniquity have dominion over me.' },
  { ref: 'Psalm 119:140', text: 'Thy word is very pure: therefore thy servant loveth it.' },
  { ref: 'Psalm 119:160', text: 'Thy word is true from the beginning: and every one of thy righteous judgments endureth for ever.' },
  { ref: 'Psalm 119:162', text: 'I rejoice at thy word, as one that findeth great spoil.' },
  { ref: 'Psalm 119:175', text: 'Let my soul live, and it shall praise thee; and let thy judgments help me.' },
  { ref: 'Psalm 121:4', text: 'Behold, he that keepeth Israel shall neither slumber nor sleep.' },
  { ref: 'Psalm 121:5', text: 'The Lord is thy keeper: the Lord is thy shade upon thy right hand.' },
  { ref: 'Psalm 121:6', text: 'The sun shall not smite thee by day, nor the moon by night.' },
  { ref: 'Psalm 124:8', text: 'Our help is in the name of the Lord, who made heaven and earth.' },
  { ref: 'Psalm 125:1', text: 'They that trust in the Lord shall be as mount Zion, which cannot be removed.' },
  { ref: 'Psalm 126:2', text: 'Then was our mouth filled with laughter, and our tongue with singing.' },
  { ref: 'Psalm 126:3', text: 'The Lord hath done great things for us; whereof we are glad.' },
  { ref: 'Psalm 127:2', text: 'It is vain for you to rise up early, to sit up late: for so he giveth his beloved sleep.' },
  { ref: 'Psalm 128:1', text: 'Blessed is every one that feareth the Lord; that walketh in his ways.' },
  { ref: 'Psalm 130:5', text: 'I wait for the Lord, my soul doth wait, and in his word do I hope.' },
  { ref: 'Psalm 130:7', text: 'Let Israel hope in the Lord: for with the Lord there is mercy.' },
  { ref: 'Psalm 131:3', text: 'Let Israel hope in the Lord from henceforth and for ever.' },
  { ref: 'Psalm 133:1', text: 'Behold, how good and how pleasant it is for brethren to dwell together in unity!' },
  { ref: 'Psalm 134:2', text: 'Lift up your hands in the sanctuary, and bless the Lord.' },
  { ref: 'Psalm 135:3', text: 'Praise the Lord; for the Lord is good: sing praises unto his name; for it is pleasant.' },
  { ref: 'Psalm 136:1', text: 'O give thanks unto the Lord; for he is good: for his mercy endureth for ever.' },
  { ref: 'Psalm 138:7', text: 'Though I walk in the midst of trouble, thou wilt revive me.' },
  { ref: 'Psalm 139:17', text: 'How precious also are thy thoughts unto me, O God! how great is the sum of them!' },
  { ref: 'Psalm 145:14', text: 'The Lord upholdeth all that fall, and raiseth up all those that be bowed down.' }
];

  const KIDS_PRAYERS = [
    'Hey God, make me strong like Jesus today!',
    'Thanks for being my shepherd—keep me safe!',
    'God, help me be brave like Joshua!',
    'Jesus, let me run to you every day!',
    'Shine your light on my path, Lord!',
    'Give me power to do what\'s right!',
    'You\'re with me—no fear!',
    'I trust you, God—with everything!',
    'Fight my battles for me, Lord!',
    'Turn every hard thing into good!',
    'Help me be quiet and know you\'re God!',
    'Thanks for feeding the birds—feed me too!',
    'Fill me with your peace, Jesus!',
    'When I\'m scared, I\'ll trust you!',
    'Help me work hard like it\'s for you!',
    'Thanks for making me awesome!',
    'I know you have big plans for me!',
    'Let me hear your words every day!',
    'You taste so good, Lord!',
    'No fear—just your power!',
    'You\'re good forever—yay!',
    'You\'re my helper—no worries!',
    'Make my heart happy in you!',
    'I give you my worries—you care!',
    'Lift my eyes up—help\'s coming!',
    'Let my light shine bright!',
    'You\'re my rock—I\'m safe!',
    'Wait on you—I\'ll fly high!',
    'Make me laugh and feel better!',
    'Show me the best path, God!',
    'Thank You for this day—help me rejoice!',
    'Jesus, I love You because You first loved me!',
    'God, You are my safe place. Thank You!',
    'Lord, fill me with joy and strength today!',
    'Lord, You are my light. I am not afraid!',
    'Thank You, God, for loving the whole world!',
    'God, help me do good and seek peace!',
    'God, being with You makes me so happy!',
    'God, I come to You when I am tired. Thank You!',
    'Lord, help me follow Your way!',
    'Lord, keep me safe from evil today!',
    'Jesus, help me stand strong in the faith!',
    'God, fill me with joy and peace today!',
    'Thank You for Your angels watching over me!',
    'Jesus, help me have faith in what I cannot see!',
    'Lord, I give You my worries. You care for me!',
    'Hey God, give me perfect peace when I think on You!',
    'Nothing can separate me from Your love—thanks!',
    'Help me wait and be brave, Lord!',
    'I\'ll pray about everything—no worries!',
    'Your peace guards my heart—thank You!',
    'Show me the way to go, God!',
    'I give You my plans—guide my thoughts!',
    'I trust You with my path, Lord!',
    'You\'re with me through deep waters—thanks!',
    'You\'re good to everyone—yay!',
    'You\'re like a loving Dad—thank You!',
    'I\'ll ask and seek—You answer!',
    'I\'ll praise You with my whole heart!',
    'Let my words be good, Lord!',
    'You\'re my strength and shield—thanks!',
    'Make me brave and strong, God!',
    'Your word is right and true!',
    'I\'ll wait for You, Lord—You hear me!',
    'I\'ll hope in You and praise You!',
    'I give You my burdens—You hold me!',
    'I\'ll sing of Your power and mercy!',
    'When I\'m overwhelmed, I cry to You!',
    'I wait on You alone, God!',
    'You hear my prayers—bless You!',
    'You load me with good things every day!',
    'I\'ll hope and praise You more and more!',
    'You\'re the strength of my heart forever!',
    'You\'re good and ready to forgive!',
    'Teach me to use my days wisely!',
    'Your comfort makes my soul happy!',
    'I won\'t forget all Your benefits!',
    'You crown me with love—thanks!',
    'Thanks for being good, Lord!',
    'You\'re on my side—I won\'t fear!',
    'You\'re my strength and my song!',
    'Help me hide Your word in my heart!',
    'Your word gives me comfort!',
    'Show me Your mercy, Lord!',
    'I love Your law—great peace!',
    'You won\'t let my foot slip!',
    'Keep my going out and coming in!',
    'You answered when I cried—thanks!',
    'Let me hear Your love in the morning!',
    'You\'re near when I call—yay!',
    'Heal broken hearts, Lord—including mine!',
    'Let everything that breathes praise You!',
    'Give me wisdom, Lord!',
    'Help me guard my heart!',
    'A good word makes me glad!',
    'Keep my heart healthy, God!',
    'Help me give soft answers!',
    'Your eyes see everything—You\'re with me!',
    'Direct my steps, Lord!',
    'Your name is my strong tower!',
    'Bless my family, God!',
    'Help me choose a good name!',
    'I trust You—You make me strong!',
    'You\'re my strength forever!',
    'Be my arm every morning, Lord!',
    'Give power to the weak—that\'s me sometimes!',
    'I\'m precious to You—thanks!',
    'You\'ve got me written on Your hands!',
    'Your kindness never leaves me!',
    'Help me seek You while I can!',
    'Guide me and fill me up, Lord!',
    'Blessed are those who trust You!',
    'You love me with an everlasting love!',
    'Your mercies are new every morning!',
    'You\'re my strong hold in trouble!',
    'You\'re mighty to save—thank You!',
    'I\'m the light of the world—help me shine!',
    'Help me love my enemies, Jesus!',
    'I\'ll seek Your kingdom first!',
    'Help me treat others like I want to be treated!',
    'You\'re with us when we gather—thanks!',
    'I believe—give me what I ask!',
    'All things are possible with You!',
    'With You nothing is impossible!',
    'I\'ll pray and believe, Lord!',
    'Help me do to others as I\'d want done!',
    'I\'ll give—You give back more!',
    'Don\'t fear, little flock—thanks!',
    'I received You—I\'m Your child!',
    'You\'re the bread of life—I\'ll never hunger!',
    'You\'re the light—I won\'t walk in darkness!',
    'You\'re my good shepherd—thanks!',
    'You give eternal life—I\'ll never perish!',
    'You\'re the resurrection and the life!',
    'Help me love others like You said!',
    'Don\'t let my heart be troubled!',
    'You\'re the way, truth, and life!',
    'Help me love others as You loved me!',
    'You overcame the world—I can be brave!',
    'Your love is in my heart!',
    'If You\'re for me, who can be against me?',
    'I\'m more than a conqueror through You!',
    'Help me rejoice in hope and pray!',
    'I\'m Yours whether I live or die!',
    'Love is patient and kind—help me be that!',
    'Faith, hope, love—greatest is love!',
    'Renew me inside every day!',
    'I walk by faith, not by sight!',
    'Your grace is enough when I\'m weak!',
    'Fill me with Your fruit—love, joy, peace!',
    'Don\'t let me get tired of doing good!',
    'I\'m Your workmanship—made for good works!',
    'Help me be kind and forgiving!',
    'I\'ll put on Your armor, Lord!',
    'You\'ll finish the good work in me!',
    'You work in me to do Your will!',
    'I\'ll rejoice in You always!',
    'Help me think on good things!',
    'You supply all I need—thanks!',
    'Clothe me with mercy and kindness!',
    'Help me obey my parents!',
    'Comfort and build up others!',
    'I\'ll rejoice evermore!',
    'Help me pray without ceasing!',
    'You\'re faithful to keep me from evil!',
    'I\'m young but I can be an example!',
    'Help me study to please You!',
    'I\'ll come boldly to Your throne!',
    'I\'ll hold fast to my faith!',
    'I\'m looking to Jesus!',
    'Give me wisdom when I ask!',
    'Every good gift is from You!',
    'Draw near to me as I draw near to You!',
    'I\'m chosen and special—thanks!',
    'Help me be ready to share about You!',
    'Let me love others a lot!',
    'You forgive when I confess—thanks!',
    'What amazing love You\'ve given me!',
    'Greater are You in me than the world!',
    'Help me love others—love is from You!',
    'Perfect love casts out fear!',
    'You hear when I ask according to Your will!',
    'You\'re knocking—I\'ll let You in!',
    'Help me walk in Your ways!',
    'I\'ll sleep in peace—You keep me safe!',
    'You hear my voice in the morning!',
    'You receive my prayer—thanks!',
    'You save the upright—thank You!',
    'Even kids can show Your strength!',
    'You hear the humble—prepare my heart!',
    'You love righteousness!',
    'Your words are pure!',
    'I trust Your mercy—my heart rejoices!',
    'You\'re with the righteous!',
    'You hear me when I call!',
    'Grant my heart\'s desires!',
    'My family trusted You—You delivered!',
    'Show me Your ways, Lord!',
    'Lead me in Your truth!',
    'I trust You—I won\'t slip!',
    'Give strength and peace to Your people!',
    'Joy comes in the morning!',
    'You\'re my rock and fortress!',
    'Your eye is on those who fear You!',
    'You delivered me from my fears!',
    'Your angel camps around me!',
    'There\'s no want for those who fear You!',
    'My soul is joyful in You!',
    'Your mercy is huge!',
    'I\'ll trust You and do good!',
    'I\'ll rest and wait for You!',
    'You order my steps!',
    'You never forsake the righteous!',
    'You save the righteous!',
    'You put a new song in my mouth!',
    'Blessed is the one who trusts You!',
    'Bless those who care for the poor!',
    'Send Your light and truth to lead me!',
    'You\'re my exceeding joy!',
    'I\'ll praise Your name all day!',
    'You\'re my God forever—my guide!',
    'I\'ll call on You in trouble!',
    'Create a clean heart in me!',
    'I trust Your mercy forever!',
    'You\'re my helper!',
    'I\'ll call on You—You\'ll save me!',
    'I won\'t fear what people can do!',
    'You perform all things for me!',
    'You\'re my defence—I\'ll wait on You!',
    'I\'ll sing to You—You\'re my strength!',
    'You\'re my shelter and strong tower!',
    'My salvation comes from You!',
    'You\'re my rock and salvation!',
    'I\'ll seek You early!',
    'Your love is better than life!',
    'The righteous trust in You!',
    'You choose me to come near!',
    'Bless our God, everyone!',
    'You give strength to Your people!',
    'The humble seek You and live!',
    'Let those who seek You rejoice!',
    'You\'re my hope from my youth!',
    'Fill my mouth with Your praise!',
    'You do wondrous things!',
    'You work salvation!',
    'I give You thanks!',
    'You\'re glorious and excellent!',
    'You do wonders!',
    'We\'ll tell the next generation Your praise!',
    'We\'re Your sheep—thanks forever!',
    'Shine on us and save us!',
    'Open my mouth and fill it!',
    'Defend the poor and needy!',
    'You\'re my sun and shield!',
    'Revive us that we may rejoice!',
    'You\'re full of compassion!',
    'Glorious things are spoken of You!',
    'I cry to You in the morning!',
    'I\'ll sing of Your mercies forever!',
    'Blessed are those who know Your joy!',
    'You\'re God from everlasting!',
    'Satisfy us with Your mercy!',
    'I dwell in Your secret place!',
    'You\'re my refuge and fortress!',
    'It\'s good to give You thanks!',
    'You\'ve made me glad!',
    'You\'re mightier than the waters!',
    'Your mercy held me up!',
    'Let\'s sing to You!',
    'We\'re the sheep of Your hand!',
    'Sing to You a new song!',
    'Bless Your name—show Your salvation!',
    'Light and gladness for the upright!',
    'You\'ve done marvellous things!',
    'You\'re great and high above all!',
    'Make a joyful noise!',
    'Serve You with gladness!',
    'You made us—we\'re Yours!',
    'Enter with thanksgiving!',
    'I\'ll sing of mercy to You!',
    'You regard the prayer of the needy!',
    'Bless You, O my soul!',
    'You forgive and heal!',
    'You satisfy with good things!',
    'You\'re merciful and gracious!',
    'Your mercy is as high as heaven!',
    'You\'ve removed my sins far away!',
    'Your mercy is everlasting!',
    'You\'re very great!',
    'I\'ll sing to You as long as I live!',
    'Give thanks and make known Your deeds!',
    'Praise You—You\'re good!',
    'Praise You for Your wonderful works!',
    'You satisfy the hungry soul!',
    'My heart is fixed—I\'ll sing!',
    'Your mercy is great!',
    'I\'ll praise You with my mouth!',
    'I\'ll praise You with my whole heart!',
    'You\'re gracious and full of compassion!',
    'Blessed is the one who fears You!',
    'Light rises for the upright!',
    'Blessed be Your name forever!',
    'Your name is to be praised!',
    'You\'re mindful of us!',
    'I love You because You heard me!',
    'I\'ll call on You as long as I live!',
    'You\'re gracious and merciful!',
    'Return to rest—You\'ve been good!',
    'Praise You, all nations!',
    'Your kindness is great!',
    'Thanks—You\'re good!',
    'You answered me in distress!',
    'Better to trust You than people!',
    'I\'ll live and declare Your works!',
    'You heard me—You\'re my salvation!',
    'This is Your doing—marvellous!',
    'You\'re my God—I\'ll praise You!',
    'Thanks—Your mercy endures forever!',
    'Help me cleanse my way by Your word!',
    'Open my eyes to see Your wonders!',
    'Help me understand Your precepts!',
    'Strengthen me according to Your word!',
    'Enlarge my heart to run Your way!',
    'I\'ll walk in liberty—I seek Your precepts!',
    'You\'ve dealt well with me!',
    'I\'ve kept Your word now!',
    'You\'re good—teach me!',
    'You made me—give me understanding!',
    'Your word is settled forever!',
    'I won\'t forget Your precepts!',
    'I love Your law—I meditate all day!',
    'Your words are sweeter than honey!',
    'You\'re my hiding place and shield!',
    'Uphold me according to Your word!',
    'Your words give light!',
    'Order my steps in Your word!',
    'Your word is very pure!',
    'Your word is true forever!',
    'I rejoice at Your word!',
    'Let my soul live and praise You!',
    'You never sleep—You keep Israel!',
    'You\'re my keeper and my shade!',
    'Sun and moon won\'t hurt me!',
    'Our help is in Your name!',
    'Those who trust You won\'t be moved!',
    'Our mouth filled with laughter!',
    'You\'ve done great things for us!',
    'You give Your beloved sleep!',
    'Blessed are those who fear You!',
    'I wait for You—I hope in Your word!',
    'With You there is mercy!',
    'Israel hopes in You forever!',
    'How good when we dwell together!',
    'Lift my hands and bless You!',
    'Praise You—You\'re good!',
    'Thanks—Your mercy endures forever!',
    'Revive me when I\'m in trouble!',
    'Your thoughts toward me are precious!',
    'You lift up those who fall!',
    'Help me walk in wisdom today!',
    'You\'re my portion forever!',
    'Fill me with Your Spirit\'s fruit!',
    'I\'ll trust You with my whole heart!',
    'You\'re my deliverer—thanks!',
    'Keep me in perfect peace!'
  ];

  const BADGES = [
    { id: 'faith-fighter', label: 'Faith Fighter', days: 1 },
    { id: 'bible-boss', label: 'Bible Boss', days: 3 },
    { id: 'faith-hero', label: 'Faith Hero', days: 7 },
    { id: 'brave-heart', label: 'Brave Heart', days: 14 }
  ];

  const KIDS_REMIND_OPTED_KEY = 'kidsRemindOpted';
  const FAITH_TRAIL_STOPS = [
    { day: 1, icon: '🌟', label: 'Day 1' },
    { day: 2, icon: '💪', label: 'Day 2' },
    { day: 3, icon: '📖', label: 'Day 3' },
    { day: 4, icon: '🙏', label: 'Day 4' },
    { day: 5, icon: '❤️', label: 'Day 5' },
    { day: 6, icon: '⚔️', label: 'Day 6' },
    { day: 7, icon: '🏆', label: 'Day 7' }
  ];

  function getDailyKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function getNextVerseIndex() {
    var index = 0;
    try {
      index = parseInt(localStorage.getItem(KIDS_VERSE_INDEX_KEY), 10) || 0;
    } catch (e) {}
    return index % KIDS_VERSES.length;
  }

  function getStreakData() {
    try {
      const raw = localStorage.getItem(KIDS_STREAK_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function saveStreakData(data) {
    try { localStorage.setItem(KIDS_STREAK_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function markTodayDone() {
    const today = getDailyKey();
    const data = getStreakData();
    const last = data.lastKey || '';
    const count = Number(data.count || 0);
    let nextCount = count;
    if (last !== today) {
      nextCount = last ? count + 1 : 1;
    }
    saveStreakData({ lastKey: today, count: nextCount });
    return nextCount;
  }

  function isDoneToday() {
    const data = getStreakData();
    return data.lastKey === getDailyKey();
  }

  function getCurrentStreak() {
    const data = getStreakData();
    return Number(data.count || 0);
  }

  function didMissYesterday() {
    const data = getStreakData();
    const last = data.lastKey || '';
    if (!last) return false;
    const lastDate = new Date(last + 'T12:00:00');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return lastDate.getTime() < yesterday.setHours(0, 0, 0, 0);
  }

  function renderVerseAndPrayer() {
    var index = getNextVerseIndex();
    var v = KIDS_VERSES[index];
    var p = KIDS_PRAYERS[index];
    var refEl = document.getElementById('kids-verse-ref');
    var textEl = document.getElementById('kids-verse-text');
    var prayerEl = document.getElementById('kids-prayer-text');
    if (refEl) refEl.textContent = v.ref;
    if (textEl) textEl.textContent = v.text;
    if (prayerEl) prayerEl.textContent = p;
    try {
      localStorage.setItem(KIDS_VERSE_INDEX_KEY, String((index + 1) % KIDS_VERSES.length));
    } catch (e) {}
  }

  function renderStreak() {
    const streak = getCurrentStreak();
    const el = document.getElementById('kids-streak-display');
    if (el) {
      el.textContent = streak >= 1
        ? '🔥 ' + streak + ' day' + (streak === 1 ? '' : 's') + ' — keep going!'
        : '🔥 0 days — start today!';
    }
  }

  function renderDoneState() {
    const done = isDoneToday();
    const btn = document.getElementById('kids-mark-done');
    const msg = document.getElementById('kids-done-msg');
    if (btn) {
      btn.disabled = done;
      btn.textContent = done ? 'Completed Today ✓' : 'I Did It Today!';
    }
    if (msg) msg.classList.toggle('hidden', !done);
  }

  function renderComeBackNudge() {
    const nudge = document.getElementById('kids-come-back-nudge');
    const remindBtn = document.getElementById('kids-remind-btn');
    if (!nudge) return;
    const missed = didMissYesterday();
    const streak = getCurrentStreak();
    nudge.classList.toggle('hidden', !missed || streak === 0);
    if (remindBtn) {
      const opted = !!localStorage.getItem(KIDS_REMIND_OPTED_KEY);
      remindBtn.textContent = opted ? '🔔 Reminders on' : '🔔 Remind me when I miss a day';
      remindBtn.classList.toggle('opted', opted);
    }
  }

  function wireRemindBtn() {
    const btn = document.getElementById('kids-remind-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (localStorage.getItem(KIDS_REMIND_OPTED_KEY)) return;
      if (!('Notification' in window)) return;
      Notification.requestPermission().then(function (perm) {
        if (perm === 'granted') {
          localStorage.setItem(KIDS_REMIND_OPTED_KEY, '1');
          renderComeBackNudge();
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js').then(function () {
              return navigator.serviceWorker.ready;
            }).then(function (reg) {
              if (reg.pushManager && window.TDB_CONFIG && window.TDB_CONFIG.VAPID_PUBLIC_KEY) {
                try {
                  var key = window.TDB_CONFIG.VAPID_PUBLIC_KEY;
                  var padding = '='.repeat((4 - key.length % 4) % 4);
                  var base64Url = (key + padding).replace(/-/g, '+').replace(/_/g, '/');
                  var raw = atob(base64Url);
                  var arr = new Uint8Array(raw.length);
                  for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
                  return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: arr });
                } catch (e) {}
              }
            }).catch(function () {});
          }
        }
      });
    });
  }

  function renderBadges(prevStreak) {
    const streak = getCurrentStreak();
    const list = document.getElementById('kids-badges-list');
    if (!list) return;
    list.innerHTML = '';
    BADGES.forEach(function (b) {
      const wasLocked = (prevStreak || 0) < b.days;
      const nowUnlocked = streak >= b.days;
      const span = document.createElement('span');
      span.className = 'kids-badge ' + b.id + (nowUnlocked ? '' : ' locked');
      span.textContent = (nowUnlocked ? '★ ' : '☆ ') + b.label;
      span.title = nowUnlocked ? 'Unlocked at ' + b.days + ' days!' : 'Unlock at ' + b.days + ' days';
      list.appendChild(span);
      if (wasLocked && nowUnlocked) triggerBadgeConfetti(span);
    });
  }

  function triggerBadgeConfetti(anchor) {
    const colors = ['#ffd93d', '#ff9f43', '#ee5a5a', '#6bcb77', '#9b59b6', '#ff6b9d'];
    const container = document.createElement('div');
    container.className = 'kids-confetti-burst';
    container.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:visible;';
    for (var i = 0; i < 12; i++) {
      var p = document.createElement('span');
      p.className = 'kids-confetti-piece';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--angle', (i * 30) + 'deg');
      container.appendChild(p);
    }
    var rect = anchor.getBoundingClientRect();
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;left:' + rect.left + 'px;top:' + rect.top + 'px;width:' + rect.width + 'px;height:' + rect.height + 'px;z-index:9998;';
    wrap.appendChild(container);
    document.body.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 800);
  }

  function wireMarkDone() {
    const btn = document.getElementById('kids-mark-done');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (isDoneToday()) return;
      var prevStreak = getCurrentStreak();
      markTodayDone();
      renderStreak();
      renderDoneState();
      renderComeBackNudge();
      renderBadges(prevStreak);
      renderFaithTrail();
    });
  }

  function wireDoodle() {
    const openBtn = document.getElementById('kids-doodle-btn');
    const modal = document.getElementById('kids-doodle-modal');
    const closeBtn = document.getElementById('kids-doodle-close');
    const canvas = document.getElementById('kids-doodle-canvas');
    const colorInput = document.getElementById('kids-doodle-color');
    const sizeInput = document.getElementById('kids-doodle-size');
    const clearBtn = document.getElementById('kids-doodle-clear');
    const saveBtn = document.getElementById('kids-doodle-save');
    const downloadBtn = document.getElementById('kids-doodle-download');

    if (!openBtn || !modal || !canvas) return;

    let ctx = canvas.getContext('2d');
    let drawing = false;
    let lastX = 0, lastY = 0;

    function initCanvas() {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const saved = localStorage.getItem(KIDS_DOODLE_KEY + getDailyKey());
      if (saved) {
        const img = new Image();
        img.onload = function () { ctx.drawImage(img, 0, 0); };
        img.src = saved;
      }
    }

    function startDraw(e) {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      lastX = (e.clientX - rect.left) * scaleX;
      lastY = (e.clientY - rect.top) * scaleY;
    }

    function draw(e) {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      ctx.strokeStyle = colorInput ? colorInput.value : '#000';
      ctx.lineWidth = sizeInput ? sizeInput.value : 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastX = x;
      lastY = y;
    }

    function stopDraw() { drawing = false; }

    function saveToLocal() {
      try {
        localStorage.setItem(KIDS_DOODLE_KEY + getDailyKey(), canvas.toDataURL('image/png'));
      } catch (e) {}
    }

    openBtn.addEventListener('click', function () {
      initCanvas();
      modal.classList.remove('hidden');
    });

    if (closeBtn) closeBtn.addEventListener('click', function () {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.add('hidden');
    });

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    canvas.addEventListener('touchstart', function (e) {
      e.preventDefault();
      const t = e.touches[0];
      startDraw({ clientX: t.clientX, clientY: t.clientY });
    });
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      const t = e.touches[0];
      draw({ clientX: t.clientX, clientY: t.clientY });
    });
    canvas.addEventListener('touchend', stopDraw);

    if (clearBtn) clearBtn.addEventListener('click', function () {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      try { localStorage.removeItem(KIDS_DOODLE_KEY + getDailyKey()); } catch (e) {}
    });

    if (saveBtn) saveBtn.addEventListener('click', function () {
      saveToLocal();
      modal.classList.add('hidden');
    });

    if (downloadBtn) downloadBtn.addEventListener('click', function () {
      const a = document.createElement('a');
      a.download = 'kids-battle-doodle.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      saveToLocal();
    });
  }

  function wireSidebar() {
    const toggle = document.getElementById('sidebar-toggle');
    const appShell = document.querySelector('.app-shell');
    if (toggle && appShell) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        appShell.classList.toggle('sidebar-open');
      });
    }
  }

  function wireVerseSpeak() {
    const btn = document.getElementById('kids-verse-speak');
    const textEl = document.getElementById('kids-verse-text');
    const refEl = document.getElementById('kids-verse-ref');
    if (!btn || !textEl) return;
    var synth = window.speechSynthesis;
    if (!synth) {
      btn.style.display = 'none';
      return;
    }
    btn.addEventListener('click', function () {
      if (synth.speaking) {
        synth.cancel();
        btn.textContent = '🔊 Tap to hear';
        return;
      }
      var text = (refEl ? refEl.textContent + '. ' : '') + textEl.textContent;
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.pitch = 1.1;
      var voices = synth.getVoices();
      var kidVoice = voices.find(function (v) { return v.name.includes('Child') || v.name.includes('Samantha'); }) || voices[0];
      if (kidVoice) u.voice = kidVoice;
      u.onstart = function () { btn.textContent = '⏸ Stop'; };
      u.onend = u.onerror = function () { btn.textContent = '🔊 Tap to hear'; };
      synth.speak(u);
    });
  }

  function generateShareImage(callback) {
    var refEl = document.getElementById('kids-verse-ref');
    var textEl = document.getElementById('kids-verse-text');
    var ref = refEl ? refEl.textContent : '';
    var text = textEl ? textEl.textContent : '';
    var doodleData = null;
    try {
      doodleData = localStorage.getItem(KIDS_DOODLE_KEY + getDailyKey());
    } catch (e) {}
    var c = document.createElement('canvas');
    c.width = 600;
    c.height = doodleData ? 700 : 500;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ffd93d';
    ctx.font = 'bold 28px Bangers, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('I won today\'s Kids Battle!', 300, 50);
    ctx.fillStyle = '#ff9f43';
    ctx.font = 'bold 20px Nunito, sans-serif';
    ctx.fillText(ref, 300, 90);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px Comic Neue, sans-serif';
    var words = text.split(/\s+/);
    var lines = [];
    var line = '';
    for (var w = 0; w < words.length; w++) {
      var test = line ? line + ' ' + words[w] : words[w];
      if (test.length <= 42) line = test;
      else { if (line) lines.push(line); line = words[w]; }
    }
    if (line) lines.push(line);
    var y = 130;
    lines.forEach(function (ln) {
      ctx.fillText(ln, 300, y);
      y += 28;
    });
    if (doodleData) {
      var img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 50, 180, 500, 350);
        ctx.fillStyle = '#ffd93d';
        ctx.font = 'bold 24px Bangers, sans-serif';
        ctx.fillText('Today\'s Daily Battle', 300, c.height - 30);
        callback(c.toDataURL('image/png'));
      };
      img.onerror = function () { callback(c.toDataURL('image/png')); };
      img.src = doodleData;
    } else {
      ctx.fillStyle = '#ffd93d';
      ctx.font = 'bold 24px Bangers, sans-serif';
      ctx.fillText('Today\'s Daily Battle', 300, c.height - 30);
      callback(c.toDataURL('image/png'));
    }
  }

  function wireShareBtn() {
    var shareBtn = document.getElementById('kids-share-btn');
    var doodleShareBtn = document.getElementById('kids-doodle-share');
    function doShare() {
      generateShareImage(function (dataUrl) {
        var blob = dataUrlToBlob(dataUrl);
        var file = new File([blob], 'kids-battle-win.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({
            title: 'I won today\'s Kids Battle!',
            text: 'Check out my verse and doodle from Today\'s Daily Battle!',
            files: [file]
          }).catch(function () { fallbackDownload(dataUrl); });
        } else {
          fallbackDownload(dataUrl);
        }
      });
    }
    function dataUrlToBlob(dataUrl) {
      var arr = dataUrl.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8 = new Uint8Array(n);
      for (var i = 0; i < n; i++) u8[i] = bstr.charCodeAt(i);
      return new Blob([u8], { type: mime });
    }
    function fallbackDownload(dataUrl) {
      var a = document.createElement('a');
      a.download = 'kids-battle-win.png';
      a.href = dataUrl;
      a.click();
    }
    if (shareBtn) shareBtn.addEventListener('click', doShare);
    if (doodleShareBtn) doodleShareBtn.addEventListener('click', doShare);
  }

  const KIDS_TRAIL_WELCOME_KEY = 'kidsTrailWelcomeShown';

  function renderFaithTrail() {
    var section = document.getElementById('kids-faith-trail');
    var board = document.getElementById('kids-faith-trail-board');
    if (!section || !board) return;
    var streak = getCurrentStreak();
    if (streak < 1) {
      section.classList.add('hidden');
      return;
    }
    section.classList.remove('hidden');
    var welcomeEl = section.querySelector('.kids-trail-welcome');
    if (welcomeEl) welcomeEl.remove();
    if (!localStorage.getItem(KIDS_TRAIL_WELCOME_KEY)) {
      try { localStorage.setItem(KIDS_TRAIL_WELCOME_KEY, '1'); } catch (e) {}
      var welcome = document.createElement('p');
      welcome.className = 'kids-trail-welcome';
      welcome.textContent = "Welcome to the Trail! You're on Day " + streak + " — collect icons to win the week! ⚔️🏆";
      welcome.setAttribute('role', 'status');
      section.insertBefore(welcome, board);
    }
    board.innerHTML = '';
    FAITH_TRAIL_STOPS.forEach(function (stop) {
      var span = document.createElement('span');
      span.className = 'kids-trail-stop' + (streak >= stop.day ? ' unlocked' : ' locked');
      span.innerHTML = '<span class="kids-trail-icon">' + stop.icon + '</span><span class="kids-trail-label">' + stop.label + '</span>';
      span.title = streak >= stop.day ? 'Completed!' : 'Unlock at day ' + stop.day;
      board.appendChild(span);
    });
  }

  function renderKidsTopicButtons() {
    var container = document.getElementById('kids-topic-buttons');
    if (!container || !Array.isArray(KIDS_TOPICS) || KIDS_TOPICS.length === 0) return;
    var base = (typeof location !== 'undefined' && location.origin) ? location.origin : '';
    var html = '';
    KIDS_TOPICS.forEach(function (item) {
      var href = base + '/?q=' + encodeURIComponent(item.topic) + '#quick-search-hero';
      html += '<a href="' + href + '" class="kids-topic-btn" data-topic="' + (item.topic || '').replace(/"/g, '&quot;') + '">' + (item.label || item.topic) + '</a>';
    });
    container.innerHTML = html;
  }

  function init() {
    renderKidsTopicButtons();
    renderVerseAndPrayer();
    renderStreak();
    renderDoneState();
    renderComeBackNudge();
    renderBadges();
    renderFaithTrail();
    wireMarkDone();
    wireRemindBtn();
    wireDoodle();
    wireVerseSpeak();
    wireShareBtn();
    wireSidebar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
