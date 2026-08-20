-- Run this in Supabase Dashboard → SQL Editor

create table if not exists public.latest_app (
  id integer primary key check (id = 1),
  app_name text not null,
  version text not null,
  file_path text not null,
  published_at timestamptz not null default now()
);

alter table public.latest_app enable row level security;

create policy "Anyone can read latest release"
on public.latest_app for select
to anon, authenticated
using (true);

create policy "Authenticated users can insert latest release"
on public.latest_app for insert
to authenticated
with check (true);

create policy "Authenticated users can update latest release"
on public.latest_app for update
to authenticated
using (true)
with check (true);

-- Create a PUBLIC Storage bucket named "apks" in the Storage dashboard first.
-- Public users can download. Only authenticated users can upload.
create policy "Authenticated users can upload APKs"
on storage.objects for insert
to authenticated
with check (bucket_id = 'apks');

create policy "Authenticated users can read APK metadata"
on storage.objects for select
to authenticated
using (bucket_id = 'apks');

-- Optional: allow authenticated users to delete old APKs.
create policy "Authenticated users can delete APKs"
on storage.objects for delete
to authenticated
using (bucket_id = 'apks');
