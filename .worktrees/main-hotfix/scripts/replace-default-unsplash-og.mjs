/**
 * Replaces the legacy default Unsplash OG/Twitter image URL with first-party share art.
 * Skips shop (product photos) and 404-admin (different asset).
 * Run: node scripts/replace-default-unsplash-og.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const OLD =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
const NEW = 'https://todaysdailybattle.com/assets/share/verse-share.jpg?v=20260410og';

const SKIP_FILES = new Set(['shop.html', '404-admin.html']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(full);
    } else if (e.name.endsWith('.html') && !SKIP_FILES.has(e.name)) {
      let s = fs.readFileSync(full, 'utf8');
      if (!s.includes(OLD)) continue;
      const next = s.split(OLD).join(NEW);
      if (next !== s) {
        fs.writeFileSync(full, next, 'utf8');
        console.log('updated', path.relative(root, full));
      }
    }
  }
}

walk(root);
console.log('replace-default-unsplash-og: done');
