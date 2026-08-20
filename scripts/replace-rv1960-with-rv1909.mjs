#!/usr/bin/env node
/**
 * Remove Reina-Valera 1960 (not public domain) from the site.
 * Spanish Scripture quotes become Reina-Valera 1909 from data/bibles/es-rv1909.json.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { localeTextForRef, localeBibleDir } from './lib/locale-bible.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SKIP_DIR = new Set([
  'node_modules',
  'dist',
  '.git',
  '.worktrees',
  'next-app',
  'archive',
  'api',
  'lighthouse-runs'
]);

const ES_BOOK = {
  Génesis: 'Genesis',
  Genesis: 'Genesis',
  Éxodo: 'Exodus',
  Exodo: 'Exodus',
  Levítico: 'Leviticus',
  Números: 'Numbers',
  Deuteronomio: 'Deuteronomy',
  Josué: 'Joshua',
  Jueces: 'Judges',
  Rut: 'Ruth',
  '1 Samuel': '1 Samuel',
  '2 Samuel': '2 Samuel',
  '1 Reyes': '1 Kings',
  '2 Reyes': '2 Kings',
  '1 Crónicas': '1 Chronicles',
  '2 Crónicas': '2 Chronicles',
  Esdras: 'Ezra',
  Nehemías: 'Nehemiah',
  Ester: 'Esther',
  Job: 'Job',
  Salmos: 'Psalms',
  Salmo: 'Psalms',
  Proverbios: 'Proverbs',
  Eclesiastés: 'Ecclesiastes',
  'Cantar de los Cantares': 'Song of Solomon',
  Isaías: 'Isaiah',
  Jeremías: 'Jeremiah',
  Lamentaciones: 'Lamentations',
  Ezequiel: 'Ezekiel',
  Daniel: 'Daniel',
  Oseas: 'Hosea',
  Joel: 'Joel',
  Amós: 'Amos',
  Abdías: 'Obadiah',
  Jonás: 'Jonah',
  Miqueas: 'Micah',
  Nahum: 'Nahum',
  Habacuc: 'Habakkuk',
  Sofonías: 'Zephaniah',
  Hageo: 'Haggai',
  Zacarías: 'Zechariah',
  Malaquías: 'Malachi',
  'San Mateo': 'Matthew',
  Mateo: 'Matthew',
  Marcos: 'Mark',
  'San Lucas': 'Luke',
  Lucas: 'Luke',
  'San Juan': 'John',
  Juan: 'John',
  Hechos: 'Acts',
  Romanos: 'Romans',
  '1 Corintios': '1 Corinthians',
  '2 Corintios': '2 Corinthians',
  Gálatas: 'Galatians',
  Efesios: 'Ephesians',
  Filipenses: 'Philippians',
  Colosenses: 'Colossians',
  '1 Tesalonicenses': '1 Thessalonians',
  '2 Tesalonicenses': '2 Thessalonians',
  '1 Timoteo': '1 Timothy',
  '2 Timoteo': '2 Timothy',
  Tito: 'Titus',
  Filemón: 'Philemon',
  Hebreos: 'Hebrews',
  Santiago: 'James',
  '1 Pedro': '1 Peter',
  '2 Pedro': '2 Peter',
  '1 Juan': '1 John',
  '2 Juan': '2 John',
  '3 Juan': '3 John',
  Judas: 'Jude',
  Apocalipsis: 'Revelation'
};

function fail(msg) {
  console.error('replace-rv1960-with-rv1909:', msg);
  process.exit(1);
}

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIR.has(name) || name.startsWith('lighthouse-')) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(html|mjs|js)$/.test(name) && !name.includes('.min.')) out.push(p);
  }
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function lookupEs(bookEs, cv) {
  const kjvBook = ES_BOOK[bookEs.trim()];
  if (!kjvBook) return '';
  return localeTextForRef(root, 'es', kjvBook + ' ' + cv);
}

function replaceVerseQuotes(html, fileLabel) {
  return html.replace(/<p\b([^>]*class="[^"]*verse[^"]*"[^>]*)>([\s\S]*?)<\/p>/g, (full, attrs, inner) => {
    if (!/Reina-Valera 1960/.test(inner) && !/RV1960/.test(inner)) return full;
    const ref = inner.match(
      /(?:&mdash;|—)\s*([1-3]?\s*[A-Za-zÁÉÍÓÚáéíóúüñÑ.]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúüñÑ.]+){0,4})\s+(\d+:\d+)/
    );
    if (!ref) fail('verse labeled RV1960 without a parseable reference in ' + fileLabel);
    const text = lookupEs(ref[1].replace(/\./g, '').replace(/\s+/g, ' '), ref[2]);
    if (!text) fail('no RV1909 text for ' + ref[1] + ' ' + ref[2] + ' in ' + fileLabel);
    let next = inner.replace(
      /(&ldquo;|&laquo;|“|«)([\s\S]*?)(&rdquo;|&raquo;|”|»)/,
      '$1' + escapeHtml(text) + '$3'
    );
    next = next.replace(/Reina-Valera 1960/g, 'Reina-Valera 1909').replace(/RV1960/g, 'RV1909');
    return '<p' + attrs + '>' + next + '</p>';
  });
}

function relabel(html) {
  return html
    .replace(/Reina-Valera 1960/g, 'Reina-Valera 1909')
    .replace(/Reina Valera 1960/g, 'Reina-Valera 1909')
    .replace(/RV 1960/g, 'RV1909')
    .replace(/RV1960/g, 'RV1909');
}

function main() {
  const catalog = path.join(localeBibleDir(root), 'es-rv1909.json');
  if (!fs.existsSync(catalog)) fail('missing es-rv1909.json');
  const files = [];
  walk(root, files);
  let n = 0;
  for (const file of files) {
    const rel = path.relative(root, file);
    if (rel === 'scripts/replace-rv1960-with-rv1909.mjs') continue;
    if (rel === 'scripts/verify-no-rv1960.mjs') continue;
    let html = fs.readFileSync(file, 'utf8');
    if (!/Reina-Valera 1960|RV1960|RV 1960/.test(html)) continue;
    let next = replaceVerseQuotes(html, rel);
    next = relabel(next);
    if (next !== html) {
      fs.writeFileSync(file, next, 'utf8');
      n += 1;
    }
  }
  console.log('replace-rv1960-with-rv1909: updated', n, 'files');
}

main();
