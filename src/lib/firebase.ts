// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Timestamp } from 'firebase/firestore';

// Firebase設定オブジェクト
// 実際の値はFirebaseコンソールからコピーしてください
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Firebase初期化（既に初期化されている場合は既存のアプリを取得）
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// タイムスタンプヘルパー関数
const serverTimestamp = () => Timestamp.now();

export { app, auth, db, googleProvider, serverTimestamp };

// エントリーの型定義
export type EntryType = 'plan' | 'record';

export interface Entry {
  id: string;
  userId: string;
  type: EntryType;
  targetDate: Timestamp;
  text: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  stravaData?: any;
  status: string;
}

// ユーザーの型定義
export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}