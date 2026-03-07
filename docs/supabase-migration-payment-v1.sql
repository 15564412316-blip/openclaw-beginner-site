-- Migration for hosted checkout flow (run once on existing Supabase project)
-- Date: 2026-03-07

do $$
begin
  if not exists (
    select 1
    from pg_enum
    where enumlabel = 'pending_payment'
      and enumtypid = 'order_status'::regtype
  ) then
    alter type order_status add value 'pending_payment';
  end if;
end $$;

-- Optional: normalize old "pending_review" records as "pending_payment"
-- when they were created by hosted checkout but not yet reviewed.
-- update public.orders
-- set status = 'pending_payment'
-- where status = 'pending_review'
--   and reviewed_by is null;
