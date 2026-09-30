-- CompanyForge persistent service signals and incidents.
-- Applied to the live Supabase project and kept here as the repository schema record.

create table if not exists public.service_signals (
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 service text not null,
 status text not null check(status in ('healthy','degraded','down')),
 latency_ms integer,
 metadata jsonb not null default '{}'::jsonb,
 observed_at timestamptz not null default now()
);
create table if not exists public.incidents (
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 service text not null,
 severity text not null check(severity in ('info','warning','critical')),
 summary text not null,
 recommended_action text,
 status text not null default 'open' check(status in ('open','resolved')),
 signal_id uuid references public.service_signals(id) on delete set null,
 created_at timestamptz not null default now(),
 resolved_at timestamptz
);
create index if not exists service_signals_company_time_idx on public.service_signals(company_id,observed_at desc);
create index if not exists incidents_company_status_idx on public.incidents(company_id,status,created_at desc);
alter table public.service_signals enable row level security;
alter table public.incidents enable row level security;
create policy service_signals_owner on public.service_signals for all to authenticated
using (exists(select 1 from public.companies c where c.id=service_signals.company_id and c.owner_id=(select auth.uid())))
with check (exists(select 1 from public.companies c where c.id=service_signals.company_id and c.owner_id=(select auth.uid())));
create policy incidents_owner on public.incidents for all to authenticated
using (exists(select 1 from public.companies c where c.id=incidents.company_id and c.owner_id=(select auth.uid())))
with check (exists(select 1 from public.companies c where c.id=incidents.company_id and c.owner_id=(select auth.uid())));
grant select,insert,update,delete on public.service_signals,public.incidents to authenticated;
