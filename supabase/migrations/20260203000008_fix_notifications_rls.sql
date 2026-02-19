-- Fix RLS policy for notifications table to allow authenticated users to manage notifications
-- Since any authenticated user is admin in this system, we allow all authenticated users

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Only admins can view notifications" ON public.notifications;
DROP POLICY IF EXISTS "Only admins can manage notifications" ON public.notifications;

-- Step 2: Create new policies that allow authenticated users
-- SELECT: Allow authenticated users to view all notifications
CREATE POLICY "Authenticated users can view notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (true);

-- INSERT: Allow authenticated users to create notifications
CREATE POLICY "Authenticated users can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- UPDATE: Allow authenticated users to update notifications
CREATE POLICY "Authenticated users can update notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- DELETE: Allow authenticated users to delete notifications
CREATE POLICY "Authenticated users can delete notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (true);

-- Step 3: Ensure authenticated users have all privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notifications TO authenticated;
