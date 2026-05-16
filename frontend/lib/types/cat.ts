// ============================================================
// CAT Preparation — Type Definitions
// ============================================================

export type CatSubject = 'VARC' | 'LRDI' | 'QUANT';
export type ScheduleSubject = 'VARC' | 'LRDI' | 'QUANT' | 'Mock' | 'Review' | 'Other';
export type ScheduleDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const TIME_SLOTS = [
  '8:00 AM – 10:00 AM',
  '10:00 AM – 11:30 AM',
  '12:30 PM – 1:30 PM',
  '8:00 PM – 10:00 PM',
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

// ── Database Row Types ────────────────────────────────────────

export interface CatLog {
  id: string;
  user_id: string;
  date: string;
  subject: CatSubject;
  question_count: number;
  accuracy: number | null;
  time_spent_min: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockTest {
  id: string;
  user_id: string;
  date: string;
  mock_name: string | null;
  varc_score: number | null;
  lrdi_score: number | null;
  quant_score: number | null;
  total_score: number | null;
  percentile: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudyStreak {
  user_id: string;
  current_streak: number;
  max_streak: number;
  last_study_date: string | null;
  updated_at: string;
}

export interface CatScheduleItem {
  id: string;
  user_id: string;
  day: ScheduleDay;
  time_slot: string;
  task: string;
  subject: ScheduleSubject | null;
  created_at: string;
  updated_at: string;
}

// ── Input Types (for forms) ───────────────────────────────────

export interface CatLogInput {
  date: string;
  subject: CatSubject;
  question_count: number;
  accuracy: number | null;
  time_spent_min: number | null;
  notes: string;
}

export interface MockTestInput {
  date: string;
  mock_name: string;
  varc_score: number | null;
  lrdi_score: number | null;
  quant_score: number | null;
  total_score: number | null;
  percentile: number | null;
  notes: string;
}

export interface ScheduleItemInput {
  day: ScheduleDay;
  time_slot: string;
  task: string;
  subject: ScheduleSubject | null;
}

// ── Dashboard aggregation types ───────────────────────────────

export interface SubjectStats {
  subject: CatSubject;
  totalQuestions: number;
  avgAccuracy: number;
  studyDays: number;
  totalTimeMin: number;
}

export interface DashboardData {
  streak: StudyStreak | null;
  subjectStats: SubjectStats[];
  recentLogs: CatLog[];
  recentMocks: MockTest[];
  weeklyStudyDays: number;
  monthlyStudyHours: number;
  todayTargetPct: number;
  weakestSubject: CatSubject | null;
  strongestSubject: CatSubject | null;
}

// ── Chart data types ──────────────────────────────────────────

export interface SubjectTrendPoint {
  date: string;
  label: string;
  VARC: number | null;
  LRDI: number | null;
  QUANT: number | null;
}

export interface MockScorePoint {
  date: string;
  label: string;
  varc: number | null;
  lrdi: number | null;
  quant: number | null;
  total: number | null;
}

export interface AccuracyPoint {
  date: string;
  label: string;
  accuracy: number | null;
}

export interface WeeklyConsistencyPoint {
  week: string;
  days: number;
}

export interface StudyDistribution {
  subject: string;
  hours: number;
  color: string;
}
