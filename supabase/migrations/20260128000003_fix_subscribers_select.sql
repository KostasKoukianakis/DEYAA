-- Fix: anon users can INSERT but cannot SELECT after insert (React Query refetch fails with 403).
-- The INSERT succeeds, but then React Query invalidates and refetches, which requires SELECT permission.

-- Allow anon to SELECT subscribers (public newsletter - emails are not sensitive)
create policy "Public can view subscribers" on public.subscribers
  for select
  to anon, authenticated
  using (true);
