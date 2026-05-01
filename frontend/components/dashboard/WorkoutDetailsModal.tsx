'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, Save, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getWorkoutForDate, updateWorkoutNotes, deleteWorkout } from '@/lib/api/workouts';
import { useWorkoutStore } from '@/lib/store/useWorkoutStore';
import { WORKOUT_TYPE_LABELS, WORKOUT_TYPE_COLORS } from '@/lib/constants/calorieEstimates';
import { cn } from '@/lib/utils';

interface WorkoutDetailsModalProps {
  dateStr: string | null; // e.g. "2023-10-25"
  isOpen: boolean;
  onClose: () => void;
}

export function WorkoutDetailsModal({ dateStr, isOpen, onClose }: WorkoutDetailsModalProps) {
  const router = useRouter();
  const { setDate, setType, setExercises } = useWorkoutStore();
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen || !dateStr) return;

    let isMounted = true;
    setLoading(true);
    setWorkout(null);
    setNotes('');

    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }
      
      const data = await getWorkoutForDate(supabase, user.id, dateStr!);
      if (isMounted) {
        setWorkout(data);
        setNotes(data?.notes || '');
        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [isOpen, dateStr]);

  async function handleSaveNotes() {
    if (!workout?.id) return;
    setSavingNotes(true);
    const supabase = createClient();
    const { error } = await updateWorkoutNotes(supabase, workout.id, notes);
    setSavingNotes(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1000);
    }
  }

  async function handleDelete() {
    if (!workout?.id) return;
    if (!confirm('Are you sure you want to delete this workout? This action cannot be undone.')) return;
    
    setIsDeleting(true);
    const supabase = createClient();
    await deleteWorkout(supabase, workout.id);
    setIsDeleting(false);
    
    onClose();
    router.refresh();
  }

  function handleEdit() {
    if (!workout) return;
    setDate(workout.date);
    setType(workout.type as any);
    
    const mappedExercises = (workout.exercises || []).map((ex: any) => ({
      id: ex.id,
      name: ex.name,
      sets: (ex.sets || []).map((s: any) => ({
        id: s.id,
        set_number: s.set_number,
        weight_kg: s.weight_kg?.toString() ?? '',
        reps: s.reps?.toString() ?? '',
      }))
    }));
    
    setExercises(mappedExercises);
    router.push('/workout');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {dateStr ? format(parseISO(dateStr), 'EEEE, MMMM d') : ''}
            </h3>
            {workout?.type && (
              <span 
                className="text-xs font-medium px-2 py-0.5 rounded-md mt-1 inline-block"
                style={{ backgroundColor: WORKOUT_TYPE_COLORS[workout.type as keyof typeof WORKOUT_TYPE_COLORS] + '20', color: WORKOUT_TYPE_COLORS[workout.type as keyof typeof WORKOUT_TYPE_COLORS] }}
              >
                {WORKOUT_TYPE_LABELS[workout.type as keyof typeof WORKOUT_TYPE_LABELS]}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
            </div>
          ) : !workout ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">😴</span>
              </div>
              <p className="text-slate-500 font-medium">No workout recorded for this date.</p>
              <p className="text-xs text-slate-400 mt-1">Take a rest day or log a past workout!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* Exercises List */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-slate-700">Exercises</h4>
                {workout.exercises?.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No exercises logged.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {workout.exercises?.sort((a: any, b: any) => a.order_index - b.order_index).map((ex: any) => (
                      <div key={ex.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                        <p className="font-medium text-sm text-slate-800 mb-2">{ex.name}</p>
                        <div className="grid grid-cols-3 gap-2">
                          {ex.sets?.sort((a: any, b: any) => a.set_number - b.set_number).map((set: any) => (
                            <div key={set.id} className="text-xs flex flex-col bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                              <span className="text-slate-400 font-medium mb-0.5">Set {set.set_number}</span>
                              <span className="text-slate-700 font-semibold">
                                {set.weight_kg ? `${set.weight_kg}kg × ` : ''}{set.reps} reps
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-700">Workout Notes</h4>
                  {saved && <span className="text-xs font-medium text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Saved</span>}
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did you feel today? Any PRs?"
                  className="input-base text-sm resize-y min-h-[100px] leading-relaxed"
                />
                <button 
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="btn-secondary self-end text-xs py-1.5 px-3 h-auto"
                >
                  {savingNotes ? 'Saving...' : <><Save className="w-3 h-3" /> Save Notes</>}
                </button>
              </div>

              {/* Management */}
              <div className="flex gap-2 pt-2 mt-2 border-t border-slate-100">
                <button 
                  onClick={handleEdit}
                  className="flex-1 btn-secondary bg-slate-50 text-slate-700 border-slate-200"
                >
                  Edit Workout
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 btn-secondary bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
