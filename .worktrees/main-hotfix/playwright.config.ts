import { defineConfig, devices } from '@playwright/test';

// Cursor/agent sandboxes sometimes set PLAYWRIGHT_BROWSERS_PATH to an incomplete cache; drop it so Playwright uses a real install.
if (
  typeof process.env.PLAYWRIGHT_BROWSERS_PATH === 'string' &&
  process.env.PLAYWRIGHT_BROWSERS_PATH.includes('cursor-sandbox-cache')
) {
  delete process.env.PLAYWRIGHT_BROWSERS_PATH;
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60000,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: process.env.QA_URL || 'http://localhost:8080',
    trace: 'on-first-retry',
    /* Avoid stale script.js from an old service worker cache (local `serve dist` + SW caused prayer-wall-ready flakes). */
    serviceWorkers: 'block',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: process.env.QA_URL ? undefined : {
    command: 'node scripts/free-port.mjs 8080 && npx -y serve dist -p 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
