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
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WORKOUT_TYPE_COLORS } from '@/lib/constants/calorieEstimates';
import { WorkoutDetailsModal } from './WorkoutDetailsModal';
import type { WorkoutType } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/client';
import { getWorkoutDates } from '@/lib/api/workouts';

interface CalendarWidgetProps {
  workouts: Array<{ date: string; type: WorkoutType }>;
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarWidget({ workouts: initialWorkouts }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [monthWorkouts, setMonthWorkouts] = useState<Array<{ date: string; type: WorkoutType }>>(initialWorkouts);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch workouts whenever currentMonth changes
  useEffect(() => {
    async function fetchMonthWorkouts() {
      setIsLoading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const monthStart = format(startOfWeek(startOfMonth(currentMonth)), 'yyyy-MM-dd');
      const monthEnd = format(endOfWeek(endOfMonth(currentMonth)), 'yyyy-MM-dd');

      const data = await getWorkoutDates(supabase, user.id, monthStart, monthEnd);
      setMonthWorkouts(data);
      setIsLoading(false);
    }

    fetchMonthWorkouts();
  }, [currentMonth]);

  // Build map of date -> workout type
  const workoutMap = useMemo(() => {
    const map = new Map<string, WorkoutType>();
    monthWorkouts.forEach((w) => map.set(w.date, w.type));
    return map;
  }, [monthWorkouts]);

  // Build grid of days for the current visible month view
  const daysGrid = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        date,
        dateStr,
        type: workoutMap.get(dateStr) ?? null,
        isToday: isToday(date),
        isCurrentMonth: isSameMonth(date, currentMonth),
        isFuture: date > today,
      };
    });
  }, [currentMonth, workoutMap]);

  const handlePrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

  return (
    <div className="card-base p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="section-title">Activity</h2>
          <p className="section-subtitle">Workout calendar</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-slate-700 min-w-28 text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
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
        {daysGrid.map(({ date, dateStr, type, isToday: today_, isCurrentMonth, isFuture }) => {
          const color = type ? WORKOUT_TYPE_COLORS[type] : null;
          return (
            <div
              key={dateStr}
              onClick={() => !isFuture && setSelectedDate(dateStr)}
              title={
                type
                  ? `${format(date, 'MMM d, yyyy')} — ${type.charAt(0).toUpperCase() + type.slice(1)}`
                  : format(date, 'MMM d, yyyy')
              }
              className={cn(
                'relative aspect-square rounded-lg flex items-center justify-center transition-all',
                !isCurrentMonth ? 'opacity-30' : '',
                isFuture
                  ? 'cursor-default opacity-20'
                  : 'cursor-pointer hover:ring-2 hover:ring-slate-300 hover:ring-offset-1',
                today_ ? 'ring-2 ring-slate-800 ring-offset-1' : '',
                !type && !isFuture ? 'bg-slate-100' : '',
                type ? 'text-white shadow-sm' : 'text-slate-500'
              )}
              style={color && !isFuture ? { backgroundColor: color } : undefined}
            >
              <span className="text-[11px] font-semibold">{format(date, 'd')}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
        {Object.entries(WORKOUT_TYPE_COLORS)
          .filter(([k]) => k !== 'rest')
          .map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-500 capitalize">{type}</span>
            </div>
          ))}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-slate-100" />
          <span className="text-xs text-slate-500">Rest</span>
        </div>
      </div>

      <WorkoutDetailsModal
        dateStr={selectedDate}
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
}

