-- Public bucket for uploads
insert into storage.buckets (id, name, public, file_size_limit)
values ('uploads', 'uploads', true, 524288000)
on conflict (id) do update set public = true, file_size_limit = 524288000;

-- Anyone (incl. anonymous) can read uploads
create policy "Public read uploads"
on storage.objects for select
using (bucket_id = 'uploads');

-- Anyone can upload to the uploads bucket (single-admin portfolio site)
create policy "Public insert uploads"
on storage.objects for insert
with check (bucket_id = 'uploads');

-- Anyone can delete their uploads (single-admin portfolio site)
create policy "Public delete uploads"
on storage.objects for delete
using (bucket_id = 'uploads');

-- Files metadata
create table public.uploaded_files (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  size bigint not null,
  storage_path text not null,
  public_url text not null,
  created_at timestamptz not null default now()
);

alter table public.uploaded_files enable row level security;

create policy "Anyone can read files"
on public.uploaded_files for select using (true);

create policy "Anyone can insert files"
on public.uploaded_files for insert with check (true);

create policy "Anyone can delete files"
on public.uploaded_files for delete using (true);

-- YouTube videos
create table public.uploaded_videos (
  id uuid primary key default gen_random_uuid(),
  youtube_id text not null,
  title text not null,
  tag text,
  created_at timestamptz not null default now()
);

alter table public.uploaded_videos enable row level security;

create policy "Anyone can read videos"
on public.uploaded_videos for select using (true);

create policy "Anyone can insert videos"
on public.uploaded_videos for insert with check (true);

create policy "Anyone can delete videos"
on public.uploaded_videos for delete using (true);