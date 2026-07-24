'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateUserProfile } from '@/lib/api/profile';
import type { GenderType, BloodGroupType } from '@/lib/types/database';
import { Sparkles, User, Droplet, Scale, Calendar, Check, ArrowRight, ChevronLeft, Dumbbell, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  userId: string;
  onComplete: () => void;
}

const BLOOD_GROUPS: BloodGroupType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const STEPS_NAV = [
  { step: 1, label: 'Gender', icon: User },
  { step: 2, label: 'Blood Group', icon: Droplet },
  { step: 3, label: 'Target Weight', icon: Scale },
  { step: 4, label: 'Age', icon: Calendar },
  { step: 5, label: 'Overview', icon: Sparkles },
];

export function OnboardingModal({ isOpen, userId, onComplete }: Props) {
  const [step, setStep] = useState<number>(1);
  const [gender, setGender] = useState<GenderType | null>(null);
  const [bloodGroup, setBloodGroup] = useState<BloodGroupType | null>(null);
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    setError(null);
    if (step === 1 && !gender) {
      setError('Please select your gender to continue.');
      return;
    }
    if (step === 2 && !bloodGroup) {
      setError('Please select your blood group.');
      return;
    }
    if (step === 3 && (!targetWeight || isNaN(Number(targetWeight)) || Number(targetWeight) <= 0)) {
      setError('Please enter a valid target weight in kg.');
      return;
    }
    if (step === 4 && (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 120)) {
      setError('Please enter a valid age (10-120).');
      return;
    }

    setStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinishOnboarding = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const res = await updateUserProfile(supabase, userId, {
      gender: gender ?? null,
      blood_group: bloodGroup ?? null,
      target_weight: targetWeight ? Number(targetWeight) : null,
      age: age ? Number(age) : null,
      onboarded: true,
    });

    setIsLoading(false);
    if (res.success) {
      onComplete();
    } else {
      setError(res.error || 'Failed to save onboarding settings.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl shadow-slate-900/20 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="h-14 px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              FP
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Account Preferences</h3>
              <p className="text-[11px] text-slate-400 font-medium">Personalize your fitness & health features</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              Step {step} of 5
            </span>
          </div>
        </div>

        {/* Modal Body: Left Step Navigation Sidebar + Main Panel */}
        <div className="flex-1 flex flex-col sm:flex-row min-h-0 overflow-hidden">
          {/* Left Navigation Steps (TradingView Style) */}
          <div className="w-full sm:w-48 bg-slate-50/70 border-b sm:border-b-0 sm:border-r border-slate-100 p-2 sm:p-3 shrink-0 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-y-auto">
            {STEPS_NAV.map(({ step: sNum, label, icon: Icon }) => {
              const isActive = step === sNum;
              const isDone = step > sNum;
              return (
                <button
                  key={sNum}
                  onClick={() => {
                    if (sNum <= step) setStep(sNum);
                  }}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap text-left',
                    isActive
                      ? 'bg-white text-slate-900 border border-slate-200/80 shadow-sm'
                      : isDone
                      ? 'text-slate-700 hover:bg-slate-100/60'
                      : 'text-slate-400 opacity-60 cursor-default'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-slate-900' : 'text-slate-400')} />
                    <span>{label}</span>
                  </div>
                  {isDone && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Main Step Content */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
            {/* STEP 1: Gender */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">Select Gender</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Determines optional period & mood tracking modules.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div
                    onClick={() => { setGender('male'); setError(null); }}
                    className={cn(
                      'p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 text-center',
                      gender === 'male'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm font-bold'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-700'
                    )}
                  >
                    <span className="text-3xl">👨</span>
                    <span className="text-xs font-bold">Male</span>
                  </div>

                  <div
                    onClick={() => { setGender('female'); setError(null); }}
                    className={cn(
                      'p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 text-center relative',
                      gender === 'female'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm font-bold'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-700'
                    )}
                  >
                    <span className="text-3xl">👩</span>
                    <span className="text-xs font-bold">Female</span>
                    <span className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1',
                      gender === 'female' ? 'bg-rose-950 text-rose-200 border-rose-800' : 'bg-pink-50 text-pink-700 border-pink-100'
                    )}>
                      Includes Period Tracker 🌸
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Blood Group */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">Select Blood Group</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Stored securely in your health profile.</p>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  {BLOOD_GROUPS.map((bg) => {
                    const isSelected = bloodGroup === bg;
                    return (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => { setBloodGroup(bg); setError(null); }}
                        className={cn(
                          'py-3 rounded-xl border text-xs font-bold transition-all',
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
                        )}
                      >
                        {bg}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Weight Goal */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">Target Weight Goal</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Enter your ideal target weight in kilograms (kg).</p>
                </div>

                <div className="relative pt-1">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 70"
                    value={targetWeight}
                    onChange={(e) => { setTargetWeight(e.target.value); setError(null); }}
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-3 text-sm text-slate-800 font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all pr-14"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    KG
                  </span>
                </div>
              </div>
            )}

            {/* STEP 4: Age */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">Enter Your Age</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Used for fitness & calorie target estimations.</p>
                </div>

                <div className="pt-1">
                  <input
                    type="number"
                    placeholder="e.g. 24"
                    value={age}
                    onChange={(e) => { setAge(e.target.value); setError(null); }}
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-3 text-sm text-slate-800 font-bold focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Overview / Tutorial */}
            {step === 5 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">Setup Complete! 🚀</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Your profile is configured. Here is what is ready on your dashboard:</p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      <Dumbbell className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Workout & Weight Progress</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Track exercises, volume stats, and calorie metrics.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Activity Calendar</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Consistency heatmaps and month-by-month switcher.</p>
                    </div>
                  </div>

                  {gender === 'female' && (
                    <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                        🩸
                      </div>
                      <div>
                        <p className="text-xs font-bold text-rose-950">Period & Mood Cycle Tracker</p>
                        <p className="text-[11px] text-rose-800 mt-0.5">Track flow fading, daily mood emojis (😊, 😔, 😡), and 28-day predictions.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="h-16 px-6 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleFinishOnboarding}
            disabled={isLoading}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Skip Setup
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-sm hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-1.5"
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-sm hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-1.5"
              >
                {isLoading ? 'Saving...' : 'Ok'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
