-- 1. Roles enum and table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer to avoid recursive RLS
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Policies on user_roles
create policy "Users can view own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 2. Tighten uploaded_videos: keep public read, restrict writes to admins
drop policy if exists "Anyone can insert videos" on public.uploaded_videos;
drop policy if exists "Anyone can delete videos" on public.uploaded_videos;

create policy "Admins can insert videos"
  on public.uploaded_videos for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete videos"
  on public.uploaded_videos for delete
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update videos"
  on public.uploaded_videos for update
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 3. Tighten uploaded_files: keep public read, restrict writes to admins
drop policy if exists "Anyone can insert files" on public.uploaded_files;
drop policy if exists "Anyone can delete files" on public.uploaded_files;

create policy "Admins can insert files"
  on public.uploaded_files for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete files"
  on public.uploaded_files for delete
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update files"
  on public.uploaded_files for update
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 4. Tighten storage.objects for the 'uploads' bucket: public read, admin write
drop policy if exists "Public insert uploads" on storage.objects;
drop policy if exists "Public delete uploads" on storage.objects;

create policy "Admins can upload to uploads bucket"
  on storage.objects for insert
  with check (bucket_id = 'uploads' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete from uploads bucket"
  on storage.objects for delete
  using (bucket_id = 'uploads' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update uploads bucket"
  on storage.objects for update
  using (bucket_id = 'uploads' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'uploads' and public.has_role(auth.uid(), 'admin'));