'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCatLogsForDate, getCatLogs, insertCatLog, updateCatLog, deleteCatLog } from '@/lib/api/cat';
import type { CatLog, CatLogInput, CatSubject } from '@/lib/types/cat';
import { SUBJECT_BG, SUBJECT_COLORS } from '@/lib/constants/cat';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, X, Check, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, subDays, addDays } from 'date-fns';

const SUBJECTS: CatSubject[] = ['VARC', 'LRDI', 'QUANT'];

interface Props {
  userId: string;
  initialDate: string;
  initialDayLogs: CatLog[];
  initialRecentLogs: CatLog[];
}

interface LogFormProps {
  date: string;
  initial?: CatLog | null;
  onClose: () => void;
  onSave: (data: CatLogInput, id?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

function LogForm({ date, initial, onClose, onSave, onDelete }: LogFormProps) {
  const [subject, setSubject] = useState<CatSubject>(initial?.subject ?? 'VARC');
  const [questionCount, setQuestionCount] = useState(initial?.question_count.toString() ?? '');
  const [accuracy, setAccuracy] = useState(initial?.accuracy?.toString() ?? '');
  const [timeMin, setTimeMin] = useState(initial?.time_spent_min?.toString() ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        date,
        subject,
        question_count: parseInt(questionCount) || 0,
        accuracy: accuracy ? parseFloat(accuracy) : null,
        time_spent_min: timeMin ? parseInt(timeMin) : null,
        notes,
      }, initial?.id);
      onClose();
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!initial || !onDelete) return;
    setDeleting(true);
    try { await onDelete(initial.id); onClose(); }
    finally { setDeleting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-100 animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-sm font-semibold text-slate-800">{initial ? 'Edit Session' : 'Log Study Session'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{format(parseISO(date), 'EEEE, MMM d')}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Subject</label>
            <div className="flex gap-2">
              {SUBJECTS.map((s) => (
                <button key={s} onClick={() => setSubject(s)}
                  className={cn('flex-1 py-2 rounded-xl text-xs font-semibold border transition-all', subject === s ? SUBJECT_BG[s] : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100')}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Questions</label>
              <input type="number" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} placeholder="0" min={0} className="input-base" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Accuracy %</label>
              <input type="number" value={accuracy} onChange={(e) => setAccuracy(e.target.value)} placeholder="0–100" min={0} max={100} className="input-base" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Time (min)</label>
              <input type="number" value={timeMin} onChange={(e) => setTimeMin(e.target.value)} placeholder="60" min={0} className="input-base" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Topics covered..." className="input-base resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
          {initial && onDelete ? (
            <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 disabled:opacity-50">
              <Trash2 className="w-3.5 h-3.5" />{deleting ? 'Deleting...' : 'Delete'}
            </button>
          ) : <div />}
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            <Check className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DailyLogClient({ userId, initialDate, initialDayLogs, initialRecentLogs }: Props) {
  const supabase = createClient();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [dayLogs, setDayLogs] = useState<CatLog[]>(initialDayLogs);
  const [recentLogs, setRecentLogs] = useState<CatLog[]>(initialRecentLogs);
  const [dateLoading, setDateLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CatLog | null>(null);

  async function changeDate(newDate: string) {
    setSelectedDate(newDate);
    setDateLoading(true);
    try {
      const logs = await getCatLogsForDate(supabase, userId, newDate);
      setDayLogs(logs);
    } finally { setDateLoading(false); }
  }

  async function handleSave(data: CatLogInput, id?: string) {
    if (id) {
      const updated = await updateCatLog(supabase, id, data);
      setDayLogs((prev) => prev.map((l) => l.id === id ? updated : l));
      setRecentLogs((prev) => prev.map((l) => l.id === id ? updated : l));
    } else {
      const created = await insertCatLog(supabase, userId, data);
      if (created.date === selectedDate) setDayLogs((prev) => [...prev, created]);
      setRecentLogs((prev) => [created, ...prev.slice(0, 29)]);
    }
  }

  async function handleDelete(id: string) {
    await deleteCatLog(supabase, id);
    setDayLogs((prev) => prev.filter((l) => l.id !== id));
    setRecentLogs((prev) => prev.filter((l) => l.id !== id));
  }

  const totalQ = dayLogs.reduce((s, l) => s + l.question_count, 0);
  const withAcc = dayLogs.filter((l) => l.accuracy !== null);
  const avgAcc = withAcc.length ? Math.round(withAcc.reduce((s, l) => s + (l.accuracy ?? 0), 0) / withAcc.length) : null;
  const totalMin = dayLogs.reduce((s, l) => s + (l.time_spent_min ?? 0), 0);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const count = recentLogs.filter((l) => l.date === date).length;
    return { date, count };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daily Log</h1>
          <p className="text-sm text-slate-500 mt-1">Track your daily study sessions by subject.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Log Session
        </button>
      </div>

      {/* 7-day activity bar */}
      <div className="card-base p-4 flex items-center gap-2">
        <span className="text-xs text-slate-400 mr-1">Last 7 days</span>
        {last7.map(({ date, count }) => (
          <button key={date} onClick={() => changeDate(date)} title={format(parseISO(date), 'MMM d')}
            className={cn('flex-1 h-8 rounded-lg transition-all text-xs font-semibold',
              selectedDate === date ? 'ring-2 ring-slate-400 ring-offset-1' : '',
              count === 0 ? 'bg-slate-100 text-slate-400' : count === 1 ? 'bg-blue-100 text-blue-700' : count === 2 ? 'bg-blue-200 text-blue-800' : 'bg-blue-500 text-white')}>
            {count > 0 ? count : ''}
          </button>
        ))}
      </div>

      {/* Date navigation */}
      <div className="flex items-center gap-3">
        <button onClick={() => changeDate(format(subDays(parseISO(selectedDate), 1), 'yyyy-MM-dd'))} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <input type="date" value={selectedDate} onChange={(e) => changeDate(e.target.value)} className="input-base max-w-[180px]" />
        <button onClick={() => changeDate(format(addDays(parseISO(selectedDate), 1), 'yyyy-MM-dd'))} disabled={selectedDate >= format(new Date(), 'yyyy-MM-dd')} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-30">
          <ChevronRight className="w-4 h-4" />
        </button>
        {dayLogs.length > 0 && (
          <div className="flex items-center gap-4 ml-2 text-sm">
            <span className="text-slate-500">{totalQ} questions</span>
            {avgAcc !== null && <span className="text-slate-500">{avgAcc}% accuracy</span>}
            {totalMin > 0 && <span className="text-slate-500">{Math.round(totalMin / 60 * 10) / 10}h studied</span>}
          </div>
        )}
      </div>

      {dateLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
        </div>
      ) : dayLogs.length === 0 ? (
        <div className="card-base p-10 flex flex-col items-center gap-3 text-center">
          <BookOpen className="w-8 h-8 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No sessions for {format(parseISO(selectedDate), 'EEEE, MMM d')}.</p>
          <button onClick={() => setShowForm(true)} className="btn-secondary text-xs">Add first session</button>
        </div>
      ) : (
        <div className="space-y-3">
          {dayLogs.map((log) => (
            <div key={log.id} className="card-base p-4 flex items-center gap-4">
              <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: SUBJECT_COLORS[log.subject] }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded border', SUBJECT_BG[log.subject])}>{log.subject}</span>
                  <span className="text-sm font-medium text-slate-700">{log.question_count} questions</span>
                  {log.accuracy !== null && <span className="text-sm text-slate-500">{log.accuracy}% accuracy</span>}
                  {log.time_spent_min && <span className="text-xs text-slate-400">{log.time_spent_min}min</span>}
                </div>
                {log.notes && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{log.notes}</p>}
              </div>
              <button onClick={() => setEditing(log)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && <LogForm date={selectedDate} onClose={() => setShowForm(false)} onSave={handleSave} />}
      {editing && <LogForm date={selectedDate} initial={editing} onClose={() => setEditing(null)} onSave={handleSave} onDelete={handleDelete} />}
    </div>
  );
}
