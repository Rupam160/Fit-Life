import type { WeeklyRoutine } from '../types/app';

export const WEEKLY_ROUTINE: WeeklyRoutine = {
  // Sunday — REST
  0: {
    type: 'rest',
    label: 'Rest Day',
    exercises: [],
  },

  // Monday — Push A
  1: {
    type: 'push',
    label: 'Push A (Chest, Shoulders, Triceps)',
    exercises: [
      { name: 'Dumbbell Bench Press', sets: [{ weight_kg: 15, reps_min: 8, reps_max: 10 }, { weight_kg: 17.5, reps_min: 8, reps_max: 10 }, { weight_kg: 20, reps_min: 8, reps_max: 10 }] },
      { name: 'Seated Dumbbell Shoulder Press', sets: [{ weight_kg: 10, reps_min: 8, reps_max: 10 }, { weight_kg: 12, reps_min: 8, reps_max: 10 }, { weight_kg: 12, reps_min: 8, reps_max: 10 }] },
      { name: 'Incline Dumbbell Press', sets: [{ weight_kg: 12, reps_min: 10, reps_max: 12 }, { weight_kg: 14, reps_min: 10, reps_max: 12 }, { weight_kg: 14, reps_min: 10, reps_max: 12 }] },
      { name: 'Cable / Machine Chest Flyes', sets: [{ weight_kg: 15, reps_min: 12, reps_max: 15 }, { weight_kg: 20, reps_min: 12, reps_max: 15 }, { weight_kg: 20, reps_min: 12, reps_max: 15 }] },
      { name: 'Dumbbell Lateral Raises', sets: [{ weight_kg: 6, reps_min: 12, reps_max: 15 }, { weight_kg: 8, reps_min: 12, reps_max: 15 }, { weight_kg: 8, reps_min: 12, reps_max: 15 }] },
      { name: 'Tricep Rope Pushdowns', sets: [{ weight_kg: 15, reps_min: 10, reps_max: 12 }, { weight_kg: 20, reps_min: 10, reps_max: 12 }, { weight_kg: 20, reps_min: 10, reps_max: 12 }] },
    ],
  },

  // Tuesday — Pull A
  2: {
    type: 'pull',
    label: 'Pull A (Back, Rear Delts, Biceps)',
    exercises: [
      { name: 'Lat Pulldown', sets: [{ weight_kg: 25, reps_min: 8, reps_max: 10 }, { weight_kg: 30, reps_min: 8, reps_max: 10 }, { weight_kg: 35, reps_min: 8, reps_max: 10 }] },
      { name: 'Seated Cable Row', sets: [{ weight_kg: 25, reps_min: 10, reps_max: 12 }, { weight_kg: 30, reps_min: 10, reps_max: 12 }, { weight_kg: 35, reps_min: 10, reps_max: 12 }] },
      { name: 'Dumbbell Single-Arm Row', sets: [{ weight_kg: 12, reps_min: 8, reps_max: 10 }, { weight_kg: 14, reps_min: 8, reps_max: 10 }, { weight_kg: 16, reps_min: 8, reps_max: 10 }] },
      { name: 'Face Pulls', sets: [{ weight_kg: 15, reps_min: 12, reps_max: 15 }, { weight_kg: 20, reps_min: 12, reps_max: 15 }, { weight_kg: 20, reps_min: 12, reps_max: 15 }] },
      { name: 'Standing Dumbbell Bicep Curls', sets: [{ weight_kg: 8, reps_min: 10, reps_max: 12 }, { weight_kg: 10, reps_min: 10, reps_max: 12 }, { weight_kg: 10, reps_min: 10, reps_max: 12 }] },
      { name: 'Hammer Curls', sets: [{ weight_kg: 8, reps_min: 10, reps_max: 12 }, { weight_kg: 10, reps_min: 10, reps_max: 12 }, { weight_kg: 10, reps_min: 10, reps_max: 12 }] },
    ],
  },

  // Wednesday — Legs A
  3: {
    type: 'legs',
    label: 'Legs A (Quads, Hamstrings, Calves, Abs)',
    exercises: [
      { name: 'Goblet Squat', sets: [{ weight_kg: 12, reps_min: 8, reps_max: 10 }, { weight_kg: 16, reps_min: 8, reps_max: 10 }, { weight_kg: 20, reps_min: 8, reps_max: 10 }] },
      { name: 'Leg Press Machine', sets: [{ weight_kg: 50, reps_min: 10, reps_max: 12 }, { weight_kg: 70, reps_min: 10, reps_max: 12 }, { weight_kg: 80, reps_min: 10, reps_max: 12 }] },
      { name: 'Seated Leg Curl Machine', sets: [{ weight_kg: 25, reps_min: 10, reps_max: 12 }, { weight_kg: 30, reps_min: 10, reps_max: 12 }, { weight_kg: 35, reps_min: 10, reps_max: 12 }] },
      { name: 'Standing Calf Raises', sets: [{ weight_kg: 20, reps_min: 12, reps_max: 15 }, { weight_kg: 25, reps_min: 12, reps_max: 15 }, { weight_kg: 30, reps_min: 12, reps_max: 15 }] },
      { name: 'Hanging Knee Raises / Machine Crunches', sets: [{ weight_kg: null, reps_min: 12, reps_max: 15 }, { weight_kg: null, reps_min: 12, reps_max: 15 }, { weight_kg: null, reps_min: 12, reps_max: 15 }] },
    ],
  },

  // Thursday — Push B
  4: {
    type: 'push',
    label: 'Push B (Chest, Shoulders, Triceps)',
    exercises: [
      { name: 'Chest Press Machine', sets: [{ weight_kg: 25, reps_min: 8, reps_max: 10 }, { weight_kg: 30, reps_min: 8, reps_max: 10 }, { weight_kg: 35, reps_min: 8, reps_max: 10 }] },
      { name: 'Standing Dumbbell Overhead Press', sets: [{ weight_kg: 10, reps_min: 8, reps_max: 10 }, { weight_kg: 12, reps_min: 8, reps_max: 10 }, { weight_kg: 14, reps_min: 8, reps_max: 10 }] },
      { name: 'Incline Machine Press', sets: [{ weight_kg: 20, reps_min: 10, reps_max: 12 }, { weight_kg: 25, reps_min: 10, reps_max: 12 }, { weight_kg: 30, reps_min: 10, reps_max: 12 }] },
      { name: 'Machine Lateral Raises', sets: [{ weight_kg: 15, reps_min: 12, reps_max: 15 }, { weight_kg: 20, reps_min: 12, reps_max: 15 }, { weight_kg: 20, reps_min: 12, reps_max: 15 }] },
      { name: 'Overhead Cable Tricep Extension', sets: [{ weight_kg: 15, reps_min: 10, reps_max: 12 }, { weight_kg: 20, reps_min: 10, reps_max: 12 }, { weight_kg: 20, reps_min: 10, reps_max: 12 }] },
      { name: 'Bench Dips', sets: [{ weight_kg: null, reps_min: 10, reps_max: 12 }, { weight_kg: null, reps_min: 10, reps_max: 12 }, { weight_kg: null, reps_min: 10, reps_max: 12 }] },
    ],
  },

  // Friday — Pull B
  5: {
    type: 'pull',
    label: 'Pull B (Back, Rear Delts, Biceps)',
    exercises: [
      { name: 'Supported T-Bar Row / Chest-Supported Row', sets: [{ weight_kg: 20, reps_min: 8, reps_max: 10 }, { weight_kg: 25, reps_min: 8, reps_max: 10 }, { weight_kg: 30, reps_min: 8, reps_max: 10 }] },
      { name: 'Close-Grip Lat Pulldown', sets: [{ weight_kg: 25, reps_min: 10, reps_max: 12 }, { weight_kg: 30, reps_min: 10, reps_max: 12 }, { weight_kg: 35, reps_min: 10, reps_max: 12 }] },
      { name: 'Machine Back Extension', sets: [{ weight_kg: 20, reps_min: 10, reps_max: 12 }, { weight_kg: 30, reps_min: 10, reps_max: 12 }, { weight_kg: 40, reps_min: 10, reps_max: 12 }] },
      { name: 'Reverse Machine Flyes', sets: [{ weight_kg: 15, reps_min: 12, reps_max: 15 }, { weight_kg: 20, reps_min: 12, reps_max: 15 }, { weight_kg: 25, reps_min: 12, reps_max: 15 }] },
      { name: 'EZ-Bar Bicep Curls', sets: [{ weight_kg: 15, reps_min: 10, reps_max: 12 }, { weight_kg: 20, reps_min: 10, reps_max: 12 }, { weight_kg: 20, reps_min: 10, reps_max: 12 }] },
      { name: 'Incline Dumbbell Bicep Curls', sets: [{ weight_kg: 8, reps_min: 10, reps_max: 12 }, { weight_kg: 10, reps_min: 10, reps_max: 12 }, { weight_kg: 10, reps_min: 10, reps_max: 12 }] },
    ],
  },

  // Saturday — Legs B
  6: {
    type: 'legs',
    label: 'Legs B (Glutes, Hamstrings, Quads, Core)',
    exercises: [
      { name: 'Dumbbell Romanian Deadlift (RDL)', sets: [{ weight_kg: 16, reps_min: 8, reps_max: 10 }, { weight_kg: 20, reps_min: 8, reps_max: 10 }, { weight_kg: 24, reps_min: 8, reps_max: 10 }] },
      { name: 'Walking Lunges', sets: [{ weight_kg: 10, reps_min: 10, reps_max: 12 }, { weight_kg: 12, reps_min: 10, reps_max: 12 }, { weight_kg: 14, reps_min: 10, reps_max: 12 }] },
      { name: 'Leg Extension Machine', sets: [{ weight_kg: 25, reps_min: 12, reps_max: 15 }, { weight_kg: 30, reps_min: 12, reps_max: 15 }, { weight_kg: 35, reps_min: 12, reps_max: 15 }] },
      { name: 'Seated Calf Raises', sets: [{ weight_kg: 20, reps_min: 12, reps_max: 15 }, { weight_kg: 25, reps_min: 12, reps_max: 15 }, { weight_kg: 30, reps_min: 12, reps_max: 15 }] },
      { name: 'Plank Hold (30-45 sec)', sets: [{ weight_kg: null, reps_min: 30, reps_max: 45 }, { weight_kg: null, reps_min: 30, reps_max: 45 }, { weight_kg: null, reps_min: 30, reps_max: 45 }] },
    ],
  },
};

export function getTodayRoutine() {
  const dayIndex = new Date().getDay();
  return WEEKLY_ROUTINE[dayIndex];
}

export function getRoutineForDay(dayIndex: number) {
  return WEEKLY_ROUTINE[dayIndex] ?? null;
}

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_FULL_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
