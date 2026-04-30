'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { ConsistencyPoint } from '@/lib/types/app';

interface ConsistencyTrendProps {
  data: ConsistencyPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-md text-xs">
      <p className="font-medium text-slate-700">{payload[0]?.payload?.date}</p>
      <p className="text-slate-500 mt-0.5">
        {payload[0]?.value === 1 ? (
          <span className="text-green-600 font-medium">Workout logged</span>
        ) : (
          <span className="text-slate-400">Rest day</span>
        )}
      </p>
    </div>
  );
}

export function ConsistencyTrend({ data }: ConsistencyTrendProps) {
  const daysWorkedOut = data.filter((d) => d.value === 1).length;
  const pct = data.length > 0 ? Math.round((daysWorkedOut / data.length) * 100) : 0;

  return (
    <div className="card-base p-5">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="section-title">Consistency</h2>
          <p className="section-subtitle">Last 30 days</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800 tabular-nums">{pct}%</p>
          <p className="text-xs text-slate-400">{daysWorkedOut} / {data.length} days</p>
        </div>
      </div>

      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="consistencyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 1]} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#consistencyGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
