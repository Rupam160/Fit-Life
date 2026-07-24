'use client';

import { useState, useEffect } from 'react';
import type { FlowIntensity, MoodType, DbPeriodLog } from '@/lib/types/database';
import { X, Check, Droplets, Smile, Activity, FileText, RotateCcw } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  dateStr: string | null;
  initialLog?: DbPeriodLog | null;
  onClose: () => void;
  onSave: (log: DbPeriodLog) => void;
}

const FLOW_OPTIONS: { value: FlowIntensity; label: string; dayRange: string; color: string }[] = [
  { value: 'heavy', label: 'Heavy Flow', dayRange: 'Days 1–2', color: 'bg-rose-600 border-rose-600 text-white' },
  { value: 'medium', label: 'Medium Flow', dayRange: 'Days 3–4', color: 'bg-rose-500 border-rose-500 text-white' },
  { value: 'light', label: 'Light Flow', dayRange: 'Days 5–6', color: 'bg-rose-400 border-rose-400 text-white' },
  { value: 'spotting', label: 'Spotting (Ending)', dayRange: 'Day 7', color: 'bg-pink-400 border-pink-400 text-white' },
];

const MOOD_OPTIONS: { value: MoodType; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'crampy', emoji: '😖', label: 'Crampy' },
  { value: 'irritable', emoji: '😡', label: 'Irritable' },
  { value: 'fatigued', emoji: '😴', label: 'Fatigued' },
  { value: 'low', emoji: '😔', label: 'Low' },
  { value: 'energetic', emoji: '💅', label: 'Energetic' },
];

const SYMPTOM_LIST = ['Cramps', 'Bloating', 'Headache', 'Backache', 'Acne', 'Cravings', 'Nausea', 'Fatigue'];

type NavSection = 'period' | 'mood' | 'symptoms';

export function PeriodLogModal({ isOpen, dateStr, initialLog, onClose, onSave }: Props) {
  const [activeSection, setActiveSection] = useState<NavSection>('period');
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

  const handleReset = () => {
    setIsPeriodDay(false);
    setFlowIntensity('light');
    setMood(undefined);
    setSelectedSymptoms([]);
    setNotes('');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl shadow-slate-900/20 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* TradingView-Style Header */}
        <div className="h-14 px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Period & Mood Tracker</h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {format(parseISO(dateStr), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Sidebar + Content (TradingView Layout) */}
        <div className="flex-1 flex flex-col sm:flex-row min-h-0 overflow-hidden">
          {/* Left Sidebar Menu */}
          <div className="w-full sm:w-48 bg-slate-50/70 border-b sm:border-b-0 sm:border-r border-slate-100 p-2 sm:p-3 shrink-0 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-y-auto">
            <button
              onClick={() => setActiveSection('period')}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
                activeSection === 'period'
                  ? 'bg-white text-slate-900 border border-slate-200/80 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
              )}
            >
              <Droplets className="w-3.5 h-3.5 text-rose-500" />
              Period & Flow
            </button>
            <button
              onClick={() => setActiveSection('mood')}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
                activeSection === 'mood'
                  ? 'bg-white text-slate-900 border border-slate-200/80 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
              )}
            >
              <Smile className="w-3.5 h-3.5 text-amber-500" />
              Daily Mood
            </button>
            <button
              onClick={() => setActiveSection('symptoms')}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
                activeSection === 'symptoms'
                  ? 'bg-white text-slate-900 border border-slate-200/80 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
              )}
            >
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              Symptoms & Notes
            </button>
          </div>

          {/* Section Main Content */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
            {/* SECTION 1: Period Active & Flow */}
            {activeSection === 'period' && (
              <div className="space-y-6 animate-fade-in">
                {/* Period Active Switcher */}
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block">Period Active on Date</label>
                    <span className="text-[11px] text-slate-400">Mark if period cycle is active today</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPeriodDay(!isPeriodDay)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-all relative flex items-center px-0.5',
                      isPeriodDay ? 'bg-rose-600' : 'bg-slate-300'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full bg-white shadow-sm transition-all transform',
                        isPeriodDay ? 'translate-x-6' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>

                {isPeriodDay && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Flow Intensity & Color Gradient Fading (Days 1–7)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {FLOW_OPTIONS.map((f, idx) => {
                        const isSelected = flowIntensity === f.value;
                        return (
                          <div
                            key={f.value}
                            onClick={() => {
                              setFlowIntensity(f.value);
                              setFlowDay(idx === 0 ? 1 : idx === 1 ? 3 : idx === 2 ? 5 : 7);
                            }}
                            className={cn(
                              'p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between',
                              isSelected
                                ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                                : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-800'
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={cn('w-3 h-3 rounded-full shrink-0', f.color.split(' ')[0])} />
                              <div>
                                <p className="text-xs font-bold">{f.label}</p>
                                <p className={cn('text-[10px]', isSelected ? 'text-slate-300' : 'text-slate-400')}>{f.dayRange}</p>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 2: Daily Mood */}
            {activeSection === 'mood' && (
              <div className="space-y-4 animate-fade-in">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Daily Mood Emoji
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {MOOD_OPTIONS.map((m) => {
                    const isSelected = mood === m.value;
                    return (
                      <div
                        key={m.value}
                        onClick={() => setMood(m.value)}
                        className={cn(
                          'p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3',
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white shadow-sm font-bold'
                            : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-700'
                        )}
                      >
                        <span className="text-xl">{m.emoji}</span>
                        <span className="text-xs font-semibold">{m.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 3: Symptoms & Notes */}
            {activeSection === 'symptoms' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">
                    Symptom Badges
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SYMPTOM_LIST.map((tag) => {
                      const selected = selectedSymptoms.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleSymptom(tag)}
                          className={cn(
                            'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border',
                            selected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200/80 hover:border-slate-300'
                          )}
                        >
                          {selected ? '✓ ' : '+ '}{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    Daily Notes
                  </label>
                  <textarea
                    placeholder="Enter any additional cycle notes or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all h-24 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TradingView-Style Footer Action Bar */}
        <div className="h-16 px-6 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-sm hover:bg-slate-800 active:scale-95 transition-all"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
