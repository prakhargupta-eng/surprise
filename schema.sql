-- Run this in Supabase → SQL Editor before deploying.

create table if not exists birthday_events (
  id bigint generated always as identity primary key,
  type text not null check (type in ('name_entry', 'quiz', 'gift')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Optional: enable Row Level Security and lock the table down.
-- The API uses the service_role key, which bypasses RLS, so this
-- just makes sure no one can read/write the table directly from the browser.
alter table birthday_events enable row level security;
