// src/components/ChatInput.tsx
"use client"

import { useState, type FormEvent } from "react"
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatAssistModal from "@/components/ChatAssistModal"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  activeTab: "plan" | "record"
  onSend: (text: string) => void
}

export default function ChatInput({ activeTab, onSend }: ChatInputProps) {
  const [text, setText] = useState("")
  const [assistOpen, setAssistOpen] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onSend(text)
      setText("")
    }
  }

  const isRecord = activeTab === "record"
  const placeholderText = isRecord ? "今日の実績を入力..." : "今日の計画を入力..."

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex items-center gap-2 p-3",
          isRecord ? "bg-blue-50" : "bg-green-50"
        )}
      >
        {/* GPTアシストボタン */}
        <Button
          type="button"
          onClick={() => setAssistOpen(true)}
        >
          <Sparkles className="h-5 w-5" />
        </Button>

        {/* テキスト入力欄 */}
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholderText}
            className={cn(
              "w-full p-3 pr-10 rounded-full border bg-white focus:outline-none focus:ring-2",
              isRecord
                ? "focus:ring-blue-300 border-blue-200"
                : "focus:ring-green-300 border-green-200"
            )}
          />
        </div>

        {/* 送信ボタン */}
        <Button
          type="submit"
          className={cn(
            "rounded-full h-12 w-12 flex items-center justify-center",
            isRecord
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-green-500 hover:bg-green-600"
          )}
          disabled={!text.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>

      {/* GPTモーダル */}
      <ChatAssistModal
        open={assistOpen}
        onClose={() => setAssistOpen(false)}
        onInsert={(aiText) => setText(aiText)}
        type={activeTab}
      />
    </>
  )
}




