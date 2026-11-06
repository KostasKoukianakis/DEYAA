-- Water quality disclosure records (ΚΥΑ Δ1/ΓΠ οικ.27829/2023, ΡΑΑΕΥ)

create table if not exists public.water_quality_records (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  category text not null
    check (category in ('analysis', 'monitoring', 'statistics', 'lab_report', 'education')),
  location text,
  sampling_date date,
  published_at timestamptz,
  file_path text,
  file_name text,
  file_size integer,
  file_type text,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_id uuid references auth.users (id)
);

create index if not exists water_quality_records_published_idx
  on public.water_quality_records (is_published, published_at desc nulls last);

create index if not exists water_quality_records_category_idx
  on public.water_quality_records (category);

alter table public.water_quality_records enable row level security;

drop policy if exists "Water quality published readable by anyone" on public.water_quality_records;
create policy "Water quality published readable by anyone"
  on public.water_quality_records
  for select
  using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "Water quality insert authenticated" on public.water_quality_records;
create policy "Water quality insert authenticated"
  on public.water_quality_records
  for insert
  to authenticated
  with check (true);

drop policy if exists "Water quality update authenticated" on public.water_quality_records;
create policy "Water quality update authenticated"
  on public.water_quality_records
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Water quality delete authenticated" on public.water_quality_records;
create policy "Water quality delete authenticated"
  on public.water_quality_records
  for delete
  to authenticated
  using (true);

drop trigger if exists handle_updated_at_water_quality_records on public.water_quality_records;
create trigger handle_updated_at_water_quality_records
  before update on public.water_quality_records
  for each row execute procedure public.handle_updated_at();

insert into storage.buckets (id, name, public)
values ('water-quality', 'water-quality', true)
on conflict (id) do nothing;

drop policy if exists "Public Access Water Quality" on storage.objects;
create policy "Public Access Water Quality"
  on storage.objects
  for select
  using (bucket_id = 'water-quality');

drop policy if exists "Authenticated upload water quality" on storage.objects;
create policy "Authenticated upload water quality"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'water-quality');

drop policy if exists "Authenticated update water quality" on storage.objects;
create policy "Authenticated update water quality"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'water-quality');

drop policy if exists "Authenticated delete water quality" on storage.objects;
create policy "Authenticated delete water quality"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'water-quality');
