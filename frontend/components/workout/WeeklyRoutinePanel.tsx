'use client';

import { getTodayRoutine, WEEKLY_ROUTINE, DAY_LABELS } from '@/lib/constants/weeklyRoutine';
import { useWorkoutStore } from '@/lib/store/useWorkoutStore';
import { cn } from '@/lib/utils';
import type { ExerciseInput, SetInput } from '@/lib/types/app';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function routineToExercises(routine: ReturnType<typeof getTodayRoutine>): ExerciseInput[] {
  if (!routine) return [];
  return routine.exercises.map((ex) => ({
    id: uid(),
    name: ex.name,
    sets: ex.sets.map((s, i) => ({
      id: uid(),
      set_number: i + 1,
      weight_kg: s.weight_kg?.toString() ?? '',
      reps: s.reps_min.toString(),
    })),
  }));
}

export function WeeklyRoutinePanel() {
  const setExercises = useWorkoutStore((s) => s.setExercises);
  const setType = useWorkoutStore((s) => s.setType);
  const today = new Date().getDay();

  function loadRoutine(dayIndex: number) {
    const routine = WEEKLY_ROUTINE[dayIndex];
    if (!routine) return;
    setType(routine.type);
    setExercises(routineToExercises(routine));
  }

  return (
    <div className="card-base p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Load Weekly Routine</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_LABELS.map((label, i) => {
          const routine = WEEKLY_ROUTINE[i];
          const isToday = i === today;
          return (
            <button
              key={i}
              onClick={() => loadRoutine(i)}
              title={routine?.label}
              className={cn(
                'flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all',
                isToday
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
              )}
            >
              <span>{label}</span>
              <span className={cn('text-[9px] uppercase tracking-wide', isToday ? 'text-slate-300' : 'text-slate-400')}>
                {routine?.type?.slice(0, 4) ?? '—'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
