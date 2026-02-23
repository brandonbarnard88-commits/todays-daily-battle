/**
 * Firebase HTTPS function: receive FCM token from client (firebase-push.js) and store in Firestore.
 * No UI. Backend only. Client POSTs { token, source: 'firebase', domain: 'todaysdailybattle.com' } to FCM_SUBSCRIBE_URL.
 *
 * Set FCM_SUBSCRIBE_URL to: https://<region>-<project>.cloudfunctions.net/savePushToken
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.savePushToken = functions.https.onRequest(async (req, res) => {
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
    const id = token.slice(0, 32) + '-' + Date.now();
    await db.collection('push_tokens').doc(id).set({
      token,
      source: body.source || 'firebase',
      domain: body.domain || 'todaysdailybattle.com',
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save token' });
  }
});
