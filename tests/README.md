# Playwright Tests

## First-time setup

Install Chromium (run once, or when Playwright is upgraded):

```bash
npx playwright install chromium
```

For system dependencies (Linux):

```bash
npx playwright install --with-deps chromium
```

> **Note:** Do not put shell comments on the same line. `npx playwright install chromium # first time` fails because `#`, `first`, and `time` are parsed as install targets.

## Running tests

```bash
npm run build
npx playwright install chromium
npm run test:playwright:seeds
```

`test:playwright:seeds` forces `QA_URL=` so tests run against **localhost:8080**. Playwright auto-starts `npx serve dist -p 8080` before tests (see `webServer` in `playwright.config.ts`). Production has Trusted Types CSP issues that block Prayer Wall seeds—local is required for reliable results.

To test against production (seeds may fail due to CSP):

```bash
QA_URL=https://www.todaysdailybattle.com npm run test:playwright:seeds
```

## Trusted Types / DOMPurify

`DOMPurify.setConfig({ TRUSTED_TYPES_POLICY: ... })` is **browser code** in `index.html`—it runs when the page loads. Do not run it in the terminal; it will fail with `zsh: unknown file attribute`.
