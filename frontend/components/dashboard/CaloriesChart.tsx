'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { WeeklyCaloriesPoint } from '@/lib/types/app';
import { WORKOUT_TYPE_COLORS } from '@/lib/constants/calorieEstimates';

interface CaloriesChartProps {
  data: WeeklyCaloriesPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-slate-700">{label}</p>
      <p className="text-slate-500 mt-0.5">
        {item.value > 0 ? (
          <span><span className="font-semibold text-slate-800">{item.value}</span> kcal</span>
        ) : (
          <span className="text-slate-400">Rest day</span>
        )}
      </p>
    </div>
  );
}

export function CaloriesChart({ data }: CaloriesChartProps) {
  const totalWeekly = data.reduce((sum, d) => sum + d.calories, 0);

  return (
    <div className="card-base p-5">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="section-title">Weekly Calories Burned</h2>
          <p className="section-subtitle">Estimated based on workout type</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800 tabular-nums">{totalWeekly.toLocaleString()}</p>
          <p className="text-xs text-slate-400">kcal this week</p>
        </div>
      </div>

      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.workout_type
                      ? WORKOUT_TYPE_COLORS[entry.workout_type]
                      : '#e2e8f0'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
