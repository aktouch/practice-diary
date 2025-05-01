// src/components/ThreadView.tsx
'use client';

import type { Entry } from '@/lib/firebase';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

type Props = {
  entries: Entry[];
};

export default function ThreadView({ entries }: Props) {
  return (
    <div className="flex flex-col space-y-4 pb-32 px-4">
      {entries.map((entry) => (
        <div key={entry.id} className="flex flex-col">
          <span className="text-xs text-gray-500">
            {format(
              entry.createdAt instanceof Timestamp
                ? entry.createdAt.toDate()
                : entry.createdAt,
              'yyyy/MM/dd HH:mm'
            )}
          </span>
          <div className="bg-gray-100 rounded-xl px-4 py-2 max-w-xs">
            <p className="text-sm whitespace-pre-wrap">{entry.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
