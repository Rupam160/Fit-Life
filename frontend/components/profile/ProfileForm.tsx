'use client';

import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { updateProfile, updateUserProfile } from '@/lib/api/profile';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { DbUser, GenderType, BloodGroupType, GoalType } from '@/lib/types/database';

interface ProfileFormProps {
  profile: DbUser;
}

const GOAL_OPTIONS: { value: GoalType; label: string; description: string }[] = [
  { value: 'bulking', label: 'Bulking', description: 'Gaining muscle mass' },
  { value: 'cutting', label: 'Cutting', description: 'Losing fat' },
  { value: 'maintaining', label: 'Maintaining', description: 'Staying consistent' },
];

const BLOOD_GROUPS: BloodGroupType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function ProfileForm({ profile }: ProfileFormProps) {
  const user = useAuthStore((s) => s.user);
  const setProfile = useAuthStore((s) => s.setProfile);

  const [name, setName] = useState(profile.name ?? '');
  const [currentWeight, setCurrentWeight] = useState(profile.current_weight?.toString() ?? '');
  const [targetWeight, setTargetWeight] = useState(profile.target_weight?.toString() ?? '');
  const [goal, setGoal] = useState<GoalType | null>(profile.goal);
  const [gender, setGender] = useState<GenderType | null>(profile.gender ?? null);
  const [bloodGroup, setBloodGroup] = useState<BloodGroupType | null>(profile.blood_group ?? null);
  const [age, setAge] = useState<string>(profile.age?.toString() ?? '');

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: saveError } = await updateProfile(supabase, user.id, {
      name,
      current_weight: currentWeight ? parseFloat(currentWeight) : null,
      target_weight: targetWeight ? parseFloat(targetWeight) : null,
      goal,
    });

    await updateUserProfile(supabase, user.id, {
      gender: gender ?? undefined,
      blood_group: bloodGroup ?? undefined,
      age: age ? parseInt(age, 10) : undefined,
      target_weight: targetWeight ? parseFloat(targetWeight) : undefined,
    });

    if (saveError) {
      setError(saveError);
    } else {
      setSaved(true);
      setProfile({
        ...profile,
        name,
        current_weight: parseFloat(currentWeight) || null,
        target_weight: parseFloat(targetWeight) || null,
        goal,
        gender,
        blood_group: bloodGroup,
        age: age ? parseInt(age, 10) : null,
      });
      setTimeout(() => setSaved(false), 3000);
    }

    setIsSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="input-base"
        />
      </div>

      {/* Gender & Age */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Gender</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                gender === 'male' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              Male 👨
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                gender === 'female' ? 'bg-pink-600 text-white border-pink-600' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              Female 👩
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="age" className="text-sm font-medium text-slate-700">
            Age
          </label>
          <input
            id="age"
            type="number"
            min="10"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 24"
            className="input-base"
          />
        </div>
      </div>

      {/* Blood Group */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Blood Group</label>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              type="button"
              onClick={() => setBloodGroup(bg)}
              className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                bloodGroup === bg
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Weights */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="current-weight" className="text-sm font-medium text-slate-700">
            Current weight (kg)
          </label>
          <input
            id="current-weight"
            type="number"
            min="20"
            max="300"
            step="0.1"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder="e.g. 75.5"
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="target-weight" className="text-sm font-medium text-slate-700">
            Goal weight (kg)
          </label>
          <input
            id="target-weight"
            type="number"
            min="20"
            max="300"
            step="0.1"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder="e.g. 80"
            className="input-base"
          />
        </div>
      </div>

      {/* Goal */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Fitness goal</label>
        <div className="grid grid-cols-3 gap-2">
          {GOAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGoal(opt.value)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all
                ${
                  goal === opt.value
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
            >
              <span className="text-sm font-medium">{opt.label}</span>
              <span className={`text-xs mt-0.5 ${goal === opt.value ? 'text-slate-300' : 'text-slate-400'}`}>
                {opt.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      <button type="submit" disabled={isSaving} className="btn-primary self-start min-w-[140px]">
        {isSaving ? (
          'Saving...'
        ) : saved ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Saved!
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save changes
          </>
        )}
      </button>
    </form>
  );
}
