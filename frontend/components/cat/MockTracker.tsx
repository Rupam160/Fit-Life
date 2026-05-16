'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { getMockTests, insertMockTest, updateMockTest, deleteMockTest } from '@/lib/api/cat';
import type { MockTest, MockTestInput } from '@/lib/types/cat';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, X, Check, Trophy } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface FormState {
  date: string;
  mock_name: string;
  varc_score: string;
  lrdi_score: string;
  quant_score: string;
  total_score: string;
  percentile: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  date: format(new Date(), 'yyyy-MM-dd'),
  mock_name: '',
  varc_score: '',
  lrdi_score: '',
  quant_score: '',
  total_score: '',
  percentile: '',
  notes: '',
};

function scoreColor(score: number | null, max = 100) {
  if (score === null) return 'text-slate-400';
  const pct = (score / max) * 100;
  if (pct >= 80) return 'text-emerald-600';
  if (pct >= 60) return 'text-blue-600';
  if (pct >= 40) return 'text-amber-600';
  return 'text-red-500';
}

interface MockFormProps {
  initial?: MockTest | null;
  onClose: () => void;
  onSave: (data: MockTestInput, id?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

function MockForm({ initial, onClose, onSave, onDelete }: MockFormProps) {
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          date: initial.date,
          mock_name: initial.mock_name ?? '',
          varc_score: initial.varc_score?.toString() ?? '',
          lrdi_score: initial.lrdi_score?.toString() ?? '',
          quant_score: initial.quant_score?.toString() ?? '',
          total_score: initial.total_score?.toString() ?? '',
          percentile: initial.percentile?.toString() ?? '',
          notes: initial.notes ?? '',
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function n(s: string) { const v = parseFloat(s); return isNaN(v) ? null : v; }

  // Auto-calculate total
  useEffect(() => {
    const v = n(form.varc_score), l = n(form.lrdi_score), q = n(form.quant_score);
    if (v !== null && l !== null && q !== null) {
      setForm((prev) => ({ ...prev, total_score: (v + l + q).toFixed(2) }));
    }
  }, [form.varc_score, form.lrdi_score, form.quant_score]);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        date: form.date,
        mock_name: form.mock_name,
        varc_score: n(form.varc_score),
        lrdi_score: n(form.lrdi_score),
        quant_score: n(form.quant_score),
        total_score: n(form.total_score),
        percentile: n(form.percentile),
        notes: form.notes,
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <p className="text-sm font-semibold text-slate-800">{initial ? 'Edit Mock Test' : 'Log Mock Test'}</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Date</label>
              <input type="date" value={form.date} onChange={set('date')} className="input-base" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Mock Name</label>
              <input value={form.mock_name} onChange={set('mock_name')} placeholder="e.g. IMS FullMock 3" className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['VARC Score','varc_score'],['LRDI Score','lrdi_score'],['QUANT Score','quant_score']].map(([label,key]) => (
              <div key={key}>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">{label}</label>
                <input type="number" value={form[key as keyof FormState]} onChange={set(key as keyof FormState)} placeholder="0–100" className="input-base" min={0} max={100} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Total Score (auto)</label>
              <input type="number" value={form.total_score} onChange={set('total_score')} placeholder="0–300" className="input-base bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Percentile</label>
              <input type="number" value={form.percentile} onChange={set('percentile')} placeholder="e.g. 85.6" className="input-base" min={0} max={100} step={0.01} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Notes</label>
            <textarea value={form.notes} onChange={set('notes')} rows={2} placeholder="Analysis, weak areas, etc." className="input-base resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
          {initial && onDelete ? (
            <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors disabled:opacity-50">
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

export function MockTracker() {
  const user = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isLoading);
  const supabase = createClient();
  const [mocks, setMocks] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MockTest | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) { setLoading(false); return; }
    getMockTests(supabase, user.id)
      .then((data) => { setMocks(data); })
      .catch((e) => console.error('Mock tests load error:', e))
      .finally(() => setLoading(false));
  }, [user, isAuthLoading]);

  async function handleSave(data: MockTestInput, id?: string) {
    if (!user) return;
    if (id) {
      const updated = await updateMockTest(supabase, id, data);
      setMocks((prev) => prev.map((m) => m.id === id ? updated : m));
    } else {
      const created = await insertMockTest(supabase, user.id, data);
      setMocks((prev) => [created, ...prev]);
    }
  }

  async function handleDelete(id: string) {
    await deleteMockTest(supabase, id);
    setMocks((prev) => prev.filter((m) => m.id !== id));
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mock Tests</h1>
          <p className="text-sm text-slate-500 mt-1">{mocks.length} mock{mocks.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Log Mock
        </button>
      </div>

      {mocks.length === 0 ? (
        <div className="card-base p-12 flex flex-col items-center gap-3 text-center">
          <Trophy className="w-8 h-8 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No mock tests logged yet.</p>
          <p className="text-xs text-slate-400">Log your first mock to start tracking progress.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mocks.map((mock) => (
            <div key={mock.id} className="card-base p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-800">{mock.mock_name || 'Untitled Mock'}</p>
                  <span className="text-xs text-slate-400">{format(parseISO(mock.date), 'MMM d, yyyy')}</span>
                  {mock.percentile && (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      {mock.percentile}%ile
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  {[['VARC', mock.varc_score], ['LRDI', mock.lrdi_score], ['QUANT', mock.quant_score]].map(([label, score]) => (
                    <div key={label as string} className="flex items-center gap-1">
                      <span className="text-[10px] font-semibold text-slate-400">{label}</span>
                      <span className={cn('text-sm font-bold', scoreColor(score as number | null))}>{score ?? '—'}</span>
                    </div>
                  ))}
                  {mock.total_score && (
                    <div className="flex items-center gap-1 ml-1 border-l border-slate-100 pl-4">
                      <span className="text-[10px] font-semibold text-slate-400">TOTAL</span>
                      <span className="text-sm font-bold text-slate-800">{mock.total_score}</span>
                    </div>
                  )}
                </div>
                {mock.notes && <p className="text-xs text-slate-500 mt-2 line-clamp-1">{mock.notes}</p>}
              </div>
              <button onClick={() => setEditing(mock)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <MockForm onClose={() => setShowForm(false)} onSave={handleSave} />
      )}
      {editing && (
        <MockForm initial={editing} onClose={() => setEditing(null)} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  );
}
