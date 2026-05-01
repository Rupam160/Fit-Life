'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save, CheckCircle } from 'lucide-react';
import { useWorkoutStore } from '@/lib/store/useWorkoutStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { saveWorkout } from '@/lib/api/workouts';
import { updateStreak } from '@/lib/api/streaks';
import { createClient } from '@/lib/supabase/client';
import { ExerciseRow } from './ExerciseRow';
import { WeeklyRoutinePanel } from './WeeklyRoutinePanel';
import { getTodayRoutine } from '@/lib/constants/weeklyRoutine';
import { WORKOUT_TYPE_LABELS } from '@/lib/constants/calorieEstimates';
import { cn } from '@/lib/utils';
import type { WorkoutType } from '@/lib/types/database';

const WORKOUT_TYPES: WorkoutType[] = ['push', 'pull', 'legs', 'cardio'];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function WorkoutLogger() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const {
    date, type, exercises,
    isSaving, lastSaved,
    setDate, setType,
    addExercise, setExercises,
    setSaving, setLastSaved,
  } = useWorkoutStore();

  const [saveError, setSaveError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  // Auto-load today's routine on mount
  useEffect(() => {
    const routine = getTodayRoutine();
    if (routine && exercises.length === 0) {
      setType(routine.type);
      setExercises(
        routine.exercises.map((ex) => ({
          id: uid(),
          name: ex.name,
          sets: ex.sets.map((s, i) => ({
            id: uid(),
            set_number: i + 1,
            weight_kg: s.weight_kg?.toString() ?? '',
            reps: s.reps_min.toString(),
          })),
        }))
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaveError(null);

    const supabase = createClient();
    const { workoutId, error } = await saveWorkout(supabase, user.id, date, type, exercises);

    if (error) {
      setSaveError(error);
      setSaving(false);
      return;
    }

    // Update streak
    await updateStreak(supabase, user.id, date);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSaved(now);
    setSaving(false);
    setJustSaved(true);

    // Invalidate dashboard cache and redirect
    router.refresh();
    router.push('/dashboard');
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Routine loader */}
      <WeeklyRoutinePanel />

      {/* Workout meta */}
      <div className="card-base p-4 flex flex-wrap gap-4 items-center">
        {/* Date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-base text-sm py-2"
            style={{ width: '160px' }}
          />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Workout type</label>
          <div className="flex gap-1.5">
            {WORKOUT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-medium border transition-all',
                  type === t
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                )}
              >
                {WORKOUT_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex flex-col gap-3">
        {exercises.map((ex, i) => (
          <ExerciseRow key={ex.id} exerciseId={ex.id} index={i} />
        ))}
      </div>

      {/* Add exercise */}
      <button
        onClick={() => addExercise()}
        className="btn-secondary w-full border-dashed"
      >
        <Plus className="w-4 h-4" />
        Add exercise
      </button>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving || exercises.length === 0}
          className="btn-primary min-w-[140px]"
        >
          {isSaving ? (
            'Saving...'
          ) : justSaved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save workout
            </>
          )}
        </button>
        {lastSaved && !justSaved && (
          <span className="text-xs text-slate-400">Last saved at {lastSaved}</span>
        )}
      </div>

      {saveError && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {saveError}
        </div>
      )}
    </div>
  );
}
