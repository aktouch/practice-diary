// src/components/TabSwitcher.tsx
import { cn } from '@/lib/utils'

export default function TabSwitcher({
  activeTab,
  onChange,
}: {
  activeTab: 'plan' | 'record'
  onChange: (tab: 'plan' | 'record') => void
}) {
  return (
    <div className="flex gap-2 px-4 py-2 bg-white shadow-sm">
      {/* 実績（左） */}
      <button
        onClick={() => onChange('record')}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition",
          activeTab === 'record'
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        )}
      >
        実績 (Record)
      </button>

      {/* 計画（右） */}
      <button
        onClick={() => onChange('plan')}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition",
          activeTab === 'plan'
            ? "bg-green-500 text-white"
            : "bg-gray-200 text-gray-700"
        )}
      >
        計画 (Plan)
      </button>
    </div>
  )
}
