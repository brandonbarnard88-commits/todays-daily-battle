# App Wrapper Setup (Capacitor)

This repo is already PWA-ready. The simplest "app" is the PWA install.
If you want App Store / Play Store builds, use Capacitor.

## 1) Install Node.js
Install Node.js (LTS) so you have `node` and `npm` available.

## 2) Install Capacitor
From the repo root:

```
npm init -y
npm install @capacitor/core @capacitor/cli
```

## 3) Initialize Capacitor

```
npx cap init "Today's Daily Battle" com.todaysdailybattle.app --web-dir=.
```

The config is already provided in `capacitor.config.json`.

## 4) Add platforms

```
npx cap add android
npx cap add ios
```

## 5) Open in native IDEs

```
npx cap open android
npx cap open ios
```

## Notes
- The app loads the live site via `server.url` in `capacitor.config.json`.
- When you're ready to bundle local assets, set `server.url` to empty and
  point `webDir` to a build folder (e.g., `www/`).
