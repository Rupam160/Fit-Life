'use client';

import { useMemo, useState } from 'react';
import { format, subDays, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { WORKOUT_TYPE_COLORS } from '@/lib/constants/calorieEstimates';
import { WorkoutDetailsModal } from './WorkoutDetailsModal';
import type { WorkoutType } from '@/lib/types/database';

interface CalendarWidgetProps {
  workouts: Array<{ date: string; type: WorkoutType }>;
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarWidget({ workouts }: CalendarWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build a map of date -> workout type
  const workoutMap = useMemo(() => {
    const map = new Map<string, WorkoutType>();
    workouts.forEach((w) => map.set(w.date, w.type));
    return map;
  }, [workouts]);

  // Build last 4 weeks as a 2D array [week][day]
  const weeks = useMemo(() => {
    const today = new Date();
    // Go back to find the most recent Sunday
    const dayOfWeek = today.getDay();
    const sundayOfThisWeek = subDays(today, dayOfWeek);

    return Array.from({ length: 4 }, (_, weekIdx) => {
      const weekStart = subDays(sundayOfThisWeek, (3 - weekIdx) * 7);
      return Array.from({ length: 7 }, (_, dayIdx) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + dayIdx);
        const dateStr = format(date, 'yyyy-MM-dd');
        return {
          date,
          dateStr,
          type: workoutMap.get(dateStr) ?? null,
          isToday: isToday(date),
          isFuture: date > today,
        };
      });
    });
  }, [workoutMap]);

  return (
    <div className="card-base p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="section-title">Activity</h2>
          <p className="section-subtitle">Last 4 weeks</p>
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

      {/* Week rows */}
      <div className="flex flex-col gap-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1.5">
            {week.map(({ date, dateStr, type, isToday: today_, isFuture }) => {
              const color = type ? WORKOUT_TYPE_COLORS[type] : null;
              return (
                <div
                  key={dateStr}
                  onClick={() => !isFuture && setSelectedDate(dateStr)}
                  title={type ? `${format(date, 'MMM d')} — ${type.charAt(0).toUpperCase() + type.slice(1)}` : format(date, 'MMM d')}
                  className={cn(
                    'relative aspect-square rounded-lg flex items-center justify-center transition-all',
                    isFuture ? 'opacity-30 cursor-default' : 'cursor-pointer hover:ring-2 hover:ring-slate-300 hover:ring-offset-1',
                    today_ ? 'ring-2 ring-slate-800 ring-offset-1' : '',
                    !type && !isFuture ? 'bg-slate-100' : '',
                    type ? 'text-white shadow-sm' : 'text-slate-400'
                  )}
                  style={color && !isFuture ? { backgroundColor: color } : undefined}
                >
                  <span className="text-[10px] font-semibold">
                    {format(date, 'd')}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
        {Object.entries(WORKOUT_TYPE_COLORS).filter(([k]) => k !== 'rest').map(([type, color]) => (
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
