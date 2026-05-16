'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/useAuthStore';
import {
  getDashboardData, getSubjectTrend, getMockScoreTrend,
  getStudyDistribution, getWeeklyConsistency, getAccuracyTrend,
} from '@/lib/api/cat';
import type {
  DashboardData, SubjectTrendPoint, MockScorePoint,
  StudyDistribution, WeeklyConsistencyPoint, AccuracyPoint,
} from '@/lib/types/cat';
import { StudyCharts } from '@/components/cat/StudyCharts';
import { SUBJECT_BG } from '@/lib/constants/cat';
import { cn } from '@/lib/utils';

export default function CatAnalyticsPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isLoading);
  const supabase = createClient();
  const [dash, setDash] = useState<DashboardData | null>(null);
  const [trend, setTrend] = useState<SubjectTrendPoint[]>([]);
  const [mocks, setMocks] = useState<MockScorePoint[]>([]);
  const [dist, setDist] = useState<StudyDistribution[]>([]);
  const [weekly, setWeekly] = useState<WeeklyConsistencyPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) { setLoading(false); return; }
    Promise.all([
      getDashboardData(supabase, user.id),
      getSubjectTrend(supabase, user.id, 30),
      getMockScoreTrend(supabase, user.id),
      getStudyDistribution(supabase, user.id),
      getWeeklyConsistency(supabase, user.id, 8),
    ])
      .then(([d, t, m, di, w]) => {
        setDash(d); setTrend(t); setMocks(m); setDist(di); setWeekly(w);
      })
      .catch((e) => console.error('Analytics load error:', e))
      .finally(() => setLoading(false));
  }, [user, isAuthLoading]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Detailed performance insights across all subjects.</p>
      </div>

      {/* Subject stats table */}
      {dash && (
        <div className="card-base overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="section-title">Subject Summary</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50">
                {['Subject','Questions','Avg Accuracy','Study Days','Total Hours'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dash.subjectStats.map((s) => (
                <tr key={s.subject} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded border', SUBJECT_BG[s.subject])}>{s.subject}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{s.totalQuestions.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.avgAccuracy}%` }} />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{s.avgAccuracy}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.studyDays}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{Math.round(s.totalTimeMin / 60 * 10) / 10}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StudyCharts trend={trend} mocks={mocks} dist={dist} weekly={weekly} />
    </div>
  );
}
