-- ============================================================
-- FitTrack Pro — Database Functions
-- Run AFTER schema.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- FUNCTION: update_streak
-- Called via Supabase RPC after saving a workout
-- ────────────────────────────────────────────────────────────
create or replace function public.update_streak(p_user_id uuid, p_workout_date date default current_date)
returns json language plpgsql security definer as $$
declare
  v_streak     record;
  v_new_streak integer;
  v_new_max    integer;
begin
  -- Fetch current streak record (upsert-safe)
  select * into v_streak
  from public.streaks
  where user_id = p_user_id;

  -- If no streak record, initialize
  if not found then
    insert into public.streaks (user_id, current_streak, max_streak, last_workout_date)
    values (p_user_id, 1, 1, p_workout_date);
    return json_build_object('current_streak', 1, 'max_streak', 1);
  end if;

  -- Already logged today — no change
  if v_streak.last_workout_date = p_workout_date then
    return json_build_object(
      'current_streak', v_streak.current_streak,
      'max_streak',     v_streak.max_streak
    );
  end if;

  -- Consecutive day → increment streak
  if v_streak.last_workout_date = p_workout_date - interval '1 day' then
    v_new_streak := v_streak.current_streak + 1;
  else
    -- Missed day(s) → reset
    v_new_streak := 1;
  end if;

  v_new_max := greatest(v_streak.max_streak, v_new_streak);

  update public.streaks
  set
    current_streak    = v_new_streak,
    max_streak        = v_new_max,
    last_workout_date = p_workout_date,
    updated_at        = now()
  where user_id = p_user_id;

  return json_build_object(
    'current_streak', v_new_streak,
    'max_streak',     v_new_max
  );
end;
$$;

-- ────────────────────────────────────────────────────────────
-- FUNCTION: get_calendar_data
-- Returns workout types for a date range for the calendar widget
-- ────────────────────────────────────────────────────────────
create or replace function public.get_calendar_data(
  p_user_id  uuid,
  p_from     date default (current_date - interval '28 days'),
  p_to       date default current_date
)
returns table(workout_date date, workout_type text)
language sql security definer as $$
  select date as workout_date, type as workout_type
  from public.workouts
  where user_id = p_user_id
    and date >= p_from
    and date <= p_to
  order by date asc;
$$;

-- ────────────────────────────────────────────────────────────
-- FUNCTION: get_weekly_calories
-- Returns last 7 days calorie estimates based on workout type
-- ────────────────────────────────────────────────────────────
create or replace function public.get_weekly_calories(p_user_id uuid)
returns table(workout_date date, calories integer, workout_type text)
language sql security definer as $$
  select
    date as workout_date,
    case type
      when 'cardio' then 300
      when 'push'   then 350
      when 'pull'   then 350
      when 'legs'   then 380
      else 0
    end as calories,
    type as workout_type
  from public.workouts
  where user_id = p_user_id
    and date >= current_date - interval '6 days'
  order by date asc;
$$;

-- ────────────────────────────────────────────────────────────
-- FUNCTION: get_consistency_trend
-- Returns last 30 days as 1/0 for chart
-- ────────────────────────────────────────────────────────────
create or replace function public.get_consistency_trend(p_user_id uuid)
returns table(day date, worked_out boolean)
language sql security definer as $$
  select
    gs.day::date,
    (w.id is not null) as worked_out
  from generate_series(
    current_date - interval '29 days',
    current_date,
    interval '1 day'
  ) as gs(day)
  left join public.workouts w
    on w.date = gs.day::date and w.user_id = p_user_id
  order by gs.day asc;
$$;
