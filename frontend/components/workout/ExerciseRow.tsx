'use client';

import { Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkoutStore } from '@/lib/store/useWorkoutStore';
import { SetRow } from './SetRow';

interface ExerciseRowProps {
  exerciseId: string;
  index: number;
}

export function ExerciseRow({ exerciseId, index }: ExerciseRowProps) {
  const exercise = useWorkoutStore((s) => s.exercises.find((e) => e.id === exerciseId));
  const removeExercise = useWorkoutStore((s) => s.removeExercise);
  const updateExerciseName = useWorkoutStore((s) => s.updateExerciseName);
  const addSet = useWorkoutStore((s) => s.addSet);

  if (!exercise) return null;

  return (
    <div className="card-base p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 shrink-0">
          {index + 1}
        </span>
        <input
          type="text"
          value={exercise.name}
          onChange={(e) => updateExerciseName(exerciseId, e.target.value)}
          placeholder="Exercise name"
          className="flex-1 text-sm font-medium text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-400"
        />
        <button
          onClick={() => removeExercise(exerciseId)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Set headers */}
      <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 px-1">
        <span className="text-xs text-slate-400 text-center">Set</span>
        <span className="text-xs text-slate-400">Weight (kg)</span>
        <span className="text-xs text-slate-400">Reps</span>
        <span />
      </div>

      {/* Sets */}
      <div className="flex flex-col gap-2">
        {exercise.sets.map((set) => (
          <SetRow key={set.id} exerciseId={exerciseId} setId={set.id} />
        ))}
      </div>

      {/* Add set */}
      <button
        onClick={() => addSet(exerciseId)}
        className={cn(
          'flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800',
          'transition-colors px-1 py-1 rounded-lg hover:bg-slate-50'
        )}
      >
        <Plus className="w-3.5 h-3.5" />
        Add set
      </button>
    </div>
  );
}
