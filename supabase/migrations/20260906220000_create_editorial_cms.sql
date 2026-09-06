create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  content text not null default '',
  category text not null check (category in ('viajes', 'libros', 'arte', 'historia', 'peliculas', 'reflexiones')),
  tags text[] not null default '{}',
  cover_image text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_publication_idx on public.posts (status, published_at desc);
create index if not exists posts_author_idx on public.posts (created_by, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

alter table public.posts enable row level security;
revoke all on table public.posts from anon, authenticated;
grant select on table public.posts to anon;
grant select, insert, update, delete on table public.posts to authenticated;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
on public.posts for select
to anon, authenticated
using (status = 'published' and published_at is not null and published_at <= now());

drop policy if exists "Authors can read their posts" on public.posts;
create policy "Authors can read their posts"
on public.posts for select
to authenticated
using ((select auth.uid()) = created_by);

drop policy if exists "Authors can create posts" on public.posts;
create policy "Authors can create posts"
on public.posts for insert
to authenticated
with check ((select auth.uid()) = created_by);

drop policy if exists "Authors can update their posts" on public.posts;
create policy "Authors can update their posts"
on public.posts for update
to authenticated
using ((select auth.uid()) = created_by)
with check ((select auth.uid()) = created_by);

drop policy if exists "Authors can delete their posts" on public.posts;
create policy "Authors can delete their posts"
on public.posts for delete
to authenticated
using ((select auth.uid()) = created_by);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view post images" on storage.objects;
create policy "Public can view post images"
on storage.objects for select
to public
using (bucket_id = 'post-images');

drop policy if exists "Authors can upload post images" on storage.objects;
create policy "Authors can upload post images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Authors can update post images" on storage.objects;
create policy "Authors can update post images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Authors can delete post images" on storage.objects;
create policy "Authors can delete post images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

