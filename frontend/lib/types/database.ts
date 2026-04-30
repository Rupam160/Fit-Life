// ============================================================
// FitTrack Pro — Supabase Database Types
// ============================================================

export type WorkoutType = 'push' | 'pull' | 'legs' | 'cardio' | 'rest';
export type GoalType = 'bulking' | 'cutting' | 'maintaining';

export interface DbUser {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  current_weight: number | null;
  target_weight: number | null;
  goal: GoalType | null;
  created_at: string;
  updated_at: string;
}

export interface DbWorkout {
  id: string;
  user_id: string;
  date: string; // ISO date string YYYY-MM-DD
  type: WorkoutType;
  notes: string | null;
  created_at: string;
}

export interface DbExercise {
  id: string;
  workout_id: string;
  name: string;
  order_index: number;
  created_at: string;
}

export interface DbSet {
  id: string;
  exercise_id: string;
  set_number: number;
  weight_kg: number | null;
  reps: number | null;
  created_at: string;
}

export interface DbStreak {
  user_id: string;
  current_streak: number;
  max_streak: number;
  last_workout_date: string | null;
  updated_at: string;
}

// RPC return types
export interface CalendarDataRow {
  workout_date: string;
  workout_type: WorkoutType;
}

export interface WeeklyCaloriesRow {
  workout_date: string;
  calories: number;
  workout_type: WorkoutType;
}

export interface ConsistencyTrendRow {
  day: string;
  worked_out: boolean;
}

export interface StreakUpdateResult {
  current_streak: number;
  max_streak: number;
}
