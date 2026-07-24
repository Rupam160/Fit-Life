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
    { name: 'Barbell Bench Press', sets: [{ weight_kg: 20, reps: 12 }, { weight_kg: 25, reps: 10 }, { weight_kg: 30, reps: 8 }] },
    { name: 'Incline Dumbbell Press', sets: [{ weight_kg: 10, reps: 12 }, { weight_kg: 12, reps: 10 }] },
    { name: 'Dumbbell Shoulder Press', sets: [{ weight_kg: 8, reps: 12 }, { weight_kg: 10, reps: 10 }] },
    { name: 'Tricep Cable Pushdown', sets: [{ weight_kg: 15, reps: 15 }, { weight_kg: 20, reps: 12 }] },
  ],
  pull: [
    { name: 'Lat Pulldown', sets: [{ weight_kg: 25, reps: 12 }, { weight_kg: 30, reps: 10 }, { weight_kg: 35, reps: 8 }] },
    { name: 'Seated Cable Row', sets: [{ weight_kg: 25, reps: 12 }, { weight_kg: 30, reps: 10 }] },
    { name: 'Dumbbell Bicep Curl', sets: [{ weight_kg: 8, reps: 12 }, { weight_kg: 10, reps: 10 }] },
    { name: 'Face Pulls', sets: [{ weight_kg: 12, reps: 15 }, { weight_kg: 15, reps: 12 }] },
  ],
  legs: [
    { name: 'Barbell Squats', sets: [{ weight_kg: 30, reps: 12 }, { weight_kg: 40, reps: 10 }, { weight_kg: 50, reps: 8 }] },
    { name: 'Leg Press', sets: [{ weight_kg: 50, reps: 12 }, { weight_kg: 70, reps: 10 }] },
    { name: 'Leg Extension', sets: [{ weight_kg: 20, reps: 15 }, { weight_kg: 25, reps: 12 }] },
    { name: 'Standing Calf Raise', sets: [{ weight_kg: 20, reps: 15 }, { weight_kg: 25, reps: 15 }] },
  ],
  cardio: [
    { name: 'Treadmill Jogging / Run', sets: [{ weight_kg: null, reps: 20 }] },
    { name: 'Bodyweight Ab Crunches', sets: [{ weight_kg: null, reps: 20 }, { weight_kg: null, reps: 20 }] },
  ],
  rest: [],
};

export const INTERMEDIATE_ROUTINES: Record<WorkoutType, DefaultExerciseTemplate[]> = {
  push: [
    { name: 'Flat Barbell Bench Press', sets: [{ weight_kg: 40, reps: 10 }, { weight_kg: 50, reps: 8 }, { weight_kg: 60, reps: 6 }, { weight_kg: 65, reps: 5 }] },
    { name: 'Incline DB Chest Press', sets: [{ weight_kg: 18, reps: 10 }, { weight_kg: 22, reps: 8 }, { weight_kg: 24, reps: 8 }] },
    { name: 'Pec Deck / Cable Flyes', sets: [{ weight_kg: 25, reps: 12 }, { weight_kg: 30, reps: 12 }] },
    { name: 'Seated DB Overhead Press', sets: [{ weight_kg: 16, reps: 10 }, { weight_kg: 18, reps: 8 }] },
    { name: 'Skullcrushers', sets: [{ weight_kg: 15, reps: 12 }, { weight_kg: 20, reps: 10 }] },
    { name: 'Rope Pushdown', sets: [{ weight_kg: 20, reps: 15 }, { weight_kg: 25, reps: 12 }] },
  ],
  pull: [
    { name: 'Weighted Pull-ups', sets: [{ weight_kg: 5, reps: 8 }, { weight_kg: 10, reps: 6 }, { weight_kg: 10, reps: 6 }] },
    { name: 'Bent-Over Barbell Row', sets: [{ weight_kg: 40, reps: 10 }, { weight_kg: 50, reps: 8 }, { weight_kg: 55, reps: 8 }] },
    { name: 'Single Arm DB Row', sets: [{ weight_kg: 20, reps: 10 }, { weight_kg: 24, reps: 10 }] },
    { name: 'Straight Arm Pulldown', sets: [{ weight_kg: 20, reps: 12 }, { weight_kg: 25, reps: 12 }] },
    { name: 'Barbell Bicep Curl', sets: [{ weight_kg: 15, reps: 10 }, { weight_kg: 20, reps: 8 }] },
    { name: 'Dumbbell Hammer Curl', sets: [{ weight_kg: 12, reps: 12 }, { weight_kg: 14, reps: 10 }] },
  ],
  legs: [
    { name: 'Heavy Barbell Back Squats', sets: [{ weight_kg: 60, reps: 10 }, { weight_kg: 80, reps: 8 }, { weight_kg: 90, reps: 6 }, { weight_kg: 100, reps: 5 }] },
    { name: 'Romanian Deadlift (RDL)', sets: [{ weight_kg: 50, reps: 10 }, { weight_kg: 60, reps: 8 }, { weight_kg: 70, reps: 8 }] },
    { name: 'Bulgarian Split Squat', sets: [{ weight_kg: 12, reps: 10 }, { weight_kg: 16, reps: 8 }] },
    { name: 'Leg Extension', sets: [{ weight_kg: 35, reps: 12 }, { weight_kg: 45, reps: 10 }] },
    { name: 'Lying Leg Curl', sets: [{ weight_kg: 30, reps: 12 }, { weight_kg: 35, reps: 10 }] },
    { name: 'DB Lateral Raise', sets: [{ weight_kg: 10, reps: 15 }, { weight_kg: 12, reps: 12 }] },
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
