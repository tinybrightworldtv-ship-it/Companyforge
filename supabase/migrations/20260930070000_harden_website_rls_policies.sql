drop policy if exists website_build_files_owner_insert on public.website_build_files;
drop policy if exists website_build_files_owner_select on public.website_build_files;
drop policy if exists website_build_files_owner_update on public.website_build_files;
create policy website_build_files_owner_insert on public.website_build_files
  for insert to authenticated
  with check (exists (
    select 1 from public.website_builds wb
    join public.companies c on c.id=wb.company_id
    where wb.id=website_build_files.website_build_id and c.owner_id=(select auth.uid())
  ));
create policy website_build_files_owner_select on public.website_build_files
  for select to authenticated
  using (exists (
    select 1 from public.website_builds wb
    join public.companies c on c.id=wb.company_id
    where wb.id=website_build_files.website_build_id and c.owner_id=(select auth.uid())
  ));
create policy website_build_files_owner_update on public.website_build_files
  for update to authenticated
  using (exists (
    select 1 from public.website_builds wb
    join public.companies c on c.id=wb.company_id
    where wb.id=website_build_files.website_build_id and c.owner_id=(select auth.uid())
  ))
  with check (exists (
    select 1 from public.website_builds wb
    join public.companies c on c.id=wb.company_id
    where wb.id=website_build_files.website_build_id and c.owner_id=(select auth.uid())
  ));

drop policy if exists website_preview_builds_owner_insert on public.website_preview_builds;
drop policy if exists website_preview_builds_owner_select on public.website_preview_builds;
drop policy if exists website_preview_builds_owner_update on public.website_preview_builds;
create policy website_preview_builds_owner_insert on public.website_preview_builds
  for insert to authenticated
  with check (exists (
    select 1 from public.website_builds wb
    join public.companies c on c.id=wb.company_id
    where wb.id=website_preview_builds.website_build_id and c.owner_id=(select auth.uid())
  ));
create policy website_preview_builds_owner_select on public.website_preview_builds
  for select to authenticated
  using (exists (
    select 1 from public.website_builds wb
    join public.companies c on c.id=wb.company_id
    where wb.id=website_preview_builds.website_build_id and c.owner_id=(select auth.uid())
  ));
create policy website_preview_builds_owner_update on public.website_preview_builds
  for update to authenticated
  using (exists (
    select 1 from public.website_builds wb
    join public.companies c on c.id=wb.company_id
    where wb.id=website_preview_builds.website_build_id and c.owner_id=(select auth.uid())
  ))
  with check (exists (
    select 1 from public.website_builds wb
    join public.companies c on c.id=wb.company_id
    where wb.id=website_preview_builds.website_build_id and c.owner_id=(select auth.uid())
  ));
