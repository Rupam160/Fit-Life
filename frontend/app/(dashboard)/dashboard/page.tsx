import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getStreak } from '@/lib/api/streaks';
import { getWeeklyCalories, getDailyCalories, getConsistencyTrend } from '@/lib/api/calories';
import { getWorkoutDates } from '@/lib/api/workouts';
import { getVolumeProgress } from '@/lib/api/progress';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { CaloriesChart } from '@/components/dashboard/CaloriesChart';
import { DailyCaloriesCard } from '@/components/dashboard/DailyCaloriesCard';
import { ConsistencyTrend } from '@/components/dashboard/ConsistencyTrend';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { format } from 'date-fns';
import type { WorkoutType } from '@/lib/types/database';

export const metadata = {
  title: 'Dashboard — FitTrack Pro',
  description: 'View your workout streaks, calendar, and calorie trends.',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const thirtyDaysAgo = format(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

  const [streak, weeklyCalories, dailyCalories, consistencyTrend, workoutDates, volumeProgress] =
    await Promise.all([
      getStreak(supabase, user.id),
      getWeeklyCalories(supabase, user.id),
      getDailyCalories(supabase, user.id, todayStr),
      getConsistencyTrend(supabase, user.id),
      getWorkoutDates(supabase, user.id, thirtyDaysAgo, todayStr),
      getVolumeProgress(supabase, user.id),
    ]);

  // Find today's workout type for the daily calories card
  const todayWorkout = workoutDates.find((w) => w.date === todayStr);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">{format(today, 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <StreakCard streak={streak} />
        </div>
        <DailyCaloriesCard
          calories={dailyCalories}
          workoutType={(todayWorkout?.type as WorkoutType) ?? null}
        />
      </div>

      {/* Calendar */}
      <CalendarWidget workouts={workoutDates} />

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProgressChart data={volumeProgress} />
        <CaloriesChart data={weeklyCalories} />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4">
        <ConsistencyTrend data={consistencyTrend} />
      </div>
    </div>
  );
}
