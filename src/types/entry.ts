// src/types/entry.ts
export type Entry = {
    id: string;
    text: string;
    createdAt: any;
    userId: string;
    type: 'plan' | 'record';
  };
  