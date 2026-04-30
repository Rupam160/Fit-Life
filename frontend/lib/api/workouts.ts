import { createClient } from '../supabase/client';
import type { ExerciseInput } from '../types/app';
import type { WorkoutType } from '../types/database';

export async function saveWorkout(
  userId: string,
  date: string,
  type: WorkoutType,
  exercises: ExerciseInput[]
): Promise<{ workoutId: string | null; error: string | null }> {
  const supabase = createClient();

  // Upsert workout row
  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .upsert(
      { user_id: userId, date, type },
      { onConflict: 'user_id,date', ignoreDuplicates: false }
    )
    .select('id')
    .single();

  if (workoutError || !workout) {
    return { workoutId: null, error: workoutError?.message ?? 'Failed to save workout' };
  }

  const workoutId = workout.id;

  // Delete existing exercises for this workout (full replace strategy)
  await supabase.from('exercises').delete().eq('workout_id', workoutId);

  // Insert exercises and sets
  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    if (!ex.name.trim()) continue;

    const { data: exercise, error: exError } = await supabase
      .from('exercises')
      .insert({ workout_id: workoutId, name: ex.name.trim(), order_index: i })
      .select('id')
      .single();

    if (exError || !exercise) continue;

    const setsToInsert = ex.sets
      .filter((s) => s.reps !== '')
      .map((s) => ({
        exercise_id: exercise.id,
        set_number: s.set_number,
        weight_kg: s.weight_kg ? parseFloat(s.weight_kg) : null,
        reps: s.reps ? parseInt(s.reps, 10) : null,
      }));

    if (setsToInsert.length > 0) {
      await supabase.from('sets').insert(setsToInsert);
    }
  }

  return { workoutId, error: null };
}

export async function getWorkoutDates(
  userId: string,
  fromDate: string,
  toDate: string
): Promise<Array<{ date: string; type: WorkoutType }>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('workouts')
    .select('date, type')
    .eq('user_id', userId)
    .gte('date', fromDate)
    .lte('date', toDate)
    .order('date', { ascending: true });

  if (error || !data) return [];
  return data as Array<{ date: string; type: WorkoutType }>;
}

export async function getWorkoutForDate(
  userId: string,
  date: string
) {
  const supabase = createClient();

  const { data: workout } = await supabase
    .from('workouts')
    .select(`
      id,
      date,
      type,
      exercises (
        id,
        name,
        order_index,
        sets (
          id,
          set_number,
          weight_kg,
          reps
        )
      )
    `)
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  return workout ?? null;
}
