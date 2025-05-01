// app/entries/[date]/page.tsx

import { parseISO, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import EntryClientPage from './EntryClientPage';

type Params = {
  date: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const { date } = await params;
  const parsedDate = parseISO(date);
  const formattedDate = format(parsedDate, 'yyyy年M月d日 (EEEE)', { locale: ja });
  return <EntryClientPage date={date} formattedDate={formattedDate} />;
}
