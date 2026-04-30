// ============================================================
// FitTrack Pro — Calorie Estimates
// ============================================================

import type { WorkoutType } from '../types/database';

export const CALORIE_ESTIMATES: Record<WorkoutType, number> = {
  push: 350,
  pull: 350,
  legs: 380,
  cardio: 300,
  rest: 0,
};

export function estimateCalories(workoutType: WorkoutType): number {
  return CALORIE_ESTIMATES[workoutType] ?? 0;
}

export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
  push: 'Push',
  pull: 'Pull',
  legs: 'Legs',
  cardio: 'Cardio',
  rest: 'Rest',
};

export const WORKOUT_TYPE_COLORS: Record<WorkoutType, string> = {
  push: '#3b82f6',
  pull: '#8b5cf6',
  legs: '#10b981',
  cardio: '#f59e0b',
  rest: '#94a3b8',
};
