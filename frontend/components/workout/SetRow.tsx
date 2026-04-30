'use client';

import { X } from 'lucide-react';
import { useWorkoutStore } from '@/lib/store/useWorkoutStore';

interface SetRowProps {
  exerciseId: string;
  setId: string;
}

export function SetRow({ exerciseId, setId }: SetRowProps) {
  const set = useWorkoutStore((s) => {
    const ex = s.exercises.find((e) => e.id === exerciseId);
    return ex?.sets.find((s) => s.id === setId);
  });
  const removeSet = useWorkoutStore((s) => s.removeSet);
  const updateSet = useWorkoutStore((s) => s.updateSet);

  if (!set) return null;

  return (
    <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 items-center">
      {/* Set number */}
      <span className="text-xs font-semibold text-slate-400 text-center tabular-nums">
        {set.set_number}
      </span>

      {/* Weight */}
      <input
        type="number"
        min="0"
        step="0.5"
        value={set.weight_kg}
        onChange={(e) => updateSet(exerciseId, setId, 'weight_kg', e.target.value)}
        placeholder="—"
        className="input-base text-sm text-center py-2 px-2"
      />

      {/* Reps */}
      <input
        type="number"
        min="0"
        step="1"
        value={set.reps}
        onChange={(e) => updateSet(exerciseId, setId, 'reps', e.target.value)}
        placeholder="—"
        className="input-base text-sm text-center py-2 px-2"
      />

      {/* Remove */}
      <button
        onClick={() => removeSet(exerciseId, setId)}
        className="p-1 rounded text-slate-300 hover:text-red-400 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
