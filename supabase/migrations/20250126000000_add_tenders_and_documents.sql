-- Create tenders table
create table public.tenders (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  date date not null,
  deadline date not null,
  budget text,
  status text default 'current' check (status in ('current', 'past', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_id uuid references auth.users(id) on delete set null,
  -- File references stored in Supabase Storage
  announcement_pdf_path text, -- Path in storage bucket
  tender_documents_path text -- Path in storage bucket (can be folder)
);

-- Create documents table for downloadable forms/documents
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  category text not null check (category in ('Ύδρευση', 'Αποχέτευση', 'Γενικά', 'Οικονομικά')),
  icon_name text, -- Name of lucide-react icon to use
  file_path text not null, -- Path in storage bucket
  file_name text not null, -- Original filename
  file_size bigint, -- Size in bytes
  file_type text, -- MIME type (e.g., 'application/pdf')
  download_count integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_id uuid references auth.users(id) on delete set null,
  display_order integer default 0 -- For ordering documents in UI
);

-- Enable Row Level Security
alter table public.tenders enable row level security;
alter table public.documents enable row level security;

-- RLS Policies for tenders
-- Everyone can view tenders
create policy "Tenders are viewable by everyone" on public.tenders
  for select using (true);

-- Only authenticated users (admins) can insert/update/delete
create policy "Tenders are insertable by authenticated users" on public.tenders
  for insert with check (auth.role() = 'authenticated');

create policy "Tenders are updatable by authenticated users" on public.tenders
  for update using (auth.role() = 'authenticated');

create policy "Tenders are deletable by authenticated users" on public.tenders
  for delete using (auth.role() = 'authenticated');

-- RLS Policies for documents
-- Everyone can view active documents
create policy "Documents are viewable by everyone" on public.documents
  for select using (is_active = true or auth.role() = 'authenticated');

-- Only authenticated users (admins) can insert/update/delete
create policy "Documents are insertable by authenticated users" on public.documents
  for insert with check (auth.role() = 'authenticated');

create policy "Documents are updatable by authenticated users" on public.documents
  for update using (auth.role() = 'authenticated');

create policy "Documents are deletable by authenticated users" on public.documents
  for delete using (auth.role() = 'authenticated');

-- Create triggers for updated_at
create trigger handle_updated_at_tenders
  before update on public.tenders
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_documents
  before update on public.documents
  for each row execute procedure public.handle_updated_at();

-- Create indexes for better performance
create index tenders_status_idx on public.tenders(status);
create index tenders_date_idx on public.tenders(date desc);
create index tenders_deadline_idx on public.tenders(deadline);
create index documents_category_idx on public.documents(category);
create index documents_is_active_idx on public.documents(is_active);
create index documents_display_order_idx on public.documents(display_order);

-- Create storage buckets for file uploads
-- Note: These need to be created manually in Supabase Dashboard or via Supabase CLI
-- But we'll add the SQL here for reference:
-- insert into storage.buckets (id, name, public) values ('tenders', 'tenders', true);
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', true);

-- Storage policies for tenders bucket
-- Allow public read access
-- create policy "Public Access" on storage.objects for select using (bucket_id = 'tenders');
-- Allow authenticated users to upload
-- create policy "Authenticated users can upload" on storage.objects for insert with check (bucket_id = 'tenders' and auth.role() = 'authenticated');
-- Allow authenticated users to update/delete their own files
-- create policy "Authenticated users can update" on storage.objects for update using (bucket_id = 'tenders' and auth.role() = 'authenticated');
-- create policy "Authenticated users can delete" on storage.objects for delete using (bucket_id = 'tenders' and auth.role() = 'authenticated');

-- Storage policies for documents bucket
-- Allow public read access
-- create policy "Public Access" on storage.objects for select using (bucket_id = 'documents');
-- Allow authenticated users to upload
-- create policy "Authenticated users can upload" on storage.objects for insert with check (bucket_id = 'documents' and auth.role() = 'authenticated');
-- Allow authenticated users to update/delete their own files
-- create policy "Authenticated users can update" on storage.objects for update using (bucket_id = 'documents' and auth.role() = 'authenticated');
-- create policy "Authenticated users can delete" on storage.objects for delete using (bucket_id = 'documents' and auth.role() = 'authenticated');
