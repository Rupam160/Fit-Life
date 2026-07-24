'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  format,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameMonth,
  addDays,
  parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WORKOUT_TYPE_COLORS } from '@/lib/constants/calorieEstimates';
import { WorkoutDetailsModal } from './WorkoutDetailsModal';
import { PeriodLogModal } from './PeriodLogModal';
import type { WorkoutType, DbPeriodLog, GenderType, MoodType } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/client';
import { getWorkoutDates } from '@/lib/api/workouts';
import { getPeriodLogs, savePeriodLog } from '@/lib/api/period';

interface CalendarWidgetProps {
  workouts: Array<{ date: string; type: WorkoutType }>;
  gender?: GenderType | null;
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: '😊',
  crampy: '😖',
  irritable: '😡',
  fatigued: '😴',
  low: '😔',
  energetic: '💅',
};

// Flow intensity color gradient fading from deep crimson (heavy) to light blush (ending)
const FLOW_COLORS: Record<string, string> = {
  heavy: '#e11d48',   // Deep crimson (Days 1-2)
  medium: '#f43f5e',  // Vibrant rose (Days 3-4)
  light: '#fb7185',   // Rose pink (Days 5-6)
  spotting: '#f472b6',// Light blush pink (Day 7 - Period ending)
};

export function CalendarWidget({ workouts: initialWorkouts, gender: initialGender }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedWorkoutDate, setSelectedWorkoutDate] = useState<string | null>(null);
  const [selectedPeriodDate, setSelectedPeriodDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'workout' | 'period'>('workout');
  
  const [gender, setGender] = useState<GenderType | null>(initialGender ?? null);
  const [monthWorkouts, setMonthWorkouts] = useState<Array<{ date: string; type: WorkoutType }>>(initialWorkouts);
  const [periodLogs, setPeriodLogs] = useState<Record<string, DbPeriodLog>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load user data, workouts, and period logs
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }
      setUserId(user.id);

      const userGender = (user.user_metadata?.gender as GenderType) || initialGender || null;
      setGender(userGender);

      const monthStart = format(startOfWeek(startOfMonth(currentMonth)), 'yyyy-MM-dd');
      const monthEnd = format(endOfWeek(endOfMonth(currentMonth)), 'yyyy-MM-dd');

      const workoutsData = await getWorkoutDates(supabase, user.id, monthStart, monthEnd);
      setMonthWorkouts(workoutsData);

      if (userGender === 'female') {
        const logs = await getPeriodLogs(supabase, user.id);
        setPeriodLogs(logs);
      }

      setIsLoading(false);
    }

    loadData();
  }, [currentMonth, initialGender]);

  // Workout map
  const workoutMap = useMemo(() => {
    const map = new Map<string, WorkoutType>();
    monthWorkouts.forEach((w) => map.set(w.date, w.type));
    return map;
  }, [monthWorkouts]);

  // Predicted period start dates based on 28-day cycle from last logged period day
  const predictedDates = useMemo(() => {
    if (gender !== 'female') return new Set<string>();
    const sortedDates = Object.keys(periodLogs)
      .filter((d) => periodLogs[d]?.is_period_day)
      .sort();

    if (sortedDates.length === 0) return new Set<string>();

    const lastLogDate = parseISO(sortedDates[sortedDates.length - 1]);
    const predictions = new Set<string>();
    
    // Predict next 3 cycles (every 28 days)
    for (let i = 1; i <= 3; i++) {
      const nextStart = addDays(lastLogDate, i * 28);
      predictions.add(format(nextStart, 'yyyy-MM-dd'));
    }
    return predictions;
  }, [periodLogs, gender]);

  // Days Grid
  const daysGrid = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const pLog = periodLogs[dateStr];
      return {
        date,
        dateStr,
        workoutType: workoutMap.get(dateStr) ?? null,
        periodLog: pLog ?? null,
        isPredictedPeriod: predictedDates.has(dateStr),
        isToday: isToday(date),
        isCurrentMonth: isSameMonth(date, currentMonth),
        isFuture: date > today,
      };
    });
  }, [currentMonth, workoutMap, periodLogs, predictedDates]);

  const handlePrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

  const handlePeriodLogSave = async (log: DbPeriodLog) => {
    if (!userId) return;
    const supabase = createClient();
    await savePeriodLog(supabase, userId, log);
    setPeriodLogs((prev) => ({
      ...prev,
      [log.date]: log,
    }));
  };

  const isFemale = gender === 'female';

  return (
    <div className="card-base p-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="section-title">Activity & Tracking</h2>
            {isFemale && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center gap-1">
                🌸 Period & Mood Active
              </span>
            )}
          </div>
          <p className="section-subtitle">
            {isFemale ? 'Track workouts, period flow fading, and daily mood' : 'Workout calendar'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Female Mode Toggle */}
          {isFemale && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('workout')}
                className={cn(
                  'px-3 py-1 text-xs font-bold rounded-lg transition-all',
                  activeTab === 'workout'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                Workouts
              </button>
              <button
                onClick={() => setActiveTab('period')}
                className={cn(
                  'px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1',
                  activeTab === 'period'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                    : 'text-rose-600 hover:text-rose-700'
                )}
              >
                Period & Mood 🩸
              </button>
            </div>
          )}

          {/* Month controls */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 min-w-24 text-center">
              {format(currentMonth, 'MMM yyyy')}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-slate-400">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className={cn("grid grid-cols-7 gap-1.5 transition-opacity", isLoading ? "opacity-50" : "opacity-100")}>
        {daysGrid.map(({ date, dateStr, workoutType, periodLog, isPredictedPeriod, isToday: today_, isCurrentMonth, isFuture }) => {
          const workoutColor = workoutType ? WORKOUT_TYPE_COLORS[workoutType] : null;
          const isPeriodDay = periodLog?.is_period_day;
          const flowColor = isPeriodDay && periodLog?.flow_intensity ? FLOW_COLORS[periodLog.flow_intensity] : '#f43f5e';
          const moodEmoji = periodLog?.mood ? MOOD_EMOJIS[periodLog.mood] : null;

          return (
            <div
              key={dateStr}
              onClick={() => {
                if (activeTab === 'period' || (isFemale && isPeriodDay)) {
                  setSelectedPeriodDate(dateStr);
                } else if (!isFuture) {
                  setSelectedWorkoutDate(dateStr);
                }
              }}
              title={
                isPeriodDay
                  ? `Period Log (Day ${periodLog?.flow_day || 1}) - Click to edit`
                  : workoutType
                  ? `${format(date, 'MMM d')} — ${workoutType}`
                  : format(date, 'MMM d')
              }
              className={cn(
                'relative aspect-square rounded-xl flex flex-col items-center justify-between p-1 transition-all select-none',
                !isCurrentMonth ? 'opacity-30' : '',
                isFuture
                  ? 'cursor-default opacity-20'
                  : 'cursor-pointer hover:ring-2 hover:ring-slate-300 hover:ring-offset-1',
                today_ ? 'ring-2 ring-slate-800 ring-offset-1 font-bold' : '',
                isPredictedPeriod ? 'ring-2 ring-dashed ring-pink-400 bg-pink-50/40' : '',
                !workoutType && !isPeriodDay && !isFuture ? 'bg-slate-100/70 text-slate-600' : ''
              )}
              style={
                isPeriodDay
                  ? { backgroundColor: flowColor, color: '#fff' }
                  : workoutColor && !isFuture
                  ? { backgroundColor: workoutColor, color: '#fff' }
                  : undefined
              }
            >
              {/* Date Number & Icons */}
              <div className="w-full flex items-center justify-between text-[11px] font-semibold leading-none">
                <span>{format(date, 'd')}</span>
                {moodEmoji && (
                  <span className="text-[12px] leading-none">{moodEmoji}</span>
                )}
              </div>

              {/* Center Period Emoji / Indicators */}
              <div className="flex items-center justify-center my-auto">
                {isPeriodDay ? (
                  <span className="text-sm animate-pulse">🩸</span>
                ) : isPredictedPeriod ? (
                  <span className="text-[10px] text-pink-500 font-bold">Predicted</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap gap-3">
          {Object.entries(WORKOUT_TYPE_COLORS)
            .filter(([k]) => k !== 'rest')
            .map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-500 capitalize">{type}</span>
              </div>
            ))}
        </div>

        {/* Female Period Flow Legend */}
        {isFemale && (
          <div className="flex items-center gap-3 bg-rose-50/60 px-3 py-1.5 rounded-xl border border-rose-100 text-xs">
            <span className="font-bold text-rose-800 flex items-center gap-1">
              🩸 Flow Fade:
            </span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" title="Heavy (Day 1-2)" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" title="Medium (Day 3-4)" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#fb7185]" title="Light (Day 5-6)" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f472b6]" title="Ending (Day 7)" />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <WorkoutDetailsModal
        dateStr={selectedWorkoutDate}
        isOpen={!!selectedWorkoutDate}
        onClose={() => setSelectedWorkoutDate(null)}
      />

      <PeriodLogModal
        dateStr={selectedPeriodDate}
        isOpen={!!selectedPeriodDate}
        initialLog={selectedPeriodDate ? periodLogs[selectedPeriodDate] : null}
        onClose={() => setSelectedPeriodDate(null)}
        onSave={handlePeriodLogSave}
      />
    </div>
  );
}
