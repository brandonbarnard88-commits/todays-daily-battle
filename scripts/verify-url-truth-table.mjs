#!/usr/bin/env node
/**
 * Ensures config/urls-truth-table.json matches _redirects and key vercel.json routes.
 * Run: node scripts/verify-url-truth-table.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const tablePath = path.join(root, 'config', 'urls-truth-table.json');
const redirectsPath = path.join(root, '_redirects');
const vercelPath = path.join(root, 'vercel.json');

function parseRedirectLines(raw) {
  const lines = [];
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const parts = t.split(/\s+/);
    if (parts.length < 3) continue;
    const from = parts[0];
    const to = parts[1];
    const code = parts.slice(2).join(' ');
    lines.push({ from, to, code, raw: t });
  }
  return lines;
}

function hasRule(lines, from, to, expectedCode) {
  return lines.some((r) => {
    if (r.from !== from || r.to !== to) return false;
    if (r.code === expectedCode) return true;
    // Cloudflare force flag: 301! still satisfies a 301 truth-table entry.
    if (r.code === `${expectedCode}!`) return true;
    return false;
  });
}

function main() {
  if (!fs.existsSync(tablePath)) {
    console.error('verify-url-truth-table: missing', path.relative(root, tablePath));
    process.exit(1);
  }
  if (!fs.existsSync(redirectsPath)) {
    console.error('verify-url-truth-table: missing _redirects');
    process.exit(1);
  }

  const table = JSON.parse(fs.readFileSync(tablePath, 'utf8'));
  const entries = table.entries || [];
  const lines = parseRedirectLines(fs.readFileSync(redirectsPath, 'utf8'));
  const errors = [];

  for (const entry of entries) {
    const aliases = entry.aliases || [];
    if (entry.redirect) {
      const to = entry.redirect.to;
      const status = entry.redirect.status;
      const code = String(status);
      for (const a of aliases) {
        if (!hasRule(lines, a, to, code)) {
          errors.push(
            `Missing _redirects rule: ${a} → ${to} ${code} (entry ${entry.id || '?'})`
          );
        }
      }
    } else if (entry.rewrite) {
      const to = entry.rewrite.to;
      const code = `${entry.rewrite.status}!`;
      for (const a of aliases) {
        if (!hasRule(lines, a, to, code)) {
          errors.push(
            `Missing _redirects rewrite: ${a} → ${to} ${code} (entry ${entry.id || '?'})`
          );
        }
      }
    }
  }

  if (fs.existsSync(vercelPath)) {
    const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    const redirects = vercel.redirects || [];
    const rewrites = vercel.rewrites || [];

    function vercelHasRedirect(source, destination) {
      return redirects.some((r) => r.source === source && r.destination === destination);
    }
    function vercelHasRewrite(source, destination) {
      return rewrites.some((r) => r.source === source && r.destination === destination);
    }

    for (const entry of entries) {
      if (entry.redirect) {
        const to = entry.redirect.to;
        for (const a of entry.aliases || []) {
          if (!vercelHasRedirect(a, to)) {
            errors.push(`vercel.json: missing redirect ${a} → ${to} (entry ${entry.id || '?'})`);
          }
        }
      } else if (entry.rewrite) {
        const to = entry.rewrite.to;
        for (const a of entry.aliases || []) {
          if (!vercelHasRewrite(a, to) && !vercelHasRedirect(a, to)) {
            errors.push(`vercel.json: missing rewrite or redirect ${a} → ${to} (entry ${entry.id || '?'})`);
          }
        }
      }
    }
  }

  if (errors.length) {
    console.error('verify-url-truth-table: FAILED\n');
    errors.forEach((e) => console.error('  ', e));
    process.exit(1);
  }
  console.log('verify-url-truth-table: OK (', entries.length, 'entries)');
}

main();
