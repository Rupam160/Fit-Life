// ============================================================
// CAT Preparation — API Hooks (Supabase)
// ============================================================

import { SupabaseClient } from '@supabase/supabase-js';
import { format, subDays, subMonths, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import type {
  CatLog,
  CatLogInput,
  MockTest,
  MockTestInput,
  StudyStreak,
  CatScheduleItem,
  ScheduleItemInput,
  SubjectStats,
  DashboardData,
  SubjectTrendPoint,
  MockScorePoint,
  AccuracyPoint,
  WeeklyConsistencyPoint,
  StudyDistribution,
  CatSubject,
} from '../types/cat';

// ─── Default schedule seed ────────────────────────────────────
export const DEFAULT_SCHEDULE: Omit<ScheduleItemInput, never>[] = [
  { day: 'Mon', time_slot: '8:00 AM – 10:00 AM',   task: 'VARC Study + DPP',        subject: 'VARC' },
  { day: 'Mon', time_slot: '10:00 AM – 11:30 AM',  task: 'LRDI timed sets',          subject: 'LRDI' },
  { day: 'Mon', time_slot: '12:30 PM – 1:30 PM',   task: 'QUANT DPP',               subject: 'QUANT' },
  { day: 'Mon', time_slot: '8:00 PM – 10:00 PM',   task: 'PW Live class',            subject: 'Other' },
  { day: 'Tue', time_slot: '8:00 AM – 10:00 AM',   task: 'LRDI Study + DPP',        subject: 'LRDI' },
  { day: 'Tue', time_slot: '10:00 AM – 11:30 AM',  task: 'QUANT drills',             subject: 'QUANT' },
  { day: 'Tue', time_slot: '12:30 PM – 1:30 PM',   task: 'VARC vocabulary/PJ',       subject: 'VARC' },
  { day: 'Tue', time_slot: '8:00 PM – 10:00 PM',   task: 'PW Live class',            subject: 'Other' },
  { day: 'Wed', time_slot: '8:00 AM – 10:00 AM',   task: 'QUANT Study + DPP',       subject: 'QUANT' },
  { day: 'Wed', time_slot: '10:00 AM – 11:30 AM',  task: 'VARC RC practice',         subject: 'VARC' },
  { day: 'Wed', time_slot: '12:30 PM – 1:30 PM',   task: 'LRDI DPP',                subject: 'LRDI' },
  { day: 'Wed', time_slot: '8:00 PM – 10:00 PM',   task: 'PW Live class',            subject: 'Other' },
  { day: 'Thu', time_slot: '8:00 AM – 10:00 AM',   task: 'VARC Study + DPP',        subject: 'VARC' },
  { day: 'Thu', time_slot: '10:00 AM – 11:30 AM',  task: 'LRDI timed sets',          subject: 'LRDI' },
  { day: 'Thu', time_slot: '12:30 PM – 1:30 PM',   task: 'QUANT revision',           subject: 'QUANT' },
  { day: 'Thu', time_slot: '8:00 PM – 10:00 PM',   task: 'PW Live class',            subject: 'Other' },
  { day: 'Fri', time_slot: '8:00 AM – 10:00 AM',   task: 'LRDI Study + DPP',        subject: 'LRDI' },
  { day: 'Fri', time_slot: '10:00 AM – 11:30 AM',  task: 'QUANT drills',             subject: 'QUANT' },
  { day: 'Fri', time_slot: '12:30 PM – 1:30 PM',   task: 'VARC DPP',                subject: 'VARC' },
  { day: 'Fri', time_slot: '8:00 PM – 10:00 PM',   task: 'PW Live class',            subject: 'Other' },
  { day: 'Sat', time_slot: '8:00 AM – 10:00 AM',   task: 'Catch-up pending DPP',    subject: 'Other' },
  { day: 'Sat', time_slot: '10:00 AM – 11:30 AM',  task: 'LRDI intensive sets',      subject: 'LRDI' },
  { day: 'Sat', time_slot: '12:30 PM – 1:30 PM',   task: 'QUANT weak chapters',      subject: 'QUANT' },
  { day: 'Sat', time_slot: '8:00 PM – 10:00 PM',   task: 'PW Live class',            subject: 'Other' },
  { day: 'Sun', time_slot: '8:00 AM – 10:00 AM',   task: 'Mock / Sectional test',    subject: 'Mock' },
  { day: 'Sun', time_slot: '10:00 AM – 11:30 AM',  task: 'Mock analysis',            subject: 'Mock' },
  { day: 'Sun', time_slot: '12:30 PM – 1:30 PM',   task: 'Weekly review + planning', subject: 'Review' },
  { day: 'Sun', time_slot: '8:00 PM – 10:00 PM',   task: 'Rest/light reading',       subject: 'Other' },
];

// ─── Study Streak ─────────────────────────────────────────────

export async function getStudyStreak(
  supabase: SupabaseClient,
  userId: string
): Promise<StudyStreak | null> {
  const { data, error } = await supabase
    .from('study_streak')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // Create streak row if not exists
    if (error.code === 'PGRST116') {
      await supabase
        .from('study_streak')
        .insert({ user_id: userId, current_streak: 0, max_streak: 0 });
      return { user_id: userId, current_streak: 0, max_streak: 0, last_study_date: null, updated_at: new Date().toISOString() };
    }
    return null;
  }
  return data;
}

