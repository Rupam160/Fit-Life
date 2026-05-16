import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCatLogsForDate, getCatLogs } from '@/lib/api/cat';
import { DailyLogClient } from '@/components/cat/DailyLogClient';
import { format } from 'date-fns';

export const metadata = {
  title: 'Daily Log | CAT Prep',
  description: 'Log your daily CAT study sessions by subject.',
};

export default async function CatDailyLogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const today = format(new Date(), 'yyyy-MM-dd');

  const [todayLogs, recentLogs] = await Promise.all([
    getCatLogsForDate(supabase as any, user.id, today),
    getCatLogs(supabase as any, user.id, 30),
  ]);

  return (
    <DailyLogClient
      userId={user.id}
      initialDate={today}
      initialDayLogs={todayLogs}
      initialRecentLogs={recentLogs}
    />
  );
}
