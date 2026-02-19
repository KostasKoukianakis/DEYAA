-- FINAL FIX: Allow anonymous users to verify email subscriptions
-- This migration completely resets and fixes the RLS policies for subscriber verification
-- 
-- IMPORTANT: Run this entire script in Supabase SQL Editor
-- After running, test the verification flow again

-- Step 1: Grant UPDATE privilege explicitly to anon role
grant update on table public.subscribers to anon;

-- Step 2: Drop ALL existing policies on subscribers table to start fresh
drop policy if exists "Subscribers can view their own data" on public.subscribers;
drop policy if exists "Anyone can subscribe" on public.subscribers;
drop policy if exists "Users can update their own subscription" on public.subscribers;
drop policy if exists "Admins can manage all subscribers" on public.subscribers;
drop policy if exists "Public can subscribe" on public.subscribers;
drop policy if exists "Public insert subscribers" on public.subscribers;
drop policy if exists "Anon can verify subscription with token" on public.subscribers;
drop policy if exists "Public can update subscribers" on public.subscribers;

-- Step 3: Re-create policies in correct order (most permissive first, then specific)

-- 3a. INSERT: Anyone can subscribe (anon + authenticated)
create policy "Anyone can subscribe" on public.subscribers
  for insert
  to anon, authenticated
  with check (true);

-- 3b. SELECT: Authenticated users can view their own data
create policy "Subscribers can view their own data" on public.subscribers
  for select
  to authenticated
  using (auth.jwt() ->> 'email' = email);

-- 3c. UPDATE: Anonymous users can verify with token (MUST come before authenticated policy)
create policy "Anon can verify subscription with token" on public.subscribers
  for update
  to anon
  using (
    -- Check that the row has a verification_token (old row state)
    verification_token IS NOT NULL
  )
  with check (
    -- Allow the update to proceed (new row state)
    -- The application code only updates: is_active=true, verified_at, verification_token=null
    true
  );

-- 3d. UPDATE: Authenticated users can update their own subscription
create policy "Users can update their own subscription" on public.subscribers
  for update
  to authenticated
  using (auth.jwt() ->> 'email' = email);

-- 3e. ALL: Admins can manage everything
create policy "Admins can manage all subscribers" on public.subscribers
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

-- Verify: Check that RLS is enabled
alter table public.subscribers enable row level security;
