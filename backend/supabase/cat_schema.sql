-- ============================================================
-- CAT Preparation — Database Schema
-- Run this in your Supabase SQL Editor after schema.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- TABLE: cat_logs
-- Daily study session logs per subject
-- ────────────────────────────────────────────────────────────
create table if not exists public.cat_logs (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  date           date not null,
  subject        text not null check (subject in ('VARC', 'LRDI', 'QUANT')),
  question_count integer not null default 0,
  accuracy       numeric(5,2) check (accuracy >= 0 and accuracy <= 100),
  time_spent_min integer default 0,
  notes          text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- TABLE: mock_tests
-- Mock test scores and percentile tracking
-- ────────────────────────────────────────────────────────────
create table if not exists public.mock_tests (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  date         date not null,
  mock_name    text,
  varc_score   numeric(6,2),
  lrdi_score   numeric(6,2),
  quant_score  numeric(6,2),
  total_score  numeric(6,2),
  percentile   numeric(5,2),
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- TABLE: study_streak
-- CAT study streak tracking (separate from gym)
-- ────────────────────────────────────────────────────────────
create table if not exists public.study_streak (
  user_id          uuid primary key references public.users(id) on delete cascade,
  current_streak   integer default 0,
  max_streak       integer default 0,
  last_study_date  date,
  updated_at       timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- TABLE: cat_schedule
-- Weekly study schedule (time slots per day)
-- ────────────────────────────────────────────────────────────
create table if not exists public.cat_schedule (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  day        text not null check (day in ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  time_slot  text not null,
  task       text not null,
  subject    text check (subject in ('VARC', 'LRDI', 'QUANT', 'Mock', 'Review', 'Other')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- INDEXES for performance
-- ────────────────────────────────────────────────────────────
create index if not exists idx_cat_logs_user_date     on public.cat_logs(user_id, date desc);
create index if not exists idx_cat_logs_user_subject  on public.cat_logs(user_id, subject);
create index if not exists idx_mock_tests_user_date   on public.mock_tests(user_id, date desc);
create index if not exists idx_cat_schedule_user      on public.cat_schedule(user_id, day);

-- ────────────────────────────────────────────────────────────
-- TRIGGERS: updated_at timestamps
-- ────────────────────────────────────────────────────────────
create trigger cat_logs_updated_at
  before update on public.cat_logs
  for each row execute procedure public.handle_updated_at();

create trigger mock_tests_updated_at
  before update on public.mock_tests
  for each row execute procedure public.handle_updated_at();

create trigger cat_schedule_updated_at
  before update on public.cat_schedule
  for each row execute procedure public.handle_updated_at();

-- ────────────────────────────────────────────────────────────
-- TRIGGER: auto-create study_streak on new user
-- ────────────────────────────────────────────────────────────
create or replace function public.handle_new_user_cat()
returns trigger language plpgsql security definer as $$
begin
  insert into public.study_streak (user_id, current_streak, max_streak)
  values (new.id, 0, 0)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Note: We attach this to the auth.users trigger in the existing handle_new_user function
-- Add to handle_new_user: INSERT INTO public.study_streak ...
-- Or run separately if handle_new_user already exists.
