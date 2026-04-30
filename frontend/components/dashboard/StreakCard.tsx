'use client';

import { Flame, Trophy } from 'lucide-react';
import type { DbStreak } from '@/lib/types/database';

interface StreakCardProps {
  streak: DbStreak | null;
}

export function StreakCard({ streak }: StreakCardProps) {
  const current = streak?.current_streak ?? 0;
  const max = streak?.max_streak ?? 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Current Streak */}
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Streak</span>
        </div>
        <div className="flex items-end gap-1.5 mt-1">
          <span className="text-4xl font-bold text-slate-800 tabular-nums">{current}</span>
          <span className="text-sm text-slate-400 mb-1">days</span>
        </div>
        <p className="text-xs text-slate-400">
          {current === 0
            ? 'Log a workout to start'
            : current === 1
            ? 'Great start, keep going!'
            : `${current} days strong`}
        </p>
      </div>

      {/* Max Streak */}
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Best</span>
        </div>
        <div className="flex items-end gap-1.5 mt-1">
          <span className="text-4xl font-bold text-slate-800 tabular-nums">{max}</span>
          <span className="text-sm text-slate-400 mb-1">days</span>
        </div>
        <p className="text-xs text-slate-400">
          {max === 0 ? 'No streak yet' : `Personal record`}
        </p>
      </div>
    </div>
  );
}
