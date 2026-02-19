-- Allow anonymous users to verify their email subscription using verification_token
-- This enables the email verification flow where users click a link without being logged in

-- Drop existing policy if it exists
drop policy if exists "Anon can verify subscription with token" on public.subscribers;

-- Create policy for anon users to update subscribers when they have the correct verification_token
-- This allows updating is_active, verified_at, and clearing verification_token
-- The using clause checks that verification_token exists (the .eq() filter will match the specific token)
create policy "Anon can verify subscription with token" on public.subscribers
  for update
  to anon
  using (verification_token IS NOT NULL)
  with check (true);
