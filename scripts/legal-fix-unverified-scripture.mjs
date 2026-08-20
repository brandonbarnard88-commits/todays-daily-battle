#!/usr/bin/env node
/**
 * Legal pass: only host Scripture we can prove is PD or openly licensed.
 * - Portuguese topic quotes → stored Almeida 1911
 * - Hindi topic quotes → stored Hindi IRV 2019 (CC BY-SA)
 * - Indonesian / Swahili / unverified Tagalog hope quotes → official KJV, labeled
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { localeTextForRef } from './lib/locale-bible.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
}

function cleanAlmeida(t) {
  return String(t || '')
    .replace(/-\*/g, '-')
    .replace(/\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function kjv(ref) {
  const map = readJson('data/kjv-full.json');
  const keys = [ref, ref.replace(/^Psalm /i, 'Psalms '), ref.replace(/^Psalms /i, 'Psalm ')];
  for (const k of keys) if (map[k]) return String(map[k]).replace(/\s+/g, ' ').trim();
  throw new Error('missing KJV ' + ref);
}

function pt(ref) {
  const map = readJson('data/bibles/pt-almeida1911.json');
  const keys = [ref, ref.replace(/^Psalm /i, 'Psalms '), ref.replace(/^Psalms /i, 'Psalm ')];
  for (const k of keys) if (map[k]) return cleanAlmeida(map[k]);
  throw new Error('missing Almeida ' + ref);
}

function ptRange(refs) {
  return refs.map(pt).join(' ');
}

function hi(ref) {
  let t = localeTextForRef(root, 'hi', ref);
  if (!t) throw new Error('missing IRV ' + ref);
  t = t.replace(/\d+:\d+\s+[^।]*।/g, '').replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim();
  return t;
}

function mustReplace(file, from, to) {
  const p = path.join(root, file);
  let s = fs.readFileSync(p, 'utf8');
  if (!s.includes(from)) {
    if (s.includes(to)) {
      console.log('already:', file, from.slice(0, 48));
      return;
    }
    throw new Error('not found in ' + file + ': ' + from.slice(0, 80));
  }
  const n = s.split(from).length - 1;
  s = s.split(from).join(to);
  fs.writeFileSync(p, s);
  console.log('replaced', n, 'in', file);
}

function replaceAllInFile(file, pairs) {
  for (const [from, to] of pairs) mustReplace(file, from, to);
}

/* —— Portuguese: stored 1911, labeled 1911 —— */
const PT_QUOTES = [
  ['pt/perdao.html',
    '«Antes sede benignos uns para com os outros, compassivos, perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo.» — Efésios 4:32 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Ephesians 4:32') + '» — Efésios 4:32 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/perdao.html',
    '«Suportando-vos uns aos outros, e perdoando-vos uns aos outros, se algum tiver queixa contra outro. Assim como Cristo vos perdoou, assim fazei vós também.» — Colossenses 3:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Colossians 3:13') + '» — Colossenses 3:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/paz.html',
    '«Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.» — João 14:27 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('John 14:27') + '» — João 14:27 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/paz.html',
    '«Em tudo, por oração e súplicas com ações de graças, sejam os vossos pedidos conhecidos diante de Deus. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus.» — Filipenses 4:6-7 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + ptRange(['Philippians 4:6', 'Philippians 4:7']) + '» — Filipenses 4:6-7 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/luto.html',
    '«Bem-aventurados os que choram, porque eles serão consolados.» — Mateus 5:4 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Matthew 5:4') + '» — Mateus 5:4 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/luto.html',
    '«Perto está o Senhor dos que têm o coração quebrantado, e salva os contritos de espírito.» — Salmos 34:18 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Psalms 34:18') + '» — Salmos 34:18 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/medo.html',
    '«Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.» — 2 Timóteo 1:7 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('2 Timothy 1:7') + '» — 2 Timóteo 1:7 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/medo.html',
    '«Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.» — Isaías 41:10 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Isaiah 41:10') + '» — Isaías 41:10 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/forca.html',
    '«Posso todas as coisas naquele que me fortalece.» — Filipenses 4:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Philippians 4:13') + '» — Filipenses 4:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/forca.html',
    '«Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.» — Isaías 40:31 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Isaiah 40:31') + '» — Isaías 40:31 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/culpa.html',
    '«Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados, e nos purificar de toda a injustiça.» — 1 João 1:9 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('1 John 1:9') + '» — 1 João 1:9 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/culpa.html',
    '«Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.» — Romanos 8:1 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Romans 8:1') + '» — Romanos 8:1 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/solidao.html',
    '«Nunca te deixarei, nunca te desampararei.» — Hebreus 13:5 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Hebrews 13:5') + '» — Hebreus 13:5 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/solidao.html',
    '«Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.» — Salmos 23:4 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Psalms 23:4') + '» — Salmos 23:4 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/ansiedade.html',
    '«Lança sobre o Senhor o teu cuidado, e ele te sustentará; nunca permitirá que o justo seja abalado.» — Salmos 55:22 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida, domínio público)</span>',
    '«' + pt('Psalms 55:22') + '» — Salmos 55:22 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/ansiedade.html',
    '«Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.» — 1 Pedro 5:7 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('1 Peter 5:7') + '» — 1 Pedro 5:7 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/esperanca.html',
    '«Ora o Deus de esperança vos encha de todo o gozo e paz na fé, para que abundeis em esperança pelo poder do Espírito Santo.» — Romanos 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida, domínio público)</span>',
    '«' + pt('Romans 15:13') + '» — Romanos 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/esperanca.html',
    '«Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.» — Jeremias 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Jeremiah 29:11') + '» — Jeremias 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/esperanca.html',
    '«A qual temos como âncora da alma, segura e firme.» — Hebreus 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Hebrews 6:19') + '» — Hebreus 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/raiva.html',
    '«Irai-vos e não pequeis; não se ponha o sol sobre a vossa ira.» — Efésios 4:26 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('Ephesians 4:26') + '» — Efésios 4:26 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/raiva.html',
    '«Todo o homem seja pronto para ouvir, tardio para falar, tardio para irar-se.» — Tiago 1:19 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + pt('James 1:19') + '» — Tiago 1:19 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>'],
  ['pt/sobrecarga.html',
    '«Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei. Tomai sobre vós o meu jugo, e aprendei de mim, que sou manso e humilde de coração, e encontrareis descanso para as vossas almas. Porque o meu jugo é suave, e o meu fardo é leve.» — Mateus 11:28-30 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span>',
    '«' + ptRange(['Matthew 11:28', 'Matthew 11:29', 'Matthew 11:30']) + '» — Mateus 11:28-30 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida 1911)</span>']
];

