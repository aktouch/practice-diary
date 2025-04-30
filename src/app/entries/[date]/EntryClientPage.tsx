'use client';

import { useMemo, useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEntries } from '@/hooks/useEntries';
import Header from '@/components/Header';
import { parseISO, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { EntryType } from '@/lib/firebase';

type Props = {
  date: string;
  formattedDate: string;
};

export default function EntryClientPage({ date, formattedDate }: Props) {
  const parsedDate = useMemo(() => parseISO(date), [date]);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [entryText, setEntryText] = useState('');
  const [entryType, setEntryType] = useState<EntryType>('plan');

  const { entries, loading: entriesLoading, addEntry } = useEntries(
    user?.uid || null,
    parsedDate
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!entryText.trim()) return;

    await addEntry({
      type: entryType,
      text: entryText,
      status: 'active',
    });

    setEntryText('');
  };

  if (authLoading || !user) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4 max-w-3xl">
        <div className="mb-6">
          <button onClick={() => router.push('/')} className="text-blue-600 hover:underline flex items-center">
            ← カレンダーに戻る
          </button>
          <h1 className="text-2xl font-bold mt-2">{formattedDate}の記録</h1>
        </div>

        {/* 入力フォーム */}
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <div className="flex mb-2 space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="entryType"
                  value="plan"
                  checked={entryType === 'plan'}
                  onChange={() => setEntryType('plan')}
                  className="mr-2"
                />
                計画
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="entryType"
                  value="record"
                  checked={entryType === 'record'}
                  onChange={() => setEntryType('record')}
                  className="mr-2"
                />
                実績
              </label>
            </div>
            <textarea
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500"
              rows={4}
              placeholder={entryType === 'plan' ? "今日の練習計画を入力..." : "実際の練習内容を記録..."}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            投稿する
          </button>
        </form>

        {/* 投稿表示 */}
        <div className="space-y-4">
          {entriesLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
              この日の記録はまだありません。最初の記録を追加しましょう。
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 rounded-lg shadow-sm border-l-4 ${
                  entry.type === 'plan' ? 'border-l-blue-500 bg-blue-50' : 'border-l-green-500 bg-green-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-block px-2 py-1 text-xs rounded text-white font-semibold bg-gray-700">
                    {entry.type === 'plan' ? '計画' : '実績'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {entry.createdAt && format(entry.createdAt.toDate(), 'HH:mm')}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{entry.text}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
