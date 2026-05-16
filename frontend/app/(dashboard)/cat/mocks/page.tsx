import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getMockTests } from '@/lib/api/cat';
import { MockTrackerClient } from '@/components/cat/MockTrackerClient';

export const metadata = {
  title: 'Mock Tests | CAT Prep',
  description: 'Track your CAT mock test scores and percentile progression.',
};

export default async function CatMocksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const mocks = await getMockTests(supabase as any, user.id);

  return <MockTrackerClient userId={user.id} initialMocks={mocks} />;
}
