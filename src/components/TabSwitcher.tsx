"use client"

import { cn } from "@/lib/utils"

interface TabSwitcherProps {
  activeTab: "plan" | "record"
  onChange: (tab: "plan" | "record") => void
}

export default function TabSwitcher({ activeTab, onChange }: TabSwitcherProps) {
  return (
    <div className="flex border-b bg-white shadow-sm">
      <button
        className={cn(
          "flex-1 py-3.5 text-center font-medium transition-colors",
          activeTab === "plan"
            ? "text-blue-600 border-b-2 border-blue-500 bg-blue-50"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
        )}
        onClick={() => onChange("plan")}
      >
        計画 (Plan)
      </button>
      <button
        className={cn(
          "flex-1 py-3.5 text-center font-medium transition-colors",
          activeTab === "record"
            ? "text-green-600 border-b-2 border-green-500 bg-green-50"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
        )}
        onClick={() => onChange("record")}
      >
        実績 (Record)
      </button>
    </div>
  )
}
