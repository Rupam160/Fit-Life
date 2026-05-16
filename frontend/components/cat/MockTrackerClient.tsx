'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { insertMockTest, updateMockTest, deleteMockTest } from '@/lib/api/cat';
import type { MockTest, MockTestInput } from '@/lib/types/cat';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, X, Check, Trophy } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Props { userId: string; initialMocks: MockTest[]; }

function scoreColor(score: number | null) {
  if (score === null) return 'text-slate-400';
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-500';
}

function MockForm({ initial, onClose, onSave, onDelete }: {
  initial?: MockTest | null;
  onClose: () => void;
  onSave: (data: MockTestInput, id?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [date, setDate] = useState(initial?.date ?? format(new Date(), 'yyyy-MM-dd'));
  const [mockName, setMockName] = useState(initial?.mock_name ?? '');
  const [varc, setVarc] = useState(initial?.varc_score?.toString() ?? '');
  const [lrdi, setLrdi] = useState(initial?.lrdi_score?.toString() ?? '');
  const [quant, setQuant] = useState(initial?.quant_score?.toString() ?? '');
  const [total, setTotal] = useState(initial?.total_score?.toString() ?? '');
  const [percentile, setPercentile] = useState(initial?.percentile?.toString() ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const n = (s: string) => { const v = parseFloat(s); return isNaN(v) ? null : v; };

  useEffect(() => {
    const v = n(varc), l = n(lrdi), q = n(quant);
    if (v !== null && l !== null && q !== null) setTotal((v + l + q).toFixed(2));
  }, [varc, lrdi, quant]);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({ date, mock_name: mockName, varc_score: n(varc), lrdi_score: n(lrdi), quant_score: n(quant), total_score: n(total), percentile: n(percentile), notes }, initial?.id);
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
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-base" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Mock Name</label>
              <input value={mockName} onChange={(e) => setMockName(e.target.value)} placeholder="e.g. IMS FullMock 3" className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['VARC Score', varc, setVarc], ['LRDI Score', lrdi, setLrdi], ['QUANT Score', quant, setQuant]].map(([label, val, setter]: any) => (
              <div key={label as string}>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">{label}</label>
                <input type="number" value={val} onChange={(e) => setter(e.target.value)} placeholder="0–100" className="input-base" min={0} max={100} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Total (auto)</label>
              <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="input-base bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">Percentile</label>
              <input type="number" value={percentile} onChange={(e) => setPercentile(e.target.value)} placeholder="e.g. 85.6" className="input-base" min={0} max={100} step={0.01} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Analysis, weak areas..." className="input-base resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
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

export function MockTrackerClient({ userId, initialMocks }: Props) {
  const supabase = createClient();
  const [mocks, setMocks] = useState<MockTest[]>(initialMocks);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MockTest | null>(null);

  async function handleSave(data: MockTestInput, id?: string) {
    if (id) {
      const updated = await updateMockTest(supabase, id, data);
      setMocks((prev) => prev.map((m) => m.id === id ? updated : m));
    } else {
      const created = await insertMockTest(supabase, userId, data);
      setMocks((prev) => [created, ...prev]);
    }
  }

  async function handleDelete(id: string) {
    await deleteMockTest(supabase, id);
    setMocks((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mock Tests</h1>
          <p className="text-sm text-slate-500 mt-1">{mocks.length} mock{mocks.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="w-4 h-4" /> Log Mock</button>
      </div>

      {mocks.length === 0 ? (
        <div className="card-base p-12 flex flex-col items-center gap-3 text-center">
          <Trophy className="w-8 h-8 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No mock tests logged yet.</p>
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
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{mock.percentile}%ile</span>
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

      {showForm && <MockForm onClose={() => setShowForm(false)} onSave={handleSave} />}
      {editing && <MockForm initial={editing} onClose={() => setEditing(null)} onSave={handleSave} onDelete={handleDelete} />}
    </div>
  );
}
