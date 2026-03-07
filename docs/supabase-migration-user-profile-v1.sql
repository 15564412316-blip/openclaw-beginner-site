-- Migration for user profile email binding
-- Date: 2026-03-07

alter table public.app_users
  add column if not exists preferred_email text;

create index if not exists idx_app_users_preferred_email on public.app_users(preferred_email);
