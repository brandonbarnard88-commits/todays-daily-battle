/**
 * Firebase Cloud Functions for todaysdailybattle.com push notifications.
 * - savePushToken: HTTPS endpoint for client to POST FCM token (set FCM_SUBSCRIBE_URL to this).
 * - sendDailyVerseNotification: scheduled 9 AM daily (America/Chicago), sends today's verse to all tokens.
 *
 * Deploy: firebase deploy --only functions
 * Requires Blaze plan for scheduled functions. Set SUPABASE_URL and SUPABASE_SERVICE_KEY for verse fetch.
 */
const savePushToken = require('./savePushToken');
const sendDailyVerseNotification = require('./sendDailyVerseNotification');

exports.savePushToken = savePushToken.savePushToken;
exports.sendDailyVerseNotification = sendDailyVerseNotification.sendDailyVerseNotification;
