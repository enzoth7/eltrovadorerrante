create table if not exists public.location_content (
  content_key text primary key,
  country_slug text not null,
  place_slug text,
  country_name text not null,
  place_name text,
  description text not null default '',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint location_content_place_pair_check check (
    (place_slug is null and place_name is null)
    or (place_slug is not null and place_name is not null)
  ),
  constraint location_content_description_length_check check (char_length(description) <= 4000)
);

create index if not exists location_content_country_idx
on public.location_content (country_slug);

create unique index if not exists location_content_country_place_idx
on public.location_content (country_slug, coalesce(place_slug, ''));

drop trigger if exists location_content_set_updated_at on public.location_content;
create trigger location_content_set_updated_at
before update on public.location_content
for each row execute function public.set_updated_at();

alter table public.location_content enable row level security;
revoke all on table public.location_content from anon, authenticated;
grant select on table public.location_content to anon, authenticated;
grant insert, update on table public.location_content to authenticated;

drop policy if exists "Public can read location content" on public.location_content;
create policy "Public can read location content"
on public.location_content for select
to anon, authenticated
using (true);

drop policy if exists "Authors can create location content" on public.location_content;
create policy "Authors can create location content"
on public.location_content for insert
to authenticated
with check ((select auth.uid()) = created_by);

drop policy if exists "Authors can update location content" on public.location_content;
create policy "Authors can update location content"
on public.location_content for update
to authenticated
using ((select auth.uid()) = created_by)
with check ((select auth.uid()) = created_by);
