# Push Notifications: "Verse Ready" + "Streak Alert"

The site uses **Firebase Cloud Messaging (FCM)** for push. Users opt in via the **8 AM streak reminder** toggle on the homepage; the client calls `tdbFirebasePushSubscribe()` and POSTs the FCM token to `FCM_SUBSCRIBE_URL`. The **backend** is responsible for sending the actual notifications.

## 1. Verse ready (daily)

Send once per day at a fixed time (e.g. **9:00 AM** in your server timezone or per-user `preferred_time`):

- **Title:** `Your verse is ready! 🔥`
- **Body:** `Today's verse is waiting. Tap to open.`
- **Payload (optional):** `{ "url": "https://todaysdailybattle.com/" }` so the service worker opens the site on click.

Use **Firebase Admin SDK** (Node) or **FCM HTTP v1** to send to all stored tokens. Example (Node):

```js
const admin = require('firebase-admin');
admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });

async function sendVerseReady(tokens) {
  const message = {
    notification: {
      title: "Your verse is ready! 🔥",
      body: "Today's verse is waiting. Tap to open.",
    },
    data: { url: "https://todaysdailybattle.com/" },
    tokens,
  };
  const res = await admin.messaging().sendEachForMulticast(message);
  return res;
}
```

Run this from a **cron job** (e.g. Vercel Cron, GitHub Actions, or Cloudflare Worker) at 9 AM. Fetch tokens from your DB (where `FCM_SUBSCRIBE_URL` stores them when the client subscribes).

## 2. Streak alert (don’t break the streak)

For users who have a **streak ≥ 1** but **haven’t done today’s battle** yet, send a second notification later in the day (e.g. **6 PM**):

- **Title:** `Don’t break your streak! 🔥`
- **Body:** `Your verse is waiting. One tap to keep your streak alive.`
- **Payload:** `{ "url": "https://todaysdailybattle.com/" }`

To know “has streak” and “has done today,” you need either:

- **Backend streak state:** Store streak count and “last_completed_date” when the client reports (e.g. after they complete today’s battle), or  
- **Only send “Verse ready”** and skip streak-specific logic until you have that data.

If you don’t track streak on the server yet, sending only **Verse ready** at 9 AM is enough; the copy already says “Your verse is ready.”

## 3. Client setup (already done)

- **firebase-push.js** registers the service worker, requests permission, gets the FCM token, dedupes token submits, and POSTs it to `FCM_SUBSCRIBE_URL`.
- When users turn reminders off, the client can POST token removal to optional `FCM_UNSUBSCRIBE_URL`.
- **Streak push toggle** (homepage) calls `tdbFirebasePushSubscribe()` when the user turns on “8 AM streak reminder.”
- **service-worker.js** handles the `push` event and shows the notification; `notificationclick` opens `data.url` or `/`.

Ensure **config.js** has Firebase config (`FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`) and **FCM_SUBSCRIBE_URL** pointing to your endpoint that saves the token. Then implement the cron + send logic above.
