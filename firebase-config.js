/**
 * firebase-config.js — Today's Daily Battle
 * ─────────────────────────────────────────────────────────────────────────────
 * IMPORTANT: This file ships only as a placeholder. Never commit real API keys.
 * Add this file to .gitignore if you populate the values below.
 *
 * ── FIREBASE CONSOLE SETUP ──────────────────────────────────────────────────
 *
 * Firebase is currently used for:
 *   - Cloud Messaging (FCM) — daily 9 AM verse push notifications
 *     (see firebase-push.js, firebase-functions/index.js)
 *
 * To enable FCM push OR to add optional Firebase Auth + Firestore sync:
 *
 *  1. Go to https://console.firebase.google.com
 *  2. Click "Add project" → name it (e.g. "todays-daily-battle")
 *  3. Disable Google Analytics (optional — you already have GA4 via config.js)
 *  4. In Project Overview → click "</> Web" to add a web app
 *  5. Register app name → copy the firebaseConfig block → paste values below
 *  6. Enable services you need:
 *
 *     For push notifications (FCM):
 *       Build → Cloud Messaging → (already enabled by default)
 *       Project Settings → Cloud Messaging → Web Push certificates
 *       → Generate key pair → copy the VAPID key → set in config.js: FIREBASE_VAPID_KEY
 *
 *     For optional Auth (email/password + Google sign-in):
 *       Build → Authentication → Get started
 *       → Sign-in method → enable "Email/Password" and "Google"
 *       Note: This site already uses Supabase for primary auth/sync.
 *       Only add Firebase Auth if you want a SECOND auth layer (not recommended).
 *       The existing Supabase auth + user_sync_data table already handles
 *       prayer list sync, streak sync, badge sync, and plan sync across devices.
 *
 *     For optional Firestore (cloud database):
 *       Build → Firestore Database → Create database → Start in production mode
 *       → Choose a region (nam5 / us-central recommended)
 *       Security rules (paste in Firestore → Rules tab):
 *
 *         rules_version = '2';
 *         service cloud.firestore {
 *           match /databases/{database}/documents {
 *             // Users can only read/write their own data
 *             match /users/{userId}/{document=**} {
 *               allow read, write: if request.auth != null && request.auth.uid == userId;
 *             }
 *           }
 *         }
 *
 * ── WHY THIS SITE USES SUPABASE (NOT FIREBASE) FOR PRIMARY SYNC ─────────────
 *
 * The app's prayer list, streak, badges, plans, and mood logs already sync
 * via Supabase (user_sync_data table + RLS). That layer is fully built.
 * Firebase is used only for FCM push. If you want prayer wall cloud sync,
 * just set SUPABASE_URL and SUPABASE_ANON_KEY in config.js — it's already wired.
 *
 * ── IF YOU DO WANT FIREBASE AUTH + FIRESTORE (future expansion) ─────────────
 *
 * The modular SDK imports would look like this (ES module, use type="module"):
 *
 *   import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
 *   import { getAuth, onAuthStateChanged, signInWithEmailAndPassword,
 *            createUserWithEmailAndPassword, GoogleAuthProvider,
 *            signInWithPopup, signOut }
 *     from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
 *   import { getFirestore, collection, addDoc, getDocs,
 *            query, orderBy, serverTimestamp }
 *     from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
 *   import { getMessaging, getToken, onMessage }
 *     from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging.js';
 *
 *   const app = initializeApp(firebaseConfig);
 *   const auth = getAuth(app);
 *   const db = getFirestore(app);
 *
 *   // Enable offline persistence (IndexedDB)
 *   import { enableIndexedDbPersistence } from '...firebase-firestore.js';
 *   enableIndexedDbPersistence(db).catch(err => console.warn('Persistence:', err));
 *
 *   // Auth state listener — shows "Guest" or user email in nav
 *   onAuthStateChanged(auth, user => {
 *     if (user) {
 *       // Load cloud prayers: users/{uid}/prayers collection
 *       const q = query(collection(db, `users/${user.uid}/prayers`), orderBy('timestamp','desc'));
 *       getDocs(q).then(snap => snap.forEach(doc => console.log(doc.data())));
 *     } else {
 *       // Fall back to localStorage
 *     }
 *   });
 *
 *   // Add a prayer (signed in)
 *   await addDoc(collection(db, `users/${user.uid}/prayers`), {
 *     text: 'Lord, guide me today.',
 *     mood: 'hope',
 *     timestamp: serverTimestamp()
 *   });
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Instead of putting keys here, use config.js (gitignored) and read them via:
 *   window.TDB_CONFIG.FIREBASE_API_KEY, etc.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Placeholder config — replace values with your real Firebase project config.
 * Copy the real values from: Firebase Console → Project Settings → Your apps → SDK setup
 *
 * In production, load this from config.js via window.TDB_CONFIG instead of hardcoding here.
 */
export const firebaseConfig = {
  apiKey:            'YOUR_API_KEY',
  authDomain:        'your-project.firebaseapp.com',
  projectId:         'your-project-id',
  storageBucket:     'your-project.appspot.com',
  messagingSenderId: 'xxxxxxxxxxxx',
  appId:             '1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxx'
};

/**
 * Runtime helper: returns a firebaseConfig object populated from window.TDB_CONFIG
 * (set in config.js which is gitignored). Falls back to the placeholder above if
 * TDB_CONFIG values are not present.
 *
 * Usage:
 *   import { getFirebaseConfig } from './firebase-config.js';
 *   const app = initializeApp(getFirebaseConfig());
 */
export function getFirebaseConfig() {
  var c = (typeof window !== 'undefined' && window.TDB_CONFIG) ? window.TDB_CONFIG : {};
  return {
    apiKey:            c.FIREBASE_API_KEY            || firebaseConfig.apiKey,
    authDomain:        c.FIREBASE_AUTH_DOMAIN        || firebaseConfig.authDomain,
    projectId:         c.FIREBASE_PROJECT_ID         || firebaseConfig.projectId,
    storageBucket:     c.FIREBASE_STORAGE_BUCKET     || firebaseConfig.storageBucket,
    messagingSenderId: c.FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
    appId:             c.FIREBASE_APP_ID             || firebaseConfig.appId
  };
}
