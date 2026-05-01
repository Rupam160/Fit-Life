import { SupabaseClient } from '@supabase/supabase-js';
import type { DbStreak, StreakUpdateResult } from '../types/database';

export async function getStreak(supabase: SupabaseClient, userId: string): Promise<DbStreak | null> {

  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data as DbStreak;
}

export async function updateStreak(
  supabase: SupabaseClient,
  userId: string,
  workoutDate: string
): Promise<StreakUpdateResult | null> {

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
