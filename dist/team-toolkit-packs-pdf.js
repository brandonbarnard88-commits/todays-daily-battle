/**
 * Team Toolkit — printable packs: styled PDF (jsPDF) + plain .txt.
 * Load after jspdf.umd.min.js (defer). Wires on DOMContentLoaded.
 */
(function () {
  'use strict';

  var MARGIN = 48;
  var PAGE_W = 612;
  var PAGE_H = 792;
  var FOOT_H = 44;
  var MAX_Y = PAGE_H - FOOT_H;
  var CONTENT_W = PAGE_W - MARGIN * 2;
  var GOLD = [227, 188, 103];
  var SLATE = [15, 23, 42];
  var SKY = [30, 58, 138];
  var BODY = [51, 65, 85];
  var MUTED = [100, 116, 139];
  var REF_BLUE = [37, 99, 235];
  var LABEL = [71, 85, 105];

  var PAIN_DAYS = [
    {
      dayTitle: 'Day 1 — This pain is real',
      ref: '2 Corinthians 12:9',
      verse:
        'And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.',
      realTalk: 'Real talk: Your pain is not proof God left. Grace meets you in it.',
      doThis: 'Do this: Say one sentence out loud: "Lord, Your strength in my weakness."'
    },
    {
      dayTitle: "Day 2 — I'm still here",
      ref: 'Lamentations 3:22-23',
      verse:
        "It is of the Lord's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
      realTalk: 'Real talk: Morning mercy is a reset, not a reward for feeling strong.',
      doThis: 'Do this: Thank God for one specific mercy from yesterday.'
    },
    {
      dayTitle: 'Day 3 — One verse, one breath',
      ref: 'Isaiah 41:10',
      verse:
        'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
      realTalk: 'Real talk: He is with you before you feel brave.',
      doThis: 'Do this: Inhale, whisper the ref; exhale, whisper "with me."'
    },
    {
      dayTitle: "Day 4 — I'm allowed to rest",
      ref: 'Matthew 11:28',
      verse: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
      realTalk: 'Real talk: Rest is not failure; it is obedience when He invites.',
      doThis: 'Do this: Name one burden you hand to Him before sleep.'
    },
    {
      dayTitle: 'Day 5 — Others are hurting too',
      ref: 'Galatians 6:2',
      verse: "Bear ye one another's burdens, and so fulfil the law of Christ.",
      realTalk: 'Real talk: You are allowed to need help and to give help without fixing everything.',
      doThis: 'Do this: Text or call one person with a simple "I\'m praying for you."'
    },
    {
      dayTitle: "Day 6 — This won't last forever",
      ref: 'Revelation 21:4',
      verse:
        'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.',
      realTalk: "Real talk: Hope is anchored in His promise, not in today's reading on pain.",
      doThis: 'Do this: Write one line of hope from this verse and keep it nearby.'
    },
    {
      dayTitle: "Day 7 — I'm still fighting",
      ref: '2 Timothy 4:7',
      verse: 'I have fought a good fight, I have finished my course, I have kept the faith:',
      realTalk: 'Real talk: Faithfulness counts even when the body feels slow.',
      doThis: 'Do this: Thank God for one way He kept you this week.'
    }
  ];

  var BATTLE_14_DAYS = [
    {
      title: 'Day 1 — Stand in truth',
      ref: 'Ephesians 6:14',
      verse:
        'Stand therefore, having your loins girt about with truth, and having on the breastplate of righteousness;',
      note: null
    },
    {
      title: 'Day 2 — Righteousness before God',
      ref: 'Ephesians 6:14',
      verse:
        'Stand therefore, having your loins girt about with truth, and having on the breastplate of righteousness;',
      note: 'Same verse — today, linger on the breastplate: His righteousness covering you.'
    },
    {
      title: 'Day 3 — Peace as footwear',
      ref: 'Ephesians 6:15',
      verse: 'And your feet shod with the preparation of the gospel of peace;'
    },
    {
      title: 'Day 4 — Faith blocks the flame',
      ref: 'Ephesians 6:16',
      verse:
        'Above all, taking the shield of faith, wherewith ye shall be able to quench all the fiery darts of the wicked.'
    },
    {
      title: 'Day 5 — Mind guarded',
      ref: 'Ephesians 6:17',
      verse: 'And take the helmet of salvation,',
      note: 'Read the full verse in your Bible — today, rest your thoughts on salvation secured in Christ.'
    },
    {
      title: 'Day 6 — Word in hand',
      ref: 'Ephesians 6:17',
      verse: 'and the sword of the Spirit, which is the word of God:',
      note: 'Same verse — today, let Scripture be what you swing, not what you merely admire.'
    },
    {
      title: 'Day 7 — Pray always',
      ref: 'Ephesians 6:18',
      verse:
        'Praying always with all prayer and supplication in the Spirit, and watching thereunto with all perseverance and supplication for all saints;'
    },
    {
      title: 'Day 8 — Strong in the Lord',
      ref: 'Ephesians 6:10',
      verse: 'Finally, my brethren, be strong in the Lord, and in the power of his might.'
    },
    {
      title: 'Day 9 — Resist steadfast',
      ref: 'James 4:7',
      verse: 'Submit yourselves therefore to God. Resist the devil, and he will flee from you.'
    },
    {
      title: 'Day 10 — God is for you',
      ref: 'Romans 8:31',
      verse: 'What shall we then say to these things? If God be for us, who can be against us?'
    },
    {
      title: 'Day 11 — No weapon prospers',
      ref: 'Isaiah 54:17',
      verse:
        'No weapon that is formed against thee shall prosper; and every tongue that shall rise against thee in judgment thou shalt condemn. This is the heritage of the servants of the Lord, and their righteousness is of me, saith the Lord.'
    },
    {
      title: 'Day 12 — Greater is He',
      ref: '1 John 4:4',
      verse:
        'Ye are of God, little children, and have overcome them: because greater is he that is in you, than he that is in the world.'
    },
    {
      title: 'Day 13 — Casting care',
      ref: '1 Peter 5:7',
      verse: 'Casting all your care upon him; for he careth for you.'
    },
    {
      title: 'Day 14 — Hold the line',
      ref: '1 Corinthians 16:13',
      verse: 'Watch ye, stand fast in the faith, quit you like men, be strong.'
    }
  ];

  function showPackToast(msg, info) {
    var t = document.createElement('div');
    t.className = 'tt-toast' + (info ? ' info' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () {
      t.classList.add('fade-out');
      setTimeout(function () {
        t.remove();
      }, 420);
    }, 2800);
  }

  function trackPack(kind, format) {
    if (typeof window.trackEvent === 'function') {
      window.trackEvent('team_toolkit_pack_download', { pack: kind, format: format });
    }
  }

  function downloadTextFile(filename, text) {
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function getJsPdfCtor() {
    try {
      var j = window.jspdf;
      if (j && j.jsPDF) return j.jsPDF;
    } catch (e) {}
    return null;
  }

  function getPainGracePackText() {
    var lines = [
      "When Pain Won't Quit — 7 Days of Grace (KJV)",
      "Today's Daily Battle — todaysdailybattle.com",
      ''
    ];
    for (var i = 0; i < PAIN_DAYS.length; i++) {
      var d = PAIN_DAYS[i];
      lines.push(d.dayTitle);
      lines.push(d.ref + ' (KJV)');
      lines.push(d.verse);
      lines.push(d.realTalk);
      lines.push(d.doThis);
      lines.push('');
    }
    lines.push('---');
    lines.push('Printed and shared with love. No ads. No tracking.');
    lines.push('Built for the trenches.');
    lines.push('');
    return lines.join('\n');
  }

  function getBattle14PackText() {
    var lines = [
      '14 Days — Spiritual Battle (KJV)',
      "Today's Daily Battle — todaysdailybattle.com",
      '',
      'Each day: read slowly in community, then discuss together.',
      'Question: "Where do I need this truth today?"',
      ''
    ];
    for (var j = 0; j < BATTLE_14_DAYS.length; j++) {
      var b = BATTLE_14_DAYS[j];
      lines.push(b.title);
      lines.push(b.ref + ' (KJV)');
      lines.push(b.verse);
      if (b.note) lines.push(b.note);
      lines.push('Discuss: Where do I need this truth today?');
      lines.push('');
    }
    lines.push('---');
    lines.push('KJV only. For groups: read aloud, pray short, share one honest sentence.');
    lines.push('No ads. No tracking.');
    lines.push('');
    return lines.join('\n');
  }

  function drawFooter(doc, pageNum) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text('todaysdailybattle.com · KJV only · No ads. No tracking.', MARGIN, PAGE_H - 28);
    doc.text('Page ' + pageNum, PAGE_W - MARGIN - 36, PAGE_H - 28);
  }

  function drawFirstHeader(doc, title, subtitle, tagline) {
    var headerH = 90;
    doc.setFillColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.rect(0, 0, PAGE_W, headerH, 'F');
    doc.setFillColor(SKY[0], SKY[1], SKY[2]);
    doc.rect(0, 0, PAGE_W, 46, 'F');
    doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.rect(0, headerH - 3, PAGE_W, 3, 'F');
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.setFontSize(17);
    doc.setFont('helvetica', 'bold');
    doc.text(title, MARGIN, 32);
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, MARGIN, 52);
    doc.setFontSize(9);
    doc.setTextColor(186, 198, 216);
    doc.text(tagline, MARGIN, 72);
  }

  function drawMiniHeader(doc, label) {
    var h = 34;
    doc.setFillColor(SLATE[0], SLATE[1], SLATE[2]);
    doc.rect(0, 0, PAGE_W, h, 'F');
    doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.rect(0, h - 2, PAGE_W, 2, 'F');
    doc.setTextColor(241, 245, 249);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(label, MARGIN, 22);
  }

  function ensureSpace(doc, y, lineHeight, state, continuedLabel) {
    if (y + lineHeight <= MAX_Y) return y;
    drawFooter(doc, state.pageNum);
    doc.addPage();
    state.pageNum++;
    drawMiniHeader(doc, continuedLabel);
    return 48;
  }

  function writeLines(doc, y, lines, fontSize, lineHeight, rgb, fontStyle, state, continuedLabel) {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle || 'normal');
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    for (var i = 0; i < lines.length; i++) {
      y = ensureSpace(doc, y, lineHeight, state, continuedLabel);
      doc.text(lines[i], MARGIN, y);
      y += lineHeight;
    }
    return y;
  }

  function writeParagraph(doc, y, text, fontSize, lineHeight, rgb, fontStyle, state, continuedLabel) {
    var wrapped = doc.splitTextToSize(text, CONTENT_W);
    return writeLines(doc, y, wrapped, fontSize, lineHeight, rgb, fontStyle, state, continuedLabel);
  }

  /** Small caps-style section label + body (printable pack layout). */
  function writeLabeledBlock(doc, y, label, text, fontSize, lineHeight, rgb, fontStyle, state, continuedLabel) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(LABEL[0], LABEL[1], LABEL[2]);
    y = ensureSpace(doc, y, 16, state, continuedLabel);
    doc.text(String(label || '').toUpperCase(), MARGIN + 6, y);
    y += 11;
    y = writeParagraph(doc, y, text, fontSize, lineHeight, rgb, fontStyle || 'normal', state, continuedLabel);
    y += 4;
    return y;
  }

  function drawDayDivider(doc, y) {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  }

  function getCancerComfortPlanRows() {
    try {
      var sh = typeof window !== 'undefined' && window.TDB_PLANS_BATTLE_SHARED;
      if (sh && Array.isArray(sh.cancerComfort7) && sh.cancerComfort7.length === 7) return sh.cancerComfort7;
    } catch (e) {}
    return null;
  }

  function generatePainGracePackPdf() {
    var JsPDF = getJsPdfCtor();
    if (!JsPDF) {
      showPackToast('PDF tools did not load—that is all right. Refresh and try again.', true);
      return;
    }
    var doc = new JsPDF({ unit: 'pt', format: 'letter', compress: true });
    var state = { pageNum: 1 };
    var cont = "When Pain Won't Quit (continued)";
    drawFirstHeader(
      doc,
      "When Pain Won't Quit",
      '7 Days of Grace · KJV',
      "Today's Daily Battle · todaysdailybattle.com"
    );
    var y = 108;
    for (var d = 0; d < PAIN_DAYS.length; d++) {
      var day = PAIN_DAYS[d];
      if (d > 0) {
        y += 4;
        drawDayDivider(doc, y);
        y += 12;
      }
      y = writeParagraph(doc, y, day.dayTitle, 12, 15, SLATE, 'bold', state, cont);
      y = writeLabeledBlock(doc, y, 'Reference', day.ref + ' (KJV)', 10, 13, REF_BLUE, 'bold', state, cont);
      y = writeLabeledBlock(doc, y, 'Verse (KJV)', day.verse, 10, 13, BODY, 'normal', state, cont);
      y = writeLabeledBlock(doc, y, 'Straight talk', day.realTalk, 10, 13, BODY, 'normal', state, cont);
      y = writeLabeledBlock(doc, y, 'Step', day.doThis, 10, 13, SLATE, 'bold', state, cont);
      y += 6;
    }
    y = ensureSpace(doc, y, 24, state, cont);
    doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 14;
    y = writeParagraph(
      doc,
      y,
      'Printed and shared with love. No ads. No tracking. Built for the trenches.',
      9,
      12,
      MUTED,
      'normal',
      state,
      cont
    );
    drawFooter(doc, state.pageNum);
    doc.save('pain-grace-7days.pdf');
    trackPack('pain_grace_7', 'pdf');
    showPackToast('PDF downloaded.', true);
  }

  function getCancerComfortPackText() {
    var rows = getCancerComfortPlanRows();
    var lines = [
      'Cancer Comfort — 7 Days (KJV)',
      "Today's Daily Battle — todaysdailybattle.com",
      'Honest fear and Christ beside you. Not medical advice.',
      ''
    ];
    if (!rows) {
      lines.push('(Open this page online to generate the full pack from plans-data.js.)');
      lines.push('');
      return lines.join('\n');
    }
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      lines.push('Day ' + (i + 1) + ' — ' + (r.title || ''));
      lines.push('Reference: ' + (r.ref || '') + ' (KJV)');
      lines.push(r.text || '');
      lines.push('Straight talk: ' + (r.plain || ''));
      lines.push('Today: ' + (r.today || ''));
      lines.push('Step: ' + (r.action || ''));
      lines.push('Prayer: ' + (r.prayer || ''));
      lines.push('');
    }
    lines.push('---');
    lines.push('Printed with care. No ads. No tracking.');
    lines.push('');
    return lines.join('\n');
  }

  function generateCancerComfortPack() {
    downloadTextFile('cancer-comfort-7days.txt', getCancerComfortPackText());
    trackPack('cancer_comfort_7', 'txt');
    showPackToast('Text file downloaded.', true);
  }

  function generateCancerComfortPackPdf() {
    var rows = getCancerComfortPlanRows();
    if (!rows) {
      showPackToast('Pack data did not load—that is all right. Refresh and try again.', true);
      return;
    }
    var JsPDF = getJsPdfCtor();
    if (!JsPDF) {
      showPackToast('PDF tools did not load—that is all right. Refresh and try again.', true);
      return;
    }
    var doc = new JsPDF({ unit: 'pt', format: 'letter', compress: true });
    var state = { pageNum: 1 };
    var cont = 'Cancer Comfort (continued)';
    drawFirstHeader(doc, 'Cancer Comfort', '7 Days · KJV', "Today's Daily Battle · todaysdailybattle.com");
    var y = 108;
    y = writeParagraph(
      doc,
      y,
      'Honest fear and Christ beside you. Not medical advice—spiritual encouragement alongside your doctors and loved ones.',
      9,
      12,
      MUTED,
      'italic',
      state,
      cont
    );
    y += 6;
    for (var j = 0; j < rows.length; j++) {
      var row = rows[j];
      if (j > 0) {
        y += 4;
        drawDayDivider(doc, y);
        y += 12;
      }
      y = writeParagraph(doc, y, 'Day ' + (j + 1) + ' — ' + (row.title || ''), 12, 15, SLATE, 'bold', state, cont);
      if (row.speaker) {
        y = writeParagraph(doc, y, row.speaker, 9, 12, MUTED, 'italic', state, cont);
      }
      y = writeLabeledBlock(doc, y, 'Reference', (row.ref || '') + ' (KJV)', 10, 13, REF_BLUE, 'bold', state, cont);
      y = writeLabeledBlock(doc, y, 'Verse (KJV)', row.text || '', 10, 13, BODY, 'normal', state, cont);
      y = writeLabeledBlock(doc, y, 'Straight talk', row.plain || '', 10, 13, BODY, 'normal', state, cont);
      y = writeLabeledBlock(doc, y, 'Today', row.today || '', 10, 13, MUTED, 'italic', state, cont);
      y = writeLabeledBlock(doc, y, 'Step', row.action || '', 10, 13, SLATE, 'bold', state, cont);
      y = writeLabeledBlock(doc, y, 'Prayer', row.prayer || '', 10, 13, MUTED, 'italic', state, cont);
      y += 6;
    }
    y = ensureSpace(doc, y, 24, state, cont);
    doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 14;
    y = writeParagraph(
      doc,
      y,
      'KJV only. For groups: read aloud, pray short, share one honest sentence. No ads. No tracking.',
      9,
      12,
      MUTED,
      'normal',
      state,
      cont
    );
    drawFooter(doc, state.pageNum);
    doc.save('cancer-comfort-7days.pdf');
    trackPack('cancer_comfort_7', 'pdf');
    showPackToast('PDF downloaded.', true);
  }

  function generateBattle14PackPdf() {
    var JsPDF = getJsPdfCtor();
    if (!JsPDF) {
      showPackToast('PDF tools did not load—that is all right. Refresh and try again.', true);
      return;
    }
    var doc = new JsPDF({ unit: 'pt', format: 'letter', compress: true });
    var state = { pageNum: 1 };
    var cont = '14-Day Spiritual Battle (continued)';
    drawFirstHeader(
      doc,
      '14-Day Spiritual Battle',
      'Armor, promises, and honest questions · KJV',
      "Today's Daily Battle · todaysdailybattle.com"
    );
    var y = 108;
    y = writeLabeledBlock(
      doc,
      y,
      'How to use this pack',
      'Each day: read slowly together, then share one honest sentence. Discussion question: "Where do I need this truth today?"',
      10,
      13,
      BODY,
      'normal',
      state,
      cont
    );
    y += 4;
    for (var j = 0; j < BATTLE_14_DAYS.length; j++) {
      var b = BATTLE_14_DAYS[j];
      if (j > 0) {
        y += 4;
        drawDayDivider(doc, y);
        y += 12;
      }
      y = writeParagraph(doc, y, b.title, 11, 14, SLATE, 'bold', state, cont);
      y = writeLabeledBlock(doc, y, 'Reference', b.ref + ' (KJV)', 10, 13, REF_BLUE, 'bold', state, cont);
      y = writeLabeledBlock(doc, y, 'Verse (KJV)', b.verse, 10, 13, BODY, 'normal', state, cont);
      if (b.note) {
        y = writeLabeledBlock(doc, y, 'Linger', b.note, 9, 12, MUTED, 'italic', state, cont);
      }
      y = writeLabeledBlock(
        doc,
        y,
        'Discuss',
        'Where do I need this truth today?',
        10,
        13,
        SLATE,
        'bold',
        state,
        cont
      );
      y += 6;
    }
    y = ensureSpace(doc, y, 20, state, cont);
    doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 14;
    y = writeParagraph(
      doc,
      y,
      'KJV only. For groups: read aloud, pray short, share one honest sentence. No ads. No tracking.',
      9,
      12,
      MUTED,
      'normal',
      state,
      cont
    );
    drawFooter(doc, state.pageNum);
    doc.save('battle-spiritual-14days.pdf');
    trackPack('battle_14', 'pdf');
    showPackToast('PDF downloaded.', true);
  }

  function generatePainGracePack() {
    downloadTextFile('pain-grace-7days.txt', getPainGracePackText());
    trackPack('pain_grace_7', 'txt');
    showPackToast('Text file downloaded.', true);
  }

  function generateBattle14Pack() {
    downloadTextFile('battle-spiritual-14days.txt', getBattle14PackText());
    trackPack('battle_14', 'txt');
    showPackToast('Text file downloaded.', true);
  }

  function wire() {
    var b1 = document.getElementById('tt-pack-pain-grace');
    var b1p = document.getElementById('tt-pack-pain-grace-pdf');
    var b2 = document.getElementById('tt-pack-battle-14');
    var b2p = document.getElementById('tt-pack-battle-14-pdf');
    var b3 = document.getElementById('tt-pack-cancer-comfort');
    var b3p = document.getElementById('tt-pack-cancer-comfort-pdf');
    if (b1) b1.addEventListener('click', generatePainGracePack);
    if (b1p) b1p.addEventListener('click', generatePainGracePackPdf);
    if (b2) b2.addEventListener('click', generateBattle14Pack);
    if (b2p) b2p.addEventListener('click', generateBattle14PackPdf);
    if (b3) b3.addEventListener('click', generateCancerComfortPack);
    if (b3p) b3p.addEventListener('click', generateCancerComfortPackPdf);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
