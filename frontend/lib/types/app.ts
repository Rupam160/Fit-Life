// ============================================================
// FitTrack Pro — App-level Types
// ============================================================

import type { WorkoutType } from './database';

// ── UI Exercise / Set state (before saving) ──────────────────
export interface SetInput {
  id: string; // client-side temp id
  set_number: number;
  weight_kg: string; // string for input control
  reps: string;
}

export interface ExerciseInput {
  id: string; // client-side temp id
  name: string;
  sets: SetInput[];
}

export interface WorkoutInput {
  date: string;
  type: WorkoutType;
  exercises: ExerciseInput[];
}

// ── Dashboard data ───────────────────────────────────────────
export interface StreakData {
  current_streak: number;
  max_streak: number;
  last_workout_date: string | null;
}

export interface CalendarDay {
  date: string;
  workout_type: WorkoutType | null;
  is_today: boolean;
}

export interface WeeklyCaloriesPoint {
  date: string;
  label: string; // e.g. "Mon"
  calories: number;
  workout_type: WorkoutType | null;
}

export interface ConsistencyPoint {
  date: string;
  label: string;
  value: number; // 1 = worked out, 0 = missed
}

// ── Profile ──────────────────────────────────────────────────
export interface ProfileUpdate {
  name: string;
  current_weight: number | null;
  target_weight: number | null;
  goal: 'bulking' | 'cutting' | 'maintaining' | null;
}

// ── Weekly Routine ───────────────────────────────────────────
export interface RoutineSet {
  weight_kg: number | null;
  reps_min: number;
  reps_max: number;
}

export interface RoutineExercise {
  name: string;
  sets: RoutineSet[];
}

export interface DayRoutine {
  type: WorkoutType;
  label: string;
  exercises: RoutineExercise[];
}

export type WeeklyRoutine = Record<number, DayRoutine>; // 0=Sun ... 6=Sat
