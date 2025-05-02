'use client'

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import ChatInput from '@/components/ChatInput';
import MessageBubble from '@/components/MessageBubble';
import TabSwitcher from '@/components/TabSwitcher';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useEntries } from '@/hooks/useEntries';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Props = {
  date: string;
  formattedDate: string;
};

const safeGetTime = (value: Timestamp | Date | null | undefined): number => {
  if (!value) return 0;
  if (value instanceof Timestamp) return value.toMillis();
  if (value instanceof Date) return value.getTime();
  return 0;
};

function EntryClientPage({ date, formattedDate }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'plan' | 'record'>('plan');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const parsedDate = useMemo(() => parseISO(date), [date]);
  const { entries } = useEntries(user?.uid || '', parsedDate);

  const addEntry = async (text: string, type: 'plan' | 'record') => {
    if (!user) return;

    await addDoc(collection(db, 'entries'), {
      text,
      targetDate: Timestamp.fromDate(parsedDate),
      userId: user.uid,
      type,
      createdAt: serverTimestamp(),
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, activeTab]);

  const goBack = () => router.push('/');

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="flex items-center p-4 border-b bg-white shadow-sm">
        <Button onClick={goBack} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-gray-500" />
          <h1 className="text-lg font-medium">{formattedDate}</h1>
        </div>
      </header>

      {/* タブ */}
      <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />

      {/* スレッド表示 */}
      <div
        className={cn(
          'flex-1 overflow-y-auto p-4 space-y-4',
          activeTab === 'plan' ? 'bg-blue-50' : 'bg-green-50'
        )}
      >
        {entries
          .filter((entry) => entry.type === activeTab)
          .sort((a, b) => safeGetTime(a.createdAt) - safeGetTime(b.createdAt))
          .map((entry) => (
            <div key={entry.id} className="flex flex-col space-y-1">
              <div className="text-xs text-gray-500 ml-2">
                {format(
                  entry.createdAt instanceof Timestamp
                    ? entry.createdAt.toDate()
                    : entry.createdAt,
                  'HH:mm'
                )}
              </div>
              <MessageBubble entry={entry} />
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力欄 */}
      <div className="border-t bg-white p-2">
        <ChatInput activeTab={activeTab} onSend={(text) => addEntry(text, activeTab)} />
      </div>
    </div>
  );
}

export default EntryClientPage;
