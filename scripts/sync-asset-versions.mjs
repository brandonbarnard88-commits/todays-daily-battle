import fs from 'fs';
import path from 'path';
import {
  SITE_ASSET_VERSION,
  root,
  syncSiteAssetVersions,
} from './site-asset-version.mjs';

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist']);

function walkHtml(dir, results = []) {
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

function main() {
  const htmlFiles = walkHtml(root);
  let changed = 0;
  for (const fullPath of htmlFiles) {
    const original = fs.readFileSync(fullPath, 'utf8');
    const next = syncSiteAssetVersions(original, SITE_ASSET_VERSION);
    if (next === original) continue;
    fs.writeFileSync(fullPath, next, 'utf8');
    console.log('updated', path.relative(root, fullPath));
    changed += 1;
  }
  console.log('sync-asset-versions:', changed, 'HTML files updated to', SITE_ASSET_VERSION);
}

main();
