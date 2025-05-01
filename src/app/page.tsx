'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useMonthEntries } from '@/hooks/useEntries'
import Header from '@/components/Header'
import CalendarView from '@/components/CalendarView'
import { addMonths, subMonths } from 'date-fns'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<'calendar' | 'list'>('calendar')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const { entries, loading: entriesLoading } = useMonthEntries(user?.uid || null, year, month)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />

      {!entriesLoading && (
        <CalendarView
          currentDate={currentDate}
          entries={entries}
          viewType={viewType}
          onClickDate={(dateStr) => router.push(`/entries/${dateStr}`)}
          onChangeViewType={(v) => setViewType(v)}
          onPrevMonth={() => setCurrentDate(subMonths(currentDate, 1))}
          onNextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
        />
      )}
    </div>
  )
}
