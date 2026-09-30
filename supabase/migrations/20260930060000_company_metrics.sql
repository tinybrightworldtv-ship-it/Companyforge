create table if not exists public.company_metric_events (
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 event_type text not null,
 value numeric(14,2),
 currency text,
 source text,
 metadata jsonb not null default '{}'::jsonb,
 occurred_at timestamptz not null default now()
);
create index if not exists company_metric_events_company_time_idx on public.company_metric_events(company_id,occurred_at desc);
create index if not exists company_metric_events_company_type_idx on public.company_metric_events(company_id,event_type);
alter table public.company_metric_events enable row level security;
create policy company_metric_events_owner on public.company_metric_events for all to authenticated
using (exists(select 1 from public.companies c where c.id=company_metric_events.company_id and c.owner_id=(select auth.uid())))
with check (exists(select 1 from public.companies c where c.id=company_metric_events.company_id and c.owner_id=(select auth.uid())));
grant select,insert,update,delete on public.company_metric_events to authenticated;