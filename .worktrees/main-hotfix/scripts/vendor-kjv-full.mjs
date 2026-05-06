import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'data', 'kjv-full.json');
const BASE = 'https://raw.githubusercontent.com/aruljohn/Bible-kjv/master';

async function fetchBookNames() {
  const res = await fetch(`${BASE}/Books.json`);
  if (!res.ok) throw new Error(`Failed to fetch Books.json: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || !data.length) throw new Error('Books.json returned no book names');
  return data;
}

async function fetchBook(book) {
  const candidates = [book, book.replace(/\s+/g, '')];
  for (const candidate of candidates) {
    const res = await fetch(`${BASE}/${encodeURIComponent(candidate)}.json`);
    if (res.ok) return res.json();
  }
  throw new Error(`Failed to fetch ${book}: 404`);
}

async function main() {
  const verseMap = {};
  const books = await fetchBookNames();
  for (const book of books) {
    const data = await fetchBook(book);
    const displayBook = data.book || book;
    const chapters = Array.isArray(data.chapters) ? data.chapters : [];
    chapters.forEach((chapterEntry) => {
      const chapter = Number(chapterEntry.chapter);
      const verses = Array.isArray(chapterEntry.verses) ? chapterEntry.verses : [];
      verses.forEach((verseEntry) => {
        const verse = Number(verseEntry.verse);
        const text = String(verseEntry.text || '').replace(/\s+/g, ' ').trim();
        if (!chapter || !verse || !text) return;
        verseMap[`${displayBook} ${chapter}:${verse}`] = text;
      });
    });
  }
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(verseMap)}\n`, 'utf8');
  console.log(`vendor-kjv-full: wrote ${Object.keys(verseMap).length} verses`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
