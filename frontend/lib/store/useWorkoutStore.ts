import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { ExerciseInput, SetInput } from '../types/app';
import type { WorkoutType } from '../types/database';

// nanoid is tiny and built into modern JS — but we'll use a simple alternative
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

interface WorkoutState {
  date: string;
  type: WorkoutType;
  exercises: ExerciseInput[];
  isSaving: boolean;
  lastSaved: string | null;

  setDate: (date: string) => void;
  setType: (type: WorkoutType) => void;
  setExercises: (exercises: ExerciseInput[]) => void;

  addExercise: (name?: string) => void;
  removeExercise: (exerciseId: string) => void;
  updateExerciseName: (exerciseId: string, name: string) => void;

  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, field: keyof Pick<SetInput, 'weight_kg' | 'reps'>, value: string) => void;

  setSaving: (saving: boolean) => void;
  setLastSaved: (time: string | null) => void;
  reset: () => void;
}

const today = new Date().toISOString().split('T')[0];

const makeEmptySet = (setNumber: number): SetInput => ({
  id: uid(),
  set_number: setNumber,
  weight_kg: '',
  reps: '',
});

const makeEmptyExercise = (name = ''): ExerciseInput => ({
  id: uid(),
  name,
  sets: [makeEmptySet(1)],
});

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  date: today,
  type: 'push',
  exercises: [],
  isSaving: false,
  lastSaved: null,

  setDate: (date) => set({ date }),
  setType: (type) => set({ type }),

  setExercises: (exercises) => set({ exercises }),

  addExercise: (name = '') =>
    set((state) => ({
      exercises: [...state.exercises, makeEmptyExercise(name)],
    })),

  removeExercise: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.filter((e) => e.id !== exerciseId),
    })),

  updateExerciseName: (exerciseId, name) =>
    set((state) => ({
      exercises: state.exercises.map((e) =>
        e.id === exerciseId ? { ...e, name } : e
      ),
    })),

  addSet: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.map((e) => {
        if (e.id !== exerciseId) return e;
        const nextNum = e.sets.length + 1;
        return { ...e, sets: [...e.sets, makeEmptySet(nextNum)] };
      }),
    })),

  removeSet: (exerciseId, setId) =>
    set((state) => ({
      exercises: state.exercises.map((e) => {
        if (e.id !== exerciseId) return e;
        const filtered = e.sets.filter((s) => s.id !== setId);
        // Renumber
        return {
          ...e,
          sets: filtered.map((s, i) => ({ ...s, set_number: i + 1 })),
        };
      }),
    })),

  updateSet: (exerciseId, setId, field, value) =>
    set((state) => ({
      exercises: state.exercises.map((e) => {
        if (e.id !== exerciseId) return e;
        return {
          ...e,
          sets: e.sets.map((s) =>
            s.id === setId ? { ...s, [field]: value } : s
          ),
        };
      }),
    })),

  setSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (lastSaved) => set({ lastSaved }),

  reset: () =>
    set({
      date: new Date().toISOString().split('T')[0],
      type: 'push',
      exercises: [],
      isSaving: false,
      lastSaved: null,
    }),
}));