export async function updateStudyStreak(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const today = format(new Date(), 'yyyy-MM-dd');
  const streak = await getStudyStreak(supabase, userId);

  if (!streak) return;

  if (streak.last_study_date === today) return; // Already updated today

  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const newStreak = streak.last_study_date === yesterday
    ? streak.current_streak + 1
    : 1;
  const newMax = Math.max(newStreak, streak.max_streak);

  await supabase
    .from('study_streak')
    .upsert({
      user_id: userId,
      current_streak: newStreak,
      max_streak: newMax,
      last_study_date: today,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
}

// ─── Cat Logs ─────────────────────────────────────────────────

export async function getCatLogs(
  supabase: SupabaseClient,
  userId: string,
  limit = 50
): Promise<CatLog[]> {
  const { data, error } = await supabase
    .from('cat_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getCatLogsForDate(
  supabase: SupabaseClient,
  userId: string,
  date: string
): Promise<CatLog[]> {
  const { data, error } = await supabase
    .from('cat_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('subject');

  if (error) throw error;
  return data ?? [];
}

export async function insertCatLog(
  supabase: SupabaseClient,
  userId: string,
  log: CatLogInput
): Promise<CatLog> {
  const { data, error } = await supabase
    .from('cat_logs')
    .insert({ ...log, user_id: userId })
    .select()
    .single();

  if (error) throw error;

  // Update streak after logging
  await updateStudyStreak(supabase, userId);

  return data;
}

export async function updateCatLog(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<CatLogInput>
): Promise<CatLog> {
  const { data, error } = await supabase
    .from('cat_logs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCatLog(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('cat_logs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ─── Mock Tests ───────────────────────────────────────────────

export async function getMockTests(
  supabase: SupabaseClient,
  userId: string,
  limit = 20
): Promise<MockTest[]> {
  const { data, error } = await supabase
    .from('mock_tests')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function insertMockTest(
  supabase: SupabaseClient,
  userId: string,
  test: MockTestInput
): Promise<MockTest> {
  const { data, error } = await supabase
    .from('mock_tests')
    .insert({ ...test, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMockTest(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<MockTestInput>
): Promise<MockTest> {
  const { data, error } = await supabase
    .from('mock_tests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMockTest(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('mock_tests')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ─── Schedule ─────────────────────────────────────────────────

export async function getSchedule(
  supabase: SupabaseClient,
  userId: string
): Promise<CatScheduleItem[]> {
  const { data, error } = await supabase
    .from('cat_schedule')
    .select('*')
    .eq('user_id', userId)
    .order('day')
    .order('time_slot');

  if (error) throw error;

  // If no schedule, seed defaults
  if (!data || data.length === 0) {
    const inserts = DEFAULT_SCHEDULE.map((item) => ({ ...item, user_id: userId }));
    const { data: seeded, error: seedErr } = await supabase
      .from('cat_schedule')
      .insert(inserts)
      .select();

    if (seedErr) throw seedErr;
    return seeded ?? [];
  }

  return data;
}

export async function insertScheduleItem(
  supabase: SupabaseClient,
  userId: string,
  item: ScheduleItemInput
): Promise<CatScheduleItem> {
  const { data, error } = await supabase
    .from('cat_schedule')
    .insert({ ...item, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateScheduleItem(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<ScheduleItemInput>
): Promise<CatScheduleItem> {
  const { data, error } = await supabase
    .from('cat_schedule')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteScheduleItem(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('cat_schedule')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ─── Dashboard Aggregations ───────────────────────────────────

export async function getDashboardData(
  supabase: SupabaseClient,
  userId: string
): Promise<DashboardData> {
  const today = format(new Date(), 'yyyy-MM-dd');
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');
  const weekStart = format(subDays(new Date(), 6), 'yyyy-MM-dd');

  const [streakData, allLogs, allMocks, monthLogs, weekLogs, todayLogs] = await Promise.all([
    getStudyStreak(supabase, userId),
    getCatLogs(supabase, userId, 100),
    getMockTests(supabase, userId, 10),
    supabase
      .from('cat_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('date', monthStart)
      .lte('date', monthEnd),
    supabase
      .from('cat_logs')
      .select('date, subject')
      .eq('user_id', userId)
      .gte('date', weekStart)
      .lte('date', today),
    supabase
      .from('cat_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today),
  ]);

  const monthLogsData: CatLog[] = monthLogs.data ?? [];
  const weekLogsData = weekLogs.data ?? [];
  const todayLogsData: CatLog[] = todayLogs.data ?? [];

  // Monthly study hours
  const monthlyStudyHours = Math.round(
    monthLogsData.reduce((sum, l) => sum + (l.time_spent_min ?? 0), 0) / 60 * 10
  ) / 10;

  // Weekly study days (unique dates)
  const weekDays = new Set(weekLogsData.map((l: any) => l.date));
  const weeklyStudyDays = weekDays.size;

  // Today's target: 4 sessions = 100%
  const todayTargetPct = Math.min(100, Math.round((todayLogsData.length / 4) * 100));

  // Subject stats
  const subjects: CatSubject[] = ['VARC', 'LRDI', 'QUANT'];
  const subjectStats = subjects.map((subject) => {
    const logs = allLogs.filter((l) => l.subject === subject);
    const totalQ = logs.reduce((s, l) => s + l.question_count, 0);
    const accuracies = logs.filter((l) => l.accuracy !== null).map((l) => l.accuracy as number);
    const avgAcc = accuracies.length ? Math.round(accuracies.reduce((s, a) => s + a, 0) / accuracies.length) : 0;
    const studyDays = new Set(logs.map((l) => l.date)).size;
    const totalTimeMin = logs.reduce((s, l) => s + (l.time_spent_min ?? 0), 0);

    return { subject, totalQuestions: totalQ, avgAccuracy: avgAcc, studyDays, totalTimeMin };
  });

  const sorted = [...subjectStats].sort((a, b) => a.avgAccuracy - b.avgAccuracy);
  const weakestSubject = sorted[0]?.totalQuestions > 0 ? sorted[0].subject : null;
  const strongestSubject = sorted[sorted.length - 1]?.totalQuestions > 0 ? sorted[sorted.length - 1].subject : null;

  return {
    streak: streakData,
    subjectStats,
    recentLogs: allLogs.slice(0, 10),
    recentMocks: allMocks.slice(0, 5),
    weeklyStudyDays,
    monthlyStudyHours,
    todayTargetPct,
    weakestSubject,
    strongestSubject,
  };
}

// ─── Chart Data ───────────────────────────────────────────────

export async function getSubjectTrend(
  supabase: SupabaseClient,
  userId: string,
  days = 30
): Promise<SubjectTrendPoint[]> {
  const from = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');
  const to = format(new Date(), 'yyyy-MM-dd');

  const { data } = await supabase
    .from('cat_logs')
    .select('date, subject, accuracy')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to);

  const logs: any[] = data ?? [];

  // Build map: date → { VARC, LRDI, QUANT }
  const map = new Map<string, Record<CatSubject, number[]>>();
  logs.forEach((l) => {
    if (!map.has(l.date)) map.set(l.date, { VARC: [], LRDI: [], QUANT: [] });
    if (l.accuracy !== null) map.get(l.date)![l.subject as CatSubject].push(l.accuracy);
  });

  const result: SubjectTrendPoint[] = [];
  for (let i = 0; i < days; i++) {
    const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
    const entry = map.get(date);
    const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;

    result.push({
      date,
      label: i % 5 === 0 ? format(parseISO(date), 'MMM d') : '',
      VARC: entry ? avg(entry.VARC) : null,
      LRDI: entry ? avg(entry.LRDI) : null,
      QUANT: entry ? avg(entry.QUANT) : null,
    });
  }

  return result;
}

export async function getMockScoreTrend(
  supabase: SupabaseClient,
  userId: string
): Promise<MockScorePoint[]> {
  const { data } = await supabase
    .from('mock_tests')
    .select('date, varc_score, lrdi_score, quant_score, total_score')
    .eq('user_id', userId)
    .order('date', { ascending: true })
    .limit(15);

  const mocks: any[] = data ?? [];

  return mocks.map((m, i) => ({
    date: m.date,
    label: format(parseISO(m.date), 'MMM d'),
    varc: m.varc_score,
    lrdi: m.lrdi_score,
    quant: m.quant_score,
    total: m.total_score,
  }));
}

export async function getAccuracyTrend(
  supabase: SupabaseClient,
  userId: string,
  days = 14
): Promise<AccuracyPoint[]> {
  const from = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');
  const { data } = await supabase
    .from('cat_logs')
    .select('date, accuracy')
    .eq('user_id', userId)
    .gte('date', from)
    .order('date', { ascending: true });

  const logs = data ?? [];

  // Group by date
  const map = new Map<string, number[]>();
  logs.forEach((l: any) => {
    if (l.accuracy !== null) {
      if (!map.has(l.date)) map.set(l.date, []);
      map.get(l.date)!.push(l.accuracy);
    }
  });

  const result: AccuracyPoint[] = [];
  for (let i = 0; i < days; i++) {
    const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
    const accs = map.get(date) ?? [];
    const avg = accs.length ? Math.round(accs.reduce((a, b) => a + b, 0) / accs.length) : null;

    result.push({
      date,
      label: format(parseISO(date), 'EEE d'),
      accuracy: avg,
    });
  }
  return result;
}

export async function getWeeklyConsistency(
  supabase: SupabaseClient,
  userId: string,
  weeks = 8
): Promise<WeeklyConsistencyPoint[]> {
  const from = format(subDays(new Date(), weeks * 7), 'yyyy-MM-dd');

  const { data } = await supabase
    .from('cat_logs')
    .select('date')
    .eq('user_id', userId)
    .gte('date', from);

  const logs = data ?? [];

  // Group by ISO week
  const weekMap = new Map<string, Set<string>>();
  logs.forEach((l: any) => {
    const weekStart = format(
      subDays(parseISO(l.date), (parseISO(l.date).getDay() + 6) % 7),
      'yyyy-MM-dd'
    );
    if (!weekMap.has(weekStart)) weekMap.set(weekStart, new Set());
    weekMap.get(weekStart)!.add(l.date);
  });

  const result: WeeklyConsistencyPoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = format(subDays(new Date(), i * 7 + (new Date().getDay() + 6) % 7), 'yyyy-MM-dd');
    const days = weekMap.get(weekStart)?.size ?? 0;
    result.push({ week: format(parseISO(weekStart), 'MMM d'), days });
  }
  return result;
}

export async function getStudyDistribution(
  supabase: SupabaseClient,
  userId: string
): Promise<StudyDistribution[]> {
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');

  const { data } = await supabase
    .from('cat_logs')
    .select('subject, time_spent_min')
    .eq('user_id', userId)
    .gte('date', monthStart);

  const logs = data ?? [];

  const subjectColors: Record<string, string> = {
    VARC: '#3B82F6',
    LRDI: '#8B5CF6',
    QUANT: '#10B981',
  };

  const map: Record<string, number> = { VARC: 0, LRDI: 0, QUANT: 0 };
  logs.forEach((l: any) => {
    if (l.subject in map) map[l.subject] += l.time_spent_min ?? 0;
  });

  return Object.entries(map).map(([subject, mins]) => ({
    subject,
    hours: Math.round((mins / 60) * 10) / 10,
    color: subjectColors[subject],
  }));
}
