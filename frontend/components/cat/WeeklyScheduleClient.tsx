'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { insertScheduleItem, updateScheduleItem, deleteScheduleItem } from '@/lib/api/cat';
import type { CatScheduleItem, ScheduleItemInput, ScheduleDay } from '@/lib/types/cat';
import { SUBJECT_BG } from '@/lib/constants/cat';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const DAYS: ScheduleDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = [
  '8:00 AM – 10:00 AM',
  '10:00 AM – 11:30 AM',
  '12:30 PM – 1:30 PM',
  '8:00 PM – 10:00 PM',
];

interface Props { userId: string; initialItems: CatScheduleItem[]; }
interface CellEdit { day: ScheduleDay; slot: string; item: CatScheduleItem | null; }

function EditModal({ cell, onClose, onSave, onDelete }: {
  cell: CellEdit;
  onClose: () => void;
  onSave: (data: ScheduleItemInput, id?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [task, setTask] = useState(cell.item?.task ?? '');
  const [subject, setSubject] = useState(cell.item?.subject ?? 'Other');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    if (!task.trim()) return;
    setSaving(true);
    try { await onSave({ day: cell.day, time_slot: cell.slot, task: task.trim(), subject: subject as any }, cell.item?.id); onClose(); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!cell.item) return;
    setDeleting(true);
    try { await onDelete(cell.item.id); onClose(); }
    finally { setDeleting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-100 animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-sm font-semibold text-slate-800">{cell.day} — {cell.slot}</p>
            <p className="text-xs text-slate-400 mt-0.5">{cell.item ? 'Edit task' : 'Add task'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Task</label>
            <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="e.g. VARC Study + DPP" className="input-base" onKeyDown={(e) => e.key === 'Enter' && handleSave()} autoFocus />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Subject</label>
            <div className="flex flex-wrap gap-2">
              {(['VARC','LRDI','QUANT','Mock','Review','Other'] as const).map((s) => (
                <button key={s} onClick={() => setSubject(s)}
                  className={cn('text-xs font-semibold px-3 py-1 rounded-lg border transition-all',
                    subject === s ? SUBJECT_BG[s] : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100')}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
          {cell.item ? (
            <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 disabled:opacity-50">
              <Trash2 className="w-3.5 h-3.5" />{deleting ? 'Deleting...' : 'Delete'}
            </button>
          ) : <div />}
          <button onClick={handleSave} disabled={saving || !task.trim()} className="btn-primary">
            <Check className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function WeeklyScheduleClient({ userId, initialItems }: Props) {
  const supabase = createClient();
  const [items, setItems] = useState<CatScheduleItem[]>(initialItems);
  const [editing, setEditing] = useState<CellEdit | null>(null);

  function getCell(day: ScheduleDay, slot: string) {
    return items.find((it) => it.day === day && it.time_slot === slot) ?? null;
  }

  async function handleSave(data: ScheduleItemInput, id?: string) {
    if (id) {
      const updated = await updateScheduleItem(supabase, id, data);
      setItems((prev) => prev.map((it) => it.id === id ? updated : it));
    } else {
      const created = await insertScheduleItem(supabase, userId, data);
      setItems((prev) => [...prev, created]);
    }
  }

  async function handleDelete(id: string) {
    await deleteScheduleItem(supabase, id);
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Weekly Schedule</h1>
        <p className="text-sm text-slate-500 mt-1">Click any cell to add, edit, or delete a task.</p>
      </div>

      <div className="card-base overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="w-36 p-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
              {DAYS.map((d) => (
                <th key={d} className="p-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot, si) => (
              <tr key={slot} className={si < TIME_SLOTS.length - 1 ? 'border-b border-slate-50' : ''}>
                <td className="p-3 pr-4">
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{slot}</span>
                </td>
                {DAYS.map((day) => {
                  const item = getCell(day, slot);
                  return (
                    <td key={day} className="p-1.5">
                      <button onClick={() => setEditing({ day, slot, item })}
                        className={cn('w-full min-h-[72px] rounded-xl p-2.5 text-left text-xs transition-all group',
                          item ? 'bg-white border border-slate-100 hover:border-slate-300 hover:shadow-sm' : 'bg-slate-50 border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-100')}>
                        {item ? (
                          <div className="space-y-1.5 h-full flex flex-col">
                            {item.subject && (
                              <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0 self-start', SUBJECT_BG[item.subject] ?? SUBJECT_BG.Other)}>
                                {item.subject}
                              </span>
                            )}
                            <p className="font-medium text-slate-700 leading-snug flex-1">{item.task}</p>
                            <Pencil className="w-3 h-3 text-slate-300 group-hover:text-slate-400 transition-colors" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-1 text-slate-300 group-hover:text-slate-400">
                            <Plus className="w-4 h-4" />
                            <span className="text-[10px]">Add</span>
                          </div>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal cell={editing} onClose={() => setEditing(null)} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  );
}
