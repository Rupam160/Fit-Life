'use client';

import type { DashboardData, SubjectTrendPoint, MockScorePoint, StudyDistribution, WeeklyConsistencyPoint } from '@/lib/types/cat';
import { StudyCharts } from './StudyCharts';
import { Flame, Trophy, Target, Clock, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { SUBJECT_BG, SUBJECT_COLORS } from '@/lib/constants/cat';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface Props {
  dash: DashboardData;
  trend: SubjectTrendPoint[];
  mocks: MockScorePoint[];
  dist: StudyDistribution[];
  weekly: WeeklyConsistencyPoint[];
}

function StatCard({ label, value, sub, icon: Icon, iconColor, iconBg }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; iconColor: string; iconBg: string;
}) {
  return (
    <div className="card-base p-5 flex items-start gap-4">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
        <Icon className={cn('w-5 h-5', iconColor)} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
        <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SubjectProgressBar({ subject, accuracy, questions }: { subject: string; accuracy: number; questions: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-md border w-14 text-center shrink-0', SUBJECT_BG[subject])}>
        {subject}
      </span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${accuracy}%`, backgroundColor: SUBJECT_COLORS[subject] }} />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-10 text-right shrink-0">{accuracy}%</span>
      <span className="text-xs text-slate-400 w-12 text-right shrink-0">{questions}Q</span>
    </div>
  );
}

export function CatDashboardClient({ dash, trend, mocks, dist, weekly }: Props) {
  const { streak, subjectStats, recentLogs, recentMocks, weeklyStudyDays, monthlyStudyHours, todayTargetPct, weakestSubject, strongestSubject } = dash;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">CAT Preparation</h1>
        <p className="text-sm text-slate-500 mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')} &bull; Keep the momentum going.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Study Streak" value={`${streak?.current_streak ?? 0}d`} sub={`Best: ${streak?.max_streak ?? 0} days`} icon={Flame} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard label="Weekly Study Days" value={`${weeklyStudyDays}/7`} sub="Last 7 days" icon={Target} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard label="Monthly Hours" value={`${monthlyStudyHours}h`} sub="This month" icon={Clock} iconColor="text-purple-600" iconBg="bg-purple-50" />
        <StatCard label="Today's Target" value={`${todayTargetPct}%`} sub="4 sessions = 100%" icon={Trophy} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-base p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Subject Accuracy</h2>
            <span className="text-xs text-slate-400">Lifetime average</span>
          </div>
          <div className="space-y-3">
            {subjectStats.map((s) => (
              <SubjectProgressBar key={s.subject} subject={s.subject} accuracy={s.avgAccuracy} questions={s.totalQuestions} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {weakestSubject && (
            <div className="card-base p-4 flex items-start gap-3 border-l-2 border-red-300">
              <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Needs Attention</p>
                <p className="text-lg font-bold text-slate-800">{weakestSubject}</p>
                <p className="text-xs text-slate-400">Lowest avg accuracy</p>
              </div>
            </div>
          )}
          {strongestSubject && (
            <div className="card-base p-4 flex items-start gap-3 border-l-2 border-emerald-300">
              <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Strongest</p>
                <p className="text-lg font-bold text-slate-800">{strongestSubject}</p>
                <p className="text-xs text-slate-400">Best avg accuracy</p>
              </div>
            </div>
          )}
          {recentMocks.length > 0 && (
            <div className="card-base p-4 flex items-start gap-3 border-l-2 border-blue-300">
              <BarChart2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Latest Mock</p>
                <p className="text-lg font-bold text-slate-800">
                  {recentMocks[0].total_score ?? '—'}
                  <span className="text-sm font-normal text-slate-500 ml-1">/ 300</span>
                </p>
                <p className="text-xs text-slate-400">
                  {recentMocks[0].percentile ? `${recentMocks[0].percentile}%ile` : format(parseISO(recentMocks[0].date), 'MMM d')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <StudyCharts trend={trend} mocks={mocks} dist={dist} weekly={weekly} />

      {recentLogs.length > 0 && (
        <div className="card-base p-5">
          <h2 className="section-title mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {recentLogs.slice(0, 8).map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-md border', SUBJECT_BG[log.subject])}>{log.subject}</span>
                  <span className="text-sm text-slate-700">{log.question_count} questions</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  {log.accuracy !== null && <span className="font-medium text-slate-700">{log.accuracy}% acc</span>}
                  <span className="text-xs">{format(parseISO(log.date), 'MMM d')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
