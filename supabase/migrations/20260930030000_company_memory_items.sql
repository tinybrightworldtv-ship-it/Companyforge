create table if not exists public.company_memory_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  memory_type text not null check (memory_type in ('decision','fact','customer','experiment','lesson','preference','metric','document','instruction')),
  memory_key text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  source_task_id uuid references public.runtime_tasks(id) on delete set null,
  source_agent_id text,
  confidence numeric(5,4) not null default 0.5 check (confidence >= 0 and confidence <= 1),
  importance integer not null default 50 check (importance between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(company_id, memory_type, memory_key)
);

create index if not exists company_memory_items_company_idx on public.company_memory_items(company_id);
create index if not exists company_memory_items_type_idx on public.company_memory_items(company_id, memory_type);

alter table public.company_memory_items enable row level security;

create policy company_memory_items_access on public.company_memory_items
for all to authenticated
using (exists (select 1 from public.companies c where c.id = company_memory_items.company_id and c.owner_id = (select auth.uid())))
with check (exists (select 1 from public.companies c where c.id = company_memory_items.company_id and c.owner_id = (select auth.uid())));

grant select, insert, update, delete on public.company_memory_items to authenticated;