// ============================================================
// FitTrack Pro — Weekly Routine Constants
// EXACT routine as specified
// ============================================================

import type { WeeklyRoutine } from '../types/app';

export const WEEKLY_ROUTINE: WeeklyRoutine = {
  // Sunday — Cardio
  0: {
    type: 'cardio',
    label: 'Cardio',
    exercises: [
      {
        name: '4km Run',
        sets: [{ weight_kg: null, reps_min: 1, reps_max: 1 }],
      },
    ],
  },

  // Monday — Push
  1: {
    type: 'push',
    label: 'Push',
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { weight_kg: 15, reps_min: 15, reps_max: 15 },
          { weight_kg: 20, reps_min: 12, reps_max: 12 },
          { weight_kg: 25, reps_min: 8,  reps_max: 10 },
          { weight_kg: 27.5, reps_min: 6, reps_max: 6 },
        ],
      },
      { name: 'Incline DB Press',  sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Pec Fly',           sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
      { name: 'Skull Crushers',    sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Rope Pushdown',     sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
      { name: 'Cable Crunch',      sets: [{ weight_kg: null, reps_min: 15, reps_max: 20 }] },
      { name: 'Dragon Flag',       sets: [{ weight_kg: null, reps_min: 5,  reps_max: 8  }] },
    ],
  },

  // Tuesday — Pull
  2: {
    type: 'pull',
    label: 'Pull',
    exercises: [
      { name: 'Weighted Pull-ups (7.5kg)', sets: [{ weight_kg: 7.5, reps_min: 6, reps_max: 8 }] },
      { name: 'Straight Arm Pulldown',     sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
      { name: 'Dumbbell Row',              sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Horizontal Row',            sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Pelvic Tilts',             sets: [{ weight_kg: null, reps_min: 15, reps_max: 20 }] },
      { name: 'Barbell Curl',             sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Hammer Curl',             sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Concentration Curl',      sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
    ],
  },

  // Wednesday — Legs
  3: {
    type: 'legs',
    label: 'Legs',
    exercises: [
      { name: 'Squats',               sets: [{ weight_kg: null, reps_min: 8,  reps_max: 12 }] },
      { name: 'Bulgarian Split Squat',sets: [{ weight_kg: null, reps_min: 8,  reps_max: 10 }] },
      { name: 'Leg Extension',        sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
      { name: 'Calf Raise',           sets: [{ weight_kg: null, reps_min: 15, reps_max: 20 }] },
      { name: 'Shoulder Press',       sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Lateral Raise',        sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
      { name: 'Rear Delt Fly',        sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
    ],
  },

  // Thursday — Push (variation)
  4: {
    type: 'push',
    label: 'Push (Variation)',
    exercises: [
      { name: 'Incline Bench Press',  sets: [{ weight_kg: null, reps_min: 8,  reps_max: 12 }] },
      { name: 'DB Shoulder Press',    sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Cable Fly',            sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
      { name: 'Overhead Tricep Ext.', sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Tricep Pushdown',      sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
      { name: 'Ab Wheel Rollout',     sets: [{ weight_kg: null, reps_min: 8,  reps_max: 10 }] },
    ],
  },

  // Friday — Pull (same)
  5: {
    type: 'pull',
    label: 'Pull',
    exercises: [
      { name: 'Weighted Pull-ups (7.5kg)', sets: [{ weight_kg: 7.5, reps_min: 6, reps_max: 8 }] },
      { name: 'Straight Arm Pulldown',     sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
      { name: 'Dumbbell Row',              sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Horizontal Row',            sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Pelvic Tilts',             sets: [{ weight_kg: null, reps_min: 15, reps_max: 20 }] },
      { name: 'Barbell Curl',             sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Hammer Curl',             sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }] },
      { name: 'Concentration Curl',      sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
    ],
  },

  // Saturday — Legs (variation)
  6: {
    type: 'legs',
    label: 'Legs (Variation)',
    exercises: [
      { name: 'Romanian Deadlift',    sets: [{ weight_kg: null, reps_min: 8,  reps_max: 12 }] },
      { name: 'Leg Press',            sets: [{ weight_kg: null, reps_min: 10, reps_max: 15 }] },
      { name: 'Leg Curl',             sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
      { name: 'Calf Raise',           sets: [{ weight_kg: null, reps_min: 15, reps_max: 20 }] },
      { name: 'Lateral Raise',        sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }] },
      { name: 'Face Pull',            sets: [{ weight_kg: null, reps_min: 15, reps_max: 20 }] },
    ],
  },
};

// Helper: get today's routine
export function getTodayRoutine() {
  const dayIndex = new Date().getDay(); // 0=Sun, 6=Sat
  return WEEKLY_ROUTINE[dayIndex];
}

// Helper: get routine for a given day index
export function getRoutineForDay(dayIndex: number) {
  return WEEKLY_ROUTINE[dayIndex] ?? null;
}

// Helper: day labels for display
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_FULL_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
