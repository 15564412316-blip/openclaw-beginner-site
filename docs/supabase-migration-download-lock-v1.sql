-- Migration for one-time paid script download
-- Date: 2026-03-07

create table if not exists public.download_claims (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  plan text not null,
  platform text not null check (platform in ('mac', 'win')),
  claimed_at timestamptz not null default now(),
  claimed_ip text,
  claimed_user_agent text
);

create index if not exists idx_download_claims_order_no on public.download_claims(order_no);
create index if not exists idx_download_claims_claimed_at on public.download_claims(claimed_at desc);

alter table public.download_claims enable row level security;
