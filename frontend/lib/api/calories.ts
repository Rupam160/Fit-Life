import { SupabaseClient } from '@supabase/supabase-js';
import { estimateCalories } from '../constants/calorieEstimates';
import type { WeeklyCaloriesPoint, ConsistencyPoint } from '../types/app';
import type { WorkoutType } from '../types/database';
import { format, subDays, parseISO } from 'date-fns';

// Build last 7 days date array
function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    subDays(new Date(), 6 - i).toISOString().split('T')[0]
  );
}

// Build last 30 days date array
function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) =>
    subDays(new Date(), 29 - i).toISOString().split('T')[0]
  );
}

export async function getWeeklyCalories(
  supabase: SupabaseClient,
  userId: string
): Promise<WeeklyCaloriesPoint[]> {
  const last7 = getLast7Days();
  const from = last7[0];
  const to = last7[last7.length - 1];

  const { data } = await supabase
    .from('workouts')
    .select('date, type')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to);

  const workoutMap = new Map<string, WorkoutType>();
  (data ?? []).forEach((w: { date: string; type: WorkoutType }) =>
    workoutMap.set(w.date, w.type)
  );

  return last7.map((date) => {
    const type = workoutMap.get(date) ?? null;
    const calories = type ? estimateCalories(type) : 0;
    const d = parseISO(date);
    return {
      date,
      label: format(d, 'EEE'), // "Mon", "Tue" etc.
      calories,
      workout_type: type,
    };
  });
}

export async function getDailyCalories(
  supabase: SupabaseClient,
  userId: string,
  date: string
): Promise<number> {

  const { data } = await supabase
    .from('workouts')
    .select('type')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (!data) return 0;
  return estimateCalories(data.type as WorkoutType);
}

import type { TimeFrame } from './progress';

export async function getConsistencyTrend(
  supabase: SupabaseClient,
  userId: string,
  timeframe: TimeFrame = '30d'
): Promise<ConsistencyPoint[]> {
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

  const { data } = await supabase
    .from('workouts')
    .select('date')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to);

  const workedSet = new Set((data ?? []).map((w: { date: string }) => w.date));

  const startDate = parseISO(from);
  const endDate = parseISO(to);
  const dates: string[] = [];
  let curr = startDate;
  while (curr <= endDate) {
    dates.push(format(curr, 'yyyy-MM-dd'));
    curr = subDays(curr, -1);
  }

  const step = Math.max(1, Math.floor(dates.length / 8));

  return dates.map((date, i) => ({
    date,
    label: i % step === 0 ? format(parseISO(date), 'MMM d') : '',
    value: workedSet.has(date) ? 1 : 0,
  }));
}

