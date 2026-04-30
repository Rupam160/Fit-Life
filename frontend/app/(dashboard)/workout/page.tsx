import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { WorkoutLogger } from '@/components/workout/WorkoutLogger';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata = {
  title: 'Workout — FitTrack Pro',
  description: 'Log your workout sets, reps, and weights.',
};

export default async function WorkoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <AuthProvider userId={user.id}>
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Workout</h1>
          <p className="text-sm text-slate-500 mt-1">Log your sets, reps, and weights</p>
        </div>
        <WorkoutLogger />
      </div>
    </AuthProvider>
  );
}
