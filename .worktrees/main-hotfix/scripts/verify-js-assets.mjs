#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const required = ['register-sw.js', 'kids-shared.js'];

for (const file of required) {
  if (!fs.existsSync(path.join(dist, file))) {
    console.error('verify-js-assets: missing dist/' + file);
    process.exit(1);
  }
}

console.log('verify-js-assets: OK (' + required.join(', ') + ')');
