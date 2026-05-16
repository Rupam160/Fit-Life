-- ============================================================
-- CAT Preparation — REPAIR SQL
-- Run this in Supabase SQL Editor if cat_schema.sql errored.
-- This script is idempotent (safe to run multiple times).
-- ============================================================

-- Enable UUID extension (safe to re-run)
create extension if not exists "uuid-ossp";

-- ── Tables (idempotent) ───────────────────────────────────────

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

create table if not exists public.study_streak (
  user_id          uuid primary key references public.users(id) on delete cascade,
  current_streak   integer default 0,
  max_streak       integer default 0,
  last_study_date  date,
  updated_at       timestamptz default now()
);

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

-- ── Indexes (idempotent) ──────────────────────────────────────
create index if not exists idx_cat_logs_user_date     on public.cat_logs(user_id, date desc);
create index if not exists idx_cat_logs_user_subject  on public.cat_logs(user_id, subject);
create index if not exists idx_mock_tests_user_date   on public.mock_tests(user_id, date desc);
create index if not exists idx_cat_schedule_user      on public.cat_schedule(user_id, day);

-- ── Triggers — DROP FIRST to avoid duplicate error ────────────
drop trigger if exists cat_logs_updated_at    on public.cat_logs;
drop trigger if exists mock_tests_updated_at  on public.mock_tests;
drop trigger if exists cat_schedule_updated_at on public.cat_schedule;

create trigger cat_logs_updated_at
  before update on public.cat_logs
  for each row execute procedure public.handle_updated_at();

create trigger mock_tests_updated_at
  before update on public.mock_tests
  for each row execute procedure public.handle_updated_at();

create trigger cat_schedule_updated_at
  before update on public.cat_schedule
  for each row execute procedure public.handle_updated_at();

-- ── RLS — Enable (idempotent) ─────────────────────────────────
alter table public.cat_logs       enable row level security;
alter table public.mock_tests     enable row level security;
alter table public.study_streak   enable row level security;
alter table public.cat_schedule   enable row level security;

-- ── Policies — DROP FIRST to avoid duplicate error ────────────
do $$ begin
  -- cat_logs
  drop policy if exists "Users can view own cat_logs"   on public.cat_logs;
  drop policy if exists "Users can insert own cat_logs" on public.cat_logs;
  drop policy if exists "Users can update own cat_logs" on public.cat_logs;
  drop policy if exists "Users can delete own cat_logs" on public.cat_logs;
  -- mock_tests
  drop policy if exists "Users can view own mock_tests"   on public.mock_tests;
  drop policy if exists "Users can insert own mock_tests" on public.mock_tests;
  drop policy if exists "Users can update own mock_tests" on public.mock_tests;
  drop policy if exists "Users can delete own mock_tests" on public.mock_tests;
  -- study_streak
  drop policy if exists "Users can view own study_streak"   on public.study_streak;
  drop policy if exists "Users can insert own study_streak" on public.study_streak;
  drop policy if exists "Users can update own study_streak" on public.study_streak;
  -- cat_schedule
  drop policy if exists "Users can view own schedule"   on public.cat_schedule;
  drop policy if exists "Users can insert own schedule" on public.cat_schedule;
  drop policy if exists "Users can update own schedule" on public.cat_schedule;
  drop policy if exists "Users can delete own schedule" on public.cat_schedule;
end $$;

-- cat_logs
create policy "Users can view own cat_logs"   on public.cat_logs for select using (auth.uid() = user_id);
create policy "Users can insert own cat_logs" on public.cat_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own cat_logs" on public.cat_logs for update using (auth.uid() = user_id);
create policy "Users can delete own cat_logs" on public.cat_logs for delete using (auth.uid() = user_id);

-- mock_tests
create policy "Users can view own mock_tests"   on public.mock_tests for select using (auth.uid() = user_id);
create policy "Users can insert own mock_tests" on public.mock_tests for insert with check (auth.uid() = user_id);
create policy "Users can update own mock_tests" on public.mock_tests for update using (auth.uid() = user_id);
create policy "Users can delete own mock_tests" on public.mock_tests for delete using (auth.uid() = user_id);

-- study_streak
create policy "Users can view own study_streak"   on public.study_streak for select using (auth.uid() = user_id);
create policy "Users can insert own study_streak" on public.study_streak for insert with check (auth.uid() = user_id);
create policy "Users can update own study_streak" on public.study_streak for update using (auth.uid() = user_id);

-- cat_schedule
create policy "Users can view own schedule"   on public.cat_schedule for select using (auth.uid() = user_id);
create policy "Users can insert own schedule" on public.cat_schedule for insert with check (auth.uid() = user_id);
create policy "Users can update own schedule" on public.cat_schedule for update using (auth.uid() = user_id);
create policy "Users can delete own schedule" on public.cat_schedule for delete using (auth.uid() = user_id);

-- ── Seed study_streak for existing users who don't have a row ─
insert into public.study_streak (user_id, current_streak, max_streak)
select id, 0, 0 from public.users
where id not in (select user_id from public.study_streak)
on conflict (user_id) do nothing;
