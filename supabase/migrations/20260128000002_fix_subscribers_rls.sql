-- Hard reset for subscribers RLS & privileges.
-- Use if you still see: "new row violates row level security policy for table 'subscribers'"

alter table public.subscribers enable row level security;

-- Drop ALL existing policies for this table (safe)
drop policy if exists "Subscribers can view their own data" on public.subscribers;
drop policy if exists "Anyone can subscribe" on public.subscribers;
drop policy if exists "Users can update their own subscription" on public.subscribers;
drop policy if exists "Admins can manage all subscribers" on public.subscribers;
drop policy if exists "Public can subscribe" on public.subscribers;
drop policy if exists "Public insert subscribers" on public.subscribers;

-- Ensure API roles have privileges (usually already true, but safe to include)
grant select, insert, update on table public.subscribers to anon, authenticated;

-- Public insert: anyone can subscribe
create policy "Anyone can subscribe" on public.subscribers
  for insert
  to anon, authenticated
  with check (true);

-- Users can view/update their own row by email (works when authenticated)
create policy "Subscribers can view their own data" on public.subscribers
  for select
  to authenticated
  using (auth.jwt() ->> 'email' = email);

create policy "Users can update their own subscription" on public.subscribers
  for update
  to authenticated
  using (auth.jwt() ->> 'email' = email);

-- Admins can manage all subscribers (requires custom JWT role claim = 'admin')
create policy "Admins can manage all subscribers" on public.subscribers
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

