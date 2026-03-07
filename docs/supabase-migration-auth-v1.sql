-- Migration for phone login persistence (run once on existing Supabase project)
-- Date: 2026-03-07

create extension if not exists "pgcrypto";

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  status text not null default 'active',
  first_login_at timestamptz not null default now(),
  last_login_at timestamptz not null default now(),
  login_count int not null default 1 check (login_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.auth_login_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.app_users(id) on delete set null,
  phone text not null,
  success boolean not null default true,
  ip text,
  user_agent text,
  source text not null default 'phone_otp',
  created_at timestamptz not null default now()
);

create index if not exists idx_app_users_phone on public.app_users(phone);
create index if not exists idx_app_users_last_login on public.app_users(last_login_at desc);
create index if not exists idx_auth_login_events_phone on public.auth_login_events(phone, created_at desc);
create index if not exists idx_auth_login_events_user_id on public.auth_login_events(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_app_users_updated_at on public.app_users;
create trigger trg_app_users_updated_at
before update on public.app_users
for each row execute function public.set_updated_at();

alter table public.app_users enable row level security;
alter table public.auth_login_events enable row level security;
