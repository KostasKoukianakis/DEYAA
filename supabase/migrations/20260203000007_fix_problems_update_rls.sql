-- Fix RLS policy for problems table to allow authenticated users to update all problems
-- This is needed because problems from anonymous users have reported_by = null
-- and authenticated users (admins) need to be able to approve and update them

-- Step 1: Drop existing update policy
DROP POLICY IF EXISTS "Problems are updatable by reporters, assignees and admins" ON public.problems;

-- Step 2: Create new policy that allows authenticated users to update all problems
-- This allows admins to approve and manage problems from anonymous users
CREATE POLICY "Problems are updatable by authenticated users"
ON public.problems
FOR UPDATE
TO authenticated
USING (true) -- All authenticated users can update (since any authenticated user is admin in this system)
WITH CHECK (true);

-- Step 3: Ensure authenticated users have UPDATE privilege
GRANT UPDATE ON TABLE public.problems TO authenticated;