/* —— Hindi: stored IRV —— */
const HI_QUOTES = [
  ['hi/chinta.html',
    '«अपना बोझ यहोवा पर डाल, वह तुझे संभालेगा।» — भजन संहिता ५५:२२ <span class="section-note" style="display:inline;font-size:0.85em;">(१८५१ हिंदी बाइबल)</span>',
    '«' + hi('Psalms 55:22') + '» — भजन संहिता ५५:२२ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/chinta.html',
    '«अपनी सारी चिंता उस पर डाल दो, क्योंकि वह तुम्हारी सुध लेता है।» — पहला पत्रुस ५:७ <span class="section-note" style="display:inline;font-size:0.85em;">(पुरानी हिंदी अनुवाद परंपरा, KJV के साथ मेल)</span>',
    '«' + hi('1 Peter 5:7') + '» — पहला पत्रुस ५:७ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/dar.html',
    '«क्योंकि परमेश्वर ने हमें डर की नहीं, परन्तु सामर्थ्य और प्रेम और संयम की आत्मा दी है।» — दूसरा तिमुथियुस १:७ <span class="section-note" style="display:inline;font-size:0.85em;">(१८५१ हिंदी बाइबल परंपरा के साथ मेल)</span>',
    '«' + hi('2 Timothy 1:7') + '» — दूसरा तिमुथियुस १:७ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/dar.html',
    '«जिस दिन मैं डरता हूँ, मैं तुझ पर भरोसा करूँगा।» — भजन संहिता ५६:३ <span class="section-note" style="display:inline;font-size:0.85em;">(KJV Psalm 56:3 के साथ मेल)</span>',
    '«' + hi('Psalms 56:3') + '» — भजन संहिता ५६:३ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/shakti.html',
    '«मैं उस की सामर्थ से जो मुझे बल देती है, सब कुछ कर सकता हूँ।» — फिलिप्पियों ४:१३ <span class="section-note" style="display:inline;font-size:0.85em;">(१८५१ हिंदी बाइबल परंपरा के साथ मेल)</span>',
    '«' + hi('Philippians 4:13') + '» — फिलिप्पियों ४:१३ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/shakti.html',
    '«परन्तु जो यहोवा की बाट जोहते हैं, वे नई सामर्थ पाएँगे…» — यशायाह ४०:३१ <span class="section-note" style="display:inline;font-size:0.85em;">(KJV के साथ मेल)</span>',
    '«' + hi('Isaiah 40:31') + '» — यशायाह ४०:३१ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/kshama.html',
    '«परन्तु आपस में दयावान और कृपालु बनो, और एक दूसरे को क्षमा करते रहो, जैसे परमेश्वर ने मसीह में तुम्हें क्षमा किया है।» — एफिसियों ४:३२ <span class="section-note" style="display:inline;font-size:0.85em;">(१८५१ हिंदी बाइबल परंपरा)</span>',
    '«' + hi('Ephesians 4:32') + '» — एफिसियों ४:३२ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/kshama.html',
    '«यदि किसी का किसी पर दोष लगे तो एक दूसरे को सहो और एक दूसरे को क्षमा करो; जैसे प्रभु ने तुम्हें क्षमा किया वैसे ही तुम भी एक दूसरे को क्षमा करो।» — कलस्सियों ३:१३ <span class="section-note" style="display:inline;font-size:0.85em;">(१८५१ हिंदी बाइबल परंपरा)</span>',
    '«' + hi('Colossians 3:13') + '» — कलस्सियों ३:१३ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/asha.html',
    '«अब आशा के परमेश्वर तुम्हें विश्वास में सब प्रकार की खुशी और शांति से भर दे, कि तुम पवित्र आत्मा की सामर्थ से आशा में बहुत बढ़ते जाओ।» — रोमियों १५:१३ <span class="section-note" style="display:inline;font-size:0.85em;">(१८५१ हिंदी परंपरा)</span>',
    '«' + hi('Romans 15:13') + '» — रोमियों १५:१३ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/asha.html',
    '«क्योंकि मैं उन विचारों को जानता हूँ जो मैं तुम्हारे विषय में सोचता हूँ, यहोवा की यह वाणी है, कि शांति के विचार हैं, बुराई के नहीं, कि तुम्हारा अन्त आशा से हो।» — यिर्मयाह २९:११ <span class="section-note" style="display:inline;font-size:0.85em;">(पुरानी हिंदी परंपरा)</span>',
    '«' + hi('Jeremiah 29:11') + '» — यिर्मयाह २९:११ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/asha.html',
    '«जो आत्मा के लिए एक स्थिर और दृढ़ लंगर की नाईं है।» — इब्रानियों ६:१९ <span class="section-note" style="display:inline;font-size:0.85em;">(पुरानी हिंदी परंपरा)</span>',
    '«' + hi('Hebrews 6:19') + '» — इब्रानियों ६:१९ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/akelapan.html',
    '«मैं तुझे कभी न छोड़ूँगा और न कभी त्यागूँगा।» — इब्रानियों १३:५ <span class="section-note" style="display:inline;font-size:0.85em;">(१८५१ हिंदी बाइबल परंपरा के साथ मेल)</span>',
    '«' + hi('Hebrews 13:5') + '» — इब्रानियों १३:५ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/akelapan.html',
    '«परमेश्वर अकेले रहनेवालों को घर में बसाता है…» — भजन संहिता ६८:६ <span class="section-note" style="display:inline;font-size:0.85em;">(KJV के साथ मेल)</span>',
    '«' + hi('Psalms 68:6') + '» — भजन संहिता ६८:६ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/shanti.html',
    '«शांति छोड़ता हूँ, तुम्हें अपनी शांति देता हूँ…» — यूहन्ना १४:२७ <span class="section-note" style="display:inline;font-size:0.85em;">(१८५१ हिंदी बाइबल परंपरा के साथ मेल)</span>',
    '«' + hi('John 14:27') + '» — यूहन्ना १४:२७ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>'],
  ['hi/shanti.html',
    '«और परमेश्वर की शांति जो सब समझ से ऊँची है, तुम्हारे मनों को… रक्षा करेगी…» — फिलिप्पियों ४:७ <span class="section-note" style="display:inline;font-size:0.85em;">(KJV के साथ मेल)</span>',
    '«' + hi('Philippians 4:7') + '» — फिलिप्पियों ४:७ <span class="section-note" style="display:inline;font-size:0.85em;">(हिन्दी IRV 2019)</span>']
];

