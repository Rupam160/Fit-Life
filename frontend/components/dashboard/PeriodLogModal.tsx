'use client';

import { useState, useEffect } from 'react';
import type { FlowIntensity, MoodType, DbPeriodLog } from '@/lib/types/database';
import { X, Save, Trash2, HeartHandshake } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  dateStr: string | null;
  initialLog?: DbPeriodLog | null;
  onClose: () => void;
  onSave: (log: DbPeriodLog) => void;
}

const FLOW_OPTIONS: { value: FlowIntensity; label: string; dayLabel: string; bg: string; text: string }[] = [
  { value: 'heavy', label: 'Heavy Flow', dayLabel: 'Day 1-2', bg: 'bg-rose-600', text: 'text-white' },
  { value: 'medium', label: 'Medium Flow', dayLabel: 'Day 3-4', bg: 'bg-rose-500', text: 'text-white' },
  { value: 'light', label: 'Light Flow', dayLabel: 'Day 5-6', bg: 'bg-rose-400', text: 'text-white' },
  { value: 'spotting', label: 'Spotting / End', dayLabel: 'Day 7', bg: 'bg-pink-300', text: 'text-slate-800' },
];

const MOOD_OPTIONS: { value: MoodType; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'crampy', emoji: '😖', label: 'Crampy' },
  { value: 'irritable', emoji: '😡', label: 'Irritable' },
  { value: 'fatigued', emoji: '😴', label: 'Fatigued' },
  { value: 'low', emoji: '😔', label: 'Low Mood' },
  { value: 'energetic', emoji: '💅', label: 'Energetic' },
];

const SYMPTOM_TAGS = ['Cramps', 'Bloating', 'Headache', 'Backache', 'Acne', 'Cravings', 'Nausea'];

export function PeriodLogModal({ isOpen, dateStr, initialLog, onClose, onSave }: Props) {
  const [isPeriodDay, setIsPeriodDay] = useState<boolean>(true);
  const [flowDay, setFlowDay] = useState<number>(1);
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>('heavy');
  const [mood, setMood] = useState<MoodType | undefined>('happy');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialLog) {
      setIsPeriodDay(initialLog.is_period_day ?? true);
      setFlowDay(initialLog.flow_day ?? 1);
      setFlowIntensity(initialLog.flow_intensity ?? 'heavy');
      setMood(initialLog.mood);
      setSelectedSymptoms(initialLog.symptoms ?? []);
      setNotes(initialLog.notes ?? '');
    } else {
      setIsPeriodDay(true);
      setFlowDay(1);
      setFlowIntensity('heavy');
      setMood('happy');
      setSelectedSymptoms([]);
      setNotes('');
    }
  }, [initialLog, dateStr]);

  if (!isOpen || !dateStr) return null;

  const toggleSymptom = (tag: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    onSave({
      user_id: '',
      date: dateStr,
      is_period_day: isPeriodDay,
      flow_day: isPeriodDay ? flowDay : undefined,
      flow_intensity: isPeriodDay ? flowIntensity : undefined,
      mood,
      symptoms: selectedSymptoms,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🩸</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Period & Mood Log</h3>
              <p className="text-xs text-rose-600 font-medium">
                {format(parseISO(dateStr), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-rose-100/50 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
          {/* Period Day Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-sm font-semibold text-slate-700">Period Active on this Date?</span>
            <button
              onClick={() => setIsPeriodDay(!isPeriodDay)}
              className={cn(
                'px-4 py-1.5 rounded-xl text-xs font-bold transition-all',
                isPeriodDay
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-600'
              )}
            >
              {isPeriodDay ? 'Yes 🩸' : 'No'}
            </button>
          </div>

          {/* Flow Day & Intensity */}
          {isPeriodDay && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Flow Day (1 to 7) & Fading Intensity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {FLOW_OPTIONS.map((f, idx) => (
                    <button
                      key={f.value}
                      onClick={() => {
                        setFlowIntensity(f.value);
                        setFlowDay(idx === 0 ? 1 : idx === 1 ? 3 : idx === 2 ? 5 : 7);
                      }}
                      className={cn(
                        'p-2.5 rounded-xl text-center border-2 transition-all flex flex-col items-center gap-1',
                        flowIntensity === f.value
                          ? `${f.bg} ${f.text} border-transparent shadow-md`
                          : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200'
                      )}
                    >
                      <span className="text-xs font-bold">{f.label.split(' ')[0]}</span>
                      <span className="text-[10px] opacity-80">{f.dayLabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Daily Mood Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              How are you feeling today? (Mood Tracker)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={cn(
                    'p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all',
                    mood === m.value
                      ? 'border-indigo-500 bg-indigo-50/60 text-indigo-950 font-bold shadow-sm'
                      : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200'
                  )}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-semibold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Tags */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Symptoms & Notes
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SYMPTOM_TAGS.map((tag) => {
                const selected = selectedSymptoms.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleSymptom(tag)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                      selected
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {selected ? '✓ ' : '+ '}{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <textarea
              placeholder="Any additional notes or cycle observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:border-rose-500 focus:ring-0 resize-none h-20"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Log
          </button>
        </div>
      </div>
    </div>
  );
}
