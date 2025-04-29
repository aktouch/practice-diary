// src/hooks/useEntries.ts
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db, Entry, EntryType, serverTimestamp } from '@/lib/firebase';
import { startOfDay, endOfDay } from 'date-fns';
import { format as formatDate } from 'date-fns';

export const useEntries = (userId: string | null, date: Date | null) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 特定の日付の記録を取得
  useEffect(() => {
    const fetchEntries = async () => {
      if (!userId || !date) {
        setEntries([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const startDate = Timestamp.fromDate(startOfDay(date));
        const endDate = Timestamp.fromDate(endOfDay(date));
        
        const entriesQuery = query(
          collection(db, 'entries'),
          where('userId', '==', userId),
          where('targetDate', '>=', startDate),
          where('targetDate', '<=', endDate),
          orderBy('targetDate'),
          orderBy('createdAt')
        );

        const querySnapshot = await getDocs(entriesQuery);
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
            updatedAt: data.updatedAt
          });
        });

        setEntries(fetchedEntries);
      } catch (err: any) {
        console.error('練習記録取得エラー:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [userId, date]);

  // 新しい練習記録の追加
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
      
      // 最新の記録を取得し直す
      const startDate = Timestamp.fromDate(startOfDay(date));
      const endDate = Timestamp.fromDate(endOfDay(date));
      
      const entriesQuery = query(
        collection(db, 'entries'),
        where('userId', '==', userId),
        where('targetDate', '>=', startDate),
        where('targetDate', '<=', endDate),
        orderBy('targetDate'),
        orderBy('createdAt')
      );

      const querySnapshot = await getDocs(entriesQuery);
      const updatedEntries: Entry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        updatedEntries.push({
          id: doc.id,
          userId: data.userId,
          type: data.type,
          targetDate: data.targetDate,
          text: data.text,
          stravaData: data.stravaData,
          status: data.status,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });

      setEntries(updatedEntries);
      return docRef.id;
    } catch (err: any) {
      console.error('練習記録追加エラー:', err);
      setError(err);
      return null;
    }
  };

  return { entries, loading, error, addEntry };
};

// 月ごとの記録取得用フック
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

function format(date: Date, formatStr: string): string {
  return date.toISOString().split('T')[0];
}