const HI_CREDIT =
  'उद्धृत वचन: <strong>हिन्दी IRV 2019</strong> (© Bridge Connectivity Solutions, <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="license">CC BY-SA 4.0</a>)। साइट के औज़ार अंग्रेज़ी में रहते हैं; बाइबल टूल पर अक्सर <abbr title="King James Version" lang="en">KJV</abbr> दिखता है। <a href="/bible-credits.html#locale-hi">क्रेडिट</a>।';

const KJV_HOPE = [
  ['“' + kjv('Romans 15:13') + '” — Romans 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>', 'Romans 15:13'],
  ['“' + kjv('Jeremiah 29:11') + '” — Jeremiah 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>', 'Jeremiah 29:11'],
  ['“' + kjv('Hebrews 6:19') + '” — Hebrews 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>', 'Hebrews 6:19']
];

function main() {
  for (const [file, from, to] of PT_QUOTES) mustReplace(file, from, to);
  for (const [file, from, to] of HI_QUOTES) mustReplace(file, from, to);

  /* Hindi 1851 labels → IRV credit */
  const hiFiles = fs.readdirSync(path.join(root, 'hi')).filter((n) => n.endsWith('.html'));
  for (const name of hiFiles) {
    const rel = 'hi/' + name;
    let s = fs.readFileSync(path.join(root, rel), 'utf8');
    const orig = s;
    s = s.replace(/१८५१ हिंदी बाइबल परंपरा \(public domain\)/g, 'हिन्दी IRV 2019 (CC BY-SA 4.0)');
    s = s.replace(/1851 Hindi Bible tradition \(public domain\)/g, 'Hindi IRV 2019 (CC BY-SA 4.0, Bridge Connectivity Solutions)');
    s = s.replace(/1851 Hindi Bible tradition \(Presbyterian Press, Allahabad; public domain\)/g, 'Hindi IRV 2019 (CC BY-SA 4.0, Bridge Connectivity Solutions)');
    s = s.replace(/1851-tradition samples on pilots/g, 'IRV 2019 on topic pages, credited CC BY-SA');
    s = s.replace(/१८५१ हिंदी बाइबल \(सार्वजनिक डोमेन\)/g, 'हिन्दी IRV 2019 (CC BY-SA 4.0)');
    s = s.replace(/१८५१ हिंदी बाइबल परंपरा/g, 'हिन्दी IRV 2019');
    s = s.replace(/१८५१ हिंदी परंपरा, सार्वजनिक डोमेन/g, 'हिन्दी IRV 2019, CC BY-SA 4.0');
    s = s.replace(/१८५१ हिंदी परंपरा/g, 'हिन्दी IRV 2019');
    s = s.replace(/१८५१ हिंदी बाइबल/g, 'हिन्दी IRV 2019');
    s = s.replace(/पुरानी हिंदी बाइबल परंपरा/g, 'हिन्दी IRV 2019');
    s = s.replace(/उद्धृत वचन: <strong>हिन्दी IRV 2019<\/strong> \(Presbyterian Press, इलाहाबाद\) की <strong>सार्वजनिक डोमेन<\/strong> परंपरा। साइट के औज़ार अंग्रेज़ी में रहते हैं; बाइबल टूल पर अक्सर <abbr title="King James Version" lang="en">KJV<\/abbr> दिखता है।/g, HI_CREDIT);
    if (s.includes('उद्धृत वचन:') && s.includes('Presbyterian Press')) {
      s = s.replace(/उद्धृत वचन:[\s\S]*?दिखता है।/g, HI_CREDIT);
    }
    if (s !== orig) {
      fs.writeFileSync(path.join(root, rel), s);
      console.log('relabeled', rel);
    }
  }

  /* Indonesian hope: Terjemahan Baru is not PD */
  mustReplace(
    'id/harapan.html',
    'Ayat di halaman ini dalam bahasa Indonesia; di alat berbahasa Inggris teks Alkitab di layar biasanya <abbr title="King James Version" lang="en">KJV</abbr>.',
    'Ayat di halaman ini adalah <abbr title="King James Version" lang="en">KJV</abbr> (Inggris, domain publik di Amerika Serikat). Penjelasan dalam bahasa Indonesia. Kami tidak menyimpan Terjemahan Baru.'
  );
  mustReplace(
    'id/harapan.html',
    'Teks yang dikutip: <strong>terjemahan Indonesia domain publik umum</strong> (warisan terbuka). Alat situs biasanya <strong>bahasa Inggris</strong>; di alat Alkitab tampil umumnya <abbr title="King James Version" lang="en">KJV</abbr>.',
    'Teks yang dikutip: <strong>King James Version</strong> (domain publik di Amerika Serikat). Belum ada Alkitab Indonesia domain publik di situs ini — kami tidak memakai Terjemahan Baru. Alat situs biasanya <strong>bahasa Inggris</strong>.'
  );
  mustReplace(
    'id/harapan.html',
    '«Kiranya Allah, sumber pengharapan, memenuhi kamu dengan segala sukacita dan damai sejahtera dalam percayamu, supaya oleh kekuatan Roh Kudus kamu berlimpah-limpah dalam pengharapan.» — Roma 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(terjemahan domain publik umum)</span>',
    '&ldquo;' + kjv('Romans 15:13') + '&rdquo; — Romans 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>'
  );
  mustReplace(
    'id/harapan.html',
    '«Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan celaka, untuk memberikan kepadamu hari depan yang penuh harapan.» — Yeremia 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(terjemahan domain publik umum)</span>',
    '&ldquo;' + kjv('Jeremiah 29:11') + '&rdquo; — Jeremiah 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>'
  );
  mustReplace(
    'id/harapan.html',
    '«Sebagai sauh yang kokoh dan aman bagi jiwa kita.» — Ibrani 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(terjemahan domain publik umum)</span>',
    '&ldquo;' + kjv('Hebrews 6:19') + '&rdquo; — Hebrews 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>'
  );

  /* Swahili: no stored PD catalog — do not claim Krapf / umma Bible */
  mustReplace(
    'sw/wasiwasi.html',
    'Nakala iliyotajwa: <strong>Kiswahili cha hadhi ya umma</strong>, kufuatana na <strong>misingi ya tafsiri za kale</strong> (ikiwemo mchango wa Krapf na matini ya karne ya 19). Zana za tovuti ni <strong>Kiingereza</strong> kwa kawaida; katika zana ya Biblia huonekana <abbr title="King James Version" lang="en">KJV</abbr>.',
    'Aya iliyonukuliwa ni <strong>King James Version</strong> (hadhi ya umma nchini Marekani). Bado hatuna Biblia ya Kiswahili ya hadhi ya umma kwenye tovuti hii. Zana ni <strong>Kiingereza</strong> kwa kawaida.'
  );
  mustReplace(
    'sw/wasiwasi.html',
    '«Mpe BWANA mzigo wako, naye atakusimamisha; hatawacha mwenye haki kutetemeka.» — Zaburi 55:22 <span class="section-note" style="display:inline;font-size:0.85em;">(Kiswahili cha umma)</span>',
    '&ldquo;' + kjv('Psalms 55:22') + '&rdquo; — Psalm 55:22 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>'
  );
  mustReplace(
    'sw/wasiwasi.html',
    '«Mkiwatupia juu yake yote yenyu ya kuwasumbua, maana yeye anawahusisha ninyi.» — 1 Petro 5:7 <span class="section-note" style="display:inline;font-size:0.85em;">(Kiswahili cha umma)</span>',
    '&ldquo;' + kjv('1 Peter 5:7') + '&rdquo; — 1 Peter 5:7 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>'
  );
  mustReplace(
    'sw/tumaini.html',
    'Nakala: <strong>Kiswahili cha hadhi ya umma</strong>, kufuatana na misingi ya tafsiri za kale. Zana ni <strong>Kiingereza</strong> kwa kawaida; katika zana ya Biblia huonekana <abbr title="King James Version" lang="en">KJV</abbr>.',
    'Aya iliyonukuliwa ni <strong>King James Version</strong> (hadhi ya umma nchini Marekani). Bado hatuna Biblia ya Kiswahili ya hadhi ya umma kwenye tovuti hii. Zana ni <strong>Kiingereza</strong> kwa kawaida.'
  );
  mustReplace(
    'sw/tumaini.html',
    '«Na Mungu wa tumaini awajaze ninyi furaha yote na amani katika kuamini, mpate kustawi katika tumaini kwa nguvu ya Roho Mtakatifu.» — Warumi 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Kiswahili cha umma)</span>',
    '&ldquo;' + kjv('Romans 15:13') + '&rdquo; — Romans 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>'
  );
  mustReplace(
    'sw/tumaini.html',
    '«Kwa maana nayajua mawazo ninayowawazia ninyi, asema Bwana, ni mawazo ya amani wala si ya mabaya, kuwapa ninyi tumaini katika mwisho wenu.» — Yeremia 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(Kiswahili cha umma)</span>',
    '&ldquo;' + kjv('Jeremiah 29:11') + '&rdquo; — Jeremiah 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>'
  );
  mustReplace(
    'sw/tumaini.html',
    '«Tunayonayo kama nanga ya roho, salama na imara.» — Waebrania 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(Kiswahili cha umma)</span>',
    '&ldquo;' + kjv('Hebrews 6:19') + '&rdquo; — Hebrews 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>'
  );

  /* Tagalog hope: unverified “domain publiko” paraphrase → KJV */
  mustReplace(
    'tl/pagasa.html',
    'Mga siping talata: <strong>Tagalog na nasa domain publiko</strong> (nakapaloob sa malayang tradisyon). Ang mga tool ay karaniwang <strong>Ingles</strong>; sa Bible tool ang teksto sa screen ay <abbr title="King James Version" lang="en">KJV</abbr>.',
    'Mga siping talata: <strong>King James Version</strong> (pampublikong domain sa Estados Unidos). Wala pa kaming buong Bibliyang Tagalog na domain publiko sa site na ito. Ang mga tool ay karaniwang <strong>Ingles</strong>.'
  );
  mustReplace(
    'tl/pagasa.html',
    '«At pagpalain kayo ng Dios ng pag-asa na lubos kayong pagalak at payapain sa pananampalataya, upang kayo’y magsipagmala ng pag-asa sa pamamagitan ng kapangyarihan ng Espiritu Santo.» — Roma 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Tagalog, domain publiko)</span>',
    '&ldquo;' + kjv('Romans 15:13') + '&rdquo; — Romans 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>'
  );
  mustReplace(
    'tl/pagasa.html',
    '«Sapagka’t aking nalalaman ang mga pagiisip na aking iniisip sa inyo, sabi ng Panginoon, mga pagiisip tungkol sa kapayapaan, at hindi tungkol sa kasamaan, upang bigyan kayo ng pag-asa sa inyong wakas.» — Jeremias 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(Tagalog, domain publiko)</span>',
    '&ldquo;' + kjv('Jeremiah 29:11') + '&rdquo; — Jeremiah 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>'
  );
  mustReplace(
    'tl/pagasa.html',
    '«Na siyang parang isang angkla ng kaluluwa, na matibay at matatag.» — Hebreo 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(Tagalog, domain publiko)</span>',
    '&ldquo;' + kjv('Hebrews 6:19') + '&rdquo; — Hebrews 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(KJV)</span>'
  );

  console.log('legal-fix-unverified-scripture: done');
}

main();
