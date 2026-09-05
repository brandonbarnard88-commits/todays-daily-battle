#!/usr/bin/env node
/**
 * Bring every locale to the Portuguese-shaped porch:
 * hub, official-verse stamp host, core feeling grid, honest tool covers,
 * one Bible credit, URLs under /xx/, sitemap + clean redirects.
 *
 * Does NOT translate Ask, kids games, or the chapter reader.
 * Run: node scripts/complete-locale-porches.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LOCALE_BIBLES, localeTextForRef } from './lib/locale-bible.mjs';
import { LANG_SWITCHER_INNER } from './lib/lang-switcher-inner.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const MOODS = {
  anxiety: { refs: ['Psalm 55:22', '1 Peter 5:7'], en: '/topic-anxiety.html' },
  fear: { refs: ['2 Timothy 1:7', 'Psalm 56:3'], en: '/topic-fear.html' },
  hope: { refs: ['Romans 15:13', 'Jeremiah 29:11'], en: '/topic-hope.html' },
  peace: { refs: ['John 14:27', 'Philippians 4:7'], en: '/calm.html' },
  strength: { refs: ['Philippians 4:13', 'Isaiah 40:31'], en: '/topic-strength.html' },
  loneliness: { refs: ['Hebrews 13:5', 'Psalm 68:6'], en: '/topic-loneliness.html' },
  forgiveness: { refs: ['Ephesians 4:32', 'Colossians 3:13'], en: '/topic-forgiveness.html' },
  grief: { refs: ['Psalm 34:18', 'Matthew 5:4'], en: '/topic-grief.html' }
};

const SHELLS = {
  plans: { en: '/plans.html' },
  prayer: { en: '/prayer-wall.html' },
  reader: { en: '/reader.html' },
  kids: { en: '/kids/' }
};

const LANG = {
  zh: {
    htmlLang: 'zh-CN',
    dir: '',
    bible: 'zh',
    home: '中文',
    skip: '跳到正文',
    menu: '菜单',
    langLabel: '语言',
    topicLabel: '主题',
    toolLabel: '工具',
    creditShort: '和合本 1919（公有领域）',
    kjvBanner: '这是中文门廊。完整工具在英文里打开，经文多为 KJV。',
    moreHelp: '网站工具 — 英文界面',
    moreHelpNote: '下面的链接打开英文页。工具里的圣经通常是 KJV。',
    simple: '更浅白的话',
    todayH: '这对你今天意味着什么',
    stepH: '现在可以做的一步',
    secondH: '若还重，再一节',
    moods: {
      anxiety: { file: 'jiaolv.html', title: '焦虑', h1: '当焦虑堵住胸口', lead: '你已经被欢迎——不必先证明什么。', talk: '胸口紧、脑子转个不停。你不是一个人。', simple: '不必独自扛着。把夺走睡眠的那块，诚实放在祂面前。', today: '焦虑说一切靠你。这节经文说有人托住你。', step: '低声说：主啊，这是我的担子，我放在你手里。然后慢慢呼吸三次。' },
      fear: { file: 'kongju.html', title: '恐惧', h1: '当害怕抢先跑', lead: '先安息。不必装作勇敢。', talk: '心跳比事实更快。祂仍近。', simple: '神给的不是胆怯的心。', today: '害怕可以来。它不必作主。', step: '说出这句：祂与我同在。' },
      hope: { file: 'xiwang.html', title: '盼望', h1: '当心累了还要往前', lead: '锚在祂，不在情绪。', talk: '盼望不是假装轻松。', simple: '祂是盼望的神。', today: '今天可以抓住这一句，不必抓住全部明天。', step: '把这一节读出声，然后做下一件诚实的小事。' },
      peace: { file: 'heping.html', title: '平安', h1: '当里面静不下来', lead: '祂的平安不像世界给的。', talk: '嘈杂可以很大。平安仍可临到。', simple: '我把我的平安给你们。', today: '心可以慌，仍被守住。', step: '停一次，把这一节放在喧闹上面。' },
      strength: { file: 'liliang.html', title: '力量', h1: '当力气用尽', lead: '力量从祂来，不是从再挤一次。', talk: '腿在抖也无妨。', simple: '靠那加给我力量的，凡事都能做。', today: '不是自己再撑一轮。', step: '承认今天的软弱，求祂加力。' },
      loneliness: { file: 'gudu.html', title: '孤独', h1: '当四周很静', lead: '祂不撇下你。', talk: '无人看见的时候，祂仍看见。', simple: '我总不撇下你，也不丢弃你。', today: '孤独是真的。被撇下不是结局。', step: '把名字说给祂听。' },
      forgiveness: { file: 'kuanshu.html', title: '宽恕', h1: '当赦免很贵', lead: '先被赦免，再去赦免。', talk: '伤口还在。这句话仍站得住。', simple: '彼此饶恕，正如神在基督里饶恕了你们。', today: '赦免不是假装没发生。', step: '为那一件事祷告一句诚实的话。' },
      grief: { file: 'beishang.html', title: '悲伤', h1: '当心里裂开', lead: '哀恸的人有福了。', talk: '失去是重的。不必很快好起来。', simple: '耶和华靠近伤心的人。', today: '悲伤可以坐在这里。祂靠近。', step: '把失去的名字带到祂面前。' }
    },
    shells: {
      plans: { file: 'jihua.html', title: '阅读计划', h1: '阅读计划 — 英文屏幕', lead: '完整计划在英文页。这是中文门口。' },
      prayer: { file: 'daogao.html', title: '祷告墙', h1: '祷告墙 — 英文屏幕', lead: '完整墙在英文页。这是中文门口。' },
      reader: { file: 'yuedu.html', title: '章节阅读', h1: '章节阅读 — 英文 KJV', lead: '阅读器是英文 KJV。这是中文门口。' },
      kids: { file: 'ertong.html', title: '孩子', h1: '孩子 — 英文角落', lead: '故事与涂色在英文。这是中文门口。' }
    }
  },
  hi: {
    htmlLang: 'hi',
    bible: 'hi',
    home: 'हिन्दी',
    skip: 'मुख्य विषय पर जाएँ',
    menu: 'मेनू',
    langLabel: 'भाषा',
    topicLabel: 'विषय',
    toolLabel: 'औज़ार',
    creditShort: 'हिन्दी IRV 2019 (CC BY-SA 4.0, Bridge Connectivity Solutions)',
    kjvBanner: 'यह हिन्दी द्वार है। पूरा औज़ार अंग्रेज़ी में खुलता है; बाइबल प्रायः KJV।',
    moreHelp: 'साइट के औज़ार — अंग्रेज़ी स्क्रीन',
    moreHelpNote: 'नीचे के लिंक अंग्रेज़ी पृष्ठ खोलते हैं। औज़ार में बाइबल प्रायः KJV है।',
    simple: 'सरल शब्दों में',
    todayH: 'आज तुम्हारे लिये क्या है',
    stepH: 'अभी एक कदम',
    secondH: 'यदि बोझ रहे तो एक और वचन',
    moods: {
      anxiety: { file: 'chinta.html', title: 'चिंता' },
      fear: { file: 'dar.html', title: 'डर' },
      hope: { file: 'asha.html', title: 'आशा' },
      peace: { file: 'shanti.html', title: 'शांति' },
      strength: { file: 'shakti.html', title: 'शक्ति' },
      loneliness: { file: 'akelapan.html', title: 'अकेलापन' },
      forgiveness: { file: 'kshama.html', title: 'क्षमा' },
      grief: {
        file: 'shok.html',
        title: 'शोक',
        h1: 'जब हृदय टूटा हो',
        lead: 'तुम पहले से आमंत्रित हो — जल्दी ठीक होने की ज़रूरत नहीं।',
        talk: 'खोया हुआ भारी है। यहाँ बैठना ठीक है।',
        simple: 'यहोवा टूटे मन वालों के निकट रहता है।',
        today: 'शोक यहाँ रह सकता है। वह निकट है।',
        step: 'जो गया उसका नाम उसके सामने रखो।'
      }
    },
    shells: {
      plans: { file: 'yojana.html', title: 'पठन योजनाएँ', h1: 'योजनाएँ — अंग्रेज़ी स्क्रीन', lead: 'पूरी योजनाएँ अंग्रेज़ी में हैं। यह हिन्दी द्वार है।' },
      prayer: { file: 'prarthana.html', title: 'प्रार्थना दीवार', h1: 'प्रार्थना — अंग्रेज़ी स्क्रीन', lead: 'पूरी दीवार अंग्रेज़ी में है।' },
      reader: { file: 'pathak.html', title: 'अध्याय पाठक', h1: 'पाठक — अंग्रेज़ी KJV', lead: 'अध्याय पाठक अंग्रेज़ी KJV है।' },
      kids: { file: 'bachche.html', title: 'बच्चे', h1: 'बच्चे — अंग्रेज़ी कोना', lead: 'कहानी और रंग अंग्रेज़ी में हैं।' }
    }
  },
  ru: {
    htmlLang: 'ru',
    bible: 'ru',
    home: 'Русский',
    skip: 'К содержанию',
    menu: 'Меню',
    langLabel: 'Язык',
    topicLabel: 'Тема',
    toolLabel: 'Инструмент',
    creditShort: 'Синодальный перевод (1876, общественное достояние)',
    kjvBanner: 'Это русское крыльцо. Полный инструмент открывается по-английски; Писание там обычно KJV.',
    moreHelp: 'Инструменты сайта — английский экран',
    moreHelpNote: 'Ссылки ниже открывают английские страницы. В инструментах Библия обычно KJV.',
    simple: 'Простыми словами',
    todayH: 'Что это значит сегодня',
    stepH: 'Один шаг сейчас',
    secondH: 'Если тяжело — ещё один стих',
    moods: {
      anxiety: { file: 'trevoga.html', title: 'Тревога' },
      fear: { file: 'strakh.html', title: 'Страх' },
      hope: { file: 'nadezhda.html', title: 'Надежда' },
      peace: { file: 'mir.html', title: 'Мир' },
      strength: { file: 'sila.html', title: 'Сила' },
      loneliness: { file: 'odinochestvo.html', title: 'Одиночество' },
      forgiveness: { file: 'proshchenie.html', title: 'Прощение' },
      grief: {
        file: 'gore.html',
        title: 'Горе',
        h1: 'Когда сердце разбито',
        lead: 'Тебя уже ждут — не нужно быстро «прийти в себя».',
        talk: 'Потеря тяжела. Здесь можно сидеть.',
        simple: 'Близок Господь к сокрушённым сердцем.',
        today: 'Горе может остаться здесь. Он близко.',
        step: 'Назови перед Ним то, что потеряно.'
      }
    },
    shells: {
      plans: { file: 'plany.html', title: 'Планы чтения', h1: 'Планы — английский экран', lead: 'Полные планы на английском. Это русская дверь.' },
      prayer: { file: 'molitva.html', title: 'Стена молитвы', h1: 'Молитва — английский экран', lead: 'Полная стена на английском.' },
      reader: { file: 'chtenie.html', title: 'Чтение глав', h1: 'Чтение — английский KJV', lead: 'Читалка — английский KJV.' },
      kids: { file: 'deti.html', title: 'Дети', h1: 'Дети — английский уголок', lead: 'Истории и раскраски на английском.' }
    }
  },
  id: {
    htmlLang: 'id',
    bible: null,
    home: 'Indonesia',
    skip: 'Lompat ke isi',
    menu: 'Menu',
    langLabel: 'Bahasa',
    topicLabel: 'Topik',
    toolLabel: 'Alat',
    creditShort: 'KJV (sengaja, sampai ada teks Indonesia terbuka yang bersih)',
    kjvBanner: 'Ini beranda Indonesia. Alat lengkap berbahasa Inggris; ayat di alat biasanya KJV.',
    moreHelp: 'Alat situs — layar Inggris',
    moreHelpNote: 'Tautan di bawah membuka halaman Inggris. Alkitab di alat biasanya KJV.',
    simple: 'Dengan kata sederhana',
    todayH: 'Apa artinya hari ini',
    stepH: 'Satu langkah sekarang',
    secondH: 'Jika masih berat, satu ayat lagi',
    moods: {
      anxiety: { file: 'kecemasan.html', title: 'Kecemasan' },
      fear: { file: 'ketakutan.html', title: 'Ketakutan' },
      hope: { file: 'harapan.html', title: 'Harapan' },
      peace: {
        file: 'damai.html',
        title: 'Damai',
        h1: 'Ketika hati tidak tenang',
        lead: 'Damai-Nya bukan seperti dunia memberi.',
        talk: 'Ribut boleh besar. Damai tetap boleh datang.',
        simple: 'Aku memberikan damai-Ku kepadamu.',
        today: 'Hati boleh gentar, tetap dijaga.',
        step: 'Berhenti sekali, letakkan ayat ini di atas keributan.'
      },
      strength: {
        file: 'kekuatan.html',
        title: 'Kekuatan',
        h1: 'Ketika tenaga habis',
        lead: 'Kekuatan dari Dia, bukan dari diperas lagi.',
        talk: 'Kaki boleh gemetar.',
        simple: 'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan.',
        today: 'Bukan menyangga satu putaran lagi sendirian.',
        step: 'Akui kelemahan hari ini, minta Dia menguatkan.'
      },
      loneliness: {
        file: 'kesepian.html',
        title: 'Kesepian',
        h1: 'Ketika sepi di sekeliling',
        lead: 'Ia tidak meninggalkan engkau.',
        talk: 'Ketika tidak ada yang melihat, Ia melihat.',
        simple: 'Aku tidak akan membiarkan engkau dan tidak akan meninggalkan engkau.',
        today: 'Kesepian itu nyata. Ditinggalkan bukan akhir.',
        step: 'Sebut namamu di hadapan-Nya.'
      },
      forgiveness: {
        file: 'pengampunan.html',
        title: 'Pengampunan',
        h1: 'Ketika mengampuni mahal',
        lead: 'Diampuni dulu, lalu mengampuni.',
        talk: 'Luka masih ada. Firman ini tetap berdiri.',
        simple: 'Saling mengampuni seperti Allah di dalam Kristus telah mengampuni kamu.',
        today: 'Mengampuni bukan berpura-pura tidak terjadi.',
        step: 'Doakan satu kalimat jujur untuk hal itu.'
      },
      grief: {
        file: 'duka.html',
        title: 'Duka',
        h1: 'Ketika hati retak',
        lead: 'Berbahagialah orang yang berdukacita.',
        talk: 'Kehilangan itu berat. Tidak perlu cepat sembuh.',
        simple: 'TUHAN itu dekat kepada orang-orang yang patah hati.',
        today: 'Duka boleh duduk di sini. Ia dekat.',
        step: 'Bawa nama yang hilang kepada-Nya.'
      }
    },
    shells: {
      plans: { file: 'rencana.html', title: 'Rencana bacaan', h1: 'Rencana — layar Inggris', lead: 'Rencana lengkap di halaman Inggris. Ini pintu Indonesia.' },
      prayer: { file: 'doa.html', title: 'Dinding doa', h1: 'Doa — layar Inggris', lead: 'Dinding lengkap di Inggris.' },
      reader: { file: 'pembaca.html', title: 'Pembaca pasal', h1: 'Pembaca — Inggris KJV', lead: 'Pembaca pasal adalah Inggris KJV.' },
      kids: { file: 'anak.html', title: 'Anak-anak', h1: 'Anak-anak — sudut Inggris', lead: 'Cerita dan mewarnai di Inggris.' }
    }
  },
  ar: {
    htmlLang: 'ar',
    dir: 'rtl',
    bible: 'ar',
    home: 'العربية',
    skip: 'تخطّ إلى المحتوى',
    menu: 'القائمة',
    langLabel: 'اللغة',
    topicLabel: 'موضوع',
    toolLabel: 'أداة',
    creditShort: 'فان دايك 1865 (ملكية عامة)',
    kjvBanner: 'هذا الرواق بالعربية. الأداة الكاملة بالإنجليزية؛ الكتاب هناك غالباً KJV.',
    moreHelp: 'أدوات الموقع — شاشة إنجليزية',
    moreHelpNote: 'الروابط التالية تفتح صفحات إنجليزية. الكتاب في الأدوات غالباً KJV.',
    simple: 'بكلمات بسيطة',
    todayH: 'ماذا يعني لك اليوم',
    stepH: 'خطوة الآن',
    secondH: 'إن بقي الثقل، آية ثانية',
    moods: {
      anxiety: { file: 'qalaq.html', title: 'قلق' },
      hope: { file: 'rajaa.html', title: 'رجاء' },
      fear: {
        file: 'khawf.html',
        title: 'خوف',
        h1: 'عندما يسبق الخوف الوقائع',
        lead: 'استرح أولاً. لا حاجة للتظاهر بالشجاعة.',
        talk: 'القلب يركض. هو قريب.',
        simple: 'لم يعطنا الله روح الفشل.',
        today: 'الخوف قد يأتي. لا يجب أن يملك.',
        step: 'قل: هو معي.'
      },
      peace: {
        file: 'salam.html',
        title: 'سلام',
        h1: 'عندما لا يهدأ الداخل',
        lead: 'سلامه ليس كسلام العالم.',
        talk: 'الضجيج كبير. السلام ما زال ممكناً.',
        simple: 'سلامي أترك لكم.',
        today: 'القلب قد يضطرب ويُحفَظ.',
        step: 'قف مرة، وضع هذه الآية فوق الضجيج.'
      },
      strength: {
        file: 'quwwa.html',
        title: 'قوة',
        h1: 'عندما تنفد القوة',
        lead: 'القوة منه لا من عصر نفسك من جديد.',
        talk: 'الركبتان قد ترتجفان.',
        simple: 'أستطيع كل شيء في المسيح الذي يقويني.',
        today: 'ليس أن تسند جولة أخرى وحدك.',
        step: 'اعترف بضعف اليوم واطلب قوته.'
      },
      loneliness: {
        file: 'wahda.html',
        title: 'وحدة',
        h1: 'عندما يسود الصمت',
        lead: 'لا يتركك.',
        talk: 'حين لا يراك أحد، هو يراك.',
        simple: 'لا أهملك ولا أتركك.',
        today: 'الوحدة حقيقية. الترك ليس النهاية.',
        step: 'قل اسمك أمامه.'
      },
      forgiveness: {
        file: 'ghufran.html',
        title: 'غفران',
        h1: 'عندما يغلو الغفران',
        lead: 'اغْفِر كما غُفر لك.',
        talk: 'الجرح باقٍ. الكلمة ثابتة.',
        simple: 'كما غفر لكم الله في المسيح.',
        today: 'الغفران ليس إنكار ما حدث.',
        step: 'صلِّ جملة صادقة عن ذلك الأمر.'
      },
      grief: {
        file: 'huzn.html',
        title: 'حزن',
        h1: 'عندما ينكسر القلب',
        lead: 'طوبى للحزانى.',
        talk: 'الفقد ثقيل. لا حاجة للشفاء السريع.',
        simple: 'الرب قريب من منكسري القلوب.',
        today: 'الحزن يجوز أن يجلس هنا. هو قريب.',
        step: 'احمل الاسم المفقود إليه.'
      }
    },
    shells: {
      plans: { file: 'khutat.html', title: 'خطط القراءة', h1: 'الخطط — شاشة إنجليزية', lead: 'الخطط الكاملة بالإنجليزية. هذا باب عربي.' },
      prayer: { file: 'sala.html', title: 'جدار الصلاة', h1: 'الصلاة — شاشة إنجليزية', lead: 'الجدار الكامل بالإنجليزية.' },
      reader: { file: 'qari.html', title: 'قارئ الأصحاح', h1: 'القارئ — إنجليزي KJV', lead: 'قارئ الأصحاح إنجليزي KJV.' },
      kids: { file: 'atfal.html', title: 'الأطفال', h1: 'الأطفال — ركن إنجليزي', lead: 'القصص والتلوين بالإنجليزية.' }
    }
  },
  bn: {
    htmlLang: 'bn',
    bible: 'bn',
    home: 'বাংলা',
    skip: 'মূল বিষয়ে যান',
    menu: 'মেনু',
    langLabel: 'ভাষা',
    topicLabel: 'বিষয়',
    toolLabel: 'সরঞ্জাম',
    creditShort: 'বাংলা IRV 2019 (CC BY-SA 4.0, Bridge Connectivity Solutions)',
    kjvBanner: 'এই বাংলা দ্বার। পুরো টুল ইংরেজিতে খোলে; সেখানে বাইবেল সাধারণত KJV।',
    moreHelp: 'সাইটের টুল — ইংরেজি পর্দা',
    moreHelpNote: 'নিচের লিঙ্ক ইংরেজি পাতা খোলে। টুলে বাইবেল সাধারণত KJV।',
    simple: 'সহজ কথায়',
    todayH: 'আজ তোমার জন্য কী',
    stepH: 'এখন এক ধাপ',
    secondH: 'যদি ভারী থাকে, আরও একটি পদ',
    moods: {
      anxiety: { file: 'chinta.html', title: 'চিন্তা' },
      hope: { file: 'asha.html', title: 'আশা' },
      fear: {
        file: 'bhoy.html',
        title: 'ভয়',
        h1: 'যখন ভয় আগে দৌড়ায়',
        lead: 'আগে বিশ্রাম। সাহসের নাটক লাগে না।',
        talk: 'হৃদয় দৌড়ায়। তিনি কাছে।',
        simple: 'ঈশ্বর ভয়ের আত্মা দেননি।',
        today: 'ভয় আসতে পারে। তাকে রাজত্ব করতে হয় না।',
        step: 'বলো: তিনি আমার সঙ্গে আছেন।'
      },
      peace: {
        file: 'shanti.html',
        title: 'শান্তি',
        h1: 'যখন ভিতর শান্ত হয় না',
        lead: 'তাঁর শান্তি জগতের মতো নয়।',
        talk: 'শোরগোল বড় হতে পারে। শান্তি তবু আসতে পারে।',
        simple: 'আমার শান্তি তোমাদের দিচ্ছি।',
        today: 'মন ভয় পেতে পারে, তবু রক্ষিত।',
        step: 'একবার থামো, এই পদটা শোরগোলের উপরে রাখো।'
      },
      strength: {
        file: 'shakti.html',
        title: 'শক্তি',
        h1: 'যখন শক্তি ফুরিয়ে যায়',
        lead: 'শক্তি তাঁর থেকে, আর একবার নিংড়ে নয়।',
        talk: 'হাঁটু কাঁপতে পারে।',
        simple: 'যিনি আমাকে শক্তি দেন, তাঁতেই আমি সব পারি।',
        today: 'একা আর এক রাউন্ড সামলানো নয়।',
        step: 'আজকের দুর্বলতা স্বীকার করো, তাঁর শক্তি চাও।'
      },
      loneliness: {
        file: 'ekaki.html',
        title: 'একাকিত্ব',
        h1: 'যখন চারপাশ নীরব',
        lead: 'তিনি তোমাকে ছাড়েন না।',
        talk: 'কেউ না দেখলেও তিনি দেখেন।',
        simple: 'আমি তোমাকে ছাড়ব না, ত্যাগও করব না।',
        today: 'একাকিত্ব সত্য। পরিত্যক্ত হওয়া শেষ কথা নয়।',
        step: 'তাঁর সামনে নাম বলো।'
      },
      forgiveness: {
        file: 'kshama.html',
        title: 'ক্ষমা',
        h1: 'যখন ক্ষমা দামি',
        lead: 'আগে ক্ষমা পাও, তারপর ক্ষমা দাও।',
        talk: 'ক্ষত আছে। বাক্য দাঁড়িয়ে আছে।',
        simple: 'খ্রীষ্টে ঈশ্বর যেমন তোমাদের ক্ষমা করেছেন।',
        today: 'ক্ষমা মানে ঘটনা অস্বীকার নয়।',
        step: 'সেই বিষয়ে এক সত্ বাক্য প্রার্থনা করো।'
      },
      grief: {
        file: 'shok.html',
        title: 'শোক',
        h1: 'যখন হৃদয় ভাঙে',
        lead: 'শোককারীরা ধন্য।',
        talk: 'হারানো ভারী। তাড়াতাড়ি সারা লাগে না।',
        simple: 'সদাপ্রভু ভগ্নহৃদয়ের কাছে।',
        today: 'শোক এখানে বসতে পারে। তিনি কাছে।',
        step: 'হারানো নাম তাঁর কাছে নিয়ে যাও।'
      }
    },
    shells: {
      plans: { file: 'porikolpona.html', title: 'পাঠ পরিকল্পনা', h1: 'পরিকল্পনা — ইংরেজি পর্দা', lead: 'পূর্ণ পরিকল্পনা ইংরেজিতে। এটি বাংলা দরজা।' },
      prayer: { file: 'prarthana.html', title: 'প্রার্থনার দেয়াল', h1: 'প্রার্থনা — ইংরেজি পর্দা', lead: 'পূর্ণ দেয়াল ইংরেজিতে।' },
      reader: { file: 'pathak.html', title: 'অধ্যায় পাঠক', h1: 'পাঠক — ইংরেজি KJV', lead: 'অধ্যায় পাঠক ইংরেজি KJV।' },
      kids: { file: 'shishu.html', title: 'শিশু', h1: 'শিশু — ইংরেজি কোণ', lead: 'গল্প ও রং ইংরেজিতে।' }
    }
  },
  sv: {
    htmlLang: 'sv',
    bible: 'sv',
    home: 'Svenska',
    skip: 'Hoppa till innehållet',
    menu: 'Meny',
    langLabel: 'Språk',
    topicLabel: 'Ämne',
    toolLabel: 'Verktyg',
    creditShort: '1917 års bibel (allmän egendom)',
    kjvBanner: 'Detta är den svenska verandan. Fullt verktyg öppnas på engelska; bibeln där är oftast KJV.',
    moreHelp: 'Sajtens verktyg — engelsk skärm',
    moreHelpNote: 'Länkarna nedan öppnar engelska sidor. I verktygen är bibeln oftast KJV.',
    simple: 'Med enklare ord',
    todayH: 'Vad det betyder i dag',
    stepH: 'Ett steg nu',
    secondH: 'Om det fortfarande är tungt, ett vers till',
    moods: {
      anxiety: { file: 'oro.html', title: 'Oro' },
      hope: { file: 'hopp.html', title: 'Hopp' },
      fear: {
        file: 'radsla.html',
        title: 'Rädsla',
        h1: 'När rädslan springer före',
        lead: 'Vila först. Du behöver inte spela modig.',
        talk: 'Hjärtat rusar. Han är nära.',
        simple: 'Gud har inte givit oss modlöshetens ande.',
        today: 'Rädsla kan komma. Den behöver inte styra.',
        step: 'Säg: Han är med mig.'
      },
      peace: {
        file: 'frid.html',
        title: 'Frid',
        h1: 'När det inte tystnar inuti',
        lead: 'Hans frid är inte som världens.',
        talk: 'Bullret kan vara stort. Frid kan ändå komma.',
        simple: 'Min frid giver jag eder.',
        today: 'Hjärtat kan darra och ändå bevaras.',
        step: 'Stanna en gång och lägg versen över bruset.'
      },
      strength: {
        file: 'kraft.html',
        title: 'Kraft',
        h1: 'När krafterna tar slut',
        lead: 'Kraften kommer från Honom, inte från att pressa mer.',
        talk: 'Knäna får darra.',
        simple: 'Allt förmår jag i honom som giver mig kraft.',
        today: 'Inte att bära en runda till ensam.',
        step: 'Erkänn dagens svaghet och be om Hans kraft.'
      },
      loneliness: {
        file: 'ensamhet.html',
        title: 'Ensamhet',
        h1: 'När det är tyst omkring',
        lead: 'Han lämnar dig inte.',
        talk: 'När ingen ser, ser Han.',
        simple: 'Jag skall icke lämna dig eller övergiva dig.',
        today: 'Ensamheten är sann. Övergivenhet är inte slutet.',
        step: 'Säg ditt namn inför Honom.'
      },
      forgiveness: {
        file: 'forlatelse.html',
        title: 'Förlåtelse',
        h1: 'När förlåtelse kostar',
        lead: 'Bli förlåten först, sedan förlåta.',
        talk: 'Såret finns kvar. Ordet står kvar.',
        simple: 'Förlåten såsom Gud i Kristus har förlåtit er.',
        today: 'Förlåtelse är inte att låtsas att det inte hände.',
        step: 'Be en ärlig mening om den saken.'
      },
      grief: {
        file: 'sorg.html',
        title: 'Sorg',
        h1: 'När hjärtat spricker',
        lead: 'Saliga äro de som sörja.',
        talk: 'Förlusten är tung. Du behöver inte bli fort bra.',
        simple: 'Herren är nära dem som hava ett förkrossat hjärta.',
        today: 'Sorgen får sitta här. Han är nära.',
        step: 'Bär det förlorade namnet till Honom.'
      }
    },
    shells: {
      plans: { file: 'planer.html', title: 'Läsplaner', h1: 'Planer — engelsk skärm', lead: 'Fullständiga planer på engelska. Detta är den svenska dörren.' },
      prayer: { file: 'bon.html', title: 'Bönemur', h1: 'Bön — engelsk skärm', lead: 'Hela muren på engelska.' },
      reader: { file: 'lasare.html', title: 'Kapitel-läsare', h1: 'Läsare — engelsk KJV', lead: 'Kapitel-läsaren är engelsk KJV.' },
      kids: { file: 'barn.html', title: 'Barn', h1: 'Barn — engelskt hörn', lead: 'Berättelser och målarbilder på engelska.' }
    }
  },
  tl: {
    htmlLang: 'tl',
    bible: 'tl',
    home: 'Tagalog',
    skip: 'Laktawan papunta sa nilalaman',
    menu: 'Menu',
    langLabel: 'Wika',
    topicLabel: 'Paksa',
    toolLabel: 'Kagamitan',
    creditShort: 'Ang Dating Biblia 1905 (pampublikong domain)',
    kjvBanner: 'Ito ang beranda sa Tagalog. Ang buong kagamitan ay Ingles; ang Biblia doon ay kadalasang KJV.',
    moreHelp: 'Mga kagamitan ng site — Ingles na screen',
    moreHelpNote: 'Ang mga link sa ibaba ay nagbubukas ng mga pahinang Ingles. Sa mga kagamitan, KJV ang Biblia.',
    simple: 'Sa payak na salita',
    todayH: 'Ano ito para sa iyo ngayon',
    stepH: 'Isang hakbang ngayon',
    secondH: 'Kung mabigat pa, isa pang talata',
    moods: {
      anxiety: { file: 'kabalisahan.html', title: 'Kabalisahan' },
      hope: { file: 'pagasa.html', title: 'Pag-asa' },
      fear: {
        file: 'takot.html',
        title: 'Takot',
        h1: 'Kapag nauna ang takot sa mga katotohanan',
        lead: 'Magpahinga muna. Hindi kailangang magpanggap na matapang.',
        talk: 'Tumatakbo ang puso. Malapit Siya.',
        simple: 'Hindi tayo binigyan ng Dios ng espiritu ng katakutan.',
        today: 'Puwedeng dumating ang takot. Hindi kailangang maghari.',
        step: 'Sabihin: Kasama ko Siya.'
      },
      peace: {
        file: 'kapayapaan.html',
        title: 'Kapayapaan',
        h1: 'Kapag hindi mapakali ang loob',
        lead: 'Ang kapayapaan Niya ay hindi gaya ng sa sanglibutan.',
        talk: 'Malakas ang ingay. Puwede pa ring dumating ang payapa.',
        simple: 'Ang aking kapayapaan ang ibinibigay ko sa inyo.',
        today: 'Puwedeng mabagabag ang puso at ingatan pa rin.',
        step: 'Tumigil sandali at ilagay ang talatang ito sa ibabaw ng ingay.'
      },
      strength: {
        file: 'kalakasan.html',
        title: 'Kalakasan',
        h1: 'Kapag naubos na ang lakas',
        lead: 'Ang lakas ay mula sa Kanya, hindi sa muling pagpipiga.',
        talk: 'Puwedeng nanginginig ang tuhod.',
        simple: 'Lahat ay magagawa ko sa kaniya na nagpapalakas sa akin.',
        today: 'Hindi isa pang round na mag-isa.',
        step: 'Aminin ang kahinaan ngayon at hingin ang Kanyang lakas.'
      },
      loneliness: {
        file: 'mag-isa.html',
        title: 'Pag-iisa',
        h1: 'Kapag tahimik sa paligid',
        lead: 'Hindi ka Niya iniiwan.',
        talk: 'Kapag walang nakakakita, nakikita Ka Niya.',
        simple: 'Hindi kita pababayaan, ni paguwan man.',
        today: 'Totoo ang pag-iisa. Ang pag-iwan ay hindi wakas.',
        step: 'Sabihin ang pangalan mo sa harap Niya.'
      },
      forgiveness: {
        file: 'kapatawaran.html',
        title: 'Kapatawaran',
        h1: 'Kapag mahal magpatawad',
        lead: 'Pinatawad muna, saka magpatawad.',
        talk: 'Nariyan pa ang sugat. Nakatayo pa ang salita.',
        simple: 'Magpatawad gaya ng pagpapatawad ng Dios sa inyo kay Cristo.',
        today: 'Ang pagpatawad ay hindi pagpretend na hindi nangyari.',
        step: 'Ipanalangin ang isang tapat na pangungusap tungkol doon.'
      },
      grief: {
        file: 'dalamhati.html',
        title: 'Dalamhati',
        h1: 'Kapag nabiyak ang puso',
        lead: 'Mapapalad ang nangagluluksa.',
        talk: 'Mabigat ang pagkawala. Hindi kailangang magmadaling gumaling.',
        simple: 'Malapit ang Panginoon sa mga may bagbag na puso.',
        today: 'Puwedeng umupo dito ang dalamhati. Malapit Siya.',
        step: 'Dalhin sa Kanya ang nawalang pangalan.'
      }
    },
    shells: {
      plans: { file: 'plano.html', title: 'Mga plano sa pagbasa', h1: 'Mga plano — Ingles na screen', lead: 'Ang buong plano ay nasa Ingles. Ito ang pintuan sa Tagalog.' },
      prayer: { file: 'dasal.html', title: 'Pader ng dasal', h1: 'Dasal — Ingles na screen', lead: 'Ang buong pader ay nasa Ingles.' },
      reader: { file: 'mambabasa.html', title: 'Tagabasa ng kabanata', h1: 'Tagabasa — Ingles na KJV', lead: 'Ang tagabasa ng kabanata ay Ingles na KJV.' },
      kids: { file: 'mga-bata.html', title: 'Mga bata', h1: 'Mga bata — sulok na Ingles', lead: 'Kwento at pangkulay ay nasa Ingles.' }
    }
  },
  sw: {
    htmlLang: 'sw',
    bible: 'sw',
    home: 'Kiswahili',
    skip: 'Ruka kwenda kwenye maudhui',
    menu: 'Menyu',
    langLabel: 'Lugha',
    topicLabel: 'Mada',
    toolLabel: 'Chombo',
    creditShort: 'Biblia Takatifu ULB (CC BY-SA 4.0, Door43)',
    kjvBanner: 'Huu ni ukumbi wa Kiswahili. Chombo kamili kinafunguka kwa Kiingereza; Biblia huko mara nyingi ni KJV.',
    moreHelp: 'Vifaa vya tovuti — skrini ya Kiingereza',
    moreHelpNote: 'Viungo hapa chini hufungua kurasa za Kiingereza. Katika vifaa Biblia mara nyingi ni KJV.',
    simple: 'Kwa maneno rahisi',
    todayH: 'Inamaanisha nini leo',
    stepH: 'Hatua moja sasa',
    secondH: 'Ikiwa bado ni nzito, aya nyingine',
    moods: {
      anxiety: { file: 'wasiwasi.html', title: 'Wasiwasi' },
      hope: { file: 'tumaini.html', title: 'Tumaini' },
      fear: {
        file: 'hofu.html',
        title: 'Hofu',
        h1: 'Hofu inapokimbia mbele ya ukweli',
        lead: 'Pumzika kwanza. Si lazima ujifanye shujaa.',
        talk: 'Moyo unakimbia. Yuko karibu.',
        simple: 'Mungu hakutupatia roho ya woga.',
        today: 'Hofu inaweza kuja. Haihitaji kutawala.',
        step: 'Sema: Yuko pamoja nami.'
      },
      peace: {
        file: 'amani.html',
        title: 'Amani',
        h1: 'Ndani isipopumzika',
        lead: 'Amani yake si kama ya ulimwengu.',
        talk: 'Kelele ziwe kubwa. Amani bado inaweza kuja.',
        simple: 'Amani yangu nawapa.',
        today: 'Moyo waweza kutetemeka na bado kulindwa.',
        step: 'Simama mara moja, weka aya hii juu ya kelele.'
      },
      strength: {
        file: 'nguvu.html',
        title: 'Nguvu',
        h1: 'Nguvu zikiisha',
        lead: 'Nguvu ni kutoka kwake, si kujikamua tena.',
        talk: 'Magoti yaweza kutetemeka.',
        simple: 'Naweza kufanya mambo yote katika yeye anitiaye nguvu.',
        today: 'Si raundi nyingine peke yako.',
        step: 'Kubali udhaifu wa leo, omba nguvu zake.'
      },
      loneliness: {
        file: 'upweke.html',
        title: 'Upweke',
        h1: 'Kimya kikizunguka',
        lead: 'Hakuachi.',
        talk: 'Wasipoona watu, Yeye anaona.',
        simple: 'Sitakuacha wala sitakutupa.',
        today: 'Upweke ni kweli. Kuachwa si mwisho.',
        step: 'Taja jina lako mbele zake.'
      },
      forgiveness: {
        file: 'msamaha.html',
        title: 'Msamaha',
        h1: 'Msamaha unapokuwa ghali',
        lead: 'Samehewa kwanza, kisha samehe.',
        talk: 'Kidonda kiko. Neno linasimama.',
        simple: 'Kama Mungu katika Kristo alivyowasamehe.',
        today: 'Msamaha si kujifanya hakikutokea.',
        step: 'Omba sentensi moja ya kweli kuhusu jambo hilo.'
      },
      grief: {
        file: 'huzuni.html',
        title: 'Huzuni',
        h1: 'Moyo unapopasuka',
        lead: 'Heri walio na huzuni.',
        talk: 'Hasara ni nzito. Si lazima upone haraka.',
        simple: 'BWANA yu karibu nao waliovunjika moyo.',
        today: 'Huzuni inaweza kuketi hapa. Yuko karibu.',
        step: 'Chukua jina lililopotea kwake.'
      }
    },
    shells: {
      plans: { file: 'mipango.html', title: 'Mipango ya kusoma', h1: 'Mipango — skrini ya Kiingereza', lead: 'Mipango kamili iko kwa Kiingereza. Hii ni mlango wa Kiswahili.' },
      prayer: { file: 'sala.html', title: 'Ukuta wa sala', h1: 'Sala — skrini ya Kiingereza', lead: 'Ukuta kamili uko kwa Kiingereza.' },
      reader: { file: 'somo.html', title: 'Msomaji wa sura', h1: 'Msomaji — Kiingereza KJV', lead: 'Msomaji wa sura ni Kiingereza KJV.' },
      kids: { file: 'watoto.html', title: 'Watoto', h1: 'Watoto — kona ya Kiingereza', lead: 'Hadithi na kupaka rangi viko kwa Kiingereza.' }
    }
  }
};

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function verseLine(langKey, ref) {
  const spec = LOCALE_BIBLES[langKey];
  const local = spec ? localeTextForRef(root, langKey, ref).replace(/\s+/g, ' ').trim() : '';
  const name = spec ? spec.name : 'King James Version';
  if (local) return { text: local, name, ref };
  return { text: '', name: 'King James Version', ref };
}

function moodHtml(lang, langKey, moodKey, mood) {
  const meta = MOODS[moodKey];
  const spec = LOCALE_BIBLES[lang.bible] || {};
  const v1 = verseLine(lang.bible, meta.refs[0]);
  const v2 = verseLine(lang.bible, meta.refs[1]);
  const dir = lang.dir ? ` dir="${lang.dir}"` : '';
  const path = `/${langKey}/${mood.file}`;
  const credit = lang.creditShort;
  const h1 = mood.h1 || mood.title;
  const lead = mood.lead || lang.kjvBanner;
  const talk = mood.talk || lead;
  const simple = mood.simple || '';
  const today = mood.today || '';
  const step = mood.step || '';
  return `<!DOCTYPE html>
<html lang="${lang.htmlLang}"${dir}>
<head>
  <script src="/vendor/dompurify.min.js"></script>
  <script src="/tt-bootstrap.js?v=20260816-brightgold"></script>
  <script defer src="/analytics-loader.js"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(mood.title)} · Today's Daily Battle</title>
  <meta name="description" content="${esc(h1)} ${esc(credit)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://todaysdailybattle.com${path}">
  <link rel="alternate" hreflang="${lang.htmlLang}" href="https://todaysdailybattle.com${path}">
  <link rel="alternate" hreflang="en" href="https://todaysdailybattle.com${meta.en}">
  <link rel="alternate" hreflang="x-default" href="https://todaysdailybattle.com/">
  <link rel="preload" href="/styles.css?v=20260816-brightgold" as="style">
  <link rel="stylesheet" href="/styles.css?v=20260816-brightgold">
</head>
<body class="dark-mode tdb-no-sidebar-shell">
  <a href="#main-content" class="skip-link">${esc(lang.skip)}</a>
  <div class="app-shell">
    <header class="top-bar">
      <div class="tdb-lang-switcher-header-wrap">
        <nav class="tdb-lang-switcher tdb-lang-switcher--header tdb-lang-switcher--labeled" aria-label="${esc(lang.langLabel)}" data-tdb-lang-switcher lang="${langKey}">
          <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">${esc(lang.langLabel)}</span>
          <span class="tdb-lang-switcher-inner">
${LANG_SWITCHER_INNER}
          </span>
        </nav>
        <p class="tdb-mood-door-kjv-banner">${esc(lang.kjvBanner)}</p>
      </div>
      <div class="brand">
        <a class="brand-title" href="/${langKey}/">Today's Daily Battle</a>
        <span class="brand-subtitle">${esc(lang.home)}</span>
      </div>
      <nav class="header-nav tdb-global-nav" aria-label="${esc(lang.menu)}">
        <a href="/${langKey}/">${esc(lang.home)}</a>
        <a href="/explore.html#languages">Explore</a>
        <a href="${meta.en}" hreflang="en">${esc(mood.title)} (EN)</a>
      </nav>
    </header>
    <main class="app-content porch-section" id="main-content">
      <div class="content-inner">
        <header class="hero-banner tdb-dawn-bg--mist">
          <h1>${esc(h1)}</h1>
          <p class="section-note topic-mood-porch">${esc(lead)}</p>
          <p class="real-talk">${esc(talk)}</p>
          <p class="section-note">${esc(credit)}. <a href="/bible-credits.html#locale-${lang.bible || 'en'}">Credits</a></p>
        </header>
        <section class="glass tdb-porch-paper-glass" lang="${lang.htmlLang}"${dir}>
          <div class="breakdown">
            <h2>${esc(mood.title)}</h2>
            <p class="verse">«${esc(v1.text || meta.refs[0])}» — ${esc(v1.ref)} <span class="section-note">(${esc(v1.name)})</span></p>
            <h3>${esc(lang.simple)}</h3>
            <p>${esc(simple)}</p>
            <h3>${esc(lang.todayH)}</h3>
            <p>${esc(today)}</p>
            <h3>${esc(lang.stepH)}</h3>
            <p>${esc(step)}</p>
          </div>
        </section>
        <section class="glass tdb-porch-paper-glass" lang="${lang.htmlLang}"${dir}>
          <h2 class="section-divider">${esc(lang.secondH)}</h2>
          <p class="verse">«${esc(v2.text || meta.refs[1])}» — ${esc(v2.ref)} <span class="section-note">(${esc(v2.name)})</span></p>
        </section>
        <section class="glass tdb-porch-paper-glass">
          <h2 class="section-divider">${esc(lang.moreHelp)}</h2>
          <p class="section-note">${esc(lang.moreHelpNote)}</p>
          <nav class="cta-group" style="display:flex;flex-wrap:wrap;gap:0.5rem;">
            <a class="btn btn-secondary" href="${meta.en}" hreflang="en">${esc(mood.title)} (EN)</a>
            <a class="btn btn-secondary" href="/${langKey}/">${esc(lang.home)}</a>
            <a class="btn btn-secondary" href="/ask" hreflang="en">Ask (EN)</a>
          </nav>
        </section>
      </div>
    </main>
  </div>
  <script src="/language-switcher.js?v=20260816-brightgold" defer></script>
</body>
</html>
`;
}

function shellHtml(lang, langKey, shellKey, shell) {
  const en = SHELLS[shellKey].en;
  const dir = lang.dir ? ` dir="${lang.dir}"` : '';
  const path = `/${langKey}/${shell.file}`;
  return `<!DOCTYPE html>
<html lang="${lang.htmlLang}"${dir}>
<head>
  <script src="/vendor/dompurify.min.js"></script>
  <script src="/tt-bootstrap.js?v=20260816-brightgold"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(shell.title)} · Today's Daily Battle</title>
  <meta name="description" content="${esc(shell.lead)}">
  <link rel="canonical" href="https://todaysdailybattle.com${path}">
  <link rel="alternate" hreflang="${lang.htmlLang}" href="https://todaysdailybattle.com${path}">
  <link rel="alternate" hreflang="en" href="https://todaysdailybattle.com${en}">
  <link rel="preload" href="/styles.css?v=20260816-brightgold" as="style">
  <link rel="stylesheet" href="/styles.css?v=20260816-brightgold">
</head>
<body class="dark-mode tdb-no-sidebar-shell">
  <a href="#main-content" class="skip-link">${esc(lang.skip)}</a>
  <div class="app-shell">
    <header class="top-bar">
      <nav class="tdb-lang-switcher tdb-lang-switcher--header tdb-lang-switcher--labeled" aria-label="${esc(lang.langLabel)}" data-tdb-lang-switcher lang="${langKey}">
        <span class="tdb-lang-switcher-inner">
${LANG_SWITCHER_INNER}
        </span>
      </nav>
      <p class="tdb-mood-door-kjv-banner">${esc(lang.kjvBanner)}</p>
      <div class="brand">
        <a class="brand-title" href="/${langKey}/">Today's Daily Battle</a>
      </div>
    </header>
    <main class="app-content porch-section" id="main-content">
      <div class="content-inner">
        <header class="hero-banner tdb-dawn-bg--mist">
          <h1>${esc(shell.h1)}</h1>
          <p class="real-talk">${esc(shell.lead)}</p>
          <p class="section-note">${esc(lang.creditShort)}</p>
          <div class="cta-group">
            <a class="btn btn-primary" href="${en}" hreflang="en">${esc(shell.title)} (EN)</a>
            <a class="btn btn-secondary" href="/${langKey}/">${esc(lang.home)}</a>
          </div>
        </header>
      </div>
    </main>
  </div>
</body>
</html>
`;
}

function addHubCard(hubFile, href, label, title, desc, hreflang) {
  let html = fs.readFileSync(hubFile, 'utf8');
  if (html.includes('href="' + href + '"')) return false;
  const card =
    `            <li><a href="${href}" class="explore-hub-card" hreflang="${hreflang}">\n` +
    `              <span class="explore-hub-card-label">${label}</span>\n` +
    `              <span class="explore-hub-card-title">${title}</span>\n` +
    `              <span class="explore-hub-card-desc">${desc}</span>\n` +
    `            </a></li>\n`;
  const grid = html.indexOf('explore-hub-grid');
  if (grid === -1) return false;
  const ulEnd = html.indexOf('</ul>', grid);
  if (ulEnd === -1) return false;
  html = html.slice(0, ulEnd) + card + html.slice(ulEnd);
  fs.writeFileSync(hubFile, html);
  return true;
}

function sitemapAdd(urls) {
  const p = path.join(root, 'sitemap.xml');
  let xml = fs.readFileSync(p, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  let added = 0;
  for (const loc of urls) {
    if (xml.includes('>' + loc + '<') || xml.includes('/' + loc.replace('https://todaysdailybattle.com/', ''))) {
      if (xml.includes(`<loc>${loc}</loc>`)) continue;
    }
    if (xml.includes(`<loc>${loc}</loc>`)) continue;
    const row = `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.72</priority></url>\n`;
    xml = xml.replace('</urlset>', row + '</urlset>');
    added += 1;
  }
  fs.writeFileSync(p, xml);
  return added;
}

function redirectsAdd(lines) {
  const p = path.join(root, '_redirects');
  let t = fs.readFileSync(p, 'utf8');
  let added = 0;
  for (const line of lines) {
    const key = line.split(/\s+/)[0];
    if (t.includes(key + ' ')) continue;
    t += '\n' + line;
    added += 1;
  }
  if (added) fs.writeFileSync(p, t.replace(/\n+$/, '\n'));
  return added;
}

function copySpanishUnderEs() {
  const files = [
    'ansiedad.html',
    'fuerza.html',
    'paz.html',
    'esperanza.html',
    'miedo.html',
    'soledad.html',
    'culpa.html',
    'agobio.html',
    'ira.html',
    'duelo.html',
    'perdon.html',
    'planes.html',
    'muro.html',
    'lector.html',
    'ninos.html'
  ];
  const esDir = path.join(root, 'es');
  fs.mkdirSync(esDir, { recursive: true });
  for (const file of files) {
    const src = path.join(root, file);
    if (!fs.existsSync(src)) continue;
    let html = fs.readFileSync(src, 'utf8');
    html = html.replaceAll('https://todaysdailybattle.com/' + file, 'https://todaysdailybattle.com/es/' + file);
    html = html.replaceAll('href="/' + file.replace('.html', '') + '.html"', 'href="/es/' + file + '"');
    const dest = path.join(esDir, file);
    fs.writeFileSync(dest, html);
  }
  const hub = path.join(esDir, 'index.html');
  let hubHtml = fs.readFileSync(hub, 'utf8');
  for (const file of files) {
    hubHtml = hubHtml.replaceAll('href="/' + file + '"', 'href="/es/' + file + '"');
  }
  fs.writeFileSync(hub, hubHtml);
}

const wrote = [];
for (const [langKey, lang] of Object.entries(LANG)) {
  const dir = path.join(root, langKey);
  fs.mkdirSync(dir, { recursive: true });
  for (const [moodKey, mood] of Object.entries(lang.moods)) {
    const dest = path.join(dir, mood.file);
    if (fs.existsSync(dest) && !mood.h1) continue;
    if (fs.existsSync(dest) && !mood.lead) continue;
    if (fs.existsSync(dest)) continue;
    fs.writeFileSync(dest, moodHtml(lang, langKey, moodKey, mood));
    wrote.push(langKey + '/' + mood.file);
    addHubCard(
      path.join(dir, 'index.html'),
      '/' + langKey + '/' + mood.file,
      lang.topicLabel,
      mood.title,
      mood.h1 || mood.title,
      lang.htmlLang
    );
  }
  for (const [shellKey, shell] of Object.entries(lang.shells)) {
    const dest = path.join(dir, shell.file);
    if (fs.existsSync(dest)) continue;
    fs.writeFileSync(dest, shellHtml(lang, langKey, shellKey, shell));
    wrote.push(langKey + '/' + shell.file);
    addHubCard(
      path.join(dir, 'index.html'),
      '/' + langKey + '/' + shell.file,
      lang.toolLabel,
      shell.title,
      shell.lead,
      lang.htmlLang
    );
  }
}

copySpanishUnderEs();

const newUrls = wrote.map((rel) => 'https://todaysdailybattle.com/' + rel);
for (const f of [
  'ansiedad',
  'fuerza',
  'paz',
  'esperanza',
  'miedo',
  'soledad',
  'culpa',
  'agobio',
  'ira',
  'duelo',
  'perdon',
  'planes',
  'muro',
  'lector',
  'ninos'
]) {
  newUrls.push('https://todaysdailybattle.com/es/' + f + '.html');
}
sitemapAdd(newUrls);

const redir = [
  '/ar /ar/index.html 200!',
  '/ar/ /ar/index.html 200!',
  '/sv /sv/index.html 200!',
  '/sv/ /sv/index.html 200!',
  '/tl /tl/index.html 200!',
  '/tl/ /tl/index.html 200!',
  '/sw /sw/index.html 200!',
  '/sw/ /sw/index.html 200!',
  '/bn /bn/index.html 200!',
  '/bn/ /bn/index.html 200!'
];
for (const rel of wrote) {
  const clean = '/' + rel.replace(/\.html$/, '');
  redir.push(clean + ' /' + rel + ' 200!');
  redir.push(clean + '/ /' + rel + ' 200!');
}
for (const f of [
  'ansiedad',
  'fuerza',
  'paz',
  'esperanza',
  'miedo',
  'soledad',
  'culpa',
  'agobio',
  'ira',
  'duelo',
  'perdon',
  'planes',
  'muro',
  'lector',
  'ninos'
]) {
  redir.push('/es/' + f + ' /es/' + f + '.html 200!');
  redir.push('/es/' + f + '/ /es/' + f + '.html 200!');
}
redirectsAdd(redir);

console.log('complete-locale-porches: wrote', wrote.length, 'new pages');
wrote.forEach((w) => console.log(' ', w));
