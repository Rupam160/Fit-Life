'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Zap, ShieldCheck, Check, History, Lock } from 'lucide-react';
import type { WorkoutType } from '@/lib/types/database';
import type { ExerciseInput } from '@/lib/types/app';
import {
  BEGINNER_ROUTINES,
  INTERMEDIATE_ROUTINES,
  convertDefaultTemplateToExercises,
  convertDbWorkoutToExercises,
} from '@/lib/constants/routineTemplates';
import { getLastWorkoutForType } from '@/lib/api/workouts';
import { createClient } from '@/lib/supabase/client';
import { useWorkoutStore } from '@/lib/store/useWorkoutStore';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface Props {
  userId: string | null;
  workoutType: WorkoutType;
  currentDate: string;
  onApplyTemplate: (exercises: ExerciseInput[]) => void;
}

type Mode = 'auto_last' | 'beginner' | 'intermediate';

export function TemplateSelectorPanel({ userId, workoutType, currentDate, onApplyTemplate }: Props) {
  const [mode, setMode] = useState<Mode>('auto_last');
  const [lastWorkout, setLastWorkout] = useState<any>(null);
  const [loadingLast, setLoadingLast] = useState<boolean>(false);
  const setBeginnerMode = useWorkoutStore((s) => s.setBeginnerMode);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;
    setLoadingLast(true);
    const supabase = createClient();

    getLastWorkoutForType(supabase, userId, workoutType, currentDate).then((data) => {
      if (isMounted) {
        setLastWorkout(data);
        setLoadingLast(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [userId, workoutType, currentDate]);

  const handleApply = (targetMode: Mode = mode) => {
    if (targetMode === 'auto_last') {
      setBeginnerMode(false);
      if (lastWorkout && lastWorkout.exercises && lastWorkout.exercises.length > 0) {
        const exercises = convertDbWorkoutToExercises(lastWorkout);
        onApplyTemplate(exercises);
        return;
      }
      // Fallback to intermediate template if no previous workout exists
      const fallback = convertDefaultTemplateToExercises(INTERMEDIATE_ROUTINES[workoutType] || []);
      onApplyTemplate(fallback);
      return;
    }

    if (targetMode === 'beginner') {
      setBeginnerMode(true);
      const exercises = convertDefaultTemplateToExercises(BEGINNER_ROUTINES[workoutType] || []);
      onApplyTemplate(exercises);
      return;
    }

    if (targetMode === 'intermediate') {
      setBeginnerMode(false);
      const exercises = convertDefaultTemplateToExercises(INTERMEDIATE_ROUTINES[workoutType] || []);
      onApplyTemplate(exercises);
      return;
    }
  };

  const formattedLastDate = lastWorkout?.date
    ? format(parseISO(lastWorkout.date), 'EEE, MMM d')
    : null;

  return (
    <div className="card-base p-4 sm:p-5 flex flex-col gap-4 bg-white border border-slate-200/80 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Routine Templates & Auto-Load</h3>
            <p className="text-xs text-slate-400">
              Never re-type exercises. Pre-fill your previous weights & reps or follow starter routines.
            </p>
          </div>
        </div>

        {lastWorkout && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 shrink-0">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Last {workoutType.toUpperCase()}: {formattedLastDate}</span>
          </div>
        )}
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Option 1: Auto-Load Last Session */}
        <div
          onClick={() => {
            setMode('auto_last');
            handleApply('auto_last');
          }}
          className={cn(
            'p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 relative',
            mode === 'auto_last'
              ? 'border-slate-900 bg-slate-900 text-white shadow-sm font-bold'
              : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-800'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className={cn('w-4 h-4', mode === 'auto_last' ? 'text-emerald-400' : 'text-slate-500')} />
              <span className="text-xs font-bold">Last {workoutType.toUpperCase()} Session</span>
            </div>
            {mode === 'auto_last' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
          </div>
          <p className={cn('text-[11px]', mode === 'auto_last' ? 'text-slate-300' : 'text-slate-400')}>
            {loadingLast
              ? 'Fetching previous session...'
              : lastWorkout
              ? `Copies ${lastWorkout.exercises?.length || 0} exercises, weights & reps from ${formattedLastDate}`
              : `Auto-loads your previous ${workoutType.toUpperCase()} session once recorded`}
          </p>
        </div>

        {/* Option 2: Beginner Routine */}
        <div
          onClick={() => {
            setMode('beginner');
            handleApply('beginner');
          }}
          className={cn(
            'p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 relative',
            mode === 'beginner'
              ? 'border-slate-900 bg-slate-900 text-white shadow-sm font-bold'
              : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-800'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className={cn('w-4 h-4', mode === 'beginner' ? 'text-emerald-400' : 'text-emerald-600')} />
              <span className="text-xs font-bold">Beginner Mode</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className={cn('w-3 h-3', mode === 'beginner' ? 'text-amber-300' : 'text-slate-400')} />
              {mode === 'beginner' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
            </div>
          </div>
          <p className={cn('text-[11px]', mode === 'beginner' ? 'text-slate-300' : 'text-slate-400')}>
            Fixed exercise names (Push A/B, Pull A/B, Legs A/B). Edit weights & reps only.
          </p>
        </div>

        {/* Option 3: Intermediate Routine */}
        <div
          onClick={() => {
            setMode('intermediate');
            handleApply('intermediate');
          }}
          className={cn(
            'p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 relative',
            mode === 'intermediate'
              ? 'border-slate-900 bg-slate-900 text-white shadow-sm font-bold'
              : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-800'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className={cn('w-4 h-4', mode === 'intermediate' ? 'text-amber-300' : 'text-indigo-600')} />
              <span className="text-xs font-bold">Intermediate PPL</span>
            </div>
            {mode === 'intermediate' && <Check className="w-4 h-4 text-amber-300 shrink-0" />}
          </div>
          <p className={cn('text-[11px]', mode === 'intermediate' ? 'text-slate-300' : 'text-slate-400')}>
            Full volume PPL split for progressive overload. Editable names & weights.
          </p>
        </div>
      </div>
    </div>
  );
}
