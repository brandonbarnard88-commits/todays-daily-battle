/**
 * Firebase HTTPS function: remove FCM token from Firestore.
 * Client POSTs { token } to FCM_UNSUBSCRIBE_URL when user turns off push reminders.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const ALLOWED_ORIGINS = new Set([
  'https://todaysdailybattle.com',
  'https://www.todaysdailybattle.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
]);

function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  }
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
}

exports.removePushToken = functions.https.onRequest(async (req, res) => {
  setCors(req, res);
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  let body;
  try {
    body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
  } catch (_) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  const token = body.token && String(body.token).trim();
  if (!token) {
    res.status(400).json({ error: 'Missing token' });
    return;
  }

  try {
    const id = crypto.createHash('sha256').update(token).digest('hex').slice(0, 40);
    await db.collection('push_tokens').doc(id).delete();
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to remove token' });
  }
});
