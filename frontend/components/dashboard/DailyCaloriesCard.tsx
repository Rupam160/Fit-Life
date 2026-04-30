'use client';

import { Zap } from 'lucide-react';
import { WORKOUT_TYPE_LABELS } from '@/lib/constants/calorieEstimates';
import type { WorkoutType } from '@/lib/types/database';

interface DailyCaloriesCardProps {
  calories: number;
  workoutType: WorkoutType | null;
}

export function DailyCaloriesCard({ calories, workoutType }: DailyCaloriesCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
          <Zap className="w-4 h-4 text-green-500" />
        </div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Today</span>
      </div>

      <div className="flex items-end gap-1.5 mt-1">
        {calories > 0 ? (
          <>
            <span className="text-4xl font-bold text-slate-800 tabular-nums">{calories}</span>
            <span className="text-sm text-slate-400 mb-1">kcal</span>
          </>
        ) : (
          <span className="text-3xl font-bold text-slate-300">--</span>
        )}
      </div>

      <p className="text-xs text-slate-400">
        {workoutType
          ? `${WORKOUT_TYPE_LABELS[workoutType]} session`
          : 'No workout logged yet'}
      </p>
    </div>
  );
}
