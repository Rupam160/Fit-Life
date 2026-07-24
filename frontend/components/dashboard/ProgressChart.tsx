'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { VolumeProgressPoint, TimeFrame } from '@/lib/api/progress';
import { getVolumeProgress } from '@/lib/api/progress';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';


interface ProgressChartProps {
  initialData: VolumeProgressPoint[];
}

const TIMEFRAMES: { label: string; value: TimeFrame }[] = [
  { label: '30D', value: '30d' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: 'All', value: 'all' },
];

export function ProgressChart({ initialData }: ProgressChartProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>('30d');
  const [data, setData] = useState<VolumeProgressPoint[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTimeframeChange = async (tf: TimeFrame) => {
    setTimeframe(tf);
    setIsLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const res = await getVolumeProgress(supabase, user.id, tf);
      setData(res);
    }
    setIsLoading(false);
  };

  // If user has no volume data yet, show a placeholder
  const hasData = data.some(d => d.push !== null || d.pull !== null || d.legs !== null);

  return (
    <div className="card-base p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h2 className="section-title">Volume Progress</h2>
          <p className="section-subtitle">Total weight lifted per workout (kg)</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => handleTimeframeChange(tf.value)}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-md transition-all',
                timeframe === tf.value
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("h-[240px] w-full transition-opacity", isLoading ? "opacity-50" : "opacity-100")}>
        {!hasData ? (
          <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-500 font-medium">No workout volume found for this period</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting '3M', '6M', or 'All' to view past data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                itemStyle={{ color: '#fff' }}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    const dateStr = payload[0].payload.date;
                    return new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                  }
                  return label;
                }}
              />
              <Line
                type="monotone"
                dataKey="push"
                name="Push"
                stroke="#ef4444" // red
                strokeWidth={3}
                dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: '#fee2e2', strokeWidth: 4 }}
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="pull"
                name="Pull"
                stroke="#3b82f6" // blue
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: '#dbeafe', strokeWidth: 4 }}
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="legs"
                name="Legs"
                stroke="#eab308" // yellow
                strokeWidth={3}
                dot={{ r: 4, fill: '#eab308', strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: '#fef9c3', strokeWidth: 4 }}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs font-medium text-slate-600">Push</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs font-medium text-slate-600">Pull</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs font-medium text-slate-600">Legs</span>
        </div>
      </div>
    </div>
  );
}

