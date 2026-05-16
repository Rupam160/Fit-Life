// ============================================================
// CAT Preparation — Subject color/label constants
// ============================================================

export const SUBJECT_COLORS: Record<string, string> = {
  VARC: '#3B82F6',
  LRDI: '#8B5CF6',
  QUANT: '#10B981',
  Mock: '#F59E0B',
  Review: '#6B7280',
  Other: '#94A3B8',
};

export const SUBJECT_BG: Record<string, string> = {
  VARC: 'bg-blue-50 text-blue-700 border-blue-100',
  LRDI: 'bg-purple-50 text-purple-700 border-purple-100',
  QUANT: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Mock: 'bg-amber-50 text-amber-700 border-amber-100',
  Review: 'bg-slate-100 text-slate-700 border-slate-200',
  Other: 'bg-slate-50 text-slate-600 border-slate-100',
};

export const SCHEDULE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const SCHEDULE_TIME_SLOTS = [
  '8:00 AM – 10:00 AM',
  '10:00 AM – 11:30 AM',
  '12:30 PM – 1:30 PM',
  '8:00 PM – 10:00 PM',
] as const;
