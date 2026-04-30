-- ============================================================
-- FitTrack Pro — Row Level Security Policies
-- Run AFTER schema.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Enable RLS on all tables
-- ────────────────────────────────────────────────────────────
alter table public.users     enable row level security;
alter table public.workouts  enable row level security;
alter table public.exercises enable row level security;
alter table public.sets      enable row level security;
alter table public.streaks   enable row level security;

-- ────────────────────────────────────────────────────────────
-- USERS policies
-- ────────────────────────────────────────────────────────────
create policy "users: select own row"
  on public.users for select
  using (auth.uid() = id);

create policy "users: update own row"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users: insert own row"
  on public.users for insert
  with check (auth.uid() = id);

-- ────────────────────────────────────────────────────────────
-- WORKOUTS policies
-- ────────────────────────────────────────────────────────────
create policy "workouts: select own"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "workouts: insert own"
  on public.workouts for insert
  with check (auth.uid() = user_id);

create policy "workouts: update own"
  on public.workouts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "workouts: delete own"
  on public.workouts for delete
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- EXERCISES policies (through workouts ownership)
-- ────────────────────────────────────────────────────────────
create policy "exercises: select own"
  on public.exercises for select
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  );

create policy "exercises: insert own"
  on public.exercises for insert
  with check (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  );

create policy "exercises: update own"
  on public.exercises for update
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  );

create policy "exercises: delete own"
  on public.exercises for delete
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────
-- SETS policies (through exercises → workouts ownership)
-- ────────────────────────────────────────────────────────────
create policy "sets: select own"
  on public.sets for select
  using (
    exists (
      select 1 from public.exercises e
      join public.workouts w on w.id = e.workout_id
      where e.id = exercise_id and w.user_id = auth.uid()
    )
  );

create policy "sets: insert own"
  on public.sets for insert
  with check (
    exists (
      select 1 from public.exercises e
      join public.workouts w on w.id = e.workout_id
      where e.id = exercise_id and w.user_id = auth.uid()
    )
  );

create policy "sets: update own"
  on public.sets for update
  using (
    exists (
      select 1 from public.exercises e
      join public.workouts w on w.id = e.workout_id
      where e.id = exercise_id and w.user_id = auth.uid()
    )
  );

create policy "sets: delete own"
  on public.sets for delete
  using (
    exists (
      select 1 from public.exercises e
      join public.workouts w on w.id = e.workout_id
      where e.id = exercise_id and w.user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────
-- STREAKS policies
-- ────────────────────────────────────────────────────────────
create policy "streaks: select own"
  on public.streaks for select
  using (auth.uid() = user_id);

create policy "streaks: update own"
  on public.streaks for update
  using (auth.uid() = user_id);

create policy "streaks: insert own"
  on public.streaks for insert
  with check (auth.uid() = user_id);
