-- Allow anonymous users to submit problem reports from the public site.
-- Existing policy only allowed authenticated users; this enables anon inserts.

-- Drop old policy name if it exists (initial schema).
drop policy if exists "Problems are insertable by authenticated users" on public.problems;

-- Create a new permissive insert policy for everyone (anon + authenticated).
create policy "Problems are insertable by everyone" on public.problems
  for insert with check (true);

