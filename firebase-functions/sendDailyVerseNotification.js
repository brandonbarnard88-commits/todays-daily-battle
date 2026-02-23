/**
 * Firebase Cloud Function: daily 9 AM verse push notification for todaysdailybattle.com.
 * Backend logic only (no UI). Schedule: 9:00 AM in a chosen timezone (e.g. America/Chicago).
 *
 * Setup:
 * 1. Firebase project with Blaze plan (for scheduled functions).
 * 2. npm install firebase-admin firebase-functions in your functions folder.
 * 3. Store FCM tokens when client POSTs to your endpoint (e.g. Firestore collection "push_tokens" with field "token").
 * 4. Fetch today's verse from your API or Supabase (daily_battles table).
 * 5. Deploy: firebase deploy --only functions
 *
 * This file is the scheduled function only. You still need an HTTP endpoint to receive and store tokens (e.g. Firebase HTTPS function or your backend).
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Optional: Supabase URL/key to fetch today's verse server-side. Or call your own API.
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Fetch today's verse from Supabase daily_battles (or return a default).
 */
async function getTodaysVerse() {
  const today = getTodayKey();
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/daily_battles?date=eq.${today}&select=verse_ref,reflection,prayer&limit=1`,
        {
          headers: {
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        return {
          ref: data[0].verse_ref || 'Psalm 23:1',
          reflection: data[0].reflection || '',
          prayer: data[0].prayer || ''
        };
      }
    } catch (e) {
      console.warn('Supabase fetch failed', e.message);
    }
  }
  return { ref: 'Psalm 23:1', reflection: '', prayer: '' };
}

/**
 * Get all stored FCM tokens (e.g. from Firestore push_tokens collection).
 * Adjust collection/field names to match where you store tokens from FCM_SUBSCRIBE_URL.
 */
async function getStoredTokens() {
  const snap = await db.collection('push_tokens').get();
  const tokens = [];
  snap.forEach((doc) => {
    const t = doc.data().token || doc.data().fcm_token;
    if (t && typeof t === 'string') tokens.push(t);
  });
  return tokens;
}

/**
 * Scheduled: runs every day at 9:00 AM (America/Chicago). Change timezone as needed.
 */
exports.sendDailyVerseNotification = functions
  .runWith({ timeoutSeconds: 120, memory: '256MB' })
  .pubsub.schedule('0 9 * * *')
  .timeZone('America/Chicago')
  .onRun(async (context) => {
    const verse = await getTodaysVerse();
    const tokens = await getStoredTokens();
    if (!tokens.length) {
      console.log('No push tokens to send.');
      return null;
    }

    const message = {
      notification: {
        title: "Daily Battle",
        body: `Today's verse: ${verse.ref}. Tap to open.`
      },
      data: {
        url: 'https://todaysdailybattle.com/',
        ref: verse.ref || '',
        type: 'daily_verse'
      },
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default', contentAvailable: true } } },
      webpush: {
        headers: { Urgency: 'high' },
        notification: {
          title: "Daily Battle",
          body: `Today's verse: ${verse.ref}. Tap to open.`,
          icon: 'https://todaysdailybattle.com/icon.svg',
          tag: 'daily-verse',
          renotify: true,
          data: { url: 'https://todaysdailybattle.com/' }
        }
      }
    };

    const chunks = [];
    const chunkSize = 500;
    for (let i = 0; i < tokens.length; i += chunkSize) {
      chunks.push(tokens.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      const res = await admin.messaging().sendEachForMulticast({
        tokens: chunk,
        ...message
      });
      if (res.failureCount > 0) {
        res.responses.forEach((r, i) => {
          if (!r.success) console.warn('Send failed', chunk[i], r.error?.message);
        });
      }
    }

    return null;
  });
