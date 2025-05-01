import { cn } from "@/lib/utils"

type Entry = {
  id: string
  text: string
  createdAt: Date
  userId: string
  type: "plan" | "record"
}

interface MessageBubbleProps {
  entry: Entry
}

export default function MessageBubble({ entry }: MessageBubbleProps) {
  return (
    <div className="flex flex-col">
      <div className={cn("p-4 rounded-2xl max-w-[85%] break-words bg-white shadow-sm", "border border-gray-100")}>
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              entry.type === "plan" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700",
            )}
          >
            {entry.type === "plan" ? "計画" : "実績"}
          </div>
        </div>
        <p className="whitespace-pre-wrap text-gray-800">{entry.text}</p>
      </div>
    </div>
  )
}
