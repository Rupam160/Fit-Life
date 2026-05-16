-- ============================================================
-- CAT Preparation — Row Level Security Policies
-- Run after cat_schema.sql
-- ============================================================

-- Enable RLS on all CAT tables
alter table public.cat_logs       enable row level security;
alter table public.mock_tests     enable row level security;
alter table public.study_streak   enable row level security;
alter table public.cat_schedule   enable row level security;

-- ────────────────────────────────────────────────────────────
-- cat_logs policies
-- ────────────────────────────────────────────────────────────
create policy "Users can view own cat_logs"
  on public.cat_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own cat_logs"
  on public.cat_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cat_logs"
  on public.cat_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own cat_logs"
  on public.cat_logs for delete
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- mock_tests policies
-- ────────────────────────────────────────────────────────────
create policy "Users can view own mock_tests"
  on public.mock_tests for select
  using (auth.uid() = user_id);

create policy "Users can insert own mock_tests"
  on public.mock_tests for insert
  with check (auth.uid() = user_id);

create policy "Users can update own mock_tests"
  on public.mock_tests for update
  using (auth.uid() = user_id);

create policy "Users can delete own mock_tests"
  on public.mock_tests for delete
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- study_streak policies
-- ────────────────────────────────────────────────────────────
create policy "Users can view own study_streak"
  on public.study_streak for select
  using (auth.uid() = user_id);

create policy "Users can insert own study_streak"
  on public.study_streak for insert
  with check (auth.uid() = user_id);

create policy "Users can update own study_streak"
  on public.study_streak for update
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- cat_schedule policies
-- ────────────────────────────────────────────────────────────
create policy "Users can view own schedule"
  on public.cat_schedule for select
  using (auth.uid() = user_id);

create policy "Users can insert own schedule"
  on public.cat_schedule for insert
  with check (auth.uid() = user_id);

create policy "Users can update own schedule"
  on public.cat_schedule for update
  using (auth.uid() = user_id);

create policy "Users can delete own schedule"
  on public.cat_schedule for delete
  using (auth.uid() = user_id);
