// src/components/CalendarView.tsx
'use client'

import { format, isToday, isSameMonth } from 'date-fns'
import { ja } from 'date-fns/locale'
import clsx from 'clsx'

import { Entry } from '@/lib/firebase'

interface CalendarViewProps {
  currentDate: Date
  entries: Record<string, Entry[]>
  viewType: 'calendar' | 'list'
  onClickDate: (dateStr: string) => void
  onChangeViewType: (view: 'calendar' | 'list') => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns'

export default function CalendarView({
  currentDate,
  entries,
  viewType,
  onClickDate,
  onChangeViewType,
  onPrevMonth,
  onNextMonth,
}: CalendarViewProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const renderCalendar = () => (
    <div className="grid grid-cols-7 gap-1">
      {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
        <div key={day} className="text-center py-2 font-medium text-sm text-gray-600">
          {day}
        </div>
      ))}

      {Array.from({ length: monthStart.getDay() }).map((_, i) => (
        <div key={`empty-${i}`} className="p-2" />
      ))}

      {daysInMonth.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const hasEntries = entries[dateStr]?.length > 0

        return (
          <div
            key={dateStr}
            onClick={() => onClickDate(dateStr)}
            className={clsx(
              'p-2 min-h-[80px] border rounded-xl cursor-pointer text-center flex flex-col items-center justify-start',
              isToday(day) ? 'bg-blue-50 border-blue-300' : 'bg-white',
              !isSameMonth(day, currentDate) && 'bg-gray-100 text-gray-400'
            )}
          >
            <div className="font-medium text-gray-800">{format(day, 'd')}</div>
            {hasEntries && <div className="mt-1 w-2 h-2 rounded-full bg-green-500" />}
          </div>
        )
      })}
    </div>
  )

  const renderList = () => (
    <div className="space-y-2">
      {daysInMonth.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const hasEntries = entries[dateStr]?.length > 0

        return (
          <div
            key={dateStr}
            onClick={() => onClickDate(dateStr)}
            className={clsx(
              'p-4 border rounded-lg cursor-pointer',
              isToday(day) ? 'bg-blue-50 border-blue-300' : 'bg-white',
              hasEntries && 'border-green-300'
            )}
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
        )
      })}
    </div>
  )

  return (
    <main className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => onChangeViewType('calendar')}
            className={clsx(
              'px-3 py-1 rounded-xl text-sm',
              viewType === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            )}
          >
            カレンダー
          </button>
          <button
            onClick={() => onChangeViewType('list')}
            className={clsx(
              'px-3 py-1 rounded-xl text-sm',
              viewType === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            )}
          >
            リスト
          </button>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <button onClick={onPrevMonth} className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">
          前の月
        </button>
        <h2 className="text-xl font-medium">
          {format(currentDate, 'yyyy年M月', { locale: ja })}
        </h2>
        <button onClick={onNextMonth} className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">
          次の月
        </button>
      </div>

      {viewType === 'calendar' ? renderCalendar() : renderList()}
    </main>
  )
}


