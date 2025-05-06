// src/components/MessageBubble.tsx
import { Timestamp } from 'firebase/firestore'
import { cn } from "@/lib/utils"

type Entry = {
  id: string
  text: string
  createdAt: Timestamp | Date
  userId: string
  type: "plan" | "record"
}

interface MessageBubbleProps {
  entry?: Entry  // optionalにしてガード追加
}

export default function MessageBubble({ entry }: MessageBubbleProps) {
  if (!entry) return null  // undefined防止のための安全ガード

  const isPlan = entry.type === "plan"

  return (
    <div className={cn("flex flex-col", isPlan ? "items-end" : "items-start")}>
      <div className={cn(
        "p-4 rounded-2xl max-w-[85%] break-words shadow-sm",
        "border border-gray-100 bg-white"
      )}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            isPlan ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
          )}>
            {isPlan ? "計画" : "実績"}
          </div>
        </div>
        <p className="whitespace-pre-wrap text-gray-800">{entry.text}</p>
      </div>
    </div>
  )
}

