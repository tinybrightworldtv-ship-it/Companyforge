-- CompanyForge runtime persistence.
-- This migration mirrors the live runtime state schema created for the CompanyForge project.

create table if not exists public.runtime_tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  parent_task_id uuid references public.runtime_tasks(id) on delete set null,
  objective text not null,
  assigned_agent text not null,
  priority text not null default 'normal' check (priority in ('low','normal','high','critical')),
  inputs jsonb not null default '{}'::jsonb,
  constraints jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  expected_outcome text not null,
  approval_required boolean not null default false,
  approval_status text not null default 'not_required' check (approval_status in ('not_required','pending','approved','rejected')),
  approval_id text,
  status text not null default 'queued' check (status in ('queued','running','blocked','awaiting_approval','completed','failed','cancelled')),
  result jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  agent_id text not null,
  runtime_task_id uuid references public.runtime_tasks(id) on delete set null,
  action text not null,
  permission_level text not null check (permission_level in ('READ','WRITE','EXECUTE','HIGH_IMPACT')),
  scope text not null,
  approval_id text,
  result text not null check (result in ('success','failure','blocked')),
  evidence jsonb not null default '[]'::jsonb,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists runtime_tasks_company_status_idx on public.runtime_tasks(company_id, status);
create index if not exists runtime_tasks_parent_idx on public.runtime_tasks(parent_task_id);
create index if not exists audit_events_company_created_idx on public.audit_events(company_id, created_at desc);
create index if not exists audit_events_runtime_task_idx on public.audit_events(runtime_task_id);

alter table public.runtime_tasks enable row level security;
alter table public.audit_events enable row level security;

create policy runtime_tasks_company_access on public.runtime_tasks
  for all to authenticated
  using (exists (select 1 from public.companies c where c.id = runtime_tasks.company_id and c.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.companies c where c.id = runtime_tasks.company_id and c.owner_id = (select auth.uid())));

create policy audit_events_company_select on public.audit_events
  for select to authenticated
  using (exists (select 1 from public.companies c where c.id = audit_events.company_id and c.owner_id = (select auth.uid())));

create policy audit_events_company_insert on public.audit_events
  for insert to authenticated
  with check (exists (select 1 from public.companies c where c.id = audit_events.company_id and c.owner_id = (select auth.uid())));

grant select, insert, update, delete on public.runtime_tasks to authenticated;
grant select, insert on public.audit_events to authenticated;
