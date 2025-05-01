// src/components/ChatAssistModal.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ChatAssistModalProps {
  open: boolean
  onClose: () => void
  onInsert: (text: string) => void // ← ここだけ変更
  type: "plan" | "record"
}

export default function ChatAssistModal({ open, onClose, onInsert, type }: ChatAssistModalProps) {
  const [loading, setLoading] = useState(false)
  const [suggestedText, setSuggestedText] = useState("")

  const handleAssist = async () => {
    setLoading(true)
    const prompt = type === "plan" ? "今日はどんな練習をする予定ですか？" : "今日の練習内容を振り返ってみましょう。"

    const res = await fetch("/api/gpt-assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: prompt }),
    })

    const data = await res.json()
    setSuggestedText(data.reply)
    setLoading(false)
  }

  const handleSelect = () => {
    onInsert(suggestedText)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI入力補助</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            GPTにより{type === "plan" ? "練習計画" : "実績記録"}の入力をサポートします。
          </p>

          <Button onClick={handleAssist} disabled={loading}>
            {loading ? "生成中..." : "提案を取得"}
          </Button>

          {suggestedText && (
            <div className="bg-gray-100 p-3 rounded whitespace-pre-wrap text-sm">
              {suggestedText}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              閉じる
            </Button>
            <Button onClick={handleSelect} disabled={!suggestedText}>
              この内容を使う
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

