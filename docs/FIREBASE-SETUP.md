# Firebase Setup — Push Notifications

Do these steps once. You need a Google account and (for scheduled functions) Firebase Blaze plan.

---

## 1. Create / link Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com).
2. Create a new project (or select existing) → add a **Web** app if you haven’t.
3. In **Project settings** → **General** → **Your apps** → copy:
   - **API Key**
   - **Project ID**
   - **Messaging sender ID**
   - **App ID**
   - (Optional) **Auth domain**, **Storage bucket**
4. In **Project settings** → **Cloud Messaging** → **Web Push certificates**: copy **Key pair** (optional; used for FCM getToken).

---

## 2. Install CLI and deploy functions (your machine)

From the **project root** (not inside `firebase-functions/`):

```bash
# If you haven’t already
npm install -g firebase-tools
firebase login
firebase use --add
# → Pick your Firebase project, alias e.g. default

# Deploy
cd firebase-functions
npm install
cd ..
firebase deploy --only functions
```

After deploy, copy the **savePushToken** URL from the output, e.g.:

`https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/savePushToken`

---

## 3. Set config.js (you do this — never commit real keys)

Create or edit `config.js` (from `config.example.js`). Set:

| Key | Value |
|-----|--------|
| `FIREBASE_API_KEY` | From step 1 |
| `FIREBASE_PROJECT_ID` | From step 1 |
| `FIREBASE_MESSAGING_SENDER_ID` | From step 1 |
| `FIREBASE_APP_ID` | From step 1 |
| `FIREBASE_AUTH_DOMAIN` | Optional: `YOUR_PROJECT_ID.firebaseapp.com` |
| `FIREBASE_STORAGE_BUCKET` | Optional: `YOUR_PROJECT_ID.appspot.com` |
| `FIREBASE_VAPID_KEY` | Optional: from Web Push key pair |
| **FCM_SUBSCRIBE_URL** | The savePushToken URL from step 2 |

Keep `config.js` out of git if it contains real keys (e.g. add to `.gitignore` or use env vars on your host).

---

## 4. (Optional) 9 AM verse — set function env vars

So `sendDailyVerseNotification` can fetch today’s verse from Supabase:

- **Firebase Console** → **Functions** → **sendDailyVerseNotification** → **Environment variables**
- Add:
  - `SUPABASE_URL` = your Supabase project URL (e.g. `https://xxxx.supabase.co`)
  - `SUPABASE_SERVICE_KEY` = Supabase **service_role** key (Project settings → API; keep secret)

---

## 5. Test

1. Deploy the site with the new `config.js` (or run locally with config).
2. On the site, turn on the push / streak reminder toggle → allow notifications.
3. Check **Firebase Console** → **Firestore** (or your token store) for a new token.
4. Wait for 9 AM America/Chicago (or temporarily set the schedule to “every minute” in `sendDailyVerseNotification.js`, deploy, then test).

---

**Summary:** You create the project, run `firebase login` / `firebase use --add` / `firebase deploy --only functions`, paste keys and savePushToken URL into `config.js`, and optionally set SUPABASE_URL/SUPABASE_SERVICE_KEY on the function. The repo is ready; the rest is one-time setup on your side.
