-- Allow anonymous users to subscribe from the public site.
-- Fixes: "new row violates row level security policy for table 'subscribers'"

-- Make sure RLS is enabled (safe if already enabled)
alter table public.subscribers enable row level security;

-- Drop potentially conflicting/old policy names
drop policy if exists "Anyone can subscribe" on public.subscribers;
drop policy if exists "Public can subscribe" on public.subscribers;
drop policy if exists "Public insert subscribers" on public.subscribers;

-- Create permissive insert policy for everyone (anon + authenticated)
create policy "Anyone can subscribe" on public.subscribers
  for insert
  with check (true);

