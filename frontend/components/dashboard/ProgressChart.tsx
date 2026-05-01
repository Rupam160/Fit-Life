'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { VolumeProgressPoint } from '@/lib/api/progress';

interface ProgressChartProps {
  data: VolumeProgressPoint[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  // If user has no volume data yet, show a placeholder
  const hasData = data.some(d => d.push !== null || d.pull !== null || d.legs !== null);

  return (
    <div className="card-base p-5">
      <div className="flex flex-col mb-6">
        <h2 className="section-title">Volume Progress</h2>
        <p className="section-subtitle">Total weight lifted per workout (kg)</p>
      </div>

      <div className="h-[240px] w-full">
        {!hasData ? (
          <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
            <p className="text-sm text-slate-400 font-medium">Log weights to see your progress!</p>
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
                    return new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
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
