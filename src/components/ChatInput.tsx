import { useState } from 'react';

export default function ChatInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-2 border rounded resize-none"
        rows={2}
        placeholder="今日の練習内容は？"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">投稿</button>
    </form>
  );
}
