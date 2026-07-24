import { SupabaseClient } from '@supabase/supabase-js';
import type { DbPeriodLog, FlowIntensity, MoodType } from '../types/database';

export async function getPeriodLogs(
  supabase: SupabaseClient,
  userId: string
): Promise<Record<string, DbPeriodLog>> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('period_logs')
      .eq('id', userId)
      .maybeSingle();

    if (profile?.period_logs) {
      return typeof profile.period_logs === 'string' 
        ? JSON.parse(profile.period_logs) 
        : profile.period_logs;
    }
  } catch (err) {
    console.warn('Could not fetch period_logs from profiles table, trying metadata fallback', err);
  }

  // Fallback to user metadata
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.period_logs) {
    return user.user_metadata.period_logs;
  }

  return {};
}

export async function savePeriodLog(
  supabase: SupabaseClient,
  userId: string,
  log: DbPeriodLog
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentLogs = await getPeriodLogs(supabase, userId);
    const updatedLogs = {
      ...currentLogs,
      [log.date]: log,
    };

    // Update in user_metadata first for instant fallback
    await supabase.auth.updateUser({
      data: { period_logs: updatedLogs },
    });

    // Also attempt profiles table update if column exists
    await supabase
      .from('profiles')
      .update({ period_logs: updatedLogs })
      .eq('id', userId);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save period log' };
  }
}
