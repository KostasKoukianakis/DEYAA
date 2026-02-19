-- EMERGENCY FIX: Simple and direct fix for anonymous email verification
-- Run this in Supabase SQL Editor RIGHT NOW to fix the 406 error

-- Step 1: Grant UPDATE privilege to anon (this is critical!)
GRANT UPDATE ON TABLE public.subscribers TO anon;

-- Step 2: Drop the problematic policy if it exists
DROP POLICY IF EXISTS "Anon can verify subscription with token" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;

-- Step 3: Create a SIMPLE policy that allows anon to update when verification_token exists
CREATE POLICY "Anon can verify subscription with token"
ON public.subscribers
FOR UPDATE
TO anon
USING (verification_token IS NOT NULL)
WITH CHECK (true);

-- Step 4: Re-create authenticated user policy (so authenticated users can still update)
CREATE POLICY "Users can update their own subscription"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' = email);

-- Step 5: Verify RLS is enabled
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- VERIFICATION: Run this query to check if the policy was created:
-- SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'subscribers' AND policyname = 'Anon can verify subscription with token';
