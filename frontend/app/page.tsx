import { createClient } from '@/lib/supabase/server';
import { LandingPageClient } from '@/components/landing/LandingPageClient';

export const metadata = {
  title: 'FitTrack Pro — Fitness & Female Health Tracking Platform',
  description: 'Track workouts, Progressive volume charts, calendar consistency heatmaps, and female period & mood cycle tracking.',
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LandingPageClient isLoggedIn={!!user} />;
}
