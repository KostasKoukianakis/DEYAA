-- Fix public contact form: ensure table, RLS policies, and anon insert work.
-- Safe to run multiple times in Supabase SQL Editor.

create extension if not exists "uuid-ossp";

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create table if not exists public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  topic text not null,
  supply_number text,
  address text,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'in_progress', 'resolved', 'archived')),
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contact_messages enable row level security;

drop policy if exists "Contact messages are insertable by everyone" on public.contact_messages;
create policy "Contact messages are insertable by everyone" on public.contact_messages
  for insert
  with check (true);

drop policy if exists "Authenticated users can view contact messages" on public.contact_messages;
create policy "Authenticated users can view contact messages" on public.contact_messages
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can update contact messages" on public.contact_messages;
create policy "Authenticated users can update contact messages" on public.contact_messages
  for update
  to authenticated
  using (true);

drop policy if exists "Authenticated users can delete contact messages" on public.contact_messages;
create policy "Authenticated users can delete contact messages" on public.contact_messages
  for delete
  to authenticated
  using (true);

grant usage on schema public to anon, authenticated;
grant select, insert on table public.contact_messages to anon;
grant select, insert, update, delete on table public.contact_messages to authenticated;

drop trigger if exists handle_updated_at_contact_messages on public.contact_messages;
create trigger handle_updated_at_contact_messages
  before update on public.contact_messages
  for each row execute procedure public.handle_updated_at();

create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
