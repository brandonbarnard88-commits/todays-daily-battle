import fs from 'fs';
import path from 'path';
import {
  SITE_ASSET_VERSION,
  root,
  syncSiteAssetVersions,
} from './site-asset-version.mjs';

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.worktrees']);
const DIST_SKIP = new Set(['.git', 'node_modules']);

function walkHtml(dir, results = [], dirSkip) {
  const skip = dirSkip || SKIP_DIRS;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (skip.has(entry.name)) continue;
      walkHtml(path.join(dir, entry.name), results, skip);
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
  const distDir = path.join(root, 'dist');
  if (fs.existsSync(distDir)) {
    walkHtml(distDir, htmlFiles, DIST_SKIP);
  }
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
