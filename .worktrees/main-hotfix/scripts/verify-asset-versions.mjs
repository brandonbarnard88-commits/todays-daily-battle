import fs from 'fs';
import path from 'path';
import {
  SITE_ASSET_VERSION,
  SITE_VERSIONED_ASSETS,
  root,
} from './site-asset-version.mjs';

const TARGETS = [
  { label: 'source', dir: root },
  { label: 'dist', dir: path.join(root, 'dist') },
];
const SKIP_DIRS = new Set(['.git', 'node_modules']);

function walkHtml(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walkHtml(path.join(dir, entry.name), results);
      continue;
    }
    if (entry.name.endsWith('.html')) {
      results.push(path.join(dir, entry.name));
    }
  }
  return results;
}

function findMismatches(html, assetName) {
  const escaped = assetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const quotedPathRe = new RegExp(`["'][^"']*${escaped}(?:\\?v=([^"']*))?["']`, 'g');
  const mismatches = [];
  let match;
  while ((match = quotedPathRe.exec(html))) {
    const version = match[1] || '';
    if (version !== SITE_ASSET_VERSION) {
      mismatches.push(match[0]);
    }
  }
  return mismatches;
}

function main() {
  const failures = [];
  for (const target of TARGETS) {
    const files = walkHtml(target.dir);
    for (const fullPath of files) {
      const html = fs.readFileSync(fullPath, 'utf8');
      for (const assetName of SITE_VERSIONED_ASSETS) {
        const mismatches = findMismatches(html, assetName);
        if (!mismatches.length) continue;
        failures.push({
          file: path.relative(root, fullPath),
          assetName,
          examples: mismatches.slice(0, 3),
        });
      }
    }
  }

  if (failures.length) {
    console.error(`verify-asset-versions: found ${failures.length} mismatched references (expected ${SITE_ASSET_VERSION}).`);
    failures.slice(0, 20).forEach((failure) => {
      console.error(`- ${failure.file}: ${failure.assetName} -> ${failure.examples.join(', ')}`);
    });
    process.exit(1);
  }

  console.log(`verify-asset-versions: OK (${SITE_ASSET_VERSION})`);
}

main();
