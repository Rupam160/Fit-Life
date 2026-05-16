import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDashboardData, getSubjectTrend, getMockScoreTrend, getStudyDistribution, getWeeklyConsistency } from '@/lib/api/cat';
import { AnalyticsClient } from '@/components/cat/AnalyticsClient';

export const metadata = {
  title: 'Analytics | CAT Prep',
  description: 'Detailed performance insights across all CAT subjects.',
};

export default async function CatAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [dash, trend, mocks, dist, weekly] = await Promise.all([
    getDashboardData(supabase as any, user.id),
    getSubjectTrend(supabase as any, user.id, 30),
    getMockScoreTrend(supabase as any, user.id),
    getStudyDistribution(supabase as any, user.id),
    getWeeklyConsistency(supabase as any, user.id, 8),
  ]);

  return <AnalyticsClient dash={dash} trend={trend} mocks={mocks} dist={dist} weekly={weekly} />;
}
