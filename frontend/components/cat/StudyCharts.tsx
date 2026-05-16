'use client';

import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { SubjectTrendPoint, MockScorePoint, StudyDistribution, WeeklyConsistencyPoint } from '@/lib/types/cat';
import { SUBJECT_COLORS } from '@/lib/constants/cat';

const tooltipStyle = {
  contentStyle: { backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)' },
  labelStyle: { fontWeight: 600, color: '#1E293B', marginBottom: 4 },
};

function ChartCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`card-base p-5 ${className}`}>
      <h3 className="section-title mb-5">{title}</h3>
      {children}
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="flex items-center justify-center h-44 text-sm text-slate-400">{msg}</div>;
}

function SubjectTrendChart({ data }: { data: SubjectTrendPoint[] }) {
  const hasData = data.some((d) => d.VARC !== null || d.LRDI !== null || d.QUANT !== null);
  if (!hasData) return <Empty msg="Log study sessions to see accuracy trend." />;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          {(['VARC','LRDI','QUANT'] as const).map((s) => (
            <linearGradient key={s} id={`g${s}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SUBJECT_COLORS[s]} stopOpacity={0.25} />
              <stop offset="95%" stopColor={SUBJECT_COLORS[s]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0,100]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} formatter={(v: any) => v !== null ? `${v}%` : '—'} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        {(['VARC','LRDI','QUANT'] as const).map((s) => (
          <Area key={s} type="monotone" dataKey={s} stroke={SUBJECT_COLORS[s]} fill={`url(#g${s})`} strokeWidth={2} dot={false} connectNulls />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MockScoreChart({ data }: { data: MockScorePoint[] }) {
  if (!data.length) return <Empty msg="Add mock tests to see score progression." />;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        {[{k:'varc',n:'VARC',c:SUBJECT_COLORS.VARC},{k:'lrdi',n:'LRDI',c:SUBJECT_COLORS.LRDI},{k:'quant',n:'QUANT',c:SUBJECT_COLORS.QUANT},{k:'total',n:'Total',c:'#1E293B'}].map(({k,n,c}) => (
          <Line key={k} type="monotone" dataKey={k} name={n} stroke={c} strokeWidth={2} dot={{ r:3 }} activeDot={{ r:5 }} connectNulls />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function WeeklyChart({ data }: { data: WeeklyConsistencyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0,7]} ticks={[0,2,4,7]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} formatter={(v:any) => [`${v} days`,'Study days']} />
        <Bar dataKey="days" name="Study days" radius={[6,6,0,0]}>
          {data.map((e,i) => <Cell key={i} fill={e.days>=5?'#10B981':e.days>=3?'#3B82F6':'#E2E8F0'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function DistributionChart({ data }: { data: StudyDistribution[] }) {
  const total = data.reduce((s,d) => s+d.hours, 0);
  if (total === 0) return <Empty msg="Log study time to see distribution." />;
  const RL = Math.PI/180;
  const label = ({cx,cy,midAngle,innerRadius,outerRadius,percent}:any) => {
    if (percent<0.05) return null;
    const r = innerRadius+(outerRadius-innerRadius)*0.5;
    return <text x={cx+r*Math.cos(-midAngle*RL)} y={cy+r*Math.sin(-midAngle*RL)} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>{`${(percent*100).toFixed(0)}%`}</text>;
  };
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie data={data} dataKey="hours" nameKey="subject" cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} labelLine={false} label={label}>
            {data.map((e,i) => <Cell key={i} fill={e.color} />)}
          </Pie>
          <Tooltip {...tooltipStyle} formatter={(v:any) => [`${v}h`,'Study time']} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.subject} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-slate-600 font-medium">{d.subject}</span>
            <span className="text-slate-400">{d.hours}h</span>
          </div>
        ))}
        <p className="text-xs text-slate-400 mt-1">Total: {total}h this month</p>
      </div>
    </div>
  );
}

function ProjectionChart({ mocks }: { mocks: MockScorePoint[] }) {
  const withTotal = mocks.filter((m) => m.total !== null);
  if (withTotal.length < 2) return <Empty msg="Add 2+ mock tests to see projections." />;
  const n = withTotal.length;
  const sumX = withTotal.reduce((s,_,i) => s+i, 0);
  const sumY = withTotal.reduce((s,m) => s+(m.total??0), 0);
  const sumXY = withTotal.reduce((s,m,i) => s+i*(m.total??0), 0);
  const sumX2 = withTotal.reduce((s,_,i) => s+i*i, 0);
  const slope = (n*sumXY-sumX*sumY)/(n*sumX2-sumX*sumX||1);
  const intercept = (sumY-slope*sumX)/n;
  const projected = [
    ...mocks.slice(-4).map((m) => ({ label: m.label, score: m.total, proj: null })),
    ...([1,2,3].map((i) => ({ label:`+${i}`, score: null, proj: Math.min(300,Math.round(intercept+slope*(n+i-1))) }))),
  ];
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={projected} margin={{ top:4,right:8,left:-20,bottom:0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="label" tick={{ fontSize:10,fill:'#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0,300]} tick={{ fontSize:10,fill:'#94A3B8' }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11 }} />
        <Line type="monotone" dataKey="score" name="Actual" stroke="#1E293B" strokeWidth={2} dot={{ r:3 }} connectNulls />
        <Line type="monotone" dataKey="proj" name="Projected" stroke="#3B82F6" strokeWidth={2} strokeDasharray="6 3" dot={{ r:3 }} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function StudyCharts({ trend, mocks, dist, weekly }: { trend: SubjectTrendPoint[]; mocks: MockScorePoint[]; dist: StudyDistribution[]; weekly: WeeklyConsistencyPoint[] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Subject Accuracy Trend"><SubjectTrendChart data={trend} /></ChartCard>
        <ChartCard title="Mock Score Progression"><MockScoreChart data={mocks} /></ChartCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Weekly Consistency" className="lg:col-span-2"><WeeklyChart data={weekly} /></ChartCard>
        <ChartCard title="Study Distribution (This Month)"><DistributionChart data={dist} /></ChartCard>
      </div>
      <ChartCard title="Score Projection"><ProjectionChart mocks={mocks} /></ChartCard>
    </div>
  );
}
