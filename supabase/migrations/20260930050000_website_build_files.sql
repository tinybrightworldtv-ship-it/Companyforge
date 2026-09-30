create table if not exists public.website_build_files (
 id uuid primary key default gen_random_uuid(),
 website_build_id uuid not null references public.website_builds(id) on delete cascade,
 path text not null,
 purpose text,
 content text not null,
 content_hash text,
 status text not null default 'generated' check (status in ('generated','validated','rejected','deployed')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(website_build_id,path)
);
alter table public.website_build_files enable row level security;
create policy "website_build_files_owner_select" on public.website_build_files for select using (exists (select 1 from public.website_builds wb join public.companies c on c.id=wb.company_id where wb.id=website_build_files.website_build_id and c.owner_id=auth.uid()));
create policy "website_build_files_owner_insert" on public.website_build_files for insert with check (exists (select 1 from public.website_builds wb join public.companies c on c.id=wb.company_id where wb.id=website_build_files.website_build_id and c.owner_id=auth.uid()));
create policy "website_build_files_owner_update" on public.website_build_files for update using (exists (select 1 from public.website_builds wb join public.companies c on c.id=wb.company_id where wb.id=website_build_files.website_build_id and c.owner_id=auth.uid()));
create index if not exists website_build_files_build_idx on public.website_build_files(website_build_id);