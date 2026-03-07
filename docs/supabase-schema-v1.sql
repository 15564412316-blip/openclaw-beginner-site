-- OpenClaw Beginner Site - Supabase Schema (v1)
-- Date: 2026-03-07
-- Usage:
-- 1) Open Supabase SQL Editor
-- 2) Paste and run this file
-- 3) Verify tables are created in public schema

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_plan') then
    create type order_plan as enum ('free_0', 'auto_49', 'vip_99');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_channel') then
    create type order_channel as enum ('wechat', 'alipay');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('pending_payment', 'pending_review', 'paid_confirmed', 'rejected', 'refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'install_mode') then
    create type install_mode as enum ('manual', 'auto', 'vip_done_for_you');
  end if;
  if not exists (select 1 from pg_type where typname = 'install_status') then
    create type install_status as enum ('created', 'running', 'success', 'failed', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'ticket_status') then
    create type ticket_status as enum ('open', 'processing', 'resolved', 'closed');
  end if;
end $$;

-- ---------- Core Tables ----------
create table if not exists public.waitlist_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  wechat text,
  source_page text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  email text not null,
  wechat text,
  plan order_plan not null,
  amount numeric(10,2) not null check (amount >= 0),
  channel order_channel not null,
  payer_note text,
  status order_status not null default 'pending_review',
  reviewed_by text,
  reviewed_note text,
  reviewed_at timestamptz,
  paid_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.install_sessions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  email text not null,
  mode install_mode not null,
  os text,
  status install_status not null default 'created',
  current_step text,
  error_message text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.install_checks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.install_sessions(id) on delete cascade,
  step_key text not null,
  step_label text not null,
  passed boolean not null,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  session_id uuid references public.install_sessions(id) on delete set null,
  email text not null,
  title text not null,
  description text not null,
  status ticket_status not null default 'open',
  resolution_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_chat_usage_daily (
  id uuid primary key default gen_random_uuid(),
  usage_date date not null,
  email text,
  client_id text,
  used_count int not null default 0 check (used_count >= 0),
  limit_count int not null default 10 check (limit_count > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

-- ---------- Indexes ----------
create index if not exists idx_waitlist_leads_email on public.waitlist_leads(email);
create index if not exists idx_orders_email on public.orders(email);
create index if not exists idx_orders_status_created on public.orders(status, created_at desc);
create index if not exists idx_install_sessions_email on public.install_sessions(email);
create index if not exists idx_install_sessions_status on public.install_sessions(status, created_at desc);
create index if not exists idx_install_checks_session on public.install_checks(session_id, created_at);
create index if not exists idx_support_tickets_email on public.support_tickets(email);
create index if not exists idx_support_tickets_status on public.support_tickets(status, created_at desc);
create index if not exists idx_ai_chat_usage_daily_key on public.ai_chat_usage_daily(usage_date, email, client_id);
create unique index if not exists idx_ai_chat_usage_daily_unique_expr
on public.ai_chat_usage_daily(usage_date, coalesce(email, ''), coalesce(client_id, ''));
create index if not exists idx_app_users_phone on public.app_users(phone);
create index if not exists idx_app_users_last_login on public.app_users(last_login_at desc);
create index if not exists idx_auth_login_events_phone on public.auth_login_events(phone, created_at desc);
create index if not exists idx_auth_login_events_user_id on public.auth_login_events(user_id, created_at desc);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists trg_install_sessions_updated_at on public.install_sessions;
create trigger trg_install_sessions_updated_at
before update on public.install_sessions
for each row execute function public.set_updated_at();

drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at
before update on public.support_tickets
for each row execute function public.set_updated_at();

drop trigger if exists trg_ai_chat_usage_daily_updated_at on public.ai_chat_usage_daily;
create trigger trg_ai_chat_usage_daily_updated_at
before update on public.ai_chat_usage_daily
for each row execute function public.set_updated_at();

drop trigger if exists trg_app_users_updated_at on public.app_users;
create trigger trg_app_users_updated_at
before update on public.app_users
for each row execute function public.set_updated_at();

-- ---------- RLS ----------
alter table public.waitlist_leads enable row level security;
alter table public.orders enable row level security;
alter table public.install_sessions enable row level security;
alter table public.install_checks enable row level security;
alter table public.support_tickets enable row level security;
alter table public.ai_chat_usage_daily enable row level security;
alter table public.app_users enable row level security;
alter table public.auth_login_events enable row level security;

-- Service-role handles admin write/read. Public direct table access is denied by default.
-- Add explicit policies later when user login is enabled.
