import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSchedule } from '@/lib/api/cat';
import { WeeklyScheduleClient } from '@/components/cat/WeeklyScheduleClient';

export const metadata = {
  title: 'Schedule | CAT Prep',
  description: 'Manage your weekly CAT study schedule.',
};

export default async function CatSchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const schedule = await getSchedule(supabase as any, user.id);

  return <WeeklyScheduleClient userId={user.id} initialItems={schedule} />;
}
