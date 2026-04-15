import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.join(__dirname, '..');
export const SITE_ASSET_VERSION_PATH = path.join(root, 'SITE-ASSET-VERSION');

export function readRequiredTrimmedFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} is missing.`);
  }
  const value = fs.readFileSync(filePath, 'utf8').trim();
  if (!value) {
    throw new Error(`${label} is empty.`);
  }
  return value;
}

export const SITE_ASSET_VERSION = readRequiredTrimmedFile(
  SITE_ASSET_VERSION_PATH,
  'SITE-ASSET-VERSION'
);

export const SITE_VERSIONED_ASSETS = [
  'script.js',
  'styles.css',
  'tdb-quiet-luxury.css',
  'tt-bootstrap.js',
  'share-page.js',
  'footer-build-stamp.js',
  'language-switcher.js'
];

export function replaceAssetVersionInText(text, assetName, version) {
  const escaped = assetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const quotedPathRe = new RegExp(`(["'][^"']*${escaped})(?:\\?v=[^"']*)?(["'])`, 'g');
  return text.replace(quotedPathRe, `$1?v=${version}$2`);
}

export function syncSiteAssetVersions(text, version = SITE_ASSET_VERSION) {
  let next = text;
  for (const assetName of SITE_VERSIONED_ASSETS) {
    next = replaceAssetVersionInText(next, assetName, version);
  }
  return next;
}
