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

export type TimeFrame = '30d' | '3m' | '6m' | 'all';

export async function getVolumeProgress(
  supabase: SupabaseClient,
  userId: string,
  timeframe: TimeFrame = '30d'
): Promise<VolumeProgressPoint[]> {
  let from: string;
  const to = format(new Date(), 'yyyy-MM-dd');

  if (timeframe === '3m') {
    from = format(subDays(new Date(), 89), 'yyyy-MM-dd');
  } else if (timeframe === '6m') {
    from = format(subDays(new Date(), 179), 'yyyy-MM-dd');
  } else if (timeframe === 'all') {
    const { data: firstWorkout } = await supabase
      .from('workouts')
      .select('date')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .limit(1)
      .maybeSingle();

    from = firstWorkout?.date ?? format(subDays(new Date(), 89), 'yyyy-MM-dd');
  } else {
    from = format(subDays(new Date(), 29), 'yyyy-MM-dd');
  }

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
    .lte('date', to)
    .order('date', { ascending: true });

  const workouts = data ?? [];

  if (workouts.length === 0) {
    return [];
  }

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

  // Build array of dates from 'from' to 'to'
  const startDate = parseISO(from);
  const endDate = parseISO(to);
  const dates: string[] = [];
  let curr = startDate;
  while (curr <= endDate) {
    dates.push(format(curr, 'yyyy-MM-dd'));
    curr = subDays(curr, -1);
  }

  const step = Math.max(1, Math.floor(dates.length / 8));

  return dates.map((date, i) => {
    const entry = volumeMap.get(date);
    
    return {
      date,
      label: i % step === 0 ? format(parseISO(date), 'MMM d') : '', // Sparse labels based on date range
      push: entry?.type === 'push' ? entry.volume : null,
      pull: entry?.type === 'pull' ? entry.volume : null,
      legs: entry?.type === 'legs' ? entry.volume : null,
    };
  });
}

