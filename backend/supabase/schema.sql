-- ============================================================
-- FitTrack Pro — Database Schema
-- Run this first in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- TABLE: users
-- ────────────────────────────────────────────────────────────
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  email       text unique not null,
  avatar_url  text,
  current_weight numeric(5,1),
  target_weight  numeric(5,1),
  goal        text check (goal in ('bulking', 'cutting', 'maintaining')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- TABLE: workouts
-- ────────────────────────────────────────────────────────────
create table if not exists public.workouts (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  date        date not null,
  type        text not null check (type in ('push', 'pull', 'legs', 'cardio', 'rest')),
  notes       text,
  created_at  timestamptz default now(),
  unique(user_id, date)
);

-- ────────────────────────────────────────────────────────────
-- TABLE: exercises
-- ────────────────────────────────────────────────────────────
create table if not exists public.exercises (
  id          uuid primary key default uuid_generate_v4(),
  workout_id  uuid not null references public.workouts(id) on delete cascade,
  name        text not null,
  order_index integer default 0,
  created_at  timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- TABLE: sets
-- ────────────────────────────────────────────────────────────
create table if not exists public.sets (
  id          uuid primary key default uuid_generate_v4(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  set_number  integer not null,
  weight_kg   numeric(6,2),
  reps        integer,
  created_at  timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- TABLE: streaks
-- ────────────────────────────────────────────────────────────
create table if not exists public.streaks (
  user_id           uuid primary key references public.users(id) on delete cascade,
  current_streak    integer default 0,
  max_streak        integer default 0,
  last_workout_date date,
  updated_at        timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- INDEXES for performance
-- ────────────────────────────────────────────────────────────
create index if not exists idx_workouts_user_date on public.workouts(user_id, date desc);
create index if not exists idx_exercises_workout  on public.exercises(workout_id);
create index if not exists idx_sets_exercise      on public.sets(exercise_id);

-- ────────────────────────────────────────────────────────────
-- TRIGGER: auto-update updated_at on users
-- ────────────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- ────────────────────────────────────────────────────────────
-- TRIGGER: auto-create user + streak row on auth.users insert
-- ────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.streaks (user_id, current_streak, max_streak)
  values (new.id, 0, 0)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
