-- Fix: Allow anonymous users to verify email subscriptions using verification_token
-- Run this SQL in Supabase SQL Editor

-- Step 1: Ensure anon has UPDATE privilege
grant update on table public.subscribers to anon;

-- Step 2: Drop existing policy if it exists
drop policy if exists "Anon can verify subscription with token" on public.subscribers;

-- Step 3: Create policy for anon users to update subscribers when verification_token exists
-- The .eq('verification_token', token) filter in the query will match the specific token
create policy "Anon can verify subscription with token" on public.subscribers
  for update
  to anon
  using (
    -- Allow update when verification_token exists (the .eq() filter ensures correct token match)
    verification_token IS NOT NULL
  )
  with check (true);
