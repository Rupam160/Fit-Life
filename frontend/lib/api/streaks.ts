import { createClient } from '../supabase/client';
import type { DbStreak, StreakUpdateResult } from '../types/database';

export async function getStreak(userId: string): Promise<DbStreak | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data as DbStreak;
}

export async function updateStreak(
  userId: string,
  workoutDate: string
): Promise<StreakUpdateResult | null> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('update_streak', {
    p_user_id: userId,
    p_workout_date: workoutDate,
  });

  if (error) {
    console.error('updateStreak error:', error.message);
    return null;
  }

  return data as StreakUpdateResult;
}
