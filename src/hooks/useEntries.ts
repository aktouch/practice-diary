// src/hooks/useEntries.ts
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db, Entry, EntryType, serverTimestamp } from '@/lib/firebase';
import { startOfDay, endOfDay } from 'date-fns';

export const useEntries = (userId: string | null, date: Date | null) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 📌 リアルタイム取得
  useEffect(() => {
    if (!userId || !date) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const startDate = Timestamp.fromDate(startOfDay(date));
    const endDate = Timestamp.fromDate(endOfDay(date));

    const entriesQuery = query(
      collection(db, 'entries'),
      where('targetDate', '>=', startDate),
      where('targetDate', '<=', endDate),
      orderBy('targetDate'),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(
      entriesQuery,
      (querySnapshot) => {
        const fetchedEntries: Entry[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedEntries.push({
            id: doc.id,
            userId: data.userId,
            type: data.type,
            targetDate: data.targetDate,
            text: data.text,
            stravaData: data.stravaData,
            status: data.status,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });
        setEntries(fetchedEntries);
        setLoading(false);
      },
      (err) => {
        console.error('リアルタイム取得エラー:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, date]);

  // 🔧 投稿
  const addEntry = async (entryData: {
    type: EntryType;
    text: string;
    stravaData?: any;
    status: string;
  }) => {
    if (!userId || !date) return null;

    try {
      const newEntry: Omit<Entry, 'id'> = {
        userId,
        targetDate: Timestamp.fromDate(date),
        ...entryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'entries'), newEntry);
      return docRef.id;
    } catch (err: any) {
      console.error('練習記録追加エラー:', err);
      setError(err);
      return null;
    }
  };

  return { entries, loading, error, addEntry };
};

import { getDocs } from 'firebase/firestore'; // ファイル上部に必要な場合あり
import { format as formatDate } from 'date-fns'; // 同様に必要

export function useMonthEntries(userId: string | null, year: number, month: number) {
  const [entries, setEntries] = useState<Record<string, Entry[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setEntries({});
      setLoading(false);
      return;
    }

    const fetchEntries = async () => {
      try {
        setLoading(true);
        const entriesRef = collection(db, 'entries');
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const q = query(
          entriesRef,
          where('userId', '==', userId),
          where('targetDate', '>=', Timestamp.fromDate(startDate)),
          where('targetDate', '<=', Timestamp.fromDate(endDate)),
          orderBy('targetDate', 'asc')
        );

        const querySnapshot = await getDocs(q);
        const entriesData: Record<string, Entry[]> = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const entry: Entry = {
            id: doc.id,
            userId: data.userId,
            type: data.type,
            targetDate: data.targetDate,
            text: data.text,
            stravaData: data.stravaData,
            status: data.status,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          };

          const dateStr = formatDate(data.targetDate.toDate(), 'yyyy-MM-dd');
          if (!entriesData[dateStr]) {
            entriesData[dateStr] = [];
          }
          entriesData[dateStr].push(entry);
        });

        setEntries(entriesData);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [userId, year, month]);

  return { entries, loading };
}
