// src/app/entries/[date]/page.tsx
import { use } from 'react';
import { parseISO, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import EntryClientPage from './EntryClientPage';

export default function EntriesPage(promise: Promise<{ params: { date: string } }>) {
  const { params } = use(promise);
  const { date } = params;
  const parsedDate = parseISO(date);
  const formattedDate = format(parsedDate, 'yyyy年M月d日 (EEEE)', { locale: ja });

  return <EntryClientPage date={date} formattedDate={formattedDate} />;
}
