'use client';

import { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { SubjectTrendPoint, MockScorePoint, StudyDistribution, WeeklyConsistencyPoint } from '@/lib/types/cat';
import { SUBJECT_COLORS } from '@/lib/constants/cat';
import type { TimeFrame } from '@/lib/api/progress';
import { getSubjectTrend, getMockScoreTrend, getWeeklyConsistency, getStudyDistribution } from '@/lib/api/cat';
import { createClient } from '@/lib/supabase/client';
import { subMonths, addMonths, format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const tooltipStyle = {
  contentStyle: { backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)' },
  labelStyle: { fontWeight: 600, color: '#1E293B', marginBottom: 4 },
};

const TIMEFRAMES: { label: string; value: TimeFrame }[] = [
  { label: '30D', value: '30d' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: 'All', value: 'all' },
];

function ChartCard({ title, children, className = '', action }: { title: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <div className={`card-base p-5 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="section-title">{title}</h3>
        {action}
      </div>
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

function DistributionChart({ data, month, onPrevMonth, onNextMonth }: { data: StudyDistribution[]; month: Date; onPrevMonth: () => void; onNextMonth: () => void }) {
  const total = data.reduce((s,d) => s+d.hours, 0);
  const RL = Math.PI/180;
  const label = ({cx,cy,midAngle,innerRadius,outerRadius,percent}:any) => {
    if (percent<0.05) return null;
    const r = innerRadius+(outerRadius-innerRadius)*0.5;
    return <text x={cx+r*Math.cos(-midAngle*RL)} y={cy+r*Math.sin(-midAngle*RL)} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>{`${(percent*100).toFixed(0)}%`}</text>;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b pb-2 border-slate-100">
        <span className="text-xs font-semibold text-slate-700">{format(month, 'MMMM yyyy')}</span>
        <div className="flex items-center gap-1">
          <button onClick={onPrevMonth} className="p-1 rounded hover:bg-slate-100 text-slate-500"><ChevronLeft className="w-3.5 h-3.5" /></button>
          <button onClick={onNextMonth} className="p-1 rounded hover:bg-slate-100 text-slate-500"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      {total === 0 ? (
        <Empty msg="No study time logged in this month." />
      ) : (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={150} height={150}>
            <PieChart>
              <Pie data={data} dataKey="hours" nameKey="subject" cx="50%" cy="50%" innerRadius={40} outerRadius={68} paddingAngle={3} labelLine={false} label={label}>
                {data.map((e,i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip {...tooltipStyle} formatter={(v:any) => [`${v}h`,'Study time']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 min-w-0">
            {data.map((d) => (
              <div key={d.subject} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 font-medium">{d.subject}</span>
                <span className="text-slate-400 ml-auto">{d.hours}h</span>
              </div>
            ))}
            <p className="text-xs text-slate-400 mt-1 pt-1 border-t border-slate-50">Total: {total}h</p>
          </div>
        </div>
      )}
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

export function StudyCharts({
  trend: initialTrend,
  mocks: initialMocks,
  dist: initialDist,
  weekly: initialWeekly,
}: {
  trend: SubjectTrendPoint[];
  mocks: MockScorePoint[];
  dist: StudyDistribution[];
  weekly: WeeklyConsistencyPoint[];
}) {
  const [timeframe, setTimeframe] = useState<TimeFrame>('30d');
  const [trendData, setTrendData] = useState<SubjectTrendPoint[]>(initialTrend);
  const [mockData, setMockData] = useState<MockScorePoint[]>(initialMocks);
  const [weeklyData, setWeeklyData] = useState<WeeklyConsistencyPoint[]>(initialWeekly);
  
  const [distMonth, setDistMonth] = useState<Date>(new Date());
  const [distData, setDistData] = useState<StudyDistribution[]>(initialDist);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTimeframeChange = async (tf: TimeFrame) => {
    setTimeframe(tf);
    setIsLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const [t, m, w] = await Promise.all([
        getSubjectTrend(supabase, user.id, tf),
        getMockScoreTrend(supabase, user.id, tf),
        getWeeklyConsistency(supabase, user.id, tf),
      ]);
      setTrendData(t);
      setMockData(m);
      setWeeklyData(w);
    }
    setIsLoading(false);
  };

  const handleDistMonthChange = async (newMonth: Date) => {
    setDistMonth(newMonth);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const d = await getStudyDistribution(supabase, user.id, newMonth);
      setDistData(d);
    }
  };

  const timeframeAction = (
    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          onClick={() => handleTimeframeChange(tf.value)}
          className={cn(
            'px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all',
            timeframe === tf.value
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className={cn("space-y-4 transition-opacity", isLoading ? "opacity-50" : "opacity-100")}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Subject Accuracy Trend" action={timeframeAction}>
          <SubjectTrendChart data={trendData} />
        </ChartCard>
        <ChartCard title="Mock Score Progression" action={timeframeAction}>
          <MockScoreChart data={mockData} />
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Weekly Consistency" className="lg:col-span-2" action={timeframeAction}>
          <WeeklyChart data={weeklyData} />
        </ChartCard>
        <ChartCard title="Study Distribution">
          <DistributionChart
            data={distData}
            month={distMonth}
            onPrevMonth={() => handleDistMonthChange(subMonths(distMonth, 1))}
            onNextMonth={() => handleDistMonthChange(addMonths(distMonth, 1))}
          />
        </ChartCard>
      </div>
      <ChartCard title="Score Projection">
        <ProjectionChart mocks={mockData} />
      </ChartCard>
    </div>
  );
}

