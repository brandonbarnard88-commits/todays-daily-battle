#!/usr/bin/env node
/**
 * Stop processes that are LISTENing on a TCP port (macOS/Linux: lsof).
 * Safe no-op when the port is free. Used before serve / Playwright / Lighthouse.
 *
 * Uses LISTEN-only lsof (`-sTCP:LISTEN`) — plain `lsof -i :port` can include
 * client PIDs (e.g. browsers), not just the server.
 */
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

/**
 * @param {number} [port=8080]
 * @returns {Promise<void>}
 */
export async function freePort(port = 8080) {
  let output;
  try {
    output = execSync(`lsof -nP -iTCP:${port} -sTCP:LISTEN -t`, {
      encoding: 'utf8',
    }).trim();
  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e && e.status === 1) return;
    console.error('freePort error:', e);
    return;
  }
  if (!output) return;

  const pids = output
    .split('\n')
    .map((p) => parseInt(p, 10))
    .filter((n) => !Number.isNaN(n));

  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGTERM');
      await new Promise((r) => setTimeout(r, 500));
      if (process.kill(pid, 0)) {
        console.warn(`Port ${port} process ${pid} ignored SIGTERM, sending SIGKILL`);
        process.kill(pid, 'SIGKILL');
      }
    } catch (e) {
      if (e && typeof e === 'object' && 'code' in e && e.code === 'ESRCH') {
        /* no such process — already exited */
      } else {
        throw e;
      }
    }
  }
}

// CLI mode only when run directly (argv[1] missing when evaluated via import in -e, etc.)
if (process.argv[1] && resolve(__filename) === resolve(process.argv[1])) {
  const port =
    process.argv[2] !== undefined ? parseInt(process.argv[2], 10) : 8080;
  if (Number.isNaN(port)) {
    console.error('Usage: node scripts/free-port.mjs [port]');
    process.exit(1);
  }
  freePort(port)
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
