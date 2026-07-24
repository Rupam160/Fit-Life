import type { WorkoutType } from '../types/database';
import type { ExerciseInput } from '../types/app';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export type TemplateTier = 'beginner' | 'intermediate' | 'auto_last';

export interface DefaultExerciseTemplate {
  name: string;
  sets: { weight_kg: number | null; reps: number }[];
}

export const BEGINNER_ROUTINES: Record<WorkoutType, DefaultExerciseTemplate[]> = {
  push: [
    { name: 'Dumbbell Bench Press', sets: [{ weight_kg: 15, reps: 10 }, { weight_kg: 17.5, reps: 10 }, { weight_kg: 20, reps: 8 }] },
    { name: 'Seated Dumbbell Shoulder Press', sets: [{ weight_kg: 10, reps: 10 }, { weight_kg: 12, reps: 10 }, { weight_kg: 12, reps: 8 }] },
    { name: 'Incline Dumbbell Press', sets: [{ weight_kg: 12, reps: 12 }, { weight_kg: 14, reps: 10 }, { weight_kg: 14, reps: 10 }] },
    { name: 'Cable / Machine Chest Flyes', sets: [{ weight_kg: 15, reps: 15 }, { weight_kg: 20, reps: 12 }, { weight_kg: 20, reps: 12 }] },
    { name: 'Dumbbell Lateral Raises', sets: [{ weight_kg: 6, reps: 15 }, { weight_kg: 8, reps: 12 }, { weight_kg: 8, reps: 12 }] },
    { name: 'Tricep Rope Pushdowns', sets: [{ weight_kg: 15, reps: 12 }, { weight_kg: 20, reps: 10 }, { weight_kg: 20, reps: 10 }] },
  ],
  pull: [
    { name: 'Lat Pulldown', sets: [{ weight_kg: 25, reps: 10 }, { weight_kg: 30, reps: 10 }, { weight_kg: 35, reps: 8 }] },
    { name: 'Seated Cable Row', sets: [{ weight_kg: 25, reps: 12 }, { weight_kg: 30, reps: 10 }, { weight_kg: 35, reps: 10 }] },
    { name: 'Dumbbell Single-Arm Row', sets: [{ weight_kg: 12, reps: 10 }, { weight_kg: 14, reps: 8 }, { weight_kg: 16, reps: 8 }] },
    { name: 'Face Pulls', sets: [{ weight_kg: 15, reps: 15 }, { weight_kg: 20, reps: 12 }, { weight_kg: 20, reps: 12 }] },
    { name: 'Standing Dumbbell Bicep Curls', sets: [{ weight_kg: 8, reps: 12 }, { weight_kg: 10, reps: 10 }, { weight_kg: 10, reps: 10 }] },
    { name: 'Hammer Curls', sets: [{ weight_kg: 8, reps: 12 }, { weight_kg: 10, reps: 10 }, { weight_kg: 10, reps: 10 }] },
  ],
  legs: [
    { name: 'Goblet Squat', sets: [{ weight_kg: 12, reps: 10 }, { weight_kg: 16, reps: 10 }, { weight_kg: 20, reps: 8 }] },
    { name: 'Leg Press Machine', sets: [{ weight_kg: 50, reps: 12 }, { weight_kg: 70, reps: 10 }, { weight_kg: 80, reps: 10 }] },
    { name: 'Seated Leg Curl Machine', sets: [{ weight_kg: 25, reps: 12 }, { weight_kg: 30, reps: 10 }, { weight_kg: 35, reps: 10 }] },
    { name: 'Standing Calf Raises', sets: [{ weight_kg: 20, reps: 15 }, { weight_kg: 25, reps: 15 }, { weight_kg: 30, reps: 12 }] },
    { name: 'Hanging Knee Raises / Machine Crunches', sets: [{ weight_kg: null, reps: 15 }, { weight_kg: null, reps: 12 }, { weight_kg: null, reps: 12 }] },
  ],
  cardio: [
    { name: 'Treadmill Jogging / Run', sets: [{ weight_kg: null, reps: 20 }] },
    { name: 'Bodyweight Ab Crunches', sets: [{ weight_kg: null, reps: 20 }, { weight_kg: null, reps: 20 }] },
  ],
  rest: [],
};

