-- ============================================================
-- CAT Preparation — Seed Data (Default Schedule)
-- Run after cat_schema.sql and cat_policies.sql
-- Replace <USER_ID> with an actual user UUID for testing
-- ============================================================

-- Default schedule seed (insert for a specific user — use in dev only)
-- In production, the app inserts the default schedule on first login.

-- Example seed (replace <USER_ID> with actual UUID):
/*
insert into public.cat_schedule (user_id, day, time_slot, task, subject) values
  ('<USER_ID>', 'Mon', '8:00 AM – 10:00 AM',   'VARC Study + DPP',          'VARC'),
  ('<USER_ID>', 'Mon', '10:00 AM – 11:30 AM',  'LRDI timed sets',           'LRDI'),
  ('<USER_ID>', 'Mon', '12:30 PM – 1:30 PM',   'QUANT DPP',                 'QUANT'),
  ('<USER_ID>', 'Mon', '8:00 PM – 10:00 PM',   'PW Live class',             'Other'),

  ('<USER_ID>', 'Tue', '8:00 AM – 10:00 AM',   'LRDI Study + DPP',         'LRDI'),
  ('<USER_ID>', 'Tue', '10:00 AM – 11:30 AM',  'QUANT drills',              'QUANT'),
  ('<USER_ID>', 'Tue', '12:30 PM – 1:30 PM',   'VARC vocabulary/PJ',        'VARC'),
  ('<USER_ID>', 'Tue', '8:00 PM – 10:00 PM',   'PW Live class',             'Other'),

  ('<USER_ID>', 'Wed', '8:00 AM – 10:00 AM',   'QUANT Study + DPP',        'QUANT'),
  ('<USER_ID>', 'Wed', '10:00 AM – 11:30 AM',  'VARC RC practice',          'VARC'),
  ('<USER_ID>', 'Wed', '12:30 PM – 1:30 PM',   'LRDI DPP',                 'LRDI'),
  ('<USER_ID>', 'Wed', '8:00 PM – 10:00 PM',   'PW Live class',             'Other'),

  ('<USER_ID>', 'Thu', '8:00 AM – 10:00 AM',   'VARC Study + DPP',         'VARC'),
  ('<USER_ID>', 'Thu', '10:00 AM – 11:30 AM',  'LRDI timed sets',          'LRDI'),
  ('<USER_ID>', 'Thu', '12:30 PM – 1:30 PM',   'QUANT revision',           'QUANT'),
  ('<USER_ID>', 'Thu', '8:00 PM – 10:00 PM',   'PW Live class',            'Other'),

  ('<USER_ID>', 'Fri', '8:00 AM – 10:00 AM',   'LRDI Study + DPP',        'LRDI'),
  ('<USER_ID>', 'Fri', '10:00 AM – 11:30 AM',  'QUANT drills',             'QUANT'),
  ('<USER_ID>', 'Fri', '12:30 PM – 1:30 PM',   'VARC DPP',                 'VARC'),
  ('<USER_ID>', 'Fri', '8:00 PM – 10:00 PM',   'PW Live class',            'Other'),

  ('<USER_ID>', 'Sat', '8:00 AM – 10:00 AM',   'Catch-up pending DPP',     'Other'),
  ('<USER_ID>', 'Sat', '10:00 AM – 11:30 AM',  'LRDI intensive sets',      'LRDI'),
  ('<USER_ID>', 'Sat', '12:30 PM – 1:30 PM',   'QUANT weak chapters',      'QUANT'),
  ('<USER_ID>', 'Sat', '8:00 PM – 10:00 PM',   'PW Live class',            'Other'),

  ('<USER_ID>', 'Sun', '8:00 AM – 10:00 AM',   'Mock / Sectional test',    'Mock'),
  ('<USER_ID>', 'Sun', '10:00 AM – 11:30 AM',  'Mock analysis',            'Mock'),
  ('<USER_ID>', 'Sun', '12:30 PM – 1:30 PM',   'Weekly review + planning', 'Review'),
  ('<USER_ID>', 'Sun', '8:00 PM – 10:00 PM',   'Rest/light reading',       'Other');
*/
