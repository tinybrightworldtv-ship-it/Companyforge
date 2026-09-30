create table if not exists public.website_preview_builds (
 id uuid primary key default gen_random_uuid(),
 website_build_id uuid not null references public.website_builds(id) on delete cascade,
 status text not null default 'queued' check (status in ('queued','building','passed','failed','expired')),
 build_command text not null default 'npm run build',
 build_log text,
 preview_url text,
 commit_sha text,
 evidence jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.website_preview_builds enable row level security;
create policy "website_preview_builds_owner_select" on public.website_preview_builds for select using (exists (select 1 from public.website_builds wb join public.companies c on c.id=wb.company_id where wb.id=website_preview_builds.website_build_id and c.owner_id=auth.uid()));
create policy "website_preview_builds_owner_insert" on public.website_preview_builds for insert with check (exists (select 1 from public.website_builds wb join public.companies c on c.id=wb.company_id where wb.id=website_preview_builds.website_build_id and c.owner_id=auth.uid()));
create policy "website_preview_builds_owner_update" on public.website_preview_builds for update using (exists (select 1 from public.website_builds wb join public.companies c on c.id=wb.company_id where wb.id=website_preview_builds.website_build_id and c.owner_id=auth.uid()));
create index if not exists website_preview_builds_website_idx on public.website_preview_builds(website_build_id,created_at desc);