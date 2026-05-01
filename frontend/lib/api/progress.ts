import { SupabaseClient } from '@supabase/supabase-js';
import { format, subDays, parseISO } from 'date-fns';
import type { WorkoutType } from '../types/database';

export interface VolumeProgressPoint {
  date: string;
  label: string;
  push: number | null;
  pull: number | null;
  legs: number | null;
}

function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) =>
    subDays(new Date(), 29 - i).toISOString().split('T')[0]
  );
}

export async function getVolumeProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<VolumeProgressPoint[]> {
  const last30 = getLast30Days();
  const from = last30[0];
  const to = last30[last30.length - 1];

  // Fetch workouts with exercises and sets to calculate volume
  const { data } = await supabase
    .from('workouts')
    .select(`
      date,
      type,
      exercises (
        sets (
          weight_kg,
          reps
        )
      )
    `)
    .eq('user_id', userId)
    .in('type', ['push', 'pull', 'legs']) // Only track volume for these types
    .gte('date', from)
    .lte('date', to);

  const workouts = data ?? [];

  // Map volume per date
  const volumeMap = new Map<string, { type: string; volume: number }>();

  workouts.forEach((w: any) => {
    let totalVolume = 0;
    w.exercises?.forEach((ex: any) => {
      ex.sets?.forEach((s: any) => {
        if (s.weight_kg && s.reps) {
          totalVolume += s.weight_kg * s.reps;
        }
      });
    });

    volumeMap.set(w.date, { type: w.type, volume: totalVolume });
  });

  return last30.map((date, i) => {
    const entry = volumeMap.get(date);
    
    return {
      date,
      label: i % 5 === 0 ? format(parseISO(date), 'MMM d') : '', // Sparse labels
      push: entry?.type === 'push' ? entry.volume : null,
      pull: entry?.type === 'pull' ? entry.volume : null,
      legs: entry?.type === 'legs' ? entry.volume : null,
    };
  });
}