export const INTERMEDIATE_ROUTINES: Record<WorkoutType, DefaultExerciseTemplate[]> = {
  push: [
    { name: 'Chest Press Machine', sets: [{ weight_kg: 25, reps: 10 }, { weight_kg: 30, reps: 8 }, { weight_kg: 35, reps: 8 }] },
    { name: 'Standing Dumbbell Overhead Press', sets: [{ weight_kg: 10, reps: 10 }, { weight_kg: 12, reps: 8 }, { weight_kg: 14, reps: 8 }] },
    { name: 'Incline Machine Press', sets: [{ weight_kg: 20, reps: 12 }, { weight_kg: 25, reps: 10 }, { weight_kg: 30, reps: 10 }] },
    { name: 'Machine Lateral Raises', sets: [{ weight_kg: 15, reps: 15 }, { weight_kg: 20, reps: 12 }, { weight_kg: 20, reps: 12 }] },
    { name: 'Overhead Cable Tricep Extension', sets: [{ weight_kg: 15, reps: 12 }, { weight_kg: 20, reps: 10 }, { weight_kg: 20, reps: 10 }] },
    { name: 'Bench Dips', sets: [{ weight_kg: null, reps: 12 }, { weight_kg: null, reps: 10 }, { weight_kg: null, reps: 10 }] },
  ],
  pull: [
    { name: 'Supported T-Bar Row / Chest-Supported Row', sets: [{ weight_kg: 20, reps: 10 }, { weight_kg: 25, reps: 8 }, { weight_kg: 30, reps: 8 }] },
    { name: 'Close-Grip Lat Pulldown', sets: [{ weight_kg: 25, reps: 12 }, { weight_kg: 30, reps: 10 }, { weight_kg: 35, reps: 10 }] },
    { name: 'Machine Back Extension', sets: [{ weight_kg: 20, reps: 12 }, { weight_kg: 30, reps: 10 }, { weight_kg: 40, reps: 10 }] },
    { name: 'Reverse Machine Flyes', sets: [{ weight_kg: 15, reps: 15 }, { weight_kg: 20, reps: 12 }, { weight_kg: 25, reps: 12 }] },
    { name: 'EZ-Bar Bicep Curls', sets: [{ weight_kg: 15, reps: 12 }, { weight_kg: 20, reps: 10 }, { weight_kg: 20, reps: 10 }] },
    { name: 'Incline Dumbbell Bicep Curls', sets: [{ weight_kg: 8, reps: 12 }, { weight_kg: 10, reps: 10 }, { weight_kg: 10, reps: 10 }] },
  ],
  legs: [
    { name: 'Dumbbell Romanian Deadlift (RDL)', sets: [{ weight_kg: 16, reps: 10 }, { weight_kg: 20, reps: 8 }, { weight_kg: 24, reps: 8 }] },
    { name: 'Walking Lunges', sets: [{ weight_kg: 10, reps: 12 }, { weight_kg: 12, reps: 10 }, { weight_kg: 14, reps: 10 }] },
    { name: 'Leg Extension Machine', sets: [{ weight_kg: 25, reps: 15 }, { weight_kg: 30, reps: 12 }, { weight_kg: 35, reps: 12 }] },
    { name: 'Seated Calf Raises', sets: [{ weight_kg: 20, reps: 15 }, { weight_kg: 25, reps: 12 }, { weight_kg: 30, reps: 12 }] },
    { name: 'Plank Hold (30-45 sec)', sets: [{ weight_kg: null, reps: 35 }, { weight_kg: null, reps: 35 }, { weight_kg: null, reps: 35 }] },
  ],
  cardio: [
    { name: 'Incline Treadmill Walk (15 min)', sets: [{ weight_kg: null, reps: 1 }] },
    { name: 'Rowing Machine (2000m)', sets: [{ weight_kg: null, reps: 1 }] },
    { name: 'Cable Crunches', sets: [{ weight_kg: 30, reps: 15 }, { weight_kg: 40, reps: 15 }] },
    { name: 'Ab Wheel Rollout', sets: [{ weight_kg: null, reps: 12 }, { weight_kg: null, reps: 12 }] },
  ],
  rest: [],
};

export function convertDbWorkoutToExercises(dbWorkout: any): ExerciseInput[] {
  if (!dbWorkout || !dbWorkout.exercises || dbWorkout.exercises.length === 0) {
    return [];
  }

  const sortedExercises = [...dbWorkout.exercises].sort((a: any, b: any) => a.order_index - b.order_index);

  return sortedExercises.map((ex: any) => {
    const sortedSets = (ex.sets || []).sort((a: any, b: any) => a.set_number - b.set_number);
    return {
      id: uid(),
      name: ex.name,
      sets: sortedSets.length > 0
        ? sortedSets.map((s: any, idx: number) => ({
            id: uid(),
            set_number: idx + 1,
            weight_kg: s.weight_kg !== null && s.weight_kg !== undefined ? String(s.weight_kg) : '',
            reps: s.reps !== null && s.reps !== undefined ? String(s.reps) : '',
          }))
        : [{ id: uid(), set_number: 1, weight_kg: '', reps: '10' }],
    };
  });
}

export function convertDefaultTemplateToExercises(templates: DefaultExerciseTemplate[]): ExerciseInput[] {
  return templates.map((ex) => ({
    id: uid(),
    name: ex.name,
    sets: ex.sets.map((s, idx) => ({
      id: uid(),
      set_number: idx + 1,
      weight_kg: s.weight_kg !== null ? String(s.weight_kg) : '',
      reps: String(s.reps),
    })),
  }));
}
