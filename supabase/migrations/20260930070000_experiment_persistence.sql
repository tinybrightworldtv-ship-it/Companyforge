-- CompanyForge persistent experiment state.
-- Applied to the live Supabase project and kept here as the repository schema record.

create table if not exists public.experiments (
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 name text not null,
 hypothesis text not null,
 metric text not null,
 baseline numeric not null default 0,
 target numeric not null,
 status text not null default 'proposed' check(status in ('proposed','running','validated','invalidated','stopped')),
 owner_agent text,
 started_at timestamptz,
 ended_at timestamptz,
 recommendation text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.experiment_metric_points (
 id uuid primary key default gen_random_uuid(),
 experiment_id uuid not null references public.experiments(id) on delete cascade,
 metric text not null,
 value numeric not null,
 source text not null,
 metadata jsonb not null default '{}'::jsonb,
 observed_at timestamptz not null default now()
);
create index if not exists experiments_company_status_idx on public.experiments(company_id,status);
create index if not exists experiment_metric_points_experiment_time_idx on public.experiment_metric_points(experiment_id,observed_at desc);
alter table public.experiments enable row level security;
alter table public.experiment_metric_points enable row level security;
create policy experiments_owner on public.experiments for all to authenticated
using (exists(select 1 from public.companies c where c.id=experiments.company_id and c.owner_id=(select auth.uid())))
with check (exists(select 1 from public.companies c where c.id=experiments.company_id and c.owner_id=(select auth.uid())));
create policy experiment_metric_points_owner on public.experiment_metric_points for all to authenticated
using (exists(select 1 from public.experiments e join public.companies c on c.id=e.company_id where e.id=experiment_metric_points.experiment_id and c.owner_id=(select auth.uid())))
with check (exists(select 1 from public.experiments e join public.companies c on c.id=e.company_id where e.id=experiment_metric_points.experiment_id and c.owner_id=(select auth.uid())));
grant select,insert,update,delete on public.experiments,public.experiment_metric_points to authenticated;
