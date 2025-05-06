// src/components/ThreadView.tsx
'use client';

import type { Entry } from '@/lib/firebase';
import MessageBubble from './MessageBubble';

type Props = {
  entries: Entry[];
};

export default function ThreadView({ entries }: Props) {
  return (
    <div className="flex flex-col space-y-4 pb-32 px-4">
      {entries.map((entry) => (
        <MessageBubble key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
