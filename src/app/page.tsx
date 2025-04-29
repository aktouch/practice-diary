// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMonthEntries } from '@/hooks/useEntries';
import Header from '@/components/Header';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'calendar' | 'list'>('calendar');
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  
  const { entries, loading: entriesLoading } = useMonthEntries(
    user?.uid || null,
    year,
    month
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // 月のすべての日付を取得
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // カレンダービューのレンダリング
  const renderCalendarView = () => {
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* 曜日のヘッダー */}
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="text-center py-2 font-medium">
            {day}
          </div>
        ))}
        
        {/* 月の最初の日の前の空白セル */}
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2 bg-gray-100"></div>
        ))}
        
        {/* 日付セル */}
        {daysInMonth.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const hasEntries = entries[dateStr] && entries[dateStr].length > 0;
          
          return (
            <div 
              key={dateStr} 
              onClick={() => router.push(`/entries/${dateStr}`)}
              className={`
                p-2 min-h-[80px] border cursor-pointer
                ${isToday(day) ? 'bg-blue-50 border-blue-300' : ''}
                ${isSameMonth(day, currentDate) ? 'bg-white' : 'bg-gray-100 text-gray-400'}
                ${hasEntries ? 'relative' : ''}
              `}
            >
              <div className="font-semibold">{format(day, 'd')}</div>
              
              {/* 記録がある場合のインジケーター */}
              {hasEntries && (
                <div className="mt-1">
                  <div className="bg-green-500 w-2 h-2 rounded-full absolute bottom-2 right-2"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // リストビューのレンダリング
  const renderListView = () => {
    return (
      <div className="space-y-2">
        {daysInMonth.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const hasEntries = entries[dateStr] && entries[dateStr].length > 0;
          
          return (
            <div 
              key={dateStr}
              onClick={() => router.push(`/entries/${dateStr}`)}
              className={`
                p-4 border rounded-lg cursor-pointer
                ${isToday(day) ? 'bg-blue-50 border-blue-300' : 'bg-white'}
                ${hasEntries ? 'border-green-300' : ''}
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{format(day, 'M月d日', { locale: ja })}</div>
                  <div className="text-sm text-gray-500">{format(day, 'EEEE', { locale: ja })}</div>
                </div>
                {hasEntries && (
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {entries[dateStr].length}件
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <Header />
      
      <main className="container mx-auto p-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">練習日誌</h1>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('calendar')}
              className={`px-3 py-1 rounded ${viewType === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              カレンダー
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`px-3 py-1 rounded ${viewType === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              リスト
            </button>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <button onClick={prevMonth} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            前の月
          </button>
          
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'yyyy年M月', { locale: ja })}
          </h2>
          
          <button onClick={nextMonth} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            次の月
          </button>
        </div>

        {entriesLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          viewType === 'calendar' ? renderCalendarView() : renderListView()
        )}
      </main>
    </div>
  );
}