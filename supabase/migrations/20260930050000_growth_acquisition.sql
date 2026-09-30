-- CompanyForge growth, acquisition, targeting, trend, publication and ad-account state.
-- Applied to the live Supabase project and kept here as the repository schema record.

create table if not exists public.growth_target_profiles (
 id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade,
 model text not null, customer_description text not null, dimensions jsonb not null default '[]'::jsonb,
 buyer_roles jsonb not null default '[]'::jsonb, hypotheses jsonb not null default '[]'::jsonb,
 exclusions jsonb not null default '[]'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.trend_signals (
 id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade,
 topic text not null, source text not null, geography text, category text,
 direction text not null check(direction in ('rising','stable','falling')), evidence jsonb not null default '[]'::jsonb,
 confidence numeric(5,4) not null default .5 check(confidence between 0 and 1), observed_at timestamptz not null, created_at timestamptz not null default now()
);
create table if not exists public.acquisition_campaigns (
 id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade,
 channel text not null, mode text not null check(mode in ('organic','paid','listing','partnership')),
 objective text not null, audience jsonb not null default '{}'::jsonb, offer text not null,
 destination_url text, budget numeric(14,2) not null default 0, currency text not null default 'USD',
 status text not null default 'planned' check(status in ('planned','awaiting_approval','approved','submitted','active','paused','completed','failed')),
 evidence jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.acquisition_events (
 id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade,
 campaign_id uuid references public.acquisition_campaigns(id) on delete set null, channel text not null, event_type text not null,
 source text, medium text, campaign text, content text, visitor_id text, value numeric(14,2), currency text,
 metadata jsonb not null default '{}'::jsonb, occurred_at timestamptz not null default now()
);
create table if not exists public.social_publications (
 id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade,
 campaign_id uuid references public.acquisition_campaigns(id) on delete set null, channel text not null, content jsonb not null,
 status text not null default 'draft' check(status in ('draft','awaiting_approval','approved','submitted','published','failed')),
 external_post_id text, evidence jsonb not null default '{}'::jsonb, published_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.ad_platform_accounts (
 id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade,
 platform text not null, external_account_id text,
 status text not null default 'not_connected' check(status in ('not_connected','connected','needs_reauth','disabled')),
 capabilities jsonb not null default '[]'::jsonb, metadata jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(company_id,platform)
);

create index if not exists growth_target_profiles_company_idx on public.growth_target_profiles(company_id);
create index if not exists trend_signals_company_observed_idx on public.trend_signals(company_id,observed_at desc);
create index if not exists acquisition_campaigns_company_status_idx on public.acquisition_campaigns(company_id,status);
create index if not exists acquisition_events_company_time_idx on public.acquisition_events(company_id,occurred_at desc);
create index if not exists social_publications_company_status_idx on public.social_publications(company_id,status);
create index if not exists ad_platform_accounts_company_idx on public.ad_platform_accounts(company_id);

alter table public.growth_target_profiles enable row level security;
alter table public.trend_signals enable row level security;
alter table public.acquisition_campaigns enable row level security;
alter table public.acquisition_events enable row level security;
alter table public.social_publications enable row level security;
alter table public.ad_platform_accounts enable row level security;

create policy growth_target_profiles_owner on public.growth_target_profiles for all to authenticated
using (exists(select 1 from public.companies c where c.id=growth_target_profiles.company_id and c.owner_id=(select auth.uid())))
with check (exists(select 1 from public.companies c where c.id=growth_target_profiles.company_id and c.owner_id=(select auth.uid())));
create policy trend_signals_owner on public.trend_signals for all to authenticated
using (exists(select 1 from public.companies c where c.id=trend_signals.company_id and c.owner_id=(select auth.uid())))
with check (exists(select 1 from public.companies c where c.id=trend_signals.company_id and c.owner_id=(select auth.uid())));
create policy acquisition_campaigns_owner on public.acquisition_campaigns for all to authenticated
using (exists(select 1 from public.companies c where c.id=acquisition_campaigns.company_id and c.owner_id=(select auth.uid())))
with check (exists(select 1 from public.companies c where c.id=acquisition_campaigns.company_id and c.owner_id=(select auth.uid())));
create policy acquisition_events_owner on public.acquisition_events for all to authenticated
using (exists(select 1 from public.companies c where c.id=acquisition_events.company_id and c.owner_id=(select auth.uid())))
with check (exists(select 1 from public.companies c where c.id=acquisition_events.company_id and c.owner_id=(select auth.uid())));
create policy social_publications_owner on public.social_publications for all to authenticated
using (exists(select 1 from public.companies c where c.id=social_publications.company_id and c.owner_id=(select auth.uid())))
with check (exists(select 1 from public.companies c where c.id=social_publications.company_id and c.owner_id=(select auth.uid())));
create policy ad_platform_accounts_owner on public.ad_platform_accounts for all to authenticated
using (exists(select 1 from public.companies c where c.id=ad_platform_accounts.company_id and c.owner_id=(select auth.uid())))
with check (exists(select 1 from public.companies c where c.id=ad_platform_accounts.company_id and c.owner_id=(select auth.uid())));

grant select,insert,update,delete on public.growth_target_profiles,public.trend_signals,public.acquisition_campaigns,public.acquisition_events,public.social_publications,public.ad_platform_accounts to authenticated;
