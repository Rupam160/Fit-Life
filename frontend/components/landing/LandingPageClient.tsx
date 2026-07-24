'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Dumbbell,
  Sparkles,
  TrendingUp,
  Calendar as CalendarIcon,
  Heart,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  Flame,
  ChevronRight,
  Smile,
  BarChart2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LandingPageProps {
  isLoggedIn: boolean;
}

export function LandingPageClient({ isLoggedIn }: LandingPageProps) {
  const [activeDemoTab, setActiveDemoTab] = useState<'workout' | 'period' | 'calendar'>('workout');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white font-sans overflow-x-hidden">
      {/* Background Glow Elements */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-rose-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Fit Life
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#female-tracking" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
              Cycle Tracker 🌸
            </a>
            <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-rose-500/20 flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-rose-500/20 flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-rose-400 mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Next-Gen Fitness & Female Period Cycle Tracking</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Track Every Lift, Streak & <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">Health Cycle.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            The all-in-one fitness platform designed for progressive workout volume tracking, calendar consistency heatmaps, and dedicated female period flow & mood cycle insights.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={isLoggedIn ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-bold text-base hover:shadow-xl hover:shadow-rose-500/25 transition-all flex items-center justify-center gap-3"
            >
              Start Tracking Now — It&apos;s Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-base hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2"
            >
              Explore Interactive Demo
            </a>
          </div>

          {/* Mockup Preview Card */}
          <div className="mt-16 sm:mt-24 relative max-w-5xl mx-auto rounded-3xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-inner">
              {/* Fake Window Header */}
              <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-slate-500 font-mono">fitlife.app/dashboard</span>
                <div className="w-12" />
              </div>

              {/* Showcase Grid Preview */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workout Volume</span>
                      <span className="text-xs text-rose-400 font-bold">+18% this week</span>
                    </div>
                    <p className="text-3xl font-black text-white tracking-tight">14,250 <span className="text-sm font-normal text-slate-400">kg</span></p>
                  </div>
                  <div className="mt-6 h-16 flex items-end gap-1.5">
                    {[40, 65, 30, 85, 60, 95, 75].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-rose-500 to-indigo-500 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workout Streak</span>
                      <Flame className="w-4 h-4 text-orange-400" />
                    </div>
                    <p className="text-3xl font-black text-white tracking-tight">12 <span className="text-sm font-normal text-slate-400">days streak</span></p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                    <span>Best Record: 18 days</span>
                    <span className="text-emerald-400 font-semibold">Active 🔥</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-900/40 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                        🩸 Period & Mood Cycle
                      </span>
                      <Smile className="w-4 h-4 text-pink-400" />
                    </div>
                    <p className="text-xl font-bold text-white">Flow Day 3 <span className="text-xs text-pink-300 font-normal">Medium Flow</span></p>
                  </div>
                  <div className="mt-4 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-pink-200">
                    Next cycle predicted in <span className="font-bold text-white">25 days</span> (28-day average).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-20 md:py-32 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Designed for Peak Performance & Whole-Body Health
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Everything you need to track workouts, maintain consistency, and manage female health cycles seamlessly in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Volume & Weight Progress</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Log exercises, sets, and weight lifted across Push, Pull, and Legs routines with custom timeframe filters (30D, 3M, 6M, All Time).
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-rose-900/50 bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/20 hover:border-rose-700/60 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🩸</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Female Cycle & Mood Tracker</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Log period days with blood drop indicators 🩸, fading flow intensity colors (Days 1–7), daily mood emojis (😊, 😔, 😡), and 28-day predictions.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Activity Heatmap Calendar</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Interactive monthly calendar heatmaps with month-by-month switcher (`&lt;` / `&gt;`) to view past workout sessions and rest days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Demo Section */}
      <section id="demo" className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Interactive Preview</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Try the Live Feature Switcher</h2>
          </div>

          <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 max-w-md mx-auto flex items-center gap-1 mb-8">
            <button
              onClick={() => setActiveDemoTab('workout')}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all',
                activeDemoTab === 'workout'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              Workout Volume
            </button>
            <button
              onClick={() => setActiveDemoTab('period')}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1',
                activeDemoTab === 'period'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                  : 'text-rose-400 hover:text-rose-300'
              )}
            >
              Period Tracker 🩸
            </button>
            <button
              onClick={() => setActiveDemoTab('calendar')}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all',
                activeDemoTab === 'calendar'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              Calendar
            </button>
          </div>

          {/* Demo Content Container */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center">
            {activeDemoTab === 'workout' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-2xl font-bold text-white">Dynamic Volume Progress Chart</h3>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">Filter volume trends across Push, Pull, and Legs using 30D, 3M, 6M, and All Time timeframes.</p>
                <div className="h-48 bg-slate-950/60 rounded-2xl border border-slate-800 p-4 flex items-end justify-around gap-2">
                  <div className="w-12 bg-rose-500/80 rounded-t-lg h-3/4" title="Push" />
                  <div className="w-12 bg-blue-500/80 rounded-t-lg h-1/2" title="Pull" />
                  <div className="w-12 bg-amber-500/80 rounded-t-lg h-5/6" title="Legs" />
                </div>
              </div>
            )}

            {activeDemoTab === 'period' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-2xl font-bold text-rose-400 flex items-center justify-center gap-2">
                  🩸 Female Period Flow & Mood Tracker
                </h3>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">
                  Displays blood drop emojis on period days, flow gradient fading across 5–7 days, daily mood emojis (😊, 😔, 😡, 😴), and automatic 28-day predictions.
                </p>
                <div className="grid grid-cols-7 gap-2 max-w-sm mx-auto p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="p-2 rounded-xl bg-rose-600 text-white text-xs font-bold" title="Day 1 Heavy">1 🩸</div>
                  <div className="p-2 rounded-xl bg-rose-600 text-white text-xs font-bold" title="Day 2 Heavy">2 🩸</div>
                  <div className="p-2 rounded-xl bg-rose-500 text-white text-xs font-bold" title="Day 3 Medium">3 🩸</div>
                  <div className="p-2 rounded-xl bg-rose-500 text-white text-xs font-bold" title="Day 4 Medium">4 🩸</div>
                  <div className="p-2 rounded-xl bg-rose-400 text-white text-xs font-bold" title="Day 5 Light">5 🩸</div>
                  <div className="p-2 rounded-xl bg-pink-300 text-slate-900 text-xs font-bold" title="Day 6 Ending">6 🩸</div>
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold">7 😊</div>
                </div>
              </div>
            )}

            {activeDemoTab === 'calendar' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-2xl font-bold text-white">Full Activity Heatmap</h3>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">Month-by-month calendar navigation with color-coded workout indicators.</p>
                <div className="grid grid-cols-7 gap-1.5 max-w-md mx-auto p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} className={cn('aspect-square rounded-lg flex items-center justify-center text-xs font-semibold', i % 3 === 0 ? 'bg-rose-500 text-white' : i % 5 === 0 ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500')}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800/80 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-500 flex items-center justify-center">
              <Dumbbell className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-300">Fit Life</span>
          </div>
          <p>© {new Date().getFullYear()} Fit Life. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-300">Login</Link>
            <Link href="/signup" className="hover:text-slate-300">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
