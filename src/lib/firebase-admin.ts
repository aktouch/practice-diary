// src/lib/firebase-admin.ts

import { initializeApp, cert, getApps, getApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin SDK の初期化
const adminConfig = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const adminApp: App =
  getApps().length === 0
    ? initializeApp({ credential: cert(adminConfig as any) })
    : getApp();

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };
