'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateUserProfile } from '@/lib/api/profile';
import type { GenderType, BloodGroupType } from '@/lib/types/database';
import { Dumbbell, Heart, Activity, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  userId: string;
  onComplete: () => void;
}

const BLOOD_GROUPS: BloodGroupType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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
      setError('Please enter a valid target weight.');
      return;
    }
    if (step === 4 && (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 120)) {
      setError('Please enter a valid age (10-120).');
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinishOnboarding = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const res = await updateUserProfile(supabase, userId, {
      gender: gender ?? undefined,
      blood_group: bloodGroup ?? undefined,
      target_weight: targetWeight ? Number(targetWeight) : undefined,
      age: age ? Number(age) : undefined,
      onboarded: true,
    });

    setIsLoading(false);
    if (res.success) {
      onComplete();
    } else {
      setError(res.error || 'Failed to save onboarding data.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 relative">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Step {step} of 5
              </span>
            </div>
            {step === 5 && (
              <button
                onClick={handleFinishOnboarding}
                disabled={isLoading}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Skip Tutorial
              </button>
            )}
          </div>

          {/* STEP 1: Gender */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome! Let&apos;s customize your experience</h2>
                <p className="text-sm text-slate-500 mt-1">Please select your gender so we can tailor your fitness and health features.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => { setGender('male'); setError(null); }}
                  className={cn(
                    'p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all text-center',
                    gender === 'male'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-slate-50/50'
                  )}
                >
                  <span className="text-4xl">👨</span>
                  <span className="font-semibold text-base">Male</span>
                </button>

                <button
                  onClick={() => { setGender('female'); setError(null); }}
                  className={cn(
                    'p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all text-center',
                    gender === 'female'
                      ? 'border-pink-500 bg-pink-50/50 text-pink-900 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-slate-50/50'
                  )}
                >
                  <span className="text-4xl">👩</span>
                  <span className="font-semibold text-base">Female</span>
                  <span className="text-[10px] font-medium text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                    Includes Cycle & Mood Tracker 🌸
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Blood Group */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">What is your blood group?</h2>
                <p className="text-sm text-slate-500 mt-1">Stored securely in your medical profile for workout optimization.</p>
              </div>

              <div className="grid grid-cols-4 gap-2.5 pt-2">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => { setBloodGroup(bg); setError(null); }}
                    className={cn(
                      'py-3.5 rounded-xl border-2 font-bold text-sm transition-all',
                      bloodGroup === bg
                        ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 text-slate-700 bg-slate-50/50'
                    )}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Weight Goal */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">What is your target weight goal?</h2>
                <p className="text-sm text-slate-500 mt-1">Enter your ideal target weight in kilograms (kg).</p>
              </div>

              <div className="pt-2">
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 70"
                    value={targetWeight}
                    onChange={(e) => { setTargetWeight(e.target.value); setError(null); }}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:ring-0 text-xl font-bold text-slate-800 placeholder:text-slate-300 transition-all pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    KG
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Age */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">How old are you?</h2>
                <p className="text-sm text-slate-500 mt-1">Helps calculate daily calorie burn targets and heart metrics.</p>
              </div>

              <div className="pt-2">
                <input
                  type="number"
                  placeholder="e.g. 24"
                  value={age}
                  onChange={(e) => { setAge(e.target.value); setError(null); }}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:ring-0 text-xl font-bold text-slate-800 placeholder:text-slate-300 transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Interactive Tutorial */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">You&apos;re all set! Quick Tour 🚀</h2>
                <p className="text-sm text-slate-500 mt-1">Here are the key features available on your FitTrack Pro dashboard:</p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Workout & Volume Tracker</p>
                    <p className="text-xs text-slate-500 mt-0.5">Log push, pull, legs, or cardio sessions and track total lifted volume trends over time.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Consistency & Streaks</p>
                    <p className="text-xs text-slate-500 mt-0.5">Stay accountable with workout streaks and full calendar activity heatmaps.</p>
                  </div>
                </div>

                {gender === 'female' && (
                  <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-100 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-lg">🩸</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-pink-900">Period & Mood Cycle Tracker</p>
                      <p className="text-xs text-pink-700 mt-0.5">Track period days with flow color gradients, daily mood emojis (😊, 😔, 😡), and 28-day cycle predictions on your calendar!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishOnboarding}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-md shadow-indigo-100"
              >
                {isLoading ? 'Saving...' : 'Get Started'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
