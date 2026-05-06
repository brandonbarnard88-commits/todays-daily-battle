#!/usr/bin/env node
/**
 * Deploy ./dist to Cloudflare Pages (after a local or CI `npm run build`).
 * Requires: npx wrangler, CF_PAGES_PROJECT_NAME, and Cloudflare API auth
 * (CLOUDFLARE_API_TOKEN or `wrangler login`).
 *
 * Usage: CF_PAGES_PROJECT_NAME=your-pages-project npm run deploy:cf-pages
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const project = process.env.CF_PAGES_PROJECT_NAME?.trim();
if (!project) {
  console.error('deploy-cf-pages: set CF_PAGES_PROJECT_NAME to your Cloudflare Pages project name.');
  process.exit(1);
}

const r = spawnSync(
  'npx',
  ['--yes', 'wrangler@latest', 'pages', 'deploy', 'dist', '--project-name', project],
  { cwd: root, stdio: 'inherit', env: process.env }
);
process.exit(r.status ?? 1);
